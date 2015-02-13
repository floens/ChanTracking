var Tip = {
    node: null,
    timeout: null,
    delay: 300,
    init: function() {
        document.addEventListener("mouseover", this.onMouseOver, !1);
        document.addEventListener("mouseout", this.onMouseOut, !1)
    },
    onMouseOver: function(a) {
        var b, c, d;
        d = a.target;
        Tip.timeout && (clearTimeout(Tip.timeout), Tip.timeout = null);
        d.hasAttribute("data-tip") && (c = null, d.hasAttribute("data-tip-cb") && (b = d.getAttribute("data-tip-cb"), window[b] && (c = window[b](d))), Tip.timeout = setTimeout(Tip.show, Tip.delay, a.target, c))
    },
    onMouseOut: function(a) {
        Tip.timeout && (clearTimeout(Tip.timeout), Tip.timeout = null);
        Tip.hide()
    },
    show: function(a, b, c) {
        var d, e;
        e = a.getBoundingClientRect();
        d = document.createElement("div");
        d.id = "tooltip";
        b ? d.innerHTML = b : d.textContent = a.getAttribute("data-tip");
        c || (c = "top");
        d.className = "tip-" + c;
        document.body.appendChild(d);
        b = e.left - (d.offsetWidth - a.offsetWidth) / 2;
        0 > b ? (b = e.left + 2, d.className += "-right") : b + d.offsetWidth > document.documentElement.clientWidth && (b = e.left - d.offsetWidth + a.offsetWidth + 2, d.className += "-left");
        e = e.top - d.offsetHeight - 5;
        a = d.style;
        a.top = e + window.pageYOffset + "px";
        a.left = b + window.pageXOffset + "px";
        Tip.node = d
    },
    hide: function() {
        Tip.node && (document.body.removeChild(Tip.node), Tip.node = null)
    }
};

function toggleArcSort() {
    var a, b, c, d, e;
    c = document.getElementById("arc-list").getElementsByTagName("tbody")[0];
    d = c.children;
    e = [];
    for (a = 0; b = d[a]; ++a) e.push([+b.children[3].textContent, b]);
    e.sort(function(a, b) {
        return b[0] - a[0]
    });
    c.style.display = "none";
    c.textContent = "";
    for (a = 0; b = e[a]; ++a) c.appendChild(b[1]);
    c.style.display = ""
}

function mShowFull(a) {
    var b, c;
    if ("name" === a.className) {
        if (b = a.parentNode.parentNode.parentNode.getElementsByClassName("name")[1]) c = b.innerHTML
    } else if ("subject" === a.parentNode.className) {
        if (b = a.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("subject")[1]) c = b.innerHTML
    } else /fileThumb/.test(a.parentNode.className) && (b = a.parentNode.parentNode.getElementsByClassName("fileText")[0]) && (b = b.firstElementChild, c = b.getAttribute("title") || b.innerHTML);
    return c
}

function loadBannerImage() {
    var a;
    !(a = document.getElementById("bannerCnt")) || 0 >= a.offsetWidth || (a.innerHTML = '<img alt="4chan" src="//s.4cdn.org/image/title/' + a.getAttribute("data-src") + '">')
}

function buildMobileNav(a) {
    var b, c, d, e, f;
    if (a = document.getElementById("boardSelectMobile")) {
        e = "";
        f = [];
        b = document.querySelectorAll("#boardNavDesktop .boardList > a");
        for (c = 0; d = b[c]; ++c) f.push(d);
        f.sort(function(a, b) {
            return a.textContent < b.textContent ? -1 : a.textContent > b.textContent ? 1 : 0
        });
        for (c = 0; d = f[c]; ++c) e += '<option value="' + d.textContent + '">/' + d.textContent + "/ - " + d.title + "</option>";
        a.innerHTML = e
    }
}

function cloneTopNav() {
    var a, b, c;
    if (a = document.getElementById("boardNavDesktop")) {
        b = document.getElementById("absbot");
        a = a.cloneNode(!0);
        a.id += "Foot";
        if (c = a.querySelector("#navtopright")) c.id = "navbotright";
        if (c = a.querySelector("#settingsWindowLink")) c.id += "Bot";
        document.body.insertBefore(a, b)
    }
}

