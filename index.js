const express = require('express');
const app = express();
const puppeteer = require('puppeteer')
//TODO Post Body Limit set :10,20MB
//TODO pass headers and allow only if there is server key set
// Pdf Generation Code Start 
async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
  const pdf = await page.pdf(
      { format: 'A4'
    //path :'' ?? 
    }
      );
    //   console.log(pdf)
  await browser.close();
  return pdf
}
printPDF()
// Pdf Generation Code End 
app.listen(6000);
console.log(6000 + ' is the magic port'); 


// extra Stuff 
//   await page.setRequestInterception(true);
//   page.on('request', intercepted_request => {
//     if (intercepted_request.url().includes('google-analytics') || intercepted_request.url().includes('facebook')) {
//       intercepted_request.abort();
//     } else {
//       intercepted_request.continue();
//     }
//   });