import {clamp} from '../_engine/story-runtime.js';
// Chapter pacing follows the reference: each beat owns a number of screens, short "reading" holds
// add room where copy needs to be read, and touch devices get more distance per beat than wheel users.
const chapters=[
 [0,.13,2],[.13,.24,2.5],[.24,.33,2],[.33,.47,2.5],[.47,.55,2],
 [.55,.68,2.5],[.68,.79,2.5],[.79,.895,2.5],[.895,.978,4.5],[.978,1,9]
];
const shared=[[.2,.22,.25],[.305,.315,.5],[.425,.45,.25],[.508,.515,.5],[.544,.545,.75],[.74,.755,.35]];
const holds={
 landscape:[...shared,[.936,.945,.5],[.967,.973,.35]],
 portrait:[...shared,[.938,.94,.75],[.9494,.9505,1],[.957,.958,1],[.9815,.982,.75]]
};
function split(extra){
 return chapters.flatMap(([start,end,screens])=>{
  const inside=extra.filter(h=>h[0]>=start&&h[1]<=end).sort((a,b)=>a[0]-b[0]);
  if(!inside.length)return [[start,end,screens]];
  const cuts=[...new Set([start,...inside.flatMap(h=>[h[0],h[1]]),end])],rate=screens/(end-start);
  return cuts.slice(1).map((to,i)=>{const from=cuts[i],hold=inside.find(h=>h[0]===from);return [from,to,rate*(to-from)+(hold?hold[2]:0)]});
 });
}
const layouts={landscape:split(holds.landscape),portrait:split(holds.portrait)};
let beats=layouts.landscape,total=0;
export let screens=0;
// Recomputed on resize: orientation picks the beat list, pointer type picks the distance per screen.
export function configure(){
 beats=innerWidth>innerHeight?layouts.landscape:layouts.portrait;
 total=beats.reduce((n,b)=>n+b[2],0);
 const touch=matchMedia('(max-width:700px),(pointer:coarse)').matches;
 screens=total*(touch?2.5:1.5);
 return screens;
}
configure();
export function storyTime(scrollProgress){let distance=clamp(scrollProgress)*total;for(const [start,end,length] of beats){if(distance<=length)return start+(end-start)*distance/length;distance-=length;}return 1;}
export function scrollProgress(time){let distance=0;for(const [start,end,length] of beats){if(time<=end)return (distance+clamp((time-start)/(end-start))*length)/total;distance+=length;}return 1;}
