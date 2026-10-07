import {reduce,clamp,loader,scrollEngine,navigation,restoreHash} from '../_engine/story-runtime.js';
import {createMediaScrubber} from './media-scrubber.js';
import {createHeroReveal} from './hero-reveal.js';
import {storyTime,scrollProgress,configure} from './timeline.js';
const lin=(p,a,b)=>clamp((p-a)/((b-a)||1e-6)),outCubic=t=>1-(1-t)**3;
const film=document.querySelector('.film'),canvas=document.querySelector('#world'),hero=document.querySelector('.hero'),bookend=document.querySelector('.bookend'),bookendVideo=bookend.querySelector('video'),bookendBoard=bookend.querySelector('img'),typeLayer=document.querySelector('.type-layer');
// Canvas layers, bottom to top. vis = [fade in from, fully in, fade out from, gone]; map = story time across the frames.
// Windows follow the reference film; visP overrides portrait, where scenes crossfade instead of cutting.
const layers=[
 {key:'takeoff4k-v1',n:99,last:195,vis:[.12,.145,.23,.25],map:[.13,.24]},
 {key:'fork4k-v1',n:122,last:241,vis:[.23,.25,.32,.345],map:[.24,.33]},
 {key:'next-panel-business-class4k-v1',n:91,vis:[.32,.34,.455,.475],map:[.33,.47]},
 {key:'next-panel-forum-v3',n:72,vis:[.535,.555,.67,.69],visP:[.57,.58,.67,.69],map:[.575,.68]},
 {key:'next-panel-forum-morph-v3',n:121,start:1,startP:0,vis:[.468,.48,.575,.5751],visP:[.468,.48,.575,.585],map:[.545,.575],ease:true,fx:'morph',settle:true,panel:true},
 {key:'next-panel-museum-v3',n:72,vis:[.665,.685,.79,.81],visP:[.707,.717,.79,.81],map:[.712,.78]},
 {key:'next-panel-museum-morph-v3',n:121,vis:[.65,.665,.711,.712],visP:[.65,.665,.712,.722],map:[.682,.712],focus:.6,settle:true,panel:true},
 // Tram: the real 4K pass sits under the moving comic pass, which dissolves away between .855 and .885 (as in the reference).
 {key:'next-panel-transit-colosseum-real4k-v1',n:60,vis:[.805,.82,.91,.925],map:[.81,.91],focus:.82},
 {key:'next-panel-transit-colosseum-comic-motion-v1',n:60,vis:[.775,.79,.855,.885],map:[.81,.91],focus:.82,settle:true,panel:true},
 {key:'next-panel-bookbinder-open-landscape-v2',n:121,vis:[.904,.908,.945,.949],visP:[.895,.908,.945,.949],map:[.908,.946]},
 {key:'bookbinder-comic',n:1,still:'reference-media/batch-32-bookbinder-rome-comic-landscape-v1-1280.jpg',vis:[.895,.91,.917,.922],map:[0,1],settle:true,landscapeOnly:true,panel:true},
 {key:'bookbinder-walkin-landscape4k-v1',n:121,vis:[.945,.949,.961,.965],map:[.947,.963]},
 {key:'bookbinder-deep-interior-landscape4k-v1',n:121,vis:[.961,.965,.979,.98],map:[.963,.979]},
 {key:'bookbinder-finale-turn-landscape4k-v1',n:121,vis:[.9785,.98,.985,.9855],map:[.98,.985]},
 {key:'bookbinder-finale-exit-day-landscape4k-v1',n:98,last:193,vis:[.9845,.985,.991,.9915],map:[.985,.991]},
 {key:'finale-day-to-night-landscape4k-v3',n:98,last:193,vis:[.9905,.991,.996,.9965],map:[.991,.996]}
];
const media=reduce?null:createMediaScrubber(canvas,layers);
const reveal=reduce?{render(){},resize(){}}:createHeroReveal(hero);
const coarse=matchMedia('(pointer:coarse)').matches,portraitQuery=matchMedia('(max-aspect-ratio: 1/1)');
let top=0,length=1,lastP=-1,visualY=scrollY,heroShown=1,lenis=null,layoutScreens=0,styleCache=new WeakMap(),compact=false;
// Write a style only when its value changes, so idle frames do no style work.
function set(el,prop,value){let c=styleCache.get(el);if(!c)styleCache.set(el,c={});if(c[prop]!==value){c[prop]=value;el.style[prop]=value;}}

