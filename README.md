# FAN - README

## Descrição do Projeto

O projeto **FAN** é uma aplicação web voltada para gestão de equipes e empresas, oferecendo funcionalidades como criação de usuários, autenticação, gestão de empresas e equipes, e coleta de feedback dos colaboradores. A aplicação é implementada utilizando o framework **Express.js** e conecta-se a um banco de dados **MySQL** para armazenar as informações dos usuários e das empresas.

## Estrutura do Projeto

- **app.js**: Arquivo principal que configura o aplicativo Express e os middlewares necessários, incluindo suporte para JSON e o uso de CORS.
- **server.js**: Inicializa o servidor na porta especificada e inicia o aplicativo.
- **fanRouter.js**: Define as rotas principais da aplicação, incluindo as rotas para criar usuários, realizar login, gerenciar empresas, equipes e membros.
- **db.js**: Responsável pela configuração da conexão com o banco de dados MySQL.
- **enterpriseController.js, teamController.js, userController.js**: Arquivos de controle que contêm a lógica para a criação e manipulação de empresas, equipes e usuários, incluindo validação de acesso e consulta a dados.
- **HTML**: Arquivos HTML para as interfaces de login, registro de empresas, e respostas dos colaboradores.
- **JavaScript**: Arquivos JavaScript (como `scriptCadastro.js`, `scriptLogin.js`, etc.) que contêm a lógica de frontend para interagir com o backend e manipular o DOM.

## Tecnologias Utilizadas

- **Backend**: Node.js com Express.js
- **Banco de Dados**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Outras Bibliotecas**: dotenv (para gestão de variáveis de ambiente), bcrypt (para hash de senhas), crypto (para geração de códigos aleatórios), Chart.js (para geração de gráficos)

## Como Executar o Projeto

### Requisitos Pré-Requisitos

- **Node.js** instalado
- **MySQL** para armazenar dados
- Um arquivo `.env` com as seguintes variáveis de ambiente:
  - `PORT` - Porta em que o servidor será iniciado.
  - `DB_HOST` - Host do banco de dados MySQL.
  - `DB_USER` - Usuário do banco de dados.
  - `DB_PASSWORD` - Senha do banco de dados.
  - `DB_DATABASE` - Nome do banco de dados.

### Passos para Execução

1. Clone o repositório do projeto:
   ```sh
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as credenciais do banco de dados.
4. Inicialize o servidor com o comando:
   ```sh
   node server.js
   ```
   O servidor será iniciado e a aplicação poderá ser acessada via [http://localhost:3003](http://localhost:3003) (ou outra porta configurada).

## Principais Funcionalidades

- **Registro e Login de Usuários**: Possibilita o cadastro de novos usuários e autenticação utilizando email e senha.
- **Cadastro de Empresas**: Permite a criação de novos registros de empresas, incluindo validação de campos obrigatórios e geração de código único para cada empresa.
- **Gestão de Equipes**: Possibilita a criação e organização de equipes, bem como a adição de membros e a validação do acesso a elas.
- **Coleta de Feedback**: Colaboradores podem responder perguntas sobre sua motivação e alinhamento com os objetivos da equipe.
- **Consultas**: Informações sobre empresas, membros das equipes e validação de acessos.
- **Geração de Relatórios**: Geração de gráficos utilizando Chart.js para visualizar feedback e métricas de equipes.

## Estrutura de Rotas

As principais rotas configuradas estão no arquivo `fanRouter.js` e incluem:

- **POST /backend/users** - Criação de um novo usuário.
- **POST /backend/login** - Autenticação de um usuário.
- **POST /backend/createEnterprise** - Criação de uma nova empresa.
- **POST /backend/teams** - Cria uma nova equipe.
- **GET /backend/enterprise/:id_enterprise** - Busca informações da empresa.
- **GET /backend/teams/:id_enterprise** - Obtém equipes de uma empresa.
- **GET /backend/teamDetails/:id_enterprise/:teamCode** - Obtém detalhes específicos de uma equipe.
- **POST /backend/validateTeamAccess** - Valida o acesso de um usuário a uma equipe.
- **GET /backend/teams/members** - Obtém todos os membros de equipes.
- **GET /backend/teams/members/:code_team** - Obtém os membros de uma equipe específica pelo código.
- **GET /backend/teams/members/:id_team** - Obtém os membros de uma equipe pelo ID.
- **GET /backend/logged-user** - Obtém o usuário autenticado.

## Layout e UI

Existem diversos arquivos HTML que formam a interface da aplicação:

1. **login.html**: Interface para login de usuários, incluindo inputs de email, senha e ID da empresa.
2. **main_colaborador_login.html**: Interface para colaboradores acessarem os times.
3. **main_colaborador_perguntas.html**: Interface para feedback e perguntas sobre as equipes.
4. **enterprise.html**: Interface para o cadastro de empresas.
5. **main_gestor.html**: Interface para gestão das equipes e geração de relatórios.
6. **cadastro.html**: Interface para cadastro de novos usuários, incluindo informações como nome, sobrenome, email corporativo, função e CPF.
7. **main_gestor_login.html**: Interface para criação de novas equipes e login dos gestores.

Esses arquivos HTML são estilizados com CSS e interagem com o backend utilizando JavaScript para realizar requisições assíncronas.

## JavaScript de Frontend

Os arquivos JavaScript de frontend, como `scriptCadastro.js`, `scriptLogin.js`, `scriptColabLogin.js`, `scriptGestorLogin.js`, `scriptMainGestor.js` e `scriptMainColabPerguntas.js`, são responsáveis por manipular o DOM e interagir com o backend, incluindo validação de formulários, envio de dados para a API, armazenamento de dados no `localStorage` e navegação entre as páginas.

## Contribuições

Contribuições são bem-vindas! Se você encontrar um bug ou quiser adicionar uma nova funcionalidade, fique à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autores

Desenvolvido por
Equipe FAN

