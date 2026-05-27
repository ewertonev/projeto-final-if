import { BaseDao } from './baseDao.js';
class ReservaDao extends BaseDao {
    async getReservas() {
        const sql = `
        SELECT
            r.id,
            r.inicio,
            r.fim,
            r.quantidade_hospedes,
            r.estado,
            r.data_criacao,
            h.nome,
            h.email,
            q.numero
        FROM reservas r
        INNER JOIN usuarios h ON h.id = r.id_hospede
        INNER JOIN quartos q ON q.id = r.id_quarto
        `;
        const [rows] = await this.DB.query(sql);
        return rows || [];
    }

    async getReserva(id) {
        const sql = `
        SELECT
            r.id,
            r.inicio,
            r.fim,
            r.quantidade_hospedes,
            r.estado,
            r.data_criacao,
            h.nome,
            h.email,
            q.numero
        FROM reservas r
        INNER JOIN usuarios h ON h.id = r.id_hospede
        INNER JOIN quartos q ON q.id = r.id_quarto
        WHERE r.id = ?
        `;
        const [rows] = await this.DB.query(sql, [id]);
        return rows[0] || null;
    }

    async setReserva(data) {
        const sql = `
        INSERT INTO reservas (
            id_hospede,
            id_quarto,
            inicio,
            fim,
            quantidade_hospedes
        ) VALUES(?,?,?,?,?)
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

export { ReservaDao };
