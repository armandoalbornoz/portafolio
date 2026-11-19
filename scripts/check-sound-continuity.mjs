import assert from 'node:assert/strict';
import {createPortfolioSound} from '../sound.js';

function player(){
 const notes=[];let callback=null,created=0;
 class Param{
  value=0;
  setValueAtTime(value){this.value=value;}
  exponentialRampToValueAtTime(){}
  linearRampToValueAtTime(){}
  setTargetAtTime(){}
  cancelScheduledValues(){}
 }
 const node=()=>({connect(){},disconnect(){},gain:new Param(),frequency:new Param(),Q:new Param(),playbackRate:new Param(),start(){created++;},stop(){}});
 const context={currentTime:0,sampleRate:48000,state:'running',destination:{},createGain:node,createBufferSource:node,createBiquadFilter:node,
  createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};},
  createDynamicsCompressor(){return {...node(),...Object.fromEntries(['threshold','knee','ratio','attack','release'].map(key=>[key,new Param()]))};},
  createOscillator(){const source=node();source.start=time=>{created++;if(['square','triangle'].includes(source.type))notes.push({time:Number(time.toFixed(6)),type:source.type,frequency:Number(source.frequency.value.toFixed(6))});};return source;},
  resume(){this.state='running';return Promise.resolve();},suspend(){this.state='suspended';return Promise.resolve();}
 };
 const sound=createPortfolioSound({storage:{getItem:()=>null},contextFactory:()=>context,setTimer:fn=>(callback=fn,1),clearTimer:()=>{callback=null;}});
 return {sound,notes,context,get created(){return created;},advance(time){context.currentTime=time;const due=callback;callback=null;due?.();}};
}

const reference=player(),browsing=player();
for(const p of [reference,browsing]){p.sound.setScene('menu');p.sound.unlock();}
await Promise.resolve();
for(let time=.06;time<2.5;time+=.06)reference.advance(time);
browsing.advance(.25);browsing.advance(.55);
// Project preview construction delays the main-thread timer, while audio time advances.
browsing.sound.setScene('carousel');
const beforeStall=browsing.created;
browsing.advance(2);
assert.ok(browsing.created-beforeStall<=8,'A delayed timer must not replay missed notes in a burst.');
browsing.advance(2.12);
browsing.sound.setScene('reading');browsing.sound.setScene('carousel');
browsing.advance(2.3);browsing.advance(2.45);
const expected=reference.notes.filter(note=>note.time>=2&&note.time<2.5);
assert.ok(expected.length>0,'Reference playback must include a note after the simulated stall.');
assert.deepEqual(browsing.notes.filter(note=>note.time>=2&&note.time<2.5),expected,
 'Switching projects must keep the same musical position and beat timing after a delayed timer.');
assert.equal(browsing.sound.state().ambience,true);
browsing.sound.setEnabled(false);assert.equal(browsing.sound.state().ambience,false);
browsing.sound.setScene('off');browsing.sound.setEnabled(true);await Promise.resolve();
assert.equal(browsing.sound.state().ambience,false,'Power-off must still stop music.');
reference.sound.setEnabled(false);browsing.sound.setEnabled(false);
console.log('Project switching preserves musical position and beat timing after a stall, without catch-up bursts; mute and power-off still stop music.');
