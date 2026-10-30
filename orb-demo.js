'use strict';
const entries=[
 {x:35.6,text:'Players often praise this teammate’s communication.'},
 {x:42.7,text:'Players often praise this player’s in-game leadership and strategies.'},
 {x:56.9,text:'Players often praise this teammate’s aim.'},
 {x:63.9,text:'Players often say that this player doesn’t communicate often.'}
];
let active=null;
const host=document.querySelector('#popup-host');
function close(){active=null;host.replaceChildren();document.querySelectorAll('.orb').forEach(b=>b.setAttribute('aria-expanded','false'));}
function open(i){active=i;host.innerHTML=`<article class="summary" role="status"><header><span class="wordmark">squadnote.</span><button class="close" aria-label="Close summary">×</button></header><p>${entries[i].text}</p></article>`;document.querySelectorAll('.orb').forEach(b=>b.setAttribute('aria-expanded',Number(b.dataset.index)===i));position();}
function position(){if(active===null)return;const card=host.firstElementChild;const r=card.getBoundingClientRect();const orb=document.querySelector(`[data-index="${active}"]`).getBoundingClientRect();card.style.left=`${Math.max(8,Math.min(innerWidth-r.width-8,orb.left+orb.width/2-r.width/2))}px`;card.style.top=`${Math.max(8,orb.top-r.height-12)}px`;}
document.addEventListener('pointerover',e=>{const b=e.target.closest('.orb');if(b&&e.pointerType==='mouse')open(Number(b.dataset.index));else if(e.pointerType==='mouse'&&!e.target.closest('.summary')&&!e.relatedTarget?.closest?.('.orb'))close();});
document.addEventListener('click',e=>{const b=e.target.closest('.orb');if(b){let i=Number(b.dataset.index);if(e.detail>0){const r=document.querySelector('.image-scene').getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100;i=entries.reduce((best,p,n)=>Math.abs(p.x-x)<Math.abs(entries[best].x-x)?n:best,0);}if(active===i&&e.pointerType!=='mouse')close();else open(i);}else if(!e.target.closest('.summary')||e.target.closest('.close'))close();});
document.addEventListener('focusin',e=>{const b=e.target.closest('.orb');if(b&&b.matches(':focus-visible'))open(Number(b.dataset.index));});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
window.addEventListener('resize',position);
window.addEventListener('scroll',close,{passive:true});
