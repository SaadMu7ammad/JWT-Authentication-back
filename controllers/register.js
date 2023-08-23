const USER = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
exports.getRegister = (req, res, next) => {
  res.render('register');
};

exports.postSignUp = async (req, res, next) => {
  const userName = req.body.fullname;
  const userEmail = req.body.email;
  const userPass = req.body.password;

  const hashedPass = await bcrypt.hash(userPass, 12);

  const user = new USER({
    name: userName,
    email: userEmail,
    password: hashedPass,
  });

  user
    .save()
    .then(() => {
      console.log('register succefully done');
      res.render('login');
    })
    .catch((err) => {
      console.log('cant register');
    });
};
