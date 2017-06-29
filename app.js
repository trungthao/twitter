const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session');

const app = express(),
      userRouter = require('./modules/api/users'),
      postRouter = require('./modules/api/posts');
      followRouter = require('./modules/api/follows')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret : 'thudo-multimedia', resave : false, saveUninitialized: true,  cookie : {} }));
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/follows', followRouter);

app.listen('8888', (req, res) => {
  console.log('app listen on port 8888');
});
