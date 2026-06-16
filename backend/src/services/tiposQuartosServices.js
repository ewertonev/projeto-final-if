import { TipoQuartoDao } from '../repository/tiposQuartosDao.js';
import {
	inteiroPositivo,
	numeroPositivo,
} from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

export class TiposQuartosService {
	constructor() {
		this.dao = new TipoQuartoDao();
	}

	listar(ativos) {
		return this.dao.getTiposQuartos(ativos);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getTipoQuarto(consulta);
	}

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		data.capacidade = inteiroPositivo(data.capacidade, 'Capacidade');
		data.valor_diaria = numeroPositivo(
			data.valor_diaria,
			'Valor da diária',
		);

		if (data.descricao !== undefined && data.descricao !== null) {
			data.descricao = String(data.descricao).trim();
		}

		return this.dao.setTipoQuarto(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
		}

		if (data.descricao !== undefined && data.descricao !== null) {
			data.descricao = String(data.descricao).trim();
		}

		if (data.capacidade !== undefined) {
			data.capacidade = inteiroPositivo(data.capacidade, 'Capacidade');
		}

		if (data.valor_diaria !== undefined) {
			data.valor_diaria = numeroPositivo(
				data.valor_diaria,
				'Valor da diária',
			);
		}

		return this.dao.updateTipoQuarto(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteTipoQuarto(id);
	}
}
