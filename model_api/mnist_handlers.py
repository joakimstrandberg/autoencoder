from keras.datasets import mnist
import numpy as np
from handlers import sort_pc, calc_max, calc_min 

'''
Method for sorting principal components of the data in the encoded feature space.

Args:
    encoder: Keras model that encodes image data to feature space.

Returns:
    Ordered list of indices for 
'''

def fetch_rnd_digit(data):
    #data = np.load("./data/mnist_data.npy")
    print(data.shape)
    ix = np.random.choice(data.shape[0], 1)
    digit = data[ix,:]
    return digit.tolist()

# === Methods for creating mnist numpy file
<<<<<<< HEAD
def load_data(num=None):
    (x_train, _), (x_test, _) = mnist.load_data()
    x_train = x_train.reshape((len(x_train), np.prod(x_train.shape[1:])))
    x_train = x_train/255
    if num != None:
        x_train = x_train[:num,:]
    print(x_train.shape)
=======
def load_data():
    (x_train, _), (x_test, _) = mnist.load_data()
    x_train = x_train.reshape((len(x_train), np.prod(x_train.shape[1:])))
    x_train = x_train/255
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4
    return x_train

def save_data(data, path):
    #(x_train, _), (x_test, _) = mnist.load_data()
    np.save(path,data)

if __name__ == "__main__":
<<<<<<< HEAD
    data = load_data(200)
    save_data(data,"./data/mnist/mnist_data")
=======
    data = load_data()
    save_data(data,"./data/mnist_data")
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4
