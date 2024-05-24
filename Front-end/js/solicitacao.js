let map, infoWindow;

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -23.5489, lng: -46.638823 },
    zoom: 13,
    mapTypeControl: false,
  });
  infoWindow = new google.maps.InfoWindow();

  const input = document.getElementById("busca_end");
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  const autocomplete = new google.maps.places.Autocomplete(
    input,
    options
  );

  autocomplete.bindTo("bounds", map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      window.alert("Nenhuma informação disponível para o local: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(1);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = place.formatted_address;
    infowindow.open(map, marker);
  });

  // localização atual
  document.getElementById("localizacao-atual").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                document.getElementById("busca_end").value = results[0].formatted_address;
              } else {
                window.alert("Nenhum resultado encontrado para a localização atual.");
              }
            } else {
              window.alert("Geocoder falhou devido a: " + status);
            }
          });

          infoWindow.setPosition(pos);
          infoWindow.setContent("Localização encontrada.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Erro: O serviço de Geolocalização falhou."
      : "Erro: Seu navegador não suporta geolocalização."
  );
  infoWindow.open(map);
}

window.initMap = initMap;

function exibirAlertaPersonalizado() {
  return Swal.fire({
    title: 'Você tem certeza que deseja chamar a ambulância?',
    text: "Essa ação não poderá ser desfeita",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, tenho certeza!'
  });
}

function enviarEndereco() {
  const endereco = document.getElementById("busca_end").value;
  const errorEndereco = document.getElementById("error-message-endereco");

  errorEndereco.textContent = "";

  if (endereco) {
    exibirAlertaPersonalizado().then((result) => {
      if (result.isConfirmed) {
        window.location.href = `mapa.html?endereco=${endereco}`;
      }
    });
  } else {
    errorEndereco.textContent = "Por favor. Informe o endereço";
  }
}

document.getElementById("informacoes-pessoais").addEventListener("click", function () {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (userId && token) {
    $.ajax({
      url: `http://localhost:3000/dados/perfil/${userId}`,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function (data) {
        if (data) {
          console.log("Já existe um perfil associado a este usuário.");
          window.location.href = 'perfil.html';
        } else {
          console.log("Perfil não encontrado, criando um novo perfil.");
          criarNovoPerfil(userId, token);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 404) {
          console.log("Perfil não encontrado, criando um novo perfil.");
          criarNovoPerfil(userId, token);
        } else {
          console.error("Erro ao verificar perfil:", errorThrown);
        }
      }
    });
  } else {
    console.error("UserId ou token não encontrado no localStorage.");
  }
});

function criarNovoPerfil(userId, token) {
  $.ajax({
    url: "http://localhost:3000/adicionar/perfil",
    type: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    data: JSON.stringify({ id_Conta: userId, data_nasc: null, sexo: null, tipo_sang: null, doenca_pre: null, remedio: null, descricao: null }),
    success: function (data) {
      console.log("Perfil adicionado com sucesso:", data);
      window.location.href = 'perfil.html';
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Erro ao adicionar perfil:", errorThrown);
    }
  });
}