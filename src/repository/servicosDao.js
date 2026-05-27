import { BaseDao } from './baseDao.js';
class ServicosDao extends BaseDao {
    async getServicos() {
        const sql = `SELECT * FROM servicos`;
        let [rows] = await this.DB.query(sql);
        return rows || [];
    }

    async setServico(nome) {
        const sql = `INSERT INTO servicos(nome) VALUES(?)`;
        let [rows] = await this.DB.execute(sql, data.nome);
        return rows;
    }

    async updateServico(data) {
        const sql = `UPDATE servicos SET nome = ? WHERE id = ?`;
        let [rows] = await this.DB.execute(sql, [data.nome, data.id]);
        return rows || [];
    }

    async deleteServico(id) {
        const sql = `DELETE FROM servicos WHERE id = ?`;
        const [result] = await this.DB.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}


export {ServicosDao}