const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// Endpoint for creating a new task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body) 

    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try{
        await task.save() // Saving the task to the database
        res.status(201).send(task) // Sending a success response with the saved task object
    }catch (e){
        res.status(400).send(e) // Sending an error response with the error object
    }
})

// Endpoint for getting all tasks
router.get('/tasks', auth, async (req, res) => {

    try{
        const tasks =await Task.find({ author: req.user._id}) // Fetching all tasks from the database
        res.send(tasks) // Sending the tasks as response
   }catch (e){
        res.status(500).send() // Sending an error response with status code 500
   }
})

// Endpoint for getting a specific task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id // Extracting the task ID from the request parameters

    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, author: req.user._id})
        if(!task){
            return res.status(404).send() // If task not found, sending a not found response with status code 404
        }

        res.send(task) // Sending the task object as response
    } catch (e) {
        res.status(500).send() // Sending an error response with status code 500
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body) // Get the keys (property names) from the request body
    const allowedUpdates = ['description', 'completed'] // Define an array of allowed updates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // Check if all updates are allowed

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates!' }) // If any update is not allowed, send an error response
    }
    
    try{
        
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task) 
    }catch (e){
        res.status(400).send(e)
    }
})

// Express route for deleting a user by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // Find and delete the user by ID using Mongoose's findByIdAndDelete method
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})

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




module.exports = router