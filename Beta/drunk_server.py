import asyncio
import websockets
import torch
import librosa as li
import json
import numpy as np
import time


# Disable gradient computation for inference
torch.set_grad_enabled(False)

# Load models outside of the prediction function
modelPathPerc = '/users/slykiddruthless/Desktop/Models/percussion.ts'
modelPathMine = '/users/slykiddruthless/Desktop/Models/drunkAI_efb93f6f83_streaming.ts'
modelPathVintage = '/users/slykiddruthless/Desktop/Models/vintage.ts'
modelPathVCTK = '/users/slykiddruthless/Desktop/Models/VCTK.ts'
modelPathDarb = '/users/slykiddruthless/Desktop/Models/darbouka_onnx.ts'
modelPathNasa = '/users/slykiddruthless/Desktop/Models/nasa.ts'
percModel = torch.jit.load(modelPathPerc).eval()
myModel = torch.jit.load(modelPathMine).eval()
vintageModel = torch.jit.load(modelPathVintage).eval()
VCTKModel = torch.jit.load(modelPathVCTK).eval()
darboukaModel = torch.jit.load(modelPathDarb).eval()
nasaModel = torch.jit.load(modelPathNasa).eval()

models = {
    "perc": percModel,
    "drunk": myModel,
    "vctk": VCTKModel,
    "vintage": vintageModel,
    "darbouka": darboukaModel,
    "nasa": nasaModel
}

async def run_prediction(websocket):
    async for message in websocket:
        #print(message)
        start_time = time.time()
        data = json.loads(message)
        data_dict = data["audio"]
        sample_rate = data["sampleRate"]
        #print(len(data_dict))
        if len(data_dict) == 2:
            audio_data_0 = list(data_dict[0].values())
            audio_data_0 = np.array(audio_data_0, dtype=np.float32)
            audio_data_1 = list(data_dict[1].values())
            audio_data_1 = np.array(audio_data_1, dtype=np.float32)
            combined_data = np.array([audio_data_0, audio_data_1])
            x = combined_data
            #print(audio_data_0.shape)
        else:
            #print(data_dict.values())
            audio_data_0 = np.array(list(data_dict.values()), dtype=np.float32)
            x = audio_data_0
        x = li.resample(x, orig_sr=sample_rate, target_sr=44100)
        predictions = {}
        for model_name, model in models.items():
            if len(x.shape) > 1 and x.shape[0] > 1:
                x = li.to_mono(x)

            prediction = predict_from_file(model, x)
            predictions[model_name] = prediction.tolist()
            #print(predictions)
        await websocket.send(json.dumps(predictions))
        end_time = time.time()
        print("Runtime: " + str(end_time-start_time) + " seconds")
        #print(predictions)

def predict_from_file(model, audioArray):
    x = torch.from_numpy(audioArray).reshape(1,1,-1)
    z = model.encode(x)
    z[:, 0] += torch.linspace(-2, 2, z.shape[-1])
    y = model.decode(z).numpy().reshape(-1)
    return y

# Create WebSocket server for both models
start_server = websockets.serve(lambda websocket, path: run_prediction(websocket),
                                "localhost", 8767, max_size=None)# max size of 5 seconds

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
