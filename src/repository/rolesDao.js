import { BaseDao } from './baseDao.js';
class RolesDao extends BaseDao {
    async getRoles() {
        const sql = `SELECT * FROM roles`;
        let [rows] = await this.DB.query(sql);
        return rows || [];
    }

    async setRole(nome) {
        const sql = `INSERT INTO roles(nome) VALUES(?)`;
        let [rows] = await this.DB.execute(sql, data.nome);
        return rows;
    }

    async updateRole(data) {
        const sql = `UPDATE roles SET nome = ? WHERE id = ?`;
        let [rows] = await this.DB.execute(sql, [data.nome, data.id]);
        return rows || [];
    }

    async deleteRole(id) {
        const sql = `DELETE FROM roles WHERE id = ?`;
        const [result] = await this.DB.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

export { RolesDao };
