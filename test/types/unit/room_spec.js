/* global describe, it, before, beforeEach, afterEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');

var Room;
var Floor;
var Building;

describe('Room', function(){
  before(function(done){
    db(function(){
      Room = traceur.require(__dirname + '/../../../app/models/room.js');
      Floor = traceur.require(__dirname + '/../../../app/models/floor.js');
      Building = traceur.require(__dirname + '/../../../app/models/building.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('buildings').drop(function(){
      global.nss.db.collection('floors').drop(function(){
        global.nss.db.collection('rooms').drop(function(){
          factory('room', function(rooms){
            factory('building', function(buildings){
              cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
                factory('floor', function(floors){
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.create', function(){
    it('should create a room', function(done){
      Building.findById('c123456789abcdef01234567', function(building){
        building.createRoom({'name':'bedroom', 'beginX':'2', 'beginY':'1', 'endX':'3', 'endY':'2', 'floorId':'b123456789abcdef01234568'}, function(b){
          expect(b.rooms).to.have.length(1);
          // expect(b.rooms[0]).to.be.instanceof(Room);
          expect(b.rooms[0].name).to.equal('bedroom');
          expect(b.rooms[0].begin.x).to.deep.equal(2);
          expect(b.rooms[0].begin.y).to.deep.equal(1);
          expect(b.rooms[0].end.x).to.deep.equal(3);
          expect(b.rooms[0].end.y).to.deep.equal(2);
          expect(b.rooms[0].floorId).to.deep.equal(Mongo.ObjectID('b123456789abcdef01234568'));
          done();
        });
      });
    });
  });

  // describe('.findAllByUserId', function(){
  //   it('should find buildings by user id', function(done){
  //     Building.findAllByUserId('0123456789abcdef01234568', function(buildings){
  //       expect(buildings).to.have.length(3);
  //       expect(buildings[0]).to.be.instanceof(Building);
  //       done();
  //     });
  //   });
  // });
  //
  // describe('.findById', function(){
  //   it('should find a building', function(done){
  //     Building.findById('c123456789abcdef01234567', function(building){
  //       expect(building).to.be.instanceof(Building);
  //       expect(building.name).to.equal('castle');
  //       done();
  //     });
  //   });
  // });

});
