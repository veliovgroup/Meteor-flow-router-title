[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers?ref=github-flowroutertitle-repo-top"><img src="https://ostr.io/apple-touch-icon-60x60.png" height="20"></a>
<a href="https://meteor-files.com/?ref=github-flowroutertitle-repo-top"><img src="https://meteor-files.com/apple-touch-icon-60x60.png" height="20"></a>

# Reactive page title

Change `document.title` on the fly in [Meteor.js](https://docs.meteor.com/?utm_source=dr.dimitru&utm_medium=online&utm_campaign=Q2-2022-Ambassadors) apps via [flow-router-extra](https://github.com/veliovgroup/flow-router) API.

## Features:

- 👨‍🔬 __100% tests coverage__;
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

- [Demo source](https://github.com/veliovgroup/Meteor-flow-router-title/tree/master/demo)
- [Tests](https://github.com/veliovgroup/Meteor-flow-router-title/tree/master/tests)

## ES6 Import:

```js
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
```

## Related Packages:

- [flow-router-meta](https://github.com/veliovgroup/Meteor-flow-router-meta#reactive-meta-tags-javascript-and-csss) - Per route `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
- [flow-router-extra](https://github.com/veliovgroup/flow-router#flowrouter-extra) - Carefully extended FlowRouter

## Usage:

Initialize `FlowRouterTitle` class by passing `FlowRouter` object. Right after creating all routes:

```js
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

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

Use function context (with [`data`](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md) hook):

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
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
```

## Running Tests

1. Clone this package
2. In Terminal (*Console*) go to directory where package is cloned
3. Then run:

### Meteor/Tinytest

```shell
# Default
meteor test-packages ./

# With custom port
meteor test-packages ./ --port 8888

# With local MongoDB and custom port
MONGO_URL="mongodb://127.0.0.1:27017/flow-router-title-tests" meteor test-packages ./ --port 8888
```

## Support this project:

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-flowroutertitle-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-flowroutertitle-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-flowroutertitle-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/Meteor-flow-router-title)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/flow-router-title)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
