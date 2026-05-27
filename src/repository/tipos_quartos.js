import { BaseDao } from './baseDao.js';

class TipoQuartoDao extends BaseDao {
    async getTiposQuartos() {
        const sql = `
            SELECT *
            FROM tipos_quartos
        `;

        const [rows] = await this.DB.query(sql);

        return rows || [];
    }

    async getTipoQuarto(id) {
        const sql = `
            SELECT 1
            FROM tipos_quartos
            WHERE id = ?
        `;

        const [rows] = await this.DB.query(sql, [id]);

        return rows[0] || null;
    }

    async setTipoQuarto(data) {
        const sql = `
            INSERT INTO tipos_quartos(
                nome,
                descricao,
                capacidade,
                valor_diaria)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await this.DB.execute(sql, [
            data.nome,
            data.descricao,
            data.capacidade || 0,
            data.valor_diaria,
        ]);

        return result.insertId;
    }

    async updateTipoQuarto(data) {
        const campos = [];
        const valores = [];

        if (data.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(data.nome);
        }

        if (data.descricao !== undefined) {
            campos.push('descricao = ?');
            valores.push(data.descricao);
        }

        if (data.capacidade !== undefined) {
            campos.push('capacidade = ?');
            valores.push(data.capacidade);
        }
        if (data.valor_diaria !== undefined) {
            campos.push('valor_diaria = ?');
            valores.push(data.valor_diaria);
        }
        if (campos.length === 0) {
            return false;
        }

        valores.push(data.id);

        const sql = `
            UPDATE tipos_quartos
            SET ${campos.join(', ')}

            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, valores);

        return result.affectedRows > 0;
    }

    async deleteTipoQuarto(id) {
        const sql = `
            DELETE FROM tipos_quartos
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}
const tq = new TipoQuartoDao();
await tq.setTipoQuarto({
    nome: 'suite',
    descricao: 'suite de luxo',
    valor_diaria: 1000,
    capacidade: 3,
});
console.log(await tq.getTiposQuartos())
export { TipoQuartoDao };
