/*@license SPA.js (XHR/ajax) [MIT]*/
(function(_gContext){

  var _objProto  = Object.prototype;
  var _arrProto  = Array.prototype;
  var _defaultDeferTime = 0; //milliseconds

  function _argsToArr ( fromX, fromIdx ) {
    return (arguments.length === 1)? _arrProto.slice.call( fromX ) : _arrProto.slice.call( fromX, fromIdx );
  }

  function _isReservedKey (key) {
    return (_reservedObjKeys.indexOf(key) > -1);
  }
  function _hasOwnProp (xObj, xKey) {
    return _objProto.hasOwnProperty.call(xObj, xKey);
  }

  var _reservedObjKeys = 'hasOwnProperty,prototype,__proto__'.split(',');
  /**
   * Attach Properties/Methods to Function
   *
   * @param {Function} targetFn
   * @param {Object} propObj
   *
   * @returns {Function} targetFn
   */
  function _fnProps (targetFn, propObj) {
    Object.keys(propObj).forEach(function (key) {
      if (!_isReservedKey(key)) {
        Object.defineProperty(targetFn, key, { value: propObj[key] });
      }
    });

    return targetFn;
  }

  /**
   * Attach Properties/Methods to Function prototype
   *
   * @param {Function} targetClass
   * @param {Object} protoObj
   * @param {boolean} enumerable
   *
   * @returns {Function} targetFn
   */
  function _attachPrototypes (targetClass, protoObj, enumerable) {
    Object.keys(protoObj).forEach(function (key) {
      if (!_isReservedKey(key)) {
        if (enumerable) {
          targetClass.prototype[key] = protoObj[key];
        } else {
          Object.defineProperty(targetClass.prototype, key, { value: protoObj[key] });
        }
      }
    });
    return targetClass;
  }

  function _clearTimer(timerX) {
    if (timerX) {
      var timerList = (Array.isArray(timerX))? timerX : [timerX];
      timerList.forEach(function(tX){
        if (tX) { clearTimeout( tX ); }
      });
    }
  }

  var _strExtract   = spa.extractStrBetweenIn;
  var _is           = spa.is;
  var _isStr        = spa.isString;
  var _isArr        = spa.isArray;
  var _isObj        = spa.isObject;
  var _isObjLike    = spa.isObjectLike;
  var _isFn         = spa.isFunction;
  var _isUndef      = spa.isUndefined;
  var _extend       = spa.extend;
  var _mergeDeep    = spa.merge;
  var _findInX      = spa.find;


  /* Util functions */
//  function _strExtract (srcStr, bS, eS, includeStr) {
//    var retArr = String(srcStr).match(RegExp('\\' + bS + '([^\\' + bS + '\\' + eS + '].*?)\\' + eS, 'g')) || [];
//    if (!includeStr && retArr.length) {
//      var bIdx = bS.length;
//      var eIdx = (-1) * eS.length;
//      retArr = retArr.map(function (x) {
//        return x.slice(bIdx, eIdx);
//      });
//    }
//    return retArr;
//  }
//  function _unique ( srcArr ) {
//    return srcArr.filter(function (value, index, self) {
//      return self.indexOf(value) === index;
//    });
//  }
//
//  function _of (x) {
//    return (_objProto.toString.call(x)).slice(8,-1).toLowerCase();
//  }
//  function _is (x, type) {
//    return ((''+type).toLowerCase().indexOf(_of(x)) >= 0);
//  }
//  function _isStr (x) {
//    return _is(x, 'string');
//  }
//  function _isArr ( x ) {
//    return _is(x, 'array');
//  }
//  function _isObj ( x ) {
//    return _is(x, 'object');
//  }
//  function _isObjLike ( x ) {
//    return (typeof x === 'object' || typeof x === 'function');
//  }
//  function _isFn (x) {
//    return _is(x, 'function');
//  }
//  function _isUndef ( x ) {
//    return _is(x, 'undefined');
//  }
//
//  function _extend () {
//    var targetObj = ((arguments.length)? arguments[0] : {}) || {};
//
//    if (arguments.length) {
//      for (var i = 0, nxtObj; (i < arguments.length); i++) {
//        nxtObj = arguments[i];
//        if (_isObj(nxtObj)) {
//          for (var key in nxtObj) {
//            if ((!_isReservedKey(key)) && (_hasOwnProp(nxtObj, key))) {
//              targetObj[key] = nxtObj[key];
//            }
//          }
//        } else if (_isArr(nxtObj)) {
//          targetObj = _mergeArray.call(null, targetObj, nxtObj);
//        }
//      }
//    }
//
//    return targetObj;
//  }
//  function _mergeDeep () {
//    var targetObj = ((arguments.length)? arguments[0] : {}) || {};
//
//    if (arguments.length) {
//      for (var i = 0, nxtObj; (i < arguments.length); i++) {
//        nxtObj = arguments[i];
//        if (_isObj(nxtObj)) {
//          for (var key in nxtObj) {
//            if ((!_isReservedKey(key)) && (_hasOwnProp(nxtObj, key))) {
//              if (_isObj(nxtObj[key])) {
//                targetObj[key] = _mergeDeep(targetObj[key], nxtObj[key]);
//              } else if (_isArr(nxtObj[key])) {
//                targetObj[key] = _mergeArray(targetObj[key], nxtObj[key]);
//              } else {
//                targetObj[key] = nxtObj[key];
//              }
//            }
//          }
//        } else if (_isArr(nxtObj)) {
//          targetObj = _mergeArray.call(null, targetObj, nxtObj);
//        }
//      }
//    }
//
//    return targetObj;
//  }
//  function _mergeArray () {
//    var targetArr = ((arguments.length)? arguments[0] : []) || [];
//
//    if (arguments.length) {
//      for (var i = 0, nxtArr; (i < arguments.length); i++) {
//        nxtArr = arguments[i];
//        if (_isArr(nxtArr)) {
//          for (var aIdx = 0; aIdx < nxtArr.length; aIdx++) {
//            if (_isUndef(targetArr[aIdx])) {
//              targetArr[aIdx] = nxtArr[aIdx];
//            } else {
//              switch (_of(nxtArr[aIdx])) {
//                case 'object':
//                  targetArr[aIdx] = _mergeDeep(targetArr[aIdx], nxtArr[aIdx]);
//                  break;
//                case 'array' :
//                  targetArr[aIdx] = _mergeArray(targetArr[aIdx], nxtArr[aIdx]);
//                  break;
//                case 'undefined' : //Skip
//                  break;
//                default:
//                  targetArr[aIdx] = nxtArr[aIdx];
//                  break;
//              }
//            }
//          }
//        }
//      }
//    }
//
//    return targetArr;
//  }
//  function _toDottedPath (strPath) {
//    return ((strPath || '').trim()
//      .replace(/]|\s+/g, '')
//      .replace(/(\[)|(\\)|(\/)/g, '.')
//      .replace(/(\.+)/g, '.')
//      .replace(/^[.]+|[.]+$/g, ''));
//  }
//  function _findInX (objSrc, pathStr, ifUndefined) {
//    if ((arguments.length > 1) && _isObjLike(objSrc) && String(pathStr)) {
//      var pathList = pathStr.split('|').map(function (path) { return path.trim(); });
//      pathStr = pathList.shift();
//      var nxtPath = pathList.join('|');
//      var unDef;
//      var retValue;
//      var isWildKey = (pathStr.indexOf('*') >= 0);
//
//      if (isWildKey) {
//        retValue = (function (xObj, xKey) {
//          var xValue;
//          if (_isObjLike(xObj)) {
//            if (_hasOwnProp(xObj, xKey)) {
//              xValue = xObj[xKey];
//            } else {
//              var oKeys = Object.keys(xObj);
//              var idx = 0;
//              while (_isUndef(xValue) && (idx < oKeys.length)) {
//                xValue = arguments.callee(xObj[oKeys[idx++]], xKey);
//              }
//            }
//          }
//          return xValue;
//        }(objSrc, pathStr.replace(/\*/g, '')));
//
//      } else {
//        var i = 0;
//        var pathArr = _toDottedPath(pathStr).split('.');
//        for (retValue = objSrc; ((retValue !== unDef) && (i < pathArr.length)); i++) {
//          retValue = (_isObjLike(retValue)) ? retValue[pathArr[i]] : unDef;
//        }
//      }
//
//      if (_isUndef(retValue)) {
//        if (nxtPath) {
//          return _findInX(objSrc, nxtPath, ifUndefined);
//        } else {
//          return (_isFn(ifUndefined)) ? ifUndefined.call(objSrc, objSrc, pathStr) : ifUndefined;
//        }
//      } else {
//        return retValue;
//      }
//    } else {
//      if (arguments.length === 3) {
//        return (_isFn(ifUndefined)) ? ifUndefined.call(objSrc, objSrc, pathStr) : ifUndefined;
//      } else {
//        return objSrc;
//      }
//    }
//  }

  // ---------------------------------------------------------
  function _isSimple (xObjArr) {
    var retValue = true;
    if (typeof xObjArr === 'object') {
      var oKeys = Object.keys(xObjArr);
      for (var i = 0; (retValue && i < oKeys.length); i++) {
        retValue = ((typeof xObjArr[oKeys[i]] !== 'object') || (_isArr(xObjArr[oKeys[i]]) && _isSimple(xObjArr[oKeys[i]])));
      }
    }
    return retValue;
  }
  function _toQueryString (obj) {
    if (_isObj(obj)) {
      var qObj = obj;
      var delimiter;
      var qKey;
      var qVal;

      if ( !(_hasOwnProp(obj, '_payload_') || (_isSimple(obj))) ) {
        qObj = { _payload_: obj };
      }

      return (Object.keys(qObj).reduce(function (str, key, i) {
        delimiter = (i === 0) ? '' : '&';
        qKey = encodeURIComponent(key);
        qVal = _isArr(qObj[key]) ? qObj[key].map(function (item) { return _toQryParamValue(item); }).join(',') : _toQryParamValue(qObj[key]);
        return [str, delimiter, qKey, '=', qVal].join('');
      }, ''));

    } else {
      return String(obj);
    }

    // internal function
    function _toQryParamValue (value) {
      return encodeURIComponent((typeof value === 'object') ? JSON.stringify(value) : value);
    }
  }

  // ---------------------------------------------------------
  function _isDeferred (arg) {
    return ((arg instanceof XHR) ||
            (arg instanceof XHRQ) ||
            (arg instanceof SimplePromise) ||
            (_gContext['Promise'] && (arg instanceof Promise)) ||
            (_gContext['jqXHR'] && (arg instanceof jqXHR)) ||
            (_gContext['Thenable'] && (arg instanceof Thenable)) ||
            (_gContext['Deferred'] && (arg instanceof Deferred ))
            );
  }
  function _shiftFnsToNxtPromise (thisPromise, nxtPromise, fnType) {
    var _thenFns   = thisPromise.fnQ.then;
    var _failFns   = thisPromise.fnQ.fail;
    var _doneFns   = thisPromise.fnQ.done;
    var fnsToShift = { then:'then,fail,done', fail:'fail,done', done:'done' };
    var fnTypes   = fnsToShift[fnType];

    if (_isDeferred(nxtPromise)) {
      if (fnTypes.indexOf('then') > -1) {
        while (_thenFns.length > 0) {
          nxtPromise.then(_thenFns.shift());
        }
      } else {
        thisPromise.fnQ.then = [];
      }

      if (fnTypes.indexOf('fail') > -1) {
        while (_failFns.length > 0) {
          nxtPromise.catch(_failFns.shift());
        }
      } else {
        thisPromise.fnQ.fail = [];
      }

      if (fnTypes.indexOf('done') > -1) {
        while (_doneFns.length > 0) {
          nxtPromise.finally(_doneFns.shift());
        }
      }
    }
  }

  function SimplePromise (fn, deferTime, promiseTimeout) {
    Object.defineProperty(this, 'fnQ', { value:{ then:[], fail:[], done:[] } });
    this.isPending  = true;
    this.isResolved = false;
    this.isRejected = false;
    this.response;
    this.prevFnRes;

    var thisPromise = this;

    var timer0, timer1, timer2;

    function complete (state, response) {
      if (thisPromise.isPending) {
        thisPromise.isPending  = false;
        thisPromise.response   = response;
        thisPromise.prevFnRes  = response;
        thisPromise.isResolved = state;
        thisPromise.isRejected = !state;

        var _thenFns = thisPromise.fnQ.then;
        var _failFns = thisPromise.fnQ.fail;
        var _doneFns = thisPromise.fnQ.done;

        function _runFn (fnList, fnType) {
          while (fnList.length > 0) {
            // thisPromise.prevFnRes = (fnList.shift()).apply(thisPromise, (thisPromise.response).concat([thisPromise.prevFnRes]));
            // _shiftFnsToNxtPromise(thisPromise.prevFnRes, shiftToNxtPromise);
            thisPromise.prevFnRes = [(fnList.shift()).apply(thisPromise, thisPromise.prevFnRes)];
            _shiftFnsToNxtPromise(thisPromise, thisPromise.prevFnRes[0], fnType);
          }
        }

        if (thisPromise.isResolved) {
          // This will run when the promise is resolved
          _runFn(_thenFns, 'then');
        } else {
          // This will run when the promise is rejected
          _runFn(_failFns, 'fail');
        }

        // This will run finally (resolved or rejected)
        _runFn(_doneFns, 'done');

      } else {
        console.warn('Already this promise has been ' + (thisPromise.isResolved ? 'Resolved.' : 'Rejected.'));
      }
      _clearTimer([timer0, timer1, timer2]);
    }
    function resolve () {
      complete.call(thisPromise, true, Array.prototype.slice.call(arguments));
    }
    function reject () {
      complete.call(thisPromise, false, Array.prototype.slice.call(arguments));
    }
    var fnContext = {
      resolve  : resolve,
      reject   : reject
    };


    timer0 = setTimeout(function () {
      if (_isFn(fn)) {
        var fnRes = fn.call(fnContext, resolve, reject);
        if (promiseTimeout) {
          timer1 = setTimeout(function () {
            if (thisPromise.isPending) {
              complete.call(thisPromise, !!fnRes, [fnRes]);
            }
          }, (_isUndef(fnRes) ? promiseTimeout : (deferTime || _defaultDeferTime)));
        }
      } else {
        timer2 = setTimeout(function () {
          if (thisPromise.isPending) {
            complete.call(thisPromise, !!fn, [fn]);
          }
        }, (deferTime || _defaultDeferTime));
      }
    }, _defaultDeferTime);

  }
  /* Attaching .then .fail .catch .done .always .finally to SimplePromise Class */
  _attachPrototypes(SimplePromise, {
    then   : _onPromiseSuccess,
    else   : _onPromiseError,
    fail   : _onPromiseError,
    catch  : _onPromiseError,
    done   : _onPromiseAlways,
    always : _onPromiseAlways,
    finally: _onPromiseAlways
  });

  function _registerPromiseFn (xPromise, fnType, fn) {
    var thisPromise = xPromise;
    if (typeof fn === 'function') {
      var isPromiseComplete = (!thisPromise.isPending);
      if (fnType === 'then') {
        isPromiseComplete = (isPromiseComplete && thisPromise.isResolved);
      } else if (fnType === 'fail') {
        isPromiseComplete = (isPromiseComplete && thisPromise.isRejected);
      }
      if (isPromiseComplete) {
        var prevFnRes = fn.apply(thisPromise, thisPromise.prevFnRes);
        if (_isDeferred(prevFnRes)) {
          thisPromise = prevFnRes;
        } else {
          thisPromise.prevFnRes = [prevFnRes];
        }
      } else {
        thisPromise.fnQ[fnType].push(fn);
      }
    }
    return thisPromise;
  }
  function _onPromiseSuccess (fn) {
    return _registerPromiseFn(this, 'then', fn);
  }
  function _onPromiseError (fn) {
    return _registerPromiseFn(this, 'fail', fn);
  }
  function _onPromiseAlways (fn) {
    return _registerPromiseFn(this, 'done', fn);
  }

  // export wrapper
  function _defer (input, deferTime, timeout) {
    if (arguments.length) {
      return new SimplePromise(input, deferTime, timeout);
    } else {
      return new SimplePromise(1, _defaultDeferTime);
    }
  }
  // ---------------------------------------------------------

  // XHRQ
  function XHRQ (que) {
    Object.defineProperty(this, 'fnQ', { value: { then:[], fail:[], done:[] } });
    this.requests  = que;
    this.responses = [];
    this.length    = que.length;
    this.isPending = que.length;
    this.isFailed  = false;
    this.failed    = [];
    this.prevFnRes;

    var thisPromise = this;
    var timerX;

    function _runFn (fnType) {
      var fnList = thisPromise.fnQ[fnType], nxtFnArg0;
      while (fnList.length > 0) {
        try {
          nxtFnArg0 = (typeof thisPromise.prevFnRes === 'undefined')? [] : [thisPromise.prevFnRes];
          thisPromise.prevFnRes = (fnList.shift()).apply(thisPromise, nxtFnArg0.concat(thisPromise.responses));
          _shiftFnsToNxtPromise(thisPromise, thisPromise.prevFnRes, fnType);
        } catch (e) {
          console.error('Function Execution Error.', e);
        }
      }
    }

    function updateQ () {
      thisPromise.isPending--;

      try {
        if (!thisPromise.isPending) {
          if (thisPromise.isFailed) {
            // This will run when any one request is failed
            _runFn('fail');
          } else {
            // This will run when all requests are successful
            _runFn('then');
          }
          // This will run when always
          _runFn('done');
          _clearTimer(timerX);
        }
      } catch (e) {
        console.error('Function Execution Error.', e);
        _clearTimer(timerX);
      }

    }

    timerX = setTimeout(function () {
      que.forEach(function (qItem, qIdx) {
        if ( (_isDeferred(qItem)) || (_isObjLike(qItem) && (_isFn(qItem['then']) || _isFn(qItem['fail']) || _isFn(qItem['catch']))) ) {
          if (typeof (qItem['then']) === 'function') {
            qItem.then(function () {
              thisPromise.responses[qIdx] = _argsToArr(arguments);
              updateQ();
            });
          }
          var failFnName = (typeof (qItem['fail']) === 'function') ? 'fail' : ((typeof (qItem['catch']) === 'function') ? 'catch' : '');
          if (failFnName) {
            qItem[failFnName](function () {
              thisPromise.responses[qIdx] = _argsToArr(arguments);
              thisPromise.isFailed  = true;
              thisPromise.failed.push(qIdx);
              updateQ();
            });
          }
        } else if (typeof qItem === 'function') {
          var qFnRes = qItem.call(thisPromise, thisPromise.requests, thisPromise.responses, qIdx);
          var isFnFailed = ((typeof (qFnRes) !== 'undefined') && !qFnRes);

          thisPromise.responses[qIdx] = qFnRes;
          thisPromise.isFailed  = thisPromise.isFailed || isFnFailed;
          if (isFnFailed) {
            thisPromise.failed.push(qIdx);
          }
          updateQ();
        } else {
          thisPromise.responses[qIdx] = qItem;
          thisPromise.isFailed = thisPromise.isFailed || !qItem;
          if (thisPromise.isFailed) {
            thisPromise.failed.push(qIdx);
          }
          updateQ();
        }
      });
    }, _defaultDeferTime);
  }
  Object.defineProperties(XHRQ.prototype, {
    then   : { value: _onXHRQSuccess  },
    fail   : { value: _onXHRQError    },
    catch  : { value: _onXHRQError    },
    done   : { value: _onXHRQAlways   },
    always : { value: _onXHRQAlways   },
    finally: { value: _onXHRQAlways   }
  });
  function _registerXHRQChainFn (xXHR, fnType, fn) {
    var thisXHRQ = xXHR, nxtFnArg0;
    if (typeof fn === 'function') {
      var isXHRQComplete = (!thisXHRQ.isPending);
      if (fnType === 'then') {
        isXHRQComplete = (isXHRQComplete && !thisXHRQ.isFailed);
      } else if (fnType === 'fail') {
        isXHRQComplete = (isXHRQComplete && thisXHRQ.isFailed);
      }
      if (isXHRQComplete) {
        nxtFnArg0 = (typeof thisXHRQ.prevFnRes === 'undefined')? [] : [thisXHRQ.prevFnRes];
        thisXHRQ.prevFnRes = fn.apply(thisXHRQ, nxtFnArg0.concat(thisXHRQ.responses));
        if (_isDeferred(thisXHRQ.prevFnRes)) {
          thisXHRQ = thisXHRQ.prevFnRes;
        }
      } else {
        thisXHRQ.fnQ[fnType].push(fn);
      }
    }
    return thisXHRQ;
  }
  function _onXHRQSuccess (fn) {
    return _registerXHRQChainFn(this, 'then', fn);
  }
  function _onXHRQError (fn) {
    return _registerXHRQChainFn(this, 'fail', fn);
  }
  function _onXHRQAlways (fn) {
    return _registerXHRQChainFn(this, 'done', fn);
  }
  function _xhrQ () {
    var que = [];
    var commonOptions = {};
    var method;
    var url;

    if (arguments.length) {
      for (var i = 0; i < arguments.length; i++) {
        if (Array.isArray(arguments[i])) {
          que = que.concat(arguments[i]);
        } else {
          que.push(arguments[i]);
        }
      }
    }

    que.forEach(function (qItem, qIdx) {
      if (typeof (qItem) === 'string') {
        if ((/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)(:+)/i).test(qItem)) {
          method = qItem.split(':')[0];
          url = qItem.replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)(:+)/i, '');
          if (url) {
            qItem = {
              url: url,
              method: method
            };
          } else {
            commonOptions['method'] = method;
          }
        } else {
          qItem = { url:qItem };
        }
        que[qIdx] = qItem;
      }
      if ((typeof (qItem) === 'object') && (!qItem['url'])) {
        commonOptions = _extend(commonOptions, qItem);
      }
    });

    var apiQue = [];
    que.forEach(function (qItem) {
      if ((_isObj(qItem) && qItem['url']) && (!_isDeferred(qItem))) {
        apiQue.push(_xhr(_extend({}, commonOptions, qItem)));
      } else if (_isDeferred(qItem)) {
        apiQue.push(qItem);
      } else {
        apiQue.push(_defer( qItem ));
      }
    });

    return new XHRQ(apiQue);
  }
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  /* The Core XHR Base Class */
  function XHR (options) {
    Object.defineProperty(this, 'fnQ', { value:{ then:[], fail:[], done:[] } });
    this.xhr        = new XMLHttpRequest();
    this.reqOptions = options;
    this.isPending  = true;
    this.isSuccess  = false;
    this.isFailed   = false;
    this.response   = '';
    this.prevFnRes;
  }
  /* Attaching chain functions to XHR Class */
  Object.defineProperties(XHR.prototype, {
    then   : { value: _onXhrSuccess },
    fail   : { value: _onXhrError   },
    catch  : { value: _onXhrError   },
    done   : { value: _onXhrAlways  },
    always : { value: _onXhrAlways  },
    finally: { value: _onXhrAlways  }
  });
  function _registerXHRChainFn (xXHR, fnType, fn) {
    var thisXHR = xXHR, nxtFnArg0;
    if (typeof fn === 'function') {
      var isXHRComplete = (!thisXHR.isPending);
      if (fnType === 'then') {
        isXHRComplete = (isXHRComplete && thisXHR.isSuccess);
      } else if (fnType === 'fail') {
        isXHRComplete = (isXHRComplete && thisXHR.isFailed);
      }
      if (isXHRComplete) {
        if (thisXHR.isFailed) {
          nxtFnArg0 = (typeof thisXHR.prevFnRes === 'undefined')? thisXHR : thisXHR.prevFnRes;
          thisXHR.prevFnRes = fn.call(thisXHR.reqOptions, nxtFnArg0, thisXHR.statusText, thisXHR.statusMessage, thisXHR.response);
        } else {
          nxtFnArg0 = (typeof thisXHR.prevFnRes === 'undefined')? thisXHR.response : thisXHR.prevFnRes;
          thisXHR.prevFnRes = fn.call(thisXHR.reqOptions, nxtFnArg0, thisXHR.statusText, thisXHR, thisXHR.response);
        }
        if (_isDeferred(thisXHR.prevFnRes)) {
          thisXHR = thisXHR.prevFnRes;
        }
      } else {
        thisXHR.fnQ[fnType].push(fn);
      }
    }
    return thisXHR;
  }
  /* Internal function to handle .then( function ) */
  function _onXhrSuccess (fn) {
    return _registerXHRChainFn(this, 'then', fn);
  }
  /* Internal function to handle .fail( function ) | .catch( function ) */
  function _onXhrError (fn) {
    return _registerXHRChainFn(this, 'fail', fn);
  }
  /* Internal function to handle .done( function ) | .always( function ) | .finally( function ) */
  function _onXhrAlways (fn) {
    return _registerXHRChainFn(this, 'done', fn);
  }

  // ---------------------------------------------------------
  var _xhrProps = {
    defaults : {
      dataType     : 'text', // text, html, css, csv, xml, json, pdf, script, zip // responseType
      async        : true,   // true | false
      cache        : false,  // true | false
      method       : 'GET',  // GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
      headers      : {},     // {key: 'value'} or function which returns {key: 'value'}
      auth         : null,   // { user: '', pwd: ''},
      timeout      : 0,      // 0=No Timeout; in milliseconds
      success      : null,   // function(response, statusCode, XHR) {}
      error        : null,   // function(response, statusCode, XHR) {}
      finally      : null    // function(response, statusCode, XHR) {}

      // ,preFilter   : false   // function(finalReqOptions, originalReqOptions, XHR){}
      // ,dataFilter  : false   // function(responseText, dataType){}
      // ,beforeSend  : function(rawXHR, finalReqOptions){} // to be used to set headers or cancel the request

      // ,urlParams     : {}
      // ,data          : {}  // payload
      // ,defaultPayload: {}  // {key: 'value'} or function which returns {key: 'value'}
      // ,defaultHeaders: {}  // {key: 'value'} or function which returns {key: 'value'}

      // ,onAbort           : function(event, XHR) {}
      // ,onError           : function(event, XHR) {}
      // ,onLoad            : function(event, XHR) {}
      // ,onLoadEnd         : function(event, XHR) {}
      // ,onLoadStart       : function(event, XHR) {}
      // ,onProgress        : function(event, XHR) {}
      // ,onReadyStateChange: function(event, XHR) {}
      // ,onTimeout         : function(event, XHR) {}
    },

    dataParsers : {
      css: _cssParser,
      json: _jsonParser,
      script: _scriptParser,
      javascript: _scriptParser
    },

    urls   : {},

    url    : _xhrUrl,
    setup  : _setupGlobalXHRDefaults,
    preFilter: _setupPreFilter,

    get   : function () {
      _arrProto.unshift.call(arguments, 'get');
      return _xhr.apply(undefined, arguments);
    },
    post  : function () {
      _arrProto.unshift.call(arguments, 'post');
      return _xhr.apply(undefined, arguments);
    },
    put   : function () {
      _arrProto.unshift.call(arguments, 'put');
      return _xhr.apply(undefined, arguments);
    },
    del   : function () {
      _arrProto.unshift.call(arguments, 'delete');
      return _xhr.apply(undefined, arguments);
    },
    patch : function () {
      _arrProto.unshift.call(arguments, 'patch');
      return _xhr.apply(undefined, arguments);
    },
    head : function () {
      _arrProto.unshift.call(arguments, 'head');
      return _xhr.apply(undefined, arguments);
    },
    options : function () {
      _arrProto.unshift.call(arguments, 'options');
      return _xhr.apply(undefined, arguments);
    }
  };

  var roKeys = 'url,setup,converters,preFilter,get,post,put,del,patch,head,options'.split(',');
  function _setupGlobalXHRDefaults ( newDefaults ) {
    if (_isObj(newDefaults)) {
      Object.keys(newDefaults).forEach(function(key){
        if (roKeys.indexOf(key)<0) {
          switch(key) {
            case 'dataParsers':
            case 'urls':
              if (_isObj(newDefaults[key])) {
                Object.keys(newDefaults[key]).forEach(function(parserKey){
                  _xhrProps[key][parserKey] = newDefaults[key][parserKey];
                });
              }
              break;
            default:
              _xhrProps.defaults[key] = newDefaults[key];
            break;
          }
        }
      });
    }
  }
  function _setupPreFilter( preFilterFn ) {
    if (_isFn(preFilterFn)) {
      _xhrProps.defaults['preFilter'] = preFilterFn;
    }
  }
  function _getOptionalVal(options, key){
    var optValue;
    if (_hasOwnProp(options, key)) {
      optValue = options[key];
    } else {
      optValue = _xhrProps.defaults[key];
    }
    return optValue;
  }

  function _cssParser ( srcCss ) {
    var styleText = document.createTextNode( srcCss );
    var styleNode = document.createElement( 'style' );
    styleNode.setAttribute( 'id', 'css-'+((new Date()).getTime()));
    styleNode.setAttribute( 'type', 'text/css');
    styleNode.appendChild(styleText);
    document.head.appendChild( styleNode );
    return srcCss;
  }
  function _jsonParser ( srcStr ) {
    var retObj = srcStr;
    try {
      retObj = JSON.parse(srcStr);
    } catch(e) {}
    return retObj;
  }
  function _scriptParser ( srcScript ) {
    if (srcScript.trim()) {
      var xScript = document.createElement( "script" );
      xScript.setAttribute( 'id', 'js-'+((new Date()).getTime()));
      xScript.text = srcScript;
      document.head.appendChild( xScript ).parentNode.removeChild( xScript );
    }
    return srcScript;
  }

  var httpStatus = {
    '200' : 'OK',
    '301' : 'Moved Permanently',
    '400' : 'Bad Request',
    '403' : 'Forbidden',
    '404' : 'Not Found',
    '405' : 'Method Not Allowed',
    '406' : 'Not Acceptable',
    '407' : 'Proxy Authentication Required',
    '408' : 'Request Timeout',
    '413' : 'Payload Too Large',
    '414' : 'URI Too Long',
    '415' : 'Unsupported Media Type',
    '429' : 'Too Many Requests',
    '431' : 'Request Header Fields Too Large',
    '500' : 'Internal Server Error',
    '502' : 'Bad Gateway',
    '503' : 'Service Unavailable',
    '504' : 'Gateway Timeout',
    '505' : 'HTTP Version Not Supported',
    '511' : 'Network Authentication Required'
  };

  var contentTypes = { text:'text/plain', html:'text/html', css:'text/css'
    , style:'text/css', csv:'text/csv', xml:'text/xml'
    , json:'application/json', pdf:'application/pdf', script:'application/javascript'
    , spacomponent:'application/javascript', zip:'application/zip' };

  /* URL Processing for any parameter replacement with object */
  /**
   * @param {string} url
   *
   * @example
   * xhr.url( '//127.0.0.1:1001/service-api/auth' )
   *         ==> '//127.0.0.1:1001/service-api/auth'
   *
   * xhr.url( '//127.0.0.1:1001/service-api/auth/{sesID}' )
   *         ==> '//127.0.0.1:1001/service-api/auth/{sesID}'
   *
   * xhr.url( '//127.0.0.1:1001/service-api/auth/{sesID}', {sesID: '12345-abcd-0000-xyz'} )
   *         ==> '//127.0.0.1:1001/auth/12345-abcd-0000-xyz'
   *
   * xhr.url( '//127.0.0.1:1001/service-api/auth/{ sesID }', {sesID: '12345-abcd-0000-xyz'} )
   *         ==> '//127.0.0.1:1001/auth/12345-abcd-0000-xyz'
   *
   * xhr.url( '//127.0.0.1:1001/service-api/auth/{ userInfo.sesID }', {userInfo: {sesID: '12345-abcd-0000-xyz'}} )
   *         ==> '//127.0.0.1:1001/auth/12345-abcd-0000-xyz'
   *
   * xhr.url( '//127.0.0.1:1001/service-api/auth/{ *sesID }', {userInfo: {sesID: '12345-abcd-0000-xyz'}} )
   *         ==> '//127.0.0.1:1001/auth/12345-abcd-0000-xyz'
   *
   */
  function _xhrUrl (url) {

    var lookUpUrl = (String(url || '')[0] === '@');
    url = String(url || '').replace(/^[@\s]+/, ''); //trimLeft @\s

    var finalUrl = lookUpUrl ? (_xhrProps.urls[url] || _findInX(_xhrProps.urls, url, url)) : url;
    var urlParamsDataCollection = _argsToArr(arguments, 1).map(function (obj) { return _is(obj, 'object|array') ? obj : {}; });
    var urlParams;
    var pKey;
    var pValue;

    urlParamsDataCollection = _mergeDeep.apply(null, urlParamsDataCollection);
    if (Object.keys(urlParamsDataCollection).length && (finalUrl.indexOf('{') > -1)) {
      urlParams = _strExtract(finalUrl, '{', '}', true);
      urlParams.forEach(function (param) {
        pKey     = param.replace(/[{}<>]/g, '');
        pValue   = _findInX(urlParamsDataCollection, pKey, urlParamsDataCollection['_undefined']);
        finalUrl = finalUrl.replace(new RegExp(param.replace(/([^a-zA-Z0-9])/g, '\\$1'), 'g'), pValue);
      });
    }
    return finalUrl;
  }

  function _xhr () {

    if (!arguments.length) {
      return _xhrQ.apply(null, []);
    } else if ((arguments.length === 2) && _isStr(arguments[0]) && (!(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/i).test(arguments[0])) && _isObj(arguments[1]) && !_hasOwnProp(arguments[1], 'url')) {
      // for jQ.ajax(url, {})
      var nOptions    = arguments[1];
      nOptions['url'] = arguments[0];
      return _xhr( nOptions );
    } else if (arguments.length > 1 || Array.isArray(arguments[0])) {
      return _xhrQ.apply(null, arguments);
    } else if (_isDeferred(arguments[0])) {
      return arguments[0];
    }

    // updating axOptions
    var iOptions = (_isObj(arguments[0])) ? arguments[0] : ((_isStr(arguments[0])) ? { url:arguments[0] } : {});

    var axDefaultsBase  = {};

    var skipDefaultsKeys = [];
    /** skipDefaults: true ==> ['payload','headers']
     *  skipDefaults: 'payload,headers' or ['payload', 'headers']
     *  skipDefaults: 'payload' or ['payload']
     *  skipDefaults: 'headers' or ['headers']
     */
    if (iOptions['skipDefaults']) {
      skipDefaultsKeys = iOptions['skipDefaults'];
      if (typeof (skipDefaultsKeys) === 'string') {
        skipDefaultsKeys = skipDefaultsKeys.split(',');
      } else if (typeof (skipDefaultsKeys) === 'boolean') {
        skipDefaultsKeys = ['payload','headers'];
      }

      if (Array.isArray(skipDefaultsKeys) && skipDefaultsKeys.length) {
        skipDefaultsKeys = skipDefaultsKeys.map(function (sKey) {
          sKey = sKey.replace(/default/gi, '').trim();
          return sKey? ('default'+ (sKey[0].toUpperCase()) + (sKey.slice(1))) : '';
        });
        Object.keys(_xhrProps.defaults).forEach(function (key) {
          if (skipDefaultsKeys.indexOf(key) < 0) {
            axDefaultsBase[key] = _xhrProps.defaults[key];
          }
        });
      } else {
        skipDefaultsKeys = [];
        axDefaultsBase = _extend({}, _xhrProps.defaults);
      }
    } else {
      axDefaultsBase = _extend({}, _xhrProps.defaults);
    }
    axDefaultsBase['method'] =  iOptions['method'] || iOptions['type'] || _xhrProps.defaults['method'];

    var axOptions = _extend({}, axDefaultsBase, iOptions);
    if (!axOptions.url) {
      console.error('XHR without URL.', arguments, axOptions);
      return;
    }
    axOptions.type = axOptions.method = axOptions.method.toUpperCase();

    var axResType     = axOptions.dataType.toLowerCase();
    var axContentType = contentTypes[ axResType ] || ( (axResType && (axResType.indexOf('/')<-1))? ('text/'+axOptions.dataType) : axOptions.dataType );
    var axHeaders     = {};

    // Headers
    var axDefaultHeaders = axOptions['defaultHeaders'];
    if (_isFn(axDefaultHeaders)) {
      axDefaultHeaders = axDefaultHeaders.call(axOptions, axOptions);
    }
    if (_isFn(axOptions.headers)) {
      axOptions.headers = axOptions.headers.call(undefined, axOptions);
    }
    if (_isObj(axOptions.headers)) {
      Object.keys(axOptions.headers).forEach(function (oKey) {
        axHeaders[oKey] = axOptions.headers[oKey];
      });
    }
    if (_isObj(axDefaultHeaders)) {
      if (_isUndef(axHeaders)) {
        axHeaders = axDefaultHeaders;
      } else if (_isObj(axHeaders)) {
        axHeaders = _extend(axDefaultHeaders, axHeaders);
      }
    }

    if (!axHeaders.hasOwnProperty('Content-Type') && axContentType) {
      axHeaders['Content-Type'] = axContentType;
    }
    axHeaders['X-Requested-With'] = 'XMLHttpRequest';
    axHeaders['Cache-Control'] = axOptions.cache ? 'max-age=86400000' : 'no-cache, no-store, must-revalidate, max-age=0';
    axHeaders['Expires']       = axOptions.cache ? ((new Date( (new Date()).setDate( (new Date()).getDate() + 1 ) )).toUTCString()) : '0';
    if (!axOptions.cache) {
      axHeaders['Pragma'] = 'no-cache';
    }
    axOptions['headers'] = axHeaders;

    // ----------------------------------------------------------------------
    // Create new HTTP Request Object
    var axReq       = new XHR(axOptions);
    var xhr         = axReq.xhr;
    var _reqOptions = axReq.reqOptions;
    var _fnQ        = axReq.fnQ;
    var timeoutTimer;
    var isTimeout;
    var isAborted;
    var isCanceled;
    var tX;

    if (_isFn(_reqOptions.success)) {
      _fnQ.then.push(_reqOptions.success);
    }
    if (_isFn(_reqOptions.error)) {
      _fnQ.fail.push(_reqOptions.error);
    }
    if (_isFn(_reqOptions.finally)) {
      _fnQ.done.push(_reqOptions.finally);
    }

    var onReadyStateChange;
    // Attach events
    Object.keys(_reqOptions).forEach(function (oKey) {
      var eName = oKey.toLowerCase();
      if ((eName === 'onreadystatechange') && (_isFn(_reqOptions[oKey]))) {
        onReadyStateChange = _reqOptions[oKey];
      } else if ((eName.indexOf('on') === 0) && (_isFn(_reqOptions[oKey]))) {
        xhr[eName] = function (e) {
          _reqOptions[oKey].call(xhr, e, axReq);
        };
      }
    });

    // Setup listener to process request state changes
    function _xhrReadyStateChange (e) {

      var thisXhrRaw = this;
      var xhrStatus  = thisXhrRaw.status;

      if (onReadyStateChange) {
        onReadyStateChange.call(_reqOptions, thisXhrRaw, e);
      }

      // Only run if the request is complete else return
      if (!isAborted && !isCanceled && thisXhrRaw.readyState !== 4) return;

      axReq.isPending    = false;
      axReq.readyState   = thisXhrRaw.readyState;
      axReq.status       = thisXhrRaw.status;
      axReq.responseText = thisXhrRaw.responseText;
      axReq.response     = thisXhrRaw.responseText;

      var xhrResponse   = thisXhrRaw.responseText;

      function _runFn (fnType) {
        var fnList = _fnQ[fnType], nxtFnArg0;

        while (fnList.length > 0) {
          try {
            if (axReq.isFailed) {
              nxtFnArg0 = (typeof axReq.prevFnRes === 'undefined')? axReq : axReq.prevFnRes;
              axReq.prevFnRes = (fnList.shift()).call(_reqOptions, nxtFnArg0, axReq.statusText, axReq.statusMessage, axReq.response);
            } else {
              nxtFnArg0 = (typeof axReq.prevFnRes === 'undefined')? axReq.response : axReq.prevFnRes;
              axReq.prevFnRes = (fnList.shift()).call(_reqOptions, nxtFnArg0, axReq.statusText, axReq, axReq.response);
            }
            _shiftFnsToNxtPromise(axReq, axReq.prevFnRes, fnType);
          } catch (e) {
            console.error('Function Execution Error.', e);
          }
        }
      }

      // Process response data
      if ((xhrStatus >= 200 && xhrStatus < 300) || (xhrStatus === 304)) {
        axReq.isSuccess  = true;
        axReq.statusText = 'success';
        axReq.statusMessage = 'OK';

        var dataParser, parsedResponse;
        if (_hasOwnProp(_reqOptions, 'dataParser')) {
          dataParser = _reqOptions.dataParser;
        } else {
          dataParser = _xhrProps.dataParsers[ axResType ];
        }
        if (dataParser && _isFn(dataParser)) {
          try {
            parsedResponse = dataParser(xhrResponse, axResType);
          } catch (e) {
            console.warn('dataParsing failed.', xhrResponse, axReq, e);
          }
        }
        if (!_isUndef(parsedResponse)) {
          xhrResponse = parsedResponse;
        }

        var dataFilter = _getOptionalVal(_reqOptions, 'dataFilter'), dataFilterResponse;
        if (dataFilter && _isFn(dataFilter)) {
          try {
            dataFilterResponse = dataFilter.call(axReq, xhrResponse, axResType);
          } catch (e) {
            console.warn('dataFilter failed.', xhrResponse, axReq, e);
          }
        }
        if (!_isUndef(dataFilterResponse)) {
          xhrResponse = dataFilterResponse;
        }

        if (axResType === 'json') {
          axReq.responseJSON = xhrResponse;
        }
      } else {
        xhrResponse         = thisXhrRaw.responseText;
        axReq.isFailed      = true;
        if (timeoutTimer && isTimeout) {
          axReq.statusText    = 'timeout';
          axReq.statusMessage = 'timeout';
        } else if (isAborted) {
          axReq.statusText    = 'abort';
          axReq.statusMessage = 'abort';
        } else if (isCanceled) {
          axReq.statusText    = 'canceled';
          axReq.statusMessage = 'canceled';
        } else {
          axReq.statusText    = 'error';
          axReq.statusMessage = httpStatus[xhrStatus] || 'Unknown Error';
        }
      }
      axReq.response  = xhrResponse;

      if (axReq.isSuccess) {
        // This will run when the request is successful
        _runFn('then');
      } else if (axReq.isFailed) {
        // This will run when the request is failed
        _runFn('fail');
      }
      // This will run always
      _runFn('done');

      _clearTimer([timeoutTimer, tX]);
    }
    xhr.onreadystatechange = _xhrReadyStateChange;

    // request payload
    var axDefaultPayload = _reqOptions['defaultPayload'];
    if (_isFn(axDefaultPayload)) {
      axDefaultPayload = axDefaultPayload.call(_reqOptions, _reqOptions);
    }
    var axPayload = _reqOptions['data'];
    if (_isObj(axDefaultPayload)) {
      if (_isUndef(axPayload)) {
        axPayload = axDefaultPayload;
      } else if (_isObj(axPayload)) {
        axPayload = _mergeDeep(axDefaultPayload, axPayload);
      }
    }
    _reqOptions['data'] = axPayload;

    // preFilter
    var preFilter = _getOptionalVal(_reqOptions, 'preFilter');
    if (preFilter && _isFn(preFilter)) {
      preFilter.call(axReq, _reqOptions, _extend({}, _reqOptions), axReq);
    }
    //update with preFiltered options
    var _axUrl = _xhrUrl(_reqOptions.url, _reqOptions['urlParams'], _reqOptions['data']);
    if ((/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)(:+)/i).test(_axUrl)) {
      _reqOptions['method'] = _axUrl.split(':')[0].toUpperCase();
      _axUrl = _axUrl.replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)(:+)/i, '');
    }
    _reqOptions.url = _axUrl;

    var _axMethod = _reqOptions['method'] = _reqOptions['method'].toUpperCase();
    var _axCache  = _reqOptions['cache'];

    axPayload = _reqOptions['data'];

    if (!_axCache) {
      //append timestamp to request
      var _ts = (new Date()).getTime();
      _reqOptions['headers']['X-T-'+_ts] = _ts;
      if (_axMethod === 'GET') {
        _axUrl += ((_axUrl.indexOf('?') < 0) ? '?' : ((/\?$|&$/.test(_axUrl)) ? '' : '&')) + ('_='+_ts);
      }
    }
    // GET request with payload!
    if (_axMethod === 'GET' && axPayload) {
      axPayload = _toQueryString(axPayload);
      if (axPayload) {
        // Append to URL
        _axUrl += ((_axUrl.indexOf('?') < 0) ? '?' : ((/\?$|&$/.test(_axUrl)) ? '' : '&')) + axPayload;
      }
    }

    // Open request
    // The first argument is the post type (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
    // The second argument is the endpoint URL
    // The third argument is async: true/false
    try {
      if (_reqOptions.auth && (_isObj(_reqOptions.auth))) {
        if (_reqOptions.auth.hasOwnProperty('user')) {
          if (_reqOptions.auth.hasOwnProperty('pwd')) {
            xhr.open(_axMethod, _axUrl, _reqOptions.async, _reqOptions.auth.user, _reqOptions.auth.pwd);
          } else {
            xhr.open(_axMethod, _axUrl, _reqOptions.async, _reqOptions.auth.user);
          }
        }
      } else {
        xhr.open(_axMethod, _axUrl, _reqOptions.async);
      }

      // beforeSend - use this to set/update request headers or cancel the request
      var beforeSend = _getOptionalVal(_reqOptions, 'beforeSend'), ok2Send = true;
      if (beforeSend && _isFn(beforeSend)) {
        try {
          ok2Send = beforeSend.call(xhr, xhr, _reqOptions);
          ok2Send = ok2Send || (_isUndef(ok2Send));
          axPayload = _reqOptions['data'];
        } catch (e) {
          ok2Send = false;
          console.warn('beforeSend function failed.', e, axReq);
        }
      }

      if (ok2Send) {
        // Set Request Headers
        var xhrHeaders = _reqOptions['headers'];
        if (_isObj(xhrHeaders)) {
          Object.keys(xhrHeaders).forEach(function (oKey) {
            xhr.setRequestHeader(oKey, xhrHeaders[oKey]);
          });
        }

        // Setup timeout
        if (_reqOptions.timeout) {
          xhr.timeout = _reqOptions.timeout;
          timeoutTimer = setTimeout(function(){
            isTimeout = true;
            if (axReq.isPending && (xhr.readyState>0 && xhr.readyState<4)) {
              xhr.abort();
            }
          }, _reqOptions.timeout);
        }

        // Send with Payload
        if ((_axMethod !== 'GET') && axPayload) {
          axPayload = (_isStr(axPayload)) ? axPayload : JSON.stringify(axPayload);
          if (_reqOptions.async) {
            tX = setTimeout(function () { xhr.send(axPayload); }, _defaultDeferTime);
          } else {
            xhr.send(axPayload);
          }
        } else {
          if (_reqOptions.async) {
            tX = setTimeout(function () { xhr.send(); }, _defaultDeferTime);
          } else {
            xhr.send();
          }
        }
      } else {
        isCanceled = true;
        xhr.abort();
        _xhrReadyStateChange();
      }

    } catch (e) {
      console.warn('XHR-Exception', xhr, e);
    }

    return axReq;
  }
  _fnProps(_xhr, _xhrProps);

  //------------------------
  var exportMethods = {
    ajax : _xhr,
    ajaxQ: _xhrQ,
    when : _xhrQ,
    defer: _xhrQ,
    ajaxSetup: _setupGlobalXHRDefaults,
    ajaxPrefilter: _setupPreFilter
  };
  function xhrLib() {
    return _xhrQ.apply(_gContext, _argsToArr(arguments));
  }
  _fnProps(xhrLib, exportMethods);
  //------------------------
  _gContext['spaXHR'] = xhrLib;
})(this);