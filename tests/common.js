import { Meteor }       from 'meteor/meteor';
import { Random }       from 'meteor/random';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar }  from 'meteor/reactive-var';

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

FlowRouter.route('/', {
  name: 'index',
  action() {
    Meteor.setTimeout(() => {
      defaultReactiveTitle.set(defaultNewTitleStr);
    }, 50);
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

Tinytest.addAsync('COMMON - Global Defaults', function (test, next) {
  FlowRouter.go('/');
  test.equal(document.title, defaultTitleStr);
  setTimeout(() => {
    test.equal(document.title, defaultNewTitleStr);
    next();
  }, 100);
});

Tinytest.addAsync('COMMON - Title - String', function (test, next) {
  FlowRouter.go('secondPage');
  setTimeout(() => {
    test.equal(document.title, 'Second Page title');
    next();
  }, 100);
});

Tinytest.addAsync('COMMON - Title - Function with dynamic data', function (test, next) {
  const _str = Random.id();
  FlowRouter.go('thirdPage', {something: _str});
  setTimeout(() => {
    test.equal(document.title, 'Third Page Title > ' + _str);
    next();
  }, 100);
});

Tinytest.addAsync('COMMON - 404 via FlowRouter.notFound', function (test, next) {
  FlowRouter.go('/not/exists/for/sure');
  setTimeout(() => {
    test.equal(document.title, '404: Page not found');
    next();
  }, 100);
});

Tinytest.addAsync('COMMON - .set() Method', function (test, next) {
  const _title = 'Title set via .set() method';
  Meteor.__test.titleHandler.set(_title);
  setTimeout(() => {
    test.equal(document.title, _title);
    next();
  }, 25);
});

FlowRouter.route('*', {
  action() {},
  title: '404: Page not found'
});
