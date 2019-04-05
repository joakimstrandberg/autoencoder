from keras.layers import Input, Dense, Conv2D, UpSampling2D, MaxPooling2D, Flatten, Reshape,Conv2DTranspose
from keras.models import Model, load_model
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import EarlyStopping, ModelCheckpoint

import os
import sys
import numpy as np

import tensorflowjs as tfjs

def build_cnn_ae(input_shape, encoded_dim):
    input_img = Input(shape=input_shape) 
    x = Conv2D(64, (3, 3),  activation='relu', padding='same')(input_img) 
    x = MaxPooling2D((2, 2), padding='same')(x) 
    x = Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = MaxPooling2D((2, 2), padding='same')(x) 
    x = Conv2D(256, (3, 3), activation='relu', padding='same')(x) 
    x = MaxPooling2D((2, 2), padding='same')(x) 

    enc_shape = x._keras_shape[1:]
    x = Flatten()(x)
    #x = Dense(1024,activation='relu')(x)
    encoded = Dense(encoded_dim, activation='relu', name="encoded")(x)
    #x = Dense(1024,activation='relu')(encoded) 
    x = Dense(enc_shape[0]*enc_shape[1]*enc_shape[2])(encoded)
    x = Reshape(enc_shape)(x)

    x = Conv2DTranspose(256,(3,3),activation="relu",strides=(2,2),padding="same")(x)
    x = Conv2DTranspose(128,(3,3),activation="relu",strides=(2,2),padding="same")(x)
    x = Conv2DTranspose(64,(3,3),activation="relu",strides=(2,2),padding="same")(x)
    decoded = Conv2DTranspose(input_shape[2], (3, 3), activation='sigmoid', padding='same')(x)

    autoencoder = Model(input_img, decoded)
    autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')
    autoencoder.summary()
    return autoencoder

def build_encoder_decoder(autoencoder):
    #Encoder
    encoder = Model(autoencoder.input, autoencoder.get_layer("encoded").output)

    #Decoder
    decoder_input = Input(shape=autoencoder.get_layer("encoded").output_shape[1:])
    d = decoder_input
    ae_layers = [a.name for a in autoencoder.layers]
    ae_layers = ae_layers[ae_layers.index("encoded")+1:]
    for layer in ae_layers:
        print(layer)
        d = autoencoder.get_layer(layer)(d)
    decoder = Model(inputs=decoder_input,outputs=d)
    decoder.summary()
    encoder.summary()
    return (encoder,decoder)

def build_tfjs_models(build_path,ae,en,de):
    #"./models/faces/autoencodbuild_pather"
    tfjs.converters.save_keras_model(ae, build_path+"autoencoder/")
    tfjs.converters.save_keras_model(de, build_path+"decoder/")
    tfjs.converters.save_keras_model(en, build_path+"encoder/")