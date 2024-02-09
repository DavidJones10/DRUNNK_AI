var soundByke = new p5(s,"SoundByke");
var hexagon = new p5(h, "Hexagon");
var cube = new p5(c,"Cube");
var instructions = new p5(i,"Instructions");
const limitValue = -20;
let limiter;
let masterDelay, masterDist, reverb;
let timeKnob,fbackKnob,distKnob,rateKnob,revKnob,freqKnob,
    distKnobWet,delWet,revWet;
var socket, serverURL = "ws://localhost:8765";
let inputPlayer;
let sendData;
let mic,voiceRecorder,masterRecorder,masterAudioWav;
let isRecording = false;
let textWindow = "Server not connected";
let referenceText = "Input File: None";
// The Sounds
let audioPlayers = [], audioBuffers = [];
// cool gui stuff =============================================
let soundBykeScale,soundBykeTarget,hexagonScale,hexagonTarget,
    cubeScale,cubeTarget;
soundBykeScale=soundBykeTarget=hexagonScale=hexagonTarget=
    cubeScale=cubeTarget=.6, iScale=.2, iTarget=.2;

let sX = 50,sXtarget = 50,sY = 200,sYtarget = 200,
    hX = 460,hXtarget = 460,hY = 200,hYtarget = 200,
    cX = 870,cXtarget = 870,cY = 200,cYtarget = 200;
//==============================================================
function preload(){
    Tone.start();
    if (Tone.context.state !== 'running') 
          {Tone.context.resume();}
}

function setup(){
    // Connect to the WebSocket server
    createCanvas(windowWidth,windowHeight);
    socket = new WebSocket(serverURL);
    audioSetup();
    htmlListeners();
    makeKnobs();
    getMessagesFromServer();
    socket.onopen = () =>
      {
        textWindow = "Load a file or record audio to be reimagined!";
        console.log('the socket is connected');
      }
    
}
function audioSetup(){
  limiter = new Tone.Limiter(limitValue);
  inputPlayer = new Tone.Player().toDestination();
  masterRecorder = new Tone.Recorder();
  voiceRecorder = new Tone.Recorder();
  masterDelay = new Tone.FeedbackDelay(.1,.5);
  masterDist = new Tone.BitCrusher(8);
  reverb = new Tone.Reverb(2.5);
  Tone.Master.chain(masterDelay,masterDist,reverb,limiter);
}

function draw(){
    background(97, 146, 255);
    drawUI();
    updateEffectParams();
    moveCanvases();
    fill(255,255,255);
    textAlign(CENTER);
    textSize(20);
    text(referenceText,200,20,150,100);
    textSize(40);
    text(textWindow,100,20,width-200,70);
    noFill();
    let w = textWidth(textWindow);
    rect(width/2-w/2-5,12,w+10,58,12);
}
function moveCanvases(){
    soundBykeScale = lerp(soundBykeScale,soundBykeTarget,.1);
    soundByke.scalar = soundBykeScale;
    sX = lerp(sX,sXtarget,.1);
    soundByke.canvasX = sX;
    sY = lerp(sY,sYtarget,.1);
    soundByke.canvasY = sY;
    hX = lerp(hX,hXtarget,.1);
    hexagon.canvasX = hX;
    hY = lerp(hY,hYtarget,.1);
    hexagon.canvasY = hY;
    hexagonScale = lerp(hexagonScale,hexagonTarget,.1);
    hexagon.scalar = hexagonScale;
    cX = lerp(cX,cXtarget,.1);
    cube.canvasX = cX;
    cY = lerp(cY,cYtarget,.1);
    cube.canvasY = cY;
    cubeScale = lerp(cubeScale,cubeTarget,.1);
    cube.scalar = cubeScale;
    iScale = lerp(iScale,iTarget,.1);
    instructions.scalar = iScale;
}
function updateEffectParams(){
  timeKnob.update();
  fbackKnob.update();
  distKnob.update();
  freqKnob.update();
  revKnob.update();
  delWet.update();
  revWet.update();
  distKnobWet.update();
  masterDelay.delayTime.value = (timeKnob.knobValue / 1000);
  masterDelay.feedback.value = fbackKnob.knobValue;
  masterDelay.wet.value = delWet.knobValue;
  masterDist.bits.value = int(distKnob.knobValue);
  masterDist.wet.value = distKnobWet.knobValue;
  reverb.decay.value = revKnob.knobValue;
  reverb.preDelay.value = freqKnob.knobValue;
  reverb.wet.value = revWet.knobValue;
}
function drawUI(){
  fill(200,200,200);
  rect(width-260, 50, 240, 679,20);
  fill(0);
  rect(width-255, 100, 230, 233,20);
  fill(255, 211, 254);
  rect(width-255, 340, 230, 133,20);
  fill(215, 163, 136);
  rect(width-255, 480, 230, 243,20);
  textSize(40);
  fill(0);
  text("Effects",width-260,60,240,200);
  fill(255,255,255);
  textSize(20);
  text("Delay",width-265,110,240,200);
  fill(0);
  text("Crusher",width-265,345,240,200);
  text("Reverb",width-265,485,240,200)
}
function makeKnobs(){
  let rad = 70;
  let sY = 160;
  let sX = width - 200;
  let vSpace = rad * 2 + 3;
  let hSpace = rad * 2 -30;
  timeKnob = new MakeKnob("images/knob4grey.png",rad, sX,
                 sY, 1.0, 1000.0, 200, 2, "Time(ms)");
  fbackKnob = new MakeKnob("images/knob4grey.png",rad, sX+hSpace,
                  sY, 0.0, 0.98, .5, 2, "Feedback");
  delWet = new MakeKnob("images/knob4grey.png",rad, sX+rad-15,
                  sY+vSpace-40, 0.0, 1.0, 0.0, 2, "Wet");
  timeKnob.textColor = fbackKnob.textColor = delWet.textColor = "white";

  distKnob = new MakeKnob("images/knob4grey.png",rad, sX,
                  sY+vSpace+100, 1, 8, 4, 0, "Bits");
  distKnobWet = new MakeKnob("images/knob4grey.png",rad, sX+hSpace,
                  sY+vSpace+100, 0.0, 1.0, 0.0, 2, "Wet");
  revKnob = new MakeKnob("images/knob4grey.png",rad, sX,
                  sY+vSpace*2+100, 0, 20, .5, 2, "Decay Time");
  freqKnob= new MakeKnob("images/knob4grey.png",rad, sX+hSpace,
                  sY+vSpace*2+100, 0, 4, 0, 2, "Pre-Delay");
  revWet = new MakeKnob("images/knob4grey.png",rad, sX+rad-15,
                  sY+vSpace*3+63, 0.0, 1.0, 0.0, 2, "Wet");
}

