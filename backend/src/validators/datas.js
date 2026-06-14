export function dataValida(valor, campo) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
		throw new Error(`${campo} inválida`);
	}

	const data = new Date(valor);

	if (Number.isNaN(data.getTime())) {
		throw new Error(`${campo} inválida`);
	}

	return data;
}
