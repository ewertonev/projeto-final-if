export default class Cpf {
    valor;
    constructor(cpf) {
        const numeros = cpf.replace(/\D/g, '');
        if (!Cpf.#validar(numeros)) {
            throw new Error('CPF inválido');
        }
        this.valor = numeros;
    }
    numeros() {
        return this.valor;
    }
    formatado() {
        return this.valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    static #validar(cpf) {
        if (cpf.length !== 11) {
            return false;
        }
        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }
        let soma = 0;
        let resto = 0;
        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10) {
            resto = 0;
        }
        if (resto !== Number(cpf[9])) {
            return false;
        }
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10) {
            resto = 0;
        }
        return resto === Number(cpf[10]);
    }
}
