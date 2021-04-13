/*@license SPA.js (nxT: Template Extension) [MIT] - based on doT.js (https://github.com/olado/doT/blob/master/LICENSE-DOT.txt)*/
(function (_global) {
  "use strict";

  function nxT (tmpl, data, target, replaceTarget) {
    return render(tmpl, data, target, replaceTarget);
  }
  nxT.version  = "1.0.0";
  nxT.settings = { scopeName : "data", strip : false };
  nxT.compile  = compile;
  nxT.render   = render;

  var settings = {
    rx: {
      interpolate       : /\{\{([\s\S]+?(\}?)+)\}\}/g,                              /* {{ varPath }} */
      encode            : /\{\{(\&|\{|encode)([\s\S]+?)\}?\}\}/g,                   /* {{& varPath }} or {{{ varPath }}} or {{encode varPath }} */
      conditional       : /\{\{(\?|#\?|if|#if)(\?|\^)?\s*([\s\S]*?)\s*\}\}/g,       /* {{? condition}} or {{#? condition }} or {{if condition }} or {{#if condition }} */
      conditionalNot    : /\{\{(\!|#\!|unless|#unless)(\?)?\s*([\s\S]*?)\s*\}\}/g,  /* {{! condition}} or {{!? condition }} or {{unless condition }} or {{#unless condition }} */
      conditionalElse   : /\{\{(\^|else)(\?|if|If)?\s*([\s\S]*?)\s*\}\}/g,          /* {{^}} {{else}} {{?^}} {{??}} {{elseif}} {{elseIf}} with optionalCondition */
      withScope         : /\{\{(with|#with)\s*([\s\S]*?)\s*\}\}/g,                  /* {{with contextObject }} or {{#with contextObject }} */
      blockClose        : /\{\{\/\s*([\s\S]*?)\s*\}\}/g,                            /* {{/?}} {{/~}} {{/if}} {{/with}} */
      evaluate          : /\{\{js:([\s\S]+?)(\/)?\}\}/g,                            /* {{js: javascript-statements; /}} */
      iterate           : /\{\{(~|each|#each)\s*(?:\}\}|([\s\S]+?)\s*(?:\:\s*([\w$]+))?\s*(?:\:\s*([\w$]+))?\s*\}\})/g, /* {{~ expression}} {{each expression}} {{#each expression}} expression = varPath :optionalItemAlias :optionalIndexAlias */

      define            : /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)(#|\/)\}\}/g,   /* {{##def.xyz: template-str-lines /}} */
      defineParams      : /^\s*([\w$]+): ([\s\S]+)/,
      use               : /\{\{#>([\s\S]+?)\}\}/g,                               /* {{#> def.xyz}} */
      useParams         : /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\: \s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g
    },

    append              : false,
    selfContained       : false,
    doNotSkipEncoded    : false
  };

  nxT.encodeHTMLSource = function(doNotSkipEncoded) {
    var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
      matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
    return function(code) {
      return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
    };
  };
  nxT.isObj = function ( x ) {
    return ((Object.prototype.toString.call(x).slice(8,-1).toLowerCase()) == 'object');
  };
  nxT.isValidVar = function ( varName ) {
    return (!/[^0-9a-z]|^[0-9]+/gi.test(varName));
  };


  if (typeof module !== "undefined" && module.exports) {
    module.exports = nxT;
  } else if (typeof define === "function" && define.amd) {
    define(function(){return nxT;});
  } else {
    _global.nxT = _global.Tee = nxT;
  }

  var startend = {
    append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
    split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
  }, skip = /$^/;

  function resolveDefs (c, block, def) {
    return ((typeof block === "string") ? block : block.toString())
    .replace(c.rx.define || skip, function(m, code, assign, value) {
      if (code.indexOf("def.") === 0) {
        code = code.substring(4);
      }
      if (!(code in def)) {
        if (assign === ":") {
          if (c.rx.defineParams) value.replace(c.rx.defineParams, function(m, param, v) {
            def[code] = {arg: param, text: v};
          });
          if (!(code in def)) def[code]= value;
        } else {
          new Function("def", "def['"+code+"']=" + value)(def);
        }
      }
      return "";
    })
    .replace(c.rx.use || skip, function(m, code) {
      if (c.rx.useParams) code = code.replace(c.rx.useParams, function(m, s, d, param) {
        if (def[d] && def[d].arg && param) {
          var rw = (d+":"+param).replace(/'|\\/g, "_");
          def.__exp = def.__exp || {};
          def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
          return s + "def.__exp['"+rw+"']";
        }
      });
      var v = new Function("def", "return " + code)(def);
      return v ? resolveDefs(c, v, def) : v;
    });
  }

  function fixVarPath ( identifier ) {
    identifier = identifier.trim()
                  .replace(/\@/g,'___')
                  .replace(/this/g,'___this')
                  .replace(/\.\//g,'___this.')
                  .replace(/\//g,'___rootCtx.');

    if (identifier[0]==='.') identifier = '___this'+identifier;

    identifier = identifier
                  .replace(/\.+$/g, '').replace(/\.\[/g, '[')
                  .replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");

    return identifier;
  }

  function strip ( str ) {
    return stripJsComments(str)
            .replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
            .replace(/\r|\n|\t/g,'');
  }
  function stripJsComments ( str ) {
    return str.replace(/\/\/(.*)(\r|\n)/g, '$2')
              .replace(/\/\*[\s\S]*?\*\//g,'');
  }

  function compile (tmpl, def) {
    var c = settings;

    var ctxStrB = 'if (arguments.length) return arguments.callee.call(arguments[0]);'
                + 'var '+(nxT.settings.scopeName||'data')+'=___rootCtx=___this=this;'
                + 'try{with(Object(this)){';
    var ctxStrE = '}}catch(e){ console.error("Error in Template:", e); }';

    var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
      tmplFnStr  = (c.rx.use || c.rx.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

    tmplFnStr = ("var out='"
      + (nxT.settings.strip ? strip(tmplFnStr) : tmplFnStr)
      .replace(/'|\\/g, "\\$&").replace(/{{\/(~|each)}}/g, '{{~}}')
      .replace(c.rx.blockClose || skip,function(m, block) {
        return "';}out+='";
      })
      .replace(c.rx.evaluate || skip, function(m, code) {
        code = nxT.settings.strip? code : stripJsComments(code);
        return "';" + fixVarPath(code) + ";out+='";
      })
      .replace(c.rx.encode || skip, function(m, rxMatch, code) {
        needhtmlencode = true;
        return cse.startencode + fixVarPath(code) + cse.end;
      })
      .replace(c.rx.conditionalElse || skip, function(m, els, elsIf, condition) {
        return (condition ? "';}else if(" + fixVarPath(condition) + "){out+='" : "';}else{out+='");
      })
      .replace(c.rx.conditional || skip, function(m, ifStmt, elseCase, condition) {
        return elseCase ?
          (condition ? "';}else if(" + fixVarPath(condition) + "){out+='" : "';}else{out+='") :
          (condition ? "';if(" + fixVarPath(condition) + "){out+='" : "';}out+='");
      })
      .replace(c.rx.conditionalNot || skip, function(m, ifNotStmt, optionalQ, condition) {
        return (condition ? "';if(!(" + fixVarPath(condition) + ")){out+='" : "';}out+='");
      })
      .replace(c.rx.withScope || skip, function(m, rxMatch, context) {
        return (context ? "';with(Object(" + fixVarPath(context) + ")){out+='" : "';}out+='");
      })
      .replace(c.rx.iterate || skip, function(m, rxMatch, iterateOn, vname, iname) {
        iterateOn=iterateOn && fixVarPath(iterateOn);
        vname = vname || 'value';
        if (!iterateOn) return "';}}).call(arr"+(sid--)+"item);} } out+='";
        sid+=1; indv=iname || "i"+sid;
        return "';var arr"+sid+"=(Array.isArray("+iterateOn+"))? [].slice.call("+iterateOn+") : "+iterateOn+";var arr"+sid+"Len=Object.keys(arr"+sid+").length; "
              +"if(arr"+sid+"Len){var arr"+sid+"item,"+vname+","+indv+"=-1,l"+sid+"=arr"+sid+"Len-1;while("+indv+"<l"+sid+"){"
              +"arr"+sid+"item=arr"+sid+"["+indv+"+=1];"
              +"(function (___p){"
              +"var ___this="+vname+"=this, ___index=___key="+(iname? (iname+'=') : '')+indv+";with(Object(this)){"
              +"out+='";
      })
      .replace(c.rx.interpolate || skip, function(m, code) {
        return cse.start + fixVarPath(code) + cse.end;
      })
      + "';return out;")
      .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
      .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");

    if (needhtmlencode) {
      if (!c.selfContained && _global && !_global._encodeHTML) _global._encodeHTML = nxT.encodeHTMLSource(c.doNotSkipEncoded);
      tmplFnStr = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
        + nxT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
        + tmplFnStr;
    }
    try {
      var compiledFn = new Function('_ctxObj_', ctxStrB+tmplFnStr+ctxStrE);
      // console.log('compiledFn:', compiledFn);
      return compiledFn;
    } catch (e) {
      if (typeof console !== "undefined") console.warn("Could not create a template function:", tmplFnStr);
      throw e;
    }
  }

  //nxT:        .compile  >> fnT( data )
  //Handlebars: .compile  >> fnT( data )
  //Mustache:   .compile  >> fnT( data )
  //dust:       .compile  >> fnT( data )
  //doT:        .compile  >> fnT( data )
  //ejs:        .compile  >> fnT( data )
  //Template7:  .compile  >> fnT( data )
  //nunjucks:   .compile  >> fnT.render( data )
  //_:          .template >> fnT( data )
  function getTmplType ( tmplStr ) {
    tmplStr = tmplStr.replace(/\s+/g, '');
    if (/[^a-z_0-9]/gi.test(tmplStr)) {
      return (/:[a-z_0-9]+$/i.test(tmplStr) && tmplStr.substring(tmplStr.lastIndexOf(':')+1)) || '';
    } else {
      return tmplStr;
    }
  }

  function render ( tmpl, data, target, replaceTarget ) {
    var usePreCompiledFn = true;
    var isElement = tmpl instanceof Element;
    var compiledFn;
    var tmplContent, elTmplSrc, tmplType;

    if (typeof tmpl == 'function') {
      compiledFn = tmpl;
    } else if (typeof tmpl == 'string' || isElement) {

      if (isElement) {
        elTmplSrc = tmpl;
        var newTmplId = ( elTmplSrc.getAttribute('id') || ('tmpl-'+(new Date).getTime()) );
        tmpl = '#'+newTmplId;
        elTmplSrc.setAttribute('id', newTmplId);
      }

      if (tmpl[0] == '#') { /* #template-container :Handlebars */

        if (!isElement) {
          tmpl = tmpl.replace(/\s+/g, '');
          tmplType = getTmplType(tmpl);
          if (tmplType) {
            tmpl = tmpl.substring(0, tmpl.lastIndexOf(':'));
          }
          elTmplSrc = document.querySelector(tmpl);
        }

        if (elTmplSrc) {
          usePreCompiledFn = !(elTmplSrc.hasAttribute('recompile') || /live/gi.test(elTmplSrc.getAttribute('type')||''));
          (usePreCompiledFn && elTmplSrc._render && (compiledFn = elTmplSrc._render));
          !target && (target = (elTmplSrc.getAttribute('target') || '').trim());
        }

        if (!compiledFn) {
          tmplType = tmplType || getTmplType((elTmplSrc && elTmplSrc.getAttribute('type')) || '');
          tmplContent = elTmplSrc? (elTmplSrc.value || elTmplSrc.innerHTML) : tmpl;
        }
      } else {
        // Xyz: template string ...
        var idxSplit = tmpl.indexOf(':');
        tmplType     = tmpl.substring(0, idxSplit).trim();
        tmplContent  = tmpl.substring(idxSplit+1);
      }

      tmplType = tmplType || 'nxT';
      if (tmplType) {
        try {
          if (!compiledFn && tmplType && _global[tmplType]) {
            var fnCompile = _global[tmplType]['compile'] || _global[tmplType]['template'];
            if (fnCompile) {
              if (tmplType === 'dust' && _global.dust) {
                var newDustTmplId = 'dust-'+(new Date).getTime();
                _global.dust.loadSource( fnCompile(tmplContent, newDustTmplId) );
                compiledFn = _global.dust.render.bind(_global.dust, newDustTmplId);
              } else {
                compiledFn = fnCompile(tmplContent);
                (compiledFn && compiledFn.render && (compiledFn = compiledFn.render.bind(compiledFn)));
              }
            } else if (_global[tmplType]['render']) {
              compiledFn = _global[tmplType]['render'].bind(_global[tmplType], tmplContent);
            }
          }
        } catch (e) {
          console.error('Template '+tmplType+'.compile failed:', e);
        }
      } else {
        console.error('Unknown Template Engine', tmpl);
        return;
      }
    } else {
      console.error('Invalid Template', tmpl);
      return;
    }

    if (typeof compiledFn != 'function') {
      console.error('Could not compile ['+tmplType+'] Template', tmpl);
      return;
    }

    (elTmplSrc && !elTmplSrc._render && (elTmplSrc._render = compiledFn));

    if (typeof data != 'object') {
      return compiledFn;
    }

    var processedTmpl;
    if (tmplType === 'dust') {
      compiledFn( data, function (err, out) {
        if (err) {
          console.error('Error in dust Template:', err);
        } else {
          processedTmpl = _render(target, out, replaceTarget);
        }
      } );
    } else {
      processedTmpl = _render(target, compiledFn( data ), replaceTarget);
    }

    return processedTmpl;
  }

  function _render (target, content, replaceTarget) {
    if (target) {
      var elTarget = target;
      if (typeof target == 'string') {
        target = target.trim();
        if (typeof replaceTarget === 'undefined') {
          replaceTarget = /:replace$/i.test(target);
        }
        target.replace(/:replace$/i,'').trim();
        elTarget = document.querySelector(target);
      }

      if (elTarget) {
        try {
          if (replaceTarget) {
            elTarget.outerHTML = content;
          } else {
            elTarget.innerHTML = content;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error('Invalid Target:', target);
      }
    }
    return content;
  }
}(this));