import { FuncionariosService } from '../services/funcionariosServices.js';

const service = new FuncionariosService();

export class FuncionariosController {
	static async listar(req, res, next) {
		try {
			const ativos =
				req.query.ativos === undefined
					? undefined
					: req.query.ativos === 'true';

			res.json(await service.listar(ativos));
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

	static async atualizarPapeis(req, res, next) {
		try {
			const ok = await service.atualizarPapeis(
				req.params.id,
				req.body.papeis,
			);

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
