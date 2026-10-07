import {clamp,reduce} from '../_engine/story-runtime.js';

// Pink "soak" reveal from illustrated to real imagery, matched to the reference: same noise field,
// same soak window (story time .004-.03), same pink core and fringe. The mask and fringe are computed at
// 240x135 like the reference (which gives the soft, painterly edge); the real image is sampled at full
// resolution in one WebGL pass. Once fully soaked the real footage is shown directly and WebGL idles.
const SOAK=[.004,.03],FW=240,FH=135;
const hash=(e,t)=>{let i=(0x165667b1*e+0x27d4eb2f*t)|0;return (((i=(i^(i>>13))*0x4bf19f61)^(i>>16))>>>0)/0xffffffff;};
function field(origin){
  const r=[],n=[],a=Math.round(FW/240*30),s=Math.round(FW/240*9);
  for(let e=0;e<400;e++){r.push(hash(e,5));n.push(hash(e,17));}
  const noise=(x,y,cell,table)=>{let u=x/cell,v=y/cell;const i=u|0,j=v|0;let fx=u-i,fy=v-j;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
    const d=table[(20*j+i)%400],m=table[(20*j+i+1)%400],h=table[((j+1)*20+i)%400];return d+(m-d)*fx+(h-d)*fy+(d-m-h+table[((j+1)*20+i+1)%400])*fx*fy;};
  const out=new Float32Array(FW*FH);let lo=1e9,hi=-1e9;
  for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){const v=Math.hypot(x/FW-origin[0],y/FH-origin[1])+(noise(x,y,a,r)-.5)*.3+(noise(x,y,s,n)-.5)*.12;out[y*FW+x]=v;if(v<lo)lo=v;if(v>hi)hi=v;}
  for(let i=0;i<out.length;i++)out[i]=(out[i]-lo)/(hi-lo);
  return out;
}

