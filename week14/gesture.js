class Listener {
  constructor(elem, recognizer){
    this.elem = elem;
    this.recognizer = recognizer;
    this.init();
  }

  init(){
    const { elem, recognizer } = this;
    const contexts = new Map();
    let isListeningMouse = false;
    const isMobile = document.documentElement.clientWidth < 640;
    if(!isMobile){
      elem.addEventListener('mousedown', event => {
        let context = Object.create(null);
        contexts.set('mouse'+(1 << event.button), context);
        recognizer.start(event, context);
        let move = function(event){
          let button = 1;
          let key = button;
          while(button <= event.buttons){
            if(button & event.buttons){
              if(button === 2){
                key = 4;
              }else if(button === 4){
                key = 2;
              }
              let context = contexts.get('mouse'+key);
              recognizer.move(event, context);
            }
            button = button << 1;
          }
        };
        let up = function(event){
          let context = contexts.get('mouse'+(1 << event.button));
          recognizer.end(event, context);
          contexts.delete('mouse'+(1 << event.button));
          if(event.buttons === 0){
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            isListeningMouse = false;
          }
        };
        if(!isListeningMouse){
          document.addEventListener('mousemove', move);
          document.addEventListener('mouseup', up);
          isListeningMouse = true;
        }
      });
    }else{
      elem.addEventListener('touchstart', event => {
        for(let touch of event.changedTouches){
          const context = Object.create(null);
          contexts.set(touch.identifier, context);
          recognizer.start(touch, context)
        }
      });
      elem.addEventListener('touchmove', event => {
        for(let touch of event.changedTouches){
          const context = contexts.get(touch.identifier);
          recognizer.move(touch, context);
        }
      });
      elem.addEventListener('touchend', event => {
        for(let touch of event.changedTouches){
          const context = contexts.get(touch.identifier);
          recognizer.end(touch, context);
          contexts.delete(touch.identifier);
        }
      })
      elem.addEventListener('touchcancel', event => {
        for(let touch of event.changedTouches){
          const context = contexts.get(touch.identifier);
          recognizer.cancel(touch);
          contexts.delete(touch.identifier);
        }
      })
    }
  }
}

export class Recognizer{
  constructor(dispatcher){
    this.dispatcher = dispatcher;
  }
  start(point, context){
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    }];
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isTap = true;
    context.isPress = false;
    context.isPan = false;
    context.isFlick = false;
    context.handler = setTimeout(()=>{
      context.isPress = true;
      context.isTap = false;
      context.isPan = false;
      context.isFlick = false;
      context.handler = null;
      this.dispatcher.dispatch('press', {});
    }, 500);
  }
  move(point, context){
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if(!context.isPan && dx**2 + dy**2 > 100){
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isFlick = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      clearTimeout(context.handler);
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        vertical: context.isVertical
      });
    }
    if(context.isPan){
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        vertical: context.isVertical
      });
    }
    context.points = context.points.filter(point => (Date.now() - point.t) < 500);
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
  }
  end(point, context){
    if(context.isTap){
      clearTimeout(context.handler);
      this.dispatcher.dispatch('tap', {});
    }
    if(context.isPress){
      clearTimeout(context.handler);
      this.dispatcher.dispatch('pressend', {});
    }

    let d, v;
    if(!context.points.length){
      v = 0;
    } else {
      
      d = Math.sqrt((point.clientX - context.points[0].x)**2 + (point.clientY - context.points[0].y)**2);
      v = d/(Date.now() - context.points[0].t);
    }
    if(v > 1.5){
      context.isFlick = true;
    } else {
      context.isFlick = false;
    }
    if(context.isPan){
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        vertical: context.isVertical,
        isFlick: context.isFlick
      });
    }
    clearTimeout(context.handler);
  }
  cancel(point, context){
    context.isPan = false;
    context.isTap = true;
    context.isPress = false;
    context.isFlick = false;
    clearTimeout(context.handler)
    this.dispatcher.dispatch('pancancel', {});
  }
}

export class Dispatcher{
  constructor(elem){
    this.elem = elem;
  }
  dispatch(type, options){
    const event = new Event(type, options);
    for(let prop in options){
      event[prop] = options[prop];
    }
    this.elem.dispatchEvent(event);
  }
}

export class Gesture {
  constructor(elem, recognizer){
    const defaultRecognizer = new Recognizer(new Dispatcher(elem));
    this.elem = elem;
    new Listener(elem, recognizer || defaultRecognizer);
  }
  on(type, callback){
    this.elem.addEventListener(type, callback);
  }

  off(type, callback){
    this.elem.removeEventListener(type, callback);
  }
}
