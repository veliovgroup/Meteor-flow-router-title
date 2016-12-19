Package.describe({
  name: 'ostrio:flow-router-title',
  version: '2.1.7',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.4');
  api.use(['underscore', 'ecmascript', 'reactive-var', 'ostrio:flow-router-extra@2.12.6'], 'client');
  api.mainModule('flow-router-title.js', 'client');
  api.export('FlowRouterTitle', 'client');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'ecmascript', 'ostrio:flow-router-extra', 'ostrio:flow-router-title', 'random'], 'client');
  api.addFiles('tests.js', 'client');
});