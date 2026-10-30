'use strict';
const players = [
 {name:'Demo_Cedar',initial:'CD',state:'Locked',summary:'Players often say this teammate communicates clearly',tags:['Clear calls','Helpful information']},
 {name:'Demo_Quartz',initial:'QZ',state:'Picking...',summary:'Players often say this teammate can get frustrated when behind',tags:['Frustrated when behind']},
 {name:'Demo_Mallow',initial:'ML',state:'Picking...',summary:'Players often say this teammate rarely uses comms',tags:['Rarely uses comms']},
 {name:'Demo_Orbit',initial:'OB',state:'Locked',summary:'Not enough feedback yet',tags:[]}
];
const groups = {Communication:['Clear calls','Helpful information','Rarely uses comms'],Teamwork:['Supports teammates','Works with the team'],Composure:['Calm under pressure','Frustrated when behind'],Playstyle:['Patient approach','Takes initiative']};
const titles=['Connect your account','Agent select','Post-game feedback','How a summary is built','Your profile and privacy'];
const captions=[
 ['Connect with a sample account','This is the planned account-linking screen. Tap “Continue with sample account” to enter the demo.'],
 ['Try the teammate orbs','Tap each orb above the teammate slots to read their summary. Open at least one to unlock Next. Tap the orb again or an empty area to close the card.'],
 ['Leave sample feedback','Choose a teammate, tap preset tags, then press Submit sample feedback. Your choices stay in memory for this demo.'],
 ['Follow the planned review rules','Tap each stage to read how a shared match and contributions from different reviewers would lead to a summary.'],
 ['Try the privacy controls','Tap Dispute, Request removal or Delete my data. Each button shows a sample confirmation and collects nothing.']
];
let step=0,free=false,connected=false,opened=false,submitted=false,activeOrb=null,based=false,selectedPlayer=0,rule=0;
const selections=players.map(()=>new Set());
const screen=document.querySelector('#screen');
const rules=[['Shared-match verification','Verify that the reviewer and teammate were in the same Competitive match.'],['One review per teammate per match','Accept one submission about each teammate for that match. Repeated taps do not add reviews.'],['Reviewer checks','Apply planned filters for premade-party feedback and brand-new accounts, with checks for unusual submission spikes.'],['Minimum different reviewers','Wait for the minimum number of different reviewers to report a recurring pattern before any summary appears. The threshold will be published before launch.']];
function go(n){step=n;activeOrb=null;based=false;render();screen.focus();}
function render(){
 document.querySelector('#step-count').textContent=`Step ${step+1} of 5${free?' · Free exploration':''}`;
 document.querySelector('#back').disabled=step===0;
 const blocked=!free&&((step===0&&!connected)||(step===1&&!opened)||(step===2&&!submitted));
 document.querySelector('#next').disabled=blocked;
 document.querySelector('#next').textContent=step===4?'Restart': 'Next';
 document.querySelector('#coach-title').textContent=captions[step][0];
 document.querySelector('#coach-copy').textContent=free?'Explore any screen using the tabs above. All actions use fictional data.':captions[step][1];
 document.querySelector('#explore').hidden=!free;
 document.querySelector('#skip').textContent=free?'Restart tutorial':'Skip tutorial';
 document.querySelector('#explore').innerHTML=titles.map((t,i)=>`<button data-go="${i}" aria-current="${i===step?'step':'false'}">${i+1}. ${t}</button>`).join('');
 if(step===0)screen.innerHTML=`<section class="connect panel"><p class="eyebrow">PLANNED ACCOUNT LINKING</p><h2>Connect your account</h2><p>In the app, Riot Sign On would verify your Riot account and present the data-sharing choices before you continue.</p><div class="consent"><strong>What linking is for</strong><p>Your account identifies feedback you submit and supports shared-match verification. Player visibility and sharing controls will follow Riot’s guidance before launch.</p></div><button class="primary" id="sample">Continue with sample account</button><p class="fine">This sample button opens the next screen. No credentials or personal data are requested.</p></section>`;
 if(step===1)renderBoard();
 if(step===2)renderFeedback();
 if(step===3)screen.innerHTML=`<section class="panel"><p class="eyebrow">PLANNED RULES</p><h2>How a summary is built</h2><p>Four checks between a finished match and a shared summary.</p><ol class="rule-flow">${rules.map((r,i)=>`<li><button data-rule="${i}" aria-pressed="${rule===i}"><span>${i+1}</span>${r[0]}</button></li>`).join('')}</ol><div class="rule-detail" role="status"><h3>${rules[rule][0]}</h3><p>${rules[rule][1]}</p></div><p class="fine">Planned rules, illustrated here. This demo does not verify matches or evaluate real reviewers.</p></section>`;
 if(step===4)screen.innerHTML=`<section class="panel profile"><p class="eyebrow">YOUR SAMPLE PROFILE</p><h2>Demo_You</h2><blockquote>“Players often say this teammate communicates clearly”</blockquote><p>Community summary · fictional data</p><div class="privacy-actions"><button data-privacy="dispute">Dispute</button><button data-privacy="remove">Request removal</button><button data-privacy="delete">Delete my data</button></div><p id="privacy-status" role="status" class="confirmation">Choose an action to preview its confirmation.</p></section>`;
}
const screenshotFeedback = [
 {slot:'Hush',left:35.6,summary:'PLAYERS OFTEN PRAISE THIS TEAMMATES COMMUNICATION',tags:['Clear calls','Helpful information']},
 {slot:'Yoru',left:42.7,summary:'PLAYERS OFTEN PRAISE THIS PLAYERS IN GAME LEADERSHIP AND STRATEGIES',tags:['In-game leadership','Shares strategies']},
 {slot:'Jett',left:56.9,summary:'PLAYERS OFTEN PRAISE THIS TEAMMATES AIM',tags:['Strong aim']},
 {slot:'Cypher',left:63.9,summary:'PLAYERS OFTEN SAY THAT THIS PLAYER DOESNT COMMUNICATE OFTEN',tags:['Rarely uses comms']}
];
function renderBoard(){screen.innerHTML=`<section aria-label="Agent select screenshot with illustrative Squadnote feedback" class="screenshot-board"><div class="screenshot-frame"><img src="assets/agent-select-blurred.webp" width="1919" height="1079" alt="VALORANT agent select screenshot with teammate names blurred. The pictured mode is Swiftplay; Squadnote supports Competitive only.">${screenshotFeedback.map((p,i)=>`<button class="orb shot-orb color" style="left:${p.left}%;top:74.1%" data-orb="${i}" aria-label="Open feedback for ${p.slot} slot" aria-expanded="${activeOrb===i}" aria-controls="summary-card"><span></span></button>`).join('')}</div><p class="screenshot-caption">Screenshot from a VALORANT agent select with Squadnote orbs added as an illustration. Teammate names blurred. Squadnote supports Competitive only.</p><div class="mobile-orb-controls" role="group" aria-label="Teammate feedback controls">${screenshotFeedback.map((p,i)=>`<button data-orb="${i}" aria-label="Open feedback for ${p.slot} slot" aria-expanded="${activeOrb===i}">${p.slot}</button>`).join('')}</div><div class="summary-lane" id="summary-lane">${summaryCard()}</div></section>`;}
function summaryCard(){if(activeOrb===null)return '<p class="orb-hint">Tap a teammate’s orb to open Squadnote feedback.</p>';const p=screenshotFeedback[activeOrb];return `<article id="summary-card" class="summary-card" aria-label="Feedback for ${p.slot} slot"><div><span class="wordmark">squadnote.</span><button id="close-card" aria-label="Close summary">×</button></div><small>${p.slot} slot</small><p>${p.summary}</p><button id="based" class="based" aria-expanded="${based}">See what this is based on</button>${based?`<div class="basis"><strong>Preset tags</strong><p>${p.tags.length?p.tags.join(' · '):'Too few contributions to show a pattern.'}</p><p>A summary requires the minimum review threshold across different reviewers. Threshold to be published before launch. Fictional example.</p></div>`:''}</article>`;}
function renderFeedback(){screen.innerHTML=`<section class="panel feedback"><p class="eyebrow">COMPETITIVE / MATCH COMPLETE</p><h2>How was your team?</h2><p>Select a teammate and choose tags about that match. You can leave feedback for all four.</p><div class="teammate-tabs" role="group" aria-label="Choose a teammate">${players.map((p,i)=>`<button data-player="${i}" aria-pressed="${selectedPlayer===i}">${p.name}<small>${selections[i].size} selected</small></button>`).join('')}</div><h3>Feedback for ${players[selectedPlayer].name}</h3>${Object.entries(groups).map(([g,tags])=>`<fieldset><legend>${g}</legend><div class="tag-list">${tags.map(t=>`<button data-tag="${t}" aria-pressed="${selections[selectedPlayer].has(t)}">${t}</button>`).join('')}</div></fieldset>`).join('')}<button id="submit-tags" class="primary" ${selections.every(s=>s.size===0)?'disabled':''}>Submit sample feedback</button><p role="status" class="confirmation">${submitted?'Sample feedback submitted. These choices stay in this demo session; nothing was sent.':'Shared feedback uses preset tags. No free text.'}</p></section>`;}
function updateCard(){document.querySelector('#summary-lane').innerHTML=summaryCard();document.querySelectorAll('[data-orb]').forEach(b=>b.setAttribute('aria-expanded',Number(b.dataset.orb)===activeOrb));document.querySelector('#next').disabled=false;}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(b?.id==='skip'){free=!free;if(!free){step=0;connected=false;opened=false;submitted=false;}render();return;}
 if(b?.id==='sample'){connected=true;go(1);return;}
 if(b?.id==='back'){if(step>0)go(step-1);return;}
 if(b?.id==='next'){if(step===4){step=0;connected=false;opened=false;submitted=false;render();}else go(step+1);return;}
 if(b?.dataset.go!==undefined){go(Number(b.dataset.go));return;}
 if(b?.dataset.orb!==undefined){let i=Number(b.dataset.orb);
 // At narrow widths the 44px targets overlap. Resolve pointer taps to the
 // nearest visual orb; keyboard activation retains the focused button.
 if(b.classList.contains('shot-orb')&&e.detail>0){const r=b.closest('.screenshot-frame').getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100;i=screenshotFeedback.reduce((best,p,n)=>Math.abs(p.left-x)<Math.abs(screenshotFeedback[best].left-x)?n:best,0);}
 activeOrb=activeOrb===i?null:i;based=false;opened=true;updateCard();return;}
 if(b?.id==='based'){based=!based;updateCard();return;}
 if(b?.dataset.agent){document.querySelector('#agent-choice').textContent=`Placeholder ${b.dataset.agent} selected`;document.querySelectorAll('[data-agent]').forEach(x=>x.setAttribute('aria-pressed',x===b));return;}
 if(b?.dataset.player!==undefined){selectedPlayer=Number(b.dataset.player);renderFeedback();return;}
 if(b?.dataset.tag){const set=selections[selectedPlayer];set.has(b.dataset.tag)?set.delete(b.dataset.tag):set.add(b.dataset.tag);submitted=false;renderFeedback();document.querySelector('#next').disabled=!free;const focus=[...document.querySelectorAll('[data-tag]')].find(x=>x.dataset.tag===b.dataset.tag);focus.focus();return;}
 if(b?.id==='submit-tags'){submitted=true;renderFeedback();document.querySelector('#next').disabled=false;document.querySelector('#submit-tags').focus();return;}
 if(b?.dataset.rule!==undefined){rule=Number(b.dataset.rule);render();document.querySelector(`[data-rule="${rule}"]`).focus();return;}
 if(b?.dataset.privacy){const messages={dispute:'Demo confirmation: your dispute would be submitted for review.',remove:'Demo confirmation: your summary removal request would be received.',delete:'Demo confirmation: an account-data deletion request would be received.'};document.querySelector('#privacy-status').textContent=messages[b.dataset.privacy]+' Nothing was collected or sent.';return;}
 if(step===1&&activeOrb!==null&&(!e.target.closest('.summary-card')||b?.id==='close-card')){activeOrb=null;based=false;updateCard();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&step===1&&activeOrb!==null){const i=activeOrb;activeOrb=null;based=false;updateCard();document.querySelector(`[data-orb="${i}"]`).focus();}});
render();
