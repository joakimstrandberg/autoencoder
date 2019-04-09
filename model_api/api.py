from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from mnist_handlers import sort_pc, fetch_rnd_digit, load_data
from faces_handlers import fetch_rnd_face

from keras.models import Model, load_model
import numpy as np
import tensorflow as tf

#Mnist encoder
mnist_pc_order = [21,4,13,15,7,2,17,26,1,8,14,3,27,30,28,22,10,29,11,18,24,19,0,12,9,25,23,5,31,6,20,16]
mnist_encoder = None
mnist_data = None
graph = None

app = Flask(__name__,static_folder="",static_url_path='')
CORS(app)

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/<path:path>')
def fetch_model(path):
    return app.send_static_file(path)

#TODO: Add min max values for each principal component
#========= Methods for mnist methods =========
def load_mnist_encoder():
    global mnist_encoder 
    mnist_encoder = load_model("../keras_model/mnist_encoder.h5")
    mnist_encoder.compile(optimizer='adadelta', loss='binary_crossentropy')
    mnist_encoder.summary()
    global mnist_data
    mnist_data = np.load("./data/mnist_data.npy")

@app.route('/api/mnist/fetch-digit',methods=["GET"])
def fetch_digit():
    digit = fetch_rnd_digit(mnist_data)
    return jsonify(digit)

#Order should be saved in a global variable?
@app.route('/api/mnist/fetch-pc-order',methods=["GET"])
def fetch_pc_order():
    '''
    global graph
    data = np.load("./data/mnist_data.npy")
    print(data.shape)
    with graph.as_default():
        order = sort_pc(mnist_encoder,data)
    '''
    global mnist_pc_order
    return jsonify(mnist_pc_order)

#========= Methods for faces methods =========
@app.route('/api/mnist/fetch-face',methods=["GET"])
def fetch_face():
    face = fetch_rnd_face()
    return jsonify(face)

print(__name__)
if __name__ == "api":
    print("Starting server..")
    print("Loading mnist encoder...")
    load_mnist_encoder()
    graph = tf.get_default_graph()