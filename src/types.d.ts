export type RankData = {
	rank: number;
	country: string;
	score: string;
	year: number;
};

export type FactorsData = {
	economy: string;
	family: string;
	health: string;
	freedom: string;
	generosity: string;
	trust: string;
} & Exclude<RankData, 'year'>;
