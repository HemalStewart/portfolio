export function createMediaScrubber(container) {
  const slots=new Map(),mobile=matchMedia('(max-width:700px)').matches;
  const poster=document.createElement('img');poster.className='motion-poster';poster.alt='';container.append(poster);
  let clock=0,requests=[],presented='',blendTo='',blendFrom='',lastTick=performance.now();
  function seek(slot) {
    const v=slot.video;
    if(!slot.requested||v.readyState<1||!Number.isFinite(v.duration)||v.seeking||performance.now()<slot.nextSeek)return;
    const target=Math.round(slot.progress*Math.max(0,v.duration-1/48)*48)/48;
    if(Math.abs(v.currentTime-target)>1/60)v.currentTime=target;
    else if(v.readyState>=2){slot.decoded=true;slot.frameTime=v.currentTime;}
  }
  function get(key) {
    let slot=slots.get(key);if(slot){slot.used=++clock;return slot;}
    if(slots.size>=3) {
      const oldest=[...slots.values()].filter(s=>!s.requested&&s.key!==presented&&s.key!==blendFrom).sort((a,b)=>a.used-b.used)[0];
      if(!oldest)return null;
      oldest.video.removeAttribute('src');oldest.video.load();oldest.video.remove();slots.delete(oldest.key);
    }
    const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.className='motion-clip';v.setAttribute('aria-hidden','true');v.style.opacity='0';
    slot={key,video:v,used:++clock,requested:false,progress:0,decoded:false,mix:0,nextSeek:0,frameTime:0};slots.set(key,slot);
    slot.ready=new Promise(resolve=>{v.addEventListener('loadeddata',()=>{seek(slot);resolve()},{once:true});v.addEventListener('error',()=>{slot.failed=true;resolve()},{once:true});});
    v.addEventListener('loadedmetadata',()=>seek(slot));
    v.addEventListener('seeked',()=>{slot.decoded=v.readyState>=2;slot.frameTime=v.currentTime;slot.nextSeek=performance.now()+16;});
    v.addEventListener('canplay',()=>seek(slot));
    container.append(v);v.src=`motion-media/${key}-${mobile?'mobile':'desktop'}.mp4`;return slot;
  }
  function tick(now=performance.now()) {
    for(const slot of slots.values())seek(slot);
    const dt=Math.min(64,now-lastTick);lastTick=now;
    if(requests.length>1&&!slots.get(requests[0].key)?.decoded)return;
    let front=null,back=null;
    for(const r of requests) {const slot=slots.get(r.key);if(!slot?.decoded)continue;if(r.weight>0) {back=front;front=slot;}}
    // Keep the previous decoded image until the incoming chapter has a real frame.
    if(!front)return;
    const request=requests.find(r=>r.key===front.key),target=request?.weight??1;
    if(blendTo!==front.key) {blendFrom=presented;blendTo=front.key;front.mix=Number(front.video.style.opacity)||0;}
    if(front.video.style.zIndex!=='2')front.video.style.zIndex='2';
    const previous=back||slots.get(blendFrom);if(previous&&previous!==front&&previous.video.style.zIndex!=='1')previous.video.style.zIndex='1';
    if(back)front.mix=target;
    else if(front.mix<target)front.mix=Math.min(target,front.mix+dt/320);else front.mix=target;
    for(const slot of slots.values()) {
      let opacity=0;
      if(slot===front)opacity=front.mix;
      else if(slot===previous)opacity=1;
      if(slot.opacity!==opacity){slot.video.style.opacity=String(opacity);slot.opacity=opacity;}
    }
    if(!previous&&front.opacity!==1){front.video.style.opacity='1';front.opacity=1;}
    const displayed=previous&&front.mix<.5?previous:front;presented=displayed.key;
    if(front.mix>=1||back)blendFrom='';
    if(poster.style.opacity!=='0')poster.style.opacity='0';
    if(container.dataset.scene!==displayed.key)container.dataset.scene=displayed.key;
    const frameTime=displayed.frameTime.toFixed(3);if(container.dataset.presentedTime!==frameTime)container.dataset.presentedTime=frameTime;
  }
  return {
    prepare(key){return get(key)?.ready||Promise.resolve()},
    prefetch(key){if(!key||requests.some(r=>!slots.get(r.key)?.decoded))return;get(key)},
    show(layers) {
      requests=layers;
      for(const s of slots.values())s.requested=layers.some(r=>r.key===s.key);
      for(const r of layers) {const s=get(r.key);if(!s)continue;s.requested=true;s.progress=r.progress;seek(s);}
      const primary=layers[layers.length-1];
      if(!presented&&primary&&poster.dataset.key!==primary.key){poster.src=`reference-media/${primary.key==='transit-reveal'?'next-panel-transit-colosseum-comic-motion-v1':primary.key}/f_001.webp`;poster.dataset.key=primary.key;poster.style.opacity='1';}
      const failed=primary&&slots.get(primary.key)?.failed;
      if(failed){poster.src=`reference-media/${primary.key==='transit-reveal'?'next-panel-transit-colosseum-comic-motion-v1':primary.key}/f_001.webp`;poster.style.opacity='1';poster.style.zIndex='3';}else poster.style.zIndex='-1';
    },
    tick,
  };
}