export function createHeroReveal(holder){
  const none={render(){},resize(){},full:false};
  if(reduce)return none;
  const surface=document.createElement('canvas');surface.className='hero-reveal';surface.setAttribute('aria-hidden','true');
  const video=document.createElement('video');video.className='hero-real';video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-hidden','true');video.poster='reference-media/hero-real-poster.jpg';
  const board=document.createElement('img');board.className='hero-real hero-real-board';board.alt='';board.setAttribute('aria-hidden','true');board.decoding='async';
  holder.append(video,board,surface);
  const comic=holder.querySelector('.film-video');
  const gl=surface.getContext('webgl',{alpha:true,antialias:false,depth:false,premultipliedAlpha:true});
  let portrait=innerHeight>=innerWidth,mask=null,pink=null,alphaData=null,lastK=-1,uploaded=-1,state='',fieldFor='',waiting=false,catchup=-1;
  const real=()=>portrait?board:video;
  function ensureSource(){
    if(!board.getAttribute('src'))board.src='reference-media/batch-79-crow-alley-phone-safe-board-v1-1536.avif';
    if(!portrait&&!video.getAttribute('src')){video.src='reference-media/hero-real.mp4';video.load();}
  }
  function buildField(){
    const key=portrait?'p':'l';if(fieldFor===key)return;fieldFor=key;
    mask=field(portrait?[.23,.34]:[.82,.55]);pink=new Uint8Array(FW*FH*4);alphaData=new Uint8Array(FW*FH);lastK=-1;
  }
  if(!gl){surface.remove();}
  let program,loc={},tex={};
  if(gl){
    const vs='attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    const fs=`precision mediump float;varying vec2 uv;uniform sampler2D real,mask,pink;uniform vec2 viewport,imageSize;uniform float focusX;
    void main(){
      float ca=viewport.x/viewport.y,ia=imageSize.x/imageSize.y;vec2 s=uv;
      if(ca>ia)s.y=(uv.y-.5)*ia/ca+.5;else s.x=uv.x*ca/ia+(1.-ca/ia)*focusX;
      vec3 r=texture2D(real,s).rgb;float a=texture2D(mask,uv).a;vec4 k=texture2D(pink,uv);
      gl_FragColor=vec4(k.rgb*k.a+(1.-k.a)*r*a,k.a+(1.-k.a)*a);
    }`;
    const compile=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;};
    try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link');}
    catch{program=null;surface.remove();}
  }
  if(program){
    gl.useProgram(program);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
    for(const n of ['real','mask','pink','viewport','imageSize','focusX'])loc[n]=gl.getUniformLocation(program,n);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    ['real','mask','pink'].forEach((n,unit)=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
      for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
      gl.uniform1i(loc[n],unit);tex[n]=t;});
    surface.addEventListener('webglcontextlost',e=>{e.preventDefault();program=null;surface.style.display='none';});
  }
  // Reference fringe: hot core just outside the soaked edge, pink falling off over the next .026 of the field.
  function soak(k){
    for(let e=0;e<mask.length;e++){
      const t=mask[e]-k;alphaData[e]=255*clamp(-t/.05);
      let a=0,r=255,g=61,b=129;
      if(t>=0&&t<.004){g=150;b=190;a=.95;}else if(t>=.004&&t<.03){const f=1-(t-.004)/.026;a=f*f*.85;}
      const o=e*4;pink[o]=r;pink[o+1]=g;pink[o+2]=b;pink[o+3]=255*a;
    }
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,tex.mask);gl.texImage2D(gl.TEXTURE_2D,0,gl.ALPHA,FW,FH,0,gl.ALPHA,gl.UNSIGNED_BYTE,alphaData);
    gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,tex.pink);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,FW,FH,0,gl.RGBA,gl.UNSIGNED_BYTE,pink);
  }
  function resize(){
    const previous=portrait;
    portrait=innerHeight>=innerWidth;buildField();
    if(previous!==portrait){state='';waiting=false;catchup=-1;if(board.getAttribute('src'))ensureSource();}
    const dpr=Math.min(devicePixelRatio||1,1.5);surface.width=Math.round(innerWidth*dpr);surface.height=Math.round(innerHeight*dpr);
    if(program){gl.viewport(0,0,surface.width,surface.height);gl.uniform2f(loc.viewport,surface.width,surface.height);gl.uniform1f(loc.focusX,portrait?0:.5);}
    lastK=-1;uploaded=-1;
  }
  function setState(next){
    if(state===next)return;state=next;
    surface.style.visibility=next==='soak'?'visible':'hidden';
    video.classList.toggle('is-full',next==='full'&&!portrait);board.classList.toggle('is-full',next==='full'&&portrait);
    if(next==='idle'||next==='off'||portrait)video.pause();else video.play().catch(()=>{});
    if(comic){if(next==='full'||next==='off'||portrait)comic.pause();else if(document.body.classList.contains('is-ready'))comic.play().catch(()=>{});}
  }
  // p: story time. heroVisible: the hero layer is on screen at all.
  function render(p,heroVisible,dt=16.667){
    if(!document.body.classList.contains('is-ready')||document.hidden){setState('off');return;}
    if(!heroVisible){setState('off');return;}
    if(p>=SOAK[0]-.003)ensureSource();
    let a=clamp((p-SOAK[0])/(SOAK[1]-SOAK[0]));
    if(a<=0){waiting=false;catchup=-1;setState('idle');return;}
    const src=real(),ready=portrait?board.complete&&board.naturalWidth:video.readyState>=2;
    if(!ready){waiting=true;setState('idle');return;}
    if(waiting){waiting=false;catchup=0;}
    if(catchup>=0){catchup=Math.min(a,catchup+dt/300);a=catchup;if(catchup>=1)catchup=-1;}
    if(a>=1||!program){setState('full');return;}
    setState('soak');
    const k=1.16*a;
    if(k!==lastK){soak(k);lastK=k;}
    const frame=portrait?1:video.currentTime;
    if(frame!==uploaded){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex.real);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,src);gl.uniform2f(loc.imageSize,src.videoWidth||src.naturalWidth,src.videoHeight||src.naturalHeight);uploaded=frame;}
    else if(k===lastK&&surface.dataset.k===String(k))return;
    surface.dataset.k=String(k);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  resize();
  return {render,resize};
}
