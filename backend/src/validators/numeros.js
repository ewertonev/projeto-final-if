export function inteiroPositivo(valor, campo) {
	const numero = Number(valor);

	if (!Number.isInteger(numero) || numero <= 0) {
		throw new Error(`${campo} deve ser um inteiro positivo`);
	}

	return numero;
}

export function numeroPositivo(valor, campo) {
	const numero = Number(valor);

	if (Number.isNaN(numero) || numero <= 0) {
		throw new Error(`${campo} deve ser um número positivo`);
	}

	return numero;
}
