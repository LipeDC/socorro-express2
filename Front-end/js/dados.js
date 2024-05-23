$(document).ready(function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

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
    $("#deletar_conta").click(function() {
        if (confirm("Você tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) {
            if (token) {
                $.ajax({
                    url: `http://localhost:3000/deletar/conta/${userId}`,
                    type: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    success: function() {
                        $.ajax({
                            url: 'http://localhost:3000/logout',
                            type: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function() {
                                localStorage.removeItem('token');
                                localStorage.removeItem('userId');
                                alert('Conta deletada com sucesso.');
                                window.location.href = 'login.html';
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error("Erro ao fazer logout:", errorThrown);
                            }
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error("Erro ao deletar conta:", errorThrown);
                    }
                });
            } else {
                console.error("Token não encontrado no localStorage.");
            }
        }
    });
});