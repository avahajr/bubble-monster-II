let particles = [];
const NUM_PARTICLES = 100;

const minBlobRadius = 25;
const sizeDifference = 35;
let currentBlobRadius = minBlobRadius;
let scareRange = 20;

const growSpeed = 0.1;

let maxBlobRadius = minBlobRadius + sizeDifference;

// flags for animating.
let growMaxBlob = false;
let nextMaxRadius;

// variable for caching frames where the spacebar is held down during freeze-frame
let buttonCache = [];

let blobMonsterPos;

let growing = false;
let blobMonsterFill = "rgba(255,255,255,0.8)";
let maxBlobFill = "rgba(255, 255, 255, 0.1)";

let score = 0;

let eatSound;
let luckyEatSound;

function preload() {
  soundFormats("mp3");
  eatSound = loadSound("sounds/blip");
  luckyEatSound = loadSound("sounds/powerup");
}

function setup() {
  createCanvas(500, 400, document.getElementById("game"));
  blobMonsterPos = createVector(width / 2, height / 2);
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background("#0c0e12");
  textSize(22);
  textFont("Pixelify Sans");
  fill("white");

  text(score, 10, 30);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (
      particles[i].distanceToBlob <= currentBlobRadius + particles[i].r &&
      growing
    ) {
      particles[i].isEaten = true;
      if (particles[i].lucky) {
        nextMaxRadius = maxBlobRadius + 15;
        growMaxBlob = true;
        buttonCache = [];
        scareRange = maxBlobRadius / 2 - 5;
        console.log("maxBlobRadius:", maxBlobRadius, "scareRange:", scareRange);
        luckyEatSound.play();
      } else {
        eatSound.play();
      }
      // Remove the particle from the array
      particles.splice(i, 1);
      score += 1;

      continue;
    }
    particles[i].show();

    particles[i].update();

    if (particles[i].distanceToBlob - currentBlobRadius < scareRange) {
      fleevect = particles[i].flee(blobMonsterPos);
      particles[i].applyForce(fleevect);
    }

    particles[i].boundaries(25);
  }

  // draw the blobmonster
  fill(blobMonsterFill);
  circle(width / 2, height / 2, currentBlobRadius * 2);

  fill(maxBlobFill);
  circle(width / 2, height / 2, maxBlobRadius * 2);

  if (!growMaxBlob) {
    if (buttonCache.length >= 1) {
      getInputFromCache();
    }
    if (growing) {
      currentBlobRadius = lerp(currentBlobRadius, maxBlobRadius, growSpeed);
    } else {
      currentBlobRadius = lerp(currentBlobRadius, minBlobRadius, growSpeed);
    }
  }
  if (growMaxBlob) {
    buttonCache.push(keyIsDown(32) ? 32 : 0);
    maxBlobRadius = lerp(maxBlobRadius, nextMaxRadius, growSpeed / 2);
  }
  if (Math.abs(maxBlobRadius - nextMaxRadius) < 1) {
    growMaxBlob = false;
  }
}

function keyPressed() {
  if (keyCode === 32) {
    growing = true;
    blobMonsterFill = "rgba(255,255,255,0.95)";
  }
}

function keyReleased() {
  if (keyCode === 32) {
    growing = false;
    blobMonsterFill = "rgba(255,255,255,0.8)";
  }
}

function getInputFromCache() {
  // a function that sets growing and fill for one frame.
  growing = buttonCache[0] == 32;
  blobMonsterFill = growing
    ? "rgba(255,255,255,0.95)"
    : "rgba(255,255,255,0.8)";
  buttonCache.shift();
}
