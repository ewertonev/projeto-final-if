// src/dao/usuariosDao.js
import { BaseDao } from './baseDao.js';

export  class UsuariosDao extends BaseDao {
    async getUsuarios() {
        const sql = `
            SELECT u.*,
                JSON_ARRAYAGG(r.nome) as roles
            FROM usuarios u
            LEFT JOIN usuarios_roles ur ON ur.id_usuario = u.id
            LEFT JOIN roles r ON ur.id_role = r.id
            GROUP BY u.id
            `;
        let [rows] = await this.DB.query(sql);
        return rows || null;
    }

    async getUsuario(chave) {
        const numero = Number(chave);

        const where = !isNaN(numero) ? 'u.id = ?' : 'u.email = ?';

        const valor = !isNaN(numero) ? numero : chave;

        const sql = `
        SELECT
            u.*,

            COALESCE(
                JSON_ARRAYAGG(
                    CASE
                        WHEN r.nome IS NOT NULL
                        THEN r.nome
                    END
                ),
                JSON_ARRAY()
            ) AS roles

        FROM usuarios u

        LEFT JOIN usuarios_roles ur
            ON ur.id_usuario = u.id

        LEFT JOIN roles r
            ON ur.id_role = r.id

        WHERE ${where}

        GROUP BY u.id
    `;

        const [rows] = await this.DB.query(sql, [valor]);

        return rows[0] || null;
    }

    async setUsuario(data) {
        const sql = `
      CALL add_usuario(
        ?, ?, ?, ?, ?, ?
      )
    `;

        const [result] = await this.DB.query(sql, [
            data.nome,
            data.email || null,
            data.telefone || null,
            data.senha,
            data.data_nascimento,
            JSON.stringify(data.roles),
        ]);

        return result[0][0].id;
    }

    async updateUsuario(data) {
        const campos = [];
        const valores = [];

        if (data.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(data.nome);
        }

        if (data.email !== undefined) {
            campos.push('email = ?');
            valores.push(data.email);
        }

        if (data.senha !== undefined) {
            campos.push('senha = ?');
            valores.push(data.senha);
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
      UPDATE usuarios
      SET ${campos.join(', ')}
      WHERE id = ?
    `;

        const [result] = await this.DB.execute(sql, valores);

        return result.affectedRows > 0;
    }

    async deleteUsuario(id) {
        const sql = `
      DELETE FROM usuarios
      WHERE id = ?
    `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}
let nu = new UsuariosDao();
// await nu.setUsuario({
//     nome: 'josé',
//     email: 'jose@gmail.com',
//     telefone: '00000000001',
//     senha: '12345',
//     data_nascimento: '2008-12-13',
//     roles: [1, 2, 3],
// });
console.log(await nu.getUsuarios());
