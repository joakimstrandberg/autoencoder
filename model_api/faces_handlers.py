from keras.datasets import mnist
import numpy as np

import os
import sys
import numpy as np

from PIL import Image
from zipfile import ZipFile

from os import listdir
from os.path import isfile, join

import random

#CONFIG
ARCHIVE_PATH = "../keras_model/celeba-dataset/img_align_celeba.zip"
IMG_PATH = "./data/faces/"
NUM_OBSERVATIONS = 15000
IMG_WIDTH = 64 #int(178/2)
IMG_HEIGHT = 64 #int(218/2)
IMG_CHANNELS = 3

#Resize img to desired size. Not same ratio!!!
def resize(img,w,h):
    img = img.resize((w,h), Image.ANTIALIAS)
    return img

#Method for fetching data from zipfile and return as np array. index 0 is folder!!!!
def fetch_batch(path,w,h,c,start,end):
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
    return data/255
'''
def fetch_rnd_img():
    ix = np.random.choice(NUM_OBSERVATIONS, 1)[0]
    data = fetch_batch(ARCHIVE_PATH,IMG_WIDTH,IMG_HEIGHT,IMG_CHANNELS,ix,ix+1)
    print(data.shape)
    return data.tolist()
#'''

#'''
def fetch_rnd_img():
    imgs = [f for f in listdir(IMG_PATH) if isfile(join(IMG_PATH, f))]
    rnd_img = random.choice(imgs)
    img = Image.open(IMG_PATH + str(rnd_img))
    img_arr = np.asarray(img)
    img_arr = img_arr/255
    print(img_arr.shape)
    return [img_arr.tolist()]
#'''
'''
Arguments:
    shape: Tuple with shape the saved image will have. Should be (width, height, channels)
'''
def save_images(start,end,save_path,zip_path,shape=None):
    with ZipFile(zip_path, 'r') as archive:
        #make sure end is in index range
        end = min(end,len(archive.namelist())-1)
        for i,entry in enumerate(archive.infolist()[1+start:end+1]):
            with archive.open(entry) as file:
                img = Image.open(file)
                if shape != None:
                    img = resize(img,shape[0],shape[1])
                    img.save("{}img_{}.png".format(save_path,i))
  
                
