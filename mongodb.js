// Import the required dependencies
const { MongoClient, ObjectID} = require('mongodb')

// Connection URL and database name
const url = 'mongodb://127.0.0.1:27017'; // Change this to your MongoDB connection URL
const dbName = 'task-manger'; // Change this to your desired database name

// const id = new ObjectID()
// console.log(id)
// Create a new MongoClient instance with useUnifiedTopology option
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error){
        return console.log('Cant Connect!')
    }

    const db = client.db(dbName)

    // db.collection('user').findOne({
    //     _id: new ObjectID('643c8beb250dd3083857edca')
    // }, (error, res) => {
    //     if(error){
    //         return console.log(error)
    //     }

    //     console.log(res)
    // })


    // db.collection('user').find({
    //     age: 20
    // }).next((error, res) => {
    //     console.log(res)
    // })

//    db.collection('user').updateOne({
//         _id: new ObjectID('643c8beb250dd3083857edca')
//     }, {
//         $set:{
//             name: 'Boluwatife'
//         }
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

    // db.collection('user').updateMany({
    //     name: 'Isola Pelumi'
    // }, {
    //     $set:{
    //         name: 'Philtech'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log('error')
    // })


    db.collection('user').deleteMany({
        name: 'Philtech'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


    // db.collection('user').insertOne({
    //   name: 'Isola Taiwo',
    //   age: 19
    // }, (error, res) => {
    //     if(error){
    //         return console.log('Cant Inser data!')
    //     }
    //     console.log(res.ops)
    // })  


    // db.collection('user').insertMany([{
    //     name: 'Isola Pelumi',
    //     age: 22
    //   }, {
    //     name: 'Isola Pelumi',
    //     age: 24
    //   }], (error, res) => {
    //       if(error){
    //           return console.log('Cant Inser data!')
    //       }
    //       console.log(res.ops)
    //   })  
 })


  

