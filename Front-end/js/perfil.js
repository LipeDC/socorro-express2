$(document).ready(function() {
  // Obter o token JWT do localStorage
  const token = localStorage.getItem('token');
  // Obter o userId do localStorage
  const userId = localStorage.getItem('userId');
  
  // Verificar se o token JWT e userId estão presentes
  if (token && userId) {
    // Construir a URL com o userId
    const url = `http://localhost:3000/dados/perfil/${userId}`;
    
    // Fazer a solicitação GET usando o token JWT no cabeçalho Authorization
    $.ajax({
      url: url,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function(data) {
        console.log(data);
        
        if (data.Contum) {
          $("#nome").text(data.Contum.nome);
          $("#email").text(data.Contum.email);
        } else {
          console.error("Propriedade 'Contum' não encontrada nos dados retornados.");
        }
        
        $("#dataNascimento").text(data.data_nasc);
        $("#sexo").text(data.sexo === 'M' ? 'Masculino' : 'Feminino');
        $("#tipoSanguineo").text(data.tipo_sang);
        $("#doencaPreExistente").text(data.doenca_pre);
        $("#remedio").text(data.remedio);
        $("#descricao").text(data.descricao);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Erro ao fazer a solicitação:", errorThrown);
      }
    });
  } else {
    console.error("Token JWT ou userId não encontrados no localStorage.");
  }
  
  $("#adicionarInformacoesBtn").click(function() {
    window.location.href = "informacoes.html";
  });
});