Package.describe({
  name: 'ostrio:flow-router-title',
  version: '3.5.1',
  summary: 'Set and update web page title via flow-router hooks',
  git: 'https://github.com/veliovgroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '2.8.0', '3.0.1', '3.4']);
  api.use(['ecmascript', 'reactive-var', 'tracker'], 'client');
  api.use(['zodern:types@1.0.13', 'typescript'], 'client', { weak: true });
  api.mainModule('flow-router-title.js', 'client');
  api.addAssets('index.d.ts', 'client');
});

Package.onTest((api) => {
  api.use(['tinytest', 'ecmascript', 'random', 'session', 'reactive-var', 'tracker', 'ostrio:flow-router-extra@3.13.0'], 'client');
  api.addFiles('tests/index.js', 'client');
});
