const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register');
const loginController = require('../controllers/login');

router.get('/register', registerController.getRegister);

router.get('/login', loginController.getLogin);

router.post('/register', registerController.postSignUp);

module.exports = router;
