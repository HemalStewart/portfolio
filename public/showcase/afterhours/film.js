import {reduce,clamp,ease,loader,scrollEngine,navigation,restoreHash} from '../_engine/story-runtime.js';
import {createMediaScrubber} from './media-scrubber.js';
import {createHeroReveal} from './hero-reveal.js';
import {storyTime,scrollProgress,screens} from './timeline.js';
const film=document.querySelector('.film'),stage=document.querySelector('.film-stage'),canvas=document.querySelector('#world'),media=reduce?null:createMediaScrubber(canvas),video=document.querySelector('.film-video'),copy=document.querySelector('.film-copy'),eyebrow=copy.querySelector('.eyebrow'),title=copy.querySelector('h1'),caption=copy.querySelector('.caption'),phone=document.querySelector('.phone-prototype'),label=document.querySelector('.scene-label'),dots=[...document.querySelectorAll('.film-foot a')],detailTags=document.querySelector('.detail-tags');let top=0,length=1,last=-1,dirty=true,active=-2;
const plan=[
 {key:'takeoff4k-v1',start:.13,end:.24,tag:'TEN HOURS EARLIER',title:'START WITH<br>A BETTER WAY.',note:'The beginning is part of the story.',chapter:1},
 {key:'fork4k-v1',start:.24,end:.33,tag:'A DIFFERENT DEPARTURE',title:'CHANGE THE START.<br>KEEP THE DESTINATION.',note:'An illustrative route, with room for possibility.',chapter:2},
 {key:'next-panel-business-class4k-v1',start:.33,end:.47,tag:'A LITTLE MORE ROOM',title:'THE JOURNEY<br>IS PART OF IT.',note:'A window seat. A slower beginning.',chapter:3},
 {key:'next-panel-forum-morph-v3',start:.47,end:.575,tag:'THE CITY CHANGES',title:'LEAVE SPACE<br>FOR THE WEATHER.',note:'Plans can move when the day does.',chapter:4},
 {key:'next-panel-forum-v3',start:.575,end:.682,tag:'ROME / A DIFFERENT PERSPECTIVE',title:'SAME CITY.<br>ANOTHER STORY.',note:'Make space for the unexpected.',chapter:4},
 {key:'next-panel-museum-morph-v3',start:.682,end:.712,tag:'A CHANGE OF PLAN',title:'THE NEXT<br>GOOD IDEA.',note:'One door closes. Another opens.',chapter:5},
 {key:'next-panel-museum-v3',start:.712,end:.81,tag:'THE DAY, REIMAGINED',title:'FOLLOW<br>YOUR CURIOSITY.',note:'There is more than one way to see a city.',chapter:5},
 {key:'transit-reveal',start:.81,end:.908,tag:'ONE STOP FURTHER',title:'TAKE THE<br>WINDOW SEAT.',note:'A city reveals itself along the way.',chapter:6},
 {key:'next-panel-bookbinder-open-landscape-v2',start:.908,end:.947,tag:'AN UNEXPECTED DOOR',title:'NOT ON THE LIST.<br>STILL WORTH IT.',note:'The best detours rarely announce themselves.',chapter:7},
 {key:'bookbinder-walkin-landscape4k-v1',start:.947,end:.963,tag:'COME INSIDE',title:'THE GOOD PART<br>IS IN THE DETAILS.',note:'Take a moment. Look a little closer.',chapter:7},
 {key:'bookbinder-deep-interior-landscape4k-v1',start:.963,end:.98,tag:'SLOW DOWN',title:'GOOD STORIES<br>TAKE THEIR TIME.',note:'Let the place leave an impression.',chapter:7},
 {key:'bookbinder-finale-turn-landscape4k-v1',start:.98,end:.985,tag:'ONE MORE LOOK',title:'KEEP THE<br>FEELING.',note:'Some things are worth bringing home.',chapter:7},
 {key:'bookbinder-finale-exit-day-landscape4k-v1',start:.985,end:.991,tag:'BACK OUTSIDE',title:'THE LONG<br>WAY HOME.',note:'A different route. A different memory.',chapter:7},
 {key:'finale-day-to-night-landscape4k-v3',start:.991,end:1.000001,tag:'ROME / AFTER DARK',title:'MAKE IT<br>YOUR OWN.',note:'A cinematic reference study by Hemal Herath.',chapter:7}
];
const reveal=createHeroReveal(stage),revealSurface=document.querySelector('.hero-reveal'),mobileComic=document.querySelector('.hero-comic-mobile');
film.style.height=reduce?'100svh':`${(screens+1)*100}svh`;
document.querySelectorAll('.chapter-anchor').forEach(a=>{a.dataset.time=a.dataset.stop;a.dataset.stop=scrollProgress(Number(a.dataset.time))});
function measure(){reveal.resize();document.documentElement.style.setProperty('--stage-height',innerHeight+'px');top=film.offsetTop;length=Math.max(1,film.offsetHeight-innerHeight);last=-1;dirty=true}
function render(time){const y=scrollY,p=storyTime(clamp((y-top)/length));reveal.render(p);media?.tick(time);if(reduce)return;stage.classList.toggle('is-ending',y>top+length);if(Math.abs(p-last)<.000001&&!dirty)return;last=p;dirty=false;if(y>top+length+innerHeight){video.pause();return}const hero=p<.14,heroMix=1-ease((p-.125)/.015);video.style.opacity=heroMix;if(revealSurface)revealSurface.style.opacity=heroMix;mobileComic.style.opacity=heroMix;canvas.style.opacity=1;if(hero&&video.paused&&document.body.classList.contains('is-ready'))video.play().catch(()=>{});if(!hero&&!video.paused)video.pause();let current=-1;for(let i=0;i<plan.length;i++){if(p>=plan[i].start&&p<plan[i].end){current=i;break}}
 if(current!==active){active=current;const scene=current<0?{tag:'ROME. FIRST TIME?',title:'FIND YOUR<br>OWN WAY IN.',note:'A different route makes a different story.',chapter:0}:plan[current];eyebrow.textContent=scene.tag;title.innerHTML=scene.title.replace('<br>','<br><em>')+'</em>';copy.dataset.chapter=scene.chapter;caption.textContent=scene.note;label.textContent=`0${scene.chapter+1} / ${['ROME AFTER DARK','THE FLIGHT','ANOTHER START','THE WINDOW SEAT','THE CITY','A CHANGE OF PLAN','IN MOTION','THE OPEN DOOR'][scene.chapter]}`;dots.forEach((d,i)=>{d.classList.toggle('active',i===scene.chapter);if(i===scene.chapter)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current')})}
 const local=current<0?p/.13:(p-plan[current].start)/(plan[current].end-plan[current].start),textOpacity=current<0?1:ease(local/.1)*(1-ease((local-.86)/.14));copy.style.opacity=textOpacity;title.style.transform=`translateY(${(1-textOpacity)*18}px)`;
 if(current>=0){
   const scene=plan[current],layers=[{key:scene.key,progress:clamp(local),weight:1}];
   const next=plan[current+1],previous=plan[current-1];
   if(previous){const width=Math.min(.006,(scene.end-scene.start)*.18,(previous.end-previous.start)*.18);if(p<scene.start+width)layers.unshift({key:previous.key,progress:1,weight:1}),layers[1].weight=ease((p-scene.start+width)/(2*width));}
   if(next){const width=Math.min(.006,(scene.end-scene.start)*.18,(next.end-next.start)*.18);if(p>next.start-width)layers.push({key:next.key,progress:0,weight:ease((p-next.start+width)/(2*width))});}
   media.show(layers);
   if(local>.15&&next)media.prefetch(next.key);
 }else media?.prefetch(plan[0].key);
 const routePhone=ease((p-.245)/.012)*(1-ease((p-.32)/.01)),museumPhone=ease((p-.735)/.012)*(1-ease((p-.792)/.012)),transitPhone=ease((p-.865)/.008)*(1-ease((p-.89)/.008)),pv=Math.max(routePhone,museumPhone,transitPhone);
 const mode=museumPhone>.01?'museum':transitPhone>.01?'transit':'route';if(phone.dataset.mode!==mode){phone.dataset.mode=mode;phone.querySelector('h2').innerHTML=mode==='museum'?'A rainy day.<br>A better plan.':mode==='transit'?'One stop.<br>Another view.':'Same city.<br>Another way.';phone.querySelector('.phone-card strong').textContent=mode==='museum'?'Make space for the unexpected.':mode==='transit'?'Keep the day moving.':'Make room for the journey.';phone.querySelector('.route-diagram').innerHTML=mode==='museum'?'<span>ROMAN FORUM</span><i></i><span>RAIN IN THE CITY</span><i></i><span>AN AFTERNOON INSIDE</span>':mode==='transit'?'<span>COLOSSEUM</span><i></i><span>THE NEXT STOP</span><i></i><span>A DIFFERENT PERSPECTIVE</span>':'<span>DALLAS</span><i></i><span>HOUSTON</span><i></i><span>ROME</span>'}
 detailTags.style.opacity=ease((p-.442)/.012)*(1-ease((p-.49)/.012));phone.style.opacity=pv;phone.style.visibility=pv>.001?'visible':'hidden';phone.style.transform=`translateY(${(1-pv)*100}px) rotateY(${-15+pv*20}deg) rotateZ(${-5+pv*3}deg) scale(${.9+pv*.1})`;copy.classList.toggle('has-phone',pv>.01);
}
if(reduce){
 const list=document.createElement('div');list.className='static-chapters';
 const scenes=[plan[0],plan[1],plan[2],plan[4],plan[6],plan[7],plan[8]];
 document.querySelectorAll('.chapter-anchor').forEach((anchor,i)=>{const scene=scenes[i];const chapter=document.createElement('section');chapter.className='static-chapter';chapter.id=anchor.id;anchor.removeAttribute('id');const image=document.createElement('img');image.src=`reference-media/${scene.key==='transit-reveal'?'next-panel-transit-colosseum-comic-motion-v1':scene.key}/f_001.webp`;image.alt=scene.tag;image.loading='lazy';const heading=document.createElement('h2');heading.textContent=scene.title.replace('<br>',' ');const note=document.createElement('p');note.textContent=scene.note;chapter.append(image,heading,note);list.append(chapter)});
 film.after(list);
}
const ready=reduce?Promise.resolve():media.prepare(plan[0].key);loader(ready);navigation();measure();addEventListener('resize',measure);document.fonts.ready.then(measure);const lenis=scrollEngine(render);restoreHash(lenis);document.addEventListener('site-ready',()=>{dirty=true;if(!reduce&&scrollY<innerHeight)video.play().catch(()=>{})});document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else dirty=true});
