let hospedes = [];

function limparFormularioHospede() {
	document.getElementById('formHospede').reset();
	document.getElementById('idHospede').value = '';
	document.getElementById('tituloModalHospede').innerText = 'Cadastrar Hóspede';
}

async function carregarHospedes() {
	const tabela = document.getElementById('tabelaHospedes');

	try {
		hospedes = await api('/hospedes');

		if (hospedes.length === 0) {
			tabela.innerHTML = '<tr><td colspan="5">Nenhum hóspede cadastrado.</td></tr>';
			return;
		}

		tabela.innerHTML = hospedes.map((hospede) => `
			<tr>
				<td>${escaparHtml(hospede.nome)}</td>
				<td>${escaparHtml(hospede.email)}</td>
				<td>${escaparHtml(hospede.telefone)}</td>
				<td>${formatarData(hospede.data_nascimento)}</td>
				<td>
					<div class="acoes">
						<button type="button" class="btn-secundario" data-editar="${hospede.id}">Editar</button>
						<button type="button" class="btn-perigo" data-excluir="${hospede.id}">Excluir</button>
					</div>
				</td>
			</tr>
		`).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="5" style="color: red;">Não foi possível carregar os hóspedes.</td></tr>';
	}
}

function editarHospede(id) {
	const hospede = hospedes.find((item) => Number(item.id) === Number(id));
	if (!hospede) return;

	document.getElementById('idHospede').value = hospede.id;
	document.getElementById('nomeHospede').value = hospede.nome || '';
	document.getElementById('emailHospede').value = hospede.email || '';
	document.getElementById('telefoneHospede').value = hospede.telefone || '';
	document.getElementById('dataNascimentoHospede').value = dataParaInput(hospede.data_nascimento);
	document.getElementById('tituloModalHospede').innerText = 'Editar Hóspede';
	abrirModal('modalHospede');
}

async function excluirHospede(id) {
	if (!confirm('Deseja excluir este hóspede?')) return;

	try {
		await api(`/hospedes/${id}`, { method: 'DELETE' });
		await carregarHospedes();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarHospede(evento) {
	evento.preventDefault();

	const id = document.getElementById('idHospede').value;
	const dados = {
		nome: document.getElementById('nomeHospede').value.trim(),
		email: document.getElementById('emailHospede').value.trim() || null,
		telefone: document.getElementById('telefoneHospede').value.trim() || null,
		data_nascimento: document.getElementById('dataNascimentoHospede').value,
	};

	if (!dados.email && !dados.telefone) {
		alert('Informe pelo menos e-mail ou telefone.');
		return;
	}

	try {
		if (id) {
			await enviarJson(`/hospedes/${id}`, 'PUT', dados);
		} else {
			await enviarJson('/hospedes', 'POST', dados);
		}

		fecharModal('modalHospede');
		limparFormularioHospede();
		await carregarHospedes();
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	carregarHospedes();

	document.getElementById('btnNovoHospede').addEventListener('click', () => {
		limparFormularioHospede();
		abrirModal('modalHospede');
	});

	document.getElementById('btnFecharModalHospede').addEventListener('click', () => {
		fecharModal('modalHospede');
		limparFormularioHospede();
	});

	document.getElementById('formHospede').addEventListener('submit', salvarHospede);

	document.getElementById('tabelaHospedes').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editar;
		const excluir = evento.target.dataset.excluir;

		if (editar) editarHospede(editar);
		if (excluir) excluirHospede(excluir);
	});
});
