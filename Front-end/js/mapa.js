function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.5489, lng: -46.638823 },
        zoom: 13,
        mapTypeControl: false,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
    });

    directionsRenderer.addListener("directions_changed", () => {
        const directions = directionsRenderer.getDirections();

        if (directions) {
            computeTotalDistance(directions);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const endereco = urlParams.get('endereco');

    if (endereco) {
        displayRoute(
            endereco, // origem 
            "Alameda Cassaquera - Barcelona, São Caetano do Sul - SP, Brasil", // destino padrão
            directionsService,
            directionsRenderer
        );
    } else {
        alert("Endereço não encontrado na URL.");
    }

    function displayRoute(origem, destino, service, display) {
        service
            .route({
                origin: origem,
                destination: destino,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true,
            })
            .then((result) => {
                display.setDirections(result);
            })
            .catch((e) => {
                alert("Could not display directions due to: " + e);
            });
    }

    function computeTotalDistance(result) {
        let total = 0;
        const myroute = result.routes[0];
        for (let i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById("total").innerHTML = total + " km";
    }
}

function mudarSolicitacaoParaAzul() {
    document.getElementById('solicitacao').style.color = 'rgb(0, 171, 205)';
    setTimeout(mudarSolicitacaoParaVerde, 2000);
}

function mudarSolicitacaoParaVerde() {
    document.getElementById('solicitacao').style.color = 'rgb(7, 181, 7)';

    setTimeout(mudarACaminhoParaAzul, 1000);
}

function mudarACaminhoParaAzul() {
    document.getElementById('a_caminho').style.color = 'rgb(0, 171, 205)';
    setTimeout(mudarACaminhoParaVerde, 5000);
}

function mudarACaminhoParaVerde() {
    document.getElementById('a_caminho').style.color = 'rgb(7, 181, 7)';

    setTimeout(mudarChegadaParaAzul, 1000);
}

function mudarChegadaParaAzul() {
    document.getElementById('chegada').style.color = 'rgb(0, 171, 205)';
    setTimeout(mudarChegadaParaVerde, 14000);
}

function mudarChegadaParaVerde() {
    document.getElementById('chegada').style.color = 'rgb(7, 181, 7)';
    setTimeout(function () {
        window.location.href = 'obrigado.html';
    }, 3000);
}

window.onload = function () {
    mudarSolicitacaoParaAzul();
};


window.initMap = initMap, mudarParaAzul;


