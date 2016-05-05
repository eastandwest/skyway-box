var $ = require("jquery")
  , State = require("../libs/base/state")
  , Box = require("./box/index")
  , Skyway = require("./skyway/index")
  , conf = require("../conf/config.json")

var token = null, box = null, skyway = null;


if(State.is_redirect()) {
  $(".mastcontainer").show();

  // for debug
    skyway = new Skyway(conf.skyway_api_key);
  $.get("/token", {"code": State.code}, (data) => {
    token = JSON.parse(data);
    console.log(token);

    box = new Box(token.access_token);

    setHandler();
  });
} else {
  $(".login").show();

  var auth_url = State.get_authorizeurl();
  $("#box-login").attr("href", auth_url).text("login with box account");
}

var setHandler = function() {
  box.on("profile", (profile_data) => {
    skyway.setProfile(profile_data);
  });
}
