Package.describe({
  name: 'ostrio:flow-router-title',
  version: '2.1.6',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use(['underscore', 'coffeescript', 'ecmascript', 'reactive-var', 'ostrio:flow-router-extra@2.12.6'], 'client');
  api.mainModule('flow-router-title.coffee', 'client');
  api.export('FlowRouterTitle', 'client');
});