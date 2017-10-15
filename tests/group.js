import { Meteor }      from 'meteor/meteor';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';

if (Meteor.isServer) {
  return;
}

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
