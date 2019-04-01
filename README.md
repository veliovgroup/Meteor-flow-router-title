# Reactive page title

Change `document.title` on the fly within [flow-router-extra](https://github.com/VeliovGroup/flow-router).

Features:

- 👷‍♂️ 100% tests coverage;
- 🎛 Per route, per group, and default (*all routes*) `title` tag.

Various ways to set `title`, ordered by prioritization:

- `FlowRouter.route()` [*overrides all below*]
- `FlowRouter.group()`
- `FlowRouter.globals`
- Head template `<title>Text</title>` tag [*might be overridden by any above*]

## Install:

```shell
meteor add ostrio:flow-router-title
```

## Demos / Tests:

- [Demo source](https://github.com/VeliovGroup/Meteor-flow-router-title/tree/master/demo)
- [Tests](https://github.com/VeliovGroup/Meteor-flow-router-title/tree/master/tests)

## ES6 Import:

```js
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
```

## Related Packages:

- [flow-router-meta](https://github.com/VeliovGroup/Meteor-flow-router-meta#reactive-meta-tags-javascript-and-csss) - Per route `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
- [flow-router-extra](https://github.com/VeliovGroup/flow-router#flowrouter-extra) - Carefully extended FlowRouter

## Usage:

Initialize `FlowRouterTitle` class by passing `FlowRouter` object. Right after creating all routes:

```js
FlowRouter.route('/', {
  action() { /* ... */ },
  title: 'Title'
  /* ... */
});

new FlowRouterTitle(FlowRouter);
```

### Set title via Route

Set `title` property in route's or group's configuration:

```js
// Set default document.title value in
// case router has no title property
FlowRouter.globals.push({
  title: 'Default title'
});

FlowRouter.route('/me/account', {
  name: 'account',
  title: 'My Account'
});
```

### `.set()` method

Set `document.title` during runtime (*without route(s)*):

```js
FlowRouter.route('/', {/* ... */});

const titleHandler = new FlowRouterTitle(FlowRouter);
// `.set()` method accepts only String
titleHandler.set('My Awesome Title String'); // <- Returns `true`
titleHandler.set(() => { return 'Wrapped title'; }); // <- Returns `false`, as function can't be set into the `document.title`
```

### Function context

Use function context (with [`data`](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md) hook):

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params) {
    return Collections.Posts.findOne(params._id);
  },
  title(params, query, data) {
    if (data) {
      return data.title;
    }
    return '404: Page not found';
  }
});
```

### Group context

Use group context:

```js
const account = FlowRouter.group({
  prefix: '/account',
  title: 'Account',
  titlePrefix: 'Account > '
});

account.route('/', {
  name: 'accountIndex' // Title will be `Account`
});

account.route('/settings', {
  name: 'AccountSettings',
  title: 'My Settings' // Title will be `Account > My Settings`
});
```

### Reactive data sources

To change `title` reactively, just pass it as function:

```js
FlowRouter.route('/me/account', {
  name: 'account',
  title() {
    // In this example we used `ostrio:i18n` package
    return i18n.get('account.document.title');
  }
});

// Use params from route
FlowRouter.route('/page/:something', {
  name: 'somePage',
  title(params) {
    return 'Page ' + params.something;
  }
});
```

### More examples

In all examples below `title` can be a *Function* or *String*:

```js
FlowRouter.globals.push({
  title() {/* ... */} // <-- Suitable for reactive data source
});

FlowRouter.globals.push({
  title: 'Title text'
});

FlowRouter.group({
  title() {/* ... */}, // <-- Suitable for reactive data source
  titlePrefix() {/* ... */} // <-- Can accept reactive data source, but won't trigger re-computation
});

FlowRouter.group({
  title: 'Title text',
  titlePrefix: 'Title prefix text'
});

FlowRouter.route('/path', {
  title() {/* ... */} // <-- Reactive
});

FlowRouter.route('/path', {
  title: 'Title text'
});

FlowRouter.route('/path', {
  title() {
    setTimeout(() => {
      {/* ... */}; 
    }, 2000); // <-- setTimeout to delay title update
  }
});
```

## Support this project:

This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one could be available for free.
