var path = require('path'),
    projectPath = path.resolve(__dirname, '..'),
    masterConf = require(path.join(projectPath, 'node_modules/frontier-build-tools/test/fskarma10-config'));

module.exports = function(config) {
  masterConf(config, {
    projectPath: projectPath,
    testFiles: [
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular.js',
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular-mocks.js',
      'node_modules/theme-engage/vendor/angularjs/js/angular-1.2.16/angular-sanitize.js',
      'assets/js/fs-modules/assembly.json',
      'assets/js/fs-modules/test/*Test.js',
      'assets/js/ng-fs-modules/assembly.json',
      'assets/js/test/runTestWithAngular.js',
      'assets/js/test/*Test.js'
    ]
  });
}
