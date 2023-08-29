const USERS = require('../models/users');
const { server } = require('../server'); // Adjust the path to your server file

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
        const io = require('socket.io')(server);

        io.emit('newTask', task);
        console.log('hhhere=\n');
        console.log(task);
        res.json({
          status: true,
          name: task.name,
          userName: task.userName,
          idUser: task.id,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteTask = (req, res, next) => {
  // console.log(req.user.task);
  console.log('object');
  console.log(req.body.USER_ID);
  if (req.user._id === req.body.USER_ID) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      // console.log(result.task);
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.name
      );
      if (taskIndex !== -1) {
        result.task.splice(taskIndex, 1);
        result.save().then(() => {
          USERS.find({}, { task: 1, _id: 0 }).then((result) => {
            //return all data again
            console.log('saad');
            res.json(result);
          });
        });
      }
    });
  } else {
    USERS.find({}, { task: 1, _id: 0 }).then((result) => {
      //return all data again
      console.log('saad');
      res.json(result);
    });
    // res.json('you are not authrized to delete other tasks');
  }
};

exports.editTask = (req, res, next) => {
  // console.log(req.user.task);
  console.log('look here');
  console.log(req.body.name);
  console.log(req.body.Oldname);
  if (req.user._id === req.body.USER_ID) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      console.log(result.task);
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
            //return all data again
            console.log('saad');
            res.json(result);
          });
        });
        // res.json('edited');
      }
    });
  } else {
    // res.json('you are not authrized to edit other tasks');
    console.log('you are not authrized to edit other tasks');
    USERS.find({}, { task: 1, _id: 0 }).then((result) => {
      //return all data again
      console.log('saad');
      res.json(result);
    });
  }
};
exports.getAllTasks = (req, res, next) => {
  USERS.find({}, { task: 1, _id: 0 }).then((result) => {
    console.log('all');
    console.log(result);
    res.json(result);
  });
};
