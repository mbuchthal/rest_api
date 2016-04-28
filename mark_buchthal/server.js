
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const heroRouter = require(__dirname + '/routes/herorouter');
const villainRouter = require(__dirname + '/routes/villainrouter');
const battleRouter = require(__dirname + '/routes/battlerouter');
const authRouter = require(__dirname + '/routes/authrouter');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/hero_db');

app.use('/api', authRouter);
app.use('/api', heroRouter);
app.use('/api', villainRouter);
app.use('/api', battleRouter);
app.use((req, res) => {
  res.status(404).json({ 'msg': '404 - Save the cheerleader, Save the world' });
});
app.listen(PORT, () => console.log('server up on port: ' + PORT));

