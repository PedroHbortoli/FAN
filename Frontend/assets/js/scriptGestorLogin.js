document.querySelector('.entrar').addEventListener('click', async (event) => {
    event.preventDefault();

    const teamName = document.querySelector('.id-do-time').value;
    const passwordTeam = document.querySelectorAll('.senha-time')[0].value; // Captura a senha
    const confirmPassword = document.querySelectorAll('.senha-time')[1].value; // Captura a confirmação da senha

    const idUser = localStorage.getItem('userId');
    const idEnterprise = localStorage.getItem('enterpriseId');

    // Validação dos campos
    if (!teamName || !passwordTeam || !confirmPassword) {
        alert('Preencha todos os campos.');
        return;
    }

    if (passwordTeam !== confirmPassword) {
        alert('As senhas não coincidem. Tente novamente.');
        return;
    }

    if (!idUser || !idEnterprise) {
        alert('Erro: IDs do usuário ou da empresa não encontrados no localStorage.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3003/backend/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_user: idUser,
                id_enterprise: idEnterprise,
                team_name: teamName,
                password_team: passwordTeam // Envia a senha
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Time criado com sucesso!\nCódigo do Time: ${result.team.code_team}`);
            
            // Salva o código do time no localStorage
            localStorage.setItem('codeTeam', result.team.code_team);
            console.log('Código do time armazenado no localStorage:', result.team.code_team);
        
            window.location.href = '../Frontend/main_gestor.html'; // Redireciona
        } else {
            console.error('Erro na resposta da API:', result);
            alert(result.message || 'Erro ao criar o time.');
        }
        
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        alert('Erro ao conectar com o servidor.');
    }
});
