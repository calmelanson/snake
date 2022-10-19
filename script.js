// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, colorMode, createCanvas, ellipse, height,
 *    mouseX, mouseY, noStroke, random, rect, round, sqrt, text, width
 *    frameRate, stroke, noFill, keyCode, UP_ARROW, DOWN_ARROW
 *    RIGHT_ARROW, LEFT_ARROW, fill, collideRectRect, squareSize, noLoop, textSize, loop, LoadSound,
 */

let backgroundColor, playerSnake, currentApple, score, squareSize, LoadSound;
var song;
function preload(){
  song= loadSound('https://cdn.glitch.com/e75aa76d-d240-4a41-bc6a-8ecc0e09e6f7%2FThe%20Perfect%20Snake%20Game.mp3?v=1627580155471')

}
function setup() {
  // Canvas & color settings
  createCanvas(396, 396);
  song.play
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 55;
  frameRate(12);
  squareSize = 10;
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
}

function draw() {
  background(backgroundColor);
  backgroundColor = 55;
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  playerSnake.checkWall();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  textSize(12);
  fill(0);
  text(`Score:${score}`, 10, 38);
}

class Snake {
  constructor() {
    this.size = squareSize;
    this.x = width / 2 + 6;
    this.y = height - 12;
    this.direction = "N";
    this.speed = 12;
    this.tail = [new TailSegment(this.x, this.y)];
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    // Add new head to front of tail
    this.tail.unshift(new TailSegment(this.x, this.y));

    // Remove last segment of tail
    this.tail.pop();
  }

  showSelf() {
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkApples() {
    // Check if snake head has collided with appl
    if (
      collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        currentApple.x,
        currentApple.y,
        currentApple.size,
        currentApple.size
      )
    ) {
      score += 1;
      this.extendTail();
      currentApple = new Apple();
      backgroundColor =('grey')
    }
  }
  
  checkCollisions() {
    // Check every tail segment for collision with head
    for (let i = 1; i < this.tail.length; i++) {
    
      if (
      collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        this.tail[i].x,
        this.tail[i].y,
        this.tail[i].size,
        this.tail[i].size))
     {
      console.log("GAME OVER!!!");
      gameOver();
      }
    }
  }
  
  checkWall() {
    if(this.x < 0 || this.x > width - squareSize || this.y < 0 || this.y > height - squareSize) {
      gameOver();
    }
  }
  
  extendTail() {
    // Add new tail segment to the end in the same position as current last tail segment
    let lastTailSegment = this.tail[this.tail.length - 1];
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = squareSize;
  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
}

class Apple {
  constructor() {
    this.x = random(width-squareSize);
    this.y = random(height-squareSize);
    this.size = squareSize;
  }

  showSelf() {
    fill(0, 80, 80);
    rect(this.x, this.y, this.size, this.size);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && playerSnake.direction != "S") {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
    playerSnake.direction = "W";
  } else if (keyCode === 82) {
    restartGame();
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  score = 0;
  playerSnake = new Snake();
  currentApple = new Apple();
  loop();
}

function gameOver() {
  stroke(0);
  text(`GAME OVER!!! Press R to restart`, 10, 20);
  noLoop();
}
