const express = require('express'),
  moment = require('moment'),
  usersController = require('../users/usersController'),
  postsController = require('./postsController');

const router = express.Router(),
  authen = usersController.authenMiddleware;
router.post('/', authen, (req, res) => {

  if (!req.body.content) {
    res.status(400).json({
      success: false,
      message: 'Bad Request: content empty'
    });
  } else {
    postInfo = {
      content: req.body.content,
      username: req.username,
      timePost: moment().unix()
    }

    postsController.addPost(postInfo)
      .then(replys => {
        console.log(replys);
        res.status(200).json({
          success: true,
          message: 'post success'
        });
      })
      .catch(err => {
        console.log('error: ' + err);
        res.status(500).json({
          success: false,
          message: 'post error'
        })
      });
  }
});

router.get('/home', authen, (req, res) => {
  postsController.getShowPost(req.username)
    .then(values => {
      res.status(200).json({
        success: true,
        contents: values
      });
    })
    .catch(reason => {
      console.log('getShowPost: ' + reason);
      res.status(500).json({
        success: false,
        message: 'get show post error'
      });
    })
})

router.get('/timeline', authen, (req, res) => {
  postsController.getAllPost()
    .then(values => {
      res.status(200).json({
        success: true,
        contents: values
      });
    })
    .catch(reason => {
      console.log('getShowPost: ' + reason);
      res.status(500).json({
        success: false,
        message: 'get show post error'
      });
    })
})

module.exports = router;
