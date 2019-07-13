/***
 *       *
 *     (  `                     (                                                              )
 *     )\))(      (             )\ )      )             (      (       )       (            ( /(
 *    ((_)()\    ))\    (      (()/(   ( /(    (       ))\     )\     /((     ))\    (      )\())  (
 *    (_()((_)  /((_)   )\ )    ((_))  )(_))   )\ )   /((_)   ((_)   (_))\   /((_)   )\ )  (_))/   )\
 *    |  \/  | (_))(   _(_/(    _| |  ((_)_   _(_/(  (_))     | __|  _)((_) (_))    _(_/(  | |_   ((_)
 *    | |\/| | | || | | ' \)) / _` |  / _` | | ' \)) / -_)    | _|   \ V /  / -_)  | ' \)) |  _|  (_-<
 *    |_|  |_|  \_,_| |_||_|  \__,_|  \__,_| |_||_|  \___|    |___|   \_/   \___|  |_||_|   \__|  /__/
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

/**
 *
 *
 * @interface IMundaneOptions
 */
interface IMundaneOptions {
  logging: IMundaneLoggingOptions;
}

/**
 *
 *
 * @interface IMundaneLoggingOptions
 */
interface IMundaneLoggingOptions {
  disposeLogs: () => void;
  keepLog: boolean;
  log: (m: object) => void;
  maxLogs: number;
}

/**
 *
 *
 * @interface IMundaneSequenceStep
 */
interface IMundaneSequenceStep {
  afterMs: number;
  func: () => any;
}

/**
 *
 *
 * @export
 * @class Mundane
 */
export default class Mundane {
  beforeMev: (mev: any) => void;
  afterMev: (mev: any) => void;
  onMevError: (mev: any) => void;
  ctx: any;
  mundaneLog: any[];
  creeps: any[];
  options: IMundaneOptions;
  observedSequenceTrie: any;
  observedSequenceCallbacks: object;

