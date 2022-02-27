Ht = function (e) {
    function t(e, t) {
        return (e << t) | (e >>> (32 - t))
    }
    function n(e, t) {
        var n, i, r, o, a
        return (
            (r = 2147483648 & e),
            (o = 2147483648 & t),
            (a = (1073741823 & e) + (1073741823 & t)),
            (n = 1073741824 & e) & (i = 1073741824 & t)
                ? 2147483648 ^ a ^ r ^ o
                : n | i
                ? 1073741824 & a
                    ? 3221225472 ^ a ^ r ^ o
                    : 1073741824 ^ a ^ r ^ o
                : a ^ r ^ o
        )
    }
    function i(e, i, r, o, a, s, l) {
        return (
            (e = n(
                e,
                n(
                    n(
                        (function (e, t, n) {
                            return (e & t) | (~e & n)
                        })(i, r, o),
                        a
                    ),
                    l
                )
            )),
            n(t(e, s), i)
        )
    }
    function r(e, i, r, o, a, s, l) {
        return (
            (e = n(
                e,
                n(
                    n(
                        (function (e, t, n) {
                            return (e & n) | (t & ~n)
                        })(i, r, o),
                        a
                    ),
                    l
                )
            )),
            n(t(e, s), i)
        )
    }
    function o(e, i, r, o, a, s, l) {
        return (
            (e = n(
                e,
                n(
                    n(
                        (function (e, t, n) {
                            return e ^ t ^ n
                        })(i, r, o),
                        a
                    ),
                    l
                )
            )),
            n(t(e, s), i)
        )
    }
    function a(e, i, r, o, a, s, l) {
        return (
            (e = n(
                e,
                n(
                    n(
                        (function (e, t, n) {
                            return t ^ (e | ~n)
                        })(i, r, o),
                        a
                    ),
                    l
                )
            )),
            n(t(e, s), i)
        )
    }
    function s(e) {
        var t,
            n = '',
            i = ''
        for (t = 0; t <= 3; t++)
            n += (i = '0' + ((e >>> (8 * t)) & 255).toString(16)).substr(
                i.length - 2,
                2
            )
        return n
    }
    var l,
        c,
        u,
        h,
        d,
        f,
        p,
        m,
        g,
        A = Array()
    for (
        A = (function (e) {
            for (
                var t,
                    n = e.length,
                    i = n + 8,
                    r = 16 * ((i - (i % 64)) / 64 + 1),
                    o = Array(r - 1),
                    a = 0,
                    s = 0;
                s < n;

            )
                (a = (s % 4) * 8),
                    (o[(t = (s - (s % 4)) / 4)] =
                        o[t] | (e.charCodeAt(s) << a)),
                    s++
            return (
                (a = (s % 4) * 8),
                (o[(t = (s - (s % 4)) / 4)] = o[t] | (128 << a)),
                (o[r - 2] = n << 3),
                (o[r - 1] = n >>> 29),
                o
            )
        })(
            (e = (function (e) {
                e = e.replace(/\r\n/g, '\n')
                for (var t = '', n = 0; n < e.length; n++) {
                    var i = e.charCodeAt(n)
                    i < 128
                        ? (t += String.fromCharCode(i))
                        : i > 127 && i < 2048
                        ? ((t += String.fromCharCode((i >> 6) | 192)),
                          (t += String.fromCharCode((63 & i) | 128)))
                        : ((t += String.fromCharCode((i >> 12) | 224)),
                          (t += String.fromCharCode(((i >> 6) & 63) | 128)),
                          (t += String.fromCharCode((63 & i) | 128)))
                }
                return t
            })(e))
        ),
            f = 1732584193,
            p = 4023233417,
            m = 2562383102,
            g = 271733878,
            l = 0;
        l < A.length;
        l += 16
    )
        (c = f),
            (u = p),
            (h = m),
            (d = g),
            (f = i(f, p, m, g, A[l + 0], 7, 3614090360)),
            (g = i(g, f, p, m, A[l + 1], 12, 3905402710)),
            (m = i(m, g, f, p, A[l + 2], 17, 606105819)),
            (p = i(p, m, g, f, A[l + 3], 22, 3250441966)),
            (f = i(f, p, m, g, A[l + 4], 7, 4118548399)),
            (g = i(g, f, p, m, A[l + 5], 12, 1200080426)),
            (m = i(m, g, f, p, A[l + 6], 17, 2821735955)),
            (p = i(p, m, g, f, A[l + 7], 22, 4249261313)),
            (f = i(f, p, m, g, A[l + 8], 7, 1770035416)),
            (g = i(g, f, p, m, A[l + 9], 12, 2336552879)),
            (m = i(m, g, f, p, A[l + 10], 17, 4294925233)),
            (p = i(p, m, g, f, A[l + 11], 22, 2304563134)),
            (f = i(f, p, m, g, A[l + 12], 7, 1804603682)),
            (g = i(g, f, p, m, A[l + 13], 12, 4254626195)),
            (m = i(m, g, f, p, A[l + 14], 17, 2792965006)),
            (f = r(
                f,
                (p = i(p, m, g, f, A[l + 15], 22, 1236535329)),
                m,
                g,
                A[l + 1],
                5,
                4129170786
            )),
            (g = r(g, f, p, m, A[l + 6], 9, 3225465664)),
            (m = r(m, g, f, p, A[l + 11], 14, 643717713)),
            (p = r(p, m, g, f, A[l + 0], 20, 3921069994)),
            (f = r(f, p, m, g, A[l + 5], 5, 3593408605)),
            (g = r(g, f, p, m, A[l + 10], 9, 38016083)),
            (m = r(m, g, f, p, A[l + 15], 14, 3634488961)),
            (p = r(p, m, g, f, A[l + 4], 20, 3889429448)),
            (f = r(f, p, m, g, A[l + 9], 5, 568446438)),
            (g = r(g, f, p, m, A[l + 14], 9, 3275163606)),
            (m = r(m, g, f, p, A[l + 3], 14, 4107603335)),
            (p = r(p, m, g, f, A[l + 8], 20, 1163531501)),
            (f = r(f, p, m, g, A[l + 13], 5, 2850285829)),
            (g = r(g, f, p, m, A[l + 2], 9, 4243563512)),
            (m = r(m, g, f, p, A[l + 7], 14, 1735328473)),
            (f = o(
                f,
                (p = r(p, m, g, f, A[l + 12], 20, 2368359562)),
                m,
                g,
                A[l + 5],
                4,
                4294588738
            )),
            (g = o(g, f, p, m, A[l + 8], 11, 2272392833)),
            (m = o(m, g, f, p, A[l + 11], 16, 1839030562)),
            (p = o(p, m, g, f, A[l + 14], 23, 4259657740)),
            (f = o(f, p, m, g, A[l + 1], 4, 2763975236)),
            (g = o(g, f, p, m, A[l + 4], 11, 1272893353)),
            (m = o(m, g, f, p, A[l + 7], 16, 4139469664)),
            (p = o(p, m, g, f, A[l + 10], 23, 3200236656)),
            (f = o(f, p, m, g, A[l + 13], 4, 681279174)),
            (g = o(g, f, p, m, A[l + 0], 11, 3936430074)),
            (m = o(m, g, f, p, A[l + 3], 16, 3572445317)),
            (p = o(p, m, g, f, A[l + 6], 23, 76029189)),
            (f = o(f, p, m, g, A[l + 9], 4, 3654602809)),
            (g = o(g, f, p, m, A[l + 12], 11, 3873151461)),
            (m = o(m, g, f, p, A[l + 15], 16, 530742520)),
            (f = a(
                f,
                (p = o(p, m, g, f, A[l + 2], 23, 3299628645)),
                m,
                g,
                A[l + 0],
                6,
                4096336452
            )),
            (g = a(g, f, p, m, A[l + 7], 10, 1126891415)),
            (m = a(m, g, f, p, A[l + 14], 15, 2878612391)),
            (p = a(p, m, g, f, A[l + 5], 21, 4237533241)),
            (f = a(f, p, m, g, A[l + 12], 6, 1700485571)),
            (g = a(g, f, p, m, A[l + 3], 10, 2399980690)),
            (m = a(m, g, f, p, A[l + 10], 15, 4293915773)),
            (p = a(p, m, g, f, A[l + 1], 21, 2240044497)),
            (f = a(f, p, m, g, A[l + 8], 6, 1873313359)),
            (g = a(g, f, p, m, A[l + 15], 10, 4264355552)),
            (m = a(m, g, f, p, A[l + 6], 15, 2734768916)),
            (p = a(p, m, g, f, A[l + 13], 21, 1309151649)),
            (f = a(f, p, m, g, A[l + 4], 6, 4149444226)),
            (g = a(g, f, p, m, A[l + 11], 10, 3174756917)),
            (m = a(m, g, f, p, A[l + 2], 15, 718787259)),
            (p = a(p, m, g, f, A[l + 9], 21, 3951481745)),
            (f = n(f, c)),
            (p = n(p, u)),
            (m = n(m, h)),
            (g = n(g, d))
    return (s(f) + s(p) + s(m) + s(g)).toLowerCase()
}
