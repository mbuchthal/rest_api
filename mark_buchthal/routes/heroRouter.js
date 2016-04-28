
const Router = require('express').Router;
const Hero = require(__dirname + '/../models/hero');
const bodyParser = require('body-parser').json();
const serverErrorHandler = require(__dirname + '/../lib/error_handler');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var heroRouter = module.exports = exports = Router();

heroRouter.post('/heroes', jwtAuth, bodyParser, (req, res) => {
  var newHero = new Hero(req.body);
  newHero.save((err, data) => {
    if (err) return serverErrorHandler(err, res);

    res.status(200).json(data);
  });
});

heroRouter.get('/heroes', (req, res) => {
  Hero.find(null, (err, data) => {
    if (err) return serverErrorHandler(err, res);

    res.status(200).json(data);
  });
});

heroRouter.put('/heroes/:id', jwtAuth, bodyParser, (req, res) => {
  var heroData = req.body;
  delete heroData._id;
  Hero.findByIdAndUpdate({ _id: req.params.id }, heroData, (err) => {
    if (err) return serverErrorHandler(err, res);

    res.status(200).json({ msg: 'updated' });
  });
});

heroRouter.delete('/heroes/:id', jwtAuth, (req, res) => {
  Hero.remove({ _id: req.params.id }, (err) => {
    if (err) return serverErrorHandler(err, res);

    res.status(200).json({ msg: 'deleted' });
  });
});
