export default class emailValido {
	valor;
	constructor(email) {
		email = email.trim().toLowerCase();
		if (!Email.validar(email)) {
			throw new Error('E-mail inválido');
		}
		this.valor = email;
	}
	static validar(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}
