const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});const page=await browser.newPage({viewport:{width:393,height:824}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8082/preview/explore',{waitUntil:'networkidle'});
 const button=name=>page.getByRole('button',{name,exact:true});const close=async()=>{await button('Close').click();await page.waitForTimeout(400);};
 const search=page.getByRole('textbox',{name:'Search people, places, or posts'});
 await expect(page.getByRole('button',{name:/^Open /})).toHaveCount(9);
 await button('Follow sarah.chen').click();await expect(button('Unfollow sarah.chen')).toBeVisible();
 await button('View sarah.chen').click();await expect(page.getByText('Preview creator. Follows stay in this session.')).toBeVisible();await close();
 await button('See all suggested people').click();await expect(page.getByText('Discover preview creators. Follows stay in this session.')).toBeVisible();await close();
 await page.getByRole('tab',{name:'People results',exact:true}).click();await expect(page.getByRole('button',{name:/^Open /})).toHaveCount(0);
 await search.fill('emma');await expect(button('View emma.ross')).toBeVisible();await expect(button('View alexwong')).toHaveCount(0);
 await button('Clear search').click();await page.getByRole('tab',{name:'Posts results'}).click();await search.fill('Amalfi');await expect(page.getByRole('button',{name:/^Open /})).toHaveCount(1);
 await button('Open A day on the Amalfi Coast').click();await button('Save moment').click();await expect(button('Unsave moment')).toBeVisible();await close();
 await search.fill('xyznotfound');await expect(page.getByText('No moments found',{exact:true})).toBeVisible();await button('Reset search').click();
 await button('Topic Food').click();await expect(button('Open Coffee with a view')).toBeVisible();await expect(page.getByRole('button',{name:/^Open /})).toHaveCount(1);
 await page.getByRole('tab',{name:'Tags results'}).click();await button('Explore tag Nature').click();await expect(page.getByRole('tab',{name:'Posts results'})).toHaveAttribute('aria-selected','true');await expect(button('Open A little blue escape')).toBeVisible();
 await page.getByRole('tab',{name:'All results'}).click();await button('Options for marco.explores').click();await button('Hide this creator').click();await expect(button('Options for marco.explores')).toHaveCount(0);
 await button('Explore notifications').click();await button('Mark all as read').click();await expect(page.getByRole('alert')).toContainText('All notifications');await close();
 await page.reload({waitUntil:'networkidle'});
 for(const [width,height] of [[320,568],[414,896],[768,1024]]){await page.setViewportSize({width,height});await page.waitForTimeout(350);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');await expect(page.getByRole('tab',{name:/Explore$/})).toBeInViewport();await page.screenshot({path:`design/qa/explore/size-${width}x${height}.png`});}
 await page.goto('http://localhost:8082/explore',{waitUntil:'networkidle'});await expect(page).toHaveURL('http://localhost:8082/');if(errors.length)throw Error(errors.join('\n'));
 const result={passed:true,checks:['nine grid posts','follow toggle','creator preview','see all people','people search','place search','save post','empty results/reset','topic filter','tag navigation','hide creator','notifications','three responsive sizes','signed-out protection'],errors};fs.writeFileSync('design/qa/explore/interaction-results.json',JSON.stringify(result,null,2));console.log(result);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
