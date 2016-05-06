var md5 = require("md5")
  , $ = require("jquery")
  , conf = require("../../conf/config.json")

// fixme: client_id and client_secret should be loaded from config file
var State = {
  key: "box-state",
  auth_endpoint: "https://account.box.com/api/oauth2/authorize",
  client_id: conf.client_id,
  code: null,

  is_redirect: function() {
    var obj = {};

    location.search.substring(1).split("&").forEach((str) => {
      let arr_ = str.split("=");
      obj[arr_[0]] = arr_[1];
    });


    // todo: param error and error_description should be checked.
    if(typeof(obj.state) === "undefined" || typeof(obj.code) === "undefined") return false;


    if(obj.state !== this.get_stateId()) {
      throw "redirected state does not match with this session";
    }

    this.code = obj.code;

    return true;
  },
  gen_param: function() {
    return [
      "response_type=code",
      "client_id="+this.client_id,
      "state="+this.get_stateId()
    ].join("&")
  },

  get_authorizeurl: function() {
    this.renew_stateId();
    return [ this.auth_endpoint, this.gen_param() ].join("?");
  },
  get_stateId: function() {
    var id_ = sessionStorage[this.key];

    return id_ ? id_ : this.renew_stateId();
  },
  renew_stateId: function() {
    var id_ = md5(new Date());
    sessionStorage[this.key] = id_;

    return id_
  }
}

module.exports = State;
