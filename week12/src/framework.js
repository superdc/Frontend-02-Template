export function createElement(type, attributes, ...children){
  let elem;
  if(typeof type === 'string'){
    elem = new ElementWrapper(type)
  }else{
    elem = new type
  }
  for(let attr in attributes){
    elem.setAttribute(attr, attributes[attr])
  }
  for(let child of children){
    if(typeof child === 'string'){
      child = new TextWrapper(child)
    }
    child.mountTo(elem)
  }
  return elem;
}

export class Component {
  constructor(){
  }

  setAttribute(name, value){
    this.root.setAttribute(name, value)
  }

  appendChild(child){
    child.mountTo(this.root)
  }

  mountTo(parent){
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component {
  constructor(type){
    this.root = document.createElement(type) 
  }
}

class TextWrapper extends Component {
  constructor(content){
    this.root = document.createTextNode(content) 
  }
}