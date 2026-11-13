const key='armando.portfolio.intro.v1';
export function hasSeenIntro(storage){try{return (storage??globalThis.localStorage).getItem(key)==='seen';}catch{return false;}}
export function rememberIntro(storage){try{(storage??globalThis.localStorage).setItem(key,'seen');return true;}catch{return false;}}
