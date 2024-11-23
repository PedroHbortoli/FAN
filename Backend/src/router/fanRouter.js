const { Router } = require('express');
const router = Router();
const connection = require('../config/db');

const { createUser } = require('../controller/userController');

router.post('/users', createUser);

module.exports = router;