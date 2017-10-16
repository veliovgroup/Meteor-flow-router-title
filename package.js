Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.1.0',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use(['underscore', 'ecmascript', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.4.0'], 'client');
  api.mainModule('flow-router-title.js', 'client');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript', 'random', 'session', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.4.0', 'ostrio:flow-router-title'], 'client');
  api.addFiles('tests/init.js', 'client');
  api.addFiles('tests/common.js', 'client');
  api.addFiles('tests/group.js', 'client');
  api.addFiles('tests/reactive.js', 'client');
  api.addFiles('tests/group-reactive.js', 'client');
});
