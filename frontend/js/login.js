function entrar(){

    const usuario =
        document.getElementById("usuario").value;

    const senha =
        document.getElementById("senha").value;

    if(usuario === "" || senha === ""){
        alert("Preencha os campos");
        return;
    }

    localStorage.setItem(
        "usuario",
        JSON.stringify({
            nome: usuario,
            cargo: "Gerente"
        })
    );

    window.location.href =
        "pages/dashboard.html";
}