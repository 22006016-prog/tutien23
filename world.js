/* Navigation is authored against assets/thon-khoi-nguyen.png (1536 × 1024).
   Corridors follow the painted paths; buildings and scenery remain solid. */
(function(root){
 const TILE=32,W=1536,H=1024,name='Thôn Khởi Nguyên',version=5;
 const spawn={x:696,y:482},elder={x:650,y:240};
 const buildings=[{x:460,y:20,w:460,h:176,name:'Nhà trưởng thôn'},{x:151,y:341,w:217,h:149,name:'Dược đường'},{x:944,y:287,w:215,h:148,name:'Tiệm rèn'},{x:347,y:609,w:220,h:151,name:'Khách điếm'},{x:853,y:651,w:153,h:128,name:'Nhà dân'}];
 const routes=[
  {r:25,p:[[760,520],[798,550],[850,558],[912,514]]},
  {r:35,p:[[670,205],[665,260],[666,330],[630,385],[609,432],[598,490],[632,546],[692,567],[752,541],[785,487],[763,425],[728,389],[670,367],[630,385]]},
  {r:29,p:[[630,387],[560,401],[492,380],[425,346],[340,326],[299,281],[269,218],[232,170],[226,99],[210,33]]},
  {r:30,p:[[598,490],[533,486],[492,532],[424,567],[354,581],[308,552],[282,513],[269,481]]},
  {r:26,p:[[425,346],[439,395],[475,433],[511,445],[533,486]]},
  {r:29,p:[[780,448],[831,409],[886,372],[942,338],[973,281],[995,215],[1014,157],[1030,119],[1006,61]]},
  {r:24,p:[[995,215],[1061,191],[1134,184],[1217,189],[1303,189],[1357,189]]},
  {r:31,p:[[785,487],[856,494],[912,514],[989,519],[1069,514],[1141,504],[1221,502],[1289,500],[1326,487],[1371,481],[1424,488],[1474,507],[1504,513]]},
  {r:29,p:[[1093,440],[1098,455],[1105,493],[1141,504]]},
  {r:29,p:[[692,567],[703,607],[736,645],[710,703],[695,753],[714,800],[708,844],[697,897],[695,948],[677,990]]},
  {r:28,p:[[632,546],[646,582],[667,626],[666,683],[650,738],[629,754],[581,793],[534,810],[475,790],[452,766]]},
  {r:27,p:[[714,800],[775,792],[815,769],[817,704],[802,657],[810,596],[785,543]]},
  {r:25,p:[[815,769],[853,792],[907,797],[947,784]]},
  {r:24,p:[[354,581],[318,613],[269,630],[230,670],[241,722],[284,759],[326,781],[377,805],[428,808],[475,790]]},
  {r:22,p:[[1069,514],[1050,550],[1008,557],[960,556],[902,550]]},
 ];
 const clearings=[{x:696,y:482,rx:94,ry:75},{x:697,y:890,rx:45,ry:65},{x:1100,y:458,rx:49,ry:31},{x:279,y:514,rx:47,ry:28},{x:454,y:771,rx:45,ry:25},{x:946,y:787,rx:44,ry:25}];
 const solids=[{x:648,y:402,w:92,h:40},{x:631,y:509,w:26,h:24},{x:729,y:511,w:30,h:20},{x:830,y:469,w:45,h:59},{x:1050,y:344,w:42,h:64}];
 const places=[{x:666,y:232,name:'Nhà trưởng thôn'},{x:300,y:521,name:'Dược đường'},{x:1100,y:459,name:'Tiệm rèn'},{x:662,y:622,name:'Cổ thụ đầu thôn'}];
 function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;const t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
 function onBridge(x,y){return x>=1280&&x<=1510&&Math.abs(y-(481+Math.abs(x-1371)*.22))<25;}
 function blocked(x,y){if(!Number.isFinite(x)||!Number.isFinite(y)||x<16||y<16||x>W-16||y>H-16)return true;if(solids.some(s=>x>s.x-5&&x<s.x+s.w+5&&y>s.y-5&&y<s.y+s.h+5))return true;if(buildings.some(b=>x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h))return true;const open=clearings.some(p=>((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2<1)||routes.some(route=>route.p.some((point,i)=>i>0&&segmentDistance(x,y,route.p[i-1],point)<route.r));return !open;}
 const api={TILE,W,H,name,version,spawn,elder,buildings,solids,places,routes,clearings,onBridge,blocked,segmentDistance};root.Village=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
