
const express = require('express');
const User = require(__dirname + '/../models/user');
const jsonParser = require('body-parser').json();
const basicHttp = require(__dirname + '/../lib/basic_http');

var router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;

  if (password.length < 4) {
    return res.status(500).json({ msg: 'passwords must be at least 4 characters' });
  }
  if (!password) {
    return res.status(500).json({ msg: 'password not completed' });
  }
  var newUser = new User({ username: req.body.username, password: password });
  newUser.generateHash(password);
  password = null;

  newUser.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: 'user not created' });
    }
    user.generateToken((err, token) => {
      if (err) return res.status(500).json({ msg: 'could not create user' });

      res.json({ token, msg: 'user signup successful' });
    });
  });
});

router.get('/signin', basicHttp, (req, res) => {
  User.findOne({ username: req.auth.username }, (err, user) => {
    if (err) return res.status(500).json({ msg: 'error retrieving user' });

    if (!user) return res.status(500).json({ msg: 'user not found' });

    if (!user.compareHash(req.auth.password)) {
      return res.status(500).json({ msg: 'could not verify' });
    }

    user.generateToken((err, token) => {
      if (err) return res.status(500).json({ msg: 'could not create user' });

      res.json({ token, msg: 'user signin successful' });
    });
  });
});