// ---- type layer -------------------------------------------------------------------------------
// Same model as the reference: every copy block has enter/exit windows and a block motion, every line
// has its own reveal window and line motion, all driven by story time (so reversing replays exactly).
const lines=[],blocks=[];
typeLayer.querySelectorAll('[data-mist]').forEach(el=>{
 const text=el.dataset.mist,accent=(el.dataset.accent||'').toLowerCase(),from=accent?text.toLowerCase().lastIndexOf(accent):-1,last=Math.max(1,text.length-1);
 [...text].forEach((ch,k)=>{const s=document.createElement('span');s.className='mist-char'+(from>=0&&k>=from?' mist-char--accent':'');s.textContent=ch===' '?'\u00a0':ch;s.dataset.k=k/last;el.append(s);lines.push({el:s,host:el,motion:'mist'});});
 el.setAttribute('aria-hidden','true');
});
typeLayer.querySelectorAll('i[data-at]').forEach(el=>lines.push({el,host:el,motion:el.dataset.motion||'rise'}));
typeLayer.querySelectorAll('.block').forEach(el=>blocks.push({el,motion:el.dataset.motion||'lift',pe:el.hasAttribute('data-pe')}));
const range=(el,name,portrait)=>{const v=(portrait&&el.dataset[name+'P'])||el.dataset[name];return v?v.split(',').map(Number):null;};
function readTimings(){
 const portrait=portraitQuery.matches;
 for(const l of lines){const at=range(l.host,'at',portrait);if(l.motion==='mist'){const span=at[1]-at[0],s=at[0]+.58*span*Number(l.el.dataset.k);l.at=[s,s+.42*span];}else l.at=at;}
 for(const b of blocks){b.enter=range(b.el,'enter',portrait);b.exit=range(b.el,'exit',portrait)||[2,3];}
}
function renderType(p){
 const a=compact?16:72,s=compact?10:28,tall=innerHeight>innerWidth;
 for(const l of lines){
  const i=outCubic(lin(p,l.at[0],l.at[1])),n=1-i,el=l.el;let o='1',t,f='none',origin='50% 50%';
  switch(l.motion){
   case 'mist':o=i.toFixed(3);t=`translate3d(${(-2*n).toFixed(2)}px,${(8*n).toFixed(2)}px,0) scale(${(.9+.1*i).toFixed(4)})`;f=`blur(${(7*n).toFixed(2)}px)`;break;
   case 'slide-left':t=`translate3d(${(-a*n).toFixed(1)}px,0,0)`;o=i.toFixed(3);break;
   case 'slide-right':t=`translate3d(${(a*n).toFixed(1)}px,0,0)`;o=i.toFixed(3);break;
   case 'scan':t=`translate3d(${(-s*n).toFixed(1)}px,0,0)`;o=i.toFixed(3);break;
   case 'focus':t=`translate3d(0,${(18*n).toFixed(1)}px,0) scale(${(1+.08*n).toFixed(4)})`;o=i.toFixed(3);f=`blur(${(7*n).toFixed(2)}px)`;break;
   case 'settle':origin='0 50%';t=`translate3d(0,${(34*n).toFixed(1)}px,0) scaleX(${(.88+.12*i).toFixed(4)})`;o=i.toFixed(3);break;
   case 'hold':t='none';o=i.toFixed(3);break;
   default:t=`translateY(${(135*n).toFixed(2)}%)`;
  }
  if(f==='blur(0.00px)')f='none';
  set(el,'opacity',o);set(el,'transform',t);set(el,'filter',f);set(el,'transformOrigin',origin);
 }
 for(const b of blocks){
  const i=outCubic(lin(p,b.exit[0],b.exit[1])),r=b.enter?outCubic(lin(p,b.enter[0],b.enter[1])):1,v=r*(1-i),el=b.el;let t,f='none';
  switch(b.motion){
   case 'static':t='none';break;
   case 'drift':t=`translate3d(${(-(compact?16:46)*(1-r)+(compact?14:34)*i).toFixed(1)}px,${(-18*i).toFixed(1)}px,0)`;f=`blur(${(6*(1-r)+4*i).toFixed(2)}px)`;break;
   case 'relief':t=`translate3d(0,${(24*(1-r)-22*i).toFixed(1)}px,0) scale(${(.94+.06*r-.025*i).toFixed(4)})`;f=`blur(${(8*(1-r)+3*i).toFixed(2)}px)`;break;
   case 'signal':t=`translate3d(${(-(compact?16:68)*(1-r)+(tall?12:54)*i).toFixed(1)}px,0,0)`;break;
   case 'dialogue':t=`translate3d(0,${(12*(1-r)-16*i).toFixed(1)}px,0)`;break;
   case 'focus':t=`translate3d(0,${(20*(1-r)-24*i).toFixed(1)}px,0) scale(${(1.07-.07*r-.025*i).toFixed(4)})`;f=`blur(${(9*(1-r)+5*i).toFixed(2)}px)`;break;
   default:t=`translateY(${(-34*i).toFixed(1)}px)`;
  }
  if(f==='blur(0.00px)')f='none';
  set(el,'opacity',v.toFixed(3));set(el,'visibility',v<=.001?'hidden':'visible');set(el,'transform',t);set(el,'filter',f);
  if(b.pe)set(el,'pointerEvents',v<=.001?'none':'auto');
 }
}

