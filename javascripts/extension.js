/********************************
 *                              *
 *        4chan Extension       *
 *                              *
 ********************************/

/**
 * Helpers
 */
var $ = {};

$.id = function(id) {
  return document.getElementById(id);
};

$.cls = function(klass, root) {
  return (root || document).getElementsByClassName(klass);
};

$.byName = function(name) {
  return document.getElementsByName(name);
};

$.tag = function(tag, root) {
  return (root || document).getElementsByTagName(tag);
};

$.qs = function(sel, root) {
  return (root || document).querySelector(sel);
};

$.qsa = function(selector, root) {
  return (root || document).querySelectorAll(selector);
};

$.extend = function(destination, source) {
  for (var key in source) {
    destination[key] = source[key];
  }
};

$.on = function(n, e, h) {
  n.addEventListener(e, h, false);
};

$.off = function(n, e, h) {
  n.removeEventListener(e, h, false);
};

if (!document.documentElement.classList) {
  $.hasClass = function(el, klass) {
    return (' ' + el.className + ' ').indexOf(' ' + klass + ' ') != -1;
  };
  
  $.addClass = function(el, klass) {
    el.className = (el.className === '') ? klass : el.className + ' ' + klass;
  };
  
  $.removeClass = function(el, klass) {
    el.className = (' ' + el.className + ' ').replace(' ' + klass + ' ', '');
  };
}
else {
  $.hasClass = function(el, klass) {
    return el.classList.contains(klass);
  };
  
  $.addClass = function(el, klass) {
    el.classList.add(klass);
  };
  
  $.removeClass = function(el, klass) {
    el.classList.remove(klass);
  };
}

