import {buildMembers} from './frame-geometry.mjs';

async function mount(root) {
  const viewport=root.querySelector('[data-frame-viewport]');
  const status=root.querySelector('[data-frame-status]');
  try {
    const THREE=await import('../vendor/three/three.module.min.js');
    const {OrbitControls}=await import('../vendor/three/OrbitControls.js');
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    renderer.setClearColor(0xe9edef,1);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.35;
    renderer.domElement.tabIndex=0;
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Интерактивная 3D-схема каркаса. Вращайте мышью или клавишами со стрелками.');
    viewport.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,500);
    const controls=new OrbitControls(camera,renderer.domElement);
    controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=false;
    controls.minPolarAngle=.22;controls.maxPolarAngle=Math.PI/2-.06;
    controls.target.set(0,3,0);
    const hemi=new THREE.HemisphereLight(0xffffff,0x657785,2.8);scene.add(hemi);
    const sun=new THREE.DirectionalLight(0xfff4e6,4.2);
    sun.position.set(-25,45,30);sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:120});
    sun.shadow.bias=-.0004;scene.add(sun);
    const fill=new THREE.DirectionalLight(0xb9d7ed,1.8);fill.position.set(25,12,-25);scene.add(fill);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0xe6eaec,roughness:1}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-.15;ground.receiveShadow=true;scene.add(ground);
    const steel=new THREE.MeshStandardMaterial({color:0x8a9ba7,metalness:.65,roughness:.32});
    const secondary=new THREE.MeshStandardMaterial({color:0xacb9c1,metalness:.5,roughness:.4});
    const orange=new THREE.MeshStandardMaterial({color:0xf07a37,metalness:.3,roughness:.48});
    const envelope=new THREE.MeshStandardMaterial({color:0xf5f6f5,metalness:.2,roughness:.6,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false});
    const box=new THREE.BoxGeometry(1,1,1),up=new THREE.Vector3(0,1,0);
    let model,shell,config,frameRequested=false,destroyed=false;
    function draw(){if(destroyed||frameRequested)return;frameRequested=true;requestAnimationFrame(()=>{frameRequested=false;if(!destroyed)renderer.render(scene,camera)});}
    function beam(m){
      const a=new THREE.Vector3(...m.a),b=new THREE.Vector3(...m.b),direction=b.clone().sub(a),len=direction.length();
      if(m.role==='base'){
        const foot=new THREE.Mesh(box,steel);foot.scale.set(.75,.12,.75);foot.position.copy(a).addScaledVector(up,.04);model.add(foot);return;
      }
      const group=new THREE.Group();group.position.copy(a).addScaledVector(direction,.5);group.quaternion.setFromUnitVectors(up,direction.normalize());
      if(m.role==='frame'){
        for(const [x,z,sx,sz] of [[0,0,.035,.42],[.105,0,.04,.42],[-.105,0,.04,.42]]){
          const mesh=new THREE.Mesh(box,steel);
          // Web and flanges of an illustrative I-section.
          mesh.scale.set(x===0?.23:.035,len,x===0?.035:.42);mesh.position.set(x,0,z);mesh.castShadow=true;group.add(mesh);
        }
      }else{
        const mesh=new THREE.Mesh(box,m.role==='bracing'?orange:secondary);
        const thick=m.role==='bracing'?.055:.10;mesh.scale.set(thick,len,m.role==='bracing'?thick:.17);mesh.castShadow=true;group.add(mesh);
      }
      model.add(group);
    }
    function panel(points){
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();
      const mesh=new THREE.Mesh(g,envelope);shell.add(mesh);
    }
    function reset(){const radius=Math.max(config.length,config.width)*(camera.aspect<1.2?1.48:1.03);camera.position.set(radius*.88,radius*.60,radius*.97);controls.target.set(0,3,0);controls.update();draw();}
    function build(){
      if(model){scene.remove(model);shell.traverse(o=>{if(o.geometry)o.geometry.dispose()});}
      const [w,l]=root.querySelector('[data-frame-size]').value.split('x').map(Number);
      config=buildMembers(w,l);model=new THREE.Group();shell=new THREE.Group();model.add(shell);
      config.members.forEach(beam);
      const x=w/2,z=l/2,y=config.eave,r=config.ridge;
      panel([[-x,y,-z],[0,r,-z],[0,r,z],[-x,y,z]]);
      panel([[0,r,-z],[x,y,-z],[x,y,z],[0,r,z]]);
      panel([[-x,0,-z],[-x,y,-z],[-x,y,z],[-x,0,z]]);
      panel([[x,0,z],[x,y,z],[x,y,-z],[x,0,-z]]);
      shell.visible=root.querySelector('[data-frame-skin]').getAttribute('aria-pressed')==='true';
      scene.add(model);root.querySelector('[data-frame-area]').textContent=(w*l).toLocaleString('ru-RU')+' м²';
      root.querySelector('[data-frame-dimensions]').textContent=w+' × '+l+' м';reset();
    }
    function rotate(theta,phi=0){
      const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      s.theta+=theta;s.phi=THREE.MathUtils.clamp(s.phi+phi,.23,Math.PI/2-.07);
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();draw();
    }
    controls.addEventListener('change',draw);
    root.querySelector('[data-frame-size]').addEventListener('change',()=>{build();status.textContent='Показан каркас '+config.width+' × '+config.length+' м.'});
    root.querySelector('[data-frame-skin]').addEventListener('click',e=>{
      const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));shell.visible=on;draw();
    });
    root.querySelector('[data-frame-reset]').addEventListener('click',reset);
    root.querySelector('[data-frame-left]').addEventListener('click',()=>rotate(.3));
    root.querySelector('[data-frame-right]').addEventListener('click',()=>rotate(-.3));
    renderer.domElement.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
      e.preventDefault();rotate(e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0,e.key==='ArrowUp'?-.08:e.key==='ArrowDown'?.08:0);
    });
    const resize=new ResizeObserver(()=>{const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();reset()});resize.observe(viewport);
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();root.classList.remove('is-ready');root.querySelectorAll('[data-frame-controls] button,[data-frame-controls] select').forEach(el=>el.disabled=true);status.textContent='3D-просмотр остановлен устройством. Обновите страницу, чтобы повторить.'});
    build();root.classList.add('is-ready');
    root.querySelectorAll('[data-frame-controls] button,[data-frame-controls] select').forEach(el=>el.disabled=false);
    status.textContent='Вращайте модель мышью, пальцем или кнопками. Обшивку можно включить.';
    window.addEventListener('pagehide',()=>{destroyed=true;resize.disconnect();controls.dispose();renderer.dispose();box.dispose();[steel,secondary,orange,envelope,ground.geometry,ground.material].forEach(x=>x.dispose())},{once:true});
  } catch(e) {
    status.textContent='3D-просмотр недоступен на этом устройстве. Ниже доступна иллюстрация и описание конструкции.';
    root.classList.add('has-fallback');
  }
}
const roots=document.querySelectorAll('[data-frame-viewer]');
if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){io.unobserve(entry.target);mount(entry.target)}}),{rootMargin:'300px'});roots.forEach(root=>io.observe(root));}else roots.forEach(mount);
