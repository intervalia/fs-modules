angular.module('ngFsComponents', ['ngSanitize'])

.directive('fsPersonVitals', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.personVitals,
    scope: {
      person: '=',
      config: '&',
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};

      // instead of duplicating the '.person-vitals__name' content just to add a wrapper anchor
      // with an ng-switch, we'll just append it to the DOM in the link function
      if (scope.options.openPersonCard) {
        var name = element.find('.fs-person-vitals__name');
        var nameContent = name.html();
        name.empty();

        var link = '<a href="#view=ancestor&person={{person.id}}" data-cmd="openPersonCard" data-cmd-data=\'{"id": "{{person.id}}", "name": "{{person.name}}", "gender": "{{person.gender}}"}\'>' + nameContent + '</a>';
        $link = $compile(link)(scope);

        name.append($link);
      }
    }
  };
}])

.directive('fsPersonGender', function() {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.personGender,
    scope: {
      person: '=',
      config: '&'
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};
      scope.options.iconSize = scope.options.iconSize || 'medium';
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fs-person-vitals
      tElement.find('fs-person-vitals').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
})

.directive('fsPersonPortrait', function() {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.personPortrait,
    scope: {
      person: '=',
      config: '&'
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fs-person-vitals
      tElement.find('fs-person-gender').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
})

.directive('fsCoupleInfo', function() {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.coupleInfo,
    scope: {
      husband: '=',
      wife: '=',
      config: '&'
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fs-person-vitals
      tElement.find('fs-person-gender').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
});