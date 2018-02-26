/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  //Called when user joins a room
  socket.on('join', function (req) {
    var name = req.name; //Name of room
    var user = req.user; //Name of user
    var room = model.findRoom(name);
    //room.addUser(user); //Överflödig för annat än chattprogram, eller?
    socket.join(name);
    
    console.log('A user joined ' + name);
  });

  //Called when user joins a tradeHistoryroom
  socket.on('joinTrades', function (req) {
    var name = req.name; //Name of room
    //var room = model.findRoom(name);
    socket.join(name+"Trades"); //Add "Trades" to separate it from the regular stock room
    console.log('A user joined ' + name+"Trades");
  });

  // user gets updated
  socket.on('update', function (req) {
    console.log("Incoming request:");
    console.log(req);
    var roomName = req.room;
    console.log(roomName);
    //Calls logic of model to add an order and possibly make a trade
    var room = model.findRoom(roomName);  
    room.addOrder(req); 

    var activeOrders = room.orders; //Get orderlist from stock (room)
    var trades = room.trades; //Get history of trades 
    io.to(roomName).emit('update', activeOrders); //Send current orderBook to all clients
    io.to(roomName+"Trades").emit('updateHistory', trades); //Send current tradeHistory to all clients
  });

  // user leaves room DENNA HÄNDER ALDRIG
  socket.on('leave', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    // room.removeUser(user);
    console.log('A user left ' + name);
    io.to(name).emit('leave', user);
  });

};
