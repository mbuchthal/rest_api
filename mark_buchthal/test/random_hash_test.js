
const expect = require ('chai').expect;
const User = require(__dirname + '/../models/user');
const mongoose = require('mongoose');

describe('find hash', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/rand_user_hash_test');
    var newUser = new User({ username: 'test', password: 'test' });
    newUser.save((err, data) => {
      if (err) throw err;
      this.user = data;
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(done);
  });

  it('should be able to create a random hash', () => {
    this.user.generateFindHash((err, hash) => {
      expect(err).to.eql(null);
      expect(hash.length).to.not.eql(0);
      expect(hash).to.eql(this.user.findHash);
      done();
    });
  });
});


