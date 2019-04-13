from handlers import calc_max, calc_min
from keras.models import load_model
import pickle
import numpy as np

mnist_encoder = load_model("../keras_model/mnist_encoder.h5")
mnist_encoder.summary()
mnist_data = np.load("./data/mnist_data.npy")

encoded_data = mnist_encoder.predict(mnist_data)
num_steps = 50

max_a = calc_max(encoded_data)
max_arr = np.round(max_a,2)

min_arr= np.zeros(max_arr.shape[0])
step_list = np.round((max_arr- min_arr)/num_steps,2)

variance = np.var(encoded_data, axis=0)
mnist_order = np.argsort(variance)[::-1]

#Make sure max, min and step are matched with correct principal component
max_arr = max_arr[mnist_order]
min_arr = min_arr[mnist_order]
step_list = step_list[mnist_order]

#Pickle as list
pickle.dump(mnist_order.tolist(),open("./constants/mnist_order",'wb'))
pickle.dump(max_arr.tolist(),open("./constants/mnist_max",'wb'))
pickle.dump(min_arr.tolist(),open("./constants/mnist_min",'wb'))
pickle.dump(step_list.tolist(),open("./constants/mnist_steps",'wb'))
