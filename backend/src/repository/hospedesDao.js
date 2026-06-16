// src/dao/hospedesDao.js
import { BaseDao } from './baseDao.js';

export class HospedeDao extends BaseDao {
    async gethospedes(ativos) {
        let atv = '';
        if (ativos == true) {
            atv = 'WHERE ativo = TRUE';
        } else if (ativos == false) {
            atv = 'WHERE ativo = FALSE';
        }
        let sql = `
            SELECT * FROM hospedes
            ${atv}
        `;

        let [rows] = await this.DB.query(sql);
        return rows;
    }

    async getHospede(consulta) {
        const { tipo, valor } = consulta;

        let camposValidos = {
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

        let where = camposValidos[tipo];

        const sql = `
            SELECT * FROM hospedes
            WHERE ${where}`;

        let params = [`%${valor}%`];
        if (tipo === 'pesquisa') {
            params = [
                Number(valor) || 0,
                `%${valor}%`,
                `%${valor}%`,
                `%${valor}%`,
            ];
        } else if (tipo === 'id') {
            params = [Number(valor)];
        }

        const [rows] = await this.DB.execute(sql, params);
        return rows;
    }

    async setHospede(data) {
        const sql = `
            INSERT INTO hospedes(
                nome,
                email,
                telefone,
                data_nascimento
            ) VALUES(
                ?, ?, ?, ?
            )
    `;

        const [result] = await this.DB.execute(sql, [
            data.nome,
            data.email || null,
            data.telefone || null,
            data.data_nascimento,
        ]);

        return result.insertId;
    }

    async updateHospede(data) {
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

        const sql = `
            UPDATE hospedes
            SET ${campos.join(', ')}
            WHERE id = ?
    `;

        const [result] = await this.DB.execute(sql, valores);

        return result.affectedRows > 0;
    }

    async deleteHospede(id) {
        const sql = `
            DELETE FROM hospedes
            WHERE id = ?
    `;

        const [result] = await this.DB.execute(sql, [id]);

        return result.affectedRows > 0;
    }
}

// export class HospedeDao {}


 // let nu = new HospedeDao();
// await nu.setHospede({
//     nome: 'josé',
//     email: 'jose@gmail.com',
//     telefone: '00000000001',
//     senha: '12345',
//     data_nascimento: '2008-12-13',
//     papeis: [1, 2, 3],
// });
// console.log(await nu.gethospedes());
