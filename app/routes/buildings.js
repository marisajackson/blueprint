/*jshint unused: false*/
'use strict';

var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../models/location.js');
var Building = traceur.require(__dirname + '/../models/building.js');
var Floor = traceur.require(__dirname + '/../models/Floor.js');


exports.new = (req, res)=>{
  if(res.locals.user){
    Location.findAll(locations=>{
      res.render('buildings/new', {locations: locations});
    });
  } else {
    res.redirect('/');
  }
};

exports.update = (req, res)=>{
  Building.findById(req.params.id, building=>{
    building.createRoom(req.body, newBuilding=>{
      newBuilding.cost(rate=>{
        res.send({cost:rate});
      });
    });
  });
};

exports.create = (req, res)=>{
  if(res.locals.user){
    req.body.userId = req.session.userId;
    Building.create(req.body, building=>{
      res.redirect(`/buildings/${building._id}`);
    });
  } else {
    res.redirect('/');
  }
};

exports.show = (req, res)=>{
  Floor.findAll(floors=>{
    Building.findById(req.params.id, building=>{
      building.cost(rate=>{
        res.render('buildings/show', {building: building, cost:rate, floors: floors});
      });
    });
  });
};
