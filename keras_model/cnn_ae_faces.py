from keras.layers import Input, Dense, Conv2D, UpSampling2D, MaxPooling2D, Flatten, Reshape,Conv2DTranspose
from keras.models import Model, load_model
from keras.preprocessing.image import ImageDataGenerator
import os
import sys
import numpy as np

import tensorflowjs as tfjs
import matplotlib.pyplot as plt

from PIL import Image

from zipfile import ZipFile
# ========== CONFIG VARS ==============
archive_path = "celeba-dataset/img_align_celeba.zip"
IMG_WIDTH = 64 #int(178/2)
IMG_HEIGHT = 64 #int(218/2)
IMG_CHANNELS = 3
ENCODED_DIM = 100

#Resize img to desired size. Not same ratio!!!
def resize(img,w,h):
    img = img.resize((w,h), Image.ANTIALIAS)
    return img

#Method for fetching data from zipfile and return as np array. index 0 is folder!!!!
def fetch_batch(path,w,h,c, start,end):
    with ZipFile(path, 'r') as archive:
        #make sure end is in index range
        end = min(end,len(archive.namelist())-1)
        data = np.zeros((end-start,h,w,c))
        for i,entry in enumerate(archive.infolist()[start:end]):
            with archive.open(entry) as file:
                img = Image.open(file)
                img = resize(img,w,h)
                img_arr = np.asarray(img)
                data[i,:,:,:] = img_arr.astype(np.uint8)[:,:,:]
    return data

#===================== Build model =================================
input_img = Input(shape=(IMG_HEIGHT,IMG_WIDTH, IMG_CHANNELS)) 
x = Conv2D(16, (3, 3),  activation='relu', padding='same')(input_img) 
x = MaxPooling2D((2, 2), padding='same')(x) 
x = Conv2D(32, (3, 3), activation='relu', padding='same')(x)
x = MaxPooling2D((2, 2), padding='same')(x) 
x = Conv2D(64, (3, 3), activation='relu',strides=(2,2), padding='same')(x) 
x = MaxPooling2D((2, 2), padding='same')(x) 
#x = Conv2D(64, (3, 3), activation='relu', padding='same')(x) 
#x = MaxPooling2D((2, 2), padding='same')(x) 
enc_shape = x._keras_shape[1:]
print(enc_shape)
x = Flatten()(x)

encoded = Dense(ENCODED_DIM, activation='relu', name="encoded")(x)

x = Dense(enc_shape[0]*enc_shape[1]*enc_shape[2])(encoded)
x = Reshape(enc_shape)(x)

x = Conv2DTranspose(64,(3,3),activation="relu",strides=(2,2),padding="same")(x)
x = Conv2DTranspose(64,(3,3),activation="relu",strides=(2,2),padding="same")(x)
x = Conv2DTranspose(32,(3,3),activation="relu",strides=(2,2),padding="same")(x)
x = Conv2DTranspose(16,(3,3),activation="relu",strides=(2,2),padding="same")(x)

'''
#x = Conv2D(32, (3, 3), activation='relu', padding='same')(encoded)
#x = UpSampling2D((2, 2))(x)
x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
x = Conv2D(32, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
x = Conv2D(16, (3, 3), activation='relu', padding='same')(x)
x = UpSampling2D((2, 2))(x)
'''
decoded = Conv2D(IMG_CHANNELS, (3, 3), activation='sigmoid', padding='same')(x)

autoencoder = Model(input_img, decoded)
autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')
autoencoder.summary()

#Encoder
encoder = Model(autoencoder.input, autoencoder.get_layer("encoded").output)

#Decoder
#input_decoder = Input(shape=encoder.layers[-1].output_shape[1:])
decoder_input = Input(shape=(ENCODED_DIM,))
d = decoder_input
print([a.name for a in autoencoder.layers[-7:]])
for i in reversed(range(7)):
    print(autoencoder.layers[-i-1].name)
    d = autoencoder.layers[-i-1](d)
decoder = Model(inputs=decoder_input,outputs=d)
decoder.summary()
#========================== train model ============================
data = fetch_batch(archive_path,IMG_WIDTH,IMG_HEIGHT,IMG_CHANNELS, 1,200)
print(data.shape)

ix = np.arange(data.shape[0])
val_len = 10
tr_ix = ix[:-val_len]
val_ix = ix[-val_len:]
data = data /255
x_train = data[tr_ix,:,:,:]
x_val = data[val_ix,:,:,:]
#'''
autoencoder.fit(x_train, x_train,
                epochs=500,
                batch_size=32,
                shuffle=True,
                validation_data=(x_val, x_val))
autoencoder.save("ae_faces.h5")
encoder.save("encoder_faces.h5")
decoder.save("decoder_faces.h5")
#'''
#train loop since large dataset


#Show prediction
#autoencoder = load_model("autoencoder.h5")
pred = autoencoder.predict(x_train[np.newaxis,5,:,:,:])
pred = pred.reshape(pred.shape[-3],pred.shape[-2],pred.shape[-1])
pred = pred *255
pred_img = Image.fromarray(pred.astype(np.uint8), 'RGB')
pred_img.show()
tr_arr = x_train[5,:,:,:]*255
true_img = Image.fromarray(tr_arr.astype(np.uint8), "RGB")
true_img.show()

