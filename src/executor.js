var Promise = require('promise');

var Executor = function(initial, schema, edges, context) {
  this._initial = initial;
  this._schema = schema;
  this._promises = [];
  this._context = context;  // used to find out against what we need to apply a deep request
  this._edges = edges;      // used as a mapping 'extra -> deep request'
};

/**
 * [execute description]
 * @return {[type]} A promise!
 */
Executor.prototype.execute = function() {
  return this._processObject(this._initial, this._schema);
};

/**
 *
 * It takes an object and applies a certain schema
 *
 * Object {
 *   name: 'My name',
 *   followers: { 'total': 10, 'href': null }
 *   artist: 'AN ARTIST'
 * }
 * Schema { 
 *   name: 'name',
 *   followers: {
 *     properties: {
 *       properties: {
 *         name: 'total'
 *       }
 *     }
 *   }
 * }
 * 
 * will output {
 *   name: 'My name',
 *   followers: {
 *     total: 10
 *   }
 * }
 *
 */
Executor.prototype._processObject = function(object, schema) {
  var self = this;
  var promises = [];
  var props = schema;

  var result = {};

  props = Array.isArray(props) ? props : [props];

  props.forEach(function(prop) {
    var name = prop.name;
    if (name in object) {
      // we have property i in object, go on
      var partial = object[name];
      var called = self._executeCalls(object[name], prop.calls);
      if (Array.isArray(called)) {
        // create promise
        var _promise = new Promise(function(resolve, reject) {
          var _promises = [];

          var p = called.forEach(function(c) {
            return _promises.push(self._processObject(c, prop.properties.properties));
          });

          return Promise.all(_promises).then(function(results) {
            result[name] = results;
            resolve();
          });
        });
        promises.push(_promise);
      } else if (typeof called === 'object') {
        var promise = self._processObject(called, prop.properties.properties, self._edges, self._context).then(function(r) {
          result[name] = r;
        });
        promises.push(promise);
      } else {
        result[name] = called;
      }
    } else {
      if (name in self._edges) {
        promises.push(self._edges[name].call(null, self._context).then(function(r) {
          if (prop.properties) {
            result[name] = r;
            return self._processObject(result, prop, self._edges, self._context);
          } else {
            return r;
          }
        }).then(function(res) {
          result[name] = res[name];
        }));
      }
    }
  });

  return Promise.all(promises).then(function() {
    return result;
  });
};

Executor.prototype._executeCalls = function (object, calls) {
  if (!calls) {
    return object;
  } else {
    var array = object;
    if (!Array.isArray(array)) {
      array = array.items;
    }
    if (calls[0].call === 'first') {
      return array.slice(0, +calls[0].parameters[0]);
    }
  }
  return {};
};


module.exports = Executor;