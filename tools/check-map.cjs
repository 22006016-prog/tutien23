/* Browser verification and actual in-game PNGs. CHROMIUM_PATH may select a local browser. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'};
(async()=>{
 const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==url){external.push(route.request().url());route.abort();}else route.continue();});
  await page.addInitScript(()=>{if(!localStorage.getItem('tutien-v1'))localStorage.setItem('tutien-v1',JSON.stringify({version:6,x:1500,y:1250,visited:['Dược đường']}));});
  await page.goto(url);await page.waitForFunction(()=>Scenery.ready);await page.waitForTimeout(150);
  assert.deepEqual(await page.evaluate(()=>({x:player.x,y:player.y,name:V.name,visited:[...visited]})),{x:1044,y:711,name:'Thôn Khởi Nguyên',visited:['Dược đường']});
  assert.equal(await page.evaluate(()=>Scenery.image.naturalWidth),1536);
  assert.equal(await page.evaluate(()=>Scenery.image.naturalHeight),1024);
  assert.equal(await page.evaluate(()=>Scenery.lastError),'');
  await page.screenshot({path:path.join(root,'assets/images/thon-khoi-nguyen-gameplay.png')});
  await page.keyboard.down('d');await page.waitForTimeout(350);await page.keyboard.up('d');assert.ok(await page.evaluate(()=>player.x>V.spawn.x+15));
  await page.click('#map-peek');assert.equal(await page.locator('#map-overview').isVisible(),true);const at=await page.evaluate(()=>player.x);await page.keyboard.down('d');await page.waitForTimeout(200);await page.keyboard.up('d');assert.equal(await page.evaluate(()=>player.x),at);
  assert.equal(await page.evaluate(()=>document.querySelector('#overview-art').src===Scenery.image.src),true);
  assert.equal(await page.evaluate(()=>document.querySelector('#overview-art').dataset.mapVersion),'7');
  await page.keyboard.press('Escape');assert.equal(await page.locator('#map-overview').isVisible(),false);
  await page.click('#menu-toggle');await page.click('#return-spawn');assert.deepEqual(await page.evaluate(()=>({x:player.x,y:player.y})),{x:1044,y:711});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tutien-v1')).version),7);
  await page.click('#map-peek');await page.screenshot({path:path.join(root,'assets/images/thon-khoi-nguyen-overview.png')});
  await page.keyboard.press('Escape');await page.evaluate(()=>save());await page.reload();await page.waitForFunction(()=>Scenery.ready);assert.deepEqual(await page.evaluate(()=>({x:player.x,y:player.y})),{x:1044,y:711});
  const mobile=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true}),phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));await phone.goto(url);await phone.waitForFunction(()=>Scenery.ready);
  const stick=await phone.locator('#joystick').boundingBox();assert.ok(stick);const cdp=await mobile.newCDPSession(phone),tx=stick.x+stick.width/2,ty=stick.y+stick.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx+25,y:ty}]});await phone.waitForTimeout(350);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await phone.evaluate(()=>player.x>V.spawn.x+10));
  await phone.screenshot({path:path.join(root,'assets/images/thon-khoi-nguyen-mobile.png')});await phone.locator('#map-peek').tap();await phone.screenshot({path:path.join(root,'assets/images/thon-khoi-nguyen-mobile-overview.png')});
  assert.ok(await phone.evaluate(()=>{const r=document.querySelector('.overview-card').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;}));
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);await mobile.close();console.log('PASS: artwork + spawn migration + movement + overview pause/parity + respawn/save + mobile touch/layout; 4 PNGs saved.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
