const css = require('css');
const layout = require('./layout');
const EOF = Symbol('EOF');
const spaceReg = /^[\t\f\n ]$/;
const tagNameReg = /^[a-zA-Z]$/;
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
const stack = [{type: 'document', children: []}];
const rules = [];

function addCssRules(text){
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector){
  if(!element || !selector){
    return false;
  }
  // id 选择器
  if(selector.charAt(0) === '#'){
    const attr = element.attributes.filter(attr => attr.name === 'id')[0];
    if(attr && attr.value === selector.replace('#', '')){
      return true;
    }
  }else if(selector.charAt(0) === '.'){// 类选择器
    const attr = element.attributes.filter(attr => attr.name === 'class')[0];
    if(attr && attr.value === selector.replace('.', '')){
      return true;
    }
  }else{// 标签选择器
    if(selector === element.tagName){
      return true;
    }
  }
  return false;
}

function specificity(selector){
  const p = [0, 0, 0, 0]; // inline, id, class, tag
  const selectorParts = selector.split(' ');
  for(let part of selectorParts){
    if(part.charAt(0) === '#'){ // id
      p[1] += 1;
    }else if(part.charAt(0) === '.'){// class
      p[2] += 1;
    }else{
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2){
  if(sp1[0] - sp2[0]){
    return sp1[0] - sp2[0];
  }
  if(sp1[1] - sp2[1]){
    return sp1[0] - sp2[1];
  }
  if(sp1[2] - sp2[2]){
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function computeCSS(element){
  const elements = stack.slice().reverse();
  if(!element.computedStyle){
    element.computedStyle = {};
  }
  for(let rule of rules){
    // 认为只由空格分隔的简单选择器
    const selectorParts = rule.selectors[0].split(' ').reverse();
    if(!match(element, selectorParts[0])){
      continue;
    }
    let matched = false;
    let j = 1;
    for(let i=0; i<elements.length; i++){
      if(match(elements[i], selectorParts[j])){
        j++;
      }
      // 说明选择器都被匹配完了
      if(j >= selectorParts.length){
        matched = true;
      }
      if(matched){
        const computedStyle = element.computedStyle;
        const sp = specificity(rule.selectors[0]);
        for(let declaration of rule.declarations){
          const { property, value } = declaration;
          if(!computedStyle[property]){
            computedStyle[property] = {};
          }
          if(!computedStyle[property].specificity){
            computedStyle[property].value = value;
            computedStyle[property].specificity = sp;
          }else if(compare(computedStyle[property].specificity, sp) < 0){
            computedStyle[property].value = value;
            computedStyle[property].specificity = sp;
          }
        }
      }
    }
  }
  return element;
}

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
    element = computeCSS(element)
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
      if(token.tagName === 'style'){
        addCssRules(top.children[0].content);
      }
      layout(top);
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
    return;
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
  if(s.match(spaceReg) || s === '/' || s === '>' || s === EOF){
    return beforeAttributeValue;
  }else if(s === '\"'){
    return doubleQuotedAttributeValue;
  }else if(s === '\''){
    return singleQuotedAttributeValue;
  }else if(s === '>'){
    return data;
  }else{
    return unQuotedAttributeValue;
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
    currentAttribute.name += s;
    return beforeAttributeValue;
  }
}

function singleQuotedAttributeValue(s){
  if(s === '\''){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }else if(s === '\u0000'){

  }else if(s === EOF){

  }else{
    currentAttribute.name += s;
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
  let state = data;
  for(let s of html){
    state = state(s);
  }
  state = state(EOF);
  return stack[0];
}

module.exports = {
  parseHTML: parser
};
