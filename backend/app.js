import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pool from './config/conexao.js';
import { routes } from './src/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 400).json({
		sucesso: false,
		mensagem: err.message || 'Erro interno do servidor',
	});
});

app.listen(8080, () => {
	console.log('Servidor rodando em http://localhost:8080');
});

async function popularBancoAutomatico() {
	try {
		const [tipos] = await pool.query('SELECT COUNT(*) AS total FROM tipos_quartos');

		if (tipos[0].total === 0) {
			await pool.query(`
				INSERT INTO tipos_quartos (id, nome, descricao, capacidade, valor_diaria, ativo) VALUES
				(1, 'Standard', 'Quarto padrão confortável', 2, 100.00, TRUE),
				(2, 'Luxo', 'Quarto luxo com vista e hidromassagem', 3, 150.00, TRUE),
				(3, 'Premium', 'Suíte master premium com tudo incluso', 4, 250.00, TRUE)
			`);
		}

		const [formas] = await pool.query('SELECT COUNT(*) AS total FROM formas_pagamento');

		if (formas[0].total === 0) {
			await pool.query(`
				INSERT INTO formas_pagamento (id, nome, ativo) VALUES
				(1, 'Dinheiro', TRUE),
				(2, 'Cartão de crédito', TRUE),
				(3, 'Cartão de débito', TRUE),
				(4, 'Pix', TRUE)
			`);
		}


		const [funcionarios] = await pool.query('SELECT COUNT(*) AS total FROM funcionarios');

		if (funcionarios[0].total === 0) {
			const senhaHash = await bcrypt.hash('123', 10);
			await pool.execute(
				`
					INSERT INTO funcionarios (
						nome,
						email,
						telefone,
						data_nascimento,
						senha,
						ativo
					)
					VALUES (?, ?, ?, ?, ?, TRUE)
				`,
				['Administrador', 'admin@hotel.com', null, '2000-01-01', senhaHash],
			);
		}
	} catch (erro) {
		console.error('Falha ao verificar/popular carga inicial do banco:', erro.message);
	}
}

popularBancoAutomatico();
