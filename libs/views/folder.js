var backbone = require('backbone')
  , _ = require('underscore')
  , $ = require("jquery")

var _template = [
  "<ul>",
  "<% entries.forEach(function(entry) { %>",
  "<li>[<%= entry.type %>] <a href='#' data-id='<%= entry.id %>' data-type='<%= entry.type %>'><%= entry.name %></a> (<%= entry.id %>)</li>",
  "<% }); %>",
  "</ul>"
].join("");



var FolderView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  events: {
    "click a" : "anchorClicked"
  },
  template: _.template(_template),
  anchorClicked: function(ev){
    var params = {id: ev.target.dataset.id, type: ev.target.dataset.type};
    this.trigger("contentClicked", params);
  },
  render: function(){
    this.$el.html(this.template({entries: this.model.attributes.item_collection.entries}));
    return this;
  }
});

module.exports = FolderView;
