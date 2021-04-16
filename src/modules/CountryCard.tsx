import {
	BanIcon,
	DotsHorizontalIcon,
	ExclamationIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from '@heroicons/react/outline';
import { AsyncBoundary } from 'async-boundary';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { memo } from 'react';
import { useAuth } from '../lib/auth';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { isIncreasingSequence } from '../lib/helpers';
import type { FactorsData, RankData } from '../types';
import styles from './CountryCard.module.css';
import { Ring } from './Ring';
import { Spinner } from './Spinner';
import { Spline } from './Spline';

const splineDataLoader = defineLoader<{ country: string }, RankData[]>({
	family: 'ranking.country.trend',
	getKey({ country }) {
		return country;
	},
	getData({ country }, api) {
		return api.rankings({ country });
	},
});

const factorsDataLoader = defineLoader<
	{ country: string; year: string },
	FactorsData[]
>({
	family: 'factors.country',
	getKey({ country, year }) {
		return country + year;
	},
	getData({ country, year }, api) {
		return api.factors({ country, year });
	},
});

const sortByYear = (data: RankData[]) =>
	data.sort((a, b) => {
		return a.year - b.year;
	});

const Metric: FunctionComponent<{ label: string; alignLeft?: boolean }> = ({
	label,
	alignLeft = false,
	children,
}) => (
	<div className={clsx(styles.metric, alignLeft && styles.left)}>
		{children}
		<span>{label}</span>
	</div>
);

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

const SplineData = memo<{ country: string }>(({ country }) => {
	const data = useDataLoader(splineDataLoader, { country });

	const points = sortByYear(data).map((i) => i.rank);
	return points.length > 1 ? (
		<Metric label={`${points.length} year trend`} alignLeft>
			<Spline points={points} />
		</Metric>
	) : null;
});

const Factors: FunctionComponent<{ country: string; year: number }> = ({
	country,
	year,
}) => {
	const data = useDataLoader(factorsDataLoader, {
		country,
		year: year.toString(),
	})[0];

	const score = Number.parseFloat(data.score);

	// Number is how much it had contributed to the score
	// @see
	// https://worldhappiness.report/faq/#what-is-the-original-source-of-the-data-for-figure-21-how-are-the-rankings-calculated
	const calcLabel = (value: number) => ((value / score) * 10).toFixed(1);

	return (
		<div className={styles.factors}>
			<Metric label={'Economy'}>
				<Ring
					value={data.economy / score}
					label={calcLabel(data.economy)}
					colour={'#10B981'}
				/>
			</Metric>
			<Metric label={'Family'}>
				<Ring
					value={data.family / score}
					label={calcLabel(data.family)}
					colour={'#D97706'}
				/>
			</Metric>
			<Metric label={'Health'}>
				<Ring
					value={data.health / score}
					label={calcLabel(data.health)}
					colour={'#EF4444'}
				/>
			</Metric>
			<Metric label={'Freedom'}>
				<Ring
					value={data.freedom / score}
					label={calcLabel(data.freedom)}
					colour={'#FBBF24'}
				/>
			</Metric>
			<Metric label={'Generosity'}>
				<Ring
					value={data.generosity / score}
					label={calcLabel(data.generosity)}
					colour={'#7C3AED'}
				/>
			</Metric>
			<Metric label={'Trust'}>
				<Ring
					value={data.trust / score}
					label={calcLabel(data.trust)}
					colour={'#EC4899'}
				/>
			</Metric>
		</div>
	);
};

const FactorsError = memo(() => (
	<p className={clsx(styles.small, styles.smallError)}>
		<BanIcon />
		Failed to retrieve factors, please login.
	</p>
));

const SplineLoader = memo(() => (
	<Metric label="10 year trend" alignLeft>
		<Spline loading points={[2, 1, 5, 1, 3, 3, 6, 5, 3, 7]} />
	</Metric>
));

export const CountryCard: FunctionComponent<{ data: RankData }> = ({
	data,
}) => {
	const { isAuthenticated } = useAuth();

	const score = Number.parseFloat(data.score);
	const score_percent = score / 10;

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
				<AsyncBoundary fallback={<SplineLoader />} errorFallback={null}>
					<SplineData country={data.country} />
				</AsyncBoundary>
				<Metric label="Happiness score">
					<Ring value={score_percent} label={score.toFixed(1)} />
				</Metric>
			</div>
			{isAuthenticated() ? (
				<AsyncBoundary
					fallback={<Spinner />}
					errorFallback={FactorsError}
				>
					<Factors country={data.country} year={data.year} />
				</AsyncBoundary>
			) : (
				<p className={styles.small}>
					<ExclamationIcon />
					Login to see factors
				</p>
			)}
		</div>
	);
};
