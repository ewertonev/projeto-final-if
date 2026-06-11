import { BaseDao } from './baseDao.js';

export class ServicosDao extends BaseDao {
	async getServicos(ativos) {
		let atv = '';

		if (ativos === true) {
			atv = 'WHERE ativo = TRUE';
		} else if (ativos === false) {
			atv = 'WHERE ativo = FALSE';
		}

		const sql = `
            SELECT *
            FROM servicos
            ${atv}
        `;

		const [rows] = await this.DB.query(sql);
		return rows;
	}

	async getServico(consulta) {
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
            FROM servicos
            WHERE ${camposValidos[tipo]}
        `;

		const [rows] = await this.DB.execute(sql, [param]);

		if (tipo === 'id') {
			return rows[0] || null;
		}

		return rows;
	}

	async setServico(data) {
		const sql = `
            INSERT INTO servicos (
                nome,
                valor
            )
            VALUES (?, ?)
        `;

		const [result] = await this.DB.execute(sql, [data.nome, data.valor]);

		return result.insertId;
	}

	async updateServico(data) {
		const campos = [];
		const valores = [];

		if (data.nome !== undefined) {
			campos.push('nome = ?');
			valores.push(data.nome);
		}

		if (data.valor !== undefined) {
			campos.push('valor = ?');
			valores.push(data.valor);
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
            UPDATE servicos
            SET ${campos.join(', ')}
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, valores);
		return result.affectedRows > 0;
	}

	async deleteServico(id) {
		const sql = `
            UPDATE servicos
            SET ativo = FALSE
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, [id]);
		return result.affectedRows > 0;
	}
}
