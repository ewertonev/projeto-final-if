const usuario =
    JSON.parse(localStorage.getItem("usuario"));

if(!usuario){
    location.href = "../index.html";
}

document.getElementById("boasVindas")
.innerText =
`Bem-vindo, ${usuario.nome}`;