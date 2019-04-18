from faces_handlers import save_images
ARCHIVE_PATH = "../keras_model/celeba-dataset/img_align_celeba.zip"
WIDTH = 64
HEIGHT = 64
CHANNELS = 3

save_images(0,100,"data/faces/",ARCHIVE_PATH, shape=(WIDTH,HEIGHT,CHANNELS))