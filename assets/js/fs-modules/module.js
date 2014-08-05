/**
 * Functions for parsing angular templates into jQuery DOM objects.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsModules = (function(module, angular, FS, $) {
  'use strict';

  var $parse;
  // get angulars $parse so we can parse angular templates
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
    'fs-add-wrapper-if': function(nodeName, obj) {
      var value = parse(this.attr(nodeName), obj);

      if (!value) {
        this.replaceWith(this.contents());
      }
      else {
        this.removeAttr(nodeName);
      }
    },

    'ng-bind-html': function(nodeName, obj) {
      var value = parse(this.attr(nodeName), obj);

      this.html(FS.htmlDecode(value)).removeAttr(nodeName);
    },

    'ng-if': function(nodeName, obj) {
      var value = parse(this.attr(nodeName), obj);

      if (!value) {
        this.remove();
      }
      else {
        this.removeAttr(nodeName);
      }
    },

    'ng-src': function(nodeName) {
      var attr = this.attr(nodeName);  // this should already be parsed at this point

      this.attr('src', attr).removeAttr(nodeName);
    },

    'ng-class': function(nodeName, obj) {
      var value = parse(this.attr(nodeName), obj);

      /*
       * ng-class can evaluate to 3 things:
       * 1. string representing space delimited class names
       * 2. an array
       * 3. a map of class names to boolean values where the names of the properties whose values are truthy will be added as css classes to the element
       * @see {@link https://docs.angularjs.org/api/ng/directive/ngClass|ngClass}
       */
      if (isString(value)) {
        this.addClass(value);
      }
      else if (isArray(value)) {
        for (var i = 0, len = value.length; i < len; i++) {
          this.addClass(value[i]);
        }
      }
      else {
        forEach(value, function(val, key){
          if (val) {
            this.addClass(key);
          }
        }, this);
      }

      this.removeAttr(nodeName);
    }
  };

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
   * @param {jQuery} $node     - JQuery DOM element that the directive is on.
   * @param {object} object    - Used in place of $scope for parsing.
   */
  function callDirective(directive, $node, obj) {
    var data = $node.data();
    var attrsToTransfer = [];
    var scope = {};
    var $template, attrName;

    // parse the nodes data attributes and use those for the directive function parameters
    for (var prop in data) {
      if (!data.hasOwnProperty(prop)) continue;

      // only add defined properties
      if (obj[ data[prop] ]) {
        scope[prop] = obj[ data[prop] ];
      }
      // otherwise we need to transfer the property to the new node
      else {
        attrsToTransfer.push(prop);
      }
    }

    $template = directive.func(scope);

    if (directive.replace) {
      // replaceWith only works if the node has a parent
      if ($node.parents().length) {
        $node.replaceWith($template);

        // transfer any classes from the directive to the new node
        $template.addClass($node.attr('class'));

        // transfer any properties not in the scope object from the old node to the new node
        for (var i = 0, len = attrsToTransfer.length; i < len; i++) {
          attrName = 'data-'+attrsToTransfer[i];
          $template.attr(attrName, $node.attr(attrName));
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
      $node.append($template);
    }
  }

  // dictionary of registered directives
  module.directives = {};

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
   * @returns {jQueryDom} - A jQuery DOM element.
   */
  module.parseTemplate = function(str, obj) {
    str = this.parseExpression(str, obj);
    var $root = $(str);
    var $nodes = $root.find('*').andSelf();
    var $node, nodeName, camelName, directive, attrs, attr, attrName;

    // traverse the DOM
    for (var i = 0, len = $nodes.length; i < len; i++) {
      $node = $nodes.eq(i);
      nodeName = $node.prop('nodeName').toLowerCase();
      camelName = $.camelCase(nodeName);

      // call a registered directive if the node name matches an element directive
      if ((directive = this.directives[camelName]) && directive.restrict.indexOf('E') !== -1) {
        callDirective(directive, $node, obj);
      }

      // loop through each attribute and call any ng attribute functions or directive functions
      attrs = Array.prototype.slice.call($node.prop('attributes'));
      for (var j = 0, length = attrs.length; j < length; j++) {
        attr = attrs[j];

        // strip x- and data- from the front of the element/attributes.
        attrName = attr.nodeName.replace(/^data-|^x-/, '');

        // allow for proper camelCasing
        attrName = attrName.replace(/^ng:|^ng_/, 'ng-');

        if (ngAttrs[attrName]) {
          ngAttrs[attrName].call($node, attr.nodeName, obj);
        }

        // call a registered directive if the node name matches an attribute directive
        camelName = $.camelCase(attrName);
        if ((directive = this.directives[camelName]) && directive.restrict.indexOf('A') !== -1) {
          callDirective(directive, $node, obj);
        }
      }
    }

    return $root;
  };

  /**
   * Register a new directive parser
   * Taken from http://toddmotto.com/angular-js-dependency-injection-annotation-process/
   * @param {string} fnName  - The camel case name of the directive.
   * @param {array}  fn      - Array of strings for each parameter, last value must be a function.
   * @param {object} options - The options for the directive {restrict, replace}
   */
  module.registerDirective = function(fnName, fn, options) {
    var $inject;
    options = $.extend({}, defaultOptions, options);

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
})(window.fsModules || {}, window.angular, window.FS, window.jQuery);