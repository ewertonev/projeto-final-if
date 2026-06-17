import { QuartosService } from '../services/quartosServices.js';

const service = new QuartosService();

export class QuartosController {
	static async listar(req, res, next) {
		try {
			const disponiveis =
				req.query.disponiveis === undefined
					? undefined
					: req.query.disponiveis === 'true';

			res.json(await service.listar(disponiveis));
		} catch (error) {
			next(error);
		}
	}

	static async buscar(req, res, next) {
		try {
			res.json(await service.buscar(req.query));
		} catch (error) {
			next(error);
		}
	}

	static async criar(req, res, next) {
		try {
			const id = await service.criar(req.body);
			res.status(201).json({ id });
		} catch (error) {
			next(error);
		}
	}

	static async atualizar(req, res, next) {
		try {
			const ok = await service.atualizar({
				...req.body,
				id: req.params.id,
			});
			res.json({ atualizado: ok });
		} catch (error) {
			next(error);
		}
	}

	static async deletar(req, res, next) {
		try {
			const ok = await service.deletar(req.params.id);
			res.json({ deletado: ok });
		} catch (error) {
			next(error);
		}
	}

	static async intervalosHoje(req, res, next) {
		try {
			res.json(await service.intervalosAPartirDeHoje(req.query));
		} catch (error) {
			next(error);
		}
	}

	static async intervalosData(req, res, next) {
		try {
			res.json(await service.intervalosAPartirDeData(req.query));
		} catch (error) {
			next(error);
		}
	}

	static async disponiveisNoIntervalo(req, res, next) {
		try {
			res.json(await service.disponiveisNoIntervalo(req.query));
		} catch (error) {
			next(error);
		}
	}
}
