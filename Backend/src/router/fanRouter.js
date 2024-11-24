const { Router } = require('express');
const router = Router();
const connection = require('../config/db');

const { createUser, loginUser } = require('../controller/userController');

router.post('/users', createUser);

router.post('/login', loginUser);

const { createEnterprise } = require('../controller/enterpriseController');

router.post('/createEnterprise', createEnterprise);

const { createTeam, getEnterpriseInfo, getTeamsByEnterprise, getTeamDetails, validateTeamAccess, getTeamMembers, saveMemberTeam, getLoggedUser, getAllTeamMembers, getTeamMembersByCode, getRespostasBySector} = require('../controller/teamController');

router.post('/teams', createTeam);

router.get('/enterprise/:id_enterprise', getEnterpriseInfo);

router.get('/teams/:id_enterprise', getTeamsByEnterprise);

router.get('/teamDetails/:id_enterprise/:teamCode', getTeamDetails);

router.post('/validateTeamAccess', validateTeamAccess);

router.get('/teams/members', getAllTeamMembers);

router.get('/teams/members/:code_team', getTeamMembersByCode);

router.get('/teams/members/:id_team', getTeamMembers);

router.post('/memberTeam', saveMemberTeam);

router.get('/respostas/sector/:sector', getRespostasBySector);

router.get('/logged-user', getLoggedUser);


module.exports = router;