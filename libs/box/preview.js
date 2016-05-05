var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<iframe frameborder='0' width='100%' height='100%' src='<%= expiring_embed_link.url %>'></iframe>"
].join("")

////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
  urlRoot: "/embedlink"
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  initialize: function() {
  },
  template: _.template(template_),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
  }
});

////////////////////////////////////////////
// Component
//
class Preview extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.access_token = access_token;
    this.el = element;

    this.model = new Model();
    this.view = new View({el: this.el, model: this.model});
  }

  fetch(file_id) {
    this.model
      .set("id", file_id)
      .fetch({"data": {"access_token": this.access_token}})
      .success(() => {
        this.view.render();
      })
  }
}

module.exports = Preview;
