const USERS = require('../models/users');
const { server } = require('../server'); // Adjust the path to your server file

exports.getHome = (req, res, next) => {
  // res.render('home');

  console.log(req.user._id);
  USERS.findOne({ _id: req.user._id }).then((result) => {
    console.log('homeeee');
    res.json(result.task);
  });
};
exports.postTask = (req, res, next) => {
  console.log('add');
  console.log(req.user._id);
  console.log('--------------------\n\n\n');
  console.log(req.body.valueTask);
  USERS.findOne({ _id: req.user._id })
    .then((result) => {
      console.log(result);
      const task = {
        id: result._id,
        name: req.body.valueTask,
        userName: result.name,
      };
      result.task.push(task);
      result.save().then(() => {
        // const io = require('socket.io')(server);

        // io.emit('newTask', task);
        console.log('hhhere=\n');
        console.log(task);
        // res.json({
        //   status: true,
        //   name: task.name,
        //   userName: task.userName,
        //   idUser: task.id,
        // });
      
        USERS.findOne({ _id: req.user._id }).then((result) => {
          console.log('homeeee');
          res.json(result.task);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteTaskAll = (req, res, next) => {
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

exports.deleteTaskOne = (req, res, next) => {
  // console.log(req.user.task);
  console.log('objectONEEE');
  console.log(req.body.USER_ID);
  if (req.user._id === req.body.USER_ID) {
    USERS.findOne({ _id: req.user._id }).then((result) => {
      // console.log(result.task);
      console.log(result.task);
      const taskIndex = result.task.findIndex(
        (item) => item.name === req.body.name
      );
      if (taskIndex !== -1) {
        result.task.splice(taskIndex, 1);
        result.save().then((result) => {
          //return all data again
          // res.json(result);
          USERS.findOne({ _id: req.user._id }).then(
            (result) => {
              console.log('saassssssd');
            console.log(result.task);

              //return all data again
              res.json(result.task);
            }
          );
        });
      } else {
        USERS.findOne({ _id: req.user._id }, { task: 1, _id: 0 }).then(
          (result) => {
            //return all data again
            console.log('saad');
            console.log(result);
            res.json(result);
          }
        );
      }
    });
  } else {
    USERS.findOne({ _id: req.user._id }, { task: 1, _id: 0 }).then((result) => {
      //return all data again
      console.log('saad');
      res.json(result);
    });
    // res.json('you are not authrized to delete other tasks');
  }
};

exports.editTaskAll = (req, res, next) => {
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
exports.editTaskOne = (req, res, next) => {
  // console.log(req.user.task);
  console.log('look here');
  console.log(req.body.name);
  console.log(req.body.Oldname);
  if (req.user._id === req.body.USER_ID&&req.body.name) {
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
          
          USERS.findOne({ _id: req.user._id }).then((result) => {
            console.log('homeeee');
            res.json(result.task);
          });
        });
        // res.json('edited');
      } else {
        USERS.findOne({ _id: req.user._id }).then((result) => {
          console.log('homeeee');
          res.json(result.task);
        });
      }
    });
  } else {
    // res.json('you are not authrized to edit other tasks');
    console.log('you are not authrized to edit other tasks');
    USERS.findOne({ _id: req.user._id }).then((result) => {
      console.log('homeeee');
      res.json(result.task);
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
