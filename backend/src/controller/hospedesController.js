import { HospedesService } from '../services/hospedesServices.js';

const service = new HospedesService();

export class HospedesController {
	static async listar(req, res, next) {
		try {
			const ativos =
				req.query.ativos === undefined
					? undefined
					: req.query.ativos === 'true';

			const dados = await service.listar(ativos);
			res.json(dados);
		} catch (error) {
			next(error);
		}
	}

	static async buscar(req, res, next) {
		try {
			const dados = await service.buscar(req.query);
			res.json(dados);
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
}
