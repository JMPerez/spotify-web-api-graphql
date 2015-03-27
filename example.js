var fs = require('fs');
var parser = require('./src/parser/graphql-parser');
var SpotifyGraphQL = require('./src/spotify-graphql');

var spotifyGraphQL = new SpotifyGraphQL();
spotifyGraphQL.init();

function dump(object) {
  console.log(JSON.stringify(object, null, 2));
}

var examples = fs.readdirSync('examples');

function executeExample(example, cb) {
  console.log('Processing ' + example);
  var input = fs.readFileSync('examples/' + example, 'utf8');
  spotifyGraphQL.execute(input, function(output) {
    dump(output);
    cb();
  });
}

var i = 0;
var ex = function(i) {
  executeExample(examples[i], function() {
    if (i < examples.length - 1) {
      ex(++i);
    }
  });
};

ex(i);