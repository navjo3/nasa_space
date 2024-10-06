var express = require('express')
var app = express()

const port = process.env.port;

app.listen(port || 3000, () => console.log('listening at 3000'));

app.use(express.static('public'));


const API_key = process.env.API_key;