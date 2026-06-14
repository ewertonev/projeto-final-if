import { ReservaDao } from '../repository/reservasDao.js';
import {
	dataValida,
	estadoValido,
	inteiroPositivo,
	stringObrigatoria,
} from '../validators/index.js';

const ESTADOS_RESERVA = ['confirmada', 'finalizada', 'cancelada', 'faltou'];

function validarIntervalo(inicio, fim) {
	if (
		inicio !== undefined &&
		fim !== undefined &&
		new Date(inicio) >= new Date(fim)
	) {
		throw new Error('Data inicial deve ser menor que a data final');
	}
}

export class ReservasService {
	constructor() {
		this.dao = new ReservaDao();
	}

	listar() {
		return this.dao.getReservas();
	}

	buscar(consulta) {
		consulta.tipo = stringObrigatoria(consulta.tipo, 'Tipo');
		consulta.valor = stringObrigatoria(String(consulta.valor), 'Valor');

		return this.dao.getReserva(consulta);
	}

	criar(data) {
		data.id_hospede = inteiroPositivo(data.id_hospede, 'ID do hóspede');
		data.id_quarto = inteiroPositivo(data.id_quarto, 'ID do quarto');
		data.inicio = dataValida(data.inicio, 'Data inicial');
		data.fim = dataValida(data.fim, 'Data final');
		data.quantidade_hospedes = inteiroPositivo(
			data.quantidade_hospedes,
			'Quantidade de hóspedes',
		);

		validarIntervalo(data.inicio, data.fim);

		return this.dao.setReserva(data);
	}

	atualizar(data) {
		data.id = inteiroPositivo(data.id, 'ID');

		if (data.id_hospede !== undefined) {
			data.id_hospede = inteiroPositivo(data.id_hospede, 'ID do hóspede');
		}

		if (data.id_quarto !== undefined) {
			data.id_quarto = inteiroPositivo(data.id_quarto, 'ID do quarto');
		}

		if (data.inicio !== undefined) {
			data.inicio = dataValida(data.inicio, 'Data inicial');
		}

		if (data.fim !== undefined) {
			data.fim = dataValida(data.fim, 'Data final');
		}

		if (data.quantidade_hospedes !== undefined) {
			data.quantidade_hospedes = inteiroPositivo(
				data.quantidade_hospedes,
				'Quantidade de hóspedes',
			);
		}

		if (data.estado !== undefined) {
			data.estado = estadoValido(
				data.estado,
				ESTADOS_RESERVA,
				'Estado da reserva',
			);
		}

		validarIntervalo(data.inicio, data.fim);

		return this.dao.updateReserva(data);
	}

	deletar(id) {
		id = inteiroPositivo(id, 'ID');
		return this.dao.deleteReserva(id);
	}
}
