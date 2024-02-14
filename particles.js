// this class describes the properties of a single particle.
const TRAIL_LENGTH = 10;
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor() {
    this.r = random(8, 15); // doubles as mass
    this.lucky = Math.random() < 0.05;

    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-2, 2), random(-1, 1.5));
    this.acc = createVector(0, 0);

    this.maxforce = 0.0000000000001;
    this.maxspeed = 1.5;

    this.distanceToBlob = this.pos.dist(blobMonsterPos);
    this.isEaten = false;

    this.trail = [this.pos.copy()];

    // null intially
    this.framesSinceFlee = null;
  }

  // creation of a particle.
  show() {
    noStroke();
    fill(this.lucky ? "rgba(245,169,72,1)" : "rgba(200,169,169,0.5)");

    if (this.distanceToBlob < maxBlobRadius && !this.lucky) {
      // turn nearby particles green
      fill("rgba(84,196,108,0.7) ");
    }

    // if (this.framesSinceFlee && this.framesSinceFlee < 20) {
    //   fill("red");
    // }
    if (this.trail.length > TRAIL_LENGTH) {
      console.error("trail too long:", this.trail.length);
    }
    circle(this.pos.x, this.pos.y, this.r);
    if (
      this.framesSinceFlee != null &&
      this.framesSinceFlee < TRAIL_LENGTH
      // !this.isEaten
    ) {
      fill("rgba(255,255,255,0.07)");
      for (let i = 0; i < this.trail.length; i++) {
        if (this.trail[i]) {
          circle(this.trail[i].x, this.trail[i].y, this.r - TRAIL_LENGTH / i);
        }
      }
    }
  }

  // setting the particle in motion.
  update() {
    if (growMaxBlob) {
      return;
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.distanceToBlob = dist(this.pos.x, this.pos.y, width / 2, height / 2);

    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -1;
    }

    if (this.framesSinceFlee != null) {
      if (this.trail.length >= TRAIL_LENGTH) {
        this.trail.shift();
      }

      this.trail.push(this.pos.copy());
      this.framesSinceFlee++;
    }
  }
  boundaries(offset) {
    let des = null;

    if (this.pos.x < offset) {
      des = createVector(this.maxspeed, this.vel.y);
    } else if (this.pos.x > width - offset) {
      des = createVector(-this.maxspeed, this.vel.y);
    }

    if (this.pos.y < offset) {
      des = createVector(this.vel.x, this.maxspeed);
    } else if (this.pos.y > height - offset) {
      des = createVector(this.vel.x, -this.maxspeed);
    }

    if (des !== null) {
      des.normalize();
      des.mult(this.maxspeed);
      let steer = p5.Vector.sub(des, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  seek(target) {
    // params are vector pos of where you want to seek
    let des = p5.Vector.sub(target, this.pos);
    des.setMag(this.maxspeed);
    let steering = p5.Vector.sub(des, this.vel);
    return steering;
  }
  flee(target) {
    // reset the number of frames since last flee to be 0
    if (growing) {
      this.framesSinceFlee = 0;
    }
    return this.seek(target).mult(-1);
  }
  applyForce(force) {
    this.acc.add(force);
  }
}
