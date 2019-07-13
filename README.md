# Mundane Events

```
                 )  (                 )       
  (  `           ( /(  )\ )    (      ( /(       
  )\))(      (   )\())(()/(    )\     )\()) (    
 ((_)()\     )\ ((_)\  /(_))((((_)(  ((_)\  )\   
 (_()((_) _ ((_) _((_)(_))_  )\ _ )\  _((_)((_)  
 |  \/  || | | || \| | |   \ (_)_\(_)| \| || __| 
 | |\/| || |_| || .` | | |) | / _ \  | .` || _|  
 |_|  |_| \___/ |_|\_| |___/ /_/ \_\ |_|\_||___| 


 ---------------
 ^^^ Font Name: Fire Font-k (http://patorjk.com/software/taag) ^^^
 ---------------

 ###############

 Mundane Events

 Cheeky lib wrapping browser events with some basic timing, scheduling and hooks.

 ###############
```

## Getting it

Um since i added the generator-based sequence I realised the whole idea of
this is made unnecessary. Before and After become steps in a sequence.
Every step is async, no need for feeling fancy with promises. If you 
just handle execution in a resonable way initially it all works.


Look at `test.html` to get the idea.

If you clone it and open that it'll probably work and do some stuff and you'll see. 

## Examples

_Mostly taken from `Mundane.test.js`_

```typescript
constructor (
  context: any,
  beforeHandler: (mev: any) => void,
  afterHandler: (mev: any) => void,
  errorHandler: (mev: any) => void,
  options: object
)
```

```javascript
import Mundane from './Mundane';

let mundane = new Mundane(window,
  (e) => console.log('Mundane All before', e),
  (e) => console.log('Mundane All after', e),
  (e) => console.log('Mundane error', e)
);
```

----

```typescript
public observe (mevName: string, 
  react: (mev: any) => void, 
  before: (mev: any) => void, 
  after: (mev: any) => void, 
  eventPromiseGenerator: (mev: any) => Promise<any>, 
  subject?: any
)

```

```javascript
mundane.observe('click', 
  console.log,
  () => console.log('before click observed'),
  () => console.log('500ms after click observed'),
  () => mundane.sleep(500)
);
```


----

```typescript
public occurIn(time: number, 
  mev: any, 
  before: (mev: any) => void, 
  after: (mev: any) => void, 
  eventPromise?: Promise<any>
) 
```

What kind of idiot am I making the before and after func arguments not optional? Geez somebody should punish me with a good hard pull request.

```javascript
let mevent = mundane.make('hello', {data: 500});
mundane.occurIn(500, mevent, () => {}, () => {});

let mevs = [
  mundane.make('hello', {data: 1000}),
  mundane.make('hello', {data: 2000}),
  mundane.make('hello', {data: 3000}),
  mundane.make('hello', {data: 4000}),
].forEach((mev,i) => {
  mundane.occurIn(i*1000, mev, () => {}, () => {});
});

```

----

```typescript
public sequence(
  sequence: IMundaneSequenceStep[], 
  onStep: (step: any) => void
)
```

```javascript
let sequence = mundane.sequence([
  {afterMs: 4500, func: () => console.log('HERE COMES A SEQUENCE ~~~')},
  {afterMs: 500, func: () => console.log('sequence step 1')},
  {afterMs: 120, func: () => console.log('sequence step 2')},
  {afterMs: 250, func: () => console.log('sequence step 3')},
  {afterMs: 500, func: () => console.log('sequence step 4')},
  {afterMs: 600, func: () => console.log('sequence step 5')},
  {afterMs: 300, func: () => console.log('sequence step 6')}
], (step) => console.log("this step waited " + step.afterMs));
```