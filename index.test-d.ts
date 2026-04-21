/* eslint-disable no-new -- tsd exercises constructor signatures */
/// <reference path="./index.d.ts" />
import { expectAssignable, expectError, expectType } from 'tsd';
import type { Router } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

function makeRouter(): Router {
  return {
    globals: [],
    triggers: {
      enter() {},
      exit() {},
    },
  };
}

const router = makeRouter();
const title = new FlowRouterTitle(router);

expectType<FlowRouterTitle>(title);
expectAssignable<boolean>(title.set('hello'));

expectError(title.set(1));
expectError(new FlowRouterTitle());
expectError(new FlowRouterTitle('not-a-router'));
