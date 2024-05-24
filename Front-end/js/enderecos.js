$(document).ready(function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
        const url = `http://localhost:3000/buscar/endereco/${userId}`;

        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function (data) {
                console.log('Dados retornados pelo servidor:', data);
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(endereco => {
                        addEnderecoToList(endereco);
                    });
                } else {
                    $('#mensagem').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao fazer a solicitação:", errorThrown);
            }
        });
    } else {
        console.error("Token JWT ou userId não encontrados no localStorage.");
    }

    function addEnderecoToList(endereco) {
        if (!endereco.nome_end || !endereco.idEndereco) {
            console.error('Dados de endereço inválidos:', endereco);
            return;
        }
        const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${endereco.nome_end}
                <span>
                    <a href="atualizarendereco.html?id=${endereco.idEndereco}"><i class="bi bi-pencil text-primary mr-1"></i></a>
                    <a href="#" class="delete-endereco" data-id="${endereco.idEndereco}"><i class="bi bi-trash text-danger"></i></a>
                </span>
            </li>`;
        $('#enderecos-lista').append(listItem);
    }

    $('#enderecos-lista').on('click', '.delete-endereco', function (e) {
        e.preventDefault();
        const enderecoId = $(this).data('id');

        if (!enderecoId) {
            console.error('ID do endereço não encontrado.');
            return;
        }

        const deleteUrl = `http://localhost:3000/deletar/endereco/${enderecoId}`;

        $.ajax({
            url: deleteUrl,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function (response) {
                console.log('Endereço excluído com sucesso:', response);
                $(e.target).closest('li').remove();

                if ($('#enderecos-lista').children().length === 0) {
                    $('#mensagem').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao excluir o endereço:", errorThrown);
            }
        });
    });
});