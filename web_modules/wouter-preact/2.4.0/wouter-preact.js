import { options, createContext, createElement, isValidElement, cloneElement } from 'preact';
var t,
    u,
    r,
    i = 0,
    o = [],
    c = options.__r,
    f = options.diffed,
    e = options.__c,
    a = options.unmount;

function v(t, r) {
  options.__h && options.__h(u, t, i || r), i = 0;
  var o = u.__H || (u.__H = {
    __: [],
    __h: []
  });
  return t >= o.__.length && o.__.push({}), o.__[t];
}

function m(n) {
  return i = 1, p(E, n);
}

function p(n, r, i) {
  var o = v(t++, 2);
  return o.__c || (o.__c = u, o.__ = [i ? i(r) : E(void 0, r), function (t) {
    var u = n(o.__[0], t);
    o.__[0] !== u && (o.__[0] = u, o.__c.setState({}));
  }]), o.__;
}

function l(r, i) {
  var o = v(t++, 3);
  !options.__s && x(o.__H, i) && (o.__ = r, o.__H = i, u.__H.__h.push(o));
}

function y(r, i) {
  var o = v(t++, 4);
  !options.__s && x(o.__H, i) && (o.__ = r, o.__H = i, u.__h.push(o));
}

function d(n) {
  return i = 5, h(function () {
    return {
      current: n
    };
  }, []);
}

function h(n, u) {
  var r = v(t++, 7);
  return x(r.__H, u) ? (r.__H = u, r.__h = n, r.__ = n()) : r.__;
}

function T(n, t) {
  return i = 8, h(function () {
    return n;
  }, t);
}

function w(n) {
  var r = u.context[n.__c],
      i = v(t++, 9);
  return i.__c = n, r ? (null == i.__ && (i.__ = !0, r.sub(u)), r.props.value) : n.__;
}

function _() {
  o.some(function (t) {
    if (t.__P) try {
      t.__H.__h.forEach(g), t.__H.__h.forEach(q), t.__H.__h = [];
    } catch (u) {
      return t.__H.__h = [], options.__e(u, t.__v), !0;
    }
  }), o = [];
}

function g(n) {
  n.t && n.t();
}

function q(n) {
  var t = n.__();

  "function" == typeof t && (n.t = t);
}

function x(n, t) {
  return !n || t.some(function (t, u) {
    return t !== n[u];
  });
}

function E(n, t) {
  return "function" == typeof t ? t(n) : t;
}

options.__r = function (n) {
  c && c(n), t = 0, (u = n.__c).__H && (u.__H.__h.forEach(g), u.__H.__h.forEach(q), u.__H.__h = []);
}, options.diffed = function (t) {
  f && f(t);
  var u = t.__c;

  if (u) {
    var i = u.__H;
    i && i.__h.length && (1 !== o.push(u) && r === options.requestAnimationFrame || ((r = options.requestAnimationFrame) || function (n) {
      var t,
          u = function u() {
        clearTimeout(r), cancelAnimationFrame(t), setTimeout(n);
      },
          r = setTimeout(u, 100);

      "undefined" != typeof window && (t = requestAnimationFrame(u));
    })(_));
  }
}, options.__c = function (t, u) {
  u.some(function (t) {
    try {
      t.__h.forEach(g), t.__h = t.__h.filter(function (n) {
        return !n.__ || q(n);
      });
    } catch (r) {
      u.some(function (n) {
        n.__h && (n.__h = []);
      }), u = [], options.__e(r, t.__v);
    }
  }), e && e(t, u);
}, options.unmount = function (t) {
  a && a(t);
  var u = t.__c;

  if (u) {
    var r = u.__H;
    if (r) try {
      r.__.forEach(function (n) {
        return n.t && n.t();
      });
    } catch (t) {
      options.__e(t, u.__v);
    }
  }
};

var locationHook = ({
  base: _base = ""
} = {}) => {
  const [path, update] = m(currentPathname(_base));
  const prevPath = d(path);
  l(() => {
    patchHistoryEvents(); // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.

    const checkForUpdates = () => {
      const pathname = currentPathname(_base);
      prevPath.current !== pathname && update(prevPath.current = pathname);
    };

    const events = ["popstate", "pushState", "replaceState"];
    events.map(e => addEventListener(e, checkForUpdates)); // it's possible that an update has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189

    checkForUpdates();
    return () => events.map(e => removeEventListener(e, checkForUpdates));
  }, []); // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.

  const navigate = T((to, replace) => history[replace ? "replaceState" : "pushState"](0, 0, _base + to), []);
  return [path, navigate];
}; // While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031


let patched = 0;

const patchHistoryEvents = () => {
  if (patched) return;
  ["pushState", "replaceState"].map(type => {
    const original = history[type];

    history[type] = function () {
      const result = original.apply(this, arguments);
      const event = new Event(type);
      event.arguments = arguments;
      dispatchEvent(event);
      return result;
    };
  });
  return patched = 1;
};

const currentPathname = (base, path = location.pathname) => !path.indexOf(base) ? path.slice(base.length) || "/" : path; // creates a matcher function


