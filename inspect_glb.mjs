import fs from 'fs';
const buf = fs.readFileSync('/Users/apple/archangel/static/models/bridge.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);

// Check primitive modes: 0=POINTS, 1=LINES, 2=LINE_LOOP, 3=LINE_STRIP, 4=TRIANGLES(default), 5=TRIANGLE_STRIP, 6=TRIANGLE_FAN
const modeNames = {0:'POINTS',1:'LINES',2:'LINE_LOOP',3:'LINE_STRIP',4:'TRIANGLES',5:'TRIANGLE_STRIP',6:'TRIANGLE_FAN'};

if (gltf.meshes) {
  gltf.meshes.forEach((m, i) => {
    console.log(`Mesh ${i}: ${m.name || 'unnamed'}`);
    m.primitives.forEach((p, j) => {
      const mode = p.mode !== undefined ? p.mode : 4;
      const posAcc = gltf.accessors[p.attributes.POSITION];
      const idxAcc = p.indices !== undefined ? gltf.accessors[p.indices] : null;
      console.log(`  Prim ${j}: mode=${mode} (${modeNames[mode]}), vertices=${posAcc.count}, indices=${idxAcc ? idxAcc.count : 'none'}`);
    });
  });
}

// Check scenes
console.log('\nScenes:', JSON.stringify(gltf.scenes));
console.log('Default scene:', gltf.scene);
