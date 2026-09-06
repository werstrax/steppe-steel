/** Illustrative frame geometry, not a structural calculation. Dimensions in metres. */
export function buildMembers(width=18, length=36) {
  if (![18,24].includes(width) || ![36,60].includes(length)) throw new RangeError('Unsupported example');
  const members=[], frames=Math.round(length/6), eave=6, ridge=8.1;
  const add=(a,b,role='frame')=>members.push({a,b,role});
  for(let i=0;i<=frames;i++){
    const z=-length/2+i*length/frames;
    add([-width/2,0,z],[-width/2,eave,z]);
    add([width/2,0,z],[width/2,eave,z]);
    add([-width/2,eave,z],[0,ridge,z]);
    add([0,ridge,z],[width/2,eave,z]);
    for(const x of [-width/2,width/2]) add([x,0,z],[x,0.12,z],'base');
  }
  for(const x of [-width/2,width/2]){
    for(const y of [1.8,3.7,5.8]) add([x,y,-length/2],[x,y,length/2],'secondary');
    for(const z of [-length/2,length/2-6]){
      add([x,.4,z],[x,eave,z+6],'bracing');
      add([x,eave,z],[x,.4,z+6],'bracing');
    }
  }
  for(let i=0;i<=8;i++){
    const x=-width/2+i*width/8,y=eave+(1-Math.abs(x)/(width/2))*(ridge-eave);
    add([x,y,-length/2],[x,y,length/2],'secondary');
  }
  for(const z of [-length/2,length/2-6]){
    add([-width/2,eave,z],[0,ridge,z+6],'bracing');
    add([0,ridge,z],[-width/2,eave,z+6],'bracing');
    add([width/2,eave,z],[0,ridge,z+6],'bracing');
    add([0,ridge,z],[width/2,eave,z+6],'bracing');
  }
  return {width,length,eave,ridge,members};
}
