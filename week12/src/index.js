import {Component, createElement} from './framework'
import './index.less';

class Carousel extends Component {
  constructor(){
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value){
    this.attributes[name] = value;
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add('carousel')
    for(let src of this.attributes.src){
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${src})`;
      this.root.appendChild(child)
    }
    // 鼠标控制轮播
    if(!this.attributes.auto){
      const children = this.root.children;
      let position = 0;
      this.root.addEventListener('mousedown', (event)=>{
        const startX = event.clientX;
        
        const move = (event) => {
          const deltaX = event.clientX - startX;
          for(let offset of [-1, 0, 1]){
            let pos = position + offset;
            pos = (pos + children.length)%children.length;
            console.log('pos', pos, children.length)
            children[pos].style.transition = 'none';
            children[pos].style.transform = `translateX(${-pos*500 + offset*500 + deltaX}px)`
          }
        };
        const up = (event) => {
          const deltaX = event.clientX - startX;
          position = (position - Math.round(deltaX/500) + children.length)%children.length;
          console.log('position', position)
          for(let offset of [0, Math.sign(deltaX)*Math.sign(Math.abs(deltaX)-250)]){
            let pos = position + offset;
            pos = (pos + children.length)%children.length;
            children[pos].style.transition = '';
            children[pos].style.transform = `translateX(${-pos*500 + offset*500}px)`
          }
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up)
      })
    }else{
      // 自动轮播
      let currentIndex = 0;
      const children = this.root.children;
      setInterval(()=>{
        let nextIndex = (currentIndex+1) % children.length;
        let current = children[currentIndex];
        const next = children[nextIndex];
        next.style.transition = 'none';
        next.style.transform = `translateX(${100-nextIndex*100}%)`;
        setTimeout(()=>{
          next.style.transition = '';
          next.style.transform = `translateX(${-nextIndex*100}%)`
          current.style.transform = `translateX(${-100-currentIndex*100}%)`
          currentIndex = nextIndex;
        }, 16)
      }, 1000)
    }

    return this.root;
  }

  mountTo(parent){
    parent.appendChild(this.render())
  }
}

const imgs = [
  'http://static001.geekbang.org/resource/image/95/d1/95775d0927a580170673aedfc70e33d1.jpg',
  'http://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'http://static001.geekbang.org/resource/image/9f/28/9f68cbdfd275739a1cd3a4dfa85ead28.jpg',
  'http://static001.geekbang.org/resource/image/93/15/930dd42f9a18d851eeededf14dbc0b15.jpg'
]

let a = <Carousel src={imgs} auto={true}/>;
let b = <Carousel src={imgs}/>;

a.mountTo(document.body)
b.mountTo(document.body)
