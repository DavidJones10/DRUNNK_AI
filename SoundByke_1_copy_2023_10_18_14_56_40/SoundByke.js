
// The Square
let posX = 300; // Initial x-coordinate
let posY = 300; // Initial y-coordinate
let veloX, veloY;
let speed = 10; // Speed of movement
let squareSize = 15; // Size of the square
let menuSquareSize = 60;
let isSpacePressed;
let menu;
let audio1Started, audio2Started, audio3Started, audio4Started, audio5Started, audio6Started;
audio1Started = audio2Started = audio3Started = audio4Started = audio5Started = audio6Started = false;
const limitValue = -20;
let limiter;

var socket;
var serverURL = "ws://localhost:8765";

let inputPlayer;
let sendData;
var scalar = 1;

let audioContext;
let voiceRecorder;
let masterRecorder;
let masterAudioWav;
let isRecording = false;
let masterAudioURL;
let isRecordingMaster = false;
let dummyPlayer;
let textWindow="";
let mic;

// The Sounds
let audioPlayers = [];
let audioBuffers = [];
//===================================================================
function preload()
{
  Tone.start();
  if (Tone.context.state !== 'running') 
        {Tone.context.resume();}
}
//===================================================================
function setup() 
{
  const container = createDiv();
  container.position(20, 30); // Adjust the position as needed

  // Create the canvas inside the container
  const canvas = createCanvas(600, 600);
  canvas.parent(container);
  menu = new dragAndDropObjects(menuSquareSize);
   // Connect to the WebSocket server
   socket = new WebSocket(serverURL);
   limiter = new Tone.Limiter(limitValue).toDestination();
   inputPlayer = new Tone.Player().toDestination();
   masterRecorder = new Tone.Recorder();
   voiceRecorder = new Tone.Recorder();
   htmlListeners();
   getMessagesFromServer();
   socket.onopen = () =>
     {
       console.log('the socket is connected');
     }
}

//===============================================================================================
function draw() 
{
  background(0);
  const scaledWidth = width * scalar;
  const scaledHeight = height * scalar;
  select('canvas').style('width', scaledWidth + 'px');
  select('canvas').style('height', scaledHeight + 'px');
  cursor(HAND);
  drawGrid();
  menu.draw();
  getSliderParams();
  getCollisions();
  drawMover();
  noStroke();
  fill(0,255,0);
  textSize(12);
  textAlign(CENTER);
  text(textWindow, width/2 + 200, 60, 100, 50);
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
    if (isSpacePressed) {
      // Maintain the current velocity
      posX += speed * veloX;
      posY += speed * veloY;
    } else {
      // Check for arrow key presses and update the square's velocity
      if (keyIsDown(LEFT_ARROW)) {
        veloX = -1;
        posX += speed * veloX;
      }
      else if (keyIsDown(RIGHT_ARROW)) {
        veloX = 1;
        posX += speed * veloX;
      }
      else veloX = 0;

      if (keyIsDown(UP_ARROW)) {
        veloY = -1;
        posY += speed * veloY;
      }
      else if (keyIsDown(DOWN_ARROW)) {
        veloY = 1;
        posY += speed * veloY;
      }
      else veloY = 0;
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
  if (audioPlayers[4])
  {
    if (menu.getCollision5(posX,posY,squareSize)&&!audio5Started)
    {
      audioPlayers[4].start();
      audio5Started = true;
    }
    else if (!menu.getCollision5(posX,posY,squareSize)&&audio5Started)  
      {audio5Started = false; audioPlayers[4].stop();}
  }
  if (audioPlayers[5])
  {
    if (menu.getCollision6(posX,posY,squareSize)&&!audio6Started)
    {
      audioPlayers[5].start();
      audio6Started = true;
    }
    else if (!menu.getCollision6(posX,posY,squareSize)&&audio6Started)  
      {audio6Started = false; audioPlayers[5].stop();}
  }

}

function getSliderParams()
{
  squareSize = menu.sizeSlider;
  speed = menu.speedSlider;
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
      textWindow = "Reimagining your audio";
    }
}

