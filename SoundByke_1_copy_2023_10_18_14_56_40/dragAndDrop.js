function dragAndDropObjects(menuHeight)
{
  this.menuHeight = menuHeight;
  this.buttonHeight = menuHeight-20;
  this.buttonWidth =  80;
  this.topBool = top;
  this.file1Draggables = new draggables(5,255,0,0);
  this.file2Draggables = new draggables(5,0,150,50);
  this.file3Draggables = new draggables(5,0,200,255);
  this.file4Draggables = new draggables(5,175,175,100);
  this.file5Draggables = new draggables(5,151,124,210);
  this.file6Draggables = new draggables(5,249,146,91);
 
  this.trash = new TrashBin(width-30, height-5, 40);
  this.sizeSlider = 15;
  this.speedSlider = 2;
  var buttonX=22,buttonY=10,buttonGap=15;
  
  
  //============================================================
  this.draw=function()
  {
    fill(5,10,50);
    rect(0,0, width, this.menuHeight,5);
    rect(0,540,width,this.menuHeight,5);
    this.makeNewDraggable();
    this.file1Draggables.draw();
    this.file2Draggables.draw();
    this.file3Draggables.draw();
    this.file4Draggables.draw();
    this.file5Draggables.draw();
    this.file6Draggables.draw();
    //console.log(this.getCollision2(posX, posY, squareSize));
    this.trash.display();
    this.drawText();
    this.sliders();
    /*
    if (this.file1Draggables.numDrags >1)
      console.log(this.file1Draggables.drags[1].x)*/
    uiupd();
  }
  //detects when player is over draggable rect
  //============================================================
  this.getCollision1=function(playerX,playerY,playerSize)
  {
    return this.file1Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  this.getCollision2=function(playerX,playerY,playerSize)
  {
    return this.file2Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  this.getCollision3=function(playerX,playerY,playerSize)
  {
    return this.file3Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  this.getCollision4=function(playerX,playerY,playerSize)
  {
    return this.file4Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  this.getCollision5=function(playerX,playerY,playerSize)
  {
    return this.file5Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  this.getCollision6=function(playerX,playerY,playerSize)
  {
    return this.file6Draggables.sendTriggers(playerX,playerY,playerSize);
  }
  //============================================================
  this.trashBinLogic=function()
  {
    const trash1 = this.file1Draggables.sendTriggers(width-30, height-50,40,true);
    const trash2 = this.file2Draggables.sendTriggers(width-30, height-50,40,true);
    const trash3 = this.file3Draggables.sendTriggers(width-30, height-50,40,true);
    const trash4 = this.file4Draggables.sendTriggers(width-30, height-50,40,true);
    const trash5 = this.file5Draggables.sendTriggers(width-30, height-50,40,true);
    const trash6 = this.file6Draggables.sendTriggers(width-30, height-50,40,true);
    if (trash1[0]){
      this.file1Draggables.deleteDraggable(trash1[1]); 
      this.file1Draggables.numDrags-=1;
    }if (trash2[0]){
      this.file2Draggables.deleteDraggable(trash2[1]); 
      this.file2Draggables.numDrags-=1;
    }if (trash3[0]){
      this.file3Draggables.deleteDraggable(trash3[1]); 
      this.file3Draggables.numDrags-=1;
    }if (trash4[0]){
      this.file4Draggables.deleteDraggable(trash4[1]); 
      this.file4Draggables.numDrags-=1;
    }if (trash5[0]){
      this.file5Draggables.deleteDraggable(trash5[1]); 
      this.file5Draggables.numDrags-=1;
    }if (trash6[0]){
      this.file6Draggables.deleteDraggable(trash6[1]); 
      this.file6Draggables.numDrags-=1;
    }
  }
  this.makeNewDraggable=function()
  {
    fill(255,255,255);
    if (button(buttonX,buttonY,this.buttonWidth,this.buttonHeight,false))//file 1 button
    {
      this.file1Draggables.createNewDraggable();
    }
    else if (button(buttonX + (this.buttonWidth + buttonGap),buttonY,this.buttonWidth,this.buttonHeight,false))//file 2 button
    {
      this.file2Draggables.createNewDraggable();
    }
    else if (button(buttonX + (this.buttonWidth + buttonGap)*2,buttonY,this.buttonWidth,this.buttonHeight,false))//file 3 button
    {
      this.file3Draggables.createNewDraggable();
    }
    else if (button(buttonX + (this.buttonWidth + buttonGap)*3,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file4Draggables.createNewDraggable();
    }
    else if (button(buttonX + (this.buttonWidth + buttonGap)*4,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file5Draggables.createNewDraggable();
    }
    else if (button(buttonX + (this.buttonWidth + buttonGap)*5,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file6Draggables.createNewDraggable();
    }
  }
  //============================================================
  this.drawText=function()
  {
    textSize(13);
    fill(255,0,0);
    stroke(1);
    strokeWeight(1);
    textAlign(CENTER);
    text("Percussion",buttonX,buttonY+12,this.buttonWidth,this.buttonHeight);
    fill(0,150,50);
    text("Drunk",buttonX + (this.buttonWidth + buttonGap),buttonY+12,this.buttonWidth,this.buttonHeight);
    fill(0,200,255);
    text("Talking Voices",buttonX + (this.buttonWidth + buttonGap)*2,buttonY+6,this.buttonWidth,this.buttonHeight);
    fill(175,175,100)
    text("Vintage",buttonX + (this.buttonWidth + buttonGap)*3,buttonY+12,this.buttonWidth,this.buttonHeight);
    fill(151,124,210);
    text("Darbouka",buttonX + (this.buttonWidth + buttonGap)*4,buttonY+12,this.buttonWidth,this.buttonHeight);
    fill(249,146,91);
    text("NASA",buttonX + (this.buttonWidth + buttonGap)*5,buttonY+12,this.buttonWidth,this.buttonHeight);
    fill(255,255,255);
    text("Size",125,565);
    text(int(this.sizeSlider),210+32,585);
    text("Speed",427,565);
    text(Math.round(this.speedSlider*100)/100,510+20,585);
  }
  this.sliders = function()
  {
    var x1 = 10;
    var x2 = width/2;
    var y1 = height-20;
    var sliderWidth = 200;
    fill(230, 230, 230);
    rect(x1,y1-8,sliderWidth+20,16, 30);
    this.sizeSlider = slider(this.sizeSlider,x1+10,y1,sliderWidth,15,200);
    fill(230, 230, 230);
    rect(x2-10,y1-8,sliderWidth+20,16, 30);
    this.speedSlider = slider(this.speedSlider,x2,y1,sliderWidth,.25,20);
  }
  
} 
class TrashBin {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
    // Draw the trash bin
    fill(255);
    stroke(0);
    rect(this.x - this.size / 2, this.y - this.size, this.size, this.size);

    // Draw the top cover
    fill(200, 200, 200);
    rect(this.x - this.size / 2, this.y - this.size - 3, this.size, this.size/3);
    fill(0);
    textSize(10);
    textAlign(CENTER);
    text("TRASH",this.x - this.size / 2, this.y - this.size +20, this.size, this.size/3);
  }
  isMouseOver() {
    // Check if the mouse is over the trash bin
    return (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size &&
      mouseY < this.y
    );
  }
}

