let quartos = [];
let tiposQuartos = [];

function limparFormularioQuarto() {
	document.getElementById('formQuarto').reset();
	document.getElementById('idQuarto').value = '';
	document.getElementById('estadoQuarto').value = 'disponivel';
	document.getElementById('tituloModalQuarto').innerText = 'Cadastrar Quarto';
}

async function carregarTiposQuartos() {
	tiposQuartos = await api('/tipos-quartos?ativos=true');
	const select = document.getElementById('tipoQuarto');
	select.innerHTML = tiposQuartos.map((tipo) => `
		<option value="${tipo.id}">${escaparHtml(tipo.nome)} - ${dinheiro(tipo.valor_diaria)}</option>
	`).join('');
}

async function carregarQuartos() {
	const tabela = document.getElementById('tabelaQuartos');

	try {
		quartos = await api('/quartos');

		const disponiveis = quartos.filter((q) => q.estado === 'disponivel').length;
		const limpeza = quartos.filter((q) => q.estado === 'limpeza').length;
		const manutencao = quartos.filter((q) => q.estado === 'manutencao').length;

		document.getElementById('cardDisponiveis').innerText = disponiveis;
		document.getElementById('cardLimpeza').innerText = limpeza;
		document.getElementById('cardManutencao').innerText = manutencao;

		if (quartos.length === 0) {
			tabela.innerHTML = '<tr><td colspan="6">Nenhum quarto cadastrado.</td></tr>';
			return;
		}

		tabela.innerHTML = quartos.map((quarto) => `
			<tr>
				<td>${escaparHtml(quarto.numero)}</td>
				<td>${escaparHtml(quarto.andar)}</td>
				<td>${escaparHtml(quarto.tipo_quarto)}</td>
				<td><span class="status-${quarto.estado}">${escaparHtml(quarto.estado)}</span></td>
				<td>${dinheiro(quarto.valor_diaria)}</td>
				<td>
					<div class="acoes">
						<button type="button" class="btn-secundario" data-editar="${quarto.id}">Editar</button>
						<button type="button" class="btn-perigo" data-excluir="${quarto.id}">Excluir</button>
					</div>
				</td>
			</tr>
		`).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="6" style="color: red;">Não foi possível carregar os quartos.</td></tr>';
	}
}

function editarQuarto(id) {
	const quarto = quartos.find((item) => Number(item.id) === Number(id));
	if (!quarto) return;

	document.getElementById('idQuarto').value = quarto.id;
	document.getElementById('numeroQuarto').value = quarto.numero || '';
	document.getElementById('andarQuarto').value = quarto.andar || '';
	document.getElementById('tipoQuarto').value = quarto.id_tipo_quarto;
	document.getElementById('estadoQuarto').value = quarto.estado || 'disponivel';
	document.getElementById('tituloModalQuarto').innerText = 'Editar Quarto';
	abrirModal('modalQuarto');
}

async function excluirQuarto(id) {
	if (!confirm('Deseja excluir este quarto?')) return;

	try {
		await api(`/quartos/${id}`, { method: 'DELETE' });
		await carregarQuartos();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarQuarto(evento) {
	evento.preventDefault();

	const id = document.getElementById('idQuarto').value;
	const dados = {
		numero: document.getElementById('numeroQuarto').value.trim(),
		andar: Number(document.getElementById('andarQuarto').value),
		id_tipo_quarto: Number(document.getElementById('tipoQuarto').value),
		estado: document.getElementById('estadoQuarto').value,
	};

	try {
		if (id) {
			await enviarJson(`/quartos/${id}`, 'PUT', dados);
		} else {
			await enviarJson('/quartos', 'POST', dados);
		}

		fecharModal('modalQuarto');
		limparFormularioQuarto();
		await carregarQuartos();
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	try {
		await carregarTiposQuartos();
	} catch (erro) {
		alert('Não foi possível carregar os tipos de quarto. Inicialize o banco antes de cadastrar quartos.');
	}

	carregarQuartos();

	document.getElementById('btnNovoQuarto').addEventListener('click', () => {
		limparFormularioQuarto();
		abrirModal('modalQuarto');
	});

	document.getElementById('btnFecharModalQuarto').addEventListener('click', () => {
		fecharModal('modalQuarto');
		limparFormularioQuarto();
	});

	document.getElementById('formQuarto').addEventListener('submit', salvarQuarto);

	document.getElementById('tabelaQuartos').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editar;
		const excluir = evento.target.dataset.excluir;

		if (editar) editarQuarto(editar);
		if (excluir) excluirQuarto(excluir);
	});
});
