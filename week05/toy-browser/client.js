const net = require('net');
const parser = require('./parser');
const images = require('images');
const render = require('./render');

class Request {
  constructor(options){
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
    this.body = options.body || {};
    if(!this.headers['Content-Type']){
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }else if(this.headers['Content-Type'] === 'application/json'){
      this.bodyText = JSON.stringify(this.body);
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection){
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if(connection){
        connection.write(this.toString());
      }else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, ()=>{
          connection.write(this.toString());
        })
      }
      connection.on('data', data => {
        parser.receive(data.toString());
        if(parser.isFinished){
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on('error', err => {
        reject(err);
        connection.end();
      })
    })
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
  }
}

class ResponseParser {
  constructor(){
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
    this.current = this.waitingStatusLine;
  }

  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response(){
    const [, statusCode, statusText ] = this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: Number(statusCode),
      statusText,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string){
    for(let i = 0; i < string.length; i++){
      this.current(string.charAt(i));
    }
  }

  waitingStatusLine(s){
    if(s === '\r'){
      this.current = this.waitingStatusLineEnd;
    }else{
      this.statusLine += s;
    }
  }
  
  waitingStatusLineEnd(s){
    if(s === '\n'){
      this.current = this.waitingHeaderName;
    }
  }

  waitingHeaderName(s){
    if(s === ':'){
      this.current = this.waitingHeaderSpace;
    }else if(s === '\r'){ // headers 为空 或 headers 遍历结束
      this.current = this.waitingHeaderBlockEnd;
      if(this.headers['Transfer-Encoding'] === 'chunked'){
        this.bodyParser = new ChunkedBodyParser();
      }
    }else{
      this.headerName += s;
    }
  }

  waitingHeaderSpace(s){
    if(s === ' '){
      this.current = this.waitingHeaderValue;
    }
  }

  waitingHeaderValue(s){
    if(s === '\r'){
      this.current = this.waitingHeaderLineEnd;
      this.headers[this.headerName] = this.headerValue;
      this.headerName = '';
      this.headerValue = '';
    }else{
      this.headerValue += s;
    }
  }

  waitingHeaderLineEnd(s){
    if(s === '\n'){
      this.current = this.waitingHeaderName;
    }
  }

  waitingHeaderBlockEnd(s){
    if(s === '\n'){
      this.current = this.waitingBody;
    }
  }

  waitingBody(s){
    this.bodyParser.receiveChar(s);
  }
}

class ChunkedBodyParser{
  constructor(){
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.waitingLength;
  }

  receiveChar(s){
    this.current(s);
  }

  waitingLength(s){
    if(this.isFinished) return;
    if(s === '\r'){
      if(this.length === 0){
        this.isFinished = true;
        return;
      }
      this.current = this.waitingLengthLineEnd;
    }else{
      this.length *= 16;
      this.length += parseInt(s, 16);
    }
  }
  waitingLengthLineEnd(s){
    if(s === '\n'){
      this.current = this.readingChunk;
    }
  }

  readingChunk(s){
    this.content.push(s);
    this.length--;
    if(this.length === 0){
      this.current = this.waitingNewLine;
    }
  }

  waitingNewLine(s){
    if(s === '\r'){
      this.current = this.waitingNewLineEnd;
    }
  }

  waitingNewLineEnd(s){
    if(s === '\n'){
      this.current = this.waitingLength;
    }
  }
}

(
  async function(){
    const request = new Request({
      host: '127.0.0.1',
      port: '8080',
      path: '/',
      method: 'POST',
      headers: {
        ['X-Token']: '348477324923'
      },
      body: {
        name: 'superDC'
      }
    });
    let response = await request.send();
    let dom = parser.parseHTML(response.body);
    let viewport = images(800, 600);
    render(viewport, dom);
    viewport.save('viewport.jpg');
  }
)();