function doubleClicked(){
    if(soundByke.mouseInBounds){
        soundByke.isActive = true;
        hexagon.isActive = false;
        cube.isActive = false;
        instructions.isActive = false;
        soundBykeTarget = 1.2;
        hexagonTarget = .5;
        cubeTarget = .5;
        iTarget = .2;
        hXtarget = 800;
        hYtarget = 140;
        sXtarget = 50;
        sYtarget = 100; 
        cXtarget = 800;
        cYtarget = 500;
    }
    else if (hexagon.mouseInBounds){
        hexagon.isActive = true;
        soundByke.isActive = false;
        cube.isActive = false;
        instructions.isActive = false;
        soundBykeTarget = .5;
        hexagonTarget = 1.2;
        cubeTarget = .5;
        iTarget = .2;
        hXtarget = 50;
        hYtarget = 100;
        sXtarget = 800;
        sYtarget = 140;
        cXtarget = 800;
        cYtarget = 500;

    }
    else if (cube.mouseInBounds){
        hexagon.isActive = false;
        soundByke.isActive = false;
        cube.isActive = true;
        instructions.isActive = false;
        soundBykeTarget = .5;
        hexagonTarget = .5;
        cubeTarget = 1.2;
        iTarget = .2;
        hXtarget = 800;
        hYtarget = 500;
        sXtarget = 800;
        sYtarget = 140;
        cXtarget = 50;
        cYtarget = 100;
    }
    else if (instructions.mouseInBounds){
        hexagon.isActive = false;
        soundByke.isActive = false;
        cube.isActive = false;
        instructions.isActive = !instructions.isActive;
        if (instructions.isActive){
          iTarget = 1;  
        }else iTarget = .2;
    }

    else {
        soundBykeTarget = .6;
        hexagonTarget = .6;
        cubeTarget = .6;
        iTarget = .2;
        hexagon.isActive = false;
        soundByke.isActive = false;
        cube.isActive = false;
        instructions.isActive = false;
        hXtarget = 460;
        hYtarget = 200;
        sXtarget = 50;
        sYtarget = 200;
        cXtarget = 870;
        cYtarget = 200;
    }
}
function mousePressed(){
  timeKnob.active();
  fbackKnob.active();
  distKnob.active();
  freqKnob.active();
  revKnob.active();
  delWet.active();
  revWet.active();
  distKnobWet.active();
}
function mouseReleased(){
  timeKnob.inactive();
  fbackKnob.inactive();
  distKnob.inactive();
  freqKnob.inactive();
  revKnob.inactive();
  delWet.inactive();
  revWet.inactive();
  distKnobWet.inactive();
}

//============================================================
// Server Related Functions ==================================
//============================================================
function handleAudioFile(path)
{
  inputPlayer.load(path).then(() => {
    inputPlayer.start();
    const inputBuffer = inputPlayer.buffer;
    //const num_channels = inputBuffer.numberOfChannels;
    const audioArray = inputBuffer.toArray();
    const sample_rate = inputPlayer.buffer.sampleRate;
    sendAudioToServer(audioArray, sample_rate);
    referenceText = "Input File: From User Files";
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
      soundByke.audioPlayers = audioPlayers;
      hexagon.audioPlayers = audioPlayers;
      cube.audioPlayers = audioPlayers;
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
    referenceText = "Input File: Mic Recording";
  }
}
function startMasterRecording() {
  if (!isRecording) {
    textWindow = "Recording Master!";
    startRecording(masterRecorder, isMaster=true);
    document.getElementById('masterRecordButton').textContent = 'Stop Recording';
  }
}
function stopMasterRecording() {
  if (isRecording) {
    stopRecording(masterRecorder, isMaster=true);
    document.getElementById('masterRecordButton').textContent = 'Record Master';
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
    textWindow = 'No master recording available for export.';
  }
} 
function exportSelectedFile(){
  const select = document.getElementById("ReimaginedFiles");
  const selectedOption = select.value;
  const index = ['Percussion', 'Drunk', 'Voices', 'Vintage', 'Darbouka', 'NASA'].indexOf(selectedOption);
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
          textWindow = "Your files are being reimagined!"
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
function mouseClicked(){
  if (Tone.context.state == 'suspended') 
        {Tone.start();}
}
