const connection = require('../config/db');
const dotenv = require('dotenv').config();
const crypto = require('crypto');

const createEnterprise = async (req, res) => {
    const {
        name_enterprise,
        corporate_name,
        email_stakeholder,
        CNPJ,
        CPF_stakeholder,
        address,
        phone,
        Segment
    } = req.body;

    console.log('Dados recebidos pelo backend:', req.body);

    // Validação de campos obrigatórios
    if (!name_enterprise || !corporate_name || !email_stakeholder || !CNPJ || !CPF_stakeholder || !address || !phone || !Segment) {
        console.error('Campos obrigatórios faltando!');
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    // Geração do código alfanumérico para a empresa
    const generatedCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const query = `
        INSERT INTO enterprise (name_enterprise, corporate_name, email_stakeholder, CNPJ, CPF_stakeholder, address, phone, Segment, code) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name_enterprise, corporate_name, email_stakeholder, CNPJ, CPF_stakeholder, address, phone, Segment, generatedCode];

    console.log('Query SQL:', query);
    console.log('Valores SQL:', values);

    connection.query(query, values, (err) => {
        if (err) {
            console.error('Erro ao executar query SQL:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar empresa.' });
        }
        res.status(201).json({
            message: 'Empresa cadastrada com sucesso!',
            code: generatedCode // Retorna o código gerado ao cliente
        });
    });
};

module.exports = {
    createEnterprise,
};
