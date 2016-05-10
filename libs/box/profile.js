var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<div class='clearfix'>",
    "<div class='pull-right'>",
      "&nbsp;<span class=\"profile-name\"><%= attr.name %></span>",
      "&nbsp;<span class=\"profile-img\"><img width='40' height='40' src='<%= attr.avatar_url %>'></span>",
    "</div>",
  "</div>"
].join("")

////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
  urlRoot: '/me'
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  render: function() {
    console.log(this.model.attributes);
    this.$el.html(this.template({attr: this.model.attributes}));
  }
});

////////////////////////////////////////////
// Component
//
class Profile extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.access_token = access_token;
    this.el = element;

    this.model = new Model();
    this.view = new View({el: this.el, model: this.model});

    this.fetch(0);
  }

  fetch(id, callback) {
    this.model
      .fetch({"data": {"access_token": this.access_token}})
      .success(() => {
        // emit event to component class
        this.emit("profile", this.model.attributes);

        // expose callback or render
        if(typeof(callback) === "function") {
          callback(this.model.attributes);
        } else {
          this.view.render();
        };
      });
  }
}

module.exports = Profile;
