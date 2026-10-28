/* Generated tile-and-prop village; ground, roads and foreground are distinct canvases. */
const Scenery=(()=>{
'use strict';
const V=Village,T=PixelTiles;
const base=document.createElement('canvas'),display=document.createElement('canvas'),cover=document.createElement('canvas');
for(const c of [base,display,cover]){c.width=V.W;c.height=V.H;}
const p=base.getContext('2d'),f=cover.getContext('2d');p.imageSmoothingEnabled=false;f.imageSmoothingEnabled=false;
let brightness=92;
try{const v=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(v)&&v>=60&&v<=110)brightness=v;}catch{}
function rnd(a,b){let n=Math.imul(a+1349,1597334677)^Math.imul(b+781,3812015801);n=Math.imul(n^(n>>>16),2246822519);return((n^(n>>>13))>>>0)/4294967296;}
function box(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function road(pts,size,color){p.strokeStyle=color;p.lineCap='round';p.lineJoin='round';p.lineWidth=size;p.beginPath();p.moveTo(pts[0][0],pts[0][1]);for(const point of pts.slice(1))p.lineTo(point[0],point[1]);p.stroke();}
function river(){
p.beginPath();p.moveTo(V.W,0);for(let y=0;y<=V.H;y+=12)p.lineTo(V.riverEdge(y),y);p.lineTo(V.W,V.H);p.closePath();p.fillStyle='#345963';p.fill();
p.beginPath();p.moveTo(V.W,0);for(let y=0;y<=V.H;y+=12)p.lineTo(V.riverEdge(y)+17,y);p.lineTo(V.W,V.H);p.closePath();p.fillStyle='#244d65';p.fill();
for(let i=0;i<300;i++){const y=rnd(i,79)*V.H,x=V.riverEdge(y)+32+rnd(i,63)*170;if(x<V.W)box(p,x,y,4+rnd(i,11)*11,2,i%4===0?'#89babc':'#387790');}
const b=V.bridge;box(p,b.x-10,b.y-6,b.w+20,b.h+12,'#354a49');box(p,b.x,b.y,b.w,b.h,'#73523d');
for(let x=b.x;x<b.x+b.w;x+=18){box(p,x+2,b.y+8,14,b.h-16,(x/18|0)%2?'#b88d5d':'#98724b');box(p,x+2,b.y+12,14,3,'#d5ad7e');}
for(const y of [b.y+4,b.y+b.h-11]){box(p,b.x-7,y,b.w+14,8,'#473639');for(let x=b.x;x<=b.x+b.w;x+=33)box(p,x,y-11,7,21,'#cca173');}
}
for(let y=0;y<V.H;y+=32)for(let x=0;x<V.W;x+=32)T.tile('grass',x,y,Math.floor(rnd(x/32,y/32)*4),p);
for(const r of V.routes){road(r.p,r.r*2+27,'#4f654d');road(r.p,r.r*2+14,'#8a7b54');road(r.p,r.r*2,'#bba477');}
for(const c of V.clearings){ellipse(p,c.x,c.y,c.rx+11,c.ry+11,'#637353');ellipse(p,c.x,c.y,c.rx,c.ry,'#bba579');}
ellipse(p,V.spawn.x,V.spawn.y+7,114,76,'#607570');ellipse(p,V.spawn.x,V.spawn.y+7,103,66,'#aaaba0');
ellipse(p,V.spawn.x,V.spawn.y+7,78,51,'#c7bca0');ellipse(p,V.spawn.x,V.spawn.y+7,55,33,'#89a399');
p.strokeStyle='#e0d3ab';p.lineWidth=4;p.beginPath();p.arc(V.spawn.x,V.spawn.y+7,32,0,Math.PI*2);p.stroke();
for(let i=0;i<225;i++){const x=22+rnd(i,15)*(V.W-44),y=22+rnd(i,44)*(V.H-44);if(!V.inFootpath(x,y)||x>V.riverEdge(y)-12)continue;box(p,x,y,4,2,i%4?'#a08d64':'#d4bd89');}
river();
function lamp(x,y){box(p,x-5,y-1,10,5,'#263d39');box(p,x-2,y-39,4,39,'#563e30');box(p,x-8,y-45,16,10,'#e2a556');box(p,x-5,y-43,10,5,'#f9da94');box(p,x-11,y-49,22,4,'#30464a');}
function building(b){
const {x,y,w,h,type}=b;
ellipse(p,x+w/2,y+h+10,w*.57,21,'#566f56');
box(p,x-7,y+48,w+14,h-29,'#3b4e4a');box(p,x,y+54,w,h-42,type==='forge'?'#837060':'#a99a7d');box(p,x+9,y+60,w-18,h-62,'#d1b990');
for(let j=0;j<Math.floor(w/44);j++){const wx=x+17+j*43;box(p,wx,y+80,24,33,'#493e3b');box(p,wx+4,y+84,16,25,'#e4bd74');box(p,wx+11,y+84,2,25,'#604b37');box(p,wx+4,y+98,16,2,'#604b37');}
const roof=type==='hall'?'#1c4254':'#294b5d';
box(p,x-18,y+36,w+36,43,'#182f3d');box(p,x-11,y+28,w+22,43,roof);
for(let i=0;i<Math.ceil(w/22);i++){box(p,x-8+i*22,y+30,19,4,i%2?'#66858b':'#557980');box(p,x-8+i*22,y+46,19,2,'#122c36');}
box(p,x+w/2-36,y+4,72,29,'#1b343c');box(p,x+w/2-30,y+7,60,21,roof);
box(p,x+w/2-46,y+69,92,h-75,'#71553e');box(p,x+w/2-34,y+78,68,h-86,'#372d2d');box(p,x+w/2-7,y+89,14,18,'#bb965a');
for(let i=0;i<3;i++)box(p,x+w/2-38+i*4,y+h+9+i*5,78-i*8,5,'#c9b58f');
lamp(x+12,y+h-1);lamp(x+w-10,y+h-1);
if(type==='forge'){box(p,x+w-75,y+h-20,48,17,'#443b33');box(p,x+w-66,y+h-23,32,12,'#eb924b');}
const sign={hall:'TRƯỞNG THÔN',healer:'DƯỢC ĐƯỜNG',forge:'TIỆM RÈN',inn:'KHÁCH ĐIẾM',farm:'NÔNG GIA',house:'NHÀ DÂN'}[type];
p.font='bold 15px monospace';p.textAlign='center';const sw=Math.max(90,p.measureText(sign).width+25);
box(p,x+w/2-sw/2,y+34,sw,26,'#1d3234');p.fillStyle='#edd49a';p.fillText(sign,x+w/2,y+53);
}
for(let i=0;i<115;i++){
const x=65+rnd(i,310)*(V.W-130),y=105+rnd(i,311)*(V.H-180);
if(V.inFootpath(x,y)||x>V.riverEdge(y)-50||V.buildings.some(b=>x>b.x-70&&x<b.x+b.w+70&&y>b.y-90&&y<b.y+b.h+60))continue;
const type=i%7===0?'peach':'pine';p.drawImage(T.sprites[type],Math.round(x-32),Math.round(y-80));
if(i%6===0)f.drawImage(T.sprites[type],Math.round(x-32),Math.round(y-80));
}
for(let i=0;i<115;i++){
const x=45+rnd(i,200)*(V.W-90),y=45+rnd(i,201)*(V.H-90);
if(V.inFootpath(x,y)||x>V.riverEdge(y)-36||V.buildings.some(b=>x>b.x-38&&x<b.x+b.w+38&&y>b.y-35&&y<b.y+b.h+38))continue;
if(i%4===0){box(p,x,y,8,5,'#7b8774');box(p,x+1,y,4,2,'#a8b18c');}
else box(p,x,y,3,3,i%5?'#d6c488':'#dfabac');
}
for(const b of V.buildings)building(b);
for(const [sx,sy] of [[170,430],[1850,440]]){box(p,sx-12,sy-12,170,106,'#455940');for(let row=0;row<3;row++)for(let col=0;col<5;col++){box(p,sx+col*29,sy+row*29,20,13,'#5e774d');box(p,sx+col*29+5,sy+row*29+3,5,6,'#8da968');}}
const well=V.solids[0];ellipse(p,well.x+20,well.y+25,34,19,'#566864');ellipse(p,well.x+20,well.y+16,29,17,'#bbb99f');ellipse(p,well.x+20,well.y+14,20,10,'#396276');
const tree=V.solids[1];p.drawImage(T.sprites.peach,tree.x-18,tree.y-95,76,114);
for(const [x,y] of [[967,560],[1275,560],[845,790],[1370,790],[964,1122],[1258,1122]])lamp(x,y);
for(const [x,y,vertical] of [[1120,45,false],[1120,1470,false],[65,750,true],[2260,750,true]]){
box(p,x-51,y-7,102,13,'#1d353e');
if(!vertical){box(p,x-54,y-30,13,65,'#71523b');box(p,x+42,y-30,13,65,'#71523b');}
else{box(p,x-33,y-30,13,65,'#71523b');box(p,x+22,y-30,13,65,'#71523b');}
box(p,x-62,y-33,124,10,'#45606a');
}
const overviewImage=document.createElement('img');overviewImage.src=base.toDataURL('image/webp',0.87);
function rebuild(){const a=display.getContext('2d');a.clearRect(0,0,V.W,V.H);a.imageSmoothingEnabled=false;a.filter='brightness('+brightness+'%) saturate(103%)';a.drawImage(base,0,0);a.filter='none';}
rebuild();
function setBrightness(v){const n=Number(v);if(!Number.isFinite(n))return;brightness=Math.max(60,Math.min(110,Math.round(n)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
return {image:overviewImage,loaded:Promise.resolve(true),ready:true,ground(){ctx.drawImage(display,0,0,V.W,V.H);},foreground(){ctx.drawImage(cover,0,0,V.W,V.H);},setBrightness,get brightness(){return brightness;}};
})();
