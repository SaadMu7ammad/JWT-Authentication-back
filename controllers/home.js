const USERS = require('../models/users');
const { server } = require('../server');
const { emit } = require('process');
const io = require('../socket');

exports.getHome = (req, res, next) => {
  // res.render('home');
  USERS.findOne({ _id: req.user._id }).then((result) => {
    console.log('home');
    res.json(result.task);
  });
};
exports.postTask = (req, res, next) => {
  USERS.findOne({ _id: req.user._id })
    .then((result) => {
      const task = {
        id: result._id,
        name: req.body.valueTask,
        userName: result.name,
      };
      result.task.push(task);
      io.getIO().emit('newTask', {
        action: 'add',
        task: task,
      });

      result.save().then(() => {
        USERS.findOne({ _id: req.user._id }).then((result) => {
          res.json(result.task);
        });
      });
      // res.json({
      //   status: true,
      //   name: task.name,
      //   userName: task.userName,
      //   idUser: task.id,
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteTaskAll = (req, res, next) => {
  if (req.user._id === req.body.USER_ID) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.name
      );
      if (taskIndex !== -1) {
        result.task.splice(taskIndex, 1);
        result.save().then(() => {
          USERS.find({}, { task: 1, _id: 0 }).then((result) => {
            io.getIO().emit('newTask', {
              action: 'delete',
              task: result,
            });
            res.json(result);
          });
        });
      }
    });
  } else {
    USERS.find({}, { task: 1, _id: 0 }).then((result) => {
      res.json(result);
    });
    // res.json('you are not authrized to delete other tasks');
  }
};

exports.deleteTaskOne = (req, res, next) => {
  if (req.user._id === req.body.USER_ID) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.name
      );
      if (taskIndex !== -1) {
        result.task.splice(taskIndex, 1);
        result.save().then((result) => {
          USERS.findOne({ _id: req.user._id }).then((result) => {
            res.json(result.task);
          });
        });
      } else {
        USERS.findOne({ _id: req.user._id }, { task: 1, _id: 0 }).then(
          (result) => {
            res.json(result);
          }
        );
      }
    });
  } else {
    USERS.findOne({ _id: req.user._id }, { task: 1, _id: 0 }).then((result) => {
      res.json(result);
    });
    // res.json('you are not authrized to delete other tasks');
  }
};

exports.editTaskAll = (req, res, next) => {
  if (req.user._id === req.body.USER_ID && req.body.name) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.Oldname
      );
      if (taskIndex !== -1) {
        result.task[taskIndex] = {
          ...result.task[taskIndex],
          name: req.body.name,
        }; //newName
        result.save().then(() => {
          USERS.find({}, { task: 1, _id: 0 }).then((result) => {
            io.getIO().emit('newTask', {
              action: 'edit',
              task: result,
            });
            res.json(result);
          });
        });
      }
    });
  } else {
    // res.json('you are not authrized to edit other tasks');
    console.log('you are not authrized to edit other tasks');
    USERS.find({}, { task: 1, _id: 0 }).then((result) => {
      res.json(result);
    });
  }
};
exports.editTaskOne = (req, res, next) => {
  if (req.user._id === req.body.USER_ID && req.body.name) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.Oldname
      );
      if (taskIndex !== -1) {
        result.task[taskIndex] = {
          ...result.task[taskIndex],
          name: req.body.name,
        }; //newName
        result.save().then(() => {
          USERS.findOne({ _id: req.user._id }).then((result) => {
            res.json(result.task);
          });
        });
        // res.json('edited');
      } else {
        USERS.findOne({ _id: req.user._id }).then((result) => {
          res.json(result.task);
        });
      }
    });
  } else {
    // res.json('you are not authrized to edit other tasks');
    console.log('you are not authrized to edit other tasks');
    USERS.findOne({ _id: req.user._id }).then((result) => {
      res.json(result.task);
    });
  }
};
exports.getAllTasks = (req, res, next) => {
  USERS.find({}, { task: 1, _id: 0 }).then((result) => {
    res.json(result);
  });
};
