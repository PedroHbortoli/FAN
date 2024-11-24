document.getElementById('gerarRelatorio').addEventListener('click', function () {
    abrirPopup();
    gerarGrafico();
});

function abrirPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function fecharPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// // Exemplo de JSON armazenado no localStorage no formato correto
// localStorage.setItem('respostasRaw', JSON.stringify([
//     { "nome": "Pedro Gomes", "media": "3.00" },
//     { "nome": "João Silva", "media": "4.50" },
//     { "nome": "Maria Souza", "media": "3.67" }
// ]));

function gerarGrafico() {
    const ctx = document.getElementById('grafico').getContext('2d');

    // Recupera o JSON do localStorage
    const respostasRaw = localStorage.getItem('respostasRaw');
    if (!respostasRaw) {
        console.error('Nenhuma resposta encontrada no localStorage.');
        return;
    }

    // Parse do JSON para um array de objetos
    const respostasArray = JSON.parse(respostasRaw);

    // Extrai labels (nomes) e dados (médias) do array
    const labels = respostasArray.map(item => item.nome);
    const data = respostasArray.map(item => parseFloat(item.media));

    // Gera o gráfico com os dados extraídos
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Média por Colaborador',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    console.log('Gráfico gerado com sucesso:', { labels, data });
}

function baixarGrafico() {
    html2canvas(document.getElementById('grafico')).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'grafico_respostas.png';
        link.click();
    });
}



async function fetchEnterpriseInfo() {
    const idEnterprise = localStorage.getItem('enterpriseId');

    try {
        const response = await fetch(`http://localhost:3003/backend/enterprise/${idEnterprise}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('nome-empresa').textContent = data.enterprise.name_enterprise;
        } else {
            console.error('Erro ao buscar informações da empresa:', data.message);
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}

async function selectTeam(codeTeam) {
    try {
        if (!codeTeam) {
            throw new Error('Código do time não foi fornecido.');
        }

        console.log('Código do time selecionado:', codeTeam);

        const response = await fetch(`http://localhost:3003/backend/teams/members/${codeTeam}`);
        const data = await response.json();

        console.log('Dados recebidos do backend:', data);

        if (response.ok && data.teamMembers.length > 0) {
            const tableBody = document.querySelector('.box_time table tbody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

            data.teamMembers.forEach(member => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${member.name}</td>
                    <td>${member.function_user}</td>
                    <td>Ativo</td> <!-- Ajuste se necessário -->
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log('Nenhum membro encontrado para o time.');
            const tableBody = document.querySelector('.box_time table tbody');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: red;">Nenhum membro encontrado</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error.message);
    }
}

async function fetchTeams() {
    const idEnterprise = localStorage.getItem('enterpriseId');

    try {
        const response = await fetch(`http://localhost:3003/backend/teams/${idEnterprise}`);
        const data = await response.json();

        if (response.ok) {
            const teamList = document.querySelector('.list ul');
            teamList.innerHTML = ''; // Limpa a lista atual

            data.teams.forEach(team => {
                const listItem = document.createElement('li');
                listItem.textContent = `${team.team} (Código: ${team.code_team})`;
                listItem.dataset.teamCode = team.code_team; // Armazena o código do time

                // Adiciona evento de clique
                listItem.addEventListener('click', () => {
                    // Remove a classe 'active' de todos os itens
                    const allItems = teamList.querySelectorAll('li');
                    allItems.forEach(item => item.classList.remove('active'));

                    // Adiciona a classe 'active' no item clicado
                    listItem.classList.add('active');

                    // Chama a função para exibir os detalhes do time
                    selectTeam(team.code_team);
                });

                teamList.appendChild(listItem);
            });
        } else {
            console.error('Erro ao buscar times:', data.message);
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}

async function fetchAllTeamMembers() {
    try {
        const response = await fetch('http://localhost:3003/backend/teams/members');
        const data = await response.json();

        console.log('Dados recebidos:', data); // Verificar estrutura de dados

        if (!data.teamMembers || data.teamMembers.length === 0) {
            console.log('Nenhum membro encontrado.');
            const tableBody = document.querySelector('.box_time table tbody');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: red;">Nenhum membro encontrado</td>
                </tr>
            `;
            return;
        }

        const tableBody = document.querySelector('.box_time table tbody');
        tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

        let currentSector = '';
        data.teamMembers.forEach(member => {
            if (currentSector !== member.setor) {
                const sectorRow = document.createElement('tr');
                sectorRow.innerHTML = `
                    <td colspan="3" style="font-weight: bold; background-color: #4A90E2; color: white;">
                        ${member.setor}
                    </td>
                `;
                tableBody.appendChild(sectorRow);
                currentSector = member.setor;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.colaborador}</td>
                <td>${member.cargo}</td>
                <td>Ativo</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}

// Chama a função após o DOM ser carregado
document.addEventListener('DOMContentLoaded', () => {
    fetchAllTeamMembers();
});

document.getElementById('btn-add-time').addEventListener('click', async (event) => {
    window.location.href = "../Frontend/main_gestor_login.html"
})

document.addEventListener('DOMContentLoaded', () => {
    fetchEnterpriseInfo();
    fetchTeams();
});