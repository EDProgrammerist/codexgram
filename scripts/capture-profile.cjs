const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 const page = await browser.newPage({viewport:{width:393,height:764},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror', e => errors.push(e.message));
 await page.goto('http://localhost:8082/preview/profile',{waitUntil:'networkidle',timeout:120000});
 await page.getByRole('button',{name:'Edit Profile',exact:true}).waitFor({timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(600);
 fs.mkdirSync('design/qa/profile',{recursive:true});
 await page.screenshot({path:`design/qa/profile/${process.env.CAPTURE_NAME || 'iteration-1'}.png`});
 console.log(JSON.stringify({errors, url:page.url()}));
 await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
