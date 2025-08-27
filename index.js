const request = require('sync-request');
const compression = require('compression');

const express = require('express');

const servidorOrigem = 'http://'+'api-uat'+
'.b'+'an'+'cov'+'o'+'tora'+'n'+'tim'+
'.com.br';
var port = process.env.PORT || 3000;
const app = express();
const TOKEN = 'dGVzdGU6MTIz'; // teste 123
var token2=undefined;
var dateFormat = require('dateformat');
var ultimos100logs=[];
var maxLog=1000;
var atualLog=0;


// app.use(express.json());

var bodyParser = require('body-parser');
const { Http2ServerRequest } = require('http2');
const { chdir } = require('process');
const { isObject } = require('util');
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies
//app.use('/validaConta', express.json());
regLog= (texto) =>{
       var texto2=''
       if(true){
              texto2 =JSON.stringify(texto)
       } else {
              texto2 = texto
       }
       let registro = dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss")+'-'+texto2;       
       if(maxLog>=ultimos100logs.length){
              ultimos100logs.push(registro)
              //console.log("> "+registro)
       } else {
              for(var i=0;i<ultimos100logs.length-1;i++){
                     ultimos100logs[i]=ultimos100logs[i+1]
              }
              ultimos100logs[maxLog-1] = registro
              //console.log("- "+registro)
       }
};

regLog('Start..');

app.post('/token-external', (req, res) => {
       const tokenExternal = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHRfc3NsX2tleSJ9.ew0KICAiaXNzIjogImh0dHBzOi8vYXBpLXVhdC5iYW5jb3ZvdG9yYW50aW0uY29tLmJyOjQ0MyIsDQogICJpYXQiOjE3NDI0OTc0NTgsDQogICJzdWIiOiIiLA0KICAiYXVkIjoibDd4eGY3ZDM1Mjk1NTE4ZTRkZWI4YWUzZDNjYmM1NGNhMzdjIiwNCiAgImV4cCI6MTc0MjUwMTA1OCwNCiAgImp0aSI6ImFhODEyZjgzLTc5ZjgtNGE4Ni1iNDM3LTBlM2VmMTZmMDcxMSIsDQogICJ0b2tlbl9kZXRhaWxzIjogew0KICAgICJzY29wZSI6Im9vYiIsDQogICAgImV4cGlyZXNfaW4iOjM2MDAsDQogICAgInRva2VuX3R5cGUiOiJCZWFyZXIiLA0KICAgICJ1c2VybmFtZSI6IiIsDQogICAgInJvbGVzIjoiIg0KICB9DQp9.xEAhheRwW6uBcxlUDOmna31dZOse81bRhU_29EVS7bK6wV1DYT8plfkre2mH9WjNSS6xfHBe-44FVMTqqSoTXo0_dZI_-ZooWDQ2ZeBv5RYCYT_hZwqLHV5eMdOww50yNfF7KoCiMkTeReMaW7TPXy9CIccZSzEM0vJxUy-N8tpi51gl6zfbWmq4w7tilKmwzmBCOQEthbROGAF29hRNg-zsHUy4jPtPWCBBvh4VVDO4YoJF9DbcmQceNDKP_KEOFDn5YJb2-qsHde3reh9fAu17-vmGWIelIqBtXN_Zv9BQuwUBt51LTVB9LjaCEUoWsM0S-cnXwZopUm4XSooLyA";

       regLog(`Endpoint token notification external: client_id: ${req.body.client_id} client_secret: ${req.body.client_secret} grant_type: ${req.body.grant_type}`);

       return res.json(
              {
                     "access_token": tokenExternal,
                     "token_type": "Bearer",
                     "expires_in": 3600,
                     "scope": "oob"
              }).send();
});

app.post('/notification-external', (req, res) => {

       regLog(`Endpoint notification external: id: ${req.body}`);

       return res.status(201).send();
});


let trigger = false;

