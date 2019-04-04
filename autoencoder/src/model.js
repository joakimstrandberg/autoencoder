import * as tf from '@tensorflow/tfjs';

export default class Model {
    constructor(inputShape){
        this.autoencoder = null;
        this.encoder = null;
        this.decoder = null;
        this.inputShape = inputShape
    }

    //Make this a promise
    loadModel(path,callback){
        tf.loadLayersModel(path + 'autoencoder/model.json').then(res => {
            this.autoencoder = res;
        }).catch(err => {
            console.log(err);
        });
        tf.loadLayersModel(path + 'decoder/model.json').then(res => {
            this.decoder = res;
        }).catch(err => {
            console.log(err);
        });
        tf.loadLayersModel(path + 'encoder/model.json').then(res => {
            this.encoder = res;
        }).catch(err => {
            console.log(err);
        });
        callback();
    }

    trainModel(x,callback){
        tf.tidy(() => {
            const x_train = tf.tensor(x,[x.length,x[0].length]);
            this.autoencoder.compile({optimizer: tf.train.adadelta(), loss: 'meanSquaredError'});
            this.autoencoder.fit(x_train,x_train, {
                batchSize: 128,
                epochs: 100
            }).then(res => {
                callback(res);
            }).catch(err => callback(err));
        })
    }

    predict(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor(x,[1,x.length]);
            var pred = this.autoencoder.predict(x_tensor);
            var arr = pred.dataSync();
            arr = Array.from(arr);
            return arr;
        })
        return d;
    }

    predictEncoder(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor(x,[1,x.length]);
            var pred = this.encoder.predict(x_tensor);
            var arr = pred.dataSync();
            arr = Array.from(arr);
            return arr;
        })
        return d;
    }

    predictDecoder(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor(x,[1,x.length]);
            var pred = this.decoder.predict(x_tensor);
            var arr = pred.dataSync();
            arr = Array.from(arr);
            return arr;
        })
        return d;
    }

}

