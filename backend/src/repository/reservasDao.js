import { BaseDao } from './baseDao.js';

export class ReservaDao extends BaseDao {
    consultaBase(where = '') {
        return `
            SELECT
                r.id,
                r.id_hospede,
                r.id_quarto,
                r.inicio,
                r.fim,
                r.quantidade_hospedes,
                r.estado,
                r.data_criacao,

                h.nome AS hospede_nome,
                h.email AS hospede_email,
                h.telefone AS hospede_telefone,

                q.numero AS numero_quarto,
                q.andar AS andar_quarto,

                tq.nome AS tipo_quarto,
                tq.valor_diaria

            FROM reservas AS r

            INNER JOIN hospedes AS h
                ON h.id = r.id_hospede

            INNER JOIN quartos AS q
                ON q.id = r.id_quarto

            INNER JOIN tipos_quartos AS tq
                ON tq.id = q.id_tipo_quarto

            ${where}
        `;
    }

    async getReservas() {
        const sql = this.consultaBase(`
            ORDER BY r.inicio DESC
        `);

        const [rows] = await this.DB.query(sql);
        return rows;
    }

    async getReserva(consulta) {
        const { tipo, valor } = consulta;

        const camposValidos = {
            id: 'r.id = ?',
            id_hospede: 'r.id_hospede = ?',
            id_quarto: 'r.id_quarto = ?',
            estado: 'r.estado = ?',
            hospede: 'h.nome LIKE ?',
            quarto: 'q.numero LIKE ?',
            pesquisa: `
                r.id = ? OR
                h.nome LIKE ? OR
                h.email LIKE ? OR
                q.numero LIKE ? OR
                r.estado LIKE ?
            `,
        };

        if (!(tipo in camposValidos)) {
            throw new Error('Campo inválido');
        }

        const sql = this.consultaBase(`
            WHERE ${camposValidos[tipo]}
            ORDER BY r.inicio DESC
        `);

        let params;

        if (tipo === 'id' || tipo === 'id_hospede' || tipo === 'id_quarto') {
            const id = Number(valor);

            if (!Number.isInteger(id)) {
                throw new Error('ID inválido');
            }

            params = [id];
        } else if (tipo === 'pesquisa') {
            params = [
                Number(valor) || 0,
                `%${valor}%`,
                `%${valor}%`,
                `%${valor}%`,
                `%${valor}%`,
            ];
        } else {
            params = [`%${valor}%`];
        }

        const [rows] = await this.DB.execute(sql, params);

        if (tipo === 'id') {
            return rows[0];
        }

        return rows;
    }

    async setReserva(data) {
        const sql = `
            INSERT INTO reservas (
                id_hospede,
                id_quarto,
                inicio,
                fim,
                quantidade_hospedes
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await this.DB.execute(sql, [
            data.id_hospede,
            data.id_quarto,
            data.inicio,
            data.fim,
            data.quantidade_hospedes,
        ]);

        return result.insertId;
    }

    async updateReserva(data) {
        const campos = [];
        const valores = [];

        if (data.id_hospede !== undefined) {
            campos.push('id_hospede = ?');
            valores.push(data.id_hospede);
        }

        if (data.id_quarto !== undefined) {
            campos.push('id_quarto = ?');
            valores.push(data.id_quarto);
        }

        if (data.inicio !== undefined) {
            campos.push('inicio = ?');
            valores.push(data.inicio);
        }

        if (data.fim !== undefined) {
            campos.push('fim = ?');
            valores.push(data.fim);
        }

        if (data.quantidade_hospedes !== undefined) {
            campos.push('quantidade_hospedes = ?');
            valores.push(data.quantidade_hospedes);
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
            UPDATE reservas
            SET ${campos.join(', ')}
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, valores);
        return result.affectedRows > 0;
    }

    async deleteReserva(id) {
        const sql = `
            DELETE FROM reservas
            WHERE id = ?
        `;

        const [result] = await this.DB.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}
