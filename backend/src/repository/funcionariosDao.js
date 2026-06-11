// src/dao/funcionariosDao.js
import { BaseDao } from './baseDao.js';

export class FuncionarioDao extends BaseDao {
    consultarFuncionarios(params = '') {
        return `
            SELECT
                f.*,
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE
                            WHEN p.nome IS NOT NULL
                            THEN
                                JSON_OBJECT(
                                    'id', p.id,
                                    'nome',p.nome
                                )
                        END
                    ),
                JSON_ARRAY()
            ) AS papeis

            FROM funcionarios AS f

            LEFT JOIN funcionarios_papeis AS fp
                ON fp.id_funcionario = f.id

            LEFT JOIN papeis AS p
                ON fp.id_papel = p.id
            
            ${params}
            GROUP BY f.id
            `;
    }
    async getFuncionarios(ativos) {
        let atv = '';
        if (ativos == true) {
            atv = 'WHERE f.ativo = TRUE';
        } else if (ativos == false) {
            atv = 'WHERE f.ativo = FALSE';
        }
        let sql = this.consultarFuncionarios(atv);

        let [rows] = await this.DB.query(sql);
        return rows;
    }

    async getFuncionario(consulta) {
        const { tipo, valor } = consulta;

        let camposValidos = {
            id: 'WHERE f.id = ?',
            nome: 'WHERE f.nome LIKE ?',
            email: 'WHERE f.email LIKE ?',
            telefone: 'WHERE f.telefone LIKE ?',
            pesquisa: `
                WHERE
                f.id = ? OR
                f.nome LIKE ? OR
                f.email LIKE ? OR
                f.telefone LIKE ?
                `,
        };

        if (!(tipo in camposValidos)) {
            throw new Error('Campo inválido');
        }

        let where = camposValidos[tipo];

        const sql = this.consultarFuncionarios(where);

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

        const [rows] = await this.DB.execute(sql, params);
        return rows;
    }

    async setFuncionario(data) {
        const sql = `
        CALL add_funcionario(?, ?, ?, ?, ?, ?)
    `;

        const [result] = await this.DB.query(sql, [
            data.nome,
            data.email || null,
            data.telefone || null,
            data.senha,
            data.data_nascimento,
            JSON.stringify(data.papeis ?? []),
        ]);

        return result[0][0].id;
    }

    async updateFuncionarioPapeis(id, papeis) {
        const sql = `CALL update_funcionario(?, ?)`;

        const [result] = await this.DB.query(sql, [
            id,
            JSON.stringify(papeis ?? []),
        ]);

        return result;
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
            valores.push(data.email);
        }

        if (data.telefone !== undefined) {
            campos.push('telefone = ?');
            valores.push(data.telefone);
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

        if (campos.length === 0 && data.papeis === undefined) {
            return false;
        }

        valores.push(data.id);

        if (campos.length > 0) {
            await this.DB.execute(
                `
                UPDATE funcionarios
                SET ${campos.join(', ')}
                WHERE id = ?
                `,
                valores,
            );
        }

        if (data.papeis !== undefined) {
            await this.updateFuncionarioPapeis(data.id, data.papeis);
        }

        return true;
    }

    async deleteFuncionario(id) {
        const sql = `
            DELETE FROM funcionarios
            WHERE id = ?
    `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}