$.get = function(url, callbacks, headers) {
  var key, xhr;
  
  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  if (callbacks) {
    for (key in callbacks) {
      xhr[key] = callbacks[key];
    }
  }
  if (headers) {
    for (key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
  xhr.send(null);
  return xhr;
};

$.xhr = function(method, url, callbacks, data) {
  var key, xhr, form;
  
  xhr = new XMLHttpRequest();
  
  xhr.open(method, url, true);
  
  if (callbacks) {
    for (key in callbacks) {
      xhr[key] = callbacks[key];
    }
  }
  
  if (data) {
    form = new FormData();
    for (key in data) {
      form.append(key, data[key]);
    }
    data = form;
  }
  else {
    data = null;
  }
  
  xhr.send(data);
  
  return xhr;
};

$.ago = function(timestamp) {
  var delta, count, head, tail;
  
  delta = Date.now() / 1000 - timestamp;
  
  if (delta < 1) {
    return 'moments ago';
  }
  
  if (delta < 60) {
    return (0 | delta) + ' seconds ago';
  }
  
  if (delta < 3600) {
    count = 0 | (delta / 60);
    
    if (count > 1) {
      return count + ' minutes ago';
    }
    else {
      return 'one minute ago';
    }
  }
  
  if (delta < 86400) {
    count = 0 | (delta / 3600);
    
    if (count > 1) {
      head = count + ' hours';
    }
    else {
      head = 'one hour';
    }
    
    tail = 0 | (delta / 60 - count * 60);
    
    if (tail > 1) {
      head += ' and ' + tail + ' minutes';
    }
    
    return head + ' ago';
  }
  
  count = 0 | (delta / 86400);
  
  if (count > 1) {
    head = count + ' days';
  }
  else {
    head = 'one day';
  }
  
  tail = 0 | (delta / 3600 - count * 24);
  
  if (tail > 1) {
    head += ' and ' + tail + ' hours';
  }
  
  return head + ' ago';
};

$.hash = function(str) {
  var i, j, msg = 0;
  for (i = 0, j = str.length; i < j; ++i) {
    msg = ((msg << 5) - msg) + str.charCodeAt(i);
  }
  return msg;
};

$.prettySeconds = function(fs) {
  var m, s;
  
  m = Math.floor(fs / 60);
  s = Math.round(fs - m * 60);
  
  return [ m, s ];
};

$.docEl = document.documentElement;

$.cache = {};

/**
 * Parser
 */
var Parser = {
  tipTimeout: null
};

Parser.init = function() {
  var o, a, h, m, tail, staticPath;
  
  if (Config.filter || Config.linkify || Config.embedSoundCloud
    || Config.embedYouTube || Main.hasMobileLayout) {
    this.needMsg = true;
  }
  
  staticPath = '//s.4cdn.org/image/';
  
  tail = window.devicePixelRatio >= 2 ? '@2x.gif' : '.gif';
  
  this.icons = {
    admin: staticPath + 'adminicon' + tail,
    founder: staticPath + 'foundericon' + tail,
    mod: staticPath + 'modicon' + tail,
    dev: staticPath + 'developericon' + tail,
    manager: staticPath + 'managericon' + tail,
    del: staticPath + 'filedeleted-res' + tail
  };
  
  this.prettify = typeof prettyPrint == 'function';
  
  this.customSpoiler = {};
  
  if (Config.localTime) {
    if (o = (new Date()).getTimezoneOffset()) {
      a = Math.abs(o);
      h = (0 | (a / 60));
      
      this.utcOffset = 'Timezone: UTC' + (o < 0 ? '+' : '-')
        + h + ((m = a - h * 60) ? (':' + m) : '');
    }
    else {
      this.utcOffset = 'Timezone: UTC';
    }
    
    this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
  
  if (Main.tid) {
    this.trackedReplies = this.getTrackedReplies(Main.board, Main.tid);
    
    if (this.trackedReplies) {
      this.touchTrackedReplies(Main.tid);
    }
    else {
      this.trackedReplies = {};
    }
    
    this.pruneTrackedReplies();
  }
  
  this.postMenuIcon = Main.hasMobileLayout ? '...' : '▶';
};

Parser.getTrackedReplies = function(board, tid) {
  var tracked = null;
  
  if (tracked = localStorage.getItem('4chan-track-' + board + '-' + tid)) {
    tracked = JSON.parse(tracked);
  }
  
  return tracked;
};

Parser.saveTrackedReplies = function(tid, replies) {
  localStorage.setItem(
    '4chan-track-' + Main.board + '-' + tid,
    JSON.stringify(replies)
  );
};

Parser.touchTrackedReplies = function(tid) {
  var tracked, key;
  
  key = '4chan-track-' + Main.board + '-ts';
  
  if (tracked = localStorage.getItem(key)) {
    tracked = JSON.parse(tracked);
  }
  else {
    tracked = {};
  }
  
  tracked[tid] = 0 | (Date.now() / 1000);
  localStorage.setItem(key, JSON.stringify(tracked));
};

Parser.pruneTrackedReplies = function() {
  var tid, tracked, now, thres, ttl, pfx, flag;
  
  pfx = '4chan-track-' + Main.board + '-';
  
  if (tracked = localStorage.getItem(pfx + 'ts')) {
    ttl = 259200;
    now = 0 | (Date.now() / 1000);
    thres = now - ttl;
    
    flag = false;
    
    tracked = JSON.parse(tracked);
    
    if (Main.tid && tracked[Main.tid]) {
      tracked[Main.tid] = now;
      flag = true;
    }
    
    for (tid in tracked) {
      if (tracked[tid] <= thres) {
        flag = true;
        delete tracked[tid];
        localStorage.removeItem(pfx + tid);
      }
    }
    
    if (flag) {
      localStorage.removeItem(pfx + 'ts');
      
      for (tid in tracked) {
        localStorage.setItem(pfx + 'ts', JSON.stringify(tracked));
        break;
      }
    }
  }
};

Parser.parseThreadJSON = function(data) {
  var thread;
  
  try {
    thread = JSON.parse(data).posts;
  }
  catch (e) {
    console.log(e);
    thread = [];
  }
  
  return thread;
};

Parser.parseCatalogJSON = function(data) {
  var catalog;
  
  try {
    catalog = JSON.parse(data);
  }
  catch (e) {
    console.log(e);
    catalog = [];
  }
  
  return catalog;
};

Parser.setCustomSpoiler = function(board, val) {
  var s;
  if (!this.customSpoiler[board] && (val = parseInt(val))) {
    if (board == Main.board && (s = $.cls('imgspoiler')[0])) {
      this.customSpoiler[board] =
        s.firstChild.src.match(/spoiler(-[a-z0-9]+)\.png$/)[1];
    }
    else {
      this.customSpoiler[board] = '-' + board
        + (Math.floor(Math.random() * val) + 1);
    }
  }
};

Parser.buildPost = function(thread, board, pid) {
  var i, j, uid, el = null;
  
  for (i = 0; j = thread[i]; ++i) {
    if (j.no != pid) {
      continue;
    }
    
    if (!Config.revealSpoilers && thread[0].custom_spoiler) {
      Parser.setCustomSpoiler(board, thread[0].custom_spoiler);
    }
    
    el = Parser.buildHTMLFromJSON(j, board, false, true).lastElementChild;
    
    if (Config.IDColor && (uid = $.cls('posteruid', el)[Main.hasMobileLayout ? 0 : 1])) {
      IDColor.applyRemote(uid.firstElementChild);
    }
  }
  
  return el;
};

Parser.decodeSpecialChars = function(str) {
  return str.replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

Parser.encodeSpecialChars = function(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

Parser.onDateMouseOver = function(el) {
  if (Parser.tipTimeout) {
    clearTimeout(Parser.tipTimeout);
    Parser.tipTimeout = null;
  }
  
  Parser.tipTimeout = setTimeout(Tip.show, 500, el, $.ago(+el.getAttribute('data-utc')));
};

Parser.onTipMouseOut = function() {
  if (Parser.tipTimeout) {
    clearTimeout(Parser.tipTimeout);
    Parser.tipTimeout = null;
  }
};

Parser.onUIDMouseOver = function(el) {
  var p;
  
  if (!$.hasClass(el.parentNode, 'posteruid')) {
    return;
  }
  
  if (!Main.tid) {
    p = el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    if (!$.hasClass(p, 'tExpanded')) {
      return;
    }
  }
  
  if (Parser.tipTimeout) {
    clearTimeout(Parser.tipTimeout);
    Parser.tipTimeout = null;
  }
  
  Parser.tipTimeout = setTimeout(Parser.showUIDCount, 500, el, el.textContent);
};

Parser.showUIDCount = function(t, uid) {
  var i, el, nodes, count, msg;
  
  count = 0;
  nodes = $.qsa('.postInfo .hand');
  
  for (i = 0; el = nodes[i]; ++i) {
    if (el.textContent === uid) {
      ++count;
    }
  }
  
  msg = count + ' post' + (count != 1 ? 's' : '') + ' by this ID';
  
  Tip.show(t, msg);
};

Parser.buildHTMLFromJSON = function(data, board, standalone, fromQuote) {
  var
    container = document.createElement('div'),
    isOP = false,
    
    userId,
    fileDims = '',
    imgSrc = '',
    fileInfo = '',
    fileHtml = '',
    fileThumb,
    filePath,
    fileName,
    fileSpoilerTip = '"',
    size = '',
    fileClass = '',
    shortFile = '',
    longFile = '',
    tripcode = '',
    capcodeStart = '',
    capcodeClass = '',
    capcode = '',
    flag,
    highlight = '',
    emailStart = '',
    emailEnd = '',
    name, mName,
    subject,
    noLink,
    quoteLink,
    replySpan = '',
    noFilename,
    decodedFilename,
    mobileLink = '',
    postType = 'reply',
    summary = '',
    postCountStr,
    resto,
    capcode_replies = '',
    threadIcons = '',
    needFileTip = false,
    
    i, q, href, quotes, tmp,
    
    imgDir;
  /*
  if (board !== 'f') {
    if (data.no % 3 > 2) {
      imgDir = '//is.4chan.org/' + board;
    }
    else {
      imgDir = '//is2.4chan.org/' + board;
    }
  }
  else {*/
    imgDir = '//i.4cdn.org/' + board;
  //}
  
  if (data.resto === 0) {
    isOP = true;
    
    if (standalone) {
      if (data.replies > 0) {
        tmp = data.replies + ' Repl' + (data.replies > 1 ? 'ies' : 'y');
        if (data.images > 0) {
          tmp += ' / ' + data.images + ' Image' + (data.images > 1 ? 's' : '');
        }
      }
      else {
        tmp = '';
      }
      
      mobileLink = '<div class="postLink mobile"><span class="info">'
        + tmp + '</span><a href="'
        + 'thread/' + data.no + '" class="button">View Thread</a></div>';
      postType = 'op';
      replySpan = '&nbsp; <span>[<a href="'
        + 'thread/' + data.no + (data.semantic_url ? ('/' + data.semantic_url) : '')
        + '" class="replylink" rel="canonical">Reply</a>]</span>';
    }
    
    resto = data.no;
  }
  else {
    resto = data.resto;
  }
  
  
  if (!Main.tid || board != Main.board) {
    noLink = 'thread/' + resto + '#p' + data.no;
    quoteLink = 'thread/' + resto + '#q' + data.no;
  }
  else {
    noLink = '#p' + data.no;
    quoteLink = 'javascript:quote(\'' + data.no + '\')';
  }
  
  if (!data.capcode && data.id) {
    userId = ' <span class="posteruid id_'
      + data.id + '">(ID: <span class="hand" title="Highlight posts by this ID">'
      + data.id + '</span>)</span> ';
  }
  else {
    userId = '';
  }
  
  switch (data.capcode) {
    case 'admin_highlight':
      highlight = ' highlightPost';
      /* falls through */
    case 'admin':
      capcodeStart = ' <strong class="capcode hand id_admin" '
        + 'title="Highlight posts by Administrators">## Admin</strong>';
      capcodeClass = ' capcodeAdmin';
      
      capcode = ' <img src="' + Parser.icons.admin + '" '
        + 'alt="This user is a 4chan Administrator." '
        + 'title="This user is a 4chan Administrator." class="identityIcon">';
      break;
    case 'mod':
      capcodeStart = ' <strong class="capcode hand id_mod" '
        + 'title="Highlight posts by Moderators">## Mod</strong>';
      capcodeClass = ' capcodeMod';
      
      capcode = ' <img src="' + Parser.icons.mod + '" '
        + 'alt="This user is a 4chan Moderator." '
        + 'title="This user is a 4chan Moderator." class="identityIcon">';
      break;
    case 'developer':
      capcodeStart = ' <strong class="capcode hand id_developer" '
        + 'title="Highlight posts by Developers">## Developer</strong>';
      capcodeClass = ' capcodeDeveloper';
      
      capcode = ' <img src="' + Parser.icons.dev + '" '
        + 'alt="This user is a 4chan Developer." '
        + 'title="This us