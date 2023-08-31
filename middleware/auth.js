const jwt = require('jsonwebtoken');
function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
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
