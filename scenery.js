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
   const source=new Uint8ClampedArray(pixels.data),dest=pixels.data,w=sharpLayer.width,h=sharpLayer.height,a=.095;
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const i=(y*w+x)*4;
    for(let c=0;c<3;c++)dest[i+c]=Math.max(0,Math.min(255,source[i+c]*(1+4*a)-a*(source[i+c-4]+source[i+c+4]+source[i+c-w*4]+source[i+c+w*4])));
   }
   sc.putImageData(pixels,0,0);
  }catch(err){ /* Keep the original image if image pixels are unavailable. */ }
  sharpReady=true;
 }
 // Keep the illustrated ground intact. Only open a narrow section of fence and
 // scatter a few cobbles at the four yards whose fences cross the approach.
 // Do NOT paint wide, round-ended roads over the finished village artwork.
 function paintEntrances(paint){
  if(!V.doorPaths)return;
  for(const door of V.doorPaths){
   if(!door.gate)continue; // The other porches already have paths in the original illustration.
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
  paintEntrances(paint);
 }
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{image.onload=()=>{rebuild();ready=true;resolve(true);};image.onerror=()=>{failed=true;resolve(false);};});
 image.src='assets/thon-khoi-nguyen.png';
 function ground(){if(ready){ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(layer,0,0,V.W,V.H);ctx.restore();return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},image};
})();
