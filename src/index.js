const express = require('express')
require('./db/mongoose') // Importing the mongoose configuration
const User = require('./models/user') // Importing the User model
const Task = require('./models/task') // Importing the Task model

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Parsing incoming JSON data

// Endpoint for creating a new user
app.post('/users', async (req, res) => {
    const user = new User(req.body) // Creating a new User instance using the request body

    try{
        await user.save() // Saving the user to the database
        res.status(201).send(user) // Sending a success response with the saved user object
    }catch (e){
        res.status(400).send(e) // Sending an error response with the error object
    }
})

// Endpoint for getting all users
app.get('/users', async (req, res) => {
   try{
        const users =await User.find({}) // Fetching all users from the database
        res.send(users) // Sending the users as response
   }catch (e){
        res.status(500).send() // Sending an error response with status code 500
   }
})

// Endpoint for getting a specific user by ID
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id // Extracting the user ID from the request parameters

    try{
        const user = await User.findById(_id) // Fetching the user by ID from the database

        if(!user){
            return res.status(404).send() // If user not found, sending a not found response with status code 404
        }

        res.send(user) // Sending the user object as response
    } catch (e) {
        res.status(500).send() // Sending an error response with status code 500
    }
})


app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // Get the keys (property names) from the request body
    const allowedUpdates = ['name', 'email', 'password', 'age'] // Define an array of allowed updates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // Check if all updates are allowed

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates!' }) // If any update is not allowed, send an error response
    }
    
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // Find and update the user by ID, using the request parameters (ID) and request body (updates)
        // Set { new: true } to return the updated user object and { runValidators: true } to run model validators
    
        if(!user) {
            return res.status(404).send() // If user is not found, send a 404 response
        }

        res.send(user) // Send the updated user object as response
    }catch (e){
        res.status(400).send(e) // If any error occurs, send a 400 response with the error message
    }
})

// Express route for deleting a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        // Find and delete the user by ID using Mongoose's findByIdAndDelete method
        const user = await User.findByIdAndDelete(req.params.id)

        // If user is not found, send a 404 status and an empty response
        if (!user) {
            return res.status(404).send()
        }

        // If user is found and deleted successfully, send the deleted user object as response
        res.send(user)
    } catch (e) {
        // If an error occurs, send a 500 status and the error as response
        res.status(500).send(e)
    }
})


// Endpoint for creating a new task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body) // Creating a new Task instance using the request body

    try{
        await task.save() // Saving the task to the database
        res.status(201).send(task) // Sending a success response with the saved task object
    }catch (e){
        res.status(400).send(e) // Sending an error response with the error object
    }
})

// Endpoint for getting all tasks
app.get('/tasks', async (req, res) => {

    try{
        const tasks =await Task.find({}) // Fetching all tasks from the database
        res.send(tasks) // Sending the tasks as response
   }catch (e){
        res.status(500).send() // Sending an error response with status code 500
   }
})

// Endpoint for getting a specific task by ID
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id // Extracting the task ID from the request parameters

    try{
        const task = await Task.findById(_id) // Fetching the task by ID from the database

        if(!task){
            return res.status(404).send() // If task not found, sending a not found response with status code 404
        }

        res.send(task) // Sending the task object as response
    } catch (e) {
        res.status(500).send() // Sending an error response with status code 500
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body) // Get the keys (property names) from the request body
    const allowedUpdates = ['description', 'completed'] // Define an array of allowed updates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // Check if all updates are allowed

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates!' }) // If any update is not allowed, send an error response
    }
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // Find and update the user by ID, using the request parameters (ID) and request body (updates)
        // Set { new: true } to return the updated user object and { runValidators: true } to run model validators
    
        if(!task) {
            return res.status(404).send() // If user is not found, send a 404 response
        }

        res.send(task) // Send the updated user object as response
    }catch (e){
        res.status(400).send(e) // If any error occurs, send a 400 response with the error message
    }
})

// Express route for deleting a user by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        // Find and delete the user by ID using Mongoose's findByIdAndDelete method
        const task = await Task.findByIdAndDelete(req.params.id)

        // If user is not found, send a 404 status and an empty response
        if (!task) {
            return res.status(404).send()
        }

        // If user is found and deleted successfully, send the deleted user object as response
        res.send(task)
    } catch (e) {
        // If an error occurs, send a 500 status and the error as response
        res.status(500).send(e)
    }
})


app.listen(port, () => {
    console.log('Server started on port ' + port)
})