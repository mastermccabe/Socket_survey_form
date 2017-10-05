var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");


var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

// this is the line that tells our server to use the "/static" folder for static content
// app.use(express.static(__dirname + "/static"));
// two underscores before dirname
// try printing out __dirname using console.log to see what it is and why we use it
// app.set('views', __dirname + '/views');

app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, "./static")));
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');
var userinfo;
app.get('/', function(req, res) {
  res.render('index', {
    title: "my Express project"
  })
  console.log("home???");
})

app.post('/submit', function(req, res) {
  userinfo = req.body;
  // console.log(userinfo);

  res.redirect('/results');
})
app.get('/results', function(request, response) {
  response.render('results', {
    'user': userinfo
  })
});

var server = app.listen(8050, function() {
  console.log("listening on port 8050");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  // console.log("Client/socket is connected!");
  console.log("Client/socket id is: ", socket.id);
  // all the server socket code goes in here
  // socket.on("button_clicked", function(data, response) {
  //   console.log('You emitted the following information to the server: ' + data.reason);
  //   // userinfo = req.body;
  //
  //   socket.emit(response, 'server_response', {
  //     response: "sockets are the best!"
  //   });
  // })
  io.on('connection', function(socket) {
    // console.log('connection is er');
    socket.on('context', function(message) {
      // console.log('test');
      // console.log('name: ' + message.user.name);
      // console.log('location: ' + message.user.location);
      // console.log('language: ' + message.user.language);
      // console.log('comment: ' + message.user.comment);

      var msg = "You emitted the following information to the server:" +
        JSON.stringify(message.user);
      console.log(message.user);
      socket.emit('updated_message', {
        key: msg
      });
      var rand = "<br><br>Your lucky number emitted by the server is: " + Math.floor((Math.random() * 1000) + 1);
      socket.emit('random', {
        rand: rand
      });
    });
  });
})
// If you don't know where this code is supposed to go reread the above info
