import express from 'express';
import cors from 'cors';

import { routes } from './src/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

// Middleware global de erro
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 400).json({
        sucesso: false,
        mensagem: err.message || 'Erro interno do servidor'
    });
});

app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});