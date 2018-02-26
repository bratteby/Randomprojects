var chattControllers = angular.module('chattControllers', []);

//Kontroll för att lista alla stocks
/**
**Scope inehåller variabelinformation
**Location fetchar URLen
**/
chattControllers.controller('listController', ['$scope', '$location',  'HttpService',
  function($scope, $location, http) {

    $scope.rooms = [];
    //Gör en get-request till servern och fetchar tillgängliga stocks
    http.get("/roomList", function(data) {
      $scope.rooms = data.list;
    });
    //Lyssnare från list.html , omdirigerar till rätt stock (room)
    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };
  }
]);

//Controller for each stock (room)
chattControllers.controller('roomController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.room = $routeParams.room;
    $scope.amount = ""; //Redundant now
    $scope.entries = [];

    //Notify server that a user have joined the room
    http.get("/room/"+$scope.room, function(data) {
      $scope.entries = data.list;
      socket.emit("join", {name:$scope.room, username: user.getName()});
    });

    //Öppnar en socket mot servern
    var socket = io().connect();

    //When client recieve update on socket from server
    socket.on('update', function (data) {
      $scope.$apply(function(){
        console.log("update");
        console.log(data);
        //Behöver ändras så att hela "order-fönstret" uppdateras
        //$scope.entries.push(data.username + ": " +data.type+" "+ data.amount +" "+ data.price);
        $scope.entries = data;
      });
    });

    //Output that a user have joined, not relevant
    /*
    socket.on('join', function (data) {
      $scope.$apply(function(){
        console.log("join");
        console.log(data);
        $scope.entries.push(data.username + " joined the channel");
      });
    });
    */

    //When going from stock list to a specific stock
    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };

    //On submit from room.html
    $scope.buy = function() {
      if($scope.amount !== "" && $scope.price !== ""){
        console.log("Reached buy()");

        socket.emit("update", {room:$scope.room, type:"buy", amount:parseInt($scope.amount,10),
          price:parseInt($scope.price,10), username:user.getName()});
        $scope.amount = "";
        $scope.price = "";
      }
    };

    //On submit from room.html
    $scope.sell = function() {
      if($scope.amount !== "" && $scope.price !== ""){
        console.log("Reached sell()");
        socket.emit("update", {room:$scope.room, type:"sell", amount:parseInt($scope.amount,10),
          price:parseInt($scope.price,10), username:user.getName()});
        $scope.amount = "";
        $scope.price = "";
      }
    };

  }
]);

//Redundant
chattControllers.controller('aboutController', ['$scope',
  function($scope) {

  }
]);

//Reusing alot of the logic from listController
chattControllers.controller('orderHistoryController', ['$scope', '$location',  'HttpService',
  function($scope, $location, http) {

    $scope.stocks = [];
    http.get("/roomList", function(data) {
      $scope.stocks = data.list;
    });

    //Listener to redirect to specific stock room
    $scope.redirect = function(room) {
      console.log("Trying to enter tradeHistoryRoom : " + room.name);
      $location.hash("");
      $location.path('/orderHistory/' + room.name);
    };

  }
]);

//Reusing a lot of logic from roomController
chattControllers.controller('viewTradeController', ['$scope', 'HttpService', '$routeParams','UserService',
  function($scope, http, $routeParams,user) {
    $scope.room = $routeParams.room;
    $scope.tradeEntries = [];

    //Öppnar en socket mot servern
    var socket = io().connect();

    //Notify server that a user have joined the stock-history-room
    http.get("/orderHistory/"+$scope.room, function(data) {
      console.log(data);
      $scope.tradeEntries = data.list;
      socket.emit("joinTrades", {name:$scope.room, username: user.getName()});
    });

    //When client recieve update on socket from server
    socket.on('updateHistory', function (data) {
      $scope.$apply(function(){
        console.log("updateTradeHistory");
        $scope.tradeEntries = data;
      });
    });

  }
]);

//Controller for adding a security. Fetches input from addSecurity-html
chattControllers.controller('addSecurityController', ['$scope','HttpService',
  function($scope,http) {
    $scope.security_name = "";
    $scope.done = function() {
      console.log("Reached done() in addSecurity");
      http.post("setSecurity", {secName:$scope.security_name}, function(response){
        console.log(response);
        $location.path('list');
      })
    }
  }
]);

chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {
      console.log("Reached done() in login");
      http.post('setUser', {realname:$scope.name}, function(response) {
        console.log(response);
        user.setName($scope.name);
        $location.path('list');
      });
    };

  }
]);

chattControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
