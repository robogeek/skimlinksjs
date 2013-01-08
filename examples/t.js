var skimlinks = require('../index.js');
var url  = require('url');
var util = require('util');

var config = require('../config');
skimlinks.setup(config.key);

// groupId:45335650 merchantId:12678 
skimlinks.query({
        // start: 0, rows: 300, fq: "+groupId:45335650 +merchantId:12678 +id:86680570", searchFor: "Pogoplug"
        start: 0, rows: 300,
        searchFor: "title:\"electric bicycle\" isAccessory:false merchant:(Amazon OR Target)",
        fq: "country:US"
    }, function(err, data) {
        if (err) {
            util.log(util.inspect(err));
        } else {
            util.log("# found: " + data.skimlinksProductAPI.numFound);
            data.skimlinksProductAPI.products.forEach(function(row) {
                util.log(util.inspect(row));
            });    
        }
});
