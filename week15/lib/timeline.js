// 控制动画开始，暂停，恢复 
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick_handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start_time');
const PAUSE_START = Symbol('pause_start');
const PAUSE_TIME = Symbol('pause_time');
const INITED = 'INITED';
const STARTED = 'STARTED';
const PAUSED = 'PAUSED';

export class Timeline {
  constructor(){
    this.state = INITED;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start(){
    if(this.state !== INITED){
      return;
    }
    this.state = STARTED;
    const startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      const now = Date.now();
      let t;
      for(let animation of this[ANIMATIONS]){
        if(this[START_TIME].get(animation) < startTime){
          t = Date.now() - startTime - this[PAUSE_TIME] - animation.delay;
        }else{
          t = Date.now() - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
        }
        // 执行时间超过 duration
        if(animation.duration < t){
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        if(t > 0){
          animation.receive(t);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]();
  }

  pause(){
    if(this.state !== STARTED){
      return;
    }
    this.state = PAUSED;
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }

  resume(){
    if(this.state !== PAUSED){
      return;
    }
    this.state = STARTED;
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]()
  }

  reset(){
    this.pause();
    this.state = INITED;
    this[PAUSE_START] = 0;
    this[PAUSE_TIME] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
  }

  add(animation, delay){
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, delay || Date.now());
  }
}
