let pagamentos = [];
let formasPagamento = [];
let reservas = [];

function limparFormularioPagamento() {
	document.getElementById('formPagamento').reset();
	document.getElementById('idPagamento').value = '';
	document.getElementById('estadoPagamento').value = 'pendente';
	document.getElementById('tituloModalPagamento').innerText = 'Cadastrar Pagamento';
}

function limparFormularioForma() {
	document.getElementById('formForma').reset();
	document.getElementById('idForma').value = '';
	document.getElementById('ativoForma').value = 'true';
	document.getElementById('tituloModalForma').innerText = 'Cadastrar Forma';
}

async function carregarOpcoesFinanceiro() {
	[reservas, formasPagamento] = await Promise.all([
		api('/reservas'),
		api('/formas-pagamento'),
	]);

	document.getElementById('selectReservaPagamento').innerHTML = reservas.map((reserva) => `
		<option value="${reserva.id}">#${reserva.id} - ${escaparHtml(reserva.hospede_nome)} - Quarto ${escaparHtml(reserva.numero_quarto)}</option>
	`).join('');

	document.getElementById('selectFormaPagamento').innerHTML = formasPagamento
		.filter((forma) => forma.ativo)
		.map((forma) => `<option value="${forma.id}">${escaparHtml(forma.nome)}</option>`)
		.join('');
}

async function carregarPagamentos() {
	const tabela = document.getElementById('tabelaPagamentos');

	try {
		pagamentos = await api('/pagamentos');

		const totalRecebido = pagamentos
			.filter((p) => p.estado === 'pago')
			.reduce((soma, p) => soma + Number(p.valor || 0), 0);

		const totalPendente = pagamentos
			.filter((p) => p.estado === 'pendente')
			.reduce((soma, p) => soma + Number(p.valor || 0), 0);

		document.getElementById('totalRecebido').innerText = dinheiro(totalRecebido);
		document.getElementById('totalPendente').innerText = dinheiro(totalPendente);
		document.getElementById('qtdPagamentos').innerText = pagamentos.length;

		if (pagamentos.length === 0) {
			tabela.innerHTML = '<tr><td colspan="6">Nenhum pagamento cadastrado.</td></tr>';
			return;
		}

		tabela.innerHTML = pagamentos.map((pagamento) => `
			<tr>
				<td>#${escaparHtml(pagamento.id_reserva)}</td>
				<td>${dinheiro(pagamento.valor)}</td>
				<td>${escaparHtml(pagamento.forma_pagamento_nome)}</td>
				<td><span class="status-${pagamento.estado}">${escaparHtml(pagamento.estado)}</span></td>
				<td>${pagamento.pago_em ? formatarData(pagamento.pago_em) : '---'}</td>
				<td>
					<div class="acoes">
						<button type="button" class="btn-secundario" data-editar-pagamento="${pagamento.id}">Editar</button>
						<button type="button" class="btn-perigo" data-excluir-pagamento="${pagamento.id}">Excluir</button>
					</div>
				</td>
			</tr>
		`).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="6" style="color: red;">Não foi possível carregar os pagamentos.</td></tr>';
	}
}

async function carregarFormasPagamento() {
	const tabela = document.getElementById('tabelaFormas');

	try {
		formasPagamento = await api('/formas-pagamento');

		if (formasPagamento.length === 0) {
			tabela.innerHTML = '<tr><td colspan="3">Nenhuma forma cadastrada.</td></tr>';
			return;
		}

		tabela.innerHTML = formasPagamento.map((forma) => {
			const status = forma.ativo ? 'ativo' : 'inativo';

			return `
				<tr>
					<td>${escaparHtml(forma.nome)}</td>
					<td><span class="status-${status}">${status}</span></td>
					<td>
						<div class="acoes">
							<button type="button" class="btn-secundario" data-editar-forma="${forma.id}">Editar</button>
							<button type="button" class="btn-perigo" data-excluir-forma="${forma.id}">Desativar</button>
						</div>
					</td>
				</tr>
			`;
		}).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="3" style="color: red;">Não foi possível carregar as formas.</td></tr>';
	}
}

