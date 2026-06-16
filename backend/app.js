import express from 'express';
import cors from 'cors';

import { routes } from './src/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});