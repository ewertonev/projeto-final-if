export function estadoValido(valor, permitidos, campo = 'Estado') {
	if (valor !== undefined && !permitidos.includes(valor)) {
		throw new Error(`${campo} inválido`);
	}

	return valor;
}
