if(process.env.NODE_ENV==="test") {
  require("./skyway-box.html"); // this includes html file in watcher list
}

var $ = require("jquery")
  , State = require("../libs/base/state")
  , Folder = require("../libs/components/folder")
  , File   = require("../libs/components/file")
  , Me     = require("../libs/components/Me")
  , Chat   = require("../libs/components/Chat")

var token = null


if(State.is_redirect()) {
  console.log("logined!");
  console.log(location.search);
  $.get("/token", {"code": State.code}, (data) => {
    token = JSON.parse(data);

    var me = new Me("#me-view", token.access_token);

    var folder = new Folder(0, "#folder-view", token.access_token)
      .on("fileSelected", (file_id) => {
        console.log("fileSelected", file_id);
        var file = new File(file_id, "#file-view", token.access_token)
      });

    var chat = new Chat("#chat-view")
  });
} else {
  var auth_url = State.get_authorizeurl();
  $("#box-login").attr("href", auth_url).text("login with box account");
}

