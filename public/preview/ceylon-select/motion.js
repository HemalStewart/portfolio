import Lenis from '/showcase/_engine/vendor/lenis.mjs';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let reduce=reduced.matches;
const main=document.querySelector('main');main.inert=true;
const start=performance.now();let ready=false;
if(!reduce)document.body.classList.add('is-opening');
function reveal(){if(ready)return;ready=true;document.body.classList.add('is-ready');document.body.classList.remove('is-opening');main.inert=false;lenis?.start();measure();restoreHash()}
const heroImage=document.querySelector('.hero-tin');
const imageReady=heroImage.complete?Promise.resolve():new Promise(r=>{heroImage.addEventListener('load',r,{once:true});heroImage.addEventListener('error',r,{once:true})});
imageReady.then(()=>document.querySelector('.opening').classList.add('has-media'));
Promise.all([document.fonts.ready,imageReady]).then(()=>setTimeout(reveal,Math.max(0,(reduce?0:1300)-(performance.now()-start))));setTimeout(reveal,3300);
if(!reduce)document.body.classList.add('motion-enabled');
const lenis=reduce?null:new Lenis({lerp:.1,smoothWheel:true,syncTouch:false,prevent:n=>!!n.closest?.('dialog')});lenis?.stop();
const sections=[...document.querySelectorAll('.scroll-scene')],metrics=[];
const origin=document.querySelector('.origin'),chapters=[...document.querySelectorAll('.tea-chapter')],journey=document.querySelector('.journey'),ritual=document.querySelector('.ritual'),steps=[...document.querySelectorAll('.ritual-step')],closing=document.querySelector('.closing'),closingProducts=[...document.querySelectorAll('.closing-product')],hero=document.querySelector('.hero');
const clamp=n=>Math.max(0,Math.min(1,n));const ease=n=>{n=clamp(n);return n*n*(3-2*n)};const phase=(p,a,b)=>ease((p-a)/(b-a));
let height=innerHeight,lastY=-1,lastChapter=-1,heroTop=0,heroHeight=1,heroActive=false;
function measure(){height=innerHeight;document.documentElement.style.setProperty('--scene-height',height+'px');heroTop=hero.offsetTop;heroHeight=hero.offsetHeight;metrics.length=0;for(const element of sections)metrics.push({element,top:element.offsetTop,length:Math.max(1,element.offsetHeight-element.querySelector('.scene-pin').offsetHeight),height:element.offsetHeight,state:null});lastY=-1}
function render(y){if(reduce)return;const inHero=y+height>heroTop&&y<heroTop+heroHeight;if(inHero!==heroActive){heroActive=inHero;hero.classList.toggle('is-hero-active',inHero)}if(inHero)hero.style.setProperty('--hero-progress',clamp((y-heroTop)/heroHeight));for(const m of metrics){const visible=y+height>m.top&&y<m.top+m.height;const state=visible?'active':y<m.top?'before':'after';if(state!==m.state)m.element.classList.toggle('is-motion-active',visible);if(state!=='active'&&state===m.state)continue;m.state=state;const p=clamp((y-m.top)/m.length);
 if(m.element===origin){origin.style.setProperty('--wipe',phase(p,.1,.6));origin.style.setProperty('--copy',phase(p,.3,.65))}
 else if(m.element===journey){journey.style.setProperty('--journey-progress',p);const f=p*2.75;for(let i=0;i<chapters.length;i++){const a=i?ease((f-i+.25)/.5):1;chapters[i].style.setProperty('--arrive',a);const hidden=a<.6||(i<chapters.length-1&&ease((f-(i+1)+.25)/.5)>.6);if(chapters[i].inert!==hidden)chapters[i].inert=hidden;}const index=Math.min(2,Math.max(0,Math.floor(f+.2)));if(index!==lastChapter){lastChapter=index;document.querySelector('.journey-count').textContent=`0${index+1} / 03`}}
 else if(m.element===ritual){ritual.style.setProperty('--ritual-progress',p);const f=p*2.7;for(let i=0;i<steps.length;i++)steps[i].style.setProperty('--arrive',i?ease((f-i+.25)/.5):1)}
 else if(m.element===closing){closing.style.setProperty('--closing-arrive',phase(p,0,.6));for(let i=0;i<closingProducts.length;i++){const a=phase(p,.2+i*.12,.5+i*.12);closingProducts[i].style.setProperty('--arrive',a);closingProducts[i].inert=a<.5;}}
 }}
function destination(target){return Math.max(0,target.getBoundingClientRect().top+scrollY-(target.id==='shop'||target.id==='story'?80:0))}
function scrollToTarget(target,immediate=false){const top=destination(target);if(lenis&&!reduce){lenis.start();lenis.scrollTo(top,{immediate,force:true,duration:Math.min(4.2,1.1+Math.sqrt(Math.abs(top-scrollY)/height)*.65)})}else scrollTo({top,behavior:'instant'})}
function restoreHash(){const target=document.getElementById(location.hash.slice(1));if(target)scrollToTarget(target,true)}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.getAttribute('href').slice(1));if(!target)return;e.preventDefault();document.querySelectorAll('dialog[open]').forEach(d=>d.close());history.replaceState(null,'',a.getAttribute('href'));scrollToTarget(target)}));
addEventListener('hashchange',restoreHash);addEventListener('resize',measure);document.fonts.ready.then(measure);addEventListener('load',measure);
const observer=new MutationObserver(()=>{if(document.querySelector('dialog[open]'))lenis?.stop();else if(ready)lenis?.start()});document.querySelectorAll('dialog').forEach(d=>observer.observe(d,{attributes:true,attributeFilter:['open']}));
reduced.addEventListener('change',e=>{reduce=e.matches;document.body.classList.toggle('motion-enabled',!reduce);if(reduce){lenis?.stop();for(const el of [...chapters,...closingProducts])el.inert=false;}else if(ready)lenis?.start();measure()});
const layoutObserver=new ResizeObserver(measure);layoutObserver.observe(main);
measure();let raf=0;
function frame(t){if(!reduce)lenis?.raf(t);const y=scrollY;if(y!==lastY){lastY=y;render(y)}raf=requestAnimationFrame(frame)}raf=requestAnimationFrame(frame);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(frame)});
