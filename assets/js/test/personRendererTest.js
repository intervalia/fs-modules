var expect = chai.expect;

// run tests using angular directives instead of fsModules function calls
var isAngularTest = window.isAngularTest || false;

var person = {
  name: 'John Doe',
  gender: 'MALE',
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

var person2 = {
  name: 'Jane Doe',
  gender: 'FEMALE',
  id: 'bdfg-hjk',
  lifeSpan: '1920-1980',
  fullLifeSpan: '11 January 1920 &ndash; 11 December 1980',
  nameConclusion: {
    details: {
      style: 'EUROTYPIC',
      nameForms: [{
        givenPart: 'Jane',
        familyPart: 'Doe'
      }]
    }
  },
  portraitUrl: 'http://familysearch.org/portrait_female'
};

var noNamePerson = fsModules.extend({}, person, {name: null});
var noIdPerson = fsModules.extend({}, person, {id: null});
var noNameConclusionPerson = fsModules.extend({}, person, {nameConclusion: null});
var noPotriatPerson = fsModules.extend({}, person, {portraitUrl: null});

/**
 * personRenderer
 */
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
      $template = $compile(template)($scope)[0];
      $scope.$digest();
    }
  }

  /**
   * fsModules.fsPersonVitals
   */
  describe('fsModules.fsPersonVitals', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person);
      }

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
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

      var fullName = $template.querySelector('[data-test="full-name"]').innerText;

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

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]');
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.be.a('null');;
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

      var pid = $template.querySelector('[data-test="pid"]');

      expect(pid).to.be.a('null');
    });

    it('should not include the lifeSpan if options.hideLifeSpan is true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{hideLifeSpan: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {hideLifeSpan: true});
      }

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]');

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.be.a('null');
    });

    it('should not include the lifeSpan or id if options.hideLifeSpan and options.hideId are true', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-vitals data-person="person" data-config="{hideLifeSpan: true, hideId: true}"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(person, {hideLifeSpan: true, hideId: true});
      }

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]');
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]');

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.be.a('null');
      expect(lifeSpan).to.be.a('null');
    });

    it('should not include the given and family names if there is no nameConclusion', function() {
      if (isAngularTest) {
        $scope.person = noNameConclusionPerson;
        compileDirective('<fs-person-vitals data-person="person"></fs-person-vitals>');
      }
      else {
        $template = fsModules.fsPersonVitals(noNameConclusionPerson);
      }

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]');
      var familyName = $template.querySelector('[data-test="family-name"]');
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.be.a('null');
      expect(familyName).to.be.a('null');
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

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.not.be.a('null');
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

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.equal(person.id);
      expect(lifeSpan).to.equal('1 January 1900 – 1 December 1960');
    });

  });

  /**
   * fsModules.fsPersonGender
   */
  describe('fsModules.fsPersonGender', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-gender data-person="person"></fs-person-gender>');
      }
      else {
        $template = fsModules.fsPersonGender(person);
      }

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
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

      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]');
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.be.a('null');
      expect(lifeSpan).to.equal(person.lifeSpan);
    });

  });

  /**
   * fsModules.fsPersonPortrait
   */
  describe('fsModules.fsPersonPortrait', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        compileDirective('<fs-person-portrait data-person="person"></fs-person-portrait>');
      }
      else {
        $template = fsModules.fsPersonPortrait(person);
      }

      var portrait = $template.querySelector('img');
      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]').innerText;
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(portrait).to.not.be.a('null');
      expect(portrait.getAttribute('src')).to.equal(person.portraitUrl);
      expect(personCard).to.be.a('null');
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

      var portrait = $template.querySelector('img');
      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]');
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      expect(portrait).to.not.be.a('null');
      expect(portrait.getAttribute('src')).to.equal(person.portraitUrl);
      expect(personCard).to.be.a('null');
      expect(fullName).to.equal(person.name);
      expect(givenName).to.equal('John');
      expect(familyName).to.equal('Doe');
      expect(pid).to.be.a('null');
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

      var portrait = $template.querySelector('img');

      expect(portrait).to.be.a('null');
    });

  });

  /**
   * fsModules.fsCoupleInfo
   */
  describe('fsModules.fsCoupleInfo', function() {

    it('should output the correct values with default options', function() {
      if (isAngularTest) {
        $scope.person = person;
        $scope.person2 = person2;
        compileDirective('<fs-couple-info data-husband="person" data-wife="person2"></fs-couple-info>');
      }
      else {
        $template = fsModules.fsCoupleInfo(person, person2);
      }

      var personCard = $template.querySelectorAll('a[data-cmd="openPersonCard"]');
      var fullNames = $template.querySelectorAll('[data-test="full-name"]');
      var givenNames = $template.querySelectorAll('[data-test="given-name"]');
      var familyNames = $template.querySelectorAll('[data-test="family-name"]');
      var pids = $template.querySelectorAll('[data-test="pid"]');
      var lifeSpans = $template.querySelectorAll('[data-test="lifeSpan"]');

      expect(personCard.length).to.equal(0);

      // test husband data
      expect(fullNames[0].innerText).to.equal(person.name);
      expect(givenNames[0].innerText).to.equal('John');
      expect(familyNames[0].innerText).to.equal('Doe');
      expect(pids[0].innerText).to.equal(person.id);
      expect(lifeSpans[0].innerText).to.equal(person.lifeSpan);

      // test wife data
      expect(fullNames[1].innerText).to.equal(person2.name);
      expect(givenNames[1].innerText).to.equal('Jane');
      expect(familyNames[1].innerText).to.equal('Doe');
      expect(pids[1].innerText).to.equal(person2.id);
      expect(lifeSpans[1].innerText).to.equal(person2.lifeSpan);
    });

    it('should transfer options properly to both persons', function() {
      if (isAngularTest) {
        $scope.person = person;
        $scope.person2 = person2;
        compileDirective('<fs-couple-info data-husband="person" data-wife="person2" data-config="{hideId: true}"></fs-couple-info>');
      }
      else {
        $template = fsModules.fsCoupleInfo(person, person2, {hideId: true});
      }

      var portrait = $template.querySelector('img');
      var personCard = $template.querySelector('a[data-cmd="openPersonCard"]');
      var fullName = $template.querySelector('[data-test="full-name"]').innerText;
      var givenName = $template.querySelector('[data-test="given-name"]').innerText;
      var familyName = $template.querySelector('[data-test="family-name"]').innerText;
      var pid = $template.querySelector('[data-test="pid"]');
      var lifeSpan = $template.querySelector('[data-test="lifeSpan"]').innerText;

      var personCard = $template.querySelectorAll('a[data-cmd="openPersonCard"]');
      var fullNames = $template.querySelectorAll('[data-test="full-name"]');
      var givenNames = $template.querySelectorAll('[data-test="given-name"]');
      var familyNames = $template.querySelectorAll('[data-test="family-name"]');
      var pids = $template.querySelectorAll('[data-test="pid"]');
      var lifeSpans = $template.querySelectorAll('[data-test="lifeSpan"]');

      expect(personCard.length).to.equal(0);
      expect(pids.length).to.equal(0);

      // test husband data
      expect(fullNames[0].innerText).to.equal(person.name);
      expect(givenNames[0].innerText).to.equal('John');
      expect(familyNames[0].innerText).to.equal('Doe');
      expect(lifeSpans[0].innerText).to.equal(person.lifeSpan);

      // test wife data
      expect(fullNames[1].innerText).to.equal(person2.name);
      expect(givenNames[1].innerText).to.equal('Jane');
      expect(familyNames[1].innerText).to.equal('Doe');
      expect(lifeSpans[1].innerText).to.equal(person2.lifeSpan);
    });

  });

});