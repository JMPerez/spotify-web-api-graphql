var parser = require('./parser/graphql-parser');
var SpotifyWebApi = require('spotify-web-api-node');
var AlbumModel = require('./models/album');
var TrackModel = require('./models/track');
var ArtistModel = require('./models/artist');

var SpotifyWebApiGraphQL = function() {
  this._models = [];
  this._apiWrapper = null;
};

SpotifyWebApiGraphQL.prototype.init = function() {
  this._apiWrapper = new SpotifyWebApi();
  this._models.push(new AlbumModel(this._apiWrapper));
  this._models.push(new TrackModel(this._apiWrapper));
  this._models.push(new ArtistModel(this._apiWrapper));
};

SpotifyWebApiGraphQL.prototype.execute = function(query, callback) {
  var parsed = parser.parse(query);
  for (var i = 0; i < this._models.length; i++) {
    if (this._models[i].matches(parsed)) {
      return this._models[i].execute(parsed).then(function(result) {
        callback(result);
      });
    }
  }
  callback(null);
};

module.exports = SpotifyWebApiGraphQL;