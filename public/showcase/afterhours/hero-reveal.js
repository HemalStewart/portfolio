import {clamp,reduce} from '../_engine/story-runtime.js';

// One GPU mask, updated by the existing story clock; no second animation loop.
export function createHeroReveal(stage) {
  if(reduce)return {render(){},resize(){}};
  const mobile=matchMedia('(max-width:700px)').matches;
  const surface=document.createElement('canvas');
  surface.className='hero-reveal';surface.setAttribute('aria-hidden','true');
  stage.insertBefore(surface,stage.querySelector('#world'));
  const gl=surface.getContext('webgl',{alpha:true,antialias:false,depth:false,premultipliedAlpha:true});
  const source=document.createElement(mobile?'img':'video');
  if(mobile) source.src='reference-media/batch-79-crow-alley-phone-safe-board-v1-1536.avif';
  else {source.muted=true;source.loop=true;source.playsInline=true;source.preload='auto';source.src='reference-media/hero-real.mp4';}
  source.className='hero-real-source';source.setAttribute('aria-hidden','true');stage.append(source);
  const still=new Image();still.src=mobile?source.src:'reference-media/hero-real-poster.jpg';
  let textureReady=false,uploadedTime=-1,lastProgress=-1,width=1,height=1,visible=false;
  if(!gl) {
    source.classList.add('hero-reveal-fallback');
    return {resize(){},render(p){const q=clamp((p-.004)/.026);source.style.opacity=q*(1-clamp((p-.125)/.012));if(!mobile&&q>0&&p<.14&&source.paused)source.play().catch(()=>{});else if(!mobile&&p>=.14)source.pause();}};
  }
  const vertex='attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  const fragment=`precision highp float;varying vec2 uv;uniform sampler2D image;uniform vec2 viewport;uniform vec2 imageSize;uniform vec2 origin;uniform float progress;
  float hash(vec2 p){return fract(sin(dot(p,vec2(91.17,273.41)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
  void main(){
    vec2 sampleUV=uv;float aspect=viewport.x/viewport.y,ia=imageSize.x/imageSize.y;
    if(aspect>ia)sampleUV.y=(uv.y-.5)*ia/aspect+.5;else sampleUV.x=(uv.x-.5)*aspect/ia+.5;
    vec2 scale=vec2(aspect,1.);float distance=length((uv-origin)*scale);
    float rough=(noise(uv*vec2(7.,5.))-.5)*.13+(noise(uv*vec2(29.,21.))-.5)*.037;
    float extent=length(max(origin,1.-origin)*scale);
    float edge=distance+rough-(progress*(extent+.2)-.1);
    float revealed=1.-smoothstep(-.004,.004,edge);
    float core=exp(-pow(edge/.005,2.));float halo=exp(-abs(edge)/.024)*.65;
    float ends=smoothstep(0.,.025,progress)*(1.-smoothstep(.97,1.,progress));
    core*=ends;halo*=ends;
    float alpha=max(revealed,halo);
    vec3 color=texture2D(image,sampleUV).rgb;
    color=mix(color,vec3(1.,.24,.51),clamp(halo*(1.-revealed)+core*.7,0.,1.));
    color+=vec3(.42,.27,.31)*core;
    gl_FragColor=vec4(color*alpha,alpha);
  }`;
  function compile(type,text){const shader=gl.createShader(type);gl.shaderSource(shader,text);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader;}
  const program=gl.createProgram();
  try {gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}
  catch {surface.remove();source.remove();return {render(){},resize(){}};}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const locations={};for(const name of ['image','viewport','imageSize','origin','progress'])locations[name]=gl.getUniformLocation(program,name);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.uniform1i(locations.image,0);
  function upload(frame){gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,frame);gl.uniform2f(locations.imageSize,frame.videoWidth||frame.naturalWidth,frame.videoHeight||frame.naturalHeight);textureReady=true;}
  still.onload=()=>{upload(still);lastProgress=-1};if(still.complete&&still.naturalWidth)upload(still);
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.25);surface.width=Math.round(width*dpr);surface.height=Math.round(height*dpr);gl.viewport(0,0,surface.width,surface.height);gl.uniform2f(locations.viewport,width,height);gl.uniform2f(locations.origin,mobile?.23:.82,mobile?.66:.45);lastProgress=-1;}
  function render(p){
    const active=p>.001&&p<.14&&!document.hidden&&document.body.classList.contains('is-ready');
    if(active!==visible){visible=active;surface.style.visibility=active?'visible':'hidden';if(!mobile){if(active)source.play().catch(()=>{});else source.pause();}}
    if(!active||!textureReady)return;
    const q=clamp((p-.004)/.026);if(q!==lastProgress)surface.dataset.progress=q.toFixed(3);
    const frameChanged=!mobile&&source.readyState>=2&&source.currentTime!==uploadedTime;
    if(frameChanged){upload(source);uploadedTime=source.currentTime;}
    if(q===lastProgress&&!frameChanged)return;
    lastProgress=q;gl.uniform1f(locations.progress,q);gl.drawArrays(gl.TRIANGLES,0,6);
  }
  surface.addEventListener('webglcontextlost',e=>{e.preventDefault();surface.style.display='none';source.pause?.();});
  resize();return {render,resize};
}
