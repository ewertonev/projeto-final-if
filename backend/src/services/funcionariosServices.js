import { FuncionarioDao } from '../repository/funcionariosDao.js';
import { dataValida } from '../validators/datas.js';
import emailValido from '../validators/emails.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { telefoneValido } from '../validators/telefones.js';
import { stringObrigatoria } from '../validators/textos.js';

function validarPapeis(papeis) {
	if (papeis === undefined) return undefined;

	if (!Array.isArray(papeis)) {
		throw new Error('Papéis deve ser uma lista');
	}

	return papeis.map((id) => inteiroPositivo(id, 'ID do papel'));
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

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		data.senha = stringObrigatoria(data.senha, 'Senha');

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

		data.papeis = validarPapeis(data.papeis) ?? [];

		return this.dao.setFuncionario(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
		}

		if (data.senha !== undefined) {
			data.senha = stringObrigatoria(data.senha, 'Senha');
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

		if (data.papeis !== undefined) {
			data.papeis = validarPapeis(data.papeis);
		}

		return this.dao.updateFuncionario(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteFuncionario(id);
	}
}
