const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session');

const app = express(),
      userRouter = require('./modules/api/users'),
      postRouter = require('./modules/api/posts');
      followRouter = require('./modules/api/follows')

var ip = process.env.IP || "0.0.0.0";
var port = process.env.PORT || 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret : 'thudo-multimedia', resave : false, saveUninitialized: true,  cookie : {} }));
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/follows', followRouter);
app.all('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found'
  })
})

app.listen(port, ip, (req, res) => {
  console.log('app listen on port 8888');
});
