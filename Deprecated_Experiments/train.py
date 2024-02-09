# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.

import tensorflow as tf
import numpy as np
from Model.Autoencoder import VAE
from tensorflow.python.framework.ops import disable_eager_execution
def train(train_data, learning_rate, batch_size, epochs, vector_dim):
    disable_eager_execution()
    autoEncoder = VAE(input_shape=(256, 512, 1),
                        conv_filters=(512, 256, 128, 64, 32),
                        conv_kernels=(3, 3, 3, 3),
                        conv_strides=(2, 2, 2, 2, (2, 1)),
                        latent_space_dim=vector_dim)
    autoEncoder.summary()
    autoEncoder.compile(learning_rate)
    autoEncoder.train(train_data, batch_size, epochs)
    return autoEncoder

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    LEARNING_RATE = 0.0005
    EPOCHS = 60
    BATCH_SIZE = 32
    LATENT_DIM = 128
    data = np.load('/users/davidjones/Desktop/Datasets/STFTs.npy')
    trained = train(data,LEARNING_RATE,BATCH_SIZE,EPOCHS,LATENT_DIM)
    trained.save('users/davidjones/Desktop/Datasets')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
