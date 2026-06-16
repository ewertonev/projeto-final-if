import { PagamentosService } from '../services/pagamentosServices.js';

const service = new PagamentosService();

export class PagamentosController {
	static async listar(req, res, next) {
		try {
			res.json(await service.listar());
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

	static async listarPorReserva(req, res, next) {
		try {
			res.json(await service.listarPorReserva(req.params.idReserva));
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
