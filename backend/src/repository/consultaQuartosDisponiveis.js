import { BaseDao } from './baseDao';
export class ConsultasQuartos extends BaseDao {
	async getQuartosComReservasAPartirDe(data = {}) {
		const filtros = [];
		const valores = [];

		const dataBase = data.data_base ?? new Date();

		if (data.id_tipo_quarto !== undefined) {
			filtros.push('AND q.id_tipo_quarto = ?');
			valores.push(data.id_tipo_quarto);
		}

		const sql = `
		SELECT
			q.id,
			q.numero,
			q.andar,
			q.estado,

			tq.id AS id_tipo_quarto,
			tq.nome AS tipo_quarto,
			tq.capacidade,
			tq.descricao,
			tq.valor_diaria,

			r.id AS id_reserva,
			r.inicio AS reserva_inicio,
			r.fim AS reserva_fim

		FROM quartos AS q

		INNER JOIN tipos_quartos AS tq
			ON tq.id = q.id_tipo_quarto

		LEFT JOIN reservas AS r
			ON r.id_quarto = q.id
			AND r.estado = 'confirmada'
			AND r.fim > ?

		WHERE q.estado = 'disponivel'
		  AND tq.ativo = TRUE
		  ${filtros.join('\n')}

		  AND NOT EXISTS (
			  SELECT 1
			  FROM reservas AS rb
			  WHERE rb.id_quarto = q.id
			    AND rb.estado = 'confirmada'
			    AND rb.inicio <= ?
			    AND rb.fim > ?
		  )

		ORDER BY q.id, r.inicio
	`;

		valores.unshift(dataBase, dataBase, dataBase);

		const [rows] = await this.DB.execute(sql, valores);
		return rows;
	}

	async getIntervalosDisponiveisAPartirDe(data = {}) {
		const dataBase = data.data_base ?? new Date();

		const rows = await this.getQuartosComReservasAPartirDe({
			id_tipo_quarto: data.id_tipo_quarto,
			data_base: dataBase,
		});

		return this.montarQuartosComIntervalos(rows, dataBase);
	}

	async getQuartosDisponiveisNoIntervalo(data) {
		const valores = [];

		let filtroTipo = '';

		if (data.id_tipo_quarto !== undefined) {
			filtroTipo = 'AND q.id_tipo_quarto = ?';
			valores.push(data.id_tipo_quarto);
		}

		valores.push(data.fim);
		valores.push(data.inicio);

		const sql = `
        SELECT
            q.id,
            q.numero,
            q.andar,
            q.estado,

            tq.id AS id_tipo_quarto,
            tq.nome AS tipo_quarto,
            tq.capacidade,
            tq.descricao,
            tq.valor_diaria

        FROM quartos AS q

        INNER JOIN tipos_quartos AS tq
            ON tq.id = q.id_tipo_quarto

        WHERE q.estado = 'disponivel'
          AND tq.ativo = TRUE
          ${filtroTipo}

          AND NOT EXISTS (
              SELECT 1
              FROM reservas AS r
              WHERE r.id_quarto = q.id
                AND r.estado = 'confirmada'
                AND r.inicio < ?
                AND r.fim > ?
          )

        ORDER BY q.numero
    `;

		const [rows] = await this.DB.execute(sql, valores);
		return rows;
	}

	montarQuartosComIntervalos(rows, dataBase) {
		const quartosMap = new Map();

		for (const row of rows) {
			if (!quartosMap.has(row.id)) {
				quartosMap.set(row.id, {
					id: row.id,
					numero: row.numero,
					andar: row.andar,
					estado: row.estado,

					tipo_quarto: {
						id: row.id_tipo_quarto,
						nome: row.tipo_quarto,
						capacidade: row.capacidade,
						descricao: row.descricao,
						valor_diaria: row.valor_diaria,
					},

					reservas: [],
				});
			}

			if (row.id_reserva) {
				quartosMap.get(row.id).reservas.push({
					id: row.id_reserva,
					inicio: row.reserva_inicio,
					fim: row.reserva_fim,
				});
			}
		}

		return [...quartosMap.values()].map((quarto) => {
			const intervalos = this.mostrarIntervalosValidos(
				quarto.reservas,
				dataBase,
			);

			delete quarto.reservas;

			return {
				...quarto,
				intervalos_disponiveis: intervalos,
			};
		});
	}

	mostrarIntervalosValidos(reservas, dataBase = new Date()) {
		const intervalos = [];

		const reservasOrdenadas = reservas
			.map((reserva) => ({
				inicio: new Date(reserva.inicio),
				fim: new Date(reserva.fim),
			}))
			.filter((reserva) => reserva.fim > dataBase)
			.sort((a, b) => a.inicio - b.inicio);

		let cursor = new Date(dataBase);

		for (const reserva of reservasOrdenadas) {
			if (reserva.inicio > cursor) {
				intervalos.push({
					inicio: cursor,
					fim: reserva.inicio,
				});
			}

			if (reserva.fim > cursor) {
				cursor = reserva.fim;
			}
		}

		intervalos.push({
			inicio: cursor,
			fim: null,
		});

		return intervalos;
	}
}
