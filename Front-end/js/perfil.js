$(document).ready(function () {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (token && userId) {
    const url = `http://localhost:3000/dados/perfil/${userId}`;

    $.ajax({
      url: url,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function (data) {
        console.log(data);

        if (data.Contum) {
          updateProfileField('nome', data.Contum.nome);
          updateProfileField('email', data.Contum.email);
        } else {
          console.error("Propriedade 'Contum' não encontrada nos dados retornados.");
        }

        updateProfileField('dataNascimento', data.data_nasc);
        updateProfileField('sexo', formatSexo(data.sexo));
        updateProfileField('tipoSanguineo', data.tipo_sang);
        updateProfileField('doencaPreExistente', data.doenca_pre);
        updateProfileField('remedio', data.remedio);
        updateProfileField('descricao', data.descricao);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Erro ao fazer a solicitação:", errorThrown);
      }
    });
  } else {
    console.error("Token JWT ou userId não encontrados no localStorage.");
  }

  $("#adicionarInformacoesBtn").click(function () {
    window.location.href = "informacoes.html";
  });

  $("#logout").click(function () {
    if (token) {
      $.ajax({
        url: 'http://localhost:3000/logout',
        type: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function () {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = 'login.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Erro ao fazer logout:", errorThrown);
        }
      });
    } else {
      console.error("Token não encontrado no localStorage.");
    }
  });
});

function updateProfileField(fieldId, value) {
  if (value && value.trim() !== '') {
    $(`#${fieldId}`).text(value);
  } else {
    $(`.perfil-info[data-info="${fieldId}"]`).hide();
  }
}

function formatSexo(sexo) {
  switch (sexo) {
    case 'M':
      return 'Masculino';
    case 'F':
      return 'Feminino';
    case 'O':
      return 'Outro';
    default:
      return '';
  }
}