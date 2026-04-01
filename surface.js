// Perlin Noise implementation
class Noise {
  constructor(r) {
    if (r == undefined) r = Math;
    this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                                   [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                                   [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    this.p = [];
    for (var i=0; i<256; i++) {
      this.p[i] = Math.floor(r.random()*256);
    }
    this.perm = [];
    for(var i=0; i<512; i++) {
      this.perm[i]=this.p[i & 255];
    }
  }

  dot(g, x, y, z) {
    return g[0]*x + g[1]*y + g[2]*z;
  }

  mix(a, b, t) {
    return (1.0-t)*a + t*b;
  }

  fade(t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  noise(x, y, z) {
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);
    x = x - X;
    y = y - Y;
    z = z - Z;
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;
    var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12;
    var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
    var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12;
    var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;
    var n000= this.dot(this.grad3[gi000], x, y, z);
    var n100= this.dot(this.grad3[gi100], x-1, y, z);
    var n010= this.dot(this.grad3[gi010], x, y-1, z);
    var n110= this.dot(this.grad3[gi110], x-1, y-1, z);
    var n001= this.dot(this.grad3[gi001], x, y, z-1);
    var n101= this.dot(this.grad3[gi101], x-1, y, z-1);
    var n011= this.dot(this.grad3[gi011], x, y-1, z-1);
    var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1);
    var u = this.fade(x);
    var v = this.fade(y);
    var w = this.fade(z);
    var nx00 = this.mix(n000, n100, u);
    var nx01 = this.mix(n001, n101, u);
    var nx10 = this.mix(n010, n110, u);
    var nx11 = this.mix(n011, n111, u);
    var nxy0 = this.mix(nx00, nx10, v);
    var nxy1 = this.mix(nx01, nx11, v);
    var nxyz = this.mix(nxy0, nxy1, w);
    return nxyz;
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  subtractNew(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
}

class SurfacePoint {
  constructor(index) {
    this.index = index;
    this._acceleration = 0;
    this._speed = Math.random() * 0.5;
    this._height = 0;
  }

  set height(value) { this._height = value; }
  get height() { return this._height; }
  set speed(value) { this._speed = Math.min(Math.max(value, -2), 2); }
  get speed() { return this._speed; }
  set acceleration(value) { this._acceleration = value; }
  get acceleration() { return this._acceleration; }
}

class Surface {
  constructor(numPoints, dimensions) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'surfaceCanvas';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.noise = new Noise();
    this.t = 0;
    this.running = true;
    this.elasticity = 0.00007;
    this.friction = 0.0045;
    this._numPoints = numPoints;
    this._dimensions = dimensions;
    this.width = dimensions.width;
    this.height = dimensions.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.points = [];
    for (let i = 0; i <= this._numPoints; i++) {
      this.points.push(new SurfacePoint(i));
    }

    this.oldMousePos = new Vector(0, 0);

    window.addEventListener('pointermove', this.onMouseMove.bind(this));

    // FIX: llamar render() manualmente para iniciar el loop
    this.render();
  }

  get segWidth() {
    return this.width / this._numPoints;
  }

  onMouseMove(e) {
    e.preventDefault();
    let mousePos = new Vector(e.clientX, e.clientY);
    let difference = this.oldMousePos.subtractNew(mousePos);
    let offset = this.canvas.getBoundingClientRect();

    let normalisedPos1 = mousePos.y - (offset.top + this.height / 2);
    let normalisedPos2 = this.oldMousePos.y - (offset.top + this.height / 2);

    let changed = normalisedPos1 * normalisedPos2 < 0;

    if (changed) {
      let closestPointIndex = Math.round(mousePos.x / (this.width / this._numPoints));
      let closestPoint = this.points[closestPointIndex];
      if (closestPoint) {
        let power = Math.min(Math.max(difference.y * 0.2, -1), 1);
        closestPoint.speed += -power;
      }
    }

    this.oldMousePos = mousePos;
  }

  render() {
    if (!this.running) return;

    let ctx = this.ctx;
    let y = 0;
    ctx.clearRect(0, 0, this.width, this.height);

    let ops = [];
    ops.push({ name: 'beginPath', params: [] });
    ops.push({ name: 'moveTo', params: [0, 0] });
    ops.push({ name: 'lineTo', params: [0, this.height * 0.5] });
    y = this.height * 0.5;

    this.t += 0.015;

    this.points.forEach((point, index) => {
      let left1 = this.points[index - 1];
      let right1 = this.points[index + 1];
      let left2 = this.points[index - 2];
      let right2 = this.points[index + 2];

      let left1Height = left1 ? left1.height : 0;
      let right1Height = right1 ? right1.height : 0;
      let left2Height = left2 ? left2.height : 0;
      let right2Height = right2 ? right2.height : 0;

      point.acceleration = (-0.3 * point.height + (left1Height - point.height) + (right1Height - point.height)) * this.elasticity - point.speed * this.friction;
      point.acceleration += (-0.3 * point.height + (left2Height - point.height) + (right2Height - point.height)) * (this.elasticity / 2) - point.speed * this.friction;
      point.speed += point.acceleration * 5;
      point.height += point.speed * 10;

      let p1 = new Vector(this.segWidth * (index - 1), y + left1Height);
      let p2 = new Vector(this.segWidth * index, y + point.height);
      let xc = (p1.x + p2.x) / 2;
      let yc = (p1.y + p2.y) / 2;
      ops.push({ name: 'quadraticCurveTo', params: [p1.x, p1.y, xc, yc] });

      let sp = this.noise.noise(p1.x * 0.01, p1.y * 0.01, this.t);
      sp *= sp;
      point.speed += sp * 0.05;
    });

    let p1 = new Vector(this.segWidth * (this._numPoints), y + this.points[this.points.length - 1].height);
    let p2 = new Vector(this.segWidth * (this._numPoints + 1), y);
    let xc = (p1.x + p2.x) / 2;
    let yc = (p1.y + p2.y) / 2;
    ops.push({ name: 'quadraticCurveTo', params: [p1.x, p1.y, xc, yc] });

    ops.push({ name: 'lineTo', params: [this.width, 0] });
    ops.push({ name: 'lineTo', params: [0, 0] });
    ops.push({ name: 'closePath', params: [] });

    ctx.globalCompositeOperation = 'source-over';

    // Gradiente cyan → purple más visible
    let gradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.5);
    gradient.addColorStop(0, 'rgba(0, 255, 200, 0.4)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 200, 0.15)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

    ctx.fillStyle = gradient;

    ops.forEach(op => {
      ctx[op.name](...op.params);
    });
    ctx.fill();

    // Segunda onda más sutil debajo
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.height * 0.5);
    this.points.forEach((point, index) => {
      let p1 = new Vector(this.segWidth * (index - 1), this.height * 0.5 + (this.points[index - 1] ? this.points[index - 1].height * 0.5 : 0));
      let p2 = new Vector(this.segWidth * index, this.height * 0.5 + point.height * 0.5);
      let xc = (p1.x + p2.x) / 2;
      let yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
    });
    ctx.lineTo(this.width, this.height);
    ctx.closePath();

    let gradient2 = ctx.createLinearGradient(0, this.height * 0.5, 0, this.height);
    gradient2.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    gradient2.addColorStop(1, 'rgba(139, 92, 246, 0.02)');
    ctx.fillStyle = gradient2;
    ctx.fill();

    window.requestAnimationFrame(() => this.render());
  }

  resize(dimensions) {
    this._dimensions = dimensions;
    this.width = dimensions.width;
    this.height = dimensions.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
}

// Inicialización
let surface;
document.addEventListener('DOMContentLoaded', () => {
  surface = new Surface(
    Math.floor(window.innerWidth / 50),
    { width: window.innerWidth, height: window.innerHeight }
  );
  window.addEventListener('resize', () => {
    surface.resize({ width: window.innerWidth, height: window.innerHeight });
  });
});
