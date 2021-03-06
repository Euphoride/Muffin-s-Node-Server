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


  if (req.query.type == "verifySignUp") {
    clientName  = req.query.name;
    clientEmail = req.query.email;
    clientHash  = req.query.hash;
    clientDOB   = req.query.dob;

    fs.appendFile('datastore/accountDetails.txt', "\n//" + clientName + "//" + clientEmail + "//" + clientHash + "//" + clientDOB + "//", function (err) {
      if (err) throw err;
      console.log('Successfully verified a sign up');

      res.end("verified");
    });
  } else if (req.query.type == "verifySignIn") {
    clientName  = req.query.name;
    clientEmail = req.query.email;
    clientHash  = req.query.hash;
    clientDOB   = req.query.dob;

    fs.readFile("datastore/accountDetails.txt", function (err, data) {
      data = data.toString("UTF-8", 0, data.length);

      dataArray = data.split("\n");

      ourComparison = "//" + clientName + "//" + clientEmail + "//" + clientHash + "//" + clientDOB + "//";

      for (item in dataArray) {
        console.log(dataArray);
        console.log(dataArray[item]);
        console.log(ourComparison);
        if (dataArray[item] == ourComparison) {
          hiThere = true;
          console.log("yay");
        }
      }

      if (hiThere == true) {
        res.end("verified");
      } else {
        res.end("something go wrong boi");
      }
    });
  } else {
    print("404 - check this out if you're debugging (browser testing means it may be asking for the favicon)");

    // i was so annoyed by front-end bugs when i wrote this that i just took my anger out on the 404
    res.end("400404040400404040404004040040404040040");
  }
}).listen(1337);
