(function() {
  function vendorModule() {
    'use strict';
    return { 'default': self['Raven'] };
  }

  define('raven', [], vendorModule);
})();
