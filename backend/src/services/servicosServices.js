import { ServicosDao } from '../repository/servicosDao.js';
import { inteiroPositivo, numeroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

export class ServicosService {
	constructor() {
		this.dao = new ServicosDao();
	}

	listar(ativos) {
		return this.dao.getServicos(ativos);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getServico(consulta);
	}

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		data.valor = numeroPositivo(data.valor, 'Valor');

		return this.dao.setServico(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
		}

		if (data.valor !== undefined) {
			data.valor = numeroPositivo(data.valor, 'Valor');
		}

		return this.dao.updateServico(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteServico(id);
	}
}
