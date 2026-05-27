import { BaseDao } from './baseDao.js';

class QuartoDao extends BaseDao {
    async getQuartos() {
        const sql = `
            SELECT
                Q.id,
                Q.andar,
                Q.numero,
                Q.estado,
                Tq.nome AS tipo_quarto

            FROM quartos AS Q

            LEFT JOIN tipos_quartos AS Tq
                ON Tq.id = Q.id_tipo_quarto
        `;

        const [rows] = await this.DB.query(sql);

        return rows || [];
    }

    async getQuarto(id) {
        const sql = `
            SELECT
                Q.id,
                Q.andar,
                Q.numero,
                Q.estado,
                Tq.nome AS tipo_quarto

            FROM quartos AS Q

            LEFT JOIN tipos_quartos AS Tq
                ON Tq.id = Q.id_tipo_quarto

            WHERE Q.id = ?
        `;

        const [rows] = await this.DB.query(sql, [id]);

        return rows[0] || null;
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
            data.id_tipo_quarto || null,
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

export { QuartoDao };
