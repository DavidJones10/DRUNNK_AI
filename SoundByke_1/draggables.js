class draggables
{
  constructor(maxNum,r,g,b)
  {
    this.maxDraggables = 30;
    this.r = r;
    this.g = g;
    this.b = b;
    this.drags = [];
    this.rects = [];
    this.numDrags = 0;
    this.initPos = { x: width/2, y: height/2 };
  }
  createNewDraggable()
  {
    console.log("Creating a new draggable");
    if (this.numDrags <= this.maxDraggables)
    {
      const newX = width/2;
      const newY = height/2;
      this.drags.push({ x: newX, y: newY });
      this.rects.push(new arrayableRect(newX, newY, 50, 50));
      this.numDrags += 1;
    }
  }
  draw()
  {
    if (this.numDrags > 0)
    {
      for (let i=0; i<this.numDrags; i++)
      {
        if (this.drags[i])
        {
          this.drags[i] = draggable(this.drags[i],50,50);
          let dragX = this.drags[i].x;
          let dragY = this.drags[i].y;
          this.rects[i].setPos(dragX, dragY);
          fill(this.r, this.g,this.b);
          this.rects[i].draw();
        }
      }
    }
  }
  sendTriggers(playerX, playerY, size)
  {
    let collisionDetected = false;
    if (this.numDrags > 0)
    {
      for (let i=0; i < this.numDrags; i++)
    {
      var dragX = this.drags[i].x;
      var dragY = this.drags[i].y;
      if (playerX+size>dragX && playerX<dragX+50 && playerY+size>dragY && playerY<dragY+50)
        collisionDetected = true;
    }
    }
    return collisionDetected;
  }
  
}
class arrayableRect
{
  constructor(x, y, Width, Height)
  {
    this.x = x;
    this.y = y;
    this.Width = Width;
    this.Height = Height;
  }
  setPos(x, y)
  {
    this.x = x;
    this.y = y;
  }
  draw()
  {
    rect(this.x, this.y, this.Width, this.Height);
  }
}