const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const V=require('../world.js');

// Server-side geometry and sprite contract tests; no browser or network needed.
const PixelTiles={
 sprites:{elder:{width:32,height:32}},
 create:(width,height,paint)=>{
  paint((x,y,w,h,color)=>{
   assert.ok(Number.isFinite(x)&&Number.isFinite(y), 'Pixel coordinates must be finite');
   assert.ok(typeof color==='string' && color.startsWith('#'), 'Pixel palette color');
  });
  return {width,height};
 }
};
const source=fs.readFileSync(require.resolve('../npcs.js'),'utf8');
const NPCs=vm.runInNewContext(source+'\nNPCs;', {Village:V,PixelTiles});

test('7 village residents and 8 future sect envoys have unique IDs',()=>{
 assert.equal(NPCs.villagers.length,7);
 assert.equal(NPCs.envoys.length,8);
 assert.equal(new Set([...NPCs.villagers,...NPCs.envoys].map(n=>n.id)).size,15);
 assert.ok(NPCs.envoys.every(n=>n.previewOnly && n.sect));
});

test('village NPCs stand outside houses on walkable paths',()=>{
 for(const n of NPCs.villagers){
  assert.ok(!V.blocked(n.x,n.y), n.name+' cannot be inside a wall or water');
  assert.ok(n.greet.length>30, n.name+' has a complete dialogue');
 }
 assert.equal(NPCs.nearest(V.elder.x,V.elder.y).id,'elder');
});

test('NPC walk and profession animations remain inside map bounds',()=>{
 for(let i=0;i<2000;i++)NPCs.update(.025);
 for(const n of NPCs.villagers)assert.equal(V.blocked(n.x,n.y),false,n.name);
});

test('all sect envoys have readable 32px sprites in four directions',()=>{
 for(const n of [...NPCs.villagers,...NPCs.envoys]){
  for(const direction of ['up','down','left','right'])
   for(let frame=0;frame<3;frame++){
    const im=NPCs.sprite(n,direction,frame);
    assert.equal(im.width,32,n.id);assert.equal(im.height,32,n.id);
   }
 }
});

test('existing village elder retains the original sprite',()=>{
 assert.strictEqual(NPCs.sprite(NPCs.villagers[0]),PixelTiles.sprites.elder);
});
