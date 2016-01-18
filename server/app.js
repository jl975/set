'use strict';

const path = require('path');

const express = require('express');
const app = express();
const port = process.env.PORT || '3000';


const io = require('./io');

const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

io.attach(server);



// Routes

app.use('/api', routes);

app.use(express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../src')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../src/views/index.html'));
})



