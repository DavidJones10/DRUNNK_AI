function dragAndDropObjects(menuHeight,p)
{
  this.p = p;
  this.menuHeight = menuHeight;
  this.buttonHeight = menuHeight-20;
  this.buttonWidth =  80;
  this.topBool = top;
  this.file1Draggables = new draggables(p,255,0,0);
  this.file2Draggables = new draggables(p,0,150,50);
  this.file3Draggables = new draggables(p,0,200,255);
  this.file4Draggables = new draggables(p,175,175,100);
  this.file5Draggables = new draggables(p,151,124,210);
  this.file6Draggables = new draggables(p,249,146,91);
 
  this.trash = new TrashBin(this.p,this.p.width-30, this.p.height-5, 40);
  this.sizeSlider = 15;
  this.speedSlider = 2;
  var buttonX=22,buttonY=10,buttonGap=15;
  
  
  //============================================================
  this.draw=function()
  {
    this.p.fill(5,10,50);
    this.p.rect(0,0, this.p.width, this.menuHeight,5);
    this.p.rect(0,540,this.p.width,this.menuHeight,5);
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
    uiupd(this.p);
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
    const trash1 = this.file1Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
    const trash2 = this.file2Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
    const trash3 = this.file3Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
    const trash4 = this.file4Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
    const trash5 = this.file5Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
    const trash6 = this.file6Draggables.sendTriggers(this.p.width-30, this.p.height-50,40,true);
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
    this.p.fill(255,255,255);
    if (button(this.p,buttonX,buttonY,this.buttonWidth,this.buttonHeight,false))//file 1 button
    {
      this.file1Draggables.createNewDraggable();
    }
    else if (button(this.p,buttonX + (this.buttonWidth + buttonGap),buttonY,this.buttonWidth,this.buttonHeight,false))//file 2 button
    {
      this.file2Draggables.createNewDraggable();
    }
    else if (button(this.p,buttonX + (this.buttonWidth + buttonGap)*2,buttonY,this.buttonWidth,this.buttonHeight,false))//file 3 button
    {
      this.file3Draggables.createNewDraggable();
    }
    else if (button(this.p,buttonX + (this.buttonWidth + buttonGap)*3,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file4Draggables.createNewDraggable();
    }
    else if (button(this.p,buttonX + (this.buttonWidth + buttonGap)*4,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file5Draggables.createNewDraggable();
    }
    else if (button(this.p,buttonX + (this.buttonWidth + buttonGap)*5,buttonY,this.buttonWidth,this.buttonHeight,false))//file 4 button
    {
      this.file6Draggables.createNewDraggable();
    }
  }
  //============================================================
  this.drawText=function()
  {
    this.p.textSize(13);
    this.p.fill(255,0,0);
    this.p.stroke(1);
    this.p.strokeWeight(1);
    this.p.textAlign("center");
    this.p.text("Percussion",buttonX,buttonY+12,this.buttonWidth,this.buttonHeight);
    this.p.fill(0,150,50);
    this.p.text("Drunk",buttonX + (this.buttonWidth + buttonGap),buttonY+12,this.buttonWidth,this.buttonHeight);
    this.p.fill(0,200,255);
    this.p.text("Talking Voices",buttonX + (this.buttonWidth + buttonGap)*2,buttonY+6,this.buttonWidth,this.buttonHeight);
    this.p.fill(175,175,100)
    this.p.text("Vintage",buttonX + (this.buttonWidth + buttonGap)*3,buttonY+12,this.buttonWidth,this.buttonHeight);
    this.p.fill(151,124,210);
    this.p.text("Darbouka",buttonX + (this.buttonWidth + buttonGap)*4,buttonY+12,this.buttonWidth,this.buttonHeight);
    this.p.fill(249,146,91);
    this.p.text("NASA",buttonX + (this.buttonWidth + buttonGap)*5,buttonY+12,this.buttonWidth,this.buttonHeight);
    this.p.fill(255,255,255);
    this.p.text("Size",125,565);
    this.p.text(this.p.int(this.sizeSlider),210+32,585);
    this.p.text("Speed",427,565);
    this.p.text(Math.round(this.speedSlider*100)/100,510+20,585);
  }
  this.sliders = function()
  {
    var x1 = 10;
    var x2 = this.p.width/2;
    var y1 = this.p.height-20;
    var sliderWidth = 200;
    this.p.fill(230, 230, 230);
    this.p.rect(x1,y1-8,sliderWidth+20,16, 30);
    this.sizeSlider = slider(this.p,this.sizeSlider,x1+10,y1,sliderWidth,15,200);
    this.p.fill(230, 230, 230);
    this.p.rect(x2-10,y1-8,sliderWidth+20,16, 30);
    this.speedSlider = slider(this.p,this.speedSlider,x2,y1,sliderWidth,.25,20);
  }
  
} 
class TrashBin {
  constructor(p, x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.p = p;
  }

  display() {
    // Draw the trash bin
    this.p.fill(255);
    this.p.stroke(0);
    this.p.rect(this.x - this.size / 2, this.y - this.size, this.size, this.size);

    // Draw the top cover
    this.p.fill(200, 200, 200);
    this.p.rect(this.x - this.size / 2, this.y - this.size - 3, this.size, this.size/3);
    this.p.fill(0);
    this.p.textSize(10);
    this.p.textAlign("center");
    this.p.text("TRASH",this.x - this.size / 2, this.y - this.size +20, this.size, this.size/3);
  }
  isMouseOver() {
    // Check if the mouse is over the trash bin
    return (
      this.p.mouseX > this.x - this.size / 2 &&
      this.p.mouseX < this.x + this.size / 2 &&
      this.p.mouseY > this.y - this.size &&
      this.p.mouseY < this.y
    );
  }
}

