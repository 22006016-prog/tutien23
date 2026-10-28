/* Coordinates are authored against the bundled 1536×1024 artwork, then
   expanded 1.5× into a 2304×1536 playable world. Road widths follow the new art. */
(function(root){
 const TILE=32,SCALE=1.5,W=2304,H=1536,name='Thôn Khởi Nguyên',version=6;
 const point=([x,y])=>[x*SCALE,y*SCALE];
 const position=(x,y)=>({x:x*SCALE,y:y*SCALE});
 const spawn=position(696,474),elder=position(680,269);
 const buildings=[{x:505,y:47,w:365,h:181,name:'Nhà trưởng thôn'},{x:169,y:365,w:215,h:126,name:'Dược đường'},{x:967,y:329,w:216,h:164,name:'Tiệm rèn'},{x:346,y:610,w:222,h:145,name:'Khách điếm'},{x:856,y:650,w:147,h:111,name:'Nhà dân'},{x:212,y:50,w:108,h:70,name:'Nhà ven ruộng'},{x:1034,y:53,w:126,h:80,name:'Nhà sườn núi'}].map(b=>({...b,x:b.x*SCALE,y:b.y*SCALE,w:b.w*SCALE,h:b.h*SCALE}));
 const routes=[
  {r:63,p:[[680,242],[679,296],[679,352],[690,414],[696,474],[700,544],[704,614],[702,683],[704,750],[700,811],[699,880],[707,947],[738,1000]]},
  {r:57,p:[[675,370],[587,365],[521,335],[454,300],[392,280],[343,243],[304,203],[300,171],[349,142],[403,98],[412,49],[393,23]]},
  {r:43,p:[[300,171],[274,132],[273,111]]},
  {r:37,p:[[403,98],[449,130],[470,183],[471,242],[521,294],[587,337],[675,370]]},
  {r:55,p:[[696,474],[613,508],[552,541],[474,568],[396,591],[333,598],[270,583],[193,571],[121,575]]},
  {r:42,p:[[277,499],[299,532],[333,567],[396,591]]},
  {r:49,p:[[521,335],[485,379],[472,422],[500,465],[552,501],[613,508]]},
  {r:50,p:[[795,399],[861,365],[936,328],[1000,285],[1031,239],[1017,200],[985,152],[966,105],[944,49],[928,20]]},
  {r:40,p:[[1017,200],[1060,168],[1103,145],[1110,134]]},
  {r:39,p:[[1031,239],[1113,230],[1191,231],[1261,232],[1324,233],[1398,233]]},
  {r:62,p:[[696,474],[785,474],[811,541],[884,562],[968,562],[1050,557],[1130,544],[1207,515],[1281,493],[1326,479],[1376,475],[1430,485],[1480,511],[1515,527]]},
  {r:43,p:[[1100,503],[1099,538],[1130,544]]},
  {r:45,p:[[704,614],[661,659],[652,711],[613,758],[553,786],[492,786],[470,764]]},
  {r:42,p:[[704,750],[765,782],[824,800],[887,798],[950,779],[951,768]]},
  {r:36,p:[[1050,557],[1093,593],[1137,642],[1159,696],[1142,745],[1085,788],[1021,806],[950,779]]},
  {r:40,p:[[1085,788],[1146,825],[1140,888],[1081,922],[1019,968],[1000,1000]]},
  {r:33,p:[[333,598],[289,623],[234,651],[208,690],[239,727],[293,766],[348,791],[420,804],[492,786]]},
  {r:34,p:[[392,280],[330,298],[257,318],[194,332],[130,330]]},
 ].map(r=>({r:r.r*SCALE,p:r.p.map(point)}));
 // Short, painted footpaths from each house porch to the existing village streets.
 // Points and widths below are in the original 1536x1024 illustration coordinates.
 const doorwaySpecs=[
  // Paths stop at each porch; house interiors stay solid. The narrow gate marks the fence opening.
  {name:'Nhà trưởng thôn',entry:[680,235],r:12,p:[[680,232],[680,258],[680,286]]},
  {name:'Dược đường',entry:[300,504],r:11,gate:[300,519],p:[[300,497],[301,519],[302,540]]},
  {name:'Tiệm rèn',entry:[1100,510],r:11,gate:[1100,497],p:[[1100,498],[1100,525],[1100,554]]},
  {name:'Khách điếm',entry:[475,767],r:12,gate:[475,770],p:[[475,758],[478,778],[493,791]]},
  {name:'Nhà dân',entry:[951,773],r:12,gate:[951,781],p:[[947,765],[949,785],[952,801]]},
  {name:'Nhà ven ruộng',entry:[274,136],r:10,p:[[274,125],[274,147],[274,171]]},
  {name:'Nhà sườn núi',entry:[1103,150],r:10,p:[[1103,137],[1103,151],[1103,170]]}
 ];
 const doorPaths=doorwaySpecs.map(d=>({name:d.name,entry:position(...d.entry),gate:d.gate?position(...d.gate):null,r:d.r*SCALE,p:d.p.map(point)}));
 const clearings=[{x:696,y:474,rx:157,ry:124},{x:700,y:879,rx:66,ry:58},{x:1100,y:515,rx:62,ry:29},{x:280,y:520,rx:54,ry:29},{x:470,y:773,rx:53,ry:23},{x:951,y:780,rx:49,ry:22},{x:1135,y:861,rx:85,ry:53},{x:130,y:329,rx:74,ry:35}].map(p=>({x:p.x*SCALE,y:p.y*SCALE,rx:p.rx*SCALE,ry:p.ry*SCALE}));
 const solids=[{x:851,y:469,w:42,h:58},{x:632,y:394,w:14,h:37},{x:746,y:394,w:14,h:37},{x:630,y:507,w:18,h:25},{x:747,y:510,w:18,h:25},{x:1163,y:837,w:57,h:61}].map(b=>({x:b.x*SCALE,y:b.y*SCALE,w:b.w*SCALE,h:b.h*SCALE}));
 const places=[{x:680,y:269,name:'Nhà trưởng thôn'},{x:300,y:532,name:'Dược đường'},{x:1100,y:522,name:'Tiệm rèn'},{x:652,y:659,name:'Cổ thụ đầu thôn'}].map(p=>({...position(p.x,p.y),name:p.name}));
 const landmarks={gate:position(699,880),bridge:position(1475,510),northwest:position(274,132),northeast:position(1103,145),meadow:position(1135,861)};
 function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;const t=d?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
 function onBridge(x,y){x/=SCALE;y/=SCALE;return x>=1280&&x<=1518&&Math.abs(y-(475+Math.abs(x-1376)*.35))<38;}
 function blocked(x,y){if(!Number.isFinite(x)||!Number.isFinite(y)||x<16||y<16||x>W-16||y>H-16)return true;if(solids.some(s=>x>s.x-5&&x<s.x+s.w+5&&y>s.y-5&&y<s.y+s.h+5))return true;if(buildings.some(b=>x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h))return true;return !(clearings.some(p=>((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2<1)||routes.some(route=>route.p.some((point,i)=>i>0&&segmentDistance(x,y,route.p[i-1],point)<route.r))||doorPaths.some(route=>route.p.some((point,i)=>i>0&&segmentDistance(x,y,route.p[i-1],point)<route.r)));}
 const api={TILE,SCALE,W,H,name,version,spawn,elder,buildings,solids,places,routes,doorPaths,clearings,landmarks,onBridge,blocked,segmentDistance};root.Village=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
