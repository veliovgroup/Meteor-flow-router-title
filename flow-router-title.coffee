export class FlowRouterTitle
  constructor: (@router) -> 
    _self = @
    hardCodedTitle = document.title or null
    title = new ReactiveVar hardCodedTitle

    title.set = (newValue) ->
      if @curValue isnt newValue
        unless hardCodedTitle
          hardCodedTitle = document.title
        document.title = newValue
        @curValue = newValue
      return

    @titleHandler = (context, redirect, stop, data) =>
      defaultTitle      = null
      _context          = _.extend context, {query: context.queryParams}
      _arguments        = [context.params, context.queryParams, data]
      _groupTitlePrefix = @_getParentPrefix @router._current?.route?.group, _context, _arguments

      if @router.globals.length
        for option in @router.globals
          if _.isObject(option) and _.has option, 'title'
            defaultTitle = option.title

      if context.route?.group?.options
        _routeTitle = context.route.options?.title
        _routeTitle = _routeTitle.apply _context, _arguments if _.isFunction _routeTitle

        _groupTitle = context.route.group.options?.title
        _groupTitle = _groupTitle.apply _context, _arguments if _.isFunction _groupTitle

        unless _routeTitle
          _title = _groupTitlePrefix + (_groupTitle or defaultTitle or hardCodedTitle)
        else if _routeTitle and _groupTitlePrefix
          _title = _groupTitlePrefix + _routeTitle
        else
          _title = _groupTitlePrefix + (_routeTitle or defaultTitle or hardCodedTitle)

      else
        _title = context.route.options?.title or defaultTitle or hardCodedTitle
        _title = _title.apply _context, _arguments if _.isFunction _title

      if _.isString _title
        title.set _title
        context.context.title = _title if context?.context
      return

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
      return

  _getParentPrefix: (group, _context, _arguments, i = 0) ->
    prefix = ''
    i++

    if group
      if group.options?.titlePrefix
        if (_context.route.options?.title and i is 1) or i isnt 1
          _gt     = group.options.titlePrefix
          _gt     = _gt.apply _context, _arguments if _.isFunction _gt
          prefix += _gt
      prefix = @_getParentPrefix(group.parent, _context, _arguments, i) + prefix if group.parent

    return prefix