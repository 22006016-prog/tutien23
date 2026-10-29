/* One local, authored scene for both gameplay and the overview.
   Keep the supplied village layout intact; do not paint over houses or fences. */
const Scenery=(()=>{
 const image=new Image(),layer=document.createElement('canvas');
 let ready=false,failed=false,brightness=92,lastError='';
 try{const saved=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(saved)&&saved>=60&&saved<=110)brightness=saved;}catch{}
 function rebuild(){
  if(!image.naturalWidth)return;
  layer.width=V.W;layer.height=V.H;
  const paint=layer.getContext('2d');
  paint.imageSmoothingEnabled=true;paint.imageSmoothingQuality='high';
  paint.filter=`brightness(${brightness}%) saturate(101%) contrast(104%)`;
  paint.drawImage(image,0,0,V.W,V.H);paint.filter='none';
 }
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{
  image.onload=()=>{try{rebuild();ready=true;resolve(true);}catch(error){lastError=error.message;failed=true;resolve(false);}};
  image.onerror=()=>{lastError='Không tải được artwork Thôn Khởi Nguyên';failed=true;resolve(false);};
 });
 image.src='assets/images/thon-khoi-nguyen.png';
 function ground(){
  if(ready){ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(layer,0,0);ctx.restore();return;}
  ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';
  ctx.fillText(failed?'Không tải được ảnh nền — hãy tải lại trang.':`Đang mở ${V.name}…`,V.spawn.x,V.spawn.y);
 }
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},get image(){return image;},get lastError(){return lastError;}};
})();
