const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Socket } = require('socket.io');
require('dotenv').config();
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });
app.use(cors());
// app.set('view engine', 'ejs');
// app.set('views')
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require('mongoose');
const path = require('path');
const URL = process.env.URL;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const userLogin = require('./routes/login');
const userRegister = require('./routes/register');
// app.use((req, res) => {
//   console.log(req);
// });
app.use(userLogin);
app.use(userRegister);

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    const server = app.listen(8080, () => {
      console.log(`Server is running`);
    });
    const io = require('./socket.js').init(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
    });
    io.on('connection', (socket) => {
      console.log('Client Connected!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
