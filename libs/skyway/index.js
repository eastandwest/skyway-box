var Message = require('./message')
  , Media = require('./media')
  , TextInput = require('./textInput')
  , EventEmitter = require("events").EventEmitter



class Skyway extends EventEmitter {
  constructor(api_key) {
    super();

    if(!api_key) throw "api_key must be set";
    console.log(api_key);
    this.profile = {};
    this.api_key = api_key;
    this.message = new Message("#message-view");
    this.media = new Media("#media-view");
    this.textInput = new TextInput("#text-input-view");
    this.startChat();
  }

  startChat() {
    this.multiparty = new MultiParty( {
      "key": this.api_key,
      "video": {
        "width": {"max": 320},
        "height": {"max": 240},
        "frameRate": 15
      },
      "reliable": true
    } );

    this.multiparty.on("my_ms", (video) => {
      console.log("my_ms", video);
      this.media.add(video, {mute: true});
    }).on("peer_ms", (video) => {
      console.log("peer_ms", video);
      this.media.add(video);
    }).on("ms_close", (peer_id) => {
      console.log(peer_id);
      this.media.remove(peer_id);
    });

    this.multiparty.on("message", (recv) => {
      var obj = recv.data;
      // check obj.type. if type equal 'embedlink', fire recv:embedlink
      switch(obj.type) {
      case "embedlink":
        this.emit("recv:embedlink", obj.mesg);
        break;
      default:
        // do nothing
        break;
      }
      this.message.add(obj);
    });

    this.textInput.on("message", (obj) => {
      this.addMeta_(obj, "text")

      this.message.add(obj);
      this.multiparty.send(obj);
    });

    this.multiparty.start();
  }


  setProfile(profile_data) {
    this.profile = profile_data;
    console.log("setProfile - ", this.profile);
  }

  shareEmbedlink(embedlinkObj) {
    var obj = {};
    obj.mesg = embedlinkObj;
    this.addMeta_(obj, "embedlink")

    this.message.add(obj);
    this.multiparty.send(obj);
  }

  reqMessages() {
    return this.message.getAll();
  }

  // private
  addMeta_(obj, type) {
    obj.type = type || "text";
    obj.name = (this.profile && this.profile.name) || "test user";
    obj.avatar_url = (this.profile && this.profile.avatar_url) || "";
    obj.created_at = new Date();
  }
}

module.exports = Skyway;
