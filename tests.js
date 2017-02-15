if (Meteor.isServer) {
  return false;
}

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.globals.push({
  title: 'Default title'
});

FlowRouter.notFound = {
  action() {},
  title: '404: Page not found'
};

FlowRouter.route('/', {
  name: 'index',
  action() {}
});

FlowRouter.route('/secondPage', {
  name: 'secondPage',
  title: 'Second Page title',
  action() {}
});

FlowRouter.route('/thirdPage/:something', {
  name: 'thirdPage',
  title() {
    return 'Third Page Title > ' + this.params.something;
  },
  action() {}
});

group = FlowRouter.group({
  prefix: '/group',
  title: 'GROUP TITLE',
  titlePrefix: 'Group > '
});

group.route('/groupPage1', {
  name: 'groupPage1',
  action() {}
});

group.route('/groupPage2', {
  name: 'groupPage2',
  title: 'Group page 2',
  action() {}
});

nestedGroup = group.group({
  prefix: '/level2',
  title: 'LEVEL2 GROUP TITLE',
  titlePrefix: 'Group Level 2 > '
});

nestedGroup.route('/withoutTitle', {
  name: 'lvl2',
  action() {}
});

nestedGroup.route('/witTitle', {
  name: 'lvl2Title',
  title: 'Level 2 page',
  action() {}
});

import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
new FlowRouterTitle(FlowRouter);
FlowRouter.go('/');

Tinytest.addAsync('Global Defaults', function (test, next) {
  setTimeout(() => {
    test.equal(document.title, 'Default title');
    next();
  }, 100);
});

Tinytest.addAsync('Title - String', function (test, next) {
  FlowRouter.go('secondPage');
  setTimeout(() => {
    test.equal(document.title, 'Second Page title');
    next();
  }, 100);
});

Tinytest.addAsync('Title - Function with dynamic data', function (test, next) {
  var _str = Random.id();
  FlowRouter.go('thirdPage', {something: _str});
  setTimeout(() => {
    test.equal(document.title, 'Third Page Title > ' + _str);
    next();
  }, 100);
});

Tinytest.addAsync('Group - level 1 - no route title', function (test, next) {
  FlowRouter.go('groupPage1');
  setTimeout(() => {
    test.equal(document.title, 'GROUP TITLE');
    next();
  }, 100);
});

Tinytest.addAsync('Group - level 1 - with route title', function (test, next) {
  FlowRouter.go('groupPage2');
  setTimeout(() => {
    test.equal(document.title, 'Group > Group page 2');
    next();
  }, 100);
});

Tinytest.addAsync('Group - level 2 - no route title', function (test, next) {
  FlowRouter.go('lvl2');
  setTimeout(() => {
    test.equal(document.title, 'Group > LEVEL2 GROUP TITLE');
    next();
  }, 100);
});

Tinytest.addAsync('Group - level 2 - with route title', function (test, next) {
  FlowRouter.go('lvl2Title');
  setTimeout(() => {
    test.equal(document.title, 'Group > Group Level 2 > Level 2 page');
    next();
  }, 100);
});

Tinytest.addAsync('404 via FlowRouter.notFound', function (test, next) {
  FlowRouter.go('/not/exists/for/sure');
  setTimeout(() => {
    test.equal(document.title, '404: Page not found');
    next();
  }, 100);
});
