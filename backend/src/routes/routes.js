import { Router } from 'express';
import { HospedesController } from '../controller/hospedesController.js';
import { TiposQuartosController } from '../controller/tiposQuartosController.js';
import { QuartosController } from '../controller/quartosController.js';
import { FuncionariosController } from '../controller/funcionariosController.js';
import { FormasPagamentoController } from '../controller/formasPagamentoController.js';
import { PagamentosController } from '../controller/pagamentosController.js';
import { ReservasController } from '../controller/reservasController.js';
import { AuthController } from '../controller/authController.js';

export const routes = Router();

routes.get('/', (req, res) => {
	res.json({ mensagem: 'API do hotel funcionando' });
});


routes.post('/auth/login', AuthController.login);

routes.get('/hospedes', HospedesController.listar);
routes.get('/hospedes/buscar', HospedesController.buscar);
routes.post('/hospedes', HospedesController.criar);
routes.put('/hospedes/:id', HospedesController.atualizar);
routes.delete('/hospedes/:id', HospedesController.deletar);

routes.get('/tipos-quartos', TiposQuartosController.listar);
routes.get('/tipos-quartos/buscar', TiposQuartosController.buscar);
routes.post('/tipos-quartos', TiposQuartosController.criar);
routes.put('/tipos-quartos/:id', TiposQuartosController.atualizar);
routes.delete('/tipos-quartos/:id', TiposQuartosController.deletar);

routes.get('/quartos', QuartosController.listar);
routes.get('/quartos/buscar', QuartosController.buscar);
routes.get('/quartos/intervalos/hoje', QuartosController.intervalosHoje);
routes.get('/quartos/intervalos/data', QuartosController.intervalosData);
routes.get('/quartos/disponiveis', QuartosController.disponiveisNoIntervalo);
routes.post('/quartos', QuartosController.criar);
routes.put('/quartos/:id', QuartosController.atualizar);
routes.delete('/quartos/:id', QuartosController.deletar);

routes.get('/funcionarios', FuncionariosController.listar);
routes.get('/funcionarios/buscar', FuncionariosController.buscar);
routes.post('/funcionarios', FuncionariosController.criar);
routes.put('/funcionarios/:id', FuncionariosController.atualizar);
routes.delete('/funcionarios/:id', FuncionariosController.deletar);

routes.get('/formas-pagamento', FormasPagamentoController.listar);
routes.get('/formas-pagamento/buscar', FormasPagamentoController.buscar);
routes.post('/formas-pagamento', FormasPagamentoController.criar);
routes.put('/formas-pagamento/:id', FormasPagamentoController.atualizar);
routes.delete('/formas-pagamento/:id', FormasPagamentoController.deletar);

routes.get('/reservas', ReservasController.listar);
routes.get('/reservas/buscar', ReservasController.buscar);
routes.get('/reservas/:id', ReservasController.detalhar);
routes.post('/reservas', ReservasController.criar);
routes.put('/reservas/:id', ReservasController.atualizar);
routes.delete('/reservas/:id', ReservasController.deletar);

routes.get('/pagamentos', PagamentosController.listar);
routes.get('/pagamentos/buscar', PagamentosController.buscar);
routes.get('/reservas/:idReserva/pagamentos', PagamentosController.listarPorReserva);
routes.post('/pagamentos', PagamentosController.criar);
routes.put('/pagamentos/:id', PagamentosController.atualizar);
routes.delete('/pagamentos/:id', PagamentosController.deletar);
