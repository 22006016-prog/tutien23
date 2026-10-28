/* Bundled village artwork. Navigation in world.js follows this exact scene.
   Colour correction is cached, so adjusting eye comfort costs no per-frame filter. */
const Scenery=(()=>{
 const image=new Image(),layer=document.createElement('canvas'),sharpLayer=document.createElement('canvas');
 let sharpReady=false;
 let ready=false,failed=false,brightness=92;
 try{const saved=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(saved)&&saved>=60&&saved<=110)brightness=saved;}catch{}
 // Prepare moderate unsharp-mask detail once; changing brightness never repeats this work.
 function prepareSharpArt(){
  if(sharpReady||!image.naturalWidth)return;
  sharpLayer.width=image.naturalWidth;sharpLayer.height=image.naturalHeight;
  const sc=sharpLayer.getContext('2d',{willReadFrequently:true});
  sc.drawImage(image,0,0);
  try{
   const pixels=sc.getImageData(0,0,sharpLayer.width,sharpLayer.height);
   const source=new Uint8ClampedArray(pixels.data),dest=pixels.data,w=sharpLayer.width,h=sharpLayer.height,a=.18;
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const i=(y*w+x)*4;
    for(let c=0;c<3;c++)dest[i+c]=Math.max(0,Math.min(255,source[i+c]*(1+4*a)-a*(source[i+c-4]+source[i+c+4]+source[i+c-w*4]+source[i+c+w*4])));
   }
   sc.putImageData(pixels,0,0);
  }catch(err){ /* Keep the original image if image pixels are unavailable. */ }
  sharpReady=true;
 }
 // Remove the south-east residence's front fence by borrowing texture from
 // the illustrated yard (above it) and grassy clearing (below it). Unlike a
 // rectangular dirt overlay, this soft local repair keeps the original scene.
 // All sampling is performed once when the cached scenery is rebuilt.
 function clearResidentFence(paint){
  // Use the real grassy ground just south of this fence. Pixel copies retain
  // leaf/soil detail and avoid flat beige shapes or streaky color interpolation.
  const sx=825,sy=745,w=310,h=145;
  let pixels;
  try{pixels=paint.getImageData(sx,sy,w,h);}catch{return;}
  const before=new Uint8ClampedArray(pixels.data),dest=pixels.data;
  const clamp=v=>Math.max(0,Math.min(1,v));
  for(let y=sy;y<sy+h;y++)for(let x=sx;x<sx+w;x++){
   const top=755+3*Math.sin(x/29)+1.5*Math.sin(x/11);
   const bottom=821+3*Math.sin(x/34)+2*Math.sin(x/15);
   const edge=Math.min(y-top,bottom-y,x-835-3*Math.sin(y/20),1120+3*Math.sin(y/22)-x);
   if(edge<=0)continue;
   const alpha=clamp(edge/9);
   const sampleY=Math.max(sy,Math.min(sy+h-1,Math.floor(825+(y-top)/(bottom-top)*57)));
   const i=((y-sy)*w+(x-sx))*4,source=((sampleY-sy)*w+(x-sx))*4;
   for(let c=0;c<3;c++)dest[i+c]=before[i+c]*(1-alpha)+before[source+c]*alpha;
  }
  paint.putImageData(pixels,sx,sy);
 }
 // Keep the illustrated ground intact. Only open a narrow section of fence and
 // scatter a few cobbles at the four yards whose fences cross the approach.
 // Do NOT paint wide, round-ended roads over the finished village artwork.
 function paintEntrances(paint){
  if(!V.doorPaths)return;
  for(const door of V.doorPaths){
   if(!door.gate||door.name==='Nhà dân')continue; // Resident front fence is fully removed above.
   const x=Math.round(door.gate.x/V.SCALE),y=Math.round(door.gate.y/V.SCALE);
   const width=door.name==='Khách điếm'||door.name==='Nhà dân'?18:16;
   const left=Math.round(x-width/2),top=y-8;
   paint.save();
   // Narrow dirt gap in the fence, using pixels from the EXISTING central road.
   // A clipped rectangle, not a stroked line, prevents oval/beige blobs.
   paint.beginPath();
   paint.moveTo(left+2,top);paint.lineTo(left+width-2,top);
   paint.lineTo(left+width,top+4);paint.lineTo(left+width-1,top+14);
   paint.lineTo(left+width-4,top+17);paint.lineTo(left+2,top+17);
   paint.lineTo(left,top+12);paint.lineTo(left,top+3);paint.closePath();
   paint.clip();
   paint.globalAlpha=1;
   paint.drawImage(image,690,545,width,18,left,top,width,18);
   paint.restore();
   // Two fence posts mark a clear gap without blanketing flowers or the nearby grass.
   paint.save();paint.fillStyle='#594631';
   paint.fillRect(left-3,top-5,3,16);
   paint.fillRect(left+width,top-5,3,16);
   paint.fillStyle='#977656';
   paint.fillRect(left-2,top-5,1,13);
   paint.fillRect(left+width+1,top-5,1,13);
   // Stepping stones are intentionally tiny and irregular (4-7px).
   const phase=door.name==='Nhà dân'?2:0;
   for(let i=0;i<3;i++){
    const sy=y+13+i*8;
    const sx=x+(i%2?4:-3)+phase;
    paint.fillStyle='#645d4d';paint.fillRect(sx-3,sy-1,8,5);
    paint.fillStyle=i%2?'#baae93':'#a79e85';paint.fillRect(sx-3,sy-2,7,4);
    paint.fillStyle='#ded0b1';paint.fillRect(sx-2,sy-2,4,1);
   }
   paint.restore();
  }
 }
 function rebuild(){
  if(!image.naturalWidth)return;
  prepareSharpArt();
  layer.width=image.naturalWidth;layer.height=image.naturalHeight;
  const paint=layer.getContext('2d');paint.imageSmoothingEnabled=false;
  paint.filter=`brightness(${brightness}%) saturate(97%) contrast(106%)`;
  paint.drawImage(sharpLayer,0,0);paint.filter='none';
  clearResidentFence(paint);
  paintEntrances(paint);
 }
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{image.onload=()=>{rebuild();ready=true;resolve(true);};image.onerror=()=>{failed=true;resolve(false);};});
 image.src='assets/thon-khoi-nguyen.png';
 function ground(){if(ready){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(layer,0,0,V.W,V.H);ctx.restore();return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},image};
})();
