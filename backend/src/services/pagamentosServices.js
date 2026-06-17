import { PagamentoDao } from '../repository/pagamentosDao.js';
import { estadoValido } from '../validators/estados.js';
import { inteiroPositivo, numeroPositivo } from '../validators/numeros.js';
import { stringObrigatoria } from '../validators/textos.js';

const ESTADOS_PAGAMENTO = ['pendente', 'pago', 'cancelado'];

export class PagamentosService {
	constructor() {
		this.dao = new PagamentoDao();
	}

	listar() {
		return this.dao.getPagamentos();
	}

	listarPorReserva(idReserva) {
		idReserva = inteiroPositivo(idReserva, 'ID da reserva');
		return this.dao.getPagamentosPorReserva(idReserva);
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getPagamento(consulta);
	}

	criar(data) {
		data.id_reserva = inteiroPositivo(data.id_reserva, 'ID da reserva');
		data.valor = numeroPositivo(data.valor, 'Valor');
		data.forma_pagamento = inteiroPositivo(
			data.forma_pagamento,
			'ID da forma de pagamento',
		);

		return this.dao.setPagamento(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.id_reserva !== undefined) {
			data.id_reserva = inteiroPositivo(data.id_reserva, 'ID da reserva');
		}

		if (data.valor !== undefined) {
			data.valor = numeroPositivo(data.valor, 'Valor');
		}

		if (data.forma_pagamento !== undefined) {
			data.forma_pagamento = inteiroPositivo(
				data.forma_pagamento,
				'ID da forma de pagamento',
			);
		}

		if (data.estado !== undefined) {
			data.estado = estadoValido(
				data.estado,
				ESTADOS_PAGAMENTO,
				'Estado do pagamento',
			);
		}

		return this.dao.updatePagamento(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deletePagamento(id);
	}
}
