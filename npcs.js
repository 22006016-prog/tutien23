/* NPC system V1: 7 village residents, 8 sect-envoy sprite profiles.
   Village NPCs use the current Map B; sect envoys are previews until the town map ships. */
const NPCs=(()=>{
'use strict';
const V=Village, cache=new Map();
const defs=[
 {id:'elder',name:'Trưởng thôn',role:'elder',pos:[680,269],outer:'#817659',trim:'#d1c295',hair:'#454741',greet:'Thiếu hiệp mới đến sao? Đây là Thôn Khởi Nguyên. Hãy chào hỏi những người trong làng, rồi quay lại tìm lão. Tiên lộ không thể nóng vội.'},
 {id:'healer',name:'Dược sư',role:'healer',pos:[300,532],outer:'#497c72',trim:'#d6edc7',hair:'#263c32',greet:'Đường tu tiên khó tránh thương tích. Học cách dùng linh dược và giữ mạng trước khi nghĩ đến chuyện tranh đoạt cơ duyên.'},
 {id:'alchemist',name:'Luyện đan sư',role:'alchemist',pos:[245,545],outer:'#7b625c',trim:'#e1bd82',hair:'#343333',greet:'Luyện đan cần kiên nhẫn và hỏa hầu chuẩn xác. Một ngày nào đó ngươi sẽ cần Tẩy Tủy Đan để khai mở con đường tu luyện.'},
 {id:'smith',name:'Thợ rèn',role:'smith',pos:[1100,522],outer:'#5f6875',trim:'#dbc59e',hair:'#282f34',greet:'Một thanh kiếm tốt không thể thay thế bản lĩnh. Nhưng nếu có đủ khoáng thạch, ta sẽ giúp ngươi rèn pháp khí.'},
 {id:'equip',name:'Người bán trang bị',role:'equip',pos:[1140,527],outer:'#475c83',trim:'#e1bd78',hair:'#2a303c',greet:'Áo giáp, hộ uyển, pháp khí đều có phẩm cấp. Chọn thứ phù hợp với cảnh giới của mình, đừng chỉ nhìn vẻ ngoài.'},
 {id:'merchant',name:'Thương nhân',role:'merchant',pos:[476,798],outer:'#9d6d4c',trim:'#f2d29a',hair:'#4a3631',greet:'Ta đi khắp các châu vực, mua bán vật liệu và linh thạch. Lên Tiên Duyên Trấn, ngươi sẽ thấy thương hội lớn hơn nhiều.'},
 {id:'books',name:'Người bán công pháp',role:'books',pos:[967,815],outer:'#54658f',trim:'#d4c5ec',hair:'#2c3045',greet:'Bí tịch ở đây chỉ là công pháp nhập môn. Tuyệt học chân chính cần kỳ ngộ hoặc truyền thừa của các đại tông môn.'}
];
const sects=[
 ['lang-van','Lăng Vân Kiếm Tông','#416da0','#d8e8fb','Kiếm sứ'],
 ['thai-hu','Thái Hư Đạo Tông','#517c94','#edf3d8','Đạo sứ'],
 ['van-linh','Vạn Linh Ngự Thú Sơn','#547e58','#dbedb7','Linh thú sứ'],
 ['dai-nhat','Đại Nhật Phật Tự','#a77e42','#ffe8a1','Phật môn sứ'],
 ['huyet-sat','Huyết Sát Ma Tông','#872d48','#f0a0ac','Huyết sứ'],
 ['u-minh','U Minh Quỷ Điện','#533f86','#c6b0ea','Quỷ sứ'],
 ['van-doc','Vạn Độc Ma Giáo','#4f7140','#c0e97b','Độc sứ'],
 ['cuu-u','Cửu U Ma Diễm Tông','#6a344c','#ef9780','Ma diễm sứ']
];
const villagers=defs.map((d,i)=>({
 ...d,x:d.pos[0]*V.SCALE,y:d.pos[1]*V.SCALE,
 baseX:d.pos[0]*V.SCALE,baseY:d.pos[1]*V.SCALE,
 phase:i*1.73,heading:i%3===0?'down':i%2?'left':'right',moving:false
}));
const envoys=sects.map(([id,sect,outer,trim,title])=>({
 id:'envoy-'+id,name:title,sect,role:'envoy',outer,trim,
 hair:'#252638',greet:'Hãy đến Tiên Duyên Trấn tham gia đại hội Tiên Môn Chiêu Đồ.',
 previewOnly:true
}));
function sprite(n,dir='down',frame=0){
 if(n.role==='elder')return PixelTiles.sprites.elder; // Keep the approved village elder sprite.
 const key=n.id+'/'+dir+'/'+frame;
 if(cache.has(key))return cache.get(key);
 const img=PixelTiles.create(32,32,(r)=>{
 const skin='#e5b98e',dark='#24303b',step=frame===1?-1:frame===2?1:0;
 // Feet and robe: the 32px base ensures no blur against the existing hero.
 r(10,27,5,3+step,dark);r(18,27,5,3-step,dark);
 r(9,17,15,12,n.outer);r(11,17,11,11,n.trim);r(11,21,4,7,n.outer);
 r(18,21,4,7,n.outer);r(9,19,3,7,n.trim);r(23,19,3,7,n.outer);
 r(10,22,14,2,'#354451');r(15,22,3,2,'#f0cd80');
 // Face, hair and individualized headwear.
 r(11,5,13,12,n.hair);r(13,8,9,8,skin);r(11,5,13,5,n.hair);
 r(13,11,2,1,dark);r(20,11,2,1,dark);
 if(n.role==='alchemist'){r(12,3,12,4,n.trim);r(15,1,7,3,n.outer);r(15,15,5,2,'#e6dfc8');}
 if(n.role==='healer'){r(10,5,15,3,'#cce2d2');r(12,3,11,2,n.outer);r(18,15,5,3,'#e0e7d9');}
 if(n.role==='smith'){r(9,3,16,3,'#4b5057');r(11,2,12,2,'#a6a6a4');r(11,15,12,2,'#4b3832');}
 if(n.role==='merchant'){r(12,3,12,4,'#82604c');r(14,1,8,3,n.trim);r(10,24,5,5,'#cba05f');}
 if(n.role==='books'){r(11,3,14,4,n.outer);r(14,2,9,3,n.trim);r(24,21,5,7,'#cdbb93');r(25,21,3,5,'#f2e5c2');}
 if(n.role==='equip'){r(10,3,15,4,'#a3b7c8');r(12,1,11,4,n.outer);r(2,16,6,10,'#a2b6ca');r(4,18,2,6,'#dce6e6');}
 if(n.role==='envoy'){r(10,2,16,5,n.trim);r(12,1,12,4,n.outer);r(15,17,6,4,n.trim);r(16,18,3,2,'#fff3c2');r(26,8,2,18,'#d9cfb8');r(25,6,4,3,n.trim);}
 if(n.role==='smith'){r(25,15,3,12,'#75543b');r(22,13+(frame?2:0),9,4,'#9ea8b4');}
 if(n.role==='alchemist'){r(25,21,6,6,'#5e7775');r(26,22,4,2,'#b4e0b2');}
 if(n.role==='healer'){r(24,21,5,8,'#6a9f8a');r(25,21,3,2,'#edf1cf');}
 if(dir==='up'){r(12,7,11,9,n.hair);r(14,9,5,7,'#425067');}
 if(dir==='left'){r(19,8,4,8,n.hair);r(11,12,2,1,dark);}
 if(dir==='right'){r(11,8,4,8,n.hair);r(22,12,2,1,dark);}
 });
 cache.set(key,img);return img;
}
function update(dt){
 for(const n of villagers){
  n.phase+=dt; n.moving=false;
  // Quiet daily-life movement; keep actors in their approved open courtyards.
  if(['merchant','books','equip'].includes(n.role)){
   const dx=Math.sin(n.phase*.45)*6, nx=n.baseX+dx;
   if(!V.blocked(nx,n.baseY)){n.moving=Math.abs(Math.cos(n.phase*.45))>.3;n.heading=Math.cos(n.phase*.45)>0?'right':'left';n.x=nx;}
  }else if(n.role==='smith'||n.role==='alchemist')n.heading='down';
 }
}
function draw(ctx,n,clock){
 const frame=n.moving?1+Math.floor(clock*6)%2:0;
 const working=(n.role==='smith'||n.role==='alchemist')?Math.floor(n.phase*2)%2:0;
 const bob=n.moving?Math.sin(clock*12):working?-1:0;
 ctx.fillStyle='#172e304f';ctx.fillRect(Math.round(n.x-8),Math.round(n.y+1),16,3);
 const im=sprite(n,n.heading,frame);
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(im,Math.round(n.x-16),Math.round(n.y-30+bob));
 ctx.font='7px monospace';ctx.textAlign='center';
 ctx.fillStyle='#132b32';ctx.fillText(n.name,Math.round(n.x+1),Math.round(n.y-38));
 ctx.fillStyle=n.role==='elder'?'#f7dfad':'#f4e5c8';
 ctx.fillText(n.name,Math.round(n.x),Math.round(n.y-39));
 if(n.role==='alchemist'&&Math.sin(n.phase*3)>0.1){
  ctx.fillStyle='#d5eeb7a0';ctx.fillRect(Math.round(n.x+11),Math.round(n.y-34),2,4);
 }
}
function nearest(x,y,radius=65){
 let chosen=null,best=radius;
 for(const n of villagers){const d=Math.hypot(x-n.x,y-n.y);if(d<best){best=d;chosen=n;}}
 return chosen;
}
return {villagers,envoys,sprite,update,draw,nearest};
})();
