const mongoose = require('mongoose');
const validator = require('validator')
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(mongoDB, { useNewUrlParser: true });