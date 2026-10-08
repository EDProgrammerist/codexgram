const {chromium, expect}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:393,height:780}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8082/preview/home',{waitUntil:'networkidle'});
 const button=name=>page.getByRole('button',{name,exact:true});
 await button("Unlike sarah.chen's post").click();
 await expect(page.getByTestId('post-sarah-como').getByText('141',{exact:true})).toBeVisible();
 await button("Like sarah.chen's post").click();
 await button("Save sarah.chen's post").click();
 await expect(button("Unsave sarah.chen's post")).toBeVisible();
 await button('Next photo, 1 of 4').click();
 await expect(button('Next photo, 2 of 4')).toBeVisible();
 await button("Comments on sarah.chen's post").click();
 await page.getByLabel('Add a comment',{exact:true}).fill('Beautiful moment!');
 await button('Post comment').click();
 await expect(page.getByText('Beautiful moment!',{exact:true})).toBeVisible();
 await button('Close comments').click();
 await expect(page.getByTestId('post-sarah-como').getByText('13',{exact:true})).toBeVisible();
 await button("Play alexwong's video").click();
 await expect(page.getByText(/no video file/)).toBeVisible();
 await button('Close').click();
 await button('Create post').click();
 await page.getByLabel('Post caption',{exact:true}).fill('My preview moment');
 await button('Add to preview feed').click();
 await expect(page.getByText('My preview moment',{exact:true})).toBeVisible();
 for(const tab of ['Messages','Explore','Profile','Home']){
 await page.getByRole('tab',{name:new RegExp(tab)}).click();
 await expect(page).toHaveURL(new RegExp('/preview/'+tab.toLowerCase()));
 }
 await expect(page.getByTestId('post-sarah-como').getByText('13',{exact:true})).toBeVisible();
 await page.reload({waitUntil:'networkidle'});
 const labelHeight=await page.getByRole('tab',{name:/Home/}).getByText('Home',{exact:true}).evaluate(e=>e.getBoundingClientRect().height);
 if(labelHeight<14)throw Error('Tab label is clipped');
 const sizes=[];
 for(const [width,height] of [[320,568],[414,736],[393,852],[768,1024]]){
 await page.setViewportSize({width,height});await page.waitForTimeout(300);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 if(overflow)throw Error(`Horizontal overflow at ${width}`);
 await expect(page.getByRole('tab',{name:/Home/})).toBeInViewport();
 await page.screenshot({path:`design/qa/home/size-${width}x${height}.png`});
 sizes.push({width,height,overflow});
 }
 await page.goto('http://localhost:8082/home',{waitUntil:'networkidle'});
 await expect(page).toHaveURL('http://localhost:8082/');
 if(errors.length)throw Error(errors.join('\n'));
 const result={passed:true,checks:['like toggle','save toggle','photo carousel','comment submission','video availability notice','preview composer','four tab routes','signed-out route protection'],sizes,errors};
 fs.writeFileSync('design/qa/home/interaction-results.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
