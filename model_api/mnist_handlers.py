from keras.datasets import mnist
import numpy as np

'''
Method for sorting principal components of the data in the encoded feature space.

Args:
    encoder: Keras model that encodes image data to feature space.

Returns:
    Ordered list of indices for 
'''
def sort_pc(encoder,data):
    encoded = encoder.predict(data)
    variance = np.var(encoded, axis=0)
    sorted_ix = np.argsort(variance)[::-1]
    return sorted_ix

def fetch_rnd_digit():
    data = np.load("./data/mnist_train.npy")
    print(data.shape)
    ix = np.random.choice(data.shape[0], 3)
    digit = data[ix,:]
    return digit.tolist()

def load_data():
    (x_train, _), (x_test, _) = mnist.load_data()
    x_train = x_train.reshape((len(x_train), np.prod(x_train.shape[1:])))
    x_train = x_train/255
    return x_train

def save_data(data, path):
    #(x_train, _), (x_test, _) = mnist.load_data()
    np.save(path,data)

if __name__ == "__main__":
    data = load_data()
    save_data(data,"./data/mnist_train")