const http = require('http');

http.createServer((req, res)=>{
  let body = [];
  req.on('error',(err)=>{
    console.error(err);
  }).on('data',(chunk)=>{
    body.push(chunk);
  }).on('end',()=>{
    body = Buffer.concat(body).toString();
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(
`<html>
  <head>
    <style>
      .text{
        color: red;
      }
    </style>
  </head>
  <body>
    <div class="text">Hello World!</div>
  </body>
</html>`
    );
  })
}).listen(8080);

console.log('Http server start at port 8080!');
