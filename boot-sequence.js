const font={
 A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],"'":['00100','00100','01000','00000','00000','00000','00000'],'.':['00000','00000','00000','00000','00000','00110','00110']
};
const intro=[
 {text:'ARMANDO IS A',y:135},
 {text:'COMPUTER SCIENTIST',y:198},
 {text:'WITH A BACKGROUND IN',y:261},
 {text:'MACHINE LEARNING AND',y:324},
 {text:'ARTIFICIAL INTELLIGENCE.',y:387}
];
const logoDuration=1800,charDuration=42,readingHold=1000;
let next=logoDuration;
const lines=intro.map((line,i)=>{const start=next,end=start+line.text.length*charDuration;next=end+(i===intro.length-1?0:line.pause??240);return {...line,start,end};});
export const typingEnd=lines.at(-1).end;
export const startupDuration=typingEnd+readingHold;
export const introduction=intro.map(line=>line.text).join(' ');
export function bootFrame(ms,reduced=false){
 return {phase:reduced||ms>=logoDuration?'intro':ms<350?'wake':'logo',lines:lines.map(line=>({...line,visible:reduced?line.text:line.text.slice(0,Math.max(0,Math.floor((ms-line.start)/charDuration)))})),complete:reduced||ms>=typingEnd};
}
function text(ctx,label,x,y,size,color){ctx.fillStyle=color;[...label].forEach((letter,i)=>(font[letter]||[]).forEach((row,r)=>[...row].forEach((v,c)=>{if(v==='1')ctx.fillRect(x+(i*6+c)*size,y+r*size,size,size);})));}
function centered(ctx,label,y,size,color){text(ctx,label,(1024-(label.length*6-1)*size)/2,y,size,color);}
export function drawStartup(ctx,ms,reduced=false){
 const frame=bootFrame(ms,reduced);ctx.fillStyle='#071a16';ctx.fillRect(0,0,1024,768);
 if(frame.phase==='wake'){ctx.fillStyle='#c2e5b1';ctx.fillRect(80,382,864,3);}
 else if(frame.phase==='logo'){
  centered(ctx,'ARMANDO',258,16,'#e7cb87');centered(ctx,'ALBORNOZ',410,5,'#b7dcaa');
 }else{
  for(const line of frame.lines)text(ctx,line.visible,64,line.y,6,'#b9e4d1');
  const current=frame.lines.find(line=>ms>=line.start&&ms<line.end)||frame.lines.filter(line=>ms>=line.start).at(-1);
  if(!reduced&&current&&Math.floor(ms/420)%2===0){ctx.fillStyle='#b9e4d1';ctx.fillRect(64+current.visible.length*36,current.y+39,28,4);}
 }
 return frame;
}
