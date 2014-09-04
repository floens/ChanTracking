var request = require('request');
var jsBeautify = require('js-beautify');
var prettyCss = require('PrettyCSS');
var fs = require('fs');
var htmlBeautify = require('html');

var state = {};

var log = function(e) {
    console.log(e);
}

var loadState = function() {
    try {
        var fileState = fs.readFileSync('state.json');
        if (fileState) {
            state = JSON.parse(fileState);
        }
    } catch(e) {
    }
}

var saveState = function() {
    fs.writeFileSync('state.json', JSON.stringify(state));
}


var loadJavaScriptAndBeautify = function(url, name) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            log('Beautifying ' + name);
            var nice = jsBeautify.js_beautify(body, {});

            fs.writeFileSync(name, nice);
        } else {
            log('Error loading ' + name);
        }
    });
}

var loadNewJavaScripts = function(version) {
    loadJavaScriptAndBeautify('https://s.4cdn.org/js/core.' + version + '.js', 'javascripts/core.js');
    loadJavaScriptAndBeautify('https://s.4cdn.org/js/extension.' + version + '.js', 'javascripts/extension.js');
}


var loadNewCssAndBeautify = function(url, name) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            log('Beautifying ' + name + '.css');
            var nice = prettyCss.parse(body);

            fs.writeFileSync('css/' + name + '.css', nice);
        } else {
            log('Error loading ' + name + '.css');
        }
    });
}

var loadNewCss = function(version) {
    loadNewCssAndBeautify('https://s.4cdn.org/css/yotsubluenew.' + version + '.css', 'yotsubluenew');
    loadNewCssAndBeautify('https://s.4cdn.org/css/yotsubanew.' + version + '.css', 'yotsubanew');
    loadNewCssAndBeautify('https://s.4cdn.org/css/futabanew.' + version + '.css', 'futubanew');
    loadNewCssAndBeautify('https://s.4cdn.org/css/burichannew.' + version + '.css', 'burichannew');
    loadNewCssAndBeautify('https://s.4cdn.org/css/photon.' + version + '.css', 'photon');
    loadNewCssAndBeautify('https://s.4cdn.org/css/tomorrow.' + version + '.css', 'tomorrow');
    loadNewCssAndBeautify('https://s.4cdn.org/css/yotsubluemobile.' + version + '.css', 'yotsubluemobile');
    loadNewCssAndBeautify('https://s.4cdn.org/css/yui.1.css', 'yui');
}

var loadPageAndBeautify = function(url, name) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var nice = htmlBeautify.prettyPrint(body);

            log('Loaded ' + name);
            fs.writeFileSync(name, nice);
        } else {
            log('Error loading ' + name);
        }
    });
}

var onHtmlResponse = function(response) {
    var versionRegex = /cssVersion = (\d+).+jsVersion = (\d+)/g;

    var versionResult = versionRegex.exec(response);
    if (versionResult) {
        var cssVersion = parseInt(versionResult[1]);
        var jsVersion = parseInt(versionResult[2]);
        if (!isNaN(cssVersion) && !isNaN(jsVersion)) {
            log('Found css: ' + cssVersion + ', js: ' + jsVersion);

            if (jsVersion > state.jsVersion) {
                log('JS version is newer');
            }

            if (cssVersion > state.cssVersion) {
                log('CSS version is newer');
            }

            loadNewJavaScripts(jsVersion);
            loadNewCss(cssVersion);

            state.cssVersion = cssVersion;
            state.jsVersion = jsVersion;
            saveState();
        }
    } else {
        log('Warning, no css/js version found');
    }
}

var loadFile = function(url, name) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            log('Loaded ' + name);
            fs.writeFileSync(name, body);
        } else {
            log('Error loading ' + name);
        }
    });
}

var load = function() {
    loadState();
    
    log('Loading https://boards.4chan.org/g/');
    request('https://boards.4chan.org/g/', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            onHtmlResponse(body);
        }
    });

    // The /g/ sticky
    loadPageAndBeautify('https://boards.4chan.org/g/thread/39894014', 'boards/sticky.html');

    loadJavaScriptAndBeautify('https://a.4cdn.org/boards.json', 'api/boards.json');

    loadFile('https://www.4chan.org/faq', 'pages/faq.html');
    loadFile('https://www.4chan.org/rules', 'pages/rules.html');
    loadFile('https://www.4chan.org/news', 'pages/news.html');
    loadFile('https://www.4chan.org/blotter', 'pages/blotter.html');
    loadFile('https://www.4chan.org/legal', 'pages/legal.html');
}

load();
