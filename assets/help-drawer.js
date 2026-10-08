// Left-hand "what to ask Violet" panel. Include after app.js on any demo page.
(function () {
  var GROUPS = [
    {
      title: 'Informational prompts',
      note: 'Answered from vhi.ie help content. Works signed out or signed in.',
      member: false,
      prompts: [
        'Has my claim been received and processed yet?',
        'How long does a claim take?',
        'Why was my claim only partially paid or declined?',
        'What are the waiting periods for a new member?'
      ]
    },
    {
      title: 'Personalised prompts',
      note: 'The same kind of question, answered from the member’s own policy and claims. Sign in as Aoife or Ciarán first.',
      member: true,
      prompts: [
        'Has my claim been received and processed yet?',
        'When will I find out about my unsettled claims?',
        'Why was my physio claim only partly paid?',
        'When does my policy renew and how do I pay?'
      ]
    },
    {
      title: 'Action-based prompts (procedures)',
      note: 'Violet runs a Fin procedure: checks the policy, collects details, updates Vhi systems or hands over to Member Care.',
      member: true,
      prompts: [
        'I’ve just recently had a baby and want to add her to my policy. How can I do this?',
        'I had twins last month, can I add them to my plan?',
        'I want to submit a claim for a physio visit'
      ]
    }
  ];

  var CSS = '\
.vhi-help{position:fixed;top:0;left:0;bottom:0;width:340px;background:#1e2a2e;color:#e8ecee;z-index:150;display:flex;flex-direction:column;font-family:var(--font);transform:translateX(-100%);transition:transform .2s;box-shadow:2px 0 12px rgba(0,0,0,.25)}\
body.vhi-help-open .vhi-help{transform:none}\
body.vhi-help-open{padding-left:340px}\
.vhi-help-head{display:flex;align-items:center;justify-content:space-between;padding:22px 20px 16px;border-bottom:1px solid rgba(255,255,255,.1)}\
.vhi-help-head h2{margin:0;font-size:18px;font-weight:600}\
.vhi-help-close{background:none;border:0;color:#9aa5aa;font-size:22px;line-height:1;cursor:pointer;padding:0 2px}\
.vhi-help-close:hover{color:#fff}\
.vhi-help-body{flex:1;overflow-y:auto;padding:18px 20px}\
.vhi-help-group{margin-bottom:26px}\
.vhi-help-group h3{margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9aa5aa;font-weight:600}\
.vhi-help-group p{margin:0 0 12px;font-size:12.5px;color:#b7c0c4;line-height:1.45}\
.vhi-help-card{display:flex;align-items:center;gap:8px;background:#26343a;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 10px 12px 14px;margin-bottom:10px}\
.vhi-help-card button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;text-align:left;padding:0}\
.vhi-help-send{flex:1;font-size:14.5px;line-height:1.35;display:flex;align-items:center;justify-content:space-between;gap:10px}\
.vhi-help-send:hover{color:#fff}\
.vhi-help-send .chev{opacity:.55;font-size:16px}\
.vhi-help-send .lock{font-size:10.5px;letter-spacing:.04em;text-transform:uppercase;color:#cfd6d9;background:rgba(255,255,255,.1);border-radius:999px;padding:3px 8px;white-space:nowrap}\
.vhi-help-copy{color:#9aa5aa;padding:4px 6px;border-radius:6px;font-size:14px}\
.vhi-help-copy:hover{background:rgba(255,255,255,.1);color:#fff}\
.vhi-help-foot{padding:14px 20px;border-top:1px solid rgba(255,255,255,.1);font-size:12.5px;color:#b7c0c4;display:flex;flex-direction:column;gap:10px}\
.vhi-help-foot strong{color:#fff;font-weight:600}\
.vhi-help-foot .hint{display:flex;gap:8px;flex-wrap:wrap}\
.vhi-help-foot .hint span{background:#26343a;border-radius:999px;padding:4px 10px;font-size:11.5px;color:#cfd6d9}\
.vhi-help-tab{position:fixed;top:84px;left:0;z-index:150;background:#1e2a2e;color:#fff;border:0;border-radius:0 999px 999px 0;padding:9px 14px 9px 12px;font:600 13px var(--font);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}\
body.vhi-help-open .vhi-help-tab{display:none}\
body.vhi-help-open .presenter-bar{left:340px}\
.vhi-help-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);background:#1e2a2e;color:#fff;padding:10px 16px;border-radius:999px;font-size:13px;z-index:300;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center}\
.vhi-help-toast.show{opacity:1}\
@media (max-width:1100px){body.vhi-help-open{padding-left:0}}';

  var vhi = window.vhiDemo;
  if (!vhi) return;
  var signedIn = !!(vhi.isPortal() && vhi.currentPersona());
  var flat = [];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  var toastEl, toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function send(prompt, member) {
    if (member && !signedIn) {
      localStorage.setItem('vhi_pending_prompt', prompt);
      var modal = document.getElementById('signin-modal');
      if (modal) {
        modal.classList.add('open');
        toast('Choose a demo member. Violet will be asked this once you are signed in.');
      } else {
        location.href = 'index.html';
      }
      return;
    }
    vhi.say(prompt);
    toast('Sent to Violet. Press send in the Messenger.');
  }

  function copy(prompt) {
    var done = function () { toast('Copied to clipboard'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(prompt).then(done, done);
    else done();
  }

  function setOpen(open) {
    document.body.classList.toggle('vhi-help-open', open);
    localStorage.setItem('vhi_help_closed', open ? '0' : '1');
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var html = '<div class="vhi-help-head"><h2>Violet demo help</h2><button class="vhi-help-close" aria-label="Close" title="Close (?)">&times;</button></div><div class="vhi-help-body">';
    GROUPS.forEach(function (g) {
      html += '<div class="vhi-help-group"><h3>' + esc(g.title) + '</h3><p>' + esc(g.note) + '</p>';
      g.prompts.forEach(function (p) {
        var i = flat.length;
        flat.push({ prompt: p, member: g.member });
        var tail = (g.member && !signedIn) ? '<span class="lock">Sign in</span>' : '<span class="chev">&rsaquo;</span>';
        html += '<div class="vhi-help-card"><button class="vhi-help-send" data-i="' + i + '" title="Ask Violet (⌥' + (i + 1) + ')"><span>' + esc(p) + '</span>' + tail + '</button>' +
          '<button class="vhi-help-copy" data-i="' + i + '" title="Copy">&#x2398;</button></div>';
      });
      html += '</div>';
    });
    html += '</div><div class="vhi-help-foot"><div><strong>Fin demo</strong> for Vhi · ' + (signedIn ? 'signed in as ' + esc(vhi.PERSONAS[vhi.currentPersona()].name) : 'browsing as a visitor') + '</div>' +
      '<div class="hint"><span>⌥ 1–9 ask a prompt</span><span>? show / hide</span><span>Click a prompt to ask Violet</span></div></div>';

    var panel = document.createElement('aside');
    panel.className = 'vhi-help';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    var tab = document.createElement('button');
    tab.className = 'vhi-help-tab';
    tab.innerHTML = '&#9776;&nbsp; Demo help';
    document.body.appendChild(tab);

    toastEl = document.createElement('div');
    toastEl.className = 'vhi-help-toast';
    document.body.appendChild(toastEl);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('vhi-help-close')) return setOpen(false);
      var item = flat[+b.dataset.i];
      if (!item) return;
      if (b.classList.contains('vhi-help-copy')) copy(item.prompt); else send(item.prompt, item.member);
    });
    tab.addEventListener('click', function () { setOpen(true); });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === '?') { setOpen(!document.body.classList.contains('vhi-help-open')); return; }
      if (e.altKey && /^[1-9]$/.test(e.code.replace('Digit', ''))) {
        var item = flat[+e.code.replace('Digit', '') - 1];
        if (item) { e.preventDefault(); send(item.prompt, item.member); }
      }
    });

    setOpen(localStorage.getItem('vhi_help_closed') !== '1');

    var pending = localStorage.getItem('vhi_pending_prompt');
    if (pending && signedIn) {
      localStorage.removeItem('vhi_pending_prompt');
      setTimeout(function () { vhi.say(pending); toast('Asking Violet: ' + pending); }, 1500);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
