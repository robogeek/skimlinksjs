var skimlinks = require('../index.js');
var url  = require('url');
var util = require('util');

var config = require('../config');
skimlinks.setup(config.key);

skimlinks.categories(function(err, cats) {
        util.log(util.inspect(cats));
});

