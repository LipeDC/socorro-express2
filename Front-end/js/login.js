document.getElementById("loginButton").addEventListener("click", async function() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

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
            if (responseData.token) {
                console.log("Login bem-sucedido. Token JWT recebido:", responseData.token);
                
                //token JWT no localStorage
                localStorage.setItem('token', responseData.token);
                
                window.location.href = "solicitacao.html";
            } else {
                console.error("Erro ao realizar login na conta: resposta vazia.");
            }
        } else {
            const errorData = await response.json();
            console.error("Erro ao realizar login na conta:", errorData);
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
    }
});

