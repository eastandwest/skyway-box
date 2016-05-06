var $ = require("jquery")
  , State = require("../libs/base/state")
  , Box = require("./box/index")
  , Skyway = require("./skyway/index")
  , api_key = require("../conf/config.json").skyway_api_key

var token = null, box = null, skyway = null;


// for app
var App = {};
App.start = () => {
  App.getToken();
}
App.getToken = () => {
  $.get("/token", {"code": State.code}).done((data) => {
    $(".mastcontainer").show();

    token = JSON.parse(data);

    if(token.access_token) {
      box = new Box(token.access_token);
      skyway = new Skyway(api_key);

      App.setHandler();
    } else {
      console.error(token);
      location.href = location.pathname;
    }
  }).fail((err) => {
    console.log(err);
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
  $(".login").show();

  if( location.pathname.indexOf("/r/") === 0 ) {
    let roomname = location.pathname.substring(3);
    $("#roomname").val(roomname);
  }

  $("#roomname").on("keyup", function (ev) {
    console.log(0);
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
    console.log(roomname);
    State.renew_stateId(roomname);

    let auth_url = State.get_authorizeurl();
    location.href = auth_url;
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
