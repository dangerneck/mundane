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
 * @export
 * @class Mundane
 */
export default class Mundane {
    /**
     *Creates an instance of Mundane.
     * @param {*} context
     * @param {(mev: any) => void} beforeHandler
     * @param {(mev: any) => void} afterHandler
     * @param {(mev: any) => void} errorHandler
     * @param {object} options
     * @memberof Mundane
     */
    constructor(context, beforeHandler, afterHandler, errorHandler, options) {
        this.ctx = context || window || {};
        // this.observedSequenceTrie = new Trie();
        // this.observedSequenceCallbacks = {};
        this.beforeMev = beforeHandler || ((mev) => null);
        this.afterMev = afterHandler || ((mev) => null);
        this.onMevError = errorHandler || ((mev) => null);
        this.options = {
            logging: {
                disposeLogs: () => {
                    this.mundaneLog = [];
                },
                keepLog: true,
                log: (m) => {
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
    sleep(ms) {
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
    make(mevName, deets) {
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
    hookAndPromise(context, func, before, after, eventPromiseGenerator) {
        return (mev) => {
            if (before) {
                before.call(context, mev);
            }
            const doResponse = func(mev);
            if (eventPromiseGenerator) {
                let eventPromise = eventPromiseGenerator(mev);
                if (eventPromise.then) {
                    return eventPromise.then((res) => {
                        if (after) {
                            after.call(context, mev, doResponse, res);
                        }
                    });
                }
                else {
                    console.warn("event promise generator did not return a promise", eventPromise);
                    return eventPromise;
                }
            }
            else {
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
    occur(mev, before, after, eventPromise) {
        const hookedDispatch = this.hookAndPromise(this.ctx, (m) => this.ctx.dispatchEvent(mev), before, after, (m) => eventPromise || Promise.resolve(mev));
        this.beforeMev(mev);
        if (this.options.logging.keepLog) {
            this.options.logging.log(mev);
        }
        const hookedResult = hookedDispatch(mev);
        if (hookedResult instanceof Promise) {
            return hookedResult.then(() => {
                this.afterMev(mev);
            });
        }
        else {
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
    occurIn(time, mev, before, after, eventPromise) {
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
    async *schedule(sequence, loop) {
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
    async sequence(sequence, onStep, loop) {
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
    observe(mevName, react, before, after, eventPromiseGenerator, subject) {
        const sub = subject || this.ctx;
        const hookedReaction = this.hookAndPromise(sub, react, before, after, eventPromiseGenerator);
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
//# sourceMappingURL=Mundane.js.map