const API = "http://localhost:8080";

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
            const status = quarto.estado ? quarto.estado.toLowerCase() : "";
            if (status === "disponível" || status === "disponivel") disponiveis++;
            else if (status === "ocupado") ocupados++;
            else if (status === "manutenção" || status === "manutencao") manutencao++;

            tabela.innerHTML += `
                <tr>
                    <td>${quarto.numero}</td>
                    <td>${quarto.tipo}</td>
                    <td>${quarto.estado}</td>
                    <td>R$ ${Number(quarto.valor_diaria).toFixed(2)}</td>
                </tr>
            `;
        });

        document.getElementById("cardDisponiveis").innerText = disponiveis;
        document.getElementById("cardOcupados").innerText = ocupados;
        document.getElementById("cardManutencao").innerText = manutencao;

    } catch (erro) {
        console.error("Erro na comunicação:", erro);
        document.getElementById("tabelaQuartos").innerHTML = `
            <tr>
                <td colspan="4" style="color: red; text-align: center;">
                    Não foi possível carregar a lista de quartos.
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", carregarQuartos);