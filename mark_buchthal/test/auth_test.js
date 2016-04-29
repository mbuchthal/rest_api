
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const Hero = require(__dirname + '/../models/hero');
const User = require(__dirname + '/../models/user');
const server = require(__dirname + '/../_server');

var port = process.env.PORT = 1234;
process.env.MONGO_URI = 'mongodb://localhost/heroes_test_db';
process.env.APP_SECRET = 'testsecret';

describe('authorization routes', () => {
  before((done) => {
    server.listen(port, 'mongodb://localhost/heroes_test_db', done)
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        server.close(done);
      });
    });
  });

  it('should allow a user to /signup', (done) => {
    request('localhost:' + port)
    .post('/api/signup')
    .send({ username: 'test', password: 'test' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.token).to.have.length.above(0);
      done();
    });
  });

  describe('signin', () => {
    var newUser;

    before((done) => {
      newUser = new User({ username: 'test2', password: 'test2' });
      newUser.generateHash(newUser.password);
      newUser.save((err, data) => {
        if (err) throw err;
        this.user = data;
        done();
      });
    });

    it('should be able to verify users to /signin', (done) => {
      request('localhost:' + port)
      .get('/api/signin')
      .auth(this.user.username, 'test2')
      .send(newUser)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
    });
  });
});

