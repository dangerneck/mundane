"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Mundane = /** @class */ (function () {
    function Mundane(context, beforeHandler, afterHandler, errorHandler, options) {
        var _this = this;
        this.ctx = context || window || {};
        this.beforeMev = beforeHandler || (function (mev) { return null; });
        this.afterMev = afterHandler || (function (mev) { return null; });
        this.onMevError = errorHandler || (function (mev) { return null; });
        this.opts = __assign({ logging: {
                disposeLogs: function () {
                    _this.mundaneLog = [];
                },
                keepLog: true,
                log: function (m) {
                    _this.mundaneLog.unshift({
                        m: m,
                        t: Date.now()
                    });
                },
                maxLogs: Infinity
            } }, options);
        this.creeps = [];
        this.mundaneLog = [];
    }
    Mundane.prototype.sleep = function (ms) {
        return new Promise(function (yes, no) {
            setTimeout(yes, ms);
        });
    };
    Mundane.prototype.make = function (mevName, deets) {
        return new CustomEvent("~mundane~" + mevName, deets);
    };
    Mundane.prototype.hookAndPromise = function (context, func, before, after, eventPromise) {
        return function (mev) {
            if (before) {
                before.call(context, mev);
            }
            var doResponse = func(mev);
            if (eventPromise) {
                return eventPromise.then(function (res) {
                    after.call(context, mev, doResponse, res);
                });
            }
            else {
                return after.call(context, mev, doResponse);
            }
        };
    };
    Mundane.prototype.occur = function (mev, before, after, eventPromise) {
        var _this = this;
        var hookedDispatch = this.hookAndPromise(this.ctx, function (mev) { return _this.ctx.dispatchEvent(mev); }, before, after, eventPromise);
        this.beforeMev(mev);
        var hookedResult = hookedDispatch(mev);
        if (hookedResult instanceof Promise) {
            return hookedResult.then(function () {
                _this.afterMev(mev);
            });
        }
        else {
            return hookedResult;
        }
    };
    Mundane.prototype.occurIn = function (time, mev, before, after, eventPromise) {
        var _this = this;
        return this.sleep(time).then(function () {
            return _this.occur(mev, before, after, eventPromise);
        });
    };
    Mundane.prototype.sequence = function (sequence, onStep) {
        var _this = this;
        var sequencePromises = sequence.map(function (step) {
            return function () { return _this.sleep(step.afterMs).then(function (f) {
                onStep(step);
                step.func();
            }); };
        });
        var applyAsync = function (acc, val) { return acc.then(val); };
        var composeAsync = function (funcs) { return function () { return funcs.reduce(applyAsync, Promise.resolve()); }; };
        var sequenceGo = composeAsync(sequencePromises);
        return sequenceGo();
    };
    Mundane.prototype.observe = function (mevName, react, before, after, eventPromise, subject) {
        var sub = subject || this.ctx;
        var hookedReaction = this.hookAndPromise(sub, react, before, after, eventPromise);
        sub.addEventListener(mevName, hookedReaction),
            this.creeps.unshift({
                hookedReaction: hookedReaction,
                mevName: mevName,
                subject: sub
            });
    };
    Mundane.prototype.stop = function () {
        for (var _i = 0, _a = this.creeps; _i < _a.length; _i++) {
            var creep = _a[_i];
            creep.subject.removeEventListener(creep.mevName, creep.hookedReaction);
        }
    };
    return Mundane;
}());
exports["default"] = Mundane;
