from keras.layers import Input, Dense, Conv2D, UpSampling2D, MaxPooling2D, Flatten, Reshape,Conv2DTranspose
from keras.models import Model, load_model
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import EarlyStopping, ModelCheckpoint

import os
import sys
import numpy as np

from PIL import Image
from zipfile import ZipFile

from build_models import build_cnn_ae, build_encoder_decoder

# ========== CONFIG VARIABLES ==============
archive_path = "celeba-dataset/img_align_celeba.zip"
IMG_WIDTH = 64 #int(178/2)
IMG_HEIGHT = 64 #int(218/2)
IMG_CHANNELS = 3
ENCODED_DIM = 200
BATCH_SIZE = 400
EPOCHS = 5
NUM_OBSERVATIONS = 20000

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
        for i,entry in enumerate(archive.infolist()[1+start:end+1]):
            with archive.open(entry) as file:
                img = Image.open(file)
                img = resize(img,w,h)
                img_arr = np.asarray(img)
                data[i,:,:,:] = img_arr.astype(np.uint8)[:,:,:]
    return data

#========================== Build models ==============================
#autoencoder = build_cnn_ae((IMG_HEIGHT,IMG_WIDTH,IMG_CHANNELS),ENCODED_DIM)
#========================== Train model ===============================

'''#Not suitable since large dataset
ix = np.arange(data.shape[0])
val_len = 10
tr_ix = ix[:-val_len]
val_ix = ix[-val_len:]
data = data /255
x_train = data[tr_ix,:,:,:]
x_val = data[val_ix,:,:,:]
mc = ModelCheckpoint('best_ae.h5', monitor='val_loss', mode='min', save_best_only=True)
es = EarlyStopping(monitor='val_loss')
autoencoder.fit(x_train, x_train,
                epochs=500,
                batch_size=32,
                shuffle=True,
                validation_data=(x_val, x_val),
                callbacks=[es,mc])
autoencoder.save("ae_faces.h5")
encoder.save("encoder_faces.h5")
decoder.save("decoder_faces.h5")
#'''
#train on batch loop since large dataset
NUM_VAL_DATA = 50
val_data = fetch_batch(archive_path,IMG_WIDTH,IMG_HEIGHT,IMG_CHANNELS, 1,1+NUM_VAL_DATA)
val_data = val_data/255
best_loss = np.inf
#early stop on batches or epochs?
early_stop = 4
k = 0
'''
for e in range(EPOCHS):
    print("Epoch {}".format(e))
    for i in range(NUM_OBSERVATIONS // BATCH_SIZE):
        data = fetch_batch(archive_path,IMG_WIDTH,IMG_HEIGHT,IMG_CHANNELS, i*BATCH_SIZE,(i+1)*BATCH_SIZE)
        data = data/255
        data = data.astype(np.float32)
        autoencoder.train_on_batch(data,data)
        val_loss = autoencoder.test_on_batch(val_data,val_data)
        print("Batch {}/{}. loss: {} val_loss: {}".format(i,NUM_OBSERVATIONS // BATCH_SIZE ,autoencoder.evaluate(data,data) ,val_loss))
    if val_loss < best_loss:
        print("{} is better than previous. Saving model...".format(val_loss))
        autoencoder.save("ae_faces.h5")
        k = 0
    if k > early_stop:
        break
    k += 1

#'''
import keras
import tensorflowjs as tfjs
#'''
#Load models and convert them into tfjs models. Must be done one at a time since layers mismatch with werights in same session!!!
build_path = "../model_api/models/faces/light_model/"
keras.backend.clear_session()
autoencoder = load_model("finished_ae_v6.h5")
tfjs.converters.save_keras_model(autoencoder, build_path+"autoencoder/")

keras.backend.clear_session()
encoder = load_model("finished_e_v6.h5")
tfjs.converters.save_keras_model(encoder, build_path+"encoder/")

keras.backend.clear_session()
decoder = load_model("finished_d_v6.h5")
tfjs.converters.save_keras_model(decoder, build_path+"decoder/")
#'''

'''
keras.backend.clear_session()
autoencoder = load_model("finished_ae_v5.h5")
encoder, decoder = build_encoder_decoder(autoencoder)
#'''

#Show prediction
#'''
img_ix = 11
pred = autoencoder.predict(val_data[np.newaxis,img_ix,:,:,:])
pred = pred.reshape(pred.shape[-3],pred.shape[-2],pred.shape[-1])
pred = pred *255
pred_img = Image.fromarray(pred.astype(np.uint8), 'RGB')
pred_img.show()
tr_arr = val_data[img_ix,:,:,:]*255
true_img = Image.fromarray(tr_arr.astype(np.uint8), "RGB")
true_img.show()
#'''
img_ix = 11
latent = encoder.predict(val_data[np.newaxis,img_ix,:,:,:])
print(latent)
pred = decoder.predict(latent)
pred = pred.reshape(pred.shape[-3],pred.shape[-2],pred.shape[-1])
pred = pred *255
pred_img = Image.fromarray(pred.astype(np.uint8), 'RGB')
pred_img.show()
tr_arr = val_data[img_ix,:,:,:]*255
true_img = Image.fromarray(tr_arr.astype(np.uint8), "RGB")
true_img.show()