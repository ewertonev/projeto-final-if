import { HospedeDao } from '../repository/hospedesDao.js';
import { dataValida } from '../validators/datas.js';
import emailValido from '../validators/emails.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { telefoneValido } from '../validators/telefones.js';
import { stringObrigatoria } from '../validators/textos.js';

export class HospedesService {
	constructor() {
		this.dao = new HospedeDao();
	}

	listar(ativos) {
		return this.dao.gethospedes(ativos);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getHospede(consulta);
	}

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');

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

		return this.dao.setHospede(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
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

		return this.dao.updateHospede(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteHospede(id);
	}
}
