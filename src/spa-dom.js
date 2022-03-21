/*@license SPA.js (DOM Extension) [MIT]*/

;(function(_global){
  var version = '1.0.0';

  var _undef;
  var _glb             = _global;
  var _doc             = document;
  var _useSizzle       = !!_glb['Sizzle'];
  var _arrProto        = Array.prototype;
  var _objProto        = Object.prototype;
  var _rxFormElements  = /^(?:input|select|textarea|button)$/i;
  var _reservedObjKeys = 'hasOwnProperty,prototype,__proto__,isPrototypeOf'.split(',');

  // export to global
  (!_glb['dom'] && (_glb['dom'] = dQ));
  (!_glb['dQ'] && (_glb['dQ'] = dQ));

  function _qryElements ( selector, context ) {
    // console.log('_qryElements for:', selector, context);
    var _selector = selector;
    var _context  = context;
    var elements  = [];

    selector = _selector || '';
    context  = _context || _doc;
    try {
      if (context !== _doc) {
        context = _qryElements(context);
        if (context && context.length) {
          if (context.length === 1) {
            context = context[0] || null;
          }
        } else {
          context = null;
        }
      }

      if (selector instanceof DOMElements) {
        elements = selector;
      } else if (typeof selector === 'string') {
        selector = selector.trim();

        if (selector === 'document') {
          elements = [_doc];
        } else if (selector === 'window') {
          elements = [];
        } else {
          if (/^\s*</.test(selector)) {
            var dynEl = _doc.createElement('div');
            dynEl.id = 'dQvDOM'+(+(new Date()));
            dynEl.innerHTML = selector;
            for (var i=0; i<dynEl.childNodes.length; i++) {
              var child = dynEl.childNodes[i];
              if (child && child.nodeType == 1) {
                elements.push(child);
              }
            }
          } else if (context) {
            if (context.querySelectorAll) {
              // console.info('selecting in Context', selector, context);
              var nodes;
              // if (_useSizzle || (/[:!^$*]+/g.test(selector))) {
              if (_useSizzle) {
                nodes = Sizzle(selector, context);
                // console.log('>>>>>>using Sizzle:', nodes);
              } else {
                nodes = context.querySelectorAll(selector);
                // console.log('>>>>>>using querySelectorAll:', nodes);
              }
              if (nodes) {
                elements = [].slice.call(nodes);
              }
            } else if (context.length && context[0]) {
              for (var cElIdx=0; cElIdx<context.length; cElIdx++) {
                elements = elements.concat( _qryElements(selector, context[cElIdx]) );
              }
            } else {
              dQ.debug && console.warn('Unable to find elements in context', {selector: _selector , context: _context});
            }
          } else {
            dQ.debug && console.warn('Unable to find elements in context', {selector: _selector , context: _context});
          }
        }
      } else if (typeof selector === 'object' && selector.hasOwnProperty('length') && selector['splice']) {
        elements = selector;
      } else if (selector === _glb) {
        elements = [];
      } else {
        elements = (selector && [selector]) || [];
      }
    } catch ( e ) {
      dQ.debug && console.error('ERROR: Invalid Selector/Context', {selector: _selector , context: _context}, e);
    }

    (elements && elements['length'] && !elements[0] && (elements = []));
    // console.log('elements>>>:', elements);
    return elements;
  }

  function DOMElements ( selector, context ) {
    this.length   = 0;
    var elements = _qryElements(selector, context);
    try {
      if (elements && elements.length && elements[0]) {
        this.length = elements.length;
        for(var i=0;i<this.length;i++) {
          this[i] = elements[i];
        }
      }
    } catch (e) {}
  }
  var domElProto = DOMElements.prototype;
  // ----------------------------------------
  (function defineDOMElementsPrototypes(){

    domElProto.isDomQry     = true;
    domElProto.version      = version;
    domElProto.fn           = domElProto;
    domElProto.extend       = extendDomFn;
    // ---------Immutable Array Functions------
    domElProto.splice       = noop;
    domElProto.slice        = _arrProto.slice;
    domElProto.every        = _arrProto.every;
    domElProto.some         = _arrProto.some;

    domElProto.each         = each;
    domElProto.forEach      = forEach;
    domElProto.map          = map;
    domElProto.mapEach      = mapEach;
    domElProto.mapEachEl    = mapEachEl;

    domElProto.has          = has;
    domElProto.find         = find;
    domElProto.filter       = filter;
    domElProto.filterEach   = filterEach;
    domElProto.filterEachEl = filterEachEl;
    // ----------------------------------------
    domElProto.addClass     = addClass;
    domElProto.removeClass  = removeClass;
    domElProto.toggleClass  = toggleClass;
    domElProto.hasClass     = hasClass;

    domElProto.show         = show;
    domElProto.hide         = hide;
    domElProto.toggle       = toggle;

    domElProto.is           = isProp;
    domElProto.prop         = prop;
    domElProto.hasAttr      = function hasAttr ( attrName ) { return this.prop(attrName); };

    domElProto.attr         = attr;
    domElProto.removeAttr   = function removeAttr (attrName) { return this.attr( attrName, null ); };

    domElProto.id           = function elsId     ( newValue ) { return this.attr('id',    newValue); };
    domElProto.name         = function elsName   ( newValue ) { return this.attr('name',  newValue); };
    domElProto.value        = function elsValue  ( newValue ) { return this.attr('value', newValue); };
    domElProto.class        = function elsClass  ( newValue ) { return this.attr('class', newValue); };
    domElProto.style        = function elsStyle  ( newValue ) { return this.attr('style', newValue); };

    domElProto.enable       = function () { return this.prop('disabled', false); };
    domElProto.disable      = function () { return this.prop('disabled', true); };
    domElProto.isEnabled    = function () { return this.is(':enabled'); };
    domElProto.isDisabled   = function () { return this.is(':disabled'); };
    domElProto.select       = selectEl;
    domElProto.focus        = focusEl;

    domElProto.html         = function ( newValue ) { return _elsHtmlText.call(this, 'innerHTML', newValue); };
    domElProto.text         = function ( newValue ) { return _elsHtmlText.call(this, 'innerText', newValue); };

    domElProto.val          = val;
    domElProto.css          = css;
    domElProto.data         = dataAttr;

    domElProto.remove       = remove;
    domElProto.append       = append;
    domElProto.prepend      = prepend;
    domElProto.appendTo     = appendTo;
    domElProto.prependTo    = prependTo;
    domElProto.insertBefore = insertBefore;
    domElProto.insertAfter  = insertAfter;

    domElProto.toArray      = toNativeArray;
    domElProto.get          = get;
    domElProto.first        = first;
    domElProto.last         = last;
    domElProto.nth          = nth;
    domElProto.odd          = odd;
    domElProto.even         = even;

    domElProto.parent       = parent;
    domElProto.children     = children;
    domElProto.closest      = closest;
    domElProto.siblings     = siblings;
    domElProto.siblingsPrev = siblingsPrev;
    domElProto.siblingsNext = siblingsNext;
    domElProto.prevSiblings = siblingsPrev;
    domElProto.nextSiblings = siblingsNext;
    domElProto.prevAll      = siblingsPrev;
    domElProto.nextAll      = siblingsNext;
    domElProto.prev         = prev;
    domElProto.next         = next;

    domElProto.ready        = onReady;
    domElProto.trigger      = trigger;
    domElProto.on           = on;
    domElProto.off          = off;
  })();

  // ========================================
  function init ( selector, context ) {
    if (selector instanceof DOMElements) return selector;
    if (typeof selector === 'function') {
      onReady(selector);
    } else {
      return new DOMElements(selector, context);
    }
  }
  function dQ ( selector, context ) {
    return init(selector, context);
  }
  (function defineDomPrototypes(){
    dQ.fn        = domElProto;
    dQ.isDomQry  = true;
    dQ.version   = version;
    dQ.debug     = false;
    dQ.ready     = onReady;
    dQ.onReady   = onReady;
    dQ.prop      = domElProp;
  })();

  // ========================================
  function noop () {
    return this;
  }
  function rTypeOf ( x , matchTypes ) {
    var realType = Object.prototype.toString.call(x).slice(8,-1).toLowerCase();
    if (matchTypes) {
      return (('|'+matchTypes).toLowerCase().indexOf(realType) > 0);
    } else {
      return realType;
    }
  }
  function toArray ( x ) {
    return _arrProto.slice.call(x);
  }

  function _isReservedKey ( key ) {
    return (_reservedObjKeys.indexOf(key) > -1);
  }
  function _hasOwnProp ( xObj, xKey ) {
    return _objProto.hasOwnProperty.call(xObj, xKey);
  }
  function _isProto ( obj ) {
    return (((typeof obj == 'object') &&
        ( (obj == window.__proto__) ||
          _hasOwnProp(obj, 'isPrototypeOf') ||
          obj.isPrototypeOf(new Object()) ||
          obj.isPrototypeOf(new Array()) ||
          obj.isPrototypeOf(new Function()) ||
          obj.isPrototypeOf(new String()) ||
          obj.isPrototypeOf(new Number()) ||
          obj.isPrototypeOf(new Boolean()) ||
          obj.isPrototypeOf(new Date()) ||
          obj.isPrototypeOf(new RegExp()) ||
          obj.isPrototypeOf(new DOMElements())
        )));
  }
  function _isSafeKey (obj, key) {
    return !(_isReservedKey(key) || (key === 'constructor' && _isFn(obj[key])));
  }

  // ========================================
  function extendDomFn ( obj, force ) {
    if (obj) {
      if (_isProto(obj)) {
        dQ.debug && console.warn('Ignored invalid dom.extensions:', obj);
      } else {
        if (rTypeOf(obj) === 'object') {
          Object.keys(obj).forEach(function(key){
            if (_isSafeKey(obj, key)) {
              if (_hasOwnProp(domElProto, key) && !force) {
                dQ.debug && console.warn('Ignored duplicate dom.extension:', key, obj[key]);
              } else {
                domElProto[key] = obj[key];
              }
            } else {
              dQ.debug && console.warn('Ignored invalid dom.extension:', key, obj[key]);
            }
          });
        } else {
          dQ.debug && console.warn('Ignored invalid dom.extensions:', obj);
        }
      }
    }
  }

  // ========================================
  function each ( fn ) {
    if (typeof fn !== 'function') return toArray(this);
    for (var i = 0; i < this.length ; i++) {
      fn.call(this[i], i, this[i]);
    }
    return this;
  }
  function map ( fn ) {
    if (typeof fn !== 'function') return toArray(this);
    var rValue = [];
    for (var i = 0; i < this.length ; i++) {
      rValue = rValue.concat(fn.call(this[i], i, this[i]));
    }
    return dQ(rValue);
  }
  function mapEachEl ( fn ) {
    if (typeof fn !== 'function') return toArray(this);
    var rValue = [];
    for (var i = 0; i < this.length ; i++) {
      rValue = rValue.concat(fn.call(this[i], this[i], i));
    }
    return rValue;
  }
  function mapEach ( fn ) {
    if (typeof fn !== 'function') return toArray(this);
    return dQ( this.mapEachEl(fn) );
  }
  function forEach ( fn ) {
    if (typeof fn !== 'function') return toArray(this);
    for (var i = 0; i < this.length ; i++) {
      fn.call(this[i], this[i], i);
    }
    return this;
  }

  function find ( selector ) {
    return dQ(selector, this);
  }
  function filter ( selector ) {
    var filteredItems = [];
    if (typeof selector === 'string') {
      for (var i=0; i<this.length; i++) {
        if (this[i].matches( selector )) filteredItems = filteredItems.concat(this[i]);
      }
    } else if (typeof selector === 'function') {
      for (var i=0; i<this.length; i++) {
        if (selector.call(this[i], i, this[i])) filteredItems = filteredItems.concat(this[i]);
      }
    }
    return dQ(filteredItems);
  }
  function filterEachEl ( selector ) {
    var filteredItems = [];
    if (typeof selector === 'string') {
      for (var i=0; i<this.length; i++) {
        if (this[i].matches( selector )) filteredItems = filteredItems.concat(this[i]);
      }
    } else if (typeof selector === 'function') {
      for (var i=0; i<this.length; i++) {
        if (selector.call(this[i], this[i], i)) filteredItems = filteredItems.concat(this[i]);
      }
    }
    return filteredItems;
  }
  function filterEach ( selector ) {
    return dQ(this.filterEachEl(selector));
  }
  function has ( selector ) {
    var filteredItems = [];
    if (typeof selector === 'string') {
      for (var i=0; i<this.length; i++) {
        if (this[i].querySelector( selector )) filteredItems = filteredItems.concat(this[i]);
      }
    }
    return dQ(filteredItems);
  }
  // ========================================
  function _getFinalClassNames ( classNames, state ) {
    var xClassNames = [];

    if (typeof classNames === 'function') {
      var classNamesFromFn = '', fnRes, fnResType;
      this.forEach(function(el, idx){
        fnRes = classNames.call(el, idx, el.getAttribute('class'), state);
        fnResType = typeof fnRes;
        if (fnResType === 'string') {
          classNamesFromFn += ' '+fnRes;
        } else if (fnResType === 'array') {
          classNamesFromFn += ' '+(fnRes.join(' '));
        }
      });
      classNames = classNamesFromFn.trim();
    } else if (Array.isArray(classNames)) {
      classNames = classNames.join(' ');
    }

    if (typeof classNames === 'string') {
      classNames.replace(/[.,]/g,' ').split(' ').forEach(function(className){
        className = (className||'').trim();
        (className && xClassNames.push(className));
      });
    }
    return xClassNames;
  }

  function _AddRemClass ( operation, classNames ) {
    var xClassNames = _getFinalClassNames.call(this, classNames);
    if (xClassNames.length) {
      this.forEach(function(el){
        xClassNames.forEach(function(className){
          el.classList[operation](className);
        });
      });
    }
    return this;
  }
  function addClass ( classNames ) {
    return _AddRemClass.call(this, 'add', classNames);
  }
  function removeClass ( classNames) {
    return _AddRemClass.call(this, 'remove', classNames);
  }
  function toggleClass ( classNames, state ) {
    var xClassNames = _getFinalClassNames.call(this, classNames);
    if (xClassNames.length) {
      var operation = (state === _undef)? 'toggle' : (state? 'add' : 'remove');
      this.forEach(function(el){
        xClassNames.forEach(function(className){
          el.classList[operation](className);
        });
      });
    }
    return this;
  }
  function hasClass ( classNames ) {
    var classNames = _getFinalClassNames.call(this, classNames);
    if (classNames.length) {
      return this.every(function(el){
        return classNames.every(function(className){
          return el.classList.contains(className);
        });
      });
    }
  }

  // --------------------------------------------
  function show () {
    var mode = arguments[0] || 'block';
    this.forEach(function(el){
      el.style.display = mode;
    });
  }
  function hide () {
    this.forEach(function(el){
      el.style.display = 'none';
    });
  }
  function toggle ( displayType ) {
    this.forEach(function(el){
      var elCurDisplay = (getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;
      if (elCurDisplay == 'none') {
        el.style.display = (displayType || el.prevDisplayType || 'inline');
      } else {
        el.prevDisplayType = elCurDisplay;
        el.style.display   = 'none';
      }
    });
  }
  // --------------------------------------------
  function _isFormEl ( el ) {
    return _rxFormElements.test( el.nodeName );
  }
  function isClickable (el) {
    var clickable = !el.hasAttribute('disabled');
    var isFormEl = _isFormEl(el);
    if (!isFormEl || clickable) {
      try {
        var cssProps = getComputedStyle(el);
        clickable = (cssProps && !(cssProps['pointer-events'] === 'none' || cssProps['touch-action'] === 'none' ))
      } catch (e) {}
    }

    return clickable;
  }

  function domElProp ( selector, property ) {
    var retValue = dQ(selector).mapEachEl(function(el){
      return el[property];
    });
    (retValue.length === 1) && (retValue = retValue[0]);
    return retValue;
  }
  function attr ( attrName, newValue ) {
    var retValue = this;
    if (this.length) {
      var typeOfAttrName = rTypeOf(attrName);
      if (attrName === _undef) {
        retValue = this.mapEachEl(function(el){
          var eAttrs = {};
          _arrProto.slice.call(el.attributes).forEach(function(eAttr){
            eAttrs[eAttr.name] = eAttr.value;
          });
          return eAttrs;
        });
        (retValue.length === 1) && (retValue = retValue[0]);
      } else if (typeOfAttrName === 'object') {
        this.forEach(function(el){
          Object.keys(attrName).forEach(function(aKey){
            if (attrName[aKey] === null) {
              el.removeAttribute(aKey);
            } else {
              el.setAttribute(aKey, attrName[aKey]);
            }
          });
        });
        retValue = this;
      } else if (typeOfAttrName === 'string') {
        if (newValue === _undef) {
          retValue = this.mapEachEl(function(el){ return el.getAttribute(attrName); });
          (retValue.length === 1) && (retValue = retValue[0]);
        } else {
          if (newValue === null) {
            this.forEach(function(el){ el.removeAttribute(attrName); });
          } else {
            this.forEach(function(el){ el.setAttribute(attrName, newValue); });
          }
          retValue = this;
        }
      } else if (typeOfAttrName === 'array') {
        if (newValue === _undef) {
          retValue = this.mapEachEl(function(el){
            var rAttrObj = {};
            attrName.forEach(function(aName) {
              rAttrObj[aName] = el.getAttribute(aName);
            });
            return rAttrObj;
          });
          (retValue.length === 1) && (retValue = retValue[0]);
        } else {
          if (newValue === null) {
            this.forEach(function(el){
              attrName.forEach(function(aName) { el.removeAttribute(aName); });
            });
          } else {
            this.forEach(function(el){
              attrName.forEach(function(aName) { el.setAttribute(aName, newValue); });
            });
          }

          retValue = this;
        }
      } else {
        dQ.debug && console.warn('Invalid attribute');
      }
    }
    return retValue;
  }
  function prop ( propName, propValue ) {
    if (!this.length) { //no source elements
      return (arguments.length === 2)? this : false;
    };
    var retValue = this;
    propName = propName.trim();
    if (propName) {
      if (arguments.length === 2) {
        this.forEach(function(el){
          if (propValue) {
            el.setAttribute(propName, '');
            if (propName === 'disabled' && !_isFormEl(el)) {
              el.classList.add("disabled");
            }
          } else {
            el.removeAttribute(propName);
            if (propName === 'disabled' && !_isFormEl(el)) {
              el.classList.remove("disabled");
            }
          }
        });
      } else {
        retValue = this.mapEachEl(function(el){
          if (propName === 'disabled') {
            return !isClickable(el) || el.hasAttribute(propName);
          } else if (propName === 'checked' || propName === 'selected') {
            return el[propName] || el.hasAttribute(propName);
          } else {
            return el.getAttribute(propName);
          }
        });
        (retValue.length === 1) && (retValue = retValue[0]);
      }
    }
    return retValue;
  }
  function isProp ( matchSpecs ) {
    if (!(this.length && arguments.length)) { return false; };
    var retValue = this;

    var matchList = [];
    (''+matchSpecs).replace(/,/g,' ').split(' ').forEach(function(matchSpec){
      matchSpec = (matchSpec||'').trim();
      (matchSpec && matchList.push(matchSpec));
    });

    if (matchList.length) {
      retValue = this.every(function(el){
        return matchList.every(function(attrName){
          var retV;
          switch (attrName.toLowerCase()) {
            case ':disabled':
              retV = !isClickable(el); break;
            case ':enabled' :
              retV = isClickable(el); break;
            case ':checked' :
            case ':selected':
              retV = (el.hasAttribute('checked') || el.hasAttribute('selected')); break;
            case ':visible':
              retV = !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length ); break;
            case ':hidden':
              retV = !( el.offsetWidth || el.offsetHeight || el.getClientRects().length ); break;
            default:
              retV = el.matches(attrName); break;
          }
          return retV;
        });
      });
    }
    return retValue;
  }

  // --------------------------------------------
  function selectEl () {
    if (this.length) {
      this[0].select();
    }
    return this;
  }
  function focusEl () {
    if (this.length) {
      this[0].focus();
    }
    return this;
  }
  // --------------------------------------------

  function _elsHtmlText ( rValue, newValue ) {
    var retV = '';
    if (this.length) {
      if (newValue === _undef) {
        if (this.length === 1) {
          retV = this[0][rValue];
        } else {
          retV = this.mapEachEl(function(el){ return el[rValue]; });
        }
      } else {
        var newV, isFn = (typeof newValue === 'function');
        this.forEach(function(el){
          newV = isFn? newValue.call(el, el[rValue]) : newValue;
          el[rValue] = (newV === _undef)? '' : (''+newV);
        });
        retV = this;
      }
    }
    return retV;
  }

  function getElVal ( el ) {
    if (el.options) {
      if (el.size) {
        var rValues = [];
        var elOptions = el.selectedOptions || el.options;
        for(var i=0, len=elOptions.length;i<len;i++){
          elOptions[i].selected && rValues.push( elOptions[i].value );
        }
        return rValues;
      } else {
        return el.options[el.selectedIndex].value;
      }
    } else {
      return el.value;
    }
  }
  function setElVal ( el, newValue ) {
    newValue = (newValue === _undef)? '' : newValue;

    switch ((el.tagName).toUpperCase()) {
      case "INPUT":
        switch ((el.type).toLowerCase()) {
          case "checkbox":
          case "radio":
            el.checked = (Array.isArray(newValue)? (newValue.indexOf(el.value) > -1) : (el.value == newValue));
            (!el.checked) && el.removeAttribute('checked');
            break;

          default:
            el.value = newValue;
            break;
        }
        break;

      case "SELECT":
        var elOptions = el.options;
        for(var i=0, len=elOptions.length;i<len;i++){
          elOptions[i].selected = (Array.isArray(newValue)? (newValue.indexOf(elOptions[i].value) > -1) : (elOptions[i].value == newValue));
          (!elOptions[i].selected) && elOptions[i].removeAttribute('selected');
        }
        break;

      case "TEXTAREA":
        el.value = newValue;
        break;
    }
  }
  function val ( newValue ) {
    var retV = '';
    if (this.length) {
      if (newValue === _undef) {
        if (this.length === 1) {
          retV = getElVal(this[0]);
        } else {
          retV = this.mapEachEl(function(el){ return getElVal(el); });
        }
      } else {
        var newV, isFn = (typeof newValue === 'function');
        this.forEach(function(el, idx){
          newV = isFn? newValue.call(el, getElVal(el), idx) : newValue;
          setElVal(el, newV);
        });
        retV = this;
      }
    }
    return retV;
  }
  // --------------------------------------------
  function css ( propName, newValue ) {
    var retValue;
    if (this.length) {
      var typeOfPropName = rTypeOf(propName);

      if (propName === _undef) {
        retValue = this.mapEachEl(function(el){
          var eCSS = getComputedStyle(el);
          var eAttrs = {length: eCSS.length};
          _arrProto.slice.call(eCSS).forEach(function(propName){
            eAttrs[propName] = eCSS[propName];
          });
          return eAttrs;
        });
        (retValue.length === 1) && (retValue = retValue[0]);
      } else if (typeOfPropName === 'object') {
        this.forEach(function(el){
          Object.keys(propName).forEach(function(pKey){
            if (propName[pKey] === null || propName[pKey] === 'unset') {
              el.style.removeProperty(pKey);
            } else {
              if (propName[pKey].indexOf('important') < -1) {
                el.style.setProperty(pKey, propName[pKey]);
              } else {
                el.style.setProperty(pKey, propName[pKey].replace(/!?important/gi,'').trim(), 'important');
              }
            }
          });
        });
        retValue = this;
      } else if (typeOfPropName === 'string') {
        if (newValue === _undef) {
          retValue = this.mapEachEl(function(el){ return getComputedStyle(el)[propName]; });
          (retValue.length === 1) && (retValue = retValue[0]);
        } else {
          if (newValue === null || newValue === 'unset') {
            this.forEach(function(el){ el.style.removeProperty(propName); });
          } else {
            var isPriority = (newValue.indexOf('important') > 0)? 'important' : '';
            var propValue  = isPriority? (newValue.replace(/!?important/gi,'').trim()) : newValue;
            this.forEach(function(el){ el.style.setProperty(propName, propValue, isPriority); });
          }
          retValue = this;
        }
      } else if (typeOfPropName === 'array') {
        if (newValue === _undef) {
          retValue = this.mapEachEl(function(el){
            var eCSS = getComputedStyle(el);
            var oOut = {};
            propName.forEach(function(pName){
              oOut[pName] = eCSS[pName];
            });
            return oOut;
          });
          (retValue.length === 1) && (retValue = retValue[0]);
        } else {
          if (newValue === null || newValue === 'unset') {
            this.forEach(function(el){
              propName.forEach(function(pName){
                el.style.removeProperty(pName);
              });
            });
          } else {
            var isPriority = (newValue.indexOf('important') > 0)? 'important' : '';
            var propValue  = isPriority? (newValue.replace(/!?important/gi,'').trim()) : newValue;
            this.forEach(function(el){
              propName.forEach(function(pName){
                el.style.setProperty(pName, propValue, isPriority);
              });
            });
          }
          retValue = this;
        }
      } else {
        dQ.debug &&  console.warn('Invalid CSS property');
      }
    }
    return retValue;
  }

  // --------------------------------------------
  function elDataStore(el, key, newValue) {
    var rValue = el['dataStore'];
    (typeof rValue !== 'object') && (rValue = {});

    var elDataAttrSet = el.dataset;
    var elDataAttrObj = {};
    if (typeof elDataAttrSet === 'object') {
      Object.keys(elDataAttrSet).forEach(function (key) {
        elDataAttrObj[key] = elDataAttrSet[key];
      });
    }
    Object.keys(elDataAttrObj).forEach(function (key) {
      (!rValue.hasOwnProperty(key)) && (rValue[key] = elDataAttrObj[key]);
    });

    var typeOfKey = rTypeOf(key);
    if ((typeOfKey === 'object') || (arguments.length === 3 && (typeOfKey === 'string' || typeOfKey === 'array'))) {
      if (typeOfKey === 'array') {
        key.forEach(function(dKey){
          rValue[dKey] = newValue;
        });
      } else {
        var srcObj = (typeOfKey === 'object')? key : {};
        (typeOfKey === 'string') && (arguments.length === 3) && (srcObj[key] = newValue);
        Object.keys(srcObj).forEach(function(dKey){
          rValue[dKey] = srcObj[dKey];
        });
      }
    }

    console.groupEnd('elDataStore');
    el['dataStore'] = rValue;
    return (key && arguments.length === 2)? rValue[key] : rValue;
  }
  function dataAttr ( propName, newValue ) {
    var retValue = {};
    if (this.length) {
      var reqToUpdate = arguments.length === 2;
      var typeOfPropName = rTypeOf(propName);
      if (propName === _undef) {
        retValue = this.mapEachEl(function(el){
          return elDataStore(el);
        });
        (retValue.length === 1) && (retValue = retValue[0]);
      } else if (typeOfPropName === 'string') {
        if (reqToUpdate) {
          this.forEach(function(el){
            elDataStore(el, propName, newValue);
          });
          retValue = this;
        } else {
          retValue = this.mapEachEl(function(el){ return elDataStore(el, propName); });
          (retValue.length === 1) && (retValue = retValue[0]);
        }
      } else if (typeOfPropName === 'object') {
        this.forEach(function(el){
          elDataStore(el, propName);
        });
        retValue = this;
      } else if (typeOfPropName === 'array') {
        if (newValue === _undef) {
          retValue = this.mapEachEl(function(el){
            var eData = elDataStore(el);
            var oOut = {};
            propName.forEach(function(dKey){
              oOut[dKey] = eData[dKey];
            });
            return oOut;
          });
          (retValue.length === 1) && (retValue = retValue[0]);
        } else {
          this.forEach(function(el){
            elDataStore(el, propName, newValue);
          });
          retValue = this;
        }
      } else {
        dQ.debug && console.warn('Invalid data attribute');
      }
    }
    return retValue;
  }

  // --------------------------------------------
  function remove ( selector ) {
    if (typeof selector === 'string') {
      for (var i=0; i<this.length; i++) {
        if (this[i].matches( selector )) this[i].remove();
      }
    } else if (typeof selector === 'function') {
      for (var i=0; i<this.length; i++) {
        if (selector.call(this[i], this[i], i)) this[i].remove();
      }
    }
  }
  function append ( child ) {
    if (this.length) {
      var childEls = dQ(child);
      this.forEach(function(pEl){
        childEls.forEach(function(cEl){
          pEl.append(cEl);
        });
      });
    }
    return this;
  }
  function prepend ( child ) {
    if (this.length) {
      var childEls = dQ(child);
      this.forEach(function(pEl){
        for(var c=childEls.length-1; c>-1;c--) {
          pEl.prepend(childEls[c]);
        }
      });
    }
    return this;
  }

  function appendTo ( target ) {
    dQ(target).append(this);
    return this;
  }
  function prependTo ( target ) {
    dQ(target).prepend(this);
    return this;
  }

  function insertBefore ( target ) {
    var elements = this;
    dQ(target).forEach(function(refEl){
      for(var i=0, len=elements.length; i<len; i++){
        refEl.parentNode.insertBefore(elements[i], refEl);
      };
    });
    return this;
  }
  function insertAfter ( target ) {
    var elements = this;
    dQ(target).forEach(function(refEl){
      for(var i=elements.length-1; i>-1; i--){
        refEl.parentNode.insertBefore(elements[i], refEl.nextSibling || null);
      }
    });
    return this;
  }

  // --------------------------------------------
  function toNativeArray() {
    return toArray(this);
  }
  function get ( idx ) {
    return (idx === _undef)? toArray(this) : this[idx]
  }
  function first () {
    return dQ((this.length && this[0]) || []);
  }
  function last () {
    return dQ((this.length && this[this.length-1]) || []);
  }
  function nth ( idx ) {
    return dQ((this.length && idx >-1 && idx < this.length && this[idx]) || []);
  }
  function odd () {
    var rValue = []
    for(var idx=0; idx<this.length; idx++) {
      (idx%2) && rValue.push(this[idx]);
    }
    return dQ(rValue);
  }
  function even () {
    var rValue = []
    for(var idx=0; idx<this.length; idx++) {
      (!(idx%2)) && rValue.push(this[idx]);
    }
    return dQ(rValue);
  }

  function parent ( selector ) {
    var rValue = [];
    if (selector) {
      var typeOfSelector = typeof selector;
      if (typeOfSelector === 'string') {
        for (var i=0; i<this.length; i++) {
          (this[i].parentNode.matches(selector)) && rValue.push(this[i].parentNode);
        }
      } else if (typeOfSelector === 'function') {
        for (var i=0; i<this.length; i++) {
          (selector.call(this[i].parentNode, this[i].parentNode, i)) && rValue.push(this[i].parentNode);
        }
      } else {
        var eMatches = dQ(selector);
        this.forEach(function(el){
          eMatches.forEach(function(eMatch){
            (el.parentNode === eMatch) && rValue.push(el.parentNode);
          });
        });
      }
    } else {
      for (var i=0; i<this.length; i++) {
        rValue.push(this[i].parentNode);
      }
    }
    return dQ(rValue);
  }

  function elChildren ( el ) {
    return el.childElementCount? toArray(el.children) : [];
  }
  function children ( filter ) {
    var rValue = [];
    if (filter) {
      var typeOfFilter = typeof filter;
      if (typeOfFilter === 'string') {
        for (var i=0; i<this.length; i++) {
          elChildren(this[i]).forEach(function(child){
            child.matches(filter) && rValue.push(child);
          });
        }
      } else if (typeOfFilter === 'function') {
        for (var i=0; i<this.length; i++) {
          for (var i=0; i<this.length; i++) {
            elChildren(this[i]).forEach(function(child){
              (filter.call(child, child, i)) && rValue.push(child);
            });
          }
        }
      } else {
        var eMatches = dQ(filter);
        this.forEach(function(el){
          elChildren(el).forEach(function(child){
            eMatches.forEach(function(eMatch){
              (child === eMatch) && rValue.push(child);
            });
          });
        });
      }
    } else {
      for (var i=0; i<this.length; i++) {
        rValue = rValue.concat(elChildren(this[i]));
      }
    }
    return dQ(rValue);
  }

  function closest ( selector ) {
    var rValue = [];
    if (this.length && selector && typeof selector === 'string') {
      var eClosest;
      for (var i=0; i<this.length; i++) {
        eClosest = this[i] && this[i].closest && this[i].closest(selector);
        eClosest && rValue.push(eClosest);
      }
    }
    return dQ(rValue);
  }

  function elSiblings ( el, dir, filter ) {
    var siblings = [];
    if (el.parentNode) {
      var typeOfFilter = typeof filter, isMatch;
      var sibling  = (dir)? el[dir] : el.parentNode.firstChild;
      dir = dir || 'nextSibling';
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== el) {
          isMatch = (!filter) || ((typeOfFilter === 'string') && (sibling.matches(filter))) || ((typeOfFilter === 'function') && (filter.call(sibling, sibling)));
          isMatch && siblings.push(sibling);
        }
        sibling = sibling[dir];
      }
    }
    return siblings;
  }
  function domSiblings ( dir, filter ) {
    var rValue = [];
    if (rTypeOf(filter, 'undefined|string|function')) {
      for (var i=0; i<this.length; i++) {
        rValue = rValue.concat(elSiblings(this[i], dir, filter));
      }
    } else {
      var eMatches = dQ(filter);
      this.forEach(function(el){
        elSiblings(el, dir).forEach(function(sibling){
          eMatches.forEach(function(eMatch){
            (sibling === eMatch) && rValue.push(sibling);
          });
        });
      });
    }
    return dQ(rValue);
  }
  function siblings ( filter ) {
    return domSiblings.call(this, '', filter);
  }
  function siblingsPrev ( filter ) {
    return domSiblings.call(this, 'previousSibling', filter);
  }
  function siblingsNext ( filter ) {
    return domSiblings.call(this, 'nextSibling', filter);
  }

  function elSibling ( el, dir, filter ) {
    var siblings = [];
    if (el.parentNode) {
      var typeOfFilter = typeof filter, isMatch;
      var sibling  = el[dir];
      while (!isMatch && sibling) {
        if (sibling.nodeType === 1) {
          isMatch = (!filter) || ((typeOfFilter === 'string') && (sibling.matches(filter))) || ((typeOfFilter === 'function') && (filter.call(sibling, sibling)));
          isMatch && siblings.push(sibling);
        }
        sibling = sibling[dir];
      }
    }
    return siblings;
  }
  function domSibling ( dir, filter ) {
    var rValue = [];
    if (rTypeOf(filter, 'undefined|string|function')) {
      for (var i=0; i<this.length; i++) {
        rValue = rValue.concat(elSibling(this[i], dir, filter));
      }
    } else {
      var eMatches = dQ(filter);
      this.forEach(function(el){
        elSibling(el, dir).forEach(function(sibling){
          eMatches.forEach(function(eMatch){
            (sibling === eMatch) && rValue.push(sibling);
          });
        });
      });
    }
    return dQ(rValue);
  }
  function prev ( filter ) {
    return domSibling.call(this, 'previousSibling', filter);
  }
  function next ( filter ) {
    return domSibling.call(this, 'nextSibling', filter);
  }

  // --------------------------------------------
  function onReady( onReadyFn ){
    if (typeof onReadyFn === 'function') {
      setTimeout(function () {
        if ( (_doc.readyState === 'complete') || (!(_doc.readyState === 'loading' || _doc.documentElement.doScroll)) ) {
          onReadyFn();
        } else {
          _doc.addEventListener('DOMContentLoaded', onReadyFn);
        }
      });
    }
  }

  function triggerEventOnEl ( el, eventType, bubble, eData ) {
    eventType = (''+eventType).trim();
    bubble = (bubble === undefined) || bubble;
    var xEvent, isCustomEvent = (eData || /[^a-z]/gi.test(eventType));
    try {
      if (isCustomEvent) {
        xEvent = document.createEvent(eventType);
        xEvent.initEvent(eventType, bubble, false, {data: eData});
      } else {
        xEvent = new Event(eventType, {bubbles: bubble, cancelable: false});
      }
    } catch (e) {
      xEvent = document.createEvent('HTMLEvents');
      xEvent.initEvent(eventType, bubble, false);
    }
    if (xEvent) {
      el.dispatchEvent(xEvent);
    } else {
      dQ.debug && console.warn('Unable to create and trigger event:', eventType);
    }
  }

  /**
   * dom().trigger('click');
   * dom().trigger('focus click');
   * dom().trigger('click', false); //bubble:false
   * dom().trigger('custom-event', {key1: value1, key2: value2});
   *
   */
  function trigger ( ) {
    if (this.length) {
      var eventTypes, bubble, eData;
      toArray(arguments).forEach(function(arg){
        var argType = typeof arg;
        if (argType === 'string') {
          eventTypes = arg;
        } else if (argType === 'boolean') {
          eventTypes = arg;
        } else {
          eData = arg;
        }
      });

      eventTypes = (''+eventTypes).replace(/,/g,' ').replace(/\s+/g,' ').trim().split(' ');
      for(var i=0; i<this.length; i++) {
        for(var e=0; e<eventTypes.length; e++) {
          triggerEventOnEl(this[i], eventTypes[e], bubble, eData);
        }
      }
    }
  }

  /**
   * addEvent(strEventTypes, strMatchSelector, fn)
   */
  var defAnonymousFnName = '___ANONYMOUS_FN___';
  function domEvent ( mode, strEventTypes, strMatchSelector, fn ) {
    if (this.length) {
      var args = toArray(arguments);
      var eKey       = args.shift();
      var eventTypes = args.shift();
      var matchSelector, eFn;
      args.forEach(function(arg){
        var argType = typeof arg;
        if (argType === 'function') {
          eFn = arg;
        } else if (argType === 'string') {
          matchSelector = arg;
        }
      });
      var eFnName = (eFn && eFn.name) || defAnonymousFnName;

      function addEvent (el, eventType) {
        el.domEvents = el.domEvents || {};
        el.domEvents[eventType] = el.domEvents[eventType] || {};

        if (matchSelector) {
          el.domEvents[eventType][matchSelector] = el.domEvents[eventType][matchSelector] || {};

          if ((eFnName === defAnonymousFnName) || (!el.domEvents[eventType][matchSelector][eFnName])) {
            el.domEvents[eventType][matchSelector][eFnName] = true;

            function domEventFn (event) {
              var elParent       = el;
              var targetSelector = matchSelector;
              var targetEl       = event.target;
              var eHandler       = eFn;
              var eHandlerName   = eHandler.name || defAnonymousFnName;
              if (elParent.domEvents &&
                  elParent.domEvents[event.type] &&
                  elParent.domEvents[event.type][targetSelector] &&
                  elParent.domEvents[event.type][targetSelector][eHandlerName]) {
                while (targetEl && targetEl !== this) {
                  if (targetEl.matches(targetSelector)) {
                    eHandler.call(targetEl, event);
                  }
                  targetEl = targetEl.parentNode;
                }
              }
            }
            el.addEventListener(eventType, domEventFn, false);
          } else {
            dQ.debug && console.error('Event already registered. Ignored event registration.', {el:el, event: eventType, fn: eFn});
          }

        } else {
          el.domEvents[eventType]['fn'] = el.domEvents[eventType]['fn'] || {};
          if ((eFnName === defAnonymousFnName) || (!el.domEvents[eventType]['fn'][eFnName])) {
            if (eFnName === defAnonymousFnName) {
              el.domEvents[eventType]['fn'][eFnName] = el.domEvents[eventType]['fn'][eFnName] || [];
              el.domEvents[eventType]['fn'][eFnName].push(eFn);
            } else {
              el.domEvents[eventType]['fn'][eFnName] = eFn;
            };
            el.addEventListener(eventType, eFn, false);
          } else {
            dQ.debug && console.error('Event already registered. Ignored event registration.', {el:el, event: eventType, fn: eFn});
          }
        }
      }
      function remEvent (el, eventType) {
        el.domEvents = el.domEvents || {};
        if (matchSelector) {
          if (el.domEvents[eventType]) {
            if (eFn) {
              if (eFn.name) {
                delete el.domEvents[eventType][matchSelector][eFn.name];
              } else {
                dQ.debug && console.warn('Unable to remove anonymous event listener');
              }
            } else {
              delete el.domEvents[eventType][matchSelector];
            }
          }
        } else {
          if (eFn) {
            el.removeEventListener(eventType, eFn, false);
          } else {
            var fnCollection = el.domEvents[eventType] && el.domEvents[eventType]['fn'];
            if (fnCollection) {
              Object.keys(fnCollection).forEach(function(key){
                if (key === defAnonymousFnName) {
                  if (Array.isArray(fnCollection[key])) {
                    fnCollection[key].forEach(function(fn){
                      el.removeEventListener(eventType, fn, false);
                    });
                  }
                } else {
                  el.removeEventListener(eventType, fnCollection[key], false);
                }
              });
            }
            delete el.domEvents[eventType];
          }
        }
      }

      eventTypes = eventTypes? (''+eventTypes).replace(/,/g,' ').replace(/\s+/g,' ').trim().split(' ') : [];

      var proceed = eventTypes.length || eKey === 'remove';

      if (proceed) {
        for(var i=0; i<this.length; i++) {
          if (!eventTypes.length && eKey === 'remove') {
            eventTypes = (this[i].domEvents && (typeof this[i].domEvents === 'object') && Object.keys(this[i].domEvents)) || [];
          }
          for(var e=0; e<eventTypes.length; e++) {
            if (eKey === 'add') {
              addEvent(this[i], eventTypes[e]);
            } else {
              remEvent(this[i], eventTypes[e]);
            }
          }
        }
      }
    }
  }

  function on ( strEventTypes, strMatchSelector, fn ) {
    domEvent.call(this, 'add', strEventTypes, strMatchSelector, fn);
    return this;
  }
  function off ( strEventTypes, strMatchSelector, fn ) {
    domEvent.call(this, 'remove', strEventTypes, strMatchSelector, fn);
    return this;
  }

  // --------------------------------------------

  return dQ;
})(window||globalThis);
