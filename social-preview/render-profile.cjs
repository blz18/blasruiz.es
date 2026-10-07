/* Cabecera LinkedIn 1584 × 396. Ejecutar con playwright y sharp en NODE_PATH. */
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const sharp = require('sharp');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'landing-b2b.html'),'utf8');
const icons = [...source.matchAll(/<button class="postit"[\s\S]*?(<svg[\s\S]*?<\/svg>)[\s\S]*?<\/button>/g)].map(x=>x[1]);
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Onest:wght@400;500&family=DM+Mono&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#f1f1f0;color:#333}
.banner{width:1584px;height:396px;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(#33333306 1px,transparent 1px),linear-gradient(90deg,#33333306 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(90deg,#000,transparent 24%,transparent 68%,#000)}
.brand{position:absolute;left:66px;top:40px;font:500 24px Outfit,sans-serif;letter-spacing:-.7px}
.eyebrow{position:absolute;left:380px;top:71px;font:12px 'DM Mono',monospace;letter-spacing:2px;color:#777}
.eyebrow:before{content:'';display:inline-block;background:#ff8666;width:8px;height:8px;border-radius:50%;margin-right:12px}
h1{position:absolute;left:380px;top:108px;margin:0;font:500 58px/1.07 Outfit,sans-serif;letter-spacing:-2px}
.sub{position:absolute;left:382px;top:261px;font:400 21px Onest,sans-serif;color:#666}
.url{position:absolute;left:382px;top:316px;font:13px 'DM Mono',monospace;letter-spacing:.5px;color:#888}
.wall{position:absolute;left:1135px;top:44px;width:360px;height:315px;transform:perspective(1000px) rotateY(-16deg) rotateX(2deg);transform-origin:left center}
.note{position:absolute;width:88px;height:88px;padding:19px;display:grid;place-items:center;background:#fbefb5;box-shadow:5px 8px 14px #33333320;transform:rotate(var(--rot))}
.note:before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,#ffffff55,transparent 40%,#bea44614)}
svg{width:100%;height:100%;fill:none;stroke:#333;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round;opacity:.8}
svg .relleno{fill:currentColor;stroke:none;opacity:.13}
</style></head><body><div class="banner"><div class="grid"></div><div class="brand">Blas Ruiz</div>
<div class="eyebrow">25 AÑOS DE OFICIO · DISEÑO + PROCESOS</div>
<h1>La pieza se acaba.<br>El sistema se queda.</h1>
<div class="sub">Comunicación visual para industria, distribución y B2B.</div>
<div class="url">blasruiz.es</div>
<div class="wall">${[0,1,4,5,6,8,9,10,11].map((j,i)=>`<div class="note" style="left:${i%3*115}px;top:${Math.floor(i/3)*109}px;--rot:${[-4,3,-2,4,-3,2][i%6]}deg">${icons[j]}</div>`).join('')}</div>
</div></body></html>`;
(async()=>{
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try{
  const page = await browser.newPage({viewport:{width:1584,height:396},deviceScaleFactor:1});
  await page.setContent(html,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const png = await page.screenshot();
  const output = path.join(root,'cabecera-linkedin-blasruiz.png');
  await sharp(png).png({compressionLevel:9}).toFile(output);
  console.log(output);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