function measure(){
 const p=lastP;
 const screens=configure();
 compact=innerHeight>=innerWidth||innerWidth<768;
 film.style.height=reduce?'100svh':`${(screens+1)*100}svh`;
 document.documentElement.style.setProperty('--stage-height',innerHeight+'px');
 top=film.offsetTop;length=Math.max(1,film.offsetHeight-innerHeight);
 document.querySelectorAll('.chapter-anchor').forEach(a=>{a.dataset.stop=scrollProgress(Number(a.dataset.time))});
 readTimings();media?.resize();reveal.resize();lastP=-1;
 // Keep the story position when orientation or pointer type changes the distance per screen.
 // (Plain viewport-height changes, e.g. a collapsing URL bar, must not touch scroll: it would kill momentum.)
 const changed=layoutScreens&&screens!==layoutScreens;layoutScreens=screens;
 if(changed&&p>=0&&!reduce){const y=top+scrollProgress(p)*length;lenis?lenis.scrollTo(y,{immediate:true,force:true}):scrollTo(0,y);visualY=y;}
}
document.querySelectorAll('.chapter-anchor').forEach(a=>{a.dataset.time=a.dataset.stop});

function render(time,dt=16.7){
 // Wheel input is already smoothed by Lenis. Touch scrolling is native, so the picture eases toward it
 // here instead (the reference's 0.085 lerp, made frame-rate independent). Only one smoother is ever active.
 const y=scrollY;
 if(coarse&&!reduce){const k=1-Math.pow(1-.085,dt/16.667);visualY+=(y-visualY)*k;if(Math.abs(y-visualY)<.05)visualY=y;}else visualY=y;
 const p=storyTime(clamp((visualY-top)/length));
 if(reduce)return;
 // Keep an opaque picture behind deep links and fast chapter jumps until the compositor has painted.
 const painted=media.render(p,{now:time,base:heroShown>0});
 const endReady=p>=.9955&&(portraitQuery.matches?bookendBoard.complete&&bookendBoard.naturalWidth:bookendVideo.readyState>=2);
 const heroTarget=1-lin(p,.13,.165),forced=!painted&&!endReady&&heroTarget<1;
 heroShown=forced?1:heroTarget>=heroShown?heroTarget:Math.max(heroTarget,heroShown-dt/260);
 set(hero,'opacity',heroShown.toFixed(3));set(hero,'visibility',heroShown>0?'visible':'hidden');
 reveal.render(p,heroShown>0,dt);
 if(p===lastP)return;
 lastP=p;
 const end=lin(p,.9958,.9964);
 set(bookend,'opacity',end.toFixed(3));set(bookend,'visibility',p>=.9955?'visible':'hidden');
 if(p>=.9955&&innerWidth>innerHeight){if(!bookendVideo.src)bookendVideo.src='reference-media/hero-real.mp4';if(bookendVideo.paused)bookendVideo.play().catch(()=>{});}else if(!bookendVideo.paused)bookendVideo.pause();
 if(p>=.99&&innerWidth<=innerHeight&&!bookendBoard.src)bookendBoard.src='reference-media/batch-79-crow-alley-phone-safe-board-v1-1536.avif';
 renderType(p);
}
if(reduce){
 const list=document.createElement('div');list.className='static-chapters';
 const scenes=[['takeoff4k-v1','Start with a better way.'],['fork4k-v1','A different start. Same Rome.'],['next-panel-business-class4k-v1','Ten hours. Room to breathe.'],['next-panel-forum-v3','Same city. Another story.'],['next-panel-museum-v3','Rain on the ruins. Art indoors.'],['next-panel-transit-colosseum-real4k-v1','Take the long way. Watch the city.'],['next-panel-bookbinder-open-landscape-v2','Not on the list. Still worth it.']];
 document.querySelectorAll('.chapter-anchor').forEach((anchor,i)=>{const [key,line]=scenes[i];const chapter=document.createElement('section');chapter.className='static-chapter';chapter.id=anchor.id;anchor.removeAttribute('id');const image=document.createElement('img');image.src=`reference-media/${key}/f_001.webp`;image.alt='';image.loading='lazy';const heading=document.createElement('h2');heading.textContent=line;chapter.append(image,heading);list.append(chapter)});
 film.after(list);
}
// The cold open runs for at least as long as the reference's (2.4s) and until the first scene can be drawn.
const ready=reduce?Promise.resolve():Promise.all([media.prepare('takeoff4k-v1'),new Promise(r=>setTimeout(r,2400))]);
readTimings();loader(ready);navigation();measure();
let resizeQueued=false;addEventListener('resize',()=>{if(resizeQueued)return;resizeQueued=true;requestAnimationFrame(()=>{resizeQueued=false;measure();})});
portraitQuery.addEventListener('change',measure);
document.fonts.ready.then(measure);lenis=scrollEngine(render);restoreHash(lenis);
document.addEventListener('site-ready',()=>{lastP=-1});
document.addEventListener('visibilitychange',()=>{if(document.hidden)bookendVideo.pause();lastP=-1});
