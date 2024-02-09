var s = function(p){
  // The Square
  let posX = 300; // Initial x-coordinate
  let posY = 300; // Initial y-coordinate
  let veloX, veloY;
  let playerSpeed = 10; // Speed of movement
  let squareSize = 15; // Size of the square
  let menuSquareSize = 60;
  let isSpacePressed;
  let menu;
  let audio1Started, audio2Started, audio3Started, audio4Started, audio5Started, audio6Started;
  audio1Started = audio2Started = audio3Started = audio4Started = audio5Started = audio6Started = false;
  p.mouseInBounds = false;
  p.scalar = .6;
  p.canvasX = 100;
  p.canvasY = 200;
  let canvas;
  let solidWalls = false;
  let modeText = "Solid Walls: OFF";
  p.isActive = false;

  p.textWindow="Load a file or record audio to be reimagined";
  // The Sounds
  p.audioPlayers = [];
  //===================================================================
  //===================================================================
  p.setup = function() 
  {
    const container = document.getElementById("SoundByke");
    // Create the canvas inside the container
    canvas = p.createCanvas(600, 600);
    canvas.parent(container);
    canvas.position(p.canvasX, p.canvasY);
    menu = new dragAndDropObjects(menuSquareSize,p);
    posX = posY = p.width/2;
  }

  //===============================================================================================
  p.draw = function() 
  {
    p.background(0);
    canvas.position(p.canvasX,p.canvasY);
    const scaledWidth = p.width * p.scalar;
    const scaledHeight = p.height * p.scalar;
    canvas.style('width', scaledWidth + 'px');
    canvas.style('height', scaledHeight + 'px');
    drawGrid();
    menu.draw();
    getSliderParams();
    getCollisions();
    p.textSize(12);
    p.fill(255,255,255);
    p.textAlign('center');
    p.text(modeText,p.width-155,55,200,50);
    drawMover();
  }

  function drawGrid()
  {
      // Draw a thin blue grid
    p.stroke(0, 0, 255); // Blue color for the grid
    for (let i = 0; i < p.width; i += 20) {
      p.line(i, 0, i, p.height);
    }
    for (let j = 0; j < p.height; j += 20) {
      p.line(0, j, p.width, j);
    }
  }

  function drawMover()
  {
    if (p.isActive){
      // Check for arrow key presses and update the square's position
      if (isSpacePressed) {
        // Maintain the current velocity
        posX += playerSpeed * veloX;
        posY += playerSpeed * veloY;
      } else {
        // Check for arrow key presses and update the square's velocity
        if (p.keyIsDown(37)) {
          veloX = -1;
          posX += playerSpeed * veloX;
        }
        else if (p.keyIsDown(39)) {
          veloX = 1;
          posX += playerSpeed * veloX;
        }
        else veloX = 0;

        if (p.keyIsDown(38)) {
          veloY = -1;
          posY += playerSpeed * veloY;
        }
        else if (p.keyIsDown(40)) {
          veloY = 1;
          posY += playerSpeed * veloY;
        }
        else veloY = 0;
      }
    
    if (!solidWalls){
      // Wrap the square around when it goes out of bounds
      if (posX > p.width) {
        posX = -squareSize; // Wrap to the left side
      } else if (posX < -squareSize) {
        posX = p.width; // Wrap to the right side
      }
      if (posY > p.height-menuSquareSize) {
        posY = -squareSize+menuSquareSize; // Wrap to the top
      } else if (posY < menuSquareSize-squareSize) {
        posY = p.height-menuSquareSize; // Wrap to the bottom
      }
    }
    else{
        // Reverse the current velocity
      if (posX > p.width - squareSize || posX < 0) {
        veloX *= -1; // Reverse horizontal velocity
        if (posX < 0) posX=0;
        else if (posX > p.width-squareSize) 
          posX = p.width-squareSize;
      }
      if (posY > p.height - menuSquareSize - squareSize || posY < menuSquareSize) {
        veloY *= -1; // Reverse vertical velocity
        if (posY < menuSquareSize) posY=menuSquareSize;
        else if (posY > p.height-menuSquareSize-squareSize) 
            posY = p.height-menuSquareSize-squareSize;
      }
    }
  }

    // Set the fill color for the rectangle
    p.fill(0, 255, 255); // Red color (change to your desired color)

    // Draw the rectangle at the updated position
    p.rect(posX, posY, squareSize, squareSize);
}


  function getCollisions()
  {
    if (p.audioPlayers[0])
    {
      if (menu.getCollision1(posX,posY,squareSize)&&!audio1Started)
      {
        connectEffects(p.audioPlayers[0]);
        p.audioPlayers[0].start();
        audio1Started = true;
      }
      else if (!menu.getCollision1(posX,posY,squareSize)&&audio1Started)
        {audio1Started = false; p.audioPlayers[0].stop();}
    }
    if (p.audioPlayers[1])
    {
      if (menu.getCollision2(posX,posY,squareSize)&&!audio2Started)
      {
        connectEffects(p.audioPlayers[1]);
        p.audioPlayers[1].start();
        audio2Started = true;
      }
      else if (!menu.getCollision2(posX,posY,squareSize)&&audio2Started)  
        {audio2Started = false; p.audioPlayers[1].stop();}
    }

    if (p.audioPlayers[2])
    {
      if (menu.getCollision3(posX,posY,squareSize)&&!audio3Started)
      {
        connectEffects(p.audioPlayers[2]);
        p.audioPlayers[2].start();
        audio3Started = true;
      }
      else if (!menu.getCollision3(posX,posY,squareSize)&&audio3Started)  
        {audio3Started = false; p.audioPlayers[2].stop();}
    }

    if (p.audioPlayers[3])
    {
      if (menu.getCollision4(posX,posY,squareSize)&&!audio4Started)
      {
        connectEffects(p.audioPlayers[3]);
        p.audioPlayers[3].start();
        audio4Started = true;
      }
      else if (!menu.getCollision4(posX,posY,squareSize)&&audio4Started)  
        {audio4Started = false; p.audioPlayers[3].stop();}
    }
    if (p.audioPlayers[4])
    {
      if (menu.getCollision5(posX,posY,squareSize)&&!audio5Started)
      {
        connectEffects(p.audioPlayers[4]);
        p.audioPlayers[4].start();
        audio5Started = true;
      }
      else if (!menu.getCollision5(posX,posY,squareSize)&&audio5Started)  
        {audio5Started = false; p.audioPlayers[4].stop();}
    }
    if (p.audioPlayers[5])
    {
      if (menu.getCollision6(posX,posY,squareSize)&&!audio6Started)
      {
        connectEffects(p.audioPlayers[5]);
        p.audioPlayers[5].start();
        audio6Started = true;
      }
      else if (!menu.getCollision6(posX,posY,squareSize)&&audio6Started)  
        {audio6Started = false; p.audioPlayers[5].stop();}
    }

  }

  function getSliderParams()
  {
    squareSize = menu.sizeSlider;
    playerSpeed = menu.speedSlider;
  }
  p.mouseReleased = function()
  {
    p.cursor("grab");
    menu.trashBinLogic();
  }

  p.keyPressed=function() {
    if (p.keyCode === 32) {
      isSpacePressed = !isSpacePressed; // Toggle the space bar state
    }
    if (p.keyCode === 69){
      solidWalls = !solidWalls;
    }
    if (solidWalls){
      modeText = "Solid Walls: ON";
    }else {modeText = "Solid Walls: OFF";}
  }
  p.mousePressed = function(){
    if (p.mouseX >= 0 && p.mouseX <= p.width && 
        p.mouseY >= 0 && p.mouseY <= p.height){
          p.mouseInBounds = true;
    }
    else p.mouseInBounds = false;
  }
  function connectEffects(player){
  
      if (veloX < 0 || veloY < 0){
        player.reverse = true;
      }
      else player.reverse = false;
      player.playbackRate = p.constrain(p.map(posY,0,p.height,2,.5),.5,2);

  }
}