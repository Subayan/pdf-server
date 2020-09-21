const express = require('express');
const app = express();
var fs = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
var querystring = require('querystring');
var http = require('http');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
	limit: '20mb'
}));
// app.use(express.bodyParser({limit: '20mb'})); 
var dir = './pdf';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
var dir = './pdf';
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
async function printPDF(html,projectname) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(html, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf(
      { format: 'A4',
        path :'./pdf/' + projectname  
      }
      );
  await browser.close();
  return pdf
}

app.post('/pdfCreation',async (req,res)=>{
  try {
    var html = req.body.html;
    var projectname = randName() + '.pdf';
    // var html = 'https://blog.risingstack.com';
    // var projectname = randName() + '.pdf';
  let pdffile =  await printPDF(html, projectname)

  }catch(error){
console.log(error)
  }
})

 // Build the post string from an object


  
app.get('/pdf/:fileName', function (req, res) {

	if (req.params.fileName.startsWith('{{')){
		res.sendFile(__dirname + '/pdf/');
	}else{
		res.sendFile(__dirname + '/pdf/' + req.params.fileName);
	}
	
});
// app.post('/pdfCreation',async (req,res)=>{
//   try {
//     var html = req.body.html,
//     projectname = req.body.projectname;

//     // projectname = randName() +'.pdf';

    

//   }catch(error){
// console.log(error)
//   }
// })
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