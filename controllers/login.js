const User = require('../models/users');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
exports.getLogin = (req, res, next) => {
  // res.render('login', { errorMessage: null });
};
exports.postLogin = (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
   console.log("Invalid credentials");
  }
  errors = [];
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        bcrypt.compare(req.body.password, result.password).then((isEqual) => {
          if (isEqual) {
            const payload = result.toObject();
            const accessToken = jwt.sign(payload,  process.env.ACCESS_TOKEN_SECRET);
            // res.redirect('/home');
            const userAuthed = { ...result, accessToken: accessToken }
            res.json({
              status: true,
              result: {...userAuthed,accessToken: accessToken},
            });
          } else {
            const errors = validationResult(req);
            res.json({
              status: false,
              result: [],
            });
            console.log('not correct pass');
          }
        });
      } else {
        // res.render('login', { errorMessage: 'email not founded' });
        res.json(false);
        console.log('email not founded');
      }
    })
    .catch((err) => {
      res.json(false);
      console.log(err);
    });
};
exports.getReset = (req, res) => {
  // res.render('reset');
};
exports.postReset = (req, res) => {
  const email = req.body.email;
  User.findOne({ email: req.body.email }).then((result) => {
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
        html: 'reset ' + 'http://localhost:3000/NewPass/' + result._id,
      })
      .catch((err) => {
        console.log(err);
      });
    // res.render('login', { errorMessage: undefined });
  });
};
exports.getnewPass = (req, res) => {
  // console.log(req.params.id);
  // res.render('newPass', {
  //   userId: req.params.id,
  // });
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
          res.json('password has been change successfully');
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    } else {
      res.json('this email not registered');
      // res.redirect('/reset');
    }
  });
};
