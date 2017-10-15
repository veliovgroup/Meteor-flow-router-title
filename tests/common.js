import { Meteor }      from 'meteor/meteor';
import { Random }      from 'meteor/random';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isServer) {
  return;
}

const defaultTitleStr      = 'Default title';
const defaultNewTitleStr   = 'Default NEW title';
const defaultReactiveTitle = new ReactiveVar(defaultTitleStr);

FlowRouter.globals.push({
  title() {
    return defaultReactiveTitle.get();
  }
});

FlowRouter.route('*', {
  action() {},
  title: '404: Page not found'
});

FlowRouter.route('/', {
  name: 'index',
  action() {
    Meteor.setTimeout(() => {
      defaultReactiveTitle.set(defaultNewTitleStr);
    }, 1024);
  }
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

FlowRouter.go('/');

Tinytest.addAsync('Global Defaults', function (test, next) {
  setTimeout(() => {
    test.equal(document.title, defaultTitleStr);
    setTimeout(() => {
      test.equal(document.title, defaultNewTitleStr);
      next();
    }, 1536);
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
  const _str = Random.id();
  FlowRouter.go('thirdPage', {something: _str});
  setTimeout(() => {
    test.equal(document.title, 'Third Page Title > ' + _str);
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
