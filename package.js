Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.4.0',
  summary: 'Set and update page title (document.title) in flow-router hooks',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '2.8.0', '3.0.1']);
  api.use(['ecmascript', 'reactive-var', 'tracker'], 'client');
  api.mainModule('flow-router-title.js', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'random', 'session', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.12.0'], 'client');
  api.addFiles('tests/index.js', 'client');
});
