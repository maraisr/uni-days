import { BanIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { FunctionComponent, memo } from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { FactorsData } from '../types';
import styles from './Factors.module.css';
import { Metric } from './Metric';
import { Ring } from './Ring';
import { SmallMessage } from './SmallMessage';

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

const factorsKeys = [
	'economy',
	'family',
	'health',
	'freedom',
	'generosity',
	'trust',
] as const;

export const Factors: FunctionComponent<{ country: string; year: number }> = ({
	country,
	year,
}) => {
	const data = useDataLoader(factorsDataLoader, {
		country,
		year: year.toString(),
	})[0];

	// Number is how much it had contributed to the score - dystopia
	// @see
	// https://worldhappiness.report/faq/#what-is-the-original-source-of-the-data-for-figure-21-how-are-the-rankings-calculated
	const factors = factorsKeys.reduce(
		(acc, i) => ({
			...acc,
			[i]: Number.parseFloat(data[i]),
		}),
		{} as Record<typeof factorsKeys[number], number>,
	);
	const out_of = factorsKeys.reduce((acc, i) => acc + factors[i], 0);

	const calcLabel = (value: number) => value.toFixed(2);
	const calcPercent = (value: number) => value / out_of;

	return (
		<div className={styles.component}>
			<Metric label={'Economy'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['economy'])}
					label={calcLabel(factors['economy'])}
					colour={'#10B981'}
				/>
			</Metric>
			<Metric label={'Family'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['family'])}
					label={calcLabel(factors['family'])}
					colour={'#D97706'}
				/>
			</Metric>
			<Metric label={'Health'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['health'])}
					label={calcLabel(factors['health'])}
					colour={'#EF4444'}
				/>
			</Metric>
			<Metric label={'Freedom'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['freedom'])}
					label={calcLabel(factors['freedom'])}
					colour={'#FBBF24'}
				/>
			</Metric>
			<Metric label={'Generosity'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['generosity'])}
					label={calcLabel(factors['generosity'])}
					colour={'#7C3AED'}
				/>
			</Metric>
			<Metric label={'Trust'} className={styles.metric}>
				<Ring
					value={calcPercent(factors['trust'])}
					label={calcLabel(factors['trust'])}
					colour={'#EC4899'}
				/>
			</Metric>
		</div>
	);
};

export const FactorsError = memo(() => (
	<SmallMessage error={true}>
		<BanIcon />
		Failed to retrieve factors, please login.
	</SmallMessage>
));
