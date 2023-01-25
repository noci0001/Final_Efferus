const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// SIGNUP ROUTE
app.post('/signup', (req, res) => {
    const { email, lastName, firstName } = req.body;
    
    // Make sure fields are filled
    if(!email || !firstName || !lastName){
        res.redirect('/fail.html');
        return;
    }


    // construct req data
    const data = {
        members: [
            {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
}

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us21.api.mailchimp.com/3.0/lists/b4d33f1f17',
        method: 'POST',
        headers: {
            Authorization: 'auth 34ca37907a7731c69b47e65d4fe40dc9-us21'
        },
        body: postData
    }

    request(options, (err, response, body ) => {
        if(err){
            res.redirect('/fail.html');
        } else {
            if(response.statusCode == 200) {
                res.redirect('/success.html');
            } else {
                res.redirect('/fail.html');
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));