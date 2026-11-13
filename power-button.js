import * as THREE from 'three';

export function createPowerButton(casing){
  const assembly=new THREE.Group();assembly.name='Illuminated power switch';
  assembly.position.set(.6197,-.469,.87865);assembly.rotation.x=Math.PI/2;
  assembly.userData.powerSwitch=true;casing.add(assembly);
  function shape(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
  const bezel=new THREE.Mesh(new THREE.ExtrudeGeometry(shape(.245,.145,.012),{depth:.007,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.006,bevelThickness:.003}),new THREE.MeshStandardMaterial({color:'#151a19',roughness:.37}));assembly.add(bezel);
  const faceMaterial=new THREE.MeshStandardMaterial({color:'#f0ae50',emissive:'#e47d2d',emissiveIntensity:.25,roughness:.29});
  const face=new THREE.Mesh(new THREE.ExtrudeGeometry(shape(.205,.108,.011),{depth:.008,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.006,bevelThickness:.003}),faceMaterial);face.position.z=.009;assembly.add(face);
  const iconCanvas=document.createElement('canvas');iconCanvas.width=iconCanvas.height=128;const ctx=iconCanvas.getContext('2d');ctx.strokeStyle='#282922';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.arc(64,68,33,-Math.PI*.33,Math.PI*1.33);ctx.stroke();ctx.beginPath();ctx.moveTo(64,20);ctx.lineTo(64,62);ctx.stroke();const iconMap=new THREE.CanvasTexture(iconCanvas);iconMap.colorSpace=THREE.SRGBColorSpace;
  const icon=new THREE.Mesh(new THREE.PlaneGeometry(.063,.063),new THREE.MeshBasicMaterial({map:iconMap,transparent:true,depthWrite:false,toneMapped:false}));icon.position.z=.013;face.add(icon);
  assembly.traverse(n=>{if(n.isMesh){n.castShadow=n!==icon;n.receiveShadow=true;}});
  const amber=new THREE.Color('#ffd064'),teal=new THREE.Color('#69ffda'),idle=new THREE.Color('#657368'),signal=new THREE.Color();
  return {
    assembly,
    update(now,on,reduced){
      const pulse=reduced?0:THREE.MathUtils.smoothstep((Math.sin(now*Math.PI/300)+1)/2,.15,.85);
      signal.copy(on?idle:amber);if(!on)signal.lerp(teal,pulse);
      faceMaterial.color.copy(signal);faceMaterial.emissive.copy(signal);faceMaterial.emissiveIntensity=on ? .06 : 1.8;face.position.z=on ? .005 : .009;
    },
    anchor(mobile){return assembly.localToWorld(new THREE.Vector3(mobile?0:.15,mobile?-.085:0,.04));}
  };
}
