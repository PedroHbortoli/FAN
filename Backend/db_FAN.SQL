-- Criação do Banco de Dados
CREATE DATABASE db_FAN;
USE db_FAN;

SELECT * FROM user;
SELECT * FROM enterprise;
SELECT * FROM teams;
SELECT * FROM member_team;

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

-- Tabela de Equipes
CREATE TABLE teams (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_user INT NOT NULL,
    id_enterprise INT NOT NULL,
    team VARCHAR(255),
	code_team VARCHAR(255),
    password_team VARCHAR(255),
    FOREIGN KEY (id_enterprise) REFERENCES enterprise(id),
    FOREIGN KEY (id_user) REFERENCES user(id)
);

-- Tabela de publicações
CREATE TABLE member_team (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_user INT NOT NULL,
    name_user VARCHAR(255) NOT NULL,
    id_team INT NOT NULL,
    type_post ENUM('melhorar', 'positivo', 'negativo') NOT NULL,
    points ENUM('0','1','2','3','4','5') DEFAULT'0' NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user(id),
    FOREIGN KEY (id_team) REFERENCES teams(id)
);


-- Inserir os colaboradores no time `gyhJJB` na tabela `member_team`
INSERT INTO member_team (id_user, id_team, type_post, points)
VALUES
((SELECT id FROM user WHERE CPF = '12345678901'), 1, 'melhorar', '4'),
((SELECT id FROM user WHERE CPF = '23456789012'), 1, 'positivo', '5'),
((SELECT id FROM user WHERE CPF = '34567890123'), 1, 'negativo', '3'),
((SELECT id FROM user WHERE CPF = '45678901234'), 1, 'positivo', '5'),
((SELECT id FROM user WHERE CPF = '56789012345'), 1, 'melhorar', '4');

SELECT u.id, u.name AS UserName, u.sector AS Sector, g.name AS ManagerName
FROM user u
LEFT JOIN user g ON u.manager_id = g.id;