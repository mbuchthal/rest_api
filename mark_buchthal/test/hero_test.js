
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const Hero = require(__dirname + '/../models/hero');

var port = process.env.PORT = 1234;
process.env.MONGO_URI = 'mongodb://localhost/heroes_test_db';

require(__dirname + '/../server');

describe('POST method', () => {

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should create a new hero', (done) => {
    request('localhost:' + port)
    .post('/api/heroes')
    .send({ name:'Wonder Woman', archNemesis:'Cheetah', powerLevel: 8, superPower:['super strength','magic lasso','invisible jet']})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('Wonder Woman');
      expect(res.body.archNemesis).to.eql('Cheetah');
      expect(res.body.powerLevel).to.eql(8);
      expect(res.body.superPower.length).to.eql(3);
      done();
    });
  });
});

describe('GET method', () => {
  it('should GET the hero data', (done) => {
    request('localhost:' + port)
    .get('/api/heroes')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });
});

describe('routes that need an existing database', () => {

  beforeEach((done) => {
    var testHero = new Hero({name: 'testhero', powerLevel: 0, superPower: ['testing'], archNemesis: 'bugs'});
    testHero.save((err, data) => {
      this.hero = data;
      done();
    });
  });

  afterEach((done) => {
    this.hero.remove((err) => {
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should allow updates to heroes with PUT', (done) => {
    request('localhost:' + port)
    .put('/api/heroes/' + this.hero._id)
    .send({name:'changed', powerLevel:10, superPower:['changed'], archNemesis: 'changed'})
    .end((err, res) => {
      expect(res.status).to.eql(200);
      expect(res.body.msg).to.eql('updated');
      done();
    });
  });

  it('should allow heroes to be deleted with DELETE', (done) => {
    request('localhost:' + port)
    .delete('/api/heroes/' + this.hero._id)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('deleted');
      done();
    });
  });
});
