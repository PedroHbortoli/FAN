document.querySelector('.entrar').addEventListener('click', async () => {
    const idTeam = document.querySelector('.id-do-time').value;
    const password = document.querySelector('.senha-time').value;

    console.log('Valores inseridos pelo usuário:', { idTeam, password }); // Log inicial

    if (!idTeam || !password) {
        alert('Preencha todos os campos!');
        console.log('Erro: Campos não preenchidos.'); // Log de erro
        return;
    }

    try {
        console.log('Enviando dados para o backend...'); // Log antes do fetch
        const response = await fetch('http://localhost:3003/backend/validateTeamAccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_team: idTeam, password_team: password })
        });

        console.log('Resposta recebida do backend:', response); // Log da resposta
        const data = await response.json();
        console.log('Dados recebidos do backend:', data); // Log dos dados recebidos

        if (response.status === 200) {
            alert(data.message); // Mensagem de sucesso
            console.log('Login bem-sucedido. Salvando dados no localStorage...'); // Log de sucesso

            // Salvar idEnterprise e teamName no localStorage
            const { id_enterprise, team } = data.team; // Certifique-se de que esses valores estão vindo do backend
            localStorage.setItem('idEnterprise', id_enterprise);
            localStorage.setItem('teamName', team);

            console.log('Dados armazenados no localStorage:', { idEnterprise: id_enterprise, teamName: team });

            // Salvando os dados na tabela `member_team`
            const userId = localStorage.getItem('userId'); // ID do usuário armazenado no localStorage
            const userName = localStorage.getItem('userName'); // Nome do usuário
            const teamId = data.team.id; // ID do time retornado pelo backend
            const typePost = 'melhorar'; // Exemplo, pode ser dinâmico
            const points = '5'; // Exemplo, pode ser dinâmico

            console.log('Salvando no banco:', { userId, teamId, userName, typePost, points }); // Log dos dados enviados

            try {
                const userId = localStorage.getItem('userId'); // ID do usuário
                const userName = localStorage.getItem('userName'); // Nome do usuário
                const teamId = data.team.id; // ID do time retornado pelo backend
                const typePost = 'melhorar'; // Tipo de postagem
                const points = '0'; // Pontuação atribuída
            
                if (!userId || !userName || !teamId || !typePost || !points) {
                    console.error('Erro: Campos obrigatórios ausentes.', { userId, userName, teamId, typePost, points });
                    alert('Erro: Preencha todos os campos necessários.');
                    return;
                }
            
                const saveResponse = await fetch('http://localhost:3003/backend/memberTeam', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_user: userId,
                        name_user: userName,
                        id_team: teamId,
                        type_post: typePost,
                        points
                    })
                });
            
                if (!saveResponse.ok) {
                    const errorText = await saveResponse.text();
                    console.error('Erro do backend:', errorText);
                    alert('Erro ao salvar dados no backend.');
                    return;
                }
            
                const saveData = await saveResponse.json();
                console.log('Membro salvo com sucesso na equipe:', saveData);
                window.location.href = '../Frontend/main_colaborador_perguntas.html';
            } catch (error) {
                console.error('Erro ao salvar dados na equipe:', error);
                alert('Erro ao salvar os dados. Tente novamente mais tarde.');
            }
        } else {
            alert(data.message); // Mensagem de erro
            console.log('Erro do backend:', data.message); // Log do erro do backend
        }
    } catch (error) {
        console.error('Erro ao validar acesso:', error); // Log do erro do fetch
        alert('Erro ao validar o acesso. Tente novamente mais tarde.');
    }
});
