import * as tf from '@tensorflow/tfjs'
//import * as tf from '@tensorflow/tfjs-node-gpu'

export default class Model {
    constructor(){
        this.autoencoder = null;
        this.encoder = null;
        this.decoder = null;
        this.inputShape = null
    }

    getInputShape(){
        const arr = this.autoencoder.getLayer("input_1").batchInputShape.slice(1);
        this.inputShape = arr;
    }

    loadModel(path,callback){
        Promise.all([
            tf.loadLayersModel(path + 'autoencoder/model.json',{strict:true}).then(res => {
                this.autoencoder = res;
                this.getInputShape();
            }),
            tf.loadLayersModel(path + 'decoder/model.json',{strict:true}).then(res => {
                this.decoder = res;
            }),
            tf.loadLayersModel(path + 'encoder/model.json',{strict:true}).then(res => {
                this.encoder = res;
            })
        ]).then(() => {
            callback();
        }).catch(err => {
            console.log(err);
        });
    }

    deleteModel(){
        tf.disposeVariables();
    }

    predict(x){
        const d = tf.tidy(() => { 
            var shape = this.inputShape.slice();
            shape.unshift(1);
            const x_tensor= tf.tensor([x]);
            var pred = this.autoencoder.predict(x_tensor);
            var arr = pred.arraySync()[0];
            return arr;
        })
        return d;
    }

    predictEncoder(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor([x]);
            var pred = this.encoder.predict(x_tensor);
            var arr = pred.arraySync()[0];
            return arr;
        })
        return d;
    }

    predictDecoder(x){
        const d = tf.tidy(() => {  
            const x_tensor= tf.tensor(x,[1,x.length]);
            var pred = this.decoder.predict(x_tensor);
            var arr = pred.arraySync()[0];
            return arr;
        })
        return d;
    }

}

