import { BanIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { FunctionComponent, memo } from 'react';
import { defineLoader, useDataLoader } from '../lib/dataLoader';
import { FactorsData } from '../types';
import { Metric } from '../ui/Metric';
import { Ring } from '../ui/Ring';
import { SmallMessage } from '../ui/SmallMessage';
import styles from './styles/Factors.module.css';

const factorsKeys = [
	'economy',
	'family',
	'health',
	'freedom',
	'generosity',
	'trust',
] as const;

/**
 * Maps the metric to a label + colour
 */
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
>; // sigh.. Object.entries isn't type-safe.

const factorsDataLoader = defineLoader<
	{ country: string; year: string },
	FactorsData[]
>({
	family: 'factors.country',
	getKey({ country, year }) {
		return country + year;
	},
	getData({ country, year }, api) {
		return api.factors({ country, year }).then((factors) =>
			// We need to parse the factor keys as numbers, api returns strings
			factors.map((factor: any) =>
				factorsKeys.reduce(
					(acc, factorItem) => ({
						...acc,
						[factorItem]: Number.parseFloat(factor[factorItem]),
					}),
					factor as FactorsData,
				),
			),
		);
	},
});

/**
 * Factors is the component that paints pretty rings for each of the contributing factoring. Component requires auth,
 * if failing to auth this will Suspend with an error.
 */
export const Factors: FunctionComponent<{ country: string; year: number }> = ({
	country,
	year,
}) => {
	const [factors] = useDataLoader(factorsDataLoader, {
		country,
		year: year.toString(),
	});

	// Factors is calculated by seeing how much it had contributed to the score minus dystopia
	// @see
	// https://worldhappiness.report/faq/#what-is-the-original-source-of-the-data-for-figure-21-how-are-the-rankings-calculated
	const outOf = factorsKeys.reduce((acc, i) => acc + factors[i], 0);

	const calcLabel = (value: number) => value.toFixed(2);
	const calcPercent = (value: number) => value / outOf;

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
