const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
const socketIO = require('socket.io');

// app.set('view engine', 'ejs');
// app.set('views')
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require('mongoose');
const path = require('path');
const URL =
  'mongodb://127.0.0.1:27017/jwtProj?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1';
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const userLogin = require('./routes/login');
const userRegister = require('./routes/register');

app.use(userLogin);
app.use(userRegister);

mongoose.connect(URL).then(() => {
  const server = app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });

  const io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });
  io.on('connection', function (socket) {
    console.log('A user connected');

    socket.on('disconnect', function () {
      console.log('A user disconnected');
    });

    socket.on('chat message', function (msg) {
      io.emit('chat message', msg);
    });
  });
});
