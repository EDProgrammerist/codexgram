const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 const page = await browser.newPage({viewport:{width:393,height:780},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror', e => errors.push(e.message));
 await page.goto('http://localhost:8082/preview/home',{waitUntil:'networkidle',timeout:120000});
 await page.getByRole('button',{name:'Create post',exact:true}).waitFor({timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(600);
 fs.mkdirSync('design/qa/home',{recursive:true});
 await page.screenshot({path:`design/qa/home/${process.env.CAPTURE_NAME || 'iteration-1'}.png`});
 console.log(JSON.stringify({errors, url:page.url()}));
 await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
