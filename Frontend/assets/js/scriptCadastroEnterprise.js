document.querySelector('.btn-in').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os valores do formulário
    const name_enterprise = document.getElementById('nome').value;
    const corporate_name = document.getElementById('sobrenome').value;
    const email_stakeholder = document.getElementById('email').value;
    const CNPJ = document.getElementById('cnpj').value;
    const address = document.getElementById('endereço').value;
    const phone = document.getElementById('telefone').value;
    const CPF_stakeholder = document.getElementById('cpf').value;
    const SegmentSelect = document.getElementById('area');
    const Segment = SegmentSelect.options[SegmentSelect.selectedIndex].text;

    // Validação dos campos obrigatórios
    if (!name_enterprise || !corporate_name || !email_stakeholder || !CNPJ || !address || !phone || !CPF_stakeholder || Segment === "Selecione uma opção") {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    // Validação de CNPJ e CPF
    if (CNPJ.length !== 14) {
        alert('O CNPJ deve conter exatamente 14 dígitos.');
        return;
    }

    if (CPF_stakeholder.length !== 11) {
        alert('O CPF deve conter exatamente 11 dígitos.');
        return;
    }

    // Validação de número de telefone (mínimo de 10 dígitos)
    if (phone.length < 10 || phone.length > 11) {
        alert('O telefone deve conter entre 10 e 11 dígitos.');
        return;
    }

    // Corpo da requisição
    const data = {
        name_enterprise,
        corporate_name,
        email_stakeholder,
        CNPJ,
        address,
        phone,
        CPF_stakeholder,
        Segment
    };

    try {
        // Envia os dados para o backend
        const response = await fetch('http://localhost:3003/backend/createEnterprise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Empresa cadastrada com sucesso! Código gerado: ${result.code}`);
            // Redireciona o usuário para outra página (substitua 'success.html' pela URL desejada)
            window.location.href = '../login.html';
        } else {
            alert(`Erro ao cadastrar empresa: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

document.getElementById('title').addEventListener('click', async (event) => {
    window.location.href = "../Frontend/login.html"
});