var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var Room = traceur.require(__dirname + '/room.js');

class Building{
  createRoom(obj, fn){
    Room.create(obj, r=>{
      this.rooms.push(r);
    });
    fn(this);
  }

  static create(obj, fn){
    var building = new Building();
    building._id = Mongo.ObjectID(obj._id);
    building.name = obj.name;
    building.rooms = [];
    building.x = parseInt(obj.x);
    building.y = parseInt(obj.y);
    building.locationId = Mongo.ObjectID(obj.locationId);
    building.userId = Mongo.ObjectID(obj.userId);
    buildingCollection.save(building, ()=>fn(building));
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, buildingCollection, Building, fn);
  }

  static findById(id, fn){
    Base.findById(id, buildingCollection, Building, fn);
  }
}

module.exports = Building;
