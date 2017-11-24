const Victor = require('victor');

class Action {
  constructor() {}
}

class Movement extends Action {
  constructor(startPosition, endPosition, laserIntensity, speed) {
    super();

    this._startPosition = startPosition;
    this._endPosition = endPosition;
    this._laserIntensity = laserIntensity;
    this._speed = speed;
  }

  calculateDistance() {
    return this._startPosition.distanceSq(this._endPosition);
  }

  calculateTime() {
    const distance = this.calculateDistance();
    return distance / this._speed;
  }
}

class Simulator {
  constructor() {
    this._speed = 1;
    this._jogSpeed = 0;
    this._laserIntensity = 0.00;
    this._toolPosition = new Victor(0, 0);
    this._actions = [];
  }

  set jogSpeed(speed) {
    this._jogSpeed = speed;
  }

  move(x, y, laserIntensity, speed) {
    if (laserIntensity) {
      this._laserIntensity = laserIntensity;
    }
    if (speed) {
      this._speed = speed;
    }

    const newPosition = new Victor(x, y);

    this._actions.push(
      new Movement(this._toolPosition, newPosition, this._laserIntensity, this._speed)
    );

    this._toolPosition = newPosition.clone();
  }

  jog(x, y) {
    const newPosition = new Victor(x, y);

    this._actions.push(
      new Movement(this._toolPosition, newPosition, 0, this._jogSpeed)
    );

    this._toolPosition = newPosition.clone();
  }

  calculateTime() {
    let time = 0;
    this._actions.forEach((action) => {
      time += action.calculateTime();
    });

    return time;
  }
}

module.exports = Simulator;
