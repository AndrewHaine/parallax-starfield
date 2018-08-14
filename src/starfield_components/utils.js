/** Set up the default requestAnimtionFrame functions (with vendor fallbacks) */
const initRAFPolyfill = function() {
  window.rAF = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  window.cAF = (function () {
    return window.cancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame ||
      window.msCancelRequestAnimationFrame ||
      window.oCancelRequestAnimationFrame ||
      clearTimeout
  })();
};


export { initRAFPolyfill };
