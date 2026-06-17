const API = "http://localhost:8080";

async function carregarHospedes() {
    try {
        const resposta = await fetch(`${API}/hospedes`);
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do servidor.");
        }

        const hospedes = await resposta.json();
        const tabela = document.getElementById("tabelaHospedes");
        
        if (!tabela) return;
        tabela.innerHTML = "";

        hospedes.forEach(hospede => {
            const dataFormatada = hospede.data_nascimento 
                ? new Date(hospede.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                : "---";

            tabela.innerHTML += `
                <tr>
                    <td>${hospede.nome}</td>
                    <td>${hospede.email || "---"}</td>
                    <td>${hospede.telefone || "---"}</td>
                    <td>${dataFormatada}</td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro na comunicação GET:", erro);
        const tabela = document.getElementById("tabelaHospedes");
        if (tabela) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="4" style="color: red; text-align: center;">
                        Não foi possível carregar a lista de hóspedes.
                    </td>
                </tr>
            `;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    carregarHospedes();

    const modal = document.getElementById("modalHospede");
    const btnNovoHospede = document.getElementById("btnNovoHospede");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const formHospede = document.getElementById("formHospede");

    if (btnNovoHospede && modal) {
        btnNovoHospede.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (btnFecharModal && modal) {
        btnFecharModal.addEventListener("click", () => {
            modal.style.display = "none";
            formHospede.reset();
        });
    }

    if (formHospede) {
        formHospede.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dadosHospede = {
                nome: document.getElementById("nomeHospede").value,
                email: document.getElementById("emailHospede").value || null,
                telefone: document.getElementById("telefoneHospede").value || null,
                data_nascimento: document.getElementById("dataNascimentoHospede").value
            };

            if (!dadosHospede.email && !dadosHospede.telefone) {
                alert("Obrigatório informar pelo menos o E-mail ou o Telefone do hóspede.");
                return;
            }

            try {
                const resposta = await fetch(`${API}/hospedes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosHospede)
                });

                if (resposta.ok) {
                    alert("Hóspede cadastrado com sucesso!");
                    modal.style.display = "none";
                    formHospede.reset();
                    carregarHospedes();
                } else {
                    const respostaErro = await resposta.json().catch(() => ({}));
                    alert(respostaErro.mensagem || "Erro ao salvar o hóspede no servidor.");
                }
            } catch (erro) {
                console.error("Erro na comunicação POST:", erro);
                alert("Não foi possível conectar ao backend.");
            }
        });
    }
});