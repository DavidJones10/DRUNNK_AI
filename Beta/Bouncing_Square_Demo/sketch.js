let x = 300; // Initial x-coordinate
let y = 300; // Initial y-coordinate
let speed = 5; // Speed of movement
let squareSize = 10; // Size of the square
let velocityX = 0; // Horizontal velocity 
let velocityY = 0; // Vertical velocity
const friction = 0.999; // Friction coefficient
const limitValue = -40;
let limiter;
let recorder; 
let isRecording = false; 
let recordingStartTime; 
let recordingDuration = 10;

var socket;
var serverURL = "ws://localhost:8765";

let inputPlayer;
let sendData;
// Declare audio variables for all four sounds
let audioPlayers = [];

function preload()
{
  Tone.start();
  if (Tone.context.state !== 'running') 
        {Tone.context.resume();}
}

function setup() 
{
  createCanvas(600, 600);
  // Connect to the WebSocket server
  socket = new WebSocket(serverURL);
  limiter = new Tone.Limiter(limitValue).toDestination();
  inputPlayer = new Tone.Player().toDestination();
  const fileInput = document.getElementById('audioInput');

  fileInput.addEventListener('change', function(event) 
  {
  const selectedFile = event.target.files[0];
  if (selectedFile) 
  {
    // Get the local URL of the selected file
    const localURL = URL.createObjectURL(selectedFile);
    handleAudioFile(localURL);
  }
  });

  getMessagesFromServer();
  socket.onopen = () =>
    {
      console.log('the socket is connected');
    }
}


//============================================================

function draw() 
{
  background(225, 100, 100);
  // Check for arrow key presses and update the square's velocity
  if (keyIsDown(LEFT_ARROW)) 
    {velocityX = -speed;}
  if (keyIsDown(RIGHT_ARROW)) 
    {velocityX = speed;}
  if (keyIsDown(UP_ARROW)) 
    {velocityY = -speed;}
  if (keyIsDown(DOWN_ARROW)) 
    {velocityY = speed;}

  // Apply friction to gradually slow down the square
  velocityX *= friction;
  velocityY *= friction;

  // Update the square's position based on velocity
  x += velocityX;
  y += velocityY;

  // Constrain the square's position to stay within the canvas boundaries
  x = constrain(x, 0, width - squareSize);
  y = constrain(y, 0, height - squareSize);

  // Bounce off the walls
  if (x === 0) 
  {
    velocityX *= -1;
   if (audioPlayers[0])
    audioPlayers[0].start();
  } 
  else if (x === width - squareSize) 
  {
    velocityX *= -1;
    if (audioPlayers[1])
      audioPlayers[1].start();
  }

  if (y === 0) 
  {
    velocityY *= -1;
    if (audioPlayers[2])
      audioPlayers[2].start();
  } 
  else if (y === height - squareSize) 
  {
    velocityY *= -1;
    if (audioPlayers[0])
      audioPlayers[3].start();
  }

  // Draw the square at the updated position
  rect(x, y, squareSize, squareSize);

  if (keyIsDown(SHIFT)) 
  {
    // Calculate the distance from the center
    let centerX = width / 2;
    let centerY = height / 2;
    let distance = dist(x, y, centerX, centerY);

    // Calculate the launch speed based on distance from the center
    let launchSpeed = map(distance, 0, sqrt(width * width + height * height), 0, 10);

    // Calculate the direction vector towards the center
    let direction = createVector(centerX - x, centerY - y);
    direction.normalize();

    // Update the square's velocity for the launch
    velocityX = direction.x * launchSpeed * 50;
    velocityY = direction.y * launchSpeed * 50;
  }
}
//============================================================
//============================================================
function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}
//============================================================
function handleAudioFile(path)
{
  inputPlayer.load(path).then(() => {
    inputPlayer.start();
    const inputBuffer = inputPlayer.buffer;
    //const num_channels = inputBuffer.numberOfChannels;
    const audioArray = inputBuffer.toArray();
    const sample_rate = inputPlayer.buffer.sampleRate;
    sendData = {audio: audioArray, sampleRate: sample_rate,};
    //console.log(audioData.audio);
    if (socket.readyState === WebSocket.OPEN) 
    {
      socket.send(JSON.stringify(sendData));
    }
  });
}
function getMessagesFromServer()
{
  // Handle messages received from the server
  socket.onmessage = function (event) 
  {
    const results = JSON.parse(event.data);
    console.log(results);
    audioPlayers.forEach(player => player.dispose());
    audioPlayers = [];
    // Handle the results from the server
    for (const modelName in results) 
    {
      const audioDataArray = results[modelName];
      //console.log(arrayToBuffer(audioDataArray));
      if (Array.isArray(audioDataArray) && audioDataArray.length > 0) 
      {
        // Convert the audio data array back to an AudioBuffer
        const audioBuffer = arrayToBuffer(audioDataArray);
        if (audioBuffer) 
        {
          // Create an audio buffer source and play the processed audio
          const player = new Tone.Player(audioBuffer).toDestination().connect(limiter);
          audioPlayers.push(player);
        }
      }
    }
    console.log(audioPlayers);
  };
}

function arrayToBuffer(audioDataArray) {
  const audioContext = Tone.context;
  const audioBuffer = audioContext.createBuffer(1, audioDataArray.length, audioContext.sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < audioDataArray.length; i++) {
    channelData[i] = audioDataArray[i];
  }

  return audioBuffer;
}
