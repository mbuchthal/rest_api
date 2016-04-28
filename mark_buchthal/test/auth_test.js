
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const Hero = require(__dirname + '/../models/hero');

var port = process.env.PORT = 1234;
process.env.MONGO_URI = 'mongodb://localhost/heroes_test_db';
process.env.APP_SECRET = 'testsecret';

require(__dirname + '/../server');

describe('signup', () => {

  after((done) => {
    mongoose.connection.db.dropDatabase(done);
  });

  it('should allow a user to /signup', () => {
    request('localhost:' + port)
    .post('/api/signup')
    .send({ username: 'test', password: 'test' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.token).to.have.length.above(0);
      console.log(res.body);
    });
  });
});

// describe('signin', () => {
//   var token;
//   before((done) => {
//     mongoose.connect('mongodb://localhost/heroes_test_db');
//     var newUser = new User({ username: 'test', password: 'test' });
//     newUser.save((err, data) => {
//       if (err) throw err;
//       this.user = data;
//       done();
//     });
//   });

//   after((done) => {
//     mongoose.connection.db.dropDatabase(done);
//   });

//   it('should be able to verify users to /signin', () => {

//     request('localhost:' + port)
//     .get('/api/signin')
//     .send()
//     .end((err, res) => {
//       expect(err).to.eql(null);
//       expect(res.status).to.eql(200);
//     });

//   });
// });
