from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from mnist_handlers import sort_pc, fetch_rnd_digit, load_data
<<<<<<< HEAD
from faces_handlers import fetch_rnd_img
=======
from faces_handlers import fetch_rnd_face
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4

from keras.models import Model, load_model
import numpy as np
import tensorflow as tf

from constants.constants import mnist_pc_order, mnist_min, mnist_max, mnist_step, faces_pc_order, faces_min, faces_max, faces_step

#====SETUP=====
mnist_data = None
print("Starting server..")
app = Flask(__name__,static_folder="",static_url_path='')
CORS(app)
<<<<<<< HEAD
=======
print("Loading mnist encoder...")
load_mnist_data()
#===============
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4

@app.route('/')
@app.route('/index')
def index():
    return "hello"

@app.route('/<path:path>')
def fetch_model(path):
    return app.send_static_file(path)

#========= Methods for mnist methods =========
def load_mnist_data():
    global mnist_data
<<<<<<< HEAD
    mnist_data = np.load("./data/mnist/mnist_data.npy")
=======
    mnist_data = np.load("./data/mnist_data.npy")
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4

@app.route('/api/mnist/fetch-pc-info',methods=["GET"])
def fetch_mnist_min_max_step():
    d = {}
    d["order"] = mnist_pc_order
    d["min"] = mnist_min
    d["max"] = mnist_max
    d["step"] = mnist_step
    return jsonify(d)

@app.route('/api/mnist/fetch-digit',methods=["GET"])
def fetch_digit():
    digit = fetch_rnd_digit(mnist_data)
    return jsonify(digit)

@app.route('/api/mnist/fetch-pc-order',methods=["GET"])
def fetch_pc_order():
    return jsonify(mnist_pc_order)

#========= Methods for faces methods =========
<<<<<<< HEAD
@app.route('/api/faces/fetch-face',methods=["GET"])
def fetch_face():
    face = fetch_rnd_img()
=======
@app.route('/api/mnist/fetch-face',methods=["GET"])
def fetch_face():
    face = fetch_rnd_face()
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4
    return jsonify(face)

@app.route('/api/faces/fetch-pc-info',methods=["GET"])
def fetch_faces_pc_info():
    d = {}
    d["order"] = faces_pc_order
    d["min"] = faces_min
    d["max"] = faces_max
    d["step"] = faces_step
<<<<<<< HEAD
    return jsonify(d)

#Load data into variable....
print("Loading mnist encoder...")
load_mnist_data()
#===============
=======
    return jsonify(d)
>>>>>>> 5641a9efb11c904bd6df05bd550a6f9d131cc9b4
