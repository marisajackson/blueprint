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
var cookie;

describe('floors', function(){
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

  describe('Authentication', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        console.log(cookies);
        var c1 = cookies[0].split(';');
        var c2 = cookies[1].split(';');
        cookie = c1[0] + '; ' + c2[0];
        done();
      });
    });

    describe('GET /buildings/new', function(){
      it('should show the new buildings web page', function(done){
        request(app)
        .get('/buildings/new')
        .set('cookie', cookie)
        .end(function(err, res){
           expect(res.status).to.equal(200);
          //  expect(res.text).to.include('sue@aol.com');
           done();
        });
      });

      it('should NOT show the new buildings web page - not logged in', function(done){
        request(app)
        .get('/buildings/new')
        .end(function(err, res){
           expect(res.status).to.equal(302);
           expect(res.headers.location).to.equal('/');
           done();
        });
      });
    });

    describe('POST /buildings', function(){
      it('should create a new building', function(done){
        request(app)
        .post('/buildings')
        .set('cookie', cookie)
        .send('_id=724839123456543456785432')
        .send('name=desert')
        .send('x=40')
        .send('y=50')
        .send('locationId=a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/buildings/724839123456543456785432');
          done();
        });
      });

      it('should NOT create a new building -not logged in', function(done){
        request(app)
        .post('/buildings')
        .send('_id=724839123456543456785432')
        .send('name=desert')
        .send('x=40')
        .send('y=50')
        .send('locationId=a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('GET /buildings/:id', function(){
      it('should got to the buildings show page', function(done){
        request(app)
        .get('/buildings/c123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.contain('castle');
          expect(res.text).to.contain('51.3');
          done();
        });
      });
    });

  });

});
