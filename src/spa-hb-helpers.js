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
   * hasPrimaryKeys(obj, 'release|name') --> true
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

  function _hbjshelper_() {
    //exit if no arguments
    if (arguments.length < 2) {
      console.error('missing argument(s)');
      throw new Error('missing argument(s)');
    }

    var _Array_ = Array.prototype;

    //extract injected handlebars options in param and process
    var _thisData = this,
      options   = _Array_.splice.call(arguments, arguments.length - 1, 1)[0],
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
    var lastParam = arguments[arguments.length-1],
      type2Check = (isHbOptions(type))? 'undefined' : type;
    if (isBlockCall(lastParam)) {
      return (is(x, type2Check))? lastParam.fn(x) : lastParam.inverse(x);
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
    var lastParam = arguments[arguments.length-1];
    if (isBlockCall(lastParam)) {
      return (typeof inputVal != 'undefined')? lastParam.fn(inputVal) : lastParam.inverse(inputVal);
    } else {
      return (typeof inputVal != 'undefined');
    }
  }

  function _isUndefined(inputVal){
    var lastParam = arguments[arguments.length-1];
    if (isBlockCall(lastParam)) {
      return (typeof inputVal == 'undefined')? lastParam.fn(inputVal) : lastParam.inverse(inputVal);
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

    var lastParam = arguments[arguments.length-1];
    if (isBlockCall(lastParam)) {
      return (!!retValue)? lastParam.fn(inputVal) : lastParam.inverse(inputVal);
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

  function _getByIndexOrKey(arrOrObj, indexOrKey){
    var lastParam = arguments[arguments.length-1];
    var retValue = (_is(arrOrObj, 'array|object'))? arrOrObj[indexOrKey] : arrOrObj;
    if (isBlockCall(lastParam)) {
      return (typeof retValue != 'undefined')? lastParam.fn(retValue) : lastParam.inverse(retValue);
    } else {
      return retValue;
    }
  }

  function _each(arrOrObj, itemAs) {
    var lastParam = arguments[arguments.length-1];
    var retValue = '';
    if (isBlockCall(lastParam)) {
      switch (_of(arrOrObj)) {
        case 'string':
          if (arrOrObj.indexOf(',')>0) {
            arrOrObj = arrOrObj.split(',');
          } else if (arrOrObj.indexOf('|')>0) {
            arrOrObj = arrOrObj.split('|');
          } else if (arrOrObj.indexOf(' ')>0) {
            arrOrObj = arrOrObj.split(' ');
          } else if (arrOrObj.indexOf('-')>0) {
            arrOrObj = arrOrObj.split('-');
          } else {
            arrOrObj = [arrOrObj];
          }
        case 'array':
        case 'object':
          if (_isEmpty(arrOrObj)){
            retValue += lastParam.inverse(arrOrObj);
          } else {
            var itemValueAs = (_is(itemAs, 'string'))? itemAs : 'item';
            Object.keys(arrOrObj).forEach(function (item) {
              var context = {key:item};
              context[itemValueAs] = arrOrObj[item];
              retValue += lastParam.fn(context);
            });
          }
          break;
        default:
          retValue += lastParam.inverse(arrOrObj);
          break;
      }
      return retValue;

    } else {
      return arrOrObj;
    }
  }

  if ((typeof Handlebars != "undefined") && Handlebars) {
    Handlebars.registerHelper({
      ':'            : _hbjshelper_, //+Block

      ':if'          : _hbjshelper_,           //+Block
      ':is'          : _is,           //+Block
      ':isEmpty'     : _isEmpty,      //+Block

      ':ofType'      : _of,
      ':?'           : _if,
      ':ifEmpty'     : _ifEmpty,
      ':ifNotEmpty'  : _ifNotEmpty,

      ':of'          : _getByIndexOrKey,
      ':each'        : _each,

      ':toLowerCase' : _toLowerCase,
      ':toUpperCase' : _toUpperCase,
      ':capitalize'  : _capitalize,
      ':unCapitalize': _unCapitalize,
      ':normalizeStr': _normalizeStr,

      ':toInt'       : _toInt,
      ':toFloat'     : _toFloat,
      ':toStr'       : _toString,
      ':toString'    : _toString,
      ':toBool'      : _toBool,
      ':toBoolean'   : _toBool,

      ':trim'        : _trimStr,
      ':trimStr'     : _trimStr,
      ':trimLeft'    : _trimLeftStr,
      ':trimLeftStr' : _trimLeftStr,
      ':trimRight'   : _trimRightStr,
      ':trimRightStr': _trimRightStr,

      ':getLeftStr'  : _getLeftStr,
      ':getRightStr' : _getRightStr,

      ':dateNowMs'   : _nowMs,
      ':dateNow'     : _now,

      ':rand'        : _rand,
      ':randPwd'     : _randPwd

    });
  };

})();