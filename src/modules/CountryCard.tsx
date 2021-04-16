import { ExclamationIcon } from '@heroicons/react/outline';
import { AsyncBoundary } from 'async-boundary';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { memo } from 'react';
import { useAuth } from '../lib/auth';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import type { RankData } from '../types';
import styles from './CountryCard.module.css';
import { Ring } from './Ring';
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

const SplineData: FunctionComponent<{ country: string }> = ({ country }) => {
	const data = useDataLoader(splineDataLoader, { country });

	const points = data.map((i) => i.rank);
	return points.length > 1 ? (
		<Metric label={`${points.length} year trend`} alignLeft>
			<Spline points={points} />
		</Metric>
	) : null;
};

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
				<Metric label={'Happiness score'}>
					<Ring value={score_percent} label={score.toFixed(1)} />
				</Metric>
			</div>
			{isAuthenticated ? (
				<div className={styles.factors}>
					<Metric label={'Economy'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#10B981'}
						/>
					</Metric>
					<Metric label={'Family'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#D97706'}
						/>
					</Metric>
					<Metric label={'Health'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#EF4444'}
						/>
					</Metric>
					<Metric label={'Freedom'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#FBBF24'}
						/>
					</Metric>
					<Metric label={'Generosity'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#7C3AED'}
						/>
					</Metric>
					<Metric label={'Trust'}>
						<Ring
							value={score_percent}
							label={'1.2'}
							colour={'#EC4899'}
						/>
					</Metric>
				</div>
			) : (
				<p className={styles.small}>
					<ExclamationIcon />
					Login to see factors
				</p>
			)}
		</div>
	);
};
