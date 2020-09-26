import { Timeline } from './timeline';
import { Animation } from './animation';
import { ease, easeIn, easeOut, easeInOut} from './timing_function';
import './index.less';

const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const tl = new Timeline();
const animation = new Animation(document.getElementById('el').style, 'transform', 0, 500, 2000, 0, ease, (v)=>`translateX(${v}px)`)
tl.add(animation);
tl.start();
pauseBtn.addEventListener('click', ()=>tl.pause() )
resumeBtn.addEventListener('click', ()=>tl.resume() )
