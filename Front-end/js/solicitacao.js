function exibirAlertaPersonalizado() {
    Swal.fire({
      title: 'Você tem certeza que deseja chamar a ambulância?',
      text: "Essa ação não poderá ser desfeita",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, tenho certeza!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'A ambulância foi chamada!',
          'Não se preocupe, sua solicitação de ambulância foi feita!',
          'success'
        ).then(() => {
            window.location.href = 'espera.html'
        });
      }
    });
  }
  