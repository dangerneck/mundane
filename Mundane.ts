/**
 *
 *                 )  (                 )       
 *  (  `           ( /(  )\ )    (      ( /(       
 *  )\))(      (   )\())(()/(    )\     )\()) (    
 * ((_)()\     )\ ((_)\  /(_))((((_)(  ((_)\  )\   
 * (_()((_) _ ((_) _((_)(_))_  )\ _ )\  _((_)((_)  
 * |  \/  || | | || \| | |   \ (_)_\(_)| \| || __| 
 * | |\/| || |_| || .` | | |) | / _ \  | .` || _|  
 * |_|  |_| \___/ |_|\_| |___/ /_/ \_\ |_|\_||___| 
 *
 *
 * ---------------
 * ^^^ Font Name: Fire Font-k (http://patorjk.com/software/taag) ^^^
 * ---------------
 *
 * ###############
 *
 * Mundane Events
 *
 * Cheeky lib wrapping browser events with some basic timing, scheduling and hooks.
 *
 * ###############
 */

interface IMundaneOptions {
  logging: IMundaneLoggingOptions;
}

interface IMundaneLoggingOptions {
  disposeLogs: () => void;
  keepLog: boolean;
  log: (m:object) => void;
  maxLogs: number;
}

interface IMundaneSequenceStep {
  afterMs: number;
  func: () => void;
}

export default class Mundane {
  public beforeMev: (mev: any) => void;
  public afterMev: (mev: any) => void;
  public onMevError: (mev: any) => void;
  private ctx: any;
  private mundaneLog: any[];
  private creeps: any[];
  private options: IMundaneOptions;

  constructor (
    context: any,
    beforeHandler: (mev: any) => void,
    afterHandler: (mev: any) => void,
    errorHandler: (mev: any) => void,
    options: object
  ) {
    this.ctx = context || window || {};
    this.beforeMev = beforeHandler || ((mev: any) => null);
    this.afterMev = afterHandler || ((mev: any) => null);
    this.onMevError = errorHandler || ((mev: any) => null);
    this.options = {
      logging: {
        disposeLogs: () => {
          this.mundaneLog = [];
        },
        keepLog: true,
        log: (m: object) => {
          this.mundaneLog.unshift({
            m,
            t: Date.now(),
          });
        },
        maxLogs: Infinity,
      },
      ...options
    };
    this.creeps = [];
    this.mundaneLog = [];
  }

  public sleep (ms: number) {
    return new Promise((yes, no) => {
      setTimeout(yes, ms);
    });
  }

  public make (mevName: string, deets: object) {
    return new CustomEvent(mevName, {detail: deets});
  }

  public hookAndPromise (context: any, func: (mev: any) => void, before: (mev: any) => void,  after: (mev: any) => void, eventPromiseGenerator: (mev: any) => Promise<any>) {
    return (mev: any) => {
      if (before) {
        before.call(context, mev);
      }
      const doResponse = func(mev);
      if (eventPromiseGenerator) {
        return eventPromiseGenerator(mev).then((res: any) => {
          after.call(context, mev, doResponse, res);
        });
      } else {
        return after.call(context, mev, doResponse);
      }
    };
  }
  
  public occur (mev: any, before: (mev: any) => void, after: (mev: any) => void, eventPromise?: Promise<any>) {
    const hookedDispatch = this.hookAndPromise(
      this.ctx,
      (mev: any) => this.ctx.dispatchEvent(mev),
      before,
      after,
      eventPromise
    );
    this.beforeMev(mev);
    if (this.options.logging.keepLog){
      this.options.logging.log(mev);
    }
    const hookedResult = hookedDispatch(mev);
    if (hookedResult instanceof Promise){
      return hookedResult.then(() => {
        this.afterMev(mev);
      });
    } else {
      this.afterMev(mev);
      return hookedResult;
    }
  }

  public occurIn(time: number, mev: any, before: (mev: any) => void, after: (mev: any) => void, eventPromise?: Promise<any>) {
    return this.sleep(time).then(() => {
      return this.occur(mev, before, after, eventPromise);
    });
  }

  public sequence(sequence: IMundaneSequenceStep[], onStep: (step: any) => void) {
    const sequencePromises = sequence.map(step => {
      return () => this.sleep(step.afterMs).then((f: any) => {
        onStep(step);
        step.func();
      });
    });
    const applyAsync = (acc: any, val: any) => acc.then(val);
    const composeAsync = (funcs: any[]) => () => funcs.reduce(applyAsync, Promise.resolve());
    const sequenceGo = composeAsync(sequencePromises);
    return sequenceGo();
  }

  public observe (mevName: string, react: (mev: any) => void, before: (mev: any) => void, after: (mev: any) => void, eventPromiseGenerator: (mev: any) => Promise<any>, subject?: any ) {
    const sub = subject || this.ctx;
    const hookedReaction = this.hookAndPromise(sub, react, before, after, eventPromiseGenerator);
    sub.addEventListener(mevName, hookedReaction),
    this.creeps.unshift({
      hookedReaction,
      mevName,
      subject: sub,
    });
  }

  public stop () {
    for (const creep of this.creeps) {
      creep.subject.removeEventListener(creep.mevName, creep.hookedReaction);
    }
  }
}