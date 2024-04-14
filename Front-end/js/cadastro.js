document.getElementById("registerButton").addEventListener("click", async function() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

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
                console.log("Conta cadastrada com sucesso:", responseData);
                window.location.href = "login.html"; // Tela de loginn
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
