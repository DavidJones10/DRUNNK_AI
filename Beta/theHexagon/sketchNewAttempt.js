canvasSize = 600
let x = canvasSize/2; // Initial x-coordinate
let y = canvasSize/2; // Initial y-coordinate
let speed = 5; // Speed of movement
let circleSize = canvasSize/30; // Size of the circle
let velocityX = 0; // Horizontal velocity
let velocityY = 0; // Vertical velocity
const friction = 0.995; // Friction coefficient
let isLaunching = false;
const limitValue = -20;
let limiter;

var socket;
var serverURL = "ws://localhost:8766";

let inputPlayer;
let sendData;

let audioContext;
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Declare audio variables for 6 sounds
let audioPlayers = [];

function preload()
{
  Tone.start();
  if (Tone.context.state !== 'running') 
        {Tone.context.resume();}
}

function setup() {

  createCanvas(canvasSize, canvasSize);
  frameRate(120);
  // Connect to the WebSocket server
  socket = new WebSocket(serverURL);
  limiter = new Tone.Limiter(limitValue).toDestination();
  inputPlayer = new Tone.Player().toDestination();
  const fileInput = document.getElementById('audioInput');

  document.getElementById('recordButton').addEventListener('click', () => {
    if (!isRecording) {
      startRecording();
      document.getElementById('recordButton').textContent = 'Stop';
    } else {
      stopRecording();
      document.getElementById('recordButton').textContent = 'Record';
    }
  });

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


function startRecording() {
  isRecording = true;

  // Create an AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Access microphone input
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      const micSource = audioContext.createMediaStreamSource(stream);

      // Create a MediaRecorder to record the audio
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function (event) {
        audioChunks.push(event.data);
      };

      // Start recording
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      // Stop recording after 10 seconds (adjust as needed)
      setTimeout(() => {
        stopRecording();
        document.getElementById('recordButton').textContent = 'Record';
      }, 10000);
    })
    .catch(function (error) {
      console.error('Error accessing microphone:', error);
    });
}

function stopRecording() {
  isRecording = false;
  console.log(mediaRecorder.state);

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  console.log(mediaRecorder.state);
  // Create a Blob from the recorded audio chunks
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

  // Reset audioChunks
  audioChunks = [];

  // Handle the recorded audio (e.g., play, download, or process with Tone.js)
  const audioUrl = URL.createObjectURL(audioBlob);
  const buffer = new Tone.Buffer(audioUrl, () => {
    // The callback is called when the audio file is loaded
    // Now, you can access the audio data as a Float32Array
    const audioArray = buffer.toArray();
  
    // Do something with the audioArray, like sending it to your server
    sendAudioToServer(audioArray,44100);
  });
  // Handle the audio URL as needed
}

function draw() {
  // Clear the canvas to avoid re-drawing the old circle
  background(255);
  text('Perc', 290, 70);
  text('Drunk', 500, 175);
  text('VCTK', 515, 400);
  text('Vintage', 280, 545);
  text('Darbouka', 38, 400);
  text('Nasa', 50, 175);


  // Draw the hexagon with a thicker border
  let hexRadius = min(width, height) / 2 - 50; // Adjust the size of the hexagon
  let hexX = width / 2;
  let hexY = height / 2;

  // Calculate the coordinates of the six vertices of the hexagon
  let hexVertices = [];

  push();
  strokeWeight(15); // Set the stroke weight to 10 (adjust as needed)
  noFill(); // Remove fill to only draw the border
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let hexXCoord = hexX + hexRadius * cos(angle);
    let hexYCoord = hexY + hexRadius * sin(angle);
    hexVertices.push(createVector(hexXCoord, hexYCoord));
    vertex(hexXCoord, hexYCoord);
  }
  endShape(CLOSE);
  pop();

  // Check for arrow key presses and update the circle's velocity
  if (keyIsDown(LEFT_ARROW)) {
    velocityX = -speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    velocityX = speed;
  }
  if (keyIsDown(UP_ARROW)) {
    velocityY = -speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    velocityY = speed;
  }

  // Apply friction to gradually slow down the circle
  velocityX *= friction;
  velocityY *= friction;

  // Update the circle's position based on velocity
  x += velocityX;
  y += velocityY;

  // Constrain the circle's position to stay within the canvas boundaries
  x = constrain(x, 0, width - circleSize);
  y = constrain(y, 0, height - circleSize);

  // Check for collision with the hexagon
  for (let i = 0; i < 6; i++) {
    let edgeStart = hexVertices[i];
    let edgeEnd = hexVertices[(i + 1) % 6];

    let intersection = lineRectIntersect(edgeStart.x, edgeStart.y, edgeEnd.x, edgeEnd.y, x, y, circleSize, circleSize);

    if (intersection) {
      // Calculate the normal vector of the wall (perpendicular to the edge)
      let edgeVector = createVector(edgeEnd.x - edgeStart.x, edgeEnd.y - edgeStart.y);
      let wallNormal = createVector(-edgeVector.y, edgeVector.x);

      // Calculate the incident velocity vector
      let incidentVelocity = createVector(velocityX, velocityY);

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
    let centerX = width / 2;
    let centerY = height / 2;
    let distance = dist(x, y, centerX, centerY);

    // Calculate the launch speed based on the distance from the center
    let launchSpeed = map(distance, 0, sqrt(width * width + height * height), 0, 10);

    // Calculate the direction vector towards the center
    let direction = createVector(centerX - x, centerY - y);
    direction.normalize();

    // Update the circle's velocity for the launch
    velocityX = direction.x * launchSpeed * 10;
    velocityY = direction.y * launchSpeed * 10;

    isLaunching = false; // Reset the launching flag
  }

  // Draw the circle at the updated position
  ellipse(x + circleSize / 2, y + circleSize / 2, circleSize);
}

function keyPressed() {
  if (keyCode === SHIFT) {
    isLaunching = true; // Set the launching flag when the Shift key is pressed
  }
}

function keyReleased() {
  if (keyCode === SHIFT) {
    isLaunching = false; // Reset the launching flag when the Shift key is released
  }
}

function playAudio(index) {
  if (audioPlayers[index])
    audioPlayers[index].start();
}

// Function to check if a line segment intersects a rectangle
function lineRectIntersect(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Check if the line segment intersects any of the rectangle's four sides
  let left = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  let right = lineLineIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  let top = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  let bottom = lineLineIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // If the line segment intersects any of the rectangle's sides, return true
  return left || right || top || bottom;
}

// Function to check if two line segments intersect
function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (den == 0) {
    return false;
  }

  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}
function handleAudioFile(path)
{
  inputPlayer.load(path).then(() => {
    inputPlayer.start();
    const inputBuffer = inputPlayer.buffer;
    //const num_channels = inputBuffer.numberOfChannels;
    const audioArray = inputBuffer.toArray();
    const sample_rate = inputPlayer.buffer.sampleRate;
    sendAudioToServer(audioArray, sample_rate);
  });
}

function sendAudioToServer(audioArr, sample_rate){
  sendData = {audio: audioArr, sampleRate: sample_rate};
  if (socket.readyState === WebSocket.OPEN){
      socket.send(JSON.stringify(sendData));
    }
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
