## Milestone status: 

#### In our initial goal for the beta, we wanted to have built a simple website in which you can load in a wav file and 3-8 re-sampled versions are generated and are playable, exportable, and have some sort of interactive component to mix between the signals. So far we have implemented every one of these goals except the ability to export your sessions. For the games, however, we feel like we have not yet achieved the level of interactivity that we imagined. And for the models, we ended up using RAVE to train our model and utilized the 5 pretrained models that IRCAM has made available. I also think we would have like to have had all of the sketches on one page by now, but we ran into some issues that required some research that was not complete until after it would have been viable to implement. 

## Surprises and challenges: 

#### The largest challenge that we faced was in the integration of the models and the p5 sketches. This was the area in which we had to learn the most, and as such, it took a considerable amount of time. Writing the server and hooking everything up through websockets was surprisingly easy, but getting all of the audio files through both ways proved a little tricky, mostly due to some of the specific types from Tone.js, which required a good bit of reading through their documentation. We also ran into some trouble trying to figure out how we could effectively port all of the sketches into one large sketch and formatting them in a sort of arcade. The main issue was trying to find a way to scale everything according to the canvas size, which we actually just found the solution recently, but we were unable to implement it in the beta. 

## Design and concept changes: 

#### We think our deliverables will likely stay the same. We believe, however, that our main goal from now on should be to develop a more tangible interaction with the audio produced by the models. We feel as though our current games do not do enough with the files for the user to truly appreciate the differences between them and actually use them for timbral exploration. 

## Technical changes:

#### We feel as though the tools that we chose from the beginning (aside from not using RAVE) have been effective and simple enough that we do not need to make any changes. In hindsight, it might have been easier to use a framework like phaser, as it would have handled a lot of time consuming challenges that we faced along the way. 

## Remaining Work:

#### By the final version, for us to feel happy with our work, we will need to have fully incorporated all of the games onto one site that is accessible throught the web somehow (likely through github pages). We also need make it possible for users to export theirh sessions. As a stretch goal, we would like to have developed one or a few more games that lean into the interactivity more given the context of the models we are using and the outputs that they produce. David will be working on incorporating all of the games onto one site, Joe will be in charge of the look and feel of the website, and carson will work on developing interesting interactions in the currnent games and potentially new games. 

## Collaboration: 

#### For this portion of the project, there was a bit of a discrepency in the workload, mostly due to differing experience levels in programming. Beyond that, everything with the group has been smooth and operational. 
