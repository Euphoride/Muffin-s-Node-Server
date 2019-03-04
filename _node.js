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
        // open up our major city locations database
        fs.readFile("datastore/longlatplanes.json", function(err, data) {
            // grab client's location through what they've posted via GET
            var clientLong = parseFloat(req.query.long);
            var clientLat  = parseFloat(req.query.lat);

            console.log("Client's Location: Lat:" + req.query.lat + ", Long: " + req.query.long + "\n");

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

            executionString = "python3 jsoneditorget.py " + cityNameo;
            exec(executionString, (err, stdout, stderr) => {});

            fs.readFile("NPTI.txt", function (err, data) {
              var dataToConsole = data.toString("utf8", 0, data.length);

              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(dataToConsole);
              res.end();
            });
        });
    } else if (req.query.type == "JSONDataPUSH") {
        businessLocationLat  = req.query.lat;
        businessLocationLong = req.query.long;

        var completos        = 1000000000000000;

        fs.readFile("datastore/longlatplanes.json", function(err, data) {
            parsedJSON = JSON.parse(data)['cityLocations'];

            // iterate through all cities and locations
            for (var i = 0; i < Object.keys(parsedJSON).length; i++) {
                // this is just a simple pythagorean algorthim to figure out where the
                // closest city is
                var latitudes      = parsedJSON[String(i + 1)];

                var latitudesArray = latitudes.split(",");

                cityLat  = parseFloat(latitudesArray[0]);
                cityLong = parseFloat(latitudesArray[1]);
                cityName = latitudesArray[2];


                var latDistance  = businessLocationLat - cityLat;
                var longDistance = businessLocationLong - cityLong;

                var completeDistance = Math.sqrt(Math.pow(latDistance, 2) + Math.pow(longDistance, 2));
                console.log("Client's abstract distance from " + cityName + " is: " + String(completeDistance) + "\n");

                if (completeDistance < completos) {
                    completos = completeDistance;
                    cityNameo = cityName;
                    console.log(cityNameo + " is closer than any other checked..." + "\n");
                    numero    = i;
                } else {
                    continue;
                }

            }

            dataToAddTo = cityNameo;
            fs.readFile("businesses.json", function(err, data) {
                // should execute a python script which edits the json file
                // need to double check security of req.query.long/lat

                executionString = "python3 jsoneditorpush.py " + dataToAddTo + " " + req.query.name + " " + businessLocationLat + " " + businessLocationLong;
                exec(executionString, (err, stdout, stderr) => {});
            });

            res.end("done");
        });
    }
}).listen(1111);

// Thank you Emmanuel for the help in this! :)
