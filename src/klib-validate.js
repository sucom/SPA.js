/** @license K-Lib Validation Extension | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/*
* KLib Validation Extension
* version: 2.0.0
* Author: Kumar
* */

var _isOnOfflineValidation;
var _validateAlertTemplate = '<div class="errortxt break-txt" data-i18n=""></div>';
var _check = {
    required    : _fnRequired
  , digits      : _fnValidDigits
  , numbers     : _fnValidNumbers
  , integer     : _fnValidInteger
  , alphabet    : _fnValidAlpha
  , alphanumeric: _fnValidAlphaNumeric
  , pattern     : _fnValidPatternMatch
  , range       : _fnValidValueRange
  , fixedlength : _fnValidLengths
  , minlength   : _fnValidLengthMin
  , maxlength   : _fnValidLengthMax
  , email       : _fnValidEmail
  , url         : _fnValidUrl
  , date        : _isValidDate
  , cardno      : _fnValidCardNo
  , ipv4        : _fnValidIpv4
  , ipv6        : _fnValidIpv6
  , ipaddress   : _fnValidIpAddress
  , subnetmask  : _fnValidSubnet
  , phoneUS     : _fnValidPhoneUS
  , wordsize    : _fnValidWordSize
};

var _offlineValidationRules = {};
/*
{   "editSystem"   : { rules: { "element1":[mandate, numberOnly], "element2":[mandate, numberOnly] }  }
  , "editPartition": { rules: { "element1":[mandate, numberOnly], "element2":[mandate, numberOnly] }  }
};
*/

