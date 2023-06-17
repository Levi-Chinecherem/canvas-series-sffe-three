const canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");
let cw = (canvas.width = window.innerWidth);
let ch = (canvas.height = window.innerHeight);
let rid = null; // request animation id
ctx.fillStyle = "hsla(0, 5%, 5%, .025)";

class Particle {
  constructor() {
    this.pos = { x: Math.random() * cw, y: Math.random() * ch };
    this.vel = { x: 0, y: 0 };
    this.base = (1 + Math.random()) * 0.5;
    this.life = randomIntFromInterval(5, 150);
    this.color = Math.random() < .1 ? "hsla(100,90%,50%,1)" : "hsla(200,50%,50%,.7)"
    this.history = [];
  }

  update() {
    this.history.push({ x: this.pos.x, y: this.pos.y });
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  show() {
    this.life--;
    ctx.beginPath();
    let last = this.history.length - 1;
    ctx.moveTo(this.history[last].x, this.history[last].y);
    for (let i = last; i > 0; i--) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();

    if (this.history.length > this.life) this.history.splice(0, 1);
  }

  edges() {
    if (
      this.pos.x > cw ||
      this.pos.x < 0 ||
      this.pos.y > ch ||
      this.pos.y < 0
    ) {
      this.pos.y = Math.random() * ch;
      this.pos.x = Math.random() * cw;
      this.history.length = 0;
    }
    if (this.life <= 0) {
      this.pos.y = Math.random() * ch;
      this.pos.x = Math.random() * cw;
      this.life = randomIntFromInterval(3, 20);
      this.history.length = 0;
    }
  }

  follow() {
    let x = ~~(this.pos.x / size);
    let y = ~~(this.pos.y / size);
    let index = x + y * cols;

    let angle = flowField[index];

    this.vel.x = this.base * Math.cos(angle);
    this.vel.y = this.base * Math.sin(angle);
  }
}

let particles = [];

let size = 15; //flow field cell size
let rows = ~~(ch / size) + 2;
let cols = ~~(cw / size) + 2;

let flowField = [];

function getAngle(x, y) {
  return (Math.cos(x * 0.02) + Math.cos(y * 0.02)) * Math.PI / 2;
}

function getFlowField(rows, cols) {
  for (y = 0; y <= rows; y++) {
    for (x = 0; x < cols; x++) {
      let index = x + y * cols;
      let a = getAngle(x * size, y * size);

      flowField[index] = a;
    }
  }
}

getFlowField(rows, cols);

for (let i = 0; i < 300; i++) {
  particles.push(new Particle());
}

function frame() {
  rid = requestAnimationFrame(frame);

  ctx.fillRect(0, 0, cw, ch);

  particles.map(p => {
    p.follow();
    p.update();
    p.show();
    p.edges();
  });
}

function Init() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  
  ctx.fillStyle = "hsla(0, 5%, 5%, .025)";

  rows = ~~(ch / size) + 2;
  cols = ~~(cw / size) + 2;

  flowField = new Array(rows * cols);
  getFlowField(rows, cols);

  if (rid) {
    window.cancelAnimationFrame(rid);
    rid = null;
  }
  frame();
}

window.setTimeout(function() {
  Init();

  window.addEventListener("resize", Init, false);
}, 15);


function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
