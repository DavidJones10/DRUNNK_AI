let r, g, b;
let x, y, z;
let c;
let cnv, cnv2, env;
const limitValue = -20;
let limiter;
let startX, startY, endX, endY, RstartX, RstartY;
let fileStart, fileEnd, fileLength;
var socket;
var serverURL = "ws://localhost:8765";

let inputPlayer;
let sendData;
var scalar = 1;

let audioContext;
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioPlayers = [];
let fileNames = ["Percussion", "Drunk", "Voice", "Vintage", "Darbouka", "NASA"];
let fileIndex;
let lerp1=50, lerp2=15, lerp3=150, lerp4 =100;
let RfileLength = 5;
let fontLoaded = false;
let font;

//------------------------------------------------------------------------------------------------------

function preload() {
  Tone.start();
  if (Tone.context.state !== "running") {
    Tone.context.resume();
  }
  font = loadFont('Inconsolata.otf');
}

function setup() {
  cnv = createCanvas(600, 600, WEBGL);
  r = random(0,100);
  g = random(0,100);
  b = random(0,100);
  c = color(155 + r, 155 + g, 155 + b , random(0, 50));
  x = random(75, 300);
  y = random(75, 300);
  z = random(75, 300);
  startX = 0.5;
  startY = 0.5;
  endX = 0.5;
  endY = 0.5;
  RstartX = 0.5;
  RstartY = 0.5;
  textFont(font)
  textSize(16);
  frameRate(30);

     // Connect to the WebSocket server
  socket = new WebSocket(serverURL);
  limiter = new Tone.Limiter(limitValue).toDestination();
  inputPlayer = new Tone.Player().toDestination();
  const fileInput = document.getElementById("audioInput");

//----------------------------------------------------------------------------------

  document.getElementById("recordButton").addEventListener("click", () => {
    if (!isRecording) {
      startRecording();
      document.getElementById("recordButton").textContent = "Stop";
    } else {
      stopRecording();
      document.getElementById("recordButton").textContent = "Record";
    }
  });

  fileInput.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Get the local URL of the selected file
      const localURL = URL.createObjectURL(selectedFile);
      handleAudioFile(localURL);
    }
  });

  getMessagesFromServer();
  socket.onopen = () => {
    console.log("the socket is connected");
  };
}


function draw() {
  background(c);
  push();
    stroke(155,155,155);
    strokeWeight(4);
    translate(0,290,0);
    plane(width - 20,1);
    translate(290,-290,0);
    plane(1,height-20);
  pop();
  push();
    fill(0);
    text("File Start",-280,283);
    text("File End",200,283);
    rotateZ(-1.6);
    translate(0,280,0);
    text("Delay Time",0,0);
  pop();
  noFill();
  strokeWeight(2);
  stroke(r, g, b);
  lerp1 = lerp(lerp1, (endX - RstartX), (0.01 * (2 * RfileLength)));
  lerp2 = lerp(lerp2, (endY - RstartY), (0.01 * (2 * RfileLength)));
  lerp3 = lerp(lerp3, (endX - RstartY), (0.01 * (2 * RfileLength)));
  lerp4 = lerp(lerp4, (endY - RstartX), (0.01 * (2 * RfileLength)));
  {
    rotateX((millis() / 500) * (lerp1));
    rotateY((millis() / 500) * (lerp2));
    rotateZ((millis() / 500) * (lerp3));
    box(x, y, z);
  }
  {
    rotateX((millis() / 500) * (lerp1));
    rotateY((millis() / 500) * (lerp4));
    rotateZ((millis() / 500) * (lerp3));
    box(x / 2, y / 2, z / 2);
  }
  {
    rotateX((millis() / 500) * (lerp1));
    rotateY((millis() / 500) * (lerp2));
    rotateZ((millis() / 500) * (lerp3));
    box(x / 6, y / 6, z / 6);
  }
}

function startRecording() {
  isRecording = true;

  // Create an AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Access microphone input
  navigator.mediaDevices
    .getUserMedia({ audio: true })
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
        document.getElementById("recordButton").textContent = "Record";
      }, 10000);
    })
    .catch(function (error) {
      console.error("Error accessing microphone:", error);
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
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

  // Reset audioChunks
  audioChunks = [];

  // Handle the recorded audio (e.g., play, download, or process with Tone.js)
  const audioUrl = URL.createObjectURL(audioBlob);
  const buffer = new Tone.Buffer(audioUrl, () => {
    // The callback is called when the audio file is loaded
    // Now, you can access the audio data as a Float32Array
    const audioArray = buffer.toArray();

    // Do something with the audioArray, like sending it to your server
    sendAudioToServer(audioArray, 44100);
  });
  // Handle the audio URL as needed
}

function mousePressed() {
  // Check if the mouse is released within the canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    startX = map(mouseX, 0, width, 0, 1);
    startY = map(mouseY, 0, height, 1, 0);
    isDragging = false;

  }
}

function mouseReleased() {

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    endX = map(mouseX, 0, width, 0, 1);
    endY = map(mouseY, 0, height, 1, 0);
    RstartX = startX
    RstartY = startY 
    isDragging = true;
  }

      // Log the values
      // console.log("Start X:", startX);
      // console.log("End X:", endX);
      // console.log("Start Y:", startY);
      // console.log("End Y:", endY);

  let d = dist(0, 0, displayWidth, displayHeight);
  if (d > 100) {
    r = random(255);
    g = random(255);
    b = random(255);
    c = color(255 - r, 255 - g, 255 - b , random(0, 50));
    x = random(50, 200);
    y = random(50, 200);
    z = random(50, 200);


//----------------------------------------------------------------------------------


    let randIndex = random(5);
    fileIndex = randIndex;
    let currentPlayer = audioPlayers[int(randIndex)];
    
    if (currentPlayer){
      if (startX > endX){
          let newStart = (currentPlayer.buffer.length - (currentPlayer.buffer.length*startX))/44100;
          fileStart = startX * (currentPlayer.buffer.length) / 44100;
          fileEnd = endX * (currentPlayer.buffer.length) / 44100;
          fileLength = fileStart - fileEnd;
          RfileLength = fileLength
          fileStart = newStart;
          currentPlayer.reverse = true;
           //console.log("reversed", newStart, fileLength);
      }
      else {
          fileStart = startX * (currentPlayer.buffer.length) / 44100;
          fileEnd = endX * (currentPlayer.buffer.length) / 44100;
          fileLength = fileEnd - fileStart;
          RfileLength = fileLength
          currentPlayer.reverse = false;
           //console.log("forward", fileStart, fileLength);
      }

    // delay start -----------------------------------------------------------------------------
    // console.log(fileStart,fileEnd,fileLength);
    // Get the duration of the audio file

    // const duration = audioPlayers[int(randIndex)].buffer.duration;
    // console.log(duration , audioPlayers[int(randIndex)].buffer.length);

    // Generate a random start time within the valid range
    // const startTime = Math.random() * (duration - 1);

    // Set the player's start time and duration

      const feedbackDelay = new Tone.FeedbackDelay({
        delayTime: endY - .01, // Delay time in seconds
        maxDelay: 5, // Maximum delay time in seconds
        feedback: startY, // Initial feedback value
      }).toDestination();
  
      // Ramp the feedback value from feedbackStart to feedbackEnd over the specified duration
      feedbackDelay.feedback.rampTo(endY - .01, fileLength);
      feedbackDelay.delayTime.rampTo(startY, fileLength);

      currentPlayer.connect(feedbackDelay);

    // delay end ------------------------------------------------------------------------------

    currentPlayer.start(0, fileStart, fileLength);

  }
  } 
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

