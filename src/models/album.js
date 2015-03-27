var utils = require('../utils');

module.exports = function(apiWrapper) {

  var my_properties = ['id', 'name', 'artists', 'tracks'];

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
    apiWrapper.getAlbum(albumId).then(function(album) {
      var result = utils.filter(album.body, schema.properties);
      callback(result);
    }).catch(function(e) {console.error(e);});
  }

  return {
    matches: function(schema) {
      return isCompatible(schema);
    },
    execute: execute
  };
};