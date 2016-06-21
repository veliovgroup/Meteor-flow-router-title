Package.describe({
  name: 'ostrio:flow-router-title',
  version: '2.1.1',
  summary: 'Change document.title (page title) on the fly within flow-router',
  git: 'https://github.com/VeliovGroup/Meteor-flow-router-title',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use(['underscore', 'coffeescript', 'reactive-var', 'ostrio:flow-router-extra@2.12.2'], 'client');
  api.export('FlowRouterTitle', 'client');
  api.addFiles('flow-router-title.coffee', 'client');
});