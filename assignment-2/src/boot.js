import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { bootstrap } from './app.js';
import { error_middleware } from './middleware/error_middleware.js';
import { accepts } from './middleware/accepts.js';

const app = express();

app.use(
	helmet(),
	cors(),
	morgan(
		'~> [:method] :url -> :status :res[content-length] - :response-time ms',
	),
	accepts,
	express.json(),
);

await bootstrap(app);

app.use(error_middleware);

const port = process.env.PORT || 3000;
app.listen(port, (e) => {
	if (e) throw e;
	console.log(`~> application ready on port :${port}`);
});
