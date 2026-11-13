import * as THREE from 'three';

export function createWorld(scene,renderer,camera){
  let seed=31416;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const points=[];
  for(let i=0;i<520;i++)points.push((random()-.5)*70,(random()-.25)*35,-6-random()*42);
  const starsGeometry=new THREE.BufferGeometry();
  starsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  const stars=new THREE.Points(starsGeometry,new THREE.PointsMaterial({color:'#b7c7ae',size:.045,sizeAttenuation:true,transparent:true,opacity:.58,depthWrite:false,fog:false}));
  scene.add(stars);

  const landscape=new THREE.PlaneGeometry(52,60,24,28);
  landscape.rotateX(-Math.PI/2);
  const p=landscape.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i)+(random()-.5)*1.2,z=p.getZ(i)-19+(random()-.5)*1.2;
    const y=-2.1+Math.sin(x*.20+z*.12)*.65+Math.cos(z*.19)*.4;
    p.setXYZ(i,x,y,z);
  }
  landscape.computeVertexNormals();
  const lines=new THREE.LineSegments(new THREE.WireframeGeometry(landscape),new THREE.LineBasicMaterial({color:'#578674',transparent:true,opacity:.20,depthWrite:false}));
  scene.add(lines);
  const terrainPoints=new THREE.Points(landscape,new THREE.PointsMaterial({color:'#c2b478',size:.037,transparent:true,opacity:.48,depthWrite:false}));
  scene.add(terrainPoints);

  return {
    render(time,reduced){
      if(!reduced){stars.rotation.y=Math.sin(time*.014)*.025;lines.position.z=Math.sin(time*.055)*.4;terrainPoints.position.z=lines.position.z;}
      renderer.render(scene,camera);
    },
    resize(){}
  };
}
