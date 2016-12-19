/* jshint esversion:6 */
export class FlowRouterTitle {
  constructor(router) {
    let _self = this;
    this.router = router;
    let hardCodedTitle = document.title || null;
    const title = new ReactiveVar(hardCodedTitle);
    title.set = function(newValue) {
      if (this.curValue !== newValue) {
        if (!hardCodedTitle) {
          hardCodedTitle = document.title;
        }
        document.title = newValue;
        this.curValue = newValue;
      }
    };

    this.titleHandler = (context, redirect, stop, data) => {
      let _title;
      let option;
      let ref;
      let ref1;
      let ref3;
      let ref4;
      let ref5;
      let ref6;
      let ref7;
      let defaultTitle = null;
      const _context = _.extend(context, {
        query: context.queryParams
      });
      const _arguments = [context.params, context.queryParams, data];
      let _groupTitlePrefix = this._getParentPrefix((ref = this.router._current) != null ? (ref1 = ref.route) != null ? ref1.group : void 0 : void 0, _context, _arguments);
      if (this.router.globals.length) {
        for (let j = 0, len = this.router.globals.length; j < len; j++) {
          if (_.isObject(this.router.globals[j]) && _.has(this.router.globals[j], 'title')) {
            defaultTitle = this.router.globals[j].title;
          }
        }
      }
      if ((ref3 = context.route) != null ? (ref4 = ref3.group) != null ? ref4.options : void 0 : void 0) {
        let _routeTitle = (ref5 = context.route.options) != null ? ref5.title : void 0;
        if (_.isFunction(_routeTitle)) {
          _routeTitle = _routeTitle.apply(_context, _arguments);
        }

        let _groupTitle = (ref6 = context.route.group.options) != null ? ref6.title : void 0;
        if (_.isFunction(_groupTitle)) {
          _groupTitle = _groupTitle.apply(_context, _arguments);
        }
        if (!_routeTitle) {
          _title = _groupTitlePrefix + (_groupTitle || defaultTitle || hardCodedTitle);
        } else if (_routeTitle && _groupTitlePrefix) {
          _title = _groupTitlePrefix + _routeTitle;
        } else {
          _title = _groupTitlePrefix + (_routeTitle || defaultTitle || hardCodedTitle);
        }
      } else {
        _title = ((ref7 = context.route.options) != null ? ref7.title : void 0) || defaultTitle || hardCodedTitle;
        if (_.isFunction(_title)) {
          _title = _title.apply(_context, _arguments);
        }
      }
      if (_.isString(_title)) {
        title.set(_title);
        if (context != null ? context.context : void 0) {
          context.context.title = _title;
        }
      }
    };

    this.router.triggers.enter([this.titleHandler]);
    const _orig = this.router._notfoundRoute;
    this.router._notfoundRoute = function(context) {
      let ref;
      const _context = {
        route: {
          options: {}
        }
      };
      _context.route.options.title = (ref = _self.router.notFound) != null ? ref.title : void 0;
      if (!_.isEmpty(_self.router._current)) {
        _self.titleHandler(_.extend(_self.router._current, _context));
      } else {
        _self.titleHandler(_context);
      }
      _orig.apply(this, arguments);
    };
  }

  _getParentPrefix(group, _context, _arguments, i) {
    let ref;
    let ref1;
    if (i == null) {
      i = 0;
    }
    let prefix = '';
    i++;
    if (group) {
      if ((ref = group.options) != null ? ref.titlePrefix : void 0) {
        if ((((ref1 = _context.route.options) != null ? ref1.title : void 0) && i === 1) || i !== 1) {
          let _gt = group.options.titlePrefix;
          if (_.isFunction(_gt)) {
            _gt = _gt.apply(_context, _arguments);
          }
          prefix += _gt;
        }
      }

      if (group.parent) {
        prefix = this._getParentPrefix(group.parent, _context, _arguments, i) + prefix;
      }
    }
    return prefix;
  }
}