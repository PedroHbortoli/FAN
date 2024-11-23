const { Router } = require('express');
const router = Router();
const connection = require('../config/db');

const { createUser, loginUser } = require('../controller/userController');

router.post('/users', createUser);

router.post('/login', loginUser);

const { createEnterprise } = require('../controller/enterpriseController');

router.post('/createEnterprise', createEnterprise);

module.exports = router;