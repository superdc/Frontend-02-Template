function CubicBezier(p1x, p1y, p2x, p2y){
  const ZERO_LIMIT = 1e-6;

  const ax = 3 * p1x - 3 * p2x + 1;
  const bx = 3 * p2x - 6* p1x;
  const cx = 3 * p1x;    
  const ay = 3 * p1y - 3 * p2y + 1;
  const by = 3 * p2y - 6 * p1y;
  const cy = 3 * p1y;

  function sampleCurveDerivativeX(t){
    return (3*ax*t+2*bx)*t + cx;
  }

  function sampleCurveX(t){
    return ((ax*t+bx)*t+cx) * t;
  }

  function sampleCurveY(t){
    return ((ay*t+by)*t + cy) * t;
  }

  function solveCurveX(x){
    let t2 = x;
    let derivative;
    let x2;
    // First try a few iterations of Newton's method -- normally very fast.
    for (let i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < ZERO_LIMIT)
        return t2;
      derivative = sampleCurveDerivativeX(t2);
      if (Math.abs(derivative) < ZERO_LIMIT)
        break;
      t2 = t2 - x2 / derivative;
    }
    // Fall back to the bisection method for reliability.
    let t0 = 0.0;
    let t1 = 1.0;
    t2 = x;

    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon)
        return t2;
      if (x > x2)
        t0 = t2;
      else
        t1 = t2;
      t2 = (t1 - t0) * .5 + t0;
    }
  }

  function solve(x){
    return sampleCurveY(solveCurveX(x));
  }

  return solve;
}

export const ease = CubicBezier(.25,.1,.25,1);
export const easeIn = CubicBezier(.42,0,1,1);
export const easeOut = CubicBezier(0,0,.58,1);
export const easeInOut = CubicBezier(.42,0,.58,1);
