import bcrypt from 'bcrypt';
import { FuncionarioDao } from '../repository/funcionariosDao.js';
import { dataValida } from '../validators/datas.js';
import emailValido from '../validators/emails.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { telefoneValido } from '../validators/telefones.js';
import { stringObrigatoria } from '../validators/textos.js';

function normalizarBoolean(valor) {
	if (valor === undefined) return undefined;
	return valor === true || valor === 'true' || valor === 1 || valor === '1';
}

function senhaEstaCriptografada(senha) {
	return typeof senha === 'string' && senha.startsWith('$2');
}

export class FuncionariosService {
	constructor() {
		this.dao = new FuncionarioDao();
	}

	listar(ativos) {
		return this.dao.getFuncionarios(ativos);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getFuncionario(consulta);
	}

	async criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		data.senha = stringObrigatoria(data.senha, 'Senha');
		data.senha = await bcrypt.hash(data.senha, 10);

		if (!data.email && !data.telefone) {
			throw new Error('Email ou telefone é obrigatório');
		}

		if (data.email !== undefined && data.email !== null && data.email !== '') {
			data.email = new emailValido(data.email).valor;
		}

		if (data.telefone !== undefined && data.telefone !== null && data.telefone !== '') {
			data.telefone = telefoneValido(data.telefone, 'Telefone');
		}

		data.data_nascimento = dataValida(
			data.data_nascimento,
			'Data de nascimento',
		);

		data.ativo = normalizarBoolean(data.ativo);

		return this.dao.setFuncionario(data);
	}

	async atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
		}

		if (data.senha !== undefined && data.senha !== '') {
			data.senha = stringObrigatoria(data.senha, 'Senha');
			data.senha = await bcrypt.hash(data.senha, 10);
		} else {
			delete data.senha;
		}

		if (data.email !== undefined && data.email !== null && data.email !== '') {
			data.email = new emailValido(data.email).valor;
		}

		if (data.telefone !== undefined && data.telefone !== null && data.telefone !== '') {
			data.telefone = telefoneValido(data.telefone, 'Telefone');
		}

		if (data.data_nascimento !== undefined) {
			data.data_nascimento = dataValida(
				data.data_nascimento,
				'Data de nascimento',
			);
		}

		data.ativo = normalizarBoolean(data.ativo);

		return this.dao.updateFuncionario(data);
	}

	async login(data) {
		const identificador = stringObrigatoria(
			data.identificador || data.usuario || data.email || data.telefone,
			'Funcionário',
		);
		const senha = stringObrigatoria(data.senha, 'Senha');

		const funcionario = await this.dao.getFuncionarioParaLogin(identificador);

		if (!funcionario) {
			const erro = new Error('Funcionário ou senha inválidos');
			erro.status = 401;
			throw erro;
		}

		if (!funcionario.ativo) {
			const erro = new Error('Funcionário inativo');
			erro.status = 403;
			throw erro;
		}

		let senhaCorreta = false;

		if (senhaEstaCriptografada(funcionario.senha)) {
			senhaCorreta = await bcrypt.compare(senha, funcionario.senha);
		} else {
			senhaCorreta = senha === funcionario.senha;

			if (senhaCorreta) {
				const novoHash = await bcrypt.hash(senha, 10);
				await this.dao.atualizarSenhaHash(funcionario.id, novoHash);
			}
		}

		if (!senhaCorreta) {
			const erro = new Error('Funcionário ou senha inválidos');
			erro.status = 401;
			throw erro;
		}

		return {
			id: funcionario.id,
			nome: funcionario.nome,
			email: funcionario.email,
			telefone: funcionario.telefone,
			perfil: 'Funcionário',
		};
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteFuncionario(id);
	}
}
