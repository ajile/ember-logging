/* jshint node: true */
'use strict';
var path = require('path');

module.exports = {
  name: 'ember-logging',
  isDevelopingAddon: function() {
    return true;
  },
  included: function(app, parentAddon) {
    var path = process.cwd();
    var target = (parentAddon || app);
    var vendor = this.treePaths.vendor;
    target.import(app.bowerDirectory + '/raven-js/dist/raven.js');
    target.import(app.bowerDirectory + '/raven-js/dist/plugins/ember.js');
    app.import(vendor + '/shims/raven.js');
    return this._super.included(target);
  }
};
