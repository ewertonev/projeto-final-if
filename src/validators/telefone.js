export default class Telefone {
    valor;
    constructor(telefone) {
        const numeros = telefone.replace(/\D/g, '');
        if (!Telefone.validar(numeros)) {
            throw new Error('Telefone inválido');
        }
        this.valor = numeros;
    }
    numeros() {
        return this.valor;
    }
    formatado() {
        if (this.valor.length === 11) {
            return this.valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return this.valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    static validar(telefone) {
        return /^[1-9]{2}(9?\d{8})$/.test(telefone);
    }
    texto() {
        return this.formatado();
    }
}
