var backbone = require('backbone')
  , _ = require('underscore')

var template_ = [
  "<iframe src='<%= expiring_embed_link.url %>'></iframe>"
].join("");

var EmbedLinkView = Backbone.View.extend({
  template: _.template(template_),
  render: function() {
    console.log(this.model);
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

module.exports = EmbedLinkView;
