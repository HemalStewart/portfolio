import {clamp} from '../_engine/story-runtime.js';
// Give short finale clips room to breathe rather than compressing them into a few pixels.
const beats=[
 [0,.13,2],[.13,.24,2.5],[.24,.33,2],[.33,.47,2.5],
 [.47,.55,2],[.55,.68,2.5],[.68,.79,2.5],[.79,.895,2.5],
 [.895,.947,3],[.947,.963,2],[.963,.98,2],[.98,.985,1.5],
 [.985,.991,1.5],[.991,1,2.5]
];
export const screens=beats.reduce((n,b)=>n+b[2],0);
export function storyTime(scrollProgress) {let distance=clamp(scrollProgress)*screens;for(const [start,end,length] of beats){if(distance<=length)return start+(end-start)*distance/length;distance-=length;}return 1;}
export function scrollProgress(time) {let distance=0;for(const [start,end,length] of beats){if(time<=end)return (distance+clamp((time-start)/(end-start))*length)/screens;distance+=length;}return 1;}
