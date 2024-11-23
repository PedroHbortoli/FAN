-- Criação do Banco de Dados
CREATE DATABASE db_FAN;
USE db_FAN;

SELECT * FROM user ;
SELECT * FROM enterprise;
SELECT * FROM team;
SELECT * FROM post;

-- Tabela de Usuários
CREATE TABLE user (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    CPF VARCHAR(11) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    area_of_activity VARCHAR(255),
    role ENUM('gestor', 'colaborador') NOT NULL,
    function_user VARCHAR(255) NOT NULL
);

-- Tabela de Empresas
CREATE TABLE enterprise (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name_enterprise VARCHAR(255) NOT NULL,
    corporate_name VARCHAR(255) NOT NULL,
    email_stakeholder VARCHAR(255) NOT NULL,
    CNPJ BIGINT NOT NULL UNIQUE,
    CPF_stakeholder BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone BIGINT NOT NULL,
    Segment VARCHAR(255) NOT NULL,
    code CHAR(100) NOT NULL UNIQUE
);

DESCRIBE enterprise;

-- Tabela de Equipes
CREATE TABLE teams (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_user INT NOT NULL,
    id_enterprise INT NOT NULL,
    team VARCHAR(255),
    id_team VARCHAR(255),
    password_team VARCHAR(255),
    FOREIGN KEY (id_enterprise) REFERENCES enterprise(id),
    FOREIGN KEY (id_user) REFERENCES user(id)
);

-- Tabela de Publicações
CREATE TABLE post (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_team INT NOT NULL,
    id_user INT NOT NULL,
    tt_post VARCHAR(255),
    ds_post VARCHAR(255),
    data_post TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type_post ENUM('melhoria', 'positivo', 'negativo'),
    FOREIGN KEY (id_team) REFERENCES teams(id),
    FOREIGN KEY (id_user) REFERENCES user(id)
);

