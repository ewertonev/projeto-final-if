const API_URL = 'http://localhost:8080';

async function api(path, options = {}) {
	const config = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	};

	const resposta = await fetch(`${API_URL}${path}`, config);
	const texto = await resposta.text();
	let dados = null;

	if (texto) {
		try {
			dados = JSON.parse(texto);
		} catch {
			dados = texto;
		}
	}

	if (!resposta.ok) {
		const mensagem = dados?.mensagem || dados?.erro || 'Erro na comunicação com o servidor.';
		throw new Error(mensagem);
	}

	return dados;
}

function enviarJson(path, metodo, dados) {
	return api(path, {
		method: metodo,
		body: JSON.stringify(dados),
	});
}

function escaparHtml(valor) {
	return String(valor ?? '---')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

function formatarData(valor) {
	if (!valor) return '---';
	return new Date(valor).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function dataParaInput(valor) {
	if (!valor) return '';
	return String(valor).slice(0, 10);
}

function dinheiro(valor) {
	return Number(valor || 0).toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
}

function abrirModal(id) {
	document.getElementById(id)?.classList.add('aberto');
}

function fecharModal(id) {
	document.getElementById(id)?.classList.remove('aberto');
}

function sair() {
	localStorage.removeItem('usuario');
	window.location.href = '../index.html';
}

function usuarioLogado() {
	try {
		return JSON.parse(localStorage.getItem('usuario')) || null;
	} catch {
		return null;
	}
}

function protegerPagina() {
	const caminho = window.location.pathname;
	const estaNoLogin = caminho.endsWith('/index.html') || caminho.endsWith('/frontend/') || caminho.endsWith('/frontend');

	if (!estaNoLogin && !usuarioLogado()) {
		window.location.href = '../index.html';
	}
}

protegerPagina();
