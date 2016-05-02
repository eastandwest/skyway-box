/* streaming.test.js */
var Streaming = require("../../libs/plugins/streaming")
  , EventEmitter = require("events").EventEmitter
  , chai = require('chai')
  , sinon = require('sinon')
  , chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised);

var expect = chai.expect;


// fake peer server to check Promise functionalities, just doing echo function
//
class FakeSocket extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(20);
  }

  send(params) {
    params.src = "source";

    setTimeout( (ev) => {
      this.emit("message", params);
    }, 1);
  }
}
class FakePeer extends EventEmitter {
  constructor() {
    super();
    this.socket = new FakeSocket();
  }
}

var fake_peer = new FakePeer();

describe("Streaming", () => {
  describe("#constructor", () => {
    it("sould return Streaming object while constructor process", () => {
      expect(new Streaming(fake_peer)).to.be.an.instanceof(Streaming);
    });
  });

  describe("#attach", () => {
    it("should be fullfilled", () => {
      let streaming = new Streaming(fake_peer)

      return expect( streaming.attach("hogehoge") ).to.be.fulfilled;
    });
  });

  describe("#list", () => {
    it("should be fullfilled", () => {
      let streaming = new Streaming(fake_peer)

      return expect( streaming.list("hogehoge") ).to.be.fulfilled;
    });
  });

  describe("#watch", () => {
    it("should be fullfilled", () => {
      let streaming = new Streaming(fake_peer)

      return expect( streaming.watch("hogehoge", 1) ).to.be.fulfilled;
    });
  });

  describe("#stop", () => {
    it("should be fullfilled", () => {
      let streaming = new Streaming(fake_peer)

      return expect( streaming.stop("hogehoge") ).to.be.fulfilled;
    });
  });

  describe("event:starting", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("starting", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"event", "plugindata": { "data": {"result": {"status": "starting"}}}}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("event:started", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("started", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"event", "plugindata": { "data": {"result": {"status": "started"}}}}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("event:stopping", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("stopping", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"event", "plugindata": { "data": {"result": {"status": "stopping"}}}}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("event:webrtcup", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("webrtcup", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"webrtcup"}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("event:hangup", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("hangup", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"hangup"}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("event:keepalive", () => {
    it("should be fired", () => {
      let streaming = new Streaming(fake_peer)
        , spy = sinon.spy()
        , clock = sinon.useFakeTimers();

      streaming.on("keepalive", spy);

      fake_peer.socket.send({"type": "X_JANUS", "payload":{"janus":"keepalive"}, "src":"source", "dst": "destination"});
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });
  });







});
