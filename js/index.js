




/**
 * Created by ken on 2016/6/18.
 */

 $(function () {
  var Lottery = function($target, param) {
      this.param = {
          // 加速度
          accelerate: 0.1,
          // 最小速度
          minSpeed: 2,
          // 最大速度
          maxSpeed: 60,
          // 最小旋转时间
          minShowTime: 6000,
          // 加速延时
          accelerateTime: 20,
          className: 'active',
          callback: null
      };
      this.$list = $target;
      this.LIST_LENGTH = this.$list.length;

      this.param = $.extend(this.param, param);

      // 当前状态
      this.cureentStatus = {};
  };

  /**
   * 开始
   */
  Lottery.prototype.run = function() {
      if (this.cureentStatus.isRunning) {
          return;
      }

      this.initStatus();
      this.domRender();
      this.tick();
      this.fast();
  };

  // 初始化状态
  Lottery.prototype.initStatus = function() {
      // 清理timer
      if (this.cureentStatus.timer) {
          clearTimeout(this.cureentStatus.timer);
      }

      // 清理dom
      this.$list.eq(this.cureentStatus.index).removeClass('active');

      // 初始化当前状态数据
      this.cureentStatus = {
          index: 0,
          speed: this.param.minSpeed,
          accelerate: this.param.accelerate,
          timer: null,
          startTime: new Date(),
          isRunning: true
      }
  };

  // 加速
  Lottery.prototype.fast = function() {
      var self = this;
      var status = self.cureentStatus;

      status.fastTimer = setInterval(function() {
          status.speed += status.accelerate;

          if (status.speed > self.param.maxSpeed) {
              clearInterval(status.fastTimer);
              status.fastTimer = null;
              status.speed = self.param.minSpeed;
          }

      }, this.param.accelerateTime);
  };

  // 减速
  Lottery.prototype.slow = function() {
      var self = this;
      var status = self.cureentStatus;

      status.slowTimer = setInterval(function() {
          status.speed -= status.accelerate;

          if (status.speed < self.param.minSpeed) {
              clearInterval(status.slowTimer);
              status.slowTimer = null;
              status.speed = self.param.minSpeed;
          }

      }, this.param.accelerateTime);
  };

  Lottery.prototype.tick = function() {
      var self = this;
      var status = self.cureentStatus;
      // 通过速度计算延时
      var delayTime = 1000 / status.speed;

      if (status.result && status.index === status.result && status.speed === self.param.minSpeed) {
          self.cureentStatus.isRunning = false;
          self.domRender();
          if (self.param.callback) {
              self.param.callback(status.result);
          }

          return;
      }

      status.timer = setTimeout(function () {
          status.index++;
          if (status.index >= self.LIST_LENGTH) {
              status.index = 0;
          }
          self.domRender();
          self.tick();
      }, delayTime);
  };

  /**
   * 设置结果
   */
  Lottery.prototype.setResult = function(result) {
      var self = this;
      var newTime = new Date();
      var status = self.cureentStatus;
      var useTime = newTime - status.startTime;
      var startSlowSpeed = function() {
          if (status.fastTimer) {
              clearInterval(status.fastTimer);
              status.fastTimer = null;
          }

          self.slow();
          status.result = parseInt(result, 10);
      };

      if (useTime >= self.param.minShowTime) {
          startSlowSpeed();
      } else {
          setTimeout(startSlowSpeed, self.param.minShowTime - useTime);
      }
  };

  /**
   * 渲染dom
   */
  Lottery.prototype.domRender = function() {
      var status = this.cureentStatus;
      var lastIndex = status.index - 1;
      lastIndex = lastIndex < 0 ? this.LIST_LENGTH -1 : lastIndex
      this.$list.eq(lastIndex).removeClass(this.param.className);
      this.$list.eq(status.index).addClass(this.param.className);
  };


  // 使用代码
  var awards = ['iPhone 6S', '¥10', '三星NOTE 5', '¥4999', 'Apple Watch', '¥100', '定制金条', '¥50', 'iPad Air2', '¥6.8', '大疆无人机', '¥1.8'];
  var lottery = new Lottery($('.js_con2_list .con2-item'), {
      callback: function(result) {
          alert('恭喜您获得奖品：' +  awards[result]);
      }
  });
  $(".js_con2-btn").on('click', function () {
      lottery.run();
      setTimeout(function() {
          lottery.setResult(2);
      }, 2000);
  });
})

