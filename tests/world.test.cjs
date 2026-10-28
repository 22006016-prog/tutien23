const {test}=require('node:test');
const assert=require('node:assert/strict');
const V=require('../world.js');
function flood(){const step=6,queue=[[V.spawn.x,V.spawn.y]],seen=new Set([V.spawn.x+','+V.spawn.y]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const nx=x+dx,ny=y+dy,key=nx+','+ny;if(!seen.has(key)&&!V.blocked(nx,ny)){seen.add(key);queue.push([nx,ny]);}}}return queue;}
test('start and exploration locations are open on the painted paths',()=>{assert.equal(V.blocked(V.spawn.x,V.spawn.y),false);assert.equal(V.blocked(V.elder.x,V.elder.y),false);for(const p of V.places)assert.equal(V.blocked(p.x,p.y),false,p.name);});
test('house footprints, well and planted courtyard borders are solid',()=>{for(const b of V.buildings)assert.equal(V.blocked(b.x+b.w/2,b.y+b.h/2),true,b.name);for(const s of V.solids)assert.equal(V.blocked(s.x+s.w/2,s.y+s.h/2),true);});
test('all exploration destinations, southern gate and bridge connect to the central spawn',()=>{const reachable=flood();for(const p of [...V.places,{...V.landmarks.gate,name:'Cổng thôn'},{...V.landmarks.bridge,name:'Cầu sông'},{...V.elder,name:'Trưởng thôn'},...['northwest','northeast','meadow'].map(name=>({...V.landmarks[name],name}))])assert.ok(reachable.some(([x,y])=>Math.hypot(x-p.x,y-p.y)<8),p.name);});
test('river, waterfalls, pond and dense forest cannot be walked through',()=>{for(const [x,y] of [[1450,620],[1390,350],[1270,80],[100,900],[50,500]])assert.equal(V.blocked(x*V.SCALE,y*V.SCALE),true,`${x},${y}`);});
test('spawn lies in the central courtyard, distinct from the solid well',()=>{assert.ok(Math.hypot(V.spawn.x-V.W/2,V.spawn.y-V.H/2)<150);assert.equal(V.blocked(872*V.SCALE,500*V.SCALE),true);assert.equal(V.blocked(V.spawn.x,V.spawn.y),false);});
test('arched bridge supports passage while neighbouring water blocks passage',()=>{for(const [x,y] of [[1290,493],[1330,479],[1376,475],[1430,485],[1475,510]])assert.equal(V.blocked(x*V.SCALE,y*V.SCALE),false,`${x},${y}`);assert.equal(V.blocked(1400*V.SCALE,600*V.SCALE),true);});
test('navigation rejects invalid coordinates and respects the artwork dimensions',()=>{assert.equal(V.W,2304);assert.equal(V.H,1536);for(const [x,y] of [[NaN,500],[500,Infinity],[-1,500],[2305,500],[500,1537]])assert.equal(V.blocked(x,y),true);});

test('world area is expanded and the main avenue supports a broad walking cross-section',()=>{assert.equal(V.W*V.H/(1536*1024),2.25);for(let offset=-50;offset<=50;offset+=10)assert.equal(V.blocked((680+offset)*V.SCALE,300*V.SCALE),false,'main avenue '+offset);});

test('every illustrated house has a reachable doorway path without crossing solid walls',()=>{
 const reachable=flood();
 assert.equal(V.doorPaths.length,V.buildings.length);
 for(const d of V.doorPaths){
  assert.equal(V.blocked(d.entry.x,d.entry.y),false,d.name+' doorway is blocked');
  assert.ok(reachable.some(([x,y])=>Math.hypot(x-d.entry.x,y-d.entry.y)<11),d.name+' path is disconnected');
 }
 for(const b of V.buildings)assert.equal(V.blocked(b.x+b.w/2,b.y+b.h/2),true,b.name+' should remain solid');
});
