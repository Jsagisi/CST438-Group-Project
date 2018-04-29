/*
const Express=require('express')
const app=Express()

app.use(Express.static(__dirname+'/dist'))

app.listen(process.env.PORT||8080)
*/
const moment = require('moment');
const webPort=8080;
const socketPort=3000;

const express=require('express');
const app = express();

//Creates and starts the socket server.
const socketServer = require('http').Server(app).listen(socketPort,()=>{
  console.log("WebSocket Listening On %d",socketPort);
});
const io = require('socket.io')(socketServer);
io.on('connection', function(socket){
  //message recieved from a client
  socket.on('message', (msg) => {
    //send message to all client

    //get current time
    var date = moment().utc('-8:00').toISOString();
    date = date.slice(0,10) + ' ' + date.slice(11,16);
    msg.time = date;

    io.emit('serverMessage', msg);
  })
});

//Create and configure the http server
app.use(express.static(__dirname+'/dist'))
app.listen(webPort,()=>{
  console.log("Web Port Listening On %d",webPort);
});




