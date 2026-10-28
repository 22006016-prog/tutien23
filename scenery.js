/* Bundled village artwork. Navigation in world.js follows this exact scene.
   Colour correction is cached, so adjusting eye comfort costs no per-frame filter. */
const Scenery=(()=>{
 const image=new Image(),layer=document.createElement('canvas');
 let ready=false,failed=false,brightness=92;
 try{const saved=Number(localStorage.getItem('tutien-brightness'));if(Number.isFinite(saved)&&saved>=60&&saved<=110)brightness=saved;}catch{}
 function rebuild(){if(!image.naturalWidth)return;layer.width=image.naturalWidth;layer.height=image.naturalHeight;const paint=layer.getContext('2d');paint.imageSmoothingEnabled=false;paint.filter=`brightness(${brightness}%) saturate(95%)`;paint.drawImage(image,0,0);}
 function setBrightness(value){const number=Number(value);if(!Number.isFinite(number))return;brightness=Math.max(60,Math.min(110,Math.round(number)));rebuild();try{localStorage.setItem('tutien-brightness',String(brightness));}catch{}}
 const loaded=new Promise(resolve=>{image.onload=()=>{rebuild();ready=true;resolve(true);};image.onerror=()=>{failed=true;resolve(false);};});
 image.src='assets/thon-khoi-nguyen.png';
 function ground(){if(ready){ctx.drawImage(layer,0,0,V.W,V.H);return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,setBrightness,get brightness(){return brightness;},get ready(){return ready;},image};
})();
