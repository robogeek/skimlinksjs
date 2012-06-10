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

  var skimlinks = require('./index.js');
  skimlinks.setup(" ... product API key provided by Skimlinks ... ");

Query
=====

Now, let's see how to query for a product:

  var skimlinks = require('./index.js');
  skimlinks.setup(" ... product API key provided by Skimlinks ... ");
  
  skimlinks.query(" ... product keywords ... ", 0, 300, function(data) {
    util.log("# found: " + data.skimlinksProductAPI.numFound);
    data.skimlinksProductAPI.products.forEach(function(row) {
        util.log(util.inspect(row));
    });
  });

So far this supports everything in the Skimlinks Product API except for the "fq" (Filter Query) parameter.

Categories
==========

Now, let's see how get the list of categories:

  var skimlinks = require('./index.js');
  skimlinks.setup(" ... product API key provided by Skimlinks ... ");
  skimlinks.categories(function(cats) {
        util.log(util.inspect(cats));
  });

