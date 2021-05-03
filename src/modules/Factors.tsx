import { BanIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { FunctionComponent, memo } from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { FactorsData } from '../types';
import { Metric } from '../ui/Metric';
import { Ring } from '../ui/Ring';
import { SmallMessage } from '../ui/SmallMessage';
import styles from './styles/Factors.module.css';

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

const metricMapping: Record<
	typeof factorsKeys[number],
	{ colour: string; label: string }
> = {
	economy: { label: 'Economy', colour: '#10B981' },
	family: { label: 'Family', colour: '#D97706' },
	health: { label: 'Health', colour: '#EF4444' },
	freedom: { label: 'Freedom', colour: '#FBBF24' },
	generosity: { label: 'Generosity', colour: '#7C3AED' },
	trust: { label: 'Trust', colour: '#EC4899' },
} as const;
const metricMappingIterable = Object.entries(metricMapping) as Array<
	[
		keyof typeof metricMapping,
		typeof metricMapping[keyof typeof metricMapping],
	]
>;

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
			{metricMappingIterable.map(([key, prop]) => (
				<Metric key={key} label={prop.label} className={styles.metric}>
					<Ring
						value={calcPercent(factors[key])}
						label={calcLabel(factors[key])}
						colour={prop.colour}
					/>
				</Metric>
			))}
		</div>
	);
};

export const FactorsError = memo(() => (
	<SmallMessage error={true}>
		<BanIcon />
		Failed to retrieve factors, please login.
	</SmallMessage>
));
