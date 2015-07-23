// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.fetcher = function(){
  archive.readListOfUrls(function(urls) {
    urls.forEach(function(url) {
      archive.isUrlArchived(url, function(exists) {
        if (!exists) {
          archive.downloadUrls([url]);
        }
      });
    });
  });
};



