[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers?ref=github-flowroutertitle-repo-top"><img src="https://ostr.io/apple-touch-icon-60x60.png" height="20"></a>
<a href="https://meteor-files.com/?ref=github-flowroutertitle-repo-top"><img src="https://meteor-files.com/apple-touch-icon-60x60.png" height="20"></a>

# Reactive page title

Change `document.title` on the fly in [Meteor.js](https://docs.meteor.com/?utm_source=dr.dimitru&utm_medium=online&utm_campaign=Q2-2022-Ambassadors) apps via [flow-router-extra](https://github.com/veliovgroup/flow-router) API.

## ToC

- [Installation](#installation)
- [Demos](#demos)
- [ES6 Import](#es6-import)
- [Related Packages](#related-packages)
- [API](#api)
- [Usage](#usage)
  - [Set title via Route](#set-title-via-route)
  - [`FlowRouterTitle#set()` method](#set-method)
  - [Function Context](#function-context)
  - [Group Context](#group-context)
  - [Reactive data sources](#reactive-data-sources)
  - [More examples](#more-examples)
- [Running tests](#running-tests)
- [Support this package](#support-this-project)

## Features

- 👨‍🔬 __100% tests coverage__
- ✨ Use prefixes for groups, including nesting
- 🎛 Per route, per group, and default (*all routes*) `title` tag

Various ways to set `title`, *ordered by priority*:

- `FlowRouter.route()` [*overrides all below*]
- `FlowRouter.group()`
- `FlowRouter.globals`
- Head template `<title>Text</title>` tag [*superseded by any above*]

## Installation

```shell
meteor add ostrio:flow-router-title
```

## Demos

- [Demo source](https://github.com/veliovgroup/Meteor-flow-router-title/tree/master/demo)
- [Tests](https://github.com/veliovgroup/Meteor-flow-router-title/tree/master/tests)

## ES6 Import

```js
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
```

## Related Packages

`flow-router-title` performs the best when used with the next packages:

- [flow-router-meta](https://github.com/veliovgroup/Meteor-flow-router-meta#reactive-meta-tags-javascript-and-csss) - Per route `meta` tags, `script`, and `link` (*e.g. CSS*) — set per-route meta-tags, stylesheets, and scripts
- [flow-router-extra](https://github.com/veliovgroup/flow-router#flowrouter-extra) - Carefully extended FlowRouter

## API

- `new FlowRouterTitle(FlowRouter)` — The main `FlowRouterTitle` constructor that accepts `FlowRouter` as the only argument
- `FlowRouterTitle#set(title: string)` — The only method that changes `document.title` during runtime

After `new FlowRouterTitle(FlowRouter)` instance is initiated it extends `FlowRouter.router()` and `FlowRouter.group()` methods and `FlowRouter.globals` with support of:

- `title: string` — String property
- `title: function(params, qs, data) => string` — Method returning string
- `titlePrefix: string` — String property for page's title prefix
- `titlePrefix: function(params, qs, data) => string` — Method returning string for page's title prefix

## Usage

Initialize `FlowRouterTitle` class by passing `FlowRouter` object. Right after creating all routes:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

FlowRouter.route('/', {
  action() { /* ... */ },
  title: 'Title'
  /* ... */
});

const titleHandler = new FlowRouterTitle(FlowRouter);
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
titleHandler.set('My Awesome Title String'); // <- Returns `true`

// `.set()` method accepts {string} only
// Invalid values won't throw an exception
// instead it will simply return `false`
```

### Function context

Use function context (*with [`data`](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md) hook*):

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  async data(params) {
    return await Collections.Posts.findOneAsync(params._id);
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
FlowRouter.route('/page/:_id/:slug', {
  name: 'somePage',
  title(params) {
    return `Page ${params.slug}`;
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

## Support this project

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-flowroutertitle-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-flowroutertitle-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-flowroutertitle-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/Meteor-flow-router-title)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/flow-router-title)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
