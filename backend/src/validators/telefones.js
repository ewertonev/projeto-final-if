export function telefoneValido(valor, campo = 'Telefone') {
	if (valor === undefined || valor === null || typeof valor !== 'string') {
		throw new Error(`${campo} é obrigatório`);
	}

	const telefone = valor.replace(/\D/g, '');

	if (telefone.length < 10 || telefone.length > 11) {
		throw new Error(`${campo} inválido`);
	}

	return telefone;
}
