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



////////////////////////////////////////////
// Backbone View
//
var View = Backbone.View.extend({
  template: _.template(template_),
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
  add(video) {
    $("#media-"+video.id).remove();
    var $video_div = $("<div class='video pull-left'></div>").attr({"id": "media-"+video.id})
      , $video = $("<video autoplay></video>").attr("src", video.src)

    $(this.el).find(".videos").append($video_div.append($video));
    this.fit();
  }
  fit(){
    var num = $(this.el).find(".video").length
      , width = Math.floor( 100 / num )
      , margin = Math.floor((100 - width) / 2)
    $(this.el).find(".video").css("width", width+"%");
    $(this.el).find("video").css("margin-left", "-"+margin+"%");
  }
}

module.exports = Media;
