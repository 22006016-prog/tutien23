const {test}=require('node:test');
const assert=require('node:assert/strict');
const V=require('../world.js');
function flood(){const step=4,queue=[[V.spawn.x,V.spawn.y]],seen=new Set([V.spawn.x+','+V.spawn.y]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const nx=x+dx,ny=y+dy,key=nx+','+ny;if(!seen.has(key)&&!V.blocked(nx,ny)){seen.add(key);queue.push([nx,ny]);}}}return queue;}
test('start and exploration locations are open on the painted paths',()=>{assert.equal(V.blocked(V.spawn.x,V.spawn.y),false);assert.equal(V.blocked(V.elder.x,V.elder.y),false);for(const p of V.places)assert.equal(V.blocked(p.x,p.y),false,p.name);});
test('house footprints, well and planted courtyard borders are solid',()=>{for(const b of V.buildings)assert.equal(V.blocked(b.x+b.w/2,b.y+b.h/2),true,b.name);for(const s of V.solids)assert.equal(V.blocked(s.x+s.w/2,s.y+s.h/2),true);});
test('all exploration destinations, southern gate and bridge connect to the central spawn',()=>{const reachable=flood();for(const p of [...V.places,{x:697,y:897,name:'Cổng thôn'},{x:1468,y:503,name:'Cầu sông'},{...V.elder,name:'Trưởng thôn'}])assert.ok(reachable.some(([x,y])=>Math.hypot(x-p.x,y-p.y)<8),p.name);});
test('river, waterfalls, pond and dense forest cannot be walked through',()=>{for(const [x,y] of [[1450,620],[1390,350],[1270,80],[100,900],[50,500],[700,410]])assert.equal(V.blocked(x,y),true,`${x},${y}`);});
test('spawn lies in the central courtyard, distinct from the solid well',()=>{assert.ok(Math.hypot(V.spawn.x-V.W/2,V.spawn.y-V.H/2)<100);assert.equal(V.blocked(850,500),true);assert.equal(V.blocked(V.spawn.x,V.spawn.y),false);});
test('arched bridge supports passage while neighbouring water blocks passage',()=>{for(const [x,y] of [[1290,500],[1330,488],[1370,481],[1420,489],[1470,503]])assert.equal(V.blocked(x,y),false,`${x},${y}`);assert.equal(V.blocked(1400,580),true);});
test('navigation rejects invalid coordinates and respects the artwork dimensions',()=>{assert.equal(V.W,1536);assert.equal(V.H,1024);for(const [x,y] of [[NaN,500],[500,Infinity],[-1,500],[1537,500],[500,1025]])assert.equal(V.blocked(x,y),true);});
