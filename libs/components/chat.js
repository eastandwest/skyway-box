var ChatModel = require("../models/chat")
  , ChatCollection = require("../collections/chat")
  , ChatView = require("../views/chat")
  , EventEmitter = require("events").EventEmitter
  , conf = require("../../conf/config.json")


class Chat extends EventEmitter {
  constructor(element, name, avatar_url) {
    super();
    this.api_key = conf.skyway_api_key;
    console.log(this.api_key);

    this.element = element;
    this.name = name || "Ken";
    this.avatar_url = avatar_url || "https://app.box.com/api/avatar/large/275959193";

    this.collection = new ChatCollection();
    this.view = new ChatView({el: this.element, collection:this.collection}).render();

    this.view.on("message", (mesg) => {
      this.add(this.avatar_url, this.name, mesg);
      this.multiparty.send({"type": "chat", "avatar_url": this.avatar_url, "name": this.name, "text": mesg});
    });

    // this.test();
    this.count = 0;

    this.startChat();
  }

  test() {
    let texts = ["hello", "world", "bye"];

    setInterval((ev) => { let text = texts[ this.count % texts.length ]; this.count++; this.add("https://app.box.com/api/avatar/large/275959193", "kensaku Komatsu", text); }, 3000);
  }

  add(avatar_url, name, text) {
    var curr = new Date();
    console.log(curr, text);
    var model = new ChatModel({"avatar_url": avatar_url, "name": name, "text": text, "created_at": curr});
    this.collection.add(model);
  }

  startChat() {
    this.multiparty = new MultiParty({
      "key": this.api_key,
      "reliable": true
    });

    this.multiparty.on("my_ms", (video) => {
      this.view.addVideo(video);
    }).on("peer_ms", (video) => {
      this.view.addVideo(video);
    }).on("ms_close", (peerid) => {
      this.view.removeVideo(peerid);
    }).on('message', (obj) => {
      if(obj.data.type === "chat") {
        this.add(obj.data.avatar_url, obj.data.name, obj.data.text);
      }
    });

    this.multiparty.start();
  }
}

module.exports = Chat;

