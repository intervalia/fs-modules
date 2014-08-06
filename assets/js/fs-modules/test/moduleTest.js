var expect = chai.expect;

/**
 * fsModules
 */
describe('fsModules', function() {

  it('should exist', function() {
    expect(window.fsModules).to.exist;
  });

});

/**
 * fsModules.parseExpression
 */
describe('fsModules.parseExpression', function() {

  it('should correctly parse some angular expressions', function() {
    var obj = {
      'integer': -1,
      'string': 'test',
      'object': {
        'foo': 'bar'
      },
      'function': function() {
        return 'function call';
      }
    };

    var exps = {
      'integer': '{{ integer }}',
      'string': '{{ string }}',
      'object': '{{ object.foo }}',
      'function': '{{ function() }}',
      'ternary': '{{ (!boolean) ? integer : string }}'
    };

    expect( fsModules.parseExpression(exps.integer, obj) ).to.equal('-1');
    expect( fsModules.parseExpression(exps.string, obj) ).to.equal('test');
    expect( fsModules.parseExpression(exps.object, obj) ).to.equal('bar');
    expect( fsModules.parseExpression(exps.function, obj) ).to.equal('function call');
    expect( fsModules.parseExpression(exps.ternary, obj) ).to.equal('-1');
  });

  it('should parse all angular expressions in a template string', function() {
    var obj = {
      'title': 'myTitle',
      'text': 'myText'
    };

    var str = '<div title="{{title}}"><span>{{text}}</span></div>';
    var expected = '<div title="' + obj.title + '"><span>' + obj.text + '</span></div>';

    expect( fsModules.parseExpression(str, obj) ).to.equal(expected);
  });

});

/**
 * fsModules.registerDirective
 */
describe('fsModules.registerDirective', function() {

  afterEach(function() {
    // remove the test directive for each test
    delete fsModules.test;
    delete fsModules.directives.test;
  });

  it('should put the function on the module', function() {
    fsModules.registerDirective('test', function() {});

    expect( typeof fsModules.test ).to.equal('function');
  });

  it('should put the function in the directives object with default options', function() {
    fsModules.registerDirective('test', function() {});

    expect(fsModules.directives.test).to.exist;
    expect(fsModules.directives.test.restrict).to.equal('AE');
    expect(fsModules.directives.test.replace).to.be.false;
    expect( typeof fsModules.directives.test.func ).to.equal('function');
  });

  it('should put the function in the directives object with specified options', function() {
    fsModules.registerDirective('test', function() {}, {restrict: 'E', replace: true});

    expect(fsModules.directives.test).to.exist;
    expect(fsModules.directives.test.restrict).to.equal('E');
    expect(fsModules.directives.test.replace).to.be.true;
  });

  it('should parse function parameters from array', function() {
    // values listed in reverse order to ensure values are parsed correctly
    var obj = {
      'two': 2,
      'one': 1
    }

    fsModules.registerDirective('test', ['one', 'two', function(a, b) {
      expect(a).to.equal(obj.one);
      expect(b).to.equal(obj.two);
    }]);

    fsModules.directives.test.func(obj);
  });

  it('should throw an error if the function has already been registered', function() {
    fsModules.registerDirective('test', function() {});

    fn = function() {
      fsModules.registerDirective('test', function() {});
    }

    expect(fn).to.throw(Error);
  });

});

/**
 * fsModules.parseTemplate
 */
