import { BaseDao } from './baseDao.js';

export class FormasPagamentoDao extends BaseDao {
	async getFormasPagamento(ativos) {
		let atv = '';

		if (ativos === true) {
			atv = 'WHERE ativo = TRUE';
		} else if (ativos === false) {
			atv = 'WHERE ativo = FALSE';
		}

		const sql = `
            SELECT *
            FROM formas_pagamento
            ${atv}
        `;

		const [rows] = await this.DB.query(sql);
		return rows;
	}

	async getFormaPagamento(consulta) {
		const { tipo, valor } = consulta;

		const camposValidos = {
			id: 'id = ?',
			nome: 'nome LIKE ?',
		};

		if (!(tipo in camposValidos)) {
			throw new Error('Campo inválido');
		}

		let param;

		if (tipo === 'id') {
			param = Number(valor);

			if (!Number.isInteger(param)) {
				throw new Error('ID inválido');
			}
		} else {
			param = `%${valor}%`;
		}

		const sql = `
            SELECT *
            FROM formas_pagamento
            WHERE ${camposValidos[tipo]}
        `;

		const [rows] = await this.DB.execute(sql, [param]);

		if (tipo === 'id') {
			return rows[0] || null;
		}

		return rows;
	}

	async setFormaPagamento(data) {
		const sql = `
            INSERT INTO formas_pagamento (
                nome
            )
            VALUES (?)
        `;

		const [result] = await this.DB.execute(sql, [data.nome]);

		return result.insertId;
	}

	async updateFormaPagamento(data) {
		const campos = [];
		const valores = [];

		if (data.nome !== undefined) {
			campos.push('nome = ?');
			valores.push(data.nome);
		}

		if (data.ativo !== undefined) {
			campos.push('ativo = ?');
			valores.push(data.ativo);
		}

		if (campos.length === 0) {
			return false;
		}

		valores.push(data.id);

		const sql = `
            UPDATE formas_pagamento
            SET ${campos.join(', ')}
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, valores);
		return result.affectedRows > 0;
	}

	async deleteFormaPagamento(id) {
		const sql = `
            UPDATE formas_pagamento
            SET ativo = FALSE
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, [id]);
		return result.affectedRows > 0;
	}
}
