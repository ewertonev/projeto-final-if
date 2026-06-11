async function getQuartosDisponiveis(data) {
	let filtros = [];
	let valores = [];
	if (data.id_tipo_quarto !== undefined) {
		filtros.push('AND q.id_tipo_quarto = ?');
		valores.push(data.id_tipo_quarto);
	}
	if (data.inicio !== undefined) {
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
            tq.valor_diaria,
            (
				SELECT
					JSON_ARRAYAGG(
						JSON_OBJECT(
							'inicio',r.inicio,
							'fim', r.fim
						)
					)
                )
                FROM reservas r
                WHERE
                    r.id_quarto = q.id AND
                    r.estado = 'confirmada'
                ORDER BY r.inicio
                GROUP BY r.id_quarto

                ) as intervalos_ocupados
        FROM quartos AS q

        INNER JOIN tipos_quartos AS tq
            ON tq.id = q.id_tipo_quarto

        WHERE q.estado = 'disponivel'
          AND tq.ativo = TRUE
          ${filtroTipo}
    `;

	const [rows] = await this.DB.execute(sql, valores);
	return rows;
}

let R = [
	{ inicio: '2000-01-01T00:00:00.000Z', fim: '2000-01-07T00:00:00.000Z' },
	{ inicio: '2000-01-10T00:00:00.000Z', fim: '2000-01-11T00:00:00.000Z' },
	{ inicio: '2000-01-20T00:00:00.000Z', fim: '2000-01-24T00:00:00.000Z' },
	{ inicio: '2000-01-24T00:00:00.000Z', fim: '2000-01-25T00:00:00.000Z' },
	{ inicio: '2000-01-26T00:00:00.000Z', fim: '2000-01-30T00:00:00.000Z' },
];
function mostrarIntervalosValidos(reservas, atual = new Date()) {
	let intervalos = [];
	let reservasOrdenadas = reservas
		.map((el) => {
			return {
				inicio: new Date(el.inicio),
				fim: new Date(el.fim),
			};
		})
		.sort((a, b) => a.inicio - b.inicio);

	for (let i = 0; i < reservasOrdenadas.length; i++) {
		if (reservasOrdenadas.length - 1 === i) {
			intervalos.push({
				inicio: reservasOrdenadas[i].fim,
				fim: 'indefinido',
			});
			return intervalos;
		}
		if (reservasOrdenadas[i].inicio > atual) {
			intervalos.push({
				inicio: new Date(atual),
				fim: new Date(reservasOrdenadas[i].inicio),
			});
		}
		atual = new Date(reservasOrdenadas[i].fim);
	}
}

console.log(mostrarIntervalosValidos(R, new Date('2000-01-01T00:00:00.000Z')));
