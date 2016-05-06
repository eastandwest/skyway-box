var backbone = require('backbone')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , $ = require('jquery')

////////////////////////////////////////////
// template html (underscore)
//
var template_ = [
    "<div class='videos clearfix'>",
    "</div>"
  ].join("")
  , video_template_ = [
    "<div class='video pull-left' id='media-<%= id %>'>",
      "<video autoplay src='<%= src %>' <% if(mute) { %>muted<% } %>></video>",
    "</div>"
  ].join("")


////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
  video_template: _.template(video_template_),
  render: function() {
    this.$el.html(this.template());
  }
});

////////////////////////////////////////////
// Component
//
class Media extends EventEmitter {
  constructor(element) {
    super();

    this.el = element;
    this.view = new View({el: this.el});

    this.view.render();
  }

  remove(id) {
    console.log("remove", id);

    $(this.el).find("#media-"+id).remove();
    this.fit();
  }
  add(video, obj /* when case of my_ms, {"mute" : true} is set */) {
    // if same id exists, remove it.
    $("#media-"+video.id).remove();

    // create video node
    video.mute = (obj && obj.mute) || false;
    let $vNode = $(this.view.video_template(video));

    // attach node and do fit for width
    $(this.el).find(".videos").append($vNode);
    this.fit();
  }
  fit(){
    // fit video width to media_view
    var num = $(this.el).find(".video").length
      , width = Math.floor( 100 / num )
      , margin = Math.floor((100 - width) / 2)
    $(this.el).find(".video").css("width", width+"%");
    $(this.el).find("video").css("margin-left", "-"+margin+"%");
  }
}

module.exports = Media;
