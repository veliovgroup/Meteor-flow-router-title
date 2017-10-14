import { Meteor }      from 'meteor/meteor';
import { Random }      from 'meteor/random';
import { Session }     from 'meteor/session';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isServer) {
  return;
}

FlowRouter.globals.push({
  title: 'Default title'
});

FlowRouter.route('*', {
  action() {},
  title: '404: Page not found'
});

FlowRouter.route('/', {
  name: 'index',
  action() {}
});

FlowRouter.route('/secondPage', {
  name: 'secondPage',
  title: 'Second Page title',
  action() {}
});

const sessionDefault = 'Default Reactive Session Title';
const sessionNew = 'NEW Reactive Session Title';
Session.set('reactiveSessionTitle', sessionDefault);

FlowRouter.route('/reactiveSession', {
  name: 'reactiveSession',
  title() {
    return Session.get('reactiveSessionTitle');
  },
  action() {
    Meteor.setTimeout(() => {
      Session.set('reactiveSessionTitle', sessionNew);
    }, 1024);
  }
});

const sessionArgsDefault = 'Default Reactive Session with args Title';
const sessionArgsNew = 'NEW Reactive Session with args Title';
Session.set('reactiveArgsSessionTitle', sessionArgsDefault);

FlowRouter.route('/reactiveArgsSession/:one/:two', {
  name: 'reactiveArgsSession',
  title(params) {
    return Session.get('reactiveArgsSessionTitle') + params.one + params.two;
  },
  action() {
    Meteor.setTimeout(() => {
      Session.set('reactiveArgsSessionTitle', sessionArgsNew);
    }, 1024);
  }
});

const varDefault = 'Default Reactive Var Title';
const varNew = 'NEW Reactive Var Title';
const reactiveVarTitle = new ReactiveVar(varDefault);

FlowRouter.route('/reactiveVar', {
  name: 'reactiveVar',
  title() {
    return reactiveVarTitle.get();
  },
  action() {
    Meteor.setTimeout(() => {
      reactiveVarTitle.set(varNew);
    }, 1024);
  }
});

const varArgsDefault = 'Default Reactive Var with args Title';
const varArgsNew = 'NEW Reactive Var with args Title';
const reactiveArgsVarTitle = new ReactiveVar(varArgsDefault);

FlowRouter.route('/reactiveArgsVar/:one/:two', {
  name: 'reactiveArgsVar',
  title(params) {
    return reactiveArgsVarTitle.get() + params.one + params.two;
  },
  action() {
    Meteor.setTimeout(() => {
      reactiveArgsVarTitle.set(varArgsNew);
    }, 1024);
  }
});

FlowRouter.route('/thirdPage/:something', {
  name: 'thirdPage',
  title() {
    return 'Third Page Title > ' + this.params.something;
  },
  action() {}
});

const group = FlowRouter.group({
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

const nestedGroup = group.group({
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

Tinytest.addAsync('Title - Reactive - Session', function (test, next) {
  FlowRouter.go('reactiveSession');
  setTimeout(() => {
    test.equal(document.title, sessionDefault);
    setTimeout(() => {
      test.equal(document.title, sessionNew);
      next();
    }, 1536);
  }, 100);
});

Tinytest.addAsync('Title - Reactive - Session with args', function (test, next) {
  const one = Random.id();
  const two = Random.id();
  FlowRouter.go('reactiveArgsSession', { one, two });
  setTimeout(() => {
    test.equal(document.title, sessionArgsDefault + one + two);
    setTimeout(() => {
      test.equal(document.title, sessionArgsNew + one + two);
      next();
    }, 1536);
  }, 100);
});

Tinytest.addAsync('Title - Reactive - Var', function (test, next) {
  FlowRouter.go('reactiveVar');
  setTimeout(() => {
    test.equal(document.title, varDefault);
    setTimeout(() => {
      test.equal(document.title, varNew);
      next();
    }, 1536);
  }, 100);
});

Tinytest.addAsync('Title - Reactive - Var with args', function (test, next) {
  const one = Random.id();
  const two = Random.id();
  FlowRouter.go('reactiveArgsVar', { one, two });
  setTimeout(() => {
    test.equal(document.title, varArgsDefault + one + two);
    setTimeout(() => {
      test.equal(document.title, varArgsNew + one + two);
      next();
    }, 1536);
  }, 100);
});

Tinytest.addAsync('Title - Function with dynamic data', function (test, next) {
  const _str = Random.id();
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
