import { Gesture } from './gesture';
document.documentElement.addEventListener('contextmenu', (event)=>event.preventDefault())
const gesture = new Gesture(document.documentElement);
gesture.on('tap', (event)=>console.log('tap triggered'));