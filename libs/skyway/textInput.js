var backbone = require('backbone')
  , _ = require('underscore')
  , $ = require('jquery')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<div>",
  "/<div>"
].join("")

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  events: {
    "submit": "onSubmit"
  },
  onSubmit: function(ev) {
    ev.preventDefault();

    var $mesg = $(this.el).find("input[name=message]")
      , mesg = $mesg.val();
    this.trigger("message", {"mesg": mesg});

    $mesg.val("");
  }
});

////////////////////////////////////////////
// Component
//
class TextInput extends EventEmitter {
  constructor(element) {
    super();

    this.el = element;

    this.view = new View({el: this.el});

    this.view.on("message", (obj) => {
      this.emit("message", obj);
    });
  }
}

module.exports = TextInput;
