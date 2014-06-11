'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
// var multiparty = require('multiparty');

exports.new = (req, res)=>{
  res.render('users/new');
};

exports.login = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
};

exports.create = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
};

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    res.locals.user = user;
    next();
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/login');
};
