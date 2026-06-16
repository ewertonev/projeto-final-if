import express from 'express';
import cors from 'cors';
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
        mensagem: err.message || 'Erro interno do servidor'
    });
});

app.listen(8080, () => {
    console.log('Servidor rodando em http://localhost:8080');
});


async function popularBancoAutomatico() {
    try {
        const [linhas] = await pool.query('SELECT COUNT(*) as total FROM tipos_quartos');
        
        if (linhas[0].total === 0) {
            console.log('🌱 Banco de dados novo detectado! Inserindo categorias iniciais...');
            
            await pool.query(`INSERT IGNORE INTO papeis(id, nome) VALUES (1, "Gerente"), (2, "Recepcionista")`);
            
            await pool.query(`
                INSERT INTO tipos_quartos (id, nome, descricao, capacidade, valor_diaria, ativo) VALUES 
                (1, 'Standard', 'Quarto padrão confortável', 2, 100.00, 1),
                (2, 'Luxo', 'Quarto luxo com vista e hidromassagem', 3, 150.00, 1),
                (3, 'Premium', 'Suíte master premium com tudo incluso', 4, 250.00, 1)
            `);
            console.log('✅ Categorias e papéis inseridos com sucesso!');
        }
    } catch (erro) {
        console.error('⚠️ Falha ao verificar/popular carga inicial do banco:', erro.message);
    }
}

popularBancoAutomatico();