export function stringObrigatoria(valor, campo) {
	if (
		valor === undefined ||
		valor === null ||
		typeof valor !== 'string' ||
		valor.trim() === ''
	) {
		throw new Error(`${campo} é obrigatório`);
	}

	return valor.trim();
}
