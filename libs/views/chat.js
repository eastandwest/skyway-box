var backbone = require("backbone")
  , _ = require("underscore")
  , $ = require("jquery")

var template_mesg_ = [
    "<div>",
      "<div class='chat-avatar'><img src='<%= avatar_url %>'></div>",
      "<div class='chat-name'><%= name %></div>",
      "<div class='chat-text'><%= text %></div>",
      "<div class='chat-created_at'><%= created_at %></div>",
    "</div>",
].join("");

var template_video_ = [
    "<div>",
      "<video src='<%= url %>' data-peerid='<%= peerid %>' autoplay>",
    "</div>",
].join("");


var template_ = [
  "<h3>chat</h3>",
  "<div>",
    "<div>",
      "<form>",
        "<input type='text' name='message'>",
        "<input type='submit' value='send'>",
      "</form>",
    "</div>",
    "<div class='video'>",
    "</div>",
    "<div class='message'>",
    "</div>",
  "</div>"
].join("");

var ChatView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.collection, 'add', this.addMesg);
  },
  events: {
    "submit" : "onSubmit"
  },

  onSubmit: function(ev) {
    ev.preventDefault();
    var elem = $(ev.target).find("input[name=message]")
      , mesg = elem.val();

    this.trigger("message", mesg);
    elem.val("");
  },

  template: _.template(template_),
  template_mesg: _.template(template_mesg_),
  template_video: _.template(template_video_),

  addVideo: function(video) {
    this.$el.find(".video").append(this.template_video({peerid: video.id, url: video.src}));
  },
  removeVideo: function(peerid) {
    this.$el.find("video[data-peerid="+peerid+"]").remove();
  },

  addMesg: function() {
    let model = _.last(this.collection.models);
    this.$el.find(".message").append(this.template_mesg(model.attributes));
  },
  render: function() {
    console.log(this.collection);
    this.$el.html(this.template(this.collection));

    return this;
  }
});

module.exports = ChatView;
