# Skyway Box

Video conf app with box and skyway.

* app url
  * https://box.skyway.io/
  * todo: photo (perhaps, video)

* manual
  * todo

---

## how to contribute

### setup

* install node, npm, webpack on your environment

* set client_id and else in conf/config.json

```
$ cd conf; cp config.json.tmpl config.json
```

then, update ``config.json``

```
{
  "api_endpoint": "https://api.box.com/oauth2/",
  "client_id": "**********************************", <- https://app.box.com/developers/services/edit/
  "client_secret": "********************************", <- https://app.box.com/developers/services/edit/
  "skyway_api_key" : "********-****-****-****-************" <- https://skyway.io/ds/
}
```

### run watch script

```
$ npm run dev
```

### run server

```
$ node index.js
```

## Architecture

### manual

todo:

### directories

```
$ tree
.
├── LICENSE
├── cert              // certification files for developing (WebRTC requires https)
├── conf              // configuration
│   └── config.json.tmpl
├── html              // template html
│   └── skyway-box.html.tmpl
├── index.js          // server code
├── libs              // libraries for front end
│   ├── index.js        // endpoint of building library
│   ├── base            // base libraries
│   │   └── state.js      // managing application state
│   ├── box             // libraries for box API components
│   │   ├── index.js      // endpoint of box component
│   │   ├── folder.js     // box folder view
│   │   ├── preview.js    // box preview view
│   │   ├── profile.js    // box user profile view
│   │   ├── slideshare.js // box shared view
│   │   └── upload.js     // box upload feature (for text chat on top of skyway)
│   └── skyway          // libraries for SkyWay API components
│       ├── index.js      // endpoint of skyway component
│       ├── media.js      // skyway media view
│       ├── message.js    // skyway text message view
│       └── textInput.js  // skyway text input feature
├── logs
├── package.json
├── public            // static files such as image and js script build by webpack.
├── readme.md
├── test              // todo: write test code
├── tmp               // temporary directory for uploading chat history
└── webpack.config.js // build script for webpack
```

## site for each APIs

* box Developers - functional PaaS of on line storage
  * https://developers.box.com/
* SkyWay - WebRTC PaaS
  * http://nttcom.github.io/skyway/en/info-js.html


## license

MIT

---

&copy; Kensaku Komatsu
