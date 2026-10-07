/* Regenera las dos tarjetas OG desde los elementos reales de las landings.
   NODE_PATH debe incluir playwright y sharp. Uso: node social-preview/render.cjs */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const focusSource = fs.readFileSync(path.join(root, 'landing-linkedin.html'), 'utf8');
const b2bSource = fs.readFileSync(path.join(root, 'landing-b2b.html'), 'utf8');
const focusFunction = focusSource.slice(focusSource.indexOf('    function crearFoco(THREE){'), focusSource.indexOf('    import(urlThree).then'));
const notes = [...b2bSource.matchAll(/<button class="postit"[\s\S]*?<\/button>/g)].map(x => x[0]);
const shared = `
*{box-sizing:border-box}body{margin:0;background:#f1f1f0;color:#333;font-family:Onest,Arial,sans-serif}
.card{position:relative;width:1200px;height:630px;overflow:hidden;background:#f1f1f0}
.brand{position:absolute;left:64px;top:48px;z-index:4;font:500 24px Outfit,Arial,sans-serif;letter-spacing:-.8px}
.brand span{color:#888;font-size:17px;letter-spacing:0;margin-left:12px}
.eyebrow{position:absolute;left:64px;top:144px;z-index:4;font:12px 'DM Mono',monospace;letter-spacing:2px;text-transform:uppercase}
.eyebrow:before{content:'';display:inline-block;width:8px;height:8px;background:#ff8666;border-radius:50%;margin-right:12px}
h1{position:absolute;left:64px;top:186px;width:610px;margin:0;z-index:4;font:500 62px/1.07 Outfit,Arial,sans-serif;letter-spacing:-2.7px}
.description{position:absolute;left:66px;top:423px;width:500px;z-index:4;font:400 21px/1.5 Onest,Arial,sans-serif;color:#666}
.footer{position:absolute;left:64px;right:64px;bottom:42px;border-top:1px solid #33333324;padding-top:18px;display:flex;justify-content:space-between;z-index:4;font:12px 'DM Mono',monospace;letter-spacing:1px;color:#777}
.footer b{font-weight:400;color:#333}
.scene{position:absolute;inset:0}
.fade{position:absolute;inset:0;background:linear-gradient(90deg,#f1f1f0 0%,#f1f1f0 42%,#f1f1f0e8 50%,transparent 65%);z-index:2}
.dots{position:absolute;inset:70px 0 82px 600px;background-image:radial-gradient(#00cfcf50 .9px,transparent 1px);background-size:10px 10px;mask-image:radial-gradient(ellipse,#000,transparent 73%)}
canvas{position:absolute;inset:0;z-index:1}
.label{position:absolute;font:14px 'DM Mono',monospace;color:#777;z-index:3;letter-spacing:1px;transform:rotate(-7deg)}
.wall{position:absolute;left:688px;top:102px;width:440px;height:420px;transform:perspective(1050px) rotateY(-19deg) rotateX(3deg);transform-origin:left center}
.postit{position:absolute;display:grid;place-items:center;width:86px;height:86px;padding:15px;border:0;background:#fbefb5;color:#333;box-shadow:5px 9px 14px #33333320;transform:rotate(var(--rot));border-radius:1px}
.postit:before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,#ffffff55,transparent 40%,#bea44614)}
.postit svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round;opacity:.8}
.postit .relleno{fill:currentColor;stroke:none;opacity:.13}
.grid{position:absolute;inset:60px 0 82px 620px;background-image:linear-gradient(#33333307 1px,transparent 1px),linear-gradient(90deg,#33333307 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse,#000,transparent 75%)}
`;
const fontLink = '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Onest:wght@400;500&family=DM+Mono&display=swap" rel="stylesheet">';
function card(kind) {
 const isFocus = kind === 'focus';
 const isHome = kind === 'home';
 const visual = isFocus
   ? '<div class="dots"></div><canvas id="focus"></canvas><div class="fade"></div><span class="label" style="left:714px;top:175px">EXCEL</span><span class="label" style="left:678px;top:266px">WHATSAPP</span><span class="label" style="left:744px;top:344px">NOTAS</span>'
   : '<div class="grid"></div><div class="wall">' + notes.slice(0,12).map((note,i) => note.replace(/style="[^"]*"/, `style="left:${(i%3)*128 + (i%2)*9}px;top:${Math.floor(i/3)*103}px;--rot:${[-4,3,-2,4,-3,2][i%6]}deg"`)).join('') + '</div>';
 const homeStyle = isHome ? 'h1{top:202px;font-size:60px}.description{top:383px}.wall .postit:nth-child(5),.wall .postit:nth-child(9){background:#d1eeee}.wall .postit:nth-child(8){background:#dcebd6}' : '';
 return `<!doctype html><html lang="es"><head><meta charset="utf-8">${fontLink}<style>${shared}${homeStyle}</style></head><body><div class="card"><div class="brand">blasruiz.es<span>/ Blas Ruiz</span></div><div class="eyebrow">${isHome ? '25 años de oficio · Diseño + procesos' : isFocus ? 'Caso real · Integración audiovisual' : 'Industria · Distribución · B2B'}</div><h1>${isHome ? 'La pieza se acaba.<br>El sistema se queda.' : isFocus ? 'De Excel y WhatsApp<br>a una herramienta<br>propia.' : 'Mucho material.<br>Una misma fuente.<br>Todo al día.'}</h1><div class="description">${isHome ? 'Diseño y producción visual para<br>industria, distribución y B2B.' : isFocus ? 'Proyectos, presupuestos y facturación.<br>Un sistema conectado al negocio.' : 'Catálogos, fichas técnicas y tarifas.<br>Actualizar sin empezar de cero.'}</div><div class="scene">${visual}</div><div class="footer"><b>Diseño + procesos + herramientas</b><span>${isHome ? 'LA PRÓXIMA VEZ, UN AJUSTE.' : isFocus ? 'DEL DATO DISPERSO AL SISTEMA' : 'SISTEMA DE CONTENIDOS'}</span></div></div></body></html>`;
}
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const kinds = process.argv.slice(2);
  for (const kind of (kinds.length ? kinds : ['focus','notes','home'])) {
   if (!['focus','notes','home'].includes(kind)) throw new Error('Tarjeta desconocida: '+kind);
   await page.setContent(card(kind),{waitUntil:'networkidle'});
   await page.evaluate(() => document.fonts.ready);
   if (kind === 'focus') {
    await page.addScriptTag({type:'module',content:`import * as THREE from 'https://esm.sh/three@0.161.0';
${focusFunction}
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('focus'),alpha:true,antialias:true,preserveDrawingBuffer:true});
renderer.setSize(1200,630);renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1200/630,.1,100);camera.position.set(0,1,10);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xf1f1f0,0x333333,2.5));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,5,6);scene.add(light);
const focus=crearFoco(THREE);focus.position.set(4,-.35,0);focus.scale.setScalar(.95);focus.userData.aimGroup.rotation.y=2.38;focus.userData.cabeza.rotation.x=.18;scene.add(focus);renderer.render(scene,camera);window.renderReady=true;`});
    await page.waitForFunction(() => window.renderReady === true,{timeout:30000});
   }
   const png=await page.screenshot();
   const filename=kind==='home'?'og-blasruiz.png':kind==='focus'?'og-landing-linkedin.png':'og-landing-b2b.png';
   await sharp(png).png({compressionLevel:9,palette:false}).toFile(path.join(root,filename));
   console.log(filename,await sharp(path.join(root,filename)).metadata());
  }
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
