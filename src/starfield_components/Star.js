const pentagonInternalAngle = (Math.PI - 108 * Math.PI / 180);

class Star {
  constructor(ctx, opts) {
    this.ctx = ctx;
    this.opts = opts;

    if (this.opts.parallaxSpeed >= 100) this.opts.parallaxSpeed = 99;

    this.velocity = (Math.random() * opts.sideLength) / (100 - this.opts.parallaxSpeed);

    this.animation = {};
    this.animation.currentTime = 1;

    this.targetX = this.opts.xPos;
    this.targetY = this.opts.yPos;

    this.originX = this.opts.xPos;
    this.originY = this.opts.yPos;
  }
  draw() {
    const star = this.ctx;

    this._moveTowards(this.targetX, this.targetY);

    star.save();
    star.beginPath();
    star.translate(this.x, this.y);
    star.moveTo(0, 0);
    for(let i = 0; i <= 5; i++) {
      star.lineTo(this.opts.sideLength, 0);
      star.translate(this.opts.sideLength, 0);
      star.rotate(-pentagonInternalAngle);
    }
    star.fillStyle = this.opts.starColor;
    star.fill();
    star.closePath();
    star.restore();
  }
  updatePositionOffset(offset) {

    this.targetX = offset.x;
    this.targetY = offset.y;

    this.animation.currentTime = 0.09;

  }
  returnToNeutral() {
    this.animation.currentTime = 0.09;
    this.targetX = this.opts.xPos;
    this.targetY = this.opts.yPos;
  }
  _moveTowards(x, y) {

    let t = this.animation.currentTime;

    if(t <= 1) {

        let dx = x - this.x,
            dy = y - this.y;

        this.x += t * dx;
        this.y += t * dy;

        this.animation.currentTime += 0.002;

    }
  }
};

export default Star;
