# Skyway Janus

A javascript sdk for signalling gateway system for skyway and janus.

At this moment, only Streaming plugin is implemented.

## snipet

```html
<script src="https://skyway.io/dist/0.3/peer.min.js"></script>
<script src="https://raw.githubusercontent.com/eastandwest/skyway-janus/master/dist/skyway-janus.build.js"></script>

<script>
var peer = new Peer({key: "********-****-****-****-********"}), streaming;

peer.on("open", (id) => {
  streaming = new SkywayJanus.Streaming(peer);

  streaming.attach("peerid-of-gateway").then((data) => {
    // run #list() and #watch method
    // ....
  });
});

peer.on("call", (call) => {
  call.answer();

  call.on("stream", (stream) => {
    // handle stream object
  });
});
</script>
```

please note that [signalling gateway](https://github.com/eastandwest/signalinggateway) MUST be executed in same linux machine of Janus-gateway.

## API

### Streaming module

* new SkywayJanus.Streamin(peer)
  * peer : (Peer) instance of Peer object

  constructor

* attach( peerid_of_gateway )
  * peerid_of_gateway: (String) peerid of signalling gateway

  attach streaming plugin of janus

* list( peerid_of_gateway )
  * peerid_of_gateway: (String) peerid of signalling gateway

  obtain list of streaming service provided janus-streaming plugin

* watch( peerid_of_gateway , stream_id)
  * peerid_of_gateway: (String) peerid of signalling gateway
  * stream_id: (String) an id of video/audio stream

  send request to watch streaming service, after that call event will be fired for peer instance.

* stop( peerid_of_gateway )
  * peerid_of_gateway: (String) peerid of signalling gateway

  stop watching

* event:starting

  starting stream service

* event:started

  started stream service

* event:webrtcup

  setup for WebRTC has been done

* event:stopping

  stopping stream service

* event:hangup

  hangupped stream service

* event:keepalive

  just a keepalive data from janus-gateway

## An example of each JSON response from Janus-gateway

* attach

```json
{
  "data": {
    "id": 4146698261
  },
  "janus": "success",
  "session_id": 1792517184,
  "transaction": "6QFb0ZWY9U0K"
  }
}
```

* list

```json
{
  "janus": "success",
  "plugindata": {
    "data": {
      "list": [
        {
          "audio_age_ms": 12,
          "description": "Opus/VP8 live stream coming from gstreamer",
          "id": 1,
          "type": "live",
          "video_age_ms": 11
        },
        {
          "description": "a-law file source (radio broadcast)",
          "id": 2,
          "type": "live"
        },
        {
          "description": "mu-law file source (music)",
          "id": 3,
          "type": "on demand"
        }
      ],
      "streaming": "list"
    },
    "plugin": "janus.plugin.streaming"
  },
  "sender": 4146698261,
  "session_id": 1792517184,
  "transaction": "nVIsQbYxiFHs"
}
```

* watch

```json
{
  "janus": "ack",
  "session_id": 1792517184,
  "transaction": "nq4XENRzPFDV"
}
```

* stop

```json
{
  "janus": "ack",
  "session_id": 1792517184,
  "transaction": "SXwn45CirxfT"
}
```

## license

MIT

---

&copy; Kensaku Komatsu
