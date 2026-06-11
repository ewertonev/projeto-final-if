import { BaseDao } from './baseDao.js';

export class PapelDao extends BaseDao {
    async getPapeis() {
        const sql = `
            SELECT *
            FROM papeis
        `;

        const [rows] = await this.DB.query(sql);
        return rows;
    }

    async setPapel(data) {
        const sql = `
            INSERT INTO papeis(nome)
            VALUES(?)
        `;

        const [result] = await this.DB.execute(sql, [data.nome]);

        return result.insertId;
    }

    async updatePapel(data) {
        const sql = `
            UPDATE papeis
            SET nome = ?
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [data.nome, data.id]);

        return result.affectedRows > 0;
    }

    async deletePapel(id) {
        const sql = `
            DELETE FROM papeis
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}
