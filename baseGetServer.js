// Initially developed by Emmanuel and Hazim

/*
*   BIG NOTE TO ANYONE WHO EVER IS FOOLISH ENOUGH TO ATTEMPT TO APPEND TO THIS CODE (mainly me)
*
*   for the love of god please remember that javascript is async - so everything
*   after a function(param, function2{}); must be within function2
*
*
*   Hazim (me) has legitimatley spent 7-8 hours of time trying to figure this out
*
*   Also I've realised, after reviewing this code many months later that my idea to use exec() to pass onto python
*   was probably a bit dumb security-wise. RCE is probably not the best thing to have in a core script.
*/

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

app.get("*", function(req, res) {
    console.log("server online");
    // grab screenshots of the NTPIX files
    // so that we can circumvent a double in incoming traffic

    var NPTIData  = fs.readFileSync("NPTI.txt");
    var NPTIGData = fs.readFileSync("NPTIG.txt");

    var x = true;

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

        executionString = "python3 jsoneditorget.py " + cityNameo;
        exec(executionString, (err, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);

          fs.readFile("NPTI.txt", function (err, nData) {
            nData = nData.toString("UTF-8", 0, nData.length);

            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(nData);
            res.end()
          });
        });
      });
    } else if (req.query.type == "JSONDataPUSH") {
        clientLat  = req.query.lat;
        clientLong = req.query.long;
        clienType  = req.query.BType;

        fs.readFile("datastore/longlatplanes.json", function(err, data) {
          // grab client's location through what they've posted via GET


          console.log("Client's Location: Lat:" + clientLat + ", Long: " + clientLong + "\n");

          // grab an array of data from our file
          var parsedJSON = JSON.parse(data)['cityLocations'];

          var completos  = 1000000000000000;

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

          dataToAddTo = cityNameo;
          fs.readFile("businesses.json", function(err, data) {
              // should execute a python script which edits the json file
              // need to double check security of req.query.long/lat

              executionString = "python3 jsoneditorpush.py " + dataToAddTo + " " + req.query.name + " " + clientLat + " " + clientLong + " " + clientType;
              exec(executionString, (err, stdout, stderr) => {
                console.log(stdout);
              });
          });
        });



        res.end("done");
    } else if (req.query.type == "BusinessDataPUSH") {

      clientLat  = req.query.lat;
      clientLong = req.query.long;

      businessDetails = req.query.details;
      businessRating  = req.query.rating;
      businessEmailN  = req.query.emailN;                   // Email Name
      businessEmailD  = req.query.emailD;                   // Email Domain
      businessPhone   = req.query.telephone;
      businessName    = req.query.name;
      businessSalary  = req.query.salary;
      businessType    = req.query.btype;
      businessDet2    = req.query.det;
      businessFE      = req.query.messageFE;

      fs.readFile("datastore/longlatplanes.json", function(err, data) {
        // grab client's location through what they've posted via GET


        console.log("Client's Location: Lat:" + clientLat + ", Long: " + clientLong + "\n");

        // grab an array of data from our file
        var parsedJSON = JSON.parse(data)['cityLocations'];

        var completos  = 1000000000000000;

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

        // i love how i find any excuse to pass node onto python

        executionString = "python3 bisDetailPush.py " + cityNameo + " " + businessDetails + " " + businessRating + " " + businessEmailN + " " + businessEmailD + " " + businessPhone + " " + businessName + " " + businessSalary + " " + businessType + " " + businessDet2 + " " + businessFE;
        exec(executionString, (err, stdout, stderr) => {
          console.log(stdout);

          fs.readFile("stats.txt", function (err, data) {
            data = data.toString("UTF-8", 0, data.length);

            dataArray = data.split("\n");

            jobsSubmitted = dataArray[0];

            jobsSubmittedInt = parseInt(jobsSubmitted)

            jobsSubmittedInt = jobsSubmittedInt + 1

            newArray = []

            newArray.push(parseString(jobsSubmittedInt))
            newArray.push(dataArray.splice(1, dataArray.length + 1))

            newData = newArray.join()

            fs.writeFile("stats.txt", newData, "utf-8", (err) => {
              if (err) throw err;
              console.log('Stats updated!');
            });
          });
        });
      });

      res.end("done");
    } else if (req.query.type == "BusinessDataGET") {
      nameToUse       = req.query.name;

      executionString = "python3 bisDetailGET.py " + nameToUse;
      exec(executionString, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        fs.readFile("NPTIG.txt", function (err, data) {
          dataToConsole = data.toString("UTF-8", 0, data.length);

          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(dataToConsole);
          res.end();
        });
      });

    } else if (req.query.type == "photoGET") {
      nameToUse = req.query.name;
      console.log(req.query);
      fs.readFile("datastore/images/" + nameToUse + ".png", function (err, data) {
        res.end(data);
      });

    } else {
      res.writeHead(404, {'Content-Type':'text/html'});
      res.end("-- You've reached the 404 wall. Either you're not invited or there's a bug in the server/request --");
    }
}).listen(1234);

// Thank you Emmanuel for the help in this! :)