function initPass() {
    "1" == get_cookie("pass_enabled") || get_cookie("extra_path") ? window.passEnabled = !0 : window.passEnabled = !1
}

function initBlotter() {
    var a, b;
    if (a = document.getElementById("toggleBlotter"))
        if (a.addEventListener("click", toggleBlotter, !1), b = localStorage.getItem("4chan-blotter")) a = +a.getAttribute("data-utc"), a <= +b && toggleBlotter()
}

function toggleBlotter(a) {
    var b;
    a && a.preventDefault();
    if (a = document.getElementById("blotter-msgs")) b = document.getElementById("toggleBlotter"), "none" == a.style.display ? (a.style.display = "", localStorage.removeItem("4chan-blotter"), b.textContent = "Hide", a = b.nextElementSibling, a.style.display && (a.style.display = "")) : (a.style.display = "none", localStorage.setItem("4chan-blotter", b.getAttribute("data-utc")), b.textContent = "Show Blotter", b.nextElementSibling.style.display = "none")
}

function onRecaptchaLoaded() {
    "table" == document.getElementById("postForm").style.display && initRecaptcha()
}

function initRecaptcha() {
    var a;
    (a = document.getElementById("g-recaptcha")) && !a.firstElementChild && !window.passEnabled && window.grecaptcha && grecaptcha.render(a, {
        sitekey: window.recaptchaKey,
        theme: "Tomorrow" === activeStyleSheet ? "dark" : "light"
    })
}

function initAnalytics() {
    (function(a, b, c, d, e, f, g) {
        a.GoogleAnalyticsObject = e;
        a[e] = a[e] || function() {
            (a[e].q = a[e].q || []).push(arguments)
        };
        a[e].l = 1 * new Date;
        f = b.createElement(c);
        g = b.getElementsByTagName(c)[0];
        f.async = 1;
        f.src = d;
        g.parentNode.insertBefore(f, g)
    })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
    ga("create", "UA-166538-1", "auto");
    ga("set", "anonymizeIp", !0);
    ga("send", "pageview")
}

function initAds(a, b) {
    var c = "http",
        d = "static";
    "https:" == document.location.protocol && (c += "s", d = "engine");
    var e = document.createElement("script");
    e.type = "text/javascript";
    e.async = !0;
    e.src = c + "://" + d + ".4chan-ads.org/ados.js";
    e.onload = function() {
        ados = ados || {};
        ados.run = ados.run || [];
        ados.run.push(function() {
            window._top_ad = ados_add_placement(3536, 18130, "azk91603", 4).setZone(16258);
            window._middle_ad = ados_add_placement(3536, 18130, "azk98887", 3).setZone(16259);
            window._bottom_ad = ados_add_placement(3536, 18130, "azk53379", 4).setZone(16260);
            ados_setDomain("engine.4chan-ads.org");
            ados_setKeywords(a + ", " + b);
            ados_setNoTrack();
            ados_load()
        })
    };
    c = document.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(e, c)
}

function applySearch(a) {
    a && a.preventDefault();
    a = document.getElementById("search-box").value;
    "" !== a && (window.location.href = "catalog#s=" + a)
}

function onKeyDownSearch(a) {
    13 == a.keyCode && applySearch()
}

