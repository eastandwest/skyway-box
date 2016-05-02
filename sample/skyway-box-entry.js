if(process.env.NODE_ENV==="test") {
  require("./skyway-box.html"); // this includes html file in watcher list
}

var $ = require("jquery");

$("#test").text("hello, world!!");

