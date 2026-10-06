import {reduce,clamp,ease} from '../_engine/story-runtime.js';

export function createEditorialMotion() {
  const sections = ['.evolution','.history-story','.anatomy-spread','.closing-collage'].map(s=>document.querySelector(s));
  const photos = [...document.querySelectorAll('.evo-photo')];
  const cards = [...document.querySelectorAll('.history-card')];
  const index = document.querySelector('.history-index');
  const progress = document.querySelector('.page-progress span');
  const anatomyImage = document.querySelector('.anatomy-sandwich');
  const anatomyStar = document.querySelector('.anatomy-star');
  const closingBites = [...document.querySelectorAll('.closing-bite')];
  const metrics = [], active = [false,false,false,false], cardAccess = [];
  let maxScroll = 1, mobile = false, lastIndex = -1;
  cards.forEach((card,i)=>{card.style.zIndex=i+1});

  const viewport=document.querySelector('.gallery-window');
  const slides=[...document.querySelectorAll('.gallery-slide')];
  const prev=document.querySelector('.gallery-prev'),next=document.querySelector('.gallery-next'),status=document.querySelector('.gallery-status');
  viewport.setAttribute('data-lenis-prevent','');
  let galleryDirty=true, step=1, end=0, width=1, centers=[], current=-1, atStart=null, atEnd=null;
  function measure() {
    mobile=innerWidth<700;
    metrics.length=0;
    for (const el of sections) metrics.push({top:el.offsetTop,length:Math.max(1,el.offsetHeight-innerHeight),height:el.offsetHeight});
    maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    step=slides[1].offsetLeft-slides[0].offsetLeft;
    end=viewport.scrollWidth-viewport.clientWidth;
    width=viewport.clientWidth;
    centers=slides.map(slide=>slide.offsetLeft+slide.offsetWidth/2);
    galleryDirty=true;
  }
  function gallery() {
    if (!galleryDirty) return;
    galleryDirty=false;
    const x=viewport.scrollLeft,n=Math.min(slides.length-1,Math.round(x/step));
    if (n!==current) {current=n;status.textContent=`0${n+1} / 0${slides.length}`;}
    const start=x<2,finish=x>end-2;
    if (start!==atStart) {atStart=start;prev.disabled=start;}
    if (finish!==atEnd) {atEnd=finish;next.disabled=finish;}
    if (!reduce) for(let i=0;i<slides.length;i++) {
      const d=clamp((centers[i]-x-width/2)/width,-1.5,1.5);
      slides[i].style.transform=`perspective(1800px) translate3d(0,${Math.abs(d)*18}px,0) rotateY(${-d*7}deg) rotateZ(${d*3}deg)`;
    }
  }
  function render(y) {
    gallery();
    if (reduce) return;
    progress.style.transform=`scaleX(${clamp(y/maxScroll)})`;
    for(let i=0;i<sections.length;i++) {
      const visible=y+innerHeight>metrics[i].top&&y<metrics[i].top+metrics[i].height;
      if(visible!==active[i]) {active[i]=visible;sections[i].classList.toggle('is-motion-active',visible);}
    }
    if(active[0]) {
      const p=clamp((y-metrics[0].top)/metrics[0].length);
      for(let i=0;i<photos.length;i++) {
        photos[i].style.transform=`translate3d(${(i<3?-1:1)*ease(p)*innerWidth*(mobile?.07:.14)}px,${(p-.5)*[110,-150,100,-120,160,-100][i]}px,0) rotate(${(p-.5)*[8,-7,5,8,-6,9][i]}deg)`;
      }
    }
    if(active[1]) {
      const f=clamp((y-metrics[1].top)/metrics[1].length)*2.8;
      const n=Math.min(3,Math.floor(f)+1);
      if(n!==lastIndex) {lastIndex=n;index.textContent=`0${n} / 03`;}
      for(let i=0;i<cards.length;i++) {
        const arrive=ease((f-i+.3)/.5),leave=ease((f-i-.8)/.7),angle=[-5,5,-4][i];
        cards[i].style.transform=`translate3d(${(1-arrive)*(mobile?15:50)}px,${(1-arrive)*innerHeight*1.2-leave*35}px,0) rotate(${angle*(.45+arrive*.55)-leave*4}deg) scale(${1-leave*.055})`;
        const accessible=arrive>=.8&&leave<=.75;
        if(cardAccess[i]!==accessible) {cardAccess[i]=accessible;cards[i].inert=!accessible;cards[i].setAttribute('aria-hidden',String(!accessible));}
      }
    }
    if(active[2]) {
      const a=clamp((y-metrics[2].top+innerHeight*.4)/(innerHeight*.8));
      anatomyImage.style.transform=`rotate(${-14+ease(a)*6}deg) translate3d(0,${(1-ease(a))*35}px,0)`;
      anatomyStar.style.transform=`rotate(${a*18}deg)`;
    }
    if(active[3]) {
      const c=clamp((y-metrics[3].top+innerHeight)/innerHeight);
      closingBites[0].style.transform=`translate3d(0,${(1-c)*-70}px,0) rotate(${20+c*10}deg)`;
      closingBites[1].style.transform=`translate3d(0,${(1-c)*70}px,0) rotate(${-10-c*10}deg)`;
    }
  }
  function move(direction){viewport.scrollBy({left:step*direction,behavior:reduce?'instant':'smooth'});}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  viewport.addEventListener('scroll',()=>{galleryDirty=true},{passive:true});
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
  const reveals=[];
  function reveal(element,delay=0,kind='up') {
    if(reduce||!element)return;
    element.dataset.revealDelay=delay;
    element.dataset.revealKind=kind;
    element.classList.add('motion-pending');
    reveals.push(element);
  }
  // Separate line wrappers keep transforms independent of the scroll-driven art.
  for(const heading of document.querySelectorAll('.evolution-copy h2,.closing-collage h2')) {
    const nodes=[...heading.childNodes];let line=document.createElement('span');line.className='reveal-line';heading.replaceChildren(line);
    for(const node of nodes) {
      if(node.nodeName==='BR') {line=document.createElement('span');line.className='reveal-line';heading.append(line);}
      else line.append(node);
    }
    [...heading.children].forEach((line,i)=>reveal(line,i*120));
  }
  for(const [selector,kind] of [['.anatomy-spread h2','up'],['.anatomy-list li','up'],['.corner-cut img','scale'],['.fillings-title h2 > span','up'],['.gallery-copy > *','up'],['.street-icon h2','up'],['.paper-invitation','fade']]) {
    document.querySelectorAll(selector).forEach((el,i)=>reveal(el,(i%6)*85,kind));
  }
  if(reveals.length) {
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries) {
        if(!entry.isIntersecting)continue;
        const el=entry.target;observer.unobserve(el);el.classList.remove('motion-pending');
        const kind=el.dataset.revealKind;
        const from=kind==='scale'?{opacity:0,scale:.5}:kind==='fade'?{opacity:0}:{opacity:0,translate:'0 55px'};
        const to=kind==='scale'?{opacity:1,scale:1}:kind==='fade'?{opacity:1}:{opacity:1,translate:'0 0'};
        const animation=el.animate([from,to],{duration:1000,delay:Number(el.dataset.revealDelay),easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
        animation.finished.then(()=>animation.cancel()).catch(()=>{});
      }
    },{threshold:.12});
    const start=()=>reveals.forEach(el=>observer.observe(el));
    if(document.body.classList.contains('is-ready'))start();else document.addEventListener('site-ready',start,{once:true});
  }
  measure();gallery();
  return {measure,render,gallery};
}
