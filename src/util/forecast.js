const request = require('request'); // Importing the request module

// Defining the forecast function which takes latitude, longitude, and a callback function as parameters
const forecast = (lat, lon, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=50e09714886e14dafe34f5f115fbcbdd&query=' + lat + ',' + lon; // Weatherstack API URL with latitude and longitude as query parameters

    // Making a request to the Weatherstack API with the constructed URL
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined); // If there is an error, calling the callback function with an error message and undefined data
        } else if (body.error) {
            callback('Unable to find location', undefined); // If the API response contains an error property, calling the callback function with an error message and undefined data
        } else {
            callback(undefined, // If there is no error, calling the callback function with undefined error and a formatted string containing weather description and temperature data obtained from the API response
                body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out."
            );
        }
    });
};

module.exports = forecast; // Exporting the forecast function to be used in other parts of the code
