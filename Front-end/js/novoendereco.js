document.getElementById("enderecoForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const message = document.getElementById("message-sucesso");
  const errorNome = document.getElementById("error-message-nome");
  const errorEndereco = document.getElementById("error-message-endereco");

  errorNome.textContent = "";
  errorEndereco.textContent = "";

  const nome = document.getElementById("nome_end").value;
  const endereco = document.getElementById("endereco").value;

  if (nome.trim() === "") {
    errorNome.textContent = "Digite um nome, campo obrigatório";
    return;
  }

  if (nome.length < 2) {
    errorNome.textContent = "Nome inválido. Deve conter no mínimo 2 caracteres";
    return;
  }

  if (nome.length > 15) {
    errorNome.textContent = "Nome inválido. Deve conter no máximo 15 caracteres";
    return;
  }

  if (endereco.trim() === "") {
    errorEndereco.textContent = "Digite um endereço, campo obrigatório";
    return;
  }

  if (userId && token) {
    const formData = {
      id_Conta: userId,
      nome_end: nome,
      endereco: endereco
    };

    $.ajax({
      url: 'http://localhost:3000/adicionar/endereco',
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: JSON.stringify(formData),
      success: function (data) {
        message.textContent = "Cadastro realizado com sucesso";
        setTimeout(function () {
          window.location.href = 'enderecos.html';
        }, 2000);
      },
      error: function () {
        message.textContent = "Erro ao cadastrar endereço";
      }
    });
  } else {
    message.textContent = "Credenciais inválidas";
  }
});

document.getElementById("cancelar").addEventListener("click", function () {
  window.location.href = "enderecos.html";
});

function initAutocomplete() {
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
}

$(document).ready(function () {
  initAutocomplete();
});