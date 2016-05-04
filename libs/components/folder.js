var FolderView = require("../views/folder")
  , FolderModel = require("../models/folder")
  , EventEmitter = require("events").EventEmitter

class Folder extends EventEmitter {
  constructor(folder_id, element, access_token){
    super();

    this.access_token = access_token;
    this.element = element;

    this.model = new FolderModel({id: folder_id})
    var self = this;

    self.model.fetch({ data : {access_token: this.access_token} })
      .success(() => {
        this.view = new FolderView({el: self.element, model: self.model})
          .render()
          .on("contentClicked", (params) => {
            if(params.type === "file") {
              this.emit("fileSelected", params.id);
            } else {
              this.emit("folderSelected", params.id);
            }
          });

      });
  }
}

module.exports = Folder;
