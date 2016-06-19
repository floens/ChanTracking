var Parser = {}

Parser.init = function() {
  var staticPath = '//s.4cdn.org/image/';
  
  var tail = window.devicePixelRatio >= 2 ? '@2x.gif' : '.gif';
  
  this.icons = {
    admin: staticPath + 'adminicon' + tail,
    mod: staticPath + 'modicon' + tail,
    dev: staticPath + 'developericon' + tail,
    del: staticPath + 'filedeleted-res' + tail
  };
};

function buildHTMLFromJSON(data) {
  var
    container = document.createElement('div'),
    isOP = false,
    
    userId,
    fileDims = '',
    imgSrc = '',
    fileBuildStart = '',
    fileBuildEnd = '',
    fileInfo = '',
    fileHtml = '',
    fileThumb,
    fileSize = '',
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
    name,
    subject,
    noLink,
    quoteLink,
    noFilename,
    maxSize = 150,
    ratio, imgWidth, imgHeight,
    
    imgDir = '//i.4cdn.org/' + data.board + '/src';
  
  noLink = 'res/' + data.resto + '#p' + data.no;
  quoteLink = 'res/' + data.resto + '#q' + data.no;
  
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
    case 'admin':
      capcodeStart = ' <strong class="capcode hand id_admin"'
        + 'title="Highlight posts by the Administrator">## Admin</strong>';
      capcodeClass = ' capcodeAdmin';
      
      capcode = ' <img src="' + Parser.icons.admin + '" '
        + 'alt="This user is the 4chan Administrator." '
        + 'title="This user is the 4chan Administrator." class="identityIcon">';
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
        + 'title="This user is a 4chan Developer." class="identityIcon">';
      break;
  }
  
  if (data.email) {
    emailStart = '<a href="mailto:' + data.email.replace(/ /g, '%20') + '" class="useremail">';
    emailEnd = '</a>';
  }
  
  if (data.country) {
    flag = ' <img src="//s.4cdn.org/image/country/'
      + (data.board == 'pol' ? 'troll/' : '')
      + data.country.toLowerCase() + '.gif" alt="'
      + data.country + '" title="' + data.country_name + '" class="countryFlag">';
  }
  else {
    flag = '';
  }

  if (data.ext) {
    shortFile = longFile = data.filename + data.ext;
    if (data.filename.length > 30) {
      shortFile = data.filename.slice(0, 25) + '(...)' + data.ext;
    }

    if (!data.tn_w && !data.tn_h && data.ext == '.gif') {
      data.tn_w = data.w;
      data.tn_h = data.h;
    }
    if (data.fsize >= 1048576) {
      fileSize = ((0 | (data.fsize / 1048576 * 100 + 0.5)) / 100) + ' M';
    }
    else if (data.fsize > 1024) {
      fileSize = (0 | (data.fsize / 1024 + 0.5)) + ' K';
    }
    else {
      fileSize = data.fsize + ' ';
    }
    
    fileThumb = '//i.4cdn.org/bans/thumb/' + data.board + '/' + data.thumb + 's.jpg';
    
    imgWidth = data.tn_w;
    imgHeight = data.tn_h;
    
    if (imgWidth > maxSize) {
      ratio = maxSize / imgWidth;
      imgWidth = maxSize;
      imgHeight = imgHeight * ratio;
    }
    if (imgHeight > maxSize) {
      ratio = maxSize / imgHeight;
      imgWidth = imgWidth * ratio;
      imgHeight = maxSize;
    }
    
    imgSrc = '<a class="fileThumb' + fileClass + '" href="" target="_blank">'
      + '<img src="' + fileThumb
      + '" alt="' + fileSize + 'B" data-md5="' + data.md5
      + '" style="height: ' + imgHeight + 'px; width: '
      + imgWidth + 'px;"></a>';
    
    fileDims = data.ext == '.pdf' ? 'PDF' : data.w + 'x' + data.h;
    fileInfo = '<span class="fileText" id="fT' + data.no
      + '">File: <a href="' + imgDir + '/' + data.tim + data.ext
      + '" target="_blank">' + data.tim + data.ext + '</a>-(' + fileSize
      + 'B, ' + fileDims
      + (noFilename ? '' : (', <span title="' + longFile + '">'
      + shortFile + '</span>')) + ')</span>';
    
    fileBuildStart = fileInfo ? '<div class="fileInfo">' : '';
    fileBuildEnd = fileInfo ? '</div>' : '';
    
    fileHtml = '<div id="f' + data.no + '" class="file">'
      + fileBuildStart + fileInfo + fileBuildEnd + imgSrc + '</div>';
  }
  else if (data.filedeleted) {
    fileHtml = '<div id="f' + data.no + '" class="file"><span class="fileThumb"><img src="'
      + Parser.icons.del + '" class="fileDeletedRes" alt="File deleted."></span></div>';
  }
  
  if (data.trip) {
    tripcode = ' <span class="postertrip">' + data.trip + '</span>';
  }
  
  name = data.name || '';
  
  subject = data.sub || '';
  
  container.id = 'p' + data.no;
  container.className = 'post reply' + highlight + (data.nsfw ? ' nws' : ' ws');
  container.innerHTML =
    '<div class="postInfo desktop" id="pi' + data.no + '">' +
      '<input type="checkbox" name="' + data.no + '" value="delete"> ' +
      '<span class="subject">' + subject + '</span> ' +
      '<span class="nameBlock' + capcodeClass + '">' + emailStart +
        '<span class="name">' + name + '</span>' +
        tripcode + capcodeStart + emailEnd + capcode + userId + flag +
      ' </span> ' +
      '<span class="dateTime" data-utc="' + data.time + '">' + data.now + '</span> ' +
      '<span class="postNum desktop">' +
        '<a href="" title="Highlight this post">No.</a><a href="" title="Quote this post">XXX</a>' +
      '</span>' +
    '</div>' + fileHtml +
    '<blockquote class="postMessage" id="m' + data.no + '">'
    + (data.com || '') + '</blockquote>';
  
  return container;
}

