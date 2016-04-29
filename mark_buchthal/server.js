
if (!process.env.APP_SECRET) { throw new Error('You need to set APP_SECRET'); }

var PORT = process.env.PORT || 3000;
var app = require(__dirname + '/_server.js');
app.listen(PORT, 'mongodb://localhost/hero_db', () => console.log('server up on port: ' + PORT));
