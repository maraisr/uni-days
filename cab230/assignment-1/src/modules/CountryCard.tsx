import {
	DotsHorizontalIcon,
	ExclamationIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from '@heroicons/react/outline';
import { AsyncBoundary } from 'async-boundary';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { memo } from 'react';
import { useAuth } from '../lib/auth';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { isIncreasingSequence } from '../lib/helpers';
import type { RankData } from '../types';
import { Metric } from '../ui/Metric';
import { Ring } from '../ui/Ring';
import { SmallMessage } from '../ui/SmallMessage';
import { Spinner } from '../ui/Spinner';
import { Spline } from '../ui/Spline';
import { Factors, FactorsError } from './Factors';
import styles from './styles/CountryCard.module.css';

const splineDataLoader = defineLoader<{ country: string }, RankData[]>({
	family: 'countrycard.trend',
	getKey({ country }) {
		return country;
	},
	getData({ country }, api) {
		return api.rankings({ country });
	},
});

/**
 * Sorts rank data by year descending
 */
const sortByYear = (data: RankData[]) => data.sort((a, b) => a.year - b.year);

const TrendingIndicator = memo<{ country: string }>(({ country }) => {
	const data = useDataLoader(splineDataLoader, { country });

	const points = sortByYear(data).map((i) => i.rank);
	return points.length > 1 ? (
		isIncreasingSequence(points) ? (
			<TrendingUpIcon width="1rem" color="#10B981" />
		) : (
			<TrendingDownIcon width="1rem" color="#EF4444" />
		)
	) : null;
});

const SplineData = memo<{ country: string; year: number }>(
	({ country, year }) => {
		const data = useDataLoader(splineDataLoader, { country });

		const points = sortByYear(data);
		// mark point is which year we should _highlight_ or "mark"
		const markPoint = points.findIndex((i) => i.year === year);

		return points.length > 1 ? (
			<Metric label={`${points.length} year trend`} alignLeft>
				<Spline
					points={points.map((i) => i.rank)}
					markPoint={markPoint}
				/>
			</Metric>
		) : null;
	},
);

const SplineLoader = (
	<Metric label="10 year trend" alignLeft>
		<Spline loading points={[2, 1, 5, 1, 3, 3, 6, 5, 3, 7]} />
	</Metric>
);

/**
 * The main "card" component that tells the country story.
 */
export const CountryCard: FunctionComponent<{ data: RankData }> = ({
	data,
}) => {
	const { isAuthenticated } = useAuth();

	const score = Number.parseFloat(data.score);
	const scorePercent = score / 10;

	return (
		<div className={styles.component}>
			<div className={styles.headline}>
				<AsyncBoundary
					fallback={
						<DotsHorizontalIcon width="1rem" color="#EEEEEE" />
					}
					errorFallback={null}
				>
					<TrendingIndicator country={data.country} />
				</AsyncBoundary>
				<div className={styles.name}>
					<span className={styles.country}>{data.country}</span>
					<span className={styles.year}>{data.year}</span>
				</div>
				<div className={styles.rank}>
					<span>#</span>
					{data.rank}
				</div>
			</div>
			<div className={styles.metrics}>
				<AsyncBoundary fallback={SplineLoader} errorFallback={null}>
					<SplineData country={data.country} year={data.year} />
				</AsyncBoundary>
				<Metric label="Happiness score">
					<Ring value={scorePercent} label={score.toFixed(2)} />
				</Metric>
			</div>
			{isAuthenticated ? (
				<AsyncBoundary
					fallback={<Spinner />}
					errorFallback={FactorsError}
				>
					<Factors country={data.country} year={data.year} />
				</AsyncBoundary>
			) : (
				<SmallMessage>
					<ExclamationIcon />
					Login to see factors.
				</SmallMessage>
			)}
		</div>
	);
};
