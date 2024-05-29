document.getElementById("linkVoltar").addEventListener("click", function () {
    window.location.href = "perfil.html";
});

document.querySelectorAll("#marca, #linkLogo").forEach(element => {
    element.addEventListener("click", function () {
        window.location.href = "solicitacao.html";
    });
});

$(document).ready(function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const errorDelete = document.getElementById("error-message-delete");

    errorDelete.textContent = "";

    if (token && userId) {
        const url = `http://localhost:3000/buscar/conta/${userId}`;

        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function (data) {
                console.log('Dados retornados pelo servidor:', data);
                $('#email').text(data.email);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao fazer a solicitação:", errorThrown);
            }
        });
    } else {
        console.error("Token JWT ou userId não encontrados no localStorage.");
    }

    // deletar conta
    $("#deletar_conta").click(function () {
        $('#confirmDeleteModal').modal('show');
    });

    $("#confirmDeleteButton").click(function () {
        var token = localStorage.getItem('token');
        var userId = localStorage.getItem('userId');

        if (token && userId) {
            $.ajax({
                url: `http://localhost:3000/deletar/conta/${userId}`,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function () {
                    $.ajax({
                        url: 'http://localhost:3000/logout',
                        type: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        success: function () {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            $('#error-message-delete').text("Conta deletada com sucesso");
                            setTimeout(function () {
                                window.location.href = "login.html";
                            }, 1000);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("Erro ao fazer logout:", errorThrown);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Erro ao deletar conta:", errorThrown);
                }
            });
        } else {
            console.error("Token não encontrado no localStorage.");
        }

        $('#confirmDeleteModal').modal('hide');
    });
});