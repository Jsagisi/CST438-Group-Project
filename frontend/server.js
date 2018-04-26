/*
const Express=require('express')
const app=Express()

app.use(Express.static(__dirname+'/dist'))

app.listen(process.env.PORT||8080)
*/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var moment = require('moment');

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

http.listen(3000, function(){
  console.log('listening on *:3000');
});
