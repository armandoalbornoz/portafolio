import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {drawMainMenu,menuEntranceDuration} from './home-screen.js?v=20261119-03';
import {createWorld} from './world.js?v=20261119-03';
import {refineKeyboard} from './keyboard.js?v=20261119-03';
import {createPowerButton} from './power-button.js?v=20261119-03';
import {startupDuration,drawStartup,introduction} from './boot-sequence.js?v=20261119-03';
import {actionForCode,actionKeyCodes,navigationIndex} from './input-controls.js?v=20261119-03';
import {createLoadingScreen} from './loading-screen.js?v=20261119-03';
import {projects} from './project-data.js?v=20261119-03';
import {renderProjectPage} from './project-pages.js?v=20261119-03';
import {drawProjectPreview,previewCaptions} from './project-motion.js?v=20261119-03';
import {hasSeenIntro,rememberIntro} from './visit-state.js?v=20261119-03';
import {portfolioSound} from './sound.js?v=20261119-03';
const projectDetails=projects;
let transition=null;
let previewSeconds=0,homeEnteredAt=0,menuSeconds=0;
const previewTime=()=>reduced?[2.5,3.8,4.5,6.5,6.8][state.selected]:previewSeconds;
const projectBrowserZoom=1.85;
const cameraHome=new THREE.Vector3(),zoomTarget=new THREE.Vector3();
let devicePower;
let keyboardDetail;
const $=s=>document.querySelector(s);
const loadUI=createLoadingScreen($('#loading'));
const state={on:false,selected:0,homeSelected:0,page:'home',model:null,screen:null,ready:false};
let screenCenter,bootUntil=0,lastScreenFrame=0;
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionPreference.matches;
const mobileGPU=matchMedia('(pointer:coarse)').matches||innerWidth<760;
let heroVisible=true,welcomeRect,lastRender=0;
const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;},{root:$('#project')});heroObserver.observe($('#project-hero'));
const motion={x:0,y:0};
const bootDuration=reduced?2500:startupDuration;

