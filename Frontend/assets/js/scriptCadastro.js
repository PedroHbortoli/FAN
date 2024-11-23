document.querySelector('#cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.querySelector('#nome').value.trim();
    const sobrenome = document.querySelector('#sobrenome').value.trim();
    const email = document.querySelector('#email').value.trim();
    const funcao = document.querySelector('#funcao').value.trim(); // Captura o valor do novo campo
    const senha = document.querySelector('#senha').value;
    const confirmSenha = document.querySelector('#confirm-senha').value;
    const cpf = document.querySelector('#cpf').value.trim();

    // Captura o texto da área de atuação
    const areaSelect = document.querySelector('#area');
    const areaAtuacao = areaSelect.options[areaSelect.selectedIndex].text;

    const cargo = document.querySelector('input[name="cargo"]:checked').value;

    // Validações básicas
    if (!nome || !sobrenome || !email || !funcao || !senha || !cpf || areaAtuacao === 'Selecione uma opção') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (senha !== confirmSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    // Monta o objeto para envio
    const user = {
        CPF: cpf,
        name: `${nome} ${sobrenome}`,
        email: email,
        password: senha,
        area_of_activity: areaAtuacao, // Envia o texto selecionado
        role: cargo,
        function_user: funcao, // Adiciona o novo campo ao objeto
    };

    console.log('Dados enviados ao backend:', user);

    try {
        const response = await fetch('http://localhost:3003/backend/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        console.log('Resposta do backend:', response);

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            console.log('Resposta JSON:', result);
            document.querySelector('#cadastroForm').reset(); // Limpa o formulário
        } else {
            const error = await response.json();
            console.log('Erro do backend:', error);
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao realizar o cadastro:', error);
        alert('Erro ao se conectar ao servidor.');
    }
});

document.getElementById('btn-in').addEventListener('click', async (event) => {
    window.location.href = "../Frontend/login.html"
})

document.getElementById('title').addEventListener('click', async (event) => {
    window.location.href = "../Frontend/login.html"
})