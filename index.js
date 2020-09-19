const express = require('express');
const app = express();
var fs = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.bodyParser({limit: '20mb'})); 
var dir = './pdf';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
var dir = './pdf';
//TODO Post Body Limit set :10,20MB
//TODO pass headers and allow only if there is server key set

// Pdf Generation Code Start 
function randName() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 8; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
  const pdf = await page.pdf(
      { format: 'A4',
        path :'./pdf/' + randName() + '.pdf'  
      }
      );
  await browser.close();
  return pdf
}

// printPDF()


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