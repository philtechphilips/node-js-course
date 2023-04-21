const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./util/forecast')
const geocode = require('./util/goecode')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Isola Pelumi',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Isola Pelumi',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Isola Pelumi',
    })
})

app.get('/weather', (req, res) => {

    const state = req.query.state
    const country = req.query.country

    if(!state || !country){
        return res.send({
            error: 'Please State and Country is Required!'
        })
    }

    // Calling forecast function with latitude and longitude obtained from geocode, and providing a callback function to handle the response
    forecast(state, country, (error, forecastData) => {
      if (error) {
        return res.send({error})
      }
      console.log("Weather Data:", forecastData); // Printing weather data obtained from forecast
      res.send({
        forecast: forecastData,
        location: 'Weather Condition in: ' + state + ' ' + country
      })
    });
  });

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Isola Pelumi',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Isola Pelumi',
        errorMessage: 'Page not found.'
    })
})

app.listen(3001, () => {
    console.log('Server is up on port 3001.')
})