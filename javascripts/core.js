var Tip = {
    node: null,
    timeout: null,
    delay: 300,
    init: function() {
        document.addEventListener("mouseover", this.onMouseOver, !1);
        document.addEventListener("mouseout", this.onMouseOut, !1)
    },
    onMouseOver: function(a) {
        Tip.timeout && (clearTimeout(Tip.timeout), Tip.timeout = null);
        a.target.hasAttribute("data-tip") && (Tip.timeout = setTimeout(Tip.show, Tip.delay, a.target))
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

function initRecaptcha() {
    var a;
    window.passEnabled || (a = document.forms.post, a.com.addEventListener("focus", loadRecaptcha, !1), a.upfile && a.upfile.addEventListener("change", loadRecaptcha, !1))
}

function loadRecaptcha() {
    var a;
    document.getElementById("recaptcha_area") || ((a = document.getElementById("captchaContainer")) && a.textContent && a.setAttribute("data-placeholder", a.textContent), Recaptcha.create(window.recaptchaKey, "captchaContainer" + window.recaptchaId, {
        theme: "clean",
        tabindex: 5,
        callback: onCaptchaReady
    }))
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
    var a = readCookie("extra_path");
    if (!a || !/^[a-z0-9]+$/.test(a)) return !1;
    document.write('<script type="text/javascript" src="https://s.4cdn.org/js/' + a + "." + jsVersion + '.js">\x3c/script>');
    return !0
}

function toggleMobilePostForm(a, b) {
    elem = document.getElementById("mpostform").firstElementChild;
    postForm = document.getElementById("postForm");
    elem.className.match("hidden") ? (elem.className = elem.className.replace("hidden", "shown"), postForm.className = postForm.className.replace(" hideMobile", ""), elem.innerHTML = "Close Post Form") : (elem.className = elem.className.replace("shown", "hidden"), postForm.className += " hideMobile", elem.innerHTML = a ? "Start New Thread" : "Post Reply");
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
captchainterval = null;

function init() {
    var a = "undefined" != typeof is_error,
        b = location.href.match(/4chan\.org\/(\w+)/)[1],
        c = location.href.split(/#/);
    c[1] && c[1].match(/q[0-9]+$/) && repquote(c[1].match(/q([0-9]+)$/)[1]);
    if ("undefined" != typeof jsMath && "undefined" != typeof jsMath.Easy.onload && !jsMath.Easy.loaded) jsMath.Easy.onload();
    if (navigator.userAgent && navigator.userAgent.match(/iP(hone|ad|od)/i))
        for (links = document.querySelectorAll("s"), len = links.length, c = 0; c < len; c++) links[c].onclick = function() {
            this.hasAttribute("style") ? this.removeAttribute("style") : this.setAttribute("style", "color: #fff!important;")
        };
    if (document.getElementById("styleSelector"))
        for (styleSelect = document.getElementById("styleSelector"), len = styleSelect.options.length, c = 0; c < len; c++) styleSelect.options[c].value == activeStyleSheet && (styleSelect.selectedIndex = c);
    a || (document.getElementById("delPassword").value = get_pass("4chan_pass"));
    "i" == b || "ic" == b || "f" == b || a || window.File && window.FileReader && window.FileList && window.Blob && document.getElementById("postFile").addEventListener("change", handleFileSelect, !1);
    "undefined" != typeof extra && extra && !a && extra.init();
    check_for_block && checkForBlock()
}

function onCaptchaClick(a) {
    document.getElementById("qrCaptcha") ? QR.reloadCaptcha() : Recaptcha.reload("t")
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

function onCaptchaReady() {
    var a;
    if (a = document.getElementById("recaptcha_image")) a.title = "Reload", a.addEventListener("click", onCaptchaClick, !1), a = document.getElementsByClassName("recaptcha_image_cell")[0], a.style.cssText = "padding: 0 0 3px !important", a = document.getElementById("recaptcha_image"), a.style.cssText = "border: 1px solid #aaa !important", a = document.getElementById("recaptcha_response_field"), a.setAttribute("placeholder", "Type the text (Required)"), a.setAttribute("spellcheck", "false"), a.setAttribute("autocorrect", "off"), a.setAttribute("autocapitalize", "off"), a.removeAttribute("style"), window.captchaReady = !0, window.QR && QR.onCaptchaReady()
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
    var a, b, c, d;
    if (!/Mobile|Android|Dolfin|Opera Mobi|PlayStation Vita|Nintendo DS/.test(navigator.userAgent) && 1 != readCookie("pass_enabled"))
        for (d = document.getElementsByClassName("ad-cnt"), a = 0; b = d[a]; ++a) 0 == b.offsetHeight && (c = document.createElement("div"), c.className = "center", c.innerHTML = blockPlea, b.parentNode.insertBefore(c, b))
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

function handleFileSelect() {
    var a, b, c;
    this.files && (c = window.maxFilesize, a = document.getElementById("fileError"), b = this.files[0].size, "video/webm" == this.files[0].type && window.maxWebmFilesize && (c = window.maxWebmFilesize), a.textContent = b > c ? "Error: Maximum file size allowed is " + Math.floor(c / 1048576) + " MB" : "")
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
    if (1 != document.querySelectorAll("link[title]").length) {
        for (var c, d, e = "", f = 0; c = document.getElementsByTagName("link")[f]; f++) "switch" == c.getAttribute("title") && (d = c), -1 != c.getAttribute("rel").indexOf("style") && c.getAttribute("title") && c.getAttribute("title") == a && (e = c.href);
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

function onPostSubmit(a) {
    var b, c;
    b = (b = document.forms.post.upfile) && b.value && b.files ? b.files[0].size || 0 : 0;
    c = window.Main && Main.hasMobileLayout ? 0 : 204800;
    if (!a.shiftKey && b > c) try {
        submitPreupload(), a.preventDefault()
    } catch (d) {}
}

function submitDirect() {
    var a = document.forms.post;
    a.removeEventListener("submit", onPostSubmit, !1);
    a.submit()
}

function submitPreupload() {
    var a, b, c, d, e;
    (b = document.getElementById("captchaToken")) && b.parentNode.removeChild(b);
    a = document.getElementById("recaptcha_challenge_field");
    c = document.getElementById("recaptcha_response_field");
    e = document.getElementById("fileError");
    c && "" != c.value ? (d = new FormData, d.append("mode", "checkcaptcha"), d.append("challenge", a.value), d.append("response", c.value), a = new XMLHttpRequest, a.open("POST", document.forms.post.action, !0), a.onerror = function() {
        submitDirect()
    }, a.onload = function() {
        var a;
        try {
            a = JSON.parse(this.responseText)
        } catch (c) {
            console.log("Couldn't verify captcha.");
            submitDirect();
            return
        }
        a.token ? (b = document.createElement("input"), b.name = "captcha_token", b.id = "captchaToken", b.type = "hidden", b.value = a.token, document.forms.post.appendChild(b), submitDirect()) : a.error ? (onCaptchaClick(), e.innerHTML = a.error) : (a.fail && console.log(a.fail), submitDirect())
    }, a.send(d)) : (e.textContent = "You forgot to type in the CAPTCHA.", c && c.focus())
}

function showPostForm(a) {
    a.preventDefault();
    if (a = document.getElementById("postForm")) this.parentNode.style.display = "none", a.style.display = "table"
}

function contentLoaded() {
    var a, b, c, d, e;
    document.removeEventListener("DOMContentLoaded", contentLoaded, !0);
    initAnalytics();
    c = location.pathname.split(/\//);
    d = c[1];
    window.passEnabled && setPassMsg();
    (b = document.getElementById("bottomReportBtn")) && b.addEventListener("click", onReportClick, !1);
    (b = document.getElementById("styleSelector")) && b.addEventListener("change", onStyleSheetChange, !1);
    (b = document.getElementById("togglePostFormLink")) && (b = b.firstElementChild) && b.addEventListener("click", showPostForm, !1);
    if ("int" == d || "sp" == d) b = document.getElementById("delform"), b.addEventListener("click", onCoreClick, !1);
    !window.passEnabled && window.preupload_captcha && "FormData" in window && (b = document.forms.post) && b.addEventListener("submit", onPostSubmit, !1);
    (b = document.forms.post) && b.flag && (e = readCookie("4chan_flag")) && (a = b.querySelector('option[value="' + e + '"]')) && a.setAttribute("selected", "selected");
    if (!c[3]) {
        c = document.getElementsByClassName("pageSwitcherForm");
        for (a = 0; b = c[a]; ++a) b.addEventListener("submit", onPageSwitch, !1);
        (b = document.getElementById("search-box")) && b.addEventListener("keydown", onKeyDownSearch, !1)
    }
    buildMobileNav(d);
    c = document.getElementsByClassName("mobilePostFormToggle");
    for (a = 0; b = c[a]; ++a) b.addEventListener("click", onMobileFormClick, !1);
    if (b = document.getElementsByName("com")[0]) b.addEventListener("keydown", onComKeyDown, !1), b.addEventListener("paste", onComKeyDown, !1), b.addEventListener("cut", onComKeyDown, !1);
    (b = document.getElementById("refresh_top")) && b.addEventListener("mouseup", onMobileRefreshClick, !1);
    (b = document.getElementById("refresh_bottom")) && b.addEventListener("mouseup", onMobileRefreshClick, !1);
    (b = document.getElementById("globalToggle")) && b.addEventListener("click", toggleGlobalMessage, !1);
    "true" == localStorage.getItem("4chan_never_show_mobile") && (b = document.getElementById("disable-mobile")) && (b.style.display = "none", b = document.getElementById("enable-mobile"), b.parentNode.style.cssText = "display: inline !important;");
    if (c = document.getElementById("boardSelectMobile")) {
        b = c.options.length;
        for (a = 0; a < b; a++) c.options[a].value == d && (c.selectedIndex = a);
        c.onchange = function() {
            window.location = "//boards.4chan.org/" + this.options[this.selectedIndex].value + "/"
        }
    }
    clickable_ids && enableClickableIds();
    2 <= window.devicePixelRatio && setRetinaIcons();
    Tip.init();
    initBlotter();
    loadBannerImage()
}
initPass();
window.onload = init;
clickable_ids && document.addEventListener("4chanParsingDone", onParsingDone, !1);
document.addEventListener("4chanMainInit", loadExtraScripts, !1);
document.addEventListener("DOMContentLoaded", contentLoaded, !0);
initStyleSheet();