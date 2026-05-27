import { BaseDao } from './baseDao.js';

class ConsumoDao extends BaseDao {
    async getConsumos() {
        const sql = `
            SELECT
                c.id,
                c.descricao,
                c.valor_total,
                c.estado,
                c.data_criacao,
                c.id_reserva AS reserva,
                s.nome AS servico,
                r.numero_quarto

            FROM consumos AS c

            INNER JOIN servicos s
                ON s.id = c.id_servico

            INNER JOIN reservas r
                ON r.id = c.id_reserva
        `;

        const [rows] = await this.DB.query(sql);

        return rows || [];
    }

    async getConsumo(id) {
        const sql = `
            SELECT
                c.id,
                c.descricao,
                c.valor_total,
                c.estado,
                c.data_criacao,
                c.id_reserva AS reserva,
                s.nome AS servico,
                r.numero_quarto

            FROM consumos AS c

            INNER JOIN servicos s
                ON s.id = c.id_servico

            INNER JOIN reservas r
                ON r.id = c.id_reserva

            WHERE c.id = ?
        `;

        const [rows] = await this.DB.execute(sql, [id]);

        return rows[0] || null;
    }

    async setConsumo(data) {
        const sql = `
            INSERT INTO consumos (
                id_reserva,
                id_servico,
                descricao,
                valor_total
            )
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await this.DB.execute(sql, [
            data.id_reserva,
            data.id_servico,
            data.descricao,
            data.valor_total,
        ]);

        return result.insertId;
    }

    async updateConsumo(data) {
        const campos = [];
        const valores = [];

        if (data.id_reserva !== undefined) {
            campos.push('id_reserva = ?');
            valores.push(data.id_reserva);
        }

        if (data.id_servico !== undefined) {
            campos.push('id_servico = ?');
            valores.push(data.id_servico);
        }

        if (data.descricao !== undefined) {
            campos.push('descricao = ?');
            valores.push(data.descricao);
        }

        if (data.valor_total !== undefined) {
            campos.push('valor_total = ?');
            valores.push(data.valor_total);
        }

        if (data.estado !== undefined) {
            campos.push('estado = ?');
            valores.push(data.estado);
        }

        if (campos.length === 0) {
            return false;
        }

        valores.push(data.id);

        const sql = `
            UPDATE consumos
            SET ${campos.join(', ')}

            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, valores);

        return result.affectedRows > 0;
    }

    async deleteConsumo(id) {
        const sql = `
            DELETE FROM consumos
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}

export { ConsumoDao };
