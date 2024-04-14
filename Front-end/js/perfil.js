$(document).ready(function() {
    $.get("http://localhost:3000/dados/perfil/1", function(data) {
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
    });
    
    $("#adicionarInformacoesBtn").click(function() {
      window.location.href = "informacoes.html";
    });
  });
  
  

  