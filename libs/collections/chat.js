var backbone = require("backbone")
  , ChatModel = require("../models/chat")

var ChatCollection = Backbone.Collection.extend({
  model: ChatModel
});

module.exports = ChatCollection;
