(function() {
'use strict';

var request = require('request');
var jsBeautify = require('js-beautify');
var prettyCss = require('PrettyCSS');
var fs = require('fs');
var htmlBeautify = require('html');
var cheerio = require('cheerio');
var FileCookieStore = require('tough-cookie-filestore');
var winston = require('winston');

winston.add(winston.transports.File, {
    filename: 'track.log',
    maxsize: 1024 * 1024,
    maxFiles: 1
});

try {
    fs.statSync('cookies.json');
} catch(e) {
    fs.writeFileSync('cookies.json', '');
}

var cookieJar = request.jar(new FileCookieStore('cookies.json'));

var state = {};

var inArray = function(a, n) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === n) {
            return true;
        }
    }
    return false;
}

var log = function(e) {
    winston.log('info', e);
}

var logError = function(e) {
    winston.error(e);
    console.trace();
    fs.writeFileSync('error', 'An error occurred with the script, please check the console.');
}

var loadState = function() {
    try {
        var fileState = fs.readFileSync('state.json');
        if (fileState) {
            state = JSON.parse(fileState);
        }
    } catch(e) {
        logError(e);
    }
}

var saveState = function() {
    fs.writeFileSync('state.json', JSON.stringify(state));
}

var get = function(url, callback, goodCodes) {
    var goodCodes = goodCodes === undefined ? [200] : goodCodes;

    log('Getting ' + url);
    request({
        url: url,
        jar: cookieJar,
        headers: {
            'User-Agent': 'curl'
        }
    }, function(error, response, body) {
        if (error) {
            winston.error(error);
        } else {
            if (inArray(goodCodes, response.statusCode)) {
                log('Got ' + url);
                callback(body);
            } else if ((response.statusCode >= 500 && response.statusCode < 600) || response.statusCode == 409) {
                // Server error / overloaded, ignore
                log('Got ' + response.statusCode + ' getting ' + url);
            } else {
                logError('Error loading ' + url + ' (' + response.statusCode + '): ' + error);
            }
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

var loadFile = function(url, name, goodCodes) {
    get(url, function(body) {
        fs.writeFileSync(name, body);
    }, goodCodes);
}

var load = function() {
    try {
        fs.unlinkSync('error');
    } catch (e) {};

    loadState();

    var now = Date.now();

    get('https://boards.4chan.org/g/', function(body) {
        var dom = cheerio.load(body);
        var sticky = dom('#t51971506');
        var stickyHtml = sticky.html();
        // Force 0
        stickyHtml = stickyHtml.replace(/\d.t.4cdn.org/gi, '0.t.4cdn.org');
        fs.writeFileSync('html/post.html', htmlBeautify.prettyPrint(stickyHtml));

        var newThread = dom('form[name=post]');
        fs.writeFileSync('html/form_thread.html', htmlBeautify.prettyPrint(newThread.html()));

        var globalMessage = dom('div.globalMessage').html();
        fs.writeFileSync('html/global_message.html', globalMessage === null ? 'No global message' : htmlBeautify.prettyPrint(globalMessage));
    });

    loadJsonAndBeautify('https://a.4cdn.org/boards.json', 'api/boards.json');

    get('https://www.4chan.org/', function(body) {
        body = body.replace(/<b>Total Posts:.+?<\/div>/gi, 'Total Posts snip');
        body = body.replace(/<b>Current Users:.+?<\/div>/gi, 'Current Users snip');
        body = body.replace(/<b>Active Content:.+?<\/div>/gi, 'Active Content snip');

        body = body.replace(/<div id="c-threads">[\s\S]+<div class="box-outer top-box" id="site-stats">/gi,
            'Popular Threads snip\n<div class="box-outer top-box" id="site-stats">')

        fs.writeFileSync('pages/home.html', body);
    });

    get('https://www.4chan.org/pass', function(body) {
        body = body.replace(/var temp_id = '[\w]+'/gi, 'var temp_id = \'snip\'');
        body = body.replace(/'temp_id', '[\w]+'/gi, '\'temp_id\', \'snip\'');

        fs.writeFileSync('pages/pass.html', body);
    });


    loadFile('https://www.4chan.org/faq', 'pages/faq.html');
    loadFile('https://www.4chan.org/rules', 'pages/rules.html');
    loadFile('https://www.4chan.org/news', 'pages/news.html');
    loadFile('https://www.4chan.org/blotter', 'pages/blotter.html');
    loadFile('https://www.4chan.org/legal', 'pages/legal.html');
    loadFile('https://www.4chan.org/security', 'pages/security.html');
    loadFile('https://www.4chan.org/feedback', 'pages/feedback.html');
    loadFile('https://www.4chan.org/advertise', 'pages/advertise.html');
    loadFile('https://www.4chan.org/press', 'pages/press.html');
    loadFile('https://www.4chan.org/contact', 'pages/contact.html');
    loadFile('https://www.4chan.org/flash', 'pages/flash.html');
    loadFile('https://www.4chan.org/404foobar', 'pages/404.html', [404]);
    loadFile('https://www.4chan.org/robots.txt', 'pages/robots.txt');
    loadFile('https://www.4chan.org/sitemap.xml', 'pages/sitemap.xml');

    loadFile('https://s.4cdn.org/js/core.' + now + '.js', 'javascripts/core.js');
    loadFile('https://s.4cdn.org/js/extension.' + now + '.js', 'javascripts/extension.js');
    loadFile('https://s.4cdn.org/js/catalog.' + now + '.js', 'javascripts/catalog.js');
    loadFile('https://s.4cdn.org/js/bans.' + now + '.js', 'javascripts/bans.js');
    loadFile('https://s.4cdn.org/js/frontpage.' + now + '.js', 'javascripts/frontpage.js');

    loadCssAndBeautify('https://s.4cdn.org/css/yotsubluenew.' + now + '.css', 'yotsubluenew');
    loadCssAndBeautify('https://s.4cdn.org/css/yotsubanew.' + now + '.css', 'yotsubanew');
    loadCssAndBeautify('https://s.4cdn.org/css/futabanew.' + now + '.css', 'futubanew');
    loadCssAndBeautify('https://s.4cdn.org/css/burichannew.' + now + '.css', 'burichannew');
    loadCssAndBeautify('https://s.4cdn.org/css/photon.' + now + '.css', 'photon');
    loadCssAndBeautify('https://s.4cdn.org/css/tomorrow.' + now + '.css', 'tomorrow');
    loadCssAndBeautify('https://s.4cdn.org/css/yotsubluemobile.' + now + '.css', 'yotsubluemobile');
    loadCssAndBeautify('https://s.4cdn.org/css/yui.' + now + '.css', 'yui');
    loadCssAndBeautify('https://s.4cdn.org/css/janichan.' + now + '.css', 'janichan');
    loadCssAndBeautify('https://s.4cdn.org/css/global.' + now + '.css', 'global');
    loadCssAndBeautify('https://s.4cdn.org/css/spooky.' + now + '.css', 'spooky');
    loadCssAndBeautify('https://s.4cdn.org/css/md2016.' + now + '.css', 'md2016');
    loadCssAndBeautify('https://s.4cdn.org/css/error.' + now + '.css', 'error');
    loadCssAndBeautify('https://s.4cdn.org/css/bans.' + now + '.css', 'bans');
}

process.on('uncaughtException', function(e) {
    logError(e);
});

load();

})();
