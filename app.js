// Project content loads independently of the terminal's model, textures, and shaders.
import {projects} from './project-data.js?v=20261113-47';
import {renderProjectPage} from './project-pages.js?v=20261113-47';
import {portfolioSound,installSoundControls} from './sound.js?v=20261113-47';
installSoundControls();
const $=s=>document.querySelector(s);
let terminalPromise,terminalRequested=false,terminalUnavailable=false,stopHero=()=>{},heroGeneration=0;
const projectIndex=()=>projects.findIndex(p=>location.hash==='#projects/'+p.slug);
function backgroundInert(value){for(const s of ['body>header','#stage','#welcome','#device-power-target','#terminal-controls'])$(s).inert=value;}
function closeDirectory(){
 $('#project-directory').hidden=true;document.body.classList.remove('directory-open');backgroundInert(!$('#project').hidden);
}
function showDirectory(){
 portfolioSound.setScene('reading'); document.title='Projects — Armando Albornoz';$('#device-status').textContent='Project list. Choose a project to open.';stopHero();$('#loading').hidden=true;$('#project').hidden=true;document.body.classList.remove('project-open');document.body.classList.add('directory-open');$('#project-directory').hidden=false;backgroundInert(true);$('#directory-title').focus();
}
async function prepareHero(index){
 stopHero();const generation=++heroGeneration,canvas=$('#project-hero');let frame=0,visible=true,last=0,seconds=0,observer;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 stopHero=()=>{heroGeneration++;cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);};
 function resume(){last=0;if(!document.hidden&&visible&&!reduced.matches&&!frame)frame=requestAnimationFrame(tick);}
 let motion;
 function tick(now){frame=0;if(generation!==heroGeneration||document.hidden||!visible||reduced.matches)return;if(!last)last=now;if(now-last>=1000/24){seconds+=Math.min(.1,(now-last)/1000);last=now;motion.drawProjectPreview(canvas.getContext('2d'),index,canvas.width,canvas.height,seconds);}frame=requestAnimationFrame(tick);}
 try{
  motion=await import('./project-motion.js?v=20261113-47');
  await motion.prepareProjectPreviews(index);
  if(generation!==heroGeneration)return;
  canvas.setAttribute('aria-label',motion.previewCaptions[index]);motion.drawProjectPreview(canvas.getContext('2d'),index,canvas.width,canvas.height,4.5);
  observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{root:$('#project')});observer.observe(canvas);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
 }catch(error){if(generation===heroGeneration){canvas.hidden=true;console.info('Project animation unavailable; text, reports and interactive diagrams remain available.');}}
}
function showProject(index){
 portfolioSound.setScene('reading'); closeDirectory();$('#loading').hidden=true;$('#welcome').inert=true;document.body.classList.add('project-open');renderProjectPage(projects[index],index,projects);$('#project-hero').hidden=false;$('#project-hero').setAttribute('aria-label',projects[index].title+' illustration');$('#project').hidden=false;$('#project').scrollTop=0;backgroundInert(true);$('#device-status').textContent=projects[index].title+' project.';$('#project').focus();prepareHero(index);
 $('#close-project').onclick=()=>{location.hash='';startTerminal();};
 for(const [id,delta] of [['#case-previous',-1],['#case-next',1]])$(id).onclick=()=>{location.hash='#projects/'+projects[(index+delta+projects.length)%projects.length].slug;};
}
async function startTerminal(){
 portfolioSound.setScene('off'); if(terminalUnavailable){showDirectory();return;}
 document.title='Armando Albornoz — Computer Scientist';stopHero();closeDirectory();$('#project').hidden=true;document.body.classList.remove('project-open');backgroundInert(false);
 if(!terminalPromise){terminalRequested=true;terminalPromise=import('./main.js?v=20261113-47').catch(error=>{terminalUnavailable=true;terminalRequested=false;console.error('Terminal unavailable:',error.message);$('#loading').hidden=true;$('#model-needed').hidden=false;$('#directory-status').hidden=false;$('#directory-back').disabled=true;$('#directory-back').textContent='Terminal unavailable';$('#directory-back').setAttribute('aria-label','Terminal unavailable');showDirectory();});}
 return terminalPromise;
}
function route(){
 const i=projectIndex();
 if(location.hash==='#project-list'){showDirectory();return;}
 closeDirectory();
 if(terminalRequested)return;
 if(i>=0)showProject(i);else startTerminal();
}
const list=$('#project-links');for(const p of projects){const a=document.createElement('a'),title=document.createElement('strong'),copy=document.createElement('span');a.href='#projects/'+p.slug;title.textContent=p.title;copy.textContent=p.short;a.append(title,copy);list.append(a);}
$('#skip-to-projects').onclick=e=>{e.preventDefault();location.hash='project-list';showDirectory();};
$('#directory-back').onclick=()=>{location.hash='';startTerminal();};
$('#directory-about').onclick=()=>$('#about-dialog').showModal();$('#directory-contact').onclick=()=>$('#contact-dialog').showModal();
for(const dialog of document.querySelectorAll('dialog')){
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
}
for(const [button,dialog] of [['.close-dialog','#credits-dialog'],['.close-about','#about-dialog'],['.close-contact','#contact-dialog']])$(button).onclick=()=>$(dialog).close();
$('#credits').onclick=()=>$('#credits-dialog').showModal();
addEventListener('terminal-failed',()=>{terminalUnavailable=true;$('#directory-status').hidden=false;$('#directory-back').disabled=true;$('#directory-back').textContent='Terminal unavailable';$('#directory-back').setAttribute('aria-label','Terminal unavailable');showDirectory();});
addEventListener('hashchange',route);
addEventListener('keydown',e=>{if(terminalRequested||document.querySelector('dialog[open]')||e.ctrlKey||e.altKey||e.metaKey)return;if(e.key==='Escape'&&!$('#project').hidden){e.preventDefault();location.hash='project-list';showDirectory();}});
route();