  /**
   *Creates an instance of Mundane.
   * @param {*} context
   * @param {(mev: any) => void} beforeHandler
   * @param {(mev: any) => void} afterHandler
   * @param {(mev: any) => void} errorHandler
   * @param {object} options
   * @memberof Mundane
   */
  constructor(
    context: any,
    beforeHandler: (mev: any) => void,
    afterHandler: (mev: any) => void,
    errorHandler: (mev: any) => void,
    options: object
  ) {
    this.ctx = context || window || {};
    // this.observedSequenceTrie = new Trie();
    // this.observedSequenceCallbacks = {};
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
            t: Date.now()
          });
        },
        maxLogs: Infinity
      },
      ...options
    };
    this.creeps = [];
    this.mundaneLog = [];
  }

  /**
   * resolve a promise after [ms] milliseconds
   *
   * @param {number} ms
   * @returns
   * @memberof Mundane
   */
  sleep(ms: number) {
    return new Promise((yes, no) => {
      setTimeout(yes, ms);
    });
  }

  /**
   *
   *
   * @param {string} mevName
   * @param {object} deets
   * @returns CustomEvent(mevName, {detail: deets})
   * @memberof Mundane
   */
  make(mevName: string, deets: object) {
    return new CustomEvent(mevName, { detail: deets });
  }

  /**
   * wrap [mev] in a before -> promise? -> after hook
   *
   * @param {*} context
   * @param {(mev: any) => void} func
   * @param {(mev: any) => void} [before]
   * @param {(mev: any) => void} [after]
   * @param {(mev: any) => Promise<any>} [eventPromiseGenerator]
   * @returns
   * @memberof Mundane
   */
  hookAndPromise(
    context: any,
    func: (mev: any) => void,
    before?: (mev: any) => void,
    after?: (mev: any) => void,
    eventPromiseGenerator?: (mev: any) => Promise<any>
  ) {
    return (mev: any) => {
      if (before) {
        before.call(context, mev);
      }
      const doResponse = func(mev);
      if (eventPromiseGenerator) {
        let eventPromise = eventPromiseGenerator(mev);
        if (eventPromise.then) {
          return eventPromise.then((res: any) => {
            if (after) {
              after.call(context, mev, doResponse, res);
            }
          });
        } else {
          console.warn(
            "event promise generator did not return a promise",
            eventPromise
          );
          return eventPromise;
        }
      } else {
        return after && after.call(context, mev, doResponse);
      }
    };
  }

  /**
   * trigger the [mev] event with the before -> promise? -> after decorator
   *
   * @param {*} mev
   * @param {(mev: any) => void} [before]
   * @param {(mev: any) => void} [after]
   * @param {Promise<any>} [eventPromise]
   * @returns
   * @memberof Mundane
   */
  occur(
    mev: any,
    before?: (mev: any) => void,
    after?: (mev: any) => void,
    eventPromise?: Promise<any>
  ) {
    const hookedDispatch = this.hookAndPromise(
      this.ctx,
      (m: any) => this.ctx.dispatchEvent(mev),
      before,
      after,
      (m: any) => eventPromise || Promise.resolve(mev)
    );
    this.beforeMev(mev);
    if (this.options.logging.keepLog) {
      this.options.logging.log(mev);
    }
    const hookedResult = hookedDispatch(mev);
    if (hookedResult instanceof Promise) {
      return hookedResult.then(() => {
        this.afterMev(mev);
      });
    } else {
      this.afterMev(mev);
      return hookedResult;
    }
  }

  /**
   * trigger [mev] event after [time] ms
   *
   * @param {number} time
   * @param {*} mev
   * @param {(mev: any) => void} [before]
   * @param {(mev: any) => void} [after]
   * @param {Promise<any>} [eventPromise]
   * @returns
   * @memberof Mundane
   */
  occurIn(
    time: number,
    mev: any,
    before?: (mev: any) => void,
    after?: (mev: any) => void,
    eventPromise?: Promise<any>
  ) {
    return this.sleep(time).then(() => {
      return this.occur(mev, before, after, eventPromise);
    });
  }

  /**
   * execute each IMundaneSequenceStep in [sequence]
   * a promise chainer with basic timing
   *
   * @param {IMundaneSequenceStep[]} sequence
   * @param {(step: any) => void} [onStep]
   * @returns
   * @memberof Mundane
   */
  // async sequenceScheduleImmediate (sequence: IMundaneSequenceStep[], onStep?: (step: any) => void, loop?: boolean) {
  //   for await (const s of this.schedule(sequence, onStep, loop)){

  //   }
  // }

  private async *schedule(
    sequence: Array<IMundaneSequenceStep>,
    loop?: boolean
  ) {
    let stepIndex = 0;
    let _lastStepStart = Date.now();
    while (stepIndex <= sequence.length) {
      let step = sequence[stepIndex];
      let _stepStart = Date.now();
      stepIndex += 1;
      if (!step) {
        return;
      }

      if (step.afterMs) {
        await this.sleep(step.afterMs);
      }

      yield {
        step: step,
        result: step.func.call(this),
        _stepStart: _stepStart
      };

      if (loop && stepIndex === sequence.length) {
        stepIndex = 0;
      }
      _lastStepStart = _stepStart;
    }
  }

  /**
   * return a sequence handler you can call to get info or to stop. use generator!
   * thats all, sequence -> generator.
   * sheesh!
   *
   */

  /**
   * execute each IMundaneSequenceStep in [sequence]
   * a promise chainer with basic timing
   *
   * @param {IMundaneSequenceStep[]} sequence
   * @param {(step: any) => void} [onStep]
   * @returns
   * @memberof Mundane
   */

  async sequence(
    sequence: Array<IMundaneSequenceStep>,
    onStep?: (step: any) => void,
    loop?: boolean
  ) {
    let _seqStart = Date.now();
    for await (const stepResult of this.schedule(sequence, loop)) {
      console.log("sequence step", this, stepResult);
      let _stepEnd = Date.now();
      if (onStep) {
        onStep.call(this, stepResult, _seqStart, _stepEnd);
      }
    }
  }

  /**
   * listen for [mevName] event with a before -> promise? -> after decorator for the [react] function
   *
   * @param {string} mevName
   * @param {(mev: any) => void} react
   * @param {(mev: any) => void} [before]
   * @param {(mev: any) => void} [after]
   * @param {(mev: any) => Promise<any>} [eventPromiseGenerator]
   * @param {*} [subject]
   * @memberof Mundane
   */
  observe(
    mevName: string,
    react: (mev: any) => void,
    before?: (mev: any) => void,
    after?: (mev: any) => void,
    eventPromiseGenerator?: (mev: any) => Promise<any>,
    subject?: any
  ) {
    const sub = subject || this.ctx;
    const hookedReaction = this.hookAndPromise(
      sub,
      react,
      before,
      after,
      eventPromiseGenerator
    );
    sub.addEventListener(mevName, hookedReaction),
      this.creeps.unshift({
        hookedReaction,
        mevName,
        subject: sub
      });
  }

  // observeSequence (word: string, onTrieStep?: (tnode: any) => void, before?: (mev: any) => void, after?: (mev: any) => void) {

  // }

  // stopObservingSequence(word: string){
  //   this.observedSequenceTrie.deleteWord(word);
  //   delete this.observedSequenceCallbacks[word];
  // }

  /**
   * remove all event listeners
   * calling all creeps
   *
   * @memberof Mundane
   */
  stop() {
    for (const creep of this.creeps) {
      creep.subject.removeEventListener(creep.mevName, creep.hookedReaction);
    }
  }
}
