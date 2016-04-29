
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const Villain = require(__dirname + '/../models/villain');
const User = require(__dirname + '/../models/user');
const server = require(__dirname + '/../_server');

process.env.APP_SECRET = 'testsecret';
var port = process.env.PORT = 1234;

process.on('exit', () => {
  if (mongoose.connection.db) {
    mongoose.connection.db.dropDatabase();
  }
});

describe('the Villain server', () => {
  before((done) => {
    server.listen(port, 'mongodb://localhost/heroes_test_db', done)
  });

  before((done) => {
    var user = new User({ username: 'test', password: 'test' });
    user.save((err, data) => {
      if (err) throw err;
      this.user = data;
      data.generateToken((err, token) => {
        if (err) throw err;
        this.token = token;
        done();
      });
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        server.close(done);
      });
    });
  });

  it('POST should create a new villain', (done) => {
    request('localhost:' + port)
    .post('/api/villains')
    .set('token', this.token)
    .send({ name:'Cheetah', dastardlyDoGooder:'Wonder Woman', powerLevel: 8, superPower:['she\'s a cat', 'has claws', 'meows']})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('Cheetah');
      expect(res.body.dastardlyDoGooder).to.eql('Wonder Woman');
      expect(res.body.powerLevel).to.eql(8);
      expect(res.body.superPower.length).to.eql(3);
      done();
    });
  });

  it('should GET the villain data', (done) => {
    request('localhost:' + port)
    .get('/api/villains')
    .set('token', this.token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  describe('routes that need an existing database', () => {
    beforeEach((done) => {
      var testVillain = new Villain({name: 'testVillain', powerLevel: 0, superPower: ['testing'], archNemesis: 'bugs'});
      testVillain.save((err, data) => {
        this.villain = data;
        done();
      });
    });

    afterEach((done) => {
      this.villain.remove((err) => {
        done();
      });
    });

    it('should allow updates to villains with PUT', (done) => {
      request('localhost:' + port)
      .put('/api/villains/' + this.villain._id)
      .set('token', this.token)
      .send({name:'changed', powerLevel:10, superPower:['changed'], archNemesis: 'changed'})
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.eql('updated');
        done();
      });
    });

    it('should allow villains to be deleted with DELETE', (done) => {
      request('localhost:' + port)
      .delete('/api/villains/' + this.villain._id)
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('deleted');
        done();
      });
    });
  });
});
