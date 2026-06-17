const API = "http://localhost:8080";

async function carregarReservas() {
    try {
        const resposta = await fetch(`${API}/reservas`);
        if (!resposta.ok) throw new Error("Erro ao buscar reservas.");

        const reservas = await resposta.json();
        const tabela = document.getElementById("tabelaReservas");
        if (!tabela) return;
        tabela.innerHTML = "";

        reservas.forEach(reserva => {
            const dataInicio = new Date(reserva.inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const dataFim = new Date(reserva.fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            const nomeHospede = reserva.nome_hospede || `Hóspede ID: ${reserva.id_hospede}`;
            const numQuarto = reserva.numero_quarto || `Quarto ID: ${reserva.id_quarto}`;

            tabela.innerHTML += `
                <tr>
                    <td>${nomeHospede}</td>
                    <td>${numQuarto}</td>
                    <td>${dataInicio}</td>
                    <td>${dataFim}</td>
                    <td>${reserva.quantidade_hospedes}</td>
                    <td><span class="status-${reserva.estado}">${reserva.estado}</span></td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro no GET de reservas:", erro);
        const tabela = document.getElementById("tabelaReservas");
        if (tabela) tabela.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Erro ao listar reservas.</td></tr>`;
    }
}

async function carregarOpcoesFormulario() {
    try {
        const [resHospedes, resQuartos] = await Promise.all([
            fetch(`${API}/hospedes`),
            fetch(`${API}/quartos`)
        ]);

        if (resHospedes.ok) {
            const hospedes = await resHospedes.json();
            const selectHospede = document.getElementById("selectHospede");
            if (selectHospede) {
                selectHospede.innerHTML = '<option value="">Selecione um Hóspede</option>';
                hospedes.forEach(h => selectHospede.innerHTML += `<option value="${h.id}">${h.nome}</option>`);
            }
        }

        if (resQuartos.ok) {
            const quartos = await resQuartos.json();
            const selectQuarto = document.getElementById("selectQuarto");
            if (selectQuarto) {
                selectQuarto.innerHTML = '<option value="">Selecione um Quarto'
                quartos.forEach(q => {
                    if (q.estado === 'disponivel' || q.estado === 'disponível') {
                        selectQuarto.innerHTML += `<option value="${q.id}">Quarto ${q.numero}</option>`;
                    }
                });
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar opções para o formulário:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarReservas();

    const modal = document.getElementById("modalReserva");
    const btnNovaReserva = document.getElementById("btnNovaReserva");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const formReserva = document.getElementById("formReserva");

    if (btnNovaReserva && modal) {
        btnNovaReserva.addEventListener("click", () => {
            modal.style.display = "flex";
            carregarOpcoesFormulario(); 
            }
        )
    }

    if (btnFecharModal && modal) {
        btnFecharModal.addEventListener("click", () => {
            modal.style.display = "none";
            formReserva.reset();
        });
    }

    if (formReserva) {
        formReserva.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dadosReserva = {
                id_hospede: Number(document.getElementById("selectHospede").value),
                id_quarto: Number(document.getElementById("selectQuarto").value),
                inicio: document.getElementById("dataInicio").value,
                fim: document.getElementById("dataFim").value,
                quantidade_hospedes: Number(document.getElementById("qtdHospedes").value),
                estado: "confirmada" 
            };

            try {
                const resposta = await fetch(`${API}/reservas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosReserva)
                });

                if (resposta.ok) {
                    alert("Reserva efetuada com sucesso!");
                    modal.style.display = "none";
                    formReserva.reset();
                    carregarReservas();
                } else {
                    const erroServidor = await resposta.json().catch(() => ({}));
                    alert(erroServidor.mensagem || "Erro ao salvar reserva. Verifique as datas.");
                }
            } catch (erro) {
                console.error("Erro no POST de reservas:", erro);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }
});