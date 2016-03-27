class FlowRouterTitle
  constructor: (@router) -> 
    _self = @
    title = new ReactiveVar null
    hardCodedTitle = null

    title.set = (newValue) ->
      if @curValue isnt newValue
        unless hardCodedTitle
          hardCodedTitle = _.clone document.title
        document.title = newValue
        @curValue = newValue

    @titleHandler = (context, redirect, stop, data) =>
      defaultTitle = null
      _context     = _.extend context, {query: context.queryParams}
      _arguments   = [context.params, context.queryParams, data]

      if @router.globals.length
        for option in @router.globals
          if _.isObject(option) and _.has option, 'title'
            defaultTitle = option.title

      if context.route?.group?.options
        _routeTitle       = context.route.options?.title
        _routeTitle       = _routeTitle.apply _context, _arguments if _.isFunction _routeTitle

        _groupTitle       = context.route.group.options?.title
        _groupTitle       = _groupTitle.apply _context, _arguments if _.isFunction _groupTitle

        _groupTitlePrefix = context.route.group.options?.titlePrefix
        _groupTitlePrefix = _groupTitlePrefix.apply _context, _arguments if _.isFunction _groupTitlePrefix

        unless _routeTitle
          _title = _groupTitle or defaultTitle or hardCodedTitle
        else if _routeTitle and _groupTitlePrefix
          _title = _groupTitlePrefix + _routeTitle
        else
          _title = _routeTitle or defaultTitle or hardCodedTitle

      else
        _title = context.route.options?.title or defaultTitle or hardCodedTitle

      _title = _title.apply _context, _arguments if _.isFunction _title

      if _.isString _title
        title.set _title
        context.context.title = _title if context?.context

    @router.triggers.enter [@titleHandler]

    _orig = @router._notfoundRoute
    @router._notfoundRoute = (context) ->
      _context = route: options: {}
      _context.route.options.title = _self.router.notFound?.title
      if not _.isEmpty _self.router._current
        _self.titleHandler _.extend _self.router._current, _context
      else
        _self.titleHandler _context
      _orig.apply @, arguments