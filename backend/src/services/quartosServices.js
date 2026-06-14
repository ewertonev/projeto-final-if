import { QuartoDao } from '../repository/quartosDao.js';
import { estadoValido } from '../validators/estados.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

const ESTADOS_QUARTO = ['disponivel', 'manutencao', 'limpeza', 'desativado'];

export class QuartosService {
	constructor() {
		this.dao = new QuartoDao();
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

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteQuarto(id);
	}
}
