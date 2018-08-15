const pentagonInternalAngle = (Math.PI - 108 * Math.PI / 180);

import { initRAFPolyfill } from './utils';
import defaults from './defaults';
import Star from './Star';

class StarField {
  constructor(fieldView, options = {}) {

    // Merge user options with default values
    this.opts = Object.assign(defaults, options);

    // Set the `window.rAF` property to the
    initRAFPolyfill();

    // Set up the canvas ready for the animation
    this.view = fieldView;
    this._setupCanvas();
    this.ctx = this.view.getContext('2d');
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set a max value for the star count
    this.maxStarCount = this.opts.maxStarCount === 'fill' ? this._calculateStarCount() : this.opts.maxStarCount;

    this._resetStars();

    // Listen for a resize event and update the view dimensions accordingly
    window.addEventListener('resize', () => {
      this._setDimensions();
      this.view.width = this.dimensions.w;
      this.view.height = this.dimensions.h;
      this._resetStars();
    }, false);

    // Add DOM listeners
    if(this.opts.parallax) {
      this._addFieldListeners();
    }

    // Kick off the rAF loop
    this._updateField();

  }
  _setupCanvas() {
    this._setDimensions();
    this.view.style.backgroundColor = this.opts.bgColor;
  }
  _setDimensions() {
    this.dimensions = {
      w: this.view.offsetWidth * window.devicePixelRatio,
      h: this.view.offsetHeight * window.devicePixelRatio,
      c: {
        x: (this.view.offsetWidth / 100) * this.opts.originX,
        y: (this.view.offsetHeight / 100) * this.opts.originY
      }
    };
  }
  _calculateStarCount() {
    // We want to have a ratio of 1:2000 stars to pixels
    const pixelArea = (this.dimensions.w * this.dimensions.h);
    const devicePixelArea = pixelArea / (window.devicePixelRatio * window.devicePixelRatio);
    return devicePixelArea / 2000;
  }
  _resetStars() {
    this.maxStarCount = this.opts.maxStarCount === 'fill' ? this._calculateStarCount() : this.opts.maxStarCount;

    this.ctx.clearRect(0, 0, this.dimensions.w, this.dimensions.h);

    this.stars = [];

    // Add the stars
    if (!this.opts.progressiveFill) {
      for (let i = 0; i <= this.maxStarCount; i++) {
        this._createNewStar();
      }
    }
  }
  _updateField() {
    if (this.opts.progressiveFill && this.stars.length <= this.maxStarCount) this._createNewStar();
    this.ctx.canvas.width = this.dimensions.w;
    this.ctx.canvas.height = this.dimensions.h;
    this.ctx.clearRect(0, 0, this.dimensions.w, this.dimensions.h);

    this.stars.forEach(star => star.draw());

    this.animationFrame = rAF(() => this._updateField());
  }

  _createNewStar() {

    const sideLength = (Math.random().toFixed(2) * this.opts.starSizeVariance) * window.devicePixelRatio;

    const xPos = Math.random() * this.dimensions.w;
    const yPos = Math.random() * this.dimensions.h;

    const starOpts = Object.assign({
      sideLength,
      xPos,
      yPos
    }, this.opts);

    const star = new Star(this.ctx, starOpts);

    star.ctx = this.ctx;
    star.sideLength = sideLength;
    star.x = xPos;
    star.y = yPos;

    this.stars.push(star);
  }
  _addFieldListeners() {

    let eventBase = this.opts.fullscreenBackground ? document : this.view;

    eventBase.addEventListener('mousemove', e => {
      this._moveHandler(e);
    });
    eventBase.addEventListener('mouseleave', () => {
      this.stars.forEach(star => star.returnToNeutral());
      this.mouseOrigin = false;
    });
  }
  _moveHandler(e) {

    let xDiff = e.clientX - this.dimensions.c.x,
        yDiff = e.clientY - this.dimensions.c.y;

    if (!this.mouseOrigin) {
      this.mouseOrigin = {x: xDiff, y: yDiff}
    }

    this.stars.forEach(star => {

      let targetX = (star.opts.xPos + ((this.mouseOrigin.x - xDiff) * star.velocity));
      let targetY = (star.opts.yPos + ((this.mouseOrigin.y - yDiff) * star.velocity));

      star.updatePositionOffset({ x: targetX, y: targetY});
    });
  }
}

export default StarField;
