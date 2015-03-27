var utils = {
  filter: function(original, props) {
    if (!props) {
      return {};
    }

    function executeCalls(object, calls) {
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
    }

    function processObject(object, schema) {
      var props = schema;
      for (var i in object) {
        var prop = null;
        if (Array.isArray(props)) {
          // todo: this can be rewritten to improve performance!
          prop = props.filter(function(p) { return p.name === i; });
          if (prop.length === 1) {
            prop = prop[0];
          } else {
            prop = null;
          }
        } else {
          if (props.name === i) {
            prop = props;
          }
        }

        if (prop) {
          if (typeof object[i] === 'object') {
            var called = executeCalls(object[i], prop.calls);
            if (Array.isArray(called)) {
              object[i] = called.map(function(c) { return utils.filter(c, prop.properties.properties);});
            } else {
              object[i] = utils.filter(called, prop.properties);
            }
          } else {
            // we keep it
          }

        } else {
          delete object[i];
        }
      }
      return object;
    }

    return processObject(original, props);
  }
};

module.exports = utils;