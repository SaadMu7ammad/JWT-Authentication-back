const express = require('express')
const router=express.Router()
const loginController = require('../controllers/login')
const homeController = require('../controllers/home')

router.get('/', loginController.getLogin)
router.get('/login', loginController.getLogin)
router.post('/login', loginController.postLogin)
router.get('/home', homeController.getHome)

module.exports=router