var i = function(p){
    p.canvasX = 10;
    p.canvasY = 30;
    p.scalar = .2;
    p.mouseInBounds = false;
    p.isActive = false;
    let canvas;
    let vSpace = 30;
    let hSpace = 420;
    let start = 25;
    p.setup = function(){
        container = document.getElementById("Instructions");
        canvas = p.createCanvas(875, 350);
        canvas.parent(container);
    }

    p.draw = function(){
        p.background(70,70,70);
        canvas.position(p.canvasX, p.canvasY);
        const scaledWidth = p.width * p.scalar;
        const scaledHeight = p.height * p.scalar;
        canvas.style('width', scaledWidth + 'px');
        canvas.style('height', scaledHeight + 'px');
        p.rectMode(p.CORNER);
        let cornerRadius = 10; // Adjust the corner radius as needed
        p.stroke(0); // Set the stroke color
        p.fill(255); // Set the fill color
        p.rect(0, 0, p.width, p.height, cornerRadius);
        p.fill(0);
        p.textSize(90);
        if (!p.isActive){
            p.textAlign('center','center');
            p.text("Instructions:       Double Click to expand",0,0,p.width,p.height);
        }
        else{
            p.textSize(30);
            p.textAlign('center');
            p.text("Instructions/Controls:",p.width/2,15);
            p.textSize(13);
            p.textAlign('left');
            p.text("1. All minigames can be expanded with a double click.",20,start,400,50);
            p.text("2. Double clicking in void space will return everything to original size",
                    20, start+vSpace,400,50);
            p.text("3. Pressing [v] or the [Mic Record] button will activate and deactivate the recorder for your systems's audio input device.",
                    20, start+vSpace*2-20,400,100);
            p.text("4. Once a voice recording is made or a file is loaded, your audio will be sent to the server to be processed. When you see the [Your reimagined files are loaded] message, your interactions will be audible.",
                    20, start+vSpace*3-20,400,150);
            p.text("5. Pressing [m] or the [Master Record] button will activate and deactivate the recorder for the website's master audio.",
                    20, start+vSpace*4+30,400,100);
            p.text("6. Pressing the [Export Master Recording] button will download the most recent master recording.",
                    20, start+vSpace*5+65,400,50);
            p.text("7. To export one of the reimagined files, select your desired file from the drop-down menu and press the download button. This will not work if you have not sent any files to the server.",
                    20, start+vSpace*6+60,400,100);
            p.textSize(11);
            p.text("DRAGGs controls: Clicking on a model name will create a new draggable sound source. When the player is over a draggable, sound is created. The player moves with the arrow keys. You can lock in a velocity by pressing [space] while in motion. You can change your speed and size using the sliders at the bottom. Draggbles can be deleted by being dropped in the trash bin. Pressing [e] will solidify the walls. Passing a draggable from right to left will read through the file backwards. Each draggable's playback rate is mapped to its vertical position.",
                    20+hSpace, start-40,420,200);
            p.text("The Hexagon controls: The ball can be moved using the arrow keys. When [shift] is pressed, the ball is launched towards the center at a velocity proportional to its distance from the center. Pressing [f] toggles between 1 second random clips or entire files as the audio sources for each of the hexagon's sides. Pressing [1], [2], and [3] toggles between different velocity controlled parameters. Pressing [c] will center the ball.",
                    20+hSpace, start+vSpace*3-30,420,200);
            p.text("The Cube controls: Every time you click, a random file is selected. The x location of your mouse press is where the file will start and the location of your mouse release is where the file playback will end. For instance, you can reverse the file by clicking and dragging the mouse from right to left. A delay's feedback and delay time are also mapped to mouse drags. As you drag up, the feedback amount will increase and the delay time will decrease linearly over the course of the audio playback.",
                    20+hSpace, start+vSpace*4+10,420,250);
                        
        }

    }
    p.mousePressed = function(){
        if (p.mouseX >= 0 && p.mouseX <= p.width && 
            p.mouseY >= 0 && p.mouseY <= p.height){
              p.mouseInBounds = true;
          }
          else p.mouseInBounds = false;
    }
}