/*@license jQ-spa-i18n [MIT]*/
/******************************************************************************
 * spa-i18n
 *
 * @inspiration Localisation assistance for jQuery (https://github.com/jquery-i18n-properties/jquery-i18n-properties)
 * @version     1.2.2 (base)
 * Dual licensed
 * MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt)
 * GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt)
 *
 *****************************************************************************/
(function ($) {
  $.i18n = {
    map: {},
    loaded: false,
    language: _initLang
  };

  /*
   * Load and parse language key = value file (.properties),
   * making bundles keys available as javascript variables.
   *
   * i18n files are named <name>.properties, or <name>_<language>.properties or <name>_<language>_<country>.properties
   * Where:
   *  The <language> argument is a valid ISO Language Code. These codes are the lower-case,
   *  two-letter codes as defined by ISO-639. You can find a full list of these codes at a
   *  number of sites, such as: http://www.loc.gov/standards/iso639-2/englangn.html
   *  The <country> argument is a valid ISO Country Code. These codes are the upper-case,
   *  two-letter codes as defined by ISO-3166. You can find a full list of these codes at a
   *  number of sites, such as: http://www.iso.ch/iso/en/prods-services/iso3166ma/02iso-3166-code-lists/list-en1.html
   *
   * Sample usage for a language/Language.properties bundle:
   * $.i18n.language({
   *  language: 'en_US',
   *  name    : 'Language',
   *  path    : 'language/'
   * });
   * @param  name      (string/string[], optional) names of file to load (eg, 'Language').
   * @param  language  (string, optional) language/country code (eg, 'en', 'en_US', 'pt_BR'). if not specified, language reported by the browser will be used instead.
   * @param  path      (string, optional) path of directory that contains file to load
   * @param  cache     (boolean, optional) whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to false (i.e. forcibly reloaded)
   * @param  callback  (function, optional) callback function to be called after script is terminated
   */
  function _initLang(settings) {
    // set up settings
    var defaults = {
      language: '',
      name: 'Language',
      path: '',
      ext: '.properties',
      cache: true,
      async: true,
      callback: null
    };
    settings = $.extend(defaults, settings);

    $.i18n.map = {}; //clear previous dictionary

    // Try to ensure that we have minimum a two letter language code
    var langCode     = normaliseLanguageCode(settings.language)
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
  };

  /**
   * Eg, jQuery.i18n.prop('com.company.bundles.menu_add')
   */
  $.i18n.prop = function (key /* Add parameters as function arguments as necessary  */) {
    var value = $.i18n.map[key];
    if (value == null)
      return '[' + key + ']';

    var phvList;
    if (arguments.length == 2 && Array.isArray(arguments[1]))
    // An array was passed as the only parameter, so assume it is the list of place holder values.
      phvList = arguments[1];

    // Place holder replacement
    /**
     * Tested with:
     *   test.t1=asdf ''{0}''
     *   test.t2=asdf '{0}' '{1}'{1}'zxcv
     *   test.t3=This is \"a quote" 'a''{0}''s'd{fgh{ij'
     *   test.t4="'''{'0}''" {0}{a}
     *   test.t5="'''{0}'''" {1}
     *   test.t6=a {1} b {0} c
     *   test.t7=a 'quoted \\ s\ttringy' \t\t x
     *
     * Produces:
     *   test.t1, p1 ==> asdf 'p1'
     *   test.t2, p1 ==> asdf {0} {1}{1}zxcv
     *   test.t3, p1 ==> This is "a quote" a'{0}'sd{fgh{ij
     *   test.t4, p1 ==> "'{0}'" p1{a}
     *   test.t5, p1 ==> "'{0}'" {1}
     *   test.t6, p1 ==> a {1} b p1 c
     *   test.t6, p1, p2 ==> a p2 b p1 c
     *   test.t6, p1, p2, p3 ==> a p2 b p1 c
     *   test.t7 ==> a quoted \ s	tringy 		 x
     */

    var i;
    if (typeof(value) == 'string') {
      // Handle escape characters. Done separately from the tokenizing loop below because escape characters are
      // active in quoted strings.
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

      // Lazily convert the string to a list of tokens.
      var arr = [], j, index;
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
        else if (value.charAt(i) == '{') {
          // Beginning of an unquoted place holder.
          j = value.indexOf('}', i + 1);
          if (j == -1)
            i++; // No end. Process the rest of the line. Java would throw an exception
          else {
            // Add 1 to the index so that it aligns with the function arguments.
            index = parseInt(value.substring(i + 1, j));
            if (!isNaN(index) && index >= 0) {
              // Put the line thus far (if it isn't empty) into the array
              var s = value.substring(0, i);
              if (s != "")
                arr.push(s);
              // Put the parameter reference into the array
              arr.push(index);
              // Start the processing over again starting from the rest of the line.
              i = 0;
              value = value.substring(j + 1);
            }
            else
              i = j + 1; // Invalid parameter. Leave as is.
          }
        }
        else
          i++;
      }

      // Put the remainder of the no-empty line into the array.
      if (value != "")
        arr.push(value);
      value = arr;

      // Make the array the value for the entry.
      $.i18n.map[key] = arr;
    }

    if (value.length == 0)
      return "";
    if (value.length == 1 && typeof(value[0]) == "string")
      return value[0];

    var str = "";
    for (i = 0; i < value.length; i++) {
      if (typeof(value[i]) == "string")
        str += value[i];
      // Must be a number
      else if (phvList && value[i] < phvList.length)
        str += phvList[value[i]];
      else if (!phvList && value[i] + 1 < arguments.length)
        str += arguments[value[i] + 1];
      else
        str += "{" + value[i] + "}";
    }

    return str;
  };

  function _onComplete(settings) {
    if (settings.callback) {
      settings.callback();
    }
  }

  /* Load and parse .properties files */
  function _loadAndParseLangFile(filename, settings) {
    $.ajax({
      url: filename,
      async: settings.async,
      cache: settings.cache,
      dataType: 'text',
      success: function (data) {
        parseData(data);
        _onComplete(settings);
      },
      error: function () {
        console.log('Failed to download language file: ' + filename);
        _onComplete(settings);
      }
    });
  }

  /* Unescape unicode chars ('\u00e3') */
  function unescapeUnicode(str) {
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

  /* Parse .properties files */
  function parseData(data) {
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
              value = value.replace(unicodeMatches[u], unescapeUnicode(unicodeMatches[u]));
            }
          }

          // add to map
          $.i18n.map[name] = value;

        } // END: if(pair.length > 0)
      } // END: skip comments
    }
    $.i18n.loaded = true;
  }

  /* Ensure language code is in the format aa_AA. */
  function normaliseLanguageCode(lang) {
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

})($);
