var path = require('path'),
    projectPath = path.resolve(__dirname, '..'),
    masterConf = require(path.join(projectPath, 'node_modules/frontier-build-tools/test/fskarma10-config'));

module.exports = function(config) {
  masterConf(config, {
    projectPath: projectPath,
    testFiles: [
      'assets/js/fs-modules/ngParser/assembly.json',
      'assets/js/fs-modules/assembly.json',
      'assets/js/fs-modules/test/*Test.js',
      'assets/js/test/*Test.js'
    ]
  });
}
