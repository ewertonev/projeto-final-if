export default class Email {
    valor;
    constructor(email) {
        email = email.trim().toLowerCase();
        if (!Email.validar(email)) {
            throw new Error('E-mail inválido');
        }
        this.valor = email;
    }
    texto() {
        return this.valor;
    }
    static validar(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
