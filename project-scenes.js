import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

// Cinematic miniatures. These demonstrate the subjects, not recorded experiments.
const TAU=Math.PI*2;
const lerp=THREE.MathUtils.lerp;
const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
const cache=new Map();
let renderer,environment;
const sphere=new THREE.SphereGeometry(1,20,12);
const cube=new THREE.BoxGeometry(1,1,1);
const cylinder=new THREE.CylinderGeometry(1,1,1,24);
const materials=new Map();
function material(color,metalness=0,roughness=.5){const key=[color,metalness,roughness].join('/');if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness}));return materials.get(key);}
function mesh(parent,geometry,mat,position=[0,0,0],scale=[1,1,1]){const object=new THREE.Mesh(geometry,mat);object.position.set(...position);object.scale.set(...scale);object.castShadow=true;object.receiveShadow=true;parent.add(object);return object;}
function box(parent,size,position,color,radius=.06){return mesh(parent,new RoundedBoxGeometry(...size,2,Math.min(radius,...size.map(v=>v/3))),material(color),position);}
function ball(parent,r,position,color,metal=.1){return mesh(parent,sphere,material(color,metal,.3),position,[r,r,r]);}
function rod(parent,a,b,color,r=.015){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),delta=bv.clone().sub(av);const object=mesh(parent,cylinder,material(color,.35,.32),av.clone().add(bv).multiplyScalar(.5).toArray(),[r,delta.length(),r]);object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return object;}
function line(parent,points,color,opacity=1){const object=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(object);return object;}
function arc(parent,r,center,color,start=0,end=TAU,opacity=.4){
 const curve=new THREE.CatmullRomCurve3(Array.from({length:81},(_,i)=>{const a=lerp(start,end,i/80);return new THREE.Vector3(center[0]+Math.cos(a)*r,center[1],center[2]+Math.sin(a)*r);}));
 const object=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.009,6,false),new THREE.MeshStandardMaterial({color,metalness:.35,roughness:.35,transparent:opacity<1,opacity}));parent.add(object);return object;
}
function setup(color,span=9){
 const scene=new THREE.Scene();scene.background=new THREE.Color(color);scene.environment=environment;scene.environmentIntensity=.45;
 const camera=new THREE.OrthographicCamera(-span,span,span*520/1024,-span*520/1024,.1,80);camera.position.set(8,7,11);camera.lookAt(0,.5,0);
 scene.add(new THREE.HemisphereLight('#eaf3f0','#18212b',.6));
 const key=new THREE.DirectionalLight('#fff0cf',3.2);key.position.set(-4,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
 const rim=new THREE.DirectionalLight('#8bc9dc',1.6);rim.position.set(3,5,-4);scene.add(rim);
 const floor=mesh(scene,new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:new THREE.Color(color).multiplyScalar(.24),roughness:.95}),[0,-.65,0]);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 scene.fog=new THREE.Fog(color,20,42);
 return{scene,camera,update(){}};
}
function waypoints(path,t){const x=THREE.MathUtils.clamp(t,0,.999999)*(path.length-1),i=Math.floor(x),u=smooth(x-i);return new THREE.Vector3(lerp(path[i][0],path[i+1][0],u),0,lerp(path[i][1],path[i+1][1],u));}

