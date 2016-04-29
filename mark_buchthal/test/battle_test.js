const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const Hero = require(__dirname + '/../models/hero');
const Villain = require(__dirname + '/../models/villain');
const server = require(__dirname + '/../_server');
var port = process.env.PORT = 1234;

describe('the battle router', () => {
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

  beforeEach((done) => {
    var testHero = new Hero({name: 'testhero', powerLevel: 0, superPower: ['weaktesting'], archNemesis: 'bugs'});
    testHero.save((err, data) => {
      this.hero = data;
      done();
    });
  });

  beforeEach((done) => {
    var testVillain = new Villain({name: 'testvillain', powerLevel: 10, superPower: ['Strongtesting'], dastardlyDoGooder: 'bugs'});
    testVillain.save((err, data) => {
      this.villain = data;
      done();
    });
  });

  afterEach((done) => {
    this.hero.remove((err) => {
      done();
    });
  });

  afterEach((done) => {
    this.villain.remove((err) => {
      done();
    });
  });

  it('should accept get request to battle', (done) => {
    request('localhost:' + port)
    .get('/api/battle')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.text).to.eql('The Strongtesting of testvillain has defeated testhero and their weaktesting!!');
      done();
    });
  });
});
