const EOF = Symbol('EOF');
const spaceReg = /^[\t\f\n ]$/;
const tagNameReg = /^[a-zA-Z]$/;
let currentToken;
let currentAttribute;
let currentTextNode;
let stack;

function emit(token){
  let top = stack[stack.length - 1];
  if(token.type === 'startTag'){
    let element = {
      type: 'element',
      children: [],
      attributes: [],
      tagName: token.tagName
    };
    for(let p in token){
      if(p !== 'type' && p !== 'tagName'){
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    top.children.push(element);
    element.parent = top;
    if(!token.isSelfClosing){
      stack.push(element);
    }
    currentTextNode = null;
  }else if(token.type === 'endTag'){
    if(top.tagName !== token.tagName){
      throw new Error(`Tag start end doesn't match!`);
    }else{
      stack.pop();
    }
    currentTextNode = null;
  }else if(token.type === 'text'){
    if(currentTextNode === null){
      currentTextNode = token;
      top.children.push(currentTextNode);
    }else{
      currentTextNode.content += token.content;
    }
  }
}

function data(s){
  if(s === '<'){
    return tagOpen;
  }else if( s === EOF ){
    emit({
      type: 'EOF'
    })
    return;
  }else{
    emit({
      type: 'text',
      content: s
    })
    return data;
  }
}

function tagOpen(s){
  if(s === '/'){
    return endTagOpen;
  }else if(s.match(tagNameReg)){
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(s);
  }else{
    emit({
      type: 'text',
      content: s
    })
    return data;
  }
}

function tagName(s){
  if(s.match(spaceReg)){
    return beforeAttributeName;
  }else if(s === '/'){
    return selfClosingStartTag;
  }else if(s === '>'){
    emit(currentToken)
    return data;
  }else if(s.match(tagNameReg)){
    currentToken.tagName += s;
    return tagName;
  }else{
    return tagName;
  }
}

function endTagOpen(s){
  if(s.match(tagNameReg)){
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(s);
  }else if(s === '>'){

  }else if(s === EOF){

  }else{

  }
}

function beforeAttributeName(s){
  if(s.match(spaceReg)){
    return beforeAttributeValue;
  }else if(s === '/' || s === '>' || s === EOF){
    return afterAttributeName(s);
  }else if(s === '='){
    
  }else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(s);
  }
}

function beforeAttributeValue(s){
  if(s.match(spaceReg) || s === '/' || s === EOF){
    return beforeAttributeValue;
  }else if(s === '\"'){
    return doubleQuotedAttributeValue;
  }else if(s === '\''){
    return singleQuotedAttributeValue;
  }else if(s === '>'){
    throw new Error('parse error')
  }else{
    return unQuotedAttributeValue(s);
  }
}

function doubleQuotedAttributeValue(s){
  if(s === '\"'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }else if(s === '\u0000'){

  }else if(s === EOF){

  }else{
    currentAttribute.value += s;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(s){
  if(s.match(spaceReg)){
    return beforeAttributeName;
  }else if(s === '/'){
    return selfClosingStartTag;
  }else if(s === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }else if(s === EOF){
    
  }else{
    throw new Error('parse error');
  }
}

function singleQuotedAttributeValue(s){
  if(s === '\''){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }else if(s === '\u0000'){

  }else if(s === EOF){

  }else{
    currentAttribute.value += s;
    return singleQuotedAttributeValue;
  }
}

function afterAttributeName(s){
  if(s.match(spaceReg)){
    return afterAttributeName;
  }else if(s === '/'){
    return selfClosingStartTag;
  }else if(s === '='){
    return beforeAttributeValue;
  }else if(s === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }else if(s === EOF){

  }else{
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(s);
  }
}

function unQuotedAttributeValue(s){
  if(s.match(spaceReg)){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  }else if(s === '/'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  }else if(s === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }else if(s === '\u0000'){
    
  }else if(s === '\"' || s === '\'' || s === '<' || s === '=' || s === '`'){

  }else if(s === EOF){
    
  }else{
    currentAttribute.value += s;
    return unQuotedAttributeValue;
  }
}

function attributeName(s){
  if(s.match(spaceReg) || s === '/' || s === '>' || s === EOF){
    return afterAttributeName(s);
  }else if(s === '='){
    return beforeAttributeValue;
  }else if(s === '\u0000'){

  }else if(s === EOF){

  }else{
    currentAttribute.name += s;
    return attributeName;
  }
}

function selfClosingStartTag(s){
  if(s === '>'){
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  }else if(s === EOF){

  }else{

  }
}

function parser(html){
  currentToken = null;
  currentAttribute = null;
  currentTextNode = null;
  stack = [{type: 'document', children: []}];
  let state = data;
  for(let s of html){
    state = state(s);
  }
  state = state(EOF);
  return stack[0];
}

export default parser;
