CREATE DATABASE db_FAN;
USE db_FAN;

SELECT * FROM user;
SELECT * FROM enterprise;
SELECT * FROM teams;
SELECT * FROM post;

CREATE TABLE user (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    CPF INT NOT NULL,
	name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    area_of_​​activity VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE enterprise (
 	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name_enterprise VARCHAR(255) NOT NULL,
    corporate_name VARCHAR(255) NOT NULL,
    email_stakeholder VARCHAR(255) NOT NULL,
    CNPJ INT NOT NULL UNIQUE,
    CPF_stakeholder INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone INT NOT NULL,
    Segment VARCHAR(255) NOT NULL,
    type_enterprise ENUM ('Empresário Individual (EI)', 'Microempreendedor Individual (MEI)', 'Sociedade Limitada (LTDA)', 'Sociedade Anônima (S.A.)', 'Microempresa (ME)', 'Empresa de Pequeno Porte (EPP)', 'Empresas Comerciais', '
	Empresas Prestadoras de Serviços', 'Empresas de Tecnologia', 'Franquias', 'Startups')
);

CREATE TABLE teams (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_user INT,
    id_enterprise INT,
    team VARCHAR(255),
    id_team VARCHAR(255),
    password_team INT,
	FOREIGN KEY (id_enterprise) REFERENCES enterprise(id),
	FOREIGN KEY (id_user) REFERENCES user(id)
);

CREATE TABLE post (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_team INT,
    id_user INT,
	tt_post VARCHAR(255),
    ds_post VARCHAR(255),
    data_post TIMESTAMP,
    type_post ENUM ('melhoria', 'positivo', 'negativo'),
	FOREIGN KEY (id_team) REFERENCES teams(id),
	FOREIGN KEY (id_user) REFERENCES user(id)
);