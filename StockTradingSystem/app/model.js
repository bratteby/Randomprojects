/* jslint node: true */
"use strict";

/**
 * A module that contains the main system object!
 * @module roomSystem
 */

var roomList = [];

/**
 * Creates a room with the given name.
 * @param {String} name - The name of the room.
 */
function Room(name) {
    this.name = name; //Name of stock (Room)
    this.orders = [];
    this.trades = [];
    //this.users = []; //Not really relevant

    //Adds order to order book, but first checks if it can fill a trade.
    this.addOrder = function(order){    
      if(this.orders.length>0){
        checkIfMatch(order,this); 
      }
      else{
        this.orders.push(order);
      }

      console.log("Nuvarande orders:");
      console.log(this.orders);
    };

}

//Checks if new order matches any old orders and calls neccesary functions
function checkIfMatch(order,stock){
  var type = order.type;
  var otherType = (type==="sell") ? "buy" : "sell"; //Sets to other type

  var filled = false;
  //Iterate through orders and check if match
  var i=0;
  var initalLength = stock.orders.length;
  while(!filled && i<initalLength && stock.orders.length>0){ //While-loop instead of for because more effective
  //for(var i=0; i<stock.orders.length;i++){
    if(stock.orders[i].type===otherType){ //Om motsatt typ
      if(type==="buy" && order.price>=stock.orders[i].price){ //Buy order has a valid match
        console.log("Your buyorder got a match!");
        [filled,i] = makeTrade(stock,order,i);
        
      }
      else if(type==="sell" && order.price<=stock.orders[i].price){
        console.log("Your sellorder gor a match!");
        [filled,i] = makeTrade(stock,order,i);
      }
    }
    i+=1;
    console.log("Order book length: "+stock.orders.length);
    console.log("Index: "+i);
  }

  //Add order to list if it couldn't be filled
  if(!filled){
    console.log("Couldn't fill order, added it to orderbook");
    stock.orders.push(order);
  }
}

//Makes a trade, depending on conditions either current order or previous order is filled
function makeTrade(stock,order,i){
  console.log("Reched makeTrade()");
  var filled=false;
  var nrStocksTraded = 0;
  var priceTraded = order.price;
  //console.log(stock.orders[i].amount);
  //console.log(order.amount);
  console.log("index: "+i);
  if(stock.orders[i].amount<order.amount){ //The matching order is filled
    nrStocksTraded = stock.orders[i].amount;
    order.amount -= stock.orders[i].amount;

    //Remove the corresponding order
    stock.orders.splice(i,1); //Remove one order at index i
    i-=1; //So that iteration don't go out of bounds

    console.log("Orders after remove: "+stock.orders.toString());
    
  }
  else{ //The new order is filled
    //Check first if both are filled, if so remove old order as well
    if(stock.orders[i].amount===order.amount){ 
      console.log("Perfect match");
      stock.orders.splice(i,1);
      i-=1; //So that iteration don't go out of bounds
    }
    else{ //Else we just remove the orders amount from the old order
      console.log("Partial match");
      stock.orders[i].amount -= order.amount; 
    }

    nrStocksTraded = order.amount;
    console.log("Orders after remove: "+stock.orders.toString());
    filled = true;  
  }

  //*Insert trade into history*//
  stock.trades.push({amount:nrStocksTraded,price:priceTraded});
  return [filled,i];
}


/**
 * Creates a room with the given name.
 * @param {String} name - The name of the room.
 */
exports.addRoom = function (name) {
  var newRoom = new Room(name);
  roomList.push(newRoom);
};

/**
 * Returns all the Rooms.
 */
exports.getRooms = function() {
  return roomList;
};

/** Också överflödig tror jag
 * Removes the room object with the matching name.
 * @param {String} name - The name of the room.
 */
exports.removeRoom = function(name){
  for (var i = 0; i < roomList.length; i++) {
    var room = roomList[i];
    if (room.name === name) {
      roomList.splice(i, 1);
      room.remove();
      break;
    }
  }
};

/**
 * Return the room object with the matching name.
 * @param {String} name - The name of the room.
 */
exports.findRoom = function(name) {
  for (var i = 0; i < roomList.length; i++) {
    if (roomList[i].name === name) {
      return roomList[i];
    }
  }
};
