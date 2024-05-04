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
  if (endereco) {
      exibirAlertaPersonalizado().then((result) => {
          if (result.isConfirmed) {
              window.location.href = `mapa.html?endereco=${endereco}`;
          }
      });
  } else {
      alert("Por favor, preencha o campo de busca de endereço.");
  }
}