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
  spa.VERSION = '2.0.0';

  /* isIE or isNonIE */
  var isById = (document.getElementById)
    , isByName = (document.all);
  spa.isIE = (isByName) ? true : false;
  spa.isNonIE = (isById && !isByName) ? true : false;

  /*No Operation: a dummy function*/
  spa.noop = function(){};

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
      window.onhashchange = function (ocEvent) {
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

  String.prototype.isBlankStr = function () {
    return (this.trimStr() == "");
  };

  String.prototype.ifBlankStr = function (forNullStr, forNotNullStr) {
    forNullStr = forNullStr || "";
    forNotNullStr = (typeof forNotNullStr === "undefined")? this.trimStr() : forNotNullStr;
    return (this.isBlankStr() ? ( ("" + forNullStr).trimStr() ) : ( forNotNullStr ) );
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

  String.prototype.endsWithStrIgnoreCase = function (str, i) {
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

  spa.toJSON = function (str) {
    var thisStr;
    if (_.isString(str)) {
      thisStr = str.trimStr();
      if (thisStr.containsStr(":") && !thisStr.containsStr(",") && thisStr.containsStr(";")) {
        thisStr = thisStr.replace(/\;/g,',');
      }
      if (!(thisStr.beginsWithStr("{") || thisStr.beginsWithStr("\\["))) {
        if (thisStr.containsStr(":")) {
          thisStr = "{"+thisStr+"}"
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
    return spa.toJSON(this);
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
   * String.padStr(length: Integer, [padString: String = " "], [type: Integer = 0]): String
   * Returns: the string with a padString padded on the left, right or both sides.
   * length: amount of characters that the string must have
   * padString: string that will be concatenated
   * type: specifies the side where the concatenation will happen, where: 0 = left, 1 = right and 2 = both sides
   */
  String.prototype.padStr = function (l, s, t) {
      for (var ps = "", i = 0; i < l; i++) {
        ps += s;
      }
      return (((t === 0 || t === 2) ? ps : "") + this + ((t === 1 || t === 2) ? ps : ""));
    };

  spa.lastSplitResult = [];
  spa.getOnSplit = function (str, delimiter, pickIndex) {
    spa.lastSplitResult = str.split(delimiter);
    return (spa.getOnLastSplit(pickIndex));
  };
  spa.getOnLastSplit = function (pickIndex) {
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
      , retValue = (( ((disableKeys.padStr(1, ',', 2)).indexOf(keyCode.padStr(1, ',', 2)) >= 0) && (withShiftKey ? ((e.shiftKey) ? true : false) : ((!e.shiftKey)? true : false))));
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
  spa.isChecked = function (formId, eName) {
    return (($("input[name=" + eName + "]:checked", formId).length) > 0);
  };
  spa.radioSelectedValue = function (formId, rName) {
    var retValue = ($("input[name=" + rName + "]:checked", formId).val());
    return (retValue ? retValue : "");
  };
  spa.radioClearSelection = function (formId, rName) {
    ($("input[name=" + rName + "]:checked", formId).attr("checked", false));
  };
  spa.radioSelectForValue = function (formId, rName, sValue) {
    $("input[name=" + rName + "]:radio", formId).each(function(el) {
      el.checked = ((el.value).equalsIgnoreCase(sValue));
    });
  };
  spa.checkboxCheckedValues = function (formId, cbName, delimiter) {
    delimiter = delimiter || ",";
    return ($("input[name=" + cbName + "]:checked", formId).map(function () {
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

  spa.getElValue = function (el) {
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
        elValue = $(el).html();
        break;
    }
    return elValue;
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

  spa.queryStringToJson = function (qStr) {
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

  spa.findSafe = spa.locateSafe = spa.valueOfKeyPath = function (obj, pathStr, def) {
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

  spa.hasIgnoreCase = spa.hasKeyIgnoreCase = function (obj, pathStr) {
    var retValue = "", tObj = obj || {}, lookupPath = ""+spa.toDottedPath((pathStr));
    var objKeys = spa.keysDottedAll(tObj); //getAllKeys with dotted notation
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
  spa.addScript = function (scriptId, scriptSrc) {
    scriptId = scriptId.replace(/#/, "");
    spa.console.group("spaAddScript");
    if (!spa.isElementExist("#spaScriptsCotainer")) {
      spa.console.info("#spaScriptsCotainer NOT Found! Creating one...");
      $('body').append("<div id='spaScriptsCotainer' style='display:none' rel='Dynamic Scripts Container'></div>");
    }
    if (spa.isElementExist("#" + scriptId)) {
      spa.console.info("script [" + scriptId + "] already found in local.");
    }
    else {
      spa.console.info("script [" + scriptId + "] NOT found. Added script tag with src [" + scriptSrc + "]");
      $("#spaScriptsCotainer").append("<script id='" + (scriptId) + "' type='text/javascript' src='" + scriptSrc + "'><\/script>");
    }
    spa.console.groupEnd("spaAddScript");
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
        spa.addScript(scriptId, scriptPath);
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
    if (!spa.isElementExist("#spaViewTemplateCotainer")) {
      spa.console.info("#spaViewTemplateCotainer NOT Found! Creating one...");
      $('body').append("<div id='spaViewTemplateCotainer' style='display:none' rel='Template Container'></div>");
    }
    spa.console.info("Adding <script id='" + (tmplId) + "' type='text/" + tmplType + "'>");
    tmplBody = tmplBody.replace(/<( )*script/gi,'<_SCRIPTTAGINTEMPLATE_').replace(/<( )*(\/)( )*script/gi,'</_SCRIPTTAGINTEMPLATE_')
            .replace(/<( )*link/gi,'<_LINKTAGINTEMPLATE_').replace(/<( )*(\/)( )*link/gi,'</_LINKTAGINTEMPLATE_');
    $("#spaViewTemplateCotainer").append("<script id='" + (tmplId) + "' type='text/" + tmplType + "'>" + tmplBody + "<\/script>");
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
        retValue = (returnOf.length === 0) ? hashArray : _.object(returnOf, hashArray);
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
      }
    }
    return (retValue);
  };


  /* i18n support */
  spa.i18n = {};
  spa.i18n.loaded = false;
  spa.i18n.settings = {
    name: 'Language',
    path: 'language/',
    encoding: 'UTF-8',
    cache: true,
    mode: 'map',
    callback: null
  };
  spa.i18n.setLanguage = function (lang, i18nSettings) {
    if ($.i18n) {
      lang = lang || ($.i18n.browserLang()).replace(/-/g, "_");
      i18nSettings = $.extend(spa.i18n.settings, i18nSettings);
      $.i18n.properties({
        name: i18nSettings.name,
        language: lang,
        path: i18nSettings.path,
        encoding: i18nSettings.encoding,
        cache: i18nSettings.cache,
        async: i18nSettings.async,
        mode: i18nSettings.mode,
        callback: function () {
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
    i18nKey = (''+i18nKey).trim();
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
    return dMessage;
  };

  spa.i18n.apply = spa.i18n.render = function (contextRoot, elSelector) {
    if (spa.i18n.loaded || window['Liferay']) {
      contextRoot = contextRoot || "body";
      elSelector = elSelector || "";
      $(contextRoot).find(elSelector + "[data-i18n]").each(function (indes, el) {
        var i18nSpecStr = $(el).data("i18n") || '';
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
                  $(el).html(i18nValue);
                  break;
                case "text":
                  $(el).text(i18nValue);
                  break;
                default:
                  $(el).attr(attribute, i18nValue);
                  break;
              }
            });
          });
        }
      });
    }
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
        spa.console.info(">> " + elSelector + " found: " + $(elSelector, context).length);
        var dataValue = null;
        if ($(elSelector, context).length > 0) {
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
        $(elSelector, context).each(function (index, el) {
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
        _.each(saoDataUrl, function(apiUrl, urlIndex){
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
        _.each(_.keys(saoDataUrl), function(dName, kIndex){
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
  spa.defaults = {
    dataTemplateEngine: "handlebars"
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
                      , scripts               : "dataScripts"
                      , scriptsCache          : "dataScriptsCache"
                      , styles                : "dataStyles"
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
        _.forEach(keyMaps, function(value, key) {
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

    var spaRVOptions = {
      data: {}
      , dataUrl: ""
      , dataUrlErrorHandle: ""
      , dataParams: {}
      , dataModel: ""
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
      $("#spaRunTimeHtmlContainer").append("<div id='" + viewContainerId.replace(/\#/gi, "") + "'></div>")
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

    /*Render Id*/
    var spaRenderId = ("" + $(viewContainerId).data("renderId")).replace(/undefined/, "");
    if (!spa.isBlank(spaRVOptions.dataRenderId)) {
      spaRenderId = spaRVOptions.dataRenderId;
    }
    retValue.id = (spaRenderId.ifBlankStr(("spaRender" + (spa.now()) + (spa.rand(1000, 9999)))));

    var targetRenderMode = ("" + $(viewContainerId).data("renderMode")).replace(/undefined/, "");
    if (!spa.isBlank(spaRVOptions.dataRenderMode)) {
      targetRenderMode = spaRVOptions.dataRenderMode;
    }
    spa.console.log("Render Mode: <"+targetRenderMode+">");

    var spaTemplateType = "x-spa-template";
    var spaTemplateEngine = (spa.defaults.dataTemplateEngine || "handlebars");

    /* Load Scripts Begins */
    spa.console.group("spaLoadingViewScripts");
    if (!(useOptions && uOptions.hasOwnProperty('dataScriptsCache'))) /* NOT provided in Render Request */
    { /* Read from view container [data-scripts-cache='{true|false}'] */
      var scriptsCacheInTagData = ("" + $(viewContainerId).data("scriptsCache")).replace(/undefined/, "");
      if (!spa.isBlank(scriptsCacheInTagData)) {
        spaRVOptions.dataScriptsCache = scriptsCacheInTagData.toBoolean();
        spa.console.info("Override [data-scripts-cache] with [data-scripts-cache] option in tag-attribute: " + spaRVOptions.dataScriptsCache);
      }
    }
    else {
      spa.console.info("Override [data-scripts-cache] with user option [dataScriptsCache]: " + spaRVOptions.dataScriptsCache);
    }

    var vScriptsList = (""+ $(viewContainerId).data("scripts")).replace(/undefined/, "");
    if (vScriptsList && spa.isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
      vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'"
    }
    var vScripts = spa.toJSON(vScriptsList || "{}");

    /* Check the option to override */
    if ((!(_.isObject(spaRVOptions.dataScripts))) && (_.isString(spaRVOptions.dataScripts))) {
      vScriptsList = (spaRVOptions.dataScripts || "").trimStr();
      if (spa.isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
        vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'"
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
        var newScriptsObj = {};
        var dynScriptIDForContainer = "__scripts_"+(viewContainerId.trimStr("#"))+"_";
        _.each(vScripts, function(scriptUrl, sIndex){
          spa.console.log(scriptUrl);
          if (scriptUrl) {
            newScriptsObj[dynScriptIDForContainer + (sIndex)] = (""+scriptUrl);
          }
        });
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
    var dataModelName = ("" + $(viewContainerId).data("model")).replace(/undefined/, ""), viewDataModelName;
    if (!spa.isBlank(spaRVOptions.dataModel)) {
      dataModelName = spaRVOptions.dataModel;
    }
    var dataModelUrl = ("" + $(viewContainerId).data("url")).replace(/undefined/, ""); //from HTML
    if (!spa.isBlank(spaRVOptions.dataUrl)) {
      dataModelUrl = spaRVOptions.dataUrl;
    }
    var isLocalDataModel = (useParamData || (dataModelUrl.beginsWithStrIgnoreCase("local:")));
    var defaultDataModelName = (dataModelUrl.beginsWithStrIgnoreCase("local:")) ? dataModelUrl.replace(/local:/gi, "") : "data";
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
        var dataCacheInTagData = ("" + $(viewContainerId).data("cache")).replace(/undefined/, "");
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
        var dataModelCollection = ("" + $(viewContainerId).data("collection")).replace(/undefined/, ""); //from HTML
        if (dataModelCollection) dataModelCollection = spa.toJSON(dataModelCollection); //convert to json if found
        if (!spa.isBlank(spaRVOptions.dataCollection)) //override with javascript
        {
          dataModelCollection = spaRVOptions.dataCollection;
        }
        if (_.isArray(dataModelCollection)) dataModelCollection = {urls: dataModelCollection};

        var dataModelUrls = dataModelCollection['urls'];

        if (spa.isBlank(dataModelUrls)) {
          spa.console.warn("Model Data [" + dataModelName + "] or [data-url] or [data-collection] NOT found! Check the arguments or html markup. Rendering with empty data {}.");
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
                        , oResult = ("" + result).toJSON();

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
                var oResult = ("" + result).toJSON();
                if (dataModelName.indexOf(".") > 0) {
                  spaTemplateModelData[viewDataModelName] = spa.hasKey(oResult, dataModelName) ? spa.find(oResult, dataModelName) : oResult;
                }
                else {
                  try{
                    spaTemplateModelData[viewDataModelName] = oResult.hasOwnProperty(dataModelName) ? oResult[dataModelName] : oResult;
                  } catch(e) {
                    spa.console.error("Error in Data Model ["+dataModelName+"] in URL ["+dataModelUrl+"].\n" + e.stack);
                  }
                }
                spa.console.info("Loaded data model [" + dataModelName + "] from [" + dataModelUrl + "]");
              },
              error: function (jqXHR, textStatus, errorThrown) {
                //Call user defined function on Data URL Error
                var fnOnDataUrlErrorHandle = ("" + $(viewContainerId).data("urlErrorHandle")).replace(/undefined/, "");
                if (!spa.isBlank(spaRVOptions.dataUrlErrorHandle)) {
                  fnOnDataUrlErrorHandle = "" + spaRVOptions.dataUrlErrorHandle;
                }
                if (!spa.isBlank(fnOnDataUrlErrorHandle)) {
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

      var vTemplate2RenderInTag = ("" + $(viewContainerId).data("template")).replace(/undefined/, "");
      var vTemplatesList = (""+ $(viewContainerId).data("templates")).replace(/undefined/, "");
      if (vTemplatesList && spa.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
        vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'"
      }
      var vTemplates = spa.toJSON(vTemplatesList || "{}");//eval("(" + vTemplatesList + ")");//
      /* Check the option to override */
      if ((!(_.isObject(spaRVOptions.dataTemplates))) && (_.isString(spaRVOptions.dataTemplates))) {
        vTemplatesList = (spaRVOptions.dataTemplates || "").trimStr();
        if (spa.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
          vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'"
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
        var newTemplatesObj = {};
        var dynTmplIDForContainer = "__tmpl_"+(viewContainerId.trimStr("#"))+"_";
        _.each(vTemplates, function(templateUrl, sIndex){
          spa.console.log(templateUrl);
          if (templateUrl) {
            newTemplatesObj[dynTmplIDForContainer + (sIndex)] = (""+templateUrl);
          }
        });
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
          if (_dataTemplate.containsStr(":") && !_dataTemplate.beginsWithIgnoreCase("http")){
            _tmplKey = spa.getOnSplit(_dataTemplate, ":", 0).replace(/[^a-z0-9]/gi,'');
            _tmplLoc = spa.getOnLastSplit(1);
          } else {
            _tmplKey = (("__tmpl_"+(viewContainerId.trimStr("#"))+"_") + (spa.now()) + (spa.rand(1000, 9999)));
            _tmplLoc = _dataTemplate;
          }
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
          var templatesCacheInTagData = ("" + $(viewContainerId).data("templatesCache")).replace(/undefined/, "");
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
          var stylesCacheInTagData = ("" + $(viewContainerId).data("stylesCache")).replace(/undefined/, "");
          if (!spa.isBlank(stylesCacheInTagData)) {
            spaRVOptions.dataStylesCache = stylesCacheInTagData.toBoolean();
            spa.console.info("Override [data-styles-cache] with [data-styles-cache] option in tag-attribute: " + spaRVOptions.dataStylesCache);
          }
        }
        else {
          spa.console.info("Override [data-styles-cache] with user option [dataStylesCache]: " + spaRVOptions.dataStylesCache);
        }

        var vStylesList = (""+ $(viewContainerId).data("styles")).replace(/undefined/, "");
        if (vStylesList && spa.isBlank((vStylesList || "").replace(/[^:'\"]/g,''))){
          vStylesList = "'"+ ((vStylesList).split(",").join("','")) + "'"
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
            var newStylesObj = {};
            var dynStyleIDForContainer = "__styles_"+(viewContainerId.trimStr("#"))+"_";
            _.each(vStyles, function(styleUrl, sIndex){
              spa.console.log(styleUrl);
              if (styleUrl) {
                newStylesObj[dynStyleIDForContainer + (sIndex)] = (""+styleUrl);
              }
            });
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
              retValue.model = spaTemplateModelData[viewDataModelName];
              var spaViewModel = spaTemplateModelData[viewDataModelName], compiledTemplate;
              spa.viewModels[retValue.id] = retValue.model;

              var templateContentToBindAndRender = ($(vTemplate2RenderID).html() || "").replace(/_SCRIPTTAGINTEMPLATE_/g, "script").replace(/_LINKTAGINTEMPLATE_/g,"link");
              compiledTemplate = templateContentToBindAndRender;
              spa.console.log("Template Source:", templateContentToBindAndRender);
              if (!spa.isBlank(spaViewModel)) {
                if (Handlebars) {
                  var preCompiledTemplate = spa.compiledTemplates[vTemplate2RenderID] || (Handlebars.compile(templateContentToBindAndRender));
                  if (!spa.compiledTemplates.hasOwnProperty(vTemplate2RenderID)) spa.compiledTemplates[vTemplate2RenderID] = preCompiledTemplate;
                  compiledTemplate = preCompiledTemplate(spaViewModel);
                } else {
                  spa.console.error("handlebars.js is not loaded.");
                }
              }
              spa.console.log("Template Compiled:", compiledTemplate);

              doDeepRender = false;
              retValue.view = compiledTemplate;

              var targetRenderContainerType = ((""+ $(viewContainerId).data("renderType")).replace(/undefined/, "")).toLowerCase();
              if (!spa.isBlank(spaRVOptions.dataRenderType)) {
                targetRenderContainerType = spaRVOptions.dataRenderType;
              };

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

                /*init spaRoute*/
                spa.initRoutes(viewContainerId);
              };

              spa.console.log(retValue);

              /*run callback if any*/
              var _fnCallbackAfterRender = ("" + $(viewContainerId).data("renderCallback")).replace(/undefined/, "");
              if (spaRVOptions.dataRenderCallback) {
                _fnCallbackAfterRender = spaRVOptions.dataRenderCallback;
              }
              var isCallbackDisabled = (_.isString(fnCallbackAfterRender) && _fnCallbackAfterRender.equalsIgnoreCase("off"));
              spa.console.info("Processing callback: " + _fnCallbackAfterRender);

              if (!isCallbackDisabled) {
                if (isSpaHashRouteOn && spa.routes && spa.routes.hasOwnProperty("_renderCallback") && _.isFunction(spa.routes['_renderCallback'])) {
                  spa.console.info("calling default callback: spa.routes._renderCallback");
                  spa.routes['_renderCallback'].call(undefined, retValue);
                }

                if (_fnCallbackAfterRender) {
                  var fnCallbackAfterRender = _fnCallbackAfterRender;
                  if (_.isString(fnCallbackAfterRender)) {
                    fnCallbackAfterRender = spa.findSafe(window, fnCallbackAfterRender);
                  }
                  if (fnCallbackAfterRender) {
                    if (_.isFunction(fnCallbackAfterRender)) {
                      spa.console.info("calling callback: " + _fnCallbackAfterRender);
                      fnCallbackAfterRender.call(undefined, retValue);
                      //eval("("+fnCallbackAfterRender+"(retValue))");
                    } else {
                      spa.console.error("CallbackFunction <" + _fnCallbackAfterRender + " = " + fnCallbackAfterRender + "> is NOT a valid FUNCTION.");
                    }
                  } else {
                    if (("" + _fnCallbackAfterRender).beginsWithStr("spa") && (("" + _fnCallbackAfterRender).endsWithStr("_renderCallback"))) {
                      spa.console.warn("Default Route renderCallback function <" + _fnCallbackAfterRender + "> is NOT defined.");
                    } else {
                      spa.console.error("CallbackFunction <" + _fnCallbackAfterRender + "> is NOT defined.");
                    }
                  }
                }
              }

              /*Deep/Child Render*/
              if (doDeepRender) {
                //$("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]", viewContainerId).spaRender();
                $(viewContainerId).find("[rel='spaRender'],[data-render],[data-sparender],[data-spa-render]").spaRender();
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
        _.each(spa.runOnceOnRenderFunctions, function(fn, index){
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
        })
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
        })
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
        , defaultScriptPath = routeNameWithPath+".js"
        , defaultCallBeforeRoute = "spa.routes."+routeName+"_before"
        , defaultRenderCallback  = "spa.routes."+routeName+"_renderCallback"
        , useTargetOptions = spa.findIgnoreCase(oTagRouteOptions, "usetargetoptions")
        , spaRenderOptions = {
            dataRenderCallback : defaultRenderCallback
          , rElRouteOptions : oTagRouteOptions
          , rElDataAttr: ($elRouteBase)? $elRouteBase.data() : {}
        };

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
      if (oTagRouteOptions.hasOwnProperty("templatesCache")) {
        spaRenderOptions['dataTemplatesCache'] = oTagRouteOptions['templatesCache'];
      }
      if (oTagRouteOptions.hasOwnProperty("scriptsCache")) {
        spaRenderOptions['dataScriptsCache'] = oTagRouteOptions['scriptsCache'];
      }

      /*Templates*/
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
  });

})(this);

spa.console.info("spa loaded.");
