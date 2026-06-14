import express from 'express';
import cors from 'cors';

import { routes } from './routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.listen(8080, () => {
	console.log('Servidor rodando em http://localhost:8080');
});
