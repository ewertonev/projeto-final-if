import { FormasPagamentoDao } from '../repository/formasPagamentoDao.js';
import { inteiroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

export class FormasPagamentosService {
	constructor() {
		this.dao = new FormasPagamentoDao();
	}

	listar(ativos) {
		return this.dao.getFormasPagamento(ativos);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getFormaPagamento(consulta);
	}

	criar(data) {
		data.nome = stringObrigatoria(data.nome, 'Nome');
		return this.dao.setFormaPagamento(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.nome !== undefined) {
			data.nome = stringObrigatoria(data.nome, 'Nome');
		}

		return this.dao.updateFormaPagamento(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteFormaPagamento(id);
	}
}
