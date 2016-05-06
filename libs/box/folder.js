var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<% attributes.item_collection.entries.forEach( (entry) => { %>",
    "<div class='well well-sm clearfix'>",
      "<div class='pull-left'>",
        "<span class='glyphicon <%= icons[entry.type] %> aria-hidden='true'></span>&nbsp;",
        "<span class='label label-primary'><%= entry.type %></span>&nbsp;",
        " : <%= entry.name %>",
      "</div>",
      "<% if(entry.type === 'file') { %>",
      "<div class='pull-right'>",
        "<button class='btn btn-xs btn-info' data-action='share' data-id='<%= entry.id %>'>share</button>&nbsp;",
        "<button class='btn btn-xs btn-warning' data-action='preview' data-id='<%= entry.id %>'>preview</button>&nbsp;",
      "</div>",
      "<% } %>",
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
    "click button": "btnClicked"
  },
  btnClicked: function(ev){
    let action = ev.target.dataset.action
      , id = ev.target.dataset.id
    console.log("btnClicked - ", id, action);
    this.trigger("btnClicked", {"file_id": id, "action": action});
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
      case "share":
        this.emit("share", obj.file_id);
        break;
      case "preview":
        this.emit("preview", obj.file_id);
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
        if(typeof(callback) === "function") {
          callback(this.model.attributes);
        } else {
          this.view.render();
        };
      });
  }
}

module.exports = Folder;
