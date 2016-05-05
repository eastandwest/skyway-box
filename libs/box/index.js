var Folder = require("./folder")
  , Profile = require("./profile")
  , Preview = require("./preview")
  , SlideShare = require("./slideshare")
  , Upload = require("./upload")
  , EventEmitter = require("events").EventEmitter

class Box extends EventEmitter {
  constructor(access_token) {
    super();

    if(!access_token) throw "access_token must be set";
    this.access_token = access_token;

    this.folder     = new Folder("#folder-view", access_token);
    this.profile    = new Profile("#profile-view", access_token);
    this.preview    = new Preview("#preview-view", access_token);
    this.slideshare = new SlideShare("#slideshare-view", access_token);
    this.upload     = new Upload("#upload-view", access_token);

    this.setHandler();
  }

  setHandler() {
    this.profile.on("profile", (profile_data) => {
      this.emit("profile", profile_data);
    });
    this.folder.on("share", (file_id) => {
      console.log("share - ",file_id);
      this.slideshare.fetch(file_id);
    });
    this.folder.on("preview", (file_id) => {
      this.preview.fetch(file_id);
    });
  }
}

module.exports = Box;
