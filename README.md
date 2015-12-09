Reactive page title for meteor within flow-router
========
Change `document.title` on the fly within [flow-router](https://github.com/kadirahq/flow-router)

This package supports `title` option defined in list below, ordered by prioritization:
 - `FlowRouter.route()` [*overrides all*]
 - `FlowRouter.group()`
 - `FlowRouter.globals`
 - `<title>Text</title>`[*might be overridden by any above*]

This package tested and works like a charm with most common Meteor's packages:
 - [fast-render](https://github.com/kadirahq/fast-render)
 - [subs-manager](https://github.com/kadirahq/subs-manager)
 - [appcache](https://github.com/meteor/meteor/wiki/AppCache)
 - [spiderable](https://github.com/jazeee/jazeee-meteor-spiderable)

Install:
========
```shell
meteor add ostrio:iron-router-title
```

Demo App:
========
 - [Source](https://github.com/VeliovGroup/Meteor-flow-router-title/tree/master/demo)
 - [Live](http://flow-router-title.meteor.com)

Usage:
========
Set `title` property in route's or group's configuration:
```coffeescript
# Set default document.title value in 
# case router has no title property
FlowRouter.globals.push title: 'Default title'

FlowRouter.route '/me/account',
  name: 'account'
  title: 'My Account'
```

Use group context:
```coffeescript
account = FlowRouter.group prefix: '/account', title: "Account", titlePrefix: 'Account > '

account.route '/', name: 'accountIndex' # Title will be `Account`

account.route '/settings',
  name: 'AccountSettings'
  title: 'My Settings' # Title will be `Account > My Settings`
```

To change `title` reactively, just pass it as function:
```coffeescript
FlowRouter.route '/me/account',
  name: 'account'
  title: -> i18n.get 'account.document.title' # In this example we used `ostrio:i18n` package

# Use params from route
FlowRouter.route '/page/:something',
  name: 'somePage'
  title: -> "Page #{@params.something}"
```

All examples above is supported to be a function or text:
 - `FlowRouter.globals.push([{title: function(){...}}])`
 - `FlowRouter.globals.push([{title: 'Title text'}])`
 - `FlowRouter.group([{title: function(){...}, titlePrefix: function(){...}}])`
 - `FlowRouter.group([{title: 'Title text', titlePrefix: 'Title prefix text'}])`
 - `FlowRouter.route('/path', [{title: function(){...}}])`
 - `FlowRouter.route('/path', [{title: 'Title text'}])`
