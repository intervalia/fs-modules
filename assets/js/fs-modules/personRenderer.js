/**
 * Functions for rendering a person.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tree - tesseract
 */
window.fsModules = (function(module, $) {
  'use strict';

  var defaultOptions = {
    iconSize: 'medium'
  };

  /**
   * Output a person's vitals (name, lifeSpan, and id).
   * @param {object} person - Person to render.
   * @property {string} [person.gender]
   * @property {string} [person.lifeSpan]
   * @property {string} [person.fullLifeSpan]
   * @property {string} [person.id]
   *
   * @param {object} options - How to render the person.
   * @property {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @property {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan (short,long).
   * @property {boolean} [options.hideId=false] - Hide the person id.
   * @property {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   *
   * @returns {DOMElement}
   */
  module.registerDirective('fsPersonVitals', ['person', 'options', function(person, options) {
    options = $.extend({}, defaultOptions, options);

    // convert the angular template
    var template = templateList.personVitals;
    var $template = this.parseTemplate(template, {person: person, options: options, lang: lang});

    return $template;
  }], {restrict: 'E', replace: true});

  /**
   * Output a person's info with their vitals (gender, name, lifeSpan, and id).
   * @param {object} person - Person to render.
   * @property {string} [person.gender]
   * @property {string} [person.lifeSpan]
   * @property {string} [person.fullLifeSpan]
   * @property {string} [person.id]
   *
   * @param {object} options - How to render the person.
   * @property {string}  [options.iconSize=medium] - Size of the gender icon (small,medium).
   * @property {boolean} [options.hideGender=false] - Hide the gender icon.
   * @property {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @property {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan (short,long).
   * @property {boolean} [options.hideId=false] - Hide the person id.
   * @property {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   *
   * @returns {DOMElement}
   */
  module.registerDirective('fsPersonGender', ['person', 'options', function(person, options) {
    options = $.extend({}, defaultOptions, options);

    // convert the angular template
    var template = templateList.personGender;
    var $template = this.parseTemplate(template, {person: person, options: options, lang: lang});

    return $template;
  }], {restrict: 'E', replace: true});

  /**
   * Output a person's portrait with their info (portrait, gender, name, lifeSpan, and id).
   * @param {object} person - Person to render.
   * @property {string} [person.gender]
   * @property {string} [person.lifeSpan]
   * @property {string} [person.fullLifeSpan]
   * @property {string} [person.id]
   *
   * @param {object} options - How to render the person.
   * @property {string}  [options.iconSize=medium] - Size of the gender icon (small,medium).
   * @property {boolean} [options.hideGender=false] - Hide the gender icon.
   * @property {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @property {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan (short,long).
   * @property {boolean} [options.hideId=false] - Hide the person id.
   * @property {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   *
   * @returns {DOMElement}
   */
  module.registerDirective('fsPersonPortrait', ['person', 'options', function(person, options) {
    options = $.extend({}, defaultOptions, options);

    // convert the angular template
    var template = templateList.personPortrait;
    var $template = this.parseTemplate(template, {person: person, options: options, lang: lang});

    return $template;
  }], {restrict: 'E', replace: true});

  /**
   * Output a couple relationship.
   * @param {object} husband - Husband of the relationship.
   * @property {string} [husband.gender]
   * @property {string} [husband.lifeSpan]
   * @property {string} [husband.fullLifeSpan]
   * @property {string} [husband.id]
   *
   * @param {object} wife - Wife of the relationship.
   * @property {string} [wife.gender]
   * @property {string} [wife.lifeSpan]
   * @property {string} [wife.fullLifeSpan]
   * @property {string} [wife.id]
   *
   * @param {object} options - How to render the couple.
   * @property {string}  [options.iconSize=medium] - Size of the gender icon (small,medium).
   * @property {boolean} [options.hideGender=false] - Hide the gender icon.
   * @property {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @property {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan (short,long).
   * @property {boolean} [options.hideId=false] - Hide the person id.
   * @property {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   *
   * @returns {DOMElement}
   */
  module.registerDirective('fsCoupleInfo', ['husband', 'wife', 'options', function(husband, wife, options) {
    options = $.extend({}, defaultOptions, options);

    // convert the angular template
    var template = templateList.coupleInfo;
    var $template = this.parseTemplate(template, {husband: husband, wife: wife, options: options});

    return $template;
  }], {restrict: 'E', replace: true});

  return module;
})(window.fsModules || {}, window.jQuery);