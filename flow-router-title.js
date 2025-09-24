import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

const helpers = {
  isObject(obj) {
    if (obj === null || this.isArray(obj) || this.isFunction(obj)) {
      return false;
    }
    return obj === Object(obj);
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  isFunction(obj) {
    return typeof obj === 'function';
  },
  isEmpty(obj) {
    if (this.isDate(obj)) {
      return false;
    }
    if (this.isObject(obj)) {
      return !Object.keys(obj).length;
    }
    if (this.isArray(obj) || this.isString(obj)) {
      return !obj.length;
    }
    return false;
  },
  has(obj, path) {
    if (!this.isObject(obj)) {
      return false;
    }
    if (!this.isArray(path)) {
      return this.isObject(obj) && Object.prototype.hasOwnProperty.call(obj, path);
    }
    return false;
  },
  isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },
  isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
  }
};

const applyRouteTitle = (title, context, args) => {
  if (helpers.isFunction(title)) {
    return title.apply(context, args);
  } else if (helpers.isString(title)) {
    return title;
  }
  return '';
};

const getParentPrefix = (group, context, args, _i = 0) => {
  let prefix = '';
  const i = _i + 1;
  if (group) {
    if (group.options && group.options.titlePrefix) {
      if ((context.route?.options?.title && i === 1) || i !== 1) {
        let _gt = group.options.titlePrefix;
        if (helpers.isFunction(_gt)) {
          _gt = _gt.apply(context, args);
        }
        prefix += _gt;
      }
    }

    if (group.parent) {
      prefix = getParentPrefix(group.parent, context, args, i) + prefix;
    }
  }
  return prefix;
};

const applyGroupTitle = function (groupTitle, context, args) {
  let title = '';
  const routeTitle = applyRouteTitle(context.route?.options?.title, context, args);
  const groupTitlePrefix = getParentPrefix(((this.router._current?.route?.group) ? this.router._current.route.group : void 0), context, args);

  if (!routeTitle) {
    title = groupTitlePrefix + applyRouteTitle(groupTitle || this.defaultTitle || this.hardCodedTitle, context, args);
  } else if (routeTitle && groupTitlePrefix) {
    title = groupTitlePrefix + routeTitle;
  } else {
    title = groupTitlePrefix + applyRouteTitle(routeTitle || this.defaultTitle || this.hardCodedTitle, context, args);
  }
  return title;
};

export class FlowRouterTitle {
  constructor(router) {
    const self = this;
    const computations = [];
    this.router = router;
    this.hardCodedTitle = document.title || null;
    this.defaultTitle = null;

    if (this.router.globals.length) {
      for (let j = 0; j < this.router.globals.length; j++) {
        if (helpers.isObject(this.router.globals[j]) && helpers.has(this.router.globals[j], 'title')) {
          this.defaultTitle = this.router.globals[j].title;
          break;
        }
      }
    }

    this.title = new ReactiveVar(this.hardCodedTitle);
    this.title.set = function(newValue) {
      if (this.curValue !== newValue) {
        if (!self.hardCodedTitle) {
          self.hardCodedTitle = document.title;
        }
        setTimeout(() => {
          document.title = newValue;
        }, 0);
        this.curValue = newValue;
      }
    };

    this._reactivate = (titleFunc, context, _arguments, cb) => {
      const compute = () => {
        let result = titleFunc.apply(context, _arguments);
        if (cb) {
          result = cb.call(this, result, context, _arguments);
        }

        if (helpers.isString(result)) {
          self.title.set(result);
          if (context?.context) {
            context.context.title = result;
          }
        }
      };

      const comp = Tracker.autorun(compute);
      computations.push(comp);
    };

    this.titleExitHandler = () => {
      for (let i = computations.length - 1; i >= 0; i--) {
        computations[i].stop();
        computations.splice(i, 1);
      }
    };

    this.titleHandler = (context, _redirect, _stop, data) => {
      let _title;
      const _context = Object.assign({}, context, { query: context.queryParams });
      const _arguments = [context.params, context.queryParams, data];

      if (context.route?.group?.options) {
        const _routeTitle = (context.route.options?.title) ? context.route.options.title : void 0;
        const _groupTitle = (context.route.group.options?.title) ? context.route.group.options.title : void 0;

        if (helpers.isFunction(_routeTitle)) {
          this._reactivate(_routeTitle, _context, _arguments, applyGroupTitle.bind(this));
          return;
        }

        if (helpers.isFunction(_groupTitle)) {
          this._reactivate(_groupTitle, _context, _arguments, applyGroupTitle.bind(this));
          return;
        }
        _title = applyGroupTitle.call(this, _groupTitle, _context, _arguments);
      } else {
        _title = (context.route.options?.title) ? context.route.options.title : (this.defaultTitle || this.hardCodedTitle);
        if (helpers.isFunction(_title)) {
          this._reactivate(_title, _context, _arguments);
        }
      }

      if (helpers.isString(_title)) {
        self.title.set(_title);
        if (context?.context && helpers.isObject(context.context)) {
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

      if (!helpers.isEmpty(self.router._current)) {
        self.titleHandler(Object.assign({}, self.router._current, _context));
      } else {
        self.titleHandler(_context);
      }
      _orig.apply(this, arguments);
    };
  }

  set(str) {
    if (helpers.isString(str)) {
      this.title.set(str);
      return true;
    }
    return false;
  }
}
