/**
 * Functions for parsing angular templates into HTMLElement objects.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsModules = (function(module, angular, FS) {
  'use strict';

  var $parse;
  // get angular $parse so we can parse angular templates
  if (angular && angular.injector) {
    var $injector = angular.injector(['ng']);
    $parse = $injector.get('$parse');
  }
  // use the isolated angular $parse (fs-modules/parser.js)
  else if (module.parser) {
    $parse = module.parser;
  }
  else {
    throw new Error('You must include \'fs-modules/parser.js\' before \'fs-modules.js\' to use this feature without angular.js.');
  }
  var ngExp = /\{\{[^}]*\}\}/g;
  var dashAlpha = /-([a-z])/gi;

  // default directive options
  var defaultOptions = {
    restrict: 'AE',
    replace: false
  };

  // cache of parsed expressions
  var cache = {};

  /**
   * Mapping function for angular attribute directives
   * @param {string} nodeName - The name of the attribute
   * @param {object} object   - Used in place of $scope for parsing.
   */
  var ngAttrs = {
    'fs-add-wrapper-if': function(node, attrName, obj) {
      var value = parse(node.getAttribute(attrName), obj);

      if (!value) {
        var temp = null;

        // need to have a parentNode for this to work
        if (!node.parentNode) {
          temp = document.createElement('div');
          temp.appendChild(node);
        }

        // move all child nodes to sibling nodes and remove it
        while(node.children.length) {
          node.parentNode.insertBefore(node.children[0], node);
        }
        node.parentNode.removeChild(node);

        return temp;
      }
      else {
        node.removeAttribute(attrName);
      }
    },

    'ng-bind-html': function(node, attrName, obj) {
      var value = parse(node.getAttribute(attrName), obj);

      node.innerText = FS.htmlDecode(value);
      node.removeAttribute(attrName);

      return node;
    },

    'ng-if': function(node, attrName, obj) {
      var value = parse(node.getAttribute(attrName), obj);

      if (!value) {
        // remove the node if it has a parent
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        // otherwise make the node a comment
        else {
          return document.createComment(' ' + attrName + ' ' + value + ' ');
        }
      }
      else {
        node.removeAttribute(attrName);
      }

      return node;
    },

    'ng-src': function(node, attrName) {
      var attr = node.getAttribute(attrName);  // this should already be parsed at this point

      node.setAttribute('src', attr);
      node.removeAttribute(attrName);

      return node;
    },

    'ng-class': function(node, attrName, obj) {
      var value = parse(node.getAttribute(attrName), obj);

      /*
       * ng-class can evaluate to 3 things:
       * 1. string representing space delimited class names
       * 2. an array
       * 3. a map of class names to boolean values where the names of the properties whose values are truthy will be added as css classes to the element
       * @see {@link https://docs.angularjs.org/api/ng/directive/ngClass|ngClass}
       */
      if (isString(value)) {
        addClass(node, value);
      }
      else if (isArray(value)) {
        for (var i = 0, len = value.length; i < len; i++) {
          addClass(node, value[i]);
        }
      }
      else {
        forEach(value, function(val, key){
          if (val) {
            addClass(node, key);
          }
        });
      }

      node.removeAttribute(attrName);

      return node;
    }
  };

  /**
   * Uppercase a letter. Used internally for camelCase function.
   * @param {string} match  - The matched string (not used).
   * @param {string} letter - The letter from the matched string.
   */
  function upperCaseCamel(match, letter) {
    return letter.toUpperCase();
  }

  /**
   * Camel Case a dashed string.
   * Taken from jQuery source.
   * @see {@link http://james.padolsey.com/jquery/#v=1.6.2&fn=jQuery.camelCase\jQuery}
   * @param {string}
   */
  function camelCase(str) {
    return str.replace(dashAlpha, upperCaseCamel);
  }

  /**
   * Add a class to an element without duplicating it.
   * @param {HTMLElement} node - The HTML element to add the class to.
   * @param {string}      str  - String of space delimited class names.
   */
  function addClass(node, str) {
    if (!str) return;

    var classes = str.split(' ');
    var className;

    // only add the class if it hasn't been added already
    for (var i = 0, len = classes.length; i < len; i++) {
      className = classes[i];

      if (node.className.indexOf(className) === -1) {
        node.className += (' ' + className);
      }
    }

    node.className = trim(node.className);
  }

  /**
   * Normalize element attribute name.
   * @param {string} attr - The name of element attribute.
   * @returns {string}
   */
  function normalize(attr) {
    // strip x- and data- from the front of the element/attribute
    attr = attr.replace(/^data-|^x-/, '');

    // turn ng: and ng_ into ng- for camel casing
    return attr.replace(/^ng:|^ng_/, 'ng-');
  }

  /**
   * Returns the parsed expression function.
   * @param {string} exp - The angular expression to parse.
   * @param {object} obj  - Used in place of $scope for parsing.
   */
  function parse(exp, obj) {
    if (!cache[exp]) {
      cache[exp] = $parse(exp);
    }

    return cache[exp](obj);
  }

  /**
   * Parse a registered directive from a template.
   * @param {object} directive - Directive object {restrict, replace, func}.
   * @param {HTMLElement} node - DOM element that the directive is on.
   * @param {object} object    - Used in place of $scope for parsing.
   */
  function callDirective(directive, node, obj) {
    var attrsToTransfer = [];
    var scope = {};
    var template, attr, attrName;

    // parse scope objects from the attributes
    var attrs = Array.prototype.slice.call(node.attributes);
    for (var j = 0, length = attrs.length; j < length; j++) {
      attr = attrs[j];
      attrName = normalize(attr.nodeName);

      // add the object from obj to scope
      if (obj[attr.value]) {
        scope[attrName] = obj[attr.value];
      }
      // otherwise we need to transfer the attribute to the new node
      else {
        attrsToTransfer.push(attr.nodeName);
      }
    }

    template = directive.func(scope);

    if (directive.replace) {
      // replaceWith only works if the node has a parent
      if (node.parentNode) {
        node.parentNode.replaceChild(template, node);

        // transfer any properties not in the scope object from the old node to the new node
        for (var i = 0, len = attrsToTransfer.length; i < len; i++) {
          // attrName = 'data-'+attrsToTransfer[i];
          attrName = attrsToTransfer[i];

          // transfer any classes from the directive to the new node
          if (attrName === 'class') {
            addClass(template, node.className);
          }
          else {
            template.setAttribute(attrName, node.getAttribute(attrName));
          }
        }
      }
      // can't have a replace on a root node
      else {
        var $compileMinErr = minErr('$compile');

        throw $compileMinErr('tplrt',
          'Template for directive \'{0}\' must have exactly one root element.', directive.name);
      }
    }
    else {
      node.appendChild(template);
    }
  }

  // dictionary of registered directives
  module.directives = {};

  /**
   * Make the helpers.js extend function available
   */
  module.extend = extend;

  /**
   * Convert angular {{expressions}} to their associated value.
   * @param {string} str - Angular expression string to parse.
   * @param {object} obj - Used in place of $scope for parsing.
   * @returns {string} The parsed angular value.
   */
  module.parseExpression = function(str, obj) {
    var matches = str.match(ngExp) || [];
    var match, exp, parsed, value;

    for (var i = 0, len = matches.length; i < len; i++) {
      match = matches[i];
      exp = match.substr(2, match.length-4);  // only get what is inside the {{exp}}
      parsed = $parse(exp);
      value = parsed(obj) || '';

      str = str.replace(match, value);
    }

    return str;
  };

  /**
   * Parse angular directive templates.
   * @param {string} str - Template str to parse.
   * @param {object} obj - Used in place of $scope for parsing.
   * @returns {HTMLElement} A DOM element.
   */
  module.parseTemplate = function(str, obj) {
    str = this.parseExpression(str, obj);

    // convert the template into DOM
    var frag = document.createDocumentFragment();  // create a fragment to avoid reflow from innerHTML
    var temp = frag.appendChild(document.createElement('div'));

    temp.innerHTML = str;
    addClass(temp, 'test');

    var nodes = temp.querySelectorAll('*');
    var root = temp.removeChild(temp.firstChild);
    var node, nodeName, camelName, directive, attrs, attr, attrName;

    // traverse the DOM
    for (var i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      nodeName = node.nodeName.toLowerCase();
      camelName = camelCase(nodeName);

      // call a registered directive if the node name matches an element directive
      if ((directive = this.directives[camelName]) && directive.restrict.indexOf('E') !== -1) {
        callDirective(directive, node, obj);
      }

      // loop through each attribute and call any ng attribute functions or directive functions
      attrs = Array.prototype.slice.call(node.attributes);
      for (var j = 0, length = attrs.length; j < length; j++) {
        attr = attrs[j];
        attrName = normalize(attr.nodeName);

        if (ngAttrs[attrName]) {
          node = ngAttrs[attrName](node, attr.nodeName, obj);
        }

        // call a registered directive if the node name matches an attribute directive
        camelName = camelCase(attrName);
        if ((directive = this.directives[camelName]) && directive.restrict.indexOf('A') !== -1) {
          callDirective(directive, node, obj);
        }
      }
    }

    return root;
  };

  /**
   * Register a new directive.
   * Taken from http://toddmotto.com/angular-js-dependency-injection-annotation-process/
   * @param {string} fnName  - The camel case name of the directive.
   * @param {array}  fn      - Array of strings for each parameter, last value must be a function.
   * @param {object} options - The options for the directive {restrict, replace}
   */
  module.registerDirective = function(fnName, fn, options) {
    var $inject;
    options = extend({}, defaultOptions, options);

    // we do not allow class directives since they are not apparent
    if (options.restrict.indexOf('C') !== -1) {
      throw new Error('Directives that are restricted by Class Name are not allowed because they obscure the fact that a template is being used on the element.');
    }

    // save off the array parameter names for minification
    if (typeof fn !== 'function') {
      $inject = fn.slice(0, fn.length - 1);
      fn = fn[fn.length - 1];
    }

    // ensure we have a function
    if (typeof fn !== 'function') {
      throw new Error('Directive ' + fnName + ' is not a function.');
    }
    // ensure the directive isn't already defined
    if (this[fnName]) {
      throw new Error('Directive ' + fnName + ' is already registered.');
    }

    // make the function directly callable
    this[fnName] = fn;

    // create a function that can be called when parsing directives to translate
    // the array of function parameters into their corresponding variables
    var self = this;
    this.directives[fnName] = {
      name: fnName,
      restrict: options.restrict,
      replace: options.replace,
      func: function(obj) {
        var params = [];
        for (var i = 0, len = $inject.length; i < len; i++) {
          params.push(obj[ $inject[i] ]);
        }

        return fn.apply(self, params);
      }
    };
  };

  return module;
})(window.fsModules || {}, window.angular, window.FS);