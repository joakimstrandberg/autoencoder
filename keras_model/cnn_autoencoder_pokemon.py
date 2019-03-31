from keras.layers import Input, Dense, Conv2D, UpSampling2D, MaxPooling2D, Flatten, Reshape
from keras.models import Model, load_model
from keras.preprocessing.image import ImageDataGenerator
import os
import numpy as np

import tensorflowjs as tfjs
import matplotlib.pyplot as plt

from PIL import Image

data_dir = "../backend/data/pokemon/"
IMG_WIDTH = 64
IMG_HEIGHT = 64
IMG_CHANNELS = 3

#Return image as np array
def get_image(path):
    im = Image.open(path)
    return im

def resize(img):
    img.thumbnail((IMG_HEIGHT,IMG_WIDTH), Image.ANTIALIAS)
    return img

file_list = os.listdir(data_dir)

img = get_image(data_dir+file_list[0])
img = resize(img)

num_obs = len(file_list)
data = np.zeros((num_obs,IMG_HEIGHT,IMG_WIDTH,IMG_CHANNELS))

for i,file in enumerate(file_list):
    img = get_image(data_dir+file)
    img = resize(img)
    img_arr = np.asarray(img)
    if(img_arr.shape[-1]!=4):
        print(img_arr.shape)
    data[i,:,:,:] = img_arr.astype(np.uint8)[:,:,:IMG_CHANNELS]

#h = data[2,:,:,:]
#test = Image.fromarray(h.astype(np.uint8), 'RGB')
#test.show()

#Build model
input_img = Input(shape=(IMG_WIDTH,IMG_HEIGHT, IMG_CHANNELS)) #128x128x4
x = Conv2D(16, (3, 3),  activation='relu', padding='same')(input_img) #64x64x16
x = MaxPooling2D((2, 2), padding='same')(x) #32x32x16
x = Conv2D(32, (3, 3), activation='relu', padding='same')(x) #16x16x32
x = MaxPooling2D((2, 2), padding='same')(x) # 8x8x32
x = Conv2D(64, (3, 3), activation='relu', padding='same')(x) #8x8x64
#x = MaxPooling2D((2, 2), padding='same')(x) # 8x8x32
#x = Conv2D(32, (3, 3), activation='relu', padding='same')(x) #8x8x64
x = MaxPooling2D((2, 2), padding='same')(x) #4x4x16
enc_shape = x._keras_shape[1:]
print(enc_shape)
x = Flatten()(x)

encoded = Dense(150, activation='relu', name="encoded")(x)

x = Dense(enc_shape[0]*enc_shape[1]*enc_shape[2])(encoded)
x = Reshape(enc_shape)(x)
#x = Conv2D(32, (3, 3), activation='relu', padding='same')(encoded)
#x = UpSampling2D((2, 2))(x)
x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
x = Conv2D(32, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
x = Conv2D(16, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
decoded = Conv2D(IMG_CHANNELS, (3, 3), activation='sigmoid', padding='same')(x)

autoencoder = Model(input_img, decoded)
encoder = Model(autoencoder.input, autoencoder.get_layer("encoded").output)

#Do recursive
print(encoder.layers[-1].output_shape)
encoded_input = Input(shape=encoder.layers[-1].output_shape[1:])
'''
d_1 = autoencoder.layers[-1]
d_2 = autoencoder.layers[-2]
d_3 = autoencoder.layers[-3]
d_4 = autoencoder.layers[-4]
d_5 = autoencoder.layers[-5]
d_6 = autoencoder.layers[-6]
d_7 = autoencoder.layers[-7]
decoder = Model(encoded_input,d_1(d_2(d_3(d_4(d_5(d_6(d_7(encoded_input))))))))
'''

autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')
autoencoder.summary()

#decoder.summary()

#train model

'''#augment data. Could augment by swapping rgb channels
new_data = np.copy(data)
new_data[:,:,:,1] = np.copy(data[:,:,:,2])
new_data[:,:,:,2] = np.copy(data[:,:,:,1])

new_data2 = np.copy(data)
new_data2[:,:,:,0] = np.copy(data[:,:,:,1])
new_data2[:,:,:,1] = np.copy(data[:,:,:,0])

new_data3 = np.copy(data)
new_data3[:,:,:,0] = np.copy(data[:,:,:,2])
new_data3[:,:,:,2] = np.copy(data[:,:,:,0])

data = np.append(data,new_data,axis=0)
data = np.append(data,new_data2,axis=0)
data = np.append(data,new_data3,axis=0)
#'''
print(data.shape)

ix = np.arange(data.shape[0])
val_len = 10
tr_ix = ix[:-val_len]
val_ix = ix[-val_len:]
data = data /255
x_train = data[tr_ix,:,:,:]
x_val = data[val_ix,:,:,:]

#Augment data by rotation, translation, flips etc
#'''
datagen = ImageDataGenerator(rotation_range=90,horizontal_flip=True)
datagen.fit(data)

# fits the model on batches with real-time data augmentation:
autoencoder.fit_generator(datagen.flow(x_train, x_train, batch_size=64),
                    steps_per_epoch=len(x_train) / 64, epochs=500,callbacks=None)
autoencoder.save("autoen.h5")
#'''

'''
autoencoder.fit(x_train, x_train,
                epochs=100,
                batch_size=32,
                shuffle=True,
                validation_data=(x_val, x_val))
autoencoder.save("autoencoder.h5")
#'''
#autoencoder = load_model("autoencoder.h5")
pred = autoencoder.predict(x_train[np.newaxis,5,:,:,:])
pred = pred.reshape(pred.shape[-3],pred.shape[-2],pred.shape[-1])
pred = pred *255
pred_img = Image.fromarray(pred.astype(np.uint8), 'RGB')
pred_img.show()
tr_arr = x_train[5,:,:,:]*255
true_img = Image.fromarray(tr_arr.astype(np.uint8), "RGB")
true_img.show()
'''
encoded = Dense(encoding_dim, activation='relu')(input_img)
# "decoded" is the lossy reconstruction of the input
decoded = Dense(784, activation='sigmoid')(encoded)

# this model maps an input to its reconstruction
autoencoder = Model(input_img, decoded)

# this model maps an input to its encoded representation
encoder = Model(input_img, encoded)

# create a placeholder for an encoded (32-dimensional) input
encoded_input = Input(shape=(encoding_dim,))
# retrieve the last layer of the autoencoder model
decoder_layer = autoencoder.layers[-1]
# create the decoder model
decoder = Model(encoded_input, decoder_layer(encoded_input))

autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')
'''