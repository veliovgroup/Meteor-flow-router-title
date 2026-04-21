declare module 'meteor/ostrio:flow-router-title' {
  /**
   * Client-only: registers `triggers.enter` / `triggers.exit` on the router to
   * keep `document.title` in sync with `FlowRouter.globals`, group `title` /
   * `titlePrefix`, route `title`, and not-found options.
   */
  export class FlowRouterTitle {
    constructor(router: import('meteor/ostrio:flow-router-extra').Router);
    /**
     * Sets `document.title` (async tick). Returns `false` for non-strings; does not throw.
     */
    set(title: string): boolean;
  }
}
