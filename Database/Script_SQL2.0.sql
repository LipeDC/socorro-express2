CREATE database ambu;
	use ambu;
	CREATE TABLE Conta (
	idConta INT AUTO_INCREMENT NOT NULL,
	nome VARCHAR(80) NOT NULL,
	email varchar(255) NOT NULL,
	senha varchar(255) NOT NULL,
	PRIMARY KEY (idConta)
);

CREATE TABLE Perfil (
    idPerfil INT AUTO_INCREMENT NOT NULL,
    id_Conta INT NOT NULL,
    data_nasc DATE NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    tipo_sang ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    doenca_pre VARCHAR(100),
    remedio VARCHAR(100),
    descricao TEXT,
    PRIMARY KEY (idPerfil),
    CONSTRAINT id_Conta_fk FOREIGN KEY (id_Conta) REFERENCES Conta (idConta)
);

CREATE TABLE Endereco (
    idEndereco INT AUTO_INCREMENT NOT NULL,
    id_Perfil INT NOT NULL,
    rua VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    PRIMARY KEY (idEndereco),
    CONSTRAINT id_Perfil_fk FOREIGN KEY (id_Perfil) REFERENCES Perfil (idPerfil)
);

CREATE TABLE Chamada (
    idChamada INT AUTO_INCREMENT NOT NULL,
    id_Conta INT NOT NULL,
    cod_ambu VARCHAR(100) NOT NULL,
    PRIMARY KEY (idChamada),
    CONSTRAINT id_Conta_fk_Ch FOREIGN KEY (id_Conta) REFERENCES Conta (idConta)
);