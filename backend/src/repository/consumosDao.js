import { BaseDao } from './baseDao.js';

export class ConsumoDao extends BaseDao {
    consultaBase(where = '') {
        return `
            SELECT
                c.id,
                c.id_reserva,
                c.id_servico,
                c.forma_pagamento,
                c.descricao,
                c.valor_unitario,
                c.quantidade,
                (c.valor_unitario * c.quantidade) AS valor_total,
                c.estado,
                c.data_criacao,

                s.nome AS servico,
                fp.nome AS forma_pagamento_nome,

                q.id AS id_quarto,
                q.numero AS quarto

            FROM consumos AS c

            INNER JOIN servicos AS s
                ON s.id = c.id_servico

            LEFT JOIN formas_pagamento AS fp
                ON fp.id = c.forma_pagamento

            INNER JOIN reservas AS r
                ON r.id = c.id_reserva

            INNER JOIN quartos AS q
                ON q.id = r.id_quarto

            ${where}
        `;
    }

    async getConsumos() {
        const sql = this.consultaBase();
        const [rows] = await this.DB.query(sql);

        return rows;
    }

    async getConsumosPorReserva(id_reserva) {
        const sql = this.consultaBase(`
            WHERE c.id_reserva = ?
        `);

        const [rows] = await this.DB.execute(sql, [id_reserva]);

        return rows;
    }

    async getConsumo(id) {
        const sql = this.consultaBase(`
            WHERE c.id = ?
        `);

        const [rows] = await this.DB.execute(sql, [id]);

        return rows[0] || null;
    }

    async setConsumo(data) {
        const sql = `
            INSERT INTO consumos (
                id_reserva,
                id_servico,
                forma_pagamento,
                descricao,
                valor_unitario,
                quantidade
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await this.DB.execute(sql, [
            data.id_reserva,
            data.id_servico,
            data.forma_pagamento || null,
            data.descricao || null,
            data.valor_unitario,
            data.quantidade ?? 1,
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

        if (data.forma_pagamento !== undefined) {
            campos.push('forma_pagamento = ?');
            valores.push(data.forma_pagamento);
        }

        if (data.descricao !== undefined) {
            campos.push('descricao = ?');
            valores.push(data.descricao);
        }

        if (data.valor_unitario !== undefined) {
            campos.push('valor_unitario = ?');
            valores.push(data.valor_unitario);
        }

        if (data.quantidade !== undefined) {
            campos.push('quantidade = ?');
            valores.push(data.quantidade);
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