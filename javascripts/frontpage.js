'use strict';

var $ = {};

$.id = function(id) {
  return document.getElementById(id);
};

$.el = function(tag) {
  return document.createElement(tag);
};

$.on = function(n, e, h) {
  n.addEventListener(e, h, false);
};

$.off = function(n, e, h) {
  n.removeEventListener(e, h, false);
};

$.setCookie = function(name, value) {
  var date = new Date();
  
  date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
  
  document.cookie = name + '=' + value
    + '; expires=' + date.toGMTString()
    + '; path=/';
};

$.removeCookie = function(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
};

$.getCookie = function(name) {
  var i, c, ca, key;
  
  key = name + '=';
  ca = document.cookie.split(';');
  
  for (i = 0; c = ca[i]; ++i) {
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(key) === 0) {
      return decodeURIComponent(c.substring(key.length, c.length));
    }
  }
  
  return null;
};

/* *** */

var APP = {
  init: function() {
    this.xhr = null;
    
    this.clickCommands = {
      'filter': APP.onFilterClick,
      'opts': APP.onOptionsClick,
      'set': APP.onMenuItemClick,
      'x-wot': APP.onCloseWotClick,
      'x-disc': APP.onCloseDiscClick,
      'ok-disc': APP.onOkDiscClick
    };
    
    this.is_4channel = window.location.host !== 'www.4chan.org';
    
    $.on(document, 'DOMContentLoaded', APP.run);
    $.on(document, 'click', APP.onClick);
  },
  
  run: function() {
    var el;
    
    $.off(document, 'DOMContentLoaded', APP.run);
    
    if (window == top && window.Opts['4chan_frames']) {
      window.location.href = '/frames';
      return;
    }
    
    if (el = $.id('wot-cnt')) {
      el.innerHTML = APP.wotContent;
    }
    
    if (!$.getCookie('4chan_disclaimer')) {
      $.on(document, 'click', APP.onClickDisclaimer);
    }
  },
  
  onClick: function(e) {
    var t, cmd;
    
    if (e.which != 1 || e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
      return;
    }
    
    if ((t = e.target) == document) {
      return;
    }
    
    if ((cmd = t.getAttribute('data-cmd')) && (cmd = APP.clickCommands[cmd])) {
      e.stopPropagation();
      cmd(t, e);
    }
  },
  
  onClickDisclaimer: function(e) {
    var t;
    
    if ((t = e.target) == document) {
      return;
    }
    
    if (t.className == 'c-thumb') {
      t = t.parentNode;
    }
    
    if (t.href && /boards\.(4chan|4channel)\.org/.test(t.href)) {
      e.preventDefault();
      APP.showDisclaimer(t.getAttribute('href'));
    }
  },
  
  showDisclaimer: function(url) {
    var el;
    
    el = $.el('div');
    el.id = 'backdrop';
    document.body.appendChild(el);
    
    el = $.el('div');
    el.id = 'disclaimer-dialog';
    el.innerHTML = '<div class="hd"><h2>Disclaimer</h2>'
      + '<div data-cmd="x-disc" class="closebutton"></div></div>'
      + '<div class="bd">' + APP.discContent
      + '<div class="disclaimer-footer">'
      + '<button data-url="' + url + '" data-cmd="ok-disc">Accept</button>'
      + '<button data-cmd="x-disc">Cancel</button>'
    + '</div>';
    
    el.style.top = (window.pageYOffset + 50) + 'px';
    
    document.body.appendChild(el);
  },
  
  onCloseDiscClick: function() {
    var el;
    
    if (el = $.id('disclaimer-dialog')) {
      el.parentNode.removeChild(el);
    }
    
    if (el = $.id('backdrop')) {
      el.parentNode.removeChild(el);
    }
  },
  
  onOkDiscClick: function(btn) {
    var url;
    
    url = btn.getAttribute('data-url');
    
    if (url) {
      $.setCookie('4chan_disclaimer', 1);
      window.location = url;
    }
  },
  
  showMenu: function(html, btn) {
    var el, aabb, aabb2;
    
    APP.closeMenu();
    
    el = $.el('div');
    el.id = 'fp-menu';
    el.innerHTML = html;
    
    document.body.appendChild(el);
    
    aabb = btn.getBoundingClientRect();
    aabb2 = el.getBoundingClientRect();
    
    el.style.top = (aabb.top + window.pageYOffset + aabb.height + 5) + 'px';
    
    el.style.left = (aabb.left - aabb2.width + aabb.width - 5) + 'px';
    
    $.on(document, 'click', APP.closeMenu);
  },
  
  closeMenu: function() {
    var el;
    
    $.off(document, 'click', APP.closeMenu);
    
    if (el = $.id('fp-menu')) {
      el.parentNode.removeChild(el);
    }
  },
  
  onFilterClick: function(btn) {
    var html, opts;
    
    opts = window.Opts;
    
    if (APP.is_4channel) {
      html = '<ul>';
    }
    else {
      html = '<ul>'
        + '<li ' + (opts.fpb == 'all' ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="fpb" data-val="all">Show All Boards</li>'
        + '<li ' + (opts.fpb == 'nws' ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="fpb" data-val="nws">Show NSFW Boards Only</li>'
        + '<li ' + (opts.fpb == 'ws' ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="fpb" data-val="ws">Show Worksafe Boards Only</li>'
        + '<li ' + (opts.fpb == 'allc' ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="fpb" data-val="allc">Show All Boards (Classic)</li>'
        + '<li class="fp-menu-sep"></li>';
    }
    
    html += '<li ' + (opts['4chan_frames'] ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="4chan_frames">Use Frames</li>'
        + '<li ' + (opts.fpcat ? 'class="fp-menu-sel" ' : '')
          + 'data-cmd="set" data-opt="fpcat">Use Catalog</li>'
      + '</ul>';
    
    APP.showMenu(html, btn);
  },
  
  onOptionsClick: function(btn) {
    var html, opts;
    
    opts = window.Opts;
    
    html = '<ul>'
      + '<li ' + (opts.fpc == 'ws' ? 'class="fp-menu-sel" ' : '')
        + 'data-cmd="set" data-opt="fpc" data-val="ws">Show Worksafe Content Only</li>'
      + '<li ' + (opts.fpc == 'nws' ? 'class="fp-menu-sel" ' : '')
        + 'data-cmd="set" data-opt="fpc" data-val="nws">Show NSFW Content Only</li>'
      + '<li ' + (opts.fpc == 'all' ? 'class="fp-menu-sel" ' : '')
        + 'data-cmd="set" data-opt="fpc" data-val="all">Show All Content</li>'
    + '</ul>';
    
    APP.showMenu(html, btn);
  },
  
  onMenuItemClick: function(btn) {
    var opt, val;
    
    opt = btn.getAttribute('data-opt');
    val = btn.getAttribute('data-val');
    
    if (!val && window.Opts[opt]) {
      $.removeCookie(opt);
    }
    else {
      $.setCookie(opt, val || 1);
    }
    
    if (opt == '4chan_frames') {
      if (window.Opts[opt]) {
        window.parent.location.href = '/';
      }
      else {
        location.href = '/frames';
      }
    }
    else {
      location.href = location.href;
    }
  },
  
  onCloseWotClick: function(btn, e) {
    var el;
    
    e.preventDefault();
    
    if (el = $.id('announce')) {
      el.parentNode.removeChild(el);
    }
    
    $.setCookie('wi4c', 1);
  },
  
  wotContent: '<p>4chan is a simple image-based bulletin board where anyone can post comments and share images. There are boards dedicated to a variety of topics, from Japanese animation and culture to videogames, music, and photography. Users do not need to register an account before participating in the community. Feel free to click on a board below that interests you and jump right in!</p><br /><p>Be sure to familiarize yourself with the <a href="/rules">Rules</a> before posting, and read the <a href="/faq" title="Frequently Asked Questions">FAQ</a> if you wish to learn more about how to use the site.</p>',
  
  discContent: '<p>To access this section of 4chan (the "website"), you understand and agree to the following:</p><ol><li>The content of this website is for mature audiences only and may not be suitable for minors. If you are a minor or it is illegal for you to access mature images and language, do not proceed.</li><br><li>This website is presented to you AS IS, with no warranty, express or implied. By clicking "I Agree," you agree not to hold 4chan responsible for any damages from your use of the website, and you understand that the content posted is not owned or generated by 4chan, but rather by 4chan\'s users.</li><br><li>As a condition of using this website, you agree to comply with the "<a href="/rules" target="_blank" title="4chan Rules">Rules</a>" of 4chan, which are also linked on the home page. Please read the Rules carefully, because they are important.</li></ol>'
};

APP.init();
