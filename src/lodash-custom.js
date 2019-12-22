/* ***** lodash custom begins ***** */
/* ToBe Replaced */
/** @license (MIT) lodash | https://github.com/lodash/lodash/blob/master/LICENSE */
(function(){
  if (window['_']) return;

  var __LD = {
    MAX_INTEGER      : 1.7976931348623157e+308,
    MAX_SAFE_INTEGER : 9007199254740991,
    INFINITY         : 1/0,
    reIsDeepProp     : /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp    : /^\w*$/,
    reLeadingDot     :  /^\./,
    rePropName       : /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    reEscapeChar     : /\\(\\)?/g,
    reIsUint         : /^(?:0|[1-9]\d*)$/,
    reFlags          : /\w*$/,

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

    CLONE_DEEP_FLAG    : 1,
    CLONE_FLAT_FLAG    : 2,
    CLONE_SYMBOLS_FLAG : 4,

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
        } catch(e){}
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
      return __LD.isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    },

    typedArrayTags : {},

    cloneableTags : {}
  };

  var _isBuffer             = __LD.nativeIsBuffer || __LD.stubFalse
    , _nativeObjectToString = __LD.objectProto.toString
    , _propertyIsEnumerable = __LD.objectProto.propertyIsEnumerable
    , _hasOwnProperty       = __LD.objectProto.hasOwnProperty
    , _allocUnsafe          = __LD.nativeIsBuffer ? Buffer.allocUnsafe : undefined
    , _funcToString         = __LD.funcProto.toString
    , _objectCtorString     = __LD.funcProto.toString.call(Object);

  __LD.typedArrayTags[__LD.float32Tag]      = __LD.typedArrayTags[__LD.float64Tag] =
  __LD.typedArrayTags[__LD.int8Tag]         = __LD.typedArrayTags[__LD.int16Tag]   =
  __LD.typedArrayTags[__LD.int32Tag]        = __LD.typedArrayTags[__LD.uint8Tag]   =
  __LD.typedArrayTags[__LD.uint8ClampedTag] = __LD.typedArrayTags[__LD.uint16Tag]  =
  __LD.typedArrayTags[__LD.uint32Tag]       = true;

  __LD.typedArrayTags[__LD.argsTag]         = __LD.typedArrayTags[__LD.arrayTag]  =
  __LD.typedArrayTags[__LD.arrayBufferTag]  = __LD.typedArrayTags[__LD.boolTag]   =
  __LD.typedArrayTags[__LD.dataViewTag]     = __LD.typedArrayTags[__LD.dateTag]   =
  __LD.typedArrayTags[__LD.errorTag]        = __LD.typedArrayTags[__LD.funcTag]   =
  __LD.typedArrayTags[__LD.mapTag]          = __LD.typedArrayTags[__LD.numberTag] =
  __LD.typedArrayTags[__LD.objectTag]       = __LD.typedArrayTags[__LD.regexpTag] =
  __LD.typedArrayTags[__LD.setTag]          = __LD.typedArrayTags[__LD.stringTag] =
  __LD.typedArrayTags[__LD.weakMapTag]      = false;

  __LD.cloneableTags[__LD.argsTag]          = __LD.cloneableTags[__LD.arrayTag] =
  __LD.cloneableTags[__LD.arrayBufferTag]   = __LD.cloneableTags[__LD.dataViewTag] =
  __LD.cloneableTags[__LD.boolTag]          = __LD.cloneableTags[__LD.dateTag] =
  __LD.cloneableTags[__LD.float32Tag]       = __LD.cloneableTags[__LD.float64Tag] =
  __LD.cloneableTags[__LD.int8Tag]          = __LD.cloneableTags[__LD.int16Tag] =
  __LD.cloneableTags[__LD.int32Tag]         = __LD.cloneableTags[__LD.mapTag] =
  __LD.cloneableTags[__LD.numberTag]        = __LD.cloneableTags[__LD.objectTag] =
  __LD.cloneableTags[__LD.regexpTag]        = __LD.cloneableTags[__LD.setTag] =
  __LD.cloneableTags[__LD.stringTag]        = __LD.cloneableTags[__LD.symbolTag] =
  __LD.cloneableTags[__LD.uint8Tag]         = __LD.cloneableTags[__LD.uint8ClampedTag] =
  __LD.cloneableTags[__LD.uint16Tag]        = __LD.cloneableTags[__LD.uint32Tag] = true;
  __LD.cloneableTags[__LD.errorTag]         = __LD.cloneableTags[__LD.funcTag] =
  __LD.cloneableTags[__LD.weakMapTag]       = false;

  __LD['baseSetToString'] = !__LD.defineProperty
    ? function(value){return value;}
    : function(func, string) {
        return __LD.defineProperty(func, 'toString', {
          'configurable': true,
          'enumerable': false,
          'value': __LD.constant(string),
          'writable': true
        });
      };

  __LD['shortOut'] = function _shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = Date.now(),
            remaining = __LD.HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= __LD.HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    };

  __LD['overRest'] = function _overRest(func, start, transform) {
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
        return __LD.apply(func, this, otherArgs);
      };
    };

  //Hash
  __LD['Hash'] = function _Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  __LD['Hash'].prototype.clear = function hashClear() {
    this.__data__ = __LD.nativeCreate ? __LD.nativeCreate(null) : {};
    this.size = 0;
  };
  __LD['Hash'].prototype['delete'] = function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  };
  __LD['Hash'].prototype.get = function hashGet(key) {
    var data = this.__data__;
    if (__LD.nativeCreate) {
      var result = data[key];
      return result === __LD.HASH_UNDEFINED ? undefined : result;
    }
    return _hasOwnProperty.call(data, key) ? data[key] : undefined;
  };
  __LD['Hash'].prototype.has = function hashHas(key) {
    var data = this.__data__;
    return __LD.nativeCreate ? (data[key] !== undefined) : _hasOwnProperty.call(data, key);
  };
  __LD['Hash'].prototype.set = function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (__LD.nativeCreate && value === undefined) ? __LD.HASH_UNDEFINED : value;
    return this;
  };

  //ListCache
  __LD['ListCache'] = function _ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  __LD['ListCache'].prototype.clear     = function _listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    };
  __LD['ListCache'].prototype['delete'] = function _listCacheDelete(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        __LD.splice.call(data, index, 1);
      }
      --this.size;
      return true;
    };
  __LD['ListCache'].prototype.get       = function _listCacheGet(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    };
  __LD['ListCache'].prototype.has       = function _listCacheHas(key) {
      return _assocIndexOf(this.__data__, key) > -1;
    };
  __LD['ListCache'].prototype.set       = function _listCacheSet(key, value) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    };

  //Stack
  __LD['Stack'] = function _Stack(entries) {
      var data = this.__data__ = new __LD.ListCache(entries);
      this.size = data.size;
    };
  __LD['Stack'].prototype.clear = function stackClear() {
    this.__data__ = new __LD.ListCache;
    this.size = 0;
  };
  __LD['Stack'].prototype['delete'] = function _stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  };
  __LD['Stack'].prototype.get = function _stackGet(key) {
    return this.__data__.get(key);
  };
  __LD['Stack'].prototype.has = function _stackHas(key) {
    return this.__data__.has(key);
  };
  __LD['Stack'].prototype.set = function _stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof __LD.ListCache) {
      var pairs = data.__data__;
      if (!__LD.Map || (pairs.length < __LD.LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new __LD.MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  };

  //MapCache
  __LD['MapCache'] = function _MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  __LD['MapCache'].prototype.clear = function _mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash'  : new __LD.Hash,
      'map'   : new (__LD.Map || __LD.ListCache),
      'string': new __LD.Hash
    };
  };
  __LD['MapCache'].prototype['delete'] = function _mapCacheDelete(key) {
    var result = __LD.getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  };
  __LD['MapCache'].prototype.get = function _mapCacheGet(key) {
    return __LD.getMapData(this, key).get(key);
  };
  __LD['MapCache'].prototype.has = function _mapCacheHas(key) {
    return __LD.getMapData(this, key).has(key);
  };
  __LD['MapCache'].prototype.set = function _mapCacheSet(key, value) {
    var data = __LD.getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  };

  //SetCache
  __LD['SetCache'] = function _SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;
    this.__data__ = new __LD.MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  };
  __LD['SetCache'].prototype.add = __LD['SetCache'].prototype.push = function _setCacheAdd(value) {
    this.__data__.set(value, __LD.HASH_UNDEFINED);
    return this;
  };
  __LD['SetCache'].prototype.has = function _setCacheHas(value) {
    return this.__data__.has(value);
  };

  __LD['createSet'] = !(__LD.Set && (1 / __LD.setToArray(new __LD.Set([,-0]))[1]) == __LD.INFINITY) ? function(){} : function(values) {
      return new __LD.Set(values);
    };

  __LD['getSymbols'] = !__LD.nativeGetSymbols ? __LD.stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(__LD.nativeGetSymbols(object), function(symbol) {
        return _propertyIsEnumerable.call(object, symbol);
      });
    };

  __LD['setToString'] = __LD.shortOut(__LD.baseSetToString);

  var _nativeKeys   = __LD.overArg(Object.keys, Object)
    , _getPrototype = __LD.overArg(Object.getPrototypeOf, Object);

  function baseGt(value, other) {
    return value > other;
  }
  function identity(value) {
    return value;
  }
  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;
    while (++index < length) {
      var value = array[index],
          current = iteratee(value);
      if (current != null && (computed === undefined
            ? (current === current && !_isSymbol(current))
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }      return result;
  }
  function _max(array) {
    return (array && array.length)
      ? baseExtremum(array, identity, baseGt)
      : undefined;
  }

  function _identity(value) {
    return value;
  }
  function _isIterateeCall(value, index, object) {
    if (!_isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (_isArrayLike(object) && _isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return _eq(object[index], value);
    }
    return false;
  }
  function _baseRest(func, start) {
    return __LD.setToString(__LD.overRest(func, start, _identity), func + '');
  }
  function createAssigner(assigner) {
    return _baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
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
  var _assignIn = createAssigner(function(object, source) {
    _copyObject(source, _keysIn(source), object);
  });

  function _baseUniq(array, iteratee, comparator) {
    var index = -1,
        includes = _arrayIncludes,
        length = array.length,
        isCommon = true,
        result = [],
        seen = result;

    if (comparator) {
      isCommon = false;
      includes = _arrayIncludesWith;
    }      else if (length >= __LD.LARGE_ARRAY_SIZE) {
      var set = iteratee ? null : __LD.createSet(array);
      if (set) {
        return __LD.setToArray(set);
      }
      isCommon = false;
      includes = _cacheHas;
      seen = new __LD.SetCache;
    }      else {
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
  function _isArrayLikeObject(value) {
    return _isObjectLike(value) && _isArrayLike(value);
  }
  function _baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = _isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          _baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          _arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }      return result;
  }
  var _union = _baseRest(function(arrays) {
    return _baseUniq(_baseFlatten(arrays, 1, _isArrayLikeObject, true));
  });

  var _getSymbolsIn = !__LD.nativeGetSymbols ? __LD.stubArray : function(object) {
    var result = [];
    while (object) {
      _arrayPush(result, __LD.getSymbols(object));
      object = _getPrototype(object);
    }      return result;
  };

  function _flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? _baseFlatten(array, 1) : [];
  }
  function _initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && _hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  function _baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return _isArray(object) ? result : _arrayPush(result, symbolsFunc(object));
  }
  function _getAllKeysIn(object) {
    return _baseGetAllKeys(object, _keysIn, _getSymbolsIn);
  }
  function _baseUnset(object, path) {
    path = _castPath(path, object);
    object = _parent(object, path);
    return object == null || delete object[_toKey(_last(path))];
  }
  function _castPath(value, object) {
    if (_isArray(value)) {
      return value;
    }
    return _isKey(value, object) ? [value] : _strToPath(_toString(value));
  }
  function _flatRest(func) {
    return __LD.setToString(__LD.overRest(func, undefined, _flatten), func + '');
  }
  function _isPlainObject(value) {
    if (!_isObjectLike(value) || _baseGetTag(value) != __LD.objectTag) {
      return false;
    }
    var proto = _getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = _hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      _funcToString.call(Ctor) == _objectCtorString;
  }
  function _customOmitClone(value) {
    return _isPlainObject(value) ? undefined : value;
  }
  function _copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  function _copyObject(source, props, object, customizer) {
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
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }      return object;
  }
  function _cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = _allocUnsafe ? _allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }
  function _initCloneObject(object) {
    return (typeof object.constructor == 'function' && !_isPrototype(object))
      ? __LD.baseCreate(_getPrototype(object))
      : {};
  }
  function _cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new __LD.Uint8Array(result).set(new __LD.Uint8Array(arrayBuffer));
    return result;
  }
  function _cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function _mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function _arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
  function _cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  function _cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, __LD.reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  function _addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }
  function _addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }
  function _cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(_mapToArray(map), __LD.CLONE_DEEP_FLAG) : _mapToArray(map);
    return _arrayReduce(array, _addMapEntry, new map.constructor);
  }
  function _cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(__LD.setToArray(set), __LD.CLONE_DEEP_FLAG) : __LD.setToArray(set);
    return _arrayReduce(array, _addSetEntry, new set.constructor);
  }
  function _cloneSymbol(symbol) {
    return __LD.symbolValueOf ? Object(__LD.symbolValueOf.call(symbol)) : {};
  }
  function _initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case __LD.numberTag:
      case __LD.stringTag:
        return new Ctor(object);

      case __LD.boolTag:
      case __LD.dateTag:
        return new Ctor(+object);

      case __LD.arrayBufferTag:
        return _cloneArrayBuffer(object);

      case __LD.float32Tag: case __LD.float64Tag:
      case __LD.int8Tag: case __LD.int16Tag: case __LD.int32Tag:
      case __LD.uint8Tag: case __LD.uint8ClampedTag: case __LD.uint16Tag: case __LD.uint32Tag:
        return _cloneTypedArray(object, isDeep);

      case __LD.mapTag:
        return _cloneMap(object, isDeep, cloneFunc);

      case __LD.dataViewTag:
        return _cloneDataView(object, isDeep);

      case __LD.regexpTag:
        return _cloneRegExp(object);

      case __LD.setTag:
        return _cloneSet(object, isDeep, cloneFunc);

      case __LD.symbolTag:
        return _cloneSymbol(object);
    }
  }
  function _assignValue(object, key, value) {
    var objValue = object[key];
    if (!(_hasOwnProperty.call(object, key) && _eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }    }
  function _keys(object) {
    return _isObject(object) ? _baseKeys(object) : (_isString(object)? _baseKeys(object.split('')) : []);
  }
  function _keysIn(object) {
    return _isArrayLike(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }
  function _getAllKeys(object) {
    return _baseGetAllKeys(object, keys, __LD.getSymbols);
  }
  function _copySymbols(source, object) {
    return _copyObject(source, __LD.getSymbols(source), object);
  }
  function _copySymbolsIn(source, object) {
    return _copyObject(source, _getSymbolsIn(source), object);
  }
  function _baseAssign(object, source) {
    return object && _copyObject(source, _keys(source), object);
  }
  function _baseAssignIn(object, source) {
    return object && _copyObject(source, _keysIn(source), object);
  }
  function _arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  function _baseClone(value, bitmask, customizer, key, object, stack) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!_isObject(value)) {
      return value;
    }
    var isArr = _isArray(value);
    if (isArr) {
      result = _initCloneArray(value);
      if (!isDeep) {
        return _copyArray(value, result);
      }
    } else {
      var tag = _getTag(value),
          isFunc = tag == __LD.funcTag || tag == __LD.genTag;

      if (_isBuffer(value)) {
        return _cloneBuffer(value, isDeep);
      }
      if (tag == __LD.objectTag || tag == __LD.argsTag || (isFunc && !object)) {
        result = (isFlat || isFunc) ? {} : _initCloneObject(value);
        if (!isDeep) {
          return isFlat
            ? _copySymbolsIn(value, _baseAssignIn(result, value))
            : _copySymbols(value, _baseAssign(result, value));
        }
      } else {
        if (!__LD.cloneableTags[tag]) {
          return object ? value : {};
        }
        result = _initCloneByTag(value, tag, _baseClone, isDeep);
      }
    }      // Check for circular references and return its corresponding clone.
    stack || (stack = new __LD.Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    var keysFunc = isFull
      ? (isFlat ? _getAllKeysIn : _getAllKeys)
      : (isFlat ? _keysIn : _keys);

    var props = isArr ? undefined : keysFunc(value);
    _arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      _assignValue(result, key, _baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }
  var _omit = _flatRest(function(object, paths) {
    var result = {};
    if (object == null) {
      return result;
    }
    var isDeep = false;
    paths = _arrayMap(paths, function(path) {
      path = _castPath(path, object);
      isDeep || (isDeep = path.length > 1);
      return path;
    });
    _copyObject(object, _getAllKeysIn(object), result);
    if (isDeep) {
      result = _baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, _customOmitClone);
    }
    var length = paths.length;
    while (length--) {
      _baseUnset(result, paths[length]);
    }
    return result;
  });

  function _isString(value) {
    return typeof value == 'string' || (!_isArray(value) && _isObjectLike(value) && _baseGetTag(value) == __LD.stringTag);
  }
  function _isObject(value) {
    var type = typeof value;
    return ((value != null) && (type == 'object' || type == 'function'));
  }
  function _isObjectLike(value) {
    return value != null && typeof value == 'object';
  }
  function _isFunction(value) {
    return ((value != null) && (typeof value == 'function'));
  }
  function _isArray(value) {
    return (Object.prototype.toString.call(value) === '[object Array]');
  }
  function _isBoolean(value) {
    return (value === true) || (value === false) || (_isObjectLike(value) && _baseGetTag(value) == __LD.boolTag);
  }
  function _isNumber(value) {
    return (typeof value == 'number') || (_isObjectLike(value) && _baseGetTag(value) == __LD.numberTag);
  }
  function _isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= __LD.MAX_SAFE_INTEGER;
  }
  function _isIndex(value, length) {
    length = length == null ? __LD.MAX_SAFE_INTEGER : length;
    return !!length &&
      (typeof value == 'number' || __LD.reIsUint.test(value)) &&
      (value > -1 && value % 1 == 0 && value < length);
  }
  function _isArrayLike(value) {
    return value != null && _isLength(value.length) && !_isFunction(value);
  }
  function _isEmpty(value) {
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
  function _isKey(value, object) {
    if (_isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null ) {
      return true;
    }
    return __LD.reIsPlainProp.test(value) || !__LD.reIsDeepProp.test(value) || (object != null && value in Object(object));
  }
  function _isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || __LD.objectProto;
    return value === proto;
  }
  function _isSymbol(value) {
    return typeof value == 'symbol' ||
      (_isObjectLike(value) && _getTag(value) == __LD.symbolTag);
  }
  function _isTypedArray(value) {
    return _isObjectLike(value) &&
      _isLength(value.length) && !!__LD.typedArrayTags[_getTag(value)];
  }
  function _isFlattenable(value) {
    return _isArray(value) || !!(__LD.spreadableSymbol && value && value[__LD.spreadableSymbol]);
  }
  function _objectToString(value) {
    return _nativeObjectToString.call(value);
  }
  function _isStrictComparable(value) {
    return value === value && !_isObject(value);
  }
  function _toPlainObject(value) {
    return _copyObject(value, _keysIn(value));
  }
  function _eq(value, other) {
    return value === other || (value !== value && other !== other);
  }
  function _assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (_eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function _baseIsNaN(value) {
    return value !== value;
  }
  function _toFinite(value) {
    var INFINITY = __LD.INFINITY, MAX_INTEGER = __LD.MAX_INTEGER;
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
  function _toKey(value) {
    if (typeof value == 'string') {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -(__LD.INFINITY)) ? '-0' : result;
  }
  function _baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (_isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, _baseToString) + '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -__LD.INFINITY) ? '-0' : result;
  }
  function _toString(value) {
    return value == null ? '' : _baseToString(value);
  }
  function _toInteger(value) {
    var result = _toFinite(value),
        remainder = result % 1;
    return result === result ? (remainder ? result - remainder : result) : 0;
  }
  function _arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  function _last(array) {
    var length = (array == null)? 0 : array.length;
    return length? array[length - 1] : undefined;
  }
  function _baseRange(start, end, step, fromRight) {
    var index = -1,
        length = Math.max(Math.ceil((end - start) / (step || 1)), 0),
        result = Array(length);

    while (length--) {
      result[fromRight ? length : ++index] = start;
      start += step;
    }
    return result;
  }
  function _range(start, end, step) {
    if (step && typeof step != 'number') {
      step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = _toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = _toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : _toFinite(step);
    return _baseRange(start, end, step, false);
  }
  function _strToPath(string) {
    var result = [];
    if (__LD.reLeadingDot.test(string)) {
      result.push('');
    }
    string.replace(__LD.rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(__LD.reEscapeChar, '$1') : (number || match));
    });
    return result;
  }
  function _hasPath(object, path, hasFunc) {
    path = _castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = _toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = (object == null) ? 0 : object.length;

    return !!length && _isLength(length) && _isArray(object);
  }
  function _baseHas(object, key) {
    return object != null && _hasOwnProperty.call(object, key);
  }
  function _has(object, path) {
    return object != null && _hasPath(object, path, _baseHas);
  }
  function _baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function _hasIn(object, path) {
    return object != null && _hasPath(object, path, _baseHasIn);
  }
  function _zipObject(props, values) {
    return _baseZipObject(props || [], values || [], _assignValue);
  }
  function _indexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : _toInteger(fromIndex);
    if (index < 0) {
      index = Math.max(length + index, 0);
    }
    return _baseIndexOf(array, value, index);
  }
  function _get(object, path, defaultValue) {
    var result = object == null ? undefined : _baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }
  function _findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : _toInteger(fromIndex);
    if (index < 0) {
      index = Math.max(length + index, 0);
    }
    return _baseFindIndex(array, _getIteratee(predicate, 3), index);
  }
  function _find(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!_isArrayLike(collection)) {
      var iteratee = _getIteratee(predicate, 3);
      collection = _keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }      var index = _findIndex(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  }
  function _property(path) {
    return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
  }
  function _remove(array, predicate) {
    var result = [];
    if (!(array && array.length)) {
      return result;
    }
    var index = -1,
        indexes = [],
        length = array.length;

    predicate = _getIteratee(predicate, 3);
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result.push(value);
        indexes.push(index);
      }
    }
    _basePullAt(array, indexes);
    return result;
  }
  function _pullAll(array, values) {
    return (array && array.length && values && values.length)
      ? _basePullAll(array, values)
      : array;
  }
  function _each(collection, iteratee) {
    var func = _isArray(collection) ? _arrayEach : _baseEach;
    return func(collection, _getIteratee(iteratee, 3));
  }
  function _every(collection, predicate, guard) {
    var func = _isArray(collection) ? _arrayEvery : _baseEvery;
    if (guard && _isIterateeCall(collection, predicate, guard)) {
      predicate = undefined;
    }
    return func(collection, _getIteratee(predicate, 3));
  }
  function _map(collection, iteratee) {
    var func = _isArray(collection) ? _arrayMap : _baseMap;
    return func(collection, _getIteratee(iteratee, 3));
  }
  function _some(collection, predicate, guard) {
    var func = _isArray(collection) ? _arraySome : _baseSome;
    if (guard && _isIterateeCall(collection, predicate, guard)) {
      predicate = undefined;
    }
    return func(collection, _getIteratee(predicate, 3));
  }
  function _uniq(array) {
    return (array && array.length) ? _baseUniq(array) : [];
  }
  function _filter(collection, predicate) {
    var func = _isArray(collection) ? _arrayFilter : _baseFilter;
    return func(collection, _getIteratee(predicate, 3));
  }
  function _matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }
  function _baseMatchesProperty(path, srcValue) {
    if (_isKey(path) && _isStrictComparable(srcValue)) {
      return _matchesStrictComparable(_toKey(path), srcValue);
    }
    return function(object) {
      var objValue = _get(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? _hasIn(object, path)
        : _baseIsEqual(srcValue, objValue, __LD.COMPARE_PARTIAL_FLAG | __LD.COMPARE_UNORDERED_FLAG);
    };
  }
  function _basePick(object, paths) {
    return _basePickBy(object, paths, function(value, path) {
      return _hasIn(object, path);
    });
  }
  function _basePickBy(object, paths, predicate) {
    var index = -1,
        length = paths.length,
        result = {};

    while (++index < length) {
      var path = paths[index],
          value = _baseGet(object, path);

      if (predicate(value, path)) {
        _baseSet(result, _castPath(path, object), value);
      }
    }      return result;
  }
  function _baseSet(object, path, value, customizer) {
    if (!_isObject(object)) {
      return object;
    }
    path = _castPath(path, object);

    var index     = -1,
        length    = path.length,
        lastIndex = length - 1,
        nested    = object;

    while (nested != null && ++index < length) {
      var key = _toKey(path[index]),
          newValue = value;

      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = _isObject(objValue)
            ? objValue
            : (_isIndex(path[index + 1]) ? [] : {});
        }
      }
      _assignValue(nested, key, newValue);
      nested = nested[key];
    }      return object;
  }
  function _baseIndexOf(array, value, fromIndex) {
    return value === value
      ? _strictIndexOf(array, value, fromIndex)
      : _baseFindIndex(array, _baseIsNaN, fromIndex);
  }
  function _baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  function _baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
  function _baseKeys(object) {
      if (!_isPrototype(object)) {
        return _nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (_hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }
  function _nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
  function _baseKeysIn(object) {
      if (!_isObject(object)) {
        return _nativeKeysIn(object);
      }
      var isProto = _isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !_hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
  function _arrayLikeKeys(value, inherited) {
      var isArr  = _isArray(value),
          isArg  = !isArr && _isArguments(value),
          isBuff = !isArr && !isArg && _isBuffer(value),
          isType = !isArr && !isArg && !isBuff && _isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? _baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || _hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               _isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }
  function _baseSlice(array, start, end) {
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
  function _baseGet(object, path) {
      path = _castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[_toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }
  function _parent(object, path) {
      return path.length < 2 ? object : _baseGet(object, _baseSlice(path, 0, -1));
    }
  function _baseGetTag(value) {
      if (value == null) {
        return value === undefined ? __LD.undefinedTag : __LD.nullTag;
      }
      return (__LD.symToStringTag && __LD.symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }
  function _getRawTag(value) {
      var isOwn = _hasOwnProperty.call(value, __LD.symToStringTag),
          tag = value[__LD.symToStringTag];

      try {
        value[__LD.symToStringTag] = undefined;
        var unmasked = true;
      } catch(e){}

      var result = _nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[__LD.symToStringTag] = tag;
        } else {
          delete value[__LD.symToStringTag];
        }
      }
      return result;
    }
  function _getTag(value) {
      if (value == null) {
        return value === undefined ? __LD.undefinedTag : __LD.nullTag;
      }
      return (__LD.symToStringTag && __LD.symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }
  function _baseAssignValue(object, key, value) {
      if (key == '__proto__' && __LD.defineProperty) {
        __LD.defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }
  function _baseZipObject(props, values, assignFunc) {
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
  function _baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : _get(object, paths[index]);
      }
      return result;
    }
  function _arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
  function _arrayEvery(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }
  function _arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
  function _arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
  function _arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && _baseIndexOf(array, value, 0) > -1;
    }
  function _arrayIncludesWith(array, value, comparator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
  function _arrayFilter(array, predicate) {
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
  function _equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & __LD.COMPARE_PARTIAL_FLAG,
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
          seen = (bitmask & __LD.COMPARE_UNORDERED_FLAG) ? new __LD.SetCache : undefined;

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
          if (!_arraySome(other, function(othValue, othIndex) {
                if (!_cacheHas(seen, othIndex) &&
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
  function _equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case __LD.dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case __LD.arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new __LD.Uint8Array(object), new __LD.Uint8Array(other))) {
            return false;
          }
          return true;

        case __LD.boolTag:
        case __LD.dateTag:
        case __LD.numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return _eq(+object, +other);

        case __LD.errorTag:
          return object.name == other.name && object.message == other.message;

        case __LD.regexpTag:
        case __LD.stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case __LD.mapTag:
          var convert = _mapToArray;

        case __LD.setTag:
          var isPartial = bitmask & __LD.COMPARE_PARTIAL_FLAG;
          convert || (convert = __LD.setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= __LD.COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case __LD.symbolTag:
          if (__LD.symbolValueOf) {
            return __LD.symbolValueOf.call(object) == __LD.symbolValueOf.call(other);
          }
      }
      return false;
    }
  function _equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & __LD.COMPARE_PARTIAL_FLAG,
          objProps  = _getAllKeys(object),
          objLength = objProps.length,
          othProps  = _getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : _hasOwnProperty.call(other, key))) {
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
  function _cacheHas(cache, key) {
      return cache.has(key);
    }
  function _compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined   = value !== undefined,
            valIsNull      = value === null,
            valIsReflexive = value === value,
            valIsSymbol    = _isSymbol(value);

        var othIsDefined   = other !== undefined,
            othIsNull      = other === null,
            othIsReflexive = other === other,
            othIsSymbol    = _isSymbol(other);

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
  function _compareMultiple(object, other, orders) {
      var index        = -1,
          objCriteria  = object.criteria,
          othCriteria  = other.criteria,
          length       = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = _compareAscending(objCriteria[index], othCriteria[index]);
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
  function _strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
  function _baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
  function _baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = _isArray(object),
          othIsArr = _isArray(other),
          objTag = objIsArr ? __LD.arrayTag : _getTag(object),
          othTag = othIsArr ? __LD.arrayTag : _getTag(other);

      objTag = objTag == __LD.argsTag ? __LD.objectTag : objTag;
      othTag = othTag == __LD.argsTag ? __LD.objectTag : othTag;

      var objIsObj = objTag == __LD.objectTag,
          othIsObj = othTag == __LD.objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && _isBuffer(object)) {
        if (!_isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new __LD.Stack);
        return (objIsArr || _isTypedArray(object))
          ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & __LD.COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && _hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && _hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new __LD.Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack); //equalFunc: is local param
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new __LD.Stack);
      return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
  function _baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!_isObjectLike(value) && !_isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return _baseIsEqualDeep(value, other, bitmask, customizer, _baseIsEqual, stack);
    }
  function _baseIsMatch(object, source, matchData, customizer) {
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
          var stack = new __LD.Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? _baseIsEqual(srcValue, objValue, __LD.COMPARE_PARTIAL_FLAG | __LD.COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }
  function _baseIsArguments(value) {
      return _isObjectLike(value) && _baseGetTag(value) == __LD.argsTag;
    }
  var _isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return _isObjectLike(value) && _hasOwnProperty.call(value, 'callee') &&
        !_propertyIsEnumerable.call(value, 'callee');
    };

  function _getMatchData(object) {
      var result = _keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, _isStrictComparable(value)];
      }
      return result;
    }
  function _baseMatches(source) {
      var matchData = _getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || _baseIsMatch(object, source, matchData);
      };
    }
  function _baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }
  function _basePropertyDeep(path) {
      return function(object) {
        return _baseGet(object, path);
      };
    }
  function _baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return _identity;
      }
      if (typeof value == 'object') {
        return _isArray(value)
          ? _baseMatchesProperty(value[0], value[1])
          : _baseMatches(value);
      }
      return _property(value);
    }
  function _getIteratee() {
      var result = _baseIteratee;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }
  function _basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (_isIndex(index)) {
            __LD.splice.call(array, index, 1);
          } else {
            _baseUnset(array, index);
          }
        }
      }
      return array;
    }
  function _baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
  function _baseFor(object, iteratee, keysFunc, fromRight) {
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
  function _baseForOwn(object, iteratee) {
      return object && _baseFor(object, iteratee, _keys);
    }
  function _createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!_isArrayLike(collection)) {
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
  var _baseEach = _createBaseEach(_baseForOwn);

  function _basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? _baseIndexOfWith : _baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = _copyArray(values);
      }
      if (iteratee) {
        seen = _arrayMap(array, _baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            __LD.splice.call(seen, fromIndex, 1);
          }
          __LD.splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }
  function _baseEvery(collection, predicate) {
      var result = true;
      _baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }
  function _baseMap(collection, iteratee) {
      var index = -1,
          result = _isArrayLike(collection) ? Array(collection.length) : [];

      _baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }
  function _baseSome(collection, predicate) {
      var result;

      _baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }
  function _baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
  function _baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = _arrayMap(iteratees.length ? iteratees : [_identity], _baseUnary(_getIteratee()));

      var result = _baseMap(collection, function(value) {
        var criteria = _arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return _baseSortBy(result, function(object, other) {
        return _compareMultiple(object, other, orders);
      });
    }
  function _baseFilter(collection, predicate) {
      var result = [];
      _baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }
  function _assignMergeValue(object, key, value) {
      if ((value !== undefined && !_eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        _baseAssignValue(object, key, value);
      }
    }
  function _baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked  = stack.get(srcValue);

      if (stacked) {
        _assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr   = _isArray(srcValue),
            isBuff  = !isArr && _isBuffer(srcValue),
            isTyped = !isArr && !isBuff && _isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (_isArray(objValue)) {
            newValue = objValue;
          }
          else if (_isArrayLikeObject(objValue)) {
            newValue = _copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = _cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = _cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (_isPlainObject(srcValue) || _isArguments(srcValue)) {
          newValue = objValue;
          if (_isArguments(objValue)) {
            newValue = _toPlainObject(objValue);
          }
          else if (!_isObject(objValue) || (srcIndex && _isFunction(objValue))) {
            newValue = _initCloneObject(srcValue);
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
      _assignMergeValue(object, key, newValue);
    }
  function _baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      _baseFor(source, function(srcValue, key) {
        if (_isObject(srcValue)) {
          stack || (stack = new __LD.Stack);
          _baseMergeDeep(object, source, key, srcIndex, _baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          _assignMergeValue(object, key, newValue);
        }
      }, _keysIn);
    }
  function _createAssigner(assigner) {
    return _baseRest(function(object, sources) {
      var index      = -1,
          length     = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard      = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
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

  //--------------------------------------------------
  var ldLite = {
      at                : undefined
    , each              : _each
    , every             : _every
    , extend            : _assignIn
    , filter            : _filter
    , find              : _find
    , findIndex         : _findIndex
    , get               : _get
    , getAllKeys        : _getAllKeys
    , has               : _has
    , hasIn             : _hasIn
    , indexOf           : _indexOf
    , isArray           : _isArray
    , isArrayLike       : _isArrayLike
    , isArrayLikeObject : _isArrayLikeObject
    , isBoolean         : _isBoolean
    , isEmpty           : _isEmpty
    , isFunction        : _isFunction
    , isIndex           : _isIndex
    , isKey             : _isKey
    , isLength          : _isLength
    , isNumber          : _isNumber
    , isObject          : _isObject
    , isObjectLike      : _isObjectLike
    , isPlainObject     : _isPlainObject
    , isPrototype       : _isPrototype
    , isString          : _isString
    , isSymbol          : _isSymbol
    , isTypedArray      : _isTypedArray
    , keys              : _keys
    , keysIn            : _keysIn
    , last              : _last
    , map               : _map
    , max               : _max
    , merge             : undefined
    , omit              : _omit
    , pick              : undefined
    , property          : _property
    , pull              : undefined
    , pullAt            : undefined
    , pullAll           : _pullAll
    , range             : _range
    , remove            : _remove
    , some              : _some
    , sortBy            : undefined
    , union             : _union
    , uniq              : _uniq
    , zipObject         : _zipObject
  };
  ldLite['at']     = _flatRest(_baseAt);
  ldLite['pull']   = _baseRest(_pullAll);
  ldLite['pullAt'] = _flatRest(function(array, indexes) {
    var length = array == null ? 0 : array.length,
        result = _baseAt(array, indexes);

    _basePullAt(array, _arrayMap(indexes, function(index) {
      return _isIndex(index, length) ? +index : index;
    }).sort(_compareAscending));

    return result;
  });
  ldLite['sortBy'] = _baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && _isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && _isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return _baseOrderBy(collection, _baseFlatten(iteratees, 1), []);
    });
  ldLite['merge']  = _createAssigner(function(object, source, srcIndex) {
      _baseMerge(object, source, srcIndex);
    });
  ldLite['pick']   = _flatRest(function(object, paths) {
      return object == null ? {} : _basePick(object, paths);
    });

  //Alias
  ldLite['forEach'] = ldLite['each'];

  if (!window['_']) {
    window['_'] = ldLite;
  }

})();
/* ***** lodash custom ends ***** */
