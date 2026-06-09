import { readFileSync } from 'fs';
import conexao from './conexao.js';

const tabelasSQL = readFileSync(
	new URL('./sql/tabelas.sql', import.meta.url),
	'utf8',
);

const addFuncionarioSQL = readFileSync(
	new URL('./sql/adicionar_funcionario.sql', import.meta.url),
	'utf8',
);

const updateFuncionarioSQL = readFileSync(
	new URL('./sql/atualizar_funcionario.sql', import.meta.url),
	'utf8',
);

async function initDatabase() {
	try {
		await conexao.query(tabelasSQL);

		await conexao.query('DROP PROCEDURE IF EXISTS add_funcionario');
		await conexao.query(addFuncionarioSQL);

		await conexao.query('DROP PROCEDURE IF EXISTS update_funcionario');
		await conexao.query(updateFuncionarioSQL);

		console.log('Banco inicializado com sucesso.');
		process.exit(0);
	} catch (error) {
		console.error('Erro ao inicializar banco:', error);
		process.exit(1);
	}
}

await initDatabase();
