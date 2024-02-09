var c = function(p){
  let r, g, b;
  let x, y, z;
  let c;
  let startX, startY, endX, endY, RstartX, RstartY;
  let fileStart, fileEnd, fileLength;
  let canvas;
  p.isActive = false;

  p.scalar= .6;
  p.audioPlayers = [];
  p.canvasX = 870;
  p.canvasY = 200;
  p.mouseInBounds = false;

  let lerp1=50, lerp2=15, lerp3=150, lerp4 =100;
  let RfileLength = 5;
  let font;

  //------------------------------------------------------------------------------------------------------

  p.preload = function() {
    font = p.loadFont('Inconsolata.otf');
  }

  p.setup = function() {
    container = document.getElementById("Cube");
    canvas = p.createCanvas(600, 600, WEBGL);
    canvas.parent(container);
    randomizeVariables();
    startX = 0.5;
    startY = 0.5;
    endX = 0.5;
    endY = 0.5;
    RstartX = 0.5;
    RstartY = 0.5;
    p.textFont(font)
    p.textSize(16);
    p.frameRate(30);
  }
  function randomizeVariables(){
    r = p.random(0,100);
    g = p.random(0,100);
    b = p.random(0,100);
    c = p.color(155 + r, 155 + g, 155 + b);
    x = p.random(75, 300);
    y = p.random(75, 300);
    z = p.random(75, 300);
  }

  p.draw = function() {
    p.background(c);
    canvas.position(p.canvasX,p.canvasY);
    const scaledWidth = p.width * p.scalar;
    const scaledHeight = p.height * p.scalar;
    canvas.style('width', scaledWidth + 'px');
    canvas.style('height', scaledHeight + 'px');
    p.push();
      p.stroke(155,155,155);
      p.strokeWeight(4);
      p.translate(0,290,0);
      p.plane(p.width - 20,1);
      p.translate(290,-290,0);
      p.plane(1,p.height-20);
    p.pop();
    p.push();
      p.fill(0);
      p.text("File Start",-280,283);
      p.text("File End",200,283);
      p.rotateZ(-1.6);
      p.translate(-90,280,0);
      p.text("Delay Time/Feedback",0,0);
    p.pop();
    p.noFill();
    p.strokeWeight(2);
    p.stroke(r, g, b);
    lerp1 = p.lerp(lerp1, (endX - RstartX), (0.01 * (2 * RfileLength)));
    lerp2 = p.lerp(lerp2, (endY - RstartY), (0.01 * (2 * RfileLength)));
    lerp3 = p.lerp(lerp3, (endX - RstartY), (0.01 * (2 * RfileLength)));
    lerp4 = p.lerp(lerp4, (endY - RstartX), (0.01 * (2 * RfileLength)));
    {
      p.rotateX((millis() / 500) * (lerp1));
      p.rotateY((millis() / 500) * (lerp2));
      p.rotateZ((millis() / 500) * (lerp3));
      p.box(x, y, z);
    }
    {
      p.rotateX((millis() / 500) * (lerp1));
      p.rotateY((millis() / 500) * (lerp4));
      p.rotateZ((millis() / 500) * (lerp3));
      p.box(x / 2, y / 2, z / 2);
    }
    {
      p.rotateX((millis() / 500) * (lerp1));
      p.rotateY((millis() / 500) * (lerp2));
      p.rotateZ((millis() / 500) * (lerp3));
      p.box(x / 6, y / 6, z / 6);
    }
  }
  p.mousePressed = function() {
    // Check if the mouse is released within the canvas
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height){
      startX = map(p.mouseX, 0, p.width, 0, 1);
      startY = map(p.mouseY, 0, p.height, 1, 0);
      isDragging = false;
    }
    if (p.mouseX >= 0 && p.mouseX <= p.width && 
      p.mouseY >= 0 && p.mouseY <= p.height){
        p.mouseInBounds = true;
    }
    else p.mouseInBounds = false;
  }

  p.mouseReleased = function(){
  if (p.isActive&&p.mouseInBounds){
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      endX = p.map(p.mouseX, 0, p.width, 0, 1);
      endY = p.map(p.mouseY, 0, p.height, 1, 0);
      RstartX = startX
      RstartY = startY 
      isDragging = true;
    }
    let d = dist(0, 0, p.width, p.height);
    if (d > 100) {
      randomizeVariables();
  //----------------------------------------------------------------------------------
      let randIndex = p.random(5);
      fileIndex = randIndex;
      let currentPlayer = p.audioPlayers[int(randIndex)];

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
        const feedbackDelay = new Tone.FeedbackDelay({
          delayTime: endY - .01, // Delay time in seconds
          maxDelay: 5, // Maximum delay time in seconds
          feedback: startY, // Initial feedback value
        }).toDestination();
      
        // Ramp the feedback value from feedbackStart to feedbackEnd over the specified duration
        feedbackDelay.feedback.rampTo(endY - .01, fileLength);
        feedbackDelay.delayTime.rampTo(startY, fileLength);

        currentPlayer.connect(feedbackDelay);
        if (!p.isActive){
          for (let i=0; i < p.audioPlayers.length;i++){
            p.audioPlayers[i].disconnect(feedbackDelay);
          }
        }
          //currentPlayer.disconnect(feedbackDelay);

      // delay end ------------------------------------------------------------------------------

      currentPlayer.start(0, fileStart, fileLength);
      }
    } 
    }
  }

}

