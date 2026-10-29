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
  // Wider, visually verifiable clearings. Previously the narrow ribbons left
  // the stone fence and vegetable beds visible in the map overview.
  // Authoring coordinates use the original 1536x1024 image.
  const zones=[
   {name:'Dược đường',bounds:[150,483,466,572]},
   {name:'Tiệm rèn',bounds:[926,446,1211,528]},
   {name:'Khách điếm',bounds:[270,731,616,818]},
   {name:'Nhà dân',bounds:[829,751,1153,832]}
  ];
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  // Real, unobstructed dirt texture from the central village avenue.
  // Avoid samples from houses, the southern gate and river.
  const tw=86,th=54,patch=document.createElement('canvas');
  patch.width=tw;patch.height=th;
  const pc=patch.getContext('2d',{willReadFrequently:true});
  pc.drawImage(image,635,332,tw,th,0,0,tw,th);
  let texture;
  try{texture=pc.getImageData(0,0,tw,th).data;}catch{return;}
  for(const zone of zones){
   const [x0,y0,x1,y1]=zone.bounds,w=x1-x0,h=y1-y0;
   let region;
   try{region=paint.getImageData(x0,y0,w,h);}catch{continue;}
   const original=new Uint8ClampedArray(region.data),out=region.data;
   for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
    // Feathery, uneven ground edges rather than a flat rectangular strip.
    const top=y0+2*Math.sin(x/27)+Math.sin(x/10);
    const bottom=y1+2*Math.sin(x/31);
    const left=x0+3*Math.sin(y/27),right=x1+3*Math.sin(y/28);
    const edge=Math.min(y-top,bottom-y,x-left,right-x);
    if(edge<=0)continue;
    const a=clamp(edge/11,0,1);
    const tx=((Math.floor((x-x0)*.78+y*.13)%tw)+tw)%tw;
    const ty=((Math.floor((y-y0)*.74+x*.07)%th)+th)%th;
    const dst=((y-y0)*w+x-x0)*4,from=(ty*tw+tx)*4;
    for(let c=0;c<3;c++)out[dst+c]=original[dst+c]*(1-a)+texture[from+c]*a;
   }
   paint.putImageData(region,x0,y0);
  }
 }
 // Copy architecture from the ORIGINAL Trưởng thôn house, matching its roofs,
 // lanterns and stairs. Both houses use the same visual language without
 // importing new, mismatched graphics.
 function upgradeNorthernHalls(paint){
  // Copy the larger multi-roofed main hall, including its tiled roof,
  // pillars, lanterns and stone steps, rather than keeping tiny cottages.
  const halls=[
   {x:161,y:37,w:242,h:156},
   {x:979,y:33,w:279,h:163}
  ];
  for(const h of halls){
   const cut=document.createElement('canvas');cut.width=h.w;cut.height=h.h;
   const hc=cut.getContext('2d');hc.imageSmoothingEnabled=true;
   hc.imageSmoothingQuality='high';
   hc.drawImage(image,496,76,396,160,0,0,h.w,h.h);
   // Feather the outline where the new estate meets its surrounding trees.
   const mask=document.createElement('canvas');mask.width=h.w;mask.height=h.h;
   const mc=mask.getContext('2d');
   mc.fillStyle='#fff';mc.filter='blur(5px)';
   mc.beginPath();
   mc.moveTo(8,38);mc.lineTo(h.w*.15,33);mc.lineTo(h.w*.27,11);
   mc.lineTo(h.w*.72,11);mc.lineTo(h.w*.85,32);
   mc.lineTo(h.w-8,38);mc.lineTo(h.w-8,h.h-16);
   mc.lineTo(h.w*.75,h.h-12);mc.lineTo(h.w*.59,h.h-2);
   mc.lineTo(h.w*.41,h.h-2);mc.lineTo(h.w*.25,h.h-12);
   mc.lineTo(8,h.h-16);mc.closePath();mc.fill();
   hc.globalCompositeOperation='destination-in';
   hc.drawImage(mask,0,0);hc.globalCompositeOperation='source-over';
   paint.drawImage(cut,h.x,h.y);
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
