/* skyway.test.js */

var context = require.context('.', true, /\/unit\/.+\.test\.js?$/);
context.keys().forEach(context)

module.exports = context;