app.post('/taxes-utilities', (req, res) => {
    const { status } = req.body;
    const { clientDocument } = req.body;
    regLog(req.body);
    regLog(`Endpoint: /taxes-utilities | status: ${status} | clientDocument: ${clientDocument}`);

    if (clientDocument === '02826968815') {
        regLog(`Blocked status: ${status} at /taxes-utilities`);
        //trigger = !trigger;

        const body = JSON.stringify({
            statusCode: 400,
            message: 'Invalid document number'
        });

        res.writeHead(400, {
            'Content-Type': 'application/json',
            'Content-Encoding': 'identity', // <-- força sem compressão
            'Cache-Control': 'no-store' // só por segurança
        });
        return res.end(body);
    }

    res.writeHead(201, {
        'Content-Encoding': 'identity',
        'Cache-Control': 'no-store'
    });
    res.end();
});

const blockedDocumentsDDA = [
    '90688243096',
    '32827145000157',
    '49926436048',
    '54003504020'
];

app.post('/dda', (req, res) => {
    const { clientDocument } = req.body;
    regLog(req.body);
    regLog(`Endpoint: /dda | clientDocument: ${clientDocument}`);

    if (blockedDocumentsDDA.includes(clientDocument)) {
        regLog(`Blocked clientDocument: ${clientDocument} at /dda`);

        const body = JSON.stringify({
            statusCode: 400,
            message: 'Blocked client document'
        });

        res.writeHead(400, {
            'Content-Type': 'application/json',
            'Content-Encoding': 'identity',
            'Cache-Control': 'no-store'
        });
        return res.end(body);
    }

    res.writeHead(201, {
        'Content-Encoding': 'identity',
        'Cache-Control': 'no-store'
    });
    res.end();
});

const blockedDocumentsVehicle = [
    '04192841096',
    '03800352001',
    '01202549055',
    '74151283030'
];

app.post('/vehicle-info', (req, res) => {
    const { documentNumber } = req.body;
    regLog(req.body);
    regLog(`Endpoint: /vehicle-info | documentNumber: ${documentNumber}`);

    if (blockedDocumentsVehicle.includes(documentNumber)) {
        regLog(`Blocked documentNumber: ${documentNumber} at /vehicle-info`);

        const body = JSON.stringify({
            statusCode: 400,
            message: 'Blocked document number'
        });

        res.writeHead(400, {
            'Content-Type': 'application/json',
            'Content-Encoding': 'identity',
            'Cache-Control': 'no-store'
        });
        return res.end(body);
    }

    res.writeHead(201, {
        'Content-Encoding': 'identity',
        'Cache-Control': 'no-store'
    });
    res.end();
});

app.post('/payment-vehicle', (req, res) => {
    const { documentNumber } = req.body;
    regLog(req.body);
    regLog(`Endpoint: /payment-vehicle | documentNumber: ${documentNumber}`);

    if (blockedDocumentsVehicle.includes(documentNumber)) {
        regLog(`Blocked documentNumber: ${documentNumber} at /payment-vehicle`);

        const body = JSON.stringify({
            statusCode: 400,
            message: 'Blocked document number'
        });

        res.writeHead(400, {
            'Content-Type': 'application/json',
            'Content-Encoding': 'identity',
            'Cache-Control': 'no-store'
        });
        return res.end(body);
    }

    res.writeHead(201, {
        'Content-Encoding': 'identity',
        'Cache-Control': 'no-store'
    });
    res.end();
});



app.listen(port, ()=>{
       regLog("Listem "+port)
});

app.get('/visualizaLogs', 
(req, resp)=> {
       /*
       if(hasAuthorization(req)){
              regLog("/usuarios");
              resp.status(200).send(usuarios);
       }else{
              semAutorizacao(req, resp);
       }
       */
      var texto="<!DOCTYPE html>"
      texto+='<title>Logs</title>'
      texto+='      <meta charset="UTF-8">'
      texto+='<meta name="viewport" content="width=device-width, initial-scale=1">'
      texto+='<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">'
      texto+='<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">'
      texto+='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">'
      texto+='<style>'
      texto+='.body {font-family: "Lato", sans-serif}'
      texto+='.mySlides {display: none}'
      texto+='</style> <Body>'
      texto += '  <div class="w3-container w3-content w3-center w3-padding-64" style="max-width:800px" id="band">'
      texto += '<h2 class="w3-wide">LOG</h2>'

      for(var i = ultimos100logs.length-1;i>=0;i--){
              texto += '<p class="w3-justify">'+ultimos100logs[i]+'</p>'
      }
      texto += '</body>  </html>';
      resp.status(200).send(texto);
}
);