const express = require('express');
const app = express();
var myCustomFS = require('rimraf')
require('dotenv').config({})
var fs = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
var http = require('http');
var util = require("util");
var bodyParser = require('body-parser');
var cron = require('node-cron');

const filepath='./letterhead/letterhead-v1.html';
const cardPath='./card/design-1-v1.html';

const multer = require('multer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '20mb'
}));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
const multipart = multer({ storage: storage })
// app.use(express.bodyParser({limit: '20mb'})); 
var dir = './pdf';
var dir2 = './templatenew';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(dir2)) {
  fs.mkdirSync(dir2);
}

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

async function printPDF(html, projectname, landscape, marginleft, marginright) {
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
    ]
  });
  const page = await browser.newPage();
  // console.log('start Pdf')
  // await page.goto(html, {waitUntil: 'networkidle0'});
  await page.setContent(html)
  await page.addStyleTag({
    content: `
    @page {size: auto};`
  });
  // console.log('its here')
  // await page.emulateMedia('print')
  const pdf = await page.pdf({

    format: 'A4',
    path: path.join(__dirname + '/pdf/' + projectname),
    landscape: landscape,
    // displayHeaderFooter: false,
    printBackground: true,
    margin: {
      top: 0,
      right: marginright,
      bottom: 0,
      left: marginleft
    }
  });
  // console.log('End Pdf')
  await browser.close();
  return pdf
}

app.get('/', async (req, res) => {
  res.send('ok')
})

app.use((req, res, next) => {
  let apiKey = req.headers['x-client-key'];
  if (apiKey == process.env.API_KEY) {
    next()
  } else {
    return res.status(401).json({
      message: 'Wrong API Key'
    })
  }

})
// cron.schedule('*/30 * * * * *', () => {
cron.schedule('0 2 * * *', () => {
  // every day at 2 am
  console.log("start ")
  var uploadsDir = __dirname + '/templatenew';
  var uploadsDir1 = __dirname + '/pdf';
  fs.readdir(uploadsDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(uploadsDir, file), err => {
        if (err) throw err;

      });
    }
  });
  fs.readdir(uploadsDir1, (err, files1) => {
    if (err) throw err;

    for (const file of files1) {
      fs.unlink(path.join(uploadsDir1, file), err => {
        if (err) throw err;

      });
    }
  });
})
app.post('/pdfCreation', async (req, res) => {
  try {
    let html = req.body.html
    let landscape = req.body.landscape
    let marginleft = req.body.marginleft
    let marginright = req.body.marginright

    let newname = randName()
    fs.writeFileSync(path.join(__dirname + '/templatenew/' + newname + '.html'), html);
    var projectname = newname + '.pdf';
    printPDF(html, projectname, landscape, marginleft, marginright)
    res.status(200).json({
      "message": 'here',
      "success": true,
      fileName: projectname
    });


  } catch (error) {
    console.log(error)
  }
})

app.post('/pdfCreation2', async (req, res) => {
  try {
    let temp = path.join(__dirname, '/template/template.html')
    let htmlTemplate = fs.readFileSync(temp)
    let newname = randName()
    fs.writeFileSync(path.join(__dirname + '/templatenew/' + newname + '.html'), htmlTemplate);
    // let html = fs.writeFileSync(path.join(__dirname +'/templatenew/'+newname+ '.html'),htmlTemplate);;
    let html = `file://${__dirname}` + '/templatenew/' + newname + '.html';
    console.log(html)
    var projectname = newname + '.pdf';
    // console.log('Start')
    let pdffile = await printPDF(html, projectname)
    res.status(200).json({
      "message": 'here',
      "success": true,
      fileName: projectname
    });

  } catch (error) {
    console.log(error)
  }
})

// Code added Letter and card pdf 
async function printLetterPDF(html, projectname) {
  const filepath='./uploads/'+html;

  const contentData = fs.readFileSync(
      path.resolve(__dirname, filepath),
      'utf-8'
  )    

  const browser = await puppeteer.launch({
      // ignoreDefaultArgs: ['--disable-extensions'],
      args: ["--no-sandbox", "--disable-setuid-sandbox" ,"--enable-local-file-accesses" ,"--allow-file-access-from-files"],
  });
  const page = await browser.newPage();
  await page.goto(`file://${process.cwd()}${filepath}`);
  // console.log('start Pdf')
  // await page.goto(html, {waitUntil: 'networkidle0'});
  await page.setContent(contentData)
  await page.addStyleTag({
      content: `
  @page {size: auto};`
  }); 
  // console.log('its here')
  // await page.emulateMediaType('screen');
  const pdf = await page.pdf({

      format: 'A4',
      path: path.join(__dirname + '/pdf/' + projectname),
      // landscape: landscape,
      // displayHeaderFooter: false,
      printBackground: true,
      margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      }
  });
  // console.log('End Pdf')
  await browser.close();
  return pdf
}



async function printPDFCard(html,projectname) {

  const cardPath='./uploads/'+html;
  const contentData = fs.readFileSync(
      path.resolve(__dirname, cardPath),
      'utf-8'
  )

  const browser = await puppeteer.launch({
      // ignoreDefaultArgs: ['--disable-extensions'],
      args: ["--no-sandbox", "--disable-setuid-sandbox" ,"--enable-local-file-accesses" ,"--allow-file-access-from-files"],
  },{ headless: false });
  const page = await browser.newPage();
   await page.setViewport({width: 1050, height: 600, deviceScaleFactor: 2});

  await page.goto(`file://${process.cwd()}${cardPath}`,{waitUntil:"networkidle2"});
  

  await page.setContent(contentData)    


  const pdf = await page.pdf({

      path: path.join(__dirname + '/pdf/' + projectname),
      printBackground: true,
      width: '350px',
      height:'220px',  
      landscape:false,      

      margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      }
  });
  // console.log('End Pdf')
  await browser.close();
  return pdf
}


app.post('/pdfLetterCreation', multipart.array('page'), async (req, res) => {
  try {
        let fileName="";
    
      req.files.forEach(file => {
          if(file.originalname.includes('html')){
              fileName=file.originalname;              
          }
          
          
      });
      let landscape = req.body.landscape
      let marginleft = req.body.marginleft
      let marginright = req.body.marginright

      let newname = randName()
      //  fs.writeFileSync(path.join(__dirname + '/templatenew/' + newname + '.html'), html);

      console.log(fileName)

      var projectname = newname + '.pdf';
      // printPDFCard(html, projectname)

      printLetterPDF(fileName,projectname)
      res.status(200).json({
          "message": 'here',
          "success": true,
          fileName: projectname
      });


  } catch (error) {
      console.log(error)
  }
})



app.post('/pdfCardCreation', multipart.array('page'), async (req, res) => {
  try {
      let html = req.body.html   
      
      let fileName="";
    
      req.files.forEach(file => {
          if(file.originalname.includes('html')){
              fileName=file.originalname;              
          }
          
          
      });

      let newname = randName()
      // fs.writeFileSync(path.join(__dirname + '/templatenew/' + newname + '.html'), html);

      var projectname = newname + '.pdf';
      printPDFCard(fileName, projectname)


      res.status(200).json({
          "message": 'here',
          "success": true,
          fileName: projectname
      });


  } catch (error) {
      console.log(error)
  }
})




app.get('/pdf/:fileName', function (req, res) {

  if (req.params.fileName.startsWith('{{')) {
    res.sendFile(__dirname + '/pdf/');
  } else {
    res.sendFile(__dirname + '/pdf/' + req.params.fileName);
  }

});


// Pdf Generation Code End 
app.listen(5100, function () {
  console.log(5100 + ' is the magic port');
});