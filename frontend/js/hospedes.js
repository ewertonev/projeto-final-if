const API = "http://localhost:8080";

async function carregarHospedes() {
    try {
        const resposta = await fetch(`${API}/hospedes`);
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados da API");
        }

        const hospedes = await resposta.json();
        const tabela = document.getElementById("tabelaHospedes");

        tabela.innerHTML = ""; 

       
        hospedes.forEach(hospede => {
            tabela.innerHTML += `
                <tr>
                    <td>${hospede.nome}</td>
                    <td>${hospede.telefone ?? ""}</td>
                    <td>${hospede.email ?? ""}</td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro na comunicação:", erro);
        document.getElementById("tabelaHospedes").innerHTML = `
            <tr>
                <td colspan="3" style="color: red; text-align: center;">
                    Não foi possível carregar os hóspedes. Verifique se o servidor está rodando.
                </td>
            </tr>
        `;
    }
}


document.addEventListener("DOMContentLoaded", carregarHospedes);