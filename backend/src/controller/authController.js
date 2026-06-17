import { FuncionariosService } from '../services/funcionariosServices.js';

const service = new FuncionariosService();

export class AuthController {
	static async login(req, res, next) {
		try {
			const funcionario = await service.login(req.body);
			res.json({
				sucesso: true,
				usuario: funcionario,
			});
		} catch (error) {
			next(error);
		}
	}
}
