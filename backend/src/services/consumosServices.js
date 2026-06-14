import { ConsumoDao } from '../repository/consumosDao.js';
import { estadoValido } from '../validators/estados.js';
import { inteiroPositivo, numeroPositivo } from '../validators/numeros.js';

const ESTADOS_CONSUMO = ['pendente', 'pago', 'cancelado'];

export class ConsumosService {
	constructor() {
		this.dao = new ConsumoDao();
	}

	listar() {
		return this.dao.getConsumos();
	}

	listarPorReserva(idReserva) {
		idReserva = inteiroPositivo(idReserva, 'ID da reserva');
		return this.dao.getConsumosPorReserva(idReserva);
	}

	buscar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.getConsumo(id);
	}

	criar(data) {
		data.id_reserva = inteiroPositivo(data.id_reserva, 'ID da reserva');
		data.id_servico = inteiroPositivo(data.id_servico, 'ID do serviço');
		data.valor_unitario = numeroPositivo(data.valor_unitario, 'Valor unitário');
		data.quantidade = inteiroPositivo(data.quantidade ?? 1, 'Quantidade');

		if (data.forma_pagamento !== undefined && data.forma_pagamento !== null) {
			data.forma_pagamento = inteiroPositivo(
				data.forma_pagamento,
				'ID da forma de pagamento',
			);
		}

		if (data.descricao !== undefined && data.descricao !== null) {
			data.descricao = String(data.descricao).trim();
		}

		return this.dao.setConsumo(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.id_reserva !== undefined) {
			data.id_reserva = inteiroPositivo(data.id_reserva, 'ID da reserva');
		}

		if (data.id_servico !== undefined) {
			data.id_servico = inteiroPositivo(data.id_servico, 'ID do serviço');
		}

		if (data.forma_pagamento !== undefined && data.forma_pagamento !== null) {
			data.forma_pagamento = inteiroPositivo(
				data.forma_pagamento,
				'ID da forma de pagamento',
			);
		}

		if (data.valor_unitario !== undefined) {
			data.valor_unitario = numeroPositivo(data.valor_unitario, 'Valor unitário');
		}

		if (data.quantidade !== undefined) {
			data.quantidade = inteiroPositivo(data.quantidade, 'Quantidade');
		}

		if (data.estado !== undefined) {
			data.estado = estadoValido(data.estado, ESTADOS_CONSUMO, 'Estado do consumo');
		}

		if (data.descricao !== undefined && data.descricao !== null) {
			data.descricao = String(data.descricao).trim();
		}

		return this.dao.updateConsumo(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteConsumo(id);
	}
}
