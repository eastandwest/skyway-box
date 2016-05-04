var MeView = require("../views/me")
  , MeModel = require("../models/me")
  , EventEmitter = require("events").EventEmitter

class Me extends EventEmitter {
  constructor(element, access_token) {
    super();

    this.element = element;
    this.access_token = access_token;

    this.meModel = new MeModel()

    var self = this;
    this.meModel.fetch({data: {access_token: this.access_token}})
      .success((data) => {
        this.meView = new MeView({el: self.element, model: self.meModel})
          .render();
      });
  }
}

module.exports = Me
