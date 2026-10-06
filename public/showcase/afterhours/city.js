import * as T from '../_engine/vendor/three.module.js';

// An original, fully modelled street. The artwork remains a distant backdrop.
export function createCity(renderer) {
  const scene = new T.Scene();
  scene.background = new T.Color('#10151e');
  scene.fog = new T.FogExp2('#10151e', .018);
  const camera = new T.PerspectiveCamera(48, innerWidth / innerHeight, .1, 260);
  const city = new T.Group(); scene.add(city);
  scene.add(new T.HemisphereLight('#b9c5df', '#171415', 2.1));
  const moon = new T.DirectionalLight('#b8c4e2', 2.5); moon.position.set(-10,40,8); scene.add(moon);
  const gold = new T.PointLight('#ffc176', 60, 24, 2); gold.position.set(-3,4,2); scene.add(gold);
  const blue = new T.PointLight('#7a9cb9', 40, 22, 2); blue.position.set(3,6,-26); scene.add(blue);
  let seed = 2718;
  const random = () => {seed = (seed * 16807) % 2147483647;return (seed-1)/2147483646};
  const materials = {
    stone:new T.MeshStandardMaterial({color:'#373b43',roughness:.86}),
    iron:new T.MeshStandardMaterial({color:'#151b24',metalness:.65,roughness:.5}),
    brass:new T.MeshStandardMaterial({color:'#8c7956',metalness:.65,roughness:.42}),
    edge:new T.MeshStandardMaterial({color:'#59606d',roughness:.7}),
    warm:new T.MeshBasicMaterial({color:'#d6b481'}),
    cold:new T.MeshBasicMaterial({color:'#718fa9'})
  };
  const box = new T.BoxGeometry(1,1,1),plane=new T.PlaneGeometry(1,1);
  function block(w,h,d,x,y,z,mat=materials.stone,parent=city){const m=new T.Mesh(box,mat);m.scale.set(w,h,d);m.position.set(x,y,z);parent.add(m);return m}
  function sheet(w,h,x,y,z,mat,parent=city){const m=new T.Mesh(plane,mat);m.scale.set(w,h,1);m.position.set(x,y,z);parent.add(m);return m}
  function canvasTexture(draw,w=512,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return tx}
  function facadeTexture(index){return canvasTexture((c,w,h)=>{
    c.fillStyle=['#333942','#41464e','#343a41','#484b50'][index%4];c.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){const n=random();c.fillStyle=`rgba(${n>.5?'255,255,255':'0,0,0'},${random()*.07})`;c.fillRect(random()*w,random()*h,1+random()*3,1+random()*8)}
    c.strokeStyle='#1b232d';c.lineWidth=2;
    for(let y=0;y<h;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=(y%64?0:32);x<w;x+=64){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke()}}
    c.fillStyle='#222a35';c.fillRect(0,475,w,37);c.fillRect(0,0,14,h);c.fillRect(w-14,0,14,h);
  })}
  const walls=Array.from({length:4},(_,i)=>new T.MeshStandardMaterial({map:facadeTexture(i),roughness:.83,color:'#c9c8c6'}));
  const windowMap=canvasTexture((c,w,h)=>{c.fillStyle='#a58453';c.fillRect(0,0,w,h);const g=c.createRadialGradient(w*.55,h*.32,20,w*.55,h*.32,w*.7);g.addColorStop(0,'#e8d3ab');g.addColorStop(1,'#7c6a53');c.fillStyle=g;c.fillRect(10,10,w-20,h-20);c.fillStyle='#615748';for(let x=20;x<w;x+=16){c.globalAlpha=.2+Math.sin(x*.16)*.12;c.fillRect(x,10,6,h-20)}c.globalAlpha=1;c.fillStyle='#292e32';c.fillRect(0,h*.68,w,14);c.fillRect(w*.66,h*.68,12,h*.32);c.fillRect(w*.18,h*.69,12,h*.31);c.fillRect(0,h-38,w,38);c.fillStyle='#303732';c.fillRect(w*.12,h*.52,w*.2,h*.15);c.fillStyle='#55614b';for(let i=0;i<14;i++){c.beginPath();c.ellipse(w*.22+(random()-.5)*80,h*.5-random()*70,9,25,random()*2,0,Math.PI*2);c.fill()}},256,384);
  const glowMaterial=new T.MeshBasicMaterial({map:windowMap,color:'#e9dabd'});
  const lanternMaterial=new T.MeshStandardMaterial({color:'#eed2a2',emissive:'#b3833d',emissiveIntensity:.5,roughness:.8});
  const frameData=[],paneData=[],warmData=[],coldData=[],trimData=[];
  function instance(data,w,h,d,x,y,z,angle=0){data.push([w,h,d,x,y,z,angle])}
  function finishInstances(data,mat){const mesh=new T.InstancedMesh(box,mat,data.length);const ob=new T.Object3D();for(let i=0;i<data.length;i++){const a=data[i];ob.scale.set(a[0],a[1],a[2]);ob.position.set(a[3],a[4],a[5]);ob.rotation.y=a[6];ob.updateMatrix();mesh.setMatrixAt(i,ob.matrix)}city.add(mesh)}
  // Two rows of buildings, each with real inset windows, balconies and rooflines.
  for(let side=-1;side<=1;side+=2){for(let i=0;i<13;i++){
    const depth=6.3,height=10+Math.floor(random()*9),z=10-i*7,x=side*7.1;
    block(6,height,depth,x,height/2,z,walls[(i+(side===1?2:0))%4]);
    const faceX=side*4.03;
    instance(trimData,.28,.24,depth+.25,side*4.02,height-.6,z);
    instance(trimData,.32,.15,depth+.4,side*4.01,3.9,z);
    for(let level=0;level<Math.floor((height-4)/2.5);level++){for(let col=0;col<2;col++){
      const yy=5.3+level*2.45,zz=z-1.55+col*3.1;
      instance(frameData,.18,1.65,1.38,faceX,yy,zz);
      const selected=random();
      instance(selected>.67?warmData:selected>.54?coldData:paneData,.08,1.42,1.15,faceX-side*.12,yy,zz);
      instance(frameData,.22,.055,1.2,faceX-side*.17,yy,zz);
      instance(frameData,.24,1.5,.04,faceX-side*.17,yy,zz);
      if(level%2===0){instance(trimData,.65,.12,1.65,faceX-side*.35,yy-.85,zz);instance(frameData,.045,.7,1.65,faceX-side*.6,yy-.48,zz);}
    }}
    // Storefronts, doors, threshold and three-dimensional shutters.
    instance(frameData,.15,3.25,5.7,faceX,1.65,z);
    const lit=i%3!==2;instance(lit?warmData:paneData,.08,2.5,3.8,faceX-side*.09,1.7,z+.5);
    for(let k=0;k<5;k++)instance(frameData,.18,2.6,.035,faceX-side*.15,1.7,z-1.1+k*.77);
    instance(frameData,.22,.12,5.85,faceX-side*.15,2.9,z);
    instance(trimData,.55,.18,5.9,faceX-side*.23,.15,z);
    for(let k=0;k<10;k++)instance(frameData,.18,.11,1.25,faceX-side*.13,.4+k*.23,z-2.1);
    // Pipes and AC boxes add foreground scale without hundreds of draw calls.
    instance(frameData,.09,height,.09,faceX-side*.08,height/2,z+2.5);
    instance(trimData,.35,.7,.9,faceX-side*.3,4.25,z+2.35);
    if(i<10){const awning=block(1.1,.08,5.6,faceX-side*.5,3.6,z,materials.iron);awning.rotation.z=side*.14;}
  }}
  finishInstances(frameData,materials.iron);finishInstances(paneData,new T.MeshStandardMaterial({color:'#111923',metalness:.8,roughness:.28}));finishInstances(warmData,glowMaterial);finishInstances(coldData,materials.cold);finishInstances(trimData,materials.edge);
  const road=new T.Mesh(new T.PlaneGeometry(8.1,118),new T.ShaderMaterial({
    uniforms:{},vertexShader:'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:`varying vec2 uv0;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 p=uv0*vec2(26.,180.);vec2 cell=floor(p);vec2 f=fract(p);float lines=smoothstep(.01,.09,min(f.x,f.y));float noise=hash(cell);vec3 col=mix(vec3(.018,.023,.029),vec3(.075,.087,.10),lines*(.6+noise*.4));float wet=pow(max(0.,1.-abs(uv0.x-.28)*7.),3.);float ripple=.4+.6*sin(p.y*5.+sin(p.x*8.));col+=vec3(.28,.17,.065)*wet*ripple*(.25+.75*hash(floor(p/vec2(2.,6.))));col+=vec3(.055,.10,.15)*pow(max(0.,1.-abs(uv0.x-.74)*8.),4.)*ripple;gl_FragColor=vec4(col,1.);}`
  }));road.rotation.x=-Math.PI/2;road.position.set(0,-.015,-30);city.add(road);
  block(.5,.16,118,-3.8,.08,-30);block(.5,.16,118,3.8,.08,-30);
  function sign(text,w,h,x,y,z,side=-1){
    const tex=canvasTexture((c,cw,ch)=>{c.fillStyle='#111920';c.fillRect(0,0,cw,ch);c.strokeStyle='#c6a16a';c.lineWidth=5;c.strokeRect(18,18,cw-36,ch-36);c.fillStyle='#e3bb7a';c.textAlign='center';c.textBaseline='middle';c.font=`700 ${Math.floor(ch*.32)}px sans-serif`;c.fillText(text,cw/2,ch/2)},768,384);
    const g=new T.Group();g.position.set(x,y,z);g.rotation.y=-side*Math.PI/2;city.add(g);block(w+.12,h+.12,.15,0,0,0,materials.iron,g);sheet(w,h,0,0,.08,new T.MeshBasicMaterial({map:tex}),g);
    const halo=canvasTexture((c,cw,ch)=>{const grd=c.createRadialGradient(cw/2,ch/2,0,cw/2,ch/2,cw*.48);grd.addColorStop(0,'#ffc06f55');grd.addColorStop(1,'#ffc06f00');c.fillStyle=grd;c.fillRect(0,0,cw,ch)});
    sheet(w*2.3,h*3.3,0,0,.1,new T.MeshBasicMaterial({map:halo,transparent:true,depthWrite:false,blending:T.AdditiveBlending}),g);
  }
  sign('AFTERHOURS',4.8,1.4,-3.73,4.45,5,-1);sign('夜 / NIGHT',2.2,1.8,3.72,6.4,-8,1);sign('RAMEN / 24',2.2,1.5,-3.72,4.5,-19,-1);sign('OPEN LATE',2.4,1.35,3.72,4.2,-30,1);sign('GOOD THINGS',2.4,1.3,-3.72,4.3,-47,-1);
  // Suspended cables, lanterns and bicycles are separate geometry.
  const cableMat=new T.LineBasicMaterial({color:'#0b111a'});
  for(let j=0;j<10;j++){const pts=[];for(let k=0;k<=20;k++){const x=-4+k*.4;pts.push(new T.Vector3(x,8.7-Math.sin(k/20*Math.PI)*1.2,6-j*8))}city.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),cableMat));}
  const lanternGeo=new T.SphereGeometry(.24,12,8);
  for(let i=0;i<12;i++){const m=new T.Mesh(lanternGeo,lanternMaterial);m.scale.set(1,1.3,1);m.position.set(i%2?-3.8:3.8,3.4,8-i*6);city.add(m);block(.15,.05,.14,m.position.x,3.75,m.position.z,materials.iron);}
  const rimGeo=new T.TorusGeometry(.38,.025,5,24);
  function bike(side,z){const g=new T.Group();g.position.set(side*3.35,.44,z);g.rotation.y=Math.PI/2+.12*side;city.add(g);for(const x of [-.57,.57]){const wheel=new T.Mesh(rimGeo,materials.iron);wheel.position.x=x;g.add(wheel)}const points=[new T.Vector3(-.57,0,0),new T.Vector3(-.1,.48,0),new T.Vector3(.3,0,0),new T.Vector3(-.57,0,0),new T.Vector3(.57,0,0),new T.Vector3(.22,.53,0),new T.Vector3(-.1,.48,0)];g.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:'#84909b'})));block(.25,.045,.11,-.12,.53,0,materials.iron,g);block(.05,.22,.06,.2,.64,0,materials.brass,g);}
  bike(-1,4);bike(-1,1.5);bike(1,-15);bike(-1,-23);
  // Distant towers form a proper skyline at the top of the camera rise.
  const skyWarm=[],skyCold=[];for(let i=0;i<28;i++){const h=18+random()*28,x=(i-14)*5.5,z=-100-random()*35;block(3.2+random()*3,h,4.5,x,h/2,z,walls[i%4]);for(let y=5;y<h;y+=4)for(let col=0;col<2;col++)instance(random()>.6?skyWarm:skyCold,.32,.7,.05,x-1+col*1.7,y,z+2.3)}
  finishInstances(skyWarm,materials.warm);finishInstances(skyCold,materials.cold);
  block(1.1,42,1.1,0,21,-98,materials.edge);block(4,.3,4,0,29,-98,materials.iron);block(.22,15,.22,0,48,-98,materials.warm);
  const shopReady=new T.TextureLoader().loadAsync('media/ramen.jpg').then(tx=>{tx.colorSpace=T.SRGBColorSpace;for(let i=0;i<6;i++){const side=i%2?1:-1,z=7-i*14;const m=sheet(5.2,2.7,side*3.82,1.6,z,new T.MeshBasicMaterial({map:tx,color:'#e7bf83'}));m.rotation.y=-side*Math.PI/2}}).catch(()=>{});
  const backdropReady=new T.TextureLoader().loadAsync('media/alley.webp').then(tx=>{tx.colorSpace=T.SRGBColorSpace;const bg=sheet(152,95,0,8,-150,new T.MeshBasicMaterial({map:tx,color:'#ffffff'}));bg.material.fog=false;}).catch(()=>{});
  const photoUniform={value:1};
  const projector=new T.PerspectiveCamera(48,16/9,.1,260);projector.position.set(0,2.3,15);projector.lookAt(0,4,-30);projector.updateMatrixWorld();
  const projectorMatrix=new T.Matrix4().multiplyMatrices(projector.projectionMatrix,projector.matrixWorldInverse);
  const projectionReady=new T.TextureLoader().loadAsync('media/alley.webp').then(photo=>{photo.colorSpace=T.SRGBColorSpace;
    const projectionMaterials=[...walls,materials.iron,materials.edge,glowMaterial,materials.cold];
    for(const mat of projectionMaterials){mat.fog=false;mat.onBeforeCompile=shader=>{shader.uniforms.cityPhoto={value:photo};shader.uniforms.photoProjection={value:projectorMatrix};shader.uniforms.photoWeight=photoUniform;
      shader.vertexShader='uniform mat4 photoProjection;varying vec4 cityUv;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
      vec4 cityWorld=vec4(transformed,1.0);
      #ifdef USE_INSTANCING
      cityWorld=instanceMatrix*cityWorld;
      #endif
      cityUv=photoProjection*modelMatrix*cityWorld;`);
      shader.fragmentShader='uniform sampler2D cityPhoto;uniform float photoWeight;varying vec4 cityUv;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`vec2 citySample=cityUv.xy/cityUv.w*.5+.5;float cityValid=step(0.,citySample.x)*step(citySample.x,1.)*step(0.,citySample.y)*step(citySample.y,1.)*step(0.,cityUv.w);outgoingLight=mix(outgoingLight,texture2D(cityPhoto,clamp(citySample,0.,1.)).rgb,photoWeight*cityValid*.94);
      #include <opaque_fragment>`);
    };mat.needsUpdate=true}
    road.material.uniforms.cityPhoto={value:photo};road.material.uniforms.photoProjection={value:projectorMatrix};road.material.uniforms.photoWeight=photoUniform;
    road.material.vertexShader='uniform mat4 photoProjection;varying vec4 cityUv;'+road.material.vertexShader.replace('uv0=uv;','uv0=uv;cityUv=photoProjection*modelMatrix*vec4(position,1.0);');
    road.material.fragmentShader='uniform sampler2D cityPhoto;uniform float photoWeight;varying vec4 cityUv;'+road.material.fragmentShader.replace('gl_FragColor=vec4(col,1.);','vec2 citySample=cityUv.xy/cityUv.w*.5+.5;float valid=step(0.,citySample.x)*step(citySample.x,1.)*step(0.,citySample.y)*step(citySample.y,1.);col=mix(col,texture2D(cityPhoto,clamp(citySample,0.,1.)).rgb,photoWeight*valid);gl_FragColor=vec4(col,1.);');road.material.needsUpdate=true;
  }).catch(()=>{});
  const target=new T.Vector3();const positions=[new T.Vector3(0,2.3,15),new T.Vector3(-.25,2.7,-5),new T.Vector3(.7,5.1,-27),new T.Vector3(0,26,-32),new T.Vector3(17,31,-23),new T.Vector3(19,33,7),new T.Vector3(1,40,-16)];
  const looks=[new T.Vector3(0,4,-30),new T.Vector3(0,4,-40),new T.Vector3(0,8,-54),new T.Vector3(0,3,-40),new T.Vector3(0,5,-50),new T.Vector3(0,10,-54),new T.Vector3(0,7,-55)];
  function draw(f,mx=0,my=0){photoUniform.value=1-Math.min(1,Math.max(0,(f-1.2)/.9))*.82;let n;if(f<1.7)n=f*(2/1.7);else if(f<2.9)n=2+(f-1.7)/1.2*2;else if(f<4.6)n=4;else if(f<5.2)n=4+(f-4.6)/.6;else n=5+(f-5.2)/.6;n=Math.min(5.99,n);const i=Math.floor(n),t=n-i;camera.position.lerpVectors(positions[i],positions[i+1],t);camera.position.x+=mx*2;camera.position.y+=my;target.lerpVectors(looks[i],looks[i+1],t);camera.lookAt(target);renderer.render(scene,camera);}
  function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?58:48;camera.updateProjectionMatrix();}
  resize();return {draw,resize,ready:Promise.all([backdropReady,shopReady,projectionReady])};
}
