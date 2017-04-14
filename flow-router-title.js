import { _ }           from 'meteor/underscore';
import { ReactiveVar } from 'meteor/reactive-var';

export class FlowRouterTitle {
  constructor(router) {
    const _self = this;
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
      let defaultTitle = null;
      const _context = _.extend(context, { query: context.queryParams });
      const _arguments = [context.params, context.queryParams, data];
      let _groupTitlePrefix = this._getParentPrefix(((this.router._current && this.router._current.route && this.router._current.route.group) ? this.router._current.route.group : void 0), _context, _arguments);

      if (this.router.globals.length) {
        for (let j = 0; j < this.router.globals.length; j++) {
          if (_.isObject(this.router.globals[j]) && _.has(this.router.globals[j], 'title')) {
            defaultTitle = this.router.globals[j].title;
            break;
          }
        }
      }

      if (context.route && context.route.group && context.route.group.options) {
        let _routeTitle = (context.route.options && context.route.options.title) ? context.route.options.title : void 0;
        if (_.isFunction(_routeTitle)) {
          _routeTitle = _routeTitle.apply(_context, _arguments);
        }

        let _groupTitle = (context.route.group.options && context.route.group.options.title) ? context.route.group.options.title : void 0;
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
        _title = (context.route.options && context.route.options.title) ? context.route.options.title : (defaultTitle || hardCodedTitle);
        if (_.isFunction(_title)) {
          _title = _title.apply(_context, _arguments);
        }
      }

      if (_.isString(_title)) {
        title.set(_title);
        if (context && context.context && _.isObject(context.context)) {
          context.context.title = _title;
        }
      }
    };

    this.router.triggers.enter([this.titleHandler]);
    const _orig = this.router._notfoundRoute;
    this.router._notfoundRoute = function() {
      const _context = {
        route: {
          options: {}
        }
      };
      _context.route.options.title = (_self.router.notFound && _self.router.notFound.title) ? _self.router.notFound.title : void 0;

      if (!_.isEmpty(_self.router._current)) {
        _self.titleHandler(_.extend(_self.router._current, _context));
      } else {
        _self.titleHandler(_context);
      }
      _orig.apply(this, arguments);
    };
  }

  _getParentPrefix(group, _context, _arguments, i = 0) {
    let prefix = '';
    i++;
    if (group) {
      if (group.options && group.options.titlePrefix) {
        if ((_context.route.options && _context.route.options.title && i === 1) || i !== 1) {
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
