// Project entrances: cinematic subject scenes, plus the original ML design.
import {drawCinematicPreview,prepareCinematicPreviews} from './project-scenes.js?v=20261119-02';
export const prepareProjectPreviews=prepareCinematicPreviews;
const TAU=Math.PI*2;
const mix=(a,b,t)=>a+(b-a)*t;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function dot(ctx,x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}

// A learning decision field, with no invented accuracy/loss measurements.
function boundary(x,phase){return mix(125,128+Math.sin(x/54)*37+Math.cos(x/103)*20,smooth(phase));}
const samples=Array.from({length:100},(_,i)=>{const x=52+(i*83.137)%408,y=48+(i*47.873)%164;return{x,y,group:y>boundary(x,1)?1:0};});
function classifier(ctx,time){
 const progress=(1-Math.cos(time*TAU/9))/2;
 ctx.fillStyle='#142b35';ctx.fillRect(0,0,512,260);
 for(let y=38;y<229;y+=6)for(let x=28;x<488;x+=6){
  const distance=(y-boundary(x,progress))/35;
  ctx.fillStyle=distance>0?(distance<1?'#87564a':'#654a43'):(distance> -1?'#396e78':'#2a535f');ctx.fillRect(x,y,5,5);
 }
 // Moving scan light and data points tie the two regions together.
 const sweep=28+(time*.14%1)*460;ctx.fillStyle='#d8e3c615';ctx.fillRect(sweep-14,38,28,190);
 for(const p of samples){const predicted=p.y>boundary(p.x,progress)?1:0,color=p.group?'#f2ad79':'#8edcd9';dot(ctx,p.x,p.y,2.8,'#122d36');dot(ctx,p.x,p.y,1.8,color);if(predicted!==p.group){ctx.strokeStyle=color+'90';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(p.x,p.y,4,0,TAU);ctx.stroke();}}
 ctx.beginPath();for(let x=28;x<=488;x+=3){const y=boundary(x,progress);if(x===28)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle='#e2ebc6';ctx.lineWidth=2;ctx.stroke();
}

export const previewCaptions=[
 'Cooperative kitchen · three layouts, three training seeds.',
 'A synthetic voxel volume is sliced to reveal an illustrative region, shown separately on the right. This is not patient data or a recorded model prediction.',
 'Animated classifier decision boundary · illustration, not recorded benchmark results.',
 'A Delaunay mesh and its vertices lift toward a paraboloid, with their planar projections below. Computational geometry illustration.',
 'Quarter-turn symmetry identifies points in the same orbit. This illustration shows the Hausdorff gap staying equal in the setting of Theorem 4.2; the paper also studies how Gromov–Hausdorff distances behave differently.'
];
export function drawProjectPreview(ctx,index,width=1024,height=480,time=0){
 time=Math.max(0,time);
 if(index!==2){drawCinematicPreview(ctx,index,width,height,time);return;}
 ctx.save();ctx.scale(width/512,height/260);ctx.imageSmoothingEnabled=false;classifier(ctx,time);ctx.restore();
}
