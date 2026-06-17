import { readFileSync } from 'fs';
import conexao from './conexao.js';

const tabelasSQL = readFileSync(
	new URL('./sql/tabelas.sql', import.meta.url),
	'utf8',
);

async function initDatabase() {
	try {
		await conexao.query(tabelasSQL);
		console.log('Banco inicializado com sucesso.');
		process.exit(0);
	} catch (error) {
		console.error('Erro ao inicializar banco:', error);
		process.exit(1);
	}
}

await initDatabase();
