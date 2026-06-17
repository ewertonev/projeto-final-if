async function carregarDadosDashboard() {
	try {
		const [reservas, hospedes, quartos, funcionarios, pagamentos] = await Promise.all([
			api('/reservas'),
			api('/hospedes'),
			api('/quartos'),
			api('/funcionarios'),
			api('/pagamentos').catch(() => []),
		]);

		const quartosLivres = quartos.filter((q) => q.estado === 'disponivel');
		const pagamentosPagos = pagamentos.filter((p) => p.estado === 'pago');
		const totalRecebido = pagamentosPagos.reduce((soma, p) => soma + Number(p.valor || 0), 0);

		document.getElementById('totalReservas').innerText = reservas.length;
		document.getElementById('totalHospedes').innerText = hospedes.length;
		document.getElementById('totalQuartosLivres').innerText = quartosLivres.length;
		document.getElementById('totalFuncionarios').innerText = funcionarios.length;
		document.getElementById('resumoSistema').innerText =
			`Sistema carregado com ${reservas.length} reserva(s), ${hospedes.length} hóspede(s), ` +
			`${quartos.length} quarto(s), ${funcionarios.length} funcionário(s) e ${dinheiro(totalRecebido)} recebido(s).`;
	} catch (erro) {
		console.error(erro);
		document.getElementById('resumoSistema').innerText = 'Não foi possível carregar o resumo do sistema.';
	}
}

function inicializarSessaoUsuario() {
	const usuario = usuarioLogado();
	const h1 = document.getElementById('boasVindas');

	if (usuario?.nome) {
		h1.innerText = `Bem-vindo, ${usuario.nome}`;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	inicializarSessaoUsuario();
	carregarDadosDashboard();
});
