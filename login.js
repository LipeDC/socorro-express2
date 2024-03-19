function logar(){
    var login = document.getElementById('nome').value;
    var senha = document.getElementById('senha').value;

    if(login == "admin" && senha == "admin"){
        
        location.href = "solicitacao.html";
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Falha no login!",
            text: "Ocorreu um erro, tente fazer o Login novamente.",
            footer: '<a href="#">Esqueceu a senha?</a>'
          });
    }


}
