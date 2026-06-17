import { BaseDao } from './baseDao.js';

export class FuncionarioDao extends BaseDao {
	consultaBase(where = '') {
		return `
			SELECT
				id,
				nome,
				email,
				telefone,
				data_nascimento,
				ativo,
				data_criacao
			FROM funcionarios
			${where}
			ORDER BY nome
		`;
	}

	async getFuncionarios(ativos) {
		let where = '';

		if (ativos === true) {
			where = 'WHERE ativo = TRUE';
		} else if (ativos === false) {
			where = 'WHERE ativo = FALSE';
		}

		const [rows] = await this.DB.query(this.consultaBase(where));
		return rows;
	}

	async getFuncionario(consulta) {
		const { tipo, valor } = consulta;

		const camposValidos = {
			id: 'id = ?',
			nome: 'nome LIKE ?',
			email: 'email LIKE ?',
			telefone: 'telefone LIKE ?',
			pesquisa: `
				id = ? OR
				nome LIKE ? OR
				email LIKE ? OR
				telefone LIKE ?
			`,
		};

		if (!(tipo in camposValidos)) {
			throw new Error('Campo inválido');
		}

		let params = [`%${valor}%`];

		if (tipo === 'pesquisa') {
			params = [
				Number(valor) || 0,
				`%${valor}%`,
				`%${valor}%`,
				`%${valor}%`,
			];
		} else if (tipo === 'id') {
			const id = Number(valor);
			if (!Number.isInteger(id)) {
				throw new Error('ID inválido');
			}
			params = [id];
		}

		const sql = this.consultaBase(`WHERE ${camposValidos[tipo]}`);
		const [rows] = await this.DB.execute(sql, params);

		if (tipo === 'id') {
			return rows[0] || null;
		}

		return rows;
	}

	async getFuncionarioParaLogin(identificador) {
		const sql = `
			SELECT
				id,
				nome,
				email,
				telefone,
				senha,
				ativo
			FROM funcionarios
			WHERE email = ? OR telefone = ? OR nome = ?
			LIMIT 1
		`;

		const [rows] = await this.DB.execute(sql, [
			identificador,
			identificador,
			identificador,
		]);

		return rows[0] || null;
	}

	async atualizarSenhaHash(id, senhaHash) {
		await this.DB.execute(
			`
				UPDATE funcionarios
				SET senha = ?
				WHERE id = ?
			`,
			[senhaHash, id],
		);
	}

	async setFuncionario(data) {
		const sql = `
			INSERT INTO funcionarios (
				nome,
				email,
				telefone,
				senha,
				data_nascimento,
				ativo
			)
			VALUES (?, ?, ?, ?, ?, ?)
		`;

		const [result] = await this.DB.execute(sql, [
			data.nome,
			data.email || null,
			data.telefone || null,
			data.senha,
			data.data_nascimento,
			data.ativo ?? true,
		]);

		return result.insertId;
	}

	async updateFuncionario(data) {
		const campos = [];
		const valores = [];

		if (data.nome !== undefined) {
			campos.push('nome = ?');
			valores.push(data.nome);
		}

		if (data.email !== undefined) {
			campos.push('email = ?');
			valores.push(data.email || null);
		}

		if (data.telefone !== undefined) {
			campos.push('telefone = ?');
			valores.push(data.telefone || null);
		}

		if (data.senha !== undefined) {
			campos.push('senha = ?');
			valores.push(data.senha);
		}

		if (data.data_nascimento !== undefined) {
			campos.push('data_nascimento = ?');
			valores.push(data.data_nascimento);
		}

		if (data.ativo !== undefined) {
			campos.push('ativo = ?');
			valores.push(data.ativo);
		}

		if (campos.length === 0) {
			return false;
		}

		valores.push(data.id);

		const [result] = await this.DB.execute(
			`
				UPDATE funcionarios
				SET ${campos.join(', ')}
				WHERE id = ?
			`,
			valores,
		);

		return result.affectedRows > 0;
	}

	async deleteFuncionario(id) {
		const [result] = await this.DB.execute(
			`
				DELETE FROM funcionarios
				WHERE id = ?
			`,
			[id],
		);

		return result.affectedRows > 0;
	}
}
