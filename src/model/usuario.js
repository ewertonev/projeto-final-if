class Usuario {
    constructor({
        id = null,
        nome,
        email = null,
        cpf,
        telefone = null,
        senha,
        data_nascimento,
        ativo = true,
        data_criacao = null,
    }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.senha = senha;
        this.data_nascimento = data_nascimento;
        this.ativo = ativo;
        this.data_criacao = data_criacao;
    }

    normalizar() {
        if (this.email) {
            this.email = this.email.trim().toLowerCase();
        }

        this.nome = this.nome.trim();

        if (this.telefone) {
            this.telefone = this.telefone.replace(/\D/g, '');
        }

        this.cpf = this.cpf.replace(/\D/g, '');
    }

    removerSenha() {
        const usuarioSemSenha = { ...this };

        delete usuarioSemSenha.senha;

        return usuarioSemSenha;
    }

    ativar() {
        this.ativo = true;
    }

    desativar() {
        this.ativo = false;
    }
}

module.exports = Usuario;
