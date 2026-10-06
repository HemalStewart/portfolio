import {reduce,clamp,ease} from '../_engine/story-runtime.js';

export function createEditorialMotion() {
  const sections = ['.evolution','.history-story'].map(s=>document.querySelector(s));
  const photos = [...document.querySelectorAll('.evo-photo')];
  const cards = [...document.querySelectorAll('.history-card')];
  const index = document.querySelector('.history-index');
  const progress = document.querySelector('.page-progress span');
  const metrics = [], active = [false,false], cardAccess = [], settled = [], update = [], reveals = [];
  let maxScroll = 1, mobile = false, lastIndex = -1;
  cards.forEach((card,i)=>{card.style.zIndex=i+1});

  const viewport=document.querySelector('.gallery-window');
  const slides=[...document.querySelectorAll('.gallery-slide')];
  const prev=document.querySelector('.gallery-prev'),next=document.querySelector('.gallery-next'),status=document.querySelector('.gallery-status');
  viewport.setAttribute('data-lenis-prevent','');
  let galleryDirty=true, step=1, end=0, width=1, slideWidth=1, centers=[], current='', atStart=null, atEnd=null;
  function measure() {
    mobile=innerWidth<700;
    metrics.length=0;
    for (const el of sections) metrics.push({top:el.offsetTop,length:Math.max(1,el.offsetHeight-innerHeight),height:el.offsetHeight});
    maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    step=slides[1].offsetLeft-slides[0].offsetLeft;
    end=viewport.scrollWidth-viewport.clientWidth;
    width=viewport.clientWidth;
    slideWidth=slides[0].offsetWidth;
    centers=slides.map(slide=>slide.offsetLeft+slide.offsetWidth/2);
    galleryDirty=true;
    settled.length=0;
    for(const item of reveals) {
      let top=0,el=item.element;
      while(el) {if(!el.matches('.evolution-pin,.street-icon-pin'))top+=el.offsetTop;el=el.offsetParent;}
      item.top=top;item.bottom=top+item.element.offsetHeight;
      if(item.pin) {
        const section=item.pin.parentElement;
        item.pinTop=section.offsetTop;item.pinLength=Math.max(0,section.offsetHeight-item.pin.offsetHeight);
      }
    }
  }
  function gallery() {
    if (!galleryDirty) return;
    galleryDirty=false;
    const x=viewport.scrollLeft;
    let first=0,last=slides.length-1;
    while(first<last&&centers[first]+slideWidth/2<=x+2)first++;
    while(last>first&&centers[last]-slideWidth/2>=x+width-2)last--;
    const label=first===last?`0${first+1} / 0${slides.length}`:`0${first+1}–0${last+1} / 0${slides.length}`;
    if (label!==current) {current=label;status.textContent=label;}
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
    renderReveals(y);
    if (reduce) return;
    progress.style.transform=`scaleX(${clamp(y/maxScroll)})`;
    for(let i=0;i<sections.length;i++) {
      const visible=y+innerHeight>metrics[i].top&&y<metrics[i].top+metrics[i].height;
      if(visible!==active[i]) {active[i]=visible;sections[i].classList.toggle('is-motion-active',visible);}
    }
    for(let i=0;i<metrics.length;i++) {
      const m=metrics[i],boundary=y+innerHeight<=m.top?'before':y>=m.top+m.height?'after':null;
      update[i]=active[i]||settled[i]!==boundary;
      settled[i]=boundary;
    }
    if(update[0]) {
      const p=clamp((y-metrics[0].top)/metrics[0].length);
      for(let i=0;i<photos.length;i++) {
        photos[i].style.transform=`translate3d(${(i<3?-1:1)*ease(p)*innerWidth*(mobile?.07:.14)}px,${(p-.5)*[110,-150,100,-120,160,-100][i]}px,0) rotate(${(p-.5)*[8,-7,5,8,-6,9][i]}deg)`;
      }
    }
    if(update[1]) {
      const f=clamp((y-metrics[1].top)/metrics[1].length)*2.8;
      const n=Math.min(3,Math.floor(f)+1);
      if(n!==lastIndex) {lastIndex=n;index.textContent=`0${n} / 03`;}
      for(let i=0;i<cards.length;i++) {
        const arrive=i===0?1:ease((f-i+.3)/.5),leave=ease((f-i-.8)/.7),angle=[-5,5,-4][i];
        const grow=i===0?.64+.36*ease(f/.55):1;
        cards[i].style.transform=`translate3d(${(1-arrive)*(mobile?15:50)}px,${(1-arrive)*innerHeight*1.2-leave*35}px,0) rotate(${angle*(.45+arrive*.55)-leave*4}deg) scale(${grow*(1-leave*.055)})`;
        const accessible=arrive>=.8&&leave<=.75;
        if(cardAccess[i]!==accessible) {cardAccess[i]=accessible;cards[i].inert=!accessible;cards[i].setAttribute('aria-hidden',String(!accessible));}
      }
    }
  }
  function move(direction){viewport.scrollBy({left:step*direction,behavior:reduce?'instant':'smooth'});}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  viewport.addEventListener('scroll',()=>{galleryDirty=true},{passive:true});
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
  function reveal(element,delay=0,kind='up') {
    if(reduce||!element||element.closest('.scene-controlled'))return;
    element.classList.add('motion-pending');
    reveals.push({element,delay,kind,top:0,bottom:0,pin:element.closest('.evolution-pin,.street-icon-pin'),pinTop:0,pinLength:0,shown:false,animation:null});
  }
  // Separate line wrappers keep transforms independent of the scroll-driven art.
  for(const heading of document.querySelectorAll('.evolution-copy h2,.closing-collage h2')) {
    if(heading.closest('.scene-controlled'))continue;
    const nodes=[...heading.childNodes];let line=document.createElement('span');line.className='reveal-line';heading.replaceChildren(line);
    for(const node of nodes) {
      if(node.nodeName==='BR') {line=document.createElement('span');line.className='reveal-line';heading.append(line);}
      else line.append(node);
    }
    [...heading.children].forEach((line,i)=>reveal(line,i*120));
  }
  for(const [selector,kind] of [['.evolution-copy > p','up'],['.anatomy-spread h2','up'],['.anatomy-list li','up'],['.corner-cut img','scale'],['.anatomy-word','up'],['.anatomy-note','fade'],['.fillings-title h2 > span','up'],['.gallery-copy > *','up'],['.street-icon h2','up'],['.paper-invitation','fade']]) {
    document.querySelectorAll(selector).forEach((el,i)=>reveal(el,(i%6)*85,kind));
  }
  function renderReveals(y) {
    if(!document.body.classList.contains('is-ready'))return;
    for(const item of reveals) {
      const shift=item.pin?clamp(y-item.pinTop,0,item.pinLength):0;
      const visible=y+innerHeight>item.top+shift&&y<item.bottom+shift;
      if(!visible) {
        if(item.shown) {
          item.animation?.cancel();item.animation=null;item.shown=false;
          item.element.classList.add('motion-pending');
        }
        continue;
      }
      if(item.shown)continue;
      item.shown=true;item.element.classList.remove('motion-pending');
      const from=item.kind==='scale'?{opacity:0,scale:.5}:item.kind==='fade'?{opacity:0}:{opacity:0,translate:'0 55px'};
      const to=item.kind==='scale'?{opacity:1,scale:1}:item.kind==='fade'?{opacity:1}:{opacity:1,translate:'0 0'};
      const animation=item.element.animate([from,to],{duration:1000,delay:item.delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
      item.animation=animation;
      animation.finished.then(()=>{if(item.animation===animation){item.animation=null;animation.cancel()}}).catch(()=>{});
    }
  }
  const ready=()=>{measure();render(scrollY)};
  if(document.body.classList.contains('is-ready'))queueMicrotask(ready);
  else document.addEventListener('site-ready',ready,{once:true});
  measure();gallery();
  return {measure,render,gallery};
}
