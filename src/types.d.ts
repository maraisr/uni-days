export type RankData = {
	rank: number;
	country: string;
	score: string;
	year: number;
};

export type FactorsData = {
	economy: number;
	family: number;
	health: number;
	freedom: number;
	generosity: number;
	trust: number;
} & Exclude<RankData, 'year'>;
