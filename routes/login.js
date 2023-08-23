const express = require('express')
const router=express.Router()
const loginController = require('../controllers/login')
const homeController = require('../controllers/home')

router.get('/', loginController.getLogin)
router.post('/login', homeController.getHome)

module.exports=router