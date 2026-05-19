import type { Router } from 'meteor/ostrio:flow-router-extra';

/**
 * Client-only: registers `triggers.enter` / `triggers.exit` on the router to
 * keep `document.title` in sync with `FlowRouter.globals`, group `title` /
 * `titlePrefix`, route `title`, and not-found options.
 */
export class FlowRouterTitle {
  constructor(router: Router);
  /**
   * Sets `document.title` (async tick). Returns `false` for non-strings; does not throw.
   */
  set(title: string): boolean;
}
