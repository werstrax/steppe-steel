import assert from 'node:assert/strict';
import {buildMembers} from '../src/assets/js/frame-geometry.mjs';
import {WebGLRenderer,Mesh,Vector3} from '../src/assets/vendor/three/three.module.min.js';
import {OrbitControls} from '../src/assets/vendor/three/OrbitControls.js';
assert.equal(typeof WebGLRenderer,'function');assert.equal(typeof Mesh,'function');assert.equal(typeof OrbitControls,'function');
function isOn(p,m){
 const a=new Vector3(...m.a),b=new Vector3(...m.b),v=b.clone().sub(a),q=new Vector3(...p).sub(a);
 const t=q.dot(v)/v.lengthSq();
 return t>=-1e-7&&t<=1+1e-7&&q.sub(v.multiplyScalar(t)).length()<1e-6;
}
for(const [w,l,area] of [[18,36,648],[24,60,1440]]){
 const g=buildMembers(w,l);assert.equal(g.width*g.length,area);
 assert.equal(g.members.filter(m=>m.role==='frame').length,(l/6+1)*4);
 const frames=g.members.filter(m=>m.role==='frame');
 for(const m of g.members){
  assert(m.a.every(Number.isFinite)&&m.b.every(Number.isFinite));
  assert(new Vector3(...m.a).distanceTo(new Vector3(...m.b))>0);
  for(const p of [m.a,m.b]){assert(Math.abs(p[0])<=w/2+.001);assert(Math.abs(p[2])<=l/2+.001);}
  if(m.role==='secondary'||m.role==='bracing')
    for(const p of [m.a,m.b])assert(frames.some(f=>isOn(p,f)),`Unattached ${m.role} endpoint: ${p}`);
 }
 console.log(w+' x '+l+': geometry, dimensions and bracing connections OK ('+g.members.length+' members)');
}
assert.throws(()=>buildMembers(31,36),RangeError);
for(const name of ['steppe-steel-prezentaciya','steppe-steel-partnyorskaya-set','steppe-steel-sertifikat-profili']){
 const r=await fetch('http://localhost:4321/assets/docs/'+name+'.pdf');assert.equal(r.status,200);const bytes=new Uint8Array(await r.arrayBuffer());assert.equal(new TextDecoder().decode(bytes.slice(0,4)),'%PDF');
}
for(const p of ['/assets/js/frame-viewer.js','/assets/js/frame-geometry.mjs','/assets/vendor/three/three.module.min.js','/assets/vendor/three/three.core.min.js','/assets/vendor/three/OrbitControls.js']){
 const r=await fetch('http://localhost:4321'+p);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/javascript/);
}
console.log('3 original PDFs and all 3D module endpoints OK');
