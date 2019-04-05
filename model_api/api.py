from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from mnist_handlers import sort_pc, fetch_rnd_digit, load_data

print(__name__)
app = Flask(__name__,static_folder="",static_url_path='')
CORS(app)

@app.route('/')
@app.route('/index')
def index():
    return "hellp"

#========= Methods for mnist methods =========
@app.route('/<path:path>')
def fetch_model(path):
    print(path)
    #"/models/faces/autoencoder/test.json"
    return app.send_static_file(path)

@app.route('/api/mnist/fetch-digit',methods=["GET"])
def fetch_digit():
    digit = fetch_rnd_digit()
    return jsonify(digit)

@app.route('/api/mnist/fetch-pc-order',methods=["GET"])
def fetch_pc_order():
    digit = fetch_rnd_digit()
    return jsonify(digit)
