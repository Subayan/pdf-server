const express = require('express');
const app = express();
var fs = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
var http = require('http');
// var  util = require("util");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const multer = require('multer');
app.use(bodyParser.urlencoded({
	extended: false,
	limit: '20mb'
}));
// app.use(express.bodyParser({limit: '20mb'})); 
var dir = './pdf';
var dir2 = './templatenew';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
if (!fs.existsSync(dir2)){
  fs.mkdirSync(dir2);
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

async function printPDF(html, projectname) {
  const browser = await puppeteer.launch({
    // ignoreDefaultArgs: ['--disable-extensions'],
    args: [
    // '--no-sandbox', '--disable-setuid-sandbox'
    // '--headless', 
     '--no-sandbox'
    //  '--no-gpu','--disable-setuid-sandbox'
    // '--no-sandbox',
    // '--disable-setuid-sandbox',
    // '--disable-dev-shm-usage',
    // '--disable-accelerated-2d-canvas',
    // '--no-first-run',
    // '--no-zygote',

    // '--disable-gpu'
  ]});
  const page = await browser.newPage();
console.log('start Pdf')
  await page.goto(html, {waitUntil: 'networkidle0'});
  await page.addStyleTag({
    content: '@page {size: A4 portait;}'
});
  const pdf = await page.pdf(
      { 
        format: 'A4',
        path :'./pdf/' + projectname,
        printBackground: true,
        margin: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20,
        },
      }
      );
      console.log('End Pdf')
  await browser.close();
  return pdf
}

app.get('/', async (req, res) => {
  res.send('ok')
})
// var profileStorage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		console.log(file.originalname);
// 		cb(null, './template');
// 	},
	
// 	filename: function (req, file, cb) {
// 		var extension = file.originalname.split('.').pop();
// 		console.log(file.originalname);
// 		cb(null, file.originalname );
// 	}
// });
// var fileUplaod = multer({
// 	storage: profileStorage
// }).single('file');
// app.post('/fileupload'  ,function (req, res) {
// 	fileUplaod(req, res, function (err, file) {
// 		if (err) {
// 			console.log(err);
// 			return res.status(400).json({
// 				status: false,
// 				message:err.toString()
// 			})
			
// 		}
// 		res.status(200).json({
// 			success: true,
// 			message: 'File has been uploaded',
// 			fileName: req.file.filename
// 		})
// 	});
// });
// printPDF()
app.post('/pdfCreation',async (req,res)=>{
  try {  
    // let temp = path.join(__dirname, '/template/template.html')
    // let htmlTemplate = fs.readFileSync(temp)
    // let newname = randName()
    // fs.writeFileSync(path.join(__dirname +'/templatenew/'+newname+ '.html'),htmlTemplate);
  
    // // let html = fs.writeFileSync(path.join(__dirname +'/templatenew/'+newname+ '.html'),htmlTemplate);;
    // let html =`file://${__dirname}` +'/templatenew/'+newname+ '.html';
   let html = req.body.html
    console.log(html)
    var projectname = newname + '.pdf';
    // console.log('Start')
    let pdffile =  await printPDF(html, projectname)
      res.status(200).json({
        "message": 'here',
        "success": true,
        fileName: projectname
      });
console.log('End')


  }catch(error){
console.log(error)
  }
})


  
app.get('/pdf/:fileName', function (req, res) {

	if (req.params.fileName.startsWith('{{')){
		res.sendFile(__dirname + '/pdf/');
	}else{
		res.sendFile(__dirname + '/pdf/' + req.params.fileName);
	}
	
});


// Pdf Generation Code End 
app.listen(5100, function(){
  console.log(5100 + ' is the magic port'); 
});



