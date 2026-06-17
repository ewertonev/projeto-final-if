const API = "http://localhost:8080";

async function carregarDadosDashboard() {
    try {
        const [resReservas, resHospedes, resQuartos] = await Promise.all([
            fetch(`${API}/reservas`),
            fetch(`${API}/hospedes`),
            fetch(`${API}/quartos`)
        ]);

        if (resReservas.ok) {
            const reservas = await resReservas.json();
            document.getElementById("totalReservas").innerText = reservas.length;
        } else {
            document.getElementById("totalReservas").innerText = "---";
        }

        if (resHospedes.ok) {
            const hospedes = await resHospedes.json();
            document.getElementById("totalHospedes").innerText = hospedes.length;
        } else {
            document.getElementById("totalHospedes").innerText = "---";
        }

        if (resQuartos.ok) {
            const quartos = await resQuartos.json();
            const livres = quartos.filter(q => {
                const status = q.estado ? q.estado.toLowerCase() : "";
                return status === "disponivel" || status === "disponível";
            });
            document.getElementById("totalQuartosLivres").innerText = livres.length;
        } else {
            document.getElementById("totalQuartosLivres").innerText = "---";
        }

    } catch (erro) {
        console.error("Erro ao carregar dados dinâmicos do painel:", erro);
        document.getElementById("totalReservas").innerText = "Erro";
        document.getElementById("totalHospedes").innerText = "Erro";
        document.getElementById("totalQuartosLivres").innerText = "Erro";
    }
}

function inicializarSessaoUsuario() {
    const nomeUsuarioSessao = localStorage.getItem("nomeUsuario") || sessionStorage.getItem("nomeUsuario");
    const h1BoasVindas = document.getElementById("boasVindas");
    
    if (h1BoasVindas) {
        if (nomeUsuarioSessao && nomeUsuarioSessao !== "1") {
            h1BoasVindas.innerText = `Bem-vindo, ${nomeUsuarioSessao}`;
        } else {
            h1BoasVindas.innerText = "Bem-vindo ao Painel";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarSessaoUsuario();
    carregarDadosDashboard();
});