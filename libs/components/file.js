var EmbedLinkView = require("../views/embed_link")
  , EmbedLinkModel = require("../models/embed_link")
  , EventEmitter = require("events").EventEmitter

class File extends EventEmitter {
  constructor(id, element, access_token) {
    super();

    this.id = id;
    this.element = element;
    this.access_token = access_token;

    this.embedLinkModel = new EmbedLinkModel({id: this.id})

    var self = this;
    this.embedLinkModel.fetch({data: {access_token: this.access_token}})
      .success((data) => {
        console.log(data, self.embedLinkModel);
        this.embedLinkView = new EmbedLinkView({el: self.element, model: self.embedLinkModel})
          .render();
      });
  }
}

module.exports = File
