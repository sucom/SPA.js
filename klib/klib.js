/** @license K-Lib | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/* ===========================================================================
 * K-Lib is the collection of javascript functions which simplifies
 * the interfaces for commonly-used methods, and makes the coding simple
 *
 * Dependency: (hard)
 * 1. jQuery: http://jquery.com/
 * 2. lodash: https://lodash.com/
 *
 * Optional
 * {backbone}     : http://backbonejs.org/
 * {handlebars}   : http://handlebarsjs.com/ || https://github.com/wycats/handlebars.js/
 * {mustache}     : http://mustache.github.io/ || https://github.com/janl/mustache.js
 * {hogan}        : http://twitter.github.io/hogan.js/ || https://github.com/twitter/hogan.js
 *
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
var isKHashRouteOn=false;

/* K-Lib begins */
(function() {

  /* Establish the win object, `window` in the browser */
  var win = this;
  //var doc = win.document; //Unused
  //var loc = win.document.location;

  /* Save the previous value of the `klib` variable. */
  //var myklib = win.klib; //Unused

  /* Create a safe reference to the klib object for use below. */
  var klib = function (obj) {
    if (obj instanceof klib) { return obj; }
    if (!(this instanceof klib)) { return new klib(obj); }
  };

  /* Expose klib to window */
  win.klib = klib;

  /* Current version. */
  klib.VERSION = '2.0.0';

  /* isIE or isNonIE */
  var isById = (document.getElementById)
    , isByName = (document.all);
  klib.isIE = (isByName) ? true : false;
  klib.isNonIE = (isById && !isByName) ? true : false;

  /*No Operation: a dummy function*/
  klib.noop = function(){};

  klib.debug = false;
  klib.debugger = {
      on:function(){ klib.debug = true; }
    , off:function(){ klib.debug = false; }
    , toggle:function() { klib.debug = !klib.debug; }
  };
  /*Internal console out*/
  klib.cOut = function(consoleType, o){
    if (klib.debug && console[consoleType]) console[consoleType](o);
  };
  klib['console'] = {
      'clear'         : function(){ console['clear'](); }
    , 'assert'        : function(o){ klib.cOut('assert', o); }
    , 'count'         : function(o){ klib.cOut('count', o); }
    , 'debug'         : function(o){ klib.cOut('debug', o); }
    , 'dir'           : function(o){ klib.cOut('dir', o); }
    , 'dirxml'        : function(o){ klib.cOut('dirxml', o); }
    , 'error'         : function(o){ klib.cOut('error', o); }
    , 'exception'     : function(o){ klib.cOut('exception', o); }
    , 'group'         : function(o){ klib.cOut('group', o); }
    , 'groupCollapsed': function(o){ klib.cOut('groupCollapsed', o); }
    , 'groupEnd'      : function(o){ klib.cOut('groupEnd', o); }
    , 'info'          : function(o){ klib.cOut('info', o); }
    , 'log'           : function(o){ klib.cOut('log', o); }
    , 'markTimeline'  : function(o){ klib.cOut('markTimeline', o); }
    , 'profile'       : function(o){ klib.cOut('profile', o); }
    , 'profileEnd'    : function(o){ klib.cOut('profileEnd', o); }
    , 'table'         : function(o){ klib.cOut('table', o); }
    , 'time'          : function(o){ klib.cOut('time', o); }
    , 'timeEnd'       : function(o){ klib.cOut('timeEnd', o); }
    , 'timeStamp'     : function(o){ klib.cOut('timeStamp', o); }
    , 'trace'         : function(o){ klib.cOut('trace', o); }
    , 'warn'          : function(o){ klib.cOut('warn', o); }
  };

  klib._initWindowOnHashChange = function(){
    if ('onhashchange' in window) {
      isKHashRouteOn = true;
      klib.console.info("Registering HashRouting Listener");
      window.onhashchange = function (ocEvent) {
        /* ocEvent
         .oldURL : "http://dev.semantic-test.com/ui/home.html#user/changePassword"
         .newURL : "http://dev.semantic-test.com/ui/home.html#user/profile"
         .timeStamp : 1443191735330
         .type:"hashchange"
         */
        var cHash = window.location.hash;
        klib.console.info("onHashChange: "+cHash);
        if (cHash) {
          klib.route(cHash);
        } else if (klib.routesOptions.defaultPageRoute) {
          klib.route(klib.routesOptions.defaultPageRoute);
        }
      };
    }
  };
  klib._stopWindowOnHashChange = function(){
    window.onhashchange = undefined;
  };

  /* ********************************************************* */
  /*NEW String Methods trim, normalize, beginsWith, endsWith
   var str                    = " I am a      string ";

   str.trim()                 = "I am a      string";
   str.isBlank()           = false;
   str.isNumber()             = false;
   str.normalize()            = "I am a string";
   str.beginsWith("I am")     = "true";
   str.beginsWith("i am")     = "false";
   str.beginsWith("i am","i") = "true"; // case insensitive
   str.endsWith("ing")        = "true";
   str.endsWith("iNg")        = "false";
   str.endsWith("InG","i")    = "true"; // case insensitive
   ("     ").ifBlank(str)     = " I am a      string ";
   ("     ").ifBlank()        = "";
   (str).ifBlank()            = "I am a      string";
   */
  if (!(String).trim) {
    String.prototype.trim = function (tStr) {
      tStr = (tStr || "\\s+");
      return (this.replace(new RegExp(("^" + tStr + "|" + tStr + "$"), "g"), ""))
    };
  }

  if (!(String).trimLeft) {
    String.prototype.trimLeft = function (tStr) {
      return (this.replace(new RegExp("^" + (tStr || "\\s+"), "g"), ""));
    };
  }

  if (!(String).trimRight) {
    String.prototype.trimRight = function (tStr) {
      return (this.replace(new RegExp((tStr || "\\s+") + "$", "g"), ""));
    };
  }

  if (!(String).isBlank) {
    String.prototype.isBlank = function () {
      return (this.trim() == "");
    };
  }

  if (!(String).ifBlank) {
    String.prototype.ifBlank = function (forNullStr) {
      forNullStr = forNullStr || "";
      return (this.isBlank() ? (("" + forNullStr).trim()) : (this.trim()));
    };
  }

  if (!(String).isNumber) {
    String.prototype.isNumber = function () {
      return (((("" + this).replace(/[0-9.]/g, "")).trim()).length == 0);
    };
  }

  if (!(String).normalizeStr) {
    String.prototype.normalizeStr = function () {
      return (this).trim().replace(/\s+/g, ' ');
    };
  }

  if (!(String).beginsWith) {
    String.prototype.beginsWith = function (str, i) {
      i = (i) ? 'i' : '';
      var re = new RegExp('^' + str, i);
      return ((this).normalizeStr().match(re)) ? true : false;
    };
  }

  if (!(String).beginsWithIgnoreCase) {
    String.prototype.beginsWithIgnoreCase = function (str) {
      var re = new RegExp('^' + str, 'i');
      return ((this).normalizeStr().match(re)) ? true : false;
    };
  }

  if (!(String).endsWith) {
    String.prototype.endsWith = function (str, i) {
      i = (i) ? 'gi' : 'g';
      var re = new RegExp(str + '$', i);
      return ((this).normalizeStr().match(re)) ? true : false;
    };
  }

  if (!(String).endsWithIgnoreCase) {
    String.prototype.endsWithIgnoreCase = function (str, i) {
      var re = new RegExp(str + '$', 'gi');
      return ((this).normalizeStr().match(re)) ? true : false;
    };
  }

  if (!(String).contains) {
    String.prototype.contains = function (str, i) {
      i = (i) ? 'gi' : 'g';
      var re = new RegExp('' + str, i);
      return ((re).test(this));
    };
  }

  if (!(String).equals) {
    String.prototype.equals = function (arg) {
      return (this == arg);
    };
  }

  if (!(String).equalsIgnoreCase) {
    String.prototype.equalsIgnoreCase = function (arg) {
      return ((String(this.toLowerCase()) == (String(arg)).toLowerCase()));
    };
  }

  if (!(String).toProperCase) {
    String.prototype.toProperCase = function (normalize) {
      return ( (((typeof normalize == "undefined") ||  normalize)? ((this).normalizeStr()) : (this)).toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();
      }));
    };
  }

  klib.toJSON = function (str) {
    var thisStr;
    if (_.isString(str)) {
      thisStr = str.trim();
      if (thisStr.contains(":") && !thisStr.contains(",") && thisStr.contains(";")) {
        thisStr = thisStr.replace(/\;/g,',');
      }
      if (!(thisStr.beginsWith("{") || thisStr.beginsWith("\\["))) {
        if (thisStr.contains(":")) {
          thisStr = "{"+thisStr+"}"
        } else if (thisStr.contains("=")) {
          thisStr = "{"+thisStr.replace(/=/g,':')+"}";
        } else {
          thisStr = "["+thisStr+"]";
        }
      } else if (thisStr.beginsWith("{") && !thisStr.contains(":") && thisStr.contains("=")) {
        thisStr = ""+thisStr.replace(/=/g,':')+"";
      }
    }
    return (!_.isString(str) && _.isObject(str)) ? str : ( klib.isBlank(str) ? null : (eval("(" + thisStr + ")")) );
  };
  if (!(String).toJSON) {
    String.prototype.toJSON = function () {
      return klib.toJSON(this);
    };
  }

  if (!(String).toBoolean) {
    String.prototype.toBoolean = function () {
      var retValue = true;
      switch (("" + this).trim().toLowerCase()) {
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

      if (retValue) retValue = (!("" + this).trim().beginsWith("-"));
      return ( retValue );
    };
  }

  if (!(Boolean).toValue) {
    Boolean.prototype.toValue = function (tValue, fValue) {
      if (typeof tValue == "undefined") tValue = true;
      if (typeof fValue == "undefined") fValue = false;
      return ((this.valueOf()) ? (tValue) : (fValue));
    };
  }

  if (!(Boolean).toHtml) {
    Boolean.prototype.toHtml = function (tElId, fElId) {
      return $((this.valueOf()) ? tElId : fElId).html();
    };
  }

  /*
   * String.pad(length: Integer, [padString: String = " "], [type: Integer = 0]): String
   * Returns: the string with a padString padded on the left, right or both sides.
   * length: amount of characters that the string must have
   * padString: string that will be concatenated
   * type: specifies the side where the concatenation will happen, where: 0 = left, 1 = right and 2 = both sides
   */
  if (!(String).pad) {
    String.prototype.pad = function (l, s, t) {
      for (var ps = "", i = 0; i < l; i++) {
        ps += s;
      }
      return (((t === 0 || t === 2) ? ps : "") + this + ((t === 1 || t === 2) ? ps : ""));
    };
  }

  klib.lastSplitResult = [];
  klib.getOnSplit = function (str, delimiter, pickIndex) {
    klib.lastSplitResult = str.split(delimiter);
    return (klib.getOnLastSplit(pickIndex));
  };
  klib.getOnLastSplit = function (pickIndex) {
    return ((pickIndex < 0) ? (_.last(klib.lastSplitResult)) : (klib.lastSplitResult[pickIndex]));
  };

  /* isBlank / isEmpty */
  klib.isBlank = klib.isEmpty = function (src) {
    var retValue = true;
    if (src) {
      switch (true) {
        case (_.isString(src)):
          retValue = ((src).trim().length == 0);
          break;
        case (_.isArray(src)) :
        case (_.isObject(src)):
          retValue = _.isEmpty(src);
          break;
      }
    }
    return retValue;
  };

  klib.isNumber = function (str) {
    return (((("" + str).replace(/[0-9.]/g, "")).trim()).length == 0);
  };

  klib.toBoolean = function (str) {
    var retValue = true;
    switch (("" + str).trim().toLowerCase()) {
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

  klib.toInt = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = klib.isBlank(str) ? "0" : ((str.indexOf(".") >= 0) ? str.substring(0, str.indexOf(".")) : str);
    return (parseInt(str * 1, 10));
  };

  klib.toFloat = function (str) {
    str = ("" + str).replace(/[^+-0123456789.]/g, "");
    str = klib.isBlank(str) ? "0" : str;
    return (parseFloat(str * (1.0)));
  };

  /*Tobe Removed: replaced with toStr*/
  //klib.toString = function (obj) {
  //  klib.console.warn("klib.toString is deprecated. use klib.toStr instead.");
  //  var retValue = "" + obj;
  //  if (_.isObject(obj)) {
  //    retValue = JSON.stringify(obj);
  //  }
  //  return (retValue);
  //};

  klib.toStr = function (obj) {
    var retValue = "" + obj;
    if (_.isObject(obj)) {
      retValue = JSON.stringify(obj);
    }
    return (retValue);
  };

  klib.dotToX = function (dottedName, X) {
    return ((dottedName).replace(/\./g, X));
  };
  klib.dotToCamelCase = function (dottedName) {
    var newName = (dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, "");
    return (newName[0].toLowerCase() + newName.substring(1));
  };
  klib.dotToTitleCase = function (dottedName) {
    return ((dottedName).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
  };

  klib.toDottedPath = function(srcStr){
    return ((srcStr||"").replace(/]/g,'').replace(/(\[)|(\\)|(\/)/g,'.').replace(/(\.+)/g,'.').trim("\\."));
  };

  klib.ifBlank = klib.ifEmpty = klib.ifNull = function (src, replaceWithIfBlank) {
    replaceWithIfBlank = ("" + (replaceWithIfBlank || "")).trim();
    return ( klib.isBlank(src) ? (replaceWithIfBlank) : (("" + src).trim()) );
  };

  /* now: Browser's current timestamp */
  klib.now = function () {
    return ("" + ((new Date()).getTime()));
  };

  /* year: Browser's current year +/- N */
  klib.year = function (n) {
    n = n || 0;
    return ((new Date()).getFullYear() + (klib.toInt(n)));
  };

  /*String to Array; klib.range("N1..N2:STEP")
   * y-N..y+N : y=CurrentYear*/
  klib.range = function (rangeSpec) {
    var rSpec = (rangeSpec.toUpperCase()).split("..")
      , rangeB = "" + rSpec[0]
      , rangeE = "" + rSpec[1]
      , rStep = "1";
    if (rangeE.indexOf(":") > 0) {
      rangeE = "" + (rSpec[1].split(":"))[0];
      rStep = "" + (rSpec[1].split(":"))[1];
    }
    if (rangeB.indexOf("Y") >= 0) {
      rangeB = klib.year((rangeB.split(/[^0-9+-]/))[1]);
    }
    if (rangeE.indexOf("Y") >= 0) {
      rangeE = klib.year((rangeE.split(/[^0-9+-]/))[1]);
    }
    var rB = klib.toInt(rangeB)
      , rE = klib.toInt(rangeE)
      , rS = klib.toInt(rStep);
    return (rangeB > rangeE) ? ((_.range(rE, (rB) + 1, rS)).reverse()) : (_.range(rB, (rE) + 1, rS));
  };

  klib.checkAndPreventKey = function (e, disableKeys) {
    if (!disableKeys) disableKeys = "";
    var withShiftKey = (disableKeys.indexOf("+shift") >= 0)
      , keyCode  = ""+e.keyCode
      , retValue = (( ((disableKeys.pad(1, ',', 2)).indexOf(keyCode.pad(1, ',', 2)) >= 0) && (withShiftKey ? ((e.shiftKey) ? true : false) : ((!e.shiftKey)? true : false))));
    if (retValue) {
      e.preventDefault();
      klib.console.info("Key [" + keyCode + (withShiftKey ? "+Shift" : "") + "] has been disabled in this element.");
    }
    return retValue;
  };

  klib._trackAndControlKey = function (e) {
    var keyElement = e.currentTarget
      , disableKeys = (""+$(keyElement).data("disableKeys")).toLowerCase();
      //, keyCode = ""+e.keyCode, withShiftKey = (disableKeys.indexOf("+shift") >= 0);
    klib.checkAndPreventKey(e, disableKeys);

    var changeFocusNext = (!klib.isBlank(("" + $(keyElement).data("focusNext")).replace(/undefined/, "").toLowerCase()));
    var changeFocusPrev = (!klib.isBlank(("" + $(keyElement).data("focusBack")).replace(/undefined/, "").toLowerCase()));
    if (changeFocusNext && (klib.checkAndPreventKey(e, "9"))) {
      $($(keyElement).data("focusNext")).get(0).focus();
    }
    if (changeFocusPrev && (klib.checkAndPreventKey(e, "9,+shift"))) {
      $($(keyElement).data("focusBack")).get(0).focus();
    }
  };

  klib.initKeyTracking = function () {
    var elementsToTrackKeys = (arguments.length) ? arguments[0] : "[data-disable-keys],[data-focus-next],[data-focus-back]";
    klib.console.info("Finding Key-Tracking for element(s): " + elementsToTrackKeys);
    $(elementsToTrackKeys).each(function (index, element) {
      $(element).keydown(klib._trackAndControlKey);
      klib.console.info("kLib is tracking keys on element:");
      klib.console.info(element);
    });
  };

  klib.getDocObj = function (objId) {
    var jqSelector = ((typeof objId) == "object") ? objId : ((objId.beginsWith("#") ? "" : "#") + objId);
    return ( $(jqSelector).get(0) );
  };
  klib.getDocObjs = function (objId) {
    var jqSelector = (objId.beginsWith("#") ? "" : "#") + objId;
    return ( $(jqSelector).get() );
  };

  /* setFocus: */
  klib.setFocus = function (objId, isSelect) {
    var oFocus = klib.getDocObj(objId);
    if (oFocus) {
      oFocus.focus();
      if (isSelect) oFocus.select();
    }
  };

  /* Check DOM has requested element */
  klib.isElementExist = function (elSelector) {
    return (!$.isEmptyObject($(elSelector).get()));
  };

  klib.swapObjClass = function (objIDs, removeClass, addClass) {
    $(objIDs).removeClass(removeClass);
    $(objIDs).addClass(addClass);
  };

  /* docObjValue: returns oldValue; sets newValue if provided */
  klib.docObjValue = function (objId, newValue) {
    var reqObj = klib.getDocObj(objId);
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
  klib.optionSelectedIndex = function (objId, newSelIdx) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      retValue = oLstObj.selectedIndex;
      if (arguments.length === 2) {
        oLstObj.selectedIndex = newSelIdx;
      }
    }
    return (retValue);
  };
  /* get options Index : for value */
  klib.optionIndexOfValue = function (objId, optValue) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
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
  klib.optionIndexOfText = function (objId, optText) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
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
  klib.optionIndexOfValueBeginsWith = function (objId, optValue) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        if ((oLstObj.options[i].value).beginsWith(optValue, "i")) {
          retValue = i;
          break;
        }
      }
    }
    return (retValue);
  };

  /*Get Value / Text for selected Index*/
  klib.optionsSelectedValues = function (objId, delimiter) {
    objId = (objId.beginsWith("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return ($.map(($(objId + " option:selected")), function (option) {
      return (option.value);
    }).join(delimiter));
  };
  klib.optionsSelectedTexts = function (objId, delimiter) {
    objId = (objId.beginsWith("#") ? "" : "#") + objId;
    delimiter = delimiter || ",";
    return ($.map(($(objId + " option:selected")), function (option) {
      return (option.text);
    }).join(delimiter));
  };

  /*Get Value / Text for given Index*/
  klib.optionValueOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = klib.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].value;
    }
    return (retValue);
  };
  klib.optionTextOfIndex = function (objId, sIndex) {
    var retValue = "";
    var oLstObj = klib.getDocObj(objId);
    if ((oLstObj) && (sIndex >= 0) && (sIndex < oLstObj.length)) {
      retValue = oLstObj.options[sIndex].text;
    }
    return (retValue);
  };

  /*Set Selected options for Value*/
  klib.selectOptionForValue = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      retValue = klib.optionIndexOfValue(objId, selValue);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  klib.selectOptionForValueBeginsWith = function (objId, selValue) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      retValue = klib.optionIndexOfValueBeginsWith(objId, selValue);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  klib.selectOptionsForValues = function (objId, selValues, valDelimitChar) {
    valDelimitChar = valDelimitChar || ",";
    selValues = (valDelimitChar + selValues + valDelimitChar).toLowerCase();
    var oLstObj = klib.getDocObj(objId), optValue;
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        optValue = (valDelimitChar + (oLstObj.options[i].value) + valDelimitChar).toLowerCase();
        oLstObj.options[i].selected = (selValues.indexOf(optValue) >= 0);
      }
    }
  };
  klib.selectOptionForText = function (objId, selText) {
    var retValue = -1;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      retValue = klib.optionIndexOfText(objId, selText);
      oLstObj.selectedIndex = retValue;
    }
    return (retValue);
  };
  klib.selectOptionsAll = function (objId) {
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = true;
      }
    }
  };
  klib.selectOptionsNone = function (objId) {
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      for (var i = 0; i < oLstObj.length; i++) {
        oLstObj.options[i].selected = false;
      }
    }
  };
  /*Add / Remove Options*/
  klib.optionsReduceToLength = function (objID, nLen) {
    nLen = nLen || 0;
    var oSelOptList = klib.getDocObj(objID);
    if (oSelOptList) {
      klib.selectOptionsNone(objID);
      oSelOptList.length = nLen;
    }
  };
  klib.optionsRemoveAll = function (objID) {
    klib.optionsReduceToLength(objID, 0);
  };
  klib.optionRemoveForIndex = function (objId, optIndex) {
    objId = (objId.beginsWith("#") ? "" : "#") + objId;
    var oLstObj = klib.getDocObj(objId);
    if (oLstObj) {
      if (("" + optIndex).equalsIgnoreCase("first")) optIndex = 0;
      if (("" + optIndex).equalsIgnoreCase("last")) optIndex = (oLstObj.length - 1);
      oLstObj.remove(optIndex);
    }
  };
  klib.optionRemoveForValue = function (objId, optValue) {
    klib.optionRemoveForIndex(objId, klib.optionIndexOfValue(objId, optValue));
  };
  klib.optionRemoveForText = function (objId, optText) {
    klib.optionRemoveForIndex(objId, klib.optionIndexOfText(objId, optText));
  };
  klib.optionRemoveForValueBeginsWith = function (objId, optValueBeginsWith) {
    klib.optionRemoveForIndex(objId, klib.optionIndexOfValueBeginsWith(objId, optValueBeginsWith));
  };

  klib.optionAppend = function (objID, optValue, optText, appendAtIndex) {
    var retValue = -1;
    var oSelOptList = klib.getDocObj(objID);
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
   * Usage: klib.optionsLoad(elSelector, list, beginsAt, sortBy)
   * elSelector = "#SelectElementID"; //jQuery selector by ID
   * list = [ 0, 1, ... ]; //Number Array
   * list = ["optValue0", "optValue1", ... ]; //String Array
   * list = {"optValue0":"optText0", "optValue1":"optText1", "optValue2":"optText2", ... }; //Object with Key Value Pair
   * beginsAt = -1 => Add to existing list; 0=> reset to 0; n=> reset to n; before Load
   * sortBy = 0=> NO Sort; 1=> SortBy Key; 2=> SortBy Text;
   */
  klib.optionsLoad = function (elSelector, list, beginsAt, sortBy) {
    var sortByAttr = ["", "key", "value"];
    beginsAt = beginsAt || 0;
    sortBy = sortBy || 0;
    if ((_.isString(list)) && (list.indexOf("..") > 0)) {
      list = klib.range(list);
    }
    if (beginsAt >= 0) {
      klib.optionsReduceToLength(elSelector, beginsAt);
    }
    if (_.isArray(list)) {
      _.each(list, function (opt) {
        klib.optionAppend(elSelector, opt, opt);
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
          klib.optionAppend(elSelector, opt.key, opt.value);
        });
      }
      else {
        _.each(list, function (value, key) {
          klib.optionAppend(elSelector, key, value);
        });
      }
    }
  };

  /* Radio & Checkbox related */
  /* checkedState: returns old Checked State {true|false}; sets newState {true | false} if provided */
  klib.checkedState = function (objId, newState) {
    var retValue = false
      , objChk = klib.getDocObj(objId);
    if (objChk) {
      retValue = objChk.checked;
      if (arguments.length === 2) {
        objChk.checked = newState;
      }
    }
    return (retValue);
  };
  klib.isChecked = function (formId, eName) {
    return (($("input[name=" + eName + "]:checked", formId).length) > 0);
  };
  klib.radioSelectedValue = function (formId, rName) {
    var retValue = ($("input[name=" + rName + "]:checked", formId).val());
    return (retValue ? retValue : "");
  };
  klib.radioClearSelection = function (formId, rName) {
    ($("input[name=" + rName + "]:checked", formId).attr("checked", false));
  };
  klib.radioSelectForValue = function (formId, rName, sValue) {
    $("input[name=" + rName + "]:radio", formId).each(function(el) {
      el.checked = ((el.value).equalsIgnoreCase(sValue));
    });
  };
  klib.checkboxCheckedValues = function (formId, cbName, delimiter) {
    delimiter = delimiter || ",";
    return ($("input[name=" + cbName + "]:checked", formId).map(function () {
      return this.value;
    }).get().join(delimiter));
  };

  klib.sleep = function (sec) {
    var dt = new Date();
    dt.setTime(dt.getTime() + (sec * 1000));
    while (new Date().getTime() < dt.getTime());
  };

  /*Tobe removed; use _.filter*/
  klib.filterJSON = function (jsonData, xFilter) {
    return $(jsonData).filter(function (index, item) {
      for (var i in xFilter) {
        if (!item[i].toString().match(xFilter[i])) return null;
      }
      return item;
    });
  };

  /* randomPassword: Random Password for requested length */
  klib.randomPassword = function (passLen) {
    var chars = "9a8b77C8D9E8F7G6H5I4J3c6d5e4f32L3M4N5P6Qg2h3i4j5kV6W5X4Y3Z26m7n8p9q8r7s6t5u4v3w2x3y4z5A6BK7R8S9T8U7";
    var pass = "";
    for (var x = 0; x < passLen; x++) {
      var i = Math.floor(Math.random() * (chars).length);
      pass += chars.charAt(i);
    }
    return pass;
  };

  /* rand: Random number between min - max */
  klib.rand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  klib.htmlEncode = function (value) {
    return $('<div/>').text(value).html();
  };
  klib.htmlDecode = function (value) {
    return $('<div/>').html(value).text();
  };

  klib.parseKeyStr = function (keyName, changeToLowerCase) {
    return ((changeToLowerCase ? keyName.toLowerCase() : keyName).replace(/[^_0-9A-Za-z]/g, ""));
  };
  klib.setObjProperty = function (obj, keyNameStr, propValue, keyToLowerCase) {
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
      oKey = klib.parseKeyStr(oKeys.shift(), keyToLowerCase);
      if ($.trim(oKey) != "") {
        if (typeof xObj[oKey] == "undefined") xObj[oKey] = {};
        xObj = xObj[oKey];
      }
    }
    oKey = klib.parseKeyStr(oKeys.shift(), keyToLowerCase);
    xObj[oKey] = propValue;

    return obj;
  };

  klib.getElValue = function (el) {
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

  klib.serializeDisabled = function (formSelector) {
    var retValue = "";
    $(formSelector).find("[disabled][name]").each(function () {
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + klib.getElValue(this);
    });
    return retValue;
  };

  /*
   * klib.serializeForms(formSelector, includeDisabledElements)
   * @formSelector {string} jQuery form selector #Form1,#Form2...
   * @includeDisabledElements {boolean} true | false [default:false]
   * @returns {string} param1=value1&param2=value2...
   */
  klib.serializeForms = function (formSelector, includeDisabledElements) {
    var disabledElementsKeyValues, unchkvalue, retValue = $(formSelector).serialize();

    //include unchecked checkboxes
    $(formSelector).find("input:checkbox:enabled:not(:checked)[name]").each(function () {
      unchkvalue = $(this).data("unchecked");
      retValue += ((retValue) ? '&' : '') + $(this).attr('name') + '=' + ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
    });

    if (includeDisabledElements) {
      disabledElementsKeyValues = klib.serializeDisabled(formSelector);
      retValue += ((retValue && disabledElementsKeyValues) ? '&' : '') + disabledElementsKeyValues;
    }
    return retValue;
  };

  klib.queryStringToJson = function (qStr) {
    var retValue = {}, qStringWithParams = (qStr || location.search), qIndex = ('' + qStringWithParams).indexOf('?'), ampIndex = ('' + qStringWithParams).indexOf('&');
    if (qStringWithParams && (qStringWithParams.length > 0) && (qIndex >= 0) && ((qIndex == 0) || (ampIndex > qIndex))) {
      qStringWithParams = qStringWithParams.substring(qIndex + 1);
    }
    _.each((qStringWithParams.split('&')), function (nvp) {
      nvp = nvp.split('=');
      if (nvp[0]) {
        if (_.has(retValue, nvp[0])) {
          if (!_.isArray(retValue[nvp[0]])) {
            retValue[nvp[0]] = [retValue[nvp[0]]];
          }
          retValue[nvp[0]].push(decodeURIComponent(nvp[1] || ''));
        } else {
          retValue[nvp[0]] = decodeURIComponent(nvp[1] || '');
        }
      }
    });
    return retValue;
  };

  $.fn.serializeUncheckedCheckboxes = function (appendTo) {
    var $chkBox, unchkvalue, keyName, keyValue
      , toJSON = (typeof appendTo == "object")
      , retObj = (toJSON) ? appendTo : {}
      , retStr = (toJSON && !appendTo) ? ('') : (appendTo);

    $(this).find("input:checkbox:enabled:not(:checked)[name]").each(function (index, el) {
      $chkBox = $(el);
      keyName = $chkBox.attr('name');
      unchkvalue = $chkBox.data("unchecked");
      keyValue = ((typeof unchkvalue === 'undefined') ? '' : unchkvalue);
      if (toJSON) {
        if (_.has(retObj, keyName)) {
          if (!_.isArray(retObj[keyName])) {
            retObj[keyName] = [retObj[keyName]];
          }
          retObj[keyName].push(keyValue);
        } else {
          retObj[keyName] = keyValue;
        }
      }
      else {
        retStr += ((retStr) ? '&' : '') + keyName + '=' + keyValue;
      }
    });
    return ((toJSON) ? retObj : retStr);
  };
  klib.serializeUncheckedCheckboxes = function (formSelector, appendTo) {
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
      o = klib.setObjProperty(o, oKeyName, this.value, c);
    });

    //include unchecked checkboxes
    $(this).find("input:checkbox:enabled:not(:checked)").each(function () {
      oKeyName = $(this).attr('name');
      if (oKeyName) {
        oKeyValue = $(this).data("unchecked");

        if (kParse) {
          oKeyName = (oKeyName).replace(kParse, "");
        }
        oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);

        o = klib.setObjProperty(o, oKeyName, oKeyValue, c);
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
      o[this.name] = this.value;
    });
    if (c) {
      $(this).find("[disabled][name]").each(function () {
        o[this.name] = klib.getElValue(this);
      });
    }
    //include unchecked checkboxes
    $(this).find("input:checkbox:enabled:not(:checked)[name]").each(function () {
      oKeyName = $(this).attr('name');
      oKeyValue = $(this).data("unchecked");
      oKeyValue = '' + ((typeof oKeyValue == 'undefined') ? '' : oKeyValue);
      o[oKeyName] = oKeyValue;
    });

    $(this).find("[data-to-json-group][name]").each(function () {
      oKeyStr = this.name;
      oGrpStr = $(this).data("toJsonGroup");
      if (oGrpStr) {
        if (!o[oGrpStr]) o[oGrpStr] = {};
        o[oGrpStr][oKeyStr] = klib.getElValue(this);
      }
    });
    return o;
  };
  klib.serializeFormToSimpleJSON = klib.serializeFormToSimpleObject = function (formSelector, obj, includeDisabledElements) {
    return $(formSelector).serializeFormToSimpleJSON(obj, includeDisabledElements);
  };

  klib.serializeFormToJSON = klib.serializeFormToObject = function (formSelector, obj, keyNameToLowerCase, strPrefixToIgnore) {
    return $(formSelector).serializeFormToJSON(obj, keyNameToLowerCase, strPrefixToIgnore);
  };

  /* find(jsonObject, 'key1.key2.key3[0].key4'); */
  klib.find = klib.locate = function (obj, path) {
    var tObj = obj, retValue;
    if (typeof eval("tObj." + path) != "undefined") retValue = eval("tObj." + path);
    return retValue;
  };

  klib.findSafe = klib.locateSafe = klib.valueOfKeyPath = function (obj, pathStr, def) {
    for (var i = 0, path = klib.toDottedPath(pathStr).split('.'), len = path.length; i < len; i++) {
      if (!obj || typeof obj == "undefined") return def;
      obj = obj[path[i]];
    }
    if (typeof obj == "undefined") return def;
    return obj;
  };

  klib.has = klib.hasKey = function (obj, path) {
    var tObj = obj;
    return (typeof eval("tObj." + path) != "undefined");
  };

  klib.hasIgnoreCase = klib.hasKeyIgnoreCase = function (obj, pathStr) {
    var retValue = "", tObj = obj || {}, lookupPath = ""+klib.toDottedPath((pathStr));
    var objKeys = klib.keysDottedAll(tObj); //getAllKeys with dotted notation
    if (objKeys && !_.isEmpty(objKeys)) {
      klib.console.debug(objKeys);
      _.some(objKeys, function(oKey){
        var isMatch = oKey.equalsIgnoreCase(lookupPath);
        if (!isMatch) {
          isMatch = oKey.beginsWithIgnoreCase(lookupPath+".");
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

  klib.findIgnoreCase = function(obj, path, ifNot){
    var retValue = ifNot;
    var keyInObj = klib.hasIgnoreCase(obj, path);
    if (keyInObj){
      retValue = klib.findSafe(obj, keyInObj, ifNot);
    };
    return retValue;
  };

  /*Get All keys like X-Path with dot and [] notations */
  klib.keysDottedAll = function (a) {
    var objKeys = klib.keysDotted(a);
    if (objKeys && !_.isEmpty(objKeys)) {
      objKeys = klib.toDottedPath(objKeys.join(",")).split(",");
    };
    return objKeys;
  };
  klib.keysDotted = function (a) {
    a = a || {};
    var list = [], xConnectorB, xConnectorE, curKey;
    (function (o, r) {
      r = r || '';
      if (typeof o != 'object') {
        return true;
      }
      for (var c in o) {
        curKey = r.substring(1);
        xConnectorB = (klib.isNumber(c)) ? "[" : ".";
        xConnectorE = (((curKey) && (xConnectorB == "[")) ? "]" : "");
        if (arguments.callee(o[c], r + xConnectorB + c + xConnectorE)) {
          list.push((curKey) + (((curKey) ? xConnectorB : "")) + c + (xConnectorE));
        }
      }
      return false;
    })(a);
    return list;
  };

  klib.keysCamelCase = function (a) {
    return (_.map(klib.keysDotted(a), function (name) {
      var newName = (name).replace(/\./g, " ").toProperCase().replace(/ /g, "");
      return (newName[0].toLowerCase() + newName.substring(1));
    }));
  };

  klib.keysTitleCase = function (a) {
    return (_.map(klib.keysDotted(a), function (name) {
      return ((name).replace(/\./g, " ").toProperCase().replace(/ /g, ""));
    }));
  };

  klib.keys_ = function (a) {
    return (_.map(klib.keysDotted(a), function (name) {
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
    klib.console.info("$.cachedScript('" + url + "')");
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
    klib.console.info("$.cachedScript('" + url + "')");
    /* Use $.ajax() since it is more flexible than $.getScript
     * Return the jqXHR object so we can chain callbacks
     */
    return $.ajax(options);
  };

  /* Add Script Tag */
  klib.addScript = function (scriptId, scriptSrc) {
    scriptId = scriptId.replace(/#/, "");
    klib.console.group("kAddScript");
    if (!klib.isElementExist("#kScriptsCotainer")) {
      klib.console.info("#kScriptsCotainer NOT Found! Creating one...");
      $('body').append("<div id='kScriptsCotainer' style='display:none' rel='Dynamic Scripts Container'></div>");
    }
    if (klib.isElementExist("#" + scriptId)) {
      klib.console.info("script [" + scriptId + "] already found in local.");
    }
    else {
      klib.console.info("script [" + scriptId + "] NOT found. Added script tag with src [" + scriptSrc + "]");
      $("#kScriptsCotainer").append("<script id='" + (scriptId) + "' type='text/javascript' src='" + scriptSrc + "'><\/script>");
    }
    klib.console.groupEnd("kAddScript");
  };

  /* Add Style Tag */
  klib.addStyle = function (styleId, styleSrc) {
    styleId = styleId.replace(/#/, "");
    klib.console.group("kAddStyle");
    if (!klib.isElementExist("#kStylesCotainer")) {
      klib.console.info("#kStylesCotainer NOT Found! Creating one...");
      $('body').append("<div id='kStylesCotainer' style='display:none' rel='Dynamic Styles Container'></div>");
    }
    if (klib.isElementExist("#" + styleId)) {
      klib.console.info("style [" + styleId + "] already found in local.");
    }
    else {
      klib.console.info("style [" + styleId + "] NOT found. Added link tag with href [" + styleSrc + "]");
      $("#kStylesCotainer").append("<link id='" + (styleId) + "' rel='stylesheet' type='text/css' href='" + styleSrc + "'\/>");
    }
    klib.console.groupEnd("kAddStyle");
  };

  /* Loading script */
  klib.loadScript = function (scriptId, scriptPath, useScriptTag, tAjaxRequests) {
    scriptId = scriptId.replace(/#/, "");
    useScriptTag = useScriptTag || false;
    tAjaxRequests = tAjaxRequests || [];
    klib.console.group("kScriptsLoad");
    if (klib.isBlank(scriptPath)) {
      klib.console.error("script path [" + scriptPath + "] for [" + scriptId + "] NOT defined.");
    }
    else {
      if (useScriptTag) {
        klib.addScript(scriptId, scriptPath);
      }
      else { /* load script script-URL */
        tAjaxRequests.push(
          $.cachedScript(scriptPath).done(function (script, textStatus) {
            klib.console.info("Loaded script [" + scriptId + "] from [" + scriptPath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    klib.console.groupEnd("kScriptsLoad");
    return (tAjaxRequests);
  };

  /* Loading style */
  klib.loadStyle = function (styleId, stylePath, useStyleTag, tAjaxRequests) {
    styleId = styleId.replace(/#/, "");
    useStyleTag = useStyleTag || false;
    tAjaxRequests = tAjaxRequests || [];
    klib.console.group("kStylesLoad");
    if (klib.isBlank(stylePath)) {
      klib.console.error("style path [" + stylePath + "] for [" + styleId + "] NOT defined.");
    }
    else {
      if (useStyleTag) {
        klib.addStyle(styleId, stylePath);
      }
      else { /* load style style-URL */
        tAjaxRequests.push(
          $.cachedStyle(styleId, stylePath).done(function (style, textStatus) {
            klib.console.info("Loaded style [" + styleId + "] from [" + stylePath + "]. STATUS: " + textStatus);
          })
        );
      }
    }
    klib.console.groupEnd("kStylesLoad");
    return (tAjaxRequests);
  };

  /* Add Template script to BODY */
  klib.addTemplateScript = function (tmplId, tmplBody, tmplType) {
    tmplId = tmplId.replace(/#/, "");
    if (!klib.isElementExist("#kViewTemplateCotainer")) {
      klib.console.info("#kViewTemplateCotainer NOT Found! Creating one...");
      $('body').append("<div id='kViewTemplateCotainer' style='display:none' rel='Template Container'></div>");
    }
    klib.console.info("Adding <script id='" + (tmplId) + "' type='text/" + tmplType + "'>");
    $("#kViewTemplateCotainer").append("<script id='" + (tmplId) + "' type='text/" + tmplType + "'>" + tmplBody + "<\/script>");
  };

  /* Load external or internal (inline or #container) content as template script */
  klib.loadTemplate = function (tmplId, tmplPath, templateType, viewContainderId, tAjaxRequests, tmplReload) {
    tmplId = tmplId.replace(/#/g, "");
    tmplPath = (tmplPath.ifBlank("inline")).trim();
    templateType = templateType || "x-template";
    viewContainderId = viewContainderId || "#DummyInlineTemplateContainer";
    tAjaxRequests = tAjaxRequests || [];
    klib.console.group("kTemplateAjaxQue");
    if (!klib.isElementExist("#"+tmplId)) {
      klib.console.info("Template[" + tmplId + "] of [" + templateType + "] NOT found. Source [" + tmplPath + "]");
      if ((tmplPath.equalsIgnoreCase("inline") || tmplPath.beginsWith("#"))) { /* load from viewTargetContainer or local container ID given in tmplPath */
        var localTemplateSrcContainerId = tmplPath.equalsIgnoreCase("inline")? viewContainderId : tmplPath;
        var $localTemplateSrcContainer = $(localTemplateSrcContainerId);
        var inlineTemplateHTML = $localTemplateSrcContainer.html();
        if (klib.isBlank(inlineTemplateHTML)) {
          klib.console.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined inline in ["+localTemplateSrcContainerId+"].");
        }
        else {
          klib.addTemplateScript(tmplId, inlineTemplateHTML, templateType);
          if (tmplPath.equalsIgnoreCase("inline")) $localTemplateSrcContainer.html("");
        }
      }
      else if (tmplPath.equalsIgnoreCase("none")) {
        klib.console.warn("Template[" + tmplId + "] of [" + templateType + "] defined as NONE. Ignoring template.");
      }
      else if (!tmplPath.equalsIgnoreCase("script")) { /* load from templdate-URL */
        var axTemplateRequest;
        if (tmplReload) {
          klib.console.warn(">>>>>>>>>> Making New Template Request");
          axTemplateRequest = $.ajax({
            url: tmplPath,
            cache: false,
            dataType: "html",
            success: function (template) {
              klib.addTemplateScript(tmplId, template, templateType);
              klib.console.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
            },
            error: function (jqXHR, textStatus, errorThrown) {
              klib.console.error("Failed Loading Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]. [" + textStatus + ":" + errorThrown + "]");
            }
          });
        } else {
          axTemplateRequest = $.get(tmplPath, function (template) {
            klib.addTemplateScript(tmplId, template, templateType);
            klib.console.info("Loaded Template[" + tmplId + "] of [" + templateType + "] from [" + tmplPath + "]");
          });
        }
        tAjaxRequests.push(axTemplateRequest);
      } else {
        klib.console.error("Template[" + tmplId + "] of [" + templateType + "] NOT defined in <script>.");
      }
    }
    else {
      var $tmplId = $("#"+tmplId);
      if (tmplReload) {
        klib.console.warn("Reload Template[" + tmplId + "] of [" + templateType + "]");
        $tmplId.remove();
        tAjaxRequests = klib.loadTemplate(tmplId, tmplPath, templateType, viewContainderId, tAjaxRequests, tmplReload);
      } else if (klib.isBlank(($tmplId.html()))) {
        klib.console.warn("Template[" + tmplId + "] of [" + templateType + "] script found EMPTY!");
        var externalPath = "" + $tmplId.attr("path");
        if (!klib.isBlank((externalPath))) {
          templateType = ((($tmplId.attr("type")||"").ifBlank(templateType)).toLowerCase()).replace(/text\//gi, "");
          klib.console.info("prepare/remove to re-load Template[" + tmplId + "]  of [" + templateType + "] from external path: [" + externalPath + "]");
          $tmplId.remove();
          tAjaxRequests = klib.loadTemplate(tmplId, externalPath, templateType, viewContainderId, tAjaxRequests, tmplReload);
        }
      } else {
        klib.console.info("Template[" + tmplId + "]  of [" + templateType + "] already found in local.");
      }
    }
    klib.console.groupEnd("kTemplateAjaxQue");

    return (tAjaxRequests);
  };

  klib.loadTemplatesCollection = function (templateCollectionId, dataTemplatesCollectionUrl) {
    templateCollectionId = (templateCollectionId.beginsWith("#") ? "" : "#") + templateCollectionId;
    var retValue = {};
    if (!klib.isElementExist(templateCollectionId)) {
      klib.console.info(templateCollectionId + " NOT Found! Creating one...");
      if (!klib.isElementExist("#kViewTemplateCotainer")) {
        klib.console.info("#kViewTemplateCotainer NOT Found! Creating one...");
        $('body').append("<div id='kViewTemplateCotainer' style='display:none' rel='Template Container'></div>");
      }
      $("#kViewTemplateCotainer").append("<div id='" + (templateCollectionId.substring(1)) + "' style='display:none' rel='Template Collection Container'></div>");

      /*$.ajaxSetup({async: false});*/
      /*wait till this template collection loads*/
      $.ajax({
        url: dataTemplatesCollectionUrl,
        cache: true,
        dataType: "html",
        async: false,
        success: function (result) {
          /*$.ajaxSetup({async: true});*/
          $(templateCollectionId).html(result);
          klib.console.info("Loaded Template Collection [" + templateCollectionId + "] from [" + dataTemplatesCollectionUrl + "]");

          /* Read all script id(s) in collection */
          klib.console.info("Found following templates in Template Collection.");
          $(templateCollectionId + " script").each(function (index, element) {
            retValue[$(element).attr("id")] = 'script';
          });
          klib.console.info({o: retValue});
        },
        error: function (jqXHR, textStatus, errorThrown) {
          /*$.ajaxSetup({async: true});*/
          klib.console.error("Failed Loading Template Collection [" + templateCollectionId + "] from [" + dataTemplatesCollectionUrl + "]. [" + textStatus + ":" + errorThrown + "]");
        }
      });
    }
    else {
      klib.console.info(templateCollectionId + " Found! skip template collection load from " + dataTemplatesCollectionUrl);
    }
    return (retValue);
  };


  /*Get URL Parameters as Object
   * if url = http://xyz.com/page?param0=value0&param1=value1&paramX=valueA&paramX=valueB
   * klib.urlParams() => {param0: "value0", param1:"value1", paramX:["valueA", "valueB"]}
   * klib.urlParams()["param0"] => "value0"
   * klib.urlParams().param0    => "value0"
   * klib.urlParams().paramX    => ["valueA", "valueB"]
   * klib.urlParams().paramZ    => undefined
   * */
  klib.urlParams = function (urlQuery) {
    urlQuery = (urlQuery || window.location.search || "");
    urlQuery = (urlQuery.beginsWith("\\?") || urlQuery.indexOf("//") < 7) ? urlQuery.substr(urlQuery.indexOf("?") + 1) : urlQuery;
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
   * klib.urlParam("param0") => "value0"
   * klib.urlParam("paramX") => ["valueA", "valueB"]
   * klib.urlParam("paramZ") => undefined
   * */
  klib.urlParam = function (name, queryString) {
    return (klib.urlParams(queryString)[name]);
  };

  /*Get URL Hash value
   * current window location = http://xyz.com/page#/hash0/hash1/hash2
   * klib.getLocHash()   => "#/hash0/hash1/hash2"
   * */
  klib.getLocHash = function(){
    return window.location.hash || "";
  };
  /*Get URL Hash value
   * if url = http://xyz.com/page#/hash0/hash1/hash2
   * klib.urlHash()   => "/hash0/hash1/hash2"
   * klib.urlHash(1)  => "hash1"
   * klib.urlHash([]) => ["hash0", "hash1", "hash2"]
   * klib.urlHash(["key0", "key1", "key3"]) => {"key0":"hash0", "key1":"hash1", "key2":"hash2"}
   * */
  klib.urlHash = function (returnOf, hashDelimiter) {
    var retValue = (klib.getLocHash() || "#").substring(1);
    if (returnOf) {
      hashDelimiter = hashDelimiter || "/";
      retValue = retValue.beginsWith(hashDelimiter) ? retValue.substring(retValue.indexOf(hashDelimiter) + (hashDelimiter.length)) : retValue;
      var hashArray = retValue.split(hashDelimiter);
      if (_.isNumber(returnOf)) {
        retValue = (hashArray && hashArray.length > returnOf) ? hashArray[returnOf] : "";
      }
      else if (_.isArray(returnOf)) {
        retValue = (returnOf.length === 0) ? hashArray : _.object(returnOf, hashArray);
      } else if (_.isString(returnOf) && returnOf == "?") {
        retValue = (retValue.contains("\\?"))? klib.getOnSplit(retValue, "?", 1) : "";
      }
    }
    return retValue;
  };
  /*Similar to klib.urlParam on HashParams*/
  klib.hashParam = function (name) {
    var retValue = (''+klib.urlHash('?'));
    if (typeof name !== "undefined" && !klib.isBlank(retValue)) {
      retValue = klib.urlParam((''+name), retValue);
    }
    return (retValue);
  };

  /*
   klib.routeMatch("#url-path/:param1/:param2?id=:param3", "#url-path/serviceName/actionName?id=Something")
   ==>
   {   hkeys: [':param1', ':param2', ':param3']
   , params: {'param1':'serviceName','param2':'actionName','param3':'Something'}
   }
   *
   * */
  klib.routeMatch = function (routePattern, urlHash) {
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
  klib.i18n = {};
  klib.i18n.loaded = false;
  klib.i18n.settings = {
    name: 'Language',
    path: 'language/',
    encoding: 'UTF-8',
    cache: true,
    mode: 'map',
    callback: null
  };
  klib.i18n.setLanguage = function (lang, i18nSettings) {
    if ($.i18n) {
      lang = lang || ($.i18n.browserLang()).replace(/-/g, "_");
      i18nSettings = $.extend(klib.i18n.settings, i18nSettings);
      $.i18n.properties({
        name: i18nSettings.name,
        language: lang,
        path: i18nSettings.path,
        encoding: i18nSettings.encoding,
        cache: i18nSettings.cache,
        mode: i18nSettings.mode,
        callback: function () {
          $.i18n.loaded = (typeof $.i18n.loaded == "undefined") ? (!$.isEmptyObject($.i18n.map)) : $.i18n.loaded;
          klib.i18n.loaded = klib.i18n.loaded || $.i18n.loaded;
          if ((lang.length > 1) && (!$.i18n.loaded)) {
            klib.console.warn("Error Loading Language File [" + lang + "]. Loading default.");
            klib.i18n.setLanguage("_", i18nSettings);
          }
          klib.i18n.apply();
          if (i18nSettings.callback) {
            i18nSettings.callback($.i18n.loaded);
          }
        }
      });
    }
  };

  klib.i18n.text = function (i18nKey, data) {
    var dMessage = $.i18n.prop(i18nKey);
    if (data) {
      var msgParamValue = "";
      _.each(_.keys(data), function (key) {
        msgParamValue = "" + data[key];
        if (msgParamValue && msgParamValue.beginsWith("i18n:", "i")) msgParamValue = $.i18n.prop(msgParamValue.replace(/i18n:/gi, ""));
        dMessage = dMessage.replace(new RegExp("{" + key + "}", "gi"), msgParamValue);
      });
    }
    return dMessage;
  };

  klib.i18n.apply = klib.i18n.render = function (contextRoot, elSelector) {
    if (klib.i18n.loaded) {
      contextRoot = contextRoot || "body";
      elSelector = elSelector || "";
      $(elSelector + "[data-i18n]", contextRoot).each(function (indes, el) {
        var i18nSpec = klib.toJSON($(el).data("i18n") || "{}");
        var i18nData = i18nSpec['i18ndata'];
        if (i18nData) delete i18nSpec['i18ndata'];
        if (i18nSpec && !$.isEmptyObject(i18nSpec)) {
          _.each(_.keys(i18nSpec), function (attrSpec) {
            var i18nKey = i18nSpec[attrSpec];
            var i18nValue = klib.i18n.text(i18nKey, i18nData); //$.i18n.prop(i18nKey);
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

  /* Backbone.Model extended for CRUD specific URLs support
   * urlRoot: URL or {default:URL, create:URL, read:URL, update:URL, delete:URL, patch:URL}
   *
   * URL: String with optional template-variables
   * {crud} ==> create|read|update|delete|patch
   * {model keys}
   *
   * example:
   *
   * urlRoot: "/api/member.json?action={crud}&id={memid}"
   *
   * */
  klib.extendBackbone = function () {
    if (window.Backbone) {
      klib.console.info("Found Backbone. Extending ...");
      // override the Model prototype for CRUD specific URLs.
      _.extend(Backbone.Model.prototype, Backbone.Events, {

        activeCRUD: "",

        diffAttributes: function (dOptions) {
          return (window.jsondiffpatch) ? jsondiffpatch.diff(this.previousAttributes(), this.toJSON(), dOptions) : this.changedAttributes();
        },

        sync: function () {
          this.activeCRUD = arguments[0];
          return Backbone.sync.apply(this, arguments);
        },

        url: function () {
          var baseURL, ajaxURL, qryParams, kURLs, paramName;
          var urlRoot = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
          if (urlRoot) {
            kURLs = (typeof urlRoot === "object") ? urlRoot : {'defaulturl': urlRoot};
            kURLs['patch'] = kURLs['patch'] || kURLs['update'];

            baseURL = _.result(kURLs, this.activeCRUD.toLowerCase() + "url") || _.result(kURLs, 'defaulturl') || urlError();
            ajaxURL = (baseURL.replace(/\{crud\}/gi, this.activeCRUD.toUpperCase()).replace(/\{now\}/gi, klib.now()))
              + ((this.isNew() || (baseURL.indexOf("?") > 0)) ? '' : ((((baseURL.charAt(baseURL.length - 1) === '/') ? '' : '/') + encodeURIComponent(this.id))));
            while ((qryParams = ajaxURL.match(/{([\s\S]*?)}/g)) && qryParams && qryParams[0]) {
              paramName = qryParams[0].replace(/[{}]/g, '');
              ajaxURL = ajaxURL.replace(new RegExp(qryParams[0], "g"), ((paramName.indexOf(".") >= 0) ? klib.find(this.toJSON(), paramName) : this.get(paramName)) || "");
            }
          }
          klib.console.info("Backbone Sync Url: " + ajaxURL);
          return (ajaxURL);
        }
      });
    }
    else {
      klib.console.warn("Backbone not found. NOT extending...");
    }
  };

  /*Load Backbone Model Class from a remote location*/
  klib.loadBackboneModelClass = function (bbModelClassUrl, options) {
    options || (options = {});
    var retValue = {url: bbModelClassUrl, bbclass: Backbone.Model.extend({'defaults': {}}), success: false};
    /*$.ajaxSetup({async: false});*/
    /*wait till this data loads*/
    $.ajax({
      url: retValue.url,
      dataType: "text",
      async: false,
      success: function (result) {
        /*$.ajaxSetup({async: true});*/
        result = result.substring(result.indexOf('{'));
        retValue.bbclass = Backbone.Model.extend(klib.toJSON(result));
        retValue.success = true;
        if (options.success) options.success(result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        /*$.ajaxSetup({async: true});*/
        klib.console.error("Failed loading backbone class from [" + (retValue.url) + "]. [" + textStatus + ":" + errorThrown + "]");
        if (options.fail) options.fail(retValue.url, jqXHR, textStatus, errorThrown);
      }
    });
    return (retValue);
  };

  klib.getModifiedElement = function (elSelector) {
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
  klib.getModifiedElements = function (elSelector) {
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

  klib.initTrackElValueChanges = klib.resetElementsDefaultValue = function (elSelector) {
    $(elSelector || "form :input:not(:disabled)").each(function (index, element) {
      element.defaultValue = element.value;
      if ((element.tagName.match(/^input$/i)) && (element.type.match(/^(checkbox|radio)$/i) && element.checked != element.defaultChecked)) {
        element.defaultChecked = element.checked;
      }
    });
  };

  klib.trash = {
      container:[]
    , push : function(junk){ this.container.push(junk); }
    , empty: function(){this.container = []; }
    , pick : function(tIndex){ return ((tIndex)? this.container[tIndex] : this.container); }
  };
  klib.fillData = function (data, context, options) {
    var ready2Fill = ((typeof data) == "object");

    if (context && ((typeof context) == "object")) {
      options = context;
      context = null;
    }
    context = context || "body";

    var fillOptions = {
      dataParams: {},
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
      /*$.ajaxSetup({async: false});*/
      /*wait till this data loads*/
      $.ajax({
        url: data,
        data: fillOptions.dataParams,
        cache: fillOptions.dataCache,
        dataType: "text",
        async: false,
        success: function (result) {
          /*$.ajaxSetup({async: true});*/
          data = klib.toJSON(result);
          ready2Fill = ((typeof data) == "object");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          /*$.ajaxSetup({async: true});*/
          klib.console.error("Failed loading data from [" + data + "]. [" + textStatus + ":" + errorThrown + "]");
        }
      });
    }
    if (ready2Fill) {
      var keyFormat = fillOptions.keyFormat;

      keyFormat = (keyFormat.match(/^[a-z]/) != null) ? "aBc" : keyFormat;
      keyFormat = (keyFormat.match(/^[A-Z]/) != null) ? "AbC" : keyFormat;

      var dataKeys = klib.keysDotted(data);
      klib.console.group("fillData");
      klib.console.info(dataKeys);

      _.each(dataKeys, function (dataKeyPath) {
        klib.console.group(">>" + dataKeyPath);
        var dataKey = ""+(dataKeyPath.replace(/[\[\]]/g, "_") || "");
        var dataKeyForFormatterFnSpec = dataKeyPath.replace(/\[[0-9]+\]/g, "");
        var isArrayKey = (/\[[0-9]+\]/).test(dataKeyPath);

        switch (keyFormat) {
          case "_" :
            dataKey = klib.dotToX(dataKey, "_");
            dataKeyForFormatterFnSpec = klib.dotToX(dataKeyForFormatterFnSpec, "_");
            break;
          case "AbC":
            dataKey = klib.dotToTitleCase(dataKey);
            dataKeyForFormatterFnSpec = klib.dotToTitleCase(dataKeyForFormatterFnSpec);
            break;
          default:
            dataKey = klib.dotToCamelCase(dataKey);
            dataKeyForFormatterFnSpec = klib.dotToCamelCase(dataKeyForFormatterFnSpec);
            break;
        }

        var debugInfo = {
          "patternKey": dataKey + (isArrayKey ? (" || " + dataKeyForFormatterFnSpec) : ""),
          "formatterKey": dataKeyForFormatterFnSpec,
          "isArrayChild": isArrayKey
        };
        klib.trash.push(debugInfo);
        klib.console.info(debugInfo);
        klib.trash.empty();

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
        klib.console.info(">> " + elSelector + " found: " + $(elSelector, context).length);
        var dataValue = null;
        if ($(elSelector, context).length > 0) {
          dataValue = klib.find(data, dataKeyPath);
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
          klib.console.info({value: dataValue});
        }
        $(elSelector, context).each(function (index, el) {
          klib.console.info(el);
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
              klib.selectOptionForValue(el, dataValue);
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

        klib.console.groupEnd(">>" + dataKeyPath);
      });

      klib.console.groupEnd("fillData");
      if (fillOptions.resetElDefaultInContext) klib.resetElementsDefaultValue(context + " :input");
    }
  };

  klib.toRenderDataStructure = function(saoDataUrl, soParams) {
    var retObj = {}
      , dataCollection = {}
      , itemUrl = {}
      , oParams = {};

    if (soParams){
      oParams = (_.isString(soParams))? klib.queryStringToJson(soParams) : ((_.isObject(soParams))? soParams : {});
    }
    switch(true) {
      case (_.isString(saoDataUrl)) :
        /* 'path/to/data/api' => {dataUrl:'path/to/data/api'}
           'target.data.key|path/to/data/api' => {dataUrl:'path/to/data/api', dataModel:'target.data.key'}
        */
        if (saoDataUrl.contains("\\|")) {
          retObj['dataModel'] = klib.getOnSplit(saoDataUrl, "|", 0);
          saoDataUrl = klib.getOnLastSplit(1);
        }
        retObj['dataUrl'] = saoDataUrl;
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
          itemUrl = {url:apiUrl, params:oParams};
          if (apiUrl.contains("\\|")) {
            itemUrl['target'] = klib.getOnSplit(apiUrl, "|", 0);
            itemUrl['url'] = klib.getOnLastSplit(1);
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
          itemUrl = {name:dName, url:saoDataUrl[dName], params:oParams};
          if (saoDataUrl[dName].contains("\\|")) {
            itemUrl['target'] = klib.getOnSplit(saoDataUrl[dName], "|", 0);
            itemUrl['url'] = klib.getOnLastSplit(1);
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

  /* each kRender's view and model will be stored in renderHistory */
  klib.viewModels = {};
  klib.renderHistory = {};
  klib.renderHistoryMax = 0;
  klib.defaults = {
    dataTemplateEngine: "handlebars"
  };

  /*
   * klib.render("#containerID")
   *
   * OR
   *
   uOption = {
   data                      : {}    // Data(JSON Object) to be used in templates; for html data-attribute see dataUrl

   ,dataUrl                   : ""    // External Data(JSON) URL | local:dataModelVariableName
   ,dataUrlErrorHandle        : ""    // single javascript function name to run if external data url fails; NOTE: (jqXHR, textStatus, errorThrown) are injected to the function.
   ,dataParams                : {}    // dataUrl Params (NO EQUIVALENT data-attribute)
   ,dataModel                 : ""    // External Data(JSON) "key" for DataObject; default: "data"; may use name-space x.y.z (with the cost of performance)
   ,dataModelType             : ""    // "Backbone" applicable only for local data eg: data or dataUrl:"local:XXXXXX"
   // "Backbone:{classpath:'path-to-backbone-model-class.js', classsuccess:jsFunctionName, classerror:jsFunctionName, defaults:{}, fetchsuccess:jsFunctionName, fetcherror:jsFunctionName}"
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

   ,dataTemplatesCollectionUrl: ""    // location of single file containing all the templates; helps to load all templates in single request. use "dataTemplate" to define primary tempate to be used for rendering
   ,dataTemplates             : {}    // Templates to be used for rendering {tmplID:'inline', tmplID:'script', tmplID:'URL'}
   ,dataTemplateEngine        : ""    // handlebars (*default*) | underscore | underscore-as-mustache | mustache | hogan
   ,dataTemplate              : ""    // Primary Template ID ==> content may be inline or <script>
                                      // dataTemplate = dataTemplates[0]; if dataTemplate is not defined

   ,dataTemplatesCache        : true  // cache of Templates

   ,dataScripts               : {}    // scripts (js) to be loaded along with templates
   ,dataScriptsCache          : true  // cache of dataScripts

   ,dataStyles                : {}    // styles (css) to be loaded along with templates
   ,dataStylesCache           : true  // cache of dataStyles

   ,dataRenderEngine          : ""    // Backbone | hogan
   ,dataRenderCallback        : ""    // single javascript function name to run after render

   ,dataRenderId              : ""    // Render Id, may be used to locate in klib.renderHistory[dataRenderId], auto-generated key if not defined
   ,saveOptions               : false // Save options in render-container element
   };

   klib.render("#containerID", uOption);
   */
  klib.render = function (viewContainderId, uOptions) {

    var retValue = {id: "", view: {}, model: {}, cron: "", elDataAttr:{}, iOptions:uOptions};
    var kAjaxRequestsQue = [];
    var foundViewContainer = klib.isElementExist(viewContainderId);
    if (foundViewContainer){
      retValue.elDataAttr = $(viewContainderId).data();
    }

    //key: RenderEngine
    var kDefaultTemplateConfig = {
      "backbone": {"engine": "underscore", "template": "x-underscore-template"}
      , "hogan": {"engine": "hogan", "template": "x-hogan-template"}
      , "unknown": {"engine": "unknown", "template": "x-unknown-template"}
    };
    /*kDefaultTemplateConfig[kRenderEngineKey].engine
     kDefaultTemplateConfig[kRenderEngineKey].template*/

    var noOfArgs = arguments.length;
    var useOptions = (noOfArgs > 1);
    var useParamData = (useOptions && uOptions.hasOwnProperty('data'));
    var dataFound = true;

    var kRVOptions = {
      data: {}
      , dataUrl: ""
      , dataUrlErrorHandle: ""
      , dataParams: {}
      , dataModel: ""
      , dataModelType: ""
      , dataCache: false

      , dataCollection: {}

      , dataTemplatesCollectionUrl: ""
      , dataTemplates: {}
      , dataTemplateEngine: ""
      , dataTemplate: ""
      , dataTemplatesCache: true

      , dataScripts: {}
      , dataScriptsCache: true

      , dataStyles: {}
      , dataStylesCache: true

      , dataRenderEngine: ""
      , dataRenderCallback: ""

      , dataRenderId: ""
    };

    if (!foundViewContainer) {
      if (!klib.isElementExist("#kRunTimeHtmlContainer")) {
        $("body").append("<div id='kRunTimeLoadContainer' style='display:none;'></div>");
      }
      $("#kRunTimeLoadContainer").append("<div id='" + viewContainderId.replace(/\#/gi, "") + "'></div>")
    }
    if (useOptions) { /* for each user option set/override internal kRVOptions */
      /* store options in container data properties if saveOptions == true */
      var saveOptions = (uOptions.hasOwnProperty("saveOptions") && uOptions["saveOptions"]);
      for (var key in uOptions) {
        kRVOptions[key] = uOptions[key];
        if (saveOptions && (!(key === "data" || key === "saveOptions"))) {
          $(viewContainderId).data((""+( ("" + (_.at(""+key,4)||"") ).toLowerCase() )+key.slice(5)), klib.toStr(uOptions[key]));
        }
      }
    }


    /*Render Id*/
    var kRenderId = ("" + $(viewContainderId).data("renderId")).replace(/undefined/, "");
    if (!klib.isBlank(kRVOptions.dataRenderId)) {
      kRenderId = kRVOptions.dataRenderId;
    }
    retValue.id = (kRenderId.ifBlank(("kRender" + (klib.now()) + (klib.rand(1000, 9999)))));

    /* Render Engine */
    var kRenderEngine = ("" + $(viewContainderId).data("renderEngine")).replace(/undefined/, "");
    if (!klib.isBlank(kRVOptions.dataRenderEngine)) {
      kRenderEngine = kRVOptions.dataRenderEngine;
    }
    kRenderEngine = (kRenderEngine.ifBlank("unknown")).toLowerCase();
    var kRenderEngineKey = kRenderEngine;
    if (!kDefaultTemplateConfig.hasOwnProperty(kRenderEngineKey)) {
      kRenderEngineKey = "unknown";
      kRenderEngine += "-unknown";
    }
    var kTemplateType = kDefaultTemplateConfig[kRenderEngineKey].template;

    var kTemplateEngine = ("" + $(viewContainderId).data("templateEngine")).replace(/undefined/, "");
    if (!klib.isBlank(kRVOptions.dataTemplateEngine)) {
      kTemplateEngine = kRVOptions.dataTemplateEngine;
    }
    if (klib.isBlank(kTemplateEngine)) //No TemplateEngine specified
    {
      if (kRenderEngineKey.equalsIgnoreCase("unknown")) //or NO RenderEngine Specified;
      {
        kTemplateEngine = (klib.defaults.dataTemplateEngine || "handlebars");
      }
      else //set TemplateEngine based on RenderEngine
      {
        kTemplateEngine = (kTemplateEngine.ifBlank(kDefaultTemplateConfig[kRenderEngineKey].engine)).toLowerCase();
      }
    }
    switch (kTemplateEngine) {
      case "hogan":
        if (kRenderEngine == "unknown") {
          kRenderEngineKey = kRenderEngine = kTemplateEngine;
          kTemplateType = kDefaultTemplateConfig[kRenderEngineKey].template;
        }
        break;
    }
    var kBackboneModelOption = {};
    var kViewDataModelType = ("" + $(viewContainderId).data("modelType")).replace(/undefined/, "");
    if (!klib.isBlank(kRVOptions.dataModelType)) {
      kViewDataModelType = kRVOptions.dataModelType;
    }
    if (kViewDataModelType.beginsWith("backbone:", "i")) {
      kBackboneModelOption = klib.toJSON(kViewDataModelType.substring(9));
      kViewDataModelType = "backbone";
      if (kRenderEngine.equalsIgnoreCase("unknown")) kRenderEngine = "backbone";
    }
    kViewDataModelType = (kViewDataModelType.ifBlank()).toLowerCase();

    /* Load Scripts Begins */

    klib.console.group("kLoadingViewScripts");
    if (!(useOptions && uOptions.hasOwnProperty('dataScriptsCache'))) /* NOT provided in Render Request */
    { /* Read from view container [data-scripts-cache='{true|false}'] */
      var scriptsCacheInTagData = ("" + $(viewContainderId).data("scriptsCache")).replace(/undefined/, "");
      if (!klib.isBlank(scriptsCacheInTagData)) {
        kRVOptions.dataScriptsCache = scriptsCacheInTagData.toBoolean();
        klib.console.info("Override [data-scripts-cache] with [data-scripts-cache] option in tag-attribute: " + kRVOptions.dataScriptsCache);
      }
    }
    else {
      klib.console.info("Override [data-scripts-cache] with user option [dataScriptsCache]: " + kRVOptions.dataScriptsCache);
    }

    var vScriptsList = (""+ $(viewContainderId).data("scripts")).replace(/undefined/, "");
    if (vScriptsList && klib.isBlank((vScriptsList || "").replace(/[^:'\"]/g,''))){
      vScriptsList = "'"+ ((vScriptsList).split(",").join("','")) + "'"
    }
    var vScripts = klib.toJSON(vScriptsList || "{}");

    /* Check the option to override */
    if (!$.isEmptyObject(kRVOptions.dataScripts)) {
      vScripts = kRVOptions.dataScripts;
    }
    if (_.isArray(vScripts)) {
      _.remove(vScripts,function(item){ return !item; });
    }
    klib.console.info(vScripts);
    if (vScripts && (!$.isEmptyObject(vScripts))) {
      if (_.isArray(vScripts)) {
        klib.console.info("Convert array of script(s) without scriptID to object with scriptID(s).");
        var newScriptsObj = {};
        var dynScriptIDForContainer = "__scripts_"+(viewContainderId.trim("#"))+"_";
        _.each(vScripts, function(scriptUrl, sIndex){
          klib.console.log(scriptUrl);
          if (scriptUrl) {
            newScriptsObj[dynScriptIDForContainer + (sIndex)] = (""+scriptUrl);
          }
        });
        klib.console.info("Scripts(s) with scriptID(s).");
        klib.console.log(newScriptsObj);
        vScripts = (_.isEmpty(newScriptsObj))? {} : newScriptsObj;
      }

      klib.console.info("External scripts to be loaded [cache:" + (kRVOptions.dataScriptsCache) + "] along with view container [" + viewContainderId + "] => " + JSON.stringify(vScripts));
      var vScriptsNames = _.keys(vScripts);

      klib.console.group("kLoadingScripts");
      _.each(vScriptsNames, function (scriptId) {
        kAjaxRequestsQue = klib.loadScript(scriptId, vScripts[scriptId], kRVOptions.dataScriptsCache, kAjaxRequestsQue);
      });
      klib.console.info("External Scripts Loading Status: " + JSON.stringify(kAjaxRequestsQue));
      klib.console.groupEnd("kLoadingScripts");
    }
    else {
      klib.console.info("No scripts defined [data-scripts] in view container [" + viewContainderId + "] to load.");
    }
    klib.console.groupEnd("kLoadingViewScripts");

    /* Load Scripts Ends */

    /*Wait till scripts are loaded before proceed*/
    $.when.apply($, kAjaxRequestsQue)
      .then(function () {
        klib.console.info("External Scripts Loaded.");
      })
      .fail(function () {
        klib.console.error("External Scripts Loading Failed! Unexpected!? Check the Script Path/Network.");
      });

    /* Load Data */
    klib.console.group("kDataModel");
    var dataModelName = ("" + $(viewContainderId).data("model")).replace(/undefined/, ""), viewDataModelName;
    if (!klib.isBlank(kRVOptions.dataModel)) {
      dataModelName = kRVOptions.dataModel;
    }
    var dataModelUrl = ("" + $(viewContainderId).data("url")).replace(/undefined/, ""); //from HTML
    if (!klib.isBlank(kRVOptions.dataUrl)) {
      dataModelUrl = kRVOptions.dataUrl;
    }
    var isLocalDataModel = (useParamData || (dataModelUrl.beginsWith("local:", "i")));
    var defaultDataModelName = (dataModelUrl.beginsWith("local:", "i")) ? dataModelUrl.replace(/local:/gi, "") : "data";
    dataModelName = dataModelName.ifBlank(defaultDataModelName);
    viewDataModelName = dataModelName.replace(/\./g, "_");

    var kTemplateModelData = {};
    if (useParamData) {
      kTemplateModelData[viewDataModelName] = kRVOptions.data;
      klib.console.info("Loaded data model [" + dataModelName + "] from argument");
    }
    else {
      if (!(useOptions && uOptions.hasOwnProperty('dataCache'))) /* NOT provided in Render Request */
      { /* Read from view container [data-cache='{true|false}'] */
        var dataCacheInTagData = ("" + $(viewContainderId).data("cache")).replace(/undefined/, "");
        if (!klib.isBlank(dataCacheInTagData)) {
          kRVOptions.dataCache = dataCacheInTagData.toBoolean();
          klib.console.info("Override [data-cache] with [data-cache] option in tag-attribute: " + kRVOptions.dataCache);
        }
      }
      else {
        klib.console.info("Override [data-cache] with user option [dataCache]: " + kRVOptions.dataCache);
      }
      if (klib.isBlank(dataModelUrl)) { /*dataFound = false;*/
        kTemplateModelData[viewDataModelName] = {};

        //Check dataCollection
        var dataModelCollection = ("" + $(viewContainderId).data("collection")).replace(/undefined/, ""); //from HTML
        if (dataModelCollection) dataModelCollection = klib.toJSON(dataModelCollection); //convert to json if found
        if (!klib.isBlank(kRVOptions.dataCollection)) //override with javascript
        {
          dataModelCollection = kRVOptions.dataCollection;
        }
        if (_.isArray(dataModelCollection)) dataModelCollection = {urls: dataModelCollection};

        var dataModelUrls = dataModelCollection['urls'];

        if (klib.isBlank(dataModelUrls)) {
          klib.console.warn("Model Data [" + dataModelName + "] or [data-url] or [data-collection] NOT found! Check the arguments or html markup. Rendering with empty data {}.");
        }
        else { //Processing data-collection


          if (!_.isArray(dataModelUrls)) {
            klib.console.warn("Invalid [data-urls].Check the arguments or html markup. Rendering with empty data {}.");
          }
          else {
            klib.console.info("Processing data-URLs");
            var dataIndexApi = 0, defaultAutoDataNamePrefix = dataModelCollection['nameprefix'] || "data";
            _.each(dataModelUrls, function (dataApi) {
              var defaultApiDataModelName = (defaultAutoDataNamePrefix + dataIndexApi)
                , apiDataModelName = _.has(dataApi, 'name') ? (('' + dataApi.name).replace(/[^a-zA-Z0-9]/gi, '')) : (_.has(dataApi, 'target') ? ('' + dataApi.target) : defaultApiDataModelName)
                , apiDataUrl = _.has(dataApi, 'url') ? dataApi.url : (_.has(dataApi, 'path') ? dataApi.path : '');

              if (apiDataModelName.contains(".")) {
                apiDataModelName = _.last(apiDataModelName.split("."), 1);
              }
              apiDataModelName = apiDataModelName.ifBlank(defaultApiDataModelName);
              klib.console.info('processing data-api for: ' + apiDataModelName);
              klib.console.log(dataApi);

              if (apiDataUrl) {
                kAjaxRequestsQue.push(
                  $.ajax({
                    url: apiDataUrl,
                    data: _.has(dataApi, 'params') ? dataApi.params : (_.has(dataApi, 'data') ? dataApi.data : {}),
                    cache: _.has(dataApi, 'cache') ? dataApi.cache : kRVOptions.dataCache,
                    dataType: "text",
                    success: function (result) {
                      var targetApiData
                        , targetDataModelName = _.has(dataApi, 'target') ? ('' + dataApi.target) : ''
                        , oResult = ("" + result).toJSON();

                      if (targetDataModelName.indexOf(".") > 0) {
                        targetApiData = klib.hasKey(oResult, targetDataModelName) ? klib.find(oResult, targetDataModelName) : oResult;
                      }
                      else {
                        targetApiData = oResult.hasOwnProperty(targetDataModelName) ? oResult[targetDataModelName] : oResult;
                      }
                      if (kTemplateModelData[viewDataModelName][apiDataModelName]) {
                        kTemplateModelData[viewDataModelName][apiDataModelName] = [kTemplateModelData[viewDataModelName][apiDataModelName]];
                        kTemplateModelData[viewDataModelName][apiDataModelName].push(targetApiData);
                      }
                      else {
                        kTemplateModelData[viewDataModelName][apiDataModelName] = targetApiData;
                      }
                      klib.console.info("Loaded data model [" + apiDataModelName + "] from [" + apiDataUrl + "]");

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
                      klib.console.warn("Error processing data-api [" + apiDataUrl + "]");
                      //Call user defined function on api-data URL Error
                      var fnOnApiDataUrlErrorHandle = dataApi['error'] || dataApi['onerror'] || dataApi['onError'];
                      if (!fnOnApiDataUrlErrorHandle) {
                        fnOnApiDataUrlErrorHandle = dataModelCollection['error'] || dataModelCollection['onerror'] || dataModelCollection['onError']; //use common error
                        if ((!fnOnApiDataUrlErrorHandle) && (!klib.isBlank(kRVOptions.dataUrlErrorHandle))) {
                          fnOnApiDataUrlErrorHandle = kRVOptions.dataUrlErrorHandle;
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
                klib.console.error("data-api-url not found. Please check the arguments or html markup. Skipped this data-api request");
              }
              dataIndexApi++;
            });
          }
        }
      }
      else {
        if (dataModelUrl.beginsWith("local:", "i")) { /*Local DataModel*/
          var localDataModelName = dataModelUrl.replace(/local:/gi, "");
          var localDataModelObj = {};
          if (typeof eval("(" + localDataModelName + ")") != "undefined") { /*localDataModelObj = eval("("+localDataModelName+")");*/
            eval("(localDataModelObj=" + localDataModelName + ")");
          }
          klib.console.info("Using LOCAL Data Model: " + localDataModelName);
          if (klib.isBlank(kViewDataModelType)) {
            if ((!isLocalDataModel) && (dataModelName.indexOf(".") > 0)) {
              kTemplateModelData[viewDataModelName] = klib.hasKey(localDataModelObj, dataModelName) ? klib.find(localDataModelObj, dataModelName) : localDataModelObj;
            } else {
              kTemplateModelData[viewDataModelName] = localDataModelObj.hasOwnProperty(dataModelName) ? localDataModelObj[dataModelName] : localDataModelObj;
            }
          }
          else {
            klib.console.info("Local Data: " + localDataModelName + " not found.");
            /*kViewDataModelType is Backbone with its Class.js on server */
            if ($.isEmptyObject(localDataModelObj) && !$.isEmptyObject(kBackboneModelOption)) {
              var bbClassUrl = kBackboneModelOption['classpath'] || "";
              if (!klib.isBlank(bbClassUrl)) {
                if (bbClassUrl.beginsWith("local:", "i")) {
                  var bbClassLocal = bbClassUrl.substring(6);
                  eval("( localDataModelObj = new " + bbClassLocal + "() )");
                }
                else {
                  klib.console.info("loading Backbone Model Class from: " + (bbClassUrl) + ".");
                  var noop = function () {
                  };
                  var loadBackboneModelClassResult = klib.loadBackboneModelClass(bbClassUrl, {
                    success: kBackboneModelOption['classsuccess'] || noop,
                    fail: kBackboneModelOption['classerror'] || noop
                  });
                  localDataModelObj = new loadBackboneModelClassResult.bbclass();
                  if (loadBackboneModelClassResult.success) {
                    if (kBackboneModelOption.defaults) {
                      localDataModelObj.set(kBackboneModelOption.defaults);
                    }
                    localDataModelObj.fetch({
                      async: false,
                      cache: false,
                      success: kBackboneModelOption['fetchsuccess'] || noop,
                      error: kBackboneModelOption['fetcherror'] || noop
                    });
                  }
                }
                eval("(" + localDataModelName + "=localDataModelObj)");
                kTemplateModelData[viewDataModelName] = localDataModelObj.toJSON();
              }
              else {
                klib.console.error("Backbone 'classpath' NOT defined. Please check the 'dataModelType' option.");
              }
            }
            else {
              kTemplateModelData[viewDataModelName] = kViewDataModelType.equalsIgnoreCase("backbone") ? localDataModelObj.toJSON() : localDataModelObj;
            }
          }
        }
        else { /*External Data Source*/
          klib.console.info("Request Data [" + dataModelName + "] [cache:" + (kRVOptions.dataCache) + "] from URL =>" + dataModelUrl);
          kAjaxRequestsQue.push(
            $.ajax({
              url: dataModelUrl,
              data: kRVOptions.dataParams,
              cache: kRVOptions.dataCache,
              dataType: "text",
              success: function (result) {
                var oResult = ("" + result).toJSON();
                if (dataModelName.indexOf(".") > 0) {
                  kTemplateModelData[viewDataModelName] = klib.hasKey(oResult, dataModelName) ? klib.find(oResult, dataModelName) : oResult;
                }
                else {
                  kTemplateModelData[viewDataModelName] = oResult.hasOwnProperty(dataModelName) ? oResult[dataModelName] : oResult;
                }
                klib.console.info("Loaded data model [" + dataModelName + "] from [" + dataModelUrl + "]");
              },
              error: function (jqXHR, textStatus, errorThrown) {
                //Call user defined function on Data URL Error
                var fnOnDataUrlErrorHandle = ("" + $(viewContainderId).data("urlErrorHandle")).replace(/undefined/, "");
                if (!klib.isBlank(kRVOptions.dataUrlErrorHandle)) {
                  fnOnDataUrlErrorHandle = "" + kRVOptions.dataUrlErrorHandle;
                }
                if (!klib.isBlank(fnOnDataUrlErrorHandle)) {
                  eval("(" + fnOnDataUrlErrorHandle + "(jqXHR, textStatus, errorThrown))");
                }
              }
            })
          );
        }
      }
    }
    klib.console.info("End of Data Processing");
    klib.console.log({o: kTemplateModelData});
    klib.console.groupEnd("kDataModel");

    if (dataFound) { /* Load Templates */

      var vTemplate2RenderInTag = ("" + $(viewContainderId).data("template")).replace(/undefined/, "");
      var vTemplatesList = (""+ $(viewContainderId).data("templates")).replace(/undefined/, "");
      if (vTemplatesList && klib.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
        vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'"
      }
      var vTemplates = klib.toJSON(vTemplatesList || "{}");//eval("(" + vTemplatesList + ")");//
      /* Check the option to override */
      if ((!(_.isObject(kRVOptions.dataTemplates))) && (_.isString(kRVOptions.dataTemplates))) {
        vTemplatesList = (kRVOptions.dataTemplates || "").trim();
        if (klib.isBlank((vTemplatesList || "").replace(/[^:'\"]/g,''))){
          vTemplatesList = "'"+ ((vTemplatesList).split(",").join("','")) + "'"
        };
        kRVOptions.dataTemplates = klib.toJSON(vTemplatesList);
      }
      if (!$.isEmptyObject(kRVOptions.dataTemplates)) {
        vTemplates = kRVOptions.dataTemplates;
        vTemplatesList = "" + (JSON.stringify(vTemplates));
      }
      if ((_.isEmpty(klib.toJSON((vTemplatesList||"").trim())))
        || (_.isArray(vTemplates) && vTemplates.length==1 && klib.isBlank(vTemplates[0]))) {
        vTemplates = {};
        vTemplatesList = "";
      }

      klib.console.info("Templates:");
      klib.console.info(vTemplates);
      //Handle if array without templateID, convert to object with auto templateID
      if (_.isArray(vTemplates) && !_.isEmpty(vTemplates)) {
        klib.console.info("Array of template(s) without templateID(s).");
        var newTemplatesObj = {};
        var dynTmplIDForContainer = "__tmpl_"+(viewContainderId.trim("#"))+"_";
        _.each(vTemplates, function(templateUrl, sIndex){
          klib.console.log(templateUrl);
          if (templateUrl) {
            newTemplatesObj[dynTmplIDForContainer + (sIndex)] = (""+templateUrl);
          }
        });
        klib.console.info("Template(s) with template ID(s).");
        console.log(newTemplatesObj);
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
        var _dataTemplate = kRVOptions.dataTemplate
          , _tmplKey = ""
          , _tmplLoc ="";
        if (klib.isBlank(_dataTemplate)) { //Not-in JS option
          if (!klib.isBlank(vTemplate2RenderInTag)) { //Found in tag
            klib.console.info("Template to load from location <"+vTemplate2RenderInTag+">");
            _dataTemplate = vTemplate2RenderInTag;
          }
        }

        _dataTemplate = (_dataTemplate || "").trim();
        klib.console.info("Primary Template: <"+_dataTemplate+">");
        if (klib.isBlank(_dataTemplate) || _dataTemplate.equalsIgnoreCase("inline") || _dataTemplate.equals(".")){
          klib.console.info("Using target container (inline) content as template.");
          _tmplKey = ("_tmplInline_" +(viewContainderId.trim("#")));
        } else if (_dataTemplate.beginsWith("#")) {
          klib.console.info("Using page container <"+_dataTemplate+"> content as template.");
          _tmplKey = _dataTemplate.trim("#");
        } else {
          klib.console.info("External path <"+_dataTemplate+"> content as template.");
          if (_dataTemplate.contains(":") && !_dataTemplate.beginsWithIgnoreCase("http")){
            _tmplKey = klib.getOnSplit(_dataTemplate, ":", 0).replace(/[^a-z0-9]/gi,'');
            _tmplLoc = klib.getOnLastSplit(1);
          } else {
            _tmplKey = (("__tmpl_"+(viewContainderId.trim("#"))+"_") + (klib.now()) + (klib.rand(1000, 9999)));
            _tmplLoc = _dataTemplate;
          }
        }

        vTemplates[_tmplKey] = _tmplLoc.replace(/['\"]/g,'');
        klib.console.info(vTemplates);
      }

      klib.console.group("kView");

      var dataTemplatesCollectionUrl = ("" + $(viewContainderId).data("templatesCollectionUrl")).replace(/undefined/, "");
      if (!klib.isBlank(kRVOptions.dataTemplatesCollectionUrl)) {
        dataTemplatesCollectionUrl = kRVOptions.dataTemplatesCollectionUrl;
      }
      if (!klib.isBlank(dataTemplatesCollectionUrl)) {
        var templateCollectionId = viewContainderId + "_TemplatesCollection";
        klib.loadTemplatesCollection(templateCollectionId, dataTemplatesCollectionUrl);
      }
      if (vTemplates && (!$.isEmptyObject(vTemplates))) {
        klib.console.info("Templates of [" + kTemplateType + "] to be used in view container [" + viewContainderId + "] => " + JSON.stringify(vTemplates));
        var vTemplateNames = _.keys(vTemplates);

        klib.console.group("kLoadingTemplates");

        /* Template Cache Begins: if false remove old templates */
        klib.console.group("kLoadingTemplatesCache");
        if (!(useOptions && uOptions.hasOwnProperty('dataTemplatesCache'))) /* NOT provided in Render Request */
        { /* Read from view container [data-templates-cache='{true|false}'] */
          var templatesCacheInTagData = ("" + $(viewContainderId).data("templatesCache")).replace(/undefined/, "");
          if (!klib.isBlank(templatesCacheInTagData)) {
            kRVOptions.dataTemplatesCache = templatesCacheInTagData.toBoolean();
            klib.console.info("Override [data-templates-cache] with [data-templates-cache] option in tag-attribute: " + kRVOptions.dataTemplatesCache);
          }
        }
        else {
          klib.console.info("Override [data-templates-cache] with user option [dataTemplatesCache]: " + kRVOptions.dataTemplatesCache);
        }
        klib.console.groupEnd("kLoadingTemplatesCache");

        klib.console.info("Load Templates");
        klib.console.info(vTemplates);
        _.each(vTemplateNames, function (tmplId, tmplIndex) {
          klib.console.info([tmplIndex, tmplId, vTemplates[tmplId], kTemplateType, viewContainderId]);
          kAjaxRequestsQue = klib.loadTemplate(tmplId, vTemplates[tmplId], kTemplateType, viewContainderId, kAjaxRequestsQue, !kRVOptions.dataTemplatesCache);
        });

        var vTemplate2RenderID = "#"+(vTemplateNames[0].trim("#"));

        //klib.console.error(vTemplate2RenderID);
        //if (vTemplate2RenderID.contains("__kRouteTemplate_ui_home")) {
        //  debugger;
        //}
        //
        //vTemplatesList = (""+vTemplatesList).replace(/undefined/, "");
        //klib.console.info("Templates: <"+vTemplatesList+">");
        //if (!klib.isBlank(vTemplatesList)) {
        //  if (klib.isBlank(kRVOptions.dataTemplate)) { /* Check in data-template property if any */
        //    if (!klib.isBlank(vTemplate2RenderInTag)) {
        //      vTemplate2RenderID = "#"+(vTemplate2RenderInTag.trim("#"));
        //    }
        //  }
        //  else { /* Check in Options if any */
        //    vTemplate2RenderID = "#"+((kRVOptions.dataTemplate).trim("#"));
        //  }
        //
        //  //TODO: Verify when given Templates and Template
        //  klib.console.info("Primary TemplateID: <"+vTemplate2RenderID+">");
        //  /* Loading Primary Template if needed */
        //  var vTemplate2RenderName = vTemplate2RenderID.replace(/#/g, "");
        //  if (vTemplatesList.indexOf(vTemplate2RenderName) < 0) {
        //    klib.console.info("Loading Primary Template: <"+vTemplate2RenderName+">");
        //    kAjaxRequestsQue = klib.loadTemplate(vTemplate2RenderName, '', kTemplateType, viewContainderId, kAjaxRequestsQue, !kRVOptions.dataTemplatesCache);
        //  }
        //}

        klib.console.info("External Data/Templates Loading Status: " + JSON.stringify(kAjaxRequestsQue));
        klib.console.groupEnd("kLoadingTemplates");

        klib.console.info("Render TemplateID: "+vTemplate2RenderID);

        /* Load Styles Begins */
        klib.console.group("kLoadingViewStyles");
        if (!(useOptions && uOptions.hasOwnProperty('dataStylesCache'))) /* NOT provided in Render Request */
        { /* Read from view container [data-styles-cache='{true|false}'] */
          var stylesCacheInTagData = ("" + $(viewContainderId).data("stylesCache")).replace(/undefined/, "");
          if (!klib.isBlank(stylesCacheInTagData)) {
            kRVOptions.dataStylesCache = stylesCacheInTagData.toBoolean();
            klib.console.info("Override [data-styles-cache] with [data-styles-cache] option in tag-attribute: " + kRVOptions.dataStylesCache);
          }
        }
        else {
          klib.console.info("Override [data-styles-cache] with user option [dataStylesCache]: " + kRVOptions.dataStylesCache);
        }

        var vStylesList = (""+ $(viewContainderId).data("styles")).replace(/undefined/, "");
        if (vStylesList && klib.isBlank((vStylesList || "").replace(/[^:'\"]/g,''))){
          vStylesList = "'"+ ((vStylesList).split(",").join("','")) + "'"
        }
        var vStyles = klib.toJSON(vStylesList || "{}");

        /* Check the option to override */
        if (!$.isEmptyObject(kRVOptions.dataStyles)) {
          vStyles = kRVOptions.dataStyles;
        }
        if (_.isArray(vStyles)) {
          _.remove(vStyles,function(item){ return !item; });
        }
        if (vStyles && (!$.isEmptyObject(vStyles))) {
          if (_.isArray(vStyles)) {
            klib.console.info("Convert array of style(s) without styleID to object with styleID(s).");
            var newStylesObj = {};
            var dynStyleIDForContainer = "__styles_"+(viewContainderId.trim("#"))+"_";
            _.each(vStyles, function(styleUrl, sIndex){
              klib.console.log(styleUrl);
              if (styleUrl) {
                newStylesObj[dynStyleIDForContainer + (sIndex)] = (""+styleUrl);
              }
            });
            klib.console.info("Style(s) with styleID(s).");
            klib.console.log(newStylesObj);
            vStyles = (_.isEmpty(newStylesObj))? {} : newStylesObj;
          }

          klib.console.info("External styles to be loaded [cache:" + (kRVOptions.dataStylesCache) + "] along with view container [" + viewContainderId + "] => " + JSON.stringify(vStyles));
          var vStylesNames = _.keys(vStyles);

          klib.console.group("kLoadingStyles");
          _.each(vStylesNames, function (styleId) {
            kAjaxRequestsQue = klib.loadStyle(styleId, vStyles[styleId], kRVOptions.dataStylesCache, kAjaxRequestsQue);
          });
          klib.console.info("External Styles Loading Status: " + JSON.stringify(kAjaxRequestsQue));
          klib.console.groupEnd("kLoadingStyles");
        }
        else {
          klib.console.info("No styles defined [data-styles] in view container [" + viewContainderId + "] to load.");
        }
        klib.console.groupEnd("kLoadingViewStyles");
        /* Load Styles Ends */

        $.when.apply($, kAjaxRequestsQue)
          .then(function () {

            klib.console.group("kRender[" + kRenderEngine + "*" + kTemplateEngine + "] - klib.renderHistory[" + retValue.id + "]");
            klib.console.info("Rendering " + viewContainderId + " using master template: " + vTemplate2RenderID);
            $(viewContainderId).html("");
            try {
              retValue.model = kTemplateModelData[viewDataModelName];
              var kViewModel = kTemplateModelData[viewDataModelName], compiledTemplate;
              switch (kRenderEngine) {
                case "backbone"  :
                  if (!(isLocalDataModel && (!klib.isBlank(kViewDataModelType)))) {
                    retValue.model = new Backbone.Model(retValue.model);
                    kViewModel = retValue.model.toJSON();
                  }
                  break;

                default :
                  if (isLocalDataModel && (!klib.isBlank(kViewDataModelType))) {
                    switch (kViewDataModelType) {
                      case "backbone" :
                        kViewModel = retValue.model.toJSON();
                        break;
                    }
                  }
                  break;
              }
              klib.viewModels[retValue.id] = retValue.model;

              var templateContentToBindAndRender = $(vTemplate2RenderID).html() || "";
              switch (kTemplateEngine) {
                case "handlebar"  :
                case "handlebars" :
                  compiledTemplate = (Handlebars.compile(templateContentToBindAndRender))(kViewModel);
                  break;

                case "underscore":
                  compiledTemplate = (_.template(templateContentToBindAndRender))(kViewModel);
                  break;

                case "underscore-as-mustache" :
                  var tSettings = {
                      interpolate: /\{\{(.+?)\}\}/g  /* {{ title }}    => <strong>pancakes<strong> */
                    , escape: /\{\{\{(.+?)\}\}\}/g   /* {{{ title }}}  => &lt;strong&gt;pancakes&lt;strong&gt; */
                  };
                  compiledTemplate = _.template(templateContentToBindAndRender, kViewModel, tSettings);
                  break;

                case "mustache" :
                  compiledTemplate = (Mustache.compile(templateContentToBindAndRender))(kViewModel);
                  break;

                case "hogan" :
                  compiledTemplate = (Hogan.compile(templateContentToBindAndRender)).render(kViewModel);
                  break;

                default :
                  compiledTemplate = templateContentToBindAndRender;
                  break;
              }
              switch (kRenderEngine) {
                //Tobe removed
                case "backbone":
                { retValue.view = new (Backbone.View.extend({
                    el: viewContainderId
                    , render: function () {
                      this.$el.html(compiledTemplate);
                      return this;
                    }
                  }));
                  (retValue.view).render();
                }
                  break;

                default : /*others*/
                { retValue.view = compiledTemplate;
                  $(viewContainderId).html(retValue.view);
                }
                  break;
              }
              klib.console.info("Render: SUCCESS");
              var rhKeys = _.keys(klib.renderHistory);
              var rhLen = rhKeys.length;
              if (rhLen > klib.renderHistoryMax) {
                $.each(rhKeys.splice(0, rhLen - (klib.renderHistoryMax)), function (index, key) {
                  delete klib.renderHistory[key];
                });
              }
              retValue.cron = "" + klib.now();
              if (klib.renderHistoryMax>0) {
                klib.renderHistory[retValue.id] = retValue;
              };

              /*Reflow Foundation*/
              klib.reflowFoundation(viewContainderId);

              /*init KeyTracking*/
              klib.initKeyTracking();

              /*apply i18n*/
              klib.i18n.apply(viewContainderId);

              /*init kRoute*/
              klib.initRoutes(viewContainderId);

              /*run callback if any*/
              var _fnCallbackAfterRender = ("" + $(viewContainderId).data("renderCallback")).replace(/undefined/, "");
              if (kRVOptions.dataRenderCallback) {
                _fnCallbackAfterRender = kRVOptions.dataRenderCallback;
              }
              klib.console.info("Processing callback: " + _fnCallbackAfterRender);
              if (isKHashRouteOn && klib.routes && klib.routes.hasOwnProperty("_renderCallback") && _.isFunction(klib.routes['_renderCallback'])) {
                klib.routes['_renderCallback'].call(undefined, retValue);
              }

              if (_fnCallbackAfterRender) {
                var fnCallbackAfterRender = _fnCallbackAfterRender;
                if (_.isString(fnCallbackAfterRender)) {
                  fnCallbackAfterRender = klib.findSafe(window, fnCallbackAfterRender);
                }
                if (fnCallbackAfterRender) {
                  if (_.isFunction(fnCallbackAfterRender)) {
                    fnCallbackAfterRender.call(undefined, retValue);
                    //eval("("+fnCallbackAfterRender+"(retValue))");
                  } else {
                    klib.console.error("CallbackFunction <" + _fnCallbackAfterRender + " = " + fnCallbackAfterRender + "> is NOT a valid FUNCTION.");
                  }
                } else {
                  if (("" + _fnCallbackAfterRender).beginsWith("klib") && (("" + _fnCallbackAfterRender).endsWith("_renderCallback"))) {
                    klib.console.warn("Default Route renderCallback function <" + _fnCallbackAfterRender + "> is NOT defined.");
                  } else {
                    klib.console.error("CallbackFunction <" + _fnCallbackAfterRender + "> is NOT defined.");
                  }
                }
              }
              /*Deep/Child Render*/
              $("[rel='kRender'],[data-render],[data-krender]", viewContainderId).kRender();
            }
            catch (e) {
              klib.console.error("Error Rendering: " + e.message);
            }
            klib.console.groupEnd("kRender[" + kRenderEngine + "*" + kTemplateEngine + "] - klib.renderHistory[" + retValue.id + "]");
          })
          .fail(function () {
            klib.console.error("External Data/Templates/Styles/Scripts Loading failed! Unexpected!! Check the template Path / Network. Rendering aborted.");
          }).done(klib.runOnceOnRender);
      }
      else {
        klib.console.error("No templates defined [data-templates] in view container [" + viewContainderId + "] to render. Check HTML markup.");
      }
      klib.console.groupEnd("kView");
    }
    return (retValue);
  };

  klib.hasAutoRoutes = function(routeHash, operator){
    var elSelector = "[data-kroute-default]"+(routeHash? "[href"+(operator?operator:"")+"='"+routeHash+"']" : "");
    return ($(elSelector).length > 0);
  };
  klib.routeCurLocHashAttemptDelaySec = 3;
  klib.routeCurLocHashAttempt=0;
  klib.routeCurLocHash = function(){
    var curLocHash = (klib.getLocHash()||"").ifBlank(klib.routesOptions.defaultPageRoute);
    if (isKHashRouteOn && curLocHash && !klib.hasAutoRoutes(curLocHash)) {
      klib.console.info("Route current url-hash.");
      if (!klib.route(curLocHash)) {
        klib.console.warn("Current url-hash-route <"+curLocHash+"> FAILED and will try after "+klib.routeCurLocHashAttemptDelaySec+"sec.");
        if (klib.routeCurLocHashAttempt < 5) {
          klib.routeCurLocHashAttempt++;
          setTimeout(klib.routeCurLocHash, (klib.routeCurLocHashAttemptDelaySec*1000));
        } else {
          klib.console.error("5 attempts to route current url-hash failed. Aborting further attempts.");
        }
      }
    }
  };

  klib.finallyOnRender = [];
  klib.runOnceOnRenderFunctions = [klib.routeCurLocHash];
  klib.runOnceOnRender = function(){
    klib.console.info("Render Complete.");
    if ((klib.runOnceOnRenderFunctions && !_.isEmpty(klib.runOnceOnRenderFunctions)) || (klib.finallyOnRender && !_.isEmpty(klib.finallyOnRender)) ) {
      if (!klib.runOnceOnRenderFunctions) klib.runOnceOnRenderFunctions = [];
      if (!_.isArray(klib.runOnceOnRenderFunctions)) {
        klib.runOnceOnRenderFunctions = [klib.runOnceOnRenderFunctions];
      }
      if (_.isArray(klib.runOnceOnRenderFunctions)) {
        if (klib.finallyOnRender) {
          if (!_.isArray(klib.finallyOnRender)){ klib.finallyOnRender = [klib.finallyOnRender]; }
          klib.runOnceOnRenderFunctions = klib.runOnceOnRenderFunctions.concat(klib.finallyOnRender);
        }
        _.each(klib.runOnceOnRenderFunctions, function(fn, index){
          if (_.isFunction(fn)) fn();
        });
      }
      klib.finallyOnRender = klib.runOnceOnRenderFunctions = undefined;
    }
  };

  /* Internal wrapper for jQuery.kRender */
  klib.setElIdIfNot = function(el) {
    var $el = $(el);
    if (klib.isBlank($el.attr("id"))) {
      $el.attr("id", ("_el_" + (klib.now()) + "_" + klib.rand(1000, 9999)));
    }
    return ($el.attr("id"));
  }
  function __renderView(obj, opt) {
    var retValue;
    var viewContainderId = klib.setElIdIfNot(obj);
    if ((opt) && (!$.isEmptyObject(opt))) {
      retValue = klib.render("#" + viewContainderId, opt);
    }
    else {
      retValue = klib.render("#" + viewContainderId);
    }
    return retValue;
  }
  klib.reflowFoundation = function(context) {
    if ("Foundation" in window) $(context || document).foundation('reflow');
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
   * $("#viewContainer").kRender({})
   *
   * OR
   *
   * $.kRender("#viewContainer", {})
   *
   * */
  $.fn.extend({
    kRender: function (opt) {
      this.each(function () {
        __renderView(this, opt);
      });
    }
  });
  $.extend({
    kRender: function (obj, opt) {
      $(obj).kRender(opt);
    }
  });

  klib.initDataValidation = function () {
    klib.console.log("include validate framework lib (klib-validate.js) to use this feature!");
  };
  klib.doDataValidation = function () {
    klib.console.log("include validate framework lib (klib-validate.js) to use this feature!");
  };

  klib.properties = {
    version: klib.VERSION
  };

  /* kRoute
   * */
  klib.routes = {};
  klib.routesOptions = {
      useHashRoute: true
    , usePatterns:true
    , defaultPageRoute : ""
    , beforeRoute : ""
    , defaultTemplateExt : ".html"
    , loadDefaultScript:true
    , defaultRouteTargetContainerIdPrefix  : "routeContainer_"
    , defaultRouteTemplateContainerIdPrefix: "template_"
  };

  klib.routePatterns = {
    routes: []
    , register: undefined //Object of pattern and function eg. {name:"memberDetailsView", pattern:"#member/view?:memid", routeoptions:{}}
    , deregister: undefined //input [String | Array] of pattern
  };

  klib.routePatterns.register = function(rPatternOptions, overwrite) {
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
          if (!_.find(klib.routePatterns.routes, {'pattern':rOptions['pattern']})){ //No Duplicate Pattern
            if (_.find(klib.routePatterns.routes, {'name':rOptions['name']})){ //If find duplicate name
              if (_overwrite) {
                klib.routePatterns.routes.push(rOptions);
              }
            } else {
              klib.routePatterns.routes.push(rOptions);
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
        klib.console.error("Invalid RoutePattern Options. Provide Array/Object of RouteOptions");
      }
    } else {
      klib.console.error("Empty RoutePattern Options.");
    }
  };

  klib.routePatterns.deregister = function(rNamesOrPatterns){
    if (rNamesOrPatterns && !_.isEmpty(rNamesOrPatterns)) {
      var removeRoutePattern = function(rNameOrPattern){
        if (rNameOrPattern) {
          var indexOfNameOrPattern = _.findIndex(klib.routePatterns.routes, function(opt){
            return (opt.name == rNameOrPattern || opt.pattern == rNameOrPattern);
          });
          if (indexOfNameOrPattern>=0) {
            _.pullAt(klib.routePatterns.routes, indexOfNameOrPattern);
          } else {
            klib.console.error("Route Pattern Not Found for <"+rNameOrPattern+">");
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
        klib.console.error("Invalid RoutePattern Name/Pattern. Provide Array/Name of RouteNames/Patterns");
      }
    }
  };

  klib.routeName = function(hashRoute){
    var _hashRoute = (hashRoute || klib.urlHash());
    if (_hashRoute.contains("\\?")) {
      _hashRoute = _hashRoute.split("?")[0];
    }
    return (_hashRoute.trimLeft("#")).replace(/[^a-z0-9]/gi,'_');
  };

  klib.routeContainerId = function(hashRoute){
    var routeTargetContainerPrefix = ((klib.routesOptions.defaultRouteTargetContainerIdPrefix).trimLeft("#"));
    return (routeTargetContainerPrefix+klib.routeName(hashRoute));
  };

  klib.routeTemplateId = function(hashRoute){
    var routeTargetContainerPrefix = ((klib.routesOptions.defaultRouteTemplateContainerIdPrefix).trimLeft("#"));
    return (routeTargetContainerPrefix+klib.routeName(hashRoute));
  };

  /*
    klib.routeRender = function(elRouteBase, routeOptions)
    elRouteBase  ==> valid jQuery element identifier
    routeOptions ==>
    { render                                    : false             //Optional; default: true; mention only to stop route
      target                                    : '#targetRenderID' //Optional; default: autoGeneratedHiddenContainer based on routePath
      templates                                 : '' or []          //Optional; default: pathFrom Route with extension; use '.' to load default template
      [ext | tmplext | tmplExt]                 : '.jsp'            //Optional; default: '.html'; html template extension with dot(.)
      [tmplengine | tmplEngine]                 : 'handlebars'      //Optional; default: 'handlebars'
      scripts                                   : '' or [] or false //Optional; default: same as templatePath with extension .js; use '.' to load default script
      [dataurl | dataUrl]                       : ''                //Optional; default: NO-DATA
      [after | callback | callBack]             : '' or function(){} or functionName //Optional: default: klib.routes.<ROUTE-PATH>_renderCallback
      [before | beforeroute | beforeRoute]      : '' or function(){} or functionName //Optional: default: klib.routesOptions.beforeRoute
    }
  */
  klib.routeRender = function(elRouteBase, routeOptions){
    var $elRouteBase = (elRouteBase)? $(elRouteBase) : undefined;

    var tagRouteOptions = ($elRouteBase)? ( (""+$elRouteBase.data("kroute")) || "") : ("");
    if (   (tagRouteOptions.trim()).equalsIgnoreCase("false")
        || (tagRouteOptions.trim()).equalsIgnoreCase("no")
        || (tagRouteOptions.trim()).equalsIgnoreCase("off")
       ) tagRouteOptions = "quit:true";
    var oTagRouteOptions = (tagRouteOptions)? klib.toJSON(tagRouteOptions) : {};

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
    routeNameWithPath = (routeNameWithPath).trimLeft("#");

    var routeParams = "";
    if (routeNameWithPath.contains("\\?")) {
      var _routeParts = routeNameWithPath.split("?");
      routeNameWithPath = _routeParts[0];
      routeParams = _routeParts[1];
    }
    var routeName = oTagRouteOptions['name'] || (klib.routeName(routeNameWithPath));
    if (klib.routes[routeName]) {
      klib.routes[routeName]($elRouteBase, routeParams, oTagRouteOptions);
    } else {
      klib.console.info("Route method <klib.routes."+routeName+"> NOT FOUND. Attempting to route using [data-kroute] options.");

      var foundRouteTmplExt = (oTagRouteOptions.hasOwnProperty('ext')
      || oTagRouteOptions.hasOwnProperty('tmplext')
      || oTagRouteOptions.hasOwnProperty('tmplExt'));

      //foundRenderTarget = oTagRouteOptions['target'] && klib.isElementExist(oTagRouteOptions['target'])
      var renderTarget      = ""+((oTagRouteOptions['target']||"").trim())
        , tmplExt           = (foundRouteTmplExt)? (oTagRouteOptions['ext'] || oTagRouteOptions['tmplext'] || oTagRouteOptions['tmplExt']) : (klib.routesOptions["defaultTemplateExt"]||"")
        , tmplEngine        = oTagRouteOptions['tmplengine'] || oTagRouteOptions['tmplEngine'] || ""
        , defaultTmplPath   = (routeNameWithPath+tmplExt+"?"+routeParams).trimRight("\\?")
        , defaultScriptPath = routeNameWithPath+".js"
        , defaultCallBeforeRoute = "klib.routes."+routeName+"_before"
        , defaultRenderCallback  = "klib.routes."+routeName+"_renderCallback"
        , useTargetOptions = klib.findIgnoreCase(oTagRouteOptions, "usetargetoptions")
        , kRenderOptions = {
            dataRenderCallback : defaultRenderCallback
          , rElRouteOptions : oTagRouteOptions
          , rElDataAttr: ($elRouteBase)? $elRouteBase.data() : {}
        };

      if (oTagRouteOptions.hasOwnProperty('template') && !oTagRouteOptions.hasOwnProperty('templates')) {
        oTagRouteOptions['templates'] = oTagRouteOptions['template'];
        delete oTagRouteOptions['template'];
      }

      if (renderTarget.equalsIgnoreCase(".")) {
        renderTarget = "#"+klib.setElIdIfNot($elRouteBase);
      } else if (klib.isBlank(renderTarget)) {
        renderTarget = ("#"+klib.routeContainerId(routeName));
      }
      var foundRenderTarget = klib.isElementExist(renderTarget);

      klib.console.info("Render Target <"+renderTarget+">");
      /*Cache Settings*/
      if (oTagRouteOptions.hasOwnProperty("dataCache")) {
        kRenderOptions['dataCache'] = oTagRouteOptions['dataCache'];
      }
      if (oTagRouteOptions.hasOwnProperty("templatesCache")) {
        kRenderOptions['dataTemplatesCache'] = oTagRouteOptions['templatesCache'];
      }
      if (oTagRouteOptions.hasOwnProperty("scriptsCache")) {
        kRenderOptions['dataScriptsCache'] = oTagRouteOptions['scriptsCache'];
      }

      /*Templates*/
      kRenderOptions['dataTemplates'] = {};
      var tmplID= "__kRouteTemplate_" + routeName;
      if (!oTagRouteOptions.hasOwnProperty("templates") || (oTagRouteOptions['templates'])) {
        var oTagRouteOptionsTemplates = oTagRouteOptions['templates'];
        var rTemplateId = klib.routeTemplateId(routeName);
        var routeTemplateContainerID = "#"+rTemplateId;
        var hashTmplID = "__tmpl_"+rTemplateId;
        switch(true) {
          case (_.isString(oTagRouteOptionsTemplates)) :
            var targetTmplId = tmplID;
            var tmplPath = oTagRouteOptionsTemplates.trim();
            if ((tmplPath).equalsIgnoreCase('.')) {
              tmplPath = defaultTmplPath;
            } else if ((tmplPath).equalsIgnoreCase('#')) {
              targetTmplId = hashTmplID;
              tmplPath = routeTemplateContainerID;
            }
            kRenderOptions.dataTemplates[targetTmplId] = tmplPath.ifBlank("none");
            break;
          case (_.isArray(oTagRouteOptionsTemplates)) :
            if (_.indexOf(oTagRouteOptionsTemplates, '.')>=0) { //Include default path-template (external)
              kRenderOptions.dataTemplates[tmplID+"_dot"] = defaultTmplPath;
              _.pull(oTagRouteOptionsTemplates, '.');
            }
            if (_.indexOf(oTagRouteOptionsTemplates, '#')>=0) { //Include route hash-template (internal)
              kRenderOptions.dataTemplates[hashTmplID] = routeTemplateContainerID;
              _.pull(oTagRouteOptionsTemplates, '#');
            }
            _.each(oTagRouteOptionsTemplates, function(templateUrl, sIndex){
              kRenderOptions.dataTemplates[tmplID + '_'+(sIndex+1)] = templateUrl.ifBlank("none");
            });
            break;
          default:
            kRenderOptions.dataTemplates[tmplID] = defaultTmplPath;
            break;
        }
      } else {
        klib.console.warn("Route without template");
        kRenderOptions.dataTemplates[tmplID] = "none";
      }

      if (tmplEngine) {
        kRenderOptions['dataTemplateEngine'] = tmplEngine;
      }

      /*Scripts*/
      var useScripts = (!oTagRouteOptions.hasOwnProperty("scripts") || (oTagRouteOptions['scripts']));
      if (useScripts) {
        kRenderOptions['dataScripts'] = {};
        var scriptID = "__kRouteScript_" + routeName;
        switch(true) {
          case (_.isString(oTagRouteOptions['scripts'])) :
            kRenderOptions.dataScripts[scriptID] = (_.indexOf(oTagRouteOptions['scripts'], '.')>=0)? defaultScriptPath : oTagRouteOptions['scripts'];
            break;
          case (_.isArray(oTagRouteOptions['scripts'])) :
            if (_.indexOf(oTagRouteOptions['scripts'], '.')>=0) { //Include default script
              kRenderOptions.dataScripts[scriptID] = defaultScriptPath;
              _.pull(oTagRouteOptions['scripts'], '.');
            }
            _.each(oTagRouteOptions['scripts'], function(scriptUrl, sIndex){
              kRenderOptions.dataScripts[scriptID + '_'+(sIndex+1)] = scriptUrl;
            });
            break;
          default:
            if (klib.routesOptions.loadDefaultScript) {
              kRenderOptions.dataScripts[scriptID] = defaultScriptPath;
            } else {
              klib.console.warn("Script(s) not included. Use <klib.routesOptions.loadDefaultScript = true> to load default script <"+defaultScriptPath+">.");
            }
            break;
        }
        klib.console.log(kRenderOptions['dataScripts']);
      }

      /*Data and Params*/
      if (oTagRouteOptions['dataUrl'] || oTagRouteOptions['dataurl']) {
        var tagDataUrl = oTagRouteOptions['dataurl'] || oTagRouteOptions['dataUrl'];
        var kRenderDataUrls = klib.toRenderDataStructure(tagDataUrl, routeParams);
        if (!_.isEmpty(kRenderDataUrls)) {
          _.merge(kRenderOptions, kRenderDataUrls);
        }
      }

      /*Callback*/
      var overrideDefaultCallback = (
      oTagRouteOptions.hasOwnProperty('after')
      || oTagRouteOptions.hasOwnProperty('callback')
      || oTagRouteOptions.hasOwnProperty('callBack'));
      if (overrideDefaultCallback || oTagRouteOptions['after'] || oTagRouteOptions['callback'] || oTagRouteOptions['callBack']) {
        kRenderOptions['dataRenderCallback'] = oTagRouteOptions['after'] || oTagRouteOptions['callback'] || oTagRouteOptions['callBack'] || "";
      }

      //NO SCRIPTS
      if ( oTagRouteOptions.hasOwnProperty("scripts")
        && klib.isBlank(oTagRouteOptions.hasOwnProperty("scripts"))
      ) {
        //NO CALLBACK or CALLBACK="."
        if (!overrideDefaultCallback) {
          kRenderOptions['dataRenderCallback'] = "";
        } else if ( _.isString((kRenderOptions['dataRenderCallback']))
                && (kRenderOptions['dataRenderCallback']).equalsIgnoreCase(".")) {
          kRenderOptions['dataRenderCallback'] = defaultRenderCallback;
        }
      }

      /*owerride Options with Target elements property if any*/
      if (useTargetOptions && foundRenderTarget){
        //Read kRender options from target element and override(ie. delete) above options
        var $elTarget = $(renderTarget);
        if ($elTarget.data('url')) {
          delete kRenderOptions['dataUrl'];
        }
        if ($elTarget.data('template') || $elTarget.data('templates')) {
          delete kRenderOptions['dataTemplates'];
        }
        if ($elTarget.data('scripts')) {
          delete kRenderOptions['dataScripts'];
        }
        if ($elTarget.data('templateEngine')) {
          delete kRenderOptions['dataTemplateEngine'];
        }
        if ($elTarget.data('renderCallback')) {
          delete kRenderOptions['dataRenderCallback'];
        }
      }
      /*before Render function to modify options*/

      klib.console.info("Route Render Options Before preRenderProcess:");
      klib.console.info(kRenderOptions);
      var beforeRenderOptions = {};
      var fnToRunBefore = oTagRouteOptions['before'] || oTagRouteOptions['beforeroute'] || oTagRouteOptions['beforeRoute'] || klib.routesOptions["beforeRoute"];
      klib.console.info("callBeforeRoute: "+fnToRunBefore);
      if (fnToRunBefore) {
        if (!_.isFunction(fnToRunBefore) && _.isString(fnToRunBefore)) {
          if (fnToRunBefore.equals(defaultCallBeforeRoute)) { //TODO: why?
            //cancel default route-before-function
            defaultCallBeforeRoute = undefined; //TODO: why?
          }
          fnToRunBefore = klib.findSafe(window, fnToRunBefore);
        }
        if (_.isFunction(fnToRunBefore)){
          beforeRenderOptions = fnToRunBefore.call(undefined, {el:$elRouteBase, target:renderTarget, renderOptions:kRenderOptions, routeOptions:oTagRouteOptions});
          if (_.isObject(beforeRenderOptions)) _.merge(kRenderOptions, beforeRenderOptions);
        } else {
          klib.console.error("CallBeforeRouteFunction <"+oTagRouteOptions['before']+"> NOT FOUND.");
        }
      }
      if (defaultCallBeforeRoute) {
        fnToRunBefore = klib.findSafe(window, defaultCallBeforeRoute);
        if (fnToRunBefore && _.isFunction(fnToRunBefore)) {
          beforeRenderOptions = fnToRunBefore.call(undefined, {el:$elRouteBase, target:renderTarget, renderOptions:kRenderOptions, routeOptions:oTagRouteOptions});
          if (_.isObject(beforeRenderOptions)) _.merge(kRenderOptions, beforeRenderOptions);
        }
      }

      klib.console.info("Route Render Options After preRenderProcess:");
      klib.console.info(kRenderOptions);
      /*Ready to kRender*/
      if ((!kRenderOptions.hasOwnProperty("render") || (kRenderOptions['render'])) &&
        (!oTagRouteOptions.hasOwnProperty("render") || (oTagRouteOptions['render']))) {
        klib.render(renderTarget, kRenderOptions);
      }
    }//End of Route

    return true;
  };

  /*
    klib.route(el); //el = HTML element with href=#RoutePath?key=value&key=value
    klib.route(el, routeOptions); //el with Options
    klib.route("#RoutePath?key=value&key=value");
    klib.route("#RoutePath?key=value&key=value", routeOptions); //routePath with Options

    //routeOptions
    { render                                    : false             //Optional; default: true; mention only to stop route
      target                                    : '#targetRenderID' //Optional; default: autoGeneratedHiddenContainer based on routePath
      templates                                 : '' or []          //Optional; default: pathFrom Route with extension; use '.' to load default template
      [ext | tmplext | tmplExt]                 : '.jsp'            //Optional; default: '.html'; html template extension with dot(.)
      [tmplengine | tmplEngine]                 : 'handlebars'      //Optional; default: 'handlebars'
      scripts                                   : '' or [] or false //Optional; default: same as templatePath with extension .js; use '.' to load default script
      [dataurl | dataUrl]                       : ''                //Optional; default: NO-DATA
      [after | callback | callBack]             : '' or function(){} or functionName //Optional: default: klib.routes.<ROUTE-PATH>_renderCallback
      [before | beforeroute | beforeRoute]      : '' or function(){} or functionName //Optional: default: klib.routesOptions.beforeRoute
    }
  */
  klib.route = function(elRouteBase, routeOptions){

    if (_.isString(elRouteBase) && klib.isBlank((""+elRouteBase).trim("#")) ) {
      return false; //BlankHash
    }

    var foundRouteElBase = !_.isString(elRouteBase);
    routeOptions = routeOptions || {};

    if (!foundRouteElBase) { //Find element with given route or create one with same route
      var elWithRoute = $("[data-kroute][href='"+elRouteBase+"']");
      foundRouteElBase = !_.isEmpty(elWithRoute);
      if (!foundRouteElBase) {
        klib.console.warn("Route source element NOT FOUND for route <"+elRouteBase+">");
        if (klib.routesOptions.usePatterns) {
          klib.console.info("Searching RoutePattern.");
          var rPatternRouteOptions;
          var indexOfNameOrPattern = _.findIndex(klib.routePatterns.routes, function(opt){
            var matchFound=false;
            var _routeMatch = klib.routeMatch(opt.pattern, elRouteBase);
            if (_routeMatch) {
              matchFound = true;
              rPatternRouteOptions = _.merge({}, opt['routeoptions'] || {});
              rPatternRouteOptions['urlhash'] = {pattern:(opt.pattern).replace(/\\\?/g, '?') , url:elRouteBase, urlParams:_routeMatch};
            }
            return matchFound;
          });

          if (indexOfNameOrPattern<0) {
            klib.console.warn("Pattern not found.");
            klib.console.info(klib.routePatterns.routes);
          } else {
            klib.console.info(rPatternRouteOptions);
            klib.routeRender(undefined, rPatternRouteOptions);
          }
        } else {
          klib.console.warn("Pattern match Disabled.");
        }
      } else {
        elRouteBase = elWithRoute.get(0);
      }
    }

    if (!foundRouteElBase) {
      if (routeOptions['forceroute'] || routeOptions['forceRoute']) {
        klib.console.warn("Attempt dynamic route.");
        foundRouteElBase = true;
        elRouteBase = $("<a href='"+elRouteBase+"'></a>").get(0);
      } else {
        klib.console.warn("Exit Route.");
        return false; //exit;
      }
    }

    if (foundRouteElBase){
      return klib.routeRender(elRouteBase, routeOptions);
    }// if foundRouteElBase
  };

  klib.initRoutes = function(routeInitScope, routeInitOptions) {
    if (typeof routeInitScope == "object") {
      routeInitOptions = routeInitScope;
      routeInitScope = routeInitOptions["context"] || routeInitOptions["scope"] || "";
    }
    if (routeInitOptions) {
      klib.console.info("Init routesOptions");
      _.merge(klib.routesOptions, routeInitOptions);

      if (!isKHashRouteOn && klib.routesOptions.useHashRoute) klib._initWindowOnHashChange();
      if (isKHashRouteOn && !klib.routesOptions.useHashRoute) klib._stopWindowOnHashChange();

      //options without (context or scope)
      if (!(routeInitOptions.hasOwnProperty('context') || routeInitOptions.hasOwnProperty('scope'))) {
        return;
      }
    }

    klib.console.info("Init kRoutes. Scan for [data-kroute] in context: <"+(routeInitScope||"body")+">");
    $(routeInitScope||"body").find("[data-kroute]").each(function(index, el){

      if (!klib.isBlank((($(el).attr("href") || "")+"#").split("#")[1])) {
        $(el).off("click");
        $(el).on("click", function() {
          if (isKHashRouteOn) {
            var elHash  = "#"+(((($(el).attr("href") || "")+"#").split("#")[1]).trim("#"));
            var winHash = klib.getLocHash();
            if (elHash.equals(winHash)){
              klib.route(this);
            }
          } else {
            klib.route(this);
          }
        });

        if (el.hasAttribute("data-kroute-default")) {
          klib.route(el);
        }
      }
    });
  };

  $(document).ready(function(){
    /*onLoad Set klib.debugger on|off using URL param*/
    klib.debug = klib.urlParam('klib.debug') || klib.hashParam('klib.debug') || klib.debug;

    /*Reflow Foundation*/
    klib.reflowFoundation();

    /*Init kRoutes*/
    klib.initRoutes();

    /*Extending Backbone*/
    klib.extendBackbone();

    /*Key Tracking*/
    klib.initKeyTracking();

    /*Auto Render*/
    klib.console.info("Find and Render [rel='kRender'] or [data-render] or ,[data-krender]");
    $("[rel='kRender'],[data-render],[data-krender]").kRender();
  });

})(this);

klib.console.info("klib loaded.");
