const jwt = require('jsonwebtoken');
function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // if (token == null) return res.sendStatus(401);
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log('token= ' + token);
    // console.log(token);
    if (token == process.env.ACCESS_TOKEN_SECRET) console.log('true');
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
      if (err) return res.status(403).json('not a valid token');

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('you are not authenticated');
  }
}
module.exports = { authToken };
