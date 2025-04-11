(function (e, t) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      t();
    } else if (typeof define === "function" && define.amd) {
      define(t);
    } else {
      t();
    }
  })(0, function () {
    "use strict";
  
    function e(e) {
      var t = this.constructor;
      return this.then(
        function (n) {
          return t.resolve(e()).then(function () {
            return n;
          });
        },
        function (n) {
          return t.resolve(e()).then(function () {
            return t.reject(n);
          });
        }
      );
    }
  
    function t(e) {
      return new this(function (t, n) {
        function r(e, n) {
          if (n && (typeof n === "object" || typeof n === "function")) {
            var f = n.then;
            if (typeof f === "function") {
              return void f.call(
                n,
                function (t) {
                  r(e, t);
                },
                function (n) {
                  o[e] = { status: "rejected", reason: n };
                  if (--i === 0) t(o);
                }
              );
            }
          }
          o[e] = { status: "fulfilled", value: n };
          if (--i === 0) t(o);
        }
  
        if (!e || typeof e.length === "undefined") {
          return n(
            new TypeError(typeof e + " " + e + " is not iterable (cannot read property Symbol(Symbol.iterator))")
          );
        }
  
        var o = Array.prototype.slice.call(e);
        if (o.length === 0) return t([]);
  
        var i = o.length;
        for (var f = 0; f < o.length; f++) r(f, o[f]);
      });
    }
  
    function n(e, t) {
      this.name = "AggregateError";
      this.errors = e;
      this.message = t || "";
    }
  
    function r(e) {
      var t = this;
      return new t(function (r, o) {
        if (!e || typeof e.length === "undefined") return o(new TypeError("Promise.any accepts an array"));
  
        var i = Array.prototype.slice.call(e);
        if (i.length === 0) return o();
  
        var f = [];
        for (var u = 0; u < i.length; u++) {
          try {
            t.resolve(i[u])
              .then(r)
              .catch(function (e) {
                f.push(e);
                if (f.length === i.length) o(new n(f, "All promises were rejected"));
              });
          } catch (c) {
            o(c);
          }
        }
      });
    }
  
    function o(e) {
      return !!(e && typeof e.length !== "undefined");
    }
  
    function i() {}
  
    function f(e) {
      if (!(this instanceof f)) throw new TypeError("Promises must be constructed via new");
      if (typeof e !== "function") throw new TypeError("not a function");
  
      this._state = 0;
      this._handled = false;
      this._value = undefined;
      this._deferreds = [];
  
      s(e, this);
    }
  
    function u(e, t) {
      while (e._state === 3) e = e._value;
  
      if (e._state !== 0) {
        e._handled = true;
        f._immediateFn(function () {
          var n = e._state === 1 ? t.onFulfilled : t.onRejected;
          if (n !== null) {
            var r;
            try {
              r = n(e._value);
            } catch (o) {
              return a(t.promise, o);
            }
            c(t.promise, r);
          } else {
            (e._state === 1 ? c : a)(t.promise, e._value);
          }
        });
      } else {
        e._deferreds.push(t);
      }
    }
  
    function c(e, t) {
      try {
        if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
  
        if (t && (typeof t === "object" || typeof t === "function")) {
          var n = t.then;
          if (t instanceof f) {
            e._state = 3;
            e._value = t;
            l(e);
            return;
          }
  
          if (typeof n === "function") {
            s(n.bind(t), e);
            return;
          }
        }
  
        e._state = 1;
        e._value = t;
        l(e);
      } catch (r) {
        a(e, r);
      }
    }
  
    function a(e, t) {
      e._state = 2;
      e._value = t;
      l(e);
    }
  
    function l(e) {
      if (e._state === 2 && e._deferreds.length === 0) {
        f._immediateFn(function () {
          if (!e._handled) f._unhandledRejectionFn(e._value);
        });
      }
  
      for (var t = 0; t < e._deferreds.length; t++) {
        u(e, e._deferreds[t]);
      }
  
      e._deferreds = null;
    }
  
    function s(e, t) {
      var n = false;
      try {
        e(
          function (e) {
            if (n) return;
            n = true;
            c(t, e);
          },
          function (e) {
            if (n) return;
            n = true;
            a(t, e);
          }
        );
      } catch (r) {
        if (n) return;
        n = true;
        a(t, r);
      }
    }
  
    n.prototype = Error.prototype;
  
    var d = setTimeout;
  
    f.prototype.catch = function (e) {
      return this.then(null, e);
    };
  
    f.prototype.then = function (e, t) {
      var n = new this.constructor(i);
      u(this, new (function (e, t, n) {
        this.onFulfilled = typeof e === "function" ? e : null;
        this.onRejected = typeof t === "function" ? t : null;
        this.promise = n;
      })(e, t, n));
      return n;
    };
  
    f.prototype.finally = e;
    f.all = function (e) {
      return new f(function (t, n) {
        function r(e, o) {
          try {
            if (o && (typeof o === "object" || typeof o === "function")) {
              var u = o.then;
              if (typeof u === "function") {
                return void u.call(
                  o,
                  function (t) {
                    r(e, t);
                  },
                  n
                );
              }
            }
            i[e] = o;
            if (--f === 0) t(i);
          } catch (c) {
            n(c);
          }
        }
  
        if (!o(e)) return n(new TypeError("Promise.all accepts an array"));
  
        var i = Array.prototype.slice.call(e);
        if (i.length === 0) return t([]);
  
        var f = i.length;
        for (var u = 0; u < i.length; u++) r(u, i[u]);
      });
    };
  
    f.any = r;
    f.allSettled = t;
  
    f.resolve = function (e) {
      return e && typeof e === "object" && e.constructor === f
        ? e
        : new f(function (t) {
            t(e);
          });
    };
  
    f.reject = function (e) {
      return new f(function (t, n) {
        n(e);
      });
    };
  
    f.race = function (e) {
      return new f(function (t, n) {
        if (!o(e)) return n(new TypeError("Promise.race accepts an array"));
        for (var r = 0; r < e.length; r++) {
          f.resolve(e[r]).then(t, n);
        }
      });
    };
  
    f._immediateFn =
      typeof setImmediate === "function"
        ? function (e) {
            setImmediate(e);
          }
        : function (e) {
            d(e, 0);
          };
  
    f._unhandledRejectionFn = function (e) {
      if (typeof console !== "undefined" && console) {
        console.warn("Possible Unhandled Promise Rejection:", e);
      }
    };
  
    var p = (function () {
      if (typeof self !== "undefined") return self;
      if (typeof window !== "undefined") return window;
      if (typeof global !== "undefined") return global;
      throw Error("unable to locate global object");
    })();
  
    if (typeof p.Promise !== "function") {
      p.Promise = f;
    } else {
      if (!p.Promise.prototype.finally) {
        p.Promise.prototype.finally = e;
      }
      if (!p.Promise.allSettled) {
        p.Promise.allSettled = t;
      }
      if (!p.Promise.any) {
        p.Promise.any = r;
      }
    }
  });