const USERS = require('../models/users');

exports.getHome = (req, res, next) => {
  // res.render('home');

  console.log(req.user._id);
  USERS.findOne({ _id: req.user._id }).then((result) => {
    res.json(result.task);
  });
};
exports.postTask = (req, res, next) => {
  console.log('add');
  console.log(req.user._id);
  console.log(req.body);
  USERS.findOne({ _id: req.user._id })
    .then((result) => {
      console.log(result);
      const task = {
        id: result._id,
        name: req.body.name,
        userName: result.name,
      };
      result.task.push(task);
      result.save().then(() => {
        res.json({
          status: true,
          name: req.body.name,
          userName: result.name,
          idUser: result._id,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deleteTask = (req, res, next) => {
  // console.log(req.user.task);
  // console.log(req.body.name);
  USERS.findOne({ _id: req.user._id }).then((result) => {
    // console.log(result.task);
    const taskIndex = result.task.findIndex(
      (item) => item.name === req.body.name
    );
    if (taskIndex !== -1) {
      result.task.splice(taskIndex, 1);
      result.save();
      res.json('deleted');
    }
  });
};