function showPreview(e) {
    var rect, postHeight, doc, docWidth, style, pos, top, scrollTop, link, post, bid;
    
    link = e.target;
    
    if (!(bid = e.target.getAttribute('data-pid'))) {
      return;
    }
    
    post = buildHTMLFromJSON(window.postPreviews[bid]);
    
    post.id = 'quote-preview';
    
    rect = link.getBoundingClientRect();
    doc = document.documentElement;
    docWidth = doc.offsetWidth;
    style = post.style;
    
    document.body.appendChild(post);
    
    if ((docWidth - rect.right) < (0 | (docWidth * 0.3))) {
      pos = docWidth - rect.left;
      style.right = pos + 5 + 'px';
    }
    else {
      pos = rect.left + rect.width;
      style.left = pos + 5 + 'px';
    }
    
    top = rect.top + link.offsetHeight + window.pageYOffset
      - post.offsetHeight / 2 - rect.height / 2;
    
    postHeight = post.getBoundingClientRect().height;
    
    if (doc.scrollTop != document.body.scrollTop) {
      scrollTop = doc.scrollTop + document.body.scrollTop;
    } else {
      scrollTop = document.body.scrollTop;
    }
    
    if (top < scrollTop) {
      style.top = scrollTop + 'px';
    }
    else if (top + postHeight > scrollTop + doc.clientHeight) {
      style.top = scrollTop + doc.clientHeight - postHeight + 'px';
    }
    else {
      style.top = top + 'px';
    }
}

function removePreview() {
  if (cnt = document.getElementById('quote-preview')) {
    document.body.removeChild(cnt);
  }
}

function ago(timestamp) {
  var delta, count, head, tail, ago;
  
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

function initTimestamps() {
  var i, n, nodes;
  
  nodes = document.getElementsByClassName('time');
  
  for (i = 0; n = nodes[i]; ++i) {
    n.textContent = ago(+n.getAttribute('data-utc'));
  }
}

function run() { 
  Parser.init();
  initTimestamps();
  document.addEventListener('mouseover', showPreview, false);
  document.addEventListener('mouseout', removePreview, false);
}

document.addEventListener('DOMContentLoaded', run, false);
