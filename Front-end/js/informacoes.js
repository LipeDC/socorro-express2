document.getElementById("linkVoltar").addEventListener("click", function () {
    window.location.href = "perfil.html";
});

document.querySelectorAll("#marca, #linkLogo").forEach(element => {
    element.addEventListener("click", function () {
        window.location.href = "solicitacao.html";
    });
});

document.getElementById("perfil").addEventListener("click", async function () {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
        const formData = {};

        const data_nasc = document.getElementById("data_nasc").value;
        if (data_nasc) formData.data_nasc = data_nasc;

        const sexoInput = document.getElementById("sexo").value;
        if (sexoInput) {
            const sexoMap = {
                "Masculino": "M",
                "Feminino": "F",
                "Outro": "O"
            };

            if (sexoMap.hasOwnProperty(sexoInput)) {
                formData.sexo = sexoMap[sexoInput];
            } else {
                console.error("Seleção de sexo inválida:", sexoInput);
                return;
            }
        }

        const tipo_sang = document.getElementById("tipo_sang").value;
        if (tipo_sang) formData.tipo_sang = tipo_sang;

        const doenca_pre = document.getElementById("doenca_pre").value;
        if (doenca_pre) formData.doenca_pre = doenca_pre;

        const remedio = document.getElementById("remedio").value;
        if (remedio) formData.remedio = remedio;

        const descricao = document.getElementById("descricao").value;
        if (descricao) formData.descricao = descricao;

        $.ajax({
            url: `http://localhost:3000/atualizar/perfil/${userId}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'userId': userId
            },
            data: JSON.stringify(formData),
            success: function (data) {
                console.log("Perfil atualizado com sucesso:", data);
                setTimeout(function () {
                    window.location.href = "perfil.html";
                }, 1000);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Erro ao atualizar perfil:", errorThrown);
            }
        });
    } else {
        console.error("Token JWT ou userId não encontrados no localStorage.");
    }
});

document.getElementById("cancelar").addEventListener("click", function () {
    window.location.href = "perfil.html";
});