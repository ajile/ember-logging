/* eslint-env node */

module.exports = {
  name: 'Install',
  description: 'Install',
  afterInstall: function() {
    this.addBowerPackageToProject('raven-js#^3.9.1');
  }
};
