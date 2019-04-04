var express=require('express');
var path=require('path');
const bodyParser = require("body-parser");
//const logger = require("morgan");

const API_PORT = 5000;
var app=express();
const router = express.Router();
/*app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));*/

//Allow cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/',(req,res) => {
    res.send('Hello World!');
});

//Make models directory accessable
app.use(express.static(path.join(__dirname, 'models')))

var server = app.listen(API_PORT,() => {
  console.log(`Server started at port: ${API_PORT}`);
});