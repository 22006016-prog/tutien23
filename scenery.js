/* Bundled village artwork. Navigation in world.js follows this exact scene.
   Colour correction is cached, so adjusting eye comfort costs no per-frame filter. */
const Scenery=(()=>{
 const image=new Image(),overviewImage=new Image(),layer=document.createElement('canvas'),sharpLayer=document.createElement('canvas');
 let sharpReady=false,cacheReady=false,lastError='';
 let ready=false,failed=false,brightness=92;
 try{const saved=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(saved)&&saved>=60&&saved<=110)brightness=saved;}catch{}
 // Build the map ONCE at the real playable-world resolution.
 // The old pipeline sharpened 1536x1024 pixels, then enlarged them 1.5x
 // every frame; that made tiny roofs, fences and paving details look soft.
 function prepareSharpArt(){
  if(cacheReady||!image.naturalWidth)return;
  const source=document.createElement('canvas');
  source.width=image.naturalWidth;source.height=image.naturalHeight;
  const art=source.getContext('2d');
  art.drawImage(image,0,0);
  // A damaged house or fence edit must not block the game from loading.
  try{openFourFrontYards(art);}catch(error){lastError='Hàng rào: '+error.message;}
  try{upgradeNorthernHalls(art);}catch(error){lastError='Nhà mới: '+error.message;}
  try{overviewImage.src=source.toDataURL('image/webp',.88);}catch(error){}
  sharpLayer.width=V.W;sharpLayer.height=V.H;
  const output=sharpLayer.getContext('2d');
  output.imageSmoothingEnabled=true;
  output.imageSmoothingQuality='high';
  output.drawImage(source,0,0,V.W,V.H);
  cacheReady=true;sharpReady=true;
 }
 // Remove only the FRONT fences of the four shops/inns highlighted in yellow.
 // Each narrow polygonal ribbon is filled with genuine dirt/grass pixels
 // sampled from elsewhere in the same image, not a solid color or wide oval.
 function openFourFrontYards(paint){
  const zones=[
   {name:'Dược đường',p:[[174,540],[210,552],[294,550],[380,541],[454,516]],r:23,tex:[674,546]},
   {name:'Tiệm rèn',p:[[933,490],[980,514],[1057,514],[1134,506],[1192,485]],r:23,tex:[763,555]},
   {name:'Khách điếm',p:[[288,761],[332,782],[432,788],[545,770]],r:23,tex:[635,741]},
   {name:'Nhà dân',p:[[848,780],[914,796],[1034,799],[1127,781]],r:24,tex:[688,827]}
  ];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const distance=(x,y,a,b)=>{
   const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
   const t=len?clamp(((x-a[0])*dx+(y-a[1])*dy)/len,0,1):0;
   return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);
  };
  for(const zone of zones){
   const x0=Math.max(0,Math.floor(Math.min(...zone.p.map(q=>q[0]))-zone.r-3));
   const y0=Math.max(0,Math.floor(Math.min(...zone.p.map(q=>q[1]))-zone.r-3));
   const x1=Math.min(image.naturalWidth,Math.ceil(Math.max(...zone.p.map(q=>q[0]))+zone.r+4));
   const y1=Math.min(image.naturalHeight,Math.ceil(Math.max(...zone.p.map(q=>q[1]))+zone.r+4));
   const w=x1-x0,h=y1-y0,textureSize=88;
   const texCanvas=document.createElement('canvas');
   texCanvas.width=textureSize;texCanvas.height=textureSize;
   const tc=texCanvas.getContext('2d',{willReadFrequently:true});
   tc.drawImage(image,zone.tex[0],zone.tex[1],textureSize,textureSize,0,0,textureSize,textureSize);
   let region,texture;
   try{
    region=paint.getImageData(x0,y0,w,h);
    texture=tc.getImageData(0,0,textureSize,textureSize).data;
   }catch{continue;}
   const original=new Uint8ClampedArray(region.data),out=region.data;
   for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
    let d=1e6;
    for(let i=1;i<zone.p.length;i++)d=Math.min(d,distance(x,y,zone.p[i-1],zone.p[i]));
    const alpha=clamp((zone.r-d)/7,0,1);
    if(alpha<=0)continue;
    // Gentle texture offsets break up repetitive tiles and retain fine detail.
    const sx=((Math.floor((x-x0)*.72+(y-y0)*.11)%textureSize)+textureSize)%textureSize;
    const sy=((Math.floor((y-y0)*.62+(x-x0)*.07)%textureSize)+textureSize)%textureSize;
    const dest=((y-y0)*w+(x-x0))*4,src=(sy*textureSize+sx)*4;
    for(let c=0;c<3;c++)out[dest+c]=original[dest+c]*(1-alpha)+texture[src+c]*alpha;
   }
   paint.putImageData(region,x0,y0);
  }
 }
 // Copy architecture from the ORIGINAL Trưởng thôn house, matching its roofs,
 // lanterns and stairs. Both houses use the same visual language without
 // importing new, mismatched graphics.
 function upgradeNorthernHalls(paint){
  const halls=[
   {x:164,y:43,w:216,h:117,fill:[401,255,135,94]},
   {x:984,y:38,w:259,h:116,fill:[1202,255,135,94]}
  ];
  for(const hall of halls){
   const {x,y,w,h,fill}=hall;
   // Conceal the small old cottage using the surrounding painted landscape.
   const backdrop=document.createElement('canvas');
   backdrop.width=w+8;backdrop.height=h+8;
   const bc=backdrop.getContext('2d');
   bc.imageSmoothingEnabled=true;
   bc.drawImage(image,...fill,0,0,w+8,h+8);
   const fade=document.createElement('canvas');
   fade.width=w+8;fade.height=h+8;
   const fc=fade.getContext('2d');
   fc.fillStyle='#fff';fc.filter='blur(7px)';fc.fillRect(8,8,w-8,h-8);
   bc.globalCompositeOperation='destination-in';bc.drawImage(fade,0,0);
   bc.globalCompositeOperation='source-over';
   paint.drawImage(backdrop,x-4,y-4);

   // Original main hall: curved dark tiles, lit windows, stone staircase.
   const house=document.createElement('canvas');house.width=w;house.height=h;
   const hc=house.getContext('2d');
   hc.imageSmoothingEnabled=true;hc.imageSmoothingQuality='high';
   hc.drawImage(image,510,77,370,152,0,0,w,h);
   const mask=document.createElement('canvas');mask.width=w;mask.height=h;
   const mc=mask.getContext('2d');mc.fillStyle='white';mc.filter='blur(2.5px)';
   const p=[[0,.53],[.04,.42],[.23,.38],[.33,.18],[.66,.18],[.74,.4],[.94,.42],[1,.54],[1,.88],[.67,.9],[.58,1],[.38,1],[.3,.9],[0,.89]];
   mc.beginPath();p.forEach(([xx,yy],i)=>i?mc.lineTo(xx*w,yy*h):mc.moveTo(xx*w,yy*h));
   mc.closePath();mc.fill();
   hc.globalCompositeOperation='destination-in';hc.drawImage(mask,0,0);
   hc.globalCompositeOperation='source-over';
   paint.drawImage(house,x,y);
  }
 }
 function rebuild(){
  if(!image.naturalWidth)return;
  try{
   prepareSharpArt();
   if(!cacheReady)return;
   layer.width=V.W;layer.height=V.H;
   const paint=layer.getContext('2d');
   paint.imageSmoothingEnabled=true;
   paint.filter=`brightness(${brightness}%) saturate(101%) contrast(104%)`;
   paint.drawImage(sharpLayer,0,0);
   paint.filter='none';
  }catch(error){
   lastError='Bản đồ nền: '+(error.message||String(error));
   cacheReady=false;
  }
 }
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{
  image.onload=()=>{
   ready=true;resolve(true);
   setTimeout(()=>{
    rebuild();
    const overview=document.querySelector('#overview-art');
    if(overview&&overviewImage.src)overview.src=overviewImage.src;
   },30);
  };
  image.onerror=()=>{failed=true;resolve(false);};
 });
 image.src='assets/thon-khoi-nguyen.png';
 function ground(){
  if(ready){
   ctx.save();ctx.imageSmoothingEnabled=true;
   ctx.drawImage(cacheReady?layer:image,0,0,V.W,V.H);
   ctx.restore();return;
  }
  ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);
  ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';
  ctx.fillText(failed?'Không tải được ảnh nền — kiểm tra kết nối.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);
 }
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},get image(){return overviewImage.src?overviewImage:image;},get lastError(){return lastError;}};
})();
