const User = require('../models/users');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
exports.getLogin = (req, res, next) => {
  res.render('login', { errorMessage: null });
};
exports.postLogin = (req, res, next) => {
  console.log(req.body.email);
  console.log(req.body.password);
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    // res.render('login', {
    //   errorMessage: 'Invalid credentials',
    // });
  }
  errors = [];
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        bcrypt.compare(req.body.password, result.password).then((isEqual) => {
          if (isEqual) {
            // res.redirect('/home');
            console.log('correct pass1');
            res.json(result)
          } else {
            const errors = validationResult(req);
            //   if (!errors.isEmpty()) {
            //     res.render('login', {
            //       errorMessage: 'Invalid pass',
            //     });
            //   } else {
            res.render('login', { errorMessage: 'not correct pass' });
            console.log('not correct pass');
            //   }
          }
        });
      } else {
        res.render('login', { errorMessage: 'email not founded' });
        console.log('email not founded');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getReset = (req, res) => {
  res.render('reset');
};
exports.postReset = (req, res) => {
  const email = req.body.email;
  User.findOne({ email: req.body.email }).then((result) => {
    console.log(email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: req.body.email,
        pass: 'wcsrgogdxpwyllrh',
      },
    });
    transporter
      .sendMail({
        to: req.body.email,
        from: 'admin@gmail.com',
        subject: 'reset alert',
        html: 'reset ' + 'http://localhost:3000/reset/' + result._id,
      })
      .catch((err) => {
        console.log(err);
      });
    res.render('login', { errorMessage: undefined });
  });
};
exports.getnewPass = (req, res) => {
  console.log(req.params.id);
  res.render('newPass', {
    userId: req.params.id,
  });
};
exports.postnewPass = (req, res) => {
  console.log('reset goood');
  User.findOne({ _id: req.params.id }).then((result) => {
    if (result) {
      bcrypt
        .hash(req.body.password, 12)
        .then((hashedPass) => {
          result.password = hashedPass;
          result.save();
          console.log('password has been change successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.redirect('/reset');
    }
  });
  res.redirect('/login');
};
