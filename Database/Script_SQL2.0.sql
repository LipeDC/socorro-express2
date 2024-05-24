CREATE database ambu;
	use ambu;
	CREATE TABLE Conta (
	idConta INT AUTO_INCREMENT NOT NULL,
	nome VARCHAR(80) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	senha varchar(255) NOT NULL,
	PRIMARY KEY (idConta)
);

CREATE TABLE Perfil (
    idPerfil INT AUTO_INCREMENT NOT NULL,
    id_Conta INT NOT NULL UNIQUE,
    data_nasc DATE NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    tipo_sang ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    doenca_pre VARCHAR(100),
    remedio VARCHAR(100),
    descricao TEXT,
    PRIMARY KEY (idPerfil),
    CONSTRAINT id_Conta_fk FOREIGN KEY (id_Conta) REFERENCES Conta (idConta) ON DELETE CASCADE
);

CREATE TABLE Endereco (
    idEndereco INT AUTO_INCREMENT NOT NULL,
    id_Perfil INT NOT NULL,
    rua VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    PRIMARY KEY (idEndereco),
    CONSTRAINT id_Perfil_fk FOREIGN KEY (id_Perfil) REFERENCES Perfil (idPerfil) ON DELETE CASCADE
);

CREATE TABLE Chamada (
    idChamada INT AUTO_INCREMENT NOT NULL,
    id_Conta INT,
    id_Endereco INT,
    cod_ambu VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idChamada),
    CONSTRAINT fk_chamada_conta FOREIGN KEY (id_Conta) REFERENCES Conta (idConta) ON DELETE SET NULL,
    CONSTRAINT fk_chamada_perfil FOREIGN KEY (id_Conta) REFERENCES Perfil (id_Conta) ON DELETE SET NULL,
    CONSTRAINT fk_chamada_endereco FOREIGN KEY (id_Endereco) REFERENCES Endereco (idEndereco) ON DELETE SET NULL
);