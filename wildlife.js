/* Autonomous ambient birds, chickens, cats and dogs. Movement and fear are local. */
const Wildlife=(()=>{
'use strict';const V=Village,animals=[];
const types=['chicken','chicken','chicken','cat','dog','chicken','cat','dog','chicken','cat','dog','chicken','cat','chicken','dog','chicken'];
const anchors=[...V.places,V.spawn,V.landmarks.gate,V.landmarks.meadow];
const homes=types.map((_,i)=>{const a=anchors[i%anchors.length];for(let r=18;r<155;r+=14)for(let k=0;k<12;k++){const t=k*Math.PI/6+i*.37,x=a.x+Math.cos(t)*r,y=a.y+Math.sin(t)*r;if(!V.blocked(x,y))return [x,y];}return [V.spawn.x,V.spawn.y];});
homes.forEach(([x,y],i)=>{animals.push({type:types[i],x,y,hx:x,hy:y,heading:i*1.31,pace:0,turn:i%5+1,scared:0,phase:i*.73});});
for(let i=0;i<7;i++)animals.push({type:'bird',x:110+i*300,y:130+i%3*370,heading:i*.2,phase:i*.9,scared:0,pace:0,turn:0});
function move(a,dx,dy){const nx=a.x+dx,ny=a.y+dy;if(!V.blocked(nx,ny)){a.x=nx;a.y=ny;return true;}if(!V.blocked(nx,a.y)){a.x=nx;return true;}if(!V.blocked(a.x,ny)){a.y=ny;return true;}return false;}
function update(dt,player){
for(const a of animals){
a.phase+=dt;const dx=a.x-player.x,dy=a.y-player.y,dist=Math.hypot(dx,dy);
if(a.type==='bird'){if(dist<140)a.scared=2.6;a.scared=Math.max(0,a.scared-dt);a.x+=dt*(a.scared?120:36);a.y+=Math.sin(a.phase*2)*dt*22;if(a.x>V.W+20){a.x=-20;a.y=90+(a.phase*197)%1100;}continue;}
if(dist<(a.type==='chicken'?105:125))a.scared=Math.max(a.scared,1.3);
a.scared=Math.max(0,a.scared-dt);
if(a.scared>0){const length=Math.max(1,dist),speed=a.type==='chicken'?155:195,jitter=Math.sin(a.phase*17+a.hx)*.45;
if(!move(a,(dx/length+jitter)*speed*dt,(dy/length-jitter*.5)*speed*dt)){a.heading+=2.1*dt;move(a,Math.cos(a.heading)*speed*dt,Math.sin(a.heading)*speed*dt);}a.pace+=dt*speed/11;
}else{a.turn-=dt;if(a.turn<=0){a.heading+=Math.sin(a.phase*3+a.hx)*2.5;a.turn=.7+(a.phase*3%2);}
if(Math.hypot(a.x-a.hx,a.y-a.hy)>110)a.heading=Math.atan2(a.hy-a.y,a.hx-a.x);
if((a.phase+a.hx*.001)%5>1.8)continue;
const speed=a.type==='chicken'?26:36;if(!move(a,Math.cos(a.heading)*speed*dt,Math.sin(a.heading)*speed*dt))a.heading+=1.7;a.pace+=dt*speed/10;
}
}
}
function pixel(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function drawAnimal(c,a){
const x=Math.round(a.x),y=Math.round(a.y),step=Math.sin(a.pace*2)>0?1:-1;
if(a.type==='bird'){const wave=Math.sin(a.phase*12);pixel(c,x-2,y,5,3,'#eff4e8');pixel(c,x-12,y-4-wave*3,10,2,'#dde9df');pixel(c,x+3,y-4+wave*3,10,2,'#dde9df');pixel(c,x+2,y+2,3,2,'#d7aa75');return;}
pixel(c,x-8,y+1,17,3,'#304d415f');
if(a.type==='chicken'){pixel(c,x-6,y-9,13,11,'#f1e3bc');pixel(c,x-3,y-13,8,7,'#fff4d9');pixel(c,x+4,y-11,4,3,'#e6ab68');pixel(c,x-1,y-15,4,3,'#c64a4b');pixel(c,x-3,y+1,2,3+step,'#a27b50');pixel(c,x+4,y+1,2,3-step,'#a27b50');pixel(c,x+1,y-11,2,2,'#37342f');}
else if(a.type==='cat'){pixel(c,x-7,y-10,15,11,'#ce9a65');pixel(c,x+3,y-16,8,9,'#d8a16b');pixel(c,x+3,y-18,3,4,'#b67a4c');pixel(c,x+9,y-18,3,4,'#b67a4c');pixel(c,x+7,y-13,2,2,'#2d3d34');pixel(c,x-9,y-12,3,8,'#d09d65');pixel(c,x-5,y,3,3+step,'#9e7259');pixel(c,x+4,y,3,3-step,'#9e7259');}
else{pixel(c,x-9,y-12,19,13,'#a87954');pixel(c,x+5,y-16,10,10,'#b48d62');pixel(c,x+3,y-17,5,6,'#684e40');pixel(c,x+11,y-14,5,6,'#684e40');pixel(c,x+10,y-13,2,2,'#293139');pixel(c,x-13,y-16,5,3,'#b48d62');pixel(c,x-6,y,4,4+step,'#6e5349');pixel(c,x+4,y,4,4-step,'#6e5349');}
}
function draw(c){for(const a of animals)drawAnimal(c,a);}
return {animals,update,draw};
})();
