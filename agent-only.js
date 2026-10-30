'use strict';
let activeOrb=null,based=false,opened=false;const step=1;const screen=document.querySelector('#screen');
const screenshotFeedback = [
 {slot:'Hush',left:35.6,summary:'Players often praise this teammate’s communication.',tags:['Clear calls','Helpful information']},
 {slot:'Yoru',left:42.7,summary:'Players often praise this player’s in-game leadership and strategies.',tags:['In-game leadership','Shares strategies']},
 {slot:'Jett',left:56.9,summary:'Players often praise this teammate’s aim.',tags:['Strong aim']},
 {slot:'Cypher',left:63.9,summary:'Players often say that this player doesn’t communicate often.',tags:['Rarely uses comms']}
];
function renderBoard(){screen.innerHTML=`<section aria-label="Interactive agent select screenshot" class="screenshot-board"><div class="screenshot-frame"><img src="assets/agent-select-blurred.webp" width="1919" height="1079" alt="VALORANT agent select illustration; teammate names blurred. Squadnote supports Competitive only."><span class="hover-prompt">Hover or tap a glowing orb</span>${screenshotFeedback.map((p,i)=>`<button class="orb shot-orb color" style="left:${p.left}%;top:74.1%" data-orb="${i}" aria-label="Open feedback for ${p.slot} slot" aria-expanded="false"><span></span></button>`).join('')}<div id="summary-lane"></div></div></section>`;}
function summaryCard(){if(activeOrb===null)return '';const p=screenshotFeedback[activeOrb];return `<article id="summary-card" class="summary-card" aria-label="Feedback for ${p.slot} slot"><div><span class="wordmark">squadnote.</span><button id="close-card" aria-label="Close summary">×</button></div><p>${p.summary}</p></article>`;}
function updateCard(){
 document.querySelector('#summary-lane').innerHTML=summaryCard();
 document.querySelectorAll('[data-orb]').forEach(b=>b.setAttribute('aria-expanded',Number(b.dataset.orb)===activeOrb));

 const card=document.querySelector('#summary-card');
 if(card){const orb=document.querySelector(`[data-orb="${activeOrb}"]`).getBoundingClientRect();const r=card.getBoundingClientRect();card.style.left=`${Math.max(8,Math.min(innerWidth-r.width-8,orb.left+orb.width/2-r.width/2))}px`;card.style.top=`${Math.max(54,orb.top-r.height-12)}px`;}
}
document.addEventListener('pointerover',e=>{const orb=e.target.closest('.shot-orb');if(step===1&&orb&&e.pointerType==='mouse'){const i=Number(orb.dataset.orb);if(activeOrb!==i){activeOrb=i;opened=true;updateCard();}}});
document.addEventListener('pointerout',e=>{if(step===1&&e.pointerType==='mouse'&&e.target.closest('.screenshot-frame')&&!e.relatedTarget?.closest?.('.screenshot-frame')){activeOrb=null;updateCard();}});
document.addEventListener('focusin',e=>{const orb=e.target.closest('.shot-orb');if(step===1&&orb&&orb.matches(':focus-visible')){activeOrb=Number(orb.dataset.orb);opened=true;updateCard();}});
window.addEventListener('resize',()=>{if(step===1)updateCard();});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(b?.dataset.orb!==undefined){let i=Number(b.dataset.orb);if(b.classList.contains('shot-orb')&&e.detail>0){const r=b.closest('.screenshot-frame').getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100;i=screenshotFeedback.reduce((best,p,n)=>Math.abs(p.left-x)<Math.abs(screenshotFeedback[best].left-x)?n:best,0);}activeOrb=activeOrb===i&&e.pointerType!=='mouse'?null:i;based=false;updateCard();return;}
 if(b?.id==='based'){based=!based;updateCard();return;}
 if(activeOrb!==null&&(!e.target.closest('.summary-card')||b?.id==='close-card')){activeOrb=null;based=false;updateCard();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeOrb!==null){activeOrb=null;based=false;updateCard();}});
renderBoard();
