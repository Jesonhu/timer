!(function(win) {
  // ================================================================================
  /**
   * 文章链接: https://mp.weixin.qq.com/s/Xp_qEBWDWJyXxV3LGvo29g
   * 思路整理:
   *
   * 首先，我们先设计定时器的 API 规范，肯定是越接近原生 API 越好，这样开发者可以无痛替换。
   *
   * function $setTimeout(fn, timeout, ...arg) {}
   * function $setInterval(fn, timeout, ...arg) {}
   * function $clearTimeout(id) {}
   * function $clearInterval(id) {}
   *
   *
   * 接下来我们主要解决以下两个问题:
   *
   * 1. 如何实现定时器暂停和恢复
   * 2, 如何让开发者无须在生命周期函数处理定时器
   */
  // ================================================================================

  /**
   * Timer 类.
   */
  class Timer {
    static count = 0;

    /**
     * @param {Boolean} isInterval 是否为定时器
     * @param {Function} fn 计时器处理回调函数
     * @param {[Number]} delayTime 延时时间
     * @param  {...any} args 其他剩余参数
     */
    constructor(isInterval, fn, delayTime = 0, ...arg) {
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
    start() {
      /** 开始时间 */
      this.startTime = +new Date();

      // 处理定时器
      if (this.isInterval) {
        const cb = (...arg) => {
          // 执行回调函数
          this.fn(...arg);
          // 还未结束继续执行
          if (this.timerId)
            this.timerId = setTimeout(cb, this.delayTime, ...this.arg);
        };
        this.timerId = setTimeout(cb, this.restTime, ...this.arg);
        return;
      }

      // 处理延时器
      const cb = (...arg) => {
        this.fn(...arg);
      };
      this.timerId = setTimeout(cb, this.restTime, ...this.arg);
    }

    /**
     * 暂停计时器
     */
    pause() {
      if (this.delayTime > 0) {
        const nowTime = +new Date();
        // 下一次开始的时间
        const nextRestTime = this.restTime - (nowTime - this.startTime);
        const intervalRestTime =
          nextRestTime >= 0
            ? nextRestTime
            : this.delayTime - (Math.abs(nextRestTime) % this.delayTime);
        this.restTime = this.isInterval ? intervalRestTime : nextRestTime;
      }
      clearTimeout(this.timerId);
    }

    /** 
     * 释放所有数据
     * 清除计时器
     */
    dispose() {
      clearTimeout(this.timerId)
      this.timerId = ''
    }
  }

  // ========== 对外 API ==========
  /**
   * 创建延时器
   * @param {Function} fn 处理函数
   * @param {Number} delayTime 延时时间
   */
  function $setTimeout(fn, delayTime, ...arg) {
    const timer = new Timer(false, fn, delayTime, arg);
    return timer.id;
  }

  function $clearTimeout(timeId) {}

  function $setInterval(cb, intervalTime, ...arg) {
    const timer = new Timer(true, cb, intervalTime, arg);
    timer.start()
    return timer.id;
  }

  function $clearInterval() {}


  win.$setTimeout = win.$setTimeout || $setTimeout;
  win.$clearTimeout = win.$clearTimeout || $clearTimeout;
  win.$setInterval = win.$setInterval || $setInterval;
  win.$clearInterval = win.$clearInterval || $clearInterval;

  // 
  win.Timer = Timer

})(window);
