/*global describe, it, before, beforeEach*/
/* jshint expr:true */


'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var app = require('../../../app/app');
var request = require('supertest');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var User;

describe('users', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should get the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /users', function(){
    it('should register a user and redirect', function(done){
      request(app)
      .post('/users')
      .send('email=bob@aol.com')
      .send('password=abc')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.be.ok;
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

    it('should not create a new user', function(done){
      request(app)
      .post('/users')
      .send('email=sue@aol.com')
      .send('password=doesnotmatter')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });


  describe('POST /login', function(){
    it('should log in an existing user', function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.be.ok;
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });


  describe('POST /login', function(){
    it('should NOT log in an existing user- bad email', function(done){
      request(app)
      .post('/login')
      .send('email=wrong@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.not.be.ok;
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should NOT log in an existing user- bad password', function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=abcd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.not.be.ok;
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

  // describe('POST /logout', function(){
  //   it('should logout the existing user', function(done){
  //     request(app)
  //     .post('/logout')
  //     .send('email=sue@aol.com')
  //     .send('password=abcd')
  //     .end(function(err, res){
  //       expect(res.status).to.equal(302);
  //       expect(res.headers['set-cookie']).to.not.be.ok;
  //       expect(res.headers.location).to.equal('/');
  //       done();
  //     });
  //   });
  // });

});
