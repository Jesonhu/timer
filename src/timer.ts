/**
 * Timer 类.
 */
export default class Timer {
  static count = 0
  id: number = 0
  fn: Function = () => { }
  delayTime: number = 0
  restTime: number = 0
  isInterval: boolean = false
  arg: any[] = []
  startTime: number = 0
  timerId: number | number = 0

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
      // +new Date() 相当于 new Date().getTime()
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
    this.timerId = -1
  }
}