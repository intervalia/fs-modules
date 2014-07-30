'use strict'

/**
 * Functions for parsing angular templates into jquery DOM objects.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsComponents = (function(module) {

  var $parse;
  // get angulars $parse so we can parse angular templates
  if (window.angular && angular.injector) {
    var $injector = angular.injector(['ng']);
    $parse = $injector.get('$parse');
  }
  // use the isolated angular $parse (fs-components/parser.js)
  else if (module.parser) {
    $parse = module.parser;
  }
  else {
    throw new Error('You must include \'fs-components/parser.js\' before \'fs-components.js\' to use this feature without angular.js.');
  }
  var ngExp = /\{\{.*?\}\}/g;

  // default directive options
  var defaultOptions = {
    restrict: 'AE',
    replace: false
  };

  // mapping function for angular directives
  var ngAttrs = {
    'ng-bind-html': function(obj) {
      var attr = this.attr('ng-bind-html');
      var parsed = $parse(attr);
      var value = parsed(obj);

      this.html(FS.htmlDecode(value)).removeAttr('ng-bind-html');
    },
    'ng-if': function(obj) {
      var attr = this.attr('ng-if');
      var parsed = $parse(attr);
      var value = parsed(obj);

      if (!value) {
        this.remove();
      }

      this.removeAttr('ng-if');
    },
    'ng-src': function(obj) {
      var attr = this.attr('ng-src');  // this should already be parsed at this point

      this.attr('src', attr);

      this.removeAttr('ng-src');
    }
  };

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
    var $template, attrName

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
      $node.replaceWith($template);

      // transfer any classes from the directive to the new node
      $template.addClass($node.attr('class'));

      // transfer any properties not in the scope object from the old node to the new node
      for (var i = 0, len = attrsToTransfer.length; i < len; i++) {
        attrName = 'data-'+attrsToTransfer[i];
        $template.attr(attrName, $node.attr(attrName));
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
   * @param {string} str - Template str to format.
   * @param {object} obj - Used in place of $scope for parsing.
   * @returns {string} The parsed angular value.
   */
  module.formatAngular = function(str, obj) {
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
   * Parse angular directives.
   * @param {string} str - Template str to parse.
   * @param {object} obj - Used in place of $scope for parsing.
   * @returns {jQueryDom} - A jQuery DOM element.
   */
  module.parseAngular = function(str, obj) {
    str = this.formatAngular(str, obj);
    var $root = $(str);
    var $nodes = $root.find('*').andSelf();
    var $node, nodeName, camelName, directive, attrs, attr;

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

        // call ng attribute functions
        if (ngAttrs[attr.nodeName]) {
          ngAttrs[attr.nodeName].call($node, obj);
        }

        // call a registered directive if the node name matches an attribute directive
        camelName = $.camelCase(attr.nodeName);
        if ((directive = this.directives[camelName]) && directive.restrict.indexOf('A') !== -1) {
          callDirective(directive, $node, obj)
        }
      }
    }

    return $root;
  };

  /**
   * Register a new directive parser
   * Taken from http://toddmotto.com/angular-js-dependency-injection-annotation-process/
   * @param {string} fnName  - The name of the directive in camel case.
   * @param {array}  fn      - Array of strings for each parameter, last value must be a function.
   * @param {object} options - The options for the directive {restrict, replace}
   */
  module.registerDirective = function(fnName, fn, options) {
    var $inject;
    options = $.extend({}, defaultOptions, options);

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
})(window.fsComponents || {});