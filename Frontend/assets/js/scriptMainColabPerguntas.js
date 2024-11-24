document.addEventListener('DOMContentLoaded', async () => {
    // Recupera informações armazenadas no localStorage
    const idEnterprise = localStorage.getItem('idEnterprise'); // ID da empresa
    const teamName = localStorage.getItem('teamName'); // Nome do time

    // Exibe o nome da empresa
    if (idEnterprise) {
        try {
            const response = await fetch(`http://localhost:3003/backend/enterprise/${idEnterprise}`);
            const data = await response.json();

            if (response.ok) {
                document.getElementById('nome-empresa').textContent = data.enterprise.name_enterprise;
                console.log('Nome da empresa carregado:', data.enterprise.name_enterprise);
            } else {
                console.error('Erro ao buscar o nome da empresa:', data.message);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
        }
    } else {
        console.error('ID da empresa não encontrado no localStorage.');
    }

    // Exibe o nome do time
    if (teamName) {
        const teamTitleElement = document.querySelector('.exib_times h2');
        teamTitleElement.textContent = teamName;
        console.log('Nome do time exibido:', teamName);
    } else {
        console.error('Nome do time não encontrado no localStorage.');
    }
});

async function carregarUsuariosEquipe() {
    const codeTeam = localStorage.getItem('codeTeam'); // Código do time armazenado no localStorage

    if (!codeTeam) {
        console.error('Código do time não encontrado no localStorage.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3003/backend/teams/members/${codeTeam}`);
        const data = await response.json();

        if (response.ok && data.teamMembers.length > 0) {
            const userList = document.querySelector('.list ul');
            userList.innerHTML = ''; // Limpa a lista antes de adicionar novos usuários

            data.teamMembers.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = `${member.name} - ${member.function_user}`; // Nome e função do usuário
                userList.appendChild(listItem);
            });

            console.log('Membros do time carregados:', data.teamMembers);
        } else {
            console.warn('Nenhum membro encontrado para o time:', codeTeam);
            const userList = document.querySelector('.list ul');
            userList.innerHTML = '<li style="color: red;">Nenhum membro encontrado</li>';
        }
    } catch (error) {
        console.error('Erro ao buscar membros do time:', error);
    }
}

// Chama a função após o DOM ser carregado
document.addEventListener('DOMContentLoaded', carregarUsuariosEquipe);

document.getElementById('btn-enviar').addEventListener('click', () => {
    const nomeUsuario = localStorage.getItem('userName') || 'Usuário'; // Nome do usuário
    const respostas = {};

    localStorage.removeItem('respostas');
    localStorage.removeItem('respostasRaw');

    // Itera sobre as perguntas e captura as respostas
    const perguntas = document.querySelectorAll('.pergunta');
    perguntas.forEach((pergunta, index) => {
        const respostaSelecionada = pergunta.querySelector('input[type="radio"]:checked');
        if (respostaSelecionada) {
            respostas[`resp${index + 1}`] = parseInt(respostaSelecionada.nextElementSibling.textContent, 10); // Captura o valor numérico
        } else {
            respostas[`resp${index + 1}`] = 0; // Define 0 caso nenhuma resposta tenha sido selecionada
        }
    });

    // Calcula a média das respostas
    const valores = Object.values(respostas).filter(val => val > 0); // Remove valores 0
    const media = valores.length > 0 ? valores.reduce((acc, nota) => acc + nota, 0) / valores.length : 0;

    // Formata como dicionário no estilo solicitado
    const resultado = { [nomeUsuario]: media.toFixed(2) };

    // Salva no localStorage como string JSON válida
    localStorage.setItem('respostas', JSON.stringify(resultado));

    console.log('Respostas salvas:', resultado);
    alert(`Respostas enviadas! Média do usuário: ${media.toFixed(2)}`);

    // Atualiza o localStorage no formato esperado pelo gráfico
    // Garante o formato correto ao salvar as respostas
    let respostasRaw = localStorage.getItem('respostasRaw') || '[]';
    try {
        const respostasArray = JSON.parse(respostasRaw); // Parse para JSON
        respostasArray.push({ nome: nomeUsuario, media: media.toFixed(2) }); // Adiciona nova resposta
        localStorage.setItem('respostasRaw', JSON.stringify(respostasArray)); // Salva como JSON
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        localStorage.setItem('respostasRaw', JSON.stringify([{ nome: nomeUsuario, media: media.toFixed(2) }])); // Recria em caso de erro
    }


});

function exibirRespostas() {
    const respostasRaw = localStorage.getItem('respostasRaw');
    const userId = localStorage.getItem('userId'); // Obtém o userId do localStorage

    if (!userId) {
        console.error('Erro: userId não encontrado no localStorage.');
        return;
    }

    if (!respostasRaw) {
        console.log('Nenhuma resposta encontrada.');
        return;
    }

    try {
        const respostasArray = JSON.parse(respostasRaw); // Parse para JSON
        console.log('Respostas salvas no localStorage:', respostasArray);

        // Concatena as respostas no formato "nome:valor\n"
        let respostasConcatenadas = '';
        respostasArray.forEach(resposta => {
            respostasConcatenadas += `${resposta.nome}:${resposta.media}\n`;
        });

        console.log('Respostas concatenadas:', respostasConcatenadas);

        // Envia a string concatenada e o userId para o backend
        fetch('http://localhost:3003/backend/saveRespostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId, // Adiciona o userId
                respostas: respostasConcatenadas // Adiciona as respostas concatenadas
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao salvar respostas: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respostas salvas no backend:', data);
        })
        .catch(error => {
            console.error('Erro ao enviar respostas ao backend:', error.message);
        });
    } catch (error) {
        console.error('Erro ao analisar os dados salvos no localStorage:', error);
    }
}


// Chame essa função para exibir os dados
exibirRespostas();

if (!localStorage.getItem('idEnterprise')) {
    console.warn('ID da empresa não encontrado. Inicializando com valor padrão.');
    localStorage.setItem('idEnterprise', 'defaultEnterpriseId'); // Substitua pelo ID real
}

if (!localStorage.getItem('teamName')) {
    console.warn('Nome do time não encontrado. Inicializando com valor padrão.');
    localStorage.setItem('teamName', 'defaultTeamName'); // Substitua pelo nome real
}


const respostas = JSON.parse(localStorage.getItem('key_respostas'));
console.log('Respostas:', respostas);

localStorage.setItem('key_respostas', JSON.stringify(respostas));

