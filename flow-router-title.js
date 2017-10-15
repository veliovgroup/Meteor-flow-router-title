import { _ }           from 'meteor/underscore';
import { Tracker }     from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

export class FlowRouterTitle {
  constructor(router) {
    const self = this;
    this.router = router;
    let hardCodedTitle = document.title || null;
    this.title = new ReactiveVar(hardCodedTitle);
    this.title.set = function(newValue) {
      if (this.curValue !== newValue) {
        if (!hardCodedTitle) {
          hardCodedTitle = document.title;
        }
        document.title = newValue;
        this.curValue = newValue;
      }
    };

    const computations = [];
    this._reactivate = (titleFunc, _context, context, _arguments, cb) => {
      const comp = Tracker.autorun(titleFunc.bind(_context, ..._arguments));
      const compute = () => {
        let result = titleFunc.apply(_context, _arguments);
        if (cb) {
          result = cb(result);
        }

        if (_.isString(result)) {
          self.title.set(result);
          if (context && context.context && _.isObject(context.context)) {
            context.context.title = result;
          }
        }
      };
      comp.onInvalidate(compute);
      compute();
      computations.push(comp);
    };

    this.titleExitHandler = () => {
      for (var i = computations.length - 1; i >= 0; i--) {
        computations[i].stop();
        computations.splice(i, 1);
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
        let _groupTitle = (context.route.group.options && context.route.group.options.title) ? context.route.group.options.title : void 0;

        const applyRouteTitle = (__routeTitle) => {
          if (_.isFunction(__routeTitle)) {
            return __routeTitle.apply(_context, _arguments);
          } else if (_.isString(__routeTitle)) {
            return __routeTitle;
          }
          return '';
        };

        const applyGroupTitle = (__groupTitle) => {
          let __title = '';
          const __routeTitle = applyRouteTitle(_routeTitle);
          if (!__routeTitle) {
            __title = _groupTitlePrefix + applyRouteTitle(__groupTitle || defaultTitle || hardCodedTitle);
          } else if (__routeTitle && _groupTitlePrefix) {
            __title = _groupTitlePrefix + __routeTitle;
          } else {
            __title = _groupTitlePrefix + applyRouteTitle(__routeTitle || defaultTitle || hardCodedTitle);
          }
          return __title;
        };

        if (_.isFunction(_routeTitle)) {
          this._reactivate(_routeTitle, _context, context, _arguments, applyGroupTitle);
          return;
        }

        if (_.isFunction(_groupTitle)) {
          this._reactivate(_groupTitle, _context, context, _arguments, applyGroupTitle);
          return;
        }
        _title = applyGroupTitle(_groupTitle);
      } else {
        _title = (context.route.options && context.route.options.title) ? context.route.options.title : (defaultTitle || hardCodedTitle);
        if (_.isFunction(_title)) {
          this._reactivate(_title, _context, context, _arguments);
        }
      }

      if (_.isString(_title)) {
        self.title.set(_title);
        if (context && context.context && _.isObject(context.context)) {
          context.context.title = _title;
        }
      }
    };

    this.router.triggers.enter([this.titleHandler]);
    this.router.triggers.exit([this.titleExitHandler]);
    const _orig = this.router._notfoundRoute;
    this.router._notfoundRoute = function() {
      const _context = {
        route: {
          options: {}
        }
      };
      _context.route.options.title = (self.router.notFound && self.router.notFound.title) ? self.router.notFound.title : void 0;

      if (!_.isEmpty(self.router._current)) {
        self.titleHandler(_.extend(self.router._current, _context));
      } else {
        self.titleHandler(_context);
      }
      _orig.apply(this, arguments);
    };
  }

  set(str) {
    if (_.isString(str)) {
      this.title.set(str);
      return true;
    }
    return false;
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
