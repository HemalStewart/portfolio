import {reduce,clamp,loader,scrollEngine,navigation,restoreHash} from '../_engine/story-runtime.js';
import {createEditorialMotion} from './editorial.js';
import {createPinnedScenes} from './scenes.js';
loader();navigation();
const scenes=createPinnedScenes(),editorial=createEditorialMotion();
const header=document.querySelector('.food-header'),orbit=document.querySelector('.sandwich-orbit');
let last=-1,lastHero=-1;
function measure(){document.documentElement.style.setProperty('--stage-height',innerHeight+'px');scenes.measure();editorial.measure();last=-1;lastHero=-1}
function render(){editorial.gallery();const y=scrollY;if(Math.abs(y-last)<.05)return;last=y;header.classList.toggle('is-past-hero',y>innerHeight*.65);editorial.render(y);if(reduce)return;scenes.render(y);const p=clamp(y/innerHeight);if(p!==lastHero){lastHero=p;orbit.style.transform=`translate(-50%,-50%) rotate(${-p*8}deg) scale(${1-p*.05})`;}}
measure();addEventListener('resize',measure);document.fonts.ready.then(measure);
const lenis=scrollEngine(render);restoreHash(lenis);addEventListener('load',measure);
const credits=document.querySelector('#credits');document.querySelector('#credits-open').addEventListener('click',()=>credits.showModal());credits.querySelector('.dialog-close').addEventListener('click',()=>credits.close());
