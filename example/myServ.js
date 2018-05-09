const http = require('http');
const url = require('url');
const fs = require("fs");

//One Signal Wrapper
const wrapper = require('../OneSignalWrapper.js')
const credentials = require('./mydata.js');

console.log(credentials);
console.log(credentials.appId);

//Connected devices
let userIds = [];

//Configure wrapper
wrapper.configure(credentials.appId, credentials.authorizationHeader);

//Server log function
function log(text) {
  console.log("| ", text);
}

//Send a notification to all devices using wrapper
function handleAssignUsername(username, id) {
  wrapper.assignUsernameToID(username,id).then(function (result) {
    log(result);
  })
}

function handleSendUsernames(usernameString) {
  const usernames = usernameString.split(";");

  wrapper.sendNotificationToMultUsername("Hello to usernames "+usernames,usernames).then(function (result) {
    log(result);
  });
}

function handleSendNotifAll(message) {
  wrapper.sendNotificationToAll(message).then(function (result) {
    log(result);
  });
}

//Send a notification to multiple IDs using wrapper
function handleSendNotifIds(idString) {
  const ids = idString.split(";");

  wrapper.sendNotificationToMultID("Hello to IDs "+ids,ids).then(function (result) {
    log(result);
  });
}

//Send a notification to multiple segments using wrapper
function handleSendNotifSegments(segmentString) {
  const segments = segmentString.split(";");

  wrapper.sendNotificationToMultSegments("Hello to segments "+segments,segments).then(function (result) {
    log(result);
  });
}

//Send a notification to multiple users who connected since runtime using wrapper
function handleSendNotifSaved(data) {
  wrapper.sendNotificationToMultID("Hello to saved "+userIds,userIds).then( function(result) {
    log(result);
  });
}

//Send a notification to a known user who just connected
function handleKnownUser(userId) {
  log("User with player ID " + userId + " just entered");

  if(userIds.indexOf(userId) == -1)
  {
    userIds.push(userId);
  }

  wrapper.sendNotificationToID("Hello " + userId, userId).then(function (result) {
    log(result);
  });
}

//Send a notification to a new user who just connected
function handleNewUser(userId) {
  log("Player id of new subscribed user is " + userId);

  if(userIds.indexOf(userId) == -1)
  {
    userIds.push(userId);
  }

  wrapper.sendNotificationToID("Welcome " + userId, userId).then(function (result) {
    log(result);
  });  
}

//Main
fs.readFile('index.html', function (err, html) {

  if (err) {
    throw err;
  }

  var server = http.createServer(function (req, res) {
    var page = url.parse(req.url).pathname;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });

  server.listen(8080);

  log("Server running")

  //Socket handling
  var io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {

    log("User connected to socket.io socket");

    socket.on('sendNotifAll', handleSendNotifAll);

    socket.on('sendNotifId', handleSendNotifIds);

    socket.on('sendNotifSegment', handleSendNotifSegments);

    socket.on('sendNotifSaved', handleSendNotifSaved);

    socket.on('newUserId', handleNewUser);

    socket.on('userId', handleKnownUser);

    socket.on('sendAssignUsername', handleAssignUsername);

    socket.on('sendNotifUsername', handleSendUsernames);

  });
});


