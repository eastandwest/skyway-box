var backbone = require('backbone')
  , _ = require('underscore')
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
    alert(0);
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
  }

  fetch(txt) {
    this.model
      .fetch({"data": {"access_token": this.access_token}})
  }
}

module.exports = Upload;
