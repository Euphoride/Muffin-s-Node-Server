var http    = require('http');
var url     = require('url');
var fs      = require('fs');
var express = require('express');

var app     = express();
console.log("Server init successful");

const {
    exec
} = require("child_process");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function print(something) {
  console.log(something);
}

app.get("*", function(req, res) {
  // grab the current time
  var currentTime  = new Date();

  // grab the client's IP address
  var clientIPAddr = req.connection.remoteAddress;

  var hiThere      = false

  // save the connection in a timestamp
  fs.appendFile('timestamping.log', '[' + currentTime + '] ' + clientIPAddr + ' connected...\n', function(err) {
      if (err) throw err;
      console.log('Saved connection!' + "\n");
  });


  if (req.query.type == "sendApplication") {
    clientName  = req.query.name;
    clientEmail = req.query.email;
    clientID    = req.query.id;
    clientDOB   = req.query.dob;

    firstField  = req.query.first;
    seconField  = req.query.second;

    fs.appendFile('datastore/applications.txt', "\n//" + clientName + "//" + clientEmail + "//" + clientDOB + "//" + clientID + "//" + firstField + "//" + seconField + "//", function (err) {
      if (err) throw err;
      console.log('Successfully posted application.');

      res.end("verified");
    });
  } else {
    print("404 - check this out if you're debugging (browser testing means it may be asking for the favicon)");

    // i was so annoyed by front-end bugs when i wrote this that i just took my anger out on the 404
    res.end("404");
  }
}).listen(1412);