describe('fsModules.parseTemplate', function() {

  it('should call angular attribute function', function() {
    var obj = {
      'val': true
    };

    // we can test if an ng attribute function is called if the attribute gets removed
    var str = '<div ng-if="val"></div>';
    var expected = '<div></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);

    // test for data- attributes
    var str = '<div data-ng-if="val"></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);

    // test for x- attributes
    var str = '<div x-ng-if="val"></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);

    // test for ng: attributes
    var str = '<div ng:if="val"></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);

    // test for ng_ attributes
    var str = '<div ng_if="val"></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
  });

  it('should call any registered directives', function() {
    var obj = {
      'person': {'name': 'John Doe', 'id': '1234-567'}
    };

    var dirTemplate = '<div><span>{{person.name}}</span><span>{{person.id}}</span></div>';

    fsModules.registerDirective('testDirE', ['person', function(person) {
      var template = fsModules.parseTemplate(dirTemplate, {person: person});

      return template;
    }], {restrict: 'E', replace: true});

    fsModules.registerDirective('testDirA', ['person', function(person) {
      var template = fsModules.parseTemplate(dirTemplate, {person: person});

      return template;
    }], {restrict: 'A', replace: false});

    var str = {
      'E': '<div><test-dir-e data-person="person"></test-dir></div>',
      'A': '<div><div test-dir-a data-person="person"></div></div>'
    };
    var expected = {
      'E': '<div><div><span>' + obj.person.name + '</span><span>' + obj.person.id + '</span></div></div>',
      'A': '<div><div test-dir-a="" data-person="person"><div><span>' + obj.person.name + '</span><span>' + obj.person.id + '</span></div></div></div>'
    };

    expect( fsModules.parseTemplate(str.E, obj).outerHTML ).to.equal(expected.E);
    expect( fsModules.parseTemplate(str.A, obj).outerHTML ).to.equal(expected.A);

    // test for data- attributes
    str.A = '<div><div data-test-dir-a data-person="person"></div></div>';
    expected.A = '<div><div data-test-dir-a="" data-person="person"><div><span>' + obj.person.name + '</span><span>' + obj.person.id + '</span></div></div></div>'

    expect( fsModules.parseTemplate(str.A, obj).outerHTML ).to.equal(expected.A);

    // clean up
    delete fsModules.testDirA;
    delete fsModules.testDirE;
    delete fsModules.directives.testDirA;
    delete fsModules.directives.testDirE;
  });

  it('callDirective should transfer over all properties correctly', function() {
    var obj = {
      'person': {'name': 'John Doe', 'id': '1234-567'}
    };

    var dirTemplate = '<div class="dirTemplate"><span>{{person.name}}</span><span>{{person.id}}</span></div>';

    fsModules.registerDirective('testDirE', ['person', function(person) {
      var template = fsModules.parseTemplate(dirTemplate, {person: person});

      return template;
    }], {restrict: 'E', replace: true});

    var str = '<div><test-dir-e class="test-dir-e" data-person="person" data-test="keep"></test-dir></div>';
    var expected = '<div><div class="dirTemplate test-dir-e" data-test="keep"><span>' + obj.person.name + '</span><span>' + obj.person.id + '</span></div></div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);

    // clean up
    delete fsModules.testDirE;
    delete fsModules.directives.testDirE;
  });

});

/**
 * ngAttrs
 */
describe('ngAttrs', function() {

  describe('fs-add-wrapper-if', function() {

    it('should add the wrapper element if the expression evaluates to true', function() {
      var obj = {
        'val': true
      };

      var str = '<div><div fs-add-wrapper-if="val"><span>Hello</span></div></div>';
      var expected = '<div><div><span>Hello</span></div></div>';

      expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
    });

    it('should remove the wrapper and keep the children if the expression evaluates to false', function() {
      var obj = {
        'val': false
      };

      var str = '<div><div fs-add-wrapper-if="val"><span>Hello</span></div></div>';
      var expected = '<div><span>Hello</span></div>';

      expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
    });

  });

  it('ng-bind-html should html decode the expression', function() {
    var obj = {
      'val': '1918 &ndash; 1920'
    };

    var str = '<div ng-bind-html="val"></div>';
    var expected = '<div>1918 – 1920</div>';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
  });

  describe('ng-if', function() {

    it('should add the element if the expression evaluates to true', function() {
      var obj = {
        'val': true
      };

      var str = '<div><div ng-if="val"><span>Hello</span></div></div>';
      var expected = '<div><div><span>Hello</span></div></div>';

      expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
    });

    it('should remove the element if the expression evaluates to false', function() {
      var obj = {
        'val': false
      };

      var str = '<div><div ng-if="val"><span>Hello</span></div></div>';
      var expected = '<div></div>';

      expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
    });

  });

  it('ng-src should add the parsed expression to the src attribute', function() {
    var obj = {
      'src': 'http://fakeUrl.com'
    };

    var str = '<img ng-src="{{src}}">';
    var expected = '<img src="' + obj.src + '">';

    expect( fsModules.parseTemplate(str, obj).outerHTML ).to.equal(expected);
  });

  it('ng-class should add the class', function() {
    var obj = {
      'string': 'my class',
      'array': ['my', 'class'],
      'map': {'my': true, 'class': false}
    };

    var str = {
      'string': '<div ng-class="string"></div>',
      'array': '<div ng-class="array"></div>',
      'map': '<div ng-class="map"></div>'
    };
    var expected = {
      'string': '<div class="my class"></div>',
      'array': '<div class="my class"></div>',
      'map': '<div class="my"></div>'
    };

    expect( fsModules.parseTemplate(str.string, obj).outerHTML ).to.equal(expected.string);
    expect( fsModules.parseTemplate(str.array, obj).outerHTML ).to.equal(expected.array);
    expect( fsModules.parseTemplate(str.map, obj).outerHTML ).to.equal(expected.map);
  });

});