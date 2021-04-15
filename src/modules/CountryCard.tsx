import { ExclamationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { useAuth } from '../lib/auth';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import type { RankData } from '../types';
import styles from './CountryCard.module.css';
import { Ring } from './Ring';
import { Spline } from './Spline';

export type CountryCardData = Aggregate & RankData;

interface Aggregate {
	points: number[];
}

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

export const CountryCard: FunctionComponent<{ data: CountryCardData }> = ({
	data,
}) => {
	const { isAuthenticated } = useAuth();
	const score = Number.parseFloat(data.score);
	const score_percent = score / 10;

	const has_spline = data.points.length > 1;

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
			<div
				className={clsx(styles.metrics, !has_spline && styles.noSpline)}
			>
				{has_spline ? (
					<Metric
						label={`${data.points.length} year trend`}
						alignLeft
					>
						<Spline reverse points={data.points} />
					</Metric>
				) : null}
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
