document.querySelector('.btn-in').addEventListener('click', async (event) => {
    console.log('Botão de login clicado'); // Log para debug
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('Senha').value;
    const code = document.getElementById('id-empresa').value;

    if (!email || !password || !code) {
        alert('Preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3003/backend/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, code })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Usuário autenticado:', result);
            alert(`Bem-vindo, ${result.name}!`);

            // Salva o ID e o nome do usuário logado no localStorage
            localStorage.setItem('userId', result.id);
            localStorage.setItem('userName', result.name); // Armazena o nome do usuário

            // Redireciona com base no cargo do usuário
            if (result.role === 'gestor') {
                window.location.href = '../Frontend/main_gestor.html';
            } else if (result.role === 'colaborador') {
                window.location.href = '../Frontend/main_colaborador_login.html';
            } else {
                alert('Cargo não identificado. Entre em contato com o administrador.');
            }
        } else {
            alert(result.message || 'Erro ao realizar login.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    }
});

document.getElementById('criar-conta').addEventListener('click', async (event) => {
    window.location.href = "../Frontend/cadastro.html"
})