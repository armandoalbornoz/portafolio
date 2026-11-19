// Original report figures where available; labelled concept diagrams otherwise.
import {projects} from './project-data.js?v=20261119-02';
export const projectDetails=projects.map(({slug,short,caption})=>({slug,short,caption}));

const reportImages=new Map();
export async function loadProjectVisuals(){
 await Promise.all(projects.filter(p=>p.visual).map(p=>new Promise(resolve=>{
  const image=new Image();image.onload=()=>{reportImages.set(p.visual,image);resolve();};image.onerror=()=>resolve();image.src=p.visual;
 })));
}

export function drawProjectArt(ctx,index,width=1024,height=520){
 ctx.save();ctx.scale(width/1024,height/520);
 const image=reportImages.get(projects[index].visual);
 if(image){
  ctx.fillStyle='#f7f7f2';ctx.fillRect(0,0,1024,520);
  const scale=Math.min(888/image.naturalWidth,480/image.naturalHeight);
  const w=image.naturalWidth*scale,h=image.naturalHeight*scale;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,(1024-w)/2,(520-h)/2,w,h);ctx.restore();return;
 }
 ctx.fillStyle=['#222f2b','#172d39','#262339','#182f2b'][index];ctx.fillRect(0,0,1024,520);
 const ink=['#eab77e','#a7d7d8','#ceb6f0','#b5d29d'][index];ctx.strokeStyle=ink;ctx.fillStyle=ink;ctx.lineWidth=2;
 if(index===0){
  // A grid-world concept, not a captured game layout or a training result.
  const board=['#########','#...#...#','#.......#','#...#...#','#.......#','#########'];
  board.forEach((row,r)=>[...row].forEach((cell,c)=>{ctx.fillStyle=cell==='#'?'#87967b':'#253e31';ctx.fillRect(65+c*47,86+r*47,43,43);}));
  for(const [col,row,label,color]of [[2,2,'A','#e8bc7f'],[6,3,'B','#b3dec4']]){ctx.fillStyle=color;ctx.fillRect(65+col*47+7,86+row*47+7,29,29);ctx.fillStyle='#24372b';ctx.font='bold 24px monospace';ctx.fillText(label,65+col*47+14,86+row*47+30);}
  ctx.strokeStyle=ink;ctx.fillStyle=ink;ctx.font='bold 22px monospace';ctx.fillText('SHARED ACTOR',625,157);ctx.strokeRect(591,118,342,66);ctx.fillText('CENTRALIZED CRITIC',612,305);ctx.strokeRect(591,266,342,66);
  ctx.beginPath();ctx.moveTo(493,222);ctx.lineTo(553,222);ctx.lineTo(553,151);ctx.lineTo(591,151);ctx.moveTo(553,222);ctx.lineTo(553,299);ctx.lineTo(591,299);ctx.stroke();ctx.font='19px monospace';ctx.fillText('PPO / SHARED REWARD',599,411);ctx.fillText('COOPERATIVE KITCHEN',103,429);
 }else if(index===1){
  // Volumes and a U-shaped network communicate the task without inventing scans.
  ctx.font='bold 21px monospace';ctx.fillText('MRI VOLUME',83,105);ctx.fillText('3D U-NET',430,105);ctx.fillText('LESION MASK',777,105);
  for(let i=4;i>=0;i--){ctx.globalAlpha=.25+(4-i)*.12;ctx.strokeRect(91+i*11,196-i*11,150,160);ctx.strokeRect(782+i*11,196-i*11,150,160);}ctx.globalAlpha=1;
  const levels=[[354,173,80,45],[391,243,65,38],[430,306,52,32],[493,306,52,32],[517,243,65,38],[540,173,80,45]];
  levels.forEach(([x,y,w,h],i)=>{ctx.fillStyle=i<3?'#6f9eaa':'#a7d7d8';ctx.fillRect(x,y,w,h);});ctx.fillStyle=ink;ctx.strokeStyle=ink;ctx.beginPath();ctx.moveTo(434,194);ctx.lineTo(540,194);ctx.moveTo(456,262);ctx.lineTo(517,262);ctx.moveTo(482,322);ctx.lineTo(493,322);ctx.moveTo(282,256);ctx.lineTo(354,194);ctx.moveTo(620,194);ctx.lineTo(782,256);ctx.stroke();
  ctx.fillStyle='#e7bd83';ctx.fillRect(822,250,27,20);ctx.fillRect(839,266,20,30);ctx.font='19px monospace';ctx.fillStyle=ink;ctx.fillText('PREPROCESS',102,420);ctx.fillText('ENCODE / DECODE',383,420);ctx.fillText('SEGMENT',800,420);
 }else if(index===2){
  const families=['TREE-BASED','KERNEL-BASED','NEURAL'];
  families.forEach((label,i)=>{ctx.strokeRect(72,104+i*103,237,68);ctx.font='bold 22px monospace';ctx.fillText(label,94,146+i*103);ctx.beginPath();ctx.moveTo(309,138+i*103);ctx.lineTo(392,241);ctx.stroke();});
  ctx.strokeRect(392,180,260,122);ctx.font='bold 22px monospace';ctx.fillText('CROSS-VALIDATION',414,232);ctx.font='18px monospace';ctx.fillText('STRATIFIED SPLITS',415,270);ctx.beginPath();ctx.moveTo(652,241);ctx.lineTo(717,241);ctx.stroke();ctx.strokeRect(717,180,232,122);ctx.font='bold 22px monospace';ctx.fillText('COMPARE + TUNE',739,231);ctx.font='18px monospace';ctx.fillText('7 OPTIMIZERS',765,271);ctx.font='21px monospace';ctx.fillText('48,719 RECORDS / 2 CLASSIFICATION TASKS',253,433);
 }else{
  const rows=[];for(let r=0;r<6;r++){rows[r]=[];for(let c=0;c<10;c++)rows[r].push([82+c*96+Math.sin(r*3+c*7)*22,73+r*75+Math.cos(c*4+r)*24]);}
  ctx.lineWidth=1.5;
  for(let r=0;r<5;r++)for(let c=0;c<9;c++){const a=rows[r][c],b=rows[r][c+1],d=rows[r+1][c],e=rows[r+1][c+1];ctx.globalAlpha=.13+((r+c)%3)*.06;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...d);ctx.closePath();ctx.fill();ctx.globalAlpha=.65;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...e);ctx.lineTo(...d);ctx.closePath();ctx.moveTo(...b);ctx.lineTo(...d);ctx.stroke();}
  ctx.globalAlpha=1;for(const row of rows)for(const [x,y]of row){ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}
 }
 ctx.restore();
}
