let funcionarios = [];

function limparFormularioFuncionario() {
	document.getElementById('formFuncionario').reset();
	document.getElementById('idFuncionario').value = '';
	document.getElementById('ativoFuncionario').value = 'true';
	document.getElementById('senhaFuncionario').required = true;
	document.getElementById('tituloModalFuncionario').innerText = 'Cadastrar Funcionário';
}

async function carregarFuncionarios() {
	const tabela = document.getElementById('tabelaFuncionarios');

	try {
		funcionarios = await api('/funcionarios');

		if (funcionarios.length === 0) {
			tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionário cadastrado.</td></tr>';
			return;
		}

		tabela.innerHTML = funcionarios.map((funcionario) => {
			const status = funcionario.ativo ? 'ativo' : 'inativo';

			return `
				<tr>
					<td>${escaparHtml(funcionario.nome)}</td>
					<td>${escaparHtml(funcionario.email)}</td>
					<td>${escaparHtml(funcionario.telefone)}</td>
					<td>${formatarData(funcionario.data_nascimento)}</td>
					<td><span class="status-${status}">${status}</span></td>
					<td>
						<div class="acoes">
							<button type="button" class="btn-secundario" data-editar="${funcionario.id}">Editar</button>
							<button type="button" class="btn-perigo" data-excluir="${funcionario.id}">Excluir</button>
						</div>
					</td>
				</tr>
			`;
		}).join('');
	} catch (erro) {
		console.error(erro);
		tabela.innerHTML = '<tr><td colspan="6" style="color: red;">Não foi possível carregar os funcionários.</td></tr>';
	}
}

function editarFuncionario(id) {
	const funcionario = funcionarios.find((item) => Number(item.id) === Number(id));
	if (!funcionario) return;

	document.getElementById('idFuncionario').value = funcionario.id;
	document.getElementById('nomeFuncionario').value = funcionario.nome || '';
	document.getElementById('emailFuncionario').value = funcionario.email || '';
	document.getElementById('telefoneFuncionario').value = funcionario.telefone || '';
	document.getElementById('dataNascimentoFuncionario').value = dataParaInput(funcionario.data_nascimento);
	document.getElementById('senhaFuncionario').value = '';
	document.getElementById('senhaFuncionario').required = false;
	document.getElementById('ativoFuncionario').value = String(Boolean(funcionario.ativo));
	document.getElementById('tituloModalFuncionario').innerText = 'Editar Funcionário';
	abrirModal('modalFuncionario');
}

async function excluirFuncionario(id) {
	if (!confirm('Deseja excluir este funcionário?')) return;

	try {
		await api(`/funcionarios/${id}`, { method: 'DELETE' });
		await carregarFuncionarios();
	} catch (erro) {
		alert(erro.message);
	}
}

async function salvarFuncionario(evento) {
	evento.preventDefault();

	const id = document.getElementById('idFuncionario').value;
	const senha = document.getElementById('senhaFuncionario').value.trim();
	const dados = {
		nome: document.getElementById('nomeFuncionario').value.trim(),
		email: document.getElementById('emailFuncionario').value.trim() || null,
		telefone: document.getElementById('telefoneFuncionario').value.trim() || null,
		data_nascimento: document.getElementById('dataNascimentoFuncionario').value,
		ativo: document.getElementById('ativoFuncionario').value === 'true',
	};

	if (senha) dados.senha = senha;

	if (!dados.email && !dados.telefone) {
		alert('Informe pelo menos e-mail ou telefone.');
		return;
	}

	if (!id && !dados.senha) {
		alert('A senha é obrigatória ao cadastrar funcionário.');
		return;
	}

	try {
		if (id) {
			await enviarJson(`/funcionarios/${id}`, 'PUT', dados);
		} else {
			await enviarJson('/funcionarios', 'POST', dados);
		}

		fecharModal('modalFuncionario');
		limparFormularioFuncionario();
		await carregarFuncionarios();
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	carregarFuncionarios();

	document.getElementById('btnNovoFuncionario').addEventListener('click', () => {
		limparFormularioFuncionario();
		abrirModal('modalFuncionario');
	});

	document.getElementById('btnFecharModalFuncionario').addEventListener('click', () => {
		fecharModal('modalFuncionario');
		limparFormularioFuncionario();
	});

	document.getElementById('formFuncionario').addEventListener('submit', salvarFuncionario);

	document.getElementById('tabelaFuncionarios').addEventListener('click', (evento) => {
		const editar = evento.target.dataset.editar;
		const excluir = evento.target.dataset.excluir;

		if (editar) editarFuncionario(editar);
		if (excluir) excluirFuncionario(excluir);
	});
});
