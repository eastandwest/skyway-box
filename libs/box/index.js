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
    this.upload     = new Upload("#btn-upload", access_token);

    this.setHandler();
  }

  setHandler() {
    // Profile
    this.profile.on("profile", (profile_data) => {
      this.emit("profile", profile_data);
    });

    // Folder
    this.folder.on("share", (file_id) => {
      console.log("share - ",file_id);
      this.slideshare.fetch(file_id);
    });
    this.folder.on("preview", (file_id) => {
      this.preview.fetch(file_id);
    });


    // SlideShare
    this.slideshare.on("embedlink", (embedlinkObj) => {
      this.emit("embedlink", embedlinkObj);
    });

    // Upload
    this.upload.on("req:skyway:messages", () => {
      this.emit("req:skyway:messages", (resp) => { this.upload.post(resp); });
    });
  }

  renew_token(new_token) {
    if(!new_token) throw "new_token must be set";

    this.access_token = new_token;

    this.folder.renew_token(this.access_token);
    this.profile.renew_token(this.access_token);
    this.preview.renew_token(this.access_token);
    this.slideshare.renew_token(this.access_token);
    this.upload.renew_token(this.access_token);
  }

  showSlideShare(embedlinkObj) {
    this.slideshare.show(embedlinkObj);
  }
}

module.exports = Box;
