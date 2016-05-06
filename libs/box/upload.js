var backbone = require('backbone')
  , _ = require('underscore')
  , $ = require('jquery')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<p>hello component!</p>"
].join("")

////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
  urlRoot: '/upload'
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  events: {
    "click button": "onBtnClicked"
  },
  onBtnClicked: function(ev) {
    this.trigger("btnClicked");
  },
  render: function() {
  }
});

////////////////////////////////////////////
// Component
//
class Upload extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.access_token = access_token;
    this.el = element;

    this.model = new Model();
    this.view = new View({el: this.el, model: this.model});
    this.folder_id = 0; // todo: use specific folder

    this.view.on("btnClicked", () => {
      this.emit("req:skyway:messages");
    });
  }
  post(mesgs) {
    $.post('/upload', {
      filename: Date.now()+".json",
      access_token: this.access_token,
      folder_id: this.folder_id,
      data: mesgs
    }, (resp) => {
      console.log("POST /upload succeed", resp);
    },
    "json");
  }

  fetch(txt) {
    this.model
      .fetch({"data": {"access_token": this.access_token}})
  }
}

module.exports = Upload;
