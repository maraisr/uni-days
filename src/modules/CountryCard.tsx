import * as React from 'react';
import type { FunctionComponent } from 'react';
import type { RankData } from '../types';
import styles from './CountryCard.module.css';
import { Ring } from './Ring';

export const CountryCard: FunctionComponent<{ data: RankData }> = ({
	data,
}) => {
	const score_percent = Number.parseFloat(data.score) / 10;

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
				<div>spline</div>
				<div>
					<Ring
						value={score_percent}
						label={`${(score_percent * 100).toFixed(1)}%`}
					/>
				</div>
			</div>
			<div className={styles.cta}>
				<button>View Factors</button>
			</div>
		</div>
	);
};
