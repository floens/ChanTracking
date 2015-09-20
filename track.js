(function() {
'use strict';

var request = require('request');
var jsBeautify = require('js-beautify');
var prettyCss = require('PrettyCSS');
var fs = require('fs');
var htmlBeautify = require('html');
var cheerio = require('cheerio');
var FileCookieStore = require('tough-cookie-filestore');

try {
    fs.statSync('cookies.json');
} catch(e) {
    fs.writeFileSync('cookies.json', '');
}

var cookieJar = request.jar(new FileCookieStore('cookies.json'));

var state = {};

var log = function(e) {
    console.log(e);
}

var error = function(e) {
    console.error(e);
    console.trace();
}

var loadState = function() {
    try {
        var fileState = fs.readFileSync('state.json');
        if (fileState) {
            state = JSON.parse(fileState);
        }
    } catch(e) {
        error(e);
    }
}

var saveState = function() {
    fs.writeFileSync('state.json', JSON.stringify(state));
}

var get = function(url, callback) {
    log('Getting ' + url);
    request({
        url: url,
        jar: cookieJar
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            log('Got ' + url);
            callback(body);
        } else {
            error('Error loading ' + url + ': ' + error);
        }
    });
}

var loadJsonAndBeautify = function(url, name) {
    get(url, function(body) {
        log('Beautifying ' + name);
        var nice = jsBeautify.js_beautify(body, { "preserve_newlines": false });

        fs.writeFileSync(name, nice);
    });
}

var loadCssAndBeautify = function(url, name) {
    get(url, function(body) {
        log('Beautifying ' + name + '.css');
        var nice = prettyCss.parse(body);

        fs.writeFileSync('css/' + name + '.css', nice);
    });
}

var loadFile = function(url, name) {
    get(url, function(body) {
        fs.writeFileSync(name, body);
    });
}

var load = function() {
    loadState();

    get('https://boards.4chan.org/g/', function(body) {
        var dom = cheerio.load(body);
        var sticky = dom('#t39894014');
        var stickyHtml = sticky.html();
        // Force 0
        stickyHtml = stickyHtml.replace(/\d.t.4cdn.org/gi, '0.t.4cdn.org');
        fs.writeFileSync('html/post.html', htmlBeautify.prettyPrint(stickyHtml));

        var newThread = dom('form[name=post]');
        fs.writeFileSync('html/form_thread.html', htmlBeautify.prettyPrint(newThread.html()));
    });

    loadJsonAndBeautify('https://a.4cdn.org/boards.json', 'api/boards.json');

    loadFile('https://www.4chan.org/faq', 'pages/faq.html');
    loadFile('https://www.4chan.org/rules', 'pages/rules.html');
    loadFile('https://www.4chan.org/news', 'pages/news.html');
    loadFile('https://www.4chan.org/blotter', 'pages/blotter.html');
    loadFile('https://www.4chan.org/legal', 'pages/legal.html');
    loadFile('https://www.4chan.org/security', 'pages/security.html');
    loadFile('https://www.4chan.org/feedback', 'pages/feedback');

    loadFile('https://s.4cdn.org/js/core.1.js', 'javascripts/core.js');
    loadFile('https://s.4cdn.org/js/extension.1.js', 'javascripts/extension.js');

    loadCssAndBeautify('https://s.4cdn.org/css/yotsubluenew.css', 'yotsubluenew');
    loadCssAndBeautify('https://s.4cdn.org/css/yotsubanew.css', 'yotsubanew');
    loadCssAndBeautify('https://s.4cdn.org/css/futabanew.css', 'futubanew');
    loadCssAndBeautify('https://s.4cdn.org/css/burichannew.css', 'burichannew');
    loadCssAndBeautify('https://s.4cdn.org/css/photon.css', 'photon');
    loadCssAndBeautify('https://s.4cdn.org/css/tomorrow.css', 'tomorrow');
    loadCssAndBeautify('https://s.4cdn.org/css/yotsubluemobile.css', 'yotsubluemobile');
    loadCssAndBeautify('https://s.4cdn.org/css/yui.css', 'yui');
    loadCssAndBeautify('https://s.4cdn.org/css/janichan.css', 'janichan');
}

load();

})();
