/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(exports, "default", function() { return Mundane; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var Mundane =
/*#__PURE__*/
function () {
  function Mundane(context, beforeHandler, afterHandler, errorHandler, options) {
    var _this = this;

    _classCallCheck(this, Mundane);

    _defineProperty(this, "beforeMev", void 0);

    _defineProperty(this, "afterMev", void 0);

    _defineProperty(this, "onMevError", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "mundaneLog", void 0);

    _defineProperty(this, "creeps", void 0);

    _defineProperty(this, "options", void 0);

    this.ctx = context || window || {};

    this.beforeMev = beforeHandler || function (mev) {
      return null;
    };

    this.afterMev = afterHandler || function (mev) {
      return null;
    };

    this.onMevError = errorHandler || function (mev) {
      return null;
    };

    this.options = _objectSpread({
      logging: {
        disposeLogs: function disposeLogs() {
          _this.mundaneLog = [];
        },
        keepLog: true,
        log: function log(m) {
          _this.mundaneLog.unshift({
            m: m,
            t: Date.now()
          });
        },
        maxLogs: Infinity
      }
    }, options);
    this.creeps = [];
    this.mundaneLog = [];
  }

  _createClass(Mundane, [{
    key: "sleep",
    value: function sleep(ms) {
      return new Promise(function (yes, no) {
        setTimeout(yes, ms);
      });
    }
  }, {
    key: "make",
    value: function make(mevName, deets) {
      return new CustomEvent(mevName, {
        detail: deets
      });
    }
  }, {
    key: "hookAndPromise",
    value: function hookAndPromise(context, func, before, after, eventPromiseGenerator) {
      return function (mev) {
        if (before) {
          before.call(context, mev);
        }

        var doResponse = func(mev);

        if (eventPromiseGenerator) {
          return eventPromiseGenerator(mev).then(function (res) {
            after.call(context, mev, doResponse, res);
          });
        } else {
          return after.call(context, mev, doResponse);
        }
      };
    }
  }, {
    key: "occur",
    value: function occur(mev, before, after, eventPromise) {
      var _this2 = this;

      var hookedDispatch = this.hookAndPromise(this.ctx, function (mev) {
        return _this2.ctx.dispatchEvent(mev);
      }, before, after, eventPromise);
      this.beforeMev(mev);

      if (this.options.logging.keepLog) {
        this.options.logging.log(mev);
      }

      var hookedResult = hookedDispatch(mev);

      if (hookedResult instanceof Promise) {
        return hookedResult.then(function () {
          _this2.afterMev(mev);
        });
      } else {
        this.afterMev(mev);
        return hookedResult;
      }
    }
  }, {
    key: "occurIn",
    value: function occurIn(time, mev, before, after, eventPromise) {
      var _this3 = this;

      return this.sleep(time).then(function () {
        return _this3.occur(mev, before, after, eventPromise);
      });
    }
  }, {
    key: "sequence",
    value: function sequence(_sequence, onStep) {
      var _this4 = this;

      var sequencePromises = _sequence.map(function (step) {
        return function () {
          return _this4.sleep(step.afterMs).then(function (f) {
            onStep(step);
            step.func();
          });
        };
      });

      var applyAsync = function applyAsync(acc, val) {
        return acc.then(val);
      };

      var composeAsync = function composeAsync(funcs) {
        return function () {
          return funcs.reduce(applyAsync, Promise.resolve());
        };
      };

      var sequenceGo = composeAsync(sequencePromises);
      return sequenceGo();
    }
  }, {
    key: "observe",
    value: function observe(mevName, react, before, after, eventPromiseGenerator, subject) {
      var sub = subject || this.ctx;
      var hookedReaction = this.hookAndPromise(sub, react, before, after, eventPromiseGenerator);
      sub.addEventListener(mevName, hookedReaction), this.creeps.unshift({
        hookedReaction: hookedReaction,
        mevName: mevName,
        subject: sub
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.creeps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var creep = _step.value;
          creep.subject.removeEventListener(creep.mevName, creep.hookedReaction);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Mundane;
}();



/***/ }
/******/ ]);