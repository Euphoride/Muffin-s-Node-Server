// Developed mainly by Emmanuel
// Tweaks by Hazim
var http    = require('http');
var url     = require('url');
var fs      = require('fs');
var express = require('express');

var app     = express();

const {
    exec
} = require("child_process");

function FindClosestCity(clientLat, clientLong) {
  fs.readFile("datastore/longlatplanes.json", function(err, data) {
      // grab client's location through what they've posted via GET


      console.log("Client's Location: Lat:" + clientLat + ", Long: " + clientLong + "\n");

      // grab an array of data from our file
      var parsedJSON = JSON.parse(data)['cityLocations'];

      var completos  = 1000000000000000;
      // the amount of girls
      // i defintely pull on
      // a daily basis
      //
      // A poem, by Hazim.

      var cityNameo = ""
      var numero    = 0

      // iterate through all cities and locations
      for (var i = 0; i < Object.keys(parsedJSON).length; i++) {

          // this is just a simple pythagorean algorthim to figure out where the
          // closest city is
          var latitudes      = parsedJSON[String(i + 1)];

          var latitudesArray = latitudes.split(",");

          citylat  = parseFloat(latitudesArray[0]);
          citylong = parseFloat(latitudesArray[1]);
          cityName = latitudesArray[2];


          var latDistance  = citylat - clientLat;
          var longDistance = citylong - clientLong;

          var completeDistance = Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2));
          console.log("Client's abstract distance from " + cityName + " is: " + String(completeDistance) + "\n");

          if (completeDistance < completos) {
              completos = completeDistance;
              cityNameo = cityName;
              console.log(cityNameo + " is closer than any other checked..." + "\n");

              numero    = i;
          } else {
              continue
          }

      }


      return(cityNameo);

  });

}

app.get("*", function(req, res) {

    // grab the current time
    var currentTime  = new Date();

    // grab the client's IP address
    var clientIPAddr = req.connection.remoteAddress;

    // save the connection in a timestamp
    fs.appendFile('timestamping.log', '[' + currentTime + '] ' + clientIPAddr + ' connected...\n', function(err) {
        if (err) throw err;
        console.log('Saved connection!' + "\n");
    });

    if (req.query.type == "JSONDataGET") {

      var clientLong = parseFloat(req.query.long);
      var clientLat  = parseFloat(req.query.lat);
      // open up our major city locations database

      cityNameo = FindClosestCity(clientLong, clientLat);

      executionString = "python3 jsoneditorget.py " + cityNameo;
      exec(executionString, (err, stdout, stderr) => {});

      fs.readFile("NPTI.txt", function (err, data) {
        var dataToConsole = data.toString("utf8", 0, data.length);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataToConsole);
        res.end();
      });
    } else if (req.query.type == "JSONDataPUSH") {
        businessLocationLat  = req.query.lat;
        businessLocationLong = req.query.long;

        cityNameo = FindClosestCity(businessLocationLat, businessLocationLong);

        dataToAddTo = cityNameo;
        fs.readFile("businesses.json", function(err, data) {
            // should execute a python script which edits the json file
            // need to double check security of req.query.long/lat

            executionString = "python3 jsoneditorpush.py " + dataToAddTo + " " + req.query.name + " " + businessLocationLat + " " + businessLocationLong;
            exec(executionString, (err, stdout, stderr) => {
              console.log(stdout);
            });
        });

        res.end("done");
    } else if (req.query.type == "BusinessDataPUSH") {

      lat  = req.query.lat;
      long = req.query.long;

      businessDetails = req.query.details;
      businessRating  = req.query.rating;
      businessEmailN  = req.query.emailN;                   // Email Name
      businessEmailD  = req.query.emailD;                   // Email Domain
      businessPhone   = req.query.telephone;
      businessName    = req.query.name;

      cityName = FindClosestCity(lat, long);

      // i love how i find any excuse to pass node onto python

      executionString = "python3 bisDetailPush.py " + cityName + " " + businessDetails + " " + businessRating + " " + businessEmailN + " " + businessEmailD + " " + businessPhone + " " + businessName;
      exec(executionString, (err, stdout, stderr) => {
        console.log(stdout);
      });

      res.end(done);
    } else if (req.query.type == "BusinessDataGET") {
      nameToUse       = req.query.name;

      executionString = "python3 bisDetailGET.py " + nameToUse;
      exec(executionString, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
      });

      fs.readFile("NPTIG.txt", function (err, data) {
        var dataToConsole = data.toString("utf8", 0, data.length);

        console.log(dataToConsole);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(dataToConsole);
        res.end();
      });
    } else {
      res.writeHead(404, {'Content-Type':'text/html'});
      res.end("-- You've reached the 404 wall. Either you're not invited or there's a bug in the server/request --");
    }
}).listen(1111);

// Thank you Emmanuel for the help in this! :)
