
module.exports = exports = (req, res, next) => {
  try {
    var authHeaders = req.headers.authorization;
    var namePassword = authHeaders.split(' ')[1];
    var namePassBuf = new Buffer(namePassword, 'base64');
    var namePassPT = namePassBuf.toString();
    namePassBuf.fill(0);
    var namePassArr = namePassPT.split(':');

    req.auth = {
      username: namePassArr[0],
      password: namePassArr[1]
    };
    if (!(req.auth.username.length || req.auth.password.length)) {
      throw new Error('no username or password');
    }
  } catch (e) {
    console.log(e);
    return res.status(422).json({ msg: 'fail' });
  }
  next();
};
