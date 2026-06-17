export default class emailValido {
	valor;
	constructor(email) {
		email = email.trim().toLowerCase();
		if (!emailValido.validar(email)) {
			throw new Error('E-mail inválido');
		}
		this.valor = email;
	}
	static validar(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}
