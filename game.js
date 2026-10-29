'use strict';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),V=Village;
let width=960,height=540,scale=1,clock=0,last=0,walking=false,facing=1,saveTime=0,toastTime=5,dialogOpen=false;
const player={...V.spawn},visited=new Set(),keys=new Set(),joy={x:0,y:0};let storage=true;
try{const s=JSON.parse(localStorage.getItem('tutien-v1'));if(s){if(s.version===V.version&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&!V.blocked(s.x,s.y)){player.x=s.x;player.y=s.y;}if(Array.isArray(s.visited))s.visited.filter(n=>V.places.some(p=>p.name===n)).forEach(n=>visited.add(n));}}catch{storage=false;}
const $=s=>document.querySelector(s);
let cameraZoom=1;
try{const savedZoom=Number(localStorage.getItem('tutien-camera-zoom-b10'));if(Number.isFinite(savedZoom)&&savedZoom>=.85&&savedZoom<=1.65)cameraZoom=savedZoom;}catch{}
function resize(){const frame=canvas.parentElement,dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,frame.clientWidth),h=Math.max(1,frame.clientHeight);width=Math.ceil(w*dpr);height=Math.ceil(h*dpr);canvas.width=width;canvas.height=height;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.imageSmoothingEnabled=false;scale=dpr*cameraZoom;}
new ResizeObserver(resize).observe(canvas.parentElement);
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function text(t,x,y,c='#f0e7bf',size=7){ctx.font=`${size}px monospace`;ctx.textAlign='center';ctx.fillStyle='#203c2b';ctx.fillText(t,x+1,y+1);ctx.fillStyle=c;ctx.fillText(t,x,y);}
function character(x,y,npc=false){const frame=walking&&!npc?(Math.floor(clock*9)%3):0;const direction=facing===0?'up':facing===2?'left':facing===3?'right':'down';const sprite=npc?PixelTiles.sprites.elder:PixelTiles.sprites['hero-'+direction+'-'+frame];rect(x-8,y-1,16,3,'#213d3655');ctx.drawImage(sprite,Math.round(x-16),Math.round(y-30));if(npc)text('Trưởng thôn',x,y-39,'#e5d6a5',7);}

function render(){ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(scale,scale);const vw=width/scale,vh=height/scale;const cx=Math.max(0,Math.min(Math.max(0,V.W-vw),player.x-vw/2)),cy=Math.max(0,Math.min(Math.max(0,V.H-vh),player.y-vh/2));ctx.translate(-Math.round(cx),-Math.round(cy));Scenery.ground();if(Scenery.ready){Wildlife.draw(ctx);const people=[{...V.elder,npc:true},{...player,npc:false}].sort((a,b)=>a.y-b.y);for(const person of people){character(person.x,person.y,person.npc);if(!person.npc)text('Vô Danh',player.x,player.y-39,'#fff0c9',7);}drawEffect();for(let i=0;i<22;i++){const x=(i*137+clock*5)%V.W,y=(i*211+Math.sin(clock*.7+i)*9)%V.H;rect(x,y,1,1,'#f3d4c699');}}ctx.restore();}

