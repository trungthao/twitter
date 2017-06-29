const express = require('express'),
      router = express.Router(),
      usersController = require('./usersController');
      token = require('../../utilities/token');

router.post('/signup', (req, res) => {
  var userInfo = {
    username: req.body.username,
    password: req.body.password
  }

  usersController.addUser(userInfo)
    .then((reply) => {
      let myToken = token.signToken(userInfo);
      req.session.token = myToken;
      res.status(200).json({
        success: true,
        username: userInfo.username,
        token: myToken,
        message: 'signup success'
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: false,
        message: 'signup error'
      });
    })
});

router.post('/signin', (req, res) => {
  var userInfo = {
    username: req.body.username,
    password: req.body.password
  }

  usersController.signIn(userInfo)
    .then((signInSuccess) => {
      if (signInSuccess) {
        let myToken = token.signToken(userInfo);
        req.session.token = myToken;
        res.status(200).json({
          success: true,
          username: userInfo.username,
          token: myToken,
          message: 'signin success'
        });
      }
    })
    .catch((err) => {
      console.log('signin:' + err);
      res.status(500).json({
        success: false,
        message: 'signin error'
      });
    })
});

router.get('/', usersController.authenMiddleware, (req, res) => {
  usersController.getAllUser().then(values => {
    res.json(values);
  })
});

module.exports = router;