/* ************************************************************** */
function _fnRequired(obj, msg) {
  var elValue = klib.getElValue(obj);
  return _showValidateMsg(obj, msg, !(klib.isBlank(elValue)));
}
function _fnValidDigits(obj, msg) {
  var elValue = $(obj).val();
  var isValid = ( (elValue.length===0) || (/^\d+$/.test(elValue)) );
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidNumbers(obj, msg) {
  var elValue = $(obj).val();
  var isValid = ( (elValue.length===0) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) );
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidInteger(obj, msg) {
  var elValue = $(obj).val();
  var isValid = ( (elValue.length===0) || (/^-?\d+$/.test(elValue)) );
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidAlpha(obj, msg) {
  var elValue = $(obj).val();
  var isValid = ( (elValue.length===0) || !(/[^a-z]/gi.test(elValue)) );
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidAlphaNumeric(obj, msg) {
  var elValue = $(obj).val();
  var isValid = ( (elValue.length===0) || !(/[^a-z0-9]/gi.test(elValue)) );
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidPatternMatch(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid)
  { var rx = new RegExp($(obj).data("validatePattern"), $(obj).data("validatePatternOptions").replace(/!/g,""));
    isValid = rx.test(elValue);
    if ($(obj).data("validatePatternOptions").indexOf("!")>=0) isValid = !isValid;
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidValueRange(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid)
  { isValid = false;
    if (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) {
      var uValue  = klib.toFloat(elValue);
      var rLimits = (" "+($(obj).data("validateRange") || "")+": ").split(":");
      var checkMin = !klib.isBlank(rLimits[0]);
      var checkMax = !klib.isBlank(rLimits[1]);
      var rMin = klib.toFloat(rLimits[0]);
      var rMax = klib.toFloat(rLimits[1]);
      if (checkMin && checkMax)
      { isValid = ((uValue >= rMin) && (uValue <= rMax));
      }
      else if (checkMin)
      { isValid = (uValue >= rMin);
      }
      else if (checkMax)
      { isValid = (uValue <= rMax);
      }
    }
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidLengthMin(obj, msg) {
  var elValue = $(obj).val();
  var minLen  = klib.toInt($(obj).attr("minlength"));
  var isValid = (elValue.length >= minLen);
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidLengthMax(obj, msg) {
  var elValue = $(obj).val();
  var maxLen  = klib.toInt($(obj).attr("maxlength"));
  var isValid = (elValue.length <= maxLen);
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidLengths(obj, msg){
  var elValue = $(obj).val();
  var eLength = elValue.length;
  var minLen  = klib.toInt($(obj).attr("minlength"));
  var maxLen  = klib.toInt($(obj).attr("maxlength"));
  var isValid = ((eLength >= minLen) && (eLength <= maxLen));
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidWordSize(obj, msg) {
  var elValue = $(obj).val();
  var maxWordSize = _.max(_.map((''+elValue).replace(/[-\n]/g,' ').split(' '), function(w) { return w.length; }));
  var validWordSize = klib.toInt($(obj).data("validWordSize")) || 20;
  var isValid = (maxWordSize <= validWordSize);
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidEmail(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid) {
    isValid = ( (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(elValue)
             || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(elValue))
             && /[a-z0-9]/i.test((elValue[elValue.length-1]))
              );
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidUrl(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid) {
    isValid = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(elValue);
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _isValidDate(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid)
  { isValid = false;
    var monthsS = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var monthsL = ["", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    var _dateFormat = $(obj).data("validateFormat") || "YMD";
    var dPattern = "^\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{4}$";
    var yyyy, mm, dd, mIndex;
    var mName = elValue.replace(/[^a-z]/gi, "");
    if (mName) {
      mIndex = _.indexOf(monthsS, mName.toUpperCase());
      if (mIndex<=0) mIndex = _.indexOf(monthsL, mName.toUpperCase());
      if (mIndex>0) {
        elValue = elValue.replace(new RegExp(mName,"gi"), mIndex);
      }
    }
    elValue = elValue.replace(/[^0-9]/g," ").normalizeStr().replace(/ /g, "/");
    var dArr = elValue.split('/');
    switch(_dateFormat.toUpperCase()){
      case "YMD":
        dPattern = "^\\d{4}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{1,2}$";
        yyyy = dArr[0];
        mm   = dArr[1];
        dd   = dArr[2];
        break;
      case "MDY":
        mm   = dArr[0];
        dd   = dArr[1];
        yyyy = dArr[2];
        break;
      case "DMY":
        dd   = dArr[0];
        mm   = dArr[1];
        yyyy = dArr[2];
        break;
    }
    if ((new RegExp(dPattern,"")).test(elValue))
    { dd   = parseInt(dd,10);
      mm   = parseInt(mm,10);
      yyyy = parseInt(yyyy,10);
      var xDate = new Date(yyyy,mm-1,dd);
      isValid = ( ( xDate.getFullYear() === yyyy ) && ( xDate.getMonth() === mm - 1 ) && ( xDate.getDate() === dd ) );
    }
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidCardNo(obj, msg){
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid)
  { // accept only spaces, digits and dashes
    if ( /[^0-9 \-]+/.test(elValue) )
    { isValid = false;
    }
    else
    { var nCheck = 0, nDigit = 0, bEven = false;
      var cValue = elValue.replace(/\D/g, "");
      for (var n = cValue.length - 1; n >= 0; n--)
      { var cDigit = cValue.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if (bEven)
        { if ((nDigit *= 2) > 9)
          { nDigit -= 9;
          }
        }
        nCheck += nDigit;
        bEven = !bEven;
      }
      isValid = ((nCheck % 10) === 0);
    }
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidIpv4(obj, msg){
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid){
    isValid = ((/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(elValue))
                && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
  }
  _showValidateMsg(obj, msg, isValid);
}
function _fnValidIpv6(obj, msg){
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid){
    isValid = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(elValue);
  }
  _showValidateMsg(obj, msg, isValid);
}
function _fnValidIpAddress(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid)
  { var strIpAddr = elValue;
    var noOfOctates = (klib.toInt($(obj).data("validateIpaddressOctates") || 4)) - 1;
    var rxValidIp = new RegExp("^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\\.){"+noOfOctates+"}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$", "g");
    isValid = ((rxValidIp.test(strIpAddr)) && ( _.every(strIpAddr.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
    _showValidateMsg(obj, msg, isValid);
    var ipClass = $(obj).data("validateIpaddressClass");
    if ((isValid) && (ipClass))
    { var octates = strIpAddr.split('.');
      var octRange = {
        A:{ oct1:{B:0  , E:127}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:1, E:255} },
        B:{ oct1:{B:127, E:192}, oct2:{B:1, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:255} },
        C:{ oct1:{B:191, E:224}, oct2:{B:0, E:256}, oct3:{B:1, E:256}, oct4:{B:1, E:255} },
        D:{ oct1:{B:223, E:240}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:256} },
        E:{ oct1:{B:239, E:255}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:255} }
      };
      //                       1                                              2                                             3                                             4                                             5                                             6                                             7                                            8
      isValid = ((octates[0]*1 > octRange[ipClass].oct1.B)   && (octates[0]*1 < octRange[ipClass].oct1.E))? (((octates[1]*1 >= octRange[ipClass].oct2.B) && (octates[1]*1 < octRange[ipClass].oct2.E))? (((octates[2]*1 >= octRange[ipClass].oct3.B) && (octates[2]*1 < octRange[ipClass].oct3.E))? (((octates[3]*1 > octRange[ipClass].oct4.B) && (octates[3]*1 < octRange[ipClass].oct4.E))? true : false) : false) : false) : false;
      _showValidateMsg(obj, msg, isValid);
    }
  }

  return isValid;
}
function _fnValidSubnet(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid) {
    var rxSubnet = new RegExp("^((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0)|255\\.(0|128|192|224|240|248|252|254)))))$");
    isValid = ((rxSubnet.test(elValue)) && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
  }
  return _showValidateMsg(obj, msg, isValid);
}
function _fnValidPhoneUS(obj, msg) {
  var elValue = $(obj).val();
  var isValid = (elValue.length===0);
  if (!isValid) {
    isValid= (elValue.length > 9 && elValue.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/));
  }
  return _showValidateMsg(obj, msg, isValid);
}
/* ************************************************************** */
function _showValidateMsg(forObj, msg, isValid, errMsgTemplate)
{ msg = msg || "";
  if ((arguments.length>2) && _.isString(isValid)) { errMsgTemplate = isValid; }
  if ((arguments.length>2) && _.isBoolean(isValid) && (isValid)) { msg = ""; }
  errMsgTemplate = errMsgTemplate || _validateAlertTemplate;

  forObj = $($(forObj).data("validateMsgEl")||forObj).get(0);
  var alertObj = $(forObj).next();
  var i18nSpec = "";
  if (($(alertObj).attr("class")) === ($(errMsgTemplate).attr("class")))
  { if (msg.beginsWithStrIgnoreCase("i18n:"))
    { var i18nKey = msg.replace(/i18n:/gi,"");
      i18nSpec = "{html:'"+i18nKey+"'}";
      msg = $.i18n.prop(i18nKey);
    }
    if (!_isOnOfflineValidation)
    { $(alertObj).data("i18n",i18nSpec);
      $(alertObj).html(msg);
    }
  }
  else
  { if (!klib.isBlank(msg))
    { $(errMsgTemplate).insertAfter($(forObj));
      _showValidateMsg(forObj, msg, isValid, errMsgTemplate);
    }
  }
  return isValid;
}
function _clearValidateMsg(forObj)
{ _showValidateMsg(forObj);
  return true;
}

klib.initDataValidation = function(context){
  /* apply same rules if mult-events specified with underscore eg: onFocus_onBlur_onKeyup */
  var splitValidateEvents = function(eObj) {
    eObj = eObj || {};
    _.each(_.keys(eObj), function(eNames){
      if (eNames.indexOf("_")>0){
        _.each(eNames.split("_"), function(eName){
          if (eObj[eName])
          { if (_.isArray(eObj[eName]))
            { eObj[eName].push(eObj[eNames]);
            } else
            { eObj[eName] = [eObj[eName], eObj[eNames]];
            }
          }
          else
          { eObj[eName] = [eObj[eNames]];
          }
        });
        delete eObj[eNames];
      }
    });
    return eObj;
  };

  context = context || "body";
  var $context = $(context);
  var elSelector = $context.data("validateElFilter") || "";
  var commonValidateRules = splitValidateEvents(klib.toJSON($context.data("validateCommon")||"{}"));
  klib.console.log(_.keys(commonValidateRules));

  var addRule2El, addRule2ElDir, overrideOfflineRule2El, elOfflineRule, commonRule2El;
  var offlineValidationKey = $context.data("offlineValidationStoreKey")||"";
  var prepareOfflineValidationRules = (!klib.isBlank(offlineValidationKey));
  if (prepareOfflineValidationRules)
  { _offlineValidationRules[offlineValidationKey] = {rules:{}};
  }

  $context.find(elSelector+"[data-validate]").each(function(index, el){
    var elID = $(el).prop("id");
    var elValidateRules={};
    var elValidateRuleSpec = $(el).data("validate");
    if (elValidateRuleSpec && elValidateRuleSpec.indexOf("{")<0)
    { var elValidateEvents     = ($(el).data("validateEvents")||"onBlur").replace(/[^a-z]/gi," ").normalizeStr().replace(/ /g,"_");
      var elValidateOffline    = ",offline:"+($(el).data("validateOffline")||"false");
      var elValidateFunctions  = "{fn:"+(elValidateRuleSpec.replace(/[,;]/," ").normalizeStr().replace(/ /g, elValidateOffline+"},{fn:"))+elValidateOffline+"}";
      elValidateRuleSpec = "{"+elValidateEvents+":["+elValidateFunctions+"]}";
      //$(el).data("validate", elValidateRuleSpec);
    }
    elValidateRules = splitValidateEvents(klib.toJSON(elValidateRuleSpec));
    klib.console.log(elValidateRuleSpec);

    /* Apply common events' rule to each element */
    _.each( _.keys(commonValidateRules), function(commonValidateOnEvent){
      var oCommonValidateRules = commonValidateRules[commonValidateOnEvent];
      if (!_.isArray(oCommonValidateRules))
      { oCommonValidateRules = [oCommonValidateRules];
      }

      _.each(oCommonValidateRules, function(oCommonValidateRule){
        addRule2El=true; addRule2ElDir="<"; elOfflineRule=oCommonValidateRule["offline"]||false; overrideOfflineRule2El=false;
        if (oCommonValidateRule["el"]) {
          var elArrayWithDir    = oCommonValidateRule["el"].replace(/ /g, '').split(",");
          var elArrayWithOutDir = oCommonValidateRule["el"].replace(/[< >!]/g,"").split(",");
          var elIndexInList = _.indexOf(elArrayWithOutDir, elID);
          addRule2El = (elIndexInList>=0);
          if (addRule2El)
          { addRule2ElDir = (elArrayWithDir[elIndexInList].indexOf(">")>=0)? ">" : "<";
            overrideOfflineRule2El = (elArrayWithDir[elIndexInList].indexOf("!")>=0);
          }
        }
        else if (oCommonValidateRule["ex"]) {
          addRule2El = (_.indexOf(oCommonValidateRule["ex"].replace(/[< >!]/g, '').split(","), elID)<0);
        }

        if (addRule2El)
        { commonRule2El = _.omit(oCommonValidateRule, ["el","ex"]);
          if (overrideOfflineRule2El) commonRule2El =  _.extend(commonRule2El, {offline:(!elOfflineRule)});
          if (!elValidateRules[commonValidateOnEvent]) elValidateRules[commonValidateOnEvent] = [];
          elValidateRules[commonValidateOnEvent] = (addRule2ElDir==="<")? _.union([commonRule2El], elValidateRules[commonValidateOnEvent]) : _.union(elValidateRules[commonValidateOnEvent], [commonRule2El]);
        }
      });
    });

    _.each(_.keys(elValidateRules), function(validateOnEvent){
      var jqEventName = ((validateOnEvent.substring(2,3)).toLowerCase())+(validateOnEvent.substring(3));
      klib.console.log("settingup event on["+jqEventName+"]...");

      //Convert element rules to array
      if (!_.isArray(elValidateRules[validateOnEvent])){
        elValidateRules[validateOnEvent] = [elValidateRules[validateOnEvent]];
      }

      if (prepareOfflineValidationRules)
      { _.each(elValidateRules[validateOnEvent], function(elValidateRule4Event){
          if (elValidateRule4Event.offline) {
            if (!_offlineValidationRules[offlineValidationKey].rules[elID]) _offlineValidationRules[offlineValidationKey].rules[elID] = [];
            if (_.indexOf(_offlineValidationRules[offlineValidationKey].rules[elID], elValidateRule4Event.fn)<0)
              _offlineValidationRules[offlineValidationKey].rules[elID].push(elValidateRule4Event.fn);
          }
        });
      }

      $(el).on(jqEventName, function(){
        _.every(elValidateRules[validateOnEvent], function(validateRule){
          if (_.isArray(validateRule))
          { return _.every(validateRule, function(validateRuleInArray){
              return (validateRuleInArray.fn(el, (validateRuleInArray.msg || $(el).data("validateMsg") || "")));
            });
          }
          else
          { return (validateRule.fn(el, (validateRule.msg || $(el).data("validateMsg") || "")));
          }
        });
      });
    });
  });
};

klib.doDataValidation = function(context){
  var rulesScopeID    = (context.replace(/#/g, ""));
  var validationScope = "#"+rulesScopeID;
  var $validationScope = $(validationScope);
  var failedInfo={};

  if (_offlineValidationRules[rulesScopeID])
  { var vRules = _offlineValidationRules[rulesScopeID].rules;

    var applyRules = function(elID){
      var $el = $validationScope.find("#"+elID);
      //var ignValidation = klib.toBoolean($el.data("ignoreValidationIfInvisible"));
      //var isVisible = $el.is(":visible");
      //if ($el.prop("type") && $el.prop("type").equalsIgnoreCase("hidden")) debugger;
      var retValue = (klib.toBoolean($el.data("ignoreValidationIfInvisible")) && !($el.is(":visible")));
      if (!retValue)
      { retValue = _.every(vRules[elID], function(valdateFn){
          var fnResponse = valdateFn($el);
          if (!fnResponse) { failedInfo = {errcode:2, el:$el, fn:valdateFn}; }
          return fnResponse;
        });
      }
      return retValue;
    };

    if ($.isEmptyObject(vRules))
    { failedInfo = {errcode:1, errmsg:"Rules not found in scope ["+context+"]."};
    }
    else
    { _isOnOfflineValidation = true;
      var isAllOk = _.every(_.keys(vRules), function(elID){
        return (applyRules(elID));
      });
      _isOnOfflineValidation = false;
    }
  }
  else
  { failedInfo = {errcode:1, errmsg:"Scope not found."};
  }

  return(failedInfo);
};