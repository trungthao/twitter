const express = require('express'),
  usersController = require('../users/usersController'),
  followController = require('./followController');

const router = express.Router(),
  authen = usersController.authenMiddleware;

router.post('/', authen, (req, res) => {
  var followInfo = {
    myUsername: req.username,
    followUser: req.body.followUser
  }

  followController.addFollow(followInfo)
    .then(replys => {
      console.log(replys);
      res.status(200).json({
        success: true,
        message: 'follow success'
      });
    })
    .catch(err => {
      console.log('addFollow: ' + replys);
      res.status(500).json({
        success: false,
        message: 'follow error'
      })
    })
});

module.exports = router;
