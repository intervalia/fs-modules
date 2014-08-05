/**
 * Since passing an object from one directive to a child directive via data
 * attributes doesn't work so well, use data-config to pass a config object
 * to the directive and then assign `scope.options = scope.config() || {}`.
 * If a child directive needs the same options add the data-config attribute
 * to the directive in the link function and set it to the data-config attribute.
 */
angular.module('ngFsModules', ['ngSanitize'])

/**
 * Conditionally add the wrapper element if the expression results to true, otherwise replace the element with it's children
 */
.directive('fsAddWrapperIf', ['$animate', function($animate) {
  return {
    // multiElement: true,
    // transclude: 'element',
    // priority: 600,
    // terminal: true,
    restrict: 'A',
    // $$tlb: true,
    // compile: function(tElement, tAttrs, transclude) {
    //   console.log('hi');
    // },
    //
    // TODO: need to upgrade to angular version 1.2.16 so that we can get the transclude function inside the link instead of the compile.
    // @see {@link http://www.bennadel.com/blog/2561-changes-in-transclude-function-availability-in-angularjs-1-2.htm}
    //
    // mocking this directive after ngIf since it does almost the exact same thing
    // @see {@link https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js}
    //
  //   link: function ($scope, $element, $attr, ctrl, $transclude) {
  //     var block, childScope, previousElements;
  //     $scope.$watch($attr.fsAddWrapperIf, function fsAddWrapperIfWatchAction(value) {

  //       if (value) {
  //         if (!childScope) {
  //           $transclude(function (clone, newScope) {
  //             childScope = newScope;
  //             clone[clone.length++] = document.createComment(' end fsAddWrapperIf: ' + $attr.fsAddWrapperIf + ' ');
  //             // Note: We only need the first/last node of the cloned nodes.
  //             // However, we need to keep the reference to the jqlite wrapper as it might be changed later
  //             // by a directive with templateUrl when its template arrives.
  //             block = {
  //               clone: clone
  //             };
  //             $animate.enter(clone, $element.parent(), $element);
  //           });
  //         }
  //       } else {
  //         if(previousElements) {
  //           previousElements.remove();
  //           previousElements = null;
  //         }
  //         if(childScope) {
  //           childScope.$destroy();
  //           childScope = null;
  //         }
  //         if(block) {
  //           previousElements = getBlockElements(block.clone);
  //           $animate.leave(previousElements, function() {
  //             previousElements = null;
  //           });
  //           block = null;
  //         }
  //       }
  //     });
  //   }
    link: function(scope, element, attrs) {
      scope.$watch(attrs.fsAddWrapperIf, function fsAddWrapperIfWatchAction(value) {

        if (!value) {
          element.replaceWith(element.contents());
        }
      });
    }
  };
}])

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
      scope.lang = lang;
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
      scope.lang = lang;
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
      scope.lang = lang;
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fs-person-gender
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
      scope.lang = lang;
    },
    compile: function(tElement, tAttrs) {
      // since data-config must be a string, we need to append the attrs string to fs-person-gender
      tElement.find('fs-person-gender').attr('data-config', tAttrs.config);
      return this.link;
    }
  };
});