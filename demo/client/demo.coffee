FlowRouter.globals.push title: 'Default title'

FlowRouter.notFound = 
  action: -> BlazeLayout.render '_layout', content: '_404'
  title: '404: Page not found'

FlowRouter.route '/'
,
  name: 'index'
  action: -> BlazeLayout.render '_layout', content: 'index', rand: Random.id()

FlowRouter.route '/secondPage'
,
  name: 'secondPage'
  title: 'Second Page title'
  action: -> BlazeLayout.render '_layout', content: 'secondPage', rand: Random.id()

FlowRouter.route '/thirdPage/:something'
,
  name: 'thirdPage'
  title: -> "Third Page Title > #{@params.something}"
  action: (params, query) -> BlazeLayout.render '_layout', content: 'thirdPage', rand: params.something

group = FlowRouter.group prefix: '/group', title: "GROUP TITLE", titlePrefix: 'Group > '

group.route '/groupPage1/'
,
  name: 'groupPage1'
  action: (params, query) -> BlazeLayout.render '_layout', content: 'groupPage1', rand: Random.id()

group.route '/groupPage2/'
,
  name: 'groupPage2'
  title: 'Group page 2'
  action: (params, query) -> BlazeLayout.render '_layout', content: 'groupPage2', rand: Random.id()