const scene=new THREE.Scene();scene.background=new THREE.Color('#0c1010');scene.fog=new THREE.FogExp2('#0c1010',.033);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobileGPU?1.5:2));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.domElement.setAttribute('aria-hidden','true');$('#stage').append(renderer.domElement);
// A fixed orthographic camera: wheel and pointer input never change its framing.
const camera=new THREE.OrthographicCamera(-4,4,2.5,-2.5,.05,100);
function fitView(){const height=innerWidth>1100?Math.max(4.4,5.2/(innerWidth/innerHeight)):Math.max(state.on?5.4:6.8,4.8/(innerWidth/innerHeight));camera.left=-height*camera.aspect/2;camera.right=height*camera.aspect/2;camera.top=height/2;camera.bottom=-height/2;camera.position.set(0,2.9,10);camera.lookAt(0,1.3,0);cameraHome.copy(camera.position);camera.updateProjectionMatrix();}
camera.aspect=innerWidth/innerHeight;fitView();
const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromScene(new RoomEnvironment(),.04);scene.environment=environment.texture;scene.environmentIntensity=.28;
if(!mobileGPU)new RGBELoader().load('./assets/studio_small_09_1k.hdr?v=e7cfda5f4e98',hdr=>{hdr.mapping=THREE.EquirectangularReflectionMapping;const studio=pmrem.fromEquirectangular(hdr);scene.environment=studio.texture;scene.environmentIntensity=.28;scene.environmentRotation.y=.65;hdr.dispose();environment.dispose();},undefined,()=>console.info('Using fallback studio lighting'));
scene.add(new THREE.HemisphereLight('#e1e7e4','#171b1c',.14));
const key=new THREE.SpotLight('#fff0dd',50,30,.65,.8,1.2);key.position.set(-4,2.4,5);key.target.position.set(0,1,0);key.castShadow=true;key.shadow.mapSize.set(mobileGPU?1024:2048,mobileGPU?1024:2048);key.shadow.radius=4;key.shadow.bias=-.00008;key.shadow.normalBias=.006;key.shadow.camera.near=.2;key.shadow.camera.far=20;scene.add(key,key.target);
const fill=new THREE.DirectionalLight('#b8d2cd',.12);fill.position.set(4,3,-4);scene.add(fill);
const glow=new THREE.PointLight('#a3ff76',0,3,2);glow.position.set(0,1.4,1.4);scene.add(glow);
const group=new THREE.Group();scene.add(group);group.rotation.y=innerWidth>1100?-.36:-.22;group.position.set(innerWidth>1100?-1.1:0,innerWidth>1100?0:.70,0);
let lastFrameTime=performance.now();
const world=createWorld(scene,renderer,camera);
// An illuminated receiving surface makes the cast shadow visible outside the case.
const studioFloor=new THREE.Mesh(new THREE.PlaneGeometry(34,34),new THREE.MeshStandardMaterial({color:'#3d4140',roughness:.96,metalness:0}));studioFloor.rotation.x=-Math.PI/2;studioFloor.position.y=-.035;studioFloor.receiveShadow=true;scene.add(studioFloor);
const studioBackdrop=new THREE.Mesh(new THREE.PlaneGeometry(34,16),new THREE.MeshStandardMaterial({color:'#323735',roughness:1,metalness:0}));studioBackdrop.position.set(0,7.96,-3.7);studioBackdrop.receiveShadow=true;scene.add(studioBackdrop);
const screenCanvas=document.createElement('canvas');screenCanvas.width=1024;screenCanvas.height=768;
const ctx=screenCanvas.getContext('2d');const display=new THREE.CanvasTexture(screenCanvas);display.colorSpace=THREE.SRGBColorSpace;
const home=['PROJECTS','ABOUT','CONTACT'];
function screenBase(){ctx.fillStyle='#071a16';ctx.fillRect(0,0,1024,768);}
function scanlines(){ctx.fillStyle='#00000020';for(let y=0;y<768;y+=4)ctx.fillRect(0,y,1024,1);display.needsUpdate=true;}
function drawHome(time=performance.now()/1000,backgroundTime=menuSeconds){
 portfolioSound.setScene('menu');
 const status='Main menu. '+home[state.homeSelected]+' selected.';if($('#device-status').textContent!==status)$('#device-status').textContent=status;
 const elapsed=reduced?menuEntranceDuration:Math.max(0,time-homeEnteredAt/1000);
 const phase=elapsed<menuEntranceDuration?'entering':'idle';if($('#stage').dataset.menuPhase!==phase)$('#stage').dataset.menuPhase=phase;
 drawMainMenu(ctx,{elapsed,backgroundTime,selected:state.homeSelected,reduced});scanlines();
}

