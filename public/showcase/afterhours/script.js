(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu=document.querySelector('#menu'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus()}});
document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('#menu,.menu-toggle'))closeMenu()});
let anchorFrame=0;
function cancelScroll(){cancelAnimationFrame(anchorFrame)}
addEventListener('wheel',cancelScroll,{passive:true});addEventListener('touchstart',cancelScroll,{passive:true});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();closeMenu();cancelScroll();const start=scrollY,end=target.hasAttribute('data-film')&&!reduce?document.querySelector('.film').offsetTop+((Number(target.dataset.film)+(Number(target.dataset.film)>0?.35:0))/3.65)*(document.querySelector('.film').offsetHeight-innerHeight):target.getBoundingClientRect().top+start,t0=performance.now();history.replaceState(null,'',a.getAttribute('href'));if(reduce){scrollTo(0,end);return}function step(now){let t=Math.min(1,(now-t0)/1800),k=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;scrollTo(0,start+(end-start)*k);if(t<1)anchorFrame=requestAnimationFrame(step)}anchorFrame=requestAnimationFrame(step)}));
const film=document.querySelector('.film'),panels=[...document.querySelectorAll('.film-panel')],bar=document.querySelector('.journey-progress span'),counter=document.querySelector('.film-counter strong'),ticks=[...document.querySelectorAll('.film-ticks i')];
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
let filmTop=0,filmLength=1,pageLength=1,frame=0,activeScene=-1;
function measure(){filmTop=film.offsetTop;filmLength=Math.max(1,film.offsetHeight-innerHeight);pageLength=Math.max(1,document.documentElement.scrollHeight-innerHeight);schedule()}
function update(){frame=0;const progress=clamp((scrollY-filmTop)/filmLength),timeline=progress*3.65;bar.style.transform=`scaleX(${clamp(scrollY/pageLength)})`;if(reduce)return;
const active=Math.min(3,Math.floor(timeline+.18));if(active!==activeScene){activeScene=active;counter.textContent=`0${active+1} / 04`;ticks.forEach((t,i)=>t.classList.toggle('active',i===active))}
panels.forEach((panel,i)=>{const local=timeline-i;
// New scene arrives before the previous scene leaves: the camera never cuts to a blank viewport.
const enter=i===0?1:smooth((local+.26)/.38),exit=i===3?1:1-smooth((local-.75)/.35),opacity=enter*exit;
panel.style.opacity=opacity;panel.style.visibility=opacity>.001?'visible':'hidden';panel.inert=opacity<.5;panel.setAttribute('aria-hidden',String(opacity<.5));
if(opacity<.001)return;
const image=panel.querySelector('picture img'),copy=panel.querySelector('.hero-copy,.scene-copy'),prop=panel.querySelector('.route-ticket,.note-card,.floating-stamp');
const travel=clamp((local+.26)/1.36);
// Wider camera travel on the invitation; push in on the station and pull back from dinner.
const zoom=i===0?1.08+travel*.55:i===1?1.34-travel*.25:i===2?1.08+travel*.3:1.28-travel*.2;
image.style.transform=`translate3d(${(travel-.5)*(i%2?4:-4)}%,${(travel-.5)*-3}%,0) scale(${zoom})`;
const textIn=i===0?1:smooth((local+.08)/.3),textOut=i===3?1:1-smooth((local-.64)/.25);
panel.querySelectorAll('.hero-top,.scene-top,.vertical').forEach(el=>{el.style.opacity=textIn*textOut});copy.style.opacity=textIn*textOut;copy.style.transform=`translate3d(0,${(1-textIn)*65-(1-textOut)*45}px,0)`;
if(prop){const v=smooth((local-.18)/.33);prop.style.opacity=v*textOut;prop.style.transform=`translate3d(0,${(1-v)*90}px,0) rotate(${i===1?-4:i===2?6:15}deg)`}
const line=panel.querySelector('.route-line');if(line)line.style.strokeDashoffset=440*(1-smooth((local-.2)/.45));
});}
function schedule(){if(!frame)frame=requestAnimationFrame(update)}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);document.fonts.ready.then(measure);measure();
addEventListener('load',()=>{if(!location.hash)return;const target=document.getElementById(location.hash.slice(1));if(target?.hasAttribute('data-film')&&!reduce){const i=Number(target.dataset.film);scrollTo(0,filmTop+((i+(i>0?.35:0))/3.65)*filmLength);schedule()}});
const routes={neon:{title:'CHASE THE NEON.',intro:'An illustrative evening for people who like their cities loud, bright and a little unexpected.',stops:[['Start at Shinjuku','Let the illuminated streets set the mood.'],['Choose a side street','Step away from the main road and explore at your own pace.'],['Find a late dinner','Look for a welcoming place and check its opening hours.']]},slow:{title:'TAKE IT SLOW.',intro:'An illustrative evening with room to pause. The destination can wait.',stops:[['Take a window seat','Start with a train journey and watch the city change.'],['Walk without a checklist','Choose a neighbourhood and keep the evening flexible.'],['Stop for something warm','A quiet table is a perfectly good destination.']]},taste:{title:'FOLLOW THE FLAVOUR.',intro:'An illustrative evening built around one simple idea: make time for a good meal.',stops:[['Let the warm lights lead','Browse small restaurant streets and read the menus.'],['Choose your bowl','Find a dish you want to try; ask about ingredients and availability.'],['Stay for the conversation','Slow down. A good evening is more than the food.']]}};
const dialog=document.querySelector('#route-dialog');let current='';document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{const r=routes[b.dataset.route];document.querySelector('#route-dialog-title').textContent=r.title;document.querySelector('#route-intro').textContent=r.intro;const ol=document.querySelector('#route-stops');ol.replaceChildren();r.stops.forEach(([title,text])=>{const li=document.createElement('li'),div=document.createElement('div'),strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=title;p.textContent=text;div.append(strong,p);li.append(div);ol.append(li)});current=r.title+'\n'+r.stops.map((s,i)=>(i+1)+'. '+s.join(' — ')).join('\n');document.querySelector('.copy-status').textContent='';dialog.showModal()}));
document.querySelector('.copy-route').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(current);document.querySelector('.copy-status').textContent='Route copied. Your evening, your pace.'}catch{document.querySelector('.copy-status').textContent='Copy is unavailable here. You can select and copy the route above.'}});
const credits=document.querySelector('#credits-dialog');document.querySelector('#credits-open').addEventListener('click',()=>credits.showModal());document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
})();
