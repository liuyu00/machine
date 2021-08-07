const defaultParams = {
  // 加速度
  accelerate: 0.1,
  // 最小速度
  minSpeed: 2,
  // 最大速度
  maxSpeed: 60,
  // 最小旋转时间
  minShowTime: 3000,
  // 加速延时
  accelerateTime: 20,
  className: 'active',
  callback: null
};

class Lottery {
  constructor (param) {
    this.param = {...defaultParams, ...param}
    this.list = document.querySelectorAll('.grid')
    this.LIST_LENGTH = this.list.length;

    // 当前状态
    this.cureentStatus = {
      timer: '', // 游戏运行的定时器
      index: 0,
      speed: this.param.minSpeed,
      accelerate: this.param.accelerate,
      timer: null,
      startTime: new Date(),
      isRunning: false
    };
  }
  
  run () {
    if (this.cureentStatus.isRunning) {
        return;
    }
    this.initStatus();
    this.render();
    this.tick();
    this.fast();
  }


  initStatus () {
    // 清理timer
    if (this.cureentStatus.timer) {
        clearTimeout(this.cureentStatus.timer);
    }

    // 初始化当前状态数据
    this.cureentStatus = {
        ...this.cureentStatus,
        speed: this.param.minSpeed,
        accelerate: this.param.accelerate,
        timer: null,
        startTime: new Date(),
        isRunning: true,
        result: null
    }
  }

  tick () {
    var status = this.cureentStatus;
    // 通过速度计算延时
    var delayTime = 1000 / status.speed;

    if (status.result && status.index === status.result && status.speed === this.param.minSpeed) {
        this.cureentStatus.isRunning = false;
        this.render();
        if (this.param.callback) {
            this.param.callback(status.result);
        }

        return;
    }

    status.timer = setTimeout(() => {
        status.index++;
        if (status.index >= this.LIST_LENGTH) {
            status.index = 0;
        }
        this.render();
        this.tick();
    }, delayTime);
  }


  fast () {
    var status = this.cureentStatus;

    status.fastTimer = setInterval(() => {
        status.speed += status.accelerate;

        if (status.speed > this.param.maxSpeed) {
            clearInterval(status.fastTimer);
            status.fastTimer = null;
            status.speed = this.param.maxSpeed;
        }

    }, this.param.accelerateTime);
  }

  slow () {
    var status = this.cureentStatus;

    status.slowTimer = setInterval(() => {
        status.speed -= status.accelerate;

        if (status.speed < this.param.minSpeed) {
            clearInterval(status.slowTimer);
            status.slowTimer = null;
            status.speed = this.param.minSpeed;
        }

    }, this.param.accelerateTime);
  }

  setResult (result) {
      var newTime = new Date();
      var status = this.cureentStatus;
      var useTime = newTime - status.startTime;
      var startSlowSpeed = () => {
          if (status.fastTimer) {
              clearInterval(status.fastTimer);
              status.fastTimer = null;
          }

          this.slow();
          status.result = parseInt(result, 10);
      };

      if (useTime >= this.param.minShowTime) {
          startSlowSpeed();
      } else {
          setTimeout(startSlowSpeed, this.param.minShowTime - useTime);
      }
  }

  render () {
    var index = this.cureentStatus.index
    var cureentGrid = document.querySelector(`.grid[data-index="${index}"]`)

    // console.log(index)
    cureentGrid.className = 'grid active'
    for (var i=0; i<this.list.length; i++) {
      if (this.list[i] != cureentGrid) {
        this.list[i].className = 'grid'
      }
    }
  }
}

