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
  , api = "https://api.box.com/2.0/"

app.use(express.static('sample'));

app.get("/token", (req, res) => {
  var code = req.query.code;

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
    res.send(body);
  });
});

///////////////////////////////////////////////
// GET /me?acccess_token=ACCESS_TOKEN
//
app.get("/me", (req, res) => {
  var access_token = req.query.access_token;

  // fixme: fix hardcode of url
  var options = {
    "method": "GET",
    "url": api + "/users/me",
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  };

  // todo: error handling
  curl.request(options, (e, body, r) => {
    res.send(body);
    res.end();
  });
});



///////////////////////////////////////////////
// GET /folders/FILE_ID?access_token=ACCESS_TOKEN
//
app.get("/folders/:id", (req, res) => {
  var folder_id = req.params.id
    , access_token = req.query.access_token;

  // fixme: fix hardcode of url
  var options = {
    "method": "GET",
    "url": api + "folders/" + folder_id,
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  };

  // todo: error handling
  curl.request(options, (e, body, r) => {
    res.send(body);
    res.end();
  });
});

///////////////////////////////////////////////
// GET /embedlink/FILE_ID?access_token=ACCESS_TOKEN
//
app.get("/embedlink/:id", (req, res) => {
  var file_id = req.params.id
    , access_token = req.query.access_token;

  // fixme: fix hardcode of url
  var options = {
    "method": "GET",
    "url": api + "files/" + file_id + "?fields=expiring_embed_link",
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  };

  // todo: error handling
  curl.request(options, (e, body, r) => {
    res.send(body);
    res.end();
  });
});





var server = process.env.NODE_ENV === "production" ? http.createServer(app) : https.createServer(credentials, app);

server.listen(3000, () => {
  console.log("[%s] app listening of port 3000", process.env.NODE_ENV);
})
