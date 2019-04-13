
from handlers import calc_max, calc_min
from keras.models import load_model
import pickle
import numpy as np

from faces_handlers import fetch_batch
ARCHIVE_PATH = "celeba-dataset/img_align_celeba.zip"

faces_encoder = load_model("../keras_model/mnist_encoder.h5")
faces_encoder.summary()
faces_data = fetch_batch(ARCHIVE_PATH,64,64,3,0,15000)
print(faces_data.shape)
encoded_data = faces_encoder.predict(faces_data)
num_steps = 50

max_a = calc_max(encoded_data)
max_arr = np.round(max_a,2)
min_arr= np.zeros(max_arr.shape[0])
step_list = np.round((max_arr- min_arr)/num_steps,2)

print(max_arr)
#Pickle as list
pickle.dump(max_arr.tolist(),open("./constants/faces_max",'wb'))
pickle.dump(min_arr.tolist(),open("./constants/faces_min",'wb'))
pickle.dump(step_list.tolist(),open("./constants/faces_steps",'wb'))