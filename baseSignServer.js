var http    = require('http');
var url     = require('url');
var fs      = require('fs');
var express = require('express');
var bodyParser = require("body-parser");

var app     = express();
console.log("Server init successful");


const {
    exec
} = require("child_process");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("*",function(req,res) {
  // grab the current time
  var currentTime  = new Date();

  // grab the client's IP address
  var clientIPAddr = req.connection.remoteAddress;

  // save the connection in a timestamp
  fs.appendFile('timestamping.log', '[' + currentTime + '] ' + clientIPAddr + ' connected...\n', function(err) {
      if (err) throw err;
      console.log('Saved connection!' + "\n");
  });


  if (req.query.type == "SignUp") {
    clientName  = req.query.name;
    clientEmail = req.query.email;
    clientHash  = req.query.hash;
    clientDOB   = req.query.dob;

    fs.appendFile('datastore/accountDetails.txt', clientName + "//" + clientEmail + "//" + clientHash + "//" + clientDOB, function (err) {
      if (err) throw err;
      console.log('Data stuff');

      res.end("Verified, Logged")
    });
  } else {
    res.end("400404040400404040404004040040404040040")
  }
}).listen(1337);
