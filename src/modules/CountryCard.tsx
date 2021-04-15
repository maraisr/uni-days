import { ExclamationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { useAuth } from '../lib/auth';
import type { RankData } from '../types';
import styles from './CountryCard.module.css';
import { Ring } from './Ring';
import { Spline } from './Spline';

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
				<Metric label={'5 year trend'} alignLeft>
					<Spline
						points={[120, 60, 80, 20, 80, 80, 0, 100, 100, 120, 80]}
					/>
				</Metric>
				<Metric label={'Cumulative score'}>
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
