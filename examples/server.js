var express   = require('express');
var url       = require('url');
var util      = require('util');
var skimlinks = require('../index.js');

var config = require('../config');
skimlinks.setup(config.key);

var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.engine('html', require('ejs').renderFile);

var parseUrlParams = function (req, res, next) {
    req.urlP = url.parse(req.url, true);
    next();
}

app.get('/', function(req, res) {
    res.render('index.html');
});

app.post('/', function(req, res) {
    var params = {};
    if (req.body.start     && req.body.start     !== "") params.start     = req.body.start; 
    if (req.body.rows      && req.body.rows      !== "") params.rows      = req.body.rows; 
    if (req.body.searchFor && req.body.searchFor !== "") params.searchFor = req.body.searchFor;
    if (req.body.filter    && req.body.filter    !== "") params.fq        = req.body.filter;
    skimlinks.query(params, function(err, data) {
        if (err) {
            util.log(util.inspect(err));
        } else {
            util.log("# found: " + data.skimlinksProductAPI.numFound);
            res.render('index.html', {
                start:  req.body.start,
                rows:   req.body.rows,
                searchFor: req.body.searchFor,
                filter: req.body.filter,
                requrl: data.requrl,
                items: data.skimlinksProductAPI.products
            });
        }
    });
});

app.listen(3000);