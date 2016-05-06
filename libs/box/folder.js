var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<ol class='breadcrumb'>",
    "<li><img height='14px' src='/box-logo.svg'></li>",
  "<% attributes.path_collection.entries.forEach( (entry, i) => { %>",
    "<li<% if (attributes.path_collection.entries.length === (i + 1)) { %> class='active'<% } %>>",
    "<a href='#' data-id='<%= entry.id %>' data-action='open'><%= entry.name %></a>",
    "</li>",
  "<% }); %>",
  "</ol>",

  "<% attributes.item_collection.entries.forEach( (entry) => { %>",
    "<div class='well well-sm clearfix'>",
      "<div class='pull-left'>",
        "<span class='glyphicon <%= icons[entry.type] %> aria-hidden='true'></span>&nbsp;",
        "<span class='label label-primary'><%= entry.type %></span>&nbsp;",
        " : <%= entry.name %>",
      "</div>",
      "<% if( entry.type === 'file' && !entry.name.match(/boxnote$/) ) { %>",
      "<div class='pull-right'>",
        "<button class='btn btn-xs btn-info' data-action='share' data-id='<%= entry.id %>'>",
        "<span class='glyphicon glyphicon-share' aria-hidden='true' data-action='share' data-id='<%= entry.id %>'></span>",
        "</button>&nbsp;",
        "<button class='btn btn-xs btn-warning' data-action='preview' data-id='<%= entry.id %>'>",
        "<span class='glyphicon glyphicon-eye-open' aria-hidden='true' data-action='preview' data-id='<%= entry.id %>'></span>",
        "</button>&nbsp;",
      "</div>",
      "<% } else if (entry.type === 'folder' ) { %>",
        "<div class='pull-right'>",
          "<button class='btn btn-xs btn-success' data-action='open' data-id='<%= entry.id %>'>",
            "<span class='glyphicon glyphicon-circle-arrow-right' aria-hidden='true' data-action='open' data-id='<%= entry.id %>'></span>",
          "</button>&nbsp;",
        "</div>",
      "<% } %> ",
    "</div>",
  "<% }); %>"
].join("")

////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
  urlRoot: '/folders'
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  events:{
    "click button": "btnClicked",
    "click a": "btnClicked"
  },
  btnClicked: function(ev){
    let action = ev.target.dataset.action
      , id = ev.target.dataset.id
    console.log("btnClicked - ", id, action);
    this.trigger("btnClicked", {"id": id, "action": action});
  },
  render: function() {
    this.$el.html(this.template({
      "attributes": this.model.attributes,
      "icons": {
        "folder": "glyphicon-folder-close",
        "file": "glyphicon-file",
        "web_link": "glyphicon-globe"
      }
    }));
  }
});

////////////////////////////////////////////
// Component
//
class Folder extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.access_token = access_token;
    this.el = element;

    this.model = new Model();
    this.view = new View({el: this.el, model: this.model});

    this.view.on("btnClicked", (obj) => {
      switch(obj.action) {
      case "open":
        this.fetch(obj.id);
        break;
      case "share":
        this.emit("share", obj.id);
        break;
      case "preview":
        this.emit("preview", obj.id);
        break;
      }
    });

    this.fetch(0);
  }

  fetch(id, callback) {
    let folder_id = id || 0;
    this.model
      .set("id", folder_id)
      .fetch({"data": {"access_token": this.access_token}})
      .success(() => {
        var id = this.model.attributes.id
          , name = this.model.attributes.name;

        this.model.attributes.path_collection.entries.push({"id": id, "name": name});
        this.view.render();
      });
  }
}

module.exports = Folder;
