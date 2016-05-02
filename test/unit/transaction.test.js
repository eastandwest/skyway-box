"use strict";
/* transactions.test.js */

var sinon = require("sinon")
var Transaction = require("../../libs/base/transaction")
  , expect = require('chai').expect

var clock;

// before(() => { clock = sinon.useFakeTimers(); });
// after(() => { clock.restore(); });

describe("Transaction", () => {
  describe("#constructor", () => {
    // normal test
    it("sould return Transaction object after constructor process", () => {
      expect(new Transaction(() => {})).to.be.an.instanceof(Transaction);
    });

    it("should set created_at automatically", () => {
      var t = new Transaction(() => {});
      expect( t.get("created_at") ).to.match(/^[0-9]+$/)
    });

    it("should set timeout equal 30 as default", () => {
      var t = new Transaction(() => {});
      expect( t.get("timeout") ).to.equal(30)
    });

    it("should change timeout value", () => {
      var t = new Transaction(() => {}, null, 5);
      expect( t.get("timeout") ).to.equal(5)
    });

    it("should expose reject callback after 30 seconds when timeout is not set", () => {
      var spy = sinon.spy();
      var clock = sinon.useFakeTimers();

      var t = new Transaction(() => {}, spy);

      clock.tick(29999);
      expect(spy.notCalled).to.be.true;
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;

      clock.restore();
    });



    it("should expose reject callback when timeout second passses", () => {
      var spy = sinon.spy();
      var clock = sinon.useFakeTimers();

      var t = new Transaction(() => {}, spy, 5);

      clock.tick(4999);
      expect(spy.notCalled).to.be.true;
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;

      clock.restore();
    });

    it("should not expose reject callback when resolve is exposed before timeout", () => {
      var spy = sinon.spy();
      var clock = sinon.useFakeTimers();

      var t = new Transaction(() => {}, spy, 5);

      t.call_resolve();
      clock.tick(5000);
      expect(spy.notCalled).to.be.true;

      clock.restore();
    });

    it("should expose reject callback only once when explicitly called (it means after timeout second will not be called)", () => {
      var spy = sinon.spy();
      var clock = sinon.useFakeTimers();

      var t = new Transaction(() => {}, spy, 5);

      t.call_reject();
      expect(spy.calledOnce).to.be.true;
      clock.tick(5000);
      expect(spy.calledOnce).to.be.true;

      clock.restore();
    });



    // abnormal test
    it("should raise error when resolve does not set", () => {
      expect( () => {new Transaction()} ).to.throw(Error);
    });

    it("should raise error when resolve is not function", () => {
      expect( () => {new Transaction(123)} ).to.throw(Error);
    });

    it("should simply ignore when reject is not function", () => {
      expect( () => {new Transaction( () => { /* resolve */ }, 123)} ).to.not.throw(Error);
    });

    it("should raise error when timeout is not number", () => {
      expect( () => {new Transaction( () => { /* resolve */ }, null, "hoge")} ).to.throw(Error);
    });

    it("should raise error when timeout is less than 5", () => {
      expect( () => {new Transaction( () => { /* resolve */ }, null, 5)} ).to.not.throw(Error);
      expect( () => {new Transaction( () => { /* resolve */ }, null, 4)} ).to.throw(Error);
    });
  });

  describe("#call_resolve", () => {
    // normal test
    it("should expose resolve callback.", () => {
      let t = new Transaction( () => { return "resolve" } );

      expect(t.call_resolve()).to.equal("resolve");
    });
  });

  describe("#call_reject", () => {
    // normal test
    it("should expose reject callback.", () => {
      let t = new Transaction( () => { return "resolve" }, () => { return "reject" } );

      expect(t.call_reject()).to.equal("reject");
    });
  });

  describe("event:", () => {
    it("shold fire resolved when it is exposed", () => {
      let spy = sinon.spy()
        , t = new Transaction(() => {}, null, 5)
        , clock = sinon.useFakeTimers();

      t.on("resolved", spy);
      t.on("timeout", spy);

      t.call_resolve();

      clock.tick(5000);
      expect(spy.calledOnce).to.be.true;
      clock.restore();
    });

    it("shold fire rejected but not timeout when it is explicitly exposed", () => {
      let spy = sinon.spy()
        , t = new Transaction(() => {}, null, 5)
        , clock = sinon.useFakeTimers();

      t.on("rejected", spy);
      t.on("timeout", spy);

      t.call_reject();

      clock.tick(5000);
      expect(spy.calledOnce).to.be.true;
      clock.restore();
    });

    it("shold fire rejected and timeout when it is called when timeout", () => {
      var spy = sinon.spy(), spy_event = sinon.spy();
      var clock = sinon.useFakeTimers();

      var t = new Transaction(() => {}, spy, 5);
      t.on("rejected", spy_event);
      t.on("timeout", spy_event);

      clock.tick(4999);
      expect(spy.notCalled).to.be.true;
      expect(spy_event.notCalled).to.be.true;
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;

      expect(spy_event.calledTwice).to.be.true;

      clock.restore();

    });
  });
});
