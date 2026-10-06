import {reduce,clamp,ease} from '../_engine/story-runtime.js';

export function createPinnedScenes() {
  if(reduce)return {measure(){},render(){}};
  document.body.classList.add('has-pinned-scenes');
  const anatomy=document.querySelector('.anatomy-spread');
  const fillings=document.querySelector('.fillings-title');
  const gallery=document.querySelector('.food-gallery');
  const street=document.querySelector('.street-icon');
  const closing=document.querySelector('.closing-collage');
  function scene(element,name) {
    const outer=document.createElement('section'),pin=document.createElement('div');
    outer.className=`${name}-sequence scene-controlled`;
    outer.id=element.id;element.removeAttribute('id');
    pin.className=`${name}-pin scene-pin`;
    element.before(outer);outer.append(pin);pin.append(element);
    return {outer,pin,top:0,length:1,height:1,state:null};
  }
  const anatomyScene=scene(anatomy,'anatomy');
  const prelude=document.createElement('div');prelude.className='anatomy-prelude';
  prelude.innerHTML='<h2>DISCOVER THE DELICATE<br>BALANCE OF TEXTURES AND<br>FLAVOURS THAT MADE THE<br>WORLD FALL IN LOVE.</h2><img src="reference-media/preanatomy-banh-mi.png" alt="A Vietnamese sandwich with fresh herbs and crisp vegetables" width="900" height="650">';
  anatomy.before(prelude);
  const preludeImage=prelude.querySelector('img');
  const sandwich=anatomy.querySelector('.anatomy-sandwich'),star=anatomy.querySelector('.anatomy-star');
  const anatomyTitles=[anatomy.querySelector('h2'),anatomy.querySelector('.anatomy-word')];
  const ingredients=[...anatomy.querySelectorAll('.anatomy-list li')];
  const corners=[...anatomy.querySelectorAll('.corner-cut img')];

  const fillingsScene=scene(fillings,'fillings');
  fillingsScene.pin.append(gallery);gallery.removeAttribute('id');
  const galleryStop=document.createElement('span');galleryStop.id='food-gallery';galleryStop.className='scene-anchor';galleryStop.setAttribute('aria-hidden','true');fillingsScene.outer.append(galleryStop);
  const fillingRows=[...fillings.querySelectorAll('h2>span')];
  const fillingDirections=[1,-1,1],fillingAngles=[26,-26,26];
  street.classList.add('scene-controlled');
  const streetScene={outer:street,pin:street.querySelector('.street-icon-pin'),top:0,length:1,height:1,state:null};
  const streetHeading=street.querySelector('h2');
  streetHeading.innerHTML='A SMALL<br>SANDWICH.<br>A BIG PART<br>OF VIETNAM’S<br>STREETS.';
  const streetType=document.createElement('div');streetType.className='street-type';streetHeading.before(streetType);streetType.append(streetHeading);
  const streetInk=streetHeading.cloneNode(true);streetInk.className='street-ink';streetInk.setAttribute('aria-hidden','true');streetType.append(streetInk);
  const streetPhotos=[...street.querySelectorAll('.street-icon-photo')];
  const streetY=[160,-220,200,-140],streetAngle=[-6,8,-8,5];

  const closingScene=scene(closing,'closing');
  const closingHeading=closing.querySelector('h2');
  const nodes=[...closingHeading.childNodes];let line=document.createElement('span');line.className='scene-line';closingHeading.replaceChildren(line);
  for(const node of nodes){if(node.nodeName==='BR'){line=document.createElement('span');line.className='scene-line';closingHeading.append(line)}else line.append(node)}
  const closingLines=[...closingHeading.children],bites=[...closing.querySelectorAll('.closing-bite')];
  const invitation=closing.querySelector('.paper-invitation'),contact=closing.querySelector('.closing-contact');
  const scenes=[anatomyScene,fillingsScene,streetScene,closingScene];
  let screenWidth=innerWidth,screenHeight=innerHeight;
  function measure() {
    screenWidth=innerWidth;screenHeight=innerHeight;
    for(const s of scenes) {
      s.top=s.outer.offsetTop;s.height=s.outer.offsetHeight;
      s.length=Math.max(1,s.height-s.pin.offsetHeight);s.state=null;
    }
    galleryStop.style.top=`${fillingsScene.length*.8}px`;
  }
  const phase=(p,start,end)=>ease((p-start)/(end-start));
  function lift(el,p,distance=45){el.style.opacity=p;el.style.transform=`translate3d(0,${(1-p)*distance}px,0)`}
  function render(y) {
    for(let i=0;i<scenes.length;i++) {
      const s=scenes[i],visible=y+screenHeight>s.top&&y<s.top+s.height;
      const state=visible?'active':y<s.top?'before':'after';
      if(state!==s.state)s.outer.classList.toggle('is-motion-active',visible);
      if(state!=='active'&&state===s.state)continue;
      s.state=state;
      const p=clamp((y-s.top)/s.length);
      if(i===0) {
        const wipe=phase(p,.18,.5),half=wipe*75;
        anatomy.style.clipPath=wipe===1?'none':`polygon(${50-half+15}% 0,${50+half+15}% 0,${50+half-15}% 100%,${50-half-15}% 100%)`;
        anatomy.style.visibility=wipe===0?'hidden':'visible';
        anatomy.inert=wipe<.65;prelude.inert=wipe>.65;
        preludeImage.style.transform=`translate3d(${phase(p,.08,.35)*screenWidth*.07}px,0,0) scale(${1-phase(p,.08,.35)*.4})`;
        const grow=phase(p,.45,.8);
        sandwich.style.transform=`rotate(${-18+grow*10}deg) scale(${.42+grow*.58})`;
        star.style.transform=`rotate(${-25+grow*43}deg) scale(${.65+grow*.35})`;
        for(let j=0;j<anatomyTitles.length;j++)lift(anatomyTitles[j],phase(p,.22+j*.04,.43+j*.04));
        for(let j=0;j<ingredients.length;j++)lift(ingredients[j],phase(p,.28+(j%5)*.02,.46+(j%5)*.02),24);
        for(let j=0;j<corners.length;j++) {
          const a=phase(p,.48+j*.025,.72+j*.025);
          corners[j].style.transform=`scale(${.5+a*.5}) rotate(${(1-a)*(j%2?-25:25)}deg)`;
        }
      } else if(i===1) {
        const split=phase(p,.15,.6),grow=phase(p,.3,.7);
        for(let j=0;j<fillingRows.length;j++)fillingRows[j].style.transform=`translate3d(${fillingDirections[j]*split*screenWidth*.72}px,0,0) rotate(${fillingAngles[j]*split}deg) scale(${1-split*.3})`;
        fillings.style.opacity=1-phase(p,.46,.6);fillings.inert=p>.46;
        gallery.style.opacity=p>=.3?1:0;
        gallery.style.transform=`scale(${.18+grow*.82})`;
        gallery.style.clipPath=grow===1?'none':`inset(0 ${(1-grow)*48}%)`;
        gallery.inert=grow<.95;
      } else if(i===2) {
        const fill=phase(p,.06,.78);
        streetInk.style.clipPath=`inset(0 0 ${(1-fill)*100}% 0)`;
        streetType.style.transform=`scale(${.84+phase(p,0,.4)*.16})`;
        for(let j=0;j<streetPhotos.length;j++) {
          streetPhotos[j].style.transform=`translate3d(0,${(p-.5)*streetY[j]}px,0) rotate(${streetAngle[j]*(1-p)}deg)`;
          streetPhotos[j].style.opacity=1-phase(p,.25,.65)*.85;
        }
      } else {
        const arrive=phase(p,0,.52);
        for(let j=0;j<closingLines.length;j++)closingLines[j].style.transform=`translate3d(${(j%2?1:-1)*(1-arrive)*screenWidth}px,0,0)`;
        bites[0].style.transform=`translate3d(0,${(1-arrive)*-screenHeight*.4}px,0) rotate(${20+arrive*10}deg)`;
        bites[1].style.transform=`translate3d(0,${(1-arrive)*screenHeight*.4}px,0) rotate(${-10-arrive*10}deg)`;
        const paper=phase(p,.35,.75);invitation.style.opacity=paper;
        invitation.style.scale=.65+paper*.35;
        contact.style.opacity=phase(p,.65,.86);contact.inert=p<.65;
      }
    }
  }
  measure();
  return {measure,render};
}
