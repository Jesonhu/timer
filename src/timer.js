"use strict";
exports.__esModule = true;
/**
 * Timer 类.
 */
var Timer = /** @class */ (function () {
    /**
     * @param {Boolean} isInterval 是否为定时器
     * @param {Function} fn 计时器处理回调函数
     * @param {[Number]} delayTime 延时时间
     * @param  {...any} args 其他剩余参数
     */
    function Timer(isInterval, fn, delayTime) {
        if (delayTime === void 0) { delayTime = 0; }
        var arg = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            arg[_i - 3] = arguments[_i];
        }
        this.id = 0;
        this.fn = function () { };
        this.delayTime = 0;
        this.restTime = 0;
        this.isInterval = false;
        this.arg = [];
        this.startTime = 0;
        this.timerId = 0;
        this.id = ++Timer.count;
        this.fn = fn;
        this.delayTime = delayTime;
        /** 计时器剩余时间 */
        this.restTime = delayTime;
        this.isInterval = isInterval;
        this.arg = arg;
    }
    /**
     * 开始或重新开始计时器
     */
    Timer.prototype.start = function () {
        var _this = this;
        /** 开始时间 */
        this.startTime = +new Date();
        // 处理定时器
        if (this.isInterval) {
            var cb_1 = function () {
                var arg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arg[_i] = arguments[_i];
                }
                // 执行回调函数
                _this.fn.apply(_this, arg);
                // 还未结束继续执行
                if (_this.timerId)
                    _this.timerId = setTimeout.apply(void 0, [cb_1, _this.delayTime].concat(_this.arg));
            };
            this.timerId = setTimeout.apply(void 0, [cb_1, this.restTime].concat(this.arg));
            return;
        }
        // 处理延时器
        var cb = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            _this.fn.apply(_this, arg);
        };
        this.timerId = setTimeout.apply(void 0, [cb, this.restTime].concat(this.arg));
    };
    /**
     * 暂停计时器
     */
    Timer.prototype.pause = function () {
        if (this.delayTime > 0) {
            // +new Date() 相当于 new Date().getTime()
            var nowTime = +new Date();
            // 下一次开始的时间
            var nextRestTime = this.restTime - (nowTime - this.startTime);
            var intervalRestTime = nextRestTime >= 0
                ? nextRestTime
                : this.delayTime - (Math.abs(nextRestTime) % this.delayTime);
            this.restTime = this.isInterval ? intervalRestTime : nextRestTime;
        }
        clearTimeout(this.timerId);
    };
    /**
     * 释放所有数据
     * 清除计时器
     */
    Timer.prototype.dispose = function () {
        clearTimeout(this.timerId);
        this.timerId = -1;
    };
    Timer.count = 0;
    return Timer;
}());
exports["default"] = Timer;