function onReportClick(a) {
    var b, c, d;
    c = document.getElementsByTagName("input");
    d = location.pathname.split(/\//)[1];
    for (a = 0; b = c[a]; ++a)
        if ("checkbox" == b.type && b.checked && "delete" == b.value) return reppop("https://sys.4chan.org/" + d + "/" + ("f" != d ? "imgboard" : "up") + ".php?mode=report&no=" + b.name.replace(/[a-z]+/, ""))
}

function onStyleSheetChange(a) {
    setActiveStyleSheet(this.value)
}

function onPageSwitch(a) {
    a.preventDefault();
    window.location = this.action
}

function onMobileFormClick(a) {
    var b = 4 > location.pathname.split(/\//).length;
    a.preventDefault();
    "mpostform" == this.parentNode.id ? toggleMobilePostForm(b) : toggleMobilePostForm(b, 1)
}

function onMobileRefreshClick(a) {
    locationHashChanged(this)
}

function get_pass(a) {
    var b, c;
    if (a = get_cookie(a)) return a;
    a = "";
    for (b = 0; 32 > b; b++) c = Math.floor(62 * Math.random()), a += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".substring(c, c + 1);
    return "_" + a
}

function toggle(a) {
    a = document.getElementById(a);
    a.style.display = "block" != a.style.display ? "block" : "none"
}

function quote(a) {
    if (document.selection) document.post.com.focus(), document.selection.createRange().text = ">>" + a + "\n";
    else if (document.post.com.selectionStart || "0" == document.post.com.selectionStart) {
        var b = document.post.com.selectionEnd;
        document.post.com.value = document.post.com.value.substring(0, document.post.com.selectionStart) + ">>" + a + "\n" + document.post.com.value.substring(b, document.post.com.value.length)
    } else document.post.com.value += ">>" + a + "\n"
}

function repquote(a) {
    "" == document.post.com.value && quote(a)
}

function reppop(a) {
    var b = (new Date).getTime();
    window.open(a, b, "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=610,height=170");
    return !1
}

function recaptcha_load() {
    document.getElementById("recaptcha_div") && Recaptcha.create("6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc", "recaptcha_div", {
        theme: "clean"
    })
}

function onParsingDone(a) {
    var b, c, d, e;
    c = a.detail.threadId;
    if (b = a.detail.offset)
        for (c = document.getElementById("t" + c).getElementsByClassName("nameBlock"), a = a.detail.limit ? 2 * a.detail.limit : c.length, b = 2 * b + 1; b < a; b += 2)
            if (d = c[b].children[1]) currentHighlighted && -1 != d.className.indexOf("id_" + currentHighlighted) && (e = d.parentNode.parentNode.parentNode, e.className = "highlight " + e.className), d.addEventListener("click", idClick, !1)
}

function loadExtraScripts() {
    var a, b;
    b = readCookie("extra_path");
    if (!b || !/^[a-z0-9]+$/.test(b)) return !1;
    window.FC ? (a = document.createElement("script"), a.type = "text/javascript", a.src = "https://s.4cdn.org/js/" + b + "." + jsVersion + ".js", document.head.appendChild(a)) : document.write('<script type="text/javascript" src="https://s.4cdn.org/js/' + b + "." + jsVersion + '.js">\x3c/script>');
    return !0
}

function toggleMobilePostForm(a, b) {
    var c = document.getElementById("mpostform").firstElementChild,
        d = document.getElementById("postForm");
    c.className.match("hidden") ? (c.className = c.className.replace("hidden", "shown"), d.className = d.className.replace(" hideMobile", ""), c.innerHTML = "Close Post Form", initRecaptcha()) : (c.className = c.className.replace("shown", "hidden"), d.className += " hideMobile", c.innerHTML = a ? "Start New Thread" : "Post Reply");
    b && window.scroll(0, 0)
}

function toggleGlobalMessage(a) {
    var b;
    a && a.preventDefault();
    a = document.getElementById("globalToggle");
    b = document.getElementById("globalMessage");
    a.className.match("hidden") ? (a.className = a.className.replace("hidden", "shown"), b.className = b.className.replace(" hideMobile", ""), a.innerHTML = "Close Announcement") : (a.className = a.className.replace("shown", "hidden"), b.className += " hideMobile", a.innerHTML = "View Announcement")
}

function checkRecaptcha() {
    "undefined" != typeof RecaptchaState.timeout && 1800 == RecaptchaState.timeout && (RecaptchaState.timeout = 570, Recaptcha._reset_timer(), clearInterval(captchainterval))
}

function setPassMsg() {
    var a;
    if (a = document.getElementById("captchaFormPart")) a.children[1].innerHTML = '<div style="padding: 5px;">You are using a 4chan Pass. [<a href="https://sys.4chan.org/auth?act=logout" onclick="confirmPassLogout(event);" tabindex="-1">Logout</a>]</div>'
}

function confirmPassLogout(a) {
    if (!confirm("Are you sure you want to logout?")) return a.preventDefault(), !1
}
var activeStyleSheet;

function initStyleSheet() {
    var a, b, c, d;
    if (!window.FC) {
        "undefined" != typeof style_group && style_group && (activeStyleSheet = (a = readCookie(style_group)) ? a : getPreferredStyleSheet());
        switch (activeStyleSheet) {
            case "Yotsuba B":
                setActiveStyleSheet("Yotsuba B New", !0);
                break;
            case "Yotsuba":
                setActiveStyleSheet("Yotsuba New", !0);
                break;
            case "Burichan":
                setActiveStyleSheet("Burichan New", !0);
                break;
            case "Futaba":
                setActiveStyleSheet("Futaba New", !0);
                break;
            default:
                setActiveStyleSheet(activeStyleSheet, !0)
        }
        if ("true" == localStorage.getItem("4chan_never_show_mobile"))
            for (c = document.querySelectorAll("link"), d = c.length, a = 0; a < d; a++) c[a].getAttribute("href").match("mobile") && (b = c[a]).parentNode.removeChild(b)
    }
}
captchainterval = null;

function init() {
    var a, b = "undefined" != typeof is_error,
        c = location.href.match(/4chan\.org\/(\w+)/)[1];
    a = location.href.split(/#/);
    a[1] && a[1].match(/q[0-9]+$/) && repquote(a[1].match(/q([0-9]+)$/)[1]);
    if ("undefined" != typeof jsMath && "undefined" != typeof jsMath.Easy.onload && !jsMath.Easy.loaded) jsMath.Easy.onload();
    if (navigator.userAgent && navigator.userAgent.match(/iP(hone|ad|od)/i))
        for (links = document.querySelectorAll("s"), len = links.length, a = 0; a < len; a++) links[a].onclick = function() {
            this.hasAttribute("style") ? this.removeAttribute("style") : this.setAttribute("style", "color: #fff!important;")
        };
    if (document.getElementById("styleSelector"))
        for (styleSelect = document.getElementById("styleSelector"), len = styleSelect.options.length, a = 0; a < len; a++) styleSelect.options[a].value == activeStyleSheet && (styleSelect.selectedIndex = a);
    !b && document.forms.post && ((a = document.getElementById("delPassword")) && (a.value = get_pass("4chan_pass")), "i" != c && "ic" != c && "f" != c && window.File && window.FileReader && window.FileList && window.Blob && document.getElementById("postFile").addEventListener("change", handleFileSelect, !1));
    "undefined" != typeof extra && extra && !b && extra.init();
    window.check_for_block && checkForBlock()
}
var coreLenCheckTimeout = null;

function onComKeyDown() {
    clearTimeout(coreLenCheckTimeout);
    coreLenCheckTimeout = setTimeout(coreCheckComLength, 500)
}

function coreCheckComLength() {
    var a, b, c;
    comlen && (b = document.getElementsByName("com")[0], a = encodeURIComponent(b.value).split(/%..|./).length - 1, a > comlen ? ((c = document.getElementById("comlenError")) || (c = document.createElement("div"), c.id = "comlenError", c.style.cssText = "font-weight:bold;padding:5px;color:red;", b.parentNode.appendChild(c)), c.textContent = "Error: Comment too long (" + a + "/" + comlen + ").") : (c = document.getElementById("comlenError")) && c.parentNode.removeChild(c))
}

function disableMobile() {
    localStorage.setItem("4chan_never_show_mobile", "true");
    location.reload(!0)
}

function enableMobile() {
    localStorage.removeItem("4chan_never_show_mobile");
    location.reload(!0)
}

function checkForBlock() {
    var a, b, c, d, e, f;
    if (!/Mobile|Android|Dolfin|Opera Mobi|PlayStation Vita|Nintendo DS/.test(navigator.userAgent) && 1 != readCookie("pass_enabled"))
        for (d = document.getElementsByClassName("ad-cnt"), a = 0; b = d[a]; ++a) 0 == b.offsetHeight && (c = document.createElement("div"), c.className = "center", c.innerHTML = '<div style="display:table-cell;vertical-align:middle">' + blockPlea + "</div>", e = c.style, /middlead/.test(b.className) ? (e.width = "448px", e.height = "60px", e.padding = "0 10px") : (e.width = "728px", e.height = "90px"), e.display = "table", f = "1px solid ", f = "Yotsuba B New" == activeStyleSheet ? f + "#34345c" : "Yotsuba New" == activeStyleSheet ? f + "#800" : f + "#000", e.border = f, b.parentNode.insertBefore(c, b))
}
var currentHighlighted = null;

function enableClickableIds() {
    var a = 0,
        b = 0,
        c = document.getElementsByClassName("posteruid"),
        d = document.getElementsByClassName("capcode");
    if (null != d)
        for (a = 0, b = d.length; a < b; a++) d[a].addEventListener("click", idClick, !1);
    if (null != c)
        for (a = 0, b = c.length; a < b; a++) c[a].addEventListener("click", idClick, !1)
}

function idClick(a) {
    var b = 0,
        c = 0;
    a = "hand" == a.target.className ? a.target.parentNode.className.match(/id_([^ $]+)/)[1] : a.target.className.match(/id_([^ $]+)/)[1];
    for (var d = document.getElementsByClassName("highlight"), c = d.length, b = 0; b < c; b++) d[0].className = d[0].className.toString().replace(/highlight /g, "");
    if (currentHighlighted == a) currentHighlighted = null;
    else
        for (currentHighlighted = a, d = document.getElementsByClassName("id_" + a), c = d.length, b = 0; b < c; b++) a = d[b].parentNode.parentNode.parentNode, a.className.match(/highlight /) || (a.className = "highlight " + a.className)
}

function showPostFormError(a) {
    var b = document.getElementById("postFormError");
    a ? (b.innerHTML = a, b.style.display = "block") : (b.textContent = "", b.style.display = "")
}

function handleFileSelect() {
    var a, b;
    this.files && (b = window.maxFilesize, a = this.files[0].size, "video/webm" == this.files[0].type && window.maxWebmFilesize && (b = window.maxWebmFilesize), a > b ? showPostFormError("Error: Maximum file size allowed is " + Math.floor(b / 1048576) + " MB") : showPostFormError())
}

function locationHashChanged(a) {
    var b = document.getElementById("id_css");
    switch (a.id) {
        case "refresh_top":
            url = window.location.href.replace(/#.+/, "#top");
            /top$/.test(url) || (url += "#top");
            b.innerHTML = '<meta http-equiv="refresh" content="0;URL=' + url + '">';
            document.location.reload(!0);
            break;
        case "refresh_bottom":
            url = window.location.href.replace(/#.+/, "#bottom"), /bottom$/.test(url) || (url += "#bottom"), b.innerHTML = '<meta http-equiv="refresh" content="0;URL=' + url + '">', document.location.reload(!0)
    }
    return !0
}

function setActiveStyleSheet(a, b) {
    var c, d, e, f, g;
    if (1 != document.querySelectorAll("link[title]").length) {
        e = "";
        g = document.getElementsByTagName("link");
        for (f = 0; c = g[f]; f++) "switch" == c.getAttribute("title") && (d = c), -1 != c.getAttribute("rel").indexOf("style") && c.getAttribute("title") && c.getAttribute("title") == a && (e = c.href);
        d.setAttribute("href", e);
        b || createCookie(style_group, a, 365, "4chan.org")
    }
}

function getActiveStyleSheet() {
    var a, b, c;
    if (1 == document.querySelectorAll("link[title]").length) return "Yotsuba P";
    for (a = 0; b = document.getElementsByTagName("link")[a]; a++)
        if ("switch" == b.getAttribute("title")) c = b;
        else if (-1 != b.getAttribute("rel").indexOf("style") && b.getAttribute("title") && b.href == c.href) return b.getAttribute("title");
    return null
}

function getPreferredStyleSheet() {
    return "ws_style" == style_group ? "Yotsuba B New" : "Yotsuba New"
}

function createCookie(a, b, c, d) {
    if (c) {
        var e = new Date;
        e.setTime(e.getTime() + 864E5 * c);
        c = "; expires=" + e.toGMTString()
    } else c = "";
    document.cookie = a + "=" + b + c + "; path=/" + (d ? "; domain=" + d : "")
}

function readCookie(a) {
    a += "=";
    for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
        for (var d = b[c];
            " " == d.charAt(0);) d = d.substring(1, d.length);
        if (0 == d.indexOf(a)) return decodeURIComponent(d.substring(a.length, d.length))
    }
    return ""
}
var get_cookie = readCookie;

function setRetinaIcons() {
    var a, b, c;
    c = document.getElementsByClassName("retina");
    for (a = 0; b = c[a]; ++a) b.src = b.src.replace(/\.(gif|png)$/, "@2x.$1")
}

function onCoreClick(a) {
    /flag flag-/.test(a.target.className) && 1 == a.which && window.open("//s.4cdn.org/image/country/" + a.target.className.match(/flag-([a-z]+)/)[1] + ".gif", "")
}

function showPostForm(a) {
    a && a.preventDefault();
    if (a = document.getElementById("postForm")) $.id("togglePostFormLink").style.display = "none", a.style.display = "table", initRecaptcha()
}
var PainterCore = {
    init: function() {
        var a;
        document.forms.post && (a = document.forms.post.getElementsByClassName("painter-ctrl")[0]) && (a = a.getElementsByTagName("button"), a[1] && (this.data = null, this.btnDraw = a[0], this.btnClear = a[1], this.btnFile = document.getElementById("postFile"), this.btnSubmit = document.forms.post.querySelector('input[type="submit"]'), a[0].addEventListener("click", this.onDrawClick, !1), a[1].addEventListener("click", this.onCancel, !1)))
    },
    onDrawClick: function() {
        var a, b;
        b = this.parentNode.getElementsByTagName("input");
        a = +b[0].value;
        b = +b[1].value;
        1 > a || 1 > b || Tegaki.open({
            onDone: PainterCore.onDone,
            onCancel: PainterCore.onCancel,
            width: a,
            height: b
        })
    },
    b64toBlob: function(a) {
        var b, c, d;
        b = atob(a);
        d = b.length;
        c = Array(d);
        for (a = 0; a < d; ++a) c[a] = b.charCodeAt(a);
        a = new Uint8Array(c);
        return new Blob([a])
    },
    onDone: function() {
        PainterCore.btnFile.disabled = !0;
        PainterCore.btnClear.disabled = !1;
        PainterCore.data = Tegaki.flatten().toDataURL("image/png");
        document.forms.post.addEventListener("submit", PainterCore.onSubmit, !1)
    },
    onCancel: function() {
        PainterCore.data = null;
        PainterCore.btnFile.disabled = !1;
        PainterCore.btnClear.disabled = !0;
        document.forms.post.removeEventListener("submit", PainterCore.onSubmit, !1)
    },
    onSubmit: function(a) {
        var b;
        a.preventDefault();
        a = new FormData(this);
        (b = PainterCore.b64toBlob(PainterCore.data.slice(PainterCore.data.indexOf(",") + 1))) && a.append("upfile", b, "tegaki.png");
        b = new XMLHttpRequest;
        b.open("POST", this.action, !0);
        b.withCredentials = !0;
        b.onerror = PainterCore.onSubmitError;
        b.onload = PainterCore.onSubmitDone;
        b.send(a);
        PainterCore.btnSubmit.disabled = !0
    },
    onSubmitError: function() {
        PainterCore.btnSubmit.disabled = !1;
        showPostFormError("Connection Error.")
    },
    onSubmitDone: function() {
        var a, b, c;
        PainterCore.btnSubmit.disabled = !1;
        (b = this.responseText.match(/\x3c!-- thread:([0-9]+),no:([0-9]+) --\x3e/)) ? (a = +b[1], b = +b[2], a || (a = b), c = location.pathname.split(/\//)[1], window.location.href = "/" + c + "/thread/" + a + "#p" + b, PainterCore.onCancel(), a != b && (PainterCore.btnClear.disabled = !0, window.location.reload())) : (a = this.responseText.match(/"errmsg"[^>]*>(.*?)<\/span/)) && showPostFormError(a[1])
    }
};

function contentLoaded() {
    var a, b, c, d, e;
    document.removeEventListener("DOMContentLoaded", contentLoaded, !0);
    cloneTopNav();
    initAnalytics();
    d = location.pathname.split(/\//);
    e = d[1];
    "archive" == d[2] && document.getElementById("arc-sort").addEventListener("click", toggleArcSort, !1);
    window.passEnabled && setPassMsg();
    window.Tegaki && PainterCore.init();
    (b = document.getElementById("bottomReportBtn")) && b.addEventListener("click", onReportClick, !1);
    (b = document.getElementById("styleSelector")) && b.addEventListener("change", onStyleSheetChange, !1);
    if (b = document.getElementById("togglePostFormLink"))(b = b.firstElementChild) && b.addEventListener("click", showPostForm, !1), "#reply" === location.hash && showPostForm();
    (b = document.forms.post) && b.flag && (c = readCookie("4chan_flag")) && (a = b.querySelector('option[value="' + c + '"]')) && a.setAttribute("selected", "selected");
    buildMobileNav(e);
    (b = document.getElementById("globalToggle")) && b.addEventListener("click", toggleGlobalMessage, !1);
    "true" == localStorage.getItem("4chan_never_show_mobile") && (b = document.getElementById("disable-mobile")) && (b.style.display = "none", b = document.getElementById("enable-mobile"), b.parentNode.style.cssText = "display: inline !important;");
    if (c = document.getElementById("boardSelectMobile")) {
        b = c.options.length;
        for (a = 0; a < b; a++) c.options[a].value == e && (c.selectedIndex = a);
        c.onchange = function() {
            window.location = "//boards.4chan.org/" + this.options[this.selectedIndex].value + "/"
        }
    }
    if ("catalog" != d[2]) {
        c = document.getElementsByClassName("mobilePostFormToggle");
        for (a = 0; b = c[a]; ++a) b.addEventListener("click", onMobileFormClick, !1);
        if (b = document.getElementsByName("com")[0]) b.addEventListener("keydown", onComKeyDown, !1), b.addEventListener("paste", onComKeyDown, !1), b.addEventListener("cut", onComKeyDown, !1);
        (b = document.getElementById("refresh_top")) && b.addEventListener("mouseup", onMobileRefreshClick, !1);
        (b = document.getElementById("refresh_bottom")) && b.addEventListener("mouseup", onMobileRefreshClick, !1);
        if ("int" == e || "sp" == e || "pol" == e) b = document.getElementById("delform"), b.addEventListener("click", onCoreClick, !1);
        if (!d[3]) {
            c = document.getElementsByClassName("pageSwitcherForm");
            for (a = 0; b = c[a]; ++a) b.addEventListener("submit", onPageSwitch, !1);
            (b = document.getElementById("search-box")) && b.addEventListener("keydown", onKeyDownSearch, !1)
        }
        window.clickable_ids && enableClickableIds();
        Tip.init()
    }
    2 <= window.devicePixelRatio && setRetinaIcons();
    initBlotter();
    loadBannerImage()
}
initPass();
window.onload = init;
window.clickable_ids && document.addEventListener("4chanParsingDone", onParsingDone, !1);
document.addEventListener("4chanMainInit", loadExtraScripts, !1);
document.addEventListener("DOMContentLoaded", contentLoaded, !0);
initStyleSheet();