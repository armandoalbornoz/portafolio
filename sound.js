// Original, synthesized terminal audio. No recordings or music downloads.
const preferenceKey='armando.portfolio.sound.v1';
export function createPortfolioSound(options={}){
 let storage;try{storage=options.storage??globalThis.localStorage;}catch{}
 let enabled=true;try{enabled=storage?.getItem(preferenceKey)!=='off';}catch{}
 const makeContext=options.contextFactory??(()=>{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;return Audio?new Audio():null;});
 const later=options.setTimer??((callback,ms)=>setTimeout(callback,ms)),cancel=options.clearTimer??clearTimeout;
 let context,master,music,noise,unlocked=false,visible=true,quiet=false,musicArmed=false,scene='off',timer=null,nextBeat=0,beat=0,sequence=0,typedLength=0,available=true;
 const voices=new Set(),listeners=new Set(),last=new Map();
 const state=()=>({enabled,available,context:context?.state??'idle',scene,ambience:timer!==null});
 const notify=()=>listeners.forEach(listener=>listener(state()));
 const canPlay=()=>enabled&&available&&unlocked&&visible&&context?.state!=='closed';
 function track(source,nodes,tag){
  const voice={source,nodes,tag};voices.add(voice);
  source.onended=()=>{for(const node of nodes)node.disconnect();voices.delete(voice);};
 }
 function stopVoices(tag){for(const voice of [...voices])if(!tag||voice.tag===tag){try{voice.source.stop(context.currentTime+.015);}catch{}voices.delete(voice);}}
 function tone(frequency,time,duration=.08,level=.12,type='sine',target=frequency,tag='effect'){
  const source=context.createOscillator(),gain=context.createGain();source.type=type;
  source.frequency.setValueAtTime(frequency,time);source.frequency.exponentialRampToValueAtTime(target,time+duration);
  gain.gain.setValueAtTime(.0001,time);gain.gain.linearRampToValueAtTime(level,time+.004);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  source.connect(gain);gain.connect(tag==='ambience'?music:master);track(source,[source,gain],tag);source.start(time);source.stop(time+duration+.015);
 }
 function key(time,level=1,tag='effect'){
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=noise;source.playbackRate.value=.94+(sequence++%7)*.02;filter.type='bandpass';filter.frequency.value=1800+(sequence%5)*170;filter.Q.value=.65;
  gain.gain.setValueAtTime(.0001,time);gain.gain.linearRampToValueAtTime(.14*level,time+.0015);gain.gain.exponentialRampToValueAtTime(.0001,time+.032);
  source.connect(filter);filter.connect(gain);gain.connect(master);track(source,[source,filter,gain],tag);source.start(time);source.stop(time+.04);
  tone(420+(sequence%4)*28,time,.028,.035*level,'triangle',290,tag);
 }
 function musicNote(note,time,duration,level,type='triangle',pan=0,cutoff=1600,attack=.008){
  const source=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.type=type;source.frequency.value=440*2**((note-69)/12);filter.type='lowpass';filter.frequency.value=cutoff;filter.Q.value=.45;
  gain.gain.setValueAtTime(.0001,time);gain.gain.linearRampToValueAtTime(level,time+attack);gain.gain.linearRampToValueAtTime(level*.55,time+duration*.45);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  source.connect(filter);filter.connect(gain);const nodes=[source,filter,gain];
  if(context.createStereoPanner){const panner=context.createStereoPanner();panner.pan.value=pan;gain.connect(panner);panner.connect(music);nodes.push(panner);}else gain.connect(music);
  track(source,nodes,'ambience');source.start(time);source.stop(time+duration+.02);
 }
 function percussion(time,snare){
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),duration=snare ? .075 : .022;
  source.buffer=noise;source.playbackRate.value=snare ? .55 : 1.8;filter.type=snare?'bandpass':'highpass';filter.frequency.value=snare?1700:6500;filter.Q.value=.55;
  gain.gain.setValueAtTime(.0001,time);gain.gain.linearRampToValueAtTime(snare ? .085 : .028,time+.001);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  source.connect(filter);filter.connect(gain);gain.connect(music);track(source,[source,filter,gain],'ambience');source.start(time);source.stop(time+duration+.005);
 }
 function scoreStep(time,index){
  // Eight original bars: D minor, B-flat, G minor, C. Eighth notes at 100 BPM.
  const progressions=[
   {root:38,chord:[50,53,57],lead:[74,null,77,81,null,77,76,null,74,null,72,69,72,76,77,null]},
   {root:34,chord:[46,50,53],lead:[74,null,77,81,82,null,81,77,74,null,72,69,72,74,77,null]},
   {root:43,chord:[55,58,62],lead:[79,null,77,74,null,77,79,82,81,null,79,77,74,null,77,79]},
   {root:36,chord:[48,52,55],lead:[76,null,79,84,null,79,76,74,72,null,74,76,77,76,72,null]}
  ];
  const step=index%16,bar=progressions[Math.floor(index/16)%4],note=bar.lead[step];
  if(note!==null)musicNote(note,time,bar.lead[(step+1)%16]===null ? .48 : .24,.075,'square',Math.sin(index*.4)*.12,1900);
  const bass=[0,null,12,null,7,null,12,7,0,null,12,null,7,12,null,7][step];
  if(bass!==null)musicNote(bar.root+bass,time,.27,.105,'triangle',-.1,650);
  if(step%8===0)bar.chord.forEach((pitch,i)=>musicNote(pitch,time,2.2,.029,'triangle',(i-1)*.48,1050,.12));
  if([0,4,8,11].includes(step))tone(145,time,.16,.12,'sine',48,'ambience');
  if(step%4===2)percussion(time,true);
  percussion(time+.012,false);
 }
 function stopAmbience(){if(timer!==null)cancel(timer);timer=null;if(context)stopVoices('ambience');}
 function scheduleAmbience(){
  if(!canPlay()||!musicArmed||!['menu','carousel','reading'].includes(scene)){stopAmbience();return;}
  if(nextBeat<context.currentTime-.18){nextBeat=context.currentTime+.08;beat=0;}
  while(nextBeat<context.currentTime+.18){
   scoreStep(nextBeat,beat++);nextBeat+=.30;
  }
  timer=later(scheduleAmbience,120);
 }
 function syncAmbience(){
  const wanted=canPlay()&&musicArmed&&['menu','carousel','reading'].includes(scene);
  if(music)music.gain.setTargetAtTime(quiet ? .18 : scene==='reading' ? .4 : .9,context.currentTime,.16);
  if(!wanted)stopAmbience();
  else if(timer===null){nextBeat=context.currentTime+.12;beat=0;scheduleAmbience();}
 }
 function updateGain(){if(master){const t=context.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(enabled&&visible ? .42 : 0,t,.012);}}
 function unlock(){
  if(!enabled||!visible)return false;
  try{
   if(!context){
    context=makeContext();if(!context){available=false;notify();return false;}
    master=context.createGain();master.gain.value=.42;
    music=context.createGain();music.gain.value=.9;music.connect(master);
    const limiter=context.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=16;limiter.ratio.value=4;limiter.attack.value=.004;limiter.release.value=.12;
    master.connect(limiter);limiter.connect(context.destination);
    noise=context.createBuffer(1,Math.ceil(context.sampleRate*.045),context.sampleRate);const samples=noise.getChannelData(0);let seed=7919;
    for(let i=0;i<samples.length;i++){seed=(seed*1664525+1013904223)>>>0;samples[i]=seed/2147483648-1;}
   }
   unlocked=true;updateGain();
   const resumed=context.state==='running'?Promise.resolve():context.resume();
   Promise.resolve(resumed).then(()=>{syncAmbience();notify();}).catch(()=>{unlocked=false;stopAmbience();notify();});
   notify();return true;
  }catch{available=false;unlocked=false;notify();return false;}
 }
 function play(kind){
  if(!canPlay())return false;
  const t=context.currentTime;if(t-(last.get(kind)??-1)<.025)return false;last.set(kind,t);
  if(kind==='key')key(t);
  else if(kind==='navigate')tone(650,t,.055,.11,'triangle',570);
  else if(kind==='select'){tone(523.25,t,.09,.13,'sine');tone(783.99,t+.035,.12,.1,'triangle');}
  else if(kind==='back')tone(440,t,.1,.12,'triangle',293.665);
  else if(kind==='ready'){tone(659.255,t,.13,.11);tone(987.767,t+.07,.18,.09);}
  else if(kind==='powerOn'){key(t,.85);tone(130.813,t+.025,.2,.13,'triangle',261.626);tone(391.995,t+.13,.24,.12);tone(523.251,t+.24,.3,.1);}
  else if(kind==='powerOff'){tone(261.626,t,.22,.13,'triangle',65.406);key(t+.14,.6);}
  return true;
 }
 return {
  state,unlock,play,
  subscribe(listener){listeners.add(listener);listener(state());return()=>listeners.delete(listener);},
  setEnabled(value){enabled=!!value;try{storage?.setItem(preferenceKey,enabled?'on':'off');}catch{}if(!enabled){stopAmbience();if(context)stopVoices();}else unlock();updateGain();notify();},
  setScene(value){if(scene===value)return;scene=value;if(['menu','carousel'].includes(value))musicArmed=true;else if(value==='off')musicArmed=false;syncAmbience();notify();},
  setQuiet(value){quiet=!!value;syncAmbience();},
  setVisible(value){visible=!!value;if(!visible){stopAmbience();if(context){stopVoices();context.suspend()?.catch(()=>{});}}else if(unlocked&&enabled)unlock();updateGain();notify();},
  beginTyping(){typedLength=0;if(context)stopVoices('typing');},
  typeText(text){const fresh=text.slice(typedLength);typedLength=text.length;if(!canPlay()||fresh.length>4)return;let i=0;for(const char of fresh){if(!char.trim())continue;if(i===2)break;key(context.currentTime+i++*.018,.55,'typing');}},
  endTyping(){if(context)stopVoices('typing');typedLength=0;}
 };
}

