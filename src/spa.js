/*@license SPA.js (core) [MIT]*/
/* ============================================================================
 * SPA.js is the collection of javascript functions which simplifies
 * the interfaces for Single Page Application (SPA) development.
 *
 * Dependency: (hard)
 * 1. jQuery: http://jquery.com/
 * 2. handlebars: http://handlebarsjs.com/ || https://github.com/wycats/handlebars.js/
 *
 * THIS CODE LICENSE: The MIT License (MIT)

  Copyright (c) 2003 <Kumararaja>

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

(function() {
  var _VERSION = '2.80.0';

  /* Establish the win object, `window` in the browser */
  var win = this, _doc = document, isSPAReady;

  /* Create SPA */
  var xsr = function(){};
  /* Expose to global with alias */
  win.spa = win.xsr = win.__ = win._$ = xsr;

//  var xhrLib = ($['ajax'] && $)  || spaXHR;
//  var $when  = xhrLib.when;
//  var $ajax  = xhrLib.ajax;
//  var $ajaxQ = xhrLib.when;
//  var $ajaxSetup = xhrLib.ajaxSetup;
//  var $ajaxPrefilter = xhrLib.ajaxPrefilter;
//  if ($ && !$['ajax']) { // extending jQ-slim
//    $.ajax  = $ajax;
//    $.ajaxQ = $ajaxQ;
//    $.ajaxSetup = $ajaxSetup;
//    $.ajaxPrefilter = $ajaxPrefilter;
//  }

  /* *************** SPA begins *************** */
  xsr.VERSION = _VERSION;

  var _objProto = Object.prototype;
  var _arrProto = Array.prototype;
  var _strProto = String.prototype;
  var _dtProto  = Date.prototype;

  // Creating new app scope
  var appVarType = _objProto.toString.call(window['app']).slice(8,-1).toLowerCase();
  if (window['app'] && (/^html(.*)element$/i.test(appVarType))) { //HTML Element id="app"
    window['app'] = {api:{}};
  }
  window['app'] = window['app'] || {api:{}};
  window['app']['api'] = window['app']['api'] || {};

  /* isIE or isNonIE */
  var ieVer = (function() {
    try {
      var ua = navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
    } catch (e) {};

    // other browser
    return 0;
  }());

  var isIE = (document['documentMode'] || ieVer)
    , isNonIE = !isIE;
  xsr.isIE = isIE;
  xsr.isNonIE = isNonIE;

  /*No Operation: a dummy function*/
  function noop(){};
  xsr.noop = noop;

  /* Avoid 'console' errors in browsers that lack a console */
  (function() {
    var method;
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
        console[method] = function(){};
      }
    }

    if (!('none' in window)) window['none'] = '';
    if (!('noop' in window)) window['noop'] = function(){};
  }());

  /* IE 9+ Polyfills*/
  // Element.closest()
  (function(){
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                  Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  })();

  // Element.get/set-Attribute
  function _attr(el, aN, aV){
    if (_isEl(el)) {
      if (arguments.length == 3) {
        el.setAttribute(aN, aV);
        return el;
      } else {
        return el.getAttribute(aN);
      }
    }
  }

  var _appApiInitialized;
  var _reservedObjKeys = 'hasOwnProperty,prototype,__proto__'.split(',');
  function _isReservedKey (key) {
    return (_reservedObjKeys.indexOf(key) > -1);
  }
  function _hasOwnProp (xObj, xKey) {
    return _objProto.hasOwnProperty.call(xObj, xKey);
  }
  function _argsToArr( fromX ){
    return _arrProto.slice.call( fromX );
  }

  xsr.debug = false;
  xsr['debugger'] = {
      on:function(){ xsr.debug = true; }
    , off:function(){ xsr.debug = false; }
    , toggle:function() { xsr.debug = !xsr.debug; }
  };
  /*Internal console out*/
  function cOut(consoleType, args){
    if (xsr.debug && console[consoleType]) {
      console[consoleType].apply(null, args);
    }
  }
  var _log = {
      'clear'         : function(){ console['clear'](); }
    , 'assert'        : function(){ cOut('assert',         _argsToArr(arguments)); }
    , 'count'         : function(){ cOut('count',          _argsToArr(arguments)); }
    , 'debug'         : function(){ cOut('debug',          _argsToArr(arguments)); }
    , 'dir'           : function(){ cOut('dir',            _argsToArr(arguments)); }
    , 'dirxml'        : function(){ cOut('dirxml',         _argsToArr(arguments)); }
    , 'error'         : function(){ cOut('error',          _argsToArr(arguments)); }
    , 'exception'     : function(){ cOut('exception',      _argsToArr(arguments)); }
    , 'group'         : function(){ cOut('group',          _argsToArr(arguments)); }
    , 'groupCollapsed': function(){ cOut('groupCollapsed', _argsToArr(arguments)); }
    , 'groupEnd'      : function(){ cOut('groupEnd',       _argsToArr(arguments)); }
    , 'info'          : function(){ cOut('info',           _argsToArr(arguments)); }
    , 'log'           : function(){ cOut('log',            _argsToArr(arguments)); }
    , 'markTimeline'  : function(){ cOut('markTimeline',   _argsToArr(arguments)); }
    , 'profile'       : function(){ cOut('profile',        _argsToArr(arguments)); }
    , 'profileEnd'    : function(){ cOut('profileEnd',     _argsToArr(arguments)); }
    , 'table'         : function(){ cOut('table',          _argsToArr(arguments)); }
    , 'time'          : function(){ cOut('time',           _argsToArr(arguments)); }
    , 'timeEnd'       : function(){ cOut('timeEnd',        _argsToArr(arguments)); }
    , 'timeStamp'     : function(){ cOut('timeStamp',      _argsToArr(arguments)); }
    , 'trace'         : function(){ cOut('trace',          _argsToArr(arguments)); }
    , 'warn'          : function(){ cOut('warn',           _argsToArr(arguments)); }
  };
  xsr['console'] = _log;

  /* event handler for window.onhashchange */
  xsr.ajaxPreProcess;
  xsr.onInit;
  xsr.onInitComplete;
  xsr.onReady;
  xsr.onUrlChange;
  xsr.onUrlHashChange;
  xsr.onReload;

  if (_dtProto) {
    /* **********************Date prototypes*********************** */
    /* var now = new Date(); //if Mon Mar 01 2010 10:20:30
     *
     * now.yyyymmdd()    => '20100301'
     * now.yyyymmdd('/') => '2010/03/01'
     * now.yyyymmdd('-') => '2010-03-01'
     */
    _dtProto.yyyymmdd = function(sep) {
      var mm = this.getMonth() + 1, dd = this.getDate();
      return ([this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join(sep||''));
    };
    /* var now = new Date(); //if Mon Mar 01 2010 10:20:30
     *
     * now.hhmmss()    => '102030'
     * now.hhmmss(':') => '10:20:30'
     * now.hhmmss('-') => '10-20-30'
     */
    _dtProto.hhmmss = function(sep) {
      var hh = this.getHours(), mm = this.getMinutes(), ss = this.getSeconds();
      return ([(hh>9 ? '' : '0') + hh,
               (mm>9 ? '' : '0') + mm,
               (ss>9 ? '' : '0') + ss
             ].join(sep||''));
    };
  }

  if (_strProto) {
    /* **********************String prototypes*********************** */
    /* "   some string   ".trimLeftStr()    ==> "some string   "
     * "+++some string+++".trimLeftStr('+') ==> "some string+++"
     */
    _strProto.trimLeftStr = function (tStr) {
      return ((''+this).replace(new RegExp("^[" + (tStr || "\\s")+"]+", "g"), ""));
    };

    /* "   some string   ".trimRightStr()    ==> "   some string"
     * "+++some string+++".trimRightStr('+') ==> "+++some string"
     */
    _strProto.trimRightStr = function (tStr) {
      return ((''+this).replace(new RegExp("["+ (tStr || "\\s") + "]+$", "g"), ""));
    };

    /* "   some string   ".trimStr()    ==> "some string"
     * "+++some string+++".trimStr('+') ==> "some string"
     */
    _strProto.trimStr = function (tStr) {
      return (''+this).trimLeftStr(tStr).trimRightStr(tStr);
    };

    _strProto.getLeftStr = function (fromIndex) {
      if (typeof fromIndex === 'string') {
        fromIndex = (''+this).indexOf(fromIndex);
      }
      return (fromIndex)? (''+this).substr(0, fromIndex) : '';
    };

    _strProto.getRightStr = function (fromIndex) {
      var sLen = 1;
      if (typeof fromIndex === 'string') {
        sLen = fromIndex.length;
        fromIndex = (''+this).indexOf(fromIndex);
      }
      return (fromIndex<0)? '' : (''+this).substr(fromIndex+sLen);
    };

    _strProto.isBlankStr = function () {
      return ((''+this).trimStr() == "");
    };

    _strProto.ifBlankStr = function (forNullStr, forNotNullStr) {
      forNullStr    = (typeof forNullStr === "undefined")? '' : forNullStr;
      forNotNullStr = (typeof forNotNullStr === "undefined")? ((''+this).trimStr()) : forNotNullStr;
      return ((''+this).isBlankStr() ? ( forNullStr ) : ( forNotNullStr ) );
    };

    _strProto.isNumberStr = function () {
      var inStr = (''+this).trim(), nonNumStr = ((inStr.replace(/[0-9]/g, "").replace('.','')).trimStr()), sign = inStr[0];
      return (inStr && ((nonNumStr.length == 0) || ((nonNumStr.length == 1) && ((sign=='+') || (sign=='-')))));
    };

    _strProto.normalizeStr = function () {
      return (''+this).trimStr().replace(/\s+/g, ' ');
    };

    _strProto.beginsWithStr = function (str, i) {
      i = (i) ? 'i' : '';
      var re = new RegExp('^' + str, i);
      return ((''+this).normalizeStr().match(re)) ? true : false;
    };

    _strProto.beginsWithStrIgnoreCase = function (str) {
      var re = new RegExp('^' + str, 'i');
      return ((''+this).normalizeStr().match(re)) ? true : false;
    };

    _strProto.endsWithStr = function (str, i) {
      i = (i) ? 'i' : '';
      var re = new RegExp(str + '$', i);
      return ((''+this).normalizeStr().match(re)) ? true : false;
    };

    _strProto.endsWithStrIgnoreCase = function (str) {
      var re = new RegExp(str + '$', 'i');
      return ((''+this).normalizeStr().match(re)) ? true : false;
    };

    _strProto.containsStr = function (str, i) {
      i = (i) ? 'gi' : 'g';
      var re = new RegExp('' + str, i);
      return ((re).test((''+this)));
    };

    _strProto.containsStrIgnoreCase = function (str) {
      var re = new RegExp('' + str, 'gi');
      return ((re).test((''+this)));
    };

    _strProto.equals = function (arg) {
      return ((''+this) == arg);
    };

    _strProto.equalsIgnoreCase = function (arg) {
      return ((String((''+this).toLowerCase()) == (String(arg)).toLowerCase()));
    };

    _strProto.toProperCase = function (normalizeSrc) {
      return ( (((typeof normalizeSrc == "undefined") ||  normalizeSrc)? ((''+this).normalizeStr()) : (''+this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();
      }));
    };

    _strProto.toTitleCase = function (normalizeSrc) {
      return ( (((typeof normalizeSrc == "undefined") ||  normalizeSrc)? ((''+this).normalizeStr()) : (''+this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();
      }));
    };

    _strProto.capitalize = function () {
      return ((''+this).charAt(0).toUpperCase()) + ((''+this).slice(1));
    };

    _strProto.unCapitalize = function () {
      return ((''+this).charAt(0).toLowerCase()) + ((''+this).slice(1));
    };

    function _sanitizeHTML(str) {
      var sBoxEl = document.createElement('div');
      sBoxEl.textContent = str;
      return sBoxEl.innerHTML;
    }
    _strProto.sanitizeHTML = function(){
      return _sanitizeHTML(''+this);
    };
    xsr.sanitizeHTML = _sanitizeHTML;

    function _sanitizeScript(str) {
      return (''+str).replace(/<\s*\/+\s*(\bscript\b)/gi, '&lt;/script&gt;</pre')
                .replace(/<\s*(\bscript\b)/gi, '<pre>&lt;script');
    }
    _strProto.sanitizeScript = function(){
      return _sanitizeScript(''+this);
    };
    xsr.sanitizeScript = _sanitizeScript;

    function _sanitizeXSS(str) {
      return _sanitizeScript(str).replace(/\s+on([a-z])\s*=/gi, ' on=').replace(/javascript:/gi,'js:');
    }
    _strProto.sanitizeXSS = function(){
      return _sanitizeXSS(''+this);
    };
    xsr.sanitizeXSS = _sanitizeXSS;

    /*
     * ''.split()        ==> [""]
     * ''.splitToArray() ==> []
     */
    _strProto.splitToArray = _strProto.toArray = function (splitBy) {
      return _isBlank((''+this)) ? [] : ((''+this).split(splitBy));
    };

    function _getMatchStr(str){
      switch(str){
        case '{': return '}';
        case '[': return ']';
        case '<': return '>';
        default: return str;
      }
    }

    _strProto.extractStrBetweenIn = function (bS, eS, unique) {
      if (!bS) {
        bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
        bS = (bS)? bS[0] : '';
      }
      eS = eS || _getMatchStr(bS);
      var retArr = (''+this).match(RegExp('\\'+bS+'([^\\'+bS+'\\'+eS+'].*?)\\'+eS, 'g')) || [];
      if (unique && !_isBlank(retArr)) retArr = retArr.__unique();
      return retArr;
    };

    _strProto.extractStrBetweenEx = function (bS, eS, unique) {
      if (!bS) {
        bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
        bS = (bS)? bS[0] : '';
      }
      eS = eS || _getMatchStr(bS);
      var rxStr = '\\'+bS+'\\'+eS, rx = new RegExp('['+rxStr+']', 'g');
      var retArr = ((''+this).match(new RegExp('\\'+bS+'([^'+rxStr+'].*?)\\'+eS, 'g')) || []).map(function(x){
          return x.replace(rx,'');
        });
      if (unique && !_isBlank(retArr)) retArr = retArr.__unique();
      return retArr;
    };

    _strProto.toNative = function(){
      return _strToNative(''+this);
    };

    _strProto.toBoolean = function () {
      var retValue = true;
      switch ((''+this).trimStr().toLowerCase()) {
        case          '':
        case         '0':
        case        '-0':
        case       'nan':
        case      'null':
        case     'false':
        case 'undefined':
          retValue = false;
          break;
      }

      if (retValue) retValue = (!(''+this).trimStr().beginsWithStr('-'));
      return ( retValue );
    };

    /*
     * String.padStr([padString: String = " "], length: Integer=1, [type: Integer = 0]): String
     * Returns: the string with a padString padded on the left, right or both sides.
     * length: amount of characters that the string must have
     * padString: string that will be concatenated
     * type: specifies the side where the concatenation will happen, where: -1 = left, 1 = right and 0 = both sides
     */
    _strProto.padStr = function (s, l, t) {
      s = s || '';
      l = l || 1;
      t = t || 2;
      for (var ps = "", i = 0; i < l; i++) {
        ps += s;
      }
      return (((t === -1 || t === 2) ? ps : "") + (''+this) + ((t === 1 || t === 2) ? ps : ""));
    };

    _strProto.toObj = _strProto.toObject = _strProto.toJSON = function () {
      return _toObj(''+this);
    };

    /*
     * 'Name: {name}, Age: {age}'.bindData({name:'Test', Age:18}) ==> 'Name: Test, Age: 18'
     *
     * 'Name: <name>, Age: <age>'.bindData({name:'Test', Age:18}, '<', '>') ==> 'Name: Test, Age: 18'
     */
    _strProto.bindData = _strProto.bindWith = function (data) {
      return _bindData(''+this, data);
    };
  }

  function _bindData(xMsg, data, bStr, eStr){
    xMsg = (''+xMsg); bStr = bStr || '{'; eStr = eStr || '}';
    var varList = xsr.extractStrBetweenEx(xMsg, bStr, eStr, true);
    if (xMsg && !_isBlank(varList) && _isObj(data)) {
      _each(varList, function(key){
        xMsg = xMsg.replace((new RegExp(bStr+'\\s*('+(key.trim())+')\\s*'+eStr, 'g')), _find(data, key, ''));
      });
    }
    return xMsg;
  };

  function _strToNative(srcStr){
    var tStr = srcStr.trim();
    function isNumeric(){
      var nonNumericChars = tStr.replace(/[0-9]/g, '');
      if (tStr.length) {
        if (nonNumericChars.length) {
          return ((nonNumericChars == '-') || (nonNumericChars == '+') || (nonNumericChars == '.'));
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
    function isBoolean(){
      return (tStr=='true' || tStr=='false');
    }
    function isArray(){
      return (tStr[0]=='[' && tStr[tStr.length-1]==']');
    }
    function isObject(){
      return (tStr[0]=='{' && tStr[tStr.length-1]=='}');
    }
    switch (true) {
      case isNumeric() : return tStr*1;
      case isBoolean() : return (tStr == 'true');
      case isObject()  : return tStr.toJSON();
      case isArray()   : return ('{xArr:'+tStr+'}').toJSON().xArr;
      default: return srcStr;
    }
  }

  xsr.strToNative = _strToNative;

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['{param1}','{param2}','{param3}','{param1}']
  //unique: true  ==> ['{param1}','{param2}','{param3}']
  xsr.extractStrBetweenIn = function (srcStr, bS, eS, unique){
    return (srcStr||'').extractStrBetweenIn(bS, eS, unique);
  };

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['param1','param2','param3','param1']
  //unique: true  ==> ['param1','param2','param3']
  xsr.extractStrBetweenEx = function (srcStr, bS, eS, unique){
    return (srcStr||'').extractStrBetweenEx(bS, eS, unique);
  };

  /*
   * xsr.strToArray('')         ==> [""]
   * xsr.strToArray('abcdef')   ==> ["abcdef"]
   * xsr.strToArray(['abcdef']) ==> ["abcdef"]
   *
   * @param {String} srcStr
   * @returns {Array}
   */
  xsr.strToArray = function(srcStr) {
    if (typeof srcStr == 'string') {
      srcStr = [srcStr];
    }
    return srcStr;
  };

  xsr.jsonDataSanityCheck;
  function _isValidEvalStr(str){
    if (!xsr.jsonDataSanityCheck) return true;
    var idxOfB = str.indexOf('(');
    if ( (idxOfB>=0) && (str.indexOf(')', idxOfB)>idxOfB) ){
      console.warn('Insecured String with braces():', str);
      return false;
    }
    return true;
  }

  function _toObj(str, key4PrimaryDataTypes) {
    var thisStr;
    if (_isStr(str)) {
      thisStr = str.trimStr().trimStr(',').trimStr(';');

      if (!_isValidEvalStr(thisStr)) return str;

      if (thisStr.match(/^\</)) return str; //could be HTML

      if (!(thisStr.containsStr("{") || thisStr.containsStr(":") || thisStr.containsStr("\\[") || thisStr.containsStr("'") || thisStr.containsStr('\"') ))
      { if (thisStr.containsStr(",") || thisStr.containsStr(";")) {
          return thisStr.replace(/ /g,'').replace(/;/g, ',').split(',');
        } else if (key4PrimaryDataTypes) {
          thisStr = '{'+key4PrimaryDataTypes+':'+thisStr+'}';
        } else {
          return _strToNative(thisStr);
        }
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

      if (!thisStr.beginsWithStr("{") && key4PrimaryDataTypes) {
        thisStr = '{'+key4PrimaryDataTypes+':'+thisStr+'}';
      }
    }
    var jsonObj = {};
    try {
      // _evStr
      jsonObj = (!_isStr(str) && (typeof str === 'object')) ? str : ( _isBlank(str) ? null : (Function('"use strict";return (' + thisStr + ')')()) );
    } catch(e){
      console.error('Error JSON Parse: Invalid String >> "'+str+'"\n>> ' + (e.stack.substring(0, e.stack.indexOf('\n'))) );
    }
    return jsonObj;
  }
  xsr.toJSON = xsr.toObj =_toObj;

  xsr.lastSplitResult = [];
  xsr.getOnSplit = xsr.pickOnSplit = function (str, delimiter, pickIndex) {
    xsr.lastSplitResult = str.split(delimiter);
    return (xsr.getOnLastSplit(pickIndex));
  };
  xsr.getOnLastSplit = xsr.pickOnLastSplit = function (pickIndex) {
    return ((pickIndex < 0) ? (_last(xsr.lastSplitResult)) : (xsr.lastSplitResult[pickIndex]));
  };

  /* isXYZ */
  function _of(x) {
    return (_objProto.toString.call(x)).replace(/\[object /, '').replace(/\]/, '').toLowerCase();
  }
  function _is(x, type) {
    if ((''+type)[0] == '*') {
      return (of(x).indexOf((''+type).toLowerCase().substr(1)) >= 0);
    }
    return ((''+type).toLowerCase().indexOf(of(x)) >= 0);
  }

  function _isArr ( x ) {
    return _is(x, 'array');
  }
  function _isBool ( x ) {
    return _is(x, 'boolean');
  }
  function _isFn ( x ) {
    return _is(x, 'function');
  }
  function _isObj ( x ) {
    return _is(x, 'object');
  }
  function _isObjLike ( x ) {
    return ((typeof x == 'object') || (typeof x == 'function'));
  }
  function _isStr ( x ) {
    return _is(x, 'string');
  }
  function _isNum ( x ) {
    return _is(x, 'number');
  }
  function _isNumStr( x ) {
    return (''+x).isNumberStr();
  }
  function _isUndef ( x ) {
    return _is(x, 'undefined');
  }

  function _isEl ( x ) {
    return _is(x, '*element');
  }

  function _isArrLike ( x ) {
    if (_isArr(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== 'object') {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return ((0 in x) && ((x.length - 1) in x));
    }
    return false;
  }

  function _isEmptyObj( ArrayOrObject ) {
		var key;
		for ( key in ArrayOrObject ) {
			return false;
		}
		return true;
	}
  function _isBlank (src) {
    var retValue = true;
    if (!((typeof src === 'undefined') || (src === null))) {
      switch (true) {
        case (_isStr(src)):
          retValue = ((src).trimStr().length == 0);
          break;
        case (_isFn(src)):
            retValue = false;
          break;
        case (_isArr(src)) :
        case (_isObj(src)):
          retValue = _isEmptyObj(src);
          break;
        default:
          retValue = ((''+src).trimStr().length == 0);
          break;
      }
    }
    return retValue;
  }
  /* Check DOM has requested element */
  function _isElementExist(elSelector) {
    return (!_isEmptyObj($(elSelector).get()));
  }

  // Export through xsr
  xsr.of = of = _of;
  xsr.is = is = _is;
  xsr.isArray        = _isArr;
  xsr.isArrayLike    = _isArrLike;
  xsr.isBoolean      = _isBool;
  xsr.isFunction     = _isFn;
  xsr.isObject       = _isObj;
  xsr.isObjectLike   = _isObjLike;
  xsr.isString       = _isStr;
  xsr.isNumber       = _isNum;
  xsr.isUndefined    = _isUndef;
  xsr.isEmptyObject  = _isEmptyObj;
  xsr.isElement      = _isEl;
  xsr.isElementExist = _isElementExist;
  xsr.isBlank  = xsr.isEmpty = _isEmpty = _isBlank;

  xsr.toBoolean = function (str) {
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

  xsr.toInt = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = _isBlank(str) ? "0" : ((str.indexOf(".") >= 0) ? str.substring(0, str.indexOf(".")) : str);
    return (parseInt(str * 1, 10));
  };

  xsr.toFloat = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = _isBlank(str) ? "0" : str;
    return (parseFloat(str * (1.0)));
  };

  function _toStr(obj) {
    var retValue = "" + obj;
    if (_isObj(obj)) {
      retValue = JSON.stringify(obj);
    }
    return (retValue);
  };
  xsr.toStr = _toStr;

  /*Tobe Removed: replaced with toStr*/
  xsr.toString = function (obj) {
    _log.warn("xsr.toString is deprecated. use xsr.toStr instead.");
    return _toStr(obj);
  };

  xsr.dotToX = function (dottedName, X) {
    return ((dottedName).replace(/\./g, X));
  };
  xsr.dotToCamelCase = function (dottedName) {
    var newName = (dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, "");
    return (newName[0].toLowerCase() + newName.substring(1));
  };
  xsr.dotToTitleCase = function (dottedName) {
    return ((dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
  };

  xsr.toDottedPath = function(srcStr){
    return ((srcStr||"").trim().replace(/]/g,'').replace(/(\[)|(\\)|(\/)/g,'.').replace(/(\.+)/g,'.').trimStr("\\."));
  };

  xsr.ifBlank = xsr.ifEmpty = xsr.ifNull = function (src, replaceWithIfBlank, replaceWithIfNotBlank) {
    replaceWithIfBlank = ("" + (replaceWithIfBlank || "")).trimStr();
    replaceWithIfNotBlank = (typeof replaceWithIfNotBlank === "undefined")? (("" + src).trimStr()) : replaceWithIfNotBlank;
    return ( _isBlank(src) ? (replaceWithIfBlank) : (replaceWithIfNotBlank) );
  };

  /* now: Browser's current timestamp */
  function _now() {
    return ("" + ((new Date()).getTime()));
  }
  /* year: Browser's current year +/- N */
  function _year(n) {
    n = n || 0;
    return ((new Date()).getFullYear() + (xsr.toInt(n)));
  }
  xsr.now = _now;
  xsr.year = _year;

  //approx memory size
  xsr.sizeOf = function _sizeOf(obj, format) {
    var bytes = 0;

    function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
        switch(typeof obj) {
          case 'number':
            bytes += 8; break;
          case 'string':
            bytes += obj.length * 2; break;
          case 'boolean':
            bytes += 4; break;
          case 'object':
            var objClass = _objProto.toString.call(obj).slice(8, -1);
            if(objClass === 'Object' || objClass === 'Array') {
              for(var key in obj) {
                if(!obj.hasOwnProperty(key)) continue;
                bytes += key.length * 2;
                sizeOf(obj[key]);
              }
            } else bytes += obj.toString().length * 2;
            break;
        }
      }
      return bytes;
    }

    function formatByteSize(bytes) {
        if (bytes < 1024) { return bytes + " B"; }
        else if (bytes < 1048576) { return (bytes / 1024).toFixed(3) + " KB"; }
        else if (bytes < 1073741824) { return (bytes / 1048576).toFixed(3) + " MB"; }
        else { return (bytes / 1073741824).toFixed(3) + " GB"; }
    }

    return (_isUndef(format) || format)? formatByteSize(sizeOf(obj)) : sizeOf(obj);
  };

  function _range(start, end, step) {
    var result = [];
    var argLen = arguments.length;
    if (argLen) {
      if (argLen === 1) {
        end = start; start = 0; step = (start <= end)? 1 : -1;
      } else if (argLen === 2) {
        step = (start <= end)? 1 : -1;
      }
      var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
      while (length--) {
        result.push(start);
        start += step;
      }
    }
    return result;
  }

  /*String to Array; xsr.range("N1..N2:STEP")
   * y-N..y+N : y=CurrentYear*/
  xsr.range = function () {
    var argLen = arguments.length;
    if (!argLen || ((argLen === 1) && (''+arguments[0]).trim() === '0')) return [];

    var rangeSpec = arguments[0];
    if (typeof arguments[0] !== 'string') {
      if (argLen) {
        if (argLen === 1) {
          rangeSpec = '0..'+(arguments[0])+':1';
        } else if (argLen === 2) {
          rangeSpec = (arguments[0])+'..'+(arguments[1])+':1';
        } else {
          rangeSpec = (arguments[0])+'..'+(arguments[1])+':'+(arguments[2]);
        }
      }
    };

    rangeSpec = rangeSpec.toUpperCase();
    rangeSpec = rangeSpec.replace(/Y([0-9])/g, 'Y+$1');
    if (rangeSpec.indexOf('..')<0) {
      rangeSpec = ((rangeSpec.indexOf('Y')>-1)? 'Y..' : '0..') + rangeSpec;
    }
    if ((rangeSpec.indexOf('Y')>-1) && (rangeSpec.indexOf('..Y')<0)) {
      rangeSpec = rangeSpec.replace(/\.\.([0-9])/g, '..+$1').replace(/\.\./g,'..Y');
    }

    var rSpec = rangeSpec.split("..")
      , rangeB = "" + rSpec[0]
      , rangeE = "" + rSpec[1]
      , rStep = "1";
    if (rangeE.indexOf(":") > 0) {
      rangeE = "" + (rSpec[1].split(":"))[0];
      rStep = "" + (rSpec[1].split(":"))[1];
    }
    if (rangeB.indexOf("Y") >= 0) {
      rangeB = _year((rangeB.split(/[^0-9+-]/))[1]);
    }
    if (rangeE.indexOf("Y") >= 0) {
      rangeE = _year((rangeE.split(/[^0-9+-]/))[1]);
    }
    var rB = xsr.toInt(rangeB)
      , rE = xsr.toInt(rangeE)
      , rS = xsr.toInt(rStep);
    return (rangeB > rangeE) ? ((_range(rE, (rB) + 1, rS)).reverse()) : (_range(rB, (rE) + 1, rS));
  };

  xsr.checkAndPreventKey = function (e, disableKeys) {
    if (!disableKeys) disableKeys = "";
    var withShiftKey = (disableKeys.indexOf("+shift") >= 0)
      , keyCode  = ""+e.keyCode
      , retValue = (( ((disableKeys.padStr(',')).indexOf(keyCode.padStr(',')) >= 0) && (withShiftKey ? ((e.shiftKey) ? true : false) : ((!e.shiftKey)? true : false))));
    if (retValue) {
      e.preventDefault();
      _log.info("Key [" + keyCode + (withShiftKey ? "+Shift" : "") + "] has been disabled in this element.");
    }
    return retValue;
  };

  xsr._trackAndControlKey = function (e) {
    var keyElement = e.currentTarget
      , $keyElement = $(keyElement)
      , disableKeys = (""+$keyElement.data("disableKeys")).toLowerCase();
      //, keyCode = ""+e.keyCode, withShiftKey = (disableKeys.indexOf("+shift") >= 0);
    xsr.checkAndPreventKey(e, disableKeys);

    var changeFocusNext = (!_isBlank(("" + $keyElement.data("focusNext")).replace(/undefined/, "").toLowerCase()));
    var changeFocusPrev = (!_isBlank(("" + $keyElement.data("focusBack")).replace(/undefined/, "").toLowerCase()));
    if (changeFocusNext && (xsr.checkAndPreventKey(e, "9"))) {
      $($keyElement.data("focusNext")).get(0).focus();
    }
    if (changeFocusPrev && (xsr.checkAndPreventKey(e, "9,+shift"))) {
      $($keyElement.data("focusBack")).get(0).focus();
    }
  };

  function _initKeyTracking() {
    var elementsToTrackKeys = (arguments.length && arguments[0]) ? arguments[0] : "[data-disable-keys],[data-focus-next],[data-focus-back]"
      , $elementsToTrackKeys = $( ((arguments.length==2 && arguments[1])? arguments[1] : 'body') ).find(elementsToTrackKeys);
    _log.info("Finding Key-Tracking for element(s): " + elementsToTrackKeys);
    $elementsToTrackKeys.each(function (index, element) {
      $(element).keydown(xsr._trackAndControlKey);
      _log.info("SPA is tracking keys on element:");
      _log.info(element);
    });
  }
  xsr.initKeyTracking = _initKeyTracking;

  var keyPauseTimer;
  function _initKeyPauseEvent(scope){
    $(scope || 'body').find('[onKeyPause]:not([onKeyPauseReg])').each(function(i, el){
      $(el).attr('onKeyPauseReg', '').on('input propertychange paste', function(){
        var targetEl = this,
            timeDelay = ((''+_attr(targetEl, 'data-pause-time')).replace(/[^0-9]/g,'') || '1250')*1;
        if (keyPauseTimer) clearTimeout(keyPauseTimer);
        keyPauseTimer = setTimeout(function(){
          var fnName = _attr(targetEl, 'onKeyPause').split('(')[0], fn2Call=_find(window,fnName);
          if (fn2Call) fn2Call.call(targetEl, targetEl);
        }, timeDelay);
      });
    });
  }

  /* old dom element ops begins */
  xsr.getDocObj = function (objId) {
    var jqSelector = ((typeof objId) == "object") ? objId : ((objId.beginsWithStr("#") ? "" : "#") + objId);
    return ((_isEl(jqSelector))? jqSelector : $(jqSelector).get(0) );
  };
  xsr.getDocObjs = function (objId) {
    var jqSelector = (objId.beginsWithStr("#") ? "" : "#") + objId;
    return ( $(jqSelector).get() );
  };

  xsr.hasCssRule = function(cssSelectors){
    var foundClass = false;
    if (cssSelectors) {
      cssSelectors = cssSelectors.split(',');
      for(var i = 0; i < document.styleSheets.length; i++) {
        var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
        if (foundClass) break;
        for (var style in rules) {
          foundClass = (foundClass || ((typeof rules[style].selectorText == 'string') && (cssSelectors.indexOf(rules[style].selectorText) >=0)));
          if (foundClass) break;
        }
      }
    }
    return foundClass;
  };
  xsr.getCssRule = function(cssSelector){
    var foundClass, retStyle;
    if (cssSelector) {
      for(var i = 0; i < document.styleSheets.length; i++) {
        var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
        if (foundClass) break;
        for (var style in rules) {
          foundClass = (foundClass || ((typeof rules[style].selectorText == 'string') && (cssSelector == rules[style].selectorText)));
          if (foundClass) { retStyle = rules[style]; break; }
        }
      }
    }
    return retStyle;
  };

  /* setFocus: */
  xsr.setFocus = function (objId, isSelect) {
    var oFocus = xsr.getDocObj(objId);
    if (oFocus) {
      oFocus.focus();
      if (isSelect) oFocus.select();
    }
  };

  xsr.swapClass = function (objIDs, removeClass, addClass) {
    $(objIDs).removeClass(removeClass);
    $(objIDs).addClass(addClass);
  };

  /* docObjValue: returns oldValue; sets newValue if provided */
  xsr.docObjValue = function (objId, newValue) {
    var reqObj = xsr.getDocObj(objId);
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
  xsr.optionSelectedIndex = function (objId, newSelIdx) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      retValue = oLstObj.selectedIndex;
      if (arguments.length === 2) {
        oLstObj.selectedIndex = newSelIdx;
      }
    }
    return (retValue);
  };
  /* get options Index : for value */
  xsr.optionIndexOfValue = function (objId, optValue, setSelect) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
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
  xsr.optionIndexOfText = function (objId, optText) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
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
  xsr.optionIndexOfValueBeginsWith = function (objId, optValue) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
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
  xsr.optionsSelectedValues = function (objId, delimiter) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return (_map(($(objId + " option:selected")), function (option) {
      return (option.value);
    }).join(delimiter));
  };
  xsr.optionsSelectedTexts = function (objId, delimiter) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return (_map(($(objId + " option:selected")), function (option) {
      return (option.text);
    }).join(delimiter));
  };

  /*Get Value / Text for given Index*/
  xsr.optionValueOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = xsr.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].value;
    }
    return (retValue);
  };
  xsr.optionTextOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = xsr.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].text;
    }
    return (retValue);
  };

  /*Set Selected options for Value*/
  // Multiple Options Select by value/text
  function _selectOptionsFor(objId, sType, selValues, valDelimitChar) {
    sType = (sType || 'value').toLowerCase();
    valDelimitChar = valDelimitChar || ",";
    if (_isArr(selValues)) {
      valDelimitChar = '~~';
      selValues = selValues.join(valDelimitChar);
    }
    selValues = (valDelimitChar + selValues + valDelimitChar).toLowerCase();
    var oLstObj = xsr.getDocObj(objId), optValue;
    if (oLstObj) {
      var isOptSelected;
      for (var i = 0; i < oLstObj.length; i++) {
        optValue = (valDelimitChar + (oLstObj.options[i][sType]) + valDelimitChar).toLowerCase();
        isOptSelected = (selValues.indexOf(optValue) >= 0);
        oLstObj.options[i].selected = isOptSelected;
        if (isOptSelected) {
          _attr(oLstObj.options[i], 'selected', '');
        } else {
          oLstObj.options[i].removeAttribute('selected');
        }
      }
    }
  };
  xsr.selectOptionsForValues = function (objId, selValues, valDelimitChar) {
    _selectOptionsFor(objId, 'value', selValues, valDelimitChar);
  };
  xsr.selectOptionsForTexts = function (objId, selValues, valDelimitChar) {
    _selectOptionsFor(objId, 'text', selValues, valDelimitChar);
  };
  xsr.selectOptionsAll = function (objId) {
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = true;
        _attr(oLstObj.options[i], 'selected', '');
      }
    }
  };
  xsr.selectOptionsNone = function (objId) {
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = false;
        oLstObj.options[i].removeAttribute('selected');
      }
    }
  };

  // Single Option Select
  xsr.selectOptionForValue = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      retValue = xsr.optionIndexOfValue(objId, selValue);
      oLstObj.selectedIndex = retValue;
      _attr(oLstObj.options[retValue], 'selected', '');
    }
    return (retValue);
  };
  xsr.selectOptionForValueBeginsWith = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      retValue = xsr.optionIndexOfValueBeginsWith(objId, selValue);
      oLstObj.selectedIndex = retValue;
      _attr(oLstObj.options[retValue], 'selected', '');
    }
    return (retValue);
  };
  xsr.selectOptionForText = function (objId, selText) {
    var retValue = -1;
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      retValue = xsr.optionIndexOfText(objId, selText);
      oLstObj.selectedIndex = retValue;
      _attr(oLstObj.options[retValue], 'selected', '');
    }
    return (retValue);
  };

  /*Add / Remove Options*/
  xsr.optionsReduceToLength = function (objID, nLen) {
    nLen = nLen || 0;
    var oSelOptList = xsr.getDocObj(objID);
    if (oSelOptList) {
      xsr.selectOptionsNone(objID);
      oSelOptList.length = nLen;
    }
  };
  xsr.optionsRemoveAll = function (objID) {
    xsr.optionsReduceToLength(objID, 0);
  };
  xsr.optionRemoveForIndex = function (objId, optIndex) {
    objId = (objId.beginsWithStr("#") ? "" : "#") + objId;
    var oLstObj = xsr.getDocObj(objId);
    if (oLstObj) {
      if (("" + optIndex).equalsIgnoreCase("first")) optIndex = 0;
      if (("" + optIndex).equalsIgnoreCase("last")) optIndex = (oLstObj.length - 1);
      oLstObj.remove(optIndex);
    }
  };
  xsr.optionRemoveForValue = function (objId, optValue) {
    xsr.optionRemoveForIndex(objId, xsr.optionIndexOfValue(objId, optValue));
  };
  xsr.optionRemoveForText = function (objId, optText) {
    xsr.optionRemoveForIndex(objId, xsr.optionIndexOfText(objId, optText));
  };
  xsr.optionRemoveForValueBeginsWith = function (objId, optValueBeginsWith) {
    xsr.optionRemoveForIndex(objId, xsr.optionIndexOfValueBeginsWith(objId, optValueBeginsWith));
  };

  xsr.optionAppend = function (objID, optValue, optText, appendAtIndex) {
    var retValue = -1;
    var oSelOptList = xsr.getDocObj(objID);
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
   * Usage: xsr.optionsLoad(elSelector, list, beginsAt, sortBy)
   * elSelector = "#SelectElementID"; //jQuery selector by ID
   * list = [ 0, 1, ... ]; //Number Array
   * list = ["optValue0", "optValue1", ... ]; //String Array
   * list = {"optValue0":"optText0", "optValue1":"optText1", "optValue2":"optText2", ... }; //Object with Key Value Pair
   * beginsAt = -1 => Add to existing list; 0=> reset to 0; n=> reset to n; before Load
   * sortBy = 0=> NO Sort; 1=> SortBy Key; 2=> SortBy Text;
   */
  xsr.optionsLoad = function (elSelector, list, beginsAt, sortBy) {
    var sortByAttr = ["", "key", "value"];
    beginsAt = beginsAt || 0;
    sortBy = sortBy || 0;
    if (_isStr(list)) {
      if (list.indexOf("..") > 0) {
        list = xsr.range(list);
      } else if (list.indexOf(",") > 0) {
        list = list.split(',').map(function(item){ return item.trim(); });
      }
    }
    if (beginsAt >= 0) {
      xsr.optionsReduceToLength(elSelector, beginsAt);
    }
    if (_isArr(list)) {
      _each(list, function (opt) {
        xsr.optionAppend(elSelector, opt, opt);
      });
    } else {
      if (sortBy > 0) {
        var listArray = [];
        for (var key in list) {
          listArray.push({key: key, value: list[key]});
        }
        var listSorted = _sortBy(listArray, sortByAttr[sortBy]);
        _each(listSorted, function (opt) {
          xsr.optionAppend(elSelector, opt.key, opt.value);
        });
      }
      else {
        _each(list, function (value, key) {
          xsr.optionAppend(elSelector, key, value);
        });
      }
    }
  };

  xsr.optionsList = function (elSelector, list, beginsAt, sortOn, sortBy) {

    var elSelect = xsr.getDocObj(elSelector);

    if (_isUndef(beginsAt)) {
      beginsAt = _attr(elSelect, 'data-options-from');
    }
    if (_isUndef(sortOn)) {
      sortOn = _attr(elSelect, 'data-sort-on');
    }
    if (_isUndef(sortBy)) {
      sortBy = _attr(elSelect, 'data-sort-by');
    }

    var keyVal = (_attr(elSelect, 'data-value-key') || 'value').toLowerCase();
    var keyTxt = (_attr(elSelect, 'data-text-key') || 'text').toLowerCase();

    var sortOnAttr = ['', keyVal, keyTxt];
    beginsAt = +(beginsAt || 0);
    sortOn   = +(((sortOn || 0)+'').replace(new RegExp(keyVal, 'i'),'1').replace(new RegExp(keyTxt, 'i'),'2'));
    sortBy   = ((sortBy || '')+'').trim().toLowerCase();
    if (beginsAt >= 0) {
      xsr.optionsReduceToLength(elSelector, beginsAt);
    }

    if (_isStr(list)) {
      if (list.indexOf("..") > 0) {
        list = xsr.range(list);
      } else {
        if (elSelect.hasAttribute('data-split-by')) {
          list = list.split(_attr(elSelect, 'data-split-by')).map(function(item){ return item.trim(); });
        } else {
          list = [list];
        }
      }
    }

    if (_isObj(list)) {
      var listArray = [];
      _each(list, function (value, key) {
        var tOpt = {};
        tOpt[keyVal] = key;
        tOpt[keyTxt] = value;
        listArray.push(tOpt);
      });
      list = listArray;
    }

    if (_isArr(list)) {
      if (sortOn || sortBy) {
        if (_isObj(list[0])) {
          list = _sortBy(list, sortOnAttr[sortOn]);
          if (sortBy[0]=='d') {
            list = list.reverse();
          }
        } else {
          if (sortBy[0]=='a') {
            list = list.sort();
          } else if (sortBy[0]=='d') {
            list = list.sort().reverse();
          }
        }
      }
      var optV, optT;
      _each(list, function (opt) {
        if (_isObj(opt)) {
          optV = opt[keyVal];
          optT = opt[keyTxt];
        } else {
          optV = optT = opt;
        }
        xsr.optionAppend(elSelector, optV, optT);
      });
    }

  };


  /* Radio & Checkbox related */
  /* checkedState: returns old Checked State {true|false}; sets newState {true | false} if provided */
  xsr.checkedState = function (objId, newState) {
    var retValue = false
      , objChk = xsr.getDocObj(objId);
    if (objChk) {
      retValue = objChk.checked;
      if (arguments.length === 2) {
        objChk.checked = newState;
      }
    }
    return (retValue);
  };
  xsr.isChecked = function (elScope, eName) {
    return (($(elScope).find("input[name=" + eName + "]:checked").length) > 0);
  };
  xsr.radioSelectedValue = function (elScope, rName) {
    var retValue = ($(elScope).find("input[name=" + rName + "]:checked").val());
    return (retValue ? retValue : "");
  };
  xsr.radioClearSelection = function (elScope, rName) {
    ($(elScope).find("input[name=" + rName + "]:checked").attr("checked", false));
  };
  xsr.radioSelectForValue = function (elScope, rName, sValue) {
    $(elScope).find("input[name=" + rName + "]:radio").each(function(el) {
      el.checked = ((el.value).equalsIgnoreCase(sValue));
    });
  };
  xsr.checkboxCheckedValues = function (elScope, cbName, delimiter) {
    delimiter = delimiter || ",";
    return ($(elScope).find("input[name=" + cbName + "]:checked").map(function () {
      return this.value;
    }).get().join(delimiter));
  };
  /* old dom element ops ends */

  xsr.sleep = function (sec) {
    var dt = new Date();
    dt.setTime(dt.getTime() + (sec * 1000));
    while (new Date().getTime() < dt.getTime());
  };

  /*Tobe removed;*/
  xsr.filterJSON = function (jsonData, xFilter) {
    console.warn('xsr.filterJSON has been removed. please use alternate filter.');
    //    return $(jsonData).filter(function (index, item) {
    //      for (var i in xFilter) {
    //        if (!item[i].toString().match(xFilter[i])) return null;
    //      }
    //      return item;
    //    });
  };

  /* randomPassword: Random Password for requested length */
  xsr.randomPassword = function (passLen, passStr) {
    var chars = passStr || "9a8b77C8D9E8dkfhseidF7G6H5QJ3c6d5e4f32L3M4N5P6Qg2h3i4j5kV6W5X4Y3Z26m7n8p9q8r7s6t5u4v3w2x3y4z5A6BK7R8S9T8U7";
    var pass = "";
    for (var x = 0; x < (passLen || 8); x++) {
      var i = Math.floor(Math.random() * (chars).length);
      pass += chars.charAt(i);
    }
    return pass;
  };

  /* rand: Random number between min - max */
  function _rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  xsr.rand = _rand;

  xsr.appendToObj = function(xObj, oKey, oValue) {
    if (_hasKey(xObj, oKey)) {
      if (!_isArr(xObj[oKey])) {
        xObj[oKey] = [xObj[oKey]];
      }
      xObj[oKey].push(oValue);
    } else {
      xObj[oKey] = oValue;
    }
  };

  xsr.parseKeyStr = function (keyName, changeToLowerCase) {
    return ((changeToLowerCase ? keyName.toLowerCase() : keyName).replace(/[^_0-9A-Za-z\$\[\]\?\*\-]/g, ""));
  };

  var arrayIndexPointsToMap = {};
  xsr.setObjProperty = function (obj, keyNameStr, propValue, keyToLowerCase) {
    keyNameStr = ('' + keyNameStr);
    keyToLowerCase = keyToLowerCase || false;
    var xObj = obj, oKey;
    var oKeys = (( (keyNameStr.indexOf('.')>=0) || (keyNameStr == keyNameStr.toUpperCase()) )? keyNameStr.split('.') :  keyNameStr.split(/(?=[A-Z])/)), arrNameIndx, arrName, arrIdx;
    /*Default: camelCase | TitleCase if ALL UPPERCASE split by . */
    var keyIdentifier = (keyNameStr.replace(/[0-9A-Za-z\[\]\?\*\_]/g, "")).trim();
    if (keyIdentifier && (keyIdentifier != "")) {
      oKeys = keyNameStr.split(keyIdentifier[0]);
    }
    var keyFullPath='';
    while (oKeys.length > 1) {
      oKey = xsr.parseKeyStr(oKeys.shift(), keyToLowerCase);
      if (!_isBlank(oKey)) {
        keyFullPath += oKey.replace(/[\?\[\]\*\_]/g,'');
        if ((oKey.indexOf('[')>0) && (oKey.indexOf(']') == oKey.length-1)) {//isArray
          arrNameIndx = oKey.substring(0,oKey.length-1).replace(/\[/g, '.').split('.');
          arrName = arrNameIndx[0];
          arrIdx = arrNameIndx[1];
          if (typeof xObj[arrName] == "undefined") xObj[arrName] = [];
          if (!!arrIdx.replace(/[0-9]/g, '')) {
            arrIdx = arrIdx.replace(/[^0-9]/g, '');
            if (arrayIndexPointsToMap.hasOwnProperty(keyFullPath)) {
              arrIdx = arrayIndexPointsToMap[keyFullPath];
            } else if (typeof xObj[arrName][arrIdx] == "undefined") {
              arrayIndexPointsToMap[keyFullPath] = xObj[arrName].length;
              arrIdx = xObj[arrName].length;
            }
          }
          if (typeof xObj[arrName][arrIdx] == "undefined") xObj[arrName][arrIdx] = {};
          xObj = xObj[arrName][arrIdx];
        } else {
          if (typeof xObj[oKey] == "undefined") xObj[oKey] = {};
          xObj = xObj[oKey];
        }
      }
    }
    oKey = xsr.parseKeyStr(oKeys.shift(), keyToLowerCase);
    xsr.appendToObj(xObj, oKey, propValue);

    return obj;
  };

  xsr.setSimpleObjProperty = function (obj, keyNameStr, propValue) {
    keyNameStr = ('' + keyNameStr);
    var xObj = obj, oKey;
    var oKeys = keyNameStr.split('.');
    while (oKeys.length > 1) {
      oKey = xsr.parseKeyStr(oKeys.shift(), false);
      if (!_isBlank(oKey)) {
        if (typeof xObj[oKey] == "undefined") xObj[oKey] = {};
        xObj = xObj[oKey];
      }
    }
    oKey = xsr.parseKeyStr(oKeys.shift(), false);
    xObj[oKey] = propValue;

    return obj;
  };

  xsr.objProp = xsr.objProperty = xsr.objectProp = xsr.objectProperty = function(){
    var obj=arguments[0], keyNameStr=arguments[1], propValue=arguments[2];
    if (arguments.length == 3) {
      return xsr.setSimpleObjProperty(obj, keyNameStr, propValue);
    } else if (arguments.length == 2) {
      return _find(obj, keyNameStr);
    } else {
      return obj;
    }
  };

  /*
   * xsr.extract(destObj, mapKeys, srcObj1, srcObj2, srcObj3)
   * xsr.extract(mapKeys, srcObj1, srcObj2, srcObj3)
   *
   * mapKeys = [ 'mapKeySpec1', 'mapKeySpec2', 'mapKeySpec3', ... ]
   * mapKeys = 'mapKeySpec1, mapKeySpec2, mapKeySpec3, ...'
   *
   * # = 0 .. N; 0 for window (global); 1 .. N refers to srcObj1, srcObj2 ... srcObjN
   * mapKeySpec = '@#'
   * mapKeySpec = '@#.src.key.path'
   * mapKeySpec = 'dst.key.path@#'
   * mapKeySpec = 'dst.key.path@#.src.key.path'
   *
   */
  function _extract(){
    var args = _arrProto.slice.call(arguments);
    try {
      if (!_isObj(args[0])) args.unshift({});
      if (_isStr(args[1])) args[1] = args[1].split(',');
    } catch (e) {
      console.error('Invalid arguments', e);
    }

    if (!(_isObj(args[0]) && (_isArr(args[1])))) {
      console.error('Invalid arguments.');
      return;
    }

    var dstObj  = args[0]
      , spec    = args[1]
      , srcObjs = args.slice(2);
    srcObjs.unshift(window); //load window @0
    var mapSpecArr, dstKey, srcIdx, srcKey, skipExtract, dstVal;
    _each(spec, function(mapSpec){
      mapSpec = (mapSpec || '').trim();
      skipExtract = !(mapSpec && mapSpec != '@0');
      if (!skipExtract) {
        if (/^\@([0-9])+/.test(mapSpec)){ //begins with @#
          srcKey = dstKey =  ((mapSpec).getRightStr('.') || '').trim();
          if (srcKey) {
            mapSpec = srcKey+':'+mapSpec;
          } else {
            _mergeDeep(dstObj, srcObjs[ xsr.toInt(mapSpec) ]);
            skipExtract = true;
          }
        }

        if (!skipExtract) {
          mapSpecArr = mapSpec.split(':');
          dstKey = (mapSpecArr[0]||'').trim();
          srcIdx = xsr.toInt((mapSpecArr[1]||'').split('.')[0]);
          srcKey =  ((mapSpecArr[1]||'').getRightStr('.') || '').trim();
          if (!dstKey) dstKey = srcKey;
          dstVal = srcKey? _find(srcObjs[srcIdx], srcKey) : (srcIdx? srcObjs[srcIdx] : {});
          if (dstKey.endsWithStr('\\+')) {
            dstKey = dstKey.trimRightStr('+');
            var preVal = _find(dstObj, dstKey);
            switch(_of(preVal)) {
              case 'object':
                if (_isObj(dstVal)) {
                  dstVal = _mergeDeep({}, preVal, dstVal);
                }
                break;
              case 'array':
                if (_isArr(dstVal)) {
                  dstVal = preVal.concat(dstVal);
                } else {
                  dstVal = preVal.push(dstVal);
                }
                break;
            }
          }
          xsr.setSimpleObjProperty(dstObj, dstKey, dstVal);
        }
      }
    });

    return dstObj;
  }
  xsr.extract = _extract;

  function _$qrySelector(selector) {
    if (_isStr(selector)) {
      var selectors = (selector.trim()).split(' ')
        , rootSelector = selectors[0]
        , compName, compIndex;
      if ((/app\.(.+)\./).test(rootSelector)){
        compName = (rootSelector.split('.')[1]);
        selectors[0] = (selectors[0]).replace('app.'+compName+'.', '[data-rendered-component="'+(rootSelector.split('.')[1])+'"] ');
        selector = selectors.join(' ');
      } else if (rootSelector.beginsWithStr('\\$')) {
        compName  = rootSelector.substr(1);
        if (compName.indexOf(':')>0) {
          compIndex = xsr.toInt(compName.getRightStr(':').trim());
          compName = compName.getLeftStr(':');
          selectors[0] = ('[data-rendered-component="'+compName+'"]:eq('+compIndex+')');
        } else {
          selectors[0] = ('[data-rendered-component="'+compName+'"]');
        }
        selector = selectors.join(' ');
      }
    }
    return selector;
  }

  xsr.setElValue = function (el, elValue) {
    var $el = $(_$qrySelector(el)); el = $el.get(0);
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
            $el.val(elValue);
            if ($el.isEnabled()) $el.trigger('keyup');
            break;

          case "checkbox":
          case "radio":
            el.checked = (el.value).equalsIgnoreCase(elValue);
            if (el.checked && $el.isEnabled()) $el.trigger('click');
            break;
        }
        break;

      case "SELECT":
        xsr.selectOptionForValue(el, elValue);
        if ($el.isEnabled()) $el.trigger('change');
        break;

      case "TEXTAREA":
        $el.val(elValue);
        if ($el.isEnabled()) $el.trigger('keyup');
        break;

      default:
        $el.html( xsr.sanitizeXSS(elValue) );
        $el.val(elValue);
        if ($el.isEnabled()) $el.trigger('keyup');
        break;
    }

  };

  xsr.getElValue = function (el, escHTML) {
    el = $(_$qrySelector(el)).get(0);
    if (!el) return;
    var elValue, unchkvalue, chkedValue;
    switch ((el.tagName).toUpperCase()) {
      case "INPUT":
        switch ((el.type).toLowerCase()) {
          case "checkbox":
            unchkvalue = $(el).data("unchecked");
            chkedValue = (el.value == 'true')? true : ((el.value == 'false')? false : el.value);
            elValue = el.checked ? chkedValue : ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
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
        elValue = _map(($(el).find("option:selected")), function (option) {
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
    if (_isBlank(elValue) && el.hasAttribute('data-default')) {
      var defValue = _attr(el, 'data-default')||'';
      if (defValue[0]==='@') {
        defValue = _find(win, defValue.replace(/^[@\s]+/, ''), ''); //trimLeft @ and find in window
        if (_isFn(defValue)) {
          defValue = defValue.call(el, el);
          if (_isUndef(defValue)) {
            defValue = '';
          }
        }
      } else if (defValue[1]==='@') {
        defValue = defValue.trim();
      }
      elValue = defValue;
    }
    return elValue;
  };

  xsr.serialize = function(scope, context, escHTML){
    if (_isBool(scope)) { //making scope optional
      escHTML = scope;
      scope = '';
    }
    if (_isBool(context)) { //making context optional
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
      elValue = xsr.getElValue(el, escElHTML);

      if (!retObj.hasOwnProperty(keyName)) {
        retObj[keyName] = elValue;
      } else if (!_isBlank(elValue)) {
        if (_isBlank(retObj[keyName])) {
          retObj[keyName] = elValue;
        } else if (_isArr(retObj[keyName])) {
          retObj[keyName].push(elValue);
        } else {
          retObj[keyName] = [retObj[keyName], elValue];
        }
      }
    });
    return retObj;
  };

  xsr.serializeToQueryString = function(scope, context){
    return xsr.toQueryString(xsr.serialize(scope, context));
  };

  xsr.serializeDisabled = function (formSelector) {
    var retValue = "";
    $(formSelector).find("[disabled][name]").each(function () {
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + xsr.getElValue(this);
    });
    return retValue;
  };

  /*
   * xsr.serializeForms(formSelector, includeDisabledElements)
   * @formSelector {string} jQuery form selector #Form1,#Form2...
   * @includeDisabledElements {boolean} true | false [default:false]
   * @returns {string} param1=value1&param2=value2...
   */
  xsr.serializeForms = function (formSelector, includeDisabledElements) {
    var disabledElementsKeyValues, unchkvalue, retValue = $(formSelector).serialize();

    //include unchecked checkboxes
    $(formSelector).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function () {
      unchkvalue = $(this).data("unchecked");
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
    });

    if (includeDisabledElements) {
      disabledElementsKeyValues = xsr.serializeDisabled(formSelector);
      retValue += ((retValue && disabledElementsKeyValues) ? '&' : '') + disabledElementsKeyValues;
    }
    return retValue;
  };

  xsr.queryStringToJson = xsr.queryStringToObject = function (qStr) {
    var retValue = {}, qStringWithParams = (qStr || location.search), qIndex = ('' + qStringWithParams).indexOf('?'), ampIndex = ('' + qStringWithParams).indexOf('&');
    if (qStringWithParams && (qStringWithParams.length > 0) && (qIndex >= 0) && ((qIndex == 0) || (ampIndex > qIndex))) {
      qStringWithParams = qStringWithParams.substring(qIndex + 1);
    }
    _each((qStringWithParams.split('&')), function (nvp) {
      nvp = nvp.split('=');
      if (nvp[0]) {
        xsr.appendToObj(retValue, nvp[0], decodeURIComponent(nvp[1] || ''));
      }
    });
    return retValue;
  };


  function _toQueryString(obj) {
    return _isObj(obj)? (_keys(obj).reduce(function (str, key, i) {
      var delimiter, val;
      delimiter = (i === 0) ? '' : '&';
      key = encodeURIComponent(key);
      val = _isArr(obj[key])? _map(obj[key], function(item){ return encodeURIComponent(item); }).join(',') : encodeURIComponent(obj[key]);
      return [str, delimiter, key, '=', val].join('');
    }, '')) : '';
  }
  xsr.toQueryString = xsr.ObjectToQueryString = xsr.objectToQueryString = xsr.JsonToQueryString = xsr.jsonToQueryString = _toQueryString;

  /* as jQ extension see $fnEx below */
  function _serializeUncheckedCheckboxes(appendTo) {
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
        xsr.appendToObj(retObj, keyName, keyValue);
      }
      else {
        retStr += ((retStr) ? '&' : '') + keyName + '=' + keyValue;
      }
    });
    return ((toJSON) ? retObj : retStr);
  }
  xsr.serializeUncheckedCheckboxes = function (formSelector, appendTo) {
    return $(formSelector).serializeUncheckedCheckboxes(appendTo);
  };

  /* Serialize form elements to Json Object
   * $("#formId").serializeFormToJson(obj, keyNameToLowerCase);
   * keyNameToLowerCase: converts form element names to its correponding lowercase obj's attribute
   * obj: Optional; creates/returns new JSON if not provided; overwrite & append attributes on the given obj if provided
   * */
  /* as jQ extension see $fnEx below */
  function _serializeFormToObject(obj, keyNameToLowerCase, strPrefixToIgnore) {
    var $thisForm = $(this)
      , thisForm = $thisForm[0]
      , a = $thisForm.serializeToArray()
      , $fmData = $thisForm.data()
      , o = (typeof obj === "object") ? obj : {}
      , c = (typeof obj === "boolean") ? obj : (keyNameToLowerCase || false)
      , kParse   = $fmData["serializeIgnorePrefix"]
      , toNative = $fmData.hasOwnProperty('typeNative')
      , oKeyName, oKeyValue;
    arrayIndexPointsToMap = {};
    if (strPrefixToIgnore) kParse = strPrefixToIgnore;
    _each(a, function () {
      oKeyName = (kParse) ? (this.name).replace(kParse, "") : this.name;
      o = xsr.setObjProperty(o, oKeyName,  (toNative? ((this.value).toNative()) : this.value), c);
    });

    //include unchecked checkboxes
    $thisForm.find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function(){
      oKeyName = $(this).attr('name');
      if (oKeyName) {
        oKeyValue = $(this).data("unchecked");

        if (kParse) {
          oKeyName = (oKeyName).replace(kParse, "");
        }
        oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);

        o = xsr.setObjProperty(o, oKeyName, (toNative? (oKeyValue.toNative()) : oKeyValue), c);
      }
    });

    //include disabled elements
    var includeDisabled = (thisForm.hasAttribute('data-disabled') && _isBlank(_attr(thisForm,'data-disabled'))) || _strToNative( $fmData['disabled'] || 'false' );
    if (includeDisabled) {
      $thisForm.find("[disabled][name]").each(function(){
        oKeyName = $(this).attr('name');
        if (oKeyName) {
          oKeyValue = xsr.getElValue(this);
          if (kParse) {
            oKeyName = (oKeyName).replace(kParse, "");
          }
          oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);

          o = xsr.setObjProperty(o, oKeyName, (toNative? (oKeyValue.toNative()) : oKeyValue), c);
        }
      });
    }

    return o;
  }
  xsr.serializeFormToJSON = xsr.serializeFormToObject = function (formSelector, obj, keyNameToLowerCase, strPrefixToIgnore) {
    return $(formSelector).serializeFormToJSON(obj, keyNameToLowerCase, strPrefixToIgnore);
  };

  /* as jQ extension see $fnEx below */
  function _serializeFormToSimpleObject(obj, includeDisabledElements) {
    var $thisForm = $(this)
      , thisForm  = $thisForm[0]
      , $fmData   = $thisForm.data()
      , a = this.serializeToArray()
      , o = (typeof obj === "object") ? obj : {}
      , c = (typeof obj === "boolean") ? obj : ( _is(includeDisabledElements, 'boolean')? includeDisabledElements : ((thisForm.hasAttribute('data-disabled') && _isBlank(_attr(thisForm,'data-disabled'))) || _strToNative( $fmData['disabled'] || 'false' )))
      , oKeyStr, oGrpStr
      , oKeyName, oKeyValue;

    _each(a, function () {
      xsr.appendToObj(o, this.name, this.value);
    });

    //include disabled elements
    if (c) {
      $(this).find("[disabled][name]").each(function () {
        xsr.appendToObj(o, this.name, xsr.getElValue(this));
      });
    }

    //include unchecked checkboxes
    $(this).find("input[data-unchecked]:checkbox:enabled:not(:checked)[name]").each(function () {
      oKeyName = $(this).attr('name');
      oKeyValue = $(this).data("unchecked");
      oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);
      xsr.appendToObj(o, oKeyName, oKeyValue);
    });

    $(this).find("[data-to-json-group][name]").each(function () {
      oKeyStr = this.name;
      oGrpStr = $(this).data("toJsonGroup");
      if (oGrpStr) {
        if (!o[oGrpStr]) o[oGrpStr] = {};
        xsr.appendToObj(o[oGrpStr], oKeyStr, xsr.getElValue(this));
      }
    });
    return o;
  }
  xsr.serializeFormToSimpleJSON = xsr.serializeFormToSimpleObject = function (formSelector, obj, includeDisabledElements) {
    return $(formSelector).serializeFormToSimpleJSON(obj, includeDisabledElements);
  };

  /* Object Utilities */
  if (1) {
    /* find(jsonObject, 'key1.key2.key3[0].key4'); */
    function _find(objSrc, pathStr, ifUndefined) {
      if (_isObjLike(objSrc) && pathStr) {
        var pathList = _map(pathStr.split('|'), function(path){ return path.trim(); } );
        pathStr = pathList.shift();
        var nxtPath = pathList.join('|');

        var unDef, retValue, isWildKey = (pathStr.indexOf('*') >= 0);
        if (isWildKey) {
          retValue = (function(xObj, xKey) {
                        var xValue;
                        if (_isObjLike(xObj)) {
                          if (xObj.hasOwnProperty(xKey)) {
                            xValue = xObj[xKey];
                          } else {
                            var oKeys = _keys(xObj), idx=0;
                            while ( _isUndef(xValue) && (idx < oKeys.length) ) {
                              xValue = arguments.callee( xObj[ oKeys[idx++] ], xKey );
                            }
                          }
                        }
                        return xValue;
                      }(objSrc, pathStr.replace(/\*/g, '')));
        } else {
          var i = 0, path = xsr.toDottedPath(pathStr).split('.'), len = path.length;
          for (retValue = objSrc; i < len; i++) {
            if (_isArr(retValue)) {
              retValue = retValue[ xsr.toInt(path[i]) ];
            } else if (_isObjLike(retValue)) {
              retValue = retValue[ path[i].trim() ];
            } else {
              retValue = unDef;
              break;
            }
          }
        }

        if (_isUndef(retValue)) {
          if (nxtPath) {
            return _find(objSrc, nxtPath, ifUndefined);
          } else {
            return (_isFn(ifUndefined))? ifUndefined.call(objSrc, objSrc, pathStr) : ifUndefined;
          }
        } else {
          return retValue;
        }

      } else {
        if (arguments.length == 3) {
          return (_isFn(ifUndefined))? ifUndefined.call(objSrc, objSrc, pathStr) : ifUndefined;
        } else {
          return objSrc;
        }
      }
    }

    function _hasKey(obj, path) {
      if (arguments.length < 2) return false;
      if ((typeof obj === 'object') && (typeof path === 'string') && (!/[\.\[\]\/\|\&\,]/g.test(path))) {
        return obj.hasOwnProperty(path.trim());
      } else {
        var tObj = obj, retValue = false;
        try {
          retValue = _isValidEvalStr(path)? (typeof _find(tObj, path) != "undefined") : false;
        } catch(e){
          console.warn("Key["+path+"] error in object.\n" + e.stack);
        }
        return retValue;
      }
    }
    function _isObjHasKeys(obj, propNames, deep){

      function checkForAll(obj, propNames){
        var pKeys = propNames.split(','), pKey = '', pKeysCount = 0, retValue = true, hasKey;
        for(var i=0;i<pKeys.length; i++) {
          pKey = pKeys[i].trim();
          if (pKey) {
            pKeysCount++;
            hasKey = (deep && ((pKey.indexOf('.')>0) || (pKey.indexOf('[')>0)))? xsr.hasKey(obj, pKey) : obj.hasOwnProperty(pKey);
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
            hasKey = (deep && ((pKey.indexOf('.')>0) || (pKey.indexOf('[')>0)) )? xsr.hasKey(obj, pKey) : obj.hasOwnProperty(pKey);
            retValue = retValue || hasKey;
          }
          if (retValue) break;
        }

        return pKeysCount && retValue;
      }

      var retValue = false;
      if (_isObj(obj)){
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
    function _keys( xObj ) {
      var xObjKeys = [];
      try {
        xObjKeys = Object.keys(xObj);
      } catch(e){};
      return xObjKeys;
    }
    function _spa_hasKeys(obj, propNames){
      return _isObjHasKeys(obj, propNames, true);
    }
    function _spa_hasPrimaryKeys(obj, propNames){
      return _isObjHasKeys(obj, propNames);
    }

    /*Get All keys like X-Path with dot and [] notations */
    function _keysDottedAll(a) {
      var objKeys = _keysDotted(a);
      if (objKeys && !_isEmpty(objKeys)) {
        objKeys = xsr.toDottedPath(objKeys.join(",")).split(",");
      }
      return objKeys;
    }
    function _keysDotted(a) {
      a = a || {};
      var list = [], xConnectorB, xConnectorE, curKey;
      (function (o, r) {
        r = r || '';
        if (typeof o != 'object') {
          return true;
        }
        for (var c in o) {
          curKey = r.substring(1);
          xConnectorB = (_isNumStr(c)) ? "[" : ".";
          xConnectorE = (((curKey) && (xConnectorB == "[")) ? "]" : "");
          if (arguments.callee(o[c], r + xConnectorB + c + xConnectorE)) {
            list.push((curKey) + (((curKey) ? xConnectorB : "")) + c + (xConnectorE));
          }
        }
        return false;
      })(a);
      return list;
    }
    function _keysCamelCase(a) {
      return (_map(_keysDotted(a), function (name) {
        var newName = (name).replace(/\./g, " ").toProperCase().replace(/ /g, "");
        return (newName[0].toLowerCase() + newName.substring(1));
      }));
    }
    function _keysTitleCase(a) {
      return (_map(_keysDotted(a), function (name) {
        return ((name).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
      }));
    }
    function _keysLodash(a) {
      return (_map(_keysDotted(a), function (name) {
        return ((name).replace(/\./g, "_"));
      }));
    }
  }

  xsr.findSafe = xsr.findInObj = xsr.findInObject = xsr.findIn = xsr.find = _find;

  xsr.keys           = _keys;
  xsr.has            = xsr.hasKey = _hasKey;
  xsr.hasKeys        = _spa_hasKeys;
  xsr.hasPrimaryKeys = _spa_hasPrimaryKeys;
  xsr.keysDottedAll  = _keysDottedAll;
  xsr.keysDotted     = _keysDotted;
  xsr.keysCamelCase  = _keysCamelCase ;
  xsr.keysTitleCase  = _keysTitleCase;
  xsr.keys_          = _keysLodash;

  /* Array/Object Iterators */
  if (1) {
    function _each(xArr, fn) {
      if (_isArrLike(xArr)) {
        for(var i=0; i<xArr.length; i++) {
          fn.call(xArr[i], xArr[i], i, xArr);
        }
      } else {
        _keys(xArr).forEach(function(key){
          fn.call(xArr[key], xArr[key], key, xArr);
        });
      }
    }
    function _map(xArr, fn) {
      var retArr = [];
      if (_isArrLike(xArr)) {
        for(var i=0; i<xArr.length; i++) {
          retArr.push( fn.call(xArr[i], xArr[i], i, xArr) );
        }
      } else {
        _keys(xArr).forEach(function(key){
          retArr.push( fn.call(xArr[key], xArr[key], key, xArr) );
        });
      }
      return retArr;
    }
    function _every(xArr, fn) {
      var retValue = true;
      if (_isArrLike(xArr)) {
        for(var i=0, xLen = xArr.length; (retValue && i<xLen); i++) {
          retValue = !!fn.call(xArr[i], xArr[i], i, xArr);
        }
      } else {
        var oKeys = _keys(xArr), key;
        for(var i=0, xLen = oKeys.length; (retValue && i<xLen); i++) {
          key = oKeys[i];
          retValue = !!fn.call(xArr[key], xArr[key], key, xArr);
        }
      }
      return retValue;
    }
    function _some(xArr, fn) {
      var retValue = false;
      if (_isArrLike(xArr)) {
        for(var i=0, xLen = xArr.length; i<xLen; i++) {
          retValue = !!fn.call(xArr[i], xArr[i], i, xArr);
          if (retValue) break;
        }
      } else {
        var oKeys = _keys(xArr), key;
        for(var i=0, xLen = oKeys.length; i<xLen; i++) {
          key = oKeys[i];
          retValue = !!fn.call(xArr[key], xArr[key], key, xArr);
          if (retValue) break;
        }
      }
      return retValue;
    }
    function _filter(xArr, fn) {
      var retArr = [];
      if (_isArrLike(xArr)) {
        for(var i=0; i<xArr.length; i++) {
          (!fn.call(xArr[i], xArr[i], i, xArr))? '' : retArr.push( xArr[i] );
        }
      } else {
        _keys(xArr).forEach(function(key){
          (!fn.call(xArr[key], xArr[key], key, xArr))? '' : retArr.push( xArr[key] );
        });
      }
      return retArr;
    }
    function _removeOn(xArr, fn) {
      var removedItems = [];
      if (_isArrLike(xArr)) {
        for(var i=0; i<xArr.length; i++) {
          if (fn.call(xArr[i], xArr[i], i, xArr)) {
            removedItems.push( xArr.splice(i--,1)[0] );
          }
        }
      } else {
        _keys(xArr).forEach(function(key){
          if (fn.call(xArr[key], xArr[key], key, xArr)) {
            removedItems.push(xArr[key]);
            delete xArr[key];
          }
        });
      }
      return removedItems;
    }
    function _sortBy(xArr, key) {
      if (_isArrLike(xArr) && key) {
        return xArr.sort(function(a, b){
          var aValue = (_isNumStr(a[key]))? (a[key]*1) : a[key];
          var bValue = (_isNumStr(b[key]))? (b[key]*1) : b[key];
          var aType = typeof aValue;
          var bType = typeof bValue;
          var retValue = 0;
          if ((aType === 'string') && (bType === 'string')) {
            aValue = aValue.toUpperCase();
            bValue = bValue.toUpperCase();
            if (aValue < bValue) {
              retValue = -1;
            }
            if (aValue > bValue) {
              retValue = 1;
            }
          } else if ((aType === 'number') && (bType === 'number')) {
            retValue = aValue - bValue;
          }
          return retValue;
        });
      } else {
        return xArr;
      }
    }
    function _zipObj(keyArr, valArr) {
      var retObj = {};
      if (_isArrLike(keyArr) && _isArrLike(valArr)) {
        for(var i=0; i<keyArr.length; i++) {
          retObj[keyArr[i]] = valArr[i];
        }
      }
      return retObj;
    }
    function _uniq(xArr) {
      return _filter(xArr, function(item, idx){
        return (xArr.indexOf(item) == idx);
      });
    }
    function _omit(xObj, omitKeys) {
      var retObj = {};
      if (_isArrLike(omitKeys) && omitKeys.length) {
        if (_isObj(xObj)) {
          _each(_keys(xObj), function(key){
            if (omitKeys.indexOf(key) < 0) {
              retObj[key] = xObj[key];
            }
          });
        }
        return retObj;
      } else {
        return xObj;
      }
    }

    xsr.strZip;
    xsr.strUnzip;
    // simple compress
    function _compress(s) {
      if (xsr.strZip) {
        return xsr.strZip(s);
      }

      var dict = {};
      var data = (s + '').split('');
      var out = [];
      var currChar;
      var phrase = data[0];
      var code = 256;
      for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
          phrase += currChar;
        }
        else {
          out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          dict[phrase + currChar] = code;
          code++;
          phrase=currChar;
        }
      }
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
      }
      return out.join('');
    }

    // simple decompress
    function _deCompress(s) {
      if (xsr.strUnzip) {
        return xsr.strUnzip(s);
      }

      var dict = {};
      var data = (s + '').split('');
      var currChar = data[0];
      var oldPhrase = currChar;
      var out = [currChar];
      var code = 256;
      var phrase;
      for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
          phrase = data[i];
        }
        else {
          phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
      }
      return out.join('');
    }

    function _getSignature(input, keyPrefix) {
      keyPrefix = keyPrefix || '';

      var xSign = keyPrefix;
      var inputType = typeof input;

      if (inputType === 'object') {
        var oKeys = Object.keys(input).sort();
        for(var z = 0; z < oKeys.length; z++)
          xSign += _getSignature(input[ oKeys[z] ], oKeys[z]);
      } else if (inputType === 'function') {
        var fnName = input['name'];
        if (!fnName || fnName === keyPrefix) {
          var fnDef = input.toString();
          fnName = (/function(.*?)\(/.exec(fnDef)[1]).trim();
          if (fnName) {
            xSign += 'F'+fnName;
          } else {
            xSign += fnDef;
          }
        } else {
          xSign += 'F'+fnName;
        }
      } else {
        xSign += input;
      }

      return xSign;
    }
    function _getSign(input) {
      return _compress(_getSignature(input)
          .replace(/\s/g,'_')
          .replace(/\"/g,'d')
          .replace(/\'/g,'s')
          .replace(/\\/g,'b')
          .replace(/\//g,'f')
          .replace(/function/g,'Fn'));
    }
    function _union() {
      var oCollection = {}, xArr;
      for(var i=0; i < arguments.length; i++){
        xArr = arguments[i];
        if (_isArrLike(xArr)) {
          for (var j = 0; j < xArr.length; j++)
            oCollection[_getSign(xArr[j])] = xArr[j];
        } else {
          oCollection[_getSign(xArr)] = xArr;
        }
      }
      _log.log('>>union-collection[keys, obj, src]:', _keys(oCollection), oCollection, arguments);
      var unionArr = [], oKey;
      for (oKey in oCollection) {
        if (oCollection.hasOwnProperty(oKey))
          unionArr.push(oCollection[oKey]);
      }
      oCollection = null;
      return unionArr;
    }
    function _indexOf(xArr, mObj){
      var retValue = -1;
      if (_isArrLike(xArr) && xArr.length && _isObj(mObj)) {
        var mKeys = _keys(mObj), isMatch, srcV, desV;
        if (mKeys.length) {
          for(var i=0; i<xArr.length; i++) {
            for(var j=0; j<mKeys.length; j++){
              srcV = mObj[ mKeys[j] ];
              desV = xArr[i][ mKeys[j] ];
              isMatch = (srcV === desV);
              if (!isMatch) {
                break;
              }
            }
            if (isMatch) {
              retValue = i;
              break;
            }
          }
        }
      }
      return retValue;
    }
    function _extend () {
      var targetObj = ((arguments.length)? arguments[0] : {}) || {};

      if (arguments.length) {
        for (var i = 0, nxtObj; (i < arguments.length); i++) {
          nxtObj = arguments[i];
          if (_isObj(nxtObj)) {
            for (var key in nxtObj) {
              if ((!_isReservedKey(key)) && (_hasOwnProp(nxtObj, key))) {
                targetObj[key] = nxtObj[key];
              }
            }
          } else if (_isArr(nxtObj)) {
            targetObj = _mergeArray.call(null, targetObj, nxtObj);
          }
        }
      }

      return targetObj;
    }
    function _mergeDeep () {
      var targetObj = ((arguments.length)? arguments[0] : {}) || {};

      if (arguments.length) {
        for (var i = 0, nxtObj; (i < arguments.length); i++) {
          nxtObj = arguments[i];
          if (_isObj(nxtObj)) {
            for (var key in nxtObj) {
              if ((!_isReservedKey(key)) && (_hasOwnProp(nxtObj, key))) {
                if (_isObj(nxtObj[key])) {
                  targetObj[key] = _mergeDeep(targetObj[key], nxtObj[key]);
                } else if (_isArr(nxtObj[key])) {
                  targetObj[key] = _mergeArray(targetObj[key], nxtObj[key]);
                } else {
                  targetObj[key] = nxtObj[key];
                }
              }
            }
          } else if (_isArr(nxtObj)) {
            targetObj = _mergeArray.call(null, targetObj, nxtObj);
          }
        }
      }

      return targetObj;
    }
    function _mergeArray () {
      var targetArr = ((arguments.length)? arguments[0] : []) || [];

      if (arguments.length) {
        for (var i = 0, nxtArr; (i < arguments.length); i++) {
          nxtArr = arguments[i];
          if (_isArr(nxtArr)) {
            for (var aIdx = 0; aIdx < nxtArr.length; aIdx++) {
              if (_isUndef(targetArr[aIdx])) {
                targetArr[aIdx] = nxtArr[aIdx];
              } else {
                switch (_of(nxtArr[aIdx])) {
                  case 'object':
                    targetArr[aIdx] = _mergeDeep(targetArr[aIdx], nxtArr[aIdx]);
                    break;
                  case 'array' :
                    targetArr[aIdx] = _mergeArray(targetArr[aIdx], nxtArr[aIdx]);
                    break;
                  case 'undefined' : //Skip
                    break;
                  default:
                    targetArr[aIdx] = nxtArr[aIdx];
                    break;
                }
              }
            }
          }
        }
      }

      return targetArr;
    }
    function _last(xArray, n) {
      var retValue;
      if (_isArrLike(xArray) && xArray.length>0) {
        if (typeof n === 'number' && n > 1) {
          retValue = xArray.slice(-1*n);
        } else {
          retValue = xArray[xArray.length-1];
        }
      }
      return retValue;
    }
  }
  xsr.map      = _map;
  xsr.uniq     = _uniq;
  xsr.omit     = _omit;
  xsr.union    = _union;
  xsr.filter   = _filter;
  xsr.sortBy   = _sortBy;
  xsr.zipObj   = _zipObj;
  xsr.removeOn = _removeOn;
  xsr.each     = xsr.forEach  = _each;
  xsr.every    = xsr.forEvery = _every;
  xsr.some     = xsr.forSome  = _some;
  xsr.indexOf  = _indexOf;
  xsr.extend   = _extend;
  xsr.merge    = _mergeDeep;

  Object.defineProperties(_arrProto, {
    '__now' : {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      }
    },
    '__clone': {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      }
    },
    '__toObject': {
      value : function(valAsKey){
        var retObj = {};
        this.forEach(function(item, index){
          (valAsKey)? retObj[ item ] = index : retObj[ index ] = item;
        });
        return retObj;
      }
    },
    '__unique': {
      value: function() {
        return this.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      }
    },
    '__rotate': {
      value: function(times) {
        times = times || 1;
        if (times>0) {
          while (times--) this.push( this.shift() );
        } else if (times<0) {
          while (times++) this.unshift( this.pop() );
        }
        return this;
      }
    },
    '__has': {
      value: function(value, options) { //options = 'i' | 'b/^' | 'e/$' | 'c/*' | '==' | '<' | '<=' | '>' | '>='
        var retValue; options = (options || '').trim();

        function optionsHas(opt) {
          return (options.indexOf(opt)>=0);
        }

        if (options) {
          if (options.indexOf('i') && _isStr(value)) value = value.toLowerCase();
          for(var i=0; i<this.length; i++){
            var item = this[i];
            if (options.indexOf('i') && _isStr(item)) item = item.toLowerCase();
            switch(true){
              case optionsHas('b'): //beginsWith
              case optionsHas('^'): retValue = optionsHas('~')? value.beginsWithStr( item ) : item.beginsWithStr( value ); break;
              case optionsHas('e'): //beginsWith
              case optionsHas('$'): retValue = optionsHas('~')? value.endsWithStr( item ) : item.endsWithStr( value ); break;
              case optionsHas('c'): //contains
              case optionsHas('*'): retValue = optionsHas('~')? (value.indexOf( item )>=0) : (item.indexOf( value )>=0); break;

              case optionsHas('<') : retValue = (item < value); break;
              case optionsHas('<='): retValue = (item <= value); break;
              case optionsHas('>') : retValue = (item > value); break;
              case optionsHas('>='): retValue = (item >= value); break;

              default:
                retValue = (item == value);
              break;
            }
            if (retValue) break;
          }
        } else {
          retValue = (this.indexOf(value)>=0);
        }
        return retValue;
      }
    },
    '__last': {
      value: function(n) {
        return _last(this, n);
      }
    }
  });

  Object.defineProperties(_objProto, {
    '__now' : {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      }
    },
    '__clone': {
      value: function _obj_clone(){
        return JSON.parse(JSON.stringify(this));
      }
    },
    '__keys': {
      value: function _obj_keys(deep){
        return (deep)? _keysDotted(this) : Object.keys(this);
      }
    },
    '__keysAll': {
      value: function _obj_keysAll(){
        return _keysDotted(this);
      }
    },
    '__hasKey' : {
      value: function _obj_hasKey(key) {
        return xsr.hasKey(this, key);
      }
    },
    '__hasKeys' : {
      value: function _obj_hasKeys(keys) {
        return _isObjHasKeys(this, keys, true);
      }
    },
    '__hasPrimaryKeys': {
      value: function _obj_hasPrimaryKeys(keys){
        return _isObjHasKeys(this, keys);
      }
    },
    '__valueOf' : {
      value: function _obj_getValueOf(path, ifUndefined) {
        return _find(this, path, ifUndefined);
      }
    },
    '__merge': {
      value: function _obj_merge(){
        _arrProto.unshift.call(arguments, this);
        return _mergeDeep.apply(undefined, arguments);
      }
    },
    '__stringify': {
      value: function(){
        return JSON.stringify(this);
      }
    },
    '__toQueryString': {
      value: function(){
        return xsr.toQueryString(this);
      }
    },
    '__extract': {
      value: function(){
        _arrProto.unshift.call(arguments, this);
        return xsr.extract.apply(this, arguments);
      }
    }
  });

  function _getFullPath4Component(url, defaultCompName) {
    var newUrl = url;
    defaultCompName = (defaultCompName||'').replace(/[^a-z0-9]/gi, '/');
    if ('.{$'.indexOf(url[0])>=0) {
      var urlPath = url.split('/')
        , urlRoot = urlPath[0].replace(/[\{\}]/g,'')
        , cName   = (urlRoot == '$' || urlRoot == '.')? defaultCompName : urlRoot.replace(/[\{\$\}]/,'')
        , cPath   = ((xsr.defaults.components.inFolder)? (cName+"/"): '');
      urlPath[0]  = (xsr.defaults.components.rootPath + cPath).trimRightStr('/');
      newUrl = urlPath.join('/');
    }
    return newUrl;
  }

  function _ajaxScriptHandle( responseText ) {
    if (responseText.trim()) {
      var xScript = document.createElement( "script" );
      _attr(xScript, 'id', 'js-'+_now() );
      if (xsr.defaults.csp.nonce) {
        _attr(xScript, 'nonce', xsr.defaults.csp.nonce );
      }
      xScript.text = responseText;
      document.head.appendChild( xScript ).parentNode.removeChild( xScript );
    }
  }

  function _cachedScript(url, options) {
    _log.log('Ajax for script:',url, 'options:',options);
    /* allow user to set any option except for dataType and url */
    url = _getFullPath4Component(url, (options? options['spaComponent'] : '') );
    if (!(url.endsWithStrIgnoreCase( '.js' )) && (url.indexOf('?')<0)) {
      url += xsr.defaults.components.scriptExt;
    }
    options = options || {};
    if (!options.hasOwnProperty('cache')) {
      options['cache'] = true;
    }
    if (!options.hasOwnProperty('dataType')) {
      options['dataType'] = 'javascript';
    }
    options = _extend(options, {
      url: url
    });
    _log.info("Loading Script('" + url + "') ...");
    return $ajax(options);
  }
  function _cachedStyle(styleId, url, options) {
    /* allow user to set any option except for dataType and url */
    var $styleContainerEl = $('#'+styleId, 'head');
    options = options || {};

    if (!options.hasOwnProperty('cache')) {
      options['cache'] = true;
    }
    if (!$styleContainerEl.length) {
      options['cache'] = xsr.defaults.components.offline; //1st load from the server
    }

    options = _extend(options, {
      dataType: "text",
      url: url,
      success: function (cssStyles) {
        $styleContainerEl.remove();
        var styleNonceAttr = (xsr.defaults.csp.nonce)? (' nonce="'+(xsr.defaults.csp.nonce)+'"') : '';
        $("head").append('<style id="' + (styleId) + '" type="text/css"'+styleNonceAttr+'>' + cssStyles + '<\/style>');
      }
    });
    _log.info("Loading style('" + url + "') ... ");
    return $ajax(options);
  }

  /* Add Script Tag */
  xsr.addScriptTag = function (scriptId, scriptSrc) {
    scriptId = scriptId.replace(/#/, "");
    _log.group("spaAddScriptTag");
    if (!_isElementExist("#spaScriptsContainer")) {
      _log.info("#spaScriptsContainer NOT Found! Creating one...");
      $('body').append("<div id='spaScriptsContainer' style='display:none' rel='Dynamic Scripts Container'></div>");
    }
    if (_isElementExist("#" + scriptId)) {
      _log.info("script [" + scriptId + "] already found in local.");
    }
    else {
      _log.info("script [" + scriptId + "] NOT found. Added script tag with src [" + scriptSrc + "]");
      var scriptSrcAttr = (scriptSrc)? (' src="' + scriptSrc + '"') : '';
      var scriptNonceAttr = (xsr.defaults.csp.nonce)? (' nonce="'+(xsr.defaults.csp.nonce)+'"') : '';
      $("#spaScriptsContainer").append('<script id="' + (scriptId) + '" type="text/javascript"'+scriptSrcAttr+scriptNonceAttr+'><\/script>');
    }
    _log.groupEnd("spaAddScriptTag");
  };

  /* Add Style Tag */
  xsr.addStyle = function (styleId, styleSrc) {
    styleId = styleId.replace(/#/, "");
    _log.group("spaAddStyle");
    if (!_isElementExist("#spaStylesContainer")) {
      _log.info("#spaStylesContainer NOT Found! Creating one...");
      $('body').append("<div id='spaStylesContainer' style='display:none' rel='Dynamic Styles Container'></div>");
    }
    if (_isElementExist("#" + styleId)) {
      _log.info("style [" + styleId + "] already found in local.");
    }
    else {
      _log.info("style [" + styleId + "] NOT found. Added link tag with href [" + styleSrc + "]");
      $("#spaStylesContainer").append("<link id='" + (styleId) + "' rel='stylesheet' type='text/css' href='" + styleSrc + "'\/>");
    }
    _log.groupEnd("spaAddStyle");
  };

  /* Loading script */
  xsr.loadScript = function (scriptId, scriptPath, useScriptTag, tAjaxRequests, xOptions) {
    scriptId = scriptId.replace(/#/, "");
    useScriptTag = useScriptTag || false;
    tAjaxRequests = tAjaxRequests || [];
    _log.group("spaScriptsLoad");
    if (_isBlank(scriptPath)) {
      _log.error("script path [" + scriptPath + "] for [" + scriptId + "] NOT defined.");
    }
    else {
      if (useScriptTag) {
        xsr.addScriptTag(scriptId, scriptPath);
      }
      else { /* load script script-URL */
        tAjaxRequests.push(
          _cachedScript(scriptPath, xOptions).done(function (script, textStatus) {
            _log.info("Loaded script [" + scriptId + "] from [" + scriptPath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    _log.groupEnd("spaScriptsLoad");
    return (tAjaxRequests);
  };

  function _getComponentFileName(componentPath) {
    if ((/[^a-z0-9]/gi.test(componentPath))) {
      var xArr = componentPath.split(/[^a-z0-9]/gi);
      return xArr[xArr.length-1];
    } else {
      return componentPath;
    }
  }

  xsr.getComponentsFullPath = function(compNameLst){
    compNameLst = xsr.strToArray(_toObj(compNameLst));
    return _map(compNameLst, function(compName){
        return (xsr.defaults.components.rootPath)+ ((xsr.defaults.components.inFolder || (/[^a-z0-9]/gi.test(compName)))? compName: '') +'/'+(_getComponentFileName(compName))+ (xsr.defaults.components.scriptExt);
      });
  };

  xsr.loadComponents = function(compNameLst, onDone, onFail) {
    var unloadedComponents = _filter(xsr.strToArray(_toObj(compNameLst)), function(compName){
      return (!xsr.components.hasOwnProperty(compName.replace(/[^a-z0-9]/gi,'_') ));
    });
    var scriptFullPathList = xsr.getComponentsFullPath(unloadedComponents);
    xsr.loadScripts(scriptFullPathList, onDone, onFail);
  };

  xsr.loadScripts = function(scriptsLst, onDone, onFail) {
    scriptsLst = xsr.strToArray(_toObj(scriptsLst));

    if (!_isBlank(scriptsLst)) {
      var ajaxQ = [];
      _each(scriptsLst, function(scriptPath) {
        ajaxQ.push(
          _cachedScript(scriptPath).done(function (script, textStatus) {
            _log.info("Loaded script from [" + scriptPath + "]. STATUS: " + textStatus);
          }).fail(function(){
            _log.info("Failed Loading script from [" + scriptPath + "].");
          })
        );
      });

      $ajaxQ.apply($, ajaxQ)
        .then(function(){
          xsr.renderUtils.runCallbackFn(onDone);
        })
        .fail(function(){
          xsr.renderUtils.runCallbackFn(onFail);
        });
    }
  };

  xsr.loadScriptsSync = function(scriptsLst, onDone, onFail) {
    scriptsLst = xsr.strToArray(_toObj(scriptsLst));
    if (_isBlank(scriptsLst)) {
      xsr.renderUtils.runCallbackFn(onDone);
    } else {
      var scriptCache = true, scriptPath = scriptsLst.shift();
      if (scriptPath) {
        if (/^~/.test(scriptPath)) {
          scriptCache = false;
          scriptPath = scriptPath.substr(1);
        }
        _log.info("Load script from   [" + scriptPath + "], cache:",scriptCache);
        _cachedScript(scriptPath, {cache: scriptCache}).done(function() {
          _log.info("Loaded script from [" + scriptPath + "]");
          xsr.loadScriptsSync(scriptsLst, onDone, onFail);
        }).fail(function(){
          console.error("Failed Loading script from [" + scriptPath + "].", arguments);
          xsr.renderUtils.runCallbackFn(onFail);
        });
      } else {
        xsr.loadScriptsSync(scriptsLst, onDone, onFail);
      }
    }
  };

  /* Loading style */
  xsr.loadStyle = function (styleId, stylePath, styleCache, tAjaxRequests) {
    styleId = styleId.replace(/#/, "");
    styleCache = !!styleCache;
    tAjaxRequests = tAjaxRequests || [];
    _log.group("spaStylesLoad");
    if (_isBlank(stylePath)) {
      _log.error("style path [" + stylePath + "] for [" + styleId + "] NOT defined.");
    }
    else {
      var getCss = !styleCache;
      if (styleCache) {
        if ($('#'+styleId, 'head').length) {
          _log.info("Style('" + stylePath + "') already loaded.");
        } else {
          getCss = true;
        }
      }
      if (getCss) {
        //1st load from the server
        tAjaxRequests.push(
          _cachedStyle(styleId, stylePath, {cache: xsr.defaults.components.offline}).done(function (style, textStatus) {
            _log.info("Loaded style [" + styleId + "] from [" + stylePath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    _log.groupEnd("spaStylesLoad");
    return (tAjaxRequests);
  };

  /* Add Template script to BODY */
  xsr.addTemplateScript = function (tmplId, tmplBody, tmplType) {
    tmplId = tmplId.replace(/#/, "");
    tmplType = tmplType  || 'x-template';
    if (!_isElementExist("#spaViewTemplateContainer")) {
      _log.info("#spaViewTemplateContainer NOT Found! Creating one...");
      $('body').append("<div id='spaViewTemplateContainer' style='display:none' rel='Template Container'></div>");
    }
    _log.info("Adding <script id='" + (tmplId) + "' type='text/" + tmplType + "'>");
    var Tag4BlockedScript = '_BlockedScript_';
    tmplBody = tmplBody.replace(/<(\s)*script/gi,'<'+Tag4BlockedScript+' src-ref="'+tmplId+'"').replace(/<(\s)*(\/)(\s)*script/gi,'</'+Tag4BlockedScript)
            .replace(/<(\s)*link/gi,'<_LINKTAGINTEMPLATE_').replace(/<(\s)*(\/)(\s)*link/gi,'</_LINKTAGINTEMPLATE_');

    var scriptNonceAttr = (xsr.defaults.csp.nonce)? (' nonce="'+(xsr.defaults.csp.nonce)+'"') : '';
    $("#spaViewTemplateContainer").append('<script id="'+(tmplId)+'" type="text/'+tmplType+'"'+scriptNonceAttr+'>' + tmplBody + '<\/script>');
  };
  xsr.updateTemplateScript = function (tmplId, tmplBody, tmplType){
    tmplId = tmplId.replace(/#/, "");
    var $tmplScript = $('#spaViewTemplateContainer').find('#'+tmplId);
    if ($tmplScript.length) {
      $tmplScript.remove();
    }
    xsr.addTemplateScript(tmplId, tmplBody, tmplType);
  };

  /* Load external or internal (inline or #container) content as template script */
  xsr.loadTemplate = function (tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions) {
    tmplId = tmplId.replace(/#/g, "");
    tmplPath = (tmplPath.ifBlankStr("inline")).trimStr();
    tmplPath = ((tmplPath==='.') || (tmplPath==='#'))? 'inline' : tmplPath;
    templateType = templateType || "x-template";
    viewContainerId = viewContainerId || "#DummyInlineTemplateContainer";
    tAjaxRequests = tAjaxRequests || [];
    tmplAxOptions = tmplAxOptions || {};
    _log.group("spaTemplateAjaxQue");
    if (!_isElementExist("#"+tmplId)) {
      _log.info("Template[" + tmplId + "] of [" + templateType + "] NOT found. Source [" + tmplPath + "]");
      if (tmplPath && tmplPath == "undefined") {
        xsr.addTemplateScript(tmplId, '', templateType);
        _log.info("Loaded Empty Template[" + tmplId + "] of [" + templateType + "]");
      } else if ((tmplPath.equalsIgnoreCase("inline") || tmplPath.beginsWithStr("#"))) { /* load from viewTargetContainer or local container ID given in tmplPath */
        var localTemplateSrcContainerId = tmplPath.equalsIgnoreCase("inline")? viewContainerId : tmplPath;
        var $localTemplateSrcContainer = $(localTemplateSrcContainerId);
        var inlineTemplateHTML = $localTemplateSrcContainer.html();
        if (_isBlank(inlineTemplateHTML)) {
          _log.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined inline in ["+localTemplateSrcContainerId+"].");
        }
        else {
          xsr.addTemplateScript(tmplId, inlineTemplateHTML, templateType);
          if (tmplPath.equalsIgnoreCase("inline")) $localTemplateSrcContainer.html("");
        }
      }
      else if (tmplPath.equalsIgnoreCase("none")) {
        _log.info("Template[" + tmplId + "] of [" + templateType + "] defined as NONE. Ignoring template.");
      }
      else if (!tmplPath.equalsIgnoreCase("script")) { /* load from template-URL */

        var axMethod = String(tmplAxOptions['method'] || 'get').toLowerCase();
        if (tmplAxOptions['params']) {
          tmplPath = xsr.api.url(tmplPath, tmplAxOptions['params']);
        }
        _log.info(">>>>>>>>>> Making New Template Request");

        var axTemplateRequest = $ajax({
          url: tmplPath,
          method: axMethod,
          headers : tmplAxOptions['headers'],
          data: tmplAxOptions['payload'],
          cache: xsr.defaults.components.offline, //1st load from the server
          dataType: 'html',
          onTmplError: tmplAxOptions['onError'],
          success: function (template) {
            xsr.addTemplateScript(tmplId, template, templateType);
            _log.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            if (this.onTmplError && _isFn(this.onTmplError)) {
              this.onTmplError.call(this, jqXHR, textStatus, errorThrown);
            }
            _log.error("Failed Loading Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]. [" + textStatus + ":" + errorThrown + "]");
          }
        });

        tAjaxRequests.push(axTemplateRequest);
      } else {
        _log.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined in <script>.");
      }
    }
    else {
      var $tmplId = $("#"+tmplId);
      if (tmplReload) {
        _log.info("Reload Template[" + tmplId + "] of [" + templateType + "]");
        $tmplId.remove();
        tAjaxRequests = xsr.loadTemplate(tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions);
      } else if (_isBlank(($tmplId.html()))) {
        _log.warn("Template[" + tmplId + "] of [" + templateType + "] script found EMPTY!");
        var externalPath = "" + $tmplId.attr("path");
        if (!_isBlank((externalPath))) {
          templateType = ((($tmplId.attr("type")||"").ifBlankStr(templateType)).toLowerCase()).replace(/text\//gi, "");
          _log.info("prepare/remove to re-load Template[" + tmplId + "]  of [" + templateType + "] from external path: [" + externalPath + "]");
          $tmplId.remove();
          tAjaxRequests = xsr.loadTemplate(tmplId, externalPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions);
        }
      } else {
        _log.info("Template[" + tmplId + "]  of [" + templateType + "] already found in local.");
      }
    }
    _log.groupEnd("spaTemplateAjaxQue");

    return (tAjaxRequests);
  };

  /*Get URL Parameters as Object
   * if url = http://xyz.com/page?param0=value0&param1=value1&paramX=valueA&paramX=valueB
   * xsr.urlParams() => {param0: "value0", param1:"value1", paramX:["valueA", "valueB"]}
   * xsr.urlParams()["param0"] => "value0"
   * xsr.urlParams().param0    => "value0"
   * xsr.urlParams().paramX    => ["valueA", "valueB"]
   * xsr.urlParams().paramZ    => undefined
   * */
  xsr.urlParams = function (urlQuery) {
    urlQuery = (urlQuery || window.location.search || "");
    urlQuery = (urlQuery.beginsWithStr("\\?") || urlQuery.indexOf("//") < 7) ? urlQuery.substr(urlQuery.indexOf("?") + 1) : urlQuery;
    var qParams = {};
    urlQuery.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function (match, key, value) {
      (qParams[key] = qParams[key] || []).push(decodeURIComponent(value));
    });
    _each(qParams, function (value, key) {
      qParams[key] = (_isArr(value) && value.length == 1) ? value[0] : value;
    });
    return qParams;
  };
  /*Get URL Parameter value
   * if url = http://xyz.com/page?param0=value0&param1=value1&paramX=valueA&paramX=valueB
   * xsr.urlParam("param0") => "value0"
   * xsr.urlParam("paramX") => ["valueA", "valueB"]
   * xsr.urlParam("paramZ") => undefined
   * */
  xsr.urlParam = function (name, queryString) {
    return (xsr.urlParams(queryString)[name]);
  };

  var _winLocHash_='';
  /*Get URL Hash value
   * current window location = http://xyz.com/page#/hash0/hash1/hash2
   * xsr.getLocHash()   => "#/hash0/hash1/hash2"
   * */
  xsr.getLocHash = function(urlHashBase){
    var urlHash = (_winLocHash_ || window.location.hash).replace('#','');
    //if (!urlHash && !_isUndef(urlHashBase) && (urlHashBase!='#')) {
    if (!(urlHash || _isUndef(urlHashBase) || urlHashBase=='#')) {
      urlHash = (window.location.pathname)
                .replace(/(\/)*(index|default)\.([a-z])*/i,'')
                .replace((urlHashBase.replace(/\s*/g, '').trimRightStr("/")), '');
    }
    return urlHash;
  };
  /*Get URL Hash value
   * if url = http://xyz.com/page#/hash0/hash1/hash2
   * xsr.urlHash()   => "/hash0/hash1/hash2"
   * xsr.urlHash(1)  => "hash1"
   * xsr.urlHash([]) => ["hash0", "hash1", "hash2"]
   * xsr.urlHash(["key0", "key1", "key3"]) => {"key0":"hash0", "key1":"hash1", "key2":"hash2"}
   * */
  xsr.urlHash = function (returnOf, urlHashBase) {
    var hashDelimiter = "/", retValue = xsr.getLocHash(urlHashBase);
    if (returnOf || _isNum(returnOf)) {
      retValue = retValue.beginsWithStr(hashDelimiter) ? retValue.substring(retValue.indexOf(hashDelimiter) + (hashDelimiter.length)) : retValue;
      var hashArray = (retValue.length)? retValue.split(hashDelimiter) : [];
      if (_isNum(returnOf)) {
        if (returnOf<0) {
          retValue = hashArray[hashArray.length-1];
        } else {
          retValue = (hashArray && hashArray.length > returnOf) ? hashArray[returnOf] : "";
        }
      }
      else if (_isArr(returnOf)) {
        retValue = (returnOf.length === 0) ? hashArray : _zipObj(returnOf, hashArray);
      } else if (_isStr(returnOf) && returnOf == "?") {
        retValue = (retValue.containsStr("\\?"))? xsr.getOnSplit(retValue, "?", 1) : "";
      }
    }
    return retValue;
  };
  function _getAboluteUrl(base, url){
    return ((base || '').trimRightStr('/'))+'/'+((url || '').trimLeftStr('/'));
  }
  xsr.urlHashFull = function(urlHashBase) {
    urlHashBase = urlHashBase || '#';
    return _getAboluteUrl(urlHashBase, xsr.urlHash('', urlHashBase));
  };
  /*Similar to xsr.urlParam on HashParams*/
  xsr.hashParam = function (name) {
    var retValue = (''+xsr.urlHash('?'));
    if (typeof name !== "undefined" && !_isBlank(retValue)) {
      retValue = xsr.urlParam((''+name), retValue);
    }
    return (retValue);
  };

  /* i18n support */
  var _i18nStore = {};
  var _i18nLoaded;

  xsr.i18n = _i18nTextValue;
  xsr.i18n.loaded = false;
  xsr.i18n.settings = {
    name: 'Language',
    path: 'language/',
    ext: '.txt'
  };

  /* Ensure language code is in the format aa_AA. */
  function _normalizeLanguageCode(lang) {
    if (!lang || lang.length < 2) {
      lang = (navigator.languages) ? navigator.languages[0]
                                        : (navigator.language || navigator.userLanguage /* IE */ || 'en');
    }
    lang = lang.toLowerCase().replace(/-/,"_"); // some browsers report language as en-US instead of en_US
    if (lang.length > 3) {
      lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
    }
    return lang;
  }

  function _init_i18n_Lang(settings) {
    // set up settings
    var defaults = {
      language: '',
      name: 'Language',
      path: 'language/',
      ext: '.txt',
      cache: true,
      async: true,
      callback: null
    };
    settings = _extend(defaults, settings);

    _i18nStore = {}; //clear previous dictionary

    // Try to ensure that we have minimum a two letter language code
    var langCode     = _normalizeLanguageCode(settings.language)
      , langFilePath = settings.path + settings.name
      , langExt      = settings.ext || '.properties'
      , langFileFullPath = langFilePath + langExt;

    if (langCode.length >= 5) {
      // 1. with country code (eg, Language_en_US.properties)
      langFileFullPath = langFilePath + '_' + (langCode.substring(0, 5)) + langExt;
    } else if (langCode.length >= 2) {
      langFileFullPath =
      // 2. without country code (eg, Language_pt.properties)
      langFileFullPath = langFilePath + '_' + (langCode.substring(0, 2)) + langExt;
    }
    _loadAndParseLangFile(langFileFullPath, settings);
  }

  function _loadAndParseLangFile(filename, settings) {
    $ajax({
      url: filename,
      async: settings.async,
      cache: settings.cache,
      dataType: 'text',
      success: function (data) {
        if (data) {
          _parseLangFile(data);
          if (settings.callback) {
            settings.callback();
          }
        }
      },
      error: function () {
        console.log('Failed to download language file: ' + filename);
        if (settings.callback) {
          settings.callback();
        }
      }
    });
  }

  /* unicode ('\u00e3') to char */
  function unicodeToChar(str) {
    // unescape unicode codes
    var codes = [];
    var code = parseInt(str.substr(2), 16);
    if (code >= 0 && code < Math.pow(2, 16)) {
      codes.push(code);
    }
    // convert codes to text
    var unescaped = '';
    for (var i = 0; i < codes.length; ++i) {
      unescaped += String.fromCharCode(codes[i]);
    }
    return unescaped;
  }

  function _parseLangFile(data) {
    var parameters = data.split(/\n/);
    var unicodeRE = /(\\u.{4})/ig;
    for (var i = 0; i < parameters.length; i++) {
      parameters[i] = parameters[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim
      if (parameters[i].length > 0 && parameters[i].match("^#") != "#") { // skip comments
        var pair = parameters[i].split('=');
        if (pair.length > 0) {
          /** Process key & value */
          var name = decodeURI(pair[0]).replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim
          var value = pair.length == 1 ? "" : pair[1];
          // process multi-line values
          while (value.match(/\\$/) == "\\") {
            value = value.substring(0, value.length - 1);
            value += parameters[++i].replace(/\s\s*$/, ''); // right trim
          }
          // Put values with embedded '='s back together
          for (var s = 2; s < pair.length; s++) {
            value += '=' + pair[s];
          }
          value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim

          // handle unicode chars possibly left out
          var unicodeMatches = value.match(unicodeRE);
          if (unicodeMatches) {
            for (var u = 0; u < unicodeMatches.length; u++) {
              value = value.replace(unicodeMatches[u], unicodeToChar(unicodeMatches[u]));
            }
          }

          // add to store
          _i18nStore[name] = value;

        } // END: if(pair.length > 0)
      } // END: skip comments
    }
    _i18nLoaded = true;
  }

  function _i18nRaw(key /* Add parameters as function arguments as necessary  */) {
    var value = _i18nStore[key];
    if (_is(value,'null|undefined')) return key;

    var i, j;
    if (typeof(value) == 'string') {
      // Handle escape characters.
      i = 0;
      while ((i = value.indexOf('\\', i)) != -1) {
        if (value.charAt(i + 1) == 't')
          value = value.substring(0, i) + '\t' + value.substring((i++) + 2); // tab
        else if (value.charAt(i + 1) == 'r')
          value = value.substring(0, i) + '\r' + value.substring((i++) + 2); // return
        else if (value.charAt(i + 1) == 'n')
          value = value.substring(0, i) + '\n' + value.substring((i++) + 2); // line feed
        else if (value.charAt(i + 1) == 'f')
          value = value.substring(0, i) + '\f' + value.substring((i++) + 2); // form feed
        else if (value.charAt(i + 1) == '\\')
          value = value.substring(0, i) + '\\' + value.substring((i++) + 2); // \
        else
          value = value.substring(0, i) + value.substring(i + 1); // Quietly drop the character
      }

      // Handle Quotes
      i = 0;
      while (i < value.length) {
        if (value.charAt(i) == '\'') {
          // Handle quotes
          if (i == value.length - 1)
            value = value.substring(0, i); // Silently drop the trailing quote
          else if (value.charAt(i + 1) == '\'')
            value = value.substring(0, i) + value.substring(++i); // Escaped quote
          else {
            // Quoted string
            j = i + 2;
            while ((j = value.indexOf('\'', j)) != -1) {
              if (j == value.length - 1 || value.charAt(j + 1) != '\'') {
                // Found start and end quotes. Remove them
                value = value.substring(0, i) + value.substring(i + 1, j) + value.substring(j + 1);
                i = j - 1;
                break;
              }
              else {
                // Found a double quote, reduce to a single quote.
                value = value.substring(0, j) + value.substring(++j);
              }
            }

            if (j == -1) {
              // There is no end quote. Drop the start quote
              value = value.substring(0, i) + value.substring(i + 1);
            }
          }
        }
        else
          i++;
      }
    }

    if (value.length == 0)
      return "";
    if (value.length == 1 && typeof(value[0]) == "string")
      return value[0];

    var str = "";
    for (i = 0; i < value.length; i++) {
      if (typeof(value[i]) == "string")
        str += value[i];
      else
        str += "{" + value[i] + "}";
    }
    return str;

  }

  function _i18nTextValue(i18nKey, data) {
    var dMessage = xsr.i18n.value(i18nKey);
    if (data && _is(data, 'object|array') ) {
      var msgParamValue = "", msgParamValueTrim="";
      _each(_keys(data), function (key) {
        msgParamValue = ""+data[key]; msgParamValueTrim = msgParamValue.trim();
        if (msgParamValue && (msgParamValueTrim.beginsWithStrIgnoreCase("i18n:") || msgParamValueTrim.beginsWithStrIgnoreCase("@")) ) msgParamValue = xsr.i18n.value(msgParamValueTrim);
        dMessage = dMessage.replace(new RegExp("{\\s*("+(key.trim())+")\\s*}", "g"), msgParamValue);
      });
    }

    var lookupKeys=[i18nKey], isDuplicateKey;
    function parseMessage( xMsg ){
      var varList = xsr.extractStrBetweenEx(xMsg, '{', '}', true);
      if (!_isBlank(varList)) {
        _each(varList, function(key){
          isDuplicateKey = (isDuplicateKey || lookupKeys.indexOf(key)>=0);
          if (!isDuplicateKey) {
            lookupKeys.push(key);
            xMsg = xMsg.replace((new RegExp('{\\s*('+(key.trim())+')\\s*}', 'g')), xsr.i18n.value(key));
          }
        });

        if (isDuplicateKey) {
          console.error('i18nKey circular issue found:', lookupKeys.join(' > '));
          return xMsg;
        } else {
          return parseMessage( xMsg );
        }
      }
      return xMsg;
    }

    return parseMessage(dMessage);
  }
  xsr.i18n.browserLang = function(){
    return (navigator)? (navigator.language || navigator.userLanguage || 'en_US') : 'en_US';
  };
  xsr.i18n.setLanguage = function (lang, i18nSettings) {
    lang = (lang || xsr.i18n.browserLang()).replace(/-/g, "_");
    i18nSettings = _extend(xsr.i18n.settings, i18nSettings);
    _init_i18n_Lang({
      language: lang,
      name: i18nSettings.name,
      path: i18nSettings.path,
      ext: i18nSettings.ext,
      cache: i18nSettings.cache,
      async: i18nSettings.async,
      callback: function () {
        if (!_isElementExist('#i18nSpaRunTime')) {
          $("body").append('<div id="i18nSpaRunTime" style="display:none"></div>');
        }
        _i18nLoaded = (typeof _i18nLoaded == "undefined") ? (!_isEmptyObj(_i18nStore)) : _i18nLoaded;
        xsr.i18n.loaded = xsr.i18n.loaded || _i18nLoaded;
        if ((lang.length > 1) && (!_i18nLoaded)) {
          _log.warn("Error Loading Language File [" + lang + "]. Loading default.");
          xsr.i18n.setLanguage("_", i18nSettings);
        }
        xsr.i18n.apply();
        if (i18nSettings.callback) {
          i18nSettings.callback(_i18nLoaded);
        }
      }
    });
  };

  function _setLang(uLang, options, isAuto) {
    if (uLang) {
      if (xsr.i18n.onLangChange) {
        var fnOnLangChange = xsr.i18n.onLangChange,
            nLang = (_isFn(fnOnLangChange))? fnOnLangChange.call(undefined, uLang, isAuto) : uLang;
        uLang = (_isStr(nLang))? nLang : uLang;
      }
      $('html').attr('lang', uLang.replace('_', '-'));
      xsr.i18n.setLanguage(uLang, _mergeDeep({}, xsr.defaults.lang, _find(window, 'app.conf.lang', {}), _find(window, 'app.lang', {}), (options||{}) ));
    }
  }
  xsr.i18n.setLang = function(lang, i18nSettings){
    _setLang(lang, i18nSettings);
  };

  xsr.i18n.value = function(i18nKey) {
    if (xsr.i18n.loaded || window['Liferay']) {
      i18nKey = (''+i18nKey).replace(/i18n:/i, '').trim();
      if (i18nKey.beginsWithStrIgnoreCase('@')) {
        i18nKey = ((i18nKey.substr(1)).trim());
        i18nKey = _find(window, i18nKey, i18nKey);
      }
      return _i18nValue(i18nKey);

      function _i18nValue(iKey){
        var retStr = iKey;
        try {
          retStr = (''+((!xsr.i18n.loaded && window['Liferay'])? Liferay.Language.get(iKey) : _i18nRaw(iKey))).trim();
//          if (retStr.beginsWithStr('\\[') && retStr.endsWithStr(']')) {
//            retStr = _stripEnds(retStr);
//          }
        } catch(e){
          console.warn('i18n lookup error:', e);
        }
        return retStr;

//        function _stripEnds(Str) {
//          return Str.substring(1, Str.length-1);
//        }
      }
    } else {
      _log.info('jQ-xsr.i18n module not found. Skipping i18n value lookup.');
      return i18nKey;
    }
  };

  xsr.i18n.text = _i18nTextValue;

  xsr.i18n.update = function(elSelector, i18nKeySpec, apply){
    i18nKeySpec = i18nKeySpec || '';
    var $el = $(elSelector), oldSpec = $el.attr('data-i18n') || '', newSpec = '', oldSpecJSON, newSpecJSON;

    if (_isBlank(oldSpec) || (i18nKeySpec.indexOf(':')==0) || (i18nKeySpec.indexOf('=')==0) || ((oldSpec.indexOf(':')<=0) && (i18nKeySpec.indexOf(':')<=0)) ) {
      newSpec = i18nKeySpec.trimLeftStr(':').trimLeftStr('=');
    } else {
      oldSpecJSON = (oldSpec.indexOf(':')>0)?     _toObj(oldSpec||{})     : {html: (oldSpec.trimLeftStr(':').replace(/'/g,'')) };
      newSpecJSON = (i18nKeySpec.indexOf(':')>0)? _toObj(i18nKeySpec||{}) : {html: (i18nKeySpec.trimLeftStr(':').replace(/'/g,'')) };

      _each(_keys(oldSpecJSON), function(key){
        _each(key.split('_'), function(sKey){
          if (sKey) oldSpecJSON[sKey] = oldSpecJSON[key];
        });
      });
      _each(_keys(newSpecJSON), function(key){
        _each(key.split('_'), function(sKey){
          if (sKey) newSpecJSON[sKey] = newSpecJSON[key];
        });
      });

      var finalSpec = _mergeDeep({}, oldSpecJSON, newSpecJSON);
      _each(_keys(finalSpec), function(key){
        if (key.indexOf('_')<=0){
          newSpec += key+":'"+(finalSpec[key])+"',";
        }
      });
      newSpec = newSpec.trimRightStr(',');
    }

    $el.attr('data-i18n', newSpec).data('i18n', newSpec);
    if (apply || _isUndef(apply)) xsr.i18n.apply(elSelector);
    return $el;
  };

  xsr.i18n.apply = xsr.i18n.render = function (contextRoot, elSelector) {
    contextRoot = contextRoot || "html";
    elSelector = elSelector || "";
    var isTag = contextRoot.beginsWithStr("<");
    if (isTag) {
      $('#i18nSpaRunTime').html( contextRoot );
      contextRoot = '#i18nSpaRunTime';
    }

    var $i18nElements = $(contextRoot).find(elSelector + "[data-i18n]");
    if (!$i18nElements.length) $i18nElements = $(contextRoot).filter(elSelector + "[data-i18n]");
    $i18nElements.each(function (indes, el) {
      var $el = $(el),
          i18nSpecStr = $el.data("i18n") || '';
      if ((i18nSpecStr) && (!i18nSpecStr.containsStr(':'))) i18nSpecStr = "html:'"+i18nSpecStr+"'";
      var i18nSpec = _toObj(i18nSpecStr || "{}"),
          i18nData = i18nSpec['data'] || i18nSpec['i18ndata'];
      if (i18nData) {
        delete i18nSpec['data'];
        delete i18nSpec['i18ndata'];
      } else {
        i18nData = _toObj($el.data("i18nData") || "{}");
      }
      if (i18nSpec && !_isEmptyObj(i18nSpec)) {
        _each(_keys(i18nSpec), function (attrSpec) {
          var i18nKey = i18nSpec[attrSpec];
          var i18nValue = xsr.i18n.text(i18nKey, i18nData);
          _each(attrSpec.split("_"), function (attribute) {
            switch (attribute.toLowerCase()) {
              case "html":
                $el.html( xsr.sanitizeXSS(i18nValue) );
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

    if (isTag) {
      return $('#i18nSpaRunTime').html();
    }
  };

  function _pipeSort(inVal, reverse) {
    var retValue = inVal;
    if (_isArr(inVal)) {
      retValue = inVal.sort();
      if (reverse) retValue = retValue.reverse();
    } else if (_isStr(inVal)) {
      var splitBy;
      switch(true) {
        case (inVal.indexOf(',')>=0):
          splitBy = ',';
        break;
        case (inVal.indexOf(' ')>=0):
          splitBy = ' ';
        break;
      }
      if (splitBy) {
        retValue = inVal.split(splitBy).sort().join(splitBy);
        if (reverse) retValue = retValue.reverse();
      }
    }
    return retValue;
  }

  function _pipeLower(str) {
    return (''+str).toLowerCase();
  }
  function _pipeUpper(str) {
    return (''+str).toUpperCase();
  }
  function _pipeTitle(str) {
    return (''+str).toTitleCase();
  }

  xsr.pipes = {
    trimLeft: function(str) {
      return (''+str).trimLeftStr();
    },
    trimRight: function(str) {
      return (''+str).trimRightStr();
    },
    normalize: function(str) {
      return (''+str).normalizeStr();
    },

    lower      : _pipeLower,
    lowerCase  : _pipeLower,
    toLower    : _pipeLower,

    upper      : _pipeUpper,
    upperCase  : _pipeUpper,
    toUpper    : _pipeUpper,

    title      : _pipeTitle,
    titleCase  : _pipeTitle,
    toTitleCase: _pipeTitle,

    capitalize: function(str) {
      return (''+str).capitalize();
    },
    unCapitalize: function(str) {
      return (''+str).unCapitalize();
    },
    not: function(inVal) {
      return !inVal;
    },
    sort: function(inVal){
      return _pipeSort(inVal);
    },
    sortAsc: function(inVal){
      return _pipeSort(inVal);
    },
    sortDesc: function(inVal){
      return _pipeSort(inVal, true);
    },
    reverse: function(inVal) {
      var retValue = inVal;
      if (_isArr(inVal)) {
        retValue = inVal.reverse();
      } else if (_isStr(inVal)) {
        var splitBy;
        switch(true) {
          case (inVal.indexOf(',')>=0):
            splitBy = ',';
          break;
          case (inVal.indexOf(' ')>=0):
            splitBy = ' ';
          break;
        }
        if (splitBy) retValue = inVal.split(splitBy).reverse().join(splitBy);
      }
      return retValue;
    }
  };

  function _defaultAttr(el){
    var elAttr = 'html';
    switch((el.tagName).toUpperCase()){
      case 'INPUT':
        switch ((el.type).toLowerCase()) {
          case "checkbox":
          case "radio":
            elAttr = 'check';
            break;
          default:
            elAttr = 'value';
            break;
        }
        break;
      case 'TEXTAREA':
        elAttr = 'value';
        break;
      case "SELECT":
        elAttr = 'options';
        break;
    }
    return elAttr;
  }

  function _maskHandlebars(inTmpl){
    return inTmpl
      .replace(/<img /gi, '<IMG-X-TMP ')
      .replace(/<iframe /gi, '<IFRAME-X-TMP ')
      .replace(/<\/iframe/gi, '</IFRAME-X-TMP')
      .replace(/{{/g  , '><!--_XHBTINSPA_{{')
      .replace(/}}/g  , '}} _XHBTINSPA_-->');
  }
  function _unmaskHandlebars(inTmpl){
    return inTmpl
      .replace(/(\/)*&gt;/g, '>')
      .replace(/ _XHBTINSPA_--(>|&gt;)/gi, '')
      .replace(/(>|&gt;)(<|&lt;)!--_XHBTINSPA_/gi, '')
      .replace(/<IMG-X-TMP /gi, '<img ')
      .replace(/<IFRAME-X-TMP /gi, '<iframe ')
      .replace(/<\/IFRAME-X-TMP/gi, '</iframe');
  }

  xsr.dataBind = xsr.bindData = function (contextRoot, data, elFilter, skipBindCallback) {
    // console.log('spaBind>', arguments);
    contextRoot = contextRoot || 'body';
    elFilter = elFilter || '';

    var $contextRoot, onVirtualDOM = (_isStr(contextRoot) && (/\s*</).test(contextRoot)), blockedScriptTagName;
    if (onVirtualDOM) {
      blockedScriptTagName = 'blocked-script-in-template';
      var bindTmplHtml = contextRoot.replace(/<\s*script/gi,'<'+blockedScriptTagName)
                                    .replace(/<\s*(\/)\s*script/gi,'</'+blockedScriptTagName)
                                    .replace(/<\s*textarea/gi,'<spa-vdom-textarea')
                                    .replace(/<\s*(\/)\s*textarea/gi,'</spa-vdom-textarea');
      $contextRoot = $('<div style="display:none">'+bindTmplHtml+'</div>');
    } else {
      $contextRoot = $(contextRoot);
    }

    if (_isBlank(data)) {
      return $contextRoot;
    }

    var compName = ''; //pre-render-time
    if (elFilter[0]=='$') { compName = elFilter.substr(1).trim(); elFilter = ''; }
    compName = compName || $contextRoot.attr('data-rendered-component');
    var tmplStoreName = compName || '_unknown_';
    //console.log('compName>', tmplStoreName);

    var templateData = _mergeDeep({__computed__:{}}, data);
    var $dataBindEls = $contextRoot.find(elFilter + '[data-bind]');
    if (!$dataBindEls.length) $dataBindEls = $contextRoot.filter(elFilter + '[data-bind]');

    if ($dataBindEls.length && !onVirtualDOM && compName) {
      //Exclude elements which are part of inner components
      //Include elements which are part of this component only
      $dataBindEls = $dataBindEls.filter(function(){
        return ($(this).closest('[data-rendered-component]').attr('data-rendered-component') == compName);
      });
    }

    var $el, bindSpecStr, bindSpec, bindKeyFn, bindKey, fnFormat, bindValue, dataAttrKey, bindCallback, negate;

    function _getValue(key) {
      key = (key || '').trim();
      return (key[0] == '#')? key : _find(templateData, key, key);
    }

    function _templateDynId(type, key) {
      return ['_runTimeTemplate',type,compName,(key.replace(/[^a-z0-9]/gi,'_')),(_now())].join('_');
    }
    function _inlineTemplate(templateId, template) {
      if (!xsr.compiledTemplates4DataBind.hasOwnProperty(tmplStoreName)) {
        xsr.compiledTemplates4DataBind[tmplStoreName] = {};
      }
      return xsr.compiledTemplates4DataBind[tmplStoreName][templateId] = (Handlebars.compile( _unmaskHandlebars(template) ));
    }

    function _formatBindValue(fnFormat, bindValue, bindKey, el) {
      fnFormat = fnFormat.trim();
      var retValue = bindValue;
      var fnName = fnFormat.trim();
      var idxFnBrace = fnName.indexOf('(');
      var fnArgs = [];
      if (idxFnBrace>0) {
        fnName = fnName.substr(0, idxFnBrace);
      }
      if (fnName[0]=='.') {
        fnName = fnName.substr(1);
        if (xsr.pipes.hasOwnProperty(fnName)) {
          fnName = 'xsr.pipes.'+fnName;
        } else {
          fnArgs = fnFormat.substring(idxFnBrace+1, fnFormat.indexOf(')')).trim();
          fnArgs = (fnArgs)? fnArgs.split(',').map(function(arg){ return _strToNative(arg); }) : [];
          try {
            retValue = bindValue[fnName].apply(bindValue, fnArgs);
          }catch(e){
            console.warn('Error calling format function .'+fnName+'() on:', bindValue, el, e);
          }
          return retValue;
        }
      }
      return xsr.renderUtils.runCallbackFn(fnName, ['(...)', bindValue, bindKey, templateData, el], el);
    }

    _each($dataBindEls, function(el) {
      $el = $(el);
      bindSpecStr = $el.data('bind') || '';

      if ((bindSpecStr) && (!bindSpecStr.containsStr(':'))) bindSpecStr = _defaultAttr(el)+":'"+bindSpecStr+"'";
      bindSpec = _toObj(bindSpecStr || '{}');
      bindCallback = xsr.renderUtils.getFn($el.attr('data-bind-callback') || '');

      if (bindSpec && !_isEmptyObj(bindSpec)) {

        _each(_keys(bindSpec), function (attrSpec) {
          bindKeyFn = (bindSpec[attrSpec]+'|').split('|');
          bindKey   = bindKeyFn.shift().trim();
          negate    = (bindKey[0]=='!');
          if (negate) {
            bindKey   = (bindKey.substr(1).trim());
            bindValue = !_getValue(bindKey);
          } else {
            bindValue = _getValue(bindKey);
          }

          if (_is(bindValue, 'undefined|null')) bindValue = '';

          for (var fIdx=0; fIdx<bindKeyFn.length; fIdx++){
            fnFormat = bindKeyFn[fIdx].trim();
            if (fnFormat) {
              if (fnFormat[0]=='!') {
                if (fnFormat == '!') {
                  bindValue = !bindValue;
                } else {
                  fnFormat = fnFormat.substr(1).trim();
                  bindValue = !_formatBindValue(fnFormat, bindValue, bindKey, el);
                  //bindValue = !xsr.renderUtils.runCallbackFn(fnFormat, ['(...)', bindValue, bindKey, templateData, el], el);
                }
              } else {
                bindValue = _formatBindValue(fnFormat, bindValue, bindKey, el);
                //bindValue = xsr.renderUtils.runCallbackFn(fnFormat, ['(...)', bindValue, bindKey, templateData, el], el);
              }
            }
          }

          _each(attrSpec.split("_"), function (attribute) {
            var computedKey='';
            attribute = attribute.trim();
            // console.log('[',attribute,']',bindKey,'=',bindValue);
            if (!_isUndef(bindValue)) {
              switch (attribute.toLowerCase()) {
                case 'html':
                  $el.html( xsr.sanitizeXSS(bindValue) );
                  break;
                case 'text':
                  $el.text(bindValue);
                  break;
                case 'value':
                  _attr(el, 'value', bindValue);
                  break;

                case 'options':
                  var beginsAt = bindSpec['startAt'] || _attr(el, 'data-options-from') || 0;
                  var sortOn   = bindSpec['sortOn']  || _attr(el, 'data-sort-on') || 0;
                  var sortBy   = bindSpec['sortBy']  || _attr(el, 'data-sort-by') || '';
                  if (bindSpec['valueKey']) {
                    _attr(el, 'data-value-key', bindSpec['valueKey']);
                  }
                  if (bindSpec['textKey']) {
                    _attr(el, 'data-text-key', bindSpec['textKey']);
                  }
                  xsr.optionsList(el, bindValue, beginsAt, sortOn, sortBy);

                  delete bindSpec['options'];
                  delete bindSpec['sortOn'];
                  delete bindSpec['sortBy'];
                  delete bindSpec['startAt'];
                  delete bindSpec['valueKey'];
                  delete bindSpec['textKey'];
                  break;
                case 'sorton':
                case 'sortby':
                case 'startat':
                case 'valuekey':
                case 'textkey':
                  break;

                case 'selectvalue':
                case 'selectedvalue':
                  if (bindSpec.hasOwnProperty('options')) {
                    console.warn('Incorrect Order. Move options: first, finally select...', el);
                  } else if ((/select/i).test(el.tagName)) {
                    if (el.hasAttribute('multiple')) {
                      if (!_isArr(bindValue)) {
                        var splitByStr = _attr(el, 'data-split-by') || ',';
                        bindValue = (''+bindValue).split(splitByStr).map(function(v){ return v.trim(); });
                      }
                      _selectOptionsFor(el, 'value', bindValue);
                    } else {
                      xsr.selectOptionForValue(el, bindValue);
                    }
                  }
                  break;

                case 'selecttext':
                case 'selectedtext':
                  if (bindSpec.hasOwnProperty('options')) {
                    console.warn('Incorrect Order. Move options: first, finally select...', el);
                  } else if ((/select/i).test(el.tagName)) {
                    if (el.hasAttribute('multiple')) {
                      if (!_isArr(bindValue)) {
                        var splitByStr = _attr(el, 'data-split-by') || ',';
                        bindValue = (''+bindValue).split(splitByStr).map(function(v){ return v.trim(); });
                      }
                      _selectOptionsFor(el, 'text', bindValue);
                    } else {
                      xsr.selectOptionForText(el, bindValue);
                    }
                  }
                  break;

                case 'selectindex':
                case 'selectedindex':
                  if (bindSpec.hasOwnProperty('options')) {
                    console.warn('Incorrect Order. Move options: first, finally select...', el);
                  } else if ((/select/i).test(el.tagName)) {
                    if (el.hasAttribute('multiple')) {
                      if (!_isArr(bindValue)) {
                        var splitByStr = _attr(el, 'data-split-by') || ',';
                        bindValue = (''+bindValue).split(splitByStr).map(function(v){ return v.trim(); });
                      }
                      bindValue.forEach(function(idx){
                        if (_isEl(el.options[+idx])) {
                          el.options[+idx].selected = true;
                          _attr(el.options[+idx], 'selected', '');
                        }
                      });
                    } else {
                      if (_isEl(el.options[+bindValue])) {
                        el.options[+bindValue].selected = true;
                        _attr(el.options[+bindValue], 'selected', '');
                      }
                    }
                  }
                  break;

                case '$':
                case 'check':
                  if ((/checkbox|radio/i).test(el.type)) {
                    switch (_of(bindValue)){
                      case 'boolean':
                        el.checked = bindValue;
                        break;
                      default:
                        el.checked = (el.value).equalsIgnoreCase(''+bindValue);
                        break;
                    }
                    if (el.checked) {
                      _attr(el, 'checked', '');
                    } else {
                      el.removeAttribute('checked');
                    }
                  }
                  break;

                case 'if':
                  computedKey = bindKey.replace(/[^a-z0-9]/gi,'_');
                  templateData.__computed__[computedKey] = bindValue;
                  var ifTemplateId = $el.attr('data-bind-template'), ifTemplate;
                  if (!ifTemplateId) { //create new if template
                    var ifTemplateBody = '{{#if __computed__.'+ computedKey + ' }}' + ($el.html().trim()) + '{{/if}}';
                    ifTemplateId = _templateDynId('if', bindKey);
                    ifTemplate   = _inlineTemplate(ifTemplateId, ifTemplateBody);
                    $el.attr('data-bind-template', ifTemplateId);
                  } else {
                    ifTemplate = xsr.compiledTemplates4DataBind[tmplStoreName][ifTemplateId];
                  }
                  $el.html( ifTemplate(templateData) );
                  break;

                case 'repeat':
                  computedKey = bindKey.replace(/[^a-z0-9]/gi,'_');
                  templateData.__computed__[computedKey] = bindValue;
                  var repeatTemplateId = $el.attr('data-bind-template'), repeatTemplate;
                  if (!repeatTemplateId) { //create new repeat template
                    var repeatAs = (bindSpec['repeatAs'] || bindSpec['as'] || '').replace(/[,|:]/g,' ').normalizeStr()
                      , repeatTemplateBody = '{{#each __computed__.'+ computedKey + (repeatAs? (' as |'+repeatAs+'|') : '') +' }}'
                                            + ($el.html().trim()) + '{{/each}}';
                    repeatTemplateId = _templateDynId('repeat', bindKey);
                    repeatTemplate   = _inlineTemplate(repeatTemplateId, repeatTemplateBody);
                    $el.attr('data-bind-template', repeatTemplateId);
                  } else {
                    repeatTemplate = xsr.compiledTemplates4DataBind[tmplStoreName][repeatTemplateId];
                  }
                  $el.html( repeatTemplate(templateData) );
                  break;
                case 'as':break;
                case 'repeatas':break;

                default:
                  switch(true){
                    case (/^\./.test(attribute)): //Class
                    var classNames = attribute.replace(/[\.\,]/g, ' ').normalizeStr();
                    $el[!!bindValue? 'addClass':'removeClass'](classNames);
                    break;

                    default:
                      $el.attr(attribute, bindValue);
                      if (attribute.beginsWithStr('data-')) {
                        dataAttrKey = xsr.dotToCamelCase(attribute.getRightStr('-').replace(/-/g,'.'));
                        if (dataAttrKey) $el.data(dataAttrKey, bindValue);
                      }
                    break;
                  }
                  break;
              }
            }

          });

          if (bindCallback) {
            bindCallback.call(el, el);
          }
        });

      }
    });

    if (!skipBindCallback && !onVirtualDOM && $contextRoot.is('[data-rendered-component]')) {
      var componentName = $contextRoot.attr('data-rendered-component');
      if (!_isBlank(componentName)) {
        var onBindCallback = 'app.'+componentName+'.bindCallback';
        xsr.renderUtils.runCallbackFn(onBindCallback, templateData, app[componentName]);
      }
    }

    if (!onVirtualDOM) {
      //innerComponents
      var $innerComponents = $contextRoot.find('[data-rendered-component]')
                              .filter(function(){
                                return (this.hasAttribute('data-x-component-$data') ||
                                        this.hasAttribute('data-x-$data') ||
                                        this.hasAttribute('data-spa-component-$data') ||
                                        this.hasAttribute('data-spa-$data') ||
                                        this.hasAttribute('spa-$data'));
                              });
      if ($innerComponents.length) {
        //console.log('found inner components to bind with this data ref', $innerComponents);
        var data4InnerCompBind;
        $innerComponents.each(function(){
          data4InnerCompBind = _get$dataInAttr(this, compName, data);
          //console.log('data4InnerCompBind>', data4InnerCompBind);
          xsr.bindData(this, data4InnerCompBind);
        });
      }
    }

    templateData = null;
    return onVirtualDOM? ($contextRoot.html().replace((new RegExp(blockedScriptTagName, 'g')), "script").replace(/spa-vdom-textarea/g,'textarea') ) : $contextRoot;
  };

  xsr.bindTemplateData = function (xTemplate, data) {
    var xContent = xTemplate;
    if ((/^\s*#[a-z]+/i).test(xTemplate)) {
      xContent = $(xTemplate).html();
    }

    if (_isBlank(data)) {
      return xContent;
    }

    if ((/ data-bind\s*=/i).test(xContent)) {
      xContent = xsr.bindData(xTemplate, data);
    }

    if ((/{{(.+)}}/).test(xContent)) {
      if ((typeof Handlebars != 'undefined') && Handlebars) {
        try {
          xContent = Handlebars.compile(xContent)(data);
        } catch (e) {
          console.log('Error Handlebars compile/bind.', e);
        }
      } else {
        console.warn('Handlebars Template Library not found!');
      }
    }

    return xContent;
  };

  xsr.togglePassword = function(elPwd){
    if (!$(elPwd).next('.icon.eye').length){
      var $eyeEl = $('<i class="icon eye"></i>');
      $eyeEl.on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $eyeIcon = $(this),
            $pwdEl   = $eyeIcon.prevAll('.toggle-password'),
            newState = ($pwdEl.attr('type') == 'text')? 'password' : 'text';
        $pwdEl.attr('type', newState).toggleClass('text');
      });
      $($eyeEl).insertAfter(elPwd);
    }
  };

  xsr.initTogglePassword = function(scope){
    $(scope||'body').find('.toggle-password').each(function(idx, elPwd) {
      _log.info('Initializing toggle password', elPwd);
      xsr.togglePassword(elPwd);
    });
  };

  xsr.isElValueChanged = function(elSelector){
    var isChanged, $el = $(elSelector), el;

    if ($el.length) {
      el = $el[0];
      if ('checkbox' == el.type) {
        isChanged = (el.checked != el.defaultChecked);
      } else if ('radio' == el.type) {
        $(el).closest('form').find(':radio[name="'+el.name+'"]').each(function(idx, rEl){
          isChanged = isChanged || (rEl.checked != rEl.defaultChecked);
        });
      } else if ('INPUT,TEXTAREA'.indexOf(el.tagName) >= 0) {
        isChanged = (el.value != el.defaultValue);
      } else if ('SELECT' == el.tagName) {
        var def=0, oIndex, oLength, opt;
        for (oIndex=0, oLength=el.options.length; oIndex < oLength; oIndex++) {
          opt = el.options[oIndex];
          isChanged = isChanged || (opt.selected != opt.defaultSelected);
          if (opt.defaultSelected) def = oIndex;
        }
        if (isChanged && !el.multiple) isChanged = (def != el.selectedIndex);
      }
    }

    return isChanged;
  };
  xsr.resetElDefaultValue = function(elSelector){
    var $el = $(elSelector), el;
    if ($el.length) {
      el = $el[0];
      if (',checkbox,radio'.indexOf(el.type)>0) {
        el.defaultChecked = el.checked;
      } else if (',INPUT,TEXTAREA'.indexOf(el.tagName)>0) {
        el.defaultValue = el.value;
      } else if ('SELECT' == el.tagName) {
        var oIndex, oLength, opt;
        for (oIndex=0, oLength=el.options.length; oIndex < oLength; oIndex++) {
          opt = el.options[oIndex];
          opt.defaultSelected = opt.selected;
        }
      }
    }
  };

  xsr.updateTrackFormCtrls = function(elForm){
    if (elForm) {
      var $elForm             = $(elForm),
          changedElcount      = $elForm.find('.tracking-change.changed').length,
          validationResult    = xsr.validateForm('#'+$elForm.attr('id')),
          isValidForm         = (_isBlank(validationResult) || (validationResult[0]['errcode']==1) ),
          validationErrFound  = ( !isValidForm || $elForm.find('.validation-error,.validation-pending').length),
          enableCtrlEls4Ch    = (changedElcount>0 && !validationErrFound),
          enableCtrlEls4Valid = (!validationErrFound),
          $ctrlElements       = $elForm.find('.ctrl-on-change,.ctrl-on-validate'), $ctrlEl, enableCtrlEls, fnOnBeforeChange, fn2Run;
      $elForm.attr('data-changed', changedElcount).data('changed', changedElcount);

      $ctrlElements.each(function(i, el){
        $ctrlEl = $(el);
        enableCtrlEls = $ctrlEl.hasClass('ctrl-on-change')? enableCtrlEls4Ch : enableCtrlEls4Valid;
        fnOnBeforeChange = $ctrlEl.attr('onBeforeChange');
        if (!_isBlank(fnOnBeforeChange)) {
          if (fnOnBeforeChange.indexOf('(')>0) fnOnBeforeChange = fnOnBeforeChange.getLeftStr('(');
          fn2Run = _find(window, (fnOnBeforeChange.trim()), undefined);
          enableCtrlEls = _isFn(fn2Run)? (!!fn2Run.call(el, enableCtrlEls)) : enableCtrlEls;
        }

        if ($ctrlEl.is(':disabled') == enableCtrlEls) {
          $ctrlEl.prop('disabled',!enableCtrlEls).addClass(enableCtrlEls?'':'disabled').removeClass(enableCtrlEls?'disabled':'');
          $ctrlEl.trigger('change');
        }
      });
    }
  };

  xsr.trackFormElChange = function _trackFormElChange(elSelector, scope){
    var $elementsToTrack = $(scope||'body').find(elSelector);

    $elementsToTrack.each(function(idx, el){
      if ('FORM' == el.tagName.toUpperCase()) {
        xsr.trackFormElChange(($(el).find('.track-change').length? '.track-change':'input,textarea,select'), el);
      } else {
        elTrackChange(el);
      }
    });

    function eTrackChange(e){
      if ((e['type'] == 'change') || (e['key'] && (e.key.length == 1 || 'BackspaceDelete'.indexOf(e.key)>=0))) {
        var isChanged = false, $thisForm = $(this).closest('form'), prvChgCount = $thisForm.find('.tracking-change.changed').length, newChgCount, triggerFormChange;
        if ('checkbox' == this.type) {
          isChanged = (this.checked != this.defaultChecked);
        } else if ('radio' == this.type) {
          $thisForm.find(':radio[name="'+this.name+'"]').each(function(idx, rEl){
            if (rEl.checked == rEl.defaultChecked) $(rEl).removeClass('changed');
            isChanged = isChanged || (rEl.checked != rEl.defaultChecked);
          });
        } else if ('INPUT,TEXTAREA'.indexOf(this.tagName) >= 0) {
          isChanged = (this.value != this.defaultValue);
          triggerFormChange = (e['type'] != 'change');
        } else if ('SELECT' == this.tagName) {
          var def=0, oIndex, oLength, opt;
          for (oIndex=0, oLength=this.options.length; oIndex < oLength; oIndex++) {
            opt = this.options[oIndex];
            isChanged = isChanged || (opt.selected != opt.defaultSelected);
            if (opt.defaultSelected) def = oIndex;
          }
          if (isChanged && !this.multiple) isChanged = (def != this.selectedIndex);
        }
        $(this)[isChanged? 'addClass' : 'removeClass']('changed');
        xsr.updateTrackFormCtrls($thisForm);
        if (prvChgCount!=newChgCount && triggerFormChange) $thisForm.trigger('change');
      }
    }

    function elTrackChange(el){
      var trackEvents = 'change', $el = $(el);
      if (',checkbox,radio'.indexOf(el.type)>0) {
        el.defaultChecked = el.checked;
      } else if (',INPUT,TEXTAREA'.indexOf(el.tagName)>0) {
        el.defaultValue = el.value;
        trackEvents = 'keyup change';
      } else if ('SELECT' == el.tagName) {
        var oIndex, oLength, opt;
        for (oIndex=0, oLength=el.options.length; oIndex < oLength; oIndex++) {
          opt = el.options[oIndex];
          opt.defaultSelected = opt.selected;
        }
      } else {
        return false;
      }

      $el.removeClass('track-change changed');
      xsr.updateTrackFormCtrls($el.closest('form'));

      if (el.className.indexOf('tracking-change') < 0) {
        $el.addClass('tracking-change').on(trackEvents, eTrackChange);
      }
      return true;
    }
  };

  xsr.initTrackFormElChanges = function(scope){
    $(scope||'body').find('form.track-changes,form:has(.ctrl-on-change,.track-change)').each(function(idx, formEl){
      _log.info('Initializing Form Elements Track: Form ['+ (formEl['id'] || formEl['name']) +']');
      xsr.trackFormElChange(formEl);
    });
  };

  xsr.getModifiedElement = function (elSelector) {
    var modified, modifiedEl=undefined;
    var $elements = $(elSelector || "form:not([data-ignore-change]) :input:not(:disabled,:button,[data-ignore-change])");
    //$elements.each(function(index, element) //jQuery each does not break the loop
    _every($elements, function (element) //lo-dash breaks the loop when condition not satisified
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
  xsr.getModifiedElements = function (elSelector) {
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

  xsr.initTrackElValueChanges = xsr.resetElementsDefaultValue = function (elSelector) {
    $(elSelector || "form :input:not(:disabled)").each(function (index, element) {
      element.defaultValue = element.value;
      if ((element.tagName.match(/^input$/i)) && (element.type.match(/^(checkbox|radio)$/i) && element.checked != element.defaultChecked)) {
        element.defaultChecked = element.checked;
      }
    });
  };

  xsr.trash = {
      container:[]
    , push : function(junk){ this.container.push(junk); }
    , empty: function(){this.container = []; }
    , pick : function(tIndex){ return ((tIndex)? this.container[tIndex] : this.container); }
  };
  xsr.fillData = function (data, context, options) {
    var ready2Fill = ((typeof data) == "object");

    if (context && ((typeof context) == "object")) {
      options = context;
      context = null;
    }
    context = context || "body";

    var fillOptions = {
      dataParams: {},
      method:'GET',
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
    _extend(fillOptions, options);

    if (!ready2Fill) { //make Ajax call to load remote data and apply....

      /*wait till this data loads*/
      $ajax({
        url: data,
        method: (''+(fillOptions.method || 'GET')).toUpperCase(),
        data: fillOptions.dataParams,
        cache: fillOptions.dataCache,
        async: fillOptions.async,
        dataType: "text",
        success: function (result) {
          data = _toObj(''+result);
          ready2Fill = ((typeof data) == "object");
          _fillData();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          _log.error("Failed loading data from [" + data + "]. [" + textStatus + ":" + errorThrown + "]");
          if ( _isFn(app.api['onError']) ) {
            app.api.onError.call(this, jqXHR, textStatus, errorThrown);
          } else {
            xsr.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
          }
        }
      });
    }

    function _fillData() {
      var keyFormat = fillOptions.keyFormat;

      keyFormat = (keyFormat.match(/^[a-z]/) != null) ? "aBc" : keyFormat;
      keyFormat = (keyFormat.match(/^[A-Z]/) != null) ? "AbC" : keyFormat;

      var dataKeys = _keysDotted(data);
      _log.group("fillData");
      _log.info(dataKeys);

      _each(dataKeys, function (dataKeyPath) {
        _log.group(">>" + dataKeyPath);
        var dataKey = ""+(dataKeyPath.replace(/[\[\]]/g, "_") || "");
        var dataKeyForFormatterFnSpec = dataKeyPath.replace(/\[[0-9]+\]/g, "");
        var isArrayKey = (/\[[0-9]+\]/).test(dataKeyPath);

        switch (keyFormat) {
          case "_" :
            dataKey = xsr.dotToX(dataKey, "_");
            dataKeyForFormatterFnSpec = xsr.dotToX(dataKeyForFormatterFnSpec, "_");
            break;
          case "AbC":
            dataKey = xsr.dotToTitleCase(dataKey);
            dataKeyForFormatterFnSpec = xsr.dotToTitleCase(dataKeyForFormatterFnSpec);
            break;
          default:
            dataKey = xsr.dotToCamelCase(dataKey);
            dataKeyForFormatterFnSpec = xsr.dotToCamelCase(dataKeyForFormatterFnSpec);
            break;
        }

        var debugInfo = {
          "patternKey": dataKey + (isArrayKey ? (" || " + dataKeyForFormatterFnSpec) : ""),
          "formatterKey": dataKeyForFormatterFnSpec,
          "isArrayChild": isArrayKey
        };
        xsr.trash.push(debugInfo);
        _log.info(debugInfo);
        xsr.trash.empty();

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
        _log.info(">> " + elSelector + " found: " + elCountInContext);
        var dataValue = null;
        if (elCountInContext > 0) {
          dataValue = _find(data, dataKeyPath);
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
          _log.info({value: dataValue});
        }
        $(context).find(elSelector).each(function (index, el) {
          _log.info(el);
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
              xsr.selectOptionForValue(el, dataValue);
              if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultValue = el.value;
              break;

            case "TEXTAREA":
              $(el).val(dataValue);
              if (!fillOptions.resetElDefaultInContext && fillOptions.resetElDefault) el.defaultValue = el.value;
              break;

            default:
              $(el).html( xsr.sanitizeXSS(dataValue) );
              break;
          }
        });

        _log.groupEnd(">>" + dataKeyPath);
      });

      _log.groupEnd("fillData");
      if (fillOptions.resetElDefaultInContext) xsr.resetElementsDefaultValue(context + " :input");
    }
  };

  xsr.toRenderDataStructure = function(saoDataUrl, soParams, hashParams) {
    var retObj = {}
      , dataCollection = {}
      , itemUrl = {}
      , oParams = {}
      , replaceKeysWithValues = function (srcStr, oKeyValue) {
          if (oKeyValue && _keys(oKeyValue).length) {
            _each(_keys(oKeyValue), function(key){
              srcStr = srcStr.replace(new RegExp("{" + key + "}", "gi"), oKeyValue[key]);
            });
          }
          return srcStr;
        };

    if (soParams){
      oParams = (_isStr(soParams))? xsr.queryStringToJson(soParams) : ((_isObj(soParams))? soParams : {});
    }
    switch(true) {
      case (_isStr(saoDataUrl)) :
        /* 'path/to/data/api' => {dataUrl:'path/to/data/api'}
           'target.data.key|path/to/data/api' => {dataUrl:'path/to/data/api', dataModel:'target.data.key'}
        */
        if (saoDataUrl.containsStr("\\|")) {
          retObj['dataModel'] = xsr.getOnSplit(saoDataUrl, "|", 0);
          saoDataUrl = xsr.getOnLastSplit(1);
        }
        retObj['dataUrl'] = replaceKeysWithValues(saoDataUrl, hashParams);
        if (!_isEmpty(oParams)) retObj['dataParams'] = oParams;
        break;
      case (_isArr(saoDataUrl)) :
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
        _each(saoDataUrl, function(apiUrl){
          itemUrl = {url:replaceKeysWithValues(apiUrl, hashParams), params:oParams};
          if (apiUrl.containsStr("\\|")) {
            itemUrl['target'] = xsr.getOnSplit(apiUrl, "|", 0);
            itemUrl['url'] = replaceKeysWithValues(xsr.getOnLastSplit(1), hashParams);
          }
          dataCollection.urls.push(itemUrl);
        });
        break;
      case (_isObj(saoDataUrl)) :
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
        _each(_keys(saoDataUrl), function(dName){
          itemUrl = {name:dName, url:replaceKeysWithValues(saoDataUrl[dName], hashParams), params:oParams};
          if (saoDataUrl[dName].containsStr("\\|")) {
            itemUrl['target'] = xsr.getOnSplit(saoDataUrl[dName], "|", 0);
            itemUrl['url'] = replaceKeysWithValues(xsr.getOnLastSplit(1), hashParams);
          }
          dataCollection.urls.push(itemUrl);
        });
        break;
    }
    if (!_isEmpty(dataCollection.urls)) {
      retObj['dataCollection'] = dataCollection;
    }
    return retObj;
  };

  /* each spaRender's view and model will be stored in renderHistory */
  var _$dataWatchList = {};
  xsr.env = '';
  xsr.compiledTemplates4DataBind={};
  xsr.compiledTemplates={};
  xsr.viewModels = {};
  xsr.renderHistory = {};
  xsr.renderHistoryMax = 0;
  xsr.components = {};
  xsr.tempBind$data = {};
  xsr.defaults = {
      components: {
          templateEngine: 'handlebars'
        , rootPath: 'app/components/'
        , inFolder: true
        , templateExt: '.html'
        , scriptExt: '.js'
        , templateScript: false
        , templateCache: true
        , dataPreRequest: ''
        , render:''
        , callback:''
        , extend$data: true
        , offline: false
      }
    , routes: {
        base: '#',
        attr: {
          route: 'data-spa-route',
          params: 'data-spa-route-params',
          onNavAway: 'onNavAway'
        },
        className: {
          hide : 'HIDE-SPA-NAV',
          block: 'BLOCK-SPA-NAV',
          allow: 'ALLOW-SPA-NAV'
        },
        onClickAs: 'click'
    }
    , lang: {
        path: 'app/language/',
        ext: '.txt',
        cache: true,
        async: true
    }
    , validation: {
        xss: {
          on: 'input_onBlur',
          fn: '_check.xss',
          msg: 'i18n:invalid.input'
        }
    }
    , csp : {
      nonce: ''
    }
    , set: function(oNewValues, newValue) {
        if (_isObj(oNewValues)) {
          if (oNewValues.hasOwnProperty('set')) delete oNewValues['set'];
          _mergeDeep(this, oNewValues);
        } else if (typeof oNewValues == 'string') {
          if (oNewValues == 'components.extend$data') {
            xsr.defaults.components.extend$data = newValue;
          } else {
            xsr.setSimpleObjProperty(this, oNewValues, newValue);
          }
        }
        return this;
      }
  };

  function _adjustComponentOptions(componentName, options){
    var tmplId = '_rtt_'+componentName, tmplBody = '';
    if (options && _isObj(options)  && xsr.hasPrimaryKeys(options, 'template|templateStr|templateString|templateUrl') ) {
      if (options.hasOwnProperty('template')) {
        var givenTemplate = options['template'].trim();
        var isContainerId = ((givenTemplate.beginsWithStr('#') && !givenTemplate.containsStr(' ')) || ((givenTemplate=='inline') || (givenTemplate=='.')));
        if (isContainerId) {
          if ((givenTemplate=='inline') || (givenTemplate=='.') || (givenTemplate=='#')) {
            options['templateUrl'] = 'inline';
          }
        } else {
          options['templateStr'] = options['template'];
        }
      }
      if (xsr.hasPrimaryKeys(options, 'templateStr|templateString')) {
        tmplBody = options['templateStr'] || options['templateString'] || '';
        xsr.updateTemplateScript(tmplId, tmplBody);
        options['template'] = '#'+tmplId;
      } else if (xsr.hasPrimaryKeys(options, 'templateUrl')) {
        var xTmplUrlPath = (options['templateUrl'] || '').trim();
        if (xTmplUrlPath) {
          if ( (/^(\.\/)/).test(xTmplUrlPath) )  { //beginsWith ./
            var isChildComponent = (/[^a-z0-9]/gi).test(componentName); //childComponentIndicator
            var _cFldrPath   = xsr.defaults.components.rootPath+ ((xsr.defaults.components.inFolder || isChildComponent)? ((componentName.replace(/[^a-z0-9]/gi, '/')) +"/"): '');
            xTmplUrlPath = _cFldrPath+xTmplUrlPath.substr(2);
          }
          // if  (!((/(\.([a-z])+)$/i).test(xTmplUrlPath))) { //if no extension set default
          //   xTmplUrlPath += xsr.defaults.components.templateExt;
          // }
        }
        options['template'] = xTmplUrlPath;
      }
    }

    if (options && _isObj(options) && !xsr.hasPrimaryKeys(options, 'data|dataUrl') && xsr.hasPrimaryKeys(xsr.api.urls, '$'+componentName)){
      options['dataUrl'] = '@$'+componentName;
    }

    _log.log('$ Adj.Options>>>>',componentName, options? options.__now() : options);
    return options;
  }

  function _onDomReady(fn) {
    if ( (_doc.readyState === 'complete') || (!(_doc.readyState === 'loading' || _doc.documentElement.doScroll)) ) {
      fn();
    } else {
      _doc.addEventListener('DOMContentLoaded', fn);
    }
  }
  function __$refresh( options ) {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.refreshComponent(cName, options);
    });
    return this;
  }
  function __$render( options ) {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.renderComponent(cName, options);
    });
    return this;
  }
  function __$show( options ) {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.showComponent(cName, options);
    });
    return this;
  }
  function __$hide() {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.hideComponent(cName);
    });
    return this;
  }
  function __$enable() {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.enableComponent(cName);
    });
    return this;
  }
  function __$disable() {
    var cName = this.__name__;
    _onDomReady(function(){
      xsr.disableComponent(cName);
    });
    return this;
  }
  function __$remove() {
    return xsr.removeComponent(this.__name__);
  }
  function __$destroy() {
    return xsr.destroyComponent(this.__name__);
  }
  var SPAComponentProto = {
    render    : __$render,
    refresh   : __$refresh,
    show      : __$show,
    hide      : __$hide,
    enable    : __$enable,
    disable   : __$disable,
    remove    : __$remove,
    destroy   : __$destroy,
    render$   : __$render,
    refresh$  : __$refresh,
    show$     : __$show,
    hide$     : __$hide,
    enable$   : __$enable,
    disable$  : __$disable,
    remove$   : __$remove,
    destroy$  : __$destroy
  };
  function SPAComponent(cName){
    this.__name__ = cName;
  }
  SPAComponent.prototype = SPAComponentProto;

  var reservedCompNames = 'api,debug,lang';
  xsr.component = xsr.$ = xsr.registerComponent = function(componentNameFull, options) {

    var req2Create = !!options, componentName = componentNameFull;
    options = options || {};

    if (!componentNameFull) {
      console.error('Missing ComponentName to register.');
      return;
    }

    if (_isObj(componentNameFull)) {
      options = _mergeDeep({}, componentNameFull);
      componentNameFull = (options['name'] || options['componentName'] || ('spaComponent'+_now())).trim().trimLeftStr('/').trimLeftStr('_');
      options['componentName'] = componentNameFull;
      componentName = componentNameFull;
    }

    if (!_isStr(componentName)) {
      console.error('Invalid ComponentName:', componentName);
      return;
    }

    componentNameFull = componentNameFull.trim().trimLeftStr('/').trimLeftStr('_');
    componentName = componentNameFull;

    if (reservedCompNames.indexOf(componentName)>=0) {
      console.error('Invalid component name "'+componentName+'". Cannot create a component with these names: '+ (reservedCompNames) );
      return;
    }

    if (_isStr(componentName) && componentName) {
      componentName = componentName.trim();
      if (componentName) {

        if (req2Create) {
          //Create New Component
          if ((/[^a-z0-9\/]/gi).test(componentName) || !(/^([a-z])/i.test(componentName)) ) {
            console.error('Invalid component name "'+componentName+'" to create. Component name must contain only Alphanumeric (a-z A-Z 0-9) and must begin with alphabet (a-z A-Z).');
            return;
          }

          if ((/[^a-z0-9]/gi).test(componentName)) { //childComponentIndicator
            componentName = componentName.replace(/[^a-z0-9]/gi, '_');
          }

          if (xsr.components[componentName]) {
            //already registered
            //console.error('Component ['+componentName+'] has been created already.');
            return;
          }

          options['componentName'] = componentName;
          if (!options.hasOwnProperty('beforeRender')) {
            options['beforeRender'] = 'app.'+componentName+'.onRender';
          }
          if (!options.hasOwnProperty('renderCallback')) {
            options['renderCallback'] = 'app.'+componentName+'.renderCallback';
          }
          if (options.hasOwnProperty('require')) {
            xsr.loadComponents(options['require'], function(){
              _log.log('Required components successfully loaded.');
            }, function(){
              _log.log('Failed to load required components.');
            });
          }

          options = _adjustComponentOptions(componentName, options);

          var baseProps = [ 'target','template','templateCache','templateScript',
                            'templateUrl', 'templateUrlMethod', 'templateUrlParams', 'templateUrlPayload', 'templateUrlHeaders', 'onTemplateUrlError',
                            'style','styleCache','styles','stylesCache',
                            'scripts','scriptsCache','require','dataPreRequest','data','skipDataBind',
                            'dataCollection','dataUrl','dataUrlMethod','dataUrlParams','dataUrlHeaders','defaultPayload','stringifyPayload',
                            'dataParams','dataType','dataModel','dataCache','dataUrlCache',
                            'dataDefaults','data_','dataExtra','dataXtra','onDataUrlError', 'onError',
                            'dataValidate','dataProcess','dataPreProcessAsync',
                            'beforeRender','beforeRefresh','componentName'];
          var baseProperties = _mergeDeep({}, options);
          _each(baseProps, function(baseProp){
            delete options[baseProp];
          });
          if (_isStr(options['renderCallback'])) { delete options['renderCallback']; }
          _each(_keys(options), function(xKey){
            delete baseProperties[xKey];
          });
          baseProperties['renderCallback'] = 'app.'+componentName+'.renderCallback';

          // override data with dataUrl
          if (baseProperties && baseProperties['data'] && _isObj(baseProperties['data']) && baseProperties['dataUrl']) {
            if (_isObj(baseProperties['dataDefaults'])) {
              baseProperties['dataDefaults'] = _mergeDeep({}, baseProperties['dataDefaults'], baseProperties['data']);
            } else {
              baseProperties['dataDefaults'] = baseProperties['data'];
            }
            delete baseProperties['data'];
          }

          xsr.components[componentName] = baseProperties;
          xsr.extendComponent(componentNameFull, options);

          return window.app[componentName] || (new SPAComponent(componentNameFull));

        } else {
          //Req to get DOM
          var elSelector, $retDOM, compIndex=-1;
          if (componentName.indexOf(' ')>0) {
            elSelector    = componentName.getRightStr(' ').trim();
            componentName = componentName.getLeftStr(' ');
          }

          if (componentName.indexOf(':')>0) {
            compIndex = xsr.toInt(componentName.getRightStr(':').trim());
            componentName = componentName.getLeftStr(':');
          }

          componentName = componentName.replace(/[^a-z0-9]/gi, '_');
          if (!xsr.components[componentName]) {
            console.warn('Unknown SPA Component "'+(componentNameFull.getLeftStr(' ') || componentNameFull)+'"');
          }

          $retDOM = $('[data-rendered-component="'+componentName+'"]');
          if ($retDOM.length && compIndex>=0) {
            $retDOM = $($retDOM[compIndex]);
          }
          if (elSelector && $retDOM.length) {
            if (elSelector[0] == '<') {
              elSelector = elSelector.getRightStr(0).trim();
              if ($retDOM.find('[data-rendered-component]').length) {
                $retDOM = $retDOM.find(elSelector).filter(function(){
                            return (($(this).closest('[data-rendered-component]').data('renderedComponent')) == componentName);
                          });
              } else {
                $retDOM = $retDOM.find(elSelector);
              }
            } else {
              $retDOM = $retDOM.find(elSelector);
            }
          }

          return $retDOM;
        }
      }
    }
  };

  /* xsr.registerComponents( 'compName1' );
   * xsr.registerComponents( 'compName1,compName2' );
   * xsr.registerComponents( 'compName1', 'compName2', 'compName3' );
   * xsr.registerComponents( ['compName1', 'compName2', 'compName3'] );
   * xsr.registerComponents( { compName1: {baseProps}, compName2: {baseProps} } );
   */
  xsr.$$ = xsr.registerComponents = function() {
    if (arguments.length){
      var compList = arguments;                //xsr.registerComponents('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_isArr(arguments[0])) {         //xsr.registerComponents(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_isStr(arguments[0])) { //xsr.registerComponents('compName1') | xsr.registerComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             // xsr.registerComponents( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }
      if (_isObj(compList)) {
        _each(_keys(compList), function(compName){
          _log.info('Registering x-component:['+compName+']');
          xsr.registerComponent(compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _each(compList, function(compName){
          _log.info('Registering x-component:['+compName+']');
          xsr.registerComponent(compName.trim());
        });
      }
    }
  };

  xsr.extendComponent = xsr.$extend = xsr.module = function(componentName, options) {
    options = options || {};
    if (!componentName) {
      console.error('Missing ComponentName to extend.');
      return;
    }

    if (_isObj(componentName)) {
      options = _mergeDeep({}, componentName);
      componentName = (options['name'] || options['componentName'] || ('spaComponent'+_now())).trim().trimLeftStr('/').trimLeftStr('_');
      options['componentName'] = componentName;
    }

    if (_isStr(componentName) && componentName) {
      componentName = componentName.trim().trimLeftStr('/').trimLeftStr('_');
      if (componentName) {
        if (reservedCompNames.indexOf(componentName)>=0) {
          console.error('Invalid component name '+componentName+'. Cannot extend Reserved components: '+ (reservedCompNames.join()) );
          return;
        }
        if ((/[^a-z0-9\/]/gi).test(componentName) || !(/^([a-z])/i.test(componentName)) ) {
          console.error('Invalid component name "'+componentName+'" to extend. Component name must contain only Alphanumeric (a-z A-Z 0-9) and must begin with alphabet (a-z A-Z).');
          return;
        }

        if (((/[^a-z0-9]/gi).test(componentName))) { //childComponentIndicator
          componentName = componentName.replace(/[^a-z0-9]/gi, '_');
        }

        window['app'] = window['app'] || {};
        window.app[componentName] = window.app[componentName] || (new SPAComponent(componentName));
        if (options && _isFn(options)) {
          options = options.call(xsr.components[componentName] || {});
        }
        options = _isObj(options)? options : {};
        if (!xsr.components[componentName]) xsr.components[componentName] = {componentName: componentName, beforeRender: 'app.'+componentName+'.onRender', renderCallback: 'app.'+componentName+'.renderCallback'};
        if (xsr.components[componentName]) {
          if (options['__prop__']) {
            _mergeDeep(xsr.components[componentName], _extend({},options['__prop__']));
          }
          options['__prop__'] = xsr.components[componentName];
        }
        _extend(window.app[componentName], options);
        window['$$'+componentName] = window.app[componentName];
      }
    } else {
      console.error('Invalid ComponentName:', componentName);
      return;
    }
  };

  /* xsr.extendComponents( 'compName1' );
   * xsr.extendComponents( 'compName1,compName2' );
   * xsr.extendComponents( 'compName1', 'compName2', 'compName3' );
   * xsr.extendComponents( ['compName1', 'compName2', 'compName3'] );
   * xsr.extendComponents( { compName1: {baseProps}, compName2: {baseProps} } );
   */
  xsr.extendComponents = xsr.$$extend = function() {
    if (arguments.length){
      var compList = arguments;                //xsr.extendComponents('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_isArr(arguments[0])) {         //xsr.extendComponents(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_isStr(arguments[0])) { //xsr.extendComponents('compName1') | xsr.registerComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             //xsr.extendComponents( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }
      if (_isObj(compList)) {
        _each(_keys(compList), function(compName){
          _log.info('Extend x-component:['+compName+']');
          xsr.extendComponent(compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _each(compList, function(compName){
          _log.info('Extend x-component:['+compName+']');
          xsr.extendComponent(compName.trim());
        });
      }
    }
  };

  xsr.$bind = function(cName, newData) {
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (_isBlank(newData)) {
      newData = _find(app, cName+'.$data', {});
    }
    xsr.$(cName).spaBindData(newData);
  };

  xsr.$data = function(cName, newData, mode){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    var retData;
    cName = (cName || '').trim();
    mode = mode || 'update';

    function update$data(data){
      if (_isObj(data)) {
        if (['update', 'merge'].__has(mode, 'i')) {
          _mergeDeep(app[cName].$data, data);
        } else if (['*','reset','replace','overwrite'].__has(mode, 'i')) {
          app[cName].$data = data;
        }
      }
      app[cName]['is$DataUpdated'] = xsr.components[cName]['is$DataUpdated'] = true;
      return app[cName].$data;
    }

    if (cName) {
      if (app.hasOwnProperty(cName)) {
        retData = _find(app, cName+'.$data');
        if (newData) {
          retData = update$data( (_isFn(newData))? newData.call(app[cName], app[cName].$data) : newData );

          var $component = xsr.$(cName);
          if ($component.is(':visible')) {
            var _$prop = xsr.components[cName]
              , _$dataCache = _$prop['dataCache']
              , _on$dataChange = (_$prop['on$dataChange']||'').trim().toLowerCase();
            if (_$dataCache && _on$dataChange && (['render','refresh','bind'].__has(_on$dataChange))) {
              _log.log(cName+'$'+_on$dataChange+' on $data update ...');
              spa['$'+_on$dataChange](cName);
            }
            xsr.renderUtils.runCallbackFn('app.'+cName+'.$dataChangeCallback', app[cName].$data, app[cName]);
          } else {
            console.log('Component is not visible! Skipped $on$dataChange.');
          }

          xsr.$dataNotify(cName);
        }
      } else {
        _log.warn('SPA Component[',cName,'] is not loaded.');
      }
    }

    return retData;
  };

  xsr.$dataWatch = function(cName, watchName, fnCallback){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (!cName || !watchName || !_isFn(fnCallback)) return;

    if (!_$dataWatchList.hasOwnProperty(cName)) {
      _$dataWatchList[cName] = {};
    }

    if (_$dataWatchList[cName].hasOwnProperty(watchName)) {
      console.warn('$dataWatch [',watchName,'] already exists in spa$[',cName,']');
      return;
    } else {
      _$dataWatchList[cName][watchName] = fnCallback;
      return true;
    }
  };
  xsr.$dataUnwatch = function(cName, watchName){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    var retVal;
    if (cName && watchName && _$dataWatchList.hasOwnProperty(cName)) {
      if (watchName == '*') {
        delete _$dataWatchList[cName];
        retVal = true;
      }
      if (_$dataWatchList[cName].hasOwnProperty(watchName)) {
        delete _$dataWatchList[cName][watchName];
        retVal = true;
      }
    }
    if (!retVal){
      console.warn('$dataWatch [',watchName,'] does not exist in spa$[',cName,']');
    }
    return retVal;
  };
  xsr.$dataNotify = function(cName, watchName){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (!cName) return;

    if (_$dataWatchList.hasOwnProperty(cName)) {
      var notifyList = _keys(_$dataWatchList[cName]);
      if (watchName) {
        notifyList = watchName.split(',');
      }
      _each(notifyList, function(xWatchName){
        xWatchName = (xWatchName||'').trim();
        if (_$dataWatchList[cName].hasOwnProperty(xWatchName)) {
          _$dataWatchList[cName][xWatchName].call(undefined, app[cName]['$data'], app[cName], xWatchName);
        }
      });
    }
  };

  function _$renderCountUpdate(componentName){
    componentName = String(componentName).replace(/[^a-z0-9]/gi, '_');
    if (app[componentName]) {
      app[componentName]['__renderCount__'] = xsr.toInt(xsr.$renderCount(componentName)) + 1;
    }
  }
  xsr.$renderCount = function(componentName){
    return _find(window, 'app.'+(String(componentName).replace(/[^a-z0-9]/gi, '_'))+'.__renderCount__', 0);
  };

  xsr.removeComponent = function (componentName, byComp) {
    var ok2Remove;
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (byComp) {
      byComp = (componentName==byComp)? '_self_' : byComp;
    }

    function isOk2Remove$(cName){
      cName = String(cName).replace(/[^a-z0-9]/gi, '_').trim();
      var ok2Remove$ = _isBlank(cName), _fnOnRemoveCompRes;
      if (!ok2Remove$) {
        _fnOnRemoveCompRes = xsr.renderUtils.runCallbackFn(('app.'+cName+'.onRemove'), (byComp || '_script_'), app[cName]);
        ok2Remove$ = (_isUndef(_fnOnRemoveCompRes) || (_isBool(_fnOnRemoveCompRes) && _fnOnRemoveCompRes));
        if (!ok2Remove$) {
          _log.warn('Remove $'+cName+' request denied onRemove()');
        }
      }
      return ok2Remove$;
    }

    if (componentName) {
      var $componentContainer = $('[data-rendered-component="'+(componentName)+'"]');
      if ($componentContainer.length) {
        var childComponents = $componentContainer.find('[data-rendered-component]').map(function(){ return $(this).attr('data-rendered-component'); })
          , isChildRemoved = ((childComponents.length==0) || _every(childComponents, function(cName){return isOk2Remove$(cName); }));
        if (isChildRemoved){
          if ( isOk2Remove$(componentName) ) {
            $componentContainer.html('').text('').val('').data('renderedComponent', '').removeAttr('data-rendered-component');
            ok2Remove = true;
          }
        }
      } else {
        ok2Remove = true;
      }
    }
    return (_isBool(ok2Remove) && ok2Remove);
  };
  xsr.destroyComponent = function (componentName) {
    var isDestroyed;
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      if ( xsr.removeComponent(componentName) ) {
        delete app[componentName];
        if (xsr.components[componentName]) {
          var tmplScriptId = _find(xsr.components[componentName], 'template', '');
          if (tmplScriptId && !tmplScriptId.beginsWithStr('#')) {
            tmplScriptId = "#__tmpl_" + ((''+tmplScriptId).replace(/[^a-z0-9]/gi,'_'));
          }
          $('script'+tmplScriptId).remove();
          delete xsr.components[componentName];
          delete xsr.compiledTemplates4DataBind[componentName];
          delete xsr.compiledTemplates[componentName];
          delete _$dataWatchList[componentName];
          isDestroyed = true;
        }
      }
    }
    return isDestroyed;
  };
  xsr.showComponent = function (componentPath, options) {
    var componentName = (componentPath || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      var $componentContainer = $('[data-rendered-component="'+componentName+'"]');
      if ($componentContainer.length) {
        $componentContainer.show();
      } else {
        xsr.$render(componentPath, options);
      }
    }
  };
  xsr.hideComponent = function (componentName) {
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      $('[data-rendered-component="'+componentName+'"]').hide();
    }
  };
  xsr.disableComponent = function (componentName) {
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      $('[data-rendered-component="'+componentName+'"]').css('pointer-events', 'none').addClass('disabled').attr('disabled', 'disabled');
    }
  };
  xsr.enableComponent = function (componentName) {
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      $('[data-rendered-component="'+componentName+'"]').css('pointer-events', 'auto').removeClass('disabled').removeAttr('disabled');
    }
  };

  /*
   * ( 'compName1' )                                   //as argument
   * ( 'compName1', 'compName2', 'compName3', ... )    //as arguments
   *
   * ( 'compName1, compName2, compName3, ...' )        //as Single String with comma separated
   * ( ['compName1', 'compName2', 'compName3', ... ] ) //as Single Array
   */
  function _spaComponentOp(){
    var actionName = this.action;
    if (arguments.length){
      var compList = arguments; //('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_isArr(arguments[0])) { //(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_isStr(arguments[0])) { //('compName1') | ('compName1,compName2');
          compList = arguments[0].split(',');
        }
      }
      _log.log(compList);
      if (compList && compList.length) {
        _each(compList, function(compName){
          _log.info(actionName+' x-component:['+compName.trim()+']');
          spa[actionName](compName.trim());
        });
      }
    }
  }
  xsr.removeComponents = xsr.$remove = xsr.$$remove = function () {
    _spaComponentOp.apply({action: 'removeComponent'}, arguments);
  };
  xsr.destroyComponents = xsr.$destroy = xsr.$$destroy = function () {
    _spaComponentOp.apply({action: 'destroyComponent'}, arguments);
  };
  xsr.showComponents = xsr.$show = xsr.$$show = function () {
    _spaComponentOp.apply({action: 'showComponent'}, arguments);
  };
  xsr.hideComponents = xsr.$hide = xsr.$$hide = function () {
    _spaComponentOp.apply({action: 'hideComponent'}, arguments);
  };
  xsr.enableComponents = xsr.$enable = xsr.$$enable = function () {
    _spaComponentOp.apply({action: 'enableComponent'}, arguments);
  };
  xsr.disableComponents = xsr.$disable = xsr.$$disable = function () {
    _spaComponentOp.apply({action: 'disableComponent'}, arguments);
  };

  //////////////////////////////////////////////////////////////////////////////////
  xsr.refreshComponent = xsr.$refresh = function (componentName, options) {
    if (!componentName) return;
    options = options || {};
    if (!_isObj(options)) return;

    if (!options.hasOwnProperty('beforeRender')) {
      options['beforeRender'] = options['beforeRefresh'] || ('app.'+(componentName.replace(/[^a-z0-9]/gi, '_'))+'.onRefresh');
    }
    if (!options.hasOwnProperty('renderCallback')) {
      options['renderCallback'] = options['refreshCallback'] || ('app.'+(componentName.replace(/[^a-z0-9]/gi, '_'))+'.refreshCallback');
    }
    options['isRefreshCall'] = true;

    _log.info('Calling refreshComponent: '+componentName+' with below options');
    _log.info(options);
    xsr.$render(componentName, options);
  };

  function __finalValue(srcVal) {
    var retVal = srcVal, fnContext = arguments[1], fnArgs = _arrProto.slice.call(arguments, 2);
    if (_isStr(retVal)) {
      if (retVal.indexOf('(')>0) { //function
        retVal = retVal.getLeftStr('(');
      }
      retVal = _find(window, (retVal.trim()), undefined);
    }
    if (_isFn(retVal) && (arguments.length>1)) {
      retVal = retVal.apply(fnContext, fnArgs);
    }
    return retVal;
  }

  //////////////////////////////////////////////////////////////////////////////////
  xsr.renderComponent = xsr.$render = function (componentNameFull, options) {

    if (!isSPAReady) {
      $(function(){
        xsr.renderComponent(componentNameFull, options);
      });
      return;
    }
    if (!( (_doc.readyState === 'complete') || (!(_doc.readyState === 'loading' || _doc.documentElement.doScroll)) )) {
      _log.info('DOM NOT Ready. will render component ['+componentNameFull+'] on DOM Ready.');
      _doc.addEventListener('DOMContentLoaded', function(){
        xsr.renderComponent(componentNameFull, options);
      });
      return;
    }

    options = options || {};
    if (!componentNameFull) {
      console.error('Missing ComponentName to render.');
      return;
    }

    var componentName = componentNameFull;

    if (_isObj(componentNameFull)) {
      options = _mergeDeep({}, componentNameFull);
      componentNameFull = options['name'] || options['componentName'] || ('spaComponent'+_now());
      options['componentName'] = componentNameFull;
      componentName = componentNameFull;
    }

    var isReq4SpaComponent = !options['_reqFrTag_'];
    if (_isStr(componentNameFull)) {
      componentNameFull = componentNameFull.trim();
      if (componentNameFull[0] == '$') {
        isReq4SpaComponent = true;
      } else if (componentNameFull[0] == '#') {
        $(componentNameFull).spaRender(options);
        return;
      }
    } else {
      console.error('Invalid ComponentName:', componentNameFull);
      return;
    }

    if ( (!(options && _isObj(options) && options['isRefreshCall'])) && xsr.$renderCount(componentName) && _find(window, 'app.'+componentName+'.refreshCallback', '')){
      _log.info('Component ['+componentNameFull+'] has been rendered already. Refreshing instead of re-render.');
      xsr.refreshComponent(componentName, options);
      return;
    }

    _log.info('Called renderComponent: '+componentNameFull+' with options', options);

    var isServerComponent = ((/\/$|\/\/|\.|\?|\#/.test(componentName)) && (componentNameFull[0] != '$'));// || (!isReq4SpaComponent && (/[^a-z0-9]/ig).test( componentName ));
    if (isServerComponent){
      var componentUrl = componentName, urlKey;
      if (componentName[0] === xsr.api.urlKeyIndicator) {
        urlKey = componentName.trimLeftStr(xsr.api.urlKeyIndicator);
        componentUrl = xsr.api.urls[urlKey] || '';
      }
      options['componentUrl'] = componentUrl;
      _log.info('Called to render ServerComponent: ['+componentName+'] with options', options);

      if (urlKey && !componentUrl) {
        console.warn('ComponentURL undefined: app.api.urls.'+urlKey);
      }

      if (componentUrl) {
        var xTargetEl     = options['targetEl']
          , xUrlHeaders   = __finalValue(_toObj(options['urlHeaders']), options)
          , xUrlParams    = __finalValue(_toObj(options['urlParams']), options)
          , xUrlPayload   = __finalValue(_toObj(options['urlPayload']), options)
          , xUrlMethod    = (options['urlMethod'] || 'GET').toLowerCase()
          , xUrlCache     = (String(options['urlCache'] || 'false').toLowerCase() !== 'false')
          , xUrl          = xsr.api.url(componentUrl, xUrlParams)
          , xUrlError     = __finalValue(options['urlError']);

        _log.log('Loading ServerComponent ...');

        xsr.api[xUrlMethod](xUrl, xUrlPayload
          , function _onSuccess(xContent) {
              $(xTargetEl).html(xContent);
              xsr.renderComponentsInHtml(xTargetEl);
            }
          , function _onFail(jqXHR, textStatus, errorThrown) {
              if (this.onError && _isFn(this.onError)) {
                this.onError.call(this, jqXHR, textStatus, errorThrown);
              } else {
                console.warn('Unable to load ServerComponent.');
                console.error(String(textStatus).toUpperCase()+':'+errorThrown, jqXHR);
              }
            }
          , {
            ajaxOptions: {
              dataType: 'html',
              headers: xUrlHeaders,
              cache: xUrlCache,
              onError: xUrlError
            }
          });
      }
      return;
    }

    //Render SPA Component
    var isDynSpa$ = _isDynSpa$(componentNameFull);
    var isChildComponent = ((!isDynSpa$) && (/[^a-z0-9]/gi).test(componentNameFull)); //childComponentIndicator
    if (isChildComponent) {
      componentName = componentNameFull.replace(/[\s\$]/g, '').replace(/[^a-z0-9]/gi, '_').trimLeftStr('_');
    }

    var tmplId = '_rtt_'+componentName, tmplBody = '';

    options = _adjustComponentOptions(componentName, options);

    var componentPath = isChildComponent? componentName.replace(/[^a-z0-9]/gi, '/') : componentName;
    var componentFileName = componentName;
    if (isChildComponent) {
      var componentNameSplit = componentName.split('_');
      componentFileName = componentNameSplit[componentNameSplit.length-1];
    }

    var _cFldrPath   = xsr.defaults.components.rootPath+ ((xsr.defaults.components.inFolder || isChildComponent)? (componentPath+"/"): '')
      , _cFilesPath  = _cFldrPath+componentFileName
      , _cTmplFile   = _cFilesPath+xsr.defaults.components.templateExt
      , _cScriptExt  = xsr.defaults.components.scriptExt
      , _cScriptFile = (options && _isObj(options) && options.hasOwnProperty('script'))? options['script'] : ((_cScriptExt)? (_cFilesPath+_cScriptExt) : '')
      , _renderComp  = function(){
          _log.info('_renderComp: '+componentName+' with below options');
          _log.info(options);
          if (!xsr.components[componentName].hasOwnProperty('template')) {
            if (xsr.components[componentName].hasOwnProperty('templateStr') || xsr.components[componentName].hasOwnProperty('templateString')) {
              tmplBody = xsr.components[componentName]['templateStr'] || xsr.components[componentName]['templateString'] || '';
              xsr.updateTemplateScript(tmplId, tmplBody);
              xsr.components[componentName]['template'] = '#'+tmplId;
            } else  if (xsr.hasPrimaryKeys(xsr.components[componentName], 'templateUrl')) {
              var xTmplUrlPath = (xsr.components[componentName]['templateUrl'] || '').trim();
              if (xTmplUrlPath) {
                if ( (/^(\.\/)/).test(xTmplUrlPath) )  { //beginsWith ./
                  xTmplUrlPath = _cFldrPath+xTmplUrlPath.substr(2);
                }
                // if  (!((/(\.([a-z])+)$/i).test(xTmplUrlPath))) { //if no file extension, set default
                //   xTmplUrlPath += xsr.defaults.components.templateExt;
                // }
              }
              xsr.components[componentName]['template'] = xTmplUrlPath;
            } else {
              xsr.components[componentName]['template'] = _cTmplFile;
            }
          }
          _log.info('render-options: xsr.components['+componentName+']');
          _log.info(xsr.components[componentName]);
          var renderOptions = (options && options['saveOptions'])?  xsr.components[componentName] : _extend({}, xsr.components[componentName]);
          if (options) {
            if (!options.hasOwnProperty('mountComponent')) {
              delete renderOptions['mountComponent'];
            }
            _extend(renderOptions, options);
            _log.info('Extended> render-options: xsr.components['+componentName+']');
            _log.info(renderOptions);
          }

          if (renderOptions.hasOwnProperty('style') && _isStr(renderOptions.style)) {
            renderOptions['dataStyles'] = {};
            renderOptions['dataStyles'][componentName+'Style'] = (renderOptions.style=='.' || renderOptions.style=='$')? (_cFilesPath+'.css') : (((/^(\.\/)/).test(renderOptions.style))? (_cFldrPath+(renderOptions.style).substr(2)) : (renderOptions.style));
            delete renderOptions['style'];
            _log.info('Using component style for ['+componentName+']');
            _log.info(renderOptions);
          }

          if (renderOptions && _isObj(renderOptions) && renderOptions['dataCache']) {
            var $data = _find(app, componentName+'.$data', {});
            if (_isBlank($data)) {
              renderOptions['dataCache'] = false;
              _log.log('dataCache:false; Using/Ajaxing new data ...');
            } else {
              renderOptions['data'] = $data;
              renderOptions['dataProcess'] = false;
              _log.log('dataCache:true; Using $data and ingored data + dataProcess ...');
            }
          }

          xsr.render(renderOptions);
        }
      , _parseComp = function(){
          if (_cScriptFile) {
            _log.info('Loaded component ['+componentName+'] source from ['+_cScriptFile+']');
          } else {
            _log.info('Skipped Loading component ['+componentName+'] source from script file.');
          }
          _log.info('In Source> xsr.components['+componentName+']');
          _log.info(xsr.components[componentName]);
          if (!xsr.components.hasOwnProperty(componentName)) {
            _log.info('xsr.components['+componentName+'] NOT DEFINED in ['+ (_cScriptFile || 'xsr.components') +']. Creating *NEW*');
            if (_isBlank(options)) options = {};
            if (!options.hasOwnProperty('componentName')) options['componentName'] = componentName;
            xsr.components[componentName] = options;
            _log.info('NEW> xsr.components['+componentName+']');
            _log.info(xsr.components[componentName]);
          }
          _renderComp();
        };

    if (xsr.components.hasOwnProperty(componentName)) {
      _log.info('Re-rending xsr.components['+componentName+']');
      _log.info(xsr.components[componentName]);
      _renderComp();
    } else {
      //load component's base prop from .(min.)js
      if (_cScriptFile && !_isDynSpa$(componentNameFull)) {
        _log.info("Attempt to load component ["+componentNameFull+"]'s properties from ["+_cScriptFile+"]"); //1st load from server
        _cachedScript(_cScriptFile, {spaComponent:componentPath, dataType:'spaComponent', success:_parseComp, cache:xsr.defaults.components.offline}).done(noop)
          .fail(function(){
            _log.info("Attempt to Load component ["+componentNameFull+"]'s properties from ["+_cScriptFile+"] has FAILED. Not to worry. Continuing to render with default properties.");
            _parseComp();
          });
      } else {
        _parseComp();
      }
    }
  };

 /*
  * ( 'compName1', 'compName2', 'compName3', ... ) //as arguments without options
  *
  * ( 'compName1, compName2, compName3, ...' ) //as Single String with comma separated without options
  * ( ['compName1', 'compName2', 'compName3', ... ] ) //as Single Array without options
  * ( { compName1: {overrideOptions}, compName2: {overrideOptions}, ... } ) //as argument as Object
  *
  */
  function _spaRenderRefreshComponents(){
    var actionName = this.action;
    if (arguments.length){
      var compList = arguments;                //('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_isArr(arguments[0])) {         //(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_isStr(arguments[0])) { //('compName1') | xsr.renderComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             //( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }

      if (_isObj(compList)) {
        _each(_keys(compList), function(compName){
          _log.info('Rendering x-component:['+compName+']');
          spa[actionName](compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _each(compList, function(compName){
          _log.info('Rendering x-component:['+compName+']');
          spa[actionName](compName.trim());
        });
      }
    }
  }
  xsr.renderComponents = xsr.$$render = function () {
    _spaRenderRefreshComponents.apply({action: 'renderComponent'}, arguments);
  };
  xsr.refreshComponents = xsr.$$refresh = function () {
    _spaRenderRefreshComponents.apply({action: 'refreshComponent'}, arguments);
  };

  function _get$dataInAttr(el, pComponentName, newData) {
    pComponentName = pComponentName.replace(/[^a-z0-9]/gi, '_');

    var pCompRef = 'app.'+pComponentName+'.';
    if (_isObj(newData)) {
      if (!xsr.tempBind$data.hasOwnProperty(pComponentName)) xsr.tempBind$data[pComponentName] = {};
      xsr.tempBind$data[pComponentName]['$data'] = _mergeDeep({}, _find(app, pComponentName+'.$data', {}), newData);
      pCompRef = 'xsr.tempBind$data.'+pComponentName+'.';
    }

    var $el, $elData, spaCompNameWithOpt, spaCompOpt, spaCompOptions;

    $el = $(el); $elData = $el.data();
    spaCompNameWithOpt = ($el.attr('data-x-component') || $el.attr('data-spa-component') || '').split('|');
    //spaCompName = (spaCompNameWithOpt[0]).trim();
    spaCompOpt  = (spaCompNameWithOpt[1]||'').trim();

    if (spaCompOpt) {
      if (/\:\s*\$data/.test(spaCompOpt)) {
        spaCompOpt = spaCompOpt.replace(/\:\s*\$data/g, ':'+pCompRef+'$data');
      }
      spaCompOpt = _toObj(spaCompOpt);
    }

    var cOptionsInAttr = $el.attr('data-x-component-options') || $el.attr('data-x-$options') || $el.attr('data-spa-component-options') || $el.attr('data-spa-$options') || $el.attr('spa-$options') || '{}';
    spaCompOptions = _mergeDeep( {}, spaCompOpt, $elData, _toObj(cOptionsInAttr));

    if (spaCompOptions.hasOwnProperty('data') && _isStr(spaCompOptions.data)) {
      var dataPath = spaCompOptions.data.trim();
      if (/^\$data/.test(dataPath)) {
        dataPath = pCompRef+dataPath;
      }
      spaCompOptions.data = _mergeDeep({}, _find(window, dataPath, {}));
    }

    var $dataInAttr = ($el.attr('data-x-component-$data') || $el.attr('data-x-$data') || $el.attr('data-spa-component-$data') || $el.attr('data-spa-$data') || $el.attr('spa-$data') || '').trim();
    if ($dataInAttr) {
      if (/\:\s*\$data/.test($dataInAttr)) {
        $dataInAttr = $dataInAttr.replace(/\:\s*\$data/g, ':'+pCompRef+'$data');
      }
      if (_isBlank(spaCompOptions.data)) {
        spaCompOptions['data'] = _toObj($dataInAttr);
      } else {
        _mergeDeep(spaCompOptions.data, _toObj($dataInAttr));
      }
    }
    if (!_isBlank(spaCompOptions['data']) && spaCompOptions['data'].hasOwnProperty('$data')) {
      var rootData = _mergeDeep({},spaCompOptions.data.$data);
      delete spaCompOptions.data.$data;
      _mergeDeep(spaCompOptions.data, rootData);
    }

    //console.log(spaCompOptions);

    return spaCompOptions.hasOwnProperty('data')? spaCompOptions.data : {};
  }

  function _spaTagsSelector(tagNames){
    return tagNames.split(',').map(function(tagName){
      return (tagName.trim())+'[src]:not([data-spa-component]):not([data-x-component])';
    }).join(',');
  }

  function _delayedRenderFor(compName) {
    var $compContainers = $('body').find('[render-after*="'+compName+'"]');
    if ($compContainers.length) {
      var pendingList = '';
      $compContainers.each(function(i, el){
        pendingList = (' '+(_attr(el,'render-after').replace(/,/g, ' ').replace(/\s+/g, ' '))+' ').replace(' '+compName+' ', '').trim();
        if (pendingList) {
          _attr(el, 'render-after',  pendingList);
        } else {
          el.removeAttribute('render-after');
          xsr.renderComponentsInHtml(el, '', true);
        }
      });
    }
  }

  xsr.renderComponentsInHtml = function (scope, pComponentName, renderSelf) {
    scope = scope||'body';

    renderOptions  = (typeof pComponentName == 'object')? pComponentName : '';
    pComponentName = (typeof pComponentName == 'string')? pComponentName.trim() : '';

    var $spaCompList = $(scope);

    if (!renderSelf) {
      /*Register Events *for* in a, button, form elements */
      _registerEventsForComponentRender(scope);

      // <spa-template src=""> <x-template src="">
      var templateTags = _spaTagsSelector('spa-template,x-template');
      $(scope).find(templateTags).each(function(){
        // _attr(this, 'data-spa-component', _attr(this,'src'));
        _attr(this, 'data-x-component', _attr(this,'src'));
        _attr(this, 'data-skip-data-bind', 'true');
        _attr(this, 'data-template-script', 'true');
        this.style.display = 'none';
      });

      // <spa-html src=""> <x-html src=""> with optional [data] attribute
      var htmlTags = _spaTagsSelector('spa-html,x-html');
      $(scope).find(htmlTags).each(function(){
        var htmlSrc = _attr(this,'src');
        var isSpaComponent = ((htmlSrc[0] === '$') || !(/[^a-z0-9]/ig).test( htmlSrc ));
        if (isSpaComponent && !xsr.components[htmlSrc.replace(/[^a-z0-9]/gi,'_')]) {
          var cOptions = {
            templateScript: true
          };
          var skipDataBind = (!(this.hasAttribute('data') || this.hasAttribute('data-url')));
          if (skipDataBind) {
            cOptions['skipDataBind'] = true;
          } else if (!this.hasAttribute('data-url')) {
            cOptions['data'] = this.hasAttribute('data')? _toObj(_attr(this,'data')) : {};
          }
          xsr.$(htmlSrc, cOptions);
        }
        // _attr(this, 'data-spa-component', htmlSrc);
        _attr(this, 'data-x-component', htmlSrc);
      });

      // <spa-component src=""> <x-component src="">
      var componentTags = _spaTagsSelector('spa-component,x-component');
      $(scope).find(componentTags).each(function(){
        // _attr(this, 'data-spa-component', _attr(this,'src'));
        _attr(this, 'data-x-component', _attr(this,'src'));
      });

      $spaCompList = $spaCompList.find('[data-x-component],[data-spa-component]').filter(':not([render-after])');
    }

    if ($spaCompList.length){

      var $el, spaCompNameWithOpt, spaCompName, spaCompOpt, spaCompOptions, newElId, $elData;
      $spaCompList.each(function( index, el ) {
        $el = $(el); $elData = $el.data();

        var dataKeysMap = {
          url                   : "dataUrl",
          urlParams             : "dataUrlParams",
          urlMethod             : "dataUrlMethod",
          urlErrorHandle        : "dataUrlErrorHandle",
          urlHeaders            : "dataUrlHeaders",
          params                : "dataParams",
          type                  : "dataType",
          model                 : "dataModel",
          cache                 : "dataCache",
          validate              : "dataValidate",
          process               : "dataProcess"
        };
        Object.keys($elData).forEach(function(key){
          if (dataKeysMap.hasOwnProperty(key)) {
            $elData[dataKeysMap[key]] = (/params|headers/gi.test(key))? _toObj($elData[key]) : $elData[key];
            delete $elData[key];
          }
        });

        spaCompNameWithOpt = ($el.attr('data-x-component') || $el.attr('data-spa-component') || '').split('|');
        spaCompName = (spaCompNameWithOpt[0]).trim();
        spaCompOpt  = (spaCompNameWithOpt[1]||'').trim();

        if (spaCompOpt) {
          if (/\:\s*\$data/.test(spaCompOpt)) {
            spaCompOpt = spaCompOpt.replace(/\:\s*\$data/g, ':app.'+pComponentName+'.$data');
          }
          spaCompOpt = _toObj(spaCompOpt);
        }

        if (spaCompName) {
          if ((!xsr.components[spaCompName]) && (el.hasAttribute('no-script') || el.hasAttribute('noscript') || el.hasAttribute('nojs') || el.hasAttribute('no-js'))) {
            xsr.$(spaCompName, {});
          }

          if (!el.id) {
            var _spaCompName = String(spaCompName).trim();
            if (_spaCompName[0] == '$') {
              _spaCompName = _spaCompName.replace(/[^a-z0-9]/gi,'_');
            }
            _spaCompName = _spaCompName.replace(/[^a-z0-9_]/gi,'');
            newElId = 'spaCompContainer_'+_spaCompName+'_'+ ($('body').find('[rel=spaComponentContainer_'+_spaCompName+']').length+1);
            el.id = newElId;
            _attr(el, "rel", "spaComponentContainer_"+_spaCompName);
          }

          var cOptionsInAttr = $el.attr('data-x-component-options') || $el.attr('data-x-$options') || $el.attr('data-spa-component-options') || $el.attr('data-spa-$options') || $el.attr('spa-$options') || '{}';
          spaCompOptions = _mergeDeep( {target: "#"+el.id, targetEl: el, spaComponent:(spaCompName.trim()), _reqFrTag_: 1}, spaCompOpt, $elData, _toObj(cOptionsInAttr), renderOptions);

          if (el.hasAttribute('skipDataBind') || el.hasAttribute('skip-data-bind')) {
            spaCompOptions['skipDataBind'] = true;
          }

          //GET Data for render begins
          if (spaCompOptions.hasOwnProperty('data') && _isStr(spaCompOptions.data)) {
            var dataPath = spaCompOptions.data.trim();
            if (/^\$data/.test(dataPath)) {
              dataPath = 'app.'+pComponentName+'.'+dataPath;
            }
            spaCompOptions.data = _mergeDeep({}, _find(window, dataPath, {}));
          }
          var $dataInAttr = ($el.attr('data-x-component-$data') || $el.attr('data-x-$data') || $el.attr('data-spa-component-$data') || $el.attr('data-spa-$data') || $el.attr('spa-$data') || '').trim();
          if ($dataInAttr) {
            if (/\:\s*\$data/.test($dataInAttr)) {
              $dataInAttr = $dataInAttr.replace(/\:\s*\$data/g, ':app.'+pComponentName+'.$data');
            }
            if (_isBlank(spaCompOptions.data)) {
              spaCompOptions['data'] = _toObj($dataInAttr);
            } else {
              _mergeDeep(spaCompOptions.data, _toObj($dataInAttr));
            }
          }
          if (!_isBlank(spaCompOptions['data']) && spaCompOptions['data'].hasOwnProperty('$data')) {
            var rootData = _mergeDeep({},spaCompOptions.data.$data);
            delete spaCompOptions.data.$data;
            _mergeDeep(spaCompOptions.data, rootData);
          }
          //GET Data for render ends

          if (spaCompOptions.hasOwnProperty('data')){
            spaCompOptions['data_'] = _mergeDeep({}, spaCompOptions.data);
            delete spaCompOptions['data'];
          }

          _log.log('inner-component', spaCompName, 'options:', spaCompOptions);
          xsr.renderComponent(spaCompName, spaCompOptions);
        }
      });
    }
  };

  xsr.renderUtils = {
    array2ObjWithKeyPrefix: function(arrayList, keyPrefix, targetId){
      var retObj = {};
      _each(arrayList, function(item){
        item = (''+item).trimStr();
        if (item) {
          retObj[(keyPrefix + ((item.equals('.')? targetId : item).replace(/[^a-z0-9]/gi,'_')))] = (''+item);
        }
      });
      _log.log([keyPrefix, retObj]);
      return retObj;
    },
    getFn:function(fnName) {
      var _fn = fnName, _undefined;
      if (fnName) {
        if (_isStr(fnName)) {
          _fn = _find(window, fnName);
        }
      }
      return (_fn && _isFn(_fn))? _fn : _undefined;
    },
    runCallbackFn: function (fn2Call, fnArg, thisContext) {
      if (fn2Call) {
        var _fn2Call = fn2Call, fnContextName, fnContext=thisContext;

        if (_isStr(_fn2Call)) {
          if (!fnContext) {
            if (fn2Call.match(']$')) {
              fnContextName = fn2Call.substring(0, fn2Call.lastIndexOf('['));
            } else if (fn2Call.indexOf('.')>0) {
              fnContextName = fn2Call.substring(0, fn2Call.lastIndexOf('.'));
            }
            fnContext = (fnContextName)? _find(window, fnContextName) : window;
          }
          var idxBrace = _fn2Call.indexOf('(');
          if (idxBrace>0) {
            _fn2Call = _fn2Call.substr(0, idxBrace);
          }
          _fn2Call = _find(window, _fn2Call);
        }
        if (_fn2Call) {
          if (_isFn(_fn2Call)) {
            _log.info("calling callback: ", 'Fn:'+(fn2Call['name'] || ''), fn2Call);
            if (_isArr(fnArg) && fnArg[0]=='(...)') {
              fnArg.shift();
              return _fn2Call.apply(fnContext, fnArg);
            } else {
              return _fn2Call.call(fnContext, fnArg);
            }
          } else {
            _log.error("CallbackFunction <" + fn2Call + " = " + _fn2Call + "> is NOT a valid FUNCTION.");
          }
        } else {
            _log.info("CallbackFunction <" + fn2Call + "> is NOT defined.");
        }
      }
    },
    registerComponentEvents: function (compName) {
      if (compName && app[compName] && app[compName].hasOwnProperty('events')) {
        var elTargetSelector, $elTarget;
        _each(_keys(app[compName].events), function(eventId){
          if (app[compName].events[eventId].hasOwnProperty('target') && (!_isBlank(app[compName].events[eventId].target))) {
            elTargetSelector = app[compName].events[eventId].target;
            $elTarget = xsr.$(compName+' '+elTargetSelector); //$('body').find(elTargetSelector)
            $elTarget.filter(':not([spa-events-'+eventId+'="'+compName+'"])')
            .attr('spa-events-'+eventId, compName)
            .each(function(index, el){
              _each(_keys(app[compName].events[eventId]), function(eventNames){
                if (eventNames.indexOf('on')==0) {
                  _each(eventNames.split('_'), function(eventName){
                    _log.log('registering component ['+compName+'] event: '+eventId+'-'+eventName);
                    $(el).on(eventName.trimLeftStr('on').toLowerCase(), app[compName].events[eventId][eventNames]);
                  });
                }
              });
            });
          }
        });
      }
    }
  };

  function _isDynSpa$(cName) {
    return (/^(\$)*(dyn)*SPA\$/i.test(cName));
  }
  function _renderForComponent() {
    var xEl       = this;
    var forAttr   = _attr(xEl,'for');
    var forSpec   = (forAttr+'|').split('|').map(function(i){ return i.trim(); });
    var cName     = forSpec.shift();
    var cOptStr   = forSpec[0].trim();
    var cOptions  = {};

    if (cOptStr) {
      if ((cOptStr.indexOf(':')>0) && ((cOptStr.indexOf("'")>0) || (cOptStr.indexOf('"')>0) ) ) {
        cOptions = _toObj(cOptStr);
      } else {
        console.warn('Invalid Options in:', xEl);
      }
    }

    setTimeout(function(){
      var xElId     = '#'+_attr(xEl,'id');
      var ok2Render = true;
      var xElValue  = '';
      var payload   = {};
      var vErrors;

      if ((cName.length<2 && (!cName || /[^a-z]/g.test(cName))) || (_isDynSpa$(cName))) {
        cName = _attr(xEl,'spa-dyn-comp-name');
        if (!cName) {
          cName = '$dynSPA$'+_now()+_rand(0, 999);
          _attr(xEl, 'spa-dyn-comp-name', cName);
        }
      }

      if (xEl.tagName.toUpperCase() === 'FORM') {
        vErrors = xsr.validateForm(xElId, true);
        ok2Render = (_isBlank(vErrors));
        if (ok2Render) {
          payload = xEl.hasAttribute('data-nested')? xsr.serializeFormToObject(xElId) : xsr.serializeFormToSimpleObject(xElId);
          cOptions['dataUrlMethod'] = _attr(xEl,'method');
        } else {
          _log.info('Form has validation error(s):', vErrors);
        }
      } else {

        if (xEl.hasAttribute('data-validate')) {
          var xElForm = xEl.closest('form');
          if (xElForm) {
            vErrors = xsr.validateForm('#'+xElForm.id, xElId, true);
            ok2Render = (_isBlank(vErrors));
            if (!ok2Render) {
              _log.info('Element has validation error(s):', vErrors);
            }
          }
        }

        if (ok2Render) {
          xElValue = xsr.getElValue(xEl);
          ok2Render = xEl.hasAttribute('required')? !_isBlank(xElValue) : ok2Render;
          if (ok2Render && xEl.hasAttribute('name')) {
            payload[_attr(xEl,'name')] = xElValue;
          }
        }
      }

      if (ok2Render) {
        cOptions['dataXtra']      = payload;
        cOptions['dataUrlParams'] = payload;
        cOptions['dataParams']    = (cOptions.hasOwnProperty('payload') && !cOptions['payload'])? {} : payload;

        // console.log('render', cName, cOptions);
        xsr.$render(cName, cOptions);
      }

    }, (cOptions['delay']? (cOptions['delay']*1): 0));
  }

  function _registerRenderForEl(el) {
    var elTag = (el.tagName.toUpperCase());
    var onEvent = (elTag === 'FORM')? 'submit' : 'click';
    var forAttr = _attr(el,'for');

    if (/on(\s*):/i.test(forAttr)) {
      var forSpec  = (forAttr+'|').split('|').map(function(i){ return i.trim(); });
      var options  = _toObj(forSpec[1]);
      onEvent = (options['on']+'').toLowerCase();
    }

    if (elTag === 'FORM') {
      if (!el.hasAttribute('id')) {
        _attr(el, 'id', 'spaForm-' + _now() + _rand(1,999));
      }
    }

    _attr(el, 'render-on', onEvent);
    el.addEventListener(onEvent, _renderForComponent);
  }
  function _registerEventsForComponentRender(scope) {
    scope = scope || 'body';

    //elements with for attribute
    var $forElements = $(scope).find('[for]:not(label):not([render-on])');
    $forElements.each(function(i, el){
      _registerRenderForEl(el);
    });

    // forms with action="$xyz/abc"
    var $spaActionForms = $(scope).find('form[action^="$"]:not([for]):not([render-on])');
    $spaActionForms.each(function(i, el){
      _attr(el, 'for', _attr(el,'action').substr(1));
      el.removeAttribute('action');

      _registerRenderForEl(el);
    });
  }

  function _appApiDefaultPayload(){
    var defaultPayload = _find(app, 'api.ajaxOptions.defaultPayload', {});
    return (_isFn(defaultPayload)? defaultPayload() : (_isObj(defaultPayload)? _mergeDeep({}, defaultPayload) : defaultPayload) );
  }

  /*
   * xsr.render("#containerID")
   *
   * OR
   *
   uOption = {
   data                       : {}      // Data(JSON Object) to be used in templates; for html data-attribute see dataUrl

   ,dataUrl                   : ""     // External Data(JSON) URL | local:dataModelVariableName
   ,dataUrlMethod             : ""     // GET | POST; default:GET
   ,dataUrlErrorHandle        : ""     // single javascript function name to run if external data url fails; NOTE: (jqXHR, textStatus, errorThrown) are injected to the function.
   ,dataUrlHeaders            : {}     // dataUrl Headers (NO EQUIVALENT data-attribute) plain Object
   ,dataParams                : {}     // dataUrl Params (NO EQUIVALENT data-attribute)
   ,dataType                  : ""     // dataType text | json
   ,dataModel                 : ""     // External Data(JSON) "key" for DataObject; default: "data"; may use name-space x.y.z (with the cost of performance)
   ,dataCache                 : false  // External Data(JSON) Cache
   ,dataValidate              : false  // Validate Data before Rendering; boolean or function
   ,dataProcess               : function or Function name in String

   ,dataCollection            : {}    // { urls: [ {
   //              name     : 'string:dataApi'; if no (name or target) auto-keys: data0..dataN
   //            , url      : 'string:path-to-data-api'
   //            , urlParams: object: {paramKey1: paramValue1, paramKey2: paramValue2} ==> will replace in url: path-to-api/{paramKey1}/{paramKey2}
   //            , method   : 'string:GET | POST'; default:GET
   //            , type     : 'string: text | json'; default:text
   //            , params   : object:ajax-pay-load
   //            , cache    : boolean:true|false; default:false
   //            , target   : 'string:data-key-in-api-result-json'
   //            , success  : 'string:functionName'
   //            , error    : 'string:functionName' } ... ]
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

   ,dataBeforeRender          : ""    // single javascript functionName to run before render
   ,dataRenderCallback        : ""    // single javascript functionName to run after render
   ,dataRenderMode            : ""    // "":Replace target | "append" : Append to target | "prepend" : Prepend to target

   ,dataRenderId              : ""    // Render Id, may be used to locate in xsr.renderHistory[dataRenderId], auto-generated key if not defined
   ,saveOptions               : false // Save options in render-container element
   };

   xsr.render("#containerID", uOption);
   */
  xsr.render = function (viewContainerId, uOptions) {
    _log.log('xsr.render', viewContainerId, uOptions);

    if (!arguments.length) return;

    //render with single argument with target
    if ((arguments.length===1) && (typeof viewContainerId === "object")) {
      uOptions = _mergeDeep({}, viewContainerId);
      if (uOptions.hasOwnProperty("target")) {
        viewContainerId = uOptions['target'];
        delete uOptions['target'];
      } else {
        var oldTarget = $('[data-rendered-component="'+uOptions['componentName']+'"]').attr('id');
        viewContainerId = (oldTarget? '#' : '')+oldTarget;
        if (!viewContainerId) {
          console.warn('Render target is missing.');
          viewContainerId = "dynRender_"+_now()+"_"+(xsr.rand(1000, 9999));
        }
      }
      xsr.render(viewContainerId, uOptions);
      return;
    }

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
                      , beforeRender          : "dataBeforeRender"
                      , dataRenderCallBack    : "dataRenderCallback"
                      , renderCallback        : "dataRenderCallback"
                      , renderCallBack        : "dataRenderCallback"
                      , callback              : "dataRenderCallback"
                      , callBack              : "dataRenderCallback"
                      , onRemove              : "dataRemoveCallback"
                      , dataRenderMode        : "dataRenderMode"
                      , renderMode            : "dataRenderMode"
                      , renderId              : "dataRenderId"
                      };
        _each(keyMaps, function(value, key) {
          if (opt.hasOwnProperty(key)) {
            opt[value] = uOptions[key];
            delete opt[key];
          }
        });
      })(uOptions);
    }

    var retValue = {id: "", view: {}, model: {}, cron: "", elDataAttr:{}, target:viewContainerId, iOptions:uOptions};
    var spaAjaxRequestsQue = [];
    var doDeepRender = false;
    var foundViewContainer = _isElementExist(viewContainerId);
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
      , dataPreRequest : xsr.defaults.components.dataPreRequest
      , dataUrl: ""
      , dataUrlParams: {}
      , dataUrlMethod: "GET"
      , dataUrlErrorHandle: ""
      , dataUrlHeaders: {}
      , dataParams: {}
      , dataType: ""
      , dataExtra:{}
      , dataXtra:{}
      , data_    :{}
      , dataDefaults:{}
      , dataModel: ''
      , dataValidate: false
      , dataProcess: ''
      , dataUrlCache: false
      , dataCache: false
      , extend$data : xsr.defaults.components.extend$data

      , dataCollection: {}

      , dataTemplates: {}
      , dataTemplate: ''
      , dataTemplatesCache: true
      , templateScript: false
      , templateEngine: ''

      , dataScripts: {}
      , dataScriptsCache: true

      , dataStyles: {}
      , dataStylesCache: true

      , dataBeforeRender: ''
      , dataRenderCallback: ''
      , dataRemoveCallback: ''
      , dataRenderMode: ""
      , skipDataBind:false
      , render: ''
      , dataRenderId: ""
    };

    if (!foundViewContainer) {
      if (!_isElementExist("#spaRunTimeHtmlContainer")) {
        $("body").append("<div id='spaRunTimeHtmlContainer' style='display:none;'></div>");
      }
      $("#spaRunTimeHtmlContainer").append("<div id='" + viewContainerId.replace(/\#/gi, "") + "'></div>");
    }
    if (useOptions) { /* for each user option set/override internal spaRVOptions */
      /* store options in container data properties if saveOptions == true */
      var _globalCompOptions = {
        dataTemplatesCache : xsr.defaults.components.templateCache
      };
      uOptions = _mergeDeep({}, _globalCompOptions, uOptions);

      var saveOptions = (uOptions.hasOwnProperty("saveOptions") && uOptions["saveOptions"]);
      for (var key in uOptions) {
        spaRVOptions[key] = uOptions[key];
        if (saveOptions && (!(key === "data" || key === "saveOptions"))) {
          $(viewContainerId).data((''+( ('' + ( ((''+key)[4]) || '') ).toLowerCase() )+key.slice(5)), xsr.toStr(uOptions[key]));
        }
      }
    }

    _log.log(rCompName+'.$'+(spaRVOptions['isRefreshCall']?'refresh':'render')+' with options:', spaRVOptions, '$data', _find(app, rCompName+'.$data'));

    var $viewContainerId = $(viewContainerId);
    var pCompName  = $viewContainerId.attr('data-rendered-component') || '';
    var is$refresh = (pCompName == rCompName);

    function _fixRefreshCalls(propName, renderMethod, refreshMethod){
      if (_isStr(spaRVOptions[propName])
            && (spaRVOptions[propName] == ('app.'+rCompName+renderMethod))) {
        if (app[rCompName].hasOwnProperty(refreshMethod)) {
          spaRVOptions[propName] = 'app.'+rCompName+'.'+refreshMethod;
        }
      }
    }

    if (_isSpaNavBlocked( $viewContainerId )){
      _log.log('Component container [', viewContainerId,'] blocks navigation.');
      var $navBlockContainer =  $viewContainerId.hasClass( _blockNavClassName )? $viewContainerId : $viewContainerId.find( _blockNavClass );
      if ($navBlockContainer.length > 1) $navBlockContainer = $( $navBlockContainer[0] );
      if ($navBlockContainer.length) {
        var onNavAway = ($navBlockContainer.attr( _attrOnNavAway )||'').trim()
          , navAwayFn, navAwayFnRes;
        if (onNavAway) {
          if (onNavAway[0] == '#' || onNavAway[0] == '>') {
            var navAwayTargetSelector = onNavAway[0] == '>'? onNavAway.substr(1).trim() : onNavAway;
            var $navAwayTarget = $navBlockContainer.find(navAwayTargetSelector).filter(':not(.disabled):not(:disabled)');
            if ($navAwayTarget.length) {
              $navAwayTarget.trigger('click');
              return;
            }
          } else {
            navAwayFn = _find(window, onNavAway.split('(')[0].split(';')[0] );
            if (navAwayFn && _isFn(navAwayFn)) {
              navAwayFnRes = navAwayFn.call(app[pCompName], app[pCompName],  app[rCompName]);
            }
            if (navAwayFn && !(_isBool(navAwayFnRes) && navAwayFnRes)) return;
          }
        } else {
          navAwayFn = _find(app, pCompName+'.onNavBlock' );
          if (navAwayFn && _isFn(navAwayFn)) {
            navAwayFnRes = navAwayFn.call(app[pCompName], app[pCompName],  app[rCompName]);
          }
          if (navAwayFn && !(_isBool(navAwayFnRes) && navAwayFnRes)) return;
        }
      }
      _log.log('Render continues.');
    }

    if (is$refresh) {
      //Fix Callback Functions
      _log.log('$refresh - Auto-Detected', rCompName, spaRVOptions);
      if ('auto'.equalsIgnoreCase( (''+spaRVOptions.render) )) {
        _log.log('Finding for refresh events.');
        _fixRefreshCalls('dataBeforeRender', '.onRender', 'onRefresh');
        _fixRefreshCalls('dataRenderCallback', '.renderCallback', 'refreshCallback');
      }
    }

    var _renderOptionInAttr = function(dataAttrKey) {
      return ("" + $viewContainerId.data(dataAttrKey)).replace(/undefined/, "");
    };
    var _renderOption = function(optionKey, dataAttrKey) {
      return (_isBlank(spaRVOptions[optionKey]))? _renderOptionInAttr(dataAttrKey) : spaRVOptions[optionKey];
    };

    /*Render Id*/
//    var spaRenderId = ("" + $(viewContainerId).data("renderId")).replace(/undefined/, "");
//    if (!_isBlank(spaRVOptions.dataRenderId)) {
//      spaRenderId = spaRVOptions.dataRenderId;
//    }
    var spaRenderId = _renderOption('dataRenderId', 'renderId');
    retValue._renderId = (spaRenderId.ifBlankStr(("spaRender" + (_now()) + (xsr.rand(1000, 9999)))));

//    var targetRenderMode = ("" + $(viewContainerId).data("renderMode")).replace(/undefined/, "");
//    if (!_isBlank(spaRVOptions.dataRenderMode)) {
//      targetRenderMode = spaRVOptions.dataRenderMode;
//    }
    var targetRenderMode = _renderOption('dataRenderMode', 'renderMode') || 'replace';
    _log.log("Render Mode: <"+targetRenderMode+">");

    var spaTemplateType = "x-spa-template";
    var spaTemplateEngine = (spaRVOptions.templateEngine || xsr.defaults.components.templateEngine || "handlebars").toLowerCase();

    /* Load Scripts Begins */
    _log.group("spaLoadingViewScripts");
    if (!(useOptions && uOptions.hasOwnProperty('dataScriptsCache'))) /* NOT provided in Render Request */
    { /* Read from view container [data-scripts-cache='{true|false}'] */
      var scriptsCacheInTagData = _renderOptionInAttr('scriptsCache'); //("" + $(viewContainerId).data("scriptsCache")).replace(/undefined/, "");
      if (!_isBlank(scriptsCacheInTagData)) {
        spaRVOptions.dataScriptsCache = scriptsCacheInTagData.toBoolean();
        _log.info("Override [data-scripts-cache] with [data-scripts-cache] option in tag-attribute: " + spaRVOptions.dataScriptsCache);
      }
    }
    else {
      _log.info("Override [data-scripts-cache] with user option [dataScriptsCache]: " + spaRVOptions.dataScriptsCache);
    }

    var vScriptsList = _renderOptionInAttr('scripts'); //(""+ $(viewContainerId).data("scripts")).replace(/undefined/, "");
    if (vScriptsList && _isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
      vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'";
    }
    var vScripts = _toObj(vScriptsList || "{}");

    /* Check the option to override */
    if ((!(_isObj(spaRVOptions.dataScripts))) && (_isStr(spaRVOptions.dataScripts))) {
      vScriptsList = (spaRVOptions.dataScripts || "").trimStr();
      if (_isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
        vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'";
      }
      spaRVOptions.dataScripts = _toObj(vScriptsList);
    }

    if (!_isEmptyObj(spaRVOptions.dataScripts)) {
      vScripts = spaRVOptions.dataScripts;
    }
    if (_isArr(vScripts)) {
      _removeOn(vScripts,function(item){ return !item; });
    }
    _log.info(vScripts);
    var vScriptsNames;
    vScriptsList=[];
    if (vScripts && (!_isEmptyObj(vScripts))) {
      if (_isArr(vScripts)) {
        _log.info("Convert array of script(s) without scriptID to object with scriptID(s).");
        var newScriptsObj = xsr.renderUtils.array2ObjWithKeyPrefix(vScripts, '__scripts_', viewContainerId);
        _log.info("Scripts(s) with scriptID(s).");
        _log.log(newScriptsObj);
        vScripts = (_isEmpty(newScriptsObj))? {} : newScriptsObj;
      }
      _log.info("External scripts to be loaded [cache:" + (spaRVOptions.dataScriptsCache) + "] along with view container [" + viewContainerId + "] => " + JSON.stringify(vScripts));
      vScriptsNames = _keys(vScripts);
    }
    else {
      _log.info("No scripts defined [data-scripts] in view container [" + viewContainerId + "] to load.");
    }
    _log.groupEnd("spaLoadingViewScripts");

    if (vScriptsNames) {
      var scriptPath;
      vScriptsList = _map(vScriptsNames, function (scriptId) {
        scriptPath = _getFullPath4Component(vScripts[scriptId], rCompName);
        if (!(scriptPath.endsWithStrIgnoreCase( '.js' )) && (scriptPath.indexOf('?')<0)) {
          scriptPath += xsr.defaults.components.scriptExt;
        }
        return ((spaRVOptions.dataScriptsCache? '' : '~') + scriptPath);
      });
    }
    /* Load Scripts Ends */

    _log.log('Loading component [',rCompName,'] scripts:', vScriptsList);
    xsr.loadScriptsSync(vScriptsList, function _onScriptsLoadComplete(){
      /*Wait till scripts are loaded before proceed*/
      _log.info("External Scripts Loaded.");

      if (!_appApiInitialized && (_keys(app['api']).length)) _initApiUrls();

      var dataPreRequest = (spaRVOptions)? spaRVOptions['dataPreRequest'] : '';
      if (_isStr(dataPreRequest)) {
        dataPreRequest = xsr.renderUtils.getFn(dataPreRequest);
      }
      if (_isFn(dataPreRequest)) {
        try{
          var dataPreRequestRes = dataPreRequest.call(app[rCompName]);
          if (dataPreRequestRes && _isObj(dataPreRequestRes)) {
            _keys(dataPreRequestRes).forEach(function(oKey){
              if (oKey.indexOf('data')==0) {
                spaRVOptions[oKey] = dataPreRequestRes[oKey];
              }
            });
          }
        }catch(ex){
          console.error('dataPreRequest-Error in app.'+rCompName, ex);
        }
      }

      /* Load Data */
      _log.group("spaDataModel");

      var dataModelName = _renderOption('dataModel', 'model')
        , dataModelUrl  = _renderOption('dataUrl', 'url')
        , viewDataModelName
        , isLocalDataModel = (useParamData || (dataModelUrl.beginsWithStrIgnoreCase("local:")))
        , defaultDataModelName = (dataModelUrl.beginsWithStrIgnoreCase("local:")) ? dataModelUrl.replace(/local:/gi, "") : "data"
        , defPayLaod = _appApiDefaultPayload()
        , dataUrlPayLoad
        , _stringifyPayload = (spaRVOptions && spaRVOptions.hasOwnProperty('stringifyPayload'))? spaRVOptions['stringifyPayload'] : _find(app, 'api.ajaxOptions.stringifyPayload');

      dataModelName = dataModelName.ifBlankStr(defaultDataModelName);
      viewDataModelName = dataModelName.replace(/\./g, "_");

      var spaTemplateModelData = {};
      if (useParamData) {
        spaTemplateModelData[viewDataModelName] = (_isFn(spaRVOptions.data))? (spaRVOptions.data()) : (spaRVOptions.data);
        _log.info("Loaded data model [" + dataModelName + "] from argument");
      }
      else {
        if (!(useOptions && uOptions.hasOwnProperty('dataCache'))) /* NOT provided in Render Request */
        { /* Read from view container [data-cache='{true|false}'] */
          var dataCacheInTagData = _renderOptionInAttr('cache');//("" + $(viewContainerId).data("cache")).replace(/undefined/, "");
          if (!_isBlank(dataCacheInTagData)) {
            spaRVOptions.dataCache = dataCacheInTagData.toBoolean();
            _log.info("Override [data-cache] with [data-cache] option in tag-attribute: " + spaRVOptions.dataCache);
          }
        }
        else {
          _log.info("Override [data-cache] with user option [dataCache]: " + spaRVOptions.dataCache);
        }

        if (_isBlank(dataModelUrl)) { /*dataFound = false;*/
          spaTemplateModelData[viewDataModelName] = {};

          //Check dataCollection
          var dataModelCollection = _renderOptionInAttr('collection');//("" + $(viewContainerId).data("collection")).replace(/undefined/, ""); //from HTML
          if (dataModelCollection) dataModelCollection = _toObj(dataModelCollection); //convert to json if found
          if (!_isBlank(spaRVOptions.dataCollection)) //override with javascript
          { dataModelCollection = spaRVOptions.dataCollection;
          }
          if (_isArr(dataModelCollection)) dataModelCollection = {urls: dataModelCollection};

          var dataModelUrls = dataModelCollection['urls'];

          if (_isBlank(dataModelUrls)) {
            _log.info("Model Data [" + dataModelName + "] or [data-url] or [data-collection] NOT found! Check the arguments or html markup. Rendering with options.");
            spaTemplateModelData[viewDataModelName] = _mergeDeep({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra);
          }
          else { //Processing data-collection
            if (!_isArr(dataModelUrls)) {
              _log.warn("Invalid [data-urls].Check the arguments or html markup. Rendering with empty data {}.");
            }
            else {
              _log.info("Processing data-URLs");
              var dataIndexApi = 0, defaultAutoDataNamePrefix = dataModelCollection['nameprefix'] || "data";
              _each(dataModelUrls, function (dataApi) {
                var defaultApiDataModelName = (defaultAutoDataNamePrefix + dataIndexApi)
                  , apiDataModelName = _hasKey(dataApi, 'name') ? (('' + dataApi.name).replace(/[^a-zA-Z0-9]/gi, '')) : (_hasKey(dataApi, 'target') ? ('' + dataApi.target) : defaultApiDataModelName)
                  , apiDataUrl = _hasKey(dataApi, 'url') ? dataApi.url : (_hasKey(dataApi, 'path') ? dataApi.path : '');

                if (apiDataModelName.containsStr(".")) {
                  apiDataModelName = _last(apiDataModelName.split("."));
                }
                apiDataModelName = apiDataModelName.ifBlankStr(defaultApiDataModelName);
                _log.info('processing data-api for: ' + apiDataModelName);
                _log.log(dataApi);

                if (apiDataUrl) {
                  apiDataUrl = xsr.api.url(apiDataUrl, (_hasKey(dataApi, 'urlParams')? dataApi['urlParams'] : {}));

                  var dataAjaxReqHeaders = _hasKey(dataApi, 'headers')? dataApi.headers : spaRVOptions['dataUrlHeaders'];
                  if (_isBlank(dataAjaxReqHeaders)) {
                    dataAjaxReqHeaders = _find(window, 'app.api.ajaxOptions.headers', {});
                  }

                  dataUrlPayLoad = _hasKey(dataApi, 'params') ? dataApi.params : (_hasKey(dataApi, 'data') ? dataApi.data : {});
                  if ((! _hasKey(dataApi, 'defaultPayload')) && (!_isBlank(defPayLaod))) {
                    dataUrlPayLoad = _mergeDeep({}, defPayLaod, ((!_isBlank(dataUrlPayLoad) && _isObj(dataUrlPayLoad))? dataUrlPayLoad : {}));
                  }
                  if (!_isBlank(dataUrlPayLoad) && _stringifyPayload) {
                    dataUrlPayLoad = JSON.stringify(dataUrlPayLoad);
                  }

                  spaAjaxRequestsQue.push(
                    $ajax({
                      url: apiDataUrl,
                      method : (''+(dataApi['method'] || 'GET')).toUpperCase(),
                      headers: ((_isFn(dataAjaxReqHeaders))? dataAjaxReqHeaders() : dataAjaxReqHeaders),
                      data: dataUrlPayLoad,
                      cache: _hasKey(dataApi, 'cache') ? dataApi.cache : spaRVOptions.dataCache,
                      dataType: _hasKey(dataApi, 'type') ? dataApi.type : (spaRVOptions.dataType || _find(window, 'app.api.ajaxOptions.dataType', 'text')),
                      success: function (result, textStatus, jqXHR) {
                        var targetApiData
                          , targetDataModelName = _hasKey(dataApi, 'target') ? ('' + dataApi.target) : ''
                          , oResult = _isStr(result)? _toObj(''+result, 'data') : result;

                        if (targetDataModelName.indexOf(".") > 0) {
                          targetApiData = xsr.hasKey(oResult, targetDataModelName) ? _find(oResult, targetDataModelName) : oResult;
                        }
                        else {
                          try {
                            targetApiData = oResult.hasOwnProperty(targetDataModelName) ? oResult[targetDataModelName] : oResult;
                          } catch(e){
                            console.warn("Error in Data Model ["+targetDataModelName+"] in URL ["+apiDataUrl+"].\n" + e.stack);
                          }
                        }
                        if (spaTemplateModelData[viewDataModelName][apiDataModelName]) {
                          spaTemplateModelData[viewDataModelName][apiDataModelName] = [spaTemplateModelData[viewDataModelName][apiDataModelName]];
                          spaTemplateModelData[viewDataModelName][apiDataModelName].push(targetApiData);
                        }
                        else {
                          spaTemplateModelData[viewDataModelName][apiDataModelName] = targetApiData;
                        }
                        _log.info("Loaded data model [" + apiDataModelName + "] from [" + apiDataUrl + "]");

                        //Call user defined function on api-data success
                        var fnApiDataSuccess = dataApi['success'] || dataApi['onsuccess'] || dataApi['onSuccess'];
                        if (!fnApiDataSuccess) {
                          fnApiDataSuccess = dataModelCollection['success'] || dataModelCollection['onsuccess'] || dataModelCollection['onSuccess']; //use common success
                        }
                        if (fnApiDataSuccess) {
                          if (_isFn(fnApiDataSuccess)) {
                            fnApiDataSuccess.call(this, oResult, dataApi, textStatus, jqXHR);
                          }
                          else if (_isStr(fnApiDataSuccess)) {
                            var _xSuccessFn_ = _find(window, fnApiDataSuccess);
                            if (_isFn(_xSuccessFn_)) {
                              _xSuccessFn_.call(this, oResult, dataApi, textStatus, jqXHR);
                            } else {
                              _log.log('Unknown ajax success handle: '+fnApiDataSuccess);
                            }
                          }
                        }
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                        _log.warn("Error processing data-api [" + apiDataUrl + "]");
                        //Call user defined function on api-data URL Error
                        var fnOnApiDataUrlErrorHandle = dataApi['error'] || dataApi['onerror'] || dataApi['onError'];
                        if (!fnOnApiDataUrlErrorHandle) {
                          fnOnApiDataUrlErrorHandle = dataModelCollection['error'] || dataModelCollection['onerror'] || dataModelCollection['onError']; //use common error
                          var fnOnDataUrlError = spaRVOptions['dataUrlErrorHandle'] || spaRVOptions['onDataUrlError'] || spaRVOptions['onError'];
                          if ((!fnOnApiDataUrlErrorHandle) && (fnOnDataUrlError)) {
                            fnOnApiDataUrlErrorHandle = fnOnDataUrlError;
                          }
                        }
                        if (fnOnApiDataUrlErrorHandle) {
                          if (_isFn(fnOnApiDataUrlErrorHandle)) {
                            fnOnApiDataUrlErrorHandle.call(this, jqXHR, textStatus, errorThrown);
                          }
                          else if (_isStr(fnOnApiDataUrlErrorHandle)) {
                            var _xErrorFn_ = _find(window, fnOnApiDataUrlErrorHandle);
                            if (_isFn(_xErrorFn_)) {
                              _xErrorFn_.call(this, oResult, dataApi);
                            } else {
                              _log.log('Unknown ajax error handle: '+fnOnApiDataUrlErrorHandle);
                            }
                          }
                        } else {
                          if ( _isFn(app.api['onError']) ) {
                            app.api.onError.call(this, jqXHR, textStatus, errorThrown);
                          } else {
                            xsr.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
                          }
                        }
                      }
                    })
                  );//End of Ajax Que push
                }
                else {
                  _log.error("data-api-url not found. Please check the arguments or html markup. Skipped this data-api request");
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

            if (_isValidEvalStr(localDataModelName)) {
              try {
                // _evStr
                localDataModelObj = (Function('"use strict";return (' + localDataModelName + ')')());
              } catch(e) {
                console.error('Error in xsr.$(\''+(spaRVOptions['componentName'])+'\'): Invalid Data Model >> "local:'+localDataModelName+'"\n>> ' + (e.stack.substring(0, e.stack.indexOf('\n'))) );
              }
              _log.info("Using LOCAL Data Model: " + localDataModelName);
            }

            if ((!isLocalDataModel) && (dataModelName.indexOf(".") > 0)) {
              spaTemplateModelData[viewDataModelName] = xsr.hasKey(localDataModelObj, dataModelName) ? _find(localDataModelObj, dataModelName) : localDataModelObj;
            } else {
              try {
                spaTemplateModelData[viewDataModelName] = localDataModelObj.hasOwnProperty(dataModelName) ? localDataModelObj[dataModelName] : localDataModelObj;
              } catch(e){
                console.warn("Error in Data Model ["+dataModelName+"] in Local Object ["+localDataModelName+"].\n" + e.stack);
              }
            }

          }
          else { /*External Data Source*/
            dataModelUrl = xsr.api.url(dataModelUrl, _isBlank(spaRVOptions.dataUrlParams)? {} : spaRVOptions.dataUrlParams);

            _log.info("Request Data [" + dataModelName + "] [cache:" + (spaRVOptions['dataUrlCache'] || spaRVOptions['dataCache']) + "] from URL =>" + dataModelUrl);
            var ajaxReqHeaders = spaRVOptions.dataUrlHeaders;
            if (_isBlank(ajaxReqHeaders)) {
              ajaxReqHeaders = _find(window, 'app.api.ajaxOptions.headers', {});
            }

            dataUrlPayLoad = spaRVOptions.dataParams;
            if ((!spaRVOptions.hasOwnProperty('defaultPayload')) && (!_isBlank(defPayLaod))) {
              dataUrlPayLoad = _mergeDeep({}, defPayLaod, ((!_isBlank(dataUrlPayLoad) && _isObj(dataUrlPayLoad))? dataUrlPayLoad : {}));
            }
            if (!_isBlank(dataUrlPayLoad) && _stringifyPayload) {
              dataUrlPayLoad = JSON.stringify(dataUrlPayLoad);
            }

            var axOptions = {
                url: dataModelUrl,
                method: (''+(_renderOption('dataUrlMethod', 'urlMethod') || 'GET')).toUpperCase(),
                headers: ((_isFn(ajaxReqHeaders))? ajaxReqHeaders() : ajaxReqHeaders),
                data: dataUrlPayLoad,
                cache: spaRVOptions['dataUrlCache'] || spaRVOptions['dataCache'],
                dataType: spaRVOptions.dataType || _find(window, 'app.api.ajaxOptions.dataType', 'text'),
                success: function (result) {
                  xsr.console.log('API response:', result);
                  var oResult = _isStr(result)? _toObj(''+result, 'data') : result,
                      validateData = _renderOption('dataValidate', 'validate');

                  if (dataModelName.indexOf(".") > 0) {
                    spaTemplateModelData[viewDataModelName] = xsr.hasKey(oResult, dataModelName) ? _find(oResult, dataModelName) : oResult;
                  } else {
                    try{
                      if ((dataModelName == 'data') && !oResult.hasOwnProperty(dataModelName)) {
                        dataModelName = 'Data';
                        viewDataModelName = 'Data';
                      }
                      spaTemplateModelData[viewDataModelName] = (!validateData && oResult.hasOwnProperty(dataModelName)) ? oResult[dataModelName] : oResult;
                    } catch(e){
                      console.error("Error in Data Model ["+dataModelName+"] in URL ["+dataModelUrl+"].\n" + e.stack);
                    }
                  }
                  _log.info("Loaded data model [" + dataModelName + "] from [" + dataModelUrl + "]");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  //Call user defined function on Data URL Error
                  //var fnOnDataUrlErrorHandle = ("" + $(viewContainerId).data("urlErrorHandle")).replace(/undefined/, "");
                  //if (!_isBlank(spaRVOptions.dataUrlErrorHandle)) {
                  //  fnOnDataUrlErrorHandle = "" + spaRVOptions.dataUrlErrorHandle;
                  //}
                  var fnOnDataUrlErrorHandle = _renderOption('dataUrlErrorHandle', 'urlErrorHandle') || spaRVOptions['onDataUrlError'] || spaRVOptions['onError'];
                  if (!fnOnDataUrlErrorHandle) {
                    if ( _isFn(app.api['onError']) ) {
                      app.api.onError.call(this, jqXHR, textStatus, errorThrown);
                    } else {
                      xsr.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
                    }
                  } else {
                    var _xErrFn_ = _isStr(fnOnDataUrlErrorHandle)? _find(window, fnOnDataUrlErrorHandle) : fnOnDataUrlErrorHandle;
                    if (_isFn(_xErrFn_)) {
                      _xErrFn_.call(this, jqXHR, textStatus, errorThrown);
                    } else {
                      _log.log('Unknown ajax error handle: '+fnOnDataUrlErrorHandle);
                    }
                  }
                }
              };
            spaAjaxRequestsQue.push( $ajax(axOptions) );
          }
        }
      }
      _log.info("End of Data Processing");
      _log.log({o: spaTemplateModelData});
      _log.groupEnd("spaDataModel");

      /* Load Templates */
      if (dataFound) {

        //var vTemplate2RenderInTag = ("" + $(viewContainerId).data("template")).replace(/undefined/, "") || ("" + $(viewContainerId).data("html")).replace(/undefined/, "");
        //var vTemplatesList = (""+ $(viewContainerId).data("templates")).replace(/undefined/, "") || (""+ $(viewContainerId).data("htmls")).replace(/undefined/, "");
        var vTemplate2RenderInTag = _renderOptionInAttr("template") || _renderOptionInAttr("html");
        var vTemplatesList = _renderOptionInAttr("templates") || _renderOptionInAttr("htmls");
        if (vTemplatesList && _isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
          vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'";
        }
        var vTemplates = _toObj(vTemplatesList || "{}");
        /* Check the option to override */
        if ((!(_isObj(spaRVOptions.dataTemplates))) && (_isStr(spaRVOptions.dataTemplates))) {
          vTemplatesList = (spaRVOptions.dataTemplates || "").trimStr();
          if (_isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
            vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'";
          }
          spaRVOptions.dataTemplates = _toObj(vTemplatesList);
        }
        if (!_isEmptyObj(spaRVOptions.dataTemplates)) {
          vTemplates = spaRVOptions.dataTemplates;
          vTemplatesList = "" + (JSON.stringify(vTemplates));
        }
        if ((_isEmpty(_toObj((vTemplatesList||"").trimStr())))
          || (_isArr(vTemplates) && vTemplates.length==1 && _isBlank(vTemplates[0]))) {
          vTemplates = {};
          vTemplatesList = "";
        }

        _log.info("Templates:");
        _log.info(vTemplates);
        //Handle if array without templateID, convert to object with auto templateID
        if (_isArr(vTemplates) && !_isEmpty(vTemplates)) {
          _log.info("Array of template(s) without templateID(s).");
          var newTemplatesObj = xsr.renderUtils.array2ObjWithKeyPrefix(vTemplates, '__tmpl_', viewContainerId);
          _log.info("Template(s) with template ID(s).");
          _log.log(newTemplatesObj);
          if (_isEmpty(newTemplatesObj)) {
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
        if ((!vTemplates) || (_isEmptyObj(vTemplates))) {
          vTemplates = {};
          var _dataTemplate = spaRVOptions.dataTemplate
            , _tmplKey = ""
            , _tmplLoc ="";
          if (_isBlank(_dataTemplate)) { //Not-in JS option
            if (!_isBlank(vTemplate2RenderInTag)) { //Found in tag
              _log.info("Template to load from location <"+vTemplate2RenderInTag+">");
              _dataTemplate = vTemplate2RenderInTag;
            }
          }

          _dataTemplate = (_dataTemplate || "").trimStr();
          _log.info("Primary Template: <"+_dataTemplate+">");
          if (_isBlank(_dataTemplate) || _dataTemplate.equalsIgnoreCase("inline") || _dataTemplate.equals(".")){
            _log.info("Using target container (inline) content as template.");
            _tmplKey = ("_tmplInline_" +(viewContainerId.trimStr("#")));
          } else if (_dataTemplate.beginsWithStr("#")) {
            _log.info("Using page container <"+_dataTemplate+"> content as template.");
            _tmplKey = _dataTemplate.trimStr("#");
          } else {
            _log.info("External path <"+_dataTemplate+"> content as template.");
            _tmplKey = "__tmpl_" + ((''+_dataTemplate).replace(/[^a-z0-9]/gi,'_'));
            _tmplLoc = _dataTemplate;
          }

          vTemplates[_tmplKey] = _tmplLoc.replace(/['\"]/g,'');
          _log.info(vTemplates);
        }

        _log.group("spaView");

        if (vTemplates && (!_isEmptyObj(vTemplates))) {
          _log.info("Templates of [" + spaTemplateType + "] to be used in view container [" + viewContainerId + "] => " + JSON.stringify(vTemplates));
          var vTemplateNames = _keys(vTemplates);

          _log.group("spaLoadingTemplates");

          /* Template Cache Begins: if false remove old templates */
          _log.group("spaLoadingTemplatesCache");
          if (!(useOptions && uOptions.hasOwnProperty('dataTemplatesCache'))) /* NOT provided in Render Request */
          { /* Read from view container [data-templates-cache='{true|false}'] */
            //var templatesCacheInTagData = ("" + $(viewContainerId).data("templatesCache")).replace(/undefined/, "") || ("" + $(viewContainerId).data("templateCache")).replace(/undefined/, "")  || ("" + $(viewContainerId).data("htmlsCache")).replace(/undefined/, "") || ("" + $(viewContainerId).data("htmlCache")).replace(/undefined/, "");
            var templatesCacheInTagData = _renderOptionInAttr("templatesCache") || _renderOptionInAttr("templateCache") || _renderOptionInAttr("htmlsCache") || _renderOptionInAttr("htmlCache");
            if (!_isBlank(templatesCacheInTagData)) {
              spaRVOptions.dataTemplatesCache = templatesCacheInTagData.toBoolean();
              _log.info("Override [data-templates-cache] with [data-templates-cache] option in tag-attribute: " + spaRVOptions.dataTemplatesCache);
            }
          }
          else {
            _log.info("Override [data-templates-cache] with user option [dataTemplatesCache]: " + spaRVOptions.dataTemplatesCache);
          }
          _log.groupEnd("spaLoadingTemplatesCache");

          _log.info("Load Templates");
          _log.info(vTemplates);
          var tmplPayload = spaRVOptions['templateUrlPayload'];
          if ( tmplPayload && ((_isFn(tmplPayload)) || (_isStr(tmplPayload) && (tmplPayload.indexOf('=')<0)))) {
            tmplPayload = __finalValue(tmplPayload, spaRVOptions);
          }
          var tmplOptions = {
              method : spaRVOptions['templateUrlMethod']
            , params : __finalValue(spaRVOptions['templateUrlParams'], spaRVOptions)
            , payload: tmplPayload
            , headers: __finalValue(spaRVOptions['templateUrlHeaders'], spaRVOptions)
            , onError: __finalValue(spaRVOptions['onTemplateUrlError'] || spaRVOptions['onError'])
          };
          _each(vTemplateNames, function (tmplId, tmplIndex) {
            _log.info([tmplIndex, tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId, spaRVOptions]);
            spaAjaxRequestsQue = xsr.loadTemplate(tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId, spaAjaxRequestsQue, !spaRVOptions.dataTemplatesCache, tmplOptions);
          });

          var vTemplate2RenderID = "#"+(vTemplateNames[0].trimStr("#"));

          _log.info("External Data/Templates Loading Status: ", spaAjaxRequestsQue);
          _log.groupEnd("spaLoadingTemplates");

          _log.info("Render TemplateID: "+vTemplate2RenderID);

          /* Load Styles Begins */
          _log.group("spaLoadingViewStyles");
          if (!(useOptions && uOptions.hasOwnProperty('dataStylesCache'))) /* NOT provided in Render Request */
          { /* Read from view container [data-styles-cache='{true|false}'] */
            var stylesCacheInTagData = _renderOptionInAttr("stylesCache"); //("" + $(viewContainerId).data("stylesCache")).replace(/undefined/, "");
            if (!_isBlank(stylesCacheInTagData)) {
              spaRVOptions.dataStylesCache = stylesCacheInTagData.toBoolean();
              _log.info("Override [data-styles-cache] with [data-styles-cache] option in tag-attribute: " + spaRVOptions.dataStylesCache);
            }
          }
          else {
            _log.info("Override [data-styles-cache] with user option [dataStylesCache]: " + spaRVOptions.dataStylesCache);
          }

          var vStylesList = _renderOptionInAttr("styles"); //(""+ $(viewContainerId).data("styles")).replace(/undefined/, "");
          if (vStylesList && _isBlank((vStylesList || "").replace(/[^:'\"]/g,''))){
            vStylesList = "'"+ ((vStylesList).split(",").join("','")) + "'";
          }
          var vStyles = _toObj(vStylesList || "{}");

          /* Check the option to override */
          if (!_isEmptyObj(spaRVOptions.dataStyles)) {
            vStyles = spaRVOptions.dataStyles;
          }
          if (_isArr(vStyles)) {
            _removeOn(vStyles,function(item){ return !item; });
          }
          if (vStyles && (!_isEmptyObj(vStyles))) {
            if (_isArr(vStyles)) {
              _log.info("Convert array of style(s) without styleID to object with styleID(s).");
              var newStylesObj = xsr.renderUtils.array2ObjWithKeyPrefix(vStyles, '__styles_', viewContainerId);
  //            var dynStyleIDForContainer;
  //            _each(vStyles, function(styleUrl, sIndex){
  //              _log.log(styleUrl);
  //              if (styleUrl) {
  //                dynStyleIDForContainer = "__styles_" + ((''+styleUrl).replace(/[^a-z0-9]/gi,'_'));
  //                newStylesObj[dynStyleIDForContainer] = (""+styleUrl);
  //              }
  //            });
              _log.info("Style(s) with styleID(s).");
              _log.log(newStylesObj);
              vStyles = (_isEmpty(newStylesObj))? {} : newStylesObj;
            }

            _log.info("External styles to be loaded [cache:" + (spaRVOptions.dataStylesCache) + "] along with view container [" + viewContainerId + "] => " + JSON.stringify(vStyles));
            var vStylesNames = _keys(vStyles), fullStylePath;

            _log.group("spaLoadingStyles");
            _each(vStylesNames, function (styleId) {
              fullStylePath = _getFullPath4Component(vStyles[styleId], rCompName);
              spaAjaxRequestsQue = xsr.loadStyle(styleId, fullStylePath, spaRVOptions.dataStylesCache, spaAjaxRequestsQue);
            });
            _log.info("External Styles Loading Status: " + JSON.stringify(spaAjaxRequestsQue));
            _log.groupEnd("spaLoadingStyles");
          }
          else {
            _log.info("No styles defined [data-styles] in view container [" + viewContainerId + "] to load.");
          }
          _log.groupEnd("spaLoadingViewStyles");
          /* Load Styles Ends */

          $ajaxQ.apply($, spaAjaxRequestsQue)
            .then(function () {

              _log.group("spaRender[" + spaTemplateEngine + "] - xsr.renderHistory[" + retValue._renderId + "]");
              _log.info("Rendering " + viewContainerId + " using master template: " + vTemplate2RenderID);

              try {
                var isPreProcessed = false, isSinlgeAsyncPreProcess;
                var isValidData = !_renderOption('dataValidate', 'validate');
                if (!isValidData) {
                  //Get Validated using SPA.API
                  _log.info('Validating Data');
                  var fnDataValidate = _renderOption('dataValidate', 'validate');
                  if (fnDataValidate && (_isStr(fnDataValidate))) {
                    fnDataValidate = _find(window, fnDataValidate);
                  }
                  if (fnDataValidate && _isFn(fnDataValidate)) {
                    isValidData = fnDataValidate.call(spaTemplateModelData[viewDataModelName], spaTemplateModelData[viewDataModelName]);
                  } else {
                    isValidData = (xsr.api['isCallSuccess'].call(this, spaTemplateModelData[viewDataModelName], this));
                  }
                }

                var initialTemplateData = spaTemplateModelData[viewDataModelName];

                function _dataPreProcessAsync(){
                  var fnDataPreProcessAsync = _renderOption('dataPreProcessAsync', 'preProcessAsync')
                    , fnDataPreProcessAsyncResponse;

                  if (fnDataPreProcessAsync && (_isStr(fnDataPreProcessAsync))) { fnDataPreProcessAsync = _find(window, fnDataPreProcessAsync); }
                  retValue['modelOriginal'] = _extend({}, initialTemplateData);
                  retValue['model'] = initialTemplateData;
                  if (fnDataPreProcessAsync && _isFn(fnDataPreProcessAsync)) {
                    isPreProcessed = true;
                    var dataProcessContext = _extend({}, (app[rCompName] || {}), (uOptions || {}));

                    fnDataPreProcessAsyncResponse = fnDataPreProcessAsync.call(dataProcessContext, initialTemplateData);
                    isPreProcessed = (!_isUndef(fnDataPreProcessAsyncResponse));
                    if (!isPreProcessed) fnDataPreProcessAsyncResponse = [];
                    if (isPreProcessed) {
                      isSinlgeAsyncPreProcess = (!_isArr(fnDataPreProcessAsyncResponse))
                                                || (_isArr(fnDataPreProcessAsyncResponse) && fnDataPreProcessAsyncResponse.length==1);
                      if (!_isArr(fnDataPreProcessAsyncResponse)) {
                        fnDataPreProcessAsyncResponse = [fnDataPreProcessAsyncResponse];
                      }
                    }
                  }
                  return fnDataPreProcessAsyncResponse;
                }

                if (isValidData) {
                  $ajaxQ.apply($, _dataPreProcessAsync() ).done(function(){
                    var dataPreProcessAsyncRes = _arrProto.slice.call(arguments);
                    if (isPreProcessed) {
                      _log.log(rCompName,'.dataPreProcessAsync() =>', dataPreProcessAsyncRes.__now());
                      if (isSinlgeAsyncPreProcess && (dataPreProcessAsyncRes.length > 1) && (dataPreProcessAsyncRes[1] == 'success') ){
                        //&& (_isStr(dataPreProcessAsyncRes[0])) && ((/\s*\{/).test(dataPreProcessAsyncRes[0])) ){
                        //if only 1 ajax request with JSON String as response
                        dataPreProcessAsyncRes[0] = _toObj(dataPreProcessAsyncRes[0]);
                        dataPreProcessAsyncRes.splice(1);
                      } else {
                        //multiple ajax in preProcess
                        _each(dataPreProcessAsyncRes, function(apiRes, idx) {
                          if ( apiRes && _isArr(apiRes)  && (apiRes.length > 1) && (apiRes[1] == 'success') ) {
                            dataPreProcessAsyncRes[idx] = _toObj(apiRes[0]);
                          }
                        });
                      }
                      _log.log(dataPreProcessAsyncRes.__now());
                    }

                    var fnDataProcess = _renderOption('dataProcess', 'process'), finalTemplateData;
                    if (fnDataProcess && (_isStr(fnDataProcess))) {
                      fnDataProcess = _find(window, fnDataProcess);
                    }
                    retValue['modelOriginal'] = _extend({}, initialTemplateData);
                    retValue['model'] = initialTemplateData;
                    if (fnDataProcess && _isFn(fnDataProcess)) {
                      var dataProcessContext = _extend({}, (app[rCompName] || {}), (uOptions || {}));
                      dataPreProcessAsyncRes.unshift(initialTemplateData);
                      finalTemplateData = fnDataProcess.apply(dataProcessContext, dataPreProcessAsyncRes);
                    } else if (isPreProcessed) {
                      _log.warn(rCompName,'.dataPreProcessAsync without dataProcess. Merging responses.');
                      dataPreProcessAsyncRes.unshift(initialTemplateData);
                      _mergeDeep.apply(_, dataPreProcessAsyncRes);
                    }

                    retValue['model'] = (_isUndef(finalTemplateData))? initialTemplateData : finalTemplateData;
                    if (!_isObj(retValue['model'])) {
                      retValue['model'] = retValue['modelOriginal'];
                    }
                    _log.log(rCompName, 'Final Template Data:', retValue['model']);

                    { if (rCompName) {
                        if ((_isObj(app)) && app.hasOwnProperty(rCompName)) {
                          var compLocOrApiData = _mergeDeep({}, (_isObj(retValue['model'])? retValue['model'] : {'_noname' : retValue['model']}) );
                          if (compLocOrApiData.hasOwnProperty('spaComponent')) {
                            app[rCompName]['$data'] = {};
                          } else {
                            app[rCompName]['$data'] = (spaRVOptions.extend$data)? _mergeDeep({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, compLocOrApiData) : {};
                          }
                          app[rCompName]['__global__']= window || {};
                        }

                        retValue['model']['_this']  = _mergeDeep({}, _find(window, 'app.'+rCompName, {}));
                        retValue['model']['_this_'] = _mergeDeep({}, (xsr.components[rCompName] || {}), uOptions);
                      }
                      retValue['model']['_global_'] = window || {};

                      var spaViewModel = retValue.model, compiledTemplate;
                      //xsr.viewModels[retValue._renderId] = retValue.model;

                      var templateContentToBindAndRender = ($(vTemplate2RenderID).html() || "").replace(/_LINKTAGINTEMPLATE_/g,"link");
                      var allowScriptsInTemplates = spaRVOptions.templateScript || xsr.defaults.components.templateScript;
                      if (allowScriptsInTemplates){
                        templateContentToBindAndRender = templateContentToBindAndRender.replace(/_BlockedScript_ src-ref="([^"])*"/g, 'script').replace(/_BlockedScript_/g, "script");
                      } else {
                        templateContentToBindAndRender = templateContentToBindAndRender.replace(/<\/_BlockedScript_>/g, "&lt;/_BlockedScript_&gt;");
                      }

                      /* {$}                  ==> app.thisComponentName.
                      * {$someComponentName} ==> app.someComponentName.
                      *
                      * {@$}                  ==> _global_.app.thisComponentName.
                      * {@$someComponentName} ==> _global_.app.someComponentName.
                      */
                      //for values
                      var componentRefsV = templateContentToBindAndRender.match(/({\s*\@\$(.*?)\s*})/g);
                      if (!spaRVOptions.skipDataBind && componentRefsV) {
                        _each(componentRefsV, function(cRef){
                          templateContentToBindAndRender = templateContentToBindAndRender.replace((new RegExp(cRef.replace(/\$/, '\\$'), 'g')),
                            cRef.replace(/{\s*\$this|{\s*\@\$/g, '_global_.app.').replace(/}/, '.').replace(/\s/g, '').replace(/\.\./, '.'+(rCompName||'')+'.'));
                        });
                      }

                      //for reference
                      var componentRefs = templateContentToBindAndRender.match(/({\s*\$(.*?)\s*})/g);
                      if (!spaRVOptions.skipDataBind && componentRefs) {
                        _each(componentRefs, function(cRef){
                          templateContentToBindAndRender = templateContentToBindAndRender.replace((new RegExp(cRef.replace(/\$/, '\\$'), 'g')),
                            cRef.replace(/{\s*\$this|{\s*\$/g, 'app.').replace(/}/, '.').replace(/\s/g, '').replace(/\.\./, '.'+(rCompName||'')+'.'));
                        });
                      }

                      compiledTemplate = templateContentToBindAndRender;
                      _log.groupCollapsed('Template Source ...');
                      _log.log(templateContentToBindAndRender);
                      _log.groupEnd('Template Source ...');
                      _log.log("DATA for Template:", spaViewModel);
                      var skipSpaBind, spaBindData;
                      if (!_isBlank(spaViewModel)) {
                        if (spaRVOptions.skipDataBind) {
                          _log.log('Skipped Data Binding.');
                        } else {

                          if (!spaRVOptions.dataTemplatesCache) {
                            delete xsr.compiledTemplates4DataBind[rCompName];
                            delete xsr.compiledTemplates[rCompName];
                          }

                          if (!xsr.compiledTemplates4DataBind.hasOwnProperty(rCompName)) {
                            if ((/ data-bind\s*=/i).test(templateContentToBindAndRender)) {
                              templateContentToBindAndRender = _maskHandlebars(templateContentToBindAndRender);
                              _log.log('TemplateBeforeBind', templateContentToBindAndRender);
                              var data4SpaTemplate = _isObj(spaViewModel)? _mergeDeep({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, spaViewModel) : spaViewModel;
                              _log.log('SPA built-in binding ... ...', data4SpaTemplate);
                              templateContentToBindAndRender = xsr.bindData(templateContentToBindAndRender, data4SpaTemplate, '$'+rCompName);
                              templateContentToBindAndRender = _unmaskHandlebars(templateContentToBindAndRender);
                              _log.log('TemplateAfterBind', templateContentToBindAndRender);
                              if (!xsr.compiledTemplates4DataBind.hasOwnProperty(rCompName)) xsr.compiledTemplates4DataBind[rCompName] = {};
                              skipSpaBind=true;
                            }
                          }

                          if (spaTemplateEngine.indexOf('handlebar')>=0 || spaTemplateEngine.indexOf('{')>=0) {
                            if ((typeof Handlebars != "undefined") && Handlebars) {
                              _log.groupCollapsed("Data bind using handlebars on Template ...");
                              _log.log(templateContentToBindAndRender);
                              _log.groupEnd("Data bind using handlebars on Template ...");
                              try{
                                var preCompiledTemplate = xsr.compiledTemplates[rCompName] || (Handlebars.compile(templateContentToBindAndRender));
                                var data4Template = _isObj(spaViewModel)? _mergeDeep({}, retValue, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, spaViewModel) : spaViewModel;
                                spaBindData = data4Template;
                                if (!xsr.compiledTemplates.hasOwnProperty(rCompName)) xsr.compiledTemplates[rCompName] = preCompiledTemplate;
                                compiledTemplate = preCompiledTemplate(data4Template);
                                _log.log(compiledTemplate);
                              }catch(e){
                                console.error('Error in Template', e);
                              }
                            } else {
                              _log.error("handlebars.js is not loaded.");
                            }
                          }

                        }
                      }
                      _log.groupCollapsed("Compiled Template ...");
                      _log.log(compiledTemplate);
                      _log.groupEnd("Compiled Template ...");

                      doDeepRender = false;
                      retValue.view = compiledTemplate.replace(/\_\{/g,'{{').replace(/\}\_/g, '}}');

                      //Callback Function's context
                      var renderCallbackContext = rCompName? _mergeDeep({}, (app[rCompName] || {}), { __prop__: _mergeDeep({}, (uOptions||{}) ) }) : {};
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

                      /* Default Global components before-render */
                      xsr.renderUtils.runCallbackFn(xsr.defaults.components.render, fnBeforeRenderParam, renderCallbackContext);

                      //beforeRender
                      var fnBeforeRender = _renderOption('dataBeforeRender', 'beforeRender'), fnBeforeRenderRes, abortRender, abortView;
                      if (fnBeforeRender){
                        var fnBeforeRenderParam = { template: templateContentToBindAndRender, data: retValue['model'], view: retValue.view };
                        fnBeforeRenderRes = xsr.renderUtils.runCallbackFn(fnBeforeRender, fnBeforeRenderParam, renderCallbackContext);
                        if (!_isUndef(fnBeforeRenderRes)) {
                          switch (_of(fnBeforeRenderRes)) {
                            case 'string' :
                              retValue.view = fnBeforeRenderRes;
                              break;
                            case 'boolean':
                              abortRender = !fnBeforeRenderRes;
                              break;
                          }
                        }
                      }

                      abortView = (retValue.view).beginsWithStr( '<!---->' );
                      if (abortRender) {
                        retValue = {};
                        _log.warn('Render aborted by '+fnBeforeRender);
                      } else if (!abortView) {
                        var prevRenderedComponent = $viewContainerId.attr('data-rendered-component');
                        if (prevRenderedComponent && !xsr.removeComponent(prevRenderedComponent, rCompName)){
                          abortRender = true; retValue = {};
                          _log.warn('Render $'+rCompName+' aborted by $'+prevRenderedComponent+'.onRemove()');
                        }
                      }

                      if (!abortRender) {
                        if (abortView) {
                          _log.log('Rendering component [',rCompName,'] view aborted.');
                        } else {
                          var targetRenderContainerType = _renderOption('dataRenderType', 'renderType');
                          _log.log('Injecting component in DOM (',viewContainerId,').'+(targetRenderContainerType||'html'));
                          switch(targetRenderContainerType) {
                            case "value" :
                              $(viewContainerId).val(retValue.view);
                              break;
                            case "text" :
                              $(viewContainerId).text(retValue.view);
                              break;

                            default:
                              doDeepRender = true;
                              switch (true) {
                                case (targetRenderMode.equalsIgnoreCase("append")):
                                  $(viewContainerId).append(retValue.view);
                                  break;
                                case (targetRenderMode.equalsIgnoreCase("prepend")):
                                  $(viewContainerId).prepend(retValue.view);
                                  break;
                                default: $(viewContainerId).html(retValue.view); break;
                              }
                              break;
                          }
                        }

                        $(viewContainerId).attr('data-rendered-component', rCompName).data('renderedComponent', rCompName);
                        _$renderCountUpdate(rCompName);
                        _log.info("Render: SUCCESS");
                        var rhKeys = _keys(xsr.renderHistory);
                        var rhLen = rhKeys.length;
                        if (rhLen > xsr.renderHistoryMax) {
                          _each(rhKeys.splice(0, rhLen - (xsr.renderHistoryMax)), function (index, key) {
                            delete xsr.renderHistory[key];
                          });
                        }
                        retValue.cron = "" + _now();
                        if (xsr.renderHistoryMax>0) {
                          xsr.renderHistory[retValue._renderId] = retValue;
                        }

                        if (doDeepRender && !abortView) {
                          /*Register Events in Components*/
                          xsr.renderUtils.registerComponentEvents(rCompName);

                          /*display selected i18n lang*/
                          if ($(viewContainerId).find('.lang-icon,.lang-text,[data-i18n-lang]').length) {
                            xsr.i18n.displayLang();
                          }

                          _init_SPA_DOM_(viewContainerId);
                          if (!skipSpaBind) {
                            xsr.bindData(viewContainerId, spaBindData, '', true);
                          }

                          /*apply i18n*/
                          xsr.i18n.apply(viewContainerId);

                          if (_routeReloadUrl(rCompName)) return (retValue); //Routing-Request-On-Reload
                        }

                        _log.log(retValue);

                        /* component's specific callback */
                        var _fnCallbackAfterRender = _renderOptionInAttr("renderCallback");
                        if (spaRVOptions.dataRenderCallback) {
                          _fnCallbackAfterRender = spaRVOptions.dataRenderCallback;
                        }
                        var isCallbackDisabled = (_isStr(_fnCallbackAfterRender) && _fnCallbackAfterRender.equalsIgnoreCase("off"));
                        _log.info("Processing callback: " + _fnCallbackAfterRender);

                        if (!isCallbackDisabled) {
                          xsr.renderUtils.runCallbackFn(_fnCallbackAfterRender, retValue);
                        }

                        /*run callback if any*/
                        /* Default Global components callback */
                        xsr.renderUtils.runCallbackFn(xsr.defaults.components.callback, retValue, renderCallbackContext);

                        _delayedRenderFor(rCompName);

                        /*Deep/Child Render*/
                        if (doDeepRender && !abortView) {
                          $(viewContainerId).find("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]").spaRender();

                          // Deprecated----- DONOT - Enable as the renderComponentsInHtml options are used for something else***
                          // if (spaRVOptions.hasOwnProperty('mountComponent')) {
                          //   _log.info('mounting defered component', spaRVOptions.mountComponent);
                          //   $(viewContainerId).removeAttr('data-spa-component');//ToAvoid Self Render Loop
                          //   xsr.renderComponentsInHtml(spaRVOptions.mountComponent.scope, spaRVOptions.mountComponent.name, true);
                          // };
                          // Deprecated----- DONOT - Enable as the renderComponentsInHtml options are used for something else***

                          xsr.renderComponentsInHtml(viewContainerId, rCompName);
                        }

                      }//if !abortRender

                      //End of Valid Data
                    }
                  });
                }  else { //NOT a valid Data
                  if ( _isFn(app.api['onResError']) ) {
                    app.api.onResError(spaTemplateModelData[viewDataModelName], 'Invalid-Data', undefined);
                  } else {
                    xsr.api.onResError(spaTemplateModelData[viewDataModelName], 'Invalid-Data', undefined);
                  }
                }
              }
              catch(e){
                console.error(e);
              }
              _log.groupEnd("spaRender[" + spaTemplateEngine + "] - xsr.renderHistory[" + retValue._renderId + "]");
            })
            .fail(function () {
              console.error("External Data|Template|Style|Script Loading failed! Unexpected!! Check the template Path / Network. Rendering aborted.");
            });//.done(xsr.runOnceOnRender);
        }
        else {
          _log.error("No templates defined [data-templates] in view container [" + viewContainerId + "] to render. Check HTML markup.");
        }
        _log.groupEnd("spaView");
      }

    }, function _onScriptsLoadFailed(){
      console.error("External Scripts Loading Failed! Unexpected!? Check the Script Path/Network.");
    });

    return (retValue);
  };

  function _Event(eName, targetEl) {
    var xEvent;
    var isBubbles    = true;
    var isCancelable = true;
    if (isIE) {
      xEvent = document.createEvent('Event');
      xEvent.initEvent(eName, isBubbles, isCancelable);
    } else {
      xEvent = new Event(eName, {bubbles:isBubbles, cancelable:isCancelable});
    }
    if (targetEl) xEvent.targetElement = targetEl;
    return xEvent;
  }

  function _triggerClickEventOnAttr(targetEl, eAttr) {
    var targetEvent = (xsr.defaults.routes.onClickAs || 'click').toLowerCase();
    var $targetEl = $(targetEl);
    var jsStmts   = (''+(_attr(targetEl,eAttr)) || '').trim();
    var useEventDispatch = (targetEvent !== 'click');

    if ((jsStmts && (!(('null' == jsStmts) || ('undefined' == jsStmts))))
      && (!($targetEl.hasClass('disabled') || $targetEl.is('[disabled]') || $targetEl.is(':disabled')))) {
      try {
        if (useEventDispatch) {
          var onAltEventName = 'on'+targetEvent;
          $targetEl.renameAttr(eAttr, onAltEventName);
          targetEl.dispatchEvent( _Event(targetEvent, targetEl) );
          $targetEl.renameAttr(onAltEventName, eAttr);
        } else {
          // _evStr
          jsStmts.split(';').forEach(function(stmt){
            if (stmt.trim()) {
              Function('event','(' + (stmt.trim()) + ')').call( targetEl, _Event(targetEvent, targetEl) );
            }
          });
        }
      } catch (e) {
        console.error((e.stack.substring(0, e.stack.indexOf('\n')))
          +'! Failed to trigger ['+targetEvent+'(:->'+eAttr+')] event on Element:\n', targetEl);
      }
    }
  }

  function _disabledElClick(e) {
    var targetEl = this
      , $el = $(targetEl);

    if ($el.hasClass('disabled') || $el.is('[disabled]') || $el.is(':disabled') ) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    } else {
      _triggerClickEventOnAttr(targetEl, 'onclickthis');
    }
  }
  function _initSpaElements(scope){
    var $context  = $(scope||'body')
      , $forms    = $context.find('form:not([action]):not([method]):not([onsubmit])')
      , hrefNonRouteFilter = _routeByHref? '.no-spa-route' : ''
      , $aLinksEx = $context.find('a[href*="//"]:not([target])'+hrefNonRouteFilter)
      , $aLinksIn = $context.find('a:not([href]):not(.no-link)')
      , $clickEls = $context.find('[onclick]:not(:input):not(['+(_attrSpaRoute)+']):not([onclickthis])');

    //Fix Forms
    $forms.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('onsubmit', 'return false;').addClass('spa-form'); //Disable form submit

    //Fix a tags
    $aLinksEx.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('target', '_blank').attr('rel', 'noopener noreferrer').addClass('spa-external-link'); //set target for external links
    $aLinksIn.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('href', 'javascript:;').addClass('spa-link'); //disable href for internal links

    //Fix clickable elements button for disable
    $clickEls.filter(function(){
      return !$(this).closest('pre').length;
    }).addClass('as-btn').renameAttr('onclick', 'onclickthis').on('click', _disabledElClick);
  }
  xsr.initElementsIn = _initSpaElements;

  function _initFormValidation(el){
    var $el = $(el), formId, $elData, hasCtrlElements, enableDefaultOffline = _find(spa, '_validate.defaults.offline', true);

    if ($el.length == 1) {
      formId  = $el.attr('id') || '';
      if (!formId) {
        formId = $el.attr('name') || ('spaForm'+_now());
        $el.attr('id', formId);
      }
      $elData = $el.data();
      hasCtrlElements = $el.has('.ctrl-on-change,.ctrl-on-validate').length;

      if (enableDefaultOffline) {
        var vDefaults = (($el.attr('data-validate-defaults')||'').trim());
        if (vDefaults) {
          if (vDefaults.indexOf('offline')<0) {
            if (vDefaults.endsWithStr('}')) {
              var insertPos = vDefaults.lastIndexOf('}');
              vDefaults = [vDefaults.slice(0, insertPos), ',offline:true', vDefaults.slice(insertPos)].join('');
            } else {
              vDefaults += ',offline:true';
            }
          }
          $el.attr('data-validate-defaults', vDefaults);
        } else {
          $el.attr('data-validate-defaults', '{offline:true}');
        }
      }

      if (!$el.is('[data-validate-form]')) $el.attr('data-validate-form', '');
      $el.attr('data-validation-initialized', '');

      //Disable form submit;
      if (!$el.attr('onsubmit')) $el.attr('onsubmit', 'return false;');

      $el.on('change', function(){
        xsr.updateTrackFormCtrls(this);
      });

      $el.find('textarea,input:not(:checkbox),input:not(:radio)').filter(':not([data-validate])').each(function(){
        _attr(this, 'data-validate',"{onInput:{fn:_check.noop}}");
      });

      var xssValidationSpec = ''
        , xssValidation     = xsr.defaults.validation.xss
        , vXssInAttr        = ($el.attr('data-validate-xss') || '').trim()
        , xssValidationMsg  = (xssValidation.msg || '').trim();

      if ( /msg\s*:/g.test(vXssInAttr) ) {
        xssValidationMsg = _toObj(vXssInAttr)['msg'];
        if (xssValidationMsg) {
          vXssInAttr = 'on';
        } else {
          xssValidationMsg = 'Invalid input.';
        }
      }

      if (xssValidationMsg && !(vXssInAttr.equalsIgnoreCase( 'off' ) || vXssInAttr.equalsIgnoreCase( 'no' ) || vXssInAttr.equalsIgnoreCase( 'skip' ) || vXssInAttr.equalsIgnoreCase( 'false' )) ){
        if (vXssInAttr.length > 4) {
          xssValidationSpec = ","+vXssInAttr;
        } else {
          xssValidationSpec = ",on"+(xssValidation.on.capitalize())+":{fn:'"+(xssValidation.fn)+"',msg:'"+(xssValidationMsg)+"'}";
        }
      }

      //clear validate msg on focus
      var commonClearFnSpec = "onFocus:{fn:_clearSpaValidateMsg,offline:false}"+xssValidationSpec;
      var cValidateInAttr = ($el.attr('data-validate-common') || '').trim();
      if (cValidateInAttr) {
        if (cValidateInAttr.indexOf('_clearSpaValidateMsg')<0) {
          var newAttr;
          if (cValidateInAttr[0] == '{') {
            cValidateInAttr[0] = ',';
            newAttr = '{'+commonClearFnSpec+cValidateInAttr;
          } else {
            newAttr = '{'+commonClearFnSpec+','+cValidateInAttr+'}';
          }
          $el.attr('data-validate-common', newAttr);
        }
      } else {
        $el.attr('data-validate-common', '{'+commonClearFnSpec+'}');
      }

      xsr.initDataValidation('#'+ ( (($elData['validateForm'] || $elData['validateScope'] || '').replace(/[#onRender]/gi,'')) || formId));
      if (!$el.hasClass('track-changes') && hasCtrlElements) {
        xsr.trackFormElChange(el);
      }
      if ('onRender'.equalsIgnoreCase($elData['validateForm'])) {
        xsr.validateForm('#'+formId, true, true);
      }
    }

  }

  function _initFormValidationInScope(container){
    if (xsr.hasOwnProperty('initDataValidation')) {
      $(container || 'body').find('[data-validate-form],[data-validate-scope],form:has([data-validate])')
                            .filter(':not([data-validation-initialized])').each(function (i, el){
                              _initFormValidation(el);
                            });
    } else {
      console.warn('SPA validation module is not loaded.');
    }
  }

  function _setElIdIfNot(el) {
    var $el = $(el);
    if (_isBlank($el.attr("id"))) {
      $el.attr("id", ("_el_" + (_now()) + "_" + xsr.rand(1000, 9999)));
    }
    return ($el.attr("id"));
  }
  function __renderView(obj, opt) {
    var retValue;
    var viewContainerId = _setElIdIfNot(obj);
    if ((opt) && (!_isEmptyObj(opt))) {
      retValue = xsr.render("#" + viewContainerId, opt);
    }
    else {
      retValue = xsr.render("#" + viewContainerId);
    }
    return retValue;
  }

  var
	  rCRLF = /\r?\n/g,
    rsubmittable = /^(?:input|select|textarea|keygen)/i,
	  rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rcheckableType = ( /^(?:checkbox|radio)$/i );
	function _jQserializeArray() {
		return this.map( function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = $.prop( this, "elements" );
			return elements ? $.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;
			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !$( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
      var val = xsr.getElValue(elem); //$( this ).val();
			if ( val == null ) {
				return null;
			}
			if ( Array.isArray( val ) ) {
				return _map( val, function( val ) {
					return { name: elem.name, value: _isStr(val)? val.replace( rCRLF, "\r\n" ) : val };
				} );
			}
			return { name: elem.name, value: _isStr(val)? val.replace( rCRLF, "\r\n" ) : val };
		} ).get();
	}

  //Extend jQuery for custom utils
  $.fn.extend({
    serializeToArray             : _jQserializeArray,
    serializeUncheckedCheckboxes : _serializeUncheckedCheckboxes,
    serializeFormToJSON          : _serializeFormToObject,
    serializeFormToObject        : _serializeFormToObject,
    serializeFormToSimpleJSON    : _serializeFormToSimpleObject,
    serializeFormToSimpleObject  : _serializeFormToSimpleObject,

    /* $("el-selector").i18n('i18n.key') */
    i18n: function (opt) {
      this.each(function () {
        if (opt) $(this).attr('data-i18n', opt).data('i18n', opt);
        xsr.i18n.apply(this);
      });
      return this;
    },
    spaRender: function (opt) {
      this.each(function () {
        //__renderView(this, opt);
        xsr.renderComponentsInHtml(this, opt, true);
      });
    },
    renameAttr: function(oldName, newName){
      this.each(function(){
        _attr(this, newName, _attr(this,oldName));
        this.removeAttribute(oldName);
      });
      return this;
    },
    spa$: function(){
      return this.map(function(){ return $(this).closest('[data-rendered-component]'); });
    },
    spa$name: function(){
      var retValue = this.map(function(){ return $(this).closest('[data-rendered-component]').attr('data-rendered-component'); });
      return (retValue.length == 1)? retValue[0] : retValue;
    },
    spaBindData: function(data, elFilter){
      return xsr.bindData(this, data, elFilter);
    },
    inBlockedSpaNavContainer:function(){
      return !!(this.closest(_blockNavClass).length);
    },
    blockNav: function(){
      _blockSpaNavigation(this);
      return this;
    },
    allowNav: function(){
      _allowSpaNavigation(this);
      return this;
    },
    isNavBlocked: function(){
      return _isSpaNavBlocked(this);
    },
    isNavAllowed: function(){
      return _isSpaNavAllowed(this);
    },
    disable: function(disable){
      if ((!!disable) || _isUndef(disable)) {
        return this.css('pointer-events', 'none').addClass('disabled').attr('disabled', 'disabled');
      } else {
        return this.enable(true);
      }
    },
    enable: function(enable){
      if ((!!enable) || _isUndef(enable)) {
        return this.css('pointer-events', 'auto').removeClass('disabled').removeAttr('disabled');
      } else {
        return this.disable(true);
      }
    },
    value:function(newValue, eventAfterUpdate){
      if (_isUndef(newValue)) {
        return this.val();
      } else {
        this.each(function(){
          $(this).val(newValue).trigger(eventAfterUpdate || 'change');
        });
        return this;
      }
    },
    htm:function(newValue){
      if (_isUndef(newValue)) {
        return this.html();
      } else {
        this.each(function(){
          $(this).html( xsr.sanitizeScript(newValue) );
        });
        return this;
      }
    },
    dataJSON:function(key, newValue, overWrite){
      var curElData;
      if (arguments.length) {
        curElData = _toObj(this.data(key));
        curElData = _isObj(curElData)? curElData : {};
        if (!_isUndef(newValue)) {
          curElData = overWrite? newValue : (_mergeDeep(curElData, newValue));
          var curElDataStr = JSON.stringify(curElData);
          var keyDashed = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          this.attr("data-"+keyDashed, curElDataStr).data(key, curElDataStr);
        }
      } else {
        curElData = this.data();
      }
      return curElData;
    },
    isDisabled: function(fnCall){
      var isDisabled = (this.hasClass('disabled') || this.is('[disabled]'));
      if (isDisabled && fnCall) { fnCall.call(this, this); }
      return isDisabled;
    },
    isEnabled: function(fnCall){
      var isEnabled = !this.isDisabled();
      if (isEnabled && fnCall) { fnCall.call(this, this); }
      return isEnabled;
    },
    trackChanges: function(){
      xsr.trackFormElChange(this);
    },
    isChanged: function( anyOrAll ){
      anyOrAll = ((anyOrAll || 'ANY').toUpperCase());
      var all = (anyOrAll == 'ALL'),
          any = (!all),
          isChanged = false,
          $elements = this;

      if ($elements.length) {
        for(var i=0; i < $elements.length; i++){
          var elType = $elements[i].tagName.toUpperCase();
          if ('FORM' == elType) {
            isChanged = $($elements[i]).find('input,textarea,select').isChanged(anyOrAll);
          } else if ('/INPUT/TEXTAREA/SELECT/'.indexOf(elType) > 0) {
            isChanged = xsr.isElValueChanged( $elements[i] );
            if (any && isChanged) break;
            if (all && !isChanged) break;
          }
        }
      }

      return isChanged;
    },
    initSpaRoutes: function(){
      _initRouteHash(this);
    },
    initFormValidation: function(){
      var $forms = this.filter('form');
      if (!$forms.length) return 'Form Not Found';
      $forms.each(function(i, form){
        _initFormValidation(form);
      });
    },
    validateForm: function(elFilter, showMsg, validateAll){
      var vResponse, $form = this;
      if ($form.length>1) {
        vResponse = [{errcode:1, errmsg:"Too many forms to validate."}];
      } else if ($form.length==1) {
        var formId = '#'+$form.attr('id'), elType = ($form.prop('tagName')||'').toUpperCase();
        if ('FORM' == elType) {
          if (_isStr(elFilter)) {
            var elIDs = $form.find(elFilter).map(function(){ return this.id; }).get().join();
            vResponse = xsr.validateForm(formId, elIDs, showMsg, validateAll);
          } else {
            vResponse = xsr.validateForm(formId, arguments[0], arguments[1]);
          }
        } else {
          vResponse = [{errcode:1, errmsg:"NOT a FORM"}];
        }
      } else {
        vResponse = [{errcode:1, errmsg:"Form Not Found."}];
      }

      return vResponse;
    },
    updateValidation: function(isValid, invalidErrMsg){
      this.each(function(i, el){
        xsr._validate._showValidateMsg(el, invalidErrMsg, isValid);
      });
    },
    updateValidationPromise: function(promiseNames, isValid, invalidErrMsg){
      xsr.updateValidationPromise(promiseNames, this, invalidErrMsg, isValid);
    }
  });


  xsr.initDataValidation = function () {
    _log.log("include validate framework lib (spa-validate.js) to use this feature!");
  };
  xsr.doDataValidation = function () {
    _log.log("include validate framework lib (spa-validate.js) to use this feature!");
  };

  xsr.properties = {
    version: xsr.VERSION
  };

  //API Section begins
  xsr.api = {
    baseUrl:'',
    liveUrlSuffix:'',
    urls:{},

    mock:false,
    mockBaseUrl:'', //TOBE REMOVED!
    mockRootFolder:'api_',
    mockDataFile: 'data.json',

    defaultPayload:false,
    forceParamValuesInMockUrls:false,
    urlKeyIndicator:'@',
    url: function(apiKey, urlReplaceKeyValues){
      apiKey = (apiKey||'').trimLeftStr(xsr.api.urlKeyIndicator);
      urlReplaceKeyValues = urlReplaceKeyValues || {};

      var apiUrl = (xsr.api.urls[apiKey] || apiKey)
        , isStaticUrl = apiUrl.beginsWithStr('!') || xsr.api.mock || app.api.mock
        , forceParamValuesInMockUrls = apiUrl.beginsWithStr('!!') || apiUrl.beginsWithStr('~') || xsr.api.forceParamValuesInMockUrls
        , paramsInUrl = apiUrl.extractStrBetweenIn('{', '}', true)
        , pKey, pValue, skip, vFilters=[], filterContext = {url: apiUrl, urlParams: urlReplaceKeyValues}, defaultValue;

      if (!_isBlank(paramsInUrl)) {
        _each(paramsInUrl, function(param){
          pKey   = param.replace(/[{}<>]/g, '').trim();
          if (pKey) {
            if (pKey.indexOf('|')>0) {
              vFilters = pKey.split('|').map(function(x){ return x.replace(/\(.*\)/g, '').trim(); });
              pKey = vFilters.shift();
            }
            if (pKey.indexOf(':')>0) {
              var pKeyDefault = pKey.split(':');
              pKey         = pKeyDefault[0].trim();
              defaultValue = pKeyDefault[1].trim();
            }

            if (pKey[0] == '#') {
              pValue = xsr.getElValue(pKey);
            } else {
              skip = _isBlank(urlReplaceKeyValues);
              if (!skip) {
                pValue = _find(urlReplaceKeyValues, pKey, urlReplaceKeyValues['_undefined']);
                if ((typeof pValue == 'string') && (pValue.indexOf('$#')==0)) {
                  pValue = xsr.getElValue(pValue.substr(1));
                }
                pValue = ((isStaticUrl && !forceParamValuesInMockUrls)? (param.containsStr('>')? pValue : ('_'+pKey)) : pValue);
              }
            }
            for(var x=0, fLen=vFilters.length; x < fLen; x++) {
              if (vFilters[x]) {
                if (vFilters[x][0]=='.') {
                  try {
                    pValue = pValue[vFilters[x].substr(1)]();
                  } catch(e) {
                    console.error('Error parsing urlParam: '+pValue+vFilters[x]+'()', 'param:', pValue, filterContext, e);
                  }
                } else {
                  pValue = xsr.renderUtils.runCallbackFn(vFilters[x], pValue, filterContext);
                }
              }
            }

            if (typeof pValue == 'undefined' || pValue === 'undefined') {
              pValue = defaultValue;
            }

            if (!(skip && _isBlank(vFilters))) {
              apiUrl = apiUrl.replace(new RegExp(param.replace(/([^a-zA-Z0-9])/g,'\\$1'), 'g'), (''+pValue));
            }
          }
        });
      }
      return apiUrl;
    },
    success: function(resData){
      return [resData, 'success'];
    },
    isCallSuccess : function() {
      return true;
    },
    onReqError : function (jqXHR, textStatus, errorThrown) {
      //This function is to handles if Ajax request itself failed due to network error / server error
      //like 404 / 500 / timeout etc.
      _log.error([jqXHR, textStatus, errorThrown]);
      _log.error($(jqXHR.responseText).text());
    },
    onResError : function () {
      //This function is to handle when xsr.api.isCallSuccess returns false
    },
    _call : function(ajaxOptions){
      /* set additional options dataType, error, success */
      var defAjaxOptions = _find(window, 'app.api.ajaxOptions', {});
      var apiErroHandle = (_isObj(ajaxOptions) && ajaxOptions.hasOwnProperty('error'))? ajaxOptions['error'] : (app.api['onError'] || xsr.api.onReqError);

      ajaxOptions = _extend({}, defAjaxOptions, ajaxOptions,  {
        error: apiErroHandle,
        success: function(axResponse, textStatus, jqXHR) {
          axResponse = (_isStr(axResponse) && (String(this.dataType).toLowerCase() != 'html'))? _toObj(axResponse) : axResponse;
          if (xsr.api['isCallSuccess'].call(this, axResponse, this)) {
            ajaxOptions._success.call(this, axResponse, textStatus, jqXHR);
          }
          else {
            if ( _isFn(app.api['onResError']) ) {
              app.api.onResError.call(this, axResponse, textStatus, jqXHR);
            } else {
              xsr.api.onResError.call(this, axResponse, textStatus, jqXHR);
            }
          }
        }
      });

      if (!ajaxOptions['dataType']) {
        ajaxOptions['dataType'] = 'text';
      }

      if (('json').equalsIgnoreCase(ajaxOptions['dataType']) && (!ajaxOptions['contentType'])) {
        ajaxOptions['contentType'] = 'application/json';
      }

      if (ajaxOptions['data'] && _isObj(ajaxOptions['data']) && ajaxOptions['stringifyPayload']) {
        delete ajaxOptions['stringifyPayload'];
        ajaxOptions['data'] = JSON.stringify(ajaxOptions['data']);
      }

      if (ajaxOptions['defaultPayload']) {
        var reqPayloadType = _of(ajaxOptions['data'])
          , defaultPayload = ajaxOptions['defaultPayload']
          , defaultPayloadX = (_isFn(defaultPayload)? defaultPayload(reqPayload) : (_isObj(defaultPayload)? _mergeDeep({}, defaultPayload) : defaultPayload))
          , reqPayload = (reqPayloadType == 'string')? _toObj(ajaxOptions['data']) : ajaxOptions['data'];

        if (_isObj(defaultPayloadX)) {
          var finalReqPayload = (_isObj(reqPayload))? _mergeDeep({}, defaultPayloadX, reqPayload) : defaultPayloadX;
          if (!_isBlank(finalReqPayload) && (reqPayloadType == 'string')) {
            finalReqPayload = JSON.stringify(finalReqPayload);
          }
          ajaxOptions['data'] = finalReqPayload;
        }
      }

      if ((ajaxOptions.url).beginsWithStr(xsr.api.urlKeyIndicator)){
        ajaxOptions.url = xsr.api.url((ajaxOptions.url).trimLeftStr(xsr.api.urlKeyIndicator), ajaxOptions.data);
      }

      if ((app['api'] && app.api['debug']) || app['debug'] || spa['debug']) console.info(['API(ajax) call with options', ajaxOptions]);

      return $ajax(ajaxOptions);
    },
    _params2AxOptions : function(){
      var oKey, axOptions = {method:'GET', url:'', data:{}, _success:function(){}, async: true }, hasPayLoad, axOverrideOptions, hasSuccessFn;
      _each(arguments, function(arg){
        switch(true){ //NOTE: DON'T CHANGE THE ORDER
          case (_isStr(arg))  : oKey='url';
            if (axOptions['url']) {
              hasPayLoad = true;
              oKey='data';
            }
            break;
          case (_isFn(arg)):
            if (!hasSuccessFn) {
              hasSuccessFn = true;
              oKey='_success';
            } else {
              oKey='error';
            }
            break;
          case (_isBool(arg)) : oKey='async'; break;
          case (_isObj(arg))  :
            if ( hasPayLoad || arg.__hasPrimaryKeys('ajaxOptions|dataUrlParams') ) {
              oKey='axOptions';
              axOverrideOptions = arg.hasOwnProperty('ajaxOptions')? arg['ajaxOptions'] : arg;
            } else {
              oKey='data';
              hasPayLoad = true;
            }
            break;
          default: oKey = 'unknown'; break;
        }
        if (oKey != 'axOptions') axOptions[oKey] = arg;
      });

      if (axOverrideOptions) {
        if (axOverrideOptions['dataUrlParams']) {
          if ((''+(axOptions['url'])).beginsWithStr(xsr.api.urlKeyIndicator)){
            axOptions.url = xsr.api.url((axOptions.url).trimLeftStr(xsr.api.urlKeyIndicator), axOverrideOptions['dataUrlParams']);
          }
          delete axOverrideOptions['dataUrlParams'];
        }
        _mergeDeep(axOptions, axOverrideOptions);
      }
      _log.log('API ajax options >>');
      _log.log(axOptions);
      return (axOptions);
    },
    get : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return xsr.api._call(xsr.api._params2AxOptions.apply(undefined, arguments));
    },
    post: function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return xsr.api._call(_extend(xsr.api._params2AxOptions.apply(undefined, arguments), {method:'POST'}));
    },
    put : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return xsr.api._call(_extend(xsr.api._params2AxOptions.apply(undefined, arguments), {method:'PUT'}));
    },
    del : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return xsr.api._call(_extend(xsr.api._params2AxOptions.apply(undefined, arguments), {method:'DELETE'}));
    },
    mix : function(){
      var apiQue=[], fnWhenDone = arguments[arguments.length-1];
      for(var i=0; i<arguments.length; i++){
        if (_isArr(arguments[i])) {
          apiQue = apiQue.concat(arguments[i]);
        } else if (!_isFn(arguments[i])) {
          apiQue.push(arguments[i]);
        }
      }
      return $ajaxQ.apply($, apiQue).done(function(){
        var apiResponses = _arrProto.slice.call( arguments );

        if ((apiQue.length==1) && (apiResponses.length > 1) && (apiResponses[1] == 'success') ){
          //if only 1 ajax request with success response
          apiResponses[0] = _toObj(apiResponses[0]);
          apiResponses.splice(1); //remove 2nd and 3d arguments 'success' and jqXHR
        } else {
          //multiple ajax requests
          _each(apiResponses, function(apiRes, idx) {
            if ( apiRes && _isArr(apiRes)  && (apiRes.length > 1) && (apiRes[1] == 'success') ) {
              apiResponses[idx] = _toObj(apiRes[0]);
            }
          });
        }

        if (fnWhenDone && _isFn(fnWhenDone)) {
          fnWhenDone.apply(undefined, apiResponses);
        }
      });
    }
  };//End of xsr.api{}
  //API Section Ends

  xsr.i18n.onLangChange;
  xsr.i18n.displayLang = function(){
    var selectedLang = $('html').attr('lang');
    if (selectedLang){
      var selLangCode   = selectedLang,
          selLangCode_  = selectedLang.replace('-', '_'),
          $el           = $('[data-i18n-lang="'+(selLangCode)+'"],[data-i18n-lang="'+(selLangCode_)+'"]'),
          i18nKey       = ($('body').attr('i18n-lang-key-prefix') || 'lang.name.')+selLangCode_,
          langClassType = '-';
      $('.lang-text').attr('data-i18n', i18nKey).data('i18n', i18nKey);
      $('[data-i18n-lang]').removeClass('active');
      if ($el.length) {
        $el.addClass('active');
        langClassType = ($($el[0]).data('i18nLang') || '').replace(/[a-z]/gi,'');
        $('.lang-icon').removeClass(_arrProto.join.call($('[data-i18n-lang]').map(function(i, el){ return $(el).data('i18nLang'); }), ' '));
      }
      $('.lang-icon').addClass( (langClassType=='-')? selLangCode : selLangCode_ );
      xsr.i18n.apply('.lang-text');
    }
    return selectedLang;
  };
  function init_i18n_Lang() {
    // function setLang(uLang, options, isAuto) {
    //   if (uLang) {
    //     if (xsr.i18n.onLangChange) {
    //       var fnOnLangChange = xsr.i18n.onLangChange,
    //           nLang = (_isFn(fnOnLangChange))? fnOnLangChange.call(undefined, uLang, isAuto) : uLang;
    //       uLang = (_isStr(nLang))? nLang : uLang;
    //     }
    //     $('html').attr('lang', uLang.replace('_', '-'));
    //     xsr.i18n.setLanguage(uLang, _mergeDeep({}, xsr.defaults.lang, _find(window, 'app.conf.lang', {}), _find(window, 'app.lang', {}), (options||{}) ));
    //   }
    // }

    $(document).on("click", "[data-i18n-lang]", function() {
      var elData = $(this).data(),
          selLangCode  = (elData['i18nLang']||''),
          selLangCode_ = (elData['i18nLang']||'').replace('-', '_'),
          i18nKey = ($('body').attr('i18n-lang-key-prefix') || 'lang.name.')+selLangCode_;
      _setLang(selLangCode_, { callback: function(){
        var langClassType = '-', $langSelElement = $('[data-i18n-lang]:first');
        if ($langSelElement.length) {
          langClassType = ($langSelElement.data('i18nLang') || '').replace(/[a-z]/gi,'');
        }
        $('.lang-text').attr('data-i18n', i18nKey).data('i18n', i18nKey);
        $('.lang-icon').removeClass(_arrProto.join.call($('[data-i18n-lang]').map(function(i, el){ return $(el).data('i18nLang'); }), ' ')).addClass( (langClassType=='_')? selLangCode_ : selLangCode);
        $('[data-i18n-lang]').removeClass('active');
        $('[data-i18n-lang="'+(selLangCode)+'"],[data-i18n-lang="'+(selLangCode_)+'"]').addClass('active');
        xsr.i18n.apply('.lang-text');
      }});
    });

    var defaultLang = ($('body').attr('i18n-lang') || '').replace(/ /g,''), initialLang = defaultLang.split(',')[0];
    if (defaultLang) {
      if (initialLang == '*') {
        initialLang = xsr.i18n.browserLang();
        if ((','+(defaultLang.toLowerCase())+',').indexOf(','+(initialLang.toLowerCase())+',') < 0) {
          initialLang = initialLang.getLeftStr(2).toLowerCase();
          var supportedLangs = defaultLang.split(','), supportedLang='', matchLang='';
          for (var i=0; i<supportedLangs.length; i++){
            supportedLang = (supportedLangs[i] || '').trim();
            if (supportedLang.toLowerCase().indexOf( initialLang ) == 0) {
              matchLang = supportedLang;
              break;
            }
          }
          initialLang = (matchLang)? matchLang : (defaultLang.split(',')[1] || '');
        }
      }

      if (initialLang) {
        _setLang(initialLang, {}, true);
        setTimeout(function(){
          xsr.i18n.displayLang();
        }, 500);
      }
    }

  }

  function _isLiveApiUrl(apiUrl, liveApiUrls){
    var retValue = '',
        liveApiPrefix = liveApiUrls || _find(window, 'app.api.liveApiPrefix', ''),
        isMockUrl = apiUrl.beginsWithStr('!');

    apiUrl = apiUrl.trimLeftStr('!');
    if (liveApiPrefix) {
      var liveApiPrefixLst = [], i=0, len=0, liveApiPrefixX;
      if (_isStr(liveApiPrefix)) {
        liveApiPrefixLst = liveApiPrefix.split(',');
      } else if (_isArr(liveApiPrefix)) {
        liveApiPrefixLst = liveApiPrefix;
      }
      len=liveApiPrefixLst.length;
      if (len>0) {
        while (!retValue && i<len) {
          liveApiPrefixX = liveApiPrefixLst[i++].trim();
          retValue = liveApiPrefixX? (apiUrl.beginsWithStr(liveApiPrefixX)? liveApiPrefixX : (!_isRelativePath(apiUrl) && apiUrl.indexOf(liveApiPrefixX)>0 ? liveApiPrefixX : '') ) : '';
        }
      } else {
        retValue = apiUrl.beginsWithStr(liveApiPrefix)? liveApiPrefix : (!_isRelativePath(apiUrl) && apiUrl.indexOf(liveApiPrefix)>0 ? liveApiPrefix : '');
      }
    } else if (isMockUrl) {
      retValue = '??';
    }
    return retValue;
  }

  function _ajaxSetReqHeaders(req, options){
    var reqHeaders = _find(window, 'app.api.reqHeaders');
    var reqHeadersToSend = (_isFn(reqHeaders))? reqHeaders(req, options) : reqHeaders;
    if (_isObj(reqHeadersToSend)) {
      _each(_keys(reqHeadersToSend), function(reqHeadKey){
        req.setRequestHeader(reqHeadKey, reqHeadersToSend[reqHeadKey]);
      });
    } else if (_isStr(reqHeadersToSend)) {
      if (_isLiveApiUrl(options.url)) {
        options['data'] = options['data'] || '';
        options['data'] += (_isBlank(options['data'])? '':'&') + reqHeadersToSend;
      } else {
        req.setRequestHeader('reqHeadersInLiveUrl', reqHeadersToSend);
      }
    }
  }

  function _isRelativePath(url) {
    var urlBeginStr = url.getLeftStr(6).toLowerCase(),
        isFullPath = (urlBeginStr.beginsWithStr('http:') || urlBeginStr.beginsWithStr('https:') || urlBeginStr.beginsWithStr('//'));
    return !isFullPath;
  }

//  function _xhrReq( options ){
//
//    var axOptions = {
//      url: '',
//      responseType: 'json', // text, html, css, csv, xml, json, pdf, zip
//      async: true,
//      cache: false,
//      method: 'GET',    // GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE
//      headers: {},      // {key: 'value'} or function which returns {key: 'value'}
//      auth: null,       // { user: '', pwd: ''},
//      timeout: 0,       // 0=No Timeout; in milliseconds
//      success: null,    // function(response, statusCode, XHR){}
//      error: null,      // function(statusCode, statusText, XHR){}
//      finally: null     // function(response, statusCode, XHR){}
//
//      //data:
//      //onAbort:            function(XHR, event){}
//      //onError:            function(XHR, event){}
//      //onLoad:             function(XHR, event){}
//      //onLoadEnd:          function(XHR, event){}
//      //onLoadStart:        function(XHR, event){}
//      //onProgress:         function(XHR, event){}
//      //onReadyStateChange: function(XHR, event){}
//      //onTimeout:          function(XHR, event){}
//    };
//
//    var contentTypes = {TEXT:'text/plain', HTML:'text/html', CSS:'text/css', CSV:'text/csv', XML:'text/xml', JSON:'application/json', PDF:'application/pdf', ZIP:'application/zip' },
//        axResType = axOptions.responseType.toUpperCase(),
//        contentType = contentTypes[ axResType ] || axOptions.responseType,
//        axHeaders = {};
//
//    // updating axOptions
//    _keys(options || {}).forEach(function(oKey){
//      axOptions[oKey] = options[oKey];
//    });
//
//    axOptions.method = axOptions.method.toUpperCase();
//
//    // Set Headers
//    if (_isFn(axOptions.headers)) {
//      axOptions.headers = axOptions.headers.call(undefined, axOptions);
//    }
//    if (_isObj(axOptions.headers)) {
//      _keys(axOptions.headers).forEach(function(oKey){
//        axHeaders[oKey] = axOptions.headers[oKey];
//      });
//    }
//
//    if (contentType) {
//      axHeaders['Content-Type'] = contentType;
//    }
//    axHeaders['Cache-Control'] = axOptions.cache? 'max-age=86400000' : 'no-cache, no-store, must-revalidate, max-age=0';
//    axHeaders['Expires']       = axOptions.cache? ((new Date( (new Date()).setDate( (new Date()).getDate() + 1 ) )).toUTCString()) : '0';
//    if (!axOptions.cache) {
//      axHeaders['Pragma'] = 'no-cache';
//    }
//
//    //----------------------------------------------------------------------
//    // Create new HTTP Request Object
//    var xhr = new XMLHttpRequest(), axData;
//
//    xhr['requestOptions'] = axOptions;
//
//    // Setup timeout
//    if (axOptions.timeout) {
//      xhr.timeout   = axOptions.timeout;
//    }
//
//    var onReadyStateChange;
//
//    _keys(axOptions).forEach(function(oKey){
//      var eName = oKey.toLowerCase();
//      if ((eName === 'onreadystatechange') && (_isFn(axOptions[oKey]))) {
//        onReadyStateChange = axOptions[oKey];
//      } else if ((eName.indexOf('on') === 0) && (_isFn(axOptions[oKey]))) {
//        xhr[eName] = function(e){
//          axOptions[oKey].call(axOptions, xhr, e);
//        };
//      }
//    });
//
//    // Setup our listener to process request state changes
//    xhr.onreadystatechange = function (e) {
//
//        if (onReadyStateChange) {
//          onReadyStateChange.call(axOptions, xhr, e);
//        }
//
//        // Only run if the request is complete
//        if (xhr.readyState !== 4) return;
//
//        var xhrResponse = xhr.responseText;
//
//        // Process our return data
//        if (xhr.status >= 200 && xhr.status < 300) {
//          if (axResType === 'JSON') {
//            try {
//              if (xhrResponse) {
//                xhrResponse = JSON.parse(xhrResponse);
//              }
//            } catch(e) {
//              xhrResponse = xhr.responseText;
//              console.warn('Invalid JSON response.', xhrResponse, xhr, e);
//            }
//          }
//          // This will run when the request is successful
//          if (_isFn(axOptions.success)) {
//            axOptions.success.call(axOptions, xhrResponse, xhr.status, xhr);
//          }
//        } else {
//            // This will run when it's not
//            if (_isFn(axOptions.error)) {
//              axOptions.error.call(axOptions, xhr.status, xhr.statusText, xhr);
//            }
//        }
//
//        // This will run always
//        if (_isFn(axOptions.finally)) {
//          axOptions.finally.call(axOptions, xhrResponse, xhr.status, xhr);
//        }
//
//    };
//
//    if (axOptions.hasOwnProperty('data') && axOptions.method === 'GET') {
//      axData = (_isObj(axOptions['data']))? _toQueryString(axOptions['data']) : (''+axOptions['data']);
//      if (axData) {
//        axOptions.url += ((axOptions.url.indexOf('?') < 0)? '?' : ((/\?$|\&$/.test(axOptions.url))? '' : '&')) + axData;
//      }
//    }
//
//    // Open request
//    // The first argument is the post type (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
//    // The second argument is the endpoint URL
//    // The third arugment is async: true/false
//    try {
//      if (axOptions.auth && (_isObj(axOptions.auth))) {
//        if (axOptions.auth.hasOwnProperty('user')) {
//          if (axOptions.auth.hasOwnProperty('pwd')) {
//            xhr.open(axOptions.method, axOptions.url, axOptions.async, axOptions.auth.user, axOptions.auth.pwd);
//          } else {
//            xhr.open(axOptions.method, axOptions.url, axOptions.async, axOptions.auth.user);
//          }
//        }
//      } else {
//        xhr.open(axOptions.method, axOptions.url, axOptions.async);
//      }
//
//      // Set Request Headers
//      _keys(axHeaders).forEach(function(oKey){
//        xhr.setRequestHeader(oKey, axHeaders[oKey]);
//      });
//
//      // Send Payload
//      if ((axOptions.method !== 'GET') && axOptions.hasOwnProperty('data')) {
//        axData = (_isObj(axOptions['data']))? JSON.stringify(axOptions['data']) : axOptions['data'];
//        xhr.send( axData );
//      } else {
//        xhr.send();
//      }
//    }catch(e){
//      console.warn('Ajax-Exception', xhr, e);
//    }
//
//    return xhr;
//  }
//  function _testMockSys() {
//    if (app['api']) {
//      _xhrReq({url: _mockFinalUrl(), method:'HEAD', error:function(){
//          var mockBaseUrlExternal = _find(app, 'api.mockBaseUrl') || _find(spa, 'api.mockBaseUrl') || '';
//          var mockBaseUrl  = ((mockBaseUrlExternal || location.origin).trimRightStr('/')) + '/',
//              mockRootFldr = mockBaseUrlExternal? '' : ((_find(app, 'api.mockRootFolder') || _find(spa, 'api.mockRootFolder') || 'api_').trimRightStr('/')),
//              newMockAddress = prompt('Enter Mock Root Address: http[s]://server.address[:port]/root-folder', mockBaseUrl+mockRootFldr);
//          if (newMockAddress) {
//            var rootIndex = newMockAddress.indexOf('/', 8),
//                newMockBaseUrl  = (rootIndex > 0)? newMockAddress.slice(0, rootIndex) : newMockAddress,
//                newMockRootFldr = (rootIndex > 0)? newMockAddress.substr(rootIndex+1) : '';
//            app.api['mockBaseUrl']    = (newMockBaseUrl == location.origin)? '' : newMockBaseUrl;
//            app.api['mockRootFolder'] = newMockRootFldr;
//            _testMockSys();
//          }
//        }});
//    }
//  }
//  xsr.testMockSys = _testMockSys;

  function _mockFinalUrl( liveUrl, reqMethod, liveApiPrefixStr ){
    liveUrl          = liveUrl || '/';
    reqMethod        = reqMethod || '';
    liveApiPrefixStr = liveApiPrefixStr || _isLiveApiUrl(liveUrl);

    if (liveApiPrefixStr === '??') {
      var dblSlashIdx = liveUrl.indexOf('//');
      if (dblSlashIdx < 0) {
        liveApiPrefixStr = '/MOCK-ROOT/';
        liveUrl = liveApiPrefixStr+(liveUrl.trimLeftStr('/'));
      } else {
        liveApiPrefixStr = liveUrl.substring(0, liveUrl.indexOf('/', dblSlashIdx+2)+1);
      }
    }

    var finalMockUrl = '',
        mockBaseUrl  = _find(app, 'api.mockBaseUrl') || _find(spa, 'api.mockBaseUrl') || '',
        mockRootFldr = mockBaseUrl? '' : (((_find(app, 'api.mockRootFolder') || _find(spa, 'api.mockRootFolder') || 'api_').trimRightStr('/')) + '/'),
        mockDataFile = _find(app, 'api.mockDataFile') || _find(spa, 'api.mockDataFile') || '',
        finalMockUrl = (liveUrl||'').replace(/[\{\}]/g,'').replace(RegExp('(.*)(/*)'+(liveApiPrefixStr.trimLeftStr('/'))), mockRootFldr).replace(/(\/)*\?/, reqMethod+'/'+mockDataFile+'?').replace(/\?$/, '');

    if (mockBaseUrl) {
      mockBaseUrl = (mockBaseUrl.trimRightStr('/'))+'/';
      var indexOfDblSlash = finalMockUrl.indexOf('//');
      if (indexOfDblSlash < 0) {
        finalMockUrl = mockBaseUrl + finalMockUrl;
      } else if (indexOfDblSlash < 7) {
        finalMockUrl = mockBaseUrl + ( finalMockUrl.substr( finalMockUrl.indexOf('/', finalMockUrl.indexOf('//')+2 )+1 ) );
      }
    }

    return finalMockUrl;
  }

  function _ajaxPrefilter(options, orgOptions, jqXHR){

    if ((options.url).beginsWithStr(xsr.api.urlKeyIndicator)) {
      options.url = xsr.api.url((options.url).trimLeftStr(xsr.api.urlKeyIndicator), options.data);
    }
    var actualUrl = options.url, isMockReq;

    //any request Header to send?
    var reqHeaders = _find(window, 'app.api.reqHeaders');
    if (reqHeaders) {
      options['beforeSend'] = function(req) {
        _ajaxSetReqHeaders(req, options);
      };
    }

    //Common Request Error Handling if not defined
    if ((options['dataType'] != 'script') && (!options.hasOwnProperty('error'))) {
      options['error'] = app.api['onError'] || xsr.api.onReqError;
    }

    var liveApiPrefixStr = '', regExUrlParams = /({+)([^}])*(}+)/, urlParamsData;
    if (xsr.api.mock || app.api.mock || actualUrl.beginsWithStr('!')) {
      if (actualUrl.beginsWithStr('~')) { //force Live While In Mock
        options.url = (_isRelativePath(actualUrl.trimLeftStr('~'))? (xsr.api.baseUrl||'') : '') + (actualUrl.trimLeftStr('~')) + (xsr.api.liveUrlSuffix||'');
        if (xsr.api.baseUrl) options['crossDomain'] = true;
      } else {
        var reqMethod = ('/'+(options['method'] || options['type']).toUpperCase()).replace('/GET', '');
        options['type'] = options['method'] = 'GET'; //force GET for mock URLs
        liveApiPrefixStr = _isLiveApiUrl(actualUrl);
        actualUrl = actualUrl.trimLeftStr('!');
        if (liveApiPrefixStr) {
          if (!actualUrl.containsStr('\\?')) {
            actualUrl = actualUrl.trimRightStr('/') + '?';
          }

          if ( regExUrlParams.test(actualUrl) ) {
            _log.log('URL has undefined params >>', actualUrl, options.data);
            try {
              urlParamsData = (_isStr(options.data))? JSON.parse(options.data) : options.data;
              actualUrl = xsr.api.url(actualUrl.replace(/{{/g,'{').replace(/}}/g,'}'), urlParamsData);
            } catch(e){}
            _log.log('Updated URL>>', actualUrl);
          }

          var finalMockUrl = _mockFinalUrl(actualUrl, reqMethod, liveApiPrefixStr);
          options.url = finalMockUrl;

          if ((app['api'] && app.api['debug']) || app['debug'] || spa['debug']) console.warn(">>>>>>Intercepting Live API URL: [" + actualUrl + "] ==> [" + finalMockUrl + "]");
          isMockReq = true;
        }
      }
    } else {
      liveApiPrefixStr = _isLiveApiUrl(actualUrl);
      if (app['debug'] || spa['debug']) console.log('actualUrl:'+actualUrl+',baseUrl:'+xsr.api.baseUrl+',liveApiPrefix:'+liveApiPrefixStr);
      if (liveApiPrefixStr) {
        options.url = (_isRelativePath(actualUrl)? (xsr.api.baseUrl||'') : '') + actualUrl + (xsr.api.liveUrlSuffix||'');
        if (xsr.api.baseUrl) options['crossDomain'] = true;
      }
    }

    _log.log('Remove mock params if any in URL>', options.url);
    options.url = (options.url).replace(/{{([^}])*}}(\/*)/g,''); //remove any mock url-params {{<xyz>}}

    if ( regExUrlParams.test(options.url) ) {
      _log.log('URL has undefined params>', options.url, options.data);
      try {
        urlParamsData = (_isStr(options.data))? JSON.parse(options.data) : options.data;
        options.url = xsr.api.url((options.url).replace(/{</g,'{').replace(/>}/g,'}'), urlParamsData);
      } catch(e){}
    }
    //Final Ajax URL
    _log.log('Final Ajax URL>', options.url);

    if ( regExUrlParams.test(options.url) || (/<([^>])*>/).test(options.url) ) {
      console.warn('URL has undefined params >>', options.url, options.data);
      options.url = options.url.replace(/[{<>}]/g, '_');
    }

    //Global defaultPayload
    var defaultPayloadGlobal  = app.api['defaultPayload'] || xsr.api['defaultPayload'];
    if (defaultPayloadGlobal) {
      var reqPayloadType  = _of(options['data'])
        , reqPayload      = (reqPayloadType == 'string')? _toObj(options['data']) : options['data']
        , defaultPayloadFnRes, finalReqPayload;

      if (_isFn(defaultPayloadGlobal)) {
        defaultPayloadFnRes = defaultPayloadGlobal.call(options, reqPayload, options);
        if (_isObj(defaultPayloadFnRes)) {
          finalReqPayload = JSON.parse(JSON.stringify( defaultPayloadFnRes ));
          if (!_isBlank(finalReqPayload)) {
            options['data'] = (reqPayloadType == 'string')? JSON.stringify(finalReqPayload) : finalReqPayload;
          }
        }
      } else {
        if (_is(defaultPayloadGlobal, 'object|array')) {
          finalReqPayload = JSON.parse(JSON.stringify( defaultPayloadGlobal ));
        } else {
          finalReqPayload = defaultPayloadGlobal;
        }
        finalReqPayload = (_is(finalReqPayload, 'object|array') && _is(reqPayload, 'object|array'))? _mergeDeep({}, finalReqPayload, reqPayload) : finalReqPayload;
        options['data'] = (!_isBlank(finalReqPayload) && (reqPayloadType == 'string'))? JSON.stringify(finalReqPayload) : finalReqPayload;
      }
    }

    if (xsr.ajaxPreProcess) {
      xsr.ajaxPreProcess(options, orgOptions, jqXHR);
    }

    if (_isBlank( options['data'] ) || (_isStr(options['data']) && !(/[a-z0-9]/i.test(options['data'])))) {
      _log.log( 'REMVOING EMPTY PAYLOAD' );
      delete options['data'];
    }
    if (isMockReq) {
      var payLoadInMock = _isStr(options['data'])? options['data'] : JSON.stringify(options['data']);
      if (payLoadInMock && _isStr(payLoadInMock) && payLoadInMock.length > 6144) {
        payLoadInMock = 'LAREGE-PAYLOAD-WITH-CHAR-LENGTH:'+(payLoadInMock.length);
      }
      options['headers'] = _mergeDeep({}, options['headers'], {
            'Z-Live-URL': actualUrl
          , 'Z-Payload': payLoadInMock
        });
      delete options['data'];
    }

    if ((app['api'] && app.api['debug']) || app['debug'] || spa['debug']) console.log('ajax Options', options);
  }

  /* Pub/Sub */
  var _PubSubQue = {};
  var _PubSub = {
    pub: function(eventName, data, onAllOk, onAnyFail){
      var eventData, isFailed;
      if (_isFn(data)) {
        onAnyFail = arguments[2];
        onAllOk   = arguments[1];
      } else {
        eventData = arguments[1];
      }

      var subCount=0, fn2Call, fnResponse, retValue=[];
      _each(_PubSubQue[eventName], function(sub){
        try{
          subCount++;
          fn2Call = sub.fn;
          fnResponse = null;
          if (fn2Call) {
            fnResponse = fn2Call.call(eventData||{}, eventName, eventData, onAllOk, onAnyFail);
          }
          retValue.push({id: ''+(sub.name || subCount), response: fnResponse});
          if (!isFailed && _isBool(fnResponse)){
            isFailed = !fnResponse;
          }
        } catch(e){
          console.warn('Execution error in subscribed function:'+sub.name+' on-'+eventName);
          console.error(e.stack);
        }
      });
      if (isFailed) {
        if (onAnyFail && _isFn(onAnyFail)) {
          onAnyFail(retValue);
        }
      } else {
        if (onAllOk && _isFn(onAllOk)) {
          onAllOk(retValue);
        }
      }
      return retValue;
    },

    sub: function(eventName, fnCallback, fnName){
      if (!_PubSubQue.hasOwnProperty(eventName)) {
        _PubSubQue[eventName] = [];
      }
      _PubSubQue[eventName].push({fn: fnCallback, name: fnName});
      return _PubSubQue[eventName].length;
    },

    unSub: function(eventName, subId){
      var retValue = false;
      if (_PubSubQue.hasOwnProperty(eventName)) {
        retValue = true;
        if (subId) {
          _PubSubQue[eventName][subId-1] = null;
        } else {
          _PubSubQue[eventName] = [];
        }
      }
      return retValue;
    }
  };
  xsr.event = {
    on: _PubSub.sub,
    off: _PubSub.unSub,
    trigger: _PubSub.pub,
    announce: _PubSub.pub
  };

  /* *************** data-spa-route - SPA Route Solution Begins ************************ */
  var _urlHashBase        = '#'
    , _blockNav
    , _hideNavClassName   = ''
    , _hideNav
    , _onAutoRoute        = true
    , _autoRoutesFound    = []
    , _maxAutoRoute       = 100
    , _routeOnClick       = false
    , _prevUrlHash        = ''
    , _curBlockedUrlHash  = ''
    , _isDelayed          = false
    , _isDelayedOnUrl     = ''
    , _lastBlockedUrl     = ''
    , _blockNavClassName  = ''
    , _blockNavClass      = ''
    , _allowNavClassName  = ''
    , _attrSpaRoute       = ''
    , _attrSpaRouteParams = ''
    , _routeByHref        = false
    , _attrOnNavAway      = '';

  function _initAutoRoute() {
    _autoRoutesFound = [];
    _maxAutoRoute = 50;
  }
  function _initRoutesDefaults(){
    _prevUrlHash = xsr.urlHashFull( _urlHashBase );

    _urlHashBase        = (_find(spa, 'defaults.routes.base', '')            || '#').trim();
    _blockNavClassName  = (_find(spa, 'defaults.routes.className.block', '') || 'BLOCK-SPA-NAV').trim();
    _blockNavClass      = ('.'+_blockNavClassName);
    _allowNavClassName  = (_find(spa, 'defaults.routes.className.allow', '') || 'ALLOW-SPA-NAV').trim();
    _hideNavClassName   = (_find(spa, 'defaults.routes.className.hide', '')  || 'HIDE-SPA-NAV').trim();
    //_hideNavClass       = ('.'+_hideNavClassName);
    _attrSpaRoute       = (_find(spa, 'defaults.routes.attr.route', '')      || 'data-spa-route').trim();
    _attrSpaRouteParams = (_find(spa, 'defaults.routes.attr.params', '')     || 'data-spa-route-params').trim();
    _routeByHref        = (_attrSpaRoute.equalsIgnoreCase('href'));
    _attrOnNavAway      = (_find(spa, 'defaults.routes.attr.onNavAway', '')  || 'onNavAway').trim();

    _hideNav = $('body').hasClass( _hideNavClassName );
  }

  function _blockSpaNavigation(scope){
    var $scope = $(scope || 'body :first');
    $scope.addClass( _blockNavClassName );
    _blockNav = _isSpaNavBlocked() || true; //safe!!!
    return $scope;
  }
  function _allowSpaNavigation(scope){
    var $scope = $( scope || _blockNavClass );
    $scope.removeClass( _blockNavClassName );
    $scope.find( _blockNavClass ).removeClass( _blockNavClassName );
    _blockNav = _isSpaNavBlocked();
    return $scope;
  }
  // function _showSpaNavigation(){
  //   $('body').removeClass( _hideNavClassName );
  // }
  // function _hideSpaNavigation(){
  //   $('body').addClass( _hideNavClassName );
  // }
  // function _isToShowSpaNav(){
  //   return (!$('body').hasClass( _hideNavClassName ));
  // }
  function _isToShowSpaNav(){
    return !_hideNav;
  }
  function _isSpaNavBlocked( scope ){
    if (scope) {
      var $scope = $(scope);
      return ($scope.hasClass( _blockNavClassName ) || ($scope.find( _blockNavClass ).length>0));
    } else {
      return !!$( _blockNavClass ).length;
    }
  }
  function _isSpaNavAllowed( scope ){
    return !_isSpaNavBlocked( scope );
  }
  function _inBlockedSpaNavContainer(el){
    return !!($(el).closest(_blockNavClass).length);
  }
  function _blockBrowserNav(){
    if (_blockNav) _replaceUrlHash(_prevUrlHash);
  }
  function _onpageshow() {
    //if (e.persisted)
    _blockBrowserNav();
  }

  var _skipUrlChangeOn = 'x'+_now();
  function _onPopStateChange(e){
    _routeSpaUrlOnHashChange();

    if (_curBlockedUrlHash && _curBlockedUrlHash != _skipUrlChangeOn) {
      _log.warn('Blocked:', _curBlockedUrlHash);
      _curBlockedUrlHash = _skipUrlChangeOn;
    } else {
      if (_curBlockedUrlHash != _skipUrlChangeOn) {
        //custom function trigger
        if (xsr.onUrlHashChange) {
          xsr.onUrlHashChange(xsr.urlHash([], _urlHashBase), e);
        } else if (xsr.onUrlChange) {
          xsr.onUrlChange(xsr.urlHash([], _urlHashBase), e);
        }
      }
      _curBlockedUrlHash = '';
    }
  }
  function _onWindowReload(){
    var fnRes, i18nMsgKey, retValue;
    if (xsr.onReload) {
      fnRes = xsr.onReload();
    }
    switch(_of(fnRes)) {
      case 'boolean':
        if (!fnRes) {
          i18nMsgKey = 'xsr.message.on.window.reload';
          return xsr.i18n.text(i18nMsgKey).replace(i18nMsgKey, '');//shows message only in IE and Firefox. NOT in Chrome!
        }
        break;
      case 'string':
        fnRes = fnRes.trim();
        if (fnRes) {
          i18nMsgKey = fnRes.beginsWithIgnoreCase('i18n')? fnRes.replace(/i18n(:)*/i,'') : '';
          retValue = i18nMsgKey? xsr.i18n.text(i18nMsgKey).replace(i18nMsgKey) : fnRes;
        } else {
          retValue = fnRes;
        }
        return retValue;

      default:
        i18nMsgKey = 'xsr.message.on.window.reload';
        if (_blockNav) {
          return xsr.i18n.text(i18nMsgKey).replace(i18nMsgKey, ''); //shows message only in IE and Firefox. NOT in Chrome!
        }
        break;
    }
  }
  function _handleNavAwayEvent(toUrl, $byEl){
    _lastBlockedUrl = toUrl;
    _log.log('Trying to navigate away from:['+ _prevUrlHash +'] To:['+ toUrl +'] by', $byEl);
    var $container, onNavAway, navAwayTargetSelector, $navAwayTarget, navAwayFn, byEl;
    $(_blockNavClass).each(function(){
      $container = $(this);
      onNavAway = ($container.attr( _attrOnNavAway )||'').trim();
      if (onNavAway[0] == '#' || onNavAway[0] == '>') {
        navAwayTargetSelector = onNavAway[0] == '>'? onNavAway.substr(1).trim() : onNavAway;
        $navAwayTarget = $container.find(navAwayTargetSelector).filter(':not(.disabled):not(:disabled)');
        if ($navAwayTarget.length) {
          if ($byEl) byEl = "id:'"+$byEl.attr('id')+"', spaRoute:'"+$byEl.attr( _attrSpaRoute )+"'";
          $navAwayTarget.data('navToUrl', toUrl).attr('data-nav-to-url', toUrl);
          $navAwayTarget.data('navBy', byEl).attr('data-nav-by', byEl);
          $navAwayTarget.trigger('click');
        }
      } else {
        navAwayFn = _find(window, onNavAway.split('(')[0].split(';')[0] );
        if (navAwayFn && _isFn(navAwayFn)) {
          navAwayFn.call($container, toUrl, $container, $byEl);
        }
      }
    });
  }

  xsr.blockNav     = _blockSpaNavigation;
  xsr.allowNav     = _allowSpaNavigation;
  //xsr.showNav      = _showSpaNavigation;
  //xsr.hideNav      = _hideSpaNavigation;
  xsr.isNavBlocked = _isSpaNavBlocked;
  xsr.isNavAllowed = _isSpaNavAllowed;
  xsr.isToShowNav  = _isToShowSpaNav;
  xsr.isInBlockedSpaNavContainer = _inBlockedSpaNavContainer;

  function _ctrlBrwowserNav(){
    window.onpageshow   = _onpageshow;
    if (isIE) {
      window.onhashchange = _onPopStateChange;
    } else {
      window.onpopstate   = _onPopStateChange;
    }
    if (is(window, 'window')) {
      window.onbeforeunload = _onWindowReload;
    }
  }
  window.onerror = function(eMsg, source, line){
    console.warn('Invalid Content: Check the network/path/content.', eMsg, source, line);
  };

  function _routeSpaUrlOnHashChange(){
    var urlHash = xsr.urlHashFull(_urlHashBase);
    _log.log('on Hash Change: Url To [',urlHash,'] from[',_prevUrlHash,'] on click:',_routeOnClick,' block-Navigation:',_blockNav,'isDelayed:', _isDelayed);
    if ((!_isToShowSpaNav) || (!_routeOnClick && _blockNav)) {
      _log.log('------------->', _prevUrlHash, urlHash, _isDelayed, _isDelayedOnUrl);
      _log.log('lastBlocked:',_lastBlockedUrl);
      if (!_lastBlockedUrl) _lastBlockedUrl = _prevUrlHash;
      if (_urlHashBase[0] == '#') {
        _replaceUrlHash(_isDelayed? _isDelayedOnUrl : _prevUrlHash, urlHash);
        if (_lastBlockedUrl == urlHash) _handleNavAwayEvent(urlHash);
      } else {
        _replaceUrlHash(_isDelayed? _isDelayedOnUrl : _prevUrlHash, urlHash);
        _handleNavAwayEvent(urlHash);
      }

    } else {
      _log.log('Triggering next hash... by href:', _routeByHref, 'autoRoute:',_onAutoRoute, 'byClick', _routeOnClick);
      _triggerNextHash( _onAutoRoute || !_routeOnClick);
    }
  }

  var _dynHashProcessed = [];
  function _processDynHash(dynRouteHash, eventAfterProcess){
    var isDynamicHash = (dynRouteHash.indexOf(':')>=0)
      , e2Trigger = eventAfterProcess;
    if (_isBool(eventAfterProcess)) { e2Trigger = eventAfterProcess? 'click' : ''; }

    if (isDynamicHash) {
      //console.log('In _processDynHash', arguments, JSON.stringify(_dynHashProcessed));
      var dynamicHashKey = isDynamicHash? (dynRouteHash.split(':')[0]) : '';
      var routeStoreData = {}, pKey, pVal;
      var dynParamsArr = (dynRouteHash.indexOf('&')>0)? dynRouteHash.split('&') : ((dynRouteHash.indexOf(',')>0)? dynRouteHash.split(',') : [dynRouteHash]);
      _each(dynParamsArr, function(keyValue){
        pKey = (keyValue).split(':')[0];
        pVal = keyValue.getRightStr(':');
        routeStoreData[ pKey ] = decodeURIComponent( pVal );
      });
      //console.log('paramsobj:',routeStoreData);
      var $routeStoreEl = $('['+(_attrSpaRoute)+'*="/'+dynamicHashKey+':"]['+_attrSpaRouteParams+']');
      var routeStoreSpec = ($routeStoreEl.attr(_attrSpaRouteParams) || '').trim();
      //console.log($routeStoreEl, routeStoreSpec);
      isDynamicHash = !_isBlank(routeStoreSpec);
      if (isDynamicHash) {
        _dynHashProcessed.push(dynRouteHash);
        var routeStoreSpecObj = _toObj(routeStoreSpec);
        //console.log('specObj:', routeStoreSpecObj);
        _each(routeStoreSpecObj, function(elSelector, key){
          elSelector = elSelector.trim();
          if ((/(^app\.(.)+\.)|(^\$)|(^\#)/).test(elSelector)) {
            xsr.setElValue(elSelector, routeStoreData[key]);

          } else if (( /^fn:/i ).test(elSelector)) {
            var fn2Exec = ((elSelector.split(' ')[0]).getRightStr(':').trim()).split('(')[0];
            fn2Exec = (fn2Exec)? _find(window, fn2Exec) : '';
            if (fn2Exec && _isFn(fn2Exec)) {
              fn2Exec( key, routeStoreData[key] );
            } else {
              console.warn('Not a function', elSelector);
            }
          }
        });

        if (e2Trigger && $routeStoreEl.isEnabled() && !$routeStoreEl.hasClass('AUTO-ROUTING')) {
          $routeStoreEl.trigger(e2Trigger);
        }

      }
    }
    return isDynamicHash;
  }

  function _processDynHashInUrl(){
    var hashList = xsr.urlHash([], _urlHashBase), routeHash='', pIndex;
    for(var i=0; i< hashList.length; i++) {
      routeHash = hashList[i];
      pIndex = _dynHashProcessed.indexOf(routeHash);
      if (pIndex>=0) {
        _dynHashProcessed.splice(pIndex, 1);
      } else {
        _processDynHash(routeHash, (i == hashList.length-1));
      }
    }
  }
  //xsr.processDynHashInUrl = _processDynHashInUrl;

  function _triggerNextHash( reset ){
    //console.log('Finding next hash ...', reset);
    if (reset) _initAutoRoute();
    _onAutoRoute = _isUndef(reset)? _onAutoRoute : reset;
    var hashList = xsr.urlHash([], _urlHashBase), lastHashIndex = hashList.length-1, curHashName, isLastHash, prevHash;

    if (_maxAutoRoute<0) _onAutoRoute = false;
    if (_onAutoRoute) {
      _maxAutoRoute--;
      for (var i = lastHashIndex; i>=0; i--) {

        prevHash = (hashList[i-1]||'');
        if (_onAutoRoute && prevHash.indexOf(':')>0 && !(_autoRoutesFound.__has(prevHash))) { i--; } //GoBack if to prevHash is dynamic

        //console.log('pHash>', prevHash);

        curHashName = hashList[i]; isLastHash = (i == lastHashIndex);
        //console.log('... '+curHashName);
        if (!_onAutoRoute || (_autoRoutesFound.__has(curHashName))) break;
        if (curHashName) {
          var isDynamicHash = (curHashName.indexOf(':')>=0);
          var dynamicHashKey = isDynamicHash? (curHashName.split(':')[0]) : '';
          //console.log('... ... '+curHashName, 'isDynamic:', isDynamicHash);

          var routeElSelector = '['+(_attrSpaRoute)+'$="/'+curHashName+'"]:not(:disabled):not(.disabled):not(.AUTO-ROUTING):first';
          if (isDynamicHash) {
            routeElSelector = '['+(_attrSpaRoute)+'*="/'+dynamicHashKey+':"]['+_attrSpaRouteParams+']';
          }
          var $hashTriggerEl  = $(routeElSelector);
          //console.log(curHashName, ':routeElSelector>', routeElSelector);

          if ($hashTriggerEl.length) {
            //console.log('... ... ... Found:', curHashName, $hashTriggerEl);
            if (isDynamicHash) {
              //console.log('Processing dynHash.');
              isDynamicHash = _processDynHash(curHashName);
            }
            _autoRoutesFound.push(curHashName);
            _onAutoRoute = !isLastHash;

            if ($hashTriggerEl.isEnabled() && !$hashTriggerEl.hasClass('AUTO-ROUTING'))
              $hashTriggerEl.addClass('AUTO-ROUTING').trigger($hashTriggerEl.data('routeEvent') || 'click');
            if (isLastHash) { _winLocHash_ = ''; break; } else { i=i+2; }
          }
        }
      }
    }
    _routeOnClick = false;
  }

  function _updateBrowserAddress(newAddress, delayUpdate){
    _log.log('_updateBrowserAddress >>>>>>>>>[', newAddress, ']delay:',delayUpdate,'prev:', _prevUrlHash);
    var useLink = (_urlHashBase[0] == '#');
    if (newAddress) {
      _prevUrlHash = newAddress;
      if (useLink) {
        _log.log( newAddress );
        var _hashUpdateLink = $('#_spaRouteLink_');
        if (!_hashUpdateLink.length) {
          _hashUpdateLink = $('<a id="_spaRouteLink_" href=""></a>');
          $('body').append(_hashUpdateLink);
        }
        _log.log('################# '+ newAddress );
        _hashUpdateLink.attr('href', newAddress)[0].click();
      } else {
        _log.log( newAddress );
        newAddress = (newAddress.trimLeftStr('/'));
        if (newAddress[0] != '#') {
          newAddress = '//' + window.location.host + _getAboluteUrl('/', newAddress);
          _log.log('updating the address bar with >>>>>', newAddress);
        }
        _log.log('>>>>>>>>>>>>>>>>> '+ newAddress );
        history.pushState(null, null, newAddress);
      }
    }
  }
  function _replaceUrlHash(newHashUrl, insteadOf) {
    if (newHashUrl != insteadOf) {
      _log.log('attempt to set URL:', newHashUrl, 'insteadOf', insteadOf);
      _curBlockedUrlHash = insteadOf;
      _updateBrowserAddress(newHashUrl);
    }
  }

  function _updateUrlHash(newHashUrl, delayUpdate, continueAutoRoute) {
    _log.log('Updating url with:', newHashUrl, 'delay:', delayUpdate, 'autoRoute:',continueAutoRoute);
    _onAutoRoute = continueAutoRoute;
    _isDelayed   = delayUpdate;
    _isDelayedOnUrl = delayUpdate? _prevUrlHash : '';
    if (delayUpdate) {
      _prevUrlHash = newHashUrl;
    } else {
      _routeOnClick  = true;
      if (xsr.isToShowNav()) {
        if (!_onAutoRoute) _updateBrowserAddress(newHashUrl, delayUpdate);
      } else {
        _prevUrlHash = newHashUrl;
      }
    }
  }

  function _getNewMatchingRoutes(reqUrl){
    reqUrl = (reqUrl||'').trim();
    //console.log('Process reqUrl:', reqUrl);
    if (!reqUrl) return [];

    var oldRoutes = xsr.urlHash([], _urlHashBase);
    var reqRoutes = reqUrl.trimStr('/').split('/');
    var newRoutes = [];
    var reqRootRoute = reqRoutes[0];

    function getMatchHash(srcArr, value){
      var retValue = value
        , matchValue = value.getLeftStr('*');
      if (matchValue) {
        for(var i=0; i<srcArr.length; i++){
          if (srcArr[i].beginsWithStr( matchValue )) {
            retValue = srcArr[i];
            break;
          }
        }
      }
      return retValue;
    }

    var idxInSrc = oldRoutes.indexOf( reqRootRoute );
    if (reqRootRoute.indexOf('*')>0) {
      reqRootRoute = reqRootRoute.getLeftStr('*');
      for(var i=0; i<oldRoutes.length; i++){
        if (oldRoutes[i].beginsWithStr( reqRootRoute )) {
          idxInSrc = i;
          break;
        }
      }
    }
    if (idxInSrc>=0) {
      var matchRoutes = oldRoutes.splice(idxInSrc)
        , xIdx;
      for(var j=0; j<reqRoutes.length;j++){
        xIdx = reqRoutes[j].indexOf('*');
        newRoutes[j] = (xIdx<0)? reqRoutes[j] : ((xIdx)? getMatchHash(matchRoutes, reqRoutes[j]) : matchRoutes[j]) ;
      }
      newRoutes = oldRoutes.concat(newRoutes);
    } else {
      newRoutes = (reqUrl[0] == '/')? reqRoutes : oldRoutes.concat(reqRoutes);
    }

    return newRoutes;
  }
  xsr.parseRoutes = _getNewMatchingRoutes;

  function _onRouteElClick(e){
    var spaRoutePath = xsr.urlHash([], _urlHashBase);
    //console.clear();
    //console.log('Current Route:', spaRoutePath);
    var targetEl = this
      , $routeEl = $(targetEl)
      , routeData
      , usePrevHash
      , delayUpdate
      , routeDir
      , routeName
      , newHashUrl
      , continueAutoRoute;

    if ($routeEl.hasClass('disabled') || $routeEl.is(':disabled')) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (_urlHashBase[0] != '#') {
      e.preventDefault();
    }

    function update(newRouteData, rDir) {
      //console.log('>>>>>>>>>>>', newRouteData);
      routeData   = (newRouteData||'').trim();
      if (routeData[0]=='#') routeData = routeData.substr(1);
      usePrevHash = (routeData[0] == '<');
      delayUpdate = (routeData[0] == '>');
      routeDir    = rDir || routeData[delayUpdate? 1: 0];
      routeName   = routeData.substr(delayUpdate? 2 : 1);
      continueAutoRoute = false;
    }
    update($routeEl.attr( _attrSpaRoute ), $routeEl.attr('data-route-dir'));

    var routeStoreSpec = ($routeEl.attr(_attrSpaRouteParams) || '').trim();
    if (routeStoreSpec) {
      var routeStoreSpecObj = _toObj(routeStoreSpec), paramValue;
      _each(routeStoreSpecObj, function(elSelector, key){
        paramValue = elSelector;
        if ((/(^app\.(.)+\.)|(^\$)|(^\#)/).test(elSelector.trim())) {
          paramValue = xsr.getElValue(elSelector);

        } else if (( /^fn:/i ).test(elSelector.trim())) {
          var fn2Exec = ((elSelector.split(' ')[0]).getRightStr(':').trim()).split('(')[0];
          fn2Exec = (fn2Exec)? _find(window, fn2Exec) : '';
          if (fn2Exec && _isFn(fn2Exec)) {
            paramValue = fn2Exec( key );
          } else {
            console.warn('Not a function', elSelector);
          }
        }

        routeName = routeName.replace(new RegExp(key+':', 'g'), (key+':'+encodeURIComponent( paramValue )));
      });
      //console.log('Dynamic Route URL', routeName);
    }

    _triggerClickEventOnAttr(targetEl, 'onrouteclick');

    if ($routeEl.hasClass('AUTO-ROUTING')) { //exit if it's still routing ...
      $routeEl.removeClass('AUTO-ROUTING');
      return;
    }

    //console.log('RouteDir:', routeDir);
    if (routeDir == '^') {
      if (_isBlank(spaRoutePath)) {
        update(routeData.substr(1));
      } else {
        e.preventDefault();
        continueAutoRoute = true;
        routeDir  = '/';
        routeName = xsr.urlHash('', _urlHashBase);
      }
    }

    if ('#/-<>'.indexOf(routeDir)<0) {
      routeName = routeDir+routeName;
      routeDir = '?';
    }

    //console.log('>>>>Route:', routeName, 'Dir:', routeDir);
    switch (routeDir) {
      case '#': //spaRoutePath = [routeName]; break;
      //console.log('############:', routeName);
      case '/':
        spaRoutePath = _getNewMatchingRoutes(routeName);
        break;
      case '-':
        var revCount = xsr.toInt(routeName.replace(/[^0-9]/g,'')) || 1;
        if (spaRoutePath.length) {
          spaRoutePath.length = spaRoutePath.length-revCount;
        }
        break;
      case '<':
        newHashUrl = _prevUrlHash;
        break;
      case '?':
        spaRoutePath = _getNewMatchingRoutes(routeName);
        break;
    }

    if (!usePrevHash) {
      newHashUrl = _getAboluteUrl(_urlHashBase, spaRoutePath.join('/'));
    }

    if (_blockNav) {
      if (!( usePrevHash || $routeEl.hasClass(_allowNavClassName) || $routeEl.inBlockedSpaNavContainer())) {
        delayUpdate = true;
        _handleNavAwayEvent(newHashUrl, $routeEl);
      }
    }

    _log.log('Routing to...', newHashUrl, 'delay:', delayUpdate, 'prev:', _prevUrlHash);

    _updateUrlHash(newHashUrl, delayUpdate, continueAutoRoute);
  }

  function _onRouteAutoReg(){
    xsr.route(_attr(this,_attrSpaRoute+'-AUTO').substr(1));
  }
  function _initRouteHash(scope){
    // var addClassMatch = ''//_routeByHref? '.spa-route' : ''
    //   , $routeElements = $(scope||'body').find('['+(_attrSpaRoute)+']:not(.ROUTE)'+addClassMatch)

    $(scope||'body').find('['+(_attrSpaRoute)+'^="*"]:not(.ROUTE):not(.ROUTE-AUTO)')
      .renameAttr(_attrSpaRoute, _attrSpaRoute+'-AUTO')
      .addClass('ROUTE-AUTO')
      .on('click', _onRouteAutoReg);

    var $routeElements = $(scope||'body').find('['+(_attrSpaRoute)+']:not(.ROUTE)')
      .renameAttr('onclick', 'onrouteclick')
      .addClass('ROUTE')
      .off('click', _onRouteElClick)
      .on('click', _onRouteElClick);

    if (_routeByHref && $routeElements.length){
      var $a, href, rDir;
      $routeElements.each(function(){
        $a = $(this); href=($a.attr('href')).replace(/\s*/g,'').trim(); rDir='';
        if (href[0] == '#') {
          if (('^><-').indexOf(href[1]) >=0) {
            rDir = href[1];
            href = href.substr(2);
          }
        } else {
          if (('^').indexOf(href[0]) >=0) {
            rDir = href[0];
            href = href.substr(1);
          }
        }
        $a.attr('href', '#'+href).removeAttr('target').attr('data-route-dir', rDir);
      });
    }

    _triggerNextHash();
    _blockNav = xsr.isNavBlocked();
  }

  function _routeToUrl(route) {
    route      = (route||'').trim();
    if (route) {
      var routeDir          = route[0]
        , routePathBeginsAt = 1
        , routePath
        , routes;

      if ('#/-<>'.indexOf(routeDir)<0) {
        routeDir = '?';
        routePathBeginsAt = 0;
      }
      routePath = route.substr(routePathBeginsAt);

      switch (routeDir) {
        case '/':
          routes = _getNewMatchingRoutes(routePath);
          break;
        case '-':
          routes = xsr.urlHash([], _urlHashBase);
          var revCount = xsr.toInt(route.replace(/[^0-9]/g,'')) || 1;
          if (routes.length) {
            routes.length = routes.length-revCount;
          }
          break;
        case '?':
          // routes = xsr.urlHash([], _urlHashBase);
          // var resetFrom = routes.indexOf( routePath.split('/')[0] );
          // if (resetFrom>=0) routes.length = resetFrom;
          // routes.push(routePath);
          routes = _getNewMatchingRoutes(routePath);
          break;
        default:
          routes = [routePath];
          break;
      }
      return _getAboluteUrl(_urlHashBase, routes.join('/'));
    }
  }


  function _$routeElement(routeUrl) {
    return $('['+(_attrSpaRoute)+'$="'+(routeUrl.trim())+'"].ROUTE:first');
  }
  function _$routeElements(routeUrl) {
    return $('['+(_attrSpaRoute)+'$="'+(routeUrl.trim())+'"].ROUTE');
  }
  function _routeNewUrl(routePath, force){
    var newHashUrl = _routeToUrl(routePath);
    _log.log('Route:',routePath, 'URL:', newHashUrl);
    if (newHashUrl) {
      if (!force && _blockNav) {
        _handleNavAwayEvent(newHashUrl);
      } else {
        var $routeElement = _$routeElement(routePath);
        if ($routeElement.length) {
          if ($routeElement.hasClass('disabled') || $routeElement.is('[disabled]')) {
            console.warn('Route:', routePath, 'is disabled.');
          } else {
            $routeElement.click();
          }
        } else {

          if (_isToShowSpaNav()) {
            _updateBrowserAddress(newHashUrl);
          } else {
            _winLocHash_ = newHashUrl;
          }

          if (routePath.trim() == '/') {
            xsr.allowNav();
            window.location.reload();
          } else {
            _onPopStateChange();
          }

        }
      }
    }
  }

  function _StoreMgmt(xStorage) {

      function _set(k, v) {
        function _store(keyName, valueStr) {
          keyName  = (''+keyName).trim();
          var compress = (/^\[(.)+]$/).test(keyName);
          if (keyName.indexOf('.')>0) {
            if (compress) {
              keyName = keyName.slice(1,-1);
            }
            var keys = keyName.split('.').map(function(tKey){ return tKey.trim(); });
            var baseKey = keys.shift();
            if (compress) {
              baseKey = '['+baseKey+']';
            }
            var baseObj = {};
            if (Object.keys(xStorage).indexOf(baseKey)>=0) {
              baseObj = xsr.objProp(_get(baseKey), keys.join('.'), valueStr);
            } else {
              baseObj = xsr.objProp({}, keys.join('.'), valueStr);
            }
            _store(baseKey, baseObj);
          } else {
            var storeStr = JSON.stringify(valueStr);
            if (compress) {
              storeStr = _compress( storeStr );
            }
            xStorage.setItem(keyName, storeStr);
          }
        }

        if (arguments.length == 1) {
          if (_type(k, 'object')) {
            Object.keys(k).forEach(function (kX) {
              _store(kX, k[kX]);
            });
          } else if (_type(k, 'array')) {
            k.forEach(function (vX, kX) {
              _store(kX, vX);
            });
          }
        } else if (arguments.length == 2) {
          _store(k, v);
        }
      }

      function _get(k) {
        if (arguments.length == 0) {
          return _all();
        } else if (arguments.length == 1) {
          if (_type(k, 'string')) {
            k = k.trim();
            if (k.indexOf(',') > 0) {
              return _all.apply(null, k.split(','));
            } else {
              if (k.indexOf('.')>0) {
                var isCompressed = (/^\[(.)+]$/).test(k);
                if (isCompressed) {
                  k = k.slice(1,-1);
                }
                var keys = k.split('.').map(function(tKey){ return tKey.trim(); });
                var baseKey = keys.shift();
                if (isCompressed) {
                  baseKey = '['+baseKey+']';
                }
                return _find(_get(baseKey), keys.join('.'));
              } else {
                var storeStr = xStorage.getItem(k);
                if ((/^\[(.)+]$/).test(k)) {
                  storeStr = _deCompress( storeStr );
                }
                return JSON.parse(storeStr);
              }
            }
          } else if (_type(k, 'array')) {
            return _all.apply(null, k);
          }
        } else {
          return _all.apply(null, arguments);
        }
      }

      function _all() {
        var filter = arguments.length;
        var filterKeys = _arrProto.slice.call(arguments).map(function (x) {
          return ('' + x).trim();
        });
        var retObj = {};
        Object.keys(xStorage).forEach(function (key) {
          if (!filter || (filterKeys.indexOf(key) > -1)) {
            retObj[key] = _get(key);
          }
        });
        return retObj;
      }

      function _remove(k){
        function _removeItem( rKey ){
          xStorage.removeItem( rKey );
        }
        function _removeItems(){
          if (arguments.length) {
            _arrProto.slice.call(arguments).forEach(function( rKey ){
              xStorage.removeItem( rKey );
            });
          }
        }

        if (arguments.length == 0) {
          _clear();
        } else if (arguments.length == 1) {
          if (_type(k, 'string')) {
            if (k.indexOf(',') > 0) {
              _removeItems.apply(null, k.split(','));
            } else {
              _removeItem( k );
            }
          } else if (_type(k, 'array')) {
            _removeItems.apply(null, k);
          }
        } else {
          _removeItems.apply(null, arguments);
        }
      }

      function _clear() {
        var filter = arguments.length;
        if (filter) {
          var filterKeys = _arrProto.slice.call(arguments).map(function (x) {
            return ('' + x).trim();
          });
          Object.keys(xStorage).forEach(function (key) {
            if (filterKeys.indexOf(key) < 0) {
              xStorage.removeItem( key );
            }
          });
        } else {
          xStorage.clear();
        }
      }

      function _type(tOf) {
        var _typeOf = _objProto.toString.call(tOf).split(' ')[1].toLowerCase().replace(/\]$/gi, '');
        return (arguments.length == 2) ? (('' + arguments[1]).toLowerCase().indexOf(_typeOf) > -1) : _typeOf;
      }

      //Constructor
      var sStoreUtil = function (key, value) {
        if (arguments.length == 0) {
          return _all();
        } else if (arguments.length == 1) {
          if (_type(key, 'object|array')) {
            _set(key);
            return key;
          } else {
            return _get(key);
          }
        } else if (arguments.length == 2) {
          _set(key, value);
          return _get(key);
        }
      };

      //Methods
      sStoreUtil.set           = _set;
      sStoreUtil.get           = _get;
      sStoreUtil.getAll        = _all;
      sStoreUtil.remove        = _remove;
      sStoreUtil.removeAll     = _clear;
      sStoreUtil.removeExcept  = _clear;
      sStoreUtil.clear         = _clear;
      sStoreUtil.clearExcept   = _clear;

      return sStoreUtil;
    }

  try {
    xsr.sesStore = _StoreMgmt(sessionStorage);
  } catch(e){
    console.warn('No Access to sessionStorage.', e);
  }

  try {
    xsr.locStore = _StoreMgmt(localStorage);
  } catch(e){
    console.warn('No Access to localStorage.', e);
  }

  function _routeReloadUrl(compName){
    var redirUrl = (xsr.sesStore.get('_spaReloadUrl')||'').trim();
    if (compName && (redirUrl.indexOf(compName)!=0)) return;
    if (redirUrl) {
      xsr.sesStore.remove('_spaReloadUrl');
      redirUrl = redirUrl.replace(/.*#/gi,'');
      xsr.route(redirUrl, true);
      return true;
    }
  }

  xsr.reload = function(reloadUrl){
    if (reloadUrl) xsr.sesStore.set('_spaReloadUrl', reloadUrl||'');
    xsr.allowNav();
    window.location.reload();
  };

  xsr.hasReloadUrl = function(){
    return !!(xsr.sesStore.get('_spaReloadUrl')||'').trim();
  };

  xsr.initRoutes = _initRouteHash;
  xsr.route      = _routeNewUrl;
  xsr.routeUrl   = _routeToUrl;
  xsr.routeEl    = _$routeElements;
  /* ***************  SPA Route Solution Ends ************************ */

  /* 2way Data-Bind */
  function _getBindKeyOf(el, keyOf){
    var bindSpecStr = _attr(el,'data-bind'), bindSpec, bindKeyFn, bindKey = '';
    if ((bindSpecStr) && (!bindSpecStr.containsStr(':'))) bindSpecStr = _defaultAttr(el)+":'"+bindSpecStr+"'";
    bindSpec = _toObj(bindSpecStr || '{}');
    if (bindSpec && !_isEmptyObj(bindSpec)) {
      _some(_keys(bindSpec), function (attrSpec) {
        if ((!bindKey) && (new RegExp(keyOf, 'i')).test(attrSpec)) {
          bindKeyFn = bindSpec[attrSpec].split('|');
          bindKey   = bindKeyFn.shift().trim();
        }
        return !!bindKey;
      });
    }
    return bindKey;
  }

  function _onViewDataChange() {
    var el = this, $el = $(el)
      , elValue = xsr.getElValue(el), bindData={}
      , $component = $el.spa$()[0], cName=$el.spa$name()
      , is2WayBind = ('2way'.equalsIgnoreCase(xsr.components[cName]['dataBindType']));
    el.classList.add('DATA-MODEL-CHANGE-SRC');

    var bindKey =_getBindKeyOf(el, 'value|$');
    xsr.setSimpleObjProperty(bindData, bindKey, elValue);
    if (is2WayBind) {
      _mergeDeep(xsr.$data(cName), bindData);
      app[cName]['is$DataUpdated'] = xsr.components[cName]['is$DataUpdated'] = true;
    }
    xsr.bindData($component, bindData, '[data-bind*="'+bindKey+'"]:not(.DATA-MODEL-CHANGE-SRC)', true);
    el.classList.remove('DATA-MODEL-CHANGE-SRC');
    if (is2WayBind) xsr.renderUtils.runCallbackFn('app.'+cName+'.$dataChangeCallback', app[cName].$data, app[cName]);
  }

  function _initDataBind(scope, elFilter){
    function _bindEvent(el, eName){
      $(el).on((_attr(el,'data-bind-event') || eName).toLowerCase(), _onViewDataChange);
    }

    //console.log('Init [data-bind]', scope);
    var elSelector = '[data-bind]:not(.SPA-DATA-BOUND)';
    var $dataBindElements = $(scope||'body').find((elFilter||'')+' '+elSelector);
    if (!$dataBindElements.length && !elFilter){
      $dataBindElements = $(scope+elSelector);
    }

    if ($dataBindElements.length) {
      var $textElements = $dataBindElements.filter('textarea,input:not([type=radio]):not([type=checkbox])').addClass('SPA-DATA-BOUND');
      $textElements.each(function(){ _bindEvent(this, 'keyup'); });

      var $selChkRadElements = $dataBindElements.filter('select,input[type=radio],input[type=checkbox]').addClass('SPA-DATA-BOUND');
      $selChkRadElements.each(function(){ _bindEvent(this, 'change'); });
    }

  }
  xsr.initDataBind = _initDataBind;

  function _init_SPA_DOM_(scope) {
    /*init KeyTracking*/
    _initKeyTracking('', scope);

    /*init KeyPauseEvent*/
    _initKeyPauseEvent(scope);

    /* Init Forms/Elements inside components */
    _initSpaElements(scope);

    /* Init Track Form Element's changes */
    xsr.initTrackFormElChanges(scope);
    /*apply data-validation*/
    _initFormValidationInScope(scope);

    /*init SPA routes; a simple routing solution */
    _initRouteHash(scope);

    /* Init togglePassword (eye icon) */
    xsr.initTogglePassword(scope);

    /* Init data-bind */
    _initDataBind(scope);

    /* Process dynUrl Params with click */
    _processDynHashInUrl();
  }

  function _init_SPA_() {

    _ctrlBrwowserNav(); //run_once

    /*init i18nLang - run_once*/
    init_i18n_Lang();

    _init_SPA_DOM_('body');

    /*apply i18n*/
    xsr.i18n.apply('body');
  }

  /*
   * xsr.async(fn)
   * xsr.async(fn, callbackFn)
   * xsr.async(fn, param1, param2, param3)
   * xsr.async(fn, param1, param2, param3, callbackFn)
   */
  xsr.async = function(fn){
    var fnArg = _arrProto.slice.call(arguments, 1);
    function fnAsyc(){
      var fnRes = fn.apply(undefined, fnArg)
        , argLen = fnArg.length
        , nextFn = (argLen)? fnArg[argLen-1] : '';
      if (nextFn && _isFn(nextFn)) nextFn(fnRes);
    }
    setTimeout(fnAsyc, 0);
  };

  function _initApiUrls(){
    _appApiInitialized = !!(_keys(app['api']).length);
    if (_appApiInitialized) _log.log('Initializing app.api');

    var appApiBaseUrl = _find(window, 'app.api.baseUrl');
    if (!_isBlank(appApiBaseUrl)) {
      xsr.api.baseUrl = appApiBaseUrl;
    }

    var appApiUrls = _find(window, 'app.api.urls');
    if (_isBlank(xsr.api.urls) && !_isBlank(appApiUrls)) {
      xsr.api.urls = app.api.urls;
    }

    if (!_isBlank(xsr.api.urls)) {
      var liveApiPrefix = _find(window, 'app.api.liveApiPrefix|app.api.mockRootAtPaths');
      if (!_isBlank(liveApiPrefix)) {
        var apiContextList = _isArr(liveApiPrefix)? liveApiPrefix : (''+liveApiPrefix).split(',')
          , contextMode, urlMode;

        _each(apiContextList, function(apiContext, idx){
          apiContext = apiContext.trim();
          contextMode = apiContext[0];
          if (contextMode == '!' || contextMode == '~') {
            apiContext = apiContext.substr(1);
            _each(xsr.api.urls, function(url, key){
              urlMode = url[0];
              if ( (!(urlMode == '!' || urlMode == '~'))
                && ((url.indexOf(apiContext) == 0) || (url.indexOf('/'+apiContext) > 0)) ) {
                xsr.api.urls[key] = contextMode+url;
              }
            });
          }
          apiContextList[idx] = apiContext;
        });
        app.api['liveApiPrefix'] = apiContextList;
        delete app.api.mockRootAtPaths;
      }
    }
  }

  function _initSpaApp(){
    function runSpaEvent(eName){
      if (spa[eName]) return spa[eName]();
    }
    function initSpaModules(){
      if (xsr.env && 'dev'.equalsIgnoreCase(xsr.env)){
        xsr.api.mock = true;
        var compDefaults = {
          components: {
            templateCache: false,
            callback: function(){
              console.log('spa$>', this.__prop__.componentName);
            }
          }};
        xsr.defaults.set(compDefaults);
      }

      $when( _init_SPA_() ).done(function(){
        /*SPA Init Complete - run_once*/
        $when( runSpaEvent('onInitComplete') ).done(function(){
          /*SPA onReady - run_once*/
          $when( runSpaEvent('onReady') ).done( xsr.renderComponentsInHtml );
        });
      });
    }

    $when( runSpaEvent('onInit') ).done( initSpaModules );
  }

  function _initSpaDefaults(){
    var defaultsInTag
      , $body  = $('body')
      , elBody = $body[0]
      , dataInBody = $body.data();

    if (!_isBlank(dataInBody)) {
      dataInBody['spaDefaults'] = _toObj(_attr(elBody,'data-xsr-defaults') || _attr(elBody,'data-spa-defaults') || {});

      _each(_keys(xsr.defaults), function(spaDefaultsKey){
        if (!spaDefaultsKey.equalsIgnoreCase( 'set' )) {
          defaultsInTag = dataInBody.spaDefaults[spaDefaultsKey] || dataInBody[ 'spaDefaults'+(spaDefaultsKey.toTitleCase()) ];
          if (!_isBlank(defaultsInTag)){
            _mergeDeep(xsr.defaults[spaDefaultsKey], _toObj(defaultsInTag));
          }
        }
      });
    }

    _initRoutesDefaults(); //run_once
    _initApiUrls(); //need to run on 1st Component renderCallback as well
  }

  var xhrLib, $when, $ajax = (win['$'] && $['ajax']) || (win['spaXHR'] && spaXHR['ajax']), $ajaxQ, $ajaxSetup, $ajaxPrefilter;
  function _initXHR(){
    xhrLib = ($['ajax'] && $)  || spaXHR;
    if (xhrLib) {
      $when  = xhrLib.when;
      $ajax  = xhrLib.ajax;
      $ajaxQ = xhrLib.when;
      $ajaxSetup = xhrLib.ajaxSetup;
      $ajaxPrefilter = xhrLib.ajaxPrefilter;
      if ($ && !$['ajax']) { // extending jQ-slim
        $.ajax  = $ajax;
        $.ajaxQ = $ajaxQ;
        $.ajaxSetup = $ajaxSetup;
        $.ajaxPrefilter = $ajaxPrefilter;
      }

      $ajaxSetup({
        dataParsers : {
          javascript: false,
          spacomponent: false
        },
        converters: {
          "text javascript": function(){},
          "text spaComponent": function(){}
        },
        dataFilter: function (rawResponse, dataType) {
          var dataTypeLc = (dataType||'').toLowerCase();
          if (dataTypeLc === 'javascript' || dataTypeLc === 'spacomponent') {
            _ajaxScriptHandle(rawResponse);
          }
          return rawResponse;
        }
      });
    }
  }

  function _beginSPA(){
    //init xhrLib
    _initXHR();

    xsr.strZip   = !xsr.strZip   && win['LZString'] && LZString.compress;
    xsr.strUnzip = !xsr.strUnzip && win['LZString'] && LZString.decompress;

    if (xhrLib) {
      //Read xsr.defaults from body
      _initSpaDefaults();

      /*onLoad Set xsr.debugger on|off using URL param*/
      xsr.debug = xsr.urlParam('xsr.debug') || xsr.hashParam('xsr.debug') || xsr.debug;
      /* ajaxPrefilter */
      $ajaxPrefilter(_ajaxPrefilter);

      _initSpaApp();

      isSPAReady = true;
      _log.info("Initialized SPA.");
    } else {
      console.error('Could not find XHR(ajax) module. Use jQuery Full version or include spaXHR module.');
    }
  }

  //onDocumentReady
  $(function(){
    if ( (_doc.readyState === 'complete') || (!(_doc.readyState === 'loading' || _doc.documentElement.doScroll)) ) {
      _beginSPA();
    } else {
      _doc.addEventListener('DOMContentLoaded', _beginSPA);
    }
  });

})();
xsr.console.info("SPA.js loaded.");