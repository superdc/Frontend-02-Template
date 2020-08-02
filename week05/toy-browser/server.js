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
      .flex{
        display: flex;
        width: 500px;
        height: 300px;
        background-color: rgb(255,255,255);
      }
      .flex #myId{
        width:200px;
        height: 100px;
        background-color: rgb(255,0,0);
      }
      .flex .item{
        flex: 1;
        background-color: rgb(0,255,0);
      }
    </style>
  </head>
  <body>
    <div class="flex">
      <div id="myId">2</div>
      <div class="item">3</div>
    </div>
  </body>
</html>`
    );
  })
}).listen(8080);

console.log('Http server start at port 8080!');
