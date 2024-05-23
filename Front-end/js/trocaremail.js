$(document).ready(function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    $('#salvar').click(function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const confirmarEmail = document.getElementById('confirmar').value;
        const errorEmail = document.getElementById('error-message-email');
        const errorConfirmar = document.getElementById('error-message-confirmar');
        const messageSucesso = document.getElementById('message-sucesso');

        errorEmail.textContent = "";
        errorConfirmar.textContent = "";
        messageSucesso.textContent = "";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            errorEmail.textContent = "O campo de e-mail é obrigatório.";
            return;
        }

        if (!emailRegex.test(email)) {
            errorEmail.textContent = "Formato de e-mail inválido.";
            return;
        }

        if (confirmarEmail === "") {
            errorConfirmar.textContent = "O campo de confirmação de e-mail é obrigatório.";
            return;
        }

        if (!emailRegex.test(confirmarEmail)) {
            errorConfirmar.textContent = "Formato de confirmação de e-mail inválido.";
            return;
        }

        if (email !== confirmarEmail) {
            errorConfirmar.textContent = "O e-mail e a confirmação de e-mail não correspondem.";
            return;
        }

        if (token && userId) {
            const url = `http://localhost:3000/atualizar/email/${userId}`;

            $.ajax({
                url: url,
                type: 'PUT',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                contentType: 'application/json',
                data: JSON.stringify({ email: email, confirmarEmail: confirmarEmail }),
                success: function (data) {
                    console.log('Email atualizado com sucesso:', data);
                    messageSucesso.textContent = "E-mail atualizado com sucesso!";

                    setTimeout(function () {
                        window.location.href = 'dados.html';
                    }, 1000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Erro ao atualizar o email:", errorThrown);
                    messageSucesso.textContent = "Erro ao atualizar o email. Por favor, tente novamente.";
                }
            });
        } else {
            console.error("Token JWT ou userId não encontrados no localStorage.");
            messageSucesso.textContent = "Erro ao atualizar o email. Por favor, faça login novamente.";
        }
    });
});

document.getElementById("cancelar").addEventListener("click", function () {
    window.location.href = "dados.html";
});