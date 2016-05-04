var backbone = require("backbone")
  , _ = require("underscore")

var template_ = [
  "<span><img src='<%= avatar_url %>'><%= name %></span>"
].join("");

var MeView = Backbone.View.extend({
  template: _.template(template_),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

module.exports = MeView;
