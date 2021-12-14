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
  sendDataDatabase(data.toString(),logError);
});

app.listen(port);

function logError(err) {
  if (err) throw err;
  console.log('Just sent data to running Database.js');
};

function sendDataDatabase(data, callback){
    console.log('Recieved Url data: '+data.url);
    client.connect();

    if(data!=null){

        var newUrl= urlParser(data.url.toString());

        const text = 'INSERT INTO links(link) VALUES($1) RETURNING *'
        const values = [newUrl]
        // callback
        client.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack)
            callback(err);
          } else {
            console.log(res.rows[0])
            callback(res);

          }
        })
        
    }

};





//Url Node Parser

function urlParser(data){

  var url=data.toString();
// Return url extensions if its extenions page
if(url==="chrome://extensions/"){
   return url.subString(10,20);
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