function drawProjects(){
 portfolioSound.setScene('carousel');
 screenBase();const p=projects[state.selected],detail=projectDetails[state.selected];const status=p.title+'. '+detail.short+' Use left and right to browse. Enter to open. Esc for main menu.';if($('#device-status').textContent!==status)$('#device-status').textContent=status;
 drawProjectPreview(ctx,state.selected,1024,480,previewTime());
 ctx.fillStyle='#e6e2cd';ctx.fillRect(30,480,964,246);ctx.fillStyle='#14241d';ctx.font='bold 43px monospace';ctx.fillText(p.title.toUpperCase(),56,540,910);
 ctx.font='30px monospace';const words=detail.short.split(' ');let line='',y=590;for(const word of words){if(ctx.measureText(line+word).width>885){ctx.fillText(line,56,y);line='';y+=36;}line+=word+' ';}ctx.fillText(line,56,y);
 ctx.font='bold 24px monospace';ctx.fillStyle='#36563b';ctx.fillText('ENTER OPEN',552,699);ctx.fillStyle='#7b4636';ctx.fillText('ESC BACK',808,699);
 if(p.status){ctx.fillStyle='#102832';ctx.fillRect(730,20,270,40);ctx.fillStyle='#e1c18c';ctx.font='bold 21px monospace';ctx.fillText(p.status.toUpperCase(),746,47);}
 ctx.fillStyle='#f1e9d5';for(const [x,d]of [[48,-1],[976,1]]){ctx.beginPath();ctx.moveTo(x+d*13,224);ctx.lineTo(x-d*13,204);ctx.lineTo(x-d*13,244);ctx.closePath();ctx.fill();}
 ctx.font='23px monospace';ctx.fillStyle='#a2b6a4';ctx.fillText((state.selected+1)+' / '+projects.length,460,765);scanlines();
}
function drawScreen(time=performance.now()/1000){document.body.classList.toggle('projects-view',state.on&&state.page==='projects');if(!state.on){portfolioSound.setScene('off');$('#device-status').textContent='Terminal off. Press the power button or any key to start.';screenBase();scanlines();return;}if(state.page==='home')drawHome(time);else drawProjects();}
function drawBoot(t){portfolioSound.setScene('boot');const frame=drawStartup(ctx,t*bootDuration,reduced);portfolioSound.typeText(frame.lines.map(line=>line.visible).join(''));$('#stage').dataset.startup=frame.phase==='intro'?(frame.complete?'reading':'typing'):frame.phase;const status=frame.phase==='intro'?introduction:'Starting the personal computer.';if($('#device-status').textContent!==status)$('#device-status').textContent=status;scanlines();}

drawScreen();
async function loadModel(url){state.ready=false;document.body.classList.remove('ready');$('#start').disabled=true;$('#device-power-target').disabled=true;loadUI.start();try{const gltf=await new GLTFLoader().loadAsync(url,event=>loadUI.progress(event));loadUI.stage('keyboard');if(state.model)group.remove(state.model);const model=gltf.scene;const remove=[];model.traverse(n=>{if(n.isMesh&&/BackgroundMaterial|ShadowMaterial/.test(n.name))remove.push(n);});remove.forEach(n=>n.removeFromParent());const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const scale=3.7/Math.max(size.x,size.y,size.z);model.scale.multiplyScalar(scale);model.updateMatrixWorld(true);const normalized=new THREE.Box3().setFromObject(model);const center=normalized.getCenter(new THREE.Vector3());model.position.sub(new THREE.Vector3(center.x,normalized.min.y,center.z));model.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;for(const material of Array.isArray(n.material)?n.material:[n.material]){for(const value of Object.values(material)){if(value?.isTexture){value.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());value.needsUpdate=true;}}material.envMapIntensity=1.0;}}});group.add(model);state.model=model;$('#model-needed').hidden=true;
 keyboardDetail=await refineKeyboard(model,renderer);loadUI.stage('display');

 const casing=model.getObjectByName('Comp_Screen002_TerminalMaterial_0')||model.getObjectByName('Comp_Screen.002_TerminalMaterial_0');
 if(casing){devicePower=createPowerButton(casing);const source=casing.geometry;const pos=source.attributes.position,norm=source.attributes.normal,ix=source.index;const positions=[],uvs=[];for(let i=0;i<ix.count;i+=3){const tri=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];if(tri.every(k=>k>=47&&k<=81)){for(const k of tri){positions.push(pos.getX(k)+norm.getX(k)*.0005,pos.getY(k)+norm.getY(k)*.0005,pos.getZ(k)+norm.getZ(k)*.0005);uvs.push((pos.getX(k)+.69957)/.88905,(pos.getZ(k)-.51511)/.59044);}}}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeVertexNormals();const screen=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:display,toneMapped:false,transparent:true,opacity:.95,side:THREE.DoubleSide}));screen.name='Interactive portfolio screen';screen.visible=false;casing.add(screen);state.screen=screen;model.updateMatrixWorld(true);screenCenter=new THREE.Box3().setFromObject(screen).getCenter(new THREE.Vector3());}
 await loadUI.finish(()=>{state.ready=true;$('#start').disabled=false;$('#device-power-target').disabled=false;document.body.classList.add('ready');welcomeRect=$('#start').getBoundingClientRect();world.render(performance.now()/1000,reduced);});
 window.dispatchEvent(new CustomEvent('terminal-loaded'));
 }catch(error){loadUI.fail();$('#model-needed').hidden=false;console.info('Model file unavailable:',error.message);window.dispatchEvent(new CustomEvent('terminal-failed')); }}

