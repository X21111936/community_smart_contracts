var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Midland Wind Energy', name:null });
});

router.post('/', function(req, res, next) {

  res.render('index', { title: 'Midland Wind Energy', name:req.body.name });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Midland Wind Energy', name:null });
});

router.get('/wallet', function(req, res, next) {
  res.render('wallet', { title: 'Midland Wind Energy', name:null });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Midland Wind Energy', name:null });
});

router.get('/contracts', function(req, res, next) {
  res.render('contracts', { title: 'Midland Wind Energy', name:null });
});

router.get('/readings', function(req, res, next) {
  res.render('readings', { title: 'Midland Wind Energy', name:null });
});





module.exports = router;

