const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const childProcess = require('child_process');


let port = process.env.PORT;
if (port == null || port == '') {
  port = 5000;
}


app.use(function (req, res, next) {
  console.log('Server Logging...')
  next();
})

/** Middleware functions that handles xurl-encoded data (form data) and parse data to json */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/hello', function (req, res, next) {
  const data = req.body.data;
  console.log('Url Address: ' + data);
  sendDataDatabase('database.js',data,logError);
});


app.listen(port);


function sendDataDatabase(fileAddress, data,callback){

    //The boolean condition 'invoked' well tell us if child file has been forked or not
    //keep track of whether callback has been invoked to prevent multiple invocations
    //[],{stdio: 'pipe', execArgv: [] }
    var invoked = false;
    var process = childProcess.fork(fileAddress);

    //Send Url link data to child file
    if(data!=null){
        console.log("Data before:"+data)
        process.send( {url: data});
    }

    //Confirmation of data sent towards database
    process.on('message', function (data) {
        if (invoked) return;
        invoked = true;
        callback(err);
        console.log("Get Response after Url sent: "+data);
    });

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

function logError(err) {
  if (err) throw err;
  console.log('Just sent data to running Database.js');
};