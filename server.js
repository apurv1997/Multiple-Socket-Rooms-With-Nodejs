const { Socket } = require("engine.io");
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
// var engine = require('consolidate');
// var bodyParser = require("body-parser")
const port = 3000;

const res = require("express/lib/response");

let connected_user = new Array();
let connectedUserInfo = new Array();
let username_aa = "";
let clientid_aa = "";
let switchroom = "";
let storeInfo = new Array();
let arr1 = new Array();

app.use(express.static(__dirname));

app.set('views', __dirname + '/views');
// app.use(bodyParser.urlencoded({extend:true}));
// app.engine('html', require('ejs').renderFile);
// app.engine('html', engine.mustache);
// app.set('view engine', 'html');

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
// app.get("/table", function (req, res) {
//   res.sendFile(__dirname + "/table.html");
// });
app.use('/pug', (req, res, next) => {
  // console.log(arr1);
  res.render('index.pug', { Room: arr1 });
});

// Build Socket Connection
io.on("connection", function (socket) {
  console.log("a user connected: " + socket.id);
  console.log("Client Connection Established!!");

  /************* SERVER ROOM CREATION **************/
  socket.on("createRoom", function (room) {
    socket.join(room[0]);
    console.log(io.sockets.adapter.rooms);
    // console.log(room);
    username_aa = room[1];
    clientid_aa = room[0];
    connected_user.push({
      ["username"]: username_aa,
      ["socket"]: socket.id,
    });
    // console.log(connected_user);
    const mySet1 = new Set(socket.rooms);

    const myMap = new Map();
    // let arr1 = new Array();
    arr1 = [];
    mySet1.forEach(function (value) {
      myMap.set(socket.id, value);
      for (const [key, value] of myMap) {
        // console.log(key + ' : ' + value);
        arr1.push(key + ' : ' + value);
        
      }   
    }); 
    console.log(arr1);
  });

  /********* LOBBY ROOM CREATION **********/
  socket.on("lobbyRoomCreation", function (room) {
    console.log("switchroom = " + switchroom);
    if (switchroom == "") {
      socket.join(room[0] + "_" + "lobby");
      switchroom = "lobby";
    } else {
      socket.leave(room[0] + "_" + switchroom);
      switchroom = "lobby";
      socket.join(room[0] + "_" + switchroom);
    }
    console.log("***** Message: Client inside Lobby Room *****");
    console.log(io.sockets.adapter.rooms);
    username_aa = room[1];
    clientid_aa = room[0];
    connectedUserInfo.push({
      ["clientID"]: clientid_aa,
      ["username"]: username_aa, 
      ["socket"]: socket.id,
      ["room"]: room[0] + "_lobby",
    });
    // console.log(connectedUserInfo);
    multirooms();
  });

  /********* GAME_LOBBY ROOM CREATION **********/
  socket.on("gamelobbyRoomCreation", function (room) {
    console.log("switchroom = " + switchroom);
    if (switchroom == "") {
      socket.join(room[0] + "_" + "gamelobby");
      switchroom = "gamelobby";
    } else {
      socket.leave(room[0] + "_" + switchroom);
      switchroom = "gamelobby";
      socket.join(room[0] + "_" + switchroom);
    }
    console.log("***** Message: Client inside GameLobby Room *****");
    console.log(io.sockets.adapter.rooms);
    username_aa = room[1];
    clientid_aa = room[0];
    connectedUserInfo.push({
      ["clientID"]: clientid_aa,
      ["username"]: username_aa,
      ["socket"]: socket.id,
      ["room"]: room[0] + "_gamelobby",
    });
    // console.log(connectedUserInfo);
    multirooms();
  });

  /********** GAME_TABLE ROOM CREATION ***********/
  socket.on("gametableRoomCreation", function (room) {
    console.log("switchroom = " + switchroom);
    if (switchroom == "") {
      socket.join(room[0] + "_" + "gametable");
      switchroom = "gametable";
    } else {
      socket.leave(room[0] + "_" + switchroom);
      switchroom = "gametable";
      socket.join(room[0] + "_" + switchroom);
    }

    console.log("***** Message: Client inside GameTable Room *****");
    console.log(io.sockets.adapter.rooms);
    username_aa = room[1];
    clientid_aa = room[0];
    connectedUserInfo.push({
      ["clientID"]: clientid_aa,
      ["username"]: username_aa,
      ["socket"]: socket.id,
      ["room"]: room[0] + "_gametable",
    });
    multirooms();
  });

  const multirooms = () => {
    const mySet1 = new Set(socket.rooms);
    const myMap = new Map();
    // let arr1 = new Array();
    arr1 = [];
    io.sockets.adapter.rooms.forEach(function (key,value) {
      console.log(key,value);
    //  myMap.set(key, value);

      key.forEach(function(value2){
        arr1.push(value + ' : ' + value2);
      });
    });
    console.log(arr1);
  }


  /************ Disconnection socket *************/
  socket.on("disconnect", function () {
    console.log("Client disconnected. " + socket.id);
  });
});

/**************** PORT ENVIRONMENT ***************/
http.listen(port, function () {
  console.log(`listening on port: ${port}`);
});
