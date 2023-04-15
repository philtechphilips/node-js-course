const weatherForm = document.querySelector('form')
const state = document.querySelector('#state')
const country = document.querySelector('#country')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageOne.textContent = 'Loading..'
    messageTwo.textContent = ''
    fetch('http://127.0.0.1:3001/weather?state=' + state.value + '&country=' + country.value).then((response) => {
    response.json().then((data) => {
        if(data.error){
            return messageOne.textContent = data.error
        //    return console.log(data.error)
        }
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecast
    })
}) 
})