function toast(s){$('#toast').textContent=s;toastTime=4;$('#toast').style.opacity=1;}
function save(){try{localStorage.setItem('tutien-v1',JSON.stringify({...player,version:V.version,visited:[...visited]}));}catch{storage=false;}$('#save-state').textContent=storage?'◈ Đã lưu hành trình trên thiết bị':'◈ Không thể lưu trên trình duyệt này';}
function update(dt){clock+=dt;if(Scenery.ready&&!dialogOpen&&$('#map-overview').hidden)Wildlife.update(dt,player);let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'))+joy.x,dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))+joy.y;let len=Math.hypot(dx,dy);walking=len>.1&&!dialogOpen&&Scenery.ready&&$('#map-overview').hidden;if(walking){meditating=false;if(len>1){dx/=len;dy/=len;}let speed=(keys.has('shift')?155:95)*dt;if(Math.abs(dx)>Math.abs(dy))facing=dx<0?2:3;else if(dy<0)facing=0;else if(dy>0)facing=1;if(!V.blocked(player.x+dx*speed,player.y))player.x+=dx*speed;if(!V.blocked(player.x,player.y+dy*speed))player.y+=dy*speed;}
for(const p of V.places)if(Math.hypot(player.x-p.x,player.y-p.y)<85&&!visited.has(p.name)){visited.add(p.name);toast(visited.size===4?'✧ Hoàn thành: Bước chân đầu tiên!':'Đã khám phá: '+p.name);save();}
$('#progress').textContent=`Địa điểm đã ghé: ${visited.size} / 4`;$('#interact').hidden=dialogOpen||Math.hypot(player.x-V.elder.x,player.y-V.elder.y)>65;
toastTime-=dt;if(toastTime<0)$('#toast').style.opacity=0;saveTime+=dt;if(saveTime>3){save();saveTime=0;}}
function loop(t){const dt=Math.min((t-last)/1000||0,.035);last=t;update(dt);render();requestAnimationFrame(loop);}requestAnimationFrame(loop);
function interact(){if(dialogOpen){dialogOpen=false;$('#dialog').hidden=true;return;}if(Math.hypot(player.x-V.elder.x,player.y-V.elder.y)>65)return;dialogOpen=true;$('#dialog p').textContent='Thiếu hiệp mới đến sao? Đây là Thôn Khởi Nguyên. Hãy ghé dược đường phía tây, tiệm rèn phía đông và cây cổ thụ ở phía nam. Tiên lộ còn dài, cứ thong thả bước đi.';$('#dialog').hidden=false;}
window.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(!e.repeat&&(e.key.toLowerCase()==='e'||e.key==='Enter'))interact();});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();joy.x=joy.y=0;});document.addEventListener('visibilitychange',()=>{keys.clear();joy.x=joy.y=0;save();});
$('#interact').onclick=interact;$('#close-dialog').onclick=interact;$('#quest-toggle').onclick=()=>{const collapsed=$('.quest').classList.toggle('collapsed');$('#quest-toggle').textContent=collapsed?'+':'−';$('#quest-toggle').setAttribute('aria-label',collapsed?'Mở nhiệm vụ':'Thu gọn nhiệm vụ');};
let pointer=null;function moveStick(e){const r=$('#joystick').getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,len=Math.hypot(x,y),m=Math.min(1,34/(len||1));x*=m;y*=m;joy.x=x/34;joy.y=y/34;$('#stick').style.transform=`translate(${x}px,${y}px)`;}
$('#joystick').addEventListener('pointerdown',e=>{if(pointer!==null)return;pointer=e.pointerId;e.currentTarget.setPointerCapture(pointer);moveStick(e);});$('#joystick').addEventListener('pointermove',e=>{if(e.pointerId===pointer)moveStick(e);});function release(e){if(e.pointerId!==pointer)return;pointer=null;joy.x=joy.y=0;$('#stick').style.transform='';}for(const name of ['pointerup','pointercancel','lostpointercapture'])$('#joystick').addEventListener(name,release);
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('.game-frame').requestFullscreen)await $('.game-frame').requestFullscreen();else toast('Trình duyệt này không hỗ trợ toàn màn hình');}catch{toast('Không thể mở toàn màn hình trên trình duyệt này');}};
let audio=null,soundOn=false,timer=null;$('#sound').onclick=async()=>{try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();soundOn=!soundOn;if(soundOn){let i=0;const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66];const play=()=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=notes[i++%notes.length];gain.gain.setValueAtTime(0,audio.currentTime);gain.gain.linearRampToValueAtTime(.035,audio.currentTime+.05);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+1.2);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+1.3);};play();timer=setInterval(play,1100);}else{clearInterval(timer);await audio.suspend();}$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound span').textContent=`Âm thanh: ${soundOn?'bật':'tắt'}`;}catch{toast('Trình duyệt này không hỗ trợ âm thanh');}};
window.addEventListener('pagehide',save);

