/** @license (MIT) SPA.js | (c) Kumararaja */
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

/* SPA begins */
/** @license (MIT) SPA.js (core) | https://github.com/sucom/SPA.js/blob/master/LICENSE */

/* Avoid 'console' errors in browsers that lack a console */
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

(function() {
  /* Establish the win object, `window` in the browser */
  var win = this;

  /* Create a safe reference to the spa object for use below. */
  var spa = function (obj) {
    if (obj instanceof spa) { return obj; }
    if (!(this instanceof spa)) { return new spa(obj); }
  };

  //ToBeRemoved
  /*Flag for URL Hash Routing*/
  //win.isSpaHashRouteOn=false;

  /* Expose spa to window with alias */
  win.spa = win.__ = win._$ = spa;

  /* Current version. */
  spa.VERSION = '2.75.0-RC6';

  // Creating app scope
  var appVarType = Object.prototype.toString.call(window['app']).slice(8,-1).toLowerCase();
  if (window['app'] && (/^html(.*)element$/i.test(appVarType))) { //HTML Element id="app"
    window['app'] = {api:{}};
  }
  window['app'] = window['app'] || {api:{}};
  window['app']['api'] = window['app']['api'] || {};

  //var _eKey = ['','l','a','v','e',''];

  /* native document selector */
  // var _$  = document.querySelector.bind(document),
  //     _$$ = document.querySelectorAll.bind(document);
  // if (!win['_$'])  win['_$']  = _$;
  // if (!win['_$$']) win['_$$'] = _$$;

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

  spa.isIE = (document['documentMode'] || ieVer);
  spa.isNonIE = (!spa.isIE);

  /*No Operation: a dummy function*/
  spa.noop = function(){};

  //var _eFn = win[_eKey.reverse().join('')];

  /* *************** SPA begins *************** */
  var _appApiInitialized;
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

  /* event handler for window.onhashchange */
  spa.ajaxPreProcess;
  spa.onInit;
  spa.onInitComplete;
  spa.onReady;
  spa.onUrlChange;
  spa.onUrlHashChange;
  spa.onReload;

  //ToBeRemoved
  /* spa route management internal functions */
  // function _initWindowOnHashChange(){
  //   if ('onhashchange' in window) {
  //     isSpaHashRouteOn = true;
  //     spa.console.info("Registering HashRouting Listener");
  //     window.onhashchange = function () {
  //       /* ocEvent
  //        .oldURL : "http://dev.semantic-test.com/ui/home.html#user/changePassword"
  //        .newURL : "http://dev.semantic-test.com/ui/home.html#user/profile"
  //        .timeStamp : 1443191735330
  //        .type:"hashchange"
  //        */
  //       var cHash = window.location.hash;
  //       spa.console.info("onHashChange: "+cHash);
  //       if (cHash) {
  //         spa.route(cHash);
  //       } else if (spa.routesOptions.defaultPageRoute) {
  //         spa.route(spa.routesOptions.defaultPageRoute);
  //       }
  //     };
  //   }
  // };
  // function _stopWindowOnHashChange(){
  //   window.onhashchange = undefined;
  // };

  /* **********************Date prototypes*********************** */
  /* var now = new Date(); //if Mon Mar 01 2010 10:20:30
   *
   * now.yyyymmdd()    => '20100301'
   * now.yyyymmdd('/') => '2010/03/01'
   * now.yyyymmdd('-') => '2010-03-01'
   */
  Date.prototype.yyyymmdd = function(sep) {
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
  Date.prototype.hhmmss = function(sep) {
    var hh = this.getHours(), mm = this.getMinutes(), ss = this.getSeconds();
    return ([(hh>9 ? '' : '0') + hh,
             (mm>9 ? '' : '0') + mm,
             (ss>9 ? '' : '0') + ss
           ].join(sep||''));
  };

  /* **********************String prototypes*********************** */
  /* "   some string   ".trimLeftStr()    ==> "some string   "
   * "+++some string+++".trimLeftStr('+') ==> "some string+++"
   */
  String.prototype.trimLeftStr = function (tStr) {
    return ((''+this).replace(new RegExp("^[" + (tStr || "\\s")+"]+", "g"), ""));
  };

  /* "   some string   ".trimRightStr()    ==> "   some string"
   * "+++some string+++".trimRightStr('+') ==> "+++some string"
   */
  String.prototype.trimRightStr = function (tStr) {
    return ((''+this).replace(new RegExp("["+ (tStr || "\\s") + "]+$", "g"), ""));
  };

  /* "   some string   ".trimStr()    ==> "some string"
   * "+++some string+++".trimStr('+') ==> "some string"
   */
  String.prototype.trimStr = function (tStr) {
    return (''+this).trimLeftStr(tStr).trimRightStr(tStr);
  };

  String.prototype.getLeftStr = function (fromIndex) {
    if (typeof fromIndex === 'string') {
      fromIndex = (''+this).indexOf(fromIndex);
    }
    return (fromIndex)? (''+this).substr(0, fromIndex) : '';
  };

  String.prototype.getRightStr = function (fromIndex) {
    var sLen = 1;
    if (typeof fromIndex === 'string') {
      sLen = fromIndex.length;
      fromIndex = (''+this).indexOf(fromIndex);
    }
    return (fromIndex<0)? '' : (''+this).substr(fromIndex+sLen);
  };

  String.prototype.isBlankStr = function () {
    return ((''+this).trimStr() == "");
  };

  String.prototype.ifBlankStr = function (forNullStr, forNotNullStr) {
    forNullStr    = (typeof forNullStr === "undefined")? '' : forNullStr;
    forNotNullStr = (typeof forNotNullStr === "undefined")? ((''+this).trimStr()) : forNotNullStr;
    return ((''+this).isBlankStr() ? ( forNullStr ) : ( forNotNullStr ) );
  };

  String.prototype.isNumberStr = function () {
    var inStr = (''+this).trim(), nonNumStr = ((inStr.replace(/[0-9]/g, "").replace('.','')).trimStr()), sign = inStr[0];
    return (inStr && ((nonNumStr.length == 0) || ((nonNumStr.length == 1) && ((sign=='+') || (sign=='-')))));
  };

  String.prototype.normalizeStr = function () {
    return (''+this).trimStr().replace(/\s+/g, ' ');
  };

  String.prototype.beginsWithStr = function (str, i) {
    i = (i) ? 'i' : '';
    var re = new RegExp('^' + str, i);
    return ((''+this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.beginsWithStrIgnoreCase = function (str) {
    var re = new RegExp('^' + str, 'i');
    return ((''+this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.endsWithStr = function (str, i) {
    i = (i) ? 'i' : '';
    var re = new RegExp(str + '$', i);
    return ((''+this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.endsWithStrIgnoreCase = function (str) {
    var re = new RegExp(str + '$', 'i');
    return ((''+this).normalizeStr().match(re)) ? true : false;
  };

  String.prototype.containsStr = function (str, i) {
    i = (i) ? 'gi' : 'g';
    var re = new RegExp('' + str, i);
    return ((re).test((''+this)));
  };

  String.prototype.containsStrIgnoreCase = function (str) {
    var re = new RegExp('' + str, 'gi');
    return ((re).test((''+this)));
  };

  String.prototype.equals = function (arg) {
    return ((''+this) == arg);
  };

  String.prototype.equalsIgnoreCase = function (arg) {
    return ((String((''+this).toLowerCase()) == (String(arg)).toLowerCase()));
  };

  String.prototype.toProperCase = function (normalizeSrc) {
    return ( (((typeof normalizeSrc == "undefined") ||  normalizeSrc)? ((''+this).normalizeStr()) : (''+this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
      return $1.toUpperCase();
    }));
  };

  String.prototype.toTitleCase = function (normalizeSrc) {
    return ( (((typeof normalizeSrc == "undefined") ||  normalizeSrc)? ((''+this).normalizeStr()) : (''+this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
      return $1.toUpperCase();
    }));
  };

  String.prototype.capitalize = function () {
    return ((''+this).charAt(0).toUpperCase()) + ((''+this).slice(1));
  };

  String.prototype.unCapitalize = function () {
    return ((''+this).charAt(0).toLowerCase()) + ((''+this).slice(1));
  };

  function _sanitizeHTML(str) {
    var sBoxEl = document.createElement('div');
    sBoxEl.textContent = str;
    return sBoxEl.innerHTML;
  }
  String.prototype.sanitizeHTML = function(){
    return _sanitizeHTML(''+this);
  };
  spa.sanitizeHTML = _sanitizeHTML;

  function _sanitizeScript(str) {
    return (''+str).replace(/<\s*\/+\s*(\bscript\b)/gi, '&lt;/script&gt;</pre')
              .replace(/<\s*(\bscript\b)/gi, '<pre>&lt;script');
  }
  String.prototype.sanitizeScript = function(){
    return _sanitizeScript(''+this);
  };
  spa.sanitizeScript = _sanitizeScript;

  function _sanitizeXSS(str) {
    return _sanitizeScript(str).replace(/\s+on([a-z])\s*=/gi, ' on=').replace(/javascript:/gi,'js:');
  }
  String.prototype.sanitizeXSS = function(){
    return _sanitizeXSS(''+this);
  };
  spa.sanitizeXSS = _sanitizeXSS;

  String.prototype.splitToArray = String.prototype.toArray = function (splitBy) {
    return spa.isBlank((''+this)) ? [] : ((''+this).split(splitBy));
  };

  function getMatchStr(str){
    switch(str){
      case '{': return '}';
      case '[': return ']';
      case '<': return '>';
      default: return str;
    }
  }

  String.prototype.extractStrBetweenIn = function (bS, eS, unique) {
    if (!bS) {
      bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
      bS = (bS)? bS[0] : '';
    }
    eS = eS || getMatchStr(bS);
    var retArr = (''+this).match(RegExp('\\'+bS+'([^\\'+bS+'\\'+eS+'].*?)\\'+eS, 'g')) || [];
    if (unique && !spa.isBlank(retArr)) retArr = retArr.__unique();
    return retArr;
  };

  String.prototype.extractStrBetweenEx = function (bS, eS, unique) {
    if (!bS) {
      bS = (''+this).match(/[^a-z0-9\:\.\/\\]/i);
      bS = (bS)? bS[0] : '';
    }
    eS = eS || getMatchStr(bS);
    var rxStr = '\\'+bS+'\\'+eS, rx = new RegExp('['+rxStr+']', 'g');
    var retArr = ((''+this).match(new RegExp('\\'+bS+'([^'+rxStr+'].*?)\\'+eS, 'g')) || []).map(function(x){
        return x.replace(rx,'');
      });
    if (unique && !spa.isBlank(retArr)) retArr = retArr.__unique();
    return retArr;
  };

  spa.strToNative = function(srcStr){
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
  };
  String.prototype.toNative = function(){
    return spa.strToNative(''+this);
  };

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['{param1}','{param2}','{param3}','{param1}']
  //unique: true  ==> ['{param1}','{param2}','{param3}']
  spa.extractStrBetweenIn = function (srcStr, bS, eS, unique){
    return (srcStr||'').extractStrBetweenIn(bS, eS, unique);
  };

  //srcStr: 'some/string/with/params/{param1}/{param2}/{param3}/{param1}'
  //bS: '{'
  //eS: '}'
  //unique: false ==> ['param1','param2','param3','param1']
  //unique: true  ==> ['param1','param2','param3']
  spa.extractStrBetweenEx = function (srcStr, bS, eS, unique){
    return (srcStr||'').extractStrBetweenEx(bS, eS, unique);
  };

  spa.strToArray = function(srcStr) {
    if (typeof srcStr == 'string') {
      srcStr = [srcStr];
    }
    return srcStr;
  };

  spa.jsonDataSanityCheck;
  function _isValidEvalStr(str){
    if (!spa.jsonDataSanityCheck) return true;
    var idxOfB = str.indexOf('(');
    if ( (idxOfB>=0) && (str.indexOf(')', idxOfB)>idxOfB) ){
      console.warn('Insecured String with braces():', str);
      return false;
    }
    return true;
  }

  spa.toJSON = function (str, key4PrimaryDataTypes) {
    var thisStr;
    if (_.isString(str)) {
      thisStr = str.trimStr().trimStr(',').trimStr(';');

      if (!_isValidEvalStr(thisStr)) return str;

      if (thisStr.match(/^\</)) return str; //could be HTML

      if (!(thisStr.containsStr("{") || thisStr.containsStr(":") || thisStr.containsStr("\\[") || thisStr.containsStr("'") || thisStr.containsStr('\"') ))
      { if (thisStr.containsStr(",") || thisStr.containsStr(";")) {
          return thisStr.replace(/ /g,'').replace(/;/g, ',').split(',');
        } else if (key4PrimaryDataTypes) {
          thisStr = '{'+key4PrimaryDataTypes+':'+thisStr+'}';
        } else {
          return spa.strToNative(thisStr);
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
      jsonObj = (!_.isString(str) && _.isObject(str)) ? str : ( spa.isBlank(str) ? null : (Function('"use strict";return (' + thisStr + ')')()) );
    } catch(e){
      console.error('Error JSON Parse: Invalid String >> "'+str+'"\n>> ' + (e.stack.substring(0, e.stack.indexOf('\n'))) );
    }
    return jsonObj;
  };
  String.prototype.toJSON = function () {
    return spa.toJSON(''+this);
  };

  String.prototype.toBoolean = function () {
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

  Boolean.prototype.toValue = function (tValue, fValue) {
    if (typeof tValue == "undefined") tValue = true;
    if (typeof fValue == "undefined") fValue = false;
    return (((''+this).valueOf()) ? (tValue) : (fValue));
  };

  Boolean.prototype.toHtml = function (tElId, fElId) {
    return $(((''+this).valueOf()) ? tElId : fElId).html();
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
      return (((t === -1 || t === 2) ? ps : "") + (''+this) + ((t === 1 || t === 2) ? ps : ""));
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
    return (''+str).isNumberStr();
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
    return ((srcStr||"").trim().replace(/]/g,'').replace(/(\[)|(\\)|(\/)/g,'.').replace(/(\.+)/g,'.').trimStr("\\."));
  };

  spa.ifBlank = spa.ifEmpty = spa.ifNull = function (src, replaceWithIfBlank, replaceWithIfNotBlank) {
    replaceWithIfBlank = ("" + (replaceWithIfBlank || "")).trimStr();
    replaceWithIfNotBlank = (typeof replaceWithIfNotBlank === "undefined")? (("" + src).trimStr()) : replaceWithIfNotBlank;
    return ( spa.isBlank(src) ? (replaceWithIfBlank) : (replaceWithIfNotBlank) );
  };

  function __finalValue(srcVal) {
    var retVal = srcVal, fnContext = arguments[1], fnArgs = Array.prototype.slice.call(arguments, 2);
    if (_is(retVal, 'string')) {
      if (retVal.indexOf('(')>0) { //function
        retVal = retVal.getLeftStr('(');
      }
      retVal = spa.findSafe(window, (retVal.trim()), undefined);
    }
    if (_is(retVal, 'function') && (arguments.length>1)) {
      retVal = retVal.apply(fnContext, fnArgs);
    }
    return retVal;
  }

  /* now: Browser's current timestamp */
  spa.now = function () {
    return ("" + ((new Date()).getTime()));
  };

  /* year: Browser's current year +/- N */
  spa.year = function (n) {
    n = n || 0;
    return ((new Date()).getFullYear() + (spa.toInt(n)));
  };

  //approx memory size
  spa.sizeOf = function _sizeOf(obj, format) {
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
            var objClass = Object.prototype.toString.call(obj).slice(8, -1);
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

    return (spa.is(format, 'undefined') || format)? formatByteSize(sizeOf(obj)) : sizeOf(obj);
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

  function _initKeyTracking() {
    var elementsToTrackKeys = (arguments.length && arguments[0]) ? arguments[0] : "[data-disable-keys],[data-focus-next],[data-focus-back]"
      , $elementsToTrackKeys = $( ((arguments.length==2 && arguments[1])? arguments[1] : 'body') ).find(elementsToTrackKeys);
    spa.console.info("Finding Key-Tracking for element(s): " + elementsToTrackKeys);
    $elementsToTrackKeys.each(function (index, element) {
      $(element).keydown(spa._trackAndControlKey);
      spa.console.info("SPA is tracking keys on element:");
      spa.console.info(element);
    });
  }
  spa.initKeyTracking = _initKeyTracking;

  var keyPauseTimer;
  function _initKeyPauseEvent(scope){
    $(scope || 'body').find('[onKeyPause]:not([onKeyPauseReg])').each(function(i, el){
      $(el).attr('onKeyPauseReg', '').on('input propertychange paste', function(){
        var targetEl = this,
            timeDelay = ((''+targetEl.getAttribute('data-pause-time')).replace(/[^0-9]/g,'') || '1250')*1;
        if (keyPauseTimer) clearTimeout(keyPauseTimer);
        keyPauseTimer = setTimeout(function(){
          var fnName = targetEl.getAttribute('onKeyPause').split('(')[0], fn2Call=spa.findSafe(window,fnName);
          if (fn2Call) fn2Call.call(targetEl, targetEl);
        }, timeDelay);
      });
    });
  }

  spa.getDocObj = function (objId) {
    var jqSelector = ((typeof objId) == "object") ? objId : ((objId.beginsWithStr("#") ? "" : "#") + objId);
    return ( $(jqSelector).get(0) );
  };
  spa.getDocObjs = function (objId) {
    var jqSelector = (objId.beginsWithStr("#") ? "" : "#") + objId;
    return ( $(jqSelector).get() );
  };

  spa.hasCssRule = function(cssSelectors){
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
  spa.getCssRule = function(cssSelector){
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
  spa.randomPassword = function (passLen, passStr) {
    var chars = passStr || "9a8b77C8D9E8dkfhseidF7G6H5QJ3c6d5e4f32L3M4N5P6Qg2h3i4j5kV6W5X4Y3Z26m7n8p9q8r7s6t5u4v3w2x3y4z5A6BK7R8S9T8U7";
    var pass = "";
    for (var x = 0; x < (passLen || 8); x++) {
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
    }
  };

  spa.parseKeyStr = function (keyName, changeToLowerCase) {
    return ((changeToLowerCase ? keyName.toLowerCase() : keyName).replace(/[^_0-9A-Za-z\$\[\]\?\*\-]/g, ""));
  };

  var arrayIndexPointsToMap = {};
  spa.setObjProperty = function (obj, keyNameStr, propValue, keyToLowerCase) {
    keyNameStr = ('' + keyNameStr);
    keyToLowerCase = keyToLowerCase || false;
    var xObj = obj, oKey;
    var oKeys = (( (keyNameStr.indexOf('.')>=0) || (keyNameStr == keyNameStr.toUpperCase()) )? keyNameStr.split('.') :  keyNameStr.split(/(?=[A-Z])/)), arrNameIndx, arrName, arrIdx;
    /*Default: camelCase | TitleCase if ALL UPPERCASE split by . */
    var keyIdentifier = $.trim(keyNameStr.replace(/[0-9A-Za-z\[\]\?\*\_]/g, ""));
    if (keyIdentifier && (keyIdentifier != "")) {
      oKeys = keyNameStr.split(keyIdentifier[0]);
    }
    var keyFullPath='';
    while (oKeys.length > 1) {
      oKey = spa.parseKeyStr(oKeys.shift(), keyToLowerCase);
      if ($.trim(oKey) != "") {
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

  /*
   * spa.extract(destObj, mapKeys, srcObj1, srcObj2, srcObj3)
   * spa.extract(mapKeys, srcObj1, srcObj2, srcObj3)
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
    var args = Array.prototype.slice.call(arguments);
    try {
      if (!spa.is(args[0], 'object')) args.unshift({});
      if (spa.is(args[1], 'string')) args[1] = args[1].split(',');
    } catch (e) {
      console.error('Invalid arguments', e);
    }

    if (!(spa.is(args[0], 'object') && (spa.is(args[1], 'array')))) {
      console.error('Invalid arguments.');
      return;
    }

    var dstObj  = args[0]
      , spec    = args[1]
      , srcObjs = args.slice(2);
    srcObjs.unshift(window); //load window @0
    var mapSpecArr, dstKey, srcIdx, srcKey, skipExtract, dstVal;
    _.each(spec, function(mapSpec){
      mapSpec = (mapSpec || '').trim();
      skipExtract = !(mapSpec && mapSpec != '@0');
      if (!skipExtract) {
        if (/^\@([0-9])+/.test(mapSpec)){ //begins with @#
          srcKey = dstKey =  ((mapSpec).getRightStr('.') || '').trim();
          if (srcKey) {
            mapSpec = srcKey+':'+mapSpec;
          } else {
            _.merge(dstObj, srcObjs[ spa.toInt(mapSpec) ]);
            skipExtract = true;
          }
        }

        if (!skipExtract) {
          mapSpecArr = mapSpec.split(':');
          dstKey = (mapSpecArr[0]||'').trim();
          srcIdx = spa.toInt((mapSpecArr[1]||'').split('.')[0]);
          srcKey =  ((mapSpecArr[1]||'').getRightStr('.') || '').trim();
          if (!dstKey) dstKey = srcKey;
          dstVal = srcKey? spa.findSafe(srcObjs[srcIdx], srcKey) : (srcIdx? srcObjs[srcIdx] : {});
          if (dstKey.endsWithStr('\\+')) {
            dstKey = dstKey.trimRightStr('+');
            var preVal = spa.findSafe(dstObj, dstKey);
            switch(spa.of(preVal)) {
              case 'object':
                if (spa.is(dstVal, 'object')) {
                  dstVal = _.merge({}, preVal, dstVal);
                }
                break;
              case 'array':
                if (spa.is(dstVal, 'array')) {
                  dstVal = preVal.concat(dstVal);
                } else {
                  dstVal = preVal.push(dstVal);
                }
                break;
            }
          }
          spa.setSimpleObjProperty(dstObj, dstKey, dstVal);
        }
      }
    });

    return dstObj;
  }
  spa.extract = _extract;

  function _$qrySelector(selector) {
    if (spa.is(selector, 'string')) {
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
          compIndex = spa.toInt(compName.getRightStr(':').trim());
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
  //spa.$qrySelector = _$qrySelector;

  spa.setElValue = function (el, elValue) {
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
        spa.selectOptionForValue(el, elValue);
        if ($el.isEnabled()) $el.trigger('change');
        break;

      case "TEXTAREA":
        $el.val(elValue);
        if ($el.isEnabled()) $el.trigger('keyup');
        break;

      default:
        $el.html( spa.sanitizeXSS(elValue) );
        $el.val(elValue);
        if ($el.isEnabled()) $el.trigger('keyup');
        break;
    }

  };

  spa.getElValue = function (el, escHTML) {
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
        }
      }
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


  function _toQueryString(obj) {
    return _.isObject(obj)? (Object.keys(obj).reduce(function (str, key, i) {
      var delimiter, val;
      delimiter = (i === 0) ? '' : '&';
      key = encodeURIComponent(key);
      val = _.isArray(obj[key])? obj[key].map(function(item){ return encodeURIComponent(item); }).join(',') : encodeURIComponent(obj[key]);
      return [str, delimiter, key, '=', val].join('');
    }, '')) : '';
  }
  spa.toQueryString = spa.ObjectToQueryString = spa.objectToQueryString = spa.JsonToQueryString = spa.jsonToQueryString = _toQueryString;

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
      , $fmData = $(this).data()
      , o = (typeof obj === "object") ? obj : {}
      , c = (typeof obj === "boolean") ? obj : (keyNameToLowerCase || false)
      , kParse   = $fmData["serializeIgnorePrefix"]
      , toNative = $fmData.hasOwnProperty('typeNative')
      , oKeyName, oKeyValue;
    arrayIndexPointsToMap = {};
    if (strPrefixToIgnore) kParse = strPrefixToIgnore;
    $.each(a, function () {
      oKeyName = (kParse) ? (this.name).replace(kParse, "") : this.name;
      o = spa.setObjProperty(o, oKeyName,  (toNative? ((this.value).toNative()) : this.value), c);
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

        o = spa.setObjProperty(o, oKeyName, (toNative? (oKeyValue.toNative()) : oKeyValue), c);
      }
    });

    return o;
  };
  spa.serializeFormToJSON = spa.serializeFormToObject = function (formSelector, obj, keyNameToLowerCase, strPrefixToIgnore) {
    return $(formSelector).serializeFormToJSON(obj, keyNameToLowerCase, strPrefixToIgnore);
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

  /* find(jsonObject, 'key1.key2.key3[0].key4'); */
  spa.findSafe = spa.findInObj = spa.findInObject = spa.locateSafe = spa.valueOfPath = spa.find = spa.locate = function (objSrc, pathStr, forUndefined) {
    if (is(objSrc, 'window|array|object|function|global') && pathStr) {
      var pathList = _.map(pathStr.split('|'), function(path){ return path.trim(); } );
      pathStr = pathList.shift();
      var nxtPath = pathList.join('|');

      var unDef, retValue, isWildKey = (pathStr.indexOf('*') >= 0);
      if (isWildKey) {
        retValue = (function(xObj, xKey) {
                      var xValue;
                      if ((typeof xObj == 'object') || (typeof xObj == 'function')) {
                        if (xObj.hasOwnProperty(xKey)) {
                          xValue = xObj[xKey];
                        } else {
                          var oKeys = Object.keys(xObj), idx=0;
                          while ( is(xValue, 'undefined') && (idx < oKeys.length) ) {
                            xValue = arguments.callee( xObj[ oKeys[idx++] ], xKey );
                          }
                        }
                      }
                      return xValue;
                    }(objSrc, pathStr.replace(/\*/g, '')));
      } else {
        var i = 0, path = spa.toDottedPath(pathStr).split('.'), len = path.length;
        for (retValue = objSrc; i < len; i++) {
          if (is(retValue, 'object|window|function|global')) {
            retValue = retValue[ path[i].trim() ];
          } else if (is(retValue, 'array')) {
            retValue = retValue[ spa.toInt(path[i]) ];
          } else {
            retValue = unDef;
            break;
          }
        }
      }

      if (is(retValue, 'undefined')) {
        if (nxtPath) {
          return spa.findSafe(objSrc, nxtPath, forUndefined);
        } else {
          return (is(forUndefined, 'function'))? forUndefined.call(objSrc, objSrc, pathStr) : forUndefined;
        }
      } else {
        return retValue;
      }

    } else {
      if (arguments.length == 3) {
        return (is(forUndefined, 'function'))? forUndefined.call(objSrc, objSrc, pathStr) : forUndefined;
      } else {
        return objSrc;
      }
    }
  };

  spa.has = spa.hasKey = function (obj, path) {
    var tObj = obj, retValue = false;
    try {
      retValue = _isValidEvalStr(path)? (typeof spa.find(tObj, path) != "undefined") : false;
    } catch(e){
      console.warn("Key["+path+"] error in object.\n" + e.stack);
    }
    return retValue;
  };

  function _of(x) {
    return (Object.prototype.toString.call(x)).replace(/\[object /, '').replace(/\]/, '').toLowerCase();
  }
  function _is(x, type) {
    return ((''+type).toLowerCase().indexOf(of(x)) >= 0);
  }

  spa.of = of = _of;
  spa.is = is = _is;

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
  }

  spa.hasPrimaryKeys = function _spa_hasPrimaryKeys(obj, propNames){
    return _isObjHasKeys(obj, propNames);
  };
  spa.hasKeys = function _spa_hasKeys(obj, propNames){
    return _isObjHasKeys(obj, propNames, true);
  };

  //NOT used anymore ToBeRemoved
  // spa.hasIgnoreCase = spa.hasKeyIgnoreCase = function (obj, pathStr) {
  //   var retValue = "", tObj = obj || {}, lookupPath = ""+spa.toDottedPath((pathStr));
  //   var objKeys = spa.keysDottedAll(tObj); //get AllKeys with dotted notation
  //   if (objKeys && !_.isEmpty(objKeys)) {
  //     spa.console.debug(objKeys);
  //     _.some(objKeys, function(oKey){
  //       var isMatch = oKey.equalsIgnoreCase(lookupPath);
  //       if (!isMatch) {
  //         isMatch = oKey.beginsWithStrIgnoreCase(lookupPath+".");
  //         if (isMatch) {
  //           oKey = oKey.slice(0, oKey.lastIndexOf("."));
  //         }
  //       }
  //       if (isMatch) retValue = oKey;
  //       return (isMatch);
  //     });
  //   }
  //   return retValue;
  // };

  //NOT used anymore ToBeRemoved
  // spa.findIgnoreCase = function(obj, path, ifNot){
  //   var retValue = ifNot;
  //   var keyInObj = spa.hasIgnoreCase(obj, path);
  //   if (keyInObj){
  //     retValue = spa.findSafe(obj, keyInObj, ifNot);
  //   };
  //   return retValue;
  // };

  /*Get All keys like X-Path with dot and [] notations */
  spa.keysDottedAll = function (a) {
    var objKeys = spa.keysDotted(a);
    if (objKeys && !_.isEmpty(objKeys)) {
      objKeys = spa.toDottedPath(objKeys.join(",")).split(",");
    }
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
    '__now' : {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      },
      enumerable : false,
      configurable: false
    },
    '__clone': {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      },
      enumerable : false,
      configurable: false
    },

    '__toObject': {
      value : function(valAsKey){
        var retObj = {};
        this.forEach(function(item, index){
          (valAsKey)? retObj[ item ] = index : retObj[ index ] = item;
        });
        return retObj;
      },
      enumerable : false,
      configurable: false
    },
    '__unique': {
      value: function() {
        return this.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      },
      enumerable : false,
      configurable: false
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
      },
      enumerable : false,
      configurable: false
    },

    '__isFirst': {
      value: function(value, ignoreCase) {
        var firstArrValue = this[0];
        if (ignoreCase) {
          firstArrValue = firstArrValue.toLowerCase();
          value = value.toLowerCase();
        }
        return (firstArrValue == value);
      },
      enumerable : false,
      configurable: false
    },

    '__isLast': {
      value: function(value, ignoreCase) {
        var lastArrValue = this[this.length-1];
        if (ignoreCase) {
          lastArrValue = lastArrValue.toLowerCase();
          value = value.toLowerCase();
        }
        return (lastArrValue == value);
      },
      enumerable : false,
      configurable: false
    },

    '__has': {
      value: function(value, options) { //options = 'i' | 'b/^' | 'e/$' | 'c/*' | '==' | '<' | '<=' | '>' | '>='
        var retValue; options = (options || '').trim();

        function optionsHas(opt) {
          return (options.indexOf(opt)>=0);
        }

        if (options) {
          if (options.indexOf('i') && spa.is(value, 'string')) value = value.toLowerCase();
          for(var i=0; i<this.length; i++){
            var item = this[i];
            if (options.indexOf('i') && spa.is(item, 'string')) item = item.toLowerCase();
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
      },
      enumerable : false,
      configurable: false
    }

  });

  Object.defineProperties(Object.prototype, {
    '__now' : {
      value : function(){
        return JSON.parse(JSON.stringify(this));
      },
      enumerable : false,
      configurable: false
    },
    '__clone': {
      value: function _obj_clone(){
        return JSON.parse(JSON.stringify(this));
      },
      enumerable : false,
      configurable: false
    },
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
    '__merge': {
      value: function _obj_merge(){
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
    },
    '__toQueryString': {
      value: function(){
        return spa.toQueryString(this);
      },
      enumerable : false,
      configurable: false
    },
    '__extract': {
      value: function(){
        Array.prototype.unshift.call(arguments, this);
        return spa.extract.apply(this, arguments);
      },
      enumerable : false,
      configurable: false
    }
  });

  function _getFullPath4Component(url, defaultCompName) {
    var newUrl = url;
    defaultCompName = (defaultCompName||'').replace(/[^a-z0-9]/gi, '/');
    if ('.{$'.indexOf(url[0])>=0) {
      var urlPath = url.split('/')
        , urlRoot = urlPath[0].replace(/[\{\}]/g,'')
        , cName   = (urlRoot == '$' || urlRoot == '.')? defaultCompName : urlRoot.replace(/[\{\$\}]/,'')
        , cPath   = ((spa.defaults.components.inFolder)? (cName+"/"): '');
      urlPath[0]  = (spa.defaults.components.rootPath + cPath).trimRightStr('/');
      newUrl = urlPath.join('/');
    }
    return newUrl;
  }

  function _ajaxScriptHandle( responseText ) {
    if (responseText.trim()) {
      var xScript = document.createElement( "script" );
      xScript.setAttribute( 'id', 'js-'+spa.now() );
      if (spa.defaults.csp.nonce) {
        xScript.setAttribute( 'nonce', spa.defaults.csp.nonce );
      }
      xScript.text = responseText;
      document.head.appendChild( xScript ).parentNode.removeChild( xScript );
    }
  }
  $.ajaxSetup({
    converters: {
      "text javascript": function(){},
      "text spaComponent": function(){}
    },
    dataFilter: function (rawResponse, dataType) {
      if (dataType === 'javascript' || dataType === 'spaComponent') {
        _ajaxScriptHandle(rawResponse);
        rawResponse = '';
      }
      return rawResponse;
    }
  });
  $.cachedScript = function (url, options) {
    spa.console.log('Ajax for script:',url, 'options:',options);
    /* allow user to set any option except for dataType and url */
    url = _getFullPath4Component(url, (options? options['spaComponent'] : '') );
    if (!(url.endsWithStrIgnoreCase( '.js' )) && (url.indexOf('?')<0)) {
      url += spa.defaults.components.scriptExt;
    }
    options = options || {};
    if (!options.hasOwnProperty('cache')) {
      options['cache'] = true;
    }
    if (!options.hasOwnProperty('dataType')) {
      options['dataType'] = 'javascript';
    }
    options = $.extend(options, {
      url: url
    });
    spa.console.info("Loading Script('" + url + "') ...");
    return $.ajax(options);
  };

  $.cachedStyle = function (styleId, url, options) {
    /* allow user to set any option except for dataType and url */
    var $styleContainerEl = $('#'+styleId, 'head');
    options = options || {};

    if (!options.hasOwnProperty('cache')) {
      options['cache'] = true;
    }
    if (!$styleContainerEl.length) {
      options['cache'] = spa.defaults.components.offline; //1st load from the server
    }

    options = $.extend(options, {
      dataType: "text",
      url: url,
      success: function (cssStyles) {
        $styleContainerEl.remove();
        var styleNonceAttr = (spa.defaults.csp.nonce)? (' nonce="'+(spa.defaults.csp.nonce)+'"') : '';
        $("head").append('<style id="' + (styleId) + '" type="text/css"'+styleNonceAttr+'>' + cssStyles + '<\/style>');
      }
    });
    spa.console.info("Loading style('" + url + "') ... ");
    return $.ajax(options);
  };

  /* Add Script Tag */
  spa.addScriptTag = function (scriptId, scriptSrc) {
    scriptId = scriptId.replace(/#/, "");
    spa.console.group("spaAddScriptTag");
    if (!spa.isElementExist("#spaScriptsContainer")) {
      spa.console.info("#spaScriptsContainer NOT Found! Creating one...");
      $('body').append("<div id='spaScriptsContainer' style='display:none' rel='Dynamic Scripts Container'></div>");
    }
    if (spa.isElementExist("#" + scriptId)) {
      spa.console.info("script [" + scriptId + "] already found in local.");
    }
    else {
      spa.console.info("script [" + scriptId + "] NOT found. Added script tag with src [" + scriptSrc + "]");
      var scriptSrcAttr = (scriptSrc)? (' src="' + scriptSrc + '"') : '';
      var scriptNonceAttr = (spa.defaults.csp.nonce)? (' nonce="'+(spa.defaults.csp.nonce)+'"') : '';
      $("#spaScriptsContainer").append('<script id="' + (scriptId) + '" type="text/javascript"'+scriptSrcAttr+scriptNonceAttr+'><\/script>');
    }
    spa.console.groupEnd("spaAddScriptTag");
  };

  /* Add Style Tag */
  spa.addStyle = function (styleId, styleSrc) {
    styleId = styleId.replace(/#/, "");
    spa.console.group("spaAddStyle");
    if (!spa.isElementExist("#spaStylesContainer")) {
      spa.console.info("#spaStylesContainer NOT Found! Creating one...");
      $('body').append("<div id='spaStylesContainer' style='display:none' rel='Dynamic Styles Container'></div>");
    }
    if (spa.isElementExist("#" + styleId)) {
      spa.console.info("style [" + styleId + "] already found in local.");
    }
    else {
      spa.console.info("style [" + styleId + "] NOT found. Added link tag with href [" + styleSrc + "]");
      $("#spaStylesContainer").append("<link id='" + (styleId) + "' rel='stylesheet' type='text/css' href='" + styleSrc + "'\/>");
    }
    spa.console.groupEnd("spaAddStyle");
  };

  /* Loading script */
  spa.loadScript = function (scriptId, scriptPath, useScriptTag, tAjaxRequests, xOptions) {
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
          $.cachedScript(scriptPath, xOptions).done(function (script, textStatus) {
            spa.console.info("Loaded script [" + scriptId + "] from [" + scriptPath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    spa.console.groupEnd("spaScriptsLoad");
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

  spa.getComponentsFullPath = function(compNameLst){
    compNameLst = spa.strToArray(spa.toJSON(compNameLst));
    return _.map(compNameLst, function(compName){
        return (spa.defaults.components.rootPath)+ ((spa.defaults.components.inFolder || (/[^a-z0-9]/gi.test(compName)))? compName: '') +'/'+(_getComponentFileName(compName))+ (spa.defaults.components.scriptExt);
      });
  };

  spa.loadComponents = function(compNameLst, onDone, onFail) {
    var unloadedComponents = _.filter(spa.strToArray(spa.toJSON(compNameLst)), function(compName){
      return (!spa.components.hasOwnProperty(compName.replace(/[^a-z0-9]/gi,'_') ));
    });
    var scriptFullPathList = spa.getComponentsFullPath(unloadedComponents);
    spa.loadScripts(scriptFullPathList, onDone, onFail);
  };

  spa.loadScripts = function(scriptsLst, onDone, onFail) {
    scriptsLst = spa.strToArray(spa.toJSON(scriptsLst));

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
    if (spa.isBlank(scriptsLst)) {
      spa.renderUtils.runCallbackFn(onDone);
    } else {
      var scriptCache = true, scriptPath = scriptsLst.shift();
      if (scriptPath) {
        if (/^~/.test(scriptPath)) {
          scriptCache = false;
          scriptPath = scriptPath.substr(1);
        }
        spa.console.info("Load script from   [" + scriptPath + "], cache:",scriptCache);
        $.cachedScript(scriptPath, {cache: scriptCache}).done(function() {
          spa.console.info("Loaded script from [" + scriptPath + "]");
          spa.loadScriptsSync(scriptsLst, onDone, onFail);
        }).fail(function(){
          console.error("Failed Loading script from [" + scriptPath + "].", arguments);
          spa.renderUtils.runCallbackFn(onFail);
        });
      } else {
        spa.loadScriptsSync(scriptsLst, onDone, onFail);
      }
    }
  };

  /* Loading style */
  spa.loadStyle = function (styleId, stylePath, styleCache, tAjaxRequests) {
    styleId = styleId.replace(/#/, "");
    styleCache = !!styleCache;
    tAjaxRequests = tAjaxRequests || [];
    spa.console.group("spaStylesLoad");
    if (spa.isBlank(stylePath)) {
      spa.console.error("style path [" + stylePath + "] for [" + styleId + "] NOT defined.");
    }
    else {
      var getCss = !styleCache;
      if (styleCache) {
        if ($('#'+styleId, 'head').length) {
          spa.console.info("Style('" + stylePath + "') already loaded.");
        } else {
          getCss = true;
        }
      }
      if (getCss) {
        //1st load from the server
        tAjaxRequests.push(
          $.cachedStyle(styleId, stylePath, {cache: spa.defaults.components.offline}).done(function (style, textStatus) {
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
    if (!spa.isElementExist("#spaViewTemplateContainer")) {
      spa.console.info("#spaViewTemplateContainer NOT Found! Creating one...");
      $('body').append("<div id='spaViewTemplateContainer' style='display:none' rel='Template Container'></div>");
    }
    spa.console.info("Adding <script id='" + (tmplId) + "' type='text/" + tmplType + "'>");
    var Tag4BlockedScript = '_BlockedScript_';
    tmplBody = tmplBody.replace(/<(\s)*script/gi,'<'+Tag4BlockedScript+' src-ref="'+tmplId+'"').replace(/<(\s)*(\/)(\s)*script/gi,'</'+Tag4BlockedScript)
            .replace(/<(\s)*link/gi,'<_LINKTAGINTEMPLATE_').replace(/<(\s)*(\/)(\s)*link/gi,'</_LINKTAGINTEMPLATE_');

    var scriptNonceAttr = (spa.defaults.csp.nonce)? (' nonce="'+(spa.defaults.csp.nonce)+'"') : '';
    $("#spaViewTemplateContainer").append('<script id="'+(tmplId)+'" type="text/'+tmplType+'"'+scriptNonceAttr+'>' + tmplBody + '<\/script>');
  };
  spa.updateTemplateScript = function (tmplId, tmplBody, tmplType){
    tmplId = tmplId.replace(/#/, "");
    var $tmplScript = $('#spaViewTemplateContainer').find('#'+tmplId);
    if ($tmplScript.length) {
      $tmplScript.remove();
    }
    spa.addTemplateScript(tmplId, tmplBody, tmplType);
  };

  /* Load external or internal (inline or #container) content as template script */
  spa.loadTemplate = function (tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions) {
    tmplId = tmplId.replace(/#/g, "");
    tmplPath = (tmplPath.ifBlankStr("inline")).trimStr();
    templateType = templateType || "x-template";
    viewContainerId = viewContainerId || "#DummyInlineTemplateContainer";
    tAjaxRequests = tAjaxRequests || [];
    tmplAxOptions = tmplAxOptions || {};
    spa.console.group("spaTemplateAjaxQue");
    if (!spa.isElementExist("#"+tmplId)) {
      spa.console.info("Template[" + tmplId + "] of [" + templateType + "] NOT found. Source [" + tmplPath + "]");
      if (tmplPath && tmplPath == "undefined") {
        spa.addTemplateScript(tmplId, '', templateType);
        spa.console.info("Loaded Empty Template[" + tmplId + "] of [" + templateType + "]");
      } else if ((tmplPath.equalsIgnoreCase("inline") || tmplPath.beginsWithStr("#"))) { /* load from viewTargetContainer or local container ID given in tmplPath */
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
      else if (!tmplPath.equalsIgnoreCase("script")) { /* load from template-URL */

        var axMethod = String(tmplAxOptions['method'] || 'get').toLowerCase();
        if (tmplAxOptions['params']) {
          tmplPath = spa.api.url(tmplPath, tmplAxOptions['params']);
        }
        spa.console.warn(">>>>>>>>>> Making New Template Request");

        var axTemplateRequest = $.ajax({
          url: tmplPath,
          method: axMethod,
          headers : tmplAxOptions['headers'],
          data: tmplAxOptions['payload'],
          cache: spa.defaults.components.offline, //1st load from the server
          dataType: 'html',
          onTmplError: tmplAxOptions['onError'],
          success: function (template) {
            spa.addTemplateScript(tmplId, template, templateType);
            spa.console.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            if (this.onTmplError && _is(this.onTmplError, 'function')) {
              this.onTmplError.call(this, jqXHR, textStatus, errorThrown);
            }
            spa.console.error("Failed Loading Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]. [" + textStatus + ":" + errorThrown + "]");
          }
        });

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
        tAjaxRequests = spa.loadTemplate(tmplId, tmplPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions);
      } else if (spa.isBlank(($tmplId.html()))) {
        spa.console.warn("Template[" + tmplId + "] of [" + templateType + "] script found EMPTY!");
        var externalPath = "" + $tmplId.attr("path");
        if (!spa.isBlank((externalPath))) {
          templateType = ((($tmplId.attr("type")||"").ifBlankStr(templateType)).toLowerCase()).replace(/text\//gi, "");
          spa.console.info("prepare/remove to re-load Template[" + tmplId + "]  of [" + templateType + "] from external path: [" + externalPath + "]");
          $tmplId.remove();
          tAjaxRequests = spa.loadTemplate(tmplId, externalPath, templateType, viewContainerId, tAjaxRequests, tmplReload, tmplAxOptions);
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

  var _winLocHash_='';
  /*Get URL Hash value
   * current window location = http://xyz.com/page#/hash0/hash1/hash2
   * spa.getLocHash()   => "#/hash0/hash1/hash2"
   * */
  spa.getLocHash = function(urlHashBase){
    var urlHash = (_winLocHash_ || window.location.hash).replace('#','');
    //if (!urlHash && !spa.is(urlHashBase, 'undefined') && (urlHashBase!='#')) {
    if (!(urlHash || spa.is(urlHashBase, 'undefined') || urlHashBase=='#')) {
      urlHash = (window.location.pathname)
                .replace(/(\/)*(index|default)\.([a-z])*/i,'')
                .replace((urlHashBase.replace(/\s*/g, '').trimRightStr("/")), '');
    }
    return urlHash;
  };
  /*Get URL Hash value
   * if url = http://xyz.com/page#/hash0/hash1/hash2
   * spa.urlHash()   => "/hash0/hash1/hash2"
   * spa.urlHash(1)  => "hash1"
   * spa.urlHash([]) => ["hash0", "hash1", "hash2"]
   * spa.urlHash(["key0", "key1", "key3"]) => {"key0":"hash0", "key1":"hash1", "key2":"hash2"}
   * */
  spa.urlHash = function (returnOf, urlHashBase) {
    var hashDelimiter = "/", retValue = spa.getLocHash(urlHashBase);
    if (returnOf || _.isNumber(returnOf)) {
      retValue = retValue.beginsWithStr(hashDelimiter) ? retValue.substring(retValue.indexOf(hashDelimiter) + (hashDelimiter.length)) : retValue;
      var hashArray = (retValue.length)? retValue.split(hashDelimiter) : [];
      if (_.isNumber(returnOf)) {
        if (returnOf<0) {
          retValue = hashArray[hashArray.length-1];
        } else {
          retValue = (hashArray && hashArray.length > returnOf) ? hashArray[returnOf] : "";
        }
      }
      else if (_.isArray(returnOf)) {
        retValue = (returnOf.length === 0) ? hashArray : _.zipObject(returnOf, hashArray);
      } else if (_.isString(returnOf) && returnOf == "?") {
        retValue = (retValue.containsStr("\\?"))? spa.getOnSplit(retValue, "?", 1) : "";
      }
    }
    return retValue;
  };
  function _getAboluteUrl(base, url){
    return ((base || '').trimRightStr('/'))+'/'+((url || '').trimLeftStr('/'));
  }
  spa.urlHashFull = function(urlHashBase) {
    urlHashBase = urlHashBase || '#';
    return _getAboluteUrl(urlHashBase, spa.urlHash('', urlHashBase));
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
  //ToBeRemoved/used the pattern matching logic
  // spa.routeMatch = function (routePattern, urlHash) {
  //   var rxParamMatcher = new RegExp(":[a-zA-Z0-9\\_\\-]+", "g")
  //     , routeMatcher = new RegExp(routePattern.replace(rxParamMatcher, '([\\w\\+\\-\\|\\.\\?]+)'))
  //     , _keysSrc = routePattern.match(rxParamMatcher)
  //     , _values  = urlHash.match(routeMatcher)
  //     , _matchResult = (_values && !_.isEmpty(_values))? _values.shift() : ""
  //     , _keys   = (_keysSrc && !_.isEmpty(_keysSrc))? _keysSrc.join(',').replace(/:/g,'').split(',') : []
  //     , _values = (_values && !_.isEmpty(_values))? _values.join(',').replace(/\?/g, '').split(',') : []
  //     , retValue = undefined;
  //   if (_matchResult) {
  //     retValue = {
  //       hkeys: _keysSrc
  //       , params: _.zipObject(_keys, _values)
  //     };
  //   }
  //   return (retValue);
  // };


  /* i18n support */
  spa.i18n = {};
  spa.i18n.loaded = false;
  spa.i18n.settings = {
    name: 'Language',
    path: 'language/',
    ext: '.txt',
    encoding: 'UTF-8',
    cache: true,
    async: true,
    mode: 'map',
    callback: null
  };
  spa.i18n.browserLang = function(){
    return (navigator)? (navigator.language || navigator.userLanguage || 'en_US') : 'en_US';
  };
  spa.i18n.setLanguage = function (lang, i18nSettings) {
    if ($.i18n) {
      $.i18n.map = {}; //empty dictionary before loading lang file
      lang = (lang || spa.i18n.browserLang()).replace(/-/g, "_");
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
          }
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

  function _setLang(uLang, options, isAuto) {
    if (uLang) {
      if (spa.i18n.onLangChange) {
        var fnOnLangChange = spa.i18n.onLangChange,
            nLang = (spa.is(fnOnLangChange,'function'))? fnOnLangChange.call(undefined, uLang, isAuto) : uLang;
        uLang = (spa.is(nLang, 'string'))? nLang : uLang;
      }
      $('html').attr('lang', uLang.replace('_', '-'));
      spa.i18n.setLanguage(uLang, _.merge({}, spa.defaults.lang, spa.findSafe(window, 'app.conf.lang', {}), spa.findSafe(window, 'app.lang', {}), (options||{}) ));
    }
  }
  spa.i18n.setLang = function(lang, i18nSettings){
    _setLang(lang, i18nSettings);
  };

  spa.i18n.value = function(i18nKey) {
    i18nKey = (''+i18nKey).replace(/i18n:/i, '').trim();
    if (i18nKey.beginsWithStrIgnoreCase('@')) {
      i18nKey = ((i18nKey.substr(1)).trim());
      i18nKey = spa.findSafe(window, i18nKey, i18nKey);
    }
    return _i18nValue(i18nKey);

    function _i18nValue(iKey){
      var retStr = iKey;
      try {
        retStr = (''+((!spa.i18n.loaded && window['Liferay'])? Liferay.Language.get(iKey) : $.i18n.prop(iKey))).trim();
        if (retStr.beginsWithStr('\\[') && retStr.endsWithStr(']')) {
          retStr = _stripEnds(retStr);
        }
      } catch(e){
        console.warn('i18n lookup error:' + e.stack);
      }
      return retStr;

      function _stripEnds(Str) {
        return Str.substring(1, Str.length-1);
      }
    }
  };

  spa.strBindData = function(xMsg, data, bStr, eStr){
    xMsg = (''+xMsg); bStr = bStr || '{'; eStr = eStr || '}';
    var varList = spa.extractStrBetweenEx(xMsg, bStr, eStr, true);
    if (xMsg && !spa.isBlank(varList) && spa.is(data, 'object')) {
      _.each(varList, function(key){
        xMsg = xMsg.replace((new RegExp(bStr+'\\s*('+(key.trim())+')\\s*'+eStr, 'g')), spa.findSafe(data, key, ''));
      });
    }
    return xMsg;
  };
  String.prototype.bindData = function (data) {
    return spa.strBindData(''+this, data);
  };

  spa.i18n.text = function (i18nKey, data) {
    var dMessage = spa.i18n.value(i18nKey);
    if (data && spa.is(data, 'object')) {
      var msgParamValue = "", msgParamValueTrim="";
      _.each(_.keys(data), function (key) {
        msgParamValue = ""+data[key]; msgParamValueTrim = msgParamValue.trim();
        if (msgParamValue && (msgParamValueTrim.beginsWithStrIgnoreCase("i18n:") || msgParamValueTrim.beginsWithStrIgnoreCase("@")) ) msgParamValue = spa.i18n.value(msgParamValueTrim);
        dMessage = dMessage.replace(new RegExp("{\\s*("+(key.trim())+")\\s*}", "g"), msgParamValue);
      });
    }

    var lookupKeys=[i18nKey], isDuplicateKey;
    function parseMessage( xMsg ){
      var varList = spa.extractStrBetweenEx(xMsg, '{', '}', true);
      if (!spa.isBlank(varList)) {
        _.each(varList, function(key){
          isDuplicateKey = (isDuplicateKey || lookupKeys.indexOf(key)>=0);
          if (!isDuplicateKey) {
            lookupKeys.push(key);
            xMsg = xMsg.replace((new RegExp('{\\s*('+(key.trim())+')\\s*}', 'g')), spa.i18n.value(key));
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
  };

  spa.i18n.update = function(elSelector, i18nKeySpec, apply){
    i18nKeySpec = i18nKeySpec || '';
    var $el = $(elSelector), oldSpec = $el.attr('data-i18n') || '', newSpec = '', oldSpecJSON, newSpecJSON;

    if (spa.isBlank(oldSpec) || (i18nKeySpec.indexOf(':')==0) || (i18nKeySpec.indexOf('=')==0) || ((oldSpec.indexOf(':')<=0) && (i18nKeySpec.indexOf(':')<=0)) ) {
      newSpec = i18nKeySpec.trimLeftStr(':').trimLeftStr('=');
    } else {
      oldSpecJSON = (oldSpec.indexOf(':')>0)?     spa.toJSON(oldSpec||{})     : {html: (oldSpec.trimLeftStr(':').replace(/'/g,'')) };
      newSpecJSON = (i18nKeySpec.indexOf(':')>0)? spa.toJSON(i18nKeySpec||{}) : {html: (i18nKeySpec.trimLeftStr(':').replace(/'/g,'')) };

      _.each(Object.keys(oldSpecJSON), function(key){
        _.each(key.split('_'), function(sKey){
          if (sKey) oldSpecJSON[sKey] = oldSpecJSON[key];
        });
      });
      _.each(Object.keys(newSpecJSON), function(key){
        _.each(key.split('_'), function(sKey){
          if (sKey) newSpecJSON[sKey] = newSpecJSON[key];
        });
      });

      var finalSpec = _.merge({}, oldSpecJSON, newSpecJSON);
      _.each(Object.keys(finalSpec), function(key){
        if (key.indexOf('_')<=0){
          newSpec += key+":'"+(finalSpec[key])+"',";
        }
      });
      newSpec = newSpec.trimRightStr(',');
    }

    $el.attr('data-i18n', newSpec).data('i18n', newSpec);
    if (apply || spa.is(apply, 'undefined')) spa.i18n.apply(elSelector);
    return $el;
  };

  spa.i18n.apply = spa.i18n.render = function (contextRoot, elSelector) {
    if (spa.i18n.loaded || window['Liferay']) {
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
        var i18nSpec = spa.toJSON(i18nSpecStr || "{}"),
            i18nData = i18nSpec['data'] || i18nSpec['i18ndata'];
        if (i18nData) {
          delete i18nSpec['data'];
          delete i18nSpec['i18ndata'];
        } else {
          i18nData = spa.toJSON($el.data("i18nData") || "{}");
        }
        if (i18nSpec && !$.isEmptyObject(i18nSpec)) {
          _.each(_.keys(i18nSpec), function (attrSpec) {
            var i18nKey = i18nSpec[attrSpec];
            var i18nValue = spa.i18n.text(i18nKey, i18nData); //$.i18n.prop(i18nKey);
            _.each(attrSpec.split("_"), function (attribute) {
              switch (attribute.toLowerCase()) {
                case "html":
                  $el.html( spa.sanitizeXSS(i18nValue) );
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
    }

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

  function _pipeSort(inVal, reverse) {
    var retValue = inVal;
    if (spa.is(inVal, 'array')) {
      retValue = inVal.sort();
      if (reverse) retValue = retValue.reverse();
    } else if (spa.is(inVal, 'string')) {
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

  spa.pipes = {
    trim: function(str) {
      return (''+str).trim();
    },
    trimLeft: function(str) {
      return (''+str).trimLeftStr();
    },
    trimRight: function(str) {
      return (''+str).trimRightStr();
    },
    normalize: function(str) {
      return (''+str).normalizeStr();
    },
    toLowerCase: function(str) {
      return (''+str).toLowerCase();
    },
    toUpperCase: function(str) {
      return (''+str).toUpperCase();
    },
    toTitleCase: function(str) {
      return (''+str).toTitleCase();
    },
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
      if (spa.is(inVal, 'array')) {
        retValue = inVal.reverse();
      } else if (spa.is(inVal, 'string')) {
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
            elAttr = '$';
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
        elAttr = '$';
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

  spa.dataBind = spa.bindData = function (contextRoot, data, elFilter, skipBindCallback) {
    //console.log('spaBind>', arguments);
    contextRoot = contextRoot || 'body';
    elFilter = elFilter || '';

    var $contextRoot, onVirtualDOM = (spa.is(contextRoot, 'string') && (/\s*</).test(contextRoot)), blockedScriptTagName;
    if (onVirtualDOM) {
      blockedScriptTagName = '_BlockedScriptInTemplate_';
      var bindTmplHtml = contextRoot.replace(/<\s*script/gi,'<'+blockedScriptTagName)
                                    .replace(/<\s*(\/)\s*script/gi,'</'+blockedScriptTagName);
      $contextRoot = $('<div style="display:none">'+bindTmplHtml+'</div>');
    } else {
      $contextRoot = $(contextRoot);
    }

    if (spa.isBlank(data)) {
      return $contextRoot;
    }

    var compName = ''; //pre-render-time
    if (elFilter[0]=='$') { compName = elFilter.substr(1).trim(); elFilter = ''; }
    compName = compName || $contextRoot.attr('data-rendered-component');
    var tmplStoreName = compName || '_unknown_';
    //console.log('compName>', tmplStoreName);

    var templateData = _.merge({__computed__:{}}, data);
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
      return (key[0] == '#')? key : spa.findSafe(templateData, key);
    }

    function _templateDynId(type, key) {
      return ['_runTimeTemplate',type,compName,(key.replace(/[^a-z0-9]/gi,'_')),(spa.now())].join('_');
    }
    function _inlineTemplate(templateId, template) {
      if (!spa.compiledTemplates4DataBind.hasOwnProperty(tmplStoreName)) {
        spa.compiledTemplates4DataBind[tmplStoreName] = {};
      }
      return spa.compiledTemplates4DataBind[tmplStoreName][templateId] = (Handlebars.compile( _unmaskHandlebars(template) ));
    }

    _.each($dataBindEls, function(el) {
      $el = $(el);
      bindSpecStr = $el.data('bind') || '';

      if ((bindSpecStr) && (!bindSpecStr.containsStr(':'))) bindSpecStr = _defaultAttr(el)+":'"+bindSpecStr+"'";
      bindSpec = spa.toJSON(bindSpecStr || '{}');
      bindCallback = spa.renderUtils.getFn($el.attr('data-bind-callback') || '');

      if (bindSpec && !$.isEmptyObject(bindSpec)) {

        _.each(_.keys(bindSpec), function (attrSpec) {
          bindKeyFn = (bindSpec[attrSpec]+'|').split('|');
          bindKey   = bindKeyFn.shift().trim();
          negate    = (bindKey[0]=='!');
          if (negate) {
            bindKey   = (bindKey.substr(1).trim());
            bindValue = !_getValue(bindKey);
          } else {
            bindValue = _getValue(bindKey);
          }

          if (spa.is(bindValue, 'undefined|null')) bindValue = '';

          for (var fIdx=0; fIdx<bindKeyFn.length; fIdx++){
            fnFormat = bindKeyFn[fIdx].trim();
            if (fnFormat) {
              if (fnFormat[0]=='.') fnFormat = 'spa.pipes'+fnFormat;
              if (fnFormat[0]=='!') {
                if (fnFormat == '!') {
                  bindValue = !bindValue;
                } else {
                  fnFormat = fnFormat.substr(1).trim();
                  if (fnFormat[0]=='.') fnFormat = 'spa.pipes'+fnFormat;
                  bindValue = !spa.renderUtils.runCallbackFn(fnFormat, ['(...)', bindValue, bindKey, templateData, el], el);
                }
              } else {
                bindValue = spa.renderUtils.runCallbackFn(fnFormat, ['(...)', bindValue, bindKey, templateData, el], el);
              }
            }
          }

          _.each(attrSpec.split("_"), function (attribute) {
            var computedKey='';
            attribute = attribute.trim();
            //console.log('[',attribute,']',bindKey,'=',bindValue);
            if (!spa.is(bindValue, 'undefined')) {
              switch (attribute.toLowerCase()) {
                case 'html':
                  $el.html( spa.sanitizeXSS(bindValue) );
                  break;
                case 'text':
                  $el.text(bindValue);
                  break;
                case '$':
                  if ((/checkbox|radio/i).test(el.type)) {
                    switch (spa.of(bindValue)){
                      case 'boolean':
                        el.checked = bindValue;
                        break;
                      default:
                        el.checked = (el.value).equalsIgnoreCase(''+bindValue);
                        break;
                    }
                    if (el.checked) {
                      el.setAttribute('checked', '');
                    } else {
                      el.removeAttribute('checked');
                    }

                  } else if ((/select/i).test(el.tagName)) {
                    console.warn('TODO: data-bind:select');
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
                    ifTemplate = spa.compiledTemplates4DataBind[tmplStoreName][ifTemplateId];
                  }
                  $el.html( ifTemplate(templateData) );
                  break;

                case 'repeat':
                  computedKey = bindKey.replace(/[^a-z0-9]/gi,'_');
                  templateData.__computed__[computedKey] = bindValue;
                  var repeatTemplateId = $el.attr('data-bind-template'), repeatTemplate;
                  if (!repeatTemplateId) { //create new repeat template
                    var repeatAs = (bindSpec['repeatAs'] || '').replace(/[,|:]/g,' ').normalizeStr()
                      , repeatTemplateBody = '{{#each __computed__.'+ computedKey + (repeatAs? (' as |'+repeatAs+'|') : '') +' }}'
                                            + ($el.html().trim()) + '{{/each}}';
                    repeatTemplateId = _templateDynId('repeat', bindKey);
                    repeatTemplate   = _inlineTemplate(repeatTemplateId, repeatTemplateBody);
                    $el.attr('data-bind-template', repeatTemplateId);
                  } else {
                    repeatTemplate = spa.compiledTemplates4DataBind[tmplStoreName][repeatTemplateId];
                  }
                  $el.html( repeatTemplate(templateData) );
                  break;
                case 'repeatAs':break;

                default:
                  switch(true){
                    case (/^\./.test(attribute)): //Class
                    var classNames = attribute.replace(/[\.\,]/g, ' ').normalizeStr();
                    $el[!!bindValue? 'addClass':'removeClass'](classNames);
                    break;

                    default:
                      $el.attr(attribute, bindValue);
                      if (attribute.beginsWithStr('data-')) {
                        dataAttrKey = spa.dotToCamelCase(attribute.getRightStr('-').replace(/-/g,'.'));
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
      if (!spa.isBlank(componentName)) {
        var onBindCallback = 'app.'+componentName+'.bindCallback';
        spa.renderUtils.runCallbackFn(onBindCallback, templateData, app[componentName]);
      }
    }

    if (!onVirtualDOM) {
      //innerComponents
      var $innerComponents = $contextRoot.find('[data-rendered-component]')
                              .filter(function(){
                                return (this.hasAttribute('data-spa-component-$data') ||
                                        this.hasAttribute('data-spa-$data') ||
                                        this.hasAttribute('spa-$data'));
                              });
      if ($innerComponents.length) {
        //console.log('found inner components to bind with this data ref', $innerComponents);
        var data4InnerCompBind;
        $innerComponents.each(function(){
          data4InnerCompBind = _get$dataInAttr(this, compName, data);
          //console.log('data4InnerCompBind>', data4InnerCompBind);
          spa.bindData(this, data4InnerCompBind);
        });
      }
    }

    templateData = null;
    return onVirtualDOM? ($contextRoot.html().replace((new RegExp(blockedScriptTagName, 'g')), "script")) : $contextRoot;
  };

  spa.bindTemplateData = function (xTemplate, data) {
    var xContent = xTemplate;
    if ((/^\s*#[a-z]+/i).test(xTemplate)) {
      xContent = $(xTemplate).html();
    }

    if (spa.isBlank(data)) {
      return xContent;
    }

    if ((/ data-bind\s*=/i).test(xContent)) {
      xContent = spa.bindData(xTemplate, data);
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

  spa.togglePassword = function(elPwd){
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

  spa.initTogglePassword = function(scope){
    $(scope||'body').find('.toggle-password').each(function(idx, elPwd) {
      spa.console.info('Initializing toggle password', elPwd);
      spa.togglePassword(elPwd);
    });
  };

  spa.isElValueChanged = function(elSelector){
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
  spa.resetElDefaultValue = function(elSelector){
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

  spa.updateTrackFormCtrls = function(elForm){
    if (elForm) {
      var $elForm             = $(elForm),
          changedElcount      = $elForm.find('.tracking-change.changed').length,
          validationResult    = spa.validateForm('#'+$elForm.attr('id')),
          isValidForm         = (spa.isBlank(validationResult) || (validationResult[0]['errcode']==1) ),
          validationErrFound  = ( !isValidForm || $elForm.find('.validation-error,.validation-pending').length),
          enableCtrlEls4Ch    = (changedElcount>0 && !validationErrFound),
          enableCtrlEls4Valid = (!validationErrFound),
          $ctrlElements       = $elForm.find('.ctrl-on-change,.ctrl-on-validate'), $ctrlEl, enableCtrlEls, fnOnBeforeChange, fn2Run;
      $elForm.attr('data-changed', changedElcount).data('changed', changedElcount);

      $ctrlElements.each(function(i, el){
        $ctrlEl = $(el);
        enableCtrlEls = $ctrlEl.hasClass('ctrl-on-change')? enableCtrlEls4Ch : enableCtrlEls4Valid;
        fnOnBeforeChange = $ctrlEl.attr('onBeforeChange');
        if (!spa.isBlank(fnOnBeforeChange)) {
          if (fnOnBeforeChange.indexOf('(')>0) fnOnBeforeChange = fnOnBeforeChange.getLeftStr('(');
          fn2Run = spa.findSafe(window, (fnOnBeforeChange.trim()), undefined);
          enableCtrlEls = spa.is(fn2Run, 'function')? (!!fn2Run.call(el, enableCtrlEls)) : enableCtrlEls;
        }

        if ($ctrlEl.is(':disabled') == enableCtrlEls) {
          $ctrlEl.prop('disabled',!enableCtrlEls).addClass(enableCtrlEls?'':'disabled').removeClass(enableCtrlEls?'disabled':'');
          $ctrlEl.trigger('change');
        }
      });
    }
  };

  spa.trackFormElChange = function _trackFormElChange(elSelector, scope){
    var $elementsToTrack = $(scope||'body').find(elSelector);

    $elementsToTrack.each(function(idx, el){
      if ('FORM' == el.tagName.toUpperCase()) {
        spa.trackFormElChange(($(el).find('.track-change').length? '.track-change':'input,textarea,select'), el);
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
        spa.updateTrackFormCtrls($thisForm);
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
      spa.updateTrackFormCtrls($el.closest('form'));

      if (el.className.indexOf('tracking-change') < 0) {
        $el.addClass('tracking-change').on(trackEvents, eTrackChange);
      }
      return true;
    }
  };

  spa.initTrackFormElChanges = function(scope){
    $(scope||'body').find('form.track-changes,form:has(.ctrl-on-change,.track-change)').each(function(idx, formEl){
      spa.console.info('Initializing Form Elements Track: Form ['+ (formEl['id'] || formEl['name']) +']');
      spa.trackFormElChange(formEl);
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
    $.extend(fillOptions, options);

    if (!ready2Fill) { //make Ajax call to load remote data and apply....

      /*wait till this data loads*/
      $.ajax({
        url: data,
        method: (''+(fillOptions.method || 'GET')).toUpperCase(),
        data: fillOptions.dataParams,
        cache: fillOptions.dataCache,
        async: fillOptions.async,
        dataType: "text",
        success: function (result) {
          data = spa.toJSON(''+result);
          ready2Fill = ((typeof data) == "object");
          _fillData();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          spa.console.error("Failed loading data from [" + data + "]. [" + textStatus + ":" + errorThrown + "]");
          if ( spa.is(app.api['onError'], 'function') ) {
            app.api.onError.call(this, jqXHR, textStatus, errorThrown);
          } else {
            spa.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
          }
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
              $(el).html( spa.sanitizeXSS(dataValue) );
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
  var _$dataWatchList = {};
  spa.env = '';
  spa.compiledTemplates4DataBind={};
  spa.compiledTemplates={};
  spa.viewModels = {};
  spa.renderHistory = {};
  spa.renderHistoryMax = 0;
  spa.components = {};
  spa.tempBind$data = {};
  spa.defaults = {
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
        if (spa.is(oNewValues,'object')) {
          if (oNewValues.hasOwnProperty('set')) delete oNewValues['set'];
          _.merge(this, oNewValues);
        } else if (typeof oNewValues == 'string') {
          if (oNewValues == 'components.extend$data') {
            spa.defaults.components.extend$data = newValue;
          } else {
            spa.setSimpleObjProperty(this, oNewValues, newValue);
          }
        }
        return this;
      }
  };

  function _adjustComponentOptions(componentName, options){
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
        var xTmplUrlPath = (options['templateUrl'] || '').trim();
        if (xTmplUrlPath) {
          if ( (/^(\.\/)/).test(xTmplUrlPath) )  { //beginsWith ./
            var isChildComponent = (/[^a-z0-9]/gi).test(componentName); //childComponentIndicator
            var _cFldrPath   = spa.defaults.components.rootPath+ ((spa.defaults.components.inFolder || isChildComponent)? ((componentName.replace(/[^a-z0-9]/gi, '/')) +"/"): '');
            xTmplUrlPath = _cFldrPath+xTmplUrlPath.substr(2);
          }
          // if  (!((/(\.([a-z])+)$/i).test(xTmplUrlPath))) { //if no extension set default
          //   xTmplUrlPath += spa.defaults.components.templateExt;
          // }
        }
        options['template'] = xTmplUrlPath;
      }
    }

    if (options && _.isObject(options) && !spa.hasPrimaryKeys(options, 'data|dataUrl') && spa.hasPrimaryKeys(spa.api.urls, '$'+componentName)){
      options['dataUrl'] = '@$'+componentName;
    }

    spa.console.log('$ Adj.Options>>>>',componentName, options? options.__now() : options);
    return options;
  }

  var reservedCompNames = 'api,debug,lang';
  spa.component = spa.$ = spa.registerComponent = function(componentNameFull, options) {
    var req2Create = !!options, componentName = componentNameFull;
    options = options || {};

    if (!componentNameFull) {
      console.error('Missing ComponentName to register.');
      return;
    }

    if (_is(componentNameFull, 'object')) {
      options = _.merge({}, componentNameFull);
      componentNameFull = options['name'] || options['componentName'] || ('spaComponent'+spa.now());
      options['componentName'] = componentNameFull;
      componentName = componentNameFull;
    }

    if (!_is(componentName, 'string')) {
      console.error('Invalid ComponentName:', componentName);
      return;
    }
    if (reservedCompNames.indexOf(componentName)>=0) {
      console.error('Invalid component name '+componentName+'. Cannot create Reserved components:'+ (reservedCompNames.join()) );
      return;
    }

    if (is(componentName, 'string') && componentName) {
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

          if (spa.components[componentName]) {
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
            spa.loadComponents(options['require'], function(){
              spa.console.log('Required components successfully loaded.');
            }, function(){
              spa.console.log('Failed to load required components.');
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
          var baseProperties = _.merge({}, options);
          _.each(baseProps, function(baseProp){
            delete options[baseProp];
          });
          if (is(options['renderCallback'], 'string')) { delete options['renderCallback']; }
          _.each(Object.keys(options), function(xKey){
            delete baseProperties[xKey];
          });
          baseProperties['renderCallback'] = 'app.'+componentName+'.renderCallback';

          spa.components[componentName] = baseProperties;
          spa.extendComponent(componentNameFull, options);

        } else {
          //Req to get DOM
          var elSelector, $retDOM, compIndex=-1;
          if (componentName.indexOf(' ')>0) {
            elSelector    = componentName.getRightStr(' ').trim();
            componentName = componentName.getLeftStr(' ');
          }

          if (componentName.indexOf(':')>0) {
            compIndex = spa.toInt(componentName.getRightStr(':').trim());
            componentName = componentName.getLeftStr(':');
          }

          componentName = componentName.replace(/[^a-z0-9]/gi, '_');
          if (!spa.components[componentName]) {
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

  /* spa.registerComponents( 'compName1' );
   * spa.registerComponents( 'compName1,compName2' );
   * spa.registerComponents( 'compName1', 'compName2', 'compName3' );
   * spa.registerComponents( ['compName1', 'compName2', 'compName3'] );
   * spa.registerComponents( { compName1: {baseProps}, compName2: {baseProps} } );
   */
  spa.$$ = spa.registerComponents = function() {
    if (arguments.length){
      var compList = arguments;                //spa.registerComponents('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_.isArray(arguments[0])) {         //spa.registerComponents(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_.isString(arguments[0])) { //spa.registerComponents('compName1') | spa.registerComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             // spa.registerComponents( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }
      if (spa.is(compList, 'object')) {
        _.each(Object.keys(compList), function(compName){
          spa.console.info('Registering spa-component:['+compName+']');
          spa.registerComponent(compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _.each(compList, function(compName){
          spa.console.info('Registering spa-component:['+compName+']');
          spa.registerComponent(compName.trim());
        });
      }
    }
  };

  spa.extendComponent = spa.$extend = spa.module = function(componentName, options) {
    options = options || {};
    if (!componentName) {
      console.error('Missing ComponentName to extend.');
      return;
    }

    if (is(componentName, 'object')) {
      options = _.merge({}, componentName);
      componentName = options['name'] || options['componentName'] || ('spaComponent'+spa.now());
      options['componentName'] = componentName;
    }

    if (is(componentName, 'string') && componentName) {
      componentName = componentName.trim();
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
        window.app[componentName] = window.app[componentName] || {};
        if (options && _.isFunction(options)) {
          options = options.call(spa.components[componentName] || {});
        }
        options = spa.is(options, 'object')? options : {};
        if (!spa.components[componentName]) spa.components[componentName] = {componentName: componentName, beforeRender: 'app.'+componentName+'.onRender', renderCallback: 'app.'+componentName+'.renderCallback'};
        if (spa.components[componentName]) {
          if (options['__prop__']) {
            _.merge(spa.components[componentName], $.extend({},options['__prop__']));
          }
          options['__prop__'] = spa.components[componentName];
        }
        $.extend(window.app[componentName], options);
        window['$$'+componentName] = window.app[componentName];
      }
    } else {
      console.error('Invalid ComponentName:', componentName);
      return;
    }
  };

  /* spa.extendComponents( 'compName1' );
   * spa.extendComponents( 'compName1,compName2' );
   * spa.extendComponents( 'compName1', 'compName2', 'compName3' );
   * spa.extendComponents( ['compName1', 'compName2', 'compName3'] );
   * spa.extendComponents( { compName1: {baseProps}, compName2: {baseProps} } );
   */
  spa.extendComponents = spa.$$extend = function() {
    if (arguments.length){
      var compList = arguments;                //spa.extendComponents('compName1', 'compName2', 'compName3');
      if (arguments.length == 1) {
        if (_.isArray(arguments[0])) {         //spa.extendComponents(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_.isString(arguments[0])) { //spa.extendComponents('compName1') | spa.registerComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             //spa.extendComponents( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }
      if (spa.is(compList, 'object')) {
        _.each(Object.keys(compList), function(compName){
          spa.console.info('Extend spa-component:['+compName+']');
          spa.extendComponent(compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _.each(compList, function(compName){
          spa.console.info('Extend spa-component:['+compName+']');
          spa.extendComponent(compName.trim());
        });
      }
    }
  };

  spa.$bind = function(cName, newData) {
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (spa.isBlank(newData)) {
      newData = spa.findSafe(app, cName+'.$data', {});
    }
    spa.$(cName).spaBindData(newData);
  };

  spa.$data = function(cName, newData, mode){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    var retData;
    cName = (cName || '').trim();
    mode = mode || 'update';

    function update$data(data){
      if (spa.is(data, 'object')) {
        if (['update', 'merge'].__has(mode, 'i')) {
          _.merge(app[cName].$data, data);
        } else if (['*','reset','replace','overwrite'].__has(mode, 'i')) {
          app[cName].$data = data;
        }
      }
      app[cName]['is$DataUpdated'] = spa.components[cName]['is$DataUpdated'] = true;
      return app[cName].$data;
    }

    if (cName) {
      if (app.hasOwnProperty(cName)) {
        retData = spa.findSafe(app, cName+'.$data');
        if (newData) {
          retData = update$data( (spa.is(newData, 'function'))? newData.call(app[cName], app[cName].$data) : newData );

          var $component = spa.$(cName);
          if ($component.is(':visible')) {
            var _$prop = spa.components[cName]
              , _$dataCache = _$prop['dataCache']
              , _on$dataChange = (_$prop['on$dataChange']||'').trim().toLowerCase();
            if (_$dataCache && _on$dataChange && (['render','refresh','bind'].__has(_on$dataChange))) {
              spa.console.log(cName+'$'+_on$dataChange+' on $data update ...');
              spa['$'+_on$dataChange](cName);
            }
            spa.renderUtils.runCallbackFn('app.'+cName+'.$dataChangeCallback', app[cName].$data, app[cName]);
          } else {
            console.log('Component is not visible! Skipped $on$dataChange.');
          }

          spa.$dataNotify(cName);
        }
      } else {
        spa.console.warn('SPA Component[',cName,'] is not loaded.');
      }
    }

    return retData;
  };

  spa.$dataWatch = function(cName, watchName, fnCallback){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (!cName || !watchName || !spa.is(fnCallback, 'function')) return;

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
  spa.$dataUnwatch = function(cName, watchName){
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
  spa.$dataNotify = function(cName, watchName){
    cName = String(cName).replace(/[^a-z0-9]/gi, '_');
    if (!cName) return;

    if (_$dataWatchList.hasOwnProperty(cName)) {
      var notifyList = Object.keys(_$dataWatchList[cName]);
      if (watchName) {
        notifyList = watchName.split(',');
      }
      _.each(notifyList, function(xWatchName){
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
      app[componentName]['__renderCount__'] = spa.toInt(spa.$renderCount(componentName)) + 1;
    }
  }
  spa.$renderCount = function(componentName){
    return spa.findSafe(window, 'app.'+(String(componentName).replace(/[^a-z0-9]/gi, '_'))+'.__renderCount__', 0);
  };

  spa.removeComponent = function (componentName, byComp) {
    var ok2Remove;
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (byComp) {
      byComp = (componentName==byComp)? '_self_' : byComp;
    }

    function isOk2Remove$(cName){
      cName = String(cName).replace(/[^a-z0-9]/gi, '_').trim();
      var ok2Remove$ = spa.isBlank(cName), _fnOnRemoveCompRes;
      if (!ok2Remove$) {
        _fnOnRemoveCompRes = spa.renderUtils.runCallbackFn(('app.'+cName+'.onRemove'), (byComp || '_script_'), app[cName]);
        ok2Remove$ = (spa.is(_fnOnRemoveCompRes, 'undefined') || (spa.is(_fnOnRemoveCompRes, 'boolean') && _fnOnRemoveCompRes));
        if (!ok2Remove$) {
          spa.console.warn('Remove $'+cName+' request denied onRemove()');
        }
      }
      return ok2Remove$;
    }

    if (componentName) {
      var $componentContainer = $('[data-rendered-component="'+(componentName)+'"]');
      if ($componentContainer.length) {
        var childComponents = $componentContainer.find('[data-rendered-component]').map(function(){ return $(this).attr('data-rendered-component'); })
          , isChildRemoved = ((childComponents.length==0) || _.every(childComponents, function(cName){return isOk2Remove$(cName); }));
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
    return (spa.is(ok2Remove, 'boolean') && ok2Remove);
  };
  spa.destroyComponent = function (componentName) {
    var isDestroyed;
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      if ( spa.removeComponent(componentName) ) {
        delete app[componentName];
        if (spa.components[componentName]) {
          var tmplScriptId = spa.findSafe(spa.components[componentName], 'template', '');
          if (tmplScriptId && !tmplScriptId.beginsWithStr('#')) {
            tmplScriptId = "#__tmpl_" + ((''+tmplScriptId).replace(/[^a-z0-9]/gi,'_'));
          }
          $('script'+tmplScriptId).remove();
          delete spa.components[componentName];
          delete spa.compiledTemplates4DataBind[componentName];
          delete spa.compiledTemplates[componentName];
          delete _$dataWatchList[componentName];
          isDestroyed = true;
        }
      }
    }
    return isDestroyed;
  };
  spa.showComponent = function (componentPath, options) {
    var componentName = (componentPath || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      var $componentContainer = $('[data-rendered-component="'+componentName+'"]');
      if ($componentContainer.length) {
        $componentContainer.show();
      } else {
        spa.$render(componentPath, options);
      }
    }
  };
  spa.hideComponent = function (componentName) {
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      $('[data-rendered-component="'+componentName+'"]').hide();
    }
  };
  spa.disableComponent = function (componentName) {
    componentName = (componentName || '').replace(/[^a-z0-9]/gi, '_').trim();
    if (componentName) {
      $('[data-rendered-component="'+componentName+'"]').css('pointer-events', 'none').addClass('disabled').attr('disabled', 'disabled');
    }
  };
  spa.enableComponent = function (componentName) {
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
        if (_.isArray(arguments[0])) { //(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_.isString(arguments[0])) { //('compName1') | ('compName1,compName2');
          compList = arguments[0].split(',');
        }
      }
      spa.console.log(compList);
      if (compList && compList.length) {
        _.each(compList, function(compName){
          spa.console.info(actionName+' spa-component:['+compName.trim()+']');
          spa[actionName](compName.trim());
        });
      }
    }
  }
  spa.removeComponents = spa.$remove = spa.$$remove = function () {
    _spaComponentOp.apply({action: 'removeComponent'}, arguments);
  };
  spa.destroyComponents = spa.$destroy = spa.$$destroy = function () {
    _spaComponentOp.apply({action: 'destroyComponent'}, arguments);
  };
  spa.showComponents = spa.$show = spa.$$show = function () {
    _spaComponentOp.apply({action: 'showComponent'}, arguments);
  };
  spa.hideComponents = spa.$hide = spa.$$hide = function () {
    _spaComponentOp.apply({action: 'hideComponent'}, arguments);
  };
  spa.enableComponents = spa.$enable = spa.$$enable = function () {
    _spaComponentOp.apply({action: 'enableComponent'}, arguments);
  };
  spa.disableComponents = spa.$disable = spa.$$disable = function () {
    _spaComponentOp.apply({action: 'disableComponent'}, arguments);
  };

  //////////////////////////////////////////////////////////////////////////////////
  spa.refreshComponent = spa.$refresh = function (componentName, options) {
    if (!componentName) return;
    options = options || {};
    if (!spa.is(options, 'object')) return;

    if (!options.hasOwnProperty('beforeRender')) {
      options['beforeRender'] = options['beforeRefresh'] || ('app.'+(componentName.replace(/[^a-z0-9]/gi, '_'))+'.onRefresh');
    }
    if (!options.hasOwnProperty('renderCallback')) {
      options['renderCallback'] = options['refreshCallback'] || ('app.'+(componentName.replace(/[^a-z0-9]/gi, '_'))+'.refreshCallback');
    }
    options['isRefreshCall'] = true;

    spa.console.info('Calling refreshComponent: '+componentName+' with below options');
    spa.console.info(options);
    spa.$render(componentName, options);
  };
  //////////////////////////////////////////////////////////////////////////////////
  spa.renderComponent = spa.$render = function (componentNameFull, options) {
    options = options || {};
    if (!componentNameFull) {
      console.error('Missing ComponentName to render.');
      return;
    }

    var componentName = componentNameFull;

    if (is(componentNameFull, 'object')) {
      options = _.merge({}, componentNameFull);
      componentNameFull = options['name'] || options['componentName'] || ('spaComponent'+spa.now());
      options['componentName'] = componentNameFull;
      componentName = componentNameFull;
    }

    var isReq4SpaComponent = !options['_reqFrTag_'];
    if (_is(componentNameFull, 'string')) {
      componentNameFull = componentNameFull.trim();
      if (componentNameFull[0] == '$') {
        isReq4SpaComponent = true;
      }
    } else {
      console.error('Invalid ComponentName:', componentNameFull);
      return;
    }

    if ( (!(options && is(options, 'object') && options['isRefreshCall'])) && spa.$renderCount(componentName) && spa.findSafe(window, 'app.'+componentName+'.refreshCallback', '')){
      spa.console.info('Component ['+componentNameFull+'] has been rendered already. Refreshing instead of re-render.');
      spa.refreshComponent(componentName, options);
      return;
    }

    spa.console.info('Called renderComponent: '+componentNameFull+' with options', options);

    var isServerComponent = (!isReq4SpaComponent && (/[^a-z0-9]/ig).test( componentName ));
    if (isServerComponent){
      var componentUrl = componentName, urlKey;
      if (componentName[0] === spa.api.urlKeyIndicator) {
        urlKey = componentName.trimLeftStr(spa.api.urlKeyIndicator);
        componentUrl = spa.api.urls[urlKey] || '';
      }
      options['componentUrl'] = componentUrl;
      spa.console.info('Called to render ServerComponent: ['+componentName+'] with options', options);

      if (urlKey && !componentUrl) {
        console.warn('ComponentURL undefined: app.api.urls.'+urlKey);
      }

      if (componentUrl) {
        var xTargetEl     = options['targetEl']
          , xUrlHeaders   = __finalValue(spa.toJSON(options['urlHeaders']), options)
          , xUrlParams    = __finalValue(spa.toJSON(options['urlParams']), options)
          , xUrlPayload   = __finalValue(spa.toJSON(options['urlPayload']), options)
          , xUrlMethod    = (options['urlMethod'] || 'GET').toLowerCase()
          , xUrlCache     = (String(options['urlCache'] || 'false').toLowerCase() !== 'false')
          , xUrl          = spa.api.url(componentUrl, xUrlParams)
          , xUrlError     = __finalValue(options['urlError']);

        spa.console.log('Loading ServerComponent ...');

        spa.api[xUrlMethod](xUrl, xUrlPayload
          , function _onSuccess(xContent) {
              $(xTargetEl).html(xContent);
              spa.renderComponentsInHtml(xTargetEl);
            }
          , function _onFail(jqXHR, textStatus, errorThrown) {
              if (this.onError && _is(this.onError, 'function')) {
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
    var isChildComponent = (/[^a-z0-9]/gi).test(componentNameFull); //childComponentIndicator
    if (isChildComponent) {
      componentName = componentNameFull.replace(/[\s\$]/g, '').replace(/[^a-z0-9]/gi, '_');
    }

    var tmplId = '_rtt_'+componentName, tmplBody = '';

    options = _adjustComponentOptions(componentName, options);

    var componentPath = isChildComponent? componentName.replace(/[^a-z0-9]/gi, '/') : componentName;
    var componentFileName = componentName;
    if (isChildComponent) {
      var componentNameSplit = componentName.split('_');
      componentFileName = componentNameSplit[componentNameSplit.length-1];
    }

    var _cFldrPath   = spa.defaults.components.rootPath+ ((spa.defaults.components.inFolder || isChildComponent)? (componentPath+"/"): '')
      , _cFilesPath  = _cFldrPath+componentFileName
      , _cTmplFile   = _cFilesPath+spa.defaults.components.templateExt
      , _cScriptExt  = spa.defaults.components.scriptExt
      , _cScriptFile = (options && _.isObject(options) && options.hasOwnProperty('script'))? options['script'] : ((_cScriptExt)? (_cFilesPath+_cScriptExt) : '')
      , _renderComp  = function(){
          spa.console.info('_renderComp: '+componentName+' with below options');
          spa.console.info(options);
          if (!spa.components[componentName].hasOwnProperty('template')) {
            if (spa.components[componentName].hasOwnProperty('templateStr') || spa.components[componentName].hasOwnProperty('templateString')) {
              tmplBody = spa.components[componentName]['templateStr'] || spa.components[componentName]['templateString'] || '';
              spa.updateTemplateScript(tmplId, tmplBody);
              spa.components[componentName]['template'] = '#'+tmplId;
            } else  if (spa.hasPrimaryKeys(spa.components[componentName], 'templateUrl')) {
              var xTmplUrlPath = (spa.components[componentName]['templateUrl'] || '').trim();
              if (xTmplUrlPath) {
                if ( (/^(\.\/)/).test(xTmplUrlPath) )  { //beginsWith ./
                  xTmplUrlPath = _cFldrPath+xTmplUrlPath.substr(2);
                }
                // if  (!((/(\.([a-z])+)$/i).test(xTmplUrlPath))) { //if no file extension, set default
                //   xTmplUrlPath += spa.defaults.components.templateExt;
                // }
              }
              spa.components[componentName]['template'] = xTmplUrlPath;
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

          if (renderOptions.hasOwnProperty('style') && spa.is(renderOptions.style, 'string')) {
            renderOptions['dataStyles'] = {};
            renderOptions['dataStyles'][componentName+'Style'] = (renderOptions.style=='.' || renderOptions.style=='$')? (_cFilesPath+'.css') : (((/^(\.\/)/).test(renderOptions.style))? (_cFldrPath+(renderOptions.style).substr(2)) : (renderOptions.style));
            delete renderOptions['style'];
            spa.console.info('Using component style for ['+componentName+']');
            spa.console.info(renderOptions);
          }

          if (renderOptions && _.isObject(renderOptions) && renderOptions['dataCache']) {
            var $data = spa.findSafe(app, componentName+'.$data', {});
            if (spa.isBlank($data)) {
              renderOptions['dataCache'] = false;
              spa.console.log('dataCache:false; Using/Ajaxing new data ...');
            } else {
              renderOptions['data'] = $data;
              renderOptions['dataProcess'] = false;
              spa.console.log('dataCache:true; Using $data and ingored data + dataProcess ...');
            }
          }

          spa.render(renderOptions);
        }
      , _parseComp = function(){
          if (_cScriptFile) {
            spa.console.info('Loaded component ['+componentName+'] source from ['+_cScriptFile+']');
          } else {
            spa.console.info('Skipped Loading component ['+componentName+'] source from script file.');
          }
          spa.console.info('In Source> spa.components['+componentName+']');
          spa.console.info(spa.components[componentName]);
          if (!spa.components.hasOwnProperty(componentName)) {
            spa.console.warn('spa.components['+componentName+'] NOT DEFINED in ['+ (_cScriptFile || 'spa.components') +']. Creating *NEW*');
            if (spa.isBlank(options)) options = {};
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
      //load component's base prop from .(min.)js
      if (_cScriptFile) {
        spa.console.info("Attempt to load component ["+componentNameFull+"]'s properties from ["+_cScriptFile+"]"); //1st load from server
        $.cachedScript(_cScriptFile, {spaComponent:componentPath, dataType:'spaComponent', success:_parseComp, cache:spa.defaults.components.offline}).done(spa.noop)
          .fail(function(){
            spa.console.info("Attempt to Load component ["+componentNameFull+"]'s properties from ["+_cScriptFile+"] has FAILED. Not to worry. Continuing to render with default properties.");
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
        if (_.isArray(arguments[0])) {         //(['compName1', 'compName2', 'compName3']);
          compList = arguments[0];
        } else if (_.isString(arguments[0])) { //('compName1') | spa.renderComponents('compName1,compName2');
          compList = arguments[0].split(',');
        } else {
          compList = arguments[0];             //( { compName1: {overrideOptions}, compName2: {overrideOptions} } );
        }
      }

      if (spa.is(compList, 'object')) {
        _.each(Object.keys(compList), function(compName){
          spa.console.info('Rendering spa-component:['+compName+']');
          spa[actionName](compName, compList[compName]);
        });
      } else if (compList && compList.length) {
        _.each(compList, function(compName){
          spa.console.info('Rendering spa-component:['+compName+']');
          spa[actionName](compName.trim());
        });
      }
    }
  }
  spa.renderComponents = spa.$$render = function () {
    _spaRenderRefreshComponents.apply({action: 'renderComponent'}, arguments);
  };
  spa.refreshComponents = spa.$$refresh = function () {
    _spaRenderRefreshComponents.apply({action: 'refreshComponent'}, arguments);
  };

  function _get$dataInAttr(el, pComponentName, newData) {
    pComponentName = pComponentName.replace(/[^a-z0-9]/gi, '_');

    var pCompRef = 'app.'+pComponentName+'.';
    if (spa.is(newData, 'object')) {
      if (!spa.tempBind$data.hasOwnProperty(pComponentName)) spa.tempBind$data[pComponentName] = {};
      spa.tempBind$data[pComponentName]['$data'] = _.merge({}, spa.findSafe(app, pComponentName+'.$data', {}), newData);
      pCompRef = 'spa.tempBind$data.'+pComponentName+'.';
    }

    var $el, $elData, spaCompNameWithOpt, spaCompOpt, spaCompOptions;

    $el = $(el); $elData = $el.data();
    spaCompNameWithOpt = ($el.attr('data-spa-component') || '').split('|');
    //spaCompName = (spaCompNameWithOpt[0]).trim();
    spaCompOpt  = (spaCompNameWithOpt[1]||'').trim();

    if (spaCompOpt) {
      if (/\:\s*\$data/.test(spaCompOpt)) {
        spaCompOpt = spaCompOpt.replace(/\:\s*\$data/g, ':'+pCompRef+'$data');
      }
      spaCompOpt = spa.toJSON(spaCompOpt);
    }

    var cOptionsInAttr = $el.attr('data-spa-component-options') || $el.attr('data-spa-$options') || $el.attr('spa-$options') || '{}';
    spaCompOptions = _.merge( {}, spaCompOpt, $elData, spa.toJSON(cOptionsInAttr));

    if (spaCompOptions.hasOwnProperty('data') && spa.is(spaCompOptions.data,'string')) {
      var dataPath = spaCompOptions.data.trim();
      if (/^\$data/.test(dataPath)) {
        dataPath = pCompRef+dataPath;
      }
      spaCompOptions.data = _.merge({}, spa.findSafe(window, dataPath, {}));
    }

    var $dataInAttr = ($el.attr('data-spa-component-$data') || $el.attr('data-spa-$data') || $el.attr('spa-$data') || '').trim();
    if ($dataInAttr) {
      if (/\:\s*\$data/.test($dataInAttr)) {
        $dataInAttr = $dataInAttr.replace(/\:\s*\$data/g, ':'+pCompRef+'$data');
      }
      if (spa.isBlank(spaCompOptions.data)) {
        spaCompOptions['data'] = spa.toJSON($dataInAttr);
      } else {
        _.merge(spaCompOptions.data, spa.toJSON($dataInAttr));
      }
    }
    if (!spa.isBlank(spaCompOptions['data']) && spaCompOptions['data'].hasOwnProperty('$data')) {
      var rootData = _.merge({},spaCompOptions.data.$data);
      delete spaCompOptions.data.$data;
      _.merge(spaCompOptions.data, rootData);
    }

    //console.log(spaCompOptions);

    return spaCompOptions.hasOwnProperty('data')? spaCompOptions.data : {};
  }

  function _spaTagsSelector(tagNames){
    return tagNames.split(',').map(function(tagName){
      return (tagName.trim())+'[src]:not([data-spa-component])';
    }).join(',');
  }

  spa.renderComponentsInHtml = function (scope, pComponentName) {
    scope = scope||'body';
    pComponentName = (pComponentName || '').trim();

    // <spa-template src=""> <x-template src="">
    var templateTags = _spaTagsSelector('spa-template,x-template');
    $(scope).find(templateTags).each(function(){
      this.setAttribute('data-spa-component', this.getAttribute('src'));
      this.setAttribute('data-skip-data-bind', 'true');
      this.setAttribute('data-template-script', 'true');
      this.style.display = 'none';
    });

    // <spa-html src=""> <x-html src=""> with optional [data] attribute
    var htmlTags = _spaTagsSelector('spa-html,x-html');
    $(scope).find(htmlTags).each(function(){
      var htmlSrc = this.getAttribute('src');
      var isSpaComponent = ((htmlSrc[0] === '$') || !(/[^a-z0-9]/ig).test( htmlSrc ));
      if (isSpaComponent && !spa.components[htmlSrc.replace(/[^a-z0-9]/gi,'_')]) {
        var cOptions = {
          templateScript: true
        };
        var skipDataBind = (!(this.hasAttribute('data') || this.hasAttribute('data-url')));
        if (skipDataBind) {
          cOptions['skipDataBind'] = true;
        } else if (!this.hasAttribute('data-url')) {
          cOptions['data'] = this.hasAttribute('data')? spa.toJSON(this.getAttribute('data')) : {};
        }
        spa.$(htmlSrc, cOptions);
      }
      this.setAttribute('data-spa-component', htmlSrc);
    });

    // <spa-component src=""> <x-component src="">
    var componentTags = _spaTagsSelector('spa-component,x-component');
    $(scope).find(componentTags).each(function(){
      this.setAttribute('data-spa-component', this.getAttribute('src'));
    });

    var $spaCompList = $(scope).find('[data-spa-component]');
    if ($spaCompList.length){

      var $el, spaCompNameWithOpt, spaCompName, spaCompOpt, spaCompOptions, newElId, $elData;
      $spaCompList.each(function( index, el ) {
        $el = $(el); $elData = $el.data();
        spaCompNameWithOpt = ($el.attr('data-spa-component') || '').split('|');
        spaCompName = (spaCompNameWithOpt[0]).trim();
        spaCompOpt  = (spaCompNameWithOpt[1]||'').trim();

        if (spaCompOpt) {
          if (/\:\s*\$data/.test(spaCompOpt)) {
            spaCompOpt = spaCompOpt.replace(/\:\s*\$data/g, ':app.'+pComponentName+'.$data');
          }
          spaCompOpt = spa.toJSON(spaCompOpt);
        }

        if (spaCompName) {
          if ((!spa.components[spaCompName]) && (el.hasAttribute('no-script') || el.hasAttribute('noscript') || el.hasAttribute('nojs') || el.hasAttribute('no-js'))) {
            spa.$(spaCompName, {});
          }

          if (!el.id) {
            var _spaCompName = String(spaCompName).trim();
            if (_spaCompName[0] == '$') {
              _spaCompName = _spaCompName.replace(/[^a-z0-9]/gi,'_');
            }
            _spaCompName = _spaCompName.replace(/[^a-z0-9_]/gi,'');
            newElId = 'spaCompContainer_'+_spaCompName+'_'+ ($('body').find('[rel=spaComponentContainer_'+_spaCompName+']').length+1);
            el.id = newElId;
            el.setAttribute("rel", "spaComponentContainer_"+_spaCompName);
          }

          var cOptionsInAttr = $el.attr('data-spa-component-options') || $el.attr('data-spa-$options') || $el.attr('spa-$options') || '{}';
          spaCompOptions = _.merge( {target: "#"+el.id, targetEl: el, spaComponent:(spaCompName.trim()), _reqFrTag_: 1}, spaCompOpt, $elData, spa.toJSON(cOptionsInAttr));

          if (el.hasAttribute('skipDataBind') || el.hasAttribute('skip-data-bind')) {
            spaCompOptions['skipDataBind'] = true;
          }

          //GET Data for render begins
          if (spaCompOptions.hasOwnProperty('data') && spa.is(spaCompOptions.data,'string')) {
            var dataPath = spaCompOptions.data.trim();
            if (/^\$data/.test(dataPath)) {
              dataPath = 'app.'+pComponentName+'.'+dataPath;
            }
            spaCompOptions.data = _.merge({}, spa.findSafe(window, dataPath, {}));
          }
          var $dataInAttr = ($el.attr('data-spa-component-$data') || $el.attr('data-spa-$data') || $el.attr('spa-$data') || '').trim();
          if ($dataInAttr) {
            if (/\:\s*\$data/.test($dataInAttr)) {
              $dataInAttr = $dataInAttr.replace(/\:\s*\$data/g, ':app.'+pComponentName+'.$data');
            }
            if (spa.isBlank(spaCompOptions.data)) {
              spaCompOptions['data'] = spa.toJSON($dataInAttr);
            } else {
              _.merge(spaCompOptions.data, spa.toJSON($dataInAttr));
            }
          }
          if (!spa.isBlank(spaCompOptions['data']) && spaCompOptions['data'].hasOwnProperty('$data')) {
            var rootData = _.merge({},spaCompOptions.data.$data);
            delete spaCompOptions.data.$data;
            _.merge(spaCompOptions.data, rootData);
          }
          //GET Data for render ends

          if (spaCompOptions.hasOwnProperty('data')){
            spaCompOptions['data_'] = _.merge({}, spaCompOptions.data);
            delete spaCompOptions['data'];
          }

          spa.console.log('inner-component', spaCompName, 'options:', spaCompOptions);
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
        var _fn2Call = fn2Call, fnContextName, fnContext=thisContext;

        if (_.isString(_fn2Call)) {
          if (!fnContext) {
            if (fn2Call.match(']$')) {
              fnContextName = fn2Call.substring(0, fn2Call.lastIndexOf('['));
            } else if (fn2Call.indexOf('.')>0) {
              fnContextName = fn2Call.substring(0, fn2Call.lastIndexOf('.'));
            }
            fnContext = (fnContextName)? spa.findSafe(window, fnContextName) : window;
          }
          _fn2Call = spa.findSafe(window, _fn2Call);
        }
        if (_fn2Call) {
          if (_.isFunction(_fn2Call)) {
            spa.console.info("calling callback: " + fn2Call);
            if (spa.is(fnArg, 'array') && fnArg[0]=='(...)') {
              fnArg.shift();
              return _fn2Call.apply(fnContext, fnArg);
            } else {
              return _fn2Call.call(fnContext, fnArg);
            }
          } else {
            spa.console.error("CallbackFunction <" + fn2Call + " = " + _fn2Call + "> is NOT a valid FUNCTION.");
          }
        } else {
            spa.console.warn("CallbackFunction <" + fn2Call + "> is NOT defined.");
        }
      }
    },
    registerComponentEvents: function (compName) {
      if (compName && app[compName] && app[compName].hasOwnProperty('events')) {
        var elTargetSelector, $elTarget;
        _.each(Object.keys(app[compName].events), function(eventId){
          if (app[compName].events[eventId].hasOwnProperty('target') && (!spa.isBlank(app[compName].events[eventId].target))) {
            elTargetSelector = app[compName].events[eventId].target;
            $elTarget = spa.$(compName+' '+elTargetSelector); //$('body').find(elTargetSelector)
            $elTarget.filter(':not([spa-events-'+eventId+'="'+compName+'"])')
            .attr('spa-events-'+eventId, compName)
            .each(function(index, el){
              _.each(Object.keys(app[compName].events[eventId]), function(eventNames){
                if (eventNames.indexOf('on')==0) {
                  _.each(eventNames.split('_'), function(eventName){
                    spa.console.log('registering component ['+compName+'] event: '+eventId+'-'+eventName);
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

  function _appApiDefaultPayload(){
    var defaultPayload = spa.findSafe(app, 'api.ajaxOptions.defaultPayload', {});
    return (spa.is(defaultPayload, 'function')? defaultPayload() : (spa.is(defaultPayload, 'object')? _.merge({}, defaultPayload) : defaultPayload) );
  }

  /*
   * spa.render("#containerID")
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

   ,dataRenderId              : ""    // Render Id, may be used to locate in spa.renderHistory[dataRenderId], auto-generated key if not defined
   ,saveOptions               : false // Save options in render-container element
   };

   spa.render("#containerID", uOption);
   */
  spa.render = function (viewContainerId, uOptions) {
    spa.console.log('spa.render', viewContainerId, uOptions);

    if (!arguments.length) return;

    //render with single argument with target
    if ((arguments.length===1) && (typeof viewContainerId === "object")) {
      uOptions = _.merge({}, viewContainerId);
      if (uOptions.hasOwnProperty("target")) {
        viewContainerId = uOptions['target'];
        delete uOptions['target'];
      } else {
        var oldTarget = $('[data-rendered-component="'+uOptions['componentName']+'"]').attr('id');
        viewContainerId = (oldTarget? '#' : '')+oldTarget;
        if (!viewContainerId) {
          spa.console.warn('Render target is missing.');
          viewContainerId = "dynRender_"+spa.now()+"_"+(spa.rand(1000, 9999));
        }
      }
      spa.render(viewContainerId, uOptions);
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
        _.each(keyMaps, function(value, key) {
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
      , dataPreRequest : spa.defaults.components.dataPreRequest
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
      , extend$data : spa.defaults.components.extend$data

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
      if (!spa.isElementExist("#spaRunTimeHtmlContainer")) {
        $("body").append("<div id='spaRunTimeHtmlContainer' style='display:none;'></div>");
      }
      $("#spaRunTimeHtmlContainer").append("<div id='" + viewContainerId.replace(/\#/gi, "") + "'></div>");
    }
    if (useOptions) { /* for each user option set/override internal spaRVOptions */
      /* store options in container data properties if saveOptions == true */
      var _globalCompOptions = {
        dataTemplatesCache : spa.defaults.components.templateCache
      };
      uOptions = _.merge({}, _globalCompOptions, uOptions);

      var saveOptions = (uOptions.hasOwnProperty("saveOptions") && uOptions["saveOptions"]);
      for (var key in uOptions) {
        spaRVOptions[key] = uOptions[key];
        if (saveOptions && (!(key === "data" || key === "saveOptions"))) {
          $(viewContainerId).data((""+( ("" + (_.at(""+key,4)||"") ).toLowerCase() )+key.slice(5)), spa.toStr(uOptions[key]));
        }
      }
    }

    spa.console.log(rCompName+'.$'+(spaRVOptions['isRefreshCall']?'refresh':'render')+' with options:', spaRVOptions, '$data', spa.findSafe(app, rCompName+'.$data'));

    var $viewContainerId = $(viewContainerId);
    var pCompName  = $viewContainerId.attr('data-rendered-component') || '';
    var is$refresh = (pCompName == rCompName);

    function _fixRefreshCalls(propName, renderMethod, refreshMethod){
      if (spa.is(spaRVOptions[propName], 'string')
            && (spaRVOptions[propName] == ('app.'+rCompName+renderMethod))) {
        if (app[rCompName].hasOwnProperty(refreshMethod)) {
          spaRVOptions[propName] = 'app.'+rCompName+'.'+refreshMethod;
        }
      }
    }

    if (_isSpaNavBlocked( $viewContainerId )){
      spa.console.log('Component container [', viewContainerId,'] blocks navigation.');
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
            navAwayFn = spa.findSafe(window, onNavAway.split('(')[0].split(';')[0] );
            if (navAwayFn && spa.is(navAwayFn, 'function')) {
              navAwayFnRes = navAwayFn.call(app[pCompName], app[pCompName],  app[rCompName]);
            }
            if (navAwayFn && !(spa.is(navAwayFnRes, 'boolean') && navAwayFnRes)) return;
          }
        } else {
          navAwayFn = spa.findSafe(app, pCompName+'.onNavBlock' );
          if (navAwayFn && spa.is(navAwayFn, 'function')) {
            navAwayFnRes = navAwayFn.call(app[pCompName], app[pCompName],  app[rCompName]);
          }
          if (navAwayFn && !(spa.is(navAwayFnRes, 'boolean') && navAwayFnRes)) return;
        }
      }
      spa.console.log('Render continues.');
    }

    if (is$refresh) {
      //Fix Callback Functions
      spa.console.log('$refresh - Auto-Detected', rCompName, spaRVOptions);
      if ('auto'.equalsIgnoreCase( (''+spaRVOptions.render) )) {
        spa.console.log('Finding for refresh events.');
        _fixRefreshCalls('dataBeforeRender', '.onRender', 'onRefresh');
        _fixRefreshCalls('dataRenderCallback', '.renderCallback', 'refreshCallback');
      }
    }

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
    var targetRenderMode = _renderOption('dataRenderMode', 'renderMode') || 'replace';
    spa.console.log("Render Mode: <"+targetRenderMode+">");

    var spaTemplateType = "x-spa-template";
    var spaTemplateEngine = (spaRVOptions.templateEngine || spa.defaults.components.templateEngine || "handlebars").toLowerCase();

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
      }
      spaRVOptions.dataScripts = spa.toJSON(vScriptsList);
    }

    if (!$.isEmptyObject(spaRVOptions.dataScripts)) {
      vScripts = spaRVOptions.dataScripts;
    }
    if (_.isArray(vScripts)) {
      _.remove(vScripts,function(item){ return !item; });
    }
    spa.console.info(vScripts);
    var vScriptsNames;
    vScriptsList=[];
    if (vScripts && (!$.isEmptyObject(vScripts))) {
      if (_.isArray(vScripts)) {
        spa.console.info("Convert array of script(s) without scriptID to object with scriptID(s).");
        var newScriptsObj = spa.renderUtils.array2ObjWithKeyPrefix(vScripts, '__scripts_', viewContainerId);
        spa.console.info("Scripts(s) with scriptID(s).");
        spa.console.log(newScriptsObj);
        vScripts = (_.isEmpty(newScriptsObj))? {} : newScriptsObj;
      }
      spa.console.info("External scripts to be loaded [cache:" + (spaRVOptions.dataScriptsCache) + "] along with view container [" + viewContainerId + "] => " + JSON.stringify(vScripts));
      vScriptsNames = _.keys(vScripts);
    }
    else {
      spa.console.info("No scripts defined [data-scripts] in view container [" + viewContainerId + "] to load.");
    }
    spa.console.groupEnd("spaLoadingViewScripts");

    if (vScriptsNames) {
      var scriptPath;
      vScriptsList = _.map(vScriptsNames, function (scriptId) {
        scriptPath = _getFullPath4Component(vScripts[scriptId], rCompName);
        if (!(scriptPath.endsWithStrIgnoreCase( '.js' )) && (scriptPath.indexOf('?')<0)) {
          scriptPath += spa.defaults.components.scriptExt;
        }
        return ((spaRVOptions.dataScriptsCache? '' : '~') + scriptPath);
      });
    }
    /* Load Scripts Ends */

    spa.console.log('component [',rCompName,'] scripts:', vScriptsList);
    spa.loadScriptsSync(vScriptsList, function _onScriptsLoadComplete(){
      /*Wait till scripts are loaded before proceed*/
      spa.console.info("External Scripts Loaded.");

      if (!_appApiInitialized && (Object.keys(app['api']).length)) _initApiUrls();

      var dataPreRequest = (spaRVOptions)? spaRVOptions['dataPreRequest'] : '';
      if (spa.is(dataPreRequest, 'string')) {
        dataPreRequest = spa.renderUtils.getFn(dataPreRequest);
      }
      if (spa.is(dataPreRequest, 'function')) {
        try{
          var dataPreRequestRes = dataPreRequest.call(app[rCompName]);
          if (dataPreRequestRes && spa.is(dataPreRequestRes, 'object')) {
            Object.keys(dataPreRequestRes).forEach(function(oKey){
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
      spa.console.group("spaDataModel");

      var dataModelName = _renderOption('dataModel', 'model')
        , dataModelUrl  = _renderOption('dataUrl', 'url')
        , viewDataModelName
        , isLocalDataModel = (useParamData || (dataModelUrl.beginsWithStrIgnoreCase("local:")))
        , defaultDataModelName = (dataModelUrl.beginsWithStrIgnoreCase("local:")) ? dataModelUrl.replace(/local:/gi, "") : "data"
        , defPayLaod = _appApiDefaultPayload()
        , dataUrlPayLoad
        , _stringifyPayload = (spaRVOptions && spaRVOptions.hasOwnProperty('stringifyPayload'))? spaRVOptions['stringifyPayload'] : spa.findSafe(app, 'api.ajaxOptions.stringifyPayload');

      dataModelName = dataModelName.ifBlankStr(defaultDataModelName);
      viewDataModelName = dataModelName.replace(/\./g, "_");

      var spaTemplateModelData = {};
      if (useParamData) {
        spaTemplateModelData[viewDataModelName] = (spa.is(spaRVOptions.data, 'function'))? (spaRVOptions.data()) : (spaRVOptions.data);
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
            spaTemplateModelData[viewDataModelName] = _.merge({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra);
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
                  if (_.has(dataApi, 'urlParams')) {
                    apiDataUrl = spa.api.url(apiDataUrl, dataApi['urlParams']);
                  }

                  var dataAjaxReqHeaders = _.has(dataApi, 'headers')? dataApi.headers : spaRVOptions['dataUrlHeaders'];
                  if (spa.isBlank(dataAjaxReqHeaders)) {
                    dataAjaxReqHeaders = spa.findSafe(window, 'app.api.ajaxOptions.headers', {});
                  }

                  dataUrlPayLoad = _.has(dataApi, 'params') ? dataApi.params : (_.has(dataApi, 'data') ? dataApi.data : {});
                  if ((! _.has(dataApi, 'defaultPayload')) && (!spa.isBlank(defPayLaod))) {
                    dataUrlPayLoad = _.merge({}, defPayLaod, ((!spa.isBlank(dataUrlPayLoad) && spa.is(dataUrlPayLoad, 'object'))? dataUrlPayLoad : {}));
                  }
                  if (!spa.isBlank(dataUrlPayLoad) && _stringifyPayload) {
                    dataUrlPayLoad = JSON.stringify(dataUrlPayLoad);
                  }

                  spaAjaxRequestsQue.push(
                    $.ajax({
                      url: apiDataUrl,
                      method : (''+(dataApi['method'] || 'GET')).toUpperCase(),
                      headers: ((spa.is(dataAjaxReqHeaders, 'function'))? dataAjaxReqHeaders() : dataAjaxReqHeaders),
                      data: dataUrlPayLoad,
                      cache: _.has(dataApi, 'cache') ? dataApi.cache : spaRVOptions.dataCache,
                      dataType: _.has(dataApi, 'type') ? dataApi.type : (spaRVOptions.dataType || spa.findSafe(window, 'app.api.ajaxOptions.dataType', 'text')),
                      success: function (result, textStatus, jqXHR) {
                        var targetApiData
                          , targetDataModelName = _.has(dataApi, 'target') ? ('' + dataApi.target) : ''
                          , oResult = spa.is(result, 'string')? spa.toJSON(''+result, 'data') : result;

                        if (targetDataModelName.indexOf(".") > 0) {
                          targetApiData = spa.hasKey(oResult, targetDataModelName) ? spa.find(oResult, targetDataModelName) : oResult;
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
                        spa.console.info("Loaded data model [" + apiDataModelName + "] from [" + apiDataUrl + "]");

                        //Call user defined function on api-data success
                        var fnApiDataSuccess = dataApi['success'] || dataApi['onsuccess'] || dataApi['onSuccess'];
                        if (!fnApiDataSuccess) {
                          fnApiDataSuccess = dataModelCollection['success'] || dataModelCollection['onsuccess'] || dataModelCollection['onSuccess']; //use common success
                        }
                        if (fnApiDataSuccess) {
                          if (_.isFunction(fnApiDataSuccess)) {
                            fnApiDataSuccess.call(this, oResult, dataApi, textStatus, jqXHR);
                          }
                          else if (_.isString(fnApiDataSuccess)) {
                            var _xSuccessFn_ = spa.findSafe(window, fnApiDataSuccess);
                            if (typeof _xSuccessFn_ === "function") {
                              _xSuccessFn_.call(this, oResult, dataApi, textStatus, jqXHR);
                            } else {
                              spa.console.log('Unknown ajax success handle: '+fnApiDataSuccess);
                            }
                          }
                        }
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                        spa.console.warn("Error processing data-api [" + apiDataUrl + "]");
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
                          if (_.isFunction(fnOnApiDataUrlErrorHandle)) {
                            fnOnApiDataUrlErrorHandle.call(this, jqXHR, textStatus, errorThrown);
                          }
                          else if (_.isString(fnOnApiDataUrlErrorHandle)) {
                            var _xErrorFn_ = spa.findSafe(window, fnOnApiDataUrlErrorHandle);
                            if (typeof _xErrorFn_ === "function") {
                              _xErrorFn_.call(this, oResult, dataApi);
                            } else {
                              spa.console.log('Unknown ajax error handle: '+fnOnApiDataUrlErrorHandle);
                            }
                          }
                        } else {
                          if ( spa.is(app.api['onError'], 'function') ) {
                            app.api.onError.call(this, jqXHR, textStatus, errorThrown);
                          } else {
                            spa.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
                          }
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

            if (_isValidEvalStr(localDataModelName)) {
              try {
                // _evStr
                localDataModelObj = (Function('"use strict";return (' + localDataModelName + ')')());
              } catch(e) {
                console.error('Error in spa.$(\''+(spaRVOptions['componentName'])+'\'): Invalid Data Model >> "local:'+localDataModelName+'"\n>> ' + (e.stack.substring(0, e.stack.indexOf('\n'))) );
              }
              spa.console.info("Using LOCAL Data Model: " + localDataModelName);
            }

            if ((!isLocalDataModel) && (dataModelName.indexOf(".") > 0)) {
              spaTemplateModelData[viewDataModelName] = spa.hasKey(localDataModelObj, dataModelName) ? spa.find(localDataModelObj, dataModelName) : localDataModelObj;
            } else {
              try {
                spaTemplateModelData[viewDataModelName] = localDataModelObj.hasOwnProperty(dataModelName) ? localDataModelObj[dataModelName] : localDataModelObj;
              } catch(e){
                console.warn("Error in Data Model ["+dataModelName+"] in Local Object ["+localDataModelName+"].\n" + e.stack);
              }
            }

          }
          else { /*External Data Source*/
            if (!spa.isBlank(spaRVOptions.dataUrlParams)){
              dataModelUrl = spa.api.url(dataModelUrl, spaRVOptions.dataUrlParams);
            }
            spa.console.info("Request Data [" + dataModelName + "] [cache:" + (spaRVOptions['dataUrlCache'] || spaRVOptions['dataCache']) + "] from URL =>" + dataModelUrl);
            var ajaxReqHeaders = spaRVOptions.dataUrlHeaders;
            if (spa.isBlank(ajaxReqHeaders)) {
              ajaxReqHeaders = spa.findSafe(window, 'app.api.ajaxOptions.headers', {});
            }

            dataUrlPayLoad = spaRVOptions.dataParams;
            if ((!spaRVOptions.hasOwnProperty('defaultPayload')) && (!spa.isBlank(defPayLaod))) {
              dataUrlPayLoad = _.merge({}, defPayLaod, ((!spa.isBlank(dataUrlPayLoad) && spa.is(dataUrlPayLoad, 'object'))? dataUrlPayLoad : {}));
            }
            if (!spa.isBlank(dataUrlPayLoad) && _stringifyPayload) {
              dataUrlPayLoad = JSON.stringify(dataUrlPayLoad);
            }

            var axOptions = {
                url: dataModelUrl,
                method: (''+(_renderOption('dataUrlMethod', 'urlMethod') || 'GET')).toUpperCase(),
                headers: ((spa.is(ajaxReqHeaders, 'function'))? ajaxReqHeaders() : ajaxReqHeaders),
                data: dataUrlPayLoad,
                cache: spaRVOptions['dataUrlCache'] || spaRVOptions['dataCache'],
                dataType: spaRVOptions.dataType || spa.findSafe(window, 'app.api.ajaxOptions.dataType', 'text'),
                success: function (result) {
                  var oResult = spa.is(result, 'string')? spa.toJSON(''+result, 'data') : result,
                      validateData = _renderOption('dataValidate', 'validate');

                  if (dataModelName.indexOf(".") > 0) {
                    spaTemplateModelData[viewDataModelName] = spa.hasKey(oResult, dataModelName) ? spa.find(oResult, dataModelName) : oResult;
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
                    if ( spa.is(app.api['onError'], 'function') ) {
                      app.api.onError.call(this, jqXHR, textStatus, errorThrown);
                    } else {
                      spa.api.onReqError.call(this, jqXHR, textStatus, errorThrown);
                    }
                  } else {
                    var _xErrFn_ = spa.findSafe(window, fnOnDataUrlErrorHandle);
                    if (typeof _xErrFn_ === 'function') {
                      _xErrFn_.call(this, jqXHR, textStatus, errorThrown);
                    } else {
                      spa.console.log('Unknown ajax error handle: '+fnOnDataUrlErrorHandle);
                    }
                  }
                }
              };
            spaAjaxRequestsQue.push( $.ajax(axOptions) );
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
        var vTemplates = spa.toJSON(vTemplatesList || "{}");
        /* Check the option to override */
        if ((!(_.isObject(spaRVOptions.dataTemplates))) && (_.isString(spaRVOptions.dataTemplates))) {
          vTemplatesList = (spaRVOptions.dataTemplates || "").trimStr();
          if (spa.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
            vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'";
          }
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
          var tmplPayload = spaRVOptions['templateUrlPayload'];
          if ( tmplPayload && ((_is(tmplPayload, 'function')) || (_is(tmplPayload, 'string') && (tmplPayload.indexOf('=')<0)))) {
            tmplPayload = __finalValue(tmplPayload, spaRVOptions);
          }
          var tmplOptions = {
              method : spaRVOptions['templateUrlMethod']
            , params : __finalValue(spaRVOptions['templateUrlParams'], spaRVOptions)
            , payload: tmplPayload
            , headers: __finalValue(spaRVOptions['templateUrlHeaders'], spaRVOptions)
            , onError: __finalValue(spaRVOptions['onTemplateUrlError'] || spaRVOptions['onError'])
          };
          _.each(vTemplateNames, function (tmplId, tmplIndex) {
            spa.console.info([tmplIndex, tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId, spaRVOptions]);
            spaAjaxRequestsQue = spa.loadTemplate(tmplId, vTemplates[tmplId], spaTemplateType, viewContainerId, spaAjaxRequestsQue, !spaRVOptions.dataTemplatesCache, tmplOptions);
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
            var vStylesNames = _.keys(vStyles), fullStylePath;

            spa.console.group("spaLoadingStyles");
            _.each(vStylesNames, function (styleId) {
              fullStylePath = _getFullPath4Component(vStyles[styleId], rCompName);
              spaAjaxRequestsQue = spa.loadStyle(styleId, fullStylePath, spaRVOptions.dataStylesCache, spaAjaxRequestsQue);
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

              try {
                var isPreProcessed = false, isSinlgeAsyncPreProcess;
                var isValidData = !_renderOption('dataValidate', 'validate');
                if (!isValidData) {
                  //Get Validated using SPA.API
                  spa.console.info('Validating Data');
                  var fnDataValidate = _renderOption('dataValidate', 'validate');
                  if (fnDataValidate && (_.isString(fnDataValidate))) {
                    fnDataValidate = spa.findSafe(window, fnDataValidate);
                  }
                  if (fnDataValidate && _.isFunction(fnDataValidate)) {
                    isValidData = fnDataValidate.call(spaTemplateModelData[viewDataModelName], spaTemplateModelData[viewDataModelName]);
                  } else {
                    isValidData = (spa.api['isCallSuccess'](spaTemplateModelData[viewDataModelName]));
                  }
                }

                var initialTemplateData = spaTemplateModelData[viewDataModelName];

                function _dataPreProcessAsync(){
                  var fnDataPreProcessAsync = _renderOption('dataPreProcessAsync', 'preProcessAsync')
                    , fnDataPreProcessAsyncResponse;

                  if (fnDataPreProcessAsync && (_.isString(fnDataPreProcessAsync))) { fnDataPreProcessAsync = spa.findSafe(window, fnDataPreProcessAsync); }
                  retValue['modelOriginal'] = $.extend({}, initialTemplateData);
                  retValue['model'] = initialTemplateData;
                  if (fnDataPreProcessAsync && _.isFunction(fnDataPreProcessAsync)) {
                    isPreProcessed = true;
                    var dataProcessContext = $.extend({}, (app[rCompName] || {}), (uOptions || {}));

                    fnDataPreProcessAsyncResponse = fnDataPreProcessAsync.call(dataProcessContext, initialTemplateData);
                    isPreProcessed = (!spa.is(fnDataPreProcessAsyncResponse, 'undefined'));
                    if (!isPreProcessed) fnDataPreProcessAsyncResponse = [];
                    if (isPreProcessed) {
                      isSinlgeAsyncPreProcess = (!spa.is(fnDataPreProcessAsyncResponse, 'array'))
                                                || (spa.is(fnDataPreProcessAsyncResponse, 'array') && fnDataPreProcessAsyncResponse.length==1);
                      if (!spa.is(fnDataPreProcessAsyncResponse, 'array')) {
                        fnDataPreProcessAsyncResponse = [fnDataPreProcessAsyncResponse];
                      }
                    }
                  }
                  return fnDataPreProcessAsyncResponse;
                }

                if (isValidData) {
                  $.when.apply($, _dataPreProcessAsync() ).done(function(){

                    var dataPreProcessAsyncRes = Array.prototype.slice.call(arguments);
                    if (isPreProcessed) {
                      spa.console.log(rCompName,'.dataPreProcessAsync() =>', dataPreProcessAsyncRes.__now());
                      if (isSinlgeAsyncPreProcess && (dataPreProcessAsyncRes.length > 1) && (dataPreProcessAsyncRes[1] == 'success') ){
                        //&& (spa.is(dataPreProcessAsyncRes[0], 'string')) && ((/\s*\{/).test(dataPreProcessAsyncRes[0])) ){
                        //if only 1 ajax request with JSON String as response
                        dataPreProcessAsyncRes[0] = spa.toJSON(dataPreProcessAsyncRes[0]);
                        dataPreProcessAsyncRes.splice(1);
                      } else {
                        //multiple ajax in preProcess
                        _.each(dataPreProcessAsyncRes, function(apiRes, idx) {
                          if ( apiRes && spa.is(apiRes, 'array')  && (apiRes.length > 1) && (apiRes[1] == 'success') ) {
                            dataPreProcessAsyncRes[idx] = spa.toJSON(apiRes[0]);
                          }
                        });
                      }
                      spa.console.log(dataPreProcessAsyncRes.__now());
                    }

                    var fnDataProcess = _renderOption('dataProcess', 'process'), finalTemplateData;
                    if (fnDataProcess && (_.isString(fnDataProcess))) {
                      fnDataProcess = spa.findSafe(window, fnDataProcess);
                    }
                    retValue['modelOriginal'] = $.extend({}, initialTemplateData);
                    retValue['model'] = initialTemplateData;
                    if (fnDataProcess && _.isFunction(fnDataProcess)) {
                      var dataProcessContext = $.extend({}, (app[rCompName] || {}), (uOptions || {}));
                      dataPreProcessAsyncRes.unshift(initialTemplateData);
                      finalTemplateData = fnDataProcess.apply(dataProcessContext, dataPreProcessAsyncRes);
                    } else if (isPreProcessed) {
                      spa.console.warn(rCompName,'.dataPreProcessAsync without dataProcess. Merging responses.');
                      dataPreProcessAsyncRes.unshift(initialTemplateData);
                      _.merge.apply(_, dataPreProcessAsyncRes);
                    }

                    retValue['model'] = (spa.is(finalTemplateData, 'undefined'))? initialTemplateData : finalTemplateData;
                    if (!_.isObject(retValue['model'])) {
                      retValue['model'] = retValue['modelOriginal'];
                    }
                    spa.console.log(rCompName, 'Final Template Data:', retValue['model']);

                    { if (rCompName) {
                        if ((is(app, 'object')) && app.hasOwnProperty(rCompName)) {
                          var compLocOrApiData = _.merge({}, (is(retValue['model'], 'object')? retValue['model'] : {'_noname' : retValue['model']}) );
                          if (compLocOrApiData.hasOwnProperty('spaComponent')) {
                            app[rCompName]['$data'] = {};
                          } else {
                            app[rCompName]['$data'] = (spaRVOptions.extend$data)? _.merge({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, compLocOrApiData) : {};
                          }
                          app[rCompName]['__global__']= window || {};
                        }

                        retValue['model']['_this']  = _.merge({}, spa.findSafe(window, 'app.'+rCompName, {}));
                        retValue['model']['_this_'] = _.merge({}, (spa.components[rCompName] || {}), uOptions);
                      }
                      retValue['model']['_global_'] = window || {};

                      var spaViewModel = retValue.model, compiledTemplate;
                      //spa.viewModels[retValue.id] = retValue.model;

                      var templateContentToBindAndRender = ($(vTemplate2RenderID).html() || "").replace(/_LINKTAGINTEMPLATE_/g,"link");
                      var allowScriptsInTemplates = spaRVOptions.templateScript || spa.defaults.components.templateScript;
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
                        _.forEach(componentRefsV, function(cRef){
                          templateContentToBindAndRender = templateContentToBindAndRender.replace((new RegExp(cRef.replace(/\$/, '\\$'), 'g')),
                            cRef.replace(/{\s*\$this|{\s*\@\$/g, '_global_.app.').replace(/}/, '.').replace(/\s/g, '').replace(/\.\./, '.'+(rCompName||'')+'.'));
                        });
                      }

                      //for reference
                      var componentRefs = templateContentToBindAndRender.match(/({\s*\$(.*?)\s*})/g);
                      if (!spaRVOptions.skipDataBind && componentRefs) {
                        _.forEach(componentRefs, function(cRef){
                          templateContentToBindAndRender = templateContentToBindAndRender.replace((new RegExp(cRef.replace(/\$/, '\\$'), 'g')),
                            cRef.replace(/{\s*\$this|{\s*\$/g, 'app.').replace(/}/, '.').replace(/\s/g, '').replace(/\.\./, '.'+(rCompName||'')+'.'));
                        });
                      }

                      compiledTemplate = templateContentToBindAndRender;
                      spa.console.log("Template Source:", templateContentToBindAndRender);
                      spa.console.log("DATA for Template:", spaViewModel);
                      var skipSpaBind, spaBindData;
                      if (!spa.isBlank(spaViewModel)) {
                        if (spaRVOptions.skipDataBind) {
                          spa.console.log('Skipped Data Binding.');
                        } else {

                          if (!spaRVOptions.dataTemplatesCache) {
                            delete spa.compiledTemplates4DataBind[rCompName];
                            delete spa.compiledTemplates[rCompName];
                          }

                          if (!spa.compiledTemplates4DataBind.hasOwnProperty(rCompName)) {
                            if ((/ data-bind\s*=/i).test(templateContentToBindAndRender)) {
                              templateContentToBindAndRender = _maskHandlebars(templateContentToBindAndRender);
                              spa.console.log('TemplateBeforeBind', templateContentToBindAndRender);
                              var data4SpaTemplate = is(spaViewModel, 'object')? _.merge({}, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, spaViewModel) : spaViewModel;
                              spa.console.log('SPA built-in binding ... ...', data4SpaTemplate);
                              templateContentToBindAndRender = spa.bindData(templateContentToBindAndRender, data4SpaTemplate, '$'+rCompName);
                              templateContentToBindAndRender = _unmaskHandlebars(templateContentToBindAndRender);
                              spa.console.log('TemplateAfterBind', templateContentToBindAndRender);
                              if (!spa.compiledTemplates4DataBind.hasOwnProperty(rCompName)) spa.compiledTemplates4DataBind[rCompName] = {};
                              skipSpaBind=true;
                            }
                          }

                          if (spaTemplateEngine.indexOf('handlebar')>=0 || spaTemplateEngine.indexOf('{')>=0) {
                            if ((typeof Handlebars != "undefined") && Handlebars) {
                              spa.console.log("Data bind using handlebars.js.", templateContentToBindAndRender);
                              try{
                                var preCompiledTemplate = spa.compiledTemplates[rCompName] || (Handlebars.compile(templateContentToBindAndRender));
                                var data4Template = is(spaViewModel, 'object')? _.merge({}, retValue, spaRVOptions.dataDefaults, spaRVOptions.data_, spaRVOptions.dataExtra, spaRVOptions.dataXtra, spaRVOptions.dataParams, spaViewModel) : spaViewModel;
                                spaBindData = data4Template;
                                if (!spa.compiledTemplates.hasOwnProperty(rCompName)) spa.compiledTemplates[rCompName] = preCompiledTemplate;
                                compiledTemplate = preCompiledTemplate(data4Template);
                                spa.console.log(compiledTemplate);
                              }catch(e){
                                console.error('Error in Template', e);
                              }
                            } else {
                              spa.console.error("handlebars.js is not loaded.");
                            }
                          }

                        }
                      }
                      spa.console.log("Template Compiled:", compiledTemplate);

                      doDeepRender = false;
                      retValue.view = compiledTemplate.replace(/\_\{/g,'{{').replace(/\}\_/g, '}}');

                      //Callback Function's context
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

                      /* Default Global components before-render */
                      spa.renderUtils.runCallbackFn(spa.defaults.components.render, fnBeforeRenderParam, renderCallbackContext);

                      //beforeRender
                      var fnBeforeRender = _renderOption('dataBeforeRender', 'beforeRender'), fnBeforeRenderRes, abortRender, abortView;
                      if (fnBeforeRender){
                        var fnBeforeRenderParam = { template: templateContentToBindAndRender, data: retValue['model'], view: retValue.view };
                        fnBeforeRenderRes = spa.renderUtils.runCallbackFn(fnBeforeRender, fnBeforeRenderParam, renderCallbackContext);
                        if (!spa.is(fnBeforeRenderRes, 'undefined')) {
                          switch (spa.of(fnBeforeRenderRes)) {
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
                        spa.console.warn('Render aborted by '+fnBeforeRender);
                      } else if (!abortView) {
                        var prevRenderedComponent = $viewContainerId.attr('data-rendered-component');
                        if (prevRenderedComponent && !spa.removeComponent(prevRenderedComponent, rCompName)){
                          abortRender = true; retValue = {};
                          spa.console.warn('Render $'+rCompName+' aborted by $'+prevRenderedComponent+'.onRemove()');
                        }
                      }

                      if (!abortRender) {
                        if (abortView) {
                          spa.console.log('Rendering component [',rCompName,'] view aborted.');
                        } else {
                          var targetRenderContainerType = _renderOption('dataRenderType', 'renderType');
                          spa.console.log('Injecting component in DOM (',viewContainerId,').'+(targetRenderContainerType||'html'));
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
                        }

                        if (doDeepRender && !abortView) {
                          /*Register Events in Components*/
                          spa.renderUtils.registerComponentEvents(rCompName);

                          /*display selected i18n lang*/
                          if ($(viewContainerId).find('.lang-icon,.lang-text,[data-i18n-lang]').length) {
                            spa.i18n.displayLang();
                          }

                          _init_SPA_DOM_(viewContainerId);
                          if (!skipSpaBind) {
                            spa.bindData(viewContainerId, spaBindData, '', true);
                          }

                          /*apply i18n*/
                          spa.i18n.apply(viewContainerId);

                          if (_routeReloadUrl(rCompName)) return (retValue); //Routing-Request-On-Reload
                        }

                        spa.console.log(retValue);

                        /* component's specific callback */
                        var _fnCallbackAfterRender = _renderOptionInAttr("renderCallback");
                        if (spaRVOptions.dataRenderCallback) {
                          _fnCallbackAfterRender = spaRVOptions.dataRenderCallback;
                        }
                        var isCallbackDisabled = (_.isString(_fnCallbackAfterRender) && _fnCallbackAfterRender.equalsIgnoreCase("off"));
                        spa.console.info("Processing callback: " + _fnCallbackAfterRender);

                        if (!isCallbackDisabled) {
                          spa.renderUtils.runCallbackFn(_fnCallbackAfterRender, retValue);
                        }

                        /*run callback if any*/
                        /* Default Global components callback */
                        spa.renderUtils.runCallbackFn(spa.defaults.components.callback, retValue, renderCallbackContext);

                        /*Deep/Child Render*/
                        if (doDeepRender && !abortView) {
                          $(viewContainerId).find("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]").spaRender();

                          // Deprecated----- DONOT - Enable as the renderComponentsInHtml options are used for something else***
                          // if (spaRVOptions.hasOwnProperty('mountComponent')) {
                          //   spa.console.info('mounting defered component', spaRVOptions.mountComponent);
                          //   $(viewContainerId).removeAttr('data-spa-component');//ToAvoid Self Render Loop
                          //   spa.renderComponentsInHtml(spaRVOptions.mountComponent.scope, spaRVOptions.mountComponent.name, true);
                          // };
                          // Deprecated----- DONOT - Enable as the renderComponentsInHtml options are used for something else***

                          spa.renderComponentsInHtml(viewContainerId, rCompName);
                        }

                      }//if !abortRender

                      //End of Valid Data
                    }
                  });
                }  else { //NOT a valid Data
                  if ( spa.is(app.api['onResError'], 'function') ) {
                    app.api.onResError(spaTemplateModelData[viewDataModelName], 'Invalid-Data', undefined);
                  } else {
                    spa.api.onResError(spaTemplateModelData[viewDataModelName], 'Invalid-Data', undefined);
                  }
                }
              }
              catch(e){
                console.error(e);
              }
              spa.console.groupEnd("spaRender[" + spaTemplateEngine + "] - spa.renderHistory[" + retValue.id + "]");
            })
            .fail(function () {
              console.error("External Data|Template|Style|Script Loading failed! Unexpected!! Check the template Path / Network. Rendering aborted.");
            });//.done(spa.runOnceOnRender);
        }
        else {
          spa.console.error("No templates defined [data-templates] in view container [" + viewContainerId + "] to render. Check HTML markup.");
        }
        spa.console.groupEnd("spaView");
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
    if (spa.isIE) {
      xEvent = document.createEvent('Event');
      xEvent.initEvent(eName, isBubbles, isCancelable);
    } else {
      xEvent = new Event(eName, {bubbles:isBubbles, cancelable:isCancelable});
    }
    if (targetEl) xEvent.targetElement = targetEl;
    return xEvent;
  }

  function _triggerClickEventOnAttr(targetEl, eAttr) {
    var targetEvent = (spa.defaults.routes.onClickAs || 'click').toLowerCase();
    var $targetEl = $(targetEl);
    var jsStmts   = (''+(targetEl.getAttribute(eAttr)) || '').trim();
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
      , $forms    = $context.find('form:not([onsubmit])')
      , hrefNonRouteFilter = _routeByHref? '.no-spa-route' : ''
      , $aLinksEx = $context.find('a[href]:not([href^="#"]):not([href^="javascript:"]):not([target])'+hrefNonRouteFilter)
      , $aLinksIn = $context.find('a:not([href]):not(.no-link)')
      , $clickEls = $context.find('[onclick]:not(:input):not(['+(_attrSpaRoute)+']):not([onclickthis])');

    //Fix Forms
    $forms.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('onsubmit', 'return false;').addClass('spa-form'); //Disable form submit

    //Fix a tags
    $aLinksEx.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('target', '_blank').addClass('spa-external-link'); //set target for external links
    $aLinksIn.filter(function(){
      return !$(this).closest('pre').length;
    }).attr('href', 'javascript:;').addClass('spa-link'); //disable href for internal links

    //Fix clickable elements button for disable
    $clickEls.filter(function(){
      return !$(this).closest('pre').length;
    }).addClass('as-btn').renameAttr('onclick', 'onclickthis').on('click', _disabledElClick);
  }
  spa.initElementsIn = _initSpaElements;

  function _initFormValidation(el){
    var $el = $(el), formId, $elData, hasCtrlElements, enableDefaultOffline = spa.findSafe(spa, '_validate.defaults.offline', true);

    if ($el.length == 1) {
      formId  = $el.attr('id') || '';
      if (!formId) {
        formId = $el.attr('name') || ('spaForm'+spa.now());
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
        spa.updateTrackFormCtrls(this);
      });

      $el.find('textarea,input:not(:checkbox),input:not(:radio)').filter(':not([data-validate])').each(function(){
        this.setAttribute('data-validate',"{onInput:{fn:_check.noop}}");
      });

      var xssValidationSpec = ''
        , xssValidation     = spa.defaults.validation.xss
        , vXssInAttr        = ($el.attr('data-validate-xss') || '').trim()
        , xssValidationMsg  = (xssValidation.msg || '').trim();

      if ( /msg\s*:/g.test(vXssInAttr) ) {
        xssValidationMsg = spa.toJSON(vXssInAttr)['msg'];
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

      spa.initDataValidation('#'+ ( (($elData['validateForm'] || $elData['validateScope'] || '').replace(/[#onRender]/gi,'')) || formId));
      if (!$el.hasClass('track-changes') && hasCtrlElements) {
        spa.trackFormElChange(el);
      }
      if ('onRender'.equalsIgnoreCase($elData['validateForm'])) {
        spa.validateForm('#'+formId, true, true);
      }
    }

  }

  function _initFormValidationInScope(container){
    if (spa.hasOwnProperty('initDataValidation')) {
      $(container || 'body').find('[data-validate-form],[data-validate-scope],form:has([data-validate])')
                            .filter(':not([data-validation-initialized])').each(function (i, el){
                              _initFormValidation(el);
                            });
    } else {
      console.warn('SPA validation module is not loaded.');
    }
  }

  //ToBeRemoved
  // spa.hasAutoRoutes = function(routeHash, operator){
  //   var elSelector = "[data-sparoute-default]"+(routeHash? "[href"+(operator?operator:"")+"='"+routeHash+"']" : "");
  //   return ($(elSelector).length > 0);
  // };
  // spa.routeCurLocHashAttemptDelaySec = 3;
  // spa.routeCurLocHashAttempt=0;
  // spa.routeCurLocHash = function(){
  //   var curLocHash = (spa.getLocHash()||"").ifBlankStr(spa.routesOptions.defaultPageRoute);
  //   if (isSpaHashRouteOn && curLocHash && !spa.hasAutoRoutes(curLocHash)) {
  //     spa.console.info("Route current url-hash.");
  //     if (!spa.route(curLocHash)) {
  //       spa.console.warn("Current url-hash-route <"+curLocHash+"> FAILED and will try after "+spa.routeCurLocHashAttemptDelaySec+"sec.");
  //       if (spa.routeCurLocHashAttempt < 5) {
  //         spa.routeCurLocHashAttempt++;
  //         setTimeout(spa.routeCurLocHash, (spa.routeCurLocHashAttemptDelaySec*1000));
  //       } else {
  //         spa.console.error("5 attempts to route current url-hash failed. Aborting further attempts.");
  //       }
  //     }
  //   }
  // };

  // spa.finallyOnRender = [];
  // spa.runOnceOnRenderFunctions = [spa.routeCurLocHash];
  // spa.runOnceOnRender = function(){
  //   spa.console.info("Render Complete.");
  //   if ((spa.runOnceOnRenderFunctions && !_.isEmpty(spa.runOnceOnRenderFunctions)) || (spa.finallyOnRender && !_.isEmpty(spa.finallyOnRender)) ) {
  //     if (!spa.runOnceOnRenderFunctions) spa.runOnceOnRenderFunctions = [];
  //     if (!_.isArray(spa.runOnceOnRenderFunctions)) {
  //       spa.runOnceOnRenderFunctions = [spa.runOnceOnRenderFunctions];
  //     }
  //     if (_.isArray(spa.runOnceOnRenderFunctions)) {
  //       if (spa.finallyOnRender) {
  //         if (!_.isArray(spa.finallyOnRender)){ spa.finallyOnRender = [spa.finallyOnRender]; }
  //         spa.runOnceOnRenderFunctions = spa.runOnceOnRenderFunctions.concat(spa.finallyOnRender);
  //       }
  //       _.each(spa.runOnceOnRenderFunctions, function(fn){
  //         if (_.isFunction(fn)) fn();
  //       });
  //     }
  //     spa.finallyOnRender = spa.runOnceOnRenderFunctions = undefined;
  //   }
  // };

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

  //Extend jQuery for Util Functions
  $.fn.extend({
    renameAttr: function(oldName, newName){
      this.each(function(){
        this.setAttribute(newName, this.getAttribute(oldName));
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
      return spa.bindData(this, data, elFilter);
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
      if ((!!disable) || spa.is(disable, 'undefined')) {
        return this.css('pointer-events', 'none').addClass('disabled').attr('disabled', 'disabled');
      } else {
        return this.enable(true);
      }
    },
    enable: function(enable){
      if ((!!enable) || spa.is(enable, 'undefined')) {
        return this.css('pointer-events', 'auto').removeClass('disabled').removeAttr('disabled');
      } else {
        return this.disable(true);
      }
    },
    value:function(newValue, eventAfterUpdate){
      if (spa.is(newValue, 'undefined')) {
        return this.val();
      } else {
        this.each(function(){
          $(this).val(newValue).trigger(eventAfterUpdate || 'change');
        });
        return this;
      }
    },
    htm:function(newValue){
      if (spa.is(newValue, 'undefined')) {
        return this.html();
      } else {
        this.each(function(){
          $(this).html( spa.sanitizeScript(newValue) );
        });
        return this;
      }
    },
    dataJSON:function(key, newValue, overWrite){
      var curElData;
      if (arguments.length) {
        curElData = spa.toJSON(this.data(key));
        curElData = spa.is(curElData, 'object')? curElData : {};
        if (!spa.is(newValue, 'undefined')) {
          curElData = overWrite? newValue : (_.merge(curElData, newValue));
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
      spa.trackFormElChange(this);
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
            isChanged = spa.isElValueChanged( $elements[i] );
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
          if (spa.is(elFilter,'string')) {
            var elIDs = $form.find(elFilter).map(function(){ return this.id; }).get().join();
            vResponse = spa.validateForm(formId, elIDs, showMsg, validateAll);
          } else {
            vResponse = spa.validateForm(formId, arguments[0], arguments[1]);
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
        spa._validate._showValidateMsg(el, invalidErrMsg, isValid);
      });
    },
    updateValidationPromise: function(promiseNames, isValid, invalidErrMsg){
      spa.updateValidationPromise(promiseNames, this, invalidErrMsg, isValid);
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

  //API Section begins
  spa.api = {
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
      apiKey = (apiKey||'').trimLeftStr(spa.api.urlKeyIndicator);
      urlReplaceKeyValues = urlReplaceKeyValues || {};

      var apiUrl = (spa.api.urls[apiKey] || apiKey)
        , isStaticUrl = apiUrl.beginsWithStr('!') || spa.api.mock || app.api.mock
        , forceParamValuesInMockUrls = apiUrl.beginsWithStr('!!') || apiUrl.beginsWithStr('~') || spa.api.forceParamValuesInMockUrls
        , paramsInUrl = _.uniq(apiUrl.extractStrBetweenIn('{', '}'))
        , pKey, pValue;

      if (!spa.isBlank(paramsInUrl)) {
        _.each(paramsInUrl, function(param){
          pKey   = param.replace(/[{}<>]/g, '');
          if (pKey) {
            pValue = spa.findSafe(urlReplaceKeyValues, pKey, urlReplaceKeyValues['_undefined']);
            pValue = ((isStaticUrl && !forceParamValuesInMockUrls)? (param.containsStr('>')? pValue : ('_'+pKey)) : pValue);
            apiUrl = apiUrl.replace(new RegExp(param.replace(/([^a-zA-Z0-9])/g,'\\$1'), 'g'), pValue);
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
      spa.console.error([jqXHR, textStatus, errorThrown]);
      spa.console.error($(jqXHR.responseText).text());
    },
    onResError : function () {
      //This function is to handle when spa.api.isCallSuccess returns false
    },
    _call : function(ajaxOptions){
      /* set additional options dataType, error, success */
      var defAjaxOptions = spa.findSafe(window, 'app.api.ajaxOptions', {});
      var apiErroHandle = (spa.is(ajaxOptions, 'object') && ajaxOptions.hasOwnProperty('error'))? ajaxOptions['error'] : (app.api['onError'] || spa.api.onReqError);

      ajaxOptions = $.extend({}, defAjaxOptions, ajaxOptions,  {
        error: apiErroHandle,
        success: function(axResponse, textStatus, jqXHR) {
          axResponse = (_.isString(axResponse) && (String(this.dataType).toLowerCase() != 'html'))? spa.toJSON(axResponse) : axResponse;
          if (spa.api['isCallSuccess'](axResponse)) {
            ajaxOptions._success.call(this, axResponse, textStatus, jqXHR);
          }
          else {
            if ( spa.is(app.api['onResError'], 'function') ) {
              app.api.onResError.call(this, axResponse, textStatus, jqXHR);
            } else {
              spa.api.onResError.call(this, axResponse, textStatus, jqXHR);
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

      if (ajaxOptions['data'] && spa.is(ajaxOptions['data'], 'object') && ajaxOptions['stringifyPayload']) {
        delete ajaxOptions['stringifyPayload'];
        ajaxOptions['data'] = JSON.stringify(ajaxOptions['data']);
      }

      if (ajaxOptions['defaultPayload']) {
        var reqPayloadType = spa.of(ajaxOptions['data'])
          , defaultPayload = ajaxOptions['defaultPayload']
          , defaultPayloadX = (spa.is(defaultPayload, 'function')? defaultPayload(reqPayload) : (spa.is(defaultPayload, 'object')? _.merge({}, defaultPayload) : defaultPayload))
          , reqPayload = (reqPayloadType == 'string')? spa.toJSON(ajaxOptions['data']) : ajaxOptions['data'];

        if (spa.is(defaultPayloadX, 'object')) {
          var finalReqPayload = (spa.is(reqPayload, 'object'))? _.merge({}, defaultPayloadX, reqPayload) : defaultPayloadX;
          if (!spa.isBlank(finalReqPayload) && (reqPayloadType == 'string')) {
            finalReqPayload = JSON.stringify(finalReqPayload);
          }
          ajaxOptions['data'] = finalReqPayload;
        }
      }

      if ((ajaxOptions.url).beginsWithStr(spa.api.urlKeyIndicator)){
        ajaxOptions.url = spa.api.url((ajaxOptions.url).trimLeftStr(spa.api.urlKeyIndicator), ajaxOptions.data);
      }

      if (app['debug'] || spa['debug']) console.info(['API(ajax) call with options', ajaxOptions]);

      return $.ajax(ajaxOptions);
    },
    _params2AxOptions : function(){
      var oKey, axOptions = {method:'GET', url:'', data:{}, _success:function(){}, async: true }, hasPayLoad, axOverrideOptions, hasSuccessFn;
      _.each(arguments, function(arg){
        switch(true){ //NOTE: DON'T CHANGE THE ORDER
          case (_.isString(arg))  : oKey='url';
            if (axOptions['url']) {
              hasPayLoad = true;
              oKey='data';
            }
            break;
          case (spa.is(arg, 'function')):
            if (!hasSuccessFn) {
              hasSuccessFn = true;
              oKey='_success';
            } else {
              oKey='error';
            }
            break;
          case (_.isBoolean(arg)) : oKey='async'; break;
          case (_.isObject(arg))  :
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
          if ((''+(axOptions['url'])).beginsWithStr(spa.api.urlKeyIndicator)){
            axOptions.url = spa.api.url((axOptions.url).trimLeftStr(spa.api.urlKeyIndicator), axOverrideOptions['dataUrlParams']);
          }
          delete axOverrideOptions['dataUrlParams'];
        }
        _.merge(axOptions, axOverrideOptions);
      }
      spa.console.log('API ajax options >>');
      spa.console.log(axOptions);
      return (axOptions);
    },
    get : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call(spa.api._params2AxOptions.apply(undefined, arguments));
    },
    post: function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'POST'}));
    },
    put : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'PUT'}));
    },
    del : function(){ //Params: url:String, data:Object, onSuccess:Function, forceWaitForResponse:Boolean
      return spa.api._call($.extend(spa.api._params2AxOptions.apply(undefined, arguments), {method:'DELETE'}));
    },
    mix : function(){
      var apiQue=[], fnWhenDone = arguments[arguments.length-1];
      for(var i=0; i<arguments.length; i++){
        if (spa.is(arguments[i], 'array')) {
          apiQue = apiQue.concat(arguments[i]);
        } else if (!spa.is(arguments[i], 'function')) {
          apiQue.push(arguments[i]);
        }
      }

      return $.when.apply($, apiQue).done(function(){
        var apiResponses = Array.prototype.slice.call( arguments );

        if ((apiQue.length==1) && (apiResponses.length > 1) && (apiResponses[1] == 'success') ){
          //if only 1 ajax request with success response
          apiResponses[0] = spa.toJSON(apiResponses[0]);
          apiResponses.splice(1); //remove 2nd and 3d arguments 'success' and jqXHR
        } else {
          //multiple ajax requests
          _.each(apiResponses, function(apiRes, idx) {
            if ( apiRes && spa.is(apiRes, 'array')  && (apiRes.length > 1) && (apiRes[1] == 'success') ) {
              apiResponses[idx] = spa.toJSON(apiRes[0]);
            }
          });
        }

        if (fnWhenDone && spa.is(fnWhenDone, 'function')) {
          fnWhenDone.apply(undefined, apiResponses);
        }
      });
    }
  };//End of spa.api{}
  //API Section Ends

  spa.i18n.onLangChange;
  spa.i18n.displayLang = function(){
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
        $('.lang-icon').removeClass(Array.prototype.join.call($('[data-i18n-lang]').map(function(i, el){ return $(el).data('i18nLang'); }), ' '));
      }
      $('.lang-icon').addClass( (langClassType=='-')? selLangCode : selLangCode_ );
      spa.i18n.apply('.lang-text');
    }
    return selectedLang;
  };
  function init_i18n_Lang() {
    // function setLang(uLang, options, isAuto) {
    //   if (uLang) {
    //     if (spa.i18n.onLangChange) {
    //       var fnOnLangChange = spa.i18n.onLangChange,
    //           nLang = (spa.is(fnOnLangChange,'function'))? fnOnLangChange.call(undefined, uLang, isAuto) : uLang;
    //       uLang = (spa.is(nLang, 'string'))? nLang : uLang;
    //     }
    //     $('html').attr('lang', uLang.replace('_', '-'));
    //     spa.i18n.setLanguage(uLang, _.merge({}, spa.defaults.lang, spa.findSafe(window, 'app.conf.lang', {}), spa.findSafe(window, 'app.lang', {}), (options||{}) ));
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
        $('.lang-icon').removeClass(Array.prototype.join.call($('[data-i18n-lang]').map(function(i, el){ return $(el).data('i18nLang'); }), ' ')).addClass( (langClassType=='_')? selLangCode_ : selLangCode);
        $('[data-i18n-lang]').removeClass('active');
        $('[data-i18n-lang="'+(selLangCode)+'"],[data-i18n-lang="'+(selLangCode_)+'"]').addClass('active');
        spa.i18n.apply('.lang-text');
      }});
    });

    var defaultLang = ($('body').attr('i18n-lang') || '').replace(/ /g,''), initialLang = defaultLang.split(',')[0];
    if (defaultLang) {
      if (initialLang == '*') {
        initialLang = spa.i18n.browserLang();
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
          spa.i18n.displayLang();
        }, 500);
      }
    }
  }

  function _isLiveApiUrl(apiUrl, liveApiUrls){
    var retValue = '',
        liveApiPrefix = liveApiUrls || spa.findSafe(window, 'app.api.liveApiPrefix', ''),
        isMockUrl = apiUrl.beginsWithStr('!');

    apiUrl = apiUrl.trimLeftStr('!');
    if (liveApiPrefix) {
      var liveApiPrefixLst = [], i=0, len=0, liveApiPrefixX;
      if (spa.is(liveApiPrefix, 'string')) {
        liveApiPrefixLst = liveApiPrefix.split(',');
      } else if (spa.is(liveApiPrefix, 'array')) {
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
    var reqHeaders = spa.findSafe(window, 'app.api.reqHeaders');
    var reqHeadersToSend = (is(reqHeaders, 'function'))? reqHeaders(req, options) : reqHeaders;
    if (is(reqHeadersToSend, 'object')) {
      _.forEach(Object.keys(reqHeadersToSend), function(reqHeadKey){
        req.setRequestHeader(reqHeadKey, reqHeadersToSend[reqHeadKey]);
      });
    } else if (is(reqHeadersToSend, 'string')) {
      if (_isLiveApiUrl(options.url)) {
        options['data'] = options['data'] || '';
        options['data'] += (spa.isBlank(options['data'])? '':'&') + reqHeadersToSend;
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

  function _isFn() { return (typeof arguments[0] === 'function'); }
  function _isObj() { return (typeof arguments[0] === 'object'); }
  function _ajax( options ){

    var axOptions = {
      url: '',
      responseType: 'json', // text, html, css, csv, xml, json, pdf, zip
      async: true,
      cache: false,
      method: 'GET',    // GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE
      headers: {},      // {key: 'value'} or function which returns {key: 'value'}
      auth: null,       // { user: '', pwd: ''},
      timeout: 0,       // 0=No Timeout; in milliseconds
      success: null,    // function(response, statusCode, XHR){}
      error: null,      // function(statusCode, statusText, XHR){}
      finally: null     // function(response, statusCode, XHR){}

      //data:
      //onAbort:            function(XHR, event){}
      //onError:            function(XHR, event){}
      //onLoad:             function(XHR, event){}
      //onLoadEnd:          function(XHR, event){}
      //onLoadStart:        function(XHR, event){}
      //onProgress:         function(XHR, event){}
      //onReadyStateChange: function(XHR, event){}
      //onTimeout:          function(XHR, event){}
    };

    var contentTypes = {TEXT:'text/plain', HTML:'text/html', CSS:'text/css', CSV:'text/csv', XML:'text/xml', JSON:'application/json', PDF:'application/pdf', ZIP:'application/zip' },
        axResType = axOptions.responseType.toUpperCase(),
        contentType = contentTypes[ axResType ] || axOptions.responseType,
        axHeaders = {};

    // updating axOptions
    Object.keys(options || {}).forEach(function(oKey){
      axOptions[oKey] = options[oKey];
    });

    axOptions.method = axOptions.method.toUpperCase();

    // Set Headers
    if (_isFn(axOptions.headers)) {
      axOptions.headers = axOptions.headers.call(undefined, axOptions);
    }
    if (_isObj(axOptions.headers)) {
      Object.keys(axOptions.headers).forEach(function(oKey){
        axHeaders[oKey] = axOptions.headers[oKey];
      });
    }

    if (contentType) {
      axHeaders['Content-Type'] = contentType;
    }
    axHeaders['Cache-Control'] = axOptions.cache? 'max-age=86400000' : 'no-cache, no-store, must-revalidate, max-age=0';
    axHeaders['Expires']       = axOptions.cache? ((new Date( (new Date()).setDate( (new Date()).getDate() + 1 ) )).toUTCString()) : '0';
    if (!axOptions.cache) {
      axHeaders['Pragma'] = 'no-cache';
    }

    //----------------------------------------------------------------------
    // Create new HTTP Request Object
    var xhr = new XMLHttpRequest(), axData;

    xhr['requestOptions'] = axOptions;

    // Setup timeout
    if (axOptions.timeout) {
      xhr.timeout   = axOptions.timeout;
    }

    var onReadyStateChange;

    Object.keys(axOptions).forEach(function(oKey){
      var eName = oKey.toLowerCase();
      if ((eName === 'onreadystatechange') && (_isFn(axOptions[oKey]))) {
        onReadyStateChange = axOptions[oKey];
      } else if ((eName.indexOf('on') === 0) && (_isFn(axOptions[oKey]))) {
        xhr[eName] = function(e){
          axOptions[oKey].call(axOptions, xhr, e);
        };
      }
    });

    // Setup our listener to process request state changes
    xhr.onreadystatechange = function (e) {

        if (onReadyStateChange) {
          onReadyStateChange.call(axOptions, xhr, e);
        }

        // Only run if the request is complete
        if (xhr.readyState !== 4) return;

        var xhrResponse = xhr.responseText;

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
          if (axResType === 'JSON') {
            try {
              if (xhrResponse) {
                xhrResponse = JSON.parse(xhrResponse);
              }
            } catch(e) {
              xhrResponse = xhr.responseText;
              console.warn('Invalid JSON response.', xhrResponse, xhr, e);
            }
          }
          // This will run when the request is successful
          if (_isFn(axOptions.success)) {
            axOptions.success.call(axOptions, xhrResponse, xhr.status, xhr);
          }
        } else {
            // This will run when it's not
            if (_isFn(axOptions.error)) {
              axOptions.error.call(axOptions, xhr.status, xhr.statusText, xhr);
            }
        }

        // This will run always
        if (_isFn(axOptions.finally)) {
          axOptions.finally.call(axOptions, xhrResponse, xhr.status, xhr);
        }

    };

    if (axOptions.hasOwnProperty('data') && axOptions.method === 'GET') {
      axData = (_isObj(axOptions['data']))? _toQueryString(axOptions['data']) : (''+axOptions['data']);
      if (axData) {
        axOptions.url += ((axOptions.url.indexOf('?') < 0)? '?' : ((/\?$|\&$/.test(axOptions.url))? '' : '&')) + axData;
      }
    }

    // Open request
    // The first argument is the post type (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
    // The second argument is the endpoint URL
    // The third arugment is async: true/false
    try {
      if (axOptions.auth && (_isObj(axOptions.auth))) {
        if (axOptions.auth.hasOwnProperty('user')) {
          if (axOptions.auth.hasOwnProperty('pwd')) {
            xhr.open(axOptions.method, axOptions.url, axOptions.async, axOptions.auth.user, axOptions.auth.pwd);
          } else {
            xhr.open(axOptions.method, axOptions.url, axOptions.async, axOptions.auth.user);
          }
        }
      } else {
        xhr.open(axOptions.method, axOptions.url, axOptions.async);
      }

      // Set Request Headers
      Object.keys(axHeaders).forEach(function(oKey){
        xhr.setRequestHeader(oKey, axHeaders[oKey]);
      });

      // Send Payload
      if ((axOptions.method !== 'GET') && axOptions.hasOwnProperty('data')) {
        axData = (_isObj(axOptions['data']))? JSON.stringify(axOptions['data']) : axOptions['data'];
        xhr.send( axData );
      } else {
        xhr.send();
      }
    }catch(e){
      console.warn('Ajax-Exception', xhr, e);
    }

    return xhr;
  }
  spa.ajax = _ajax;

  function _mockSysTest() {
    if (app['api']) {
      _ajax({url: _mockFinalUrl(), method:'HEAD', error:function(){
          var mockBaseUrlExternal = spa.findSafe(app, 'api.mockBaseUrl') || spa.findSafe(spa, 'api.mockBaseUrl') || '';
          var mockBaseUrl  = ((mockBaseUrlExternal || location.origin).trimRightStr('/')) + '/',
              mockRootFldr = mockBaseUrlExternal? '' : ((spa.findSafe(app, 'api.mockRootFolder') || spa.findSafe(spa, 'api.mockRootFolder') || 'api_').trimRightStr('/')),
              newMockAddress = prompt('Enter Mock Root Address: http[s]://server.address[:port]/root-folder', mockBaseUrl+mockRootFldr);
          if (newMockAddress) {
            var rootIndex = newMockAddress.indexOf('/', 8),
                newMockBaseUrl  = (rootIndex > 0)? newMockAddress.slice(0, rootIndex) : newMockAddress,
                newMockRootFldr = (rootIndex > 0)? newMockAddress.substr(rootIndex+1) : '';
            app.api['mockBaseUrl']    = (newMockBaseUrl == location.origin)? '' : newMockBaseUrl;
            app.api['mockRootFolder'] = newMockRootFldr;
            _mockSysTest();
          }
        }});
    }
  }
  spa.mockSysTest = _mockSysTest;

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
        mockBaseUrl  = spa.findSafe(app, 'api.mockBaseUrl') || spa.findSafe(spa, 'api.mockBaseUrl') || '',
        mockRootFldr = mockBaseUrl? '' : (((spa.findSafe(app, 'api.mockRootFolder') || spa.findSafe(spa, 'api.mockRootFolder') || 'api_').trimRightStr('/')) + '/'),
        mockDataFile = spa.findSafe(app, 'api.mockDataFile') || spa.findSafe(spa, 'api.mockDataFile') || '',
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

    if ((options.url).beginsWithStr(spa.api.urlKeyIndicator)) {
      options.url = spa.api.url((options.url).trimLeftStr(spa.api.urlKeyIndicator), options.data);
    }
    var actualUrl = options.url, isMockReq;

    //any request Header to send?
    var reqHeaders = spa.findSafe(window, 'app.api.reqHeaders');
    if (reqHeaders) {
      options['beforeSend'] = function(req) {
        _ajaxSetReqHeaders(req, options);
      };
    }

    //Common Request Error Handling if not defined
    if ((options['dataType'] != 'script') && (!options.hasOwnProperty('error'))) {
      options['error'] = app.api['onError'] || spa.api.onReqError;
    }

    var liveApiPrefixStr = '', regExUrlParams = /({+)([^}])*(}+)/, urlParamsData;
    if (spa.api.mock || app.api.mock || actualUrl.beginsWithStr('!')) {
      if (actualUrl.beginsWithStr('~')) { //force Live While In Mock
        options.url = (_isRelativePath(actualUrl.trimLeftStr('~'))? (spa.api.baseUrl||'') : '') + (actualUrl.trimLeftStr('~')) + (spa.api.liveUrlSuffix||'');
        if (spa.api.baseUrl) options['crossDomain'] = true;
      } else {
        var reqMethod = ('/'+options['type'].toUpperCase()).replace('/GET', '');
        options['type'] = 'GET'; //force GET for mock URLs
        liveApiPrefixStr = _isLiveApiUrl(actualUrl);
        actualUrl = actualUrl.trimLeftStr('!');
        if (liveApiPrefixStr) {
          if (!actualUrl.containsStr('\\?')) {
            actualUrl = actualUrl.trimRightStr('/') + '?';
          }

          if ( regExUrlParams.test(actualUrl) ) {
            spa.console.log('URL has undefined params >>', actualUrl, options.data);
            try {
              urlParamsData = (spa.is(options.data, 'string'))? JSON.parse(options.data) : options.data;
              actualUrl = spa.api.url(actualUrl.replace(/{{/g,'{').replace(/}}/g,'}'), urlParamsData);
            } catch(e){}
            spa.console.log('Updated URL>>', actualUrl);
          }

          var finalMockUrl = _mockFinalUrl(actualUrl, reqMethod, liveApiPrefixStr);
          options.url = finalMockUrl;

          if (app['debug'] || spa['debug']) console.warn(">>>>>>Intercepting Live API URL: [" + actualUrl + "] ==> [" + finalMockUrl + "]");
          isMockReq = true;
        }
      }
    } else {
      liveApiPrefixStr = _isLiveApiUrl(actualUrl);
      if (app['debug'] || spa['debug']) console.log('actualUrl:'+actualUrl+',baseUrl:'+spa.api.baseUrl+',liveApiPrefix:'+liveApiPrefixStr);
      if (liveApiPrefixStr) {
        options.url = (_isRelativePath(actualUrl)? (spa.api.baseUrl||'') : '') + actualUrl + (spa.api.liveUrlSuffix||'');
        if (spa.api.baseUrl) options['crossDomain'] = true;
      }
    }

    spa.console.log('Remove mock params if any in URL>', options.url);
    options.url = (options.url).replace(/{{([^}])*}}(\/*)/g,''); //remove any mock url-params {{<xyz>}}

    if ( regExUrlParams.test(options.url) ) {
      spa.console.log('URL has undefined params>', options.url, options.data);
      try {
        urlParamsData = (spa.is(options.data, 'string'))? JSON.parse(options.data) : options.data;
        options.url = spa.api.url((options.url).replace(/{</g,'{').replace(/>}/g,'}'), urlParamsData);
      } catch(e){}
    }
    //Final Ajax URL
    spa.console.log('Final Ajax URL>', options.url);

    if ( regExUrlParams.test(options.url) || (/<([^>])*>/).test(options.url) ) {
      console.warn('URL has undefined params >>', options.url, options.data);
      options.url = options.url.replace(/[{<>}]/g, '_');
    }

    //Global defaultPayload
    var defaultPayloadGlobal  = app.api['defaultPayload'] || spa.api['defaultPayload'];
    if (defaultPayloadGlobal) {
      var reqPayloadType  = spa.of(options['data'])
        , reqPayload      = (reqPayloadType == 'string')? spa.toJSON(options['data']) : options['data']
        , defaultPayloadFnRes, finalReqPayload;

      if (spa.is(defaultPayloadGlobal, 'function')) {
        defaultPayloadFnRes = defaultPayloadGlobal.call(options, reqPayload, options);
        if (spa.is(defaultPayloadFnRes, 'object')) {
          finalReqPayload = JSON.parse(JSON.stringify( defaultPayloadFnRes ));
          if (!spa.isBlank(finalReqPayload)) {
            options['data'] = (reqPayloadType == 'string')? JSON.stringify(finalReqPayload) : finalReqPayload;
          }
        }
      } else {
        if (spa.is(defaultPayloadGlobal, 'object|array')) {
          finalReqPayload = JSON.parse(JSON.stringify( defaultPayloadGlobal ));
        } else {
          finalReqPayload = defaultPayloadGlobal;
        }
        finalReqPayload = (spa.is(finalReqPayload, 'object|array') && spa.is(reqPayload, 'object|array'))? _.merge({}, finalReqPayload, reqPayload) : finalReqPayload;
        options['data'] = (!spa.isBlank(finalReqPayload) && (reqPayloadType == 'string'))? JSON.stringify(finalReqPayload) : finalReqPayload;
      }
    }

    if (spa.ajaxPreProcess) {
      spa.ajaxPreProcess(options, orgOptions, jqXHR);
    }

    if (spa.isBlank( options['data'] ) || (spa.is(options['data'], 'string') && !(/[a-z0-9]/i.test(options['data'])))) {
      spa.console.log( 'REMVOING EMPTY PAYLOAD' );
      delete options['data'];
    }
    if (isMockReq) {
      var payLoadInMock = spa.is(options['data'], 'string')? options['data'] : JSON.stringify(options['data']);
      if (payLoadInMock && spa.is(payLoadInMock, 'string') && payLoadInMock.length > 6144) {
        payLoadInMock = 'LAREGE-PAYLOAD-WITH-CHAR-LENGTH:'+(payLoadInMock.length);
      }
      options['headers'] = _.merge({}, options['headers'], {
            'Z-Live-URL': actualUrl
          , 'Z-Payload': payLoadInMock
        });
      delete options['data'];
    }

    if (app['debug'] || spa['debug']) console.log('ajax Options', options);
  }

  /* Pub/Sub */
  var _PubSubQue = {};
  var _PubSub = {
    pub: function(eventName, data, onAllOk, onAnyFail){
      var eventData, isFailed;
      if (spa.is(data, 'function')) {
        onAnyFail = arguments[2];
        onAllOk   = arguments[1];
      } else {
        eventData = arguments[1];
      }

      var subCount=0, fn2Call, fnResponse, retValue=[];
      _.each(_PubSubQue[eventName], function(sub){
        try{
          subCount++;
          fn2Call = sub.fn;
          fnResponse = null;
          if (fn2Call) {
            fnResponse = fn2Call.call(eventData||{}, eventName, eventData, onAllOk, onAnyFail);
          }
          retValue.push({id: ''+(sub.name || subCount), response: fnResponse});
          if (!isFailed && spa.is(fnResponse, 'boolean')){
            isFailed = !fnResponse;
          }
        } catch(e){
          console.warn('Execution error in subscribed function:'+sub.name+' on-'+eventName);
          console.error(e.stack);
        }
      });
      if (isFailed) {
        if (onAnyFail && spa.is(onAnyFail, 'function')) {
          onAnyFail(retValue);
        }
      } else {
        if (onAllOk && spa.is(onAllOk, 'function')) {
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
  spa.event = {
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
    _prevUrlHash = spa.urlHashFull( _urlHashBase );

    _urlHashBase        = (spa.findSafe(spa, 'defaults.routes.base', '')            || '#').trim();
    _blockNavClassName  = (spa.findSafe(spa, 'defaults.routes.className.block', '') || 'BLOCK-SPA-NAV').trim();
    _blockNavClass      = ('.'+_blockNavClassName);
    _allowNavClassName  = (spa.findSafe(spa, 'defaults.routes.className.allow', '') || 'ALLOW-SPA-NAV').trim();
    _hideNavClassName   = (spa.findSafe(spa, 'defaults.routes.className.hide', '')  || 'HIDE-SPA-NAV').trim();
    //_hideNavClass       = ('.'+_hideNavClassName);
    _attrSpaRoute       = (spa.findSafe(spa, 'defaults.routes.attr.route', '')      || 'data-spa-route').trim();
    _attrSpaRouteParams = (spa.findSafe(spa, 'defaults.routes.attr.params', '')     || 'data-spa-route-params').trim();
    _routeByHref        = (_attrSpaRoute.equalsIgnoreCase('href'));
    _attrOnNavAway      = (spa.findSafe(spa, 'defaults.routes.attr.onNavAway', '')  || 'onNavAway').trim();

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

  var _skipUrlChangeOn = 'x'+spa.now();
  function _onPopStateChange(e){
    _routeSpaUrlOnHashChange();

    if (_curBlockedUrlHash && _curBlockedUrlHash != _skipUrlChangeOn) {
      spa.console.warn('Blocked:', _curBlockedUrlHash);
      _curBlockedUrlHash = _skipUrlChangeOn;
    } else {
      if (_curBlockedUrlHash != _skipUrlChangeOn) {
        //custom function trigger
        if (spa.onUrlHashChange) {
          spa.onUrlHashChange(spa.urlHash([], _urlHashBase), e);
        } else if (spa.onUrlChange) {
          spa.onUrlChange(spa.urlHash([], _urlHashBase), e);
        }
      }
      _curBlockedUrlHash = '';
    }
  }
  function _onWindowReload(){
    var fnRes, i18nMsgKey, retValue;
    if (spa.onReload) {
      fnRes = spa.onReload();
    }
    switch(spa.of(fnRes)) {
      case 'boolean':
        if (!fnRes) {
          i18nMsgKey = 'spa.message.on.window.reload';
          return spa.i18n.text(i18nMsgKey).replace(i18nMsgKey, '');//shows message only in IE and Firefox. NOT in Chrome!
        }
        break;
      case 'string':
        fnRes = fnRes.trim();
        if (fnRes) {
          i18nMsgKey = fnRes.beginsWithIgnoreCase('i18n')? fnRes.replace(/i18n(:)*/i,'') : '';
          retValue = i18nMsgKey? spa.i18n.text(i18nMsgKey).replace(i18nMsgKey) : fnRes;
        } else {
          retValue = fnRes;
        }
        return retValue;

      default:
        i18nMsgKey = 'spa.message.on.window.reload';
        if (_blockNav) {
          return spa.i18n.text(i18nMsgKey).replace(i18nMsgKey, ''); //shows message only in IE and Firefox. NOT in Chrome!
        }
        break;
    }
  }
  function _handleNavAwayEvent(toUrl, $byEl){
    _lastBlockedUrl = toUrl;
    spa.console.log('Trying to navigate away from:['+ _prevUrlHash +'] To:['+ toUrl +'] by', $byEl);
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
        navAwayFn = spa.findSafe(window, onNavAway.split('(')[0].split(';')[0] );
        if (navAwayFn && spa.is(navAwayFn, 'function')) {
          navAwayFn.call($container, toUrl, $container, $byEl);
        }
      }
    });
  }

  spa.blockNav     = _blockSpaNavigation;
  spa.allowNav     = _allowSpaNavigation;
  //spa.showNav      = _showSpaNavigation;
  //spa.hideNav      = _hideSpaNavigation;
  spa.isNavBlocked = _isSpaNavBlocked;
  spa.isNavAllowed = _isSpaNavAllowed;
  spa.isToShowNav  = _isToShowSpaNav;
  spa.isInBlockedSpaNavContainer = _inBlockedSpaNavContainer;

  function _ctrlBrwowserNav(){
    window.onpageshow   = _onpageshow;
    if (spa.isIE) {
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
    var urlHash = spa.urlHashFull(_urlHashBase);
    spa.console.log('on Hash Change: Url To [',urlHash,'] from[',_prevUrlHash,'] on click:',_routeOnClick,' block-Navigation:',_blockNav,'isDelayed:', _isDelayed);
    if ((!_isToShowSpaNav) || (!_routeOnClick && _blockNav)) {
      spa.console.log('------------->', _prevUrlHash, urlHash, _isDelayed, _isDelayedOnUrl);
      spa.console.log('lastBlocked:',_lastBlockedUrl);
      if (!_lastBlockedUrl) _lastBlockedUrl = _prevUrlHash;
      if (_urlHashBase[0] == '#') {
        _replaceUrlHash(_isDelayed? _isDelayedOnUrl : _prevUrlHash, urlHash);
        if (_lastBlockedUrl == urlHash) _handleNavAwayEvent(urlHash);
      } else {
        _replaceUrlHash(_isDelayed? _isDelayedOnUrl : _prevUrlHash, urlHash);
        _handleNavAwayEvent(urlHash);
      }

    } else {
      spa.console.log('Triggering next hash... by href:', _routeByHref, 'autoRoute:',_onAutoRoute, 'byClick', _routeOnClick);
      _triggerNextHash( _onAutoRoute || !_routeOnClick);
    }
  }

  var _dynHashProcessed = [];
  function _processDynHash(dynRouteHash, eventAfterProcess){
    var isDynamicHash = (dynRouteHash.indexOf(':')>=0)
      , e2Trigger = eventAfterProcess;
    if (spa.is(eventAfterProcess, 'boolean')) { e2Trigger = eventAfterProcess? 'click' : ''; }

    if (isDynamicHash) {
      //console.log('In _processDynHash', arguments, JSON.stringify(_dynHashProcessed));
      var dynamicHashKey = isDynamicHash? (dynRouteHash.split(':')[0]) : '';
      var routeStoreData = {}, pKey, pVal;
      var dynParamsArr = (dynRouteHash.indexOf('&')>0)? dynRouteHash.split('&') : ((dynRouteHash.indexOf(',')>0)? dynRouteHash.split(',') : [dynRouteHash]);
      _.each(dynParamsArr, function(keyValue){
        pKey = (keyValue).split(':')[0];
        pVal = keyValue.getRightStr(':');
        routeStoreData[ pKey ] = decodeURIComponent( pVal );
      });
      //console.log('paramsobj:',routeStoreData);
      var $routeStoreEl = $('['+(_attrSpaRoute)+'*="/'+dynamicHashKey+':"]['+_attrSpaRouteParams+']');
      var routeStoreSpec = ($routeStoreEl.attr(_attrSpaRouteParams) || '').trim();
      //console.log($routeStoreEl, routeStoreSpec);
      isDynamicHash = !spa.isBlank(routeStoreSpec);
      if (isDynamicHash) {
        _dynHashProcessed.push(dynRouteHash);
        var routeStoreSpecObj = spa.toJSON(routeStoreSpec);
        //console.log('specObj:', routeStoreSpecObj);
        _.each(routeStoreSpecObj, function(elSelector, key){
          elSelector = elSelector.trim();
          if ((/(^app\.(.)+\.)|(^\$)|(^\#)/).test(elSelector)) {
            spa.setElValue(elSelector, routeStoreData[key]);

          } else if (( /^fn:/i ).test(elSelector)) {
            var fn2Exec = ((elSelector.split(' ')[0]).getRightStr(':').trim()).split('(')[0];
            fn2Exec = (fn2Exec)? spa.findSafe(window, fn2Exec) : '';
            if (fn2Exec && spa.is(fn2Exec, 'function')) {
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
    var hashList = spa.urlHash([], _urlHashBase), routeHash='', pIndex;
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
  //spa.processDynHashInUrl = _processDynHashInUrl;

  function _triggerNextHash( reset ){
    //console.log('Finding next hash ...', reset);
    if (reset) _initAutoRoute();
    _onAutoRoute = spa.is(reset, 'undefined')? _onAutoRoute : reset;
    var hashList = spa.urlHash([], _urlHashBase), lastHashIndex = hashList.length-1, curHashName, isLastHash, prevHash;

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
    spa.console.log('_updateBrowserAddress >>>>>>>>>[', newAddress, ']delay:',delayUpdate,'prev:', _prevUrlHash);
    var useLink = (_urlHashBase[0] == '#');
    if (newAddress) {
      _prevUrlHash = newAddress;
      if (useLink) {
        spa.console.log( newAddress );
        var _hashUpdateLink = $('#_spaRouteLink_');
        if (!_hashUpdateLink.length) {
          _hashUpdateLink = $('<a id="_spaRouteLink_" href=""></a>');
          $('body').append(_hashUpdateLink);
        }
        spa.console.log('################# '+ newAddress );
        _hashUpdateLink.attr('href', newAddress)[0].click();
      } else {
        spa.console.log( newAddress );
        newAddress = (newAddress.trimLeftStr('/'));
        if (newAddress[0] != '#') {
          newAddress = '//' + window.location.host + _getAboluteUrl('/', newAddress);
          spa.console.log('updating the address bar with >>>>>', newAddress);
        }
        spa.console.log('>>>>>>>>>>>>>>>>> '+ newAddress );
        history.pushState(null, null, newAddress);
      }
    }
  }
  function _replaceUrlHash(newHashUrl, insteadOf) {
    if (newHashUrl != insteadOf) {
      spa.console.log('attempt to set URL:', newHashUrl, 'insteadOf', insteadOf);
      _curBlockedUrlHash = insteadOf;
      _updateBrowserAddress(newHashUrl);
    }
  }

  function _updateUrlHash(newHashUrl, delayUpdate, continueAutoRoute) {
    spa.console.log('Updating url with:', newHashUrl, 'delay:', delayUpdate, 'autoRoute:',continueAutoRoute);
    _onAutoRoute = continueAutoRoute;
    _isDelayed   = delayUpdate;
    _isDelayedOnUrl = delayUpdate? _prevUrlHash : '';
    if (delayUpdate) {
      _prevUrlHash = newHashUrl;
    } else {
      _routeOnClick  = true;
      if (spa.isToShowNav()) {
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

    var oldRoutes = spa.urlHash([], _urlHashBase);
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
  spa.parseRoutes = _getNewMatchingRoutes;

  function _onRouteElClick(e){
    var spaRoutePath = spa.urlHash([], _urlHashBase);
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
      var routeStoreSpecObj = spa.toJSON(routeStoreSpec), paramValue;
      _.each(routeStoreSpecObj, function(elSelector, key){
        paramValue = elSelector;
        if ((/(^app\.(.)+\.)|(^\$)|(^\#)/).test(elSelector.trim())) {
          paramValue = spa.getElValue(elSelector);

        } else if (( /^fn:/i ).test(elSelector.trim())) {
          var fn2Exec = ((elSelector.split(' ')[0]).getRightStr(':').trim()).split('(')[0];
          fn2Exec = (fn2Exec)? spa.findSafe(window, fn2Exec) : '';
          if (fn2Exec && spa.is(fn2Exec, 'function')) {
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
      if (spa.isBlank(spaRoutePath)) {
        update(routeData.substr(1));
      } else {
        e.preventDefault();
        continueAutoRoute = true;
        routeDir  = '/';
        routeName = spa.urlHash('', _urlHashBase);
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
        var revCount = spa.toInt(routeName.replace(/[^0-9]/g,'')) || 1;
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

    spa.console.log('Routing to...', newHashUrl, 'delay:', delayUpdate, 'prev:', _prevUrlHash);

    _updateUrlHash(newHashUrl, delayUpdate, continueAutoRoute);
  }

  function _onRouteAutoReg(){
    spa.route(this.getAttribute(_attrSpaRoute+'-AUTO').substr(1));
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
    _blockNav = spa.isNavBlocked();
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
          routes = spa.urlHash([], _urlHashBase);
          var revCount = spa.toInt(route.replace(/[^0-9]/g,'')) || 1;
          if (routes.length) {
            routes.length = routes.length-revCount;
          }
          break;
        case '?':
          // routes = spa.urlHash([], _urlHashBase);
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
    spa.console.log('Route:',routePath, 'URL:', newHashUrl);
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
            spa.allowNav();
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
          xStorage.setItem(('' + keyName), JSON.stringify(valueStr));
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
            return (k.indexOf(',') > 0) ? _all.apply(null, k.split(',')) : JSON.parse(xStorage.getItem(k));
          } else if (_type(k, 'array')) {
            return _all.apply(null, k);
          }
        } else {
          return _all.apply(null, arguments);
        }
      }

      function _all() {
        var filter = arguments.length;
        var filterKeys = Array.prototype.slice.call(arguments).map(function (x) {
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
            Array.prototype.slice.call(arguments).forEach(function( rKey ){
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
          var filterKeys = Array.prototype.slice.call(arguments).map(function (x) {
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
        var _typeOf = Object.prototype.toString.call(tOf).split(' ')[1].toLowerCase().replace(/\]$/gi, '');
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
    spa.sesStore = _StoreMgmt(sessionStorage);
  } catch(e){
    console.warn('No Access to sessionStorage.', e);
  }

  try {
    spa.locStore = _StoreMgmt(localStorage);
  } catch(e){
    console.warn('No Access to localStorage.', e);
  }


//  spa.sesStore = {
//    set: function(storeKey, storeValue){
//      sessionStorage.setItem(storeKey, JSON.stringify(storeValue));
//    },
//    get: function(storeKey){
//      return JSON.parse(sessionStorage.getItem(storeKey));
//    },
//    remove: function(storeKey){
//      sessionStorage.removeItem(storeKey);
//    },
//    clear: function(){
//      sessionStorage.clear();
//    }
//  };

  function _routeReloadUrl(compName){
    var redirUrl = (spa.sesStore.get('_spaReloadUrl')||'').trim();
    if (compName && (redirUrl.indexOf(compName)!=0)) return;
    if (redirUrl) {
      spa.sesStore.remove('_spaReloadUrl');
      redirUrl = redirUrl.replace(/.*#/gi,'');
      spa.route(redirUrl, true);
      return true;
    }
  }

  spa.reload = function(reloadUrl){
    if (reloadUrl) spa.sesStore.set('_spaReloadUrl', reloadUrl||'');
    spa.allowNav();
    window.location.reload();
  };

  spa.hasReloadUrl = function(){
    return !!(spa.sesStore.get('_spaReloadUrl')||'').trim();
  };

  spa.initRoutes = _initRouteHash;
  spa.route      = _routeNewUrl;
  spa.routeUrl   = _routeToUrl;
  spa.routeEl    = _$routeElements;
  /* ***************  SPA Route Solution Ends ************************ */

  /* 2way Data-Bind */
  function _getBindKeyOf(el, keyOf){
    var bindSpecStr = el.getAttribute('data-bind'), bindSpec, bindKeyFn, bindKey = '';
    if ((bindSpecStr) && (!bindSpecStr.containsStr(':'))) bindSpecStr = _defaultAttr(el)+":'"+bindSpecStr+"'";
    bindSpec = spa.toJSON(bindSpecStr || '{}');
    if (bindSpec && !$.isEmptyObject(bindSpec)) {
      _.some(_.keys(bindSpec), function (attrSpec) {
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
      , elValue = spa.getElValue(el), bindData={}
      , $component = $el.spa$()[0], cName=$el.spa$name()
      , is2WayBind = ('2way'.equalsIgnoreCase(spa.components[cName]['dataBindType']));
    el.classList.add('DATA-MODEL-CHANGE-SRC');

    var bindKey =_getBindKeyOf(el, 'value|$');
    spa.setSimpleObjProperty(bindData, bindKey, elValue);
    if (is2WayBind) {
      _.merge(spa.$data(cName), bindData);
      app[cName]['is$DataUpdated'] = spa.components[cName]['is$DataUpdated'] = true;
    }
    spa.bindData($component, bindData, '[data-bind*="'+bindKey+'"]:not(.DATA-MODEL-CHANGE-SRC)', true);
    el.classList.remove('DATA-MODEL-CHANGE-SRC');
    if (is2WayBind) spa.renderUtils.runCallbackFn('app.'+cName+'.$dataChangeCallback', app[cName].$data, app[cName]);
  }

  function _initDataBind(scope, elFilter){
    function _bindEvent(el, eName){
      $(el).on((el.getAttribute('data-bind-event') || eName).toLowerCase(), _onViewDataChange);
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
  spa.initDataBind = _initDataBind;

  function _init_SPA_DOM_(scope) {
    /*Reflow Foundation*/
    spa.reflowFoundation(scope);

    /*init KeyTracking*/
    _initKeyTracking('', scope);

    /*init KeyPauseEvent*/
    _initKeyPauseEvent(scope);

    /* Init Forms/Elements inside components */
    _initSpaElements(scope);

    /* Init Track Form Element's changes */
    spa.initTrackFormElChanges(scope);
    /*apply data-validation*/
    _initFormValidationInScope(scope);

    /*init SPA routes; a simple routing solution */
    _initRouteHash(scope);

    /* Init togglePassword (eye icon) */
    spa.initTogglePassword(scope);

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
    spa.i18n.apply('body');
  }

  /*
   * spa.async(fn)
   * spa.async(fn, callbackFn)
   * spa.async(fn, param1, param2, param3)
   * spa.async(fn, param1, param2, param3, callbackFn)
   */
  spa.async = function(fn){
    var fnArg = Array.prototype.slice.call(arguments, 1);
    function fnAsyc(){
      var fnRes = fn.apply(undefined, fnArg)
        , argLen = fnArg.length
        , nextFn = (argLen)? fnArg[argLen-1] : '';
      if (nextFn && spa.is(nextFn, 'function')) nextFn(fnRes);
    }
    setTimeout(fnAsyc, 0);
  };

  function _initApiUrls(){
    _appApiInitialized = !!(Object.keys(app['api']).length);
    if (_appApiInitialized) spa.console.log('Initializing app.api');

    var appApiBaseUrl = spa.findSafe(window, 'app.api.baseUrl');
    if (!spa.isBlank(appApiBaseUrl)) {
      spa.api.baseUrl = appApiBaseUrl;
    }

    var appApiUrls = spa.findSafe(window, 'app.api.urls');
    if (spa.isBlank(spa.api.urls) && !spa.isBlank(appApiUrls)) {
      spa.api.urls = app.api.urls;
    }

    if (!spa.isBlank(spa.api.urls)) {
      var liveApiPrefix = spa.findSafe(window, 'app.api.liveApiPrefix|app.api.mockRootAtPaths');
      if (!spa.isBlank(liveApiPrefix)) {
        var apiContextList = is(liveApiPrefix, 'array')? liveApiPrefix : (''+liveApiPrefix).split(',')
          , contextMode, urlMode;

        _.each(apiContextList, function(apiContext, idx){
          apiContext = apiContext.trim();
          contextMode = apiContext[0];
          if (contextMode == '!' || contextMode == '~') {
            apiContext = apiContext.substr(1);
            _.each(spa.api.urls, function(url, key){
              urlMode = url[0];
              if ( (!(urlMode == '!' || urlMode == '~'))
                && ((url.indexOf(apiContext) == 0) || (url.indexOf('/'+apiContext) > 0)) ) {
                spa.api.urls[key] = contextMode+url;
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
      if (spa.env && 'dev'.equalsIgnoreCase(spa.env)){
        spa.api.mock = true;
        var compDefaults = {
          components: {
            templateCache: false,
            callback: function(){
              console.log('spa$>', this.__prop__.componentName);
            }
          }};
        spa.defaults.set(compDefaults);
      }

      $.when( _init_SPA_() ).done(function(){
        /*SPA Init Complete - run_once*/
        $.when( runSpaEvent('onInitComplete') ).done(function(){
          /*SPA onReady - run_once*/
          $.when( runSpaEvent('onReady') ).done( spa.renderComponentsInHtml );
        });
      });
    }

    $.when( runSpaEvent('onInit') ).done( initSpaModules );
  }
  //spa.start = _initSpaApp;

  function _initSpaDefaults(){
    var defaultsInTag
      , $body  = $('body')
      , elBody = $body[0]
      , dataInBody = $body.data();

    if (!spa.isBlank(dataInBody)) {
      dataInBody['spaDefaults'] = spa.toJSON(elBody.getAttribute('data-spa-defaults') || {});

      _.each(Object.keys(spa.defaults), function(spaDefaultsKey){
        if (!spaDefaultsKey.equalsIgnoreCase( 'set' )) {
          defaultsInTag = dataInBody.spaDefaults[spaDefaultsKey] || dataInBody[ 'spaDefaults'+(spaDefaultsKey.toTitleCase()) ];
          if (!spa.isBlank(defaultsInTag)){
            _.merge(spa.defaults[spaDefaultsKey], spa.toJSON(defaultsInTag));
          }
        }
      });
    }

    _initRoutesDefaults(); //run_once
    _initApiUrls(); //need to run on 1st Component renderCallback as well
  }

  $(document).ready(function(){
    //Read spa.defaults from body
    _initSpaDefaults();

    /*onLoad Set spa.debugger on|off using URL param*/
    spa.debug = spa.urlParam('spa.debug') || spa.hashParam('spa.debug') || spa.debug;
    /* ajaxPrefilter */
    $.ajaxPrefilter(_ajaxPrefilter);

    _initSpaApp();

  });

})();

spa.console.info("spa loaded.");
