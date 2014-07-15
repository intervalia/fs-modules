angular.module('ngSharedComponents', [])

.directive('fstPersonVitals', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.vitals,
    scope: {
      person: '=',
      config: '&',
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};

      // instead of duplicating the '.person-vitals__name' content just to add a wrapper anchor
      // with an ng-switch, we'll just append it to the DOM in the link function
      if (scope.options.openPersonCard) {
        var name = element.find('.person-vitals__name');
        var nameContent = name.html();
        name.empty();

        var link = '<a href="#view=ancestor&person={{person.id}}" data-cmd="openPersonCard" data-cmd-data=\'{"id": "{{person.id}}", "name": "{{person.name}}", "gender": "{{person.gender}}"}\'>' + nameContent + '</a>';
        $link = $compile(link)(scope);

        name.append($link);
      }
    }
  };
}])

.directive('fstPersonInfo', function() {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.info,
    scope: {
      person: '=',
      config: '&'
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};
      scope.options.iconSize = scope.options.iconSize || 'medium';
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fst-person-vitals
      tElement.find('fst-person-vitals').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
})

.directive('fstPersonPortrait', function() {
  return {
    restrict: 'E',
    replace: true,
    template: templateList.portrait,
    scope: {
      person: '=',
      config: '&'
    },
    link: function(scope, element, attrs) {
      scope.options = scope.config() || {};
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fst-person-vitals
      tElement.find('fst-person-info').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
});