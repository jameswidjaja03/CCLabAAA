let positionsX = [];
let positionsY = [];
let velocitiesX = [];
let velocitiesY = [];
let bodyColors = [];
let noiseOffsets = []; 
let pupilOffsetsX = [];
let pupilOffsetsY = [];
let numCreatures = 4;
let planets = []; // Array to store planet information
let stars = []; // Array to manage multiple falling stars
let numStars = 100; // Number of falling stars

function setup() {
  let canvas = createCanvas(800, 500); // Create canvas
  canvas.id("p5-canvas"); // Set canvas ID
  canvas.parent("p5-canvas-container"); // Set canvas parent

  // Initialize creatures
  for (let i = 0; i < numCreatures; i++) {
    positionsX.push(random(width));
    positionsY.push(random(height));
    velocitiesX.push(random(-2, 2));
    velocitiesY.push(random(-2, 2));
    bodyColors.push(color(255));
    noiseOffsets.push(random(1000));
    pupilOffsetsX.push(0);
    pupilOffsetsY.push(0);
  }

  // Initialize planets
  planets.push({x: 100, y: 100, size: 100, color: [255, 100, 100]});
  planets.push({x: 200, y: 300, size: 80, color: [100, 255, 100]});
  planets.push({x: 400, y: 200, size: 50, color: [100, 100, 255]});
  planets.push({x: 500, y: 50, size: 70, color: [255, 255, 100]});

  // Initialize falling stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(-50, -300), // Start off-screen for a falling effect
      speedX: random(-3, 3),
      speedY: random(1, 5)
    });
  }
}

function draw() {
  background(0); // Dark universe background

  // Draw planets
  planets.forEach(planet => drawTexturedPlanet(planet.x, planet.y, planet.size, planet.color));

  // Draw and update falling stars
  stroke(255); // White color for the stars
  stars.forEach(star => {
    line(star.x, star.y, star.x + star.speedX, star.y + star.speedY);
    star.x += star.speedX;
    star.y += star.speedY;
    // Wrap star position if it goes off-screen
    if (star.x < 0) star.x = width;
    else if (star.x > width) star.x = 0;
    if (star.y > height) star.y = random(-50, -300); // Restart above the canvas
  });

  // Draw creatures
  for (let i = 0; i < numCreatures; i++) {
    updateCreature(i);
    drawCreature(i);
  }
}

function updateCreature(index) {
  // Update position
  positionsX[index] += velocitiesX[index];
  positionsY[index] += velocitiesY[index];
  // Bounce off walls
  if (positionsX[index] > width || positionsX[index] < 0) velocitiesX[index] *= -1;
  if (positionsY[index] > height || positionsY[index] < 0) velocitiesY[index] *= -1;
  // Update pupil position
  pupilOffsetsX[index] = map(noise(frameCount * 0.1), 0, 1, -5, 5);
  pupilOffsetsY[index] = map(noise(frameCount * 0.1 + 100), 0, 1, -5, 5);
}

function drawCreature(index) {
  push();
  translate(positionsX[index], positionsY[index]);

  // Wings
  let wingAngle = sin(frameCount * 0.1) * PI / 6;
  drawWing(index, -30, -10, wingAngle);
  drawWing(index, 30, -10, -wingAngle);

  // Body
  fill(bodyColors[index]);
  noStroke();
  beginShape();
  const numVertices = 100;
  for (let j = 0; j < numVertices; j++) {
    let angle = map(j, 0, numVertices, 0, TWO_PI);
    let radius = map(noise(cos(angle) * 0.5 + noiseOffsets[index], sin(angle) * 0.5 + noiseOffsets[index]), 0, 1, 25, 50);
    vertex(radius * cos(angle), radius * sin(angle));
  }
  endShape(CLOSE);

  // Eye
  fill(255); // White part of the eye
  ellipse(0, -10, 20, 30); // Eye shape
  fill(0); // Black part of the eye (pupil)
  ellipse(pupilOffsetsX[index], pupilOffsetsY[index] - 10, 10, 10);
  
  pop();
}

function drawWing(index, xOffset, yOffset, flapAngle) {
  push();
  noStroke();
  translate(xOffset, yOffset);
  rotate(flapAngle);
  fill(bodyColors[index]);
  ellipse(0, 0, 90, 20);
  pop();
}

function mousePressed() {
  // Change creature color if clicked
  for (let i = 0; i < numCreatures; i++) {
    if (dist(mouseX, mouseY, positionsX[i], positionsY[i]) < 50) {
      bodyColors[i] = color(random(255), random(255), random(255));
    }
  }
}

function drawTexturedPlanet(x, y, size, color) {
  let noiseScale = 0.01;
  let detail = 100; // Increase for more detail
  push();
  translate(x, y);
  noStroke();
  fill(color);
  ellipse(0, 0, size, size); // Base planet shape
  
  // Overlay with rough, moon-like texture
  for (let i = 0; i < detail; i++) {
    let angle = random(TWO_PI);
    let r = size * 0.5 * sqrt(random()); // Random distance from center
    let tx = r * cos(angle);
    let ty = r * sin(angle);
    let noiseVal = noise(tx * noiseScale, ty * noiseScale);
    let gray = map(noiseVal, 0, 1, 0, 255);
    fill(gray, 150); // Semi-transparent for texture overlay
    noStroke();
    ellipse(tx, ty, size / 20, size / 20); // Small craters or texture marks
  }
  pop();
}

