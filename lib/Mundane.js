"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
      return new CustomEvent("~mundane~".concat(mevName), deets);
    }
  }, {
    key: "hookAndPromise",
    value: function hookAndPromise(context, func, before, after, eventPromise) {
      return function (mev) {
        if (before) {
          before.call(context, mev);
        }

        var doResponse = func(mev);

        if (eventPromise) {
          return eventPromise.then(function (res) {
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
    value: function observe(mevName, react, before, after, eventPromise, subject) {
      var sub = subject || this.ctx;
      var hookedReaction = this.hookAndPromise(sub, react, before, after, eventPromise);
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

exports.default = Mundane;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL011bmRhbmUudHMiXSwibmFtZXMiOlsiTXVuZGFuZSIsImNvbnRleHQiLCJiZWZvcmVIYW5kbGVyIiwiYWZ0ZXJIYW5kbGVyIiwiZXJyb3JIYW5kbGVyIiwib3B0aW9ucyIsImN0eCIsIndpbmRvdyIsImJlZm9yZU1ldiIsIm1ldiIsImFmdGVyTWV2Iiwib25NZXZFcnJvciIsImxvZ2dpbmciLCJkaXNwb3NlTG9ncyIsIm11bmRhbmVMb2ciLCJrZWVwTG9nIiwibG9nIiwibSIsInVuc2hpZnQiLCJ0IiwiRGF0ZSIsIm5vdyIsIm1heExvZ3MiLCJJbmZpbml0eSIsImNyZWVwcyIsIm1zIiwiUHJvbWlzZSIsInllcyIsIm5vIiwic2V0VGltZW91dCIsIm1ldk5hbWUiLCJkZWV0cyIsIkN1c3RvbUV2ZW50IiwiZnVuYyIsImJlZm9yZSIsImFmdGVyIiwiZXZlbnRQcm9taXNlIiwiY2FsbCIsImRvUmVzcG9uc2UiLCJ0aGVuIiwicmVzIiwiaG9va2VkRGlzcGF0Y2giLCJob29rQW5kUHJvbWlzZSIsImRpc3BhdGNoRXZlbnQiLCJob29rZWRSZXN1bHQiLCJ0aW1lIiwic2xlZXAiLCJvY2N1ciIsInNlcXVlbmNlIiwib25TdGVwIiwic2VxdWVuY2VQcm9taXNlcyIsIm1hcCIsInN0ZXAiLCJhZnRlck1zIiwiZiIsImFwcGx5QXN5bmMiLCJhY2MiLCJ2YWwiLCJjb21wb3NlQXN5bmMiLCJmdW5jcyIsInJlZHVjZSIsInJlc29sdmUiLCJzZXF1ZW5jZUdvIiwicmVhY3QiLCJzdWJqZWN0Iiwic3ViIiwiaG9va2VkUmVhY3Rpb24iLCJhZGRFdmVudExpc3RlbmVyIiwiY3JlZXAiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF5Q3FCQSxPOzs7QUFTbkIsbUJBQ0VDLE9BREYsRUFFRUMsYUFGRixFQUdFQyxZQUhGLEVBSUVDLFlBSkYsRUFLRUMsT0FMRixFQU1FO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0EsU0FBS0MsR0FBTCxHQUFXTCxPQUFPLElBQUlNLE1BQVgsSUFBcUIsRUFBaEM7O0FBQ0EsU0FBS0MsU0FBTCxHQUFpQk4sYUFBYSxJQUFLLFVBQUNPLEdBQUQ7QUFBQSxhQUFjLElBQWQ7QUFBQSxLQUFuQzs7QUFDQSxTQUFLQyxRQUFMLEdBQWdCUCxZQUFZLElBQUssVUFBQ00sR0FBRDtBQUFBLGFBQWMsSUFBZDtBQUFBLEtBQWpDOztBQUNBLFNBQUtFLFVBQUwsR0FBa0JQLFlBQVksSUFBSyxVQUFDSyxHQUFEO0FBQUEsYUFBYyxJQUFkO0FBQUEsS0FBbkM7O0FBQ0EsU0FBS0osT0FBTDtBQUNFTyxNQUFBQSxPQUFPLEVBQUU7QUFDUEMsUUFBQUEsV0FBVyxFQUFFLHVCQUFNO0FBQ2pCLFVBQUEsS0FBSSxDQUFDQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0QsU0FITTtBQUlQQyxRQUFBQSxPQUFPLEVBQUUsSUFKRjtBQUtQQyxRQUFBQSxHQUFHLEVBQUUsYUFBQ0MsQ0FBRCxFQUFlO0FBQ2xCLFVBQUEsS0FBSSxDQUFDSCxVQUFMLENBQWdCSSxPQUFoQixDQUF3QjtBQUN0QkQsWUFBQUEsQ0FBQyxFQUFEQSxDQURzQjtBQUV0QkUsWUFBQUEsQ0FBQyxFQUFFQyxJQUFJLENBQUNDLEdBQUw7QUFGbUIsV0FBeEI7QUFJRCxTQVZNO0FBV1BDLFFBQUFBLE9BQU8sRUFBRUM7QUFYRjtBQURYLE9BY0tsQixPQWRMO0FBZ0JBLFNBQUttQixNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUtWLFVBQUwsR0FBa0IsRUFBbEI7QUFDRDs7OzswQkFFYVcsRSxFQUFZO0FBQ3hCLGFBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLEdBQUQsRUFBTUMsRUFBTixFQUFhO0FBQzlCQyxRQUFBQSxVQUFVLENBQUNGLEdBQUQsRUFBTUYsRUFBTixDQUFWO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7Ozt5QkFFWUssTyxFQUFpQkMsSyxFQUFlO0FBQzNDLGFBQU8sSUFBSUMsV0FBSixvQkFBNEJGLE9BQTVCLEdBQXVDQyxLQUF2QyxDQUFQO0FBQ0Q7OzttQ0FFc0I5QixPLEVBQWNnQyxJLEVBQTBCQyxNLEVBQTZCQyxLLEVBQTRCQyxZLEVBQTZCO0FBQ25KLGFBQU8sVUFBQzNCLEdBQUQsRUFBYztBQUNuQixZQUFJeUIsTUFBSixFQUFZO0FBQ1ZBLFVBQUFBLE1BQU0sQ0FBQ0csSUFBUCxDQUFZcEMsT0FBWixFQUFxQlEsR0FBckI7QUFDRDs7QUFDRCxZQUFNNkIsVUFBVSxHQUFHTCxJQUFJLENBQUN4QixHQUFELENBQXZCOztBQUNBLFlBQUkyQixZQUFKLEVBQWtCO0FBQ2hCLGlCQUFPQSxZQUFZLENBQUNHLElBQWIsQ0FBa0IsVUFBQ0MsR0FBRCxFQUFjO0FBQ3JDTCxZQUFBQSxLQUFLLENBQUNFLElBQU4sQ0FBV3BDLE9BQVgsRUFBb0JRLEdBQXBCLEVBQXlCNkIsVUFBekIsRUFBcUNFLEdBQXJDO0FBQ0QsV0FGTSxDQUFQO0FBR0QsU0FKRCxNQUlPO0FBQ0wsaUJBQU9MLEtBQUssQ0FBQ0UsSUFBTixDQUFXcEMsT0FBWCxFQUFvQlEsR0FBcEIsRUFBeUI2QixVQUF6QixDQUFQO0FBQ0Q7QUFDRixPQVpEO0FBYUQ7OzswQkFFYTdCLEcsRUFBVXlCLE0sRUFBNEJDLEssRUFBMkJDLFksRUFBNkI7QUFBQTs7QUFDMUcsVUFBTUssY0FBYyxHQUFHLEtBQUtDLGNBQUwsQ0FDckIsS0FBS3BDLEdBRGdCLEVBRXJCLFVBQUNHLEdBQUQ7QUFBQSxlQUFjLE1BQUksQ0FBQ0gsR0FBTCxDQUFTcUMsYUFBVCxDQUF1QmxDLEdBQXZCLENBQWQ7QUFBQSxPQUZxQixFQUdyQnlCLE1BSHFCLEVBSXJCQyxLQUpxQixFQUtyQkMsWUFMcUIsQ0FBdkI7QUFPQSxXQUFLNUIsU0FBTCxDQUFlQyxHQUFmOztBQUNBLFVBQUksS0FBS0osT0FBTCxDQUFhTyxPQUFiLENBQXFCRyxPQUF6QixFQUFpQztBQUMvQixhQUFLVixPQUFMLENBQWFPLE9BQWIsQ0FBcUJJLEdBQXJCLENBQXlCUCxHQUF6QjtBQUNEOztBQUNELFVBQU1tQyxZQUFZLEdBQUdILGNBQWMsQ0FBQ2hDLEdBQUQsQ0FBbkM7O0FBQ0EsVUFBSW1DLFlBQVksWUFBWWxCLE9BQTVCLEVBQW9DO0FBQ2xDLGVBQU9rQixZQUFZLENBQUNMLElBQWIsQ0FBa0IsWUFBTTtBQUM3QixVQUFBLE1BQUksQ0FBQzdCLFFBQUwsQ0FBY0QsR0FBZDtBQUNELFNBRk0sQ0FBUDtBQUdELE9BSkQsTUFJTztBQUNOLGVBQU9tQyxZQUFQO0FBQ0E7QUFDRjs7OzRCQUVjQyxJLEVBQWNwQyxHLEVBQVV5QixNLEVBQTRCQyxLLEVBQTJCQyxZLEVBQTZCO0FBQUE7O0FBQ3pILGFBQU8sS0FBS1UsS0FBTCxDQUFXRCxJQUFYLEVBQWlCTixJQUFqQixDQUFzQixZQUFNO0FBQ2pDLGVBQU8sTUFBSSxDQUFDUSxLQUFMLENBQVd0QyxHQUFYLEVBQWdCeUIsTUFBaEIsRUFBd0JDLEtBQXhCLEVBQStCQyxZQUEvQixDQUFQO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7Ozs2QkFFZVksUyxFQUFrQ0MsTSxFQUE2QjtBQUFBOztBQUM3RSxVQUFNQyxnQkFBZ0IsR0FBR0YsU0FBUSxDQUFDRyxHQUFULENBQWEsVUFBQUMsSUFBSSxFQUFJO0FBQzVDLGVBQU87QUFBQSxpQkFBTSxNQUFJLENBQUNOLEtBQUwsQ0FBV00sSUFBSSxDQUFDQyxPQUFoQixFQUF5QmQsSUFBekIsQ0FBOEIsVUFBQ2UsQ0FBRCxFQUFZO0FBQ3JETCxZQUFBQSxNQUFNLENBQUNHLElBQUQsQ0FBTjtBQUNBQSxZQUFBQSxJQUFJLENBQUNuQixJQUFMO0FBQ0QsV0FIWSxDQUFOO0FBQUEsU0FBUDtBQUlELE9BTHdCLENBQXpCOztBQU1BLFVBQU1zQixVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFDQyxHQUFELEVBQVdDLEdBQVg7QUFBQSxlQUF3QkQsR0FBRyxDQUFDakIsSUFBSixDQUFTa0IsR0FBVCxDQUF4QjtBQUFBLE9BQW5COztBQUNBLFVBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLEtBQUQ7QUFBQSxlQUFrQjtBQUFBLGlCQUFNQSxLQUFLLENBQUNDLE1BQU4sQ0FBYUwsVUFBYixFQUF5QjdCLE9BQU8sQ0FBQ21DLE9BQVIsRUFBekIsQ0FBTjtBQUFBLFNBQWxCO0FBQUEsT0FBckI7O0FBQ0EsVUFBTUMsVUFBVSxHQUFHSixZQUFZLENBQUNSLGdCQUFELENBQS9CO0FBQ0EsYUFBT1ksVUFBVSxFQUFqQjtBQUNEOzs7NEJBRWVoQyxPLEVBQWlCaUMsSyxFQUEyQjdCLE0sRUFBNEJDLEssRUFBMEJDLFksRUFBNkI0QixPLEVBQWdCO0FBQzdKLFVBQU1DLEdBQUcsR0FBR0QsT0FBTyxJQUFJLEtBQUsxRCxHQUE1QjtBQUNBLFVBQU00RCxjQUFjLEdBQUcsS0FBS3hCLGNBQUwsQ0FBb0J1QixHQUFwQixFQUF5QkYsS0FBekIsRUFBZ0M3QixNQUFoQyxFQUF3Q0MsS0FBeEMsRUFBK0NDLFlBQS9DLENBQXZCO0FBQ0E2QixNQUFBQSxHQUFHLENBQUNFLGdCQUFKLENBQXFCckMsT0FBckIsRUFBOEJvQyxjQUE5QixHQUNBLEtBQUsxQyxNQUFMLENBQVlOLE9BQVosQ0FBb0I7QUFDbEJnRCxRQUFBQSxjQUFjLEVBQWRBLGNBRGtCO0FBRWxCcEMsUUFBQUEsT0FBTyxFQUFQQSxPQUZrQjtBQUdsQmtDLFFBQUFBLE9BQU8sRUFBRUM7QUFIUyxPQUFwQixDQURBO0FBTUQ7OzsyQkFFYztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNiLDZCQUFvQixLQUFLekMsTUFBekIsOEhBQWlDO0FBQUEsY0FBdEI0QyxLQUFzQjtBQUMvQkEsVUFBQUEsS0FBSyxDQUFDSixPQUFOLENBQWNLLG1CQUFkLENBQWtDRCxLQUFLLENBQUN0QyxPQUF4QyxFQUFpRHNDLEtBQUssQ0FBQ0YsY0FBdkQ7QUFDRDtBQUhZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJZCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICpcbiAqICAgICAgICAgICAgICAgICApICAoICAgICAgICAgICAgICAgICApICAgICAgIFxuICogICggIGAgICAgICAgICAgICggLyggIClcXCApICAgICggICAgICAoIC8oICAgICAgIFxuICogIClcXCkpKCAgICAgICggICApXFwoKSkoKCkvKCAgICApXFwgICAgIClcXCgpKSAoICAgIFxuICogKChfKSgpXFwgICAgIClcXCAoKF8pXFwgIC8oXykpKCgoKF8pKCAgKChfKVxcICApXFwgICBcbiAqIChfKCkoKF8pIF8gKChfKSBfKChfKShfKSlfICApXFwgXyApXFwgIF8oKF8pKChfKSAgXG4gKiB8ICBcXC8gIHx8IHwgfCB8fCBcXHwgfCB8ICAgXFwgKF8pX1xcKF8pfCBcXHwgfHwgX198IFxuICogfCB8XFwvfCB8fCB8X3wgfHwgLmAgfCB8IHwpIHwgLyBfIFxcICB8IC5gIHx8IF98ICBcbiAqIHxffCAgfF98IFxcX19fLyB8X3xcXF98IHxfX18vIC9fLyBcXF9cXCB8X3xcXF98fF9fX3wgXG4gKlxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLVxuICogXl5eIEZvbnQgTmFtZTogRmlyZSBGb250LWsgKGh0dHA6Ly9wYXRvcmprLmNvbS9zb2Z0d2FyZS90YWFnKSBeXl5cbiAqIC0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICMjIyMjIyMjIyMjIyMjI1xuICpcbiAqIE11bmRhbmUgRXZlbnRzXG4gKlxuICogQ2hlZWt5IGxpYiB3cmFwcGluZyBicm93c2VyIGV2ZW50cyB3aXRoIHNvbWUgYmFzaWMgdGltaW5nLCBzY2hlZHVsaW5nIGFuZCBob29rcy5cbiAqXG4gKiAjIyMjIyMjIyMjIyMjIyNcbiAqL1xuXG5pbnRlcmZhY2UgSU11bmRhbmVPcHRpb25zIHtcbiAgbG9nZ2luZzogSU11bmRhbmVMb2dnaW5nT3B0aW9ucztcbn1cblxuaW50ZXJmYWNlIElNdW5kYW5lTG9nZ2luZ09wdGlvbnMge1xuICBkaXNwb3NlTG9nczogKCkgPT4gdm9pZDtcbiAga2VlcExvZzogYm9vbGVhbjtcbiAgbG9nOiAobTpvYmplY3QpID0+IHZvaWQ7XG4gIG1heExvZ3M6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElNdW5kYW5lU2VxdWVuY2VTdGVwIHtcbiAgYWZ0ZXJNczogbnVtYmVyO1xuICBmdW5jOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdW5kYW5lIHtcbiAgcHVibGljIGJlZm9yZU1ldjogKG1ldjogYW55KSA9PiB2b2lkO1xuICBwdWJsaWMgYWZ0ZXJNZXY6IChtZXY6IGFueSkgPT4gdm9pZDtcbiAgcHVibGljIG9uTWV2RXJyb3I6IChtZXY6IGFueSkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBjdHg6IGFueTtcbiAgcHJpdmF0ZSBtdW5kYW5lTG9nOiBhbnlbXTtcbiAgcHJpdmF0ZSBjcmVlcHM6IGFueVtdO1xuICBwcml2YXRlIG9wdGlvbnM6IElNdW5kYW5lT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgY29udGV4dDogYW55LFxuICAgIGJlZm9yZUhhbmRsZXI6IChtZXY6IGFueSkgPT4gdm9pZCxcbiAgICBhZnRlckhhbmRsZXI6IChtZXY6IGFueSkgPT4gdm9pZCxcbiAgICBlcnJvckhhbmRsZXI6IChtZXY6IGFueSkgPT4gdm9pZCxcbiAgICBvcHRpb25zOiBvYmplY3RcbiAgKSB7XG4gICAgdGhpcy5jdHggPSBjb250ZXh0IHx8IHdpbmRvdyB8fCB7fTtcbiAgICB0aGlzLmJlZm9yZU1ldiA9IGJlZm9yZUhhbmRsZXIgfHwgKChtZXY6IGFueSkgPT4gbnVsbCk7XG4gICAgdGhpcy5hZnRlck1ldiA9IGFmdGVySGFuZGxlciB8fCAoKG1ldjogYW55KSA9PiBudWxsKTtcbiAgICB0aGlzLm9uTWV2RXJyb3IgPSBlcnJvckhhbmRsZXIgfHwgKChtZXY6IGFueSkgPT4gbnVsbCk7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbG9nZ2luZzoge1xuICAgICAgICBkaXNwb3NlTG9nczogKCkgPT4ge1xuICAgICAgICAgIHRoaXMubXVuZGFuZUxvZyA9IFtdO1xuICAgICAgICB9LFxuICAgICAgICBrZWVwTG9nOiB0cnVlLFxuICAgICAgICBsb2c6IChtOiBvYmplY3QpID0+IHtcbiAgICAgICAgICB0aGlzLm11bmRhbmVMb2cudW5zaGlmdCh7XG4gICAgICAgICAgICBtLFxuICAgICAgICAgICAgdDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWF4TG9nczogSW5maW5pdHksXG4gICAgICB9LFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG4gICAgdGhpcy5jcmVlcHMgPSBbXTtcbiAgICB0aGlzLm11bmRhbmVMb2cgPSBbXTtcbiAgfVxuXG4gIHB1YmxpYyBzbGVlcCAobXM6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoeWVzLCBubykgPT4ge1xuICAgICAgc2V0VGltZW91dCh5ZXMsIG1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBtYWtlIChtZXZOYW1lOiBzdHJpbmcsIGRlZXRzOiBvYmplY3QpIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGB+bXVuZGFuZX4ke21ldk5hbWV9YCwgZGVldHMpO1xuICB9XG5cbiAgcHVibGljIGhvb2tBbmRQcm9taXNlIChjb250ZXh0OiBhbnksIGZ1bmM6IChtZXY6IGFueSkgPT4gdm9pZCwgYmVmb3JlOiAobWV2OiBhbnkpID0+IHZvaWQsICBhZnRlcjogKG1ldjogYW55KSA9PiB2b2lkLCAgZXZlbnRQcm9taXNlPzogUHJvbWlzZTxhbnk+KSB7XG4gICAgcmV0dXJuIChtZXY6IGFueSkgPT4ge1xuICAgICAgaWYgKGJlZm9yZSkge1xuICAgICAgICBiZWZvcmUuY2FsbChjb250ZXh0LCBtZXYpO1xuICAgICAgfVxuICAgICAgY29uc3QgZG9SZXNwb25zZSA9IGZ1bmMobWV2KTtcbiAgICAgIGlmIChldmVudFByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50UHJvbWlzZS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIGFmdGVyLmNhbGwoY29udGV4dCwgbWV2LCBkb1Jlc3BvbnNlLCByZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhZnRlci5jYWxsKGNvbnRleHQsIG1ldiwgZG9SZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBcbiAgcHVibGljIG9jY3VyIChtZXY6IGFueSwgYmVmb3JlOiAobWV2OiBhbnkpID0+IHZvaWQsIGFmdGVyOiAobWV2OiBhbnkpID0+IHZvaWQsIGV2ZW50UHJvbWlzZT86IFByb21pc2U8YW55Pikge1xuICAgIGNvbnN0IGhvb2tlZERpc3BhdGNoID0gdGhpcy5ob29rQW5kUHJvbWlzZShcbiAgICAgIHRoaXMuY3R4LFxuICAgICAgKG1ldjogYW55KSA9PiB0aGlzLmN0eC5kaXNwYXRjaEV2ZW50KG1ldiksXG4gICAgICBiZWZvcmUsXG4gICAgICBhZnRlcixcbiAgICAgIGV2ZW50UHJvbWlzZVxuICAgICk7XG4gICAgdGhpcy5iZWZvcmVNZXYobWV2KTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmxvZ2dpbmcua2VlcExvZyl7XG4gICAgICB0aGlzLm9wdGlvbnMubG9nZ2luZy5sb2cobWV2KTtcbiAgICB9XG4gICAgY29uc3QgaG9va2VkUmVzdWx0ID0gaG9va2VkRGlzcGF0Y2gobWV2KTtcbiAgICBpZiAoaG9va2VkUmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSl7XG4gICAgICByZXR1cm4gaG9va2VkUmVzdWx0LnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmFmdGVyTWV2KG1ldik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICByZXR1cm4gaG9va2VkUmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvY2N1ckluKHRpbWU6IG51bWJlciwgbWV2OiBhbnksIGJlZm9yZTogKG1ldjogYW55KSA9PiB2b2lkLCBhZnRlcjogKG1ldjogYW55KSA9PiB2b2lkLCBldmVudFByb21pc2U/OiBQcm9taXNlPGFueT4pIHtcbiAgICByZXR1cm4gdGhpcy5zbGVlcCh0aW1lKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLm9jY3VyKG1ldiwgYmVmb3JlLCBhZnRlciwgZXZlbnRQcm9taXNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXF1ZW5jZShzZXF1ZW5jZTogSU11bmRhbmVTZXF1ZW5jZVN0ZXBbXSwgb25TdGVwOiAoc3RlcDogYW55KSA9PiB2b2lkKSB7XG4gICAgY29uc3Qgc2VxdWVuY2VQcm9taXNlcyA9IHNlcXVlbmNlLm1hcChzdGVwID0+IHtcbiAgICAgIHJldHVybiAoKSA9PiB0aGlzLnNsZWVwKHN0ZXAuYWZ0ZXJNcykudGhlbigoZjogYW55KSA9PiB7XG4gICAgICAgIG9uU3RlcChzdGVwKTtcbiAgICAgICAgc3RlcC5mdW5jKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBhcHBseUFzeW5jID0gKGFjYzogYW55LCB2YWw6IGFueSkgPT4gYWNjLnRoZW4odmFsKTtcbiAgICBjb25zdCBjb21wb3NlQXN5bmMgPSAoZnVuY3M6IGFueVtdKSA9PiAoKSA9PiBmdW5jcy5yZWR1Y2UoYXBwbHlBc3luYywgUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgIGNvbnN0IHNlcXVlbmNlR28gPSBjb21wb3NlQXN5bmMoc2VxdWVuY2VQcm9taXNlcyk7XG4gICAgcmV0dXJuIHNlcXVlbmNlR28oKTtcbiAgfVxuXG4gIHB1YmxpYyBvYnNlcnZlIChtZXZOYW1lOiBzdHJpbmcsIHJlYWN0OiAobWV2OiBhbnkpID0+IHZvaWQsIGJlZm9yZTogKG1ldjogYW55KSA9PiB2b2lkLCBhZnRlcjogKG1ldjogYW55KSA9PiB2b2lkLGV2ZW50UHJvbWlzZT86IFByb21pc2U8YW55Piwgc3ViamVjdD86IGFueSApIHtcbiAgICBjb25zdCBzdWIgPSBzdWJqZWN0IHx8IHRoaXMuY3R4O1xuICAgIGNvbnN0IGhvb2tlZFJlYWN0aW9uID0gdGhpcy5ob29rQW5kUHJvbWlzZShzdWIsIHJlYWN0LCBiZWZvcmUsIGFmdGVyLCBldmVudFByb21pc2UpO1xuICAgIHN1Yi5hZGRFdmVudExpc3RlbmVyKG1ldk5hbWUsIGhvb2tlZFJlYWN0aW9uKSxcbiAgICB0aGlzLmNyZWVwcy51bnNoaWZ0KHtcbiAgICAgIGhvb2tlZFJlYWN0aW9uLFxuICAgICAgbWV2TmFtZSxcbiAgICAgIHN1YmplY3Q6IHN1YixcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9wICgpIHtcbiAgICBmb3IgKGNvbnN0IGNyZWVwIG9mIHRoaXMuY3JlZXBzKSB7XG4gICAgICBjcmVlcC5zdWJqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoY3JlZXAubWV2TmFtZSwgY3JlZXAuaG9va2VkUmVhY3Rpb24pO1xuICAgIH1cbiAgfVxufSJdfQ==