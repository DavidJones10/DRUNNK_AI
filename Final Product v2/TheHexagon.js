var h = function(p){
  let canvasSize = 600;
  let x = canvasSize/2; // Initial x-coordinate
  let y = canvasSize/2; // Initial y-coordinate
  let speed = 10; // Speed of movement
  let circleSize = canvasSize/30; // Size of the circle
  let velocityX = 0; // Horizontal velocity
  let velocityY = 0; // Vertical velocity
  const friction = 0.995; // Friction coefficient
  let isLaunching = false;
  let canvas;
  let state = 1;
  let mode = "1 Second Clip";
  let velocityChangerText = "Velocity Changes: Nothing"
  let vChange = 1
  let bounds = "In Bounds";
  let oneSec = true;
  let inBounds = true;
  let currentVelocity = 0;
  let centerX = canvasSize/2;
  let centerY = canvasSize/2;
  p.isActive = false;
  p.scalar= .6;
  p.audioPlayers = [];
  p.canvasX = 560;
  p.canvasY = 200;
  p.mouseInBounds = false;

  p.setup = function() {
    container = document.getElementById("Hexagon");
    canvas = p.createCanvas(600, 600);
    canvas.parent(container);
    // Connect to the WebSocket server
  }

  p.draw = function() {
    // Clear the canvas to avoid re-drawing the old circle
    p.background(150, 200, 255);
    canvas.position(p.canvasX,p.canvasY);
    const scaledWidth = p.width * p.scalar;
    const scaledHeight = p.height * p.scalar;
    canvas.style('width', scaledWidth + 'px');
    canvas.style('height', scaledHeight + 'px');
    p.textSize(15);
    p.fill(0);
    p.text('Darbouka', 282, 70);
    p.text('NASA', 500, 175);
    p.text('Perc', 515, 400);
    p.text('Drunk', 280, 545);
    p.text('VCTK', 30, 400);
    p.text('Vintage', 50, 175);
    p.text(mode, 1, 15);
    p.text(bounds, 1, 30);
    p.text("Current Velocity: " + p.nf(currentVelocity, 1, 2), 1, 45);
    p.text(velocityChangerText, 1, 60);

    let velocityColor = p.lerpColor(p.color(255, 255, 255), p.color(255, 0, 0), p.map(currentVelocity, 0, 34, 0, 1));

    // Draw the hexagon with a thicker border
    let hexRadius = p.min(p.width, p.height) / 2 - 50; // Adjust the size of the hexagon
    let hexX = p.width / 2;
    let hexY = p.height / 2;
    let filterRadius = (p.min(p.width, p.height) / 2 - 50) + 10;
    let distance = p.dist(x, y, centerX, centerY);

    // Calculate the coordinates of the six vertices of the hexagon
    let hexVertices = [];

    p.push();
    p.strokeWeight(15); // Set the stroke weight to 10 (adjust as needed)
    p.noFill(); // Remove fill to only draw the border
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let hexXCoord = hexX + hexRadius * p.cos(angle);
      let hexYCoord = hexY + hexRadius * p.sin(angle);
      hexVertices.push(p.createVector(hexXCoord, hexYCoord));
      p.vertex(hexXCoord, hexYCoord);
    }
    p.endShape('close');
    p.pop();
    if (p.isActive){
      // Check for arrow key presses and update the circle's velocity
      if (p.keyIsDown(37)) {
        velocityX = -speed;
      }
      if (p.keyIsDown(39)) {
        velocityX = speed;
      }
      if (p.keyIsDown(38)) {
        velocityY = -speed;
      }
      if (p.keyIsDown(40)) {
        velocityY = speed;
      }
    }else velocityX = velocityY = 0;
    // Apply friction to gradually slow down the circle
    velocityX *= friction;
    velocityY *= friction;

    // Update the circle's position based on velocity
    x += velocityX;
    y += velocityY;
    currentVelocity = sqrt( velocityX * velocityX + velocityY * velocityY);

    // Constrain the circle's position to stay within the canvas boundaries
    x = p.constrain(x, 0, p.width - circleSize);
    y = p.constrain(y, 0, p.height - circleSize);
    // Check for collision with the hexagon
    if (p.isActive)
    {
      for (let i = 0; i < 6; i++) {
        let edgeStart = hexVertices[i];
        let edgeEnd = hexVertices[(i + 1) % 6];

        let intersection = lineRectIntersect(edgeStart.x, edgeStart.y, edgeEnd.x, edgeEnd.y, x, y, circleSize, circleSize);

        if (intersection) {
          // Calculate the normal vector of the wall (perpendicular to the edge)
          let edgeVector = p.createVector(edgeEnd.x - edgeStart.x, edgeEnd.y - edgeStart.y);
          let wallNormal = p.createVector(-edgeVector.y, edgeVector.x);

          // Calculate the incident velocity vector
          let incidentVelocity = p.createVector(velocityX, velocityY);

          // Calculate the reflection velocity vector
          let reflectionVelocity = incidentVelocity.reflect(wallNormal);

          // Update the circle's velocity with the reflection velocity
          velocityX = reflectionVelocity.x;
          velocityY = reflectionVelocity.y;

          playAudio(i); // Play audio when hitting the wall
          break;
        }
      }

      if (isLaunching) {
        // Calculate the distance from the center
        let centerX = p.width / 2;
        let centerY = p.height / 2;
        let distance = p.dist(x, y, centerX, centerY);

        // Calculate the launch speed based on the distance from the center
        let launchSpeed = p.map(distance, 0, sqrt(width * width + height * height), 0, 20);

        // Calculate the direction vector towards the center
        let direction = p.createVector(centerX - x, centerY - y);
        direction.normalize();

        // Update the circle's velocity for the launch
        velocityX = direction.x * launchSpeed * 10;
        velocityY = direction.y * launchSpeed * 10;

        isLaunching = false; // Reset the launching flag
      }
    } 
    p.fill(velocityColor);
      // Draw the circle at the updated position
    p.ellipse(x + circleSize / 2, y + circleSize / 2, circleSize);
    if (distance <= filterRadius) {
      bounds = "Status: In Bounds";
      inBounds = true;
    } else {
      bounds = "Status: Out of Bounds";
      inBounds = false;
  
      // Play random part of a random audio file for 0.25 seconds every 0.3 seconds
      if (p.isActive){
      if (p.frameCount % 36 === 0) {
          playRandomAudioPart();
      }}
    }
  }

  p.keyPressed = function() {
    if (p.keyCode === 16) {//shift
      isLaunching = true; // Set the launching flag when the Shift key is pressed
    }
    if (p.keyCode === 70) {//f
      state += 1;
      if (state % 2 === 1) {
        oneSec = true;
        //console.log("1 sec mode");
        mode = "Mode: 1 Second Clip";
      } else {
        oneSec = false;
        //console.log("full mode");
        mode = "Mode: Full Audio";
      }
    }
    if (p.keyCode === 67){// c
      x = p.width/2;
      y = p.height/2;
      velocityX = 0;
      velocityY = 0;
    }
  
    if (p.keyCode === 49) {  // Key 1
      velocityChangerText = "Velocity Changes: Nothing"; 
      vChange = 1;
    }
    if (p.keyCode === 50) {  // Key 2
      velocityChangerText = "Velocity Changes: Pitch"; 
      vChange = 3;
    }
    if (p.keyCode === 51) {  // Key 3
      velocityChangerText = "Velocity Changes: Playback Speed"; 
      vChange = 4;
    }
  }

  p.keyReleased = function() {
    if (p.keyCode === 16) {
      isLaunching = false; // Reset the launching flag when the Shift key is released
    }
  }

  p.mousePressed = function(){
    if (p.mouseX >= 0 && p.mouseX <= p.width && 
        p.mouseY >= 0 && p.mouseY <= p.height){
          p.mouseInBounds = true;
    }
    else p.mouseInBounds = false;
  }
  
  function playAudio(index) {
    let currentPlayer = p.audioPlayers[index];
    let startTime = 0;
    if (currentPlayer){
      const duration = currentPlayer.buffer.duration;
      if (oneSec) {
          if (duration >= 1)
            startTime = Math.random() * (duration - 1);
          currentPlayer.start(0, startTime, 1);
      }
      else{
          currentPlayer.start(0,startTime,duration);
      }
      currentPlayer.playbackRate = 1;
      currentPlayer.speed = 1;
      // Check if vChange is 3 for velocity-based pitch changes
      if (vChange === 3) {
        // Apply velocity-based pitch scaling when vChange is 3
        const pitchFactor = p.map(currentVelocity, 0, 22, 0.5, 1.5);
  
        // Ensure that pitch is within the desired range
        const scaledPitch = p.constrain(pitchFactor, 0.5, 1.5);
  
        // Set the pitch using Tone.Player's playbackRate property
        currentPlayer.playbackRate = scaledPitch;
  
        // Optional: Log the audio context state
        //console.log("Audio Context State:", Tone.context.state);
      }
  
    // Check if vChange is 4 for velocity-based playback speed changes
      if (vChange === 4) {
        // Apply velocity-based playback speed scaling when vChange is 4
        const speedFactor = p.map(currentVelocity, 0, 22, 0.5, 1.5);
  
        // Ensure that speed is within the desired range
        const scaledSpeed = p.constrain(speedFactor, 0.5, 1.5);
  
        // Set the playback speed using Tone.Player's speed property
        currentPlayer.speed = scaledSpeed;
  
        // Restart the Tone.Player after changing the speed
        currentPlayer.stop().start();
  
        // Optional: Log the audio context state
        //console.log("Audio Context State:", Tone.context.state);
      } 
    } 
  }

let isPlaying = false;
let scheduledEvent;

function playRandomAudioPart() {
  // Stop all audio players when inBounds is true
  let audioPlayers = p.audioPlayers;
  if (inBounds) {
    audioPlayers.forEach(player => player.stop());
    if (scheduledEvent) {
      clearTimeout(scheduledEvent);
    }
    return;
  }

  if (audioPlayers.length > 0 && !isPlaying) {
    isPlaying = true;

    let randomPlayer = random(audioPlayers);
    let duration = Math.min(0.25, randomPlayer.buffer.duration); // Limit duration to 0.25 seconds

    randomPlayer.stop();

    randomPlayer.onstop = () => {
      isPlaying = false;

      if (!inBounds) {
        scheduledEvent = setTimeout(() => playRandomAudioPart(), 1);
      }
    };

    randomPlayer.start(0, 0, duration);
  }
}

  function lineRectIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
    let left = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    let right = lineLineIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    let top = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    let bottom = lineLineIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

    return left || right || top || bottom;
  }

  function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return false;
    }

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }
}
