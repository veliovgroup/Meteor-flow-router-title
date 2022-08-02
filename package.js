Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.2.2',
  summary: 'Change document.title (page title) on the fly via flow-router definition',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use(['ecmascript', 'reactive-var', 'tracker'], 'client');
  api.mainModule('flow-router-title.js', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'random', 'session', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.8.1'], 'client');
  api.addFiles('tests/init.js', 'client');
  api.addFiles('tests/common.js', 'client');
  api.addFiles('tests/group.js', 'client');
  api.addFiles('tests/reactive.js', 'client');
  api.addFiles('tests/group-reactive.js', 'client');
});
