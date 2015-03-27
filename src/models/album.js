var Executor = require('../executor');

module.exports = function(apiWrapper) {

  var my_properties = [
    'album_type',
    'artists',
    'available_markets',
    'copyrights',
    'external_ids',
    'external_urls',
    'genres',
    'href',
    'id',
    'images',
    'name',
    'popularity',
    'release_date',
    'release_date_precision',
    'tracks',
    'type',
    'uri'
  ];

  var edges = {};

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
    var albumId = schema.parameters;
    return apiWrapper.getAlbum(albumId).then(function(track) {
      var executor = new Executor(track.body, schema.properties, edges, {albumId: albumId});
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