// The title assembles once; the background has its own pausable clock.
export const menuEntranceDuration=1.65;
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>1-Math.pow(1-clamp(n),3);
const glyphs={A:['01110','10001','10001','11111','10001','10001','10001'],R:['11110','10001','10001','11110','10100','10010','10001'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],D:['11110','10001','10001','10001','10001','10001','11110'],O:['01110','10001','10001','10001','10001','10001','01110'],L:['10000','10000','10000','10000','10000','10000','11111'],B:['11110','10001','10001','11110','10001','10001','11110'],Z:['11111','00001','00010','00100','01000','10000','11111']};
function name(ctx,word,y,size,elapsed,assemble){
 const left=(1024-(word.length*6-1)*size)/2;
 [...word].forEach((letter,i)=>(glyphs[letter]||[]).forEach((row,r)=>[...row].forEach((value,c)=>{
  if(value!=='1')return;
  const progress=assemble?ease((elapsed-.06-i*.065-c*.013-r*.012)/.52):1;if(!progress)return;
  const drift=1-progress,scatter=((i*19+c*7+r*13)%11-5)*4;
  const x=Math.round(left+(i*6+c)*size+scatter*drift),yy=Math.round(y+r*size+drift*(62+r*3));
  ctx.globalAlpha=progress;ctx.fillStyle='#2c4c35';ctx.fillRect(x,yy+size*.42,size,size);ctx.fillStyle='#e7cb87';ctx.fillRect(x,yy,size,size);
 })));
 ctx.globalAlpha=1;
}
function background(ctx,time){
 const glow=ctx.createRadialGradient(510,390,50,510,390,730);glow.addColorStop(0,'#10392d');glow.addColorStop(1,'#03110f');ctx.fillStyle=glow;ctx.fillRect(0,0,1024,768);
 for(let i=0;i<82;i++){
  const speed=11+(i%5)*2.2,x=(i*137+31+time*speed)%1064-20,y=(i*79+25+time*speed*.28)%790-12;
  const behindText=x>290&&x<790&&y>60&&y<550;
  ctx.globalAlpha=(.42+Math.sin(time*.85+i*2)*.23)*(behindText?.4:1);ctx.fillStyle=i%5?'#8dc3a0':'#deddb1';
  const size=i%9?2:4;ctx.fillRect(x,y,size,size);
  if(i%17===0){ctx.fillRect(x-3,y+1,10,1);ctx.fillRect(x+1,y-3,1,10);}
 }ctx.globalAlpha=1;
 const horizon=575,vanish=512+Math.sin(time*.23)*32,advance=(time*.55)%1;
 ctx.save();ctx.beginPath();ctx.rect(0,horizon-24,1024,768-horizon+24);ctx.clip();ctx.lineWidth=1.7;
 for(let row=0;row<15;row++){
  const depth=(row+advance)/14,y=horizon+depth*depth*211;ctx.strokeStyle='#4b9970';ctx.globalAlpha=.12+depth*.58;ctx.beginPath();
  for(let i=0;i<=28;i++){const x=i*40-48,yy=y+Math.sin(i*.32+time*.75+row*.23)*depth*15;if(!i)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);}ctx.stroke();
 }
 for(let col=-11;col<=11;col++){
  ctx.globalAlpha=.48;ctx.strokeStyle='#397d5d';ctx.beginPath();
  for(let r=0;r<=16;r++){const d=r/16,x=vanish+col*(22+d*d*120),y=horizon+d*d*220+Math.sin(col*.5+time*.75+d*3)*d*12;if(!r)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
 }
 ctx.restore();ctx.globalAlpha=1;
}
export function drawMainMenu(ctx,{elapsed=0,backgroundTime=0,selected=0,reduced=false}={}){
 elapsed=reduced?menuEntranceDuration:Math.max(0,elapsed);backgroundTime=reduced?0:Math.max(0,backgroundTime);
 background(ctx,backgroundTime);
 name(ctx,'ARMANDO',73,18,elapsed,!reduced);
 const subtitle=ease((elapsed-.58)/.52);if(subtitle){
  ctx.save();ctx.globalAlpha=subtitle;ctx.beginPath();ctx.rect(280,220,464*subtitle,86);ctx.clip();
  const word='ALBORNOZ',size=8,left=(1024-(word.length*6-1)*size)/2;ctx.fillStyle='#b2dca0';
  [...word].forEach((letter,i)=>glyphs[letter].forEach((row,r)=>[...row].forEach((v,c)=>{if(v==='1')ctx.fillRect(left+(i*6+c)*size,228+r*size+(1-subtitle)*14,size,size);})));ctx.restore();
 }
 ctx.font='bold 56px monospace';['PROJECTS','ABOUT','CONTACT'].forEach((text,i)=>{
  const reveal=ease((elapsed-1.0-i*.14)/.30);if(!reveal)return;
  const x=386+(1-reveal)*42,y=362+i*86+(1-reveal)*16;ctx.globalAlpha=reveal;ctx.fillStyle=i===selected?'#e4f7c8':'#88b895';ctx.fillText(text,x,y);
  if(i===selected){ctx.beginPath();ctx.moveTo(x-54,y-38);ctx.lineTo(x-32,y-20);ctx.lineTo(x-54,y-2);ctx.closePath();ctx.fill();}
 });ctx.globalAlpha=1;
}
