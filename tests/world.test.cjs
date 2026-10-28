const {test}=require('node:test');const assert=require('node:assert/strict');const V=require('../world.js');
test('version, dimensions, spawn and destinations',()=>{assert.equal(V.version,7);assert.equal(V.W,2304);assert.equal(V.H,1536);for(const p of [V.spawn,V.elder,...V.places,...Object.values(V.landmarks)])assert.equal(V.blocked(p.x,p.y),false,JSON.stringify(p));});
test('buildings, water, well and boundaries block movement',()=>{for(const b of [...V.buildings,...V.solids])assert.equal(V.blocked(b.x+b.w/2,b.y+b.h/2),true,b.name);for(const [x,y] of [[0,0],[V.W+1,70],[2230,600],[NaN,50],[40,Infinity]])assert.equal(V.blocked(x,y),true);});
test('paths connect spawn with all destinations, gates and bridge',()=>{
const step=12,queue=[[V.spawn.x,V.spawn.y]],seen=new Set([V.spawn.x+','+V.spawn.y]);
for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(!seen.has(k)&&!V.blocked(nx,ny)){seen.add(k);queue.push([nx,ny]);}}}
for(const p of [...V.places,V.elder,...Object.values(V.landmarks)])assert(queue.some(([x,y])=>Math.hypot(x-p.x,y-p.y)<17),'unreachable '+JSON.stringify(p));
});
test('main road stays wide for movement',()=>{for(let delta=-60;delta<=60;delta+=12)assert.equal(V.blocked(V.spawn.x+delta,850),false);});
