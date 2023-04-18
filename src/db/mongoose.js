const mongoose = require('mongoose');
const validator = require('validator')
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(mongoDB, { useNewUrlParser: true });

const User = mongoose.model('User', {
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const me = new User({
    name: 'Isola Pelumi',
    email: "Iso@gmail.com",
    age: 22
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('Error!', error)
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const task = new Task({
    description: 'Finish My NodeJs Course',
    completed: false
})

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
})