Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.0.4',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use(['underscore', 'ecmascript', 'reactive-var', 'ostrio:flow-router-extra@3.2.1'], 'client');
  api.mainModule('flow-router-title.js', 'client');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript', 'random', 'ostrio:flow-router-extra', 'ostrio:flow-router-title'], 'client');
  api.addFiles('tests.js', 'client');
});
