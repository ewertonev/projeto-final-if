import { QuartoDao } from '../repository/quartosDao.js';
import { ConsultasQuartosService } from './consultasQuartosServices.js';
import { estadoValido } from '../validators/estados.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

const ESTADOS_QUARTO = ['disponivel', 'manutencao', 'limpeza', 'desativado'];

export class QuartosService {
	constructor() {
		this.dao = new QuartoDao();
		this.consultas = new ConsultasQuartosService();
	}

	listar(disponiveis) {
		return this.dao.getQuartos(disponiveis);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getQuarto(consulta);
	}

	criar(data) {
		data.numero = stringObrigatoria(String(data.numero), 'Número');
		data.andar = inteiroPositivo(data.andar, 'Andar');
		data.id_tipo_quarto = inteiroPositivo(
			data.id_tipo_quarto,
			'ID do tipo de quarto',
		);

		if (data.estado !== undefined) {
			data.estado = estadoValido(data.estado, ESTADOS_QUARTO, 'Estado do quarto');
		}

		return this.dao.setQuarto(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.numero !== undefined) {
			data.numero = stringObrigatoria(String(data.numero), 'Número');
		}

		if (data.andar !== undefined) {
			data.andar = inteiroPositivo(data.andar, 'Andar');
		}

		if (data.id_tipo_quarto !== undefined) {
			data.id_tipo_quarto = inteiroPositivo(
				data.id_tipo_quarto,
				'ID do tipo de quarto',
			);
		}

		if (data.estado !== undefined) {
			data.estado = estadoValido(data.estado, ESTADOS_QUARTO, 'Estado do quarto');
		}

		return this.dao.updateQuarto(data);
	}

	intervalosAPartirDeHoje(query) {
		return this.consultas.listarIntervalosAPartirDe(query);
	}

	intervalosAPartirDeData(query) {
		return this.consultas.listarIntervalosAPartirDe(query);
	}

	disponiveisNoIntervalo(query) {
		return this.consultas.listarDisponiveisNoIntervalo(query);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteQuarto(id);
	}
}
