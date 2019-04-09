from keras.datasets import mnist
import numpy as np

import os
import sys
import numpy as np

from PIL import Image
from zipfile import ZipFile

#CONFIG
ARCHIVE_PATH = "../keras_model/celeba-dataset/img_align_celeba.zip"
NUM_OBSERVATIONS = 20000
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
    return data

def fetch_rnd_face():
    ix = np.random.choice(NUM_OBSERVATIONS, 1)[0]
    data = fetch_batch(ARCHIVE_PATH,IMG_WIDTH,IMG_HEIGHT,IMG_CHANNELS,ix,ix+1)
    print(data.shape)
    return data.tolist()

#TODO
def sort_faces_pc():
    order = []
    return order