const API = "http://localhost:8080";

// --- 1. FUNÇÃO PARA CARREGAR OS QUARTOS (GET) ---
async function carregarQuartos() {
    try {
        const resposta = await fetch(`${API}/quartos`);
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do servidor.");
        }

        const quartos = await resposta.json();
        const tabela = document.getElementById("tabelaQuartos");
        
        tabela.innerHTML = "";

        let disponiveis = 0;
        let ocupados = 0;
        let manutencao = 0;

        quartos.forEach(quarto => {
            // Ajustado para checar as propriedades reais retornadas pelo banco
            const status = quarto.estado ? quarto.estado.toLowerCase() : "";
            if (status === "disponível" || status === "disponivel") disponiveis++;
            else if (status === "ocupado") ocupados++;
            else if (status === "manutenção" || status === "manutencao") manutencao++;

            // Se o backend não trouxer o nome do tipo ou valor diretamente, 
            // colocamos um fallback para não quebrar a tabela
            const tipoQuarto = quarto.tipo || (quarto.id_tipo_quarto == 2 ? "Luxo" : quarto.id_tipo_quarto == 3 ? "Premium" : "Standard");
            const valorDiaria = quarto.valor_diaria ? Number(quarto.valor_diaria).toFixed(2) : "0.00";

            tabela.innerHTML += `
                <tr>
                    <td>${quarto.numero}</td>
                    <td>${tipoQuarto}</td>
                    <td>${quarto.estado || "disponivel"}</td>
                    <td>R$ ${valorDiaria}</td>
                </tr>
            `;
        });

        document.getElementById("cardDisponiveis").innerText = disponiveis;
        document.getElementById("cardOcupados").innerText = ocupados;
        document.getElementById("cardManutencao").innerText = manutencao;

    } catch (erro) {
        console.error("Erro na comunicação GET:", erro);
        document.getElementById("tabelaQuartos").innerHTML = `
            <tr>
                <td colspan="4" style="color: red; text-align: center;">
                    Não foi possível carregar a lista de quartos.
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    carregarQuartos();

    const modal = document.getElementById("modalQuarto");
    const btnNovoQuarto = document.getElementById("btnNovoQuarto");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const formQuarto = document.getElementById("formQuarto");

    if (btnNovoQuarto && modal) {
        btnNovoQuarto.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    } else {
        console.error("Erro: O botão ou o modal de quartos não foi encontrado no HTML.");
    }

    if (btnFecharModal && modal) {
        btnFecharModal.addEventListener("click", () => {
            modal.style.display = "none";
            formQuarto.reset();
        });
    }

    if (formQuarto) {
        formQuarto.addEventListener("submit", async (e) => {
            e.preventDefault();

            const numeroQuarto = document.getElementById("numQuarto").value;
            
            const andarCalculado = parseInt(Number(numeroQuarto) / 100, 10) || 1;

            let idTipoQuarto = 1; 
            const tipoSelecionado = document.getElementById("tipoQuarto").value;
            if (tipoSelecionado === "Luxo") idTipoQuarto = 2;
            if (tipoSelecionado === "Premium") idTipoQuarto = 3;

            let estadoFormatado = "disponivel";
            const statusSelecionado = document.getElementById("statusQuarto").value;
            if (statusSelecionado === "Manutenção" || statusSelecionado === "manutencao") {
                estadoFormatado = "manutencao";
            }

            const dadosQuarto = {
                numero: numeroQuarto,
                andar: andarCalculado,
                id_tipo_quarto: idTipoQuarto,
                estado: estadoFormatado,
                valor_diaria: document.getElementById("valorQuarto").value
            };

            try {
                const resposta = await fetch(`${API}/quartos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosQuarto)
                });

                if (resposta.ok) {
                    alert("Quarto cadastrado com sucesso!");
                    modal.style.display = "none";
                    formQuarto.reset();
                    carregarQuartos();
                } else {
                    alert("Erro ao salvar o quarto no servidor.");
                }
            } catch (erro) {
                console.error("Erro na comunicação POST:", erro);
                alert("Não foi possível conectar ao backend.");
            }
        });
    }
});