async function editarPagamento(id) {
	const pagamento = pagamentos.find((item) => Number(item.id) === Number(id));
	if (!pagamento) return;

	await carregarOpcoesFinanceiro();

	document.getElementById('idPagamento').value = pagamento.id;
	document.getElementById('selectReservaPagamento').value = pagamento.id_reserva;
	document.getElementById('valorPagamento').value = pagamento.valor;
	document.getElementById('selectFormaPagamento').value = pagamento.forma_pagamento;
	document.getElementById('estadoPagamento').value = pagamento.estado || 'pendente';
	document.getElementById('tituloModalPagamento').innerText = 'Editar Pagamento';
	abrirModal('modalPagamento');
}

function editarForma(id) {
	const forma = formasPagamento.find((item) => Number(item.id) === Number(id));
	if (!forma) return;

	document.getElementById('idForma').value = forma.id;
	document.getElementById('nomeForma').value = forma.nome || '';
	document.getElementById('ativoForma').value = String(Boolean(forma.ativo));
	document.getElementById('tituloModalForma').innerText = 'Editar Forma';
	abrirModal('modalForma');
}

async function excluirPagamento(id) {
	if (!confirm('Deseja excluir este pagamento?')) return;

	try {
		await api(`/pagamentos/${id}`, { method: 'DELETE' });
		await carregarPagamentos();
	} catch (erro) {
		alert(erro.message);
	}
}

async function excluirForma(id) {
	if (!confirm('Deseja desativar esta forma de pagamento?')) return;

	try {
		await api(`/formas-pagamento/${id}`, { method: 'DELETE' });
		await carregarFormasPagamento();
		await carregarOpcoesFinanceiro();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarPagamento(evento) {
	evento.preventDefault();

	const id = document.getElementById('idPagamento').value;
	const dados = {
		id_reserva: Number(document.getElementById('selectReservaPagamento').value),
		valor: Number(document.getElementById('valorPagamento').value),
		forma_pagamento: Number(document.getElementById('selectFormaPagamento').value),
		estado: document.getElementById('estadoPagamento').value,
	};

	try {
		if (id) {
			await enviarJson(`/pagamentos/${id}`, 'PUT', dados);
		} else {
			delete dados.estado;
			await enviarJson('/pagamentos', 'POST', dados);
		}

		fecharModal('modalPagamento');
		limparFormularioPagamento();
		await carregarPagamentos();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarForma(evento) {
	evento.preventDefault();

	const id = document.getElementById('idForma').value;
	const dados = {
		nome: document.getElementById('nomeForma').value.trim(),
		ativo: document.getElementById('ativoForma').value === 'true',
	};

	try {
		if (id) {
			await enviarJson(`/formas-pagamento/${id}`, 'PUT', dados);
		} else {
			await enviarJson('/formas-pagamento', 'POST', dados);
		}

		fecharModal('modalForma');
		limparFormularioForma();
		await carregarFormasPagamento();
		await carregarOpcoesFinanceiro();
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	await Promise.all([
		carregarPagamentos(),
		carregarFormasPagamento(),
	]);

	document.getElementById('btnNovoPagamento').addEventListener('click', async () => {
		try {
			limparFormularioPagamento();
			await carregarOpcoesFinanceiro();
			abrirModal('modalPagamento');
		} catch (erro) {
			alert('Cadastre uma reserva e uma forma de pagamento antes de criar pagamentos.');
		}
	});

	document.getElementById('btnNovaForma').addEventListener('click', () => {
		limparFormularioForma();
		abrirModal('modalForma');
	});

	document.getElementById('btnFecharModalPagamento').addEventListener('click', () => {
		fecharModal('modalPagamento');
		limparFormularioPagamento();
	});

	document.getElementById('btnFecharModalForma').addEventListener('click', () => {
		fecharModal('modalForma');
		limparFormularioForma();
	});

	document.getElementById('formPagamento').addEventListener('submit', salvarPagamento);
	document.getElementById('formForma').addEventListener('submit', salvarForma);

	document.getElementById('tabelaPagamentos').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editarPagamento;
		const excluir = evento.target.dataset.excluirPagamento;

		if (editar) editarPagamento(editar);
		if (excluir) excluirPagamento(excluir);
	});

	document.getElementById('tabelaFormas').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editarForma;
		const excluir = evento.target.dataset.excluirForma;

		if (editar) editarForma(editar);
		if (excluir) excluirForma(excluir);
	});
});
