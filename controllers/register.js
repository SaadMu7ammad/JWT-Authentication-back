const USER = require('../models/users');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs');
exports.getRegister = (req, res, next) => {
  res.render('register');
};

exports.postSignUp = async (req, res, next) => {
  const userName = req.body.fullname;
  const userEmail = req.body.email;
  const userPass = req.body.password;

  const hashedPass = await bcrypt.hash(userPass, 12);
  USER.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      console.log('email is used');
      res.render('register');
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:  req.body.email,
          pass: 'wcsrgogdxpwyllrh',
        },
      });
      transporter
      .sendMail({
        to: req.body.email,
        from: 'admin@gmail.com',
        subject: 'signup succedded',
        html: 'welcome ' + req.body.fullname+" we are happy to join us :)",
      })
      .catch((err) => {
        console.log(err);
      });
      const user = new USER({
        name: userName,
        email: userEmail,
        password: hashedPass,
      });

      user
        .save()
        .then(() => {
          console.log('register succefully done');
          res.render('login',{errorMessage :undefined});
        })
        .catch((err) => {
          console.log('cant register');
        });
    }
  });
};
