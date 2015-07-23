var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(error, data){
    if(error){
      return console.log(error);
    }
    var urls = data.split('\n');
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(urls) {
    var is = urls.indexOf(url) !== -1;
    callback(is);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function(error){
    if(error){
     return console.log(error);
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(error, files){
    if(error){
      return console.log(error);
    }
    var exists = files.indexOf(url) !== -1;
    callback(exists);
  });
};

exports.downloadUrls = function(urlArray){
  urlArray.forEach(function(url){
    httpRequest.get('http://'+url, function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      var data = res.buffer.toString();

      //res.code, res.headers

      fs.writeFile(path.join(exports.paths.archivedSites, url), data, function(error){
        if(error){
          return console.log(error);
        }
      });
      
    });
  });
};











