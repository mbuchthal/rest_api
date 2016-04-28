
const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = (req, res, next) => {
  jwt.verify(req.headers.token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'could not authenticate - token error' });

    User.findOne({ findHash: decoded.idd }, (err, data) => {
      if (err) return res.status(403).json({ msg: 'could not authenticate - db error' });

      if (!data) return res.status(403).json({ msg: 'could not authenticate - user unlocated' });

      req.user = data;
      next();
    });
  });
};
