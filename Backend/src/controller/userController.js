const connection = require('../config/db');
const dotenv = require('dotenv').config();

const createUser = (req, res) => {
    const { CPF, name, email, password, area_of_activity, role } = req.body;

    console.log('Dados recebidos pelo backend:', req.body);

    if (!CPF || !name || !email || !password) {
        console.error('Campos obrigatórios faltando!');
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    const query = `
        INSERT INTO user (CPF, name, email, password, area_of_activity, role) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [CPF, name, email, password, area_of_activity || null, role || null];

    console.log('Query SQL:', query);
    console.log('Valores SQL:', values);

    connection.query(query, values, (err) => {
        if (err) {
            console.error('Erro ao executar query SQL:', err);
            return res.status(500).json({ message: 'Erro ao criar usuário.' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
};

module.exports = {
    createUser,
};