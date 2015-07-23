var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var urlParse = require('url');
var htmlFetcher = require('../workers/htmlfetcher.js');

// require more modules/folders here!

var renderFile = function(filepath, req, res, status) {
  fs.readFile(filepath, function(error, data){
    if(error){
      return console.log(error);
    }
    res.writeHead(status);
    res.write(data);
    res.end();
  });
};

exports.handleRequest = function (req, res) {
  var parts = urlParse.parse(req.url)
  var pathName = parts.pathname;
  var url = pathName.substring(1);
  if(req.method === "GET"){
    if(pathName === '/'){
      renderFile(archive.paths.siteAssets + '/index.html', req, res, 200);
    }else {
      archive.isUrlArchived(url, function(exists){
        if (exists) {
          renderFile(path.join(archive.paths.archivedSites,url), req, res, 302);
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    }
  }else if(req.method === "POST"){
    if(pathName === '/'){
      var data = '';
      req.on('data', function(chunk){
        data += chunk;
      });
      req.on('end', function(){
        // data = JSON.parse(data);
        // var urlToAdd = data.url;
        var urlToAdd = data.split('=')[1];

        archive.isUrlArchived(urlToAdd, function(exists) {
          if (exists) {
            renderFile(path.join(archive.paths.archivedSites,urlToAdd), req, res, 302);
          } else {
            archive.isUrlInList(urlToAdd, function(is) {
              if (!is) {
                archive.addUrlToList(urlToAdd, function() {});
              }
            });
            renderFile(archive.paths.siteAssets + '/loading.html', req, res, 302);
          }
        });
      });
    }
  } else {
    res.writeHead(404);
    res.end();
  }
};

