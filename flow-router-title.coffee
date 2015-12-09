hardCodedTitle = null
title = new ReactiveVar null

title.set = (newValue) ->
  oldValue = @curValue
  if _.isEqual(oldValue, newValue)
    return
  else
    unless hardCodedTitle
      hardCodedTitle = _.clone document.title
    document.title = newValue
    @curValue = newValue

titleHandler = (context) ->
  defaultTitle = null
  if FlowRouter.globals.length
    for option in FlowRouter.globals
      if _.isObject(option) and _.has option, 'title'
        defaultTitle = option.title
  if context.route?.group?.options
    _routeTitle       = context.route.options?.title
    _routeTitle       = _routeTitle.call _.extend context, {query: context.queryParams} if _.isFunction _routeTitle

    _groupTitle       = context.route.group.options?.title
    _groupTitle       = _groupTitle.call _.extend context, {query: context.queryParams} if _.isFunction _groupTitle

    _groupTitlePrefix = context.route.group.options?.titlePrefix
    _groupTitlePrefix = _groupTitlePrefix.call _.extend context, {query: context.queryParams} if _.isFunction _groupTitlePrefix

    unless _routeTitle
      _title = _groupTitle or defaultTitle or hardCodedTitle
    else if _routeTitle and _groupTitlePrefix
      _title = _groupTitlePrefix + _routeTitle
    else
      _title = _routeTitle or defaultTitle or hardCodedTitle

  else
    _title = context.route.options?.title or defaultTitle or hardCodedTitle

  _title = _title.call _.extend context, {query: context.queryParams} if _.isFunction _title

  if _.isString _title
    title.set _title
    context.context.title = _title if context?.context

FlowRouter.triggers.enter [titleHandler]

_orig = FlowRouter._notfoundRoute
FlowRouter._notfoundRoute = (context) ->
  if FlowRouter?.notFound?.title
    titleHandler if not _.isEmpty @_current then _.extend @_current, route: options: title: FlowRouter.notFound.title else route: options: title: FlowRouter.notFound.title
  _orig.apply @, arguments