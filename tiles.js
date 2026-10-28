/* Native 32 × 32 tiles. Pixel coordinates and a fixed palette, no smoothed shapes. */
const PixelTiles=(()=>{
 const SIZE=32,tiles=new Map();
 const palette={grass:['#385a40','#476a43','#53784a','#65864e','#87a45d'],earth:['#887448','#a28c58','#b49c65','#cab17a','#dbc493'],stone:['#45595b','#627574','#7e8b82','#9ba392','#c3c6a7'],water:['#244959','#2c5c69','#387783','#52969b','#83b6ad']};
 function random(x,y){let n=Math.imul(x+47,374761393)^Math.imul(y+113,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
 function create(w,h,paint){const image=document.createElement('canvas');image.width=w;image.height=h;const p=image.getContext('2d');p.imageSmoothingEnabled=false;const r=(x,y,w,h,col)=>{p.fillStyle=col;p.fillRect(x|0,y|0,w|0,h|0);};paint(r,p);return image;}
 for(const [name,colors] of Object.entries(palette))for(let variant=0;variant<4;variant++)tiles.set(name+variant,create(32,32,(r)=>{
 r(0,0,32,32,colors[2]);
 if(name==='grass'){r(0,0,32,32,colors[1]);for(let i=0;i<11;i++){const x=random(i,variant)*30|0,y=random(i+40,variant)*29|0;r(x,y+2,3,1,colors[2]);r(x+1,y,1,2,i%3===0?colors[3]:colors[2]);if(i%4===0)r(x+2,y+1,1,1,colors[0]);}if(variant===3){r(9,19,1,3,colors[0]);r(8,18,3,2,'#d7ca96');r(10,18,1,1,'#f3e3af');}}
 if(name==='earth'){for(let i=0;i<21;i++){const x=random(i,variant+8)*31|0,y=random(i,variant+30)*31|0;r(x,y,i%3===0?3:1,1,colors[i%5]);}r(7,13,4,2,colors[1]);r(8,12,3,1,colors[3]);r(24,26,3,1,colors[4]);}
 if(name==='stone'){r(0,0,32,32,colors[0]);for(let y=0;y<32;y+=16){const offset=y?8:0;for(let x=-offset;x<32;x+=16){r(x+1,y+1,14,14,colors[(variant+x/16+4)%2===0?2:1]);r(x+2,y+1,12,1,colors[3]);r(x+1,y+2,1,11,colors[3]);r(x+3,y+13,11,1,colors[0]);}}r(5,9,2,1,colors[3]);if(variant===2){r(17,24,1,4,'#45684b');r(18,26,3,1,'#658654');}}
 if(name==='water'){r(0,0,32,32,colors[1]);for(let i=0;i<5;i++){const x=random(i,variant)*27|0,y=i*6+variant;r(x,y,5,1,colors[2]);r(x+2,y+1,3,1,colors[2]);}r(7+variant*2,18,8,1,colors[3]);r(9+variant*2,19,3,1,colors[2]);}
 }));
 function tile(name,x,y,variant=0,target=ctx){target.drawImage(tiles.get(name+(variant&3)),Math.round(x),Math.round(y));}
 const sprites={};
 for(const kind of ['pine','peach'])sprites[kind]=create(64,96,(r)=>{
 const colors=kind==='pine'?['#253c35','#35533a','#476e42','#63894b','#8eaa60']:['#483247','#67425d','#925a7a','#bd7d98','#e6afbc'];
 // Trunk, roots, forked limbs.
 r(28,64,9,27,'#373738');r(30,65,5,25,'#795746');r(31,68,2,19,'#ab8057');r(24,88,6,3,'#514539');r(35,87,7,3,'#514539');r(25,58,5,16,'#5f493e');r(21,55,5,7,'#5f493e');r(36,54,4,18,'#59443c');
 // Hand-shaped stepped crown silhouette, shaded consistently from top left.
 const rows=[[0,26,39],[3,18,47],[7,12,52],[12,8,57],[18,4,60],[25,2,62],[33,0,63],[41,3,61],[49,6,58],[56,12,53],[62,20,45]];
 for(let j=0;j<rows.length;j++){const [y,l,rr]=rows[j],end=j+1<rows.length?rows[j+1][0]:67;r(l,y,rr-l,end-y,colors[0]);r(l+2,y+1,rr-l-4,end-y,colors[1]);}
 const masses=[[25,7,21,12],[13,17,24,17],[34,22,20,14],[6,31,23,17],[23,33,23,19],[39,39,18,14],[13,49,25,12]];
 masses.forEach(([x,y,w,h],j)=>{r(x,y,w,h,colors[2]);r(x+3,y-2,w-7,3,colors[3]);r(x+1,y+2,4,h-6,colors[3]);r(x+w-4,y+h-5,5,5,colors[1]);for(let i=0;i<12;i++){const xx=x+random(i,j)*Math.max(1,w-3)|0,yy=y+random(j,i+20)*Math.max(1,h-3)|0;r(xx,yy,2+i%2,1,i%4===0?colors[4]:colors[3]);}});
 // Dark leaf notches and isolated highlight clusters.
 for(const [x,y] of [[8,40],[19,31],[37,15],[49,36],[31,56],[46,51]]){r(x,y,3,2,colors[1]);r(x+1,y-1,2,1,colors[0]);}
 });
 // One 32 × 32 frame per character pose, sharing the terrain pixel density.
 for(const direction of ['down','up','left','right'])for(let frame=0;frame<3;frame++)sprites['hero-'+direction+'-'+frame]=create(32,32,(r)=>{
 const step=frame===1?-1:frame===2?1:0;
 r(10,27,5,3+step,'#26333f');r(18,27,5,3-step,'#26333f');
 // White robe silhouette, shaded folds and blue waist sash.
 r(10,15,13,13,'#3d566e');r(11,15,11,11,'#dce8df');r(9,18,3,7,'#e7eee1');r(22,18,3,7,'#c5d8d7');r(12,21,3,7,'#f3f0dd');r(17,19,3,10,'#668aab');r(20,22,3,6,'#b1cbd2');r(10,20,13,2,'#527896');r(14,20,3,2,'#d9c184');r(13,17,2,3,'#99b8c7');
 // Dark hair, pale face and tied ribbon.
 r(11,4,12,12,'#202b39');r(13,2,7,4,'#253041');r(12,7,9,7,'#eac59d');r(11,5,12,4,'#2b3444');r(10,7,3,11,'#1e2b3a');r(21,7,3,11,'#1e2b3a');r(13,9,2,2,'#263240');r(19,9,2,2,'#263240');r(16,13,3,1,'#bb8e79');r(21,4,6,2,'#c4d9d7');r(24,6,3,2,'#89aebc');
 if(direction==='up'){r(12,7,10,8,'#273144');r(15,5,2,10,'#354357');r(21,12,2,9,'#273144');}if(direction==='left'){r(18,7,4,8,'#263143');r(12,10,2,2,'#263143');}if(direction==='right'){r(12,7,4,8,'#263143');r(20,10,2,2,'#263143');}
 // Sword with a golden crossguard, kept inside its 32px frame.
 r(5,14,2,15,'#293a4a');r(5,15,1,13,'#edf0d5');r(6,15,1,13,'#8faebc');r(3,13,6,2,'#d9b668');r(5,8,2,5,'#66513b');r(5,7,2,2,'#deb974');
 });
 sprites.elder=create(32,32,(r)=>{r(10,27,5,3,'#343d37');r(18,27,5,3,'#343d37');r(10,15,14,13,'#817659');r(12,16,10,10,'#d1c295');r(10,20,14,2,'#91845c');r(15,16,3,11,'#a2946d');r(10,5,14,10,'#454741');r(12,8,10,8,'#d9b990');r(12,4,11,5,'#a1a58b');r(14,11,2,1,'#42463e');r(20,11,2,1,'#42463e');r(15,14,6,4,'#e3debd');r(17,18,2,2,'#bcb699');r(25,14,2,16,'#6d6044');r(25,12,3,3,'#b7a577');});
 return {SIZE,palette,tiles,sprites,create,random,tile};
})();
