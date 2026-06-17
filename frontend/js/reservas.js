let reservas = [];
let hospedes = [];
let quartos = [];

function limparFormularioReserva() {
	document.getElementById('formReserva').reset();
	document.getElementById('idReserva').value = '';
	document.getElementById('estadoReserva').value = 'confirmada';
	document.getElementById('qtdHospedes').value = 1;
	document.getElementById('tituloModalReserva').innerText = 'Criar Reserva';
}

async function carregarOpcoesReserva() {
	[hospedes, quartos] = await Promise.all([
		api('/hospedes?ativos=true'),
		api('/quartos'),
	]);

	document.getElementById('selectHospede').innerHTML = hospedes.map((hospede) => `
		<option value="${hospede.id}">${escaparHtml(hospede.nome)}</option>
	`).join('');

	document.getElementById('selectQuarto').innerHTML = quartos.map((quarto) => `
		<option value="${quarto.id}">Quarto ${escaparHtml(quarto.numero)} - ${escaparHtml(quarto.tipo_quarto)} - ${escaparHtml(quarto.estado)}</option>
	`).join('');
}

async function carregarReservas() {
	const tabela = document.getElementById('tabelaReservas');

	try {
		reservas = await api('/reservas');

		if (reservas.length === 0) {
			tabela.innerHTML = '<tr><td colspan="7">Nenhuma reserva cadastrada.</td></tr>';
			return;
		}

		tabela.innerHTML = reservas.map((reserva) => `
			<tr>
				<td>${escaparHtml(reserva.hospede_nome)}</td>
				<td>${escaparHtml(reserva.numero_quarto)} - ${escaparHtml(reserva.tipo_quarto)}</td>
				<td>${formatarData(reserva.inicio)}</td>
				<td>${formatarData(reserva.fim)}</td>
				<td>${escaparHtml(reserva.quantidade_hospedes)}</td>
				<td><span class="status-${reserva.estado}">${escaparHtml(reserva.estado)}</span></td>
				<td>
					<div class="acoes">
						<button type="button" class="btn-secundario" data-editar="${reserva.id}">Editar</button>
						<button type="button" class="btn-perigo" data-excluir="${reserva.id}">Excluir</button>
					</div>
				</td>
			</tr>
		`).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="7" style="color: red;">Não foi possível carregar as reservas.</td></tr>';
	}
}

async function editarReserva(id) {
	const reserva = reservas.find((item) => Number(item.id) === Number(id));
	if (!reserva) return;

	await carregarOpcoesReserva();

	document.getElementById('idReserva').value = reserva.id;
	document.getElementById('selectHospede').value = reserva.id_hospede;
	document.getElementById('selectQuarto').value = reserva.id_quarto;
	document.getElementById('dataInicio').value = dataParaInput(reserva.inicio);
	document.getElementById('dataFim').value = dataParaInput(reserva.fim);
	document.getElementById('qtdHospedes').value = reserva.quantidade_hospedes;
	document.getElementById('estadoReserva').value = reserva.estado || 'confirmada';
	document.getElementById('tituloModalReserva').innerText = 'Editar Reserva';
	abrirModal('modalReserva');
}

async function excluirReserva(id) {
	if (!confirm('Deseja excluir esta reserva?')) return;

	try {
		await api(`/reservas/${id}`, { method: 'DELETE' });
		await carregarReservas();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarReserva(evento) {
	evento.preventDefault();

	const id = document.getElementById('idReserva').value;
	const dados = {
		id_hospede: Number(document.getElementById('selectHospede').value),
		id_quarto: Number(document.getElementById('selectQuarto').value),
		inicio: document.getElementById('dataInicio').value,
		fim: document.getElementById('dataFim').value,
		quantidade_hospedes: Number(document.getElementById('qtdHospedes').value),
		estado: document.getElementById('estadoReserva').value,
	};

	try {
		if (id) {
			await enviarJson(`/reservas/${id}`, 'PUT', dados);
		} else {
			delete dados.estado;
			await enviarJson('/reservas', 'POST', dados);
		}

		fecharModal('modalReserva');
		limparFormularioReserva();
		await carregarReservas();
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	carregarReservas();

	document.getElementById('btnNovaReserva').addEventListener('click', async () => {
		try {
			limparFormularioReserva();
			await carregarOpcoesReserva();
			abrirModal('modalReserva');
		} catch (erro) {
			alert('Cadastre hóspedes e quartos antes de criar uma reserva.');
		}
	});

	document.getElementById('btnFecharModalReserva').addEventListener('click', () => {
		fecharModal('modalReserva');
		limparFormularioReserva();
	});

	document.getElementById('formReserva').addEventListener('submit', salvarReserva);

	document.getElementById('tabelaReservas').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editar;
		const excluir = evento.target.dataset.excluir;

		if (editar) editarReserva(editar);
		if (excluir) excluirReserva(excluir);
	});
});
