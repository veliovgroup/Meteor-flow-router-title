Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.3.0',
  summary: 'Change document.title (page title) on the fly via flow-router definition',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '3.0-beta.0']);
  api.use(['ecmascript', 'reactive-var', 'tracker'], 'client');
  api.mainModule('flow-router-title.js', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'random', 'session', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.10.0'], 'client');
  api.addFiles('tests/index.js', 'client');
});
