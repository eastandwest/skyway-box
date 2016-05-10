var express = require('express')
  , app = express()
  , http = require('http')
  , https = require('https')
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , conf = require("./conf/config.json")
  , request = require("request")
  , curl = require("curlrequest")
  , FormData = require('form-data')
  , fs = require('fs')
  , morgan  = require('morgan')
  , log4js = require('log4js')

var privateKey = fs.readFileSync(__dirname + '/cert/server.key', 'utf8')
  , certificate = fs.readFileSync(__dirname + '/cert/server.crt', 'utf8')
  , credentials = {key: privateKey, cert: certificate}
  , api = "https://api.box.com/2.0/"
  , logger = new log4js.getLogger("root")


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))
app.use(express.static(__dirname + '/public'));

///////////////////////////////////////////////
// GET /token?code=CODE
//

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
// GET /cient_id
//
app.get("/client_id", (req, res) => {
  if( conf.client_id && conf.client_id.match(/^[0-9a-zA-Z]{32}$/)) {
    res.end(conf.client_id);
  } else {
    res.statusCode = 404;

    var mesg = "client_id does not configured, properly";
    res.end(mesg);
    logger.warn(mesg, conf.client_id);
  }
});

///////////////////////////////////////////////
// GET /api_key
//
app.get("/api_key", (req, res) => {
  if( conf.skyway_api_key && conf.skyway_api_key.match(/^[0-9a-zA-Z-]{36}$/)) {
    res.end(conf.skyway_api_key);
  } else {
    res.statusCode = 404;

    var mesg = "skyway_api_key does not configured, properly";
    res.end(mesg);
    logger.warn(mesg, conf.skyway_api_key);
  }
});




///////////////////////////////////////////////
// app routing

var is_validRoomName = (roomname) => {
  return !!roomname.match(/^[0-9a-zA-Z-_]{4,48}$/)
}
const ROOMNAME_ERROR = "ROOMNAME should be 4 to 48 length of {0-9a-zA-Z-_}";
if(process.env.NODE_ENV==="production") const APPHTML = fs.readFileSync(__dirname + "/html/skyway-box-production.html");

app.get("/", (req, res) => {
  var apphtml = process.env.NODE_ENV==="production" ? APPHTML : fs.readFileSync(__dirname + "/html/skyway-box.html");
  var code = req.query.code, roomname = req.query.state;

  if(code && roomname) {
    if(is_validRoomName(roomname)) {
      // If format of room is fine.

      res.redirect("/r/" + roomname + "?code="+code+"&state=" + roomname);
    } else {
      // If format of room is bad.
      res.redirect("/?error=" + encodeURIComponent(ROOMNAME_ERROR));
    }
  } else {
    res.end(apphtml);
  }
});

app.get("/r/:room", (req, res) => {
  var apphtml = process.env.NODE_ENV==="production" ? APPHTML : fs.readFileSync(__dirname + "/html/skyway-box.html");
  var code = req.query.code, roomname = req.query.state;

  if(code && roomname) {
    if(is_validRoomName(roomname)) {
      // If format of room is fine.

      res.end(apphtml);
    } else {
      // If format of room is bad.
      res.redirect("/?error=" + encodeURIComponent("ROOMNAME_ERROR"));
    }
  } else {
    res.end(apphtml);
  }
});


///////////////////////////////////////////////
// APIs for box

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
// GET /thumbnail/FILE_ID?access_token=ACCESS_TOKEN
//
app.get("/thumbnail/:id", (req, res) => {
  var file_id = req.params.id
    , access_token = req.query.access_token;

  // , api = "https://api.box.com/2.0/"
  //
  console.log(file_id);
  var req = https.request({
    "protocol": "https:",
    "hostname": "api.box.com",
    "path": "/2.0/files/" + file_id + "/thumbnail.png",
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  }, (response) => {
    var statusCode = response.statusCode;
    var headers = response.headers;
    console.log(statusCode);

    if(statusCode === 200) {
      res.setHeader("content-type", "image/png");

      response.on("data", (chunk) => {
        console.log(chunk.length);
        res.send(chunk);
      });

      response.on("end", () => {
        res.end();
      });
    } else if(statusCode === 302) {
      res.statusCode = 302;
      res.setHeader("location", headers.location);
      res.end();
    } else {
      res.statusCode = statusCode;
      response.on("data", (chunk) => {
        res.send(chunk);
      });

      response.on("end", () => {
        res.end();
      });
    };
  });

  req.end();



  // fixme: fix hardcode of url
  // var options = {
  //   "method": "GET",
  //   "url": api + "files/" + file_id + "/thumbnail.png",
  //   "headers": {
  //     "Authorization": "Bearer " + access_token
  //   },
  //       "trace-ascii": "trace2.log"
  // };

  // // todo: error handling
  // curl.request(options, (e, body, r) => {
  //   res.setHeader("content-type", "image/gif");
  //   res.send(body);
  //   res.end();
  // });
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
  }

  // todo: error handling
  curl.request(options, (e, body, r) => {
    res.send(body);
    res.end();
  });
});

///////////////////////////////////////////////
// POST /upload/FILE_ID?filename=FILE_NAME&access_token=ACCESS_TOKEN
//
// body: filedata
app.post("/upload", (req, res) => {
  var filename = req.body.filename +".txt"
    , access_token = req.body.access_token
    , folder_id = parseInt(req.body.folder_id)
    , file_body = req.body.data;


  var tmpfilename = __dirname+"/tmp/"+filename+".tmp";
  fs.writeFile( tmpfilename, JSON.stringify(file_body), (err) => {
    if(err) {
      res.end(err);
    } else {
      var options = {
        "method": "POST",
        "url": "https://upload.box.com/api/2.0/files/content",
        "headers": {
          "Authorization": "Bearer " + access_token
        },
        "form" : [
          "attributes=" + JSON.stringify({"name": filename, "parent": {"id": folder_id}}),
          "file=@"+tmpfilename
        ],
        "trace-ascii": "trace.log"
      }

      // todo: error handling
      curl.request(options, (e, body, r) => {
        fs.unlink(tmpfilename);

        res.send(body);
        res.end();
      });
    }
  });
});



var server = process.env.NODE_ENV === "production" && process.env.SECURE !== "true" ? http.createServer(app) : https.createServer(credentials, app);

server.listen(3000, () => {
  console.log("[%s] app listening of port 3000", process.env.NODE_ENV);
})
