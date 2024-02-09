let r, g, b;
let x, y, z;
let xs, ys, zs;
let c;
let cnv;
let rel, att;
let osc, playing, freq, amp, pan;
let delT, delF, delFreq;
let reverbTime, decayRate;

function setup() {
  cnv = createCanvas(displayWidth, displayHeight, WEBGL);
  r = random(255);
  g = random(255);
  b = random(255);
  c = color(255 - r - 50, 255 - g - 50, 255 - b - 50, random(0, 100));
  x = random(75, 300);
  y = random(75, 300);
  z = random(75, 300);
  xs = random(-0.05, 0.05);
  ys = random(-0.05, 0.05);
  zs = random(-0.06, 0.06);
  xs2 = random(0.0675, -0.0675);
  ys2 = random(0.0675, -0.0675);
  zs2 = random(0.075, -0.075);
  xs3 = random(-0.1, 0.1);
  ys3 = random(-0.1, 0.1);
  zs3 = random(-0.15, 0.15);
  rel = random(0, 0.5);
  att = random(0, 0.5);
  delT = random(0.01, 1);
  delF = random(0.1, 0.8);
  delFreq = random(100, 22000);
  reverbTime = random(5, 25);
  decayRate = random(10, 99);
  cnv.mousePressed(playOscillator);
  osc = new p5.Oscillator("sawtooth");
  delay = new p5.Delay();
  reverb = new p5.Reverb();
  //dist = new p5.Distortion();
}

function playOscillator() {
  osc.start();
  playing = true;
}

function mouseReleased() {
  osc.amp(0, rel);
  playing = false;
}

function draw() {
  background(c);
  noFill();
  stroke(r, g, b);
  {
    rotateX(frameCount * xs);
    rotateY(frameCount * ys);
    rotateZ(frameCount * zs);
    box(x, y, z);
  }
  {
    rotateX(frameCount * xs2);
    rotateY(frameCount * ys2);
    rotateZ(frameCount * zs2);
    box(x / 2, y / 2, z / 2);
  }
  {
    rotateX(frameCount * xs3);
    rotateY(frameCount * ys3);
    rotateZ(frameCount * zs3);
    box(x / 6, y / 6, z / 6);
  }

  freq = random(1, 8) * 55;
  amp = random(0.2, 0.9);
  pan = random(-1.0, 1.0);
}

function mousePressed() {
  let d = dist(0, 0, displayWidth, displayHeight);
  if (d > 100) {
  r = random(255);
  g = random(255);
  b = random(255);
  c = color(255 - r - 50, 255 - g - 50, 255 - b - 50, random(0, 100));
  x = random(50, 200);
  y = random(50, 200);
  z = random(50, 200);
  xs = random(-0.0675, 0.0675);
  ys = random(-0.0675, 0.0675);
  zs = random(-0.075, 0.075);
  xs2 = random(0.0675, -0.0675);
  ys2 = random(0.0675, -0.0675);
  zs2 = random(0.075, -0.075);
  xs3 = random(-0.1, 0.1);
  ys3 = random(-0.1, 0.1);
  zs3 = random(-0.15, 0.15);
  rel = random(0, 0.5);
  att = random(0, 0.5);
  delT = random(0.01, 1);
  delF = random(0.1, 0.8);
  delFreq = random(100, 22000);
  reverbTime = random(5, 25);
  decayRate = random(10, 99);
}

if (playing) {
  osc.freq(freq, att);
  osc.amp(amp, rel);
  osc.pan(pan, 0.5);
  reverb.drywet(1);
  delay.drywet(0.5);
  reverb.process(osc, reverbTime, decayRate);
  delay.process(osc, delT, delF, delFreq);
  //new p5.Distortion(0.25, oversample='none')
}
}
