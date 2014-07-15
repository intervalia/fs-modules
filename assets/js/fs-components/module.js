'use strict'

/**
 * Functions for parsing angular templates into jquery DOM objects.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsComponents = (function(module) {

  // get angular $parse so we can parse angular templates
  var $injector = angular.injector(['ng']);
  var $parse = $injector.get('$parse');
  var ngExp = /\{\{.*?\}\}/g;

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
    }
  };

  /**
   * Convert angular {{expressions}} to their associated value.
   * @param {string} str - Template str to format.
   * @param {object} obj - Used in place of $scope for parsing.
   */
  module.formatAngular = function(str, obj) {
    var matches = str.match(ngExp);
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
   */
  module.parseAngular = function(str, obj) {
    var str = this.formatAngular(str, obj);
    var $root = $(str)
    var nodes = $root.find('*').andSelf();
    var node;

    // traverse the DOM
    for (var i = 0, len = nodes.length; i < len; i++) {
      node = nodes.eq(i);

      // loop through each attribute and call any ng attribute functions
      $(nodes[i].attributes).each(function() {
        if (ngAttrs[this.nodeName]) {
          ngAttrs[this.nodeName].call(node, obj);
        }
      });
    }

    return $root;
  };

  return module;
})(window.fsComponents || {});