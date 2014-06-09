// var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');

class Room{
  static create(obj, fn){
    var room = new Room();
    room.name = obj.name;
    room.begin = {};
    room.begin.x = parseInt(obj.beginX);
    room.begin.y = parseInt(obj.beginY);
    room.end = {};
    room.end.x = parseInt(obj.endX);
    room.end.y = parseInt(obj.endY);
    room.floorId = Mongo.ObjectID(obj.floorId);
    fn(room);
  }
  //
  // static findAllByUserId(userId, fn){
  //   Base.findAllByUserId(userId, roomCollection, room, fn);
  // }
  //
  // static findById(id, fn){
  //   Base.findById(id, roomCollection, room, fn);
  // }
}

module.exports = Room;
