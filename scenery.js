/* Bundled village artwork. Navigation in world.js follows this exact scene.
   Colour correction is cached, so adjusting eye comfort costs no per-frame filter. */
const Scenery=(()=>{
 const image=new Image(),layer=document.createElement('canvas'),sharpLayer=document.createElement('canvas');
 let sharpReady=false;
 let ready=false,failed=false,brightness=92;
 try{const saved=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(saved)&&saved>=60&&saved<=110)brightness=saved;}catch{}
 // Build the map ONCE at the real playable-world resolution.
 // The old pipeline sharpened 1536x1024 pixels, then enlarged them 1.5x
 // every frame; that made tiny roofs, fences and paving details look soft.
 function prepareSharpArt(){
  if(sharpReady||!image.naturalWidth)return;
  const source=document.createElement('canvas');
  source.width=image.naturalWidth;source.height=image.naturalHeight;
  const art=source.getContext('2d',{willReadFrequently:true});
  art.drawImage(image,0,0);
  clearResidentFence(art); // retain the open resident NPC courtyard
  paintEntrances(art);     // retain the small gates at other houses

  sharpLayer.width=V.W;sharpLayer.height=V.H;
  const output=sharpLayer.getContext('2d',{willReadFrequently:true});
  output.imageSmoothingEnabled=true;
  output.imageSmoothingQuality='high';
  output.drawImage(source,0,0,source.width,source.height,0,0,V.W,V.H);
  // Edge-adaptive sharpening at 2304x1536 (not at the smaller source
  // resolution). The threshold prevents amplification of flat-area noise.
  try{
   const pixels=output.getImageData(0,0,V.W,V.H);
   const data=pixels.data,original=new Uint8ClampedArray(data);
   const row=V.W*4;
   for(let y=1;y<V.H-1;y++){
    for(let x=1;x<V.W-1;x++){
     const i=y*row+x*4;
     for(let c=0;c<3;c++){
      const k=i+c,center=original[k];
      const neighbor=(original[k-4]+original[k+4]+original[k-row]+original[k+row])*.25;
      const diff=center-neighbor;
      if(Math.abs(diff)>3){
       const correction=Math.max(-31,Math.min(31,diff*1.45));
       data[k]=Math.max(0,Math.min(255,center+correction));
      }
     }
    }
   }
   output.putImageData(pixels,0,0);
  }catch(err){
   // Keep the high-resolution image if canvas pixel access is unsupported.
  }
  sharpReady=true;
 }
 // Remove the south-east residence's front fence by borrowing texture from
 // the illustrated yard (above it) and grassy clearing (below it). Unlike a
 // rectangular dirt overlay, this soft local repair keeps the original scene.
 // All sampling is performed once when the cached scenery is rebuilt.
 function clearResidentFence(paint){
  // Only the HORIZONTAL front fence of the south-east residence is removed.
  // The side fences, rear fence, roof, gardens and houses are not modified.
  // Coordinates are in the untouched 1536x1024 Map B illustration.
  const x0=834,y0=744,w=292,h=81;
  let pixels;
  try{pixels=paint.getImageData(x0,y0,w,h);}catch{return;}
  const original=new Uint8ClampedArray(pixels.data),result=pixels.data;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mirror=(v,span)=>{const n=((v%(span*2))+(span*2))%(span*2);return n<=span?n:span*2-n;};
  // A clean, unoccupied patch of grass just SOUTH of the front fence.
  // We reflect/mix its pixels instead of drawing a uniform beige shape.
  const sample=document.createElement('canvas');
  sample.width=68;sample.height=39;
  const sampleCtx=sample.getContext('2d',{willReadFrequently:true});
  sampleCtx.drawImage(image,998,822,68,39,0,0,68,39);
  const grass=sampleCtx.getImageData(0,0,68,39).data;
  for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
    const top=754+2.2*Math.sin(x/39)+Math.sin(x/13);
    const bottom=819+2*Math.sin(x/37);
    // Leave the two side fences and corner posts intact.
    const left=841+2*Math.sin(y/23),right=1117+3*Math.sin(y/22);
    const edge=Math.min(y-top,bottom-y,x-left,right-x);
    if(edge<=0)continue;
    const a=clamp(edge/8,0,1);
    const sx=clamp(Math.round(mirror((x-841)*.82+y*.09,66)),0,67);
    const sy=clamp(Math.round(mirror((y-top)*.6+x*.045,37)),0,38);
    const dst=((y-y0)*w+x-x0)*4,src=(sy*68+sx)*4;
    for(let c=0;c<3;c++)result[dst+c]=original[dst+c]*(1-a)+grass[src+c]*a;
  }
  paint.putImageData(pixels,x0,y0);
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
  // No additional 1.5x enlargement in the render loop: this cache is
  // precisely the same size as the game world (2304x1536).
  layer.width=V.W;layer.height=V.H;
  const paint=layer.getContext('2d');
  paint.imageSmoothingEnabled=false;
  paint.filter=`brightness(${brightness}%) saturate(101%) contrast(108%)`;
  paint.drawImage(sharpLayer,0,0);
  paint.filter='none';
 }
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{image.onload=()=>{rebuild();ready=true;resolve(true);};image.onerror=()=>{failed=true;resolve(false);};});
 image.src='assets/thon-khoi-nguyen.png';
 function ground(){if(ready){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(layer,0,0,V.W,V.H);ctx.restore();return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},image};
})();
