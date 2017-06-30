const db = require('../../utilities/redisClient').databaseClient,
  bcrypt = require('bcrypt'),
  token = require('../../utilities/token');
saltRounds = 10;

db.on('error', (error) => {
  console.log(error);
});

var addUser = (userInfo) => {

  return isUserExists(userInfo.username)
    .then((isExists) => {
      if (!isExists) {
        return hashPassword(userInfo.password)
          .then((hash) => {
            return db.hmset('user:' + userInfo.username, 'username', userInfo.username, 'password', hash);
          })
          .catch((err) => {
            return Promise.reject('hashPassword: ' + err);
          });
      } else {
        return new Promise((resolv, reject) => {
          reject('username exists');
        });
      }
    })
    .catch((err) => {
      return Promise.reject('isUserExists: ' + err);
    });
}

var signIn = (userInfo) => {
  return getUserByUsername(userInfo.username)
    .then((userFromDB) => {
      return bcrypt.compare(userInfo.password, userFromDB.password)
    })
    .catch((err) => {
      return Promise.reject('getUserByUsername: ' + err);
    });
}

var getAllUser = () => {
  return db.keys('user:*')
    .then(users => {
      results = users.map(element => {
        return element.substring(5);
      });
      return Promise.resolve(results);
    })
    .catch(reason => {
      return Promise.reject('keys: ' + reason);
    });
}

var authenMiddleware = (req, res, next) => {
  var myToken = req.session.token;
  getUserByToken(myToken)
    .then((userInfo) => {
      req.username = userInfo.username;
      next();
    })
    .catch((err) => {
      console.log('getUserByToken: ' + err);
      res.status(407).json({
        success: false,
        message: 'not authenticate'
      });
    });
}

var getUserByToken = (myToken) => {
  var userInfo = token.decodeToken(myToken);
  if (userInfo.username) {
    return getUserByUsername(userInfo.username);
  }
}

var getUserByUsername = (username) => {
  return db.hvals('user:' + username)
    .then((reply) => {
      if (!reply.length) return Promise.reject('username not exists');
      let userInfo = {
        username: reply[0],
        password: reply[1]
      }
      return Promise.resolve(userInfo);
    });
}

var hashPassword = (password) => {
  return bcrypt.genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt)
    })
    .catch((err) => {
      return Promise.reject('hashPassword: ' + err);
    });
}

var isUserExists = (username) => {
  return db.exists('user:' + username);
}

module.exports = {
  addUser,
  signIn,
  authenMiddleware,
  getAllUser
}
