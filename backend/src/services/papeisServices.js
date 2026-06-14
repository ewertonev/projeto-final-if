import { PapelDao } from '../repository/papeisDao.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

export class PapeisService {
	constructor() {
		this.dao = new PapelDao();
	}

	listar() {
		return this.dao.getPapeis();
	}

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		return this.dao.setPapel(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');
		data.nome = stringObrigatoria(data.nome, 'Nome');

		return this.dao.updatePapel(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deletePapel(id);
	}
}
