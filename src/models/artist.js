var Executor = require('../executor');

module.exports = function(apiWrapper) {

  var my_properties = [
    'external_urls',
    'id',
    'followers',
    'genres',
    'href',
    'id',
    'images',
    'name',
    'popularity',
    'type',
    'uri',
    'toptracks'
  ];

  var edges = {
    'toptracks': function(context) {
      return apiWrapper.getArtistTopTracks(context.artistId, 'SE')
        .then(function(toptracks) {
         // console.log(toptracks.body);
          return toptracks.body.tracks;
        });
    }
  };

  function isCompatible(schema) {
    var compatible = true,
        props = schema.properties;
    for (var i = 0; i < props.length; i++) {
      var name = props[i].name;
      if (my_properties.indexOf(name) === -1) {
        compatible = false;
      }
    }
    return compatible;
  }

  function execute(schema, callback) {
    var artistId = schema.parameters;
    return apiWrapper.getArtist(artistId).then(function(artist) {
      var executor = new Executor(artist.body, schema.properties, edges, {artistId: artistId});
      return executor.execute();
    }).catch(function(e) {console.error(e);});
  }

  return {
    matches: function(schema) {
      return isCompatible(schema);
    },
    execute: execute
  };
};