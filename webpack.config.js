var webpack = require('webpack')

var path = require('path')
  , _entry;
const PORT = 8080

switch(process.env.NODE_ENV) {
  case "test":
  default:
    _entry = {
      "skyway-box": "./sample/skyway-box-entry.js"
    };
    break;
}

module.exports = {
  entry: _entry,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "sample"),
    publicPath: "sample",
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
