var express = require('express')
  , app = express()
  , http = require('http')
  , https = require('https')
  , fs = require('fs')
  , conf = require("./conf/config.json")
  , request = require("request")
  , curl = require("curlrequest")

var privateKey = fs.readFileSync('cert/server.key', 'utf8')
  , certificate = fs.readFileSync('cert/server.crt', 'utf8')
  , credentials = {key: privateKey, cert: certificate}

app.use(express.static('sample'));

app.get("/token", (req, res) => {
  var code = req.query.code;

  console.log(code);

  var options = {
    "method": "POST",
    "url": conf.api_endpoint + "token",
    "data": {
      "grant_type": "authorization_code",
      "code": code,
      "client_id": conf.client_id,
      "client_secret": conf.client_secret
    }
  };

  curl.request(options, (e, body, r) => {
    console.log(body);
    res.send(body);
  });
});

app.get("/folders/:id", (req, res) => {
  var folder_id = req.params.id
    , access_token = req.query.access_token;

  console.log(folder_id, access_token);

  // fixme: fix hardcode of url
  var options = {
    "method": "POST",
    "url": "https://api.box.com/2.0/folders/" + folder_id,
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  };

  curl.request(options, (e, body, r) => {
    console.log(r);
    res.send(body);
  });
});




var server = process.env.NODE_ENV === "production" ? http.createServer(app) : https.createServer(credentials, app);

server.listen(3000, () => {
  console.log("[%s] app listening of port 3000", process.env.NODE_ENV);
})
