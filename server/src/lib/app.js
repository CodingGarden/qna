const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const configuration = require('@feathersjs/configuration');

require('dotenv').config();

const channels = require('./channels');
const services = require('../services');

const app = express(feathers());
// app.configure(express.rest());
app.configure(socketio());

app.configure(configuration());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join('public', 'favicon.ico')));
app.use('/', express.static('public'));

app.configure(services);
app.configure(channels);

app.use(express.notFound());
app.use(express.errorHandler());

module.exports = app;
