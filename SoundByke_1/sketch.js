// The Square
let posX = 300; // Initial x-coordinate
let posY = 300; // Initial y-coordinate
let speed = 10; // Speed of movement
let squareSize = 15; // Size of the square
let menuSquareSize = 60;
let menu;
let audio1Started, audio2Started, audio3Started, audio4Started;
audio1Started = audio2Started = audio3Started = audio4Started = false;

// The Sounds
let audioPlayers = [];

function setup() 
{
  createCanvas(600, 600);
  menu = new dragAndDropObjects(menuSquareSize);
  Tone.start();
  handleFileInput(1);
  handleFileInput(2);
  handleFileInput(3);
  handleFileInput(4);
}


function draw() 
{
  // Set the background to black
  background(0);
  drawGrid();
  menu.draw();
  getSliderParams();
  getCollisions();
  drawMover();
}

function handleFileInput(inputIndex) 
{
  const fileInput = select(`#audioFileInput${inputIndex}`);

  fileInput.changed((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const audioPlayer = new Tone.Player(e.target.result).toDestination(); // Load and connect audio player
      audioPlayers[inputIndex - 1] = audioPlayer; // Store in the appropriate index
    };

    reader.readAsDataURL(file);
  });
}

function drawGrid()
{
    // Draw a thin blue grid
  stroke(0, 0, 255); // Blue color for the grid
  for (let i = 0; i < width; i += 20) {
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += 20) {
    line(0, j, width, j);
  }
}
function drawMover()
{
    // Check for arrow key presses and update the square's position
  if (keyIsDown(LEFT_ARROW)) {
    posX -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    posX += speed;
  }
  if (keyIsDown(UP_ARROW)) {
    posY -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    posY += speed;
  }

  // Wrap the square around when it goes out of bounds
  if (posX > width) {
    posX = -squareSize; // Wrap to the left side
  } else if (posX < -squareSize) {
    posX = width; // Wrap to the right side
  }
  if (posY > height-menuSquareSize) {
    posY = -squareSize+menuSquareSize; // Wrap to the top
  } else if (posY < menuSquareSize-squareSize) {
    posY = height-menuSquareSize; // Wrap to the bottom
  }

  // Set the fill color for the rectangle
  fill(0, 255, 255); // Red color (change to your desired color)

  // Draw the rectangle at the updated position
  rect(posX, posY, squareSize, squareSize);
}
function getCollisions()
{
  if (audioPlayers[0])
  {
    if (menu.getCollision1(posX,posY,squareSize)&&!audio1Started)
    {
      audioPlayers[0].start();
      audio1Started = true;
    }
    else if (!menu.getCollision1(posX,posY,squareSize)&&audio1Started)
      {audio1Started = false; audioPlayers[0].stop();}
  }
  if (audioPlayers[1])
  {
    if (menu.getCollision2(posX,posY,squareSize)&&!audio2Started)
    {
      audioPlayers[1].start();
      audio2Started = true;
    }
    else if (!menu.getCollision2(posX,posY,squareSize)&&audio2Started)  
      {audio2Started = false; audioPlayers[1].stop();}
  }
  
  if (audioPlayers[2])
  {
    if (menu.getCollision3(posX,posY,squareSize)&&!audio3Started)
    {
      audioPlayers[2].start();
      audio3Started = true;
    }
    else if (!menu.getCollision3(posX,posY,squareSize)&&audio3Started)  
      {audio3Started = false; audioPlayers[2].stop();}
  }
  
  if (audioPlayers[3])
  {
    if (menu.getCollision4(posX,posY,squareSize)&&!audio4Started)
    {
      audioPlayers[3].start();
      audio4Started = true;
    }
    else if (!menu.getCollision4(posX,posY,squareSize)&&audio4Started)  
      {audio4Started = false; audioPlayers[3].stop();}
  }
}
function getSliderParams()
{
  squareSize = menu.sizeSlider.value();
  speed = menu.speedSlider.value();
}

