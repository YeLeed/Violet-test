(function () {
  var APP_ID = 'kcxljtte';
  var API = 'https://mockingbird.intercom.workers.dev/kcxljtte/vhi';
  var PERSONAS = {
    aoife:  { user_id: 'VHI-MEM-100482', email: 'aoife.murphy@example.ie', name: 'Aoife Murphy' },
    ciaran: { user_id: 'VHI-MEM-200917', email: 'ciaran.walsh@example.ie', name: 'Ciarán Walsh' }
  };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function longDate(iso) { var p = iso.split('-'); return +p[2] + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }
  function settingsFor(key) {
    var s = { app_id: APP_ID };
    if (key && PERSONAS[key]) { s.user_id = PERSONAS[key].user_id; s.email = PERSONAS[key].email; s.name = PERSONAS[key].name; }
    return s;
  }
  function statusLabel(s) { return { paid: 'Paid', in_review: 'In review', returned: 'Returned', received: 'Received' }[s] || s; }
  function paymentBanner(c) {
    if (!c || c.status !== 'failed') return null;
    return 'Your payment of ' + c.amount_display + ' due ' + longDate(c.due_date) +
      ' was unsuccessful. We’ll try again on ' + longDate(c.resubmission_date) + '.';
  }
  // Ruling override: member lookup is path-style, not a query string.
  function memberUrl(key) { return API + '/member-context/' + encodeURIComponent(PERSONAS[key].email); }
  function currentPersona() { return localStorage.getItem('vhi_persona'); }
  function isPortal() { return location.pathname.indexOf('myvhi') >= 0; }
  function setIdentity(key) { localStorage.setItem('vhi_messenger_identity', key || 'visitor'); }

  function parsePersonaParam(search) {
    var m = /[?&]persona=([^&]+)/.exec(search || '');
    var key = m && decodeURIComponent(m[1]);
    return (key && PERSONAS[key]) ? key : null;
  }

  function withoutPersonaParam(href) {
    var u = new URL(href);
    u.searchParams.delete('persona');
    return u.toString();
  }
  function reloadClean() { location.replace(withoutPersonaParam(location.href)); }

  function clearIntercomCookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('intercom-') === 0) document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }
  function reboot(key) {
    if (window.Intercom) window.Intercom('shutdown');
    clearIntercomCookies();
    setIdentity(key);
    window.intercomSettings = settingsFor(key);
    setTimeout(function () { window.Intercom('boot', window.intercomSettings); }, 400);
  }
  function signIn(key) { localStorage.setItem('vhi_persona', key); reboot(key); if (location.pathname.indexOf('myvhi') < 0) location.href = 'myvhi.html'; else reloadClean(); }
  function signOut() { localStorage.removeItem('vhi_persona'); reboot(null); location.href = 'index.html'; }
  function composer() {
    try {
      var f = document.querySelector('iframe[name="intercom-messenger-frame"]');
      return (f && f.contentDocument && f.contentDocument.querySelector('[contenteditable="true"]')) || null;
    } catch (e) { return null; }
  }
  // showNewMessage is dropped while the Messenger boots and ignored while a restored draft sits in the composer.
  function say(text) {
    var tries = 0;
    (function attempt() {
      var el = composer();
      if (el && el.textContent.indexOf(text) >= 0) return;
      if (el && el.textContent.trim()) {
        el.focus();
        el.ownerDocument.execCommand('selectAll', false, null);
        el.ownerDocument.execCommand('delete', false, null);
      }
      window.Intercom('showNewMessage', text);
      tries += 1;
      if (tries < 25) setTimeout(attempt, 1200);
    })();
  }

  window.vhiDemo = { PERSONAS: PERSONAS, settingsFor: settingsFor, statusLabel: statusLabel, paymentBanner: paymentBanner,
    memberUrl: memberUrl, currentPersona: currentPersona, isPortal: isPortal, signIn: signIn, signOut: signOut, say: say, reboot: reboot,
    longDate: longDate, parsePersonaParam: parsePersonaParam, withoutPersonaParam: withoutPersonaParam,
    reloadClean: reloadClean };

  if (window.VHI_TEST) return;

  // A ?persona= URL param (used for headless screenshotting) sets localStorage before boot/render.
  var urlPersona = parsePersonaParam(location.search);
  if (urlPersona) localStorage.setItem('vhi_persona', urlPersona);

  // Public pages always boot a visitor; clearing a leftover member session stops Intercom resuming or merging into it.
  var bootPersona = isPortal() ? currentPersona() : null;
  if (localStorage.getItem('vhi_messenger_identity') !== (bootPersona || 'visitor')) clearIntercomCookies();
  setIdentity(bootPersona);
  window.intercomSettings = settingsFor(bootPersona);
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/'+APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else{w.addEventListener('load',l,false);}}})();
})();
