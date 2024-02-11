import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterTitle } from '../flow-router-title.js';

window.history.replaceState(null, '', '/');
FlowRouter.wait();
require('./common.js');
require('./group.js');
require('./reactive.js');
require('./group-reactive.js');

const titleHandler = new FlowRouterTitle(FlowRouter);
FlowRouter.initialize();

Meteor.__test = { titleHandler };
