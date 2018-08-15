/** @license SPA.js Validation Extension | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/*
* SPA.js Validation Extension
* version: 2.0.0
* Author: Kumar
* */

spa['_validateDefaults'] = {
    required    : 'Required'
  , digits      : 'Digits'
  , numbers     : 'Numbers'
  , integer     : 'Integer'
  , alphabet    : 'Alpha'
  , alphanumeric: 'AlphaNumeric'
  , pattern     : 'PatternMatch'
  , range       : 'ValueRange'
  , fixedlength : 'Lengths'
  , minlength   : 'LengthMin'
  , maxlength   : 'LengthMax'
  , email       : 'Email'
  , url         : 'Url'
  , date        : 'Date'
  , cardno      : 'CardNo'
  , ipv4        : 'IPv4'
  , ipv6        : 'IPv6'
  , ipaddress   : 'IP'
  , subnetmask  : 'Subnet'
  , phoneUS     : 'PhoneUS'
  , wordsize    : 'WordSize'
  , compare     : 'Compare'
  , promise     : 'Promise'
};

spa['_validate'] = {
  defaults: {offline: true},
  _isOnOfflineValidation : false,
  _validateAlertTemplate : '<div class="errortxt error-txt break-txt" data-i18n=""></div>',
  _offlineValidationRules : {},
  _fn : {
      Promise     : function _fnPromise(forObj){
                      if (!spa['_validate']._isOnOfflineValidation) {
                        var $forObj = $(forObj), vRules = $forObj.data('validate')||'';
                        if (/(promise)(\s)*:(\s)*(\'|\")/.test(vRules)) {
                          spa['_validate']._addValidationClass($forObj, 'validation-pending');
                        }
                      }
                      return true;
                    }
    , Required    : function _fnRequired(obj, msg) {
                      var elValue = spa.getElValue(obj);
                      return !(spa.isBlank(elValue));
                      //return spa['_validate']._showValidateMsg(obj, msg, !(spa.isBlank(elValue)));
                    }
    , Digits      : function _fnValidDigits(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^\d+$/.test(elValue)) );
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Numbers     : function _fnValidNumbers(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) );
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Integer     : function _fnValidInteger(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^-?\d+$/.test(elValue)) );
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Alpha       : function _fnValidAlpha(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || !(/[^a-z]/gi.test(elValue)) );
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , AlphaNumeric: function _fnValidAlphaNumeric(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || !(/[^a-z0-9]/gi.test(elValue)) );
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , PatternMatch: function _fnValidPatternMatch(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { var rx = new RegExp($(obj).data("validatePattern"), $(obj).data("validatePatternOptions").replace(/!/g,""));
                        isValid = rx.test(elValue);
                        if ($(obj).data("validatePatternOptions").indexOf("!")>=0) isValid = !isValid;
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , ValueRange  : function _fnValidValueRange(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { isValid = false;
                        if (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) {
                          var uValue  = spa.toFloat(elValue);
                          var rLimits = (" "+($(obj).data("validateRange") || "")+": ").split(":");
                          var checkMin = !spa.isBlank(rLimits[0]);
                          var checkMax = !spa.isBlank(rLimits[1]);
                          var rMin = spa.toFloat(rLimits[0]);
                          var rMax = spa.toFloat(rLimits[1]);
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
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , LengthMin   : function _fnValidLengthMin(obj, msg) {
                      var elValue = $(obj).val();
                      var minLen  = spa.toInt($(obj).data("minlength") || $(obj).attr("minlength"));
                      var isValid = (elValue.length >= minLen);
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , LengthMax   : function _fnValidLengthMax(obj, msg) {
                      var elValue = $(obj).val();
                      var maxLen  = spa.toInt($(obj).data("maxlength"));
                      var isValid = (elValue.length <= maxLen);
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Lengths     : function _fnValidLengths(obj, msg){
                      var elValue = $(obj).val();
                      var eLength = elValue.length;
                      var minLen  = spa.toInt($(obj).data("minlength") || $(obj).attr("minlength"));
                      var maxLen  = spa.toInt($(obj).data("maxlength"));
                      var isValid = ((eLength >= minLen) && (eLength <= maxLen));
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , WordSize    : function _fnValidWordSize(obj, msg) {
                      var elValue = $(obj).val();
                      var maxWordSize = _.max(_.map((''+elValue).replace(/[-\n]/g,' ').split(' '), function(w) { return w.length; }));
                      var validWordSize = spa.toInt($(obj).data("validWordSize")) || 20;
                      var isValid = (maxWordSize <= validWordSize);
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Email       : function _fnValidEmail(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid = ( (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(elValue)
                                 || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(elValue))
                                 && /[a-z0-9]/i.test((elValue[elValue.length-1]))
                                  );
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Url         : function _fnValidUrl(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(elValue);
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Date        : function _isValidDate(obj, msg) {
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
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , CardNo      : function _fnValidCardNo(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { // accept only spaces, digits and dashes && digits length > 14
                        if ( (!(/[^0-9 \-]+/.test(elValue))) && (elValue.replace(/[^0-9]/g,'').length>14)) {
                          var nCheck = 0, nDigit = 0, bEven = false;
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
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IPv4        : function _fnValidIpv4(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid){
                        isValid = ((/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(elValue))
                                    && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IPv6        : function _fnValidIpv6(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid){
                        isValid = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(elValue);
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IP          : function _fnValidIpAddress(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { var strIpAddr = elValue;
                        var noOfOctates = (spa.toInt($(obj).data("validateIpaddressOctates") || 4)) - 1;
                        var rxValidIp = new RegExp("^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\\.){"+noOfOctates+"}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$", "g");
                        isValid = ((rxValidIp.test(strIpAddr)) && ( _.every(strIpAddr.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                        spa['_validate']._showValidateMsg(obj, msg, isValid);
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
                          spa['_validate']._showValidateMsg(obj, msg, isValid);
                        }
                      }

                      return isValid;
                    }
    , Subnet      : function _fnValidSubnet(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        var rxSubnet = new RegExp("^((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0)|255\\.(0|128|192|224|240|248|252|254)))))$");
                        isValid = ((rxSubnet.test(elValue)) && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , PhoneUS     : function _fnValidPhoneUS(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid= (elValue.length > 9 && elValue.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/));
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Compare     : function _fnValidCompare(obj, msg){
                      var isValid = true;
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        var $el = $(obj);
                        var elData = $el.data();
                        var compareSpec = spa.toJSON(elData['validateCompare'] || '{}');
                        var $compareTarget;
                        if (!spa.isBlank(compareSpec) && (compareSpec['target'])) {
                          $compareTarget = $(compareSpec['target']);
                          var compareRule = compareSpec['valid'] || '=';
                          var thisElValue = spa.getElValue(obj);
                          var compElValue = spa.getElValue($compareTarget);
                          if ( ('number'.equalsIgnoreCase(compareSpec['type']))
                            || (compareRule.indexOf('<') >=0) || (compareRule.indexOf('>') >=0)  ) {
                            thisElValue = spa.toFloat(thisElValue);
                            compElValue = spa.toFloat(compElValue);
                          };
                          if ('date'.equalsIgnoreCase(compareSpec['type'])) {
                            //TODO
                            //thisElValue = spa.toDate(thisElValue, compareSpec['format']||'YYYY-MM-DD');
                            //compElValue = spa.toDate(compElValue, compareSpec['format']||'YYYY-MM-DD');
                            //compare Dates
                          } else {
                            switch(compareRule){
                              case '!=' :
                                isValid = thisElValue != compElValue;
                                break;
                              case '!==' :
                              isValid = thisElValue !== compElValue;
                              break;
                              case '===' :
                              isValid = thisElValue === compElValue;
                              break;
                              case '>' :
                              isValid = thisElValue > compElValue;
                              break;
                              case '<' :
                              isValid = thisElValue < compElValue;
                              break;
                              case '>=' :
                              isValid = thisElValue >= compElValue;
                              break;
                              case '<=' :
                              isValid = thisElValue <= compElValue;
                              break;
                              default:
                              isValid = thisElValue == compElValue;
                              break;
                            }
                          }
                        }
                      }
                      return isValid;
                      //return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
  }
  , _showValidateMsg : function __showValidateMsg(forObj, msg, isValid, errMsgTemplate, skipCtrlUpdate) {
                      msg = msg || "";
                      if ((arguments.length>2) && _.isString(isValid)) { errMsgTemplate = isValid; }
                      if ((arguments.length>2) && _.isBoolean(isValid) && (isValid)) { msg = ""; }
                      errMsgTemplate = errMsgTemplate || spa['_validate']._validateAlertTemplate;

                      var isCustomErrMsgElement = (!errMsgTemplate.beginsWithStrIgnoreCase('<'));
                      var $forObj = $(forObj),
                          $forObjParent = $forObj.parent(),
                          errClassTargetSelector = $forObj.data('errorClassTarget'),
                          $erClassTarget = (errClassTargetSelector)? $forObj.closest(errClassTargetSelector) : $forObjParent,
                          errElPosition = $forObj.data('errorPosition');
                      forObj = $forObj.get(0);

                      if (!spa['_validate']._isOnOfflineValidation) {
                        $erClassTarget.removeClass('has-error-msg no-error-msg')[(isValid === false)? 'addClass' : 'removeClass']('validation-error '+(!!msg? 'has-error-msg' : 'no-error-msg'));
                        if (!skipCtrlUpdate) spa.updateTrackFormCtrls(forObj['form']);
                      }

                      var alertObj = (isCustomErrMsgElement)? $(errMsgTemplate) : $forObj.next();
                      if (!isCustomErrMsgElement && errElPosition){
                        if ('first'.equalsIgnoreCase(errElPosition)) {
                          alertObj = $forObjParent.children().first();
                        } else if ('last'.equalsIgnoreCase(errElPosition)){
                          alertObj = $forObjParent.children().last();
                        }
                      }
                      var i18nKey='', i18nSpec='', i18nData='';
                      if ((($(alertObj).attr("class")) === ($(errMsgTemplate).attr("class"))) || isCustomErrMsgElement)
                      { if (msg.beginsWithStrIgnoreCase("i18n:"))
                        { i18nKey  = (msg.getLeftStr('|') || msg).replace(/i18n:/gi, '');
                          i18nData = msg.getRightStr('|');
                          i18nSpec = "{html:'" + i18nKey + "'}";
                          msg = spa.i18n.text(i18nKey, spa.toJSON(i18nData));
                        }
                        if (!spa['_validate']._isOnOfflineValidation)
                        { $(alertObj).attr("data-i18n",i18nSpec).data("i18n",i18nSpec);
                          $(alertObj).attr("data-i18n-data",i18nData).data("i18nData",i18nData);
                          $(alertObj).html(msg);
                        }
                      }
                      else
                      { if (!spa.isBlank(msg))
                        { if (errElPosition) {
                            if ('first'.equalsIgnoreCase(errElPosition)) {
                              $(errMsgTemplate).prependTo($forObjParent);
                            } else if ('last'.equalsIgnoreCase(errElPosition)){
                              $(errMsgTemplate).appendTo($forObjParent);
                            } else {
                              $(errMsgTemplate).insertAfter($forObj);
                            }
                          } else {
                            $(errMsgTemplate).insertAfter($forObj);
                          }
                          spa['_validate']._showValidateMsg(forObj, msg, isValid, errMsgTemplate);
                        }
                      }
                      return isValid;
                    }

  , _getValidationClassTarget: function(forObj){
      var $forObj = $(forObj),
          vClassTargetSelector = $forObj.data('errorClassTarget');
      return ((vClassTargetSelector)? $forObj.closest(vClassTargetSelector) : $forObj.parent());
    }
  , _addValidationClass: function(forObj, className){
      spa['_validate']._getValidationClassTarget(forObj).addClass(className);
    }
  , _removeValidationClass: function(forObj, className){
      spa['_validate']._getValidationClassTarget(forObj).removeClass(className);
    }
  , _deferValidate: function(){ return true; }
  , _registerPromise: function(promiseName, forObj, vFn, errMsg){
      var deferValidate = !spa.isBlank(promiseName);
      if (deferValidate) {
        var $forObj  = $(forObj),
            promises = $forObj.data('promises')||'',
            isNewPromise = (promises.indexOf('['+promiseName+']')<0);
        if (isNewPromise) {
          spa.console.log('validating promise: '+promiseName);
          promises += '['+promiseName+']';
          $forObj.attr('data-promises', promises).data('promises', promises);
          spa['_validate']._addValidationClass($forObj, 'validation-pending');
          if (spa.is(vFn, 'function')) vFn.call($forObj, $forObj, errMsg, promiseName);
        }
      }
      return deferValidate;
    }
  , expose: function(exposeTo){
    exposeTo = exposeTo || {};
    Object.keys(spa['_validateDefaults']).forEach(function(key){
      exposeTo[key] = spa['_validate']['_fn'][spa['_validateDefaults'][key]];
    });
    return exposeTo;
  }
};

function _clearSpaValidateMsg(forObj){
  spa['_validate']._showValidateMsg(forObj);
  return true;
}

var _check = spa['_validate'].expose();

spa['initValidation'] = spa['initDataValidation'] = function(context){
  /* apply same rules if mult-events specified with underscore eg: onFocus_onBlur_onKeyup */
  spa.console.log('>>>>> initDataValidation request for context:'+context);

  var splitValidateEvents = function(eObj) {
    eObj = eObj || {};
    _.each(_.keys(eObj), function(eNames){
      if ((eNames.indexOf("on")==0) && (eNames.indexOf("_")>0)){
        _.each(eNames.split("_"), function(eName){
          if (eName.indexOf('on') < 0) eName = 'on'+eName;
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
  var commonValidateRules = splitValidateEvents(spa.toJSON($context.data("validateCommon")||"{}"));
  var commonOnFocusRules  = _.merge({},commonValidateRules['onFocus']);
  var vFormDefaults       = spa.toJSON($context.attr("data-validate-defaults") || {});
  var isDefaultOfflineG   = !!vFormDefaults['offline'];

  spa.console.log('commonValidateRules');
  var promiseCheckRule = {fn:'_check.promise', offline:false};
  if (spa.isBlank(commonOnFocusRules)){
    commonValidateRules['onFocus'] = promiseCheckRule;
  } else {
    if (!spa.is(commonOnFocusRules,'array')){
      commonOnFocusRules = [commonOnFocusRules];
    }
    commonOnFocusRules.push(promiseCheckRule);
  }
  commonValidateRules['onFocus'] = commonOnFocusRules;
  spa.console.log(commonValidateRules);

  var addRule2El, addRule2ElDir, overrideOfflineRule2El, elOfflineRule, commonRule2El;
  var offlineValidationKey = ($context.data("validateForm") || $context.data("validateScope")||"").replace(/onRender/i,'').replace(/[^a-zA-Z0-9]/g,'');
  if (spa.isBlank(offlineValidationKey)) {
    var contextName = context.replace(/[^a-zA-Z0-9]/g,'');
    //if (!spa['_validate']._offlineValidationRules.hasOwnProperty(contextName)) {
      offlineValidationKey = contextName; //Always build new offline rules.
    //}
  }
  spa.console.log('offlineValidationKey: '+offlineValidationKey);
  var prepareOfflineValidationRules = (!spa.isBlank(offlineValidationKey));
  if (prepareOfflineValidationRules)
  { spa.console.log('resetting the rules for '+offlineValidationKey);
    spa['_validate']._offlineValidationRules[offlineValidationKey] = {rules:{}};
  }
  spa.console.log(offlineValidationKey, spa['_validate']._offlineValidationRules[offlineValidationKey]);

  $context.find(elSelector+"[data-validate]").each(function(index, el){
    var elID = $(el).prop("id");
    if (!elID) {
      elID = (el['name'] || el['type']).replace(/[^a-z]/gi,'')+index;
      $(el).attr('id', elID);
    }
    var elValidateRules={};
    var elValidateRuleSpec = $(el).data("validate");
    if (elValidateRuleSpec && elValidateRuleSpec.indexOf("{")<0) //TODO:Need to revisit this specification
    { var elValidateEvents     = ($(el).data("validateEvents")||"onBlur").replace(/[^a-z]/gi," ").normalizeStr().replace(/ /g,"_");
      var elValidateOffline    = ",offline:"+($(el).data("validateOffline") || isDefaultOfflineG || "false");
      var elValidateFunctions  = "{fn:"+(elValidateRuleSpec.replace(/[,;]/," ").normalizeStr().replace(/ /g, elValidateOffline+"},{fn:"))+elValidateOffline+"}";
      elValidateRuleSpec = "{"+elValidateEvents+":["+elValidateFunctions+"]}";
      //$(el).data("validate", elValidateRuleSpec);
    }
    elValidateRules = splitValidateEvents(spa.toJSON(elValidateRuleSpec));
    spa.console.log(elValidateRuleSpec);

    /* Apply common events' rule to each element */
    _.each( _.keys(commonValidateRules), function(commonValidateOnEvent){
      var oCommonValidateRules = commonValidateRules[commonValidateOnEvent];
      if (!_.isArray(oCommonValidateRules))
      { oCommonValidateRules = [oCommonValidateRules];
      }
      oCommonValidateRules.reverse();

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
      spa.console.log("settingup event on["+jqEventName+"]...");

      //Convert element rules to array
      if (!_.isArray(elValidateRules[validateOnEvent])){
        elValidateRules[validateOnEvent] = [elValidateRules[validateOnEvent]];
      }
      spa.console.log(elValidateRules);

      if (prepareOfflineValidationRules)
      { _.each(elValidateRules[validateOnEvent], function(elValidateRule4Events){
          if (!(spa.is(elValidateRule4Events, 'array'))) {
            elValidateRule4Events = [elValidateRule4Events];
          }
          _.each(elValidateRule4Events, function(elValidateRule4Event){
            if (!elValidateRule4Event.hasOwnProperty('offline')) elValidateRule4Event['offline'] = isDefaultOfflineG;
            spa.console.log(elValidateRule4Event);
            if (elValidateRule4Event.offline && !elValidateRule4Event['promise']) {
              var newRule = {fn:elValidateRule4Event.fn, msg:elValidateRule4Event.msg};
              if (!spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID]) spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID] = [];
              if (_.indexOf(spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID], newRule)<0) {
                spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID].push(newRule);
              }
            }
          });
        });
      }

      spa.console.log('registering an event: '+validateOnEvent);
      if (validateOnEvent.beginsWithStrIgnoreCase('on') && !('test'.equalsIgnoreCase(jqEventName)) ) {
        $(el).on(jqEventName, function(){
          var el = this, vFn, errMsg, vFnResponse;
          _.every(elValidateRules[validateOnEvent], function(validateRule){
            if (_.isArray(validateRule))
            { return _.every(validateRule, function(validateRuleInArray){
                vFn = validateRuleInArray.fn;
                if (spa.is(vFn, 'string')) {
                  vFn = spa.findSafe(window, vFn);
                }
                if (!spa.is(vFn, 'function')) {
                  console.error('data-validate-function Not Found: '+validateRuleInArray.fn);
                }
                errMsg = (validateRuleInArray.msg || $(el).data("validateMsg") || "");
                if (spa['_validate']._registerPromise(validateRuleInArray['promise'], el, vFn, errMsg)) {
                  vFn = spa['_validate']._deferValidate;
                }
                vFnResponse = ((spa.is(vFn, 'function'))? (vFn.call(el, el, errMsg)) : false);
                if (spa.is(vFnResponse, 'boolean')) {
                  spa['_validate']._showValidateMsg(el, errMsg, vFnResponse);
                };
                return vFnResponse;
              });
            }
            else
            { vFn = validateRule.fn;
              if (spa.is(vFn, 'string')) {
                vFn = spa.findSafe(window, vFn);
              }
              if (!spa.is(vFn, 'function')) {
                console.error('data-validate-function Not Found: '+validateRule.fn);
              }
              errMsg = (validateRule.msg || $(el).data("validateMsg") || "");
              if (spa['_validate']._registerPromise(validateRule['promise'], el, vFn, errMsg)){
                vFn = spa['_validate']._deferValidate;
              }
              vFnResponse = ((spa.is(vFn, 'function'))? (vFn.call(el, el, errMsg)) : false);
              if (spa.is(vFnResponse, 'boolean')) {
                spa['_validate']._showValidateMsg(el, errMsg, vFnResponse);
              }
              return vFnResponse;
            }
          });
        }); //End of jQuery Event Registration
      }
    });
  });
};

/*
 *
 * spa.validateForm('formID', true)
 * spa.validateForm('formID', true, true)
 * spa.validateForm('formID', 'elID1, elID2', true)
 * spa.validateForm('formID', 'elID1, elID2', true, true)
 *
 */
spa['validateForm'] = spa['validate'] = spa['doDataValidation'] = function(context, showMsg, validateAll){
  var elIDs;
  if (spa.is(arguments[1], 'string')) {
    elIDs       = '#'+(arguments[1].replace(/[ #]/g,'').replace(/,/g,',#'))+',';
    showMsg     = arguments[2];
    validateAll = arguments[3];
  }
  var rulesScopeID     = (context.replace(/[^a-zA-Z0-9]/g,''))
    , validationScope  = "#"+(context.replace(/#/g, ""))
    , $validationScope = $(validationScope)
    , failedInfo=[], isAllOk;

  if (spa['_validate']._offlineValidationRules[rulesScopeID])
  { var vRules = spa['_validate']._offlineValidationRules[rulesScopeID].rules;

    var applyRules = function(elID){
      var $el = $validationScope.find("#"+elID), el=$el[0], errMsg, vFn, vFnResponse;
      //var ignValidation = spa.toBoolean($el.data("ignoreValidationIfInvisible"));
      //var isVisible = $el.is(":visible");
      //if ($el.prop("type") && $el.prop("type").equalsIgnoreCase("hidden")) debugger;
      var retValue = (spa.toBoolean($el.data("ignoreValidationIfInvisible")) && !($el.is(":visible")));
      if (!retValue)
      { retValue = _.every(vRules[elID], function(vRule){
          vFn = vRule.fn;
          if (spa.is(vFn, 'string')) {
            vFn = spa.findSafe(window, vFn);
          }
          if (!spa.is(vFn, 'function')) {
            console.error('data-validate-function Not Found: '+vRule.fn);
          }
          errMsg = (vRule.msg || $el.data("validateMsg") || "");

          vFnResponse = ((spa.is(vFn, 'function'))? (vFn.call(el, el, errMsg)) : false);
          if (spa.is(vFnResponse, 'boolean')) {
            spa['_validate']._showValidateMsg($el, errMsg, vFnResponse, '', true);
          }

          if (!vFnResponse) {
            var errObj = {errcode:2, el:el, fn:vRule.fn, msg:errMsg};
            failedInfo.push(errObj);
          }
          return vFnResponse;
        });
      }
      return retValue;
    };

    if ($.isEmptyObject(vRules))
    { var eCode= 1, eMsg = "Offline rules not found in scope ["+context+"].";
      if ($validationScope.find('.validation-error,.validation-pending').length) {
        eCode= 3; eMsg += " Found .validation-error|.validation-pending";
      }
      failedInfo = [{errcode:eCode, errmsg:eMsg}];
    }
    else
    { var rules2Validate = _.keys(vRules);
      if (elIDs) {
        rules2Validate = _.map(rules2Validate, function(elID){
          return (elIDs.indexOf('#'+elID+',')>=0)? elID : '';
        });
      }
      spa['_validate']._isOnOfflineValidation = !showMsg;
      isAllOk = _.every(rules2Validate, function(elID){
        return elID? (applyRules(elID) || validateAll) : true;
      });
      spa['_validate']._isOnOfflineValidation = false;
    }
  }
  else
  { if (!$validationScope.length) {
      failedInfo = [{errcode:1, errmsg:"Form Not Found."}];
    } else if ($validationScope.is('[data-validate-form]')) {
      failedInfo = [{errcode:1, errmsg:"Form Not Initialized."}];
    }
  }

  return(failedInfo);
};

spa['updateValidation'] = function(forObj, msg, isValid, errMsgTemplate){
  $(forObj).each(function(i, el){
    spa['_validate']._showValidateMsg(el, msg, isValid, errMsgTemplate);
  });
};
spa['updateValidationPromise'] = function(promiseNames, forObj, msg, isValid, errMsgTemplate){
  var $forObjs = $(forObj), $forObj, pendingPromises;

  $forObjs.each(function(i, el){
    $forObj  = $(el);

    _.each((promiseNames.split(',')), function(promiseName){
      pendingPromises = ($forObj.data('promises')||'').replace('['+(promiseName.trim())+']','');
      $forObj.attr('data-promises', pendingPromises).data('promises', pendingPromises);
      if (spa.isBlank(pendingPromises)) {
        spa['_validate']._removeValidationClass($forObj, 'validation-pending');
      }
    });

    spa['_validate']._showValidateMsg(el, msg, isValid, errMsgTemplate);
  });
};