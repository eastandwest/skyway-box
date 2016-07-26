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
  , md5 = require('md5')
  , morgan  = require('morgan')
  , log4js = require('log4js')
  , _ = require('underscore')

var privateKey = fs.readFileSync(__dirname + '/cert/server.key', 'utf8')
  , certificate = fs.readFileSync(__dirname + '/cert/server.crt', 'utf8')
  , credentials = {key: privateKey, cert: certificate}
  , api = "https://api.box.com/2.0/"
  , logger = new log4js.getLogger("server-root")


//////////////////////////////////////////////
// todo: main and each routing component shoul be
// splitted into each library.
//
//
//////////////////////////////////////////////

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
if(process.env.NODE_ENV === "production" ) {
  app.use(morgan('combined'))
}
app.use(express.static(__dirname + '/public'));

///////////////////////////////////////////////
// global check for AWS environment
//  redirect ELB http access to https
app.all('*', (req, res, next) => {
  if(process.env.NODE_ENV === "production" ) {
    var is_via_elb = req.headers['x-forwarded-proto'];

    if( is_via_elb ) {
      if( is_via_elb === 'https' ) {
        // not redirect, continue
        return next();
      } else {
        // it's http access. redirect to https
        res.redirect('https://' + req.headers.host + req.url);
      }
    } else {
      // attempting to development, continue
      return next();
    }
  } else {
    return next();
  }
});

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
    // todo: should check error
    res.send(body);
  });
});

///////////////////////////////////////////////
// GET /token?code=CODE
//

app.get("/refresh_token", (req, res) => {
  var refresh_token = req.query.refresh_token

  var options = {
    "method": "POST",
    "url": conf.api_endpoint + "token",
    "data": {
      "grant_type": "refresh_token",
      "refresh_token": refresh_token,
      "client_id": conf.client_id,
      "client_secret": conf.client_secret
    }
  };

  curl.request(options, (e, body, r) => {
    // todo: should check status error
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
  return !!roomname.match(/^[0-9a-zA-Z-_]{32}$/)
}
const ROOMNAME_ERROR = "ROOMNAME should be 32 length mix of numeric and alphabet";
if(process.env.NODE_ENV==="production") {
  var tmpl = fs.readFileSync(__dirname + "/html/skyway-box.html.tmpl").toString();
  var template = _.template(tmpl);
}

app.get("/", (req, res) => {
  var apphtml = ( () => {
    if( process.env.NODE_ENV==="production" ) {
      return template({js: "skyway-box.build.min.js", "room_name_for_create": md5(new Date())});
    } else {
      var tmpl = fs.readFileSync(__dirname + "/html/skyway-box.html.tmpl").toString();
      return _.template(tmpl)({js: "skyway-box.build.js", "room_name_for_create": md5(new Date())});
    }
  })();
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
  var apphtml = ( () => {
    if( process.env.NODE_ENV==="production" ) {
      return template({js: "skyway-box.build.min.js", "room_name_for_create": md5(new Date())});
    } else {
      var tmpl = fs.readFileSync(__dirname + "/html/skyway-box.html.tmpl").toString();
      return _.template(tmpl)({js: "skyway-box.build.js", "room_name_for_create": md5(new Date())});
    }
  })();

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
var file_black_red = fs.readFileSync(__dirname+"/public/file-black-red-30.png");
app.get("/thumbnail/:id", (req, res) => {
  var file_id = req.params.id
    , access_token = req.query.access_token;

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

    if(statusCode === 200) {
      res.setHeader("content-type", "image/png");

      response.on("data", (chunk) => {
        res.send(chunk);
      });

      response.on("end", () => {
        res.end();
      });
    } else if(statusCode === 302) {
      res.statusCode = 302;
      res.setHeader("location", headers.location);
      res.end();
    } else if(statusCode === 404) {
      res.statusCode = 200;
      res.end(file_black_red);
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
});

///////////////////////////////////////////////
// GET /is_valid?access_token=ACCESS_TOKEN
//
app.get("/is_valid", (req, res) => {
  var access_token = req.query.access_token;

  // , api = "https://api.box.com/2.0/"
  //
  var req = https.request({
    "protocol": "https:",
    "hostname": "api.box.com",
    "path": "/2.0/folders/0",
    "headers": {
      "Authorization": "Bearer " + access_token
    }
  }, (response) => {
    var statusCode = response.statusCode;
    var headers = response.headers;


    if(statusCode === 200) {
      response.on("data", (chunk) => {
      });

      response.on("end", () => {
        res.end("ok");
      });
    } else {
      res.statusCode = 403;
      response.on("data", (chunk) => {
      });
      response.on("end", () => {
        res.end("ng");
      });
    }
  });

  req.end();
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
        ]
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
  logger.info( "[%s] App 'box-skyway' listening of port 3000 ( https://localhost:3000/ ) ", process.env.NODE_ENV );

  if( process.env.NODE_ENV !== "production" ) {
    logger.info( "  -- Whle developing, don't forget to run 'npm run dev' in another console ;)" );
    logger.info( "  -- For more detail, please check readme.md." );
  }
})
