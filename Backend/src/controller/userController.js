const connection = require('../config/db');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');


const createUser = (req, res) => {
    const { CPF, name, email, password, area_of_activity, role, function_user } = req.body;

    console.log('Dados recebidos pelo backend:', req.body);

    if (!CPF || !name || !email || !password || !function_user) {
        console.error('Campos obrigatórios faltando!');
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    const query = `
        INSERT INTO user (CPF, name, email, password, area_of_activity, role, function_user) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [CPF, name, email, password, area_of_activity || null, role || null, function_user];

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

const loginUser = (req, res) => {
    try {
        const { email, password, code } = req.body;

        console.log('Dados recebidos:', { email, password, code });

        if (!email || !password || !code) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Query para buscar o usuário pelo email
        const queryUser = `
            SELECT id, name, email, role, area_of_activity, function_user, password
            FROM user
            WHERE email = ?
        `;

        connection.query(queryUser, [email], (err, userResults) => {
            if (err) {
                console.error('Erro na query SQL do usuário:', err.message);
                return res.status(500).json({ message: 'Erro no servidor ao executar a query do usuário.' });
            }

            if (userResults.length === 0) {
                return res.status(401).json({ message: 'Usuário não encontrado.' });
            }

            const user = userResults[0];

            // Valida a senha sem bcrypt
            if (password !== user.password) {
                return res.status(401).json({ message: 'Senha inválida.' });
            }

            // Query para validar o código da empresa
            const queryEnterprise = `
                SELECT e.id, e.name_enterprise
                FROM enterprise e
                WHERE e.code = ?
            `;

            connection.query(queryEnterprise, [code], (err, enterpriseResults) => {
                if (err) {
                    console.error('Erro na query SQL da empresa:', err.message);
                    return res.status(500).json({ message: 'Erro no servidor ao executar a query da empresa.' });
                }

                if (enterpriseResults.length === 0) {
                    return res.status(401).json({ message: 'Código da empresa inválido.' });
                }

                const enterprise = enterpriseResults[0];

                // Query para buscar o código do time associado ao usuário
                const queryTeam = `
                    SELECT t.code_team
                    FROM teams t
                    JOIN member_team mt ON t.id = mt.id_team
                    WHERE mt.id_user = ?
                `;

                connection.query(queryTeam, [user.id], (err, teamResults) => {
                    if (err) {
                        console.error('Erro ao buscar código do time:', err.message);
                        return res.status(500).json({ message: 'Erro no servidor ao buscar código do time.' });
                    }

                    const team = teamResults.length > 0 ? teamResults[0] : null;

                    // Retorna as informações do usuário, empresa e time
                    res.status(200).json({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        area_of_activity: user.area_of_activity,
                        function_user: user.function_user,
                        enterprise: {
                            id: enterprise.id,
                            name: enterprise.name_enterprise,
                        },
                        team: team // Inclui o código do time
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro inesperado:', error.message);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};


module.exports = {
    createUser,
    loginUser,
};