function getMessagesFromServer()
{
  // Handle messages received from the server
  socket.onmessage = function (event) 
  {
    const results = JSON.parse(event.data);
    audioPlayers.forEach(player => player.dispose());
    audioPlayers = [];
    // Handle the results from the server
    for (const modelName in results) 
    {
      const audioDataArray = results[modelName];
      if (Array.isArray(audioDataArray) && audioDataArray.length > 0) 
      {
        // Convert the audio data array back to an AudioBuffer
        const audioBuffer = arrayToBuffer(audioDataArray);
        if (audioBuffer) 
        {
          // Create an audio buffer source and play the processed audio
          audioBuffers.push(audioBuffer);
          const player = new Tone.Player(audioBuffer).toDestination().connect(limiter);
          audioPlayers.push(player);
        }
      }
    }
    if (audioPlayers)
    {
      textWindow = "Your reimagined files are loaded!";
    }
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

function mouseReleased()
{
  menu.trashBinLogic();
}

function keyPressed() {
  if (keyCode === 32) {
    isSpacePressed = !isSpacePressed; // Toggle the space bar state
  }
}
//===============================================================================================
//add these functions and call htmlListeners in setup for all html buttons
//===============================================================================================
function htmlListeners()
{
  // Create an audio recorder with a maximum duration of 10 seconds
  document.getElementById('voiceRecordButton').addEventListener('click', () => {
    if (!isRecording) {
      startVoiceRecording();
    } else {
      stopVoiceRecording();
    }
  });
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'v') {
      if (!isRecording) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    }
  });

  document.getElementById('masterRecordButton').addEventListener('click', () => {
    if (!isRecording) {
      startMasterRecording();
    } else {
      stopMasterRecording();
    }
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'm') {
      if (!isRecording) {
        startMasterRecording();
      } else {
        stopMasterRecording();
      }
    }
  });

  document.getElementById('exportMasterButton').addEventListener('click', exportMasterRecording);
  document.getElementById('downloadReimaginedFile').addEventListener('click', exportSelectedFile);

  const fileInput = document.getElementById('audioInput');
   fileInput.addEventListener('change', function(event){
    const selectedFile = event.target.files[0];
    if (selectedFile) 
    {
      const localURL = URL.createObjectURL(selectedFile);
      handleAudioFile(localURL);
    }
   });
}
function startVoiceRecording() {
  if (!isRecording) {
    textWindow = "Recording Voice!";
    startRecording(voiceRecorder, isMaster=false);
    document.getElementById('voiceRecordButton').textContent = 'Stop Recording';
  }
}
function stopVoiceRecording() {
  if (isRecording) {
    stopRecording(voiceRecorder, isMaster=false);
    document.getElementById('voiceRecordButton').textContent = 'Record Mic';
  }
}
function startMasterRecording() {
  if (!isRecording) {
    textWindow = "Recording Voice!";
    startRecording(masterRecorder, isMaster=true);
    document.getElementById('voiceRecordButton').textContent = 'Stop Recording';
  }
}
function stopMasterRecording() {
  if (isRecording) {
    stopRecording(masterRecorder, isMaster=true);
    document.getElementById('voiceRecordButton').textContent = 'Record Mic';
  }
}
function exportMasterRecording() {
   if (masterAudioWav) {
    const wavData = masterAudioWav; 
    const wavBlob = new Blob([wavData], { type: 'audio/wav' });
    const url = window.URL.createObjectURL(wavBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'masterRecording.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  } else {
    console.error('No master recording available for export.');
  }
} 
function exportSelectedFile(){
  const select = document.getElementById("ReimaginedFiles");
  const selectedOption = select.value;
  const index = ['Percussion', 'Drunk', 'Voices', 'Vintage', 'Darbouka', 'NASA'].indexOf(selectedOption);;
  console.log(selectedOption," and ",index);
  if (index !== -1 && index < audioBuffers.length){
    const selectedBuffer = audioBuffers[index];
    const wavData = audioBufferToWav(selectedBuffer);
    const wavBlob = new Blob([wavData], {type: 'audio/wav'});
    const wavUrl = window.URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = wavUrl;
    a.download = a.download = `Reimagined Audio ${selectedOption}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(wavUrl);
  }else{
    textWindow = "Your files have not been processed yet";
  }
}
function startRecording(recorder, isMaster=false)
{
  isRecording = true;
  if (!isMaster){
      mic = new Tone.UserMedia().connect(recorder);
      mic.open().then(()=> {
        recorder.start();
        textWindow = "Mic Is Recording";
      });
  }else{
      Tone.Master.connect(recorder);
      recorder.start();
      textWindow = "Recording Master";
  }
}
async function stopRecording(recorder, isMaster=false) {
  isRecording = false;
  if (recorder)
  {
    const recording = await recorder.stop();
    if (recording)
    {
      const audioURL = URL.createObjectURL(recording);

      const buffer = new Tone.Buffer(audioURL, () => {
        const audioArray = buffer.toArray();
        if (!isMaster)
        {
          sendAudioToServer(audioArray,44100);
        }
        else
        {
          masterAudioURL = audioURL;
          masterAudioWav = audioBufferToWav(buffer);
        }
        }, (e)=> {console.error(e);});
    }
  }
  else{console.log("recorder dont exist");}
}

