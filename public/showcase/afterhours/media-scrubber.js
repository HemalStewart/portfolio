import {clamp} from '../_engine/story-runtime.js';

// Frame-sequence compositor.
// Seeking <video> elements capped visible updates at ~30/s and lagged the scroll by up to 35 frames,
// so every scene is now a WebP frame sequence: frames are fetched coarse-to-fine, decoded off the main
// thread with createImageBitmap, kept inside a memory budget and drawn onto one canvas.
// The compositor never shows an empty frame: a layer that is not decoded yet is skipped and the last
// fully drawn base frame is held underneath until the incoming scene can take over.
const lin=(p,a,b)=>clamp((p-a)/((b-a)||1e-6));
const outCubic=t=>1-(1-t)**3;
const probe=new URLSearchParams(location.search).has('probe');
const size=img=>(img.width||img.naturalWidth)*(img.height||img.naturalHeight)*4;

function bisect(n,start=0){
  const order=[],seen=new Set(),add=i=>{if(i>=0&&i<n&&!seen.has(i)){seen.add(i);order.push(i);}};
  add(start);add(n-1);for(let step=32;step>=1;step>>=1)for(let i=start;i<n;i+=step)add(i);
  if(start)add(0);
  return order;
}

export function createMediaScrubber(container,specs){
  const coarse=matchMedia('(max-width:700px),(pointer:coarse)').matches;
  // Phones draw frames at roughly viewport width, so the 1080px set matches their density at ~30% of the bytes.
  const light=coarse&&Math.min(innerWidth,innerHeight)*Math.min(devicePixelRatio||1,3)<=1400;
  const root=light?'frames-mobile':'reference-media';
  const NET=light?4:6,DECODE=light?2:3,BUDGET=(light?110:300)*1e6;
  const canvas=document.createElement('canvas');canvas.className='motion-canvas';canvas.setAttribute('aria-hidden','true');container.append(canvas);
  const ctx=canvas.getContext('2d',{alpha:false});
  const soft=document.createElement('canvas'),softCtx=soft.getContext('2d',{alpha:false});
  const mid=document.createElement('canvas'),midCtx=mid.getContext('2d',{alpha:false});
  const bitmapApi=typeof createImageBitmap==='function';
  let W=1,H=1,scale=1,portrait=innerHeight>=innerWidth,net=0,decoding=0,bytes=0,signature='',held=null,ticks=0,lastP=-1,dir=1,dead=false;

  const layers=specs.map((spec,order)=>{
    const start=spec.start||0;
    // Sequences exported at every second source frame are numbered 1, 2, 4, 6 … last.
    const num=i=>spec.last?(i===0?1:i===spec.n-1?spec.last:2*i):i+1;
    const seq={n:spec.n,url:spec.still?()=>spec.still:i=>`${root}/${spec.key}/f_${String(num(i)).padStart(3,'0')}.webp`,
      blobs:new Array(spec.n).fill(null),tries:new Uint8Array(spec.n),bmp:new Array(spec.n).fill(null),dec:new Uint8Array(spec.n),
      order:bisect(spec.n,start),cursor:0,want:start,active:false,count:0};
    return {...spec,order,seq,start,alpha:0,want:start,shown:-1,late:false,readyAt:-1e9};
  });
  const byKey=new Map(layers.map(l=>[l.key,l]));
  const visOf=l=>portrait&&l.visP?l.visP:l.vis;
  const hidden=l=>l.landscapeOnly&&portrait;
  // Portrait scrubs in the reference are plain linear sequences from frame 0 (no panel stills, no easing).
  const startOf=l=>portrait&&l.startP!=null?l.startP:l.start;
  const local=(l,p)=>{const t=lin(p,l.map[0],l.map[1]);return l.ease&&!portrait?outCubic(t):t;};
  const frameAt=(l,p)=>{const s=startOf(l);return l.n===1?0:s+Math.round(local(l,p)*(l.n-1-s));};

  // ---- network & decode ------------------------------------------------------
  function fetchFrame(s,i,priority){
    s.blobs[i]='loading';net++;
    return fetch(s.url(i),{priority}).then(r=>{if(!r.ok)throw Error(r.status);return r.blob();})
      .then(b=>{s.blobs[i]=b;})
      .catch(()=>{s.tries[i]++;s.blobs[i]=s.tries[i]>2?'failed':null;})
      .finally(()=>{net--;});
  }
  function store(s,i,img){
    if(dead||s.bmp[i]){img.close?.();return;}
    s.bmp[i]=img;s.count++;bytes+=size(img);enforceBudget();
  }
  function decodeFrame(s,i){
    s.dec[i]=1;decoding++;
    const blob=s.blobs[i];
    const job=bitmapApi?createImageBitmap(blob):new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);img.decode().then(()=>resolve(img),()=>resolve(img));};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Frame decode failed'));};img.src=url;});
    return job.then(img=>store(s,i,img)).catch(()=>{s.tries[i]++;s.blobs[i]=s.tries[i]>2?'failed':null;})
      .finally(()=>{s.dec[i]=0;decoding--;});
  }
  function isProtected(s,i){
    if(held&&held.seq===s&&held.i===i)return true;
    for(const l of layers)if(l.seq===s&&l.shown===i)return true;
    return false;
  }
  function enforceBudget(){
    if(bytes<=BUDGET)return;
    const list=[];
    for(const l of layers){const s=l.seq;for(let i=0;i<s.n;i++)if(s.bmp[i]&&!isProtected(s,i))list.push([(s.active?0:1e6)+Math.abs(i-s.want),s,i]);}
    list.sort((a,b)=>b[0]-a[0]);
    for(const [,s,i] of list){if(bytes<=BUDGET*.85)break;bytes-=size(s.bmp[i]);s.bmp[i].close?.();s.bmp[i]=null;s.count--;}
  }

  // ---- scheduling --------------------------------------------------------------
  // Priority: the exact frame each visible layer needs, then frames ahead in the direction of travel
  // (strided when scrolling fast), then coarse-to-fine coverage of the current and next scenes.
  function want(s,i,priority,urgent){
    if(i<0||i>=s.n||s.bmp[i]||s.dec[i])return;
    const b=s.blobs[i];
    if(b instanceof Blob){if(decoding<DECODE+(urgent?1:0))decodeFrame(s,i);}
    else if(b===null&&net<NET+(urgent?2:0))fetchFrame(s,i,priority);
  }
  function schedule(p,speed){
    const near=layers.filter(l=>l.seq.active).sort((a,b)=>b.alpha-a.alpha);
    const stride=Math.max(1,Math.round(speed));
    for(const l of near){
      const s=l.seq,d=l.want;
      want(s,d,'high',true);
      for(let k=1;k<=8;k++)want(s,d+dir*k*stride,k<3?'high':'auto',false);
      for(let k=1;k<=2;k++)want(s,d-dir*k,'auto',false);
    }
    if(net<NET-1){
      const warm=layers.filter(l=>{const v=visOf(l);return !hidden(l)&&p>=v[0]-.08&&p<=v[3]+.01;})
        .sort((a,b)=>Math.abs(visOf(a)[0]-p)-Math.abs(visOf(b)[0]-p));
      outer:for(const l of warm){const s=l.seq;while(s.cursor<s.order.length){if(net>=NET-1)break outer;const i=s.order[s.cursor];if(s.blobs[i]===null)fetchFrame(s,i,'low');else s.cursor++;}}
    }
    // Encoded frames for scenes well behind or ahead are released; the HTTP cache makes them cheap to refetch.
    if(ticks%120===0)for(const l of layers){const v=visOf(l);if(p<v[0]-.15||p>v[3]+.08){const s=l.seq;for(let i=0;i<s.n;i++)if(s.blobs[i] instanceof Blob)s.blobs[i]=null;s.cursor=0;}}
  }

  // ---- drawing -------------------------------------------------------------------
  // Nearest decoded frame, searching the side we came from first so motion never runs backwards.
  function pick(l){
    const s=l.seq,d=l.want;if(s.bmp[d])return d;if(!s.count)return -1;
    for(let k=1;k<s.n;k++){const i=d-dir*k;if(i<0||i>=s.n)break;if(s.bmp[i])return i;}
    for(let k=1;k<s.n;k++){const i=d+dir*k;if(i<0||i>=s.n)break;if(s.bmp[i])return i;}
    return -1;
  }
  function cover(c,img,alpha,zoom,focus,ox=0,oy=0){
    const iw=img.width||img.naturalWidth,ih=img.height||img.naturalHeight,w=c.canvas.width,h=c.canvas.height;
    const k=Math.max(w/iw,h/ih)*zoom,dw=iw*k,dh=ih*k;
    c.globalAlpha=alpha;c.drawImage(img,(w-dw)*focus+ox,(h-dh)/2+oy,dw,dh);
  }
  function drawLandscape(list){
    if(list[0].alpha<1){ctx.globalAlpha=1;ctx.fillStyle='#050507';ctx.fillRect(0,0,W,H);}
    for(const e of list){
      const l=e.layer;
      if(l.fx==='morph'&&!e.held){
        // Panel-to-film handoff: a gentle push and a dark pressure band travel with the morph (reference's 2D path).
        const v=local(l,e.p),o=Math.sin(Math.PI*v),ox=o*W*.018;
        cover(ctx,e.img,e.alpha,e.zoom*(1+.04*o),l.focus??.5,ox,-.18*ox);
        if(o>.001){const g=ctx.createLinearGradient(0,H,W,0);g.addColorStop(Math.max(0,v-.22),'rgba(8,12,18,0)');g.addColorStop(clamp(v),`rgba(8,12,18,${(.18*o).toFixed(3)})`);g.addColorStop(Math.min(1,v+.22),'rgba(8,12,18,0)');ctx.globalAlpha=e.alpha;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
      }else cover(ctx,e.img,e.alpha,e.zoom,l.focus??.5);
    }
  }
  // Portrait: the full landscape frame sits in a band above the copy, over a blurred copy of itself.
  function drawPortrait(list){
    softCtx.globalAlpha=1;softCtx.fillStyle='#050507';softCtx.fillRect(0,0,soft.width,soft.height);
    for(const e of list)cover(softCtx,e.img,e.alpha,1,.5);
    // Same two-step upscale as the reference (1/18 → CSS pixels → device pixels), which keeps the backdrop soft.
    midCtx.imageSmoothingEnabled=true;midCtx.imageSmoothingQuality='high';midCtx.drawImage(soft,0,0,mid.width,mid.height);
    ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';ctx.drawImage(mid,0,0,W,H);ctx.imageSmoothingQuality='high';
    ctx.fillStyle='rgba(5,5,7,.58)';ctx.fillRect(0,0,W,H);
    const top=list[list.length-1].img,fh=Math.round(W*(top.height||top.naturalHeight)/(top.width||top.naturalWidth)),y=Math.round(Math.max(0,Math.min(.56*H-fh,H-fh)));
    ctx.fillStyle='#050507';ctx.fillRect(0,y-1,W,fh+2);
    for(const e of list){ctx.globalAlpha=e.alpha;ctx.drawImage(e.img,0,y,W,fh);}
    ctx.globalAlpha=1;const line=Math.max(1,Math.round(scale));ctx.fillStyle='rgba(236,234,223,.16)';ctx.fillRect(0,y,W,line);ctx.fillRect(0,y+fh-line,W,line);
    const bottom=y+fh;
    if(bottom<H){const g=ctx.createLinearGradient(0,bottom,0,H);g.addColorStop(0,'rgba(5,5,7,0)');g.addColorStop(.42,'rgba(5,5,7,.72)');g.addColorStop(1,'rgba(5,5,7,.94)');ctx.fillStyle=g;ctx.fillRect(0,bottom,W,H-bottom);}
    if(y>0){const g=ctx.createLinearGradient(0,0,0,y);g.addColorStop(0,'rgba(5,5,7,.5)');g.addColorStop(1,'rgba(5,5,7,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,y);}
  }

  // base: something opaque (the hero) is still on screen, so the bottom canvas layer must not fade to black.
  function render(p,{now=performance.now(),base=false}={}){
    ticks++;
    if(lastP>=0&&p!==lastP)dir=p>lastP?1:-1;
    lastP=p;
    let speed=0;
    for(const l of layers){
      const v=visOf(l),s=l.seq;
      const fadeIn=lin(p,v[0],v[1]);
      l.alpha=hidden(l)?0:(l.panel&&!portrait?outCubic(fadeIn):fadeIn)*(1-lin(p,v[2],v[3]));
      s.active=!hidden(l)&&p>=v[0]-.02&&p<=v[3]+.02;
      const w=frameAt(l,clamp(p,v[0],v[3]));
      if(l.alpha>0)speed=Math.max(speed,Math.abs(w-l.want));
      l.want=s.want=w;
    }
    schedule(p,speed);

    const wanted=layers.filter(l=>l.alpha>0);
    if(!wanted.length)return report([],null,false);
    const list=[];
    for(const l of wanted){
      const i=pick(l);
      if(i<0){l.late=true;continue;}
      if(l.late){l.late=false;l.readyAt=now;}
      const v=visOf(l),zoom=l.settle&&!portrait?1.025-.025*outCubic(lin(p,v[0],v[1])):1,ramp=clamp((now-l.readyAt)/220);
      list.push({layer:l,i,img:l.seq.bmp[i],alpha:l.alpha*ramp,ramp,zoom,p});
    }
    // Hold the last drawn base frame when the scene that should sit at the bottom is not decoded yet,
    // or is still easing in after arriving late.
    const heldOk=held&&held.seq.bmp[held.i];
    if(heldOk&&(!list.length||list[0].layer!==wanted[0]||(list[0].ramp<1&&held.layer!==list[0].layer)))list.unshift({layer:held.layer,i:held.i,img:held.seq.bmp[held.i],alpha:1,ramp:1,zoom:1,p,held:true});
    if(!list.length)return report(wanted,null,true);
    // The bottom layer is opaque whenever anything shares the frame, so crossfades never dip toward black.
    if(base||((wanted.length>1||list.length>1)&&!(list[0].ramp<1&&!list[0].held)))list[0].alpha=1;
    let from=0;for(let k=list.length-1;k>0;k--)if(list[k].alpha>=.999){from=k;break;}
    const draw=from?list.slice(from):list;
    if(draw[0].alpha<1&&from)draw[0].alpha=1;
    for(const e of draw)if(!e.held)e.layer.shown=e.i;
    const b=draw[0];if(!b.held&&b.alpha>=.999)held={seq:b.layer.seq,i:b.i,layer:b.layer};
    let sig=`${W}x${H}${portrait?'p':'l'}`;
    for(const e of draw)sig+=`|${e.layer.key}:${e.i}:${Math.round(e.alpha*255)}:${Math.round(e.zoom*4000)}${e.layer.fx&&!e.held?':'+Math.round(local(e.layer,p)*600):''}`;
    if(sig!==signature){signature=sig;if(portrait)drawPortrait(draw);else drawLandscape(draw);ctx.globalAlpha=1;}
    return report(wanted,draw,false);
  }

  let reported='';
  function report(wanted,draw,blank){
    const painted=signature!=='';
    if(!probe)return painted;
    const top=draw&&draw[draw.length-1],target=wanted[wanted.length-1];
    const stale=target&&top?(top.layer===target&&!top.held?Math.abs(top.i-target.want):99):'';
    const r=`${top?top.layer.key:''}|${top?top.i:''}|${target?target.key:''}|${stale}|${blank?1:0}`;
    if(r===reported)return painted;reported=r;
    const d=container.dataset;d.scene=top?top.layer.key:'';d.frame=top?String(top.i):'';d.want=target?target.key:'';d.stale=String(stale);d.blank=blank?'1':'0';
    d.story=lastP.toFixed(5);d.frameSet=root;d.memoryMB=String(Math.round(bytes/1e6));
    return painted;
  }

  function resize(){
    portrait=innerHeight>=innerWidth;
    const w=innerWidth,h=innerHeight,dpr=devicePixelRatio||1;
    scale=Math.min(dpr,2,Math.sqrt(2.6e6/(w*h)));
    W=canvas.width=Math.max(1,Math.round(w*scale));H=canvas.height=Math.max(1,Math.round(h*scale));
    soft.width=Math.max(1,Math.round(w/18));soft.height=Math.max(1,Math.round(h/18));
    mid.width=portrait?Math.max(1,Math.round(w)):1;mid.height=portrait?Math.max(1,Math.round(h)):1;
    ctx.fillStyle='#050507';ctx.fillRect(0,0,W,H);signature='';
  }
  resize();

  return {
    render,resize,
    // Loader gate: the first frame of a scene fetched and decoded.
    prepare(key){
      const l=byKey.get(key);if(!l)return Promise.resolve();
      const s=l.seq,i=l.start;
      return fetchFrame(s,i,'high').then(()=>s.blobs[i] instanceof Blob?decodeFrame(s,i):null);
    },
    drawable(key){const s=byKey.get(key)?.seq;return !!s&&s.count>0;},
    destroy(){dead=true;for(const l of layers)l.seq.bmp.forEach(b=>b?.close?.());},
  };
}
