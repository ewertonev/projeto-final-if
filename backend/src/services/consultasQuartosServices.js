import { ConsultasQuartos } from '../repository/consultaQuartosDisponiveis.js';
import { dataValida } from '../validators/datas.js';
import { inteiroPositivo } from '../validators/numeros.js';

export class ConsultasQuartosService {
	constructor() {
		this.dao = new ConsultasQuartos();
	}

	listarComReservasAPartirDe(data = {}) {
		const filtros = this.validarFiltros(data, false);
		return this.dao.getQuartosComReservasAPartirDe(filtros);
	}

	listarIntervalosAPartirDe(data = {}) {
		const filtros = this.validarFiltros(data, false);
		return this.dao.getIntervalosDisponiveisAPartirDe(filtros);
	}

	listarDisponiveisNoIntervalo(data) {
		const filtros = this.validarFiltros(data, true);
		return this.dao.getQuartosDisponiveisNoIntervalo(filtros);
	}

	validarFiltros(data = {}, exigirIntervalo = false) {
		const filtros = {};

		if (data.id_tipo_quarto !== undefined) {
			filtros.id_tipo_quarto = inteiroPositivo(
				data.id_tipo_quarto,
				'ID do tipo de quarto',
			);
		}

		if (data.data_base !== undefined) {
			filtros.data_base = dataValida(data.data_base, 'Data base');
		}

		if (exigirIntervalo) {
			filtros.inicio = dataValida(data.inicio, 'Data inicial');
			filtros.fim = dataValida(data.fim, 'Data final');

			if (new Date(filtros.inicio) >= new Date(filtros.fim)) {
				throw new Error('Data inicial deve ser menor que a data final');
			}
		}

		return filtros;
	}
}
