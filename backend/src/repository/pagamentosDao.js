import { BaseDao } from './baseDao.js';

export class PagamentoDao extends BaseDao {
	async getPagamentos() {
		const sql = `
            SELECT
                p.*,
                fp.nome AS forma_pagamento_nome
            FROM pagamentos AS p

            INNER JOIN formas_pagamento AS fp
                ON fp.id = p.forma_pagamento
        `;

		const [rows] = await this.DB.query(sql);

		return rows;
	}

	async getPagamento(consulta) {
		const { tipo, valor } = consulta;

		const camposValidos = {
			id: 'p.id = ?',
			id_reserva: 'p.id_reserva = ?',
			estado: 'p.estado = ?',
		};

		if (!(tipo in camposValidos)) {
			throw new Error('Campo inválido');
		}

		const sql = `
            SELECT
                p.*,
                fp.nome AS forma_pagamento_nome
            FROM pagamentos AS p

            INNER JOIN formas_pagamento AS fp
                ON fp.id = p.forma_pagamento

            WHERE ${camposValidos[tipo]}
        `;

		const [rows] = await this.DB.execute(sql, [valor]);

		if (tipo === 'id') {
			return rows[0] || null;
		}

		return rows;
	}

	async setPagamento(data) {
		const sql = `
            INSERT INTO pagamentos (
                id_reserva,
                valor,
                forma_pagamento
            )
            VALUES (?, ?, ?)
        `;

		const [result] = await this.DB.execute(sql, [
			data.id_reserva,
			data.valor,
			data.forma_pagamento,
		]);

		return result.insertId;
	}

	async updatePagamento(data) {
		const campos = [];
		const valores = [];

		if (data.id_reserva !== undefined) {
			campos.push('id_reserva = ?');
			valores.push(data.id_reserva);
		}

		if (data.valor !== undefined) {
			campos.push('valor = ?');
			valores.push(data.valor);
		}

		if (data.forma_pagamento !== undefined) {
			campos.push('forma_pagamento = ?');
			valores.push(data.forma_pagamento);
		}

		if (data.estado !== undefined) {
			campos.push('estado = ?');
			valores.push(data.estado);

			if (data.estado === 'pago') {
				campos.push('pago_em = NOW()');
			}
		}

		if (campos.length === 0) {
			return false;
		}

		valores.push(data.id);

		const sql = `
            UPDATE pagamentos
            SET ${campos.join(', ')}
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, valores);

		return result.affectedRows > 0;
	}

	async deletePagamento(id) {
		const sql = `
            DELETE FROM pagamentos
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, [id]);

		return result.affectedRows > 0;
	}
}
