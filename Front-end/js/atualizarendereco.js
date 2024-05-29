document.getElementById("linkVoltar").addEventListener("click", function () {
    window.location.href = "enderecos.html";
});

document.querySelectorAll("#marca, #linkLogo").forEach(element => {
    element.addEventListener("click", function () {
        window.location.href = "solicitacao.html";
    });
});

$(document).ready(function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const idEndereco = getQueryParam('id');

    if (idEndereco) {
        console.log('idEndereco:', idEndereco);

        const token = localStorage.getItem('token');

        $('#enderecoForm').on('submit', function (e) {
            e.preventDefault();

            const nome_end = $('#nome_end').val().trim();
            const endereco = $('#endereco').val().trim();
            const errorNome = $('#error-message-nome');
            const errorEndereco = $('#error-message-endereco');
            const message = $('#message-sucesso');

            errorNome.text("");
            errorEndereco.text("");
            message.text("");

            // Validar nome
            if (nome_end !== "" && (nome_end.length < 2 || nome_end.length > 15)) {
                if (nome_end.length < 2) {
                    errorNome.text("Nome inválido. Deve conter no mínimo 2 caracteres");
                } else if (nome_end.length > 15) {
                    errorNome.text("Nome inválido. Deve conter no máximo 15 caracteres");
                }
                return;
            }

            // Validar endereço
            if (endereco === "" && nome_end === "") {
                errorNome.text("Digite um nome ou um endereço");
                return;
            }

            if (token && idEndereco) {
                const updateUrl = `http://localhost:3000/atualizar/endereco/${idEndereco}`;

                $.ajax({
                    url: updateUrl,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ nome_end, endereco }),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    },
                    success: function (response) {
                        console.log('Endereço atualizado com sucesso:', response);
                        message.text("Endereço atualizado com sucesso!");
                        setTimeout(function () {
                            window.location.href = 'enderecos.html';
                        }, 2000);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error("Erro ao atualizar o endereço:", errorThrown);
                        message.text("Erro ao atualizar o endereço");
                    }
                });
            } else {
                console.error("Token JWT ou idEndereco não encontrados.");
                message.text("Credenciais inválidas ou idEndereco não fornecido.");
            }
        });

    } else {
        console.error('idEndereco não fornecido na URL.');
    }
});

document.getElementById("cancelar").addEventListener("click", function () {
    window.location.href = "enderecos.html";
});

window.initAutocomplete = function () {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Erro: API do Google Maps não foi carregada corretamente.');
        return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('endereco')
    );

    autocomplete.setTypes(['geocode']);
    autocomplete.setFields(['formatted_address']);

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
            document.getElementById('endereco').value = place.formatted_address;
        }
    });
};