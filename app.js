const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


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

  var response=sendDataDatabase(""+data+"",logError);

  if(response==""){
   res.status(404).send({data:'Database error: Connection problem'});
  }else if (response=="Failed"){
   res.status(204).send({data:'Database error: Insert problem'});

  }else if(response=="Success"){
    res.status(200).send({data:'Succesful Record into database'});
  }else{
    res.status(404).send({data:'Database error: Something wrong'});
  }


});

app.listen(port);

function logError(err) {
  if (err){ 
     return "Failed";
  }else{
  console.log('Just sent data to running Database.js');
     return "Success";
  }
};

function sendDataDatabase(data, callback){
    console.log('Recieved Url data: '+data);
    var response="";

    client.connect(err => {
      if (err) {
        console.error('connection error', err.stack)
      } else {
        console.log('connected')
      }
    });

    if(data!=null){

      var newUrl= urlParser(data);
      console.log("Url Parsed:"+newUrl);

      const text = 'INSERT INTO links(link) VALUES($1) RETURNING *'
      const values = [newUrl]
      // callback
      client.query(text, values, (err, res) => {
        if (err) {
          console.log("Insert Failed:")
          console.log(err.stack)
          response="Failed";
          callback(err);
        } else {
          console.log("Insert Succeded:")
          console.log(res.rows[0])
          response="Success";
          callback(res);

        }

        client.end(err => {
          console.log('client has disconnected')
          if (err) {
            console.log('error during disconnection', err.stack)
          }
        })
      })

  }

  console.log("Final response:"+response);
  return response;

};





//Url Node Parser

function urlParser(data){

  var url=data.toString();
// Return url extensions if its extenions page
if(url==="chrome://extensions/"){
   return url.substring(9,19);
}

//Return correct url form
if(url.includes("https://")){

    // Get last point before url post location
    var locationUrl=url.indexOf("/",11); 

    // Seperate base url from urls with queries 
    var urlData=url.substring(8,url.length);

    console.log("Location: "+locationUrl);
    console.log("Substring: "+urlData);

    var newUrl="";
    if(urlData.includes("www.")){
     
        newUrl=urlData.substring(4,urlData.length);
        console.log("lll"+newUrl)
    
        if(newUrl.includes(".")){

            var getposturl=newUrl.substring(0,newUrl.indexOf('.',0));
            console.log("Final url1: "+getposturl);
            return getposturl;
        }
        var getposturl=newUrl;
        console.log("Final url2: "+getposturl);
        return getposturl;

    } else{

    if(urlData.includes("/")){

        var getposturl=urlData.substring(0,urlData.indexOf('.',0));
        console.log("Final url3: "+getposturl);
        return getposturl;
    }
    var getposturl=urlData;
    console.log("Final url4: "+getposturl);
    return getposturl;


    }
}
}
