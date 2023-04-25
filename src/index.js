const express = require('express')
require('./db/mongoose') // Importing the mongoose configuration
const User = require('./models/user') // Importing the User model
const Task = require('./models/task') // Importing the Task model
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT

app.use(express.json()) // Parsing incoming JSON data
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server started on port ' + port)
})

// Adding Image Support
// const multer = require('multer')
// const upload =  multer({
//     dest: 'images'
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })
const main = async () => {
    // Eloquent Relationship
    //     const task = await Task.findById('64414bacf8f402f48ec5c18b').populate('author');
    // console.log(task.author);

    // const user = await User.findById('64414a86ee2df2d9d68e1739').populate('tasks')
    // console.log(user.tasks)
}

main()