export const portfolioSound=createPortfolioSound();
export function installSoundControls(){
 const controls=[...document.querySelectorAll('[data-sound-toggle]')],status=document.querySelector('#sound-feedback');
 portfolioSound.subscribe(state=>{
  for(const button of controls){
   button.setAttribute('aria-pressed',String(state.enabled));button.setAttribute('aria-label',state.enabled?'Mute sound':'Enable sound');button.title=state.enabled?'Mute sound':'Enable sound';
   button.dataset.audioState=state.context;button.dataset.musicState=state.ambience?'playing':'paused';button.classList.toggle('sound-on',state.enabled);
   button.querySelector('span').textContent=state.enabled?'Sound on':'Sound off';
   button.querySelector('svg path:last-child').setAttribute('d',state.enabled?'M13 6c2 2 2 6 0 8m3-10c3 3 3 9 0 12':'m14 7 4 6m0-6-4 6');
   if(!state.available){button.disabled=true;button.title='Audio unavailable in this browser';}
  }
 });
 for(const button of controls)button.addEventListener('click',()=>{portfolioSound.setEnabled(!portfolioSound.state().enabled);if(portfolioSound.state().enabled)portfolioSound.play('select');if(status)status.textContent=portfolioSound.state().enabled?'Sound on.':'Sound off.';});
 document.addEventListener('pointerdown',()=>portfolioSound.unlock(),{capture:true,passive:true});
 document.addEventListener('keydown',event=>{if(!event.ctrlKey&&!event.altKey&&!event.metaKey)portfolioSound.unlock();},{capture:true});
 document.addEventListener('visibilitychange',()=>portfolioSound.setVisible(!document.hidden));
 const dialogs=[...document.querySelectorAll('dialog')];const observer=new MutationObserver(()=>portfolioSound.setQuiet(!!document.querySelector('dialog[open]')));
 dialogs.forEach(dialog=>observer.observe(dialog,{attributes:true,attributeFilter:['open']}));
 document.addEventListener('click',event=>{
  const target=event.target.closest('button,a,summary');
  if(!target||target.disabled||target.closest('[data-sound-toggle],#stage')||target.matches('#start,#device-power-target,#skip-intro,[data-command]'))return;
  const kind=target.matches('.dialog-close,#close-project,#directory-back')?'back':target.closest('.figure-switch,.study-navigation')||target.matches('#case-previous,#case-next')?'navigate':'select';
  portfolioSound.play(kind);
 });
}
