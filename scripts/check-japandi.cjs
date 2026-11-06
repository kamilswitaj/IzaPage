const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = process.env.REVIEW_OUTPUT || path.join(root, 'tmp/japandi-review');
  fs.mkdirSync(output, { recursive: true });
  const html = fs.readFileSync(path.join(root,'portfolio/japandi/index.html'),'utf8').replace(/\r\n/g,'\n');
  const git = process.env.GIT_BINARY || 'C:/Program Files/Git/cmd/git.exe';
  const prose = text => text.match(/<div class="reading-copy">([\s\S]*?)<\/div>/)[1].replace(/\s+/g,' ').trim();
  const approved = execFileSync(git,['show','b787876db3dbcb4ca25b822ceead73db2d056961:portfolio/japandi/index.html'],{cwd:root,encoding:'utf8'});
  const walkthrough=prose(html);
  assert.equal(walkthrough,prose(approved),'Approved narrative walkthrough unchanged');
  assert.equal((walkthrough.match(/<p>/g)||[]).length,23,'Retain all supplied paragraphs and subheadings');
  assert.equal((walkthrough.match(/<p><strong>/g)||[]).length,7,'Retain the seven bold subheadings');
  assert(!/panel\w*\s+sufit|szynoprzew|podział\w*\s+sufit/i.test(html),'No obsolete ceiling descriptions');
  assert(!/organicz\w*\s+(?:wyprofilowan\w*\s+)?przejści/i.test(html),'Vanity has a mirror, not a passage');
  assert(/Tylna ściana szafy garderobianej/.test(walkthrough),'Correct vanity mounting');
  assert(/Organiczny kształt lustra/.test(walkthrough),'Correct vanity description');
  const paragraphs=text=>[...text.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>m[1].replace(/\s+/g,' ').trim()).sort();
  assert.deepEqual(paragraphs(html),paragraphs(approved),'All approved descriptions unchanged');
  const lastLayout=execFileSync(git,['show','4c5f656712375f841393420b9737159559e52ff1:portfolio/japandi/index.html'],{cwd:root,encoding:'utf8'});
  const technicalCards=text=>[...text.matchAll(/<article class="technical-card">[\s\S]*?<\/article>/g)].map(m=>m[0]);
  assert.deepEqual(technicalCards(html),technicalCards(lastLayout),'Technical gallery unchanged');
  const pdf = path.join(root,'assets/documentation/japandi/projekt-b-izabela-switaj.pdf');
  const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const pdfHash = hash(pdf);
  assert.equal(pdfHash,'6479329d4a88d9451027107f2a828b1a56bd6bc4b67e9108c11e6ea786d5fc27');
  if(process.env.PDF_SOURCE) assert.equal(pdfHash,hash(process.env.PDF_SOURCE));
  const sheets = JSON.parse(fs.readFileSync(path.join(root,'assets/documentation/japandi/sheets.json'),'utf8'));
  assert.deepEqual(sheets.map(s=>s.page),Array.from({length:13},(_,i)=>34+i));
  assert.equal(sheets.filter(s=>s.featured).length,8);
  for(const s of sheets) {
    const png=fs.readFileSync(path.resolve(root,'portfolio/japandi',s.detail));
    assert.equal(png.readUInt32BE(16),s.width);
    assert.equal(png.readUInt32BE(20),s.height);
    assert(fs.existsSync(path.resolve(root,'portfolio/japandi',s.thumbnail)));
  }
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const url = process.env.PREVIEW_URL || 'http://127.0.0.1:8022/portfolio/japandi/';
  page.on('response', r => { if (new URL(r.url()).origin === new URL(url).origin && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const captures = {plan:'#uklad',hol:'#hol',living:'#strefa-dzienna',bedroom:'#strefa-prywatna',sanitary:'#strefa-sanitarna',documentation:'#dokumentacja-techniczna',contact:'#kontakt'};
  const widths=[1920,1700,1440,1100,768,390];
  const metrics=[];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(url);
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
      await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode()));
    });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('[data-lightbox-src]').count(), 13);
    assert.equal(await page.locator('[data-technical-page]').count(), 8);
    const outline = await page.locator('main h1,main h2,main h3,main h4').evaluateAll(nodes => nodes.map(n=>({level:Number(n.tagName[1]),text:n.textContent})));
    for(let i=1;i<outline.length;i++) assert(outline[i].level<=outline[i-1].level+1,`heading skip: ${outline[i].text}`);
    assert.deepEqual(outline.filter(h=>h.level===2).map(h=>h.text),['Książki wyznaczają rytm wnętrza','Przestrzeń zorganizowana wokół codziennych rytuałów','Prezentacja pomieszczeń','Od koncepcji do szczegółu','Izabela Świtaj']);
    assert.equal(await page.locator('#hol img,#garderoba img').count(),0);
    assert.equal(await page.locator('#wizualizacje-strefy-dziennej .gallery-item').count(),5);
    assert.equal(await page.locator('.living-copy img').count(),0,'Approved descriptions form an independent copy stack');
    assert.equal(await page.locator('.living-moodboards img').count(),2,'Both existing moodboards form the right stack');
    assert.equal(await page.locator('#kuchnia img,#jadalnia img,#salon img').count(),0);
    const geometry=await page.evaluate(()=>{
      const box=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
      const gallery=document.querySelector('#wizualizacje-strefy-dziennej .japandi-gallery');
      const root=box(gallery),gap=parseFloat(getComputedStyle(gallery).columnGap),column=(root.width-gap)/2;
      const editorialSelectors=['.project-heading','#zalozenia','#uklad h2','#uklad > p:not(.eyebrow)','.rooms-heading','#materialy','#hol .room-heading','#sypialnia .room-chapter-heading','#garderoba .room-chapter-heading','#strefa-sanitarna .room-heading','.technical-heading','.technical-group-heading','.technical-thesis-card'];
      return {root,gap,column,headings:[...document.querySelectorAll('.project--japandi h1,.project--japandi h2,.project--japandi h3,.project--japandi h4,.technical-heading h2,.technical-group-heading h3,#kontakt h2')].map(box),editorial:editorialSelectors.map(selector=>({selector,...box(document.querySelector(selector)),display:getComputedStyle(document.querySelector(selector)).display})),concept:box(document.querySelector('.living-concept')),copy:box(document.querySelector('.living-copy')),moodboards:[...document.querySelectorAll('.living-moodboards > figure')].map(box),galleries:[...document.querySelectorAll('.japandi-gallery,.technical-grid')].map(n=>({root:box(n),technical:n.matches('.technical-grid'),cards:[...n.children].map(box)})),plan:box(document.querySelector('#uklad > figure')),cover:box(document.querySelector('.case-cover img')),navigation:box(document.querySelector('.project-pagination > a')),brand:box(document.querySelector('.portfolio-header .brand'))};
    });
    for(const h of geometry.headings) assert(Math.abs(h.x-geometry.root.x)<1,`Shared heading axis at ${width}`);
    assert(geometry.root.width<=1281,'Visual container capped across the complete page');
    for(const e of geometry.editorial){
      assert(e.width<=961,`Editorial width: ${e.selector}`);
      assert(Math.abs(e.x-geometry.root.x)<1,`Editorial axis: ${e.selector}`);
    }
    assert.equal(geometry.editorial.find(e=>e.selector==='#zalozenia').display,'block','Editorial content has no empty column');
    assert(Math.abs(geometry.navigation.x-geometry.root.x)<1,'Final navigation shares the page axis');
    assert(Math.abs(geometry.brand.x-geometry.root.x)<1,'Top navigation shares the page axis');
    if(width>900){
      assert(Math.abs(geometry.copy.x-geometry.root.x)<1,'Living copy starts on common axis');
      assert(Math.abs(geometry.copy.width-geometry.column)<1,'Equal concept columns');
      const center=geometry.root.x+geometry.column+geometry.gap+geometry.column/2;
      for(const board of geometry.moodboards)assert(Math.abs(board.x+board.width/2-center)<1,'Moodboards centered in their independent column');
      const unchanged=await page.evaluate(()=>{
        const left=[...document.querySelectorAll('.living-copy > section')],before=left.map(n=>n.getBoundingClientRect().top);
        const first=document.querySelector('.living-moodboards > figure');
        first.style.height=(first.getBoundingClientRect().height+240)+'px';
        const after=left.map(n=>n.getBoundingClientRect().top);first.style.removeProperty('height');
        return before.every((v,i)=>Math.abs(v-after[i])<.5);
      });
      assert(unchanged,'Moodboard height does not control spacing between descriptions');
    }else{
      assert(geometry.moodboards[0].y>=geometry.copy.y+geometry.copy.height,'Concept stacks on smaller viewports');
    }
    for(const g of geometry.galleries){
      assert(Math.abs(g.root.x-geometry.root.x)<1 && Math.abs(g.root.width-geometry.root.width)<1,'Shared gallery grid');
      for(let n=0;n<g.cards.length;n++){
        const c=g.cards[n];
        assert(Math.abs(c.width-(width>640?geometry.column:g.root.width))<1,'Gallery image column width');
        if(!g.technical && width>640 && n===g.cards.length-1 && g.cards.length%2){
          assert(Math.abs(c.x+c.width/2-(g.root.x+g.root.width/2))<1,'Unpaired image centered');
        }else if(width>640){
          assert(Math.abs(c.x-(g.root.x+(n%2)*(geometry.column+geometry.gap)))<1,'Paired image on its column axis');
          if(n%2)assert(Math.abs(c.y-g.cards[n-1].y)<1,'Paired image row top');
        }
      }
    }
    assert(geometry.plan.width<=900.5,'Plan capped at 900px');
    assert(Math.abs(geometry.plan.x+geometry.plan.width/2-(geometry.root.x+geometry.root.width/2))<1,'Centered plan');
    assert(geometry.cover.width<=960.5,'Opening image uses editorial maximum');
    assert(Math.abs(geometry.cover.x+geometry.cover.width/2-(geometry.root.x+geometry.root.width/2))<1,'Opening image centered');
    const allSections=await page.evaluate(()=>['.project-heading','#zalozenia','#uklad','#prezentacja-pomieszczen','#hol','#strefa-dzienna','#strefa-prywatna','#garderoba','#strefa-sanitarna','#dokumentacja-techniczna','.project-pagination','#kontakt'].filter(s=>document.querySelector(s)).map(selector=>{const n=document.querySelector(selector),r=n.getBoundingClientRect(),s=getComputedStyle(n);return {selector,x:r.x,width:r.width,y:r.y+scrollY,height:r.height,maxWidth:s.maxWidth,margin:s.margin,padding:s.padding}}));
    geometry.sections=allSections;
    geometry.transitions=await page.evaluate(()=>[['brief-plan','#zalozenia','#uklad'],['rooms-hol','.rooms-heading','#hol'],['living-private','#strefa-dzienna','#strefa-prywatna'],['private-sanitary','#strefa-prywatna','#strefa-sanitarna'],['technical-footer','#dokumentacja-techniczna','#kontakt']].map(([name,a,b])=>({name,top:document.querySelector(a).getBoundingClientRect().top+scrollY,bottom:document.querySelector(b).getBoundingClientRect().bottom+scrollY})));
    metrics.push({width,...geometry});
    for(const id of ['kuchnia','jadalnia','salon','sypialnia','garderoba','lazienka','dodatkowe-wc']) assert.equal(await page.locator(`#${id} h4`).count(),1);
    assert.equal(await page.locator('#salon h4').evaluate(n=>getComputedStyle(n).fontFamily),await page.locator('#strefa-dzienna h3').evaluate(n=>getComputedStyle(n).fontFamily));
    const ratios=await page.locator('.japandi-story .image-button img').evaluateAll(nodes=>nodes.map(n=>Math.abs(n.width/n.height-n.naturalWidth/n.naturalHeight)));
    assert(ratios.every(delta=>delta<0.02),'Original image proportions');
    const details=page.locator('#spacer-po-mieszkaniu details');
    assert.equal(await details.getAttribute('open'),null);
    const summary=details.locator('summary');
    await summary.focus(); await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'),'');
    await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'),null);
    await summary.blur();
    // Visit every image before a full-page capture so offscreen decoded images are painted.
    for (const image of await page.locator('img[src]').all()) await image.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    const captureStyle='.portfolio-header,.skip-link { visibility:hidden !important; }';
    await page.screenshot({ path: path.join(output, `japandi-${width}.png`), fullPage: true,style:captureStyle });
    for(const [name,selector] of Object.entries(captures)) await page.locator(selector).screenshot({path:path.join(output,`${width}-${name}.png`),style:captureStyle});
    await page.evaluate(()=>window.scrollTo(0,0));
    const opening=await page.evaluate(()=>{const a=document.querySelector('.case-cover').getBoundingClientRect(),b=document.querySelector('#zalozenia').getBoundingClientRect();return {x:0,y:a.y,width:innerWidth,height:b.bottom-a.y+24}});
    await page.screenshot({path:path.join(output,`${width}-opening.png`),fullPage:true,clip:opening,style:captureStyle});
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url);
  const opener = page.locator('[data-lightbox-src]').first();
  await opener.click();
  await page.locator('.portfolio-lightbox img').evaluate(i => i.decode());
  assert(await page.locator('.portfolio-lightbox').isVisible());
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.lightbox-frame figcaption').innerText(), /2 \/ 13/);
  await page.keyboard.press('Escape');
  assert(await opener.evaluate(el => el === document.activeElement));
  for (let n = 0; n < 8; n++) {
    const button = page.locator('[data-technical-page]').nth(n);
    await button.click();
    await page.locator('#technical-large-image').evaluate(i => i.decode());
    const selectedPage=Number(await button.getAttribute('data-technical-page'));
    const sheetIndex=sheets.findIndex(s=>s.page===selectedPage);
    assert.equal(await page.locator('#technical-count').innerText(), `${sheetIndex + 1} / 13`);
    await page.locator('#technical-native').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '100%');
    await page.locator('#technical-zoom-in').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '125%');
    if (n === 0) await page.screenshot({ path: path.join(output, 'technical-viewer.png') });
    await page.keyboard.press('Escape');
    assert(await button.evaluate(el => el === document.activeElement));
  }
  await page.locator('[data-technical-page]').first().click();
  const firstSheetIndex=sheets.findIndex(s=>s.featured);
  for(let n=0;n<13;n++) {
    await page.locator('#technical-large-image').evaluate(i=>i.decode());
    assert.equal(await page.locator('#technical-full-image').getAttribute('href'),sheets[(n+firstSheetIndex)%13].detail);
    await page.locator('#technical-next').click();
  }
  await page.keyboard.press('Escape');
  const pdfLink=page.locator('#pelne-opracowanie');
  assert.equal(await pdfLink.getAttribute('target'),'_blank');
  assert.equal((await page.request.get(new URL(await pdfLink.getAttribute('href'),url).href)).status(),200);
  // Review the controls at the mobile breakpoint as well.
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-technical-page]').first().click();
  const closeBox=await page.locator('#technical-close').boundingBox();
  assert(closeBox.x>=0 && closeBox.y>=0 && closeBox.x+closeBox.width<=390 && closeBox.y+closeBox.height<=844);
  await page.locator('#technical-native').click();
  await page.locator('.technical-viewport').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('.technical-viewport').scrollLeft>0);
  await page.locator('#technical-fit').click();
  await page.screenshot({path:path.join(output,'technical-viewer-mobile.png')});
  await page.keyboard.press('Escape');
  const result = { result:'PASS', widths, gallery:13, livingRenders:5, featuredSheets:8, technicalSheets:13, pdfSha256:pdfHash, checks:['approved descriptions and narrative unchanged','H1–H4 hierarchy','1280px visual and 960px editorial containers across the whole page','shared axes from top navigation to contact','independent copy and moodboard stacks','moodboard height does not affect description spacing','equal gallery columns and centered unpaired images','centered uncropped plan and opening image','keyboard walkthrough','image decoding and proportions','no horizontal overflow','lightbox navigation','Escape and focus restoration','technical cards and source documents unchanged','all technical sheets and full-image links','100% and zoom','mobile viewer and keyboard scrolling','original PDF hash and HTTP link'], browserErrors:errors };
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(output, 'metrics.json'), JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
