// Left-hand "Demo script" panel. Include after app.js on any demo page.
// A prompt is a string or { text, expect, paths: [{ label, say, expect, only? }] }; expect may be { aoife, ciaran }.
(function () {
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function daysAgo(n) {
    var d = new Date(); d.setDate(d.getDate() - n);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  var BABY_OK = daysAgo(26);      // inside the free 13-week window
  var BABY_LATE = daysAgo(140);   // outside it
  var BABY_FUTURE = daysAgo(-60); // a date that cannot be right
  var VISIT = daysAgo(10);

  var PLAN = { aoife: 'One Plan Family', ciaran: 'Company Plan' };

  var GROUPS = [
    {
      id: 'general',
      title: 'General questions',
      note: 'Answered from the vhi.ie help pages. Works whether or not you are signed in.',
      member: false,
      prompts: [
        'Has my claim been received and processed yet?',
        'How long does a claim take?',
        'Why was my claim only partially paid or declined?',
        'What are the waiting periods for a new member?'
      ]
    },
    {
      id: 'personal',
      title: 'Personal answers',
      note: 'The same kind of question, answered from this member’s own policy and claims.',
      member: true,
      prompts: [
        {
          text: 'Has my claim been received and processed yet?',
          expect: {
            aoife: 'Lists her four claims: GP visit received 22 September and still being assessed (decision due 10 October, delayed by claim volumes), a consultant visit returned because the receipt had no practitioner details, physio paid €30 of €60, and Darragh’s sports massage declined.',
            ciaran: 'Lists his three claims: GP visit received 3 October and being assessed (decision due 10 October), an eye test declined because the yearly allowance was already used, physio paid €35 of €70.'
          },
          paths: [
            { label: 'Resubmit the returned claim', only: 'aoife', say: 'Can you help me resubmit the consultant claim?', expect: 'Switches into Snap & Send: asks who the visit was for and for a photo of a receipt that shows the practitioner’s name and details.' },
            { label: 'Dispute a decision', say: 'I don’t agree with that decision, can someone look at it again?', expect: 'Summarises the claim reference and the decision, then hands over to Member Care. No promise of a different outcome.' }
          ]
        },
        {
          text: 'When will I find out about my unsettled claims?',
          expect: {
            aoife: 'Only the GP claim is open: received 22 September, decision expected by 10 October, running late because of September volumes. Nothing needed from her.',
            ciaran: 'Only the GP claim is open: received 3 October, decision expected by 10 October, no delay.'
          }
        },
        {
          text: 'Why was my physio claim only partly paid?',
          expect: {
            aoife: '50% of each visit up to €30: €60 × 50% = €30 paid. 2 of 7 visits used, 5 left this policy year. Mentions the statement under Documents and tax relief on the €30 she paid.',
            ciaran: '50% of each visit up to €40: €70 × 50% = €35 paid. A fresh allowance of 8 visits started on 21 September 2026.'
          },
          paths: [
            { label: 'Dispute it', say: 'That’s wrong, I was told physio was fully covered on my plan', expect: 'Does not argue the rule: summarises the claim and your reason and hands over to the claims team.' }
          ]
        },
        {
          text: 'When does my policy renew and how do I pay?',
          expect: {
            aoife: 'Renews 31 January 2027, paid monthly by direct debit (account ending 5678). The September collection failed and is being retried, so expect that to be mentioned.',
            ciaran: 'Renews 21 September 2027. Paid by his employer, Kestrel Engineering, so there is nothing for him to pay.'
          }
        }
      ]
    },
    {
      id: 'cover',
      title: 'Am I covered?',
      note: 'A Fin procedure reads the member’s plan and says whether a treatment is covered, with the excess, limits and waiting periods. Aoife (One Plan Family) and Ciarán (Company Plan) get different answers.',
      member: true,
      prompts: [
        {
          text: 'Is physio covered on my plan?',
          expect: {
            aoife: 'Yes: 50% of each visit up to €30, 7 visits a year shared with chiro and osteopathy, 5 left this year, CORU-registered physio, no excess, no waiting period. No hospital question is asked.',
            ciaran: 'Yes: 50% of each visit up to €40, 8 visits a year, all 8 still available since the 21 September renewal, no excess, no waiting period.'
          },
          paths: [
            { label: 'Someone else on the policy', only: 'aoife', say: 'And for my daughter Saoirse?', expect: 'Same benefit for Saoirse, 0 of 7 used, no waiting periods because she was added as a newborn.' },
            { label: 'Someone who is not on the policy', say: 'And my mam, Breda?', expect: 'Breda is not on this policy, so Violet cannot check cover for her. Ends there.' },
            { label: 'How to claim it back', say: 'How do I claim it back?', expect: 'Snap & Send in MyVhi with a receipt showing the name, date, treatment, practitioner details and amount.' }
          ]
        },
        {
          text: 'My consultant says I need a hip replacement. Am I covered for that?',
          expect: 'A hospital operation with no hospital named, so Violet asks exactly one question: which hospital the consultant works from, or whether you don’t know yet.',
          paths: [
            { label: 'Private hospital', say: 'The Hermitage', expect: {
              aoife: 'Covered. €200 excess paid on admission plus a 20% co-payment of the hospital charges up to €2,000 (orthopaedic). Consultant fees at agreed charges. All waiting periods served.',
              ciaran: 'Full cover with no co-payment, just the €125 excess (first private admission this policy year). Flags that if the hip problem existed before 21 September 2024 it is not covered until 21 September 2029.'
            } },
            { label: 'Public hospital', say: 'St James’s', expect: 'Full cover, no excess, no co-payment, consultant fees at agreed charges.' },
            { label: 'Hi-tech hospital', say: 'The Beacon', expect: {
              aoife: 'Not covered on One Plan Family (only listed cardiac procedures are). She would pay the full hospital bill; the consultant may be able to operate in a covered private hospital instead.',
              ciaran: 'Partial cover: 80% day case or side room, 50% semi-private, 40% private room, plus the €125 excess. The hospital quotes the shortfall before admission.'
            } },
            { label: 'Hospital not known yet', say: 'I don’t know yet', expect: 'Gives the public and private position, then one line saying Blackrock, the Beacon and the Mater Private are different.' },
            { label: 'Written confirmation', say: 'Can you confirm that in writing for me?', expect: 'Summarises person, treatment, hospital and procedure code (if given) and hands over to the team.' }
          ]
        },
        {
          text: 'I’ve had a dodgy knee since college and my consultant wants to do an arthroscopy in the Beacon. Would I be covered?',
          expect: {
            aoife: 'No hospital question (the Beacon is named). The Beacon is not covered on One Plan Family for a non-cardiac procedure, so she would pay the full bill; in a covered private hospital it is full cover with the €200 excess. Her 5-year pre-existing waiting period was served in January 2024, so the old knee is not a problem.',
            ciaran: 'The Beacon is 80% of the day-case charges plus the €125 excess. The important part: the knee predates his 21 September 2024 start, so if Vhi’s medical advisers class it as pre-existing it is not covered until 21 September 2029. Offers to have the team assess it.'
          },
          paths: [
            { label: 'Ask for the pre-existing assessment', only: 'ciaran', say: 'Can someone assess whether my knee counts as pre-existing?', expect: 'Hands over with a summary of the person, treatment, hospital and the pre-existing question.' },
            { label: 'Change hospital', say: 'What if he does it in the Sports Surgery Clinic in Santry instead?', expect: {
              aoife: 'Full cover there, €200 excess on admission.',
              ciaran: 'Full cover there, €125 excess, with the same pre-existing caveat.'
            } },
            { label: 'Dispute', say: 'My broker told me the Beacon was covered on my plan', expect: 'Does not argue: summarises and hands over to the team.' }
          ]
        },
        {
          text: 'Is Saoirse covered for grommets?',
          expect: {
            aoife: 'Saoirse is her 6-year-old. A hospital procedure, so Violet asks which hospital. Public: full cover. Private: full cover, €200 excess. Beacon: not covered. No waiting periods apply to Saoirse.',
            ciaran: 'Saoirse is not on his policy, so Violet says it cannot check cover for her and stops. Good contrast with Aoife.'
          },
          paths: [
            { label: 'Private hospital', only: 'aoife', say: 'Bon Secours in Dublin', expect: 'Full cover, €200 excess paid on admission, consultant fees at agreed charges, no waiting period for Saoirse.' }
          ]
        },
        {
          text: 'Do I need a referral for an MRI?',
          expect: 'A scan, so no hospital question. Full cover at an approved MRI centre with a GP or consultant referral and an approved clinical indicator, billed directly to Vhi. €125 excess only if you pay the centre and claim back. Not covered abroad.',
          paths: [
            { label: 'Scan that needs prior approval', say: 'And a PET-CT scan?', expect: 'Covered only with prior approval from Vhi before the scan; the consultant submits the request.' },
            { label: 'Other imaging', say: 'What about a DEXA scan?', expect: 'Covered at a Vhi-approved out-patient centre with a consultant radiologist; at a non-approved centre only the radiologist’s fee is claimable.' }
          ]
        },
        {
          text: 'Would my plan cover a vasectomy?',
          expect: 'Not in the plan data, so Violet says it cannot confirm cover for that from the plan summary and does not guess. Offers two routes: enter the procedure code and hospital in Cover Check in MyVhi, or have the team confirm it.',
          paths: [
            { label: 'Let the team confirm', say: 'Please get someone to confirm it. The code my consultant gave me is 3570 and it’s the Hermitage', expect: 'Summarises person, treatment, hospital and code 3570, then hands over.' },
            { label: 'Self-serve', say: 'I’ll try Cover Check myself, thanks', expect: 'Ends the procedure politely without handing over.' }
          ]
        },
        {
          text: 'Am I covered for laser eye surgery?',
          expect: 'No. Not covered on either plan and no contribution is payable. No hospital question is asked.',
          paths: [
            { label: 'Eye test instead', say: 'What about an eye test?', expect: {
              aoife: 'Up to €25, once per person per policy year, 0 of 1 used. Glasses and lenses are not covered.',
              ciaran: 'Up to €30, once a year, 0 of 1 used since the new allowance began on 21 September 2026.'
            } },
            { label: 'Cataract surgery', say: 'And cataract surgery, if I ever needed it?', expect: {
              aoife: 'Asks which hospital. Private: covered with the 20% ophthalmic co-payment up to €2,000 plus the €200 excess. Public: full cover.',
              ciaran: 'Asks which hospital. Private: full cover, €125 excess, no co-payment. Beacon: 80% of day-case charges plus €125.'
            } }
          ]
        }
      ]
    },
    {
      id: 'actions',
      title: 'Get something done',
      note: 'Fin procedures that collect details, update Vhi systems or hand over to Member Care. The dates below are generated so they stay inside or outside the 13-week newborn window.',
      member: true,
      prompts: [
        {
          text: 'I’ve just recently had a baby and want to add her to my policy. How can I do this?',
          expect: {
            aoife: 'Congratulates her and asks for the baby’s full name and date of birth in one message.',
            ciaran: 'Congratulates him, then explains his policy is paid by Kestrel Engineering so Vhi adds the baby over the phone. Still collects the name and date of birth, then hands over to the team with an employer-paid summary.'
          },
          paths: [
            { label: 'Happy path', say: 'Róisín Murphy, born ' + BABY_OK, expect: 'Reads back name, date of birth, policy number and plan, cover from birth, free until the next renewal and no waiting periods, then asks you to confirm. Reply “Yes, that’s right” and Violet adds her, mentions the updated digital card under Documents and Snap & Send for GP visits.' },
            { label: 'Older than 13 weeks', say: 'Róisín Murphy, born ' + BABY_LATE, expect: 'The free window has passed: the team can still add her, a cost may apply, no price quoted. Asks if you want the team to arrange it. “Yes please” hands over; “No” gives the 056 444 4444 number.' },
            { label: 'Date that cannot be right', say: 'Róisín Murphy, born ' + BABY_FUTURE, expect: 'Says the date does not look right and asks again.' },
            { label: 'No details to hand', say: 'I don’t have her details with me right now', expect: 'Explains she can be added later in MyVhi under My Policies and ends.' }
          ]
        },
        {
          text: 'I had twins last month, can I add them to my plan?',
          expect: 'Congratulates once and asks for both babies’ full names and both dates of birth in a single reply.',
          paths: [
            { label: 'Both at once', say: 'Cian Murphy and Fiadh Murphy, both born ' + daysAgo(32), expect: 'One read-back with a line per baby, then “Yes” adds both (two Add Dependant calls, one confirmation naming both).' },
            { label: 'Only one baby given', say: 'Cian Murphy, born ' + daysAgo(32), expect: 'Thanks you and asks for the second baby’s full name and date of birth before going on.' },
            { label: 'More than two', say: 'Actually it was triplets: Cian, Fiadh and Tadhg Murphy, all born ' + daysAgo(32), expect: 'Collects all three, then hands over to the team to add them rather than submitting.' }
          ]
        },
        {
          text: 'I want to submit a claim for a physio visit',
          expect: 'Asks which person on the policy it was for and for a photo of the receipt or the typed details (name, date, treatment, practitioner details, amount). You can also upload any receipt photo with the Messenger paperclip and Violet reads it.',
          paths: [
            { label: 'Complete typed details', say: 'It was for me. Liffey Physio Clinic, physiotherapy on ' + VISIT + ', €60, treated by Sinéad Doyle, CORU reg PT012345', expect: 'Reads everything back and asks you to confirm. “Yes, submit it” returns a claim reference and the next step.' },
            { label: 'Missing detail', say: 'It was for me, a physio visit on ' + VISIT + ', €60', expect: 'Names exactly what is missing (practitioner name and details), does not submit, and says to resubmit through Snap & Send once the receipt shows it.' },
            { label: 'Wrong channel', say: 'Actually it’s a dental check-up receipt', expect: 'Dental cannot go through Snap & Send; points to the dental route in MyVhi and stops.' }
          ]
        }
      ]
    }
  ];

  var W = 384;
  var CSS = '\
.vhi-help{position:fixed;top:0;left:0;bottom:0;width:' + W + 'px;background:#1b2327;color:#e6eaec;z-index:150;display:flex;flex-direction:column;font-family:var(--font);transform:translateX(-100%);transition:transform .2s;box-shadow:2px 0 12px rgba(0,0,0,.25);font-size:13.5px;line-height:1.45}\
.vhi-help *{box-sizing:border-box}\
body.vhi-help-open .vhi-help{transform:none}\
body.vhi-help-open{padding-left:' + W + 'px}\
.vhi-help button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;text-align:left;padding:0}\
.vhi-help-head{padding:20px 20px 14px;border-bottom:1px solid rgba(255,255,255,.08)}\
.vhi-help-head-row{display:flex;align-items:center;justify-content:space-between}\
.vhi-help-head h2{margin:0;font-size:18px;font-weight:650;letter-spacing:-.01em}\
.vhi-help-close{color:#9aa5aa;font-size:22px;line-height:1;padding:0 2px}\
.vhi-help-close:hover{color:#fff}\
.vhi-help-how{margin:6px 0 0;font-size:12.5px;color:#aab4b9}\
.vhi-help-how b{color:#e6eaec;font-weight:600}\
.vhi-help-who{display:flex;align-items:center;gap:10px;margin:14px 0 0;padding:10px 12px;background:#242f34;border-radius:10px}\
.vhi-help-who .av{width:30px;height:30px;border-radius:50%;background:var(--vhi-accent,#8329b7);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex:none}\
.vhi-help-who .av.off{background:#3a474d;color:#cfd6d9}\
.vhi-help-who .t{font-size:12.5px;color:#aab4b9}\
.vhi-help-who .t b{display:block;color:#fff;font-weight:600;font-size:13.5px}\
.vhi-help-jump{display:flex;gap:6px;flex-wrap:wrap;padding:12px 20px 0}\
.vhi-help-jump button{font-size:12px;color:#cfd6d9;background:#242f34;border-radius:999px;padding:5px 11px}\
.vhi-help-jump button:hover{background:#2f3c42;color:#fff}\
.vhi-help-body{flex:1;overflow-y:auto;padding:6px 20px 20px}\
.vhi-help-group{padding-top:22px}\
.vhi-help-group h3{margin:0 0 4px;font-size:14.5px;font-weight:650;color:#fff}\
.vhi-help-group>p{margin:0 0 12px;font-size:12.5px;color:#aab4b9}\
.vhi-help-card{background:#242f34;border:1px solid transparent;border-radius:12px;margin-bottom:8px;transition:border-color .15s}\
.vhi-help-card:hover{border-color:rgba(131,41,183,.6)}\
.vhi-help-row{display:flex;align-items:flex-start;gap:10px;padding:11px 12px 11px 12px}\
.vhi-help-num{flex:none;width:22px;height:22px;border-radius:50%;background:#33414799;color:#cfd6d9;font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;margin-top:1px}\
.vhi-help-send{flex:1;display:flex;align-items:flex-start;justify-content:space-between;gap:8px;color:#fff;font-size:14px;line-height:1.4}\
.vhi-help-send .ask{flex:none;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#b48ad8;margin-top:3px;opacity:0;transition:opacity .15s}\
.vhi-help-card:hover .vhi-help-send .ask{opacity:1}\
.vhi-help-send .lock{flex:none;font-size:10.5px;letter-spacing:.04em;text-transform:uppercase;color:#cfd6d9;background:rgba(255,255,255,.1);border-radius:999px;padding:3px 8px;margin-top:1px}\
.vhi-help-copy{flex:none;color:#8d989d;padding:2px 5px;border-radius:6px;font-size:14px;line-height:1}\
.vhi-help-copy:hover{background:rgba(255,255,255,.1);color:#fff}\
.vhi-help-toggle{display:flex;align-items:center;gap:6px;width:100%;padding:0 12px 10px 44px;font-size:12.5px;color:#b48ad8}\
.vhi-help-toggle:hover{color:#fff}\
.vhi-help-toggle .tri{display:inline-block;transition:transform .15s;font-size:9px}\
.vhi-help-card.open .vhi-help-toggle .tri{transform:rotate(90deg)}\
.vhi-help-script{display:none;border-top:1px solid rgba(255,255,255,.07);padding:12px 12px 4px}\
.vhi-help-card.open .vhi-help-script{display:block}\
.vhi-help-msg{display:flex;gap:8px;margin-bottom:8px;align-items:flex-start}\
.vhi-help-msg.you{justify-content:flex-end}\
.vhi-help-msg .av{flex:none;width:20px;height:20px;border-radius:50%;background:var(--vhi-accent,#8329b7);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:6px}\
.vhi-help-bub{max-width:88%;padding:8px 11px;border-radius:14px;font-size:13px;line-height:1.45}\
.vhi-help-msg.violet .vhi-help-bub{background:#2f3b41;color:#dfe5e8;border-bottom-left-radius:4px}\
.vhi-help-msg.you .vhi-help-bub{background:#5a2a8a;color:#fff;border-bottom-right-radius:4px;display:flex;align-items:flex-start;gap:8px}\
.vhi-help-msg.you .vhi-help-bub.static{background:#4a3a5c}\
.vhi-help-say{flex:1;color:#fff}\
button.vhi-help-say:hover{text-decoration:underline}\
.vhi-help-msg.you .vhi-help-copy{color:#d9c6ea;padding:0 2px}\
.vhi-help-who-line{display:block}\
.vhi-help-who-line+.vhi-help-who-line{margin-top:6px}\
.vhi-help-who-line .chip{display:inline-block;font-size:10.5px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:#fff;background:rgba(131,41,183,.6);border-radius:999px;padding:1px 7px;margin-right:6px;vertical-align:1px}\
.vhi-help-then{margin:14px 0 10px;font-size:12px;color:#8d989d;display:flex;align-items:center;gap:10px}\
.vhi-help-then:before,.vhi-help-then:after{content:"";flex:1;height:1px;background:rgba(255,255,255,.08)}\
.vhi-help-path{margin:0 0 14px}\
.vhi-help-path-label{font-size:12px;color:#b48ad8;margin:0 0 6px 2px;font-weight:600}\
.vhi-help-path-label .only{font-weight:500;color:#8d989d}\
.vhi-help-foot{padding:12px 20px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#8d989d;display:flex;gap:14px}\
.vhi-help-foot kbd{font:inherit;color:#cfd6d9;background:#242f34;border-radius:5px;padding:1px 6px}\
.vhi-help-tab{position:fixed;top:84px;left:0;z-index:150;background:#1b2327;color:#fff;border:0;border-radius:0 999px 999px 0;padding:9px 14px 9px 12px;font:600 13px var(--font);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}\
body.vhi-help-open .vhi-help-tab{display:none}\
body.vhi-help-open .presenter-bar{left:' + W + 'px}\
.vhi-help-toast{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);background:#1b2327;color:#fff;padding:10px 16px;border-radius:999px;font-size:13px;z-index:300;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center}\
.vhi-help-toast.show{opacity:1}\
@media (max-width:1100px){body.vhi-help-open{padding-left:0}}';

  var vhi = window.vhiDemo;
  if (!vhi) return;
  var persona = vhi.isPortal() ? vhi.currentPersona() : null;
  var signedIn = !!persona;
  var flat = [];    // main prompts, ⌥1–9
  var follow = [];  // follow-up replies inside the scripts

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function norm(p) { return typeof p === 'string' ? { text: p } : p; }
  function cap(k) { return k === 'aoife' ? 'Aoife' : 'Ciarán'; }

  function expectHtml(e) {
    if (!e) return '';
    if (typeof e === 'string') return esc(e);
    if (persona && e[persona]) return esc(e[persona]);
    return '<span class="vhi-help-who-line"><span class="chip">Aoife</span>' + esc(e.aoife || '') + '</span>' +
      '<span class="vhi-help-who-line"><span class="chip">Ciarán</span>' + esc(e.ciaran || '') + '</span>';
  }
  function violet(html) {
    return '<div class="vhi-help-msg violet"><span class="av">V</span><div class="vhi-help-bub">' + html + '</div></div>';
  }
  function youStatic(text) {
    return '<div class="vhi-help-msg you"><div class="vhi-help-bub static"><span class="vhi-help-say">' + esc(text) + '</span></div></div>';
  }
  function youReply(text) {
    var f = follow.length;
    follow.push(text);
    return '<div class="vhi-help-msg you"><div class="vhi-help-bub">' +
      '<button class="vhi-help-say" data-f="' + f + '" title="Put this reply in the Messenger">' + esc(text) + '</button>' +
      '<button class="vhi-help-copy" data-fc="' + f + '" title="Copy">&#x2398;</button></div></div>';
  }

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
    toast('In the Messenger. Press send.');
  }

  function copy(prompt) {
    var done = function () { toast('Copied to clipboard'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(prompt).then(done, done);
    else done();
  }

  // Follow-ups only make sense mid-conversation, so never open the sign-in modal for them.
  function sendFollow(text) {
    if (!signedIn) { copy(text); return; }
    vhi.say(text);
    toast('Reply is in the Messenger. Press send.');
  }

  function setOpen(open) {
    document.body.classList.toggle('vhi-help-open', open);
    localStorage.setItem('vhi_help_closed', open ? '0' : '1');
  }

  function cardHtml(p, member) {
    var i = flat.length;
    flat.push({ prompt: p.text, member: member });
    var tail = (member && !signedIn) ? '<span class="lock">Sign in</span>' : '<span class="ask">Ask &rsaquo;</span>';
    var html = '<div class="vhi-help-card"><div class="vhi-help-row"><span class="vhi-help-num">' + (i + 1) + '</span>' +
      '<button class="vhi-help-send" data-i="' + i + '" title="Ask Violet (⌥' + (i + 1) + ')"><span>' + esc(p.text) + '</span>' + tail + '</button>' +
      '<button class="vhi-help-copy" data-i="' + i + '" title="Copy">&#x2398;</button></div>';
    var paths = (p.paths || []).filter(function (x) { return !x.only || !persona || x.only === persona; });
    if (!p.expect && !paths.length) return html + '</div>';
    html += '<button class="vhi-help-toggle" data-toggle="1"><span class="tri">&#9654;</span> What happens next</button>';
    html += '<div class="vhi-help-script">' + youStatic(p.text);
    if (p.expect) html += violet(expectHtml(p.expect));
    if (paths.length) {
      html += '<div class="vhi-help-then">Then reply with one of these</div>';
      paths.forEach(function (path) {
        var only = (path.only && !persona) ? ' <span class="only">· ' + cap(path.only) + ' only</span>' : '';
        html += '<div class="vhi-help-path"><div class="vhi-help-path-label">' + esc(path.label) + only + '</div>' +
          youReply(path.say) + violet(expectHtml(path.expect)) + '</div>';
      });
    }
    return html + '</div></div>';
  }

  function whoHtml() {
    if (signedIn) {
      var name = vhi.PERSONAS[persona].name;
      return '<div class="vhi-help-who"><span class="av">' + esc(name.charAt(0)) + '</span><span class="t"><b>' + esc(name) + '</b>' +
        esc(PLAN[persona] || '') + ' · answers below are for this member</span></div>';
    }
    return '<div class="vhi-help-who"><span class="av off">?</span><span class="t"><b>Not signed in</b>Member questions will ask you to pick Aoife or Ciarán first</span></div>';
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var html = '<div class="vhi-help-head"><div class="vhi-help-head-row"><h2>Demo script</h2>' +
      '<button class="vhi-help-close" aria-label="Close" title="Close (?)">&times;</button></div>' +
      '<p class="vhi-help-how"><b>Click a question</b> to put it in the Messenger, then press send. Open <b>What happens next</b> to see Violet’s expected answer and which reply to give.</p>' +
      whoHtml() + '</div>';
    html += '<div class="vhi-help-jump">' + GROUPS.map(function (g) {
      return '<button data-jump="' + g.id + '">' + esc(g.title) + '</button>';
    }).join('') + '</div>';
    html += '<div class="vhi-help-body">';
    GROUPS.forEach(function (g) {
      html += '<div class="vhi-help-group" id="vhi-help-' + g.id + '"><h3>' + esc(g.title) + '</h3><p>' + esc(g.note) + '</p>';
      g.prompts.forEach(function (p) { html += cardHtml(norm(p), g.member); });
      html += '</div>';
    });
    html += '</div><div class="vhi-help-foot"><span><kbd>⌥ 1–9</kbd> ask question 1–9</span><span><kbd>?</kbd> hide this panel</span></div>';

    var panel = document.createElement('aside');
    panel.className = 'vhi-help';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    var tab = document.createElement('button');
    tab.className = 'vhi-help-tab';
    tab.innerHTML = '&#9776;&nbsp; Demo script';
    document.body.appendChild(tab);

    toastEl = document.createElement('div');
    toastEl.className = 'vhi-help-toast';
    document.body.appendChild(toastEl);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('vhi-help-close')) return setOpen(false);
      if (b.dataset.jump) { var g = document.getElementById('vhi-help-' + b.dataset.jump); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      if (b.dataset.toggle) return b.closest('.vhi-help-card').classList.toggle('open');
      if (b.dataset.f !== undefined) return sendFollow(follow[+b.dataset.f]);
      if (b.dataset.fc !== undefined) return copy(follow[+b.dataset.fc]);
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
