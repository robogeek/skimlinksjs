

var http = require('http');
var url  = require('url');
var util = require('util');

var apitoken = undefined;
var apidmn   = "api-product.skimlinks.com";

exports.setup = function(token) {
    apitoken = token;
}

exports.query = function(searchFor, start, rows, done) {
    doQuery("/query", {
            key: apitoken,
            q: searchFor,
            start: start,
            format: "json",
            rows: rows,
            // version: 3
            // fq: SOLR Filter Query
        },
        done
        );
}

exports.categories = function(done) {
    doQuery("/categories", {
            key: apitoken,
            format: "json"
    }, done);
}

var doQuery = function(path, params, done) {
    
    var requrl = url.format(
        params != undefined ? {
            protocol: "http",
            host: apidmn,
            pathname: path,
            query: params
        }
        : {
            protocol: "http",
            host: apidmn,
            pathname: path
        }
        );
    util.log(util.inspect(requrl));
    var urlP = url.parse(requrl, false);
    var options = {
      host: urlP.host,
      port: urlP.port,
      path: urlP.pathname + urlP.search,
      method: 'GET'
    };
    var req = http.request(options, function(res) {
      util.log('STATUS: ' + res.statusCode);
      util.log('HEADERS: ' + util.inspect(res.headers));
      res.setEncoding('utf8');
      var data = "";
      res.on('data', function (chunk) {
          //util.log('BODY: ' + chunk);
          data += chunk;
      });
      res.on('end',   function() {
          // util.log('END: ' + data);
          var json = JSON.parse(data);
          if (json.skimlinksProductAPI.products) {
              json.skimlinksProductAPI.products.forEach(function(item) {
                  if (item.price) {
                      var pr = item.price;
                      //var cents = pr.substr(-2);
                      //var dlr = pr.substr(0, pr.length-2);
                      item.price = pr / 100; // dlr +'.'+ cents;
                  }
              });
          }
          done(json);
          //util.log(util.inspect(xmlDoc));
      });
      res.on('error', function(err) {
          util.log('RESPONSE ERROR: ' + err);
      });
    });
    req.on('error', function(err) {
        util.log('REQUEST ERROR: ' + err);
    });
    req.end();
}