function chef(parent,color){
 const group=new THREE.Group();parent.add(group);
 const body=mesh(group,cylinder,material(color),[0,.43,0],[.22,.34,.19]);
 const apron=box(group,[.27,.29,.05],[0,.42,.18],'#f3e7c8',.025);
 ball(group,.2,[0,.75,0],'#eac29c');ball(group,.053,[0,.75,.188],'#e4b58b');
 for(const x of [-.075,.075])ball(group,.021,[x,.80,.172],'#192c31');
 mesh(group,cylinder,material('#f3efe2'),[0,.97,0],[.225,.16,.21]);
 for(const [x,y,z]of [[-.15,1.06,0],[0,1.12,0],[.15,1.06,0],[0,1.06,.13]])ball(group,.145,[x,y,z],'#fff9e9');
 const arms=[box(group,[.12,.27,.13],[-.27,.43,.02],color),box(group,[.12,.27,.13],[.27,.43,.02],color)];
 const legs=[box(group,[.13,.18,.22],[-.11,.16,0],'#243b40'),box(group,[.13,.18,.22],[.11,.16,0],'#243b40')];
 const ingredient=new THREE.Group();ingredient.position.set(.28,.54,.26);group.add(ingredient);ball(ingredient,.14,[0,0,0],'#e9b953');box(ingredient,[.035,.10,.035],[0,.17,0],'#6c9865');
 const bowl=new THREE.Group();bowl.position.set(.28,.54,.26);group.add(bowl);mesh(bowl,cylinder,material('#eae1c9'),[0,0,0],[.18,.10,.18]);mesh(bowl,cylinder,material('#df9854'),[0,.055,0],[.155,.012,.155]);
 return{group,ingredient,bowl,pose(time,moving){const stride=Math.sin(time*12)*.10*(moving?1:0);legs[0].rotation.x=stride*4;legs[1].rotation.x=-stride*4;arms[0].rotation.x=-stride*2;arms[1].rotation.x=stride*2;body.rotation.z=Math.sin(time*12)*.018*(moving?1:0);apron.rotation.z=body.rotation.z;}};
}
function kitchen(){
 const s=setup('#173332',6.35),room=new THREE.Group();s.scene.add(room);
 box(room,[9.4,.24,5.6],[0,-.18,0],'#264c49',.1);
 for(let z=0;z<5;z++)for(let x=0;x<9;x++)box(room,[.99,.045,.99],[x-4,.0,z-2],(x+z)%2?'#4e7970':'#41685f',.025);
 box(room,[9.4,1.1,.16],[0,.52,-2.75],'#c2c1a3');
 box(room,[.16,1.1,5.6],[-4.7,.52,0],'#a5b69c');
 function counter(x,z){const group=new THREE.Group();group.position.set(x,0,z);room.add(group);box(group,[1.16,.68,1.0],[0,.36,0],'#c5a77b');box(group,[1.25,.11,1.08],[0,.75,0],'#e1d4b3');box(group,[.86,.39,.035],[0,.37,.51],'#b99a70');box(group,[.22,.035,.04],[0,.49,.55],'#586d5c');return group;}
 const back=[];for(let i=0;i<7;i++)back.push(counter(-3.8+i*1.25,-2.1));
 // Ingredients, cutting board, knife, and a copper stockpot.
 for(const [x,z]of [[-.28,0],[.07,-.17],[.28,.18],[-.15,.24]]){ball(back[0],.14,[x,.91,z],'#e9bb62');box(back[0],[.028,.10,.028],[x,1.08,z],'#6d9468');}
 box(back[1],[.70,.035,.58],[0,.83,0],'#b48650');box(back[1],[.35,.02,.055],[.05,.86,0],'#d3dada');box(back[1],[.15,.035,.075],[-.18,.86,0],'#394d49');
 const hob=box(back[3],[1.04,.035,.78],[0,.825,0],'#243936');
 for(const x of [-.28,.28]){arc(back[3],.17,[x,.855,.05],'#b78856');}
 const pot=mesh(back[3],cylinder,material('#ad7750',.75,.26),[0,1.015,0],[.31,.32,.31]);
 mesh(back[3],cylinder,material('#e0a455',.05,.4),[0,1.185,0],[.28,.016,.28]);
 for(const x of [-.38,.38])box(back[3],[.18,.07,.10],[x,1.07,0],'#283b36',.03);
 const steam=Array.from({length:9},(_,i)=>{const mat=new THREE.MeshBasicMaterial({color:'#e2ece1',transparent:true,opacity:.25,depthWrite:false});return mesh(back[3],sphere,mat,[0,1.3,0],[.1,.1,.1]);});
 for(let i=0;i<4;i++)mesh(back[5],cylinder,material('#f0e5cc'),[0,.84+i*.035,0],[.27,.028,.27]);
 // The serving hatch is a warm destination for the second chef.
 box(room,[1.42,1.06,.12],[3.7,1.31,-2.75],'#30463c');
 box(room,[1.15,.70,.04],[3.7,1.30,-2.67],'#e1b474');
 const lamp=new THREE.PointLight('#ffc976',2,4);lamp.position.set(3.7,1.8,-2);s.scene.add(lamp);
 for(const x of [-4,4]){const island=counter(x,1.9);if(x>0){box(island,[.7,.035,.5],[0,.83,0],'#b78752');}}
 const a=chef(room,'#c87850'),b=chef(room,'#4faaa2');
 a.group.scale.setScalar(1.18);b.group.scale.setScalar(1.18);
 let previousA=new THREE.Vector3(),previousB=new THREE.Vector3();
 s.camera.position.set(7.7,7.9,10);s.camera.lookAt(0,.25,-.05);
 s.update=time=>{
  const phase=(time%12)/12;
  const pa=waypoints([[-2.7,.65],[-3.6,-1.05],[-3.6,-1.05],[-.3,-1.05],[-.3,-1.05],[-2.7,.65]],phase);
  const pb=waypoints([[1.8,.7],[1.8,.7],[.75,-1.05],[.75,-1.05],[3.6,-1.05],[1.8,.7]],phase);
  for(const [actor,p,previous]of [[a,pa,previousA],[b,pb,previousB]]){const moving=p.distanceToSquared(previous)>.00001;const direction=p.clone().sub(previous);actor.group.position.copy(p);if(moving)actor.group.rotation.y=Math.atan2(direction.x,direction.z);actor.pose(time,moving);previous.copy(p);}
  a.ingredient.visible=phase>.27&&phase<.66;a.bowl.visible=false;b.ingredient.visible=false;b.bowl.visible=phase>.61&&phase<.83;
  steam.forEach((p,i)=>{const u=(time*.45+i/9)%1;p.position.set(Math.sin(i*2+u*2)*.12,1.23+u*.8,Math.cos(i*3+u)*.12);p.scale.setScalar(.04+u*.10);p.material.opacity=(1-u)*.28;});
  room.rotation.y=Math.sin(time*TAU/24)*.035;
 };
 return s;
}

