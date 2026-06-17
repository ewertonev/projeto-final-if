async function entrar() {
	const usuario = document.getElementById('usuario').value.trim();
	const senha = document.getElementById('senha').value.trim();

	if (usuario === '' || senha === '') {
		alert('Preencha funcionário e senha.');
		return;
	}

	try {
		const resposta = await enviarJson('/auth/login', 'POST', {
			usuario,
			senha,
		});

		localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
		window.location.href = 'pages/dashboard.html';
	} catch (erro) {
		alert(erro.message);
	}
}

document.addEventListener('keydown', (evento) => {
	if (evento.key === 'Enter') {
		entrar();
	}
});
