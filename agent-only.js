'use strict';
let activeOrb=null,based=false;
const screen=document.querySelector('#screen');
const screenshotFeedback = [
 {slot:'Hush',left:35.6,summary:'Players often praise this teammate’s communication.',tags:['Clear calls','Helpful information']},
 {slot:'Yoru',left:42.7,summary:'Players often praise this player’s in-game leadership and strategies.',tags:['In-game leadership','Shares strategies']},
 {slot:'Jett',left:56.9,summary:'Players often praise this teammate’s aim.',tags:['Strong aim']},
 {slot:'Cypher',left:63.9,summary:'Players often say that this player doesn’t communicate often.',tags:['Rarely uses comms']}
];
function renderBoard(){screen.innerHTML=`<section aria-label="Agent select screenshot with illustrative Squadnote feedback" class="screenshot-board"><div class="screenshot-frame"><img src="assets/agent-select-blurred.webp" width="1919" height="1079" alt="VALORANT agent select screenshot with teammate names blurred. The pictured mode is Swiftplay; Squadnote supports Competitive only.">${screenshotFeedback.map((p,i)=>`<button class="orb shot-orb color" style="left:${p.left}%;top:74.1%" data-orb="${i}" aria-label="Open feedback for ${p.slot} slot" aria-expanded="${activeOrb===i}" aria-controls="summary-card"><span></span></button>`).join('')}</div><p class="screenshot-caption">Screenshot from a VALORANT agent select with Squadnote orbs added as an illustration. Teammate names blurred. Squadnote supports Competitive only.</p><div class="mobile-orb-controls" role="group" aria-label="Teammate feedback controls">${screenshotFeedback.map((p,i)=>`<button data-orb="${i}" aria-label="Open feedback for ${p.slot} slot" aria-expanded="${activeOrb===i}">${p.slot}</button>`).join('')}</div><div class="summary-lane" id="summary-lane">${summaryCard()}</div></section>`;}
function summaryCard(){if(activeOrb===null)return '<p class="orb-hint">Tap a teammate’s orb to open Squadnote feedback.</p>';const p=screenshotFeedback[activeOrb];return `<article id="summary-card" class="summary-card" aria-label="Feedback for ${p.slot} slot"><div><span class="wordmark">squadnote.</span><button id="close-card" aria-label="Close summary">×</button></div><small>${p.slot} slot</small><p>${p.summary}</p><button id="based" class="based" aria-expanded="${based}">See what this is based on</button>${based?`<div class="basis"><strong>Preset tags</strong><p>${p.tags.length?p.tags.join(' · '):'Too few contributions to show a pattern.'}</p><p>A summary requires the minimum review threshold across different reviewers. Threshold to be published before launch. Fictional example.</p></div>`:''}</article>`;}
function updateCard(){document.querySelector('#summary-lane').innerHTML=summaryCard();document.querySelectorAll('[data-orb]').forEach(b=>b.setAttribute('aria-expanded',Number(b.dataset.orb)===activeOrb));}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(b?.dataset.orb!==undefined){let i=Number(b.dataset.orb);if(b.classList.contains('shot-orb')&&e.detail>0){const r=b.closest('.screenshot-frame').getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100;i=screenshotFeedback.reduce((best,p,n)=>Math.abs(p.left-x)<Math.abs(screenshotFeedback[best].left-x)?n:best,0);}activeOrb=activeOrb===i?null:i;based=false;updateCard();return;}
 if(b?.id==='based'){based=!based;updateCard();return;}
 if(activeOrb!==null&&(!e.target.closest('.summary-card')||b?.id==='close-card')){activeOrb=null;based=false;updateCard();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeOrb!==null){activeOrb=null;based=false;updateCard();}});
renderBoard();
