import numpy as np
import tensorflow as tf
import tensorflow_datasets as tfds
import librosa
import pickle
import os


class Saver:
    """saver is responsible to save features, and the min max values."""

    def __init__(self, save_dir):
        self.save_dir = save_dir

    def save_feature(self, feature, file_path):
        save_path = self._generate_save_path(file_path)
        np.save(save_path, feature)
        return save_path

    def save_min_max_values(self, min_max_values, file_path):
        save_path = self._generate_save_path(file_path)
        np.save(save_path, min_max_values)

    @staticmethod
    def _save(data, save_path):
        with open(save_path, "wb") as f:
            pickle.dump(data, f)

    def _generate_save_path(self, file_path):
        file_name = os.path.split(file_path)[1]
        save_path = os.path.join(self.save_dir, file_name + ".npy")
        return save_path
def normalize(array, min, max):

    norm_array = (array - array.min()) / (array.max() - array.min())
    norm_array = norm_array * (max - min) + min
    return norm_array

def denormalize(norm_array, source_min, source_max, new_min, new_max):
    scale_factor = (new_max - new_min) / (source_max - source_min)
    shift_factor = new_min - source_min * scale_factor

    # Scale the input signal to the target range
    denormalized_signal = (norm_array * scale_factor) + shift_factor
    return denormalized_signal

def load_dataset():
    data = tfds.load("nsynth", split='train[50%:]', shuffle_files=True, try_gcs=True)
    return data

def prepare_dataset(data):
  numberOfClips = 2000  #number of audio files to use in training
  smallerData = data.take(numberOfClips)
  # get audio arrays
  stfts = []
  max_val = 0
  min_val = 0
  for i in smallerData:
    audio = i['audio'].numpy()
    audio = np.pad(audio,500) #was 512
    stft = np.abs(librosa.stft(audio, n_fft=510))  # had [:-1] and no n_fft

    st_max = np.amax(stft)  #get max in stft
    st_min = np.amin(stft)  #get min in stft
    if st_max > max_val:
      max_val = st_max    #check if lowest or highest value so far
    if st_min < min_val:
      min_val = st_min
    print(stft.shape)
    stft = normalize(stft, 0, 1)
    stfts.append(stft)
  stfts = np.array(stfts,dtype=np.float32)
  min_max_values = np.array([min_val,max_val])
  return stfts[..., np.newaxis], min_max_values

if __name__ == '__main__':

    SAVE_DIR = '/users/davidjones/Desktop/Datasets/'
    data = load_dataset()
    stfts, min_max = prepare_dataset(data)
    saved = Saver(SAVE_DIR)
    saved.save_feature(stfts, 'STFTs')
    saved.save_min_max_values(min_max, 'MIN_MAX')