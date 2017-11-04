/** @license SPA-handlebars-helpers.js | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/* ============================================================================
 * SPA-handlebars-helpers.js is the collection of javascript functions which simplifies
 * the interfaces for Single Page Application (SPA) development using SPA.js (spajs.org)
 *
 * Dependency: (hard)
 * handlebars: http://handlebarsjs.com/ || https://github.com/wycats/handlebars.js/
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
;(function(){
    var _Array_ = Array.prototype;

  /**
   *
   * @param {*} x
   *
   * @return {string}
   * 'undefined' <- var = x;
   * 'null'      <- var x = null;
   * 'string'    <- var x = '';        // any string
   * 'number'    <- var x = 1;         // any number
   * 'boolean'   <- var x = true;
   * 'boolean'   <- var x = false;
   * 'array'     <- var x = [];        // any array
   * 'object'    <- var x = {};        // any object
   * 'function'  <- var x = function;  // any function
   */
  function of (x) {
    return (Object.prototype.toString.call(x)).replace(/\[object /, '').replace(/\]/, '').toLowerCase();
  }

  /**
   *
   * @param {*}      x
   * @param {string} type
   *
   * @return {boolean}
   *
   * var x =;          // is(x, 'undefined') >>> true
   * var x = null;     // is(x, 'null')      >>> true
   * var x = '';       // is(x, 'string')    >>> true
   * var x = 1;        // is(x, 'number')    >>> true
   * var x = true;     // is(x, 'boolean')   >>> true
   * var x = false;    // is(x, 'boolean')   >>> true
   * var x = [];       // is(x, 'array')     >>> true
   * var x = {};       // is(x, 'object')    >>> true
   * var x = function; // is(x, 'function')  >>> true
   *
   *
   * (typeof x === string || typeof x === number) ===> is(x, 'string|number')
   *
   */
  function is(x, type) {
    return ((''+type).toLowerCase().indexOf(of(x)) >= 0);
  }

  /**
   *
   * @param {object} obj
   * @param {string} propNames
   *
   * @return {boolean}
   * var obj = { name: 'Handlebars', version: '1.0.10', license: 'MIT' }
   *
   * hasPrimaryKeys(obj, 'release')       --> false
   * hasPrimaryKeys(obj, 'name')          --> true
   * hasPrimaryKeys(obj, 'name, version') --> true
   * hasPrimaryKeys(obj, 'release|name')  --> true
   * hasPrimaryKeys(obj, 'name&author')   --> false
   *
   */
  function hasPrimaryKeys(obj, propNames){

    function checkForAll(obj, propNames){
      var pKeys = propNames.split(','), pKey = '', pKeysCount = 0, retValue = true;
      for(var i=0;i<pKeys.length; i++) {
        pKey = pKeys[i].trim();
        if (pKey) {
          pKeysCount++;
          retValue = retValue && (obj.hasOwnProperty(pKey));
        }
      }

      return pKeysCount && retValue;
    }

    function checkForAny(obj, propNames){
      var pKeys = propNames.split(','), pKey = '', pKeysCount = 0, retValue = false;
      for(var i=0;i<pKeys.length; i++) {
        pKey = pKeys[i].trim();
        if (pKey) {
          pKeysCount++;
          retValue = retValue || (obj.hasOwnProperty(pKey));
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
  }

  function isHbOptions(obj, fnName){
    if (is(obj, 'object')
      && (hasPrimaryKeys(obj, 'name,hash,data')
      && hasPrimaryKeys(obj['data'], 'root'))) {
      if (fnName) {
        return obj['name'] == fnName;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  function isBlockCall(obj) {
    return ((isHbOptions(obj)) && hasPrimaryKeys(obj, 'fn,inverse'));
  }

  function hasHash(obj){
    return ((isHbOptions(obj)) && Object.keys(obj['hash']).length );
  }

  function getHash(obj, toObj) {
    var hashObj = (hasHash(obj)? obj['hash'] : {});
    if (toObj) {
      Object.keys(hashObj).forEach(function(hashKey){
        toObj[hashKey] = hashObj[hashKey].trim();
      });
      return toObj;
    } else {
      return hashObj;
    }
  }

  function getHashRaw(obj, toObj) {
    var hashObj = (hasHash(obj)? obj['hash'] : {});
    if (toObj) {
      Object.keys(hashObj).forEach(function(hashKey){
        toObj[hashKey] = hashObj[hashKey];
      });
      return toObj;
    } else {
      return hashObj;
    }
  }

  function _hbjshelper_() {
    //exit if no arguments
    if (arguments.length < 2) {
      console.error('missing argument(s)');
      throw new Error('missing argument(s)');
    }

    //extract injected handlebars options in param and process
    var options = _Array_.splice.call(arguments, arguments.length - 1, 1)[0],
      _rootData = options['data']['root'] || {},
      isBlock   = (options.hasOwnProperty('fn') || options.hasOwnProperty('inverse')),
      isIfCall  = (options['name'] == ':if'),
      isConditionBlock, ifCondition,

      check = {
        '==': function (l, r) {
          return l == r;
        },
        '===': function (l, r) {
          return l === r;
        },
        '!=': function (l, r) {
          return l != r;
        },
        '!==': function (l, r) {
          return l !== r;
        },
        '<': function (l, r) {
          return l < r;
        },
        '>': function (l, r) {
          return l > r;
        },
        '<=': function (l, r) {
          return l <= r;
        },
        '>=': function (l, r) {
          return l >= r;
        },
        ':typeof': function (l, r) {
          return typeof l === r;
        },
        ':instanceof': function (l, r) {
          return of(l).toLowerCase() === (''+r).trim().toLowerCase();
        },
        ':is': function (l, r) {
          return of(l).toLowerCase() === (''+r).trim().toLowerCase();
        },
        '=ic': function (l, r) {
          return ((''+l).toLowerCase() == (''+r).toLowerCase());
        },
        '!=ic': function (l, r) {
          return ((''+l).toLowerCase() != (''+r).toLowerCase());
        },
        '+': function(l, r){
          return (l + r);
        },
        '-': function(l, r){
          return (l - r);
        },
        '*': function(l, r){
          return (l * r);
        },
        '/': function(l, r){
          return (l / r);
        }
      },

      ifConditions = Object.keys(check),

      isCondition = function (str) {
        return (ifConditions.indexOf(str) >= 0);
      },

      mainArgs = _Array_.slice.call(arguments);


    //isConditionBlock
    for (var i = 0; i < mainArgs.length; i++) {
      if ( of (mainArgs[i]) === 'string') {
        isConditionBlock = isCondition(mainArgs[i]) ? i : 0;
        if (isConditionBlock) {
          ifCondition = mainArgs[i];
          break;
        }
      }
    }

    //:if must be  a block
    if (isIfCall && !(isBlock && isConditionBlock)) {
      console.error("[Template Syntax Error] :if must have 'CONDITION' and BLOCK. use {{#:if ... 'CONDITION' ... }} ... {{else}} ... {{/:if}}");
      throw new Error("[Template Syntax Error] :if must have 'CONDITION' and BLOCK. use {{#:if ... 'CONDITION' ... }} ... {{else}} ... {{/:if}}");
    }

    if (isConditionBlock) {
      var lSideArgs = mainArgs.slice(0, isConditionBlock),
        rSideArgs = mainArgs.slice(isConditionBlock + 1),

        lSideValue = process.apply(undefined, lSideArgs),
        rSideValue = process.apply(undefined, rSideArgs),

        ifResult = check[ifCondition](lSideValue, rSideValue);

      if (isBlock) {
        return ifResult ? options.fn(lSideValue) : options.inverse(rSideValue);
      } else {
        return ifResult;
      }
    } else {
      return process.apply(undefined, arguments);
    }

    function process() {
      var procArgs = _Array_.slice.call(arguments),
        retValues,
        done;

      function appendToRetValue(nValue){
        if (retValues === void 0) {
          retValues = nValue;
        } else {
          var nValType = of(nValue);
          switch(of(retValues)) {
            case 'array':
              switch(nValType) {
                case 'array':
                  retValues = retValues.concat(nValue);
                break;
                default:
                  retValues.push(nValue);
                break;
              }
              break;

            case 'object':
              switch(nValType) {
                case 'array':
                  for(var i=0; i<nValue.length; i++) {
                    retValues[i] = nValue[i];
                  }
                  break;

                case 'object':
                  Object.keys(nValue).forEach(function(key){
                    retValues[key] = nValue[key];
                  });
                  break;
                default:
                  retValues['_'+(Object.keys(retValues).length+1)] = nValue;
                  break;
              }
              break;

            default:
              switch(nValType) {
                case 'object':
                  nValue = JSON.stringify(nValue);
                break;
                case 'array':
                  nValue = nValue.join();
                break;
              }
              retValues += ' '+nValue;
              break;
          }
        }
      }

      procArgs.forEach(function (item, index) {
        if (!done) {
          switch ( of (item)) {
            case 'function':
              var fnArgsArr = procArgs.slice(index + 1);
              fnArgsArr.push(_rootData);
              var fnResult = item.apply(undefined, fnArgsArr);

              if (isBlock) {
                if (isConditionBlock) {
                  appendToRetValue(fnResult);
                } else {
                  if ( of (fnResult) === 'boolean') {
                    appendToRetValue(fnResult ? options.fn(fnResult) : options.inverse(fnResult));
                  } else {
                    appendToRetValue(options.fn(fnResult));
                  }
                }
              } else {
                appendToRetValue(fnResult);
              }
              done = true;
              break;

            case 'array':
              if (isBlock) {
                if (isConditionBlock) {
                  appendToRetValue(item);
                } else {
                  if (item.length) {
                    item.forEach(function (arrValue) {
                      appendToRetValue(options.fn(arrValue));
                    });
                  } else {
                    appendToRetValue(options.inverse(_rootData));
                  }
                }
              } else {
                appendToRetValue(item);
              }
              break;

            case 'object':
              if (isBlock) {
                if (isConditionBlock) {
                  appendToRetValue(item);
                } else {
                  if (Object.keys(item).length) {
                    appendToRetValue(options.fn(item));
                  } else {
                    appendToRetValue(options.inverse(_rootData));
                  }
                }
              } else {
                appendToRetValue(item);
              }
              break;

            default:
              if (isBlock) {
                if (isConditionBlock) {
                  appendToRetValue(item);
                } else {
                  appendToRetValue(item ? options.fn(_rootData) : options.inverse(_rootData));
                }
              } else {
                appendToRetValue(item);
              }
              break;
          }
        }
      });

      //Return of process
      if (!isBlock) {
        switch(of(retValues)) {
          case 'object':
            return JSON.stringify(retValues);
          case 'array':
            return retValues.join();
          default:
            return retValues;
        }
      } else {
        return retValues;
      }
    }//end of process

  }

  function _of (x) {
    return (of(x));
  }

  function _is(x, type) {
    var helperOptions = arguments[arguments.length-1],
      type2Check = (isHbOptions(type))? 'undefined' : type;
    if (isBlockCall(helperOptions)) {
      return (is(x, type2Check))? helperOptions.fn(x) : helperOptions.inverse(x);
    } else {
      return is(x, type2Check);
    }
  }

  function _toLowerCase(inputVal) {
    return (''+(inputVal || '')).toLowerCase();
  }

  function _toUpperCase(inputVal) {
    return (''+(inputVal || '')).toUpperCase();
  }

  function _capitalize(inputVal) {
    return (''+inputVal).charAt(0).toUpperCase() + (''+inputVal).slice(1);
  }

  function _unCapitalize(inputVal) {
    return (''+inputVal).charAt(0).toLowerCase() + (''+inputVal).slice(1);
  }

  function _normalizeStr(inputVal) {
    return _trimStr(inputVal).replace(/\s+/g, ' ');
  };

  function _toInt(inputVal) {
    inputVal = ('' + inputVal).replace(/[^+-0123456789.]/g, '');
    inputVal = (inputVal.trim().length) ? ((inputVal.indexOf('.') >= 0) ? inputVal.substring(0, inputVal.indexOf('.')) : inputVal) : '0';
    return (parseInt(inputVal * 1, 10));
  }

  function _toFloat(inputVal) {
    inputVal = ('' + inputVal).replace(/[^+-0123456789.]/g, '');
    inputVal = (inputVal.trim().length) ? inputVal : '0';
    return (parseFloat(inputVal * (1.0)));
  }

  function _toString(inputVal){
    switch(of(inputVal)){
      case 'object':
        return JSON.stringify(inputVal);
      case 'array':
        return inputVal.join();
      default:
        return (''+inputVal);
    }
  }

  function _toBool(inputVal){
    switch(of(inputVal)) {
      case 'function':
        return true;
      case 'object':
        return (Object.keys(inputVal).length>0);
      case 'array':
        return (inputVal.length>0);
      default:
        var retValue = true;
        switch ((''+inputVal).trim().toLowerCase()) {
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
    }
  }

  function _trimStr(inputVal, tStr) {
    inputVal = _toString(inputVal);
    if (!is(tStr, 'string')) {
      return inputVal.trim();
    }
    return _trimLeftStr(_trimRightStr(inputVal, tStr), tStr);
  }

  function _trimLeftStr(inputVal, tStr) {
    inputVal = _toString(inputVal);
    if (!is(tStr, 'string')) tStr = '';
    return (inputVal.replace(new RegExp("^[" + (tStr || "\\s")+"]+", "g"), ""));
  };

  function _trimRightStr(inputVal, tStr) {
    inputVal = _toString(inputVal);
    if (!is(tStr, 'string')) tStr = '';
    return (inputVal.replace(new RegExp("["+ (tStr || "\\s") + "]+$", "g"), ""));
  };

  function _getLeftStr(inputVal, fromIndex) {
    inputVal = _toString(inputVal);
    if (!is(fromIndex, 'string|number')) fromIndex = 0;
    if (typeof fromIndex === 'string') {
      fromIndex = inputVal.indexOf(fromIndex);
    }
    fromIndex = _toInt(fromIndex);
    return (fromIndex)? inputVal.substr(0, fromIndex) : '';
  };

  function _getRightStr(inputVal, fromIndex) {
    inputVal = _toString(inputVal);
    if (!is(fromIndex, 'string|number')) fromIndex = 0;
    var sLen = 1;
    if (typeof fromIndex === 'string') {
      sLen = fromIndex.length;
      fromIndex = inputVal.indexOf(fromIndex);
    }
    fromIndex = _toInt(fromIndex);
    return (fromIndex<0)? '' : inputVal.substr(fromIndex+sLen);
  };

  /**
   *
   * @param {string} formatStr
   *
   *   'YYYY' : Full Year (4 digits)
   *   'YY'   : Full Year (4 digits)
   *   'Y'    : Full Year (4 digits)
   *
   *   'Mmmm' : January
   *   'MMMM' : JANUARY
   *   'Mmm'  : Jan
   *   'MMM'  : JAN
   *   '0M'   : 01 (01-12 month in 2 digits)
   *   'MM'   : 1  ( 1-12 month in 1 digit till 9)
   *
   *   'Dddd' : Sunday
   *   'DDDD' : SUNDAY
   *   'Ddd'  : Sun
   *   'DDD'  : SUN
   *   'Dd'   : Su
   *   'DD'   : SU
   *   '0d'   : 06 (01-31 date in 2 digits)
   *   'dd'   : 6  ( 1-31 date in 1 digit till 9)
   *
   *
   *   '0h'   : 09 (00-23 hour in 2 digits)
   *   'hh'   : 9  ( 0-23 hour in 1 digit till 9)
   *   '0m'   : 05 (00-59 minute in 2 digits)
   *   'mm'   : 5  ( 0-59 minute in 1 digit till 9)
   *   '0s'   : 01 (00-59 seconds in 2 digits)
   *   'ss'   : 1  ( 0-59 seconds in 1 digit till 9)
   *
   *   'ms'   : 456 (milliseconds 0 - 999)
   */
  function _now(formatStr){

    var rightNow = (new Date());
    if (!is(formatStr, 'string')) return (''+rightNow);

    var retStr = formatStr;

    var Mmmm = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var Mmm  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var Dddd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var Ddd  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var Dd   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function _prefix0(value){
      return (value>9 ? '' : '0') + value;
    }

    var pattern = {
      'YYYY' : rightNow.getFullYear(),
      'YY'   : rightNow.getFullYear(),
      'Y'    : rightNow.getFullYear(),

      'Mmmm' : Mmmm[rightNow.getMonth()],
      'MMMM' : Mmmm[rightNow.getMonth()].toUpperCase(),
      'Mmm'  : Mmm[rightNow.getMonth()],
      'MMM'  : Mmm[rightNow.getMonth()].toUpperCase(),
      '0M'   : _prefix0(rightNow.getMonth()+1, '0', 2, -1),
      'MM'   : rightNow.getMonth()+1,

      'Dddd' : Dddd[rightNow.getDay()],
      'DDDD' : Dddd[rightNow.getDay()].toUpperCase(),
      'Ddd'  : Ddd[rightNow.getDay()],
      'DDD'  : Ddd[rightNow.getDay()].toUpperCase(),
      'Dd'   : Dd[rightNow.getDay()],
      'DD'   : Dd[rightNow.getDay()].toUpperCase(),
      '0d'   : _prefix0(rightNow.getDate(), '0', 2, -1),
      'dd'   : rightNow.getDate(),


      '0h'   : _prefix0(rightNow.getHours(), '0', 2, -1),
      'hh'   : rightNow.getHours(),
      '0m'   : _prefix0(rightNow.getMinutes(), '0', 2, -1),
      'mm'   : rightNow.getMinutes(),
      '0s'   : _prefix0(rightNow.getSeconds(), '0', 2, -1),
      'ss'   : rightNow.getSeconds(),

      'ms'   : rightNow.getMilliseconds()
    };

    Object.keys(pattern).forEach(function(key){
      retStr = retStr.replace(key, pattern[key]);
    });

    return retStr;
  }

  function _nowMs(){
    return (''+((new Date()).getTime()));
  }

  function _rand(min, max) {
    if (!is(min, 'number')) min = 1;
    if (!is(max, 'number')) max = min+999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function _randPwd(passLen, srcStr){
    if (!is(passLen, 'number')) passLen = 8;
    if (!is(srcStr, 'string')) srcStr = '';

    passLen = passLen || 8;
    var chars = srcStr || "9a8b77C8D9E8F7G6H5I4J3c6d5e4f32L3M4N5P6Qg2h3i4j5kV6W5X4Y3Z26m7n8p9q8r7s6t5u4v3w2x3y4z5A6BK7R8S9T8U7";
    var pass = "";
    for (var x = 0; x < passLen; x++) {
      var i = Math.floor(Math.random() * (chars).length);
      pass += chars.charAt(i);
    }
    return pass;
  }

  function _isDefined(inputVal){
    var helperOptions = arguments[arguments.length-1];
    if (isBlockCall(helperOptions)) {
      return (typeof inputVal != 'undefined')? helperOptions.fn(inputVal) : helperOptions.inverse(inputVal);
    } else {
      return (typeof inputVal != 'undefined');
    }
  }

  function _isUndefined(inputVal){
    var helperOptions = arguments[arguments.length-1];
    if (isBlockCall(helperOptions)) {
      return (typeof inputVal == 'undefined')? helperOptions.fn(inputVal) : helperOptions.inverse(inputVal);
    } else {
      return (typeof inputVal == 'undefined');
    }
  }

  function _isEmpty(inputVal){
    var retValue;
    if ((_isUndefined(inputVal)) || (inputVal === null)) {
      retValue = true;
    } else {
      switch (of(inputVal)) {
        case 'undefined':
        case 'null'     : retValue = (true); break;

        case 'function' : retValue = (false); break;
        case 'object'   : retValue = (Object.keys(inputVal).length == 0); break;
        case 'array'    : retValue = (inputVal.length == 0); break;
        case 'boolean'  : retValue = (inputVal); break;
        case 'number'   : retValue = (inputVal == 0); break;
        case 'string'   : retValue = ((inputVal.trim()).length == 0); break;
        default: retValue = false; break;
      }
    }

    var helperOptions = arguments[arguments.length-1];
    if (isBlockCall(helperOptions)) {
      return (!!retValue)? helperOptions.fn(inputVal) : helperOptions.inverse(inputVal);
    } else {
      return (!!retValue);
    }
  }

  function _if(inputVal, tValue, fValue) {
    return (_toBool(inputVal))? tValue : fValue;
  }

  function _ifEmpty(inputVal, ifEmpty, ifNotEmpty) {
    return (_isEmpty(inputVal))? ifEmpty : ((is(ifNotEmpty, 'object') && (ifNotEmpty['name'] == ':ifEmpty')) ? inputVal : ifNotEmpty) ;
  }

  function _ifNotEmpty(inputVal, ifNotEmpty, ifEmpty) {
    return (!_isEmpty(inputVal))? ifNotEmpty : ((is(ifEmpty, 'object') && (ifEmpty['name'] == ':ifNotEmpty'))? inputVal : ifEmpty);
  }

  function _getByIndexOrKey(arrOrObj, indexOrKeyPath){
    var helperOptions = arguments[arguments.length-1],
      retValue = (_is(arrOrObj, 'array|object'))? valueOfKeyPath(arrOrObj, indexOrKeyPath) : arrOrObj;
    if (isBlockCall(helperOptions)) {
      return (typeof retValue != 'undefined')? helperOptions.fn(retValue) : helperOptions.inverse(retValue);
    } else {
      return retValue;
    }
  }

  function _splitString(srcStr, splitBy){
    var retArr = [];
    if (!_isEmpty(srcStr)) {
      if (splitBy) {
       retArr = srcStr.split(splitBy);
      } else {
        if (srcStr.indexOf(',')>0) {
          retArr = srcStr.split(',');
        } else if (srcStr.indexOf('|')>0) {
          retArr = srcStr.split('|');
        } else if (srcStr.indexOf(' ')>0) {
          retArr = srcStr.split(' ');
        } else if (srcStr.indexOf('-')>0) {
          retArr = srcStr.split('-');
        } else {
          retArr = [srcStr];
        }
      }
    };
    return retArr;
  }

  function _split(inStr, splitBy){
    var helperOptions = arguments[arguments.length-1],
      splitByStr = (_is(splitBy, 'string'))? splitBy : undefined,
      splitResult = _splitString(inStr, splitByStr);
    if (isBlockCall(helperOptions)) {
      return _isEmpty(splitResult)? helperOptions.inverse(inStr) : helperOptions.fn(splitResult);
    } else {
      return splitResult;
    }
  }

  function getFunction(fnName) {
    var retFn;
    if (is(fnName, 'string')) {
      fnName = fnName.trim();
      if (fnName) {
        retFn = valueOfKeyPath(window, fnName);
        if (!is(retFn, 'function')) retFn = undefined;
      }
    }
    return retFn;
  }

  function _fnCall() {
    var helperOptions = _Array_.pop.call(arguments),
        fnName  = _Array_.shift.call(arguments),
        fn2call = getFunction(fnName),
        fnContextName, fnContext, fnCallResponse;

    if (fn2call) {
      if (fnName.match(']$')) {
        fnContextName = fnName.substring(0, fnName.lastIndexOf('['));
      } else if (fnName.indexOf('.')>0) {
        fnContextName = fnName.substring(0, fnName.lastIndexOf('.'));
      }
      fnContext = (fnContextName)? valueOfKeyPath(window, fnContextName) : window;
      fnCallResponse = fn2call.apply(fnContext, arguments);
    }
    if (isBlockCall(helperOptions)) {
      if (is(fnCallResponse, 'undefined')) {
        return helperOptions.inverse(fnCallResponse);
      } else {
        return helperOptions.fn(fnCallResponse);
      }
    } else {
      return fnCallResponse;
    }
  }

  /*
   * fnFilter: String functionName
   * '@.fnName'          ==> invokes current component's fnName
   * '@compName.fnName'  ==> invokes compName's fnName
   * 'fnName'            ==> invokes fnName in window scope
   */
  function _each(arrOrObj, itemAs) {
    var helperOptions = arguments[arguments.length-1],
      retValue = '',
      opt = {sortOn:'',sortBy:'',splitBy:',',alias:'',fnFilter:'',fnEmpty:'',fnEnd:'',fnError:''},
      inLoop=!1, loopCount=0,
      fnFilter, fnEmpty, fnEnd, fnError;

    if (hasHash(helperOptions)) {
      opt = getHash(helperOptions, opt);
      fnFilter = getFunction(opt['fnFilter']);
      fnEmpty  = getFunction(opt['fnEmpty']);
      fnEnd    = getFunction(opt['fnEnd']);
      fnError  = getFunction(opt['fnError']);
    }

    if (isBlockCall(helperOptions)) {
      switch (_of(arrOrObj)) {
        case 'string':
          arrOrObj = _splitString(arrOrObj, opt['splitBy']);
        case 'array':
          if (opt['sortOn'] || opt['sortBy']) {
            var sortOptStr = 'sortOn:'+(opt['sortOn'].trim())+';sortBy:'+((opt['sortBy']||'asc').trim());
            arrOrObj = _sort(arrOrObj, sortOptStr);
          }
        case 'object':
          if (_isEmpty(arrOrObj)){
            retValue += helperOptions.inverse(arrOrObj);
          } else {
            var useAlias = (is(itemAs, 'string') && itemAs.trim()),
                aliasNames = (useAlias)? _splitString(itemAs) : (opt['alias']? _splitString(opt['alias']) : ['', '']),
                valAlias = (aliasNames[0]||'').trim(),
                keyAlias = (aliasNames[1]||'').trim(),
                desKeyName = keyAlias || 'index',
                context;
            inLoop=!0;
            Object.keys(arrOrObj).forEach(function (item, aIdx) {
              opt['key'] = item;
              context = (valAlias)? {} : arrOrObj[item];
              if (valAlias){
                if (valAlias) context[valAlias] = arrOrObj[item];
                if (keyAlias) context[keyAlias] = item;
              }

              if (fnFilter) {
                opt[desKeyName+'Src'] = aIdx;
                if (fnFilter.call(undefined, context)) {
                  opt[desKeyName] = loopCount++;
                  retValue += helperOptions.fn(context, {data: opt});
                }
              } else {
                opt[desKeyName] = loopCount++;
                retValue += helperOptions.fn(context, {data: opt});
              }
            });

          }
          break;
        default:
          if (fnError) fnError.call(undefined, arrOrObj);
          retValue += helperOptions.inverse(arrOrObj);
          break;
      }

      if (inLoop) {
        if (loopCount) {
          if (fnEnd) fnEnd.call(undefined, arrOrObj);
        } else {
          if (fnEmpty) fnEmpty.call(undefined, arrOrObj);
          retValue += helperOptions.inverse(arrOrObj);
        }
      }

      return retValue;

    } else {
      return arrOrObj;
    }
  }

  function _selectOptions(arrOrObj, optStr){
    var helperOptions = arguments[arguments.length-1]
    , sOptions = ''
    , oIndex = -1
    , opt = {value:'',text:'',value_text:'',splitBy:',',vtSplit:''
            ,sortOn:'',sortBy:''
            ,fnFilter:'',fnEmpty:'',fnEnd:''
            ,selIndex:'',selValue:'',selText:''}
    , selIdxLst=[], selValLst=[], selTxtLst=[]
    , selByIdx, selByVal, selByTxt
    , sortOn, sortBy
    , fnFilter, fnEmpty, fnEnd
    , vKey='', tKey='', vtSplit='', useIndex4Val
    , optionsArray = [];

    if (hasHash(helperOptions)) {
      opt = getHash(helperOptions, opt);
    } else if (is(optStr, 'string')) {
      _splitString(optStr, ';').forEach(function(optKeyVal){
        var optKV = optKeyVal.split(':');
        opt[optKV[0].trim()] = is(optKV[1], 'undefined')? '' :  optKV[1].trim();
      });
    }

    selIdxLst = opt['selIndex']? _splitString(opt['selIndex']) : [];
    selValLst = opt['selValue']? _splitString(opt['selValue']) : [];
    selTxtLst = opt['selText']?  _splitString(opt['selText']) : [];

    selByIdx = (selIdxLst.length);
    selByVal = (selValLst.length);
    selByTxt = (selTxtLst.length);

    vKey = opt['value'] || opt['value_text'],
    tKey = opt['text'] || opt['value_text'];
    vtSplit = (opt['vtSplit']||'').replace(/colon/gi,':');
    useIndex4Val = (vKey.toLowerCase()=='index');

    sortOn   = opt['sortOn'].trim();
    sortBy   = opt['sortBy'].trim();
    if (sortBy && !sortOn) sortOn = 'text';
    if (sortOn && !sortBy) opt['sortBy'] = 'asc';

    fnFilter = getFunction(opt['fnFilter']);
    fnEmpty  = getFunction(opt['fnEmpty']);
    fnEnd    = getFunction(opt['fnEnd']);

    function addToList(val, txt){
      optionsArray.push({value:val, text:txt});
    }

    function isSelected(oValue, oText) {
      return ( (selByIdx && selIdxLst.indexOf(''+oIndex)>=0)
            || (selByVal && selValLst.indexOf(''+oValue)>=0)
            || (selByTxt && selTxtLst.indexOf(''+oText)>=0) );
    }
    function option(value, text){
      oIndex++;
      return '<option value="'+value+'" '+(isSelected(value, text)? 'selected' : '')+'>'+text+'</option>';
    }

    if (is(arrOrObj, 'string')) {
      arrOrObj = _splitString(arrOrObj, opt['splitBy']);
    };

    switch (_of(arrOrObj)) {
      case 'object':
          //{'01': 'Jan', '02':'Feb', '03':'Mar'}
          Object.keys(arrOrObj).forEach(function (key) {
            //sOptions += option(key, arrOrObj[key]);
            addToList(key, arrOrObj[key]);
          });
        break;
      case 'array':
        arrOrObj.forEach(function (oItem, idx) {
          switch(of(oItem)) {
            //[ {code:'01', name:'Jan'}, {code:'02', name:'Feb'}, {code:'03', name:'Mar'} ]
            //[ {'01': 'Jan'}, {'02': 'Feb'}, {'03': 'Mar'} ]
            case 'object': {
                var oItemKeys = Object.keys(oItem);
                if (vKey && tKey) {
                  addToList(oItem[vKey], oItem[tKey]);
                } else if (oItemKeys.length==1) {
                  oItemKeys.forEach(function (key) {
                    addToList(key, oItem[key]);
                  });
                }
              }
              break;

            case 'string' : {
                if (useIndex4Val) {
                    addToList(idx, oItem);
                  break;
                } else {
                  if (vtSplit) {
                    oItem=oItem.split(vtSplit);
                  } else {
                    oItem = [oItem];
                  }
                }
              }
              //no break; fall through case 'array'
            case 'array' : {
                if (vKey && tKey) {
                  addToList(oItem[vKey], oItem[tKey]);
                } else {
                  if (oItem.length == 1) {
                    addToList(oItem[0], oItem[0]);
                  } else if (oItem.length > 1) {
                    addToList(oItem[0], oItem[1]);
                  }
                }
              }
              break;

            default:
              addToList(useIndex4Val?idx : oItem, oItem);
              break;
          }
        });
        break;
    }

    if (fnFilter && optionsArray.length) {
      var filteredOptArray = [];
      optionsArray.forEach(function(optionObj, optIdx){
        optionObj['index'] = optIdx;
        var filterFnResponse = fnFilter.call(undefined, optionObj);
        if (filterFnResponse) {
          filteredOptArray.push( is(filterFnResponse, 'object')? filterFnResponse : optionObj );
        }
      });
      optionsArray = filteredOptArray;
    }

    if (optionsArray.length) {
      if (sortOn || sortBy) {
          var sortOptStr = 'sortOn:'+sortOn+';sortBy:'+sortBy;
          optionsArray = _sort(optionsArray, sortOptStr);
      }
      optionsArray.forEach(function(optionObj){
        sOptions += option(optionObj.value, optionObj.text);
      });
      if (fnEnd) fnEnd.call(undefined, optionsArray, arrOrObj);
    } else {
      if (fnEmpty) fnEmpty.call(undefined, optionsArray, arrOrObj);
    }

    if (isBlockCall(helperOptions)) {
      if (sOptions) {
        return helperOptions.fn(new Handlebars.SafeString(sOptions));
      } else {
        return helperOptions.inverse(this);
      }
    } else {
      return (new Handlebars.SafeString(sOptions));
    }
  }

  function _checkedIf(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? 'checked' : '');
  }
  function _checkedIfNot(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? '' : 'checked');
  }

  function _disabledIf(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? 'disabled' : '');
  }
  function _disabledIfNot(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? '' : 'disabled');
  }

  function _selectedIf(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? 'selected' : '');
  }
  function _selectedIfNot(){
    var chkResult = _hbjshelper_.apply(undefined, arguments);
    return (chkResult? '' : selected);
  }

  function isNumeric(xStr) {
    if (is(xStr, 'number')) {
      return true;
    } else if (is(xStr, 'string')) {
      var nonNumericChars = xStr.replace(/[0-9]/g, '').trim();
      return (xStr.length>0 && (nonNumericChars == '' || (xStr.length>1 && nonNumericChars == '.')));
    } else {
      return false;
    }
  }

  function toDottedPath(srcStr){
    return _trimStr((srcStr||"").replace(/]/g,'').replace(/(\[)|(\\)|(\/)/g,'.').replace(/(\.+)/g,'.'), ("\\."));
  }

  function valueOfKeyPath(obj, pathStr, def) {
    for (var i = 0, path = toDottedPath(pathStr).split('.'), len = path.length; i < len; i++) {
      if (!obj || typeof obj == "undefined") return def;
      obj = obj[path[i]];
    }
    if (typeof obj == "undefined") return def;
    return obj;
  }

  function _sort(arrList, optStr){
    var helperOptions = arguments[arguments.length-1],
      sortedArrList = [],
      opt = {sortOn:'',sortBy:'asc',splitBy:','},
      asc = true,
      sortOnKey = '';

    function strCompare(strA, strB){
      return (strA < strB)? -1 : ( (strA > strB)? 1 : 0 );
    }

    //Read Helper Options
    if (hasHash(helperOptions)) {
      opt = getHash(helperOptions, opt);
    } else if (is(optStr, 'string')) {
      _splitString(optStr, ';').forEach(function(optKeyVal){
        var optKV = optKeyVal.split(':');
        opt[optKV[0].trim()] = is(optKV[1], 'undefined')? '' :  optKV[1].trim();
      });
    }

    asc = (opt['sortBy'].toLowerCase() == 'asc');
    sortOnKey = (opt['sortOn'] || '');

    if (is(arrList, 'string') && arrList.length>0) {
      arrList = _splitString(arrList, opt['splitBy']);
    };

    if (is(arrList, 'array') && arrList.length>0) {

      if (arrList.length==1) {
        sortedArrList = arrList;
      } else {
        switch(of(arrList[0])){
          case 'number':
              sortedArrList = arrList.sort(function(a,b){return a-b;});
            break;

          case 'string':
              if (isNumeric(arrList[0])) {
                sortedArrList = arrList.sort(function(a,b){return (a*1) - (b*1);});
              } else {
                sortedArrList = arrList.sort();
              }
            break;

          case 'boolean':
              sortedArrList = arrList.sort(function(a,b){return strCompare(a,b);});
            break;

          case 'object':
            if (sortOnKey) {
              switch (of(valueOfKeyPath(arrList[0],sortOnKey))) {
                case 'number':
                    sortedArrList = arrList.sort(function(a,b){return valueOfKeyPath(a,sortOnKey)-valueOfKeyPath(b,sortOnKey);});
                  break;
                case 'string':
                    if (isNumeric(valueOfKeyPath(arrList[0],sortOnKey))) {
                      sortedArrList = arrList.sort(function(a,b){return (valueOfKeyPath(a,sortOnKey)*1)-(valueOfKeyPath(b,sortOnKey)*1);});
                    } else {
                      sortedArrList = arrList.sort(function(a,b){return strCompare(valueOfKeyPath(a,sortOnKey),valueOfKeyPath(b,sortOnKey));});
                    }
                  break;
                case 'boolean':
                      sortedArrList = arrList.sort(function(a,b){return strCompare(valueOfKeyPath(a,sortOnKey),valueOfKeyPath(b,sortOnKey));});
                  break;
                default:
                    sortedArrList = arrList;
                  break;
              }
            } else {
              sortedArrList = arrList;
            }
            break;

          default:
              sortedArrList = arrList;
            break;
        }
      }
      if (!asc) {
        sortedArrList = sortedArrList.reverse();
      }
    }

    if (isBlockCall(helperOptions)) {
      return (sortedArrList.length)? helperOptions.fn(sortedArrList) : helperOptions.inverse(arrList);
    } else {
      return sortedArrList;
    }
  }

  function merge() {
    var resultObj={}, i=0, length=arguments.length;

    // Merge the object into the resultObj object
    function _merge(obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            resultObj[prop] = merge(resultObj[prop], obj[prop]);
          } else {
            resultObj[prop] = obj[prop];
          }
        }
      }
    }

    // Loop through each object and conduct a merge
    for (;i < length; i++) {
      _merge(arguments[i]);
    }

    return resultObj;
  };

  function _join(){
    var helperOptions  = _Array_.pop.call(arguments),
        joinResult;

    function append(arg) {
      if (!is(arg, 'undefined|null')) {
        switch (of(joinResult)) {
          case 'undefined':
          case 'null':
            joinResult = arg;
            break;
          case 'array': //concat or push
            switch(of(arg)){
              case 'array':
                joinResult = joinResult.concat(arg);
                break;
              default:
                joinResult.push(arg);
                break;
            }
            break;
          case 'object': //merge
            switch(of(arg)){
              case 'object':
                joinResult = merge(joinResult, arg);
//                Object.keys(arg).forEach(function(key){
//                  joinResult[key] = arg[key];
//                });
                break;
              default:
                if (joinResult.hasOwnProperty('__joined__')) {
                  joinResult['__joined__'].push(arg);
                } else {
                  joinResult['__joined__'] = [arg];
                };
                break;
            }
            break;
          default:
            //may be string, number, boolean
            switch(of(arg)){
              case 'array':
                if (arg.length)
                  joinResult += arg.join();
                break;
              case 'object':
                if (Object.keys(arg).length)
                  joinResult += JSON.stringify(arg);
                break;
              default:
                joinResult += ''+arg;
                break;
            }
            break;
        }
      }
    }

    _Array_.forEach.call(arguments, function(arg){
      append(arg);
    });
    if (isBlockCall(helperOptions)) {
      return helperOptions.fn(joinResult);
    } else {
      return joinResult;
    }
  }

  function _joinWith(){
    var helperOptions   = _Array_.pop.call(arguments),
        joinWithStr = _Array_.shift.call(arguments),
        joinResult  = _Array_.join.call(arguments, joinWithStr);
    if (isBlockCall(helperOptions)) {
      return helperOptions.fn(joinResult);
    } else {
      return joinResult;
    }
  }

  function _jsonify(){
    var helperOptions = _Array_.pop.call(arguments),
        jsonStr   = _Array_.shift.call(arguments),
        jsonObj   = {},
        jsonArgs  = _Array_.splice.call(arguments,0);

    if (is(jsonStr, 'string')) {
      _splitString(jsonStr, ';').forEach(function(optKeyVal){
        var jsonKey = _getLeftStr(optKeyVal, ':').trim(),
            jsonVal = _getRightStr(optKeyVal, ':').trim();
        if (jsonKey) {
          jsonVal = strToNative(jsonVal);
          jsonObj[jsonKey] = jsonVal;
        }
      });
    }

    if (isBlockCall(helperOptions)) {
      return helperOptions.fn(jsonObj);
    } else {
      return jsonObj;
    }

    function strToNative(strValue) {
      strValue = strValue.trim();
      if (!strValue.length) {
        return strValue;
      };

      var strValType = strValue[0],
          retValue = strValue;

      switch (true) {
        case (strValue == 'true'):
            retValue = !0;
          break;
        case (strValue == 'false'):
            retValue = !1;
          break;
        case (isNumeric(strValue)):
            retValue = strValue*1;
          break;
        case (strValType == '['):
            strValue = strValue.substring(1,strValue.lastIndexOf(']'))+',';
        case ((strValue.indexOf(',')>0) && (strValue.indexOf('{')<0)): {
            var vArray = [];
            (strValue.split(',')).forEach(function(aItem){
              aItem = aItem.trim();
              if (aItem != '') {
                vArray.push(strToNative(aItem));
              }
            });
            retValue = vArray;
          }
          break;
        case (strValType == '{'): {
            strValue = strValue.substring(1,strValue.lastIndexOf('}'));
            var vObj = {}, inObjKey, inObjVal;
            (strValue.split(',')).forEach(function(aItem){
              aItem = aItem.trim();
              inObjKey = _getLeftStr(aItem, ':').trim(),
              inObjVal = _getRightStr(aItem, ':').trim();
              if (inObjKey) {
                vObj[inObjKey] = strToNative(inObjVal);
              }
            });
            retValue = vObj;
          }
          break;
        case ((strValType == '@') && (strValue[1] != '[')): {
            var argIndex = strValue.substring(1, strValue.indexOf('.'));
            if (isNumeric(argIndex)) {
              retValue = jsonArgs[argIndex];
              var keyPath = (strValue.indexOf('.')>0)? strValue.substr(strValue.indexOf('.')+1) : '';
              if (keyPath && is(retValue, 'array|object')) {
                retValue = valueOfKeyPath(retValue, keyPath);
              }
            }
          }
          break;
      }

      if (is(retValue, 'string') && retValue.indexOf('@[')>=0) {
        var vRefPatterns = retValue.match(/(@\[\s*(.*?)\s*])/g),
            vRefPath,argIdx,repValue,kPath;
        if (vRefPatterns) {
          _.forEach(vRefPatterns, function(vRefPathPattern){
            vRefPath = vRefPathPattern.replace(/@\[/,'').replace(/]/,'');
            argIdx   = vRefPath.substring(0, vRefPath.indexOf('.'));
            repValue = '';
            if (isNumeric(argIdx)) {
              repValue = jsonArgs[argIdx];
              kPath  = (vRefPath.indexOf('.')>0)? vRefPath.substr(vRefPath.indexOf('.')+1) : '';
              if (kPath && is(repValue, 'array|object')) {
                repValue = valueOfKeyPath(repValue, kPath);
              }
            }
            retValue = retValue.replace((new RegExp(vRefPathPattern.replace(/\[/, '\\['), 'g')), repValue);
          });
        }
      }
      return retValue;
    }
  }

  function _jsonParse() {
    var helperOptions  = _Array_.pop.call(arguments),
        jsonStr = Array_.shift.call(arguments),
        jsonObj = {};

    if (is(jsonStr, 'string')) {
      try {
        jsonObj = JSON.parse(jsonStr);
      }catch(e){
        if (isBlockCall(helperOptions))
          return helperOptions.inverse(e);
      }
    }

    if (isBlockCall(helperOptions)) {
      return helperOptions.fn(jsonObj);
    } else {
      return jsonObj;
    }
  }

  function _console() {
    var helperOptions = _Array_.pop.call(arguments),
        cType = _unCapitalize(helperOptions.name.replace(/:console/g, ''));
    if ((cType == 'time') && arguments.length) {
      console.log.apply(undefined, arguments);
    };
    if (cType.indexOf('mem')==0) {
      console.log(console.memory);
    } else {
      console[cType].apply(undefined, arguments);
    }
  };

  function _replaceStr (srcStr){
    var helperOptions = arguments[arguments.length-1],
      retValue = '',
      opt = {searchStr:'', replaceStr:'', rxPattern:'', rxOption:''};

    if (hasHash(helperOptions)) {
      opt = getHashRaw(helperOptions, opt);
    }

    if (opt.rxPattern) {
      retValue = (''+srcStr).replace(new RegExp(opt.rxPattern, opt.rxOption), opt.replaceStr);
    } else {
      retValue = (''+srcStr).replace(opt.searchStr, opt.replaceStr);
    }
    return retValue;
  }

  if ((typeof Handlebars != "undefined") && Handlebars) {
    Handlebars.registerHelper({
      ':'              : _hbjshelper_, //+Block

      ':if'            : _hbjshelper_,           //+Block
      ':is'            : _is,           //+Block
      ':isEmpty'       : _isEmpty,      //+Block

      ':ofType'        : _of,
      ':?'             : _if,
      ':ifEmpty'       : _ifEmpty,
      ':ifNotEmpty'    : _ifNotEmpty,

      ':of'            : _getByIndexOrKey,
      ':each'          : _each,
      ':forEach'       : _each,
      ':split'         : _split,
      ':sort'          : _sort,
      ':join'          : _join,
      ':merge'         : _join,
      ':joinWithStr'   : _joinWith,
      ':fn'            : _fnCall,
      ':jsonify'       : _jsonify,
      ':jsonParse'     : _jsonParse,

      ':consoleClear'          : _console,
      ':consoleLog'            : _console,
      ':consoleWarn'           : _console,
      ':consoleInfo'           : _console,
      ':consoleError'          : _console,
      ':consoleGroup'          : _console,
      ':consoleGroupEnd'       : _console,
      ':consoleGroupCollapsed' : _console,
      ':consoleMem'            : _console,
      ':consoleMemory'         : _console,
      ':consoleProfile'        : _console,
      ':consoleProfileEnd'     : _console,
      ':consoleTable'          : _console,
      ':consoleTime'           : _console,
      ':consoleTimeEnd'        : _console,

      ':options'       : _selectOptions,
      ':checkedIf'     : _checkedIf,
      ':checkedIfNot'  : _checkedIfNot,
      ':enabledIf'     : _disabledIfNot,
      ':enabledIfNot'  : _disabledIf,
      ':disabledIf'    : _disabledIf,
      ':disabledIfNot' : _disabledIfNot,
      ':selectedIf'    : _selectedIf,
      ':selectedIfNot' : _selectedIfNot,

      ':lower'         : _toLowerCase,
      ':lowerCase'     : _toLowerCase,
      ':toLowerCase'   : _toLowerCase,
      ':lowerCaseOf'   : _toLowerCase,

      ':upper'         : _toUpperCase,
      ':upperCase'     : _toUpperCase,
      ':toUpperCase'   : _toUpperCase,
      ':upperCaseOf'   : _toUpperCase,

      ':capitalize'    : _capitalize,
      ':unCapitalize'  : _unCapitalize,
      ':normalizeStr'  : _normalizeStr,

      ':int'           : _toInt,
      ':toInt'         : _toInt,
      ':intOf'         : _toInt,

      ':float'         : _toFloat,
      ':toFloat'       : _toFloat,
      ':floatOf'       : _toFloat,

      ':toStr'         : _toString,
      ':toString'      : _toString,
      ':toBool'        : _toBool,
      ':toBoolean'     : _toBool,

      ':trim'          : _trimStr,
      ':trimStr'       : _trimStr,
      ':trimLeft'      : _trimLeftStr,
      ':trimLeftStr'   : _trimLeftStr,
      ':trimRight'     : _trimRightStr,
      ':trimRightStr'  : _trimRightStr,
      ':replace'       : _replaceStr,

      ':getLeftStr'    : _getLeftStr,
      ':getRightStr'   : _getRightStr,

      ':dateNowMs'     : _nowMs,
      ':dateNow'       : _now,

      ':rand'          : _rand,
      ':randPwd'       : _randPwd,
      ':ifDefined'     : _isDefined,
      ':ifUndefined'   : _isUndefined

    });
  };

})();
