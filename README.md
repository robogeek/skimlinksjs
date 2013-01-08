SkimlinksJS
===========

Skimlinks Product API for Node.js

Skimlinks (skimlinks.com) is a service to help monetize websites.  It has two major services offered, 

* automagically search out key phrases that can be linked to products sold by affiliate merchants,
* an API listing out the products offered by affiliate merchants

What makes Skimlinks so interesting (besides being a well-thought-out service) is the sheer depth of the affiliate merchant relationships managed by the Skimlinks service.  As of this writing they have nearly 18,000 active merchants from 33 affiliate networks.  Working with Skimlinks to get affiliate merchant product data is a lot simpler than for you to manage all those relationships yourself.

The SkimlinksJS module allows Node.js programs to use the Skimlinks Product API.

The Skimlinks Product API has exactly two methods: query, categories.  Hence, the SkimlinksJS module has two methods: query, categories.

Basic Setup
===========

Any program must start with this (required to initialize the module with your API key):

    var skimlinks = require('skimlinksjs');
    var config = require('./config.js');
    skimlinks.setup(config.key);

The config file (`config.js`) should look something like this:

    module.exports = {
        key: " ... product API key provided by Skimlinks ... "
    }

Truthfully, the `config.js` is unnecessary as all that needs to be done is give the key to the `setup` function.  Putting this in a module allows you to share configuration information among several programs, as well as with the examples bundled in the skimlinksjs repository.

Query
=====

Now, let's see how to query for a product:

    var skimlinks = require('skimlinksjs');
    var util = require('util');
    var config = require('./config.js');
    skimlinks.setup(config.key);
  
    skimlinks.query({
       // params object
    }, function(data) {
      util.log("# found: " + data.skimlinksProductAPI.numFound);
      data.skimlinksProductAPI.products.forEach(function(row) {
        util.log(util.inspect(row));
      });
    });

The `params` object has fields similar to the skimlinks API (of course).

* `start` and `rows` correspond to the same files in the skimlinks API, and control where the results start at, and the number of rows to return
* `q` is the query string, formatted per [Solr Query Syntax](http://wiki.apache.org/solr/SolrQuerySyntax)
* `fq` is the filter string, formatted per [Solr Query Filtering](http://wiki.apache.org/solr/CommonQueryParameters#fq)

Example params objects

    {
        q: "title:\"electric bicycle\"",
        fq: "country:US"
    }

Returns electric bicycle products sold in the US

    {
        q: "title:\"electric bicycle\"",
        fq: "merchant:(Amazon OR Target)"
    }

Returns electric bicycle products sold by either Amazon or Target

    {
        q: "id:###########"
    }

Returns information for a specific product.

Categories
==========

Now, let's see how get the list of categories:

    var skimlinks = require('./index.js');
    var util = require('util');
    var config = require('./config.js');
    skimlinks.setup(config.key);
    skimlinks.categories(function(cats) {
        util.log(util.inspect(cats));
    });

