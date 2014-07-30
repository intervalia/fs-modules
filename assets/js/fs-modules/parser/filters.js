/**
 * Filter functions taken as needed from Angular.js source
 * https://github.com/angular/angular.js/blob/master/src/Angular.js
 */

/**
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts the specified string to lowercase.
 * @param {string} string String to be converted to lowercase.
 * @returns {string} Lowercased string.
 */
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};

/**
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts the specified string to uppercase.
 * @param {string} string String to be converted to uppercase.
 * @returns {string} Uppercased string.
 */
var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};

// object for accessing each filter by name
var filters = {
  'lowercase': lowercase,
  'uppercase': uppercase
}

/**
 * Simple substitute for angular $filter
 * https://github.com/angular/angular.js/blob/master/src/ng/filter.js
 */
var $filter = function (name) {
  var suffix = 'Filter';
  return filters[name];
}