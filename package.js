Package.describe({
  name: 'ostrio:flow-router-title',
  version: '2.0.1',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use(['underscore', 'coffeescript', 'reactive-var', 'ostrio:flow-router-extra@2.10.1'], 'client');
  api.export('FlowRouterTitle', 'client');
  api.addFiles('flow-router-title.coffee', 'client');
});