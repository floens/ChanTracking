$ = {
    id: function(a) {
        return document.getElementById(a)
    },
    cls: function(a, b) {
        return (b || document).getElementsByClassName(a)
    },
    byName: function(a) {
        return document.getElementsByName(a)
    },
    tag: function(a, b) {
        return (b || document).getElementsByTagName(a)
    },
    qs: function(a, b) {
        return (b || document).querySelector(a)
    },
    extend: function(a, b) {
        for (var c in b) a[c] = b[c]
    },
    on: function(a, b, c) {
        a.addEventListener(b, c, !1)
    },
    off: function(a, b, c) {
        a.removeEventListener(b, c, !1)
    }
};
document.documentElement.classList ? ($.hasClass = function(a, b) {
    return a.classList.contains(b)
}, $.addClass = function(a, b) {
    a.classList.add(b)
}, $.removeClass = function(a, b) {
    a.classList.remove(b)
}) : ($.hasClass = function(a, b) {
    return -1 != (" " + a.className + " ").indexOf(" " + b + " ")
}, $.addClass = function(a, b) {
    a.className = "" == a.className ? b : a.className + " " + b
}, $.removeClass = function(a, b) {
    a.className = (" " + a.className + " ").replace(" " + b + " ", "")
});
$.get = function(a, b, c) {
    var d, e;
    e = new XMLHttpRequest;
    e.open("GET", a, !0);
    if (b)
        for (d in b) e[d] = b[d];
    if (c)
        for (d in c) e.setRequestHeader(d, c[d]);
    e.send(null);
    return e
};
$.ago = function(a) {
    var b, c;
    b = Date.now() / 1E3 - a;
    if (1 > b) return "moments ago";
    if (60 > b) return (0 | b) + " seconds ago";
    if (3600 > b) return c = 0 | b / 60, 1 < c ? c + " minutes ago" : "one minute ago";
    if (86400 > b) return c = 0 | b / 3600, a = 1 < c ? c + " hours" : "one hour", b = 0 | b / 60 - 60 * c, 1 < b && (a += " and " + b + " minutes"), a + " ago";
    c = 0 | b / 86400;
    a = 1 < c ? c + " days" : "one day";
    b = 0 | b / 3600 - 24 * c;
    1 < b && (a += " and " + b + " hours");
    return a + " ago"
};
$.hash = function(a) {
    var b, c, d = 0;
    b = 0;
    for (c = a.length; b < c; ++b) d = (d << 5) - d + a.charCodeAt(b);
    return d
};
$.prettySeconds = function(a) {
    var b;
    b = Math.floor(a / 60);
    a = Math.round(a - 60 * b);
    return [b, a]
};
$.docEl = document.documentElement;
$.cache = {};
var Parser = {
        dateTimeout: null,
        init: function() {
            var a, b, c, d;
            if (Config.filter || Config.embedSoundCloud || Config.embedYouTube || Config.embedVocaroo || Main.hasMobileLayout) this.needMsg = !0;
            a = 2 <= window.devicePixelRatio ? "@2x.gif" : ".gif";
            this.icons = {
                admin: "//s.4cdn.org/image/adminicon" + a,
                mod: "//s.4cdn.org/image/modicon" + a,
                dev: "//s.4cdn.org/image/developericon" + a,
                manager: "//s.4cdn.org/image/managericon" + a,
                del: "//s.4cdn.org/image/filedeleted-res" + a
            };
            this.prettify = "function" == typeof prettyPrint;
            this.customSpoiler = {};
            Config.localTime && ((a = (new Date).getTimezoneOffset()) ? (b = Math.abs(a), c = 0 | b / 60, this.utcOffset = "Timezone: UTC" + (0 > a ? "+" : "-") + c + ((d = b - 60 * c) ? ":" + d : "")) : this.utcOffset = "Timezone: UTC", this.weekdays = "Sun Mon Tue Wed Thu Fri Sat".split(" "));
            Main.tid && (this.trackedReplies = this.getTrackedReplies(Main.tid) || {})
        },
        getTrackedReplies: function(a) {
            var b = null;
            if (b = sessionStorage.getItem("4chan-track-" + Main.board + "-" + a)) b = JSON.parse(b);
            return b
        },
        saveTrackedReplies: function(a, b) {
            sessionStorage.setItem("4chan-track-" + Main.board + "-" + a, JSON.stringify(b))
        },
        parseThreadJSON: function(a) {
            var b;
            try {
                b = JSON.parse(a).posts
            } catch (c) {
                console.log(c), b = []
            }
            return b
        },
        parseCatalogJSON: function(a) {
            var b;
            try {
                b = JSON.parse(a)
            } catch (c) {
                console.log(c), b = []
            }
            return b
        },
        setCustomSpoiler: function(a, b) {
            var c;
            !this.customSpoiler[a] && (b = parseInt(b)) && (a == Main.board && (c = $.cls("imgspoiler")[0]) ? this.customSpoiler[a] = c.firstChild.src.match(/spoiler(-[a-z0-9]+)\.png$/)[1] : this.customSpoiler[a] = "-" + a + (Math.floor(Math.random() * b) + 1))
        },
        buildPost: function(a, b, c) {
            var d, e, f = null;
            for (d = 0; e = a[d]; ++d) e.no == c && (!Config.revealSpoilers && a[0].custom_spoiler && Parser.setCustomSpoiler(b, a[0].custom_spoiler), f = Parser.buildHTMLFromJSON(e, b, !1, !0).lastElementChild, Config.IDColor && (uid = $.cls("posteruid", f)[Main.hasMobileLayout ? 0 : 1]) && IDColor.applyRemote(uid.firstElementChild));
            return f
        },
        decodeSpecialChars: function(a) {
            return a.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        },
        encodeSpecialChars: function(a) {
            return a.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        },
        onDateMouseOver: function(a) {
            Parser.dateTimeout && (clearTimeout(Parser.dateTimeout), Parser.dateTimeout = null);
            Parser.dateTimeout = setTimeout(Tip.show, 500, a, $.ago(+a.getAttribute("data-utc")))
        },
        onDateMouseOut: function(a) {
            Parser.dateTimeout && (clearTimeout(Parser.dateTimeout), Parser.dateTimeout = null)
        },
        buildHTMLFromJSON: function(a, b, c, d) {
            var e = document.createElement("div"),
                f = !1,
                h, g = "",
                k = "",
                g = g = "",
                l, n, m, q = '"',
                p = "",
                y = "",
                z = m = "",
                t = "",
                r = "",
                u = "",
                v = "",
                A, E = "",
                F = "",
                G = "",
                B, C, H = "",
                I = "",
                D = "reply",
                w = "",
                J = "",
                x = "",
                K = !1;
            n = "//i.4cdn.org/" + b;
            0 == a.resto ? (f = !0, c && (0 < a.replies ? (c = a.replies + " Repl" + (1 < a.replies ? "ies" : "y"), 0 < a.images && (c += " / " + a.images + " Image" + (1 < a.images ? "s" : ""))) : c = "", I = '<div class="postLink mobile"><span class="info">' + c + '</span><a href="thread/' + a.no + '" class="button">View Thread</a></div>', D = "op", H = '&nbsp; <span>[<a href="thread/' + a.no + (a.semantic_url ? "/" + a.semantic_url : "") + '" class="replylink" rel="canonical">Reply</a>]</span>'), c = a.no) : c = a.resto;
            Main.tid && b == Main.board ? (B = "#p" + a.no, C = "javascript:quote('" + a.no + "')") : (B = "thread/" + c + "#p" + a.no, C = "thread/" + c + "#q" + a.no);
            h = !a.capcode && a.id ? ' <span class="posteruid id_' + a.id + '">(ID: <span class="hand" title="Highlight posts by this ID">' + a.id + "</span>)</span> " : "";
            switch (a.capcode) {
                case "admin_highlight":
                    E = " highlightPost";
                case "admin":
                    r = ' <strong class="capcode hand id_admin"title="Highlight posts by the Administrator">## Admin</strong>';
                    u = " capcodeAdmin";
                    v = ' <img src="' + Parser.icons.admin + '" alt="This user is the 4chan Administrator." title="This user is the 4chan Administrator." class="identityIcon">';
                    break;
                case "mod":
                    r = ' <strong class="capcode hand id_mod" title="Highlight posts by Moderators">## Mod</strong>';
                    u = " capcodeMod";
                    v = ' <img src="' + Parser.icons.mod + '" alt="This user is a 4chan Moderator." title="This user is a 4chan Moderator." class="identityIcon">';
                    break;
                case "developer":
                    r = ' <strong class="capcode hand id_developer" title="Highlight posts by Developers">## Developer</strong>';
                    u = " capcodeDeveloper";
                    v = ' <img src="' + Parser.icons.dev + '" alt="This user is a 4chan Developer." title="This user is a 4chan Developer." class="identityIcon">';
                    break;
                case "manager":
                    r = ' <strong class="capcode hand id_manager" title="Highlight posts by Managers">## Manager</strong>', u = " capcodeManager", v = ' <img src="' + Parser.icons.manager + '" alt="This user is a 4chan Manager." title="This user is a 4chan Manager." class="identityIcon">'
            }
            a.email && (F = '<a href="mailto:' + a.email.replace(/ /g, "%20") + '" class="useremail">', G = "</a>");
            A = a.country ? window.trollFlags ? ' <img src="//s.4cdn.org/image/country/troll/' + a.country.toLowerCase() + '.gif" alt="' + a.country + '" title="' + a.country_name + '" class="countryFlag">' : ' <span title="' + a.country_name + '" class="flag flag-' + a.country.toLowerCase() + '"></span>' : "";
            a.filedeleted ? g = '<div id="f' + a.no + '" class="file"><span class="fileThumb"><img src="' + Parser.icons.del + '" class="fileDeletedRes" alt="File deleted."></span></div>' : a.ext && (g = Parser.decodeSpecialChars(a.filename), m = z = a.filename + a.ext, g.length > (f ? 40 : 30) && (m = Parser.encodeSpecialChars(g.slice(0, f ? 35 : 25)) + "(...)" + a.ext, K = !0), a.tn_w || a.tn_h || ".gif" != a.ext || (a.tn_w = a.w, a.tn_h = a.h), p = 1048576 <= a.fsize ? (0 | a.fsize / 1048576 * 100 + .5) / 100 + " M" : 1024 < a.fsize ? (0 | a.fsize / 1024 + .5) + " K" : a.fsize + " ", a.spoiler && !Config.revealSpoilers && (m = "Spoiler Image", q = '" title="' + z + '"', y = " imgspoiler", l = "//s.4cdn.org/image/spoiler" + (Parser.customSpoiler[b] || "") + ".png", a.tn_w = 100, a.tn_h = 100), l || (l = "//0.t.4cdn.org/" + b + "/" + a.tim + "s.jpg"), g = ".pdf" == a.ext ? "PDF" : a.w + "x" + a.h, "f" != b ? (n = n + "/" + a.tim + a.ext, k = '<a class="fileThumb' + y + '" href="' + n + '" target="_blank"><img src="' + l + '" alt="' + p + 'B" data-md5="' + a.md5 + '" style="height: ' + a.tn_h + "px; width: " + a.tn_w + 'px;"><div data-tip data-tip-cb="mShowFull" class="mFileInfo mobile">' + p + "B " + a.ext.slice(1).toUpperCase() + "</div></a>", g = '<div class="fileText" id="fT' + a.no + q + ">File: <a" + (K ? ' title="' + z + '"' : "") + ' href="' + n + '" target="_blank">' + m + "</a> (" + p + "B, " + g + ")</div>") : (n = n + "/" + a.filename + a.ext, g += ", " + a.tag, g = '<div class="fileText" id="fT' + a.no + '">File: <a href="' + n + '" target="_blank">' + a.filename + ".swf</a> (" + p + "B, " + g + ")</div>"), g = '<div id="f' + a.no + '" class="file">' + g + k + "</div>");
            a.trip && (t = ' <span class="postertrip">' + a.trip + "</span>");
            k = a.name || "";
            l = 30 < k.length ? '<span class="name" data-tip data-tip-cb="mShowFull">' + Parser.truncate(k, 30) + "(...)</span> " : '<span class="name">' + k + "</span> ";
            f ? (a.capcode_replies && (J = Parser.buildCapcodeReplies(a.capcode_replies, b, a.no)), d && a.replies && (w = a.replies + " post" + (1 < a.replies ? "s" : ""), a.images && (w += " and " + a.images + " image repl" + (1 < a.images ? "ies" : "y")), w = '<span class="summary preview-summary">' + w + ".</span>"), a.sticky && (x += '<img class="stickyIcon retina" title="Sticky" alt="Sticky" src="' + Main.icons2.sticky + '"> '), a.closed && (x = a.archived ? x + ('<img class="archivedIcon retina" title="Archived" alt="Archived" src="' + Main.icons2.archived + '"> ') : x + ('<img class="closedIcon retina" title="Closed" alt="Closed" src="' + Main.icons2.closed + '"> ')), d = void 0 === a.sub ? '<span class="subject"></span> ' : 30 < a.sub.length ? '<span class="subject" data-tip data-tip-cb="mShowFull">' + Parser.truncate(a.sub, 30) + "(...)</span> " : '<span class="subject">' + a.sub + "</span> ") : d = "";
            e.className = "postContainer " + D + "Container";
            e.id = "pc" + a.no;
            e.innerHTML = (f ? "" : '<div class="sideArrows" id="sa' + a.no + '">&gt;&gt;</div>') + '<div id="p' + a.no + '" class="post ' + D + E + '"><div class="postInfoM mobile" id="pim' + a.no + '"><span class="nameBlock' + u + '">' + l + t + r + v + h + A + "<br>" + d + '</span><span class="dateTime postNum" data-utc="' + a.time + '">' + a.now + ' <a href="' + a.no + "#p" + a.no + '" title="Link to this post">No.</a><a href="javascript:quote(\'' + a.no + '\');" title="Reply to this post">' + a.no + "</a></span></div>" + (f ? g : "") + '<div class="postInfo desktop" id="pi' + a.no + '"' + (b != Main.board ? ' data-board="' + b + '"' : "") + '><input type="checkbox" name="' + a.no + '" value="delete"> ' + d + '<span class="nameBlock' + u + '">' + F + '<span class="name">' + k + "</span>" + t + r + G + v + h + A + ' </span> <span class="dateTime" data-utc="' + a.time + '">' + a.now + '</span> <span class="postNum desktop"><a href="' + B + '" title="Link to this post">No.</a><a href="' + C + '" title="Reply to this post">' + a.no + "</a> " + x + H + "</span></div>" + (f ? "" : g) + '<blockquote class="postMessage" id="m' + a.no + '">' + (a.com || "") + J + w + "</blockquote> </div>" + I;
            if (!Main.tid || b != Main.board)
                for (r = e.getElementsByClassName("quotelink"), a = 0; f = r[a]; ++a) t = f.getAttribute("href"), "/" != t.charAt(0) && (f.href = "/" + b + "/thread/" + c + t);
            return e
        },
        truncate: function(a, b) {
            a = a.replace("&#44;", ",");
            a = Parser.decodeSpecialChars(a);
            a = a.slice(0, b);
            return a = Parser.encodeSpecialChars(a)
        },
        buildCapcodeReplies: function(a, b, c) {
            var d, e, f, h, g, k, l;
            h = {
                admin: "Administrator",
                mod: "Moderator",
                developer: "Developer",
                manager: "Manager"
            };
            b != Main.board ? (k = "/" + b + "/thread/", l = "&gt;&gt;&gt;/" + b + "/") : (k = "", l = "&gt;&gt;");
            f = '<br><br><span class="capcodeReplies"><span class="smaller">';
            for (d in a)
                for (f += '<span class="bold">' + h[d] + " Replies:</span> ", g = a[d], b = 0; e = g[b]; ++b) f += '<a class="quotelink" href="' + k + c + "#p" + e + '">' + l + e + "</a> ";
            return f + "</span></span>"
        },
        parseBoard: function() {
            var a, b = document.getElementsByClassName("thread");
            for (a = 0; b[a]; ++a) Parser.parseThread(b[a].id.slice(1))
        },
        parseThread: function(a, b, c) {
            var d, e, f, h, g, k;
            f = $.id("t" + a);
            h = f.getElementsByClassName("post");
            b || (g = document.getElementById("pi" + a), Main.tid || (Config.filter && (k = Filter.exec(f, g, document.getElementById("m" + a), a)), Config.threadHiding && !k && (Main.hasMobileLayout ? (g = document.createElement("a"), g.href = "javascript:;", g.setAttribute("data-cmd", "hide"), g.setAttribute("data-id", a), g.className = "mobileHideButton button", g.textContent = "Hide", h[0].nextElementSibling.appendChild(g)) : (g = document.createElement("span"), g.innerHTML = '<img alt="H" class="extButton threadHideButton"data-cmd="hide" data-id="' + a + '" src="' + Main.icons.minus + '" title="Hide thread">', h[0].insertBefore(g, h[0].firstChild)), g.id = "sa" + a, ThreadHiding.hidden[a] && (ThreadHiding.hidden[a] = Main.now, ThreadHiding.hide(a))), ThreadExpansion.enabled && (e = $.cls("summary", f)[0]) && (f = document.createDocumentFragment(), k = e.cloneNode(!0), k.className = "", e.textContent = "", g = document.createElement("img"), g.className = "extButton expbtn", g.title = "Expand thread", g.alt = "+", g.setAttribute("data-cmd", "expand"), g.setAttribute("data-id", a), g.src = Main.icons.plus, f.appendChild(g), f.appendChild(k), g = document.createElement("span"), g.style.display = "none", g.textContent = "Showing all replies.", f.appendChild(g), e.appendChild(f))), Main.tid && Config.threadWatcher && (d = $.cls("navLinksBot")[0]) && (g = document.createElement("img"), ThreadWatcher.watched[e = a + "-" + Main.board] ? (g.src = Main.icons.watched, g.setAttribute("data-active", "1")) : g.src = Main.icons.notwatched, g.className = "extButton wbtn wbtn-" + e, g.setAttribute("data-cmd", "watch"), g.setAttribute("data-id", a), g.alt = "W", g.title = "Add to watch list", f = document.createDocumentFragment(), f.appendChild(document.createTextNode("[")), f.appendChild(g.cloneNode(!0)), f.appendChild(document.createTextNode("] ")), d.insertBefore(f, d.firstChild)));
            e = b ? 0 > b ? h.length + b : b : 0;
            c = c ? e + c : h.length;
            if (Main.isMobileDevice && Config.quotePreview)
                for (d = e; d < c; ++d) Parser.parseMobileQuotelinks(h[d]);
            if (Parser.trackedReplies)
                for (d = e; d < c; ++d) Parser.parseTrackedReplies(h[d]);
            for (d = e; d < c; ++d) Parser.parsePost(h[d].id.slice(1), a);
            if (b) {
                if (Parser.prettify)
                    for (d = e; d < c; ++d) Parser.parseMarkup(h[d]);
                if (window.jsMath)
                    if (window.jsMath.loaded)
                        for (d = e; d < c; ++d) window.jsMath.ProcessBeforeShowing(h[d]);
                    else Parser.loadJSMath()
            }
            UA.dispatchEvent("4chanParsingDone", {
                threadId: a,
                offset: e,
                limit: c
            })
        },
        loadJSMath: function(a) {
            $.cls("math", a)[0] && (window.jsMath.Autoload.Script.Push("ProcessBeforeShowing", [null]), window.jsMath.Autoload.LoadJsMath())
        },
        parseMathOne: function(a) {
            window.jsMath.loaded ? window.jsMath.ProcessBeforeShowing(a) : Parser.loadJSMath(a)
        },
        parseTrackedReplies: function(a) {
            var b, c;
            c = $.cls("quotelink", a);
            for (a = 0; b = c[a]; ++a) Parser.trackedReplies[b.textContent] && (b.textContent += " (You)", Parser.hasYouMarkers = !0)
        },
        parseMobileQuotelinks: function(a) {
            var b, c, d;
            c = $.cls("quotelink", a);
            for (a = 0; b = c[a]; ++a)
                if (d = b.getAttribute("href").match(/^(?:\/([^\/]+)\/)?(?:thread\/)?([0-9]+)?#p([0-9]+)$/)) d = document.createElement("a"), d.href = b.href, d.textContent = " #", d.className = "quoteLink", b.parentNode.insertBefore(d, b.nextSibling)
        },
        parseMarkup: function(a) {
            var b, c;
            if ((b = a.getElementsByClassName("prettyprint"))[0])
                for (a = 0; c = b[a]; ++a) c.innerHTML = prettyPrintOne(c.innerHTML)
        },
        parsePost: function(a, b) {
            var c, d, e, f, h, g, k;
            c = Main.hasMobileLayout;
            b ? e = document.getElementById("pi" + a) : (e = a.getElementsByClassName("postInfo")[0], a = e.id.slice(2));
            Parser.needMsg && (h = document.getElementById("m" + a));
            c ? Config.reportButton && (d = document.createElement("span"), d.className = "mobile mobile-report", d.setAttribute("data-cmd", "report"), d.setAttribute("data-id", a), d.textContent = "Report", e.parentNode.appendChild(d)) : (d = document.createElement("a"), d.href = "#", d.className = "postMenuBtn", d.title = "Post menu", d.setAttribute("data-cmd", "post-menu"), d.textContent = "\u25b6", e.appendChild(d));
            b && (a != b && (Config.filter && (g = Filter.exec(e.parentNode, e, h)), !g && ReplyHiding.hidden[a] && (ReplyHiding.hidden[a] = Main.now, ReplyHiding.hide(a))), Config.backlinks && Parser.parseBacklinks(a, b));
            IDColor.enabled && (k = $.cls("posteruid", e.parentNode)[c ? 0 : 1]) && IDColor.apply(k.firstElementChild);
            Config.embedSoundCloud && Media.parseSoundCloud(h);
            (Config.embedYouTube || Main.hasMobileLayout) && Media.parseYouTube(h);
            Config.embedVocaroo && Media.parseVocaroo(h);
            Config.revealSpoilers && (f = document.getElementById("f" + a)) && (f = f.children[1]) && $.hasClass(f, "imgspoiler") && (d = f.firstChild, f.removeChild(d), d.removeAttribute("style"), k = $.hasClass(e.parentNode, "op"), d.style.maxWidth = d.style.maxHeight = k ? "250px" : "125px", d.src = "//0.t.4cdn.org" + f.pathname.replace(/([0-9]+).+$/, "/$1s.jpg"), h = f.previousElementSibling, g = h.title.split("."), g[0].length > (k ? 40 : 30) ? g = g[0].slice(0, k ? 35 : 25) + "(...)" + g[1] : (g = h.title, h.removeAttribute("title")), h.firstElementChild.innerHTML = g, f.insertBefore(d, f.firstElementChild));
            Config.localTime && (c ? (d = e.parentNode.getElementsByClassName("dateTime")[0], d.firstChild.nodeValue = Parser.getLocaleDate(new Date(1E3 * d.getAttribute("data-utc"))) + " ") : (d = e.getElementsByClassName("dateTime")[0], d.textContent = Parser.getLocaleDate(new Date(1E3 * d.getAttribute("data-utc")))))
        },
        getLocaleDate: function(a) {
            return ("0" + (1 + a.getMonth())).slice(-2) + "/" + ("0" + a.getDate()).slice(-2) + "/" + ("0" + a.getFullYear()).slice(-2) + "(" + this.weekdays[a.getDay()] + ")" + ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2) + ":" + ("0" + a.getSeconds()).slice(-2)
        },
        parseBacklinks: function(a, b) {
            var c, d, e, f, h, g, k;
            if (e = document.getElementById("m" + a).getElementsByClassName("quotelink"))
                for (f = {}, c = 0; d = e[c]; ++c)
                    if (h = d.getAttribute("href").split("#p"), h[1])(h[1] == b && (d.textContent += " (OP)"), g = document.getElementById("pi" + h[1])) ? f[h[1]] || (f[h[1]] = !0, d = document.createElement("span"), k = Main.tid ? "#p" + a : "thread/" + b + "#p" + a, d.innerHTML = Main.hasMobileLayout ? '<a href="' + k + '" class="quotelink">&gt;&gt;' + a + '</a><a href="' + k + '" class="quoteLink"> #</a> ' : '<a href="' + k + '" class="quotelink">&gt;&gt;' + a + "</a> ", (k = document.getElementById("bl_" + h[1])) || (k = document.createElement("div"), k.id = "bl_" + h[1], k.className = "backlink", Main.hasMobileLayout && (k.className = "backlink mobile", g = document.getElementById("p" + h[1])), g.appendChild(k)), k.appendChild(d)) : Main.tid && ">" != d.textContent.charAt(2) && (d.textContent += " \u2192")
        },
        buildSummary: function(a, b, c) {
            if (b) b = b + " post" + (1 < b ? "s" : "");
            else return null;
            c = c ? " and " + c + " image repl" + (1 < c ? "ies" : "y") : "";
            el = document.createElement("span");
            el.className = "summary desktop";
            el.innerHTML = b + c + ' omitted. <a href="thread/' + a + '" class="replylink">Click here</a> to view.';
            return el
        }
    },
    PostMenu = {
        activeBtn: null,
        open: function(a) {
            var b, c, d, e;
            PostMenu.close();
            d = a.parentNode.id.split("pi")[1];
            b = a.parentNode.getAttribute("data-board");
            e = !b && !!$.id("t" + d);
            c = '<ul><li data-cmd="report" data-id="' + d + (b ? '" data-board="' + b + '"' : '"') + '">Report post</li>';
            if (e) Main.tid || (c += '<li data-cmd="hide" data-id="' + d + '">' + ($.hasClass($.id("t" + d), "post-hidden") ? "Unhide" : "Hide") + " thread</li>"), Config.threadWatcher && (c += '<li data-cmd="watch" data-id="' + d + '">' + (ThreadWatcher.watched[d + "-" + Main.board] ? "Remove from" : "Add to") + " watch list</li>");
            else if (b = $.id("pc" + d)) c += '<li data-cmd="hide-r" data-id="' + d + '">' + ($.hasClass(b, "post-hidden") ? "Unhide" : "Hide") + " post</li>";
            if (file = $.id("fT" + d))
                if (b = $.cls("fileThumb", file.parentNode)[0]) b = /\.(png|jpg)$/.test(b.href) ? b.href : "http://0.t.4cdn.org/" + Main.board + "/" + b.href.match(/\/([0-9]+)\..+$/)[1] + "s.jpg", c += '<li><ul><li><a href="//www.google.com/searchbyimage?image_url=' + b + '" target="_blank">Google</a></li><li><a href="http://iqdb.org/?url=' + b + '" target="_blank">iqdb</a></li></ul>Image search &raquo</li>';
            Config.filter && (c += '<li><a href="#" data-cmd="filter-sel">Filter selected text</a></li>');
            b = document.createElement("div");
            b.id = "post-menu";
            b.className = "dd-menu";
            b.innerHTML = c + "</ul>";
            c = a.getBoundingClientRect();
            b.style.top = c.bottom + 3 + window.pageYOffset + "px";
            document.addEventListener("click", PostMenu.close, !1);
            $.addClass(a, "menuOpen");
            PostMenu.activeBtn = a;
            UA.dispatchEvent("4chanPostMenuReady", {
                postId: d,
                isOP: e,
                node: b.firstElementChild
            });
            document.body.appendChild(b);
            a = c.left + window.pageXOffset;
            d = $.docEl.clientWidth - b.offsetWidth;
            a > d - 75 && (b.className += " dd-menu-left");
            a > d && (a = d);
            b.style.left = a + "px"
        },
        close: function() {
            var a;
            if (a = $.id("post-menu")) a.parentNode.removeChild(a), document.removeEventListener("click", PostMenu.close, !1), $.removeClass(PostMenu.activeBtn, "menuOpen"), PostMenu.activeBtn = null
        }
    },
    Depager = {
        init: function() {
            var a, b;
            this.threadsLoaded = this.isComplete = this.isEnabled = this.isLoading = !1;
            this.threadQueue = [];
            this.debounce = 100;
            this.threshold = 350;
            this.adId = "azk53379";
            this.adZones = [16258, 16260];
            if (this.boardHasAds = !!$.id(this.adId)) a = $.cls("ad-plea"), this.adPlea = a[a.length - 1];
            if (Main.hasMobileLayout) {
                a = $.cls("next")[1];
                if (!a) return;
                a = a.firstElementChild;
                a.textContent = "Load More";
                a.className += " m-depagelink";
                a.setAttribute("data-cmd", "depage")
            } else {
                a = $.cls("prev")[0];
                if (!a) return;
                a.innerHTML = '[<a title="Toggle infinite scroll" class="depagelink" href="" data-cmd="depage">All</a>]';
                a = a.firstElementChild
            }
            Config.alwaysDepage ? (this.isEnabled = !0, a.parentNode.parentNode.className += " depagerEnabled", Depager.bindHandlers(), !Main.hasMobileLayout && (b = $.cls("board")[0]) && (a = document.createElement("span"), a.className = "depageNumber", a.textContent = "Page 1", b.insertBefore(a, b.firstElementChild))) : a.setAttribute("data-cmd", "depage")
        },
        onScroll: function() {
            document.documentElement.scrollHeight <= window.innerHeight + window.pageYOffset + Depager.threshold && (Depager.threadsLoaded ? Depager.renderNext() : Depager.depage())
        },
        trackPageview: function(a) {
            var b;
            try {
                window._gat && (b = "/" + Main.board + "/" + a, window._gat._getTrackerByName()._trackPageview(b)), window.__qc && (window.__qc.qpixelsent = [], window._qevents.push({
                    qacct: window.__qc.qopts.qacct
                }), window.__qc.firepixels())
            } catch (c) {
                console.log(c)
            }
        },
        insertAd: function(a, b, c, d) {
            var e;
            Depager.boardHasAds && window.ados_add_placement && (d && (d = $.cls("bottomad"), d = d[d.length - 1], e = document.createElement("div"), e.id = "azkDepage" + (a + 1), d.appendChild(e), window.ados_add_placement(3536, 18130, e.id, 4).setZone(c)), d = document.createElement("div"), d.className = "bottomad center depaged-ad", 2 == a ? e = $.id(Depager.adId) : (e = document.createElement("div"), e.id = "azkDepage" + a), d.appendChild(e), b.appendChild(d), Depager.adPlea && b.appendChild(Depager.adPlea.cloneNode(!0)), b.appendChild(document.createElement("hr")), 2 != a && window.ados_add_placement(3536, 18130, e.id, 4).setZone(c))
        },
        loadAds: function() {
            Depager.boardHasAds && window.ados_load && window.ados_load()
        },
        renderNext: function() {
            var a, b, c, d, e, f, h, g, k, l, n, m;
            k = [];
            l = window.pageYOffset;
            b = document.createDocumentFragment();
            if (a = Depager.threadQueue.shift()) {
                e = a.threads;
                n = a.page;
                m = !Depager.threadQueue.length;
                Depager.insertAd(n, b, a.adZone, m);
                a = document.createElement("span");
                a.className = "depageNumber";
                a.textContent = "Page " + n;
                b.appendChild(a);
                for (c = 0; a = e[c]; ++c)
                    if (!$.id("t" + a.no)) {
                        h = document.createElement("div");
                        h.id = "t" + a.no;
                        h.className = "thread";
                        h.appendChild(Parser.buildHTMLFromJSON(a, Main.board, !0));
                        (f = Parser.buildSummary(a.no, a.omitted_posts, a.omitted_images)) && h.appendChild(f);
                        if (a.replies)
                            for (last_replies = a.last_replies, d = 0; g = last_replies[d]; ++d) h.appendChild(Parser.buildHTMLFromJSON(g, Main.board));
                        b.appendChild(h);
                        b.appendChild(document.createElement("hr"));
                        k.push(a.no)
                    }
                m && (Depager.unbindHandlers(), Depager.isComplete = !0, Depager.setStatus("disabled"));
                boardDiv = $.cls("board")[0];
                boardDiv.insertBefore(b, boardDiv.lastElementChild);
                Depager.trackPageview(n);
                Depager.loadAds();
                for (b = 0; a = k[b]; ++b) Parser.parseThread(a);
                window.scrollTo(0, l)
            }
        },
        bindHandlers: function() {
            window.addEventListener("scroll", Depager.onScroll, !1);
            window.addEventListener("resize", Depager.onScroll, !1)
        },
        unbindHandlers: function() {
            window.removeEventListener("scroll", Depager.onScroll, !1);
            window.removeEventListener("resize", Depager.onScroll, !1)
        },
        setStatus: function(a) {
            var b, c, d;
            Main.hasMobileLayout ? (c = $.cls("m-depagelink"), d = "Load More") : (c = $.cls("depagelink"), d = "All");
            if (c.length)
                if ("enabled" == a)
                    for (a = 0; b = c[a]; ++a) b.textContent = d, b = b.parentNode.parentNode, $.hasClass(b, "depagerEnabled") || $.addClass(b, "depagerEnabled");
                else if ("loading" == a)
                for (a = 0; b = c[a]; ++a) b.textContent = "Loading\u2026";
            else if ("disabled" == a)
                for (a = 0; b = c[a]; ++a) Main.hasMobileLayout ? b.parentNode.parentNode.removeChild(b.parentNode) : (b.textContent = d, $.removeClass(b.parentNode.parentNode, "depagerEnabled"));
            else if ("error" == a)
                for (a = 0; b = c[a]; ++a) b.textContent = "Error", b.removeAttribute("title"), b.removeAttribute("data-cmd"), $.removeClass(b.parentNode.parentNode, "depagerEnabled")
        },
        toggle: function() {
            Depager.isLoading || Depager.isComplete || (Depager.isEnabled ? Depager.disable() : Depager.enable(), Depager.isEnabled = !Depager.isEnabled)
        },
        enable: function() {
            Depager.bindHandlers();
            Depager.setStatus("enabled");
            Depager.onScroll()
        },
        disable: function() {
            Depager.unbindHandlers();
            Depager.setStatus("disabled")
        },
        depage: function() {
            Depager.isLoading || (Depager.isLoading = !0, $.get("//a.4cdn.org/" + Main.board + "/catalog.json", {
                onload: Depager.onLoad,
                onerror: Depager.onError
            }), Depager.setStatus("loading"))
        },
        onLoad: function() {
            var a, b, c, d, e;
            Depager.isLoading = !1;
            Depager.threadsLoaded = !0;
            if (200 == this.status) {
                Depager.setStatus("enabled");
                Config.alwaysDepage || Depager.bindHandlers();
                a = Parser.parseCatalogJSON(this.responseText);
                d = Depager.threadQueue;
                e = 0;
                for (b = 1; c = a[b]; ++b) c.adZone = Depager.adZones[e], d.push(c), e = e ? 0 : 1;
                Depager.renderNext()
            } else 404 == this.status ? Depager.unbindHandlers() : (Depager.unbindHandlers(), console.log("Error: " + this.status)), Depager.setStatus("error")
        },
        onError: function() {
            Depager.isLoading = !1;
            Depager.unbindHandlers();
            console.log("Error: " + this.status);
            Depager.setStatus("error")
        }
    },
    QuoteInline = {
        isSelfQuote: function(a, b, c) {
            if (c && c != Main.board) return !1;
            a = a.parentNode;
            return "BLOCKQUOTE" == a.nodeName && a.id.split("m")[1] == b || a.parentNode.id.split("_")[1] == b ? !0 : !1
        },
        toggle: function(a, b) {
            var c, d, e;
            (c = a.getAttribute("href").match(/^(?:\/([^\/]+)\/)?(?:thread\/)?([0-9]+)?#p([0-9]+)$/)) && "rs" != c[1] && !QuoteInline.isSelfQuote(a, c[3], c[1]) && (b && b.preventDefault(), (d = a.getAttribute("data-pfx")) ? (a.removeAttribute("data-pfx"), $.removeClass(a, "linkfade"), d = $.id(d + "p" + c[3]), d.parentNode.removeChild(d), "backlink" == a.parentNode.parentNode.className && (d = $.id("pc" + c[3]), c = +d.getAttribute("data-inline-count") - 1, 0 == c ? (d.style.display = "", d.removeAttribute("data-inline-count")) : d.setAttribute("data-inline-count", c))) : (e = $.id("p" + c[3])) ? QuoteInline.inline(a, e, c[3]) : QuoteInline.inlineRemote(a, c[1] || Main.board, c[2], c[3]))
        },
        inlineRemote: function(a, b, c, d) {
            var e, f, h, g;
            a.hasAttribute("data-loading") || (h = b + "-" + c, (e = $.cache[h]) && (f = Parser.buildPost(e, b, d)) ? (Parser.parsePost(f), QuoteInline.inline(a, f)) : (g = a.nextElementSibling) && $.hasClass(g, "spinner") ? g.parentNode.removeChild(g) : (g = document.createElement("div"), g.className = "preview spinner inlined", g.textContent = "Loading...", a.parentNode.insertBefore(g, a.nextSibling), e = function() {
                var c;
                a.removeAttribute("data-loading");
                if (200 == this.status || 304 == this.status || 0 == this.status) c = Parser.parseThreadJSON(this.responseText), $.cache[h] = c, (c = Parser.buildPost(c, b, d)) ? (g.parentNode && g.parentNode.removeChild(g), Parser.parsePost(c), QuoteInline.inline(a, c)) : ($.addClass(a, "deadlink"), g.textContent = "This post doesn't exist anymore");
                else if (404 == this.status) $.addClass(a, "deadlink"), g.textContent = "This thread doesn't exist anymore";
                else this.onerror()
            }, f = function() {
                g.textContent = "Error: " + this.statusText + " (" + this.status + ")";
                a.removeAttribute("data-loading")
            }, a.setAttribute("data-loading", "1"), $.get("//a.4cdn.org/" + b + "/thread/" + c + ".json", {
                onload: e,
                onerror: f
            })))
        },
        inline: function(a, b, c) {
            var d, e, f, h, g, k;
            e = Date.now();
            if (c)
                for ("backlink" == (h = a.parentNode.parentNode).className ? (f = h.parentNode.parentNode.parentNode, g = !0) : f = h.parentNode; f.parentNode !== document;) {
                    if (f.id.split("m")[1] == c) return;
                    f = f.parentNode
                }
            a.className += " linkfade";
            a.setAttribute("data-pfx", e);
            f = b.cloneNode(!0);
            f.id = e + f.id;
            f.setAttribute("data-pfx", e);
            f.className += " preview inlined";
            $.removeClass(f, "highlight");
            $.removeClass(f, "highlight-anti");
            if ((k = $.cls("inlined", f))[0]) {
                for (; d = k[0];) d.parentNode.removeChild(d);
                k = $.cls("quotelink", f);
                for (c = 0; d = k[c]; ++c) d.removeAttribute("data-pfx"), $.removeClass(d, "linkfade")
            }
            for (c = 0; d = f.children[c]; ++c) d.id = e + d.id;
            if (c = $.cls("backlink", f)[0]) c.id = e + c.id;
            g ? (a = h.parentNode.parentNode.getAttribute("data-pfx") || "", a = $.id(a + "m" + h.id.split("_")[1]), a.insertBefore(f, a.firstChild), (f = b.parentNode.getAttribute("data-inline-count")) ? f = +f + 1 : (f = 1, b.parentNode.style.display = "none"), b.parentNode.setAttribute("data-inline-count", f)) : ($.hasClass(a.parentNode, "quote") && (a = a.parentNode), b = a.parentNode, b.insertBefore(f, a.nextSibling))
        }
    },
    QuotePreview = {
        init: function() {
            this.regex = /^(?:\/([^\/]+)\/)?(?:thread\/)?([0-9]+)?#p([0-9]+)$/;
            this.highlightAnti = this.highlight = null;
            this.out = !0
        },
        resolve: function(a) {
            var b, c, d;
            b = QuotePreview;
            b.out = !1;
            if (c = a.getAttribute("href").match(b.regex))(d = a.getAttribute("data-pfx") || "", d = document.getElementById(d + "p" + c[3])) ? (c = d.getBoundingClientRect(), 0 < c.top && c.bottom < document.documentElement.clientHeight && !$.hasClass(d.parentNode, "post-hidden")) ? $.hasClass(d, "highlight") || location.hash.slice(1) == d.id ? $.hasClass(d, "op") || (b.highlightAnti = d, $.addClass(d, "highlight-anti")) : (b.highlight = d, $.addClass(d, "highlight")) : b.show(a, d) : UA.hasCORS && b.showRemote(a, c[1] || Main.board, c[2], c[3])
        },
        showRemote: function(a, b, c, d) {
            var e, f, h;
            h = b + "-" + c;
            (f = $.cache[h]) && (e = Parser.buildPost(f, b, d)) ? QuotePreview.show(a, e) : (a.style.cursor = "wait", $.get("//a.4cdn.org/" + b + "/thread/" + c + ".json", {
                onload: function() {
                    var c;
                    a.style.cursor = "";
                    200 == this.status || 304 == this.status || 0 == this.status ? (c = Parser.parseThreadJSON(this.responseText), $.cache[h] = c, $.id("quote-preview") || QuotePreview.out || ((c = Parser.buildPost(c, b, d)) ? (c.className = "post preview", c.style.display = "none", c.id = "quote-preview", document.body.appendChild(c), QuotePreview.show(a, c, !0)) : $.addClass(a, "deadlink"))) : 404 == this.status && $.addClass(a, "deadlink")
                },
                onerror: function() {
                    a.style.cursor = ""
                }
            }))
        },
        show: function(a, b, c) {
            var d, e, f;
            c ? (Parser.parsePost(b), b.style.display = "") : (b = b.cloneNode(!0), location.hash && location.hash == "#" + b.id && (b.className += " highlight"), b.id = "quote-preview", b.className += " preview" + ($.hasClass(a.parentNode.parentNode, "backlink") ? "" : " reveal-spoilers"), Config.imageExpansion && (f = $.cls("expanded-thumb", b)[0]) && ImageExpansion.contract(f));
            if (!a.parentNode.className && (c = b.querySelectorAll("#" + $.cls("postMessage", b)[0].id + " > .quotelink"), c[1]))
                for (e = ">>" + a.parentNode.parentNode.id.split("_")[1], f = 0; d = c[f]; ++f)
                    if (d.textContent == e) {
                        $.addClass(d, "dotted");
                        break
                    }
            d = a.getBoundingClientRect();
            c = document.documentElement;
            e = c.offsetWidth;
            f = b.style;
            document.body.appendChild(b);
            Main.isMobileDevice ? (f.top = d.top + a.offsetHeight + window.pageYOffset + "px", e - d.right < (0 | .3 * e) ? f.right = e - d.right + "px" : f.left = d.left + "px") : (e - d.right < (0 | .3 * e) ? (e -= d.left, f.right = e + 5 + "px") : (e = d.left + d.width, f.left = e + 5 + "px"), a = d.top + a.offsetHeight + window.pageYOffset - b.offsetHeight / 2 - d.height / 2, b = b.getBoundingClientRect().height, d = c.scrollTop != document.body.scrollTop ? c.scrollTop + document.body.scrollTop : document.body.scrollTop, f.top = a < d ? d + "px" : a + b > d + c.clientHeight ? d + c.clientHeight - b + "px" : a + "px")
        },
        remove: function(a) {
            var b, c;
            b = QuotePreview;
            b.out = !0;
            b.highlight ? ($.removeClass(b.highlight, "highlight"), b.highlight = null) : b.highlightAnti && ($.removeClass(b.highlightAnti, "highlight-anti"), b.highlightAnti = null);
            a && (a.style.cursor = "");
            (c = $.id("quote-preview")) && document.body.removeChild(c)
        }
    },
    ImageExpansion = {
        activeVideos: [],
        timeout: null,
        expand: function(a) {
            var b, c;
            Config.imageHover && ImageHover.hide();
            c = a.parentNode.getAttribute("href");
            if (b = c.match(/\.(?:webm|pdf)$/)) return Main.hasMobileLayout || ".webm" != b[0] ? !1 : ImageExpansion.expandWebm(a);
            a.setAttribute("data-expanding", "1");
            b = document.createElement("img");
            b.alt = "Image";
            b.setAttribute("src", c);
            b.className = "expanded-thumb";
            b.style.display = "none";
            b.onerror = this.onError;
            a.parentNode.insertBefore(b, a.nextElementSibling);
            if (UA.hasCORS) a.style.opacity = "0.75", this.timeout = this.checkLoadStart(b, a);
            else this.onLoadStart(b, a);
            return !0
        },
        contract: function(a) {
            var b, c;
            clearTimeout(this.timeout);
            c = a.parentNode;
            b = c.parentNode.parentNode;
            $.removeClass(c.parentNode, "image-expanded");
            Config.centeredThreads && ($.removeClass(b.parentNode, "centre-exp"), b.parentNode.style.marginLeft = "");
            !Main.tid && Config.threadHiding && $.removeClass(c, "image-expanded-anti");
            c.firstChild.style.display = "";
            c.removeChild(a);
            b.offsetTop < window.pageYOffset && b.scrollIntoView()
        },
        toggle: function(a) {
            if (a.hasAttribute("data-md5")) {
                if (!a.hasAttribute("data-expanding")) return ImageExpansion.expand(a)
            } else ImageExpansion.contract(a);
            return !0
        },
        expandWebm: function(a) {
            var b, c, d, e;
            e = ImageExpansion;
            (b = document.getElementById("image-hover")) && document.body.removeChild(b);
            c = a.parentNode;
            d = c.getAttribute("href");
            c.getBoundingClientRect();
            b = document.createElement("video");
            b.muted = !0;
            b.controls = !0;
            b.loop = !0;
            b.autoplay = !0;
            b.className = "expandedWebm";
            b.onloadedmetadata = ImageExpansion.fitWebm;
            b.onplay = ImageExpansion.onWebmPlay;
            b.src = d;
            c.style.display = "none";
            c.parentNode.appendChild(b);
            a = a.parentNode.previousElementSibling;
            b = document.createElement("span");
            b.className = "collapseWebm";
            b.innerHTML = '-[<a href="#">Close</a>]';
            b.firstElementChild.addEventListener("click", e.collapseWebm, !1);
            a.appendChild(b);
            return !0
        },
        fitWebm: function() {
            var a, b, c, d, e, f, h;
            Config.centeredThreads && (h = $.cls("opContainer")[0].offsetWidth, f = this.parentNode.parentNode.parentNode, $.addClass(f, "centre-exp"));
            a = this.getBoundingClientRect().left;
            c = document.documentElement.clientWidth - a - 25;
            d = document.documentElement.clientHeight;
            a = this.videoWidth;
            b = this.videoHeight;
            a > c && (e = c / a, a = c, b *= e);
            Config.fitToScreenExpansion && b > d && (e = d / b, b = d, a *= e);
            this.style.maxWidth = a + "px";
            this.style.maxHeight = b + "px";
            Config.centeredThreads && (a = this.getBoundingClientRect().left, a = this.offsetWidth + 2 * a, a > h ? (a = Math.floor(($.docEl.clientWidth - a) / 2), 0 < a && (f.style.marginLeft = a + "px")) : $.removeClass(f, "centre-exp"))
        },
        onWebmPlay: function(a) {
            a = ImageExpansion;
            a.activeVideos.length || document.addEventListener("scroll", a.onScroll, !1);
            a.activeVideos.push(this)
        },
        collapseWebm: function(a) {
            var b, c;
            a.preventDefault();
            this.removeEventListener("click", ImageExpansion.collapseWebm, !1);
            a = this.parentNode;
            b = a.parentNode.parentNode.getElementsByClassName("expandedWebm")[0];
            Config.centeredThreads && (c = b.parentNode.parentNode.parentNode, $.removeClass(c, "centre-exp"), c.style.marginLeft = "");
            b.previousElementSibling.style.display = "";
            b.parentNode.removeChild(b);
            a.parentNode.removeChild(a)
        },
        onScroll: function(a) {
            clearTimeout(ImageExpansion.timeout);
            ImageExpansion.timeout = setTimeout(ImageExpansion.pauseVideos, 500)
        },
        pauseVideos: function() {
            var a, b, c, d, e, f, h;
            a = ImageExpansion;
            h = [];
            e = window.pageYOffset;
            f = window.pageYOffset + $.docEl.clientHeight;
            for (b = 0; c = a.activeVideos[b]; ++b) d = c.getBoundingClientRect(), d.top + window.pageYOffset > f || d.bottom + window.pageYOffset < e ? c.pause() : c.paused || h.push(c);
            h.length || document.removeEventListener("scroll", a.onScroll, !1);
            a.activeVideos = h
        },
        onError: function(a) {
            var b;
            Feedback.error("File no longer exists (404).", 2E3);
            b = a.target;
            a = $.qs("img[data-expanding]", b.parentNode);
            b.parentNode.removeChild(b);
            a.style.opacity = "";
            a.removeAttribute("data-expanding")
        },
        onLoadStart: function(a, b) {
            var c, d, e, f, h, g, k, l;
            b.removeAttribute("data-expanding");
            g = b.parentNode.parentNode;
            Config.centeredThreads && (k = g.parentNode.parentNode, l = $.cls("opContainer")[0].offsetWidth, $.addClass(k, "centre-exp"));
            c = b.getBoundingClientRect().left;
            e = $.docEl.clientWidth - c - 25;
            f = $.docEl.clientHeight;
            c = a.naturalWidth;
            d = a.naturalHeight;
            c > e && (h = e / c, c = e, d *= h);
            Config.fitToScreenExpansion && d > f && (h = f / d, d = f, c *= h);
            a.style.maxWidth = c + "px";
            a.style.maxHeight = d + "px";
            $.addClass(g, "image-expanded");
            !Main.tid && Config.threadHiding && $.addClass(b.parentNode, "image-expanded-anti");
            a.style.display = "";
            b.style.display = "none";
            if (Config.centeredThreads) c = a.getBoundingClientRect().left, g = a.offsetWidth + 2 * c, g > l ? (c = Math.floor(($.docEl.clientWidth - g) / 2), 0 < c && (k.style.marginLeft = c + "px")) : $.removeClass(k, "centre-exp");
            else if (Main.hasMobileLayout && (k = b.parentNode.lastElementChild, !k.firstElementChild)) {
                g = document.createElement("div");
                g.className = "mFileName";
                if (l = b.parentNode.parentNode.getElementsByClassName("fileText")[0]) l = l.firstElementChild, g.innerHTML = l.getAttribute("title") || l.innerHTML;
                k.insertBefore(g, k.firstChild)
            }
        },
        checkLoadStart: function(a, b) {
            if (a.naturalWidth) ImageExpansion.onLoadStart(a, b), b.style.opacity = "";
            else return setTimeout(ImageExpansion.checkLoadStart, 15, a, b)
        }
    },
    ImageHover = {
        show: function(a) {
            var b, c;
            c = a.parentNode.getAttribute("href");
            (b = c.match(/\.(?:webm|pdf)$/)) ? ".webm" == b[0] && ImageHover.showWebm(a) : (b = document.createElement("img"), b.id = "image-hover", b.alt = "Image", b.onerror = ImageHover.onLoadError, b.setAttribute("src", c), document.body.appendChild(b), UA.hasCORS ? (b.style.display = "none", this.timeout = ImageHover.checkLoadStart(b, a)) : b.style.left = a.getBoundingClientRect().right + 10 + "px")
        },
        hide: function() {
            var a;
            clearTimeout(this.timeout);
            if (a = $.id("image-hover")) a.play && Tip.hide(), document.body.removeChild(a)
        },
        showWebm: function(a) {
            var b, c, d;
            d = +a.parentNode.previousElementSibling.textContent.match(/, ([0-9]+)x[0-9]+/)[1];
            b = document.createElement("video");
            b.id = "image-hover";
            b.src = a.parentNode.getAttribute("href");
            b.loop = !0;
            b.muted = !0;
            b.autoplay = !0;
            b.onerror = ImageHover.onLoadError;
            b.onloadedmetadata = function() {
                ImageHover.showWebMDuration(this, a)
            };
            c = a.getBoundingClientRect();
            c = window.innerWidth - c.right - 20;
            d > c && (b.style.maxWidth = c + "px");
            document.body.appendChild(b)
        },
        showWebMDuration: function(a, b) {
            if (a.parentNode) {
                var c = $.prettySeconds(a.duration);
                Tip.show(b, c[0] + ":" + ("0" + c[1]).slice(-2))
            }
        },
        onLoadError: function() {
            Feedback.error("File no longer exists (404).", 2E3)
        },
        onLoadStart: function(a, b) {
            var c;
            c = b.getBoundingClientRect();
            c = window.innerWidth - c.right - 20;
            a.naturalWidth > c && (a.style.maxWidth = c + "px");
            a.style.display = ""
        },
        checkLoadStart: function(a, b) {
            if (a.naturalWidth) ImageHover.onLoadStart(a, b);
            else return setTimeout(ImageHover.checkLoadStart, 15, a, b)
        }
    },
    QR = {
        init: function() {
            var a;
            if (UA.hasFormData) {
                this.enabled = !0;
                this.timestamp = this.cooldown = this.currentTid = null;
                this.auto = !1;
                this.comField = this.btn = null;
                this.comLength = window.comlen;
                this.lenCheckTimeout = null;
                this.activeDelay = this.cdElapsed = 0;
                this.cooldowns = {};
                for (a in window.cooldowns) this.cooldowns[a] = 1E3 * window.cooldowns[a];
                this.xhr = this.pulse = this.captchaWidgetId = this.captchaWidgetCnt = null;
                this.fileDisabled = !!window.imagelimit;
                this.tracked = {};
                this.lastTid = localStorage.getItem("4chan-cd-" + Main.board + "-tid");
                !Main.tid || Main.hasMobileLayout || Main.threadClosed || QR.addReplyLink();
                window.addEventListener("storage", this.syncStorage, !1)
            }
        },
        addReplyLink: function() {
            var a, b;
            a = $.cls("navLinks")[2];
            b = document.createElement("div");
            b.className = "open-qr-wrap";
            b.innerHTML = '[<a href="#" class="open-qr-link" data-cmd="open-qr">Post a Reply</a>]';
            a.insertBefore(b, a.firstChild)
        },
        lock: function() {
            QR.showPostError("This thread is closed.", "closed", !0)
        },
        unlock: function() {
            QR.hidePostError("closed")
        },
        syncStorage: function(a) {
            var b;
            a.key && (b = a.key.split("-"), "4chan" == b[0] && "cd" == b[1] && a.newValue && Main.board == b[2] && ("tid" == b[3] ? QR.lastTid = a.newValue : QR.startCooldown()))
        },
        quotePost: function(a, b) {
            !QR.noCooldown && (Main.threadClosed || !Main.tid && Main.isThreadClosed(a)) ? alert("This thread is closed") : (QR.show(a), QR.addQuote(b))
        },
        addQuote: function(a) {
            var b, c, d;
            d = $.tag("textarea", document.forms.qrPost)[0];
            b = d.selectionStart;
            c = UA.getSelection();
            a = a ? ">>" + a + "\n" : "";
            c && (a += ">" + c.trim().replace(/[\r\n]+/g, "\n>") + "\n");
            d.value = d.value ? d.value.slice(0, b) + a + d.value.slice(d.selectionEnd) : a;
            UA.isOpera && (b += a.split("\n").length);
            d.selectionStart = d.selectionEnd = b + a.length;
            d.selectionStart == d.value.length && (d.scrollTop = d.scrollHeight);
            d.focus()
        },
        show: function(a) {
            var b, c, d, e, f, h, g, k, l, n, m, q;
            if (QR.currentTid) Main.tid || QR.currentTid == a || ($.id("qrTid").textContent = $.id("qrResto").value = QR.currentTid = a, $.byName("com")[1].value = "", QR.startCooldown()), Main.hasMobileLayout && ($.id("quickReply").style.top = window.pageYOffset + 25 + "px");
            else {
                QR.currentTid = a;
                e = $.id("postForm");
                d = document.createElement("div");
                d.id = "quickReply";
                d.className = "extPanel reply";
                d.setAttribute("data-trackpos", "QR-position");
                Main.hasMobileLayout ? d.style.top = window.pageYOffset + 28 + "px" : Config["QR-position"] ? d.style.cssText = Config["QR-position"] : (d.style.right = "0px", d.style.top = "10%");
                d.innerHTML = '<div id="qrHeader" class="drag postblock">Reply to Thread No.<span id="qrTid">' + a + '</span><img alt="X" src="' + Main.icons.cross + '" id="qrClose" class="extButton" title="Close Window"></div>';
                f = e.parentNode.cloneNode(!1);
                f.setAttribute("name", "qrPost");
                f.innerHTML = '<input type="hidden" value="' + $.byName("MAX_FILE_SIZE")[0].value + '" name="MAX_FILE_SIZE"><input type="hidden" value="regist" name="mode"><input id="qrResto" type="hidden" value="' + a + '" name="resto">';
                a = document.createElement("div");
                a.id = "qrForm";
                this.btn = null;
                h = e.firstElementChild.children;
                b = 0;
                for (c = h.length - 1; b < c; ++b) {
                    g = document.createElement("div");
                    if ("captchaFormPart" == h[b].id) {
                        if (QR.noCaptcha) continue;
                        g.id = "qrCaptchaContainer";
                        QR.captchaWidgetCnt = g
                    } else if (m = h[b].getAttribute("data-type"), "Password" == m || "Spoilers" == m) continue;
                    else if ("File" == m) k = h[b].children[1].firstChild.cloneNode(!1), k.tabIndex = "", k.id = "qrFile", k.size = "19", k.addEventListener("change", QR.onFileChange, !1), g.appendChild(k), UA.hasDragAndDrop && ($.addClass(k, "qrRealFile"), k = document.createElement("div"), k.id = "qrDummyFile", l = document.createElement("button"), l.id = "qrDummyFileButton", l.type = "button", l.textContent = "Browse\u2026", k.appendChild(l), l = document.createElement("span"), l.id = "qrDummyFileLabel", l.textContent = "No file selected.", k.appendChild(l), g.appendChild(k)), k.title = "Shift + Click to remove the file";
                    else if (g.innerHTML = h[b].children[1].innerHTML, l = "hidden" == g.firstChild.type ? g.lastChild.previousSibling : g.firstChild, l.tabIndex = "", "INPUT" == l.nodeName || "TEXTAREA" == l.nodeName) {
                        if ("name" == l.name) {
                            if (q = Main.getCookie("4chan_name")) l.value = q
                        } else if ("email" == l.name) {
                            l.id = "qrEmail";
                            if (q = Main.getCookie("options")) l.value = q;
                            l.nextElementSibling && l.parentNode.removeChild(l.nextElementSibling)
                        } else if ("com" == l.name) QR.comField = l, l.addEventListener("keydown", QR.onKeyDown, !1), l.addEventListener("paste", QR.onKeyDown, !1), l.addEventListener("cut", QR.onKeyDown, !1), g.children[1] && g.removeChild(l.nextSibling);
                        else if ("sub" == l.name) continue;
                        null !== m && l.setAttribute("placeholder", m)
                    } else "flag" == l.name && ((n = l.querySelector("option[selected]")) && n.removeAttribute("selected"), (q = Main.getCookie("4chan_flag")) && (n = l.querySelector('option[value="' + q + '"]')) && n.setAttribute("selected", "selected"));
                    a.appendChild(g)
                }
                this.btn || (this.btn = e.querySelector('input[type="submit"]').cloneNode(!1), this.btn.tabIndex = "", k ? k.parentNode.appendChild(this.btn) : (a.appendChild(document.createElement("div")), a.lastElementChild.appendChild(this.btn)));
                e.querySelector('.desktop > label > input[name="spoiler"]') && (e = document.createElement("span"), e.id = "qrSpoiler", e.innerHTML = '<label>[<input type="checkbox" value="on" name="spoiler">Spoiler?]</label>', k.parentNode.insertBefore(e, k.nextSibling));
                f.appendChild(a);
                d.appendChild(f);
                f = document.createElement("div");
                f.id = "qrError";
                d.appendChild(f);
                d.addEventListener("click", QR.onClick, !1);
                document.body.appendChild(d);
                QR.startCooldown();
                Main.threadClosed && QR.lock();
                window.passEnabled || QR.renderCaptcha();
                Main.hasMobileLayout || Draggable.set($.id("qrHeader"))
            }
        },
        renderCaptcha: function() {
            window.grecaptcha && (QR.captchaWidgetId = grecaptcha.render(QR.captchaWidgetCnt, {
                sitekey: window.recaptchaKey,
                theme: "tomorrow" === Main.stylesheet ? "dark" : "light"
            }))
        },
        resetCaptcha: function() {
            window.grecaptcha && null !== QR.captchaWidgetId && grecaptcha.reset(QR.captchaWidgetId)
        },
        onPassError: function() {
            var a, b;
            QR.captchaWidgetCnt || (window.passEnabled = QR.noCaptcha = !1, a = document.createElement("div"), a.id = "qrCaptchaContainer", b = $.id("qrForm"), b.insertBefore(a, b.lastElementChild), QR.captchaWidgetCnt = a, QR.renderCaptcha())
        },
        onFileChange: function(a) {
            var b;
            this.value ? (b = window.maxFilesize, this.files ? (a = this.files[0].size, "video/webm" == this.files[0].type && window.maxWebmFilesize && (b = window.maxWebmFilesize)) : a = 0, QR.fileDisabled ? QR.showPostError("Image limit reached.", "imagelimit", !0) : a > b ? QR.showPostError("Error: Maximum file size allowed is " + Math.floor(b / 1048576) + " MB", "filesize", !0) : QR.hidePostError()) : QR.hidePostError();
            QR.startCooldown()
        },
        onKeyDown: function(a) {
            if (a.ctrlKey && 83 == a.keyCode) {
                var b, c, d;
                a.stopPropagation();
                a.preventDefault();
                a = a.target;
                b = a.selectionStart;
                c = a.selectionEnd;
                a.value ? (d = "[spoiler]" + a.value.slice(b, c) + "[/spoiler]", a.value = a.value.slice(0, b) + d + a.value.slice(c), a.setSelectionRange(c + 19, c + 19)) : (a.value = "[spoiler][/spoiler]", a.setSelectionRange(9, 9))
            } else if (!(27 != a.keyCode || a.ctrlKey || a.altKey || a.shiftKey || a.metaKey)) {
                QR.close();
                return
            }
            clearTimeout(QR.lenCheckTimeout);
            QR.lenCheckTimeout = setTimeout(QR.checkComLength, 500)
        },
        checkComLength: function() {
            var a;
            QR.comLength && (a = encodeURIComponent(QR.comField.value).split(/%..|./).length - 1, a > QR.comLength ? QR.showPostError("Error: Comment too long (" + a + "/" + QR.comLength + ").", "length", !0) : QR.hidePostError("length"))
        },
        close: function() {
            var a, b = $.id("quickReply");
            QR.comField = null;
            QR.currentTid = null;
            clearInterval(QR.captchaInterval);
            clearInterval(QR.pulse);
            QR.xhr && (QR.xhr.abort(), QR.xhr = null);
            b.removeEventListener("click", QR.onClick, !1);
            (a = $.id("qrFile")) && a.removeEventListener("change", QR.startCooldown, !1);
            (a = $.id("qrEmail")) && a.removeEventListener("change", QR.startCooldown, !1);
            $.tag("textarea", b)[0].removeEventListener("keydown", QR.onKeyDown, !1);
            Draggable.unset($.id("qrHeader"));
            window.RecaptchaState && (Recaptcha.destroy(), window.captchaReady = !1, a = $.id("captchaContainer")) && (a.innerHTML = '<div class="placeholder">' + a.getAttribute("data-placeholder") + "</div>");
            document.body.removeChild(b)
        },
        onClick: function(a) {
            var b = a.target;
            if ("submit" == b.type) a.preventDefault(), QR.submit(a.shiftKey);
            else switch (b.id) {
                case "qrFile":
                    a.shiftKey && (a.preventDefault(), QR.resetFile());
                    break;
                case "qrDummyFile":
                case "qrDummyFileButton":
                case "qrDummyFileLabel":
                    a.preventDefault();
                    a.shiftKey ? QR.resetFile() : $.id("qrFile").click();
                    break;
                case "qrClose":
                    QR.close()
            }
        },
        showPostError: function(a, b, c) {
            var d;
            if (d = $.id("qrError")) d.innerHTML = a, d.style.display = "block", d.setAttribute("data-type", b || ""), !c && (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) && alert("Posting Error")
        },
        hidePostError: function(a) {
            var b = $.id("qrError");
            b.hasAttribute("style") && (a && b.getAttribute("data-type") != a || b.removeAttribute("style"))
        },
        resetFile: function() {
            var a, b;
            b = document.createElement("input");
            b.id = "qrFile";
            b.type = "file";
            b.size = "19";
            b.name = "upfile";
            b.addEventListener("change", QR.onFileChange, !1);
            a = $.id("qrFile");
            a.removeEventListener("change", QR.onFileChange, !1);
            a.parentNode.replaceChild(b, a);
            QR.hidePostError("imagelimit");
            QR.needPreuploadCaptcha = !1;
            QR.startCooldown()
        },
        submit: function(a) {
            QR.hidePostError();
            QR.presubmitChecks(a) && (QR.auto = !1, QR.xhr = new XMLHttpRequest, QR.xhr.open("POST", document.forms.qrPost.action, !0), QR.xhr.withCredentials = !0, QR.xhr.upload.onprogress = function(a) {
                QR.btn.value = a.loaded >= a.total ? "100%" : (0 | a.loaded / a.total * 100) + "%"
            }, QR.xhr.onerror = function() {
                QR.xhr = null;
                QR.showPostError("Connection error.")
            }, QR.xhr.onload = function() {
                var a, c, d, e;
                QR.xhr = null;
                QR.btn.value = "Post";
                if (200 == this.status)
                    if (a = this.responseText.match(/"errmsg"[^>]*>(.*?)<\/span/)) {
                        if (/4chan Pass/.test(a)) QR.onPassError();
                        else QR.resetCaptcha();
                        QR.showPostError(a[1])
                    } else {
                        if (e = this.responseText.match(/\x3c!-- thread:([0-9]+),no:([0-9]+) --\x3e/)) {
                            a = e[1];
                            e = e[2];
                            QR.lastTid = a;
                            localStorage.setItem("4chan-cd-" + Main.board + "-tid", a);
                            d = (c = $.id("qrFile")) && c.value;
                            QR.setPostTime();
                            if (Config.persistentQR) {
                                $.byName("com")[1].value = "";
                                if (c = $.byName("spoiler")[2]) c.checked = !1;
                                QR.resetCaptcha();
                                d && QR.resetFile();
                                QR.startCooldown()
                            } else QR.close();
                            Main.tid ? (Config.threadWatcher && ThreadWatcher.setLastRead(e, a), QR.lastReplyId = +e, Parser.trackedReplies[">>" + e] = 1, Parser.saveTrackedReplies(a, Parser.trackedReplies)) : (c = Parser.getTrackedReplies(a) || {}, c[">>" + e] = 1, Parser.saveTrackedReplies(a, c));
                            UA.dispatchEvent("4chanQRPostSuccess", {
                                threadId: a,
                                postId: e
                            })
                        }
                        ThreadUpdater.enabled && setTimeout(ThreadUpdater.forceUpdate, 500)
                    } else QR.showPostError("Error: " + this.status + " " + this.statusText)
            }, a = new FormData(document.forms.qrPost), clearInterval(QR.pulse), QR.btn.value = "Sending", QR.xhr.send(a))
        },
        presubmitChecks: function(a) {
            return QR.xhr ? (QR.xhr.abort(), QR.xhr = null, QR.showPostError("Aborted."), QR.btn.value = "Post", !1) : !a && QR.cooldown ? ((QR.auto = !QR.auto) ? QR.btn.value = QR.cooldown + "s (auto)" : QR.btn.value = QR.cooldown + "s", !1) : !0
        },
        getCooldown: function(a) {
            return QR.currentTid != QR.lastTid ? QR.cooldowns[a] : QR.cooldowns[a + "_intra"]
        },
        setPostTime: function() {
            return localStorage.setItem("4chan-cd-" + Main.board, Date.now())
        },
        getPostTime: function() {
            return localStorage.getItem("4chan-cd-" + Main.board)
        },
        removePostTime: function() {
            return localStorage.removeItem("4chan-cd-" + Main.board)
        },
        startCooldown: function() {
            var a, b;
            QR.noCooldown || !$.id("quickReply") || QR.xhr || (clearInterval(QR.pulse), a = (b = $.id("qrFile")) && b.value ? "image" : "reply", (b = QR.getPostTime(a)) ? (QR.timestamp = parseInt(b, 10), QR.activeDelay = QR.getCooldown(a), QR.cdElapsed = Date.now() - QR.timestamp, QR.cooldown = Math.floor((QR.activeDelay - QR.cdElapsed) / 1E3), 0 >= QR.cooldown || 0 > QR.cdElapsed ? (QR.cooldown = !1, QR.removePostTime(a)) : (QR.btn.value = QR.cooldown + "s", QR.pulse = setInterval(QR.onPulse, 1E3))) : QR.btn.value = "Post")
        },
        onPulse: function() {
            QR.cdElapsed = Date.now() - QR.timestamp;
            QR.cooldown = Math.floor((QR.activeDelay - QR.cdElapsed) / 1E3);
            0 >= QR.cooldown ? (clearInterval(QR.pulse), QR.btn.value = "Post", QR.cooldown = !1, QR.auto && QR.submit()) : QR.btn.value = QR.cooldown + (QR.auto ? "s (auto)" : "s")
        }
    },
    ThreadHiding = {
        init: function() {
            this.threshold = 432E5;
            this.hidden = {};
            this.load();
            this.purge()
        },
        clear: function(a) {
            var b, c;
            this.load();
            b = 0;
            for (c in this.hidden)++b;
            c = "4chan-hide-t-" + Main.board;
            a ? localStorage.removeItem(c) : b ? (a = "This will unhide " + b + " thread" + (1 < b ? "s" : "") + " on /" + Main.board + "/", confirm(a) && localStorage.removeItem(c)) : alert("You don't have any hidden threads on /" + Main.board + "/")
        },
        isHidden: function(a) {
            a = $.id("sa" + a);
            return !a || a.hasAttribute("data-hidden")
        },
        toggle: function(a) {
            this.isHidden(a) ? this.show(a) : this.hide(a);
            this.save()
        },
        show: function(a) {
            var b, c;
            c = $.id("t" + a);
            b = $.id("sa" + a);
            b.removeAttribute("data-hidden");
            Main.hasMobileLayout ? (b.textContent = "Hide", $.removeClass(b, "mobile-tu-show"), $.cls("postLink", c)[0].appendChild(b), c.style.display = null, $.removeClass(c.nextElementSibling, "mobile-hr-hidden")) : (b.firstChild.src = Main.icons.minus, $.removeClass(c, "post-hidden"));
            delete this.hidden[a]
        },
        hide: function(a) {
            var b, c;
            c = $.id("t" + a);
            Main.hasMobileLayout ? (c.style.display = "none", $.addClass(c.nextElementSibling, "mobile-hr-hidden"), b = $.id("sa" + a), b.setAttribute("data-hidden", a), b.textContent = "Show Hidden Thread", $.addClass(b, "mobile-tu-show"), c.parentNode.insertBefore(b, c)) : Config.hideStubs && !$.cls("stickyIcon", c)[0] ? c.style.display = c.nextElementSibling.style.display = "none" : (b = $.id("sa" + a), b.setAttribute("data-hidden", a), b.firstChild.src = Main.icons.plus, c.className += " post-hidden");
            this.hidden[a] = Date.now()
        },
        load: function() {
            var a;
            if (a = localStorage.getItem("4chan-hide-t-" + Main.board)) this.hidden = JSON.parse(a)
        },
        purge: function() {
            var a, b, c, d;
            d = "4chan-purge-t-" + Main.board;
            c = localStorage.getItem(d);
            for (a in this.hidden) {
                b = !0;
                break
            }
            b && (!c || c < Date.now() - this.threshold) && $.get("//a.4cdn.org/" + Main.board + "/threads.json", {
                onload: function() {
                    var a, b, c, g, k, l;
                    if (200 == this.status) {
                        l = {};
                        g = JSON.parse(this.responseText);
                        for (a = 0; b = g[a]; ++a)
                            for (k = b.threads, b = 0; c = k[b]; ++b) ThreadHiding.hidden[c.no] && (l[c.no] = 1);
                        ThreadHiding.hidden = l;
                        ThreadHiding.save();
                        localStorage.setItem(d, Date.now())
                    } else console.log("Bad status code while purging threads")
                },
                onerror: function() {
                    console.log("Error while purging hidden threads")
                }
            })
        },
        save: function() {
            for (var a in this.hidden) {
                localStorage.setItem("4chan-hide-t-" + Main.board, JSON.stringify(this.hidden));
                return
            }
            localStorage.removeItem("4chan-hide-t-" + Main.board)
        }
    },
    ReplyHiding = {
        init: function() {
            this.threshold = 6048E5;
            this.hidden = {};
            this.load()
        },
        isHidden: function(a) {
            a = $.id("sa" + a);
            return !a || a.hasAttribute("data-hidden")
        },
        toggle: function(a) {
            this.isHidden(a) ? this.show(a) : this.hide(a);
            this.save()
        },
        show: function(a) {
            var b;
            b = $.id("pc" + a);
            $.removeClass(b, "post-hidden");
            $.id("sa" + a).removeAttribute("data-hidden");
            delete ReplyHiding.hidden[a]
        },
        hide: function(a) {
            var b;
            b = $.id("pc" + a);
            $.addClass(b, "post-hidden");
            $.id("sa" + a).setAttribute("data-hidden", a);
            ReplyHiding.hidden[a] = Date.now()
        },
        toggleR: function(a) {
            var b;
            b = this.isHidden(a) ? this.show : this.hide;
            this.toggleRFunc(a, b);
            this.save()
        },
        toggleRFunc: function(a, b) {
            var c, d, e, f, h, g, k, l = {};
            d = $.id("m" + a);
            h = $.cls("postMessage");
            l[">>" + a] = !0;
            b(a);
            for (c = 1; h[c] !== d; ++c);
            for (; f = h[c]; ++c)
                if (!f.parentNode.hasAttribute("data-pfx") && (g = f.querySelectorAll("#" + f.id + " > .quotelink"), g[0])) {
                    if (1 === g.length && l[g[0].textContent]) k = !0;
                    else
                        for (k = !0, d = 0; e = g[d]; ++d)
                            if (!l[e.textContent]) {
                                k = !1;
                                break
                            }
                    k && (d = f.id.slice(1), b(d), l[">>" + d] = !0)
                }
        },
        load: function() {
            var a;
            if (a = localStorage.getItem("4chan-hide-r-" + Main.board)) this.hidden = JSON.parse(a)
        },
        purge: function() {
            var a, b;
            b = Date.now();
            for (a in this.hidden) b - this.hidden[a] > this.threshold && delete this.hidden[a];
            this.save()
        },
        save: function() {
            for (var a in this.hidden) {
                localStorage.setItem("4chan-hide-r-" + Main.board, JSON.stringify(this.hidden));
                return
            }
            localStorage.removeItem("4chan-hide-r-" + Main.board)
        }
    },
    ThreadWatcher = {
        init: function() {
            var a, b, c;
            this.listNode = null;
            this.charLimit = 45;
            this.watched = {};
            this.blacklisted = {};
            this.isRefreshing = !1;
            Main.hasMobileLayout && (c = document.createElement("a"), c.href = "#", c.textContent = "TW", c.addEventListener("click", ThreadWatcher.toggleList, !1), a = $.id("settingsWindowLinkMobile"), a.parentNode.insertBefore(c, a), a.parentNode.insertBefore(document.createTextNode(" "), a));
            if (location.hash && (b = location.hash.split("lr")[1])) {
                if (b = $.id("pc" + b)) b.nextElementSibling && (b = b.nextElementSibling, (c = $.id("p" + b.id.slice(2))) && $.addClass(c, "highlight")), a = b.getBoundingClientRect(), (0 > a.top || a.bottom > document.documentElement.clientHeight) && window.scrollBy(0, a.top);
                window.history && history.replaceState && history.replaceState(null, "", location.href.split("#", 1)[0])
            }
            a = document.createElement("div");
            a.id = "threadWatcher";
            a.className = "extPanel reply";
            a.setAttribute("data-trackpos", "TW-position");
            Main.hasMobileLayout ? a.style.display = "none" : (Config["TW-position"] ? a.style.cssText = Config["TW-position"] : (a.style.left = "10px", a.style.top = "380px"), a.style.position = Config.fixedThreadWatcher ? "fixed" : "");
            a.innerHTML = '<div class="drag" id="twHeader">' + (Main.hasMobileLayout ? '<img id="twClose" class="pointer" src="' + Main.icons.cross + '" alt="X">' : "") + "Thread Watcher" + (UA.hasCORS ? '<img id="twPrune" class="pointer right" src="' + Main.icons.refresh + '" alt="R" title="Refresh"></div>' : "</div>");
            this.listNode = document.createElement("ul");
            this.listNode.id = "watchList";
            this.load();
            Main.tid && this.refreshCurrent();
            this.build();
            a.appendChild(this.listNode);
            document.body.appendChild(a);
            a.addEventListener("mouseup", this.onClick, !1);
            Draggable.set($.id("twHeader"));
            window.addEventListener("storage", this.syncStorage, !1);
            Main.hasMobileLayout ? Main.tid && ThreadWatcher.initMobileButtons() : !Main.tid && this.canAutoRefresh() && this.refresh()
        },
        toggleList: function(a) {
            var b = $.id("threadWatcher");
            a && a.preventDefault();
            !Main.tid && ThreadWatcher.canAutoRefresh() && ThreadWatcher.refresh();
            "none" == b.style.display ? (b.style.top = window.pageYOffset + 30 + "px", b.style.display = "") : b.style.display = "none"
        },
        syncStorage: function(a) {
            var b;
            a.key && (b = a.key.split("-"), "4chan" != b[0] || "watch" != b[1] || b[2] || a.newValue == a.oldValue || (ThreadWatcher.load(), ThreadWatcher.build(!0)))
        },
        load: function() {
            if (storage = localStorage.getItem("4chan-watch")) this.watched = JSON.parse(storage);
            if (storage = localStorage.getItem("4chan-watch-bl")) this.blacklisted = JSON.parse(storage)
        },
        build: function(a) {
            var b, c, d, e;
            b = "";
            for (d in this.watched) c = d.split("-"), b += '<li id="watch-' + d + '"><span class="pointer" data-cmd="unwatch" data-id="' + c[0] + '" data-board="' + c[1] + '">&times;</span> <a href="' + Main.linkToThread(c[0], c[1]) + "#lr" + this.watched[d][1] + '"', -1 == this.watched[d][1] ? b += ' class="deadlink">' : (e = this.watched[d][3] ? "archivelink" : !1, b = this.watched[d][2] ? b + (' class="' + (e ? e + " " : "") + 'hasNewReplies">(' + this.watched[d][2] + ") ") : b + ((e ? 'class="' + e + '"' : "") + ">")), b += "/" + c[1] + "/ - " + this.watched[d][0] + "</a></li>";
            a && ThreadWatcher.rebuildButtons();
            ThreadWatcher.listNode.innerHTML = b
        },
        rebuildButtons: function() {
            var a, b, c;
            b = $.cls("wbtn");
            for (a = 0; btn = b[a]; ++a) c = btn.getAttribute("data-id") + "-" + Main.board, ThreadWatcher.watched[c] ? btn.hasAttribute("data-active") || (btn.src = Main.icons.watched, btn.setAttribute("data-active", "1")) : btn.hasAttribute("data-active") && (btn.src = Main.icons.notwatched, btn.removeAttribute("data-active"))
        },
        initMobileButtons: function() {
            var a, b;
            a = document.createElement("img");
            b = Main.tid + "-" + Main.board;
            ThreadWatcher.watched[b] ? (a.src = Main.icons.watched, a.setAttribute("data-active", "1")) : a.src = Main.icons.notwatched;
            a.className = "extButton wbtn wbtn-" + b;
            a.setAttribute("data-cmd", "watch");
            a.setAttribute("data-id", Main.tid);
            a.alt = "W";
            b = document.createElement("span");
            b.className = "mobileib button";
            b.appendChild(a);
            if (a = $.cls("navLinks")[0]) a.appendChild(document.createTextNode(" ")), a.appendChild(b);
            if (a = $.cls("navLinks")[3]) a.appendChild(document.createTextNode(" ")), a.appendChild(b.cloneNode(!0))
        },
        onClick: function(a) {
            a = a.target;
            a.hasAttribute("data-id") ? ThreadWatcher.toggle(a.getAttribute("data-id"), a.getAttribute("data-board")) : "twPrune" != a.id || ThreadWatcher.isRefreshing ? "twClose" == a.id && ThreadWatcher.toggleList() : ThreadWatcher.refreshWithAutoWatch()
        },
        generateLabel: function(a, b, c) {
            var d;
            return d = (d = a) ? d.slice(0, this.charLimit) : (d = b) ? d.replace(/(?:<br>)+/g, " ").replace(/<[^>]*?>/g, "").slice(0, this.charLimit) : "No." + c
        },
        toggle: function(a, b) {
            var c, d, e;
            c = a + "-" + (b || Main.board);
            this.watched[c] ? (this.blacklisted[c] = 1, delete this.watched[c]) : (d = $.cls("subject", $.id("pi" + a))[0].textContent, e = $.id("m" + a).innerHTML, d = ThreadWatcher.generateLabel(d, e, a), e = (thread = $.id("t" + a)).children[1] ? thread.lastElementChild.id.slice(2) : a, this.watched[c] = [d, e, 0]);
            this.save();
            this.load();
            this.build(!0)
        },
        addRaw: function(a, b) {
            var c, d;
            c = a.no + "-" + b;
            this.watched[c] || (d = ThreadWatcher.generateLabel(a.sub, a.com, a.no), this.watched[c] = [d, 0, 0])
        },
        save: function() {
            var a;
            ThreadWatcher.sortByBoard();
            localStorage.setItem("4chan-watch", JSON.stringify(ThreadWatcher.watched));
            for (a in ThreadWatcher.blacklisted) {
                localStorage.setItem("4chan-watch-bl", JSON.stringify(ThreadWatcher.blacklisted));
                break
            }
        },
        sortByBoard: function() {
            var a, b, c, d, e;
            b = ThreadWatcher;
            d = {};
            e = [];
            for (c in b.watched) e.push(c);
            e.sort(function(a, b) {
                a = a.split("-")[1];
                b = b.split("-")[1];
                return a < b ? -1 : a > b ? 1 : 0
            });
            for (a = 0; c = e[a]; ++a) d[c] = b.watched[c];
            b.watched = d
        },
        canAutoRefresh: function() {
            var a;
            return (a = localStorage.getItem("4chan-tw-timestamp")) ? 6E4 <= Date.now() - +a : !1
        },
        setRefreshTimestamp: function() {
            localStorage.setItem("4chan-tw-timestamp", Date.now())
        },
        refreshWithAutoWatch: function() {
            var a, b, c, d, e;
            if (Config.filter) {
                Filter.load();
                e = {};
                for (a = c = 0; b = Filter.activeFilters[a]; ++a)
                    if (b.auto && b.boards)
                        for (d in b.boards) e[d] || (e[d] = !0, ++c);
                c ? (a = $.id("twPrune"), a.src = Main.icons.rotate, this.isRefreshing = !0, this.fetchCatalogs(e, c)) : this.refresh()
            } else this.refresh()
        },
        fetchCatalogs: function(a, b) {
            var c, d, e, f;
            e = {};
            f = {
                count: b
            };
            c = 0;
            for (d in a) setTimeout(ThreadWatcher.fetchCatalog, c, d, e, f), c += 200
        },
        fetchCatalog: function(a, b, c) {
            var d;
            d = new XMLHttpRequest;
            d.open("GET", "//a.4cdn.org/" + a + "/catalog.json");
            d.onload = function() {
                c.count--;
                b[a] = Parser.parseCatalogJSON(this.responseText);
                if (!c.count) ThreadWatcher.onCatalogsLoaded(b)
            };
            d.onerror = function() {
                c.count--;
                if (!c.count) ThreadWatcher.onCatalogsLoaded(b)
            };
            d.send(null)
        },
        onCatalogsLoaded: function(a) {
            var b, c, d, e, f, h, g, k;
            $.id("twPrune").src = Main.icons.refresh;
            this.isRefreshing = !1;
            k = {};
            for (d in a)
                for (e = a[d], b = 0; c = e[b]; ++b)
                    for (f = c.threads, c = 0; h = f[c]; ++c) g = h.no + "-" + d, this.blacklisted[g] ? k[g] = 1 : Filter.match(h, d) && this.addRaw(h, d);
            this.blacklisted = k;
            this.build(!0);
            this.refresh()
        },
        refresh: function() {
            var a, b, c, d, e;
            if (d = $.id("watchList").children.length)
                for (c in a = b = 0, e = $.id("twPrune"), e.src = Main.icons.rotate, ThreadWatcher.isRefreshing = !0, ThreadWatcher.setRefreshTimestamp(), ThreadWatcher.watched) setTimeout(ThreadWatcher.fetch, b, c, ++a == d ? e : null), b += 200
        },
        refreshCurrent: function(a) {
            var b, c, d;
            b = Main.tid + "-" + Main.board;
            this.watched[b] && (d = (c = $.id("t" + Main.tid)).children[1] ? c.lastElementChild.id.slice(2) : Main.tid, this.watched[b][1] < d && (this.watched[b][1] = d), this.watched[b][2] = 0, this.save(), a && this.build())
        },
        setLastRead: function(a, b) {
            var c = b + "-" + Main.board;
            this.watched[c] && (this.watched[c][1] = a, this.watched[c][2] = 0, this.save(), this.build())
        },
        onRefreshEnd: function(a) {
            a.src = Main.icons.refresh;
            this.isRefreshing = !1;
            this.save();
            this.load();
            this.build()
        },
        fetch: function(a, b) {
            var c, d;
            c = $.id("watch-" + a);
            if (-1 == ThreadWatcher.watched[a][1]) {
                if (delete ThreadWatcher.watched[a], c.parentNode.removeChild(c), b) ThreadWatcher.onRefreshEnd(b)
            } else c = a.split("-"), d = new XMLHttpRequest, d.onload = function() {
                var c, d, h, g;
                if (200 == this.status) {
                    h = Parser.parseThreadJSON(this.responseText);
                    g = ThreadWatcher.watched[a][1];
                    d = 0;
                    for (c = h.length - 1; 1 <= c && !(h[c].no <= g); c--)++d;
                    d > ThreadWatcher.watched[a][2] && (ThreadWatcher.watched[a][2] = d);
                    h[0].archived && (ThreadWatcher.watched[a][3] = 1)
                } else 404 == this.status && (ThreadWatcher.watched[a][1] = -1); if (b) ThreadWatcher.onRefreshEnd(b)
            }, b && (d.onerror = d.onload), d.open("GET", "//a.4cdn.org/" + c[1] + "/thread/" + c[0] + ".json"), d.send(null)
        }
    },
    ThreadExpansion = {
        init: function() {
            this.enabled = UA.hasCORS
        },
        expandComment: function(a) {
            var b, c, d, e;
            if (b = a.getAttribute("href").match(/^(?:thread\/)([0-9]+)#p([0-9]+)$/)) c = b[1], d = b[2], e = a.parentNode, e.textContent = "Loading...", $.get("//a.4cdn.org/" + Main.board + "/thread/" + c + ".json", {
                onload: function() {
                    var a, b, g, k;
                    if (200 == this.status) {
                        b = $.id("m" + d);
                        k = Parser.parseThreadJSON(this.responseText);
                        if (c == d) g = k[0];
                        else
                            for (a = k.length - 1; 0 < a; a--)
                                if (k[a].no == d) {
                                    g = k[a];
                                    break
                                }
                        g ? (g = Parser.buildHTMLFromJSON(g, Main.board), b.innerHTML = $.cls("postMessage", g)[0].innerHTML, Parser.prettify && Parser.parseMarkup(b), window.jsMath && Parser.parseMathOne(b)) : e.textContent = "This post doesn't exist anymore."
                    } else 404 == this.status ? e.textContent = "This thread doesn't exist anymore." : (e.textContent = "Connection Error", console.log("ThreadExpansion: " + this.status + " " + this.statusText))
                },
                onerror: function() {
                    e.textContent = "Connection Error";
                    console.log("ThreadExpansion: xhr failed")
                }
            })
        },
        toggle: function(a) {
            var b, c, d, e;
            b = $.id("t" + a);
            e = b.children[1];
            b.hasAttribute("data-truncated") && (c = $.id("m" + a), d = c.nextSibling);
            $.hasClass(b, "tExpanded") ? (b.className = b.className.replace(" tExpanded", " tCollapsed"), e.children[0].src = Main.icons.plus, e.children[1].style.display = "inline", e.children[2].style.display = "none", c && (a = c.innerHTML, c.innerHTML = d.textContent, d.textContent = a)) : $.hasClass(b, "tCollapsed") ? (b.className = b.className.replace(" tCollapsed", " tExpanded"), e.children[0].src = Main.icons.minus, e.children[1].style.display = "none", e.children[2].style.display = "inline", c && (a = c.innerHTML, c.innerHTML = d.textContent, d.textContent = a)) : (e.children[0].src = Main.icons.rotate, ThreadExpansion.fetch(a))
        },
        fetch: function(a) {
            $.get("//a.4cdn.org/" + Main.board + "/thread/" + a + ".json", {
                onload: function() {
                    var b, c, d, e, f, h, g, k;
                    e = $.id("t" + a);
                    k = e.children[1];
                    if (200 == this.status) {
                        f = $.cls("reply", e);
                        h = Parser.parseThreadJSON(this.responseText);
                        !Config.revealSpoilers && h[0].custom_spoiler && Parser.setCustomSpoiler(Main.board, h[0].custom_spoiler);
                        d = document.createDocumentFragment();
                        if (f[0])
                            for (f = +f[0].id.slice(1), b = 1; c = h[b]; ++b)
                                if (c.no < f) c = Parser.buildHTMLFromJSON(c, Main.board), c.className += " rExpanded", d.appendChild(c);
                                else break;
                        else
                            for (b = 1; c = h[b]; ++b) c = Parser.buildHTMLFromJSON(c, Main.board), c.className += " rExpanded", d.appendChild(c);
                        f = $.id("m" + a);
                        (g = $.cls("abbr", f)[0]) && /^Comment/.test(g.textContent) && (e.setAttribute("data-truncated", "1"), g = document.createElement("div"), g.style.display = "none", g.textContent = f.innerHTML, f.parentNode.insertBefore(g, f.nextSibling), (g = $.cls("capcodeReplies", f)[0]) ? (f.innerHTML = h[0].com + "<br><br>", f.appendChild(g)) : f.innerHTML = h[0].com, Parser.prettify && Parser.parseMarkup(f), window.jsMath && Parser.parseMathOne(f));
                        e.insertBefore(d, k.nextSibling);
                        Parser.parseThread(a, 1, b - 1);
                        e.className += " tExpanded";
                        k.children[0].src = Main.icons.minus;
                        k.children[1].style.display = "none";
                        k.children[2].style.display = "inline"
                    } else 404 == this.status ? (k.children[0].src = Main.icons.plus, k.children[0].display = "none", k.children[1].textContent = "This thread doesn't exist anymore.") : (k.children[0].src = Main.icons.plus, console.log("ThreadExpansion: " + this.status + " " + this.statusText))
                },
                onerror: function() {
                    $.id("t" + a).children[1].children[0].src = Main.icons.plus;
                    console.log("ThreadExpansion: xhr failed")
                }
            })
        }
    },
    ThreadUpdater = {
        init: function() {
            UA.hasCORS && (this.enabled = !0, this.pageTitle = document.title, this.unreadCount = 0, this.auto = this.hadAuto = !1, this.delayId = 0, this.delayIdHidden = 4, this.delayRange = [10, 15, 20, 30, 60, 90, 120, 180, 240, 300], this.timeLeft = 0, this.interval = null, this.lastModified = "0", this.currentIcon = this.lastReply = null, this.iconPath = "//s.4cdn.org/image/", this.iconNode = document.head.querySelector('link[rel="shortcut icon"]'), this.iconNode.type = "image/x-icon", this.defaultIcon = this.iconNode.getAttribute("href").replace(this.iconPath, ""), this.deletionQueue = {}, Config.updaterSound && (this.audioEnabled = !1, this.audio = document.createElement("audio"), this.audio.src = "//s.4cdn.org/media/beep.ogg"), this.hidden = "hidden", this.visibilitychange = "visibilitychange", this.adRefreshDelay = 1E3, this.adDebounce = 0, this.ads = {}, "undefined" === typeof document.hidden && ("mozHidden" in document ? (this.hidden = "mozHidden", this.visibilitychange = "mozvisibilitychange") : "webkitHidden" in document ? (this.hidden = "webkitHidden", this.visibilitychange = "webkitvisibilitychange") : "msHidden" in document && (this.hidden = "msHidden", this.visibilitychange = "msvisibilitychange")), this.initAds(), this.initControls(), document.addEventListener("scroll", this.onScroll, !1), (Config.alwaysAutoUpdate || sessionStorage.getItem("4chan-auto-" + Main.tid)) && this.start())
        },
        buildMobileControl: function(a, b) {
            var c, d, e, f, h, g;
            b = b ? "Bot" : "";
            c = document.createElement("div");
            c.className = "btn-row";
            g = a.parentNode;
            d = g.cloneNode(!0);
            d.textContent = "Update";
            d.setAttribute("data-cmd", "update");
            c.appendChild(d);
            d = a.parentNode.parentNode;
            e = document.createElement("span");
            e.className = "mobileib button";
            h = document.createElement("label");
            f = document.createElement("input");
            f.type = "checkbox";
            f.setAttribute("data-cmd", "auto");
            this["autoNode" + b] = f;
            h.appendChild(f);
            h.appendChild(document.createTextNode("Auto"));
            e.appendChild(h);
            c.appendChild(document.createTextNode(" "));
            c.appendChild(e);
            h = document.createElement("div");
            h.className = "mobile-tu-status";
            c.appendChild(this["statusNode" + b] = h);
            d.appendChild(c);
            g.parentNode.removeChild(g);
            if (d = $.id("mpostform")) d.parentNode.style.marginTop = ""
        },
        buildDesktopControl: function(a) {
            var b, c, d;
            a = a ? "Bot" : "";
            b = document.createDocumentFragment();
            b.appendChild(document.createTextNode(" ["));
            c = document.createElement("a");
            c.href = "";
            c.textContent = "Update";
            c.setAttribute("data-cmd", "update");
            b.appendChild(c);
            b.appendChild(document.createTextNode("]"));
            b.appendChild(document.createTextNode(" ["));
            d = document.createElement("label");
            c = document.createElement("input");
            c.type = "checkbox";
            c.title = "Fetch new replies automatically";
            c.setAttribute("data-cmd", "auto");
            this["autoNode" + a] = c;
            d.appendChild(c);
            d.appendChild(document.createTextNode("Auto"));
            b.appendChild(d);
            b.appendChild(document.createTextNode("] "));
            Config.updaterSound && (b.appendChild(document.createTextNode(" [")), d = document.createElement("label"), c = document.createElement("input"), c.type = "checkbox", c.title = "Play a sound on new replies to your posts", c.setAttribute("data-cmd", "sound"), this["soundNode" + a] = c, d.appendChild(c), d.appendChild(document.createTextNode("Sound")), b.appendChild(d), b.appendChild(document.createTextNode("] ")));
            b.appendChild(this["statusNode" + a] = document.createElement("span"));
            (a = a ? $.cls("navLinks" + a)[0] : $.cls("navLinks")[1]) && a.appendChild(b)
        },
        initControls: function() {
            Main.hasMobileLayout ? (this.buildMobileControl($.id("refresh_top")), this.buildMobileControl($.id("refresh_bottom"), !0)) : (this.buildDesktopControl(), this.buildDesktopControl(!0))
        },
        start: function() {
            this.auto = this.hadAuto = !0;
            this.autoNode.checked = this.autoNodeBot.checked = !0;
            this.force = this.updating = !1;
            this.lastUpdated = Date.now();
            this.hidden && document.addEventListener(this.visibilitychange, this.onVisibilityChange, !1);
            this.delayId = 0;
            this.timeLeft = this.delayRange[0];
            this.pulse();
            sessionStorage.setItem("4chan-auto-" + Main.tid, 1)
        },
        stop: function(a) {
            clearTimeout(this.interval);
            this.auto = this.updating = this.force = !1;
            this.autoNode.checked = this.autoNodeBot.checked = !1;
            this.hidden && document.removeEventListener(this.visibilitychange, this.onVisibilityChange, !1);
            a && (this.setStatus(""), this.setIcon(null));
            sessionStorage.removeItem("4chan-auto-" + Main.tid)
        },
        pulse: function() {
            var a = ThreadUpdater;
            0 == a.timeLeft ? a.update() : (a.setStatus(a.timeLeft--), a.interval = setTimeout(a.pulse, 1E3))
        },
        adjustDelay: function(a) {
            0 == a ? this.force || this.delayId < this.delayRange.length - 1 && ++this.delayId : this.delayId = document[this.hidden] ? this.delayIdHidden : 0;
            this.timeLeft = this.delayRange[this.delayId];
            this.auto && this.pulse()
        },
        onVisibilityChange: function(a) {
            a = ThreadUpdater;
            document[a.hidden] && a.delayId < a.delayIdHidden ? a.delayId = a.delayIdHidden : (a.delayId = 0, a.refreshAds());
            a.timeLeft = a.delayRange[0];
            a.lastUpdated = Date.now();
            clearTimeout(a.interval);
            a.pulse()
        },
        onScroll: function(a) {
            ThreadUpdater.hadAuto && document.documentElement.scrollHeight <= window.innerHeight + window.pageYOffset && !document[ThreadUpdater.hidden] && ThreadUpdater.clearUnread();
            ThreadUpdater.refreshAds()
        },
        clearUnread: function() {
            this.dead || this.setIcon(null);
            this.lastReply && (this.unreadCount = 0, document.title = this.pageTitle, $.removeClass(this.lastReply, "newPostsMarker"), this.lastReply = null)
        },
        forceUpdate: function() {
            ThreadUpdater.force = !0;
            ThreadUpdater.update()
        },
        toggleAuto: function() {
            this.updating || (this.auto ? this.stop(!0) : this.start())
        },
        toggleSound: function() {
            this.soundNode.checked = this.soundNodeBot.checked = this.audioEnabled = !this.audioEnabled
        },
        update: function() {
            var a;
            Date.now();
            a = ThreadUpdater;
            a.updating || (clearTimeout(a.interval), a.updating = !0, a.setStatus("Updating..."), $.get("//a.4cdn.org/" + Main.board + "/thread/" + Main.tid + ".json", {
                onload: a.onload,
                onerror: a.onerror
            }, {
                "If-Modified-Since": a.lastModified
            }))
        },
        initAds: function() {
            var a, b, c = ["_top_ad", "_middle_ad", "_bottom_ad"];
            for (a = 0; b = c[a]; ++a) ThreadUpdater.ads[b] = {
                time: 0,
                seenOnce: !1,
                isStale: !1
            }
        },
        invalidateAds: function() {
            var a, b = ThreadUpdater;
            for (a in b.ads) meta = b.ads[a], meta.seenOnce && (meta.isStale = !0)
        },
        refreshAds: function() {
            var a, b, c, d, e, f, h, g;
            a = ThreadUpdater;
            b = Date.now();
            if (!(100 > b - a.adDebounce))
                for (d in a.adDebounce = b, h = document[a.hidden], g = document.documentElement.clientHeight, a.ads)
                    if (f = a.ads[d], !h && (e = window[d]))
                        if (c = $.id(e.D)) c = c.getBoundingClientRect(), 0 > c.top || c.bottom > g || (f.seenOnce = !0, !f.isStale || b - f.time < a.adRefreshDelay || (f.time = b, f.isStale = !1, ados_refresh(e, 0, !1)))
        },
        markDeletedReplies: function(a) {
            var b, c, d, e;
            d = {};
            for (b = 0; c = a[b]; ++b) d["pc" + c.no] = 1;
            a = $.cls("replyContainer");
            for (b = 0; c = a[b]; ++b) d[c.id] || $.hasClass(c, "deleted") || (this.deletionQueue[c.id] ? (e = document.createElement("img"), e.src = Main.icons2.trash, e.className = "trashIcon", e.title = "This post has been deleted", $.addClass(c, "deleted"), $.cls("postNum", c)[1].appendChild(e), delete this.deletionQueue[c.id]) : this.deletionQueue[c.id] = 1)
        },
        onload: function() {
            var a, b, c, d, e, f, h, g, k, l, n, m;
            c = ThreadUpdater;
            d = [];
            c.setStatus("");
            if (200 == this.status) {
                c.lastModified = this.getResponseHeader("Last-Modified");
                e = $.id("t" + Main.tid);
                g = e.children[e.childElementCount - 1];
                k = +g.id.slice(2);
                f = Parser.parseThreadJSON(this.responseText);
                b = !!f[0].archived;
                void 0 !== window.thread_archived && b != window.thread_archived && (QR.enabled && $.id("quickReply") && QR.lock(), Main.setThreadState("archived", b));
                b = !!f[0].closed;
                b != Main.threadClosed && (f[0].archived ? b = !1 : QR.enabled && $.id("quickReply") && (b ? QR.lock() : QR.unlock()), Main.setThreadState("closed", b));
                b = !!f[0].sticky;
                b != Main.threadSticky && Main.setThreadState("sticky", b);
                b = !!f[0].imagelimit;
                QR.enabled && b != QR.fileDisabled && (QR.fileDisabled = b);
                !Config.revealSpoilers && f[0].custom_spoiler && Parser.setCustomSpoiler(Main.board, f[0].custom_spoiler);
                for (a = f.length - 1; 0 <= a && !(f[a].no <= k); a--) d.push(f[a]);
                b = d.length;
                1 == b && QR.lastReplyId == d[0].no && (m = !0, QR.lastReplyId = null);
                m || c.markDeletedReplies(f);
                if (b) {
                    l = document.documentElement;
                    n = Config.autoScroll && document[c.hidden] && l.scrollHeight == window.innerHeight + window.pageYOffset;
                    h = document.createDocumentFragment();
                    for (a = d.length - 1; 0 <= a; a--) h.appendChild(Parser.buildHTMLFromJSON(d[a], Main.board));
                    e.appendChild(h);
                    a = g.offsetTop;
                    Parser.hasYouMarkers = !1;
                    Parser.hasHighlightedPosts = !1;
                    Parser.parseThread(e.id.slice(1), -d.length);
                    a != g.offsetTop && window.scrollBy(0, g.offsetTop - a);
                    m || (!c.force && l.scrollHeight > window.innerHeight ? (c.lastReply || k == Main.tid || ((c.lastReply = g.lastChild).className += " newPostsMarker"), Parser.hasYouMarkers ? (c.setIcon("rep"), c.audioEnabled && document[c.hidden] && c.audio.play()) : Parser.hasHighlightedPosts && "rep" !== c.currentIcon ? c.setIcon("hl") : 0 == c.unreadCount && c.setIcon("new"), c.unreadCount += b, document.title = "(" + c.unreadCount + ") " + c.pageTitle) : c.setStatus(b + " new post" + (1 < b ? "s" : "")));
                    n && window.scrollTo(0, document.documentElement.scrollHeight);
                    Config.threadWatcher && ThreadWatcher.refreshCurrent(!0);
                    Config.threadStats && (e = f[0], ThreadStats.update(e.replies, e.images, e.unique_ips, e.bumplimit, e.imagelimit));
                    c.invalidateAds();
                    c.refreshAds();
                    UA.dispatchEvent("4chanThreadUpdated", {
                        count: b
                    })
                } else c.setStatus("No new posts");
                f[0].archived && (c.setError("This thread is archived"), c.dead || (c.setIcon("dead"), window.thread_archived = !0, c.dead = !0, c.stop()))
            } else if (304 == this.status || 0 == this.status) c.setStatus("No new posts");
            else if (404 == this.status) {
                c.setIcon("dead");
                c.setError("This thread has been pruned or deleted");
                c.dead = !0;
                c.stop();
                return
            }
            c.lastUpdated = Date.now();
            c.adjustDelay(d.length);
            c.updating = c.force = !1
        },
        onerror: function() {
            var a = ThreadUpdater;
            UA.isOpera && !this.statusText && 0 == this.status ? a.setStatus("No new posts") : a.setError("Connection Error");
            a.lastUpdated = Date.now();
            a.adjustDelay(0);
            a.updating = a.force = !1
        },
        setStatus: function(a) {
            this.statusNode.textContent = this.statusNodeBot.textContent = a
        },
        setError: function(a) {
            this.statusNode.innerHTML = this.statusNodeBot.innerHTML = '<span class="tu-error">' + a + "</span>"
        },
        setIcon: function(a) {
            var b;
            b = null === a ? this.defaultIcon : this.icons[Main.type + a];
            this.currentIcon = a;
            this.iconNode.href = this.iconPath + b;
            document.head.appendChild(this.iconNode)
        },
        icons: {
            wsnew: "favicon-ws-newposts.ico",
            nwsnew: "favicon-nws-newposts.ico",
            wsrep: "favicon-ws-newreplies.ico",
            nwsrep: "favicon-nws-newreplies.ico",
            wsdead: "favicon-ws-deadthread.ico",
            nwsdead: "favicon-nws-deadthread.ico",
            wshl: "favicon-ws-newfilters.ico",
            nwshl: "favicon-nws-newfilters.ico"
        }
    },
    ThreadStats = {
        init: function() {
            var a;
            this.nodeTop = document.createElement("div");
            this.nodeTop.className = "thread-stats";
            Main.hasMobileLayout ? (this.nodeBot = {}, a = $.cls("navLinks"), a[0] && (a = a[a.length - 1].nextElementSibling, a.parentNode.insertBefore(this.nodeTop, a))) : (this.nodeBot = this.nodeTop.cloneNode(!1), a = $.cls("navLinks"), a[1] && a[1].appendChild(this.nodeTop), a[2] && a[2].appendChild(this.nodeBot));
            this.pageNumber = null;
            this.update(null, null, null, window.bumplimit, window.imagelimit);
            window.thread_archived || (this.updatePageNumber(), this.pageInterval = setInterval(this.updatePageNumber, 18E4))
        },
        update: function(a, b, c, d, e) {
            var f;
            null === a && (a = $.cls("replyContainer").length, b = $.cls("fileText").length - ($.id("fT" + Main.tid) ? 1 : 0));
            f = [];
            Main.threadSticky && f.push("Sticky");
            window.thread_archived ? f.push("Archived") : Main.threadClosed && f.push("Closed");
            d ? f.push('<em class="ts-replies" data-tip="Replies (bump limit reached)">' + a + "</em>") : f.push('<span class="ts-replies" data-tip="Replies">' + a + "</span>");
            e ? f.push('<em class="ts-images" data-tip="Images (limit reached)">' + b + "</em>") : f.push('<span class="ts-images" data-tip="Images">' + b + "</span>");
            window.thread_archived || (window.unique_ips && f.push('<span data-tip="Posters" class="ts-ips">' + (c || window.unique_ips) + "</span>"), f.push('<span data-tip="Page" class="ts-page">' + (this.pageNumber || "?") + "</span>"));
            this.nodeTop.innerHTML = this.nodeBot.innerHTML = f.join(" / ")
        },
        updatePageNumber: function() {
            $.get("//a.4cdn.org/" + Main.board + "/threads.json", {
                onload: ThreadStats.onCatalogLoad,
                onerror: ThreadStats.onCatalogError
            })
        },
        onCatalogLoad: function() {
            var a, b, c, d, e, f, h, g;
            a = ThreadStats;
            if (200 == this.status) {
                g = +Main.tid;
                h = JSON.parse(this.responseText);
                for (b = 0; d = h[b]; ++b)
                    for (f = d.threads, c = 0; e = f[c]; ++c)
                        if (e.no == g) {
                            e = $.cls("ts-page");
                            for (b = 0; c = e[b]; ++b) c.textContent = d.page;
                            a.pageNumber = d.page;
                            return
                        }
                clearInterval(a.pageInterval)
            } else ThreadStats.onCatalogError()
        },
        onCatalogError: function() {
            console.log("ThreadStats: couldn't get the catalog (" + this.status + ")")
        }
    },
    Filter = {
        init: function() {
            this.entities = document.createElement("div");
            Filter.load()
        },
        onClick: function(a) {
            var b;
            if (b = a.target.getAttribute("data-cmd")) switch (b) {
                case "filters-add":
                    Filter.add();
                    break;
                case "filters-save":
                    Filter.save();
                    Filter.close();
                    break;
                case "filters-close":
                    Filter.close();
                    break;
                case "filters-palette":
                    Filter.openPalette(a.target);
                    break;
                case "filters-palette-close":
                    Filter.closePalette();
                    break;
                case "filters-palette-clear":
                    Filter.clearPalette();
                    break;
                case "filters-up":
                    Filter.moveUp(a.target.parentNode.parentNode);
                    break;
                case "filters-del":
                    Filter.remove(a.target.parentNode.parentNode);
                    break;
                case "filters-help-open":
                    Filter.openHelp();
                    break;
                case "filters-help-close":
                    Filter.closeHelp()
            }
        },
        onPaletteClick: function(a) {
            var b;
            if (b = a.target.getAttribute("data-cmd")) switch (b) {
                case "palette-pick":
                    Filter.pickColor(a.target);
                    break;
                case "palette-clear":
                    Filter.pickColor(a.target, !0);
                    break;
                case "palette-close":
                    Filter.closePalette()
            }
        },
        match: function(a, b) {
            var c, d, e, f, h;
            h = !1;
            f = Filter.activeFilters;
            for (c = 0; e = f[c]; ++c)
                if (e.boards[b])
                    if (0 == e.type) {
                        if (e.pattern === a.trip) {
                            h = !0;
                            break
                        }
                    } else if (1 == e.type) {
                if (e.pattern === a.name) {
                    h = !0;
                    break
                }
            } else if (2 == e.type && a.com) {
                if (void 0 === d && (this.entities.innerHTML = a.com.replace(/<br>/g, "\n").replace(/[<[^>]+>/g, ""), d = this.entities.textContent), e.pattern.test(d)) {
                    h = !0;
                    break
                }
            } else if (4 == e.type) {
                if (e.pattern === a.id) {
                    h = !0;
                    break
                }
            } else if (5 == e.type) {
                if (e.pattern.test(a.sub)) {
                    h = !0;
                    break
                }
            } else if (6 == e.type && e.pattern.test(a.filename)) {
                h = !0;
                break
            }
            return h
        },
        exec: function(a, b, c, d) {
            var e, f, h, g, k, l, n, m, q, p, y;
            if (Parser.trackedReplies && Parser.trackedReplies[">>" + b.id.slice(2)]) return !1;
            y = Main.board;
            q = Filter.activeFilters;
            p = !1;
            for (e = 0; m = q[e]; ++e)
                if (!m.boards || m.boards[y])
                    if (0 == m.type) {
                        if ((void 0 !== f || (f = b.getElementsByClassName("postertrip")[0])) && m.pattern == f.textContent) {
                            p = !0;
                            break
                        }
                    } else if (1 == m.type) {
                if ((h || (h = b.getElementsByClassName("name")[0])) && m.pattern == h.textContent) {
                    p = !0;
                    break
                }
            } else if (2 == m.type) {
                if (void 0 === g && (this.entities.innerHTML = c.innerHTML.replace(/<br>/g, "\n").replace(/[<[^>]+>/g, ""), g = this.entities.textContent), m.pattern.test(g)) {
                    p = !0;
                    break
                }
            } else if (4 == m.type) {
                if ((k || (k = b.getElementsByClassName("posteruid")[0]) && (k = k.firstElementChild.textContent)) && m.pattern == k) {
                    p = !0;
                    break
                }
            } else if (!Main.tid && 5 == m.type) {
                if ((l || (l = b.getElementsByClassName("subject")[0]) && (l = l.textContent)) && m.pattern.test(l)) {
                    p = !0;
                    break
                }
            } else if (6 == m.type && (void 0 === n && (n = (n = b.parentNode.getElementsByClassName("fileText")[0]) ? n.firstElementChild.textContent : ""), m.pattern.test(n))) {
                p = !0;
                break
            }
            if (p) {
                if (m.hide) return a.className += " post-hidden", el = document.createElement("span"), d ? el.innerHTML = '[<a data-cmd="unfilter" data-filtered="1" href="thread/' + d + '">View</a>]' : (el.textContent = "[View]", el.setAttribute("data-filtered", "1"), el.setAttribute("data-cmd", "unfilter")), el.className = "filter-preview", b.appendChild(el), !0;
                a.className += " filter-hl";
                a.style.boxShadow = "-3px 0 " + m.color;
                Parser.hasHighlightedPosts = !0
            }
            return !1
        },
        unfilter: function(a) {
            var b = a.parentNode.parentNode;
            QuotePreview.remove();
            $.removeClass(b, "post-hidden");
            a.parentNode.removeChild(a)
        },
        load: function() {
            var a, b, c, d, e, f, h, g, k, l, n;
            this.activeFilters = [];
            if (d = localStorage.getItem("4chan-filters")) {
                d = JSON.parse(d);
                h = /(\/|\.|\*|\+|\?|\(|\)|\[|\]|\{|\}|\\|\^|\$)/g;
                g = /^\/(.*)\/(i?)$/;
                n = /\\\*/g;
                try {
                    for (f = 0; c = d[f]; ++f)
                        if (c.active && "" != c.pattern) {
                            if (c.boards)
                                for (tmp = c.boards.split(/[^a-z0-9]+/i), boards = {}, a = 0; b = tmp[a]; ++a) boards[b] = !0;
                            else boards = !1;
                            e = c.pattern;
                            if (c.type && 1 != c.type && 4 != c.type)
                                if (match = e.match(g)) pattern = new RegExp(match[1], match[2]);
                                else if ('"' == e[0] && '"' == e[e.length - 1]) pattern = new RegExp(e.slice(1, -1).replace(h, "\\$1"));
                            else {
                                k = e.split(" ");
                                pattern = "";
                                a = 0;
                                for (b = k.length; a < b; ++a) l = k[a].replace(h, "\\$1").replace(n, "[^\\s]*"), pattern += "(?=.*\\b" + l + "\\b)";
                                pattern = new RegExp("^" + pattern, "im")
                            } else pattern = e;
                            this.activeFilters.push({
                                type: c.type,
                                pattern: pattern,
                                boards: boards,
                                color: c.color,
                                hide: c.hide,
                                auto: c.auto
                            })
                        }
                } catch (m) {
                    alert("There was an error processing one of the filters: " + m + " in: " + e)
                }
            }
        },
        addSelection: function() {
            var a, b;
            a = UA.getSelection(!0);
            !1 !== Filter.open() && ("string" == typeof a ? a = a.trim() : (b = a.anchorNode.parentNode, a = a.toString().trim(), b = $.hasClass(b, "name") ? 1 : $.hasClass(b, "postertrip") ? 0 : $.hasClass(b, "subject") ? 5 : $.hasClass(b, "posteruid") || $.hasClass(b, "hand") ? 4 : $.hasClass(b, "fileText") ? 6 : 2), Filter.add(a, b))
        },
        openHelp: function() {
            var a;
            $.id("filtersHelp") || (a = document.createElement("div"), a.id = "filtersHelp", a.className = "UIPanel", a.setAttribute("data-cmd", "filters-help-close"), a.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Filters &amp; Highlights Help<span><img alt="Close" title="Close" class="pointer" data-cmd="filters-help-close" src="' + Main.icons.cross + '"></span></div><h4>Tripcode, Name and ID filters:</h4><ul><li>Those use simple string comparison.</li><li>Type them exactly as they appear on 4chan, including the exclamation mark for tripcode filters.</li><li>Example: <code>!Ep8pui8Vw2</code></li></ul><h4>Comment, Subject and E-mail filters:</h4><ul><li><strong>Matching whole words:</strong></li><li><code>feel</code> &mdash; will match <em>"feel"</em> but not <em>"feeling"</em>. This search is case-insensitive.</li></ul><ul><li><strong>AND operator:</strong></li><li><code>feel girlfriend</code> &mdash; will match <em>"feel"</em> AND <em>"girlfriend"</em> in any order.</li></ul><ul><li><strong>Exact match:</strong></li><li><code>"that feel when"</code> &mdash; place double quotes around the pattern to search for an exact string</li></ul><ul><li><strong>Wildcards:</strong></li><li><code>feel*</code> &mdash; matches expressions such as <em>"feel"</em>, <em>"feels"</em>, <em>"feeling"</em>, <em>"feeler"</em>, etc\u2026</li><li><code>idolm*ster</code> &mdash; this can match <em>"idolmaster"</em> or <em>"idolm@ster"</em>, etc\u2026</li></ul><ul><li><strong>Regular expressions:</strong></li><li><code>/feel when no (girl|boy)friend/i</code></li><li><code>/^(?!.*touhou).*$/i</code> &mdash; NOT operator.</li><li><code>/^>/</code> &mdash; comments starting with a quote.</li><li><code>/^$/</code> &mdash; comments with no text.</li></ul><h4>Colors:</h4><ul><li>The color field can accept any valid CSS color:</li><li><code>red</code>, <code>#0f0</code>, <code>#00ff00</code>, <code>rgba( 34, 12, 64, 0.3)</code>, etc\u2026</li></ul><h4>Boards:</h4><ul><li>A space separated list of boards on which the filter will be active. Leave blank to apply to all boards.</li></ul><h4>Auto-watching:</h4><ul><li>Enabling the "Auto" option will automatically add matched threads to the Thread Watcher when it is manually refreshed. This only works when the "Boards" field is not empty, and searches catalog JSON for the selected boards(s).</li></ul><h4>Shortcut:</h4><ul><li>If you have <code>Keyboard shortcuts</code> enabled, pressing <kbd>F</kbd> will add the selected text to your filters.</li></ul>', document.body.appendChild(a), a.addEventListener("click", this.onClick, !1))
        },
        closeHelp: function() {
            var a;
            if (a = $.id("filtersHelp")) a.removeEventListener("click", this.onClick, !1), document.body.removeChild(a)
        },
        open: function() {
            var a, b, c, d, e;
            if ($.id("filtersMenu")) return !1;
            c = document.createElement("div");
            c.id = "filtersMenu";
            c.className = "UIPanel";
            c.style.display = "none";
            c.setAttribute("data-cmd", "filters-close");
            c.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Filters &amp; Highlights<span><img alt="Help" class="pointer" title="Help" data-cmd="filters-help-open" src="' + Main.icons.help + '"><img alt="Close" title="Close" class="pointer" data-cmd="filters-close" src="' + Main.icons.cross + '"></span></div><table><thead><tr><th></th><th>On</th><th>Pattern</th><th>Boards</th><th>Type</th><th>Color</th><th>Auto</th><th>Hide</th><th>Del</th></tr></thead><tbody id="filter-list"></tbody><tfoot><tr><td colspan="9"><button data-cmd="filters-add">Add</button><button class="right" data-cmd="filters-save">Save</button></td></tr></tfoot></table></div>';
            document.body.appendChild(c);
            c.addEventListener("click", this.onClick, !1);
            e = $.id("filter-list");
            if (d = localStorage.getItem("4chan-filters"))
                for (d = JSON.parse(d), a = 0; b = d[a]; ++a) e.appendChild(this.buildEntry(b, a));
            c.style.display = ""
        },
        close: function() {
            var a;
            if (a = $.id("filtersMenu")) this.closePalette(), a.removeEventListener("click", this.onClick, !1), document.body.removeChild(a)
        },
        moveUp: function(a) {
            var b;
            (b = a.previousElementSibling) && a.parentNode.insertBefore(a, b)
        },
        add: function(a, b, c) {
            a = {
                active: !0,
                type: b || 0,
                pattern: a || "",
                boards: c || "",
                color: "",
                auto: !1,
                hide: !1
            };
            b = this.getNextFilterId();
            a = this.buildEntry(a, b);
            $.id("filter-list").appendChild(a);
            $.cls("fPattern", a)[0].focus()
        },
        remove: function(a) {
            $.id("filter-list").removeChild(a)
        },
        save: function() {
            var a, b, c, d, e;
            b = [];
            c = $.id("filter-list").children;
            for (a = 0; d = c[a]; ++a) e = d.children[4].firstChild, e = {
                active: d.children[1].firstChild.checked,
                pattern: d.children[2].firstChild.value,
                boards: d.children[3].firstChild.value,
                type: +e.options[e.selectedIndex].value,
                auto: d.children[6].firstChild.checked,
                hide: d.children[7].firstChild.checked
            }, d = d.children[5].firstChild, d.hasAttribute("data-nocolor") || (e.color = d.style.backgroundColor), b.push(e);
            b[0] ? localStorage.setItem("4chan-filters", JSON.stringify(b)) : localStorage.removeItem("4chan-filters")
        },
        getNextFilterId: function() {
            var a, b, c, d = $.id("filter-list").children;
            if (d.length) {
                for (a = c = 0; b = d[a]; ++a) b = +b.id.slice(7), b > c && (c = b);
                return c + 1
            }
            return 0
        },
        buildEntry: function(a, b) {
            var c, d, e;
            c = document.createElement("tr");
            c.id = "filter-" + b;
            d = '<td><span data-tip="Move Up" data-cmd="filters-up" class="pointer">&uarr;</span></td><td><input type="checkbox"' + (a.active ? ' checked="checked"></td>' : "></td>");
            d += '<td><input class="fPattern" type="text" value="' + a.pattern.replace(/"/g, "&quot;") + '"></td>';
            d += '<td><input class="fBoards" type="text" value="' + (void 0 !== a.boards ? a.boards : "") + '"></td>';
            3 === a.type && (a.type = 4);
            e = "      ".split(" ");
            e[a.type] = ' selected="selected"';
            d += '<td><select size="1"><option value="0"' + e[0] + '>Tripcode</option><option value="1"' + e[1] + '>Name</option><option value="2"' + e[2] + '>Comment</option><option value="4"' + e[4] + '>ID</option><option value="5"' + e[5] + '>Subject</option><option value="6"' + e[6] + ">Filename</option></select></td>";
            d += '<td><span data-cmd="filters-palette" title="Change Color" class="colorbox fColor" ';
            d = a.color ? d + (' style="background-color:' + a.color + '">') : d + ' data-nocolor="1">&#x2215;';
            d += "</span></td>";
            d += '<td><input type="checkbox"' + (a.auto ? ' checked="checked"></td>' : "></td>");
            d += '<td><input type="checkbox"' + (a.hide ? ' checked="checked"></td>' : "></td>");
            d += '<td><span data-cmd="filters-del" class="pointer fDel">&times;</span></td>';
            c.innerHTML = d;
            return c
        },
        buildPalette: function(a) {
            var b, c, d, e, f, h;
            e = [
                ["#E0B0FF", "#F2F3F4", "#7DF9FF", "#FFFF00"],
                ["#FBCEB1", "#FFBF00", "#ADFF2F", "#0047AB"],
                ["#00A550", "#007FFF", "#AF0A0F", "#B5BD68"]
            ];
            f = e.length;
            h = e[0].length;
            d = '<div id="colorpicker" class="reply extPanel"><table><tbody>';
            for (b = 0; b < f; ++b) {
                d += "<tr>";
                for (c = 0; c < h; ++c) d += '<td><div data-cmd="palette-pick" class="colorbox" style="background:' + e[b][c] + '"></div></td>';
                d += "</tr>"
            }
            d += '</tbody></table>Custom<div id="palette-custom"><input id="palette-custom-input" type="text"><div id="palette-custom-ok" data-cmd="palette-pick" title="Select Color" class="colorbox"></div></div>[<a href="javascript:;" data-cmd="palette-close">Close</a>][<a href="javascript:;" data-cmd="palette-clear">Clear</a>]</div>';
            b = document.createElement("div");
            b.id = "filter-palette";
            b.setAttribute("data-target", a);
            b.setAttribute("data-cmd", "palette-close");
            b.className = "UIMenu";
            b.innerHTML = d;
            return b
        },
        openPalette: function(a) {
            var b;
            Filter.closePalette();
            b = a.getBoundingClientRect();
            a = a.parentNode.parentNode.id.slice(7);
            a = Filter.buildPalette(a);
            document.body.appendChild(a);
            $.id("filter-palette").addEventListener("click", Filter.onPaletteClick, !1);
            $.id("palette-custom-input").addEventListener("keyup", Filter.setCustomColor, !1);
            a = a.firstElementChild;
            a.style.cssText = "top:" + b.top + "px;left:" + (b.left - a.clientWidth - 10) + "px;"
        },
        closePalette: function() {
            var a;
            if (a = $.id("filter-palette")) $.id("filter-palette").removeEventListener("click", Filter.onPaletteClick, !1), $.id("palette-custom-input").removeEventListener("keyup", Filter.setCustomColor, !1), a.parentNode.removeChild(a)
        },
        pickColor: function(a, b) {
            var c;
            c = $.id("filter-palette").getAttribute("data-target");
            if (c = $.id("filter-" + c)) c = $.cls("colorbox", c)[0], !0 === b ? (c.setAttribute("data-nocolor", "1"), c.innerHTML = "&#x2215;", c.style.background = "") : (c.removeAttribute("data-nocolor"), c.innerHTML = "", c.style.background = a.style.backgroundColor), Filter.closePalette()
        },
        setCustomColor: function() {
            var a;
            a = $.id("palette-custom-input");
            $.id("palette-custom-ok").style.backgroundColor = a.value
        }
    },
    IDColor = {
        css: "padding: 0 5px; border-radius: 6px; font-size: 0.8em;",
        ids: {},
        init: function() {
            var a;
            window.user_ids && (this.enabled = !0, a = document.createElement("style"), a.setAttribute("type", "text/css"), a.textContent = ".posteruid .hand {" + this.css + "}", document.head.appendChild(a))
        },
        compute: function(a) {
            var b, c;
            b = [];
            c = $.hash(a);
            b[0] = c >> 24 & 255;
            b[1] = c >> 16 & 255;
            b[2] = c >> 8 & 255;
            b[3] = 125 < .299 * b[0] + .587 * b[1] + .114 * b[2];
            return this.ids[a] = b
        },
        apply: function(a) {
            var b;
            b = IDColor.ids[a.textContent] || IDColor.compute(a.textContent);
            a.style.cssText = "    background-color: rgb(" + b[0] + "," + b[1] + "," + b[2] + ");    color: " + (b[3] ? "black;" : "white;")
        },
        applyRemote: function(a) {
            this.apply(a);
            a.style.cssText += this.css
        }
    },
    SWFEmbed = {
        init: function() {
            Main.tid ? this.processThread() : this.processIndex()
        },
        processThread: function() {
            var a, b;
            if (a = $.id("fT" + Main.tid)) b = document.createElement("a"), b.href = "javascript:;", b.textContent = "Embed", b.addEventListener("click", SWFEmbed.toggleThread, !1), a.appendChild(document.createTextNode("-[")), a.appendChild(b), a.appendChild(document.createTextNode("]"))
        },
        processIndex: function() {
            var a, b, c, d, e;
            if (a = $.cls("postblock")[0])
                if (b = a.parentNode, c = document.createElement("td"), c.className = "postblock", b.insertBefore(c, b.children[2].nextElementSibling), a = $.cls("flashListing")[0])
                    for (d = $.tag("tr", a), a = 1; b = d[a]; ++a) e = b.children[2].firstElementChild, c = document.createElement("td"), c.innerHTML = '[<a href="' + e.href + '">Embed</a>]', c.firstElementChild.addEventListener("click", SWFEmbed.embedIndex, !1), b.insertBefore(c, b.children[2].nextElementSibling)
        },
        toggleThread: function(a) {
            var b, c, d, e, f;
            (b = $.id("swf-embed")) ? (b.parentNode.removeChild(b), a.target.textContent = "Embed") : (c = $.tag("a", a.target.parentNode)[0], b = document.documentElement.clientWidth - 100, f = +c.getAttribute("data-width"), e = +c.getAttribute("data-height"), f > b && (e = f / e, f = b, e = Math.round(b / e)), b = document.createElement("div"), b.id = "swf-embed", d = document.createElement("embed"), d.setAttribute("allowScriptAccess", "never"), d.type = "application/x-shockwave-flash", d.width = f, d.height = e, d.src = c.href, b.appendChild(d), c = $.id("m" + Main.tid), c.insertBefore(b, c.firstChild), $.cls("thread")[0].scrollIntoView(!0), a.target.textContent = "Remove")
        },
        embedIndex: function(a) {
            var b, c, d, e, f, h, g;
            a.preventDefault();
            b = a.target.parentNode.parentNode.children[2].firstElementChild;
            g = b.getAttribute("title") || b.textContent;
            c = d = +b.getAttribute("data-width");
            f = e = +b.getAttribute("data-height");
            b = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
            b -= 10;
            h = h - 10 - 20;
            ratio = d / e;
            c > b && (c = b, f = Math.round(b / ratio));
            f > h && (f = h, c = Math.round(h * ratio));
            b = document.createElement("embed");
            b.setAttribute("allowScriptAccess", "never");
            b.src = a.target.href;
            b.width = "100%";
            b.height = "100%";
            a = document.createElement("div");
            a.style.position = "fixed";
            a.style.width = c + "px";
            a.style.height = f + "px";
            a.style.top = "50%";
            a.style.left = "50%";
            a.style.marginTop = -f / 2 - 10 + "px";
            a.style.marginLeft = -c / 2 + "px";
            a.style.background = "white";
            c = document.createElement("div");
            c.id = "swf-embed-header";
            c.className = "postblock";
            c.textContent = g + ", " + d + "x" + e;
            d = document.createElement("img");
            d.id = "swf-embed-close";
            d.className = "pointer";
            d.src = Main.icons.cross;
            c.appendChild(d);
            a.appendChild(c);
            a.appendChild(b);
            d = document.createElement("div");
            d.id = "swf-embed";
            d.style.cssText = "width: 100%; height: 100%; position: fixed;  top: 0; left: 0; background: rgba(128, 128, 128, 0.5)";
            d.appendChild(a);
            d.addEventListener("click", SWFEmbed.onBackdropClick, !1);
            document.body.appendChild(d)
        },
        onBackdropClick: function(a) {
            var b = $.id("swf-embed");
            if (a.target === b || "swf-embed-close" == a.target.id) b.removeEventListener("click", SWFEmbed.onBackdropClick, !1), b.parentNode.removeChild(b)
        }
    },
    Media = {
        init: function() {
            this.matchSC = /(?:soundcloud\.com|snd\.sc)\/[^\s<]+(?:<wbr>)?[^\s<]*/g;
            this.matchYT = /(?:youtube\.com\/watch\?[^\s]*?v=|youtu\.be\/)[^\s<]+(?:<wbr>)?[^\s<]*(?:<wbr>)?[^\s<]*/g;
            this.toggleYT = /(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/;
            this.timeYT = /#t=([ms0-9]+)/;
            this.matchVocaroo = /vocaroo\.com\/i\/([a-z0-9]{12})/gi;
            this.map = {
                yt: this.toggleYouTube,
                sc: this.toggleSoundCloud,
                vocaroo: this.toggleVocaroo
            }
        },
        parseSoundCloud: function(a) {
            a.innerHTML = a.innerHTML.replace(this.matchSC, this.replaceSoundCloud)
        },
        replaceSoundCloud: function(a) {
            return "<span>" + a + '</span> [<a href="javascript:;" data-cmd="embed" data-type="sc">Embed</a>]'
        },
        toggleSoundCloud: function(a) {
            var b, c;
            "Remove" == a.textContent ? (a.parentNode.removeChild(a.nextElementSibling), a.textContent = "Embed") : "Embed" == a.textContent && (c = a.previousElementSibling.textContent, b = new XMLHttpRequest, b.open("GET", "//soundcloud.com/oembed?show_artwork=false&maxwidth=500px&show_comments=false&format=json&url=http://" + c), b.onload = function() {
                var b;
                200 == this.status || 304 == this.status ? (b = document.createElement("div"), b.className = "media-embed", b.innerHTML = JSON.parse(this.responseText).html, a.parentNode.insertBefore(b, a.nextElementSibling), a.textContent = "Remove") : (a.textContent = "Error", console.log("SoundCloud Error (HTTP " + this.status + ")"))
            }, a.textContent = "Loading...", b.send(null))
        },
        parseYouTube: function(a) {
            a.innerHTML = a.innerHTML.replace(this.matchYT, this.replaceYouTube)
        },
        replaceYouTube: function(a) {
            return "<span>" + a + '</span> [<a href="javascript:;" data-cmd="embed" data-type="yt">' + (Main.hasMobileLayout ? "Open" : "Embed") + "</a>]"
        },
        showYTPreview: function(a) {
            var b, c, d;
            c = a.getBoundingClientRect();
            b = a.previousElementSibling.textContent.match(this.toggleYT)[1];
            a = c.right + 320 + 5 > $.docEl.clientWidth ? c.left - 320 - 5 : c.right + 5;
            d = c.top - 90 + c.height / 2;
            c = document.createElement("img");
            c.width = 320;
            c.height = 180;
            c.alt = "";
            c.src = "//i1.ytimg.com/vi/" + encodeURIComponent(b) + "/mqdefault.jpg";
            b = document.createElement("div");
            b.id = "yt-preview";
            b.className = "reply";
            b.style.left = a + window.pageXOffset + "px";
            b.style.top = d + window.pageYOffset + "px";
            b.appendChild(c);
            document.body.appendChild(b)
        },
        removeYTPreview: function() {
            var a;
            (a = $.id("yt-preview")) && document.body.removeChild(a)
        },
        toggleYouTube: function(a) {
            var b, c;
            "Remove" == a.textContent ? (a.parentNode.removeChild(a.nextElementSibling), a.textContent = "Embed") : (c = a.previousElementSibling.textContent, b = c.match(this.toggleYT), c = c.match(this.timeYT), b && (b = b[1]) ? (b = encodeURIComponent(b), c && (c = c[1]) && (b += "#t=" + encodeURIComponent(c)), Main.hasMobileLayout ? window.open("//www.youtube.com/watch?v=" + b) : (c = document.createElement("div"), c.className = "media-embed", c.innerHTML = '<iframe src="//www.youtube.com/embed/' + b + '" width="640" height="360" frameborder="0"></iframe>', a.parentNode.insertBefore(c, a.nextElementSibling), a.textContent = "Remove")) : a.textContent = "Error")
        },
        parseVocaroo: function(a) {
            a.innerHTML = a.innerHTML.replace(this.matchVocaroo, this.replaceVocaroo)
        },
        replaceVocaroo: function(a) {
            return "<span>" + a + '</span> [<a href="javascript:;" data-cmd="embed" data-type="vocaroo">Embed</a>]'
        },
        toggleVocaroo: function(a) {
            var b, c;
            "Remove" == a.textContent ? (a.parentNode.removeChild(a.nextElementSibling), a.textContent = "Embed") : (b = a.previousElementSibling.textContent, (b = b.match(Media.matchVocaroo)) && (b = b[0].split("/").pop()) ? (b = encodeURIComponent(b), c = document.createElement("div"), c.className = "media-embed", c.innerHTML = '<embed width="220" height="140" class="media-embed" src="//vocaroo.com/mediafoo.swf?playMediaID=' + b + '&autoplay=0">', a.parentNode.insertBefore(c, a.nextElementSibling), a.textContent = "Remove") : a.textContent = "Error")
        },
        toggleEmbed: function(a) {
            var b, c = a.getAttribute("data-type");
            c && (b = Media.map[c]) && b.call(this, a)
        }
    };
StickyNav = {
    thres: 5,
    pos: 0,
    timeout: null,
    el: null,
    init: function() {
        this.el = Config.classicNav ? $.id("boardNavDesktop") : $.id("boardNavMobile");
        $.addClass(this.el, "autohide-nav");
        window.addEventListener("scroll", this.onScroll, !1)
    },
    onScroll: function(a) {
        clearTimeout(StickyNav.timeout);
        StickyNav.timeout = setTimeout(StickyNav.checkScroll, 50)
    },
    checkScroll: function() {
        var a;
        a = window.pageYOffset;
        Math.abs(StickyNav.pos - a) <= StickyNav.thres || (StickyNav.el.style.top = a < StickyNav.pos ? "" : "-" + StickyNav.el.offsetHeight + "px", StickyNav.pos = a)
    }
};
var CustomCSS = {
        init: function() {
            var a, b;
            if (b = localStorage.getItem("4chan-css")) a = document.createElement("style"), a.id = "customCSS", a.setAttribute("type", "text/css"), a.textContent = b, document.head.appendChild(a)
        },
        open: function() {
            var a, b;
            if (!$.id("customCSSMenu")) {
                a = document.createElement("div");
                a.id = "customCSSMenu";
                a.className = "UIPanel";
                a.setAttribute("data-cmd", "css-close");
                a.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Custom CSS<span><img alt="Close" title="Close" class="pointer" data-cmd="css-close" src="' + Main.icons.cross + '"></span></div><textarea id="customCSSBox"></textarea><div class="center"><button data-cmd="css-save">Save CSS</button></div></td></tr></tfoot></table></div>';
                document.body.appendChild(a);
                a.addEventListener("click", this.onClick, !1);
                a = $.id("customCSSBox");
                if (b = localStorage.getItem("4chan-css")) a.textContent = b;
                a.focus()
            }
        },
        save: function() {
            var a, b;
            if (a = $.id("customCSSBox")) localStorage.setItem("4chan-css", a.value), Config.customCSS && (b = $.id("customCSS")) && (document.head.removeChild(b), CustomCSS.init())
        },
        close: function() {
            var a;
            if (a = $.id("customCSSMenu")) a.removeEventListener("click", this.onClick, !1), document.body.removeChild(a)
        },
        onClick: function(a) {
            if (a = a.target.getAttribute("data-cmd")) switch (a) {
                case "css-close":
                    CustomCSS.close();
                    break;
                case "css-save":
                    CustomCSS.save(), CustomCSS.close()
            }
        }
    },
    Keybinds = {
        init: function() {
            this.map = {
                65: function() {
                    ThreadUpdater.enabled && ThreadUpdater.toggleAuto()
                },
                70: function() {
                    Config.filter && Filter.addSelection()
                },
                81: function() {
                    QR.enabled && Main.tid && QR.quotePost(Main.tid)
                },
                82: function() {
                    ThreadUpdater.enabled && ThreadUpdater.forceUpdate()
                },
                87: function() {
                    Config.threadWatcher && Main.tid && ThreadWatcher.toggle(Main.tid)
                },
                66: function() {
                    var a;
                    (a = $.cls("prev")[0]) && (a = $.tag("form", a)[0]) && a.submit()
                },
                67: function() {
                    location.href = "/" + Main.board + "/catalog"
                },
                78: function() {
                    var a;
                    (a = $.cls("next")[0]) && (a = $.tag("form", a)[0]) && a.submit()
                },
                73: function() {
                    location.href = "/" + Main.board + "/"
                }
            };
            document.addEventListener("keydown", this.resolve, !1)
        },
        resolve: function(a) {
            var b;
            b = a.target;
            "TEXTAREA" != b.nodeName && "INPUT" != b.nodeName && (!(b = Keybinds.map[a.keyCode]) || a.altKey || a.shiftKey || a.ctrlKey || a.metaKey || (a.preventDefault(), a.stopPropagation(), b()))
        },
        open: function() {
            var a;
            $.id("keybindsHelp") || (a = document.createElement("div"), a.id = "keybindsHelp", a.className = "UIPanel", a.setAttribute("data-cmd", "keybinds-close"), a.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Keyboard Shortcuts<span><img data-cmd="keybinds-close" class="pointer" alt="Close" title="Close" src="' + Main.icons.cross + '"></span></div><ul><li><strong>Global</strong></li><li><kbd>A</kbd> &mdash; Toggle auto-updater</li><li><kbd>Q</kbd> &mdash; Open Quick Reply</li><li><kbd>R</kbd> &mdash; Update thread</li><li><kbd>W</kbd> &mdash; Watch/Unwatch thread</li><li><kbd>B</kbd> &mdash; Previous page</li><li><kbd>N</kbd> &mdash; Next page</li><li><kbd>I</kbd> &mdash; Return to index</li><li><kbd>C</kbd> &mdash; Open catalog</li><li><kbd>F</kbd> &mdash; Filter selected text</li></ul><ul><li><strong>Quick Reply (always enabled)</strong></li><li><kbd>Ctrl + Click</kbd> the post number &mdash; Quote without linking</li><li><kbd>Ctrl + S</kbd> &mdash; Spoiler tags</li><li><kbd>Esc</kbd> &mdash; Close the Quick Reply</li></ul>', document.body.appendChild(a), a.addEventListener("click", this.onClick, !1))
        },
        close: function() {
            var a;
            if (a = $.id("keybindsHelp")) a.removeEventListener("click", this.onClick, !1), document.body.removeChild(a)
        },
        onClick: function(a) {
            var b;
            (b = a.target.getAttribute("data-cmd")) && "keybinds-close" == b && Keybinds.close()
        }
    },
    Report = {
        init: function() {
            window.addEventListener("message", Report.onMessage, !1)
        },
        onMessage: function(a) {
            "https://sys.4chan.org" === a.origin && /^done-report/.test(a.data) && (a = a.data.split("-")[2], Config.threadHiding && $.id("t" + a) ? ThreadHiding.isHidden(a) || (ThreadHiding.hide(a), ThreadHiding.save()) : $.id("p" + a) && !ReplyHiding.isHidden(a) && (ReplyHiding.hide(a), ReplyHiding.save()))
        },
        open: function(a, b) {
            window.open("https://sys.4chan.org/" + (b || Main.board) + "/imgboard.php?mode=report&no=" + a, Date.now(), "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=600,height=270")
        }
    },
    CustomMenu = {
        reset: function() {
            var a, b, c, d, e;
            c = $.cls("boardList");
            d = $.cls("customBoardList");
            e = $.cls("show-all-boards");
            for (a = 0; b = e[a]; ++a) b.removeEventListener("click", CustomMenu.reset, !1);
            for (a = d.length - 1; b = d[a]; a--) c[a].style.display = null, b.parentNode.removeChild(b)
        },
        apply: function(a) {
            var b, c, d;
            if (a) {
                d = a.split(/[^0-9a-z]/i);
                cnt = document.createElement("span");
                cnt.className = "customBoardList";
                for (a = 0; c = d[a]; ++a) a ? cnt.appendChild(document.createTextNode(" / ")) : cnt.appendChild(document.createTextNode("[")), b = document.createElement("a"), b.textContent = c, b.href = "//boards.4chan.org/" + c + "/", cnt.appendChild(b);
                cnt.appendChild(document.createTextNode("]"));
                cnt.appendChild(document.createTextNode(" ["));
                b = document.createElement("a");
                b.textContent = "\u2026";
                b.title = "Show all";
                b.className = "show-all-boards pointer";
                cnt.appendChild(b);
                cnt.appendChild(document.createTextNode("] "));
                c = cnt.cloneNode(!0);
                d = $.cls("boardList");
                for (a = 0; b = d[a]; ++a) b.style.display = "none", b.parentNode.insertBefore(a ? c : cnt, b);
                d = $.cls("show-all-boards");
                for (a = 0; b = d[a]; ++a) b.addEventListener("click", CustomMenu.reset, !1)
            }
        },
        onClick: function(a) {
            var b;
            (b = a.target) != document && (b.hasAttribute("data-close") ? CustomMenu.closeEditor() : b.hasAttribute("data-save") && CustomMenu.save())
        },
        showEditor: function() {
            var a;
            a = document.createElement("div");
            a.id = "customMenu";
            a.className = "UIPanel";
            a.setAttribute("data-close", "1");
            a.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Custom Board List<span><img alt="Close" title="Close" class="pointer" data-close="1" src="' + Main.icons.cross + '"></a></span></div><input placeholder="Example: jp tg mu" id="customMenuBox" type="text" value=""><div class="center"><button data-save="1">Save</button></div></div>';
            document.body.appendChild(a);
            Config.customMenuList && ($.id("customMenuBox").value = Config.customMenuList);
            a.addEventListener("click", CustomMenu.onClick, !1)
        },
        closeEditor: function() {
            var a;
            if (a = $.id("customMenu")) a.removeEventListener("click", CustomMenu.onClick, !1), document.body.removeChild(a)
        },
        save: function() {
            var a;
            if (a = $.id("customMenuBox")) Config.customMenuList = a.value;
            CustomMenu.closeEditor()
        }
    },
    Draggable = {
        el: null,
        key: null,
        scrollX: null,
        scrollY: null,
        dx: null,
        dy: null,
        right: null,
        bottom: null,
        offsetTop: null,
        set: function(a) {
            a.addEventListener("mousedown", Draggable.startDrag, !1)
        },
        unset: function(a) {
            a.removeEventListener("mousedown", Draggable.startDrag, !1)
        },
        startDrag: function(a) {
            var b, c, d;
            if (!this.parentNode.hasAttribute("data-shiftkey") || a.shiftKey) a.preventDefault(), b = Draggable, c = document.documentElement, b.el = this.parentNode, b.key = b.el.getAttribute("data-trackpos"), d = b.el.getBoundingClientRect(), b.dx = a.clientX - d.left, b.dy = a.clientY - d.top, b.right = c.clientWidth - d.width, b.bottom = c.clientHeight - d.height, "fixed" != getComputedStyle(b.el, null).position ? (b.scrollX = window.pageXOffset, b.scrollY = window.pageYOffset) : b.scrollX = b.scrollY = 0, b.offsetTop = Config.dropDownNav && !Config.autoHideNav ? $.id(Config.classicNav ? "boardNavDesktop" : "boardNavMobile").offsetHeight : 0, document.addEventListener("mouseup", b.endDrag, !1), document.addEventListener("mousemove", b.onDrag, !1)
        },
        endDrag: function(a) {
            document.removeEventListener("mouseup", Draggable.endDrag, !1);
            document.removeEventListener("mousemove", Draggable.onDrag, !1);
            Draggable.key && (Config[Draggable.key] = Draggable.el.style.cssText, Config.save());
            delete Draggable.el
        },
        onDrag: function(a) {
            var b, c;
            b = a.clientX - Draggable.dx + Draggable.scrollX;
            a = a.clientY - Draggable.dy + Draggable.scrollY;
            c = Draggable.el.style;
            1 > b ? (c.left = "0", c.right = "") : Draggable.right < b ? (c.left = "", c.right = "0") : (c.left = b / document.documentElement.clientWidth * 100 + "%", c.right = "");
            a <= Draggable.offsetTop ? (c.top = Draggable.offsetTop + "px", c.bottom = "") : Draggable.bottom < a ? (c.bottom = "0", c.top = "") : (c.top = a / document.documentElement.clientHeight * 100 + "%", c.bottom = "")
        }
    },
    UA = {
        init: function() {
            document.head = document.head || $.tag("head")[0];
            this.isOpera = "[object Opera]" == Object.prototype.toString.call(window.opera);
            this.hasCORS = "withCredentials" in new XMLHttpRequest;
            this.hasFormData = "FormData" in window;
            this.hasDragAndDrop = !1
        },
        dispatchEvent: function(a, b) {
            var c = document.createEvent("Event");
            c.initEvent(a, !1, !1);
            b && (c.detail = b);
            document.dispatchEvent(c)
        },
        getSelection: function(a) {
            var b;
            UA.isOpera && "string" == typeof(b = document.getSelection()) || (b = window.getSelection(), a || (b = b.toString()));
            return b
        }
    },
    Config = {
        quotePreview: !0,
        backlinks: !0,
        quickReply: !0,
        threadUpdater: !0,
        threadHiding: !0,
        alwaysAutoUpdate: !1,
        topPageNav: !1,
        threadWatcher: !1,
        imageExpansion: !0,
        fitToScreenExpansion: !1,
        threadExpansion: !0,
        alwaysDepage: !1,
        localTime: !0,
        stickyNav: !1,
        keyBinds: !1,
        inlineQuotes: !1,
        filter: !1,
        revealSpoilers: !1,
        imageHover: !1,
        threadStats: !0,
        IDColor: !0,
        noPictures: !1,
        embedYouTube: !0,
        embedSoundCloud: !1,
        updaterSound: !1,
        customCSS: !1,
        autoScroll: !1,
        hideStubs: !1,
        compactThreads: !1,
        centeredThreads: !1,
        dropDownNav: !1,
        autoHideNav: !1,
        classicNav: !1,
        fixedThreadWatcher: !1,
        persistentQR: !1,
        forceHTTPS: !1,
        reportButton: !1,
        darkTheme: !1,
        disableAll: !1
    },
    ConfigMobile = {
        embedYouTube: !1,
        compactThreads: !1
    };
Config.load = function() {
    (storage = localStorage.getItem("4chan-settings")) ? (storage = JSON.parse(storage), $.extend(Config, storage), "1" === Main.getCookie("https") ? Config.forceHTTPS = !0 : Config.forceHTTPS = !1) : Main.firstRun = !0
};
Config.loadFromURL = function() {
    var a, b;
    a = location.href.split("=", 2);
    if (/#cfg$/.test(a[0])) try {
        return b = JSON.parse(decodeURIComponent(a[1])), history.replaceState(null, "", location.href.split("#", 1)[0]), $.extend(Config, JSON.parse(b.settings)), Config.save(), b.filters && localStorage.setItem("4chan-filters", b.filters), b.css && localStorage.setItem("4chan-css", b.css), b.catalogFilters && localStorage.setItem("catalog-filters", b.catalogFilters), b.catalogSettings && localStorage.setItem("catalog-settings", b.catalogSettings), !0
    } catch (c) {
        console.log(c)
    }
    return !1
};
Config.toURL = function() {
    var a, b = {};
    b.settings = localStorage.getItem("4chan-settings");
    if (a = localStorage.getItem("4chan-filters")) b.filters = a;
    if (a = localStorage.getItem("4chan-css")) b.css = a;
    if (a = localStorage.getItem("catalog-filters")) b.catalogFilters = a;
    if (a = localStorage.getItem("catalog-settings")) b.catalogSettings = a;
    return encodeURIComponent(JSON.stringify(b))
};
Config.save = function(a) {
    localStorage.setItem("4chan-settings", JSON.stringify(Config));
    a && (Config.forceHTTPS ? Main.setCookie("https", 1) : Main.removeCookie("https"), a.darkTheme != Config.darkTheme && (Config.darkTheme ? (Main.setCookie("nws_style", "Tomorrow", ".4chan.org"), Main.setCookie("ws_style", "Tomorrow", ".4chan.org")) : (Main.removeCookie("nws_style", ".4chan.org"), Main.removeCookie("ws_style", ".4chan.org"))))
};
var SettingsMenu = {
    options: {
        "Quotes &amp; Replying": {
            quotePreview: ["Quote preview", "Show post when mousing over post links", !0],
            backlinks: ["Backlinks", "Show who has replied to a post", !0],
            inlineQuotes: ["Inline quote links", "Clicking quote links will inline expand the quoted post, Shift-click to bypass inlining"],
            quickReply: ["Quick Reply", "Quickly respond to a post by clicking its post number", !0],
            persistentQR: ["Persistent Quick Reply", "Keep Quick Reply window open after posting"]
        },
        Monitoring: {
            threadUpdater: ["Thread updater", "Append new posts to bottom of thread without refreshing the page", !0],
            alwaysAutoUpdate: ["Auto-update by default", "Always auto-update threads", !0],
            threadWatcher: ["Thread Watcher", "Keep track of threads you're watching and see when they receive new posts", !0],
            autoScroll: ["Auto-scroll with auto-updated posts", "Automatically scroll the page as new posts are added"],
            updaterSound: ["Sound notification", "Play a sound when somebody replies to your post(s)"],
            fixedThreadWatcher: ["Pin Thread Watcher to the page", "Thread Watcher will scroll with you"],
            threadStats: ["Thread statistics", "Display post and image counts on the right of the page, <em>italics</em> signify bump/image limit has been met", !0]
        },
        "Filters &amp; Post Hiding": {
            filter: ['Filter and highlight specific threads/posts [<a href="javascript:;" data-cmd="filters-open">Edit</a>]', "Enable pattern-based filters"],
            threadHiding: ['Thread hiding [<a href="javascript:;" data-cmd="thread-hiding-clear">Clear History</a>]', "Hide entire threads by clicking the minus button", !0],
            hideStubs: ["Hide thread stubs", "Don't display stubs of hidden threads"]
        },
        Navigation: {
            threadExpansion: ["Thread expansion", "Expand threads inline on board indexes", !0],
            dropDownNav: ["Use persistent drop-down navigation bar", ""],
            classicNav: ["Use traditional board list", "", !1, !0],
            autoHideNav: ["Auto-hide on scroll", "", !1, !0],
            customMenu: ['Custom board list [<a href="javascript:;" data-cmd="custom-menu-edit">Edit</a>]', "Only show selected boards in top and bottom board lists"],
            alwaysDepage: ["Always use infinite scroll", "Enable infinite scroll by default, so reaching the bottom of the board index will load subsequent pages", !0],
            topPageNav: ["Page navigation at top of page", "Show the page switcher at the top of the page, hold Shift and drag to move"],
            stickyNav: ["Navigation arrows", "Show top and bottom navigation arrows, hold Shift and drag to move"],
            keyBinds: ['Use keyboard shortcuts [<a href="javascript:;" data-cmd="keybinds-open">Show</a>]', "Enable handy keyboard shortcuts for common actions"]
        },
        "Images &amp; Media": {
            imageExpansion: ["Image expansion", "Enable inline image expansion, limited to browser width", !0],
            fitToScreenExpansion: ["Fit expanded images to screen", "Limit expanded images to both browser width and height"],
            imageHover: ["Image hover", "Mouse over images to view full size, limited to browser size"],
            revealSpoilers: ["Don't spoiler images", "Show image thumbnail and original filename instead of spoiler placeholders", !0],
            noPictures: ["Hide thumbnails", "Don't display thumbnails while browsing", !0],
            embedYouTube: ["Embed YouTube links", "Embed YouTube player into replies"],
            embedSoundCloud: ["Embed SoundCloud links", "Embed SoundCloud player into replies"],
            embedVocaroo: ["Embed Vocaroo links", "Embed Vocaroo player into replies"]
        },
        Miscellaneous: {
            darkTheme: ["Use a dark theme", "Use the Tomorrow theme for nighttime browsing", !0, !1, !0],
            customCSS: ['Custom CSS [<a href="javascript:;" data-cmd="css-open">Edit</a>]', "Include your own CSS rules", !0],
            IDColor: ["Color user IDs", "Assign unique colors to user IDs on boards that use them", !0],
            compactThreads: ["Force long posts to wrap", "Long posts will wrap at 75% browser width"],
            centeredThreads: ["Center threads", "Align threads to the center of page", !1],
            reportButton: ["Report button", "Add a report button next to posts for easy reporting", !0, !1, !0],
            localTime: ["Convert dates to local time", "Convert 4chan server time (US Eastern Time) to your local time", !0],
            forceHTTPS: ["Always use HTTPS", "Rewrite 4chan URLs to always use HTTPS", !0]
        }
    },
    save: function() {
        var a, b, c, d, e;
        e = {};
        $.extend(e, Config);
        b = $.id("settingsMenu").getElementsByClassName("menuOption");
        for (a = 0; c = b[a]; ++a) d = c.getAttribute("data-option"), Config[d] = "checkbox" == c.type ? c.checked : c.value;
        Config.save(e);
        SettingsMenu.close();
        location.href = location.href.replace(/#.+$/, "")
    },
    toggle: function() {
        $.id("settingsMenu") ? SettingsMenu.close() : SettingsMenu.open()
    },
    open: function() {
        var a, b, c, d, e, f, h, g, k;
        Main.firstRun && ((k = $.id("settingsTip")) && k.parentNode.removeChild(k), (k = $.id("settingsTipBottom")) && k.parentNode.removeChild(k), Config.save());
        f = document.createElement("div");
        f.id = "settingsMenu";
        f.className = "UIPanel";
        e = '<div class="extPanel reply"><div class="panelHeader">Settings<span><img alt="Close" title="Close" class="pointer" data-cmd="settings-toggle" src="' + Main.icons.cross + '"></a></span></div><ul>';
        e += '<ul><li id="settings-exp-all">[<a href="#" data-cmd="settings-exp-all">Expand All Settings</a>]</li></ul>';
        if (Main.hasMobileLayout)
            for (b in c = {}, SettingsMenu.options) {
                g = {};
                h = SettingsMenu.options[b];
                for (d in h) h[d][2] && (g[d] = h[d]);
                for (a in g) {
                    c[b] = g;
                    break
                }
            } else c = SettingsMenu.options;
        for (b in c) {
            h = c[b];
            e += '<ul><li class="settings-cat-lbl"><img alt="" class="settings-expand" src="' + Main.icons.plus + '"><span class="settings-expand pointer">' + b + '</span></li><ul class="settings-cat">';
            for (d in h)
                if (!h[d][4] || Main.hasMobileLayout) e += "<li" + (h[d][3] ? ' class="settings-sub">' : ">") + '<label><input type="checkbox" class="menuOption" data-option="' + d + '"' + (Config[d] ? ' checked="checked">' : ">") + h[d][0] + "</label>" + (!1 !== h[d][1] ? '</li><li class="settings-tip' + (h[d][3] ? ' settings-sub">' : '">') + h[d][1] : "") + "</li>";
            e += "</ul></ul>"
        }
        e += '</ul><ul><li class="settings-off"><label title="Completely disable the native extension (overrides any checked boxes)"><input type="checkbox" class="menuOption" data-option="disableAll"' + (Config.disableAll ? ' checked="checked">' : ">") + 'Disable the native extension</label></li></ul><div class="center"><button data-cmd="settings-export">Export Settings</button><button data-cmd="settings-save">Save Settings</button></div>';
        f.innerHTML = e;
        f.addEventListener("click", SettingsMenu.onClick, !1);
        document.body.appendChild(f);
        Main.firstRun && SettingsMenu.expandAll();
        (k = $.cls("menuOption", f)[0]) && k.focus()
    },
    showExport: function() {
        var a, b;
        $.id("exportSettings") || (b = location.href.replace(location.hash, "") + "#cfg=" + Config.toURL(), a = document.createElement("div"), a.id = "exportSettings", a.className = "UIPanel", a.setAttribute("data-cmd", "export-close"), a.innerHTML = '<div class="extPanel reply"><div class="panelHeader">Export Settings<span><img data-cmd="export-close" class="pointer" alt="Close" title="Close" src="' + Main.icons.cross + '"></span></div><p class="center">Copy and save the URL below, and visit it from another browser or computer to restore your extension and catalog settings.</p><p class="center"><input class="export-field" type="text" readonly="readonly" value="' + b + '"></p><p style="margin-top:15px" class="center">Alternatively, you can drag the link below into your bookmarks bar and click it to restore.</p><p class="center">[<a target="_blank" href="' + b + '">Restore 4chan Settings</a>]</p>', document.body.appendChild(a), a.addEventListener("click", this.onExportClick, !1), a = $.cls("export-field", a)[0], a.focus(), a.select())
    },
    closeExport: function() {
        var a;
        if (a = $.id("exportSettings")) a.removeEventListener("click", this.onExportClick, !1), document.body.removeChild(a)
    },
    onExportClick: function(a) {
        "exportSettings" == a.target.id && (a.preventDefault(), a.stopPropagation(), SettingsMenu.closeExport())
    },
    expandAll: function() {
        var a, b, c = $.cls("settings-expand");
        for (a = 0; b = c[a]; ++a) b.src = Main.icons.minus, b.parentNode.nextElementSibling.style.display = "block"
    },
    toggleCat: function(a) {
        var b, c, d = a.parentNode.nextElementSibling;
        d.style.display ? (c = "", b = "plus") : (c = "block", b = "minus");
        d.style.display = c;
        a.parentNode.firstElementChild.src = Main.icons[b]
    },
    onClick: function(a) {
        var b, c;
        c = a.target;
        $.hasClass(c, "settings-expand") ? SettingsMenu.toggleCat(c) : "settings-exp-all" == c.getAttribute("data-cmd") ? (a.preventDefault(), SettingsMenu.expandAll()) : "settingsMenu" == c.id && (b = $.id("settingsMenu")) && (a.preventDefault(), SettingsMenu.close(b))
    },
    close: function(a) {
        if (a = a || $.id("settingsMenu")) a.removeEventListener("click", SettingsMenu.onClick, !1), document.body.removeChild(a)
    }
};
Feedback = {
    messageTimeout: null,
    showMessage: function(a, b, c, d) {
        var e;
        Feedback.hideMessage();
        e = document.createElement("div");
        e.id = "feedback";
        e.title = "Dismiss";
        e.innerHTML = '<span class="feedback-' + b + '">' + a + "</span>";
        $.on(e, "click", d || Feedback.hideMessage);
        document.body.appendChild(e);
        c && (Feedback.messageTimeout = setTimeout(Feedback.hideMessage, c))
    },
    hideMessage: function() {
        var a = $.id("feedback");
        a && (Feedback.messageTimeout && (clearTimeout(Feedback.messageTimeout), Feedback.messageTimeout = null), $.off(a, "click", Feedback.hideMessage), document.body.removeChild(a))
    },
    error: function(a, b) {
        Feedback.showMessage(a || "Something went wrong", "error", b || 5E3)
    },
    notify: function(a, b) {
        Feedback.showMessage(a, "notify", b || 3E3)
    }
};
var Main = {
    addTooltip: function(a, b, c) {
        var d;
        d = document.createElement("div");
        d.className = "click-me";
        c && (d.id = c);
        d.innerHTML = b || "Change your settings";
        a.parentNode.appendChild(d);
        d.style.marginLeft = (a.offsetWidth - d.offsetWidth + a.offsetLeft - d.offsetLeft) / 2 + "px";
        return d
    },
    init: function() {
        var a;
        document.addEventListener("DOMContentLoaded", Main.run, !1);
        Main.now = Date.now();
        UA.init();
        Config.load();
        Config.forceHTTPS && "https:" != location.protocol ? location.href = location.href.replace(/^http:/, "https:") : (Main.firstRun && Config.loadFromURL() && (Main.firstRun = !1), (Main.stylesheet = Main.getCookie(style_group)) ? Main.stylesheet = Main.stylesheet.toLowerCase().replace(/ /g, "_") : Main.stylesheet = "nws_style" == style_group ? "yotsuba_new" : "yotsuba_b_new", Main.passEnabled = Main.getCookie("pass_enabled"), QR.noCaptcha = QR.noCaptcha || Main.passEnabled, Main.initIcons(), Main.addCSS(), Main.type = style_group.split("_")[0], a = location.pathname.split(/\//), Main.board = a[1], Main.page = a[2], Main.tid = a[3], UA.dispatchEvent("4chanMainInit"))
    },
    initPersistentNav: function() {
        var a, b, c;
        b = $.id("boardNavDesktop");
        c = $.id("boardNavDesktopFoot");
        Config.classicNav ? (a = document.createElement("div"), a.className = "pageJump", a.innerHTML = '<a href="#bottom">&#9660;</a><a href="javascript:void(0);" id="settingsWindowLinkClassic">Settings</a><a href="//www.4chan.org" target="_top">Home</a></div>', b.appendChild(a), $.id("settingsWindowLinkClassic").addEventListener("click", SettingsMenu.toggle, !1), $.addClass(b, "persistentNav")) : (b.style.display = "none", $.removeClass($.id("boardNavMobile"), "mobile"));
        c.style.display = "none";
        $.addClass(document.body, "hasDropDownNav")
    },
    checkMobileLayout: function() {
        var a, b;
        if (window.matchMedia) return (window.matchMedia("(max-width: 480px)").matches || window.matchMedia("(max-device-width: 480px)").matches) && "true" != localStorage.getItem("4chan_never_show_mobile");
        a = $.id("boardNavMobile");
        b = $.id("boardNavDesktop");
        return a && b && 0 < a.offsetWidth && 0 == b.offsetWidth
    },
    disableDarkTheme: function() {
        Config.darkTheme = !1;
        localStorage.setItem("4chan-settings", JSON.stringify(Config))
    },
    run: function() {
        var a;
        document.removeEventListener("DOMContentLoaded", Main.run, !1);
        document.addEventListener("click", Main.onclick, !1);
        $.id("settingsWindowLink").addEventListener("click", SettingsMenu.toggle, !1);
        $.id("settingsWindowLinkBot").addEventListener("click", SettingsMenu.toggle, !1);
        $.id("settingsWindowLinkMobile").addEventListener("click", SettingsMenu.toggle, !1);
        if (!Config.disableAll) {
            Main.hasMobileLayout = Main.checkMobileLayout();
            Main.isMobileDevice = /Mobile|Android|Dolfin|Opera Mobi|PlayStation Vita|Nintendo DS/.test(navigator.userAgent);
            Report.init();
            Config.IDColor && IDColor.init();
            Config.customCSS && CustomCSS.init();
            Config.keyBinds && Keybinds.init();
            if (Main.hasMobileLayout) $.extend(Config, ConfigMobile);
            else {
                if (el = $.id("bottomReportBtn")) el.style.display = "none";
                Main.isMobileDevice && $.addClass(document.body, "isMobileDevice")
            }
            Main.firstRun && Main.isMobileDevice && (Config.topPageNav = !1, Config.dropDownNav = !0);
            Config.dropDownNav && !Main.hasMobileLayout && Main.initPersistentNav();
            $.addClass(document.body, Main.stylesheet);
            $.addClass(document.body, Main.type);
            Config.darkTheme && ($.addClass(document.body, "m-dark"), Main.hasMobileLayout || $.cls("stylechanger")[0].addEventListener("change", Main.disableDarkTheme, !1));
            Config.compactThreads ? $.addClass(document.body, "compact") : Config.centeredThreads && $.addClass(document.body, "centeredThreads");
            Config.noPictures && $.addClass(document.body, "noPictures");
            Config.customMenu && CustomMenu.apply(Config.customMenuList);
            if (Config.quotePreview || Config.imageHover || Config.filter) a = $.id("delform") || $.id("arc-list"), a.addEventListener("mouseover", Main.onThreadMouseOver, !1), a.addEventListener("mouseout", Main.onThreadMouseOut, !1);
            Config.stickyNav && Main.setStickyNav();
            Main.hasMobileLayout ? StickyNav.init() : (Main.initGlobalMessage(), Config.autoHideNav && StickyNav.init());
            Config.threadExpansion && ThreadExpansion.init();
            Config.filter && Filter.init();
            Config.threadWatcher && ThreadWatcher.init();
            (Main.hasMobileLayout || Config.embedSoundCloud || Config.embedYouTube || Config.embedVocaroo) && Media.init();
            ReplyHiding.init();
            Config.quotePreview && QuotePreview.init();
            Parser.init();
            Main.tid ? (Main.threadClosed = !document.forms.post, Main.threadSticky = !!$.cls("stickyIcon", $.id("pi" + Main.tid))[0], Config.threadStats && ThreadStats.init(), Parser.parseThread(Main.tid), Config.threadUpdater && ThreadUpdater.init()) : (Main.page || Depager.init(), Config.topPageNav && Main.setPageNav(), Config.threadHiding && ThreadHiding.init(), Parser.parseBoard());
            "f" === Main.board && SWFEmbed.init();
            Config.quickReply && QR.init();
            ReplyHiding.purge();
            Config.alwaysDepage && !Main.hasMobileLayout && $.docEl.scrollHeight <= $.docEl.clientHeight && Depager.depage()
        }
    },
    isThreadClosed: function(a) {
        return window.thread_archived || (el = $.id("pi" + a)) && $.cls("closedIcon", el)[0]
    },
    setThreadState: function(a, b) {
        var c, d, e, f;
        f = a.charAt(0).toUpperCase() + a.slice(1);
        if (b) c = $.cls("postNum", $.id("pi" + Main.tid))[0], d = document.createElement("img"), d.className = a + "Icon retina", d.title = f, d.src = Main.icons2[a], "sticky" == a && (e = $.cls("closedIcon", c)[0]) ? (c.insertBefore(d, e), c.insertBefore(document.createTextNode(" "), e)) : (c.appendChild(document.createTextNode(" ")), c.appendChild(d));
        else if (d = $.cls(a + "Icon", $.id("pi" + Main.tid))[0]) d.parentNode.removeChild(d.previousSibling), d.parentNode.removeChild(d);
        Main["thread" + f] = b
    },
    icons: {
        up: "arrow_up.png",
        down: "arrow_down.png",
        right: "arrow_right.png",
        download: "arrow_down2.png",
        refresh: "refresh.png",
        cross: "cross.png",
        gis: "gis.png",
        iqdb: "iqdb.png",
        minus: "post_expand_minus.png",
        plus: "post_expand_plus.png",
        rotate: "post_expand_rotate.gif",
        quote: "quote.png",
        report: "report.png",
        notwatched: "watch_thread_off.png",
        watched: "watch_thread_on.png",
        help: "question.png"
    },
    icons2: {
        archived: "archived.gif",
        closed: "closed.gif",
        sticky: "sticky.gif",
        trash: "trash.gif"
    },
    initIcons: function() {
        var a, b;
        b = "//s.4cdn.org/image/";
        if (2 <= window.devicePixelRatio) {
            for (a in Main.icons) Main.icons[a] = Main.icons[a].replace(".", "@2x.");
            for (a in Main.icons2) Main.icons2[a] = Main.icons2[a].replace(".", "@2x.")
        }
        for (a in Main.icons2) Main.icons2[a] = b + Main.icons2[a];
        b += "buttons/" + {
            yotsuba_new: "futaba/",
            futaba_new: "futaba/",
            yotsuba_b_new: "burichan/",
            burichan_new: "burichan/",
            tomorrow: "tomorrow/",
            photon: "photon/"
        }[Main.stylesheet];
        for (a in Main.icons) Main.icons[a] = b + Main.icons[a]
    },
    setPageNav: function() {
        var a, b;
        b = document.createElement("div");
        b.setAttribute("data-shiftkey", "1");
        b.setAttribute("data-trackpos", "TN-position");
        b.className = "topPageNav";
        Config["TN-position"] ? b.style.cssText = Config["TN-position"] : (b.style.left = "10px", b.style.top = "50px");
        if (a = $.cls("pagelist")[0]) a = a.cloneNode(!0), b.appendChild(a), Draggable.set(a), document.body.appendChild(b)
    },
    initGlobalMessage: function() {
        var a, b, c, d;
        (a = $.id("globalMessage")) && a.textContent && (a.nextElementSibling.style.clear = "both", b = document.createElement("img"), b.id = "toggleMsgBtn", b.className = "extButton", b.setAttribute("data-cmd", "toggleMsg"), b.alt = "Toggle", b.title = "Toggle announcement", d = localStorage.getItem("4chan-global-msg"), c = a.getAttribute("data-utc"), d && c <= d ? (a.style.display = "none", b.style.opacity = "0.5", b.src = Main.icons.plus) : b.src = Main.icons.minus, a.parentNode.insertBefore(b, a))
    },
    toggleGlobalMessage: function() {
        var a, b;
        a = $.id("globalMessage");
        b = $.id("toggleMsgBtn");
        "none" == a.style.display ? (a.style.display = "", b.src = Main.icons.minus, b.style.opacity = "1", localStorage.removeItem("4chan-global-msg")) : (a.style.display = "none", b.src = Main.icons.plus, b.style.opacity = "0.5", localStorage.setItem("4chan-global-msg", a.getAttribute("data-utc")))
    },
    setStickyNav: function() {
        var a, b;
        a = document.createElement("div");
        a.id = "stickyNav";
        a.className = "extPanel reply";
        a.setAttribute("data-shiftkey", "1");
        a.setAttribute("data-trackpos", "SN-position");
        Config["SN-position"] ? a.style.cssText = Config["SN-position"] : (a.style.right = "10px", a.style.top = "50px");
        b = document.createElement("div");
        b.innerHTML = '<img class="pointer" src="' + Main.icons.up + '" data-cmd="totop" alt="\u25b2" title="Top"><img class="pointer" src="' + Main.icons.down + '" data-cmd="tobottom" alt="\u25bc" title="Bottom">';
        Draggable.set(b);
        a.appendChild(b);
        document.body.appendChild(a)
    },
    getCookie: function(a) {
        var b, c, d;
        d = a + "=";
        c = document.cookie.split(";");
        for (a = 0; b = c[a]; ++a) {
            for (;
                " " == b.charAt(0);) b = b.substring(1, b.length);
            if (0 == b.indexOf(d)) return decodeURIComponent(b.substring(d.length, b.length))
        }
        return null
    },
    setCookie: function(a, b, c) {
        var d = new Date;
        d.setTime(d.getTime() + 31536E6);
        c || (c = "boards.4chan.org");
        document.cookie = a + "=" + b + "; expires=" + d.toGMTString() + "; path=/; domain=" + c
    },
    removeCookie: function(a, b) {
        b || (b = "boards.4chan.org");
        document.cookie = a + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;; path=/; domain=" + b
    },
    onclick: function(a) {
        var b, c;
        if ((b = a.target) != document)
            if (c = b.getAttribute("data-cmd")) switch (id = b.getAttribute("data-id"), c) {
                case "update":
                    a.preventDefault();
                    ThreadUpdater.forceUpdate();
                    break;
                case "post-menu":
                    a.preventDefault();
                    PostMenu.open(b);
                    break;
                case "auto":
                    ThreadUpdater.toggleAuto();
                    break;
                case "totop":
                case "tobottom":
                    a.shiftKey || (location.href = "#" + c.slice(2));
                    break;
                case "hide":
                    ThreadHiding.toggle(id);
                    break;
                case "watch":
                    ThreadWatcher.toggle(id);
                    break;
                case "hide-r":
                    b.hasAttribute("data-recurse") ? ReplyHiding.toggleR(id) : ReplyHiding.toggle(id);
                    break;
                case "expand":
                    ThreadExpansion.toggle(id);
                    break;
                case "open-qr":
                    a.preventDefault();
                    QR.show(Main.tid);
                    $.tag("textarea", document.forms.qrPost)[0].focus();
                    break;
                case "unfilter":
                    Filter.unfilter(b);
                    break;
                case "depage":
                    a.preventDefault();
                    Depager.toggle();
                    break;
                case "report":
                    Report.open(id, b.getAttribute("data-board"));
                    break;
                case "filter-sel":
                    a.preventDefault();
                    Filter.addSelection();
                    break;
                case "embed":
                    Media.toggleEmbed(b);
                    break;
                case "sound":
                    ThreadUpdater.toggleSound();
                    break;
                case "toggleMsg":
                    Main.toggleGlobalMessage();
                    break;
                case "settings-toggle":
                    SettingsMenu.toggle();
                    break;
                case "settings-save":
                    SettingsMenu.save();
                    break;
                case "keybinds-open":
                    Keybinds.open();
                    break;
                case "filters-open":
                    Filter.open();
                    break;
                case "thread-hiding-clear":
                    ThreadHiding.clear();
                    break;
                case "css-open":
                    CustomCSS.open();
                    break;
                case "settings-export":
                    SettingsMenu.showExport();
                    break;
                case "export-close":
                    SettingsMenu.closeExport();
                    break;
                case "custom-menu-edit":
                    CustomMenu.showEditor()
            } else Config.disableAll || (QR.enabled && "Reply to this post" == b.title ? (a.preventDefault(), c = Main.tid || b.previousElementSibling.getAttribute("href").split("#")[0].split("/")[1], QR.quotePost(c, !a.ctrlKey && b.textContent)) : Config.imageExpansion && 1 == a.which && b.parentNode && $.hasClass(b.parentNode, "fileThumb") && "A" == b.parentNode.nodeName && !$.hasClass(b.parentNode, "deleted") && !$.hasClass(b, "mFileInfo") ? ImageExpansion.toggle(b) && a.preventDefault() : Config.inlineQuotes && 1 == a.which && $.hasClass(b, "quotelink") ? a.shiftKey ? (a.preventDefault(), window.location = b.href) : QuoteInline.toggle(b, a) : Config.threadExpansion && b.parentNode && $.hasClass(b.parentNode, "abbr") ? (a.preventDefault(), ThreadExpansion.expandComment(b)) : Main.isMobileDevice && Config.quotePreview && $.hasClass(b, "quotelink") && b.getAttribute("href").match(QuotePreview.regex) ? a.preventDefault() : $.hasClass(b, "mFileInfo") && (a.preventDefault(), a.stopPropagation()))
    },
    onThreadMouseOver: function(a) {
        var b = a.target;
        if (Config.quotePreview && $.hasClass(b, "quotelink") && !$.hasClass(b, "deadlink") && !$.hasClass(b, "linkfade")) QuotePreview.resolve(a.target);
        else if (Config.imageHover && b.hasAttribute("data-md5") && !$.hasClass(b.parentNode, "deleted")) ImageHover.show(b);
        else if ($.hasClass(b, "dateTime")) Parser.onDateMouseOver(b);
        else Config.embedYouTube && "yt" === b.getAttribute("data-type") && !Main.hasMobileLayout ? Media.showYTPreview(b) : Config.filter && b.hasAttribute("data-filtered") && QuotePreview.show(b, b.href ? b.parentNode.parentNode.parentNode : b.parentNode.parentNode)
    },
    onThreadMouseOut: function(a) {
        a = a.target;
        if (Config.quotePreview && $.hasClass(a, "quotelink")) QuotePreview.remove(a);
        else if (Config.imageHover && a.hasAttribute("data-md5")) ImageHover.hide();
        else if ($.hasClass(a, "dateTime")) Parser.onDateMouseOut(a);
        else Config.embedYouTube && "yt" === a.getAttribute("data-type") && !Main.hasMobileLayout ? Media.removeYTPreview() : Config.filter && a.hasAttribute("data-filtered") && QuotePreview.remove(a)
    },
    linkToThread: function(a, b, c) {
        return "//" + location.host + "/" + (b || Main.board) + "/thread/" + a + (0 < c ? "#p" + c : "")
    },
    addCSS: function() {
        var a;
        a = document.createElement("style");
        a.setAttribute("type", "text/css");
        a.textContent = 'body.hasDropDownNav {  margin-top: 45px;}.extButton.threadHideButton {  float: left;  margin-right: 5px;  margin-top: -1px;}.extButton.replyHideButton {  margin-top: 1px;}div.op > span .postHideButtonCollapsed {  margin-right: 1px;}.dropDownNav #boardNavMobile, {  display: block !important;}.extPanel {  border: 1px solid rgba(0, 0, 0, 0.20);}.tomorrow .extPanel {  border: 1px solid #111;}.extButton,img.pointer {  width: 18px;  height: 18px;}.extControls {  display: inline;  margin-left: 5px;}.extButton {  cursor: pointer;  margin-bottom: -4px;}.trashIcon {  width: 16px;  height: 16px;  margin-bottom: -2px;  margin-left: 5px;}.threadUpdateStatus {  margin-left: 0.5ex;}.futaba_new .stub,.burichan_new .stub {  line-height: 1;  padding-bottom: 1px;}.stub .extControls,.stub .wbtn,.stub input {  display: none;}.stub .threadHideButton {  float: none;  margin-right: 2px;}div.post div.postInfo {  width: auto;  display: inline;}.right {  float: right;}.center {  display: block;  margin: auto;}.pointer {  cursor: pointer;}.drag {  cursor: move !important;  user-select: none !important;  -moz-user-select: none !important;  -webkit-user-select: none !important;}#quickReport,#quickReply {  display: block;  position: fixed;  padding: 2px;  font-size: 10pt;}#qrepHeader,#qrHeader {  text-align: center;  margin-bottom: 1px;  padding: 0;  height: 18px;  line-height: 18px;}#qrepClose,#qrClose {  float: right;}#qrCaptchaContainer { height: 78px; }#quickReport iframe {  overflow: hidden;}#quickReport {  height: 190px;}#qrForm > div {  clear: both;}#quickReply input[type="text"],#quickReply textarea,#quickReply #recaptcha_response_field {  border: 1px solid #aaa;  font-family: arial,helvetica,sans-serif;  font-size: 10pt;  outline: medium none;  width: 296px;  padding: 2px;  margin: 0 0 1px 0;}#quickReply textarea {  min-width: 296px;  float: left;}#quickReply input::-moz-placeholder,#quickReply textarea::-moz-placeholder {  color: #aaa !important;  opacity: 1 !important;}#quickReply input[type="submit"] {  width: 83px;  margin: 0;  font-size: 10pt;  float: right;}#quickReply #qrCapField {  display: block;  margin-top: 1px;}#qrCaptchaContainer > div > div { width: 300px !important; }#quickReply input.presubmit {  margin-right: 1px;  width: 212px;  float: left;}#qrFile {  width: 130px;  margin-right: 5px;}.qrRealFile {  position: absolute;  left: 0;  visibility: hidden;}.yotsuba_new #qrFile {  color:black;}#qrSpoiler {  display: inline;}#qrError {  width: 292px;  display: none;  font-family: monospace;  background-color: #E62020;  font-size: 12px;  color: white;  padding: 3px 5px;  text-shadow: 0 1px rgba(0, 0, 0, 0.20);  clear: both;}#qrError a:hover,#qrError a {  color: white !important;  text-decoration: underline;}#twHeader {  font-weight: bold;  text-align: center;  height: 17px;}.futaba_new #twHeader,.burichan_new #twHeader {  line-height: 1;}#twPrune {  margin-left: 3px;  margin-top: -1px;}#twClose {  float: left;  margin-top: -1px;}#threadWatcher {  max-width: 265px;  display: block;  position: absolute;  padding: 3px;}#watchList {  margin: 0;  padding: 0;  user-select: none;  -moz-user-select: none;  -webkit-user-select: none;}#watchList li:first-child {  margin-top: 3px;  padding-top: 2px;  border-top: 1px solid rgba(0, 0, 0, 0.20);}.photon #watchList li:first-child {  border-top: 1px solid #ccc;}.yotsuba_new #watchList li:first-child {  border-top: 1px solid #d9bfb7;}.yotsuba_b_new #watchList li:first-child {  border-top: 1px solid #b7c5d9;}.tomorrow #watchList li:first-child {  border-top: 1px solid #111;}#watchList a {  text-decoration: none;}#watchList li {  overflow: hidden;  white-space: nowrap;  text-overflow: ellipsis;}div.post div.image-expanded {  display: table;}div.op div.file .image-expanded-anti {  margin-left: -3px;}#quote-preview {  display: block;  position: absolute;  top: 0;  padding: 3px 6px 6px 3px;  margin: 0;}#quote-preview .dateTime {  white-space: nowrap;}#quote-preview.reveal-spoilers s {  background-color: #aaa !important;  color: inherit !important;  text-decoration: none !important;}#quote-preview.reveal-spoilers s a {  background: transparent !important;  text-decoration: underline;}.yotsuba_b_new #quote-preview.reveal-spoilers s a,.burichan_new #quote-preview.reveal-spoilers s a {  color: #D00 !important;}.yotsuba_new #quote-preview.reveal-spoilers s a,.futaba_new #quote-preview.reveal-spoilers s a {  color: #000080 !important;}.tomorrow #quote-preview.reveal-spoilers s { color: #000 !important; }.tomorrow #quote-preview.reveal-spoilers s a { color: #5F89AC !important; }.photon #quote-preview.reveal-spoilers s a {  color: #FF6600 !important;}.yotsuba_new #quote-preview.highlight,.yotsuba_b_new #quote-preview.highlight {  border-width: 1px 2px 2px 1px !important;  border-style: solid !important;}.yotsuba_new #quote-preview.highlight {  border-color: #D99F91 !important;}.yotsuba_b_new #quote-preview.highlight {  border-color: #BA9DBF !important;}.yotsuba_b_new .highlight-anti,.burichan_new .highlight-anti {  border-width: 1px !important;  background-color: #bfa6ba !important;}.yotsuba_new .highlight-anti,.futaba_new .highlight-anti {  background-color: #e8a690 !important;}.tomorrow .highlight-anti {  background-color: #111 !important;  border-color: #111;}.photon .highlight-anti {  background-color: #bbb !important;}.op.inlined {  display: block;}#quote-preview .inlined,#quote-preview .postMenuBtn,#quote-preview .extButton,#quote-preview .extControls {  display: none;}.hasNewReplies {  font-weight: bold;}.archivelink {  opacity: 0.5;}.deadlink {  text-decoration: line-through !important;}div.backlink {  font-size: 0.8em !important;  display: inline;  padding: 0;  padding-left: 5px;}.backlink.mobile {  padding: 3px 5px;  display: block;  clear: both !important;  line-height: 2;}.op .backlink.mobile,#quote-preview .backlink.mobile {  display: none !important;}.backlink.mobile .quoteLink {  padding-right: 2px;}.backlink span {  padding: 0;}.burichan_new .backlink a,.yotsuba_b_new .backlink a {  color: #34345C !important;}.burichan_new .backlink a:hover,.yotsuba_b_new .backlink a:hover {  color: #dd0000 !important;}.expbtn {  margin-right: 3px;  margin-left: 2px;}.tCollapsed .rExpanded {  display: none;}#stickyNav {  position: fixed;  font-size: 0;}#stickyNav img {  vertical-align: middle;}.tu-error {  color: red;}.topPageNav {  position: absolute;}.yotsuba_b_new .topPageNav {  border-top: 1px solid rgba(255, 255, 255, 0.25);  border-left: 1px solid rgba(255, 255, 255, 0.25);}.newPostsMarker:not(#quote-preview) {  box-shadow: 0 3px red;}#toggleMsgBtn {  float: left;  margin-bottom: 6px;}.panelHeader {  font-weight: bold;  font-size: 16px;  text-align: center;  margin-bottom: 5px;  margin-top: 5px;  padding-bottom: 5px;  border-bottom: 1px solid rgba(0, 0, 0, 0.20);}.yotsuba_new .panelHeader {  border-bottom: 1px solid #d9bfb7;}.yotsuba_b_new .panelHeader {  border-bottom: 1px solid #b7c5d9;}.tomorrow .panelHeader {  border-bottom: 1px solid #111;}.panelHeader span {  position: absolute;  right: 5px;  top: 5px;}.UIMenu,.UIPanel {  position: fixed;  width: 100%;  height: 100%;  z-index: 9002;  top: 0;  left: 0;}.UIPanel {  line-height: 14px;  font-size: 14px;  background-color: rgba(0, 0, 0, 0.25);}.UIPanel:after {  display: inline-block;  height: 100%;  vertical-align: middle;  content: "";}.UIPanel > div {  -moz-box-sizing: border-box;  box-sizing: border-box;  display: inline-block;  height: auto;  max-height: 100%;  position: relative;  width: 400px;  left: 50%;  margin-left: -200px;  overflow: auto;  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);  vertical-align: middle;}#settingsMenu > div {  top: 25px;;  vertical-align: top;  max-height: 85%;}.extPanel input[type="text"],.extPanel textarea {  border: 1px solid #AAA;  outline: none;}.UIPanel .center {  margin-bottom: 5px;}.UIPanel button {  display: inline-block;  margin-right: 5px;}.UIPanel code {  background-color: #eee;  color: #000000;  padding: 1px 4px;  font-size: 12px;}.UIPanel ul {  list-style: none;  padding: 0;  margin: 0 0 10px;}.UIPanel .export-field {  width: 385px;}#settingsMenu label input {  margin-right: 5px;}.tomorrow #settingsMenu ul {  border-bottom: 1px solid #282a2e;}.settings-off {  padding-left: 3px;}.settings-cat-lbl {  font-weight: bold;  margin: 10px 0 5px;  padding-left: 5px;}.settings-cat-lbl img {  vertical-align: text-bottom;  margin-right: 5px;  cursor: pointer;  width: 18px;  height: 18px;}.settings-tip {  font-size: 0.85em;  margin: 2px 0 5px 0;  padding-left: 23px;}#settings-exp-all {  padding-left: 7px;  text-align: center;}#settingsMenu .settings-cat {  display: none;  margin-left: 3px;}#customCSSMenu textarea {  display: block;  max-width: 100%;  min-width: 100%;  -moz-box-sizing: border-box;  box-sizing: border-box;  height: 200px;  margin: 0 0 5px;  font-family: monospace;}#customCSSMenu .right,#settingsMenu .right {  margin-top: 2px;}#settingsMenu label {  display: inline-block;  user-select: none;  -moz-user-select: none;  -webkit-user-select: none;}#filtersHelp > div {  width: 600px;  left: 50%;  margin-left: -300px;}#filtersHelp h4 {  font-size: 15px;  margin: 20px 0 0 10px;}#filtersHelp h4:before {  content: "\u00bb";  margin-right: 3px;}#filtersHelp ul {  padding: 0;  margin: 10px;}#filtersHelp li {  padding: 3px 0;  list-style: none;}#filtersMenu table {  width: 100%;}#filtersMenu th {  font-size: 12px;}#filtersMenu tbody {  text-align: center;}#filtersMenu select,#filtersMenu .fPattern,#filtersMenu .fBoards,#palette-custom-input {  padding: 1px;  font-size: 11px;}#filtersMenu select {  width: 75px;}#filtersMenu tfoot td {  padding-top: 10px;}#keybindsHelp li {  padding: 3px 5px;}.fPattern {  width: 110px;}.fBoards {  width: 25px;}.fColor {  width: 60px;}.fDel {  font-size: 16px;}.filter-preview {  cursor: pointer;  margin-left: 3px;}#quote-preview iframe,#quote-preview .filter-preview {  display: none;}.post-hidden .extButton,.post-hidden:not(#quote-preview) .postInfo {  opacity: 0.5;}.post-hidden:not(.thread) .postInfo {  padding-left: 5px;}.post-hidden:not(#quote-preview) input,.post-hidden:not(#quote-preview) .replyContainer,.post-hidden:not(#quote-preview) .summary,.post-hidden:not(#quote-preview) .op .file,.post-hidden:not(#quote-preview) .file,.post-hidden .wbtn,.post-hidden .postNum span,.post-hidden:not(#quote-preview) .backlink,div.post-hidden:not(#quote-preview) div.file,div.post-hidden:not(#quote-preview) blockquote.postMessage {  display: none;}.click-me {  border-radius: 5px;  margin-top: 5px;  padding: 2px 5px;  position: absolute;  font-weight: bold;  z-index: 2;  white-space: nowrap;}.yotsuba_new .click-me,.futaba_new .click-me {  color: #800000;  background-color: #F0E0D6;  border: 2px solid #D9BFB7;}.yotsuba_b_new .click-me,.burichan_new .click-me {  color: #000;  background-color: #D6DAF0;  border: 2px solid #B7C5D9;}.tomorrow .click-me {  color: #C5C8C6;  background-color: #282A2E;  border: 2px solid #111;}.photon .click-me {  color: #333;  background-color: #ddd;  border: 2px solid #ccc;}.click-me:before {  content: "";  border-width: 0 6px 6px;  border-style: solid;  left: 50%;  margin-left: -6px;  position: absolute;  width: 0;  height: 0;  top: -6px;}.yotsuba_new .click-me:before,.futaba_new .click-me:before {  border-color: #D9BFB7 transparent;}.yotsuba_b_new .click-me:before,.burichan_new .click-me:before {  border-color: #B7C5D9 transparent;}.tomorrow .click-me:before {  border-color: #111 transparent;}.photon .click-me:before {  border-color: #ccc transparent;}.click-me:after {  content: "";  border-width: 0 4px 4px;  top: -4px;  display: block;  left: 50%;  margin-left: -4px;  position: absolute;  width: 0;  height: 0;}.yotsuba_new .click-me:after,.futaba_new .click-me:after {  border-color: #F0E0D6 transparent;  border-style: solid;}.yotsuba_b_new .click-me:after,.burichan_new .click-me:after {  border-color: #D6DAF0 transparent;  border-style: solid;}.tomorrow .click-me:after {  border-color: #282A2E transparent;  border-style: solid;}.photon .click-me:after {  border-color: #DDD transparent;  border-style: solid;}#image-hover {  position: fixed;  max-width: 100%;  max-height: 100%;  top: 0px;  right: 0px;  z-index: 9002;}.thread-stats {  float: right;  margin-right: 5px;  cursor: default;}.compact .thread {  max-width: 75%;}.dotted {  text-decoration: none;  border-bottom: 1px dashed;}.linkfade {  opacity: 0.5;}#quote-preview .linkfade {  opacity: 1.0;}kbd {  background-color: #f7f7f7;  color: black;  border: 1px solid #ccc;  border-radius: 3px 3px 3px 3px;  box-shadow: 0 1px 0 #ccc, 0 0 0 2px #fff inset;  font-family: monospace;  font-size: 11px;  line-height: 1.4;  padding: 0 5px;}.deleted {  opacity: 0.66;}.noPictures a.fileThumb img:not(.expanded-thumb) {  opacity: 0;}.noPictures.futaba_new a.fileThumb,.noPictures.yotsuba_new a.fileThumb {  border: 1px solid #800;}.noPictures.burichan_new a.fileThumb,.noPictures.yotsuba_b_new a.fileThumb {  border: 1px solid #34345C;}.noPictures.tomorrow a.fileThumb:not(.expanded-thumb) {  border: 1px solid #C5C8C6;}.noPictures.photon a.fileThumb:not(.expanded-thumb) {  border: 1px solid #004A99;}.spinner {  margin-top: 2px;  padding: 3px;  display: table;}#settings-presets {  position: relative;  top: -1px;}#colorpicker {   position: fixed;  text-align: center;}.colorbox {  font-size: 10px;  width: 16px;  height: 16px;  line-height: 17px;  display: inline-block;  text-align: center;  background-color: #fff;  border: 1px solid #aaa;  text-decoration: none;  color: #000;  cursor: pointer;  vertical-align: top;}#palette-custom-input {  vertical-align: top;  width: 45px;  margin-right: 2px;}#qrDummyFile {  float: left;  margin-right: 5px;  width: 220px;  cursor: default;  -moz-user-select: none;  -webkit-user-select: none;  -ms-user-select: none;  user-select: none;  white-space: nowrap;  text-overflow: ellipsis;  overflow: hidden;}#qrDummyFileLabel {  margin-left: 3px;}.depageNumber {  position: absolute;  right: 5px;}.depagerEnabled .depagelink {  font-weight: bold;}.depagerEnabled strong {  font-weight: normal;}.depagelink {  display: inline-block;  padding: 4px 0;  cursor: pointer;  text-decoration: none;}.burichan_new .depagelink,.futaba_new .depagelink {  text-decoration: underline;}#customMenuBox {  margin: 0 auto 5px auto;  width: 385px;  display: block;}.preview-summary {  display: block;}#swf-embed-header {  padding: 0 0 0 3px;  font-weight: normal;  height: 20px;  line-height: 20px;}.yotsuba_new #swf-embed-header,.yotsuba_b_new #swf-embed-header {  height: 18px;  line-height: 18px;}#swf-embed-close {  position: absolute;  right: 0;  top: 1px;}.open-qr-wrap {  text-align: center;  width: 200px;  position: absolute;  margin-left: 50%;  left: -100px;}.postMenuBtn {  margin-left: 5px;  text-decoration: none;  line-height: 1em;  display: inline-block;  -webkit-transition: -webkit-transform 0.1s;  -moz-transition: -moz-transform 0.1s;  transition: transform 0.1s;  width: 1em;  height: 1em;  text-align: center;  outline: none;  opacity: 0.8;}.postMenuBtn:hover{  opacity: 1;}.yotsuba_new .postMenuBtn,.futaba_new .postMenuBtn {  color: #000080;}.tomorrow .postMenuBtn {  color: #5F89AC !important;}.tomorrow .postMenuBtn:hover {  color: #81a2be !important;}.photon .postMenuBtn {  color: #FF6600 !important;}.photon .postMenuBtn:hover {  color: #FF3300 !important;}.menuOpen {  -webkit-transform: rotate(90deg);  -moz-transform: rotate(90deg);  -ms-transform: rotate(90deg);  transform: rotate(90deg);}.settings-sub label:before {  border-bottom: 1px solid;  border-left: 1px solid;  content: " ";  display: inline-block;  height: 8px;  margin-bottom: 5px;  width: 8px;}.settings-sub {  margin-left: 25px;}.settings-tip.settings-sub {  padding-left: 32px;}.centeredThreads .opContainer {  display: block;}.centeredThreads .postContainer {  margin: auto;  width: 75%;}.centeredThreads .sideArrows {  display: none;}.centre-exp {  width: auto !important;  clear: both;}.centeredThreads .expandedWebm {  float: none;}.centeredThreads .summary {  margin-left: 12.5%;  display: block;}.centre-exp div.op{  display: table;}#yt-preview { position: absolute; }#yt-preview img { display: block; }.autohide-nav { transition: top 0.2s ease-in-out }#feedback {  position: fixed;  top: 10px;  text-align: center;  width: 100%;  z-index: 9999;}.feedback-notify,.feedback-error {  border-radius: 5px;  cursor: pointer;  color: #fff;  padding: 3px 6px;  font-size: 16px;  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);  text-shadow: 0 1px rgba(0, 0, 0, 0.2);}.feedback-error { background-color: #C41E3A; }.feedback-notify { background-color: #00A550; }@media only screen and (max-width: 480px) {.thread-stats { float: none; text-align: center; }.ts-replies:before { content: "Replies: "; }.ts-images:before { content: "Images: "; }.ts-ips:before { content: "Posters: "; }.ts-page:before { content: "Page: "; }#threadWatcher {  max-width: none;  padding: 3px 0;  left: 0;  width: 100%;  border-left: none;  border-right: none;}#watchList {  padding: 0 10px;}.btn-row {  margin-top: 5px;}.image-expanded .mFileName {  display: block;  margin-bottom: 2px;}.mFileName { display: none }.mobile-report {  float: right;  font-size: 11px;  margin-bottom: 3px;  margin-left: 10px;}.mobile-report:after {  content: "]";}.mobile-report:before {  content: "[";}.nws .mobile-report:after {  color: #800000;}.nws .mobile-report:before {  color: #800000;}.ws .mobile-report {  color: #34345C;}.nws .mobile-report {  color:#0000EE;}.reply .mobile-report {  margin-right:5px;}.postLink .mobileHideButton {  margin-right: 3px;}.board .mobile-hr-hidden {  margin-top: 10px !important;}.board > .mobileHideButton {  margin-top: -20px !important;}.board > .mobileHideButton:first-child {  margin-top: 10px !important;}.extButton.threadHideButton {  float: none;  margin: 0;  margin-bottom: 5px;}.mobile-post-hidden {  display: none;}#toggleMsgBtn {  display: none;}.mobile-tu-status {  height: 20px;  line-height: 20px;}.mobile-tu-show {  width: 150px;  margin: auto;  display: block;  text-align: center;}.button input {  margin: 0 3px 0 0;  position: relative;  top: -2px;  border-radius: 0;  height: 10px;  width: 10px;}.UIPanel > div {  width: 320px;  margin-left: -160px;}.UIPanel .export-field {  width: 300px;}.yotsuba_new #quote-preview.highlight,#quote-preview {  border-width: 1px !important;}.yotsuba_new #quote-preview.highlight {  border-color: #D9BFB7 !important;}#quickReply input[type="text"],#quickReply textarea,.extPanel input[type="text"],.extPanel textarea {  font-size: 16px;}#quickReply {  position: absolute;  left: 50%;  margin-left: -154px;}.m-dark .button {  background-color: rgb(27,28,30);  background-image: url("//s.4cdn.org/image/buttonfade-dark.png");  background-repeat: repeat-x;  border: 1px solid #282A2E;}.depaged-ad { margin-top: -25px; margin-bottom: -25px; }.depageNumber { font-size: 10px; margin-top: -21px; }.m-dark a, .m-dark div#absbot a { color: #81A2BE !important; }.m-dark a:hover { color: #5F89AC !important; }.m-dark .button a, .m-dark .button:hover, .m-dark .button { color: #707070 !important; }.m-dark #boardNavMobile {  background-color: #1D1F21;  border-bottom: 2px solid #282A2E; }body.m-dark { background: #1D1F21 none; color: #C5C8C6; }.m-dark #globalToggle {  background-color: #FFADAD;  background-image: url("//s.4cdn.org/image/buttonfade-red.png");  border: 1px solid #C45858;  color: #880000 !important;}.m-dark .boardTitle { color: #C5C8C6; }.m-dark .mobile-report { color: #81a2be !important; }.m-dark .mobile-report:after,.m-dark .mobile-report:before { color: #1d1f21 !important; }.m-dark hr, .m-dark div.board > hr { border-top: 1px solid #282A2E; }.m-dark div.opContainer,.m-dark div.reply { background-color: #282A2E; border: 1px solid #2D2F33 !important; }.m-dark .preview { background-color: #282A2E; border: 1px solid #333 !important; }.m-dark div.post div.postInfoM { background-color: #212326; border-bottom: 1px solid #2D2F33; }.m-dark div.postLink,.m-dark .backlink.mobile { background-color: #212326; border-top: 1px solid #2D2F33; }.m-dark div.post div.postInfoM span.dateTime,.m-dark div.postLink span.info,.m-dark div.post div.postInfoM span.dateTime a { color: #707070 !important; }.m-dark span.subject { color: #B294BB !important; }.m-dark .highlightPost:not(.op) { background: #3A171C !important; }.m-dark .reply:target, .m-dark .reply.highlight { background: #1D1D21 !important; padding: 2px; }.m-dark .reply:target, .m-dark .reply.highlight { background: #1D1D21 !important; padding: 2px; }}';
        document.head.appendChild(a)
    }
};
Main.init();