function power(){
 if(!state.ready)return;portfolioSound.unlock();state.on=!state.on;if(state.on)portfolioSound.beginTyping();else portfolioSound.endTyping();state.page='home';state.homeSelected=0;bootUntil=state.on&&(!hasSeenIntro()&&!reduced)?performance.now()+bootDuration:0;homeEnteredAt=performance.now();fitView();$('#skip-intro').hidden=!bootUntil;
 if(state.screen)state.screen.visible=state.on;
 glow.intensity=state.on?1.3:0;document.body.classList.toggle('powered',state.on);document.body.classList.toggle('booting',!!bootUntil);
 $('#welcome').inert=state.on;$('#welcome').setAttribute('aria-hidden',String(state.on));
 document.querySelectorAll('.device-help').forEach(n=>n.hidden=!state.on);
 $('#project').hidden=true;
 if(bootUntil)drawBoot(0);else drawScreen();portfolioSound.play(state.on?'powerOn':'powerOff');
}
function finishIntro(){portfolioSound.endTyping();portfolioSound.play('ready');bootUntil=0;rememberIntro();homeEnteredAt=performance.now();document.body.classList.remove('booting');$('#skip-intro').hidden=true;delete $('#stage').dataset.startup;delete renderer.domElement.dataset.cursor;drawScreen();$('#stage').focus({preventScroll:true});}
$('#skip-intro').onclick=finishIntro;
motionPreference.addEventListener('change',event=>{reduced=event.matches;if(reduced&&bootUntil)finishIntro();else if($('#project').hidden)drawScreen();else drawProjectHero();});
function drawProjectHero(){
 const hero=$('#project-hero');drawProjectPreview(hero.getContext('2d'),state.selected,hero.width,hero.height,previewTime());
}
function showProject(){
 portfolioSound.setScene('reading');state.on=true;state.page='projects';if(state.screen)state.screen.visible=true;const p=projects[state.selected];renderProjectPage(p,state.selected,projects);$('#device-status').textContent=p.title+' project.';
 $('#project-hero').setAttribute('aria-label',previewCaptions[state.selected]);drawProjectHero();
 $('#project').hidden=false;$('#project').scrollTop=0;document.body.classList.add('project-open');document.body.classList.remove('entering-project');
 $('body>header').inert=true;$('#device-power-target').inert=true;$('#stage').inert=true;document.querySelectorAll('.device-help').forEach(n=>n.inert=true);$('#project').focus({preventScroll:true});
}
function adjacentProject(direction){
 state.selected=(state.selected+direction+projects.length)%projects.length;previewSeconds=0;
 history.pushState({project:state.selected},'', '#projects/'+projects[state.selected].slug);showProject();
}

