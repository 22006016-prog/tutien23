/* Original illustrated village artwork, generated for this project from the reference.
   Navigation data in world.js follows the paths of this exact image. */
const Scenery=(()=>{
 const image=new Image();image.src='assets/thon-khoi-nguyen.png';
 let ready=false,failed=false;
 const loaded=new Promise(resolve=>{image.onload=()=>{ready=true;resolve(true);};image.onerror=()=>{failed=true;resolve(false);};});
 function ground(){if(ready){ctx.drawImage(image,0,0,V.W,V.H);return;}ctx.fillStyle='#243d34';ctx.fillRect(0,0,V.W,V.H);ctx.fillStyle='#dac899';ctx.textAlign='center';ctx.font='14px sans-serif';ctx.fillText(failed?'Không tải được bản đồ. Hãy tải lại trang.':'Đang mở Thôn Khởi Nguyên…',V.spawn.x,V.spawn.y);}
 return {ground,loaded,get ready(){return ready;},image};
})();
