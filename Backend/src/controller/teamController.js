const connection = require('../config/db');
const dotenv = require('dotenv').config();
const crypto = require('crypto');

const createTeam = (req, res) => {
    const { id_user, id_enterprise, team_name, password_team } = req.body;

    if (!id_user || !id_enterprise || !team_name || !password_team) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const code_team = generateTeamCode();

    const query = `
        INSERT INTO teams (id_user, id_enterprise, team, code_team, password_team)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [id_user, id_enterprise, team_name, code_team, password_team], (err, results) => {
        if (err) {
            console.error('Erro ao executar a query SQL:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao criar o time.' });
        }

        res.status(201).json({
            message: 'Time criado com sucesso!',
            team: {
                id: results.insertId,
                team_name,
                code_team
            }
        });
    });
};

const getEnterpriseInfo = (req, res) => {
    const { id_enterprise } = req.params;

    const query = `
        SELECT name_enterprise 
        FROM enterprise 
        WHERE id = ?
    `;

    connection.query(query, [id_enterprise], (err, results) => {
        if (err) {
            console.error('Erro ao executar a query SQL:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar informações da empresa.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        res.status(200).json({ enterprise: results[0] });
    });
};

const getTeamsByEnterprise = (req, res) => {
    const { id_enterprise } = req.params;

    const query = `
        SELECT team, code_team 
        FROM teams 
        WHERE id_enterprise = ?
    `;

    connection.query(query, [id_enterprise], (err, results) => {
        if (err) {
            console.error('Erro ao executar a query SQL:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar times.' });
        }

        res.status(200).json({ teams: results });
    });
};

function generateTeamCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

const getTeamDetails = (req, res) => {
    const { id_enterprise, teamCode } = req.params;

    const query = `
        SELECT u.name, u.role, u.status
        FROM user u
        JOIN teams t ON u.id = t.id_user
        WHERE t.id_enterprise = ? AND t.code_team = ?
    `;

    connection.query(query, [id_enterprise, teamCode], (err, results) => {
        if (err) {
            console.error('Erro ao buscar detalhes do time:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar detalhes do time.' });
        }

        res.status(200).json({ teamMembers: results });
    });
};

const validateTeamAccess = (req, res) => {
    const { id_team, password_team } = req.body;

    if (!id_team || !password_team) {
        return res.status(400).json({ message: 'ID do time e senha são obrigatórios.' });
    }

    const query = `
        SELECT t.id as id_team, t.team as team, t.id_enterprise as id_enterprise
        FROM teams t
        WHERE t.code_team = ? AND t.password_team = ?
    `;

    connection.query(query, [id_team, password_team], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor ao validar o acesso ao time.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const team = results[0];
        res.status(200).json({
            message: 'Acesso autorizado.',
            team: {
                id: team.id_team,
                team: team.team,
                id_enterprise: team.id_enterprise
            }
        });
    });
};

const getTeamMembers = (req, res) => {
    const { id_team } = req.params;

    console.log('ID do time recebido no backend:', id_team); // Verifique o parâmetro recebido

    if (!id_team) {
        return res.status(400).json({ message: 'ID do time é obrigatório.' });
    }

    const query = `
        SELECT u.id, u.name, u.role
        FROM user u
        JOIN member_team mt ON u.id = mt.id_user
        WHERE mt.id_team = ?
    `;

    connection.query(query, [id_team], (err, results) => {
        if (err) {
            console.error('Erro ao buscar membros do time:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar membros do time.' });
        }

        console.log('Resultados da consulta:', results); // Verifique os dados retornados pelo banco

        if (results.length === 0) {
            return res.status(404).json({ message: 'Nenhum membro encontrado para este time.' });
        }

        res.status(200).json({ teamMembers: results });
    });
};

const getTeamMembersByCode = (req, res) => {
    const { code_team } = req.params;

    console.log('Código do time recebido no backend:', code_team);

    if (!code_team) {
        return res.status(400).json({ message: 'Código do time é obrigatório.' });
    }

    const query = `
        SELECT u.id, u.name, u.function_user
        FROM user u
        JOIN member_team mt ON u.id = mt.id_user
        JOIN teams t ON mt.id_team = t.id
        WHERE t.code_team = ?
    `;

    connection.query(query, [code_team], (err, results) => {
        if (err) {
            console.error('Erro ao buscar membros do time pelo código:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar membros do time.' });
        }

        console.log('Resultados da consulta:', results);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Nenhum membro encontrado para este time.' });
        }

        res.status(200).json({ teamMembers: results });
    });
};


const getAllTeamMembers = (req, res) => {
    const query = `
        SELECT 
            t.team AS setor,
            u.name AS colaborador,
            u.function_user AS funcao
        FROM member_team mt
        JOIN teams t ON mt.id_team = t.id
        JOIN user u ON mt.id_user = u.id
        ORDER BY t.team, u.name;
    `;

    console.log('Executando consulta para obter membros dos times:');
    console.log(query);

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar membros de todos os times:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao buscar membros.' });
        }

        console.log('Resultados retornados pela consulta:', results);

        res.status(200).json({ teamMembers: results });
    });
};


const saveMemberTeam = (req, res) => {
    const { id_user, name_user, id_team, type_post, points } = req.body;

    if (!id_user || !name_user || !id_team || !type_post || !points) {
        console.error('Erro: Campos obrigatórios ausentes.', { id_user, name_user, id_team, type_post, points });
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const query = `
        INSERT INTO member_team (id_user, name_user, id_team, type_post, points)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [id_user, name_user, id_team, type_post, points], (err, results) => {
        if (err) {
            console.error('Erro ao salvar membro na equipe no banco:', err.message);
            return res.status(500).json({ message: 'Erro no servidor ao salvar membro na equipe.' });
        }

        console.log('Membro salvo com sucesso no banco de dados. ID inserido:', results.insertId);
        res.status(201).json({ message: 'Membro adicionado com sucesso!', id: results.insertId });
    });
};



const getLoggedUser = (req, res) => {
    // Aqui você usaria o token ou sessão para identificar o usuário.
    // Exemplo: req.userId vindo do middleware de autenticação
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ message: 'Usuário não autenticado.' });
    }

    const query = `
        SELECT id, name, role
        FROM user
        WHERE id = ?
    `;

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário logado:', err.message);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ user: results[0] });
    });
};

const getRespostasBySector = (req, res) => {
    const { sector } = req.params;

    if (!sector) {
        return res.status(400).json({ message: 'Setor não especificado.' });
    }

    const query = `
        SELECT u.name AS userName, u.role, mt.points
        FROM user u
        JOIN member_team mt ON u.id = mt.id_user
        WHERE u.sector = ?
    `;

    connection.query(query, [sector], (err, results) => {
        if (err) {
            console.error('Erro ao buscar respostas por setor:', err.message);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Nenhum dado encontrado para este setor.' });
        }

        res.status(200).json({ respostas: results });
    });
};

module.exports = { 
    createTeam,
    getEnterpriseInfo,
    getTeamsByEnterprise,
    getTeamDetails,
    validateTeamAccess,
    saveMemberTeam,
    getTeamMembers,
    getLoggedUser,
    getAllTeamMembers,
    getTeamMembersByCode,
    getRespostasBySector
};