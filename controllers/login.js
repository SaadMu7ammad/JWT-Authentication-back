const User = require('../models/users');
const bcrypt = require('bcryptjs')
exports.getLogin = (req, res, next) => {
  res.render('login');
};
exports.postLogin = (req, res, next) => {
  console.log(req.body.email);
  console.log(req.body.password);
  User.findOne({ email: req.body.email })
    .then((result) => {
        bcrypt.compare(req.body.password, result.password).then((isEqual) => {
        if (isEqual) {
          res.redirect('/home');
          console.log('correct pass');
        } else {
          res.render('login');
          console.log('not correct pass');
        }
      });
    })
    .catch((err) => {
      console.log(err);
      console.log('not found email');

      res.render('login');
    });
};
