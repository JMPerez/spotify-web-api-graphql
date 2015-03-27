var utils = require('../utils');

module.exports = function(apiWrapper) {

  var my_properties = [
    'artists',
    'available_markets',
    'disc_number',
    'duration_ms',
    'explicit',
    'external_urls',
    'href',
    'id',
    'is_playable',
    'linked_from',
    'name',
    'preview_url',
    'track_number',
    'type',
    'uri'
  ];

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
    var trackId = schema.parameters;
    apiWrapper.getTrack(trackId).then(function(track) {
      var result = utils.filter(track.body, schema.properties);
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