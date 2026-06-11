import { BaseDao } from './baseDao.js';

export class QuartoDao extends BaseDao {
	consultaBase(where = '') {
		return `
            SELECT
                Q.id,
                Q.andar,
                Q.numero,
                Q.estado,
                Q.id_tipo_quarto,
                Tq.nome AS tipo_quarto,
                Tq.valor_diaria,
                Tq.capacidade
            FROM quartos AS Q
            LEFT JOIN tipos_quartos AS Tq
                ON Tq.id = Q.id_tipo_quarto
            ${where}
        `;
	}

	async getQuartos(disponiveis) {
		let where = '';

		if (disponiveis === true) {
			where = `WHERE Q.estado = 'disponivel'`;
		} else if (disponiveis === false) {
			where = `WHERE Q.estado <> 'disponivel'`;
		}

		const sql = this.consultaBase(where);
		const [rows] = await this.DB.query(sql);

		return rows;
	}

	async getQuartosDisponiveis(data) {
		let valores = [];
	}

	async getQuarto(consulta) {
		const { tipo, valor } = consulta;

		const camposValidos = {
			id: 'Q.id = ?',
			numero: 'Q.numero = ?',
			andar: 'Q.andar = ?',
			estado: 'Q.estado = ?',
			tipo_quarto: 'Tq.nome LIKE ?',
			id_tipo_quarto: 'Q.id_tipo_quarto = ?',
			pesquisa: `
                Q.numero LIKE ? OR
                Q.andar = ? OR
                Q.estado LIKE ? OR
                Tq.nome LIKE ?
            `,
		};

		if (!(tipo in camposValidos)) {
			throw new Error('Campo inválido');
		}

		const sql = this.consultaBase(`WHERE ${camposValidos[tipo]}`);

		let params;

		if (tipo === 'id' || tipo === 'andar' || tipo === 'id_tipo_quarto') {
			const numero = Number(valor);

			if (!Number.isInteger(numero)) {
				throw new Error('Valor numérico inválido');
			}

			params = [numero];
		} else if (tipo === 'pesquisa') {
			params = [
				`%${valor}%`,
				Number(valor) || 0,
				`%${valor}%`,
				`%${valor}%`,
			];
		} else if (tipo === 'tipo_quarto') {
			params = [`%${valor}%`];
		} else {
			params = [valor];
		}

		const [rows] = await this.DB.execute(sql, params);

		if (tipo === 'id') {
			return rows[0] || null;
		}

		return rows;
	}

	async setQuarto(data) {
		const sql = `
            INSERT INTO quartos (
                numero,
                andar,
                id_tipo_quarto
            )
            VALUES (?, ?, ?)
        `;

		const [result] = await this.DB.execute(sql, [
			data.numero,
			data.andar,
			data.id_tipo_quarto,
		]);

		return result.insertId;
	}

	async updateQuarto(data) {
		const campos = [];
		const valores = [];

		if (data.numero !== undefined) {
			campos.push('numero = ?');
			valores.push(data.numero);
		}

		if (data.andar !== undefined) {
			campos.push('andar = ?');
			valores.push(data.andar);
		}

		if (data.id_tipo_quarto !== undefined) {
			campos.push('id_tipo_quarto = ?');
			valores.push(data.id_tipo_quarto);
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
            UPDATE quartos
            SET ${campos.join(', ')}
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, valores);

		return result.affectedRows > 0;
	}

	async deleteQuarto(id) {
		const sql = `
            DELETE FROM quartos
            WHERE id = ?
        `;

		const [result] = await this.DB.execute(sql, [id]);

		return result.affectedRows > 0;
	}
}
