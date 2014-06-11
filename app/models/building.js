var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');
var async = require('async');
var Room = traceur.require(__dirname + '/room.js');
var Location = traceur.require(__dirname + '/location.js');
var Floor = traceur.require(__dirname + '/floor.js');

class Building{
  createRoom(obj, fn){
    Room.create(obj, r=>{
      this.rooms.push(r);
    });
    fn(this);
  }

  save(fn){
    buildingCollection.save(this, ()=>{});
  }


  cost(fn){
    Location.findById(this.locationId, loc=>{
      var rate = loc.rate * this.x * this.y;

        async.map(this.rooms, findFloors, function(err, rooms) {
          rate += rooms.reduce((acc, room)=>{
            var sqft = (room.end.x + 1 - room.begin.x) * (room.end.y + 1 - room.begin.y);
            return acc + (sqft * room.floor.rate);
          }, 0);
          fn(rate);
        });
    });

    function findFloors(room, fn){
      Floor.findById(room.floorId, floor=>{
        room.floor = floor;
        fn(null, room);
      });
    }
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
