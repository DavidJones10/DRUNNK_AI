function dragAndDropObjects(menuHeight)
{
  this.menuHeight = menuHeight;
  this.topBool = top;
  this.file1Draggables = new draggables(5,255,0,0);
  this.file2Draggables = new draggables(5,0,150,50);
  this.file3Draggables = new draggables(5,0,200,255);
  this.file4Draggables = new draggables(5,175,175,100);
  this.sizeSlider = createSlider(15,200,15);
  this.speedSlider = createSlider(2,30,10);
  this.sizeSlider.position(50,615);
  this.sizeSlider.style('width', '150px');
  this.speedSlider.position(350,615);
  this.speedSlider.style('width', '150px');
  
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
    //console.log(this.getCollision2(posX, posY, squareSize));
    this.drawText();
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
  //============================================================
  this.makeNewDraggable=function()
  {
    fill(255,255,255);
    if (button(25,10,100,40,false))//file 1 button
    {
      this.file1Draggables.createNewDraggable();
    }
    else if (button(175,10,100,40,false))//file 2 button
    {
      this.file2Draggables.createNewDraggable();
    }
    else if (button(325,10,100,40,false))//file 3 button
    {
      this.file3Draggables.createNewDraggable();
    }
    else if (button(475,10,100,40,false))//file 4 button
    {
      this.file4Draggables.createNewDraggable();
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
    text("File 1 Triggers",25,23,100,40);
    fill(0,150,50);
    text("File 2 Triggers",175,23,100,40);
    fill(0,200,255);
    text("File 3 Triggers",325,23,100,40);
    fill(175,175,100)
    text("File 4 Triggers",475,23,100,40);
    fill(255,255,255);
    text("Size",125,565);
    text(this.sizeSlider.value(),210,578);
    text("Speed",427,565);
    text(this.speedSlider.value(),510,578);
  }
  
} 

