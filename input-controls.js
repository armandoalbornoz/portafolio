// Use physical codes so shifted characters and the number pad remain distinct.
const actions=Object.freeze({ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',KeyW:'up',KeyA:'left',KeyS:'down',KeyD:'right',Enter:'select',NumpadEnter:'select',Escape:'back',Backspace:'back'});
export const actionKeyCodes=Object.freeze({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',select:'Enter',back:'Escape'});
export function actionForCode(code){return actions[code]??null;}
export function navigationIndex(current,action,count){const direction=({up:-1,left:-1,down:1,right:1})[action];return direction===undefined?null:(current+direction+count)%count;}
