var backbone = require("backbone")
  , _ = require("underscore")

var FolderModel = Backbone.Model.extend({
  urlRoot: '/folders',
  defaults: {
    id: null,
    created_by: null,
    item_collection: null,
    item_status: null,
    modified_by: null,
    size: null,
    type: "folder"
  },
  parse: (response, options) => {
    return {
      created_by: response.created_by,
      item_collection: response.item_collection,
      item_status: response.item_status,
      modified_by: response.modified_by,
      size: response.size,
      type: response.type
    }
  }
});

module.exports = FolderModel