function mri(){
 const s=setup('#111d2c',3.8);s.camera.position.set(5,3.6,8);s.camera.lookAt(0,.25,0);
 const volume=new THREE.Group();volume.position.set(-1.25,.55,0);s.scene.add(volume);
 const voxels=[],mask=[];const n=22,step=.102;
 for(let x=0;x<n;x++)for(let y=0;y<26;y++)for(let z=0;z<n;z++){
  const px=(x-(n-1)/2)*step,py=(y-12.5)*step,pz=(z-(n-1)/2)*step;
  const radius=(px/1.02)**2+(py/1.26)**2+(pz/.98)**2;
  const fissure=Math.abs(px)<.055&&py>.0,ventricle=(px/.20)**2+((py+.02)/.28)**2+(pz/.30)**2<1;
  if(radius>1||fissure||ventricle)continue;
  const tissue=.43+.12*Math.sin(x*1.9+y*.7)*Math.cos(z*1.7-y*.9)+.10*(1-radius);
  const lesion=((px-.45)/.27)**2+((py-.19)/.34)**2+((pz-.19)/.30)**2<1;
  const p={x:px,y:py,z:pz,tissue,lesion};voxels.push(p);if(lesion)mask.push(p);
 }
 const cells=new THREE.InstancedMesh(cube,new THREE.MeshStandardMaterial({roughness:.63,metalness:.05}),voxels.length);cells.castShadow=false;cells.receiveShadow=false;volume.add(cells);
 const extracted=new THREE.InstancedMesh(cube,material('#d98541',.25,.28),mask.length);extracted.position.set(1.38,.55,0);extracted.castShadow=true;s.scene.add(extracted);
 const transform=new THREE.Object3D(),color=new THREE.Color();
 mask.forEach((p,i)=>{transform.position.set(p.x,p.y,p.z);transform.scale.setScalar(step*.94);transform.updateMatrix();extracted.setMatrixAt(i,transform.matrix);});extracted.instanceMatrix.needsUpdate=true;
 const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.35,2.9,2.35)),new THREE.LineBasicMaterial({color:'#7dabbf',transparent:true,opacity:.22}));volume.add(outline);
 const scan=new THREE.Mesh(new THREE.PlaneGeometry(2.35,2.9),new THREE.MeshBasicMaterial({color:'#8cd6d4',transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));volume.add(scan);
 const scanEdge=new THREE.LineSegments(new THREE.EdgesGeometry(scan.geometry),new THREE.LineBasicMaterial({color:'#b3e4e0',transparent:true,opacity:.75}));scan.add(scanEdge);
 const maskFrame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.3,1.6,1.3)),new THREE.LineBasicMaterial({color:'#d1a06c',transparent:true,opacity:.23}));maskFrame.position.set(1.8,.75,0);s.scene.add(maskFrame);
 let lastSlice=-1;
 s.update=time=>{
  const phase=(time%10)/10,cut=1.2-2.4*((1-Math.cos(phase*TAU))/2),slice=Math.round(cut/step);
  scan.position.z=cut;
  if(slice!==lastSlice){
   voxels.forEach((p,i)=>{const visible=p.z<=cut;transform.position.set(p.x,p.y,p.z);transform.scale.setScalar(visible?step*.94:0);transform.updateMatrix();cells.setMatrixAt(i,transform.matrix);color.set(p.lesion?'#e58f49':'#7ba3b8');if(!p.lesion)color.multiplyScalar(p.tissue+.28);cells.setColorAt(i,color);});
   cells.instanceMatrix.needsUpdate=true;cells.instanceColor.needsUpdate=true;lastSlice=slice;
  }
  volume.rotation.y=Math.sin(time*TAU/18)*.15;extracted.rotation.y=volume.rotation.y;
  extracted.scale.setScalar(1.15+Math.sin(time*TAU/10)*.035);
  maskFrame.rotation.y=volume.rotation.y;
 };
 return s;
}

