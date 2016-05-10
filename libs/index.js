var $ = require("jquery")
  , State = require("../libs/base/state")
  , Box = require("./box/index")
  , Skyway = require("./skyway/index")

var token = null, box = null, skyway = null;


// for app
var App = {};
App.start = () => {
  App.getToken();
}
App.getToken = () => {
  var token = sessionStorage.token;

  if(token) {
    try {
      // typical case: reload
      var token_ = JSON.parse(token);

      // todo: check token is valid
      if(token_.access_token) {
        $(".mastcontainer").show();
        App.createFrame(token_.access_token);
      }
    } catch(err) {
      console.error("token parse error");
    }
  } else {
    // typical case:
    $.get("/token", {"code": State.code}).done((data) => {

      token = JSON.parse(data);
      sessionStorage.token = JSON.stringify(token);

      if(token.access_token) {
        $(".mastcontainer").show();
        App.createFrame(token.access_token);
      } else {
        console.error(token);
        location.href = location.pathname;
      }
    }).fail((err) => {
      console.log(err);
    });
  }
}


App.createFrame = (access_token) => {
  box = new Box(access_token);

  $.ajax({
    "url": "/api_key",
    "type": "get",
    "success": (api_key) => {
      skyway = new Skyway(api_key);

      App.setHandler();
    },
    "error": (xhr) => {
      throw xhr.status + ": " + xhr.responseText;
    }
  });
}

App.setHandler = () => {
  // box
  box.on("profile", (profile_data) => {
    skyway.setProfile(profile_data);
  });

  box.on("embedlink", (embedlinkObj) => {
    skyway.shareEmbedlink(embedlinkObj);
  });

  box.on("req:skyway:messages", (callback) => {
    var resp = skyway.reqMessages();
    if(typeof(callback) === 'function') callback(resp);
  });

  // skyway
  skyway.on("recv:embedlink", (embedlinkObj) => {
    box.showSlideShare(embedlinkObj);
  });
}



// for login
var Login = {};

Login.start = () => {
  sessionStorage.token = "";
  $(".login").show();

  if( location.pathname.indexOf("/r/") === 0 ) {
    let roomname = location.pathname.substring(3);
    $("#roomname").val(roomname);
  }

  $("#roomname").on("keyup", function (ev) {
    var $form = $(this);
    if ( $form[0].validity.patternMismatch) {
      $form[0].setCustomValidity("room name should be 4 - 48 bytes of 'a-zA-Z0-9-_'");
    } else {
      $form[0].setCustomValidity("");
    }
  });

  $("#enter-room").on("submit", function(ev) {
    ev.preventDefault();

    let roomname = $(this).find("input[name=roomname]").val();
    State.renew_stateId(roomname);

    State.get_authorizeurl((auth_url) => {
      // change url to box authorization site
      location.href = auth_url;
    });
  });
}


//////////////////////////////////////

var start = () => {
  try {
    if(State.is_redirect()) {
      App.start();
    } else {
      Login.start();
    }
  } catch (err) {
    console.log(err);
    Login.start();
  }
}

$(".login,.mastcontainer").hide();
start();
