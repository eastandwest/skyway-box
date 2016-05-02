if(process.env.NODE_ENV==="test") {
  require("./skyway-box.html"); // this includes html file in watcher list
}

var $ = require("jquery")
  , State = require("../libs/base/state");

var token = null;


if(State.is_redirect()) {
  console.log("logined!");
  console.log(location.search);
  $.get("/token", {"code": State.code}, (data) => {
    token = JSON.parse(data);
    console.log(token);

    $.get("/folders/0", {"access_token": token.access_token}, (data) => {
      console.log(JSON.parse(data));
    });
  });
} else {
  var auth_url = State.get_authorizeurl();
  $("#box-login").attr("href", auth_url).text("login with box account");
}

