import { readFileSync } from 'fs';
import conexao from './conexao.js';

const schemaSQL = readFileSync(new URL('./hotel.sql', import.meta.url), 'utf8');

const functionsSQL = readFileSync(
    new URL('./functions.sql', import.meta.url),
    'utf8',
);

const queries = schemaSQL
    .split(/;\s*\n/)
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

export default async function initDatabase() {
    try {
        // tabelas
        for (const query of queries) {
            await conexao.query(query);
        }

        // procedures/functions/triggers
        await conexao.query(functionsSQL);

        console.log('Banco inicializado com sucesso.');
    } catch (erro) {
        console.error('Erro ao inicializar banco:', erro);
        throw erro;
    }
}

await initDatabase();
