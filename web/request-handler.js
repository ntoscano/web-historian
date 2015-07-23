var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var urlParse = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parts = urlParse.parse(req.url)
  var path = parts.pathname;
  var url = path.substring(1);
  if(req.method === "GET"){
    if(path === '/'){
      fs.readFile(archive.paths.siteAssets + '/index.html', function(error, data){
        if(error){
          return console.log(error);
        }
        res.writeHead(200);
        res.write(data);
        res.end();
      });
    }else {
      archive.isUrlArchived(url, function(exists){
        if (exists) {
          fs.readFile(archive.paths.archivedSites + path, function(error, data){
            if(error){
              return console.log(error);
            }
            res.writeHead(200);
            res.write(data);
            res.end();
          })

        } else {
          res.writeHead(404);
          res.end();
        }
      });
    }
  }else if(req.method === "POST"){
    if(path === '/'){
      var data = '';
      req.on('data', function(chunk){
        data += chunk;
      });
      req.on('end', function(){
        data = JSON.parse(data);
        var urlToAdd = data.url;
        archive.addUrlToList(urlToAdd, function(){});
        res.writeHead(302);
        res.end();
      });
    }
  } else {
    res.writeHead(404);
    res.end();
  }
};
