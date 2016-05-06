var $ = require("jquery")
  , State = require("../libs/base/state")
  , Box = require("./box/index")
  , Skyway = require("./skyway/index")
  , conf = require("../conf/config.json")

var token = null, box = null, skyway = null;


if(State.is_redirect()) {
  $(".mastcontainer").show();

  // for debug
  $.get("/token", {"code": State.code}, (data) => {
    token = JSON.parse(data);
    console.log(token);

    box = new Box(token.access_token);
    skyway = new Skyway(conf.skyway_api_key);

    setHandler();
  });
} else {
  $(".login").show();

  var auth_url = State.get_authorizeurl();
  $("#box-login").attr("href", auth_url).text("login with box account");
}

var setHandler = function() {
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
