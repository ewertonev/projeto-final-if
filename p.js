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
