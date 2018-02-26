/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");

router.get('/roomlist', function (req, res) {
  var rooms = model.getRooms();
  var roomNames = [];
  for (var i = 0; i < rooms.length; i++) {
    roomNames.push(rooms[i]);
  }
  res.json({list:roomNames});
});

//Route to a specific stock
router.get('/room/:room', function (req, res) {
  var orders = model.findRoom(req.params.room).orders;
  res.json({list: orders});
});

//Route to a specific stock-history
router.get('/orderHistory/:room', function (req, res) {
  var trades = model.findRoom(req.params.room).trades;
  res.json({list: trades});
});

//Behövs denna?
router.post('/setUser', function (req, res) {
  	res.json({name:req.body.realname});
});

router.post('/setSecurity', function (req, res) {
	console.log("Försöker lägga till security med namn: "+req.body.secName);
	var securities = model.addRoom(req.body.secName);
  	//res.json({secName:req.body.security_name});
  	res.json({list: securities});

});

module.exports = router;
