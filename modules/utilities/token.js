const jwt = require('jsonwebtoken'),
      secretKey = 'thudo-multimedia';

var signToken = (userInfo) => {
  return jwt.sign({
    username: userInfo.username
  }, secretKey);
}

var decodeToken = (token) => {
  userInfo = jwt.decode(token, secretKey);
  return userInfo;
}

module.exports = {
  signToken,
  decodeToken
}
