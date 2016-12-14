sm = new SubsManager()

`import { FlowRouter } from 'meteor/ostrio:flow-router-extra';`
FlowRouter.globals.push title: 'Default title'

FlowRouter.notFound = 
  action: -> @render '_layout', '_404', rand: Random.id()
  title: '404: Page not found'

FlowRouter.route '/',
  name: 'index'
  action: -> @render '_layout', 'index', rand: Random.id()

FlowRouter.route '/secondPage',
  name: 'secondPage'
  title: 'Second Page title'
  action: -> @render '_layout', 'secondPage', rand: Random.id()

FlowRouter.route '/thirdPage/:something',
  name: 'thirdPage'
  title: -> "Third Page Title > #{@params.something}"
  action: (params, query) -> @render '_layout', 'thirdPage', rand: params.something

group = FlowRouter.group prefix: '/group', title: "GROUP TITLE", titlePrefix: 'Group > '

group.route '/groupPage1',
  name: 'groupPage1'
  action: (params, query) -> @render '_layout', 'groupPage1', rand: Random.id()

group.route '/groupPage2',
  name: 'groupPage2'
  title: 'Group page 2'
  action: (params, query) -> @render '_layout', 'groupPage2', rand: Random.id()

nestedGroup = group.group prefix: '/level2', title: "LEVEL2 GROUP TITLE", titlePrefix: 'Group Level 2 > '

nestedGroup.route '/withoutTitle',
  name: 'lvl2'
  action: (params, query) -> @render '_layout', 'lvl2', rand: Random.id()

nestedGroup.route '/witTitle',
  name: 'lvl2Title'
  title: 'Level 2 page'
  action: (params, query) -> @render '_layout', 'lvl2Title', rand: Random.id()

FlowRouter.route '/post',
  name: 'post'
  title: (params, query, post) -> post?.title
  action: (params, query, post) -> @render '_layout', 'post', post: post, rand: Random.id()
  waitOn: -> [sm.subscribe('posts')]
  data: -> Collections.posts.findOne()
  whileWaiting: -> @render '_layout', '_loading'

FlowRouter.route '/post/:_id',
  name: 'post.id'
  title: (params, query, post) -> if post then post?.title else '404: Page not found'
  action: (params, query, post) -> @render '_layout', 'post', post: post, rand: Random.id()
  waitOn: -> [sm.subscribe('posts')]
  data: (params) -> Collections.posts.findOne(params._id)
  onNoData:     -> @render '_layout', '_404', rand: Random.id()
  whileWaiting: -> @render '_layout', '_loading'

FlowRouter.route '/imgs',
  name: 'imgs'
  title: (params, query, data) -> if data then data?.title else '404: Page not found'
  action: (params, query, data) -> @render '_layout', 'imgs', data: data, rand: Random.id()
  waitOnResources: (params, query, data) -> {images: data?.images or []}
  data: (params) -> 
    return {
      title: 'DATA TITLE'
      images: [
        'https://static.pexels.com/photos/74536/kitchen-food-nuts-theme-patterns-74536.jpeg'
        'https://static.pexels.com/photos/87439/hornet-wasp-insect-sting-87439.jpeg'
        'https://static.pexels.com/photos/195537/pexels-photo-195537.jpeg'
      ]
    }
  onNoData:     -> @render '_layout', '_404', rand: Random.id()
  whileWaiting: -> @render '_layout', '_loading'

`import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';`
new FlowRouterTitle FlowRouter