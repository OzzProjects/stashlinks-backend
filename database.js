const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

process.on('message', function(data){
    console.log('Recieved Url data: '+data.url);

    //Todo: Add helper function to parse url data

    if(data!=null){

        var newUrl= urlParser(data.url);

        const text = 'INSERT INTO links(link) VALUES($1) RETURNING *'
        const values = [newUrl]
        // callback
        client.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log(res.rows[0])

          }
        })
        
    }

})





//Url Node Parser

function urlParser(url){

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
