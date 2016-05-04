var backbone = require("backbone");

var MeModel = Backbone.Model.extend({
  urlRoot: "/me"
});

module.exports = MeModel;
