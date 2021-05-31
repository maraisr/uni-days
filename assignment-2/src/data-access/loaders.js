import Dataloader from 'dataloader';
import { rankings } from './database.js';

export const loaders = {
	rankings: new Dataloader(
		(ids) =>
			rankings()
				.select('ID', 'rank', 'country', 'score', 'year')
				.whereIn('ID', ids)
				.then((rows) =>
					ids.map((id) => {
						const object = Object.assign(
							{},
							rows.find((x) => x.ID === id),
						);

						delete object.ID;

						return object;
					}),
				),
		{
			cache: true,
		},
	),
};
