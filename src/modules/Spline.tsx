import type { FunctionComponent } from 'react';
import * as React from 'react';

type CoordTuple = [x: number, y: number];

const WIDTH = 120;
const HEIGHT = 35;
const STROKE_WIDTH = 2;
const SMOOTHING = 0.2;

// Line smoothing taken from: https://codepen.io/francoisromain/pen/dzoZZj

const line = (pointA: CoordTuple, pointB: CoordTuple) => {
	const lengthX = pointB[0] - pointA[0];
	const lengthY = pointB[1] - pointA[1];
	return {
		length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
		angle: Math.atan2(lengthY, lengthX),
	};
};

const controlPoint = (
	current: CoordTuple,
	previous: CoordTuple,
	next: CoordTuple,
	reverse: boolean = false,
) => {
	const p = previous || current;
	const n = next || current;

	const o = line(p, n);

	const angle = o.angle + (reverse ? Math.PI : 0);
	const length = o.length * SMOOTHING;

	const x = current[0] + Math.cos(angle) * length;
	const y = current[1] + Math.sin(angle) * length;
	return [x, y];
};

const svgPath = (points: CoordTuple[]) => {
	const bezier = (point: CoordTuple, i: number, points: CoordTuple[]) => {
		const cps = controlPoint(points[i - 1], points[i - 2], point);
		const cpe = controlPoint(point, points[i - 1], points[i + 1], true);
		return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
	};

	return points.reduce(
		(acc, point, i, a) =>
			i === 0
				? `M ${point[0]},${point[1]}`
				: `${acc} ${bezier(point, i, a)}`,
		'',
	);
};

export const Spline: FunctionComponent<{
	points: number[];
	loading?: boolean;
}> = ({ points, loading }) => {
	const max = Math.max(...points);
	const interval = WIDTH / points.length;

	const coords: CoordTuple[] = points.map((v, i) => [
		interval * i,
		(v / max) * HEIGHT,
	]);

	return (
		<svg viewBox={`-8 -8 ${WIDTH + 8} ${HEIGHT + 16}`}>
			<path
				fill="none"
				stroke={loading ? '#EEEEEE' : '#0062FF'}
				strokeWidth={STROKE_WIDTH}
				strokeLinejoin="round"
				strokeLinecap="round"
				d={svgPath(coords)}
			/>
		</svg>
	);
};
