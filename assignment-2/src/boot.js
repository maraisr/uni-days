import { createServer } from 'https';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { readFile } from 'fs/promises';

import { bootstrap } from './app.js';
import { error_middleware } from './middleware/error_middleware.js';

const app = express();

app.use(
	helmet(),
	cors(),
	morgan(
		'~> [:method] :url -> :status :res[content-length] - :response-time ms',
	),
	express.json(),
);

await bootstrap(app);

app.use(error_middleware);

const port = process.env.PORT || 3000;

createServer(
	{
		key: await readFile('ssl/app.key'),
		cert: await readFile('ssl/app.crt'),
	},
	app,
).listen(port, (e) => {
	if (e) throw e;
	console.log(`~> application ready on port :${port}`);
});
