// 创建动画
import {ease, easeIn, easeOut, easeInOut} from './timing_function';

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template){
    
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || (v=>v);
    this.template = template || (v=>v);
  }

  receive(time){
    const range = this.endValue - this.startValue;
    const progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}
