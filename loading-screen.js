export function createLoadingScreen(root){
  const message=root.querySelector('#load-message'),percent=root.querySelector('#load-percent'),meter=root.querySelector('#load-meter'),fill=root.querySelector('#load-fill');
  const rows=[...root.querySelectorAll('[data-load-step]')];let started=0,lastPercent=-1,frame=0;
  const canvas=root.querySelector('#loading-network'),ctx=canvas?.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=760,height=220;
  function resize(){
    if(!canvas||root.hidden)return;
    const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
    width=rect.width||760;height=rect.height||220;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);
  }
  function paint(now=performance.now()){
    if(!ctx||root.hidden)return;
    ctx.clearRect(0,0,width,height);
    const time=reduced?0:Math.max(0,now-started)/1000,cols=23,points=[],energy=Math.max(0,lastPercent)/100;
    for(let r=0;r<7;r++){
      points[r]=[];
      for(let c=0;c<cols;c++){
        const x=16+c/(cols-1)*(width-32),envelope=Math.sin(c/(cols-1)*Math.PI);
        const y=height*.24+r*height*.079+Math.sin(c*.33+r*.48+time*.7)*height*.08*envelope;
        points[r].push({x,y});
      }
    }
    for(let r=0;r<6;r++)for(let c=0;c<cols-1;c++){
      const a=points[r][c],b=points[r][c+1],d=points[r+1][c],e=points[r+1][c+1];
      const lit=c/(cols-1)<=energy;
      ctx.strokeStyle=lit?'rgba(166,202,156,.32)':'rgba(125,164,135,.15)';ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(e.x,e.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.moveTo(b.x,b.y);ctx.lineTo(d.x,d.y);ctx.stroke();
    }
    for(const row of points)for(const p of row){ctx.fillStyle='rgba(172,200,157,.48)';ctx.fillRect(p.x-1,p.y-1,2,2);}
    for(let i=0;i<5;i++){
      const travel=(time*.18+i*.217)%1,index=travel*(cols-1),c=Math.min(cols-2,Math.floor(index)),t=index-c,row=points[i+1];
      const x=row[c].x+(row[c+1].x-row[c].x)*t,y=row[c].y+(row[c+1].y-row[c].y)*t;
      ctx.fillStyle=i%2?'#d7e5bb':'#e8c98f';ctx.fillRect(x-2,y-2,4,4);
    }
  }
  function animate(now){paint(now);if(!reduced&&!root.hidden)frame=requestAnimationFrame(animate);}
  addEventListener('resize',()=>{resize();paint();});
  function stage(name){
    const active=['transfer','keyboard','display'].indexOf(name);
    rows.forEach((row,i)=>row.dataset.state=i<active?'done':i===active?'active':'waiting');
    root.dataset.phase=name;message.textContent=({transfer:'Loading terminal',keyboard:'Preparing keyboard',display:'Preparing display'})[name];
  }
  return {
    start(){started=performance.now();lastPercent=-1;root.hidden=false;root.classList.remove('leaving');root.dataset.indeterminate='true';meter.removeAttribute('aria-valuenow');meter.setAttribute('aria-valuetext','Connecting');percent.textContent='';fill.style.width='0%';stage('transfer');cancelAnimationFrame(frame);resize();frame=requestAnimationFrame(animate);},
    progress(event){
      if(!(event.total>0))return;
      const value=Math.max(0,Math.min(100,Math.floor(event.loaded/event.total*100)));
      if(value===lastPercent)return;lastPercent=value;root.dataset.indeterminate='false';percent.textContent=value+'%';fill.style.width=value+'%';meter.setAttribute('aria-valuenow',String(value));meter.setAttribute('aria-valuetext',value+' percent downloaded');if(reduced)paint();
    },
    stage,
    async finish(reveal){
      rows.forEach(row=>row.dataset.state='done');root.dataset.indeterminate='false';root.dataset.phase='ready';lastPercent=100;message.textContent='Ready';percent.textContent='100%';meter.setAttribute('aria-valuenow','100');meter.setAttribute('aria-valuetext','Terminal ready');fill.style.width='100%';if(reduced)paint();
      const remaining=Math.max(0,900-(performance.now()-started));if(remaining)await new Promise(resolve=>setTimeout(resolve,remaining));
      reveal();root.classList.add('leaving');await new Promise(resolve=>setTimeout(resolve,300));root.hidden=true;cancelAnimationFrame(frame);
    },
    fail(){root.hidden=true;cancelAnimationFrame(frame);}
  };
}
