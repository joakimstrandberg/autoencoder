import * as tf from '@tensorflow/tfjs';

export default class Model {
    constructor(inputShape){
        this.autoencoder = null;
        this.encoder = null;
        this.decoder = null;
        this.inputShape = inputShape
    }

    loadModel(callback){
        tf.loadLayersModel('http://localhost:5000/autoencoder/model.json').then(res => {
            this.autoencoder = res;
        }).catch(err => {
            console.log(err);
        });
        //this.autoencoder = autoencoder;
        callback();
    }

    buildModel(){
        const latentSize = 100;
            const flatShape = this.inputShape[0]*this.inputShape[1];
            const input = tf.input({shape: [flatShape]});
            const encoded = tf.layers.dense({units: latentSize, activation: 'relu'});
            const decoded = tf.layers.dense({units: flatShape, activation: 'relu'});

            const autoencoder = tf.model({inputs: input, outputs: decoded.apply(encoded.apply(input))});
            /*
            const encoder = tf.model({inputs: input, outputs: encoded.apply(input)});
            
            const input_decoder = tf.input({shape: [latentSize]});
            const decoder = tf.model({inputs: input_decoder, outputs: autoencoder.getLayer("dense_Dense2").apply(input_decoder)});

            this.encoder = encoder;
            this.decoder = decoder;*/
            this.autoencoder = autoencoder;
            console.log(autoencoder.summary())
    }

    trainModel(x,callback){
        tf.tidy(() => {
            const x_train = tf.tensor(x,[x.length,x[0].length]);
            console.log(x_train.print())
            this.autoencoder.compile({optimizer: tf.train.adadelta(), loss: 'meanSquaredError'});
            this.autoencoder.fit(x_train,x_train, {
                batchSize: 128,
                epochs: 100
            }).then(res => {
                callback(res);
            }).catch(err => callback(err));
        })
        console.log(tf.memory());
    }

    predict(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor(x,[1,x.length]);
            x_tensor.print();
            var pred = this.autoencoder.predict(x_tensor);
            var arr = pred.dataSync();
            arr = Array.from(arr);
            return arr;
        })
        return d;
    }

}