let effect=null,meditating=false;
const skillNames=['Kiếm khí','Thanh phong','Băng trụ','Lôi quang','Ảnh bộ','Hỏa liên'];
function cast(index){if(dialogOpen||!Scenery.ready||!$('#map-overview').hidden)return;meditating=false;effect={index,start:clock};const buttons=document.querySelectorAll('[data-skill]');buttons.forEach(b=>b.classList.toggle('active',Number(b.dataset.skill)===index));setTimeout(()=>buttons.forEach(b=>b.classList.remove('active')),700);}
function drawEffect(){if(meditating){const pulse=24+Math.sin(clock*2)*4;ellipse(player.x,player.y+2,pulse,pulse*.4,'#a8dddc33');ctx.strokeStyle='#d5d7a2';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(player.x,player.y+2,pulse,pulse*.4,0,0,Math.PI*2);ctx.stroke();}if(!effect)return;const t=clock-effect.start;if(t>0.7){effect=null;return;}const colors=['#cef4ff','#91efc7','#95bbff','#ffe7a4','#c9a4f6','#ffa16e'];ctx.save();ctx.globalAlpha=1-t/.7;ctx.strokeStyle=colors[effect.index];ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(player.x,player.y-15,15+t*65,10+t*35,-t*3,0,Math.PI*1.7);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4+t*4;rect(player.x+Math.cos(a)*(18+t*50),player.y-15+Math.sin(a)*(18+t*35),3,6,colors[effect.index]);}ctx.restore();}
document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>cast(Number(b.dataset.skill)));
$('#menu-toggle').onclick=()=>{const open=$('#menu').hidden;$('#menu').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));};
$('#skills-toggle').onclick=()=>toast('Phím 1–6: hiệu ứng kỹ năng · Chiến đấu sẽ được bổ sung sau');
function meditate(){meditating=!meditating;toast(meditating?'Đả tọa — tĩnh tâm giữa Thôn Khởi Nguyên':'Đã kết thúc đả tọa');}
$('#cultivate').onclick=meditate;$('#meditate').onclick=meditate;
$('#help').onclick=()=>{ $('#menu').hidden=false;$('#menu-toggle').setAttribute('aria-expanded','true');};
$('#attack').onclick=()=>{if(!$('#interact').hidden||dialogOpen)interact();else cast(0);};
window.addEventListener('keydown',e=>{if(e.repeat||e.target instanceof HTMLButtonElement||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;if(/^[1-6]$/.test(e.key))cast(Number(e.key)-1);if(e.code==='Space')$('#attack').click();if(e.key.toLowerCase()==='t')meditate();if(e.key==='Escape'&&!$('#menu').hidden)$('#menu-toggle').click();});

function respawn(){player.x=V.spawn.x;player.y=V.spawn.y;keys.clear();joy.x=joy.y=0;meditating=false;effect=null;dialogOpen=false;$('#dialog').hidden=true;save();toast('Đã trở về Linh Thạch — điểm khởi đầu / hồi sinh');}
$('#return-spawn').onclick=()=>{respawn();$('#menu').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');};

function syncEditedOverview(){
 const edited=Scenery.image;
 if(edited&&edited.src)$('#overview-art').src=edited.src;
 $('#overview-art').dataset.mapEdited=Scenery.editFinished&&edited.src!== 'assets/thon-khoi-nguyen.png'?'yes':'no';
}
function toggleMap(open){if(open)syncEditedOverview();$('#map-overview').hidden=!open;keys.clear();joy.x=joy.y=0;walking=false;$('#menu').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');$('#map-marker').style.left=(player.x/V.W*100)+'%';$('#map-marker').style.top=(player.y/V.H*100)+'%';if(open)$('#close-map').focus();else canvas.focus();}
$('#overview-art').src=Scenery.image.src;
$('#map-peek').onclick=()=>toggleMap(true);$('#open-map').onclick=()=>toggleMap(true);$('#close-map').onclick=()=>toggleMap(false);
$('#map-overview').onclick=e=>{if(e.target===$('#map-overview'))toggleMap(false);};
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#map-overview').hidden){e.preventDefault();toggleMap(false);}});
Scenery.loaded.then(ok=>{if(ok)syncEditedOverview();else toast('Không tải được ảnh map — hãy tải lại trang');});
Scenery.edited.then(result=>{
 syncEditedOverview();
 if(!result.ok)toast('Ảnh map gốc vẫn chơi được; phần sửa cảnh gặp lỗi.');
});

function updateBrightnessControl(){const value=Scenery.brightness;$('#brightness').value=value;$('#brightness-value').textContent=value+'%';$('#overview-art').style.filter=`brightness(${value}%) saturate(97%) contrast(106%)`;}
$('#brightness').addEventListener('input',e=>{keys.clear();Scenery.setBrightness(e.target.value);updateBrightnessControl();});
updateBrightnessControl();

const cameraInput=$('#camera-zoom');
cameraInput.value=Math.round(cameraZoom*100);
$('#camera-zoom-value').textContent=Math.round(cameraZoom*100)+'%';
cameraInput.addEventListener('input',e=>{const value=Number(e.target.value);if(!Number.isFinite(value))return;cameraZoom=Math.max(.85,Math.min(1.65,value/100));$('#camera-zoom-value').textContent=Math.round(cameraZoom*100)+'%';try{localStorage.setItem('tutien-camera-zoom-b10',String(cameraZoom));}catch{}resize();});
