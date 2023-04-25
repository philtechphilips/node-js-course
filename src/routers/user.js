const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth') 
const Task = require('../models/task')
const multer = require('multer')
const sharp = require('sharp')
const { welcomeMail, cancelMail } = require('../emails/account')
const cors = require('cors');

router.use(cors());

router.use(cors({
    origin: '*'
  }));


// Endpoint for creating a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body) // Creating a new User instance using the request body
    try{
        await user.save() // Saving the user to the database
        welcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token}) // Sending a success response with the saved user object
    }catch (e){
        if (e.code === 11000) {
            res.status(422).json({ error: 'Email address is already taken' }); // sending an error response as JSON with the error message
        }else{
            res.status(400).send(e) // Sending an error response with the error object
        } 
    }
})


router.post('/users/login', async (req, res) => {
    try{
        if (!req.body.email || !req.body.password) {
            throw new Error('Email and password are required')
        }
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// Endpoint for getting all users
router.get('/users/me', auth, async (req, res) => {
   res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Endpoint for getting a specific user by ID
router.get('/users/:id', async (req, res) => {
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


router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // Get the keys (property names) from the request body
    const allowedUpdates = ['name', 'email', 'password', 'age'] // Define an array of allowed updates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // Check if all updates are allowed

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates!' }) // If any update is not allowed, send an error response
    }
    
    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        if(!user) {
            return res.status(404).send() // If user is not found, send a 404 response
        }

        res.send(user) // Send the updated user object as response
    }catch (e){
        res.status(400).send(e) // If any error occurs, send a 400 response with the error message
    }
})


router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) // Get the keys (property names) from the request body
    const allowedUpdates = ['name', 'email', 'password', 'age'] // Define an array of allowed updates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // Check if all updates are allowed

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates!' }) // If any update is not allowed, send an error response
    }
    
    try{

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user) // Send the updated user object as response
    }catch (e){
        res.status(400).send(e) // If any error occurs, send a 400 response with the error message
    }
})



// Express route for deleting a user by ID
router.delete('/user/:id', async (req, res) => {
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


// Express route for a user to delete his own account
router.delete('/users/me', auth, async (req, res) => {
    try {
        // Find and delete the user by ID using Mongoose's findByIdAndDelete method
        const user = await User.findOneAndDelete({_id: req.user._id})
        cancelMail(req.user.email, req.user.name)
        // If user is not found, send a 404 status and an empty response
        if (!user) {
            return res.status(404).send()
        }

        // If user is found and deleted successfully, delete all tasks belonging to the user
        await Task.deleteMany({ author: user._id });

        // If user is found and deleted successfully, send the deleted user object as response
        res.send(user)
    } catch (e) {
        // If an error occurs, send a 500 status and the error as response
        res.status(500).send(e)
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
       if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file!'))
       }
       cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router