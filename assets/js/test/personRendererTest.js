var expect = chai.expect;

// run tests using angular directives instead of fsModules function calls
var isAngularTest = window.isAngularTest || false;

var person = {
  name: 'John Doe',
  gender: 'FEMALE',
  id: '1234-567',
  lifeSpan: '1900-1960',
  fullLifeSpan: '1 January 1900 &ndash; 1 December 1960',
  nameConclusion: {
    details: {
      style: 'EUROTYPIC',
      nameForms: [{
        givenPart: 'John',
        familyPart: 'Doe'
      }]
    }
  },
  portraitUrl: 'http://familysearch.org/portrait'
};

var noNamePerson = $.extend({}, person, {name: null});
var noIdPerson = $.extend({}, person, {id: null});
var noNameConclusionPerson = $.extend({}, person, {nameConclusion: null});
var noPotriatPerson = $.extend({}, person, {portraitUrl: null});

describe('personRenderer', function () {
  var $template;

  // set up the angular module
  if (isAngularTest) {
    var $compile;
    var $scope;

    beforeEach(window.module('ngFsModules'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $scope = _$rootScope_;
    }));

    function compileDirective(template) {
      $template = $compile(template)($scope);
      $scope.$digest();
    }
  }

  /**
   * fsPersonVitals
   */
  describe('fsPersonVitals', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person);
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should display "[Unknown Name]" if there is no name', function() {
      if (isAngularTest) {
        $scope.person = noNamePerson;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(noNamePerson);
      }

      var fullName = $template.find('[data-test="full-name"]').text();

      expect(fullName).to.equal('[Unknown Name]');
    });

    it('should not include the id if options.hideId is true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{hideId: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {hideId: true});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var $pid = $template.find('[data-test="pid"]');
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect($pid.length).to.equal(0);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should not include the id if there is none', function() {
      if (isAngularTest) {
        $scope.person = noIdPerson;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(noIdPerson);
      }

      var $pid = $template.find('[data-test="pid"]');

      expect($pid.length).to.equal(0);
    });

    it('should not include the lifeSpan if options.hideLifeSpan is true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{hideLifeSpan: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {hideLifeSpan: true});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var $lifeSpan = $template.find('[data-test="lifeSpan"]');

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect($lifeSpan.length).to.equal(0);
    });

    it('should not include the lifeSpan or id if options.hideLifeSpan and options.hideId are true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{hideLifeSpan: true, hideId: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {hideLifeSpan: true, hideId: true});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var $pid = $template.find('[data-test="pid"]');
      var $lifeSpan = $template.find('[data-test="lifeSpan"]');

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect($pid.length).to.equal(0);
      expect($lifeSpan.length).to.equal(0);
    });

    it('should not include the given and family names if there is no nameConclusion', function() {
      if (isAngularTest) {
        $scope.person = noNameConclusionPerson;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(noNameConclusionPerson);
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var $givenName = $template.find('[data-test="given-name"]').text();
      var $familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect($givenName.length).to.equal(0);
      expect($familyName.length).to.equal(0);
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should have an anchor tag tag with data-cmd="openPersonCard" if options.openPersonCard is true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{openPersonCard: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {openPersonCard: true});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(1);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should output the full lifespan if options.lifeSpan is "long"', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{lifeSpan: \'long\'}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {lifeSpan: 'long'});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal('1 January 1900 – 1 December 1960');
    });

  });

  /**
   * fsPersonGender
   */
  describe('fsPersonGender', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-gender data-person="person"></fs-person-gender>');
      }
      else {
        $template = fsModules.fsPersonGender(person);
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should transfer options properly', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-gender data-person="person" data-config="{hideId: true}"></fs-person-gender>');
      }
      else {
        $template = fsModules.fsPersonGender(person, {hideId: true});
      }

      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var $pid = $template.find('[data-test="pid"]');
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect($pid.length).to.equal(0);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

  });

  /**
   * fsPersonPortrait
   */
  describe('fsPersonPortrait', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-portrait data-person="person"></fs-person-portrait>');
      }
      else {
        $template = fsModules.fsPersonPortrait(person);
      }

      var $portrait = $template.find('img');
      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var pid = $template.find('[data-test="pid"]').text();
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($portrait.length).to.equal(1);
      expect($portrait.attr('src')).to.equal(person.portraitUrl);
      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should transfer options properly', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-portrait data-person="person" data-config="{hideId: true}"></fs-person-portrait>');
      }
      else {
        $template = fsModules.fsPersonPortrait(person, {hideId: true});
      }

      var $portrait = $template.find('img');
      var $personCard = $template.find('a[data-cmd="openPersonCard"]');
      var fullName = $template.find('[data-test="full-name"]').text();
      var givenName = $template.find('[data-test="given-name"]').text();
      var familyName = $template.find('[data-test="family-name"]').text();
      var $pid = $template.find('[data-test="pid"]');
      var lifeSpan = $template.find('[data-test="lifeSpan"]').text();

      expect($portrait.length).to.equal(1);
      expect($portrait.attr('src')).to.equal(person.portraitUrl);
      expect($personCard.length).to.equal(0);
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect($pid.length).to.equal(0);
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

    it('should not include the portrait if there is none', function() {
      if (isAngularTest) {
        $scope.person = noPotriatPerson;
        compileDirective('<fs-person-portrait data-person="person"></fs-person-portrait>');
      }
      else {
        $template = fsModules.fsPersonPortrait(noPotriatPerson);
      }

      var $portrait = $template.find('img');

      expect($portrait.length).to.equal(0);
    });

  });

});