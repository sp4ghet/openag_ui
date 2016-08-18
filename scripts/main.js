(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = argsArray;

function argsArray(fun) {
  return function () {
    var len = arguments.length;
    if (len) {
      var args = [];
      var i = -1;
      while (++i < len) {
        args[i] = arguments[i];
      }
      return fun.call(this, args);
    } else {
      return fun.call(this, []);
    }
  };
}
},{}],2:[function(require,module,exports){
/* @flow */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var empty = Object.freeze([]);
exports.empty = empty;
exports["default"] = empty;

},{}],3:[function(require,module,exports){
/* @flow */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var blank = Object.freeze({});
exports.blank = blank;
exports["default"] = blank;

},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout.call(null, cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout.call(null, timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout.call(null, drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
// https://d3js.org/d3-array/ Version 1.0.0. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;
  var bisectLeft = ascendingBisect.left;

  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function number(x) {
    return x === null ? NaN : +x;
  }

  function variance(array, f) {
    var n = array.length,
        m = 0,
        a,
        d,
        s = 0,
        i = -1,
        j = 0;

    if (f == null) {
      while (++i < n) {
        if (!isNaN(a = number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    else {
      while (++i < n) {
        if (!isNaN(a = number(f(array[i], i, array)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    if (j > 1) return s / (j - 1);
  }

  function deviation(array, f) {
    var v = variance(array, f);
    return v ? Math.sqrt(v) : v;
  }

  function extent(array, f) {
    var i = -1,
        n = array.length,
        a,
        b,
        c;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    return [a, c];
  }

  var array = Array.prototype;

  var slice = array.slice;
  var map = array.map;

  function constant(x) {
    return function() {
      return x;
    };
  }

  function identity(x) {
    return x;
  }

  function range(start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  }

  var e10 = Math.sqrt(50);
  var e5 = Math.sqrt(10);
  var e2 = Math.sqrt(2);
  function ticks(start, stop, count) {
    var step = tickStep(start, stop, count);
    return range(
      Math.ceil(start / step) * step,
      Math.floor(stop / step) * step + step / 2, // inclusive
      step
    );
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  function sturges(values) {
    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
  }

  function histogram() {
    var value = identity,
        domain = extent,
        threshold = sturges;

    function histogram(data) {
      var i,
          n = data.length,
          x,
          values = new Array(n);

      for (i = 0; i < n; ++i) {
        values[i] = value(data[i], i, data);
      }

      var xz = domain(values),
          x0 = xz[0],
          x1 = xz[1],
          tz = threshold(values, x0, x1);

      // Convert number of thresholds into uniform thresholds.
      if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);

      // Remove any thresholds outside the domain.
      var m = tz.length;
      while (tz[0] <= x0) tz.shift(), --m;
      while (tz[m - 1] >= x1) tz.pop(), --m;

      var bins = new Array(m + 1),
          bin;

      // Initialize bins.
      for (i = 0; i <= m; ++i) {
        bin = bins[i] = [];
        bin.x0 = i > 0 ? tz[i - 1] : x0;
        bin.x1 = i < m ? tz[i] : x1;
      }

      // Assign data to bins by value, ignoring any outside the domain.
      for (i = 0; i < n; ++i) {
        x = values[i];
        if (x0 <= x && x <= x1) {
          bins[bisectRight(tz, x, 0, m)].push(data[i]);
        }
      }

      return bins;
    }

    histogram.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
    };

    histogram.domain = function(_) {
      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
    };

    histogram.thresholds = function(_) {
      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
    };

    return histogram;
  }

  function quantile(array, p, f) {
    if (f == null) f = number;
    if (!(n = array.length)) return;
    if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
    if (p >= 1) return +f(array[n - 1], n - 1, array);
    var n,
        h = (n - 1) * p,
        i = Math.floor(h),
        a = +f(array[i], i, array),
        b = +f(array[i + 1], i + 1, array);
    return a + (b - a) * (h - i);
  }

  function freedmanDiaconis(values, min, max) {
    values = map.call(values, number).sort(ascending);
    return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
  }

  function scott(values, min, max) {
    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
  }

  function max(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
    }

    return a;
  }

  function mean(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1,
        j = n;

    if (f == null) {
      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
    }

    else {
      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
    }

    if (j) return s / j;
  }

  function median(array, f) {
    var numbers = [],
        n = array.length,
        a,
        i = -1;

    if (f == null) {
      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
    }

    else {
      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
    }

    return quantile(numbers.sort(ascending), 0.5);
  }

  function merge(arrays) {
    var n = arrays.length,
        m,
        i = -1,
        j = 0,
        merged,
        array;

    while (++i < n) j += arrays[i].length;
    merged = new Array(j);

    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }

    return merged;
  }

  function min(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (f == null) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    }

    else {
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
    }

    return a;
  }

  function pairs(array) {
    var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [p, p = array[++i]];
    return pairs;
  }

  function permute(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  }

  function scan(array, compare) {
    if (!(n = array.length)) return;
    var i = 0,
        n,
        j = 0,
        xi,
        xj = array[j];

    if (!compare) compare = ascending;

    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

    if (compare(xj, xj) === 0) return j;
  }

  function shuffle(array, i0, i1) {
    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }

    return array;
  }

  function sum(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1;

    if (f == null) {
      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
    }

    else {
      while (++i < n) if (a = +f(array[i], i, array)) s += a;
    }

    return s;
  }

  function transpose(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  }

  function length(d) {
    return d.length;
  }

  function zip() {
    return transpose(arguments);
  }

  exports.bisect = bisectRight;
  exports.bisectRight = bisectRight;
  exports.bisectLeft = bisectLeft;
  exports.ascending = ascending;
  exports.bisector = bisector;
  exports.descending = descending;
  exports.deviation = deviation;
  exports.extent = extent;
  exports.histogram = histogram;
  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
  exports.thresholdScott = scott;
  exports.thresholdSturges = sturges;
  exports.max = max;
  exports.mean = mean;
  exports.median = median;
  exports.merge = merge;
  exports.min = min;
  exports.pairs = pairs;
  exports.permute = permute;
  exports.quantile = quantile;
  exports.range = range;
  exports.scan = scan;
  exports.shuffle = shuffle;
  exports.sum = sum;
  exports.ticks = ticks;
  exports.tickStep = tickStep;
  exports.transpose = transpose;
  exports.variance = variance;
  exports.zip = zip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],7:[function(require,module,exports){
// https://d3js.org/d3-collection/ Version 1.0.0. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  var prefix = "$";

  function Map() {}

  Map.prototype = map.prototype = {
    constructor: Map,
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };

  function map(object, f) {
    var map = new Map;

    // Copy constructor.
    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function nest() {
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;

    function apply(array, depth, createResult, setResult) {
      if (depth >= keys.length) return rollup != null
          ? rollup(array) : (sortValues != null
          ? array.sort(sortValues)
          : array);

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map(),
          values,
          result = createResult();

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.each(function(values, key) {
        setResult(result, key, apply(values, depth, createResult, setResult));
      });

      return result;
    }

    function entries(map, depth) {
      if (++depth > keys.length) return map;
      var array, sortKey = sortKeys[depth - 1];
      if (rollup != null && depth >= keys.length) array = map.entries();
      else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
      return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
    }

    return nest = {
      object: function(array) { return apply(array, 0, createObject, setObject); },
      map: function(array) { return apply(array, 0, createMap, setMap); },
      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
      key: function(d) { keys.push(d); return nest; },
      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
      sortValues: function(order) { sortValues = order; return nest; },
      rollup: function(f) { rollup = f; return nest; }
    };
  }

  function createObject() {
    return {};
  }

  function setObject(object, key, value) {
    object[key] = value;
  }

  function createMap() {
    return map();
  }

  function setMap(map, key, value) {
    map.set(key, value);
  }

  function Set() {}

  var proto = map.prototype;

  Set.prototype = set.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function set(object, f) {
    var set = new Set;

    // Copy constructor.
    if (object instanceof Set) object.each(function(value) { set.add(value); });

    // Otherwise, assume it’s an array.
    else if (object) {
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);
      else while (++i < n) set.add(f(object[i], i, object));
    }

    return set;
  }

  function keys(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  }

  function values(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  }

  function entries(map) {
    var entries = [];
    for (var key in map) entries.push({key: key, value: map[key]});
    return entries;
  }

  exports.nest = nest;
  exports.set = set;
  exports.map = map;
  exports.keys = keys;
  exports.values = values;
  exports.entries = entries;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],8:[function(require,module,exports){
// https://d3js.org/d3-color/ Version 1.0.0. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reHex3 = /^#([0-9a-f]{3})$/;
  var reHex6 = /^#([0-9a-f]{6})$/;
  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  var Kn = 18;
  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;
  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var b = rgb2xyz(o.r),
        a = rgb2xyz(o.g),
        l = rgb2xyz(o.b),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);
      return new Rgb(
        xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert(this).rgb();
    }
  }));

  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;
  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  exports.color = color;
  exports.rgb = rgb;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.hcl = hcl;
  exports.cubehelix = cubehelix;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],9:[function(require,module,exports){
// https://d3js.org/d3-format/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function identity(x) {
    return x;
  }

  function formatLocale(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
        currency = locale.currency,
        decimal = locale.decimal;

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // If the original value was negative, it may be rounded to zero during
          // formatting; treat this as (positive) zero.
          if (valueNegative) {
            i = -1, n = value.length;
            valueNegative = false;
            while (++i < n) {
              if (c = value.charCodeAt(i), (48 < c && c < 58)
                  || (type === "x" && 96 < c && c < 103)
                  || (type === "X" && 64 < c && c < 71)) {
                valueNegative = true;
                break;
              }
            }
          }

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  exports.format;
  exports.formatPrefix;

  defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    exports.format = locale.format;
    exports.formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  exports.formatDefaultLocale = defaultLocale;
  exports.formatLocale = formatLocale;
  exports.formatSpecifier = formatSpecifier;
  exports.precisionFixed = precisionFixed;
  exports.precisionPrefix = precisionPrefix;
  exports.precisionRound = precisionRound;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],10:[function(require,module,exports){
// https://d3js.org/d3-interpolate/ Version 1.1.0. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-color')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Color) { 'use strict';

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function basisClosed(values) {
    var n = values.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
          v0 = values[(i + n - 1) % n],
          v1 = values[i % n],
          v2 = values[(i + 1) % n],
          v3 = values[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var rgb$1 = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb(start, end) {
      var r = color((start = d3Color.rgb(start)).r, (end = d3Color.rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = color(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = d3Color.rgb(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);
  var rgbBasisClosed = rgbSpline(basisClosed);

  function array(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(nb),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function number(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = value(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: number(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant(b)
        : (t === "number" ? number
        : t === "string" ? ((c = d3Color.color(b)) ? (b = c, rgb$1) : string)
        : b instanceof d3Color.color ? rgb$1
        : b instanceof Date ? date
        : Array.isArray(b) ? array
        : isNaN(b) ? object
        : number)(a, b);
  }

  function round(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode;
  var cssRoot;
  var cssView;
  var svgNode;
  function parseCss(value) {
    if (value === "none") return identity;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var rho = Math.SQRT2;
  var rho2 = 2;
  var rho4 = 4;
  var epsilon2 = 1e-12;
  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }

  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }

  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      }
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      }
    }

    i.duration = S * 1000;

    return i;
  }

  function hsl$1(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hsl(start)).h, (end = d3Color.hsl(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var hsl$2 = hsl$1(hue);
  var hslLong = hsl$1(nogamma);

  function lab$1(start, end) {
    var l = nogamma((start = d3Color.lab(start)).l, (end = d3Color.lab(end)).l),
        a = nogamma(start.a, end.a),
        b = nogamma(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.l = l(t);
      start.a = a(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  function hcl$1(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hcl(start)).h, (end = d3Color.hcl(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var hcl$2 = hcl$1(hue);
  var hclLong = hcl$1(nogamma);

  function cubehelix$1(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix(start, end) {
        var h = hue((start = d3Color.cubehelix(start)).h, (end = d3Color.cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix.gamma = cubehelixGamma;

      return cubehelix;
    })(1);
  }

  var cubehelix$2 = cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);

  function quantize(interpolator, n) {
    var samples = new Array(n);
    for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
    return samples;
  }

  exports.interpolate = value;
  exports.interpolateArray = array;
  exports.interpolateBasis = basis$1;
  exports.interpolateBasisClosed = basisClosed;
  exports.interpolateDate = date;
  exports.interpolateNumber = number;
  exports.interpolateObject = object;
  exports.interpolateRound = round;
  exports.interpolateString = string;
  exports.interpolateTransformCss = interpolateTransformCss;
  exports.interpolateTransformSvg = interpolateTransformSvg;
  exports.interpolateZoom = zoom;
  exports.interpolateRgb = rgb$1;
  exports.interpolateRgbBasis = rgbBasis;
  exports.interpolateRgbBasisClosed = rgbBasisClosed;
  exports.interpolateHsl = hsl$2;
  exports.interpolateHslLong = hslLong;
  exports.interpolateLab = lab$1;
  exports.interpolateHcl = hcl$2;
  exports.interpolateHclLong = hclLong;
  exports.interpolateCubehelix = cubehelix$2;
  exports.interpolateCubehelixLong = cubehelixLong;
  exports.quantize = quantize;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-color":8}],11:[function(require,module,exports){
// https://d3js.org/d3-path/ Version 1.0.0. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  var pi = Math.PI;
  var tau = 2 * pi;
  var epsilon = 1e-6;
  var tauEpsilon = tau - epsilon;
  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = [];
  }

  function path() {
    return new Path;
  }

  Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
      this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y);
    },
    closePath: function() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._.push("Z");
      }
    },
    lineTo: function(x, y) {
      this._.push("L", this._x1 = +x, ",", this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
      this._.push("Q", +x1, ",", +y1, ",", this._x1 = +x, ",", this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this._.push("C", +x1, ",", +y1, ",", +x2, ",", +y2, ",", this._x1 = +x, ",", this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._.push(
          "M", this._x1 = x1, ",", this._y1 = y1
        );
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon));

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
        this._.push(
          "L", this._x1 = x1, ",", this._y1 = y1
        );
      }

      // Otherwise, draw an arc!
      else {
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon) {
          this._.push(
            "L", x1 + t01 * x01, ",", y1 + t01 * y01
          );
        }

        this._.push(
          "A", r, ",", r, ",0,0,", +(y01 * x20 > x01 * y20), ",", this._x1 = x1 + t21 * x21, ",", this._y1 = y1 + t21 * y21
        );
      }
    },
    arc: function(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._.push(
          "M", x0, ",", y0
        );
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._.push(
          "L", x0, ",", y0
        );
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._.push(
          "A", r, ",", r, ",0,1,", cw, ",", x - dx, ",", y - dy,
          "A", r, ",", r, ",0,1,", cw, ",", this._x1 = x0, ",", this._y1 = y0
        );
      }

      // Otherwise, draw an arc!
      else {
        if (da < 0) da = da % tau + tau;
        this._.push(
          "A", r, ",", r, ",0,", +(da >= pi), ",", cw, ",", this._x1 = x + r * Math.cos(a1), ",", this._y1 = y + r * Math.sin(a1)
        );
      }
    },
    rect: function(x, y, w, h) {
      this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y, "h", +w, "v", +h, "h", -w, "Z");
    },
    toString: function() {
      return this._.join("");
    }
  };

  exports.path = path;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],12:[function(require,module,exports){
// https://d3js.org/d3-scale/ Version 1.0.2. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-collection'), require('d3-interpolate'), require('d3-format'), require('d3-time'), require('d3-time-format'), require('d3-color')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-collection', 'd3-interpolate', 'd3-format', 'd3-time', 'd3-time-format', 'd3-color'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, function (exports,d3Array,d3Collection,d3Interpolate,d3Format,d3Time,d3TimeFormat,d3Color) { 'use strict';

  var array = Array.prototype;

  var map$1 = array.map;
  var slice = array.slice;

  var implicit = {name: "implicit"};

  function ordinal(range) {
    var index = d3Collection.map(),
        domain = [],
        unknown = implicit;

    range = range == null ? [] : slice.call(range);

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = d3Collection.map();
      var i = -1, n = _.length, d, key;
      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice.call(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal()
          .domain(domain)
          .range(range)
          .unknown(unknown);
    };

    return scale;
  }

  function band() {
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        range = [0, 1],
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;

    delete scale.unknown;

    function rescale() {
      var n = domain().length,
          reverse = range[1] < range[0],
          start = range[reverse - 0],
          stop = range[1 - reverse];
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = d3Array.range(n).map(function(i) { return start + step * i; });
      return ordinalRange(reverse ? values.reverse() : values);
    }

    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.range = function(_) {
      return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = [+_[0], +_[1]], round = true, rescale();
    };

    scale.bandwidth = function() {
      return bandwidth;
    };

    scale.step = function() {
      return step;
    };

    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };

    scale.padding = function(_) {
      return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
    };

    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };

    scale.copy = function() {
      return band()
          .domain(domain())
          .range(range)
          .round(round)
          .paddingInner(paddingInner)
          .paddingOuter(paddingOuter)
          .align(align);
    };

    return rescale();
  }

  function pointish(scale) {
    var copy = scale.copy;

    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;

    scale.copy = function() {
      return pointish(copy());
    };

    return scale;
  }

  function point() {
    return pointish(band().paddingInner(1));
  }

  function constant(x) {
    return function() {
      return x;
    };
  }

  function number(x) {
    return +x;
  }

  var unit = [0, 1];

  function deinterpolate(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constant(b);
  }

  function deinterpolateClamp(deinterpolate) {
    return function(a, b) {
      var d = deinterpolate(a = +a, b = +b);
      return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
    };
  }

  function reinterpolateClamp(reinterpolate) {
    return function(a, b) {
      var r = reinterpolate(a = +a, b = +b);
      return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
    };
  }

  function bimap(domain, range, deinterpolate, reinterpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
    else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, deinterpolate, reinterpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = d3Array.bisect(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp());
  }

  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
  function continuous(deinterpolate$$, reinterpolate) {
    var domain = unit,
        range = unit,
        interpolate = d3Interpolate.interpolate,
        clamp = false,
        piecewise,
        output,
        input;

    function rescale() {
      piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate$$) : deinterpolate$$, interpolate)))(+x);
    }

    scale.invert = function(y) {
      return (input || (input = piecewise(range, domain, deinterpolate, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = map$1.call(_, number), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = slice.call(_), interpolate = d3Interpolate.interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };

    return rescale();
  }

  function tickFormat(domain, count, specifier) {
    var start = domain[0],
        stop = domain[domain.length - 1],
        step = d3Array.tickStep(start, stop, count == null ? 10 : count),
        precision;
    specifier = d3Format.formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = d3Format.precisionPrefix(step, value))) specifier.precision = precision;
        return d3Format.formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = d3Format.precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = d3Format.precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return d3Format.format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return d3Array.ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain(), count, specifier);
    };

    scale.nice = function(count) {
      var d = domain(),
          i = d.length - 1,
          n = count == null ? 10 : count,
          start = d[0],
          stop = d[i],
          step = d3Array.tickStep(start, stop, n);

      if (step) {
        step = d3Array.tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
        d[0] = Math.floor(start / step) * step;
        d[i] = Math.ceil(stop / step) * step;
        domain(d);
      }

      return scale;
    };

    return scale;
  }

  function linear() {
    var scale = continuous(deinterpolate, d3Interpolate.interpolateNumber);

    scale.copy = function() {
      return copy(scale, linear());
    };

    return linearish(scale);
  }

  function identity() {
    var domain = [0, 1];

    function scale(x) {
      return +x;
    }

    scale.invert = scale;

    scale.domain = scale.range = function(_) {
      return arguments.length ? (domain = map$1.call(_, number), scale) : domain.slice();
    };

    scale.copy = function() {
      return identity().domain(domain);
    };

    return linearish(scale);
  }

  function nice(domain, interval) {
    domain = domain.slice();

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;

    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }

    domain[i0] = interval.floor(x0);
    domain[i1] = interval.ceil(x1);
    return domain;
  }

  function deinterpolate$1(a, b) {
    return (b = Math.log(b / a))
        ? function(x) { return Math.log(x / a) / b; }
        : constant(b);
  }

  function reinterpolate(a, b) {
    return a < 0
        ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
        : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
  }

  function pow10(x) {
    return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
  }

  function powp(base) {
    return base === 10 ? pow10
        : base === Math.E ? Math.exp
        : function(x) { return Math.pow(base, x); };
  }

  function logp(base) {
    return base === Math.E ? Math.log
        : base === 10 && Math.log10
        || base === 2 && Math.log2
        || (base = Math.log(base), function(x) { return Math.log(x) / base; });
  }

  function reflect(f) {
    return function(x) {
      return -f(-x);
    };
  }

  function log() {
    var scale = continuous(deinterpolate$1, reinterpolate).domain([1, 10]),
        domain = scale.domain,
        base = 10,
        logs = logp(10),
        pows = powp(10);

    function rescale() {
      logs = logp(base), pows = powp(base);
      if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
      return scale;
    }

    scale.base = function(_) {
      return arguments.length ? (base = +_, rescale()) : base;
    };

    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.ticks = function(count) {
      var d = domain(),
          u = d[0],
          v = d[d.length - 1],
          r;

      if (r = v < u) i = u, u = v, v = i;

      var i = logs(u),
          j = logs(v),
          p,
          k,
          t,
          n = count == null ? 10 : +count,
          z = [];

      if (!(base % 1) && j - i < n) {
        i = Math.round(i) - 1, j = Math.round(j) + 1;
        if (u > 0) for (; i < j; ++i) {
          for (k = 1, p = pows(i); k < base; ++k) {
            t = p * k;
            if (t < u) continue;
            if (t > v) break;
            z.push(t);
          }
        } else for (; i < j; ++i) {
          for (k = base - 1, p = pows(i); k >= 1; --k) {
            t = p * k;
            if (t < u) continue;
            if (t > v) break;
            z.push(t);
          }
        }
      } else {
        z = d3Array.ticks(i, j, Math.min(j - i, n)).map(pows);
      }

      return r ? z.reverse() : z;
    };

    scale.tickFormat = function(count, specifier) {
      if (specifier == null) specifier = base === 10 ? ".0e" : ",";
      if (typeof specifier !== "function") specifier = d3Format.format(specifier);
      if (count === Infinity) return specifier;
      if (count == null) count = 10;
      var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
      return function(d) {
        var i = d / pows(Math.round(logs(d)));
        if (i * base < base - 0.5) i *= base;
        return i <= k ? specifier(d) : "";
      };
    };

    scale.nice = function() {
      return domain(nice(domain(), {
        floor: function(x) { return pows(Math.floor(logs(x))); },
        ceil: function(x) { return pows(Math.ceil(logs(x))); }
      }));
    };

    scale.copy = function() {
      return copy(scale, log().base(base));
    };

    return scale;
  }

  function raise(x, exponent) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function pow() {
    var exponent = 1,
        scale = continuous(deinterpolate, reinterpolate),
        domain = scale.domain;

    function deinterpolate(a, b) {
      return (b = raise(b, exponent) - (a = raise(a, exponent)))
          ? function(x) { return (raise(x, exponent) - a) / b; }
          : constant(b);
    }

    function reinterpolate(a, b) {
      b = raise(b, exponent) - (a = raise(a, exponent));
      return function(t) { return raise(a + b * t, 1 / exponent); };
    }

    scale.exponent = function(_) {
      return arguments.length ? (exponent = +_, domain(domain())) : exponent;
    };

    scale.copy = function() {
      return copy(scale, pow().exponent(exponent));
    };

    return linearish(scale);
  }

  function sqrt() {
    return pow().exponent(0.5);
  }

  function quantile$1() {
    var domain = [],
        range = [],
        thresholds = [];

    function rescale() {
      var i = 0, n = Math.max(1, range.length);
      thresholds = new Array(n - 1);
      while (++i < n) thresholds[i - 1] = d3Array.quantile(domain, i / n);
      return scale;
    }

    function scale(x) {
      if (!isNaN(x = +x)) return range[d3Array.bisect(thresholds, x)];
    }

    scale.invertExtent = function(y) {
      var i = range.indexOf(y);
      return i < 0 ? [NaN, NaN] : [
        i > 0 ? thresholds[i - 1] : domain[0],
        i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
      ];
    };

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [];
      for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
      domain.sort(d3Array.ascending);
      return rescale();
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
    };

    scale.quantiles = function() {
      return thresholds.slice();
    };

    scale.copy = function() {
      return quantile$1()
          .domain(domain)
          .range(range);
    };

    return scale;
  }

  function quantize() {
    var x0 = 0,
        x1 = 1,
        n = 1,
        domain = [0.5],
        range = [0, 1];

    function scale(x) {
      if (x <= x) return range[d3Array.bisect(domain, x, 0, n)];
    }

    function rescale() {
      var i = -1;
      domain = new Array(n);
      while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
      return scale;
    }

    scale.domain = function(_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
    };

    scale.range = function(_) {
      return arguments.length ? (n = (range = slice.call(_)).length - 1, rescale()) : range.slice();
    };

    scale.invertExtent = function(y) {
      var i = range.indexOf(y);
      return i < 0 ? [NaN, NaN]
          : i < 1 ? [x0, domain[0]]
          : i >= n ? [domain[n - 1], x1]
          : [domain[i - 1], domain[i]];
    };

    scale.copy = function() {
      return quantize()
          .domain([x0, x1])
          .range(range);
    };

    return linearish(scale);
  }

  function threshold() {
    var domain = [0.5],
        range = [0, 1],
        n = 1;

    function scale(x) {
      if (x <= x) return range[d3Array.bisect(domain, x, 0, n)];
    }

    scale.domain = function(_) {
      return arguments.length ? (domain = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
    };

    scale.invertExtent = function(y) {
      var i = range.indexOf(y);
      return [domain[i - 1], domain[i]];
    };

    scale.copy = function() {
      return threshold()
          .domain(domain)
          .range(range);
    };

    return scale;
  }

  var durationSecond = 1000;
  var durationMinute = durationSecond * 60;
  var durationHour = durationMinute * 60;
  var durationDay = durationHour * 24;
  var durationWeek = durationDay * 7;
  var durationMonth = durationDay * 30;
  var durationYear = durationDay * 365;
  function date(t) {
    return new Date(t);
  }

  function number$1(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }

  function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
    var scale = continuous(deinterpolate, d3Interpolate.interpolateNumber),
        invert = scale.invert,
        domain = scale.domain;

    var formatMillisecond = format(".%L"),
        formatSecond = format(":%S"),
        formatMinute = format("%I:%M"),
        formatHour = format("%I %p"),
        formatDay = format("%a %d"),
        formatWeek = format("%b %d"),
        formatMonth = format("%B"),
        formatYear = format("%Y");

    var tickIntervals = [
      [second,  1,      durationSecond],
      [second,  5,  5 * durationSecond],
      [second, 15, 15 * durationSecond],
      [second, 30, 30 * durationSecond],
      [minute,  1,      durationMinute],
      [minute,  5,  5 * durationMinute],
      [minute, 15, 15 * durationMinute],
      [minute, 30, 30 * durationMinute],
      [  hour,  1,      durationHour  ],
      [  hour,  3,  3 * durationHour  ],
      [  hour,  6,  6 * durationHour  ],
      [  hour, 12, 12 * durationHour  ],
      [   day,  1,      durationDay   ],
      [   day,  2,  2 * durationDay   ],
      [  week,  1,      durationWeek  ],
      [ month,  1,      durationMonth ],
      [ month,  3,  3 * durationMonth ],
      [  year,  1,      durationYear  ]
    ];

    function tickFormat(date) {
      return (second(date) < date ? formatMillisecond
          : minute(date) < date ? formatSecond
          : hour(date) < date ? formatMinute
          : day(date) < date ? formatHour
          : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
          : year(date) < date ? formatMonth
          : formatYear)(date);
    }

    function tickInterval(interval, start, stop, step) {
      if (interval == null) interval = 10;

      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // Otherwise, assume interval is already a time interval and use it.
      if (typeof interval === "number") {
        var target = Math.abs(stop - start) / interval,
            i = d3Array.bisector(function(i) { return i[2]; }).right(tickIntervals, target);
        if (i === tickIntervals.length) {
          step = d3Array.tickStep(start / durationYear, stop / durationYear, interval);
          interval = year;
        } else if (i) {
          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
          step = i[1];
          interval = i[0];
        } else {
          step = d3Array.tickStep(start, stop, interval);
          interval = millisecond;
        }
      }

      return step == null ? interval : interval.every(step);
    }

    scale.invert = function(y) {
      return new Date(invert(y));
    };

    scale.domain = function(_) {
      return arguments.length ? domain(map$1.call(_, number$1)) : domain().map(date);
    };

    scale.ticks = function(interval, step) {
      var d = domain(),
          t0 = d[0],
          t1 = d[d.length - 1],
          r = t1 < t0,
          t;
      if (r) t = t0, t0 = t1, t1 = t;
      t = tickInterval(interval, t0, t1, step);
      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
      return r ? t.reverse() : t;
    };

    scale.tickFormat = function(count, specifier) {
      return specifier == null ? tickFormat : format(specifier);
    };

    scale.nice = function(interval, step) {
      var d = domain();
      return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
          ? domain(nice(d, interval))
          : scale;
    };

    scale.copy = function() {
      return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
    };

    return scale;
  }

  function time() {
    return calendar(d3Time.timeYear, d3Time.timeMonth, d3Time.timeWeek, d3Time.timeDay, d3Time.timeHour, d3Time.timeMinute, d3Time.timeSecond, d3Time.timeMillisecond, d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
  }

  function utcTime() {
    return calendar(d3Time.utcYear, d3Time.utcMonth, d3Time.utcWeek, d3Time.utcDay, d3Time.utcHour, d3Time.utcMinute, d3Time.utcSecond, d3Time.utcMillisecond, d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
  }

  function colors(s) {
    return s.match(/.{6}/g).map(function(x) {
      return "#" + x;
    });
  }

  var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

  var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

  var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

  var cubehelix$1 = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(300, 0.5, 0.0), d3Color.cubehelix(-240, 0.5, 1.0));

  var warm = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(-100, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

  var cool = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(260, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

  var rainbow = d3Color.cubehelix();

  function rainbow$1(t) {
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    rainbow.h = 360 * t - 100;
    rainbow.s = 1.5 - 1.5 * ts;
    rainbow.l = 0.8 - 0.9 * ts;
    return rainbow + "";
  }

  function ramp(range) {
    var n = range.length;
    return function(t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }

  var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

  var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

  var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

  var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

  function sequential(interpolator) {
    var x0 = 0,
        x1 = 1,
        clamp = false;

    function scale(x) {
      var t = (x - x0) / (x1 - x0);
      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
    }

    scale.domain = function(_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, scale) : clamp;
    };

    scale.interpolator = function(_) {
      return arguments.length ? (interpolator = _, scale) : interpolator;
    };

    scale.copy = function() {
      return sequential(interpolator).domain([x0, x1]).clamp(clamp);
    };

    return linearish(scale);
  }

  exports.scaleBand = band;
  exports.scalePoint = point;
  exports.scaleIdentity = identity;
  exports.scaleLinear = linear;
  exports.scaleLog = log;
  exports.scaleOrdinal = ordinal;
  exports.scaleImplicit = implicit;
  exports.scalePow = pow;
  exports.scaleSqrt = sqrt;
  exports.scaleQuantile = quantile$1;
  exports.scaleQuantize = quantize;
  exports.scaleThreshold = threshold;
  exports.scaleTime = time;
  exports.scaleUtc = utcTime;
  exports.schemeCategory10 = category10;
  exports.schemeCategory20b = category20b;
  exports.schemeCategory20c = category20c;
  exports.schemeCategory20 = category20;
  exports.interpolateCubehelixDefault = cubehelix$1;
  exports.interpolateRainbow = rainbow$1;
  exports.interpolateWarm = warm;
  exports.interpolateCool = cool;
  exports.interpolateViridis = viridis;
  exports.interpolateMagma = magma;
  exports.interpolateInferno = inferno;
  exports.interpolatePlasma = plasma;
  exports.scaleSequential = sequential;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-array":6,"d3-collection":7,"d3-color":8,"d3-format":9,"d3-interpolate":10,"d3-time":15,"d3-time-format":14}],13:[function(require,module,exports){
// https://d3js.org/d3-shape/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-path'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Path) { 'use strict';

  function constant(x) {
    return function constant() {
      return x;
    };
  }

  var epsilon = 1e-12;
  var pi = Math.PI;
  var halfPi = pi / 2;
  var tau = 2 * pi;

  function arcInnerRadius(d) {
    return d.innerRadius;
  }

  function arcOuterRadius(d) {
    return d.outerRadius;
  }

  function arcStartAngle(d) {
    return d.startAngle;
  }

  function arcEndAngle(d) {
    return d.endAngle;
  }

  function arcPadAngle(d) {
    return d && d.padAngle; // Note: optional!
  }

  function asin(x) {
    return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
  }

  function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
    var x10 = x1 - x0, y10 = y1 - y0,
        x32 = x3 - x2, y32 = y3 - y2,
        t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
    return [x0 + t * x10, y0 + t * y10];
  }

  // Compute perpendicular offset line of length rc.
  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
    var x01 = x0 - x1,
        y01 = y0 - y1,
        lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
        ox = lo * y01,
        oy = -lo * x01,
        x11 = x0 + ox,
        y11 = y0 + oy,
        x10 = x1 + ox,
        y10 = y1 + oy,
        x00 = (x11 + x10) / 2,
        y00 = (y11 + y10) / 2,
        dx = x10 - x11,
        dy = y10 - y11,
        d2 = dx * dx + dy * dy,
        r = r1 - rc,
        D = x11 * y10 - x10 * y11,
        d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
        cx0 = (D * dy - dx * d) / d2,
        cy0 = (-D * dx - dy * d) / d2,
        cx1 = (D * dy + dx * d) / d2,
        cy1 = (-D * dx + dy * d) / d2,
        dx0 = cx0 - x00,
        dy0 = cy0 - y00,
        dx1 = cx1 - x00,
        dy1 = cy1 - y00;

    // Pick the closer of the two intersection points.
    // TODO Is there a faster way to determine which intersection to use?
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

    return {
      cx: cx0,
      cy: cy0,
      x01: -ox,
      y01: -oy,
      x11: cx0 * (r1 / r - 1),
      y11: cy0 * (r1 / r - 1)
    };
  }

  function arc() {
    var innerRadius = arcInnerRadius,
        outerRadius = arcOuterRadius,
        cornerRadius = constant(0),
        padRadius = null,
        startAngle = arcStartAngle,
        endAngle = arcEndAngle,
        padAngle = arcPadAngle,
        context = null;

    function arc() {
      var buffer,
          r,
          r0 = +innerRadius.apply(this, arguments),
          r1 = +outerRadius.apply(this, arguments),
          a0 = startAngle.apply(this, arguments) - halfPi,
          a1 = endAngle.apply(this, arguments) - halfPi,
          da = Math.abs(a1 - a0),
          cw = a1 > a0;

      if (!context) context = buffer = d3Path.path();

      // Ensure that the outer radius is always larger than the inner radius.
      if (r1 < r0) r = r1, r1 = r0, r0 = r;

      // Is it a point?
      if (!(r1 > epsilon)) context.moveTo(0, 0);

      // Or is it a circle or annulus?
      else if (da > tau - epsilon) {
        context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon) {
          context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      }

      // Or is it a circular or annular sector?
      else {
        var a01 = a0,
            a11 = a1,
            a00 = a0,
            a10 = a1,
            da0 = da,
            da1 = da,
            ap = padAngle.apply(this, arguments) / 2,
            rp = (ap > epsilon) && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
            rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
            rc0 = rc,
            rc1 = rc,
            t0,
            t1;

        // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
        if (rp > epsilon) {
          var p0 = asin(rp / r0 * Math.sin(ap)),
              p1 = asin(rp / r1 * Math.sin(ap));
          if ((da0 -= p0 * 2) > epsilon) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
          else da0 = 0, a00 = a10 = (a0 + a1) / 2;
          if ((da1 -= p1 * 2) > epsilon) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
          else da1 = 0, a01 = a11 = (a0 + a1) / 2;
        }

        var x01 = r1 * Math.cos(a01),
            y01 = r1 * Math.sin(a01),
            x10 = r0 * Math.cos(a10),
            y10 = r0 * Math.sin(a10);

        // Apply rounded corners?
        if (rc > epsilon) {
          var x11 = r1 * Math.cos(a11),
              y11 = r1 * Math.sin(a11),
              x00 = r0 * Math.cos(a00),
              y00 = r0 * Math.sin(a00);

          // Restrict the corner radius according to the sector angle.
          if (da < pi) {
            var oc = da0 > epsilon ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                ax = x01 - oc[0],
                ay = y01 - oc[1],
                bx = x11 - oc[0],
                by = y11 - oc[1],
                kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
            rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
          }
        }

        // Is the sector collapsed to a line?
        if (!(da1 > epsilon)) context.moveTo(x01, y01);

        // Does the sector’s outer ring have rounded corners?
        else if (rc1 > epsilon) {
          t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
          t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

          context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

          // Have the corners merged?
          if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

          // Otherwise, draw the two corners and the ring.
          else {
            context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
            context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
          }
        }

        // Or is the outer ring just a circular arc?
        else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

        // Is there no inner ring, and it’s a circular sector?
        // Or perhaps it’s an annular sector collapsed due to padding?
        if (!(r0 > epsilon) || !(da0 > epsilon)) context.lineTo(x10, y10);

        // Does the sector’s inner ring (or point) have rounded corners?
        else if (rc0 > epsilon) {
          t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
          t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

          context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

          // Have the corners merged?
          if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

          // Otherwise, draw the two corners and the ring.
          else {
            context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
            context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
          }
        }

        // Or is the inner ring just a circular arc?
        else context.arc(0, 0, r0, a10, a00, cw);
      }

      context.closePath();

      if (buffer) return context = null, buffer + "" || null;
    }

    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
          a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi / 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    };

    arc.innerRadius = function(_) {
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
    };

    arc.outerRadius = function(_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
    };

    arc.cornerRadius = function(_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
    };

    arc.padRadius = function(_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
    };

    arc.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
    };

    arc.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
    };

    arc.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
    };

    arc.context = function(_) {
      return arguments.length ? ((context = _ == null ? null : _), arc) : context;
    };

    return arc;
  }

  function Linear(context) {
    this._context = context;
  }

  Linear.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: this._context.lineTo(x, y); break;
      }
    }
  };

  function curveLinear(context) {
    return new Linear(context);
  }

  function x(p) {
    return p[0];
  }

  function y(p) {
    return p[1];
  }

  function line() {
    var x$$ = x,
        y$$ = y,
        defined = constant(true),
        context = null,
        curve = curveLinear,
        output = null;

    function line(data) {
      var i,
          n = data.length,
          d,
          defined0 = false,
          buffer;

      if (context == null) output = curve(buffer = d3Path.path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) output.lineStart();
          else output.lineEnd();
        }
        if (defined0) output.point(+x$$(d, i, data), +y$$(d, i, data));
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    line.x = function(_) {
      return arguments.length ? (x$$ = typeof _ === "function" ? _ : constant(+_), line) : x$$;
    };

    line.y = function(_) {
      return arguments.length ? (y$$ = typeof _ === "function" ? _ : constant(+_), line) : y$$;
    };

    line.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
    };

    line.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    };

    line.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    };

    return line;
  }

  function area() {
    var x0 = x,
        x1 = null,
        y0 = constant(0),
        y1 = y,
        defined = constant(true),
        context = null,
        curve = curveLinear,
        output = null;

    function area(data) {
      var i,
          j,
          k,
          n = data.length,
          d,
          defined0 = false,
          buffer,
          x0z = new Array(n),
          y0z = new Array(n);

      if (context == null) output = curve(buffer = d3Path.path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) {
            j = i;
            output.areaStart();
            output.lineStart();
          } else {
            output.lineEnd();
            output.lineStart();
            for (k = i - 1; k >= j; --k) {
              output.point(x0z[k], y0z[k]);
            }
            output.lineEnd();
            output.areaEnd();
          }
        }
        if (defined0) {
          x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
          output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
        }
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    function arealine() {
      return line().defined(defined).curve(curve).context(context);
    }

    area.x = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), x1 = null, area) : x0;
    };

    area.x0 = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), area) : x0;
    };

    area.x1 = function(_) {
      return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : x1;
    };

    area.y = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), y1 = null, area) : y0;
    };

    area.y0 = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), area) : y0;
    };

    area.y1 = function(_) {
      return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : y1;
    };

    area.lineX0 =
    area.lineY0 = function() {
      return arealine().x(x0).y(y0);
    };

    area.lineY1 = function() {
      return arealine().x(x0).y(y1);
    };

    area.lineX1 = function() {
      return arealine().x(x1).y(y0);
    };

    area.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), area) : defined;
    };

    area.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
    };

    area.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
    };

    return area;
  }

  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function identity(d) {
    return d;
  }

  function pie() {
    var value = identity,
        sortValues = descending,
        sort = null,
        startAngle = constant(0),
        endAngle = constant(tau),
        padAngle = constant(0);

    function pie(data) {
      var i,
          n = data.length,
          j,
          k,
          sum = 0,
          index = new Array(n),
          arcs = new Array(n),
          a0 = +startAngle.apply(this, arguments),
          da = Math.min(tau, Math.max(-tau, endAngle.apply(this, arguments) - a0)),
          a1,
          p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
          pa = p * (da < 0 ? -1 : 1),
          v;

      for (i = 0; i < n; ++i) {
        if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
          sum += v;
        }
      }

      // Optionally sort the arcs by previously-computed values or by data.
      if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
      else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

      // Compute the arcs! They are stored in the original data's order.
      for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
        j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
          data: data[j],
          index: i,
          value: v,
          startAngle: a0,
          endAngle: a1,
          padAngle: p
        };
      }

      return arcs;
    }

    pie.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
    };

    pie.sortValues = function(_) {
      return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
    };

    pie.sort = function(_) {
      return arguments.length ? (sort = _, sortValues = null, pie) : sort;
    };

    pie.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
    };

    pie.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
    };

    pie.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
    };

    return pie;
  }

  var curveRadialLinear = curveRadial(curveLinear);

  function Radial(curve) {
    this._curve = curve;
  }

  Radial.prototype = {
    areaStart: function() {
      this._curve.areaStart();
    },
    areaEnd: function() {
      this._curve.areaEnd();
    },
    lineStart: function() {
      this._curve.lineStart();
    },
    lineEnd: function() {
      this._curve.lineEnd();
    },
    point: function(a, r) {
      this._curve.point(r * Math.sin(a), r * -Math.cos(a));
    }
  };

  function curveRadial(curve) {

    function radial(context) {
      return new Radial(curve(context));
    }

    radial._curve = curve;

    return radial;
  }

  function radialLine(l) {
    var c = l.curve;

    l.angle = l.x, delete l.x;
    l.radius = l.y, delete l.y;

    l.curve = function(_) {
      return arguments.length ? c(curveRadial(_)) : c()._curve;
    };

    return l;
  }

  function radialLine$1() {
    return radialLine(line().curve(curveRadialLinear));
  }

  function radialArea() {
    var a = area().curve(curveRadialLinear),
        c = a.curve,
        x0 = a.lineX0,
        x1 = a.lineX1,
        y0 = a.lineY0,
        y1 = a.lineY1;

    a.angle = a.x, delete a.x;
    a.startAngle = a.x0, delete a.x0;
    a.endAngle = a.x1, delete a.x1;
    a.radius = a.y, delete a.y;
    a.innerRadius = a.y0, delete a.y0;
    a.outerRadius = a.y1, delete a.y1;
    a.lineStartAngle = function() { return radialLine(x0()); }, delete a.lineX0;
    a.lineEndAngle = function() { return radialLine(x1()); }, delete a.lineX1;
    a.lineInnerRadius = function() { return radialLine(y0()); }, delete a.lineY0;
    a.lineOuterRadius = function() { return radialLine(y1()); }, delete a.lineY1;

    a.curve = function(_) {
      return arguments.length ? c(curveRadial(_)) : c()._curve;
    };

    return a;
  }

  var circle = {
    draw: function(context, size) {
      var r = Math.sqrt(size / pi);
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau);
    }
  };

  var cross = {
    draw: function(context, size) {
      var r = Math.sqrt(size / 5) / 2;
      context.moveTo(-3 * r, -r);
      context.lineTo(-r, -r);
      context.lineTo(-r, -3 * r);
      context.lineTo(r, -3 * r);
      context.lineTo(r, -r);
      context.lineTo(3 * r, -r);
      context.lineTo(3 * r, r);
      context.lineTo(r, r);
      context.lineTo(r, 3 * r);
      context.lineTo(-r, 3 * r);
      context.lineTo(-r, r);
      context.lineTo(-3 * r, r);
      context.closePath();
    }
  };

  var tan30 = Math.sqrt(1 / 3);
  var tan30_2 = tan30 * 2;
  var diamond = {
    draw: function(context, size) {
      var y = Math.sqrt(size / tan30_2),
          x = y * tan30;
      context.moveTo(0, -y);
      context.lineTo(x, 0);
      context.lineTo(0, y);
      context.lineTo(-x, 0);
      context.closePath();
    }
  };

  var ka = 0.89081309152928522810;
  var kr = Math.sin(pi / 10) / Math.sin(7 * pi / 10);
  var kx = Math.sin(tau / 10) * kr;
  var ky = -Math.cos(tau / 10) * kr;
  var star = {
    draw: function(context, size) {
      var r = Math.sqrt(size * ka),
          x = kx * r,
          y = ky * r;
      context.moveTo(0, -r);
      context.lineTo(x, y);
      for (var i = 1; i < 5; ++i) {
        var a = tau * i / 5,
            c = Math.cos(a),
            s = Math.sin(a);
        context.lineTo(s * r, -c * r);
        context.lineTo(c * x - s * y, s * x + c * y);
      }
      context.closePath();
    }
  };

  var square = {
    draw: function(context, size) {
      var w = Math.sqrt(size),
          x = -w / 2;
      context.rect(x, x, w, w);
    }
  };

  var sqrt3 = Math.sqrt(3);

  var triangle = {
    draw: function(context, size) {
      var y = -Math.sqrt(size / (sqrt3 * 3));
      context.moveTo(0, y * 2);
      context.lineTo(-sqrt3 * y, -y);
      context.lineTo(sqrt3 * y, -y);
      context.closePath();
    }
  };

  var c = -0.5;
  var s = Math.sqrt(3) / 2;
  var k = 1 / Math.sqrt(12);
  var a = (k / 2 + 1) * 3;
  var wye = {
    draw: function(context, size) {
      var r = Math.sqrt(size / a),
          x0 = r / 2,
          y0 = r * k,
          x1 = x0,
          y1 = r * k + r,
          x2 = -x1,
          y2 = y1;
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
      context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
      context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
      context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
      context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
      context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
      context.closePath();
    }
  };

  var symbols = [
    circle,
    cross,
    diamond,
    square,
    star,
    triangle,
    wye
  ];

  function symbol() {
    var type = constant(circle),
        size = constant(64),
        context = null;

    function symbol() {
      var buffer;
      if (!context) context = buffer = d3Path.path();
      type.apply(this, arguments).draw(context, +size.apply(this, arguments));
      if (buffer) return context = null, buffer + "" || null;
    }

    symbol.type = function(_) {
      return arguments.length ? (type = typeof _ === "function" ? _ : constant(_), symbol) : type;
    };

    symbol.size = function(_) {
      return arguments.length ? (size = typeof _ === "function" ? _ : constant(+_), symbol) : size;
    };

    symbol.context = function(_) {
      return arguments.length ? (context = _ == null ? null : _, symbol) : context;
    };

    return symbol;
  }

  function noop() {}

  function point(that, x, y) {
    that._context.bezierCurveTo(
      (2 * that._x0 + that._x1) / 3,
      (2 * that._y0 + that._y1) / 3,
      (that._x0 + 2 * that._x1) / 3,
      (that._y0 + 2 * that._y1) / 3,
      (that._x0 + 4 * that._x1 + x) / 6,
      (that._y0 + 4 * that._y1 + y) / 6
    );
  }

  function Basis(context) {
    this._context = context;
  }

  Basis.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 3: point(this, this._x1, this._y1); // proceed
        case 2: this._context.lineTo(this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
        default: point(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function basis(context) {
    return new Basis(context);
  }

  function BasisClosed(context) {
    this._context = context;
  }

  BasisClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x2, this._y2);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
        case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
        case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
        default: point(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function basisClosed(context) {
    return new BasisClosed(context);
  }

  function BasisOpen(context) {
    this._context = context;
  }

  BasisOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
        case 3: this._point = 4; // proceed
        default: point(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function basisOpen(context) {
    return new BasisOpen(context);
  }

  function Bundle(context, beta) {
    this._basis = new Basis(context);
    this._beta = beta;
  }

  Bundle.prototype = {
    lineStart: function() {
      this._x = [];
      this._y = [];
      this._basis.lineStart();
    },
    lineEnd: function() {
      var x = this._x,
          y = this._y,
          j = x.length - 1;

      if (j > 0) {
        var x0 = x[0],
            y0 = y[0],
            dx = x[j] - x0,
            dy = y[j] - y0,
            i = -1,
            t;

        while (++i <= j) {
          t = i / j;
          this._basis.point(
            this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
            this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
          );
        }
      }

      this._x = this._y = null;
      this._basis.lineEnd();
    },
    point: function(x, y) {
      this._x.push(+x);
      this._y.push(+y);
    }
  };

  var bundle = (function custom(beta) {

    function bundle(context) {
      return beta === 1 ? new Basis(context) : new Bundle(context, beta);
    }

    bundle.beta = function(beta) {
      return custom(+beta);
    };

    return bundle;
  })(0.85);

  function point$1(that, x, y) {
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x),
      that._y2 + that._k * (that._y1 - y),
      that._x2,
      that._y2
    );
  }

  function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  Cardinal.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: point$1(this, this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
        case 2: this._point = 3; // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var cardinal = (function custom(tension) {

    function cardinal(context) {
      return new Cardinal(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalClosed(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var cardinalClosed = (function custom(tension) {

    function cardinal(context) {
      return new CardinalClosed(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalOpen(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var cardinalOpen = (function custom(tension) {

    function cardinal(context) {
      return new CardinalOpen(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function point$2(that, x, y) {
    var x1 = that._x1,
        y1 = that._y1,
        x2 = that._x2,
        y2 = that._y2;

    if (that._l01_a > epsilon) {
      var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
          n = 3 * that._l01_a * (that._l01_a + that._l12_a);
      x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
      y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }

    if (that._l23_a > epsilon) {
      var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
          m = 3 * that._l23_a * (that._l23_a + that._l12_a);
      x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
      y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
    }

    that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
  }

  function CatmullRom(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRom.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: this.point(this, this._x2, this._y2); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; // proceed
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var catmullRom = (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function CatmullRomClosed(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRomClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var catmullRomClosed = (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function CatmullRomOpen(context, alpha) {
    this._context = context;
    this._alpha = alpha;
  }

  CatmullRomOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;

      if (this._point) {
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      }

      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$2(this, x, y); break;
      }

      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var catmullRomOpen = (function custom(alpha) {

    function catmullRom(context) {
      return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
    }

    catmullRom.alpha = function(alpha) {
      return custom(+alpha);
    };

    return catmullRom;
  })(0.5);

  function LinearClosed(context) {
    this._context = context;
  }

  LinearClosed.prototype = {
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._point) this._context.closePath();
    },
    point: function(x, y) {
      x = +x, y = +y;
      if (this._point) this._context.lineTo(x, y);
      else this._point = 1, this._context.moveTo(x, y);
    }
  };

  function linearClosed(context) {
    return new LinearClosed(context);
  }

  function sign(x) {
    return x < 0 ? -1 : 1;
  }

  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }

  // Calculate a one-sided slope.
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }

  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function point$3(that, t0, t1) {
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  }

  function MonotoneX(context) {
    this._context = context;
  }

  MonotoneX.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 =
      this._t0 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x1, this._y1); break;
        case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      var t1 = NaN;

      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
        default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
      }

      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    }
  }

  function MonotoneY(context) {
    this._context = new ReflectContext(context);
  }

  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
    MonotoneX.prototype.point.call(this, y, x);
  };

  function ReflectContext(context) {
    this._context = context;
  }

  ReflectContext.prototype = {
    moveTo: function(x, y) { this._context.moveTo(y, x); },
    closePath: function() { this._context.closePath(); },
    lineTo: function(x, y) { this._context.lineTo(y, x); },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
  };

  function monotoneX(context) {
    return new MonotoneX(context);
  }

  function monotoneY(context) {
    return new MonotoneY(context);
  }

  function Natural(context) {
    this._context = context;
  }

  Natural.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x = [];
      this._y = [];
    },
    lineEnd: function() {
      var x = this._x,
          y = this._y,
          n = x.length;

      if (n) {
        this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
        if (n === 2) {
          this._context.lineTo(x[1], y[1]);
        } else {
          var px = controlPoints(x),
              py = controlPoints(y);
          for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
            this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
          }
        }
      }

      if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
      this._line = 1 - this._line;
      this._x = this._y = null;
    },
    point: function(x, y) {
      this._x.push(+x);
      this._y.push(+y);
    }
  };

  // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
  function controlPoints(x) {
    var i,
        n = x.length - 1,
        m,
        a = new Array(n),
        b = new Array(n),
        r = new Array(n);
    a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
    for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
    a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
    for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a[n - 1] = r[n - 1] / b[n - 1];
    for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
    b[n - 1] = (x[n] + a[n - 1]) / 2;
    for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
    return [a, b];
  }

  function natural(context) {
    return new Natural(context);
  }

  function Step(context, t) {
    this._context = context;
    this._t = t;
  }

  Step.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x = this._y = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);
            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;
            this._context.lineTo(x1, this._y);
            this._context.lineTo(x1, y);
          }
          break;
        }
      }
      this._x = x, this._y = y;
    }
  };

  function step(context) {
    return new Step(context, 0.5);
  }

  function stepBefore(context) {
    return new Step(context, 0);
  }

  function stepAfter(context) {
    return new Step(context, 1);
  }

  var slice = Array.prototype.slice;

  function none(series, order) {
    if (!((n = series.length) > 1)) return;
    for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
      s0 = s1, s1 = series[order[i]];
      for (var j = 0; j < m; ++j) {
        s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
      }
    }
  }

  function none$1(series) {
    var n = series.length, o = new Array(n);
    while (--n >= 0) o[n] = n;
    return o;
  }

  function stackValue(d, key) {
    return d[key];
  }

  function stack() {
    var keys = constant([]),
        order = none$1,
        offset = none,
        value = stackValue;

    function stack(data) {
      var kz = keys.apply(this, arguments),
          i,
          m = data.length,
          n = kz.length,
          sz = new Array(n),
          oz;

      for (i = 0; i < n; ++i) {
        for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
          si[j] = sij = [0, +value(data[j], ki, j, data)];
          sij.data = data[j];
        }
        si.key = ki;
      }

      for (i = 0, oz = order(sz); i < n; ++i) {
        sz[oz[i]].index = i;
      }

      offset(sz, oz);
      return sz;
    }

    stack.keys = function(_) {
      return arguments.length ? (keys = typeof _ === "function" ? _ : constant(slice.call(_)), stack) : keys;
    };

    stack.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
    };

    stack.order = function(_) {
      return arguments.length ? (order = _ == null ? none$1 : typeof _ === "function" ? _ : constant(slice.call(_)), stack) : order;
    };

    stack.offset = function(_) {
      return arguments.length ? (offset = _ == null ? none : _, stack) : offset;
    };

    return stack;
  }

  function expand(series, order) {
    if (!((n = series.length) > 0)) return;
    for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
      for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
      if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
    }
    none(series, order);
  }

  function silhouette(series, order) {
    if (!((n = series.length) > 0)) return;
    for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
      for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
      s0[j][1] += s0[j][0] = -y / 2;
    }
    none(series, order);
  }

  function wiggle(series, order) {
    if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
    for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
      for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
        var si = series[order[i]],
            sij0 = si[j][1] || 0,
            sij1 = si[j - 1][1] || 0,
            s3 = (sij0 - sij1) / 2;
        for (var k = 0; k < i; ++k) {
          var sk = series[order[k]],
              skj0 = sk[j][1] || 0,
              skj1 = sk[j - 1][1] || 0;
          s3 += skj0 - skj1;
        }
        s1 += sij0, s2 += s3 * sij0;
      }
      s0[j - 1][1] += s0[j - 1][0] = y;
      if (s1) y -= s2 / s1;
    }
    s0[j - 1][1] += s0[j - 1][0] = y;
    none(series, order);
  }

  function ascending(series) {
    var sums = series.map(sum);
    return none$1(series).sort(function(a, b) { return sums[a] - sums[b]; });
  }

  function sum(series) {
    var s = 0, i = -1, n = series.length, v;
    while (++i < n) if (v = +series[i][1]) s += v;
    return s;
  }

  function descending$1(series) {
    return ascending(series).reverse();
  }

  function insideOut(series) {
    var n = series.length,
        i,
        j,
        sums = series.map(sum),
        order = none$1(series).sort(function(a, b) { return sums[b] - sums[a]; }),
        top = 0,
        bottom = 0,
        tops = [],
        bottoms = [];

    for (i = 0; i < n; ++i) {
      j = order[i];
      if (top < bottom) {
        top += sums[j];
        tops.push(j);
      } else {
        bottom += sums[j];
        bottoms.push(j);
      }
    }

    return bottoms.reverse().concat(tops);
  }

  function reverse(series) {
    return none$1(series).reverse();
  }

  exports.arc = arc;
  exports.area = area;
  exports.line = line;
  exports.pie = pie;
  exports.radialArea = radialArea;
  exports.radialLine = radialLine$1;
  exports.symbol = symbol;
  exports.symbols = symbols;
  exports.symbolCircle = circle;
  exports.symbolCross = cross;
  exports.symbolDiamond = diamond;
  exports.symbolSquare = square;
  exports.symbolStar = star;
  exports.symbolTriangle = triangle;
  exports.symbolWye = wye;
  exports.curveBasisClosed = basisClosed;
  exports.curveBasisOpen = basisOpen;
  exports.curveBasis = basis;
  exports.curveBundle = bundle;
  exports.curveCardinalClosed = cardinalClosed;
  exports.curveCardinalOpen = cardinalOpen;
  exports.curveCardinal = cardinal;
  exports.curveCatmullRomClosed = catmullRomClosed;
  exports.curveCatmullRomOpen = catmullRomOpen;
  exports.curveCatmullRom = catmullRom;
  exports.curveLinearClosed = linearClosed;
  exports.curveLinear = curveLinear;
  exports.curveMonotoneX = monotoneX;
  exports.curveMonotoneY = monotoneY;
  exports.curveNatural = natural;
  exports.curveStep = step;
  exports.curveStepAfter = stepAfter;
  exports.curveStepBefore = stepBefore;
  exports.stack = stack;
  exports.stackOffsetExpand = expand;
  exports.stackOffsetNone = none;
  exports.stackOffsetSilhouette = silhouette;
  exports.stackOffsetWiggle = wiggle;
  exports.stackOrderAscending = ascending;
  exports.stackOrderDescending = descending$1;
  exports.stackOrderInsideOut = insideOut;
  exports.stackOrderNone = none$1;
  exports.stackOrderReverse = reverse;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-path":11}],14:[function(require,module,exports){
// https://d3js.org/d3-time-format/ Version 2.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-time')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-time'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Time) { 'use strict';

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", localDate);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier, utcDate);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"};
  var numberRe = /^\s*\d+/;
  var percentRe = /^%/;
  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + d3Time.timeDay.count(d3Time.timeYear(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekNumberSunday(d, p) {
    return pad(d3Time.timeSunday.count(d3Time.timeYear(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(d3Time.timeMonday.count(d3Time.timeYear(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + d3Time.utcDay.count(d3Time.utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(d3Time.utcSunday.count(d3Time.utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(d3Time.utcMonday.count(d3Time.utcYear(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  var locale;
  defaultLocale({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    exports.timeFormat = locale.format;
    exports.timeParse = locale.parse;
    exports.utcFormat = locale.utcFormat;
    exports.utcParse = locale.utcParse;
    return locale;
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
    return date.toISOString();
  }

  var formatIso = Date.prototype.toISOString
      ? formatIsoNative
      : exports.utcFormat(isoSpecifier);

  function parseIsoNative(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  }

  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
      ? parseIsoNative
      : exports.utcParse(isoSpecifier);

  exports.timeFormatDefaultLocale = defaultLocale;
  exports.timeFormatLocale = formatLocale;
  exports.isoFormat = formatIso;
  exports.isoParse = parseIso;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-time":15}],15:[function(require,module,exports){
// https://d3js.org/d3-time/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  var t0 = new Date;
  var t1 = new Date;
  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var milliseconds = millisecond.range;

  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var second = newInterval(function(date) {
    date.setTime(Math.floor(date / durationSecond) * durationSecond);
  }, function(date, step) {
    date.setTime(+date + step * durationSecond);
  }, function(start, end) {
    return (end - start) / durationSecond;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var seconds = second.range;

  var minute = newInterval(function(date) {
    date.setTime(Math.floor(date / durationMinute) * durationMinute);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getMinutes();
  });

  var minutes = minute.range;

  var hour = newInterval(function(date) {
    var offset = date.getTimezoneOffset() * durationMinute % durationHour;
    if (offset < 0) offset += durationHour;
    date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getHours();
  });

  var hours = hour.range;

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function(date) {
    return date.getDate() - 1;
  });

  var days = day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;

  var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var months = month.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  var years = year.range;

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getUTCMinutes();
  });

  var utcMinutes = utcMinute.range;

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getUTCHours();
  });

  var utcHours = utcHour.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  var utcDays = utcDay.range;

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;

  var utcMonth = newInterval(function(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });

  var utcMonths = utcMonth.range;

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  var utcYears = utcYear.range;

  exports.timeInterval = newInterval;
  exports.timeMillisecond = millisecond;
  exports.timeMilliseconds = milliseconds;
  exports.utcMillisecond = millisecond;
  exports.utcMilliseconds = milliseconds;
  exports.timeSecond = second;
  exports.timeSeconds = seconds;
  exports.utcSecond = second;
  exports.utcSeconds = seconds;
  exports.timeMinute = minute;
  exports.timeMinutes = minutes;
  exports.timeHour = hour;
  exports.timeHours = hours;
  exports.timeDay = day;
  exports.timeDays = days;
  exports.timeWeek = sunday;
  exports.timeWeeks = sundays;
  exports.timeSunday = sunday;
  exports.timeSundays = sundays;
  exports.timeMonday = monday;
  exports.timeMondays = mondays;
  exports.timeTuesday = tuesday;
  exports.timeTuesdays = tuesdays;
  exports.timeWednesday = wednesday;
  exports.timeWednesdays = wednesdays;
  exports.timeThursday = thursday;
  exports.timeThursdays = thursdays;
  exports.timeFriday = friday;
  exports.timeFridays = fridays;
  exports.timeSaturday = saturday;
  exports.timeSaturdays = saturdays;
  exports.timeMonth = month;
  exports.timeMonths = months;
  exports.timeYear = year;
  exports.timeYears = years;
  exports.utcMinute = utcMinute;
  exports.utcMinutes = utcMinutes;
  exports.utcHour = utcHour;
  exports.utcHours = utcHours;
  exports.utcDay = utcDay;
  exports.utcDays = utcDays;
  exports.utcWeek = utcSunday;
  exports.utcWeeks = utcSundays;
  exports.utcSunday = utcSunday;
  exports.utcSundays = utcSundays;
  exports.utcMonday = utcMonday;
  exports.utcMondays = utcMondays;
  exports.utcTuesday = utcTuesday;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesday = utcWednesday;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursday = utcThursday;
  exports.utcThursdays = utcThursdays;
  exports.utcFriday = utcFriday;
  exports.utcFridays = utcFridays;
  exports.utcSaturday = utcSaturday;
  exports.utcSaturdays = utcSaturdays;
  exports.utcMonth = utcMonth;
  exports.utcMonths = utcMonths;
  exports.utcYear = utcYear;
  exports.utcYears = utcYears;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],16:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":17}],17:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":26}],18:[function(require,module,exports){
(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    root.PromisePool = factory()
    // Legacy API
    root.promisePool = root.PromisePool
  }
})(this, function () {
  'use strict'

  var EventTarget = function () {
    this._listeners = {}
  }

  EventTarget.prototype.addEventListener = function (type, listener) {
    this._listeners[type] = this._listeners[type] || []
    if (this._listeners[type].indexOf(listener) < 0) {
      this._listeners[type].push(listener)
    }
  }

  EventTarget.prototype.removeEventListener = function (type, listener) {
    if (this._listeners[type]) {
      var p = this._listeners[type].indexOf(listener)
      if (p >= 0) {
        this._listeners[type].splice(p, 1)
      }
    }
  }

  EventTarget.prototype.dispatchEvent = function (evt) {
    if (this._listeners[evt.type] && this._listeners[evt.type].length) {
      var listeners = this._listeners[evt.type].slice()
      for (var i = 0, l = listeners.length; i < l; ++i) {
        listeners[i].call(this, evt)
      }
    }
  }

  var isGenerator = function (func) {
    return (typeof func.constructor === 'function' &&
      func.constructor.name === 'GeneratorFunction')
  }

  var functionToIterator = function (func) {
    return {
      next: function () {
        var promise = func()
        return promise ? {value: promise} : {done: true}
      }
    }
  }

  var promiseToIterator = function (promise) {
    var called = false
    return {
      next: function () {
        if (called) {
          return {done: true}
        }
        called = true
        return {value: promise}
      }
    }
  }

  var toIterator = function (obj, Promise) {
    var type = typeof obj
    if (type === 'object') {
      if (typeof obj.next === 'function') {
        return obj
      }
      /* istanbul ignore else */
      if (typeof obj.then === 'function') {
        return promiseToIterator(obj)
      }
    }
    if (type === 'function') {
      return isGenerator(obj) ? obj() : functionToIterator(obj)
    }
    return promiseToIterator(Promise.resolve(obj))
  }

  var PromisePoolEvent = function (target, type, data) {
    this.target = target
    this.type = type
    this.data = data
  }

  var PromisePool = function (source, concurrency, options) {
    EventTarget.call(this)
    if (typeof concurrency !== 'number' ||
        Math.floor(concurrency) !== concurrency ||
        concurrency < 1) {
      throw new Error('Invalid concurrency')
    }
    this._concurrency = concurrency
    this._options = options || {}
    this._options.promise = this._options.promise || Promise
    this._iterator = toIterator(source, this._options.promise)
    this._done = false
    this._size = 0
    this._promise = null
    this._callbacks = null
  }
  PromisePool.prototype = new EventTarget()
  PromisePool.prototype.constructor = PromisePool

  PromisePool.prototype.concurrency = function (value) {
    if (typeof value !== 'undefined') {
      this._concurrency = value
      if (this.active()) {
        this._proceed()
      }
    }
    return this._concurrency
  }

  PromisePool.prototype.size = function () {
    return this._size
  }

  PromisePool.prototype.active = function () {
    return !!this._promise
  }

  PromisePool.prototype.promise = function () {
    return this._promise
  }

  PromisePool.prototype.start = function () {
    var that = this
    var Promise = this._options.promise
    this._promise = new Promise(function (resolve, reject) {
      that._callbacks = {
        reject: reject,
        resolve: resolve
      }
      that._proceed()
    })
    return this._promise
  }

  PromisePool.prototype._fireEvent = function (type, data) {
    this.dispatchEvent(new PromisePoolEvent(this, type, data))
  }

  PromisePool.prototype._settle = function (error) {
    if (error) {
      this._callbacks.reject(error)
    } else {
      this._callbacks.resolve()
    }
    this._promise = null
    this._callbacks = null
  }

  PromisePool.prototype._onPooledPromiseFulfilled = function (promise, result) {
    this._size--
    if (this.active()) {
      this._fireEvent('fulfilled', {
        promise: promise,
        result: result
      })
      this._proceed()
    }
  }

  PromisePool.prototype._onPooledPromiseRejected = function (promise, error) {
    this._size--
    if (this.active()) {
      this._fireEvent('rejected', {
        promise: promise,
        error: error
      })
      this._settle(error || new Error('Unknown error'))
    }
  }

  PromisePool.prototype._trackPromise = function (promise) {
    var that = this
    promise
      .then(function (result) {
        that._onPooledPromiseFulfilled(promise, result)
      }, function (error) {
        that._onPooledPromiseRejected(promise, error)
      })['catch'](function (err) {
        that._settle(new Error('Promise processing failed: ' + err))
      })
  }

  PromisePool.prototype._proceed = function () {
    if (!this._done) {
      var result = null
      while (this._size < this._concurrency &&
          !(result = this._iterator.next()).done) {
        this._size++
        this._trackPromise(result.value)
      }
      this._done = (result === null || !!result.done)
    }
    if (this._done && this._size === 0) {
      this._settle()
    }
  }

  PromisePool.PromisePoolEvent = PromisePoolEvent
  // Legacy API
  PromisePool.PromisePool = PromisePool

  return PromisePool
})

},{}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],20:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":4}],21:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],24:[function(require,module,exports){
(function(factory) {
  if(typeof exports === 'object') {
    factory(exports);
  } else {
    factory(this);
  }
}).call(this, function(root) { 

  var slice   = Array.prototype.slice,
      each    = Array.prototype.forEach;

  var extend = function(obj) {
    if(typeof obj !== 'object') throw obj + ' is not an object' ;

    var sources = slice.call(arguments, 1); 

    each.call(sources, function(source) {
      if(source) {
        for(var prop in source) {
          if(typeof source[prop] === 'object' && obj[prop]) {
            extend.call(obj, obj[prop], source[prop]);
          } else {
            obj[prop] = source[prop];
          }
        } 
      }
    });

    return obj;
  }

  root.extend = extend;
});

},{}],25:[function(require,module,exports){
'use strict';
var immediate = require('immediate');

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"immediate":21}],26:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


var blank = {};

var dictionary = exports.dictionary = function dictionary() {
  var data = arguments.length <= 0 || arguments[0] === undefined ? blank : arguments[0];

  var value = Object.create(null);

  if (data != null) {
    for (var _key in data) {
      if (data.hasOwnProperty(_key)) {
        value[_key] = data[_key];
      }
    }
  }

  return value;
};

exports.default = dictionary;

},{}],28:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jsExtend = require('js-extend');
var Promise = _interopDefault(require('pouchdb-promise'));
var ajaxCore = _interopDefault(require('pouchdb-ajax'));
var getArguments = _interopDefault(require('argsarray'));
var pouchdbUtils = require('pouchdb-utils');
var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var PromisePool = _interopDefault(require('es6-promise-pool'));
var pouchdbErrors = require('pouchdb-errors');
var debug = _interopDefault(require('debug'));

var CHANGES_BATCH_SIZE = 25;
var MAX_SIMULTANEOUS_REVS = 50;

var supportsBulkGetMap = {};

// according to http://stackoverflow.com/a/417184/680742,
// the de facto URL length limit is 2000 characters.
// but since most of our measurements don't take the full
// URL into account, we fudge it a bit.
// TODO: we could measure the full URL to enforce exactly 2000 chars
var MAX_URL_LENGTH = 1800;

var log = debug('pouchdb:http');

function readAttachmentsAsBlobOrBuffer(row) {
  var atts = row.doc && row.doc._attachments;
  if (!atts) {
    return;
  }
  Object.keys(atts).forEach(function (filename) {
    var att = atts[filename];
    att.data = pouchdbBinaryUtils.base64StringToBlobOrBuffer(att.data, att.content_type);
  });
}

function encodeDocId(id) {
  if (/^_design/.test(id)) {
    return '_design/' + encodeURIComponent(id.slice(8));
  }
  if (/^_local/.test(id)) {
    return '_local/' + encodeURIComponent(id.slice(7));
  }
  return encodeURIComponent(id);
}

function preprocessAttachments(doc) {
  if (!doc._attachments || !Object.keys(doc._attachments)) {
    return Promise.resolve();
  }

  return Promise.all(Object.keys(doc._attachments).map(function (key) {
    var attachment = doc._attachments[key];
    if (attachment.data && typeof attachment.data !== 'string') {
      return new Promise(function (resolve) {
        pouchdbBinaryUtils.blobOrBufferToBase64(attachment.data, resolve);
      }).then(function (b64) {
        attachment.data = b64;
      });
    }
  }));
}

// Get all the information you possibly can about the URI given by name and
// return it as a suitable object.
function getHost(name) {
  // Prase the URI into all its little bits
  var uri = pouchdbUtils.parseUri(name);

  // Store the user and password as a separate auth object
  if (uri.user || uri.password) {
    uri.auth = {username: uri.user, password: uri.password};
  }

  // Split the path part of the URI into parts using '/' as the delimiter
  // after removing any leading '/' and any trailing '/'
  var parts = uri.path.replace(/(^\/|\/$)/g, '').split('/');

  // Store the first part as the database name and remove it from the parts
  // array
  uri.db = parts.pop();
  // Prevent double encoding of URI component
  if (uri.db.indexOf('%') === -1) {
    uri.db = encodeURIComponent(uri.db);
  }

  // Restore the path by joining all the remaining parts (all the parts
  // except for the database name) with '/'s
  uri.path = parts.join('/');

  return uri;
}

// Generate a URL with the host data given by opts and the given path
function genDBUrl(opts, path) {
  return genUrl(opts, opts.db + '/' + path);
}

// Generate a URL with the host data given by opts and the given path
function genUrl(opts, path) {
  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  var pathDel = !opts.path ? '' : '/';

  // If the host already has a path, then we need to have a path delimiter
  // Otherwise, the path delimiter is the empty string
  return opts.protocol + '://' + opts.host +
         (opts.port ? (':' + opts.port) : '') +
         '/' + opts.path + pathDel + path;
}

function paramsToStr(params) {
  return '?' + Object.keys(params).map(function (k) {
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
}

// Implements the PouchDB API for dealing with CouchDB instances over HTTP
function HttpPouch(opts, callback) {
  // The functions that will be publicly available for HttpPouch
  var api = this;

  // Parse the URI given by opts.name into an easy-to-use object
  var getHostFun = getHost;

  // TODO: this seems to only be used by yarong for the Thali project.
  // Verify whether or not it's still needed.
  /* istanbul ignore if */
  if (opts.getHost) {
    getHostFun = opts.getHost;
  }

  var host = getHostFun(opts.name, opts);
  var dbUrl = genDBUrl(host, '');

  opts = pouchdbUtils.clone(opts);
  var ajaxOpts = opts.ajax || {};

  api.getUrl = function () { return dbUrl; };
  api.getHeaders = function () { return ajaxOpts.headers || {}; };

  if (opts.auth || host.auth) {
    var nAuth = opts.auth || host.auth;
    var str = nAuth.username + ':' + nAuth.password;
    var token = pouchdbBinaryUtils.btoa(unescape(encodeURIComponent(str)));
    ajaxOpts.headers = ajaxOpts.headers || {};
    ajaxOpts.headers.Authorization = 'Basic ' + token;
  }

  // Not strictly necessary, but we do this because numerous tests
  // rely on swapping ajax in and out.
  api._ajax = ajaxCore;

  function ajax(userOpts, options, callback) {
    var reqAjax = userOpts.ajax || {};
    var reqOpts = jsExtend.extend(pouchdbUtils.clone(ajaxOpts), reqAjax, options);
    log(reqOpts.method + ' ' + reqOpts.url);
    return api._ajax(reqOpts, callback);
  }

  function ajaxPromise(userOpts, opts) {
    return new Promise(function (resolve, reject) {
      ajax(userOpts, opts, function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  function adapterFun(name, fun) {
    return pouchdbUtils.adapterFun(name, getArguments(function (args) {
      setup().then(function () {
        return fun.apply(this, args);
      }).catch(function (e) {
        var callback = args.pop();
        callback(e);
      });
    }));
  }

  var setupPromise;

  function setup() {
    // TODO: Remove `skipSetup` in favor of `skip_setup` in a future release
    if (opts.skipSetup || opts.skip_setup) {
      return Promise.resolve();
    }

    // If there is a setup in process or previous successful setup
    // done then we will use that
    // If previous setups have been rejected we will try again
    if (setupPromise) {
      return setupPromise;
    }

    var checkExists = {method: 'GET', url: dbUrl};
    setupPromise = ajaxPromise({}, checkExists).catch(function (err) {
      if (err && err.status && err.status === 404) {
        // Doesnt exist, create it
        pouchdbUtils.explainError(404, 'PouchDB is just detecting if the remote exists.');
        return ajaxPromise({}, {method: 'PUT', url: dbUrl});
      } else {
        return Promise.reject(err);
      }
    }).catch(function (err) {
      // If we try to create a database that already exists, skipped in
      // istanbul since its catching a race condition.
      /* istanbul ignore if */
      if (err && err.status && err.status === 412) {
        return true;
      }
      return Promise.reject(err);
    });

    setupPromise.catch(function () {
      setupPromise = null;
    });

    return setupPromise;
  }

  setTimeout(function () {
    callback(null, api);
  });

  api.type = function () {
    return 'http';
  };

  api.id = adapterFun('id', function (callback) {
    ajax({}, {method: 'GET', url: genUrl(host, '')}, function (err, result) {
      var uuid = (result && result.uuid) ?
        (result.uuid + host.db) : genDBUrl(host, '');
      callback(null, uuid);
    });
  });

  api.request = adapterFun('request', function (options, callback) {
    options.url = genDBUrl(host, options.url);
    ajax({}, options, callback);
  });

  // Sends a POST request to the host calling the couchdb _compact function
  //    version: The version of CouchDB it is running
  api.compact = adapterFun('compact', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = pouchdbUtils.clone(opts);
    ajax(opts, {
      url: genDBUrl(host, '_compact'),
      method: 'POST'
    }, function () {
      function ping() {
        api.info(function (err, res) {
          if (res && !res.compact_running) {
            callback(null, {ok: true});
          } else {
            setTimeout(ping, opts.interval || 200);
          }
        });
      }
      // Ping the http if it's finished compaction
      ping();
    });
  });

  api.bulkGet = pouchdbUtils.adapterFun('bulkGet', function (opts, callback) {
    var self = this;

    function doBulkGet(cb) {
      var params = {};
      if (opts.revs) {
        params.revs = true;
      }
      if (opts.attachments) {
        /* istanbul ignore next */
        params.attachments = true;
      }
      ajax({}, {
        url: genDBUrl(host, '_bulk_get' + paramsToStr(params)),
        method: 'POST',
        body: { docs: opts.docs}
      }, cb);
    }

    function doBulkGetShim() {
      // avoid "url too long error" by splitting up into multiple requests
      var batchSize = MAX_SIMULTANEOUS_REVS;
      var numBatches = Math.ceil(opts.docs.length / batchSize);
      var numDone = 0;
      var results = new Array(numBatches);

      function onResult(batchNum) {
        return function (err, res) {
          // err is impossible because shim returns a list of errs in that case
          results[batchNum] = res.results;
          if (++numDone === numBatches) {
            callback(null, {results: pouchdbUtils.flatten(results)});
          }
        };
      }

      for (var i = 0; i < numBatches; i++) {
        var subOpts = pouchdbUtils.pick(opts, ['revs', 'attachments']);
        subOpts.ajax = ajaxOpts;
        subOpts.docs = opts.docs.slice(i * batchSize,
          Math.min(opts.docs.length, (i + 1) * batchSize));
        pouchdbUtils.bulkGetShim(self, subOpts, onResult(i));
      }
    }

    // mark the whole database as either supporting or not supporting _bulk_get
    var dbUrl = genUrl(host, '');
    var supportsBulkGet = supportsBulkGetMap[dbUrl];

    if (typeof supportsBulkGet !== 'boolean') {
      // check if this database supports _bulk_get
      doBulkGet(function (err, res) {
        /* istanbul ignore else */
        if (err) {
          var status = Math.floor(err.status / 100);
          /* istanbul ignore else */
          if (status === 4 || status === 5) { // 40x or 50x
            supportsBulkGetMap[dbUrl] = false;
            pouchdbUtils.explainError(
              err.status,
              'PouchDB is just detecting if the remote ' +
              'supports the _bulk_get API.'
            );
            doBulkGetShim();
          } else {
            callback(err);
          }
        } else {
          supportsBulkGetMap[dbUrl] = true;
          callback(null, res);
        }
      });
    } else if (supportsBulkGet) {
      /* istanbul ignore next */
      doBulkGet(callback);
    } else {
      doBulkGetShim();
    }
  });

  // Calls GET on the host, which gets back a JSON string containing
  //    couchdb: A welcome string
  //    version: The version of CouchDB it is running
  api._info = function (callback) {
    setup().then(function () {
      ajax({}, {
        method: 'GET',
        url: genDBUrl(host, '')
      }, function (err, res) {
        /* istanbul ignore next */
        if (err) {
        return callback(err);
        }
        res.host = genDBUrl(host, '');
        callback(null, res);
      });
    }).catch(callback);
  };

  // Get the document with the given id from the database given by host.
  // The id could be solely the _id in the database, or it may be a
  // _design/ID or _local/ID path
  api.get = adapterFun('get', function (id, opts, callback) {
    // If no options were given, set the callback to the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = pouchdbUtils.clone(opts);

    // List of parameters to add to the GET request
    var params = {};

    if (opts.revs) {
      params.revs = true;
    }

    if (opts.revs_info) {
      params.revs_info = true;
    }

    if (opts.open_revs) {
      if (opts.open_revs !== "all") {
        opts.open_revs = JSON.stringify(opts.open_revs);
      }
      params.open_revs = opts.open_revs;
    }

    if (opts.rev) {
      params.rev = opts.rev;
    }

    if (opts.conflicts) {
      params.conflicts = opts.conflicts;
    }

    id = encodeDocId(id);

    // Set the options for the ajax call
    var options = {
      method: 'GET',
      url: genDBUrl(host, id + paramsToStr(params))
    };

    function fetchAttachments(doc) {
      var atts = doc._attachments;
      var filenames = atts && Object.keys(atts);
      if (!atts || !filenames.length) {
        return;
      }
      // we fetch these manually in separate XHRs, because
      // Sync Gateway would normally send it back as multipart/mixed,
      // which we cannot parse. Also, this is more efficient than
      // receiving attachments as base64-encoded strings.
      function fetch() {

        if (!filenames.length) {
          return null;
        }

        var filename = filenames.pop();
        var att = atts[filename];
        var path = encodeDocId(doc._id) + '/' + encodeAttachmentId(filename) +
          '?rev=' + doc._rev;
        return ajaxPromise(opts, {
          method: 'GET',
          url: genDBUrl(host, path),
          binary: true
        }).then(function (blob) {
          if (opts.binary) {
            return blob;
          }
          return new Promise(function (resolve) {
            pouchdbBinaryUtils.blobOrBufferToBase64(blob, resolve);
          });
        }).then(function (data) {
          delete att.stub;
          delete att.length;
          att.data = data;
        });
      }

      // This limits the number of parallel xhr requests to 5 any time
      // to avoid issues with maximum browser request limits
      return new PromisePool(fetch, 5, {promise: Promise}).start();
    }

    function fetchAllAttachments(docOrDocs) {
      if (Array.isArray(docOrDocs)) {
        return Promise.all(docOrDocs.map(function (doc) {
          if (doc.ok) {
            return fetchAttachments(doc.ok);
          }
        }));
      }
      return fetchAttachments(docOrDocs);
    }

    ajaxPromise(opts, options).then(function (res) {
      return Promise.resolve().then(function () {
        if (opts.attachments) {
          return fetchAllAttachments(res);
        }
      }).then(function () {
        callback(null, res);
      });
    }).catch(callback);
  });

  // Delete the document given by doc from the database given by host.
  api.remove = adapterFun('remove',
      function (docOrId, optsOrRev, opts, callback) {
    var doc;
    if (typeof optsOrRev === 'string') {
      // id, rev, opts, callback style
      doc = {
        _id: docOrId,
        _rev: optsOrRev
      };
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
    } else {
      // doc, opts, callback style
      doc = docOrId;
      if (typeof optsOrRev === 'function') {
        callback = optsOrRev;
        opts = {};
      } else {
        callback = opts;
        opts = optsOrRev;
      }
    }

    var rev = (doc._rev || opts.rev);

    // Delete the document
    ajax(opts, {
      method: 'DELETE',
      url: genDBUrl(host, encodeDocId(doc._id)) + '?rev=' + rev
    }, callback);
  });

  function encodeAttachmentId(attachmentId) {
    return attachmentId.split("/").map(encodeURIComponent).join("/");
  }

  // Get the attachment
  api.getAttachment =
    adapterFun('getAttachment', function (docId, attachmentId, opts,
                                                callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var params = opts.rev ? ('?rev=' + opts.rev) : '';
    var url = genDBUrl(host, encodeDocId(docId)) + '/' +
      encodeAttachmentId(attachmentId) + params;
    ajax(opts, {
      method: 'GET',
      url: url,
      binary: true
    }, callback);
  });

  // Remove the attachment given by the id and rev
  api.removeAttachment =
    adapterFun('removeAttachment', function (docId, attachmentId, rev,
                                                   callback) {

    var url = genDBUrl(host, encodeDocId(docId) + '/' +
      encodeAttachmentId(attachmentId)) + '?rev=' + rev;

    ajax({}, {
      method: 'DELETE',
      url: url
    }, callback);
  });

  // Add the attachment given by blob and its contentType property
  // to the document with the given id, the revision given by rev, and
  // add it to the database given by host.
  api.putAttachment =
    adapterFun('putAttachment', function (docId, attachmentId, rev, blob,
                                                type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = blob;
      blob = rev;
      rev = null;
    }
    var id = encodeDocId(docId) + '/' + encodeAttachmentId(attachmentId);
    var url = genDBUrl(host, id);
    if (rev) {
      url += '?rev=' + rev;
    }

    if (typeof blob === 'string') {
      // input is assumed to be a base64 string
      var binary;
      try {
        binary = pouchdbBinaryUtils.atob(blob);
      } catch (err) {
        return callback(pouchdbErrors.createError(pouchdbErrors.BAD_ARG,
                        'Attachment is not a valid base64 string'));
      }
      blob = binary ? pouchdbBinaryUtils.binaryStringToBlobOrBuffer(binary, type) : '';
    }

    var opts = {
      headers: {'Content-Type': type},
      method: 'PUT',
      url: url,
      processData: false,
      body: blob,
      timeout: ajaxOpts.timeout || 60000
    };
    // Add the attachment
    ajax({}, opts, callback);
  });

  // Update/create multiple documents given by req in the database
  // given by host.
  api._bulkDocs = function (req, opts, callback) {
    // If new_edits=false then it prevents the database from creating
    // new revision numbers for the documents. Instead it just uses
    // the old ones. This is used in database replication.
    req.new_edits = opts.new_edits;

    setup().then(function () {
      return Promise.all(req.docs.map(preprocessAttachments));
    }).then(function () {
      // Update/create the documents
      ajax(opts, {
        method: 'POST',
        url: genDBUrl(host, '_bulk_docs'),
        body: req
      }, function (err, results) {
        if (err) {
          return callback(err);
        }
        results.forEach(function (result) {
          result.ok = true; // smooths out cloudant not adding this
        });
        callback(null, results);
      });
    }).catch(callback);
  };

  // Get a listing of the documents in the database given
  // by host and ordered by increasing id.
  api.allDocs = adapterFun('allDocs', function (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    opts = pouchdbUtils.clone(opts);

    // List of parameters to add to the GET request
    var params = {};
    var body;
    var method = 'GET';

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if (opts.include_docs) {
      params.include_docs = true;
    }

    // added in CouchDB 1.6.0
    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.key) {
      params.key = JSON.stringify(opts.key);
    }

    if (opts.start_key) {
      opts.startkey = opts.start_key;
    }

    if (opts.startkey) {
      params.startkey = JSON.stringify(opts.startkey);
    }

    if (opts.end_key) {
      opts.endkey = opts.end_key;
    }

    if (opts.endkey) {
      params.endkey = JSON.stringify(opts.endkey);
    }

    if (typeof opts.inclusive_end !== 'undefined') {
      params.inclusive_end = !!opts.inclusive_end;
    }

    if (typeof opts.limit !== 'undefined') {
      params.limit = opts.limit;
    }

    if (typeof opts.skip !== 'undefined') {
      params.skip = opts.skip;
    }

    var paramStr = paramsToStr(params);

    if (typeof opts.keys !== 'undefined') {

      var keysAsString =
        'keys=' + encodeURIComponent(JSON.stringify(opts.keys));
      if (keysAsString.length + paramStr.length + 1 <= MAX_URL_LENGTH) {
        // If the keys are short enough, do a GET. we do this to work around
        // Safari not understanding 304s on POSTs (see issue #1239)
        paramStr += '&' + keysAsString;
      } else {
        // If keys are too long, issue a POST request to circumvent GET
        // query string limits
        // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
        method = 'POST';
        body = {keys: opts.keys};
      }
    }

    // Get the document listing
    ajaxPromise(opts, {
      method: method,
      url: genDBUrl(host, '_all_docs' + paramStr),
      body: body
    }).then(function (res) {
      if (opts.include_docs && opts.attachments && opts.binary) {
        res.rows.forEach(readAttachmentsAsBlobOrBuffer);
      }
      callback(null, res);
    }).catch(callback);
  });

  // Get a list of changes made to documents in the database given by host.
  // TODO According to the README, there should be two other methods here,
  // api.changes.addListener and api.changes.removeListener.
  api._changes = function (opts) {

    // We internally page the results of a changes request, this means
    // if there is a large set of changes to be returned we can start
    // processing them quicker instead of waiting on the entire
    // set of changes to return and attempting to process them at once
    var batchSize = 'batch_size' in opts ? opts.batch_size : CHANGES_BATCH_SIZE;

    opts = pouchdbUtils.clone(opts);
    opts.timeout = ('timeout' in opts) ? opts.timeout :
      ('timeout' in ajaxOpts) ? ajaxOpts.timeout :
      30 * 1000;

    // We give a 5 second buffer for CouchDB changes to respond with
    // an ok timeout (if a timeout it set)
    var params = opts.timeout ? {timeout: opts.timeout - (5 * 1000)} : {};
    var limit = (typeof opts.limit !== 'undefined') ? opts.limit : false;
    var returnDocs;
    if ('return_docs' in opts) {
      returnDocs = opts.return_docs;
    } else if ('returnDocs' in opts) {
      // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
      returnDocs = opts.returnDocs;
    } else {
      returnDocs = true;
    }
    //
    var leftToFetch = limit;

    if (opts.style) {
      params.style = opts.style;
    }

    if (opts.include_docs || opts.filter && typeof opts.filter === 'function') {
      params.include_docs = true;
    }

    if (opts.attachments) {
      params.attachments = true;
    }

    if (opts.continuous) {
      params.feed = 'longpoll';
    }

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if ('heartbeat' in opts) {
      // If the heartbeat value is false, it disables the default heartbeat
      if (opts.heartbeat) {
        params.heartbeat = opts.heartbeat;
      }
    } else {
      // Default heartbeat to 10 seconds
      params.heartbeat = 10000;
    }

    if (opts.filter && typeof opts.filter === 'string') {
      params.filter = opts.filter;
    }

    if (opts.view && typeof opts.view === 'string') {
      params.filter = '_view';
      params.view = opts.view;
    }

    // If opts.query_params exists, pass it through to the changes request.
    // These parameters may be used by the filter on the source database.
    if (opts.query_params && typeof opts.query_params === 'object') {
      for (var param_name in opts.query_params) {
        /* istanbul ignore else */
        if (opts.query_params.hasOwnProperty(param_name)) {
          params[param_name] = opts.query_params[param_name];
        }
      }
    }

    var method = 'GET';
    var body;

    if (opts.doc_ids) {
      // set this automagically for the user; it's annoying that couchdb
      // requires both a "filter" and a "doc_ids" param.
      params.filter = '_doc_ids';

      var docIdsJson = JSON.stringify(opts.doc_ids);

      if (docIdsJson.length < MAX_URL_LENGTH) {
        params.doc_ids = docIdsJson;
      } else {
        // anything greater than ~2000 is unsafe for gets, so
        // use POST instead
        method = 'POST';
        body = {doc_ids: opts.doc_ids };
      }
    }

    var xhr;
    var lastFetchedSeq;

    // Get all the changes starting wtih the one immediately after the
    // sequence number given by since.
    var fetch = function (since, callback) {
      if (opts.aborted) {
        return;
      }
      params.since = since;
      // "since" can be any kind of json object in Coudant/CouchDB 2.x
      /* istanbul ignore next */
      if (typeof params.since === "object") {
        params.since = JSON.stringify(params.since);
      }

      if (opts.descending) {
        if (limit) {
          params.limit = leftToFetch;
        }
      } else {
        params.limit = (!limit || leftToFetch > batchSize) ?
          batchSize : leftToFetch;
      }

      // Set the options for the ajax call
      var xhrOpts = {
        method: method,
        url: genDBUrl(host, '_changes' + paramsToStr(params)),
        timeout: opts.timeout,
        body: body
      };
      lastFetchedSeq = since;

      /* istanbul ignore if */
      if (opts.aborted) {
        return;
      }

      // Get the changes
      setup().then(function () {
        xhr = ajax(opts, xhrOpts, callback);
      }).catch(callback);
    };

    // If opts.since exists, get all the changes from the sequence
    // number given by opts.since. Otherwise, get all the changes
    // from the sequence number 0.
    var results = {results: []};

    var fetched = function (err, res) {
      if (opts.aborted) {
        return;
      }
      var raw_results_length = 0;
      // If the result of the ajax call (res) contains changes (res.results)
      if (res && res.results) {
        raw_results_length = res.results.length;
        results.last_seq = res.last_seq;
        // For each change
        var req = {};
        req.query = opts.query_params;
        res.results = res.results.filter(function (c) {
          leftToFetch--;
          var ret = pouchdbUtils.filterChange(opts)(c);
          if (ret) {
            if (opts.include_docs && opts.attachments && opts.binary) {
              readAttachmentsAsBlobOrBuffer(c);
            }
            if (returnDocs) {
              results.results.push(c);
            }
            opts.onChange(c);
          }
          return ret;
        });
      } else if (err) {
        // In case of an error, stop listening for changes and call
        // opts.complete
        opts.aborted = true;
        opts.complete(err);
        return;
      }

      // The changes feed may have timed out with no results
      // if so reuse last update sequence
      if (res && res.last_seq) {
        lastFetchedSeq = res.last_seq;
      }

      var finished = (limit && leftToFetch <= 0) ||
        (res && raw_results_length < batchSize) ||
        (opts.descending);

      if ((opts.continuous && !(limit && leftToFetch <= 0)) || !finished) {
        // Queue a call to fetch again with the newest sequence number
        setTimeout(function () { fetch(lastFetchedSeq, fetched); }, 0);
      } else {
        // We're done, call the callback
        opts.complete(null, results);
      }
    };

    fetch(opts.since || 0, fetched);

    // Return a method to cancel this method from processing any more
    return {
      cancel: function () {
        opts.aborted = true;
        if (xhr) {
          xhr.abort();
        }
      }
    };
  };

  // Given a set of document/revision IDs (given by req), tets the subset of
  // those that do NOT correspond to revisions stored in the database.
  // See http://wiki.apache.org/couchdb/HttpPostRevsDiff
  api.revsDiff = adapterFun('revsDiff', function (req, opts, callback) {
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // Get the missing document/revision IDs
    ajax(opts, {
      method: 'POST',
      url: genDBUrl(host, '_revs_diff'),
      body: req
    }, callback);
  });

  api._close = function (callback) {
    callback();
  };

  api._destroy = function (options, callback) {
    ajax(options, {
      url: genDBUrl(host, ''),
      method: 'DELETE'
    }, function (err, resp) {
      if (err && err.status && err.status !== 404) {
        return callback(err);
      }
      callback(null, resp);
    });
  };
}

// HttpPouch is a valid adapter.
HttpPouch.valid = function () {
  return true;
};

function index (PouchDB) {
  PouchDB.adapter('http', HttpPouch, false);
  PouchDB.adapter('https', HttpPouch, false);
}

module.exports = index;
},{"argsarray":1,"debug":16,"es6-promise-pool":18,"js-extend":24,"pouchdb-ajax":33,"pouchdb-binary-utils":34,"pouchdb-errors":41,"pouchdb-promise":48,"pouchdb-utils":50}],29:[function(require,module,exports){
(function (process){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var pouchdbUtils = require('pouchdb-utils');
var pouchdbMerge = require('pouchdb-merge');
var pouchdbCollections = require('pouchdb-collections');
var pouchdbErrors = require('pouchdb-errors');
var pouchdbAdapterUtils = require('pouchdb-adapter-utils');
var jsExtend = require('js-extend');
var Promise = _interopDefault(require('pouchdb-promise'));
var pouchdbJson = require('pouchdb-json');
var pouchdbBinaryUtils = require('pouchdb-binary-utils');

// IndexedDB requires a versioned database structure, so we use the
// version here to manage migrations.
var ADAPTER_VERSION = 5;

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
// Keyed by document id
var DOC_STORE = 'document-store';
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE = 'by-sequence';
// Where we store attachments
var ATTACH_STORE = 'attach-store';
// Where we store many-to-many relations
// between attachment digests and seqs
var ATTACH_AND_SEQ_STORE = 'attach-seq-store';

// Where we store database-wide meta data in a single record
// keyed by id: META_STORE
var META_STORE = 'meta-store';
// Where we store local documents
var LOCAL_STORE = 'local-store';
// Where we detect blob support
var DETECT_BLOB_SUPPORT_STORE = 'detect-blob-support';

function tryCode(fun, that, args, PouchDB) {
  try {
    fun.apply(that, args);
  } catch (err) {
    // Shouldn't happen, but in some odd cases
    // IndexedDB implementations might throw a sync
    // error, in which case this will at least log it.
    PouchDB.emit('error', err);
  }
}

var taskQueue = {
  running: false,
  queue: []
};

function applyNext(PouchDB) {
  if (taskQueue.running || !taskQueue.queue.length) {
    return;
  }
  taskQueue.running = true;
  var item = taskQueue.queue.shift();
  item.action(function (err, res) {
    tryCode(item.callback, this, [err, res], PouchDB);
    taskQueue.running = false;
    process.nextTick(function () {
      applyNext(PouchDB);
    });
  });
}

function idbError(callback) {
  return function (evt) {
    var message = 'unknown_error';
    if (evt.target && evt.target.error) {
      message = evt.target.error.name || evt.target.error.message;
    }
    callback(pouchdbErrors.createError(pouchdbErrors.IDB_ERROR, message, evt.type));
  };
}

// Unfortunately, the metadata has to be stringified
// when it is put into the database, because otherwise
// IndexedDB can throw errors for deeply-nested objects.
// Originally we just used JSON.parse/JSON.stringify; now
// we use this custom vuvuzela library that avoids recursion.
// If we could do it all over again, we'd probably use a
// format for the revision trees other than JSON.
function encodeMetadata(metadata, winningRev, deleted) {
  return {
    data: pouchdbJson.safeJsonStringify(metadata),
    winningRev: winningRev,
    deletedOrLocal: deleted ? '1' : '0',
    seq: metadata.seq, // highest seq for this doc
    id: metadata.id
  };
}

function decodeMetadata(storedObject) {
  if (!storedObject) {
    return null;
  }
  var metadata = pouchdbJson.safeJsonParse(storedObject.data);
  metadata.winningRev = storedObject.winningRev;
  metadata.deleted = storedObject.deletedOrLocal === '1';
  metadata.seq = storedObject.seq;
  return metadata;
}

// read the doc back out from the database. we don't store the
// _id or _rev because we already have _doc_id_rev.
function decodeDoc(doc) {
  if (!doc) {
    return doc;
  }
  var idx = doc._doc_id_rev.lastIndexOf(':');
  doc._id = doc._doc_id_rev.substring(0, idx - 1);
  doc._rev = doc._doc_id_rev.substring(idx + 1);
  delete doc._doc_id_rev;
  return doc;
}

// Read a blob from the database, encoding as necessary
// and translating from base64 if the IDB doesn't support
// native Blobs
function readBlobData(body, type, asBlob, callback) {
  if (asBlob) {
    if (!body) {
      callback(pouchdbBinaryUtils.blob([''], {type: type}));
    } else if (typeof body !== 'string') { // we have blob support
      callback(body);
    } else { // no blob support
      callback(pouchdbBinaryUtils.base64StringToBlobOrBuffer(body, type));
    }
  } else { // as base64 string
    if (!body) {
      callback('');
    } else if (typeof body !== 'string') { // we have blob support
      pouchdbBinaryUtils.readAsBinaryString(body, function (binary) {
        callback(pouchdbBinaryUtils.btoa(binary));
      });
    } else { // no blob support
      callback(body);
    }
  }
}

function fetchAttachmentsIfNecessary(doc, opts, txn, cb) {
  var attachments = Object.keys(doc._attachments || {});
  if (!attachments.length) {
    return cb && cb();
  }
  var numDone = 0;

  function checkDone() {
    if (++numDone === attachments.length && cb) {
      cb();
    }
  }

  function fetchAttachment(doc, att) {
    var attObj = doc._attachments[att];
    var digest = attObj.digest;
    var req = txn.objectStore(ATTACH_STORE).get(digest);
    req.onsuccess = function (e) {
      attObj.body = e.target.result.body;
      checkDone();
    };
  }

  attachments.forEach(function (att) {
    if (opts.attachments && opts.include_docs) {
      fetchAttachment(doc, att);
    } else {
      doc._attachments[att].stub = true;
      checkDone();
    }
  });
}

// IDB-specific postprocessing necessary because
// we don't know whether we stored a true Blob or
// a base64-encoded string, and if it's a Blob it
// needs to be read outside of the transaction context
function postProcessAttachments(results, asBlob) {
  return Promise.all(results.map(function (row) {
    if (row.doc && row.doc._attachments) {
      var attNames = Object.keys(row.doc._attachments);
      return Promise.all(attNames.map(function (att) {
        var attObj = row.doc._attachments[att];
        if (!('body' in attObj)) { // already processed
          return;
        }
        var body = attObj.body;
        var type = attObj.content_type;
        return new Promise(function (resolve) {
          readBlobData(body, type, asBlob, function (data) {
            row.doc._attachments[att] = jsExtend.extend(
              pouchdbUtils.pick(attObj, ['digest', 'content_type']),
              {data: data}
            );
            resolve();
          });
        });
      }));
    }
  }));
}

function compactRevs(revs, docId, txn) {

  var possiblyOrphanedDigests = [];
  var seqStore = txn.objectStore(BY_SEQ_STORE);
  var attStore = txn.objectStore(ATTACH_STORE);
  var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);
  var count = revs.length;

  function checkDone() {
    count--;
    if (!count) { // done processing all revs
      deleteOrphanedAttachments();
    }
  }

  function deleteOrphanedAttachments() {
    if (!possiblyOrphanedDigests.length) {
      return;
    }
    possiblyOrphanedDigests.forEach(function (digest) {
      var countReq = attAndSeqStore.index('digestSeq').count(
        IDBKeyRange.bound(
          digest + '::', digest + '::\uffff', false, false));
      countReq.onsuccess = function (e) {
        var count = e.target.result;
        if (!count) {
          // orphaned
          attStore.delete(digest);
        }
      };
    });
  }

  revs.forEach(function (rev) {
    var index = seqStore.index('_doc_id_rev');
    var key = docId + "::" + rev;
    index.getKey(key).onsuccess = function (e) {
      var seq = e.target.result;
      if (typeof seq !== 'number') {
        return checkDone();
      }
      seqStore.delete(seq);

      var cursor = attAndSeqStore.index('seq')
        .openCursor(IDBKeyRange.only(seq));

      cursor.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          var digest = cursor.value.digestSeq.split('::')[0];
          possiblyOrphanedDigests.push(digest);
          attAndSeqStore.delete(cursor.primaryKey);
          cursor.continue();
        } else { // done
          checkDone();
        }
      };
    };
  });
}

function openTransactionSafely(idb, stores, mode) {
  try {
    return {
      txn: idb.transaction(stores, mode)
    };
  } catch (err) {
    return {
      error: err
    };
  }
}

function idbBulkDocs(dbOpts, req, opts, api, idb, idbChanges, callback) {
  var docInfos = req.docs;
  var txn;
  var docStore;
  var bySeqStore;
  var attachStore;
  var attachAndSeqStore;
  var docInfoError;
  var docCountDelta = 0;

  for (var i = 0, len = docInfos.length; i < len; i++) {
    var doc = docInfos[i];
    if (doc._id && pouchdbAdapterUtils.isLocalId(doc._id)) {
      continue;
    }
    doc = docInfos[i] = pouchdbAdapterUtils.parseDoc(doc, opts.new_edits);
    if (doc.error && !docInfoError) {
      docInfoError = doc;
    }
  }

  if (docInfoError) {
    return callback(docInfoError);
  }

  var results = new Array(docInfos.length);
  var fetchedDocs = new pouchdbCollections.Map();
  var preconditionErrored = false;
  var blobType = api._meta.blobSupport ? 'blob' : 'base64';

  pouchdbAdapterUtils.preprocessAttachments(docInfos, blobType, function (err) {
    if (err) {
      return callback(err);
    }
    startTransaction();
  });

  function startTransaction() {

    var stores = [
      DOC_STORE, BY_SEQ_STORE,
      ATTACH_STORE,
      LOCAL_STORE, ATTACH_AND_SEQ_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    txn = txnResult.txn;
    txn.onabort = idbError(callback);
    txn.ontimeout = idbError(callback);
    txn.oncomplete = complete;
    docStore = txn.objectStore(DOC_STORE);
    bySeqStore = txn.objectStore(BY_SEQ_STORE);
    attachStore = txn.objectStore(ATTACH_STORE);
    attachAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);

    verifyAttachments(function (err) {
      if (err) {
        preconditionErrored = true;
        return callback(err);
      }
      fetchExistingDocs();
    });
  }

  function idbProcessDocs() {
    pouchdbAdapterUtils.processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs,
                txn, results, writeDoc, opts);
  }

  function fetchExistingDocs() {

    if (!docInfos.length) {
      return;
    }

    var numFetched = 0;

    function checkDone() {
      if (++numFetched === docInfos.length) {
        idbProcessDocs();
      }
    }

    function readMetadata(event) {
      var metadata = decodeMetadata(event.target.result);

      if (metadata) {
        fetchedDocs.set(metadata.id, metadata);
      }
      checkDone();
    }

    for (var i = 0, len = docInfos.length; i < len; i++) {
      var docInfo = docInfos[i];
      if (docInfo._id && pouchdbAdapterUtils.isLocalId(docInfo._id)) {
        checkDone(); // skip local docs
        continue;
      }
      var req = docStore.get(docInfo.metadata.id);
      req.onsuccess = readMetadata;
    }
  }

  function complete() {
    if (preconditionErrored) {
      return;
    }

    idbChanges.notify(api._meta.name);
    api._meta.docCount += docCountDelta;
    callback(null, results);
  }

  function verifyAttachment(digest, callback) {

    var req = attachStore.get(digest);
    req.onsuccess = function (e) {
      if (!e.target.result) {
        var err = pouchdbErrors.createError(pouchdbErrors.MISSING_STUB,
          'unknown stub attachment with digest ' +
          digest);
        err.status = 412;
        callback(err);
      } else {
        callback();
      }
    };
  }

  function verifyAttachments(finish) {


    var digests = [];
    docInfos.forEach(function (docInfo) {
      if (docInfo.data && docInfo.data._attachments) {
        Object.keys(docInfo.data._attachments).forEach(function (filename) {
          var att = docInfo.data._attachments[filename];
          if (att.stub) {
            digests.push(att.digest);
          }
        });
      }
    });
    if (!digests.length) {
      return finish();
    }
    var numDone = 0;
    var err;

    function checkDone() {
      if (++numDone === digests.length) {
        finish(err);
      }
    }
    digests.forEach(function (digest) {
      verifyAttachment(digest, function (attErr) {
        if (attErr && !err) {
          err = attErr;
        }
        checkDone();
      });
    });
  }

  function writeDoc(docInfo, winningRev, winningRevIsDeleted, newRevIsDeleted,
                    isUpdate, delta, resultsIdx, callback) {

    docCountDelta += delta;

    docInfo.metadata.winningRev = winningRev;
    docInfo.metadata.deleted = winningRevIsDeleted;

    var doc = docInfo.data;
    doc._id = docInfo.metadata.id;
    doc._rev = docInfo.metadata.rev;

    if (newRevIsDeleted) {
      doc._deleted = true;
    }

    var hasAttachments = doc._attachments &&
      Object.keys(doc._attachments).length;
    if (hasAttachments) {
      return writeAttachments(docInfo, winningRev, winningRevIsDeleted,
        isUpdate, resultsIdx, callback);
    }

    finishDoc(docInfo, winningRev, winningRevIsDeleted,
      isUpdate, resultsIdx, callback);
  }

  function finishDoc(docInfo, winningRev, winningRevIsDeleted,
                     isUpdate, resultsIdx, callback) {

    var doc = docInfo.data;
    var metadata = docInfo.metadata;

    doc._doc_id_rev = metadata.id + '::' + metadata.rev;
    delete doc._id;
    delete doc._rev;

    function afterPutDoc(e) {
      var revsToDelete = docInfo.stemmedRevs || [];

      if (isUpdate && api.auto_compaction) {
        revsToDelete = revsToDelete.concat(pouchdbMerge.compactTree(docInfo.metadata));
      }

      if (revsToDelete && revsToDelete.length) {
        compactRevs(revsToDelete, docInfo.metadata.id, txn);
      }

      metadata.seq = e.target.result;
      // Current _rev is calculated from _rev_tree on read
      delete metadata.rev;
      var metadataToStore = encodeMetadata(metadata, winningRev,
        winningRevIsDeleted);
      var metaDataReq = docStore.put(metadataToStore);
      metaDataReq.onsuccess = afterPutMetadata;
    }

    function afterPutDocError(e) {
      // ConstraintError, need to update, not put (see #1638 for details)
      e.preventDefault(); // avoid transaction abort
      e.stopPropagation(); // avoid transaction onerror
      var index = bySeqStore.index('_doc_id_rev');
      var getKeyReq = index.getKey(doc._doc_id_rev);
      getKeyReq.onsuccess = function (e) {
        var putReq = bySeqStore.put(doc, e.target.result);
        putReq.onsuccess = afterPutDoc;
      };
    }

    function afterPutMetadata() {
      results[resultsIdx] = {
        ok: true,
        id: metadata.id,
        rev: winningRev
      };
      fetchedDocs.set(docInfo.metadata.id, docInfo.metadata);
      insertAttachmentMappings(docInfo, metadata.seq, callback);
    }

    var putReq = bySeqStore.put(doc);

    putReq.onsuccess = afterPutDoc;
    putReq.onerror = afterPutDocError;
  }

  function writeAttachments(docInfo, winningRev, winningRevIsDeleted,
                            isUpdate, resultsIdx, callback) {


    var doc = docInfo.data;

    var numDone = 0;
    var attachments = Object.keys(doc._attachments);

    function collectResults() {
      if (numDone === attachments.length) {
        finishDoc(docInfo, winningRev, winningRevIsDeleted,
          isUpdate, resultsIdx, callback);
      }
    }

    function attachmentSaved() {
      numDone++;
      collectResults();
    }

    attachments.forEach(function (key) {
      var att = docInfo.data._attachments[key];
      if (!att.stub) {
        var data = att.data;
        delete att.data;
        att.revpos = parseInt(winningRev, 10);
        var digest = att.digest;
        saveAttachment(digest, data, attachmentSaved);
      } else {
        numDone++;
        collectResults();
      }
    });
  }

  // map seqs to attachment digests, which
  // we will need later during compaction
  function insertAttachmentMappings(docInfo, seq, callback) {

    var attsAdded = 0;
    var attsToAdd = Object.keys(docInfo.data._attachments || {});

    if (!attsToAdd.length) {
      return callback();
    }

    function checkDone() {
      if (++attsAdded === attsToAdd.length) {
        callback();
      }
    }

    function add(att) {
      var digest = docInfo.data._attachments[att].digest;
      var req = attachAndSeqStore.put({
        seq: seq,
        digestSeq: digest + '::' + seq
      });

      req.onsuccess = checkDone;
      req.onerror = function (e) {
        // this callback is for a constaint error, which we ignore
        // because this docid/rev has already been associated with
        // the digest (e.g. when new_edits == false)
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
        checkDone();
      };
    }
    for (var i = 0; i < attsToAdd.length; i++) {
      add(attsToAdd[i]); // do in parallel
    }
  }

  function saveAttachment(digest, data, callback) {


    var getKeyReq = attachStore.count(digest);
    getKeyReq.onsuccess = function (e) {
      var count = e.target.result;
      if (count) {
        return callback(); // already exists
      }
      var newAtt = {
        digest: digest,
        body: data
      };
      var putReq = attachStore.put(newAtt);
      putReq.onsuccess = callback;
    };
  }
}

function createKeyRange(start, end, inclusiveEnd, key, descending) {
  try {
    if (start && end) {
      if (descending) {
        return IDBKeyRange.bound(end, start, !inclusiveEnd, false);
      } else {
        return IDBKeyRange.bound(start, end, false, !inclusiveEnd);
      }
    } else if (start) {
      if (descending) {
        return IDBKeyRange.upperBound(start);
      } else {
        return IDBKeyRange.lowerBound(start);
      }
    } else if (end) {
      if (descending) {
        return IDBKeyRange.lowerBound(end, !inclusiveEnd);
      } else {
        return IDBKeyRange.upperBound(end, !inclusiveEnd);
      }
    } else if (key) {
      return IDBKeyRange.only(key);
    }
  } catch (e) {
    return {error: e};
  }
  return null;
}

function handleKeyRangeError(api, opts, err, callback) {
  if (err.name === "DataError" && err.code === 0) {
    // data error, start is less than end
    return callback(null, {
      total_rows: api._meta.docCount,
      offset: opts.skip,
      rows: []
    });
  }
  callback(pouchdbErrors.createError(pouchdbErrors.IDB_ERROR, err.name, err.message));
}

function idbAllDocs(opts, api, idb, callback) {

  function allDocsQuery(opts, callback) {
    var start = 'startkey' in opts ? opts.startkey : false;
    var end = 'endkey' in opts ? opts.endkey : false;
    var key = 'key' in opts ? opts.key : false;
    var skip = opts.skip || 0;
    var limit = typeof opts.limit === 'number' ? opts.limit : -1;
    var inclusiveEnd = opts.inclusive_end !== false;
    var descending = 'descending' in opts && opts.descending ? 'prev' : null;

    var keyRange = createKeyRange(start, end, inclusiveEnd, key, descending);
    if (keyRange && keyRange.error) {
      return handleKeyRangeError(api, opts, keyRange.error, callback);
    }

    var stores = [DOC_STORE, BY_SEQ_STORE];

    if (opts.attachments) {
      stores.push(ATTACH_STORE);
    }
    var txnResult = openTransactionSafely(idb, stores, 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    var docStore = txn.objectStore(DOC_STORE);
    var seqStore = txn.objectStore(BY_SEQ_STORE);
    var cursor = descending ?
      docStore.openCursor(keyRange, descending) :
      docStore.openCursor(keyRange);
    var docIdRevIndex = seqStore.index('_doc_id_rev');
    var results = [];
    var docCount = 0;

    // if the user specifies include_docs=true, then we don't
    // want to block the main cursor while we're fetching the doc
    function fetchDocAsynchronously(metadata, row, winningRev) {
      var key = metadata.id + "::" + winningRev;
      docIdRevIndex.get(key).onsuccess =  function onGetDoc(e) {
        row.doc = decodeDoc(e.target.result);
        if (opts.conflicts) {
          row.doc._conflicts = pouchdbMerge.collectConflicts(metadata);
        }
        fetchAttachmentsIfNecessary(row.doc, opts, txn);
      };
    }

    function allDocsInner(cursor, winningRev, metadata) {
      var row = {
        id: metadata.id,
        key: metadata.id,
        value: {
          rev: winningRev
        }
      };
      var deleted = metadata.deleted;
      if (opts.deleted === 'ok') {
        results.push(row);
        // deleted docs are okay with "keys" requests
        if (deleted) {
          row.value.deleted = true;
          row.doc = null;
        } else if (opts.include_docs) {
          fetchDocAsynchronously(metadata, row, winningRev);
        }
      } else if (!deleted && skip-- <= 0) {
        results.push(row);
        if (opts.include_docs) {
          fetchDocAsynchronously(metadata, row, winningRev);
        }
        if (--limit === 0) {
          return;
        }
      }
      cursor.continue();
    }

    function onGetCursor(e) {
      docCount = api._meta.docCount; // do this within the txn for consistency
      var cursor = e.target.result;
      if (!cursor) {
        return;
      }
      var metadata = decodeMetadata(cursor.value);
      var winningRev = metadata.winningRev;

      allDocsInner(cursor, winningRev, metadata);
    }

    function onResultsReady() {
      callback(null, {
        total_rows: docCount,
        offset: opts.skip,
        rows: results
      });
    }

    function onTxnComplete() {
      if (opts.attachments) {
        postProcessAttachments(results, opts.binary).then(onResultsReady);
      } else {
        onResultsReady();
      }
    }

    txn.oncomplete = onTxnComplete;
    cursor.onsuccess = onGetCursor;
  }

  function allDocs(opts, callback) {

    if (opts.limit === 0) {
      return callback(null, {
        total_rows: api._meta.docCount,
        offset: opts.skip,
        rows: []
      });
    }
    allDocsQuery(opts, callback);
  }

  allDocs(opts, callback);
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
function checkBlobSupport(txn) {
  return new Promise(function (resolve) {
    var blob = pouchdbBinaryUtils.blob(['']);
    txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

    txn.onabort = function (e) {
      // If the transaction aborts now its due to not being able to
      // write to the database, likely due to the disk being full
      e.preventDefault();
      e.stopPropagation();
      resolve(false);
    };

    txn.oncomplete = function () {
      var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
      var matchedEdge = navigator.userAgent.match(/Edge\//);
      // MS Edge pretends to be Chrome 42:
      // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
      resolve(matchedEdge || !matchedChrome ||
        parseInt(matchedChrome[1], 10) >= 43);
    };
  }).catch(function () {
    return false; // error, so assume unsupported
  });
}

var cachedDBs = new pouchdbCollections.Map();
var blobSupportPromise;
var idbChanges = new pouchdbUtils.changesHandler();
var openReqList = new pouchdbCollections.Map();

function IdbPouch(opts, callback) {
  var api = this;

  taskQueue.queue.push({
    action: function (thisCallback) {
      init(api, opts, thisCallback);
    },
    callback: callback
  });
  applyNext(api.constructor);
}

function init(api, opts, callback) {

  var dbName = opts.name;

  var idb = null;
  api._meta = null;

  // called when creating a fresh new database
  function createSchema(db) {
    var docStore = db.createObjectStore(DOC_STORE, {keyPath : 'id'});
    db.createObjectStore(BY_SEQ_STORE, {autoIncrement: true})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
    db.createObjectStore(ATTACH_STORE, {keyPath: 'digest'});
    db.createObjectStore(META_STORE, {keyPath: 'id', autoIncrement: false});
    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);

    // added in v2
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    // added in v3
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'});

    // added in v4
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 2
  // unfortunately "deletedOrLocal" is a misnomer now that we no longer
  // store local docs in the main doc-store, but whaddyagonnado
  function addDeletedOrLocalIndex(txn, callback) {
    var docStore = txn.objectStore(DOC_STORE);
    docStore.createIndex('deletedOrLocal', 'deletedOrLocal', {unique : false});

    docStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var deleted = pouchdbMerge.isDeleted(metadata);
        metadata.deletedOrLocal = deleted ? "1" : "0";
        docStore.put(metadata);
        cursor.continue();
      } else {
        callback();
      }
    };
  }

  // migration to version 3 (part 1)
  function createLocalStoreSchema(db) {
    db.createObjectStore(LOCAL_STORE, {keyPath: '_id'})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
  }

  // migration to version 3 (part 2)
  function migrateLocalStore(txn, cb) {
    var localStore = txn.objectStore(LOCAL_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var seqStore = txn.objectStore(BY_SEQ_STORE);

    var cursor = docStore.openCursor();
    cursor.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        var metadata = cursor.value;
        var docId = metadata.id;
        var local = pouchdbMerge.isLocalId(docId);
        var rev = pouchdbMerge.winningRev(metadata);
        if (local) {
          var docIdRev = docId + "::" + rev;
          // remove all seq entries
          // associated with this docId
          var start = docId + "::";
          var end = docId + "::~";
          var index = seqStore.index('_doc_id_rev');
          var range = IDBKeyRange.bound(start, end, false, false);
          var seqCursor = index.openCursor(range);
          seqCursor.onsuccess = function (e) {
            seqCursor = e.target.result;
            if (!seqCursor) {
              // done
              docStore.delete(cursor.primaryKey);
              cursor.continue();
            } else {
              var data = seqCursor.value;
              if (data._doc_id_rev === docIdRev) {
                localStore.put(data);
              }
              seqStore.delete(seqCursor.primaryKey);
              seqCursor.continue();
            }
          };
        } else {
          cursor.continue();
        }
      } else if (cb) {
        cb();
      }
    };
  }

  // migration to version 4 (part 1)
  function addAttachAndSeqStore(db) {
    var attAndSeqStore = db.createObjectStore(ATTACH_AND_SEQ_STORE,
      {autoIncrement: true});
    attAndSeqStore.createIndex('seq', 'seq');
    attAndSeqStore.createIndex('digestSeq', 'digestSeq', {unique: true});
  }

  // migration to version 4 (part 2)
  function migrateAttsAndSeqs(txn, callback) {
    var seqStore = txn.objectStore(BY_SEQ_STORE);
    var attStore = txn.objectStore(ATTACH_STORE);
    var attAndSeqStore = txn.objectStore(ATTACH_AND_SEQ_STORE);

    // need to actually populate the table. this is the expensive part,
    // so as an optimization, check first that this database even
    // contains attachments
    var req = attStore.count();
    req.onsuccess = function (e) {
      var count = e.target.result;
      if (!count) {
        return callback(); // done
      }

      seqStore.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) {
          return callback(); // done
        }
        var doc = cursor.value;
        var seq = cursor.primaryKey;
        var atts = Object.keys(doc._attachments || {});
        var digestMap = {};
        for (var j = 0; j < atts.length; j++) {
          var att = doc._attachments[atts[j]];
          digestMap[att.digest] = true; // uniq digests, just in case
        }
        var digests = Object.keys(digestMap);
        for (j = 0; j < digests.length; j++) {
          var digest = digests[j];
          attAndSeqStore.put({
            seq: seq,
            digestSeq: digest + '::' + seq
          });
        }
        cursor.continue();
      };
    };
  }

  // migration to version 5
  // Instead of relying on on-the-fly migration of metadata,
  // this brings the doc-store to its modern form:
  // - metadata.winningrev
  // - metadata.seq
  // - stringify the metadata when storing it
  function migrateMetadata(txn) {

    function decodeMetadataCompat(storedObject) {
      if (!storedObject.data) {
        // old format, when we didn't store it stringified
        storedObject.deleted = storedObject.deletedOrLocal === '1';
        return storedObject;
      }
      return decodeMetadata(storedObject);
    }

    // ensure that every metadata has a winningRev and seq,
    // which was previously created on-the-fly but better to migrate
    var bySeqStore = txn.objectStore(BY_SEQ_STORE);
    var docStore = txn.objectStore(DOC_STORE);
    var cursor = docStore.openCursor();
    cursor.onsuccess = function (e) {
      var cursor = e.target.result;
      if (!cursor) {
        return; // done
      }
      var metadata = decodeMetadataCompat(cursor.value);

      metadata.winningRev = metadata.winningRev ||
        pouchdbMerge.winningRev(metadata);

      function fetchMetadataSeq() {
        // metadata.seq was added post-3.2.0, so if it's missing,
        // we need to fetch it manually
        var start = metadata.id + '::';
        var end = metadata.id + '::\uffff';
        var req = bySeqStore.index('_doc_id_rev').openCursor(
          IDBKeyRange.bound(start, end));

        var metadataSeq = 0;
        req.onsuccess = function (e) {
          var cursor = e.target.result;
          if (!cursor) {
            metadata.seq = metadataSeq;
            return onGetMetadataSeq();
          }
          var seq = cursor.primaryKey;
          if (seq > metadataSeq) {
            metadataSeq = seq;
          }
          cursor.continue();
        };
      }

      function onGetMetadataSeq() {
        var metadataToStore = encodeMetadata(metadata,
          metadata.winningRev, metadata.deleted);

        var req = docStore.put(metadataToStore);
        req.onsuccess = function () {
          cursor.continue();
        };
      }

      if (metadata.seq) {
        return onGetMetadataSeq();
      }

      fetchMetadataSeq();
    };

  }

  api.type = function () {
    return 'idb';
  };

  api._id = pouchdbUtils.toPromise(function (callback) {
    callback(null, api._meta.instanceId);
  });

  api._bulkDocs = function idb_bulkDocs(req, reqOpts, callback) {
    idbBulkDocs(opts, req, reqOpts, api, idb, idbChanges, callback);
  };

  // First we look up the metadata in the ids database, then we fetch the
  // current revision(s) from the by sequence store
  api._get = function idb_get(id, opts, callback) {
    var doc;
    var metadata;
    var err;
    var txn = opts.ctx;
    if (!txn) {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }

    function finish() {
      callback(err, {doc: doc, metadata: metadata, ctx: txn});
    }

    txn.objectStore(DOC_STORE).get(id).onsuccess = function (e) {
      metadata = decodeMetadata(e.target.result);
      // we can determine the result here if:
      // 1. there is no such document
      // 2. the document is deleted and we don't ask about specific rev
      // When we ask with opts.rev we expect the answer to be either
      // doc (possibly with _deleted=true) or missing error
      if (!metadata) {
        err = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, 'missing');
        return finish();
      }
      if (pouchdbMerge.isDeleted(metadata) && !opts.rev) {
        err = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, "deleted");
        return finish();
      }
      var objectStore = txn.objectStore(BY_SEQ_STORE);

      var rev = opts.rev || metadata.winningRev;
      var key = metadata.id + '::' + rev;

      objectStore.index('_doc_id_rev').get(key).onsuccess = function (e) {
        doc = e.target.result;
        if (doc) {
          doc = decodeDoc(doc);
        }
        if (!doc) {
          err = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, 'missing');
          return finish();
        }
        finish();
      };
    };
  };

  api._getAttachment = function (docId, attachId, attachment, opts, callback) {
    var txn;
    if (opts.ctx) {
      txn = opts.ctx;
    } else {
      var txnResult = openTransactionSafely(idb,
        [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      txn = txnResult.txn;
    }
    var digest = attachment.digest;
    var type = attachment.content_type;

    txn.objectStore(ATTACH_STORE).get(digest).onsuccess = function (e) {
      var body = e.target.result.body;
      readBlobData(body, type, opts.binary, function (blobData) {
        callback(null, blobData);
      });
    };
  };

  api._info = function idb_info(callback) {

    if (idb === null || !cachedDBs.has(dbName)) {
      var error = new Error('db isn\'t open');
      error.id = 'idbNull';
      return callback(error);
    }
    var updateSeq;
    var docCount;

    var txnResult = openTransactionSafely(idb, [BY_SEQ_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    var cursor = txn.objectStore(BY_SEQ_STORE).openCursor(null, 'prev');
    cursor.onsuccess = function (event) {
      var cursor = event.target.result;
      updateSeq = cursor ? cursor.key : 0;
      // count within the same txn for consistency
      docCount = api._meta.docCount;
    };

    txn.oncomplete = function () {
      callback(null, {
        doc_count: docCount,
        update_seq: updateSeq,
        // for debugging
        idb_attachment_format: (api._meta.blobSupport ? 'binary' : 'base64')
      });
    };
  };

  api._allDocs = function idb_allDocs(opts, callback) {
    idbAllDocs(opts, api, idb, callback);
  };

  api._changes = function (opts) {
    opts = pouchdbUtils.clone(opts);

    if (opts.continuous) {
      var id = dbName + ':' + pouchdbUtils.uuid();
      idbChanges.addListener(dbName, id, api, opts);
      idbChanges.notify(dbName);
      return {
        cancel: function () {
          idbChanges.removeListener(dbName, id);
        }
      };
    }

    var docIds = opts.doc_ids && new pouchdbCollections.Set(opts.doc_ids);

    opts.since = opts.since || 0;
    var lastSeq = opts.since;

    var limit = 'limit' in opts ? opts.limit : -1;
    if (limit === 0) {
      limit = 1; // per CouchDB _changes spec
    }
    var returnDocs;
    if ('return_docs' in opts) {
      returnDocs = opts.return_docs;
    } else if ('returnDocs' in opts) {
      // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
      returnDocs = opts.returnDocs;
    } else {
      returnDocs = true;
    }

    var results = [];
    var numResults = 0;
    var filter = pouchdbUtils.filterChange(opts);
    var docIdsToMetadata = new pouchdbCollections.Map();

    var txn;
    var bySeqStore;
    var docStore;
    var docIdRevIndex;

    function onGetCursor(cursor) {

      var doc = decodeDoc(cursor.value);
      var seq = cursor.key;

      if (docIds && !docIds.has(doc._id)) {
        return cursor.continue();
      }

      var metadata;

      function onGetMetadata() {
        if (metadata.seq !== seq) {
          // some other seq is later
          return cursor.continue();
        }

        lastSeq = seq;

        if (metadata.winningRev === doc._rev) {
          return onGetWinningDoc(doc);
        }

        fetchWinningDoc();
      }

      function fetchWinningDoc() {
        var docIdRev = doc._id + '::' + metadata.winningRev;
        var req = docIdRevIndex.get(docIdRev);
        req.onsuccess = function (e) {
          onGetWinningDoc(decodeDoc(e.target.result));
        };
      }

      function onGetWinningDoc(winningDoc) {

        var change = opts.processChange(winningDoc, metadata, opts);
        change.seq = metadata.seq;

        var filtered = filter(change);
        if (typeof filtered === 'object') {
          return opts.complete(filtered);
        }

        if (filtered) {
          numResults++;
          if (returnDocs) {
            results.push(change);
          }
          // process the attachment immediately
          // for the benefit of live listeners
          if (opts.attachments && opts.include_docs) {
            fetchAttachmentsIfNecessary(winningDoc, opts, txn, function () {
              postProcessAttachments([change], opts.binary).then(function () {
                opts.onChange(change);
              });
            });
          } else {
            opts.onChange(change);
          }
        }
        if (numResults !== limit) {
          cursor.continue();
        }
      }

      metadata = docIdsToMetadata.get(doc._id);
      if (metadata) { // cached
        return onGetMetadata();
      }
      // metadata not cached, have to go fetch it
      docStore.get(doc._id).onsuccess = function (event) {
        metadata = decodeMetadata(event.target.result);
        docIdsToMetadata.set(doc._id, metadata);
        onGetMetadata();
      };
    }

    function onsuccess(event) {
      var cursor = event.target.result;

      if (!cursor) {
        return;
      }
      onGetCursor(cursor);
    }

    function fetchChanges() {
      var objectStores = [DOC_STORE, BY_SEQ_STORE];
      if (opts.attachments) {
        objectStores.push(ATTACH_STORE);
      }
      var txnResult = openTransactionSafely(idb, objectStores, 'readonly');
      if (txnResult.error) {
        return opts.complete(txnResult.error);
      }
      txn = txnResult.txn;
      txn.onabort = idbError(opts.complete);
      txn.oncomplete = onTxnComplete;

      bySeqStore = txn.objectStore(BY_SEQ_STORE);
      docStore = txn.objectStore(DOC_STORE);
      docIdRevIndex = bySeqStore.index('_doc_id_rev');

      var req;

      if (opts.descending) {
        req = bySeqStore.openCursor(null, 'prev');
      } else {
        req = bySeqStore.openCursor(IDBKeyRange.lowerBound(opts.since, true));
      }

      req.onsuccess = onsuccess;
    }

    fetchChanges();

    function onTxnComplete() {

      function finish() {
        opts.complete(null, {
          results: results,
          last_seq: lastSeq
        });
      }

      if (!opts.continuous && opts.attachments) {
        // cannot guarantee that postProcessing was already done,
        // so do it again
        postProcessAttachments(results).then(finish);
      } else {
        finish();
      }
    }
  };

  api._close = function (callback) {
    if (idb === null) {
      return callback(pouchdbErrors.createError(pouchdbErrors.NOT_OPEN));
    }

    // https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
    // "Returns immediately and closes the connection in a separate thread..."
    idb.close();
    cachedDBs.delete(dbName);
    idb = null;
    callback();
  };

  api._getRevisionTree = function (docId, callback) {
    var txnResult = openTransactionSafely(idb, [DOC_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;
    var req = txn.objectStore(DOC_STORE).get(docId);
    req.onsuccess = function (event) {
      var doc = decodeMetadata(event.target.result);
      if (!doc) {
        callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
      } else {
        callback(null, doc.rev_tree);
      }
    };
  };

  // This function removes revisions of document docId
  // which are listed in revs and sets this document
  // revision to to rev_tree
  api._doCompaction = function (docId, revs, callback) {
    var stores = [
      DOC_STORE,
      BY_SEQ_STORE,
      ATTACH_STORE,
      ATTACH_AND_SEQ_STORE
    ];
    var txnResult = openTransactionSafely(idb, stores, 'readwrite');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var txn = txnResult.txn;

    var docStore = txn.objectStore(DOC_STORE);

    docStore.get(docId).onsuccess = function (event) {
      var metadata = decodeMetadata(event.target.result);
      pouchdbMerge.traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                                         revHash, ctx, opts) {
        var rev = pos + '-' + revHash;
        if (revs.indexOf(rev) !== -1) {
          opts.status = 'missing';
        }
      });
      compactRevs(revs, docId, txn);
      var winningRev = metadata.winningRev;
      var deleted = metadata.deleted;
      txn.objectStore(DOC_STORE).put(
        encodeMetadata(metadata, winningRev, deleted));
    };
    txn.onabort = idbError(callback);
    txn.oncomplete = function () {
      callback();
    };
  };


  api._getLocal = function (id, callback) {
    var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readonly');
    if (txnResult.error) {
      return callback(txnResult.error);
    }
    var tx = txnResult.txn;
    var req = tx.objectStore(LOCAL_STORE).get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var doc = e.target.result;
      if (!doc) {
        callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
      } else {
        delete doc['_doc_id_rev']; // for backwards compat
        callback(null, doc);
      }
    };
  };

  api._putLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    delete doc._revisions; // ignore this, trust the rev
    var oldRev = doc._rev;
    var id = doc._id;
    if (!oldRev) {
      doc._rev = '0-1';
    } else {
      doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
    }

    var tx = opts.ctx;
    var ret;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.onerror = idbError(callback);
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }

    var oStore = tx.objectStore(LOCAL_STORE);
    var req;
    if (oldRev) {
      req = oStore.get(id);
      req.onsuccess = function (e) {
        var oldDoc = e.target.result;
        if (!oldDoc || oldDoc._rev !== oldRev) {
          callback(pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT));
        } else { // update
          var req = oStore.put(doc);
          req.onsuccess = function () {
            ret = {ok: true, id: doc._id, rev: doc._rev};
            if (opts.ctx) { // return immediately
              callback(null, ret);
            }
          };
        }
      };
    } else { // new doc
      req = oStore.add(doc);
      req.onerror = function (e) {
        // constraint error, already exists
        callback(pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT));
        e.preventDefault(); // avoid transaction abort
        e.stopPropagation(); // avoid transaction onerror
      };
      req.onsuccess = function () {
        ret = {ok: true, id: doc._id, rev: doc._rev};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      };
    }
  };

  api._removeLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var tx = opts.ctx;
    if (!tx) {
      var txnResult = openTransactionSafely(idb, [LOCAL_STORE], 'readwrite');
      if (txnResult.error) {
        return callback(txnResult.error);
      }
      tx = txnResult.txn;
      tx.oncomplete = function () {
        if (ret) {
          callback(null, ret);
        }
      };
    }
    var ret;
    var id = doc._id;
    var oStore = tx.objectStore(LOCAL_STORE);
    var req = oStore.get(id);

    req.onerror = idbError(callback);
    req.onsuccess = function (e) {
      var oldDoc = e.target.result;
      if (!oldDoc || oldDoc._rev !== doc._rev) {
        callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
      } else {
        oStore.delete(id);
        ret = {ok: true, id: id, rev: '0-0'};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      }
    };
  };

  api._destroy = function (opts, callback) {
    idbChanges.removeAllListeners(dbName);

    //Close open request for "dbName" database to fix ie delay.
    var openReq = openReqList.get(dbName);
    if (openReq && openReq.result) {
      openReq.result.close();
      cachedDBs.delete(dbName);
    }
    var req = indexedDB.deleteDatabase(dbName);

    req.onsuccess = function () {
      //Remove open request from the list.
      openReqList.delete(dbName);
      if (pouchdbUtils.hasLocalStorage() && (dbName in localStorage)) {
        delete localStorage[dbName];
      }
      callback(null, { 'ok': true });
    };

    req.onerror = idbError(callback);
  };

  var cached = cachedDBs.get(dbName);

  if (cached) {
    idb = cached.idb;
    api._meta = cached.global;
    process.nextTick(function () {
      callback(null, api);
    });
    return;
  }

  var req;
  if (opts.storage) {
    req = tryStorageOption(dbName, opts.storage);
  } else {
    req = indexedDB.open(dbName, ADAPTER_VERSION);
  }

  openReqList.set(dbName, req);

  req.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (e.oldVersion < 1) {
      return createSchema(db); // new db, initial schema
    }
    // do migrations

    var txn = e.currentTarget.transaction;
    // these migrations have to be done in this function, before
    // control is returned to the event loop, because IndexedDB

    if (e.oldVersion < 3) {
      createLocalStoreSchema(db); // v2 -> v3
    }
    if (e.oldVersion < 4) {
      addAttachAndSeqStore(db); // v3 -> v4
    }

    var migrations = [
      addDeletedOrLocalIndex, // v1 -> v2
      migrateLocalStore,      // v2 -> v3
      migrateAttsAndSeqs,     // v3 -> v4
      migrateMetadata         // v4 -> v5
    ];

    var i = e.oldVersion;

    function next() {
      var migration = migrations[i - 1];
      i++;
      if (migration) {
        migration(txn, next);
      }
    }

    next();
  };

  req.onsuccess = function (e) {

    idb = e.target.result;

    idb.onversionchange = function () {
      idb.close();
      cachedDBs.delete(dbName);
    };

    idb.onabort = function (e) {
      pouchdbUtils.guardedConsole('error', 'Database has a global failure', e.target.error);
      idb.close();
      cachedDBs.delete(dbName);
    };

    var txn = idb.transaction([
      META_STORE,
      DETECT_BLOB_SUPPORT_STORE,
      DOC_STORE
    ], 'readwrite');

    var req = txn.objectStore(META_STORE).get(META_STORE);

    var blobSupport = null;
    var docCount = null;
    var instanceId = null;

    req.onsuccess = function (e) {

      var checkSetupComplete = function () {
        if (blobSupport === null || docCount === null ||
            instanceId === null) {
          return;
        } else {
          api._meta = {
            name: dbName,
            instanceId: instanceId,
            blobSupport: blobSupport,
            docCount: docCount
          };

          cachedDBs.set(dbName, {
            idb: idb,
            global: api._meta
          });
          callback(null, api);
        }
      };

      //
      // fetch/store the id
      //

      var meta = e.target.result || {id: META_STORE};
      if (dbName  + '_id' in meta) {
        instanceId = meta[dbName + '_id'];
        checkSetupComplete();
      } else {
        instanceId = pouchdbUtils.uuid();
        meta[dbName + '_id'] = instanceId;
        txn.objectStore(META_STORE).put(meta).onsuccess = function () {
          checkSetupComplete();
        };
      }

      //
      // check blob support
      //

      if (!blobSupportPromise) {
        // make sure blob support is only checked once
        blobSupportPromise = checkBlobSupport(txn);
      }

      blobSupportPromise.then(function (val) {
        blobSupport = val;
        checkSetupComplete();
      });

      //
      // count docs
      //

      var index = txn.objectStore(DOC_STORE).index('deletedOrLocal');
      index.count(IDBKeyRange.only('0')).onsuccess = function (e) {
        docCount = e.target.result;
        checkSetupComplete();
      };

    };
  };

  req.onerror = function () {
    var msg = 'Failed to open indexedDB, are you in private browsing mode?';
    pouchdbUtils.guardedConsole('error', msg);
    callback(pouchdbErrors.createError(pouchdbErrors.IDB_ERROR, msg));
  };
}

IdbPouch.valid = function () {
  // Issue #2533, we finally gave up on doing bug
  // detection instead of browser sniffing. Safari brought us
  // to our knees.
  var isSafari = typeof openDatabase !== 'undefined' &&
    /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent) &&
    !/BlackBerry/.test(navigator.platform);

  // some outdated implementations of IDB that appear on Samsung
  // and HTC Android devices <4.4 are missing IDBKeyRange
  return !isSafari && typeof indexedDB !== 'undefined' &&
    typeof IDBKeyRange !== 'undefined';
};

function tryStorageOption(dbName, storage) {
  try { // option only available in Firefox 26+
    return indexedDB.open(dbName, {
      version: ADAPTER_VERSION,
      storage: storage
    });
  } catch(err) {
      return indexedDB.open(dbName, ADAPTER_VERSION);
  }
}

function index (PouchDB) {
  PouchDB.adapter('idb', IdbPouch, true);
}

module.exports = index;
}).call(this,require('_process'))
},{"_process":5,"js-extend":24,"pouchdb-adapter-utils":30,"pouchdb-binary-utils":34,"pouchdb-collections":39,"pouchdb-errors":41,"pouchdb-json":43,"pouchdb-merge":47,"pouchdb-promise":48,"pouchdb-utils":50}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pouchdbUtils = require('pouchdb-utils');
var pouchdbErrors = require('pouchdb-errors');
var pouchdbMerge = require('pouchdb-merge');
var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var pouchdbMd5 = require('pouchdb-md5');
var pouchdbCollections = require('pouchdb-collections');

function toObject(array) {
  return array.reduce(function (obj, item) {
    obj[item] = true;
    return obj;
  }, {});
}
// List of top level reserved words for doc
var reservedWords = toObject([
  '_id',
  '_rev',
  '_attachments',
  '_deleted',
  '_revisions',
  '_revs_info',
  '_conflicts',
  '_deleted_conflicts',
  '_local_seq',
  '_rev_tree',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats',
  // Specific to Couchbase Sync Gateway
  '_removed'
]);

// List of reserved words that should end up the document
var dataWords = toObject([
  '_attachments',
  //replication documents
  '_replication_id',
  '_replication_state',
  '_replication_state_time',
  '_replication_state_reason',
  '_replication_stats'
]);

function parseRevisionInfo(rev) {
  if (!/^\d+\-./.test(rev)) {
    return pouchdbErrors.createError(pouchdbErrors.INVALID_REV);
  }
  var idx = rev.indexOf('-');
  var left = rev.substring(0, idx);
  var right = rev.substring(idx + 1);
  return {
    prefix: parseInt(left, 10),
    id: right
  };
}

function makeRevTreeFromRevisions(revisions, opts) {
  var pos = revisions.start - revisions.ids.length + 1;

  var revisionIds = revisions.ids;
  var ids = [revisionIds[0], opts, []];

  for (var i = 1, len = revisionIds.length; i < len; i++) {
    ids = [revisionIds[i], {status: 'missing'}, [ids]];
  }

  return [{
    pos: pos,
    ids: ids
  }];
}

// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
function parseDoc(doc, newEdits) {

  var nRevNum;
  var newRevId;
  var revInfo;
  var opts = {status: 'available'};
  if (doc._deleted) {
    opts.deleted = true;
  }

  if (newEdits) {
    if (!doc._id) {
      doc._id = pouchdbUtils.uuid();
    }
    newRevId = pouchdbUtils.uuid(32, 16).toLowerCase();
    if (doc._rev) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      doc._rev_tree = [{
        pos: revInfo.prefix,
        ids: [revInfo.id, {status: 'missing'}, [[newRevId, opts, []]]]
      }];
      nRevNum = revInfo.prefix + 1;
    } else {
      doc._rev_tree = [{
        pos: 1,
        ids : [newRevId, opts, []]
      }];
      nRevNum = 1;
    }
  } else {
    if (doc._revisions) {
      doc._rev_tree = makeRevTreeFromRevisions(doc._revisions, opts);
      nRevNum = doc._revisions.start;
      newRevId = doc._revisions.ids[0];
    }
    if (!doc._rev_tree) {
      revInfo = parseRevisionInfo(doc._rev);
      if (revInfo.error) {
        return revInfo;
      }
      nRevNum = revInfo.prefix;
      newRevId = revInfo.id;
      doc._rev_tree = [{
        pos: nRevNum,
        ids: [newRevId, opts, []]
      }];
    }
  }

  pouchdbUtils.invalidIdError(doc._id);

  doc._rev = nRevNum + '-' + newRevId;

  var result = {metadata : {}, data : {}};
  for (var key in doc) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(doc, key)) {
      var specialKey = key[0] === '_';
      if (specialKey && !reservedWords[key]) {
        var error = pouchdbErrors.createError(pouchdbErrors.DOC_VALIDATION, key);
        error.message = pouchdbErrors.DOC_VALIDATION.message + ': ' + key;
        throw error;
      } else if (specialKey && !dataWords[key]) {
        result.metadata[key.slice(1)] = doc[key];
      } else {
        result.data[key] = doc[key];
      }
    }
  }
  return result;
}

function parseBase64(data) {
  try {
    return pouchdbBinaryUtils.atob(data);
  } catch (e) {
    var err = pouchdbErrors.createError(pouchdbErrors.BAD_ARG,
      'Attachment is not a valid base64 string');
    return {error: err};
  }
}

function preprocessString(att, blobType, callback) {
  var asBinary = parseBase64(att.data);
  if (asBinary.error) {
    return callback(asBinary.error);
  }

  att.length = asBinary.length;
  if (blobType === 'blob') {
    att.data = pouchdbBinaryUtils.binaryStringToBlobOrBuffer(asBinary, att.content_type);
  } else if (blobType === 'base64') {
    att.data = pouchdbBinaryUtils.btoa(asBinary);
  } else { // binary
    att.data = asBinary;
  }
  pouchdbMd5.binaryMd5(asBinary, function (result) {
    att.digest = 'md5-' + result;
    callback();
  });
}

function preprocessBlob(att, blobType, callback) {
  pouchdbMd5.binaryMd5(att.data, function (md5) {
    att.digest = 'md5-' + md5;
    // size is for blobs (browser), length is for buffers (node)
    att.length = att.data.size || att.data.length || 0;
    if (blobType === 'binary') {
      pouchdbBinaryUtils.blobOrBufferToBinaryString(att.data, function (binString) {
        att.data = binString;
        callback();
      });
    } else if (blobType === 'base64') {
      pouchdbBinaryUtils.blobOrBufferToBase64(att.data, function (b64) {
        att.data = b64;
        callback();
      });
    } else {
      callback();
    }
  });
}

function preprocessAttachment(att, blobType, callback) {
  if (att.stub) {
    return callback();
  }
  if (typeof att.data === 'string') { // input is a base64 string
    preprocessString(att, blobType, callback);
  } else { // input is a blob
    preprocessBlob(att, blobType, callback);
  }
}

function preprocessAttachments(docInfos, blobType, callback) {

  if (!docInfos.length) {
    return callback();
  }

  var docv = 0;
  var overallErr;

  docInfos.forEach(function (docInfo) {
    var attachments = docInfo.data && docInfo.data._attachments ?
      Object.keys(docInfo.data._attachments) : [];
    var recv = 0;

    if (!attachments.length) {
      return done();
    }

    function processedAttachment(err) {
      overallErr = err;
      recv++;
      if (recv === attachments.length) {
        done();
      }
    }

    for (var key in docInfo.data._attachments) {
      if (docInfo.data._attachments.hasOwnProperty(key)) {
        preprocessAttachment(docInfo.data._attachments[key],
          blobType, processedAttachment);
      }
    }
  });

  function done() {
    docv++;
    if (docInfos.length === docv) {
      if (overallErr) {
        callback(overallErr);
      } else {
        callback();
      }
    }
  }
}

function updateDoc(revLimit, prev, docInfo, results,
                   i, cb, writeDoc, newEdits) {

  if (pouchdbMerge.revExists(prev.rev_tree, docInfo.metadata.rev)) {
    results[i] = docInfo;
    return cb();
  }

  // sometimes this is pre-calculated. historically not always
  var previousWinningRev = prev.winningRev || pouchdbMerge.winningRev(prev);
  var previouslyDeleted = 'deleted' in prev ? prev.deleted :
    pouchdbMerge.isDeleted(prev, previousWinningRev);
  var deleted = 'deleted' in docInfo.metadata ? docInfo.metadata.deleted :
    pouchdbMerge.isDeleted(docInfo.metadata);
  var isRoot = /^1-/.test(docInfo.metadata.rev);

  if (previouslyDeleted && !deleted && newEdits && isRoot) {
    var newDoc = docInfo.data;
    newDoc._rev = previousWinningRev;
    newDoc._id = docInfo.metadata.id;
    docInfo = parseDoc(newDoc, newEdits);
  }

  var merged = pouchdbMerge.merge(prev.rev_tree, docInfo.metadata.rev_tree[0], revLimit);

  var inConflict = newEdits && (((previouslyDeleted && deleted) ||
    (!previouslyDeleted && merged.conflicts !== 'new_leaf') ||
    (previouslyDeleted && !deleted && merged.conflicts === 'new_branch')));

  if (inConflict) {
    var err = pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT);
    results[i] = err;
    return cb();
  }

  var newRev = docInfo.metadata.rev;
  docInfo.metadata.rev_tree = merged.tree;
  docInfo.stemmedRevs = merged.stemmedRevs || [];
  /* istanbul ignore else */
  if (prev.rev_map) {
    docInfo.metadata.rev_map = prev.rev_map; // used only by leveldb
  }

  // recalculate
  var winningRev = pouchdbMerge.winningRev(docInfo.metadata);
  var winningRevIsDeleted = pouchdbMerge.isDeleted(docInfo.metadata, winningRev);

  // calculate the total number of documents that were added/removed,
  // from the perspective of total_rows/doc_count
  var delta = (previouslyDeleted === winningRevIsDeleted) ? 0 :
    previouslyDeleted < winningRevIsDeleted ? -1 : 1;

  var newRevIsDeleted;
  if (newRev === winningRev) {
    // if the new rev is the same as the winning rev, we can reuse that value
    newRevIsDeleted = winningRevIsDeleted;
  } else {
    // if they're not the same, then we need to recalculate
    newRevIsDeleted = pouchdbMerge.isDeleted(docInfo.metadata, newRev);
  }

  writeDoc(docInfo, winningRev, winningRevIsDeleted, newRevIsDeleted,
    true, delta, i, cb);
}

function rootIsMissing(docInfo) {
  return docInfo.metadata.rev_tree[0].ids[1].status === 'missing';
}

function processDocs(revLimit, docInfos, api, fetchedDocs, tx, results,
                     writeDoc, opts, overallCallback) {

  // Default to 1000 locally
  revLimit = revLimit || 1000;

  function insertDoc(docInfo, resultsIdx, callback) {
    // Cant insert new deleted documents
    var winningRev = pouchdbMerge.winningRev(docInfo.metadata);
    var deleted = pouchdbMerge.isDeleted(docInfo.metadata, winningRev);
    if ('was_delete' in opts && deleted) {
      results[resultsIdx] = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, 'deleted');
      return callback();
    }

    // 4712 - detect whether a new document was inserted with a _rev
    var inConflict = newEdits && rootIsMissing(docInfo);

    if (inConflict) {
      var err = pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT);
      results[resultsIdx] = err;
      return callback();
    }

    var delta = deleted ? 0 : 1;

    writeDoc(docInfo, winningRev, deleted, deleted, false,
      delta, resultsIdx, callback);
  }

  var newEdits = opts.new_edits;
  var idsToDocs = new pouchdbCollections.Map();

  var docsDone = 0;
  var docsToDo = docInfos.length;

  function checkAllDocsDone() {
    if (++docsDone === docsToDo && overallCallback) {
      overallCallback();
    }
  }

  docInfos.forEach(function (currentDoc, resultsIdx) {

    if (currentDoc._id && pouchdbMerge.isLocalId(currentDoc._id)) {
      var fun = currentDoc._deleted ? '_removeLocal' : '_putLocal';
      api[fun](currentDoc, {ctx: tx}, function (err, res) {
        results[resultsIdx] = err || res;
        checkAllDocsDone();
      });
      return;
    }

    var id = currentDoc.metadata.id;
    if (idsToDocs.has(id)) {
      docsToDo--; // duplicate
      idsToDocs.get(id).push([currentDoc, resultsIdx]);
    } else {
      idsToDocs.set(id, [[currentDoc, resultsIdx]]);
    }
  });

  // in the case of new_edits, the user can provide multiple docs
  // with the same id. these need to be processed sequentially
  idsToDocs.forEach(function (docs, id) {
    var numDone = 0;

    function docWritten() {
      if (++numDone < docs.length) {
        nextDoc();
      } else {
        checkAllDocsDone();
      }
    }
    function nextDoc() {
      var value = docs[numDone];
      var currentDoc = value[0];
      var resultsIdx = value[1];

      if (fetchedDocs.has(id)) {
        updateDoc(revLimit, fetchedDocs.get(id), currentDoc, results,
          resultsIdx, docWritten, writeDoc, newEdits);
      } else {
        // Ensure stemming applies to new writes as well
        var merged = pouchdbMerge.merge([], currentDoc.metadata.rev_tree[0], revLimit);
        currentDoc.metadata.rev_tree = merged.tree;
        currentDoc.stemmedRevs = merged.stemmedRevs || [];
        insertDoc(currentDoc, resultsIdx, docWritten);
      }
    }
    nextDoc();
  });
}

exports.invalidIdError = pouchdbUtils.invalidIdError;
exports.isDeleted = pouchdbMerge.isDeleted;
exports.isLocalId = pouchdbMerge.isLocalId;
exports.normalizeDdocFunctionName = pouchdbUtils.normalizeDdocFunctionName;
exports.parseDdocFunctionName = pouchdbUtils.parseDdocFunctionName;
exports.parseDoc = parseDoc;
exports.preprocessAttachments = preprocessAttachments;
exports.processDocs = processDocs;
exports.updateDoc = updateDoc;
},{"pouchdb-binary-utils":34,"pouchdb-collections":39,"pouchdb-errors":41,"pouchdb-md5":46,"pouchdb-merge":47,"pouchdb-utils":50}],31:[function(require,module,exports){
'use strict';

var jsExtend = require('js-extend');
var pouchdbUtils = require('pouchdb-utils');
var pouchdbAdapterUtils = require('pouchdb-adapter-utils');
var pouchdbMerge = require('pouchdb-merge');
var pouchdbJson = require('pouchdb-json');
var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var pouchdbCollections = require('pouchdb-collections');
var pouchdbErrors = require('pouchdb-errors');

//
// Parsing hex strings. Yeah.
//
// So basically we need this because of a bug in WebSQL:
// https://code.google.com/p/chromium/issues/detail?id=422690
// https://bugs.webkit.org/show_bug.cgi?id=137637
//
// UTF-8 and UTF-16 are provided as separate functions
// for meager performance improvements
//

function decodeUtf8(str) {
  return decodeURIComponent(escape(str));
}

function hexToInt(charCode) {
  // '0'-'9' is 48-57
  // 'A'-'F' is 65-70
  // SQLite will only give us uppercase hex
  return charCode < 65 ? (charCode - 48) : (charCode - 55);
}


// Example:
// pragma encoding=utf8;
// select hex('A');
// returns '41'
function parseHexUtf8(str, start, end) {
  var result = '';
  while (start < end) {
    result += String.fromCharCode(
      (hexToInt(str.charCodeAt(start++)) << 4) |
        hexToInt(str.charCodeAt(start++)));
  }
  return result;
}

// Example:
// pragma encoding=utf16;
// select hex('A');
// returns '4100'
// notice that the 00 comes after the 41 (i.e. it's swizzled)
function parseHexUtf16(str, start, end) {
  var result = '';
  while (start < end) {
    // UTF-16, so swizzle the bytes
    result += String.fromCharCode(
      (hexToInt(str.charCodeAt(start + 2)) << 12) |
        (hexToInt(str.charCodeAt(start + 3)) << 8) |
        (hexToInt(str.charCodeAt(start)) << 4) |
        hexToInt(str.charCodeAt(start + 1)));
    start += 4;
  }
  return result;
}

function parseHexString(str, encoding) {
  if (encoding === 'UTF-8') {
    return decodeUtf8(parseHexUtf8(str, 0, str.length));
  } else {
    return parseHexUtf16(str, 0, str.length);
  }
}

function quote(str) {
  return "'" + str + "'";
}

var ADAPTER_VERSION = 7; // used to manage migrations

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
var DOC_STORE = quote('document-store');
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE = quote('by-sequence');
// Where we store attachments
var ATTACH_STORE = quote('attach-store');
var LOCAL_STORE = quote('local-store');
var META_STORE = quote('metadata-store');
// where we store many-to-many relations between attachment
// digests and seqs
var ATTACH_AND_SEQ_STORE = quote('attach-seq-store');

// escapeBlob and unescapeBlob are workarounds for a websql bug:
// https://code.google.com/p/chromium/issues/detail?id=422690
// https://bugs.webkit.org/show_bug.cgi?id=137637
// The goal is to never actually insert the \u0000 character
// in the database.
function escapeBlob(str) {
  return str
    .replace(/\u0002/g, '\u0002\u0002')
    .replace(/\u0001/g, '\u0001\u0002')
    .replace(/\u0000/g, '\u0001\u0001');
}

function unescapeBlob(str) {
  return str
    .replace(/\u0001\u0001/g, '\u0000')
    .replace(/\u0001\u0002/g, '\u0001')
    .replace(/\u0002\u0002/g, '\u0002');
}

function stringifyDoc(doc) {
  // don't bother storing the id/rev. it uses lots of space,
  // in persistent map/reduce especially
  delete doc._id;
  delete doc._rev;
  return JSON.stringify(doc);
}

function unstringifyDoc(doc, id, rev) {
  doc = JSON.parse(doc);
  doc._id = id;
  doc._rev = rev;
  return doc;
}

// question mark groups IN queries, e.g. 3 -> '(?,?,?)'
function qMarks(num) {
  var s = '(';
  while (num--) {
    s += '?';
    if (num) {
      s += ',';
    }
  }
  return s + ')';
}

function select(selector, table, joiner, where, orderBy) {
  return 'SELECT ' + selector + ' FROM ' +
    (typeof table === 'string' ? table : table.join(' JOIN ')) +
    (joiner ? (' ON ' + joiner) : '') +
    (where ? (' WHERE ' +
    (typeof where === 'string' ? where : where.join(' AND '))) : '') +
    (orderBy ? (' ORDER BY ' + orderBy) : '');
}

function compactRevs(revs, docId, tx) {

  if (!revs.length) {
    return;
  }

  var numDone = 0;
  var seqs = [];

  function checkDone() {
    if (++numDone === revs.length) { // done
      deleteOrphans();
    }
  }

  function deleteOrphans() {
    // find orphaned attachment digests

    if (!seqs.length) {
      return;
    }

    var sql = 'SELECT DISTINCT digest AS digest FROM ' +
      ATTACH_AND_SEQ_STORE + ' WHERE seq IN ' + qMarks(seqs.length);

    tx.executeSql(sql, seqs, function (tx, res) {

      var digestsToCheck = [];
      for (var i = 0; i < res.rows.length; i++) {
        digestsToCheck.push(res.rows.item(i).digest);
      }
      if (!digestsToCheck.length) {
        return;
      }

      var sql = 'DELETE FROM ' + ATTACH_AND_SEQ_STORE +
        ' WHERE seq IN (' +
        seqs.map(function () { return '?'; }).join(',') +
        ')';
      tx.executeSql(sql, seqs, function (tx) {

        var sql = 'SELECT digest FROM ' + ATTACH_AND_SEQ_STORE +
          ' WHERE digest IN (' +
          digestsToCheck.map(function () { return '?'; }).join(',') +
          ')';
        tx.executeSql(sql, digestsToCheck, function (tx, res) {
          var nonOrphanedDigests = new pouchdbCollections.Set();
          for (var i = 0; i < res.rows.length; i++) {
            nonOrphanedDigests.add(res.rows.item(i).digest);
          }
          digestsToCheck.forEach(function (digest) {
            if (nonOrphanedDigests.has(digest)) {
              return;
            }
            tx.executeSql(
              'DELETE FROM ' + ATTACH_AND_SEQ_STORE + ' WHERE digest=?',
              [digest]);
            tx.executeSql(
              'DELETE FROM ' + ATTACH_STORE + ' WHERE digest=?', [digest]);
          });
        });
      });
    });
  }

  // update by-seq and attach stores in parallel
  revs.forEach(function (rev) {
    var sql = 'SELECT seq FROM ' + BY_SEQ_STORE +
      ' WHERE doc_id=? AND rev=?';

    tx.executeSql(sql, [docId, rev], function (tx, res) {
      if (!res.rows.length) { // already deleted
        return checkDone();
      }
      var seq = res.rows.item(0).seq;
      seqs.push(seq);

      tx.executeSql(
        'DELETE FROM ' + BY_SEQ_STORE + ' WHERE seq=?', [seq], checkDone);
    });
  });
}

function websqlError(callback) {
  return function (event) {
    pouchdbUtils.guardedConsole('error', 'WebSQL threw an error', event);
    // event may actually be a SQLError object, so report is as such
    var errorNameMatch = event && event.constructor.toString()
        .match(/function ([^\(]+)/);
    var errorName = (errorNameMatch && errorNameMatch[1]) || event.type;
    var errorReason = event.target || event.message;
    callback(pouchdbErrors.createError(pouchdbErrors.WSQ_ERROR, errorReason, errorName));
  };
}

function getSize(opts) {
  if ('size' in opts) {
    // triggers immediate popup in iOS, fixes #2347
    // e.g. 5000001 asks for 5 MB, 10000001 asks for 10 MB,
    return opts.size * 1000000;
  }
  // In iOS, doesn't matter as long as it's <= 5000000.
  // Except that if you request too much, our tests fail
  // because of the native "do you accept?" popup.
  // In Android <=4.3, this value is actually used as an
  // honest-to-god ceiling for data, so we need to
  // set it to a decently high number.
  var isAndroid = typeof navigator !== 'undefined' &&
    /Android/.test(navigator.userAgent);
  return isAndroid ? 5000000 : 1; // in PhantomJS, if you use 0 it will crash
}

function websqlBulkDocs(dbOpts, req, opts, api, db, websqlChanges, callback) {
  var newEdits = opts.new_edits;
  var userDocs = req.docs;

  // Parse the docs, give them a sequence number for the result
  var docInfos = userDocs.map(function (doc) {
    if (doc._id && pouchdbAdapterUtils.isLocalId(doc._id)) {
      return doc;
    }
    var newDoc = pouchdbAdapterUtils.parseDoc(doc, newEdits);
    return newDoc;
  });

  var docInfoErrors = docInfos.filter(function (docInfo) {
    return docInfo.error;
  });
  if (docInfoErrors.length) {
    return callback(docInfoErrors[0]);
  }

  var tx;
  var results = new Array(docInfos.length);
  var fetchedDocs = new pouchdbCollections.Map();

  var preconditionErrored;
  function complete() {
    if (preconditionErrored) {
      return callback(preconditionErrored);
    }
    websqlChanges.notify(api._name);
    api._docCount = -1; // invalidate
    callback(null, results);
  }

  function verifyAttachment(digest, callback) {
    var sql = 'SELECT count(*) as cnt FROM ' + ATTACH_STORE +
      ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      if (result.rows.item(0).cnt === 0) {
        var err = pouchdbErrors.createError(pouchdbErrors.MISSING_STUB,
          'unknown stub attachment with digest ' +
          digest);
        callback(err);
      } else {
        callback();
      }
    });
  }

  function verifyAttachments(finish) {
    var digests = [];
    docInfos.forEach(function (docInfo) {
      if (docInfo.data && docInfo.data._attachments) {
        Object.keys(docInfo.data._attachments).forEach(function (filename) {
          var att = docInfo.data._attachments[filename];
          if (att.stub) {
            digests.push(att.digest);
          }
        });
      }
    });
    if (!digests.length) {
      return finish();
    }
    var numDone = 0;
    var err;

    function checkDone() {
      if (++numDone === digests.length) {
        finish(err);
      }
    }
    digests.forEach(function (digest) {
      verifyAttachment(digest, function (attErr) {
        if (attErr && !err) {
          err = attErr;
        }
        checkDone();
      });
    });
  }

  function writeDoc(docInfo, winningRev, winningRevIsDeleted, newRevIsDeleted,
                    isUpdate, delta, resultsIdx, callback) {

    function finish() {
      var data = docInfo.data;
      var deletedInt = newRevIsDeleted ? 1 : 0;

      var id = data._id;
      var rev = data._rev;
      var json = stringifyDoc(data);
      var sql = 'INSERT INTO ' + BY_SEQ_STORE +
        ' (doc_id, rev, json, deleted) VALUES (?, ?, ?, ?);';
      var sqlArgs = [id, rev, json, deletedInt];

      // map seqs to attachment digests, which
      // we will need later during compaction
      function insertAttachmentMappings(seq, callback) {
        var attsAdded = 0;
        var attsToAdd = Object.keys(data._attachments || {});

        if (!attsToAdd.length) {
          return callback();
        }
        function checkDone() {
          if (++attsAdded === attsToAdd.length) {
            callback();
          }
          return false; // ack handling a constraint error
        }
        function add(att) {
          var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE +
            ' (digest, seq) VALUES (?,?)';
          var sqlArgs = [data._attachments[att].digest, seq];
          tx.executeSql(sql, sqlArgs, checkDone, checkDone);
          // second callback is for a constaint error, which we ignore
          // because this docid/rev has already been associated with
          // the digest (e.g. when new_edits == false)
        }
        for (var i = 0; i < attsToAdd.length; i++) {
          add(attsToAdd[i]); // do in parallel
        }
      }

      tx.executeSql(sql, sqlArgs, function (tx, result) {
        var seq = result.insertId;
        insertAttachmentMappings(seq, function () {
          dataWritten(tx, seq);
        });
      }, function () {
        // constraint error, recover by updating instead (see #1638)
        var fetchSql = select('seq', BY_SEQ_STORE, null,
          'doc_id=? AND rev=?');
        tx.executeSql(fetchSql, [id, rev], function (tx, res) {
          var seq = res.rows.item(0).seq;
          var sql = 'UPDATE ' + BY_SEQ_STORE +
            ' SET json=?, deleted=? WHERE doc_id=? AND rev=?;';
          var sqlArgs = [json, deletedInt, id, rev];
          tx.executeSql(sql, sqlArgs, function (tx) {
            insertAttachmentMappings(seq, function () {
              dataWritten(tx, seq);
            });
          });
        });
        return false; // ack that we've handled the error
      });
    }

    function collectResults(attachmentErr) {
      if (!err) {
        if (attachmentErr) {
          err = attachmentErr;
          callback(err);
        } else if (recv === attachments.length) {
          finish();
        }
      }
    }

    var err = null;
    var recv = 0;

    docInfo.data._id = docInfo.metadata.id;
    docInfo.data._rev = docInfo.metadata.rev;
    var attachments = Object.keys(docInfo.data._attachments || {});


    if (newRevIsDeleted) {
      docInfo.data._deleted = true;
    }

    function attachmentSaved(err) {
      recv++;
      collectResults(err);
    }

    attachments.forEach(function (key) {
      var att = docInfo.data._attachments[key];
      if (!att.stub) {
        var data = att.data;
        delete att.data;
        att.revpos = parseInt(winningRev, 10);
        var digest = att.digest;
        saveAttachment(digest, data, attachmentSaved);
      } else {
        recv++;
        collectResults();
      }
    });

    if (!attachments.length) {
      finish();
    }

    function dataWritten(tx, seq) {
      var id = docInfo.metadata.id;

      var revsToCompact = docInfo.stemmedRevs || [];
      if (isUpdate && api.auto_compaction) {
        revsToCompact = pouchdbMerge.compactTree(docInfo.metadata).concat(revsToCompact);
      }
      if (revsToCompact.length) {
        compactRevs(revsToCompact, id, tx);
      }

      docInfo.metadata.seq = seq;
      delete docInfo.metadata.rev;

      var sql = isUpdate ?
      'UPDATE ' + DOC_STORE +
      ' SET json=?, max_seq=?, winningseq=' +
      '(SELECT seq FROM ' + BY_SEQ_STORE +
      ' WHERE doc_id=' + DOC_STORE + '.id AND rev=?) WHERE id=?'
        : 'INSERT INTO ' + DOC_STORE +
      ' (id, winningseq, max_seq, json) VALUES (?,?,?,?);';
      var metadataStr = pouchdbJson.safeJsonStringify(docInfo.metadata);
      var params = isUpdate ?
        [metadataStr, seq, winningRev, id] :
        [id, seq, seq, metadataStr];
      tx.executeSql(sql, params, function () {
        results[resultsIdx] = {
          ok: true,
          id: docInfo.metadata.id,
          rev: winningRev
        };
        fetchedDocs.set(id, docInfo.metadata);
        callback();
      });
    }
  }

  function websqlProcessDocs() {
    pouchdbAdapterUtils.processDocs(dbOpts.revs_limit, docInfos, api, fetchedDocs, tx,
                results, writeDoc, opts);
  }

  function fetchExistingDocs(callback) {
    if (!docInfos.length) {
      return callback();
    }

    var numFetched = 0;

    function checkDone() {
      if (++numFetched === docInfos.length) {
        callback();
      }
    }

    docInfos.forEach(function (docInfo) {
      if (docInfo._id && pouchdbAdapterUtils.isLocalId(docInfo._id)) {
        return checkDone(); // skip local docs
      }
      var id = docInfo.metadata.id;
      tx.executeSql('SELECT json FROM ' + DOC_STORE +
      ' WHERE id = ?', [id], function (tx, result) {
        if (result.rows.length) {
          var metadata = pouchdbJson.safeJsonParse(result.rows.item(0).json);
          fetchedDocs.set(id, metadata);
        }
        checkDone();
      });
    });
  }

  function saveAttachment(digest, data, callback) {
    var sql = 'SELECT digest FROM ' + ATTACH_STORE + ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      if (result.rows.length) { // attachment already exists
        return callback();
      }
      // we could just insert before selecting and catch the error,
      // but my hunch is that it's cheaper not to serialize the blob
      // from JS to C if we don't have to (TODO: confirm this)
      sql = 'INSERT INTO ' + ATTACH_STORE +
      ' (digest, body, escaped) VALUES (?,?,1)';
      tx.executeSql(sql, [digest, escapeBlob(data)], function () {
        callback();
      }, function () {
        // ignore constaint errors, means it already exists
        callback();
        return false; // ack we handled the error
      });
    });
  }

  pouchdbAdapterUtils.preprocessAttachments(docInfos, 'binary', function (err) {
    if (err) {
      return callback(err);
    }
    db.transaction(function (txn) {
      tx = txn;
      verifyAttachments(function (err) {
        if (err) {
          preconditionErrored = err;
        } else {
          fetchExistingDocs(websqlProcessDocs);
        }
      });
    }, websqlError(callback), complete);
  });
}

var cachedDatabases = new pouchdbCollections.Map();

// openDatabase passed in through opts (e.g. for node-websql)
function openDatabaseWithOpts(opts) {
  return opts.websql(opts.name, opts.version, opts.description, opts.size);
}

function openDBSafely(opts) {
  try {
    return {
      db: openDatabaseWithOpts(opts)
    };
  } catch (err) {
    return {
      error: err
    };
  }
}

function openDB(opts) {
  var cachedResult = cachedDatabases.get(opts.name);
  if (!cachedResult) {
    cachedResult = openDBSafely(opts);
    cachedDatabases.set(opts.name, cachedResult);
    if (cachedResult.db) {
      cachedResult.db._sqlitePlugin = typeof sqlitePlugin !== 'undefined';
    }
  }
  return cachedResult;
}

var websqlChanges = new pouchdbUtils.changesHandler();

function fetchAttachmentsIfNecessary(doc, opts, api, txn, cb) {
  var attachments = Object.keys(doc._attachments || {});
  if (!attachments.length) {
    return cb && cb();
  }
  var numDone = 0;

  function checkDone() {
    if (++numDone === attachments.length && cb) {
      cb();
    }
  }

  function fetchAttachment(doc, att) {
    var attObj = doc._attachments[att];
    var attOpts = {binary: opts.binary, ctx: txn};
    api._getAttachment(doc._id, att, attObj, attOpts, function (_, data) {
      doc._attachments[att] = jsExtend.extend(
        pouchdbUtils.pick(attObj, ['digest', 'content_type']),
        { data: data }
      );
      checkDone();
    });
  }

  attachments.forEach(function (att) {
    if (opts.attachments && opts.include_docs) {
      fetchAttachment(doc, att);
    } else {
      doc._attachments[att].stub = true;
      checkDone();
    }
  });
}

var POUCH_VERSION = 1;

// these indexes cover the ground for most allDocs queries
var BY_SEQ_STORE_DELETED_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'by-seq-deleted-idx\' ON ' +
  BY_SEQ_STORE + ' (seq, deleted)';
var BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL =
  'CREATE UNIQUE INDEX IF NOT EXISTS \'by-seq-doc-id-rev\' ON ' +
    BY_SEQ_STORE + ' (doc_id, rev)';
var DOC_STORE_WINNINGSEQ_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'doc-winningseq-idx\' ON ' +
  DOC_STORE + ' (winningseq)';
var ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL =
  'CREATE INDEX IF NOT EXISTS \'attach-seq-seq-idx\' ON ' +
    ATTACH_AND_SEQ_STORE + ' (seq)';
var ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL =
  'CREATE UNIQUE INDEX IF NOT EXISTS \'attach-seq-digest-idx\' ON ' +
    ATTACH_AND_SEQ_STORE + ' (digest, seq)';

var DOC_STORE_AND_BY_SEQ_JOINER = BY_SEQ_STORE +
  '.seq = ' + DOC_STORE + '.winningseq';

var SELECT_DOCS = BY_SEQ_STORE + '.seq AS seq, ' +
  BY_SEQ_STORE + '.deleted AS deleted, ' +
  BY_SEQ_STORE + '.json AS data, ' +
  BY_SEQ_STORE + '.rev AS rev, ' +
  DOC_STORE + '.json AS metadata';

function WebSqlPouch(opts, callback) {
  var api = this;
  var instanceId = null;
  var size = getSize(opts);
  var idRequests = [];
  var encoding;

  api._docCount = -1; // cache sqlite count(*) for performance
  api._name = opts.name;

  // extend the options here, because sqlite plugin has a ton of options
  // and they are constantly changing, so it's more prudent to allow anything
  var websqlOpts = jsExtend.extend({}, opts, {
    version: POUCH_VERSION,
    description: opts.name,
    size: size
  });
  var openDBResult = openDB(websqlOpts);
  if (openDBResult.error) {
    return websqlError(callback)(openDBResult.error);
  }
  var db = openDBResult.db;
  if (typeof db.readTransaction !== 'function') {
    // doesn't exist in sqlite plugin
    db.readTransaction = db.transaction;
  }

  function dbCreated() {
    // note the db name in case the browser upgrades to idb
    if (pouchdbUtils.hasLocalStorage()) {
      window.localStorage['_pouch__websqldb_' + api._name] = true;
    }
    callback(null, api);
  }

  // In this migration, we added the 'deleted' and 'local' columns to the
  // by-seq and doc store tables.
  // To preserve existing user data, we re-process all the existing JSON
  // and add these values.
  // Called migration2 because it corresponds to adapter version (db_version) #2
  function runMigration2(tx, callback) {
    // index used for the join in the allDocs query
    tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);

    tx.executeSql('ALTER TABLE ' + BY_SEQ_STORE +
      ' ADD COLUMN deleted TINYINT(1) DEFAULT 0', [], function () {
      tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
      tx.executeSql('ALTER TABLE ' + DOC_STORE +
        ' ADD COLUMN local TINYINT(1) DEFAULT 0', [], function () {
        tx.executeSql('CREATE INDEX IF NOT EXISTS \'doc-store-local-idx\' ON ' +
          DOC_STORE + ' (local, id)');

        var sql = 'SELECT ' + DOC_STORE + '.winningseq AS seq, ' + DOC_STORE +
          '.json AS metadata FROM ' + BY_SEQ_STORE + ' JOIN ' + DOC_STORE +
          ' ON ' + BY_SEQ_STORE + '.seq = ' + DOC_STORE + '.winningseq';

        tx.executeSql(sql, [], function (tx, result) {

          var deleted = [];
          var local = [];

          for (var i = 0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            var seq = item.seq;
            var metadata = JSON.parse(item.metadata);
            if (pouchdbAdapterUtils.isDeleted(metadata)) {
              deleted.push(seq);
            }
            if (pouchdbAdapterUtils.isLocalId(metadata.id)) {
              local.push(metadata.id);
            }
          }
          tx.executeSql('UPDATE ' + DOC_STORE + 'SET local = 1 WHERE id IN ' +
            qMarks(local.length), local, function () {
            tx.executeSql('UPDATE ' + BY_SEQ_STORE +
              ' SET deleted = 1 WHERE seq IN ' +
              qMarks(deleted.length), deleted, callback);
          });
        });
      });
    });
  }

  // in this migration, we make all the local docs unversioned
  function runMigration3(tx, callback) {
    var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE +
      ' (id UNIQUE, rev, json)';
    tx.executeSql(local, [], function () {
      var sql = 'SELECT ' + DOC_STORE + '.id AS id, ' +
        BY_SEQ_STORE + '.json AS data ' +
        'FROM ' + BY_SEQ_STORE + ' JOIN ' +
        DOC_STORE + ' ON ' + BY_SEQ_STORE + '.seq = ' +
        DOC_STORE + '.winningseq WHERE local = 1';
      tx.executeSql(sql, [], function (tx, res) {
        var rows = [];
        for (var i = 0; i < res.rows.length; i++) {
          rows.push(res.rows.item(i));
        }
        function doNext() {
          if (!rows.length) {
            return callback(tx);
          }
          var row = rows.shift();
          var rev = JSON.parse(row.data)._rev;
          tx.executeSql('INSERT INTO ' + LOCAL_STORE +
              ' (id, rev, json) VALUES (?,?,?)',
              [row.id, rev, row.data], function (tx) {
            tx.executeSql('DELETE FROM ' + DOC_STORE + ' WHERE id=?',
                [row.id], function (tx) {
              tx.executeSql('DELETE FROM ' + BY_SEQ_STORE + ' WHERE seq=?',
                  [row.seq], function () {
                doNext();
              });
            });
          });
        }
        doNext();
      });
    });
  }

  // in this migration, we remove doc_id_rev and just use rev
  function runMigration4(tx, callback) {

    function updateRows(rows) {
      function doNext() {
        if (!rows.length) {
          return callback(tx);
        }
        var row = rows.shift();
        var doc_id_rev = parseHexString(row.hex, encoding);
        var idx = doc_id_rev.lastIndexOf('::');
        var doc_id = doc_id_rev.substring(0, idx);
        var rev = doc_id_rev.substring(idx + 2);
        var sql = 'UPDATE ' + BY_SEQ_STORE +
          ' SET doc_id=?, rev=? WHERE doc_id_rev=?';
        tx.executeSql(sql, [doc_id, rev, doc_id_rev], function () {
          doNext();
        });
      }
      doNext();
    }

    var sql = 'ALTER TABLE ' + BY_SEQ_STORE + ' ADD COLUMN doc_id';
    tx.executeSql(sql, [], function (tx) {
      var sql = 'ALTER TABLE ' + BY_SEQ_STORE + ' ADD COLUMN rev';
      tx.executeSql(sql, [], function (tx) {
        tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL, [], function (tx) {
          var sql = 'SELECT hex(doc_id_rev) as hex FROM ' + BY_SEQ_STORE;
          tx.executeSql(sql, [], function (tx, res) {
            var rows = [];
            for (var i = 0; i < res.rows.length; i++) {
              rows.push(res.rows.item(i));
            }
            updateRows(rows);
          });
        });
      });
    });
  }

  // in this migration, we add the attach_and_seq table
  // for issue #2818
  function runMigration5(tx, callback) {

    function migrateAttsAndSeqs(tx) {
      // need to actually populate the table. this is the expensive part,
      // so as an optimization, check first that this database even
      // contains attachments
      var sql = 'SELECT COUNT(*) AS cnt FROM ' + ATTACH_STORE;
      tx.executeSql(sql, [], function (tx, res) {
        var count = res.rows.item(0).cnt;
        if (!count) {
          return callback(tx);
        }

        var offset = 0;
        var pageSize = 10;
        function nextPage() {
          var sql = select(
            SELECT_DOCS + ', ' + DOC_STORE + '.id AS id',
            [DOC_STORE, BY_SEQ_STORE],
            DOC_STORE_AND_BY_SEQ_JOINER,
            null,
            DOC_STORE + '.id '
          );
          sql += ' LIMIT ' + pageSize + ' OFFSET ' + offset;
          offset += pageSize;
          tx.executeSql(sql, [], function (tx, res) {
            if (!res.rows.length) {
              return callback(tx);
            }
            var digestSeqs = {};
            function addDigestSeq(digest, seq) {
              // uniq digest/seq pairs, just in case there are dups
              var seqs = digestSeqs[digest] = (digestSeqs[digest] || []);
              if (seqs.indexOf(seq) === -1) {
                seqs.push(seq);
              }
            }
            for (var i = 0; i < res.rows.length; i++) {
              var row = res.rows.item(i);
              var doc = unstringifyDoc(row.data, row.id, row.rev);
              var atts = Object.keys(doc._attachments || {});
              for (var j = 0; j < atts.length; j++) {
                var att = doc._attachments[atts[j]];
                addDigestSeq(att.digest, row.seq);
              }
            }
            var digestSeqPairs = [];
            Object.keys(digestSeqs).forEach(function (digest) {
              var seqs = digestSeqs[digest];
              seqs.forEach(function (seq) {
                digestSeqPairs.push([digest, seq]);
              });
            });
            if (!digestSeqPairs.length) {
              return nextPage();
            }
            var numDone = 0;
            digestSeqPairs.forEach(function (pair) {
              var sql = 'INSERT INTO ' + ATTACH_AND_SEQ_STORE +
                ' (digest, seq) VALUES (?,?)';
              tx.executeSql(sql, pair, function () {
                if (++numDone === digestSeqPairs.length) {
                  nextPage();
                }
              });
            });
          });
        }
        nextPage();
      });
    }

    var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' +
      ATTACH_AND_SEQ_STORE + ' (digest, seq INTEGER)';
    tx.executeSql(attachAndRev, [], function (tx) {
      tx.executeSql(
        ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL, [], function (tx) {
          tx.executeSql(
            ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL, [],
            migrateAttsAndSeqs);
        });
    });
  }

  // in this migration, we use escapeBlob() and unescapeBlob()
  // instead of reading out the binary as HEX, which is slow
  function runMigration6(tx, callback) {
    var sql = 'ALTER TABLE ' + ATTACH_STORE +
      ' ADD COLUMN escaped TINYINT(1) DEFAULT 0';
    tx.executeSql(sql, [], callback);
  }

  // issue #3136, in this migration we need a "latest seq" as well
  // as the "winning seq" in the doc store
  function runMigration7(tx, callback) {
    var sql = 'ALTER TABLE ' + DOC_STORE +
      ' ADD COLUMN max_seq INTEGER';
    tx.executeSql(sql, [], function (tx) {
      var sql = 'UPDATE ' + DOC_STORE + ' SET max_seq=(SELECT MAX(seq) FROM ' +
        BY_SEQ_STORE + ' WHERE doc_id=id)';
      tx.executeSql(sql, [], function (tx) {
        // add unique index after filling, else we'll get a constraint
        // error when we do the ALTER TABLE
        var sql =
          'CREATE UNIQUE INDEX IF NOT EXISTS \'doc-max-seq-idx\' ON ' +
          DOC_STORE + ' (max_seq)';
        tx.executeSql(sql, [], callback);
      });
    });
  }

  function checkEncoding(tx, cb) {
    // UTF-8 on chrome/android, UTF-16 on safari < 7.1
    tx.executeSql('SELECT HEX("a") AS hex', [], function (tx, res) {
        var hex = res.rows.item(0).hex;
        encoding = hex.length === 2 ? 'UTF-8' : 'UTF-16';
        cb();
      }
    );
  }

  function onGetInstanceId() {
    while (idRequests.length > 0) {
      var idCallback = idRequests.pop();
      idCallback(null, instanceId);
    }
  }

  function onGetVersion(tx, dbVersion) {
    if (dbVersion === 0) {
      // initial schema

      var meta = 'CREATE TABLE IF NOT EXISTS ' + META_STORE +
        ' (dbid, db_version INTEGER)';
      var attach = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_STORE +
        ' (digest UNIQUE, escaped TINYINT(1), body BLOB)';
      var attachAndRev = 'CREATE TABLE IF NOT EXISTS ' +
        ATTACH_AND_SEQ_STORE + ' (digest, seq INTEGER)';
      // TODO: migrate winningseq to INTEGER
      var doc = 'CREATE TABLE IF NOT EXISTS ' + DOC_STORE +
        ' (id unique, json, winningseq, max_seq INTEGER UNIQUE)';
      var seq = 'CREATE TABLE IF NOT EXISTS ' + BY_SEQ_STORE +
        ' (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'json, deleted TINYINT(1), doc_id, rev)';
      var local = 'CREATE TABLE IF NOT EXISTS ' + LOCAL_STORE +
        ' (id UNIQUE, rev, json)';

      // creates
      tx.executeSql(attach);
      tx.executeSql(local);
      tx.executeSql(attachAndRev, [], function () {
        tx.executeSql(ATTACH_AND_SEQ_STORE_SEQ_INDEX_SQL);
        tx.executeSql(ATTACH_AND_SEQ_STORE_ATTACH_INDEX_SQL);
      });
      tx.executeSql(doc, [], function () {
        tx.executeSql(DOC_STORE_WINNINGSEQ_INDEX_SQL);
        tx.executeSql(seq, [], function () {
          tx.executeSql(BY_SEQ_STORE_DELETED_INDEX_SQL);
          tx.executeSql(BY_SEQ_STORE_DOC_ID_REV_INDEX_SQL);
          tx.executeSql(meta, [], function () {
            // mark the db version, and new dbid
            var initSeq = 'INSERT INTO ' + META_STORE +
              ' (db_version, dbid) VALUES (?,?)';
            instanceId = pouchdbUtils.uuid();
            var initSeqArgs = [ADAPTER_VERSION, instanceId];
            tx.executeSql(initSeq, initSeqArgs, function () {
              onGetInstanceId();
            });
          });
        });
      });
    } else { // version > 0

      var setupDone = function () {
        var migrated = dbVersion < ADAPTER_VERSION;
        if (migrated) {
          // update the db version within this transaction
          tx.executeSql('UPDATE ' + META_STORE + ' SET db_version = ' +
            ADAPTER_VERSION);
        }
        // notify db.id() callers
        var sql = 'SELECT dbid FROM ' + META_STORE;
        tx.executeSql(sql, [], function (tx, result) {
          instanceId = result.rows.item(0).dbid;
          onGetInstanceId();
        });
      };

      // would love to use promises here, but then websql
      // ends the transaction early
      var tasks = [
        runMigration2,
        runMigration3,
        runMigration4,
        runMigration5,
        runMigration6,
        runMigration7,
        setupDone
      ];

      // run each migration sequentially
      var i = dbVersion;
      var nextMigration = function (tx) {
        tasks[i - 1](tx, nextMigration);
        i++;
      };
      nextMigration(tx);
    }
  }

  function setup() {
    db.transaction(function (tx) {
      // first check the encoding
      checkEncoding(tx, function () {
        // then get the version
        fetchVersion(tx);
      });
    }, websqlError(callback), dbCreated);
  }

  function fetchVersion(tx) {
    var sql = 'SELECT sql FROM sqlite_master WHERE tbl_name = ' + META_STORE;
    tx.executeSql(sql, [], function (tx, result) {
      if (!result.rows.length) {
        // database hasn't even been created yet (version 0)
        onGetVersion(tx, 0);
      } else if (!/db_version/.test(result.rows.item(0).sql)) {
        // table was created, but without the new db_version column,
        // so add it.
        tx.executeSql('ALTER TABLE ' + META_STORE +
          ' ADD COLUMN db_version INTEGER', [], function () {
          // before version 2, this column didn't even exist
          onGetVersion(tx, 1);
        });
      } else { // column exists, we can safely get it
        tx.executeSql('SELECT db_version FROM ' + META_STORE,
          [], function (tx, result) {
          var dbVersion = result.rows.item(0).db_version;
          onGetVersion(tx, dbVersion);
        });
      }
    });
  }

  setup();

  api.type = function () {
    return 'websql';
  };

  api._id = pouchdbUtils.toPromise(function (callback) {
    callback(null, instanceId);
  });

  api._info = function (callback) {
    db.readTransaction(function (tx) {
      countDocs(tx, function (docCount) {
        var sql = 'SELECT MAX(seq) AS seq FROM ' + BY_SEQ_STORE;
        tx.executeSql(sql, [], function (tx, res) {
          var updateSeq = res.rows.item(0).seq || 0;
          callback(null, {
            doc_count: docCount,
            update_seq: updateSeq,
            // for debugging
            sqlite_plugin: db._sqlitePlugin,
            websql_encoding: encoding
          });
        });
      });
    }, websqlError(callback));
  };

  api._bulkDocs = function (req, reqOpts, callback) {
    websqlBulkDocs(opts, req, reqOpts, api, db, websqlChanges, callback);
  };

  api._get = function (id, opts, callback) {
    var doc;
    var metadata;
    var err;
    var tx = opts.ctx;
    if (!tx) {
      return db.readTransaction(function (txn) {
        api._get(id, jsExtend.extend({ctx: txn}, opts), callback);
      });
    }

    function finish() {
      callback(err, {doc: doc, metadata: metadata, ctx: tx});
    }

    var sql;
    var sqlArgs;
    if (opts.rev) {
      sql = select(
        SELECT_DOCS,
        [DOC_STORE, BY_SEQ_STORE],
        DOC_STORE + '.id=' + BY_SEQ_STORE + '.doc_id',
        [BY_SEQ_STORE + '.doc_id=?', BY_SEQ_STORE + '.rev=?']);
      sqlArgs = [id, opts.rev];
    } else {
      sql = select(
        SELECT_DOCS,
        [DOC_STORE, BY_SEQ_STORE],
        DOC_STORE_AND_BY_SEQ_JOINER,
        DOC_STORE + '.id=?');
      sqlArgs = [id];
    }
    tx.executeSql(sql, sqlArgs, function (a, results) {
      if (!results.rows.length) {
        err = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, 'missing');
        return finish();
      }
      var item = results.rows.item(0);
      metadata = pouchdbJson.safeJsonParse(item.metadata);
      if (item.deleted && !opts.rev) {
        err = pouchdbErrors.createError(pouchdbErrors.MISSING_DOC, 'deleted');
        return finish();
      }
      doc = unstringifyDoc(item.data, metadata.id, item.rev);
      finish();
    });
  };

  function countDocs(tx, callback) {

    if (api._docCount !== -1) {
      return callback(api._docCount);
    }

    // count the total rows
    var sql = select(
      'COUNT(' + DOC_STORE + '.id) AS \'num\'',
      [DOC_STORE, BY_SEQ_STORE],
      DOC_STORE_AND_BY_SEQ_JOINER,
      BY_SEQ_STORE + '.deleted=0');

    tx.executeSql(sql, [], function (tx, result) {
      api._docCount = result.rows.item(0).num;
      callback(api._docCount);
    });
  }

  api._allDocs = function (opts, callback) {
    var results = [];
    var totalRows;

    var start = 'startkey' in opts ? opts.startkey : false;
    var end = 'endkey' in opts ? opts.endkey : false;
    var key = 'key' in opts ? opts.key : false;
    var descending = 'descending' in opts ? opts.descending : false;
    var limit = 'limit' in opts ? opts.limit : -1;
    var offset = 'skip' in opts ? opts.skip : 0;
    var inclusiveEnd = opts.inclusive_end !== false;

    var sqlArgs = [];
    var criteria = [];

    if (key !== false) {
      criteria.push(DOC_STORE + '.id = ?');
      sqlArgs.push(key);
    } else if (start !== false || end !== false) {
      if (start !== false) {
        criteria.push(DOC_STORE + '.id ' + (descending ? '<=' : '>=') + ' ?');
        sqlArgs.push(start);
      }
      if (end !== false) {
        var comparator = descending ? '>' : '<';
        if (inclusiveEnd) {
          comparator += '=';
        }
        criteria.push(DOC_STORE + '.id ' + comparator + ' ?');
        sqlArgs.push(end);
      }
      if (key !== false) {
        criteria.push(DOC_STORE + '.id = ?');
        sqlArgs.push(key);
      }
    }

    if (opts.deleted !== 'ok') {
      // report deleted if keys are specified
      criteria.push(BY_SEQ_STORE + '.deleted = 0');
    }

    db.readTransaction(function (tx) {

      // first count up the total rows
      countDocs(tx, function (count) {
        totalRows = count;

        if (limit === 0) {
          return;
        }

        // then actually fetch the documents
        var sql = select(
          SELECT_DOCS,
          [DOC_STORE, BY_SEQ_STORE],
          DOC_STORE_AND_BY_SEQ_JOINER,
          criteria,
          DOC_STORE + '.id ' + (descending ? 'DESC' : 'ASC')
          );
        sql += ' LIMIT ' + limit + ' OFFSET ' + offset;

        tx.executeSql(sql, sqlArgs, function (tx, result) {
          for (var i = 0, l = result.rows.length; i < l; i++) {
            var item = result.rows.item(i);
            var metadata = pouchdbJson.safeJsonParse(item.metadata);
            var id = metadata.id;
            var data = unstringifyDoc(item.data, id, item.rev);
            var winningRev = data._rev;
            var doc = {
              id: id,
              key: id,
              value: {rev: winningRev}
            };
            if (opts.include_docs) {
              doc.doc = data;
              doc.doc._rev = winningRev;
              if (opts.conflicts) {
                doc.doc._conflicts = pouchdbMerge.collectConflicts(metadata);
              }
              fetchAttachmentsIfNecessary(doc.doc, opts, api, tx);
            }
            if (item.deleted) {
              if (opts.deleted === 'ok') {
                doc.value.deleted = true;
                doc.doc = null;
              } else {
                continue;
              }
            }
            results.push(doc);
          }
        });
      });
    }, websqlError(callback), function () {
      callback(null, {
        total_rows: totalRows,
        offset: opts.skip,
        rows: results
      });
    });
  };

  api._changes = function (opts) {
    opts = pouchdbUtils.clone(opts);

    if (opts.continuous) {
      var id = api._name + ':' + pouchdbUtils.uuid();
      websqlChanges.addListener(api._name, id, api, opts);
      websqlChanges.notify(api._name);
      return {
        cancel: function () {
          websqlChanges.removeListener(api._name, id);
        }
      };
    }

    var descending = opts.descending;

    // Ignore the `since` parameter when `descending` is true
    opts.since = opts.since && !descending ? opts.since : 0;

    var limit = 'limit' in opts ? opts.limit : -1;
    if (limit === 0) {
      limit = 1; // per CouchDB _changes spec
    }

    var returnDocs;
    if ('return_docs' in opts) {
      returnDocs = opts.return_docs;
    } else if ('returnDocs' in opts) {
      // TODO: Remove 'returnDocs' in favor of 'return_docs' in a future release
      returnDocs = opts.returnDocs;
    } else {
      returnDocs = true;
    }
    var results = [];
    var numResults = 0;

    function fetchChanges() {

      var selectStmt =
        DOC_STORE + '.json AS metadata, ' +
        DOC_STORE + '.max_seq AS maxSeq, ' +
        BY_SEQ_STORE + '.json AS winningDoc, ' +
        BY_SEQ_STORE + '.rev AS winningRev ';

      var from = DOC_STORE + ' JOIN ' + BY_SEQ_STORE;

      var joiner = DOC_STORE + '.id=' + BY_SEQ_STORE + '.doc_id' +
        ' AND ' + DOC_STORE + '.winningseq=' + BY_SEQ_STORE + '.seq';

      var criteria = ['maxSeq > ?'];
      var sqlArgs = [opts.since];

      if (opts.doc_ids) {
        criteria.push(DOC_STORE + '.id IN ' + qMarks(opts.doc_ids.length));
        sqlArgs = sqlArgs.concat(opts.doc_ids);
      }

      var orderBy = 'maxSeq ' + (descending ? 'DESC' : 'ASC');

      var sql = select(selectStmt, from, joiner, criteria, orderBy);

      var filter = pouchdbUtils.filterChange(opts);
      if (!opts.view && !opts.filter) {
        // we can just limit in the query
        sql += ' LIMIT ' + limit;
      }

      var lastSeq = opts.since || 0;
      db.readTransaction(function (tx) {
        tx.executeSql(sql, sqlArgs, function (tx, result) {
          function reportChange(change) {
            return function () {
              opts.onChange(change);
            };
          }
          for (var i = 0, l = result.rows.length; i < l; i++) {
            var item = result.rows.item(i);
            var metadata = pouchdbJson.safeJsonParse(item.metadata);
            lastSeq = item.maxSeq;

            var doc = unstringifyDoc(item.winningDoc, metadata.id,
              item.winningRev);
            var change = opts.processChange(doc, metadata, opts);
            change.seq = item.maxSeq;

            var filtered = filter(change);
            if (typeof filtered === 'object') {
              return opts.complete(filtered);
            }

            if (filtered) {
              numResults++;
              if (returnDocs) {
                results.push(change);
              }
              // process the attachment immediately
              // for the benefit of live listeners
              if (opts.attachments && opts.include_docs) {
                fetchAttachmentsIfNecessary(doc, opts, api, tx,
                  reportChange(change));
              } else {
                reportChange(change)();
              }
            }
            if (numResults === limit) {
              break;
            }
          }
        });
      }, websqlError(opts.complete), function () {
        if (!opts.continuous) {
          opts.complete(null, {
            results: results,
            last_seq: lastSeq
          });
        }
      });
    }

    fetchChanges();
  };

  api._close = function (callback) {
    //WebSQL databases do not need to be closed
    callback();
  };

  api._getAttachment = function (docId, attachId, attachment, opts, callback) {
    var res;
    var tx = opts.ctx;
    var digest = attachment.digest;
    var type = attachment.content_type;
    var sql = 'SELECT escaped, ' +
      'CASE WHEN escaped = 1 THEN body ELSE HEX(body) END AS body FROM ' +
      ATTACH_STORE + ' WHERE digest=?';
    tx.executeSql(sql, [digest], function (tx, result) {
      // websql has a bug where \u0000 causes early truncation in strings
      // and blobs. to work around this, we used to use the hex() function,
      // but that's not performant. after migration 6, we remove \u0000
      // and add it back in afterwards
      var item = result.rows.item(0);
      var data = item.escaped ? unescapeBlob(item.body) :
        parseHexString(item.body, encoding);
      if (opts.binary) {
        res = pouchdbBinaryUtils.binaryStringToBlobOrBuffer(data, type);
      } else {
        res = pouchdbBinaryUtils.btoa(data);
      }
      callback(null, res);
    });
  };

  api._getRevisionTree = function (docId, callback) {
    db.readTransaction(function (tx) {
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function (tx, result) {
        if (!result.rows.length) {
          callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
        } else {
          var data = pouchdbJson.safeJsonParse(result.rows.item(0).metadata);
          callback(null, data.rev_tree);
        }
      });
    });
  };

  api._doCompaction = function (docId, revs, callback) {
    if (!revs.length) {
      return callback();
    }
    db.transaction(function (tx) {

      // update doc store
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function (tx, result) {
        var metadata = pouchdbJson.safeJsonParse(result.rows.item(0).metadata);
        pouchdbMerge.traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                                           revHash, ctx, opts) {
          var rev = pos + '-' + revHash;
          if (revs.indexOf(rev) !== -1) {
            opts.status = 'missing';
          }
        });

        var sql = 'UPDATE ' + DOC_STORE + ' SET json = ? WHERE id = ?';
        tx.executeSql(sql, [pouchdbJson.safeJsonStringify(metadata), docId]);
      });

      compactRevs(revs, docId, tx);
    }, websqlError(callback), function () {
      callback();
    });
  };

  api._getLocal = function (id, callback) {
    db.readTransaction(function (tx) {
      var sql = 'SELECT json, rev FROM ' + LOCAL_STORE + ' WHERE id=?';
      tx.executeSql(sql, [id], function (tx, res) {
        if (res.rows.length) {
          var item = res.rows.item(0);
          var doc = unstringifyDoc(item.json, id, item.rev);
          callback(null, doc);
        } else {
          callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
        }
      });
    });
  };

  api._putLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    delete doc._revisions; // ignore this, trust the rev
    var oldRev = doc._rev;
    var id = doc._id;
    var newRev;
    if (!oldRev) {
      newRev = doc._rev = '0-1';
    } else {
      newRev = doc._rev = '0-' + (parseInt(oldRev.split('-')[1], 10) + 1);
    }
    var json = stringifyDoc(doc);

    var ret;
    function putLocal(tx) {
      var sql;
      var values;
      if (oldRev) {
        sql = 'UPDATE ' + LOCAL_STORE + ' SET rev=?, json=? ' +
          'WHERE id=? AND rev=?';
        values = [newRev, json, id, oldRev];
      } else {
        sql = 'INSERT INTO ' + LOCAL_STORE + ' (id, rev, json) VALUES (?,?,?)';
        values = [id, newRev, json];
      }
      tx.executeSql(sql, values, function (tx, res) {
        if (res.rowsAffected) {
          ret = {ok: true, id: id, rev: newRev};
          if (opts.ctx) { // return immediately
            callback(null, ret);
          }
        } else {
          callback(pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT));
        }
      }, function () {
        callback(pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT));
        return false; // ack that we handled the error
      });
    }

    if (opts.ctx) {
      putLocal(opts.ctx);
    } else {
      db.transaction(putLocal, websqlError(callback), function () {
        if (ret) {
          callback(null, ret);
        }
      });
    }
  };

  api._removeLocal = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var ret;

    function removeLocal(tx) {
      var sql = 'DELETE FROM ' + LOCAL_STORE + ' WHERE id=? AND rev=?';
      var params = [doc._id, doc._rev];
      tx.executeSql(sql, params, function (tx, res) {
        if (!res.rowsAffected) {
          return callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
        }
        ret = {ok: true, id: doc._id, rev: '0-0'};
        if (opts.ctx) { // return immediately
          callback(null, ret);
        }
      });
    }

    if (opts.ctx) {
      removeLocal(opts.ctx);
    } else {
      db.transaction(removeLocal, websqlError(callback), function () {
        if (ret) {
          callback(null, ret);
        }
      });
    }
  };

  api._destroy = function (opts, callback) {
    websqlChanges.removeAllListeners(api._name);
    db.transaction(function (tx) {
      var stores = [DOC_STORE, BY_SEQ_STORE, ATTACH_STORE, META_STORE,
        LOCAL_STORE, ATTACH_AND_SEQ_STORE];
      stores.forEach(function (store) {
        tx.executeSql('DROP TABLE IF EXISTS ' + store, []);
      });
    }, websqlError(callback), function () {
      if (pouchdbUtils.hasLocalStorage()) {
        delete window.localStorage['_pouch__websqldb_' + api._name];
        delete window.localStorage[api._name];
      }
      callback(null, {'ok': true});
    });
  };
}

module.exports = WebSqlPouch;
},{"js-extend":24,"pouchdb-adapter-utils":30,"pouchdb-binary-utils":34,"pouchdb-collections":39,"pouchdb-errors":41,"pouchdb-json":43,"pouchdb-merge":47,"pouchdb-utils":50}],32:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var WebSqlPouchCore = _interopDefault(require('pouchdb-adapter-websql-core'));
var jsExtend = require('js-extend');
var pouchdbUtils = require('pouchdb-utils');

function canOpenTestDB() {
  try {
    openDatabase('_pouch_validate_websql', 1, '', 1);
    return true;
  } catch (err) {
    return false;
  }
}

// WKWebView had a bug where WebSQL would throw a DOM Exception 18
// (see https://bugs.webkit.org/show_bug.cgi?id=137760 and
// https://github.com/pouchdb/pouchdb/issues/5079)
// This has been fixed in latest WebKit, so we try to detect it here.
function isValidWebSQL() {
  // WKWebView UA:
  //   Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X)
  //   AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13C75
  // Chrome for iOS UA:
  //   Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en)
  //   AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60
  //   Mobile/9B206 Safari/7534.48.3
  // Firefox for iOS UA:
  //   Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4
  //   (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4

  // indexedDB is null on some UIWebViews and undefined in others
  // see: https://bugs.webkit.org/show_bug.cgi?id=137034
  if (typeof indexedDB === 'undefined' || indexedDB === null ||
      !/iP(hone|od|ad)/.test(navigator.userAgent)) {
    // definitely not WKWebView, avoid creating an unnecessary database
    return true;
  }
  // Cache the result in LocalStorage. Reason we do this is because if we
  // call openDatabase() too many times, Safari craps out in SauceLabs and
  // starts throwing DOM Exception 14s.
  var hasLS = pouchdbUtils.hasLocalStorage();
  // Include user agent in the hash, so that if Safari is upgraded, we don't
  // continually think it's broken.
  var localStorageKey = '_pouch__websqldb_valid_' + navigator.userAgent;
  if (hasLS && localStorage[localStorageKey]) {
    return localStorage[localStorageKey] === '1';
  }
  var openedTestDB = canOpenTestDB();
  if (hasLS) {
    localStorage[localStorageKey] = openedTestDB ? '1' : '0';
  }
  return openedTestDB;
}

function validWithoutCheckingCordova() {
  if (typeof openDatabase === 'undefined') {
    return false;
  }
  if (typeof sqlitePlugin !== 'undefined') {
    // Both sqlite-storage and SQLite Plugin 2 create this global object,
    // which we can check for to determine validity. It should be defined
    // after the 'deviceready' event.
    return true;
  }
  return isValidWebSQL();
}

function valid() {
  // The Cordova SQLite Plugin and SQLite Plugin 2 can be used in cordova apps,
  // and we can't know whether or not the plugin was loaded until after the
  // 'deviceready' event. Since it's impractical for us to wait for that event
  // before returning true/false for valid(), we just return true here
  // and notify the user that they may need a plugin.
  if (typeof cordova !== 'undefined') {
    return true;
  }
  return validWithoutCheckingCordova();
}

function createOpenDBFunction(opts) {
  return function (name, version, description, size) {
    if (typeof sqlitePlugin !== 'undefined') {
      // The SQLite Plugin started deviating pretty heavily from the
      // standard openDatabase() function, as they started adding more features.
      // It's better to just use their "new" format and pass in a big ol'
      // options object. Also there are many options here that may come from
      // the PouchDB constructor, so we have to grab those.
      var sqlitePluginOpts = jsExtend.extend({}, opts, {
        name: name,
        version: version,
        description: description,
        size: size
      });
      return sqlitePlugin.openDatabase(sqlitePluginOpts);
    }

    // Traditional WebSQL API
    return openDatabase(name, version, description, size);
  };
}

function WebSQLPouch(opts, callback) {
  var websql = createOpenDBFunction(opts);
  var _opts = jsExtend.extend({
    websql: websql
  }, opts);

  if (typeof cordova !== 'undefined' && !validWithoutCheckingCordova()) {
    pouchdbUtils.guardedConsole('error',
      'PouchDB error: you must install a SQLite plugin ' +
      'in order for PouchDB to work on this platform. Options:' +
      '\n - https://github.com/nolanlawson/cordova-plugin-sqlite-2' +
      '\n - https://github.com/litehelpers/Cordova-sqlite-storage' +
      '\n - https://github.com/Microsoft/cordova-plugin-websql');
  }

  WebSqlPouchCore.call(this, _opts, callback);
}

WebSQLPouch.valid = valid;

WebSQLPouch.use_prefix = true;

function index (PouchDB) {
  PouchDB.adapter('websql', WebSQLPouch, true);
}

module.exports = index;
},{"js-extend":24,"pouchdb-adapter-websql-core":31,"pouchdb-utils":50}],33:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var Promise = _interopDefault(require('pouchdb-promise'));
var jsExtend = require('js-extend');
var pouchdbErrors = require('pouchdb-errors');
var pouchdbUtils = require('pouchdb-utils');

function wrappedFetch() {
  var wrappedPromise = {};

  var promise = new Promise(function (resolve, reject) {
    wrappedPromise.resolve = resolve;
    wrappedPromise.reject = reject;
  });

  var args = new Array(arguments.length);

  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }

  wrappedPromise.promise = promise;

  Promise.resolve().then(function () {
    return fetch.apply(null, args);
  }).then(function (response) {
    wrappedPromise.resolve(response);
  }).catch(function (error) {
    wrappedPromise.reject(error);
  });

  return wrappedPromise;
}

function fetchRequest(options, callback) {
  var wrappedPromise, timer, response;

  var headers = new Headers();

  var fetchOptions = {
    method: options.method,
    credentials: 'include',
    headers: headers
  };

  if (options.json) {
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', options.headers['Content-Type'] ||
      'application/json');
  }

  if (options.body && (options.body instanceof Blob)) {
    pouchdbBinaryUtils.readAsArrayBuffer(options.body, function (arrayBuffer) {
      fetchOptions.body = arrayBuffer;
    });
  } else if (options.body &&
             options.processData &&
             typeof options.body !== 'string') {
    fetchOptions.body = JSON.stringify(options.body);
  } else if ('body' in options) {
    fetchOptions.body = options.body;
  } else {
    fetchOptions.body = null;
  }

  Object.keys(options.headers).forEach(function (key) {
    if (options.headers.hasOwnProperty(key)) {
      headers.set(key, options.headers[key]);
    }
  });

  wrappedPromise = wrappedFetch(options.url, fetchOptions);

  if (options.timeout > 0) {
    timer = setTimeout(function () {
      wrappedPromise.reject(new Error('Load timeout for resource: ' +
        options.url));
    }, options.timeout);
  }

  wrappedPromise.promise.then(function (fetchResponse) {
    response = {
      statusCode: fetchResponse.status
    };

    if (options.timeout > 0) {
      clearTimeout(timer);
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return options.binary ? fetchResponse.blob() : fetchResponse.text();
    }

    return fetchResponse.json();
  }).then(function (result) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      callback(null, response, result);
    } else {
      callback(result, response);
    }
  }).catch(function (error) {
    callback(error, response);
  });

  return {abort: wrappedPromise.reject};
}

function xhRequest(options, callback) {

  var xhr, timer;
  var timedout = false;

  var abortReq = function () {
    xhr.abort();
  };

  var timeoutReq = function () {
    timedout = true;
    xhr.abort();
  };

  if (options.xhr) {
    xhr = new options.xhr();
  } else {
    xhr = new XMLHttpRequest();
  }

  try {
    xhr.open(options.method, options.url);
  } catch (exception) {
    return callback(new Error(exception.name || 'Url is invalid'));
  }

  xhr.withCredentials = ('withCredentials' in options) ?
    options.withCredentials : true;

  if (options.method === 'GET') {
    delete options.headers['Content-Type'];
  } else if (options.json) {
    options.headers.Accept = 'application/json';
    options.headers['Content-Type'] = options.headers['Content-Type'] ||
      'application/json';
    if (options.body &&
        options.processData &&
        typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
    }
  }

  if (options.binary) {
    xhr.responseType = 'arraybuffer';
  }

  if (!('body' in options)) {
    options.body = null;
  }

  for (var key in options.headers) {
    if (options.headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
  }

  if (options.timeout > 0) {
    timer = setTimeout(timeoutReq, options.timeout);
    xhr.onprogress = function () {
      clearTimeout(timer);
      if(xhr.readyState !== 4) {
        timer = setTimeout(timeoutReq, options.timeout);
      }
    };
    if (typeof xhr.upload !== 'undefined') { // does not exist in ie9
      xhr.upload.onprogress = xhr.onprogress;
    }
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    var response = {
      statusCode: xhr.status
    };

    if (xhr.status >= 200 && xhr.status < 300) {
      var data;
      if (options.binary) {
        data = pouchdbBinaryUtils.blob([xhr.response || ''], {
          type: xhr.getResponseHeader('Content-Type')
        });
      } else {
        data = xhr.responseText;
      }
      callback(null, response, data);
    } else {
      var err = {};
      if (timedout) {
        err = new Error('ETIMEDOUT');
        err.code = 'ETIMEDOUT';
      } else {
        try {
          err = JSON.parse(xhr.response);
        } catch(e) {}
      }
      err.status = xhr.status;
      callback(err);
    }
  };

  if (options.body && (options.body instanceof Blob)) {
    pouchdbBinaryUtils.readAsArrayBuffer(options.body, function (arrayBuffer) {
      xhr.send(arrayBuffer);
    });
  } else {
    xhr.send(options.body);
  }

  return {abort: abortReq};
}

function testXhr() {
  try {
    new XMLHttpRequest();
    return true;
  } catch (err) {
    return false;
  }
}

var hasXhr = testXhr();

function ajax$1(options, callback) {
  if (hasXhr || options.xhr) {
    return xhRequest(options, callback);
  } else {
    return fetchRequest(options, callback);
  }
}

// the blob already has a type; do nothing
var res = function () {};

function defaultBody() {
  return '';
}

function ajaxCore(options, callback) {

  options = pouchdbUtils.clone(options);

  var defaultOptions = {
    method : "GET",
    headers: {},
    json: true,
    processData: true,
    timeout: 10000,
    cache: false
  };

  options = jsExtend.extend(defaultOptions, options);

  function onSuccess(obj, resp, cb) {
    if (!options.binary && options.json && typeof obj === 'string') {
      /* istanbul ignore next */
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        // Probably a malformed JSON from server
        return cb(e);
      }
    }
    if (Array.isArray(obj)) {
      obj = obj.map(function (v) {
        if (v.error || v.missing) {
          return pouchdbErrors.generateErrorFromResponse(v);
        } else {
          return v;
        }
      });
    }
    if (options.binary) {
      res(obj, resp);
    }
    cb(null, obj, resp);
  }

  if (options.json) {
    if (!options.binary) {
      options.headers.Accept = 'application/json';
    }
    options.headers['Content-Type'] = options.headers['Content-Type'] ||
      'application/json';
  }

  if (options.binary) {
    options.encoding = null;
    options.json = false;
  }

  if (!options.processData) {
    options.json = false;
  }

  return ajax$1(options, function (err, response, body) {

    if (err) {
      return callback(pouchdbErrors.generateErrorFromResponse(err));
    }

    var error;
    var content_type = response.headers && response.headers['content-type'];
    var data = body || defaultBody();

    // CouchDB doesn't always return the right content-type for JSON data, so
    // we check for ^{ and }$ (ignoring leading/trailing whitespace)
    if (!options.binary && (options.json || !options.processData) &&
        typeof data !== 'object' &&
        (/json/.test(content_type) ||
         (/^[\s]*\{/.test(data) && /\}[\s]*$/.test(data)))) {
      try {
        data = JSON.parse(data.toString());
      } catch (e) {}
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      onSuccess(data, response, callback);
    } else {
      error = pouchdbErrors.generateErrorFromResponse(data);
      error.status = response.statusCode;
      callback(error);
    }
  });
}

function ajax(opts, callback) {

  // cache-buster, specifically designed to work around IE's aggressive caching
  // see http://www.dashbay.com/2011/05/internet-explorer-caches-ajax/
  // Also Safari caches POSTs, so we need to cache-bust those too.
  var ua = (navigator && navigator.userAgent) ?
    navigator.userAgent.toLowerCase() : '';

  var isSafari = ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
  var isIE = ua.indexOf('msie') !== -1;
  var isEdge = ua.indexOf('edge') !== -1;

  // it appears the new version of safari also caches GETs,
  // see https://github.com/pouchdb/pouchdb/issues/5010
  var shouldCacheBust = (isSafari ||
    ((isIE || isEdge) && opts.method === 'GET'));

  var cache = 'cache' in opts ? opts.cache : true;

  var isBlobUrl = /^blob:/.test(opts.url); // don't append nonces for blob URLs

  if (!isBlobUrl && (shouldCacheBust || !cache)) {
    var hasArgs = opts.url.indexOf('?') !== -1;
    opts.url += (hasArgs ? '&' : '?') + '_nonce=' + Date.now();
  }

  return ajaxCore(opts, callback);
}

module.exports = ajax;
},{"js-extend":24,"pouchdb-binary-utils":34,"pouchdb-errors":41,"pouchdb-promise":48,"pouchdb-utils":50}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var atob$1 = function (str) {
  return atob(str);
};

var btoa$1 = function (str) {
  return btoa(str);
};

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor (e.g.
// old QtWebKit versions, Android < 4.4).
function createBlob(parts, properties) {
  /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
  parts = parts || [];
  properties = properties || {};
  try {
    return new Blob(parts, properties);
  } catch (e) {
    if (e.name !== "TypeError") {
      throw e;
    }
    var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
                  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
                  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder :
                  WebKitBlobBuilder;
    var builder = new Builder();
    for (var i = 0; i < parts.length; i += 1) {
      builder.append(parts[i]);
    }
    return builder.getBlob(properties.type);
  }
}

// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function binaryStringToArrayBuffer(bin) {
  var length = bin.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return buf;
}

function binStringToBluffer(binString, type) {
  return createBlob([binaryStringToArrayBuffer(binString)], {type: type});
}

function b64ToBluffer(b64, type) {
  return binStringToBluffer(atob$1(b64), type);
}

//Can't find original post, but this is close
//http://stackoverflow.com/questions/6965107/ (continues on next line)
//converting-between-strings-and-arraybuffers
function arrayBufferToBinaryString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

// shim for browsers that don't support it
function readAsBinaryString(blob, callback) {
  if (typeof FileReader === 'undefined') {
    // fix for Firefox in a web worker
    // https://bugzilla.mozilla.org/show_bug.cgi?id=901097
    return callback(arrayBufferToBinaryString(
      new FileReaderSync().readAsArrayBuffer(blob)));
  }

  var reader = new FileReader();
  var hasBinaryString = typeof reader.readAsBinaryString === 'function';
  reader.onloadend = function (e) {
    var result = e.target.result || '';
    if (hasBinaryString) {
      return callback(result);
    }
    callback(arrayBufferToBinaryString(result));
  };
  if (hasBinaryString) {
    reader.readAsBinaryString(blob);
  } else {
    reader.readAsArrayBuffer(blob);
  }
}

function blobToBinaryString(blobOrBuffer, callback) {
  readAsBinaryString(blobOrBuffer, function (bin) {
    callback(bin);
  });
}

function blobToBase64(blobOrBuffer, callback) {
  blobToBinaryString(blobOrBuffer, function (base64) {
    callback(btoa$1(base64));
  });
}

// simplified API. universal browser support is assumed
function readAsArrayBuffer(blob, callback) {
  if (typeof FileReader === 'undefined') {
    // fix for Firefox in a web worker:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=901097
    return callback(new FileReaderSync().readAsArrayBuffer(blob));
  }

  var reader = new FileReader();
  reader.onloadend = function (e) {
    var result = e.target.result || new ArrayBuffer(0);
    callback(result);
  };
  reader.readAsArrayBuffer(blob);
}

// this is not used in the browser
function typedBuffer() {
}

exports.atob = atob$1;
exports.btoa = btoa$1;
exports.base64StringToBlobOrBuffer = b64ToBluffer;
exports.binaryStringToArrayBuffer = binaryStringToArrayBuffer;
exports.binaryStringToBlobOrBuffer = binStringToBluffer;
exports.blob = createBlob;
exports.blobOrBufferToBase64 = blobToBase64;
exports.blobOrBufferToBinaryString = blobToBinaryString;
exports.readAsArrayBuffer = readAsArrayBuffer;
exports.readAsBinaryString = readAsBinaryString;
exports.typedBuffer = typedBuffer;
},{}],35:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PouchDB = _interopDefault(require('pouchdb-core'));
var IDBPouch = _interopDefault(require('pouchdb-adapter-idb'));
var WebSqlPouch = _interopDefault(require('pouchdb-adapter-websql'));
var HttpPouch = _interopDefault(require('pouchdb-adapter-http'));
var mapreduce = _interopDefault(require('pouchdb-mapreduce'));
var replication = _interopDefault(require('pouchdb-replication'));

PouchDB.plugin(IDBPouch)
  .plugin(WebSqlPouch)
  .plugin(HttpPouch)
  .plugin(mapreduce)
  .plugin(replication);

module.exports = PouchDB;
},{"pouchdb-adapter-http":28,"pouchdb-adapter-idb":29,"pouchdb-adapter-websql":32,"pouchdb-core":40,"pouchdb-mapreduce":45,"pouchdb-replication":49}],36:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Promise = _interopDefault(require('pouchdb-promise'));
var pouchdbUtils = require('pouchdb-utils');
var pouchdbCollate = require('pouchdb-collate');

var CHECKPOINT_VERSION = 1;
var REPLICATOR = "pouchdb";
// This is an arbitrary number to limit the
// amount of replication history we save in the checkpoint.
// If we save too much, the checkpoing docs will become very big,
// if we save fewer, we'll run a greater risk of having to
// read all the changes from 0 when checkpoint PUTs fail
// CouchDB 2.0 has a more involved history pruning,
// but let's go for the simple version for now.
var CHECKPOINT_HISTORY_SIZE = 5;
var LOWEST_SEQ = 0;

function updateCheckpoint(db, id, checkpoint, session, returnValue) {
  return db.get(id).catch(function (err) {
    if (err.status === 404) {
      if (db.type() === 'http') {
        pouchdbUtils.explainError(
          404, 'PouchDB is just checking if a remote checkpoint exists.'
        );
      }
      return {
        session_id: session,
        _id: id,
        history: [],
        replicator: REPLICATOR,
        version: CHECKPOINT_VERSION
      };
    }
    throw err;
  }).then(function (doc) {
    if (returnValue.cancelled) {
      return;
    }
    // Filter out current entry for this replication
    doc.history = (doc.history || []).filter(function (item) {
      return item.session_id !== session;
    });

    // Add the latest checkpoint to history
    doc.history.unshift({
      last_seq: checkpoint,
      session_id: session
    });

    // Just take the last pieces in history, to
    // avoid really big checkpoint docs.
    // see comment on history size above
    doc.history = doc.history.slice(0, CHECKPOINT_HISTORY_SIZE);

    doc.version = CHECKPOINT_VERSION;
    doc.replicator = REPLICATOR;

    doc.session_id = session;
    doc.last_seq = checkpoint;

    return db.put(doc).catch(function (err) {
      if (err.status === 409) {
        // retry; someone is trying to write a checkpoint simultaneously
        return updateCheckpoint(db, id, checkpoint, session, returnValue);
      }
      throw err;
    });
  });
}

function Checkpointer(src, target, id, returnValue) {
  this.src = src;
  this.target = target;
  this.id = id;
  this.returnValue = returnValue;
}

Checkpointer.prototype.writeCheckpoint = function (checkpoint, session) {
  var self = this;
  return this.updateTarget(checkpoint, session).then(function () {
    return self.updateSource(checkpoint, session);
  });
};

Checkpointer.prototype.updateTarget = function (checkpoint, session) {
  return updateCheckpoint(this.target, this.id, checkpoint,
    session, this.returnValue);
};

Checkpointer.prototype.updateSource = function (checkpoint, session) {
  var self = this;
  if (this.readOnlySource) {
    return Promise.resolve(true);
  }
  return updateCheckpoint(this.src, this.id, checkpoint,
    session, this.returnValue)
    .catch(function (err) {
      if (isForbiddenError(err)) {
        self.readOnlySource = true;
        return true;
      }
      throw err;
    });
};

var comparisons = {
  "undefined": function (targetDoc, sourceDoc) {
    // This is the previous comparison function
    if (pouchdbCollate.collate(targetDoc.last_seq, sourceDoc.last_seq) === 0) {
      return sourceDoc.last_seq;
    }
    /* istanbul ignore next */
    return 0;
  },
  "1": function (targetDoc, sourceDoc) {
    // This is the comparison function ported from CouchDB
    return compareReplicationLogs(sourceDoc, targetDoc).last_seq;
  }
};

Checkpointer.prototype.getCheckpoint = function () {
  var self = this;
  return self.target.get(self.id).then(function (targetDoc) {
    if (self.readOnlySource) {
      return Promise.resolve(targetDoc.last_seq);
    }

    return self.src.get(self.id).then(function (sourceDoc) {
      // Since we can't migrate an old version doc to a new one
      // (no session id), we just go with the lowest seq in this case
      /* istanbul ignore if */
      if (targetDoc.version !== sourceDoc.version) {
        return LOWEST_SEQ;
      }

      var version;
      if (targetDoc.version) {
        version = targetDoc.version.toString();
      } else {
        version = "undefined";
      }

      if (version in comparisons) {
        return comparisons[version](targetDoc, sourceDoc);
      }
      /* istanbul ignore next */
      return LOWEST_SEQ;
    }, function (err) {
      if (err.status === 404 && targetDoc.last_seq) {
        return self.src.put({
          _id: self.id,
          last_seq: LOWEST_SEQ
        }).then(function () {
          return LOWEST_SEQ;
        }, function (err) {
          if (isForbiddenError(err)) {
            self.readOnlySource = true;
            return targetDoc.last_seq;
          }
          /* istanbul ignore next */
          return LOWEST_SEQ;
        });
      }
      throw err;
    });
  }).catch(function (err) {
    if (err.status !== 404) {
      throw err;
    }
    return LOWEST_SEQ;
  });
};
// This checkpoint comparison is ported from CouchDBs source
// they come from here:
// https://github.com/apache/couchdb-couch-replicator/blob/master/src/couch_replicator.erl#L863-L906

function compareReplicationLogs(srcDoc, tgtDoc) {
  if (srcDoc.session_id === tgtDoc.session_id) {
    return {
      last_seq: srcDoc.last_seq,
      history: srcDoc.history
    };
  }

  return compareReplicationHistory(srcDoc.history, tgtDoc.history);
}

function compareReplicationHistory(sourceHistory, targetHistory) {
  // the erlang loop via function arguments is not so easy to repeat in JS
  // therefore, doing this as recursion
  var S = sourceHistory[0];
  var sourceRest = sourceHistory.slice(1);
  var T = targetHistory[0];
  var targetRest = targetHistory.slice(1);

  if (!S || targetHistory.length === 0) {
    return {
      last_seq: LOWEST_SEQ,
      history: []
    };
  }

  var sourceId = S.session_id;
  /* istanbul ignore if */
  if (hasSessionId(sourceId, targetHistory)) {
    return {
      last_seq: S.last_seq,
      history: sourceHistory
    };
  }

  var targetId = T.session_id;
  if (hasSessionId(targetId, sourceRest)) {
    return {
      last_seq: T.last_seq,
      history: targetRest
    };
  }

  return compareReplicationHistory(sourceRest, targetRest);
}

function hasSessionId(sessionId, history) {
  var props = history[0];
  var rest = history.slice(1);

  if (!sessionId || history.length === 0) {
    return false;
  }

  if (sessionId === props.session_id) {
    return true;
  }

  return hasSessionId(sessionId, rest);
}

function isForbiddenError(err) {
  return typeof err.status === 'number' && Math.floor(err.status / 100) === 4;
}

module.exports = Checkpointer;
},{"pouchdb-collate":37,"pouchdb-promise":48,"pouchdb-utils":50}],37:[function(require,module,exports){
'use strict';

var MIN_MAGNITUDE = -324; // verified by -Number.MIN_VALUE
var MAGNITUDE_DIGITS = 3; // ditto
var SEP = ''; // set to '_' for easier debugging 

var utils = require('./utils');

exports.collate = function (a, b) {

  if (a === b) {
    return 0;
  }

  a = exports.normalizeKey(a);
  b = exports.normalizeKey(b);

  var ai = collationIndex(a);
  var bi = collationIndex(b);
  if ((ai - bi) !== 0) {
    return ai - bi;
  }
  if (a === null) {
    return 0;
  }
  switch (typeof a) {
    case 'number':
      return a - b;
    case 'boolean':
      return a === b ? 0 : (a < b ? -1 : 1);
    case 'string':
      return stringCollate(a, b);
  }
  return Array.isArray(a) ? arrayCollate(a, b) : objectCollate(a, b);
};

// couch considers null/NaN/Infinity/-Infinity === undefined,
// for the purposes of mapreduce indexes. also, dates get stringified.
exports.normalizeKey = function (key) {
  switch (typeof key) {
    case 'undefined':
      return null;
    case 'number':
      if (key === Infinity || key === -Infinity || isNaN(key)) {
        return null;
      }
      return key;
    case 'object':
      var origKey = key;
      if (Array.isArray(key)) {
        var len = key.length;
        key = new Array(len);
        for (var i = 0; i < len; i++) {
          key[i] = exports.normalizeKey(origKey[i]);
        }
      } else if (key instanceof Date) {
        return key.toJSON();
      } else if (key !== null) { // generic object
        key = {};
        for (var k in origKey) {
          if (origKey.hasOwnProperty(k)) {
            var val = origKey[k];
            if (typeof val !== 'undefined') {
              key[k] = exports.normalizeKey(val);
            }
          }
        }
      }
  }
  return key;
};

function indexify(key) {
  if (key !== null) {
    switch (typeof key) {
      case 'boolean':
        return key ? 1 : 0;
      case 'number':
        return numToIndexableString(key);
      case 'string':
        // We've to be sure that key does not contain \u0000
        // Do order-preserving replacements:
        // 0 -> 1, 1
        // 1 -> 1, 2
        // 2 -> 2, 2
        return key
          .replace(/\u0002/g, '\u0002\u0002')
          .replace(/\u0001/g, '\u0001\u0002')
          .replace(/\u0000/g, '\u0001\u0001');
      case 'object':
        var isArray = Array.isArray(key);
        var arr = isArray ? key : Object.keys(key);
        var i = -1;
        var len = arr.length;
        var result = '';
        if (isArray) {
          while (++i < len) {
            result += exports.toIndexableString(arr[i]);
          }
        } else {
          while (++i < len) {
            var objKey = arr[i];
            result += exports.toIndexableString(objKey) +
                exports.toIndexableString(key[objKey]);
          }
        }
        return result;
    }
  }
  return '';
}

// convert the given key to a string that would be appropriate
// for lexical sorting, e.g. within a database, where the
// sorting is the same given by the collate() function.
exports.toIndexableString = function (key) {
  var zero = '\u0000';
  key = exports.normalizeKey(key);
  return collationIndex(key) + SEP + indexify(key) + zero;
};

function parseNumber(str, i) {
  var originalIdx = i;
  var num;
  var zero = str[i] === '1';
  if (zero) {
    num = 0;
    i++;
  } else {
    var neg = str[i] === '0';
    i++;
    var numAsString = '';
    var magAsString = str.substring(i, i + MAGNITUDE_DIGITS);
    var magnitude = parseInt(magAsString, 10) + MIN_MAGNITUDE;
    if (neg) {
      magnitude = -magnitude;
    }
    i += MAGNITUDE_DIGITS;
    while (true) {
      var ch = str[i];
      if (ch === '\u0000') {
        break;
      } else {
        numAsString += ch;
      }
      i++;
    }
    numAsString = numAsString.split('.');
    if (numAsString.length === 1) {
      num = parseInt(numAsString, 10);
    } else {
      num = parseFloat(numAsString[0] + '.' + numAsString[1]);
    }
    if (neg) {
      num = num - 10;
    }
    if (magnitude !== 0) {
      // parseFloat is more reliable than pow due to rounding errors
      // e.g. Number.MAX_VALUE would return Infinity if we did
      // num * Math.pow(10, magnitude);
      num = parseFloat(num + 'e' + magnitude);
    }
  }
  return {num: num, length : i - originalIdx};
}

// move up the stack while parsing
// this function moved outside of parseIndexableString for performance
function pop(stack, metaStack) {
  var obj = stack.pop();

  if (metaStack.length) {
    var lastMetaElement = metaStack[metaStack.length - 1];
    if (obj === lastMetaElement.element) {
      // popping a meta-element, e.g. an object whose value is another object
      metaStack.pop();
      lastMetaElement = metaStack[metaStack.length - 1];
    }
    var element = lastMetaElement.element;
    var lastElementIndex = lastMetaElement.index;
    if (Array.isArray(element)) {
      element.push(obj);
    } else if (lastElementIndex === stack.length - 2) { // obj with key+value
      var key = stack.pop();
      element[key] = obj;
    } else {
      stack.push(obj); // obj with key only
    }
  }
}

exports.parseIndexableString = function (str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;

  while (true) {
    var collationIndex = str[i++];
    if (collationIndex === '\u0000') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case '1':
        stack.push(null);
        break;
      case '2':
        stack.push(str[i] === '1');
        i++;
        break;
      case '3':
        var parsedNum = parseNumber(str, i);
        stack.push(parsedNum.num);
        i += parsedNum.length;
        break;
      case '4':
        var parsedStr = '';
        while (true) {
          var ch = str[i];
          if (ch === '\u0000') {
            break;
          }
          parsedStr += ch;
          i++;
        }
        // perform the reverse of the order-preserving replacement
        // algorithm (see above)
        parsedStr = parsedStr.replace(/\u0001\u0001/g, '\u0000')
          .replace(/\u0001\u0002/g, '\u0001')
          .replace(/\u0002\u0002/g, '\u0002');
        stack.push(parsedStr);
        break;
      case '5':
        var arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '6':
        var objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      default:
        throw new Error(
          'bad collationIndex or unexpectedly reached end of input: ' + collationIndex);
    }
  }
};

function arrayCollate(a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var sort = exports.collate(a[i], b[i]);
    if (sort !== 0) {
      return sort;
    }
  }
  return (a.length === b.length) ? 0 :
    (a.length > b.length) ? 1 : -1;
}
function stringCollate(a, b) {
  // See: https://github.com/daleharvey/pouchdb/issues/40
  // This is incompatible with the CouchDB implementation, but its the
  // best we can do for now
  return (a === b) ? 0 : ((a > b) ? 1 : -1);
}
function objectCollate(a, b) {
  var ak = Object.keys(a), bk = Object.keys(b);
  var len = Math.min(ak.length, bk.length);
  for (var i = 0; i < len; i++) {
    // First sort the keys
    var sort = exports.collate(ak[i], bk[i]);
    if (sort !== 0) {
      return sort;
    }
    // if the keys are equal sort the values
    sort = exports.collate(a[ak[i]], b[bk[i]]);
    if (sort !== 0) {
      return sort;
    }

  }
  return (ak.length === bk.length) ? 0 :
    (ak.length > bk.length) ? 1 : -1;
}
// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
// null/undefined/NaN/Infinity/-Infinity are all considered null
function collationIndex(x) {
  var id = ['boolean', 'number', 'string', 'object'];
  var idx = id.indexOf(typeof x);
  //false if -1 otherwise true, but fast!!!!1
  if (~idx) {
    if (x === null) {
      return 1;
    }
    if (Array.isArray(x)) {
      return 5;
    }
    return idx < 3 ? (idx + 2) : (idx + 3);
  }
  if (Array.isArray(x)) {
    return 5;
  }
}

// conversion:
// x yyy zz...zz
// x = 0 for negative, 1 for 0, 2 for positive
// y = exponent (for negative numbers negated) moved so that it's >= 0
// z = mantisse
function numToIndexableString(num) {

  if (num === 0) {
    return '1';
  }

  // convert number to exponential format for easier and
  // more succinct string sorting
  var expFormat = num.toExponential().split(/e\+?/);
  var magnitude = parseInt(expFormat[1], 10);

  var neg = num < 0;

  var result = neg ? '0' : '2';

  // first sort by magnitude
  // it's easier if all magnitudes are positive
  var magForComparison = ((neg ? -magnitude : magnitude) - MIN_MAGNITUDE);
  var magString = utils.padLeft((magForComparison).toString(), '0', MAGNITUDE_DIGITS);

  result += SEP + magString;

  // then sort by the factor
  var factor = Math.abs(parseFloat(expFormat[0])); // [1..10)
  if (neg) { // for negative reverse ordering
    factor = 10 - factor;
  }

  var factorStr = factor.toFixed(20);

  // strip zeros from the end
  factorStr = factorStr.replace(/\.?0+$/, '');

  result += SEP + factorStr;

  return result;
}

},{"./utils":38}],38:[function(require,module,exports){
'use strict';

function pad(str, padWith, upToLength) {
  var padding = '';
  var targetLength = upToLength - str.length;
  while (padding.length < targetLength) {
    padding += padWith;
  }
  return padding;
}

exports.padLeft = function (str, padWith, upToLength) {
  var padding = pad(str, padWith, upToLength);
  return padding + str;
};

exports.padRight = function (str, padWith, upToLength) {
  var padding = pad(str, padWith, upToLength);
  return str + padding;
};

exports.stringLexCompare = function (a, b) {

  var aLen = a.length;
  var bLen = b.length;

  var i;
  for (i = 0; i < aLen; i++) {
    if (i === bLen) {
      // b is shorter substring of a
      return 1;
    }
    var aChar = a.charAt(i);
    var bChar = b.charAt(i);
    if (aChar !== bChar) {
      return aChar < bChar ? -1 : 1;
    }
  }

  if (aLen < bLen) {
    // a is shorter substring of b
    return -1;
  }

  return 0;
};

/*
 * returns the decimal form for the given integer, i.e. writes
 * out all the digits (in base-10) instead of using scientific notation
 */
exports.intToDecimalForm = function (int) {

  var isNeg = int < 0;
  var result = '';

  do {
    var remainder = isNeg ? -Math.ceil(int % 10) : Math.floor(int % 10);

    result = remainder + result;
    int = isNeg ? Math.ceil(int / 10) : Math.floor(int / 10);
  } while (int);


  if (isNeg && result !== '0') {
    result = '-' + result;
  }

  return result;
};
},{}],39:[function(require,module,exports){
'use strict';
exports.Map = LazyMap; // TODO: use ES6 map
exports.Set = LazySet; // TODO: use ES6 set
// based on https://github.com/montagejs/collections
function LazyMap() {
  this.store = {};
}
LazyMap.prototype.mangle = function (key) {
  if (typeof key !== "string") {
    throw new TypeError("key must be a string but Got " + key);
  }
  return '$' + key;
};
LazyMap.prototype.unmangle = function (key) {
  return key.substring(1);
};
LazyMap.prototype.get = function (key) {
  var mangled = this.mangle(key);
  if (mangled in this.store) {
    return this.store[mangled];
  }
  return void 0;
};
LazyMap.prototype.set = function (key, value) {
  var mangled = this.mangle(key);
  this.store[mangled] = value;
  return true;
};
LazyMap.prototype.has = function (key) {
  var mangled = this.mangle(key);
  return mangled in this.store;
};
LazyMap.prototype.delete = function (key) {
  var mangled = this.mangle(key);
  if (mangled in this.store) {
    delete this.store[mangled];
    return true;
  }
  return false;
};
LazyMap.prototype.forEach = function (cb) {
  var keys = Object.keys(this.store);
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    var value = this.store[key];
    key = this.unmangle(key);
    cb(value, key);
  }
};

function LazySet(array) {
  this.store = new LazyMap();

  // init with an array
  if (array && Array.isArray(array)) {
    for (var i = 0, len = array.length; i < len; i++) {
      this.add(array[i]);
    }
  }
}
LazySet.prototype.add = function (key) {
  return this.store.set(key, true);
};
LazySet.prototype.has = function (key) {
  return this.store.has(key);
};
LazySet.prototype.delete = function (key) {
  return this.store.delete(key);
};

},{}],40:[function(require,module,exports){
(function (process,global){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jsExtend = require('js-extend');
var debug = _interopDefault(require('debug'));
var inherits = _interopDefault(require('inherits'));
var Promise = _interopDefault(require('pouchdb-promise'));
var pouchdbCollections = require('pouchdb-collections');
var getArguments = _interopDefault(require('argsarray'));
var events = require('events');
var pouchdbUtils = require('pouchdb-utils');
var pouchdbMerge = require('pouchdb-merge');
var scopedEval = _interopDefault(require('scope-eval'));
var pouchdbErrors = require('pouchdb-errors');

function evalFilter(input) {
  return scopedEval('return ' + input + ';', {});
}

function evalView(input) {
  /* jshint evil:true */
  return new Function('doc', [
    'var emitted = false;',
    'var emit = function (a, b) {',
    '  emitted = true;',
    '};',
    'var view = ' + input + ';',
    'view(doc);',
    'if (emitted) {',
    '  return true;',
    '}'
  ].join('\n'));
}

inherits(Changes, events.EventEmitter);

function tryCatchInChangeListener(self, change) {
  // isolate try/catches to avoid V8 deoptimizations
  try {
    self.emit('change', change);
  } catch (e) {
    pouchdbUtils.guardedConsole('error', 'Error in .on("change", function):', e);
  }
}

function Changes(db, opts, callback) {
  events.EventEmitter.call(this);
  var self = this;
  this.db = db;
  opts = opts ? pouchdbUtils.clone(opts) : {};
  var complete = opts.complete = pouchdbUtils.once(function (err, resp) {
    if (err) {
      if (pouchdbUtils.listenerCount(self, 'error') > 0) {
        self.emit('error', err);
      }
    } else {
      self.emit('complete', resp);
    }
    self.removeAllListeners();
    db.removeListener('destroyed', onDestroy);
  });
  if (callback) {
    self.on('complete', function (resp) {
      callback(null, resp);
    });
    self.on('error', callback);
  }
  function onDestroy() {
    self.cancel();
  }
  db.once('destroyed', onDestroy);

  opts.onChange = function (change) {
    /* istanbul ignore if */
    if (opts.isCancelled) {
      return;
    }
    tryCatchInChangeListener(self, change);
    if (self.startSeq && self.startSeq <= change.seq) {
      self.startSeq = false;
    }
  };

  var promise = new Promise(function (fulfill, reject) {
    opts.complete = function (err, res) {
      if (err) {
        reject(err);
      } else {
        fulfill(res);
      }
    };
  });
  self.once('cancel', function () {
    db.removeListener('destroyed', onDestroy);
    opts.complete(null, {status: 'cancelled'});
  });
  this.then = promise.then.bind(promise);
  this['catch'] = promise['catch'].bind(promise);
  this.then(function (result) {
    complete(null, result);
  }, complete);



  if (!db.taskqueue.isReady) {
    db.taskqueue.addTask(function () {
      if (self.isCancelled) {
        self.emit('cancel');
      } else {
        self.doChanges(opts);
      }
    });
  } else {
    self.doChanges(opts);
  }
}
Changes.prototype.cancel = function () {
  this.isCancelled = true;
  if (this.db.taskqueue.isReady) {
    this.emit('cancel');
  }
};
function processChange(doc, metadata, opts) {
  var changeList = [{rev: doc._rev}];
  if (opts.style === 'all_docs') {
    changeList = pouchdbMerge.collectLeaves(metadata.rev_tree)
    .map(function (x) { return {rev: x.rev}; });
  }
  var change = {
    id: metadata.id,
    changes: changeList,
    doc: doc
  };

  if (pouchdbMerge.isDeleted(metadata, doc._rev)) {
    change.deleted = true;
  }
  if (opts.conflicts) {
    change.doc._conflicts = pouchdbMerge.collectConflicts(metadata);
    if (!change.doc._conflicts.length) {
      delete change.doc._conflicts;
    }
  }
  return change;
}

Changes.prototype.doChanges = function (opts) {
  var self = this;
  var callback = opts.complete;

  opts = pouchdbUtils.clone(opts);
  if ('live' in opts && !('continuous' in opts)) {
    opts.continuous = opts.live;
  }
  opts.processChange = processChange;

  if (opts.since === 'latest') {
    opts.since = 'now';
  }
  if (!opts.since) {
    opts.since = 0;
  }
  if (opts.since === 'now') {
    this.db.info().then(function (info) {
      /* istanbul ignore if */
      if (self.isCancelled) {
        callback(null, {status: 'cancelled'});
        return;
      }
      opts.since = info.update_seq;
      self.doChanges(opts);
    }, callback);
    return;
  }

  if (opts.continuous && opts.since !== 'now') {
    this.db.info().then(function (info) {
      self.startSeq = info.update_seq;
    /* istanbul ignore next */
    }, function (err) {
      if (err.id === 'idbNull') {
        // db closed before this returned thats ok
        return;
      }
      throw err;
    });
  }

  if (opts.view && !opts.filter) {
    opts.filter = '_view';
  }

  if (opts.filter && typeof opts.filter === 'string') {
    if (opts.filter === '_view') {
      opts.view = pouchdbUtils.normalizeDdocFunctionName(opts.view);
    } else {
      opts.filter = pouchdbUtils.normalizeDdocFunctionName(opts.filter);
    }

    if (this.db.type() !== 'http' && !opts.doc_ids) {
      return this.filterChanges(opts);
    }
  }

  if (!('descending' in opts)) {
    opts.descending = false;
  }

  // 0 and 1 should return 1 document
  opts.limit = opts.limit === 0 ? 1 : opts.limit;
  opts.complete = callback;
  var newPromise = this.db._changes(opts);
  if (newPromise && typeof newPromise.cancel === 'function') {
    var cancel = self.cancel;
    self.cancel = getArguments(function (args) {
      newPromise.cancel();
      cancel.apply(this, args);
    });
  }
};

Changes.prototype.filterChanges = function (opts) {
  var self = this;
  var callback = opts.complete;
  if (opts.filter === '_view') {
    if (!opts.view || typeof opts.view !== 'string') {
      var err = pouchdbErrors.createError(pouchdbErrors.BAD_REQUEST,
        '`view` filter parameter not found or invalid.');
      return callback(err);
    }
    // fetch a view from a design doc, make it behave like a filter
    var viewName = pouchdbUtils.parseDdocFunctionName(opts.view);
    this.db.get('_design/' + viewName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (self.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(pouchdbErrors.generateErrorFromResponse(err));
      }
      var mapFun = ddoc && ddoc.views && ddoc.views[viewName[1]] &&
        ddoc.views[viewName[1]].map;
      if (!mapFun) {
        return callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC,
          (ddoc.views ? 'missing json key: ' + viewName[1] :
            'missing json key: views')));
      }
      opts.filter = evalView(mapFun);
      self.doChanges(opts);
    });
  } else {
    // fetch a filter from a design doc
    var filterName = pouchdbUtils.parseDdocFunctionName(opts.filter);
    if (!filterName) {
      return self.doChanges(opts);
    }
    this.db.get('_design/' + filterName[0], function (err, ddoc) {
      /* istanbul ignore if */
      if (self.isCancelled) {
        return callback(null, {status: 'cancelled'});
      }
      /* istanbul ignore next */
      if (err) {
        return callback(pouchdbErrors.generateErrorFromResponse(err));
      }
      var filterFun = ddoc && ddoc.filters && ddoc.filters[filterName[1]];
      if (!filterFun) {
        return callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC,
          ((ddoc && ddoc.filters) ? 'missing json key: ' + filterName[1]
            : 'missing json key: filters')));
      }
      opts.filter = evalFilter(filterFun);
      self.doChanges(opts);
    });
  }
};

/*
 * A generic pouch adapter
 */

function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

// returns first element of arr satisfying callback predicate
function arrayFirst(arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    if (callback(arr[i], i) === true) {
      return arr[i];
    }
  }
}

// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function yankError(callback) {
  return function (err, results) {
    if (err || (results[0] && results[0].error)) {
      callback(err || results[0]);
    } else {
      callback(null, results.length ? results[0]  : results);
    }
  };
}

// clean docs given to us by the user
function cleanDocs(docs) {
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    if (doc._deleted) {
      delete doc._attachments; // ignore atts for deleted docs
    } else if (doc._attachments) {
      // filter out extraneous keys from _attachments
      var atts = Object.keys(doc._attachments);
      for (var j = 0; j < atts.length; j++) {
        var att = atts[j];
        doc._attachments[att] = pouchdbUtils.pick(doc._attachments[att],
          ['data', 'digest', 'content_type', 'length', 'revpos', 'stub']);
      }
    }
  }
}

// compare two docs, first by _id then by _rev
function compareByIdThenRev(a, b) {
  var idCompare = compare(a._id, b._id);
  if (idCompare !== 0) {
    return idCompare;
  }
  var aStart = a._revisions ? a._revisions.start : 0;
  var bStart = b._revisions ? b._revisions.start : 0;
  return compare(aStart, bStart);
}

// for every node in a revision tree computes its distance from the closest
// leaf
function computeHeight(revs) {
  var height = {};
  var edges = [];
  pouchdbMerge.traverseRevTree(revs, function (isLeaf, pos, id, prnt) {
    var rev = pos + "-" + id;
    if (isLeaf) {
      height[rev] = 0;
    }
    if (prnt !== undefined) {
      edges.push({from: prnt, to: rev});
    }
    return rev;
  });

  edges.reverse();
  edges.forEach(function (edge) {
    if (height[edge.from] === undefined) {
      height[edge.from] = 1 + height[edge.to];
    } else {
      height[edge.from] = Math.min(height[edge.from], 1 + height[edge.to]);
    }
  });
  return height;
}

function allDocsKeysQuery(api, opts, callback) {
  var keys =  ('limit' in opts) ?
      opts.keys.slice(opts.skip, opts.limit + opts.skip) :
      (opts.skip > 0) ? opts.keys.slice(opts.skip) : opts.keys;
  if (opts.descending) {
    keys.reverse();
  }
  if (!keys.length) {
    return api._allDocs({limit: 0}, callback);
  }
  var finalResults = {
    offset: opts.skip
  };
  return Promise.all(keys.map(function (key) {
    var subOpts = jsExtend.extend({key: key, deleted: 'ok'}, opts);
    ['limit', 'skip', 'keys'].forEach(function (optKey) {
      delete subOpts[optKey];
    });
    return new Promise(function (resolve, reject) {
      api._allDocs(subOpts, function (err, res) {
        /* istanbul ignore if */
        if (err) {
          return reject(err);
        }
        finalResults.total_rows = res.total_rows;
        resolve(res.rows[0] || {key: key, error: 'not_found'});
      });
    });
  })).then(function (results) {
    finalResults.rows = results;
    return finalResults;
  });
}

// all compaction is done in a queue, to avoid attaching
// too many listeners at once
function doNextCompaction(self) {
  var task = self._compactionQueue[0];
  var opts = task.opts;
  var callback = task.callback;
  self.get('_local/compaction').catch(function () {
    return false;
  }).then(function (doc) {
    if (doc && doc.last_seq) {
      opts.last_seq = doc.last_seq;
    }
    self._compact(opts, function (err, res) {
      /* istanbul ignore if */
      if (err) {
        callback(err);
      } else {
        callback(null, res);
      }
      process.nextTick(function () {
        self._compactionQueue.shift();
        if (self._compactionQueue.length) {
          doNextCompaction(self);
        }
      });
    });
  });
}

function attachmentNameError(name) {
  if (name.charAt(0) === '_') {
    return name + 'is not a valid attachment name, attachment ' +
      'names cannot start with \'_\'';
  }
  return false;
}

inherits(AbstractPouchDB, events.EventEmitter);

function AbstractPouchDB() {
  events.EventEmitter.call(this);
}

AbstractPouchDB.prototype.post =
  pouchdbUtils.adapterFun('post', function (doc, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    return callback(pouchdbErrors.createError(pouchdbErrors.NOT_AN_OBJECT));
  }
  this.bulkDocs({docs: [doc]}, opts, yankError(callback));
});

AbstractPouchDB.prototype.put =
  pouchdbUtils.adapterFun('put', getArguments(function (args) {
  var temp, temptype, opts, callback;
  var warned = false;
  var doc = args.shift();
  var id = '_id' in doc;
  if (typeof doc !== 'object' || Array.isArray(doc)) {
    callback = args.pop();
    return callback(pouchdbErrors.createError(pouchdbErrors.NOT_AN_OBJECT));
  }

  function warn() {
    if (warned) {
      return;
    }
    pouchdbUtils.guardedConsole('warn', 'db.put(doc, id, rev) has been deprecated and will be ' +
                 'removed in a future release, please use ' +
                 'db.put({_id: id, _rev: rev}) instead');
    warned = true;
  }

  /* eslint no-constant-condition: 0 */
  while (true) {
    temp = args.shift();
    temptype = typeof temp;
    if (temptype === "string" && !id) {
      warn();
      doc._id = temp;
      id = true;
    } else if (temptype === "string" && id && !('_rev' in doc)) {
      warn();
      doc._rev = temp;
    } else if (temptype === "object") {
      opts = temp;
    } else if (temptype === "function") {
      callback = temp;
    }
    if (!args.length) {
      break;
    }
  }
  opts = opts || {};
  pouchdbUtils.invalidIdError(doc._id);
  if (pouchdbMerge.isLocalId(doc._id) && typeof this._putLocal === 'function') {
    if (doc._deleted) {
      return this._removeLocal(doc, callback);
    } else {
      return this._putLocal(doc, callback);
    }
  }
  this.bulkDocs({docs: [doc]}, opts, yankError(callback));
}));

AbstractPouchDB.prototype.putAttachment =
  pouchdbUtils.adapterFun('putAttachment', function (docId, attachmentId, rev,
                                              blob, type) {
  var api = this;
  if (typeof type === 'function') {
    type = blob;
    blob = rev;
    rev = null;
  }
  // Lets fix in https://github.com/pouchdb/pouchdb/issues/3267
  /* istanbul ignore if */
  if (typeof type === 'undefined') {
    type = blob;
    blob = rev;
    rev = null;
  }

  function createAttachment(doc) {
    var prevrevpos = '_rev' in doc ? parseInt(doc._rev, 10) : 0;
    doc._attachments = doc._attachments || {};
    doc._attachments[attachmentId] = {
      content_type: type,
      data: blob,
      revpos: ++prevrevpos
    };
    return api.put(doc);
  }

  return api.get(docId).then(function (doc) {
    if (doc._rev !== rev) {
      throw pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT);
    }

    return createAttachment(doc);
  }, function (err) {
     // create new doc
    /* istanbul ignore else */
    if (err.reason === pouchdbErrors.MISSING_DOC.message) {
      return createAttachment({_id: docId});
    } else {
      throw err;
    }
  });
});

AbstractPouchDB.prototype.removeAttachment =
  pouchdbUtils.adapterFun('removeAttachment', function (docId, attachmentId, rev,
                                                 callback) {
  var self = this;
  self.get(docId, function (err, obj) {
    /* istanbul ignore if */
    if (err) {
      callback(err);
      return;
    }
    if (obj._rev !== rev) {
      callback(pouchdbErrors.createError(pouchdbErrors.REV_CONFLICT));
      return;
    }
    /* istanbul ignore if */
    if (!obj._attachments) {
      return callback();
    }
    delete obj._attachments[attachmentId];
    if (Object.keys(obj._attachments).length === 0) {
      delete obj._attachments;
    }
    self.put(obj, callback);
  });
});

AbstractPouchDB.prototype.remove =
  pouchdbUtils.adapterFun('remove', function (docOrId, optsOrRev, opts, callback) {
  var doc;
  if (typeof optsOrRev === 'string') {
    // id, rev, opts, callback style
    doc = {
      _id: docOrId,
      _rev: optsOrRev
    };
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
  } else {
    // doc, opts, callback style
    doc = docOrId;
    if (typeof optsOrRev === 'function') {
      callback = optsOrRev;
      opts = {};
    } else {
      callback = opts;
      opts = optsOrRev;
    }
  }
  opts = opts || {};
  opts.was_delete = true;
  var newDoc = {_id: doc._id, _rev: (doc._rev || opts.rev)};
  newDoc._deleted = true;
  if (pouchdbMerge.isLocalId(newDoc._id) && typeof this._removeLocal === 'function') {
    return this._removeLocal(doc, callback);
  }
  this.bulkDocs({docs: [newDoc]}, opts, yankError(callback));
});

AbstractPouchDB.prototype.revsDiff =
  pouchdbUtils.adapterFun('revsDiff', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  var ids = Object.keys(req);

  if (!ids.length) {
    return callback(null, {});
  }

  var count = 0;
  var missing = new pouchdbCollections.Map();

  function addToMissing(id, revId) {
    if (!missing.has(id)) {
      missing.set(id, {missing: []});
    }
    missing.get(id).missing.push(revId);
  }

  function processDoc(id, rev_tree) {
    // Is this fast enough? Maybe we should switch to a set simulated by a map
    var missingForId = req[id].slice(0);
    pouchdbMerge.traverseRevTree(rev_tree, function (isLeaf, pos, revHash, ctx,
      opts) {
        var rev = pos + '-' + revHash;
        var idx = missingForId.indexOf(rev);
        if (idx === -1) {
          return;
        }

        missingForId.splice(idx, 1);
        /* istanbul ignore if */
        if (opts.status !== 'available') {
          addToMissing(id, rev);
        }
      });

    // Traversing the tree is synchronous, so now `missingForId` contains
    // revisions that were not found in the tree
    missingForId.forEach(function (rev) {
      addToMissing(id, rev);
    });
  }

  ids.map(function (id) {
    this._getRevisionTree(id, function (err, rev_tree) {
      if (err && err.status === 404 && err.message === 'missing') {
        missing.set(id, {missing: req[id]});
      } else if (err) {
        /* istanbul ignore next */
        return callback(err);
      } else {
        processDoc(id, rev_tree);
      }

      if (++count === ids.length) {
        // convert LazyMap to object
        var missingObj = {};
        missing.forEach(function (value, key) {
          missingObj[key] = value;
        });
        return callback(null, missingObj);
      }
    });
  }, this);
});

// _bulk_get API for faster replication, as described in
// https://github.com/apache/couchdb-chttpd/pull/33
// At the "abstract" level, it will just run multiple get()s in
// parallel, because this isn't much of a performance cost
// for local databases (except the cost of multiple transactions, which is
// small). The http adapter overrides this in order
// to do a more efficient single HTTP request.
AbstractPouchDB.prototype.bulkGet =
  pouchdbUtils.adapterFun('bulkGet', function (opts, callback) {
  pouchdbUtils.bulkGetShim(this, opts, callback);
});

// compact one document and fire callback
// by compacting we mean removing all revisions which
// are further from the leaf in revision tree than max_height
AbstractPouchDB.prototype.compactDocument =
  pouchdbUtils.adapterFun('compactDocument', function (docId, maxHeight, callback) {
  var self = this;
  this._getRevisionTree(docId, function (err, revTree) {
    /* istanbul ignore if */
    if (err) {
      return callback(err);
    }
    var height = computeHeight(revTree);
    var candidates = [];
    var revs = [];
    Object.keys(height).forEach(function (rev) {
      if (height[rev] > maxHeight) {
        candidates.push(rev);
      }
    });

    pouchdbMerge.traverseRevTree(revTree, function (isLeaf, pos, revHash, ctx, opts) {
      var rev = pos + '-' + revHash;
      if (opts.status === 'available' && candidates.indexOf(rev) !== -1) {
        revs.push(rev);
      }
    });
    self._doCompaction(docId, revs, callback);
  });
});

// compact the whole database using single document
// compaction
AbstractPouchDB.prototype.compact =
  pouchdbUtils.adapterFun('compact', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  opts = opts || {};

  self._compactionQueue = self._compactionQueue || [];
  self._compactionQueue.push({opts: opts, callback: callback});
  if (self._compactionQueue.length === 1) {
    doNextCompaction(self);
  }
});
AbstractPouchDB.prototype._compact = function (opts, callback) {
  var self = this;
  var changesOpts = {
    return_docs: false,
    last_seq: opts.last_seq || 0
  };
  var promises = [];

  function onChange(row) {
    promises.push(self.compactDocument(row.id, 0));
  }
  function onComplete(resp) {
    var lastSeq = resp.last_seq;
    Promise.all(promises).then(function () {
      return pouchdbUtils.upsert(self, '_local/compaction', function deltaFunc(doc) {
        if (!doc.last_seq || doc.last_seq < lastSeq) {
          doc.last_seq = lastSeq;
          return doc;
        }
        return false; // somebody else got here first, don't update
      });
    }).then(function () {
      callback(null, {ok: true});
    }).catch(callback);
  }
  self.changes(changesOpts)
    .on('change', onChange)
    .on('complete', onComplete)
    .on('error', callback);
};
/* Begin api wrappers. Specific functionality to storage belongs in the
   _[method] */
AbstractPouchDB.prototype.get =
  pouchdbUtils.adapterFun('get', function (id, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof id !== 'string') {
    return callback(pouchdbErrors.createError(pouchdbErrors.INVALID_ID));
  }
  if (pouchdbMerge.isLocalId(id) && typeof this._getLocal === 'function') {
    return this._getLocal(id, callback);
  }
  var leaves = [], self = this;

  function finishOpenRevs() {
    var result = [];
    var count = leaves.length;
    /* istanbul ignore if */
    if (!count) {
      return callback(null, result);
    }
    // order with open_revs is unspecified
    leaves.forEach(function (leaf) {
      self.get(id, {
        rev: leaf,
        revs: opts.revs,
        attachments: opts.attachments
      }, function (err, doc) {
        if (!err) {
          result.push({ok: doc});
        } else {
          result.push({missing: leaf});
        }
        count--;
        if (!count) {
          callback(null, result);
        }
      });
    });
  }

  if (opts.open_revs) {
    if (opts.open_revs === "all") {
      this._getRevisionTree(id, function (err, rev_tree) {
        if (err) {
          return callback(err);
        }
        leaves = pouchdbMerge.collectLeaves(rev_tree).map(function (leaf) {
          return leaf.rev;
        });
        finishOpenRevs();
      });
    } else {
      if (Array.isArray(opts.open_revs)) {
        leaves = opts.open_revs;
        for (var i = 0; i < leaves.length; i++) {
          var l = leaves[i];
          // looks like it's the only thing couchdb checks
          if (!(typeof (l) === "string" && /^\d+-/.test(l))) {
            return callback(pouchdbErrors.createError(pouchdbErrors.INVALID_REV));
          }
        }
        finishOpenRevs();
      } else {
        return callback(pouchdbErrors.createError(pouchdbErrors.UNKNOWN_ERROR,
          'function_clause'));
      }
    }
    return; // open_revs does not like other options
  }

  return this._get(id, opts, function (err, result) {
    if (err) {
      return callback(err);
    }

    var doc = result.doc;
    var metadata = result.metadata;
    var ctx = result.ctx;

    if (opts.conflicts) {
      var conflicts = pouchdbMerge.collectConflicts(metadata);
      if (conflicts.length) {
        doc._conflicts = conflicts;
      }
    }

    if (pouchdbMerge.isDeleted(metadata, doc._rev)) {
      doc._deleted = true;
    }

    if (opts.revs || opts.revs_info) {
      var paths = pouchdbMerge.rootToLeaf(metadata.rev_tree);
      var path = arrayFirst(paths, function (arr) {
        return arr.ids.map(function (x) { return x.id; })
          .indexOf(doc._rev.split('-')[1]) !== -1;
      });

      var indexOfRev = path.ids.map(function (x) {return x.id; })
        .indexOf(doc._rev.split('-')[1]) + 1;
      var howMany = path.ids.length - indexOfRev;
      path.ids.splice(indexOfRev, howMany);
      path.ids.reverse();

      if (opts.revs) {
        doc._revisions = {
          start: (path.pos + path.ids.length) - 1,
          ids: path.ids.map(function (rev) {
            return rev.id;
          })
        };
      }
      if (opts.revs_info) {
        var pos =  path.pos + path.ids.length;
        doc._revs_info = path.ids.map(function (rev) {
          pos--;
          return {
            rev: pos + '-' + rev.id,
            status: rev.opts.status
          };
        });
      }
    }

    if (opts.attachments && doc._attachments) {
      var attachments = doc._attachments;
      var count = Object.keys(attachments).length;
      if (count === 0) {
        return callback(null, doc);
      }
      Object.keys(attachments).forEach(function (key) {
        this._getAttachment(doc._id, key, attachments[key], {
          // Previously the revision handling was done in adapter.js
          // getAttachment, however since idb-next doesnt we need to
          // pass the rev through
          rev: doc._rev,
          binary: opts.binary,
          ctx: ctx
        }, function (err, data) {
          var att = doc._attachments[key];
          att.data = data;
          delete att.stub;
          delete att.length;
          if (!--count) {
            callback(null, doc);
          }
        });
      }, self);
    } else {
      if (doc._attachments) {
        for (var key in doc._attachments) {
          /* istanbul ignore else */
          if (doc._attachments.hasOwnProperty(key)) {
            doc._attachments[key].stub = true;
          }
        }
      }
      callback(null, doc);
    }
  });
});

// TODO: I dont like this, it forces an extra read for every
// attachment read and enforces a confusing api between
// adapter.js and the adapter implementation
AbstractPouchDB.prototype.getAttachment =
  pouchdbUtils.adapterFun('getAttachment', function (docId, attachmentId, opts,
                                              callback) {
  var self = this;
  if (opts instanceof Function) {
    callback = opts;
    opts = {};
  }
  this._get(docId, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (res.doc._attachments && res.doc._attachments[attachmentId]) {
      opts.ctx = res.ctx;
      opts.binary = true;
      self._getAttachment(docId, attachmentId,
                          res.doc._attachments[attachmentId], opts, callback);
    } else {
      return callback(pouchdbErrors.createError(pouchdbErrors.MISSING_DOC));
    }
  });
});

AbstractPouchDB.prototype.allDocs =
  pouchdbUtils.adapterFun('allDocs', function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts.skip = typeof opts.skip !== 'undefined' ? opts.skip : 0;
  if (opts.start_key) {
    opts.startkey = opts.start_key;
  }
  if (opts.end_key) {
    opts.endkey = opts.end_key;
  }
  if ('keys' in opts) {
    if (!Array.isArray(opts.keys)) {
      return callback(new TypeError('options.keys must be an array'));
    }
    var incompatibleOpt =
      ['startkey', 'endkey', 'key'].filter(function (incompatibleOpt) {
      return incompatibleOpt in opts;
    })[0];
    if (incompatibleOpt) {
      callback(pouchdbErrors.createError(pouchdbErrors.QUERY_PARSE_ERROR,
        'Query parameter `' + incompatibleOpt +
        '` is not compatible with multi-get'
      ));
      return;
    }
    if (this.type() !== 'http') {
      return allDocsKeysQuery(this, opts, callback);
    }
  }

  return this._allDocs(opts, callback);
});

AbstractPouchDB.prototype.changes = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return new Changes(this, opts, callback);
};

AbstractPouchDB.prototype.close =
  pouchdbUtils.adapterFun('close', function (callback) {
  this._closed = true;
  return this._close(callback);
});

AbstractPouchDB.prototype.info = pouchdbUtils.adapterFun('info', function (callback) {
  var self = this;
  this._info(function (err, info) {
    if (err) {
      return callback(err);
    }
    // assume we know better than the adapter, unless it informs us
    info.db_name = info.db_name || self._db_name;
    info.auto_compaction = !!(self.auto_compaction && self.type() !== 'http');
    info.adapter = self.type();
    callback(null, info);
  });
});

AbstractPouchDB.prototype.id = pouchdbUtils.adapterFun('id', function (callback) {
  return this._id(callback);
});

AbstractPouchDB.prototype.type = function () {
  /* istanbul ignore next */
  return (typeof this._type === 'function') ? this._type() : this.adapter;
};

AbstractPouchDB.prototype.bulkDocs =
  pouchdbUtils.adapterFun('bulkDocs', function (req, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  opts = opts || {};

  if (Array.isArray(req)) {
    req = {
      docs: req
    };
  }

  if (!req || !req.docs || !Array.isArray(req.docs)) {
    return callback(pouchdbErrors.createError(pouchdbErrors.MISSING_BULK_DOCS));
  }

  for (var i = 0; i < req.docs.length; ++i) {
    if (typeof req.docs[i] !== 'object' || Array.isArray(req.docs[i])) {
      return callback(pouchdbErrors.createError(pouchdbErrors.NOT_AN_OBJECT));
    }
  }

  var attachmentError;
  req.docs.forEach(function (doc) {
    if (doc._attachments) {
      Object.keys(doc._attachments).forEach(function (name) {
        attachmentError = attachmentError || attachmentNameError(name);
      });
    }
  });

  if (attachmentError) {
    return callback(pouchdbErrors.createError(pouchdbErrors.BAD_REQUEST, attachmentError));
  }

  if (!('new_edits' in opts)) {
    if ('new_edits' in req) {
      opts.new_edits = req.new_edits;
    } else {
      opts.new_edits = true;
    }
  }

  if (!opts.new_edits && this.type() !== 'http') {
    // ensure revisions of the same doc are sorted, so that
    // the local adapter processes them correctly (#2935)
    req.docs.sort(compareByIdThenRev);
  }

  cleanDocs(req.docs);

  return this._bulkDocs(req, opts, function (err, res) {
    if (err) {
      return callback(err);
    }
    if (!opts.new_edits) {
      // this is what couch does when new_edits is false
      res = res.filter(function (x) {
        return x.error;
      });
    }
    callback(null, res);
  });
});

AbstractPouchDB.prototype.registerDependentDatabase =
  pouchdbUtils.adapterFun('registerDependentDatabase', function (dependentDb,
                                                          callback) {
  var depDB = new this.constructor(dependentDb, this.__opts);

  function diffFun(doc) {
    doc.dependentDbs = doc.dependentDbs || {};
    if (doc.dependentDbs[dependentDb]) {
      return false; // no update required
    }
    doc.dependentDbs[dependentDb] = true;
    return doc;
  }
  pouchdbUtils.upsert(this, '_local/_pouch_dependentDbs', diffFun)
    .then(function () {
      callback(null, {db: depDB});
    }).catch(callback);
});

AbstractPouchDB.prototype.destroy =
  pouchdbUtils.adapterFun('destroy', function (opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var self = this;
  var usePrefix = 'use_prefix' in self ? self.use_prefix : true;

  function destroyDb() {
    // call destroy method of the particular adaptor
    self._destroy(opts, function (err, resp) {
      if (err) {
        return callback(err);
      }
      self._destroyed = true;
      self.emit('destroyed');
      callback(null, resp || { 'ok': true });
    });
  }

  if (self.type() === 'http') {
    // no need to check for dependent DBs if it's a remote DB
    return destroyDb();
  }

  self.get('_local/_pouch_dependentDbs', function (err, localDoc) {
    if (err) {
      /* istanbul ignore if */
      if (err.status !== 404) {
        return callback(err);
      } else { // no dependencies
        return destroyDb();
      }
    }
    var dependentDbs = localDoc.dependentDbs;
    var PouchDB = self.constructor;
    var deletedMap = Object.keys(dependentDbs).map(function (name) {
      // use_prefix is only false in the browser
      /* istanbul ignore next */
      var trueName = usePrefix ?
        name.replace(new RegExp('^' + PouchDB.prefix), '') : name;
      return new PouchDB(trueName, self.__opts).destroy();
    });
    Promise.all(deletedMap).then(destroyDb, callback);
  });
});

function TaskQueue() {
  this.isReady = false;
  this.failed = false;
  this.queue = [];
}

TaskQueue.prototype.execute = function () {
  var fun;
  if (this.failed) {
    while ((fun = this.queue.shift())) {
      fun(this.failed);
    }
  } else {
    while ((fun = this.queue.shift())) {
      fun();
    }
  }
};

TaskQueue.prototype.fail = function (err) {
  this.failed = err;
  this.execute();
};

TaskQueue.prototype.ready = function (db) {
  this.isReady = true;
  this.db = db;
  this.execute();
};

TaskQueue.prototype.addTask = function (fun) {
  this.queue.push(fun);
  if (this.failed) {
    this.execute();
  }
};

function defaultCallback(err) {
  /* istanbul ignore next */
  if (err && global.debug) {
    pouchdbUtils.guardedConsole('error', err);
  }
}

// OK, so here's the deal. Consider this code:
//     var db1 = new PouchDB('foo');
//     var db2 = new PouchDB('foo');
//     db1.destroy();
// ^ these two both need to emit 'destroyed' events,
// as well as the PouchDB constructor itself.
// So we have one db object (whichever one got destroy() called on it)
// responsible for emitting the initial event, which then gets emitted
// by the constructor, which then broadcasts it to any other dbs
// that may have been created with the same name.
function prepareForDestruction(self, opts) {
  var name = opts.originalName;
  var ctor = self.constructor;
  var destructionListeners = ctor._destructionListeners;

  function onDestroyed() {
    ctor.emit('destroyed', name);
  }

  function onConstructorDestroyed() {
    self.removeListener('destroyed', onDestroyed);
    self.emit('destroyed', self);
  }

  self.once('destroyed', onDestroyed);

  // in setup.js, the constructor is primed to listen for destroy events
  if (!destructionListeners.has(name)) {
    destructionListeners.set(name, []);
  }
  destructionListeners.get(name).push(onConstructorDestroyed);
}

inherits(PouchDB, AbstractPouchDB);
function PouchDB(name, opts, callback) {

  /* istanbul ignore if */
  if (!(this instanceof PouchDB)) {
    return new PouchDB(name, opts, callback);
  }

  var self = this;
  if (typeof opts === 'function' || typeof opts === 'undefined') {
    callback = opts;
    opts = {};
  }

  if (name && typeof name === 'object') {
    opts = name;
    name = undefined;
  }

  if (typeof callback === 'undefined') {
    callback = defaultCallback;
  } else {
    var oldCallback = callback;
    callback = function () {
      pouchdbUtils.guardedConsole('warn', 'Using a callback for new PouchDB()' +
                     'is deprecated.');
      return oldCallback.apply(null, arguments);
    };
  }

  name = name || opts.name;
  opts = pouchdbUtils.clone(opts);
  // if name was specified via opts, ignore for the sake of dependentDbs
  delete opts.name;
  this.__opts = opts;
  var oldCB = callback;
  self.auto_compaction = opts.auto_compaction;
  self.prefix = PouchDB.prefix;
  AbstractPouchDB.call(self);
  self.taskqueue = new TaskQueue();
  var promise = new Promise(function (fulfill, reject) {
    callback = function (err, resp) {
      /* istanbul ignore if */
      if (err) {
        return reject(err);
      }
      delete resp.then;
      fulfill(resp);
    };

    opts = pouchdbUtils.clone(opts);
    var backend, error;
    (function () {
      try {

        if (typeof name !== 'string') {
          error = new Error('Missing/invalid DB name');
          error.code = 400;
          throw error;
        }

        var prefixedName = (opts.prefix || '') + name;
        backend = PouchDB.parseAdapter(prefixedName, opts);

        opts.originalName = name;
        opts.name = backend.name;
        opts.adapter = opts.adapter || backend.adapter;
        self._adapter = opts.adapter;
        debug('pouchdb:adapter')('Picked adapter: ' + opts.adapter);

        self._db_name = name;
        if (!PouchDB.adapters[opts.adapter]) {
          error = new Error('Adapter is missing');
          error.code = 404;
          throw error;
        }

        /* istanbul ignore if */
        if (!PouchDB.adapters[opts.adapter].valid()) {
          error = new Error('Invalid Adapter');
          error.code = 404;
          throw error;
        }
      } catch (err) {
        self.taskqueue.fail(err);
      }
    }());
    if (error) {
      return reject(error); // constructor error, see above
    }
    self.adapter = opts.adapter;

    // needs access to PouchDB;
    self.replicate = {};

    self.replicate.from = function (url, opts, callback) {
      return self.constructor.replicate(url, self, opts, callback);
    };

    self.replicate.to = function (url, opts, callback) {
      return self.constructor.replicate(self, url, opts, callback);
    };

    self.sync = function (dbName, opts, callback) {
      return self.constructor.sync(self, dbName, opts, callback);
    };

    self.replicate.sync = self.sync;

    PouchDB.adapters[opts.adapter].call(self, opts, function (err) {
      /* istanbul ignore if */
      if (err) {
        self.taskqueue.fail(err);
        callback(err);
        return;
      }
      prepareForDestruction(self, opts);

      self.emit('created', self);
      PouchDB.emit('created', opts.originalName);
      self.taskqueue.ready(self);
      callback(null, self);
    });

  });
  promise.then(function (resp) {
    oldCB(null, resp);
  }, oldCB);
  self.then = promise.then.bind(promise);
  self.catch = promise.catch.bind(promise);
}

PouchDB.debug = debug;

PouchDB.adapters = {};
PouchDB.preferredAdapters = [];

PouchDB.prefix = '_pouch_';

var eventEmitter = new events.EventEmitter();

function setUpEventEmitter(Pouch) {
  Object.keys(events.EventEmitter.prototype).forEach(function (key) {
    if (typeof events.EventEmitter.prototype[key] === 'function') {
      Pouch[key] = eventEmitter[key].bind(eventEmitter);
    }
  });

  // these are created in constructor.js, and allow us to notify each DB with
  // the same name that it was destroyed, via the constructor object
  var destructListeners = Pouch._destructionListeners = new pouchdbCollections.Map();
  Pouch.on('destroyed', function onConstructorDestroyed(name) {
    destructListeners.get(name).forEach(function (callback) {
      callback();
    });
    destructListeners.delete(name);
  });
}

setUpEventEmitter(PouchDB);

PouchDB.parseAdapter = function (name, opts) {
  var match = name.match(/([a-z\-]*):\/\/(.*)/);
  var adapter, adapterName;
  if (match) {
    // the http adapter expects the fully qualified name
    name = /http(s?)/.test(match[1]) ? match[1] + '://' + match[2] : match[2];
    adapter = match[1];
    /* istanbul ignore if */
    if (!PouchDB.adapters[adapter].valid()) {
      throw 'Invalid adapter';
    }
    return {name: name, adapter: match[1]};
  }

  // check for browsers that have been upgraded from websql-only to websql+idb
  var skipIdb = 'idb' in PouchDB.adapters && 'websql' in PouchDB.adapters &&
    pouchdbUtils.hasLocalStorage() &&
    localStorage['_pouch__websqldb_' + PouchDB.prefix + name];


  if (opts.adapter) {
    adapterName = opts.adapter;
  } else if (typeof opts !== 'undefined' && opts.db) {
    adapterName = 'leveldb';
  } else { // automatically determine adapter
    for (var i = 0; i < PouchDB.preferredAdapters.length; ++i) {
      adapterName = PouchDB.preferredAdapters[i];
      if (adapterName in PouchDB.adapters) {
        /* istanbul ignore if */
        if (skipIdb && adapterName === 'idb') {
          // log it, because this can be confusing during development
          pouchdbUtils.guardedConsole('log', 'PouchDB is downgrading "' + name + '" to WebSQL to' +
            ' avoid data loss, because it was already opened with WebSQL.');
          continue; // keep using websql to avoid user data loss
        }
        break;
      }
    }
  }

  adapter = PouchDB.adapters[adapterName];

  // if adapter is invalid, then an error will be thrown later
  var usePrefix = (adapter && 'use_prefix' in adapter) ?
      adapter.use_prefix : true;

  return {
    name: usePrefix ? (PouchDB.prefix + name) : name,
    adapter: adapterName
  };
};

PouchDB.adapter = function (id, obj, addToPreferredAdapters) {
  if (obj.valid()) {
    PouchDB.adapters[id] = obj;
    if (addToPreferredAdapters) {
      PouchDB.preferredAdapters.push(id);
    }
  }
};

PouchDB.plugin = function (obj) {
  if (typeof obj === 'function') { // function style for plugins
    obj(PouchDB);
  } else {
    Object.keys(obj).forEach(function (id) { // object style for plugins
      PouchDB.prototype[id] = obj[id];
    });
  }
  return PouchDB;
};

PouchDB.defaults = function (defaultOpts) {
  function PouchAlt(name, opts, callback) {
    if (!(this instanceof PouchAlt)) {
      return new PouchAlt(name, opts, callback);
    }

    if (typeof opts === 'function' || typeof opts === 'undefined') {
      callback = opts;
      opts = {};
    }
    if (name && typeof name === 'object') {
      opts = name;
      name = undefined;
    }

    opts = jsExtend.extend({}, defaultOpts, opts);
    PouchDB.call(this, name, opts, callback);
  }

  inherits(PouchAlt, PouchDB);

  PouchAlt.preferredAdapters = PouchDB.preferredAdapters.slice();
  Object.keys(PouchDB).forEach(function (key) {
    if (!(key in PouchAlt)) {
      PouchAlt[key] = PouchDB[key];
    }
  });

  return PouchAlt;
};

// managed automatically by set-version.js
var version = "5.4.5";

PouchDB.version = version;

module.exports = PouchDB;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":5,"argsarray":1,"debug":16,"events":19,"inherits":22,"js-extend":24,"pouchdb-collections":39,"pouchdb-errors":41,"pouchdb-merge":47,"pouchdb-promise":48,"pouchdb-utils":50,"scope-eval":69}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inherits = _interopDefault(require('inherits'));

inherits(PouchError, Error);

function PouchError(opts) {
  Error.call(this, opts.reason);
  this.status = opts.status;
  this.name = opts.error;
  this.message = opts.reason;
  this.error = true;
}

PouchError.prototype.toString = function () {
  return JSON.stringify({
    status: this.status,
    name: this.name,
    message: this.message,
    reason: this.reason
  });
};

var UNAUTHORIZED = new PouchError({
  status: 401,
  error: 'unauthorized',
  reason: "Name or password is incorrect."
});

var MISSING_BULK_DOCS = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: "Missing JSON list of 'docs'"
});

var MISSING_DOC = new PouchError({
  status: 404,
  error: 'not_found',
  reason: 'missing'
});

var REV_CONFLICT = new PouchError({
  status: 409,
  error: 'conflict',
  reason: 'Document update conflict'
});

var INVALID_ID = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: '_id field must contain a string'
});

var MISSING_ID = new PouchError({
  status: 412,
  error: 'missing_id',
  reason: '_id is required for puts'
});

var RESERVED_ID = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: 'Only reserved document ids may start with underscore.'
});

var NOT_OPEN = new PouchError({
  status: 412,
  error: 'precondition_failed',
  reason: 'Database not open'
});

var UNKNOWN_ERROR = new PouchError({
  status: 500,
  error: 'unknown_error',
  reason: 'Database encountered an unknown error'
});

var BAD_ARG = new PouchError({
  status: 500,
  error: 'badarg',
  reason: 'Some query argument is invalid'
});

var INVALID_REQUEST = new PouchError({
  status: 400,
  error: 'invalid_request',
  reason: 'Request was invalid'
});

var QUERY_PARSE_ERROR = new PouchError({
  status: 400,
  error: 'query_parse_error',
  reason: 'Some query parameter is invalid'
});

var DOC_VALIDATION = new PouchError({
  status: 500,
  error: 'doc_validation',
  reason: 'Bad special document member'
});

var BAD_REQUEST = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: 'Something wrong with the request'
});

var NOT_AN_OBJECT = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: 'Document must be a JSON object'
});

var DB_MISSING = new PouchError({
  status: 404,
  error: 'not_found',
  reason: 'Database not found'
});

var IDB_ERROR = new PouchError({
  status: 500,
  error: 'indexed_db_went_bad',
  reason: 'unknown'
});

var WSQ_ERROR = new PouchError({
  status: 500,
  error: 'web_sql_went_bad',
  reason: 'unknown'
});

var LDB_ERROR = new PouchError({
  status: 500,
  error: 'levelDB_went_went_bad',
  reason: 'unknown'
});

var FORBIDDEN = new PouchError({
  status: 403,
  error: 'forbidden',
  reason: 'Forbidden by design doc validate_doc_update function'
});

var INVALID_REV = new PouchError({
  status: 400,
  error: 'bad_request',
  reason: 'Invalid rev format'
});

var FILE_EXISTS = new PouchError({
  status: 412,
  error: 'file_exists',
  reason: 'The database could not be created, the file already exists.'
});

var MISSING_STUB = new PouchError({
  status: 412,
  error: 'missing_stub'
});

var INVALID_URL = new PouchError({
  status: 413,
  error: 'invalid_url',
  reason: 'Provided URL is invalid'
});

function createError(error, reason) {
  function CustomPouchError(reason) {
    // inherit error properties from our parent error manually
    // so as to allow proper JSON parsing.
    /* jshint ignore:start */
    for (var p in error) {
      if (typeof error[p] !== 'function') {
        this[p] = error[p];
      }
    }
    /* jshint ignore:end */
    if (reason !== undefined) {
      this.reason = reason;
    }
  }
  CustomPouchError.prototype = PouchError.prototype;
  return new CustomPouchError(reason);
}

function generateErrorFromResponse(err) {

  if (typeof err !== 'object') {
    var data = err;
    err = UNKNOWN_ERROR;
    err.data = data;
  }

  if ('error' in err && err.error === 'conflict') {
    err.name = 'conflict';
    err.status = 409;
  }

  if (!('name' in err)) {
    err.name = err.error || 'unknown';
  }

  if (!('status' in err)) {
    err.status = 500;
  }

  if (!('message' in err)) {
    err.message = err.message || err.reason;
  }

  return err;
}

exports.UNAUTHORIZED = UNAUTHORIZED;
exports.MISSING_BULK_DOCS = MISSING_BULK_DOCS;
exports.MISSING_DOC = MISSING_DOC;
exports.REV_CONFLICT = REV_CONFLICT;
exports.INVALID_ID = INVALID_ID;
exports.MISSING_ID = MISSING_ID;
exports.RESERVED_ID = RESERVED_ID;
exports.NOT_OPEN = NOT_OPEN;
exports.UNKNOWN_ERROR = UNKNOWN_ERROR;
exports.BAD_ARG = BAD_ARG;
exports.INVALID_REQUEST = INVALID_REQUEST;
exports.QUERY_PARSE_ERROR = QUERY_PARSE_ERROR;
exports.DOC_VALIDATION = DOC_VALIDATION;
exports.BAD_REQUEST = BAD_REQUEST;
exports.NOT_AN_OBJECT = NOT_AN_OBJECT;
exports.DB_MISSING = DB_MISSING;
exports.WSQ_ERROR = WSQ_ERROR;
exports.LDB_ERROR = LDB_ERROR;
exports.FORBIDDEN = FORBIDDEN;
exports.INVALID_REV = INVALID_REV;
exports.FILE_EXISTS = FILE_EXISTS;
exports.MISSING_STUB = MISSING_STUB;
exports.IDB_ERROR = IDB_ERROR;
exports.INVALID_URL = INVALID_URL;
exports.createError = createError;
exports.generateErrorFromResponse = generateErrorFromResponse;
},{"inherits":22}],42:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Promise = _interopDefault(require('pouchdb-promise'));
var pouchdbMd5 = require('pouchdb-md5');
var pouchdbCollate = require('pouchdb-collate');

function sortObjectPropertiesByKey(queryParams) {
  return Object.keys(queryParams).sort(pouchdbCollate.collate).reduce(function (result, key) {
    result[key] = queryParams[key];
    return result;
  }, {});
}

// Generate a unique id particular to this replication.
// Not guaranteed to align perfectly with CouchDB's rep ids.
function generateReplicationId(src, target, opts) {
  var docIds = opts.doc_ids ? opts.doc_ids.sort(pouchdbCollate.collate) : '';
  var filterFun = opts.filter ? opts.filter.toString() : '';
  var queryParams = '';
  var filterViewName =  '';

  if (opts.filter && opts.query_params) {
    queryParams = JSON.stringify(sortObjectPropertiesByKey(opts.query_params));
  }

  if (opts.filter && opts.filter === '_view') {
    filterViewName = opts.view.toString();
  }

  return Promise.all([src.id(), target.id()]).then(function (res) {
    var queryData = res[0] + res[1] + filterFun + filterViewName +
      queryParams + docIds;
    return new Promise(function (resolve) {
      pouchdbMd5.binaryMd5(queryData, resolve);
    });
  }).then(function (md5sum) {
    // can't use straight-up md5 alphabet, because
    // the char '/' is interpreted as being for attachments,
    // and + is also not url-safe
    md5sum = md5sum.replace(/\//g, '.').replace(/\+/g, '_');
    return '_local/' + md5sum;
  });
}

module.exports = generateReplicationId;
},{"pouchdb-collate":37,"pouchdb-md5":46,"pouchdb-promise":48}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vuvuzela = _interopDefault(require('vuvuzela'));

function slowJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.parse(str);
  }
}

function safeJsonParse(str) {
  // try/catch is deoptimized in V8, leading to slower
  // times than we'd like to have. Most documents are _not_
  // huge, and do not require a slower code path just to parse them.
  // We can be pretty sure that a document under 50000 characters
  // will not be so deeply nested as to throw a stack overflow error
  // (depends on the engine and available memory, though, so this is
  // just a hunch). 50000 was chosen based on the average length
  // of this string in our test suite, to try to find a number that covers
  // most of our test cases (26 over this size, 26378 under it).
  if (str.length < 50000) {
    return JSON.parse(str);
  }
  return slowJsonParse(str);
}

function safeJsonStringify(json) {
  try {
    return JSON.stringify(json);
  } catch (e) {
    /* istanbul ignore next */
    return vuvuzela.stringify(json);
  }
}

exports.safeJsonParse = safeJsonParse;
exports.safeJsonStringify = safeJsonStringify;
},{"vuvuzela":91}],44:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var argsarray = _interopDefault(require('argsarray'));

var promisedCallback = function (promise, callback) {
  if (callback) {
    promise.then(function (res) {
      process.nextTick(function () {
        callback(null, res);
      });
    }, function (reason) {
      process.nextTick(function () {
        callback(reason);
      });
    });
  }
  return promise;
};

var callbackify = function (fun) {
  return argsarray(function (args) {
    var cb = args.pop();
    var promise = fun.apply(this, args);
    if (typeof cb === 'function') {
      promisedCallback(promise, cb);
    }
    return promise;
  });
};

// Promise finally util similar to Q.finally
var fin = function (promise, finalPromiseFactory) {
  return promise.then(function (res) {
    return finalPromiseFactory().then(function () {
      return res;
    });
  }, function (reason) {
    return finalPromiseFactory().then(function () {
      throw reason;
    });
  });
};

var sequentialize = function (queue, promiseFactory) {
  return function () {
    var args = arguments;
    var that = this;
    return queue.add(function () {
      return promiseFactory.apply(that, args);
    });
  };
};

// uniq an array of strings, order not guaranteed
// similar to underscore/lodash _.uniq
var uniq = function (arr) {
  var map = {};

  for (var i = 0, len = arr.length; i < len; i++) {
    map['$' + arr[i]] = true;
  }

  var keys = Object.keys(map);
  var output = new Array(keys.length);

  for (i = 0, len = keys.length; i < len; i++) {
    output[i] = keys[i].substring(1);
  }
  return output;
};

exports.uniq = uniq;
exports.sequentialize = sequentialize;
exports.fin = fin;
exports.callbackify = callbackify;
exports.promisedCallback = promisedCallback;
}).call(this,require('_process'))
},{"_process":5,"argsarray":1}],45:[function(require,module,exports){
(function (process){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var pouchdbUtils = require('pouchdb-utils');
var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var pouchdbCollate = require('pouchdb-collate');
var Promise = _interopDefault(require('pouchdb-promise'));
var pouchdbMd5 = require('pouchdb-md5');
var scopedEval = _interopDefault(require('scope-eval'));
var pouchdbMapreduceUtils = require('pouchdb-mapreduce-utils');
var inherits = _interopDefault(require('inherits'));

function TaskQueue() {
  this.promise = new Promise(function (fulfill) {fulfill(); });
}
TaskQueue.prototype.add = function (promiseFactory) {
  this.promise = this.promise.catch(function () {
    // just recover
  }).then(function () {
    return promiseFactory();
  });
  return this.promise;
};
TaskQueue.prototype.finish = function () {
  return this.promise;
};

function createView(opts) {
  var sourceDB = opts.db;
  var viewName = opts.viewName;
  var mapFun = opts.map;
  var reduceFun = opts.reduce;
  var temporary = opts.temporary;

  // the "undefined" part is for backwards compatibility
  var viewSignature = mapFun.toString() + (reduceFun && reduceFun.toString()) +
    'undefined';

  var cachedViews;
  if (!temporary) {
    // cache this to ensure we don't try to update the same view twice
    cachedViews = sourceDB._cachedViews = sourceDB._cachedViews || {};
    if (cachedViews[viewSignature]) {
      return cachedViews[viewSignature];
    }
  }

  var promiseForView = sourceDB.info().then(function (info) {

    var depDbName = info.db_name + '-mrview-' +
      (temporary ? 'temp' : pouchdbMd5.stringMd5(viewSignature));

    // save the view name in the source db so it can be cleaned up if necessary
    // (e.g. when the _design doc is deleted, remove all associated view data)
    function diffFunction(doc) {
      doc.views = doc.views || {};
      var fullViewName = viewName;
      if (fullViewName.indexOf('/') === -1) {
        fullViewName = viewName + '/' + viewName;
      }
      var depDbs = doc.views[fullViewName] = doc.views[fullViewName] || {};
      /* istanbul ignore if */
      if (depDbs[depDbName]) {
        return; // no update necessary
      }
      depDbs[depDbName] = true;
      return doc;
    }
    return pouchdbUtils.upsert(sourceDB, '_local/mrviews', diffFunction).then(function () {
      return sourceDB.registerDependentDatabase(depDbName).then(function (res) {
        var db = res.db;
        db.auto_compaction = true;
        var view = {
          name: depDbName,
          db: db,
          sourceDB: sourceDB,
          adapter: sourceDB.adapter,
          mapFun: mapFun,
          reduceFun: reduceFun
        };
        return view.db.get('_local/lastSeq').catch(function (err) {
          /* istanbul ignore if */
          if (err.status !== 404) {
            throw err;
          }
        }).then(function (lastSeqDoc) {
          view.seq = lastSeqDoc ? lastSeqDoc.seq : 0;
          if (cachedViews) {
            view.db.once('destroyed', function () {
              delete cachedViews[viewSignature];
            });
          }
          return view;
        });
      });
    });
  });

  if (cachedViews) {
    cachedViews[viewSignature] = promiseForView;
  }
  return promiseForView;
}

function evalfunc(func, emit, sum, log, isArray, toJSON) {
  return scopedEval(
    "return (" + func.replace(/;\s*$/, "") + ");",
    {
      emit: emit,
      sum: sum,
      log: log,
      isArray: isArray,
      toJSON: toJSON
    }
  );
}

var persistentQueues = {};
var tempViewQueue = new TaskQueue();
var CHANGES_BATCH_SIZE = 50;

var log = pouchdbUtils.guardedConsole.bind(null, 'log');

function parseViewName(name) {
  // can be either 'ddocname/viewname' or just 'viewname'
  // (where the ddoc name is the same)
  return name.indexOf('/') === -1 ? [name, name] : name.split('/');
}

function isGenOne(changes) {
  // only return true if the current change is 1-
  // and there are no other leafs
  return changes.length === 1 && /^1-/.test(changes[0].rev);
}

function emitError(db, e) {
  try {
    db.emit('error', e);
  } catch (err) {
    pouchdbUtils.guardedConsole('error',
      'The user\'s map/reduce function threw an uncaught error.\n' +
      'You can debug this error by doing:\n' +
      'myDatabase.on(\'error\', function (err) { debugger; });\n' +
      'Please double-check your map/reduce function.');
    pouchdbUtils.guardedConsole('error', e);
  }
}

function tryCode(db, fun, args) {
  // emit an event if there was an error thrown by a map/reduce function.
  // putting try/catches in a single function also avoids deoptimizations.
  try {
    return {
      output : fun.apply(null, args)
    };
  } catch (e) {
    emitError(db, e);
    return {error: e};
  }
}

function sortByKeyThenValue(x, y) {
  var keyCompare = pouchdbCollate.collate(x.key, y.key);
  return keyCompare !== 0 ? keyCompare : pouchdbCollate.collate(x.value, y.value);
}

function sliceResults(results, limit, skip) {
  skip = skip || 0;
  if (typeof limit === 'number') {
    return results.slice(skip, limit + skip);
  } else if (skip > 0) {
    return results.slice(skip);
  }
  return results;
}

function rowToDocId(row) {
  var val = row.value;
  // Users can explicitly specify a joined doc _id, or it
  // defaults to the doc _id that emitted the key/value.
  var docId = (val && typeof val === 'object' && val._id) || row.id;
  return docId;
}

function readAttachmentsAsBlobOrBuffer(res) {
  res.rows.forEach(function (row) {
    var atts = row.doc && row.doc._attachments;
    if (!atts) {
      return;
    }
    Object.keys(atts).forEach(function (filename) {
      var att = atts[filename];
      atts[filename].data = pouchdbBinaryUtils.base64StringToBlobOrBuffer(att.data, att.content_type);
    });
  });
}

function postprocessAttachments(opts) {
  return function (res) {
    if (opts.include_docs && opts.attachments && opts.binary) {
      readAttachmentsAsBlobOrBuffer(res);
    }
    return res;
  };
}

function createBuiltInError(name) {
  var message = 'builtin ' + name +
    ' function requires map values to be numbers' +
    ' or number arrays';
  return new BuiltInError(message);
}

function sum(values) {
  var result = 0;
  for (var i = 0, len = values.length; i < len; i++) {
    var num = values[i];
    if (typeof num !== 'number') {
      if (Array.isArray(num)) {
        // lists of numbers are also allowed, sum them separately
        result = typeof result === 'number' ? [result] : result;
        for (var j = 0, jLen = num.length; j < jLen; j++) {
          var jNum = num[j];
          if (typeof jNum !== 'number') {
            throw createBuiltInError('_sum');
          } else if (typeof result[j] === 'undefined') {
            result.push(jNum);
          } else {
            result[j] += jNum;
          }
        }
      } else { // not array/number
        throw createBuiltInError('_sum');
      }
    } else if (typeof result === 'number') {
      result += num;
    } else { // add number to array
      result[0] += num;
    }
  }
  return result;
}

var builtInReduce = {
  _sum: function (keys, values) {
    return sum(values);
  },

  _count: function (keys, values) {
    return values.length;
  },

  _stats: function (keys, values) {
    // no need to implement rereduce=true, because Pouch
    // will never call it
    function sumsqr(values) {
      var _sumsqr = 0;
      for (var i = 0, len = values.length; i < len; i++) {
        var num = values[i];
        _sumsqr += (num * num);
      }
      return _sumsqr;
    }
    return {
      sum     : sum(values),
      min     : Math.min.apply(null, values),
      max     : Math.max.apply(null, values),
      count   : values.length,
      sumsqr : sumsqr(values)
    };
  }
};

function addHttpParam(paramName, opts, params, asJson) {
  // add an http param from opts to params, optionally json-encoded
  var val = opts[paramName];
  if (typeof val !== 'undefined') {
    if (asJson) {
      val = encodeURIComponent(JSON.stringify(val));
    }
    params.push(paramName + '=' + val);
  }
}

function coerceInteger(integerCandidate) {
  if (typeof integerCandidate !== 'undefined') {
    var asNumber = Number(integerCandidate);
    // prevents e.g. '1foo' or '1.1' being coerced to 1
    if (!isNaN(asNumber) && asNumber === parseInt(integerCandidate, 10)) {
      return asNumber;
    } else {
      return integerCandidate;
    }
  }
}

function coerceOptions(opts) {
  opts.group_level = coerceInteger(opts.group_level);
  opts.limit = coerceInteger(opts.limit);
  opts.skip = coerceInteger(opts.skip);
  return opts;
}

function checkPositiveInteger(number) {
  if (number) {
    if (typeof number !== 'number') {
      return  new QueryParseError('Invalid value for integer: "' +
      number + '"');
    }
    if (number < 0) {
      return new QueryParseError('Invalid value for positive integer: ' +
        '"' + number + '"');
    }
  }
}

function checkQueryParseError(options, fun) {
  var startkeyName = options.descending ? 'endkey' : 'startkey';
  var endkeyName = options.descending ? 'startkey' : 'endkey';

  if (typeof options[startkeyName] !== 'undefined' &&
    typeof options[endkeyName] !== 'undefined' &&
    pouchdbCollate.collate(options[startkeyName], options[endkeyName]) > 0) {
    throw new QueryParseError('No rows can match your key range, ' +
    'reverse your start_key and end_key or set {descending : true}');
  } else if (fun.reduce && options.reduce !== false) {
    if (options.include_docs) {
      throw new QueryParseError('{include_docs:true} is invalid for reduce');
    } else if (options.keys && options.keys.length > 1 &&
        !options.group && !options.group_level) {
      throw new QueryParseError('Multi-key fetches for reduce views must use ' +
      '{group: true}');
    }
  }
  ['group_level', 'limit', 'skip'].forEach(function (optionName) {
    var error = checkPositiveInteger(options[optionName]);
    if (error) {
      throw error;
    }
  });
}

function httpQuery(db, fun, opts) {
  // List of parameters to add to the PUT request
  var params = [];
  var body;
  var method = 'GET';

  // If opts.reduce exists and is defined, then add it to the list
  // of parameters.
  // If reduce=false then the results are that of only the map function
  // not the final result of map and reduce.
  addHttpParam('reduce', opts, params);
  addHttpParam('include_docs', opts, params);
  addHttpParam('attachments', opts, params);
  addHttpParam('limit', opts, params);
  addHttpParam('descending', opts, params);
  addHttpParam('group', opts, params);
  addHttpParam('group_level', opts, params);
  addHttpParam('skip', opts, params);
  addHttpParam('stale', opts, params);
  addHttpParam('conflicts', opts, params);
  addHttpParam('startkey', opts, params, true);
  addHttpParam('start_key', opts, params, true);
  addHttpParam('endkey', opts, params, true);
  addHttpParam('end_key', opts, params, true);
  addHttpParam('inclusive_end', opts, params);
  addHttpParam('key', opts, params, true);

  // Format the list of parameters into a valid URI query string
  params = params.join('&');
  params = params === '' ? '' : '?' + params;

  // If keys are supplied, issue a POST to circumvent GET query string limits
  // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
  if (typeof opts.keys !== 'undefined') {
    var MAX_URL_LENGTH = 2000;
    // according to http://stackoverflow.com/a/417184/680742,
    // the de facto URL length limit is 2000 characters

    var keysAsString =
      'keys=' + encodeURIComponent(JSON.stringify(opts.keys));
    if (keysAsString.length + params.length + 1 <= MAX_URL_LENGTH) {
      // If the keys are short enough, do a GET. we do this to work around
      // Safari not understanding 304s on POSTs (see pouchdb/pouchdb#1239)
      params += (params[0] === '?' ? '&' : '?') + keysAsString;
    } else {
      method = 'POST';
      if (typeof fun === 'string') {
        body = {keys: opts.keys};
      } else { // fun is {map : mapfun}, so append to this
        fun.keys = opts.keys;
      }
    }
  }

  // We are referencing a query defined in the design doc
  if (typeof fun === 'string') {
    var parts = parseViewName(fun);
    return db.request({
      method: method,
      url: '_design/' + parts[0] + '/_view/' + parts[1] + params,
      body: body
    }).then(postprocessAttachments(opts));
  }

  // We are using a temporary view, terrible for performance, good for testing
  body = body || {};
  Object.keys(fun).forEach(function (key) {
    if (Array.isArray(fun[key])) {
      body[key] = fun[key];
    } else {
      body[key] = fun[key].toString();
    }
  });
  return db.request({
    method: 'POST',
    url: '_temp_view' + params,
    body: body
  }).then(postprocessAttachments(opts));
}

// custom adapters can define their own api._query
// and override the default behavior
/* istanbul ignore next */
function customQuery(db, fun, opts) {
  return new Promise(function (resolve, reject) {
    db._query(fun, opts, function (err, res) {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

// custom adapters can define their own api._viewCleanup
// and override the default behavior
/* istanbul ignore next */
function customViewCleanup(db) {
  return new Promise(function (resolve, reject) {
    db._viewCleanup(function (err, res) {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

function defaultsTo(value) {
  return function (reason) {
    /* istanbul ignore else */
    if (reason.status === 404) {
      return value;
    } else {
      throw reason;
    }
  };
}

// returns a promise for a list of docs to update, based on the input docId.
// the order doesn't matter, because post-3.2.0, bulkDocs
// is an atomic operation in all three adapters.
function getDocsToPersist(docId, view, docIdsToChangesAndEmits) {
  var metaDocId = '_local/doc_' + docId;
  var defaultMetaDoc = {_id: metaDocId, keys: []};
  var docData = docIdsToChangesAndEmits[docId];
  var indexableKeysToKeyValues = docData.indexableKeysToKeyValues;
  var changes = docData.changes;

  function getMetaDoc() {
    if (isGenOne(changes)) {
      // generation 1, so we can safely assume initial state
      // for performance reasons (avoids unnecessary GETs)
      return Promise.resolve(defaultMetaDoc);
    }
    return view.db.get(metaDocId).catch(defaultsTo(defaultMetaDoc));
  }

  function getKeyValueDocs(metaDoc) {
    if (!metaDoc.keys.length) {
      // no keys, no need for a lookup
      return Promise.resolve({rows: []});
    }
    return view.db.allDocs({
      keys: metaDoc.keys,
      include_docs: true
    });
  }

  function processKvDocs(metaDoc, kvDocsRes) {
    var kvDocs = [];
    var oldKeysMap = {};

    for (var i = 0, len = kvDocsRes.rows.length; i < len; i++) {
      var row = kvDocsRes.rows[i];
      var doc = row.doc;
      if (!doc) { // deleted
        continue;
      }
      kvDocs.push(doc);
      oldKeysMap[doc._id] = true;
      doc._deleted = !indexableKeysToKeyValues[doc._id];
      if (!doc._deleted) {
        var keyValue = indexableKeysToKeyValues[doc._id];
        if ('value' in keyValue) {
          doc.value = keyValue.value;
        }
      }
    }

    var newKeys = Object.keys(indexableKeysToKeyValues);
    newKeys.forEach(function (key) {
      if (!oldKeysMap[key]) {
        // new doc
        var kvDoc = {
          _id: key
        };
        var keyValue = indexableKeysToKeyValues[key];
        if ('value' in keyValue) {
          kvDoc.value = keyValue.value;
        }
        kvDocs.push(kvDoc);
      }
    });
    metaDoc.keys = pouchdbMapreduceUtils.uniq(newKeys.concat(metaDoc.keys));
    kvDocs.push(metaDoc);

    return kvDocs;
  }

  return getMetaDoc().then(function (metaDoc) {
    return getKeyValueDocs(metaDoc).then(function (kvDocsRes) {
      return processKvDocs(metaDoc, kvDocsRes);
    });
  });
}

// updates all emitted key/value docs and metaDocs in the mrview database
// for the given batch of documents from the source database
function saveKeyValues(view, docIdsToChangesAndEmits, seq) {
  var seqDocId = '_local/lastSeq';
  return view.db.get(seqDocId)
  .catch(defaultsTo({_id: seqDocId, seq: 0}))
  .then(function (lastSeqDoc) {
    var docIds = Object.keys(docIdsToChangesAndEmits);
    return Promise.all(docIds.map(function (docId) {
      return getDocsToPersist(docId, view, docIdsToChangesAndEmits);
    })).then(function (listOfDocsToPersist) {
      var docsToPersist = pouchdbUtils.flatten(listOfDocsToPersist);
      lastSeqDoc.seq = seq;
      docsToPersist.push(lastSeqDoc);
      // write all docs in a single operation, update the seq once
      return view.db.bulkDocs({docs : docsToPersist});
    });
  });
}

function getQueue(view) {
  var viewName = typeof view === 'string' ? view : view.name;
  var queue = persistentQueues[viewName];
  if (!queue) {
    queue = persistentQueues[viewName] = new TaskQueue();
  }
  return queue;
}

function updateView(view) {
  return pouchdbMapreduceUtils.sequentialize(getQueue(view), function () {
    return updateViewInQueue(view);
  })();
}

function updateViewInQueue(view) {
  // bind the emit function once
  var mapResults;
  var doc;

  function emit(key, value) {
    var output = {id: doc._id, key: pouchdbCollate.normalizeKey(key)};
    // Don't explicitly store the value unless it's defined and non-null.
    // This saves on storage space, because often people don't use it.
    if (typeof value !== 'undefined' && value !== null) {
      output.value = pouchdbCollate.normalizeKey(value);
    }
    mapResults.push(output);
  }

  var mapFun;
  // for temp_views one can use emit(doc, emit), see #38
  if (typeof view.mapFun === "function" && view.mapFun.length === 2) {
    var origMap = view.mapFun;
    mapFun = function (doc) {
      return origMap(doc, emit);
    };
  } else {
    mapFun = evalfunc(view.mapFun.toString(), emit, sum, log, Array.isArray,
      JSON.parse);
  }

  var currentSeq = view.seq || 0;

  function processChange(docIdsToChangesAndEmits, seq) {
    return function () {
      return saveKeyValues(view, docIdsToChangesAndEmits, seq);
    };
  }

  var queue = new TaskQueue();
  // TODO(neojski): https://github.com/daleharvey/pouchdb/issues/1521

  return new Promise(function (resolve, reject) {

    function complete() {
      queue.finish().then(function () {
        view.seq = currentSeq;
        resolve();
      });
    }

    function processNextBatch() {
      view.sourceDB.changes({
        conflicts: true,
        include_docs: true,
        style: 'all_docs',
        since: currentSeq,
        limit: CHANGES_BATCH_SIZE
      }).on('complete', function (response) {
        var results = response.results;
        if (!results.length) {
          return complete();
        }
        var docIdsToChangesAndEmits = {};
        for (var i = 0, l = results.length; i < l; i++) {
          var change = results[i];
          if (change.doc._id[0] !== '_') {
            mapResults = [];
            doc = change.doc;

            if (!doc._deleted) {
              tryCode(view.sourceDB, mapFun, [doc]);
            }
            mapResults.sort(sortByKeyThenValue);

            var indexableKeysToKeyValues = {};
            var lastKey;
            for (var j = 0, jl = mapResults.length; j < jl; j++) {
              var obj = mapResults[j];
              var complexKey = [obj.key, obj.id];
              if (pouchdbCollate.collate(obj.key, lastKey) === 0) {
                complexKey.push(j); // dup key+id, so make it unique
              }
              var indexableKey = pouchdbCollate.toIndexableString(complexKey);
              indexableKeysToKeyValues[indexableKey] = obj;
              lastKey = obj.key;
            }
            docIdsToChangesAndEmits[change.doc._id] = {
              indexableKeysToKeyValues: indexableKeysToKeyValues,
              changes: change.changes
            };
          }
          currentSeq = change.seq;
        }
        queue.add(processChange(docIdsToChangesAndEmits, currentSeq));
        if (results.length < CHANGES_BATCH_SIZE) {
          return complete();
        }
        return processNextBatch();
      }).on('error', onError);
      /* istanbul ignore next */
      function onError(err) {
        reject(err);
      }
    }

    processNextBatch();
  });
}

function reduceView(view, results, options) {
  if (options.group_level === 0) {
    delete options.group_level;
  }

  var shouldGroup = options.group || options.group_level;

  var reduceFun;
  if (builtInReduce[view.reduceFun]) {
    reduceFun = builtInReduce[view.reduceFun];
  } else {
    reduceFun = evalfunc(
      view.reduceFun.toString(), null, sum, log, Array.isArray, JSON.parse);
  }

  var groups = [];
  var lvl = isNaN(options.group_level) ? Number.POSITIVE_INFINITY :
    options.group_level;
  results.forEach(function (e) {
    var last = groups[groups.length - 1];
    var groupKey = shouldGroup ? e.key : null;

    // only set group_level for array keys
    if (shouldGroup && Array.isArray(groupKey)) {
      groupKey = groupKey.slice(0, lvl);
    }

    if (last && pouchdbCollate.collate(last.groupKey, groupKey) === 0) {
      last.keys.push([e.key, e.id]);
      last.values.push(e.value);
      return;
    }
    groups.push({
      keys: [[e.key, e.id]],
      values: [e.value],
      groupKey: groupKey
    });
  });
  results = [];
  for (var i = 0, len = groups.length; i < len; i++) {
    var e = groups[i];
    var reduceTry = tryCode(view.sourceDB, reduceFun,
      [e.keys, e.values, false]);
    if (reduceTry.error && reduceTry.error instanceof BuiltInError) {
      // CouchDB returns an error if a built-in errors out
      throw reduceTry.error;
    }
    results.push({
      // CouchDB just sets the value to null if a non-built-in errors out
      value: reduceTry.error ? null : reduceTry.output,
      key: e.groupKey
    });
  }
  // no total_rows/offset when reducing
  return {rows: sliceResults(results, options.limit, options.skip)};
}

function queryView(view, opts) {
  return pouchdbMapreduceUtils.sequentialize(getQueue(view), function () {
    return queryViewInQueue(view, opts);
  })();
}

function queryViewInQueue(view, opts) {
  var totalRows;
  var shouldReduce = view.reduceFun && opts.reduce !== false;
  var skip = opts.skip || 0;
  if (typeof opts.keys !== 'undefined' && !opts.keys.length) {
    // equivalent query
    opts.limit = 0;
    delete opts.keys;
  }

  function fetchFromView(viewOpts) {
    viewOpts.include_docs = true;
    return view.db.allDocs(viewOpts).then(function (res) {
      totalRows = res.total_rows;
      return res.rows.map(function (result) {

        // implicit migration - in older versions of PouchDB,
        // we explicitly stored the doc as {id: ..., key: ..., value: ...}
        // this is tested in a migration test
        /* istanbul ignore next */
        if ('value' in result.doc && typeof result.doc.value === 'object' &&
            result.doc.value !== null) {
          var keys = Object.keys(result.doc.value).sort();
          // this detection method is not perfect, but it's unlikely the user
          // emitted a value which was an object with these 3 exact keys
          var expectedKeys = ['id', 'key', 'value'];
          if (!(keys < expectedKeys || keys > expectedKeys)) {
            return result.doc.value;
          }
        }

        var parsedKeyAndDocId = pouchdbCollate.parseIndexableString(result.doc._id);
        return {
          key: parsedKeyAndDocId[0],
          id: parsedKeyAndDocId[1],
          value: ('value' in result.doc ? result.doc.value : null)
        };
      });
    });
  }

  function onMapResultsReady(rows) {
    var finalResults;
    if (shouldReduce) {
      finalResults = reduceView(view, rows, opts);
    } else {
      finalResults = {
        total_rows: totalRows,
        offset: skip,
        rows: rows
      };
    }
    if (opts.include_docs) {
      var docIds = pouchdbMapreduceUtils.uniq(rows.map(rowToDocId));

      return view.sourceDB.allDocs({
        keys: docIds,
        include_docs: true,
        conflicts: opts.conflicts,
        attachments: opts.attachments,
        binary: opts.binary
      }).then(function (allDocsRes) {
        var docIdsToDocs = {};
        allDocsRes.rows.forEach(function (row) {
          if (row.doc) {
            docIdsToDocs['$' + row.id] = row.doc;
          }
        });
        rows.forEach(function (row) {
          var docId = rowToDocId(row);
          var doc = docIdsToDocs['$' + docId];
          if (doc) {
            row.doc = doc;
          }
        });
        return finalResults;
      });
    } else {
      return finalResults;
    }
  }

  if (typeof opts.keys !== 'undefined') {
    var keys = opts.keys;
    var fetchPromises = keys.map(function (key) {
      var viewOpts = {
        startkey : pouchdbCollate.toIndexableString([key]),
        endkey   : pouchdbCollate.toIndexableString([key, {}])
      };
      return fetchFromView(viewOpts);
    });
    return Promise.all(fetchPromises).then(pouchdbUtils.flatten).then(onMapResultsReady);
  } else { // normal query, no 'keys'
    var viewOpts = {
      descending : opts.descending
    };
    if (opts.start_key) {
        opts.startkey = opts.start_key;
    }
    if (opts.end_key) {
        opts.endkey = opts.end_key;
    }
    if (typeof opts.startkey !== 'undefined') {
      viewOpts.startkey = opts.descending ?
        pouchdbCollate.toIndexableString([opts.startkey, {}]) :
        pouchdbCollate.toIndexableString([opts.startkey]);
    }
    if (typeof opts.endkey !== 'undefined') {
      var inclusiveEnd = opts.inclusive_end !== false;
      if (opts.descending) {
        inclusiveEnd = !inclusiveEnd;
      }

      viewOpts.endkey = pouchdbCollate.toIndexableString(
        inclusiveEnd ? [opts.endkey, {}] : [opts.endkey]);
    }
    if (typeof opts.key !== 'undefined') {
      var keyStart = pouchdbCollate.toIndexableString([opts.key]);
      var keyEnd = pouchdbCollate.toIndexableString([opts.key, {}]);
      if (viewOpts.descending) {
        viewOpts.endkey = keyStart;
        viewOpts.startkey = keyEnd;
      } else {
        viewOpts.startkey = keyStart;
        viewOpts.endkey = keyEnd;
      }
    }
    if (!shouldReduce) {
      if (typeof opts.limit === 'number') {
        viewOpts.limit = opts.limit;
      }
      viewOpts.skip = skip;
    }
    return fetchFromView(viewOpts).then(onMapResultsReady);
  }
}

function httpViewCleanup(db) {
  return db.request({
    method: 'POST',
    url: '_view_cleanup'
  });
}

function localViewCleanup(db) {
  return db.get('_local/mrviews').then(function (metaDoc) {
    var docsToViews = {};
    Object.keys(metaDoc.views).forEach(function (fullViewName) {
      var parts = parseViewName(fullViewName);
      var designDocName = '_design/' + parts[0];
      var viewName = parts[1];
      docsToViews[designDocName] = docsToViews[designDocName] || {};
      docsToViews[designDocName][viewName] = true;
    });
    var opts = {
      keys : Object.keys(docsToViews),
      include_docs : true
    };
    return db.allDocs(opts).then(function (res) {
      var viewsToStatus = {};
      res.rows.forEach(function (row) {
        var ddocName = row.key.substring(8);
        Object.keys(docsToViews[row.key]).forEach(function (viewName) {
          var fullViewName = ddocName + '/' + viewName;
          /* istanbul ignore if */
          if (!metaDoc.views[fullViewName]) {
            // new format, without slashes, to support PouchDB 2.2.0
            // migration test in pouchdb's browser.migration.js verifies this
            fullViewName = viewName;
          }
          var viewDBNames = Object.keys(metaDoc.views[fullViewName]);
          // design doc deleted, or view function nonexistent
          var statusIsGood = row.doc && row.doc.views &&
            row.doc.views[viewName];
          viewDBNames.forEach(function (viewDBName) {
            viewsToStatus[viewDBName] =
              viewsToStatus[viewDBName] || statusIsGood;
          });
        });
      });
      var dbsToDelete = Object.keys(viewsToStatus).filter(
        function (viewDBName) { return !viewsToStatus[viewDBName]; });
      var destroyPromises = dbsToDelete.map(function (viewDBName) {
        return pouchdbMapreduceUtils.sequentialize(getQueue(viewDBName), function () {
          return new db.constructor(viewDBName, db.__opts).destroy();
        })();
      });
      return Promise.all(destroyPromises).then(function () {
        return {ok: true};
      });
    });
  }, defaultsTo({ok: true}));
}

var viewCleanup = pouchdbMapreduceUtils.callbackify(function () {
  var db = this;
  if (db.type() === 'http') {
    return httpViewCleanup(db);
  }
  /* istanbul ignore next */
  if (typeof db._viewCleanup === 'function') {
    return customViewCleanup(db);
  }
  return localViewCleanup(db);
});

function queryPromised(db, fun, opts) {
  if (db.type() === 'http') {
    return httpQuery(db, fun, opts);
  }

  /* istanbul ignore next */
  if (typeof db._query === 'function') {
    return customQuery(db, fun, opts);
  }

  if (typeof fun !== 'string') {
    // temp_view
    checkQueryParseError(opts, fun);

    var createViewOpts = {
      db : db,
      viewName : 'temp_view/temp_view',
      map : fun.map,
      reduce : fun.reduce,
      temporary : true
    };
    tempViewQueue.add(function () {
      return createView(createViewOpts).then(function (view) {
        function cleanup() {
          return view.db.destroy();
        }
        return pouchdbMapreduceUtils.fin(updateView(view).then(function () {
          return queryView(view, opts);
        }), cleanup);
      });
    });
    return tempViewQueue.finish();
  } else {
    // persistent view
    var fullViewName = fun;
    var parts = parseViewName(fullViewName);
    var designDocName = parts[0];
    var viewName = parts[1];
    return db.get('_design/' + designDocName).then(function (doc) {
      var fun = doc.views && doc.views[viewName];

      if (!fun || typeof fun.map !== 'string') {
        throw new NotFoundError('ddoc ' + designDocName +
        ' has no view named ' + viewName);
      }
      checkQueryParseError(opts, fun);

      var createViewOpts = {
        db : db,
        viewName : fullViewName,
        map : fun.map,
        reduce : fun.reduce
      };
      return createView(createViewOpts).then(function (view) {
        if (opts.stale === 'ok' || opts.stale === 'update_after') {
          if (opts.stale === 'update_after') {
            process.nextTick(function () {
              updateView(view);
            });
          }
          return queryView(view, opts);
        } else { // stale not ok
          return updateView(view).then(function () {
            return queryView(view, opts);
          });
        }
      });
    });
  }
}

var query = function (fun, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts = opts ? coerceOptions(opts) : {};

  if (typeof fun === 'function') {
    fun = {map : fun};
  }

  var db = this;
  var promise = Promise.resolve().then(function () {
    return queryPromised(db, fun, opts);
  });
  pouchdbMapreduceUtils.promisedCallback(promise, callback);
  return promise;
};

function QueryParseError(message) {
  this.status = 400;
  this.name = 'query_parse_error';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, QueryParseError);
  } catch (e) {}
}

inherits(QueryParseError, Error);

function NotFoundError(message) {
  this.status = 404;
  this.name = 'not_found';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, NotFoundError);
  } catch (e) {}
}

inherits(NotFoundError, Error);

function BuiltInError(message) {
  this.status = 500;
  this.name = 'invalid_value';
  this.message = message;
  this.error = true;
  try {
    Error.captureStackTrace(this, BuiltInError);
  } catch (e) {}
}

inherits(BuiltInError, Error);

var index = {
  query: query,
  viewCleanup: viewCleanup
};

module.exports = index;
}).call(this,require('_process'))
},{"_process":5,"inherits":22,"pouchdb-binary-utils":34,"pouchdb-collate":37,"pouchdb-mapreduce-utils":44,"pouchdb-md5":46,"pouchdb-promise":48,"pouchdb-utils":50,"scope-eval":69}],46:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var pouchdbBinaryUtils = require('pouchdb-binary-utils');
var Md5 = _interopDefault(require('spark-md5'));

var setImmediateShim = global.setImmediate || global.setTimeout;
var MD5_CHUNK_SIZE = 32768;

function rawToBase64(raw) {
  return pouchdbBinaryUtils.btoa(raw);
}

function sliceBlob(blob, start, end) {
  if (blob.webkitSlice) {
    return blob.webkitSlice(start, end);
  }
  return blob.slice(start, end);
}

function appendBlob(buffer, blob, start, end, callback) {
  if (start > 0 || end < blob.size) {
    // only slice blob if we really need to
    blob = sliceBlob(blob, start, end);
  }
  pouchdbBinaryUtils.readAsArrayBuffer(blob, function (arrayBuffer) {
    buffer.append(arrayBuffer);
    callback();
  });
}

function appendString(buffer, string, start, end, callback) {
  if (start > 0 || end < string.length) {
    // only create a substring if we really need to
    string = string.substring(start, end);
  }
  buffer.appendBinary(string);
  callback();
}

function binaryMd5(data, callback) {
  var inputIsString = typeof data === 'string';
  var len = inputIsString ? data.length : data.size;
  var chunkSize = Math.min(MD5_CHUNK_SIZE, len);
  var chunks = Math.ceil(len / chunkSize);
  var currentChunk = 0;
  var buffer = inputIsString ? new Md5() : new Md5.ArrayBuffer();

  var append = inputIsString ? appendString : appendBlob;

  function next() {
    setImmediateShim(loadNextChunk);
  }

  function done() {
    var raw = buffer.end(true);
    var base64 = rawToBase64(raw);
    callback(base64);
    buffer.destroy();
  }

  function loadNextChunk() {
    var start = currentChunk * chunkSize;
    var end = start + chunkSize;
    currentChunk++;
    if (currentChunk < chunks) {
      append(buffer, data, start, end, next);
    } else {
      append(buffer, data, start, end, done);
    }
  }
  loadNextChunk();
}

function stringMd5(string) {
  return Md5.hash(string);
}

exports.binaryMd5 = binaryMd5;
exports.stringMd5 = stringMd5;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"pouchdb-binary-utils":34,"spark-md5":70}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
function winningRev(metadata) {
  var winningId;
  var winningPos;
  var winningDeleted;
  var toVisit = metadata.rev_tree.slice();
  var node;
  while ((node = toVisit.pop())) {
    var tree = node.ids;
    var branches = tree[2];
    var pos = node.pos;
    if (branches.length) { // non-leaf
      for (var i = 0, len = branches.length; i < len; i++) {
        toVisit.push({pos: pos + 1, ids: branches[i]});
      }
      continue;
    }
    var deleted = !!tree[1].deleted;
    var id = tree[0];
    // sort by deleted, then pos, then id
    if (!winningId || (winningDeleted !== deleted ? winningDeleted :
        winningPos !== pos ? winningPos < pos : winningId < id)) {
      winningId = id;
      winningPos = pos;
      winningDeleted = deleted;
    }
  }

  return winningPos + '-' + winningId;
}

// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
function traverseRevTree(revs, callback) {
  var toVisit = revs.slice();

  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var branches = tree[2];
    var newCtx =
      callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], ctx: newCtx});
    }
  }
}

function sortByPos(a, b) {
  return a.pos - b.pos;
}

function collectLeaves(revs) {
  var leaves = [];
  traverseRevTree(revs, function (isLeaf, pos, id, acc, opts) {
    if (isLeaf) {
      leaves.push({rev: pos + "-" + id, pos: pos, opts: opts});
    }
  });
  leaves.sort(sortByPos).reverse();
  for (var i = 0, len = leaves.length; i < len; i++) {
    delete leaves[i].pos;
  }
  return leaves;
}

// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
function collectConflicts(metadata) {
  var win = winningRev(metadata);
  var leaves = collectLeaves(metadata.rev_tree);
  var conflicts = [];
  for (var i = 0, len = leaves.length; i < len; i++) {
    var leaf = leaves[i];
    if (leaf.rev !== win && !leaf.opts.deleted) {
      conflicts.push(leaf.rev);
    }
  }
  return conflicts;
}

// compact a tree by marking its non-leafs as missing,
// and return a list of revs to delete
function compactTree(metadata) {
  var revs = [];
  traverseRevTree(metadata.rev_tree, function (isLeaf, pos,
                                               revHash, ctx, opts) {
    if (opts.status === 'available' && !isLeaf) {
      revs.push(pos + '-' + revHash);
      opts.status = 'missing';
    }
  });
  return revs;
}

// build up a list of all the paths to the leafs in this revision tree
function rootToLeaf(revs) {
  var paths = [];
  var toVisit = revs.slice();
  var node;
  while ((node = toVisit.pop())) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;

    var history = node.history ? node.history.slice() : [];
    history.push({id: id, opts: opts});
    if (isLeaf) {
      paths.push({pos: (pos + 1 - history.length), ids: history});
    }
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: pos + 1, ids: branches[i], history: history});
    }
  }
  return paths.reverse();
}

function sortByPos$1(a, b) {
  return a.pos - b.pos;
}

// classic binary search
function binarySearch(arr, item, comparator) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (comparator(arr[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

// assuming the arr is sorted, insert the item in the proper place
function insertSorted(arr, item, comparator) {
  var idx = binarySearch(arr, item, comparator);
  arr.splice(idx, 0, item);
}

// Turn a path as a flat array into a tree with a single branch.
// If any should be stemmed from the beginning of the array, that's passed
// in as the second argument
function pathToTree(path, numStemmed) {
  var root;
  var leaf;
  for (var i = numStemmed, len = path.length; i < len; i++) {
    var node = path[i];
    var currentLeaf = [node.id, node.opts, []];
    if (leaf) {
      leaf[2].push(currentLeaf);
      leaf = currentLeaf;
    } else {
      root = leaf = currentLeaf;
    }
  }
  return root;
}

// compare the IDs of two trees
function compareTree(a, b) {
  return a[0] < b[0] ? -1 : 1;
}

// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function mergeTree(in_tree1, in_tree2) {
  var queue = [{tree1: in_tree1, tree2: in_tree2}];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;

    if (tree1[1].status || tree2[1].status) {
      tree1[1].status =
        (tree1[1].status ===  'available' ||
        tree2[1].status === 'available') ? 'available' : 'missing';
    }

    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = 'new_leaf';
        tree1[2][0] = tree2[2][i];
        continue;
      }

      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({tree1: tree1[2][j], tree2: tree2[2][i]});
          merged = true;
        }
      }
      if (!merged) {
        conflicts = 'new_branch';
        insertSorted(tree1[2], tree2[2][i], compareTree);
      }
    }
  }
  return {conflicts: conflicts, tree: in_tree1};
}

function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res;

  if (!tree.length) {
    return {tree: [path], conflicts: 'new_leaf'};
  }

  for (var i = 0, len = tree.length; i < len; i++) {
    var branch = tree[i];
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      // Paths start at the same position and have the same root, so they need
      // merged
      res = mergeTree(branch.ids, path.ids);
      restree.push({pos: branch.pos, ids: res.tree});
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      // The paths start at a different position, take the earliest path and
      // traverse up until it as at the same point from root as the path we
      // want to merge.  If the keys match we return the longer path with the
      // other merged After stemming we dont want to expand the trees

      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;

      var candidateParents = [];

      var trees = [];
      trees.push({ids: t1.ids, diff: diff, parent: null, parentIdx: null});
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        var elements = item.ids[2];
        for (var j = 0, elementsLen = elements.length; j < elementsLen; j++) {
          trees.push({
            ids: elements[j],
            diff: item.diff - 1,
            parent: item.ids,
            parentIdx: j
          });
        }
      }

      var el = candidateParents[0];

      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({pos: t1.pos, ids: t1.ids});
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  }

  // We didnt find
  if (!merged) {
    restree.push(path);
  }

  restree.sort(sortByPos$1);

  return {
    tree: restree,
    conflicts: conflicts || 'internal_node'
  };
}

// To ensure we dont grow the revision tree infinitely, we stem old revisions
function stem(tree, depth) {
  // First we break out the tree into a complete list of root to leaf paths
  var paths = rootToLeaf(tree);
  var maybeStem = {};

  var result;
  for (var i = 0, len = paths.length; i < len; i++) {
    // Then for each path, we cut off the start of the path based on the
    // `depth` to stem to, and generate a new set of flat trees
    var path = paths[i];
    var stemmed = path.ids;
    var numStemmed = Math.max(0, stemmed.length - depth);
    var stemmedNode = {
      pos: path.pos + numStemmed,
      ids: pathToTree(stemmed, numStemmed)
    };

    for (var s = 0; s < numStemmed; s++) {
      var rev = (path.pos + s) + '-' + stemmed[s].id;
      maybeStem[rev] = true;
    }

    // Then we remerge all those flat trees together, ensuring that we dont
    // connect trees that would go beyond the depth limit
    if (result) {
      result = doMerge(result, stemmedNode, true).tree;
    } else {
      result = [stemmedNode];
    }
  }

  traverseRevTree(result, function (isLeaf, pos, revHash) {
    // some revisions may have been removed in a branch but not in another
    delete maybeStem[pos + '-' + revHash];
  });

  return {
    tree: result,
    revs: Object.keys(maybeStem)
  };
}

function merge(tree, path, depth) {
  var newTree = doMerge(tree, path);
  var stemmed = stem(newTree.tree, depth);
  return {
    tree: stemmed.tree,
    stemmedRevs: stemmed.revs,
    conflicts: newTree.conflicts
  };
}

// return true if a rev exists in the rev tree, false otherwise
function revExists(revs, rev) {
  var toVisit = revs.slice();
  var splitRev = rev.split('-');
  var targetPos = parseInt(splitRev[0], 10);
  var targetId = splitRev[1];

  var node;
  while ((node = toVisit.pop())) {
    if (node.pos === targetPos && node.ids[0] === targetId) {
      return true;
    }
    var branches = node.ids[2];
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({pos: node.pos + 1, ids: branches[i]});
    }
  }
  return false;
}

function getTrees(node) {
  return node.ids;
}

// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
function isDeleted(metadata, rev) {
  if (!rev) {
    rev = winningRev(metadata);
  }
  var id = rev.substring(rev.indexOf('-') + 1);
  var toVisit = metadata.rev_tree.map(getTrees);

  var tree;
  while ((tree = toVisit.pop())) {
    if (tree[0] === id) {
      return !!tree[1].deleted;
    }
    toVisit = toVisit.concat(tree[2]);
  }
}

function isLocalId(id) {
  return (/^_local/).test(id);
}

exports.collectConflicts = collectConflicts;
exports.collectLeaves = collectLeaves;
exports.compactTree = compactTree;
exports.isDeleted = isDeleted;
exports.isLocalId = isLocalId;
exports.merge = merge;
exports.revExists = revExists;
exports.rootToLeaf = rootToLeaf;
exports.traverseRevTree = traverseRevTree;
exports.winningRev = winningRev;
},{}],48:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lie = _interopDefault(require('lie'));

/* istanbul ignore next */
var PouchPromise = typeof Promise === 'function' ? Promise : lie;

module.exports = PouchPromise;
},{"lie":25}],49:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var pouchdbUtils = require('pouchdb-utils');
var Promise = _interopDefault(require('pouchdb-promise'));
var Checkpointer = _interopDefault(require('pouchdb-checkpointer'));
var generateReplicationId = _interopDefault(require('pouchdb-generate-replication-id'));
var events = require('events');
var inherits = _interopDefault(require('inherits'));
var pouchdbErrors = require('pouchdb-errors');
var jsExtend = require('js-extend');

function isGenOne(rev) {
  return /^1-/.test(rev);
}

function fileHasChanged(localDoc, remoteDoc, filename) {
  return !localDoc._attachments ||
         !localDoc._attachments[filename] ||
         localDoc._attachments[filename].digest !== remoteDoc._attachments[filename].digest;
}

function getDocAttachments(db, doc) {
  var filenames = Object.keys(doc._attachments);
  return Promise.all(filenames.map(function (filename) {
    return db.getAttachment(doc._id, filename, {rev: doc._rev});
  }));
}

function getDocAttachmentsFromTargetOrSource(target, src, doc) {
  var doCheckForLocalAttachments = src.type() === 'http' && target.type() !== 'http';
  var filenames = Object.keys(doc._attachments);

  if (!doCheckForLocalAttachments) {
    return getDocAttachments(src, doc);
  }

  return target.get(doc._id).then(function (localDoc) {
    return Promise.all(filenames.map(function (filename) {
      if (fileHasChanged(localDoc, doc, filename)) {
        return src.getAttachment(doc._id, filename);
      }

      return target.getAttachment(localDoc._id, filename);
    }));
  }).catch(function (error) {
    /* istanbul ignore if */
    if (error.status !== 404) {
      throw error;
    }

    return getDocAttachments(src, doc);
  });
}

function createBulkGetOpts(diffs) {
  var requests = [];
  Object.keys(diffs).forEach(function (id) {
    var missingRevs = diffs[id].missing;
    missingRevs.forEach(function (missingRev) {
      requests.push({
        id: id,
        rev: missingRev
      });
    });
  });

  return {
    docs: requests,
    revs: true
  };
}

//
// Fetch all the documents from the src as described in the "diffs",
// which is a mapping of docs IDs to revisions. If the state ever
// changes to "cancelled", then the returned promise will be rejected.
// Else it will be resolved with a list of fetched documents.
//
function getDocs(src, target, diffs, state) {
  diffs = pouchdbUtils.clone(diffs); // we do not need to modify this

  var resultDocs = [],
      ok = true;

  function getAllDocs() {

    var bulkGetOpts = createBulkGetOpts(diffs);

    if (!bulkGetOpts.docs.length) { // optimization: skip empty requests
      return;
    }

    return src.bulkGet(bulkGetOpts).then(function (bulkGetResponse) {
      /* istanbul ignore if */
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      return Promise.all(bulkGetResponse.results.map(function (bulkGetInfo) {
        return Promise.all(bulkGetInfo.docs.map(function (doc) {
          var remoteDoc = doc.ok;

          if (doc.error) {
            // when AUTO_COMPACTION is set, docs can be returned which look
            // like this: {"missing":"1-7c3ac256b693c462af8442f992b83696"}
            ok = false;
          }

          if (!remoteDoc || !remoteDoc._attachments) {
            return remoteDoc;
          }

          return getDocAttachmentsFromTargetOrSource(target, src, remoteDoc).then(function (attachments) {
            var filenames = Object.keys(remoteDoc._attachments);
            attachments.forEach(function (attachment, i) {
              var att = remoteDoc._attachments[filenames[i]];
              delete att.stub;
              delete att.length;
              att.data = attachment;
            });

            return remoteDoc;
          });
        }));
      }))

      .then(function (results) {
        resultDocs = resultDocs.concat(pouchdbUtils.flatten(results).filter(Boolean));
      });
    });
  }

  function hasAttachments(doc) {
    return doc._attachments && Object.keys(doc._attachments).length > 0;
  }

  function fetchRevisionOneDocs(ids) {
    // Optimization: fetch gen-1 docs and attachments in
    // a single request using _all_docs
    return src.allDocs({
      keys: ids,
      include_docs: true
    }).then(function (res) {
      if (state.cancelled) {
        throw new Error('cancelled');
      }
      res.rows.forEach(function (row) {
        if (row.deleted || !row.doc || !isGenOne(row.value.rev) ||
            hasAttachments(row.doc)) {
          // if any of these conditions apply, we need to fetch using get()
          return;
        }

        // the doc we got back from allDocs() is sufficient
        resultDocs.push(row.doc);
        delete diffs[row.id];
      });
    });
  }

  function getRevisionOneDocs() {
    // filter out the generation 1 docs and get them
    // leaving the non-generation one docs to be got otherwise
    var ids = Object.keys(diffs).filter(function (id) {
      var missing = diffs[id].missing;
      return missing.length === 1 && isGenOne(missing[0]);
    });
    if (ids.length > 0) {
      return fetchRevisionOneDocs(ids);
    }
  }

  function returnResult() {
    return { ok:ok, docs:resultDocs };
  }

  return Promise.resolve()
    .then(getRevisionOneDocs)
    .then(getAllDocs)
    .then(returnResult);
}

var STARTING_BACK_OFF = 0;

function backOff(opts, returnValue, error, callback) {
  if (opts.retry === false) {
    returnValue.emit('error', error);
    returnValue.removeAllListeners();
    return;
  }
  if (typeof opts.back_off_function !== 'function') {
    opts.back_off_function = pouchdbUtils.defaultBackOff;
  }
  returnValue.emit('requestError', error);
  if (returnValue.state === 'active' || returnValue.state === 'pending') {
    returnValue.emit('paused', error);
    returnValue.state = 'stopped';
    var backOffSet = function backoffTimeSet() {
      opts.current_back_off = STARTING_BACK_OFF;
    };
    var removeBackOffSetter = function removeBackOffTimeSet() {
      returnValue.removeListener('active', backOffSet);
    };
    returnValue.once('paused', removeBackOffSetter);
    returnValue.once('active', backOffSet);
  }

  opts.current_back_off = opts.current_back_off || STARTING_BACK_OFF;
  opts.current_back_off = opts.back_off_function(opts.current_back_off);
  setTimeout(callback, opts.current_back_off);
}

function replicate$1(src, target, opts, returnValue, result) {
  var batches = [];               // list of batches to be processed
  var currentBatch;               // the batch currently being processed
  var pendingBatch = {
    seq: 0,
    changes: [],
    docs: []
  }; // next batch, not yet ready to be processed
  var writingCheckpoint = false;  // true while checkpoint is being written
  var changesCompleted = false;   // true when all changes received
  var replicationCompleted = false; // true when replication has completed
  var last_seq = 0;
  var continuous = opts.continuous || opts.live || false;
  var batch_size = opts.batch_size || 100;
  var batches_limit = opts.batches_limit || 10;
  var changesPending = false;     // true while src.changes is running
  var doc_ids = opts.doc_ids;
  var repId;
  var checkpointer;
  var allErrors = [];
  var changedDocs = [];
  // Like couchdb, every replication gets a unique session id
  var session = pouchdbUtils.uuid();

  result = result || {
    ok: true,
    start_time: new Date(),
    docs_read: 0,
    docs_written: 0,
    doc_write_failures: 0,
    errors: []
  };

  var changesOpts = {};
  returnValue.ready(src, target);

  function initCheckpointer() {
    if (checkpointer) {
      return Promise.resolve();
    }
    return generateReplicationId(src, target, opts).then(function (res) {
      repId = res;
      checkpointer = new Checkpointer(src, target, repId, returnValue);
    });
  }

  function writeDocs() {
    changedDocs = [];

    if (currentBatch.docs.length === 0) {
      return;
    }
    var docs = currentBatch.docs;
    return target.bulkDocs({docs: docs, new_edits: false}).then(function (res) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      var errors = [];
      var errorsById = {};
      res.forEach(function (res) {
        if (res.error) {
          result.doc_write_failures++;
          errors.push(res);
          errorsById[res.id] = res;
        }
      });
      allErrors = allErrors.concat(errors);
      result.docs_written += currentBatch.docs.length - errors.length;
      var non403s = errors.filter(function (error) {
        return error.name !== 'unauthorized' && error.name !== 'forbidden';
      });

      docs.forEach(function (doc) {
        var error = errorsById[doc._id];
        if (error) {
          returnValue.emit('denied', pouchdbUtils.clone(error));
        } else {
          changedDocs.push(doc);
        }
      });

      if (non403s.length > 0) {
        var error = new Error('bulkDocs error');
        error.other_errors = errors;
        abortReplication('target.bulkDocs failed to write docs', error);
        throw new Error('bulkWrite partial failure');
      }
    }, function (err) {
      result.doc_write_failures += docs.length;
      throw err;
    });
  }

  function finishBatch() {
    if (currentBatch.error) {
      throw new Error('There was a problem getting docs.');
    }
    result.last_seq = last_seq = currentBatch.seq;
    var outResult = pouchdbUtils.clone(result);
    if (changedDocs.length) {
      outResult.docs = changedDocs;
      returnValue.emit('change', outResult);
    }
    writingCheckpoint = true;
    return checkpointer.writeCheckpoint(currentBatch.seq,
        session).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      currentBatch = undefined;
      getChanges();
    }).catch(onCheckpointError);
  }

  function getDiffs() {
    var diff = {};
    currentBatch.changes.forEach(function (change) {
      // Couchbase Sync Gateway emits these, but we can ignore them
      /* istanbul ignore if */
      if (change.id === "_user/") {
        return;
      }
      diff[change.id] = change.changes.map(function (x) {
        return x.rev;
      });
    });
    return target.revsDiff(diff).then(function (diffs) {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        throw new Error('cancelled');
      }
      // currentBatch.diffs elements are deleted as the documents are written
      currentBatch.diffs = diffs;
    });
  }

  function getBatchDocs() {
    return getDocs(src, target, currentBatch.diffs, returnValue).then(function (got) {
      currentBatch.error = !got.ok;
      got.docs.forEach(function (doc) {
        delete currentBatch.diffs[doc._id];
        result.docs_read++;
        currentBatch.docs.push(doc);
      });
    });
  }

  function startNextBatch() {
    if (returnValue.cancelled || currentBatch) {
      return;
    }
    if (batches.length === 0) {
      processPendingBatch(true);
      return;
    }
    currentBatch = batches.shift();
    getDiffs()
      .then(getBatchDocs)
      .then(writeDocs)
      .then(finishBatch)
      .then(startNextBatch)
      .catch(function (err) {
        abortReplication('batch processing terminated with error', err);
      });
  }


  function processPendingBatch(immediate) {
    if (pendingBatch.changes.length === 0) {
      if (batches.length === 0 && !currentBatch) {
        if ((continuous && changesOpts.live) || changesCompleted) {
          returnValue.state = 'pending';
          returnValue.emit('paused');
        }
        if (changesCompleted) {
          completeReplication();
        }
      }
      return;
    }
    if (
      immediate ||
      changesCompleted ||
      pendingBatch.changes.length >= batch_size
    ) {
      batches.push(pendingBatch);
      pendingBatch = {
        seq: 0,
        changes: [],
        docs: []
      };
      if (returnValue.state === 'pending' || returnValue.state === 'stopped') {
        returnValue.state = 'active';
        returnValue.emit('active');
      }
      startNextBatch();
    }
  }


  function abortReplication(reason, err) {
    if (replicationCompleted) {
      return;
    }
    if (!err.message) {
      err.message = reason;
    }
    result.ok = false;
    result.status = 'aborting';
    result.errors.push(err);
    allErrors = allErrors.concat(err);
    batches = [];
    pendingBatch = {
      seq: 0,
      changes: [],
      docs: []
    };
    completeReplication();
  }


  function completeReplication() {
    if (replicationCompleted) {
      return;
    }
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      result.status = 'cancelled';
      if (writingCheckpoint) {
        return;
      }
    }
    result.status = result.status || 'complete';
    result.end_time = new Date();
    result.last_seq = last_seq;
    replicationCompleted = true;
    var non403s = allErrors.filter(function (error) {
      return error.name !== 'unauthorized' && error.name !== 'forbidden';
    });
    if (non403s.length > 0) {
      var error = allErrors.pop();
      if (allErrors.length > 0) {
        error.other_errors = allErrors;
      }
      error.result = result;
      backOff(opts, returnValue, error, function () {
        replicate$1(src, target, opts, returnValue);
      });
    } else {
      result.errors = allErrors;
      returnValue.emit('complete', result);
      returnValue.removeAllListeners();
    }
  }


  function onChange(change) {
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    var filter = pouchdbUtils.filterChange(opts)(change);
    if (!filter) {
      return;
    }
    pendingBatch.seq = change.seq;
    pendingBatch.changes.push(change);
    processPendingBatch(batches.length === 0 && changesOpts.live);
  }


  function onChangesComplete(changes) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }

    // if no results were returned then we're done,
    // else fetch more
    if (changes.results.length > 0) {
      changesOpts.since = changes.last_seq;
      getChanges();
      processPendingBatch(true);
    } else {

      var complete = function () {
        if (continuous) {
          changesOpts.live = true;
          getChanges();
        } else {
          changesCompleted = true;
        }
        processPendingBatch(true);
      };

      // update the checkpoint so we start from the right seq next time
      if (!currentBatch && changes.results.length === 0) {
        writingCheckpoint = true;
        checkpointer.writeCheckpoint(changes.last_seq,
            session).then(function () {
          writingCheckpoint = false;
          result.last_seq = last_seq = changes.last_seq;
          complete();
        })
        .catch(onCheckpointError);
      } else {
        complete();
      }
    }
  }


  function onChangesError(err) {
    changesPending = false;
    /* istanbul ignore if */
    if (returnValue.cancelled) {
      return completeReplication();
    }
    abortReplication('changes rejected', err);
  }


  function getChanges() {
    if (!(
      !changesPending &&
      !changesCompleted &&
      batches.length < batches_limit
      )) {
      return;
    }
    changesPending = true;
    function abortChanges() {
      changes.cancel();
    }
    function removeListener() {
      returnValue.removeListener('cancel', abortChanges);
    }

    if (returnValue._changes) { // remove old changes() and listeners
      returnValue.removeListener('cancel', returnValue._abortChanges);
      returnValue._changes.cancel();
    }
    returnValue.once('cancel', abortChanges);

    var changes = src.changes(changesOpts)
      .on('change', onChange);
    changes.then(removeListener, removeListener);
    changes.then(onChangesComplete)
      .catch(onChangesError);

    if (opts.retry) {
      // save for later so we can cancel if necessary
      returnValue._changes = changes;
      returnValue._abortChanges = abortChanges;
    }
  }


  function startChanges() {
    initCheckpointer().then(function () {
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      return checkpointer.getCheckpoint().then(function (checkpoint) {
        last_seq = checkpoint;
        changesOpts = {
          since: last_seq,
          limit: batch_size,
          batch_size: batch_size,
          style: 'all_docs',
          doc_ids: doc_ids,
          return_docs: true // required so we know when we're done
        };
        if (opts.filter) {
          if (typeof opts.filter !== 'string') {
            // required for the client-side filter in onChange
            changesOpts.include_docs = true;
          } else { // ddoc filter
            changesOpts.filter = opts.filter;
          }
        }
        if ('heartbeat' in opts) {
          changesOpts.heartbeat = opts.heartbeat;
        }
        if ('timeout' in opts) {
          changesOpts.timeout = opts.timeout;
        }
        if (opts.query_params) {
          changesOpts.query_params = opts.query_params;
        }
        if (opts.view) {
          changesOpts.view = opts.view;
        }
        getChanges();
      });
    }).catch(function (err) {
      abortReplication('getCheckpoint rejected with ', err);
    });
  }

  /* istanbul ignore next */
  function onCheckpointError(err) {
    writingCheckpoint = false;
    abortReplication('writeCheckpoint completed with error', err);
    throw err;
  }

  /* istanbul ignore if */
  if (returnValue.cancelled) { // cancelled immediately
    completeReplication();
    return;
  }

  if (!returnValue._addedListeners) {
    returnValue.once('cancel', completeReplication);

    if (typeof opts.complete === 'function') {
      returnValue.once('error', opts.complete);
      returnValue.once('complete', function (result) {
        opts.complete(null, result);
      });
    }
    returnValue._addedListeners = true;
  }

  if (typeof opts.since === 'undefined') {
    startChanges();
  } else {
    initCheckpointer().then(function () {
      writingCheckpoint = true;
      return checkpointer.writeCheckpoint(opts.since, session);
    }).then(function () {
      writingCheckpoint = false;
      /* istanbul ignore if */
      if (returnValue.cancelled) {
        completeReplication();
        return;
      }
      last_seq = opts.since;
      startChanges();
    }).catch(onCheckpointError);
  }
}

// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
inherits(Replication, events.EventEmitter);
function Replication() {
  events.EventEmitter.call(this);
  this.cancelled = false;
  this.state = 'pending';
  var self = this;
  var promise = new Promise(function (fulfill, reject) {
    self.once('complete', fulfill);
    self.once('error', reject);
  });
  self.then = function (resolve, reject) {
    return promise.then(resolve, reject);
  };
  self.catch = function (reject) {
    return promise.catch(reject);
  };
  // As we allow error handling via "error" event as well,
  // put a stub in here so that rejecting never throws UnhandledError.
  self.catch(function () {});
}

Replication.prototype.cancel = function () {
  this.cancelled = true;
  this.state = 'cancelled';
  this.emit('cancel');
};

Replication.prototype.ready = function (src, target) {
  var self = this;
  if (self._readyCalled) {
    return;
  }
  self._readyCalled = true;

  function onDestroy() {
    self.cancel();
  }
  src.once('destroyed', onDestroy);
  target.once('destroyed', onDestroy);
  function cleanup() {
    src.removeListener('destroyed', onDestroy);
    target.removeListener('destroyed', onDestroy);
  }
  self.once('complete', cleanup);
};

function toPouch(db, opts) {
  var PouchConstructor = opts.PouchConstructor;
  if (typeof db === 'string') {
    return new PouchConstructor(db, opts);
  } else {
    return db;
  }
}

function replicate(src, target, opts, callback) {

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }

  if (opts.doc_ids && !Array.isArray(opts.doc_ids)) {
    throw pouchdbErrors.createError(pouchdbErrors.BAD_REQUEST,
                       "`doc_ids` filter parameter is not a list.");
  }

  opts.complete = callback;
  opts = pouchdbUtils.clone(opts);
  opts.continuous = opts.continuous || opts.live;
  opts.retry = ('retry' in opts) ? opts.retry : false;
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  var replicateRet = new Replication(opts);
  var srcPouch = toPouch(src, opts);
  var targetPouch = toPouch(target, opts);
  replicate$1(srcPouch, targetPouch, opts, replicateRet);
  return replicateRet;
}

inherits(Sync, events.EventEmitter);
function sync(src, target, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  if (typeof opts === 'undefined') {
    opts = {};
  }
  opts = pouchdbUtils.clone(opts);
  /*jshint validthis:true */
  opts.PouchConstructor = opts.PouchConstructor || this;
  src = toPouch(src, opts);
  target = toPouch(target, opts);
  return new Sync(src, target, opts, callback);
}

function Sync(src, target, opts, callback) {
  var self = this;
  this.canceled = false;

  var optsPush = opts.push ? jsExtend.extend({}, opts, opts.push) : opts;
  var optsPull = opts.pull ? jsExtend.extend({}, opts, opts.pull) : opts;

  this.push = replicate(src, target, optsPush);
  this.pull = replicate(target, src, optsPull);

  this.pushPaused = true;
  this.pullPaused = true;

  function pullChange(change) {
    self.emit('change', {
      direction: 'pull',
      change: change
    });
  }
  function pushChange(change) {
    self.emit('change', {
      direction: 'push',
      change: change
    });
  }
  function pushDenied(doc) {
    self.emit('denied', {
      direction: 'push',
      doc: doc
    });
  }
  function pullDenied(doc) {
    self.emit('denied', {
      direction: 'pull',
      doc: doc
    });
  }
  function pushPaused() {
    self.pushPaused = true;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('paused');
    }
  }
  function pullPaused() {
    self.pullPaused = true;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('paused');
    }
  }
  function pushActive() {
    self.pushPaused = false;
    /* istanbul ignore if */
    if (self.pullPaused) {
      self.emit('active', {
        direction: 'push'
      });
    }
  }
  function pullActive() {
    self.pullPaused = false;
    /* istanbul ignore if */
    if (self.pushPaused) {
      self.emit('active', {
        direction: 'pull'
      });
    }
  }

  var removed = {};

  function removeAll(type) { // type is 'push' or 'pull'
    return function (event, func) {
      var isChange = event === 'change' &&
        (func === pullChange || func === pushChange);
      var isDenied = event === 'denied' &&
        (func === pullDenied || func === pushDenied);
      var isPaused = event === 'paused' &&
        (func === pullPaused || func === pushPaused);
      var isActive = event === 'active' &&
        (func === pullActive || func === pushActive);

      if (isChange || isDenied || isPaused || isActive) {
        if (!(event in removed)) {
          removed[event] = {};
        }
        removed[event][type] = true;
        if (Object.keys(removed[event]).length === 2) {
          // both push and pull have asked to be removed
          self.removeAllListeners(event);
        }
      }
    };
  }

  if (opts.live) {
    this.push.on('complete', self.pull.cancel.bind(self.pull));
    this.pull.on('complete', self.push.cancel.bind(self.push));
  }

  this.on('newListener', function (event) {
    if (event === 'change') {
      self.pull.on('change', pullChange);
      self.push.on('change', pushChange);
    } else if (event === 'denied') {
      self.pull.on('denied', pullDenied);
      self.push.on('denied', pushDenied);
    } else if (event === 'active') {
      self.pull.on('active', pullActive);
      self.push.on('active', pushActive);
    } else if (event === 'paused') {
      self.pull.on('paused', pullPaused);
      self.push.on('paused', pushPaused);
    }
  });

  this.on('removeListener', function (event) {
    if (event === 'change') {
      self.pull.removeListener('change', pullChange);
      self.push.removeListener('change', pushChange);
    } else if (event === 'denied') {
      self.pull.removeListener('denied', pullDenied);
      self.push.removeListener('denied', pushDenied);
    } else if (event === 'active') {
      self.pull.removeListener('active', pullActive);
      self.push.removeListener('active', pushActive);
    } else if (event === 'paused') {
      self.pull.removeListener('paused', pullPaused);
      self.push.removeListener('paused', pushPaused);
    }
  });

  this.pull.on('removeListener', removeAll('pull'));
  this.push.on('removeListener', removeAll('push'));

  var promise = Promise.all([
    this.push,
    this.pull
  ]).then(function (resp) {
    var out = {
      push: resp[0],
      pull: resp[1]
    };
    self.emit('complete', out);
    if (callback) {
      callback(null, out);
    }
    self.removeAllListeners();
    return out;
  }, function (err) {
    self.cancel();
    if (callback) {
      // if there's a callback, then the callback can receive
      // the error event
      callback(err);
    } else {
      // if there's no callback, then we're safe to emit an error
      // event, which would otherwise throw an unhandled error
      // due to 'error' being a special event in EventEmitters
      self.emit('error', err);
    }
    self.removeAllListeners();
    if (callback) {
      // no sense throwing if we're already emitting an 'error' event
      throw err;
    }
  });

  this.then = function (success, err) {
    return promise.then(success, err);
  };

  this.catch = function (err) {
    return promise.catch(err);
  };
}

Sync.prototype.cancel = function () {
  if (!this.canceled) {
    this.canceled = true;
    this.push.cancel();
    this.pull.cancel();
  }
};

function replication(PouchDB) {
  PouchDB.replicate = replicate;
  PouchDB.sync = sync;
}

module.exports = replication;
},{"events":19,"inherits":22,"js-extend":24,"pouchdb-checkpointer":36,"pouchdb-errors":41,"pouchdb-generate-replication-id":42,"pouchdb-promise":48,"pouchdb-utils":50}],50:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Promise = _interopDefault(require('pouchdb-promise'));
var getArguments = _interopDefault(require('argsarray'));
var debug = _interopDefault(require('debug'));
var events = require('events');
var inherits = _interopDefault(require('inherits'));
var pouchdbErrors = require('pouchdb-errors');

function isBinaryObject(object) {
  return object instanceof ArrayBuffer ||
    (typeof Blob !== 'undefined' && object instanceof Blob);
}

function cloneArrayBuffer(buff) {
  if (typeof buff.slice === 'function') {
    return buff.slice(0);
  }
  // IE10-11 slice() polyfill
  var target = new ArrayBuffer(buff.byteLength);
  var targetArray = new Uint8Array(target);
  var sourceArray = new Uint8Array(buff);
  targetArray.set(sourceArray);
  return target;
}

function cloneBinaryObject(object) {
  if (object instanceof ArrayBuffer) {
    return cloneArrayBuffer(object);
  }
  var size = object.size;
  var type = object.type;
  // Blob
  if (typeof object.slice === 'function') {
    return object.slice(0, size, type);
  }
  // PhantomJS slice() replacement
  return object.webkitSlice(0, size, type);
}

// most of this is borrowed from lodash.isPlainObject:
// https://github.com/fis-components/lodash.isplainobject/
// blob/29c358140a74f252aeb08c9eb28bef86f2217d4a/index.js

var funcToString = Function.prototype.toString;
var objectCtorString = funcToString.call(Object);

function isPlainObject(value) {
  var proto = Object.getPrototypeOf(value);
  /* istanbul ignore if */
  if (proto === null) { // not sure when this happens, but I guess it can
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

function clone(object) {
  var newObject;
  var i;
  var len;

  if (!object || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    newObject = [];
    for (i = 0, len = object.length; i < len; i++) {
      newObject[i] = clone(object[i]);
    }
    return newObject;
  }

  // special case: to avoid inconsistencies between IndexedDB
  // and other backends, we automatically stringify Dates
  if (object instanceof Date) {
    return object.toISOString();
  }

  if (isBinaryObject(object)) {
    return cloneBinaryObject(object);
  }

  if (!isPlainObject(object)) {
    return object; // don't clone objects like Workers
  }

  newObject = {};
  for (i in object) {
    if (Object.prototype.hasOwnProperty.call(object, i)) {
      var value = clone(object[i]);
      if (typeof value !== 'undefined') {
        newObject[i] = value;
      }
    }
  }
  return newObject;
}

function once(fun) {
  var called = false;
  return getArguments(function (args) {
    /* istanbul ignore if */
    if (called) {
      // this is a smoke test and should never actually happen
      throw new Error('once called more than once');
    } else {
      called = true;
      fun.apply(this, args);
    }
  });
}

function toPromise(func) {
  //create the function we will be returning
  return getArguments(function (args) {
    // Clone arguments
    args = clone(args);
    var self = this;
    var tempCB =
      (typeof args[args.length - 1] === 'function') ? args.pop() : false;
    // if the last argument is a function, assume its a callback
    var usedCB;
    if (tempCB) {
      // if it was a callback, create a new callback which calls it,
      // but do so async so we don't trap any errors
      usedCB = function (err, resp) {
        process.nextTick(function () {
          tempCB(err, resp);
        });
      };
    }
    var promise = new Promise(function (fulfill, reject) {
      var resp;
      try {
        var callback = once(function (err, mesg) {
          if (err) {
            reject(err);
          } else {
            fulfill(mesg);
          }
        });
        // create a callback for this invocation
        // apply the function in the orig context
        args.push(callback);
        resp = func.apply(self, args);
        if (resp && typeof resp.then === 'function') {
          fulfill(resp);
        }
      } catch (e) {
        reject(e);
      }
    });
    // if there is a callback, call it back
    if (usedCB) {
      promise.then(function (result) {
        usedCB(null, result);
      }, usedCB);
    }
    return promise;
  });
}

var log = debug('pouchdb:api');

function adapterFun(name, callback) {
  function logApiCall(self, name, args) {
    /* istanbul ignore if */
    if (log.enabled) {
      var logArgs = [self._db_name, name];
      for (var i = 0; i < args.length - 1; i++) {
        logArgs.push(args[i]);
      }
      log.apply(null, logArgs);

      // override the callback itself to log the response
      var origCallback = args[args.length - 1];
      args[args.length - 1] = function (err, res) {
        var responseArgs = [self._db_name, name];
        responseArgs = responseArgs.concat(
          err ? ['error', err] : ['success', res]
        );
        log.apply(null, responseArgs);
        origCallback(err, res);
      };
    }
  }

  return toPromise(getArguments(function (args) {
    if (this._closed) {
      return Promise.reject(new Error('database is closed'));
    }
    if (this._destroyed) {
      return Promise.reject(new Error('database is destroyed'));
    }
    var self = this;
    logApiCall(self, name, args);
    if (!this.taskqueue.isReady) {
      return new Promise(function (fulfill, reject) {
        self.taskqueue.addTask(function (failed) {
          if (failed) {
            reject(failed);
          } else {
            fulfill(self[name].apply(self, args));
          }
        });
      });
    }
    return callback.apply(this, args);
  }));
}

// like underscore/lodash _.pick()
function pick(obj, arr) {
  var res = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    var prop = arr[i];
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  }
  return res;
}

// Most browsers throttle concurrent requests at 6, so it's silly
// to shim _bulk_get by trying to launch potentially hundreds of requests
// and then letting the majority time out. We can handle this ourselves.
var MAX_NUM_CONCURRENT_REQUESTS = 6;

function identityFunction(x) {
  return x;
}

function formatResultForOpenRevsGet(result) {
  return [{
    ok: result
  }];
}

// shim for P/CouchDB adapters that don't directly implement _bulk_get
function bulkGet(db, opts, callback) {
  var requests = opts.docs;

  // consolidate into one request per doc if possible
  var requestsById = {};
  requests.forEach(function (request) {
    if (request.id in requestsById) {
      requestsById[request.id].push(request);
    } else {
      requestsById[request.id] = [request];
    }
  });

  var numDocs = Object.keys(requestsById).length;
  var numDone = 0;
  var perDocResults = new Array(numDocs);

  function collapseResultsAndFinish() {
    var results = [];
    perDocResults.forEach(function (res) {
      res.docs.forEach(function (info) {
        results.push({
          id: res.id,
          docs: [info]
        });
      });
    });
    callback(null, {results: results});
  }

  function checkDone() {
    if (++numDone === numDocs) {
      collapseResultsAndFinish();
    }
  }

  function gotResult(docIndex, id, docs) {
    perDocResults[docIndex] = {id: id, docs: docs};
    checkDone();
  }

  var allRequests = Object.keys(requestsById);

  var i = 0;

  function nextBatch() {

    if (i >= allRequests.length) {
      return;
    }

    var upTo = Math.min(i + MAX_NUM_CONCURRENT_REQUESTS, allRequests.length);
    var batch = allRequests.slice(i, upTo);
    processBatch(batch, i);
    i += batch.length;
  }

  function processBatch(batch, offset) {
    batch.forEach(function (docId, j) {
      var docIdx = offset + j;
      var docRequests = requestsById[docId];

      // just use the first request as the "template"
      // TODO: The _bulk_get API allows for more subtle use cases than this,
      // but for now it is unlikely that there will be a mix of different
      // "atts_since" or "attachments" in the same request, since it's just
      // replicate.js that is using this for the moment.
      // Also, atts_since is aspirational, since we don't support it yet.
      var docOpts = pick(docRequests[0], ['atts_since', 'attachments']);
      docOpts.open_revs = docRequests.map(function (request) {
        // rev is optional, open_revs disallowed
        return request.rev;
      });

      // remove falsey / undefined revisions
      docOpts.open_revs = docOpts.open_revs.filter(identityFunction);

      var formatResult = identityFunction;

      if (docOpts.open_revs.length === 0) {
        delete docOpts.open_revs;

        // when fetching only the "winning" leaf,
        // transform the result so it looks like an open_revs
        // request
        formatResult = formatResultForOpenRevsGet;
      }

      // globally-supplied options
      ['revs', 'attachments', 'binary', 'ajax'].forEach(function (param) {
        if (param in opts) {
          docOpts[param] = opts[param];
        }
      });
      db.get(docId, docOpts, function (err, res) {
        var result;
        /* istanbul ignore if */
        if (err) {
          result = [{error: err}];
        } else {
          result = formatResult(res);
        }
        gotResult(docIdx, docId, result);
        nextBatch();
      });
    });
  }

  nextBatch();

}

function isChromeApp() {
  return (typeof chrome !== "undefined" &&
    typeof chrome.storage !== "undefined" &&
    typeof chrome.storage.local !== "undefined");
}

var hasLocal;

if (isChromeApp()) {
  hasLocal = false;
} else {
  try {
    localStorage.setItem('_pouch_check_localstorage', 1);
    hasLocal = !!localStorage.getItem('_pouch_check_localstorage');
  } catch (e) {
    hasLocal = false;
  }
}

function hasLocalStorage() {
  return hasLocal;
}

inherits(Changes, events.EventEmitter);

/* istanbul ignore next */
function attachBrowserEvents(self) {
  if (isChromeApp()) {
    chrome.storage.onChanged.addListener(function (e) {
      // make sure it's event addressed to us
      if (e.db_name != null) {
        //object only has oldValue, newValue members
        self.emit(e.dbName.newValue);
      }
    });
  } else if (hasLocalStorage()) {
    if (typeof addEventListener !== 'undefined') {
      addEventListener("storage", function (e) {
        self.emit(e.key);
      });
    } else { // old IE
      window.attachEvent("storage", function (e) {
        self.emit(e.key);
      });
    }
  }
}

function Changes() {
  events.EventEmitter.call(this);
  this._listeners = {};

  attachBrowserEvents(this);
}
Changes.prototype.addListener = function (dbName, id, db, opts) {
  /* istanbul ignore if */
  if (this._listeners[id]) {
    return;
  }
  var self = this;
  var inprogress = false;
  function eventFunction() {
    /* istanbul ignore if */
    if (!self._listeners[id]) {
      return;
    }
    if (inprogress) {
      inprogress = 'waiting';
      return;
    }
    inprogress = true;
    var changesOpts = pick(opts, [
      'style', 'include_docs', 'attachments', 'conflicts', 'filter',
      'doc_ids', 'view', 'since', 'query_params', 'binary'
    ]);

    /* istanbul ignore next */
    function onError() {
      inprogress = false;
    }

    db.changes(changesOpts).on('change', function (c) {
      if (c.seq > opts.since && !opts.cancelled) {
        opts.since = c.seq;
        opts.onChange(c);
      }
    }).on('complete', function () {
      if (inprogress === 'waiting') {
        setTimeout(function (){
          eventFunction();
        },0);
      }
      inprogress = false;
    }).on('error', onError);
  }
  this._listeners[id] = eventFunction;
  this.on(dbName, eventFunction);
};

Changes.prototype.removeListener = function (dbName, id) {
  /* istanbul ignore if */
  if (!(id in this._listeners)) {
    return;
  }
  events.EventEmitter.prototype.removeListener.call(this, dbName,
    this._listeners[id]);
};


/* istanbul ignore next */
Changes.prototype.notifyLocalWindows = function (dbName) {
  //do a useless change on a storage thing
  //in order to get other windows's listeners to activate
  if (isChromeApp()) {
    chrome.storage.local.set({dbName: dbName});
  } else if (hasLocalStorage()) {
    localStorage[dbName] = (localStorage[dbName] === "a") ? "b" : "a";
  }
};

Changes.prototype.notify = function (dbName) {
  this.emit(dbName);
  this.notifyLocalWindows(dbName);
};

function guardedConsole(method) {
  if (console !== 'undefined' && method in console) {
    var args = Array.prototype.slice.call(arguments, 1);
    console[method].apply(console, args);
  }
}

function randomNumber(min, max) {
  var maxTimeout = 600000; // Hard-coded default of 10 minutes
  min = parseInt(min, 10) || 0;
  max = parseInt(max, 10);
  if (max !== max || max <= min) {
    max = (min || 1) << 1; //doubling
  } else {
    max = max + 1;
  }
  // In order to not exceed maxTimeout, pick a random value between half of maxTimeout and maxTimeout
  if(max > maxTimeout) {
    min = maxTimeout >> 1; // divide by two
    max = maxTimeout;
  }
  var ratio = Math.random();
  var range = max - min;

  return ~~(range * ratio + min); // ~~ coerces to an int, but fast.
}

function defaultBackOff(min) {
  var max = 0;
  if (!min) {
    max = 2000;
  }
  return randomNumber(min, max);
}

// designed to give info to browser users, who are disturbed
// when they see http errors in the console
function explainError(status, str) {
  guardedConsole('info', 'The above ' + status + ' is totally normal. ' + str);
}

function extendInner(obj, otherObj) {
  for (var key in otherObj) {
    if (otherObj.hasOwnProperty(key)) {
      var value = clone(otherObj[key]);
      if (typeof value !== 'undefined') {
        obj[key] = value;
      }
    }
  }
}

function extend(obj, obj2, obj3) {
  extendInner(obj, obj2);
  if (obj3) {
    extendInner(obj, obj3);
  }
  return obj;
}

function tryFilter(filter, doc, req) {
  try {
    return !filter(doc, req);
  } catch (err) {
    var msg = 'Filter function threw: ' + err.toString();
    return pouchdbErrors.createError(pouchdbErrors.BAD_REQUEST, msg);
  }
}

function filterChange(opts) {
  var req = {};
  var hasFilter = opts.filter && typeof opts.filter === 'function';
  req.query = opts.query_params;

  return function filter(change) {
    if (!change.doc) {
      // CSG sends events on the changes feed that don't have documents,
      // this hack makes a whole lot of existing code robust.
      change.doc = {};
    }

    var filterReturn = hasFilter && tryFilter(opts.filter, change.doc, req);

    if (typeof filterReturn === 'object') {
      return filterReturn;
    }

    if (filterReturn) {
      return false;
    }

    if (!opts.include_docs) {
      delete change.doc;
    } else if (!opts.attachments) {
      for (var att in change.doc._attachments) {
        /* istanbul ignore else */
        if (change.doc._attachments.hasOwnProperty(att)) {
          change.doc._attachments[att].stub = true;
        }
      }
    }
    return true;
  };
}

function flatten(arrs) {
  var res = [];
  for (var i = 0, len = arrs.length; i < len; i++) {
    res = res.concat(arrs[i]);
  }
  return res;
}

// shim for Function.prototype.name,
// for browsers that don't support it like IE

/* istanbul ignore next */
function f() {}

var hasName = f.name;
var res;

// We dont run coverage in IE
/* istanbul ignore else */
if (hasName) {
  res = function (fun) {
    return fun.name;
  };
} else {
  res = function (fun) {
    return fun.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
  };
}

var functionName = res;

// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or
//     '_local'
//   - any other string value is a valid id
// Returns the specific error object for each case
function invalidIdError(id) {
  var err;
  if (!id) {
    err = pouchdbErrors.createError(pouchdbErrors.MISSING_ID);
  } else if (typeof id !== 'string') {
    err = pouchdbErrors.createError(pouchdbErrors.INVALID_ID);
  } else if (/^_/.test(id) && !(/^_(design|local)/).test(id)) {
    err = pouchdbErrors.createError(pouchdbErrors.RESERVED_ID);
  }
  if (err) {
    throw err;
  }
}

function isCordova() {
  return (typeof cordova !== "undefined" ||
  typeof PhoneGap !== "undefined" ||
  typeof phonegap !== "undefined");
}

function listenerCount(ee, type) {
  return 'listenerCount' in ee ? ee.listenerCount(type) :
                                 events.EventEmitter.listenerCount(ee, type);
}

function parseDesignDocFunctionName(s) {
  if (!s) {
    return null;
  }
  var parts = s.split('/');
  if (parts.length === 2) {
    return parts;
  }
  if (parts.length === 1) {
    return [s, s];
  }
  return null;
}

function normalizeDesignDocFunctionName(s) {
  var normalized = parseDesignDocFunctionName(s);
  return normalized ? normalized.join('/') : null;
}

// originally parseUri 1.2.2, now patched by us
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
var keys = ["source", "protocol", "authority", "userInfo", "user", "password",
    "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
var qName ="queryKey";
var qParser = /(?:^|&)([^&=]*)=?([^&]*)/g;

// use the "loose" parser
/* jshint maxlen: false */
var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

function parseUri(str) {
  var m = parser.exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    var key = keys[i];
    var value = m[i] || "";
    var encoded = ['user', 'password'].indexOf(key) !== -1;
    uri[key] = encoded ? decodeURIComponent(value) : value;
  }

  uri[qName] = {};
  uri[keys[12]].replace(qParser, function ($0, $1, $2) {
    if ($1) {
      uri[qName][$1] = $2;
    }
  });

  return uri;
}

// this is essentially the "update sugar" function from daleharvey/pouchdb#1388
// the diffFun tells us what delta to apply to the doc.  it either returns
// the doc, or false if it doesn't need to do an update after all
function upsert(db, docId, diffFun) {
  return new Promise(function (fulfill, reject) {
    db.get(docId, function (err, doc) {
      if (err) {
        /* istanbul ignore next */
        if (err.status !== 404) {
          return reject(err);
        }
        doc = {};
      }

      // the user might change the _rev, so save it for posterity
      var docRev = doc._rev;
      var newDoc = diffFun(doc);

      if (!newDoc) {
        // if the diffFun returns falsy, we short-circuit as
        // an optimization
        return fulfill({updated: false, rev: docRev});
      }

      // users aren't allowed to modify these values,
      // so reset them here
      newDoc._id = docId;
      newDoc._rev = docRev;
      fulfill(tryAndPut(db, newDoc, diffFun));
    });
  });
}

function tryAndPut(db, doc, diffFun) {
  return db.put(doc).then(function (res) {
    return {
      updated: true,
      rev: res.rev
    };
  }, function (err) {
    /* istanbul ignore next */
    if (err.status !== 409) {
      throw err;
    }
    return upsert(db, doc._id, diffFun);
  });
}

// BEGIN Math.uuid.js

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. 
 *   // (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
var chars = (
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz'
).split('');
function getValue(radix) {
  return 0 | Math.random() * radix;
}
function uuid(len, radix) {
  radix = radix || chars.length;
  var out = '';
  var i = -1;

  if (len) {
    // Compact form
    while (++i < len) {
      out += chars[getValue(radix)];
    }
    return out;
  }
    // rfc4122, version 4 form
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
  while (++i < 36) {
    switch (i) {
      case 8:
      case 13:
      case 18:
      case 23:
        out += '-';
        break;
      case 19:
        out += chars[(getValue(16) & 0x3) | 0x8];
        break;
      default:
        out += chars[getValue(16)];
    }
  }

  return out;
}

exports.adapterFun = adapterFun;
exports.bulkGetShim = bulkGet;
exports.changesHandler = Changes;
exports.clone = clone;
exports.defaultBackOff = defaultBackOff;
exports.explainError = explainError;
exports.extend = extend;
exports.filterChange = filterChange;
exports.flatten = flatten;
exports.functionName = functionName;
exports.guardedConsole = guardedConsole;
exports.hasLocalStorage = hasLocalStorage;
exports.invalidIdError = invalidIdError;
exports.isChromeApp = isChromeApp;
exports.isCordova = isCordova;
exports.listenerCount = listenerCount;
exports.normalizeDdocFunctionName = normalizeDesignDocFunctionName;
exports.once = once;
exports.parseDdocFunctionName = parseDesignDocFunctionName;
exports.parseUri = parseUri;
exports.pick = pick;
exports.toPromise = toPromise;
exports.upsert = upsert;
exports.uuid = uuid;
}).call(this,require('_process'))
},{"_process":5,"argsarray":1,"debug":16,"events":19,"inherits":22,"pouchdb-errors":41,"pouchdb-promise":48}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],52:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],53:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":51,"./encode":52}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedAttributes = undefined;

var _objectAsDictionary = require('object-as-dictionary');

var nameOverrides = (0, _objectAsDictionary.dictionary)({
  className: 'class',
  htmlFor: 'for',
  acceptCharset: 'accept-charset',
  httpEquiv: 'http-equiv',
  clipPath: 'clip-path',
  fillOpacity: 'fill-opacity',
  fontFamily: 'font-family',
  fontSize: 'font-size',
  markerEnd: 'marker-end',
  markerMid: 'marker-mid',
  markerStart: 'marker-start',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strokeDasharray: 'stroke-dasharray',
  strokeLinecap: 'stroke-linecap',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  textAnchor: 'text-anchor',
  xlinkActuate: 'xlink:actuate',
  xlinkArcrole: 'xlink:arcrole',
  xlinkHref: 'xlink:href',
  xlinkRole: 'xlink:role',
  xlinkShow: 'xlink:show',
  xlinkTitle: 'xlink:title',
  xlinkType: 'xlink:type',
  xmlBase: 'xml:base',
  xmlLang: 'xml:lang',
  xmlSpace: 'xml:space'
});

var supportedAttributes = exports.supportedAttributes = 'allowFullScreen allowTransparency capture cellPadding cellSpacing charSet\nchallenge classID className cols colSpan contentEditable contextMenu\ndir encType  form formAction formEncType formMethod formTarget frameBorder\nheight hidden inputMode is keyParams keyType list loop manifest marginHeight\nmarginWidth maxLength media method nonce role rows rowSpan scrolling seamless\nsize sizes span srcSet start width wmode wrap about datatype inlist prefix\nproperty resource typeof vocab autoCapitalize autoCorrect itemProp\nitemProp itemScope itemType itemRef itemID security unselectable\n\nclipPath cx cy d dx dy fill fillOpacity fontFamily\nfontSize fx fy gradientTransform gradientUnits markerEnd\nmarkerMid markerStart offset opacity patternContentUnits\npatternUnits points preserveAspectRatio r rx ry spreadMethod\nstopColor stopOpacity stroke  strokeDasharray strokeLinecap\nstrokeOpacity strokeWidth textAnchor transform version\nviewBox x1 x2 x xlinkActuate xlinkArcrole xlinkHref xlinkRole\nxlinkShow xlinkTitle xlinkType xmlBase xmlLang xmlSpace y1 y2 y'.split(/\s+/).reduce(function (table, name) {
  table[name] = nameOverrides[name] != null ? nameOverrides[name] : name.toLowerCase();
  return table;
}, (0, _objectAsDictionary.dictionary)());

},{"object-as-dictionary":27}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventHandler = exports.EventHandler = exports.supportedEvents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAsDictionary = require('object-as-dictionary');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nameOverrides = (0, _objectAsDictionary.dictionary)({
  DoubleClick: 'dblclick'
});

var supportedEvents = exports.supportedEvents = ['Copy', 'Cut', 'Paste', 'KeyDown', 'KeyPress', 'KeyUp', 'Focus', 'Blur', 'Change', 'Input', 'Submit', 'Click', 'ContextMenu', 'DoubleClick', 'Drag', 'DragEnd', 'DragEnter', 'DragExit', 'DragLeave', 'DragOver', 'DragStart', 'Drop', 'MouseDown', 'MouseEnter', 'MouseLeave', 'MouseMove', 'MouseOut', 'MouseOver', 'MouseUp', 'TouchStart', 'TouchMove', 'TouchCancel', 'TouchEnd', 'Scroll', 'Wheel', 'Abort', 'CanPlay', 'CanPlayThrough', 'DurationChange', 'Emptied', 'Encrypted', 'Ended', 'Error', 'LoadedData', 'LoadedMetadata', 'LoadStart', 'Pause', 'Play', 'Playing', 'Progress', 'RateChange', 'Seeked', 'Seeking', 'Stalled', 'Suspend', 'TimeUpdate', 'VolumeChange', 'Waiting', 'Load', 'Error', 'BeforeInput', 'CompositionEnd', 'CompositionStart', 'CompositionUpdate'].reduce(function (table, name) {
  var type = nameOverrides[name] == null ? name.toLowerCase() : nameOverrides[name];

  table['on' + name] = { type: type, capture: false };
  table['on' + name + 'Capture'] = { type: type, capture: true };

  return table;
}, (0, _objectAsDictionary.dictionary)());

var handleEvent = function handleEvent(phase) {
  return function (event) {
    var currentTarget = event.currentTarget;
    var type = event.type;

    var handler = currentTarget['on' + type + phase];

    if (typeof handler === 'function') {
      handler(event);
    }

    if (handler != null && typeof handler.handleEvent === 'function') {
      handler.handleEvent(event);
    }
  };
};

var handleCapturing = handleEvent('capture');
var handleBubbling = handleEvent('bubble');

var EventHandler = exports.EventHandler = function () {
  function EventHandler(handler) {
    _classCallCheck(this, EventHandler);

    this.handler = handler;
  }

  _createClass(EventHandler, [{
    key: 'hook',
    value: function hook(node, name, previous) {
      var config = supportedEvents[name];
      if (config != null) {
        var type = config.type;
        var capture = config.capture;

        var phase = capture ? 'capture' : 'bubble';

        if (!(previous instanceof EventHandler)) {
          var handler = capture ? handleCapturing : handleBubbling;
          node.addEventListener(type, handler, capture);
        }

        node['on' + type + phase] = this.handler;
      }
    }
  }, {
    key: 'unhook',
    value: function unhook(node, name, next) {
      var config = supportedEvents[name];

      if (config != null) {
        if (!(next instanceof EventHandler)) {
          var type = config.type;
          var capture = config.capture;

          var phase = capture ? 'capture' : 'bubble';
          var id = 'on' + type + phase;
          var handler = node[id];
          if (handler != null) {
            node.removeEventListener(type, handler, capture);
          }
          delete node[id];
        }
      }
    }
  }]);

  return EventHandler;
}();

var eventHandler = exports.eventHandler = function eventHandler(address) {
  var handler = address.reflexEventListener;
  if (handler == null) {
    var _handler = new EventHandler(address);
    address.reflexEventListener = _handler;
    return _handler;
  } else {
    return handler;
  }
};

},{"object-as-dictionary":27}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedProperties = undefined;

var _objectAsDictionary = require('object-as-dictionary');

var supportedProperties = exports.supportedProperties = (0, _objectAsDictionary.dictionary)({
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  autoPlay: 'autoplay',
  autoSave: 'autoSave',
  hrefLang: 'hreflang',
  radioGroup: 'radiogroup',
  spellCheck: 'spellcheck',
  srcDoc: 'srcdoc',
  srcSet: 'srcset'
});

},{"object-as-dictionary":27}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _diff = require("virtual-dom/diff");

var _diff2 = _interopRequireDefault(_diff);

var _createElement = require("virtual-dom/create-element");

var _createElement2 = _interopRequireDefault(_createElement);

var _patch = require("virtual-dom/patch");

var _patch2 = _interopRequireDefault(_patch);

var _text = require("./text");

var _node = require("./node");

var _thunk = require("./thunk");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NO_REQUEST = 0;
var PENDING_REQUEST = 1;
var EXTRA_REQUEST = 2;

var AnimationScheduler = function () {
  function AnimationScheduler() {
    _classCallCheck(this, AnimationScheduler);

    this.state = NO_REQUEST;
    this.requests = [];
    this.execute = this.execute.bind(this);
  }

  _createClass(AnimationScheduler, [{
    key: "schedule",
    value: function schedule(request) {
      if (this.requests.indexOf(request) === -1) {
        if (this.state === NO_REQUEST) {
          window.requestAnimationFrame(this.execute);
        }

        this.requests.push(request);
        this.state = PENDING_REQUEST;
      }
    }
  }, {
    key: "execute",
    value: function execute(time) {
      switch (this.state) {
        case NO_REQUEST:
          throw Error("Unexpected frame request");
        case PENDING_REQUEST:
          window.requestAnimationFrame(this.execute);
          this.state = EXTRA_REQUEST;
          this.dispatch(this.requests.splice(0), 0, time);
          break;
        case EXTRA_REQUEST:
          this.state = NO_REQUEST;
          break;
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(requests, index, time) {
      var count = requests.length;
      try {
        while (index < count) {
          var request = requests[index];
          index = index + 1;
          request(time);
        }
      } finally {
        if (index < count) {
          this.dispatch(requests, index, time);
        }
      }
    }
  }]);

  return AnimationScheduler;
}();

var animationScheduler = new AnimationScheduler();

var Renderer = exports.Renderer = function () {
  function Renderer(_ref) {
    var target = _ref.target;
    var timeGroupName = _ref.timeGroupName;

    _classCallCheck(this, Renderer);

    this.state = NO_REQUEST;
    this.target = target;
    this.mount = target.children.length !== 1 ? null : target.children[0].reflexTree == null ? null : target.children[0];

    this.address = this.receive.bind(this);
    this.execute = this.execute.bind(this);

    this.timeGroupName = timeGroupName == null ? null : timeGroupName;

    this.node = _node.node;
    this.thunk = _thunk.thunk;
    this.text = _text.text;
  }

  _createClass(Renderer, [{
    key: "toString",
    value: function toString() {
      return "Renderer({target: " + String(this.target) + "})";
    }
  }, {
    key: "receive",
    value: function receive(value) {
      if (this.value !== value) {
        this.value = value;
        animationScheduler.schedule(this.execute);
      }
    }
  }, {
    key: "execute",
    value: function execute(_) {
      var timeGroupName = this.timeGroupName;

      if (timeGroupName != null) {
        console.time("render " + timeGroupName);
      }

      var start = performance.now();

      this.value.renderWith(this);

      var end = performance.now();
      var time = end - start;

      if (timeGroupName != null) {
        console.time("render " + timeGroupName);
      }
    }
  }, {
    key: "render",
    value: function render(tree) {
      var mount = this.mount;
      var target = this.target;

      if (mount) {
        (0, _patch2.default)(mount, (0, _diff2.default)(mount.reflexTree, tree));
        mount.reflexTree = tree;
      } else {
        var _mount = (0, _createElement2.default)(tree);
        _mount.reflexTree = tree;
        target.innerHTML = "";
        this.mount = _mount;
        target.appendChild(_mount);
      }
    }
  }]);

  return Renderer;
}();

},{"./node":58,"./text":59,"./thunk":60,"virtual-dom/create-element":71,"virtual-dom/diff":72,"virtual-dom/patch":73}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.node = exports.VirtualNode = undefined;

var _isVnode = require("virtual-dom/vnode/is-vnode");

var _isVnode2 = _interopRequireDefault(_isVnode);

var _isWidget = require("virtual-dom/vnode/is-widget");

var _isWidget2 = _interopRequireDefault(_isWidget);

var _isThunk = require("virtual-dom/vnode/is-thunk");

var _isThunk2 = _interopRequireDefault(_isThunk);

var _isVhook = require("virtual-dom/vnode/is-vhook");

var _isVhook2 = _interopRequireDefault(_isVhook);

var _version = require("virtual-dom/vnode/version");

var _version2 = _interopRequireDefault(_version);

var _softSetHook = require("virtual-dom/virtual-hyperscript/hooks/soft-set-hook");

var _softSetHook2 = _interopRequireDefault(_softSetHook);

var _text = require("./text");

var _array = require("blanks/lib/array");

var _object = require("blanks/lib/object");

var _eventHandler = require("./hooks/event-handler");

var _attribute = require("./hooks/attribute");

var _property = require("./hooks/property");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualNode = exports.VirtualNode = function VirtualNode(tagName, namespace, properties, children) {
  _classCallCheck(this, VirtualNode);

  this.tagName = tagName;
  this.namespace = namespace;
  this.key = properties.key != null ? String(properties.key) : null;
  this.children = children;

  var count = children.length || 0;
  var descendants = 0;
  var hasWidgets = false;
  var hasThunks = false;
  var descendantHooks = false;

  var hooks = null;
  var attributes = properties.attributes != null ? properties.attributes : null;

  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      var property = properties[key];
      if ((0, _isVhook2.default)(property)) {
        if (hooks == null) {
          hooks = {};
        }

        hooks[key] = property;
      } else {
        if (_eventHandler.supportedEvents[key] != null) {
          if (hooks == null) {
            hooks = {};
          }

          if (property != null) {
            var handler = (0, _eventHandler.eventHandler)(property);
            hooks[key] = handler;
            properties[key] = handler;
          }
        } else if (key === 'value' && property != null && (tagName.toLowerCase() === 'input' || tagName.toLowerCase() === 'textarea')) {
          if (hooks == null) {
            hooks = {};
          }

          var hook = new _softSetHook2.default(property);
          hooks[key] = hook;
          properties[key] = hook;
        } else if (_attribute.supportedAttributes[key] != null) {
          if (attributes == null) {
            attributes = {};
          }

          if (property !== null && property !== false) {
            attributes[_attribute.supportedAttributes[key]] = property === true ? "" : property;
          }

          delete properties[key];
        } else if (_property.supportedProperties[key] != null) {
          properties[_property.supportedProperties[key]] = property;
          delete properties[key];
        } else if (key.indexOf('data-') === 0 || key.indexOf('aria-') === 0) {
          if (attributes == null) {
            attributes = {};
          }

          attributes[key] = property;
          delete properties[key];
        }
      }
    }
  }

  if (attributes != null) {
    properties.attributes = attributes;
  }

  var index = 0;
  while (index < count) {
    var child = children[index];

    if (typeof child === "string") {
      children[index] = (0, _text.text)(child);
    } else if (child.$type === "LazyTree") {
      children[index] = child.force();
      index = index - 1;
    } else if (child instanceof VirtualNode) {
      descendants += child.count;

      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true;
      }

      if (!hasThunks && child.hasThunks) {
        hasThunks = true;
      }

      if (!descendantHooks && (child.hooks != null || child.descendantHooks)) {
        descendantHooks = true;
      }
    } else if (!hasWidgets && (0, _isWidget2.default)(child)) {
      hasWidgets = true;
    } else if (!hasThunks && (0, _isThunk2.default)(child)) {
      hasThunks = true;
    }

    index = index + 1;
  }

  this.count = count + descendants;
  this.hasWidgets = hasWidgets;
  this.hasThunks = hasThunks;
  this.properties = properties;
  this.hooks = hooks;
};

VirtualNode.prototype.$type = "VirtualNode";
VirtualNode.prototype.type = "VirtualNode";
VirtualNode.prototype.version = _version2.default;

var node = exports.node = function node(tagName, properties, children) {
  return new VirtualNode(tagName, null, properties == null ? _object.blank : properties, children == null ? _array.empty : children);
};

},{"./hooks/attribute":54,"./hooks/event-handler":55,"./hooks/property":56,"./text":59,"blanks/lib/array":2,"blanks/lib/object":3,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook":80,"virtual-dom/vnode/is-thunk":82,"virtual-dom/vnode/is-vhook":83,"virtual-dom/vnode/is-vnode":84,"virtual-dom/vnode/is-widget":86,"virtual-dom/vnode/version":87}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = exports.VirtualText = undefined;

var _version = require("virtual-dom/vnode/version");

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualText = exports.VirtualText = function VirtualText(text) {
  _classCallCheck(this, VirtualText);

  this.text = text;
};

VirtualText.prototype.$type = "VirtualText";
VirtualText.prototype.type = "VirtualText";
VirtualText.prototype.version = _version2.default;

var text = exports.text = function text(_text) {
  return new VirtualText(_text);
};

},{"virtual-dom/vnode/version":87}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var redirect = function redirect(addressBook, index) {
  return function (action) {
    return addressBook[index](action);
  };
};

var Thunk = exports.Thunk = function () {
  function Thunk(key, view, args) {
    _classCallCheck(this, Thunk);

    this.key = key;
    this.view = view;
    this.args = args;
    this.addressBook = null;
    this.value = null;
  }

  _createClass(Thunk, [{
    key: 'render',
    value: function render(previous) {
      if (previous instanceof Thunk && previous.value != null) {
        if (profile) {
          console.time(this.key + '.receive');
        }

        var view = this.view;
        var passed = this.args;
        var key = this.key;
        var args = previous.args;
        var addressBook = previous.addressBook;
        var value = previous.value;

        this.addressBook = addressBook;
        this.args = args;
        this.value = value;

        var count = passed.length;
        var index = 0;
        var isUpdated = view !== previous.view || key !== previous.key;

        if (args.length !== count) {
          isUpdated = true;
          args.length = count;
          addressBook.length = count;
        }

        while (index < count) {
          var next = passed[index];
          var arg = args[index];

          if (next !== arg) {
            var isNextAddress = typeof next === 'function';
            var isCurrentAddress = typeof arg === 'function';

            if (isNextAddress && isCurrentAddress) {
              addressBook[index] = next;
            } else {
              isUpdated = true;

              if (isNextAddress) {
                addressBook[index] = next;
                args[index] = redirect(addressBook, index);
              } else {
                args[index] = next;
              }
            }
          }

          index = index + 1;
        }

        if (profile) {
          console.timeEnd(key + '.receive');
        }

        if (isUpdated) {
          if (profile) {
            console.time(key + '.render');
          }

          this.value = view.apply(undefined, _toConsumableArray(args));

          if (profile) {
            console.timeEnd(key + '.render');
          }
        }
      } else {
        if (profile) {
          console.time(this.key + '.render');
        }

        var _addressBook = [];
        var _args = this.args;
        var _view = this.view;
        var _key = this.key;

        var _count = _args.length;

        var _index = 0;
        while (_index < _count) {
          var _arg = _args[_index];
          if (typeof _arg === 'function') {
            _addressBook[_index] = _arg;
            _args[_index] = redirect(_addressBook, _index);
          } else {
            _args[_index] = _arg;
          }
          _index = _index + 1;
        }

        this.addressBook = _addressBook;
        this.value = _view.apply(undefined, _toConsumableArray(_args));

        if (profile) {
          console.timeEnd(_key + '.render');
        }
      }

      return this.value;
    }
  }]);

  return Thunk;
}();

Thunk.prototype.type = "Thunk";
Thunk.prototype.$type = "Thunk";

var profile = null;

var thunk = exports.thunk = function thunk(key, view) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return new Thunk(key, view, args);
};

},{}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.beginner = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _task = require("./task");

var _signal = require("./signal");

var _effects = require("./effects");

var _dom = require("./dom");

var first = function first(xs) {
  return xs[0];
};
var second = function second(xs) {
  return xs[1];
};

var beginner = exports.beginner = function beginner(configuration) {
  return { flags: void 0,
    init: function init(_) {
      return [configuration.model, _effects.Effects.none];
    },
    update: function update(model, action) {
      return [configuration.update(model, action), _effects.Effects.none];
    },
    view: configuration.view
  };
};

var start = exports.start = function start(configuration) {
  var init = configuration.init;
  var view = configuration.view;
  var update = configuration.update;
  var flags = configuration.flags;

  var _mailbox = (0, _signal.mailbox)({});

  var address = _mailbox.address;
  var signal = _mailbox.signal;

  var step = function step(_ref, action) {
    var _ref2 = _slicedToArray(_ref, 2);

    var model = _ref2[0];
    var _ = _ref2[1];
    return update(model, action);
  };

  var display = function display(model) {
    return (0, _dom.root)(view, model, address);
  };

  var steps = (0, _signal.reductions)(step, init(flags), signal);

  var model = (0, _signal.map)(first, steps);
  var application = { address: address,
    model: model,
    task: (0, _signal.map)(second, steps),
    view: (0, _signal.map)(display, model)
  };

  return application;
};

},{"./dom":62,"./effects":63,"./signal":67,"./task":68}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var driver = null;
var absent = new String("absent");

var VirtualRoot = function () {
  function VirtualRoot(view, model, address) {
    _classCallCheck(this, VirtualRoot);

    this.view = view;
    this.model = model;
    this.address = address;
  }

  _createClass(VirtualRoot, [{
    key: "renderWith",
    value: function renderWith(current) {
      var exception = absent;
      var previous = driver;
      driver = current;

      try {
        driver.render(this.view(this.model, this.address));
      } catch (error) {
        exception = error;
      }

      driver = previous;

      if (exception != absent) {
        throw exception;
      }
    }
  }]);

  return VirtualRoot;
}();

VirtualRoot.prototype.$type = "VirtualRoot";

var LazyNode = exports.LazyNode = function () {
  function LazyNode(tagName, properties, children) {
    _classCallCheck(this, LazyNode);

    this.tagName = tagName;
    this.properties = properties;
    this.children = children;
    this.key = properties == null ? null : properties.key;
  }

  _createClass(LazyNode, [{
    key: "force",
    value: function force() {
      if (driver == null) {
        throw TypeError('LazyTree may only be forced from with in the Root.renderWith(driver) call');
      }

      return driver.node(this.tagName, this.properties, this.children);
    }
  }]);

  return LazyNode;
}();

LazyNode.prototype.$type = "LazyTree";

var LazyThunk = function () {
  function LazyThunk(key, view, args) {
    _classCallCheck(this, LazyThunk);

    this.key = key;
    this.view = view;
    this.args = args;
  }

  _createClass(LazyThunk, [{
    key: "force",
    value: function force() {
      var _driver;

      if (driver == null) {
        throw TypeError('LazyTree may only be forced from with in the Root.renderWith(driver) call');
      }

      return (_driver = driver).thunk.apply(_driver, [this.key, this.view].concat(_toConsumableArray(this.args)));
    }
  }]);

  return LazyThunk;
}();

LazyThunk.prototype.$type = "LazyTree";

var root = exports.root = function root(view, model, address) {
  return new VirtualRoot(view, model, address);
};

var text = exports.text = function text(content) {
  return driver == null ? content : driver.text == null ? content : driver.text(content);
};

var node = exports.node = function node(tagName, properties, children) {
  return driver == null ? new LazyNode(tagName, properties, children) : driver.node(tagName, properties, children);
};

var thunk = exports.thunk = function thunk(key, view) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var _driver2;

  return driver == null ? new LazyThunk(key, view, args) : (_driver2 = driver).thunk.apply(_driver2, [key, view].concat(args));
};

},{}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Effects = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _task2 = require('./task');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var raise = function raise(error) {
  throw Error('Effects should be created from task that never fail but it did fail with error ' + error);
};

var ignore = function ignore(_) {
  return void 0;
};

var nil = _task2.Task.succeed(void 0);

var never = new _task2.Task(function (succeed, fail) {
  return void 0;
});

var Effects = function () {
  function Effects() {
    _classCallCheck(this, Effects);
  }

  _createClass(Effects, null, [{
    key: 'task',
    value: function task(_task) {
      console.warn('Effects.task is deprecated please use Effects.perform instead');
      return new Perform(_task);
    }
  }, {
    key: 'perform',
    value: function perform(task) {
      return new Perform(task);
    }
  }, {
    key: 'tick',
    value: function tick(tag) {
      console.warn('Effects.tick is deprecated please use Effects.perform(Task.requestAnimationFrame().map(tag)) instead');
      return new Perform(_task2.Task.requestAnimationFrame().map(tag));
    }
  }, {
    key: 'receive',
    value: function receive(action) {
      var fx = new Perform(new _task2.Task(function (succeed, fail) {
        return void Promise.resolve(action).then(succeed, fail);
      }));
      return fx;
    }
  }, {
    key: 'batch',
    value: function batch(effects) {
      return new Batch(effects);
    }
  }, {
    key: 'driver',
    value: function driver(address) {
      return function (fx) {
        if (!(fx instanceof None)) {
          _task2.Task.fork(fx.send(address), ignore, raise);
        }
      };
    }
  }]);

  return Effects;
}();

exports.Effects = Effects;

var Perform = function (_Effects) {
  _inherits(Perform, _Effects);

  function Perform(task) {
    _classCallCheck(this, Perform);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Perform).call(this));

    _this.task = task;
    return _this;
  }

  _createClass(Perform, [{
    key: 'map',
    value: function map(f) {
      return new Perform(this.task.map(f));
    }
  }, {
    key: 'send',
    value: function send(address) {
      return this.task.chain(function (value) {
        return _task2.Task.send(address, value);
      });
    }
  }]);

  return Perform;
}(Effects);

var None = function (_Effects2) {
  _inherits(None, _Effects2);

  function None() {
    _classCallCheck(this, None);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(None).apply(this, arguments));
  }

  _createClass(None, [{
    key: 'map',
    value: function map(f) {
      return Effects.none;
    }
  }, {
    key: 'send',
    value: function send(address) {
      return nil;
    }
  }]);

  return None;
}(Effects);

Effects.none = new None();

var Batch = function (_Effects3) {
  _inherits(Batch, _Effects3);

  function Batch(effects) {
    _classCallCheck(this, Batch);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Batch).call(this));

    _this3.effects = effects;
    return _this3;
  }

  _createClass(Batch, [{
    key: 'map',
    value: function map(f) {
      return new Batch(this.effects.map(function (effect) {
        return effect.map(f);
      }));
    }
  }, {
    key: 'send',
    value: function send(address) {
      var _this4 = this;

      return new _task2.Task(function (succeed, fail) {
        var effects = _this4.effects;

        var count = effects.length;
        var index = 0;
        while (index < count) {
          var effect = effects[index];
          if (!(effect instanceof None)) {
            _task2.Task.fork(effect.send(address), ignore, raise);
          }

          index = index + 1;
        }
        succeed(void 0);
      });
    }
  }]);

  return Batch;
}(Effects);

},{"./task":68}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = undefined;

var _dom = require("./dom");

var html = exports.html = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "g", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"].reduce(function (html, tagName) {
  var element = function element(properties, children) {
    return (0, _dom.node)(tagName, properties, children);
  };

  html[tagName] = element;
  return html;
}, Object.create(null));

},{"./dom":62}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require("./dom");

Object.defineProperty(exports, "thunk", {
  enumerable: true,
  get: function get() {
    return _dom.thunk;
  }
});
Object.defineProperty(exports, "node", {
  enumerable: true,
  get: function get() {
    return _dom.node;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function get() {
    return _dom.text;
  }
});

var _html = require("./html");

Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function get() {
    return _html.html;
  }
});

var _signal = require("./signal");

Object.defineProperty(exports, "forward", {
  enumerable: true,
  get: function get() {
    return _signal.forward;
  }
});
Object.defineProperty(exports, "mailbox", {
  enumerable: true,
  get: function get() {
    return _signal.mailbox;
  }
});

var _application = require("./application");

Object.defineProperty(exports, "start", {
  enumerable: true,
  get: function get() {
    return _application.start;
  }
});
Object.defineProperty(exports, "beginner", {
  enumerable: true,
  get: function get() {
    return _application.beginner;
  }
});

var _effects = require("./effects");

Object.defineProperty(exports, "Effects", {
  enumerable: true,
  get: function get() {
    return _effects.Effects;
  }
});

var _task = require("./task");

Object.defineProperty(exports, "Task", {
  enumerable: true,
  get: function get() {
    return _task.Task;
  }
});

},{"./application":61,"./dom":62,"./effects":63,"./html":64,"./signal":67,"./task":68}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var NO_REQUEST = 0;
var PENDING_REQUEST = 1;
var EXTRA_REQUEST = 2;

var nextID = 0;
var state = NO_REQUEST;
var requests = [];
var ids = [];

var absent = new String("absent");

var requestAnimationFrame = exports.requestAnimationFrame = function requestAnimationFrame(request) {
  if (state === NO_REQUEST) {
    window.requestAnimationFrame(performAnimationFrame);
  }

  var id = ++nextID;
  requests.push(request);
  ids.push(id);
  state = PENDING_REQUEST;
  return id;
};

var cancelAnimationFrame = exports.cancelAnimationFrame = function cancelAnimationFrame(id) {
  var index = ids.indexOf(id);
  if (index >= 0) {
    ids.splice(index, 1);
    requests.splice(index, 1);
  }
};

var forceAnimationFrame = exports.forceAnimationFrame = function forceAnimationFrame() {
  var time = arguments.length <= 0 || arguments[0] === undefined ? window.performance.now() : arguments[0];
  return performAnimationFrame(time);
};

var performAnimationFrame = function performAnimationFrame(time) {
  switch (state) {
    case NO_REQUEST:
      throw Error("Unexpected frame request");
    case PENDING_REQUEST:
      window.requestAnimationFrame(performAnimationFrame);
      state = EXTRA_REQUEST;
      ids.splice(0);
      dispatchAnimationFrame(requests.splice(0), 0, time);
      break;
    case EXTRA_REQUEST:
      state = NO_REQUEST;
      break;
  }
};

var dispatchAnimationFrame = function dispatchAnimationFrame(requests, index, time) {
  var exception = absent;
  var count = requests.length;
  try {
    while (index < count) {
      var request = requests[index];
      index = index + 1;
      request(time);
    }
  } catch (error) {
    exception = error;
  }

  if (index < count) {
    dispatchAnimationFrame(requests, index, time);
  }

  if (exception != absent) {
    throw exception;
  }
};

},{}],67:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var absent = new String("absent");

var Input = function () {
  _createClass(Input, null, [{
    key: "Address",
    value: function Address(signal) {
      if (signal.address == null) {
        signal.address = signal.receive.bind(signal);

        return signal.address;
      } else {
        return signal.address;
      }
    }
  }, {
    key: "notify",
    value: function notify(message, addressBook, from, to) {
      var exception = absent;
      try {
        while (from < to) {
          var address = addressBook[from];
          if (address != null) {
            address(message);
          }
          from = from + 1;
        }
      } catch (error) {
        exception = error;
      }

      if (from < to) {
        Input.notify(message, addressBook, from + 1, to);
      }

      if (exception != absent) {
        throw exception;
      }
    }
  }, {
    key: "connect",
    value: function connect(signal, address) {
      if (signal.addressBook == null) {
        signal.addressBook = [address];
      } else {
        var addressBook = signal.addressBook;
        if (addressBook.indexOf(address) < 0) {
          addressBook.push(address);
        }
      }
    }
  }]);

  function Input(value) {
    _classCallCheck(this, Input);

    this.value = value;
    this.isBlocked = false;

    this.addressBook = null;
    this.queue = null;
    this.address = null;
  }

  _createClass(Input, [{
    key: "receive",
    value: function receive(value) {
      if (this.isBlocked) {
        if (this.queue == null) {
          this.queue = [value];
        } else {
          this.queue.push(value);
        }
      } else {
        var exception = absent;
        this.isBlocked = true;
        try {
          this.value = value;

          if (this.addressBook != null) {
            var addressBook = this.addressBook;
            Input.notify(value, addressBook, 0, addressBook.length);
          }
        } catch (error) {
          exception = error;
        }

        this.isBlocked = false;
        if (this.queue != null && this.queue.length > 0) {
          this.receive(value = this.queue.shift());
        }

        if (exception != absent) {
          throw exception;
        }
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(address) {
      Input.connect(this, address);
      address(this.value);
    }
  }, {
    key: "connect",
    value: function connect(address) {
      if (this.addressBook == null) {
        this.addressBook = [address];
      } else {
        var addressBook = this.addressBook;
        if (addressBook.indexOf(address) < 0) {
          addressBook.push(address);
        }
      }
    }
  }]);

  return Input;
}();

Input.prototype.$type = "Signal.Signal";

var Inbox = function Inbox(message) {
  _classCallCheck(this, Inbox);

  this.signal = new Input(message);
  this.address = Input.Address(this.signal);
};

Inbox.prototype.$type = "Signal.Mailbox";

var mailbox = exports.mailbox = function mailbox(message) {
  return new Inbox(message);
};

var Forward = function Forward(address, tag) {
  var forward = function forward(message) {
    return address(tag(message));
  };
  forward.to = address;
  forward.tag = tag;
  return forward;
};

if (global['reflex/address'] == null) {
  global['reflex/address'] = 0;
}

var forward = exports.forward = function forward(address, tag) {
  var id = address.id != null ? address.id : address.id = global['reflex/address']++;
  var key = "reflex/address/" + id;

  return tag[key] || (tag[key] = Forward(address, tag));
};

var reductions = exports.reductions = function reductions(step, state, input) {
  var output = new Input(state);
  input.connect(forward(Input.Address(output), function (value) {
    return step(output.value, value);
  }));
  return output;
};

var map = exports.map = function map(f, input) {
  var output = new Input(f(input.value));
  input.connect(forward(Input.Address(output), f));
  return output;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preemptiveAnimationFrame = require('./preemptive-animation-frame');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = exports.Task = function () {
  _createClass(Task, null, [{
    key: 'create',
    value: function create(execute) {
      console.warn('Task.create is deprecated API use new Task instead');
      return new Task(execute);
    }
  }, {
    key: 'future',
    value: function future(request) {
      console.warn('Task.future is deprecated API use new Task instead');
      return new Future(request);
    }
  }, {
    key: 'succeed',
    value: function succeed(value) {
      return new Succeed(value);
    }
  }, {
    key: 'fail',
    value: function fail(error) {
      return new Fail(error);
    }
  }, {
    key: 'spawn',
    value: function spawn(task) {
      return new Spawn(task);
    }
  }, {
    key: 'sleep',
    value: function sleep(time) {
      return new Sleep(time);
    }
  }, {
    key: 'requestAnimationFrame',
    value: function requestAnimationFrame() {
      return new AnimationFrame();
    }
  }, {
    key: 'send',
    value: function send(address, message) {
      return new Send(address, message);
    }
  }, {
    key: 'fork',
    value: function fork(task, onSucceed, onFail) {
      return Process.fork(task, onSucceed, onFail);
    }
  }]);

  function Task(execute, cancel) {
    _classCallCheck(this, Task);

    if (execute != null) {
      this.fork = execute;
    }
    if (cancel != null) {
      this.abort = cancel;
    }
  }

  _createClass(Task, [{
    key: 'chain',
    value: function chain(next) {
      return new Chain(this, next);
    }
  }, {
    key: 'map',
    value: function map(f) {
      return new Map(this, f);
    }
  }, {
    key: 'capture',
    value: function capture(handle) {
      return new Capture(this, handle);
    }
  }, {
    key: 'format',
    value: function format(f) {
      return new Format(this, f);
    }
  }, {
    key: 'recover',
    value: function recover(regain) {
      return new Recover(this, regain);
    }
  }, {
    key: 'fork',
    value: function fork(succeed, fail) {}
  }, {
    key: 'abort',
    value: function abort(handle) {}
  }]);

  return Task;
}();

var Succeed = function (_Task) {
  _inherits(Succeed, _Task);

  function Succeed(value) {
    _classCallCheck(this, Succeed);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Succeed).call(this));

    _this.value = value;
    return _this;
  }

  _createClass(Succeed, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      succeed(this.value);
    }
  }]);

  return Succeed;
}(Task);

var Fail = function (_Task2) {
  _inherits(Fail, _Task2);

  function Fail(error) {
    _classCallCheck(this, Fail);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Fail).call(this));

    _this2.error = error;
    return _this2;
  }

  _createClass(Fail, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      fail(this.error);
    }
  }]);

  return Fail;
}(Task);

var Sleep = function (_Task3) {
  _inherits(Sleep, _Task3);

  function Sleep(time) {
    _classCallCheck(this, Sleep);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Sleep).call(this));

    _this3.time = time;
    return _this3;
  }

  _createClass(Sleep, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      return setTimeout(succeed, this.time, void 0);
    }
  }, {
    key: 'abort',
    value: function abort(id) {
      clearTimeout(id);
    }
  }]);

  return Sleep;
}(Task);

var AnimationFrame = function (_Task4) {
  _inherits(AnimationFrame, _Task4);

  function AnimationFrame() {
    _classCallCheck(this, AnimationFrame);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AnimationFrame).call(this));
  }

  _createClass(AnimationFrame, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      return (0, _preemptiveAnimationFrame.requestAnimationFrame)(succeed);
    }
  }, {
    key: 'abort',
    value: function abort(id) {
      (0, _preemptiveAnimationFrame.cancelAnimationFrame)(id);
    }
  }]);

  return AnimationFrame;
}(Task);

var threadID = 0;

var Spawn = function (_Task5) {
  _inherits(Spawn, _Task5);

  function Spawn(task) {
    _classCallCheck(this, Spawn);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Spawn).call(this));

    _this5.task = task;
    return _this5;
  }

  _createClass(Spawn, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      var _this6 = this;

      Promise.resolve(null).then(function (_) {
        return Task.fork(_this6.task, noop, noop);
      });

      succeed(++threadID);
    }
  }]);

  return Spawn;
}(Task);

var Send = function (_Task6) {
  _inherits(Send, _Task6);

  function Send(address, message) {
    _classCallCheck(this, Send);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Send).call(this));

    _this7.message = message;
    _this7.address = address;
    return _this7;
  }

  _createClass(Send, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      succeed(void this.address(this.message));
    }
  }]);

  return Send;
}(Task);

var Future = function (_Task7) {
  _inherits(Future, _Task7);

  function Future(request) {
    _classCallCheck(this, Future);

    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Future).call(this));

    _this8.request = request;
    return _this8;
  }

  _createClass(Future, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      this.request().then(succeed, fail);
    }
  }]);

  return Future;
}(Task);

var Then = function (_Task8) {
  _inherits(Then, _Task8);

  function Then(task) {
    _classCallCheck(this, Then);

    var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(Then).call(this));

    _this9.task = task;
    return _this9;
  }

  _createClass(Then, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      var _this10 = this;

      this.task.fork(function (value) {
        return void _this10.next(value).fork(succeed, fail);
      }, fail);
    }
  }]);

  return Then;
}(Task);

var Chain = function (_Then) {
  _inherits(Chain, _Then);

  function Chain(task, next) {
    _classCallCheck(this, Chain);

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(Chain).call(this, task));

    _this11.next = next;
    return _this11;
  }

  return Chain;
}(Then);

var Map = function (_Then2) {
  _inherits(Map, _Then2);

  function Map(task, mapper) {
    _classCallCheck(this, Map);

    var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Map).call(this, task));

    _this12.mapper = mapper;
    return _this12;
  }

  _createClass(Map, [{
    key: 'next',
    value: function next(input) {
      return new Succeed(this.mapper(input));
    }
  }]);

  return Map;
}(Then);

var Catch = function (_Task9) {
  _inherits(Catch, _Task9);

  function Catch(task) {
    _classCallCheck(this, Catch);

    var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(Catch).call(this));

    _this13.task = task;
    return _this13;
  }

  _createClass(Catch, [{
    key: 'fork',
    value: function fork(succeed, fail) {
      var _this14 = this;

      this.task.fork(succeed, function (error) {
        return void _this14.handle(error).fork(succeed, fail);
      });
    }
  }]);

  return Catch;
}(Task);

var Capture = function (_Catch) {
  _inherits(Capture, _Catch);

  function Capture(task, handle) {
    _classCallCheck(this, Capture);

    var _this15 = _possibleConstructorReturn(this, Object.getPrototypeOf(Capture).call(this, task));

    _this15.handle = handle;
    return _this15;
  }

  return Capture;
}(Catch);

var Recover = function (_Catch2) {
  _inherits(Recover, _Catch2);

  function Recover(task, regain) {
    _classCallCheck(this, Recover);

    var _this16 = _possibleConstructorReturn(this, Object.getPrototypeOf(Recover).call(this, task));

    _this16.regain = regain;
    return _this16;
  }

  _createClass(Recover, [{
    key: 'handle',
    value: function handle(error) {
      return new Succeed(this.regain(error));
    }
  }]);

  return Recover;
}(Catch);

var Format = function (_Catch3) {
  _inherits(Format, _Catch3);

  function Format(task, formatter) {
    _classCallCheck(this, Format);

    var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(Format).call(this, task));

    _this17.formatter = formatter;
    return _this17;
  }

  _createClass(Format, [{
    key: 'handle',
    value: function handle(error) {
      return new Fail(this.formatter(error));
    }
  }]);

  return Format;
}(Catch);

var noop = function noop() {
  return void 0;
};

var nextID = 0;

var Process = function () {
  _createClass(Process, null, [{
    key: 'fork',
    value: function fork(task, onSucceed, onFail) {
      var process = new Process(task);
      process.succeed = onSucceed;
      process.fail = onFail;
      process.schedule();
      return process;
    }
  }]);

  function Process(task) {
    _classCallCheck(this, Process);

    this.id = ++nextID;
    this.position = 0;
    this.root = task;
    this.stack = [];
    this.mailbox = [];
    this.abortHandle = null;
    this.isActive = true;
    this.isPending = false;
    this.success = null;
    this.failure = null;
    this.succeed = null;
    this.fail = null;
    this.onSucceed = this.onSucceed.bind(this);
    this.onFail = this.onFail.bind(this);
  }

  _createClass(Process, [{
    key: 'onSucceed',
    value: function onSucceed(value) {
      if (this.isPending) {
        this.isPending = false;
        this.abortHandle = null;

        if (this.success != null) {
          this.success.value = value;
        } else {
          this.success = new Succeed(value);
        }

        this.root = this.success;
        this.schedule();
      }
    }
  }, {
    key: 'onFail',
    value: function onFail(error) {
      if (this.isPending) {
        this.isPending = false;
        this.abortHandle = null;

        if (this.failure != null) {
          this.failure.error = error;
        } else {
          this.failure = new Fail(error);
        }

        this.root = this.failure;
        this.schedule();
      }
    }
  }, {
    key: 'kill',
    value: function kill(reason) {
      if (this.isActive) {
        this.isActive = false;
        if (this.root.abort) {
          this.root.abort(this.abortHandle);
        }
      }
    }
  }, {
    key: 'schedule',
    value: function schedule() {
      this.step();
    }
  }, {
    key: 'step',
    value: function step() {
      var process = this;
      while (process.isActive) {
        var task = process.root;
        if (task instanceof Succeed) {
          while (process.position < process.stack.length && process.stack[process.position] instanceof Catch) {
            process.position++;
          }

          if (process.position >= process.stack.length) {
            if (process.succeed != null) {
              process.succeed(task.value);
            }
            break;
          }

          var then = process.stack[process.position++];

          process.root = then.next(task.value);
          continue;
        }

        if (task instanceof Fail) {
          while (process.position < process.stack.length && process.stack[process.position] instanceof Then) {
            process.position++;
          }

          if (this.position >= process.stack.length) {
            if (process.fail != null) {
              process.fail(task.error);
            }
            break;
          }

          var _catch = process.stack[process.position++];

          process.root = _catch.handle(task.error);
          continue;
        }

        if (task instanceof Then) {
          if (process.position === 0) {
            process.stack.unshift(task);
          } else {
            process.stack[--process.position] = task;
          }

          process.root = task.task;

          continue;
        }

        if (task instanceof Catch) {
          if (process.position === 0) {
            process.stack.unshift(task);
          } else {
            process.stack[--process.position] = task;
          }

          process.root = task.task;

          continue;
        }

        if (task instanceof Task) {
          process.isPending = true;
          process.abortHandle = task.fork(process.onSucceed, process.onFail);
          break;
        }
      }
    }
  }]);

  return Process;
}();

},{"./preemptive-animation-frame":66}],69:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var hasProp = {}.hasOwnProperty,
    slice = [].slice;

  module.exports = function(source, scope) {
    var key, keys, value, values;
    keys = [];
    values = [];
    for (key in scope) {
      if (!hasProp.call(scope, key)) continue;
      value = scope[key];
      if (key === 'this') {
        continue;
      }
      keys.push(key);
      values.push(value);
    }
    return Function.apply(null, slice.call(keys).concat([source])).apply(scope["this"], values);
  };

}).call(this);

},{}],70:[function(require,module,exports){
(function (factory) {
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals (with support for web workers)
        var glob;

        try {
            glob = window;
        } catch (e) {
            glob = self;
        }

        glob.SparkMD5 = factory();
    }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));

},{}],71:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":75}],72:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":90}],73:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":78}],74:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":83,"is-object":23}],75:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":81,"../vnode/is-vnode.js":84,"../vnode/is-vtext.js":85,"../vnode/is-widget.js":86,"./apply-properties":74,"global/document":20}],76:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],77:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":86,"../vnode/vpatch.js":88,"./apply-properties":74,"./update-widget":79}],78:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":75,"./dom-index":76,"./patch-op":77,"global/document":20,"x-is-array":93}],79:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":86}],80:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],81:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":82,"./is-vnode":84,"./is-vtext":85,"./is-widget":86}],82:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],83:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],84:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":87}],85:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":87}],86:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],87:[function(require,module,exports){
module.exports = "2"

},{}],88:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":87}],89:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":83,"is-object":23}],90:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":81,"../vnode/is-thunk":82,"../vnode/is-vnode":84,"../vnode/is-vtext":85,"../vnode/is-widget":86,"../vnode/vpatch":88,"./diff-props":89,"x-is-array":93}],91:[function(require,module,exports){
'use strict';

/**
 * Stringify/parse functions that don't operate
 * recursively, so they avoid call stack exceeded
 * errors.
 */
exports.stringify = function stringify(input) {
  var queue = [];
  queue.push({obj: input});

  var res = '';
  var next, obj, prefix, val, i, arrayPrefix, keys, k, key, value, objPrefix;
  while ((next = queue.pop())) {
    obj = next.obj;
    prefix = next.prefix || '';
    val = next.val || '';
    res += prefix;
    if (val) {
      res += val;
    } else if (typeof obj !== 'object') {
      res += typeof obj === 'undefined' ? null : JSON.stringify(obj);
    } else if (obj === null) {
      res += 'null';
    } else if (Array.isArray(obj)) {
      queue.push({val: ']'});
      for (i = obj.length - 1; i >= 0; i--) {
        arrayPrefix = i === 0 ? '' : ',';
        queue.push({obj: obj[i], prefix: arrayPrefix});
      }
      queue.push({val: '['});
    } else { // object
      keys = [];
      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      queue.push({val: '}'});
      for (i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        value = obj[key];
        objPrefix = (i > 0 ? ',' : '');
        objPrefix += JSON.stringify(key) + ':';
        queue.push({obj: value, prefix: objPrefix});
      }
      queue.push({val: '{'});
    }
  }
  return res;
};

// Convenience function for the parse function.
// This pop function is basically copied from
// pouchCollate.parseIndexableString
function pop(obj, stack, metaStack) {
  var lastMetaElement = metaStack[metaStack.length - 1];
  if (obj === lastMetaElement.element) {
    // popping a meta-element, e.g. an object whose value is another object
    metaStack.pop();
    lastMetaElement = metaStack[metaStack.length - 1];
  }
  var element = lastMetaElement.element;
  var lastElementIndex = lastMetaElement.index;
  if (Array.isArray(element)) {
    element.push(obj);
  } else if (lastElementIndex === stack.length - 2) { // obj with key+value
    var key = stack.pop();
    element[key] = obj;
  } else {
    stack.push(obj); // obj with key only
  }
}

exports.parse = function (str) {
  var stack = [];
  var metaStack = []; // stack for arrays and objects
  var i = 0;
  var collationIndex,parsedNum,numChar;
  var parsedString,lastCh,numConsecutiveSlashes,ch;
  var arrayElement, objElement;
  while (true) {
    collationIndex = str[i++];
    if (collationIndex === '}' ||
        collationIndex === ']' ||
        typeof collationIndex === 'undefined') {
      if (stack.length === 1) {
        return stack.pop();
      } else {
        pop(stack.pop(), stack, metaStack);
        continue;
      }
    }
    switch (collationIndex) {
      case ' ':
      case '\t':
      case '\n':
      case ':':
      case ',':
        break;
      case 'n':
        i += 3; // 'ull'
        pop(null, stack, metaStack);
        break;
      case 't':
        i += 3; // 'rue'
        pop(true, stack, metaStack);
        break;
      case 'f':
        i += 4; // 'alse'
        pop(false, stack, metaStack);
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '-':
        parsedNum = '';
        i--;
        while (true) {
          numChar = str[i++];
          if (/[\d\.\-e\+]/.test(numChar)) {
            parsedNum += numChar;
          } else {
            i--;
            break;
          }
        }
        pop(parseFloat(parsedNum), stack, metaStack);
        break;
      case '"':
        parsedString = '';
        lastCh = void 0;
        numConsecutiveSlashes = 0;
        while (true) {
          ch = str[i++];
          if (ch !== '"' || (lastCh === '\\' &&
              numConsecutiveSlashes % 2 === 1)) {
            parsedString += ch;
            lastCh = ch;
            if (lastCh === '\\') {
              numConsecutiveSlashes++;
            } else {
              numConsecutiveSlashes = 0;
            }
          } else {
            break;
          }
        }
        pop(JSON.parse('"' + parsedString + '"'), stack, metaStack);
        break;
      case '[':
        arrayElement = { element: [], index: stack.length };
        stack.push(arrayElement.element);
        metaStack.push(arrayElement);
        break;
      case '{':
        objElement = { element: {}, index: stack.length };
        stack.push(objElement.element);
        metaStack.push(objElement);
        break;
      default:
        throw new Error(
          'unexpectedly reached end of input: ' + collationIndex);
    }
  }
};

},{}],92:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],93:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],94:[function(require,module,exports){
module.exports={
  "api": "{{root_url}}:5000/api/0.0.1",
  "origin": "{{root_url}}:5984",
  "heartbeat": "{{root_url}}:5984",

  "active_environment": "environment_1",
  "start_recipe_url": "{{api_url}}/service/{{environment}}/start_recipe",

  "environmental_data_point": {
    "local": "environmental_data_point",
    "origin": "{{origin_url}}/environmental_data_point",
    "origin_latest": "{{origin_url}}/environmental_data_point/_design/openag/_view/by_variable?group_level=3&startkey={{startkey}}&endkey={{endkey}}",
    "origin_range": "{{origin_url}}/environmental_data_point/_design/openag/_view/by_timestamp?startkey={{startkey}}&endkey={{endkey}}&limit={{limit}}&descending={{descending}}&stale=update_after",
    "origin_range_csv": "{{origin_url}}/environmental_data_point/_design/openag/_list/csv/by_timestamp?startkey={{startkey}}&endkey={{endkey}}&limit={{limit}}&descending={{descending}}&stale=update_after",
    "origin_by_variable_csv": "{{origin_url}}/environmental_data_point/_design/openag/_list/csv/by_variable?group_level={{group_level}}&startkey={{startkey}}&endkey={{endkey}}&limit={{limit}}&descending={{descending}}&stale=update_after"
  },

  "recipes": {
    "local": "recipes",
    "origin": "{{origin_url}}/recipes"
  },

  "environments": {
    "local": "environment",
    "origin": "{{origin_url}}/environment"
  },

  "app": {
    "local": "openag",
    "state_id": "state"
  },

  "chart": [
    {
      "variable": "light_illuminance",
      "title": "Light",
      "unit": " Lux",
      "color": "#ffc500",
      "min": 0.0001,
      "max": 100000
    },
    {
      "variable": "air_temperature",
      "title": "Temperature",
      "unit": "\u00B0",
      "min": 7.2,
      "max": 48.8,
      "color": "#ff8300"
    },
    {
      "variable": "water_temperature",
      "title": "Water Temperature",
      "unit": "\u00B0",
      "min": 7.2,
      "max": 48.8,
      "color": "#0052b3"
    },
    {
      "variable": "water_electrical_conductivity",
      "title": "EC",
      "unit": " mS/cm",
      "color": "#AB36B2",
      "min": 0,
      "max": 4
    },
    {
      "variable": "water_potential_hydrogen",
      "title": "pH",
      "unit": "",
      "color": "#5ada00",
      "min": 4,
      "max": 10
    },
    {
      "variable": "air_humidity",
      "title": "Humidity",
      "unit": "%",
      "min": 0,
      "max": 100,
      "color": "#00a5ed"
    }
  ]
}

},{}],95:[function(require,module,exports){
module.exports={
  "name": "openag-ui",
  "version": "0.0.1",
  "description": "UI for OpenAg Food Computers",
  "main": "src/main.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/OpenAgInitiative/openag-ui.git",
    "web": "https://github.com/OpenAgInitiative/openag-ui"
  },
  "bugs": {
    "url": "https://github.com/OpenAgInitiative/openag-ui/issues"
  },
  "dependencies": {
    "d3-array": "^1.0.0",
    "d3-scale": "^1.0.2",
    "d3-shape": "^1.0.1",
    "d3-time": "^1.0.1",
    "d3-time-format": "^2.0.1",
    "pouchdb-browser": "^5.4.5",
    "querystring": "^0.2.0",
    "reflex": "^0.4.1",
    "reflex-virtual-dom-driver": "^0.2.0",
    "whatwg-fetch": "^1.0.0"
  },
  "devDependencies": {
    "babel-cli": "^6.7.5",
    "babel-preset-es2015": "^6.6.0",
    "babelify": "^7.2.0",
    "browserify": "^13.0.0",
    "grunt": "^1.0.1",
    "grunt-browserify": "^5.0.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-watch": "^1.0.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "grunt build",
    "develop": "grunt develop",
    "watch": "grunt watch"
  },
  "keywords": [
    "openag",
    "food",
    "computer"
  ],
  "author": "OpenAg Agrinauts",
  "license": "GPL-3.0"
}

},{}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _prelude = require('./common/prelude');

var _package = require('../package.json');

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _lang = require('./common/lang');

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _cursor = require('./common/cursor');

var _stache = require('./common/stache');

var Template = _interopRequireWildcard(_stache);

var _url = require('./common/url');

var _request = require('./common/request');

var Request = _interopRequireWildcard(_request);

var _banner = require('./common/banner');

var Banner = _interopRequireWildcard(_banner);

var _persistence = require('./persistence');

var Persistence = _interopRequireWildcard(_persistence);

var _nav = require('./app/nav');

var AppNav = _interopRequireWildcard(_nav);

var _environments = require('./environments');

var Environments = _interopRequireWildcard(_environments);

var _environment = require('./environment');

var Environment = _interopRequireWildcard(_environment);

var _recipes = require('./recipes');

var Recipes = _interopRequireWildcard(_recipes);

var _firstTimeUse = require('./first-time-use');

var Settings = _interopRequireWildcard(_firstTimeUse);

var _functional = require('./lang/functional');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// State ID is the id of the pouch record we use to persist state.
var STATE_ID = Config.app.state_id;

// Actions and tagging functions

var Configure = function Configure(value) {
  return {
    type: 'Configure',
    value: value
  };
};

// Sent when First Run Experience is successfully completed.
var ConfigureFirstTime = function ConfigureFirstTime(form) {
  return {
    type: 'ConfigureFirstTime',
    form: form
  };
};

// Update address of Food Computer.
var UpdateAddress = function UpdateAddress(url) {
  return {
    type: 'UpdateAddress',
    url: url
  };
};

var TagFirstTimeUse = function TagFirstTimeUse(action) {
  return action.type === 'NotifySubmit' ? ConfigureFirstTime(action.form) : (0, _prelude.tagged)('FirstTimeUse', action);
};

var OpenFirstTimeUse = TagFirstTimeUse(Settings.Open);
var CloseFirstTimeUse = TagFirstTimeUse(Settings.Close);

var TagPersistence = function TagPersistence(action) {
  return action.type === 'NotifyRestore' ? Configure(action.value) :
  // If we were notified of any errors, forward them to the banner module.
  action.type === 'NotifyBanner' ? AlertRefreshableBanner(action.message) : action.type === 'NotifyFirstTimeUse' ? OpenFirstTimeUse : (0, _prelude.tagged)('Persistence', action);
};

var GetState = TagPersistence(Persistence.GetState);
var PutState = (0, _functional.compose)(TagPersistence, Persistence.PutState);

// Request a state put.
var SaveState = { type: 'SaveState' };

var TagRecipes = function TagRecipes(action) {
  return action.type === 'RequestStart' ? StartRecipe(action.value) : (0, _prelude.tagged)('Recipes', action);
};

var ConfigureRecipes = (0, _functional.compose)(TagRecipes, Recipes.Configure);

var OpenRecipes = TagRecipes(Recipes.Open);
var CloseRecipes = TagRecipes(Recipes.Close);

var TagEnvironments = function TagEnvironments(action) {
  return (0, _prelude.tagged)('Environments', action);
};

var ConfigureEnvironments = (0, _functional.compose)(TagEnvironments, Environments.Configure);

var TagEnvironment = function TagEnvironment(action) {
  return action.type === 'AlertBanner' ? AlertRefreshableBanner(action.source) : action.type === 'RequestOpenRecipes' ? OpenRecipes : (0, _prelude.tagged)('Environment', action);
};

var ConfigureEnvironment = (0, _functional.compose)(TagEnvironment, Environment.Configure);
var SetRecipeForEnvironment = (0, _functional.compose)(TagEnvironment, Environment.SetRecipe);

var TagAppNav = function TagAppNav(action) {
  return (0, _prelude.tagged)('AppNav', action);
};

var ConfigureAppNav = (0, _functional.compose)(TagAppNav, AppNav.Configure);

var TagBanner = (0, _prelude.tag)('Banner');
var AlertBanner = (0, _functional.compose)(TagBanner, Banner.Alert);
var AlertRefreshableBanner = (0, _functional.compose)(TagBanner, Banner.AlertRefreshable);
var AlertDismissableBanner = (0, _functional.compose)(TagBanner, Banner.AlertRefreshable);

var StartRecipe = function StartRecipe(value) {
  return {
    type: 'StartRecipe',
    value: value
  };
};

var CreateRecipe = function CreateRecipe(recipe) {
  return {
    type: 'CreateRecipe',
    recipe: recipe
  };
};

var PostRecipe = function PostRecipe(environmentID, recipeID) {
  return {
    type: 'PostRecipe',
    recipeID: recipeID,
    environmentID: environmentID
  };
};

var RecipePosted = function RecipePosted(result) {
  return {
    type: 'RecipePosted',
    result: result
  };
};

// Init and update

var init = exports.init = function init() {
  // @FIXME we hardcode active environment for the moment. This should be
  // kept in an environments db instead.
  var activeEnvironment = Config.active_environment;

  var _Environment$init = Environment.init(activeEnvironment);

  var _Environment$init2 = _slicedToArray(_Environment$init, 2);

  var environment = _Environment$init2[0];
  var environmentFx = _Environment$init2[1];

  var _Environments$init = Environments.init();

  var _Environments$init2 = _slicedToArray(_Environments$init, 2);

  var environments = _Environments$init2[0];
  var environmentsFx = _Environments$init2[1];

  var _Recipes$init = Recipes.init();

  var _Recipes$init2 = _slicedToArray(_Recipes$init, 2);

  var recipes = _Recipes$init2[0];
  var recipesFx = _Recipes$init2[1];

  var _AppNav$init = AppNav.init();

  var _AppNav$init2 = _slicedToArray(_AppNav$init, 2);

  var appNav = _AppNav$init2[0];
  var appNavFx = _AppNav$init2[1];

  var _Banner$init = Banner.init();

  var _Banner$init2 = _slicedToArray(_Banner$init, 2);

  var banner = _Banner$init2[0];
  var bannerFx = _Banner$init2[1];

  var _Settings$init = Settings.init();

  var _Settings$init2 = _slicedToArray(_Settings$init, 2);

  var firstTimeUse = _Settings$init2[0];
  var firstTimeUseFx = _Settings$init2[1];


  return [{
    // Tag model with _id and _rev for PouchDB. Handled in persistence module
    // update function.
    // _id is used to retreive the app state record.
    _id: STATE_ID,
    // These fields are restored from the local PouchDB settings database.
    _rev: null,
    api: null,
    origin: null,
    // Tag model with version from package.json. We use this with
    // persistence module to make sure we're loading a state in a schema
    // we understand.
    version: _package.version,

    // Store submodule states.
    environment: environment,
    environments: environments,
    recipes: recipes,
    appNav: appNav,
    banner: banner,
    firstTimeUse: firstTimeUse
  }, _reflex.Effects.batch([_reflex.Effects.receive(GetState), environmentFx.map(TagEnvironment), environmentsFx.map(TagEnvironments), recipesFx.map(TagRecipes), appNavFx.map(TagAppNav), bannerFx.map(TagBanner), firstTimeUseFx.map(TagFirstTimeUse)])];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Environment' ? updateEnvironment(model, action.source) : action.type === 'Recipes' ? updateRecipes(model, action.source) : action.type === 'AppNav' ? updateAppNav(model, action.source) : action.type === 'Banner' ? updateBanner(model, action.source) : action.type === 'Persistence' ? updatePersistence(model, action.source) : action.type === 'FirstTimeUse' ? updateFirstTimeUse(model, action.source) : action.type === 'Environments' ? updateEnvironments(model, action.source) :

  // Specialized update functions
  action.type === 'Configure' ? configure(model, action.value) : action.type === 'ConfigureFirstTime' ? configureFirstTime(model, action.form) : action.type === 'StartRecipe' ? startRecipe(model, action.value) : action.type === 'PostRecipe' ? postRecipe(model, action.environmentID, action.recipeID) : action.type === 'RecipePosted' ? action.result.isOk ? recipePostedOk(model, action.result.value) : recipePostedError(model, action.result.error) : action.type === 'SaveState' ? saveState(model) : Unknown.update(model, action);
};

var updatePersistence = (0, _cursor.cursor)({
  update: Persistence.update,
  tag: TagPersistence
});

var updateFirstTimeUse = (0, _cursor.cursor)({
  get: function get(model) {
    return model.firstTimeUse;
  },
  set: function set(model, firstTimeUse) {
    return (0, _prelude.merge)(model, { firstTimeUse: firstTimeUse });
  },
  update: Settings.update,
  tag: TagFirstTimeUse
});

var updateAppNav = (0, _cursor.cursor)({
  get: function get(model) {
    return model.appNav;
  },
  set: function set(model, appNav) {
    return (0, _prelude.merge)(model, { appNav: appNav });
  },
  update: AppNav.update,
  tag: TagAppNav
});

var updateBanner = (0, _cursor.cursor)({
  get: function get(model) {
    return model.banner;
  },
  set: function set(model, banner) {
    return (0, _prelude.merge)(model, { banner: banner });
  },
  update: Banner.update,
  tag: TagBanner
});

var updateRecipes = (0, _cursor.cursor)({
  get: function get(model) {
    return model.recipes;
  },
  set: function set(model, recipes) {
    return (0, _prelude.merge)(model, { recipes: recipes });
  },
  update: Recipes.update,
  tag: TagRecipes
});

var updateEnvironment = (0, _cursor.cursor)({
  get: function get(model) {
    return model.environment;
  },
  set: function set(model, environment) {
    return (0, _prelude.merge)(model, { environment: environment });
  },
  update: Environment.update,
  tag: TagEnvironment
});

var updateEnvironments = (0, _cursor.cursor)({
  get: function get(model) {
    return model.environments;
  },
  set: function set(model, environments) {
    return (0, _prelude.merge)(model, { environments: environments });
  },
  update: Environments.update,
  tag: TagEnvironments
});

var startRecipe = function startRecipe(model, recipe) {
  return (0, _prelude.batch)(update, model, [SetRecipeForEnvironment(recipe), PostRecipe(model.environment.id, recipe._id), CloseRecipes]);
};

var postRecipe = function postRecipe(model, environmentID, recipeID) {
  var url = Template.render(Config.start_recipe_url, {
    api_url: model.api,
    environment: environmentID
  });

  return [model, Request.post(url, { data: recipeID }).map(RecipePosted)];
};

// We do nothing for successful recipe posts. This may change in future.
var recipePostedOk = function recipePostedOk(model, value) {
  return [model, _reflex.Effects.none];
};

var recipePostedError = function recipePostedError(model, error) {
  var message = (0, _lang.localize)('Food computer was unable to start recipe');
  return update(model, AlertRefreshableBanner(message));
};

var configureFirstTime = function configureFirstTime(model, form) {
  // 1. First send configure actions to the module and submodule.
  // 2. Then serialize and store the configuration in PouchDB with Putstate.

  // Construct a faux record of the same shape we would get back from the db.
  var record = serialize({
    // Use any of this information if already on the model (_id and _rev)
    // should be empty.
    _id: model._id,
    _rev: model._rev,
    version: model.version,

    // This comes from the FTU.
    api: form.api,
    origin: form.origin,
    environment: {
      id: form.environment.id,
      name: form.environment.name
    }
  });

  return (0, _prelude.batch)(update, model, [
  // Send the configuration info to in-memory model.
  // This is the action we would typically send after getting back record from
  // local DB.
  Configure(record),
  // Close FTU
  CloseFirstTimeUse,
  // Save updated model to local database.
  SaveState]);
};

var configure = function configure(model, _ref) {
  var api = _ref.api;
  var origin = _ref.origin;
  var environment = _ref.environment;

  // Restore serialized data from stored record.
  // Merge into in-memory app model.
  var next = (0, _prelude.merge)(model, {
    api: api,
    origin: origin
  });

  return (0, _prelude.batch)(update, next, [ConfigureAppNav(environment.name), ConfigureEnvironment(environment.id, environment.name, origin), ConfigureEnvironments(origin), ConfigureRecipes(origin)]);
};

var saveState = function saveState(model) {
  // Serialize the model and Put it.
  var record = serialize(model);
  return update(model, PutState(record));
};

// Serialize data stored in persistence module.
var serialize = function serialize(model) {
  return {
    _id: model._id,
    _rev: model._rev,
    version: model.version,
    api: model.api,
    origin: model.origin,
    environment: Environment.serialize(model.environment)
  };
};

// View

var view = exports.view = function view(model, address) {
  return model.origin ? viewConfigured(model, address) : viewFTU(model, address);
};

var viewFTU = function viewFTU(model, address) {
  return _reflex.html.div({
    className: 'app-main'
  }, [(0, _reflex.thunk)('first-time-use', Settings.viewFTU, model.firstTimeUse, (0, _reflex.forward)(address, TagFirstTimeUse))]);
};

var viewConfigured = function viewConfigured(model, address) {
  return _reflex.html.div({
    className: 'app-main app-main--ready'
  }, [(0, _reflex.thunk)('app-nav', AppNav.view, model.appNav, (0, _reflex.forward)(address, TagAppNav)), (0, _reflex.thunk)('banner', Banner.view, model.banner, (0, _reflex.forward)(address, TagBanner), 'global-banner'), (0, _reflex.thunk)('environment', Environment.view, model.environment, (0, _reflex.forward)(address, TagEnvironment)), (0, _reflex.thunk)('recipes', Recipes.view, model.recipes, (0, _reflex.forward)(address, TagRecipes))]);
};

},{"../openag-config.json":94,"../package.json":95,"./app/nav":97,"./common/banner":99,"./common/cursor":102,"./common/lang":109,"./common/prelude":114,"./common/request":115,"./common/stache":119,"./common/unknown":121,"./common/url":122,"./environment":127,"./environments":133,"./first-time-use":134,"./lang/functional":136,"./persistence":138,"./recipes":140,"reflex":65}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Configure = undefined;

var _reflex = require('reflex');

var _prelude = require('../common/prelude');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _attr = require('../common/attr');

var _lang = require('../common/lang');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Configure settings (usually comes from parent who read it from local DB).
var Configure = exports.Configure = function Configure(name) {
  return {
    type: 'Configure',
    name: name
  };
};

var init = exports.init = function init() {
  return [{
    name: null
  }, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Configure' ? [(0, _prelude.merge)(model, { name: action.name }), _reflex.Effects.none] : Unknown.update(model, action);
};

var readName = function readName(model) {
  return typeof model.name === 'string' ? model.name : '-';
};

var view = exports.view = function view(model, address) {
  return _reflex.html.div({
    className: 'nav-main'
  }, [_reflex.html.nav({
    className: 'nav-toolbar'
  }, [_reflex.html.a({
    className: 'nav-name'
  }, [readName(model)]), _reflex.html.a({
    className: (0, _attr.classed)({
      'ir': true,
      'nav-chart-icon': true,
      'nav-chart-icon-active': true
    })
  }, [(0, _lang.localize)('Chart')])])]);
};

},{"../common/attr":98,"../common/lang":109,"../common/prelude":114,"../common/unknown":121,"reflex":65}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var reducekv = function reducekv(object, step, value) {
  var keys = Object.keys(object);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    value = step(value, key, object[key]);
  }
  return value;
};

var addClassnameIfNeeded = function addClassnameIfNeeded(array, className, isSet) {
  if (isSet) {
    array.push(className);
  }
  return array;
};

// Helper for creating HTML classname strings.
var classed = exports.classed = function classed(descriptor) {
  return reducekv(descriptor, addClassnameIfNeeded, []).join(' ');
};

// Create an optional attribute.
// Usage:
//
//     {
//       hidden: toggle(!model.isOpen, 'hidden')
//     }
var toggle = exports.toggle = function toggle(isPresent, attrValue) {
  return (
    // Returning void(0) means return value won't create a field in the object.
    // This is important, because any value for the field will result in an
    // attribute with an empty string value, and in HTML5, all that is required
    // for many attributes is that the attribute exist.
    // Yes this is a gross workaround, but at least it's localized.
    isPresent ? attrValue : void 0
  );
};

},{}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Model = exports.Suppress = exports.AlertRefreshable = exports.AlertDismissable = exports.Alert = undefined;

var _reflex = require('reflex');

var _lang = require('../common/lang');

var Lang = _interopRequireWildcard(_lang);

var _prelude = require('../common/prelude');

var _attr = require('../common/attr');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*
                                                                                                                                                                                                                  An error banner for notifying the user of edge-case conditions.
                                                                                                                                                                                                                  */


// Actions

// Turn on banner with message
var Alert = exports.Alert = function Alert(message) {
  return {
    type: 'Alert',
    message: message
  };
};

// Turn on banner with message
var AlertDismissable = exports.AlertDismissable = function AlertDismissable(message) {
  return {
    type: 'AlertDismissable',
    message: message
  };
};

// Turn on banner with message and refresh button
var AlertRefreshable = exports.AlertRefreshable = function AlertRefreshable(message) {
  return {
    type: 'AlertRefreshable',
    message: message
  };
};

// Turn off banner, clear message
var Suppress = exports.Suppress = { type: 'Suppress' };

// Update, model, init
var SHOW = 'show';
var REFRESHABLE = 'refreshable';
var DISMISSABLE = 'dismissable';
var HIDE = 'hide';

var Model = exports.Model = function Model(mode, message) {
  return {
    mode: mode,
    message: message
  };
};

var swapShow = function swapShow(model, message) {
  return model.mode !== SHOW || model.message !== message ? Model(SHOW, message) : model;
};

var swapRefreshable = function swapRefreshable(model, message) {
  return model.mode !== REFRESHABLE || model.message !== message ? Model(REFRESHABLE, message) : model;
};

var swapDismissable = function swapDismissable(model, message) {
  return model.mode !== DISMISSABLE || model.message !== message ? Model(DISMISSABLE, message) : model;
};

// Convenient update functions for model
var swapSuppress = function swapSuppress(model) {
  return model.mode !== HIDE ? Model(HIDE, '') : model;
};

var init = exports.init = function init() {
  return [Model(HIDE, ''), _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Alert' ? (0, _prelude.nofx)(swapShow(model, action.message)) : action.type === 'AlertRefreshable' ? (0, _prelude.nofx)(swapRefreshable(model, action.message)) : action.type === 'AlertDismissable' ? (0, _prelude.nofx)(swapDismissable(model, action.message)) : action.type === 'Suppress' ? (0, _prelude.nofx)(swapSuppress(model)) : Unknown.update(model, action);
};

// View

var view = exports.view = function view(model, address, className) {
  return _reflex.html.div({
    className: (0, _attr.classed)(_defineProperty({
      'banner': true,
      // Hide banner if there is no message to show
      'banner--close': model.mode === HIDE
    }, className, true))
  }, [_reflex.html.div({
    className: 'banner--text'
  }, [model.message]), _reflex.html.a({
    className: (0, _attr.classed)({
      'banner-action': true,
      'banner-action--dismiss': true,
      'banner-action--close': model.mode !== DISMISSABLE
    }),
    onClick: function onClick(event) {
      event.preventDefault();
      address(Suppress);
    }
  }, [Lang.localize('Close')]), _reflex.html.a({
    className: (0, _attr.classed)({
      'banner-action': true,
      'banner-action--refresh': true,
      'banner-action--close': model.mode !== REFRESHABLE
    }),
    onClick: function onClick(event) {
      event.preventDefault();
      // Refresh and flip boolean to bypass page cache.
      document.location.reload(true);
    }
  }, [Lang.localize('Refresh')])]);
};

},{"../common/attr":98,"../common/lang":109,"../common/prelude":114,"../common/unknown":121,"reflex":65}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.press = exports.up = exports.down = exports.update = exports.init = exports.Out = exports.Over = exports.Deactivate = exports.Activate = exports.Enable = exports.Disable = exports.Up = exports.Click = exports.Down = exports.Model = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _prelude = require("../common/prelude");

var _attr = require("../common/attr");

var _unknown = require("../common/unknown");

var Unknown = _interopRequireWildcard(_unknown);

var _target = require("../common/target");

var Target = _interopRequireWildcard(_target);

var _focusable = require("../common/focusable");

var Focus = _interopRequireWildcard(_focusable);

var _control = require("../common/control");

var Control = _interopRequireWildcard(_control);

var _reflex = require("reflex");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from
https://github.com/browserhtml/browserhtml/blob/master/src/common/button.js
*/

var Model = exports.Model = function Model(label, isActive, control, target, focus) {
  _classCallCheck(this, Model);

  this.label = label;
  this.isActive = isActive;
  this.control = control;
  this.target = target;
  this.focus = focus;
};

var TagTarget = function TagTarget(action) {
  return {
    type: "Target",
    target: action
  };
};

var TagFocus = function TagFocus(action) {
  return {
    type: "Focus",
    focus: action
  };
};

var TagControl = function TagControl(action) {
  return {
    type: "Control",
    control: action
  };
};

var Down = exports.Down = { type: "Down" };
var Click = exports.Click = { type: "Click" };
var Up = exports.Up = { type: "Up" };
var Disable = exports.Disable = TagControl(Control.Disable);
var Enable = exports.Enable = TagControl(Control.Enable);
var Activate = exports.Activate = TagFocus(Focus.Focus);
var Deactivate = exports.Deactivate = TagFocus(Focus.Blur);
var Over = exports.Over = TagTarget(Target.Over);
var Out = exports.Out = TagTarget(Target.Out);

var init = exports.init = function init(label, isActive, isDisabled, isPointerOver, isFocused) {
  return assemble(label, isActive, Control.init(isDisabled), Target.init(isPointerOver), Focus.init(isFocused));
};

var assemble = function assemble(label, isActive, _ref, _ref2, _ref3) {
  var _ref6 = _slicedToArray(_ref, 2);

  var control = _ref6[0];
  var controlFx = _ref6[1];

  var _ref5 = _slicedToArray(_ref2, 2);

  var target = _ref5[0];
  var targetFx = _ref5[1];

  var _ref4 = _slicedToArray(_ref3, 2);

  var focus = _ref4[0];
  var focusFx = _ref4[1];
  return [new Model(label, isActive, control, target, focus), _reflex.Effects.batch([controlFx.map(TagControl), targetFx.map(TagTarget), focusFx.map(TagFocus)])];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case "Down":
      return down(model);
    case "Up":
      return up(model);
    case "Click":
      return press(model);
    case "Control":
      return delegateControlUpdate(model, action.control);
    case "Target":
      return delegateTargetUpdate(model, action.target);
    case "Focus":
      return delegateFocusUpdate(model, action.focus);
    default:
      return Unknown.update(model, action);
  }
};

var down = exports.down = function down(model) {
  return (0, _prelude.nofx)(new Model(model.label, true, model.control, model.target, model.focus));
};

var up = exports.up = function up(model) {
  return (0, _prelude.nofx)(new Model(model.label, false, model.control, model.target, model.focus));
};

var press = exports.press = function press(model) {
  return (0, _prelude.nofx)(model);
};

var delegateControlUpdate = function delegateControlUpdate(model, action) {
  return swapControl(model, Control.update(model.control, action));
};

var swapControl = function swapControl(model, _ref7) {
  var _ref8 = _slicedToArray(_ref7, 2);

  var control = _ref8[0];
  var fx = _ref8[1];
  return [new Model(model.label, model.isActive, control, model.target, model.focus), fx.map(TagControl)];
};

var delegateTargetUpdate = function delegateTargetUpdate(model, action) {
  return swapTarget(model, Target.update(model.target, action));
};

var swapTarget = function swapTarget(model, _ref9) {
  var _ref10 = _slicedToArray(_ref9, 2);

  var target = _ref10[0];
  var fx = _ref10[1];
  return [new Model(model.label, model.isActive, model.control, target, model.focus), fx.map(TagTarget)];
};

var delegateFocusUpdate = function delegateFocusUpdate(model, action) {
  return swapFocus(model, Focus.update(model.focus, action));
};

var swapFocus = function swapFocus(model, _ref11) {
  var _ref12 = _slicedToArray(_ref11, 2);

  var focus = _ref12[0];
  var fx = _ref12[1];
  return [new Model(model.label, model.isActive, model.control, model.target, focus), fx.map(TagFocus)];
};

var view = exports.view = function view(model, address, className) {
  return _reflex.html.button({
    className: (0, _attr.classed)(_defineProperty({
      'button': true
    }, className, true)),
    disabled: (0, _attr.toggle)('disabled', model.control.isDisabled),
    onFocus: function onFocus() {
      return address(Activate);
    },
    onBlur: function onBlur() {
      return address(Deactivate);
    },
    onMouseOver: function onMouseOver() {
      return address(Over);
    },
    onMouseOut: function onMouseOut() {
      return address(Out);
    },
    onMouseDown: function onMouseDown() {
      return address(Down);
    },
    onClick: function onClick() {
      return address(Click);
    },
    onMouseUp: function onMouseUp() {
      return address(Up);
    }
  }, [model.label]);
};

},{"../common/attr":98,"../common/control":101,"../common/focusable":106,"../common/prelude":114,"../common/target":120,"../common/unknown":121,"reflex":65}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = exports.disable = exports.enable = exports.update = exports.init = exports.Enable = exports.Disable = exports.Model = undefined;

var _prelude = require("../common/prelude");

var _unknown = require("../common/unknown");

var Unknown = _interopRequireWildcard(_unknown);

var _reflex = require("reflex");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                           * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                           * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from
https://github.com/browserhtml/browserhtml/blob/4be9d07a98dc4a2f7764be1f8576ad9485c5079b/src/common/control.js
*/

var Model = exports.Model = function Model(isDisabled) {
  _classCallCheck(this, Model);

  this.isDisabled = isDisabled;
};

Model.enabled = new Model(false);
Model.disabled = new Model(true);

var Disable = exports.Disable = { type: "Disable" };
var Enable = exports.Enable = { type: "Enable" };

var init = exports.init = function init() {
  var isDisabled = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
  return [isDisabled ? Model.disabled : Model.enabled, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case "Enable":
      return enable(model);
    case "Disable":
      return disable(model);
    case "Toggle":
      return toggle(model);
    default:
      return Unknown.update(model, action);
  }
};

var enable = exports.enable = function enable(model) {
  return [Model.enabled, _reflex.Effects.none];
};

var disable = exports.disable = function disable(model) {
  return [Model.disabled, _reflex.Effects.none];
};

var toggle = exports.toggle = function toggle(model) {
  return [model.isDisabled ? Model.enabled : Model.disabled, _reflex.Effects.none];
};

},{"../common/prelude":114,"../common/unknown":121,"reflex":65}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cursor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Original source from
https://github.com/browserhtml/browserhtml/blob/master/src/common/cursor.js
*/

var _reflex = require("reflex");

/*::
import type {Cursor} from "./cursor"
export type {Cursor}
*/

var cursor = /*::<from, to, in, out>*/
exports.cursor = function cursor(config /*:Cursor*/) /*:(model:from, action:in) => [from, Effects<out>]*/{
  var get = config.get;
  var set = config.set;
  var update = config.update;
  var tag = config.tag;

  return function (model, action) {
    var previous = get == null ? model : get(model, action);

    var _update = update(previous, action);

    var _update2 = _slicedToArray(_update, 2);

    var next = _update2[0];
    var fx = _update2[1];

    var state = set == null ? next : set(model, next);

    return [state, tag == null ? fx : fx.map(tag)];
  };
};

},{"reflex":65}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sync = exports.Synced = exports.Sync = exports.pull = exports.Pulled = exports.Pull = exports.push = exports.Pushed = exports.Push = exports.restore = exports.Restored = exports.Restore = exports.put = exports.Putted = exports.Put = exports.get = exports.Got = exports.Get = undefined;

var _reflex = require('reflex');

var _result = require('../common/result');

var Result = _interopRequireWildcard(_result);

var _functional = require('../lang/functional');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Get = exports.Get = function Get(id) {
  return {
    type: 'Get',
    id: id
  };
}; // Effect/action wrappers for common PouchDb operations

var Got = exports.Got = function Got(result) {
  return {
    type: 'Got',
    result: result
  };
};

var get = exports.get = function get(db, id) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    db.get(id).then(Result.ok, Result.error).then(succeed);
  }));
};

var Put = exports.Put = function Put(value) {
  return {
    type: 'Put',
    value: value
  };
};

// Apologies for the silly name
var Putted = exports.Putted = function Putted(result) {
  return {
    type: 'Putted',
    result: result
  };
};

var put = exports.put = function put(db, doc) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    db.put(doc).then(Result.ok, Result.error).then(succeed);
  }));
};

// Request a restore from database.
var Restore = exports.Restore = {
  type: 'Restore'
};

var Restored = exports.Restored = function Restored(result) {
  return {
    type: 'Restored',
    result: result
  };
};

// Mapping functions to just get the docs from an allDocs response.
var readDocFromRow = function readDocFromRow(row) {
  return row.doc;
};
var readDocs = function readDocs(database) {
  return database.rows.map(readDocFromRow);
};

// Request in-memory restore from DB
// Returns an effect.
var restore = exports.restore = function restore(db) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    db.allDocs({
      include_docs: true,
      // Filter out design documents
      // (this assumes our documents do not have uppercased IDs)
      // See http://stackoverflow.com/questions/25728903/pouchdb-exclude-design-documents-when-using-autogenerated-uuid.
      startkey: 'design_￿'
    }).then((0, _functional.compose)(Result.ok, readDocs), Result.error).then(succeed);
  }));
};

// Sync actions and effects
// See https://pouchdb.com/api.html#sync
// https://pouchdb.com/api.html#replication

// Request up-directional sync
var Push = exports.Push = {
  type: 'Push'
};

var Pushed = exports.Pushed = function Pushed(result) {
  return {
    type: 'Pushed',
    result: result
  };
};

var push = exports.push = function push(db, replica) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    // Pouch will throw an error from xhr if there is no internet connection.
    // @TODO find out why Pouch isn't catching these 404s within the promise.
    try {
      db.replicate.to(replica).then(Result.ok, Result.error).then(succeed);
    } catch (error) {
      succeed(Result.error(error));
    }
  }));
};

// Request down-directional sync
var Pull = exports.Pull = {
  type: 'Pull'
};

var Pulled = exports.Pulled = function Pulled(result) {
  return {
    type: 'Pulled',
    result: result
  };
};

var pull = exports.pull = function pull(db, replica) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    db.replicate.from(replica).then(Result.ok, Result.error).then(succeed);
  }));
};

// Request bi-directional sync
var Sync = exports.Sync = {
  type: 'Sync'
};

var Synced = exports.Synced = function Synced(result) {
  return {
    type: 'Synced',
    result: result
  };
};

var sync = exports.sync = function sync(db, replica) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    db.sync(replica).then(Result.ok, Result.error).then(succeed);
  }));
};

},{"../common/result":116,"../lang/functional":136,"reflex":65}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drag = exports.noOp = exports.release = exports.hold = exports.update = exports.Model = exports.NoOp = exports.Release = exports.Hold = exports.Drag = exports.Move = undefined;

var _reflex = require('reflex');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Actions and tagging functions

// Helper functions for showing and hiding model components.
var DRAGGING = true;

var Move = exports.Move = function Move(coords) {
  return {
    type: 'Move',
    coords: coords
  };
};

var Drag = exports.Drag = function Drag(coords) {
  return {
    type: 'Drag',
    coords: coords
  };
};

var Hold = exports.Hold = {
  type: 'Hold'
};

var Release = exports.Release = {
  type: 'Release'
};

var NoOp = exports.NoOp = {
  type: 'NoOp'
};

// Model and update

var Model = exports.Model = function Model(isDragging, coords) {
  return {
    isDragging: isDragging,
    coords: coords
  };
};

var update = exports.update = function update(model, action) {
  return action.type === 'NoOp' ? [model, _reflex.Effects.none] : action.type === 'Hold' ? !model.isDragging ? [Model(DRAGGING, model.coords), _reflex.Effects.none] : noOp(model) : action.type === 'Release' ? model.isDragging ? [Model(!DRAGGING, model.coords), _reflex.Effects.none] : noOp(model) : action.type === 'Drag' ? [Model(model.isDragging, action.coords), _reflex.Effects.none] : action.type === 'Move' ? model.isDragging ? drag(model, action.coords) : noOp(model) : Unknown.update(model, action);
};

var hold = exports.hold = function hold(model) {
  return update(model, Hold);
};

var release = exports.release = function release(model) {
  return update(model, Release);
};

var noOp = exports.noOp = function noOp(model) {
  return update(model, NoOp);
};

var drag = exports.drag = function drag(model, coords) {
  return update(model, Drag(coords));
};

},{"../common/unknown":121,"reflex":65}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readSelection = exports.readChange = exports.decodeSelectEvent = exports.decodeChangeEvent = exports.onChange = exports.onSelect = exports.update = exports.init = exports.clear = exports.change = exports.Change = exports.Select = exports.Clear = exports.Model = exports.Selection = undefined;

var _unknown = require("../common/unknown");

var Unknown = _interopRequireWildcard(_unknown);

var _reflex = require("reflex");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Selection = exports.Selection = function Selection(start, end, direction) {
  _classCallCheck(this, Selection);

  this.start = start;
  this.end = end;
  this.direction = direction;
};

var Model = exports.Model = function Model(value, selection) {
  _classCallCheck(this, Model);

  this.value = value;
  this.selection = selection;
};

Model.empty = new Model("", new Selection(0, 0, "none"));

// Actions

var Clear = exports.Clear = { type: "Clear" };

var Select = exports.Select = function Select(selection) {
  return { type: "Select",
    select: selection
  };
};

var Change = exports.Change = function Change(change) {
  return { type: "Change",
    change: change
  };
};

var select = function select(model, selection) {
  return [new Model(model.value, selection), _reflex.Effects.none];
};

var change = exports.change = function change(model, value, selection) {
  return [new Model(value, selection), _reflex.Effects.none];
};

var clear = exports.clear = function clear(model) {
  return [Model.empty, _reflex.Effects.none];
};

var init = exports.init = function init() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
  var selection = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  return [new Model(value, selection == null ? new Selection(value.length, value.length, "none") : selection), _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case "Clear":
      return clear(model);
    case "Select":
      return select(model, action.select);
    case "Change":
      return change(model, action.change.value, action.change.selection);
    default:
      return Unknown.update(model, action);
  }
};

var onSelect = exports.onSelect = function onSelect(address) {
  return (0, _reflex.forward)(address, decodeSelectEvent);
};

var onChange = exports.onChange = function onChange(address) {
  return (0, _reflex.forward)(address, decodeChangeEvent);
};

var decodeChangeEvent = exports.decodeChangeEvent = function decodeChangeEvent(event) {
  return { type: "Change",
    change: new Model(event.target.value, readSelection(event.target))
  };
};

var decodeSelectEvent = exports.decodeSelectEvent = function decodeSelectEvent(event) {
  return { type: "Select",
    select: readSelection(event.target)
  };
};

var readChange = exports.readChange = function readChange(value, selection) {
  return new Model(value, selection);
};

var readSelection = exports.readSelection = function readSelection(input) {
  return new Selection(input.selectionStart, input.selectionEnd, input.selectionDirection || 'none');
};

},{"../common/unknown":121,"reflex":65}],106:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onBlur = exports.onFocus = exports.blur = exports.focus = exports.update = exports.init = exports.Blur = exports.Focus = exports.Model = undefined;

var _prelude = require("../common/prelude");

var _functional = require("../lang/functional");

var _unknown = require("../common/unknown");

var Unknown = _interopRequireWildcard(_unknown);

var _reflex = require("reflex");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                           * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                           * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from
https://github.com/browserhtml/browserhtml/blob/master/src/common/focusable.js
*/

var Model = exports.Model = function Model(isFocused) {
  _classCallCheck(this, Model);

  this.isFocused = isFocused;
};

Model.focused = new Model(true);
Model.blurred = new Model(false);

var Focus = exports.Focus = { type: "Focus" };
var Blur = exports.Blur = { type: "Blur" };

var init = exports.init = function init(isFocused) {
  return [isFocused ? Model.focused : Model.blurred, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case "Focus":
      return focus(model);
    case "Blur":
      return blur(model);
    default:
      return Unknown.update(model, action);
  }
};

var focus = exports.focus = function focus(model) {
  return [Model.focused, _reflex.Effects.none];
};

var blur = exports.blur = function blur(model) {
  return [Model.blurred, _reflex.Effects.none];
};

var onFocus = exports.onFocus = (0, _prelude.port)((0, _functional.constant)(Focus));
var onBlur = exports.onBlur = (0, _prelude.port)((0, _functional.constant)(Blur));

},{"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],107:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateWithID = exports.update = exports.NoOp = exports.Reset = exports.Activate = exports.children = exports.add = exports.init = exports.Model = exports.getActive = exports.getByIndex = exports.pluckID = exports.indexByID = exports.getID = exports.getter = exports.listByKeys = exports.toArray = exports.indexWith = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _functional = require('../lang/functional');

var _prelude = require('../common/prelude');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                     * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                     * file, You can obtain one at http://mozilla.org/MPL/2.0/.
                                                                                                                                                                                                     */


// Build an index object from an array.
// Returns a new index object.
var indexWith = exports.indexWith = function indexWith(array, readKey) {
  var index = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var object = _step.value;

      // Derive key using `readKey`, then use it to assign value.
      index[readKey(object)] = object;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return index;
};

var toArray = exports.toArray = function toArray(object, compare) {
  var array = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(object)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      array.push(object[key]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  array.sort(compare);
  return array;
};

// Read an object to an array via a list of keys.
// The order of the values of the resulting array reflect the order of the keys.
// Returns an array.
var listByKeys = exports.listByKeys = function listByKeys(object, keys) {
  var ordered = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (object[key]) {
      ordered.push(object[key]);
    }
  }
  return ordered;
};

// Create a "getter" function that will get a particular key for an object.
var getter = exports.getter = function getter(key) {
  return function (object) {
    return object[key];
  };
};

var getID = exports.getID = getter('id');

var indexByID = exports.indexByID = function indexByID(array) {
  return indexWith(array, getID);
};
var pluckID = exports.pluckID = function pluckID(array) {
  return array.map(getID);
};

var getByIndex = exports.getByIndex = function getByIndex(model, i) {
  return model.entries[model.order[i]];
};
var getActive = exports.getActive = function getActive(model) {
  return model.entries[model.active];
};

// Create indexed model
var Model = exports.Model = function Model(models, active) {
  return {
    active: active,
    // Build an array of ordered recipe IDs
    order: pluckID(models),
    // Index all recipes by ID
    entries: indexByID(models)
  };
};

var init = exports.init = function init(active) {
  return [Model([], active), _reflex.Effects.none];
};

// Add a new indexed entry to model
var add = exports.add = function add(model, id, entry) {
  return (0, _prelude.merge)(model, {
    // Prepend new recipe id
    order: [id].concat(_toConsumableArray(model.order)),
    entries: (0, _prelude.merge)(model.entries, _defineProperty({}, id, entry))
  });
};

// Given a view function and an action tagging factory function, will return
// a view that will list out all sub-views.
var children = exports.children = function children(view, tagByID) {
  return function (model, address) {
    return model.order.map(function (id) {
      return (0, _reflex.thunk)(id, view, model.entries[id], (0, _reflex.forward)(address, tagBy(id), model.id === model.active));
    });
  };
};

var Activate = exports.Activate = function Activate(id) {
  return {
    type: 'Activate',
    id: id
  };
};

var Reset = exports.Reset = function Reset(entries) {
  return {
    type: 'Reset',
    entries: entries
  };
};

// An action representing "no further action".
var NoOp = exports.NoOp = {
  type: 'NoOp'
};

var AlwaysNoOp = (0, _functional.constant)(NoOp);

// @TODO handle other common indexed actions.
var update = exports.update = function update(model, action) {
  return action.type === 'NoOp' ? [model, action] : action.type === 'Activate' ? [(0, _prelude.merge)(model, { active: action.id }), _reflex.Effects.none] : action.type === 'Reset' ? [Model(action.entries, model.active), _reflex.Effects.none] : Unknown.update(model, action);
};

// Create an updateById function
var updateWithID = exports.updateWithID = function updateWithID(update, tag, model, id, action) {
  if (model.order.indexOf(id) < 0) {
    return [model, _reflex.Effects.task(Unknown.error('model with id: ' + id + ' is not found')).map(AlwaysNoOp)];
  } else {
    var _update = update(model.entries[id], action);

    var _update2 = _slicedToArray(_update, 2);

    var entry = _update2[0];
    var fx = _update2[1];

    return [(0, _prelude.merge)(model, { entries: (0, _prelude.merge)(model.entries, _defineProperty({}, id, entry)) }), fx.map(tag)];
  }
};

},{"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],108:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onBlur = exports.onFocus = exports.onSelect = exports.onChange = exports.viewTextarea = exports.view = exports.edit = exports.disable = exports.enable = exports.update = exports.init = exports.Disable = exports.Enable = exports.Deactivate = exports.Activate = exports.Clear = exports.Change = exports.Model = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _functional = require('../lang/functional');

var _prelude = require('../common/prelude');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _focusable = require('../common/focusable');

var Focus = _interopRequireWildcard(_focusable);

var _editable = require('../common/editable');

var Edit = _interopRequireWildcard(_editable);

var _control = require('../common/control');

var Control = _interopRequireWildcard(_control);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                           * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                           * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Adapted from
https://github.com/browserhtml/browserhtml/blob/master/src/common/text-input.js
*/

var Model = exports.Model = function Model(edit, focus, control, placeholder) {
  _classCallCheck(this, Model);

  this.edit = edit;
  this.focus = focus;
  this.control = control;
  this.placeholder = placeholder;
};

var EditAction = function EditAction(action) {
  return {
    type: "Edit",
    edit: action
  };
};

var FocusAction = function FocusAction(action) {
  return {
    type: "Focus",
    focus: action
  };
};

var ControlAction = function ControlAction(action) {
  return {
    type: "Control",
    control: action
  };
};

var Change = exports.Change = function Change(value, selection) {
  return EditAction(Edit.Change(Edit.readChange(value, selection)));
};
var Clear = exports.Clear = EditAction(Edit.Change(Edit.readChange('', null)));
var Activate = exports.Activate = FocusAction(Focus.Focus);
var Deactivate = exports.Deactivate = FocusAction(Focus.Blur);
var Enable = exports.Enable = ControlAction(Control.Enable);
var Disable = exports.Disable = ControlAction(Control.Disable);

var init = exports.init = function init() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var selection = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var placeholder = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var isDisabled = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
  var isFocused = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

  var _Edit$init = Edit.init(value, selection);

  var _Edit$init2 = _slicedToArray(_Edit$init, 2);

  var edit = _Edit$init2[0];
  var editFx = _Edit$init2[1];

  var _Control$init = Control.init(isDisabled);

  var _Control$init2 = _slicedToArray(_Control$init, 2);

  var control = _Control$init2[0];
  var controlFx = _Control$init2[1];

  var _Focus$init = Focus.init(isFocused);

  var _Focus$init2 = _slicedToArray(_Focus$init, 2);

  var focus = _Focus$init2[0];
  var focusFx = _Focus$init2[1];

  var model = new Model(edit, focus, control, placeholder);

  var fx = _reflex.Effects.batch([editFx.map(EditAction), focusFx.map(FocusAction), controlFx.map(ControlAction)]);

  return [model, fx];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case 'Edit':
      return delegateEditUpdate(model, action.edit);
    case 'Focus':
      return delegateFocusUpdate(model, action.focus);
    case 'Control':
      return delegateControlUpdate(model, action.control);
    default:
      return Unknown.update(model, action);
  }
};

var enable = exports.enable = function enable(model) {
  return delegateControlUpdate(model, Control.Enable);
};

var disable = exports.disable = function disable(model) {
  return delegateControlUpdate(model, Control.Disable);
};

var edit = exports.edit = function edit(model, value, selection) {
  return swapEdit(model, Edit.change(model.edit, value, selection));
};

var delegateEditUpdate = function delegateEditUpdate(model, action) {
  return swapEdit(model, Edit.update(model.edit, action));
};

var delegateFocusUpdate = function delegateFocusUpdate(model, action) {
  return swapFocus(model, Focus.update(model.focus, action));
};

var delegateControlUpdate = function delegateControlUpdate(model, action) {
  return swapControl(model, Control.update(model.control, action));
};

var swapEdit = function swapEdit(model, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var edit = _ref2[0];
  var fx = _ref2[1];
  return [new Model(edit, model.focus, model.control, model.placeholder), fx.map(EditAction)];
};

var swapFocus = function swapFocus(model, _ref3) {
  var _ref4 = _slicedToArray(_ref3, 2);

  var focus = _ref4[0];
  var fx = _ref4[1];
  return [new Model(model.edit, focus, model.control, model.placeholder), fx.map(FocusAction)];
};

var swapControl = function swapControl(model, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 2);

  var control = _ref6[0];
  var fx = _ref6[1];
  return [new Model(model.edit, model.focus, control, model.placeholder), fx.map(ControlAction)];
};

var view = exports.view = function view(model, address, className) {
  return _reflex.html.input({
    className: className,
    type: 'input',
    placeholder: model.placeholder,
    value: model.edit.value,
    disabled: model.control.isDisabled ? true : void 0,
    onInput: onChange(address),
    onKeyUp: onSelect(address),
    onSelect: onSelect(address),
    onFocus: onFocus(address),
    onBlur: onBlur(address)
  });
};

var viewTextarea = exports.viewTextarea = function viewTextarea(model, address, id, className) {
  return _reflex.html.textarea({
    id: id,
    className: className,
    placeholder: model.placeholder,
    disabled: model.control.isDisabled ? true : void 0,
    onInput: onChange(address),
    onKeyUp: onSelect(address),
    onSelect: onSelect(address),
    onFocus: onFocus(address),
    onBlur: onBlur(address)
  }, [model.edit.value]);
};

var onChange = exports.onChange = (0, _prelude.annotate)(Edit.onChange, EditAction);
var onSelect = exports.onSelect = (0, _prelude.annotate)(Edit.onSelect, EditAction);
var onFocus = exports.onFocus = (0, _prelude.annotate)(Focus.onFocus, FocusAction);
var onBlur = exports.onBlur = (0, _prelude.annotate)(Focus.onBlur, FocusAction);

},{"../common/control":101,"../common/editable":105,"../common/focusable":106,"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],109:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localizeTemplate = exports.localize = undefined;

var _stache = require('../common/stache');

var localize = exports.localize = function localize(text) {
  return text;
}; /*
   @FIXME this file is a placeholder. We need to actually load locale files and
   use them to output final localized string.
   */
var localizeTemplate = exports.localizeTemplate = function localizeTemplate(text, context) {
  return (0, _stache.render)(text, context);
};

},{"../common/stache":119}],110:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Maybe chaining for values that could be null.

var isSomething = exports.isSomething = function isSomething(x) {
  return x != null;
};

// Map a value with function if value is not null. Otherwise return null.
var map = exports.map = function map(v, a2b) {
  return isSomething(v) ? a2b(v) : null;
};
var or = exports.or = function or(v, fallback) {
  return isSomething(v) ? v : fallback;
};
var mapOr = exports.mapOr = function mapOr(v, a2b, fallback) {
  return or(map(v, a2b), fallback);
};

},{}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.close = exports.open = exports.Close = exports.Open = undefined;

var _reflex = require('reflex');

var _prelude = require('../common/prelude');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Open = exports.Open = {
  type: 'Open'
}; // Helper functions for showing and hiding model components.
var Close = exports.Close = {
  type: 'Close'
};

var open = exports.open = function open(model) {
  return update(model, Open);
};

var close = exports.close = function close(model) {
  return update(model, Close);
};

var update = exports.update = function update(model, action) {
  return action.type === 'Open' ? [(0, _prelude.merge)(model, { isOpen: true }), _reflex.Effects.none] : action.type === 'Close' ? [(0, _prelude.merge)(model, { isOpen: false }), _reflex.Effects.none] : Unknown.update(model, action);
};

},{"../common/prelude":114,"../common/unknown":121,"reflex":65}],112:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readValue = exports.view = exports.update = exports.assemble = exports.Model = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _control = require('../common/control');

var Control = _interopRequireWildcard(_control);

var _attr = require('../common/attr');

var _unknown = require('../common/unknown');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Actions

var TagControl = function TagControl(action) {
  return {
    type: "Control",
    control: action
  };
};

// Model

var Model = exports.Model = function Model(id, text, value, control) {
  _classCallCheck(this, Model);

  this.id = id;
  this.text = text;
  this.value = value;
  this.control = control;
};

var assemble = exports.assemble = function assemble(id, text, value, isDisabled) {
  return new Model(id, text != null ? text : id, value != null ? value : id, isDisabled ? Control.Model.disabled : Control.Model.enabled);
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case 'Control':
      return delegateControlUpdate(model, action.control);
    default:
      return (0, _unknown.update)(model, action);
  }
};

var delegateControlUpdate = function delegateControlUpdate(model, action) {
  return swapControl(model, Control.update(model.control, action));
};

var swapControl = function swapControl(model, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var control = _ref2[0];
  var fx = _ref2[1];
  return [new Model(model.id, model.text, model.value, control), fx.map(TagControl)];
};

// View

var view = exports.view = function view(model) {
  return _reflex.html.option({
    disabled: (0, _attr.toggle)('disabled', model.control.isDisabled),
    value: model.value
  }, [model.text]);
};

// Helpers

var readValue = exports.readValue = function readValue(option) {
  return option.value;
};

},{"../common/attr":98,"../common/control":101,"../common/unknown":121,"reflex":65}],113:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.init = exports.calcDelay = exports.schedule = exports.Miss = exports.Pong = exports.Ping = exports.Schedule = undefined;

var _reflex = require('reflex');

var _prelude = require('../common/prelude');

var _functional = require('../lang/functional');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Useful constants
var seconds = 1000;
var minutes = seconds * 60;
var MAX_DELAY = 10 * minutes;

// Actions and effects

var Schedule = exports.Schedule = function Schedule(delay) {
  return {
    type: 'Schedule',
    delay: delay
  };
};

var Ping = exports.Ping = {
  type: 'Ping'
};

var Pong = exports.Pong = {
  type: 'Pong'
};

var Miss = exports.Miss = {
  type: 'Miss'
};

// Send an action as an effect after a delay.
var schedule = exports.schedule = function schedule(action, time) {
  return _reflex.Effects.perform(_reflex.Task.sleep(time)).map((0, _functional.constant)(action));
};

var calcDelay = exports.calcDelay = function calcDelay(delay, misses) {
  return Math.min(delay + delay * misses, MAX_DELAY);
};

var init = exports.init = function init(timeout) {
  return [{
    timeout: timeout,
    misses: 0
  }, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Schedule' ? [model, schedule(Ping, action.delay)] : action.type === 'Miss' ? [(0, _prelude.merge)(model, {
    misses: model.misses + 1
  }), _reflex.Effects.receive(Schedule(calcDelay(model.timeout, model.misses)))] : action.type === 'Pong' ? [(0, _prelude.merge)(model, {
    misses: 0
  }), _reflex.Effects.receive(Schedule(calcDelay(model.timeout, model.misses)))] : action.type === 'Ping' ? [model, _reflex.Effects.none] : Unknown.update(model, action);
};

},{"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],114:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotate = exports.port = exports.nofx = exports.tag = exports.tagged = exports.batch = exports.merge = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * file, You can obtain one at http://mozilla.org/MPL/2.0/.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
/*
Commonly used functions. Original source can be found here.
https://github.com/browserhtml/browserhtml/blob/master/src/common/prelude.js
*/


var _reflex = require('reflex');

var merge = /*::<model:{}>*/
exports.merge = function merge(model /*:model*/
, changes /*:{[key:string]: any}*/
) /*:model*/{
  var result = model;
  for (var key in changes) {
    if (changes.hasOwnProperty(key)) {
      var value = changes[key];

      if (model[key] !== value) {
        if (result === model) {
          result = {};
          for (var _key in model) {
            if (model.hasOwnProperty(_key)) {
              result[_key] = model[_key];
            }
          }
        }

        if (value === void 0) {
          delete result[key];
        } else {
          result[key] = value;
        }
      }
    }
  }

  // @FlowIssue: Ok just trust me on this!
  return result;
};

// Batch actions
// @TODO: Optimze batch by avoiding intermidiate states.
// batch performs a reduction over actions building up a [model, fx]
// pair containing all updates. In the process we create a intermidiate
// model instances that are threaded through updates cycles, there for
// we could implement clojure like `transient(model)` / `persistent(model)`
// that would mark `model` as mutable / immutable allowing `merge` to mutate
// in place if `modlel` is "mutable". `batch` here wolud be able to take
// advantage of these to update same model in place.
var batch = /*:: <model, action>*/
exports.batch = function batch(update /*:(m:model, a:action) => [model, Effects<action>]*/
, model /*:model*/
, actions /*:Array<action>*/
) /*:[model, Effects<action>]*/{
  var effects = [];
  var index = 0;
  var count = actions.length;
  while (index < count) {
    var action = actions[index];

    var _update = update(model, action);

    var _update2 = _slicedToArray(_update, 2);

    var state = _update2[0];
    var fx = _update2[1];

    model = state;
    effects.push(fx);
    index = index + 1;
  }

  return [model, _reflex.Effects.batch(effects)];
};

var tagged = /*::<tag:string, kind>*/
exports.tagged = function tagged(tag /*:tag*/, value /*:kind*/) {
  return (/*:Tagged<tag, kind>*/{ type: tag, source: value }
  );
};

var tag = /*::<tag:string, kind>*/
exports.tag = function tag(_tag /*:tag*/) {
  return (/*:(value:kind) => Tagged<tag, kind>*/function (value) {
      return { type: _tag, source: value };
    }
  );
};

// Return a model with no Effects.
var nofx = exports.nofx = function nofx(model) {
  return [model, _reflex.Effects.none];
};

// Create a forwarding function. Used by submodules to export pre-forwarded
// address functions.
var port = exports.port = function port(decoder) {
  return function (address) {
    return (0, _reflex.forward)(address, decoder);
  };
};

var annotate = exports.annotate = function annotate(port, tag) {
  return function (address) {
    return port((0, _reflex.forward)(address, tag));
  };
};

},{"reflex":65}],115:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = exports.get = exports.Posted = exports.Post = exports.Got = exports.Get = undefined;

require('whatwg-fetch');

var _reflex = require('reflex');

var _lang = require('../common/lang');

var _result = require('../common/result');

var Result = _interopRequireWildcard(_result);

var _functional = require('../lang/functional');

var _prelude = require('../common/prelude');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Actions

var Get = exports.Get = function Get(url) {
  return {
    type: 'Get',
    url: url
  };
};

var Got = exports.Got = function Got(result) {
  return {
    type: 'Got',
    result: result
  };
};

var Post = exports.Post = function Post(url) {
  return {
    type: 'Post',
    url: url
  };
};

var Posted = exports.Posted = function Posted(result) {
  return {
    type: 'Posted',
    result: result
  };
};

// Effects

// Read a Response object to JSON.
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
var readResponseJSON = function readResponseJSON(response) {
  return (
    // If HTTP request was successful.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch.
    response.ok ? response.json().then(Result.ok) : Promise.resolve(Result.error((0, _lang.localizeTemplate)('Connection problem (HTTP status {{status}})', {
      status: response.status
    })))
  );
};

var readFailure = function readFailure(error) {
  return Result.error((0, _lang.localize)('Uh-oh! No response from the server.'));
};

var getFetch = function getFetch(url) {
  var headers = new Headers({
    'Content-Type': 'application/json'
  });
  var request = new Request(url, {
    method: 'GET',
    headers: headers
  });
  return fetch(request).then(readResponseJSON, readFailure);
};

var postFetch = function postFetch(url, body) {
  var headers = new Headers({
    'Content-Type': 'application/json'
  });
  var request = new Request(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  return fetch(request).then(readResponseJSON, readFailure);
};

// Returns a get effect
// You'll want to use the `.map()` method on the return value to map this
// into an action.
var get = exports.get = function get(url) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    getFetch(url).then(succeed);
  }));
};

// Returns post effect
// You'll want to use the `.map()` method on the return value to map this
// into an action.
var post = exports.post = function post(url, body) {
  return _reflex.Effects.perform(new _reflex.Task(function (succeed) {
    postFetch(url, body).then(succeed);
  }));
};

},{"../common/lang":109,"../common/prelude":114,"../common/result":116,"../lang/functional":136,"reflex":65,"whatwg-fetch":92}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Original source can be found at:
https://github.com/browserhtml/browserhtml/blob/master/src/common/result.js
*/

/*::
import type {Result, Ok, Error} from "./result"
export type {Result, Ok, Error}
*/

var ok = /*::<value>*/
exports.ok = function ok(value /*:value*/) {
  return (/*:Ok<value>*/{ isOk: true,
      isError: false,
      value: value
    }
  );
};

var error = /*::<error>*/
exports.error = function error(_error /*:error*/) {
  return (/*:Error<error>*/{ isOk: false,
      isError: true,
      error: _error
    }
  );
};

// Given an ok and error update function,
// create an update function for results that will unbox the value.
var updater = exports.updater = function updater(ok, error) {
  return function (model, result) {
    return result.isOk ? ok(model, result.value) : error(model, result.error);
  };
};

},{}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = undefined;

var _querystring = require('querystring');

var QueryString = _interopRequireWildcard(_querystring);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Env = function Env() {
  var search = window.location.search;
  return QueryString.parse(search.substr(1));
}; /* This Source Code Form is subject to the terms of the Mozilla Public
    * License, v. 2.0. If a copy of the MPL was not distributed with this
    * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Adapted from https://github.com/browserhtml/browserhtml/blob/master/src/common/runtime.js */

var env = exports.env = Env();

},{"querystring":53}],118:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readValue = exports.decodeChangeEvent = exports.onChange = exports.view = exports.update = exports.init = exports.Change = exports.Options = exports.AppendOption = undefined;

var _reflex = require('reflex');

var _option = require('../common/option');

var Option = _interopRequireWildcard(_option);

var _attr = require('../common/attr');

var _prelude = require('../common/prelude');

var _unknown = require('../common/unknown');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Actions

var AppendOption = exports.AppendOption = function AppendOption(id, text, value, isDisabled) {
  return {
    type: 'AppendOption',
    option: Option.assemble(id, text, value, isDisabled)
  };
};

var Options = exports.Options = function Options(options) {
  return {
    type: 'Options',
    options: options
  };
};

// @TODO this should also capture active selection.
var Change = exports.Change = function Change(value) {
  return {
    type: 'Change',
    value: value
  };
};

var For = function For(id, action) {
  return {
    type: 'For',
    id: id,
    source: action
  };
};

var TagForID = function TagForID(id, action) {
  return For(id, action);
};

var ForID = function ForID(id) {
  return function (action) {
    return TagForID(id, action);
  };
};

// Model, init, update

var init = exports.init = function init(options) {
  var hasOptions = options && options.length > 0;

  var model = hasOptions ? {
    value: Option.readValue(options[0]),
    options: options
  } : {
    value: null,
    options: []
  };

  return [model, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'For' ? updateForID(action.id, action.source) : action.type === 'Change' ? [(0, _prelude.merge)(model, { value: action.value }), _reflex.Effects.none] : action.type === 'AppendOption' ? appendOption(model, action.option) : action.type === 'Options' ? setOptions(model, action.options) : (0, _unknown.update)(model, action);
};

var updateForID = function updateForID(id, action) {
  return (0, _unknown.update)(model, action);
};

var appendOption = function appendOption(model, option) {
  // If there are no options, then set the value of the new option as the value
  // of the form element.
  if (model.options.length === 0) {
    return [(0, _prelude.merge)(model, {
      value: Option.readValue(option),
      options: [option]
    }), _reflex.Effects.none];
  } else {
    return [(0, _prelude.merge)(model, {
      options: model.options.concat(option)
    }), _reflex.Effects.none];
  }
};

var setOptions = function setOptions(model, options) {
  return [(0, _prelude.merge)(model, {
    value: Option.readValue(options[0]),
    options: options
  }), _reflex.Effects.none];
};

// View

var view = exports.view = function view(model, address, className) {
  return _reflex.html.select({
    className: className,
    disabled: (0, _attr.toggle)('disabled', model.options.length === 0),
    onChange: onChange(address)
  }, model.options.map(Option.view));
};

var onChange = exports.onChange = function onChange(address) {
  return (0, _reflex.forward)(address, decodeChangeEvent);
};

var decodeChangeEvent = exports.decodeChangeEvent = function decodeChangeEvent(event) {
  return Change(event.target.value);
};

// Helpers

var readValue = exports.readValue = function readValue(model) {
  return model.value;
};

},{"../common/attr":98,"../common/option":112,"../common/prelude":114,"../common/unknown":121,"reflex":65}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
A super thin implementation of string variable replacement.

Example:

    var s = 'Username: {{username}}';
    var rendered = render(s, {
      username: 'x'
    });
*/

var pattern = /{{(\w+)}}/g;

var toString = function toString(x) {
  return x + '';
};

var escapeHtml = exports.escapeHtml = function escapeHtml(string) {
  return string.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;');
};

var render = exports.render = function render(string, context) {
  return string.replace(pattern, function (match, group1) {
    return escapeHtml(toString(context[group1]) || '');
  });
};

},{}],120:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMouseOut = exports.onMouseOver = exports.out = exports.over = exports.update = exports.init = exports.Out = exports.Over = exports.Model = undefined;

var _reflex = require("reflex");

var _prelude = require("../common/prelude");

var _functional = require("../lang/functional");

var _unknown = require("../common/unknown");

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                           * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                           * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Adapted from
https://github.com/browserhtml/browserhtml/blob/4be9d07a98dc4a2f7764be1f8576ad9485c5079b/src/common/target.js
*/

var Model = exports.Model = function Model(isPointerOver) {
  _classCallCheck(this, Model);

  this.isPointerOver = isPointerOver;
};

Model.over = new Model(true);
Model.out = new Model(false);

var Over = exports.Over = { type: "Over" };
var Out = exports.Out = { type: "Out" };

var init = exports.init = function init() {
  var isPointerOver = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
  return [isPointerOver ? Model.over : Model.out, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case "Over":
      return over(model);
    case "Out":
      return out(model);
    default:
      return Unknown.update(model, action);
  }
};

var over = exports.over = function over(model) {
  return [Model.over, _reflex.Effects.none];
};

var out = exports.out = function out(model) {
  return [Model.out, _reflex.Effects.none];
};

var onMouseOver = exports.onMouseOver = (0, _prelude.port)((0, _functional.constant)(Over));
var onMouseOut = exports.onMouseOut = (0, _prelude.port)((0, _functional.constant)(Out));

},{"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],121:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.error = exports.log = exports.warn = undefined;

var _reflex = require("reflex");

/*::
import type {Action} from "./unknown";
import type {Never} from "reflex";
*/

var warn = exports.warn = function warn() {
  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return (/*:Array<any>*/ /*:Task<Never, Action>*/new _reflex.Task(function (succeed, fail) {
      var _console;

      (_console = console).warn.apply(_console, params);
    })
  );
}; /* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var log = exports.log = function log() {
  for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  return (/*:Array<any>*/ /*:Task<Never, Action>*/new _reflex.Task(function (succeed, fail) {
      var _console2;

      (_console2 = console).log.apply(_console2, params);
    })
  );
};

var error = exports.error = function error() {
  for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    params[_key3] = arguments[_key3];
  }

  return (/*:Array<any>*/ /*:Task<Never, Action>*/new _reflex.Task(function (succeed, fail) {
      var _console3;

      (_console3 = console).error.apply(_console3, params);
    })
  );
};

var update = /*::<model, action>*/
exports.update = function update(model /*:model*/, action /*:action*/) /*:[model, Effects<action>]*/{
  console.warn('Unknown action was passed & ignored: ', action, Error().stack);
  return [model, _reflex.Effects.none];
};

},{"reflex":65}],122:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* URL helper functions */

var HTTP = /^https?:\/\//i;

// Check to see that string starts with http/https protocol.
var isHttp = exports.isHttp = function isHttp(string) {
  return string.search(HTTP) > -1;
};

// @TODO this works in Chrome, Firefox, Safari, Opera and IE 10+.
// Maybe polyfill for older browsers?
// https://developer.mozilla.org/en-US/docs/Web/API/URL
var url = exports.url = function url(_url) {
  return new URL(_url);
};

// Will do its best to clean up a string and make it a valid url by
// appending http if missing. Will it work? Who knows? You should always
// wrap user input to this function in a try/catch.
// Returns a url object.
var readUrl = exports.readUrl = function readUrl(string) {
  return !isHttp(string) ? url('http://' + string) : url(string);
};

// Read the root URL of a url-like string.
var readRootUrl = exports.readRootUrl = function readRootUrl(string) {
  // Hostname is the url (without port number).
  // Protocol is the protocol up until the ":" (`http:`).
  // See https://developer.mozilla.org/en-US/docs/Web/API/URL
  var _readUrl = readUrl(string);

  var protocol = _readUrl.protocol;
  var hostname = _readUrl.hostname;

  var rootUrl = protocol + '//' + hostname;
  return rootUrl;
};

},{}],123:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readValue = exports.isOk = exports.onSelect = exports.onChange = exports.onFocus = exports.view = exports.edit = exports.disable = exports.enable = exports.update = exports.init = exports.Disable = exports.Enable = exports.Deactivate = exports.Activate = exports.Error = exports.Ok = exports.Validate = exports.Rest = exports.Model = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _functional = require('../lang/functional');

var _prelude = require('../common/prelude');

var _attr = require('../common/attr');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _focusable = require('../common/focusable');

var Focus = _interopRequireWildcard(_focusable);

var _editable = require('../common/editable');

var Edit = _interopRequireWildcard(_editable);

var _control = require('../common/control');

var Control = _interopRequireWildcard(_control);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                           * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                           * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Adapted from
https://github.com/browserhtml/browserhtml/blob/master/src/common/text-input.js
*/

var RESTING = 'resting';
var OK = 'ok';
var ERROR = 'error';
var VALIDATING = 'validating';

var Model = exports.Model = function Model(label, message, placeholder, mode, edit, focus, control) {
  _classCallCheck(this, Model);

  this.edit = edit;
  this.focus = focus;
  this.control = control;
  this.placeholder = placeholder;
  this.mode = mode;
  this.label = label;
  this.message = message;
};

var Blur = { type: 'Blur' };

var Rest = exports.Rest = { type: 'Rest' };

var Validating = { type: 'Validating' };

var Validate = exports.Validate = function Validate(value) {
  return {
    type: 'Validate',
    value: value
  };
};

var Ok = exports.Ok = function Ok(message) {
  return {
    type: 'Ok',
    message: message
  };
};

var Error = exports.Error = function Error(message) {
  return {
    type: 'Error',
    message: message
  };
};

var EditAction = function EditAction(action) {
  return action.type === 'Change' ? Change(action.change) : {
    type: "Edit",
    edit: action
  };
};

var FocusAction = function FocusAction(action) {
  return {
    type: "Focus",
    focus: action
  };
};

var ControlAction = function ControlAction(action) {
  return {
    type: "Control",
    control: action
  };
};

var Change = function Change(change) {
  return {
    type: 'EditChange',
    change: change
  };
};

var EditChange = function EditChange(change) {
  return EditAction(Edit.Change(change));
};
var Activate = exports.Activate = FocusAction(Focus.Focus);
var Deactivate = exports.Deactivate = FocusAction(Focus.Blur);
var Enable = exports.Enable = ControlAction(Control.Enable);
var Disable = exports.Disable = ControlAction(Control.Disable);

var init = exports.init = function init() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var label = arguments[1];
  var placeholder = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var selection = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  var isDisabled = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
  var isFocused = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];

  var _Edit$init = Edit.init(value, selection);

  var _Edit$init2 = _slicedToArray(_Edit$init, 2);

  var edit = _Edit$init2[0];
  var editFx = _Edit$init2[1];

  var _Control$init = Control.init(isDisabled);

  var _Control$init2 = _slicedToArray(_Control$init, 2);

  var control = _Control$init2[0];
  var controlFx = _Control$init2[1];

  var _Focus$init = Focus.init(isFocused);

  var _Focus$init2 = _slicedToArray(_Focus$init, 2);

  var focus = _Focus$init2[0];
  var focusFx = _Focus$init2[1];

  var model = new Model(label, '', placeholder, RESTING, edit, focus, control);

  var fx = _reflex.Effects.batch([editFx.map(EditAction), focusFx.map(FocusAction), controlFx.map(ControlAction)]);

  return [model, fx];
};

var update = exports.update = function update(model, action) {
  switch (action.type) {
    case 'Edit':
      return delegateEditUpdate(model, action.edit);
    case 'Focus':
      return delegateFocusUpdate(model, action.focus);
    case 'Control':
      return delegateControlUpdate(model, action.control);
    case 'Blur':
      return updateBlur(model);
    case 'EditChange':
      return updateChange(model, action.change);
    case 'Ok':
      return (0, _prelude.nofx)(changeMode(model, OK, action.message));
    case 'Error':
      return (0, _prelude.nofx)(changeMode(model, ERROR, action.message));
    case 'Rest':
      return (0, _prelude.nofx)(changeMode(model, RESTING, ''));
    case 'Validating':
      return sendValidate(model);
    default:
      return Unknown.update(model, action);
  }
};

var enable = exports.enable = function enable(model) {
  return delegateControlUpdate(model, Control.Enable);
};

var disable = exports.disable = function disable(model) {
  return delegateControlUpdate(model, Control.Disable);
};

var edit = exports.edit = function edit(model, value, selection) {
  return swapEdit(model, Edit.change(model.edit, value, selection));
};

var blur = function blur(model) {
  return delegateFocusUpdate(model, Focus.Blur);
};

var delegateEditUpdate = function delegateEditUpdate(model, action) {
  return swapEdit(model, Edit.update(model.edit, action));
};

var delegateFocusUpdate = function delegateFocusUpdate(model, action) {
  return swapFocus(model, Focus.update(model.focus, action));
};

var delegateControlUpdate = function delegateControlUpdate(model, action) {
  return swapControl(model, Control.update(model.control, action));
};

var swapEdit = function swapEdit(model, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var edit = _ref2[0];
  var fx = _ref2[1];
  return [new Model(model.label, model.message, model.placeholder, model.mode, edit, model.focus, model.control), fx.map(EditAction)];
};

var swapFocus = function swapFocus(model, _ref3) {
  var _ref4 = _slicedToArray(_ref3, 2);

  var focus = _ref4[0];
  var fx = _ref4[1];
  return [new Model(model.label, model.message, model.placeholder, model.mode, model.edit, focus, model.control), fx.map(FocusAction)];
};

var swapControl = function swapControl(model, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 2);

  var control = _ref6[0];
  var fx = _ref6[1];
  return [new Model(model.label, model.message, model.placeholder, model.mode, model.edit, model.focus, control), fx.map(ControlAction)];
};

var changeMode = function changeMode(model, mode, message) {
  return model.mode !== mode || model.message !== message ? new Model(model.label, message, model.placeholder, mode, model.edit, model.focus, model.control) : model;
};

// Transition to validating mode and send up a "Validate" action.
var sendValidate = function sendValidate(model) {
  return [changeMode(model, VALIDATING, ''), _reflex.Effects.receive(Validate(readValue(model)))];
};

var updateBlur = function updateBlur(model) {
  var _blur = blur(model);

  var _blur2 = _slicedToArray(_blur, 2);

  var next = _blur2[0];
  var fx = _blur2[1];


  var modeAction = model.edit.value === '' ? Rest : Validating;

  return [next, _reflex.Effects.batch([fx, _reflex.Effects.receive(modeAction)])];
};

var updateChange = function updateChange(model, change) {
  var _delegateEditUpdate = delegateEditUpdate(model, Edit.Change(change));

  var _delegateEditUpdate2 = _slicedToArray(_delegateEditUpdate, 2);

  var changed = _delegateEditUpdate2[0];
  var changedFx = _delegateEditUpdate2[1];

  var _update = update(changed, Rest);

  var _update2 = _slicedToArray(_update, 2);

  var rested = _update2[0];
  var restedFx = _update2[1];

  return [rested, _reflex.Effects.batch([changedFx, _reflex.Effects.receive(Rest)])];
};

var view = exports.view = function view(model, address, className) {
  var _classed;

  return _reflex.html.div({
    className: (0, _attr.classed)((_classed = {}, _defineProperty(_classed, className, true), _defineProperty(_classed, 'validator', true), _defineProperty(_classed, 'validator-ok', model.mode === OK), _defineProperty(_classed, 'validator-error', model.mode === ERROR), _defineProperty(_classed, 'validator-validating', model.mode === VALIDATING), _classed))
  }, [_reflex.html.input({
    className: 'validator-input input',
    type: 'input',
    placeholder: model.placeholder,
    value: model.edit.value,
    disabled: model.control.isDisabled ? true : void 0,
    onInput: onChange(address),
    onKeyUp: onSelect(address),
    onSelect: onSelect(address),
    onFocus: onFocus(address),
    onBlur: function onBlur() {
      return address(Blur);
    }
  }), _reflex.html.label({
    className: 'validator-message'
  }, [model.message || model.label])]);
};

var onFocus = exports.onFocus = (0, _prelude.annotate)(Focus.onFocus, FocusAction);
var onChange = exports.onChange = (0, _prelude.annotate)(Edit.onChange, EditAction);
var onSelect = exports.onSelect = (0, _prelude.annotate)(Edit.onSelect, EditAction);

// Determine if the validator is currently "ok" (valid).
// Returns a boolean.
var isOk = exports.isOk = function isOk(model) {
  return model.mode === OK;
};

// Read current value of input.
// Returns a string.
var readValue = exports.readValue = function readValue(model) {
  return model.edit.value;
};

},{"../common/attr":98,"../common/control":101,"../common/editable":105,"../common/focusable":106,"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"reflex":65}],124:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from https://github.com/browserhtml/browserhtml/blob/master/src/devtools.js.

This file wraps the app module and gives us developer features like logging.
*/

var _reflex = require('reflex');

var _log = require('./devtools/log');

var Log = _interopRequireWildcard(_log);

var _cursor = require('./common/cursor');

var _prelude = require('./common/prelude');

var _runtime = require('./common/runtime');

var Runtime = _interopRequireWildcard(_runtime);

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Actions

var TagLog = (0, _prelude.tag)('Log');
var TagDebuggee = (0, _prelude.tag)('Debuggee');

// Model, init and update

var Model = function Model(debuggee, Debuggee, log) {
  return {
    debuggee: debuggee,
    Debuggee: Debuggee,
    log: log
  };
};

var init = exports.init = function init(_ref) {
  var Debuggee = _ref.Debuggee;
  var flags = _ref.flags;

  // Check runtime environment (query string parameters) to see if we should log.
  var shouldLog = Runtime.env.log;

  var _Debuggee$init = Debuggee.init(flags);

  var _Debuggee$init2 = _slicedToArray(_Debuggee$init, 2);

  var debuggee = _Debuggee$init2[0];
  var debuggeeFx = _Debuggee$init2[1];

  var _Log$init = Log.init(shouldLog ? 'raw' : 'none');

  var _Log$init2 = _slicedToArray(_Log$init, 2);

  var log = _Log$init2[0];
  var logFx = _Log$init2[1];


  var model = Model(debuggee, Debuggee, log);

  return [model, _reflex.Effects.batch([logFx.map(TagLog), debuggeeFx.map(TagDebuggee)])];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Log' ? updateLog(model, action.source) : action.type === 'Debuggee' ? updateDebugee(model, action.source) : Unknown.update(model, action);
};

var updateLog = (0, _cursor.cursor)({
  get: function get(model) {
    return model.log;
  },
  set: function set(model, log) {
    return Model(model.debuggee, model.Debuggee, log);
  },
  update: Log.update,
  tag: TagLog
});

var updateDebugee = function updateDebugee(model, action) {
  var ignore = [Log.ignore, _reflex.Effects.none];
  var Debuggee = model.Debuggee;

  var _ref2 = model.log === Log.ignore ? ignore : Log.update(model.log, Log.Debuggee(action));

  var _ref3 = _slicedToArray(_ref2, 2);

  var log = _ref3[0];
  var logFx = _ref3[1];

  var _Debuggee$update = Debuggee.update(model.debuggee, action);

  var _Debuggee$update2 = _slicedToArray(_Debuggee$update, 2);

  var debuggee = _Debuggee$update2[0];
  var debuggeeFx = _Debuggee$update2[1];


  var fx = _reflex.Effects.batch([logFx.map(TagLog), debuggeeFx.map(TagDebuggee)]);

  var next = Model(debuggee, Debuggee, log);

  return [next, fx];
};

// View

var view = exports.view = function view(model, address) {
  return model.Debuggee.view(model.debuggee, (0, _reflex.forward)(address, TagDebuggee));
};

},{"./common/cursor":102,"./common/prelude":114,"./common/runtime":117,"./common/unknown":121,"./devtools/log":125,"reflex":65}],125:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.init = exports.ignore = exports.raw = exports.Debuggee = undefined;

var _reflex = require('reflex');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from https://github.com/browserhtml/browserhtml/blob/e76c4ce9d85acec365dd614dc37fae54ec056af7/src/devtools/log.js
*/
var Debuggee = exports.Debuggee = function Debuggee(debuggee) {
  return {
    type: "Debuggee",
    debuggee: debuggee
  };
};

var raw = exports.raw = 'raw';
var ignore = exports.ignore = null;

var init = exports.init = function init(mode) {
  return [
  // "raw" mode = logging actions through console.
  // "none" = no logging.
  mode === 'raw' ? raw : ignore, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Debuggee' ? log(model, action.debuggee) : Unknown.update(model, action);
};

var log = function log(model, action) {
  console.log('Action >>', action);
  return [model, _reflex.Effects.none];
};

},{"../common/unknown":121,"reflex":65}],126:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceReplace = exports.replaceElement = exports.forceRender = exports.selection = exports.focus = exports.metaProperty = exports.onWindow = exports.on = exports.Renderer = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* @noflow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Adapted from MPL code found at
https://github.com/browserhtml/browserhtml/blob/master/src/driver/virtual-dom/index.js

Mostly we removed the type annotations.
*/

var _reflexVirtualDomDriver = require('reflex-virtual-dom-driver');

Object.defineProperty(exports, 'Renderer', {
  enumerable: true,
  get: function () {
    return _reflexVirtualDomDriver.Renderer;
  }
});

var _reflex = require('reflex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @TODO documentation
// I think this is some kind of memoization class? - GB 2015-11-12
var On = function () {
  _createClass(On, null, [{
    key: 'handleEvent',
    value: function handleEvent(event) {
      var currentTarget = event.currentTarget;
      var type = event.type;


      var handler = currentTarget['on:' + type];
      if (handler) {
        var data = handler.decode == null ? void 0 : handler.decode(event);

        if (data == null || data.type !== "AbortEvent") {
          if (handler.stopPropagation) {
            if (handler.stopPropagation(data)) {
              event.stopPropagation();
            }
          }

          if (handler.preventDefault) {
            if (handler.preventDefault(data)) {
              event.preventDefault();
            }
          }

          handler.address(data);
        }
      }
    }
  }]);

  function On(address, decode, options, getTarget) {
    _classCallCheck(this, On);

    this.address = address;
    this.decode = decode;
    this.getTarget = getTarget;
    this.stopPropagation = false;
    this.preventDefault = false;
    this.type = 'On';

    if (options != null) {
      if (options.stopPropagation != null) {
        this.stopPropagation = options.stopPropagation;
      }

      if (options.preventDefault != null) {
        this.preventDefault = options.preventDefault;
      }
    }
  }

  _createClass(On, [{
    key: 'hook',
    value: function hook(node, name, previous) {
      var type = name.indexOf('on') === 0 ? name.substr(2).toLowerCase() : name;

      var target = this.getTarget != null ? this.getTarget(node) : node;

      if (previous == null || previous.type != this.type) {
        target.addEventListener(type, this.constructor.handleEvent);
      }

      target['on:' + type] = this;
    }
  }, {
    key: 'unhook',
    value: function unhook(node, name, next) {
      var type = name.indexOf('on') === 0 ? name.substr(2).toLowerCase() : name.toLowerCase();

      var target = this.getTarget != null ? this.getTarget(node) : node;

      if (next == null || next.type != this.type) {
        node.removeEventListener(type, this.constructor.handleEvent);
      }

      delete node['on:' + type];
    }
  }]);

  return On;
}();

var $hash = Symbol.for("hash");
var nextHash = 0;

var hash = function hash(v) {
  if (v == null) {
    return '#_';
  } else if (v === false) {
    return '#f';
  } else if (v === true) {
    return '#t';
  } else {
    if (v[$hash] == null) {
      v[$hash] = 'f#' + ++nextHash;
    }

    if (v[$hash] == null) {
      throw TypeError('Invalid value of type ' + (typeof v === 'undefined' ? 'undefined' : _typeof(v)) + ' passed to a hashing function');
    }

    return v[$hash];
  }
};

var blank = Object.create(null);
var on = exports.on = function on(address, decode, options, getTarget) {
  var _ref = options || blank;

  var stopPropagation = _ref.stopPropagation;
  var preventDefault = _ref.preventDefault;

  var id = 'on:' + hash(decode) + '@' + hash(getTarget) + ':' + hash(stopPropagation) + ':' + hash(preventDefault) + '}';

  if (!address[id]) {
    address[id] = new On(address, decode, options, getTarget);
  }

  return address[id];
};

var getRoot = function getRoot(target) {
  return target.ownerDocument.defaultView;
};
var onWindow = exports.onWindow = function onWindow(address, decode, options) {
  return on(address, decode, options, getRoot);
};

var MetaProperty = function () {
  function MetaProperty(value, update) {
    _classCallCheck(this, MetaProperty);

    this.value = value;
    this.update = update;
    this.type = 'MetaProperty';
  }

  _createClass(MetaProperty, [{
    key: 'hook',
    value: function hook(node, name, previous) {
      var before = previous == null ? previous : previous.type != this.type ? previous : previous.value;

      this.update(node, this.value, before);
    }
  }, {
    key: 'unhook',
    value: function unhook(node, name, next) {}
  }]);

  return MetaProperty;
}();

var metaProperty = exports.metaProperty = function metaProperty(update) {
  return function (value) {
    return new MetaProperty(value, update);
  };
};

// Bunch of meta properties are booleans, meaning they can be toggled on
// or off. This function is an optimized version of metaProperty for such
// cases, it lazily caches both on and off instances and reuses them in
// subsequent calls. Note: `false`, `null`, and `undefined` are treated as
// logical `false` everything else is treated as `true`.
var metaBooleanProperty = function metaBooleanProperty(update) {
  var on = null;
  var off = null;

  var property = metaProperty(update);

  return function (value) {
    if (value === false || value == null) {
      if (off == null) {
        off = property(false);
      }
      return off;
    } else {
      if (on == null) {
        on = property(true);
      }
      return on;
    }
  };
};

var focus = exports.focus = metaBooleanProperty(function (node, next, previous) {
  if (next != previous) {
    if (next) {
      node.focus();
      // If node did not get focused, it is because this is initial render and
      // in such case VirtualDOM library calls hooks before nodes are actualy
      // part of document and there for `.focus()` has no effect. In this case
      // we just repeat `.focus()` on next tick, as by then node will be part
      // of the document.
      if (node.ownerDocument.activeElement !== node) {
        Promise.resolve().then(function () {
          node.focus();
        });
      }
    } else {
      node.blur();
    }
  }
});

var selection = exports.selection = metaProperty(function (node, next, previous) {
  var direction = next.direction;

  var start = next.start === Infinity ? node.value.length : next.start;
  var end = next.end === Infinity ? node.value.length : next.end;

  // Note that call to `node.setSelectionRange` triggers `select` event
  // regardless of whether there was a change in selection. In order to avoid
  // potential inifinite selection change loop we check if call will actually
  // change a selection & only perform call if it will.
  var isUpdateRequired = node.selectionStart !== start || node.selectionEnd !== end || node.selectionDirection !== direction;

  if (isUpdateRequired) {
    node.setSelectionRange(start, end, direction);
  }
});

var forceRender = exports.forceRender = new _reflex.Task(function (succeed, fail) {
  if (window.renderer) {
    window.renderer.execute();
    console.log('Rendered in the same tick');
    succeed(void 0);
  } else {
    fail(Error('window.renderer must be set to enable force rendering'));
  }
});

// @Hack: The following three functions have being copied from:
// https://github.com/Gozala/reflex-virtual-dom-driver/blob/c0248855bcf76123e50ff55a4b41bf19a53ab793/src/hooks/event-handler.js#L103-L119
// As it was impossible to import them.
// This hack can go away once https://github.com/Gozala/reflex-virtual-dom-driver/issues/4 is fixed.
var handleEvent = function handleEvent(phase) {
  return function (event) {
    var currentTarget = event.currentTarget;
    var type = event.type;

    var handler = currentTarget['on' + type + phase];

    if (typeof handler === 'function') {
      handler(event);
    }

    if (handler != null && typeof handler.handleEvent === 'function') {
      handler.handleEvent(event);
    }
  };
};
var handleCapturing = handleEvent('capture');
var handleBubbling = handleEvent('bubble');

var replaceElement = exports.replaceElement = function replaceElement(query, element) {
  return new _reflex.Task(function (succeed, fail) {
    var target = document.querySelector(query);
    if (target == null) {
      fail(Error('could not find node ${query}'));
    } else {
      if (target != element) {
        var attributes = target.attributes;

        var count = attributes.length;
        var index = 0;
        while (index < count) {
          var _attributes$index = attributes[index];
          var name = _attributes$index.name;
          var value = _attributes$index.value;

          index = index + 1;
          element.setAttribute(name, value);
        }

        for (var name in target) {
          if (target.hasOwnProperty(name)) {
            if (name.indexOf('on:') === 0) {
              var type = name.substr(3);
              var handler = target[name];
              element.addEventListener(type, handler.constructor.handleEvent);
            } else if (name.indexOf('on') === 0) {
              name.endsWith('capture') ? element.addEventListener(name.substring(2, name.length - 'capture'.length), handleCapturing, true) : name.endsWith('bubble') ? element.addEventListener(name.substring(2, name.length - 'bubble'.length), handleBubbling, false) : void 0;
            }

            element[name] = target[name];
          }
        }
      }
      target.parentNode.replaceChild(element, target);
    }
    succeed(void 0);
  });
};

var forceReplace = exports.forceReplace = function forceReplace(query, element) {
  return forceRender.chain(function (_) {
    return replaceElement(query, element);
  });
};

},{"reflex":65,"reflex-virtual-dom-driver":57}],127:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.serialize = exports.init = exports.SetAirTemperature = exports.SetRecipe = exports.Configure = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _reflex = require('reflex');

var _prelude = require('./common/prelude');

var _poll = require('./common/poll');

var Poll = _interopRequireWildcard(_poll);

var _stache = require('./common/stache');

var Template = _interopRequireWildcard(_stache);

var _request = require('./common/request');

var Request = _interopRequireWildcard(_request);

var _result = require('./common/result');

var Result = _interopRequireWildcard(_result);

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _maybe = require('./common/maybe');

var _cursor = require('./common/cursor');

var _lang = require('./common/lang');

var _functional = require('./lang/functional');

var _find = require('./lang/find');

var _chart = require('./environment/chart');

var Chart = _interopRequireWildcard(_chart);

var _toolbox = require('./environment/toolbox');

var Toolbox = _interopRequireWildcard(_toolbox);

var _exporter = require('./environment/exporter');

var Exporter = _interopRequireWildcard(_exporter);

var _sidebar = require('./environment/sidebar');

var Sidebar = _interopRequireWildcard(_sidebar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Variable key for environmental data point that represents temperature.
var AIR_TEMPERATURE = 'air_temperature';

// Time constants in ms
var S_MS = 1000;
var MIN_MS = S_MS * 60;
var HR_MS = MIN_MS * 60;
var DAY_MS = HR_MS * 24;
var POLL_TIMEOUT = 4 * S_MS;
var RETRY_TIMEOUT = 4 * S_MS;

// Limit to the number of datapoints that will be rendered in chart.
var MAX_DATAPOINTS = 5000;

// Actions

var NoOp = {
  type: 'NoOp'
};

var RequestOpenRecipes = {
  type: 'RequestOpenRecipes'
};

// Configure action received from parent.
var Configure = exports.Configure = function Configure(environmentID, environmentName, origin) {
  return {
    type: 'Configure',
    origin: origin,
    id: environmentID,
    name: environmentName
  };
};

var TagExporter = (0, _prelude.tag)('Exporter');
var OpenExporter = TagExporter(Exporter.Open);
var ConfigureExporter = (0, _functional.compose)(TagExporter, Exporter.Configure);

var TagSidebar = function TagSidebar(action) {
  return action.type === 'RequestOpenRecipes' ? RequestOpenRecipes : (0, _prelude.tagged)('Sidebar', action);
};

var SetRecipe = exports.SetRecipe = (0, _functional.compose)(TagSidebar, Sidebar.SetRecipe);
var SetAirTemperature = exports.SetAirTemperature = (0, _functional.compose)(TagSidebar, Sidebar.SetAirTemperature);

var TagToolbox = function TagToolbox(action) {
  return action.type === 'OpenExporter' ? OpenExporter : (0, _prelude.tagged)('Toolbox', action);
};

var TagPoll = function TagPoll(action) {
  return action.type === 'Ping' ? FetchLatest : (0, _prelude.tagged)('Poll', action);
};

var FetchLatest = { type: 'FetchLatest' };
var Latest = (0, _prelude.tag)('Latest');

// Action for fetching chart backlog.
var GetBacklog = { type: 'GetBacklog' };

// Action for the result of fetching chart backlog.
var GotBacklog = function GotBacklog(result) {
  return {
    type: 'GotBacklog',
    result: result
  };
};

var PongPoll = TagPoll(Poll.Pong);
var MissPoll = TagPoll(Poll.Miss);

var TagChart = (0, _prelude.tag)('Chart');
var AddChartData = (0, _functional.compose)(TagChart, Chart.AddData);
var ChartLoading = (0, _functional.compose)(TagChart, Chart.Loading);

// Send an alert. We use this to send up problems to be displayed in banner.
var AlertBanner = (0, _prelude.tag)('AlertBanner');

// Map an incoming datapoint into an action
var DataPointAction = function DataPointAction(dataPoint) {
  console.log(DataPoint);
};

// Model init and update

var init = exports.init = function init(id) {
  var _Poll$init = Poll.init(POLL_TIMEOUT);

  var _Poll$init2 = _slicedToArray(_Poll$init, 2);

  var poll = _Poll$init2[0];
  var pollFx = _Poll$init2[1];

  var _Chart$init = Chart.init();

  var _Chart$init2 = _slicedToArray(_Chart$init, 2);

  var chart = _Chart$init2[0];
  var chartFx = _Chart$init2[1];

  var _Exporter$init = Exporter.init();

  var _Exporter$init2 = _slicedToArray(_Exporter$init, 2);

  var exporter = _Exporter$init2[0];
  var exporterFx = _Exporter$init2[1];

  var _Sidebar$init = Sidebar.init();

  var _Sidebar$init2 = _slicedToArray(_Sidebar$init, 2);

  var sidebar = _Sidebar$init2[0];
  var sidebarFx = _Sidebar$init2[1];


  return [{
    id: id,
    chart: chart,
    poll: poll,
    exporter: exporter,
    sidebar: sidebar
  }, _reflex.Effects.batch([chartFx.map(TagChart), pollFx.map(TagPoll), exporterFx.map(TagExporter), sidebarFx.map(TagSidebar)])];
};

// Serialize environment for storing locally.
var serialize = exports.serialize = function serialize(model) {
  return {
    id: model.id,
    name: model.name
  };
};

var update = exports.update = function update(model, action) {
  return action.type === 'NoOp' ? [model, _reflex.Effects.none] : action.type === 'Poll' ? updatePoll(model, action.source) : action.type === 'Exporter' ? updateExporter(model, action.source) : action.type === 'Chart' ? updateChart(model, action.source) : action.type === 'Sidebar' ? updateSidebar(model, action.source) : action.type === 'FetchLatest' ? fetchLatest(model) : action.type === 'Latest' ? updateLatest(model, action.source) : action.type === 'GetBacklog' ? getBacklog(model) : action.type === 'GotBacklog' ? updateBacklog(model, action.result) : action.type === 'Configure' ? configure(model, action) : Unknown.update(model, action);
};

var fetchLatest = function fetchLatest(model) {
  if (model.origin && model.id) {
    var url = templateLatestUrl(model.origin, model.id);
    return [model, Request.get(url).map(Latest)];
  } else {
    console.warn('fetchLatest was called before origin and ID were restored on model');
    return [model, _reflex.Effects.none];
  }
};

var updateLatest = Result.updater(function (model, record) {
  var data = readData(record);
  var airTemperature = findAirTemperature(data);

  return (0, _prelude.batch)(update, model, [AddChartData(data), SetAirTemperature(airTemperature), PongPoll]);
}, function (model, error) {
  // Send miss poll
  var _update = update(model, MissPoll);

  var _update2 = _slicedToArray(_update, 2);

  var next = _update2[0];
  var fx = _update2[1];

  // Create alert action

  var action = AlertBanner(error);

  return [next,
  // Batch any effect generated by MissPoll with the alert effect.
  _reflex.Effects.batch([fx, _reflex.Effects.receive(action)])];
});

var getBacklog = function getBacklog(model) {
  if (model.origin && model.id) {
    var url = templateRecentUrl(model.origin, model.id);
    return [model, Request.get(url).map(GotBacklog)];
  } else {
    console.warn('GetBacklog was requested before origin and ID were restored on model');
    return [model, _reflex.Effects.none];
  }
};

// Update chart backlog from result of fetch.
var updateBacklog = Result.updater(function (model, record) {
  var data = readData(record);
  var airTemperature = findAirTemperature(data);

  return (0, _prelude.batch)(update, model, [AddChartData(data), SetAirTemperature(airTemperature), FetchLatest]);
}, function (model, error) {
  var action = AlertBanner(error);

  return [model, _reflex.Effects.batch([
  // Wait for a second, then try to get backlog again.
  _reflex.Effects.perform(_reflex.Task.sleep(RETRY_TIMEOUT)).map((0, _functional.constant)(GetBacklog)), _reflex.Effects.receive(action)])];
});

var configure = function configure(model, _ref) {
  var origin = _ref.origin;
  var id = _ref.id;
  var name = _ref.name;

  var next = (0, _prelude.merge)(model, {
    origin: origin,
    id: id,
    name: name
  });

  return (0, _prelude.batch)(update, next, [
  // Forward restore down to exporter module.
  ConfigureExporter(origin),
  // Now that we have the origin, get the backlog.
  GetBacklog]);
};

var updateSidebar = (0, _cursor.cursor)({
  get: function get(model) {
    return model.sidebar;
  },
  set: function set(model, sidebar) {
    return (0, _prelude.merge)(model, { sidebar: sidebar });
  },
  update: Sidebar.update,
  tag: TagSidebar
});

var updateChart = (0, _cursor.cursor)({
  get: function get(model) {
    return model.chart;
  },
  set: function set(model, chart) {
    return (0, _prelude.merge)(model, { chart: chart });
  },
  update: Chart.update,
  tag: TagChart
});

var updateExporter = (0, _cursor.cursor)({
  get: function get(model) {
    return model.exporter;
  },
  set: function set(model, exporter) {
    return (0, _prelude.merge)(model, { exporter: exporter });
  },
  update: Exporter.update,
  tag: TagExporter
});

var updatePoll = (0, _cursor.cursor)({
  get: function get(model) {
    return model.poll;
  },
  set: function set(model, poll) {
    return (0, _prelude.merge)(model, { poll: poll });
  },
  update: Poll.update,
  tag: TagPoll
});

// View

var view = exports.view = function view(model, address) {
  return model.id ? viewReady(model, address) : viewWaiting(model, address);
};

var viewReady = function viewReady(model, address) {
  return _reflex.html.div({
    className: 'environment-main environment-main--has-sidebar'
  }, [(0, _reflex.thunk)('chart', Chart.view, model.chart, (0, _reflex.forward)(address, TagChart)), (0, _reflex.thunk)('sidebar', Sidebar.view, model.sidebar, (0, _reflex.forward)(address, TagSidebar)), (0, _reflex.thunk)('chart-toolbox', Toolbox.view, model, (0, _reflex.forward)(address, TagToolbox)), (0, _reflex.thunk)('chart-export', Exporter.view, model.exporter, (0, _reflex.forward)(address, TagExporter), model.id)]);
};

var viewWaiting = function viewWaiting(model, address) {
  return _reflex.html.div({
    className: 'environment-main environment-main--has-sidebar'
  }, [(0, _reflex.thunk)('sidebar', Sidebar.view, model.sidebar, (0, _reflex.forward)(address, TagSidebar)), _reflex.html.div({
    className: 'environment-content environment-content--loading'
  })]);
};

// Helpers

var readRow = function readRow(row) {
  return row.value;
};
// @FIXME must check that the value returned from http call is JSON and has
// this structure before mapping.
var readRecord = function readRecord(record) {
  return record.rows.map(readRow);
};

var compareByTimestamp = function compareByTimestamp(a, b) {
  return a.timestamp > b.timestamp ? 1 : -1;
};

// @TODO we should distinguish between datapoint types so we know what values
// to parse to.
var readDataPoint = function readDataPoint(_ref2) {
  var variable = _ref2.variable;
  var is_desired = _ref2.is_desired;
  var timestamp = _ref2.timestamp;
  var value = _ref2.value;
  return {
    variable: variable,
    timestamp: timestamp,
    is_desired: is_desired,
    value: Number.parseFloat(value)
  };
};

var readData = function readData(record) {
  var data = readRecord(record).map(readDataPoint);
  data.sort(compareByTimestamp);
  return data;
};

// Create a url string that allows you to GET latest environmental datapoints
// from an environmen via CouchDB.
var templateLatestUrl = function templateLatestUrl(origin, id) {
  return Template.render(Config.environmental_data_point.origin_latest, {
    origin_url: origin,
    startkey: JSON.stringify([id]),
    endkey: JSON.stringify([id, {}])
  });
};

var templateRecentUrl = function templateRecentUrl(origin, id) {
  return Template.render(Config.environmental_data_point.origin_range, {
    origin_url: origin,
    startkey: JSON.stringify([id, {}]),
    endkey: JSON.stringify([id]),
    limit: MAX_DATAPOINTS,
    descending: true
  });
};

var isAirTemperature = function isAirTemperature(dataPoint) {
  return dataPoint.variable === AIR_TEMPERATURE;
};

var getValue = function getValue(dataPoint) {
  return dataPoint.value;
};

var findAirTemperature = function findAirTemperature(data) {
  return (0, _maybe.map)((0, _find.findRight)(data, isAirTemperature), getValue);
};

},{"../openag-config.json":94,"./common/cursor":102,"./common/lang":109,"./common/maybe":110,"./common/poll":113,"./common/prelude":114,"./common/request":115,"./common/result":116,"./common/stache":119,"./common/unknown":121,"./environment/chart":128,"./environment/exporter":129,"./environment/sidebar":130,"./environment/toolbox":132,"./lang/find":135,"./lang/functional":136,"reflex":65}],128:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Model = exports.Ready = exports.Loading = exports.AddData = exports.SetData = exports.MoveXhair = exports.Resize = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3Shape = require('d3-shape');

var _d3Time = require('d3-time');

var _d3TimeFormat = require('d3-time-format');

var _reflex = require('reflex');

var _openagConfig = require('../../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _lang = require('../common/lang');

var _maybe = require('../common/maybe');

var _prelude = require('../common/prelude');

var _cursor = require('../common/cursor');

var _draggable = require('../common/draggable');

var Draggable = _interopRequireWildcard(_draggable);

var _attr = require('../common/attr');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _indexed = require('../common/indexed');

var _functional = require('../lang/functional');

var _find = require('../lang/find');

var _virtualDom = require('../driver/virtual-dom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var CHART_CONFIG = Config.chart;

var S_MS = 1000;
var MIN_MS = S_MS * 60;
var HR_MS = MIN_MS * 60;
var DAY_MS = HR_MS * 24;

var SIDEBAR_WIDTH = 256;
var HEADER_HEIGHT = 72;
var SCRUBBER_HEIGHT = 40;
var TOOLTIP_SPACE = 30;
var READOUT_HEIGHT = 18;
var TOOLTIP_PADDING = 20;
var RATIO_DOMAIN = [0, 1.0];

var RECIPE_START = 'recipe_start';
var RECIPE_END = 'recipe_end';

var MAX_DATAPOINTS = 5000;

// Actions

var Resize = exports.Resize = function Resize(width, height) {
  return {
    type: 'Resize',
    width: width,
    height: height
  };
};

var MoveXhair = exports.MoveXhair = (0, _prelude.tag)('MoveXhair');
var SetData = exports.SetData = (0, _prelude.tag)('SetData');
var AddData = exports.AddData = (0, _prelude.tag)('AddData');

// Put chart into "loading" mode. Note that chart is dumb about whether it is
// loading or simply lacking data. You have to tell it via actions. Giving the
// chart data via the Data action will also automatically flip `isLoading` to
// false.
var Loading = exports.Loading = (0, _prelude.tag)('Loading');
// Put chart into "not loading" mode.
var Ready = exports.Ready = (0, _prelude.tag)('Ready');

var ScrubberAction = (0, _prelude.tag)('Scrubber');
var MoveScrubber = (0, _functional.compose)(ScrubberAction, Draggable.Move);
var HoldScrubber = ScrubberAction(Draggable.Hold);
var ReleaseScrubber = ScrubberAction(Draggable.Release);

// Init and update functions

var Model = exports.Model = function Model(variables, config, recipeStart, recipeEnd, width, height, scrubberAt, xhairAt, isLoading) {
  return {
    variables: variables,
    config: config,

    recipeStart: recipeStart,
    recipeEnd: recipeEnd,

    // Time interval to show within chart viewport (visible area)
    interval: HR_MS,

    // Define dimensions
    width: width,
    height: height,
    tooltipWidth: 424,

    // Define chart state
    scrubber: Draggable.Model(false, scrubberAt),
    xhairAt: xhairAt,
    isLoading: isLoading
  };
};

// Construct a group from a config object
var readGroupFromConfig = function readGroupFromConfig(_ref) {
  var variable = _ref.variable;
  var title = _ref.title;
  var unit = _ref.unit;
  var min = _ref.min;
  var max = _ref.max;
  var color = _ref.color;
  return {
    measured: [],
    desired: [],
    variable: variable,
    title: title,
    unit: unit,
    min: min,
    max: max,
    color: color
  };
};

// Construct a tree structure from model (useful for view)
//
// Output:
//
//     {
//       air_temperature: {
//         measured: [dataPoint, dataPoint, ...],
//         desired: [dataPoint, dataPoint, ...]
//       },
//       ...
//     }
var readSeries = function readSeries(model) {
  var variables = model.variables;
  var config = model.config;

  var groupList = config.map(readGroupFromConfig);
  var groupIndex = (0, _indexed.indexWith)(groupList, getVariable);
  var populated = variables.reduce(insertDataPoint, groupIndex);
  var variableKeys = config.map(getVariable);
  return (0, _indexed.listByKeys)(populated, variableKeys);
};

// Insert datapoint in index, mutating model. We use this function to build
// up the variable groups index.
// Returns mutated index.
var insertDataPoint = function insertDataPoint(index, dataPoint) {
  var variable = getVariable(dataPoint);
  var group = index[variable];
  var type = dataPoint.is_desired ? 'desired' : 'measured';

  // Check that this is a known variable in our configuration
  // File datapoint away in measured or desired, making sure that it is
  // monotonic (that a new datapoint comes after any older datapoints).
  if (index[variable] && isMonotonic(index[variable][type], dataPoint, readX)) {
    index[variable][type].push(dataPoint);
  }

  return index;
};

var init = exports.init = function init() {
  return [Model([], CHART_CONFIG, null, null, calcChartWidth(window.innerWidth), calcChartHeight(window.innerHeight), 1.0, 0.5, true), _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Scrubber' ? updateScrub(model, action.source) : action.type === 'MoveXhair' ? [(0, _prelude.merge)(model, { xhairAt: action.source }), _reflex.Effects.none] : action.type === 'AddData' ? addData(model, action.source) : action.type === 'Resize' ? updateSize(model, action.width, action.height) : action.type === 'Loading' ? [(0, _prelude.merge)(model, { isLoading: true }), _reflex.Effects.none] : action.type === 'Ready' ? [(0, _prelude.merge)(model, { isLoading: false }), _reflex.Effects.none] : Unknown.update(model, action);
};

var addData = function addData(model, data) {
  var variables = concatMonotonic(model.variables, data, MAX_DATAPOINTS, readX);

  // If variables model actually updated, then create new chart model.
  if (model.variables !== variables) {
    var recipeStart = (0, _maybe.mapOr)((0, _find.find)(variables, isRecipeStart), readRecipeTimeValue, model.recipeStart);
    var recipeEnd = (0, _maybe.mapOr)((0, _find.find)(variables, isRecipeEnd), readRecipeTimeValue, model.recipeEnd);

    var next = (0, _prelude.merge)(model, {
      // Create new variables model for data.
      variables: variables,
      isLoading: false,
      recipeStart: recipeStart,
      recipeEnd: recipeEnd
    });

    return [next, _reflex.Effects.none];
  } else {
    return [model, _reflex.Effects.none];
  }
};

var updateSize = function updateSize(model, width, height) {
  return [(0, _prelude.merge)(model, {
    width: width,
    height: height
  }), _reflex.Effects.none];
};

var updateScrub = (0, _cursor.cursor)({
  get: function get(model) {
    return model.scrubber;
  },
  set: function set(model, scrubber) {
    return (0, _prelude.merge)(model, { scrubber: scrubber });
  },
  update: Draggable.update,
  tag: ScrubberAction
});

// View function
var view = exports.view = function view(model, address) {
  return (
    // If model is loading, show loading view
    model.isLoading ? viewLoading(model, address) :
    // If not loading and no data to show, render empty
    model.variables.length === 0 ? viewEmpty(model, address) : viewData(model, address)
  );
};

// Handle the case where there is no data yet.
var viewLoading = function viewLoading(model, address) {
  var width = model.width;
  var height = model.height;

  return _reflex.html.div({
    className: 'chart',
    style: {
      width: px(width),
      height: px(height)
    },
    onResize: (0, _virtualDom.onWindow)(address, function () {
      return Resize(calcChartWidth(window.innerWidth), calcChartHeight(window.innerHeight));
    })
  }, [_reflex.html.img({
    className: 'chart-loading--img',
    src: 'assets/loading.svg',
    width: '80',
    height: '80'
  })]);
};

var viewEmpty = function viewEmpty(model, address) {
  var width = model.width;
  var height = model.height;

  return _reflex.html.div({
    className: 'chart',
    style: {
      width: px(width),
      height: px(height)
    },
    onResize: (0, _virtualDom.onWindow)(address, function () {
      return Resize(calcChartWidth(window.innerWidth), calcChartHeight(window.innerHeight));
    })
  }, [_reflex.html.div({
    className: 'chart-empty'
  }, [_reflex.html.div({
    className: 'chart-empty--message'
  }, [(0, _lang.localize)('No data yet. Maybe try starting a new recipe?')])])]);
};

var viewData = function viewData(model, address) {
  var variables = model.variables;
  var interval = model.interval;
  var width = model.width;
  var height = model.height;
  var tooltipWidth = model.tooltipWidth;
  var scrubber = model.scrubber;
  var xhairAt = model.xhairAt;
  var recipeStart = model.recipeStart;
  var recipeEnd = model.recipeEnd;


  var extentX = (0, _d3Array.extent)(variables, readX);
  var series = readSeries(model);

  var scrubberAt = scrubber.coords;
  var isDragging = scrubber.isDragging;

  // Calculate dimensions
  var tooltipHeight = series.length * READOUT_HEIGHT + TOOLTIP_PADDING * 2;
  var plotWidth = calcPlotWidth(extentX, interval, width);
  var plotHeight = calcPlotHeight(height, tooltipHeight);
  var svgHeight = calcSvgHeight(height);
  var tickTop = calcXhairTickTop(height, tooltipHeight);

  // Calculate scales
  var x = calcTimeScale(extentX, interval, width);

  var scrubberRatioToScrubberX = (0, _d3Scale.scaleLinear)().domain(RATIO_DOMAIN).range([0, width - 12]).clamp(true);

  var scrubberX = scrubberRatioToScrubberX(scrubberAt);

  var xhairRatioToXhairX = (0, _d3Scale.scaleLinear)().domain(RATIO_DOMAIN).range([0, width]).clamp(true);

  var scrubberRatioToPlotX = (0, _d3Scale.scaleLinear)().domain(RATIO_DOMAIN)
  // Translate up to the point that the right side of the plot is adjacent
  // to the right side of the viewport.
  .range([0, plotWidth - width]).clamp(true);

  var plotX = scrubberRatioToPlotX(scrubberAt);

  var xhairX = xhairRatioToXhairX(xhairAt);
  var tooltipX = calcTooltipX(xhairX, width, tooltipWidth);

  // Calculate xhair absolute position by adding crosshair position in viewport
  // to plot offset. Then use absolute coord in chart viewport to get inverse
  // value (time) under xhair.
  var xhairTime = x.invert(plotX + xhairX);

  var children = series.map(function (group) {
    return viewGroup(group, address, x, plotHeight);
  });

  var axis = renderAxis(x, svgHeight);
  children.push(axis);

  if (recipeStart) {
    var recipeStartMarker = renderMarker(x(recipeStart), svgHeight, (0, _lang.localize)('Recipe Started'));

    children.push(recipeStartMarker);
  }

  if (recipeEnd) {
    var recipeEndMarker = renderMarker(x(recipeEnd), svgHeight, (0, _lang.localize)('Recipe Ended'));
    children.push(recipeEndMarker);
  }

  var chartSvg = svg({
    width: plotWidth,
    height: svgHeight,
    className: 'chart-svg',
    style: {
      // Translate SVG to move the visible portion of the plot in response
      // to scrubber.
      transform: translateXY(-1 * plotX, 0)
    }
  }, children);

  var readouts = series.map(function (group) {
    var measured = displayYValueFromX(group.measured, xhairTime, readX, readY, group.unit);
    var desired = displayYValueFromX(group.desired, xhairTime, readX, readY, group.unit);
    return renderReadout(group, measured, desired);
  });

  return _reflex.html.div({
    className: 'chart',
    onMouseUp: function onMouseUp() {
      return address(ReleaseScrubber);
    },
    onMouseMove: function onMouseMove(event) {
      var _calcRelativeMousePos = calcRelativeMousePos(event.currentTarget, event.clientX, event.clientY);

      var _calcRelativeMousePos2 = _slicedToArray(_calcRelativeMousePos, 2);

      var mouseX = _calcRelativeMousePos2[0];
      var mouseY = _calcRelativeMousePos2[1];


      var xhairAt = xhairRatioToXhairX.invert(mouseX);
      address(MoveXhair(xhairAt));

      var scrubberAt = scrubberRatioToScrubberX.invert(mouseX);
      address(MoveScrubber(scrubberAt));
    },
    onResize: (0, _virtualDom.onWindow)(address, function () {
      return Resize(calcChartWidth(window.innerWidth), calcChartHeight(window.innerHeight));
    }),
    style: {
      width: px(width),
      height: px(height)
    }
  }, [chartSvg, _reflex.html.div({
    className: 'chart-xhair',
    style: {
      transform: translateXY(xhairX, 0)
    }
  }), _reflex.html.div({
    className: 'chart-xhair--tick',
    style: {
      transform: translateXY(xhairX, tickTop)
    }
  }), _reflex.html.div({
    className: 'chart-tooltip',
    style: {
      width: px(tooltipWidth),
      height: px(tooltipHeight),
      transform: translateXY(tooltipX, 0)
    }
  }, [_reflex.html.div({
    className: 'chart-timestamp'
  }, [_reflex.html.div({
    className: 'chart-timestamp--time'
  }, [formatTime(xhairTime)]), _reflex.html.div({
    className: 'chart-timestamp--day'
  }, [formatDay(xhairTime)])]), _reflex.html.div({
    className: 'chart-readouts'
  }, readouts)]), _reflex.html.div({
    className: 'chart-scrubber'
  }, [_reflex.html.div({
    className: 'chart-progress',
    style: {
      width: px(scrubberX)
    }
  }), _reflex.html.div({
    onMouseDown: function onMouseDown() {
      event.preventDefault();
      address(HoldScrubber);
    },
    className: (0, _attr.classed)({
      'chart-handle': true,
      'chart-handle--dragging': isDragging
    }),
    style: {
      transform: translateXY(scrubberX, 0)
    }
  }, [_reflex.html.div({
    className: 'chart-handle--cap'
  }), _reflex.html.div({
    className: 'chart-handle--line'
  })])])]);
};

var viewGroup = function viewGroup(model, address, x, plotHeight) {
  var color = model.color;
  var min = model.min;
  var max = model.max;
  var measured = model.measured;
  var desired = model.desired;


  var domain = isNumber(min) && isNumber(max) ? [min, max] : (0, _d3Array.extent)(measured, readY);

  var y = (0, _d3Scale.scaleLinear)().range([plotHeight, 0]).domain(domain);

  var calcLine = (0, _d3Shape.line)().x((0, _functional.compose)(x, readX)).y((0, _functional.compose)(y, readY));

  var desiredPath = svgPath({
    d: calcLine(desired),
    className: 'chart-desired',
    style: {
      stroke: color
    }
  });

  var measuredPath = svgPath({
    d: calcLine(measured),
    className: 'chart-measured',
    style: {
      stroke: color
    }
  });

  return svgG({
    className: 'chart-group'
  }, [desiredPath, measuredPath]);
};

var renderReadout = function renderReadout(group, measured, desired) {
  return _reflex.html.div({
    className: 'chart-readout'
  }, [_reflex.html.div({
    className: 'chart-readout--legend',
    style: {
      backgroundColor: group.color
    }
  }), _reflex.html.span({
    className: 'chart-readout--title'
  }, [group.title]), _reflex.html.span({
    className: 'chart-readout--measured',
    style: {
      color: group.color
    }
  }, [measured]), _reflex.html.span({
    className: 'chart-readout--target'
  }, [(0, _lang.localize)('Target:')]), _reflex.html.span({
    className: 'chart-readout--desired',
    style: {
      color: group.color
    }
  }, [desired])]);
};

var renderMarker = function renderMarker(x, height, text) {
  return svgG({
    className: 'chart-tick',
    transform: 'translate(' + x + ', 0)'
  }, [svgLine({
    className: 'chart-tick--line',
    x2: 0.5,
    y1: 0.5,
    y2: height
  }), svgText({
    className: 'chart-tick--text',
    x: 6.0,
    y: 16.0
  }, [text])]);
};

var renderAxis = function renderAxis(scale, height) {
  var ticks = scale.ticks(_d3Time.timeHour);
  return svgG({
    className: 'chart-time-axis'
  }, ticks.map(function (tick) {
    return renderMarker(scale(tick), height, formatTick(tick));
  }));
};

// Helpers

// Decorate vnode object with namespace property. This is important for SVG
// elements because it signals that VirtualDOM should create them with
// `createElementNS`. If you don't have the svg namespace property on your
// instance, SVG won't render.
var svgNS = function svgNS(vnode) {
  vnode.namespace = 'http://www.w3.org/2000/svg';
  return vnode;
};

// @WORKAROUND
// Define a set of SVG reflex VirtualNode elements that actually work.
// We decorate them with the svg namespace on the way out.
var svg = (0, _functional.compose)(svgNS, _reflex.html.svg);
var svgPath = (0, _functional.compose)(svgNS, _reflex.html.path);
var svgG = (0, _functional.compose)(svgNS, _reflex.html.g);
var svgCircle = (0, _functional.compose)(svgNS, _reflex.html.circle);
var svgLine = (0, _functional.compose)(svgNS, _reflex.html.line);
var svgText = (0, _functional.compose)(svgNS, _reflex.html.text);

var readX = function readX(d) {
  return (
    // Timestamp is in seconds. For x position, read timestamp as ms.
    Math.round(d.timestamp * 1000)
  );
};

var readY = function readY(d) {
  return Number.parseFloat(d.value);
};

var readRecipeTimeValue = function readRecipeTimeValue(d) {
  return Number.parseFloat(d.value) * 1000;
};

var clamp = function clamp(v, min, max) {
  return Math.max(Math.min(v, max), min);
};
var isNumber = function isNumber(x) {
  return typeof x === 'number';
};

// Round to 2 decimal places.
var round2x = function round2x(float) {
  return Math.round(float * 100) / 100;
};

// Given 2 extents, test to see whether they are the same range.
var isSameExtent = function isSameExtent(a, b) {
  return a[0] === b[0] && a[1] === b[1];
};

var calcChartWidth = function calcChartWidth(width) {
  return width - SIDEBAR_WIDTH;
};

var calcChartHeight = function calcChartHeight(height) {
  return height - HEADER_HEIGHT;
};

var calcPlotWidth = function calcPlotWidth(extent, interval, width) {
  var durationMs = extent[1] - extent[0];
  var pxPerMs = width / interval;
  var plotWidth = durationMs * pxPerMs;
  return Math.round(plotWidth);
};

// Make room for tooltip and some padding
var calcPlotHeight = function calcPlotHeight(height, tooltipHeight) {
  return height - (tooltipHeight + SCRUBBER_HEIGHT + TOOLTIP_SPACE * 2);
};

var calcSvgHeight = function calcSvgHeight(height) {
  return height - SCRUBBER_HEIGHT;
};

var calcXhairTickTop = function calcXhairTickTop(height, tooltipHeight) {
  return height - (tooltipHeight + SCRUBBER_HEIGHT + 10 + 3 + TOOLTIP_SPACE);
};

// Calculate the x scale over the whole chart series.
var calcTimeScale = function calcTimeScale(domain, interval, width) {
  return (0, _d3Scale.scaleTime)().domain(domain).range([0, calcPlotWidth(domain, interval, width)]);
};

var calcTooltipX = function calcTooltipX(x, width, tooltipWidth) {
  return clamp(x - tooltipWidth / 2, 0, width - tooltipWidth);
};

var findDataPointFromX = function findDataPointFromX(data, currX, readX) {
  if (data.length > 0) {
    // Used for deriving y value from x position.
    var bisectDate = (0, _d3Array.bisector)(readX).left;
    var i = bisectDate(data, currX, 1);
    var d0 = data[i - 1];
    var d1 = data[i];

    if (d0 && d1) {
      // Pick closer of the two.
      return currX - readX(d0) > readX(d1) - currX ? d1 : d0;
    }
  }
};

// Display y value for x coord. Returns a string.
var displayYValueFromX = function displayYValueFromX(data, currX, readX, readY, unit) {
  var d = findDataPointFromX(data, currX, readX);
  if (d) {
    var yv = round2x(readY(d));
    return yv + unit + '';
  } else {
    return '-';
  }
};

var formatTick = (0, _d3TimeFormat.timeFormat)("%I:%M %p %A, %b %e");
var formatTime = (0, _d3TimeFormat.timeFormat)('%I:%M %p');
var formatDay = (0, _d3TimeFormat.timeFormat)("%A %b %e, %Y");

var px = function px(n) {
  return n + 'px';
};
var translateXY = function translateXY(x, y) {
  return 'translateX(' + x + 'px) translateY(' + y + 'px)';
};

// Calculate the mouse client position relative to a given element.
var calcRelativeMousePos = function calcRelativeMousePos(node, clientX, clientY) {
  var rect = node.getBoundingClientRect();
  return [clientX - rect.left - node.clientLeft, clientY - rect.top - node.clientTop];
};

var getVariable = function getVariable(x) {
  return x.variable;
};

// Advance buffer by one item, removing item to stay under limit.
var advanceBuffer = function advanceBuffer(buffer, item, limit) {
  if (buffer.length < limit) {
    buffer.push(item);
  } else {
    buffer.shift();
    buffer.push(item);
  }
  return buffer;
};

var advanceThresholdBuffer = function advanceThresholdBuffer(buffer, item, limit, threshold, read) {
  var score = read(item);
  return score > threshold ? advanceBuffer(buffer, item, limit) : buffer;
};

// Append n items to end of buffer, removing items from beginning of buffer
// to stay under limit.
var appendThresholdBuffer = function appendThresholdBuffer(buffer, items, limit, threshold, read) {
  var length = items.length;
  for (var i = 0; i < length; i++) {
    advanceThresholdBuffer(buffer, items[i], limit, threshold, read);
  }
  return buffer;
};

var concatMonotonic = function concatMonotonic(buffer, items, limit, readX) {
  // If the buffer is empty, take the fast path out.
  if (buffer.length === 0) {
    return items.slice().sort(descending(readX));
  } else if (items.length === 0) {
    return buffer;
  } else {
    // Find the last largest timestamp.
    var bufferHighScore = readX(last(buffer));
    var sorted = items.slice().sort(descending(readX));
    var itemsHighScore = readX(last(sorted));
    if (itemsHighScore > bufferHighScore) {
      var next = buffer.slice();
      return appendThresholdBuffer(next, items, limit, bufferHighScore, readX);
    } else {
      return buffer;
    }
  }
};

// Check if an item comes after the last item in an array. "Comes after" is
// defined by value returned from `readX`.
var isMonotonic = function isMonotonic(array, item, readX) {
  // If there is no last item in the array, then use 0 as the timestamp.
  var timestamp = (0, _maybe.mapOr)(last(array), readX, 0);
  return readX(item) > timestamp;
};

// Create a comparator for sorting from a read function.
// Returns a comparator function.
var descending = function descending(read) {
  return function (a, b) {
    var fa = read(a);
    var fb = read(b);
    return fa > fb ? 1 : fa < fb ? -1 : 0;
  };
};

var filterAbove = function filterAbove(array, value, read) {
  return array.filter(function (item) {
    return read(item) > value;
  });
};

var last = function last(array) {
  return array.length > 0 ? array[array.length - 1] : null;
};

var isRecipeStart = function isRecipeStart(x) {
  return x.variable === RECIPE_START;
};
var isRecipeEnd = function isRecipeEnd(x) {
  return x.variable === RECIPE_END;
};

},{"../../openag-config.json":94,"../common/attr":98,"../common/cursor":102,"../common/draggable":104,"../common/indexed":107,"../common/lang":109,"../common/maybe":110,"../common/prelude":114,"../common/unknown":121,"../driver/virtual-dom":126,"../lang/find":135,"../lang/functional":136,"d3-array":6,"d3-scale":12,"d3-shape":13,"d3-time":15,"d3-time-format":14,"reflex":65}],129:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Close = exports.Open = exports.TagModal = exports.Configure = undefined;

var _reflex = require('reflex');

var _openagConfig = require('../../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _stache = require('../common/stache');

var Template = _interopRequireWildcard(_stache);

var _prelude = require('../common/prelude');

var _attr = require('../common/attr');

var _modal = require('../common/modal');

var Modal = _interopRequireWildcard(_modal);

var _cursor = require('../common/cursor');

var _lang = require('../common/lang');

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var MAX_DATAPOINTS = 5000;

// Actions

var Configure = exports.Configure = function Configure(origin) {
  return {
    type: 'Configure',
    origin: origin
  };
};

var TagModal = exports.TagModal = (0, _prelude.tag)('Modal');

var Open = exports.Open = TagModal(Modal.Open);
var Close = exports.Close = TagModal(Modal.Close);

// Model init and update

var init = exports.init = function init() {
  return [{
    isOpen: false,
    origin: null
  }, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Modal' ? updateModal(model, action.source) : action.type === 'Configure' ? configure(model, action.origin) : Unknown.update(model, action);
};

var configure = function configure(model, origin) {
  return (0, _prelude.nofx)((0, _prelude.merge)(model, {
    origin: origin
  }));
};

var updateModal = (0, _cursor.cursor)({
  update: Modal.update,
  tag: TagModal
});

// View

var view = exports.view = function view(model, address, environmentID) {
  var variables = Config.chart.map(readVariable);

  return _reflex.html.div({
    className: 'modal',
    hidden: (0, _attr.toggle)(!model.isOpen, 'hidden')
  }, [_reflex.html.div({
    className: 'modal-overlay',
    onClick: function onClick() {
      return address(Close);
    }
  }), _reflex.html.dialog({
    className: 'modal-main modal-main--menu',
    open: (0, _attr.toggle)(model.isOpen, 'open')
  }, [_reflex.html.div({
    className: 'panels--main'
  }, [_reflex.html.div({
    className: 'panel--main panel--lv0'
  }, [_reflex.html.header({
    className: 'panel--header'
  }, [_reflex.html.h1({
    className: 'panel--title'
  }, [(0, _lang.localize)('Export CSV')])]), _reflex.html.div({
    className: 'panel--content'
  }, [_reflex.html.ul({
    className: 'menu-list'
  }, Config.chart.map(function (config) {
    return renderExport(model.origin, environmentID, config.variable, config.title);
  }))])])])])]);
};

var renderExport = function renderExport(origin, environmentID, variable, title) {
  return _reflex.html.li({}, [_reflex.html.a({
    target: '_blank',
    href: templateCsvUrl(origin, environmentID, variable)
  }, [title])]);
};

var templateCsvUrl = function templateCsvUrl(origin, environmentID, variable) {
  return Template.render(Config.environmental_data_point.origin_by_variable_csv, {
    origin_url: origin,
    startkey: JSON.stringify([environmentID, variable, 'measured', {}]),
    endkey: JSON.stringify([environmentID, variable, 'measured']),
    limit: MAX_DATAPOINTS,
    group_level: 4,
    descending: true
  });
};

var readVariable = function readVariable(d) {
  return d.variable;
};

},{"../../openag-config.json":94,"../common/attr":98,"../common/cursor":102,"../common/lang":109,"../common/modal":111,"../common/prelude":114,"../common/stache":119,"../common/unknown":121,"reflex":65}],130:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.SetRecipe = exports.TagRecipe = exports.SetAirTemperature = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _prelude = require('../common/prelude');

var _cursor = require('../common/cursor');

var _functional = require('../lang/functional');

var _unknown = require('../common/unknown');

var _recipe = require('./sidebar/recipe');

var Recipe = _interopRequireWildcard(_recipe);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Actions

// Request that the recipes view be opened.
var RequestOpenRecipes = {
  type: 'RequestOpenRecipes'
};

// Set air temperature in sidebar
var SetAirTemperature = exports.SetAirTemperature = function SetAirTemperature(value) {
  return {
    type: 'SetAirTemperature',
    value: value
  };
};

// Tag sidebar recipe actions so we can forward them down.
var TagRecipe = exports.TagRecipe = function TagRecipe(action) {
  return action.type === 'RequestOpenRecipes' ? RequestOpenRecipes : (0, _prelude.tagged)('Recipe', action);
};

// Set recipe on Recipe submodule.
var SetRecipe = exports.SetRecipe = (0, _functional.compose)(TagRecipe, Recipe.SetRecipe);

// Model, init, update

var init = exports.init = function init() {
  var _Recipe$init = Recipe.init();

  var _Recipe$init2 = _slicedToArray(_Recipe$init, 2);

  var recipe = _Recipe$init2[0];
  var recipeFx = _Recipe$init2[1];


  return [{
    recipe: recipe,
    airTemperature: null
  }, recipeFx.map(TagRecipe)];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Recipe' ? updateRecipe(model, action.source) : action.type === 'SetAirTemperature' ? setAirTemperature(model, action.value) : (0, _unknown.update)(model, action);
};

var updateRecipe = (0, _cursor.cursor)({
  get: function get(model) {
    return model.recipe;
  },
  set: function set(model, recipe) {
    return (0, _prelude.merge)(model, { recipe: recipe });
  },
  update: Recipe.update,
  tag: TagRecipe
});

var setAirTemperature = function setAirTemperature(model, airTemperature) {
  return airTemperature != null ? [(0, _prelude.merge)(model, { airTemperature: airTemperature }), _reflex.Effects.none] : [model, _reflex.Effects.none];
};

// View

var view = exports.view = function view(model, address) {
  return _reflex.html.aside({
    className: 'sidebar-summary'
  }, [_reflex.html.div({
    className: 'sidebar-summary--in'
  }, [(0, _reflex.thunk)('sidebar-recipe', Recipe.view, model.recipe, (0, _reflex.forward)(address, TagRecipe)), viewAirTemperature(model.airTemperature)])]);
};

var UNIT = '°';

var viewAirTemperature = function viewAirTemperature(airTemperature) {
  if (airTemperature == null) {
    return _reflex.html.div({
      className: 'env-temperature env-temperature--large'
    }, ['-']);
  } else {
    return _reflex.html.div({
      className: 'env-temperature env-temperature--large'
    }, [readTemperature(airTemperature), _reflex.html.span({
      className: 'env-temperature--unit'
    }, [UNIT])]);
  }
};

var readTemperature = function readTemperature(value) {
  return Math.round(value) + '';
};

},{"../common/cursor":102,"../common/prelude":114,"../common/unknown":121,"../lang/functional":136,"./sidebar/recipe":131,"reflex":65}],131:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.SetRecipe = exports.RequestOpenRecipes = undefined;

var _reflex = require('reflex');

var _prelude = require('../../common/prelude');

var _lang = require('../../common/lang');

var _unknown = require('../../common/unknown');

// Actions

var RequestOpenRecipes = exports.RequestOpenRecipes = {
  type: 'RequestOpenRecipes'
};

// Set the recipe
var SetRecipe = exports.SetRecipe = function SetRecipe(recipe) {
  return {
    type: 'SetRecipe',
    recipe: recipe
  };
};

// Model, init, update

// Empty model that we can re-use.
var Empty = Object.freeze({
  id: null,
  name: null
});

var init = exports.init = function init() {
  return [
  // Initialize in empty state
  Empty, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'SetRecipe' ? setRecipe(model, action.recipe) : (0, _unknown.update)(model, action);
};

var setRecipe = function setRecipe(model, recipe) {
  return [(0, _prelude.merge)(model, {
    id: recipe._id,
    name: recipe.name || recipe._id
  }), _reflex.Effects.none];
};

// View

var view = exports.view = function view(model, address) {
  return _reflex.html.div({
    className: 'current-recipe'
  }, [_reflex.html.div({
    className: 'current-recipe--label'
  }, [(0, _lang.localize)('Recipe')]), _reflex.html.a({
    className: 'current-recipe--name',
    onClick: function onClick(event) {
      event.preventDefault();
      address(RequestOpenRecipes);
    }
  }, [readName(model)])]);
};

// Read name from model, or use fallback.
var readName = function readName(model) {
  return model.name ? model.name : (0, _lang.localize)('None');
};

},{"../../common/lang":109,"../../common/prelude":114,"../../common/unknown":121,"reflex":65}],132:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.OpenExporter = undefined;

var _reflex = require('reflex');

var _lang = require('../common/lang');

var _stache = require('../common/stache');

var Template = _interopRequireWildcard(_stache);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var MAX_DATAPOINTS = 100000; /*
                             Chart toolbox (export, etc)
                             */
var OpenExporter = exports.OpenExporter = {
  type: 'OpenExporter'
};

var view = exports.view = function view(model, address) {
  return _reflex.html.menu({
    className: 'chart-toolbox'
  }, [_reflex.html.li({}, [_reflex.html.a({
    onClick: function onClick(event) {
      event.preventDefault();
      address(OpenExporter);
    },
    className: 'chart-toolbox--cmd chart-toolbox--cmd-export ir',
    title: (0, _lang.localize)('Export CSV')
  }, [(0, _lang.localize)('Export CSV')])])]);
};

},{"../common/lang":109,"../common/stache":119,"reflex":65}],133:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.init = exports.Restore = exports.Configure = undefined;

var _reflex = require('reflex');

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _pouchdbBrowser = require('pouchdb-browser');

var _pouchdbBrowser2 = _interopRequireDefault(_pouchdbBrowser);

var _database = require('./common/database');

var Database = _interopRequireWildcard(_database);

var _stache = require('./common/stache');

var _prelude = require('./common/prelude');

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Initialize local DB
var DB = new _pouchdbBrowser2.default(Config.environments.local);

// Actions

// Configuration action comes from parent.
var Configure = exports.Configure = function Configure(origin) {
  return {
    type: 'Configure',
    origin: origin
  };
};

// Request restore of in-memory model from local db.
var Restore = exports.Restore = { type: 'Restore' };

var Restored = function Restored(result) {
  return {
    type: 'Restored',
    result: result
  };
};

var Sync = function Sync(replica) {
  return {
    type: 'Sync',
    replica: replica
  };
};

var Synced = function Synced(result) {
  return {
    type: 'Synced',
    result: result
  };
};

// Model, init, update

var init = exports.init = function init() {
  return [{
    origin: null,
    environments: []
  }, _reflex.Effects.none];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Configure' ? configure(model, action.origin) : action.type === 'Restore' ? [model, Database.restore(DB).map(Restored)] : action.type === 'Restored' ? action.result.isOk ? restoredOk(model, action.result.value) : restoredError(model, action.result.error) : action.type === 'Sync' ? [model, Database.sync(DB, action.replica).map(Synced)] : action.type === 'Synced' ? action.result.isOk ? syncedOk(model, action.result.value) : syncedError(model, action.result.error) : Unknown.update(model, action);
};

var restoredOk = function restoredOk(model, record) {
  var ids = record.map(readDoc);

  return [(0, _prelude.merge)(model, { environments: ids }), _reflex.Effects.none];
};

var restoredError = function restoredError(model, error) {
  // @TODO error banner
  console.warn("Could not restore from environments database");
  return [model, _reflex.Effects.none];
};

var syncedOk = function syncedOk(model, value) {
  return (
    // If sync succeeded, restore from local db.
    update(model, Restore)
  );
};

var syncedError = function syncedError(model, error) {
  console.warn("Could not connect to environments cloud DB");
  return [model, _reflex.Effects.none];
};

// @TODO consider storing origin url in database? Or is this prone to attack?
var configure = function configure(model, originUrl) {
  // Template origin of environments database using root couchdb url sent via
  // configure action.
  var origin = (0, _stache.render)(Config.environments.origin, {
    origin_url: originUrl
  });

  return [
  // Merge origin url into model
  (0, _prelude.merge)(model, {
    origin: origin
  }),
  // Request a sync using the origin.
  _reflex.Effects.receive(Sync(origin))];
};

// Helpers

var readDoc = function readDoc(doc) {
  return {
    _id: doc._id,
    name: doc.name
  };
};

},{"../openag-config.json":94,"./common/database":103,"./common/prelude":114,"./common/stache":119,"./common/unknown":121,"pouchdb-browser":35,"reflex":65}],134:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewFTU = exports.update = exports.init = exports.Close = exports.Open = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         This module provides the "First Time Use" experience for the app.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         We need a few important details for the app to function -- IP address or web
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         address of the Food Computer, that kind of thing. If we don't have that info,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         we prompt the user to go through the FTU. This should only happen once. The
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         information is stored in the browser's local storage via PouchDB.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Includes settings (like IP address of app) and, in future, log-in creds.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */


var _reflex = require('reflex');

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _pouchdbBrowser = require('pouchdb-browser');

var _pouchdbBrowser2 = _interopRequireDefault(_pouchdbBrowser);

var _database = require('./common/database');

var Database = _interopRequireWildcard(_database);

var _validator = require('./common/validator');

var Validator = _interopRequireWildcard(_validator);

var _select = require('./common/select');

var Select = _interopRequireWildcard(_select);

var _option = require('./common/option');

var _button = require('./common/button');

var Button = _interopRequireWildcard(_button);

var _modal = require('./common/modal');

var Modal = _interopRequireWildcard(_modal);

var _stache = require('./common/stache');

var Template = _interopRequireWildcard(_stache);

var _request = require('./common/request');

var Request = _interopRequireWildcard(_request);

var _result = require('./common/result');

var Result = _interopRequireWildcard(_result);

var _url = require('./common/url');

var _prelude = require('./common/prelude');

var _attr = require('./common/attr');

var _cursor = require('./common/cursor');

var _lang = require('./common/lang');

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _functional = require('./lang/functional');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Create a PouchDB instance for the local environments db, so we can
// sync to it.
var DB = new _pouchdbBrowser2.default(Config.environments.local);

// Actions

var TagModal = (0, _prelude.tag)('Modal');

var Open = exports.Open = TagModal(Modal.Open);
var Close = exports.Close = TagModal(Modal.Close);

var SyncEnvironments = function SyncEnvironments(origin) {
  return {
    type: 'SyncEnvironments',
    origin: origin
  };
};

var SyncedEnvironments = function SyncedEnvironments(result) {
  return {
    type: 'SyncedEnvironments',
    result: result
  };
};

var RestoreEnvironments = { type: 'RestoreEnvironments' };

var RestoredEnvironments = function RestoredEnvironments(result) {
  return {
    type: 'RestoredEnvironments',
    result: result
  };
};

var TagEnvironments = function TagEnvironments(action) {
  return (0, _prelude.tagged)('Environments', action);
};

var EnvironmentsOptions = (0, _functional.compose)(TagEnvironments, Select.Options);

var TagName = function TagName(action) {
  return action.type === 'Validate' ? TryName(action.value) : (0, _prelude.tagged)('Name', action);
};

var NameOk = (0, _functional.compose)(TagName, Validator.Ok);
var NameError = (0, _functional.compose)(TagName, Validator.Error);

var TryName = function TryName(value) {
  return {
    type: 'TryName',
    value: value
  };
};

var TryAddress = function TryAddress(value) {
  return {
    type: 'TryAddress',
    value: value
  };
};

// Test connection to PFC
var GetHeartbeat = function GetHeartbeat(url) {
  return {
    type: 'GetHeartbeat',
    url: url
  };
};

var GotHeartbeat = function GotHeartbeat(result) {
  return {
    type: 'GotHeartbeat',
    result: result
  };
};

// Let the parent know we had a successful form submit.
var NotifySubmit = function NotifySubmit(form) {
  return {
    type: 'NotifySubmit',
    form: form
  };
};

var TagAddress = function TagAddress(action) {
  return action.type === 'Validate' ? TryAddress(action.value) : action.type === 'Rest' ? RestAddress : (0, _prelude.tagged)('Address', action);
};

var AddressOk = (0, _functional.compose)(TagAddress, Validator.Ok);
var AddressError = (0, _functional.compose)(TagAddress, Validator.Error);

var RestAddress = { type: 'RestAddress' };

var Submit = { type: 'Submit' };

var TagSubmitter = function TagSubmitter(action) {
  return action.type === 'Click' ? Submit : (0, _prelude.tagged)('Submitter', action);
};

var EnableSubmitter = TagSubmitter(Button.Enable);
var DisableSubmitter = TagSubmitter(Button.Disable);

// Model and update

var init = exports.init = function init() {
  var host = window.location.host;

  var _Validator$init = Validator.init('', (0, _lang.localize)('Name your Food Computer'), chooseRandom(NAMES), null, false, false);

  var _Validator$init2 = _slicedToArray(_Validator$init, 2);

  var name = _Validator$init2[0];
  var nameFx = _Validator$init2[1];

  var _Validator$init3 = Validator.init(host, (0, _lang.localize)('The web or IP address of your Food Computer'), (0, _lang.localize)('0.0.0.0'), null, false, false);

  var _Validator$init4 = _slicedToArray(_Validator$init3, 2);

  var address = _Validator$init4[0];
  var addressFx = _Validator$init4[1];

  var _Select$init = Select.init();

  var _Select$init2 = _slicedToArray(_Select$init, 2);

  var environments = _Select$init2[0];
  var environmentsFx = _Select$init2[1];

  var _Button$init = Button.init((0, _lang.localize)('Save'), false, true, false, false);

  var _Button$init2 = _slicedToArray(_Button$init, 2);

  var submitter = _Button$init2[0];
  var submitterFx = _Button$init2[1];


  return [{
    isOpen: false,
    name: name,
    address: address,
    submitter: submitter,
    environments: environments
  }, _reflex.Effects.batch([addressFx.map(TagAddress), nameFx.map(TagName), submitterFx.map(TagSubmitter), environmentsFx.map(TagEnvironments)])];
};

var update = exports.update = function update(model, action) {
  return action.type === 'Modal' ? updateModal(model, action.source) : action.type === 'Address' ? updateAddress(model, action.source) : action.type === 'Submitter' ? updateSubmitter(model, action.source) : action.type === 'Name' ? updateName(model, action.source) : action.type === 'Environments' ? updateEnvironments(model, action.source) : action.type === 'Submit' ? submit(model) : action.type === 'TryName' ? tryName(model, action.value) : action.type === 'TryAddress' ? tryAddress(model, action.value) : action.type === 'RestAddress' ? restAddress(model) : action.type === 'GetHeartbeat' ? getHeartbeat(model, action.url) : action.type === 'GotHeartbeat' ? gotHeartbeat(model, action.result) : action.type === 'SyncEnvironments' ?
  // Currently we keep environments database in the environments module.
  // Send request up to parent to get this info.
  syncEnvironments(model, action.origin) : action.type === 'SyncedEnvironments' ? action.result.isOk ? syncedEnvironmentsOk(model, action.result.value) : syncedEnvironmentsError(model, action.result.error) : action.type === 'RestoreEnvironments' ? [model, Database.restore(DB).map(RestoredEnvironments)] : action.type === 'RestoredEnvironments' ? action.result.isOk ? restoredEnvironmentsOk(model, action.result.value) : restoredEnvironmentsError(model, action.result.error) : Unknown.update(model, action);
};

var updateModal = (0, _cursor.cursor)({
  update: Modal.update,
  tag: TagModal
});

var updateAddress = (0, _cursor.cursor)({
  get: function get(model) {
    return model.address;
  },
  set: function set(model, address) {
    return (0, _prelude.merge)(model, { address: address });
  },
  update: Validator.update,
  tag: TagAddress
});

var updateName = (0, _cursor.cursor)({
  get: function get(model) {
    return model.name;
  },
  set: function set(model, name) {
    return (0, _prelude.merge)(model, { name: name });
  },
  update: Validator.update,
  tag: TagName
});

var updateEnvironments = (0, _cursor.cursor)({
  get: function get(model) {
    return model.environments;
  },
  set: function set(model, environments) {
    return (0, _prelude.merge)(model, { environments: environments });
  },
  update: Select.update,
  tag: TagEnvironments
});

var updateSubmitter = (0, _cursor.cursor)({
  get: function get(model) {
    return model.submitter;
  },
  set: function set(model, submitter) {
    return (0, _prelude.merge)(model, { submitter: submitter });
  },
  update: Button.update,
  tag: TagSubmitter
});

var submit = function submit(model) {
  // We only care about validating the address. Any name will do.
  if (Validator.isOk(model.address)) {
    var addressValue = Validator.readValue(model.address);
    var rootUrl = (0, _url.readRootUrl)(addressValue);

    // Given root URL, template API url.
    var api = Template.render(Config.api, {
      root_url: rootUrl
    });

    // Given root URL, origin CouchDB url.
    var origin = Template.render(Config.origin, {
      root_url: rootUrl
    });

    var nameValue = Validator.readValue(model.name);
    var environmentName = readName(nameValue);

    var environmentID = Select.readValue(model.environments);

    // Construct form message to send up to app.
    var form = {
      environment: {
        id: environmentID,
        name: environmentName
      },
      api: api,
      origin: origin
    };

    return [model, _reflex.Effects.receive(NotifySubmit(form))];
  }
  // We should never be able to hit this case.
  else {
      console.warn('First time use form was submitted, but url was not valid.');
      return [model, _reflex.Effects.none];
    }
};

var tryAddress = function tryAddress(model, value) {
  try {
    // Attempt to read a valid URL from user input. 
    var url = (0, _url.readRootUrl)(value);
    return update(model, GetHeartbeat(url));
  } catch (e) {
    // Otherwise, send an address error.
    var message = (0, _lang.localize)("Need a valid URL or IP address");
    return update(model, AddressError(message));
  }
};

var restAddress = function restAddress(model) {
  var _updateAddress = updateAddress(model, Validator.Rest);

  var _updateAddress2 = _slicedToArray(_updateAddress, 2);

  var one = _updateAddress2[0];
  var oneFx = _updateAddress2[1];

  var _updateSubmitter = updateSubmitter(one, Button.Disable);

  var _updateSubmitter2 = _slicedToArray(_updateSubmitter, 2);

  var two = _updateSubmitter2[0];
  var twoFx = _updateSubmitter2[1];


  return [two, _reflex.Effects.batch([oneFx, twoFx])];
};

var getHeartbeat = function getHeartbeat(model, url) {
  var heartbeatUrl = Template.render(Config.heartbeat, {
    root_url: url
  });

  return [model, Request.get(heartbeatUrl).map(GotHeartbeat)];
};

var gotHeartbeat = Result.updater(function (model, value) {
  var message = (0, _lang.localize)('Success! Connected to Food Computer.');

  var addressValue = Validator.readValue(model.address);
  var rootUrl = (0, _url.readRootUrl)(addressValue);

  // Given root URL, origin CouchDB url.
  var origin = Template.render(Config.origin, {
    root_url: rootUrl
  });

  return (0, _prelude.batch)(update, model, [AddressOk(message), SyncEnvironments(origin)]);
}, function (model, error) {
  return update(model, AddressError(error));
});

var syncEnvironments = function syncEnvironments(model, origin) {
  // Render environment url
  var environments = Template.render(Config.environments.origin, {
    origin_url: origin
  });

  return [model, Database.sync(DB, environments).map(SyncedEnvironments)];
};

var syncedEnvironmentsOk = function syncedEnvironmentsOk(model, value) {
  return update(model, RestoreEnvironments);
};

var syncedEnvironmentsError = function syncedEnvironmentsError(model, error) {
  // @FIXME error banner or some feedback.
  return [model, _reflex.Effects.none];
};

var restoredEnvironmentsOk = function restoredEnvironmentsOk(model, rows) {
  var options = rows.map(readOptionFromRecord);

  return (0, _prelude.batch)(update, model, [
  // Fill select box with options.
  EnvironmentsOptions(options),
  // Enable submit button, because we're in a valid state now.
  EnableSubmitter]);
};

var restoredEnvironmentsError = function restoredEnvironmentsError(model, error) {
  // @FIXME error banner or some feedback.
  return [model, _reflex.Effects.none];
};

var tryName = function tryName(model, value) {
  var message = chooseRandom(NAME_MESSAGES);
  return update(model, NameOk(message));
};

// View

var viewFTU = exports.viewFTU = function viewFTU(model, address) {
  return _reflex.html.div({
    className: 'ftu'
  }, [_reflex.html.dialog({
    className: (0, _attr.classed)({
      'ftu-window': true,
      'ftu-window--close': !model.isOpen
    }),
    open: (0, _attr.toggle)(model.isOpen, 'open')
  }, [_reflex.html.div({
    className: 'panels--main'
  }, [_reflex.html.div({
    className: 'panel--main panel--lv0'
  }, [_reflex.html.header({
    className: 'panel--header'
  }, [_reflex.html.h1({
    className: 'panel--title'
  }, [(0, _lang.localize)('Welcome')]), _reflex.html.div({
    className: 'panel--nav-right'
  }, [(0, _reflex.thunk)('submit', Button.view, model.submitter, (0, _reflex.forward)(address, TagSubmitter), 'btn-panel')])]), _reflex.html.div({
    className: 'panel--content'
  }, [_reflex.html.div({
    className: 'panel--in'
  }, [_reflex.html.p({}, [(0, _lang.localize)("It's almost time to get planting! We just need a few details to get your Food Computer up and running.")]), (0, _reflex.thunk)('ftu-validator-name', Validator.view, model.name, (0, _reflex.forward)(address, TagName), 'ftu-validator'), (0, _reflex.thunk)('ftu-validator-address', Validator.view, model.address, (0, _reflex.forward)(address, TagAddress), 'ftu-validator'), _reflex.html.div({
    className: 'labeled'
  }, [(0, _reflex.thunk)('ftu-select-environment', Select.view, model.environments, (0, _reflex.forward)(address, TagEnvironments), 'select ftu-select'), _reflex.html.label({
    className: 'labeled--label'
  }, [(0, _lang.localize)('Choose an environment')])]), _reflex.html.p({
    className: 'tip'
  }, [_reflex.html.b({}, ['Tip:']), ' ', (0, _lang.localize)("don't know how to find the IP address of your Food Computer? Try using Adafruit's Raspberry Pi Finder.")])])])])])])]);
};

// Helpers

var ALL_SPACES = /^\s*$/;

var DEFAULT_NAME = (0, _lang.localize)('Food Computer');

var NAMES = ['Bert', 'Alice', 'Bob', 'Foody McFoodface', 'Planty McPlantface', 'Audrey II', 'Hal 9000', 'Bender', 'Calculon', 'Optimus Prime', 'T-1000', 'Bill Murray', 'Eve', 'Wall-E', 'Marvin', 'Rosie', 'Tom Servo', 'Ultron', 'Dalek', 'Baymax', 'GLaDOS', 'Astro Boy', 'Voltron', 'Megatron'];

var NAME_MESSAGES = [(0, _lang.localize)('Good choice!'), (0, _lang.localize)('Good name!'), (0, _lang.localize)('Good one!'), (0, _lang.localize)('You picked a good one!'), (0, _lang.localize)("It's a good name."), (0, _lang.localize)("That's a nice name."), (0, _lang.localize)('One in a million!')];

var chooseRandom = function chooseRandom(array) {
  var i = Math.floor(Math.random() * array.length);
  return array[i];
};

var readName = function readName(name) {
  return name.search(ALL_SPACES) === -1 ? name : DEFAULT_NAME;
};

var readOptionFromRecord = function readOptionFromRecord(_ref) {
  var _id = _ref._id;
  return (0, _option.assemble)(_id, _id, _id, false);
};

},{"../openag-config.json":94,"./common/attr":98,"./common/button":100,"./common/cursor":102,"./common/database":103,"./common/lang":109,"./common/modal":111,"./common/option":112,"./common/prelude":114,"./common/request":115,"./common/result":116,"./common/select":118,"./common/stache":119,"./common/unknown":121,"./common/url":122,"./common/validator":123,"./lang/functional":136,"pouchdb-browser":35,"reflex":65}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A simple implementation of Array.find (which is not available in IE).
var find = exports.find = function find(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
};

// Find an item in array, starting from right side of array and working
// toward the left.
// Returns result or null.
var findRight = exports.findRight = function findRight(array, predicate) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
};

},{}],136:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var compose = exports.compose = function compose() {
  for (var _len = arguments.length, lambdas = Array(_len), _key = 0; _key < _len; _key++) {
    lambdas[_key] = arguments[_key];
  }

  /**
  Returns the composition of a list of functions, where each function
  consumes the return value of the function that follows. In math
  terms, composing the functions `f()`, `g()`, and `h()` produces
  `f(g(h()))`.
  Usage:
   var square = function(x) { return x * x }
  var increment = function(x) { return x + 1 }
   var f1 = compose(increment, square)
  f1(5) // => 26
   var f2 = compose(square, increment)
  f2(5) // => 36
  **/

  var composed = function composed() {
    var index = lambdas.length;
    var result = lambdas[--index].apply(lambdas, arguments);
    while (--index >= 0) {
      result = lambdas[index](result);
    }
    return result;
  };
  composed.lambdas = lambdas;
  composed.toString = compose$toString;
  return composed;
};
// For debugging and errors
var compose$toString = function compose$toString() {
  return 'compose(' + this.lambdas.join(', ') + ')';
};

var partial = exports.partial = function partial(lambda) {
  for (var _len2 = arguments.length, curried = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    curried[_key2 - 1] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, passed = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      passed[_key3] = arguments[_key3];
    }

    return lambda.apply(undefined, curried.concat(passed));
  };
};

var identity = exports.identity = function identity(value) {
  return value;
};

var constant = exports.constant = function constant(value) {
  return function () {
    return value;
  };
};

},{}],137:[function(require,module,exports){
'use strict';

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _reflex = require('reflex');

var _reflexVirtualDomDriver = require('reflex-virtual-dom-driver');

var _devtools = require('./devtools');

var Devtools = _interopRequireWildcard(_devtools);

var _app = require('./app');

var App = _interopRequireWildcard(_app);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Start app
var application = (0, _reflex.start)({
  flags: { Debuggee: App },
  init: Devtools.init,
  // If in debug mode, log all actions and effects.
  update: Devtools.update,
  view: Devtools.view
});

window.application = application;

var renderer = new _reflexVirtualDomDriver.Renderer({ target: document.body });
application.view.subscribe(renderer.address);
application.task.subscribe(_reflex.Effects.driver(application.address));

},{"../openag-config.json":94,"./app":96,"./devtools":124,"reflex":65,"reflex-virtual-dom-driver":57}],138:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.PutState = exports.GetState = exports.NotifyFirstTimeUse = exports.FirstTimeUse = undefined;

var _reflex = require('reflex');

var _pouchdbBrowser = require('pouchdb-browser');

var _pouchdbBrowser2 = _interopRequireDefault(_pouchdbBrowser);

var _package = require('../package.json');

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _prelude = require('./common/prelude.js');

var _result = require('./common/result');

var Result = _interopRequireWildcard(_result);

var _database = require('./common/database');

var Database = _interopRequireWildcard(_database);

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Database configuration
// Create Databbase interface for database name listed in config.


// Import package.json version for app version.
// Note: it is important to change the package version number if the record
// data structure changes. Otherwise user's persisted data will not match what
// app expects.
/*
This module provides local persistence for app state.

This includes settings (like IP address of app) and, in future, log-in creds.
*/
var DB = new _pouchdbBrowser2.default(Config.app.local);

// Actions

var FirstTimeUse = exports.FirstTimeUse = { type: 'FirstTimeUse' };
var NotifyFirstTimeUse = exports.NotifyFirstTimeUse = { type: 'NotifyFirstTimeUse' };

var GetState = exports.GetState = { type: 'GetState' };

var GotState = function GotState(result) {
  return {
    type: 'GotState',
    result: result
  };
};

var PutState = exports.PutState = function PutState(value) {
  return {
    type: 'PutState',
    value: value
  };
};

var PuttedState = function PuttedState(result) {
  return {
    type: 'PuttedState',
    result: result
  };
};

var Migrate = function Migrate(value) {
  return {
    type: 'Migrate',
    value: value
  };
};

var Restore = function Restore(value) {
  return {
    type: 'Restore',
    value: value
  };
};

var NotifyRestore = function NotifyRestore(value) {
  return {
    type: 'NotifyRestore',
    value: value
  };
};

var NotifyBanner = function NotifyBanner(message) {
  return {
    type: 'NotifyBanner',
    message: message
  };
};

// Deals with migrating old record data structures to new record data structures.
// We keep cycling from migrations (from one to the next) until we reach the
// current version.
var migrate = function migrate(record) {
  return record.version === _package.version ? record : migrateUnknown(record);
};

var migrateUnknown = function migrateUnknown(record) {
  console.warn('Unknown state version ' + record.version);
  return null;
};

// Model and update

var update = exports.update = function update(model, action) {
  return action.type === 'GetState' ? [model, Database.get(DB, model._id).map(GotState)] : action.type === 'GotState' ? updateGotState(model, action.result) : action.type === 'FirstTimeUse' ?
  // Send up an action for parent to deal with.
  [model, _reflex.Effects.receive(NotifyFirstTimeUse)] : action.type === 'Migrate' ? updateMigrate(model, action.value) : action.type === 'Restore' ?
  // Forward up the restore for parent to deal with.
  updateRestore(model, action.value) : action.type === 'PutState' ? [model, Database.put(DB, action.value).map(PuttedState)] : action.type === 'PuttedState' ? updatePuttedState(model, action.result) : Unknown.update(model, action);
};

// Handle results of fetching state from database.
var updateGotState = Result.updater(function (model, record) {
  return record.version !== _package.version ?
  // If state was found,
  // and the app is in initial state,
  // but version does not match application version,
  // then attempt to migrate the state.
  update(model, Migrate(record)) :

  // If state was found
  // and app is in initial state
  // and version matches application version.
  update(model, Restore(record));
},
// If no state was found,
// then start in initial state (show the FTU experience).
function (model, error) {
  return update(model, FirstTimeUse);
});

//
var updatePuttedState = Result.updater(function (model, record) {
  // Merge rev from successful put into model.
  // See https://pouchdb.com/api.html#create_document for example response.
  var next = (0, _prelude.merge)(model, { _rev: record.rev });

  return [next, _reflex.Effects.none];
}, function (model, error) {
  var message = localize("Couldn't save to settings database");
  var action = NotifyBanner(message);

  return [model, _reflex.Effects.receive(action)];
});

var updateRestore = function updateRestore(model, record) {
  return [(0, _prelude.merge)(model, {
    _id: record._id,
    _rev: record._rev
  }), _reflex.Effects.receive(NotifyRestore(record))];
};

var updateMigrate = function updateMigrate(model, record) {
  var migrated = migrate(record);

  var action =
  // if migration was successful, then restore with updated record.
  migrated !== null ? Restore(migrated) :
  // otherwise, we have no choice but to go through FTU again.
  FirstTimeUse;

  return update(model, action);
};

},{"../openag-config.json":94,"../package.json":95,"./common/database":103,"./common/prelude.js":114,"./common/result":116,"./common/unknown":121,"pouchdb-browser":35,"reflex":65}],139:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Activate = undefined;

var _reflex = require('reflex');

var _prelude = require('./common/prelude');

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Activate = exports.Activate = {
  type: 'Activate'
};

var init = exports.init = function init(_ref) {
  var _id = _ref._id;
  var operation = _ref.operation;
  return (
    // @TODO build model from database type
    {
      _id: _id,
      operation: operation,
      format: 'linear@0.0.1'
    }
  );
};

var update = exports.update = function update(model, action) {
  return Unknown.update(model, action);
};

var view = exports.view = function view(model, address) {
  return _reflex.html.div({
    className: 'recipe',
    onClick: function onClick() {
      return address(Activate);
    }
  }, [String(model._id)]);
};

},{"./common/prelude":114,"./common/unknown":121,"reflex":65}],140:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.RequestStart = exports.StartByID = exports.Close = exports.Open = exports.Configure = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reflex = require('reflex');

var _openagConfig = require('../openag-config.json');

var Config = _interopRequireWildcard(_openagConfig);

var _pouchdbBrowser = require('pouchdb-browser');

var _pouchdbBrowser2 = _interopRequireDefault(_pouchdbBrowser);

var _stache = require('./common/stache');

var Template = _interopRequireWildcard(_stache);

var _database = require('./common/database');

var Database = _interopRequireWildcard(_database);

var _indexed = require('./common/indexed');

var Indexed = _interopRequireWildcard(_indexed);

var _unknown = require('./common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _result = require('./common/result');

var Result = _interopRequireWildcard(_result);

var _banner = require('./common/banner');

var Banner = _interopRequireWildcard(_banner);

var _prelude = require('./common/prelude');

var _modal = require('./common/modal');

var Modal = _interopRequireWildcard(_modal);

var _cursor = require('./common/cursor');

var _attr = require('./common/attr');

var _lang = require('./common/lang');

var _functional = require('./lang/functional');

var _form = require('./recipes/form');

var RecipesForm = _interopRequireWildcard(_form);

var _recipe = require('./recipe');

var Recipe = _interopRequireWildcard(_recipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DB = new _pouchdbBrowser2.default(Config.recipes.local);
// Export for debugging
window.RecipesDB = DB;

var getPouchID = Indexed.getter('_id');

// Actions and tagging functions

var TagIndexed = function TagIndexed(source) {
  return {
    type: 'Indexed',
    source: source
  };
};

var Activate = (0, _functional.compose)(TagIndexed, Indexed.Activate);

var TagModal = (0, _prelude.tag)('Modal');

var TagBanner = function TagBanner(source) {
  return {
    type: 'Banner',
    source: source
  };
};

var AlertRefreshable = (0, _functional.compose)(TagBanner, Banner.AlertRefreshable);
var AlertDismissable = (0, _functional.compose)(TagBanner, Banner.AlertDismissable);
var FailRecipeStart = AlertDismissable("Blarg! Couldn't start recipe");

var RecipesFormAction = function RecipesFormAction(action) {
  return action.type === 'Back' ? ActivatePanel(null) : action.type === 'Submitted' ? Put(action.recipe) : (0, _prelude.tagged)('RecipesForm', action);
};

var RecipeAction = function RecipeAction(id, action) {
  return action.type === 'Activate' ? StartByID(id) : {
    type: 'Recipe',
    id: id,
    source: action
  };
};

var ByID = function ByID(id) {
  return function (action) {
    return RecipeAction(id, action);
  };
};

// This action handles information restored from the parent.
var Configure = exports.Configure = function Configure(origin) {
  return {
    type: 'Configure',
    origin: origin
  };
};

// Restore recipes in-memory from PouchDB
var RestoreRecipes = { type: 'RestoreRecipes' };

// Response from recipe restore
var RestoredRecipes = function RestoredRecipes(result) {
  return {
    type: 'RestoredRecipes',
    result: result
  };
};

var Put = Database.Put;
var Putted = Database.Putted;

// Request database sync
var Sync = { type: 'Sync' };
// Confirm sync.
var Synced = Database.Synced;

var Open = exports.Open = TagModal(Modal.Open);
var Close = exports.Close = TagModal(Modal.Close);

var StartByID = exports.StartByID = function StartByID(id) {
  return {
    type: 'StartByID',
    id: id
  };
};

var RequestStart = exports.RequestStart = function RequestStart(value) {
  return {
    type: 'RequestStart',
    value: value
  };
};

var ActivatePanel = function ActivatePanel(id) {
  return {
    type: 'ActivatePanel',
    id: id
  };
};

// An action representing "no further action".
var NoOp = Indexed.NoOp;

// Model, update and init

var init = exports.init = function init() {
  var _RecipesForm$init = RecipesForm.init();

  var _RecipesForm$init2 = _slicedToArray(_RecipesForm$init, 2);

  var recipesForm = _RecipesForm$init2[0];
  var recipesFormFx = _RecipesForm$init2[1];

  var _Banner$init = Banner.init();

  var _Banner$init2 = _slicedToArray(_Banner$init, 2);

  var banner = _Banner$init2[0];
  var bannerFx = _Banner$init2[1];


  return [{
    active: null,
    activePanel: null,
    isOpen: false,
    // Origin url
    origin: null,
    // Build an array of ordered recipe IDs
    order: [],
    // Index all recipes by ID
    entries: {},
    recipesForm: recipesForm,
    banner: banner
  }, _reflex.Effects.batch([recipesFormFx.map(RecipesFormAction), bannerFx.map(TagBanner)])];
};

var updateIndexed = (0, _cursor.cursor)({
  update: Indexed.update,
  tag: TagIndexed
});

var updateModal = (0, _cursor.cursor)({
  update: Modal.update,
  tag: TagModal
});

var updateBanner = (0, _cursor.cursor)({
  get: function get(model) {
    return model.banner;
  },
  set: function set(model, banner) {
    return (0, _prelude.merge)(model, { banner: banner });
  },
  update: Banner.update,
  tag: TagBanner
});

var updateRecipesForm = (0, _cursor.cursor)({
  get: function get(model) {
    return model.recipesForm;
  },
  set: function set(model, recipesForm) {
    return (0, _prelude.merge)(model, { recipesForm: recipesForm });
  },
  update: RecipesForm.update,
  tag: RecipesFormAction
});

var updateByID = function updateByID(model, id, action) {
  return Indexed.updateWithID(Recipe.update, ByID(id), model, id, action);
};

var sync = function sync(model) {
  if (model.origin) {
    var origin = templateRecipesDatabase(model.origin);
    return [model, Database.sync(DB, origin).map(Synced)];
  } else {
    // @TODO this case should never happen, but perhaps we want to notify the
    // user something went wrong?
    console.warn('Recipe database sync attempted before origin was added to model');
    return [model, _reflex.Effects.none];
  }
};

var syncedOk = function syncedOk(model) {
  return update(model, RestoreRecipes);
};

var syncedError = function syncedError(model) {
  var message = (0, _lang.localize)("Couldn't sync with the cloud. Using local database.");
  return update(model, AlertDismissable(message));
};

var restoredRecipes = Result.updater(function (model, recipes) {
  return [(0, _prelude.merge)(model, {
    // Build an array of ordered recipe IDs
    order: recipes.map(getPouchID),
    // Index all recipes by ID
    entries: Indexed.indexWith(recipes, getPouchID)
  }), _reflex.Effects.none];
}, function (model, error) {
  var message = (0, _lang.localize)("Hmm, couldn't read from your browser's database.");
  return update(model, AlertRefreshable(message));
});

// Activate recipe by id
var startByID = function startByID(model, id) {
  var _update = update(model, Activate(id));

  var _update2 = _slicedToArray(_update, 2);

  var next = _update2[0];
  var fx = _update2[1];


  return [next, _reflex.Effects.batch([fx, _reflex.Effects.receive(RequestStart((0, _prelude.merge)({}, model.entries[id])))])];
};

var activatePanel = function activatePanel(model, id) {
  return [(0, _prelude.merge)(model, { activePanel: id }), _reflex.Effects.none];
};

var put = function put(model, recipe) {
  // Insert recipe into in-memory model.
  // @TODO perhaps we should do this after succesful put.
  var next = Indexed.add(model, recipe._id, recipe);
  // Then attempt to store it in DB.
  return [next, Database.put(DB, recipe).map(Putted)];
};

var putted = function putted(model, result) {
  return result.isOk ? [model, _reflex.Effects.none] : [model, _reflex.Effects.none];
};

var configure = function configure(model, origin) {
  var next = (0, _prelude.merge)(model, { origin: origin });

  return (0, _prelude.batch)(update, next, [RestoreRecipes, Sync]);
};

var update = exports.update = function update(model, action) {
  return action.type === 'Indexed' ? updateIndexed(model, action.source) : action.type === 'Banner' ? updateBanner(model, action.source) : action.type === 'RecipesForm' ? updateRecipesForm(model, action.source) : action.type === 'Modal' ? updateModal(model, action.source) : action.type === 'NoOp' ? [model, _reflex.Effects.none] : action.type === 'Put' ? put(model, action.value) : action.type === 'Putted' ? putted(model, action.result) : action.type === 'RestoreRecipes' ? [model, Database.restore(DB).map(RestoredRecipes)] : action.type === 'RestoredRecipes' ? restoredRecipes(model, action.result) : action.type === 'StartByID' ? startByID(model, action.id) : action.type === 'ActivatePanel' ? activatePanel(model, action.id) : action.type === 'Sync' ? sync(model) : action.type === 'Synced' ? action.result.isOk ? syncedOk(model) : syncedError(model) : action.type === 'Recipe' ? updateByID(model, action.id, action.source) : action.type === 'Configure' ? configure(model, action.origin) : Unknown.update(model, action);
};

// View

var view = exports.view = function view(model, address) {
  return _reflex.html.div({
    id: 'recipes-modal',
    className: 'modal',
    hidden: (0, _attr.toggle)(!model.isOpen, 'hidden')
  }, [_reflex.html.div({
    className: 'modal-overlay',
    onClick: function onClick() {
      return address(Close);
    }
  }), _reflex.html.dialog({
    className: (0, _attr.classed)({
      'modal-main': true
    }),
    open: (0, _attr.toggle)(model.isOpen, 'open')
  }, [_reflex.html.div({
    className: (0, _attr.classed)({
      'panels--main': true,
      'panels--lv1': model.activePanel !== null
    })
  }, [_reflex.html.div({
    className: 'panel--main panel--lv0'
  }, [_reflex.html.header({
    className: 'panel--header'
  }, [_reflex.html.h1({
    className: 'panel--title'
  }, [(0, _lang.localize)('Recipes')]), _reflex.html.div({
    className: 'panel--nav-right'
  }, [_reflex.html.a({
    className: 'recipes-create-icon',
    onClick: function onClick() {
      return address(ActivatePanel('form'));
    }
  })])]), (0, _reflex.thunk)('recipes-banner', Banner.view, model.banner, (0, _reflex.forward)(address, TagBanner), 'panel--banner recipes--banner'), _reflex.html.div({
    className: 'panel--content'
  }, [_reflex.html.div({
    className: (0, _attr.classed)({
      'recipes-main': true,
      'recipes-main-close': !model.isOpen
    })
  }, model.order.map(function (id) {
    return (0, _reflex.thunk)(id, Recipe.view, model.entries[id], (0, _reflex.forward)(address, ByID(id)));
  }))])]), (0, _reflex.thunk)('recipes-form', RecipesForm.view, model.recipesForm, (0, _reflex.forward)(address, RecipesFormAction), model.activePanel === 'form')])])]);
};

// Helpers

var templateRecipesDatabase = function templateRecipesDatabase(origin) {
  return Template.render(Config.recipes.origin, {
    origin_url: origin
  });
};

},{"../openag-config.json":94,"./common/attr":98,"./common/banner":99,"./common/cursor":102,"./common/database":103,"./common/indexed":107,"./common/lang":109,"./common/modal":111,"./common/prelude":114,"./common/result":116,"./common/stache":119,"./common/unknown":121,"./lang/functional":136,"./recipe":139,"./recipes/form":141,"pouchdb-browser":35,"reflex":65}],141:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.update = exports.init = exports.Clear = exports.Cancel = exports.Submitted = exports.Submit = exports.Back = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // @note this file is probably temporary, since authoring recipe JSON by
// hand is a pain.

var _reflex = require('reflex');

var _banner = require('../common/banner');

var Banner = _interopRequireWildcard(_banner);

var _unknown = require('../common/unknown');

var Unknown = _interopRequireWildcard(_unknown);

var _lang = require('../common/lang');

var _prelude = require('../common/prelude');

var _cursor = require('../common/cursor');

var _attr = require('../common/attr');

var _input = require('../common/input');

var Input = _interopRequireWildcard(_input);

var _recipes = require('../recipes');

var Recipes = _interopRequireWildcard(_recipes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Action tagging functions

var TextareaAction = (0, _prelude.tag)('Textarea');

// Actions

var Back = exports.Back = {
  type: 'Back'
};

// Submitting the form
var Submit = exports.Submit = function Submit(recipe) {
  return {
    type: 'Submit',
    recipe: recipe
  };
};

var Submitted = exports.Submitted = function Submitted(recipe) {
  return {
    type: 'Submitted',
    recipe: recipe
  };
};

var Cancel = exports.Cancel = {
  type: 'Cancel'
};

var Clear = exports.Clear = TextareaAction(Input.Clear);

var TagBanner = function TagBanner(source) {
  return {
    type: 'Banner',
    source: source
  };
};

var FailRecipeParse = TagBanner(Banner.AlertDismissable("Uh-oh! Invalid JSON."));

// Init and update functions

var init = exports.init = function init() {
  var placeholder = (0, _lang.localize)('Paste recipe JSON...');

  var _Input$init = Input.init('', null, placeholder);

  var _Input$init2 = _slicedToArray(_Input$init, 2);

  var textarea = _Input$init2[0];
  var textareaFx = _Input$init2[1];

  var _Banner$init = Banner.init();

  var _Banner$init2 = _slicedToArray(_Banner$init, 2);

  var banner = _Banner$init2[0];
  var bannerFx = _Banner$init2[1];

  return [{
    isOpen: false,
    textarea: textarea,
    banner: banner
  }, textareaFx.map(TextareaAction), bannerFx.map(TagBanner)];
};

// Update functions

var update = exports.update = function update(model, action) {
  return action.type === 'Banner' ? updateBanner(model, action.source) : action.type === 'Textarea' ? updateTextarea(model, action.source) : action.type === 'Submit' ? submit(model, action.recipe) : Unknown.update(model, action);
};

var submit = function submit(model, recipeJSON) {
  try {
    var recipe = JSON.parse(recipeJSON);
    return [model, _reflex.Effects.batch([
    // Send Submitted action up to parent
    _reflex.Effects.receive(Submitted(recipe)), _reflex.Effects.receive(Clear)])];
  } catch (e) {
    // @TODO throw up a banner for this case.
    return [model, _reflex.Effects.receive(FailRecipeParse)];
  }
};

var updateTextarea = (0, _cursor.cursor)({
  get: function get(model) {
    return model.textarea;
  },
  set: function set(model, textarea) {
    return (0, _prelude.merge)(model, { textarea: textarea });
  },
  tag: TextareaAction,
  update: Input.update
});

var updateBanner = (0, _cursor.cursor)({
  get: function get(model) {
    return model.banner;
  },
  set: function set(model, banner) {
    return (0, _prelude.merge)(model, { banner: banner });
  },
  tag: TagBanner,
  update: Banner.update
});

// View

var view = exports.view = function view(model, address, isActive) {
  return _reflex.html.div({
    className: (0, _attr.classed)({
      'panel--main': true,
      'panel--lv1': true,
      'panel--main-close': !isActive
    })
  }, [_reflex.html.header({
    className: 'panel--header'
  }, [_reflex.html.h1({
    className: 'panel--title'
  }, [(0, _lang.localize)('Import Recipe')]), _reflex.html.div({
    className: 'panel--nav-left'
  }, [_reflex.html.a({
    className: 'recipes-back-icon',
    onClick: function onClick() {
      return address(Back);
    }
  })]), _reflex.html.div({
    className: 'panel--nav-right'
  }, [_reflex.html.button({
    className: 'btn-panel',
    type: 'submit',
    onClick: function onClick(event) {
      // @TODO create a proper input module instead of kludging this in a
      // brittle way. We want to be able to send an Effect that will
      // focus, unfocus. We also want to read value changes from `onInput`.
      // See https://github.com/browserhtml/browserhtml/blob/master/src/common/ref.js
      // https://gist.github.com/Gozala/2b6a301846b151aafe807104304dbd06#file-focus-js
      event.preventDefault();
      var el = document.querySelector('#rform-textarea');
      address(Submit(el.value));
    }
  }, [(0, _lang.localize)('Save')])])]), (0, _reflex.thunk)('recipe-form-banner', Banner.view, model.banner, (0, _reflex.forward)(address, TagBanner), 'rform-banner'), _reflex.html.div({
    className: 'panel--content'
  }, [_reflex.html.div({
    className: 'rform-main'
  }, [_reflex.html.form({
    className: 'rform-form'
  }, [(0, _reflex.thunk)('textarea', Input.viewTextarea, model.textarea, (0, _reflex.forward)(address, TextareaAction), 'rform-textarea', 'rform-textarea txt-textarea')])])])]);
};

},{"../common/attr":98,"../common/banner":99,"../common/cursor":102,"../common/input":108,"../common/lang":109,"../common/prelude":114,"../common/unknown":121,"../recipes":140,"reflex":65}]},{},[137]);
