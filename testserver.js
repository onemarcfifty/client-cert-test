// /////////////////////////////////////////
// /////////////////////////////////////////
// Simple Web Server using https, SSL and TLS
// requiring Client certificates
// /////////////////////////////////////////
// /////////////////////////////////////////

// /////////////////////////////////////////
// global vars and options
// /////////////////////////////////////////


var fs = require('fs'); 
var https = require('https'); 
//var tls = require('tls'); 
const { parse } = require('querystring');
const { execSync } = require('child_process');

var options = { 
    hostname:           'testserver',
    port:               8443,
    key:                fs.readFileSync('ca/server.key'),     // copy of letsencrypt or self signed
    cert:               fs.readFileSync('ca/server.crt'),     // copy of letsencrypt or self signed
    ca:                 fs.readFileSync('ca/ca.crt'),         // our self-signed ca (for the client cert)
	  requestCert:        true,
    rejectUnauthorized: true,
    minVersion:         'TLSv1.3',
    maxVersion:         'TLSv1.3'
}; 

// /////////////////////////////////////////
// Server
// /////////////////////////////////////////

var server = https.createServer(options);
server.listen(8443),() => {
  console.log(new Date()+' LISTENING ');
}

// /////////////////////////////////////////
// Request-Handler
// /////////////////////////////////////////


server.on("request", (request, response) => 
{

  // log the request on the console

   console.log(new Date()+' REQUEST '+ 
        request.connection.remoteAddress+' '+ 
        request.socket.getPeerCertificate().subject.CN+' '+ 
        request.method+' '+request.url); 


  // request

  request


    .on("end", () => {
      console.log("END");
    }) // on end

    .on("error", () => {
      response.statusCode = 400;
      response.end();
      console.log("REQ.ERROR");
    }) // on error

    .on("data", chunk => {
      if (( "POST" == request.method ) && ("/formdata" == request.url )) 
      {
        console.log("DATA-POST START");
        console.log(chunk.toString());
        pinhandler(request,chunk);
        console.log("DATA-POST END");
      } // if post
    }); // on data

  // response  

  response.on("error", err => {
    console.err(err);
    console.log("RESP.ERROR");
  }); // on error


  // analyze the URL - we only need one for the html file and one for the response
  // everything else just throws a blunt 401

  // the get request for the /form root
  
  if (( "GET" == request.method ) &&  ("/form" == request.url ) ) {
    formhandler(request,response);
  } 
  else

    // form data has been posted
    if (( "POST" == request.method ) && ("/formdata" == request.url )) {
        formdatareceived(request,response);
    } 

    // everything else -> 401
    else
    {
        response.writeHead(401);
        response.end();
    }

  console.log("OK");
}); // server request callback

// /////////////////////////////////////////
// send the form body
// /////////////////////////////////////////

var formhandler = function (request, response) 
{

  // the /form URI just replies with the content of index.html
  if ("/form" == request.url )
  {
    var htmlFileContent=fs.readFileSync("index.html");
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(htmlFileContent);
    response.end(); 
  }
}

// /////////////////////////////////////////
// receive the form data
// /////////////////////////////////////////

var formdatareceived = function (request, response) 
{
    console.log("PINRECEIVED");
    var htmlFileContent=fs.readFileSync("thankyou.html");
    response.writeHead(200);
    response.write(htmlFileContent);
    response.end(); 
}

var pinhandler = function (request, chunkdata) {
    console.log("PINHANDLER");
    var parseddata = parse(chunkdata.toString());
    console.log (parseddata);
    console.log (parseddata.mqtt);
    // stderr is sent to stderr of parent process
    // you can set options.stdio if you want it to go elsewhere

    // now we could call an MQTT Sender with the parsed data:
    //let stdout = execSync('/usr/bin/mosquitto_pub -h 127.0.0.1 -t ' + parseddata.mqtt + ' -m ' + request.socket.getPeerCertificate().subject.CN + ":" + parseddata.PIN+':');
}

