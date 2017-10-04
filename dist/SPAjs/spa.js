/** @license SPA.js | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/* ============================================================================
 * SPA.js is the collection of javascript functions which simplifies
 * the interfaces for Single Page Application (SPA) development.
 *
 * Dependency: (hard)
 * 1. jQuery: http://jquery.com/
 * 2. lodash: https://lodash.com/
 * 3. handlebars: http://handlebarsjs.com/ || https://github.com/wycats/handlebars.js/
 *
 * Optional
 * {i18n}         : https://code.google.com/p/jquery-i18n-properties/
 *
 * THIS CODE LICENSE: The MIT License (MIT)

 Copyright (c) 2003 <Kumararaja: sucom.kumar@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 * ===========================================================================
 */

/* Avoid 'console' errors in browsers that lack a console*/
(function() {
  var method;
  var noop = function(){};
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});
  while (length--) {
    method = methods[length];
    //Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }

  if (!('none' in window)) window['none'] = '';
  if (!('noop' in window)) window['noop'] = function(){};
}());

/*Flag for URL Hash Routing*/
var isSpaHashRouteOn=false;

/* SPA begins */
(function() {

  /* Establish the win object, `window` in the browser */
  var win = this;

  /* Create a safe reference to the spa object for use below. */
  var spa = function (obj) {
    if (obj instanceof spa) { return obj; }
    if (!(this instanceof spa)) { return new spa(obj); }
  };

  /* Expose spa to window */
  win.spa = spa;

  /* Current version. */
  spa.VERSION = '2.12.2';

  var _$  = document.querySelector.bind(document),
      _$$ = document.querySelectorAll.bind(document);
  if (!win['_$'])  win['_$']  = _$;
  if (!win['_$$']) win['_$$'] = _$$;

  /* isIE or isNonIE */
  var isById = (document.getElementById)
    , isByName = (document.all);
  spa.isIE = (isByName) ? true : false;
  spa.isNonIE = (isById && !isByName) ? true : false;

  /*No Operation: a dummy function*/
  spa.noop = function(){};

  /* ***** lodash ***** */
  _LD_ = {
    MAX_INTEGER      : 1.7976931348623157e+308,
    MAX_SAFE_INTEGER : 9007199254740991,
    INFINITY         : 1/0,
    reIsDeepProp     : /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp    : /^\w*$/,
    reLeadingDot     :  /^\./,
    rePropName       : /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    reEscapeChar     : /\\(\\)?/g,
    reIsUint         : /^(?:0|[1-9]\d*)$/,

    spreadableSymbol : window['Symbol'] ? Symbol.isConcatSpreadable : undefined,
    symToStringTag   : window['Symbol'] ? Symbol.toStringTag : undefined,
    nativeIsBuffer   : window['Buffer'] ? Buffer.isBuffer : undefined,
    Uint8Array       : window['Uint8Array'],
    Map              : window['Map']? window.Map : undefined,
    Set              : window['Set']? window.Set : undefined,
    nativeCreate     : window['Object']? (Object['create']? Object.create : undefined) : undefined,
    nativeGetSymbols : Object.getOwnPropertySymbols,

    arrayProto       : Array.prototype,
    splice           : Array.prototype.splice,
    funcProto        : Function.prototype,
    objectProto      : Object.prototype,
    objectCreate     : Object.create,

    symbolProto      : window['Symbol'] ? Symbol['prototype'] : undefined,
    symbolValueOf    : (window['Symbol'] && Symbol['prototype']) ? Symbol.prototype['valueOf'] : undefined,
    symbolToString   : (window['Symbol'] && Symbol['prototype']) ? Symbol.prototype['toString'] : undefined,

    HASH_UNDEFINED         : '__lodash_hash_undefined__',
    COMPARE_PARTIAL_FLAG   : 1,
    COMPARE_UNORDERED_FLAG : 2,

    LARGE_ARRAY_SIZE : 200,
    HOT_COUNT        : 800,
    HOT_SPAN         : 16,

    argsTag          : '[object Arguments]',
    arrayTag         : '[object Array]',
    asyncTag         : '[object AsyncFunction]',
    boolTag          : '[object Boolean]',
    dateTag          : '[object Date]',
    domExcTag        : '[object DOMException]',
    errorTag         : '[object Error]',
    funcTag          : '[object Function]',
    genTag           : '[object GeneratorFunction]',
    mapTag           : '[object Map]',
    numberTag        : '[object Number]',
    nullTag          : '[object Null]',
    objectTag        : '[object Object]',
    promiseTag       : '[object Promise]',
    proxyTag         : '[object Proxy]',
    regexpTag        : '[object RegExp]',
    setTag           : '[object Set]',
    stringTag        : '[object String]',
    symbolTag        : '[object Symbol]',
    undefinedTag     : '[object Undefined]',
    weakMapTag       : '[object WeakMap]',
    weakSetTag       : '[object WeakSet]',

    arrayBufferTag   : '[object ArrayBuffer]',
    dataViewTag      : '[object DataView]',
    float32Tag       : '[object Float32Array]',
    float64Tag       : '[object Float64Array]',
    int8Tag          : '[object Int8Array]',
    int16Tag         : '[object Int16Array]',
    int32Tag         : '[object Int32Array]',
    uint8Tag         : '[object Uint8Array]',
    uint8ClampedTag  : '[object Uint8ClampedArray]',
    uint16Tag        : '[object Uint16Array]',
    uint32Tag        : '[object Uint32Array]',

    setToArray       : function _setToArray(set) {
        var index = -1,
            result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      },

    apply     : function _apply(func, thisArg, args) {
        switch (args.length) {
          case 0: return func.call(thisArg);
          case 1: return func.call(thisArg, args[0]);
          case 2: return func.call(thisArg, args[0], args[1]);
          case 3: return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      },

    overArg   : function _overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      },

    stubFalse : function _stubFalse() { return false; },
    stubArray : function _stubArray() { return []; },

    constant  : function _constant(value) {
        return function() {
          return value;
        };
      },

    defineProperty : (function() {
        try {
          var func = Object.defineProperty;
          func({}, '', {});
          return func;
        } catch (e) {}
      }()),

    baseCreate     : (function() {
      function object() {}
      return function(proto) {
        var protoType = typeof proto;
        if (!((proto != null) && (protoType == 'object' || protoType == 'function'))) {
          return {};
        }
        if (Object['create']) {
          return Object.create(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }()),

    isKeyable : function _isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    },
    getMapData : function _getMapData(map, key) {
      var data = map.__data__;
      return _LD_.isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    },

    typedArrayTags : {}
  };

  _LD_.typedArrayTags[_LD_.float32Tag]      = _LD_.typedArrayTags[_LD_.float64Tag] =
  _LD_.typedArrayTags[_LD_.int8Tag]         = _LD_.typedArrayTags[_LD_.int16Tag]   =
  _LD_.typedArrayTags[_LD_.int32Tag]        = _LD_.typedArrayTags[_LD_.uint8Tag]   =
  _LD_.typedArrayTags[_LD_.uint8ClampedTag] = _LD_.typedArrayTags[_LD_.uint16Tag]  =
  _LD_.typedArrayTags[_LD_.uint32Tag]       = true;

  _LD_.typedArrayTags[_LD_.argsTag]         = _LD_.typedArrayTags[_LD_.arrayTag]  =
  _LD_.typedArrayTags[_LD_.arrayBufferTag]  = _LD_.typedArrayTags[_LD_.boolTag]   =
  _LD_.typedArrayTags[_LD_.dataViewTag]     = _LD_.typedArrayTags[_LD_.dateTag]   =
  _LD_.typedArrayTags[_LD_.errorTag]        = _LD_.typedArrayTags[_LD_.funcTag]   =
  _LD_.typedArrayTags[_LD_.mapTag]          = _LD_.typedArrayTags[_LD_.numberTag] =
  _LD_.typedArrayTags[_LD_.objectTag]       = _LD_.typedArrayTags[_LD_.regexpTag] =
  _LD_.typedArrayTags[_LD_.setTag]          = _LD_.typedArrayTags[_LD_.stringTag] =
  _LD_.typedArrayTags[_LD_.weakMapTag]      = false;

  _LD_['baseSetToString'] = !_LD_.defineProperty
    ? function(value){return value;}
    : function(func, string) {
        return _LD_.defineProperty(func, 'toString', {
          'configurable': true,
          'enumerable': false,
          'value': _LD_.constant(string),
          'writable': true
        });
      };

  _LD_['shortOut'] = function _shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = Date.now(),
            remaining = _LD_.HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= _LD_.HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    };

  _LD_['overRest'] = function _overRest(func, start, transform) {
      start = Math.max(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = Math.max(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return _LD_.apply(func, this, otherArgs);
      };
    };

  //Hash
  _LD_['Hash'] = function _Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  _LD_['Hash'].prototype.clear = function hashClear() {
    this.__data__ = _LD_.nativeCreate ? _LD_.nativeCreate(null) : {};
    this.size = 0;
  };
  _LD_['Hash'].prototype['delete'] = function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  };
  _LD_['Hash'].prototype.get = function hashGet(key) {
    var data = this.__data__;
    if (_LD_.nativeCreate) {
      var result = data[key];
      return result === _LD_.HASH_UNDEFINED ? undefined : result;
    }
    return spa._.hasOwnProperty.call(data, key) ? data[key] : undefined;
  };
  _LD_['Hash'].prototype.has = function hashHas(key) {
    var data = this.__data__;
    return _LD_.nativeCreate ? (data[key] !== undefined) : spa._.hasOwnProperty.call(data, key);
  };
  _LD_['Hash'].prototype.set = function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_LD_.nativeCreate && value === undefined) ? _LD_.HASH_UNDEFINED : value;
    return this;
  };

  //ListCache
  _LD_['ListCache'] = function _ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  _LD_['ListCache'].prototype.clear     = function _listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    };
  _LD_['ListCache'].prototype['delete'] = function _listCacheDelete(key) {
      var data = this.__data__,
          index = spa._.assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        _LD_.splice.call(data, index, 1);
      }
      --this.size;
      return true;
    };
  _LD_['ListCache'].prototype.get       = function _listCacheGet(key) {
      var data = this.__data__,
          index = spa._.assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    };
  _LD_['ListCache'].prototype.has       = function _listCacheHas(key) {
      return spa._.assocIndexOf(this.__data__, key) > -1;
    };
  _LD_['ListCache'].prototype.set       = function _listCacheSet(key, value) {
      var data = this.__data__,
          index = spa._.assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    };

  //Stack
  _LD_['Stack'] = function _Stack(entries) {
      var data = this.__data__ = new _LD_.ListCache(entries);
      this.size = data.size;
    };
  _LD_['Stack'].prototype.clear = function stackClear() {
    this.__data__ = new _LD_.ListCache;
    this.size = 0;
  };
  _LD_['Stack'].prototype['delete'] = function _stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  };
  _LD_['Stack'].prototype.get = function _stackGet(key) {
    return this.__data__.get(key);
  };
  _LD_['Stack'].prototype.has = function _stackHas(key) {
    return this.__data__.has(key);
  };
  _LD_['Stack'].prototype.set = function _stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _LD_.ListCache) {
      var pairs = data.__data__;
      if (!_LD_.Map || (pairs.length < _LD_.LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _LD_.MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  };

  //MapCache
  _LD_['MapCache'] = function _MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  _LD_['MapCache'].prototype.clear = function _mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash'  : new _LD_.Hash,
      'map'   : new (_LD_.Map || _LD_.ListCache),
      'string': new _LD_.Hash
    };
  };
  _LD_['MapCache'].prototype['delete'] = function _mapCacheDelete(key) {
    var result = _LD_.getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  };
  _LD_['MapCache'].prototype.get = function _mapCacheGet(key) {
    return _LD_.getMapData(this, key).get(key);
  };
  _LD_['MapCache'].prototype.has = function _mapCacheHas(key) {
    return _LD_.getMapData(this, key).has(key);
  };
  _LD_['MapCache'].prototype.set = function _mapCacheSet(key, value) {
    var data = _LD_.getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  };

  //SetCache
  _LD_['SetCache'] = function _SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;
    this.__data__ = new _LD_.MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  };
  _LD_['SetCache'].prototype.add = _LD_['SetCache'].prototype.push = function _setCacheAdd(value) {
    this.__data__.set(value, _LD_.HASH_UNDEFINED);
    return this;
  };
  _LD_['SetCache'].prototype.has = function _setCacheHas(value) {
    return this.__data__.has(value);
  };

  _LD_['createSet'] = !(_LD_.Set && (1 / _LD_.setToArray(new _LD_.Set([,-0]))[1]) == _LD_.INFINITY) ? function(){} : function(values) {
      return new _LD_.Set(values);
    };

  _LD_['getSymbols'] = !_LD_.nativeGetSymbols ? _LD_.stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return spa._.arrayFilter(_LD_.nativeGetSymbols(object), function(symbol) {
        return spa._.propertyIsEnumerable.call(object, symbol);
      });
    };

  //--------------------------------------------------
  spa['_'] = {
      isString       : function _isString(value) {
        return typeof value == 'string' || (!spa._.isArray(value) && spa._.isObjectLike(value) && spa._.baseGetTag(value) == _LD_.stringTag);
      }
    , isObject       : function _isObject(value) {
        var type = typeof value;
        return ((value != null) && (type == 'object' || type == 'function'));
      }
    , isObjectLike   : function _isObjectLike(value) {
        return value != null && typeof value == 'object';
      }
    , isFunction     : function _isFunction(value) {
        return ((value != null) && (typeof value == 'function'));
      }
    , isArray        : function _isArray(value) {
        return (Object.prototype.toString.call(value) === '[object Array]');
      }
    , isBoolean      : function _isBoolean(value) {
        return (value === true) || (value === false) || (spa._.isObjectLike(value) && spa._.baseGetTag(value) == _LD_.boolTag);
      }
    , isNumber       : function _isNumber(value) {
        return (typeof value == 'number') || (spa._.isObjectLike(value) && spa._.baseGetTag(value) == _LD_.numberTag);
      }
    , isLength       : function _isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= _LD_.MAX_SAFE_INTEGER;
    }
    , isIndex        : function _isIndex(value, length) {
        length = length == null ? _LD_.MAX_SAFE_INTEGER : length;
        return !!length &&
          (typeof value == 'number' || _LD_.reIsUint.test(value)) &&
          (value > -1 && value % 1 == 0 && value < length);
      }

    , isPlainObject     : function _isPlainObject(value) {
        if (!spa._.isObjectLike(value) || spa._.baseGetTag(value) != _LD_.objectTag) {
          return false;
        }
        var proto = spa._.getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = spa._.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return typeof Ctor == 'function' && Ctor instanceof Ctor &&
          spa._.funcToString.call(Ctor) == spa._.objectCtorString;
      }
    , isArrayLike       : function _isArrayLike(value) {
        return value != null && spa._.isLength(value.length) && !spa._.isFunction(value);
      }
    , isArrayLikeObject : function _isArrayLikeObject(value) {
        return spa._.isObjectLike(value) && spa._.isArrayLike(value);
      }
    , isEmpty           : function _isEmpty(value) {
        var vType = typeof value;
        if ((vType == "undefined") || (value == null)) {
          return true;
        }
        if ((vType == 'string') || (Object.prototype.toString.call(value) === '[object Array]')) {
          return !value.length;
        }
        if (vType == 'object') {
          return !Object.keys(value).length;
        }
        return false;
      }
    , isKey             : function _isKey(value, object) {
      if (spa._.isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null ) {
        return true;
      }
      return _LD_.reIsPlainProp.test(value) || !_LD_.reIsDeepProp.test(value) || (object != null && value in Object(object));
    }
    , isPrototype       : function _isPrototype(value) {
        var Ctor = value && value.constructor,
            proto = (typeof Ctor == 'function' && Ctor.prototype) || _LD_.objectProto;
        return value === proto;
      }
    , isSymbol          : function _isSymbol(value) {
        return typeof value == 'symbol' ||
          (spa._.isObjectLike(value) && spa._.getTag(value) == _LD_.symbolTag);
      }
    , isTypedArray      : function _isTypedArray(value) {
        return spa._.isObjectLike(value) &&
          spa._.isLength(value.length) && !!_LD_.typedArrayTags[spa._.getTag(value)];
      }
    , isFlattenable     : function _isFlattenable(value) {
        return spa._.isArray(value) || !!(_LD_.spreadableSymbol && value && value[_LD_.spreadableSymbol]);
      }
    , isIterateeCall    : function _isIterateeCall(value, index, object) {
        if (!spa._.isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (type == 'number'
              ? (spa._.isArrayLike(object) && spa._.isIndex(index, object.length))
              : (type == 'string' && index in object)
            ) {
          return spa._.eq(object[index], value);
        }
        return false;
      }

    , isBuffer             : _LD_.nativeIsBuffer || _LD_.stubFalse
    , nativeObjectToString : _LD_.objectProto.toString
    , propertyIsEnumerable : _LD_.objectProto.propertyIsEnumerable
    , hasOwnProperty       : _LD_.objectProto.hasOwnProperty
    , allocUnsafe          : _LD_.nativeIsBuffer ? Buffer.allocUnsafe : undefined
    , funcToString         : _LD_.funcProto.toString
    , objectCtorString     : _LD_.funcProto.toString.call(Object)

    , objectToString     : function _objectToString(value) {
        return spa._.nativeObjectToString.call(value);
      }
    , isStrictComparable : function _isStrictComparable(value) {
        return value === value && !spa._.isObject(value);
      }
    , toPlainObject      : function _toPlainObject(value) {
        return spa._.copyObject(value, spa._.keysIn(value));
      }
    , identity           : function _identity(value) {
        return value;
      }
    , eq                 : function _eq(value, other) {
      return value === other || (value !== value && other !== other);
    }
    , assocIndexOf       : function _assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (spa._.eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
    , baseIsNaN          : function _baseIsNaN(value) {
        return value !== value;
      }
    , toFinite           : function _toFinite(value) {
        var INFINITY = _LD_.INFINITY, MAX_INTEGER = _LD_.MAX_INTEGER;
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = (value*1);
        if (value === INFINITY || value === -INFINITY) {
          var sign = (value < 0 ? -1 : 1);
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
    , toKey              : function _toKey(value) {
      if (typeof value == 'string') {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -(_LD_.INFINITY)) ? '-0' : result;
    }
    , baseToString       : function _baseToString(value) {
        // Exit early for strings to avoid a performance hit in some environments.
        if (typeof value == 'string') {
          return value;
        }
        if (spa._.isArray(value)) {
          // Recursively convert values (susceptible to call stack limits).
          return spa._.arrayMap(value, spa._.baseToString) + '';
        }
        var result = (value + '');
        return (result == '0' && (1 / value) == -_LD_.INFINITY) ? '-0' : result;
      }
    , toString           : function _toString(value) {
      return value == null ? '' : spa._.baseToString(value);
    }
    , toInteger          : function _toInteger(value) {
        var result = spa._.toFinite(value),
            remainder = result % 1;
        return result === result ? (remainder ? result - remainder : result) : 0;
      }
    , arrayMap           : function _arrayMap(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length,
            result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
    , last               : function _last(array) {
        var length = (array == null)? 0 : array.length;
        return length? array[length - 1] : undefined;
      }
    , baseRange          : function _baseRange(start, end, step, fromRight) {
        var index = -1,
            length = Math.max(Math.ceil((end - start) / (step || 1)), 0),
            result = Array(length);

        while (length--) {
          result[fromRight ? length : ++index] = start;
          start += step;
        }
        return result;
      }
    , range              : function _range(start, end, step) {
        if (step && typeof step != 'number') {
          step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = spa._.toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = spa._.toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : spa._.toFinite(step);
        return spa._.baseRange(start, end, step, false);
      }
    , strToPath          : function _strToPath(string) {
        var result = [];
        if (_LD_.reLeadingDot.test(string)) {
          result.push('');
        }
        string.replace(_LD_.rePropName, function(match, number, quote, string) {
          result.push(quote ? string.replace(_LD_.reEscapeChar, '$1') : (number || match));
        });
        return result;
      }
    , castPath           : function _castPath(value, object) {
        if (spa._.isArray(value)) {
          return value;
        }
        return spa._.isKey(value, object) ? [value] : spa._.strToPath(spa._.toString(value));
      }
    , hasPath            : function _hasPath(object, path, hasFunc) {
        path = spa._.castPath(path, object);

        var index = -1,
            length = path.length,
            result = false;

        while (++index < length) {
          var key = spa._.toKey(path[index]);
          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result || ++index != length) {
          return result;
        }
        length = (object == null) ? 0 : object.length;

        return !!length && spa._.isLength(length) && spa._.isArray(object);
      }
    , baseHas            : function _baseHas(object, key) {
        return object != null && spa._.hasOwnProperty.call(object, key);
      }
    , has                : function _has(object, path) {
        return object != null && spa._.hasPath(object, path, spa._.baseHas);
      }
    , baseHasIn          : function _baseHasIn(object, key) {
        return object != null && key in Object(object);
      }
    , hasIn              : function _hasIn(object, path) {
        return object != null && spa._.hasPath(object, path, spa._.baseHasIn);
      }
    , nativeKeys         : _LD_.overArg(Object.keys, Object)
    , getPrototype       : _LD_.overArg(Object.getPrototypeOf, Object)

    , baseTimes          : function _baseTimes(n, iteratee) {
        var index = -1,
            result = Array(n);

        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
    , baseKeys           : function _baseKeys(object) {
        if (!spa._.isPrototype(object)) {
          return spa._.nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (spa._.hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }
        return result;
      }
    , keys               : function _keys(object) {
        return spa._.isObject(object) ? spa._.baseKeys(object) : (spa._.isString(object)? spa._.baseKeys(object.split('')) : []);
      }
    , nativeKeysIn       : function _nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }
    , baseKeysIn         : function _baseKeysIn(object) {
        if (!spa._.isObject(object)) {
          return spa._.nativeKeysIn(object);
        }
        var isProto = spa._.isPrototype(object),
            result = [];

        for (var key in object) {
          if (!(key == 'constructor' && (isProto || !spa._.hasOwnProperty.call(object, key)))) {
            result.push(key);
          }
        }
        return result;
      }
    , arrayLikeKeys      : function _arrayLikeKeys(value, inherited) {
        var isArr  = spa._.isArray(value),
            isArg  = !isArr && spa._.isArguments(value),
            isBuff = !isArr && !isArg && spa._.isBuffer(value),
            isType = !isArr && !isArg && !isBuff && spa._.isTypedArray(value),
            skipIndexes = isArr || isArg || isBuff || isType,
            result = skipIndexes ? spa._.baseTimes(value.length, String) : [],
            length = result.length;

        for (var key in value) {
          if ((inherited || spa._.hasOwnProperty.call(value, key)) &&
              !(skipIndexes && (
                 // Safari 9 has enumerable `arguments.length` in strict mode.
                 key == 'length' ||
                 // Node.js 0.10 has enumerable non-index properties on buffers.
                 (isBuff && (key == 'offset' || key == 'parent')) ||
                 // PhantomJS 2 has enumerable non-index properties on typed arrays.
                 (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
                 // Skip index properties.
                 spa._.isIndex(key, length)
              ))) {
            result.push(key);
          }
        }
        return result;
      }
    , keysIn             : function _keysIn(object) {
        return spa._.isArrayLike(object) ? spa._.arrayLikeKeys(object, true) : spa._.baseKeysIn(object);
      }
    , baseSlice          : function _baseSlice(array, start, end) {
        var index = -1,
            length = array.length;

        if (start < 0) {
          start = -start > length ? 0 : (length + start);
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : ((end - start) >>> 0);
        start >>>= 0;

        var result = Array(length);
        while (++index < length) {
          result[index] = array[index + start];
        }
        return result;
      }
    , baseGet            : function _baseGet(object, path) {
        path = spa._.castPath(path, object);

        var index = 0,
            length = path.length;

        while (object != null && index < length) {
          object = object[spa._.toKey(path[index++])];
        }
        return (index && index == length) ? object : undefined;
      }
    , get                : function _get(object, path, defaultValue) {
        var result = object == null ? undefined : spa._.baseGet(object, path);
        return result === undefined ? defaultValue : result;
      }
    , parent             : function _parent(object, path) {
        return path.length < 2 ? object : spa._.baseGet(object, spa._.baseSlice(path, 0, -1));
      }
    , baseGetTag         : function _baseGetTag(value) {
        if (value == null) {
          return value === undefined ? _LD_.undefinedTag : _LD_.nullTag;
        }
        return (_LD_.symToStringTag && _LD_.symToStringTag in Object(value))
          ? spa._.getRawTag(value)
          : spa._.objectToString(value);
      }
    , getRawTag          : function _getRawTag(value) {
        var isOwn = spa._.hasOwnProperty.call(value, _LD_.symToStringTag),
            tag = value[_LD_.symToStringTag];

        try {
          value[_LD_.symToStringTag] = undefined;
          var unmasked = true;
        } catch (e) {}

        var result = spa._.nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[_LD_.symToStringTag] = tag;
          } else {
            delete value[_LD_.symToStringTag];
          }
        }
        return result;
      }
    , getTag             : function _getTag(value) {
        if (value == null) {
          return value === undefined ? _LD_.undefinedTag : _LD_.nullTag;
        }
        return (_LD_.symToStringTag && _LD_.symToStringTag in Object(value))
          ? spa._.getRawTag(value)
          : spa._.objectToString(value);
      }
    , baseAssignValue    : function _baseAssignValue(object, key, value) {
        if (key == '__proto__' && _LD_.defineProperty) {
          _LD_.defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
          });
        } else {
          object[key] = value;
        }
      }
    , assignValue        : function _assignValue(object, key, value) {
        var objValue = object[key];
        if (!(spa._.hasOwnProperty.call(object, key) && spa._.eq(objValue, value)) ||
            (value === undefined && !(key in object))) {
          spa._.baseAssignValue(object, key, value);
        }
      }
    , baseZipObject      : function _baseZipObject(props, values, assignFunc) {
        var index = -1,
            length = props.length,
            valsLength = values.length,
            result = {};

        while (++index < length) {
          var value = index < valsLength ? values[index] : undefined;
          assignFunc(result, props[index], value);
        }
        return result;
      }
    , zipObject          : function _zipObject(props, values) {
        return spa._.baseZipObject(props || [], values || [], spa._.assignValue);
      }

    , baseAt             : function _baseAt(object, paths) {
        var index = -1,
            length = paths.length,
            result = Array(length),
            skip = object == null;

        while (++index < length) {
          result[index] = skip ? undefined : spa._.get(object, paths[index]);
        }
        return result;
      }
    , arrayPush          : function _arrayPush(array, values) {
        var index = -1,
            length = values.length,
            offset = array.length;

        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
    , copyArray          : function _copyArray(source, array) {
        var index = -1,
            length = source.length;

        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
    , arrayEach          : function _arrayEach(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length;

        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
    , arrayEvery         : function _arrayEvery(array, predicate) {
        var index = -1,
            length = array == null ? 0 : array.length;

        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
    , arrayMap           : function _arrayMap(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length,
            result = Array(length);

        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
    , arraySome          : function _arraySome(array, predicate) {
        var index = -1,
            length = array == null ? 0 : array.length;

        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
    , arrayIncludes      : function _arrayIncludes(array, value) {
        var length = array == null ? 0 : array.length;
        return !!length && spa._.baseIndexOf(array, value, 0) > -1;
      }
    , arrayIncludesWith  : function _arrayIncludesWith(array, value, comparator) {
        var index = -1,
            length = array == null ? 0 : array.length;

        while (++index < length) {
          if (comparator(value, array[index])) {
            return true;
          }
        }
        return false;
      }
    , arrayFilter        : function _arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    , iteratorToArray    : function _iteratorToArray(iterator) {
        var data,
            result = [];

        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
    , mapToArray         : function _mapToArray(map) {
        var index = -1,
            result = Array(map.size);

        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
    , baseFlatten        : function _baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1,
            length = array.length;

        predicate || (predicate = spa._.isFlattenable);
        result || (result = []);

        while (++index < length) {
          var value = array[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              // Recursively flatten arrays (susceptible to call stack limits).
              spa._.baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
              spa._.arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }
        return result;
      }
    , flatten            : function _flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? spa._.baseFlatten(array, 1) : [];
      }
    , setToString        : _LD_.shortOut(_LD_.baseSetToString)
    , baseRest           : function _baseRest(func, start) {
        return spa._.setToString(_LD_.overRest(func, start, spa._.identity), func + '');
      }
    , flatRest           : function _flatRest(func) {
        return spa._.setToString(_LD_.overRest(func, undefined, spa._.flatten), func + '');
      }

    , baseGetAllKeys     : function _baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return spa._.isArray(object) ? result : spa._.arrayPush(result, symbolsFunc(object));
      }
    , getAllKeys         : function _getAllKeys(object) {
        return baseGetAllKeys(object, keys, _LD_.getSymbols);
      }
    , equalArrays        : function _equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & _LD_.COMPARE_PARTIAL_FLAG,
            arrLength = array.length,
            othLength = other.length;

        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(array);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var index = -1,
            result = true,
            seen = (bitmask & _LD_.COMPARE_UNORDERED_FLAG) ? new _LD_.SetCache : undefined;

        stack.set(array, other);
        stack.set(other, array);

        // Ignore non-index properties.
        while (++index < arrLength) {
          var arrValue = array[index],
              othValue = other[index];

          if (customizer) {
            var compared = isPartial
              ? customizer(othValue, arrValue, index, other, array, stack)
              : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== undefined) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          // Recursively compare arrays (susceptible to call stack limits).
          if (seen) {
            if (!spa._.arraySome(other, function(othValue, othIndex) {
                  if (!spa._.cacheHas(seen, othIndex) &&
                      (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                    return seen.push(othIndex);
                  }
                })) {
              result = false;
              break;
            }
          } else if (!(
                arrValue === othValue ||
                  equalFunc(arrValue, othValue, bitmask, customizer, stack)
              )) {
            result = false;
            break;
          }
        }
        stack['delete'](array);
        stack['delete'](other);
        return result;
      }
    , equalByTag         : function _equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case _LD_.dataViewTag:
            if ((object.byteLength != other.byteLength) ||
                (object.byteOffset != other.byteOffset)) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;

          case _LD_.arrayBufferTag:
            if ((object.byteLength != other.byteLength) ||
                !equalFunc(new _LD_.Uint8Array(object), new _LD_.Uint8Array(other))) {
              return false;
            }
            return true;

          case _LD_.boolTag:
          case _LD_.dateTag:
          case _LD_.numberTag:
            // Coerce booleans to `1` or `0` and dates to milliseconds.
            // Invalid dates are coerced to `NaN`.
            return spa._.eq(+object, +other);

          case _LD_.errorTag:
            return object.name == other.name && object.message == other.message;

          case _LD_.regexpTag:
          case _LD_.stringTag:
            // Coerce regexes to strings and treat strings, primitives and objects,
            // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
            // for more details.
            return object == (other + '');

          case _LD_.mapTag:
            var convert = spa._.mapToArray;

          case _LD_.setTag:
            var isPartial = bitmask & _LD_.COMPARE_PARTIAL_FLAG;
            convert || (convert = _LD_.setToArray);

            if (object.size != other.size && !isPartial) {
              return false;
            }
            // Assume cyclic values are equal.
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= _LD_.COMPARE_UNORDERED_FLAG;

            // Recursively compare objects (susceptible to call stack limits).
            stack.set(object, other);
            var result = spa._.equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack['delete'](object);
            return result;

          case _LD_.symbolTag:
            if (_LD_.symbolValueOf) {
              return _LD_.symbolValueOf.call(object) == _LD_.symbolValueOf.call(other);
            }
        }
        return false;
      }
    , equalObjects       : function _equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & _LD_.COMPARE_PARTIAL_FLAG,
            objProps  = spa._.getAllKeys(object),
            objLength = objProps.length,
            othProps  = spa._.getAllKeys(other),
            othLength = othProps.length;

        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : spa._.hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);

        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key],
              othValue = other[key];

          if (customizer) {
            var compared = isPartial
              ? customizer(othValue, objValue, key, other, object, stack)
              : customizer(objValue, othValue, key, object, other, stack);
          }
          // Recursively compare objects (susceptible to call stack limits).
          if (!(compared === undefined
                ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
                : compared
              )) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == 'constructor');
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor,
              othCtor = other.constructor;

          // Non `Object` object instances with different constructors are not equal.
          if (objCtor != othCtor &&
              ('constructor' in object && 'constructor' in other) &&
              !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
                typeof othCtor == 'function' && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack['delete'](object);
        stack['delete'](other);
        return result;
      }

    , cacheHas            : function _cacheHas(cache, key) {
        return cache.has(key);
      }
    , compareAscending    : function _compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined   = value !== undefined,
              valIsNull      = value === null,
              valIsReflexive = value === value,
              valIsSymbol    = spa._.isSymbol(value);

          var othIsDefined   = other !== undefined,
              othIsNull      = other === null,
              othIsReflexive = other === other,
              othIsSymbol    = spa._.isSymbol(other);

          if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
              (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
              (valIsNull && othIsDefined && othIsReflexive) ||
              (!valIsDefined && othIsReflexive) ||
              !valIsReflexive) {
            return 1;
          }
          if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
              (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
              (othIsNull && valIsDefined && valIsReflexive) ||
              (!othIsDefined && valIsReflexive) ||
              !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
    , compareMultiple     : function _compareMultiple(object, other, orders) {
        var index        = -1,
            objCriteria  = object.criteria,
            othCriteria  = other.criteria,
            length       = objCriteria.length,
            ordersLength = orders.length;

        while (++index < length) {
          var result = spa._.compareAscending(objCriteria[index], othCriteria[index]);
          if (result) {
            if (index >= ordersLength) {
              return result;
            }
            var order = orders[index];
            return result * (order == 'desc' ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
    , strictIndexOf       : function _strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1,
            length = array.length;

        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
    , baseFindIndex       : function _baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length,
            index = fromIndex + (fromRight ? 1 : -1);

        while ((fromRight ? index-- : ++index < length)) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
    , baseIndexOf         : function _baseIndexOf(array, value, fromIndex) {
        return value === value
          ? spa._.strictIndexOf(array, value, fromIndex)
          : spa._.baseFindIndex(array, spa._.baseIsNaN, fromIndex);
      }
    , indexOf             : function _indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : spa._.toInteger(fromIndex);
        if (index < 0) {
          index = Math.max(length + index, 0);
        }
        return spa._.baseIndexOf(array, value, index);
      }
    , matchesStrictComparable : function _matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue &&
            (srcValue !== undefined || (key in Object(object)));
        };
      }
    , baseMatchesProperty     : function _baseMatchesProperty(path, srcValue) {
        if (spa._.isKey(path) && spa._.isStrictComparable(srcValue)) {
          return spa._.matchesStrictComparable(spa._.toKey(path), srcValue);
        }
        return function(object) {
          var objValue = spa._.get(object, path);
          return (objValue === undefined && objValue === srcValue)
            ? spa._.hasIn(object, path)
            : spa._.baseIsEqual(srcValue, objValue, _LD_.COMPARE_PARTIAL_FLAG | _LD_.COMPARE_UNORDERED_FLAG);
        };
      }
    , baseIsEqualDeep     : function _baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = spa._.isArray(object),
            othIsArr = spa._.isArray(other),
            objTag = objIsArr ? _LD_.arrayTag : spa._.getTag(object),
            othTag = othIsArr ? _LD_.arrayTag : spa._.getTag(other);

        objTag = objTag == _LD_.argsTag ? _LD_.objectTag : objTag;
        othTag = othTag == _LD_.argsTag ? _LD_.objectTag : othTag;

        var objIsObj = objTag == _LD_.objectTag,
            othIsObj = othTag == _LD_.objectTag,
            isSameTag = objTag == othTag;

        if (isSameTag && spa._.isBuffer(object)) {
          if (!spa._.isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new _LD_.Stack);
          return (objIsArr || spa._.isTypedArray(object))
            ? spa._.equalArrays(object, other, bitmask, customizer, equalFunc, stack)
            : spa._.equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & _LD_.COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && spa._.hasOwnProperty.call(object, '__wrapped__'),
              othIsWrapped = othIsObj && spa._.hasOwnProperty.call(other, '__wrapped__');

          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
                othUnwrapped = othIsWrapped ? other.value() : other;

            stack || (stack = new _LD_.Stack);
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack); //equalFunc: is local param
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new _LD_.Stack);
        return spa._.equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
    , baseIsEqual         : function _baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || (!spa._.isObjectLike(value) && !spa._.isObjectLike(other))) {
          return value !== value && other !== other;
        }
        return spa._.baseIsEqualDeep(value, other, bitmask, customizer, spa._.baseIsEqual, stack);
      }
    , baseIsMatch         : function _baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length,
            length = index,
            noCustomizer = !customizer;

        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (index--) {
          var data = matchData[index];
          if ((noCustomizer && data[2])
                ? data[1] !== object[data[0]]
                : !(data[0] in object)
              ) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0],
              objValue = object[key],
              srcValue = data[1];

          if (noCustomizer && data[2]) {
            if (objValue === undefined && !(key in object)) {
              return false;
            }
          } else {
            var stack = new _LD_.Stack;
            if (customizer) {
              var result = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result === undefined
                  ? spa._.baseIsEqual(srcValue, objValue, _LD_.COMPARE_PARTIAL_FLAG | _LD_.COMPARE_UNORDERED_FLAG, customizer, stack)
                  : result
                )) {
              return false;
            }
          }
        }
        return true;
      }
    , baseIsNaN           : function _baseIsNaN(value) {
        return value !== value;
      }
    , baseIsArguments     : function _baseIsArguments(value) {
        return spa._.isObjectLike(value) && spa._.baseGetTag(value) == _LD_.argsTag;
      }
    , getMatchData        : function _getMatchData(object) {
        var result = spa._.keys(object),
            length = result.length;

        while (length--) {
          var key = result[length],
              value = object[key];

          result[length] = [key, value, spa._.isStrictComparable(value)];
        }
        return result;
      }
    , baseMatches         : function _baseMatches(source) {
        var matchData = spa._.getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return spa._.matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || spa._.baseIsMatch(object, source, matchData);
        };
      }
    , baseProperty        : function _baseProperty(key) {
        return function(object) {
          return object == null ? undefined : object[key];
        };
      }
    , basePropertyDeep    : function _basePropertyDeep(path) {
        return function(object) {
          return spa._.baseGet(object, path);
        };
      }
    , property            : function _property(path) {
        return spa._.isKey(path) ? spa._.baseProperty(spa._.toKey(path)) : spa._.basePropertyDeep(path);
      }
    , baseIteratee        : function _baseIteratee(value) {
        // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
        // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
        if (typeof value == 'function') {
          return value;
        }
        if (value == null) {
          return spa._.identity;
        }
        if (typeof value == 'object') {
          return spa._.isArray(value)
            ? spa._.baseMatchesProperty(value[0], value[1])
            : spa._.baseMatches(value);
        }
        return spa._.property(value);
      }
    , getIteratee         : function _getIteratee() {
        var result = spa._.baseIteratee;
        return arguments.length ? result(arguments[0], arguments[1]) : result;
      }
    , findIndex           : function _findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : spa._.toInteger(fromIndex);
        if (index < 0) {
          index = Math.max(length + index, 0);
        }
        return spa._.baseFindIndex(array, spa._.getIteratee(predicate, 3), index);
      }
    , find                : function _find(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!spa._.isArrayLike(collection)) {
          var iteratee = spa._.getIteratee(predicate, 3);
          collection = spa._.keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = spa._.findIndex(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      }

    , baseIndexOf         : function _baseIndexOf(array, value, fromIndex) {
        return value === value
          ? spa._.strictIndexOf(array, value, fromIndex)
          : spa._.baseFindIndex(array, spa._.baseIsNaN, fromIndex);
      }
    , baseIndexOfWith     : function _baseIndexOfWith(array, value, fromIndex, comparator) {
        var index = fromIndex - 1,
            length = array.length;

        while (++index < length) {
          if (comparator(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
    , baseUnset           : function _baseUnset(object, path) {
        path = spa._.castPath(path, object);
        object = spa._.parent(object, path);
        return object == null || delete object[spa._.toKey(spa._.last(path))];
      }
    , basePullAt          : function _basePullAt(array, indexes) {
        var length = array ? indexes.length : 0,
            lastIndex = length - 1;

        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (spa._.isIndex(index)) {
              _LD_.splice.call(array, index, 1);
            } else {
              spa._.baseUnset(array, index);
            }
          }
        }
        return array;
      }
    , baseUnary           : function _baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
    , baseFor             : function _baseFor(object, iteratee, keysFunc, fromRight) {
        var index    = -1,
            iterable = Object(object),
            props    = keysFunc(object),
            length   = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      }
    , baseForOwn          : function _baseForOwn(object, iteratee) {
        return object && spa._.baseFor(object, iteratee, spa._.keys);
      }
    , createBaseEach      : function _createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee) {
          if (collection == null) {
            return collection;
          }
          if (!spa._.isArrayLike(collection)) {
            return eachFunc(collection, iteratee);
          }
          var length = collection.length,
              index = fromRight ? length : -1,
              iterable = Object(collection);

          while ((fromRight ? index-- : ++index < length)) {
            if (iteratee(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
    , remove              : function _remove(array, predicate) {
        var result = [];
        if (!(array && array.length)) {
          return result;
        }
        var index = -1,
            indexes = [],
            length = array.length;

        predicate = spa._.getIteratee(predicate, 3);
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result.push(value);
            indexes.push(index);
          }
        }
        spa._.basePullAt(array, indexes);
        return result;
      }
    , basePullAll         : function _basePullAll(array, values, iteratee, comparator) {
        var indexOf = comparator ? spa._.baseIndexOfWith : spa._.baseIndexOf,
            index = -1,
            length = values.length,
            seen = array;

        if (array === values) {
          values = spa._.copyArray(values);
        }
        if (iteratee) {
          seen = spa._.arrayMap(array, spa._.baseUnary(iteratee));
        }
        while (++index < length) {
          var fromIndex = 0,
              value = values[index],
              computed = iteratee ? iteratee(value) : value;

          while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              _LD_.splice.call(seen, fromIndex, 1);
            }
            _LD_.splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
    , pullAll             : function _pullAll(array, values) {
        return (array && array.length && values && values.length)
          ? spa._.basePullAll(array, values)
          : array;
      }

    , each                : function _each(collection, iteratee) {
        var func = spa._.isArray(collection) ? spa._.arrayEach : spa._.baseEach;
        return func(collection, spa._.getIteratee(iteratee, 3));
      }
    , baseEvery           : function _baseEvery(collection, predicate) {
        var result = true;
        spa._.baseEach(collection, function(value, index, collection) {
          result = !!predicate(value, index, collection);
          return result;
        });
        return result;
      }
    , every               : function _every(collection, predicate, guard) {
        var func = spa._.isArray(collection) ? spa._.arrayEvery : spa._.baseEvery;
        if (guard && spa._.isIterateeCall(collection, predicate, guard)) {
          predicate = undefined;
        }
        return func(collection, spa._.getIteratee(predicate, 3));
      }

    , baseMap             : function _baseMap(collection, iteratee) {
        var index = -1,
            result = spa._.isArrayLike(collection) ? Array(collection.length) : [];

        spa._.baseEach(collection, function(value, key, collection) {
          result[++index] = iteratee(value, key, collection);
        });
        return result;
      }
    , map                 : function _map(collection, iteratee) {
        var func = spa._.isArray(collection) ? spa._.arrayMap : spa._.baseMap;
        return func(collection, spa._.getIteratee(iteratee, 3));
      }
    , baseSome            : function _baseSome(collection, predicate) {
        var result;

        spa._.baseEach(collection, function(value, index, collection) {
          result = predicate(value, index, collection);
          return !result;
        });
        return !!result;
      }
    , some                : function _some(collection, predicate, guard) {
        var func = spa._.isArray(collection) ? spa._.arraySome : spa._.baseSome;
        if (guard && spa._.isIterateeCall(collection, predicate, guard)) {
          predicate = undefined;
        }
        return func(collection, spa._.getIteratee(predicate, 3));
      }
    , baseUniq            : function _baseUniq(array, iteratee, comparator) {
        var index = -1,
            includes = spa._.arrayIncludes,
            length = array.length,
            isCommon = true,
            result = [],
            seen = result;

        if (comparator) {
          isCommon = false;
          includes = spa._.arrayIncludesWith;
        }
        else if (length >= _LD_.LARGE_ARRAY_SIZE) {
          var set = iteratee ? null : _LD_.createSet(array);
          if (set) {
            return _LD_.setToArray(set);
          }
          isCommon = false;
          includes = spa._.cacheHas;
          seen = new _LD_.SetCache;
        }
        else {
          seen = iteratee ? [] : result;
        }
        outer:
        while (++index < length) {
          var value = array[index],
              computed = iteratee ? iteratee(value) : value;

          value = (comparator || value !== 0) ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          }
          else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        return result;
      }
    , uniq                : function _uniq(array) {
        return (array && array.length) ? spa._.baseUniq(array) : [];
      }

    , baseSortBy          : function _baseSortBy(array, comparer) {
        var length = array.length;

        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
    , baseOrderBy         : function _baseOrderBy(collection, iteratees, orders) {
        var index = -1;
        iteratees = spa._.arrayMap(iteratees.length ? iteratees : [spa._.identity], spa._.baseUnary(spa._.getIteratee()));

        var result = spa._.baseMap(collection, function(value) {
          var criteria = spa._.arrayMap(iteratees, function(iteratee) {
            return iteratee(value);
          });
          return { 'criteria': criteria, 'index': ++index, 'value': value };
        });

        return spa._.baseSortBy(result, function(object, other) {
          return spa._.compareMultiple(object, other, orders);
        });
      }

    , baseFilter          : function _baseFilter(collection, predicate) {
        var result = [];
        spa._.baseEach(collection, function(value, index, collection) {
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        });
        return result;
      }
    , filter              : function _filter(collection, predicate) {
        var func = spa._.isArray(collection) ? spa._.arrayFilter : spa._.baseFilter;
        return func(collection, spa._.getIteratee(predicate, 3));
      }

    , assignMergeValue    : function _assignMergeValue(object, key, value) {
        if ((value !== undefined && !spa._.eq(object[key], value)) ||
            (value === undefined && !(key in object))) {
          spa._.baseAssignValue(object, key, value);
        }
      }

    , initCloneObject     : function _initCloneObject(object) {
        return (typeof object.constructor == 'function' && !spa._.isPrototype(object))
          ? _LD_.baseCreate(spa._.getPrototype(object))
          : {};
      }
    , copyObject          : function _copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];

          var newValue = customizer
            ? customizer(object[key], source[key], key, object, source)
            : undefined;

          if (newValue === undefined) {
            newValue = source[key];
          }
          if (isNew) {
            spa._.baseAssignValue(object, key, newValue);
          } else {
            spa._.assignValue(object, key, newValue);
          }
        }
        return object;
      }
    , cloneBuffer         : function _cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length,
            result = spa._.allocUnsafe ? spa._.allocUnsafe(length) : new buffer.constructor(length);

        buffer.copy(result);
        return result;
      }
    , cloneArrayBuffer    : function _cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new _LD_.Uint8Array(result).set(new _LD_.Uint8Array(arrayBuffer));
        return result;
      }
    , cloneTypedArray     : function _cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? spa._.cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
    , baseMergeDeep       : function _baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = object[key],
            srcValue = source[key],
            stacked  = stack.get(srcValue);

        if (stacked) {
          spa._.assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer
          ? customizer(objValue, srcValue, (key + ''), object, source, stack)
          : undefined;

        var isCommon = newValue === undefined;

        if (isCommon) {
          var isArr   = spa._.isArray(srcValue),
              isBuff  = !isArr && spa._.isBuffer(srcValue),
              isTyped = !isArr && !isBuff && spa._.isTypedArray(srcValue);

          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (spa._.isArray(objValue)) {
              newValue = objValue;
            }
            else if (spa._.isArrayLikeObject(objValue)) {
              newValue = spa._.copyArray(objValue);
            }
            else if (isBuff) {
              isCommon = false;
              newValue = spa._.cloneBuffer(srcValue, true);
            }
            else if (isTyped) {
              isCommon = false;
              newValue = spa._.cloneTypedArray(srcValue, true);
            }
            else {
              newValue = [];
            }
          }
          else if (spa._.isPlainObject(srcValue) || spa._.isArguments(srcValue)) {
            newValue = objValue;
            if (spa._.isArguments(objValue)) {
              newValue = spa._.toPlainObject(objValue);
            }
            else if (!spa._.isObject(objValue) || (srcIndex && spa._.isFunction(objValue))) {
              newValue = spa._.initCloneObject(srcValue);
            }
          }
          else {
            isCommon = false;
          }
        }
        if (isCommon) {
          // Recursively merge objects and arrays (susceptible to call stack limits).
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack['delete'](srcValue);
        }
        spa._.assignMergeValue(object, key, newValue);
      }
    , baseMerge           : function _baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        spa._.baseFor(source, function(srcValue, key) {
          if (spa._.isObject(srcValue)) {
            stack || (stack = new _LD_.Stack);
            spa._.baseMergeDeep(object, source, key, srcIndex, spa._.baseMerge, customizer, stack);
          }
          else {
            var newValue = customizer
              ? customizer(object[key], srcValue, (key + ''), object, source, stack)
              : undefined;

            if (newValue === undefined) {
              newValue = srcValue;
            }
            spa._.assignMergeValue(object, key, newValue);
          }
        }, spa._.keysIn);
      }
    , createAssigner      : function _createAssigner(assigner) {
      return spa._.baseRest(function(object, sources) {
        var index      = -1,
            length     = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard      = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && spa._.isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    , baseSet : function _baseSet(object, path, value, customizer) {
        if (!spa._.isObject(object)) {
          return object;
        }
        path = spa._.castPath(path, object);

        var index     = -1,
            length    = path.length,
            lastIndex = length - 1,
            nested    = object;

        while (nested != null && ++index < length) {
          var key = spa._.toKey(path[index]),
              newValue = value;

          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined;
            if (newValue === undefined) {
              newValue = spa._.isObject(objValue)
                ? objValue
                : (spa._.isIndex(path[index + 1]) ? [] : {});
            }
          }
          spa._.assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
    , basePickBy : function _basePickBy(object, paths, predicate) {
        var index = -1,
            length = paths.length,
            result = {};

        while (++index < length) {
          var path = paths[index],
              value = spa._.baseGet(object, path);

          if (predicate(value, path)) {
            spa._.baseSet(result, spa._.castPath(path, object), value);
          }
        }
        return result;
      }
    , basePick : function _basePick(object, paths) {
        return spa._.basePickBy(object, paths, function(value, path) {
          return spa._.hasIn(object, path);
        });
      }

    , pullAt              : undefined
    , pull                : undefined
    , sortBy              : undefined
    , merge               : undefined
    , at                  : undefined
    , pick                : undefined

  };

  spa._['baseEach']    = spa._.createBaseEach(spa._.baseForOwn);
  spa._['pull']        = spa._.baseRest(spa._.pullAll);
  spa._['pullAt']      = spa._.flatRest(function(array, indexes) {
    var length = array == null ? 0 : array.length,
        result = spa._.baseAt(array, indexes);

    spa._.basePullAt(array, spa._.arrayMap(indexes, function(index) {
      return spa._.isIndex(index, length) ? +index : index;
    }).sort(spa._.compareAscending));

    return result;
  });
  spa._['at']          = spa._.flatRest(spa._.baseAt);
  spa._['sortBy']      = spa._.baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && spa._.isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && spa._.isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return spa._.baseOrderBy(collection, spa._.baseFlatten(iteratees, 1), []);
    });
  spa._['merge']       = spa._.createAssigner(function(object, source, srcIndex) {
      spa._.baseMerge(object, source, srcIndex);
    });
  spa._['pick']        = spa._.flatRest(function(object, paths) {
      return object == null ? {} : spa._.basePick(object, paths);
    });

  spa._['isArguments'] = spa._.baseIsArguments(function() { return arguments; }()) ? spa._.baseIsArguments : function(value) {
      return spa._.isObjectLike(value) && spa._.hasOwnProperty.call(value, 'callee') &&
        !spa._.propertyIsEnumerable.call(value, 'callee');
    };

  //Alias
  spa._['forEach'] = spa._['each'];

  if (!window['_']) {
    window['_'] = spa._;
  }

  /* *************** SPA begins *************** */
  spa.debug = false;
  spa['debugger'] = {
      on:function(){ spa.debug = true; }
    , off:function(){ spa.debug = false; }
    , toggle:function() { spa.debug = !spa.debug; }
  };
  /*Internal console out*/
  spa.cOut = function(consoleType, args){
    if (spa.debug && console[consoleType]) {
      console[consoleType](args.length===1? args[0] : args);
    }
  };
  spa['console'] = {
      'clear'         : function(){ console['clear'](); }
    , 'assert'        : function(){ spa.cOut('assert',         arguments); }
    , 'count'         : function(){ spa.cOut('count',          arguments); }
    , 'debug'         : function(){ spa.cOut('debug',          arguments); }
    , 'dir'           : function(){ spa.cOut('dir',            arguments); }
    , 'dirxml'        : function(){ spa.cOut('dirxml',         arguments); }
    , 'error'         : function(){ spa.cOut('error',          arguments); }
    , 'exception'     : function(){ spa.cOut('exception',      arguments); }
    , 'group'         : function(){ spa.cOut('group',          arguments); }
    , 'groupCollapsed': function(){ spa.cOut('groupCollapsed', arguments); }
    , 'groupEnd'      : function(){ spa.cOut('groupEnd',       arguments); }
    , 'info'          : function(){ spa.cOut('info',           arguments); }
    , 'log'           : function(){ spa.cOut('log',            arguments); }
    , 'markTimeline'  : function(){ spa.cOut('markTimeline',   arguments); }
    , 'profile'       : function(){ spa.cOut('profile',        arguments); }
    , 'profileEnd'    : function(){ spa.cOut('profileEnd',     arguments); }
    , 'table'         : function(){ spa.cOut('table',          arguments); }
    , 'time'          : function(){ spa.cOut('time',           arguments); }
    , 'timeEnd'       : function(){ spa.cOut('timeEnd',        arguments); }
    , 'timeStamp'     : function(){ spa.cOut('timeStamp',      arguments); }
    , 'trace'         : function(){ spa.cOut('trace',          arguments); }
    , 'warn'          : function(){ spa.cOut('warn',           arguments); }
  };

  spa._initWindowOnHashChange = function(){
    if ('onhashchange' in window) {
      isSpaHashRouteOn = true;
      spa.console.info("Registering HashRouting Listener");
      window.onhashchange = function () {
        /* ocEvent
         .oldURL : "http://dev.semantic-test.com/ui/home.html#user/changePassword"
         .newURL : "http://dev.semantic-test.com/ui/home.html#user/profile"
         .timeStamp : 1443191735330
         .type:"hashchange"
         */
        var cHash = window.location.hash;
        spa.console.info("onHashChange: "+cHash);
        if (cHash) {
          spa.route(cHash);
        } else if (spa.routesOptions.defaultPageRoute) {
          spa.route(spa.routesOptions.defaultPageRoute);
        }
      };
    }
  };
  spa._stopWindowOnHashChange = function(){
    window.onhashchange = undefined;
  };

  Date.prototype.yyyymmdd = function(sep) {
    var mm = this.getMonth() + 1, dd = this.getDate();
    return ([this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join(sep||''));
  };
  Date.prototype.hhmmss = function(sep) {
    var hh = this.getHours(), mm = this.getMinutes(), ss = this.getSeconds();
    return ([(hh>9 ? '' : '0') + hh,
             (mm>9 ? '' : '0') + mm,
             (ss>9 ? '' : '0') + ss
           ].join(sep||''));
  };

  /* ********************************************************* */
  /*NEW String Methods trim, normalize, beginsWith, endsWith
   var str                    = " I am a      string ";

   str.trimStr()                        = "I am a      string";
   str.isBlankStr()                     = false;
   str.isNumberStr()                    = false;
   str.normalizeStr()                   = "I am a string";
   str.beginsWithStr("I am")            = "true";
   str.beginsWithStr("i am")            = "false";
   str.beginsWithStrIgnoreCase("i am")  = "true"; // case insensitive
   str.endsWithStr("ing")               = "true";
   str.endsWithStr("iNg")               = "false";
   str.endsWithStrIgnoreCase("InG")     = "true"; // case insensitive
   ("     ").ifBlankStr(str)            = " I am a      string ";
   ("     ").ifBlankStr()               = "";
   (str).ifBlankStr()                   = "I am a      string";
   */

  String.prototype.trimLeftStr = function (tStr) {
    return (this.replace(new RegExp("^[" + (tStr || "\\s")+"]+", "g"), ""));
  };

  String.prototype.trimRightStr = function (tStr) {
    return (this.replace(new RegExp("["+ (tStr || "\\s") + "]+$", "g"), ""));
  };

  String.prototype.trimStr = function (tStr) {
    return this.trimLeftStr(tStr).trimRightStr(tStr);
  };

  String.prototype.getLeftStr = function (fromIndex) {
    if (typeof fromIndex === 'string') {
      fromIndex = this.indexOf(fromIndex);
    }
    return (fromIndex)? this.substr(0, fromIndex) : '';
  };

  String.prototype.getRightStr = function (fromIndex) {
    var sLen = 1;
    if (typeof fromIndex === 'string') {
      sLen = fromIndex.length;
      fromIndex = this.indexOf(fromIndex);
    }
    return (fromIndex<0)? '' : this.substr(fromIndex+sLen);
  };

  String.prototype.isBlankStr = function () {
    return (this.trimStr() == "");
  };

  String.prototype.ifBlankStr = function (forNullStr, forNotNullStr) {
    forNullStr    = (typeof forNullStr === "undefined")? '' : forNullStr;
    forNotNullStr = (typeof forNotNullStr === "undefined")? ((''+this).trimStr()) : forNotNullStr;
    return (this.isBlankStr() ? ( forNullStr ) : ( forNotNullStr ) );
  };

  String.prototype.isNumberStr = function () {
    return (((("" + this).replace(/[0-9.]/g, "")).trimStr()).length == 0);
  };

  String.prototype.normalizeStr = function () {
    return (this).trimStr().replace(/\s+/g, ' ');
  };

  String.prototype.beginsWithStr = function (str, i) {
    i = (i) ? 'i' : '';
    var re = new RegExp('^' + str, i);
    return ((this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.beginsWithStrIgnoreCase = function (str) {
    var re = new RegExp('^' + str, 'i');
    return ((this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.endsWithStr = function (str, i) {
    i = (i) ? 'i' : '';
    var re = new RegExp(str + '$', i);
    return ((this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.endsWithStrIgnoreCase = function (str) {
    var re = new RegExp(str + '$', 'i');
    return ((this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.containsStr = function (str, i) {
    i = (i) ? 'gi' : 'g';
    var re = new RegExp('' + str, i);
    return ((re).test(this));
  };

  String.prototype.containsStrIgnoreCase = function (str) {
    var re = new RegExp('' + str, 'gi');
    return ((re).test(this));
  };

  String.prototype.equals = function (arg) {
    return (this == arg);
  };

  String.prototype.equalsIgnoreCase = function (arg) {
    return ((String(this.toLowerCase()) == (String(arg)).toLowerCase()));
  };

  String.prototype.toProperCase = function (normalizeSrc) {
    return ( (((typeof normalizeSrc == "undefined") ||  normalizeSrc)? ((this).normalizeStr()) : (this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
      return $1.toUpperCase();
    }));
  };

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.unCapitalize = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
  };

  String.prototype.splitToArray = String.prototype.toArray = function (splitBy) {
    return spa.isBlank(this) ? [] : this.split(splitBy);
  };

  function getMatchStr(str){
    switch(str){
      case '{': return '}';
      case '[': return ']';
      case '<': return '>';
      default: return str;
    }
  }

  String.prototype.extractStrBetweenIn = function (bS, eS) {
    if (!bS) {
      bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
      bS = (bS)? bS[0] : '';
    };
    eS = eS || getMatchStr(bS);
    return this.match(RegExp('\\'+bS+'([^\\'+bS+'\\'+eS+'].*?)\\'+eS, 'g')) || [];
  };

  String.prototype.extractStrBetweenEx = function (bS, eS) {
    if (!bS) {
      bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
      bS = (bS)? bS[0] : '';
    };
    eS = eS || getMatchStr(bS);
    var rxStr = '\\'+bS+'\\'+eS, rx = new RegExp('['+rxStr+']', 'g');
    return (this.match(new RegExp('\\'+bS+'([^'+rxStr+'].*?)\\'+eS, 'g')) || []).map(function(x){
      return x.replace(rx,'');
    });
  };

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['{param1}','{param2}','{param3}','{param1}']
  //unique: true  ==> ['{param1}','{param2}','{param3}']
  spa.extractStrBetweenIn = function (srcStr, bS, eS){
    return (srcStr||'').extractStrBetweenInc(bS, eS);
  };

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['param1','param2','param3','param1']
  //unique: true  ==> ['param1','param2','param3']
  spa.extractStrBetweenEx = function (srcStr, bS, eS){
    return (srcStr||'').extractStrBetweenExc(bS, eS);
  };

  spa.strToArray = function(srcStr) {
    if (typeof srcStr == 'string') {
      srcStr = [srcStr];
    }
    return srcStr;
  };

  spa.toJSON = function (str) {
    var thisStr;
    if (_.isString(str)) {
      thisStr = str.trimStr();

      if (!(thisStr.containsStr("{") || thisStr.containsStr(":") || thisStr.containsStr("\\[") || thisStr.containsStr("'") || thisStr.containsStr('\"') ))
      { return (thisStr.containsStr(",") || thisStr.containsStr(";"))? thisStr.replace(/ /g,'').replace(/;/g, ',').split(',') : thisStr;
      }

      if (thisStr.containsStr(":") && !thisStr.containsStr(",") && thisStr.containsStr(";")) {
        thisStr = thisStr.replace(/\;/g,',');
      }
      if (!(thisStr.beginsWithStr("{") || thisStr.beginsWithStr("\\["))) {
        if (thisStr.containsStr(":")) {
          thisStr = "{"+thisStr+"}";
        } else if (thisStr.containsStr("=")) {
          thisStr = "{"+thisStr.replace(/=/g,':')+"}";
        } else {
          thisStr = "["+thisStr+"]";
        }
      } else if (thisStr.beginsWithStr("{") && !thisStr.containsStr(":") && thisStr.containsStr("=")) {
        thisStr = ""+thisStr.replace(/=/g,':')+"";
      }
    }
    return (!_.isString(str) && _.isObject(str)) ? str : ( spa.isBlank(str) ? null : (eval("(" + thisStr + ")")) );
  };
  String.prototype.toJSON = function () {
    return spa.toJSON(''+this);
  };

  String.prototype.toBoolean = function () {
    var retValue = true;
    switch (("" + this).trimStr().toLowerCase()) {
      case          "":
      case         "0":
      case        "-0":
      case       "nan":
      case      "null":
      case     "false":
      case "undefined":
        retValue = false;
        break;
    }

    if (retValue) retValue = (!("" + this).trimStr().beginsWithStr("-"));
    return ( retValue );
  };

  Boolean.prototype.toValue = function (tValue, fValue) {
    if (typeof tValue == "undefined") tValue = true;
    if (typeof fValue == "undefined") fValue = false;
    return ((this.valueOf()) ? (tValue) : (fValue));
  };

  Boolean.prototype.toHtml = function (tElId, fElId) {
    return $((this.valueOf()) ? tElId : fElId).html();
  };

  /*
   * String.padStr([padString: String = " "], length: Integer=1, [type: Integer = 0]): String
   * Returns: the string with a padString padded on the left, right or both sides.
   * length: amount of characters that the string must have
   * padString: string that will be concatenated
   * type: specifies the side where the concatenation will happen, where: -1 = left, 1 = right and 0 = both sides
   */
  String.prototype.padStr = function (s, l, t) {
      s = s || '';
      l = l || 1;
      t = t || 2;
      for (var ps = "", i = 0; i < l; i++) {
        ps += s;
      }
      return (((t === -1 || t === 2) ? ps : "") + this + ((t === 1 || t === 2) ? ps : ""));
    };

  spa.lastSplitResult = [];
  spa.getOnSplit = spa.pickOnSplit = function (str, delimiter, pickIndex) {
    spa.lastSplitResult = str.split(delimiter);
    return (spa.getOnLastSplit(pickIndex));
  };
  spa.getOnLastSplit = spa.pickOnLastSplit = function (pickIndex) {
    return ((pickIndex < 0) ? (_.last(spa.lastSplitResult)) : (spa.lastSplitResult[pickIndex]));
  };

  /* isBlank / isEmpty */
  spa.isBlank = spa.isEmpty = function (src) {
    var retValue = true;
    if (!((typeof src === 'undefined') || (src === null))) {
      switch (true) {
        case (_.isString(src)):
          retValue = ((src).trimStr().length == 0);
          break;
        case (_.isFunction(src)):
            retValue = false;
          break;
        case (_.isArray(src)) :
        case (_.isObject(src)):
          retValue = _.isEmpty(src);
          break;
        default:
          retValue = ((''+src).trimStr().length == 0);
          break;
      }
    }
    return retValue;
  };

  spa.isNumber = function (str) {
    return (((("" + str).replace(/[0-9.]/g, "")).trimStr()).length == 0);
  };

  spa.toBoolean = function (str) {
    var retValue = true;
    switch (("" + str).trimStr().toLowerCase()) {
      case          "":
      case         "0":
      case        "-0":
      case       "nan":
      case      "null":
      case     "false":
      case "undefined":
        retValue = false;
        break;
    }
    return ( retValue );
  };

  spa.toInt = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = spa.isBlank(str) ? "0" : ((str.indexOf(".") >= 0) ? str.substring(0, str.indexOf(".")) : str);
    return (parseInt(str * 1, 10));
  };

  spa.toFloat = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = spa.isBlank(str) ? "0" : str;
    return (parseFloat(str * (1.0)));
  };

  /*Tobe Removed: replaced with toStr*/
  spa.toString = function (obj) {
    spa.console.warn("spa.toString is deprecated. use spa.toStr instead.");
    var retValue = "" + obj;
    if (_.isObject(obj)) {
      retValue = JSON.stringify(obj);
    }
    return (retValue);
  };

  spa.toStr = function (obj) {
    var retValue = "" + obj;
    if (_.isObject(obj)) {
      retValue = JSON.stringify(obj);
    }
    return (retValue);
  };

  spa.dotToX = function (dottedName, X) {
    return ((dottedName).replace(/\./g, X));
  };
  spa.dotToCamelCase = function (dottedName) {
    var newName = (dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, "");
    return (newName[0].toLowerCase() + newName.substring(1));
  };
  spa.dotToTitleCase = function (dottedName) {
    return ((dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
  };

  spa.toDottedPath = function(srcStr){
    return ((srcStr||"").replace(/]/g,'').replace(/(\[)|(\\)|(\/)/g,'.').replace(/(\.+)/g,'.').trimStr("\\."));
  };

  spa.ifBlank = spa.ifEmpty = spa.ifNull = function (src, replaceWithIfBlank, replaceWithIfNotBlank) {
    replaceWithIfBlank = ("" + (replaceWithIfBlank || "")).trimStr();
    replaceWithIfNotBlank = (typeof replaceWithIfNotBlank === "undefined")? (("" + src).trimStr()) : replaceWithIfNotBlank;
    return ( spa.isBlank(src) ? (replaceWithIfBlank) : (replaceWithIfNotBlank) );
  };

  /* now: Browser's current timestamp */
  spa.now = function () {
    return ("" + ((new Date()).getTime()));
  };

  /* year: Browser's current year +/- N */
  spa.year = function (n) {
    n = n || 0;
    return ((new Date()).getFullYear() + (spa.toInt(n)));
  };

  /*String to Array; spa.range("N1..N2:STEP")
   * y-N..y+N : y=CurrentYear*/
  spa.range = function (rangeSpec) {
    var rSpec = (rangeSpec.toUpperCase()).split("..")
      , rangeB = "" + rSpec[0]
      , rangeE = "" + rSpec[1]
      , rStep = "1";
    if (rangeE.indexOf(":") > 0) {
      rangeE = "" + (rSpec[1].split(":"))[0];
      rStep = "" + (rSpec[1].split(":"))[1];
    }
    if (rangeB.indexOf("Y") >= 0) {
      rangeB = spa.year((rangeB.split(/[^0-9+-]/))[1]);
    }
    if (rangeE.indexOf("Y") >= 0) {
      rangeE = spa.year((rangeE.split(/[^0-9+-]/))[1]);
    }
    var rB = spa.toInt(rangeB)
      , rE = spa.toInt(rangeE)
      , rS = spa.toInt(rStep);
    return (rangeB > rangeE) ? ((_.range(rE, (rB) + 1, rS)).reverse()) : (_.range(rB, (rE) + 1, rS));
  };

  spa.checkAndPreventKey = function (e, disableKeys) {
    if (!disableKeys) disableKeys = "";
    var withShiftKey = (disableKeys.indexOf("+shift") >= 0)
      , keyCode  = ""+e.keyCode
      , retValue = (( ((disableKeys.padStr(',')).indexOf(keyCode.padStr(',')) >= 0) && (withShiftKey ? ((e.shiftKey) ? true : false) : ((!e.shiftKey)? true : false))));
    if (retValue) {
      e.preventDefault();
      spa.console.info("Key [" + keyCode + (withShiftKey ? "+Shift" : "") + "] has been disabled in this element.");
    }
    return retValue;
  };

  spa._trackAndControlKey = function (e) {
    var keyElement = e.currentTarget
      , $keyElement = $(keyElement)
      , disableKeys = (""+$keyElement.data("disableKeys")).toLowerCase();
      //, keyCode = ""+e.keyCode, withShiftKey = (disableKeys.indexOf("+shift") >= 0);
    spa.checkAndPreventKey(e, disableKeys);

    var changeFocusNext = (!spa.isBlank(("" + $keyElement.data("focusNext")).replace(/undefined/, "").toLowerCase()));
    var changeFocusPrev = (!spa.isBlank(("" + $keyElement.data("focusBack")).replace(/undefined/, "").toLowerCase()));
    if (changeFocusNext && (spa.checkAndPreventKey(e, "9"))) {
      $($keyElement.data("focusNext")).get(0).focus();
    }
    if (changeFocusPrev && (spa.checkAndPreventKey(e, "9,+shift"))) {
      $($keyElement.data("focusBack")).get(0).focus();
    }
  };

  spa.initKeyTracking = function () {
    var elementsToTrackKeys = (arguments.length) ? arguments[0] : "[data-disable-keys],[data-focus-next],[data-focus-back]";
    spa.console.info("Finding Key-Tracking for element(s): " + elementsToTrackKeys);
    $(elementsToTrackKeys).each(function (index, element) {
      $(element).keydown(spa._trackAndControlKey);
      spa.console.info("SPA is tracking keys on element:");
      spa.console.info(element);
    });
  };

  spa.getDocObj = function (objId) {
    var jqSelector = ((typeof objId) == "object") ? objId : ((objId.beginsWithStr("#") ? "" : "#") + objId);
    return ( $(jqSelector).get(0) );
  };
  spa.getDocObjs = function (objId) {
    var jqSelector = (objId.beginsWithStr("#") ? "" : "#") + objId;
    return ( $(jqSelector).get() );
  };

  /* setFocus: */
  spa.setFocus = function (objId, isSelect) {
    var oFocus = spa.getDocObj(objId);
    if (oFocus) {
      oFocus.focus();
      if (isSelect) oFocus.select();
    }
  };

  /* Check DOM has requested element */
  spa.isElementExist = function (elSelector) {
    return (!$.isEmptyObject($(elSelector).get()));
  };

  spa.swapClass = spa.swapObjClass = function (objIDs, removeClass, addClass) {
    $(objIDs).removeClass(removeClass);
    $(objIDs).addClass(addClass);
  };

  /* docObjValue: returns oldValue; sets newValue if provided */
  spa.docObjValue = function (objId, newValue) {
    var reqObj = spa.getDocObj(objId);
    var retValue = "";
    if (reqObj) {
      retValue = reqObj.value;
      if (arguments.length === 2) {
        reqObj.value = newValue;
      }
    }
    return (retValue);
  };

  /* <select> tag related */
  /* get options Selected Index : Get / Set by Index*/
  spa.optionSelectedIndex = function (objId, newSelIdx) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      retValue = oLstObj.selectedIndex;
      if (arguments.length === 2) {
        oLstObj.selectedIndex = newSelIdx;
      }
    }
    return (retValue);
  };
  /* get options Index : for value */
  spa.optionIndexOfValue = function (objId, optValue) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        if (("" + optValue).equalsIgnoreCase(oLstObj.options[i].value)) {
          retValue = i;
          break;
        }
      }
    }
    return (retValue);
  };
  /* get options Index : for Text */
  spa.optionIndexOfText = function (objId, optText) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        if (optText.equalsIgnoreCase(oLstObj.options[i].text)) {
          retValue = i;
          break;
        }
      }
    }
    return (retValue);
  };
  /* get options Index : for value begins with */
  spa.optionIndexOfValueBeginsWith = function (objId, optValue) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        if ((oLstObj.options[i].value).beginsWithStrIgnoreCase(optValue)) {
          retValue = i;
          break;
        }
      }
    }
    return (retValue);
  };

  /*Get Value / Text for selected Index*/
  spa.optionsSelectedValues = function (objId, delimiter) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return ($.map(($(objId + " option:selected")), function (option) {
      return (option.value);
    }).join(delimiter));
  };
  spa.optionsSelectedTexts = function (objId, delimiter) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return ($.map(($(objId + " option:selected")), function (option) {
      return (option.text);
    }).join(delimiter));
  };

  /*Get Value / Text for given Index*/
  spa.optionValueOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = spa.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].value;
    }
    return (retValue);
  };
  spa.optionTextOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = spa.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].text;
    }
    return (retValue);
  };

  /*Set Selected options for Value*/
  spa.selectOptionForValue = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      retValue = spa.optionIndexOfValue(objId, selValue);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  spa.selectOptionForValueBeginsWith = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      retValue = spa.optionIndexOfValueBeginsWith(objId, selValue);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  spa.selectOptionsForValues = function (objId, selValues, valDelimitChar) {
    valDelimitChar = valDelimitChar || ",";
    selValues = (valDelimitChar + selValues + valDelimitChar).toLowerCase();
    var oLstObj = spa.getDocObj(objId), optValue;
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        optValue = (valDelimitChar + (oLstObj.options[i].value) + valDelimitChar).toLowerCase();
        oLstObj.options[i].selected = (selValues.indexOf(optValue) >= 0);
      }
    }
  };
  spa.selectOptionForText = function (objId, selText) {
    var retValue = -1;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      retValue = spa.optionIndexOfText(objId, selText);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  spa.selectOptionsAll = function (objId) {
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = true;
      }
    }
  };
  spa.selectOptionsNone = function (objId) {
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = false;
      }
    }
  };
  /*Add / Remove Options*/
  spa.optionsReduceToLength = function (objID, nLen) {
    nLen = nLen || 0;
    var oSelOptList = spa.getDocObj(objID);
    if (oSelOptList) {
      spa.selectOptionsNone(objID);
      oSelOptList.length = nLen;
    }
  };
  spa.optionsRemoveAll = function (objID) {
    spa.optionsReduceToLength(objID, 0);
  };
  spa.optionRemoveForIndex = function (objId, optIndex) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    var oLstObj = spa.getDocObj(objId);
    if (oLstObj) {
      if (("" + optIndex).equalsIgnoreCase("first")) optIndex = 0;
      if (("" + optIndex).equalsIgnoreCase("last")) optIndex = (oLstObj.length - 1);
      oLstObj.remove(optIndex);
    }
  };
  spa.optionRemoveForValue = function (objId, optValue) {
    spa.optionRemoveForIndex(objId, spa.optionIndexOfValue(objId, optValue));
  };
  spa.optionRemoveForText = function (objId, optText) {
    spa.optionRemoveForIndex(objId, spa.optionIndexOfText(objId, optText));
  };
  spa.optionRemoveForValueBeginsWith = function (objId, optValueBeginsWith) {
    spa.optionRemoveForIndex(objId, spa.optionIndexOfValueBeginsWith(objId, optValueBeginsWith));
  };

  spa.optionAppend = function (objID, optValue, optText, appendAtIndex) {
    var retValue = -1;
    var oSelOptList = spa.getDocObj(objID);
    if (oSelOptList) {
      if (typeof appendAtIndex == "undefined") {
        var nOptPos = oSelOptList.length;
        oSelOptList.length = nOptPos + 1;
        oSelOptList.options[nOptPos].value = optValue;
        oSelOptList.options[nOptPos].text = optText;
        retValue = nOptPos;
      }
      else {
        $(oSelOptList).find("option").eq(appendAtIndex).before('<option value="' + optValue + '">' + optText + '</option>');
        retValue = appendAtIndex;
      }
    }
    return (retValue);
  };

  /*
   * Usage: spa.optionsLoad(elSelector, list, beginsAt, sortBy)
   * elSelector = "#SelectElementID"; //jQuery selector by ID
   * list = [ 0, 1, ... ]; //Number Array
   * list = ["optValue0", "optValue1", ... ]; //String Array
   * list = {"optValue0":"optText0", "optValue1":"optText1", "optValue2":"optText2", ... }; //Object with Key Value Pair
   * beginsAt = -1 => Add to existing list; 0=> reset to 0; n=> reset to n; before Load
   * sortBy = 0=> NO Sort; 1=> SortBy Key; 2=> SortBy Text;
   */
  spa.optionsLoad = function (elSelector, list, beginsAt, sortBy) {
    var sortByAttr = ["", "key", "value"];
    beginsAt = beginsAt || 0;
    sortBy = sortBy || 0;
    if ((_.isString(list)) && (list.indexOf("..") > 0)) {
      list = spa.range(list);
    }
    if (beginsAt >= 0) {
      spa.optionsReduceToLength(elSelector, beginsAt);
    }
    if (_.isArray(list)) {
      _.each(list, function (opt) {
        spa.optionAppend(elSelector, opt, opt);
      });
    }
    else {
      if (sortBy > 0) {
        var listArray = [];
        for (var key in list) {
          listArray.push({key: key, value: list[key]});
        }
        var listSorted = _.sortBy(listArray, sortByAttr[sortBy]);
        _.each(listSorted, function (opt) {
          spa.optionAppend(elSelector, opt.key, opt.value);
        });
      }
      else {
        _.each(list, function (value, key) {
          spa.optionAppend(elSelector, key, value);
        });
      }
    }
  };

  /* Radio & Checkbox related */
  /* checkedState: returns old Checked State {true|false}; sets newState {true | false} if provided */
  spa.checkedState = function (objId, newState) {
    var retValue = false
      , objChk = spa.getDocObj(objId);
    if (objChk) {
      retValue = objChk.checked;
      if (arguments.length === 2) {
        objChk.checked = newState;
      }
    }
    return (retValue);
  };
  spa.isChecked = function (elScope, eName) {
    return (($(elScope).find("input[name=" + eName + "]:checked").length) > 0);
  };
  spa.radioSelectedValue = function (elScope, rName) {
    var retValue = ($(elScope).find("input[name=" + rName + "]:checked").val());
    return (retValue ? retValue : "");
  };
  spa.radioClearSelection = function (elScope, rName) {
    ($(elScope).find("input[name=" + rName + "]:checked").attr("checked", false));
  };
  spa.radioSelectForValue = function (elScope, rName, sValue) {
    $(elScope).find("input[name=" + rName + "]:radio").each(function(el) {
      el.checked = ((el.value).equalsIgnoreCase(sValue));
    });
  };
  spa.checkboxCheckedValues = function (elScope, cbName, delimiter) {
    delimiter = delimiter || ",";
    return ($(elScope).find("input[name=" + cbName + "]:checked").map(function () {
      return this.value;
    }).get().join(delimiter));
  };

  spa.sleep = function (sec) {
    var dt = new Date();
    dt.setTime(dt.getTime() + (sec * 1000));
    while (new Date().getTime() < dt.getTime());
  };

  /*Tobe removed; use _.filter*/
  spa.filterJSON = function (jsonData, xFilter) {
    return $(jsonData).filter(function (index, item) {
      for (var i in xFilter) {
        if (!item[i].toString().match(xFilter[i])) return null;
      }
      return item;
    });
  };

  /* randomPassword: Random Password for requested length */
  spa.randomPassword = function (passLen) {
    var chars = "9a8b77C8D9E8F7G6H5I4J3c6d5e4f32L3M4N5P6Qg2h3i4j5kV6W5X4Y3Z26m7n8p9q8r7s6t5u4v3w2x3y4z5A6BK7R8S9T8U7";
    var pass = "";
    for (var x = 0; x < passLen; x++) {
      var i = Math.floor(Math.random() * (chars).length);
      pass += chars.charAt(i);
    }
    return pass;
  };

  /* rand: Random number between min - max */
  spa.rand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  spa.htmlEncode = function (value) {
    return $('<div/>').text(value).html();
  };
  spa.htmlDecode = function (value) {
    return $('<div/>').html(value).text();
  };

  spa.appendToObj = function(xObj, oKey, oValue) {
    if (_.has(xObj, oKey)) {
      if (!_.isArray(xObj[oKey])) {
        xObj[oKey] = [xObj[oKey]];
      }
      xObj[oKey].push(oValue);
    } else {
      xObj[oKey] = oValue;
    };
  };

  spa.parseKeyStr = function (keyName, changeToLowerCase) {
    return ((changeToLowerCase ? keyName.toLowerCase() : keyName).replace(/[^_0-9A-Za-z]/g, ""));
  };
  spa.setObjProperty = function (obj, keyNameStr, propValue, keyToLowerCase) {
    keyNameStr = ('' + keyNameStr);
    keyToLowerCase = keyToLowerCase || false;
    var xObj = obj, oKey;
    var oKeys = keyNameStr.split(/(?=[A-Z])/);
    /*Default: camelCase | TitleCase*/
    var keyIdentifier = $.trim(keyNameStr.replace(/[0-9A-Za-z]/g, ""));
    if (keyIdentifier && (keyIdentifier != "")) {
      oKeys = keyNameStr.split(keyIdentifier[0]);
    }
    while (oKeys.length > 1) {
      oKey = spa.parseKeyStr(oKeys.shift(), keyToLowerCase);
      if ($.trim(oKey) != "") {
        if (typeof xObj[oKey] == "undefined") xObj[oKey] = {};
        xObj = xObj[oKey];
      }
    }
    oKey = spa.parseKeyStr(oKeys.shift(), keyToLowerCase);
    spa.appendToObj(xObj, oKey, propValue);

    return obj;
  };

  spa.setSimpleObjProperty = function (obj, keyNameStr, propValue) {
    keyNameStr = ('' + keyNameStr);
    var xObj = obj, oKey;
    var oKeys = keyNameStr.split('.');
    while (oKeys.length > 1) {
      oKey = spa.parseKeyStr(oKeys.shift(), false);
      if ($.trim(oKey) != "") {
        if (typeof xObj[oKey] == "undefined") xObj[oKey] = {};
        xObj = xObj[oKey];
      }
    }
    oKey = spa.parseKeyStr(oKeys.shift(), false);
    xObj[oKey] = propValue;

    return obj;
  };

  spa.objProp = spa.objProperty = spa.objectProp = spa.objectProperty = function(){
    var obj=arguments[0], keyNameStr=arguments[1], propValue=arguments[2];
    if (arguments.length == 3) {
      return spa.setSimpleObjProperty(obj, keyNameStr, propValue);
    } else if (arguments.length == 2) {
      return spa.findSafe(obj, keyNameStr);
    } else {
      return obj;
    }
  };

  spa.getElValue = function (el, escHTML) {
    el = $(el).get(0);
    var elValue, unchkvalue;
    switch ((el.tagName).toUpperCase()) {
      case "INPUT":
        switch ((el.type).toLowerCase()) {
          case "checkbox":
            unchkvalue = $(el).data("unchecked");
            elValue = el.checked ? (el.value) : ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
            break;
          case "radio":
            elValue = el.checked ? (el.value) : "";
            break;
          default:
            elValue = $(el).val();
            break;
        }
        break;

      case "SELECT":
        elValue = $.map(($(el).find("option:selected")), function (option) {
          return (option.value);
        }).join(",");
        break;

      case "TEXTAREA":
        elValue = $(el).val();
        break;

      default:
        elValue = escHTML? $(el).text() : $(el).html();
        break;
    }
    return elValue;
  };

  spa.serialize = function(scope, context, escHTML){
    if (_.isBoolean(scope)) { //making scope optional
      escHTML = scope;
      scope = '';
    }
    if (_.isBoolean(context)) { //making context optional
      escHTML = context;
      context = '';
    }
    scope = scope || 'body';
    var retObj = {}, keyName, elValue, $elData, escElHTML
      , contextSelector = (context)? '[data-serialize-context*="'+context+'"]' : '';
    $(scope).find('[data-serialize]'+contextSelector+',input[name]'+contextSelector+',select[name]'+contextSelector+',textarea[name]'+contextSelector+'').each(function(i, el){
      $elData = $(el).data();
      keyName = el.name || $elData['serialize'];
      escElHTML = $elData['serializeType']? ($elData['serializeType'].equalsIgnoreCase('text')) : escHTML;
      elValue = spa.getElValue(el, escElHTML);

      if (!retObj.hasOwnProperty(keyName)) {
        retObj[keyName] = elValue;
      } else if (!spa.isBlank(elValue)) {
        if (spa.isBlank(retObj[keyName])) {
          retObj[keyName] = elValue;
        } else if (_.isArray(retObj[keyName])) {
          retObj[keyName].push(elValue);
        } else {
          retObj[keyName] = [retObj[keyName], elValue];
        };
      };
    });
    return retObj;
  };

  spa.serializeToQueryString = function(scope, context){
    return spa.toQueryString(spa.serialize(scope, context));
  };

  spa.serializeDisabled = function (formSelector) {
    var retValue = "";
    $(formSelector).find("[disabled][name]").each(function () {
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + spa.getElValue(this);
    });
    return retValue;
  };

  /*
   * spa.serializeForms(formSelector, includeDisabledElements)
   * @formSelector {string} jQuery form selector #Form1,#Form2...
   * @includeDisabledElements {boolean} true | false [default:false]
   * @returns {string} param1=value1&param2=value2...
   */
  spa.serializeForms = function (formSelector, includeDisabledElements) {
    var disabledElementsKeyValues, unchkvalue, retValue = $(formSelector).serialize();

    //include unchecked checkboxes
    $(formSelector).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function () {
      unchkvalue = $(this).data("unchecked");
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
    });

    if (includeDisabledElements) {
      disabledElementsKeyValues = spa.serializeDisabled(formSelector);
      retValue += ((retValue && disabledElementsKeyValues) ? '&' : '') + disabledElementsKeyValues;
    }
    return retValue;
  };

  spa.queryStringToJson = spa.queryStringToObject = function (qStr) {
    var retValue = {}, qStringWithParams = (qStr || location.search), qIndex = ('' + qStringWithParams).indexOf('?'), ampIndex = ('' + qStringWithParams).indexOf('&');
    if (qStringWithParams && (qStringWithParams.length > 0) && (qIndex >= 0) && ((qIndex == 0) || (ampIndex > qIndex))) {
      qStringWithParams = qStringWithParams.substring(qIndex + 1);
    }
    _.each((qStringWithParams.split('&')), function (nvp) {
      nvp = nvp.split('=');
      if (nvp[0]) {
        spa.appendToObj(retValue, nvp[0], decodeURIComponent(nvp[1] || ''));
      }
    });
    return retValue;
  };

  spa.toQueryString = spa.ObjectToQueryString = spa.JsonToQueryString = function (obj) {
    return _.isObject(obj)? (Object.keys(obj).reduce(function (str, key, i) {
      var delimiter, val;
      delimiter = (i === 0) ? '' : '&';
      key = encodeURIComponent(key);
      val = _.isArray(obj[key])? obj[key].map(function(item){ return encodeURIComponent(item); }).join(',') : encodeURIComponent(obj[key]);
      return [str, delimiter, key, '=', val].join('');
    }, '')) : '';
  };

  $.fn.serializeUncheckedCheckboxes = function (appendTo) {
    var $chkBox, unchkvalue, keyName, keyValue
      , toJSON = (typeof appendTo == "object")
      , retObj = (toJSON) ? appendTo : {}
      , retStr = (toJSON && !appendTo) ? ('') : (appendTo);

    $(this).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function (index, el) {
      $chkBox = $(el);
      keyName = $chkBox.attr('name');
      unchkvalue = $chkBox.data("unchecked");
      keyValue = ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
      if (toJSON) {
        spa.appendToObj(retObj, keyName, keyValue);
      }
      else {
        retStr += ((retStr) ? '&' : '') + keyName + '=' + keyValue;
      }
    });
    return ((toJSON) ? retObj : retStr);
  };
  spa.serializeUncheckedCheckboxes = function (formSelector, appendTo) {
    return $(formSelector).serializeUncheckedCheckboxes(appendTo);
  };

  /* Serialize form elements to Json Object
   * $("#formId").serializeFormToJson(obj, keyNameToLowerCase);
   * keyNameToLowerCase: converts form element names to its correponding lowercase obj's attribute
   * obj: Optional; creates/returns new JSON if not provided; overwrite & append attributes on the given obj if provided
   * */
  $.fn.serializeFormToJSON = $.fn.serializeFormToObject = function (obj, keyNameToLowerCase, strPrefixToIgnore) {
    var a = this.serializeArray()
      , o = (typeof obj === "object") ? obj : {}
      , c = (typeof obj === "boolean") ? obj : (keyNameToLowerCase || false)
      , kParse = $(this).data("serializeIgnorePrefix")
      , oKeyName, oKeyValue;
    if (strPrefixToIgnore) kParse = strPrefixToIgnore;
    $.each(a, function () {
      oKeyName = (kParse) ? (this.name).replace(kParse, "") : this.name;
      o = spa.setObjProperty(o, oKeyName, this.value, c);
    });

    //include unchecked checkboxes
    $(this).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function () {
      oKeyName = $(this).attr('name');
      if (oKeyName) {
        oKeyValue = $(this).data("unchecked");

        if (kParse) {
          oKeyName = (oKeyName).replace(kParse, "");
        }
        oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);

        o = spa.setObjProperty(o, oKeyName, oKeyValue, c);
      }
    });

    return o;
  };

  $.fn.serializeFormToSimpleJSON = $.fn.serializeFormToSimpleObject = function (obj, includeDisabledElements) {
    var a = this.serializeArray()
      , o = (typeof obj === "object") ? obj : {}
      , c = (typeof obj === "boolean") ? obj : (includeDisabledElements || false)
      , oKeyStr, oGrpStr
      , oKeyName, oKeyValue;

    $.each(a, function () {
      spa.appendToObj(o, this.name, this.value);
    });
    if (c) {
      $(this).find("[disabled][name]").each(function () {
        spa.appendToObj(o, this.name, spa.getElValue(this));
      });
    }
    //include unchecked checkboxes
    $(this).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function () {
      oKeyName = $(this).attr('name');
      oKeyValue = $(this).data("unchecked");
      oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);
      spa.appendToObj(o, oKeyName, oKeyValue);
    });

    $(this).find("[data-to-json-group][name]").each(function () {
      oKeyStr = this.name;
      oGrpStr = $(this).data("toJsonGroup");
      if (oGrpStr) {
        if (!o[oGrpStr]) o[oGrpStr] = {};
        spa.appendToObj(o[oGrpStr], oKeyStr, spa.getElValue(this));
      }
    });
    return o;
  };
  spa.serializeFormToSimpleJSON = spa.serializeFormToSimpleObject = function (formSelector, obj, includeDisabledElements) {
    return $(formSelector).serializeFormToSimpleJSON(obj, includeDisabledElements);
  };

  spa.serializeFormToJSON = spa.serializeFormToObject = function (formSelector, obj, keyNameToLowerCase, strPrefixToIgnore) {
    return $(formSelector).serializeFormToJSON(obj, keyNameToLowerCase, strPrefixToIgnore);
  };

  /* find(jsonObject, 'key1.key2.key3[0].key4'); */
  spa.find = spa.locate = function (obj, path) {
    var tObj = obj, retValue;
    if (typeof eval("tObj." + path) != "undefined") retValue = eval("tObj." + path);
    return retValue;
  };

  spa.findSafe = spa.locateSafe = spa.valueOfPath = function (obj, pathStr, def) {
    for (var i = 0, path = spa.toDottedPath(pathStr).split('.'), len = path.length; i < len; i++) {
      if (!obj || typeof obj == "undefined") return def;
      obj = obj[path[i]];
    }
    if (typeof obj == "undefined") return def;
    return obj;
  };

  spa.has = spa.hasKey = function (obj, path) {
    var tObj = obj, retValue = false;
    try {
      retValue = (typeof eval("tObj." + path) != "undefined");
    } catch(e) {
      spa.console.error("Key["+path+"] error in object.\n" + e.stack);
    };
    return retValue;
  };

  function of (x) {
    return (Object.prototype.toString.call(x)).replace(/\[object /, '').replace(/\]/, '').toLowerCase();
  }
  function is(x, type) {
    return ((''+type).toLowerCase().indexOf(of(x)) >= 0);
  }

  spa.of = of;
  spa.is = is;

  function _isObjHasKeys(obj, propNames, deep){

    function checkForAll(obj, propNames){
      var pKeys = propNames.split(','), pKey = '', pKeysCount = 0, retValue = true, hasKey;
      for(var i=0;i<pKeys.length; i++) {
        pKey = pKeys[i].trim();
        if (pKey) {
          pKeysCount++;
          hasKey = (deep && ((pKey.indexOf('.')>0) || (pKey.indexOf('[')>0)))? spa.hasKey(obj, pKey) : obj.hasOwnProperty(pKey);
          retValue = retValue && hasKey;
        }
      }

      return pKeysCount && retValue;
    }

    function checkForAny(obj, propNames){
      var pKeys = propNames.split(','), pKey = '', pKeysCount = 0, retValue = false, hasKey;
      for(var i=0;i<pKeys.length; i++) {
        pKey = pKeys[i].trim();
        if (pKey) {
          pKeysCount++;
          hasKey = (deep && ((pKey.indexOf('.')>0) || (pKey.indexOf('[')>0)) )? spa.hasKey(obj, pKey) : obj.hasOwnProperty(pKey);
          retValue = retValue || hasKey;
        }
        if (retValue) break;
      }

      return pKeysCount && retValue;
    }

    var retValue = false;
    if (is(obj, 'object')){
      if (propNames){
        propNames =  ''+propNames;
        switch(true) {
          case (propNames.indexOf('&')>0) : retValue = checkForAll(obj, propNames.replace(/\&/g, ','));
          break;
          case (propNames.indexOf('|')>0) : retValue = checkForAny(obj, propNames.replace(/\|/g, ','));
          break;
          default: retValue = checkForAll(obj, propNames);
          break;
        }
      }
    }

    return retValue;
  };

  spa.hasPrimaryKeys = function _spa_hasPrimaryKeys(obj, propNames){
    return _isObjHasKeys(obj, propNames);
  };
  spa.hasKeys = function _spa_hasKeys(obj, propNames){
    return _isObjHasKeys(obj, propNames, true);
  };

  spa.hasIgnoreCase = spa.hasKeyIgnoreCase = function (obj, pathStr) {
    var retValue = "", tObj = obj || {}, lookupPath = ""+spa.toDottedPath((pathStr));
    var objKeys = spa.keysDottedAll(tObj); //get AllKeys with dotted notation
    if (objKeys && !_.isEmpty(objKeys)) {
      spa.console.debug(objKeys);
      _.some(objKeys, function(oKey){
        var isMatch = oKey.equalsIgnoreCase(lookupPath);
        if (!isMatch) {
          isMatch = oKey.beginsWithStrIgnoreCase(lookupPath+".");
          if (isMatch) {
            oKey = oKey.slice(0, oKey.lastIndexOf("."));
          }
        }
        if (isMatch) retValue = oKey;
        return (isMatch);
      });
    }
    return retValue;
  };

  spa.findIgnoreCase = function(obj, path, ifNot){
    var retValue = ifNot;
    var keyInObj = spa.hasIgnoreCase(obj, path);
    if (keyInObj){
      retValue = spa.findSafe(obj, keyInObj, ifNot);
    };
    return retValue;
  };

  /*Get All keys like X-Path with dot and [] notations */
  spa.keysDottedAll = function (a) {
    var objKeys = spa.keysDotted(a);
    if (objKeys && !_.isEmpty(objKeys)) {
      objKeys = spa.toDottedPath(objKeys.join(",")).split(",");
    };
    return objKeys;
  };
  spa.keysDotted = function (a) {
    a = a || {};
    var list = [], xConnectorB, xConnectorE, curKey;
    (function (o, r) {
      r = r || '';
      if (typeof o != 'object') {
        return true;
      }
      for (var c in o) {
        curKey = r.substring(1);
        xConnectorB = (spa.isNumber(c)) ? "[" : ".";
        xConnectorE = (((curKey) && (xConnectorB == "[")) ? "]" : "");
        if (arguments.callee(o[c], r + xConnectorB + c + xConnectorE)) {
          list.push((curKey) + (((curKey) ? xConnectorB : "")) + c + (xConnectorE));
        }
      }
      return false;
    })(a);
    return list;
  };

  spa.keysCamelCase = function (a) {
    return (_.map(spa.keysDotted(a), function (name) {
      var newName = (name).replace(/\./g, " ").toProperCase().replace(/ /g, "");
      return (newName[0].toLowerCase() + newName.substring(1));
    }));
  };

  spa.keysTitleCase = function (a) {
    return (_.map(spa.keysDotted(a), function (name) {
      return ((name).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
    }));
  };

  spa.keys_ = function (a) {
    return (_.map(spa.keysDotted(a), function (name) {
      return ((name).replace(/\./g, "_"));
    }));
  };

  Object.defineProperties(Array.prototype, {
    '__toObject': {
      value : function(key){
        var retObj = {}, itemKey;
        this.forEach(function(item, index){
          if (is(item, 'object')) {
            itemKey = (key)? (is(item, 'object')? spa.findSafe(item, key) : index ) : index;
            retObj[ itemKey ] = item;
          }
        });
        return retObj;
      },
      enumerable : false,
      configurable: false
    }
  });

  Object.defineProperties(Object.prototype, {
    '__keys': {
      value: function _obj_keys(deep){
        return (deep)? spa.keysDotted(this) : Object.keys(this);
      },
      enumerable : false,
      configurable: false
    },
    '__keysAll': {
      value: function _obj_keysAll(){
        return spa.keysDotted(this);
      },
      enumerable : false,
      configurable: false
    },
    '__hasKey' : {
      value: function _obj_hasKey(key) {
        return spa.hasKey(this, key);
      },
      enumerable : false,
      configurable: false
    },
    '__hasKeys' : {
      value: function _obj_hasKeys(keys) {
        return _isObjHasKeys(this, keys, true);
      },
      enumerable : false,
      configurable: false
    },
    '__hasPrimaryKeys': {
      value: function _obj_hasPrimaryKeys(keys){
        return _isObjHasKeys(this, keys);
      },
      enumerable : false,
      configurable: false
    },
    '__valueOf' : {
      value: function _obj_getValueOf(path, ifUndefined) {
        return spa.findSafe(this, path, ifUndefined);
      },
      enumerable : false,
      configurable: false
    },
    '__clone': {
      value: function _obj_clone(){
        Array.prototype.unshift.call(arguments, {}, this);
        return _.merge.apply(undefined, arguments);
      },
      enumerable : false,
      configurable: false
    },
    '__merge': {
      value: function _obj_clone(){
        Array.prototype.unshift.call(arguments, this);
        return _.merge.apply(undefined, arguments);
      },
      enumerable : false,
      configurable: false
    },
    '__stringify': {
      value: function(){
        return JSON.stringify(this);
      },
      enumerable : false,
      configurable: false
    }
  });

  $.cachedScript = function (url, options) {
    /* allow user to set any option except for dataType, cache, and url */
    options = $.extend(options || {}, {
      dataType: "script",
      cache: true,
      url: url
    });
    spa.console.info("$.cachedScript('" + url + "')");
    /* Use $.ajax() since it is more flexible than $.getScript
     * Return the jqXHR object so we can chain callbacks
     */
    return $.ajax(options);
  };

  $.cachedStyle = function (styleId, url, options) {
    /* allow user to set any option except for dataType, cache, and url */
    options = $.extend(options || {}, {
      dataType: "text",
      cache: true,
      url: url,
      success: function (cssStyles) {
        $("head").append("<style id='" + (styleId) + "' type='text/css'>" + cssStyles + "<\/style>");
      }
    });
    spa.console.info("$.cachedScript('" + url + "')");
    /* Use $.ajax() since it is more flexible than $.getScript
     * Return the jqXHR object so we can chain callbacks
     */
    return $.ajax(options);
  };

  /* Add Script Tag */
  spa.addScriptTag = function (scriptId, scriptSrc) {
    scriptId = scriptId.replace(/#/, "");
    spa.console.group("spaAddScriptTag");
    if (!spa.isElementExist("#spaScriptsCotainer")) {
      spa.console.info("#spaScriptsCotainer NOT Found! Creating one...");
      $('body').append("<div id='spaScriptsCotainer' style='display:none' rel='Dynamic Scripts Container'></div>");
    }
    if (spa.isElementExist("#" + scriptId)) {
      spa.console.info("script [" + scriptId + "] already found in local.");
    }
    else {
      spa.console.info("script [" + scriptId + "] NOT found. Added script tag with src [" + scriptSrc + "]");
      var scriptSrcAttr = (scriptSrc)? "src='" + scriptSrc + "'" : "";
      $("#spaScriptsCotainer").append("<script id='" + (scriptId) + "' type='text/javascript' "+scriptSrcAttr+"><\/script>");
    }
    spa.console.groupEnd("spaAddScriptTag");
  };

  /* Add Style Tag */
  spa.addStyle = function (styleId, styleSrc) {
    styleId = styleId.replace(/#/, "");
    spa.console.group("spaAddStyle");
    if (!spa.isElementExist("#spaStylesCotainer")) {
      spa.console.info("#spaStylesCotainer NOT Found! Creating one...");
      $('body').append("<div id='spaStylesCotainer' style='display:none' rel='Dynamic Styles Container'></div>");
    }
    if (spa.isElementExist("#" + styleId)) {
      spa.console.info("style [" + styleId + "] already found in local.");
    }
    else {
      spa.console.info("style [" + styleId + "] NOT found. Added link tag with href [" + styleSrc + "]");
      $("#spaStylesCotainer").append("<link id='" + (styleId) + "' rel='stylesheet' type='text/css' href='" + styleSrc + "'\/>");
    }
    spa.console.groupEnd("spaAddStyle");
  };

  /* Loading script */
  spa.loadScript = function (scriptId, scriptPath, useScriptTag, tAjaxRequests) {
    scriptId = scriptId.replace(/#/, "");
    useScriptTag = useScriptTag || false;
    tAjaxRequests = tAjaxRequests || [];
    spa.console.group("spaScriptsLoad");
    if (spa.isBlank(scriptPath)) {
      spa.console.error("script path [" + scriptPath + "] for [" + scriptId + "] NOT defined.");
    }
    else {
      if (useScriptTag) {
        spa.addScriptTag(scriptId, scriptPath);
      }
      else { /* load script script-URL */
        tAjaxRequests.push(
          $.cachedScript(scriptPath).done(function (script, textStatus) {
            spa.console.info("Loaded script [" + scriptId + "] from [" + scriptPath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    spa.console.groupEnd("spaScriptsLoad");
    return (tAjaxRequests);
  };

  spa.getComponentsFullPath = function(compNameLst){
    compNameLst = spa.strToArray(spa.toJSON(compNameLst));
    return _.map(compNameLst, function(compName){ return (spa.defaults.components.rootPath)+ ((spa.defaults.components.inFolder)? compName: '') +'/'+compName+'.js'; });
  };

  spa.loadComponents = function(compNameLst, onDone, onFail) {
    var unloadedComponents = _.filter(spa.strToArray(spa.toJSON(compNameLst)), function(compName){
      return (!spa.components.hasOwnProperty(compName));
    });
    spa.loadScripts(spa.getComponentsFullPath(unloadedComponents), onDone, onFail);
  };

  spa.loadScripts = function(scriptsLst, onDone, onFail) {
    scriptsLst = spa.strToArray(spa.toJSON(scriptsLst));
//    if (typeof scriptsLst === 'string'){
//      scriptsLst = spa.toJSON(scriptsLst);
//      if (typeof scriptsLst === 'string') {
//        scriptsLst = [scriptsLst];
//      }
//    }

    if (!spa.isBlank(scriptsLst)) {
      var ajaxQ = [];
      _.each(scriptsLst, function(scriptPath) {
        ajaxQ.push(
          $.cachedScript(scriptPath).done(function (script, textStatus) {
            spa.console.info("Loaded script from [" + scriptPath + "]. STATUS: " + textStatus);
          }).fail(function(){
            spa.console.info("Failed Loading script from [" + scriptPath + "].");
          })
        );
      });

      $.when.apply($, ajaxQ)
        .then(function(){
          spa.renderUtils.runCallbackFn(onDone);
        })
        .fail(function(){
          spa.renderUtils.runCallbackFn(onFail);
        });
    }
  };

  spa.loadScriptsSync = function(scriptsLst, onDone, onFail) {
    scriptsLst = spa.strToArray(spa.toJSON(scriptsLst));
//    if (typeof scriptsLst === 'string'){
//      scriptsLst = spa.toJSON(scriptsLst);
//      if (typeof scriptsLst === 'string') {
//        scriptsLst = [scriptsLst];
//      }
//    }
    if (spa.isBlank(scriptsLst)) {
      spa.renderUtils.runCallbackFn(onDone);
    } else {
      var scriptPath = scriptsLst.shift();
      $.cachedScript(scriptPath).done(function (script, textStatus) {
            spa.console.info("Loaded script from [" + scriptPath + "]. STATUS: " + textStatus);
            spa.loadScriptsSync(scriptsLst, onDone);
          }).fail(function(){
            spa.console.info("Failed Loading script from [" + scriptPath + "].");
            spa.renderUtils.runCallbackFn(onFail);
          });
    }
  };

  /* Loading style */
  spa.loadStyle = function (styleId, stylePath, useStyleTag, tAjaxRequests) {
    styleId = styleId.replace(/#/, "");
    useStyleTag = useStyleTag || false;
    tAjaxRequests = tAjaxRequests || [];
    spa.console.group("spaStylesLoad");
    if (spa.isBlank(stylePath)) {
      spa.console.error("style path [" + stylePath + "] for [" + styleId + "] NOT defined.");
    }
    else {
      if (useStyleTag) {
        spa.addStyle(styleId, stylePath);
      }
      else { /* load style style-URL */
        tAjaxRequests.push(
          $.cachedStyle(styleId, stylePath).done(function (style, textStatus) {
            spa.console.info("Loaded style [" + styleId + "] from [" + stylePath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    spa.console.groupEnd("spaStylesLoad");
    return (tAjaxRequests);
  };

  /* Add Template script to BODY */
  spa.addTemplateScript = function (tmplId, tmplBody, tmplType) {
    tmplId = tmplId.replace(/#/, "");
    tmplType = tmplType  || 'x-template';
    if (!spa.isElementExist("#spaViewTemplateCotainer")) {
      spa.console.info("#spaViewTemplateCotainer NOT Found! Creating one...");
      $('body').append("<div id='spaViewTemplateCotainer' style='display:none' rel='Template Container'></div>");
    }
    spa.console.info("Adding <script id='" + (tmplId) + "' type='text/" + tmplType + "'>");
    tmplBody = tmplBody.replace(/<( )*script/gi,'<_SCRIPTTAGINTEMPLATE_').replace(/<( )*(\/)( )*script/gi,'</_SCRIPTTAGINTEMPLATE_')
            .replace(/<( )*link/gi,'<_LINKTAGINTEMPLATE_').replace(/<( )*(\/)( )*link/gi,'</_LINKTAGINTEMPLATE_');
    $("#spaViewTemplateCotainer").append("<script id='" + (tmplId) + "' type='text/" + tmplType + "'>" + tmplBody + "<\/script>");
  };
  spa.updateTemplateScript = function (tmplId, tmplBody, tmplType){
    tmplId = tmplId.replace(/#/, "");
    var $tmplScript = $('#spaViewTemplateCotainer').find('#'+tmplId);
    if ($tmplScript.length) {
      $tmplScript.remove();
    }
    spa.addTemplateScript(tmplId, tmplBody, tmplType);
  };

  /* Load external or internal (inline or #container) content as template script */
  spa.loadTemplate = function (tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload) {
    tmplId = tmplId.replace(/#/g, "");
    tmplPath = (tmplPath.ifBlankStr("inline")).trimStr();
    templateType = templateType || "x-template";
    viewContainerId = viewContainerId || "#DummyInlineTemplateContainer";
    tAjaxRequests = tAjaxRequests || [];
    spa.console.group("spaTemplateAjaxQue");
    if (!spa.isElementExist("#"+tmplId)) {
      spa.console.info("Template[" + tmplId + "] of [" + templateType + "] NOT found. Source [" + tmplPath + "]");
      if ((tmplPath.equalsIgnoreCase("inline") || tmplPath.beginsWithStr("#"))) { /* load from viewTargetContainer or local container ID given in tmplPath */
        var localTemplateSrcContainerId = tmplPath.equalsIgnoreCase("inline")? viewContainerId : tmplPath;
        var $localTemplateSrcContainer = $(localTemplateSrcContainerId);
        var inlineTemplateHTML = $localTemplateSrcContainer.html();
        if (spa.isBlank(inlineTemplateHTML)) {
          spa.console.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined inline in ["+localTemplateSrcContainerId+"].");
        }
        else {
          spa.addTemplateScript(tmplId, inlineTemplateHTML, templateType);
          if (tmplPath.equalsIgnoreCase("inline")) $localTemplateSrcContainer.html("");
        }
      }
      else if (tmplPath.equalsIgnoreCase("none")) {
        spa.console.warn("Template[" + tmplId + "] of [" + templateType + "] defined as NONE. Ignoring template.");
      }
      else if (!tmplPath.equalsIgnoreCase("script")) { /* load from templdate-URL */
        var axTemplateRequest;
        if (tmplReload) {
          spa.console.warn(">>>>>>>>>> Making New Template Request");
          axTemplateRequest = $.ajax({
            url: tmplPath,
            cache: false,
            dataType: "html",
            success: function (template) {
              spa.addTemplateScript(tmplId, template, templateType);
              spa.console.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
            },
            error: function (jqXHR, textStatus, errorThrown) {
              spa.console.error("Failed Loading Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]. [" + textStatus + ":" + errorThrown + "]");
            }
          });
        } else {
          axTemplateRequest = $.get(tmplPath, function (template) {
            spa.addTemplateScript(tmplId, template, templateType);
            spa.console.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
          }, "html");
        }
        tAjaxRequests.push(axTemplateRequest);
      } else {
        spa.console.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined in <script>.");
      }
    }
    else {
      var $tmplId = $("#"+tmplId);
      if (tmplReload) {
        spa.console.warn("Reload Template[" + tmplId + "] of [" + templateType + "]");
        $tmplId.remove();
        tAjaxRequests = spa.loadTemplate(tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload);
      } else if (spa.isBlank(($tmplId.html()))) {
        spa.console.warn("Template[" + tmplId + "] of [" + templateType + "] script found EMPTY!");
        var externalPath = "" + $tmplId.attr("path");
        if (!spa.isBlank((externalPath))) {
          templateType = ((($tmplId.attr("type")||"").ifBlankStr(templateType)).toLowerCase()).replace(/text\//gi, "");
          spa.console.info("prepare/remove to re-load Template[" + tmplId + "]  of [" + templateType + "] from external path: [" + externalPath + "]");
          $tmplId.remove();
          tAjaxRequests = spa.loadTemplate(tmplId, externalPath, templateType, viewContainerId, tAjaxRequests, tmplReload);
        }
      } else {
        spa.console.info("Template[" + tmplId + "]  of [" + templateType + "] already found in local.");
      }
    }
    spa.console.groupEnd("spaTemplateAjaxQue");

    return (tAjaxRequests);
  };

  /*Get URL Parameters as Object
   * if url = http://xyz.com/page?param0=value0&param1=value1&paramX=valueA&paramX=valueB
   * spa.urlParams() => {param0: "value0", param1:"value1", paramX:["valueA", "valueB"]}
   * spa.urlParams()["param0"] => "value0"
   * spa.urlParams().param0    => "value0"
   * spa.urlParams().paramX    => ["valueA", "valueB"]
   * spa.urlParams().paramZ    => undefined
   * */
  spa.urlParams = function (urlQuery) {
    urlQuery = (urlQuery || window.location.search || "");
    urlQuery = (urlQuery.beginsWithStr("\\?") || urlQuery.indexOf("//") < 7) ? urlQuery.substr(urlQuery.indexOf("?") + 1) : urlQuery;
    var qParams = {};
    urlQuery.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function (match, key, value) {
      (qParams[key] = qParams[key] || []).push(decodeURIComponent(value));
    });
    _.each(qParams, function (value, key) {
      qParams[key] = (_.isArray(value) && value.length == 1) ? value[0] : value;
    });
    return qParams;
  };
  /*Get URL Parameter value
   * if url = http://xyz.com/page?param0=value0&param1=value1&paramX=valueA&paramX=valueB
   * spa.urlParam("param0") => "value0"
   * spa.urlParam("paramX") => ["valueA", "valueB"]
   * spa.urlParam("paramZ") => undefined
   * */
  spa.urlParam = function (name, queryString) {
    return (spa.urlParams(queryString)[name]);
  };

  /*Get URL Hash value
   * current window location = http://xyz.com/page#/hash0/hash1/hash2
   * spa.getLocHash()   => "#/hash0/hash1/hash2"
   * */
  spa.getLocHash = function(){
    return window.location.hash || "";
  };
  /*Get URL Hash value
   * if url = http://xyz.com/page#/hash0/hash1/hash2
   * spa.urlHash()   => "/hash0/hash1/hash2"
   * spa.urlHash(1)  => "hash1"
   * spa.urlHash([]) => ["hash0", "hash1", "hash2"]
   * spa.urlHash(["key0", "key1", "key3"]) => {"key0":"hash0", "key1":"hash1", "key2":"hash2"}
   * */
  spa.urlHash = function (returnOf, hashDelimiter) {
    var retValue = (spa.getLocHash() || "#").substring(1);
    if (returnOf) {
      hashDelimiter = hashDelimiter || "/";
      retValue = retValue.beginsWithStr(hashDelimiter) ? retValue.substring(retValue.indexOf(hashDelimiter) + (hashDelimiter.length)) : retValue;
      var hashArray = retValue.split(hashDelimiter);
      if (_.isNumber(returnOf)) {
        retValue = (hashArray && hashArray.length > returnOf) ? hashArray[returnOf] : "";
      }
      else if (_.isArray(returnOf)) {
        retValue = (returnOf.length === 0) ? hashArray : _.zipObject(returnOf, hashArray);
      } else if (_.isString(returnOf) && returnOf == "?") {
        retValue = (retValue.containsStr("\\?"))? spa.getOnSplit(retValue, "?", 1) : "";
      }
    }
    return retValue;
  };
  /*Similar to spa.urlParam on HashParams*/
  spa.hashParam = function (name) {
    var retValue = (''+spa.urlHash('?'));
    if (typeof name !== "undefined" && !spa.isBlank(retValue)) {
      retValue = spa.urlParam((''+name), retValue);
    }
    return (retValue);
  };

  /*
   spa.routeMatch("#url-path/:param1/:param2?id=:param3", "#url-path/serviceName/actionName?id=Something")
   ==>
   {   hkeys: [':param1', ':param2', ':param3']
   , params: {'param1':'serviceName','param2':'actionName','param3':'Something'}
   }
   *
   * */
  spa.routeMatch = function (routePattern, urlHash) {
    var rxParamMatcher = new RegExp(":[a-zA-Z0-9\\_\\-]+", "g")
      , routeMatcher = new RegExp(routePattern.replace(rxParamMatcher, '([\\w\\+\\-\\|\\.\\?]+)'))
      , _keysSrc = routePattern.match(rxParamMatcher)
      , _values  = urlHash.match(routeMatcher)
      , _matchResult = (_values && !_.isEmpty(_values))? _values.shift() : ""
      , _keys   = (_keysSrc && !_.isEmpty(_keysSrc))? _keysSrc.join(',').replace(/:/g,'').split(',') : []
      , _values = (_values && !_.isEmpty(_values))? _values.join(',').replace(/\?/g, '').split(',') : []
      , retValue = undefined;
    if (_matchResult) {
      retValue = {
        hkeys: _keysSrc
        , params: _.zipObject(_keys, _values)
      };
    }
    return (retValue);
  };


  /* i18n support */
  spa.i18n = {};
  spa.i18n.loaded = false;
  spa.i18n.settings = {
    name: 'Language',
    path: 'language/',
    ext: '.txt',
    encoding: 'UTF-8',
    cache: true,
    mode: 'map',
    callback: null
  };
  spa.i18n.setLanguage = function (lang, i18nSettings) {
    if ($.i18n) {
      $.i18n.map = {}; //empty dictionary before loading lang file
      lang = lang || ($.i18n.browserLang()).replace(/-/g, "_");
      i18nSettings = $.extend(spa.i18n.settings, i18nSettings);
      $.i18n.properties({
        name: i18nSettings.name,
        language: lang,
        path: i18nSettings.path,
        ext: i18nSettings.ext,
        encoding: i18nSettings.encoding,
        cache: i18nSettings.cache,
        async: i18nSettings.async,
        mode: i18nSettings.mode,
        callback: function () {
          if (!spa.isElementExist('#i18nSpaRunTime')) {
            $("body").append('<div id="i18nSpaRunTime" style="display:none"></div>');
          };
          $.i18n.loaded = (typeof $.i18n.loaded == "undefined") ? (!$.isEmptyObject($.i18n.map)) : $.i18n.loaded;
          spa.i18n.loaded = spa.i18n.loaded || $.i18n.loaded;
          if ((lang.length > 1) && (!$.i18n.loaded)) {
            spa.console.warn("Error Loading Language File [" + lang + "]. Loading default.");
            spa.i18n.setLanguage("_", i18nSettings);
          }
          spa.i18n.apply();
          if (i18nSettings.callback) {
            i18nSettings.callback($.i18n.loaded);
          }
        }
      });
    }
  };

  spa.i18n.value = function(i18nKey) {
    i18nKey = (''+i18nKey).replace(/i18n:/i, '').trim();
    if (i18nKey.beginsWithStrIgnoreCase('@')) {
      i18nKey = ((i18nKey.substr(1)).trim());
      try { i18nKey = eval('('+i18nKey+')');
      } catch(e) {
        spa.console.error(e);
      };
    }
    var retValue = i18nKey;
    try {
      retValue = (!spa.i18n.loaded && window['Liferay'])? Liferay.Language.get(i18nKey) : $.i18n.prop(i18nKey);
    }catch(e) {
      spa.console.error(e);
    };
    return retValue;
  };

  spa.i18n.text = function (i18nKey, data) {
    var dMessage = spa.i18n.value(i18nKey);
    if (data) {
      var msgParamValue = "";
      _.each(_.keys(data), function (key) {
        msgParamValue = "" + data[key];
        if (msgParamValue && msgParamValue.beginsWithStrIgnoreCase("i18n:")) msgParamValue = spa.i18n.value(msgParamValue.replace(/i18n:/gi, ""));
        dMessage = dMessage.replace(new RegExp("{" + key + "}", "gi"), msgParamValue);
      });
    }
    return (''+dMessage).trimLeftStr('[').trimRightStr('\\]');
  };

  spa.i18n.apply = spa.i18n.render = function (contextRoot, elSelector) {
    if (spa.i18n.loaded || window['Liferay']) {
      contextRoot = contextRoot || "body";
      elSelector = elSelector || "";
      var isTag = contextRoot.beginsWithStr("<");
      if (isTag) {
        $('#i18nSpaRunTime').html(contextRoot);
        contextRoot = '#i18nSpaRunTime';
      };

      var $i18nElements = $(contextRoot).find(elSelector + "[data-i18n]");
      if (!$i18nElements.length) $i18nElements = $(contextRoot).filter(elSelector + "[data-i18n]");
      $i18nElements.each(function (indes, el) {
        var $el = $(el),
            i18nSpecStr = $el.data("i18n") || '';
        if ((i18nSpecStr) && (!i18nSpecStr.containsStr(':'))) i18nSpecStr = "html:'"+i18nSpecStr+"'";
        var i18nSpec = spa.toJSON(i18nSpecStr || "{}");
        var i18nData = i18nSpec['i18ndata'];
        if (i18nData) delete i18nSpec['i18ndata'];
        if (i18nSpec && !$.isEmptyObject(i18nSpec)) {
          _.each(_.keys(i18nSpec), function (attrSpec) {
            var i18nKey = i18nSpec[attrSpec];
            var i18nValue = spa.i18n.text(i18nKey, i18nData); //$.i18n.prop(i18nKey);
            _.each(attrSpec.split("_"), function (attribute) {
              switch (attribute.toLowerCase()) {
                case "html":
                  $el.html(i18nValue);
                  break;
                case "text":
                  $el.text(i18nValue);
                  break;
                default:
                  $el.attr(attribute, i18nValue);
                  break;
              }
            });
          });
        }
      });
    };

    if (isTag) {
      return $('#i18nSpaRunTime').html();
    }
  };

  /* Extend to jQuery as
   *
   * $("el-selector").i18n('i18n.key')
   *
   * */
  $.fn.extend({
    i18n: function (opt) {
      this.each(function () {
        if (opt) $(this).attr('data-i18n', opt).data('i18n', opt);
        spa.i18n.apply(this);
      });
      return this;
    }
  });

  spa.dataBind = spa.bindData = function (contextRoot, data, elFilter) {
    contextRoot = contextRoot || 'body';
    elFilter = elFilter || '';

    var $dataBindEls = $(contextRoot).find(elFilter + '[data-bind]');
    if (!$dataBindEls.length) $dataBindEls = $(contextRoot).filter(elFilter + '[data-bind]');

    var $el, bindSpecStr, bindSpec, bindKeyFn, bindKey, fnFormatData, bindValue, dataAttrKey, bindCallback;

    _.each($dataBindEls, function(el) {
      $el = $(el);
      bindSpecStr = $el.data('bind') || '';
      if ((bindSpecStr) && (!bindSpecStr.containsStr(':'))) bindSpecStr = "html:'"+bindSpecStr+"'";
      bindSpec = spa.toJSON(bindSpecStr || '{}');
      bindCallback = spa.renderUtils.getFn($el.data('bindCallback') || '');

      if (bindSpec && !$.isEmptyObject(bindSpec)) {

        _.each(_.keys(bindSpec), function (attrSpec) {
          bindKeyFn = (bindSpec[attrSpec]+'|').split('|');
          bindKey      = bindKeyFn[0].trimStr();
          fnFormatData = spa.renderUtils.getFn(bindKeyFn[1].trimStr());

          bindValue = spa.findSafe(data, bindKey);
          if (fnFormatData) {
            bindValue = fnFormatData(bindValue, el);
          }

          _.each(attrSpec.split("_"), function (attribute) {
            switch (attribute.toLowerCase()) {
              case 'html':
                $el.html(bindValue);
                break;
              case 'text':
                $el.text(bindValue);
                break;
              default:
                $el.attr(attribute, bindValue);
                if (attribute.beginsWithStr('data-')) {
                  dataAttrKey = spa.dotToCamelCase(attribute.getRightStr('-').replace(/-/g,'.'));
                  if (dataAttrKey) $el.data(dataAttrKey, bindValue);
                }
                break;
            }
          });

          if (bindCallback) {
            bindCallback(el);
          }
        });

      }
    });
  };

  spa.getModifiedElement = function (elSelector) {
    var modified, modifiedEl=undefined;
    var $elements = $(elSelector || "form:not([data-ignore-change]) :input:not(:disabled,:button,[data-ignore-change])");
    //$elements.each(function(index, element) //jQuery each does not break the loop
    _.every($elements, function (element) //lo-dash breaks the loop when condition not satisified
    { if (!modified) {
        if ((element.tagName.match(/^(select|textarea)$/i)) && (element.value != element.defaultValue)) {
          modified = true;
        }
        else if (element.tagName.match(/^input$/i)) {
          if (element.type.match(/^(checkbox|radio)$/i) && element.checked != element.defaultChecked) {
            modified = true;
          } else if (element.type.match(/^(text|password|hidden|color|email|month|number|tel|time|url|range|date|datetime|datetime-local)$/i) && element.value != element.defaultValue) {
            modified = true;
          }
        }
        if (modified) {
          modifiedEl = element;
        }
      }
      return (!modified);
    });
    return (modifiedEl);
  };
  spa.getModifiedElements = function (elSelector) {
    var modified, modifiedEls = [];
    var $elements = $(elSelector || "form:not([data-ignore-change]) :input:not(:disabled,:button,[data-ignore-change])");
    $elements.each(function (index, element) {
      modified = false;
      if ((element.tagName.match(/^(select|textarea)$/i)) && (element.value != element.defaultValue)) {
        modified = true;
      }
      else if (element.tagName.match(/^input$/i)) {
        if (element.type.match(/^(checkbox|radio)$/i) && element.checked != element.defaultChecked) {
          modified = true;
        } else if (element.type.match(/^(text|password|hidden|color|email|month|number|tel|time|url|range|date|datetime|datetime-local)$/i) && element.value != element.defaultValue) {
          modified = true;
        }
      }
      if (modified) {
        modifiedEls.push(element);
      }
    });
    return (modifiedEls);
  };

  spa.initTrackElValueChanges = spa.resetElementsDefaultValue = function (elSelector) {
    $(elSelector || "form :input:not(:disabled)").each(function (index, element) {
      element.defaultValue = element.value;
      if ((element.tagName.match(/^input$/i)) && (element.type.match(/^(checkbox|radio)$/i) && element.checked != element.defaultChecked)) {
        element.defaultChecked = element.checked;
      }
    });
  };

  spa.trash = {
      container:[]
    , push : function(junk){ this.container.push(junk); }
    , empty: function(){this.container = []; }
    , pick : function(tIndex){ return ((tIndex)? this.container[tIndex] : this.container); }
  };
  spa.fillData = function (data, context, options) {
    var ready2Fill = ((typeof data) == "object");

    if (context && ((typeof context) == "object")) {
      options = context;
      context = null;
    }
    context = context || "body";

    var fillOptions = {
      dataParams: {},
      async:true,
      dataCache: false,
      keyFormat: "aBc",
      selectPattern: "[name='?']",
      formatterCommon: null,
      formatterOnKeys: null,
      resetElDefault: true,
      resetElDefaultInContext: true,
      keysMap: {}
    };
    $.extend(fillOptions, options);

    if (!ready2Fill) { //make Ajax call to load remote data and apply....

      /*wait till this data loads*/
      $.ajax({
        url: data,
        data: fillOptions.dataParams,
        cache: fillOptions.dataCache,
        async: fillOptions.async,
        dataType: "text",
        success: function (result) {
          data = spa.toJSON(result);
          ready2Fill = ((typeof data) == "object");
          _fillData();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          spa.console.error("Failed loading data from [" + data + "]. [" + textStatus + ":" + errorThrown + "]");
          spa.api.onReqError(jqXHR, textStatus, errorThrown);
        }
      });
    }

    function _fillData() {
      var keyFormat = fillOptions.keyFormat;

      keyFormat = (keyFormat.match(/^[a-z]/) != null) ? "aBc" : keyFormat;
      keyFormat = (keyFormat.match(/^[A-Z]/) != null) ? "AbC" : keyFormat;

      var dataKeys = spa.keysDotted(data);
      spa.console.group("fillData");
      spa.console.info(dataKeys);

      _.each(dataKeys, function (dataKeyPath) {
        spa.console.group(">>" + dataKeyPath);
        var dataKey = ""+(dataKeyPath.replace(/[\[\]]/g, "_") || "");
        var dataKeyForFormatterFnSpec = dataKeyPath.replace(/\[[0-9]+\]/g, "");
        var isArrayKey = (/\[[0-9]+\]/).test(dataKeyPath);

        switch (keyFormat) {
          case "_" :
            dataKey = spa.dotToX(dataKey, "_");
            dataKeyForFormatterFnSpec = spa.dotToX(dataKeyForFormatterFnSpec, "_");
            break;
          case "AbC":
            dataKey = spa.dotToTitleCase(dataKey);
            dataKeyForFormatterFnSpec = spa.dotToTitleCase(dataKeyForFormatterFnSpec);
            break;
          default:
            dataKey = spa.dotToCamelCase(dataKey);
            dataKeyForFormatterFnSpec = spa.dotToCamelCase(dataKeyForFormatterFnSpec);
            break;
        }

        var debugInfo = {
          "patternKey": dataKey + (isArrayKey ? (" || " + dataKeyForFormatterFnSpec) : ""),
          "formatterKey": dataKeyForFormatterFnSpec,
          "isArrayChild": isArrayKey
        };
        spa.trash.push(debugInfo);
        spa.console.info(debugInfo);
        spa.trash.empty();

        var elSelector = (fillOptions.selectPattern).replace(/\?/g, dataKey);
        if (fillOptions.keysMap[dataKey] || fillOptions.keysMap[dataKeyForFormatterFnSpec]) {
          fillOptions.keysMap[dataKey] = fillOptions.keysMap[dataKey] || {};
          fillOptions.keysMap[dataKeyForFormatterFnSpec] = fillOptions.keysMap[dataKeyForFormatterFnSpec] || {};
          fillOptions.keysMap[dataKey].pattern = fillOptions.keysMap[dataKey].pattern || fillOptions.keysMap[dataKeyForFormatterFnSpec].pattern;
          if (fillOptions.keysMap[dataKey].pattern) {
            elSelector = (fillOptions.keysMap[dataKey].pattern).replace(/\?/g, dataKey);
          }
          if (fillOptions.keysMap[dataKeyForFormatterFnSpec].formatter) {
            fillOptions.formatterOnKeys = fillOptions.formatterOnKeys || {};
            fillOptions.formatterOnKeys[dataKeyForFormatterFnSpec] = fillOptions.keysMap[dataKeyForFormatterFnSpec].formatter;
          }
        }
        var elCountInContext = $(context).find(elSelector).length;
        spa.console.info(">> " + elSelector + " found: " + elCountInContext);
        var dataValue = null;
        if (elCountInContext > 0) {
          dataValue = spa.find(data, dataKeyPath);
          if ((!fillOptions.formatterOnKeys) && (fillOptions.formatterCommon)) {
            dataValue = fillOptions.formatterCommon(dataValue, dataKeyPath, data);
          }
          if (fillOptions.formatterOnKeys) {
            if (fillOptions.formatterOnKeys[dataKeyForFormatterFnSpec]) {
              dataValue = fillOptions.formatterOnKeys[dataKeyForFormatterFnSpec](dataValue, dataKeyPath, data);
            } else if (fillOptions.formatterCommon) {
              dataValue = fillOptions.formatterCommon(dataValue, dataKeyPath, data);
            }
          }
          spa.console.info({value: dataValue});
        }
        $(context).find(elSelector).each(function (index, el) {
          spa.console.info(el);
          switch ((el.tagName).toUpperCase()) {
            case "INPUT":
              switch ((el.type).toLowerCase()) {
                case "text":
                case "password":
                case "hidden":
                case "color":
                case "date":
                case "datetime":
                case "datetime-local":
                case "email":
                case "month":
                case "number":
                case "search":
                case "tel":
                case "time":
                case "url":
                case "range":
                case "button":
                case "submit":
                case "reset":
                  $(el).val(dataValue);
                  if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultValue = el.value;
                  break;

                case "checkbox":
                case "radio":
                  el.checked = (el.value).equalsIgnoreCase(dataValue);
                  if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultChecked = el.checked;
                  break;
              }
              break;

            case "SELECT":
              spa.selectOptionForValue(el, dataValue);
              if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultValue = el.value;
              break;

            case "TEXTAREA":
              $(el).val(dataValue);
              if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultValue = el.value;
              break;

            default:
              $(el).html(dataValue);
              break;
          }
        });

        spa.console.groupEnd(">>" + dataKeyPath);
      });

      spa.console.groupEnd("fillData");
      if (fillOptions.resetElDefaultInContext) spa.resetElementsDefaultValue(context + " :input");
    }
  };

  spa.toRenderDataStructure = function(saoDataUrl, soParams, hashParams) {
    var retObj = {}
      , dataCollection = {}
      , itemUrl = {}
      , oParams = {}
      , replaceKeysWithValues = function (srcStr, oKeyValue) {
          if (oKeyValue && Object.keys(oKeyValue).length) {
            _.each(Object.keys(oKeyValue), function(key){
              srcStr = srcStr.replace(new RegExp("{" + key + "}", "gi"), oKeyValue[key]);
            });
          }
          return srcStr;
        };

    if (soParams){
      oParams = (_.isString(soParams))? spa.queryStringToJson(soParams) : ((_.isObject(soParams))? soParams : {});
    }
    switch(true) {
      case (_.isString(saoDataUrl)) :
        /* 'path/to/data/api' => {dataUrl:'path/to/data/api'}
           'target.data.key|path/to/data/api' => {dataUrl:'path/to/data/api', dataModel:'target.data.key'}
        */
        if (saoDataUrl.containsStr("\\|")) {
          retObj['dataModel'] = spa.getOnSplit(saoDataUrl, "|", 0);
          saoDataUrl = spa.getOnLastSplit(1);
        }
        retObj['dataUrl'] = replaceKeysWithValues(saoDataUrl, hashParams);
        if (!_.isEmpty(oParams)) retObj['dataParams'] = oParams;
        break;
      case (_.isArray(saoDataUrl)) :
        /* ['path/to/json/data/api0', 'path/to/json/data/api1', 'path/to/json/data/api2'] =>
         ==> dataCollection : {
         urls: [
         {name:'data0', url:'path/to/json/data/api0'}
         , {name:'data1', url:'path/to/json/data/api1'}
         , {name:'data2', url:'path/to/json/data/api2'}
         ]
         }

         ['target.data.key0|path/to/json/data/api0', 'target.data.key1|path/to/json/data/api1', 'target.data.key2|path/to/json/data/api2'] =>
         ==> dataCollection : {
         urls: [
         {url:'path/to/json/data/api0', target:'target.data.key0', name:'key0'}
         , {url:'path/to/json/data/api1', target:'target.data.key1', name:'key1'}
         , {url:'path/to/json/data/api2', target:'target.data.key2', name:'key2'}
         ]
         }
         */
        dataCollection = {urls:[]};
        itemUrl = {};
        _.each(saoDataUrl, function(apiUrl){
          itemUrl = {url:replaceKeysWithValues(apiUrl, hashParams), params:oParams};
          if (apiUrl.containsStr("\\|")) {
            itemUrl['target'] = spa.getOnSplit(apiUrl, "|", 0);
            itemUrl['url'] = replaceKeysWithValues(spa.getOnLastSplit(1), hashParams);
          }
          dataCollection.urls.push(itemUrl);
        });
        break;
      case (_.isObject(saoDataUrl)) :
        /*
         {dataA:'path/to/json/data/api0', dataB:'path/to/json/data/api1', dataC:'path/to/json/data/api3' }

         ==> dataCollection : {
         urls: [
         {url:'path/to/json/data/api0', name:'dataA'}
         , {url:'path/to/json/data/api1', name:'dataB'}
         , {url:'path/to/json/data/api2', name:'dataC'}
         ]
         }

         {dataA:'target.data.key0|path/to/json/data/api0', dataB:'target.data.key1|path/to/json/data/api1', dataC:'target.data.key3|path/to/json/data/api3' }
         ==> dataCollection : {
         urls: [
         {url:'path/to/json/data/api0', target:'target.data.key0', name:'dataA'}
         , {url:'path/to/json/data/api1', target:'target.data.key1', name:'dataB'}
         , {url:'path/to/json/data/api2', target:'target.data.key2', name:'dataC'}
         ]
         }
         * */
        dataCollection = {urls:[]};
        itemUrl = {};
        _.each(_.keys(saoDataUrl), function(dName){
          itemUrl = {name:dName, url:replaceKeysWithValues(saoDataUrl[dName], hashParams), params:oParams};
          if (saoDataUrl[dName].containsStr("\\|")) {
            itemUrl['target'] = spa.getOnSplit(saoDataUrl[dName], "|", 0);
            itemUrl['url'] = replaceKeysWithValues(spa.getOnLastSplit(1), hashParams);
          }
          dataCollection.urls.push(itemUrl);
        });
        break;
    }
    if (!_.isEmpty(dataCollection.urls)) {
      retObj['dataCollection'] = dataCollection;
    }
    return retObj;
  };

  /* each spaRender's view and model will be stored in renderHistory */
  spa.compiledTemplates={};
  spa.viewModels = {};
  spa.renderHistory = {};
  spa.renderHistoryMax = 0;
  spa.components = {};
  spa.defaults = {
      dataTemplateEngine: "handlebars"
    , components: {
          rootPath: 'app/components/'
        , inFolder: true
        , templateExt: '.html'
        , scriptExt: '.js'
        , callback:''
      },
      set: function(oNewValues, newValue) {
        if (typeof oNewValues == 'object') {
          if (oNewValues.hasOwnProperty('set')) delete oNewValues['set'];
          _.merge(this, oNewValues);
        } else if (typeof oNewValues == 'string') {
          spa.setSimpleObjProperty(this, oNewValues, newValue);
        }
        return this;
      }
  };

  function adjustComponentOptions(componentName, options){
    var tmplId = '_rtt_'+componentName, tmplBody = '';
    if (options && _.isObject(options)  && spa.hasPrimaryKeys(options, 'template|templateStr|templateString|templateUrl') ) {
      if (options.hasOwnProperty('template')) {
        var givenTemplate = options['template'].trim();
        var isContainerId = (givenTemplate.beginsWithStr('#') && !givenTemplate.containsStr(' '));
        if (!isContainerId) {
          options['templateStr'] = options['template'];
        }
      }
      if (spa.hasPrimaryKeys(options, 'templateStr|templateString')) {
        tmplBody = options['templateStr'] || options['templateString'] || '';
        spa.updateTemplateScript(tmplId, tmplBody);
        options['template'] = '#'+tmplId;
      } else if (spa.hasPrimaryKeys(options, 'templateUrl')) {
        options['template'] = options['templateUrl'];
      }
    }
    return options;
  }

  spa.component = spa.$ = spa.registerComponent = function(componentName, options) {
    options = options || {};

    if (is(componentName, 'object')) {
      options = _.merge({}, componentName);
      componentName = options['name'] || options['componentName'] || (''+spa.now());
    }

    options['componentName'] = componentName;
    if (!options.hasOwnProperty('renderCallback')) {
      options['renderCallback'] = 'app.'+componentName+'.renderCallback';
    }
    if (options.hasOwnProperty('require')) {
      spa.loadComponents(options['require'], function(){
        spa.console.log('Required components successfully loaded.');
      }, function(){
        spa.console.log('Failed to load required components.');
      });
    }

    options = adjustComponentOptions(componentName, options);

    spa.components[componentName] = options;
    spa.extendComponent(componentName);
  };

  spa.extendComponent = spa.$extend = spa.module = function(componentName, options) {
    window['app'] = window['app'] || {};
    window.app[componentName] = window.app[componentName] || {};
    if (options && _.isFunction(options)) {
      options = options.call(spa.components[componentName] || {});
    }
    options = spa.is(options, 'object')? options : {};
    if (spa.components[componentName]) {
      if (options['__prop__']) {
        _.merge(spa.components[componentName], $.extend({},options['__prop__']));
      }
      options['__prop__'] = spa.components[componentName];
    }
    $.extend(window.app[componentName], options);
  };


  spa.renderComponent = spa.$render = function (componentName, options) {
    if (is(componentName, 'object')) {
      options = _.merge({}, componentName);
      componentName = options['name'] || options['componentName'] || (''+spa.now());
      options['componentName'] = componentName;
    }

    spa.console.info('Called renderComponent: '+componentName+' with below options');
    spa.console.info(options);

    var tmplId = '_rtt_'+componentName, tmplBody = '';

    options = adjustComponentOptions(componentName, options);

    var _cFilesPath  = spa.defaults.components.rootPath+ ((spa.defaults.components.inFolder)? componentName: '') +"/"+componentName
      , _cTmplFile   = _cFilesPath+spa.defaults.components.templateExt
      , _cScriptExt  = spa.defaults.components.scriptExt
      , _cScriptFile = (options && _.isObject(options) && options.hasOwnProperty('script'))? options['script'] : ((_cScriptExt)? (_cFilesPath+_cScriptExt) : '')
      , _renderComp  = function(){
          spa.console.info('_renderComp > '+componentName+' with below options');
          spa.console.info(options);
          if (!spa.components[componentName].hasOwnProperty('template')) {
            if (spa.components[componentName].hasOwnProperty('templateStr') || spa.components[componentName].hasOwnProperty('templateString')) {
              tmplBody = spa.components[componentName]['templateStr'] || spa.components[componentName]['templateString'] || '';
              spa.updateTemplateScript(tmplId, tmplBody);
              spa.components[componentName]['template'] = '#'+tmplId;
            } else  if (spa.hasPrimaryKeys(spa.components[componentName], 'templateUrl')) {
              spa.components[componentName]['template'] = spa.components[componentName]['templateUrl'];
            } else {
              spa.components[componentName]['template'] = _cTmplFile;
            }
          }
          spa.console.info('render-options: spa.components['+componentName+']');
          spa.console.info(spa.components[componentName]);
          var renderOptions = (options && options['saveOptions'])?  spa.components[componentName] : $.extend({}, spa.components[componentName]);
          if (options) {
            if (!options.hasOwnProperty('mountComponent')) {
              delete renderOptions['mountComponent'];
            }
            $.extend(renderOptions, options);
            spa.console.info('Extended> render-options: spa.components['+componentName+']');
            spa.console.info(renderOptions);
          }
          spa.render(renderOptions);
        }
      , _parseComp = function(){
          if (_cScriptFile) {
            spa.console.info('Loaded component ['+componentName+'] source from ['+_cScriptFile+']');
          } else {
            spa.console.info('Skipped Loading component ['+componentName+'] source from script file.');
          };
          spa.console.info('In Source> spa.components['+componentName+']');
          spa.console.info(spa.components[componentName]);
          if (!spa.components.hasOwnProperty(componentName)) {
            spa.console.warn('spa.components['+componentName+'] NOT DEFINED in ['+ (_cScriptFile || 'spa.components') +']. Defining *NEW*');
            if (!options.hasOwnProperty('componentName')) options['componentName'] = componentName;
            spa.components[componentName] = options;
            spa.console.info('NEW> spa.components['+componentName+']');
            spa.console.info(spa.components[componentName]);
          }
          _renderComp();
        };

    if (spa.components.hasOwnProperty(componentName)) {
      spa.console.info('Re-rending spa.components['+componentName+']');
      spa.console.info(spa.components[componentName]);
      _renderComp();
    } else {
      if (_cScriptFile) {
        spa.console.info('Loading component ['+componentName+'] source from ['+_cScriptFile+']');
        $.cachedScript(_cScriptFile, {success:_parseComp}).done(spa.noop)
          .fail(function(){
            spa.console.error('Failed Loading component ['+componentName+'] source from ['+_cScriptFile+']');
            spa.console.warn('Continue Loading component ['+componentName+'] without script source from ['+_cScriptFile+']');
            _parseComp();
          });
      } else {
        _parseComp();
      }
    }
  };

  spa.renderComponents = spa.$$render = function () {
    if (arguments.length){
      var compList = arguments; //spa.renderComponents('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_.isArray(arguments[0])) { //spa.renderComponents(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else { //spa.renderComponents('compName3');
          compList = [arguments[0]];
        };
      }

      if (compList && compList.length) {
        _.each(compList, function(compName){
          spa.console.info('Rendering spa-component:['+compName+']');
          spa.renderComponent(compName);
        });
      }
    }

  };

  spa.renderComponentsInHtml = function (scope, componentName, noDefer) {
    scope = scope||'body';

    var $spaCompList = $(scope).find('[data-spa-component'+(componentName?('='+componentName):(''))+']')
      , renderList = {}, deferRender = !noDefer;
    if ($spaCompList.length){
      $spaCompList.each(function( index, el ) {
        var $el = $(el), spaCompName, spaCompOptions, newElId, $elData = $el.data();
        spaCompName = $elData['spaComponent'];
        if (!el.id) {
          newElId = 'spaCompContainer_'+spaCompName+'_'
                      + ($('body').find('[rel=spaComponentContainer_'+spaCompName+']').length+1);
          el.id = newElId;
          el.setAttribute("rel", "spaComponentContainer_"+spaCompName);
        }
        spaCompOptions = _.merge( {target: "#"+el.id }, $elData, spa.toJSON($elData['spaComponentOptions'] || '{}'));

        if (deferRender) {
          if (!renderList.hasOwnProperty(spaCompName)) {
            $sameCompRenderList = $(scope).find('[data-spa-component='+spaCompName+']');
            spa.console.log("component: "+spaCompName+" to render : "+$sameCompRenderList.length);
            if ($sameCompRenderList.length>1) {
              spaCompOptions['mountComponent'] = {scope: scope, name: spaCompName};
            }
            renderList[spaCompName] = spa.renderComponent(spaCompName, spaCompOptions);
          }
        } else {
          spa.renderComponent(spaCompName, spaCompOptions);
        }

      });
    }
  };

  spa.renderUtils = {
    array2ObjWithKeyPrefix: function(arrayList, keyPrefix, targetId){
      var retObj = {};
      _.each(arrayList, function(item){
        item = (''+item).trimStr();
        if (item) {
          retObj[(keyPrefix + ((item.equals('.')? targetId : item).replace(/[^a-z0-9]/gi,'_')))] = (''+item);
        }
      });
      spa.console.log([keyPrefix, retObj]);
      return retObj;
    },
    getFn:function(fnName) {
      var _fn = fnName, _undefined;
      if (fnName) {
        if (_.isString(fnName)) {
          _fn = spa.findSafe(window, fnName);
        }
      }
      return (_fn && _.isFunction(_fn))? _fn : _undefined;
    },
    runCallbackFn: function (fn2Call, fnArg, thisContext) {
      if (fn2Call) {
        var _fn2Call = fn2Call;
        if (_.isString(_fn2Call)) {
          _fn2Call = spa.findSafe(window, _fn2Call);
        }
        if (_fn2Call) {
          if (_.isFunction(_fn2Call)) {
            spa.console.info("calling callback: " + fn2Call);
            _fn2Call.call(thisContext, fnArg);
          } else {
            spa.console.error("CallbackFunction <" + fn2Call + " = " + _fn2Call + "> is NOT a valid FUNCTION.");
          }
        } else {
          if (("" + fn2Call).beginsWithStr("spa") && (("" + fn2Call).endsWithStr("_renderCallback"))) {
            spa.console.warn("Default Route renderCallback function <" + fn2Call + "> is NOT defined.");
          } else {
            spa.console.error("CallbackFunction <" + fn2Call + "> is NOT defined.");
          }
        }
      }
    }
  };
  /*
   * spa.render("#containerID")
   *
   * OR
   *
   uOption = {
   data                      : {}    // Data(JSON Object) to be used in templates; for html data-attribute see dataUrl

   ,dataUrl                   : ""    // External Data(JSON) URL | local:dataModelVariableName
   ,dataUrlErrorHandle        : ""    // single javascript function name to run if external data url fails; NOTE: (jqXHR, textStatus, errorThrown) are injected to the function.
   ,dataParams                : {}    // dataUrl Params (NO EQUIVALENT data-attribute)
   ,dataModel                 : ""    // External Data(JSON) "key" for DataObject; default: "data"; may use name-space x.y.z (with the cost of performance)
   ,dataCache                 : false // External Data(JSON) Cache
   ,dataProcess               : function or Function name in String

   ,dataCollection            : {}    // { urls: [ {
   //              name   : 'string:dataApi'; if no (name or target) auto-keys: data0..dataN
   //            , url    : 'string:path-to-data-api'
   //            , params : object:pay-load
   //            , cache  : boolean:true|false; default:false
   //            , target : 'string:data-key-in-api-result-json'
   //            , success: 'string:functionName'
   //            , error  : 'string:functionName' } ... ]
   //
   //    , nameprefix: 'string: default:data' for xyz0, xyz1, xyz2
   //    , success:fn
   //    , error:fn
   // }

   ,dataTemplates             : {}    // Templates to be used for rendering {tmplID:'inline', tmplID:'script', tmplID:'URL'}
   ,dataTemplate              : ""    // Primary Template ID ==> content may be inline or <script>
                                      // dataTemplate = dataTemplates[0]; if dataTemplate is not defined

   ,dataTemplatesCache        : true  // cache of Templates

   ,dataScripts               : {}    // scripts (js) to be loaded along with templates
   ,dataScriptsCache          : true  // cache of dataScripts

   ,dataStyles                : {}    // styles (css) to be loaded along with templates
   ,dataStylesCache           : true  // cache of dataStyles

   ,dataRenderCallback        : ""    // single javascript function name to run after render
   ,dataRenderMode            : ""    // "":Replace target | "append" : Append to target | "prepend" : Prepend to target

   ,dataRenderId              : ""    // Render Id, may be used to locate in spa.renderHistory[dataRenderId], auto-generated key if not defined
   ,saveOptions               : false // Save options in render-container element
   };

   spa.render("#containerID", uOption);
   */
  spa.render = function (viewContainerId, uOptions) {

    if (!arguments.length) return;

    //render with single argument with target
    if ((arguments.length===1) && (typeof viewContainerId === "object")) {
      uOptions = _.merge({}, viewContainerId);
      if (uOptions.hasOwnProperty("target")) {
        viewContainerId = uOptions['target'];
        delete uOptions['target'];
      } else {
        viewContainerId = "dynRender_"+spa.now()+"_"+(spa.rand(1000, 9999));
      };
      spa.render(viewContainerId, uOptions);
      return;
    };

    //transfer NewKeys to OldKeys
    if (uOptions) {
      (function transOptions(opt){
        var keyMaps = {
                        template              : "dataTemplate"
                      , templates             : "dataTemplates"
                      , templateCache         : "dataTemplatesCache"
                      , templatesCache        : "dataTemplatesCache"
                      , html                  : "dataTemplate"
                      , htmls                 : "dataTemplates"
                      , htmlCache             : "dataTemplatesCache"
                      , htmlsCache            : "dataTemplatesCache"
                      , script                : "dataScripts"
                      , scripts               : "dataScripts"
                      , scriptCache           : "dataScriptsCache"
                      , scriptsCache          : "dataScriptsCache"
                      , style                 : "dataStyles"
                      , styles                : "dataStyles"
                      , styleCache            : "dataStylesCache"
                      , stylesCache           : "dataStylesCache"
                      , renderType            : "dataRenderType"
                      , dataRenderCallBack    : "dataRenderCallback"
                      , renderCallback        : "dataRenderCallback"
                      , renderCallBack        : "dataRenderCallback"
                      , callback              : "dataRenderCallback"
                      , callBack              : "dataRenderCallback"
                      , dataRenderMode        : "dataRenderMode"
                      , renderMode            : "dataRenderMode"
                      , renderId              : "dataRenderId"
                      };
        _.each(keyMaps, function(value, key) {
          if (opt.hasOwnProperty(key)) {
            opt[value] = uOptions[key];
            delete opt[key];
          };
        });
      })(uOptions);
    };

    var retValue = {id: "", view: {}, model: {}, cron: "", elDataAttr:{}, target:viewContainerId, iOptions:uOptions};
    var spaAjaxRequestsQue = [];
    var doDeepRender = false;
    var foundViewContainer = spa.isElementExist(viewContainerId);
    if (foundViewContainer){
      retValue.elDataAttr = $(viewContainerId).data();
    }

    var noOfArgs = arguments.length;
    var useOptions = (noOfArgs > 1);
    var useParamData = (useOptions && uOptions.hasOwnProperty('data'));
    var dataFound = true;
    var rCompName = (uOptions && uOptions['componentName'])? uOptions['componentName'] : '';

    var spaRVOptions = {
      data: {}
      , dataUrl: ""
      , dataUrlErrorHandle: ""
      , dataParams: {}
      , dataExtra:{}
      , dataDefaults:{}
      , dataModel: ""
      , dataProcess: ''
      , dataCache: false

      , dataCollection: {}

      , dataTemplates: {}
      , dataTemplate: ""
      , dataTemplatesCache: true

      , dataScripts: {}
      , dataScriptsCache: true

      , dataStyles: {}
      , dataStylesCache: true

      , dataRenderCallback: ""
      , dataRenderMode: ""

      , dataRenderId: ""
    };

    if (!foundViewContainer) {
      if (!spa.isElementExist("#spaRunTimeHtmlContainer")) {
        $("body").append("<div id='spaRunTimeHtmlContainer' style='display:none;'></div>");
      }
      $("#spaRunTimeHtmlContainer").append("<div id='" + viewContainerId.replace(/\#/gi, "") + "'></div>");
    }
    if (useOptions) { /* for each user option set/override internal spaRVOptions */
      /* store options in container data properties if saveOptions == true */
      var saveOptions = (uOptions.hasOwnProperty("saveOptions") && uOptions["saveOptions"]);
      for (var key in uOptions) {
        spaRVOptions[key] = uOptions[key];
        if (saveOptions && (!(key === "data" || key === "saveOptions"))) {
          $(viewContainerId).data((""+( ("" + (_.at(""+key,4)||"") ).toLowerCase() )+key.slice(5)), spa.toStr(uOptions[key]));
        }
      }
    }

    var $viewContainerId = $(viewContainerId);
    var _renderOptionInAttr = function(dataAttrKey) {
      return ("" + $viewContainerId.data(dataAttrKey)).replace(/undefined/, "");
    };
    var _renderOption = function(optionKey, dataAttrKey) {
      return (spa.isBlank(spaRVOptions[optionKey]))? _renderOptionInAttr(dataAttrKey) : spaRVOptions[optionKey];
    };

    /*Render Id*/
//    var spaRenderId = ("" + $(viewContainerId).data("renderId")).replace(/undefined/, "");
//    if (!spa.isBlank(spaRVOptions.dataRenderId)) {
//      spaRenderId = spaRVOptions.dataRenderId;
//    }
    var spaRenderId = _renderOption('dataRenderId', 'renderId');
    retValue.id = (spaRenderId.ifBlankStr(("spaRender" + (spa.now()) + (spa.rand(1000, 9999)))));

//    var targetRenderMode = ("" + $(viewContainerId).data("renderMode")).replace(/undefined/, "");
//    if (!spa.isBlank(spaRVOptions.dataRenderMode)) {
//      targetRenderMode = spaRVOptions.dataRenderMode;
//    }
    var targetRenderMode = _renderOption('dataRenderMode', 'renderMode');
    spa.console.log("Render Mode: <"+targetRenderMode+">");

    var spaTemplateType = "x-spa-template";
    var spaTemplateEngine = (spa.defaults.dataTemplateEngine || "handlebars");

    /* Load Scripts Begins */
    spa.console.group("spaLoadingViewScripts");
    if (!(useOptions && uOptions.hasOwnProperty('dataScriptsCache'))) /* NOT provided in Render Request */
    { /* Read from view container [data-scripts-cache='{true|false}'] */
      var scriptsCacheInTagData = _renderOptionInAttr('scriptsCache'); //("" + $(viewContainerId).data("scriptsCache")).replace(/undefined/, "");
      if (!spa.isBlank(scriptsCacheInTagData)) {
        spaRVOptions.dataScriptsCache = scriptsCacheInTagData.toBoolean();
        spa.console.info("Override [data-scripts-cache] with [data-scripts-cache] option in tag-attribute: " + spaRVOptions.dataScriptsCache);
      }
    }
    else {
      spa.console.info("Override [data-scripts-cache] with user option [dataScriptsCache]: " + spaRVOptions.dataScriptsCache);
    }

    var vScriptsList = _renderOptionInAttr('scripts'); //(""+ $(viewContainerId).data("scripts")).replace(/undefined/, "");
    if (vScriptsList && spa.isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
      vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'";
    }
    var vScripts = spa.toJSON(vScriptsList || "{}");

    /* Check the option to override */
    if ((!(_.isObject(spaRVOptions.dataScripts))) && (_.isString(spaRVOptions.dataScripts))) {
      vScriptsList = (spaRVOptions.dataScripts || "").trimStr();
      if (spa.isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
        vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'";
      };
      spaRVOptions.dataScripts = spa.toJSON(vScriptsList);
    }

    if (!$.isEmptyObject(spaRVOptions.dataScripts)) {
      vScripts = spaRVOptions.dataScripts;
    }
    if (_.isArray(vScripts)) {
      _.remove(vScripts,function(item){ return !item; });
    }
    spa.console.info(vScripts);
    if (vScripts && (!$.isEmptyObject(vScripts))) {
      if (_.isArray(vScripts)) {
        spa.console.info("Convert array of script(s) without scriptID to object with scriptID(s).");
        var newScriptsObj = spa.renderUtils.array2ObjWithKeyPrefix(vScripts, '__scripts_', viewContainerId);
//        var dynScriptIDForContainer;
//        _.each(vScripts, function(scriptUrl, sIndex){
//          spa.console.log(scriptUrl);
//          if (scriptUrl) {
//            dynScriptIDForContainer = "__scripts_" + ((''+scriptUrl).replace(/[^a-z0-9]/gi,'_'));
//            newScriptsObj[dynScriptIDForContainer] = (""+scriptUrl);
//          }
//        });
        spa.console.info("Scripts(s) with scriptID(s).");
        spa.console.log(newScriptsObj);
        vScripts = (_.isEmpty(newScriptsObj))? {} : newScriptsObj;
      }

      spa.console.info("External scripts to be loaded [cache:" + (spaRVOptions.dataScriptsCache) + "] along with view container [" + viewContainerId + "] => " + JSON.stringify(vScripts));
      var vScriptsNames = _.keys(vScripts);

      spa.console.group("kLoadingScripts");
      _.each(vScriptsNames, function (scriptId) {
        spaAjaxRequestsQue = spa.loadScript(scriptId, vScripts[scriptId], spaRVOptions.dataScriptsCache, spaAjaxRequestsQue);
      });
      spa.console.info("External Scripts Loading Status: " + JSON.stringify(spaAjaxRequestsQue));
      spa.console.groupEnd("kLoadingScripts");
    }
    else {
      spa.console.info("No scripts defined [data-scripts] in view container [" + viewContainerId + "] to load.");
    }
    spa.console.groupEnd("spaLoadingViewScripts");

    /* Load Scripts Ends */

    /*Wait till scripts are loaded before proceed*/
    $.when.apply($, spaAjaxRequestsQue)
      .then(function () {
        spa.console.info("External Scripts Loaded.");
      })
      .fail(function () {
        spa.console.error("External Scripts Loading Failed! Unexpected!? Check the Script Path/Network.");
      });

    /* Load Data */
    spa.console.group("spaDataModel");

    //var dataModelName = ("" + $(viewContainerId).data("model")).replace(/undefined/, ""), viewDataModelName;
    //if (!spa.isBlank(spaRVOptions.dataModel)) {
    //  dataModelName = spaRVOptions.dataModel;
    //}
    //var dataModelUrl = ("" + $(viewContainerId).data("url")).replace(/undefined/, ""); //from HTML
    //if (!spa.isBlank(spaRVOptions.dataUrl)) {
    //  dataModelUrl = spaRVOptions.dataUrl;
    //}
    var dataModelName = _renderOption('dataModel', 'model')
      , dataModelUrl  = _renderOption('dataUrl', 'url')
      , viewDataModelName
      , isLocalDataModel = (useParamData || (dataModelUrl.beginsWithStrIgnoreCase("local:")))
      , defaultDataModelName = (dataModelUrl.beginsWithStrIgnoreCase("local:")) ? dataModelUrl.replace(/local:/gi, "") : "data";
    dataModelName = dataModelName.ifBlankStr(defaultDataModelName);
    viewDataModelName = dataModelName.replace(/\./g, "_");

    var spaTemplateModelData = {};
    if (useParamData) {
      spaTemplateModelData[viewDataModelName] = spaRVOptions.data;
      spa.console.info("Loaded data model [" + dataModelName + "] from argument");
    }
    else {
      if (!(useOptions && uOptions.hasOwnProperty('dataCache'))) /* NOT provided in Render Request */
      { /* Read from view container [data-cache='{true|false}'] */
        var dataCacheInTagData = _renderOptionInAttr('cache');//("" + $(viewContainerId).data("cache")).replace(/undefined/, "");
        if (!spa.isBlank(dataCacheInTagData)) {
          spaRVOptions.dataCache = dataCacheInTagData.toBoolean();
          spa.console.info("Override [data-cache] with [data-cache] option in tag-attribute: " + spaRVOptions.dataCache);
        }
      }
      else {
        spa.console.info("Override [data-cache] with user option [dataCache]: " + spaRVOptions.dataCache);
      }
      if (spa.isBlank(dataModelUrl)) { /*dataFound = false;*/
        spaTemplateModelData[viewDataModelName] = {};

        //Check dataCollection
        var dataModelCollection = _renderOptionInAttr('collection');//("" + $(viewContainerId).data("collection")).replace(/undefined/, ""); //from HTML
        if (dataModelCollection) dataModelCollection = spa.toJSON(dataModelCollection); //convert to json if found
        if (!spa.isBlank(spaRVOptions.dataCollection)) //override with javascript
        { dataModelCollection = spaRVOptions.dataCollection;
        }
        if (_.isArray(dataModelCollection)) dataModelCollection = {urls: dataModelCollection};

        var dataModelUrls = dataModelCollection['urls'];

        if (spa.isBlank(dataModelUrls)) {
          spa.console.warn("Model Data [" + dataModelName + "] or [data-url] or [data-collection] NOT found! Check the arguments or html markup. Rendering with options.");
          spaTemplateModelData[viewDataModelName] = _.merge({}, spaRVOptions);
        }
        else { //Processing data-collection
          if (!_.isArray(dataModelUrls)) {
            spa.console.warn("Invalid [data-urls].Check the arguments or html markup. Rendering with empty data {}.");
          }
          else {
            spa.console.info("Processing data-URLs");
            var dataIndexApi = 0, defaultAutoDataNamePrefix = dataModelCollection['nameprefix'] || "data";
            _.each(dataModelUrls, function (dataApi) {
              var defaultApiDataModelName = (defaultAutoDataNamePrefix + dataIndexApi)
                , apiDataModelName = _.has(dataApi, 'name') ? (('' + dataApi.name).replace(/[^a-zA-Z0-9]/gi, '')) : (_.has(dataApi, 'target') ? ('' + dataApi.target) : defaultApiDataModelName)
                , apiDataUrl = _.has(dataApi, 'url') ? dataApi.url : (_.has(dataApi, 'path') ? dataApi.path : '');

              if (apiDataModelName.containsStr(".")) {
                apiDataModelName = _.last(apiDataModelName.split("."), 1);
              }
              apiDataModelName = apiDataModelName.ifBlankStr(defaultApiDataModelName);
              spa.console.info('processing data-api for: ' + apiDataModelName);
              spa.console.log(dataApi);

              if (apiDataUrl) {
                spaAjaxRequestsQue.push(
                  $.ajax({
                    url: apiDataUrl,
                    data: _.has(dataApi, 'params') ? dataApi.params : (_.has(dataApi, 'data') ? dataApi.data : {}),
                    cache: _.has(dataApi, 'cache') ? dataApi.cache : spaRVOptions.dataCache,
                    dataType: "text",
                    success: function (result) {
                      var targetApiData
                        , targetDataModelName = _.has(dataApi, 'target') ? ('' + dataApi.target) : ''
                        , oResult = spa.toJSON("" + result);

                      if (targetDataModelName.indexOf(".") > 0) {
                        targetApiData = spa.hasKey(oResult, targetDataModelName) ? spa.find(oResult, targetDataModelName) : oResult;
                      }
                      else {
                        try {
                          targetApiData = oResult.hasOwnProperty(targetDataModelName) ? oResult[targetDataModelName] : oResult;
                        } catch(e) {
                          spa.console.error("Error in Data Model ["+targetDataModelName+"] in URL ["+apiDataUrl+"].\n" + e.stack);
                        }
                      }
                      if (spaTemplateModelData[viewDataModelName][apiDataModelName]) {
                        spaTemplateModelData[viewDataModelName][apiDataModelName] = [spaTemplateModelData[viewDataModelName][apiDataModelName]];
                        spaTemplateModelData[viewDataModelName][apiDataModelName].push(targetApiData);
                      }
                      else {
                        spaTemplateModelData[viewDataModelName][apiDataModelName] = targetApiData;
                      }
                      spa.console.info("Loaded data model [" + apiDataModelName + "] from [" + apiDataUrl + "]");

                      //Call user defined function on api-data success
                      var fnApiDataSuccess = dataApi['success'] || dataApi['onsuccess'] || dataApi['onSuccess'];
                      if (!fnApiDataSuccess) {
                        fnApiDataSuccess = dataModelCollection['success'] || dataModelCollection['onsuccess'] || dataModelCollection['onSuccess']; //use common success
                      }
                      if (fnApiDataSuccess) {
                        if (_.isFunction(fnApiDataSuccess)) {
                          fnApiDataSuccess(oResult, dataApi);
                        }
                        else if (_.isString(fnApiDataSuccess)) {
                          eval("(" + fnApiDataSuccess + "(oResult, dataApi))");
                        }
                      }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      spa.console.warn("Error processing data-api [" + apiDataUrl + "]");
                      //Call user defined function on api-data URL Error
                      var fnOnApiDataUrlErrorHandle = dataApi['error'] || dataApi['onerror'] || dataApi['onError'];
                      if (!fnOnApiDataUrlErrorHandle) {
                        fnOnApiDataUrlErrorHandle = dataModelCollection['error'] || dataModelCollection['onerror'] || dataModelCollection['onError']; //use common error
                        if ((!fnOnApiDataUrlErrorHandle) && (!spa.isBlank(spaRVOptions.dataUrlErrorHandle))) {
                          fnOnApiDataUrlErrorHandle = spaRVOptions.dataUrlErrorHandle;
                        }
                      }
                      if (fnOnApiDataUrlErrorHandle) {
                        if (_.isFunction(fnOnApiDataUrlErrorHandle)) {
                          fnOnApiDataUrlErrorHandle(jqXHR, textStatus, errorThrown);
                        }
                        else if (_.isString(fnOnApiDataUrlErrorHandle)) {
                          eval("(" + fnOnApiDataUrlErrorHandle + "(jqXHR, textStatus, errorThrown))");
                        }
                      } else {
                        spa.api.onReqError(jqXHR, textStatus, errorThrown);
                      }
                    }
                  })
                );//End of Ajax Que push
              }
              else {
                spa.console.error("data-api-url not found. Please check the arguments or html markup. Skipped this data-api request");
              }
              dataIndexApi++;
            });
          }
        }
      }
      else {
        if (dataModelUrl.beginsWithStrIgnoreCase("local:")) { /*Local DataModel*/
          var localDataModelName = dataModelUrl.replace(/local:/gi, "");
          var localDataModelObj = {};
          if (typeof eval("(" + localDataModelName + ")") != "undefined") { /*localDataModelObj = eval("("+localDataModelName+")");*/
            eval("(localDataModelObj=" + localDataModelName + ")");
          }
          spa.console.info("Using LOCAL Data Model: " + localDataModelName);

          if ((!isLocalDataModel) && (dataModelName.indexOf(".") > 0)) {
            spaTemplateModelData[viewDataModelName] = spa.hasKey(localDataModelObj, dataModelName) ? spa.find(localDataModelObj, dataModelName) : localDataModelObj;
          } else {
            try {
              spaTemplateModelData[viewDataModelName] = localDataModelObj.hasOwnProperty(dataModelName) ? localDataModelObj[dataModelName] : localDataModelObj;
            } catch(e) {
              spa.console.error("Error in Data Model ["+dataModelName+"] in Local Object ["+localDataModelName+"].\n" + e.stack);
            }
          }

        }
        else { /*External Data Source*/
          spa.console.info("Request Data [" + dataModelName + "] [cache:" + (spaRVOptions.dataCache) + "] from URL =>" + dataModelUrl);
          spaAjaxRequestsQue.push(
            $.ajax({
              url: dataModelUrl,
              data: spaRVOptions.dataParams,
              cache: spaRVOptions.dataCache,
              dataType: "text",
              success: function (result) {
                var oResult = spa.toJSON(""+result);
                if (dataModelName.indexOf(".") > 0) {
                  spaTemplateModelData[viewDataModelName] = spa.hasKey(oResult, dataModelName) ? spa.find(oResult, dataModelName) : oResult;
                }
                else {
                  try{
                    if ((dataModelName == 'data') && !oResult.hasOwnProperty(dataModelName)) {
                      dataModelName = 'Data';
                      viewDataModelName = 'Data';
                    };
                    spaTemplateModelData[viewDataModelName] = oResult.hasOwnProperty(dataModelName) ? oResult[dataModelName] : oResult;
                  } catch(e) {
                    spa.console.error("Error in Data Model ["+dataModelName+"] in URL ["+dataModelUrl+"].\n" + e.stack);
                  }
                }
                spa.console.info("Loaded data model [" + dataModelName + "] from [" + dataModelUrl + "]");
              },
              error: function (jqXHR, textStatus, errorThrown) {
                //Call user defined function on Data URL Error
                //var fnOnDataUrlErrorHandle = ("" + $(viewContainerId).data("urlErrorHandle")).replace(/undefined/, "");
                //if (!spa.isBlank(spaRVOptions.dataUrlErrorHandle)) {
                //  fnOnDataUrlErrorHandle = "" + spaRVOptions.dataUrlErrorHandle;
                //}
                var fnOnDataUrlErrorHandle = _renderOption('dataUrlErrorHandle', 'urlErrorHandle');
                if (spa.isBlank(fnOnDataUrlErrorHandle)){
                  spa.api.onReqError(jqXHR, textStatus, errorThrown);
                } else {
                  eval("(" + fnOnDataUrlErrorHandle + "(jqXHR, textStatus, errorThrown))");
                }
              }
            })
          );
        }
      }
    }
    spa.console.info("End of Data Processing");
    spa.console.log({o: spaTemplateModelData});
    spa.console.groupEnd("spaDataModel");

    if (dataFound) { /* Load Templates */

      //var vTemplate2RenderInTag = ("" + $(viewContainerId).data("template")).replace(/undefined/, "") || ("" + $(viewContainerId).data("html")).replace(/undefined/, "");
      //var vTemplatesList = (""+ $(viewContainerId).data("templates")).replace(/undefined/, "") || (""+ $(viewContainerId).data("htmls")).replace(/undefined/, "");
      var vTemplate2RenderInTag = _renderOptionInAttr("template") || _renderOptionInAttr("html");
      var vTemplatesList = _renderOptionInAttr("templates") || _renderOptionInAttr("htmls");
      if (vTemplatesList && spa.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
        vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'";
      }
      var vTemplates = spa.toJSON(vTemplatesList || "{}");//eval("(" + vTemplatesList + ")");//
      /* Check the option to override */
      if ((!(_.isObject(spaRVOptions.dataTemplates))) && (_.isString(spaRVOptions.dataTemplates))) {
        vTemplatesList = (spaRVOptions.dataTemplates || "").trimStr();
        if (spa.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
          vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'";
        };
        spaRVOptions.dataTemplates = spa.toJSON(vTemplatesList);
      }
      if (!$.isEmptyObject(spaRVOptions.dataTemplates)) {
        vTemplates = spaRVOptions.dataTemplates;
        vTemplatesList = "" + (JSON.stringify(vTemplates));
      }
      if ((_.isEmpty(spa.toJSON((vTemplatesList||"").trimStr())))
        || (_.isArray(vTemplates) && vTemplates.length==1 && spa.isBlank(vTemplates[0]))) {
        vTemplates = {};
        vTemplatesList = "";
      }

      spa.console.info("Templates:");
      spa.console.info(vTemplates);
      //Handle if array without templateID, convert to object with auto templateID
      if (_.isArray(vTemplates) && !_.isEmpty(vTemplates)) {
        spa.console.info("Array of template(s) without templateID(s).");
        var newTemplatesObj = spa.renderUtils.array2ObjWithKeyPrefix(vTemplates, '__tmpl_', viewContainerId);
//        var dynTmplIDForContainer;
//        _.each(vTemplates, function(templateUrl, sIndex){
//          spa.console.log(templateUrl);
//          if (templateUrl) {
//            dynTmplIDForContainer = "__tmpl_" + ((''+templateUrl).replace(/[^a-z0-9]/gi,'_'));
//            newTemplatesObj[dynTmplIDForContainer] = (""+templateUrl);
//          }
//        });
        spa.console.info("Template(s) with template ID(s).");
        spa.console.log(newTemplatesObj);
        if (_.isEmpty(newTemplatesObj)) {
          vTemplates = {};
          vTemplatesList = "";
        } else {
          vTemplates = newTemplatesObj;
          vTemplatesList = "" + (JSON.stringify(vTemplates));
        }
      }

      /* if Template list not provided in data-templates;
       * 1: Check options
       * 2: if not in options check data-template
       * */
      if ((!vTemplates) || ($.isEmptyObject(vTemplates))) {
        vTemplates = {};
        var _dataTemplate = spaRVOptions.dataTemplate
          , _tmplKey = ""
          , _tmplLoc ="";
        if (spa.isBlank(_dataTemplate)) { //Not-in JS option
          if (!spa.isBlank(vTemplate2RenderInTag)) { //Found in tag
            spa.console.info("Template to load from location <"+vTemplate2RenderInTag+">");
            _dataTemplate = vTemplate2RenderInTag;
          }
        }

        _dataTemplate = (_dataTemplate || "").trimStr();
        spa.console.info("Primary Template: <"+_dataTemplate+">");
        if (spa.isBlank(_dataTemplate) || _dataTemplate.equalsIgnoreCase("inline") || _dataTemplate.equals(".")){
          spa.console.info("Using target container (inline) content as template.");
          _tmplKey = ("_tmplInline_" +(viewContainerId.trimStr("#")));
        } else if (_dataTemplate.beginsWithStr("#")) {
          spa.console.info("Using page container <"+_dataTemplate+"> content as template.");
          _tmplKey = _dataTemplate.trimStr("#");
        } else {
          spa.console.info("External path <"+_dataTemplate+"> content as template.");
          _tmplKey = "__tmpl_" + ((''+_dataTemplate).replace(/[^a-z0-9]/gi,'_'));
          _tmplLoc = _dataTemplate;
        }

        vTemplates[_tmplKey] = _tmplLoc.replace(/['\"]/g,'');
        spa.console.info(vTemplates);
      }

      spa.console.group("spaView");

      if (vTemplates && (!$.isEmptyObject(vTemplates))) {
        spa.console.info("Templates of [" + spaTemplateType + "] to be used in view container [" + viewContainerId + "] => " + JSON.stringify(vTemplates));
        var vTemplateNames = _.keys(vTemplates);

        spa.console.group("spaLoadingTemplates");

        /* Template Cache Begins: if false remove old templates */
        spa.console.group("spaLoadingTemplatesCache");
        if (!(useOptions && uOptions.hasOwnProperty('dataTemplatesCache'))) /* NOT provided in Render Request */
        { /* Read from view container [data-templates-cache='{true|false}'] */
          //var templatesCacheInTagData = ("" + $(viewContainerId).data("templatesCache")).replace(/undefined/, "") || ("" + $(viewContainerId).data("templateCache")).replace(/undefined/, "")  || ("" + $(viewContainerId).data("htmlsCache")).replace(/undefined/, "") || ("" + $(viewContainerId).data("htmlCache")).replace(/undefined/, "");
          var templatesCacheInTagData = _renderOptionInAttr("templatesCache") || _renderOptionInAttr("templateCache") || _renderOptionInAttr("htmlsCache") || _renderOptionInAttr("htmlCache");
          if (!spa.isBlank(templatesCacheInTagData)) {
            spaRVOptions.dataTemplatesCache = templatesCacheInTagData.toBoolean();
            spa.console.info("Override [data-templates-cache] with [data-templates-cache] option in tag-attribute: " + spaRVOptions.dataTemplatesCache);
          }
        }
        else {
          spa.console.info("Override [data-templates-cache] with user option [dataTemplatesCache]: " + spaRVOptions.dataTemplatesCache);
        }
        spa.console.groupEnd("spaLoadingTemplatesCache");

        spa.console.info("Load Templates");
        spa.console.info(vTemplates);
        _.each(vTemplateNames, function (tmplId, tmplIndex) {
          spa.console.info([tmplIndex, tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId]);
          spaAjaxRequestsQue = spa.loadTemplate(tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId, spaAjaxRequestsQue, !spaRVOptions.dataTemplatesCache);
        });

        var vTemplate2RenderID = "#"+(vTemplateNames[0].trimStr("#"));

        spa.console.info("External Data/Templates Loading Status: " + JSON.stringify(spaAjaxRequestsQue));
        spa.console.groupEnd("spaLoadingTemplates");

        spa.console.info("Render TemplateID: "+vTemplate2RenderID);

        /* Load Styles Begins */
        spa.console.group("spaLoadingViewStyles");
        if (!(useOptions && uOptions.hasOwnProperty('dataStylesCache'))) /* NOT provided in Render Request */
        { /* Read from view container [data-styles-cache='{true|false}'] */
          var stylesCacheInTagData = _renderOptionInAttr("stylesCache"); //("" + $(viewContainerId).data("stylesCache")).replace(/undefined/, "");
          if (!spa.isBlank(stylesCacheInTagData)) {
            spaRVOptions.dataStylesCache = stylesCacheInTagData.toBoolean();
            spa.console.info("Override [data-styles-cache] with [data-styles-cache] option in tag-attribute: " + spaRVOptions.dataStylesCache);
          }
        }
        else {
          spa.console.info("Override [data-styles-cache] with user option [dataStylesCache]: " + spaRVOptions.dataStylesCache);
        }

        var vStylesList = _renderOptionInAttr("styles"); //(""+ $(viewContainerId).data("styles")).replace(/undefined/, "");
        if (vStylesList && spa.isBlank((vStylesList || "").replace(/[^:'\"]/g,''))){
          vStylesList = "'"+ ((vStylesList).split(",").join("','")) + "'";
        }
        var vStyles = spa.toJSON(vStylesList || "{}");

        /* Check the option to override */
        if (!$.isEmptyObject(spaRVOptions.dataStyles)) {
          vStyles = spaRVOptions.dataStyles;
        }
        if (_.isArray(vStyles)) {
          _.remove(vStyles,function(item){ return !item; });
        }
        if (vStyles && (!$.isEmptyObject(vStyles))) {
          if (_.isArray(vStyles)) {
            spa.console.info("Convert array of style(s) without styleID to object with styleID(s).");
            var newStylesObj = spa.renderUtils.array2ObjWithKeyPrefix(vStyles, '__styles_', viewContainerId);
//            var dynStyleIDForContainer;
//            _.each(vStyles, function(styleUrl, sIndex){
//              spa.console.log(styleUrl);
//              if (styleUrl) {
//                dynStyleIDForContainer = "__styles_" + ((''+styleUrl).replace(/[^a-z0-9]/gi,'_'));
//                newStylesObj[dynStyleIDForContainer] = (""+styleUrl);
//              }
//            });
            spa.console.info("Style(s) with styleID(s).");
            spa.console.log(newStylesObj);
            vStyles = (_.isEmpty(newStylesObj))? {} : newStylesObj;
          }

          spa.console.info("External styles to be loaded [cache:" + (spaRVOptions.dataStylesCache) + "] along with view container [" + viewContainerId + "] => " + JSON.stringify(vStyles));
          var vStylesNames = _.keys(vStyles);

          spa.console.group("spaLoadingStyles");
          _.each(vStylesNames, function (styleId) {
            spaAjaxRequestsQue = spa.loadStyle(styleId, vStyles[styleId], spaRVOptions.dataStylesCache, spaAjaxRequestsQue);
          });
          spa.console.info("External Styles Loading Status: " + JSON.stringify(spaAjaxRequestsQue));
          spa.console.groupEnd("spaLoadingStyles");
        }
        else {
          spa.console.info("No styles defined [data-styles] in view container [" + viewContainerId + "] to load.");
        }
        spa.console.groupEnd("spaLoadingViewStyles");
        /* Load Styles Ends */

        $.when.apply($, spaAjaxRequestsQue)
          .then(function () {

            spa.console.group("spaRender[" + spaTemplateEngine + "] - spa.renderHistory[" + retValue.id + "]");
            spa.console.info("Rendering " + viewContainerId + " using master template: " + vTemplate2RenderID);
            if (spa.isBlank(targetRenderMode)) {
              $(viewContainerId).html("");
            }

            try {

              //dataProcess
              var fnDataProcess = _renderOption('dataProcess', 'process');
              if (fnDataProcess && (_.isString(fnDataProcess))) {
                fnDataProcess = spa.findSafe(window, fnDataProcess);
              }
              retValue['modelOriginal'] = $.extend({}, spaTemplateModelData[viewDataModelName]);
              retValue['model'] = spaTemplateModelData[viewDataModelName];
              if (fnDataProcess && _.isFunction(fnDataProcess)) {
                retValue['model'] = fnDataProcess.call($.extend({}, (app[rCompName] || {})), spaTemplateModelData[viewDataModelName], spaRVOptions);
                if (!_.isObject(retValue['model'])) {
                  retValue['model'] = retValue['modelOriginal'];
                }
              }
              retValue['model']['_global_'] = window || {};
              if (rCompName) {
                retValue['model']['_this']  = _.merge({}, spa.findSafe(window, 'app.'+rCompName, {}));
                retValue['model']['_this_'] = _.merge({}, (spa.components[rCompName] || {}), uOptions);
              };

              var spaViewModel = retValue.model, compiledTemplate;
              //spa.viewModels[retValue.id] = retValue.model;

              var templateContentToBindAndRender = ($(vTemplate2RenderID).html() || "").replace(/_SCRIPTTAGINTEMPLATE_/g, "script").replace(/_LINKTAGINTEMPLATE_/g,"link");

              /* {$}                  ==> app.thisComponentName.
               * {$someComponentName} ==> app.someComponentName.
               */
              var componentRefs = templateContentToBindAndRender.match(/({\s*\$(.*?)\s*})/g);
              if (componentRefs) {
                _.forEach(componentRefs, function(cRef){
                  templateContentToBindAndRender = templateContentToBindAndRender.replace((new RegExp(cRef.replace(/\$/, '\\$'), 'g')),
                    cRef.replace(/{\s*\$this|{\s*\$/g, 'app.').replace(/}/, '.').replace(/\s/g, '').replace(/\.\./, '.'+(rCompName||'')+'.'));
                });
              }

              compiledTemplate = templateContentToBindAndRender;
              spa.console.log("Template Source:", templateContentToBindAndRender);
              if (!spa.isBlank(spaViewModel)) {
                if ((typeof Handlebars != "undefined") && Handlebars) {
                  var preCompiledTemplate = spa.compiledTemplates[vTemplate2RenderID] || (Handlebars.compile(templateContentToBindAndRender));
                  if (!spa.compiledTemplates.hasOwnProperty(vTemplate2RenderID)) spa.compiledTemplates[vTemplate2RenderID] = preCompiledTemplate;
                  compiledTemplate = preCompiledTemplate(_.merge({}, retValue, spaRVOptions.dataDefaults, spaRVOptions.dataExtra, spaRVOptions.dataParams, spaViewModel));
                } else {
                  spa.console.error("handlebars.js is not loaded.");
                }
              }
              spa.console.log("Template Compiled:", compiledTemplate);

              doDeepRender = false;
              retValue.view = compiledTemplate.replace(/\_\{/g,'{{').replace(/\}\_/g, '}}');

              /*var targetRenderContainerType = ((""+ $(viewContainerId).data("renderType")).replace(/undefined/, "")).toLowerCase();
                if (!spa.isBlank(spaRVOptions.dataRenderType)) {
                  targetRenderContainerType = spaRVOptions.dataRenderType;
                };*/
              var targetRenderContainerType = _renderOption('dataRenderType', 'renderType');

              switch(targetRenderContainerType) {
                case "value" :
                  $(viewContainerId).val(retValue.view);
                  break;
                case "text" :
                  $(viewContainerId).text(retValue.view);
                  break;

                default:
                  doDeepRender = true;
                  if (spa.isBlank(targetRenderMode)) {
                    $(viewContainerId).html(retValue.view);
                  } else {
                    switch (true) {
                      case (targetRenderMode.equalsIgnoreCase("append")):
                        $(viewContainerId).append(retValue.view);
                        break;
                      case (targetRenderMode.equalsIgnoreCase("prepend")):
                        $(viewContainerId).prepend(retValue.view);
                        break;
                      default: $(viewContainerId).html(retValue.view); break;
                    }
                  }
                  break;
              };

              spa.console.info("Render: SUCCESS");
              var rhKeys = _.keys(spa.renderHistory);
              var rhLen = rhKeys.length;
              if (rhLen > spa.renderHistoryMax) {
                $.each(rhKeys.splice(0, rhLen - (spa.renderHistoryMax)), function (index, key) {
                  delete spa.renderHistory[key];
                });
              }
              retValue.cron = "" + spa.now();
              if (spa.renderHistoryMax>0) {
                spa.renderHistory[retValue.id] = retValue;
              };

              if (doDeepRender) {
                /*Reflow Foundation*/
                spa.reflowFoundation(viewContainerId);

                /*init KeyTracking*/
                spa.initKeyTracking();

                /*apply i18n*/
                spa.i18n.apply(viewContainerId);

                /*apply data-validation*/
                if (spa.hasOwnProperty('initDataValidation')) {
                  $(viewContainerId).find('[data-validate-scope]').each(function (i, el){
                    spa.initDataValidation('#'+ ($(el).data('validateScope').replace(/#/g,'') || el.id));
                  });
                }

                /*init spaRoute*/
                spa.initRoutes(viewContainerId);
              };

              spa.console.log(retValue);

              /*run callback if any*/
              /*
               * Default component's callback
               */

              var renderCallbackContext = rCompName? _.merge({}, (app[rCompName] || {}), { __prop__: _.merge({}, (uOptions||{}) ) }) : {};
              if (renderCallbackContext['__prop__'] && renderCallbackContext['__prop__']['data']) {
                delete renderCallbackContext['__prop__']['data']['_global_'];
                delete renderCallbackContext['__prop__']['data']['_this_'];
                delete renderCallbackContext['__prop__']['data']['_this'];
              }
              if (retValue['model']) {
                delete retValue['model']['_global_'];
                delete retValue['model']['_this_'];
                delete retValue['model']['_this'];
              }

              spa.renderUtils.runCallbackFn(spa.defaults.components.callback, retValue, renderCallbackContext);

              var _fnCallbackAfterRender = _renderOptionInAttr("renderCallback"); //("" + $(viewContainerId).data("renderCallback")).replace(/undefined/, "");
              if (spaRVOptions.dataRenderCallback) {
                _fnCallbackAfterRender = spaRVOptions.dataRenderCallback;
              }
              var isCallbackDisabled = (_.isString(_fnCallbackAfterRender) && _fnCallbackAfterRender.equalsIgnoreCase("off"));
              spa.console.info("Processing callback: " + _fnCallbackAfterRender);

              if (!isCallbackDisabled) {
                if (isSpaHashRouteOn && spa.routes && spa.routes.hasOwnProperty("_renderCallback") && _.isFunction(spa.routes['_renderCallback'])) {
                  spa.console.info("calling default callback: spa.routes._renderCallback");
                  spa.routes['_renderCallback'].call(undefined, retValue);
                }
                spa.renderUtils.runCallbackFn(_fnCallbackAfterRender, retValue, renderCallbackContext);
              }

              /*Deep/Child Render*/
              if (doDeepRender) {
                //$("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]", viewContainerId).spaRender();
                $(viewContainerId).find("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]").spaRender();

                if (spaRVOptions.hasOwnProperty('mountComponent')) {
                  spa.console.info('mounting defered component', spaRVOptions.mountComponent);
                  $(viewContainerId).removeAttr('data-spa-component');
                  spa.renderComponentsInHtml(spaRVOptions.mountComponent.scope, spaRVOptions.mountComponent.name, true);
                };

                spa.renderComponentsInHtml(viewContainerId);
              };
            }
            catch(e) {
              spa.console.error("Error Rendering.\n" + e.stack);
            }
            spa.console.groupEnd("spaRender[" + spaTemplateEngine + "] - spa.renderHistory[" + retValue.id + "]");
          })
          .fail(function () {
            spa.console.error("External Data/Templates/Styles/Scripts Loading failed! Unexpected!! Check the template Path / Network. Rendering aborted.");
          }).done(spa.runOnceOnRender);
      }
      else {
        spa.console.error("No templates defined [data-templates] in view container [" + viewContainerId + "] to render. Check HTML markup.");
      }
      spa.console.groupEnd("spaView");
    }
    return (retValue);
  };

  spa.hasAutoRoutes = function(routeHash, operator){
    var elSelector = "[data-sparoute-default]"+(routeHash? "[href"+(operator?operator:"")+"='"+routeHash+"']" : "");
    return ($(elSelector).length > 0);
  };
  spa.routeCurLocHashAttemptDelaySec = 3;
  spa.routeCurLocHashAttempt=0;
  spa.routeCurLocHash = function(){
    var curLocHash = (spa.getLocHash()||"").ifBlankStr(spa.routesOptions.defaultPageRoute);
    if (isSpaHashRouteOn && curLocHash && !spa.hasAutoRoutes(curLocHash)) {
      spa.console.info("Route current url-hash.");
      if (!spa.route(curLocHash)) {
        spa.console.warn("Current url-hash-route <"+curLocHash+"> FAILED and will try after "+spa.routeCurLocHashAttemptDelaySec+"sec.");
        if (spa.routeCurLocHashAttempt < 5) {
          spa.routeCurLocHashAttempt++;
          setTimeout(spa.routeCurLocHash, (spa.routeCurLocHashAttemptDelaySec*1000));
        } else {
          spa.console.error("5 attempts to route current url-hash failed. Aborting further attempts.");
        }
      }
    }
  };

  spa.finallyOnRender = [];
  spa.runOnceOnRenderFunctions = [spa.routeCurLocHash];
  spa.runOnceOnRender = function(){
    spa.console.info("Render Complete.");
    if ((spa.runOnceOnRenderFunctions && !_.isEmpty(spa.runOnceOnRenderFunctions)) || (spa.finallyOnRender && !_.isEmpty(spa.finallyOnRender)) ) {
      if (!spa.runOnceOnRenderFunctions) spa.runOnceOnRenderFunctions = [];
      if (!_.isArray(spa.runOnceOnRenderFunctions)) {
        spa.runOnceOnRenderFunctions = [spa.runOnceOnRenderFunctions];
      }
      if (_.isArray(spa.runOnceOnRenderFunctions)) {
        if (spa.finallyOnRender) {
          if (!_.isArray(spa.finallyOnRender)){ spa.finallyOnRender = [spa.finallyOnRender]; }
          spa.runOnceOnRenderFunctions = spa.runOnceOnRenderFunctions.concat(spa.finallyOnRender);
        }
        _.each(spa.runOnceOnRenderFunctions, function(fn){
          if (_.isFunction(fn)) fn();
        });
      }
      spa.finallyOnRender = spa.runOnceOnRenderFunctions = undefined;
    }
  };

  /* Internal wrapper for jQuery.spaRender */
  spa.setElIdIfNot = function(el) {
    var $el = $(el);
    if (spa.isBlank($el.attr("id"))) {
      $el.attr("id", ("_el_" + (spa.now()) + "_" + spa.rand(1000, 9999)));
    }
    return ($el.attr("id"));
  };
  function __renderView(obj, opt) {
    var retValue;
    var viewContainerId = spa.setElIdIfNot(obj);
    if ((opt) && (!$.isEmptyObject(opt))) {
      retValue = spa.render("#" + viewContainerId, opt);
    }
    else {
      retValue = spa.render("#" + viewContainerId);
    }
    return retValue;
  }

  spa.Foundation = {'autoReflow': false};
  spa.reflowFoundation = function(context) {
    if (("Foundation" in window) && (spa.Foundation.autoReflow)) $(context || document).foundation('reflow');
  };

  /* regex support on jQuery selector
   * http://james.padolsey.com/javascript/regex-selector-for-jquery/
   * */
  $.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
      validLabels = /^(data|css):/,
      attr = {
        method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
        property: matchParams.shift().replace(validLabels, '')
      },
      regexFlags = 'ig',
      regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test($(elem)[attr.method](attr.property));
  };


  /* Extend to jQuery as
   *
   * $("#viewContainer").spaRender({})
   *
   * OR
   *
   * $.spaRender("#viewContainer", {})
   *
   * */
  $.fn.extend({
    spaRender: function (opt) {
      this.each(function () {
        __renderView(this, opt);
      });
    }
  });
  $.extend({
    spaRender: function (obj, opt) {
      $(obj).spaRender(opt);
    }
  });

  spa.initDataValidation = function () {
    spa.console.log("include validate framework lib (spa-validate.js) to use this feature!");
  };
  spa.doDataValidation = function () {
    spa.console.log("include validate framework lib (spa-validate.js) to use this feature!");
  };

  spa.properties = {
    version: spa.VERSION
  };

  /* spaRoute
   * */
  spa.routes = {};
  spa.routesOptions = {
      useHashRoute: true
    , usePatterns:true
    , defaultPageRoute : ""
    , beforeRoute : ""
    , defaultTemplateExt : ".html"
    , defaultScriptExt : ".js"
    , loadDefaultScript:true
    , defaultRouteTargetContainerIdPrefix  : "routeContainer_"
    , defaultRouteTemplateContainerIdPrefix: "template_"
  };

  spa.routePatterns = {
    routes: []
    , register: undefined //Object of pattern and function eg. {name:"memberDetailsView", pattern:"#member/view?:memid", routeoptions:{}}
    , deregister: undefined //input [String | Array] of pattern
  };

  spa.routePatterns.register = function(rPatternOptions, overwrite) {
    //validate and Push {name:"xyz", pattern:"", routeoptions:{}}
    if (rPatternOptions && !_.isEmpty(rPatternOptions)) {
      var pushRoutePattern = function(rOptions, _overwrite) {
        if (_.has(rOptions, "pattern")){
          rOptions["pattern"] = rOptions["pattern"].replace(/\?/g, "\\?");

          if (!_.has(rOptions, "name")){
            rOptions['name'] = rOptions['pattern'].replace(/[^a-z0-9_]/gi, '');
          }
          if (!_.has(rOptions, "routeoptions")) {
            rOptions['routeoptions'] = {};
          }
          if (!_.find(spa.routePatterns.routes, {'pattern':rOptions['pattern']})){ //No Duplicate Pattern
            if (_.find(spa.routePatterns.routes, {'name':rOptions['name']})){ //If find duplicate name
              if (_overwrite) {
                spa.routePatterns.routes.push(rOptions);
              }
            } else {
              spa.routePatterns.routes.push(rOptions);
            }
          }
        }
      };

      if (_.isArray(rPatternOptions)){
        _.each(rPatternOptions, function(rOpt){
          pushRoutePattern(rOpt, overwrite);
        });
      } else if (_.isObject(rPatternOptions)) {
        pushRoutePattern(rPatternOptions, overwrite);
      } else {
        spa.console.error("Invalid RoutePattern Options. Provide Array/Object of RouteOptions");
      }
    } else {
      spa.console.error("Empty RoutePattern Options.");
    }
  };

  spa.routePatterns.deregister = function(rNamesOrPatterns){
    if (rNamesOrPatterns && !_.isEmpty(rNamesOrPatterns)) {
      var removeRoutePattern = function(rNameOrPattern){
        if (rNameOrPattern) {
          var indexOfNameOrPattern = _.findIndex(spa.routePatterns.routes, function(opt){
            return (opt.name == rNameOrPattern || opt.pattern == rNameOrPattern);
          });
          if (indexOfNameOrPattern>=0) {
            _.pullAt(spa.routePatterns.routes, indexOfNameOrPattern);
          } else {
            spa.console.error("Route Pattern Not Found for <"+rNameOrPattern+">");
          }
        }
      };

      if (_.isArray(rNamesOrPatterns)){
        _.each(rNamesOrPatterns, function(rNorP){
          removeRoutePattern(rNorP);
        });
      } else if (_.isString(rNamesOrPatterns)) {
        removeRoutePattern(rNamesOrPatterns);
      } else {
        spa.console.error("Invalid RoutePattern Name/Pattern. Provide Array/Name of RouteNames/Patterns");
      }
    }
  };

  spa.routeName = function(hashRoute){
    var _hashRoute = (hashRoute || spa.urlHash());
    if (_hashRoute.containsStr("\\?")) {
      _hashRoute = _hashRoute.split("?")[0];
    }
    return (_hashRoute.trimLeftStr("#")).replace(/[^a-z0-9]/gi,'_');
  };

  spa.routeContainerId = function(hashRoute){
    var routeTargetContainerPrefix = ((spa.routesOptions.defaultRouteTargetContainerIdPrefix).trimLeftStr("#"));
    return (routeTargetContainerPrefix+spa.routeName(hashRoute));
  };

  spa.routeTemplateId = function(hashRoute){
    var routeTargetContainerPrefix = ((spa.routesOptions.defaultRouteTemplateContainerIdPrefix).trimLeftStr("#"));
    return (routeTargetContainerPrefix+spa.routeName(hashRoute));
  };

  /*
    spa.routeRender = function(elRouteBase, routeOptions)
    elRouteBase  ==> valid jQuery element identifier
    routeOptions ==>
    { render                                    : false             //Optional; default: true; mention only to stop route
      target                                    : '#targetRenderID' //Optional; default: autoGeneratedHiddenContainer based on routePath
      template | templates                      : '' or []          //Optional; default: pathFrom Route with extension; use '.' to load default template
      [ext | tmplext | tmplExt]                 : '.jsp'            //Optional; default: '.html'; html template extension with dot(.)
      scripts                                   : '' or [] or false //Optional; default: same as templatePath with extension .js; use '.' to load default script
      [dataurl | dataUrl]                       : ''                //Optional; default: NO-DATA
      [after | callback | callBack]             : '' or function(){} or functionName //Optional: default: spa.routes.<ROUTE-PATH>_renderCallback
      [before | beforeroute | beforeRoute]      : '' or function(){} or functionName //Optional: default: spa.routesOptions.beforeRoute
    }
  */
  spa.routeRender = function(elRouteBase, routeOptions){
    var $elRouteBase = (elRouteBase)? $(elRouteBase) : undefined;

    var tagRouteOptions = ($elRouteBase)? ( (""+$elRouteBase.data("sparoute")) || "") : ("");
    if (   (tagRouteOptions.trimStr()).equalsIgnoreCase("false")
        || (tagRouteOptions.trimStr()).equalsIgnoreCase("no")
        || (tagRouteOptions.trimStr()).equalsIgnoreCase("off")
       ) tagRouteOptions = "quit:true";
    var oTagRouteOptions = (tagRouteOptions)? spa.toJSON(tagRouteOptions) : {};

    //Override with jsRouteOptions
    _.merge(oTagRouteOptions, routeOptions);

    if (oTagRouteOptions.hasOwnProperty("quit") && (oTagRouteOptions['quit'])) {
      return; //abort route
    }

    var routeNameWithPath = "#RouteNotDefinedInHREF";
    if ($elRouteBase) {
      routeNameWithPath = $elRouteBase.attr("href");
    } else if (routeOptions['urlhash']) {
      routeNameWithPath = routeOptions['urlhash']['url'];
    }
    routeNameWithPath = (routeNameWithPath).trimLeftStr("#");

    var routeParams = "";
    if (routeNameWithPath.containsStr("\\?")) {
      var _routeParts = routeNameWithPath.split("?");
      routeNameWithPath = _routeParts[0];
      routeParams = _routeParts[1];
    }
    var routeName = oTagRouteOptions['name'] || (spa.routeName(routeNameWithPath));

    routeNameWithPath += routeNameWithPath.endsWithStr("/")? "index" : "";

    if (spa.routes[routeName]) {
      spa.routes[routeName]($elRouteBase, routeParams, oTagRouteOptions);
    } else {
      spa.console.info("Route method <spa.routes."+routeName+"> NOT FOUND. Attempting to route using [data-sparoute] options.");

      var foundRouteTmplExt = (oTagRouteOptions.hasOwnProperty('ext')
      || oTagRouteOptions.hasOwnProperty('tmplext')
      || oTagRouteOptions.hasOwnProperty('tmplExt'));

      //foundRenderTarget = oTagRouteOptions['target'] && spa.isElementExist(oTagRouteOptions['target'])
      var renderTarget      = ""+((oTagRouteOptions['target']||"").trimStr())
        , tmplExt           = (foundRouteTmplExt)? (oTagRouteOptions['ext'] || oTagRouteOptions['tmplext'] || oTagRouteOptions['tmplExt']) : (spa.routesOptions["defaultTemplateExt"]||"")
        , defaultTmplPath   = (routeNameWithPath+tmplExt+"?"+routeParams).trimRightStr("\\?")
        , defaultScriptPath = routeNameWithPath+(spa.routesOptions["defaultScriptExt"]||".js")
        , defaultCallBeforeRoute = "spa.routes."+routeName+"_before"
        , defaultRenderCallback  = "spa.routes."+routeName+"_renderCallback"
        , useTargetOptions = spa.findIgnoreCase(oTagRouteOptions, "usetargetoptions")
        , spaRenderOptions = {
            dataRenderCallback : defaultRenderCallback
          , rElRouteOptions : oTagRouteOptions
          , rElDataAttr: ($elRouteBase)? $elRouteBase.data() : {}
        };

      //TODO: support for key 'html' instead of 'template'
      if (oTagRouteOptions.hasOwnProperty('template') && !oTagRouteOptions.hasOwnProperty('templates')) {
        oTagRouteOptions['templates'] = oTagRouteOptions['template'];
        delete oTagRouteOptions['template'];
      }

      if (renderTarget.equalsIgnoreCase(".")) {
        renderTarget = "#"+spa.setElIdIfNot($elRouteBase);
      } else if (spa.isBlank(renderTarget)) {
        renderTarget = ("#"+spa.routeContainerId(routeName));
      }
      var foundRenderTarget = spa.isElementExist(renderTarget);

      spa.console.info("Render Target <"+renderTarget+">");
      /*Cache Settings*/
      if (oTagRouteOptions.hasOwnProperty("dataCache")) {
        spaRenderOptions['dataCache'] = oTagRouteOptions['dataCache'];
      }
      if (oTagRouteOptions.hasOwnProperty("templatesCache") || oTagRouteOptions.hasOwnProperty("templateCache") || oTagRouteOptions.hasOwnProperty("htmlsCache") || oTagRouteOptions.hasOwnProperty("htmlCache")) {
        spaRenderOptions['dataTemplatesCache'] = oTagRouteOptions['templatesCache'] || oTagRouteOptions['templateCache'] || oTagRouteOptions['htmlsCache'] || oTagRouteOptions['htmlCache'];
      }
      if (oTagRouteOptions.hasOwnProperty("scriptsCache") || oTagRouteOptions.hasOwnProperty("scriptCache")) {
        spaRenderOptions['dataScriptsCache'] = oTagRouteOptions['scriptsCache'] || oTagRouteOptions['scriptCache'];
      }

      /*Templates*/
      //TODO: support for key 'htmls' instead of 'templates'
      spaRenderOptions['dataTemplates'] = {};
      var tmplID= "__spaRouteTemplate_" + routeName;
      if (!oTagRouteOptions.hasOwnProperty("templates") || (oTagRouteOptions['templates'])) {
        var oTagRouteOptionsTemplates = oTagRouteOptions['templates'];
        var rTemplateId = spa.routeTemplateId(routeName);
        var routeTemplateContainerID = "#"+rTemplateId;
        var hashTmplID = "__tmpl_"+rTemplateId;
        switch(true) {
          case (_.isString(oTagRouteOptionsTemplates)) :
            var targetTmplId = tmplID;
            var tmplPath = oTagRouteOptionsTemplates.trimStr();
            if ((tmplPath).equalsIgnoreCase('.')) {
              tmplPath = defaultTmplPath;
            } else if ((tmplPath).equalsIgnoreCase('#')) {
              targetTmplId = hashTmplID;
              tmplPath = routeTemplateContainerID;
            }
            spaRenderOptions.dataTemplates[targetTmplId] = tmplPath.ifBlankStr("none");
            break;
          case (_.isArray(oTagRouteOptionsTemplates)) :
            if (_.indexOf(oTagRouteOptionsTemplates, '.')>=0) { //Include default path-template (external)
              spaRenderOptions.dataTemplates[tmplID+"_dot"] = defaultTmplPath;
              _.pull(oTagRouteOptionsTemplates, '.');
            }
            if (_.indexOf(oTagRouteOptionsTemplates, '#')>=0) { //Include route hash-template (internal)
              spaRenderOptions.dataTemplates[hashTmplID] = routeTemplateContainerID;
              _.pull(oTagRouteOptionsTemplates, '#');
            }
            _.each(oTagRouteOptionsTemplates, function(templateUrl, sIndex){
              spaRenderOptions.dataTemplates[tmplID + '_'+(sIndex+1)] = templateUrl.ifBlankStr("none");
            });
            break;
          default:
            spaRenderOptions.dataTemplates[tmplID] = defaultTmplPath;
            break;
        }
      } else {
        spa.console.warn("Route without template");
        spaRenderOptions.dataTemplates[tmplID] = "none";
      }

      /*Scripts*/
      var useScripts = (!oTagRouteOptions.hasOwnProperty("scripts") || (oTagRouteOptions['scripts']));
      if (useScripts) {
        spaRenderOptions['dataScripts'] = {};
        var scriptID = "__spaRouteScript_" + routeName;
        switch(true) {
          case (_.isString(oTagRouteOptions['scripts'])) :
            spaRenderOptions.dataScripts[scriptID] = ((oTagRouteOptions['scripts']).equalsIgnoreCase('.'))? defaultScriptPath : oTagRouteOptions['scripts'];
            break;
          case (_.isArray(oTagRouteOptions['scripts'])) :
            if (_.indexOf(oTagRouteOptions['scripts'], '.')>=0) { //Include default script
              spaRenderOptions.dataScripts[scriptID] = defaultScriptPath;
              _.pull(oTagRouteOptions['scripts'], '.');
            }
            _.each(oTagRouteOptions['scripts'], function(scriptUrl, sIndex){
              spaRenderOptions.dataScripts[scriptID + '_'+(sIndex+1)] = scriptUrl;
            });
            break;
          default:
            if (spa.routesOptions.loadDefaultScript) {
              spaRenderOptions.dataScripts[scriptID] = defaultScriptPath;
            } else {
              spa.console.warn("Script(s) not included. Use <spa.routesOptions.loadDefaultScript = true> to load default script <"+defaultScriptPath+">.");
            }
            break;
        }
        spa.console.log(spaRenderOptions['dataScripts']);
      }

      /*Data and Params*/
      if (oTagRouteOptions['dataUrl'] || oTagRouteOptions['dataurl']) {
        var tagDataUrl = oTagRouteOptions['dataurl'] || oTagRouteOptions['dataUrl'];
        var spaRenderDataUrls = spa.toRenderDataStructure(tagDataUrl, routeParams, spa.findSafe(routeOptions, "urlhash.urlParams.params", {}) );
        if (!_.isEmpty(spaRenderDataUrls)) {
          _.merge(spaRenderOptions, spaRenderDataUrls);
        }
      }

      /*Callback*/
      var overrideDefaultCallback = (
      oTagRouteOptions.hasOwnProperty('after')
      || oTagRouteOptions.hasOwnProperty('callback')
      || oTagRouteOptions.hasOwnProperty('callBack'));
      if (overrideDefaultCallback || oTagRouteOptions['after'] || oTagRouteOptions['callback'] || oTagRouteOptions['callBack']) {
        spaRenderOptions['dataRenderCallback'] = oTagRouteOptions['after'] || oTagRouteOptions['callback'] || oTagRouteOptions['callBack'] || "";
      }

      //NO SCRIPTS
      if ( oTagRouteOptions.hasOwnProperty("scripts")
        && spa.isBlank(oTagRouteOptions["scripts"])
      ) {
        //NO CALLBACK or CALLBACK="."
        if (!overrideDefaultCallback) {
          spaRenderOptions['dataRenderCallback'] = "";
        } else if ( _.isString((spaRenderOptions['dataRenderCallback']))
                && (spaRenderOptions['dataRenderCallback']).equalsIgnoreCase(".")) {
          spaRenderOptions['dataRenderCallback'] = defaultRenderCallback;
        }
      }

      /*owerride Options with Target elements property if any*/
      if (useTargetOptions && foundRenderTarget){
        //Read spaRender options from target element and override(ie. delete) above options
        var $elTarget = $(renderTarget);
        if ($elTarget.data('url')) {
          delete spaRenderOptions['dataUrl'];
        }
        if ($elTarget.data('template') || $elTarget.data('templates')) {
          delete spaRenderOptions['dataTemplates'];
        }
        if ($elTarget.data('scripts')) {
          delete spaRenderOptions['dataScripts'];
        }
        if ($elTarget.data('renderCallback')) {
          delete spaRenderOptions['dataRenderCallback'];
        }
      }
      /*before Render function to modify options*/

      spa.console.info("Route Render Options Before preRenderProcess:");
      spa.console.info(spaRenderOptions);
      var beforeRenderOptions = {};
      var fnToRunBefore = oTagRouteOptions['before'] || oTagRouteOptions['beforeroute'] || oTagRouteOptions['beforeRoute'] || spa.routesOptions["beforeRoute"];
      spa.console.info("callBeforeRoute: "+fnToRunBefore);
      if (fnToRunBefore) {
        if (!_.isFunction(fnToRunBefore) && _.isString(fnToRunBefore)) {
          if (fnToRunBefore.equals(defaultCallBeforeRoute)) { //TODO: why?
            //cancel default route-before-function
            defaultCallBeforeRoute = undefined; //TODO: why?
          }
          fnToRunBefore = spa.findSafe(window, fnToRunBefore);
        }
        if (_.isFunction(fnToRunBefore)){
          beforeRenderOptions = fnToRunBefore.call(undefined, {el:$elRouteBase, target:renderTarget, renderOptions:spaRenderOptions, routeOptions:oTagRouteOptions});
          if (_.isObject(beforeRenderOptions)) _.merge(spaRenderOptions, beforeRenderOptions);
        } else {
          spa.console.error("CallBeforeRouteFunction <"+oTagRouteOptions['before']+"> NOT FOUND.");
        }
      }
      if (defaultCallBeforeRoute) {
        fnToRunBefore = spa.findSafe(window, defaultCallBeforeRoute);
        if (fnToRunBefore && _.isFunction(fnToRunBefore)) {
          beforeRenderOptions = fnToRunBefore.call(undefined, {el:$elRouteBase, target:renderTarget, renderOptions:spaRenderOptions, routeOptions:oTagRouteOptions});
          if (_.isObject(beforeRenderOptions)) _.merge(spaRenderOptions, beforeRenderOptions);
        }
      }

      spa.console.info("Route Render Options After preRenderProcess:");
      spa.console.info(spaRenderOptions);
      /*Ready to spaRender*/
      if ((!spaRenderOptions.hasOwnProperty("render") || (spaRenderOptions['render'])) &&
        (!oTagRouteOptions.hasOwnProperty("render") || (oTagRouteOptions['render']))) {
        spa.render(renderTarget, spaRenderOptions);
      }
    }//End of Route

    return true;
  };

  /*
    spa.route(el); //el = HTML element with href=#RoutePath?key=value&key=value
    spa.route(el, routeOptions); //el with Options
    spa.route("#RoutePath?key=value&key=value");
    spa.route("#RoutePath?key=value&key=value", routeOptions); //routePath with Options

    //routeOptions
    { render                                    : false             //Optional; default: true; mention only to stop route
      target                                    : '#targetRenderID' //Optional; default: autoGeneratedHiddenContainer based on routePath
      templates                                 : '' or []          //Optional; default: pathFrom Route with extension; use '.' to load default template
      [ext | tmplext | tmplExt]                 : '.jsp'            //Optional; default: '.html'; html template extension with dot(.)
      scripts                                   : '' or [] or false //Optional; default: same as templatePath with extension .js; use '.' to load default script
      [dataurl | dataUrl]                       : ''                //Optional; default: NO-DATA
      [after | callback | callBack]             : '' or function(){} or functionName //Optional: default: spa.routes.<ROUTE-PATH>_renderCallback
      [before | beforeroute | beforeRoute]      : '' or function(){} or functionName //Optional: default: spa.routesOptions.beforeRoute
    }
  */
  spa.route = function(elRouteBase, routeOptions){

    if (_.isString(elRouteBase) && spa.isBlank((""+elRouteBase).trimStr("#")) ) {
      return false; //BlankHash
    }

    var foundRouteElBase = !_.isString(elRouteBase);
    routeOptions = routeOptions || {};

    if (!foundRouteElBase) { //Find element with given route or create one with same route
      var elWithRoute = $("[data-sparoute][href='"+elRouteBase+"']");
      foundRouteElBase = !_.isEmpty(elWithRoute);
      if (!foundRouteElBase) {
        spa.console.warn("Route source element NOT FOUND for route <"+elRouteBase+">");
        if (spa.routesOptions.usePatterns) {
          spa.console.info("Searching RoutePattern.");
          var rPatternRouteOptions;
          var indexOfNameOrPattern = _.findIndex(spa.routePatterns.routes, function(opt){
            var matchFound=false;
            var _routeMatch = spa.routeMatch(opt.pattern, elRouteBase);
            if (_routeMatch) {
              matchFound = true;
              rPatternRouteOptions = _.merge({}, opt['routeoptions'] || {});
              rPatternRouteOptions['urlhash'] = {pattern:(opt.pattern).replace(/\\\?/g, '?') , url:elRouteBase, urlParams:_routeMatch};
            }
            return matchFound;
          });

          if (indexOfNameOrPattern<0) {
            spa.console.warn("Pattern not found.");
            spa.console.info(spa.routePatterns.routes);
          } else {
            spa.console.info(rPatternRouteOptions);
            spa.routeRender(undefined, rPatternRouteOptions);
          }
        } else {
          spa.console.warn("Pattern match Disabled.");
        }
      } else {
        elRouteBase = elWithRoute.get(0);
      }
    }

    if (!foundRouteElBase) {
      if (routeOptions['forceroute'] || routeOptions['forceRoute']) {
        spa.console.warn("Attempt dynamic route.");
        foundRouteElBase = true;
        elRouteBase = $("<a href='"+elRouteBase+"'></a>").get(0);
      } else {
        spa.console.warn("Exit Route.");
        return false; //exit;
      }
    }

    if (foundRouteElBase){
      return spa.routeRender(elRouteBase, routeOptions);
    }// if foundRouteElBase
  };

  spa.initRoutes = function(routeInitScope, routeInitOptions) {
    if (typeof routeInitScope == "object") {
      routeInitOptions = routeInitScope;
      routeInitScope = routeInitOptions["context"] || routeInitOptions["scope"] || "";
    }
    if (routeInitOptions) {
      spa.console.info("Init routesOptions");
      _.merge(spa.routesOptions, routeInitOptions);

      if (!isSpaHashRouteOn && spa.routesOptions.useHashRoute) spa._initWindowOnHashChange();
      if (isSpaHashRouteOn && !spa.routesOptions.useHashRoute) spa._stopWindowOnHashChange();

      //options without (context or scope)
      if (!(routeInitOptions.hasOwnProperty('context') || routeInitOptions.hasOwnProperty('scope'))) {
        return;
      }
    }

    spa.console.info("Init spaRoutes. Scan for [data-sparoute] in context: <"+(routeInitScope||"body")+">");
    $(routeInitScope||"body").find("[data-sparoute]").each(function(index, el){

      if (!spa.isBlank((($(el).attr("href") || "")+"#").split("#")[1])) {
        $(el).off("click");
        $(el).on("click", function() {
          if (isSpaHashRouteOn) {
            var elHash  = "#"+(((($(el).attr("href") || "")+"#").split("#")[1]).trimStr("#"));
            var winHash = spa.getLocHash();
            if (elHash.equals(winHash)){
              spa.route(this);
            }
          } else {
            spa.route(this);
          }
        });

        if (el.hasAttribute("data-sparoute-default")) {
          spa.route(el);
        }
      }
    });
  };

  //API Section begins
  spa.api = {
    urls:{},
    mock:false,
    forceParamValuesInMockUrls:false,
    urlKeyIndicator:'@',
    url: function(apiKey, urlReplaceKeyValues){
      apiKey = (apiKey||'').trimLeftStr(spa.api.urlKeyIndicator);
      urlReplaceKeyValues = urlReplaceKeyValues || {};

      var apiUrl = (spa.api.urls[apiKey] || apiKey)
        , isStaticUrl = apiUrl.beginsWithStr('!') || spa.api.mock
        , forceParamValuesInMockUrls = apiUrl.beginsWithStr('!!') || spa.api.forceParamValuesInMockUrls
        , paramsInUrl = _.uniq(apiUrl.extractStrBetweenIn('{', '}'))
        , pKey, pValue;

      if (!spa.isBlank(paramsInUrl)) {

        _.each(paramsInUrl, function(param){
          pKey = param.replace(/[{}<>]/g, '');
          if (pKey && urlReplaceKeyValues.hasOwnProperty(pKey)) {
            pValue = ((isStaticUrl && !forceParamValuesInMockUrls)? (param.containsStr('>')? urlReplaceKeyValues[pKey] : ('_'+pKey)) : urlReplaceKeyValues[pKey]);
            apiUrl = apiUrl.replace(new RegExp(param, 'g'), pValue);
          }
        });
      }
      return apiUrl;
    },
    isCallSuccess : function() {
      return true;
    },
    onReqError : function (jqXHR, textStatus, errorThrown) {
      //This function is to handles if Ajax request itself failed due to network error / server error
      //like 404 / 500 / timeout etc.
      spa.console.error([textStatus, errorThrown]);
      spa.console.error($(jqXHR.responseText).text());
    },
    onResError : function () {
      //This function is to handle when spa.api.isCallSuccess returns false
    },
    _call : function(ajaxOptions){
      /* set additional options dataType, error, success */
      ajaxOptions = $.extend(ajaxOptions, {
        dataType: 'text',
        error: spa.api.onReqError,
        success: function(axResponse, textStatus, jqXHR) {
          axResponse = _.isString(axResponse)? spa.toJSON(axResponse) : axResponse;
          if (spa.api['isCallSuccess'](axResponse)) {
            ajaxOptions._success(axResponse, textStatus, jqXHR);
          }
          else {
            spa.api.onResError(axResponse, textStatus, jqXHR);
          }
        }
      });

      if ((ajaxOptions.url).beginsWithStr(spa.api.urlKeyIndicator)){
        ajaxOptions.url = spa.api.url((ajaxOptions.url).trimLeftStr(spa.api.urlKeyIndicator), ajaxOptions.data);
      };

      spa.console.info('API(ajax) call with options', ajaxOptions);
      //console.info(['API(ajax) call with options', ajaxOptions]);
      return $.ajax(ajaxOptions);
    },
    _params2AxOptions : function(){
      var oKey, axOptions = {method:'GET', url:'', data:{}, _success:function(){}, async: true };
      _.each(arguments, function(arg){
        switch(true){ //NOTE: DON'T CHANGE THE ORDER
          case (_.isString(arg))  : oKey='url' ; break;
          case (_.isFunction(arg)): oKey='_success'; break;
          case (_.isBoolean(arg)) : oKey='async'; break;
          case (_.isObject(arg))  : oKey='data'; break;
          default: oKey = 'unknown'; break;
        }
        axOptions[oKey] = arg;
      });
      return (axOptions);
    },
    get : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call(spa.api._params2AxOptions.apply(undefined, arguments));
    },
    post : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'POST'}));
    },
    put : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'PUT'}));
    },
    del : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'DELETE'}));
    }

  };//End of spa.api{}
  //API Section Ends

  $(document).ready(function(){
    /*onLoad Set spa.debugger on|off using URL param*/
    spa.debug = spa.urlParam('spa.debug') || spa.hashParam('spa.debug') || spa.debug;

    /*Reflow Foundation*/
    spa.reflowFoundation();

    var sparouteInitOptions = $("body").data("sparouteInit");
    if (sparouteInitOptions) {
      spa.initRoutes(spa.toJSON(sparouteInitOptions));
    };

    /*Init spaRoutes*/
    spa.initRoutes("body");

    /*Key Tracking*/
    spa.initKeyTracking();

    /*Auto Render*/
    var $autoRenderElList = $("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]");
    var autoRenderCount = $autoRenderElList.length;
    spa.console.info("Find and Render [rel='spaRender'] or [data-render] or [data-sparender] or [data-spa-render]. Found:"+autoRenderCount);
    if (autoRenderCount) {
      $autoRenderElList.spaRender();
    } else {
      spa.console.info("Init SPA Render.");
      $("body").append("<div id='initSpaRender0' data-template-engine='none' data-render-type='text' data-render-callback='off'></div>");
      $("#initSpaRender0").spaRender();
    }
    spa.renderComponentsInHtml();
  });

})(this);

spa.console.info("spa loaded.");
