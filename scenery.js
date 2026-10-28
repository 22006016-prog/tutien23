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
   const source=new Uint8ClampedArray(pixels.data),dest=pixels.data,w=sharpLayer.width,h=sharpLayer.height,a=.19;
   for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const i=(y*w+x)*4;
    for(let c=0;c<3;c++)dest[i+c]=Math.max(0,Math.min(255,source[i+c]*(1+4*a)-a*(source[i+c-4]+source[i+c+4]+source[i+c-w*4]+source[i+c+w*4])));
   }
   sc.putImageData(pixels,0,0);
  }catch(err){ /* Keep the original image if image pixels are unavailable. */ }
  sharpReady=true;
 }
 // Paint textured, narrow entrance paths above existing scenery; source artwork stays untouched.
 function paintEntrances(paint){
  if(!V.doorPaths||!V.doorPaths.length)return;
  const patch=document.createElement('canvas');patch.width=64;patch.height=64;
  const patchCtx=patch.getContext('2d');patchCtx.drawImage(image,662,549,64,64,0,0,64,64);
  const dirtPattern=paint.createPattern(patch,'repeat');
  for(const door of V.doorPaths){
   const pts=door.p.map(q=>[q[0]/V.SCALE,q[1]/V.SCALE]),thickness=2*door.r/V.SCALE;
   const trace=()=>{paint.beginPath();paint.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))paint.lineTo(p[0],p[1]);};
   paint.save();paint.lineCap='round';paint.lineJoin='round';
   paint.globalAlpha=.55;paint.strokeStyle='#6e5d43';paint.lineWidth=thickness+8;trace();paint.stroke();
   paint.globalAlpha=.94;paint.strokeStyle=dirtPattern||'#b39a69';paint.lineWidth=thickness;trace();paint.stroke();
   // Rough cobbled edge visually joins the doorstep with the existing road.
   paint.globalAlpha=.67;paint.fillStyle='#ab9872';
   const x=door.entry.x/V.SCALE,y=door.entry.y/V.SCALE;
   for(const side of [-1,1]){
    paint.fillRect(Math.round(x+side*(thickness/2+1)),Math.round(y-5),5,7);
    paint.fillRect(Math.round(x+side*(thickness/2+3)),Math.round(y+6),3,3);
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
 function ground(){if(ready){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(layer,0,0,V.W,V.H);ctx.restore();return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},image};
})();
