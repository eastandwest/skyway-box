var webpack = require('webpack')

var path = require('path')
  , _entry;
const PORT = 8080

switch(process.env.NODE_ENV) {
  case "test":
    _entry = {
      "skyway-janus": "./libs/index.js",
      "test" : "mocha!./test/skyway-janus.test.js"
    };
    break;
  default:
    _entry = {
      "skyway-janus": "./libs/index.js",
    };
    break;
}

module.exports = {
  entry: _entry,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "dist",
    filename: process.env.NODE_ENV === "production" ? "[name].build.min.js" : "[name].build.js"
  },
  module: {
    loaders: [
    {
      test: /\.(js|jsx)?$/,
      exclude: /(node_modules)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015']
      }
    },
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  devServer:{
    port: process.env.PORT || PORT
  }
}
