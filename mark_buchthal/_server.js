const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const heroRouter = require(__dirname + '/routes/herorouter');
const villainRouter = require(__dirname + '/routes/villainrouter');
const battleRouter = require(__dirname + '/routes/battlerouter');
const authRouter = require(__dirname + '/routes/authrouter');
const mongoose = require('mongoose');


app.use('/api', authRouter);
app.use('/api', heroRouter);
app.use('/api', villainRouter);
app.use('/api', battleRouter);
app.use((req, res) => {
  res.status(404).json({ 'msg': '404 - Save the cheerleader, Save the world' });
});

module.exports = exports = {
  server: { close: function() {
    throw new Error('server not started yet');
  }},
  listen: function(port, mongoString, cb) {
    mongoose.connect(mongoString);
    return this.server = app.listen(port, cb);
  },
  close: function(cb) {
    this.server.close();
    if (cb) cb();
  }
};
