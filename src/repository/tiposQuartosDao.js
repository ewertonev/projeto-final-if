import { BaseDao } from './baseDao.js';

export class TipoQuartoDao extends BaseDao {
    async getTiposQuartos(ativos) {
        let atv = '';

        if (ativos === true) {
            atv = 'WHERE ativo = TRUE';
        } else if (ativos === false) {
            atv = 'WHERE ativo = FALSE';
        }

        const sql = `
            SELECT *
            FROM tipos_quartos
            ${atv}
        `;

        const [rows] = await this.DB.query(sql);
        return rows;
    }

    async getTipoQuarto(consulta) {
        const { tipo, valor } = consulta;

        const camposValidos = {
            id: 'id = ?',
            nome: 'nome LIKE ?',
            descricao: 'descricao LIKE ?',
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
            FROM tipos_quartos
            WHERE ${camposValidos[tipo]}
        `;

        const [rows] = await this.DB.execute(sql, [param]);

        if (tipo === 'id') {
            return rows[0] || null;
        }

        return rows;
    }

    async setTipoQuarto(data) {
        const sql = `
            INSERT INTO tipos_quartos (
                nome,
                descricao,
                capacidade,
                valor_diaria
            )
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await this.DB.execute(sql, [
            data.nome,
            data.descricao || null,
            data.capacidade ?? 0,
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

        if (data.ativo !== undefined) {
            campos.push('ativo = ?');
            valores.push(data.ativo);
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
            UPDATE tipos_quartos
            SET ativo = FALSE
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}