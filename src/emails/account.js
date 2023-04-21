const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pelumiisola87@gmail.com',
        pass: 'mhlanjtetwxvqvfz'
    }
});

const welcomeMail = (email, name) => {
    let mailOptions = {
        from: 'pelumiisola87@gmail.com',
        to: email,
        subject: 'Thanks for Joining in!',
        text: `Welcomr to the App, ${name}. Let me know how you get along with the app.`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const cancelMail = (email, name) => {
    let mailOptions = {
        from: 'pelumiisola87@gmail.com',
        to: email,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you sometime soon.`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { 
    welcomeMail,
    cancelMail
}