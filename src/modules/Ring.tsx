import type { FunctionComponent } from 'react';
import * as React from 'react';

import styles from './Ring.module.css';

const SIZE = 250;
const STROKE_WIDTH = 16;
const center = SIZE / 2;
const radius = SIZE / 2 - STROKE_WIDTH / 2;
const circumference = 2 * Math.PI * radius;

export const Ring: FunctionComponent<{
	value: number;
	label?: string;
	colour?: string;
}> = ({ value, label, colour = '#0062FF' }) => (
	<figure className={styles.component}>
		<svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
			<circle
				stroke={colour}
				opacity={0.1}
				fill="transparent"
				strokeWidth={STROKE_WIDTH}
				r={radius}
				cx={center}
				cy={center}
			/>
			<circle
				stroke={colour}
				fill="transparent"
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeWidth={STROKE_WIDTH}
				r={radius}
				cx={center}
				cy={center}
				strokeDashoffset={circumference - value * circumference}
			/>
		</svg>
		{label ? <figcaption>{label}</figcaption> : null}
	</figure>
);
