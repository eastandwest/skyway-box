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
      "reliable": true
    } );

    this.multiparty.on("my_ms", (video) => {
      console.log("my_ms", video);
      this.media.add(video);
    }).on("peer_ms", (video) => {
      console.log("peer_ms", video);
      this.media.add(video);
    }).on("ms_close", (peer_id) => {
      console.log(peer_id);
      this.media.remove(peer_id);
    });

    this.multiparty.on("message", (mesg) => {
      this.message.add(mesg.data);
    });

    this.textInput.on("message", (obj) => {
      obj.name = (this.profile && this.profile.name) || "test user";
      obj.avatar_url = (this.profile && this.profile.avatar_url) || "";
      obj.created_at = new Date();

      this.message.add(obj);
      this.multiparty.send(obj);
    });

    this.multiparty.start();
  }

  setProfile(profile_data) {
    this.profile = profile_data;
    console.log("setProfile - ", this.profile);
  }
}

module.exports = Skyway;
