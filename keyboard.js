import * as THREE from 'three';

// Positions are measured from the source keyboard; the replacement caps are
// authored here, so legends no longer depend on the shared low-resolution atlas.
export async function refineKeyboard(model,renderer){
  const original=model.getObjectByName('Comp_Screen000_TerminalMaterial_0');
  if(!original)return {press(){},release(){},releaseAll(){},update(){}};
  const layout=await fetch('./assets/key-layout.json?v=20261112-6').then(r=>{if(!r.ok)throw Error('Key layout unavailable');return r.json();});
  const atlas=document.createElement('canvas');atlas.width=atlas.height=2048;
  const ctx=atlas.getContext('2d'),cell=2048/10;
  const lightLabels=new Set(['ESC','TAB','CTRL','SHIFT','ENTER','ALT','SYS','FN','LEFT','DOWN','UP','RIGHT']);
  let seed=63;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  layout.forEach((key,i)=>{
    key.ivory=lightLabels.has(key.label);key.tile=[i%10,Math.floor(i/10)];
    const [col,row]=key.tile,x=col*cell,y=row*cell;
    ctx.fillStyle=key.ivory?'#d0c9af':'#292e2e';ctx.fillRect(x,y,cell,cell);
    // Small pigment variation belongs to the key surface rather than the page.
    for(let j=0;j<220;j++){ctx.fillStyle=random()>.5?'rgba(255,247,222,.035)':'rgba(12,17,16,.035)';ctx.fillRect(x+random()*cell,y+random()*cell,1+random()*2,1+random()*2);}
    ctx.fillStyle=key.ivory?'#252c29':'#e5e1cb';ctx.textAlign='center';ctx.textBaseline='middle';
    const label=({LEFT:'←',RIGHT:'→',UP:'↑',DOWN:'↓',SPACE:''})[key.label]??key.label;
    ctx.font=`600 ${label.length>2?43:100}px monospace`;
    ctx.fillText(label,x+cell/2,y+cell*.45,cell*.79);
    if(key.label==='F'||key.label==='J'){ctx.fillStyle='#8c9085';ctx.fillRect(x+cell*.40,y+cell*.78,cell*.20,3);}
  });
  const map=new THREE.CanvasTexture(atlas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const topMaterial=new THREE.MeshStandardMaterial({map,roughness:.44,metalness:0});
  const dark=new THREE.MeshStandardMaterial({color:'#222827',roughness:.36});
  const ivory=new THREE.MeshStandardMaterial({color:'#bcb49b',roughness:.41});
  const assembly=new THREE.Group();assembly.name='Detailed replacement keyboard';
  assembly.position.copy(original.position);assembly.quaternion.copy(original.quaternion);assembly.scale.copy(original.scale);original.parent.add(assembly);
  const caps=[],capsByCode=new Map();
  // Rounded perimeter, 6 segments per corner; local Z is the key's travel axis.
  function ring(width,depth,radius,z){
    const result=[];
    for(let corner=0;corner<4;corner++){
      const angle=corner*Math.PI/2,cx=(corner===0||corner===3?1:-1)*(width/2-radius),cy=(corner<2?1:-1)*(depth/2-radius);
      for(let j=0;j<=5;j++){const a=angle+j/5*Math.PI/2;result.push([cx+Math.cos(a)*radius,cy+Math.sin(a)*radius,z]);}
    }
    return result;
  }
  function surface(rings,key,top=false){
    const points=rings.flat(),positions=points.flat(),uv=[],indices=[],n=rings[0].length;
    for(const p of points){const u=THREE.MathUtils.clamp(p[0]/key.width+.5,.025,.975),v=THREE.MathUtils.clamp(p[1]/key.depth+.5,.025,.975);uv.push((key.tile[0]+u)/10,1-(key.tile[1]+1-v)/10);}
    for(let r=0;r<rings.length-1;r++)for(let i=0;i<n;i++){const j=(i+1)%n,a=r*n+i,b=r*n+j,c=(r+1)*n+j,d=(r+1)*n+i;indices.push(a,b,c,a,c,d);}
    if(top){const center=points.length;positions.push(0,0,-.0026);uv.push((key.tile[0]+.5)/10,1-(key.tile[1]+.5)/10);const start=(rings.length-1)*n;for(let i=0;i<n;i++)indices.push(start+i,start+(i+1)%n,center);}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
  layout.forEach(key=>{
    const w=key.width,d=key.depth;
    const lower=ring(w+.020,d+.018,.006,-.036),shoulder=ring(w+.009,d+.008,.006,-.009),lip=ring(w,d,.005,0);
    const cap=new THREE.Group();cap.position.fromArray(key.center);cap.rotation.x=Math.PI/18;cap.name=key.code;cap.userData.key=key.label;cap.userData.code=key.code;cap.userData.rest=cap.position.clone();cap.userData.pressUntil=0;
    cap.add(new THREE.Mesh(surface([lower,shoulder,lip],key),key.ivory?ivory:dark));
    cap.add(new THREE.Mesh(surface([lip,ring(w*.76,d*.76,.004,-.0015),ring(w*.40,d*.40,.002,-.0026)],key,true),topMaterial));
    assembly.add(cap);caps.push(cap);capsByCode.set(key.code,cap);
  });
  assembly.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});
  original.removeFromParent();
  return {
    press(code,held=false){const cap=capsByCode.get(code);if(!cap)return null;cap.userData.pressUntil=held?Infinity:performance.now()+220;return {code:cap.userData.code,label:cap.userData.key};},
    release(code){const cap=capsByCode.get(code);if(cap)cap.userData.pressUntil=performance.now()+100;},
    releaseAll(){for(const cap of caps)cap.userData.pressUntil=0;},
    update(now){for(const cap of caps){const depth=now<cap.userData.pressUntil ? .009 : 0;cap.position.copy(cap.userData.rest);cap.position.y+=Math.sin(Math.PI/18)*depth;cap.position.z-=Math.cos(Math.PI/18)*depth;}}
  };
}
