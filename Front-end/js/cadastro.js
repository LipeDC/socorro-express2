document.getElementById("registerButton").addEventListener("click", async function () {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const errorNome = document.getElementById("error-message-nome");
    const errorEmail = document.getElementById("error-message-email");
    const errorSenha = document.getElementById("error-message-senha");
    const errorConfirmar = document.getElementById("error-message-confirmar");
    const sucesso = document.getElementById("message-sucesso");


    errorNome.textContent = "";
    errorEmail.textContent = "";
    errorSenha.textContent = "";
    errorConfirmar.textContent = "";

    if (nome.trim() === "") {
        errorNome.textContent = "Digtite seu nome, campo obrigaório";
        return;
    }

    if (nome.length < 2) {
        errorNome.textContent = "Nome inválida. Deve conter no mínimo 2 caracteres";
        return;
    }

    if (nome.length > 80) {
        errorNome.textContent = "Nome inválida. Deve conter no maximo 80 caracteres";
        return;
    }

    if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(nome)) {
        errorNome.textContent = "Nome inválido. É necessário inserir somente letras";
        return;
    }

    if (email.trim() === "") {
        errorEmail.textContent = "Digite seu e-mail, campo obrigatório";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorEmail.textContent = "E-mail inválido";
        return;
    }

    if (senha.trim() === "") {
        errorSenha.textContent = "Digite sua senha, campo obrigatório";
        return;
    }

    if (senha.length < 8) {
        errorSenha.textContent = "Senha inválida. Deve conter no mínimo 8 caracteres";
        return;
    }

    if (senha !== confirmarSenha) {
        errorConfirmar.textContent = "As senhas não correspondem";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/cadastrar/conta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha, confirmarSenha })
        });

        if (response.ok) {
            const responseData = await response.json();
            if (responseData) {
                sucesso.textContent = "Cadastro realizado com sucesso";
                setTimeout(function () {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                console.error("Erro ao cadastrar conta: resposta vazia.");
            }
        } else {
            const errorData = await response.json();
            console.error("Erro ao cadastrar conta:", errorData);
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
});