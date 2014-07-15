'use strict'

window.treeRenderers = (function(module) {

  // ensure that module.lang is an object
  module.lang = module.lang || {
    unknownName: '[Unknown Name]'
  };

  if (Object.prototype.toString.call(module.lang) !== '[object Object]') {
    throw new Error('treeRenderers.lang must be an object.');
  }

  /**
   * Render a person.
   * @param {[DOMElement, jQueryElement, querySelector]} container - Parent element to append the person information to.
   *
   * @type {object} person - Person to render.
   * @param {string} [person.name]
   * @param {string} [person.gender]
   * @param {string} [person.lifeSpan]
   * @param {string} [person.fullLifeSpan]
   * @param {string} [person.id]
   *
   * @type {object} options - How to display the person information.
   * @param {string}  [options.iconSize=medium] - Size of the gender icon (small,medium,large).
   * @param {boolean} [options.hideIcon=false] - Hide the gender icon.
   * @param {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @param {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan.
   * @param {boolean} [options.hidePid=false] - Hide the person id.
   * @param {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   * @param {DOM tag} [options.nameWrapper] - Wrap the name in a DOM element (h1,h2,h3,h4,span,div).
   * @param {string} [options.addSpouse] - String to place in the person-name li if a spouse will be added.
   *
   * @returns {DOMElement} Returns the HTML if no container element is passed, otherwise returns nothing.
   */
  module.renderPerson = function(container, person, options) {
    var person = person || {};
    var options = options || {};

    // set defaults
    if (person.id && !person.name) {
      person.name = this.lang.unknownName;
    }
    options.iconSize = options.iconSize || 'medium'

    var $personContainer = $('<div class="person-info-container"></div>');
    var $personInfo = $('<div class="person-info"></div>');
    var validNameWrappers = ['h1', 'h2', 'h3', 'h4', 'span', 'div'];
    var icon, gender, lifeSpan, $el, $name, $link;

    // create the gender div
    var $genderContainer = $('<div class="person-gender-container ' + (!options.hideIcon ? options.iconSize : '') + '"></div>');
    $personContainer.append($genderContainer);

    $el = $('<div class="person-gender-icon"></div>');

    // only create the person if the object exists
    if (!$.isEmptyObject(person)) {
      person.gender = person.gender || 'unknown';

      // add the gender icon
      if (!options.hideIcon) {
        icon = 'fs-icon-' + options.iconSize + '-' + person.gender.toLowerCase();
        $el.addClass(icon);
      }
      $genderContainer.append($el);

      // add the person name
      if (person.name) {
        $el = $('<div class="person-name"></div>');

        // only add valid name wrappers
        if (options.nameWrapper && validNameWrappers.indexOf(options.nameWrapper) !== -1) {
          $name = $('<' + options.nameWrapper + '></' + options.nameWrapper + '>');
          $name.html(person.name);
        }
        else {
          $name = person.name;
        }

        // create the link to open the person card
        if (options.openPersonCard) {
          $link = $('<a href="javascript:void(0);" data-cmd="openPersonCard">' + $name + '</a>');
          $link.data('cmdData', {
            id: person.id,
            name: person.name,
            gender: person.gender
          });
          $el.append($link);
        }
        else {
          $el.html($name);
        }
        $personInfo.append($el);
      }

      // add the lifespan
      if (!options.hideLifeSpan && (person.fullLifeSpan || person.lifeSpan)) {
        if (options.lifeSpan === 'full' && person.fullLifeSpan) {
          lifeSpan = person.fullLifeSpan;
        }
        else {
          lifeSpan = person.lifeSpan;
        }

        $el = $('<span class="person-lifeSpan">' + lifeSpan + '</span>');
        $personInfo.append($el);
      }

      if (!options.hideLifeSpan && !options.hidePid) {
        $personInfo.append('<span class="person-separator">&nbsp;&bull;&nbsp;</span>');
      }

      // add the pid
      if (!options.hidePid && person.id) {
        $el = $('<span class="person-id">' + person.id + '</span>');
        $personInfo.append($el);
      }

     $personContainer.append($personInfo);
    }
    // just add the gender div
    else {
      $genderContainer.append($el);
    }

    // add the add-spouse class
    if (options.addSpouse) {
      $personInfo.append($('<span class="person-name add-spouse">' + options.addSpouse + '</span>'))
      $personContainer.append($personInfo);
    }

    // container not null
    if ((container = $(container)).length) {
      container.append($personContainer);
    }
    else {
      return $personContainer[0];
    }
  };

  /**
   * Couple a person.
   * @requires renderCouple
   * @param {[DOMElement, jQueryElement, querySelector]} container - Parent element to append the person information to.
   *
   * @type {object} person1 - Top couple person to render.
   * @param {string} [person.name]
   * @param {string} [person.gender]
   * @param {string} [person.lifeSpan]
   * @param {string} [person.fullLifeSpan]
   * @param {string} [person.id]
   *
   * @type {object} person2 - Bottom couple person to render.
   * @param {string} [person.name]
   * @param {string} [person.gender]
   * @param {string} [person.lifeSpan]
   * @param {string} [person.fullLifeSpan]
   * @param {string} [person.id]
   *
   * @type {object} options - How to display the person information.
   * @param {string}  [options.iconSize=medium] - Size of the gender icon (small,medium,large).
   * @param {boolean} [options.hideIcon=false] - Hide the gender icon.
   * @param {boolean} [options.hideLifeSpan=false] - Hide the lifespan.
   * @param {string}  [options.lifeSpan=short] - Show the short or the full lifeSpan.
   * @param {boolean} [options.hidePid=false] - Hide the person id.
   * @param {boolean} [options.openPersonCard=false] - Add a link to open the person card when the name is clicked.
   * @param {string} [options.nameWrapper] - Wrap the name in a DOM element.
   * @param {string} [options.addSpouse] - String to place in the person-name li if a spouse will be added.
   *
   * @returns {DOMElement} Returns the HTML if no container element is passed, otherwise returns nothing.
   */
  module.renderCouple = function(container, person1, person2, options) {
    var coupleTop = this.renderPerson(null, person1, options);
    var coupleBottom = this.renderPerson(null, person2, options);

    coupleTop.className += ' couple-husband';
    coupleBottom.className += ' couple-wife';

    // container not null
    if ((container = $(container)).length) {
      container.append(coupleTop);
      container.append(coupleBottom)
    }
    else {
      var $el = $('<div class="couple-container"></div');
      $el.append(coupleTop);
      $el.append(coupleBottom);

      return $el[0];
    }
  };

  return module;
})(window.treeRenderers || {});