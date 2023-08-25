const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');
const homeController = require('../controllers/home');
const { body } = require('express-validator');

router.get('/', loginController.getLogin);
router.get('/login', loginController.getLogin);
router.get('/reset', loginController.getReset);
router.post('/reset', loginController.postReset);
router.get('/reset/:id', loginController.getnewPass);
router.post('/reset/:id', loginController.postnewPass);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  ],
  loginController.postLogin
);
router.get('/home', homeController.getHome);

module.exports = router;
