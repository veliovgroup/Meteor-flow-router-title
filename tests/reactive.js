import { Meteor }      from 'meteor/meteor';
import { Random }      from 'meteor/random';
import { Session }     from 'meteor/session';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isServer) {
  return;
}

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
    }, 256);
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
    }, 256);
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
    }, 256);
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
    }, 256);
  }
});

Tinytest.addAsync('Reactive - Session', function (test, next) {
  FlowRouter.go('reactiveSession');
  setTimeout(() => {
    test.equal(document.title, sessionDefault);
    setTimeout(() => {
      test.equal(document.title, sessionNew);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Reactive - Session with args', function (test, next) {
  const one = Random.id();
  const two = Random.id();
  FlowRouter.go('reactiveArgsSession', { one, two });
  setTimeout(() => {
    test.equal(document.title, sessionArgsDefault + one + two);
    setTimeout(() => {
      test.equal(document.title, sessionArgsNew + one + two);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Reactive - Var', function (test, next) {
  FlowRouter.go('reactiveVar');
  setTimeout(() => {
    test.equal(document.title, varDefault);
    setTimeout(() => {
      test.equal(document.title, varNew);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Reactive - Var with args', function (test, next) {
  const one = Random.id();
  const two = Random.id();
  FlowRouter.go('reactiveArgsVar', { one, two });
  setTimeout(() => {
    test.equal(document.title, varArgsDefault + one + two);
    setTimeout(() => {
      test.equal(document.title, varArgsNew + one + two);
      next();
    }, 512);
  }, 100);
});
