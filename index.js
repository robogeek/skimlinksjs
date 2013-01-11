

var http    = require('http');
var url     = require('url');
var util    = require('util');
var request = require('request');

var apitoken = undefined;
var apidmn   = "api-product.skimlinks.com";

var siteID   = undefined;
var redirecturl = "go.redirectingat.com";

var buildRedirect = exports.buildRedirect = function(params) {
    return url.format({
        protocol: "http",
        host: redirecturl,
        path: "/",
        query: params
    });
}

exports.setup = function(token, theSiteId) {
    apitoken = token;
    siteID   = theSiteId;
}

exports.query = function(params, done) {
    var qryobj = {
            key: apitoken,
            q: "",
            start: 0,
            format: "json",
            rows: 50
    };

    if (params.searchFor) qryobj.q      = params.searchFor;
    if (params.format)    qryobj.format = params.format;
    if (params.start)     qryobj.start  = params.start;
    if (params.rows)      qryobj.rows   = params.rows;
    if (params.fq)        qryobj.fq     = params.fq;
    
    var requrl = url.format({
            protocol: "http",
            host: apidmn,
            pathname: "/query",
            query: qryobj
        });
    util.log("REQUEST URL: " + requrl);

    request({
        method: 'GET',
        uri: requrl
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          if (json.skimlinksProductAPI.products) {
              json.skimlinksProductAPI.products.forEach(function(item) {
                  if (item.price) {
                      var pr = item.price;
                      item.price = pr / 100;
                  }
                  if (item.url) {
                    var redirparams = {
                        id: siteID,
                        url: item.url,
                        xs: 1
                        // xcust - customer token
                        // sref - URL of calling page
                    };
                    if (params.xcust) redirparams.xcust = params.xcust;
                    if (params.sref)  redirparams.sref  = params.sref;
                    item.url = buildRedirect(redirparams);
                  }
              });
          }
          json.requrl = requrl;
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

// fq - filter query support
exports.queryOld = function(searchFor, start, rows, done) {
    var qryobj = {
            key: apitoken,
            q: searchFor,
            start: start,
            format: "json",
            rows: rows
    };
    
    request({
        method: 'GET',
        uri: url.format({
            protocol: "http",
            host: apidmn,
            pathname: "/query",
            query: qryobj
        })
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          if (json.skimlinksProductAPI.products) {
              json.skimlinksProductAPI.products.forEach(function(item) {
                  if (item.price) {
                      var pr = item.price;
                      item.price = pr / 100;
                  }
              });
          }
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

exports.categories = function(done) {
    request({
        method: 'GET',
        uri: url.format({
            protocol: "http",
            host: apidmn,
            pathname: "/categories",
            query: {
                key: apitoken,
                format: "json"
            }
        })
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

exports.merchantDomains = function(done, start, rows) {
    request({
        method: 'GET',
        uri: url.format({
            protocol: "http",
            host: apidmn,
            pathname: "/merchants/domains",
            query: {
                key: apitoken,
                format: "json",
                start: start,
                rows: rows
            }
        })
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

exports.merchantSearch = function(done, searchFor, start, rows) {
    var path = "/merchants/json/"+apitoken+"/search/"+searchFor;
    if (start && start !== "") path += "/start/" +start;
    if (rows  && rows  !== "") path += "/limit/" +rows;
    request({
        method: 'GET',
        uri: url.format({
            protocol: "http",
            host: "api-merchants.skimlinks.com",
            pathname: path
        })
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

exports.merchantByCategory = function(done, category, start, rows) {
    request({
        method: 'GET',
        uri: url.format({
            protocol: "http",
            host: apidmn,
            pathname: "/merchants/category",
            query: {
                key: apitoken,
                format: "json",
                start: start,
                rows: rows
            }
        })
    }, function(error, response, body) {
        if (error) { done(error); } // handle error
        if (response.statusCode == 200 || response.statusCode == 201) {
          var json = JSON.parse(body);
          done(null, json);
        } else { // generate error
            done({
                reason: 'request error: '+ response.statusCode,
                response: response,
                body: body
            });
        }
    });
}

