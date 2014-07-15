'use strict'

/**
 * Functions for rendering a person.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsComponents = (function(module) {

  var defaultOptions = {
    iconSize: 'medium'
  };

  /**
   * Output a person's vitals (name, lifeSpan, and PID).
   * @author Steven Lambert <steven.lambert@familysearch.com>
   * @team tree - tesseract
   */
  module.fsPersonVitals = function(person, options) {
    options = $.extend({}, defaultOptions, options);

    // convert the angular template
    var template = templateList.vitals;
    var $template = this.parseAngular(template, {person: person, options: options});

    // add the person card link
    if (options.openPersonCard) {
      var name = $template.find('.person-vitals__name');
      var nameContent = name.html();
      name.empty();

      var link = '<a href="#view=ancestor&person={{person.id}}" data-cmd="openPersonCard" data-cmd-data=\'{"id": "{{person.id}}", "name": "{{person.name}}", "gender": "{{person.gender}}"}\'>' + nameContent + '</a>';
      var $link = this.parseAngular(link, {person: person, options: options});

      name.append($link);
    }

    // return a DOM string or the DOM node
    if (options.returnString) {
      return $template.prop('outerHTML');
    }
    else {
      return $template;
    }
  };

  /**
   * Output a person's info with their vitals (gender, name, lifeSpan, and PID).
   * @author Steven Lambert <steven.lambert@familysearch.com>
   * @team tree - tesseract
   */
  module.fsPersonInfo = function(person, options) {
    options = $.extend({}, defaultOptions, options);

    // don't return a DOM string when replacing the inner template
    var returnString = options.returnString;
    options.returnString = undefined;

    // convert the angular template
    var template = templateList.info;
    var $template = this.parseAngular(template, {person: person, options: options});
    $template.find('fs-person-vitals').replaceWith(this.fsPersonVitals(person, options));

    // return a DOM string or the DOM node
    if (returnString) {
      return $template.prop('outerHTML');
    }
    else {
      return $template;
    }
  };

  /**
   * Output a person's portrait with their info (portrait, gender, name, lifeSpan, and PID).
   * @author Steven Lambert <steven.lambert@familysearch.com>
   * @team tree - tesseract
   */
  module.fsPersonPortrait = function(person, options) {
    options = $.extend({}, defaultOptions, options);
    var returnString = options.returnString;
    options.returnString = undefined;

    // convert the angular template
    var template = templateList.portrait;
    var $template = this.parseAngular(template, {person: person, options: options});
    $template.find('fs-person-info').replaceWith(this.fsPersonInfo(person, options));

    // return a DOM string or the DOM node
    if (returnString) {
      return $template.prop('outerHTML');
    }
    else {
      return $template;
    }
  };

  return module;
})(window.fsComponents || {});