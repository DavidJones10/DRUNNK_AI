class draggables
{
  constructor(p,r,g,b)
  {
    this.maxDraggables = 30;
    this.r = r;
    this.g = g;
    this.b = b;
    this.drags = [];
    this.rects = [];
    this.numDrags = 0;
    this.initPos = { x: p.width/2, y: p.height/2 };
    this.p = p;
  }
  createNewDraggable()
  {
    //console.log("Creating a new draggable");
    if (this.numDrags <= this.maxDraggables)
    {
      const newX = this.p.width/2;
      const newY = this.p.height/2;
      this.drags.push({ x: newX, y: newY });
      this.rects.push(new arrayableRect(this.p,newX, newY, 50, 50));
      this.numDrags += 1;
    }
  }
  deleteDraggable(index)
  {
    this.drags.splice(index,1);
    this.rects.splice(index,1);
  }
  draw()
  {
    if (this.numDrags > 0)
    {
      for (let i=0; i<this.numDrags; i++)
      {
        if (this.drags[i])
        {
          this.drags[i] = draggable(this.p,this.drags[i],50,50);
          let dragX = this.drags[i].x;
          let dragY = this.drags[i].y;
          this.rects[i].setPos(dragX, dragY);
          this.p.fill(this.r, this.g,this.b);
          this.rects[i].draw();
        }
      }
    }
  }
  sendTriggers(playerX, playerY, size,returnIndex=false)
  {
    let collisionDetected = false;
    if (this.numDrags > 0)
    {
      for (let i=0; i < this.numDrags; i++)
      {
        var dragX = this.drags[i].x;
        var dragY = this.drags[i].y;
        if (playerX+size>dragX && playerX<dragX+50 && playerY+size>dragY && playerY<dragY+50)
        {
          collisionDetected = true;
          if (returnIndex)
          {
            const result = [collisionDetected, i];
            return result;
          }
        }
      }
    }
    return collisionDetected;
  }
  
}
class arrayableRect
{
  constructor(p, x, y, Width, Height)
  {
    this.x = x;
    this.y = y;
    this.Width = Width;
    this.Height = Height;
    this.p = p;
  }
  setPos(x, y)
  {
    this.x = x;
    this.y = y;
  }
  draw()
  {
    this.p.rect(this.x, this.y, this.Width, this.Height);
  }
}