function focusProjectScreen(){group.updateMatrixWorld(true);new THREE.Box3().setFromObject(state.screen).getCenter(zoomTarget);zoomTarget.sub(new THREE.Vector3(0,1.3,0));}
function projectBrowsePosition(){const horizontal=innerWidth>1100?0:innerWidth>760 ? .55 : 1;return cameraHome.clone().add(new THREE.Vector3(zoomTarget.x*horizontal,zoomTarget.y*(innerWidth>1100 ? .45 : 1),zoomTarget.z));}
function openProject(push=true){if(transition||!$('#project').hidden)return;if(push)history.pushState({project:state.selected},'', '#projects/'+projectDetails[state.selected].slug);focusProjectScreen();if(reduced){showProject();return;}transition={start:performance.now(),opening:true,fromZoom:camera.zoom,fromPosition:camera.position.clone()};document.body.classList.add('entering-project');}
function closeProject(updateURL=true){if($('#project').hidden&&!transition)return;portfolioSound.play('back');$('#project').hidden=true;document.title='Armando Albornoz — Computer Scientist';document.body.classList.remove('project-open','entering-project');$('body>header').inert=false;$('#device-power-target').inert=false;$('#stage').inert=false;document.querySelectorAll('.device-help').forEach(n=>n.inert=false);if(updateURL)history.replaceState(null,'',location.pathname+location.search);if(reduced){camera.zoom=projectBrowserZoom;camera.position.copy(projectBrowsePosition());camera.updateProjectionMatrix();}else transition={start:performance.now(),opening:false,fromZoom:camera.zoom,fromPosition:camera.position.clone()};$('#stage').focus({preventScroll:true});}
addEventListener('popstate',()=>{if(location.hash.startsWith('#projects/')){const i=projectDetails.findIndex(p=>'#projects/'+p.slug===location.hash);if(i>=0){state.selected=i;previewSeconds=0;showProject();}}else closeProject(false);});
function command(action){
 if(!state.ready)return;if(!state.on){power();return;}if(bootUntil||transition)return;
 if(!$('#project').hidden){if(action==='back')closeProject();return;}
 const next=navigationIndex(state.page==='home'?state.homeSelected:state.selected,action,state.page==='home'?home.length:projects.length);
 if(next!==null){previewSeconds=0;if(state.page==='home')state.homeSelected=next;else state.selected=next;portfolioSound.play('navigate');drawScreen();return;}
 if(action==='back'){if(!$('#project').hidden){closeProject();}else if(state.page!=='home'){portfolioSound.play('back');state.page='home';homeEnteredAt=performance.now();drawScreen();}else power();return;}
 if(action==='select'){
  portfolioSound.play('select');if(state.page==='projects'){openProject();return;}
  if(state.homeSelected===0){state.page='projects';state.selected=0;previewSeconds=0;focusProjectScreen();drawScreen();}
  else $(state.homeSelected===1?'#about-dialog':'#contact-dialog').showModal();
 }
}
function start(){if(!state.on)power();$('#stage').focus({preventScroll:true});}
$('#start').onclick=start;$('#device-power-target').onclick=start;
$('#credits').onclick=()=>$('#credits-dialog').showModal();
for(const [button,dialog] of [['.close-dialog','#credits-dialog'],['.close-about','#about-dialog'],['.close-contact','#contact-dialog']])$(button).onclick=()=>{$(dialog).close();$('#stage').focus({preventScroll:true});};
$('#close-project').onclick=()=>closeProject();$('#case-previous').onclick=()=>adjacentProject(-1);$('#case-next').onclick=()=>adjacentProject(1);
document.querySelectorAll('[data-command]').forEach(button=>button.onclick=()=>{pressTerminalKey(actionKeyCodes[button.dataset.command]);command(button.dataset.command);$('#stage').focus({preventScroll:true});});
function pressTerminalKey(code,held=false){const key=keyboardDetail?.press(code,held);if(key){portfolioSound.play('key');$('#stage').dataset.keyCode=key.code;$('#stage').dataset.keyLegend=key.label;}return key;}
addEventListener('keydown',e=>{
 if(document.querySelector('dialog[open]')||!$('#project-directory').hidden)return;
 if(!$('#project').hidden){if(e.key==='Escape'&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();pressTerminalKey(e.code,true);closeProject();}return;}
 if(e.target.closest('input,textarea,select,summary,[contenteditable=true]'))return;
 if(state.on)pressTerminalKey(e.code,true);
 if(e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;
 if(e.target.closest('a,button')&&e.key!=='Escape')return;
 if(!state.on){if(e.key.length===1||['Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();start();pressTerminalKey(e.code,true);}return;}
 const action=actionForCode(e.code);if(action){e.preventDefault();command(action);if($('#project').hidden)$('#stage').focus({preventScroll:true});}
});
addEventListener('keyup',e=>keyboardDetail?.release(e.code));
addEventListener('blur',()=>keyboardDetail?.releaseAll());
$('#model-file').onchange=e=>{const file=e.target.files[0];if(file){const url=URL.createObjectURL(file);loadModel(url).finally(()=>URL.revokeObjectURL(url));}};
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let press;
addEventListener('pointermove',e=>{motion.x=e.clientX/innerWidth*2-1;motion.y=-(e.clientY/innerHeight*2-1);});
addEventListener('pointerout',e=>{if(!e.relatedTarget){motion.x=0;motion.y=0;}});
// Native pixel cursors stay precise; only interactive parts of the model get the hand.
let lastCursorCheck=0;
renderer.domElement.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch')return;
 if(!state.ready||bootUntil||transition){renderer.domElement.dataset.cursor='busy';return;}
 if(e.timeStamp-lastCursorCheck<35)return;lastCursorCheck=e.timeStamp;
 pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObject(group,true);let interactive=!state.on&&hits.length>0;
 if(state.on&&hits.length){
  let hit=hits[0].object;while(hit&&!hit.userData.code&&!hit.userData.powerSwitch)hit=hit.parent;
  interactive=!!hit;
  const screen=hits.find(h=>h.object===state.screen);
  if(screen?.uv){const y=(1-screen.uv.y)*768;interactive ||= state.page==='projects'||y>300&&y<560;}
 }
 renderer.domElement.dataset.cursor=interactive?'interactive':'default';
});
renderer.domElement.addEventListener('pointerleave',()=>{delete renderer.domElement.dataset.cursor;});
renderer.domElement.addEventListener('pointerdown',e=>{press={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener('pointerup',e=>{
 if(!press||Math.hypot(e.clientX-press.x,e.clientY-press.y)>10)return;
 pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObject(group,true);
 if(!hits.length)return;if(!state.on){start();return;}if(bootUntil)return;
 let powerHit=hits[0]?.object;while(powerHit&&!powerHit.userData.powerSwitch)powerHit=powerHit.parent;if(powerHit){power();return;}
 let keyHit=hits[0]?.object;while(keyHit&&!keyHit.userData.key)keyHit=keyHit.parent;
 if(keyHit){const code=keyHit.userData.code;pressTerminalKey(code);const action=actionForCode(code);if(action)command(action);return;}
 const hit=hits.find(h=>h.object===state.screen);if(!hit?.uv)return;
 const y=(1-hit.uv.y)*768;
 if(state.page==='home'){const row=Math.round((y-344)/86);if(row>=0&&row<3&&y>300&&y<560){state.homeSelected=row;command('select');}}
 else {const x=hit.uv.x*1024;if(y<480&&x<135)command('left');else if(y<480&&x>889)command('right');else if(y>660&&x>780)command('back');else openProject();}
});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;renderer.setSize(innerWidth,innerHeight);world.resize(innerWidth,innerHeight);fitView();welcomeRect=$('#start').getBoundingClientRect();world.render(performance.now()/1000,reduced);});
renderer.setAnimationLoop(now=>{
 if(document.hidden||document.querySelector('dialog[open]')||!$('#project-directory').hidden){lastFrameTime=now;return;}
 if(now-lastRender<1000/(mobileGPU?30:60))return;lastRender=now;
 const previewDelta=Math.min(.1,Math.max(0,(now-lastFrameTime)/1000));
 if(!$('#project').hidden){
  if(!reduced&&heroVisible){previewSeconds+=previewDelta;if(now-lastScreenFrame>1000/24){drawProjectHero();lastScreenFrame=now;}}
  lastFrameTime=now;return;
 }
 const blend=1-Math.exp(-Math.min(.15,(now-lastFrameTime)/1000)*9);lastFrameTime=now;
 keyboardDetail?.update(now);
 const desktop=innerWidth>1100;
 const yaw=(state.on?0:(desktop?-.36:-.22))+(reduced?0:motion.x*.045);
 group.rotation.y=THREE.MathUtils.lerp(group.rotation.y,yaw,blend);
 group.rotation.x=THREE.MathUtils.lerp(group.rotation.x,reduced?0:-motion.y*.018,blend);
 group.position.x=THREE.MathUtils.lerp(group.position.x,desktop&&!state.on?-1.1:0,blend);
 group.position.y=THREE.MathUtils.lerp(group.position.y,desktop?0:(state.on ? .34 : .70),blend);
 studioFloor.position.y=group.position.y-.035;studioBackdrop.position.y=studioFloor.position.y+8;
 if(bootUntil){if(now<bootUntil){drawBoot(1-(bootUntil-now)/bootDuration);}else{finishIntro();}}
 else if(state.on&&state.page==='home'&&!reduced){menuSeconds+=previewDelta;if(now-lastScreenFrame>1000/30){drawHome(now/1000,menuSeconds);lastScreenFrame=now;}}
 else if(state.on&&state.page==='projects'&&!reduced){previewSeconds+=previewDelta;if(now-lastScreenFrame>1000/24){drawProjects();lastScreenFrame=now;}}
 if(devicePower){
  devicePower.update(now,state.on,reduced);group.updateMatrixWorld(true);
  const mobile=innerWidth<=1100,point=devicePower.anchor(mobile).project(camera),center=devicePower.assembly.getWorldPosition(new THREE.Vector3()).project(camera);
  const x=(point.x*.5+.5)*innerWidth,y=(-point.y*.5+.5)*innerHeight;
  const target=$('#device-power-target');if(!state.on){target.style.left=((center.x*.5+.5)*innerWidth)+'px';target.style.top=((-center.y*.5+.5)*innerHeight)+'px';}
  if(!state.on){const rect=welcomeRect||$('#start').getBoundingClientRect();const sx=mobile?Math.min(rect.right+14,innerWidth-18):rect.left-16,sy=rect.top+rect.height*.55;
   $('#power-guide-line').setAttribute('d',mobile?`M${sx},${sy} C${sx+25},${sy-55} ${x+36},${y+70} ${x},${y+8}`:`M${sx},${sy} C${sx-55},${sy} ${x+65},${y} ${x+6},${y}`);
  }
 }
 const browsing=state.on&&state.page==='projects',phoneFocus=state.on&&innerWidth<=760;
 if(phoneFocus)focusProjectScreen();
 const browseZoom=phoneFocus?2.15:projectBrowserZoom,homeZoom=phoneFocus?2.05:1;
 const viewPosition=transition?.opening?cameraHome.clone().add(zoomTarget):(browsing||phoneFocus)?projectBrowsePosition():cameraHome;
 if(transition){const t=Math.min(1,(now-transition.start)/620),e=1-Math.pow(1-t,3);camera.zoom=THREE.MathUtils.lerp(transition.fromZoom,transition.opening?4.3:projectBrowserZoom,e);camera.position.lerpVectors(transition.fromPosition,viewPosition,e);camera.updateProjectionMatrix();if(t===1){const opening=transition.opening;transition=null;delete renderer.domElement.dataset.cursor;if(opening)showProject();}}
 else{const targetZoom=browsing?browseZoom:homeZoom;camera.zoom=reduced?targetZoom:THREE.MathUtils.lerp(camera.zoom,targetZoom,blend);if(reduced)camera.position.copy(viewPosition);else camera.position.lerp(viewPosition,blend);camera.updateProjectionMatrix();}
 world.render(now/1000,reduced);
});
await loadModel('./assets/terminal-web.glb?v=6cac86c8aa4a');

if(location.hash.startsWith('#projects/')){const i=projectDetails.findIndex(p=>'#projects/'+p.slug===location.hash);if(i>=0){state.on=true;state.page='projects';state.selected=i;state.screen.visible=true;group.position.x=0;group.rotation.y=0;focusProjectScreen();document.body.classList.add('powered');document.querySelectorAll('.device-help').forEach(n=>n.hidden=false);$('#welcome').inert=true;$('#welcome').setAttribute('aria-hidden','true');drawScreen();showProject();}}

if(document.activeElement===document.body&&state.ready&&!document.body.classList.contains('project-open')&&$('#project-directory').hidden){$(state.on?'#stage':'#start').focus({preventScroll:true});}
