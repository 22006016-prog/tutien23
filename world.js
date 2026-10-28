/* Thon Khoi Nguyen v0.7: one shared geometry for scenery, paths and wildlife. */
(function(root){
'use strict';
const TILE=32,SCALE=1,W=2304,H=1536,name='Thôn Khởi Nguyên',version=7;
const spawn={x:1120,y:750},elder={x:1120,y:493};
const buildings=[
{x:980,y:230,w:280,h:194,name:'Nhà trưởng thôn',type:'hall'},
{x:315,y:300,w:270,h:162,name:'Dược đường',type:'healer'},
{x:1580,y:297,w:268,h:166,name:'Tiệm rèn',type:'forge'},
{x:335,y:910,w:260,h:158,name:'Khách điếm',type:'inn'},
{x:1575,y:905,w:268,h:160,name:'Nhà dân',type:'house'},
{x:95,y:170,w:204,h:124,name:'Nhà ven ruộng',type:'farm'},
{x:1842,y:180,w:188,h:126,name:'Nhà sườn núi',type:'house'}];
const routes=[
{r:111,p:[[1120,480],[1120,750],[1120,1040],[1120,1518]]},
{r:76,p:[[1120,14],[1120,140],[905,172],[835,295],[835,475],[1120,525]]},
{r:108,p:[[18,750],[280,750],[540,750],[770,750],[1120,750],[1460,750],[1760,750],[2070,750],[2286,750]]},
{r:83,p:[[1120,525],[890,525],[705,525],[475,525],[310,550]]},
{r:83,p:[[1120,525],[1400,525],[1692,525],[1920,540]]},
{r:82,p:[[1120,1050],[865,1050],[655,1095],[440,1095],[285,1140]]},
{r:82,p:[[1120,1050],[1390,1050],[1705,1095],[1950,1125]]},
{r:70,p:[[470,530],[545,655],[540,750],[530,895],[475,1095]]},
{r:70,p:[[1710,525],[1740,650],[1740,750],[1740,900],[1710,1095]]}];
const clearings=[
{x:1120,y:750,rx:242,ry:212},{x:1120,y:500,rx:168,ry:101},
{x:495,y:528,rx:161,ry:104},{x:1706,y:529,rx:161,ry:104},
{x:470,y:1094,rx:155,ry:114},{x:1700,y:1094,rx:154,ry:111},
{x:610,y:1260,rx:120,ry:92}];
const solids=[{x:1193,y:645,w:40,h:36,name:'Giếng làng'},{x:602,y:1221,w:28,h:27,name:'Cổ thụ'}];
const places=[{x:1120,y:489,name:'Nhà trưởng thôn'},{x:473,y:515,name:'Dược đường'},{x:1702,y:518,name:'Tiệm rèn'},{x:620,y:1169,name:'Cổ thụ đầu thôn'}];
const landmarks={gate:{x:1120,y:1463},bridge:{x:2200,y:750},northwest:{x:475,y:515},northeast:{x:1702,y:518},meadow:{x:610,y:1260},northGate:{x:1120,y:70},westGate:{x:68,y:750},eastGate:{x:2240,y:750}};
const riverEdge=y=>2088+Math.sin(y/173)*28+Math.sin(y/61)*8;
const bridge={x:1980,y:680,w:324,h:144};
function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function onBridge(x,y){return x>=bridge.x&&x<=bridge.x+bridge.w&&y>=bridge.y&&y<=bridge.y+bridge.h;}
function inFootpath(x,y){return clearings.some(c=>((x-c.x)/c.rx)**2+((y-c.y)/c.ry)**2<1)||routes.some(r=>r.p.some((p,i)=>i>0&&segmentDistance(x,y,r.p[i-1],p)<r.r));}
function blocked(x,y){
if(!Number.isFinite(x)||!Number.isFinite(y)||x<16||y<16||x>W-16||y>H-16)return true;
if(x>riverEdge(y)&&!onBridge(x,y))return true;
if(buildings.some(b=>x>b.x-7&&x<b.x+b.w+7&&y>b.y-7&&y<b.y+b.h+7))return true;
if(solids.some(s=>x>s.x-8&&x<s.x+s.w+8&&y>s.y-8&&y<s.y+s.h+8))return true;
return !inFootpath(x,y);
}
const api={TILE,SCALE,W,H,name,version,spawn,elder,buildings,routes,clearings,solids,places,landmarks,bridge,riverEdge,onBridge,inFootpath,blocked,segmentDistance};
root.Village=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
