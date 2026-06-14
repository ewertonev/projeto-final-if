import { Router } from 'express';

import { HospedesController } from './controllers/hospedesController.js';
import { TiposQuartosController } from './controllers/tiposQuartosController.js';
import { QuartosController } from './controllers/quartosController.js';
import { FuncionariosController } from './controllers/funcionariosController.js';
import { FormasPagamentoController } from './controllers/formasPagamentoController.js';
import { PapeisController } from './controllers/papeisController.js';
import { ServicosController } from './controllers/servicosController.js';
import { ConsumosController } from './controllers/consumosController.js';
import { PagamentosController } from './controllers/pagamentosController.js';
import { ReservasController } from './controllers/reservasController.js';

export const routes = Router();

routes.get('/', (req, res) => {
	res.json({ mensagem: 'API do hotel funcionando' });
});

// Hóspedes
routes.get('/hospedes', HospedesController.listar);
routes.get('/hospedes/buscar', HospedesController.buscar);
routes.post('/hospedes', HospedesController.criar);
routes.put('/hospedes/:id', HospedesController.atualizar);
routes.delete('/hospedes/:id', HospedesController.deletar);

// Tipos de quartos
routes.get('/tipos-quartos', TiposQuartosController.listar);
routes.get('/tipos-quartos/buscar', TiposQuartosController.buscar);
routes.post('/tipos-quartos', TiposQuartosController.criar);
routes.put('/tipos-quartos/:id', TiposQuartosController.atualizar);
routes.delete('/tipos-quartos/:id', TiposQuartosController.deletar);

// Quartos
routes.get('/quartos', QuartosController.listar);
routes.get('/quartos/buscar', QuartosController.buscar);
routes.get('/quartos/intervalos/hoje', QuartosController.intervalosHoje);
routes.get('/quartos/intervalos/data', QuartosController.intervalosData);
routes.get('/quartos/disponiveis', QuartosController.disponiveisNoIntervalo);
routes.post('/quartos', QuartosController.criar);
routes.put('/quartos/:id', QuartosController.atualizar);
routes.delete('/quartos/:id', QuartosController.deletar);

// Funcionários
routes.get('/funcionarios', FuncionariosController.listar);
routes.get('/funcionarios/buscar', FuncionariosController.buscar);
routes.post('/funcionarios', FuncionariosController.criar);
routes.put('/funcionarios/:id', FuncionariosController.atualizar);
routes.put('/funcionarios/:id/papeis', FuncionariosController.atualizarPapeis);
routes.delete('/funcionarios/:id', FuncionariosController.deletar);

// Formas de pagamento
routes.get('/formas-pagamento', FormasPagamentoController.listar);
routes.get('/formas-pagamento/buscar', FormasPagamentoController.buscar);
routes.post('/formas-pagamento', FormasPagamentoController.criar);
routes.put('/formas-pagamento/:id', FormasPagamentoController.atualizar);
routes.delete('/formas-pagamento/:id', FormasPagamentoController.deletar);

// Papéis
routes.get('/papeis', PapeisController.listar);
routes.post('/papeis', PapeisController.criar);
routes.put('/papeis/:id', PapeisController.atualizar);
routes.delete('/papeis/:id', PapeisController.deletar);

// Serviços
routes.get('/servicos', ServicosController.listar);
routes.get('/servicos/buscar', ServicosController.buscar);
routes.post('/servicos', ServicosController.criar);
routes.put('/servicos/:id', ServicosController.atualizar);
routes.delete('/servicos/:id', ServicosController.deletar);

// Reservas
routes.get('/reservas', ReservasController.listar);
routes.get('/reservas/buscar', ReservasController.buscar);
routes.get('/reservas/:id', ReservasController.detalhar);
routes.post('/reservas', ReservasController.criar);
routes.put('/reservas/:id', ReservasController.atualizar);
routes.delete('/reservas/:id', ReservasController.deletar);

// Pagamentos
routes.get('/pagamentos', PagamentosController.listar);
routes.get('/pagamentos/buscar', PagamentosController.buscar);
routes.get(
	'/reservas/:idReserva/pagamentos',
	PagamentosController.listarPorReserva,
);
routes.post('/pagamentos', PagamentosController.criar);
routes.put('/pagamentos/:id', PagamentosController.atualizar);
routes.delete('/pagamentos/:id', PagamentosController.deletar);

// Consumos
routes.get('/consumos', ConsumosController.listar);
routes.get('/consumos/:id', ConsumosController.buscar);
routes.get(
	'/reservas/:idReserva/consumos',
	ConsumosController.listarPorReserva,
);
routes.post('/consumos', ConsumosController.criar);
routes.put('/consumos/:id', ConsumosController.atualizar);
routes.delete('/consumos/:id', ConsumosController.deletar);
