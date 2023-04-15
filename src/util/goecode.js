const request = require('request'); // Importing the request module

// Defining the geocode function which takes state, country, and a callback function as parameters
const geocode = (state, country, callback) => {
    const url = 'https://api.geoapify.com/v1/geocode/search?text=' + state + ' ' + country + '&apiKey=815ef87723864d50a2ab9d3c87fd01af'; // Geoapify API URL with state and country as query parameters

    // Making a request to the Geoapify API with the constructed URL
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            return callback('Unable to connect to weather service!', undefined); // If there is an error, calling the callback function with an error message and undefined data
        } else if (body && body.features && body.features.length > 1) {
            callback(undefined, { // If there is no error, calling the callback function with undefined error and an object containing latitude, longitude, and location data obtained from the API response
                'lon': body.features[1].properties.lon, // Extracting longitude from the API response
                'lat': body.features[1].properties.lat, // Extracting latitude from the API response
                'location': body.features[1].properties.name + ' ' + body.features[1].properties.state + ' ' + body.features[1].properties.county + ' ' + body.features[1].properties.country, // Extracting location name and country from the API response and combining them
            });
        } else {
            callback('Error fetching data!', undefined); // If there is an error in the API response, calling the callback function with an error message and undefined data
        }
    });
};

module.exports = geocode; // Exporting the geocode function to be used in other parts of the code
