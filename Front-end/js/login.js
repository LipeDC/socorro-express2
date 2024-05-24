document.getElementById("loginButton").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Resposta do servidor:", responseData);
            if (responseData.token && responseData.userId) {
                console.log("Login bem-sucedido. Token JWT recebido:", responseData.token);

                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userId', responseData.userId);

                window.location.href = "solicitacao.html";
            } else {
                console.error("Erro ao realizar login na conta: resposta incompleta.");
            }
        } else {
            const errorData = await response.json();
            console.error("Erro ao realizar login na conta:", errorData);
            errorMessage.innerText = "Credenciais inválidas";
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var linkCadastro = document.getElementById("linkCadastro");

    linkCadastro.href = "http://127.0.0.1:5500/Front-end/html/cadastro.html";
});

document.getElementById("cadastroButton").addEventListener("click", async function () {

    window.location.href = "cadastro.html";
});