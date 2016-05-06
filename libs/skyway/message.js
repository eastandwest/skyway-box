var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
  "<div class='well well-sm clearfix'>",
    "<div class='pull-left'>",
      "<img src='<%- avatar_url %>'>",
    "</div>",
    "<div class='message'>",
      "<span class='name'><%- name %> <span class='label label-warning'><%- type %></span></span><br>",
      "<span class='message-body <%- type %>'><%- outStr %></span>",
    "</div>",
  "</div>"
].join("")


////////////////////////////////////////////
// Backbone Model
//
var Model = Backbone.Model.extend({
});

////////////////////////////////////////////
// Backbone Collection
//
var Collection = Backbone.Collection.extend({
  model: Model
});

////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  add: function(attr) {
    this.$el.append(this.template(attr));
  }
});

////////////////////////////////////////////
// Component
//
class Message extends EventEmitter {
  constructor(element) {
    super();

    this.el = element;

    this.collection = new Collection();
    this.view = new View({el: this.el, collection: this.collection});

    this.view.render();
  }

  add(obj) {
    console.log("add - ", obj);

    switch(obj.type) {
      case "embedlink":
        obj.outStr = obj.mesg.expiring_embed_link.url;
        break;
      case "text":
      default:
        obj.outStr = obj.mesg;
        break;
    }

    var model = new Model(obj);
    this.collection.add(model);
    this.view.add(model.attributes);
  }

  getAll() {
    return _.clone(this.collection.models.map( (model) => { return model.attributes } ));
  }
}

module.exports = Message;