function circumcircle(a,b,c){const d=2*(a.x*(b.z-c.z)+b.x*(c.z-a.z)+c.x*(a.z-b.z));if(Math.abs(d)<1e-8)return null;const aa=a.x*a.x+a.z*a.z,bb=b.x*b.x+b.z*b.z,cc=c.x*c.x+c.z*c.z;const x=(aa*(b.z-c.z)+bb*(c.z-a.z)+cc*(a.z-b.z))/d,z=(aa*(c.x-b.x)+bb*(a.x-c.x)+cc*(b.x-a.x))/d;return{x,z,r2:(a.x-x)**2+(a.z-z)**2};}
function triangulate(points){
 const n=points.length,ps=[...points,{x:-100,z:100},{x:0,z:-100},{x:100,z:100}];let triangles=[[n,n+1,n+2]];
 for(let k=0;k<n;k++){const edges=new Map(),bad=new Set();triangles.forEach((t,i)=>{const c=circumcircle(...t.map(j=>ps[j]));if(c&&(ps[k].x-c.x)**2+(ps[k].z-c.z)**2<=c.r2+1e-6){bad.add(i);for(const [a,b]of [[t[0],t[1]],[t[1],t[2]],[t[2],t[0]]]){const key=[a,b].sort((x,y)=>x-y).join(':');edges.has(key)?edges.delete(key):edges.set(key,[a,b]);}}});triangles=triangles.filter((_,i)=>!bad.has(i));for(const edge of edges.values())triangles.push([...edge,k]);}
 return triangles.filter(t=>t.every(i=>i<n));
}
function geometry(){
 const s=setup('#101f28',4.5);s.camera.position.set(7,6.4,9);s.camera.lookAt(0,.7,0);
 const group=new THREE.Group();s.scene.add(group);
 const points=Array.from({length:56},(_,i)=>({x:(i%8-3.5)*.66+Math.sin(i*3.21)*.14,z:(Math.floor(i/8)-3)*.64+Math.cos(i*4.17)*.13}));
 const triangles=triangulate(points),positions=new Float32Array(triangles.length*9);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const faceColors=new Float32Array(triangles.length*9);triangles.forEach((_,i)=>{const color=new THREE.Color(['#194b44','#24594e','#1d4548'][i%3]);for(let j=0;j<3;j++)faceColors.set([color.r,color.g,color.b],i*9+j*3);});geo.setAttribute('color',new THREE.BufferAttribute(faceColors,3));
 const surface=mesh(group,geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.48,metalness:.28,flatShading:true,side:THREE.DoubleSide}));surface.castShadow=false;
 const uniqueEdges=new Map();for(const t of triangles)for(let k=0;k<3;k++){const edge=[t[k],t[(k+1)%3]].sort((a,b)=>a-b);const key=edge.join(':');if(uniqueEdges.has(key))uniqueEdges.get(key).count++;else uniqueEdges.set(key,{edge,count:1});}const edges=[...uniqueEdges.values()];
 const struts=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,1,6),new THREE.MeshBasicMaterial({color:'#ffffff'}),edges.length);group.add(struts);const edgeTransform=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
 const dots=points.map(p=>ball(group,.052,[p.x,.02,p.z],'#d9c58d',.65));
 const drops=points.map(p=>line(group,[[p.x,-.26,p.z],[p.x,0,p.z]],'#487181',.32));
 const base=mesh(group,new THREE.PlaneGeometry(5.5,5.0),new THREE.MeshStandardMaterial({color:'#0c2028',roughness:.8,metalness:.2}),[0,-.28,0]);base.rotation.x=-Math.PI/2;base.castShadow=false;
 const highlight=ball(group,.085,[0,0,0],'#f3d496',.5);
 const ring=arc(group,.17,[0,.05,0],'#ead4a2',0,TAU,.9);
 s.update=time=>{
  const lift=.17+.83*(1-Math.cos(time*TAU/12+Math.PI/2))/2;
  const vertex=p=>[p.x,.02+lift*.19*(p.x*p.x+p.z*p.z),p.z];
  triangles.forEach((t,i)=>t.forEach((j,k)=>positions.set(vertex(points[j]),i*9+k*3)));
  geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();
  edges.forEach(({edge:[a,b],count},i)=>{const av=new THREE.Vector3(...vertex(points[a])),bv=new THREE.Vector3(...vertex(points[b])),delta=bv.clone().sub(av);edgeTransform.position.copy(av).add(bv).multiplyScalar(.5);const radius=count===1?.014:.0075;edgeTransform.scale.set(radius,delta.length(),radius);edgeTransform.quaternion.setFromUnitVectors(up,delta.normalize());edgeTransform.updateMatrix();struts.setMatrixAt(i,edgeTransform.matrix);struts.setColorAt(i,new THREE.Color(count===1?'#e0dfb4':'#8acbad'));});struts.instanceMatrix.needsUpdate=true;struts.instanceColor.needsUpdate=true;
  points.forEach((p,i)=>{const v=vertex(p);dots[i].position.set(...v);const a=drops[i].geometry.attributes.position;a.setXYZ(1,...v);a.needsUpdate=true;});
  const selected=Math.floor(time*.8)%points.length,p=vertex(points[selected]);highlight.position.set(...p);ring.position.set(p[0],p[1],p[2]);const pulse=(time*.8)%1;ring.scale.setScalar(1+pulse*2);ring.material.opacity=1-pulse;
  group.rotation.y=Math.sin(time*TAU/24)*.12;
 };
 return s;
}

