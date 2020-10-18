import { Component, createElement, STATE, ATTRIBUTES } from '../framework'
import { Animation } from '../animation'
import { Gesture } from '../gesture'
import { ease } from '../timing_function'
import { Timeline } from '../timeline';
import './index.less';

export {STATE, ATTRIBUTES};

class Carousel extends Component {
  constructor(){
    super();
  }

  render(){
    let timer;
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for(let data of this[ATTRIBUTES].data){
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${data.src})`;
      this.root.appendChild(child)
    }
    const children = this.root.children;
    this[STATE].position = 0;
    let timeline = new Timeline();
    timeline.start();
    const gesture = new Gesture(this.root);

    let t = 0; // 动画时间
    let ax = 0; // 动画距离
    let panendTime = 0;
    gesture.on('start', (event)=>{
      timeline.pause();
      clearInterval(timer);
      if(t < panendTime){
        ax = 0;
        return;
      }
      const progress = (Date.now() - t) / 500;
      console.log('progress', progress)
      ax = ease(progress) * 500 - 500
    });

    gesture.on('tap', ()=>{
      this.triggerEvent('click', {
        position: this[STATE].position,
        data: this[ATTRIBUTES].data[this[STATE].position]
      })
    });

    gesture.on('pan', (event)=>{
      const deltaX = event.clientX - event.startX - ax;
      const current = this[STATE].position - ((deltaX - deltaX%500)/500);
      for(let offset of [-1, 0, 1]){
        let pos = current + offset;
        pos = (pos%children.length + children.length)%children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${-pos*500 + offset*500 + deltaX%500}px)`
      }
    });

    gesture.on('end', (event)=>{
      panendTime = Date.now();
      timeline.reset();
      timeline.start();
      timer = setInterval(nextPicture, 3000);

      const deltaX = event.clientX - event.startX - ax;
      const current = this[STATE].position - ((deltaX - deltaX%500)/500);
      let direction = Math.round((deltaX%500)/500);

      if(event.isFlick){
        if(event.velocity > 0){
          direction = Math.ceil((deltaX%500)/500)
        }else{
          direction = Math.floor((deltaX%500)/500)
        }
      }

      for(let offset of [-1, 0, 1]){
        let pos = current + offset;
        pos = (pos%children.length + children.length)%children.length;
        children[pos].style.transition = 'none';
        timeline.add(new Animation(children[pos].style, 'transform', 
          -pos*500 + offset*500 + deltaX%500,
          -pos*500 + offset*500 + direction * 500,
          500, 0, ease, (v)=>`translateX(${v}px)`))
      }
      this[STATE].position = this[STATE].position - ((deltaX-deltaX%500)/500) - direction;
      this[STATE].position = (this[STATE].position%children.length + children.length)%children.length;
      // this.triggerEvent('change', {position: this[STATE].position} )
    })

    const nextPicture = ()=>{
      t = Date.now();
      let nextIndex = (this[STATE].position+1) % children.length;
      let current = children[this[STATE].position];
      const next = children[nextIndex];
      timeline.add(new Animation(current.style, 'transform', - this[STATE].position*500, -500-this[STATE].position*500, 500, 0, ease, (v)=>`translateX(${v}px)`))
      timeline.add(new Animation(next.style, 'transform', 500-nextIndex*500, -nextIndex*500, 500, 0, ease, (v)=>`translateX(${v}px)`))
      this[STATE].position = nextIndex;
      // this.triggerEvent('change', {position: this[STATE].position} )
    }
    timer = setInterval(nextPicture, 3000)
    return this.root;
  }
}

export default Carousel;