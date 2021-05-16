! function(r) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = r();
    else if ("function" == typeof define && define.amd) define([], r);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).robustPointInPolygon = r()
    }
}((function() {
    return function r(t, n, e) {
        function o(i, a) {
            if (!n[i]) {
                if (!t[i]) {
                    var f = "function" == typeof require && require;
                    if (!a && f) return f(i, !0);
                    if (u) return u(i, !0);
                    var s = new Error("Cannot find module '" + i + "'");
                    throw s.code = "MODULE_NOT_FOUND", s
                }
                var c = n[i] = {
                    exports: {}
                };
                t[i][0].call(c.exports, (function(r) {
                    return o(t[i][1][r] || r)
                }), c, c.exports, r, t, n, e)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < e.length; i++) o(e[i]);
        return o
    }({
        1: [function(r, t, n) {
            "use strict";
            var e = r("two-product"),
                o = r("robust-sum"),
                u = r("robust-scale"),
                i = r("robust-subtract"),
                a = 5;

            function f(r, t) {
                for (var n = new Array(r.length - 1), e = 1; e < r.length; ++e)
                    for (var o = n[e - 1] = new Array(r.length - 1), u = 0, i = 0; u < r.length; ++u) u !== t && (o[i++] = r[e][u]);
                return n
            }

            function s(r) {
                if (1 === r.length) return r[0];
                if (2 === r.length) return ["sum(", r[0], ",", r[1], ")"].join("");
                var t = r.length >> 1;
                return ["sum(", s(r.slice(0, t)), ",", s(r.slice(t)), ")"].join("")
            }

            function c(r) {
                if (2 === r.length) return [
                    ["sum(prod(", r[0][0], ",", r[1][1], "),prod(-", r[0][1], ",", r[1][0], "))"].join("")
                ];
                for (var t = [], n = 0; n < r.length; ++n) t.push(["scale(", s(c(f(r, n))), ",", (e = n, 1 & e ? "-" : ""), r[0][n], ")"].join(""));
                return t;
                var e
            }

            function l(r) {
                for (var t = [], n = [], a = function(r) {
                        for (var t = new Array(r), n = 0; n < r; ++n) {
                            t[n] = new Array(r);
                            for (var e = 0; e < r; ++e) t[n][e] = ["m", e, "[", r - n - 1, "]"].join("")
                        }
                        return t
                    }(r), l = [], h = 0; h < r; ++h) 0 == (1 & h) ? t.push.apply(t, c(f(a, h))) : n.push.apply(n, c(f(a, h))), l.push("m" + h);
                var v = s(t),
                    p = s(n),
                    g = "orientation" + r + "Exact",
                    d = ["function ", g, "(", l.join(), "){var p=", v, ",n=", p, ",d=sub(p,n);return d[d.length-1];};return ", g].join("");
                return new Function("sum", "prod", "scale", "sub", d)(o, e, u, i)
            }
            var h = l(3),
                v = l(4),
                p = [function() {
                    return 0
                }, function() {
                    return 0
                }, function(r, t) {
                    return t[0] - r[0]
                }, function(r, t, n) {
                    var e, o = (r[1] - n[1]) * (t[0] - n[0]),
                        u = (r[0] - n[0]) * (t[1] - n[1]),
                        i = o - u;
                    if (o > 0) {
                        if (u <= 0) return i;
                        e = o + u
                    } else {
                        if (!(o < 0)) return i;
                        if (u >= 0) return i;
                        e = -(o + u)
                    }
                    var a = 33306690738754716e-32 * e;
                    return i >= a || i <= -a ? i : h(r, t, n)
                }, function(r, t, n, e) {
                    var o = r[0] - e[0],
                        u = t[0] - e[0],
                        i = n[0] - e[0],
                        a = r[1] - e[1],
                        f = t[1] - e[1],
                        s = n[1] - e[1],
                        c = r[2] - e[2],
                        l = t[2] - e[2],
                        h = n[2] - e[2],
                        p = u * s,
                        g = i * f,
                        d = i * a,
                        b = o * s,
                        w = o * f,
                        m = u * a,
                        y = c * (p - g) + l * (d - b) + h * (w - m),
                        M = 7771561172376103e-31 * ((Math.abs(p) + Math.abs(g)) * Math.abs(c) + (Math.abs(d) + Math.abs(b)) * Math.abs(l) + (Math.abs(w) + Math.abs(m)) * Math.abs(h));
                    return y > M || -y > M ? y : v(r, t, n, e)
                }];

            function g(r) {
                var t = p[r.length];
                return t || (t = p[r.length] = l(r.length)), t.apply(void 0, r)
            }! function() {
                for (; p.length <= a;) p.push(l(p.length));
                for (var r = [], n = ["slow"], e = 0; e <= a; ++e) r.push("a" + e), n.push("o" + e);
                var o = ["function getOrientation(", r.join(), "){switch(arguments.length){case 0:case 1:return 0;"];
                for (e = 2; e <= a; ++e) o.push("case ", e, ":return o", e, "(", r.slice(0, e).join(), ");");
                o.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation"), n.push(o.join(""));
                var u = Function.apply(void 0, n);
                for (t.exports = u.apply(void 0, [g].concat(p)), e = 0; e <= a; ++e) t.exports[e] = p[e]
            }()
        }, {
            "robust-scale": 2,
            "robust-subtract": 3,
            "robust-sum": 4,
            "two-product": 5
        }],
        2: [function(r, t, n) {
            "use strict";
            var e = r("two-product"),
                o = r("two-sum");
            t.exports = function(r, t) {
                var n = r.length;
                if (1 === n) {
                    var u = e(r[0], t);
                    return u[0] ? u : [u[1]]
                }
                var i = new Array(2 * n),
                    a = [.1, .1],
                    f = [.1, .1],
                    s = 0;
                e(r[0], t, a), a[0] && (i[s++] = a[0]);
                for (var c = 1; c < n; ++c) {
                    e(r[c], t, f);
                    var l = a[1];
                    o(l, f[0], a), a[0] && (i[s++] = a[0]);
                    var h = f[1],
                        v = a[1],
                        p = h + v,
                        g = v - (p - h);
                    a[1] = p, g && (i[s++] = g)
                }
                a[1] && (i[s++] = a[1]);
                0 === s && (i[s++] = 0);
                return i.length = s, i
            }
        }, {
            "two-product": 5,
            "two-sum": 6
        }],
        3: [function(r, t, n) {
            "use strict";
            t.exports = function(r, t) {
                var n = 0 | r.length,
                    e = 0 | t.length;
                if (1 === n && 1 === e) return function(r, t) {
                    var n = r + t,
                        e = n - r,
                        o = r - (n - e) + (t - e);
                    if (o) return [o, n];
                    return [n]
                }(r[0], -t[0]);
                var o, u, i = new Array(n + e),
                    a = 0,
                    f = 0,
                    s = 0,
                    c = Math.abs,
                    l = r[f],
                    h = c(l),
                    v = -t[s],
                    p = c(v);
                h < p ? (u = l, (f += 1) < n && (l = r[f], h = c(l))) : (u = v, (s += 1) < e && (v = -t[s], p = c(v)));
                f < n && h < p || s >= e ? (o = l, (f += 1) < n && (l = r[f], h = c(l))) : (o = v, (s += 1) < e && (v = -t[s], p = c(v)));
                var g, d, b = o + u,
                    w = b - o,
                    m = u - w,
                    y = m,
                    M = b;
                for (; f < n && s < e;) h < p ? (o = l, (f += 1) < n && (l = r[f], h = c(l))) : (o = v, (s += 1) < e && (v = -t[s], p = c(v))), (m = (u = y) - (w = (b = o + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g;
                for (; f < n;)(m = (u = y) - (w = (b = (o = l) + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g, (f += 1) < n && (l = r[f]);
                for (; s < e;)(m = (u = y) - (w = (b = (o = v) + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g, (s += 1) < e && (v = -t[s]);
                y && (i[a++] = y);
                M && (i[a++] = M);
                a || (i[a++] = 0);
                return i.length = a, i
            }
        }, {}],
        4: [function(r, t, n) {
            "use strict";
            t.exports = function(r, t) {
                var n = 0 | r.length,
                    e = 0 | t.length;
                if (1 === n && 1 === e) return function(r, t) {
                    var n = r + t,
                        e = n - r,
                        o = r - (n - e) + (t - e);
                    if (o) return [o, n];
                    return [n]
                }(r[0], t[0]);
                var o, u, i = new Array(n + e),
                    a = 0,
                    f = 0,
                    s = 0,
                    c = Math.abs,
                    l = r[f],
                    h = c(l),
                    v = t[s],
                    p = c(v);
                h < p ? (u = l, (f += 1) < n && (l = r[f], h = c(l))) : (u = v, (s += 1) < e && (v = t[s], p = c(v)));
                f < n && h < p || s >= e ? (o = l, (f += 1) < n && (l = r[f], h = c(l))) : (o = v, (s += 1) < e && (v = t[s], p = c(v)));
                var g, d, b = o + u,
                    w = b - o,
                    m = u - w,
                    y = m,
                    M = b;
                for (; f < n && s < e;) h < p ? (o = l, (f += 1) < n && (l = r[f], h = c(l))) : (o = v, (s += 1) < e && (v = t[s], p = c(v))), (m = (u = y) - (w = (b = o + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g;
                for (; f < n;)(m = (u = y) - (w = (b = (o = l) + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g, (f += 1) < n && (l = r[f]);
                for (; s < e;)(m = (u = y) - (w = (b = (o = v) + u) - o)) && (i[a++] = m), y = M - ((g = M + b) - (d = g - M)) + (b - d), M = g, (s += 1) < e && (v = t[s]);
                y && (i[a++] = y);
                M && (i[a++] = M);
                a || (i[a++] = 0);
                return i.length = a, i
            }
        }, {}],
        5: [function(r, t, n) {
            "use strict";
            t.exports = function(r, t, n) {
                var o = r * t,
                    u = e * r,
                    i = u - (u - r),
                    a = r - i,
                    f = e * t,
                    s = f - (f - t),
                    c = t - s,
                    l = a * c - (o - i * s - a * s - i * c);
                if (n) return n[0] = l, n[1] = o, n;
                return [l, o]
            };
            var e = +(Math.pow(2, 27) + 1)
        }, {}],
        6: [function(r, t, n) {
            "use strict";
            t.exports = function(r, t, n) {
                var e = r + t,
                    o = e - r,
                    u = t - o,
                    i = r - (e - o);
                if (n) return n[0] = i + u, n[1] = e, n;
                return [i + u, e]
            }
        }, {}],
        7: [function(r, t, n) {
            t.exports = function(r, t) {
                for (var n = t[0], o = t[1], u = r.length, i = 1, a = u, f = 0, s = u - 1; f < a; s = f++) {
                    var c = r[f],
                        l = r[s],
                        h = c[1],
                        v = l[1];
                    if (v < h) {
                        if (v < o && o < h) {
                            if (0 === (d = e(c, l, t))) return 0;
                            i ^= 0 < d | 0
                        } else if (o === h) {
                            var p = (g = r[(f + 1) % u])[1];
                            if (h < p) {
                                if (0 === (d = e(c, l, t))) return 0;
                                i ^= 0 < d | 0
                            }
                        }
                    } else if (h < v) {
                        if (h < o && o < v) {
                            if (0 === (d = e(c, l, t))) return 0;
                            i ^= d < 0 | 0
                        } else if (o === h) {
                            var g = r[(f + 1) % u];
                            if ((p = g[1]) < h) {
                                var d;
                                if (0 === (d = e(c, l, t))) return 0;
                                i ^= d < 0 | 0
                            }
                        }
                    } else if (o === h) {
                        var b = Math.min(c[0], l[0]),
                            w = Math.max(c[0], l[0]);
                        if (0 === f) {
                            for (; s > 0;) {
                                var m = (s + u - 1) % u;
                                if ((x = r[m])[1] !== o) break;
                                var y = x[0];
                                b = Math.min(b, y), w = Math.max(w, y), s = m
                            }
                            if (0 === s) return b <= n && n <= w ? 0 : 1;
                            a = s + 1
                        }
                        for (var M = r[(s + u - 1) % u][1]; f + 1 < a;) {
                            var x;
                            if ((x = r[f + 1])[1] !== o) break;
                            y = x[0];
                            b = Math.min(b, y), w = Math.max(w, y), f += 1
                        }
                        if (b <= n && n <= w) return 0;
                        var j = r[(f + 1) % u][1];
                        n < b && M < o != j < o && (i ^= 1)
                    }
                }
                return 2 * i - 1
            };
            var e = r("robust-orientation")
        }, {
            "robust-orientation": 1
        }]
    }, {}, [7])(7)
}));