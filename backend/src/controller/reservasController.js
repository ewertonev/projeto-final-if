import { ReservasService } from '../services/reservasServices.js';

const service = new ReservasService();

export class ReservasController {
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

	static async detalhar(req, res, next) {
		try {
			const dados = await service.detalhar(req.params.id);

			if (!dados) {
				return res.status(404).json({
					erro: 'Reserva não encontrada',
				});
			}

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
