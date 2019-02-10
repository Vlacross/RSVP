const express = require('express')
const app = express.Router()

const mongoose = require('mongoose')

app.use(express.static('./views'))


app.get('/', function(req, res) {

});

app.get('/:id', function(req, res) {

});

app.post('/', function(req, res) {

});
app.put('/:id', function(req, res) {

});

app.delete('/:id', function(req, res) {

});

module.exports = app
