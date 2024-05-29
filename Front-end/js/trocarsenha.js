document.getElementById("linkVoltar").addEventListener("click", function () {
    window.location.href = "dados.html";
});

document.querySelectorAll("#marca, #linkLogo").forEach(element => {
    element.addEventListener("click", function () {
        window.location.href = "solicitacao.html";
    });
});

$(document).ready(function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    $('#salvar').click(function (e) {
        e.preventDefault();

        const campoSenha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar').value;
        const errorSenha = document.getElementById('error-message-senha');
        const errorConfirmar = document.getElementById('error-message-confirmar');
        const messageSucesso = document.getElementById('message-sucesso');

        errorSenha.textContent = "";
        errorConfirmar.textContent = "";
        messageSucesso.textContent = "";

        if (campoSenha === "") {
            errorSenha.textContent = "O campo de senha é obrigatório.";
            return;
        }

        if (campoSenha < 8) {
            errorSenha.textContent = "a senha deve ter no minimo 8 digitos.";
            return;
        }

        if (confirmarSenha === "") {
            errorConfirmar.textContent = "O campo de confirmação de senha é obrigatório.";
            return;
        }

        if (campoSenha !== confirmarSenha) {
            errorConfirmar.textContent = "a senha e a confirmação de senha não correspondem.";
            return;
        }

        if (token && userId) {
            const url = `http://localhost:3000/atualizar/senha/${userId}`;

            $.ajax({
                url: url,
                type: 'PUT',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                contentType: 'application/json',
                data: JSON.stringify({ senha: campoSenha, confirmarSenha: confirmarSenha }),
                success: function (data) {
                    console.log('Senha atualizada com sucesso:', data);
                    messageSucesso.textContent = "Senha atualizado com sucesso!";

                    setTimeout(function () {
                        window.location.href = 'dados.html';
                    }, 1000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Erro ao atualizar a senha:", errorThrown);
                    messageSucesso.textContent = "Erro ao atualizar a senha. Por favor, tente novamente.";
                }
            });
        } else {
            console.error("Token JWT ou userId não encontrados no localStorage.");
            messageSucesso.textContent = "Erro ao atualizar a senha. Por favor, faça login novamente.";
        }
    });
});

document.getElementById("cancelar").addEventListener("click", function () {
    window.location.href = "dados.html";
});