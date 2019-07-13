import Mundane from './Mundane';

let mundane = new Mundane(window,
  (e) => console.log('Mundane All before', e),
  (e) => console.log('Mundane All after', e),
  (e) => console.log('Mundane error', e)
);
let appends = 0;
let lastAppend = Date.now();
const appendToBox = (e, boxId = "default") => {
  let text;
  if (typeof e === 'object'){
    if (e instanceof CustomEvent){
      console.log(e);
      text = e.type + " " + e.detail.data;
    } else {
      text = e.type;
    }
  } else if (typeof e === 'string'){
    text = e;
  }
  let r = document.getElementById("result-town");
  
  let containerBox = document.getElementById(boxId);
  if (!containerBox){
    containerBox = document.createElement("div");
    containerBox.setAttribute('id',boxId);
    r.appendChild(containerBox);
  }
  
  let p = document.createElement('p');
  let timeSpan = document.createElement('strong')
  let now = Date.now();
  let span = now - lastAppend;
  lastAppend = now;
  timeSpan.textContent = appends + ". || " + now + " || +" + span + "ms || ";
  appends += 1;
  let textSpan = document.createElement('span');
  textSpan.textContent = text;
  containerBox.insertBefore(p,containerBox.firstChild);
  // if (r.childElementCount > ){
  //   r.removeChild(r.lastChild);
  // }
  p.appendChild(timeSpan);
  p.appendChild(textSpan);
}

mundane.observe('hello', 
  appendToBox,
  () => appendToBox('before hello observed'),
  () => appendToBox('after hello observed'),
  () => mundane.sleep(350)
  );
  
mundane.observe('click', 
  appendToBox,
  () => appendToBox('before click observed'),
  () => appendToBox('500ms after click observed'),
  () => mundane.sleep(500)
  );

let mevs = [
  mundane.make('hello', {data: 1000}),
  mundane.make('hello', {data: 2000}),
  mundane.make('hello', {data: 3000}),
  mundane.make('hello', {data: 4000}),
].forEach((mev,i) => {
  mundane.occurIn(i*1000, mev, () => {}, () => {});
});


let sequence = mundane.sequence([
  {afterMs: 4500, func: () => appendToBox('HERE COMES A SEQUENCE ~~~')},
  {afterMs: 500, func: () => appendToBox('sequence step 1')},
  {afterMs: 120, func: () => appendToBox('sequence step 2')},
  {afterMs: 250, func: () => appendToBox('sequence step 3')},
  {afterMs: 500, func: () => appendToBox('sequence step 4')},
  {afterMs: 600, func: () => appendToBox('sequence step 5')},
  {afterMs: 300, func: () => appendToBox('sequence step 6')}
], (stepResult , _seqStart, _stepEnd) => appendToBox(
  `seqStart: ${_seqStart} ~ ` +
  `seq delta: ${Date.now() - _seqStart} ~ ` +
  `afterMs: ${stepResult.step.afterMs} ~ `
  )
);


let sequenceTwo = mundane.sequence([
  {afterMs: 5000, func: () => appendToBox('ANOTHER SEQUENCE ~~~')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 1')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 2')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 3')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 4')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 5')},
  {afterMs: 250, func: () => appendToBox('ANOTHER sequence step 6')}
], (stepResult , _seqStart, _stepEnd) => appendToBox(
  `seqStart: ${_seqStart} ~ ` +
  `seq delta: ${Date.now() - _seqStart} ~ ` +
  `afterMs: ${stepResult.step.afterMs} ~ `
  )
);

let tick = mundane.sequence([
  {afterMs: 125,
  func: () => {
    appendToBox("tick", "tickbox");
  }}
], (sr, _seqStart, _stepEnd) => {
  
}, true);