function makeMatcher(makeRegexpFn = pathToRegexp) {
  let cache = {}; // obtains a cached regexp version of the pattern

  const getRegexp = pattern => cache[pattern] || (cache[pattern] = makeRegexpFn(pattern));

  return (pattern, path) => {
    const {
      regexp,
      keys
    } = getRegexp(pattern || "");
    const out = regexp.exec(path);
    if (!out) return [false, null]; // formats an object with matched params

    const params = keys.reduce((params, key, i) => {
      params[key.name] = out[i + 1];
      return params;
    }, {});
    return [true, params];
  };
} // escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202


const escapeRx = str => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"); // returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources


const rxForSegment = (repeat, optional, prefix) => {
  let capture = repeat ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
  if (optional && prefix) capture = "(?:\\/" + capture + ")";
  return capture + (optional ? "?" : "");
};

const pathToRegexp = pattern => {
  const groupRx = /:([A-Za-z0-9_]+)([?+*]?)/g;
  let match = null,
      lastIndex = 0,
      keys = [],
      result = "";

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment, mod] = match; // :foo  [1]      (  )
    // :foo? [0 - 1]  ( o)
    // :foo+ [1 - ∞]  (r )
    // :foo* [0 - ∞]  (ro)

    const repeat = mod === "+" || mod === "*";
    const optional = mod === "?" || mod === "*";
    const prefix = optional && pattern[match.index - 1] === "/" ? 1 : 0;
    const prev = pattern.substring(lastIndex, match.index - prefix);
    keys.push({
      name: segment
    });
    lastIndex = groupRx.lastIndex;
    result += escapeRx(prev) + rxForSegment(repeat, optional, prefix);
  }

  result += escapeRx(pattern.substring(lastIndex));
  return {
    keys,
    regexp: new RegExp("^" + result + "(?:\\/)?$", "i")
  };
};
/*
 * Part 1, Hooks API: useRouter, useRoute and useLocation
 */
// one of the coolest features of `createContext`:
// when no value is provided — default object is used.
// allows us to use the router context as a global ref to store
// the implicitly created router (see `useRouter` below)


const RouterCtx = createContext({});

const buildRouter = ({
  hook: _hook = locationHook,
  base: _base2 = "",
  matcher: _matcher = makeMatcher()
} = {}) => ({
  hook: _hook,
  base: _base2,
  matcher: _matcher
});

const useRouter = () => {
  const globalRef = w(RouterCtx); // either obtain the router from the outer context (provided by the
  // `<Router /> component) or create an implicit one on demand.

  return globalRef.v || (globalRef.v = buildRouter());
};

const useLocation = () => {
  const router = useRouter();
  return router.hook(router);
};

const useRoute = pattern => {
  const [path] = useLocation();
  return useRouter().matcher(pattern, path);
};
/*
 * Part 2, Low Carb Router API: Router, Route, Link, Switch
 */


const Router = props => {
  const ref = d(null); // this little trick allows to avoid having unnecessary
  // calls to potentially expensive `buildRouter` method.
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily

  const value = ref.current || (ref.current = {
    v: buildRouter(props)
  });
  return createElement(RouterCtx.Provider, {
    value: value,
    children: props.children
  });
};

const Route = ({
  path,
  match,
  component,
  children
}) => {
  const useRouteMatch = useRoute(path); // `props.match` is present - Route is controlled by the Switch

  const [matches, params] = match || useRouteMatch;
  if (!matches) return null; // React-Router style `component` prop

  if (component) return createElement(component, {
    params
  }); // support render prop or plain children

  return typeof children === "function" ? children(params) : children;
};

const Link = props => {
  const [, navigate] = useLocation();
  const {
    base
  } = useRouter();
  const href = props.href || props.to;
  const {
    children,
    onClick
  } = props;
  const handleClick = T(event => {
    // ignores the navigation when clicked using right mouse button or
    // by holding a special modifier key: ctrl, command, win, alt, shift
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(href);
    onClick && onClick(event);
  }, [href, onClick, navigate]); // wraps children in `a` if needed

  const extraProps = {
    href: base + href,
    onClick: handleClick,
    to: null
  };
  const jsx = isValidElement(children) ? children : createElement("a", props);
  return cloneElement(jsx, extraProps);
};

const Switch = ({
  children,
  location
}) => {
  const {
    matcher
  } = useRouter();
  const [originalLocation] = useLocation();
  children = Array.isArray(children) ? children : [children];

  for (const element of children) {
    let match = 0;
    if (isValidElement(element) && // we don't require an element to be of type Route,
    // but we do require it to contain a truthy `path` prop.
    // this allows to use different components that wrap Route
    // inside of a switch, for example <AnimatedRoute />.
    element.props.path && (match = matcher(element.props.path, location || originalLocation))[0]) return cloneElement(element, {
      match
    });
  }

  return null;
};

const Redirect = props => {
  const [, push] = useLocation();
  y(() => {
    push(props.href || props.to); // we pass an empty array of dependecies to ensure that
    // we only run the effect once after initial render
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default useRoute;
export { Link, Redirect, Route, Router, Switch, useLocation, useRoute, useRouter };