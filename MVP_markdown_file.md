## Milestone status: 

#### While the multiple games and interactive elements were more of a stretch goal, due to the labor division and skill sets, we were able/required to start on those earlier. For the model, we experimented with a variety of model structures, none of which yielded what we would consider useful results. This stage is definitely not complete and will require much more research and quite possibly might be superimposed by using someone else’s model. 

## Surprises and challenges: 

#### The P5.js audio library has been a little hard to work with. We have been attempting to change meaningful parameters in the audio within the games, but it has been slightly difficult. The training and compiling of the different models is obviously a lengthy process, but it is also a computationally intensive process. In our research, it seems to be that most of the model structures used in high quality audio to audio models are very large and thus require more RAM than is available to us on our machines or on those available through google colab pro. We have trained a variety of models over 30 times and each time it seems as though the accuracy is limited by our model complexity. 

## Design and concept changes: 

#### Within the games we are trying to come up with ways that they can lean into the AI aspect. For the website, this vision has mostly stayed the same. For the model, however, due to the poor performance of our own models we may end up using an existing model in our final deliverables. 

## Technical changes:

#### For the model, we came to the realization that the NSynth dataset would not be the best fit for us as the sample rate for all of the audio clips in the set is only 16kHz. Instead, we created a subset of the Philharmonia dataset. It’s also possible that we may scrap our own model structures and training and move to an existing model. The training has been laborious and has yielded unusable results so far. We have been looking into an api called “audio-diffusion-pytorch” that has some model structures that seem to fit our desired aural outcomes. 

## Collaboration: 

#### Everyone in the group took on their tasks and performed them as expected. We all contributed as much as we had anticipated for this phase and are continuing to build on our respective tasks. 