function hausdorff(){
 const s=setup('#161f31',4.8);s.camera.position.set(4,7,10);s.camera.lookAt(0,.2,0);
 const left=new THREE.Group();left.position.set(-2.25,.25,0);s.scene.add(left);
 const right=new THREE.Group();right.position.set(2.1,.25,0);s.scene.add(right);
 const colors=['#e5ac70','#8ec8c0'],sources=[],copies=[];
 for(let orbit=0;orbit<3;orbit++)for(let set=0;set<2;set++){
  const r=.63+orbit*.49+set*.16,angle=-Math.PI*(.12+orbit*.12),target=[Math.cos(angle)*r,.18,Math.sin(angle)*r];
  arc(left,r,[0,.0,0],set===0?'#5f5260':'#476976',0,TAU,.5);
  arc(right,r,[0,.0,0],set===0?'#5f5260':'#476976',-Math.PI/2,0,.6);
  ball(right,.105,target,colors[set],.5);
  for(let i=0;i<4;i++){
   const a=angle+i*Math.PI/2,p=[Math.cos(a)*r,.18,Math.sin(a)*r];
   ball(left,.082,p,colors[set],.5);const copy=ball(s.scene,.078,[p[0]-2.25,.43,p[2]],colors[set],.5);copies.push({copy,p,target});
  }
  if(set===0){const q=[Math.cos(angle)*(r+.16),.18,Math.sin(angle)*(r+.16)];rod(right,target,q,'#ead2a0',.017);}
 }
 // A translucent fundamental quadrant holds the quotient representatives.
 const wedge=new THREE.Shape();wedge.moveTo(0,0);for(let i=0;i<=40;i++){const a=-Math.PI/2+i/40*Math.PI/2;wedge.lineTo(Math.cos(a)*2.04,-Math.sin(a)*2.04);}wedge.closePath();
 const plane=new THREE.Mesh(new THREE.ShapeGeometry(wedge),new THREE.MeshPhysicalMaterial({color:'#4f687c',transparent:true,opacity:.19,roughness:.2,metalness:.35,side:THREE.DoubleSide,depthWrite:false}));plane.rotation.x=-Math.PI/2;plane.position.y=-.025;right.add(plane);
 rod(right,[0,-.03,0],[2.08,-.03,0],'#6d8192',.008);rod(right,[0,-.03,0],[0,-.03,-2.08],'#6d8192',.008);
 s.update=time=>{
  const phase=(time%12)/12,fold=(1-Math.cos(phase*TAU))/2;
  copies.forEach(({copy,p,target},i)=>{const u=smooth(THREE.MathUtils.clamp(fold*1.25-i%4*.06,0,1));copy.position.set(lerp(p[0]-2.25,target[0]+2.1,u),.43+Math.sin(u*Math.PI)*(.55+(i%4)*.14),lerp(p[2],target[2],u));copy.scale.setScalar(.078*(.9+Math.sin(u*Math.PI)*.1));copy.visible=u>.025&&u<.99;});
  s.camera.position.x=4+Math.sin(time*TAU/30)*.22;s.camera.lookAt(0,.2,0);
 };
 return s;
}

function initialize(){
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:false});renderer.setPixelRatio(1);renderer.setSize(1280,650,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
}

const builders={0:kitchen,1:mri,3:geometry,4:hausdorff};
export async function prepareCinematicPreviews(index){
 if(index===2||!builders[index])return;
 if(!renderer)initialize();
 for(const selected of [index]){
  if(!cache.has(selected))cache.set(selected,builders[selected]());
  const state=cache.get(selected);state.update(0);
  await renderer.compileAsync(state.scene,state.camera);
  renderer.render(state.scene,state.camera);
 }
}
export function drawCinematicPreview(ctx,index,width,height,time){
 if(!renderer)initialize();
 if(!cache.has(index))cache.set(index,builders[index]());
 const state=cache.get(index);state.update(time);renderer.render(state.scene,state.camera);
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(renderer.domElement,0,0,width,height);
 if(index===4){ctx.fillStyle='#c9d5d7';ctx.font=`${width/42}px monospace`;ctx.fillText('X, Y',width*.20,height*.81);ctx.fillText('X/G, Y/G',width*.69,height*.81);}
 ctx.restore();
}
