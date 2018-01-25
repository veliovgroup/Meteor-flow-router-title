import { Meteor }      from 'meteor/meteor';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isServer) {
  return;
}

const groupReactiveStrTitle    = 'Reactive GROUP TITLE';
const groupReactiveStrTitleNew = 'NEW Reactive GROUP TITLE';
const groupReactiveVarTitle    = new ReactiveVar(groupReactiveStrTitle);

const groupReactiveStrPrefix    = 'Reactive Group > ';
const groupReactiveVarPrefix    = new ReactiveVar(groupReactiveStrPrefix);

const groupReactive = FlowRouter.group({
  prefix: '/group-reactive',
  title() {
    return groupReactiveVarTitle.get();
  },
  titlePrefix() {
    return groupReactiveVarPrefix.get();
  }
});

groupReactive.route('/groupPage1', {
  name: 'groupReactivePage1',
  action() {
    Meteor.setTimeout(() => {
      groupReactiveVarTitle.set(groupReactiveStrTitleNew);
    }, 256);
  }
});

const groupReactiveStrPage2Title    = 'Reactive Group page 2';
const groupReactiveStrPage2TitleNew = 'NEW Reactive Group page 2';
const groupReactiveVarPage2Title    = new ReactiveVar(groupReactiveStrPage2Title);

groupReactive.route('/groupPage2', {
  name: 'groupReactivePage2',
  title() {
    return groupReactiveVarPage2Title.get();
  },
  action() {
    Meteor.setTimeout(() => {
      groupReactiveVarPage2Title.set(groupReactiveStrPage2TitleNew);
    }, 256);
  }
});

const nestedGroupReactiveStrTitle    = 'LEVEL2 REACTIVE GROUP TITLE';
const nestedGroupReactiveStrTitleNew = 'NEW LEVEL2 REACTIVE GROUP TITLE';
const nestedGroupReactiveVarTitle    = new ReactiveVar(nestedGroupReactiveStrTitle);

const nestedGroupReactiveStrPrefix    = 'Reactive Group Level 2 > ';
const nestedGroupReactiveVarPrefix    = new ReactiveVar(nestedGroupReactiveStrPrefix);

const nestedReactiveGroup = groupReactive.group({
  prefix: '/level2',
  title() {
    return nestedGroupReactiveVarTitle.get();
  },
  titlePrefix() {
    return nestedGroupReactiveVarPrefix.get();
  }
});

nestedReactiveGroup.route('/withoutTitle', {
  name: 'reactivelvl2',
  action() {
    Meteor.setTimeout(() => {
      nestedGroupReactiveVarTitle.set(nestedGroupReactiveStrTitleNew);
    }, 256);
  }
});

const nestedGroupReactiveStrPagelvl2Title    = 'Reactive Level 2 page';
const nestedGroupReactiveStrPagelvl2TitleNew = 'NEW Reactive Level 2 page';
const nestedGroupReactiveVarPagelvl2Title    = new ReactiveVar(nestedGroupReactiveStrPagelvl2Title);

nestedReactiveGroup.route('/witTitle', {
  name: 'reactivelvl2Title',
  title() {
    return nestedGroupReactiveVarPagelvl2Title.get();
  },
  action() {
    Meteor.setTimeout(() => {
      nestedGroupReactiveVarPagelvl2Title.set(nestedGroupReactiveStrPagelvl2TitleNew);
    }, 3000);
  }
});

Tinytest.addAsync('Group - Reactive - level 1 - no route title', function (test, next) {
  FlowRouter.go('groupReactivePage1');
  setTimeout(() => {
    test.equal(document.title, groupReactiveStrTitle);
    Meteor.setTimeout(() => {
      test.equal(document.title, groupReactiveStrTitleNew);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Group - Reactive - level 1 - with route title', function (test, next) {
  FlowRouter.go('groupReactivePage2');
  setTimeout(() => {
    test.equal(document.title, groupReactiveStrPrefix + groupReactiveStrPage2Title);
    Meteor.setTimeout(() => {
      test.equal(document.title, groupReactiveStrPrefix + groupReactiveStrPage2TitleNew);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Group - Reactive - level 2 - no route title', function (test, next) {
  FlowRouter.go('reactivelvl2');
  setTimeout(() => {
    test.equal(document.title, groupReactiveStrPrefix + nestedGroupReactiveStrTitle);
    Meteor.setTimeout(() => {
      test.equal(document.title, groupReactiveStrPrefix + nestedGroupReactiveStrTitleNew);
      next();
    }, 512);
  }, 100);
});

Tinytest.addAsync('Group - Reactive - level 2 - with route title', function (test, next) {
  FlowRouter.go('reactivelvl2Title');
  setTimeout(() => {
    test.equal(document.title, groupReactiveStrPrefix + nestedGroupReactiveStrPrefix + nestedGroupReactiveStrPagelvl2Title, 'before reactive update');
    Meteor.setTimeout(() => {
      test.equal(document.title, groupReactiveStrPrefix + nestedGroupReactiveStrPrefix + nestedGroupReactiveStrPagelvl2TitleNew, 'after reactive update');
      next();
    }, 3512);
  }, 100);
});
